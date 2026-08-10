import { useCallback } from "react";
import { useOptionalListContext } from "../List";
import { ListSelectionMode } from "../../../types/list";
import { getTabbableElements, getActiveElement } from "../utils/tabbable";

/**
 * Checks if the target element (or an ancestor between it and the container)
 * is an interactive element such as a button, input, select, textarea,
 * role="button", or contenteditable.
 */
const isInteractiveElement = (target: HTMLElement, container: HTMLElement | null): boolean => {
  let el: HTMLElement | null = target;
  while (el && el !== container) {
    const tag = el.tagName.toLowerCase();
    if (
      tag === "input" ||
      tag === "textarea" ||
      tag === "select" ||
      tag === "button" ||
      (tag === "a" && el.hasAttribute("href")) ||
      el.getAttribute("role") === "button" ||
      el.isContentEditable
    ) {
      return true;
    }
    el = el.parentElement;
  }
  return false;
};

export interface UseListItemSelectionOptions {
  id: string;
  disabled?: boolean;
  type?: string;
  selectionMode: ListSelectionMode | `${ListSelectionMode}`;
  onClick?: (e: React.MouseEvent | React.KeyboardEvent) => void;
  itemRef?: React.RefObject<HTMLLIElement>;
}

export interface UseListItemSelectionResult {
  isSelected: boolean;
  handleClick: (e: React.MouseEvent<HTMLLIElement>) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLLIElement>) => void;
  handleSelectionChange: (checked: boolean) => void;
}

/**
 * Hook for managing list item selection behavior
 */
export function useListItemSelection(options: UseListItemSelectionOptions): UseListItemSelectionResult {
  const { id, disabled, type, selectionMode, onClick, itemRef } = options;
  const listContext = useOptionalListContext();

  // Selection state
  const isSelected = listContext ? listContext.isSelected(id) : false;

  /**
   * Determines if tab should forward after this item.
   * Returns true if:
   * - The item has no tabbable content, OR
   * - Tab is performed on the last tabbable element
   */
  const shouldForwardTabAfter = useCallback((): boolean => {
    if (!itemRef?.current) return true;

    const tabbables = getTabbableElements(itemRef.current);

    // If no tabbable elements, forward immediately
    if (tabbables.length === 0) return true;

    // Check if focus is on the last tabbable element
    const activeElement = getActiveElement();
    const lastTabbable = tabbables[tabbables.length - 1];

    return activeElement === lastTabbable;
  }, [itemRef]);

  /**
   * Determines if shift+tab should forward before this item.
   * Returns true if:
   * - The target is the list item itself, OR
   * - We're on the first tabbable element in the item
   */
  const shouldForwardTabBefore = useCallback((target: HTMLElement): boolean => {
    if (!itemRef?.current) return false;

    // If focus is on the list item itself (not a child), forward
    if (target === itemRef.current) return true;

    // Check if we're on the first tabbable element
    const tabbables = getTabbableElements(itemRef.current);
    if (tabbables.length === 0) return false;

    return target === tabbables[0];
  }, [itemRef]);

  // Handle click
  const handleClick = useCallback((e: React.MouseEvent<HTMLLIElement>) => {
    if (disabled) return;

    // Don't intercept clicks on interactive child elements (buttons, inputs, etc.)
    const container = itemRef?.current ?? null;
    const clickTarget = e.target as HTMLElement;
    if (clickTarget !== container && isInteractiveElement(clickTarget, container)) {
      return;
    }

    const typeStr = String(type);
    if (typeStr === "Inactive" || typeStr === "Detail") {
      return;
    }

    // Handle selection
    const modeStr = String(selectionMode);
    if (modeStr !== "None" && modeStr !== "Delete") {
      listContext?.onToggleSelect(id);
    }

    onClick?.(e);
    listContext?.onItemClick?.(id, e);
  }, [disabled, type, selectionMode, listContext, id, onClick, itemRef]);

  // Handle keyboard
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLLIElement>) => {
    if (disabled) return;

    const modeStr = String(selectionMode);

    // Navigation keys - let them bubble to List
    if (["ArrowDown", "ArrowUp", "Home", "End", "PageDown", "PageUp"].includes(e.key)) {
      return;
    }

    // Tab key handling
    if (e.key === "Tab") {
      const target = e.target as HTMLElement;
      const tabbables = getTabbableElements(itemRef?.current || null);

      if (e.shiftKey) {
        // Shift+Tab (backward navigation)
        if (shouldForwardTabBefore(target)) {
          // We're on the list item itself OR the first tabbable element - exit backward
          e.preventDefault();
          listContext?.onForwardTabBefore?.(id, e);
        }
        // Otherwise, let natural tab order work within the item
      } else {
        // Tab (forward navigation)

        // Case 1: Focus on list item itself and there are tabbable children
        if (target === itemRef?.current && tabbables.length > 0) {
          e.preventDefault();
          // Focus the first tabbable element
          tabbables[0].focus();
          return;
        }

        // Case 2: We're on the last tabbable element OR no tabbable elements (simple item)
        if (shouldForwardTabAfter()) {
          // Prevent default to stop tab from going to next list item's buttons
          e.preventDefault();
          // Let List decide where to go (growing button or exit list)
          listContext?.onForwardTabAfter?.(id, e);
          return;
        }

        // Case 3: We're on a middle tabbable element - let natural tab continue within item
      }
      return;
    }

    // Enter/Space for selection and activation
    if (e.key === "Enter" || e.key === " ") {
      // Don't intercept keyboard events on interactive form elements (input, textarea, etc.)
      const keyTarget = e.target as HTMLElement;
      const keyTag = keyTarget.tagName.toLowerCase();
      if (keyTag === "input" || keyTag === "textarea" || keyTag === "select" || keyTarget.isContentEditable ||
          keyTarget.getAttribute("role") === "button" ||
          (keyTag === "a" && keyTarget.hasAttribute("href"))) {
        return;
      }

      e.preventDefault();
      const typeStr = String(type);
      if (typeStr === "Inactive" || typeStr === "Detail") {
        return;
      }

      // Handle selection
      if (modeStr !== "None" && modeStr !== "Delete") {
        listContext?.onToggleSelect(id);
      }

      onClick?.(e);
      listContext?.onItemClick?.(id, e);
    }

    // Delete key - let List handle it to avoid duplicate events
    // The List's handleKeyDown will call onItemDelete
  }, [disabled, type, selectionMode, listContext, id, onClick, shouldForwardTabAfter, shouldForwardTabBefore, itemRef]);

  // Handle selection component click
  const handleSelectionChange = useCallback((checked: boolean) => {
    if (disabled) return;
    listContext?.onSelect(id, checked);
  }, [disabled, listContext, id]);

  return {
    isSelected,
    handleClick,
    handleKeyDown,
    handleSelectionChange,
  };
}
