import * as React from "react";
import {
  useRef,
  useState,
  useMemo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useContext,
  useId,
} from "react";
import { useTranslation } from "react-i18next";
import { cn, cva } from "../../lib/utils";
import { Loader2 } from "lucide-react";
import { Button } from "../button/Button";
import { ButtonDesign, ButtonRef } from "../../types/button";
import {
  ListProps,
  ListContextValue,
  ListSelectionMode,
  ListGrowingMode,
  ListSeparator,
  ListAccessibleRole,
  ListSelectionChangeEventDetail,
} from "../../types/list";

// ============================================================================
// VARIANTS
// ============================================================================

const listContainerVariants = cva(
  "relative w-full",
  {
    variants: {
      bordered: {
        true: "border border-sapphire-border-primary rounded-lg overflow-hidden",
        false: "",
      },
    },
    defaultVariants: {
      bordered: false,
    },
  }
);

const listVariants = cva(
  "w-full m-0 p-0 list-none",
  {
    variants: {
      indent: {
        true: "pl-4",
        false: "",
      },
      separators: {
        true: "[&>li:not(:last-child)]:border-b [&>li:not(:last-child)]:border-sapphire-border-primary",
        false: "",
      },
    },
    defaultVariants: {
      indent: false,
      separators: true,
    },
  }
);

// ============================================================================
// CONTEXT
// ============================================================================

export const ListContext = React.createContext<ListContextValue | null>(null);

export function useListContext() {
  const context = useContext(ListContext);
  if (!context) {
    throw new Error("List item components must be used within a List");
  }
  return context;
}

export function useOptionalListContext() {
  return useContext(ListContext);
}

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Hook for managing list selection state
 */
function useListSelection<T>({
  mode,
  controlledKeys,
  defaultKeys = [],
  items,
  getItemKey,
  onSelectionChange,
}: {
  mode: ListSelectionMode | `${ListSelectionMode}`;
  controlledKeys?: string[];
  defaultKeys?: string[];
  items?: T[];
  getItemKey?: (item: T, index: number) => string;
  onSelectionChange?: (detail: ListSelectionChangeEventDetail<T>) => void;
}) {
  const [internalKeys, setInternalKeys] = useState<Set<string>>(new Set(defaultKeys));
  const previousKeysRef = useRef<Set<string>>(new Set(defaultKeys));

  const isControlled = controlledKeys !== undefined;
  const selectedKeys = isControlled ? new Set(controlledKeys) : internalKeys;

  const getItemByKey = useCallback((key: string): T | undefined => {
    if (!items || !getItemKey) return undefined;
    return items.find((item, index) => getItemKey(item, index) === key);
  }, [items, getItemKey]);

  const getSelectedItems = useCallback((): T[] => {
    if (!items || !getItemKey) return [];
    return items.filter((item, index) => selectedKeys.has(getItemKey(item, index)));
  }, [items, getItemKey, selectedKeys]);

  const setSelected = useCallback((key: string, selected: boolean) => {
    const modeStr = String(mode);
    if (modeStr === "None") return;

    const newKeys = new Set(selectedKeys);
    const previousKeys = new Set(selectedKeys);

    if (modeStr === "Single" || modeStr === "SingleStart" || modeStr === "SingleEnd") {
      // Single selection - clear others first
      if (selected) {
        newKeys.clear();
        newKeys.add(key);
      } else {
        newKeys.delete(key);
      }
    } else if (modeStr === "Multiple") {
      // Multiple selection
      if (selected) {
        newKeys.add(key);
      } else {
        newKeys.delete(key);
      }
    }

    if (!isControlled) {
      setInternalKeys(newKeys);
    }

    // Fire event
    const targetItem = getItemByKey(key);
    onSelectionChange?.({
      selectedItems: items?.filter((item, index) => getItemKey && newKeys.has(getItemKey(item, index))) ?? [],
      previouslySelectedItems: items?.filter((item, index) => getItemKey && previousKeys.has(getItemKey(item, index))) ?? [],
      selectionComponentPressed: false,
      targetItem: targetItem as T,
      key,
      selectedKeys: Array.from(newKeys), // Always include the raw keys
    });

    previousKeysRef.current = newKeys;
  }, [mode, selectedKeys, isControlled, getItemByKey, items, getItemKey, onSelectionChange]);

  const toggleSelection = useCallback((key: string) => {
    setSelected(key, !selectedKeys.has(key));
  }, [selectedKeys, setSelected]);

  const isSelected = useCallback((key: string): boolean => {
    return selectedKeys.has(key);
  }, [selectedKeys]);

  const selectAll = useCallback(() => {
    if (!items || !getItemKey || String(mode) !== "Multiple") return;
    const allKeys = new Set(items.map(getItemKey));
    if (!isControlled) {
      setInternalKeys(allKeys);
    }
    onSelectionChange?.({
      selectedItems: items,
      previouslySelectedItems: getSelectedItems(),
      selectionComponentPressed: false,
      targetItem: items[0] as T,
    });
  }, [items, getItemKey, mode, isControlled, onSelectionChange, getSelectedItems]);

  const deselectAll = useCallback(() => {
    if (!isControlled) {
      setInternalKeys(new Set());
    }
    onSelectionChange?.({
      selectedItems: [],
      previouslySelectedItems: getSelectedItems(),
      selectionComponentPressed: false,
      targetItem: undefined as T,
    });
  }, [isControlled, onSelectionChange, getSelectedItems]);

  return {
    selectedKeys,
    setSelected,
    toggleSelection,
    isSelected,
    selectAll,
    deselectAll,
    getSelectedItems,
  };
}

