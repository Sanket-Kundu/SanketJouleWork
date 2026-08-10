import React, { ReactNode, CSSProperties } from "react";

// ============================================================================
// ENUMS
// ============================================================================

/**
 * Tab layout - how tabs are displayed
 */
export enum TabLayout {
  /** Tab text inline with icon */
  Inline = "Inline",
  /** Tab text below icon */
  Standard = "Standard",
}

/**
 * Tab overflow mode - how overflowed tabs are handled
 */
export enum TabOverflowMode {
  /** Overflow menu at the end */
  End = "End",
  /** Overflow menu at both start and end */
  StartAndEnd = "StartAndEnd",
}

/**
 * Tab container background design
 */
export enum TabContainerBackgroundDesign {
  /** Solid background */
  Solid = "Solid",
  /** Transparent background */
  Transparent = "Transparent",
  /** Translucent background with blur */
  Translucent = "Translucent",
}

/**
 * Tab strip placement relative to content
 */
export enum TabsPlacement {
  /** Tabs above content (default) */
  Top = "Top",
  /** Tabs below content */
  Bottom = "Bottom",
}

/**
 * Tab semantic design for colored tabs
 */
export enum TabSemanticDesign {
  /** Default neutral color */
  Default = "Default",
  /** Positive/success green color */
  Positive = "Positive",
  /** Negative/error red color */
  Negative = "Negative",
  /** Critical/warning orange color */
  Critical = "Critical",
  /** Neutral gray color */
  Neutral = "Neutral",
}

// ============================================================================
// CORE TYPES
// ============================================================================

/**
 * Tab selection change event detail
 */
export interface TabSelectionChangeDetail {
  /** The newly selected tab ID */
  selectedTabId: string;
  /** The previously selected tab ID */
  previousTabId: string | null;
  /** The index of the selected tab */
  tabIndex: number;
}

/**
 * Tab move event detail (for drag and drop)
 */
export interface TabMoveDetail {
  /** Source tab ID */
  sourceTabId: string;
  /** Source index */
  sourceIndex: number;
  /** Destination tab ID */
  destinationTabId: string;
  /** Destination index */
  destinationIndex: number;
  /** Placement relative to destination: before/after for siblings, on for nesting */
  placement: "before" | "after" | "on";
}

/**
 * Tab move-over event detail (cancelable drag-over event)
 */
export interface TabMoveOverDetail {
  /** Source tab ID being dragged */
  sourceTabId: string;
  /** Destination tab ID being hovered */
  destinationTabId: string;
  /** Placement relative to destination */
  placement: "before" | "after" | "on";
  /** Call to prevent the drop at this position */
  preventDefault: () => void;
  /** Whether preventDefault was called */
  defaultPrevented: boolean;
}

// ============================================================================
// CONTEXT TYPE
// ============================================================================

/**
 * TabContainer context value for child components
 */
export interface TabContainerContextValue {
  /** Currently selected tab ID */
  selectedTabId: string | null;
  /** Select a tab */
  selectTab: (id: string) => void;
  /** Register a tab */
  registerTab: (id: string, element: HTMLElement) => void;
  /** Unregister a tab */
  unregisterTab: (id: string) => void;
  /** Tab layout mode */
  layout: TabLayout | `${TabLayout}`;
  /** Whether tabs are collapsed (icon only) */
  collapsed: boolean;
  /** Whether drag and drop is enabled */
  enableDragDrop: boolean;
  /** Tab move handler */
  onTabMove?: (detail: TabMoveDetail) => void;
  /** Container ID for accessibility */
  containerId: string;
  /** Focus a tab */
  focusTab: (id: string) => void;
  /** Get tab index */
  getTabIndex: (id: string) => number;
  /** Keyboard event handler - called by Tab component */
  onKeyDown?: (e: React.KeyboardEvent, tabId: string) => void;
  /** Keyboard up handler - called by Tab component (Space activates on keyUp) */
  onKeyUp?: (e: React.KeyboardEvent, tabId: string) => void;
  /** Focus event handler - called when a tab receives focus */
  onTabFocus?: (tabId: string) => void;
  /** Blur event handler - called when a tab loses focus */
  onTabBlur?: (e: React.FocusEvent) => void;
  /** The tab ID that should have tabIndex=0 (roving tabindex) */
  activeTabId?: string | null;
  /** Get drag props for a tab (when drag and drop is enabled) */
  getDragProps?: (tabId: string, isMovable?: boolean) => Record<string, unknown>;
  /** Get drop indicator position for a tab */
  getDropIndicator?: (tabId: string) => "before" | "after" | "on" | null;
  /** Check if a tab is being dragged */
  isDragging?: (tabId: string) => boolean;
  /** Check if any tab is being dragged */
  isAnyDragging?: boolean;
  /** The currently dragged tab ID */
  draggedTabId?: string | null;
  /** Raw drag over handler for nested dropdowns */
  handleDragOver?: (e: React.DragEvent, tabId: string) => void;
  /** Raw drag enter handler for nested dropdowns */
  handleDragEnter?: (e: React.DragEvent, tabId: string) => void;
  /** Raw drag leave handler for nested dropdowns */
  handleDragLeave?: (e: React.DragEvent, tabId: string) => void;
  /** Raw drop handler for nested dropdowns */
  handleDrop?: (e: React.DragEvent, tabId: string) => void;
  /** Raw drag start handler for nested dropdowns */
  handleDragStart?: (e: React.DragEvent, tabId: string) => void;
  /** Raw drag end handler for nested dropdowns */
  handleDragEnd?: (e: React.DragEvent) => void;
  /** Tab strip placement (Top or Bottom) */
  tabsPlacement: TabsPlacement | `${TabsPlacement}`;
  /** Detected tab display mode based on tab children */
  tabDisplayMode: "text-only" | "icon" | "mixed";
}

