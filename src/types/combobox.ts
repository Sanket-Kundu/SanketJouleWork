import React, { ReactNode } from "react";
import { ValueState } from "./value-state";

// Re-export ValueState from shared module for backwards compatibility
export { ValueState };

/**
 * ComboBox size variants
 */
export enum ComboBoxSize {
  /** Large combo box (Figma: Large — 40px height, 8px radius) */
  Large = "Large",
  /** Medium combo box (Figma: Medium — 32px height, 4px radius) */
  Medium = "Medium",
}

/**
 * ComboBox filter modes
 */
export enum ComboBoxFilter {
  /** Match at beginning of each word (default) */
  StartsWithPerTerm = "StartsWithPerTerm",
  /** Match at beginning of text only */
  StartsWith = "StartsWith",
  /** Match anywhere in text */
  Contains = "Contains",
  /** No filtering - for lazy loading */
  None = "None",
}

/**
 * ComboBox item data structure
 */
export interface ComboBoxItemData {
  /** Main display text */
  text: string;
  /** Optional secondary text column */
  additionalText?: string;
  /** Value for form submission (defaults to text) */
  value?: string;
  /** Icon name from lucide-react */
  icon?: string;
  /** Whether item is disabled */
  disabled?: boolean;
}

/**
 * ComboBox item group data structure
 */
export interface ComboBoxItemGroupData {
  /** Group header text */
  headerText: string;
  /** Items in this group */
  items: ComboBoxItemData[];
}

/**
 * ComboBox selection change event detail
 */
export interface ComboBoxSelectionChangeDetail {
  /** The selected item, or null if cleared */
  item: ComboBoxItemData | null;
  /** The selected value */
  value: string;
}

/**
 * Props for ComboBoxItem component
 */
export interface ComboBoxItemProps {
  /** Main display text (or use children) */
  text?: string;
  /** Secondary text column */
  additionalText?: string;
  /** Value for selection (defaults to text) */
  value?: string;
  /** Icon name from lucide-react */
  icon?: string;
  /** Whether item is disabled */
  disabled?: boolean;
  /** Whether item is currently selected */
  selected?: boolean;
  /** Whether item is currently focused */
  focused?: boolean;
  /** Whether item is visible (after filtering) */
  isVisible?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Children as text content */
  children?: ReactNode;
  /** Additional class names */
  className?: string;
}

/**
 * Props for ComboBoxItemGroup component
 */
export interface ComboBoxItemGroupProps {
  /** Group header text */
  headerText: string;
  /** Whether the group is visible (any children visible) */
  isVisible?: boolean;
  /** Group items */
  children: ReactNode;
  /** Additional class names */
  className?: string;
}

/**
 * Accessibility attributes for ComboBox
 */
export interface ComboBoxAccessibilityAttributes {
  /** ID of element this combo box controls */
  controls?: string;
}

/**
 * Props for the main ComboBox component
 */
export interface ComboBoxProps {
  /** Ref for imperative access */
  ref?: React.Ref<HTMLDivElement>;
  /** Size variant (default: Large / 40px) */
  size?: ComboBoxSize | `${ComboBoxSize}`;
  /** Current value */
  value?: string;
  /** Default value (uncontrolled) */
  defaultValue?: string;
  /** Selected item's value property (unique identifier, controlled) */
  selectedValue?: string;
  /** Default selected value (uncontrolled) */
  defaultSelectedValue?: string;
  /** Input placeholder text */
  placeholder?: string;
  /** Whether the combobox is disabled */
  disabled?: boolean;
  /** Whether the combobox is read-only */
  readonly?: boolean;
  /** Whether the field is required */
  required?: boolean;
  /** Form field name */
  name?: string;
  /** Filter mode for suggestions */
  filter?: ComboBoxFilter | `${ComboBoxFilter}`;
  /** Disable typeahead/autocomplete */
  noTypeahead?: boolean;
  /** Value state for validation */
  valueState?: ValueState | `${ValueState}`;
  /** Custom value state message */
  valueStateMessage?: ReactNode;
  /** Show clear icon when value exists */
  showClearIcon?: boolean;
  /** Show loading indicator */
  loading?: boolean;
  /** Whether the dropdown is open (controlled) */
  open?: boolean;
  /** Default open state (uncontrolled) */
  defaultOpen?: boolean;
  /** Accessible name */
  accessibleName?: string;
  /** ID of element that labels this combobox */
  accessibleNameRef?: string;
  /** Accessible description for screen readers */
  accessibleDescription?: string;
  /** ID of element that describes this combo box */
  accessibleDescriptionRef?: string;
  /** Called when value changes (typing) */
  onInput?: (value: string) => void;
  /** Called when selection is committed */
  onChange?: (value: string) => void;
  /** Called when selection changes */
  onSelectionChange?: (detail: ComboBoxSelectionChangeDetail) => void;
  /** Called when dropdown opens */
  onOpen?: () => void;
  /** Called when dropdown closes */
  onClose?: () => void;
  /** Items (as children) */
  children?: ReactNode;
  /** Additional class names */
  className?: string;
  /** Icon slot content */
  icon?: ReactNode;
  /** Accessibility attributes */
  accessibilityAttributes?: ComboBoxAccessibilityAttributes;
  /** Forwarded to the rendered combobox root element for test selectors. */
  "data-testid"?: string;
}

/**
 * Props for ComboBoxPopover component
 */
export interface ComboBoxPopoverProps {
  /** Whether popover is open */
  open: boolean;
  /** Reference to the trigger element */
  triggerRef: React.RefObject<HTMLElement | null>;
  /** Value state for styling */
  valueState?: ValueState | `${ValueState}`;
  /** Value state message content */
  valueStateMessage?: ReactNode;
  /** Loading indicator */
  loading?: boolean;
  /** Mobile dialog title */
  mobileTitle?: string;
  /** Called before the popover closes */
  onBeforeClose?: (detail: { escPressed: boolean }) => boolean | void;
  /** Called when popover should close */
  onClose: () => void;
  /** Children (the items list) */
  children: ReactNode;
  /** Additional class names */
  className?: string;
}
