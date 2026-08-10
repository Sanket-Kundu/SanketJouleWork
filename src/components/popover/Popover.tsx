import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useImperativeHandle,
  useMemo,
} from "react";
import { cn } from "../../lib/utils";

import { ResizeCornerIcon } from "../../icons/ResizeCorner";
import { Title } from "../title/Title";
import { addOpenedPopup, removeOpenedPopup } from "../../lib/popupRegistry";
import { isDesktop as detectIsDesktop } from "../../lib/Device";
import "./Popover.css";
import {
  PopoverProps,
  PopoverPlacement,
  PopoverHorizontalAlign,
  PopoverVerticalAlign,
  PopupAccessibleRole,
} from "../../types/popover";

// ── Constants ────────────────────────────────────────────────────────────────
const ARROW_DEPTH = 8;  // how far the arrow protrudes from the popover edge
const ARROW_BASE = 16;  // width of the arrow base along the popover edge
const ARROW_SIZE = ARROW_DEPTH; // gap between popover and opener
const VIEWPORT_MARGIN = 10;

// ── Internal enums (match UI5 Popover.ts) ────────────────────────────────────
enum ActualPlacement {
  Left = "Left",
  Right = "Right",
  Top = "Top",
  Bottom = "Bottom",
}

enum ActualHorizontalAlign {
  Center = "Center",
  Left = "Left",
  Right = "Right",
  Stretch = "Stretch",
}

type PopoverSize = { width: number; height: number };
type ArrowPosition = { x: number; y: number };
type CalculatedPlacement = {
  arrow: ArrowPosition;
  top: number;
  left: number;
  maxHeight: number;
  maxWidth: number;
  actualPlacement: ActualPlacement;
  stretchWidth?: string;
  stretchHeight?: string;
};


// ── Utility: clamp ───────────────────────────────────────────────────────────
function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max);
}

// ── Utility: focusable helpers ───────────────────────────────────────────────
const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFirstFocusable(container: HTMLElement): HTMLElement | null {
  for (const el of container.querySelectorAll<HTMLElement>(FOCUSABLE)) {
    if (el.dataset.focusTrap) continue;
    return el;
  }
  return null;
}

function getLastFocusable(container: HTMLElement): HTMLElement | null {
  const list = container.querySelectorAll<HTMLElement>(FOCUSABLE);
  for (let i = list.length - 1; i >= 0; i--) {
    if (list[i].dataset.focusTrap) continue;
    return list[i];
  }
  return null;
}

// ── Utility: resolve opener ──────────────────────────────────────────────────
function resolveOpener(opener: PopoverProps["opener"]): HTMLElement | null {
  if (!opener) return null;
  if (opener instanceof HTMLElement) return opener;
  if ("current" in opener) {
    const val = opener.current;
    if (!val) return null;
    if (val instanceof HTMLElement) return val;
    // Handle imperative-handle refs that expose nativeElement (e.g. ButtonRef)
    if (typeof val === "object" && "nativeElement" in val && (val as { nativeElement: HTMLElement | null }).nativeElement instanceof HTMLElement) {
      return (val as { nativeElement: HTMLElement }).nativeElement;
    }
  }
  return null;
}

// ── Utility: detect RTL ──────────────────────────────────────────────────────
function useIsRtl(ref?: React.RefObject<HTMLElement | null>) {
  const [isRtl, setIsRtl] = useState(false);
  useEffect(() => {
    const el = ref?.current ?? document.documentElement;
    const dir =
      el.closest("[dir]")?.getAttribute("dir") ??
      document.documentElement.getAttribute("dir");
    setIsRtl(dir === "rtl");
  });
  return isRtl;
}

// ── Utility: check if opener is clipped by an overflow ancestor ──────────────
function isOpenerClippedByAncestor(opener: HTMLElement): boolean {
  let parent = opener.parentElement;
  while (parent && parent !== document.documentElement) {
    // Stop walking at a top-layer popover boundary — elements inside an open
    // popover are rendered in the top layer and are not visually clipped by
    // ancestors' overflow settings.
    if (parent.hasAttribute("popover")) {
      try {
        if (parent.matches(":popover-open")) return false;
      } catch {
        // :popover-open not supported — fall through to overflow check
      }
    }

    const { overflow, overflowX, overflowY } = window.getComputedStyle(parent);
    const clips = [overflow, overflowX, overflowY].some(
      v => v === "hidden" || v === "scroll" || v === "auto"
    );
    if (clips) {
      const parentRect = parent.getBoundingClientRect();
      const openerRect = opener.getBoundingClientRect();
      if (
        openerRect.bottom <= parentRect.top ||
        openerRect.top >= parentRect.bottom ||
        openerRect.right <= parentRect.left ||
        openerRect.left >= parentRect.right
      ) {
        return true;
      }
    }
    parent = parent.parentElement;
  }
  return false;
}

