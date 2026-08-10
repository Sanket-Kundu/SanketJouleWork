import { useState, useCallback } from "react";
import { useOptionalListContext } from "../List";
import { ListSelectionMode } from "../../../types/list";

export interface UseListItemFocusOptions {
  itemRef: React.RefObject<HTMLLIElement>;
  disabled?: boolean;
  selectionMode: ListSelectionMode | `${ListSelectionMode}`;
  accessibleRole?: string;
  controlledSelected?: boolean;
}

export interface UseListItemFocusResult {
  isFocused: boolean;
  isFocusedWithin: boolean;
  isActive: boolean;
  tabIndex: number;
  ariaSelected: boolean | undefined;
  handleFocus: (e: React.FocusEvent<HTMLLIElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLLIElement>) => void;
  handleMouseDown: () => void;
  handleMouseUp: () => void;
  handleMouseDownCapture: () => void;
  focus: () => void;
  blur: () => void;
  getItemIndex: () => number;
}

/**
 * Hook for managing list item focus and active states
 */
export function useListItemFocus(options: UseListItemFocusOptions): UseListItemFocusResult {
  const { itemRef, disabled, selectionMode, accessibleRole, controlledSelected } = options;
  const listContext = useOptionalListContext();

  // Focus state - true only when the list item itself has focus
  const [isFocused, setIsFocused] = useState(false);

  // Focus within state - true when focus is on the item or any of its descendants
  const [isFocusedWithin, setIsFocusedWithin] = useState(false);

  // Active state (pressed)
  const [isActive, setIsActive] = useState(false);

  // Get item index in the list
  const getItemIndex = useCallback(() => {
    let rootList = itemRef.current?.parentElement;
    while (rootList && rootList.getAttribute('role') !== 'list' && rootList.getAttribute('role') !== 'listbox') {
      rootList = rootList.parentElement;
    }

    if (rootList && itemRef.current) {
      const allNavigable = Array.from(
        rootList.querySelectorAll<HTMLElement>(
          'div[data-group-header="true"], li[role="listitem"], li[role="option"]'
        )
      );
      return allNavigable.indexOf(itemRef.current);
    }
    return -1;
  }, [itemRef]);

  // Focus handlers
  const handleFocus = useCallback((e: React.FocusEvent<HTMLLIElement>) => {
    const isItemItself = e.target === itemRef.current;
    setIsFocused(isItemItself);

    // Always set focusedWithin to true when focus enters the item or its descendants
    setIsFocusedWithin(true);

    if (listContext) {
      const itemIndex = getItemIndex();
      if (itemIndex >= 0) {
        listContext.onFocusItem(itemIndex);
      }
    }
  }, [listContext, getItemIndex, itemRef]);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLLIElement>) => {
    const isLeavingItem = !itemRef.current?.contains(e.relatedTarget as Node);
    if (isLeavingItem) {
      setIsFocused(false);
      setIsFocusedWithin(false);
    } else {
      // Focus moved to a descendant, so item itself is no longer focused but focusedWithin stays true
      setIsFocused(false);
    }
  }, [itemRef]);

  // Mouse handlers for active state
  const handleMouseDown = useCallback(() => {
    setIsActive(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsActive(false);
  }, []);

  // Mouse down capture - set focusedWithin early so action buttons become visible
  const handleMouseDownCapture = useCallback(() => {
    setIsFocusedWithin(true);
  }, []);

  // Helper functions
  const focus = useCallback(() => {
    itemRef.current?.focus();
  }, [itemRef]);

  const blur = useCallback(() => {
    itemRef.current?.blur();
  }, [itemRef]);

  // ARIA attributes
  const modeStr = String(selectionMode);
  const isSelected = controlledSelected ?? (listContext?.isSelected(itemRef.current?.getAttribute('data-item-key') || '') || false);

  // Determine if aria-selected should be present:
  // 1. Option role always needs aria-selected (for listbox pattern)
  // 2. For other roles, only include if parent list supports it AND selection is enabled
  const roleStr = String(accessibleRole);
  const supportsAriaSelected = listContext?.supportsAriaSelected ?? false;
  const hasSelection = modeStr !== "None" && modeStr !== "Delete";

  const ariaSelected = roleStr === "Option"
    ? isSelected
    : (supportsAriaSelected && hasSelection ? isSelected : undefined);

  // Roving tabindex
  const itemIndex = getItemIndex();
  const isFocusedItem = listContext?.focusedIndex === itemIndex;
  const isFirstItem = itemIndex === 0;

  // Roving tabindex: focused item gets 0, others get -1
  // This allows Shift+Tab from outside to reach the focused item
  const isTabbable = isFocusedItem || (listContext?.focusedIndex === -1 && isFirstItem);
  const tabbableIndex = isTabbable ? 0 : -1;  // Focused item is always tabbable, even with children
  const tabIndex = disabled ? -1 : tabbableIndex;

  return {
    isFocused,
    isFocusedWithin,
    isActive,
    tabIndex,
    ariaSelected,
    handleFocus,
    handleBlur,
    handleMouseDown,
    handleMouseUp,
    handleMouseDownCapture,
    focus,
    blur,
    getItemIndex,
  };
}
