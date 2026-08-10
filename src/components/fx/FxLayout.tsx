import React, {
  useRef,
  useImperativeHandle,
  useState,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  createContext,
  useContext,
  isValidElement,
  cloneElement,
} from "react";
import { DeclineIcon } from "../../icons/Decline";
import { cn, subTestId } from "../../lib/utils";
import { BellIcon, OpenCommandFieldIcon, CloseCommandFieldIcon, JouleIcon, JouleWorkLogo } from "./icons";
import { FxSideNavigation } from "./FxSideNavigation";
import { FxSideNavigationItem } from "./FxSideNavigationItem";
import "./FxLayout.css";
import { useF6Navigation } from "../../hooks/useF6Navigation";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";

// Standard scrollbar styles (Firefox, Chrome 121+) with overflow
const scrollbarStyle: React.CSSProperties = {
  overflowY: "auto",
  overflowX: "hidden",
  scrollbarWidth: "thin",
  scrollbarColor: "var(--color-neutral-400) transparent",
};
import { Avatar } from "../avatar/Avatar";
import { Button } from "../button/Button";
import type { FxUserMenuAccountData } from "../../types/fx-user-menu";
import {
  FxLayoutProps,
  FxNavItemConfig,
  FxSideNavigationItemRef,
  FxSideNavigationRef,
} from "../../types/fx";
import { ButtonRef } from "../../types/button";

// =============================================================================
// Constants (matching fx-components reference)
// =============================================================================

const PANE_MIN_WIDTH = 320;
const DEFAULT_START_WIDTH = 360;  // Default start pane width in pixels
const DEFAULT_END_WIDTH = 420;    // Default end pane width in pixels
const THREE_PANE_MIN_WIDTH = 1366;
const TWO_PANE_MIN_WIDTH = 1024;
const NAVIGATION_COMPACT_THRESHOLD = 600;

// Pane animation timing
const PANE_TRANSITION = "400ms cubic-bezier(0.32, 0.72, 0, 1)";

/** Generate CSS transition string for pane width/flex */
function getPaneTransition(animationsEnabled: boolean): string {
  if (!animationsEnabled) return "none";
  return `width ${PANE_TRANSITION}`;
}

// Sidebar widths
const SIDEBAR_COLLAPSED_WIDTH = 80;
const SIDEBAR_EXPANDED_WIDTH = 256;

// =============================================================================
// Vertical layout breakpoints - deterministic height calculation
// Based on actual component measurements:
// - Header div: 80px tall (py-6 = 48px padding + 32px icon)
// - Nav items: 40px tall each (h-10)
// - Item gap: 16px (gap-4 on parent flex container)
// - Nav bottom padding: 24px (pb-6)
// =============================================================================

// Item height: h-10 = 40px
const NAV_ITEM_HEIGHT = 40;
// Gap between items: gap-4 = 16px
const NAV_ITEM_GAP = 16;
// Header: 80px (py-6 = 48px padding + 32px icon)
const NAV_HEADER_HEIGHT = 80;
// Top spacer in normal (non-merged) mode (used for merge breakpoint calculation)
const NAV_NORMAL_TOP_SPACER = 160;
// Minimum top spacer in merged mode: 0 (header already has padding around Joule icon)
const NAV_MERGED_MIN_SPACER = 0;
// Nav bottom padding: pb-6 = 24px
const NAV_BOTTOM_PADDING = 24;
// Divider when merged: my-1.5 (6px top + 6px bottom) + 1px height = 13px
const NAV_MERGED_DIVIDER_HEIGHT = 13;
// Hysteresis to prevent flickering at breakpoints
const BREAKPOINT_HYSTERESIS = 24;

/**
 * Calculate total height for N items with flex gap between them.
 * Each item is 40px tall, with 24px gap between adjacent items.
 * Total = N × 40px + (N-1) × 24px
 */
function calculateItemsHeight(count: number): number {
  if (count === 0) return 0;
  return count * NAV_ITEM_HEIGHT + (count - 1) * NAV_ITEM_GAP;
}

/**
 * Calculate the height breakpoints for merge and compact modes.
 * These are deterministic based on the number of nav items.
 */
function calculateVerticalBreakpoints(flexibleItemCount: number, fixedItemCount: number) {
  // Normal mode minimum height (when flex spacer = 0):
  // header + spacer + flexible items + fixed items + nav bottom padding
  // Add 16px buffer so merge happens before items visually touch
  const mergeBreakpoint =
    NAV_HEADER_HEIGHT +
    NAV_NORMAL_TOP_SPACER +
    calculateItemsHeight(flexibleItemCount) +
    calculateItemsHeight(fixedItemCount) +
    NAV_BOTTOM_PADDING +
    16;

  // Merged mode minimum height (when flex spacer = 0):
  // header + all items in one list + divider + nav bottom padding
  const totalItems = flexibleItemCount + fixedItemCount;
  const compactBreakpoint =
    NAV_HEADER_HEIGHT +
    NAV_MERGED_MIN_SPACER +
    calculateItemsHeight(totalItems) +
    NAV_MERGED_DIVIDER_HEIGHT +
    NAV_BOTTOM_PADDING;

  return { mergeBreakpoint, compactBreakpoint };
}

type MaxPanes = 1 | 2 | 3;
type PriorityPane = "Start" | "Center" | "End";

// =============================================================================
// Context for layout state
// =============================================================================

interface FxLayoutContextValue {
  startVisible: boolean;
  endVisible: boolean;
  maxPanes: MaxPanes;
  compactMode: boolean;
  leftmostVisiblePane: "start" | "center" | "end";
  allowStart: boolean;
  allowEnd: boolean;
  suppressEnd: boolean;
  utilityEndPane: boolean;
  isSettingsMode: boolean;
  inputMode: "oneline" | "multiline";
  toggleStartPane: () => void;
  toggleEndPane: () => void;
  openNavigation: () => void;
}

export type { FxLayoutContextValue };

export const FxLayoutContext = createContext<FxLayoutContextValue | null>(null);

export const useFxLayoutContext = () => {
  const context = useContext(FxLayoutContext);
  return context;
};

// =============================================================================
// Resize Handle Component
// Uses direct DOM manipulation during drag for smooth performance,
// syncs to React state only at drag end (matches fx-components approach)
// =============================================================================

interface ResizeHandleProps {
  /** Which separator this is */
  separator: "start" | "end";
  /** Ref to the start pane element */
  startPaneRef: React.RefObject<HTMLDivElement | null>;
  /** Ref to the center pane element */
  centerPaneRef: React.RefObject<HTMLDivElement | null>;
  /** Ref to the end pane element */
  endPaneRef: React.RefObject<HTMLDivElement | null>;
  /** Called at drag end with final widths */
  onResizeEnd: (startWidth: number, centerWidth: number, endWidth: number) => void;
  /** Called when the user double-clicks the handle to reset to default widths */
  onResetToDefault: () => void;
  /** Aria label for the separator */
  ariaLabel: string;
}

const KEYBOARD_RESIZE_STEP = 50; // pixels per arrow key press

