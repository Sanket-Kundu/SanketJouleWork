import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { buildResources } from "./resources";

let initPromise: Promise<void> | null = null;

export async function initFxI18n(language?: string): Promise<void> {
  if (i18n.isInitialized) {
    const resources = buildResources();
    for (const [code, ns] of Object.entries(resources)) {
      if (!i18n.hasResourceBundle(code, "fx")) {
        i18n.addResourceBundle(code, "fx", ns.fx, true, true);
      }
    }
    return;
  }

  if (!initPromise) {
    initPromise = i18n
      .use(initReactI18next)
      .init({
        lng: language ?? "en",
        fallbackLng: "en",
        defaultNS: "fx",
        ns: ["fx"],
        resources: buildResources(),
        interpolation: { escapeValue: false },
      })
      .then(() => undefined);
  }
  return initPromise;
}
