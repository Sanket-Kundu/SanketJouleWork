/**
 * A tab item definition for the Tabbar component.
 */
export interface TabbarItem {
  /** Unique identifier for the tab */
  id: string;
  /** Display label for the tab */
  label: string;
  /** Forwarded to the rendered tab element for test selectors. */
  "data-testid"?: string;
}

/**
 * Detail object passed to the onTabSelect callback.
 */
export interface TabbarSelectionChangeDetail {
  /** The ID of the newly selected tab */
  selectedTab: string;
  /** The ID of the previously selected tab, or null if none */
  previousTab: string | null;
}

/**
 * Tabbar — a horizontal tab bar with optional overflow handling.
 */
export interface TabbarProps {
  /** Additional CSS class name */
  className?: string;

  // === Content ===

  /** Tab items to display */
  items: TabbarItem[];

  // === Behavior ===

  /** The currently selected tab ID (controlled mode) */
  selectedTab?: string;
  /** The initially selected tab ID (uncontrolled mode) */
  defaultSelectedTab?: string;
  /** Enable overflow handling when tabs don't fit */
  enableOverflow?: boolean;
  /** Hide the underline beneath the tabs
   * @default false */
  noUnderline?: boolean;

  // === Accessibility ===

  /** Accessible label for the tablist (aria-label) */
  accessibleName?: string;

  // === Events ===

  /** Fired when a tab is selected */
  onTabSelect?: (detail: TabbarSelectionChangeDetail) => void;

  /** Forwarded to the root <ul role="tablist"> element for test selectors. */
  "data-testid"?: string;
}
