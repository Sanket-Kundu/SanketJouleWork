/**
 * List component types
 *
 * Comprehensive type definitions for the shadcn-ui5 List component
 * with full UI5 feature parity.
 */

import React from "react";

// ============================================================================
// ENUMS
// ============================================================================

/**
 * Selection modes available for the List component
 */
export enum ListSelectionMode {
  /** No selection enabled */
  None = "None",
  /** Single selection with radio button at start */
  SingleStart = "SingleStart",
  /** Single selection with radio button at end */
  SingleEnd = "SingleEnd",
  /** Single selection auto-select on click */
  Single = "Single",
  /** Multiple selection with checkboxes */
  Multiple = "Multiple",
  /** Delete mode with delete buttons */
  Delete = "Delete",
}

/**
 * Growing modes for loading more items
 */
export enum ListGrowingMode {
  /** No growing */
  None = "None",
  /** Load more via button click */
  Button = "Button",
  /** Load more on scroll to bottom */
  Scroll = "Scroll",
}

/**
 * Separator styles between list items
 */
export enum ListSeparator {
  /** Separators between all items */
  All = "All",
  /** Separators only between items (not at edges) */
  Inner = "Inner",
  /** No separators */
  None = "None",
}

/**
 * Accessible roles for the List
 */
export enum ListAccessibleRole {
  /** Standard list role */
  List = "List",
  /** Menu role for menu-like lists */
  Menu = "Menu",
  /** Tree role for hierarchical lists */
  Tree = "Tree",
  /** ListBox role for selection lists */
  ListBox = "ListBox",
}

/**
 * Accessible roles for list items
 */
export enum ListItemAccessibleRole {
  /** Standard list item role (default) */
  ListItem = "ListItem",
  /** Menu item role */
  MenuItem = "MenuItem",
  /** Tree item role */
  TreeItem = "TreeItem",
  /** Option role (for listbox items) */
  Option = "Option",
  /** Group role */
  Group = "Group",
  /** No role */
  None = "None",
}

/**
 * Types of list items
 */
export enum ListItemType {
  /** Active item - has hover/press effects */
  Active = "Active",
  /** Inactive item - no visual response */
  Inactive = "Inactive",
  /** Detail item - shows detail button */
  Detail = "Detail",
  /** Navigation item - shows navigation indicator */
  Navigation = "Navigation",
}

/**
 * Highlight states for list items
 */
export enum ListItemHighlight {
  /** No highlight */
  None = "None",
  /** Positive/success highlight */
  Positive = "Positive",
  /** Critical/warning highlight */
  Critical = "Critical",
  /** Information highlight */
  Information = "Information",
  /** Negative/error highlight */
  Negative = "Negative",
}

/**
 * Value states for additional text
 */
export enum ListItemValueState {
  /** No state */
  None = "None",
  /** Positive/success state */
  Positive = "Positive",
  /** Critical/warning state */
  Critical = "Critical",
  /** Information state */
  Information = "Information",
  /** Negative/error state */
  Negative = "Negative",
}

/**
 * Text wrapping types
 */
export enum ListItemWrappingType {
  /** Text truncates with ellipsis */
  None = "None",
  /** Text wraps to multiple lines */
  Normal = "Normal",
}

// ============================================================================
// EVENT TYPES
// ============================================================================

/**
 * Event detail for item click events
 */
export interface ListItemClickEventDetail {
  /** The HTML element that was clicked */
  item: HTMLElement;
  /** Original mouse or keyboard event that triggered the click */
  originalEvent: React.MouseEvent | React.KeyboardEvent;
}

/**
 * Event detail for selection change events
 */
export interface ListSelectionChangeEventDetail<T = unknown> {
  /** Array of currently selected items */
  selectedItems: T[];
  /** Array of previously selected items */
  previouslySelectedItems: T[];
  /** Whether a selection control (checkbox/radio) was pressed */
  selectionComponentPressed: boolean;
  /** The item that triggered the selection change */
  targetItem: T;
  /** The key of the target item */
  key?: string;
  /** Array of all selected item keys (always available) */
  selectedKeys?: string[];
}

/**
 * Event detail for item delete events
 */
export interface ListItemDeleteEventDetail<T = unknown> {
  /** The item that was deleted */
  item: T;
}

/**
 * Event detail for item close events
 */
export interface ListItemCloseEventDetail<T = unknown> {
  /** The item that was closed */
  item: T;
}

/**
 * Event detail for item toggle events
 */
export interface ListItemToggleEventDetail<T = unknown> {
  /** The item that was toggled */
  item: T;
}

/**
 * Event detail for load more events (growing mode)
 */
export interface ListLoadMoreEventDetail {
  /** Current number of items displayed in the list */
  currentCount: number;
}

/**
 * Event detail for item focus events
 */
