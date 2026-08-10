import React, { ReactNode } from "react";

/**
 * Wrapping type for Label text
 */
export enum LabelWrappingType {
  /** Text will not wrap, may be truncated */
  None = "None",
  /** Text will wrap to multiple lines */
  Normal = "Normal",
}

/**
 * Props for the Label component
 */
export interface LabelProps {
  /** Ref for imperative access */
  ref?: React.Ref<HTMLLabelElement>;

  /** ID for the label element (useful for aria-labelledby references) */
  id?: string;

  /**
   * The ID of the input element this label is associated with.
   * Creates an accessible connection between label and input.
   */
  for?: string;

  /**
   * Alias for `for` prop (htmlFor is the React convention)
   */
  htmlFor?: string;

  /**
   * Whether to display a colon after the label text.
   * Useful for form layouts.
   * @default false
   */
  showColon?: boolean;

  /**
   * Whether to display an asterisk (*) to indicate a required field.
   * @default false
   */
  required?: boolean;

  /**
   * Controls how the label text wraps when space is limited.
   * @default "Normal"
   */
  wrappingType?: LabelWrappingType | `${LabelWrappingType}`;

  /**
   * The label text content.
   */
  children?: ReactNode;

  /**
   * Alternative to children for setting label text.
   */
  text?: string;

  /**
   * Additional CSS class names.
   */
  className?: string;

  /**
   * Inline styles.
   */
  style?: React.CSSProperties;

  /**
   * Test ID for testing purposes.
   */
  "data-testid"?: string;
}