// ── Positioning engine (ported from UI5 Popover.ts) ──────────────────────────

function getActualHorizontalAlign(
  align: `${PopoverHorizontalAlign}`,
  isRtl: boolean
): ActualHorizontalAlign {
  switch (align) {
    case PopoverHorizontalAlign.Start:
      return isRtl ? ActualHorizontalAlign.Right : ActualHorizontalAlign.Left;
    case PopoverHorizontalAlign.End:
      return isRtl ? ActualHorizontalAlign.Left : ActualHorizontalAlign.Right;
    case PopoverHorizontalAlign.Stretch:
      return ActualHorizontalAlign.Stretch;
    default:
      return ActualHorizontalAlign.Center;
  }
}

function fallbackPlacement(
  clientWidth: number,
  clientHeight: number,
  targetRect: DOMRect,
  popoverSize: PopoverSize
): ActualPlacement | undefined {
  if (targetRect.left > popoverSize.width) return ActualPlacement.Left;
  if (clientWidth - targetRect.right > targetRect.left) return ActualPlacement.Right;
  if (clientHeight - targetRect.bottom > popoverSize.height) return ActualPlacement.Bottom;
  if (clientHeight - targetRect.bottom < targetRect.top) return ActualPlacement.Top;
  return undefined;
}

function getActualPlacement(
  desiredPlacement: `${PopoverPlacement}`,
  isRtl: boolean,
  hideArrow: boolean,
  targetRect: DOMRect,
  popoverSize: PopoverSize
): ActualPlacement {
  let actual: ActualPlacement;
  switch (desiredPlacement) {
    case PopoverPlacement.Start:
      actual = isRtl ? ActualPlacement.Right : ActualPlacement.Left;
      break;
    case PopoverPlacement.End:
      actual = isRtl ? ActualPlacement.Left : ActualPlacement.Right;
      break;
    case PopoverPlacement.Top:
      actual = ActualPlacement.Top;
      break;
    case PopoverPlacement.Bottom:
      actual = ActualPlacement.Bottom;
      break;
    default:
      actual = isRtl ? ActualPlacement.Left : ActualPlacement.Right;
  }

  const clientWidth = document.documentElement.clientWidth;
  let clientHeight = document.documentElement.clientHeight;
  const isVertical =
    desiredPlacement === PopoverPlacement.Top ||
    desiredPlacement === PopoverPlacement.Bottom;
  let popoverHeight = popoverSize.height;
  if (isVertical) {
    popoverHeight += hideArrow ? 0 : ARROW_SIZE;
    clientHeight -= VIEWPORT_MARGIN;
  }

  switch (actual) {
    case ActualPlacement.Top:
      if (targetRect.top < popoverHeight && targetRect.top < clientHeight - targetRect.bottom)
        actual = ActualPlacement.Bottom;
      break;
    case ActualPlacement.Bottom:
      if (clientHeight - targetRect.bottom < popoverHeight && clientHeight - targetRect.bottom < targetRect.top)
        actual = ActualPlacement.Top;
      break;
    case ActualPlacement.Left:
      if (targetRect.left < popoverSize.width)
        actual = fallbackPlacement(clientWidth, clientHeight, targetRect, popoverSize) || actual;
      break;
    case ActualPlacement.Right:
      if (clientWidth - targetRect.right < popoverSize.width)
        actual = fallbackPlacement(clientWidth, clientHeight, targetRect, popoverSize) || actual;
      break;
  }
  return actual;
}

