import React, { ReactNode } from "react";

/**
 * Badge visual variant
 *
 * Filled:  Colored background, bold colored text, no border, no icon
 * Minimal: Transparent bg, gray border, colored dot icon, neutral text
 * Outline: Transparent bg, colored border, colored dot icon, neutral text
 */
export enum BadgeVariant {
  /** Colored background, bold colored text (Status tag style) */
  Filled = "Filled",
  /** Gray border, colored dot, neutral text (Status-Minimal style) */
  Minimal = "Minimal",
  /** Colored border, colored dot, neutral text */
  Outline = "Outline",
  /** Colored border + colored bg tint + colored dot + colored text */
  Tinted = "Tinted",
}

/**
 * Badge design variants (semantic color)
 */
export enum BadgeDesign {
  /** Neutral/default appearance */
  Neutral = "Neutral",
  /** Informational badge */
  Information = "Information",
  /** Positive/success badge */
  Positive = "Positive",
  /** Negative/error badge */
  Negative = "Negative",
  /** Critical/warning badge */
  Critical = "Critical",
}

/**
 * Badge size variants
 */
export enum BadgeSize {
  /** Small size */
  S = "S",
  /** Large size */
  L = "L",
}

/**
 * Badge text wrapping behavior
 */
export enum BadgeWrappingType {
  /** No wrapping - truncate with ellipsis */
  None = "None",
  /** Normal wrapping without hyphenation */
  Normal = "Normal",
}

/**
 * Event detail for badge click events
 */
export interface BadgeClickEventDetail {
  /** Original mouse or keyboard event */
  originalEvent: React.MouseEvent<HTMLSpanElement> | React.KeyboardEvent<HTMLSpanElement>;
  /** Whether activation was via keyboard */
  isKeyboard: boolean;
}

/**
 * Badge ref methods for imperative control
 */
export interface BadgeRef {
  /** Focus the badge (when interactive) */
  focus(): void;
  /** Blur the badge */
  blur(): void;
  /** Check if badge is focused */
  isFocused(): boolean;
  /** Access native badge element */
  readonly nativeElement: HTMLSpanElement | null;
}

/**
 * Props for the Badge component
 */
export interface BadgeProps {
  /** Ref for imperative access */
  ref?: React.Ref<BadgeRef>;
  // === Visual ===
  /** Badge visual variant (Filled, Minimal, Outline) */
  variant?: BadgeVariant | `${BadgeVariant}`;
  /** Badge design variant (semantic color) */
  design?: BadgeDesign | `${BadgeDesign}`;
  /** Badge size */
  size?: BadgeSize | `${BadgeSize}`;
  /** Show colored border on Tinted variant. Defaults to true. */
  showBorder?: boolean;

  // === Content ===
  /** Badge text content */
  children?: ReactNode;
  /** Icon element to display */
  icon?: ReactNode;

  // === Behavior ===
  /** Makes the badge interactive (focusable and clickable) */
  interactive?: boolean;
  /** Text wrapping behavior */
  wrappingType?: BadgeWrappingType | `${BadgeWrappingType}`;
  /** Hide the default state indicator icon */
  hideStateIcon?: boolean;

  // === Accessibility ===
  /** Accessible name (aria-label) */
  accessibleName?: string;
  /** ID of labelling element (aria-labelledby) */
  accessibleNameRef?: string;
  /** Accessible description for screen readers */
  accessibleDescription?: string;
  /** ID of element that describes this badge */
  accessibleDescriptionRef?: string;

  // === Events ===
  /** Called when badge is clicked (only when interactive is true) */
  onClick?: (detail: BadgeClickEventDetail) => void;

  // === Standard HTML ===
  /** Additional class names */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Badge ID */
  id?: string;
  /** Data attributes for testing */
  "data-testid"?: string;
}
