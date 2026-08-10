import React, { ReactNode } from "react";
import { ValueState } from "./value-state";

// Re-export ValueState for consumer convenience
export { ValueState };

/**
 * Input size variants
 */
export enum InputSize {
  /** Large input (Figma: Regular - 40px) */
  Large = "Large",
  /** Small input (Figma: Small - 32px) */
  Small = "Small",
}

/**
 * Input types supported by the Input component
 */
export enum InputType {
  /** Standard text input (default) */
  Text = "Text",
  /** Email address input with validation */
  Email = "Email",
  /** Numeric input with optional min/max/step */
  Number = "Number",
  /** Password input with masked characters */
  Password = "Password",
  /** Telephone number input */
  Tel = "Tel",
  /** URL input with validation */
  URL = "URL",
  /** Search input */
  Search = "Search",
}

/**
 * Suggestion filter modes for autocomplete
 */
export enum InputFilter {
  /** Match at beginning of text only */
  StartsWith = "StartsWith",
  /** Match at beginning of each word */
  StartsWithPerTerm = "StartsWithPerTerm",
  /** Match anywhere in text */
  Contains = "Contains",
  /** No filtering */
  None = "None",
}

/**
 * Event detail for input change events
 */
export interface InputChangeDetail {
  /** Current value */
  value: string;
  /** Previous value before change */
  previousValue: string;
  /** Whether change was from user input or programmatic */
  source: "user" | "programmatic";
}

/**
 * Event detail for suggestion selection
 */
export interface InputSuggestionSelectDetail {
  /** Selected suggestion item */
  item: InputSuggestionItem;
  /** Selected value */
  value: string;
}

/**
 * Suggestion item data structure
 */
export interface InputSuggestionItem {
  /** Main display text */
  text: string;
  /** Optional secondary text */
  additionalText?: string;
  /** Value for selection (defaults to text) */
  value?: string;
  /** Icon element */
  icon?: ReactNode;
  /** Whether item is disabled */
  disabled?: boolean;
}

/**
 * Suggestion group data structure
 */
export interface InputSuggestionGroup {
  /** Group header text */
  headerText: string;
  /** Items in this group */
  items: InputSuggestionItem[];
}

/**
 * Input ref methods for imperative control
 */
export interface InputRef {
  /** Focus the input */
  focus(): void;
  /** Blur the input */
  blur(): void;
  /** Select all text */
  select(): void;
  /** Set selection range */
  setSelectionRange(start: number, end: number): void;
  /** Get current value */
  getValue(): string;
  /** Get value as number (for Number type inputs) */
  getValueAsNumber(): number;
  /** Set value programmatically */
  setValue(value: string, options?: { silent?: boolean }): void;
  /** Clear the input */
  clear(): void;
  /** Get current state */
  getState(): {
    value: string;
    focused: boolean;
    valid: boolean;
    valueState: ValueState;
  };
  /** Check HTML5 validity */
  checkValidity(): boolean;
  /** Report validity with UI */
  reportValidity(): boolean;
  /** Set custom validity message */
  setCustomValidity(message: string): void;
  /** Access native input element */
  readonly nativeElement: HTMLInputElement | null;
}

/**
 * Accessibility attributes for Input
 */
export interface InputAccessibilityAttributes {
  /** ID of element this input controls */
  controls?: string;
  /** Type of popup this input triggers */
  hasPopup?: "menu" | "listbox" | "tree" | "grid" | "dialog" | boolean;
  /** Whether the controlled element is expanded */
  expanded?: boolean;
  /** Autocomplete behavior ("list", "both", "inline", "none") */
  autoComplete?: "list" | "both" | "inline" | "none";
  /** ID of the currently active descendant element */
  activeDescendant?: string;
  /** Override the ARIA role of the native input (e.g. "combobox") */
  role?: React.AriaRole;
}

/**
 * Props for the Input component
 */
export interface InputProps {
  /** Ref for imperative access */
  ref?: React.Ref<InputRef>;
  // === Value ===
  /** Current value (controlled mode) */
  value?: string;
  /** Default value (uncontrolled mode) */
  defaultValue?: string;

  // === Input Type ===
  /** Input type */
  type?: InputType | `${InputType}`;

  // === Size ===
  /** Input size variant (default: Large / 40px) */
  size?: InputSize | `${InputSize}`;

  // === Behavior ===
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Whether the input is read-only */
  readonly?: boolean;
  /** Whether the field is required */
  required?: boolean;
  /** Autocomplete attribute for browsers */
  autocomplete?: string;

  // === Validation ===
  /** Value state for validation feedback */
  valueState?: ValueState | `${ValueState}`;
  /** Custom value state message */
  valueStateMessage?: ReactNode;
  /** Show value state icon inside input */
  showValueStateIcon?: boolean;

  // === Constraints ===
  /** Maximum length (ignored for Number type) */
  maxLength?: number;
  /** Minimum length */
  minLength?: number;
  /** Validation pattern (regex) */
  pattern?: string;
  /** Minimum value (Number type only) */
  min?: number | string;
  /** Maximum value (Number type only) */
  max?: number | string;
  /** Step increment (Number type only) */
  step?: number | string;

  // === Display ===
  /** Placeholder text */
  placeholder?: string;
  /** Show clear icon when value exists */
  showClearIcon?: boolean;
  /** Hide number input spinners */
  hideStepButtons?: boolean;

  // === Icons ===
  /** Icon element(s) to display */
  icon?: ReactNode;
  /** Icon position */
  iconPosition?: "start" | "end";

  // === Suggestions ===
  /** Enable suggestions dropdown */
  showSuggestions?: boolean;
  /** Suggestion items */
  suggestions?: (InputSuggestionItem | InputSuggestionGroup)[];
  /** Filter mode for suggestions */
  filter?: InputFilter | `${InputFilter}`;
  /** Disable typeahead autocomplete */
  noTypeahead?: boolean;
  /** Highlight matching text in suggestions */
  highlightMatch?: boolean;

  // === Accessibility ===
  /** Accessible name (aria-label) */
  accessibleName?: string;
  /** ID of labelling element (aria-labelledby) */
  accessibleNameRef?: string;
  /** Accessible description */
  accessibleDescription?: string;
  /** ID of describing element */
  accessibleDescriptionRef?: string;

  // === Form Integration ===
  /** Form field name */
  name?: string;
  /** Input ID */
  id?: string;

  // === Events ===
  /** Called on every input change (typing) */
  onInput?: (value: string) => void;
  /** Called when value is committed (blur or enter) */
  onChange?: (detail: InputChangeDetail) => void;
  /** Called when input receives focus */
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  /** Called when input loses focus */
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  /** Called on key down */
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  /** Called on key up */
  onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  /** Called when suggestion is selected */
  onSuggestionSelect?: (detail: InputSuggestionSelectDetail) => void;
  /** Called when suggestions open */
  onSuggestionsOpen?: () => void;
  /** Called when suggestions close */
  onSuggestionsClose?: () => void;

  // === Standard HTML ===
  /** Additional class names */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Data attributes for testing/AI */
  "data-testid"?: string;
  /** AI field identifier */
  "data-ai-field"?: string;
  /** Accessibility attributes */
  accessibilityAttributes?: InputAccessibilityAttributes;
}