/**
 * Hook for managing list navigation
 */
function useListNavigation({
  onFocusItem,
  onSelectItem,
  selectionMode,
  containerRef,
}: {
  itemCount: number;
  onFocusItem?: (index: number) => void;
  onSelectItem?: (index: number) => void;
  selectionMode: ListSelectionMode | `${ListSelectionMode}`;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const getAllNavigable = useCallback((): HTMLElement[] => {
    if (!containerRef.current) return [];
    // Query all navigable elements in DOM order from the container (not just the ul)
    const elements = Array.from(
      containerRef.current.querySelectorAll<HTMLElement>(
        'div[data-group-header="true"], li[role="listitem"], li[role="option"], li[role="menuitem"], li[role="treeitem"], button[data-growing-button]'
      )
    );
    // Filter out items that are hidden (inside collapsed groups)
    return elements.filter(el => {
      // Fast path: check if inside a collapsed group (uses "hidden" class)
      const groupContent = el.closest('ul[role="group"]');
      if (groupContent && (groupContent as HTMLElement).classList.contains("hidden")) return false;
      return true;
    });
  }, [containerRef]);

  const getAllNavigableExcludingGrowingButton = useCallback((): HTMLElement[] => {
    if (!containerRef.current) return [];
    // Query navigable elements excluding the growing button (for Home/End/PageUp/PageDown)
    const elements = Array.from(
      containerRef.current.querySelectorAll<HTMLElement>(
        'div[data-group-header="true"], li[role="listitem"], li[role="option"], li[role="menuitem"], li[role="treeitem"]'
      )
    );
    // Filter out items that are hidden (inside collapsed groups)
    return elements.filter(el => {
      // Fast path: check if inside a collapsed group (uses "hidden" class)
      const groupContent = el.closest('ul[role="group"]');
      if (groupContent && (groupContent as HTMLElement).classList.contains("hidden")) return false;
      return true;
    });
  }, [containerRef]);

  const focusItem = useCallback((index: number) => {
    const allNavigable = getAllNavigable();
    if (index < 0 || index >= allNavigable.length) return;

    const element = allNavigable[index];
    if (!element) return;

    // Don't update focusedIndex if focusing the growing button
    const isGrowingButton = element.hasAttribute('data-growing-button');
    if (!isGrowingButton) {
      setFocusedIndex(index);
    }

    element.focus();
    onFocusItem?.(index);
  }, [getAllNavigable, onFocusItem]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const key = e.key;

    // Tab handling - don't prevent default, let it naturally move focus
    if (key === "Tab") {
      return;
    }

    // Check if the event originated from an interactive element inside a list item
    // If so, only allow navigation keys to bubble up, but not action keys (Space, Enter, Delete)
    const target = e.target as HTMLElement;
    const isInteractiveElement =
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.tagName === 'SELECT' ||
      target.tagName === 'BUTTON' ||
      target.getAttribute('role') === 'button' ||
      target.getAttribute('contenteditable') === 'true' ||
      target.closest('button, input, textarea, select, [role="button"], [contenteditable="true"]') !== null;

    // If focus is on an interactive element, only allow pure navigation keys
    if (isInteractiveElement) {
      // Allow arrow keys, Home, End, PageUp, PageDown to navigate between items
      // But prevent Space, Enter, Delete from being handled by the list
      if (key === ' ' || key === 'Enter' || key === 'Delete') {
        return; // Let the interactive element handle these
      }
      // Navigation keys can still work to move between list items
    }

    // Get all navigable elements dynamically
    const allNavigable = getAllNavigable();
    if (allNavigable.length === 0) return;

    // Find current focused element's index
    const activeElement = document.activeElement as HTMLElement;
    let currentIndex = allNavigable.indexOf(activeElement);

    // If we can't find it, use stored focusedIndex, or default to 0
    if (currentIndex === -1) {
      currentIndex = focusedIndex >= 0 && focusedIndex < allNavigable.length ? focusedIndex : 0;
    }

    let newIndex = currentIndex;

    switch (key) {
      case "ArrowDown":
        e.preventDefault();
        newIndex = Math.min(currentIndex + 1, allNavigable.length - 1);
        break;
      case "ArrowUp":
        e.preventDefault();
        newIndex = Math.max(currentIndex - 1, 0);
        break;
      case "Home":
        e.preventDefault();
        // Home should go to first item/header, not growing button
        const navigableExcludingButton = getAllNavigableExcludingGrowingButton();
        if (navigableExcludingButton.length > 0) {
          const firstElement = navigableExcludingButton[0];
          const indexInAll = allNavigable.indexOf(firstElement);
          if (indexInAll !== -1) {
            newIndex = indexInAll;
          }
        }
        break;
      case "End":
        e.preventDefault();
        // End should go to last item/header, not growing button
        const navigableExcludingButtonEnd = getAllNavigableExcludingGrowingButton();
        if (navigableExcludingButtonEnd.length > 0) {
          const lastElement = navigableExcludingButtonEnd[navigableExcludingButtonEnd.length - 1];
          const indexInAll = allNavigable.indexOf(lastElement);
          if (indexInAll !== -1) {
            newIndex = indexInAll;
          }
        }
        break;
      case "PageDown":
        e.preventDefault();
        // PageDown should skip growing button
        const navigableExcludingButtonPageDown = getAllNavigableExcludingGrowingButton();
        const currentInFiltered = navigableExcludingButtonPageDown.indexOf(activeElement);

        if (currentInFiltered !== -1) {
          // We're on a non-growing-button element
          const newFilteredIndex = Math.min(currentInFiltered + 10, navigableExcludingButtonPageDown.length - 1);
          const targetElement = navigableExcludingButtonPageDown[newFilteredIndex];
          newIndex = allNavigable.indexOf(targetElement);
        } else {
          // We're on the growing button, jump to last item
          if (navigableExcludingButtonPageDown.length > 0) {
            const lastElement = navigableExcludingButtonPageDown[navigableExcludingButtonPageDown.length - 1];
            newIndex = allNavigable.indexOf(lastElement);
          }
        }
        break;
      case "PageUp":
        e.preventDefault();
        // PageUp should skip growing button
        const navigableExcludingButtonPageUp = getAllNavigableExcludingGrowingButton();
        const currentInFilteredPageUp = navigableExcludingButtonPageUp.indexOf(activeElement);

        if (currentInFilteredPageUp !== -1) {
          // We're on a non-growing-button element
          const newFilteredIndex = Math.max(currentInFilteredPageUp - 10, 0);
          const targetElement = navigableExcludingButtonPageUp[newFilteredIndex];
          newIndex = allNavigable.indexOf(targetElement);
        } else {
          // We're on the growing button, jump back 10 from last item
          if (navigableExcludingButtonPageUp.length > 0) {
            const lastFilteredIndex = navigableExcludingButtonPageUp.length - 1;
            const targetIndex = Math.max(lastFilteredIndex - 10, 0);
            const targetElement = navigableExcludingButtonPageUp[targetIndex];
            newIndex = allNavigable.indexOf(targetElement);
          }
        }
        break;
      case " ": // Space
        e.preventDefault();
        // Only handle selection for list items, not group headers or growing button
        const spaceElement = allNavigable[currentIndex];
        if (spaceElement?.getAttribute('role') === 'listitem') {
          if (String(selectionMode) !== "None" && String(selectionMode) !== "Delete") {
            onSelectItem?.(currentIndex);
          }
        }
        return;
      case "Delete":
        // Only handle delete for list items, not group headers or growing button
        const deleteElement = allNavigable[currentIndex];
        if (deleteElement?.getAttribute('role') === 'listitem' && String(selectionMode) === "Delete") {
          onSelectItem?.(currentIndex);
        }
        return;
      case "Enter":
        // Item activation is handled by the item/header itself
        return;
      default:
        return;
    }

    if (newIndex !== currentIndex) {
      focusItem(newIndex);
    }
  }, [focusedIndex, getAllNavigable, getAllNavigableExcludingGrowingButton, selectionMode, onSelectItem, focusItem]);

  const registerItem = useCallback((_index: number, _element: HTMLElement | null) => {
    // No-op now - we query dynamically
  }, []);

  return {
    focusedIndex,
    setFocusedIndex,
    focusItem,
    handleKeyDown,
    registerItem,
  };
}

