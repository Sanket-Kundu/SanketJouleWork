import React, { ReactNode } from "react";

/**
 * Button visual design variants
 *
 * Primary (filled):    Primary (blue), PrimaryJoule (purple)
 * Secondary (outline): Secondary (blue), SecondaryJoule (purple)
 * Tertiary (ghost):    Tertiary (blue text), TertiaryJoule (purple text)
 * Neutral (ghost):     Neutral (dark text → blue on hover)
 */
export enum ButtonDesign {
  /** Filled blue/brand button (Figma: Primary, Joule=False) */
  Primary = "Primary",
  /** Filled purple/Joule AI button (Figma: Primary, Joule=True) */
  PrimaryJoule = "PrimaryJoule",
  /** Outline blue/brand button (Figma: Secondary, Joule=False) */
  Secondary = "Secondary",
  /** Outline purple/Joule AI button (Figma: Secondary, Joule=True) */
  SecondaryJoule = "SecondaryJoule",
  /** Ghost blue text button, no border (Figma: Tertiary, Joule=False) */
  Tertiary = "Tertiary",
  /** Ghost purple text button, no border (Figma: Tertiary, Joule=True) */
  TertiaryJoule = "TertiaryJoule",
  /** Ghost neutral button, no border, dark text → blue on hover (Figma: Color=Neutral, Type=Default) */
  Neutral = "Neutral",
  /** Outline neutral button, visible border, dark text (Figma: Color=Neutral, Type=Secondary) */
  SecondaryNeutral = "SecondaryNeutral",
  /** Ghost neutral button, no border, muted text (Figma: Color=Neutral, Type=Tertiary) */
  TertiaryNeutral = "TertiaryNeutral",
}

/**
 * Button size variants
 */
export enum ButtonSize {
  /** Large button (Figma: Large, 40px) */
  Large = "Large",
  /** Medium button (Figma: Medium, 32px) */
  Medium = "Medium",
  /** Small button (Figma: Small, 24px) — primarily for icon-only buttons */
  Small = "Small",
}

/**
 * Button type for form behavior
 */
export enum ButtonType {
  /** Standard button (default) */
  Button = "Button",
  /** Submit form button */
  Submit = "Submit",
  /** Reset form button */
  Reset = "Reset",
}

/**
 * Button accessible role
 */
export enum ButtonAccessibleRole {
  /** Button role (default) */
  Button = "Button",
  /** Link role for navigation-style buttons */
  Link = "Link",
}

/**
 * Accessibility attributes for button
 */
export interface ButtonAccessibilityAttributes {
  /** Whether the button controls an expanded element */
  expanded?: boolean;
  /** Type of popup the button controls */
  hasPopup?: "menu" | "listbox" | "tree" | "grid" | "dialog" | boolean;
  /** ID of the element the button controls */
  controls?: string;
  /** Whether the button is pressed (toggle button) */
  pressed?: boolean | "mixed";
}

/**
 * Event detail for button click events
 */
export interface ButtonClickEventDetail {
  /** Original mouse or keyboard event */
  originalEvent: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>;
  /** Whether activation was via keyboard */
  isKeyboard: boolean;
}

/**
 * Button ref methods for imperative control
 */
export interface ButtonRef {
  /** Focus the button */
  focus(): void;
  /** Blur the button */
  blur(): void;
  /** Check if button is focused */
  isFocused(): boolean;
  /** Access native button element */
  readonly nativeElement: HTMLButtonElement | null;
}

/**
 * Animation transition styles for multi-state buttons
 */
export type ButtonStateTransition =
  | "slide-up"      // Content slides up and fades (default)
  | "slide-down"    // Content slides down and fades
  | "slide-left"    // Content slides left and fades
  | "slide-right"   // Content slides right and fades
  | "fade"          // Simple fade in/out
  | "scale"         // Scale down/up with fade
  | "flip"          // 3D flip effect
  | "none";         // No animation

/**
 * Defines a button state for multi-state buttons
 */
export interface ButtonState {
  /** Unique name identifying this state */
  name: string;
  /** Text to display in this state */
  text?: string;
  /** Icon element to display at start */
  icon?: ReactNode;
  /** Icon element to display at end */
  endIcon?: ReactNode;
  /** Enable pulsing text animation (left-to-right color sweep) for processing states */
  pulsing?: boolean;
}

/**
 * Props for the Button component
 */
export interface ButtonProps {
  /** Ref for imperative access */
  ref?: React.Ref<ButtonRef>;
  // === Visual ===
  /** Button design variant */
  design?: ButtonDesign | `${ButtonDesign}`;
  /** Button size */
  size?: ButtonSize | `${ButtonSize}`;

  // === Behavior ===
  /** Form button type */
  type?: ButtonType | `${ButtonType}`;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Whether the button is in loading state */
  loading?: boolean;

  // === Icons ===
  /** Icon element to display at start */
  icon?: ReactNode;
  /** Icon element to display at end */
  endIcon?: ReactNode;
  /** Whether this is an icon-only button */
  iconOnly?: boolean;

  // === Content ===
  /** Button content */
  children?: ReactNode;
  /** Tooltip text */
  tooltip?: string;

  // === Multi-state (AI Button) ===
  /**
   * Available states for multi-state button mode.
   * When states are provided, the button switches between them with animation.
   */
  states?: ButtonState[];
  /**
   * Current state name. Must match one of the state names in `states`.
   * If not provided, defaults to the first state.
   */
  state?: string;
  /**
   * Animation transition style for state changes.
   * @default "slide-up"
   */
  stateTransition?: ButtonStateTransition;

  // === Accessibility ===
  /** Accessible name (aria-label) */
  accessibleName?: string;
  /** ID of labelling element (aria-labelledby) */
  accessibleNameRef?: string;
  /** Button accessible role */
  accessibleRole?: ButtonAccessibleRole | `${ButtonAccessibleRole}`;
  /** Accessibility attributes */
  accessibilityAttributes?: ButtonAccessibilityAttributes;

  // === Form Integration ===
  /** Form field name */
  name?: string;
  /** Button value for form submission */
  value?: string;
  /** ID of form this button belongs to */
  form?: string;

  // === Events ===
  /** Called when button is clicked */
  onClick?: (detail: ButtonClickEventDetail) => void;
  /** Called when button receives focus */
  onFocus?: (e: React.FocusEvent<HTMLButtonElement>) => void;
  /** Called when button loses focus */
  onBlur?: (e: React.FocusEvent<HTMLButtonElement>) => void;

  // === Standard HTML ===
  /** Additional class names */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Button ID */
  id?: string;
  /** Tab index for focus control */
  tabIndex?: number;
  /** Data attributes for testing */
  "data-testid"?: string;
  /** Data attribute for growing button identification */
  "data-growing-button"?: string;
}
