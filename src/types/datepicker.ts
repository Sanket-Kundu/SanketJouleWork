import React, { ReactNode } from "react";
import { ValueState } from "./value-state";

// Re-export ValueState for consumer convenience
export { ValueState };

/**
 * DatePicker size variants
 */
export enum DatePickerSize {
  /** Large date picker (Figma: Large — 40px height, 8px radius) */
  Large = "Large",
  /** Medium date picker (Figma: Medium — 32px height, 4px radius) */
  Medium = "Medium",
}

/**
 * Calendar type for date formatting
 */
export enum CalendarType {
  Gregorian = "Gregorian",
  Islamic = "Islamic",
  Japanese = "Japanese",
  Buddhist = "Buddhist",
  Persian = "Persian",
}

/**
 * Selection mode for DatePicker
 */
export enum DatePickerSelectionMode {
  Single = "Single",
  Range = "Range",
}

/**
 * Event detail for date picker change events (single mode)
 */
export interface DatePickerChangeDetail {
  /** Current value as formatted string */
  value: string;
  /** Selected date as Date object (null if invalid) */
  dateValue: Date | null;
  /** Whether the date is valid */
  valid: boolean;
}

/**
 * Event detail for date range picker change events
 */
export interface DateRangePickerChangeDetail {
  /** Current value as formatted string */
  value: string;
  /** Start date as Date object (null if invalid) */
  startDateValue: Date | null;
  /** End date as Date object (null if invalid) */
  endDateValue: Date | null;
  /** Whether both dates are valid */
  valid: boolean;
}

/**
 * Event detail for value state change events
 */
export interface DatePickerValueStateChangeDetail {
  /** The new value state */
  valueState: ValueState;
  /** Whether the current value is valid */
  valid: boolean;
}

/**
 * Imperative ref methods for DatePicker
 */
export interface DatePickerRef {
  /** Format a Date object using the current displayFormat */
  formatValue(date: Date): string;
  /** Check if a string value can be parsed as a valid date */
  isValidValue(value: string): boolean;
  /** Check if a string value falls within min/max range */
  isInValidRange(value: string): boolean;
  /** Check if a display-format string is a valid date */
  isValidDisplayValue(value: string): boolean;
  /** Check if the minDate prop is valid */
  isValidMin(): boolean;
  /** Check if the maxDate prop is valid */
  isValidMax(): boolean;
  /** The currently selected date as a Date object, or null */
  readonly dateValue: Date | null;
  /** The currently selected date as a UTC Date object, or null */
  readonly dateValueUTC: Date | null;
  /** Start date of the range (Range mode only) */
  readonly startDateValue: Date | null;
  /** End date of the range (Range mode only) */
  readonly endDateValue: Date | null;
  /** Start date as formatted string (Range mode only) */
  readonly startValue: string;
  /** End date as formatted string (Range mode only) */
  readonly endValue: string;
  /** The root DOM element */
  readonly nativeElement: HTMLDivElement | null;
  /** Form validity state */
  readonly formValidity: {
    valueMissing: boolean;
    patternMismatch: boolean;
    rangeUnderflow: boolean;
    rangeOverflow: boolean;
    valid: boolean;
  };
  /** Focus the input element */
  focus(): void;
  /** Blur the input element */
  blur(): void;
}

/**
 * Props for the DatePicker component
 */
export interface DatePickerProps {
  /** Ref for imperative access */
  ref?: React.Ref<DatePickerRef>;

  // === Size ===
  /** Size variant (default: Large / 40px) */
  size?: DatePickerSize | `${DatePickerSize}`;

  // === Selection Mode ===
  /** Selection mode - Single for single date, Range for date range */
  selectionMode?: DatePickerSelectionMode | `${DatePickerSelectionMode}`;
  /** Delimiter between start and end dates (only for Range mode) */
  delimiter?: string;

  // === Value ===
  /** Current value as formatted string (controlled mode) */
  value?: string;
  /** Default value (uncontrolled mode) */
  defaultValue?: string;

  // === Date Constraints ===
  /** Minimum selectable date (ISO format: yyyy-MM-dd) */
  minDate?: string;
  /** Maximum selectable date (ISO format: yyyy-MM-dd) */
  maxDate?: string;

  // === Behavior ===
  /** Whether the picker is disabled */
  disabled?: boolean;
  /** Whether the picker is read-only */
  readonly?: boolean;
  /** Whether the field is required */
  required?: boolean;

  // === Popover Control ===
  /** Controlled open state for the calendar popover */
  open?: boolean;
  /** Whether to show the clear icon button (default: true) */
  showClearIcon?: boolean;

  // === Display ===
  /** Placeholder text */
  placeholder?: string;
  /** Display format pattern (e.g., "MM/dd/yyyy") */
  displayFormat?: string;
  /** Value format pattern for internal storage */
  valueFormat?: string;
  /** Primary calendar type */
  primaryCalendarType?: CalendarType | `${CalendarType}`;
  /** Hide week numbers in calendar */
  hideWeekNumbers?: boolean;
  /** Calendar week numbering scheme */
  calendarWeekNumbering?: import("./calendar").CalendarWeekNumbering;
  /** First day of the week: 0=Sunday, 1=Monday, …, 6=Saturday */
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;

  // === Validation ===
  /** Value state for validation feedback */
  valueState?: ValueState | `${ValueState}`;
  /** Custom value state message */
  valueStateMessage?: ReactNode;

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
  /** Called on every input change (typing) - signature depends on selectionMode */
  onInput?: (detail: DatePickerChangeDetail | DateRangePickerChangeDetail) => void;
  /** Called when value is committed (blur or enter) - signature depends on selectionMode */
  onChange?: (detail: DatePickerChangeDetail | DateRangePickerChangeDetail) => void;
  /** Called when picker opens */
  onOpen?: () => void;
  /** Called when picker closes */
  onClose?: () => void;
  /** Called before value state changes. Return false to prevent the state update. */
  onValueStateChange?: (detail: DatePickerValueStateChangeDetail) => boolean | void;

  // === Standard HTML ===
  /** Additional class names */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Data attributes for testing/AI */
  "data-testid"?: string;
}