// ============================================================================
// SUBCOMPONENTS
// ============================================================================

/**
 * List header component
 */
interface ListHeaderProps {
  text?: string;
  children?: React.ReactNode;
  sticky?: boolean;
  className?: string;
}

function ListHeader({ text, children, sticky, className }: ListHeaderProps) {
  if (!text && !children) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-2.5 px-[0.75rem] py-[0.25rem] text-base font-normal text-sapphire-text-primary bg-background",
        sticky && "sticky top-0 z-10 bg-background",
        className
      )}
      role="heading"
      aria-level={2}
    >
      {children || text}
    </div>
  );
}


/**
 * List loading indicator
 */
interface ListLoadingProps {
  className?: string;
}

function ListLoading({ className }: ListLoadingProps) {
  const { t } = useTranslation("fx");
  return (
    <div
      className={cn(
        "absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-20",
        className
      )}
      role="progressbar"
      aria-label={t("LIST_LOADING")}
    >
      <Loader2 className="h-6 w-6 animate-spin text-sapphire-brand-foreground" />
    </div>
  );
}

/**
 * List empty state
 */
interface ListEmptyProps {
  text?: string;
  children?: React.ReactNode;
  className?: string;
}

function ListEmpty({ text, children, className }: ListEmptyProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center px-4 py-12 text-sm text-sapphire-text-tertiary",
        className
      )}
      role="status"
    >
      {children || text || "No data"}
    </div>
  );
}

/**
 * Growing button/trigger component
 */
interface ListGrowingProps {
  mode: ListGrowingMode | `${ListGrowingMode}`;
  buttonText?: string;
  onLoadMore?: () => void;
  parentRef?: React.RefObject<HTMLDivElement | null>;
  loading?: boolean;
  accessibilityAttributes?: {
    name?: string;
    description?: string;
  };
  buttonRef?: React.RefObject<ButtonRef | null>;
}

