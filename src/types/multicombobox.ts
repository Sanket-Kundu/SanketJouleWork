import React, { ReactNode } from "react";
import { ComboBoxFilter, ComboBoxSize } from "./combobox";
import { ValueState } from "./value-state";

// Re-export for consumer convenience
export { ComboBoxFilter, ComboBoxSize, ValueState };

/**
 * MultiComboBox item data structure
 */
export interface MultiComboBoxItemData {
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
 * MultiComboBox selection change event detail
 */
export interface MultiComboBoxSelectionChangeDetail {
  /** All currently selected items after the change */
  items: MultiComboBoxItemData[];
  /** The specific item that was toggled */
  changedItem: MultiComboBoxItemData;
  /** Whether the changed item was selected (true) or deselected (false) */
  selected: boolean;
}

/**
 * Props for MultiComboBoxItem component
 */
export interface MultiComboBoxItemProps {
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
  /** Whether item is currently selected (controls checkbox) */
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
 * Props for MultiComboBoxItemGroup component
 */
export interface MultiComboBoxItemGroupProps {
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
 * Accessibility attributes for MultiComboBox
 */
export interface MultiComboBoxAccessibilityAttributes {
  /** ID of element this combo box controls */
  controls?: string;
}

/**
 * Props for the main MultiComboBox component
 */
export interface MultiComboBoxProps {
  /** Ref for imperative access */
  ref?: React.Ref<HTMLDivElement>;
  /** Size variant (default: Large / 40px) */
  size?: ComboBoxSize | `${ComboBoxSize}`;
  /** Current input value (controlled) */
  value?: string;
  /** Default input value (uncontrolled) */
  defaultValue?: string;
  /** Array of selected item values (controlled) */
  selectedValues?: string[];
  /** Default selected values (uncontrolled) */
  defaultSelectedValues?: string[];
  /** Input placeholder text */
  placeholder?: string;
  /** Whether the component is disabled */
  disabled?: boolean;
  /** Whether the component is read-only */
  readonly?: boolean;
  /** Whether the field is required */
  required?: boolean;
  /** Form field name */
  name?: string;
  /** Filter mode for suggestions */
  filter?: ComboBoxFilter | `${ComboBoxFilter}`;
  /** Disable typeahead/autocomplete */
  noTypeahead?: boolean;
  /** Allow non-matching values (disable validation) */
  noValidation?: boolean;
  /** Value state for validation */
  valueState?: ValueState | `${ValueState}`;
  /** Custom value state message */
  valueStateMessage?: ReactNode;
  /** Show clear icon when items are selected or input has value */
  showClearIcon?: boolean;
  /** Show "Select All" checkbox in dropdown header */
  showSelectAll?: boolean;
  /** Show loading indicator */
  loading?: boolean;
  /** Whether the dropdown is open (controlled) */
  open?: boolean;
  /** Default open state (uncontrolled) */
  defaultOpen?: boolean;
  /** Accessible name */
  accessibleName?: string;
  /** ID of element that labels this component */
  accessibleNameRef?: string;
  /** Accessible description for screen readers */
  accessibleDescription?: string;
  /** ID of element that describes this component */
  accessibleDescriptionRef?: string;
  /** Called when input value changes (typing) */
  onInput?: (value: string) => void;
  /** Called when input operation is committed */
  onChange?: (value: string) => void;
  /** Called when selection changes */
  onSelectionChange?: (detail: MultiComboBoxSelectionChangeDetail) => void;
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
  accessibilityAttributes?: MultiComboBoxAccessibilityAttributes;
  /** Forwarded to the rendered multicombobox root element for test selectors. */
  "data-testid"?: string;
}
