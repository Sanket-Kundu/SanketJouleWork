import React from "react";

/**
 * Design variant for Switch
 */
export enum SwitchDesign {
  Textual = "Textual",
  Graphical = "Graphical",
}

/**
 * Event detail for switch change events
 */
export interface SwitchChangeDetail {
  /** Whether the switch is checked */
  checked: boolean;
}

/**
 * Accessibility attributes for Switch
 */
export interface SwitchAccessibilityAttributes {
  /** ID of element that describes this switch */
  describedBy?: string;
}

/**
 * Props for the Switch component
 */
export interface SwitchProps {
  /** Ref for imperative access */
  ref?: React.Ref<HTMLButtonElement>;
  // === Value ===
  /** Whether the switch is checked (controlled mode) */
  checked?: boolean;
  /** Default checked state (uncontrolled mode) */
  defaultChecked?: boolean;

  // === Behavior ===
  /** Whether the switch is disabled */
  disabled?: boolean;
  /** Whether the field is required */
  required?: boolean;

  // === Design ===
  /** Design variant - Textual (solid color) or Graphical (icon representation) */
  design?: SwitchDesign | `${SwitchDesign}`;
  /** Text to display when checked (only for Textual design, recommended: ≤3 characters) */
  textOn?: string;
  /** Text to display when unchecked (only for Textual design, recommended: ≤3 characters) */
  textOff?: string;
  /** Custom icon to display when checked (only for Graphical design) */
  iconOn?: React.ReactNode;
  /** Custom icon to display when unchecked (only for Graphical design) */
  iconOff?: React.ReactNode;

  // === Accessibility ===
  /** Accessible name (aria-label) */
  accessibleName?: string;
  /** ID of labelling element (aria-labelledby) */
  accessibleNameRef?: string;
  /** Accessible description for screen readers */
  accessibleDescription?: string;
  /** ID of element that describes this switch */
  accessibleDescriptionRef?: string;
  /** Tooltip text */
  tooltip?: string;

  // === Form Integration ===
  /** Form field name */
  name?: string;
  /** Form value when checked */
  value?: string;
  /** Switch ID */
  id?: string;

  // === Events ===
  /** Called when switch state changes */
  onChange?: (detail: SwitchChangeDetail) => void;

  // === Standard HTML ===
  /** Additional class names */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Data attributes for testing/AI */
  "data-testid"?: string;
  /** Accessibility attributes */
  accessibilityAttributes?: SwitchAccessibilityAttributes;
}