export interface ListItemFocusedEventDetail<T = unknown> {
  /** The item that received focus */
  item: T;
  /** The index of the focused item */
  index: number;
}

/**
 * Event detail for drag and drop move operations
 */
export interface ListMoveEventDetail<T = unknown> {
  /** Source information for the dragged item(s) */
  source: {
    /** The dragged item */
    element: T;
    /** Multiple items when dragging with multi-selection enabled */
    elements?: T[];
    /** Index of the source item (-1 for cross-list drops) */
    index: number;
  };
  /** Destination information for the drop target */
  destination: {
    /** The item at the drop location */
    element: T;
    /** Where to place the dropped item relative to the target */
    placement: "Before" | "After" | "On";
    /** Index of the destination item */
    index: number;
  };
  /** Original drag or keyboard event */
  originalEvent?: DragEvent | React.KeyboardEvent;
}

// ============================================================================
// COMPONENT PROPS
// ============================================================================

/**
 * Base props shared by list items
 */
export interface ListItemBaseProps {
  /** Unique key for the item */
  itemKey?: string;

  /** Whether the item is selected */
  selected?: boolean;

  /** Whether the item is disabled */
  disabled?: boolean;

  /** Whether the item is focused */
  focused?: boolean;

  /** Whether the item is movable via drag and drop */
  movable?: boolean;

  /** Whether to show bottom border separator */
  hasBorder?: boolean;

  /** Accessible role for the item. @default "ListItem" */
  accessibleRole?: ListItemAccessibleRole | `${ListItemAccessibleRole}`;

  /** CSS class name */
  className?: string;

  /** Inline styles */
  style?: React.CSSProperties;

  /** Data test ID */
  "data-testid"?: string;
}

/**
 * Props for standard list item (ui5-li equivalent)
 */
export interface ListItemProps extends ListItemBaseProps {
  /** Ref for imperative access */
  ref?: React.Ref<ListItemRef>;
  // === Content ===
  /** Main text content of the item */
  text?: string;
  /** Secondary description text displayed below the main text */
  description?: string;
  /** Custom content (children) overrides text prop */
  children?: React.ReactNode;

  // === Icons & Images ===
  /** Icon element to display */
  icon?: React.ReactNode;
  /** Whether the icon should be displayed at the end instead of start */
  iconEnd?: boolean;
  /** Custom image or avatar slot displayed at the start */
  image?: React.ReactNode;

  // === Action ===
  /** Optional action element (e.g. IconButton) displayed after the content area */
  action?: React.ReactNode;

  // === Additional Information ===
  /** Additional text displayed at the end of the item */
  additionalText?: string;
  /** Visual state of the additional text
   * @default ListItemValueState.None
   */
  additionalTextState?: ListItemValueState | `${ListItemValueState}`;

  // === Behavior ===
  /** Type of the list item
   * @default ListItemType.Active
   */
  type?: ListItemType | `${ListItemType}`;
  /** Highlight state shown as a colored bar on the left
   * @default ListItemHighlight.None
   */
  highlight?: ListItemHighlight | `${ListItemHighlight}`;
  /** Whether the item shows a navigation indicator */
  navigated?: boolean;

  // === Text Wrapping ===
  /** Text wrapping behavior
   * @default ListItemWrappingType.None
   */
  wrappingType?: ListItemWrappingType | `${ListItemWrappingType}`;
  /** Maximum characters before truncation (responsive based on screen size) */
  maxCharacters?: number;

  // === Accessibility ===
  /** Tooltip text shown on hover */
  tooltip?: string;
  /** Accessible name override (aria-label) */
  accessibleName?: string;

  // === Events ===
  /** Click handler for the item */
  onClick?: (e: React.MouseEvent | React.KeyboardEvent) => void;
  /** Click handler for the detail button (when type is Detail) */
  onDetailClick?: (e: React.MouseEvent | React.KeyboardEvent) => void;
  /** Drag start handler for cross-list drag and drop */
  onDragStart?: () => void;
  /** Delete callback when item is deleted */
  onDelete?: () => void;

  // === Customization ===
  /** Custom delete button element */
  deleteButton?: React.ReactNode;

  // Internal props (passed from List context)
  /** @internal Selection mode from parent list */
  _selectionMode?: ListSelectionMode | `${ListSelectionMode}`;
  /** @internal Media range for responsive text */
  _mediaRange?: "S" | "M" | "L" | "XL";
  /** @internal Tab index */
  _tabIndex?: number;
}

/**
 * Props for custom list item (ui5-li-custom equivalent)
 */
export interface ListItemCustomProps extends ListItemBaseProps {
  /** Type of the list item */
  type?: ListItemType | `${ListItemType}`;

  /** Highlight state of the item */
  highlight?: ListItemHighlight | `${ListItemHighlight}`;

