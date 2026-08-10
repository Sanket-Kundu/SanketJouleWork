import "@testing-library/jest-dom/vitest";
import { initFxI18n } from "../i18n/init";

// ─── i18next initialization ─────────────────────────────────────────────────
// Initialize i18next with the "fx" namespace so all component tests have
// translations available without needing a provider wrapper.
await initFxI18n("en");

// ─── UI5 CLDR pre-load ───────────────────────────────────────────────────────
// getCachedLocaleDataInstance() and DateFormat require CLDR and calendar types
// to be registered before any component renders.
// In vitest/jsdom the dynamic JSON imports in Assets.js fail (Node.js JSON
// assertion requirement), so we register the en locale data directly using
// registerLocaleDataLoader with a static import, then call fetchCldr.
import { registerLocaleDataLoader, fetchCldr } from "@ui5/webcomponents-base/dist/asset-registries/LocaleData.js";
// Register Gregorian calendar type (required by DateFormat.parse/format)
import "@ui5/webcomponents-localization/dist/sap/ui/core/date/Gregorian.js";
import enCldrRaw from "@ui5/webcomponents-localization/dist/generated/assets/cldr/en.json";
import deCldrRaw from "@ui5/webcomponents-localization/dist/generated/assets/cldr/de.json";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const enCldr = enCldrRaw as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const deCldr = deCldrRaw as any;

registerLocaleDataLoader("en", async () => enCldr);
registerLocaleDataLoader("en_US", async () => enCldr);
registerLocaleDataLoader("de", async () => deCldr);
registerLocaleDataLoader("de_DE", async () => deCldr);

await fetchCldr("en", "US", "");
await fetchCldr("de", "DE", "");

// ─── Popover API polyfill for jsdom ─────────────────────────────────────────
// jsdom does not implement the Popover API (showPopover, hidePopover, etc.).
// Install a baseline polyfill so tests that use Popover-based components
// don't crash with "el.showPopover is not a function".
// Individual test files can still call setupPopoverPolyfill() from test-utils
// for more granular before/afterEach control.

const POPOVER_OPEN_ATTR = "data-popover-open";

if (typeof HTMLElement.prototype.showPopover !== "function") {
  HTMLElement.prototype.showPopover = function () {
    this.setAttribute(POPOVER_OPEN_ATTR, "true");
  };
}

if (typeof HTMLElement.prototype.hidePopover !== "function") {
  HTMLElement.prototype.hidePopover = function () {
    this.removeAttribute(POPOVER_OPEN_ATTR);
  };
}

if (typeof HTMLElement.prototype.togglePopover !== "function") {
  HTMLElement.prototype.togglePopover = function (): boolean {
    if (this.hasAttribute(POPOVER_OPEN_ATTR)) {
      this.removeAttribute(POPOVER_OPEN_ATTR);
      return false;
    } else {
      this.setAttribute(POPOVER_OPEN_ATTR, "true");
      return true;
    }
  };
}

// Patch Element.matches to handle the :popover-open pseudo-class
const _origMatches = Element.prototype.matches;
Element.prototype.matches = function (selector: string): boolean {
  if (selector === ":popover-open") {
    return this.hasAttribute(POPOVER_OPEN_ATTR);
  }
  return _origMatches.call(this, selector);
};

// ─── ResizeObserver stub ────────────────────────────────────────────────────
// jsdom does not implement ResizeObserver.

if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
}

// ─── IntersectionObserver stub ──────────────────────────────────────────────
// jsdom does not implement IntersectionObserver.

if (typeof globalThis.IntersectionObserver === "undefined") {
  globalThis.IntersectionObserver = class IntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
    root = null;
    rootMargin = "";
    thresholds = [];
  } as unknown as typeof IntersectionObserver;
}
