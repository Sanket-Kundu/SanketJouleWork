import React, { ReactNode } from "react";
import { ValueState } from "./value-state";

// Re-export ValueState for consumer convenience
export { ValueState };

/**
 * Event detail for textarea change events
 */
export interface TextareaChangeDetail {
  /** Current value */
  value: string;
  /** Previous value before change */
  previousValue: string;
  /** Whether change was from user input or programmatic */
  source: "user" | "programmatic";
}

/**
 * Event detail for textarea input events
 */
export interface TextareaInputDetail {
  /** Current value */
  value: string;
  /** Whether escape key was pressed */
  escapePressed: boolean;
}

/**
 * Event detail for textarea select events
 */
export interface TextareaSelectDetail {
  /** Start position of selection */
  start: number;
  /** End position of selection */
  end: number;
  /** Selected text */
  selectedText: string;
}

/**
 * Textarea ref methods for imperative control
 */
export interface TextareaRef {
  /** Focus the textarea */
  focus(): void;
  /** Blur the textarea */
  blur(): void;
  /** Select all text */
  select(): void;
  /** Set selection range */
  setSelectionRange(start: number, end: number): void;
  /** Get current value */
  getValue(): string;
  /** Set value programmatically */
  setValue(value: string, options?: { silent?: boolean }): void;
  /** Clear the textarea */
  clear(): void;
  /** Get current state */
  getState(): {
    value: string;
    focused: boolean;
    valid: boolean;
    valueState: ValueState;
    characterCount: number;
    exceededCharacters: number;
  };
  /** Check HTML5 validity */
  checkValidity(): boolean;
  /** Report validity with UI */
  reportValidity(): boolean;
  /** Set custom validity message */
  setCustomValidity(message: string): void;
  /** Scroll to specific position */
  scrollTo(x: number, y: number): void;
  /** Access native textarea element */
  readonly nativeElement: HTMLTextAreaElement | null;
}

/**
 * Props for the Textarea component
 */
export interface TextareaProps {
  /** Ref for imperative access */
  ref?: React.Ref<TextareaRef>;
  // === Value ===
  /** Current value (controlled mode) */
  value?: string;
  /** Default value (uncontrolled mode) */
  defaultValue?: string;

  // === Behavior ===
  /** Whether the textarea is disabled */
  disabled?: boolean;
  /** Whether the textarea is read-only */
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

  // === Constraints ===
  /** Maximum character length */
  maxLength?: number;
  /** Show exceeded text count when over limit */
  showExceededText?: boolean;
  /** Minimum length */
  minLength?: number;

  // === Layout ===
  /** Number of visible text rows (0 = auto) */
  rows?: number;
  /** Auto-expand height with content */
  growing?: boolean;
  /** Maximum rows when growing is enabled */
  growingMaxRows?: number;

  // === Display ===
  /** Placeholder text */
  placeholder?: string;

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
  /** Textarea ID */
  id?: string;

  // === Events ===
  /** Called on every input change (typing) */
  onInput?: (detail: TextareaInputDetail) => void;
  /** Called when value is committed (blur) */
  onChange?: (detail: TextareaChangeDetail) => void;
  /** Called when textarea receives focus */
  onFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  /** Called when textarea loses focus */
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  /** Called on key down */
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  /** Called on key up */
  onKeyUp?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  /** Called when text selection changes */
  onSelect?: (detail: TextareaSelectDetail) => void;
  /** Called when textarea scrolls */
  onScroll?: (e: React.UIEvent<HTMLTextAreaElement>) => void;

  // === Standard HTML ===
  /** Additional class names */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Data attributes for testing/AI */
  "data-testid"?: string;
  /** AI field identifier */
  "data-ai-field"?: string;
}