// ============================================================================
// COMPONENT PROPS
// ============================================================================

/**
 * TabContainer component props
 */
export interface TabContainerProps {
  /** Ref for imperative access */
  ref?: React.Ref<TabContainerRef>;
  // === State ===
  /** Controlled selected tab ID */
  selectedTabId?: string;
  /** Default selected tab ID (uncontrolled) */
  defaultSelectedTabId?: string;
  /** If true, no tab is selected initially (user must click to select) */
  noAutoSelection?: boolean;

  // === Layout ===
  /** Tab layout mode */
  layout?: TabLayout | `${TabLayout}`;
  /** Background design (applies to both header and content unless split props are set) */
  backgroundDesign?: TabContainerBackgroundDesign | `${TabContainerBackgroundDesign}`;
  /** Background design for the tab strip header (overrides backgroundDesign for header) */
  headerBackgroundDesign?: TabContainerBackgroundDesign | `${TabContainerBackgroundDesign}`;
  /** Background design for the tab content panel (overrides backgroundDesign for panel) */
  contentBackgroundDesign?: TabContainerBackgroundDesign | `${TabContainerBackgroundDesign}`;
  /** Show only icons (collapsed mode) */
  collapsed?: boolean;
  /** Tab strip placement relative to content */
  tabsPlacement?: TabsPlacement | `${TabsPlacement}`;

  // === Overflow ===
  /** Overflow mode */
  overflowMode?: TabOverflowMode | `${TabOverflowMode}`;
  /** Enable tabs overflow handling */
  tabsOverflowMode?: boolean;
  /** Custom end overflow button element */
  overflowButton?: React.ReactNode;
  /** Custom start overflow button element */
  startOverflowButton?: React.ReactNode;

  // === Drag & Drop ===
  /** Enable drag and drop reordering */
  enableDragDrop?: boolean;
  /** Maximum nesting level for drag and drop (0 = no nesting, undefined = unlimited) */
  maxNestingLevel?: number;

  // === Events ===
  /** Called when tab selection changes */
  onTabSelect?: (detail: TabSelectionChangeDetail) => void;
  /** Called when a tab is moved via drag and drop */
  onTabMove?: (detail: TabMoveDetail) => void;
  /** Called during drag-over with cancelable detail to block specific drops */
  onTabMoveOver?: (detail: TabMoveOverDetail) => void;

  // === Accessibility ===
  /** Accessible name for the tab list */
  accessibleName?: string;
  /** ID of element that labels the tab list */
  accessibleNameRef?: string;

  // === Standard HTML ===
  /** Tab children */
  children?: ReactNode;
  /** Additional CSS class names */
  className?: string;
  /** Inline styles */
  style?: CSSProperties;
  /** Data test ID */
  "data-testid"?: string;
  /** HTML ID */
  id?: string;
}

/**
 * Tab component props
 */
export interface TabProps {
  /** Ref for imperative access */
  ref?: React.Ref<HTMLDivElement>;
  // === Identity ===
  /** Unique tab identifier */
  id: string;

