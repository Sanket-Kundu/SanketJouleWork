import * as React from "react";
import { useState, useCallback, useId, useMemo, type Ref } from "react";
import { ListGroupHeaderBase } from "./ListGroupHeaderBase";
import { ListItemGroupContext, ListItemGroupContextValue } from "./useListItemGroup";

export interface ListItemGroupBaseProps {
  /**
   * Header content. Can be:
   * - A string: Simple text header
   * - A ReactNode: Custom component (can use useListItemGroup hook to access state)
   * - A render function: Receives { isCollapsed, isFocused } state
   */
  header: React.ReactNode | ((state: { isCollapsed: boolean; isFocused: boolean }) => React.ReactNode);

  headerAccessibleName?: string;

  // Behavior
  collapsible?: boolean;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onToggle?: (collapsed: boolean) => void;

  // Content
  children?: React.ReactNode;

  // Standard
  className?: string;
  style?: React.CSSProperties;
  "data-testid"?: string;
}

/**
 * Base group component that renders a collapsible header and conditionally shows/hides children.
 * Unlike ListItemGroup, this keeps all items as flat siblings in the DOM for proper List integration.
 *
 * The group header participates in keyboard navigation, and children remain part of the parent List's context.
 *
 * @example String header
 * ```tsx
 * <ListItemGroupBase header="My Folder" collapsible>
 *   <ListItemBase itemKey="1">File 1</ListItemBase>
 * </ListItemGroupBase>
 * ```
 *
 * @example Custom component header (uses useListItemGroup hook)
 * ```tsx
 * function FolderHeader() {
 *   const group = useListItemGroup();
 *   return (
 *     <div className="flex items-center gap-2">
 *       {group?.collapsible && (group.isCollapsed ? "▶" : "▼")}
 *       <FolderIcon />
 *       <span>My Folder</span>
 *     </div>
 *   );
 * }
 *
 * <ListItemGroupBase header={<FolderHeader />} collapsible>
 *   <ListItemBase itemKey="1">File 1</ListItemBase>
 * </ListItemGroupBase>
 * ```
 *
 * @example Render function
 * ```tsx
 * <ListItemGroupBase
 *   header={({ isCollapsed }) => (
 *     <div>{isCollapsed ? "▶" : "▼"} My Folder</div>
 *   )}
 *   collapsible
 * >
 *   <ListItemBase itemKey="1">File 1</ListItemBase>
 * </ListItemGroupBase>
 * ```
 */
export function ListItemGroupBase(props: ListItemGroupBaseProps & { ref?: Ref<HTMLDivElement> }) {
    const {
      ref,
      header,
      headerAccessibleName,
      collapsible = false,
      collapsed: controlledCollapsed,
      defaultCollapsed = false,
      onToggle,
      children,
      className,
      style,
      "data-testid": dataTestId,
    } = props;

    const generatedId = useId();
    const contentId = `${generatedId}-content`;

    // Collapse state
    const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
    const isControlled = controlledCollapsed !== undefined;
    const isCollapsed = isControlled ? controlledCollapsed : internalCollapsed;

    const handleToggle = useCallback((collapsed: boolean) => {
      if (!isControlled) {
        setInternalCollapsed(collapsed);
      }
      onToggle?.(collapsed);
    }, [isControlled, onToggle]);

    const toggle = useCallback(() => {
      handleToggle(!isCollapsed);
    }, [handleToggle, isCollapsed]);

    // Context value for child components (header can access this via useListItemGroup)
    const contextValue = useMemo<ListItemGroupContextValue>(() => ({
      isCollapsed,
      collapsible,
      toggle,
      contentId,
    }), [isCollapsed, collapsible, toggle, contentId]);

    // Render header content
    const headerContent = typeof header === "function"
      ? header({ isCollapsed, isFocused: false })
      : header;

    return (
      <ListItemGroupContext.Provider value={contextValue}>
        {/* Group header - rendered as a direct child of List */}
        <ListGroupHeaderBase
          ref={ref}
          collapsible={collapsible}
          collapsed={isCollapsed}
          onToggle={handleToggle}
          accessibleName={headerAccessibleName}
          className={className}
          style={style}
          data-testid={dataTestId}
        >
          {headerContent}
        </ListGroupHeaderBase>

        {/* Children - rendered conditionally but still as direct children of List */}
        {(!collapsible || !isCollapsed) && children}
      </ListItemGroupContext.Provider>
    );
  }