const ResizeHandle: React.FC<ResizeHandleProps> = ({
  separator,
  startPaneRef,
  centerPaneRef,
  endPaneRef,
  onResizeEnd,
  onResetToDefault,
  ariaLabel,
}) => {
  const handleRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [ariaValueNow, setAriaValueNow] = useState(50);

  const computeAriaValue = useCallback(() => {
    if (separator === "start") {
      const startW = startPaneRef.current?.offsetWidth || 0;
      const centerW = centerPaneRef.current?.offsetWidth || 0;
      const total = startW + centerW;
      if (total > 0) setAriaValueNow(Math.round((startW / total) * 100));
    } else {
      const centerW = centerPaneRef.current?.offsetWidth || 0;
      const endW = endPaneRef.current?.offsetWidth || 0;
      const total = centerW + endW;
      if (total > 0) setAriaValueNow(Math.round((centerW / total) * 100));
    }
  }, [separator, startPaneRef, centerPaneRef, endPaneRef]);

  useEffect(() => {
    computeAriaValue();
  }, [computeAriaValue]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Home") {
      e.preventDefault();
      onResetToDefault();
      return;
    }
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;

    e.preventDefault();

    const startPane = startPaneRef.current;
    const centerPane = centerPaneRef.current;
    const endPane = endPaneRef.current;
    if (!startPane || !centerPane) return;

    const delta = e.key === "ArrowRight" ? KEYBOARD_RESIZE_STEP : -KEYBOARD_RESIZE_STEP;

    if (separator === "start") {
      let newStartWidth = startPane.offsetWidth + delta;
      let newCenterWidth = centerPane.offsetWidth - delta;

      // Enforce minimum widths
      if (newStartWidth < PANE_MIN_WIDTH) {
        newStartWidth = PANE_MIN_WIDTH;
        newCenterWidth = startPane.offsetWidth + centerPane.offsetWidth - PANE_MIN_WIDTH;
      }
      if (newCenterWidth < PANE_MIN_WIDTH) {
        newCenterWidth = PANE_MIN_WIDTH;
        newStartWidth = startPane.offsetWidth + centerPane.offsetWidth - PANE_MIN_WIDTH;
      }

      onResizeEnd(newStartWidth, newCenterWidth, endPane?.offsetWidth || 0);
      requestAnimationFrame(computeAriaValue);
    } else {
      // End separator
      if (!endPane) return;
      let newCenterWidth = centerPane.offsetWidth + delta;
      let newEndWidth = endPane.offsetWidth - delta;

      // Enforce minimum widths
      if (newEndWidth < PANE_MIN_WIDTH) {
        newEndWidth = PANE_MIN_WIDTH;
        newCenterWidth = centerPane.offsetWidth + endPane.offsetWidth - PANE_MIN_WIDTH;
      }
      if (newCenterWidth < PANE_MIN_WIDTH) {
        newCenterWidth = PANE_MIN_WIDTH;
        newEndWidth = centerPane.offsetWidth + endPane.offsetWidth - PANE_MIN_WIDTH;
      }

      onResizeEnd(startPane.offsetWidth, newCenterWidth, newEndWidth);
      requestAnimationFrame(computeAriaValue);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();

    const startPane = startPaneRef.current;
    const centerPane = centerPaneRef.current;
    const endPane = endPaneRef.current;
    if (!startPane || !centerPane) return;

    // Capture initial state at mousedown
    const initialStartWidth = startPane.offsetWidth;
    const initialCenterWidth = centerPane.offsetWidth;
    const initialEndWidth = endPane?.offsetWidth || 0;
    const startX = e.clientX;

    // Disable transitions during resize for instant feedback
    const originalStartTransition = startPane.style.transition;
    const originalCenterTransition = centerPane.style.transition;
    const originalEndTransition = endPane?.style.transition || "";
    startPane.style.transition = "none";
    centerPane.style.transition = "none";
    if (endPane) endPane.style.transition = "none";

    setIsDragging(true);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    const handleMouseMove = (ev: MouseEvent) => {
      const delta = ev.clientX - startX;

      if (separator === "start") {
        let newStartWidth = initialStartWidth + delta;
        let newCenterWidth = initialCenterWidth - delta;

        // Enforce minimum widths
        if (newStartWidth < PANE_MIN_WIDTH) {
          newStartWidth = PANE_MIN_WIDTH;
          newCenterWidth = initialStartWidth + initialCenterWidth - PANE_MIN_WIDTH;
        }
        if (newCenterWidth < PANE_MIN_WIDTH) {
          newCenterWidth = PANE_MIN_WIDTH;
          newStartWidth = initialStartWidth + initialCenterWidth - PANE_MIN_WIDTH;
        }

        // Direct DOM manipulation - no React re-render
        startPane.style.width = `${newStartWidth}px`;
        centerPane.style.width = `${newCenterWidth}px`;
      } else {
        // End separator
        if (!endPane) return;
        let newCenterWidth = initialCenterWidth + delta;
        let newEndWidth = initialEndWidth - delta;

        // Enforce minimum widths
        if (newEndWidth < PANE_MIN_WIDTH) {
          newEndWidth = PANE_MIN_WIDTH;
          newCenterWidth = initialCenterWidth + initialEndWidth - PANE_MIN_WIDTH;
        }
        if (newCenterWidth < PANE_MIN_WIDTH) {
          newCenterWidth = PANE_MIN_WIDTH;
          newEndWidth = initialCenterWidth + initialEndWidth - PANE_MIN_WIDTH;
        }

        // Direct DOM manipulation - no React re-render
        centerPane.style.width = `${newCenterWidth}px`;
        endPane.style.width = `${newEndWidth}px`;
      }
    };

    const handleMouseUp = () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);

      // Restore transitions
      startPane.style.transition = originalStartTransition;
      centerPane.style.transition = originalCenterTransition;
      if (endPane) endPane.style.transition = originalEndTransition;

      setIsDragging(false);

      // Focus the handle so user can continue resizing with keyboard
      handleRef.current?.focus();

      // Sync final widths to React state
      const finalStartWidth = startPane.offsetWidth;
      const finalCenterWidth = centerPane.offsetWidth;
      const finalEndWidth = endPane?.offsetWidth || 0;
      onResizeEnd(finalStartWidth, finalCenterWidth, finalEndWidth);
      requestAnimationFrame(computeAriaValue);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      ref={handleRef}
      role="separator"
      aria-orientation="vertical"
      aria-label={ariaLabel}
      aria-valuenow={ariaValueNow}
      aria-valuemin={0}
      aria-valuemax={100}
      tabIndex={0}
      className={cn(
        "absolute inset-0 cursor-col-resize z-10",
        "after:content-[''] after:absolute after:top-0 after:bottom-0 after:left-1/2 after:-translate-x-1/2",
        "after:w-px after:bg-sapphire-border-primary after:transition-all",
        !isDragging && !isFocused && "hover:after:bg-sapphire-border-secondary",
        isDragging && "after:!bg-sapphire-border-active",
        isFocused && "after:w-0.5 after:!bg-sapphire-border-focus"
      )}
      style={{ outline: "none" }}
      onMouseDown={handleMouseDown}
      onDoubleClick={onResetToDefault}
      onKeyDown={handleKeyDown}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    />
  );
};

// =============================================================================
// Calculate max panes based on available width
// Panes touch each other directly (no separator gaps)
// =============================================================================

function calculateMaxPanes(width: number, threePaneMin: number): MaxPanes {
  if (width >= threePaneMin) {
    return 3;
  }

  if (width >= TWO_PANE_MIN_WIDTH) {
    return 2;
  }

  return 1;
}

// =============================================================================
// Pane visibility calculation (extracted for cognitive complexity)
// Matches fx-layout _effectiveShowStart / _effectiveShowCenter / _effectiveShowEnd
// =============================================================================

export interface PaneVisibilityInput {
  allowStart: boolean;
  allowEnd: boolean;
  suppressEnd: boolean;
  internalHideStart: boolean;
  internalHideEnd: boolean;
  internalHideCenter: boolean;
  effectivePriority: PriorityPane;
  maxPanes: MaxPanes;
}

export function calculateShowStart(input: PaneVisibilityInput): boolean {
  const { allowStart, internalHideStart, effectivePriority, internalHideCenter, internalHideEnd, allowEnd, suppressEnd, maxPanes } = input;
  if (!allowStart) return false;
  if (internalHideStart) return false;
  if (effectivePriority === "Start") return true;

  // Default priority order: Center (3) > End (2) > Start (1)
  // When priority is Start: Start gets highest (3)
  // When priority is End: End gets highest (3), Center stays at 2
  const startPriority = 1;
  const centerPriority = effectivePriority === "Center" ? 3 : 2;
  const endPriority = effectivePriority === "End" ? 3 : 2;

  let higherPriorityCount = 0;
  if (!internalHideCenter && centerPriority > startPriority) higherPriorityCount++;
  if (!internalHideEnd && allowEnd && !suppressEnd && endPriority > startPriority) higherPriorityCount++;

  return higherPriorityCount < maxPanes;
}

export function calculateShowCenter(input: PaneVisibilityInput): boolean {
  const { internalHideCenter, effectivePriority, internalHideStart, allowStart, internalHideEnd, allowEnd, suppressEnd, maxPanes } = input;
  if (internalHideCenter) return false;
  if (effectivePriority === "Center") return true;

  // Default priority order: Center (3) > End (2) > Start (1)
  const startPriority = effectivePriority === "Start" ? 3 : 1;
  const centerPriority = 2; // We already returned if effectivePriority === "Center"
  const endPriority = effectivePriority === "End" ? 3 : 2;

  let higherPriorityCount = 0;
  if (!internalHideStart && allowStart && startPriority > centerPriority) higherPriorityCount++;
  if (!internalHideEnd && allowEnd && !suppressEnd && endPriority > centerPriority) higherPriorityCount++;

  return higherPriorityCount < maxPanes;
}

export function calculateShowEnd(input: PaneVisibilityInput): boolean {
  const { allowEnd, suppressEnd, internalHideEnd, effectivePriority, internalHideCenter, internalHideStart, allowStart, maxPanes } = input;
  if (!allowEnd) return false;
  if (suppressEnd) return false;
  if (internalHideEnd) return false;
  if (effectivePriority === "End") return true;
  if (internalHideCenter) return false;

  // Default priority order: Center (3) > End (2) > Start (1)
  // When priority is Start: Start (3) > Center (2) > End (1)
  // Note: effectivePriority === "End" already returned true above
  const startPriority = effectivePriority === "Start" ? 3 : 1;
  const centerPriority = effectivePriority === "Center" ? 3 : 2;
  const endPriority = effectivePriority === "Start" ? 1 : 2;

  let higherPriorityCount = 0;
  if (!internalHideStart && allowStart && startPriority > endPriority) higherPriorityCount++;
  if (!internalHideCenter && centerPriority > endPriority) higherPriorityCount++;

  return higherPriorityCount < maxPanes;
}

