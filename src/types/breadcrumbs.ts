import React, { ReactNode } from "react";
import { LinkDesign } from "./link";

// ─── Enums ───────────────────────────────────────────────────────────────────

/**
 * Breadcrumbs design variants.
 *
 * - `Standard` – The last item is rendered as non-interactive current-page text
 *   (or an emphasized link if it has an `href`).
 * - `NoCurrentPage` – All items are rendered as links with separators.
 */
export enum BreadcrumbsDesign {
  /** Last item shown as current-page text (default). */
  Standard = "Standard",
  /** All items shown as links; no current-page treatment. */
  NoCurrentPage = "NoCurrentPage",
}

/**
 * Separator style rendered between breadcrumb items.
 */
export enum BreadcrumbsSeparator {
  Slash = "Slash",
  BackSlash = "BackSlash",
  DoubleBackSlash = "DoubleBackSlash",
  DoubleSlash = "DoubleSlash",
  GreaterThan = "GreaterThan",
  DoubleGreaterThan = "DoubleGreaterThan",
}

// ─── Separator character map ─────────────────────────────────────────────────

export const SEPARATOR_MAP: Record<BreadcrumbsSeparator, string> = {
  [BreadcrumbsSeparator.Slash]: "/",
  [BreadcrumbsSeparator.BackSlash]: "\\",
  [BreadcrumbsSeparator.DoubleBackSlash]: "\\\\",
  [BreadcrumbsSeparator.DoubleSlash]: "//",
  [BreadcrumbsSeparator.GreaterThan]: ">",
  [BreadcrumbsSeparator.DoubleGreaterThan]: ">>",
};

// ─── Event detail ────────────────────────────────────────────────────────────

/**
 * Detail object emitted by the `onItemClick` callback.
 */
export interface BreadcrumbsItemClickEventDetail {
  /** The original React synthetic event. */
  originalEvent: React.MouseEvent | React.KeyboardEvent;
  /** The item data that was clicked. */
  item: BreadcrumbsItemProps;
  /** Index of the item among all items. */
  index: number;
  /** Whether Alt key was pressed. */
  altKey: boolean;
  /** Whether Ctrl key was pressed. */
  ctrlKey: boolean;
  /** Whether Meta (Cmd) key was pressed. */
  metaKey: boolean;
  /** Whether Shift key was pressed. */
  shiftKey: boolean;
}

// ─── BreadcrumbsItem ─────────────────────────────────────────────────────────

export interface BreadcrumbsItemProps {
  /** Ref for imperative access */
  ref?: React.Ref<HTMLLIElement>;
  /** URL the breadcrumb navigates to. If absent, item is non-navigable text. */
  href?: string;
  /** Link target: `_self`, `_blank`, `_parent`, `_top`. */
  target?: "_self" | "_blank" | "_parent" | "_top" | string;
  /** Custom accessible name appended to the item text for screen readers. */
  accessibleName?: string;
  /** Text content of the breadcrumb item. */
  children?: ReactNode;
  /** Additional CSS class names. */
  className?: string;
  /** Inline styles. */
  style?: React.CSSProperties;
  /** Data attribute for testing. */
  "data-testid"?: string;
  /** @internal Injected by parent Breadcrumbs via cloneElement. */
  _index?: number;
}

// ─── Context ──────────────────────────────────────────────────────────────────

/**
 * Internal context provided by `Breadcrumbs` to each `BreadcrumbsItem`.
 */
export interface BreadcrumbsContextValue {
  /** Separator character between items. */
  separatorChar: string;
  /** Whether this is the Standard design. */
  isStandard: boolean;
  /** Total number of items. */
  totalCount: number;
  /** Number of visible items (after overflow). */
  visibleCount: number;
  /** Number of items hidden in overflow. */
  overflowSize: number;
  /** Link design for items. */
  linkDesign: LinkDesign | `${LinkDesign}`;
  /** Get roving tabindex for a given slot ID. */
  getTabIndex: (slotId: string) => 0 | -1;
  /** Handle link click from a BreadcrumbsItem. */
  onLinkClick: (
    e: React.MouseEvent<HTMLAnchorElement>,
    itemProps: BreadcrumbsItemProps,
    globalIndex: number,
  ) => void;
  /** Handle current-page click. */
  onCurrentPageClick: (
    e: React.MouseEvent | React.KeyboardEvent,
    itemProps: BreadcrumbsItemProps,
    globalIndex: number,
  ) => void;
  /** Register an item's DOM element ref for keyboard navigation. */
  registerItemRef: (globalIndex: number, element: HTMLElement | null) => void;
  /** Whether the trail ends with a non-link current-page label (Standard design, last item has no href). */
  hasCurrentPageLabel: boolean;
}

// ─── Breadcrumbs ─────────────────────────────────────────────────────────────

export interface BreadcrumbsProps {
  /** Ref for imperative access */
  ref?: React.Ref<BreadcrumbsRef>;
  // === Visual ===
  /** Design variant. */
  design?: BreadcrumbsDesign | `${BreadcrumbsDesign}`;
  /** Separator style between items. */
  separators?: BreadcrumbsSeparator | `${BreadcrumbsSeparator}`;
  /** Link design for breadcrumb items. Default is `LinkDesign.Default`. */
  linkDesign?: LinkDesign | `${LinkDesign}`;

  // === Overflow ===
  /**
   * When set, controls exactly how many items are overflowed (0 = none, 1 = first item, etc.).
   * This disables the automatic width-based overflow calculation.
   * Useful when the parent component needs deterministic control over overflow.
   */
  overflowCount?: number;

  // === Layout ===
  /**
   * When true, removes the default padding around the breadcrumb list.
   * Useful when embedding in tight layouts like headers.
   */
  noPadding?: boolean;

  // === Content ===
  /** `<BreadcrumbsItem>` children. */
  children?: ReactNode;

  // === Accessibility ===
  /** Accessible label for the `<nav>` landmark (default: "Breadcrumb Trail"). */
  accessibleName?: string;
  /** Accessible description for screen readers */
  accessibleDescription?: string;
  /** ID of element that describes the breadcrumbs */
  accessibleDescriptionRef?: string;

  // === Events ===
  /**
   * Fired when any breadcrumb item is clicked (link, label, or overflow item).
   * Call `event.originalEvent.preventDefault()` to prevent default navigation.
   */
  onItemClick?: (detail: BreadcrumbsItemClickEventDetail) => void;

  // === Standard HTML ===
  /** Additional CSS class names. */
  className?: string;
  /** Inline styles. */
  style?: React.CSSProperties;
  /** Element ID. */
  id?: string;
  /** Data attribute for testing. */
  "data-testid"?: string;
}

/**
 * Imperative ref handle for the Breadcrumbs component.
 */
export interface BreadcrumbsRef {
  /** Focus the breadcrumbs (first focusable item). */
  focus(): void;
  /** Access the root `<nav>` element. */
  readonly nativeElement: HTMLElement | null;
}