function ListGrowing({
  mode,
  buttonText,
  onLoadMore,
  parentRef,
  loading,
  accessibilityAttributes,
  buttonRef,
}: ListGrowingProps) {
  const { t } = useTranslation("fx");
  const effectiveButtonText = buttonText || t("LIST_MORE");
  const observerRef = useRef<IntersectionObserver | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  // Scroll mode - use intersection observer
  useEffect(() => {
    if (String(mode) !== "Scroll" || !triggerRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !loading) {
          onLoadMore?.();
        }
      },
      {
        root: parentRef?.current,
        rootMargin: "100px",
        threshold: 0,
      }
    );

    observerRef.current.observe(triggerRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [mode, onLoadMore, parentRef, loading]);

  if (String(mode) === "Button") {
    return (
      <div className="flex items-center justify-center py-3 border-t border-sapphire-border-primary">
        <Button
          ref={buttonRef}
          design={ButtonDesign.Tertiary}
          onClick={() => onLoadMore?.()}
          disabled={loading}
          accessibleName={accessibilityAttributes?.name}
          data-growing-button="true"
          tabIndex={0}
          className="w-full mx-4"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : null}
          {effectiveButtonText}
        </Button>
      </div>
    );
  }

  if (String(mode) === "Scroll") {
    return (
      <div
        ref={triggerRef}
        className="h-1"
        aria-hidden="true"
        data-growing-trigger
      />
    );
  }

  return null;
}

// ============================================================================
// MAIN LIST COMPONENT
// ============================================================================

