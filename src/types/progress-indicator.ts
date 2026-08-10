import type React from "react";

/**
 * Semantic value state for the ProgressIndicator
 */
export enum ProgressIndicatorValueState {
  /** Default neutral state */
  None = "None",
  /** Positive/success state */
  Positive = "Positive",
  /** Critical/warning state */
  Critical = "Critical",
  /** Negative/error state */
  Negative = "Negative",
  /** Informational state */
  Information = "Information",
}

/**
 * ProgressIndicator ref methods for imperative control
 */
export interface ProgressIndicatorRef {
  /** Focus the progress indicator */
  focus(): void;
  /** Blur the progress indicator */
  blur(): void;
  /** Check if the progress indicator is focused */
  isFocused(): boolean;
  /** Access the native root element */
  readonly nativeElement: HTMLDivElement | null;
}

/**
 * Props for the ProgressIndicator component
 */
export interface ProgressIndicatorProps {
  /** Ref for imperative access */
  ref?: React.Ref<ProgressIndicatorRef>;
  /** Percentage value (0-100, clamped) @default 0 */
  value?: number;
  /** Custom display text instead of "N%" */
  displayValue?: string;
  /** Hide value text entirely @default false */
  hideValue?: boolean;
  /** Whether the progress indicator is disabled @default false */
  disabled?: boolean;
  /** Semantic color state @default "None" */
  valueState?: ProgressIndicatorValueState | `${ProgressIndicatorValueState}`;
  /** Accessible name (aria-label) */
  accessibleName?: string;
  /** ID reference for aria-labelledby */
  accessibleNameRef?: string;
  /** Additional CSS class names */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Element ID */
  id?: string;
  /** Test ID for testing */
  "data-testid"?: string;
}
