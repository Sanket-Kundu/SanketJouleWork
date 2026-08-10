import React from "react";

/**
 * SideNavigation selection change event detail
 */
export interface SideNavigationSelectionChangeDetail {
  /** The selected item */
  item: SideNavigationItemProps;
}

/**
 * SideNavigation props interface
 */
export interface SideNavigationProps {
  /** Ref for imperative access */
  ref?: React.Ref<SideNavigationRef>;
  /** Whether the navigation is collapsed (icons only) */
  collapsed?: boolean;
  /** Selected item key */
  selectedKey?: string;
  /** Children (SideNavigationItem, SideNavigationGroup) */
  children?: React.ReactNode;
  /** Fixed items at the bottom */
  fixedItems?: React.ReactNode;
  /** Header content */
  header?: React.ReactNode;
  /** Selection change handler */
  onSelectionChange?: (detail: SideNavigationSelectionChangeDetail) => void;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Forwarded to the rendered side navigation root for test selectors. */
  "data-testid"?: string;
}

/**
 * SideNavigationItem props interface
 */
export interface SideNavigationItemProps {
  /** Ref for imperative access */
  ref?: React.Ref<HTMLLIElement>;
  /** Unique key for the item */
  itemKey?: string;
  /** Item text */
  text?: string;
  /** Item icon (React node) */
  icon?: React.ReactNode;
  /** Whether the item is expanded (for items with subitems) */
  expanded?: boolean;
  /** Whether the item is selected */
  selected?: boolean;
  /** Whether the item is disabled */
  disabled?: boolean;
  /** Badge content (shown next to text) */
  badge?: React.ReactNode;
  /** Href for link navigation */
  href?: string;
  /** Target for link */
  target?: string;
  /** Sub-items */
  children?: React.ReactNode;
  /** Click handler */
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  /** Additional CSS classes */
  className?: string;
  /** Whether this is a "whole" item (not a sub-item) */
  wholeItemToggleable?: boolean;
}

/**
 * SideNavigationSubItem props interface
 */
export interface SideNavigationSubItemProps {
  /** Ref for imperative access */
  ref?: React.Ref<HTMLLIElement>;
  /** Unique key for the sub-item */
  itemKey?: string;
  /** Sub-item text */
  text?: string;
  /** Sub-item icon */
  icon?: React.ReactNode;
  /** Whether selected */
  selected?: boolean;
  /** Whether disabled */
  disabled?: boolean;
  /** Href for link navigation */
  href?: string;
  /** Target for link */
  target?: string;
  /** Click handler */
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * SideNavigationGroup props interface
 */
export interface SideNavigationGroupProps {
  /** Ref for imperative access */
  ref?: React.Ref<HTMLLIElement>;
  /** Group text/title */
  text?: string;
  /** Whether the group is expanded */
  expanded?: boolean;
  /** Group items */
  children?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * SideNavigation ref interface
 */
export interface SideNavigationRef {
  /** Access native DOM element */
  readonly nativeElement: HTMLElement | null;
  /** @deprecated Use nativeElement instead */
  getNativeElement: () => HTMLElement | null;
}

/**
 * Context for SideNavigation state
 */
export interface SideNavigationContextValue {
  collapsed: boolean;
  selectedKey?: string;
  onItemSelect: (key: string, item: SideNavigationItemProps) => void;
}
