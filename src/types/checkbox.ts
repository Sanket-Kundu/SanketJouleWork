import React, { ReactNode } from "react";

/**
 * Wrapping type for checkbox label text
 */
export enum WrappingType {
  /** No wrapping - text truncates */
  None = "None",
  /** Normal text wrapping */
  Normal = "Normal",
}

/**
 * CheckBox size variants (mirrors ButtonSize)
 */
export enum CheckBoxSize {
  /** Large checkbox (Figma: Cozy, 44px touch area) */
  Large = "Large",
  /** Small checkbox (Figma: Compact, 32px touch area) */
  Small = "Small",
}

/**
 * Event detail for checkbox change events
 */
export interface CheckBoxChangeEventDetail {
  /** Whether the checkbox is now checked */
  checked: boolean;
  /** Whether the checkbox is in indeterminate state */
  indeterminate: boolean;
  /** Original event */
  originalEvent: React.SyntheticEvent;
}

/**
 * CheckBox ref methods for imperative control
 */
export interface CheckBoxRef {
  /** Focus the checkbox */
  focus(): void;
  /** Blur the checkbox */
  blur(): void;
  /** Check if checkbox is focused */
  isFocused(): boolean;
  /** Get current checked state */
  isChecked(): boolean;
  /** Toggle checked state */
  toggle(): void;
  /** Access native input element */
  readonly nativeElement: HTMLInputElement | null;
}

/**
 * Accessibility attributes for CheckBox
 */
export interface CheckBoxAccessibilityAttributes {
  /** ID of element that describes this checkbox */
  describedBy?: string;
}

/**
 * Props for the CheckBox component
 */
export interface CheckBoxProps {
  /** Ref for imperative access */
  ref?: React.Ref<CheckBoxRef>;
  // === State ===
  /** Whether the checkbox is checked (controlled) */
  checked?: boolean;
  /** Default checked state (uncontrolled) */
  defaultChecked?: boolean;
  /** Whether to display indeterminate/partial state */
  indeterminate?: boolean;

  // === Behavior ===
  /** Whether the checkbox is disabled */
  disabled?: boolean;
  /** Whether the checkbox is read-only */
  readonly?: boolean;
  /** Whether the checkbox is display-only (not focusable) */
  displayOnly?: boolean;
  /** Whether the field is required */
  required?: boolean;
  /** Size variant: Large (44px, default) or Small (32px) */
  size?: CheckBoxSize | `${CheckBoxSize}`;

  // === Content ===
  /** Label text for the checkbox */
  text?: string;
  /** Label content (alternative to text prop) */
  children?: ReactNode;
  /** Text wrapping behavior */
  wrappingType?: WrappingType | `${WrappingType}`;

  // === Validation ===
  /** Value state for validation feedback */
  valueState?: "None" | "Positive" | "Negative" | "Critical" | "Information";
  /** Custom value state message */
  valueStateMessage?: ReactNode;

  // === Form Integration ===
  /** Form field name */
  name?: string;
  /** Value submitted when checked (default: "on") */
  value?: string;

  // === Accessibility ===
  /** Accessible name (aria-label) */
  accessibleName?: string;
  /** ID of labelling element (aria-labelledby) */
  accessibleNameRef?: string;
  /** Accessible description */
  accessibleDescription?: string;

  // === Events ===
  /** Called when checked state changes */
  onChange?: (detail: CheckBoxChangeEventDetail) => void;
  /** Called when checkbox receives focus */
  onFocus?: (e: React.FocusEvent<HTMLDivElement>) => void;
  /** Called when checkbox loses focus */
  onBlur?: (e: React.FocusEvent<HTMLDivElement>) => void;

  // === Standard HTML ===
  /** Additional class names */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Checkbox ID */
  id?: string;
  /** Data attributes for testing */
  "data-testid"?: string;
  /** Tab index for keyboard navigation */
  tabIndex?: number;
  /** Accessibility attributes */
  accessibilityAttributes?: CheckBoxAccessibilityAttributes;
}
