import en from "./locales/en.json";
import de from "./locales/de.json";
import es from "./locales/es.json";
import fr from "./locales/fr.json";
import ja from "./locales/ja.json";
import pt from "./locales/pt.json";
import zhCN from "./locales/zh-CN.json";

const translations: Record<string, Record<string, string>> = {
  en,
  de,
  es,
  fr,
  ja,
  pt,
  zh: zhCN,
  "zh-CN": zhCN,
};

export function loadFxTranslations(lang: string): Record<string, string> {
  return (
    translations[lang] ??
    translations[lang.split("-")[0]] ??
    translations.en
  );
}

export function buildResources(): Record<string, { fx: Record<string, string> }> {
  return Object.fromEntries(
    Object.entries(translations).map(([lang, strings]) => [lang, { fx: strings }])
  );
}
