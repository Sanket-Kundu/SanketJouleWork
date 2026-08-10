import {
  useRef,
  useState,
  useCallback,
  useEffect,
  useId,
} from "react";
import { useOptionalListContext } from "./List";
import { useListItemGroup } from "./useListItemGroup";

export interface UseListGroupHeaderOptions {
  collapsible?: boolean;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onToggle?: (collapsed: boolean) => void;
}

export interface UseListGroupHeaderResult {
  // Refs
  headerRef: React.RefObject<HTMLDivElement>;
  headerId: string;
  contentId: string;

  // State
  isCollapsed: boolean;
  isFocused: boolean;

  // Computed values
  tabIndex: number;

  // Event handlers
  handleToggle: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  handleFocus: (e: React.FocusEvent<HTMLDivElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLDivElement>) => void;

  // Helper functions
  focus: () => void;
  blur: () => void;
}

/**
 * Hook that provides all group header behavior (collapsible state, navigation, focus management)
 * Use this to build custom group headers with full List integration
 */
export function useListGroupHeader(options: UseListGroupHeaderOptions = {}): UseListGroupHeaderResult {
  const {
    collapsible = false,
    collapsed: controlledCollapsed,
    defaultCollapsed = false,
    onToggle,
  } = options;

  const headerRef = useRef<HTMLDivElement>(null);
  const generatedId = useId();
  const headerId = `${generatedId}-header`;

  // Get contentId from context if available (when used inside ListItemGroupBase)
  // Otherwise generate our own (for standalone usage)
  const groupContext = useListItemGroup();
  const contentId = groupContext?.contentId || `${generatedId}-content`;

  // Context
  const listContext = useOptionalListContext();

  // Collapse state
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
  const isControlled = controlledCollapsed !== undefined;
  const isCollapsed = isControlled ? controlledCollapsed : internalCollapsed;

  // Focus state
  const [isFocused, setIsFocused] = useState(false);

  // Index tracking
  const headerIndexRef = useRef(-1);

  // Register header for navigation
  useEffect(() => {
    if (listContext && headerRef.current) {
      // Find the root list element
      let rootList = headerRef.current.parentElement;
      while (rootList && rootList.getAttribute('role') !== 'list' && rootList.getAttribute('role') !== 'listbox') {
        rootList = rootList.parentElement;
      }

      if (rootList) {
        const allNavigable = Array.from(
          rootList.querySelectorAll<HTMLElement>(
            'div[data-group-header="true"], li[role="listitem"]'
          )
        );
        const index = allNavigable.indexOf(headerRef.current);
        if (index >= 0) {
          headerIndexRef.current = index;
          listContext.registerNavigationItem?.(index, headerRef.current);
        }
      }
    }

    return () => {
      if (listContext && headerIndexRef.current >= 0) {
        listContext.registerNavigationItem?.(headerIndexRef.current, null);
        headerIndexRef.current = -1;
      }
    };
  }, [listContext]);

  // Handle toggle
  const handleToggle = useCallback(() => {
    if (!collapsible) return;

    const newCollapsed = !isCollapsed;
    if (!isControlled) {
      setInternalCollapsed(newCollapsed);
    }
    onToggle?.(newCollapsed);
  }, [collapsible, isCollapsed, isControlled, onToggle]);

  // Handle keyboard
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Navigation keys - let them bubble to List
    if (["ArrowDown", "ArrowUp", "Home", "End", "PageDown", "PageUp"].includes(e.key)) {
      return;
    }

    // Tab key - allow natural tab behavior
    if (e.key === "Tab") {
      return;
    }

    // Enter/Space for toggle (if collapsible)
    if (collapsible && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      handleToggle();
    }
  }, [collapsible, handleToggle]);

  // Focus handlers
  const handleFocus = useCallback((e: React.FocusEvent<HTMLDivElement>) => {
    const isHeaderItself = e.target === headerRef.current;
    setIsFocused(isHeaderItself);

    if (listContext && headerIndexRef.current >= 0) {
      listContext.onFocusItem(headerIndexRef.current);
    }
  }, [listContext]);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLDivElement>) => {
    const isLeavingHeader = !headerRef.current?.contains(e.relatedTarget as Node);
    if (isLeavingHeader) {
      setIsFocused(false);
    }
  }, []);

  // Roving tabindex
  const headerIndex = headerIndexRef.current;
  const isFocusedItem = listContext?.focusedIndex === headerIndex;
  const isFirstItem = headerIndex === 0;
  const tabIndex = (isFocusedItem || (listContext?.focusedIndex === -1 && isFirstItem)) ? 0 : -1;

  // Helper functions
  const focus = useCallback(() => {
    headerRef.current?.focus();
  }, []);

  const blur = useCallback(() => {
    headerRef.current?.blur();
  }, []);

  return {
    // Refs
    headerRef: headerRef as React.RefObject<HTMLDivElement>,
    headerId,
    contentId,

    // State
    isCollapsed,
    isFocused,

    // Computed values
    tabIndex,

    // Event handlers
    handleToggle,
    handleKeyDown,
    handleFocus,
    handleBlur,

    // Helper functions
    focus,
    blur,
  };
}
