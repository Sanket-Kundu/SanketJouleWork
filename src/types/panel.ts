import React, { ReactNode } from "react";
import { TitleLevel } from "./title";

/**
 * Panel accessible ARIA role
 */
export enum PanelAccessibleRole {
  /** A section complementary to the main content */
  Complementary = "Complementary",
  /** A landmark region containing a form (default) */
  Form = "Form",
  /** A perceivable section of the page */
  Region = "Region",
}

/**
 * Visual design variant of the panel
 */
export enum PanelDesign {
  /** Primary — card background with border (default) */
  Primary = "Primary",
  /** Secondary — secondary background with border, tinted footer */
  Secondary = "Secondary",
  /** Child — transparent, borderless, compact header */
  Child = "Child",
}

/**
 * Event detail for panel toggle events
 */
export interface PanelToggleEventDetail {
  /** Whether the panel is now collapsed */
  collapsed: boolean;
}

/**
 * Panel ref methods for imperative control
 */
export interface PanelRef {
  /** Focus the panel header */
  focus(): void;
  /** Blur the panel header */
  blur(): void;
  /** Check if header is focused */
  isFocused(): boolean;
  /** Access native panel root element */
  readonly nativeElement: HTMLDivElement | null;
}

/**
 * Props for the Panel component
 */
export interface PanelProps {
  /** Ref for imperative access */
  ref?: React.Ref<PanelRef>;

  // === Visual ===

  /**
   * Visual design variant of the panel.
   * @default PanelDesign.Primary
   */
  design?: PanelDesign | `${PanelDesign}`;

  // === Content ===

  /** Panel content (default slot) — visible when expanded */
  children?: ReactNode;

  /**
   * Header text for the panel.
   * Overridden when `header` prop is provided.
   */
  headerText?: string;

  /**
   * Custom header content.
   * When provided, overrides `headerText`.
   */
  header?: ReactNode;

  /**
   * Subtitle text displayed below the header title.
   */
  subtitle?: string;

  /**
   * Content rendered at the right side of the header.
   */
  endSlot?: ReactNode;

  /**
   * Footer content displayed below the panel content when expanded.
   * Not rendered for Child variant.
   */
  footer?: ReactNode;

  // === Behavior ===

  /**
   * When true, the panel cannot be collapsed or expanded.
   * The toggle icon is hidden and the header is not interactive.
   * @default false
   */
  fixed?: boolean;

  /**
   * Controlled collapsed state.
   * When provided, the component is controlled — use `onToggle` to respond to changes.
   */
  collapsed?: boolean;

  /**
   * Initial collapsed state for uncontrolled usage.
   * Only used when the `collapsed` prop is not provided.
   * @default false
   */
  defaultCollapsed?: boolean;

  /**
   * Disables the slide animation when expanding or collapsing.
   * @default false
   */
  noAnimation?: boolean;

  /**
   * Removes padding from the content area.
   * Useful when the content provides its own padding (e.g. a List).
   * @default false
   */
  noPadding?: boolean;

  /**
   * Makes the header sticky at the top of its scrolling container.
   * @default false
   */
  stickyHeader?: boolean;

  // === Accessibility ===

  /**
   * ARIA role for the panel root element.
   * Maps to: "complementary", "form", or "region".
   * @default PanelAccessibleRole.Form
   */
  accessibleRole?: PanelAccessibleRole | `${PanelAccessibleRole}`;

  /**
   * Heading level for the header text.
   * Determines the semantic heading element (h1–h6).
   * @default TitleLevel.H2
   */
  headerLevel?: TitleLevel | `${TitleLevel}`;

  /**
   * Accessible name (aria-label) for the panel.
   */
  accessibleName?: string;

  // === Events ===

  /**
   * Fired when the panel is toggled by user interaction (click or keyboard).
   * Not fired on programmatic changes to the `collapsed` prop.
   */
  onToggle?: (detail: PanelToggleEventDetail) => void;

  // === Standard HTML ===

  /** Additional CSS classes for the root element */
  className?: string;

  /** Inline styles for the root element */
  style?: React.CSSProperties;

  /** Panel element ID */
  id?: string;

  /** Data attribute for testing */
  "data-testid"?: string;
}