  /** Accessible name override */
  accessibleName?: string;

  /** Custom content */
  children: React.ReactNode;

  /** Click handler */
  onClick?: (e: React.MouseEvent | React.KeyboardEvent) => void;

  /** Custom delete button */
  deleteButton?: React.ReactNode;

  // Internal props
  /** @internal Selection mode from parent list */
  _selectionMode?: ListSelectionMode | `${ListSelectionMode}`;
  /** @internal Tab index */
  _tabIndex?: number;
}

/**
 * Props for list item group (ui5-li-group equivalent)
 */
export interface ListItemGroupProps {
  // === Header ===
  /** Header text for the group */
  headerText?: string;
  /** Accessible name for the group header */
  headerAccessibleName?: string;
  /** Custom header content slot */
  header?: React.ReactNode;
  /** Text wrapping behavior for the header
   * @default ListItemWrappingType.None
   */
  wrappingType?: ListItemWrappingType | `${ListItemWrappingType}`;
  /** Whether the group header sticks to the top when scrolling */
  stickyHeader?: boolean;

  // === Collapsible Behavior ===
  /** Whether the group can be collapsed by clicking the header */
  collapsible?: boolean;
  /** Controlled collapsed state */
  collapsed?: boolean;
  /** Default collapsed state (uncontrolled mode) */
  defaultCollapsed?: boolean;
  /** Callback when the collapsed state changes */
  onToggle?: (collapsed: boolean) => void;

  // === Content ===
  /** List items within this group */
  children: React.ReactNode;

  // === Standard ===
  /** CSS class name */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Data test ID for testing */
  "data-testid"?: string;
}

/**
 * Accessibility attributes for growing button
 */
export interface ListAccessibilityAttributes {
  growingButton?: {
    name?: string;
    description?: string;
  };
}

/**
 * Main List component props
 */
export interface ListProps<T = unknown> {
  /** Ref for imperative access */
  ref?: React.Ref<ListRef<T>>;
  // === Header & Footer ===
  /** Header text displayed at the top of the list */
  headerText?: string;
  /** Custom header slot for complex header content */
  header?: React.ReactNode;
  /** Footer text displayed at the bottom of the list */
  footerText?: string;

  // === Selection ===
  /**
   * Selection mode for list items
   * @default ListSelectionMode.None
   */
  selectionMode?: ListSelectionMode | `${ListSelectionMode}`;
  /** Controlled selected item keys */
  selectedKeys?: string[];
  /** Default selected item keys (uncontrolled mode) */
  defaultSelectedKeys?: string[];
  /** Callback when selection state changes */
  onSelectionChange?: (detail: ListSelectionChangeEventDetail<T>) => void;

  // === Data ===
  /** Items array for data-driven rendering */
  items?: T[];
  /** Function to render each item from the items array */
  renderItem?: (item: T, index: number) => React.ReactNode;
  /** Function to extract unique key from each item
   * @default (item, index) => item.id ?? item.key ?? index
   */
  getItemKey?: (item: T, index: number) => string;
  /** Children for declarative list item usage */
  children?: React.ReactNode;

  // === Empty & Loading ===
  /** Text displayed when the list has no items
   * @default "No data available"
   */
  noDataText?: string;
  /** Custom empty state content slot */
  noDataSlot?: React.ReactNode;
  /** Whether the list is in loading state */
  loading?: boolean;
  /** Delay in milliseconds before showing loading indicator
   * @default 1000
   */
  loadingDelay?: number;

  // === Growing (Pagination) ===
  /** Growing mode for loading more items
   * @default ListGrowingMode.None
   */
  growing?: ListGrowingMode | `${ListGrowingMode}`;
  /** Custom text for the "Load More" button
   * @default "More"
   */
  growingButtonText?: string;
  /** Whether there are more items available to load */
  hasMore?: boolean;
  /** Callback when more items should be loaded */
  onLoadMore?: (detail: ListLoadMoreEventDetail) => void;

  // === Visual ===
  /** Separator style between list items
   * @default ListSeparator.All
   */
  separators?: ListSeparator | `${ListSeparator}`;
  /** Whether the list content should be indented */
  indent?: boolean;
  /** Whether the header should stick to the top when scrolling */
  stickyHeader?: boolean;
  /** Whether the footer should stick to the bottom when scrolling */
  stickyFooter?: boolean;

  // === Events ===
  /** Callback when an item is clicked */
  onItemClick?: (detail: ListItemClickEventDetail) => void;
  /** Callback when an item is deleted (Delete mode) */
  onItemDelete?: (detail: ListItemDeleteEventDetail<T>) => void;
  /** Callback when an item is closed */
  onItemClose?: (detail: ListItemCloseEventDetail<T>) => void;
  /** Callback when an item is toggled */
  onItemToggle?: (detail: ListItemToggleEventDetail<T>) => void;
  /** Callback when an item receives focus */
  onItemFocused?: (detail: ListItemFocusedEventDetail<T>) => void;