export function calculatePaneVisibility(input: PaneVisibilityInput) {
  return {
    showStart: calculateShowStart(input),
    showCenter: calculateShowCenter(input),
    showEnd: calculateShowEnd(input),
  };
}

// =============================================================================
// Default pane widths calculation (extracted for cognitive complexity)
// =============================================================================

export function calculateDefaultWidths(showStart: boolean, showCenter: boolean, showEnd: boolean) {
  const visibleCount = (showStart ? 1 : 0) + (showCenter ? 1 : 0) + (showEnd ? 1 : 0);

  if (visibleCount === 1) {
    if (showStart) return { startWidth: "100%", endWidth: "0%" };
    if (showEnd) return { startWidth: "0%", endWidth: "100%" };
    return { startWidth: "0%", endWidth: "0%" };
  }

  if (visibleCount === 2) {
    if (showStart && showCenter && !showEnd) return { startWidth: "33%", endWidth: "0%" };
    if (!showStart && showCenter && showEnd) return { startWidth: "0%", endWidth: "33%" };
    if (showStart && !showCenter && showEnd) return { startWidth: "33%", endWidth: "67%" };
  }

  return { startWidth: "25%", endWidth: "25%" };
}

// =============================================================================
// Resize handler logic (extracted for cognitive complexity)
// =============================================================================

export interface ResizeConfig {
  mergeBreakpoint: number;
  compactBreakpoint: number;
  threePaneMinWidth: number;
  navCollapsed: boolean;
  animationsEnabled: boolean;
  previousTotalWidth: number;
  lastMaxPanes: MaxPanes;
  prevVerticalCompact: boolean;
}

export interface ResizeResult {
  totalWidth: number;
  isHorizontalCompact: boolean;
  closeUserMenu: boolean;
  navMerged: boolean;
  verticalCompact: boolean;
  maxPanes: MaxPanes | null;
  collapseNav: boolean;
  triggerNavTransition: boolean;
}

export function processResize(width: number, height: number, config: ResizeConfig): ResizeResult {
  const {
    mergeBreakpoint, compactBreakpoint, threePaneMinWidth,
    navCollapsed, animationsEnabled, lastMaxPanes, prevVerticalCompact,
  } = config;

  const isHorizontalCompact = width < NAVIGATION_COMPACT_THRESHOLD;
  const closeUserMenu = !isHorizontalCompact;

  let navMerged = false;
  let verticalCompact = prevVerticalCompact;

  if (!isHorizontalCompact && height > 0) {
    navMerged = height < mergeBreakpoint;
    if (prevVerticalCompact) {
      verticalCompact = height < compactBreakpoint + BREAKPOINT_HYSTERESIS;
    } else {
      verticalCompact = height < compactBreakpoint;
    }
  } else {
    verticalCompact = false;
  }

  // Use total layout width for breakpoint calculation (includes side nav)
  const newMaxPanes = calculateMaxPanes(width, threePaneMinWidth);

  if (newMaxPanes === lastMaxPanes) {
    return { totalWidth: width, isHorizontalCompact, closeUserMenu, navMerged, verticalCompact, maxPanes: null, collapseNav: false, triggerNavTransition: false };
  }

  // When panes would decrease and nav is expanded, collapse nav first to give panes more room
  if (newMaxPanes < lastMaxPanes && !isHorizontalCompact && !navCollapsed) {
    // Return lastMaxPanes (not null) so collapseNav gets processed, but pane count stays same for now
    return { totalWidth: width, isHorizontalCompact, closeUserMenu, navMerged, verticalCompact, maxPanes: lastMaxPanes, collapseNav: true, triggerNavTransition: animationsEnabled };
  }

  return { totalWidth: width, isHorizontalCompact, closeUserMenu, navMerged, verticalCompact, maxPanes: newMaxPanes, collapseNav: false, triggerNavTransition: false };
}

// =============================================================================
// Pane width/style helpers - extracted to reduce cognitive complexity
// =============================================================================

export interface PaneWidthConfig {
  effectiveShowStart: boolean;
  effectiveShowCenter: boolean;
  effectiveShowEnd: boolean;
  mobileLayout: boolean;
  targetStartWidth: number;
  targetEndWidth: number;
}

export interface PaneWidthResult {
  startPaneWidth: string | 0;
  centerPaneMinWidth: number;
  endPaneWidth: string | 0;
}

export function calculatePaneWidths(config: PaneWidthConfig): PaneWidthResult {
  const { effectiveShowStart, effectiveShowCenter, effectiveShowEnd, mobileLayout, targetStartWidth, targetEndWidth } = config;

  // When a side pane is the only visible pane (center is hidden), it should take full width
  const onlyStartVisible = effectiveShowStart && !effectiveShowCenter && !effectiveShowEnd;
  const onlyEndVisible = effectiveShowEnd && !effectiveShowCenter && !effectiveShowStart;

  // Calculate width values - extracted to avoid nested ternaries
  const startFullWidth = mobileLayout || onlyStartVisible;
  const endFullWidth = mobileLayout || onlyEndVisible;
  const startPaneWidthValue = startFullWidth ? "100%" : `${targetStartWidth}px`;
  const endPaneWidthValue = endFullWidth ? "100%" : `${targetEndWidth}px`;

  return {
    startPaneWidth: effectiveShowStart ? startPaneWidthValue : 0,
    centerPaneMinWidth: effectiveShowCenter ? (mobileLayout ? 0 : PANE_MIN_WIDTH) : 0,
    endPaneWidth: effectiveShowEnd ? endPaneWidthValue : 0,
  };
}

// =============================================================================
// Constrained width calculation - extracted to reduce cognitive complexity
// =============================================================================

export interface ConstrainedWidthConfig {
  startWidth: number;
  endWidth: number;
  mainAreaWidth: number;
  effectiveShowStart: boolean;
  effectiveShowEnd: boolean;
}

export function calculateConstrainedWidths(config: ConstrainedWidthConfig): { targetStartWidth: number; targetEndWidth: number } {
  const { startWidth, endWidth, mainAreaWidth, effectiveShowStart, effectiveShowEnd } = config;
  let resultStart = startWidth;
  let resultEnd = endWidth;

  if (mainAreaWidth > 0) {
    // Available space for side panes (center needs at least PANE_MIN_WIDTH)
    const availableForSidePanes = mainAreaWidth - PANE_MIN_WIDTH;

    if (effectiveShowStart && effectiveShowEnd) {
      // Both visible: use widths if they fit, otherwise shrink proportionally
      if (startWidth + endWidth > availableForSidePanes) {
        const total = startWidth + endWidth;
        const startRatio = startWidth / total;
        resultStart = Math.max(PANE_MIN_WIDTH, Math.floor(availableForSidePanes * startRatio));
        resultEnd = Math.max(PANE_MIN_WIDTH, availableForSidePanes - resultStart);
      }
    } else if (effectiveShowStart && !effectiveShowEnd) {
      // Only start visible: constrain if needed
      if (startWidth > availableForSidePanes) {
        resultStart = Math.max(PANE_MIN_WIDTH, availableForSidePanes);
      }
    } else if (!effectiveShowStart && effectiveShowEnd) {
      // Only end visible: constrain if needed
      if (endWidth > availableForSidePanes) {
        resultEnd = Math.max(PANE_MIN_WIDTH, availableForSidePanes);
      }
    }
  }

  return { targetStartWidth: resultStart, targetEndWidth: resultEnd };
}

// =============================================================================
// InputContainer - Floating input positioned over center or end pane
// Extracted to reduce cognitive complexity of main FxLayout function
// =============================================================================

interface InputContainerProps {
  input: React.ReactNode;
  inputInEndPane: boolean;
  mobileLayout: boolean;
  effectiveShowStart: boolean;
  effectiveShowEnd: boolean;
  finalStartWidth: string;
  finalEndWidth: string;
  paneAnimationsEnabled: boolean;
}

const InputContainer: React.FC<InputContainerProps> = ({
  input,
  inputInEndPane,
  mobileLayout,
  effectiveShowStart,
  effectiveShowEnd,
  finalStartWidth,
  finalEndWidth,
  paneAnimationsEnabled,
}) => {
  // Calculate input container positioning
  let inputLeft: string;
  let inputRight: string;
  if (mobileLayout) {
    inputLeft = "1rem";
    inputRight = "1rem";
  } else if (inputInEndPane) {
    inputLeft = `calc(100% - ${finalEndWidth} + 1.25rem)`;
    inputRight = "1.25rem";
  } else {
    inputLeft = effectiveShowStart ? `calc(${finalStartWidth} + 1.25rem)` : "1.25rem";
    inputRight = effectiveShowEnd ? `calc(${finalEndWidth} + 1.25rem)` : "1.25rem";
  }

  return (
    <div
      className="pointer-events-none flex justify-center"
      style={{
        position: "absolute",
        bottom: "1rem",
        left: inputLeft,
        right: inputRight,
        zIndex: 2,
        transition: paneAnimationsEnabled
          ? `left ${PANE_TRANSITION}, right ${PANE_TRANSITION}`
          : "none",
        padding: "0 0.5rem 0.5rem 0.5rem",
        margin: "0 -0.5rem -0.5rem -0.5rem",
      }}
    >
      <div
        className="pointer-events-auto w-full"
        style={{ maxWidth: inputInEndPane ? undefined : "600px" }}
      >
        {input}
      </div>
    </div>
  );
};

