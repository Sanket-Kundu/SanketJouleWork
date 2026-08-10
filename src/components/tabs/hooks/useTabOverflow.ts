import { useState, useEffect, useCallback, useRef } from "react";
import { TabOverflowMode } from "../../../types/tabs";

export interface UseTabOverflowOptions {
  /** Whether overflow handling is enabled */
  enabled?: boolean;
  /** Overflow mode */
  overflowMode: TabOverflowMode | `${TabOverflowMode}`;
  /** Tab IDs in order */
  tabIds: string[];
  /** Currently selected tab ID */
  selectedTabId: string | null;
  /** Tab list element ref */
  tabListRef: React.RefObject<HTMLElement | null>;
}

export interface UseTabOverflowResult {
  /** Tab IDs that are visible (not overflowed) */
  visibleTabIds: string[];
  /** Tab IDs in the start overflow menu */
  startOverflowTabIds: string[];
  /** Tab IDs in the end overflow menu */
  endOverflowTabIds: string[];
  /** Whether there's start overflow */
  hasStartOverflow: boolean;
  /** Whether there's end overflow */
  hasEndOverflow: boolean;
  /** Force recalculation */
  recalculate: () => void;
  /** Whether overflow has been calculated (ready for hiding) */
  isReady: boolean;
}

/**
 * Hook to manage tab overflow behavior
 * Calculates which tabs should be visible vs hidden in overflow menus
 */
