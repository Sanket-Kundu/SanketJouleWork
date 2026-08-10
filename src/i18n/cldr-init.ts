// Register CLDR loaders — must be imported before fetchCldr is called
import "@ui5/webcomponents-localization/dist/Assets.js";
// Register Gregorian calendar type — required by DateFormat.parse/format
import "@ui5/webcomponents-localization/dist/sap/ui/core/date/Gregorian.js";
import { fetchCldr } from "@ui5/webcomponents-base/dist/asset-registries/LocaleData.js";
import getCachedLocaleDataInstance from "@ui5/webcomponents-localization/dist/getCachedLocaleDataInstance.js";
import Locale from "@ui5/webcomponents-base/dist/locale/Locale.js";

const cache = new Map<string, Promise<void>>();

/**
 * Ensure CLDR data for a given locale is loaded.
 * Idempotent — multiple calls for the same locale share one promise.
 * Safe to call from components, providers, or application bootstrap code.
 */
export function ensureCldr(localeStr: string): Promise<void> {
  let p = cache.get(localeStr);
  if (!p) {
    const loc = new Locale(localeStr);
    p = fetchCldr(loc.getLanguage(), loc.getRegion(), loc.getScript()).catch(
      (err) => {
        console.warn(
          `[fx-components] CLDR load failed for "${localeStr}":`,
          err,
        );
        cache.delete(localeStr); // allow retry on next call
      },
    );
    cache.set(localeStr, p);
  }
  return p;
}

/**
 * Synchronously check if CLDR data for a locale is actually available.
 * getCachedLocaleDataInstance() always returns a wrapper — it never throws.
 * We must probe an actual data method to verify the underlying JSON is loaded.
 */
export function isCldrLoaded(localeStr: string): boolean {
  try {
    const localeData = getCachedLocaleDataInstance(new Locale(localeStr));
    // getDatePattern accesses the CLDR JSON — throws if data isn't loaded
    localeData.getDatePattern("medium");
    return true;
  } catch {
    return false;
  }
}

// Pre-load CLDR for the browser's default locale.
// UI5's DateFormat.parse() internally accesses CLDR data for the global UI5 locale
// (via UniversalDate era calculations), which defaults to navigator.language.
// Without this, starting with a non-browser-default locale would crash on parse().
ensureCldr(typeof navigator !== "undefined" ? navigator.language : "en");
