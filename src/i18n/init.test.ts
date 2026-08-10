import { describe, it, expect } from "vitest";
import i18n from "i18next";
import { initFxI18n } from "./init";
import { loadFxTranslations } from "./resources";
import { isRTLLocale } from "./types";

describe("initFxI18n", () => {
  it("initializes i18next with fx namespace", async () => {
    // Already initialized in setup.ts
    expect(i18n.isInitialized).toBe(true);
    expect(i18n.hasResourceBundle("en", "fx")).toBe(true);
  });

  it("is idempotent - calling again does not throw", async () => {
    await initFxI18n("en");
    expect(i18n.isInitialized).toBe(true);
  });

  it("translates English keys", () => {
    expect(i18n.t("INPUT_CLEAR", { ns: "fx" })).toBe("Clear input");
  });

  it("supports interpolation", () => {
    const result = i18n.t("INPUT_SUGGESTIONS_AVAILABLE", { ns: "fx", count: 5 });
    expect(result).toBe("5 suggestions available");
  });
});

describe("loadFxTranslations", () => {
  it("returns English translations by default", () => {
    const strings = loadFxTranslations("en");
    expect(strings.INPUT_CLEAR).toBe("Clear input");
  });

  it("returns German translations", () => {
    const strings = loadFxTranslations("de");
    expect(strings.INPUT_CLEAR).toBe("Eingabe löschen");
  });

  it("falls back to language code", () => {
    const strings = loadFxTranslations("de-DE");
    expect(strings.INPUT_CLEAR).toBe("Eingabe löschen");
  });

  it("falls back to English for unknown locale", () => {
    const strings = loadFxTranslations("xx-XX");
    expect(strings.INPUT_CLEAR).toBe("Clear input");
  });
});

describe("isRTLLocale", () => {
  it("detects Arabic as RTL", () => {
    expect(isRTLLocale("ar")).toBe(true);
    expect(isRTLLocale("ar-SA")).toBe(true);
  });

  it("detects Hebrew as RTL", () => {
    expect(isRTLLocale("he")).toBe(true);
    expect(isRTLLocale("he-IL")).toBe(true);
  });

  it("detects English as LTR", () => {
    expect(isRTLLocale("en")).toBe(false);
    expect(isRTLLocale("en-US")).toBe(false);
  });
});
