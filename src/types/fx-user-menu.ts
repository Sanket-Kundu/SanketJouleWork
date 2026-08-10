import React from "react";
import type { AvatarColorScheme } from "./avatar";
import type { PopoverPlacement, PopoverHorizontalAlign, PopoverVerticalAlign } from "./popover";

/**
 * Check mode for FxUserMenuItemGroup
 */
export enum FxUserMenuItemCheckMode {
  /** No items can be checked */
  None = "None",
  /** Only one item can be checked at a time */
  Single = "Single",
  /** Multiple items can be checked simultaneously */
  Multiple = "Multiple",
}

/**
 * Account data for FxUserMenu
 */
export interface FxUserMenuAccountData {
  /** Unique identifier for the account */
  id: string;
  /** Avatar image URL */
  avatarSrc?: string;
  /** Avatar initials (fallback if no image) */
  avatarInitials?: string;
  /** Avatar background color scheme */
  avatarColorScheme?: AvatarColorScheme | `${AvatarColorScheme}`;
  /** User's name/title */
  titleText: string;
  /** Email or additional text */
  subtitleText?: string;
  /** Role or department */
  description?: string;
  /** Extra information (e.g., "Primary Employment") */
  additionalInfo?: string;
  /** Whether this is the currently selected account */
  selected?: boolean;
  /** Whether the account is in a loading state */
  loading?: boolean;
}

/**
 * Event detail for account change
 */
export interface FxUserMenuChangeAccountDetail {
  /** The previously selected account */
  prevSelectedAccount: FxUserMenuAccountData;
  /** The newly selected account */
  selectedAccount: FxUserMenuAccountData;
}

/**
 * Event detail for menu item click
 */
export interface FxUserMenuItemClickDetail {
  /** The clicked menu item element */
  item: HTMLElement;
  /** The item text */
  text: string;
}

/**
 * FxUserMenuItem props
 */
export interface FxUserMenuItemProps {
  /** Ref for imperative access */
  ref?: React.Ref<HTMLDivElement>;
  /** Stable identifier for the item. Renders as data-item-key for testing/tour anchoring. */
  itemKey?: string;
  /** Item text */
  text?: string;
  /** Item icon (React node) */
  icon?: React.ReactNode;
  /** Whether the item is checked */
  checked?: boolean;
  /** Whether the item is disabled */
  disabled?: boolean;
  /** Nested sub-menu items */
  children?: React.ReactNode;
  /** Click handler */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  /** Additional CSS classes */
  className?: string;
  /** Arbitrary data to pass with click events */
  data?: unknown;
}

/**
 * FxUserMenuItemGroup props
 */
export interface FxUserMenuItemGroupProps {
  /** Ref for imperative access */
  ref?: React.Ref<HTMLDivElement>;
  /** Check mode for items within the group */
  checkMode?: FxUserMenuItemCheckMode | `${FxUserMenuItemCheckMode}`;
  /** Group items */
  children?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * FxUserMenu props
 */
export interface FxUserMenuProps {
  /** Ref for imperative access */
  ref?: React.Ref<FxUserMenuRef>;
  /** Whether the menu is open (controlled by FxLayout) */
  open?: boolean;
  /** Element that triggers/anchors the menu (injected by FxLayout) */
  opener?: HTMLElement | null;
  /** Whether to show the "Manage Account" button */
  showManageAccount?: boolean;
  /** Whether to show the "Other Accounts" section */
  showOtherAccounts?: boolean;
  /** Whether to show the "Edit Accounts" button */
  showEditAccounts?: boolean;
  /** Whether to show the edit badge on the avatar */
  showEditButton?: boolean;
  /** Whether the avatar is interactive/clickable. @default true */
  avatarInteractive?: boolean;
  /** User accounts data. First account or the one with selected=true is shown as primary. */
  accounts?: FxUserMenuAccountData[];
  /** Menu items (FxUserMenuItem / FxUserMenuItemGroup elements) */
  children?: React.ReactNode;
  /** Custom footer content. When provided, replaces the default "Sign Out" button. */
  footer?: React.ReactNode;

  // Event callbacks
  /** Fired when the account avatar is clicked */
  onAvatarClick?: () => void;
  /** Fired when "Manage Account" button is clicked */
  onManageAccountClick?: () => void;
  /** Fired when "Edit Accounts" button is clicked */
  onEditAccountsClick?: () => void;
  /**
   * Fired when the "Sign Out" button is clicked.
   * Return false to prevent the menu from closing.
   */
  onSignOutClick?: () => boolean | void;
  /** Fired when the menu opens */
  onOpen?: () => void;
  /** Fired when the menu closes (injected by FxLayout) */
  onClose?: () => void;
  /**
   * Fired when switching accounts.
   * Return false to prevent the account switch.
   */
  onChangeAccount?: (detail: FxUserMenuChangeAccountDetail) => boolean | void;
  /**
   * Fired when a menu item is clicked.
   * Return false to prevent the menu from closing.
   */
  onItemClick?: (detail: FxUserMenuItemClickDetail) => boolean | void;

  /** When true, renders as a sliding panel instead of a popover (injected by FxLayout in compact mode). @default false */
  useDialog?: boolean;
  /** Fired when the back button is clicked in panel/dialog mode. Used by FxLayout to reopen the navigation dialog. */
  onBackClick?: () => void;

  /** Popover placement relative to the opener (injected by FxLayout). @default "End" */
  placement?: `${PopoverPlacement}`;
  /** Horizontal alignment when placement is Top/Bottom. @default "End" */
  horizontalAlign?: `${PopoverHorizontalAlign}`;
  /** Vertical alignment when placement is Start/End (injected by FxLayout). @default "Top" */
  verticalAlign?: `${PopoverVerticalAlign}`;

  /** Distance (in pixels) between the menu and its opener (injected by FxLayout). @default 16 */
  offset?: number;

  /** Additional CSS classes */
  className?: string;
  /** Accessible name for the menu popover */
  accessibleName?: string;
  /** Forwarded to the rendered FxUserMenu root for test selectors. */
  "data-testid"?: string;
}

/**
 * FxUserMenu ref interface
 */
export interface FxUserMenuRef {
  /** Close the menu */
  close: () => void;
  /** Check if the menu is open */
  isOpen: () => boolean;
}