// =============================================================================
// SidebarNav - Desktop sidebar navigation
// Extracted to reduce cognitive complexity of main FxLayout function
// =============================================================================

interface SidebarNavProps {
  sideNavRef: React.RefObject<FxSideNavigationRef | null>;
  notificationsItemRef: React.RefObject<FxSideNavigationItemRef | null>;
  userItemRef: React.RefObject<FxSideNavigationItemRef | null>;
  navCollapsed: boolean;
  navTransitioning: boolean;
  navTransitionDirection: 'collapsing' | 'expanding' | null;
  navMerged: boolean;
  navWidth: number;
  animationsEnabled: boolean;
  effectiveShowStart: boolean;
  hideNotifications: boolean;
  notificationsBadge?: string | number;
  notificationsLocked: boolean;
  navLogo?: { collapsed?: React.ReactNode; expanded?: React.ReactNode };
  navItems: FxNavItemConfig[];
  mode: string;
  isSettingsMode: boolean;
  userMenuOpen: boolean;
  selectedUserAccount: FxUserMenuAccountData | undefined;
  dataTestId?: string;
  t: TFunction;
  onNavSelect: (name: string) => void;
  onNotificationsClick?: (opener: HTMLElement) => void;
  onAddClick?: (detail?: { mode: string }) => void;
  onUserItemClick: () => void;
  onToggleCollapsed: () => void;
  onTransitionEnd: (e: React.TransitionEvent) => void;
}

const SidebarNav: React.FC<SidebarNavProps> = ({
  sideNavRef, notificationsItemRef, userItemRef,
  navCollapsed, navTransitioning, navTransitionDirection, navMerged,
  navWidth, animationsEnabled, effectiveShowStart,
  hideNotifications, notificationsBadge, notificationsLocked,
  navLogo, navItems, mode, isSettingsMode, userMenuOpen,
  selectedUserAccount, dataTestId, t,
  onNavSelect, onNotificationsClick, onAddClick, onUserItemClick,
  onToggleCollapsed, onTransitionEnd,
}) => (
  <div
    className={cn(
      "flex flex-col h-full shrink-0 relative",
      effectiveShowStart && "border-r border-border"
    )}
    data-sap-ui-fastnavgroup="true"
    style={{
      width: navWidth,
      transition: animationsEnabled ? `width ${PANE_TRANSITION}` : "none",
      overflow: "visible",
    }}
    onTransitionEnd={onTransitionEnd}
  >
    <FxSideNavigation
      ref={sideNavRef}
      collapsed={navCollapsed}
      isTransitioning={navTransitioning}
      transitionDirection={navTransitionDirection}
      forceMerged={navMerged}
      onSelectionChange={({ name }) => onNavSelect(name)}
      header={
        <button
          onClick={() => onNavSelect(navItems[0]?.name || "")}
          className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sapphire-border-joule rounded flex items-center gap-2"
        >
          {navCollapsed
            ? (navLogo?.collapsed ?? <JouleIcon height={32} />)
            : (navLogo?.expanded ?? <JouleWorkLogo height={32} />)
          }
        </button>
      }
      fixedItems={
        <>
          {!hideNotifications && (
            <FxSideNavigationItem
              ref={notificationsItemRef}
              name="notifications"
              icon={<BellIcon className="h-5 w-5" />}
              text={t("FX_NOTIFICATIONS")}
              badge={notificationsBadge?.toString()}
              selected={notificationsLocked}
              locked={notificationsLocked}
              onClick={() => {
                const opener = notificationsItemRef.current?.getNativeElement();
                if (opener) onNotificationsClick?.(opener);
              }}
              data-testid={subTestId(dataTestId, "notifications")}
            />
          )}
          <FxSideNavigationItem
            ref={userItemRef}
            name="profile"
            text={selectedUserAccount?.titleText || "User"}
            avatar={
              <Avatar
                size="XS"
                shape="Circle"
                image={selectedUserAccount?.avatarSrc}
                initials={selectedUserAccount?.avatarInitials || "U"}
                colorScheme={selectedUserAccount?.avatarColorScheme || "Accent1"}
              />
            }
            selected={isSettingsMode || userMenuOpen}
            locked={userMenuOpen}
            onClick={onUserItemClick}
            data-testid={subTestId(dataTestId, "profile")}
          />
          <FxSideNavigationItem
            name="toggle"
            icon={navCollapsed ? <OpenCommandFieldIcon className="h-5 w-5" /> : <CloseCommandFieldIcon className="h-5 w-5" />}
            text={navCollapsed ? t("NAVIGATION_EXPAND") : t("NAVIGATION_COLLAPSE")}
            onClick={onToggleCollapsed}
            data-testid={subTestId(dataTestId, "nav-toggle")}
          />
        </>
      }
    >
      {navItems.map((item) => (
        <FxSideNavigationItem
          key={item.name}
          name={item.name}
          icon={item.icon}
          selectedIcon={item.selectedIcon}
          text={item.text}
          selected={mode === item.name}
          showAddButton={!!item.createActionTooltip}
          addButtonTooltip={item.createActionTooltip}
          onAddClick={() => onAddClick?.({ mode: item.name })}
          data-testid={item["data-testid"]}
        />
      ))}
    </FxSideNavigation>
  </div>
);

// =============================================================================
// NavDialog - Compact-mode slide-in navigation dialog
// Extracted to reduce cognitive complexity of main FxLayout function
// =============================================================================

interface NavDialogProps {
  navDialogCloseRef: React.RefObject<ButtonRef | null>;
  navigationClosing: boolean;
  hideNotifications: boolean;
  notificationsBadge?: string | number;
  navLogo?: { collapsed?: React.ReactNode; expanded?: React.ReactNode };
  navItems: FxNavItemConfig[];
  mode: string;
  isSettingsMode: boolean;
  userMenuOpen: boolean;
  selectedUserAccount: FxUserMenuAccountData | undefined;
  dataTestId?: string;
  t: TFunction;
  onClose: () => void;
  onNavSelect: (name: string) => void;
  onNotificationsClick?: (opener: HTMLElement) => void;
  onAddClick?: (detail?: { mode: string }) => void;
  onProfileClick: () => void;
}

