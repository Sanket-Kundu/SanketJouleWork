import React from "react";

/**
 * Calendar selection mode
 */
export enum CalendarSelectionMode {
  Single = "Single",
  Multiple = "Multiple",
  Range = "Range",
}

/**
 * Calendar week numbering scheme
 */
export enum CalendarWeekNumbering {
  Default = "Default",
  ISO_8601 = "ISO_8601",
  MiddleEastern = "MiddleEastern",
  WesternTraditional = "WesternTraditional",
}

/**
 * Calendar pickers mode - restricts which picker views are available
 */
export enum CalendarPickersMode {
  /** All views: day, month, and year */
  DAY_MONTH_YEAR = "DAY_MONTH_YEAR",
  /** Month and year views only */
  MONTH_YEAR = "MONTH_YEAR",
  /** Year view only */
  YEAR = "YEAR",
}

/**
 * Calendar legend item type
 */
export enum CalendarLegendItemType {
  None = "None",
  Today = "Today",
  Selected = "Selected",
  Working = "Working",
  NonWorking = "NonWorking",
  Type01 = "Type01",
  Type02 = "Type02",
  Type03 = "Type03",
  Type04 = "Type04",
  Type05 = "Type05",
  Type06 = "Type06",
  Type07 = "Type07",
  Type08 = "Type08",
  Type09 = "Type09",
  Type10 = "Type10",
  Type11 = "Type11",
  Type12 = "Type12",
  Type13 = "Type13",
  Type14 = "Type14",
  Type15 = "Type15",
  Type16 = "Type16",
  Type17 = "Type17",
  Type18 = "Type18",
  Type19 = "Type19",
  Type20 = "Type20",
}

/**
 * Calendar picker view type (internal)
 */
export enum CalendarPickerView {
  Day = "day",
  Month = "month",
  Year = "year",
}

/**
 * Special date configuration
 */
export interface SpecialCalendarDate {
  /** The date as ISO string (YYYY-MM-DD) or timestamp */
  date: string | number;
  /** The type of special date */
  type: CalendarLegendItemType;
  /** Optional tooltip text */
  tooltip?: string;
}

/**
 * Disabled date range configuration
 */
export interface DisabledDateRange {
  /** Start date of the disabled range (inclusive) */
  startDate?: string | number;
  /** End date of the disabled range (inclusive) */
  endDate?: string | number;
}

/**
 * Calendar legend item configuration
 */
export interface CalendarLegendItem {
  /** The type this legend item represents */
  type: CalendarLegendItemType;
  /** Display text for this legend item */
  text: string;
}

/**
 * Selection change event detail
 */
export interface CalendarSelectionChangeDetail {
  /** Selected dates as ISO strings (YYYY-MM-DD) */
  selectedValues: string[];
  /** Selected dates as UTC timestamps (seconds since Unix Epoch) */
  selectedDates: number[];
  /** Currently focused timestamp */
  timestamp?: number;
}

/**
 * Calendar props
 */
export interface CalendarProps {
  /** Ref for imperative access */
  ref?: React.Ref<CalendarRef>;
  /** Selection mode - Single, Multiple, or Range */
  selectionMode?: CalendarSelectionMode;

  /** Hide week numbers column */
  hideWeekNumbers?: boolean;

  /** Week numbering scheme */
  calendarWeekNumbering?: CalendarWeekNumbering;

  /** Pickers mode - restricts which picker views are available */
  pickersMode?: CalendarPickersMode | `${CalendarPickersMode}`;

  /** Minimum selectable date (ISO string YYYY-MM-DD) */
  minDate?: string;

  /** Maximum selectable date (ISO string YYYY-MM-DD) */
  maxDate?: string;

  /** Currently selected date(s) - ISO strings (YYYY-MM-DD) */
  selectedDates?: string[];

  /** For range selection - start date (ISO string YYYY-MM-DD) */
  rangeStartDate?: string;

  /** For range selection - end date (ISO string YYYY-MM-DD) */
  rangeEndDate?: string;

  /** Special dates to highlight */
  specialDates?: SpecialCalendarDate[];

  /** Disabled date ranges */
  disabledDates?: DisabledDateRange[];

  /** Initially focused date (ISO string YYYY-MM-DD or timestamp) */
  focusedDate?: string | number;

  /** Locale for date formatting (e.g., 'en-US', 'ja-JP', 'ar-SA') */
  locale?: string;

  /** First day of the week: 0=Sunday, 1=Monday, …, 6=Saturday */
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;

  /** Show calendar legend */
  showLegend?: boolean;

  /** Hide "Today" in legend */
  hideLegendToday?: boolean;

  /** Hide "Selected Day" in legend */
  hideLegendSelectedDay?: boolean;

  /** Hide "Working Day" in legend */
  hideLegendWorkingDay?: boolean;

  /** Hide "Non-Working Day" in legend */
  hideLegendNonWorkingDay?: boolean;

  /** Custom legend items */
  legendItems?: Array<{ type: CalendarLegendItemType; text: string }>;

  /** Callback when selection changes */
  onSelectionChange?: (detail: CalendarSelectionChangeDetail) => void;

  /** Callback when month view is shown */
  onShowMonthView?: () => void;

  /** Callback when year view is shown */
  onShowYearView?: () => void;

  /** Callback when a legend item is clicked */
  onLegendItemSelect?: (detail: { type: CalendarLegendItemType; text: string }) => void;

  /** When true, focus the selected/today cell on mount (used by DatePicker popover) */
  autoFocus?: boolean;

  /** Keyboard event handler on the calendar container */
  onKeyDown?: (e: React.KeyboardEvent) => void;

  /** Additional CSS classes */
  className?: string;
  /** Forwarded to the rendered calendar root element for test selectors. */
  "data-testid"?: string;
}

/**
 * Imperative ref methods for Calendar
 */
export interface CalendarRef {
  /** Switch to the day picker view */
  switchToDayPicker(): void;
  /** Switch to the month picker view */
  switchToMonthPicker(): void;
  /** Switch to the year picker view */
  switchToYearPicker(): void;
  /** The root DOM element */
  readonly nativeElement: HTMLDivElement | null;
}
