import * as React from "react";
import { useImperativeHandle, useCallback, useMemo, type Ref } from "react";
import { cn } from "../../lib/utils";
import { useListItem } from "./useListItem";
import { ListItemRef, ListItemType, ListItemAccessibleRole } from "../../types/list";
import { ListSelectionControl } from "./ListSelectionControl";
import { DropIndicator } from "./DropIndicator";
import { LIST_ITEM_BASE_CLASSES, LIST_ITEM_FOCUS_CLASSES } from "./shared-styles";
import { useOptionalListContext } from "./List";

export interface ListItemBaseProps {
  // Identity
  itemKey?: string;

  // Behavior
  type?: ListItemType | `${ListItemType}`;
  disabled?: boolean;
  movable?: boolean;

  // Accessible role
  accessibleRole?: ListItemAccessibleRole | `${ListItemAccessibleRole}`;

  // Accessibility
  /** ID of element that labels this list item (aria-labelledby) */
  accessibleNameRef?: string;

  // State
  selected?: boolean;
  focused?: boolean;

  // Events
  onClick?: (e: React.MouseEvent | React.KeyboardEvent) => void;
  onDragStart?: () => void;
  onDelete?: () => void; // Called when delete button is clicked

  // Custom elements
  deleteButton?: React.ReactNode;

  // Rendering
  children?: React.ReactNode | ((state: ListItemBaseRenderState) => React.ReactNode);

  // Standard
  className?: string;
  style?: React.CSSProperties;
  "data-testid"?: string;
  "data-notification-item"?: boolean;
  "data-notification-group"?: boolean;
}

export interface ListItemBaseRenderState {
  isSelected: boolean;
  isFocused: boolean;
  isFocusedWithin: boolean;
  isActive: boolean;
  isDragging: boolean;
  isDropTarget: boolean;
  dropPlacement: "Before" | "After" | "On" | null;
  selectionMode: string;
}

/**
 * Base list item component that provides all behavioral functionality
 * (selection, navigation, drag & drop, focus management) with automatic
 * selection controls based on List's selectionMode.
 *
 * @example Basic usage
 * ```tsx
 * <List selectionMode="Multiple">
 *   <ListItemBase itemKey="1">
 *     {({ isSelected, isFocused }) => (
 *       <div className={cn(isSelected && "bg-blue-100")}>
 *         My content - checkboxes shown automatically!
 *       </div>
 *     )}
 *   </ListItemBase>
 * </List>
 * ```
 */
