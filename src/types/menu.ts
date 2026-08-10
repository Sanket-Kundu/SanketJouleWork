import React from "react";

/**
 * Check mode for MenuItemGroup
 */
export enum MenuItemGroupCheckMode {
  None = "None",
  Single = "Single",
  Multiple = "Multiple",
}

/**
 * Menu item click event detail
 */
export interface MenuItemClickDetail {
  /** The menu item that was clicked */
  item: MenuItemProps;
  /** The item's text */
  text: string;
  /** Whether the item is checked (meaningful inside MenuItemGroup) */
  checked?: boolean;
}

/**
 * Before-close event detail
 */
export interface MenuBeforeCloseDetail {
  /** Whether close was triggered by Escape key */
  escPressed: boolean;
}

/**
 * Menu props interface
 */
export interface MenuProps {
  /** Ref for imperative access */
  ref?: React.Ref<MenuRef>;
  /** Whether the menu is open */
  open?: boolean;
  /** Anchor element for positioning (HTMLElement or string ID) */
  opener?: HTMLElement | string | null;
  /** Menu items */
  children?: React.ReactNode;
  /** Placement relative to anchor */
  placement?: "bottom-start" | "bottom-end" | "top-start" | "top-end" | "right-start" | "right-end" | "left-start" | "left-end";
  /** Handler when menu closes */
  onClose?: () => void;
  /** Handler when item is selected. Return false to keep menu open (cancelable). */
  onItemClick?: (detail: MenuItemClickDetail) => void | boolean;
  /** Handler when item is checked/unchecked (inside MenuItemGroup) */
  onCheck?: (detail: MenuItemClickDetail) => void;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Auto-render a MenuHeader at top with this text */
  headerText?: string;
  /** Show loading indicator inside menu */
  loading?: boolean;
  /** Delay before showing loading spinner (ms, default 50) */
  loadingDelay?: number;
  /** Fired before menu opens */
  onBeforeOpen?: () => void;
  /** Fired after menu opens and is positioned */
  onOpen?: () => void;
  /** Fired before menu closes */
  onBeforeClose?: (detail: MenuBeforeCloseDetail) => void;
  /** Forwarded to the root popover element for test selectors. Children (`MenuItem`, etc.) accept their own `data-testid`. */
  "data-testid"?: string;
}

/**
 * MenuItem props interface
 */
export interface MenuItemProps {
  /** Item text */
  text?: string;
  /** Subtitle displayed below the title text */
  subtitle?: string;
  /** Item icon (React node) */
  icon?: React.ReactNode;
  /** End content (e.g., badge, shortcut). Hidden when submenu present. */
  endContent?: React.ReactNode;
  /** Whether item is disabled */
  disabled?: boolean;
  /** Whether item starts a new section */
  startsSection?: boolean;
  /** Whether item has submenu */
  hasSubmenu?: boolean;
  /** Submenu items */
  children?: React.ReactNode;
  /** Click handler */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  /** Additional CSS classes */
  className?: string;
  /** Arbitrary data to pass with click events */
  data?: unknown;
  /** Whether item is checked (used inside MenuItemGroup) */
  checked?: boolean;
  /** Secondary text on the right (hidden when endContent or submenu present) */
  additionalText?: string;
  /** Show loading spinner in submenu */
  loading?: boolean;
  /** Delay before showing loading spinner (ms, default 50) */
  loadingDelay?: number;
  /** Native tooltip */
  tooltip?: string;
  /** Accessible name (aria-label override) */
  accessibleName?: string;
  /** Additional accessibility attributes */
  accessibilityAttributes?: MenuItemAccessibilityAttributes;
  /** Forwarded to the rendered menu item element for test selectors. */
  "data-testid"?: string;
}

/**
 * Accessibility attributes for MenuItem
 */
export interface MenuItemAccessibilityAttributes {
  /** Keyboard shortcut hint for screen readers (e.g. "Ctrl+C") */
  ariaKeyShortcuts?: string;
  /** Custom ARIA role override */
  role?: string;
}

/**
 * MenuSeparator props interface
 */
export interface MenuSeparatorProps {
  /** Additional CSS classes */
  className?: string;
  /** Forwarded to the rendered separator element for test selectors. */
  "data-testid"?: string;
}

/**
 * MenuHeader props interface (for section headers)
 */
export interface MenuHeaderProps {
  /** Header text */
  text?: string;
  /** Header content */
  children?: React.ReactNode;
  /** Content rendered at the end (right side), e.g. action icon buttons */
  endContent?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Forwarded to the rendered header element for test selectors. */
  "data-testid"?: string;
}

/**
 * MenuItemGroup props interface
 */
export interface MenuItemGroupProps {
  /** Check mode: None, Single, or Multiple */
  checkMode?: MenuItemGroupCheckMode | `${MenuItemGroupCheckMode}`;
  /** Group children (MenuItems) */
  children?: React.ReactNode;
  /** Accessible name for the group */
  accessibleName?: string;
  /** Additional CSS classes */
  className?: string;
  /** Forwarded to the rendered group element for test selectors. */
  "data-testid"?: string;
}

/**
 * Menu ref interface
 */
export interface MenuRef {
  /** Close the menu */
  close: () => void;
  /** Check if open */
  isOpen: () => boolean;
}
