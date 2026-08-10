import React, { ReactNode } from "react";

/**
 * Select size variants
 */
export enum SelectSize {
  /** Large select (Figma: Large — 40px height, 8px radius) */
  Large = "Large",
  /** Medium select (Figma: Medium — 32px height, 4px radius) */
  Medium = "Medium",
}

/**
 * Text separator for readonly two-column display
 */
export enum TextSeparator {
  /** Dash separator (–) */
  Dash = "Dash",
  /** Bullet separator (·) */
  Bullet = "Bullet",
  /** Vertical line separator (|) */
  VerticalLine = "VerticalLine",
}

/**
 * Value state for validation feedback
 */
export { ValueState } from "./value-state";

/**
 * Option data structure
 */
export interface OptionData {
  /** Form submission value */
  value?: string;
  /** Display text (from children or displayText) */
  text: string;
  /** Secondary text column */
  additionalText?: string;
  /** Icon name */
  icon?: string;
  /** Tooltip text */
  tooltip?: string;
  /** Whether option is disabled */
  disabled?: boolean;
}

/**
 * Props for Option component
 */
export interface OptionProps {
  /** Ref for imperative access */
  ref?: React.Ref<HTMLLIElement>;
  /** Form submission value */
  value?: string;
  /** Icon name from lucide-react */
  icon?: string;
  /** Secondary text column */
  additionalText?: string;
  /** Tooltip on hover */
  tooltip?: string;
  /** Whether this option is selected */
  selected?: boolean;
  /** Whether this option is disabled */
  disabled?: boolean;
  /** Whether this option is focused */
  focused?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Children as text content */
  children?: ReactNode;
  /** Additional class names */
  className?: string;
}

/**
 * Props for OptionCustom component
 */
export interface OptionCustomProps {
  /** Ref for imperative access */
  ref?: React.Ref<HTMLLIElement>;
  /** Text shown in Select when this option is selected */
  displayText?: string;
  /** Form submission value */
  value?: string;
  /** Tooltip on hover */
  tooltip?: string;
  /** Whether this option is selected */
  selected?: boolean;
  /** Whether this option is disabled */
  disabled?: boolean;
  /** Whether this option is focused */
  focused?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Custom content */
  children?: ReactNode;
  /** Additional class names */
  className?: string;
}

/**
 * Select change event detail
 */
export interface SelectChangeDetail {
  /** The selected option */
  selectedOption: OptionData | null;
}

/**
 * Accessibility attributes for Select
 */
export interface SelectAccessibilityAttributes {
  /** ID of element this select controls */
  controls?: string;
}

/**
 * Props for the main Select component
 */
export interface SelectProps {
  /** Ref for imperative access */
  ref?: React.Ref<HTMLDivElement>;
  /** Size variant (default: Large / 40px) */
  size?: SelectSize | `${SelectSize}`;
  /** Selected option's value */
  value?: string;
  /** Default value (uncontrolled) */
  defaultValue?: string;
  /** Whether the select is disabled */
  disabled?: boolean;
  /** Whether the select is read-only */
  readonly?: boolean;
  /** Whether the field is required */
  required?: boolean;
  /** Form field name */
  name?: string;
  /** Value state for validation */
  valueState?: import("./value-state").ValueState | `${import("./value-state").ValueState}`;
  /** Custom value state message */
  valueStateMessage?: ReactNode;
  /** Icon for icon-only mode */
  icon?: ReactNode;
  /** Tooltip text */
  tooltip?: string;
  /** Text separator for readonly mode */
  textSeparator?: TextSeparator | `${TextSeparator}`;
  /** Accessible name */
  accessibleName?: string;
  /** ID of element that labels this select */
  accessibleNameRef?: string;
  /** Accessible description */
  accessibleDescription?: string;
  /** ID of element that describes this select */
  accessibleDescriptionRef?: string;
  /** Whether the dropdown is open (controlled) */
  open?: boolean;
  /** Default open state (uncontrolled) */
  defaultOpen?: boolean;
  /** Called when selection changes (final) */
  onChange?: (detail: SelectChangeDetail) => void;
  /** Called when selection changes during navigation */
  onLiveChange?: (detail: SelectChangeDetail) => void;
  /** Called when dropdown opens */
  onOpen?: () => void;
  /** Called when dropdown closes */
  onClose?: () => void;
  /** Options (as children) */
  children?: ReactNode;
  /** Additional class names */
  className?: string;
  /** Label slot content */
  label?: ReactNode;
  /** Accessibility attributes */
  accessibilityAttributes?: SelectAccessibilityAttributes;
  /** Forwarded to the rendered Select trigger element for test selectors. */
  "data-testid"?: string;
}

/**
 * Props for SelectPopover component
 */
export interface SelectPopoverProps {
  /** Whether popover is open */
  open: boolean;
  /** Reference to the trigger element */
  triggerRef: React.RefObject<HTMLElement | null>;
  /** Value state for styling */
  valueState?: import("./value-state").ValueState | `${import("./value-state").ValueState}`;
  /** Value state message content */
  valueStateMessage?: ReactNode;
  /** Whether a value state message will be portaled into this popover */
  hasValueState?: boolean;
  /** Ref callback for the portal target div where the value state message will be rendered */
  valueStatePortalRef?: React.RefCallback<HTMLDivElement>;
  /** Mobile dialog title */
  mobileTitle?: string;
  /** Called before the popover closes */
  onBeforeClose?: (detail: { escPressed: boolean }) => boolean | void;
  /** Called when popover should close */
  onClose: () => void;
  /** Children (the options list) */
  children: ReactNode;
  /** Additional class names */
  className?: string;
}
