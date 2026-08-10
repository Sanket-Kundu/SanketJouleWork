import React, { ReactNode } from "react";
import { ButtonDesign } from "./button";
import { SelectChangeDetail } from "./select";

/**
 * Toolbar visual design variants
 */
export enum ToolbarDesign {
  /** Solid background with border */
  Solid = "Solid",
  /** Transparent background */
  Transparent = "Transparent",
}

/**
 * Toolbar content alignment
 */
export enum ToolbarAlign {
  /** Align items to the start (left in LTR) */
  Start = "Start",
  /** Align items to the end (right in LTR) */
  End = "End",
}

/**
 * Controls how a toolbar item participates in overflow
 */
export enum ToolbarItemOverflowBehavior {
  /** Item can overflow when space is constrained (default) */
  Default = "Default",
  /** Item never overflows into the popover */
  NeverOverflow = "NeverOverflow",
  /** Item is always in the overflow popover */
  AlwaysOverflow = "AlwaysOverflow",
}

// ── Toolbar ──────────────────────────────────────────────────────────────────

/**
 * Props for the Toolbar component
 */
export interface ToolbarProps {
  /** Ref for imperative access */
  ref?: React.Ref<ToolbarRef>;
  // === Visual ===
  /** Toolbar design variant. @default "Solid" */
  design?: ToolbarDesign | `${ToolbarDesign}`;
  /** Content alignment direction. @default "End" */
  alignContent?: ToolbarAlign | `${ToolbarAlign}`;

  // === Accessibility ===
  /** Accessible name (aria-label) */
  accessibleName?: string;
  /** ID of labelling element (aria-labelledby) */
  accessibleNameRef?: string;
  /** Accessible description for screen readers */
  accessibleDescription?: string;
  /** ID of element that describes this toolbar */
  accessibleDescriptionRef?: string;

  // === Content ===
  /** Toolbar items */
  children?: ReactNode;

  // === Standard HTML ===
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Element ID */
  id?: string;
  /** Forwarded to the root element for test selectors. */
  "data-testid"?: string;
}

/**
 * Imperative handle for Toolbar
 */
export interface ToolbarRef {
  /** Focus the toolbar */
  focus(): void;
  /** The underlying DOM element */
  readonly nativeElement: HTMLDivElement | null;
}

// ── ToolbarButton ────────────────────────────────────────────────────────────

/**
 * Props for the ToolbarButton component
 */
export interface ToolbarButtonProps {
  /** Ref for imperative access */
  ref?: React.Ref<HTMLElement>;
  // === Visual ===
  /** Button design variant */
  design?: ButtonDesign | `${ButtonDesign}`;
  /** Icon element at start */
  icon?: ReactNode;
  /** Icon element at end */
  endIcon?: ReactNode;
  /** Button text */
  text?: string;
  /** Tooltip text */
  tooltip?: string;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Fixed width (CSS value) */
  width?: string;

  // === Overflow ===
  /** Overflow priority. @default "Default" */
  overflowPriority?: ToolbarItemOverflowBehavior | `${ToolbarItemOverflowBehavior}`;
  /** Prevent popover from closing on click */
  preventOverflowClosing?: boolean;

  // === Accessibility ===
  /** Accessible name (aria-label) */
  accessibleName?: string;
  /** ID of labelling element (aria-labelledby) */
  accessibleNameRef?: string;

  // === Events ===
  /** Called when button is clicked */
  onClick?: (e: React.MouseEvent) => void;

  // === Standard HTML ===
  /** Additional CSS classes */
  className?: string;
}

// ── ToolbarSeparator ─────────────────────────────────────────────────────────

/**
 * Props for the ToolbarSeparator component
 */
export interface ToolbarSeparatorProps {
  /** Ref for imperative access */
  ref?: React.Ref<HTMLDivElement>;
  /** Additional CSS classes */
  className?: string;
}

// ── ToolbarSpacer ────────────────────────────────────────────────────────────

/**
 * Props for the ToolbarSpacer component
 */
export interface ToolbarSpacerProps {
  /** Ref for imperative access */
  ref?: React.Ref<HTMLDivElement>;
  /** Fixed width (CSS value). Default "auto" = flex-grow. */
  width?: string;
  /** Additional CSS classes */
  className?: string;
}

// ── ToolbarSelect ────────────────────────────────────────────────────────────

/**
 * Props for the ToolbarSelect component
 */
export interface ToolbarSelectProps {
  /** Ref for imperative access */
  ref?: React.Ref<HTMLDivElement>;
  // === Visual ===
  /** Fixed width (CSS value) */
  width?: string;
  /** Currently selected value */
  value?: string;
  /** Whether the select is disabled */
  disabled?: boolean;

  // === Overflow ===
  /** Overflow priority. @default "Default" */
  overflowPriority?: ToolbarItemOverflowBehavior | `${ToolbarItemOverflowBehavior}`;
  /** Prevent popover from closing on change */
  preventOverflowClosing?: boolean;

  // === Accessibility ===
  /** Accessible name (aria-label) */
  accessibleName?: string;
  /** ID of labelling element (aria-labelledby) */
  accessibleNameRef?: string;

  // === Events ===
  /** Called when selection changes */
  onChange?: (detail: SelectChangeDetail) => void;
  /** Called when dropdown opens */
  onOpen?: () => void;
  /** Called when dropdown closes */
  onClose?: () => void;

  // === Content ===
  /** ToolbarSelectOption children */
  children?: ReactNode;

  // === Standard HTML ===
  /** Additional CSS classes */
  className?: string;
}

// ── ToolbarSelectOption ──────────────────────────────────────────────────────

/**
 * Props for the ToolbarSelectOption component
 */
export interface ToolbarSelectOptionProps {
  /** Ref for imperative access */
  ref?: React.Ref<HTMLLIElement>;
  /** The value for this option */
  value?: string;
  /** Whether this option is selected */
  selected?: boolean;
  /** Option content */
  children?: ReactNode;
}

// ── ToolbarItem ──────────────────────────────────────────────────────────────

/**
 * Props for the ToolbarItem component
 */
export interface ToolbarItemProps {
  /** Ref for imperative access */
  ref?: React.Ref<HTMLDivElement>;
  // === Overflow ===
  /** Overflow priority. @default "Default" */
  overflowPriority?: ToolbarItemOverflowBehavior | `${ToolbarItemOverflowBehavior}`;
  /** Prevent popover from closing on interaction */
  preventOverflowClosing?: boolean;

  // === Content ===
  /** Item content */
  children?: ReactNode;

  // === Standard HTML ===
  /** Additional CSS classes */
  className?: string;
}
