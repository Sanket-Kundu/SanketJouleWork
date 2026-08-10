import { describe, it, expect } from "vitest";
import {
  parseDate,
  formatDateToISO,
  dateToTimestamp,
  timestampToDate,
  getWeekStart,
  getWeekEnd,
  getMonthDays,
  getWeekNumber,
  getWeekYearNumber,
  isSameDayUtil,
  isSameMonthUtil,
  isDateInRange,
  isDateBefore,
  isDateAfter,
  addMonthsToDate,
  addYearsToDate,
  getToday,
  isToday,
  getMonthName,
  getYear,
  getMonth,
  createDate,
} from "./date-utils";
import { CalendarWeekNumbering } from "../types/calendar";

describe("date-utils", () => {
  describe("parseDate", () => {
    it("should parse a Date object - BLI: EL-339", () => {
      const date = new Date(2024, 0, 15);
      expect(parseDate(date)).toBe(date);
    });

    it("should parse a Unix timestamp - BLI: EL-339", () => {
      const timestamp = 1705276800; // 2024-01-15 00:00:00 UTC
      const result = parseDate(timestamp);
      expect(result).toBeInstanceOf(Date);
      expect(result.getTime()).toBe(timestamp * 1000);
    });

    it("should parse an ISO string - BLI: EL-339", () => {
      const isoString = "2024-01-15";
      const result = parseDate(isoString);
      expect(result).toBeInstanceOf(Date);
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(0);
      expect(result.getDate()).toBe(15);
    });

    it("should throw error for invalid date string - BLI: EL-339", () => {
      expect(() => parseDate("not-a-date")).toThrow("Invalid date value");
    });
  });

  describe("formatDateToISO", () => {
    it("should format date to ISO string - BLI: EL-339", () => {
      const date = new Date(2024, 0, 15);
      expect(formatDateToISO(date)).toBe("2024-01-15");
    });

    it("should pad single-digit months and days - BLI: EL-339", () => {
      const date = new Date(2024, 0, 5);
      expect(formatDateToISO(date)).toBe("2024-01-05");
    });
  });

  describe("dateToTimestamp / timestampToDate", () => {
    it("should convert date to timestamp - BLI: EL-339", () => {
      const date = new Date(2024, 0, 15, 0, 0, 0, 0);
      const timestamp = dateToTimestamp(date);
      expect(typeof timestamp).toBe("number");
    });

    it("should convert timestamp back to date - BLI: EL-339", () => {
      const timestamp = 1705276800;
      const date = timestampToDate(timestamp);
      expect(date).toBeInstanceOf(Date);
      expect(date.getTime()).toBe(timestamp * 1000);
    });

    it("should round-trip date to timestamp and back - BLI: EL-339", () => {
      const original = new Date(2024, 0, 15, 0, 0, 0, 0);
      const timestamp = dateToTimestamp(original);
      const result = timestampToDate(timestamp);
      expect(result.getTime()).toBe(original.getTime());
    });
  });

  describe("getWeekStart / getWeekEnd", () => {
    it("should get week start with Monday as first day - BLI: EL-339", () => {
      const date = new Date(2024, 0, 17); // Wednesday
      const weekStart = getWeekStart(date, 1);
      expect(weekStart.getDay()).toBe(1); // Monday
    });

    it("should get week start with Sunday as first day - BLI: EL-339", () => {
      const date = new Date(2024, 0, 17); // Wednesday
      const weekStart = getWeekStart(date, 0);
      expect(weekStart.getDay()).toBe(0); // Sunday
    });

    it("should get week end with Monday as first day - BLI: EL-339", () => {
      const date = new Date(2024, 0, 17); // Wednesday
      const weekEnd = getWeekEnd(date, 1);
      expect(weekEnd.getDay()).toBe(0); // Sunday (end of week starting Monday)
    });

    it("should get week end with Sunday as first day - BLI: EL-339", () => {
      const date = new Date(2024, 0, 17); // Wednesday
      const weekEnd = getWeekEnd(date, 0);
      expect(weekEnd.getDay()).toBe(6); // Saturday (end of week starting Sunday)
    });

    it("should use Monday as default week start - BLI: EL-339", () => {
      const date = new Date(2024, 0, 17);
      const weekStart = getWeekStart(date);
      expect(weekStart.getDay()).toBe(1);
    });
  });

  describe("getMonthDays", () => {
    it("should return all days in calendar view including leading/trailing - BLI: EL-339", () => {
      const date = new Date(2024, 0, 15); // January 2024
      const days = getMonthDays(date, 1);

      // Calendar view should have 5-6 weeks (35-42 days)
      expect(days.length).toBeGreaterThanOrEqual(28);
      expect(days.length % 7).toBe(0); // Should be multiple of 7
      expect(days[0]).toBeInstanceOf(Date);
    });

    it("should start from Monday when weekStartsOn is 1 - BLI: EL-339", () => {
      const date = new Date(2024, 0, 15);
      const days = getMonthDays(date, 1);
      expect(days[0].getDay()).toBe(1); // Monday
    });

    it("should start from Sunday when weekStartsOn is 0 - BLI: EL-339", () => {
      const date = new Date(2024, 0, 15);
      const days = getMonthDays(date, 0);
      expect(days[0].getDay()).toBe(0); // Sunday
    });
  });

  describe("getWeekNumber", () => {
    it("should get ISO 8601 week number - BLI: EL-339", () => {
      const date = new Date(2024, 0, 15);
      const weekNum = getWeekNumber(date, CalendarWeekNumbering.ISO_8601);
      expect(typeof weekNum).toBe("number");
      expect(weekNum).toBeGreaterThan(0);
      expect(weekNum).toBeLessThanOrEqual(53);
    });

    it("should get Western Traditional week number - BLI: EL-339", () => {
      const date = new Date(2024, 0, 15);
      const weekNum = getWeekNumber(date, CalendarWeekNumbering.WesternTraditional);
      expect(typeof weekNum).toBe("number");
      expect(weekNum).toBeGreaterThan(0);
    });

    it("should get Middle Eastern week number - BLI: EL-339", () => {
      const date = new Date(2024, 0, 15);
      const weekNum = getWeekNumber(date, CalendarWeekNumbering.MiddleEastern);
      expect(typeof weekNum).toBe("number");
      expect(weekNum).toBeGreaterThan(0);
    });

    it("should use ISO 8601 as default - BLI: EL-339", () => {
      const date = new Date(2024, 0, 15);
      const weekNumDefault = getWeekNumber(date);
      const weekNumISO = getWeekNumber(date, CalendarWeekNumbering.ISO_8601);
      expect(weekNumDefault).toBe(weekNumISO);
    });

    it("should handle Default numbering - BLI: EL-339", () => {
      const date = new Date(2024, 0, 15);
      const weekNum = getWeekNumber(date, CalendarWeekNumbering.Default);
      expect(typeof weekNum).toBe("number");
      expect(weekNum).toBeGreaterThan(0);
    });
  });

  describe("getWeekYearNumber", () => {
    it("should get week year - BLI: EL-339", () => {
      const date = new Date(2024, 0, 1);
      const weekYear = getWeekYearNumber(date);
      expect(typeof weekYear).toBe("number");
      expect(weekYear).toBeGreaterThanOrEqual(2023);
      expect(weekYear).toBeLessThanOrEqual(2024);
    });
  });

  describe("isSameDayUtil", () => {
    it("should return true for same day - BLI: EL-339", () => {
      const date1 = new Date(2024, 0, 15, 10, 0, 0);
      const date2 = new Date(2024, 0, 15, 20, 0, 0);
      expect(isSameDayUtil(date1, date2)).toBe(true);
    });

    it("should return false for different days - BLI: EL-339", () => {
      const date1 = new Date(2024, 0, 15);
      const date2 = new Date(2024, 0, 16);
      expect(isSameDayUtil(date1, date2)).toBe(false);
    });
  });

  describe("isSameMonthUtil", () => {
    it("should return true for same month - BLI: EL-339", () => {
      const date1 = new Date(2024, 0, 15);
      const date2 = new Date(2024, 0, 25);
      expect(isSameMonthUtil(date1, date2)).toBe(true);
    });

    it("should return false for different months - BLI: EL-339", () => {
      const date1 = new Date(2024, 0, 15);
      const date2 = new Date(2024, 1, 15);
      expect(isSameMonthUtil(date1, date2)).toBe(false);
    });
  });

  describe("isDateInRange", () => {
    it("should return true for date within range - BLI: EL-339", () => {
      const date = new Date(2024, 0, 15);
      const start = new Date(2024, 0, 10);
      const end = new Date(2024, 0, 20);
      expect(isDateInRange(date, start, end)).toBe(true);
    });

    it("should return false for date outside range - BLI: EL-339", () => {
      const date = new Date(2024, 0, 25);
      const start = new Date(2024, 0, 10);
      const end = new Date(2024, 0, 20);
      expect(isDateInRange(date, start, end)).toBe(false);
    });

    it("should return false when start is null - BLI: EL-339", () => {
      const date = new Date(2024, 0, 15);
      const end = new Date(2024, 0, 20);
      expect(isDateInRange(date, null, end)).toBe(false);
    });

    it("should return false when end is null - BLI: EL-339", () => {
      const date = new Date(2024, 0, 15);
      const start = new Date(2024, 0, 10);
      expect(isDateInRange(date, start, null)).toBe(false);
    });

    it("should return false when both start and end are null - BLI: EL-339", () => {
      const date = new Date(2024, 0, 15);
      expect(isDateInRange(date, null, null)).toBe(false);
    });
  });

  describe("isDateBefore / isDateAfter", () => {
    it("should return true when date is before - BLI: EL-339", () => {
      const date1 = new Date(2024, 0, 10);
      const date2 = new Date(2024, 0, 15);
      expect(isDateBefore(date1, date2)).toBe(true);
    });

    it("should return false when date is after - BLI: EL-339", () => {
      const date1 = new Date(2024, 0, 20);
      const date2 = new Date(2024, 0, 15);
      expect(isDateBefore(date1, date2)).toBe(false);
    });

    it("should return true when date is after - BLI: EL-339", () => {
      const date1 = new Date(2024, 0, 20);
      const date2 = new Date(2024, 0, 15);
      expect(isDateAfter(date1, date2)).toBe(true);
    });

    it("should return false when date is before - BLI: EL-339", () => {
      const date1 = new Date(2024, 0, 10);
      const date2 = new Date(2024, 0, 15);
      expect(isDateAfter(date1, date2)).toBe(false);
    });
  });

  describe("addMonthsToDate / addYearsToDate", () => {
    it("should add months to date - BLI: EL-339", () => {
      const date = new Date(2024, 0, 15);
      const result = addMonthsToDate(date, 2);
      expect(result.getMonth()).toBe(2); // March
      expect(result.getFullYear()).toBe(2024);
    });

    it("should subtract months from date - BLI: EL-339", () => {
      const date = new Date(2024, 2, 15);
      const result = addMonthsToDate(date, -2);
      expect(result.getMonth()).toBe(0); // January
    });

    it("should add years to date - BLI: EL-339", () => {
      const date = new Date(2024, 0, 15);
      const result = addYearsToDate(date, 2);
      expect(result.getFullYear()).toBe(2026);
    });

    it("should subtract years from date - BLI: EL-339", () => {
      const date = new Date(2024, 0, 15);
      const result = addYearsToDate(date, -2);
      expect(result.getFullYear()).toBe(2022);
    });
  });

  describe("getToday / isToday", () => {
    it("should get today with time set to midnight - BLI: EL-339", () => {
      const today = getToday();
      expect(today.getHours()).toBe(0);
      expect(today.getMinutes()).toBe(0);
      expect(today.getSeconds()).toBe(0);
      expect(today.getMilliseconds()).toBe(0);
    });

    it("should return true for today - BLI: EL-339", () => {
      const today = getToday();
      expect(isToday(today)).toBe(true);
    });

    it("should return false for yesterday - BLI: EL-339", () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isToday(yesterday)).toBe(false);
    });

    it("should return false for tomorrow - BLI: EL-339", () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(isToday(tomorrow)).toBe(false);
    });
  });

  describe("getMonthName", () => {
    it("should get long month name - BLI: EL-339", () => {
      const date = new Date(2024, 0, 15);
      const monthName = getMonthName(date, "long");
      expect(monthName).toBe("January");
    });

    it("should get short month name - BLI: EL-339", () => {
      const date = new Date(2024, 0, 15);
      const monthName = getMonthName(date, "short");
      expect(monthName).toBe("Jan");
    });

    it("should use long format by default - BLI: EL-339", () => {
      const date = new Date(2024, 0, 15);
      const monthName = getMonthName(date);
      expect(monthName).toBe("January");
    });

    it("should support locale parameter - BLI: EL-339", () => {
      const date = new Date(2024, 0, 15);
      const monthName = getMonthName(date, "long", "en-US");
      expect(typeof monthName).toBe("string");
      expect(monthName.length).toBeGreaterThan(0);
    });
  });

  describe("getYear / getMonth", () => {
    it("should get year - BLI: EL-339", () => {
      const date = new Date(2024, 0, 15);
      expect(getYear(date)).toBe(2024);
    });

    it("should get month (0-indexed) - BLI: EL-339", () => {
      const date = new Date(2024, 0, 15);
      expect(getMonth(date)).toBe(0); // January
    });

    it("should get December as month 11 - BLI: EL-339", () => {
      const date = new Date(2024, 11, 31);
      expect(getMonth(date)).toBe(11);
    });
  });

  describe("createDate", () => {
    it("should create date from year and month - BLI: EL-339", () => {
      const date = createDate(2024, 0);
      expect(date.getFullYear()).toBe(2024);
      expect(date.getMonth()).toBe(0);
      expect(date.getDate()).toBe(1);
    });

    it("should create date with specific day - BLI: EL-339", () => {
      const date = createDate(2024, 0, 15);
      expect(date.getFullYear()).toBe(2024);
      expect(date.getMonth()).toBe(0);
      expect(date.getDate()).toBe(15);
    });

    it("should default to day 1 - BLI: EL-339", () => {
      const date = createDate(2024, 5);
      expect(date.getDate()).toBe(1);
    });
  });
});
