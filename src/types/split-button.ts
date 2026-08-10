import React, { ReactNode, CSSProperties } from "react";
import { ButtonDesign } from "./button";

/**
 * Accessibility attributes for the SplitButton root (group) element.
 */
export interface SplitButtonRootAccessibilityAttributes {
  /** Indicates the presence and type of popup triggered by the button. */
  hasPopup?: "dialog" | "grid" | "listbox" | "menu" | "tree";
  /** Human-readable description for the role. */
  roleDescription?: string;
  /** Tooltip or description for screen readers. */
  title?: string;
  /** Keyboard shortcuts that activate or give focus to the button. */
  ariaKeyShortcuts?: string;
}

/**
 * Accessibility attributes for the SplitButton arrow button.
 */
export interface SplitButtonArrowAccessibilityAttributes {
  /** Indicates the presence and type of popup triggered by the arrow button. */
  hasPopup?: "dialog" | "grid" | "listbox" | "menu" | "tree";
  /** Whether the popup triggered by the arrow button is currently expanded. */
  expanded?: boolean;
  /** Tooltip for the arrow button. */
  title?: string;
}

/**
 * Combined accessibility attributes for SplitButton.
 * @public
 */
export interface SplitButtonAccessibilityAttributes {
  /** Attributes applied to the root group element. */
  root?: SplitButtonRootAccessibilityAttributes;
  /** Attributes applied to the arrow button. */
  arrowButton?: SplitButtonArrowAccessibilityAttributes;
}

/**
 * SplitButton props interface.
 * @public
 */
export interface SplitButtonProps {
  /** Ref for imperative access */
  ref?: React.Ref<SplitButtonRef>;
  // ── Content ────────────────────────────────────────────────────────────

  /** Main button text. */
  text?: string;
  /** Icon element displayed at the start of the main button. */
  icon?: ReactNode;
  /** Icon element displayed at the end of the main button (before the arrow). */
  endIcon?: ReactNode;

  // ── Design ─────────────────────────────────────────────────────────────

  /** Design variant. @default "Default" */
  design?: ButtonDesign | `${ButtonDesign}`;
  /** Size variant. @default "Large" */
  size?: "Large" | "Medium" | "Small";
  /** Whether the component is disabled. @default false */
  disabled?: boolean;
  /** Whether the component is in loading state. @default false */
  loading?: boolean;

  // ── Arrow state ────────────────────────────────────────────────────────

  /**
   * Externally controlled active state for the arrow button.
   * When true, the arrow button shows its active/pressed visual.
   * @default false
   */
  activeArrowButton?: boolean;

  // ── Accessibility ──────────────────────────────────────────────────────

  /** Accessible name for the component (aria-label on the group). */
  accessibleName?: string;
  /** Accessibility attributes for the root and arrow button. */
  accessibilityAttributes?: SplitButtonAccessibilityAttributes;

  // ── Events ─────────────────────────────────────────────────────────────

  /** Fired when the user activates the default (text) action. */
  onClick?: () => void;
  /** Fired when the user activates the arrow action. */
  onArrowClick?: () => void;

  // ── Standard HTML ──────────────────────────────────────────────────────

  /** Additional CSS classes on the root element. */
  className?: string;
  /** Inline styles on the root element. */
  style?: CSSProperties;
  /** Element ID. */
  id?: string;
  /**
   * Forwarded to the root element for test selectors.
   * The arrow button auto-derives `${dataTestId}-arrow`.
   */
  "data-testid"?: string;
}

/**
 * SplitButton ref interface.
 * @public
 */
export interface SplitButtonRef {
  /** Focus the component (focuses the container group). */
  focus(): void;
  /** The root DOM element. */
  readonly nativeElement: HTMLDivElement | null;
  /** The text button DOM element. */
  readonly textButton: HTMLButtonElement | null;
  /** The arrow button DOM element. */
  readonly arrowButton: HTMLButtonElement | null;
}
