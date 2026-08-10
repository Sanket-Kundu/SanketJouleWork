import { useState, useEffect } from "react";
import { ensureCldr, isCldrLoaded } from "./cldr-init";

/**
 * Hook that ensures CLDR locale data is loaded for the given locale.
 * Returns `true` when data is ready, `false` while loading.
 *
 * Components are self-sufficient — no provider required.
 *
 * If the locale was already loaded (e.g. by a prior render),
 * returns `true` on the first render without an extra effect cycle.
 *
 * When the locale changes, returns `false` until the new locale's data loads,
 * preventing components from accessing CLDR data for a locale that isn't ready.
 *
 * @param locale - BCP 47 locale string (defaults to "en-US")
 */
export function useEnsureCldr(locale: string = "en-US"): boolean {
  // Track which locale is loaded, not just a boolean.
  // This ensures a locale change immediately returns false (stale-safe).
  const [readyLocale, setReadyLocale] = useState<string | null>(
    () => isCldrLoaded(locale) ? locale : null,
  );

  useEffect(() => {
    if (isCldrLoaded(locale)) {
      setReadyLocale(locale);
      return;
    }

    let cancelled = false;
    setReadyLocale(null);
    ensureCldr(locale).then(() => {
      if (!cancelled) setReadyLocale(locale);
    });
    return () => {
      cancelled = true;
    };
  }, [locale]);

  // Fast path: state already matches. Slow path: CLDR was loaded externally
  // and state hasn't caught up yet — check synchronously
  // to avoid a one-frame English fallback flash during locale transitions.
  return readyLocale === locale || isCldrLoaded(locale);
}
