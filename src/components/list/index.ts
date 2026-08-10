// List components
export { List, ListContext, useListContext, useOptionalListContext } from "./List";
export { ListItem } from "./ListItem";
export { ListItemCustom } from "./ListItemCustom";
export { ConversationListItem } from "./ConversationListItem";
export type { ConversationListItemProps } from "./ConversationListItem";
export { ConversationGroupListItem } from "./ConversationGroupListItem";
export type { ConversationGroupListItemProps } from "./ConversationGroupListItem";
export { ListItemGroup } from "./ListItemGroup";
export { ListItemSeparator } from "./ListItemSeparator";
export type { ListItemSeparatorProps } from "./ListItemSeparator";
export { DropIndicator } from "./DropIndicator";
export type { DropPlacement } from "./DropIndicator";

// Base components and hooks for composition
export { ListItemBase } from "./ListItemBase";
export type { ListItemBaseRenderState } from "./ListItemBase";
export { ListGroupHeaderBase } from "./ListGroupHeaderBase";
export type { ListGroupHeaderBaseProps, ListGroupHeaderBaseRenderState } from "./ListGroupHeaderBase";
export { ListItemGroupBase } from "./ListItemGroupBase";
export type { ListItemGroupBaseProps } from "./ListItemGroupBase";

// Composition hooks - main hook
export { useListItem } from "./useListItem";
export type { UseListItemOptions, UseListItemResult } from "./useListItem";

// Composition hooks - granular hooks for advanced usage
export { useListItemSelection } from "./hooks/useListItemSelection";
export type { UseListItemSelectionOptions, UseListItemSelectionResult } from "./hooks/useListItemSelection";
export { useListItemFocus } from "./hooks/useListItemFocus";
export type { UseListItemFocusOptions, UseListItemFocusResult } from "./hooks/useListItemFocus";
export { useListItemDragDrop } from "./hooks/useListItemDragDrop";
export type { UseListItemDragDropOptions, UseListItemDragDropResult } from "./hooks/useListItemDragDrop";
export { useListItemRegistration } from "./hooks/useListItemRegistration";
export type { UseListItemRegistrationOptions, UseListItemRegistrationResult } from "./hooks/useListItemRegistration";

// Group hooks
export { useListGroupHeader } from "./useListGroupHeader";
export type { UseListGroupHeaderOptions, UseListGroupHeaderResult } from "./useListGroupHeader";
export { useListItemGroup } from "./useListItemGroup";
export type { ListItemGroupContextValue } from "./useListItemGroup";

// Helper components
export { ListSelectionControl } from "./ListSelectionControl";
export type { ListSelectionControlProps } from "./ListSelectionControl";

// Shared styles (for custom implementations)
export { LIST_ITEM_BASE_CLASSES, LIST_ITEM_FOCUS_CLASSES } from "./shared-styles";
