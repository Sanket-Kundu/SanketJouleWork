import React, { ReactNode } from "react";

/**
 * Bar design variants
 */
export enum BarDesign {
  /** Header bar (default) */
  Header = "Header",
  /** Subheader bar */
  Subheader = "Subheader",
  /** Footer bar */
  Footer = "Footer",
  /** Floating footer with border-radius and shadow */
  FloatingFooter = "FloatingFooter",
}

/**
 * Bar accessible role options
 */
export enum BarAccessibleRole {
  /** ARIA toolbar role — use when bar contains 2+ interactive elements */
  Toolbar = "Toolbar",
  /** No ARIA role — use when bar has 0-1 interactive elements */
  None = "None",
}

/**
 * Bar ref methods for imperative control
 */
export interface BarRef {
  /** Focus the bar root element */
  focus(): void;
  /** Blur the bar root element */
  blur(): void;
  /** Check if bar is focused */
  isFocused(): boolean;
  /** Access native bar element */
  readonly nativeElement: HTMLDivElement | null;
}

/**
 * Props for the Bar component
 */
export interface BarProps {
  /** Ref for imperative access */
  ref?: React.Ref<BarRef>;
  // === Design ===
  /** Bar design variant */
  design?: BarDesign | `${BarDesign}`;

  // === Content ===
  /** Content rendered at the start (left in LTR) of the bar */
  startContent?: ReactNode;
  /** Content rendered in the middle of the bar (centered between start and end) */
  children?: ReactNode;
  /** Content rendered at the end (right in LTR) of the bar */
  endContent?: ReactNode;

  // === Accessibility ===
  /**
   * ARIA role for the bar.
   * Use "Toolbar" when bar contains 2+ interactive elements.
   * Use "None" when bar has 0-1 interactive elements.
   */
  accessibleRole?: BarAccessibleRole | `${BarAccessibleRole}`;
  /** Accessible name (aria-label) */
  accessibleName?: string;
  /** ID of labelling element (aria-labelledby) */
  accessibleNameRef?: string;

  // === Standard HTML ===
  /** Additional class names */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Bar ID */
  id?: string;
  /** Data attributes for testing */
  "data-testid"?: string;
}
