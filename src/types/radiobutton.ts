import React, { ReactNode } from "react";

/**
 * Wrapping type for RadioButton text
 */
export enum RadioButtonWrappingType {
  /** Text will not wrap, may be truncated */
  None = "None",
  /** Text will wrap to multiple lines */
  Normal = "Normal",
}

/**
 * Size variants for RadioButton
 */
export enum RadioButtonSize {
  /** Compact size for nested use cases */
  Small = "Small",
  /** Default size for main canvas */
  Large = "Large",
}

/**
 * Value state for RadioButton
 */
export enum RadioButtonValueState {
  None = "None",
  Positive = "Positive",
  Critical = "Critical",
  Negative = "Negative",
  Information = "Information",
}

/**
 * Event detail for RadioButton change event
 */
export interface RadioButtonChangeEventDetail {
  /** Whether the radio button is checked */
  checked: boolean;
  /** The value of the radio button */
  value: string;
  /** The original event */
  originalEvent: React.SyntheticEvent;
}

/**
 * Ref methods exposed by RadioButton
 */
export interface RadioButtonRef {
  /** Focus the radio button */
  focus(): void;
  /** Blur the radio button */
  blur(): void;
  /** Check if the radio button is focused */
  isFocused(): boolean;
  /** Check if the radio button is checked */
  isChecked(): boolean;
  /** Get the native input element */
  readonly nativeElement: HTMLInputElement | null;
}

/**
 * Props for the RadioButton component
 */
export interface RadioButtonProps {
  /** Ref for imperative access */
  ref?: React.Ref<RadioButtonRef>;

  /**
   * Whether the radio button is checked.
   * Use for controlled component.
   */
  checked?: boolean;

  /**
   * Default checked state for uncontrolled component.
   * @default false
   */
  defaultChecked?: boolean;

  /**
   * Whether the radio button is disabled.
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether the radio button is readonly.
   * @default false
   */
  readonly?: boolean;

  /**
   * Whether the radio button is required.
   * @default false
   */
  required?: boolean;

  /**
   * The size of the radio button.
   * @default "Large"
   */
  size?: RadioButtonSize | `${RadioButtonSize}`;

  /**
   * The text label for the radio button.
   */
  text?: string;

  /**
   * Alternative to text prop - children content.
   */
  children?: ReactNode;

  /**
   * The value state of the radio button.
   * @default "None"
   */
  valueState?: RadioButtonValueState | `${RadioButtonValueState}`;

  /**
   * Message to display for the value state.
   */
  valueStateMessage?: string;

  /**
   * The name attribute for grouping radio buttons.
   */
  name?: string;

  /**
   * The form value of the radio button.
   * @default ""
   */
  value?: string;

  /**
   * Controls how the text wraps.
   * @default "Normal"
   */
  wrappingType?: RadioButtonWrappingType | `${RadioButtonWrappingType}`;

  /**
   * Accessible name for screen readers.
   */
  accessibleName?: string;

  /**
   * ID of element that labels this radio button.
   */
  accessibleNameRef?: string;

  /**
   * Accessible description for screen readers.
   */
  accessibleDescription?: string;

  /**
   * ID of element that describes this radio button.
   */
  accessibleDescriptionRef?: string;

  /**
   * Called when the radio button state changes.
   */
  onChange?: (detail: RadioButtonChangeEventDetail) => void;

  /**
   * Called when the radio button receives focus.
   */
  onFocus?: (e: React.FocusEvent<HTMLElement>) => void;

  /**
   * Called when the radio button loses focus.
   */
  onBlur?: (e: React.FocusEvent<HTMLElement>) => void;

  /**
   * Additional CSS class names.
   */
  className?: string;

  /**
   * Inline styles.
   */
  style?: React.CSSProperties;

  /**
   * The id attribute.
   */
  id?: string;

  /**
   * Test ID for testing purposes.
   */
  "data-testid"?: string;

  /**
   * Tab index for keyboard navigation.
   */
  tabIndex?: number;
}