function calcPlacement(
  targetRect: DOMRect,
  popoverSize: PopoverSize,
  desiredPlacement: `${PopoverPlacement}`,
  horizontalAlign: `${PopoverHorizontalAlign}`,
  verticalAlign: `${PopoverVerticalAlign}`,
  isRtl: boolean,
  hideArrow: boolean,
  allowTargetOverlap: boolean,
  borderRadius: number,
  offset: number
): CalculatedPlacement {
  const clientWidth = document.documentElement.clientWidth;
  const clientHeight = document.documentElement.clientHeight;
  let maxHeight = clientHeight;
  let maxWidth = clientWidth;
  let stretchWidth: string | undefined;
  let stretchHeight: string | undefined;

  const actualPlacement = getActualPlacement(
    desiredPlacement, isRtl, hideArrow, targetRect, popoverSize
  );

  const isVertical =
    actualPlacement === ActualPlacement.Top ||
    actualPlacement === ActualPlacement.Bottom;

  // Stretch
  if (horizontalAlign === PopoverHorizontalAlign.Stretch && isVertical) {
    popoverSize = { ...popoverSize, width: targetRect.width };
    stretchWidth = `${targetRect.width}px`;
  } else if (verticalAlign === PopoverVerticalAlign.Stretch && !isVertical) {
    popoverSize = { ...popoverSize, height: targetRect.height };
    stretchHeight = `${targetRect.height}px`;
  }

  const arrowOffset = (hideArrow ? 0 : ARROW_SIZE) + offset;
  const actualHAlign = getActualHorizontalAlign(horizontalAlign, isRtl);

  // getVerticalLeft
  const getVerticalLeft = (): number => {
    switch (actualHAlign) {
      case ActualHorizontalAlign.Center:
      case ActualHorizontalAlign.Stretch:
        return targetRect.left - (popoverSize.width - targetRect.width) / 2;
      case ActualHorizontalAlign.Left:
        return targetRect.left;
      case ActualHorizontalAlign.Right:
        return targetRect.right - popoverSize.width;
      default:
        return VIEWPORT_MARGIN;
    }
  };

  // getHorizontalTop
  const getHorizontalTop = (): number => {
    switch (verticalAlign) {
      case PopoverVerticalAlign.Center:
      case PopoverVerticalAlign.Stretch:
        return targetRect.top - (popoverSize.height - targetRect.height) / 2;
      case PopoverVerticalAlign.Top:
        return targetRect.top;
      case PopoverVerticalAlign.Bottom:
        return targetRect.bottom - popoverSize.height;
      default:
        return 0;
    }
  };

  let left = VIEWPORT_MARGIN;
  let top = 0;

  switch (actualPlacement) {
    case ActualPlacement.Top:
      left = getVerticalLeft();
      top = Math.max(targetRect.top - popoverSize.height - arrowOffset, 0);
      if (!allowTargetOverlap) maxHeight = targetRect.top - arrowOffset;
      break;
    case ActualPlacement.Bottom:
      left = getVerticalLeft();
      top = targetRect.bottom + arrowOffset;
      if (allowTargetOverlap) {
        top = Math.max(Math.min(top, clientHeight - popoverSize.height), 0);
      } else {
        maxHeight = clientHeight - targetRect.bottom - arrowOffset;
      }
      break;
    case ActualPlacement.Left:
      left = Math.max(targetRect.left - popoverSize.width - arrowOffset, 0);
      top = getHorizontalTop();
      if (!allowTargetOverlap) maxWidth = targetRect.left - arrowOffset;
      break;
    case ActualPlacement.Right:
      left = targetRect.left + targetRect.width + arrowOffset;
      top = getHorizontalTop();
      if (allowTargetOverlap) {
        left = Math.max(Math.min(left, clientWidth - popoverSize.width), 0);
      } else {
        maxWidth = clientWidth - targetRect.right - arrowOffset;
      }
      break;
  }

  // Clamp to viewport
  if (isVertical) {
    if (popoverSize.width > clientWidth || left < VIEWPORT_MARGIN) {
      left = VIEWPORT_MARGIN;
    } else if (left + popoverSize.width > clientWidth - VIEWPORT_MARGIN) {
      left = clientWidth - VIEWPORT_MARGIN - popoverSize.width;
    }
  } else {
    if (popoverSize.height > clientHeight || top < VIEWPORT_MARGIN) {
      top = VIEWPORT_MARGIN;
    } else if (top + popoverSize.height > clientHeight - VIEWPORT_MARGIN) {
      top = clientHeight - VIEWPORT_MARGIN - popoverSize.height;
    }
  }

  left = Math.round(left);
  top = Math.round(top);
  maxHeight = Math.round(maxHeight - VIEWPORT_MARGIN);
  maxWidth = Math.round(maxWidth - VIEWPORT_MARGIN);

  // Arrow position
  let arrowXCentered =
    actualHAlign === ActualHorizontalAlign.Center ||
    actualHAlign === ActualHorizontalAlign.Stretch;
  if (actualHAlign === ActualHorizontalAlign.Right && left <= targetRect.left)
    arrowXCentered = true;
  if (actualHAlign === ActualHorizontalAlign.Left && left + popoverSize.width >= targetRect.left + targetRect.width)
    arrowXCentered = true;

  let arrowTranslateX = 0;
  if (isVertical && arrowXCentered) {
    arrowTranslateX = targetRect.left + targetRect.width / 2 - left - popoverSize.width / 2;
  }
  let arrowTranslateY = 0;
  if (!isVertical) {
    arrowTranslateY = targetRect.top + targetRect.height / 2 - top - popoverSize.height / 2;
  }

  const safeY = popoverSize.height / 2 - borderRadius - ARROW_BASE / 2 - 2;
  arrowTranslateY = clamp(arrowTranslateY, -safeY, safeY);
  const safeX = popoverSize.width / 2 - borderRadius - ARROW_BASE / 2 - 2;
  arrowTranslateX = clamp(arrowTranslateX, -safeX, safeX);

  return {
    arrow: { x: Math.round(arrowTranslateX), y: Math.round(arrowTranslateY) },
    top,
    left,
    maxHeight,
    maxWidth,
    actualPlacement,
    stretchWidth,
    stretchHeight,
  };
}

