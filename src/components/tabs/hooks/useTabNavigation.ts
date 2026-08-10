import { useCallback } from "react";
import { UseTabNavigationOptions } from "../../../types/tabs";

/**
 * Hook for managing tab keyboard navigation
 *
 * Implements ARIA Tabs pattern:
 * - Left/Right: Move focus between tabs
 * - Home: Move focus to first tab
 * - End: Move focus to last tab
 * - Enter/Space: Select focused tab
 * - Tab: Move focus out of tab list
 */
export function useTabNavigation(options: UseTabNavigationOptions) {
  const {
    tabCount,
    focusedIndex,
    disabledTabs = new Set(),
    onNavigate,
    onSelect,
    rtl = false,
  } = options;

  // Find next enabled tab in a direction
  const findNextEnabledTab = useCallback(
    (currentIndex: number, direction: 1 | -1): number => {
      if (tabCount === 0) return -1;

      let nextIndex = currentIndex;
      let attempts = 0;

      do {
        nextIndex = nextIndex + direction;

        // Wrap around
        if (nextIndex >= tabCount) {
          nextIndex = 0;
        } else if (nextIndex < 0) {
          nextIndex = tabCount - 1;
        }

        attempts++;

        // Break if we've checked all tabs
        if (attempts >= tabCount) {
          // If all tabs are disabled, return current
          return currentIndex;
        }
      } while (disabledTabs.has(nextIndex));

      return nextIndex;
    },
    [tabCount, disabledTabs]
  );

  // Find first enabled tab
  const findFirstEnabledTab = useCallback((): number => {
    for (let i = 0; i < tabCount; i++) {
      if (!disabledTabs.has(i)) {
        return i;
      }
    }
    return 0;
  }, [tabCount, disabledTabs]);

  // Find last enabled tab
  const findLastEnabledTab = useCallback((): number => {
    for (let i = tabCount - 1; i >= 0; i--) {
      if (!disabledTabs.has(i)) {
        return i;
      }
    }
    return tabCount - 1;
  }, [tabCount, disabledTabs]);

  // Handle keyboard events
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Determine effective direction based on RTL
      const getDirection = (key: string): 1 | -1 | null => {
        if (key === "ArrowRight") {
          return rtl ? -1 : 1;
        }
        if (key === "ArrowLeft") {
          return rtl ? 1 : -1;
        }
        return null;
      };

      switch (e.key) {
        case "ArrowRight":
        case "ArrowLeft": {
          e.preventDefault();
          const direction = getDirection(e.key);
          if (direction !== null) {
            const nextIndex = findNextEnabledTab(focusedIndex, direction);
            if (nextIndex !== focusedIndex) {
              onNavigate?.(nextIndex);
            }
          }
          break;
        }

        case "Home":
          e.preventDefault();
          {
            const firstIndex = findFirstEnabledTab();
            if (firstIndex !== focusedIndex) {
              onNavigate?.(firstIndex);
            }
          }
          break;

        case "End":
          e.preventDefault();
          {
            const lastIndex = findLastEnabledTab();
            if (lastIndex !== focusedIndex) {
              onNavigate?.(lastIndex);
            }
          }
          break;

        case "Enter":
        case " ":
          e.preventDefault();
          if (focusedIndex >= 0 && !disabledTabs.has(focusedIndex)) {
            onSelect?.(focusedIndex);
          }
          break;

        case "Tab":
          // Let Tab/Shift+Tab bubble to move focus outside tab list
          break;

        default:
          break;
      }
    },
    [
      focusedIndex,
      rtl,
      disabledTabs,
      findNextEnabledTab,
      findFirstEnabledTab,
      findLastEnabledTab,
      onNavigate,
      onSelect,
    ]
  );

  return {
    handleKeyDown,
    findNextEnabledTab,
    findFirstEnabledTab,
    findLastEnabledTab,
  };
}