export function ListItemBase(props: ListItemBaseProps & { ref?: Ref<ListItemRef> }) {
    const {
      ref,
      itemKey,
      type = ListItemType.Active,
      disabled = false,
      movable = false,
      accessibleRole = ListItemAccessibleRole.ListItem,
      accessibleNameRef,
      selected: controlledSelected,
      focused: externalFocused,
      onClick,
      onDragStart,
      onDelete,
      deleteButton,
      children,
      className,
      style,
      "data-testid": dataTestId,
    } = props;

    const listContext = useOptionalListContext();

    // Auto-detect accessibleRole from parent list if not explicitly set
    const effectiveAccessibleRole = useMemo(() => {
      // Only infer from parent when the caller did not provide an explicit role
      if (accessibleRole !== undefined && accessibleRole !== ListItemAccessibleRole.ListItem) {
        return accessibleRole;
      }

      // If explicitly set to ListItem, skip inference only when no parent context
      const parentRole = String(listContext?.accessibleRole || "List");
      // If the caller explicitly passed ListItem AND there is no parent suggesting otherwise, keep it
      if (accessibleRole === ListItemAccessibleRole.ListItem && parentRole === "List") {
        return ListItemAccessibleRole.ListItem;
      }

      // Otherwise, infer from parent list's role
      switch (parentRole) {
        case "ListBox":
          return ListItemAccessibleRole.Option;
        case "Menu":
          return ListItemAccessibleRole.MenuItem;
        case "Tree":
          return ListItemAccessibleRole.TreeItem;
        default:
          return ListItemAccessibleRole.ListItem;
      }
    }, [accessibleRole, listContext?.accessibleRole]);

    const listItem = useListItem({
      itemKey,
      disabled,
      movable,
      type,
      accessibleRole: effectiveAccessibleRole,
      selected: controlledSelected,
      onClick,
      onDragStart,
    });

    // Handle delete button click - call list context's onItemDelete
    const handleDeleteClick = useCallback(() => {
      if (itemKey) {
        listContext?.onItemDelete?.(itemKey);
      }
      onDelete?.();
    }, [itemKey, listContext, onDelete]);

    // Expose imperative methods
    useImperativeHandle(
      ref,
      () => ({
        focus() {
          listItem.focus();
        },
        blur() {
          listItem.blur();
        },
        isFocused() {
          return document.activeElement === listItem.itemRef.current;
        },
        get nativeElement() {
          return listItem.itemRef.current;
        },
      }),
      [listItem]
    );

    // Prepare render state for children function
    const renderState: ListItemBaseRenderState = {
      isSelected: listItem.isSelected,
      isFocused: listItem.isFocused,
      isFocusedWithin: listItem.isFocusedWithin,
      isActive: listItem.isActive,
      isDragging: listItem.isDragging,
      isDropTarget: listItem.isDropTarget,
      dropPlacement: listItem.dropPlacement,
      selectionMode: String(listItem.selectionMode),
    };

    // Determine selection control position based on mode
    const modeStr = String(listItem.selectionMode);
    const position = (modeStr === "SingleEnd" || modeStr === "Delete") ? "after" : "before";

    // Auto-show selection control for all modes except None
    const shouldShowControl = modeStr !== "None";

    // Render content
    const content = typeof children === "function" ? children(renderState) : children;

    // Resolve accessible role to HTML role attribute
    const resolvedRole = (() => {
      const roleStr = String(effectiveAccessibleRole);
      switch (roleStr) {
        case "Option": return "option";
        case "MenuItem": return "menuitem";
        case "TreeItem": return "treeitem";
        case "Group": return "group";
        case "None": return undefined;
        default: return "listitem";
      }
    })();

    return (
      <li
        ref={listItem.itemRef}
        id={listItem.id}
        role={resolvedRole}
        aria-labelledby={accessibleNameRef}
        aria-selected={listItem.ariaSelected}
        aria-disabled={disabled || undefined}
        aria-setsize={listContext?.totalItemCount}
        aria-posinset={itemKey && listContext ? (listContext.getItemIndex(itemKey) + 1) || undefined : undefined}
        tabIndex={listItem.tabIndex}
        draggable={movable}
        onClick={listItem.handleClick}
        onKeyDown={listItem.handleKeyDown}
        onMouseDownCapture={listItem.handleMouseDownCapture}
        onMouseDown={listItem.handleMouseDown}
        onMouseUp={listItem.handleMouseUp}
        onMouseLeave={listItem.handleMouseUp}
        onFocus={listItem.handleFocus}
        onBlur={listItem.handleBlur}
        onDragStart={listItem.handleDragStart}
        onDragEnd={listItem.handleDragEnd}
        onDragOver={listItem.handleDragOver}
        onDragEnter={listItem.handleDragEnter}
        onDragLeave={listItem.handleDragLeave}
        onDrop={listItem.handleDrop}
        className={cn(
          // Base item styles - container layout (shared with group headers)
          LIST_ITEM_BASE_CLASSES,
          "text-sm text-sapphire-text-primary",
          "bg-sapphire-canvas-primary",
          // State classes
          listItem.isSelected && "bg-sapphire-brand-selected-background",
          (externalFocused || listItem.isFocused) && LIST_ITEM_FOCUS_CLASSES,
          listItem.isActive && "bg-sapphire-neutral-pressed-background",
          listItem.isDragging && "opacity-50",
          movable && "cursor-grab",
          listItem.isDragging && "cursor-grabbing",
          disabled && "opacity-50 pointer-events-none cursor-not-allowed",
          // Interactive states
          (type === ListItemType.Active || type === ListItemType.Navigation) && !listItem.isSelected && "cursor-pointer hover:bg-sapphire-neutral-hover-background-2 active:bg-sapphire-neutral-pressed-background",
          (type === ListItemType.Active || type === ListItemType.Navigation) && listItem.isSelected && "cursor-pointer hover:!bg-sapphire-brand-selected-hover-background active:!bg-sapphire-neutral-pressed-background",
          type === ListItemType.Inactive && "cursor-default",
          // User's custom classes
          className
        )}
        style={style}
        data-testid={dataTestId}
        data-notification-item={props["data-notification-item"] || undefined}
        data-notification-group={props["data-notification-group"] || undefined}
        data-item-key={itemKey}
        data-dragging={listItem.isDragging || undefined}
      >
        {/* Drop indicator */}
        {listItem.dropPlacement && (
          <DropIndicator visible={true} placement={listItem.dropPlacement} />
        )}

        {/* Selection control before content */}
        {shouldShowControl && position === "before" && (
          <ListSelectionControl
            selectionMode={listItem.selectionMode}
            position="before"
            isSelected={listItem.isSelected}
            disabled={disabled}
            deleteButton={deleteButton}
            onSelectionChange={listItem.handleSelectionChange}
            onDeleteClick={handleDeleteClick}
          />
        )}

        {/* Main content - no wrapper, children render directly */}
        {content}

        {/* Selection control after content */}
        {
          shouldShowControl && position === "after" && (
            <ListSelectionControl
              selectionMode={listItem.selectionMode}
              position="after"
              isSelected={listItem.isSelected}
              disabled={disabled}
              deleteButton={deleteButton}
              onSelectionChange={listItem.handleSelectionChange}
              onDeleteClick={handleDeleteClick}
            />
          )
        }
      </li >
    );
  }

ListItemBase.displayName = "ListItemBase";