const NavDialog: React.FC<NavDialogProps> = ({
  navDialogCloseRef, navigationClosing,
  hideNotifications, notificationsBadge,
  navLogo, navItems, mode, isSettingsMode, userMenuOpen,
  selectedUserAccount, dataTestId, t,
  onClose, onNavSelect, onNotificationsClick, onAddClick, onProfileClick,
}) => (
  <div className="fixed inset-0 z-50 flex" onClick={onClose}>
    {/* Backdrop */}
    <div
      className="absolute inset-0"
      style={{
        backgroundColor: "color-mix(in srgb, var(--foreground) 50%, transparent)",
        animation: navigationClosing
          ? "fadeOut 300ms cubic-bezier(0.4, 0, 0.2, 1) forwards"
          : "fadeIn 300ms cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    />
    {/* Dialog - slides in from left */}
    <div
      className="relative w-64 h-full border-r border-border flex flex-col shadow-xl bg-sapphire-shell-bg-primary"
      style={{
        animation: navigationClosing
          ? "slideOutToLeft 300ms cubic-bezier(0.4, 0, 0.2, 1) forwards"
          : "slideInFromLeft 300ms cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header with close button */}
      <div className="flex items-center h-14 px-2 border-b border-border shrink-0">
        <Button
          ref={navDialogCloseRef}
          design="Tertiary"
          iconOnly
          icon={<DeclineIcon className="h-4 w-4" />}
          onClick={onClose}
          className="text-sapphire-text-primary"
          data-testid={subTestId(dataTestId, "nav-close")}
        />
        <button
          onClick={() => onNavSelect(navItems[0]?.name || "")}
          className="cursor-pointer flex items-center gap-2 ml-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sapphire-border-joule rounded"
        >
          {navLogo?.expanded ?? <JouleWorkLogo height={28} />}
        </button>
      </div>
      {/* Navigation - dialog mode: items at top, no spacer */}
      <div className="flex-1 overflow-y-auto">
        <FxSideNavigation
          collapsed={false}
          forceMerged={true}
          dialogMode={true}
          onSelectionChange={({ name }) => onNavSelect(name)}
          fixedItems={
            <>
              {!hideNotifications && (
                <FxSideNavigationItem
                  name="notifications"
                  icon={<BellIcon className="h-5 w-5" />}
                  text={t("FX_NOTIFICATIONS")}
                  badge={notificationsBadge?.toString()}
                  onClick={(e) => {
                    const opener = (e.target as HTMLElement).closest('button') as HTMLElement;
                    if (opener) onNotificationsClick?.(opener);
                  }}
                  data-testid={subTestId(dataTestId, "notifications")}
                />
              )}
              <FxSideNavigationItem
                name="profile"
                text={selectedUserAccount?.titleText || "User"}
                selected={isSettingsMode || userMenuOpen}
                avatar={
                  <Avatar
                    size="XS"
                    shape="Circle"
                    image={selectedUserAccount?.avatarSrc}
                    initials={selectedUserAccount?.avatarInitials || "U"}
                    colorScheme={selectedUserAccount?.avatarColorScheme || "Accent1"}
                  />
                }
                onClick={onProfileClick}
                data-testid={subTestId(dataTestId, "profile")}
              />
            </>
          }
        >
          {navItems.map((item) => (
            <FxSideNavigationItem
              key={item.name}
              name={item.name}
              icon={item.icon}
              selectedIcon={item.selectedIcon}
              text={item.text}
              selected={mode === item.name}
              showAddButton={!!item.createActionTooltip}
              addButtonTooltip={item.createActionTooltip}
              onAddClick={onAddClick}
              data-testid={item["data-testid"]}
            />
          ))}
        </FxSideNavigation>
      </div>
    </div>
  </div>
);

// =============================================================================
// FxLayout Component
// =============================================================================

export function FxLayout({
  id,
  hideStart: hideStartProp = false,
  hideEnd: hideEndProp = false,
  suppressEnd = false,
  priorityPane: priorityPaneProp = "Center",
  mode = "",
  notificationsBadge,
  notificationsLocked = false,
  hideNotifications = false,
  navItems = [],
  threePaneMinWidth = THREE_PANE_MIN_WIDTH,
  startHeader,
  centerHeader,
  endHeader,
  startContent,
  centerContent,
  endContent,
  userMenu,
  input,
  onVisibilityChange,
  onModeChange,
  onLayoutChange,
  onAddClick,
  onNotificationsClick,
  navLogo,
  className,
  style,
  children,
  ref,
  "data-testid": dataTestId,
}: FxLayoutProps) {
    const layoutRef = useRef<HTMLDivElement>(null);
    const sideNavRef = useRef<FxSideNavigationRef>(null);
    const notificationsItemRef = useRef<FxSideNavigationItemRef>(null);
    const userItemRef = useRef<FxSideNavigationItemRef>(null);
    const navDialogCloseRef = useRef<ButtonRef>(null);

    // Pane refs for direct DOM manipulation during resize
    const startPaneRef = useRef<HTMLDivElement>(null);
    const centerPaneRef = useRef<HTMLDivElement>(null);
    const endPaneRef = useRef<HTMLDivElement>(null);

    // F6 fast navigation between landmark groups
    useF6Navigation();

    const { t } = useTranslation("fx");

    // Content scroll refs for scroll-to-top on layout change (mobile)
    const startContentRef = useRef<HTMLDivElement>(null);
    const centerContentRef = useRef<HTMLDivElement>(null);
    const endContentRef = useRef<HTMLDivElement>(null);

    // Scroll state for header border visibility
    const [startScrolled, setStartScrolled] = useState(false);
    const [centerScrolled, setCenterScrolled] = useState(false);
    const [endScrolled, setEndScrolled] = useState(false);

    // Layout state
    const [navCollapsed, setNavCollapsed] = useState(true);
    const [navTransitioning, setNavTransitioning] = useState(false);
    const [navTransitionDirection, setNavTransitionDirection] = useState<'collapsing' | 'expanding' | null>(null);
    const navTransitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [horizontalCompactMode, setHorizontalCompactMode] = useState(false);
    const [verticalCompactMode, setVerticalCompactMode] = useState(false);
    const [navMerged, setNavMerged] = useState(false);
    const [navigationOpen, setNavigationOpen] = useState(false);
    const [navigationClosing, setNavigationClosing] = useState(false);
    const [maxPanes, setMaxPanes] = useState<MaxPanes>(3);
    const [totalWidth, setTotalWidth] = useState(0);

    // Effective compact mode combines horizontal and vertical (for hiding nav)
    const compactMode = horizontalCompactMode || verticalCompactMode;

    // Mobile layout mode is only horizontal (vertical compact keeps multi-pane layout)
    const mobileLayout = horizontalCompactMode;

    // Animation state - disabled on initial load, enabled after first user interaction
    const [animationsEnabled, setAnimationsEnabled] = useState(false);

    // Internal hide state (controlled by toggle buttons)
    const [internalHideStart, setInternalHideStart] = useState(hideStartProp);
    const [internalHideEnd, setInternalHideEnd] = useState(hideEndProp);
    const [internalPriorityPane, setInternalPriorityPane] = useState<PriorityPane>(priorityPaneProp);

    // Menu state
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [userMenuOpener, setUserMenuOpener] = useState<HTMLElement | null>(null);
    const [userMenuFromHamburger, setUserMenuFromHamburger] = useState(false);

    // Derive selected user account from userMenu element props (for avatar display in nav)
    const _userMenuAccounts = userMenu?.props?.accounts as FxUserMenuAccountData[] | undefined;
    const _selectedUserAccount = _userMenuAccounts?.find(a => a.selected) || _userMenuAccounts?.[0];

    // Enable animations after initial layout settles
    useEffect(() => {
      const timer = setTimeout(() => {
        setAnimationsEnabled(true);
      }, 100);
      return () => clearTimeout(timer);
    }, []);

    // Pane animations disabled when only 1 pane can fit (single-pane view swaps panes instantly)
    const paneAnimationsEnabled = animationsEnabled && maxPanes > 1;

    const toggleNavCollapsed = useCallback(() => {
      const willCollapse = !navCollapsed;
      if (animationsEnabled) {
        setNavTransitioning(true);
        setNavTransitionDirection(willCollapse ? 'collapsing' : 'expanding');
        if (navTransitionTimeoutRef.current) clearTimeout(navTransitionTimeoutRef.current);
        navTransitionTimeoutRef.current = setTimeout(() => {
          setNavTransitioning(false);
          setNavTransitionDirection(null);
        }, 400);
      }
      setNavCollapsed(willCollapse);
    }, [navCollapsed, animationsEnabled]);

    const handleNavTransitionEnd = useCallback((e: React.TransitionEvent) => {
      if (e.propertyName === 'width' && (e.target as HTMLElement) === e.currentTarget) {
        setNavTransitioning(false);
        setNavTransitionDirection(null);
        if (navTransitionTimeoutRef.current) {
          clearTimeout(navTransitionTimeoutRef.current);
          navTransitionTimeoutRef.current = null;
        }
      }
    }, []);

    useEffect(() => {
      return () => {
        if (navTransitionTimeoutRef.current) clearTimeout(navTransitionTimeoutRef.current);
      };
    }, []);

    // Track previous width for resize direction detection (persists across re-renders)
    const previousTotalWidthRef = useRef(0);
    // Track last maxPanes to detect changes
    const lastMaxPanesRef = useRef<MaxPanes>(3);

    // Sync with props when they change from outside (not from our toggle callbacks)
    // We use separate refs for each prop to track whether WE initiated the change
    const isInternalStartChangeRef = useRef(false);
    const isInternalEndChangeRef = useRef(false);
    const isInternalPriorityChangeRef = useRef(false);

    useEffect(() => {
      if (!isInternalStartChangeRef.current) {
        setInternalHideStart(hideStartProp);
      }
      isInternalStartChangeRef.current = false;
    }, [hideStartProp]);

    useEffect(() => {
      if (!isInternalEndChangeRef.current) {
        setInternalHideEnd(hideEndProp);
      }
      isInternalEndChangeRef.current = false;
    }, [hideEndProp]);

    useEffect(() => {
      if (!isInternalPriorityChangeRef.current) {
        setInternalPriorityPane(priorityPaneProp);
      }
      isInternalPriorityChangeRef.current = false;
    }, [priorityPaneProp]);

    // Current nav item config
    const currentNavItem = useMemo(
      () => navItems.find((item) => item.name === mode),
      [navItems, mode]
    );

    // Settings mode is a special built-in mode (no nav item required)
    const isSettingsMode = mode === "settings";

    // Check if panes are allowed by nav item config or settings mode
    const allowStart = isSettingsMode || !(currentNavItem?.noStartPane);
    const allowEnd = !suppressEnd && !isSettingsMode; // Settings mode suppresses end pane
    const utilityEndPane = currentNavItem?.utilityEndPane ?? false;
    const externalEndPaneInput = currentNavItem?.externalEndPaneInput ?? false;

    // Internal hideCenter state (not exposed as prop, always false for now)
    const internalHideCenter = false;

    // Calculate requested pane count (how many panes the app wants to show)
    const requestedPaneCount = useMemo(() => {
      return (internalHideStart || !allowStart ? 0 : 1) + 1 + (internalHideEnd || !allowEnd ? 0 : 1);
    }, [internalHideStart, internalHideEnd, allowStart, allowEnd]);

    // Calculate effective priority - reset to Center when all panes fit
    const effectivePriority = useMemo(() => {
      if (requestedPaneCount <= maxPanes) {
        return "Center";
      }
      return internalPriorityPane;
    }, [requestedPaneCount, maxPanes, internalPriorityPane]);

    // Auto-reset priorityPane when all requested panes fit
    // Matches fx-layout._updateEffectivePriority
    useEffect(() => {
      if (requestedPaneCount <= maxPanes && internalPriorityPane !== "Center") {
        setInternalPriorityPane("Center");
        onLayoutChange?.({ priorityPane: "Center" });
      }
    }, [requestedPaneCount, maxPanes, internalPriorityPane, onLayoutChange]);

    // Calculate effective visibility using extracted helper
    const visibilityInput = useMemo((): PaneVisibilityInput => ({
      allowStart, allowEnd, suppressEnd,
      internalHideStart, internalHideEnd, internalHideCenter,
      effectivePriority, maxPanes,
    }), [allowStart, allowEnd, suppressEnd, internalHideStart, internalHideEnd, internalHideCenter, effectivePriority, maxPanes]);

    const { showStart: effectiveShowStart, showCenter: effectiveShowCenter, showEnd: effectiveShowEnd } = useMemo(
      () => calculatePaneVisibility(visibilityInput),
      [visibilityInput]
    );

    // When a pane transitions hidden→visible, animate width from 0 to target.
    const prevShowStartRef = useRef(effectiveShowStart);
    const prevShowEndRef = useRef(effectiveShowEnd);
    // Refs for target widths — read inside useLayoutEffect to avoid spurious re-runs on splitter drag
    const targetStartWidthRef = useRef(0);
    const targetEndWidthRef = useRef(0);

    // Whether input should be hidden entirely (external input in end pane handles it)
    const hideInputEntirely = externalEndPaneInput && effectiveShowEnd;
    // Whether input should be shown in center pane (not moved to end pane)
    // True when: end pane not shown, OR utility end pane (but NOT when external input takes over)
    const inputInCenterPane = !hideInputEntirely && (!effectiveShowEnd || utilityEndPane);
    // Whether input should be shown in end pane
    const inputInEndPane = !hideInputEntirely && effectiveShowEnd && !utilityEndPane;

    // Bottom padding and fade mask for pane content when input overlays it
    const inputOverlayPadding = mobileLayout ? "11rem" : "10.5rem";
    const inputFadeMask = `linear-gradient(180deg, #000 0%, #000 calc(100% - ${mobileLayout ? "4.5rem" : "4rem"}), transparent calc(100% - ${mobileLayout ? "2.5rem" : "2rem"}))`;

    // Calculate vertical breakpoints based on nav item count (deterministic)
    const fixedItemCount = hideNotifications ? 2 : 3; // profile, toggle (+ notifications when enabled)
    const { mergeBreakpoint, compactBreakpoint } = useMemo(
      () => calculateVerticalBreakpoints(navItems.length, fixedItemCount),
      [navItems.length, fixedItemCount]
    );

    // Track previous state for vertical compact hysteresis
    const prevVerticalCompactRef = useRef(false);

    // Unified responsive behavior - single ResizeObserver for width AND height
    useEffect(() => {
      if (!layoutRef.current) return;

      const handleResize = (width: number, height: number) => {
        const result = processResize(width, height, {
          mergeBreakpoint,
          compactBreakpoint,
          threePaneMinWidth,
          navCollapsed,
          animationsEnabled,
          previousTotalWidth: previousTotalWidthRef.current,
          lastMaxPanes: lastMaxPanesRef.current,
          prevVerticalCompact: prevVerticalCompactRef.current,
        });

        previousTotalWidthRef.current = width;
        setTotalWidth(width);

        setHorizontalCompactMode((prev) => {
          if (prev && result.closeUserMenu) setUserMenuOpen(false);
          return result.isHorizontalCompact;
        });

        prevVerticalCompactRef.current = result.verticalCompact;
        setNavMerged(result.navMerged);
        setVerticalCompactMode(result.verticalCompact);

        if (result.maxPanes === null) return;

        if (result.collapseNav) {
          setNavCollapsed(true);
          if (result.triggerNavTransition) {
            setNavTransitioning(true);
            setNavTransitionDirection('collapsing');
            if (navTransitionTimeoutRef.current) clearTimeout(navTransitionTimeoutRef.current);
            navTransitionTimeoutRef.current = setTimeout(() => {
              setNavTransitioning(false);
              setNavTransitionDirection(null);
            }, 400);
          }
        }

        setMaxPanes(result.maxPanes);
        lastMaxPanesRef.current = result.maxPanes;
      };

      const observer = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (entry) {
          handleResize(entry.contentRect.width, entry.contentRect.height);
        }
      });

      observer.observe(layoutRef.current);
      return () => {
        observer.disconnect();
      };
    }, [navCollapsed, mergeBreakpoint, compactBreakpoint, threePaneMinWidth, animationsEnabled]);

    // Fire visibility change events
    // Fire on initial render AND on subsequent changes so subscribers can sync their state
    const prevStartVisibleRef = useRef<boolean | null>(null);
    const prevEndVisibleRef = useRef<boolean | null>(null);
    const onVisibilityChangeRef = useRef(onVisibilityChange);
    onVisibilityChangeRef.current = onVisibilityChange;

    useEffect(() => {
      // Fire if this is the first render OR if visibility actually changed
      if (prevStartVisibleRef.current === null || prevStartVisibleRef.current !== effectiveShowStart) {
        onVisibilityChangeRef.current?.({
          pane: "start",
          visible: effectiveShowStart,
        });
      }
      prevStartVisibleRef.current = effectiveShowStart;
    }, [effectiveShowStart]);

    useEffect(() => {
      // Fire if this is the first render OR if visibility actually changed
      if (prevEndVisibleRef.current === null || prevEndVisibleRef.current !== effectiveShowEnd) {
        onVisibilityChangeRef.current?.({
          pane: "end",
          visible: effectiveShowEnd,
        });
      }
      prevEndVisibleRef.current = effectiveShowEnd;
    }, [effectiveShowEnd]);

    // Scroll all pane contents to top when layout changes on mobile
    // This ensures the user sees the header when navigating between panes
    useEffect(() => {
      if (!mobileLayout) return;

      // Scroll all content areas to top
      startContentRef.current?.scrollTo({ top: 0 });
      centerContentRef.current?.scrollTo({ top: 0 });
      endContentRef.current?.scrollTo({ top: 0 });
    }, [mobileLayout, effectiveShowStart, effectiveShowCenter, effectiveShowEnd, internalPriorityPane]);

    useImperativeHandle(ref, () => ({
      focusPane: () => {},
      closeProfileFlyout: () => {
        setUserMenuOpen(false);
        setUserMenuFromHamburger(false);
      },
      get nativeElement() { return layoutRef.current; },
      getNativeElement: () => layoutRef.current,
    }));

    // Navigation selection
    const handleNavSelect = useCallback(
      (key: string) => {
        const previousMode = mode;
        if (key !== previousMode) {
          onModeChange?.({ mode: key, previousMode });
        }
        if (navigationOpen) {
          setNavigationOpen(false);
        }
      },
      [mode, onModeChange, navigationOpen]
    );

    // Toggle pane visibility - update internal state immediately for responsive UI,
    // and fire onLayoutChange so the app can sync its state.
    const toggleStartPane = useCallback(() => {
      const shouldHide = effectiveShowStart;
      let newPriority: PriorityPane;

      if (shouldHide) {
        newPriority = "Center";
      } else {
        // Only set Start priority if space is constrained
        const requestedAfter = (!shouldHide ? 1 : 0) + 1 + (internalHideEnd ? 0 : 1);
        newPriority = requestedAfter <= maxPanes ? "Center" : "Start";
      }

      // Mark that we're making internal changes so useEffects won't override
      isInternalStartChangeRef.current = true;
      isInternalPriorityChangeRef.current = true;

      // Update internal state immediately for responsive UI
      setInternalHideStart(shouldHide);
      setInternalPriorityPane(newPriority);

      // Fire event so app can sync its state
      onLayoutChange?.({ priorityPane: newPriority, hideStart: shouldHide });
    }, [effectiveShowStart, internalHideEnd, maxPanes, onLayoutChange]);

    const toggleEndPane = useCallback(() => {
      const currentlyVisible = effectiveShowEnd;
      const newHideEnd = currentlyVisible; // If visible, hide it. If hidden, show it.
      let newPriority: PriorityPane;

      if (currentlyVisible) {
        // Hiding end pane
        newPriority = "Center";
      } else {
        // Showing end pane - only set End priority if space is constrained
        const requestedPanes = (internalHideStart ? 0 : 1) + 1 + 1; // start + center + end
        newPriority = requestedPanes <= maxPanes ? "Center" : "End";
      }

      // Mark that we're making internal changes so useEffects won't override
      isInternalEndChangeRef.current = true;
      isInternalPriorityChangeRef.current = true;

      // Update internal state immediately for responsive UI
      setInternalHideEnd(newHideEnd);
      setInternalPriorityPane(newPriority);

      // Fire event so app can sync its state
      onLayoutChange?.({ priorityPane: newPriority, hideEnd: newHideEnd });
    }, [effectiveShowEnd, internalHideStart, maxPanes, onLayoutChange]);

    const openNavigation = useCallback(() => {
      setNavigationOpen(true);
    }, []);

    const closeNavigation = useCallback(() => {
      setNavigationClosing(true);
      setTimeout(() => {
        setNavigationOpen(false);
        setNavigationClosing(false);
      }, 300); // Match animation duration
    }, []);

    // Close navigation dialog when exiting compact mode (either horizontal or vertical)
    useEffect(() => {
      if (!compactMode && navigationOpen) {
        setNavigationOpen(false);
        setNavigationClosing(false);
      }
    }, [compactMode, navigationOpen]);

    // Focus close button when navigation dialog opens
    useEffect(() => {
      if (navigationOpen && navDialogCloseRef.current) {
        navDialogCloseRef.current.focus();
      }
    }, [navigationOpen]);

    // Calculate nav width (0 in effective compact mode)
    const navWidth = compactMode ? 0 : (navCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH);

    // Derive mainAreaWidth from totalWidth and navWidth (recalculates when nav collapses/expands)
    const mainAreaWidth = totalWidth - navWidth;

    // Track pane widths in pixels. Initialized to defaults, only updated by user drag or reset.
    // These represent the "preferred" width - what the pane would be if space allows.
    const [startWidth, setStartWidth] = useState<number>(DEFAULT_START_WIDTH);
    const [endWidth, setEndWidth] = useState<number>(DEFAULT_END_WIDTH);

    // Calculate constrained widths based on available space using extracted helper
    const { targetStartWidth, targetEndWidth } = useMemo(
      () => calculateConstrainedWidths({ startWidth, endWidth, mainAreaWidth, effectiveShowStart, effectiveShowEnd }),
      [startWidth, endWidth, mainAreaWidth, effectiveShowStart, effectiveShowEnd]
    );

    // Final widths as CSS values
    const finalStartWidth = effectiveShowStart ? `${targetStartWidth}px` : "0px";
    const finalEndWidth = effectiveShowEnd ? `${targetEndWidth}px` : "0px";

    // Keep target width refs in sync so useLayoutEffect can read them without deps
    targetStartWidthRef.current = targetStartWidth;
    targetEndWidthRef.current = targetEndWidth;

    // useLayoutEffect runs after React commits but before paint. Force width=0 + reflow,
    // then set target — browser records 0→target and fires CSS transition.
    // targetStartWidth/targetEndWidth read via ref to avoid spurious re-runs on splitter drag.
    useLayoutEffect(() => {
      const wasHidden = !prevShowStartRef.current;
      prevShowStartRef.current = effectiveShowStart;
      if (wasHidden && effectiveShowStart && paneAnimationsEnabled && startPaneRef.current) {
        const el = startPaneRef.current;
        el.style.width = "0px";
        el.getBoundingClientRect(); // force reflow
        el.style.width = `${targetStartWidthRef.current}px`;
      }
    }, [effectiveShowStart, paneAnimationsEnabled]);
    useLayoutEffect(() => {
      const wasHidden = !prevShowEndRef.current;
      prevShowEndRef.current = effectiveShowEnd;
      if (wasHidden && effectiveShowEnd && paneAnimationsEnabled && endPaneRef.current) {
        const el = endPaneRef.current;
        el.style.width = "0px";
        el.getBoundingClientRect();
        el.style.width = `${targetEndWidthRef.current}px`;
      }
    }, [effectiveShowEnd, paneAnimationsEnabled]);

    // Resize end handler - stores pixel widths directly
    const handleResizeEnd = useCallback((startWidthPx: number, _centerWidthPx: number, endWidthPx: number) => {
      if (effectiveShowStart) setStartWidth(startWidthPx);
      if (effectiveShowEnd) setEndWidth(endWidthPx);
    }, [effectiveShowStart, effectiveShowEnd]);

    const handleResetToDefault = useCallback(() => {
      setStartWidth(DEFAULT_START_WIDTH);
      setEndWidth(DEFAULT_END_WIDTH);
    }, []);

    // Calculate input mode based on layout state
    // Input is in END pane when: end is visible AND not utility mode
    // Input is in CENTER pane when: end is hidden OR utility mode
    const inputMode = useMemo((): "oneline" | "multiline" => {
      const isInEndPane = effectiveShowEnd && !utilityEndPane;
      return isInEndPane ? "oneline" : "multiline";
    }, [effectiveShowEnd, utilityEndPane]);

    // Calculate leftmost visible pane for hamburger positioning
    // Used by FxPaneHeader to show hamburger only in the leftmost pane
    const leftmostVisiblePane = useMemo((): "start" | "center" | "end" => {
      if (effectiveShowStart) return "start";
      if (effectiveShowCenter) return "center";
      return "end";
    }, [effectiveShowStart, effectiveShowCenter]);

    // Context value for child components (headers)
    const contextValue = useMemo(
      () => ({
        startVisible: effectiveShowStart,
        endVisible: effectiveShowEnd,
        maxPanes,
        compactMode: compactMode,
        leftmostVisiblePane,
        allowStart,
        allowEnd,
        suppressEnd,
        utilityEndPane,
        isSettingsMode,
        inputMode,
        toggleStartPane,
        toggleEndPane,
        openNavigation,
      }),
      [effectiveShowStart, effectiveShowEnd, maxPanes, compactMode, leftmostVisiblePane, allowStart, allowEnd, suppressEnd, utilityEndPane, isSettingsMode, inputMode, toggleStartPane, toggleEndPane, openNavigation]
    );

    // Calculate pane widths using extracted helper
    const { startPaneWidth, centerPaneMinWidth, endPaneWidth } = useMemo(
      () => calculatePaneWidths({
        effectiveShowStart,
        effectiveShowCenter,
        effectiveShowEnd,
        mobileLayout,
        targetStartWidth,
        targetEndWidth,
      }),
      [effectiveShowStart, effectiveShowCenter, effectiveShowEnd, mobileLayout, targetStartWidth, targetEndWidth]
    );

    return (
      <FxLayoutContext.Provider value={contextValue}>
        <div
          ref={layoutRef}
          id={id}
          data-mode={mode}
          data-hide-start={!effectiveShowStart ? "" : undefined}
          data-hide-end={!effectiveShowEnd ? "" : undefined}
          className={cn(
            "flex h-full w-full overflow-hidden relative bg-sapphire-canvas-primary",
            className
          )}
          style={{
            // Use dvh on mobile for accurate viewport height (accounts for browser chrome)
            ...(mobileLayout ? { height: "100dvh" } : {}),
            ...style,
          }}
          data-testid={dataTestId}
        >
          {/* Side Navigation (hidden in compact mode - both horizontal and vertical) */}
          {!compactMode && (
            <SidebarNav
              sideNavRef={sideNavRef}
              notificationsItemRef={notificationsItemRef}
              userItemRef={userItemRef}
              navCollapsed={navCollapsed}
              navTransitioning={navTransitioning}
              navTransitionDirection={navTransitionDirection}
              navMerged={navMerged}
              navWidth={navWidth}
              animationsEnabled={animationsEnabled}
              effectiveShowStart={effectiveShowStart}
              hideNotifications={hideNotifications}
              notificationsBadge={notificationsBadge}
              notificationsLocked={notificationsLocked}
              navLogo={navLogo}
              navItems={navItems}
              mode={mode}
              isSettingsMode={isSettingsMode}
              userMenuOpen={userMenuOpen}
              selectedUserAccount={_selectedUserAccount}
              dataTestId={dataTestId}
              t={t}
              onNavSelect={handleNavSelect}
              onNotificationsClick={onNotificationsClick}
              onAddClick={onAddClick}
              onUserItemClick={() => {
                if (userMenu) {
                  if (userMenuOpen) {
                    setUserMenuOpen(false);
                  } else {
                    const opener = userItemRef.current?.getNativeElement();
                    if (opener) setUserMenuOpener(opener);
                    setUserMenuOpen(true);
                  }
                }
              }}
              onToggleCollapsed={toggleNavCollapsed}
              onTransitionEnd={handleNavTransitionEnd}
            />
          )}

          {/* Main content area */}
          <main
            className="flex flex-1 h-full min-w-0 relative"
            style={{
              // In mobile layout, clip all overflow to prevent any child from making page wider
              overflow: mobileLayout ? "hidden" : "visible",
              overflowX: mobileLayout ? "clip" : undefined,
            }}
          >
            {/* Start Pane - always rendered, hidden with CSS for animations */}
            {allowStart && (
              <aside
                ref={startPaneRef}
                aria-label={t("FX_START_PANE")}
                data-pane="start"
                inert={!effectiveShowStart || undefined}
                className={cn(
                  "flex flex-col shrink-0 relative bg-sapphire-shell-bg-primary",
                )}
                style={{
                  width: startPaneWidth,
                  minWidth: 0,
                  height: "100%",
                  overflow: "hidden",
                  transition: getPaneTransition(paneAnimationsEnabled),
                }}
              >
                {/* Header */}
                <div
                  className="shrink-0"
                  data-sap-ui-fastnavgroup="true"
                  style={{
                    paddingInline: mobileLayout ? "1rem" : "1.5rem",
                  }}
                >
                  {isValidElement(startHeader)
                    ? cloneElement(startHeader as React.ReactElement<any>, { showBorder: startScrolled })
                    : startHeader}
                </div>
                {/* Content - scrollable area */}
                <div
                  ref={startContentRef}
                  className="flex-1 fx-pane-content min-h-0"
                  data-sap-ui-fastnavgroup="true"
                  onScrollCapture={(e) => {
                    const target = e.target as HTMLElement;
                    setStartScrolled(target.scrollTop > 0);
                  }}
                  style={{
                    ...scrollbarStyle,
                  }}
                >
                  {startContent}
                </div>
              </aside>
            )}

            {/* Resize handle between start and center (invisible, overlays the border) */}
            {effectiveShowStart && effectiveShowCenter && (
              <div className="w-0 shrink-0 relative" style={{ marginLeft: "-8px", marginRight: "-8px", width: "16px", zIndex: 10 }}>
                <ResizeHandle
                  separator="start"
                  startPaneRef={startPaneRef}
                  centerPaneRef={centerPaneRef}
                  endPaneRef={endPaneRef}
                  onResizeEnd={handleResizeEnd}
                  onResetToDefault={handleResetToDefault}
                  ariaLabel={t("FX_RESIZE_START_CENTER")}
                />
              </div>
            )}

            {/* Center Pane - uses flex-grow to fill remaining space (no explicit width) */}
            <div
              ref={centerPaneRef}
              data-pane="center"
              className="flex flex-col relative bg-background border-l border-border"
              style={{
                boxShadow: "0 22px 14px 0 rgba(0,0,0,0.06), 0 182px 111px 0 rgba(0,0,0,0.05)",
                flex: effectiveShowCenter ? "1 1 auto" : "0 0 0%",
                minWidth: centerPaneMinWidth,
                height: "100%",
                overflow: "hidden",
                visibility: effectiveShowCenter ? "visible" : "hidden",
                zIndex: 1,
                transition: paneAnimationsEnabled ? `flex ${PANE_TRANSITION}` : "none",
              }}
            >
              {/* Header - outside scroll area */}
              <div
                className="shrink-0"
                data-sap-ui-fastnavgroup="true"
                style={{
                  paddingInline: mobileLayout ? "1rem" : "1.5rem",
                }}
              >
                {isValidElement(centerHeader)
                  ? cloneElement(centerHeader as React.ReactElement<any>, { showBorder: centerScrolled })
                  : centerHeader}
              </div>
              {/* Content - scrollable area */}
              <div
                ref={centerContentRef}
                className="flex-1 fx-pane-content min-h-0"
                data-sap-ui-fastnavgroup="true"
                onScrollCapture={(e) => {
                  const target = e.target as HTMLElement;
                  setCenterScrolled(target.scrollTop > 0);
                }}
                style={{
                  ...scrollbarStyle,
                  // Add padding at bottom when input is shown in center pane so content isn't covered
                  paddingBottom: input && inputInCenterPane ? inputOverlayPadding : 0,
                  // Fade content at bottom edge when input is shown in center pane
                  ...(input && inputInCenterPane ? {
                    WebkitMaskImage: inputFadeMask,
                    maskImage: inputFadeMask,
                  } : {}),
                }}
              >
                {centerContent}
                {children}
              </div>
            </div>


            {/* Resize handle between center and end (invisible, overlays the border) */}
            {effectiveShowCenter && effectiveShowEnd && (
              <div className="w-0 shrink-0 relative" style={{ marginLeft: "-8px", marginRight: "-8px", width: "16px", zIndex: 10 }}>
                <ResizeHandle
                  separator="end"
                  startPaneRef={startPaneRef}
                  centerPaneRef={centerPaneRef}
                  endPaneRef={endPaneRef}
                  onResizeEnd={handleResizeEnd}
                  onResetToDefault={handleResetToDefault}
                  ariaLabel={t("FX_RESIZE_CENTER_END")}
                />
              </div>
            )}

            {/* End Pane - always rendered when allowed, hidden with CSS for animations */}
            {allowEnd && (
              <aside
                ref={endPaneRef}
                aria-label={t("FX_END_PANE")}
                data-pane="end"
                inert={!effectiveShowEnd || undefined}
                className={cn(
                  "flex flex-col shrink-0 relative bg-sapphire-shell-bg-primary",
                  !mobileLayout && "border-l border-border"
                )}
                style={{
                  width: endPaneWidth,
                  minWidth: 0,
                  height: "100%",
                  overflow: "hidden",
                  transition: getPaneTransition(paneAnimationsEnabled),
                }}
              >
                {/* Header - outside scroll area */}
                <div
                  className="shrink-0"
                  data-sap-ui-fastnavgroup="true"
                  style={{
                    paddingInline: mobileLayout ? "1rem" : "1.5rem",
                  }}
                >
                  {isValidElement(endHeader)
                    ? cloneElement(endHeader as React.ReactElement<any>, { showBorder: endScrolled })
                    : endHeader}
                </div>
                {/* Content - scrollable area */}
                <div
                  ref={endContentRef}
                  className="flex-1 fx-pane-content min-h-0"
                  data-sap-ui-fastnavgroup="true"
                  onScrollCapture={(e) => {
                    const target = e.target as HTMLElement;
                    setEndScrolled(target.scrollTop > 0);
                  }}
                  style={{
                    ...scrollbarStyle,
                    // Add padding at bottom when input is shown in end pane so content isn't covered
                    paddingBottom: input && inputInEndPane ? inputOverlayPadding : 0,
                    // Fade content at bottom edge when input is shown in end pane
                    ...(input && inputInEndPane ? {
                      WebkitMaskImage: inputFadeMask,
                      maskImage: inputFadeMask,
                    } : {}),
                  }}
                >
                  {endContent}
                </div>
              </aside>
            )}

            {/* Input Container - positioned over center or end pane */}
            {/* Hidden in settings mode or when externalEndPaneInput and end pane is open */}
            {input && !isSettingsMode && !hideInputEntirely && (effectiveShowCenter || inputInEndPane) && (
              <InputContainer
                input={input}
                inputInEndPane={inputInEndPane}
                mobileLayout={mobileLayout}
                effectiveShowStart={effectiveShowStart}
                effectiveShowEnd={effectiveShowEnd}
                finalStartWidth={finalStartWidth}
                finalEndWidth={finalEndWidth}
                paneAnimationsEnabled={paneAnimationsEnabled}
              />
            )}
          </main>

          {/* User Menu - clone and inject open/opener/useDialog/onClose/onBackClick */}
          {userMenu && React.cloneElement(userMenu, {
            open: userMenuOpen,
            opener: userMenuOpener,
            useDialog: mobileLayout || userMenuFromHamburger,
            placement: userMenu.props.placement ?? "End",
            verticalAlign: userMenu.props.verticalAlign ?? "Top",
            offset: userMenu.props.offset ?? 16,
            onClose: () => {
              setUserMenuOpen(false);
              setUserMenuFromHamburger(false);
            },
            onBackClick: () => {
              // Panel already closed via onClose; reopen navigation dialog
              setNavigationOpen(true);
            },
          })}

          {/* Navigation Dialog (compact mode - horizontal or vertical) */}
          {compactMode && navigationOpen && (
            <NavDialog
              navDialogCloseRef={navDialogCloseRef}
              navigationClosing={navigationClosing}
              hideNotifications={hideNotifications}
              notificationsBadge={notificationsBadge}
              navLogo={navLogo}
              navItems={navItems}
              mode={mode}
              isSettingsMode={isSettingsMode}
              userMenuOpen={userMenuOpen}
              selectedUserAccount={_selectedUserAccount}
              dataTestId={dataTestId}
              t={t}
              onClose={closeNavigation}
              onNavSelect={handleNavSelect}
              onNotificationsClick={onNotificationsClick}
              onAddClick={onAddClick}
              onProfileClick={() => {
                if (userMenu) {
                  setNavigationClosing(true);
                  setTimeout(() => {
                    setNavigationOpen(false);
                    setNavigationClosing(false);
                    setUserMenuFromHamburger(true);
                    setUserMenuOpen(true);
                  }, 300);
                }
              }}
            />
          )}
        </div>
      </FxLayoutContext.Provider>
    );
}