  // === Content ===
  /** Tab label text */
  text?: string;
  /** Tab icon */
  icon?: ReactNode;
  /** Additional text (badge, count) */
  additionalText?: string;

  // === State ===
  /** Whether tab is disabled */
  disabled?: boolean;
  /** Semantic color design */
  design?: TabSemanticDesign | `${TabSemanticDesign}`;
  /** Whether tab can be dragged */
  movable?: boolean;

  // === Nested Tabs ===
  /**
   * Nested sub-tabs - rendered in a dropdown when the expand button is clicked.
   * Can be Tab elements or an array of TabProps objects.
   */
  subTabs?: ReactNode;

  // === Content ===
  /** Panel content when this tab is selected */
  children?: ReactNode;

  // === Accessibility ===
  /** Tooltip text */
  tooltip?: string;
  /** Accessible description */
  accessibleDescription?: string;

  // === Standard HTML ===
  /** Additional CSS class names */
  className?: string;
  /** Inline styles */
  style?: CSSProperties;
  /** Data test ID */
  "data-testid"?: string;
}

/**
 * TabSeparator component props
 */
export interface TabSeparatorProps {
  /** Additional CSS class names */
  className?: string;
  /** Inline styles */
  style?: CSSProperties;
  /** Data test ID */
  "data-testid"?: string;
}

// ============================================================================
// IMPERATIVE HANDLE
// ============================================================================

/**
 * TabContainer ref for imperative control
 */
export interface TabContainerRef {
  /** Select a tab by ID */
  selectTab: (id: string) => void;
  /** Get the currently selected tab ID */
  getSelectedTabId: () => string | null;
  /** Get all tab IDs */
  getTabIds: () => string[];
  /** Scroll to a specific tab */
  scrollToTab: (id: string) => void;
  /** Focus the tab list */
  focus: () => void;
  /** Get the tab list element */
  readonly tabListElement: HTMLElement | null;
  /** Get the tab panel element */
  readonly tabPanelElement: HTMLElement | null;
}

// ============================================================================
// HOOK TYPES
// ============================================================================

/**
 * Options for useTabNavigation hook
 */
export interface UseTabNavigationOptions {
  /** Number of tabs */
  tabCount: number;
  /** Currently focused tab index */
  focusedIndex: number;
  /** Whether tabs are disabled */
  disabledTabs?: Set<number>;
  /** Called when navigation occurs */
  onNavigate?: (index: number) => void;
  /** Called when a tab should be selected */
  onSelect?: (index: number) => void;
  /** Whether to enable RTL mode */
  rtl?: boolean;
}

/**
 * Options for useTabOverflow hook
 */
export interface UseTabOverflowOptions {
  /** Container ref */
  containerRef: React.RefObject<HTMLElement | null>;
  /** Tab list ref */
  tabListRef: React.RefObject<HTMLElement | null>;
  /** Overflow mode */
  overflowMode: TabOverflowMode | `${TabOverflowMode}`;
  /** Whether overflow handling is enabled */
  enabled?: boolean;
  /** Called when overflow state changes */
  onOverflowChange?: (hasStartOverflow: boolean, hasEndOverflow: boolean) => void;
}

/**
 * Options for useTabDragDrop hook
 */
export interface UseTabDragDropOptions {
  /** Whether drag and drop is enabled */
  enabled?: boolean;
  /** Tab IDs in order (flat list) */
  tabIds: string[];
  /** Called when a tab is moved */
  onMove?: (detail: TabMoveDetail) => void;
  /** Called during drag-over with cancelable detail to block specific drops */
  onMoveOver?: (detail: TabMoveOverDetail) => void;
  /** Maximum nesting level allowed (0 = no nesting, undefined = unlimited) */
  maxNestingLevel?: number;
  /** Get the nesting level of a tab (for enforcing maxNestingLevel) */
  getTabNestingLevel?: (tabId: string) => number;
  /** Get the children IDs of a tab (for preventing circular drops) */
  getTabChildren?: (tabId: string) => string[];
}

// ============================================================================
// INTERNAL TYPES
// ============================================================================

/**
 * Internal tab registration data
 */
export interface TabRegistration {
  /** Tab ID */
  id: string;
  /** Tab element */
  element: HTMLElement;
  /** Whether tab is disabled */
  disabled: boolean;
}