  // === Drag and Drop ===
  /** Callback when a movable item is dragged over a drop target (for validation) */
  onMoveOver?: (detail: ListMoveEventDetail<T>) => void;
  /** Callback when a movable item is dropped (for reordering) */
  onMove?: (detail: ListMoveEventDetail<T>) => void;

  // === Accessibility ===
  /** Accessible name for the list (aria-label) */
  accessibleName?: string;
  /** ID of element that labels the list (aria-labelledby) */
  accessibleNameRef?: string;
  /** Accessible description for the list */
  accessibleDescription?: string;
  /** ID of element that describes the list (aria-describedby) */
  accessibleDescriptionRef?: string;
  /** Accessible role for the list
   * @default ListAccessibleRole.List
   */
  accessibleRole?: ListAccessibleRole | `${ListAccessibleRole}`;
  /** Additional accessibility attributes */
  accessibilityAttributes?: ListAccessibilityAttributes;

  // === Standard ===
  /** CSS class name */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Element ID */
  id?: string;
  /** Data test ID for testing */
  "data-testid"?: string;
  /** AI context hint for AI-assisted development */
  "data-ai-context"?: string;
}

// ============================================================================
// REF TYPES
// ============================================================================

/**
 * Ref interface for ListItem
 */
export interface ListItemRef {
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
 * Ref interface for List
 */
export interface ListRef<T = unknown> {
  // Focus
  /** Focus the list */
  focus(): void;
  /** Focus a specific item by index */
  focusItem(index: number): void;
  /** Get the currently focused item index */
  getFocusedItemIndex(): number;

  // Selection
  /** Get selected keys */
  getSelectedKeys(): string[];
  /** Get selected items */
  getSelectedItems(): T[];
  /** Check if an item is selected */
  isSelected(key: string): boolean;
  /** Select items by keys */
  select(keys: string | string[]): void;
  /** Deselect items by keys */
  deselect(keys: string | string[]): void;
  /** Toggle selection of an item */
  toggleSelection(key: string): void;
  /** Select all items */
  selectAll(): void;
  /** Deselect all items */
  deselectAll(): void;

  // Data
  /** Get all items */
  getItems(): T[];
  /** Get item count */
  getItemCount(): number;
  /** Get item by key */
  getItemByKey(key: string): T | undefined;

  // Scrolling
  /** Scroll to a specific item */
  scrollToItem(index: number, align?: "start" | "center" | "end"): void;
  /** Scroll to top */
  scrollToTop(): void;
  /** Scroll to bottom */
  scrollToBottom(): void;

  // Elements
  /** Get the list element */
  readonly listElement: HTMLUListElement | null;
  /** Get the scroll container element */
  readonly scrollContainer: HTMLDivElement | null;
}

// ============================================================================
// CONTEXT TYPES
// ============================================================================

/**
 * List context value shared with child items
 */
export interface ListContextValue {
  // Selection
  selectionMode: ListSelectionMode | `${ListSelectionMode}`;
  selectedKeys: Set<string>;
  onSelect: (key: string, selected: boolean) => void;
  onToggleSelect: (key: string) => void;
  isSelected: (key: string) => boolean;

  // Navigation
  focusedIndex: number;
  onFocusItem: (index: number) => void;
  registerItem: (key: string, index: number) => void;
  unregisterItem: (key: string) => void;
  registerNavigationItem: (index: number, element: HTMLElement | null) => void;

  // Tab Navigation
  onForwardTabAfter?: (key: string, event: React.KeyboardEvent) => void;
  onForwardTabBefore?: (key: string, event: React.KeyboardEvent) => void;

  // Visual
  separators: ListSeparator | `${ListSeparator}`;
  indent: boolean;

  // Events
  onItemClick?: (key: string, event: React.MouseEvent | React.KeyboardEvent) => void;
  onItemDelete?: (key: string) => void;

  // Drag and Drop
  onDragStart?: (key: string, event: React.DragEvent) => void;
  onDragEnd?: (key: string, event: React.DragEvent) => void;
  onDragOver?: (key: string, event: React.DragEvent) => void;
  onDrop?: (key: string, event: React.DragEvent) => void;
  draggedKey?: string | null;
  dropTargetKey?: string | null;
  dropPlacement?: "Before" | "After" | "On" | null;

  // Responsive
  mediaRange: "S" | "M" | "L" | "XL";

  // Item count for aria-setsize
  totalItemCount: number;

  // Item index lookup for aria-posinset
  getItemIndex: (key: string) => number;

  // Accessibility
  accessibleRole: ListAccessibleRole | `${ListAccessibleRole}`;
  supportsAriaSelected: boolean;
}
