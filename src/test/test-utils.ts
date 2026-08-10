/**
 * Shared test utilities — reusable mocks for jsdom environment.
 *
 * Usage:
 *   import { setupPopoverPolyfill, stubResizeObserver, ... } from "../../test/test-utils";
 *   setupPopoverPolyfill();          // call at module level (registers beforeEach/afterEach)
 *   stubResizeObserver();            // call at module level
 */
import { vi, beforeEach, afterEach } from "vitest";

// ─── Popover API polyfill ────────────────────────────────────────────────────

const POPOVER_OPEN_ATTR = "data-popover-open";

/**
 * Polyfills showPopover / hidePopover / :popover-open for jsdom.
 * Registers beforeEach/afterEach hooks — call once at module scope.
 */
export function setupPopoverPolyfill() {
  let origShow: typeof HTMLElement.prototype.showPopover | undefined;
  let origHide: typeof HTMLElement.prototype.hidePopover | undefined;
  let origToggle: typeof HTMLElement.prototype.togglePopover | undefined;
  let origMatches: typeof Element.prototype.matches;

  beforeEach(() => {
    origShow = HTMLElement.prototype.showPopover;
    origHide = HTMLElement.prototype.hidePopover;
    origToggle = HTMLElement.prototype.togglePopover;
    origMatches = Element.prototype.matches;

    HTMLElement.prototype.showPopover = function () {
      this.setAttribute(POPOVER_OPEN_ATTR, "true");
    };
    HTMLElement.prototype.hidePopover = function () {
      this.removeAttribute(POPOVER_OPEN_ATTR);
    };
    HTMLElement.prototype.togglePopover = function (): boolean {
      if (this.hasAttribute(POPOVER_OPEN_ATTR)) {
        this.removeAttribute(POPOVER_OPEN_ATTR);
        return false;
      } else {
        this.setAttribute(POPOVER_OPEN_ATTR, "true");
        return true;
      }
    };
    Element.prototype.matches = function (selector: string): boolean {
      if (selector === ":popover-open") {
        return this.hasAttribute(POPOVER_OPEN_ATTR);
      }
      return origMatches.call(this, selector);
    };
  });

  afterEach(() => {
    if (origShow !== undefined) HTMLElement.prototype.showPopover = origShow;
    if (origHide !== undefined) HTMLElement.prototype.hidePopover = origHide;
    if (origToggle !== undefined) HTMLElement.prototype.togglePopover = origToggle;
    Element.prototype.matches = origMatches;
    vi.useRealTimers();
    vi.restoreAllMocks();
  });
}

// ─── ResizeObserver stub ─────────────────────────────────────────────────────

/**
 * Installs a no-op ResizeObserver if missing from jsdom.
 * Safe to call multiple times.
 */
export function stubResizeObserver() {
  if (typeof globalThis.ResizeObserver === "undefined") {
    globalThis.ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver;
  }
}

// ─── IntersectionObserver stub ───────────────────────────────────────────────

/**
 * Installs a no-op IntersectionObserver if missing from jsdom.
 */
export function stubIntersectionObserver() {
  if (typeof globalThis.IntersectionObserver === "undefined") {
    globalThis.IntersectionObserver = class IntersectionObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() { return []; }
      root = null;
      rootMargin = "";
      thresholds = [];
    } as unknown as typeof IntersectionObserver;
  }
}

// ─── matchMedia stub ─────────────────────────────────────────────────────────

/**
 * Stubs window.matchMedia for responsive tests.
 * Returns a minimal MediaQueryList where `matches` is the provided value.
 */
export function stubMatchMedia(matches = false) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}
