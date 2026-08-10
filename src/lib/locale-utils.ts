import getCachedLocaleDataInstance from "@ui5/webcomponents-localization/dist/getCachedLocaleDataInstance.js";
import Locale from "@ui5/webcomponents-base/dist/locale/Locale.js";

/**
 * Get a UI5 Locale instance from a locale code string
 */
export function getLocale(localeCode?: string): Locale {
  return new Locale(localeCode || "en-US");
}

/**
 * Check if a locale uses RTL (Right-to-Left) text direction
 */
export function isRTLLocale(localeCode?: string): boolean {
  if (!localeCode) return false;
  const rtlLanguages = ["ar", "he", "fa", "ur"];
  return rtlLanguages.includes(localeCode.split("-")[0].toLowerCase());
}

/**
 * Get week start day for a locale (0=Sunday, 1=Monday, …)
 * Requires CLDR data to be loaded — caller must check useEnsureCldr() first.
 */
export function getWeekStartDay(localeCode?: string): 0 | 1 | 2 | 3 | 4 | 5 | 6 {
  const localeData = getCachedLocaleDataInstance(getLocale(localeCode));
  return localeData.getFirstDayOfWeek() as 0 | 1 | 2 | 3 | 4 | 5 | 6;
}

/**
 * Get CLDR medium date pattern for a locale (LDML format, e.g. "M/d/y").
 * Requires CLDR data to be loaded — caller must check useEnsureCldr() first.
 */
export function getLocaleDateFormat(localeCode?: string): string {
  const localeData = getCachedLocaleDataInstance(getLocale(localeCode));
  return localeData.getDatePattern("medium");
}