// ── Resize handle corner (faithful port from UI5 PopoverResize.ts) ───────────
function getResizeHandleCorner(
  popoverRect: DOMRect,
  openerRect: DOMRect,
  side: ActualPlacement,
  verticalAlign: `${PopoverVerticalAlign}`,
  actualHAlign: ActualHorizontalAlign,
  isRtl: boolean
): "top-left" | "top-right" | "bottom-left" | "bottom-right" {
  const offset = 2;

  let openerCX = Math.floor(openerRect.x + openerRect.width / 2);
  const openerCY = Math.floor(openerRect.y + openerRect.height / 2);
  let popoverCX = Math.floor(popoverRect.x + popoverRect.width / 2);
  const popoverCY = Math.floor(popoverRect.y + popoverRect.height / 2);

  const isPopoverWider = popoverRect.width > openerRect.width;
  const isPopoverTaller = popoverRect.height > openerRect.height;

  if (isRtl) {
    openerCX = -openerCX;
    popoverCX = -popoverCX;
  }

  switch (side) {
    case ActualPlacement.Left:
      if (isPopoverTaller) {
        return popoverCY > openerCY + offset ? "bottom-left" : "top-left";
      }
      return verticalAlign === PopoverVerticalAlign.Top ? "bottom-left" : "top-left";

    case ActualPlacement.Right:
      if (isPopoverTaller) {
        return popoverCY + offset < openerCY ? "top-right" : "bottom-right";
      }
      return verticalAlign === PopoverVerticalAlign.Bottom ? "top-right" : "bottom-right";

    case ActualPlacement.Bottom:
      if (isPopoverWider) {
        if (popoverCX + offset < openerCX) {
          return isRtl ? "bottom-right" : "bottom-left";
        }
        return isRtl ? "bottom-left" : "bottom-right";
      }
      if (isRtl) {
        return actualHAlign === ActualHorizontalAlign.Left ? "bottom-right" : "bottom-left";
      }
      return actualHAlign === ActualHorizontalAlign.Right ? "bottom-left" : "bottom-right";

    case ActualPlacement.Top:
    default:
      if (isPopoverWider) {
        if (popoverCX + offset < openerCX) {
          return isRtl ? "top-right" : "top-left";
        }
        return isRtl ? "top-left" : "top-right";
      }
      if (isRtl) {
        return actualHAlign === ActualHorizontalAlign.Left ? "top-right" : "top-left";
      }
      return actualHAlign === ActualHorizontalAlign.Right ? "top-left" : "top-right";
  }
}

// ── Component ────────────────────────────────────────────────────────────────

/**
 * Popover component
 *
 * A positioned overlay anchored to an opener element.
 * Ported from UI5 Web Components Popover positioning engine.
 *
 * @example
 * ```tsx
 * <Button ref={btnRef} onClick={() => setOpen(true)}>Open</Button>
 * <Popover opener={btnRef} open={open} headerText="Title" onClose={() => setOpen(false)}>
 *   <p>Content</p>
 * </Popover>
 * ```
 */
