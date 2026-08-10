// components/dialog/Dialog.tsx - Native <dialog> implementation

import * as React from "react";
import { cn, cva, subTestId } from "../../lib/utils";
import { MessageErrorIcon } from "../../icons/MessageError";
import { MessageSuccessIcon } from "../../icons/MessageSuccess";
import { MessageWarningIcon } from "../../icons/MessageWarning";
import { MessageInformationIcon } from "../../icons/MessageInformation";
import { ArrowLeftIcon } from "../../icons/ArrowLeft";
import { dialogStack } from "../../lib/dialogStack";
import { addOpenedPopup, removeOpenedPopup } from "../../lib/popupRegistry";
import { findFirstFocusableElement } from "../../lib/focusUtils";
import { isPhone } from "../../lib/Device";
import { Button } from "../button/Button";
import { Title } from "../title/Title";
import { ResizeCornerIcon } from "../../icons/ResizeCorner";

/** Reactive hook — re-evaluates on resize/orientation change */
function useIsPhone(): boolean {
  const [phone, setPhone] = React.useState(() => isPhone());
  React.useEffect(() => {
    const handler = () => setPhone(isPhone());
    window.addEventListener("resize", handler);
    window.addEventListener("orientationchange", handler);
    return () => {
      window.removeEventListener("resize", handler);
      window.removeEventListener("orientationchange", handler);
    };
  }, []);
  return phone;
}
import {
  DialogState,
  type DialogProps,
  type DialogBeforeOpenDetail,
  type DialogBeforeCloseDetail,
  type DialogAfterCloseDetail,
} from "../../types/dialog";
import "./Dialog.css";

const dialogVariants = cva(
  [
    "relative flex flex-col",
    "bg-sapphire-card-bg-primary rounded-2xl",
    "shadow-[0_20px_25px_-5px_rgba(10,10,10,0.15),0_10px_15px_-5px_rgba(10,10,10,0.05)]",
    "min-w-[320px] max-w-[554px]",
    "max-h-[90vh]",
    "outline-none",
    "p-0 m-0",
    "border border-border",
  ],
  {
    variants: {
      state: {
        [DialogState.None]: "",
        [DialogState.Error]: "",
        [DialogState.Warning]: "",
        [DialogState.Success]: "",
        [DialogState.Information]: "",
      },
      stretch: {
        // Desktop stretch: ~90% viewport, no rounding. Phone full-screen handled via JS (isPhone()).
        true: "max-w-[95vw] h-[90vh] w-[90%]",
        false: "",
      },
      resizable: {
        true: "overflow-hidden max-w-[95vw] max-h-[95vh]",
        false: "",
      },
    },
    defaultVariants: {
      state: DialogState.None,
      stretch: false,
      resizable: false,
    },
  }
);

const headerVariants = cva(
  [
    "flex items-center justify-between",
    "px-6 py-5",
    "shrink-0",
    "focus:outline-none focus:rounded-t-2xl focus:[box-shadow:inset_0_0_0_4px_white,inset_0_0_0_6px_var(--ring)]",
  ],
  {
    variants: {
      state: {
        [DialogState.None]: "border-sapphire-border-primary",
        [DialogState.Error]: "bg-sapphire-negative-bg border-sapphire-negative",
        [DialogState.Warning]: "bg-sapphire-warning-bg border-sapphire-warning",
        [DialogState.Success]: "bg-sapphire-positive-bg border-sapphire-positive",
        [DialogState.Information]: "bg-sapphire-info-bg border-sapphire-info",
      },
      draggable: {
        true: "cursor-move select-none",
        false: "",
      },
    },
    defaultVariants: {
      state: DialogState.None,
      draggable: false,
    },
  }
);

/**
 * Dialog component - Native <dialog> element with Popover API
 *
 * Uses native <dialog> with popover attribute for:
 * - Native dialog semantics and accessibility
 * - Popover API top-layer rendering
 * - ::backdrop pseudo-element
 * - Light dismiss behavior
 * - Better performance
 *
 * @example
 * ```tsx
 * <Dialog
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   headerText="Confirm Action"
 *   footer={
 *     <>
 *       <Button onClick={handleConfirm}>Confirm</Button>
 *       <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
 *     </>
 *   }
 * >
 *   Are you sure you want to proceed?
 * </Dialog>
 * ```
 */
