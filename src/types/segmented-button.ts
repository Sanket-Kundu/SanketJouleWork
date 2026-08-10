import React from "react";

/**
 * Selection mode for SegmentedButton
 */
export type SegmentedButtonSelectionMode = "Single" | "Multiple";

/**
 * Size variants for SegmentedButton
 */
export enum SegmentedButtonSize {
  /** Large segmented button (8px radius, 36px height) */
  Large = "Large",
  /** Medium segmented button (4px radius, 30px height) */
  Medium = "Medium",
  /** Small segmented button (4px radius, 24px height) */
  Small = "Small",
}

/**
 * SegmentedButton selection change detail
 */
export interface SegmentedButtonSelectionChangeDetail {
  /** The selected item */
  selectedItem: SegmentedButtonItemProps;
  /** The selected item's ID */
  selectedId: string;
  /** All currently selected IDs (relevant for Multiple mode) */
  selectedIds: string[];
}

/**
 * SegmentedButton props interface
 */
export interface SegmentedButtonProps {
  /** Ref for imperative access */
  ref?: React.Ref<HTMLUListElement>;
  /** Currently selected item ID (Single mode) */
  selectedId?: string;
  /** Currently selected item IDs (Multiple mode) */
  selectedIds?: string[];
  /** Selection mode: "Single" (default) or "Multiple" */
  selectionMode?: SegmentedButtonSelectionMode;
  /** Size variant: "Large" (default) or "Medium" */
  size?: SegmentedButtonSize | `${SegmentedButtonSize}`;
  /** Children (SegmentedButtonItem components) */
  children?: React.ReactNode;
  /** Selection change handler */
  onSelectionChange?: (detail: SegmentedButtonSelectionChangeDetail) => void;
  /** Accessible name (aria-label) for the segmented button group */
  accessibleName?: string;
  /** ID of external element that labels this segmented button (aria-labelledby) */
  accessibleNameRef?: string;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Forwarded to the root element for test selectors. */
  "data-testid"?: string;
}

/**
 * SegmentedButtonItem props interface
 */
export interface SegmentedButtonItemProps {
  /** Ref for imperative access */
  ref?: React.Ref<HTMLLIElement>;
  /** Unique ID for the item */
  id: string;
  /** Item text */
  text?: string;
  /** Item icon */
  icon?: React.ReactNode;
  /** Whether selected */
  selected?: boolean;
  /** Whether disabled */
  disabled?: boolean;
  /** Tooltip */
  tooltip?: string;
  /** Additional CSS classes */
  className?: string;
  /** Forwarded to the rendered <li>/<button> element for test selectors. */
  "data-testid"?: string;
}

/**
 * Context for SegmentedButton state
 */
export interface SegmentedButtonContextValue {
  selectedId?: string;
  selectedIds?: string[];
  selectionMode: SegmentedButtonSelectionMode;
  size: SegmentedButtonSize | `${SegmentedButtonSize}`;
  onItemSelect: (id: string, item: SegmentedButtonItemProps) => void;
}
