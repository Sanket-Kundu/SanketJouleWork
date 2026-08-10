import { CalendarWeekNumbering } from "../types/calendar";
import getCachedLocaleDataInstance from "@ui5/webcomponents-localization/dist/getCachedLocaleDataInstance.js";
import { getLocale } from "./locale-utils";

// ─── Basic date formatting (single-field) ───────────────────────────────────

/**
 * Format a single date field. Supports: d, dd, M, MM, yy, yyyy
 * Only used internally for the "d" token in DayPicker cell labels.
 */
export function format(date: Date, token: string): string {
  switch (token) {
    case "d":   return String(date.getDate());
    case "dd":  return String(date.getDate()).padStart(2, "0");
    case "M":   return String(date.getMonth() + 1);
    case "MM":  return String(date.getMonth() + 1).padStart(2, "0");
    case "yy":  return String(date.getFullYear()).slice(-2);
    case "yyyy":return String(date.getFullYear());
    default:    return String(date.getDate());
  }
}

// ─── Parse ───────────────────────────────────────────────────────────────────

/**
 * Parse a date from ISO string or timestamp
 */
export function parseDate(value: string | number | Date): Date {
  if (value instanceof Date) return value;
  if (typeof value === "number") return new Date(value * 1000);
  // Parse YYYY-MM-DD as local time (not UTC) to avoid timezone offset shifting the date
  const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    return new Date(+isoMatch[1], +isoMatch[2] - 1, +isoMatch[3]);
  }
  const d = new Date(value);
  if (!isNaN(d.getTime())) return d;
  throw new Error(`Invalid date value: ${value}`);
}

// ─── Format helpers ──────────────────────────────────────────────────────────

/**
 * Format a date to ISO string (YYYY-MM-DD)
 */
export function formatDateToISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Convert date to Unix timestamp (seconds)
 */
export function dateToTimestamp(date: Date): number {
  return Math.floor(date.getTime() / 1000);
}

/**
 * Convert Unix timestamp (seconds) to Date
 */
export function timestampToDate(timestamp: number): Date {
  return new Date(timestamp * 1000);
}

// ─── Week helpers ────────────────────────────────────────────────────────────

/**
 * Get the first day of the week for a given date (weekStartsOn: 0=Sun … 6=Sat)
 */
export function getWeekStart(date: Date, weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 1): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun
  const diff = (day - weekStartsOn + 7) % 7;
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get the last day of the week for a given date
 */
export function getWeekEnd(date: Date, weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 1): Date {
  const start = getWeekStart(date, weekStartsOn);
  const d = new Date(start);
  d.setDate(d.getDate() + 6);
  d.setHours(23, 59, 59, 999);
  return d;
}

// ─── Month grid ──────────────────────────────────────────────────────────────

/**
 * Get all days in a month, including leading/trailing days to fill the calendar grid
 */
export function getMonthDays(date: Date, weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 1): Date[] {
  const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
  const monthEnd   = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const gridStart  = getWeekStart(monthStart, weekStartsOn);
  const gridEnd    = getWeekEnd(monthEnd, weekStartsOn);

  const days: Date[] = [];
  const cur = new Date(gridStart);
  cur.setHours(0, 0, 0, 0);
  while (cur <= gridEnd) {
    days.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }

  // Always show 6 weeks (42 days) to keep the calendar height consistent
  while (days.length < 42) {
    days.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }

  return days;
}

// ─── Week numbers ────────────────────────────────────────────────────────────

/**
 * Get ISO 8601 week number. Weeks start on Monday, first week contains Jan 4.
 */
function isoWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  // Thursday of current week determines the year
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

/**
 * Western traditional week number (week starts Sun, first week has Jan 1).
 */
function westernWeekNumber(date: Date): number {
  const yearStart = new Date(date.getFullYear(), 0, 1);
  const startDow = yearStart.getDay(); // 0=Sun
  const dayOfYear = Math.floor((date.getTime() - yearStart.getTime()) / 86400000);
  return Math.floor((dayOfYear + startDow) / 7) + 1;
}

/**
 * Middle Eastern week number (week starts Sat, first week has Jan 1).
 */
function middleEasternWeekNumber(date: Date): number {
  const yearStart = new Date(date.getFullYear(), 0, 1);
  // Sat=6, so offset to make Sat=0
  const startDow = (yearStart.getDay() + 1) % 7;
  const dayOfYear = Math.floor((date.getTime() - yearStart.getTime()) / 86400000);
  return Math.floor((dayOfYear + startDow) / 7) + 1;
}

/**
 * Get week number for a date based on numbering scheme
 */
export function getWeekNumber(
  date: Date,
  numbering: CalendarWeekNumbering = CalendarWeekNumbering.ISO_8601
): number {
  switch (numbering) {
    case CalendarWeekNumbering.WesternTraditional:
      return westernWeekNumber(date);
    case CalendarWeekNumbering.MiddleEastern:
      return middleEasternWeekNumber(date);
    case CalendarWeekNumbering.ISO_8601:
    case CalendarWeekNumbering.Default:
    default:
      return isoWeekNumber(date);
  }
}

/**
 * Get ISO week year for a date
 */
export function getWeekYearNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  return d.getUTCFullYear();
}

// ─── Comparison helpers ──────────────────────────────────────────────────────

export function isSameDayUtil(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth()    === date2.getMonth() &&
    date1.getDate()     === date2.getDate()
  );
}

export function isSameMonthUtil(date: Date, compareDate: Date): boolean {
  return (
    date.getFullYear() === compareDate.getFullYear() &&
    date.getMonth()    === compareDate.getMonth()
  );
}

export function isDateInRange(date: Date, start: Date | null, end: Date | null): boolean {
  if (!start || !end) return false;
  const t = date.getTime();
  return t >= start.getTime() && t <= end.getTime();
}

export function isDateBefore(date: Date, compareDate: Date): boolean {
  return date.getTime() < compareDate.getTime();
}

export function isDateAfter(date: Date, compareDate: Date): boolean {
  return date.getTime() > compareDate.getTime();
}

// ─── Arithmetic ──────────────────────────────────────────────────────────────

export function addMonthsToDate(date: Date, amount: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + amount);
  return d;
}

export function addYearsToDate(date: Date, amount: number): Date {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() + amount);
  return d;
}

// ─── Today ───────────────────────────────────────────────────────────────────

export function getToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

export function isToday(date: Date): boolean {
  return isSameDayUtil(date, getToday());
}

// ─── Locale-aware names ──────────────────────────────────────────────────────

/**
 * Get locale-aware month name from CLDR data.
 * Requires CLDR data to be loaded — caller must check useEnsureCldr() first.
 */
export function getMonthName(date: Date, formatStr: "long" | "short" = "long", localeCode?: string): string {
  const localeData = getCachedLocaleDataInstance(getLocale(localeCode));
  const width = formatStr === "long" ? "wide" : "abbreviated";
  return localeData.getMonthsStandAlone(width)[date.getMonth()];
}

// ─── Misc ────────────────────────────────────────────────────────────────────

export function getYear(date: Date): number {
  return date.getFullYear();
}

export function getMonth(date: Date): number {
  return date.getMonth();
}

export function createDate(year: number, month: number, day: number = 1): Date {
  return new Date(year, month, day);
}