export function Dialog(
    {
      className,
      open: controlledOpen,
      defaultOpen = false,
      headerText,
      subHeaderText,
      headerEndContent,
      showBackButton,
      onBackButtonClick,
      hideHeaderBorder,
      hideBorders,
      header,
      children,
      footer,
      state = DialogState.None,
      stretch = false,
      draggable = false,
      resizable = false,
      preventInitialFocus = false,
      enableBackdropClick = false,
      noPadding = false,
      initialFocus,
      accessibleName,
      accessibleNameRef,
      accessibleDescribedBy,
      accessibleRole,
      ariaRoleDescription,
      onBeforeOpen,
      onAfterOpen,
      onBeforeClose,
      onAfterClose,
      onEscapePress,
      onOpenChange,
      id,
      ref,
      "data-testid": dataTestId,
    }: DialogProps
  ) {
    // Controlled + uncontrolled support
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
    const isOpen = controlledOpen ?? internalOpen;
    const onPhone = useIsPhone();

    // Track actual popover open state (may differ from isOpen if prevented)
    const [isPopoverActuallyOpen, setIsPopoverActuallyOpen] = React.useState(false);

    // Track whether content area overflows (drives header/footer border visibility)
    const [contentOverflows, setContentOverflows] = React.useState(false);

    // Generate stable dialog ID for stack management
    const dialogId = React.useId();
    const stableId = id || dialogId;

    // Refs
    const dialogRef = React.useRef<HTMLDialogElement>(null);
    const headerRef = React.useRef<HTMLDivElement>(null);
    const contentRef = React.useRef<HTMLDivElement>(null);
    const previousActiveElementRef = React.useRef<HTMLElement | null>(null);
    const returnValueRef = React.useRef<string | undefined>(undefined);
    const isClosingRef = React.useRef(false);
    const didPopRef = React.useRef(false);

    // Dragging state
    const [isDragging, setIsDragging] = React.useState(false);
    // Position stores direct top/left coordinates (null = not yet initialized, use CSS centering)
    const [position, setPosition] = React.useState<{ x: number; y: number } | null>(null);
    const positionRef = React.useRef(position);
    React.useLayoutEffect(() => { positionRef.current = position; }, [position]);
    const dragStartRef = React.useRef({ x: 0, y: 0, dialogX: 0, dialogY: 0 });

    // Compute effective role (alertdialog for Error/Warning states, otherwise custom or dialog)
    const effectiveRole = React.useMemo(() => {
      if (state === DialogState.Error || state === DialogState.Warning) {
        return "alertdialog";
      }
      return accessibleRole || "dialog";
    }, [state, accessibleRole]);

    // Compute aria-describedby (include draggable/resizable info)
    const effectiveAriaDescribedBy = React.useMemo(() => {
      const parts: string[] = [];

      if (accessibleDescribedBy) {
        parts.push(accessibleDescribedBy);
      }

      if (draggable || resizable) {
        parts.push(`${stableId}-movement-descr`);
      }

      return parts.length > 0 ? parts.join(" ") : undefined;
    }, [accessibleDescribedBy, draggable, resizable, stableId]);

    // Get movement description text
    const getMovementDescription = () => {
      if (draggable && resizable) {
        return "This dialog can be moved and resized. Use Tab to focus the header, then arrow keys to move. Use Shift+Arrow keys to resize.";
      }
      if (draggable) {
        return "This dialog can be moved. Use Tab to focus the header, then arrow keys to reposition.";
      }
      if (resizable) {
        return "This dialog can be resized. Use Tab to focus the header, then Shift+Arrow keys to resize.";
      }
      return "";
    };

    // Helper: switch from CSS centering to direct top/left positioning
    const ensureDirectPositioning = React.useCallback(() => {
      const dialog = dialogRef.current;
      if (!dialog || positionRef.current) return positionRef.current;

      const rect = dialog.getBoundingClientRect();
      dialog.style.width = `${rect.width}px`;
      const pos = { x: rect.left, y: rect.top };
      setPosition(pos);
      return pos;
    }, []);

    // Clamp position so the dialog stays fully inside the viewport
    const clampPosition = React.useCallback(
      (x: number, y: number): { x: number; y: number } => {
        const dialog = dialogRef.current;
        if (!dialog) return { x, y };

        const w = dialog.offsetWidth;
        const h = dialog.offsetHeight;
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        // Skip clamping if dimensions are unavailable (e.g. JSDOM)
        if (!w || !h || !vw || !vh) return { x, y };

        return {
          x: Math.max(0, Math.min(vw - w, x)),
          y: Math.max(0, Math.min(vh - h, y)),
        };
      },
      []
    );

    // Close handler
    // Note: handleClose identity changes when onBeforeClose/onAfterClose/onOpenChange
    // change identity (e.g. inline arrow functions). This re-triggers the open/close
    // effect. Callers should stabilise callback props with useCallback if this matters.
    const handleClose = React.useCallback((escPressed: boolean) => {
      const dialog = dialogRef.current;
      if (!dialog) return;

      // Prevent duplicate close calls
      if (isClosingRef.current) return;
      isClosingRef.current = true;

      // Fire before-close event
      const beforeCloseDetail: DialogBeforeCloseDetail = {
        escPressed,
        returnValue: returnValueRef.current,
      };
      const shouldClose = onBeforeClose?.(beforeCloseDetail);
      if (shouldClose === false) {
        isClosingRef.current = false;
        // In uncontrolled mode, we can prevent by setting internal state
        if (controlledOpen === undefined) {
          setInternalOpen(true);
        } else {
          onOpenChange?.(true);
        }
        return;
      }

      // Hide popover
      if (dialog.matches(':popover-open')) {
        dialog.hidePopover();
        if (!didPopRef.current) {
          didPopRef.current = true;
          dialogStack.pop(stableId);
        }
        setIsPopoverActuallyOpen(false);
      }

      // Reset position and inline width for next open
      setPosition(null);
      dialog.style.width = '';

      // Update state
      if (controlledOpen === undefined) {
        setInternalOpen(false);
      }
      onOpenChange?.(false);

      // Fire after-close event after animation completes
      const afterCloseDetail: DialogAfterCloseDetail = {
        returnValue: returnValueRef.current,
      };
      setTimeout(() => {
        onAfterClose?.(afterCloseDetail);
        previousActiveElementRef.current?.focus();
        returnValueRef.current = undefined;
        isClosingRef.current = false;
        didPopRef.current = false;
      }, 200);
    }, [controlledOpen, onBeforeClose, onAfterClose, onOpenChange, stableId]);

    // ResizeObserver: lock top-left when user resizes, clamp when dragged out of bounds
    React.useEffect(() => {
      if (!isPopoverActuallyOpen) return;
      const dialog = dialogRef.current;
      if (!dialog) return;

      const resizeObserver = new ResizeObserver(() => {
        if (!dialogRef.current) return;

        if (resizable || draggable) {
          // If still CSS-centered, switch to direct positioning to lock top-left
          const pos = positionRef.current ?? ensureDirectPositioning();
          if (!pos) return;

          // Clamp to viewport
          const dialogRect = dialogRef.current.getBoundingClientRect();
          const vw = window.innerWidth;
          const vh = window.innerHeight;

          const newX = Math.max(0, Math.min(vw - dialogRect.width, pos.x));
          const newY = Math.max(0, Math.min(vh - dialogRect.height, pos.y));

          if (newX !== pos.x || newY !== pos.y) {
            setPosition({ x: newX, y: newY });
          }
        }
      });

      resizeObserver.observe(dialog);

      return () => {
        resizeObserver.disconnect();
      };
    }, [isPopoverActuallyOpen, draggable, resizable, ensureDirectPositioning]);

    // Detect content overflow to auto-show header/footer borders
    React.useEffect(() => {
      if (!isPopoverActuallyOpen) {
        setContentOverflows(false);
        return;
      }
      const el = contentRef.current;
      if (!el) return;

      const check = () => setContentOverflows(el.scrollHeight > el.clientHeight);
      check();

      const ro = new ResizeObserver(check);
      ro.observe(el);
      return () => ro.disconnect();
    }, [isPopoverActuallyOpen]);

    // Re-center on window resize
    React.useEffect(() => {
      if (!isPopoverActuallyOpen) return;

      const handleResize = () => {
        const dialog = dialogRef.current;
        if (dialog) {
          dialog.style.width = '';
        }
        setPosition(null);
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, [isPopoverActuallyOpen]);

    // Ensure dialog closes on unmount
    const isPopoverActuallyOpenRef = React.useRef(isPopoverActuallyOpen);
    React.useEffect(() => { isPopoverActuallyOpenRef.current = isPopoverActuallyOpen; }, [isPopoverActuallyOpen]);

    const onAfterCloseRef = React.useRef(onAfterClose);
    React.useEffect(() => { onAfterCloseRef.current = onAfterClose; }, [onAfterClose]);

    const handleCloseRef = React.useRef(handleClose);
    React.useEffect(() => { handleCloseRef.current = handleClose; }, [handleClose]);

    React.useEffect(() => {
      const dialog = dialogRef.current;
      const id = stableId;

      return () => {
        const isOpen = dialog?.matches(':popover-open');
        if (isOpen) {
          try { dialog!.hidePopover(); } catch { /* already detached */ }
        }
        if ((isOpen || isPopoverActuallyOpenRef.current) && !didPopRef.current) {
          didPopRef.current = true;
          dialogStack.pop(id);
          onAfterCloseRef.current?.({ returnValue: returnValueRef.current });
        }
      };
    }, [stableId]);

    // Popover API open/close effect
    React.useEffect(() => {
      const dialog = dialogRef.current;
      if (!dialog) return;

      const isPopoverOpen = dialog.matches(':popover-open');

      if (isOpen && !isPopoverOpen) {
        // Reset closing flag when opening
        isClosingRef.current = false;
        didPopRef.current = false;

        // Store current focus
        previousActiveElementRef.current = document.activeElement as HTMLElement;

        // Fire before-open event
        const beforeOpenDetail: DialogBeforeOpenDetail = {};
        const shouldOpen = onBeforeOpen?.(beforeOpenDetail);
        if (shouldOpen === false) {
          // Prevent opening - don't set popover state
          if (controlledOpen === undefined) {
            setInternalOpen(false);
          } else {
            onOpenChange?.(false);
          }
          return;
        }

        // Push onto stack (inserts backdrop into top layer) before dialog enters top layer
        dialogStack.push(stableId, enableBackdropClick ? () => handleCloseRef.current(false) : undefined);

        // Open using Popover API
        dialog.showPopover();
        setIsPopoverActuallyOpen(true);

        // Handle initial focus after popover is fully rendered
        // Use double RAF to ensure the popover is painted and interactive
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (!preventInitialFocus) {
              const firstFocusable = findFirstFocusableElement(dialog, initialFocus);
              if (firstFocusable) {
                firstFocusable.focus();
              } else {
                // Focus the dialog itself
                dialog.focus();
              }
            }
          });
        });

        // Fire after-open event after animation
        const timer = setTimeout(() => {
          onAfterOpen?.();
        }, 200);

        return () => clearTimeout(timer);
      } else if (!isOpen && isPopoverOpen) {
        // Close using Popover API
        handleClose(false);
      }

      // Sync actual state when popover closes
      if (!isPopoverOpen && isPopoverActuallyOpen) {
        setIsPopoverActuallyOpen(false);
      }
    }, [
      isOpen,
      handleClose,
      initialFocus,
      preventInitialFocus,
      onBeforeOpen,
      onAfterOpen,
      isPopoverActuallyOpen,
      controlledOpen,
      onOpenChange,
      stableId,
      enableBackdropClick,
    ]);

    // Unified popup registry (Escape + cross-popup coordination)
    React.useEffect(() => {
      const dialog = dialogRef.current;
      if (!isPopoverActuallyOpen || !dialog) return;
      addOpenedPopup({
        element: dialog,
        close: (escPressed?: boolean) => {
          if (escPressed) onEscapePress?.();
          handleClose(!!escPressed);
        },
        type: "dialog",
        isModal: true,
      });
      return () => removeOpenedPopup(dialog);
    }, [isPopoverActuallyOpen, handleClose, onEscapePress]);

    // Keyboard handler for drag/resize and focus trap
    React.useEffect(() => {
      const dialog = dialogRef.current;
      if (!dialog || !isPopoverActuallyOpen) return;

      const handleKeyDown = (e: KeyboardEvent) => {
        // ESC is handled by the unified popup registry — skip here
        if (e.key === "Escape") return;

        // Prevent space/arrow keys from scrolling the page if focus is on dialog or body
        if (e.key === " " || ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
          const activeElement = document.activeElement;

          // If focus is on the dialog itself or body, prevent default scrolling
          if (activeElement === dialog || activeElement === document.body) {
            e.preventDefault();
          }
        }

        // Focus trapping for Tab key
        if (e.key === "Tab") {
          const focusableElements = dialog?.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (!focusableElements || focusableElements.length === 0) return;

          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (e.shiftKey) {
            // Shift+Tab: Move focus backwards
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            // Tab: Move focus forwards
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }

        // Arrow keys for dragging/resizing
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
          const activeElement = document.activeElement;

          const isInput = activeElement instanceof HTMLInputElement ||
                         activeElement instanceof HTMLTextAreaElement ||
                         activeElement?.getAttribute('contenteditable') === 'true';
          if (isInput) return;

          const isHeaderFocused = headerRef.current?.contains(activeElement as Node);

          const shouldResize = e.shiftKey && resizable && isHeaderFocused;
          const shouldDrag = !e.shiftKey && draggable && isHeaderFocused;

          if (!shouldDrag && !shouldResize) {
            return;
          }

          e.preventDefault();

          const step = 10;
          let deltaX = 0;
          let deltaY = 0;

          switch (e.key) {
            case "ArrowUp":
              deltaY = -step;
              break;
            case "ArrowDown":
              deltaY = step;
              break;
            case "ArrowLeft":
              deltaX = -step;
              break;
            case "ArrowRight":
              deltaX = step;
              break;
          }

          if (shouldDrag) {
            // Ensure direct positioning before setState to avoid DOM side-effects in updater
            const base = positionRef.current ?? ensureDirectPositioning() ?? { x: 0, y: 0 };
            setPosition(clampPosition(base.x + deltaX, base.y + deltaY));
          } else if (shouldResize && dialog) {
            const currentWidth = dialog.offsetWidth;
            const currentHeight = dialog.offsetHeight;
            const isRTL = document.documentElement.dir === "rtl";

            // Lock position before changing size (ensureDirectPositioning sets inline width from current rect)
            const base = positionRef.current ?? ensureDirectPositioning() ?? { x: 0, y: 0 };

            // In RTL, swap horizontal arrow direction so ArrowLeft grows (handle is on the left)
            const effectiveDeltaX = isRTL ? -deltaX : deltaX;
            const newWidth = Math.max(200, currentWidth + effectiveDeltaX * 2);
            const newHeight = Math.max(150, currentHeight + deltaY * 2);

            dialog.style.width = `${newWidth}px`;
            dialog.style.height = `${newHeight}px`;

            // In RTL, shift left position to keep right edge anchored when width changes
            const widthDiff = newWidth - currentWidth;
            const newX = isRTL ? base.x - widthDiff : base.x;
            setPosition(clampPosition(newX, base.y));
          }
        }
      };

      dialog.addEventListener('keydown', handleKeyDown);

      return () => {
        dialog.removeEventListener('keydown', handleKeyDown);
      };
    }, [isPopoverActuallyOpen, draggable, resizable, clampPosition, ensureDirectPositioning]);

    // Focus monitor: refocus dialog if focus escapes outside
    React.useEffect(() => {
      const dialog = dialogRef.current;
      if (!dialog || !isPopoverActuallyOpen) return;

      const handleFocusOut = (e: FocusEvent) => {
        const newFocusTarget = e.relatedTarget as Node | null;

        // If focus moved outside the dialog (including to body/null)
        if (!newFocusTarget || !dialog.contains(newFocusTarget)) {
          // Use requestAnimationFrame to ensure the focus change has completed
          requestAnimationFrame(() => {
            // Check if focus is still outside
            const currentFocus = document.activeElement;
            if (!dialog.contains(currentFocus)) {
              // Focus the dialog itself as a fallback
              dialog.focus();
            }
          });
        }
      };

      dialog.addEventListener('focusout', handleFocusOut);

      return () => {
        dialog.removeEventListener('focusout', handleFocusOut);
      };
    }, [isPopoverActuallyOpen]);

    // Dragging handlers
    const handleMouseDown = React.useCallback(
      (e: React.MouseEvent) => {
        if (!draggable) return;
        if (stretch && onPhone) return;
        if (!headerRef.current?.contains(e.target as Node)) return;

        // Switch to direct positioning if still CSS-centered
        const pos = position ?? ensureDirectPositioning();

        setIsDragging(true);

        dragStartRef.current = {
          x: e.clientX,
          y: e.clientY,
          dialogX: pos?.x ?? 0,
          dialogY: pos?.y ?? 0,
        };
      },
      [draggable, stretch, onPhone, position, ensureDirectPositioning]
    );

    const handleMouseMove = React.useCallback(
      (e: MouseEvent) => {
        if (!isDragging) return;

        const deltaX = e.clientX - dragStartRef.current.x;
        const deltaY = e.clientY - dragStartRef.current.y;

        const rawX = dragStartRef.current.dialogX + deltaX;
        const rawY = dragStartRef.current.dialogY + deltaY;
        setPosition(clampPosition(rawX, rawY));
      },
      [isDragging, clampPosition]
    );

    const handleMouseUp = React.useCallback(() => {
      setIsDragging(false);
    }, []);

    // Custom resize handlers (replaces native CSS `resize` which doesn't handle RTL)
    const resizeState = React.useRef<{
      startX: number; startY: number;
      startWidth: number; startHeight: number;
      startLeft: number; isRTL: boolean;
    } | null>(null);

    const handleResizeMouseDown = React.useCallback(
      (e: React.MouseEvent) => {
        if (!resizable) return;
        if (stretch && onPhone) return;
        e.preventDefault();
        e.stopPropagation();

        const dialog = dialogRef.current;
        if (!dialog) return;

        // Switch to direct positioning if still CSS-centered
        const pos = positionRef.current ?? ensureDirectPositioning();

        const rect = dialog.getBoundingClientRect();
        const rtl = document.documentElement.dir === "rtl";

        resizeState.current = {
          startX: e.clientX,
          startY: e.clientY,
          startWidth: rect.width,
          startHeight: rect.height,
          startLeft: pos?.x ?? rect.left,
          isRTL: rtl,
        };

        const onMove = (ev: MouseEvent) => {
          if (!resizeState.current || !dialogRef.current) return;
          const { startX, startY, startWidth, startHeight, startLeft, isRTL } = resizeState.current;
          const dx = ev.clientX - startX;
          const dy = ev.clientY - startY;

          let newWidth: number;
          let newLeft: number | undefined;

          if (isRTL) {
            // RTL: dragging left (negative dx) increases width, right edge stays anchored
            newWidth = Math.max(200, Math.min(startWidth - dx, window.innerWidth * 0.95));
            // Shift left position to keep right edge fixed
            newLeft = startLeft + dx;
            // Clamp: don't let left go below 0
            if (newLeft < 0) {
              newWidth = startWidth + startLeft; // max width that keeps right edge
              newLeft = 0;
            }
          } else {
            // LTR: dragging right (positive dx) increases width
            newWidth = Math.max(200, Math.min(startWidth + dx, window.innerWidth * 0.95));
          }

          const newHeight = Math.max(150, Math.min(startHeight + dy, window.innerHeight * 0.95));

          dialogRef.current.style.width = `${newWidth}px`;
          dialogRef.current.style.height = `${newHeight}px`;

          if (isRTL && newLeft !== undefined) {
            setPosition(clampPosition(newLeft, positionRef.current?.y ?? startLeft));
          }
        };

        const onUp = () => {
          resizeState.current = null;
          window.removeEventListener("mousemove", onMove);
          window.removeEventListener("mouseup", onUp);
        };

        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
      },
      [resizable, stretch, onPhone, ensureDirectPositioning, clampPosition]
    );

    // Attach drag listeners
    React.useEffect(() => {
      if (isDragging) {
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);

        return () => {
          document.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("mouseup", handleMouseUp);
        };
      }
    }, [isDragging, handleMouseMove, handleMouseUp]);

    // Imperative handle for ref methods
    React.useImperativeHandle(
      ref,
      () => ({
        show: () => {
          if (controlledOpen === undefined) {
            setInternalOpen(true);
          }
          onOpenChange?.(true);
        },
        showModal: () => {
          if (controlledOpen === undefined) {
            setInternalOpen(true);
          }
          onOpenChange?.(true);
        },
        close: (returnValue?: string) => {
          returnValueRef.current = returnValue;
          handleClose(false);
        },
        focus: () => {
          dialogRef.current?.focus();
        },
      }),
      [controlledOpen, onOpenChange, handleClose]
    );

    // Native dialog with Popover API
    return (
        <dialog
          ref={dialogRef}
          id={stableId}
          popover="manual"
          role={effectiveRole}
          aria-labelledby={accessibleNameRef || (!accessibleName && headerText ? `${stableId}-title` : undefined)}
          aria-describedby={effectiveAriaDescribedBy}
          aria-label={accessibleName || (!headerText && !accessibleNameRef ? "Dialog" : undefined)}
          aria-roledescription={ariaRoleDescription}
          tabIndex={-1}
          className={cn(
            dialogVariants({ state: state as DialogState, stretch, resizable }),
            stretch && onPhone && "w-screen max-w-none h-[100dvh] max-h-none rounded-none min-w-0",
            className
          )}
          style={{
            ...(stretch && onPhone ? {
              left: 0,
              top: 0,
              right: 'auto',
              transform: 'none',
            } : position ? {
              left: `${position.x}px`,
              top: `${position.y}px`,
              right: 'auto',
              transform: 'none',
            } : {
              left: '50%',
              top: '50%',
              right: 'auto',
              transform: 'translate(-50%, -50%)',
            }),
          }}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={handleMouseDown}
          data-testid={dataTestId}
        >
        {/* Hidden description for draggable/resizable */}
        {(draggable || resizable) && (
          <span
            id={`${stableId}-movement-descr`}
            className="absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0"
            style={{ clip: "rect(0, 0, 0, 0)" }}
          >
            {getMovementDescription()}
          </span>
        )}

        {/* Header */}
        {(header || headerText) && (
          <div
            ref={headerRef}
            className={cn(
              headerVariants({ state: state as DialogState, draggable }),
              (contentOverflows || !(hideBorders ?? hideHeaderBorder)) && state !== DialogState.Error && state !== DialogState.Success && state !== DialogState.Information && state !== DialogState.Warning && "border-b border-sapphire-border-primary"
            )}
            tabIndex={draggable || resizable ? 0 : undefined}
            aria-roledescription={draggable && ariaRoleDescription ? ariaRoleDescription : undefined}
          >
            {header || (
              <div className="flex items-center gap-3 w-full">
                <div className="flex items-center gap-3 min-w-0">
                  {state === "Error" && (
                    <MessageErrorIcon className="h-5 w-5 text-sapphire-negative shrink-0" />
                  )}
                  {state === "Success" && (
                    <MessageSuccessIcon className="h-5 w-5 text-sapphire-positive shrink-0" />
                  )}
                  {state === "Warning" && (
                    <MessageWarningIcon className="h-5 w-5 text-sapphire-warning shrink-0" />
                  )}
                  {state === "Information" && (
                    <MessageInformationIcon className="h-5 w-5 text-sapphire-info shrink-0" />
                  )}
                  {showBackButton && state === "None" && (
                    <Button
                      design="SecondaryNeutral"
                      iconOnly
                      icon={<ArrowLeftIcon />}
                      onClick={onBackButtonClick}
                      data-testid={subTestId(dataTestId, "back")}
                    />
                  )}
                  <div className="flex flex-col min-w-0">
                    <Title
                      level="H1"
                      id={`${stableId}-title`}
                      className="text-xl font-semibold text-foreground truncate"
                    >
                      {headerText}
                    </Title>
                    {subHeaderText && (
                      <span className="text-sm font-normal text-sapphire-text-tertiary truncate">
                        {subHeaderText}
                      </span>
                    )}
                  </div>
                </div>
                {headerEndContent && (
                  <div className="flex items-center gap-2 shrink-0 max-w-[50%] ml-auto">
                    {headerEndContent}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div
          ref={contentRef}
          className={cn("flex-auto min-h-0 overflow-y-auto", !noPadding && "px-6 py-4")}
          tabIndex={-1}
        >
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className={cn(
            "flex items-center justify-end gap-2 px-6 py-5 shrink-0",
            (contentOverflows || !(hideBorders ?? hideHeaderBorder)) && state !== DialogState.Error && state !== DialogState.Success && state !== DialogState.Information && state !== DialogState.Warning && "border-t border-sapphire-border-primary"
          )}>
            {footer}
          </div>
        )}

        {/* Custom resize handle — positioned at inline-end (right in LTR, left in RTL) */}
        {resizable && !onPhone && (
          <div
            className="dialog-resize-handle absolute bottom-0 w-6 h-6 rounded-full flex items-center justify-center z-[1] end-0"
            onMouseDown={handleResizeMouseDown}
            data-resize-handle="true"
          >
            <ResizeCornerIcon
              className="h-4 w-4 text-sapphire-text-tertiary rtl:rotate-90"
            />
          </div>
        )}
      </dialog>
    );
  }
