import React from "react";
import { ButtonDesign, ButtonSize } from "./button";

/**
 * ToggleButton props interface
 */
export interface ToggleButtonProps {
  /** Ref for imperative access */
  ref?: React.Ref<ToggleButtonRef>;
  /** Whether the button is pressed/toggled */
  pressed?: boolean;
  /** Design variant of the button */
  design?: ButtonDesign | `${ButtonDesign}`;
  /** Button size */
  size?: ButtonSize | `${ButtonSize}`;
  /** Icon to display */
  icon?: React.ReactNode;
  /** End icon (right side) */
  endIcon?: React.ReactNode;
  /** Button text content */
  children?: React.ReactNode;
  /** Disabled state */
  disabled?: boolean;
  /** Icon-only mode (no text) */
  iconOnly?: boolean;
  /** Tooltip text */
  tooltip?: string;
  /** Accessible name */
  accessibleName?: string;
  /** Change handler when toggle state changes */
  onChange?: (event: { pressed: boolean }) => void;
  /** Click handler */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Tab index override */
  tabIndex?: number;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Forwarded to the root <button> element for test selectors. */
  "data-testid"?: string;
}

/**
 * ToggleButton ref interface
 */
export interface ToggleButtonRef {
  /** Focus the button */
  focus: () => void;
  /** Check if focused */
  isFocused: () => boolean;
  /** Access native DOM element */
  readonly nativeElement: HTMLButtonElement | null;
  /** @deprecated Use nativeElement instead */
  getNativeElement: () => HTMLButtonElement | null;
}
