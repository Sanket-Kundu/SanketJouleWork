import { describe, it, expect } from "vitest";
import {
  isRTLLocale,
  getWeekStartDay,
  getLocaleDateFormat,
} from "./locale-utils";

describe("locale-utils", () => {
  // --- isRTLLocale ---

  describe("isRTLLocale", () => {
    it("returns false when localeCode is undefined - BLI: EL-339", () => {
      expect(isRTLLocale()).toBe(false);
    });

    it("returns true for 'ar' - BLI: EL-339", () => {
      expect(isRTLLocale("ar")).toBe(true);
    });

    it("returns true for 'ar-SA' - BLI: EL-339", () => {
      expect(isRTLLocale("ar-SA")).toBe(true);
    });

    it("returns true for 'he' - BLI: EL-339", () => {
      expect(isRTLLocale("he")).toBe(true);
    });

    it("returns true for 'he-IL' - BLI: EL-339", () => {
      expect(isRTLLocale("he-IL")).toBe(true);
    });

    it("returns true for 'fa' (Farsi) - BLI: EL-339", () => {
      expect(isRTLLocale("fa")).toBe(true);
    });

    it("returns true for 'ur' (Urdu) - BLI: EL-339", () => {
      expect(isRTLLocale("ur")).toBe(true);
    });

    it("returns false for 'en' - BLI: EL-339", () => {
      expect(isRTLLocale("en")).toBe(false);
    });

    it("returns false for 'de-DE' - BLI: EL-339", () => {
      expect(isRTLLocale("de-DE")).toBe(false);
    });

    it("handles case-insensitive language codes - BLI: EL-339", () => {
      expect(isRTLLocale("AR")).toBe(true);
      expect(isRTLLocale("He-IL")).toBe(true);
    });
  });

  // --- getWeekStartDay ---
  // Only en CLDR is loaded in tests; all locales fall back to en data (weekStart: 0 = Sunday)

  describe("getWeekStartDay", () => {
    it("returns a valid day number (0-6) when localeCode is undefined - BLI: EL-339", () => {
      const result = getWeekStartDay();
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(6);
    });

    it("returns a valid day number (0-6) for 'en-US' - BLI: EL-339", () => {
      const result = getWeekStartDay("en-US");
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(6);
    });

    it("returns a valid day number (0-6) for 'de' - BLI: EL-339", () => {
      const result = getWeekStartDay("de");
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(6);
    });

    it("returns a valid day number (0-6) for 'ja' - BLI: EL-339", () => {
      const result = getWeekStartDay("ja");
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(6);
    });
  });

  // --- getLocaleDateFormat ---
  // Only en CLDR is loaded in tests; all locales return the en medium pattern ("MMM d, y").
  // Locale-specific patterns (e.g. dd.MM.yyyy for de) require loading per-locale CLDR data
  // at runtime via fetchCldr — not available in the test environment.

  describe("getLocaleDateFormat", () => {
    it("returns a non-empty string when localeCode is undefined - BLI: EL-339", () => {
      expect(getLocaleDateFormat()).toBeTruthy();
      expect(typeof getLocaleDateFormat()).toBe("string");
    });

    it("returns a non-empty string for 'en-US' - BLI: EL-339", () => {
      const fmt = getLocaleDateFormat("en-US");
      expect(fmt).toBeTruthy();
      expect(typeof fmt).toBe("string");
    });

    it("returns the en CLDR medium pattern for 'en-US' in test environment - BLI: EL-339", () => {
      // Only en CLDR is loaded in tests; result is the en medium date pattern
      expect(getLocaleDateFormat("en-US")).toBe("MMM d, y");
    });

    it("returns a string for any locale - BLI: EL-339", () => {
      for (const lc of ["de", "fr", "ja", "zh", "ko", "ar", "he", "tr"]) {
        expect(typeof getLocaleDateFormat(lc)).toBe("string");
      }
    });
  });
});
