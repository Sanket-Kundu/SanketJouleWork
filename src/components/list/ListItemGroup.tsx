import * as React from "react";
import {
  useRef,
  useState,
  useCallback,
  useId,
  useEffect,
  type Ref,
} from "react";
import { cn } from "../../lib/utils";
import { SlimArrowDownIcon } from "../../icons/SlimArrowDown";
import { SlimArrowRightIcon } from "../../icons/SlimArrowRight";
import { useOptionalListContext } from "./List";
import {
  ListItemGroupProps,
  ListItemWrappingType,
} from "../../types/list";
import { LIST_ITEM_BASE_CLASSES, LIST_ITEM_FOCUS_CLASSES } from "./shared-styles";

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function ListItemGroup(props: ListItemGroupProps & { ref?: Ref<HTMLLIElement> }) {
    const {
      ref,
      // Content
      headerText,
      headerAccessibleName,
      header,
      children,

      // Behavior
      wrappingType = ListItemWrappingType.None,
      stickyHeader = false,
      collapsible = false,
      collapsed: controlledCollapsed,
      defaultCollapsed = false,
      onToggle,

      // Standard
      className,
      style,
      "data-testid": dataTestId,
    } = props;

    const groupRef = useRef<HTMLLIElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const generatedId = useId();
    const headerId = `${generatedId}-header`;
    const contentId = `${generatedId}-content`;

    // Context
    const listContext = useOptionalListContext();

    // Collapse state
    const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
    const isControlled = controlledCollapsed !== undefined;
    const isCollapsed = isControlled ? controlledCollapsed : internalCollapsed;

    // Focus state for visual indicator
    const [isFocused, setIsFocused] = useState(false);

    // Index tracking - computed during registration, not render
    const headerIndexRef = useRef(-1);

    // Register header for navigation
    useEffect(() => {
      if (listContext && headerRef.current) {
        // Find the root list element (not the nested ul[role="group"])
        let rootList = groupRef.current?.parentElement;
        while (rootList && rootList.getAttribute('role') !== 'list' && rootList.getAttribute('role') !== 'listbox') {
          rootList = rootList.parentElement;
        }

        if (rootList) {
          // Find all navigable elements from root
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

    // Roving tabindex: only focused item (or first item if none focused) is tabbable
    const headerIndex = headerIndexRef.current;
    const isFocusedItem = listContext?.focusedIndex === headerIndex;
    const isFirstItem = headerIndex === 0;
    const computedTabIndex = (isFocusedItem || (listContext?.focusedIndex === -1 && isFirstItem)) ? 0 : -1;

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

      // ArrowLeft to collapse, ArrowRight to expand (if collapsible)
      if (collapsible) {
        if (e.key === "ArrowLeft" && !isCollapsed) {
          e.preventDefault();
          handleToggle();
        } else if (e.key === "ArrowRight" && isCollapsed) {
          e.preventDefault();
          handleToggle();
        }
      }
    }, [collapsible, handleToggle, isCollapsed]);

    // Determine if text should wrap
    const shouldWrap = String(wrappingType) === "Normal";

    // Check if has header content
    const hasHeader = headerText || header;

    // Separator styling from context
    const separatorClass = listContext?.separators !== "None"
      ? "border-b border-sapphire-border-primary last:border-b-0"
      : "";

    return (
      <li
        ref={(node) => {
          (groupRef as React.MutableRefObject<HTMLLIElement | null>).current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        role="group"
        aria-labelledby={hasHeader ? headerId : undefined}
        className={cn(
          "relative list-none",
          separatorClass,
          className
        )}
        style={style}
        data-testid={dataTestId}
      >
        {/* Group header */}
        {hasHeader && (
          <div
            ref={headerRef}
            id={headerId}
            role={collapsible ? "button" : "heading"}
            aria-level={3}
            aria-expanded={collapsible ? !isCollapsed : undefined}
            aria-controls={collapsible ? contentId : undefined}
            aria-label={headerAccessibleName}
            tabIndex={computedTabIndex}
            onClick={collapsible ? handleToggle : undefined}
            onKeyDown={handleKeyDown}
            onFocus={(e) => {
              // Only show focus ring if the header itself is focused
              const isHeaderItself = e.target === headerRef.current;
              setIsFocused(isHeaderItself);
              // Update focused index in list context
              if (listContext && headerIndex >= 0) {
                listContext.onFocusItem(headerIndex);
              }
            }}
            onBlur={(e) => {
              // Only remove focus ring if focus is leaving the header entirely
              const isLeavingHeader = !headerRef.current?.contains(e.relatedTarget as Node);
              if (isLeavingHeader) {
                setIsFocused(false);
              }
            }}
            data-group-header="true"
            className={cn(
              LIST_ITEM_BASE_CLASSES,
              "gap-2 px-4 py-2",
              "bg-muted/50 text-sm font-semibold text-sapphire-text-tertiary",
              "select-none",
              stickyHeader && "sticky top-0 z-10",
              collapsible && "cursor-pointer hover:bg-muted/70",
              isFocused && LIST_ITEM_FOCUS_CLASSES
            )}
          >
            {/* Collapse indicator - only show if no custom header provided */}
            {collapsible && !header && (
              <span className="shrink-0 text-sapphire-text-tertiary">
                {isCollapsed ? (
                  <SlimArrowRightIcon className="h-4 w-4" />
                ) : (
                  <SlimArrowDownIcon className="h-4 w-4" />
                )}
              </span>
            )}

            {/* Header content */}
            {header || (
              <span
                className={cn(
                  "flex-1",
                  !shouldWrap && "truncate",
                  shouldWrap && "break-words"
                )}
              >
                {headerText}
              </span>
            )}
          </div>
        )}

        {/* Group content */}
        <ul
          id={contentId}
          role="group"
          className={cn(
            "list-none m-0 p-0 w-full",
            collapsible && isCollapsed && "hidden"
          )}
        >
          {children}
        </ul>
      </li>
    );
  }

ListItemGroup.displayName = "ListItemGroup";
