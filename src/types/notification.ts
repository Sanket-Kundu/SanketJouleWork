/**
 * Notification component types
 *
 * Type definitions for NotificationList, NotificationListItem,
 * and NotificationListGroupItem components.
 */

import React from "react";
import { ListGrowingMode, ListItemWrappingType } from "./list";

// ============================================================================
// ENUMS
// ============================================================================

/**
 * Importance levels for notification items
 */
export enum NotificationListItemImportance {
  /** Standard importance (default) */
  Standard = "Standard",
  /** Important - shows a visual badge */
  Important = "Important",
}

/**
 * Visual states for notification items
 */
export enum NotificationListItemState {
  /** No state indicator */
  None = "None",
  /** Positive/success state */
  Positive = "Positive",
  /** Critical/warning state */
  Critical = "Critical",
  /** Negative/error state */
  Negative = "Negative",
  /** Information state */
  Information = "Information",
}

// ============================================================================
// EVENT TYPES
// ============================================================================

/**
 * Event detail for notification item click
 */
export interface NotificationItemClickEventDetail {
  item: HTMLElement;
  originalEvent: React.MouseEvent | React.KeyboardEvent;
}

/**
 * Event detail for notification item close
 */
export interface NotificationItemCloseEventDetail {
  item: HTMLElement;
}

/**
 * Event detail for notification item toggle (group collapse)
 */
export interface NotificationItemToggleEventDetail {
  item: HTMLElement;
  collapsed: boolean;
}

/**
 * Event detail for load more
 */
export interface NotificationLoadMoreEventDetail {
  currentCount: number;
}

// ============================================================================
// COMPONENT PROPS
// ============================================================================

/**
 * Props for the NotificationList container
 */
export interface NotificationListProps {
  /** Ref for imperative access */
  ref?: React.Ref<NotificationListRef>;
  /** Notification items or groups */
  children?: React.ReactNode;

  /** Text displayed when the list is empty */
  noDataText?: string;

  // Events
  /** Callback when a notification item is clicked */
  onItemClick?: (detail: NotificationItemClickEventDetail) => void;
  /** Callback when a notification item is closed */
  onItemClose?: (detail: NotificationItemCloseEventDetail) => void;
  /** Callback when a notification group is toggled */
  onItemToggle?: (detail: NotificationItemToggleEventDetail) => void;
  /** Callback when more items should be loaded */
  onLoadMore?: (detail: NotificationLoadMoreEventDetail) => void;

  // Accessibility
  /** Accessible name for the list */
  accessibleName?: string;
  /** ID of element that labels the list */
  accessibleNameRef?: string;

  // Standard HTML
  /** CSS class name */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Element ID */
  id?: string;
  /** Data test ID */
  "data-testid"?: string;
}

/**
 * Props for individual notification items
 */
export interface NotificationListItemProps {
  /** Ref for imperative access */
  ref?: React.Ref<NotificationListItemRef>;
  // Content
  /** Title text of the notification */
  titleText: string;
  /** Description content (children) */
  children?: React.ReactNode;
  /** Avatar element displayed at the start */
  avatar?: React.ReactNode;
  /** Menu element (will be wired with open/opener/onClose) */
  menu?: React.ReactNode;
  /** Footnote elements displayed at the bottom */
  footnotes?: React.ReactNode[];

  // Visual
  /** Text wrapping type for title and description */
  wrappingType?: ListItemWrappingType | `${ListItemWrappingType}`;
  /** Visual state of the notification */
  state?: NotificationListItemState | `${NotificationListItemState}`;
  /** Importance level */
  importance?: NotificationListItemImportance | `${NotificationListItemImportance}`;
  /** Whether the notification has been read */
  read?: boolean;

  // Behavior
  /** Whether to show the close button */
  showClose?: boolean;
  /** Whether the item is in a loading state */
  loading?: boolean;
  /** Delay in ms before showing loading indicator */
  loadingDelay?: number;

  // Events
  /** Callback when the close button is clicked */
  onClose?: () => void;
  /** Callback when the item is clicked */
  onClick?: (e: React.MouseEvent | React.KeyboardEvent) => void;

  // Standard HTML
  /** CSS class name */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Element ID */
  id?: string;
  /** Accessible name override */
  accessibleName?: string;
  /** Data test ID */
  "data-testid"?: string;
}

/**
 * Props for notification group items
 */
export interface NotificationListGroupItemProps {
  /** Ref for imperative access */
  ref?: React.Ref<NotificationListGroupItemRef>;
  // Content
  /** Title text of the group */
  titleText: string;
  /** Notification items within the group */
  children?: React.ReactNode;

  // Behavior
  /** Whether the group is collapsed (controlled) */
  collapsed?: boolean;
  /** Default collapsed state (uncontrolled) */
  defaultCollapsed?: boolean;
  /** Growing mode for loading more items */
  growing?: ListGrowingMode | `${ListGrowingMode}`;
  /** Whether the group is in a loading state */
  loading?: boolean;
  /** Delay in ms before showing loading indicator */
  loadingDelay?: number;

  // Visual
  /** Whether all items in the group are read */
  read?: boolean;

  // Events
  /** Callback when the group is toggled */
  onToggle?: (collapsed: boolean) => void;
  /** Callback when more items should be loaded */
  onLoadMore?: () => void;

  // Standard HTML
  /** CSS class name */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Element ID */
  id?: string;
  /** Accessible name override */
  accessibleName?: string;
  /** Data test ID */
  "data-testid"?: string;
}

// ============================================================================
// REF TYPES
// ============================================================================

/**
 * Ref interface for NotificationList
 */
export interface NotificationListRef {
  /** Focus the list */
  focus(): void;
  /** Blur the list */
  blur(): void;
  /** Check if list is focused */
  isFocused(): boolean;
  /** Get the native element */
  readonly nativeElement: HTMLDivElement | null;
}

/**
 * Ref interface for NotificationListItem
 */
export interface NotificationListItemRef {
  /** Focus the item */
  focus(): void;
  /** Blur the item */
  blur(): void;
  /** Check if item is focused */
  isFocused(): boolean;
  /** Get the native element */
  readonly nativeElement: HTMLLIElement | null;
}

/**
 * Ref interface for NotificationListGroupItem
 */
export interface NotificationListGroupItemRef {
  /** Focus the group */
  focus(): void;
  /** Blur the group */
  blur(): void;
  /** Check if group is focused */
  isFocused(): boolean;
  /** Toggle the collapsed state */
  toggle(): void;
  /** Get the native element */
  readonly nativeElement: HTMLLIElement | null;
}

// ============================================================================
// CONTEXT TYPES
// ============================================================================

/**
 * Context value shared between NotificationList and its children
 */
export interface NotificationListContextValue {
  onItemClick?: (detail: NotificationItemClickEventDetail) => void;
  onItemClose?: (detail: NotificationItemCloseEventDetail) => void;
  onItemToggle?: (detail: NotificationItemToggleEventDetail) => void;
  updateNavigationItems?: () => void;
}
