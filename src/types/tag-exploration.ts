import React, { ReactNode } from "react";

/**
 * TagExploration design variants (semantic color or set-based)
 */
export enum TagExplorationDesign {
  /** Neutral/default appearance */
  Neutral = "Neutral",
  /** Informational tag */
  Information = "Information",
  /** Positive/success tag */
  Positive = "Positive",
  /** Negative/error tag */
  Negative = "Negative",
  /** Critical/warning tag */
  Critical = "Critical",
  /** Set 1 — bold color scheme (uses colorScheme prop) */
  Set1 = "Set1",
  /** Set 2 — tinted color scheme (uses colorScheme prop) */
  Set2 = "Set2",
}

/**
 * TagExploration size variants
 */
export enum TagExplorationSize {
  /** Small size — pill shape */
  S = "S",
  /** Large size — pill shape */
  L = "L",
}

/**
 * TagExploration text wrapping behavior
 */
export enum TagExplorationWrappingType {
  /** No wrapping — truncate with ellipsis */
  None = "None",
  /** Normal wrapping without hyphenation */
  Normal = "Normal",
}

/**
 * Color scheme for Set1/Set2 designs
 */
export enum TagExplorationColorScheme {
  CS1 = "1",
  CS2 = "2",
  CS3 = "3",
  CS4 = "4",
  CS5 = "5",
  CS6 = "6",
  CS7 = "7",
  CS8 = "8",
  CS9 = "9",
  CS10 = "10",
}

/**
 * Event detail for tag click events
 */
export interface TagExplorationClickEventDetail {
  /** Original mouse or keyboard event */
  originalEvent: React.MouseEvent<HTMLSpanElement> | React.KeyboardEvent<HTMLSpanElement>;
  /** Whether activation was via keyboard */
  isKeyboard: boolean;
}

/**
 * Event detail for tag close events
 */
export interface TagExplorationCloseEventDetail {
  /** Original mouse or keyboard event */
  originalEvent: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>;
  /** Whether activation was via keyboard */
  isKeyboard: boolean;
}

/**
 * TagExploration ref methods for imperative control
 */
export interface TagExplorationRef {
  /** Focus the tag */
  focus(): void;
  /** Blur the tag */
  blur(): void;
  /** Check if tag is focused */
  isFocused(): boolean;
  /** Access native tag element */
  readonly nativeElement: HTMLSpanElement | null;
}

/**
 * Props for the TagExploration component
 */
export interface TagExplorationProps {
  /** Ref for imperative access */
  ref?: React.Ref<TagExplorationRef>;
  // === Visual ===
  /** Tag design variant (semantic color or set-based) */
  design?: TagExplorationDesign | `${TagExplorationDesign}`;
  /** Tag size */
  size?: TagExplorationSize | `${TagExplorationSize}`;
  /** Color scheme (1-10) for Set1/Set2 designs */
  colorScheme?: TagExplorationColorScheme | `${TagExplorationColorScheme}`;

  // === Content ===
  /** Tag text content */
  children?: ReactNode;
  /** Icon element to display before text */
  icon?: ReactNode;

  // === Behavior ===
  /** Makes the tag interactive (focusable and clickable) */
  interactive?: boolean;
  /** Renders the tag in read-only mode (reduced opacity, no close button) */
  readOnly?: boolean;
  /** Uses accent (purple) background for Neutral design only; ignored for other designs */
  accent?: boolean;
  /** Text wrapping behavior */
  wrappingType?: TagExplorationWrappingType | `${TagExplorationWrappingType}`;
  /** Hide the default state indicator icon */
  hideStateIcon?: boolean;

  // === Events ===
  /** Called when close button is clicked. Presence of this prop renders the close button. */
  onClose?: (detail: TagExplorationCloseEventDetail) => void;
  /** Called when tag is clicked (only when interactive is true) */
  onClick?: (detail: TagExplorationClickEventDetail) => void;

  // === Accessibility ===
  /** Accessible name (aria-label) */
  accessibleName?: string;
  /** ID of labelling element (aria-labelledby) */
  accessibleNameRef?: string;

  // === Standard HTML ===
  /** Additional class names */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Tag ID */
  id?: string;
  /** Data attributes for testing */
  "data-testid"?: string;
}
