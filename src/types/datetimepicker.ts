import React from "react";
import {
  DatePickerProps,
} from "./datepicker";

/**
 * Event detail for datetime picker change events
 */
export interface DateTimePickerChangeDetail {
  /** Current value as ISO datetime string */
  value: string;
  /** Selected datetime as Date object (null if invalid) */
  dateValue: Date | null;
  /** Whether the datetime is valid */
  valid: boolean;
}

/**
 * Imperative ref methods for DateTimePicker
 */
export interface DateTimePickerRef {
  /** Format a Date object using the current display format */
  formatValue(date: Date): string;
  /** Check if a string value can be parsed as a valid datetime */
  isValidValue(value: string): boolean;
  /** The currently selected datetime as a Date object, or null */
  readonly dateValue: Date | null;
  /** The root DOM element */
  readonly nativeElement: HTMLDivElement | null;
  /** Focus the input element */
  focus(): void;
  /** Blur the input element */
  blur(): void;
}

/**
 * Props for the DateTimePicker component
 */
export interface DateTimePickerProps extends Omit<
  DatePickerProps,
  'selectionMode' | 'delimiter' | 'onChange' | 'onInput' | 'ref'
> {
  /** Ref for imperative access */
  ref?: React.Ref<DateTimePickerRef>;

  /** Whether to show seconds column (default: false) */
  showSeconds?: boolean;

  /** Time format - 12h or 24h (derived from locale by default) */
  timeFormat?: "12h" | "24h";

  /** Step for minutes column (default: 1) */
  minuteStep?: number;

  /** Step for seconds column (default: 1) */
  secondStep?: number;

  /** Current value as ISO datetime string (controlled mode) */
  value?: string;

  /** Default value as ISO datetime string (uncontrolled mode) */
  defaultValue?: string;

  /** Value format pattern (default: "yyyy-MM-dd'T'HH:mm:ss") */
  valueFormat?: string;

  /** Display format pattern for the datetime */
  displayFormat?: string;

  /** Called when value is committed */
  onChange?: (detail: DateTimePickerChangeDetail) => void;

  /** Called on every input change (typing) */
  onInput?: (detail: DateTimePickerChangeDetail) => void;
}
