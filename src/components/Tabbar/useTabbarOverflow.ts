import { useState, useEffect, useCallback, useRef, useMemo } from "react";

/** Shallow equality for string arrays — used to skip no-op state updates. */
function arraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export interface UseTabbarOverflowOptions {
  /** Whether overflow handling is enabled */
  enabled?: boolean;
  /** Tab items with their IDs */
  tabs: Array<{ id: string; label: string }>;
  /** Currently selected tab ID */
  selectedTabId: string;
  /** Tab list element ref */
  tabListRef: React.RefObject<HTMLElement | null>;
}

export interface UseTabbarOverflowResult {
  /** Tab IDs that are visible (not overflowed) */
  visibleTabIds: string[];
  /** Tab IDs in the overflow menu */
  overflowTabIds: string[];
  /** Whether there's overflow */
  hasOverflow: boolean;
  /** Whether overflow has been calculated (ready for hiding) */
  isReady: boolean;
}

/**
 * Hook to manage tabbar overflow behavior
 * Calculates which tabs should be visible vs hidden in overflow menu
 */
export function useTabbarOverflow({
  enabled = false,
  tabs,
  selectedTabId,
  tabListRef,
}: UseTabbarOverflowOptions): UseTabbarOverflowResult {
  const [visibleTabIds, setVisibleTabIds] = useState<string[]>(tabs.map(t => t.id));
  const [overflowTabIds, setOverflowTabIds] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);

  // Guarded setters — skip the update (and the re-render it would cause) when
  // the next value is shallow-equal to the current one. This is the backstop
  // against the infinite render loop: even if the incoming `tabIds` reference
  // churns every render, state only changes when the contents actually change.
  const setVisibleTabIdsIfChanged = useCallback((next: string[]) => {
    setVisibleTabIds(prev => (arraysEqual(prev, next) ? prev : next));
  }, []);
  const setOverflowTabIdsIfChanged = useCallback((next: string[]) => {
    setOverflowTabIds(prev => (arraysEqual(prev, next) ? prev : next));
  }, []);

  // Store measured widths - these persist across re-renders
  const tabWidthsRef = useRef<Map<string, number>>(new Map());
  // Track if we've done initial measurement
  const hasMeasuredRef = useRef(false);

  // Track calculation frame
  const rafId = useRef<number | null>(null);

  // Track retry timeout
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Stable array references - memoize to prevent unnecessary re-renders
  const tabIds = useMemo(() => tabs.map(t => t.id), [tabs]);

  // Measure all tabs - must be called when tabs are visible
  const measureTabs = useCallback(() => {
    if (!tabListRef.current) return false;

    const container = tabListRef.current;
    const tabElements = container.querySelectorAll('[data-tab-id]');

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
      setVisibleTabIdsIfChanged(tabIds);
      setOverflowTabIdsIfChanged([]);
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
    const gap = parseFloat(getComputedStyle(container).columnGap || '0');

    let totalWidth = 0;
    for (const tabId of tabIds) {
      totalWidth += tabWidths.get(tabId) || 0;
    }
    // Add gaps between tabs
    totalWidth += (tabIds.length - 1) * gap;

    // Reserve space for overflow button (More button)
    const overflowButtonWidth = 80; // "More" button width

    // If everything fits, no overflow needed
    if (totalWidth <= containerWidth) {
      setVisibleTabIdsIfChanged(tabIds);
      setOverflowTabIdsIfChanged([]);
      setIsReady(true);
      return;
    }

    // Calculate available width (accounting for overflow button + its gap)
    const availableWidth = containerWidth - overflowButtonWidth - gap;

    // End mode: fill from start, overflow at end
    const visible: string[] = [];
    const overflow: string[] = [];
    let usedWidth = 0;

    // First pass: add tabs until we run out of space
    for (let i = 0; i < tabIds.length; i++) {
      const tabId = tabIds[i];
      const width = tabWidths.get(tabId) || 0;
      const neededGap = visible.length > 0 ? gap : 0;

      if (usedWidth + neededGap + width <= availableWidth) {
        visible.push(tabId);
        usedWidth += neededGap + width;
      } else {
        overflow.push(tabId);
      }
    }

    // If selected tab is in overflow, swap it with the last visible tab
    if (overflow.includes(selectedTabId)) {
      const selectedWidth = tabWidths.get(selectedTabId) || 0;

      // Remove tabs from visible until selected fits
      while (visible.length > 0) {
        const lastVisible = visible[visible.length - 1];
        if (lastVisible === selectedTabId) break;

        const lastWidth = tabWidths.get(lastVisible) || 0;
        // Remove last visible tab + its gap
        usedWidth -= lastWidth + (visible.length > 1 ? gap : 0);
        visible.pop();

        // Move to overflow (at the start of overflow to maintain order)
        const overflowIdx = overflow.indexOf(selectedTabId);
        overflow.splice(overflowIdx, 0, lastVisible);

        // Check if selected now fits
        const neededGap = visible.length > 0 ? gap : 0;
        if (usedWidth + neededGap + selectedWidth <= availableWidth) {
          // Add selected tab
          const selIdx = overflow.indexOf(selectedTabId);
          overflow.splice(selIdx, 1);
          visible.push(selectedTabId);
          usedWidth += neededGap + selectedWidth;
          break;
        }
      }
    }

    setVisibleTabIdsIfChanged(visible);
    setOverflowTabIdsIfChanged(overflow);
    setIsReady(true);
  }, [enabled, tabIds, selectedTabId, tabListRef, measureTabs]);

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
      setVisibleTabIdsIfChanged(tabIds);
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

    const tryCalculate = () => {
      if (measureTabs()) {
        calculateOverflow();
      } else if (retryCount < maxRetries) {
        retryCount++;
        retryTimeoutRef.current = setTimeout(tryCalculate, 16); // ~1 frame
      }
    };

    // Start immediately
    tryCalculate();

    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
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

  return {
    visibleTabIds,
    overflowTabIds,
    hasOverflow: overflowTabIds.length > 0,
    isReady,
  };
}
