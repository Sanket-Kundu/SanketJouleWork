import {
  useRef,
  useCallback,
  useId,
} from "react";
import { useOptionalListContext } from "./List";
import { ListSelectionMode } from "../../types/list";
import { useListItemSelection } from "./hooks/useListItemSelection";
import { useListItemFocus } from "./hooks/useListItemFocus";
import { useListItemDragDrop } from "./hooks/useListItemDragDrop";
import { useListItemRegistration } from "./hooks/useListItemRegistration";

export interface UseListItemOptions {
  itemKey?: string;
  disabled?: boolean;
  movable?: boolean;
  type?: string;
  accessibleRole?: string;
  selected?: boolean;
  onClick?: (e: React.MouseEvent | React.KeyboardEvent) => void;
  onDragStart?: () => void;
}

export interface UseListItemResult {
  // Refs
  itemRef: React.RefObject<HTMLLIElement>;
  id: string;

  // State
  isSelected: boolean;
  isFocused: boolean;
  isFocusedWithin: boolean;
  isActive: boolean;
  isDragging: boolean;
  isDropTarget: boolean;
  dropPlacement: "Before" | "After" | "On" | null;

  // Context values
  selectionMode: ListSelectionMode | `${ListSelectionMode}`;

  // Computed values
  tabIndex: number;
  ariaSelected: boolean | undefined;

  // Event handlers
  handleClick: (e: React.MouseEvent<HTMLLIElement>) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLLIElement>) => void;
  handleMouseDown: () => void;
  handleMouseUp: () => void;
  handleMouseDownCapture: () => void;
  handleFocus: (e: React.FocusEvent<HTMLLIElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLLIElement>) => void;
  handleDragStart: (e: React.DragEvent) => void;
  handleDragEnd: (e: React.DragEvent) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragEnter: (e: React.DragEvent) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;

  // Selection handlers
  handleSelectionChange: (checked: boolean) => void;

  // Helper functions
  focus: () => void;
  blur: () => void;
  getItemIndex: () => number;
}

/**
 * Hook that provides all list item behavior (selection, navigation, drag & drop, focus management)
 * Use this to build custom list items with full List integration
 *
 * This hook is composed of smaller, focused hooks for better maintainability:
 * - useListItemSelection: Handles selection state and click/keyboard events
 * - useListItemFocus: Manages focus state, roving tabindex, and active states
 * - useListItemDragDrop: Provides drag and drop functionality
 * - useListItemRegistration: Registers the item with the parent List context
 */
export function useListItem(options: UseListItemOptions = {}): UseListItemResult {
  const {
    itemKey,
    disabled = false,
    movable = false,
    type = "Active",
    accessibleRole = "ListItem",
    selected: controlledSelected,
    onClick,
    onDragStart,
  } = options;

  const itemRef = useRef<HTMLLIElement>(null);
  const generatedId = useId();
  const id = itemKey ?? generatedId;

  // Context
  const listContext = useOptionalListContext();
  const selectionMode = listContext?.selectionMode ?? ListSelectionMode.None;

  // Register item with list context
  useListItemRegistration({ itemRef: itemRef as React.RefObject<HTMLLIElement>, itemKey });

  // Selection behavior
  const selection = useListItemSelection({
    id,
    disabled,
    type,
    selectionMode,
    onClick,
    itemRef: itemRef as React.RefObject<HTMLLIElement>,
  });

  // Focus behavior (with type check for active state)
  const focus = useListItemFocus({
    itemRef: itemRef as React.RefObject<HTMLLIElement>,
    disabled,
    selectionMode,
    accessibleRole,
    controlledSelected,
  });

  // Override handleMouseDown/Up to check type for active state
  const handleMouseDown = useCallback(() => {
    const typeStr = String(type);
    if (typeStr === "Active" || typeStr === "Navigation") {
      focus.handleMouseDown();
    }
  }, [type, focus]);

  const handleMouseUp = useCallback(() => {
    focus.handleMouseUp();
  }, [focus]);

  // Drag and drop behavior
  const dragDrop = useListItemDragDrop({
    id,
    movable,
    disabled,
    onDragStart,
  });

  return {
    // Refs
    itemRef: itemRef as React.RefObject<HTMLLIElement>,
    id,

    // State from sub-hooks (controlledSelected overrides context-based selection)
    isSelected: controlledSelected ?? selection.isSelected,
    isFocused: focus.isFocused,
    isFocusedWithin: focus.isFocusedWithin,
    isActive: focus.isActive,
    isDragging: dragDrop.isDragging,
    isDropTarget: dragDrop.isDropTarget,
    dropPlacement: dragDrop.dropPlacement,

    // Context values
    selectionMode,

    // Computed values
    tabIndex: focus.tabIndex,
    ariaSelected: focus.ariaSelected,

    // Event handlers (composed from sub-hooks)
    handleClick: selection.handleClick,
    handleKeyDown: selection.handleKeyDown,
    handleMouseDown,
    handleMouseUp,
    handleMouseDownCapture: focus.handleMouseDownCapture,
    handleFocus: focus.handleFocus,
    handleBlur: focus.handleBlur,
    handleDragStart: dragDrop.handleDragStart,
    handleDragEnd: dragDrop.handleDragEnd,
    handleDragOver: dragDrop.handleDragOver,
    handleDragEnter: dragDrop.handleDragEnter,
    handleDragLeave: dragDrop.handleDragLeave,
    handleDrop: dragDrop.handleDrop,

    // Selection handlers
    handleSelectionChange: selection.handleSelectionChange,

    // Helper functions
    focus: focus.focus,
    blur: focus.blur,
    getItemIndex: focus.getItemIndex,
  };
}
