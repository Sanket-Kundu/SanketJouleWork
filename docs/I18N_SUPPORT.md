# Internationalization (i18n)

fx-components uses [i18next](https://www.i18next.com/) + [react-i18next](https://react.i18next.com/) for translations. All built-in component strings (accessibility labels, button text, etc.) are registered under the `fx` namespace.

## Standalone Usage

Initialize i18next with all built-in translations before rendering:

```tsx
import { initFxI18n } from "@sap-ui/fx-components";

await initFxI18n("en"); // or "de", "fr", "ja", etc.

ReactDOM.createRoot(root).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);
```

`initFxI18n` is idempotent — calling it multiple times is safe. If i18next is already initialized (e.g. by the shell), it registers the `fx` namespace without reinitializing.

### Changing Language at Runtime

```tsx
import i18n from "i18next";
import { loadFxTranslations } from "@sap-ui/fx-components";

function switchLanguage(lang: string) {
  const translations = loadFxTranslations(lang);
  i18n.addResourceBundle(lang, "fx", translations, true, true);
  i18n.changeLanguage(lang);
}
```

## Shell Integration

When running inside the Engagement Layer shell, the shell owns the i18next instance. Wire up fx-components translations via your `AppAPI`:

```ts
import { loadFxTranslations } from "@sap-ui/fx-components";

export async function createAPI(shell: ShellAPI): Promise<AppAPI> {
  return {
    getAppConfig: () => ({
      i18nNamespace: "fx",
      // ...
    }),

    async loadTranslations(lang: string) {
      return loadFxTranslations(lang);
    },

    async setView(pathname) { /* ... */ },
  };
}
```

The shell calls `loadTranslations(lang)` whenever the user switches language. The returned translations are registered under the `fx` namespace, and all components using `useTranslation("fx")` re-render automatically.

## Using in Components

```tsx
import { useTranslation } from "react-i18next";

function MyComponent() {
  const { t } = useTranslation("fx");
  return <span>{t("INPUT_CLEAR")}</span>;
}
```

With interpolation:

```tsx
const { t } = useTranslation("fx");
t("INPUT_SUGGESTIONS_AVAILABLE", { count: 5 });
// → "5 suggestions available"
```

## RTL Support

RTL direction is auto-detected from the current locale:

```tsx
import { useDirection, isRTLLocale } from "@sap-ui/fx-components";

function MyComponent() {
  const dir = useDirection(); // "ltr" or "rtl" based on i18n.language
  return <div dir={dir}>...</div>;
}

// Or check manually:
isRTLLocale("ar-SA"); // true
isRTLLocale("en-US"); // false
```

**RTL locales:** Arabic (ar), Hebrew (he), Farsi (fa), Urdu (ur) — including regional variants.

## Supported Languages

| Language | Code | RTL |
|----------|------|-----|
| English | `en` | No |
| German | `de` | No |
| Arabic | `ar` | Yes |
| French | `fr` | No |
| Hebrew | `he` | Yes |
| Japanese | `ja` | No |
| Korean | `ko` | No |
| Chinese (Simplified) | `zh-CN` | No |
| Chinese (Traditional) | `zh-TW` | No |
| Russian | `ru` | No |
| Ukrainian | `uk` | No |
| Bulgarian | `bg` | No |
| Spanish | `es` | No |

All regional variants (e.g. `de-DE`, `de-AT`, `fr-CA`, `es-MX`) fall back to their base language.

## Custom Translations

Override specific keys by adding a resource bundle:

```ts
import i18n from "i18next";

i18n.addResourceBundle("en", "fx", {
  INPUT_CLEAR: "Clear all text",
  SEARCHFIELD_SEARCH: "Find",
}, true, true);
```

## CLDR / Date Formatting

Calendar and date picker components use [CLDR](https://cldr.unicode.org/) data for locale-aware month/weekday names and date formatting. This is loaded separately from i18next:

```tsx
import { ensureCldr, useEnsureCldr } from "@sap-ui/fx-components";

// Preload CLDR data for a locale:
await ensureCldr("de-DE");

// Or use the hook (returns true when ready):
function DateComponent() {
  const ready = useEnsureCldr("de-DE");
  if (!ready) return null;
  return <Calendar />;
}
```

CLDR loading is idempotent and cached — safe to call repeatedly.

## API Reference

| Export | Description |
|--------|-------------|
| `initFxI18n(lang?)` | Initialize i18next with fx translations (idempotent) |
| `loadFxTranslations(lang)` | Get flat `Record<string, string>` for a language |
| `useDirection()` | Hook returning `"ltr"` or `"rtl"` based on current language |
| `isRTLLocale(locale)` | Check if a locale is RTL |
| `RTL_LOCALES` | `Set` of known RTL locale codes |
| `ensureCldr(locale)` | Preload CLDR data for a locale |
| `useEnsureCldr(locale)` | Hook that returns `true` when CLDR data is ready |
| `useTranslation("fx")` | Re-exported from react-i18next for convenience |