function ListInner<T>(
  props: ListProps<T>,
) {
  const {
    ref,
    // Header & Footer
    headerText,
    header,

    // Selection
    selectionMode = ListSelectionMode.None,
    selectedKeys: controlledSelectedKeys,
    defaultSelectedKeys = [],
    onSelectionChange,

    // Data
    items,
    renderItem,
    getItemKey = (item: T, index: number) => String((item as Record<string, unknown>).id ?? (item as Record<string, unknown>).key ?? index),
    children,

    // Empty & Loading
    noDataText = "No data available",
    noDataSlot,
    loading = false,
    loadingDelay = 1000,

    // Growing
    growing = ListGrowingMode.None,
    growingButtonText,
    hasMore = false,
    onLoadMore,

    // Visual
    separators = ListSeparator.All,
    indent = false,
    stickyHeader = false,
    stickyFooter = false,

    // Events
    onItemClick,
    onItemDelete,
    onItemFocused,

    // Drag and Drop
    onMoveOver,
    onMove,

    // Accessibility
    accessibleName,
    accessibleNameRef,
    accessibleDescriptionRef,
    accessibleRole = ListAccessibleRole.List,
    accessibilityAttributes,

    // Standard
    className,
    style,
    id: providedId,
    "data-testid": dataTestId,
    "data-ai-context": dataAiContext,
  } = props;

  // IDs
  const generatedId = useId();
  const listId = providedId ?? generatedId;

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const growingButtonRef = useRef<ButtonRef | null>(null);
  const beforeSentinelRef = useRef<HTMLSpanElement>(null);
  const afterSentinelRef = useRef<HTMLSpanElement>(null);

  // State
  const [showLoading, setShowLoading] = useState(false);
  const [mediaRange, setMediaRange] = useState<"S" | "M" | "L" | "XL">("M");
  const itemRegistry = useRef<Map<string, number>>(new Map());
  const [previouslyFocusedItemKey, setPreviouslyFocusedItemKey] = useState<string | null>(null);

  // Drag and drop state
  const [draggedKey, setDraggedKey] = useState<string | null>(null);
  const [dropTargetKey, setDropTargetKey] = useState<string | null>(null);
  const [dropPlacement, setDropPlacement] = useState<"Before" | "After" | "On" | null>(null);

  // Selection hook
  const selectionState = useListSelection<T>({
    mode: selectionMode,
    controlledKeys: controlledSelectedKeys,
    defaultKeys: defaultSelectedKeys,
    items,
    getItemKey,
    onSelectionChange,
  });

  // Calculate item count
  const itemCount = useMemo(() => {
    if (items) return items.length;
    return React.Children.count(children);
  }, [items, children]);

  // Navigation hook
  const navigationState = useListNavigation({
    itemCount,
    onFocusItem: (index) => {
      // Index here is navigable element index, not items index
      // We need to find the actual item if it's a list item
      const allNavigable = Array.from(
        containerRef.current?.querySelectorAll<HTMLElement>(
          'div[data-group-header="true"], li[role="listitem"]'
        ) || []
      );
      const element = allNavigable[index];
      if (element?.getAttribute('role') === 'listitem' && items) {
        // Find the item by its key
        const itemKey = element.getAttribute('data-item-key');
        if (itemKey) {
          const itemIndex = items.findIndex((item, idx) => getItemKey(item, idx) === itemKey);
          if (itemIndex >= 0) {
            onItemFocused?.({ item: items[itemIndex], index: itemIndex });
          }
        }
      }
    },
    onSelectItem: (index) => {
      // Index here is navigable element index
      const allNavigable = Array.from(
        containerRef.current?.querySelectorAll<HTMLElement>(
          'div[data-group-header="true"], li[role="listitem"]'
        ) || []
      );
      const element = allNavigable[index];

      if (!element || element.getAttribute('role') !== 'listitem') return;
      if (!items || !getItemKey) return;

      // Find the actual item by its key
      const itemKey = element.getAttribute('data-item-key');
      if (!itemKey) return;

      const itemIndex = items.findIndex((item, idx) => getItemKey(item, idx) === itemKey);
      if (itemIndex < 0) return;

      const item = items[itemIndex];
      const key = getItemKey(item, itemIndex);

      if (String(selectionMode) === "Delete") {
        onItemDelete?.({ item });
      } else {
        selectionState.toggleSelection(key);
      }
    },
    selectionMode,
    containerRef,
  });

  // Loading delay
  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => setShowLoading(true), loadingDelay);
      return () => clearTimeout(timer);
    } else {
      setShowLoading(false);
    }
  }, [loading, loadingDelay]);

  // Media query for responsive text
  useEffect(() => {
    const updateMediaRange = () => {
      const width = window.innerWidth;
      if (width < 600) setMediaRange("S");
      else if (width < 1024) setMediaRange("M");
      else if (width < 1440) setMediaRange("L");
      else setMediaRange("XL");
    };

    updateMediaRange();
    window.addEventListener("resize", updateMediaRange);
    return () => window.removeEventListener("resize", updateMediaRange);
  }, []);

  // Item registration
  const registerItem = useCallback((key: string, index: number) => {
    itemRegistry.current.set(key, index);
  }, []);

  const unregisterItem = useCallback((key: string) => {
    itemRegistry.current.delete(key);
  }, []);

  // Drag and drop handlers
  const handleDragStart = useCallback((key: string, _e: React.DragEvent) => {
    setDraggedKey(key);
  }, []);

  const handleDragEnd = useCallback((_key: string, _e: React.DragEvent) => {
    setDraggedKey(null);
    setDropTargetKey(null);
    setDropPlacement(null);
  }, []);

  const handleDragOver = useCallback((key: string, e: React.DragEvent) => {
    // For same-list drag, check if dragging over self
    if (draggedKey && key === draggedKey) return; // Can't drop on self

    setDropTargetKey(key);

    // Calculate placement based on mouse position
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const y = e.clientY - rect.top;
    const height = rect.height;

    // Top third = Before, Middle third = On, Bottom third = After
    if (y < height * 0.33) {
      setDropPlacement("Before");
    } else if (y > height * 0.67) {
      setDropPlacement("After");
    } else {
      setDropPlacement("On");
    }
  }, [draggedKey]);

  const handleDrop = useCallback((targetKey: string, e: React.DragEvent) => {
    const targetIndex = itemRegistry.current.get(targetKey);
    if (targetIndex === undefined) return;
    if (!items || !getItemKey) return;

    const targetItem = items[targetIndex];
    if (!targetItem) return;

    // Get the dragged key - either from our state (same list) or from dataTransfer (cross-list)
    const droppedKey = draggedKey || e.dataTransfer.getData("text/plain");
    if (!droppedKey || targetKey === droppedKey) return;

    // Determine placement
    const placement = dropPlacement || "After";

    // Try to find source in this list's registry (same-list drag)
    const sourceIndex = itemRegistry.current.get(droppedKey);
    const sourceItem = sourceIndex !== undefined ? items[sourceIndex] : undefined;

    // Get selected items if multiple selection is enabled and dragged item is selected
    const isMultiple = String(selectionMode) === "Multiple";
    const draggedIsSelected = droppedKey ? selectionState.isSelected(droppedKey) : false;
    const selectedItemsList = isMultiple && draggedIsSelected
      ? selectionState.getSelectedItems()
      : undefined;

    const moveDetail = {
      source: {
        element: sourceItem as T, // May be undefined for cross-list drops
        elements: selectedItemsList,
        index: sourceIndex ?? -1, // -1 indicates cross-list drop
      },
      destination: {
        element: targetItem,
        placement,
        index: targetIndex,
      },
      originalEvent: e.nativeEvent,
    };

    // Fire move-over event first (for validation/preview)
    onMoveOver?.(moveDetail);

    // Fire move event (for actual reordering)
    onMove?.(moveDetail);

    // Clear drag state
    setDraggedKey(null);
    setDropTargetKey(null);
    setDropPlacement(null);
  }, [draggedKey, dropPlacement, items, getItemKey, selectionMode, selectionState, onMoveOver, onMove]);

  // Tab forwarding handlers
  const handleForwardTabAfter = useCallback((key: string, event: React.KeyboardEvent) => {
    // Store the item that triggered the forward - keep it as the focused item
    // so Shift+Tab can return to it
    setPreviouslyFocusedItemKey(key);

    // Find the item index to maintain roving tabindex
    if (containerRef.current) {
      const allNavigable = Array.from(
        containerRef.current.querySelectorAll<HTMLElement>(
          'div[data-group-header="true"], li[role="listitem"], li[role="option"], button[data-growing-button]'
        )
      );
      const itemElement = allNavigable.find(
        el => el.getAttribute('data-item-key') === key || el.id === key
      );
      if (itemElement) {
        const itemIndex = allNavigable.indexOf(itemElement);
        navigationState.setFocusedIndex(itemIndex);
      }
    }

    // Check if we have a growing button - if so, focus it instead of exiting list
    if (String(growing) !== "None" && hasMore && growingButtonRef.current) {
      growingButtonRef.current.focus?.();
      return;
    }

    // Otherwise, focus the next tabbable element after the list
    if (listRef.current) {
      const allTabbable = Array.from(
        document.querySelectorAll<HTMLElement>(
          'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable]'
        )
      );

      const target = event.target as HTMLElement;
      const currentIndex = allTabbable.indexOf(target);
      if (currentIndex >= 0) {
        // Find the next element that's after the list container
        for (let i = currentIndex + 1; i < allTabbable.length; i++) {
          if (!listRef.current.contains(allTabbable[i])) {
            allTabbable[i].focus();
            return;
          }
        }
      } else {
        // Target not found in tabbable scan - try focusing after-sentinel
        // which will trigger handleAfterSentinelFocus to exit properly
        if (afterSentinelRef.current) {
          afterSentinelRef.current.focus();
        }
      }
    }
  }, [growing, hasMore, navigationState]);

  const handleForwardTabBefore = useCallback((key: string, event: React.KeyboardEvent) => {
    // Store the item that triggered the forward - keep it as the focused item
    // so Tab can return to it
    setPreviouslyFocusedItemKey(key);

    // Find the item element and its index
    let itemElement: HTMLElement | null = null;
    if (containerRef.current) {
      const allNavigable = Array.from(
        containerRef.current.querySelectorAll<HTMLElement>(
          'div[data-group-header="true"], li[role="listitem"], li[role="option"], button[data-growing-button]'
        )
      );
      itemElement = allNavigable.find(
        el => el.getAttribute('data-item-key') === key || el.id === key
      ) || null;
      if (itemElement) {
        const itemIndex = allNavigable.indexOf(itemElement);
        navigationState.setFocusedIndex(itemIndex);
      }
    }

    // If the event target is NOT the list item itself (i.e., it's a child like a button),
    // focus the list item first instead of exiting the list
    if (itemElement && event.target !== itemElement) {
      itemElement.focus();
      return;
    }

    // Otherwise, focus the previous tabbable element before the list
    if (listRef.current) {
      const allTabbable = Array.from(
        document.querySelectorAll<HTMLElement>(
          'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable]'
        )
      );

      const target = event.target as HTMLElement;
      const currentIndex = allTabbable.indexOf(target);
      if (currentIndex >= 0) {
        // Find the previous element that's before the list container
        for (let i = currentIndex - 1; i >= 0; i--) {
          if (!listRef.current.contains(allTabbable[i])) {
            allTabbable[i].focus();
            return;
          }
        }
      } else {
        // Target not found in tabbable scan - try focusing before-sentinel
        // which will trigger handleBeforeSentinelFocus to exit properly
        if (beforeSentinelRef.current) {
          beforeSentinelRef.current.focus();
        }
      }
    }
  }, [navigationState]);

  // Sentinel focus handlers
  const handleBeforeSentinelFocus = useCallback((e: React.FocusEvent) => {
    const relatedTarget = e.relatedTarget as HTMLElement;

    // Check if coming from after-sentinel (Shift+Tab through empty list)
    const isFromAfterSentinel = relatedTarget === afterSentinelRef.current;

    // Check if coming from a list item or growing button (Shift+Tab backward)
    const isFromListItem = relatedTarget?.closest('li[role="listitem"], li[role="option"]');
    const isFromGrowingButton = relatedTarget?.hasAttribute('data-growing-button');

    if (isFromAfterSentinel || isFromListItem || isFromGrowingButton) {
      // Shift+Tab from inside the list or from after-sentinel - let focus continue backward
      // Find previous tabbable element before the list
      const allTabbable = Array.from(
        document.querySelectorAll<HTMLElement>(
          'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable]'
        )
      );

      const sentinelIndex = allTabbable.indexOf(beforeSentinelRef.current!);
      if (sentinelIndex > 0) {
        allTabbable[sentinelIndex - 1].focus();
      }
    } else {
      // Tab forward from header or before the list - enter at previously focused or first item
      e.preventDefault();
      if (containerRef.current) {
        const allNavigable = Array.from(
          containerRef.current.querySelectorAll<HTMLElement>(
            'div[data-group-header="true"], li[role="listitem"], li[role="option"], button[data-growing-button]'
          )
        );

        // If list is empty, move focus forward to next element after list
        if (allNavigable.length === 0) {
          // Focus after-sentinel or next tabbable element
          if (afterSentinelRef.current) {
            afterSentinelRef.current.focus();
          }
          return;
        }

        // Try to focus the previously focused item
        if (previouslyFocusedItemKey) {
          const targetElement = allNavigable.find(
            el => el.getAttribute('data-item-key') === previouslyFocusedItemKey || el.id === previouslyFocusedItemKey
          );
          if (targetElement) {
            targetElement.focus();
            return;
          }
        }

        // Fallback: focus first item
        if (allNavigable[0]) {
          allNavigable[0].focus();
        }
      }
    }
  }, [previouslyFocusedItemKey]);

  // Helper to get all tabbable elements
  const getAllTabbableElements = useCallback(() => {
    return Array.from(
      document.querySelectorAll<HTMLElement>(
        'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable]'
      )
    );
  }, []);

  // Helper to focus next element after list
  const focusNextAfterList = useCallback(() => {
    if (!listRef.current || !afterSentinelRef.current) return false;

    const allTabbable = getAllTabbableElements();
    const sentinelIndex = allTabbable.indexOf(afterSentinelRef.current);

    if (sentinelIndex >= 0) {
      for (let i = sentinelIndex + 1; i < allTabbable.length; i++) {
        if (!containerRef.current?.contains(allTabbable[i])) {
          allTabbable[i].focus();
          return true;
        }
      }
    }
    return false;
  }, [getAllTabbableElements]);

  // Helper to enter list at focused item
  const enterListAtFocusedItem = useCallback(() => {
    if (!containerRef.current) return false;

    const allNavigable = Array.from(
      containerRef.current.querySelectorAll<HTMLElement>(
        'div[data-group-header="true"], li[role="listitem"], li[role="option"]'
      )
    );

    // If list is empty, continue backward to before-sentinel
    if (allNavigable.length === 0) {
      beforeSentinelRef.current?.focus();
      return true;
    }

    // Find the focused item (or first item if none focused)
    const focusedIndex = navigationState.focusedIndex;
    const targetIndex = focusedIndex >= 0 && focusedIndex < allNavigable.length ? focusedIndex : 0;

    if (allNavigable[targetIndex]) {
      allNavigable[targetIndex].focus();
      return true;
    }
    return false;
  }, [navigationState.focusedIndex]);

  const handleAfterSentinelFocus = useCallback((e: React.FocusEvent) => {
    const relatedTarget = e.relatedTarget as HTMLElement;
    const isFromGrowingButton = relatedTarget?.hasAttribute('data-growing-button');
    const isFromOutside = !relatedTarget || !containerRef.current?.contains(relatedTarget);

    // Enter list if coming from outside or growing button, otherwise exit forward
    if (isFromGrowingButton || isFromOutside) {
      enterListAtFocusedItem();
    } else {
      focusNextAfterList();
    }
  }, [focusNextAfterList, enterListAtFocusedItem]);

  // Determine if role supports selection attributes (must be before contextValue)
  const roleSupportsAriaSelected = useMemo(() => {
    const roleStr = String(accessibleRole);
    return (
      roleStr === ListAccessibleRole.ListBox ||
      roleStr === "listbox" ||
      roleStr === ListAccessibleRole.Tree ||
      roleStr === "tree"
    );
  }, [accessibleRole]);


  // Context value
  const contextValue = useMemo<ListContextValue>(() => ({
    selectionMode,
    selectedKeys: selectionState.selectedKeys,
    onSelect: selectionState.setSelected,
    onToggleSelect: selectionState.toggleSelection,
    isSelected: selectionState.isSelected,
    focusedIndex: navigationState.focusedIndex,
    onFocusItem: navigationState.setFocusedIndex,
    registerItem,
    unregisterItem,
    registerNavigationItem: navigationState.registerItem,
    // Tab navigation
    onForwardTabAfter: handleForwardTabAfter,
    onForwardTabBefore: handleForwardTabBefore,
    separators,
    indent,
    onItemClick: (_key, event) => {
      onItemClick?.({ item: event.currentTarget as HTMLElement, originalEvent: event });
    },
    onItemDelete: (key) => {
      // Try registry first
      const index = itemRegistry.current.get(key);
      if (index !== undefined && items) {
        onItemDelete?.({ item: items[index] });
        return;
      }
      // Fallback: find item by key directly
      if (items && getItemKey) {
        const item = items.find((item, idx) => getItemKey(item, idx) === key);
        if (item) {
          onItemDelete?.({ item });
        }
      }
    },
    // Drag and drop
    onDragStart: handleDragStart,
    onDragEnd: handleDragEnd,
    onDragOver: handleDragOver,
    onDrop: handleDrop,
    draggedKey,
    dropTargetKey,
    dropPlacement,
    mediaRange,
    totalItemCount: itemCount,
    getItemIndex: (key: string) => {
      return itemRegistry.current.get(key) ?? -1;
    },
    // Accessibility
    accessibleRole,
    supportsAriaSelected: roleSupportsAriaSelected,
  }), [
    selectionMode, selectionState, navigationState, registerItem, unregisterItem,
    handleForwardTabAfter, handleForwardTabBefore,
    separators, indent, onItemClick, onItemDelete, items, getItemKey, mediaRange, itemCount,
    handleDragStart, handleDragEnd, handleDragOver, handleDrop,
    draggedKey, dropTargetKey, dropPlacement,
    accessibleRole, roleSupportsAriaSelected,
  ]);

  // Imperative handle
  useImperativeHandle(ref, () => ({
    // Focus
    focus: () => listRef.current?.focus(),
    focusItem: (index) => navigationState.focusItem(index),
    getFocusedItemIndex: () => navigationState.focusedIndex,

    // Selection
    getSelectedKeys: () => Array.from(selectionState.selectedKeys),
    getSelectedItems: () => selectionState.getSelectedItems(),
    isSelected: selectionState.isSelected,
    select: (keys) => {
      const keyArray = Array.isArray(keys) ? keys : [keys];
      keyArray.forEach(key => selectionState.setSelected(key, true));
    },
    deselect: (keys) => {
      const keyArray = Array.isArray(keys) ? keys : [keys];
      keyArray.forEach(key => selectionState.setSelected(key, false));
    },
    toggleSelection: selectionState.toggleSelection,
    selectAll: selectionState.selectAll,
    deselectAll: selectionState.deselectAll,

    // Data
    getItems: () => items ?? [],
    getItemCount: () => itemCount,
    getItemByKey: (key) => items?.find((item, index) => getItemKey(item, index) === key),

    // Scrolling
    scrollToItem: (index, align = "start") => {
      const element = listRef.current?.children[index] as HTMLElement;
      element?.scrollIntoView({ behavior: "smooth", block: align });
    },
    scrollToTop: () => {
      containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    },
    scrollToBottom: () => {
      containerRef.current?.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    },

    // Elements
    get listElement() { return listRef.current; },
    get scrollContainer() { return containerRef.current; },
  }), [selectionState, navigationState, items, itemCount, getItemKey]);

  // Handle load more
  const handleLoadMore = useCallback(() => {
    onLoadMore?.({ currentCount: itemCount });
  }, [onLoadMore, itemCount]);

  // Determine accessible role
  const getRole = () => {
    const roleStr = String(accessibleRole);
    switch (roleStr) {
      case "Menu": return "menu";
      case "Tree": return "tree";
      case "ListBox": return "listbox";
      default: return "list";
    }
  };

  // Check if empty
  const isEmpty = itemCount === 0 && !loading;

  // Render items and populate registry
  const renderedItems = useMemo(() => {
    // Clear registry before re-populating
    itemRegistry.current.clear();

    if (items && renderItem) {
      return items.map((item, index) => {
        const key = getItemKey(item, index);
        // Register item with its index
        itemRegistry.current.set(key, index);
        return (
          <React.Fragment key={key}>
            {renderItem(item, index)}
          </React.Fragment>
        );
      });
    }
    // Declarative children: pre-populate registry with itemKey props
    if (children) {
      let index = 0;
      React.Children.forEach(children, (child) => {
        if (React.isValidElement(child) && child.props && typeof (child.props as Record<string, unknown>).itemKey === "string") {
          itemRegistry.current.set((child.props as Record<string, unknown>).itemKey as string, index);
          index++;
        }
      });
    }
    return children;
  }, [items, renderItem, getItemKey, children]);

  return (
    <ListContext.Provider value={contextValue}>
      <div
        ref={containerRef}
        className={cn(
          listContainerVariants({ bordered: false }),
          // Make scrollable when growing mode or sticky header is used
          (String(growing) !== "None" || stickyHeader || stickyFooter) && "overflow-auto",
          // Always prevent horizontal scroll
          "overflow-x-hidden",
          className
        )}
        style={style}
        data-testid={dataTestId}
        data-ai-context={dataAiContext}
        onKeyDown={navigationState.handleKeyDown}
      >
        {/* Header */}
        <ListHeader
          text={headerText}
          sticky={stickyHeader}
        >
          {header}
        </ListHeader>

        {/* Before sentinel - intercepts Tab from before list */}
        <span
          ref={beforeSentinelRef}
          tabIndex={0}
          onFocus={handleBeforeSentinelFocus}
          style={{
            position: 'absolute',
            width: '1px',
            height: '1px',
            padding: 0,
            margin: '-1px',
            overflow: 'hidden',
            clip: 'rect(0, 0, 0, 0)',
            whiteSpace: 'nowrap',
            border: 0,
          }}
        />

        {/* List element */}
        <ul
          ref={listRef}
          id={listId}
          role={getRole()}
          aria-label={accessibleName}
          aria-labelledby={accessibleNameRef}
          aria-describedby={accessibleDescriptionRef}
          aria-busy={loading || undefined}
          aria-multiselectable={
            roleSupportsAriaSelected && String(selectionMode) === "Multiple" ? true : undefined
          }
          className={cn(listVariants({ indent, separators: String(separators) !== "None" }))}
        >
          {!isEmpty && renderedItems}
        </ul>

        {/* After sentinel - always tabIndex=0 to catch Shift+Tab from outside */}
        <span
          ref={afterSentinelRef}
          tabIndex={0}
          onFocus={handleAfterSentinelFocus}
          style={{
            position: 'absolute',
            width: '1px',
            height: '1px',
            padding: 0,
            margin: '-1px',
            overflow: 'hidden',
            clip: 'rect(0, 0, 0, 0)',
            whiteSpace: 'nowrap',
            border: 0,
          }}
        />

        {/* Empty state */}
        {isEmpty && (
          <ListEmpty text={noDataText}>
            {noDataSlot}
          </ListEmpty>
        )}

        {/* Growing button/trigger */}
        {String(growing) !== "None" && hasMore && !loading && (
          <ListGrowing
            mode={growing}
            buttonText={growingButtonText}
            onLoadMore={handleLoadMore}
            parentRef={containerRef}
            loading={loading}
            accessibilityAttributes={accessibilityAttributes?.growingButton}
            buttonRef={growingButtonRef}
          />
        )}

        {/* Footer removed */}

        {/* Loading overlay */}
        {showLoading && <ListLoading />}
      </div>
    </ListContext.Provider>
  );
}

// List component with generics
export const List = React.memo(ListInner) as <T>(
  props: ListProps<T>
) => React.ReactElement;

(List as React.FC).displayName = "List";
