import React from "react";

/**
 * SearchField size variants
 */
export enum SearchFieldSize {
  /** Large search field (Figma: Large — 40px height, 8px radius) */
  Large = "Large",
  /** Medium search field (Figma: Medium — 32px height, 4px radius) */
  Medium = "Medium",
}

/**
 * Event detail for search events
 */
export interface SearchFieldSearchDetail {
  /** Current value when search was triggered */
  value: string;
  /** Whether the search was triggered by the clear button */
  clearButtonPressed: boolean;
}

/**
 * SearchField ref methods for imperative control
 */
export interface SearchFieldRef {
  /** Focus the search input */
  focus(): void;
  /** Blur the search input */
  blur(): void;
  /** Get current value */
  getValue(): string;
  /** Set value programmatically */
  setValue(value: string): void;
  /** Clear the search input */
  clear(): void;
  /** Access native input element */
  readonly nativeElement: HTMLInputElement | null;
}

/**
 * Props for the SearchField component
 */
export interface SearchFieldProps {
  /** Ref for imperative access */
  ref?: React.Ref<SearchFieldRef>;

  // === Size ===
  /** Size variant (default: Large / 40px) */
  size?: SearchFieldSize | `${SearchFieldSize}`;

  // === Value ===
  /** Current value (controlled mode) */
  value?: string;
  /** Default value (uncontrolled mode) */
  defaultValue?: string;

  // === Display ===
  /** Placeholder text */
  placeholder?: string;

  // === Behavior ===
  /** Whether the search field is disabled */
  disabled?: boolean;
  /** Show loading spinner instead of search icon */
  loading?: boolean;
  /** Show clear icon when value exists (default: false) */
  showClearIcon?: boolean;

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
  /**
   * Called on every input change (typing).
   *
   * IMPORTANT: In controlled mode (when `value` prop is provided), you must handle
   * this event and update the `value` prop to reflect changes in the UI. This includes
   * clearing the field when Escape is pressed or the clear button is clicked.
   */
  onInput?: (value: string) => void;
  /**
   * Called when search is triggered (Enter key, search icon click, Escape key, or clear button).
   *
   * The `clearButtonPressed` flag is `true` when triggered by Escape key or clear button,
   * and `false` when triggered by Enter key or search icon click.
   *
   * Note: In controlled mode, pressing Escape or clicking clear will call both `onInput("")`
   * and `onSearch({ value: "", clearButtonPressed: true })`. The field will only visually
   * clear if you update the `value` prop in response to `onInput`.
   */
  onSearch?: (detail: SearchFieldSearchDetail) => void;
  /** Called when value is committed (blur) */
  onChange?: (value: string) => void;
  /** Called when input receives focus */
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  /** Called when input loses focus */
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  /** Called on key down */
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;

  // === Standard HTML ===
  /** Additional class names */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Data attributes for testing */
  "data-testid"?: string;
}