export function useTabOverflow({
  enabled = true,
  overflowMode,
  tabIds,
  selectedTabId,
  tabListRef,
}: UseTabOverflowOptions): UseTabOverflowResult {
  const [visibleTabIds, setVisibleTabIds] = useState<string[]>(tabIds);
  const [startOverflowTabIds, setStartOverflowTabIds] = useState<string[]>([]);
  const [endOverflowTabIds, setEndOverflowTabIds] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);

  // Store measured widths - these persist across re-renders
  const tabWidthsRef = useRef<Map<string, number>>(new Map());
  // Track if we've done initial measurement
  const hasMeasuredRef = useRef(false);

  // Track calculation frame
  const rafId = useRef<number | null>(null);

  // Measure all tabs - must be called when tabs are visible
  const measureTabs = useCallback(() => {
    if (!tabListRef.current) return false;

    const container = tabListRef.current;
    const tabElements = container.querySelectorAll('[role="tab"][data-tab-id]');

    let measuredCount = 0;

    tabElements.forEach((element) => {
      const tabId = element.getAttribute('data-tab-id');
      if (tabId && tabIds.includes(tabId)) {
        const htmlElement = element as HTMLElement;

        // Check if element is visible (not display:none)
        const rect = htmlElement.getBoundingClientRect();
        if (rect.width > 0) {
          const style = window.getComputedStyle(htmlElement);
          const width = rect.width +
            parseFloat(style.marginLeft || '0') +
            parseFloat(style.marginRight || '0');

          tabWidthsRef.current.set(tabId, width);
          measuredCount++;
        } else if (tabWidthsRef.current.has(tabId)) {
          // Already measured, count it
          measuredCount++;
        }
      }
    });

    const allMeasured = measuredCount === tabIds.length;
    if (allMeasured) {
      hasMeasuredRef.current = true;
    }
    return allMeasured;
  }, [tabIds, tabListRef]);

  const calculateOverflow = useCallback(() => {
    if (!enabled || !tabListRef.current || tabIds.length === 0) {
      setVisibleTabIds(tabIds);
      setStartOverflowTabIds([]);
      setEndOverflowTabIds([]);
      setIsReady(true);
      return;
    }

    const container = tabListRef.current;
    const containerWidth = container.clientWidth;

    // If container has no width yet, skip
    if (containerWidth === 0) {
      return;
    }

    // Check if we have measurements for all tabs
    if (!hasMeasuredRef.current || tabWidthsRef.current.size < tabIds.length) {
      // Try to measure
      if (!measureTabs()) {
        // Not all tabs measured yet, skip calculation
        return;
      }
    }

    const tabWidths = tabWidthsRef.current;
    let totalWidth = 0;
    for (const tabId of tabIds) {
      totalWidth += tabWidths.get(tabId) || 0;
    }

    // Reserve space for overflow buttons
    const overflowButtonWidth = 52;
    const isStartAndEnd = String(overflowMode) === "StartAndEnd";

    // If everything fits, no overflow needed
    if (totalWidth <= containerWidth) {
      setVisibleTabIds(tabIds);
      setStartOverflowTabIds([]);
      setEndOverflowTabIds([]);
      setIsReady(true);
      return;
    }

    // Calculate available width (accounting for overflow buttons)
    let availableWidth = containerWidth;
    if (isStartAndEnd) {
      availableWidth -= overflowButtonWidth * 2;
    } else {
      availableWidth -= overflowButtonWidth;
    }

    // Find selected tab index
    const selectedIndex = selectedTabId ? tabIds.indexOf(selectedTabId) : 0;
    const safeSelectedIndex = selectedIndex >= 0 ? selectedIndex : 0;

    if (isStartAndEnd) {
      // StartAndEnd mode: keep selected tab visible, overflow on both sides
      const visible: string[] = [];
      const startOverflow: string[] = [];
      const endOverflow: string[] = [];

      // Start from selected tab and expand outward
      let usedWidth = tabWidths.get(tabIds[safeSelectedIndex]) || 0;
      visible.push(tabIds[safeSelectedIndex]);

      let leftIndex = safeSelectedIndex - 1;
      let rightIndex = safeSelectedIndex + 1;
      let addedSomething = true;

      // Keep adding tabs alternating left/right until no more fit
      while (addedSomething && (leftIndex >= 0 || rightIndex < tabIds.length)) {
        addedSomething = false;

        // Try to add from the right first
        if (rightIndex < tabIds.length) {
          const rightWidth = tabWidths.get(tabIds[rightIndex]) || 0;
          if (usedWidth + rightWidth <= availableWidth) {
            visible.push(tabIds[rightIndex]);
            usedWidth += rightWidth;
            rightIndex++;
            addedSomething = true;
          }
        }

        // Try to add from the left
        if (leftIndex >= 0) {
          const leftWidth = tabWidths.get(tabIds[leftIndex]) || 0;
          if (usedWidth + leftWidth <= availableWidth) {
            visible.unshift(tabIds[leftIndex]);
            usedWidth += leftWidth;
            leftIndex--;
            addedSomething = true;
          }
        }
      }

      // Remaining tabs go to overflow
      while (leftIndex >= 0) {
        startOverflow.unshift(tabIds[leftIndex]);
        leftIndex--;
      }
      while (rightIndex < tabIds.length) {
        endOverflow.push(tabIds[rightIndex]);
        rightIndex++;
      }

      setVisibleTabIds(visible);
      setStartOverflowTabIds(startOverflow);
      setEndOverflowTabIds(endOverflow);
    } else {
      // End mode: fill from start, overflow at end
      const visible: string[] = [];
      const endOverflow: string[] = [];
      let usedWidth = 0;

      // First pass: add tabs until we run out of space
      for (let i = 0; i < tabIds.length; i++) {
        const tabId = tabIds[i];
        const width = tabWidths.get(tabId) || 0;

        if (usedWidth + width <= availableWidth) {
          visible.push(tabId);
          usedWidth += width;
        } else {
          endOverflow.push(tabId);
        }
      }

      // If selected tab is in overflow, swap it with the last visible tab
      if (selectedTabId && endOverflow.includes(selectedTabId)) {
        const selectedWidth = tabWidths.get(selectedTabId) || 0;

        // Remove tabs from visible until selected fits
        while (visible.length > 0) {
          const lastVisible = visible[visible.length - 1];
          if (lastVisible === selectedTabId) break;

          const lastWidth = tabWidths.get(lastVisible) || 0;
          usedWidth -= lastWidth;
          visible.pop();

          // Move to overflow (at the start of overflow to maintain order)
          const overflowIdx = endOverflow.indexOf(selectedTabId);
          endOverflow.splice(overflowIdx, 0, lastVisible);

          // Check if selected now fits
          if (usedWidth + selectedWidth <= availableWidth) {
            // Add selected tab
            const selIdx = endOverflow.indexOf(selectedTabId);
            endOverflow.splice(selIdx, 1);
            visible.push(selectedTabId);
            usedWidth += selectedWidth;
            break;
          }
        }
      }

      setVisibleTabIds(visible);
      setStartOverflowTabIds([]);
      setEndOverflowTabIds(endOverflow);
    }

    setIsReady(true);
  }, [enabled, overflowMode, tabIds, selectedTabId, tabListRef, measureTabs]);

  // Schedule calculation with RAF for smooth updates
  const scheduleCalculation = useCallback(() => {
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }
    rafId.current = requestAnimationFrame(() => {
      calculateOverflow();
      rafId.current = null;
    });
  }, [calculateOverflow]);

  // Initial calculation after mount - wait for tabs to render
  useEffect(() => {
    if (!enabled) {
      setVisibleTabIds(tabIds);
      setIsReady(true);
      return;
    }

    // Reset measurement state when tab count changes
    if (tabWidthsRef.current.size !== tabIds.length) {
      hasMeasuredRef.current = false;
    }

    // Wait for DOM to be ready with multiple retries
    let retryCount = 0;
    const maxRetries = 20;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const tryCalculate = () => {
      if (measureTabs()) {
        calculateOverflow();
      } else if (retryCount < maxRetries) {
        retryCount++;
        timeoutId = setTimeout(tryCalculate, 16); // ~1 frame
      }
    };

    // Start immediately
    tryCalculate();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [enabled, tabIds, measureTabs, calculateOverflow]);

  // Recalculate when selection changes (don't re-measure, just recalc)
  useEffect(() => {
    if (!enabled || !isReady) return;
    // Selection changed - recalculate with existing measurements
    calculateOverflow();
  }, [selectedTabId, enabled, isReady, calculateOverflow]);

  // Set up ResizeObserver - recalculate on container size change
  useEffect(() => {
    if (!enabled || !tabListRef.current) return;

    let lastWidth = tabListRef.current.clientWidth;

    const observer = new ResizeObserver((entries) => {
      const newWidth = entries[0]?.contentRect?.width ?? 0;
      // Only recalculate if width actually changed
      if (Math.abs(newWidth - lastWidth) > 1) {
        lastWidth = newWidth;
        // Don't clear measurements - tab widths don't change on container resize
        scheduleCalculation();
      }
    });

    observer.observe(tabListRef.current);

    return () => {
      observer.disconnect();
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [enabled, tabListRef, scheduleCalculation]);

  const recalculate = useCallback(() => {
    // Force re-measurement
    hasMeasuredRef.current = false;
    tabWidthsRef.current.clear();
    setIsReady(false);

    // Need to wait for tabs to be visible again
    setTimeout(() => {
      measureTabs();
      calculateOverflow();
    }, 0);
  }, [measureTabs, calculateOverflow]);

  return {
    visibleTabIds,
    startOverflowTabIds,
    endOverflowTabIds,
    hasStartOverflow: startOverflowTabIds.length > 0,
    hasEndOverflow: endOverflowTabIds.length > 0,
    recalculate,
    isReady,
  };
}