export function Popover(
    {
      headerText,
      placement = PopoverPlacement.End,
      horizontalAlign = PopoverHorizontalAlign.Center,
      verticalAlign = PopoverVerticalAlign.Center,
      hideArrow = false,
      offset: offsetProp,
      allowTargetOverlap = false,
      resizable = false,
      noPadding = false,
      hideHeaderBorder = false,
      hideFooterBorder = false,
      opener,
      open = false,
      initialFocus,
      preventFocusRestore = false,
      preventInitialFocus = false,
      accessibleName,
      accessibleNameRef,
      accessibleRole = PopupAccessibleRole.Dialog,
      accessibleDescription,
      header,
      footer,
      children,
      onBeforeOpen,
      onOpen,
      onBeforeClose,
      onClose,
      isInsidePopup,
      className,
      style,
      id,
      ref,
      "data-testid": dataTestId,
    }: PopoverProps
  ) {
    const popoverRef = useRef<HTMLDivElement>(null);
    const arrowRef = useRef<HTMLDivElement>(null);
    const focusedBeforeOpen = useRef<HTMLElement | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    // Position state
    const [pos, setPos] = useState<CalculatedPlacement | null>(null);

    // Resize
    const [resizeSize, setResizeSize] = useState<{ width?: number; height?: number } | null>(null);
    const resizeState = useRef<{
      startX: number; startY: number; startWidth: number; startHeight: number; corner: string;
    } | null>(null);

    // Desktop check (device-capability, evaluated once)
    const [isDesktop] = useState(() => detectIsDesktop());

    // RTL
    const containerRef = useRef<HTMLDivElement>(null);
    const isRtl = useIsRtl(containerRef);

    // Opener resolver
    const getOpenerEl = useCallback(() => resolveOpener(opener), [opener]);

    // Close ref (to avoid circular deps between reposition/registry and doClose)
    const doCloseRef = useRef<(escPressed?: boolean) => void>(() => {});

    // ── Reposition logic ────────────────────────────────────────────────────
    const reposition = useCallback(() => {
      const openerEl = getOpenerEl();
      const popEl = popoverRef.current;
      if (!openerEl || !popEl) return;

      const targetRect = openerEl.getBoundingClientRect();

      // Close if opener is outside viewport (scrolled away)
      if (targetRect.bottom < 0 || targetRect.top > window.innerHeight ||
          targetRect.right < 0 || targetRect.left > window.innerWidth) {
        doCloseRef.current();
        return;
      }

      // Close if opener is fully hidden (removed from DOM — all rect values 0)
      if (targetRect.top === 0 && targetRect.bottom === 0 &&
          targetRect.left === 0 && targetRect.right === 0) {
        doCloseRef.current();
        return;
      }

      // Close if opener has scrolled into an ancestor's overflow-clipped area
      if (isOpenerClippedByAncestor(openerEl)) {
        doCloseRef.current();
        return;
      }

      const rect = popEl.getBoundingClientRect();
      const popoverSize: PopoverSize = { width: rect.width, height: rect.height };
      if (popoverSize.width === 0 || popoverSize.height === 0) return;

      const borderRadius = Number.parseInt(
        window.getComputedStyle(popEl).getPropertyValue("border-radius") || "0"
      );

      const result = calcPlacement(
        targetRect, popoverSize,
        placement, horizontalAlign, verticalAlign,
        isRtl, hideArrow, allowTargetOverlap, borderRadius,
        offsetProp ?? 0
      );
      setPos(result);
    }, [getOpenerEl, placement, horizontalAlign, verticalAlign, isRtl, hideArrow, allowTargetOverlap, offsetProp]);

    // Reposition on open + on scroll/resize
    useEffect(() => {
      if (!isOpen) return;

      // Initial position after first paint
      const raf = requestAnimationFrame(() => {
        reposition();
        // Second frame to account for popover size being 0 on first render
        requestAnimationFrame(reposition);
      });

      const onScrollResize = () => reposition();
      window.addEventListener("scroll", onScrollResize, true);
      window.addEventListener("resize", onScrollResize);

      // ResizeObserver on opener
      const openerEl = getOpenerEl();
      let ro: ResizeObserver | null = null;
      if (openerEl instanceof Element) {
        ro = new ResizeObserver(reposition);
        ro.observe(openerEl);
      }

      // ResizeObserver on popover itself
      let roPopover: ResizeObserver | null = null;
      if (popoverRef.current instanceof Element) {
        roPopover = new ResizeObserver(reposition);
        roPopover.observe(popoverRef.current);
      }

      return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("scroll", onScrollResize, true);
        window.removeEventListener("resize", onScrollResize);
        ro?.disconnect();
        roPopover?.disconnect();
      };
    }, [isOpen, reposition, getOpenerEl]);

    // ── Open / Close ────────────────────────────────────────────────────────
    const doOpen = useCallback(() => {
      if (isOpen) return;
      if (onBeforeOpen?.() === false) return;
      focusedBeforeOpen.current = document.activeElement as HTMLElement | null;
      setIsOpen(true);
    }, [isOpen, onBeforeOpen]);

    const doClose = useCallback(
      (escPressed = false) => {
        if (!isOpen) return;
        if (onBeforeClose?.({ escPressed }) === false) return;

        // Hide from top layer
        const el = popoverRef.current;
        if (el && el.matches(':popover-open')) {
          el.hidePopover();
        }

        setIsOpen(false);
        setResizeSize(null);
        setPos(null);
        if (!preventFocusRestore && focusedBeforeOpen.current) {
          focusedBeforeOpen.current.focus();
          focusedBeforeOpen.current = null;
        }
        onClose?.();
      },
      [isOpen, onBeforeClose, onClose, preventFocusRestore]
    );

    // Keep close ref in sync for reposition callback
    doCloseRef.current = doClose;

    // Sync `open` prop
    useEffect(() => {
      if (open) doOpen();
      else if (isOpen) doClose();
    }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

    // Promote to top layer via native Popover API
    useEffect(() => {
      const el = popoverRef.current;
      if (!el) return;

      if (isOpen && !el.matches(':popover-open')) {
        el.showPopover();
      }

      // Cleanup: hide from top layer on unmount
      return () => {
        if (el.matches(':popover-open')) {
          el.hidePopover();
        }
      };
    }, [isOpen]);

    // Focus on open
    useEffect(() => {
      if (!isOpen) return;
      requestAnimationFrame(() => {
        if (preventInitialFocus || !popoverRef.current) return;
        if (initialFocus) {
          const el = document.getElementById(initialFocus);
          if (el) { el.focus(); onOpen?.(); return; }
        }
        const first = getFirstFocusable(popoverRef.current);
        if (first) first.focus();
        else popoverRef.current.focus();
        onOpen?.();
      });
    }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

    // Register / unregister in global popup registry (handles Escape + click-outside)
    useEffect(() => {
      if (!isOpen || !popoverRef.current) return;
      const el = popoverRef.current;
      addOpenedPopup({
        element: el,
        close: (escPressed?: boolean) => doCloseRef.current(escPressed),
        type: "popover",
        isModal: false,
        getOpenerEl,
        isInsidePopup,
      });
      return () => removeOpenedPopup(el);
    }, [isOpen, getOpenerEl, isInsidePopup]);

    // ── Focus trapping ──────────────────────────────────────────────────────
    const focusFirst = useCallback(() => {
      if (!popoverRef.current) return;
      const el = getFirstFocusable(popoverRef.current);
      (el || popoverRef.current).focus();
    }, []);

    const focusLast = useCallback(() => {
      if (!popoverRef.current) return;
      const el = getLastFocusable(popoverRef.current);
      (el || popoverRef.current).focus();
    }, []);

    // ── Resize ──────────────────────────────────────────────────────────────
    const handleResizeMouseDown = useCallback(
      (e: React.MouseEvent) => {
        if (!resizable || !popoverRef.current) return;
        e.preventDefault();
        const rect = popoverRef.current.getBoundingClientRect();
        const openerEl = getOpenerEl();
        const opRect = openerEl?.getBoundingClientRect();
        const corner = opRect && pos
          ? getResizeHandleCorner(rect, opRect, pos.actualPlacement,
              verticalAlign, getActualHorizontalAlign(horizontalAlign, isRtl), isRtl)
          : "bottom-right";

        resizeState.current = {
          startX: e.clientX, startY: e.clientY,
          startWidth: rect.width, startHeight: rect.height, corner,
        };

        const onMove = (ev: MouseEvent) => {
          if (!resizeState.current) return;
          const { startX, startY, startWidth, startHeight, corner: c } = resizeState.current;
          const dx = ev.clientX - startX;
          const dy = ev.clientY - startY;
          const isL = c === "top-left" || c === "bottom-left";
          const isT = c === "top-left" || c === "top-right";
          const w = clamp(startWidth + (isL ? -dx : dx), 150, window.innerWidth - VIEWPORT_MARGIN * 2);
          const h = clamp(startHeight + (isT ? -dy : dy), 100, window.innerHeight - VIEWPORT_MARGIN * 2);
          setResizeSize({ width: w, height: h });
        };
        const onUp = () => {
          resizeState.current = null;
          window.removeEventListener("mousemove", onMove);
          window.removeEventListener("mouseup", onUp);
        };
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
      },
      [resizable, getOpenerEl, pos]
    );

    // ── Imperative handle ───────────────────────────────────────────────────
    useImperativeHandle(ref, () => ({
      open() { doOpen(); },
      close() { doClose(); },
      async applyFocus() {
        if (!popoverRef.current) return;
        const el = getFirstFocusable(popoverRef.current);
        (el || popoverRef.current).focus();
      },
      isOpen() { return isOpen; },
      get nativeElement() { return popoverRef.current; },
    }), [isOpen, doOpen, doClose]);

    // ── Resize handle corner (unconditional for rules-of-hooks) ─────────────
    const resizeHandleCorner = useMemo(() => {
      if (!resizable || !isDesktop || !popoverRef.current || !pos) return "bottom-right";
      const openerEl = getOpenerEl();
      if (!openerEl) return "bottom-right";
      return getResizeHandleCorner(
        popoverRef.current.getBoundingClientRect(),
        openerEl.getBoundingClientRect(),
        pos.actualPlacement,
        verticalAlign,
        getActualHorizontalAlign(horizontalAlign, isRtl),
        isRtl
      );
    }, [resizable, isDesktop, getOpenerEl, pos, verticalAlign, horizontalAlign, isRtl]);

    // ── Derived values for render ───────────────────────────────────────────
    const role =
      accessibleRole === PopupAccessibleRole.None ? undefined
      : accessibleRole === PopupAccessibleRole.AlertDialog ? "alertdialog"
      : "dialog";
    const ariaModal = accessibleRole === PopupAccessibleRole.None ? undefined : "true";
    const displayHeader = !!(header || headerText);
    const actualPlacement = pos?.actualPlacement ?? ActualPlacement.Right;

    const resizeHandleClasses: Record<string, string> = {
      "top-left": "-top-2 -left-2 cursor-nw-resize",
      "top-right": "-top-2 -right-2 cursor-ne-resize",
      "bottom-left": "-bottom-2 -left-2 cursor-ne-resize",
      "bottom-right": "-bottom-2 -right-2 cursor-nw-resize",
    };

    const resizeIconRotation: Record<string, string> = {
      "top-left": "180deg",
      "top-right": "270deg",
      "bottom-left": "90deg",
      "bottom-right": "0deg",
    };

    // ── Render ──────────────────────────────────────────────────────────────
    if (!isOpen) {
      return <div ref={containerRef} className="hidden" />;
    }

    const popoverStyle: React.CSSProperties = {
      position: "fixed",
      top: pos ? pos.top : -10000,
      left: pos ? pos.left : -10000,
      maxHeight: pos ? pos.maxHeight : undefined,
      maxWidth: pos ? pos.maxWidth : undefined,
      boxShadow: "0px 10px 15px -5px rgba(10, 10, 10, 0.15), 0px 5px 5px -2px rgba(10, 10, 10, 0.05)",
      ...(pos?.stretchWidth ? { width: pos.stretchWidth } : {}),
      ...(pos?.stretchHeight ? { height: pos.stretchHeight } : {}),
      ...style,
      ...(resizeSize ? { width: resizeSize.width, height: resizeSize.height } : {}),
    };

    return (
      <>
        <div ref={containerRef} className="hidden" />

        {/* Popover */}
        <div
          ref={popoverRef}
          id={id}
          popover="manual"
          role={role}
          aria-modal={ariaModal as "true" | undefined}
          aria-label={accessibleName}
          aria-labelledby={
            accessibleNameRef || (!accessibleName && headerText ? `${id || "popover"}-title` : undefined)
          }
          aria-describedby={
            accessibleDescription ? `${id || "popover"}-desc` : undefined
          }
          tabIndex={-1}
          className={cn(
            "rounded-lg border border-border bg-popover text-popover-foreground outline-none",
            className
          )}
          style={popoverStyle}
          data-testid={dataTestId}
        >
          {/* Focus sentinel start */}
          <span tabIndex={0} onFocus={focusLast} data-focus-trap="true" className="sr-only" role="none" />

          {/* Arrow (SVG triangle) */}
          {!hideArrow && pos && (() => {
            const arrowBorderColor = "var(--border)";
            const arrowFill = "var(--popover)";

            // Build SVG triangle per placement.
            // Uses a filled polygon (no stroke) for the fill, then a path
            // for only the two outer edges — the base side against the
            // popover body is left open so the arrow merges seamlessly.
            let svgWidth: number;
            let svgHeight: number;
            let fillPoints: string;
            let strokePath: string;
            const wrapperStyle: React.CSSProperties = { position: "absolute", lineHeight: 0 };

            switch (actualPlacement) {
              case ActualPlacement.Bottom:
                // Arrow above popover, pointing up
                svgWidth = ARROW_BASE;
                svgHeight = ARROW_DEPTH;
                fillPoints = `0,${ARROW_DEPTH} ${ARROW_BASE / 2},0 ${ARROW_BASE},${ARROW_DEPTH}`;
                strokePath = `M0,${ARROW_DEPTH} L${ARROW_BASE / 2},0 L${ARROW_BASE},${ARROW_DEPTH}`;
                wrapperStyle.left = "50%";
                wrapperStyle.top = -ARROW_DEPTH;
                wrapperStyle.transform = `translateX(calc(-50% + ${pos.arrow.x}px))`;
                break;
              case ActualPlacement.Top:
                // Arrow below popover, pointing down
                svgWidth = ARROW_BASE;
                svgHeight = ARROW_DEPTH;
                fillPoints = `0,0 ${ARROW_BASE / 2},${ARROW_DEPTH} ${ARROW_BASE},0`;
                strokePath = `M0,0 L${ARROW_BASE / 2},${ARROW_DEPTH} L${ARROW_BASE},0`;
                wrapperStyle.left = "50%";
                wrapperStyle.bottom = -ARROW_DEPTH;
                wrapperStyle.transform = `translateX(calc(-50% + ${pos.arrow.x}px))`;
                break;
              case ActualPlacement.Right:
                // Arrow to the left of popover, pointing left
                svgWidth = ARROW_DEPTH;
                svgHeight = ARROW_BASE;
                fillPoints = `${ARROW_DEPTH},0 0,${ARROW_BASE / 2} ${ARROW_DEPTH},${ARROW_BASE}`;
                strokePath = `M${ARROW_DEPTH},0 L0,${ARROW_BASE / 2} L${ARROW_DEPTH},${ARROW_BASE}`;
                wrapperStyle.top = "50%";
                wrapperStyle.left = -ARROW_DEPTH;
                wrapperStyle.transform = `translateY(calc(-50% + ${pos.arrow.y}px))`;
                break;
              case ActualPlacement.Left:
              default:
                // Arrow to the right of popover, pointing right
                svgWidth = ARROW_DEPTH;
                svgHeight = ARROW_BASE;
                fillPoints = `0,0 ${ARROW_DEPTH},${ARROW_BASE / 2} 0,${ARROW_BASE}`;
                strokePath = `M0,0 L${ARROW_DEPTH},${ARROW_BASE / 2} L0,${ARROW_BASE}`;
                wrapperStyle.top = "50%";
                wrapperStyle.right = -ARROW_DEPTH;
                wrapperStyle.transform = `translateY(calc(-50% + ${pos.arrow.y}px))`;
                break;
            }

            return (
              <div ref={arrowRef} style={wrapperStyle}>
                <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ display: "block" }}>
                  <polygon points={fillPoints} fill={arrowFill} stroke="none" />
                  <path d={strokePath} fill="none" stroke={arrowBorderColor} strokeWidth={1} />
                </svg>
              </div>
            );
          })()}

          {/* Inner container — isolate stacking context so content sits above the arrow */}
          <div className="isolate z-1 flex flex-col gap-sapphire-2xs overflow-hidden rounded-lg w-full" style={{ maxHeight: "inherit", height: "inherit" }}>
            {/* Header */}
            {displayHeader && (
              <header
                className={cn(
                  "shrink-0",
                  // When custom header is provided, let it control its own styling.
                  // When using headerText, apply default popover header styling.
                  !header && "px-sapphire-s py-sapphire-xs",
                  !header && !hideHeaderBorder && "border-b border-sapphire-border-primary"
                )}
              >
                {header || <Title level="H1" id={`${id || "popover"}-title`} className="text-base font-bold">{headerText}</Title>}
              </header>
            )}

            {/* Content */}
            <div className={cn("overflow-y-auto overflow-x-hidden flex-1 min-h-0", !noPadding && "px-sapphire-s py-sapphire-xs")}>{children}</div>

            {/* Accessible description */}
            {accessibleDescription && (
              <span id={`${id || "popover"}-desc`} className="sr-only">{accessibleDescription}</span>
            )}

            {/* Footer */}
            {footer && <footer className={cn("flex items-center justify-end gap-2 px-sapphire-s py-sapphire-xs shrink-0", !hideFooterBorder && "border-t border-sapphire-border-primary")}>{footer}</footer>}
          </div>

          {/* Resize handle */}
          {resizable && isDesktop && (
            <div
              className={cn(
                "absolute flex items-center justify-center w-6 h-6 rounded-full z-[1]",
                resizeHandleClasses[resizeHandleCorner]
              )}
              onMouseDown={handleResizeMouseDown}
            >
              <ResizeCornerIcon
                className="h-4 w-4 text-sapphire-text-tertiary"
                style={{ transform: `rotate(${resizeIconRotation[resizeHandleCorner]})` }}
              />
            </div>
          )}

          {/* Focus sentinel end */}
          <span tabIndex={0} onFocus={focusFirst} data-focus-trap="true" className="sr-only" role="none" />
        </div>
      </>
    );
  }
