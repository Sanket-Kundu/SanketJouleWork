import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  isDesktop,
  isPhone,
  isTablet,
  supportsTouch,
  isIOS,
  isChrome,
  isSafari,
} from "./Device";

describe("Device", () => {
  let originalUserAgent: string;
  let originalPlatform: string;
  let originalMaxTouchPoints: number;

  beforeEach(() => {
    originalUserAgent = navigator.userAgent;
    originalPlatform = navigator.platform;
    originalMaxTouchPoints = navigator.maxTouchPoints;
  });

  afterEach(() => {
    // Restore original values
    Object.defineProperty(navigator, "userAgent", {
      value: originalUserAgent,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(navigator, "platform", {
      value: originalPlatform,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(navigator, "maxTouchPoints", {
      value: originalMaxTouchPoints,
      writable: true,
      configurable: true,
    });
  });

  // In jsdom, navigator.userAgent is a generic string with no mobile/tablet indicators,
  // there is no touch support, and screen dimensions default to 0x0.
  // This means: isPhone=false, isTablet=false, isDesktop depends on Windows check.

  describe("default jsdom behavior", () => {
    it("supportsTouch returns true in jsdom (ontouchstart exists in jsdom) - BLI: EL-339", () => {
      // jsdom has `ontouchstart in window` === true by default
      expect(supportsTouch()).toBe(true);
    });

    it("isTablet returns false in jsdom (screen 0x0 is < 600) - BLI: EL-339", () => {
      expect(isTablet()).toBe(false);
    });

    it("isPhone returns true in jsdom (touch=true, not tablet) - BLI: EL-339", () => {
      // jsdom has touch support but small default screen => phone
      expect(isPhone()).toBe(true);
    });

    it("isDesktop returns false in jsdom (detected as phone) - BLI: EL-339", () => {
      // Since jsdom is detected as phone, desktop is false
      expect(isDesktop()).toBe(false);
    });

    it("isIOS returns false in jsdom - BLI: EL-339", () => {
      expect(isIOS()).toBe(false);
    });

    it("isChrome returns false in default jsdom UA - BLI: EL-339", () => {
      // jsdom default UA does not contain "Chrome"
      const ua = navigator.userAgent;
      if (!ua.includes("Chrome")) {
        expect(isChrome()).toBe(false);
      }
    });

    it("isSafari returns false in default jsdom UA - BLI: EL-339", () => {
      expect(isSafari()).toBe(false);
    });
  });

  describe("mocked touch device (phone)", () => {
    beforeEach(() => {
      // Mock touch support
      Object.defineProperty(navigator, "maxTouchPoints", {
        value: 5,
        writable: true,
        configurable: true,
      });
      // Mock small screen for phone detection (not tablet: smallest dim < 600)
      Object.defineProperty(window.screen, "width", {
        value: 375,
        writable: true,
        configurable: true,
      });
      Object.defineProperty(window.screen, "height", {
        value: 812,
        writable: true,
        configurable: true,
      });
      Object.defineProperty(window, "devicePixelRatio", {
        value: 1,
        writable: true,
        configurable: true,
      });
    });

    it("supportsTouch returns true - BLI: EL-339", () => {
      expect(supportsTouch()).toBe(true);
    });

    it("isPhone returns true for small touch device - BLI: EL-339", () => {
      expect(isPhone()).toBe(true);
    });

    it("isTablet returns false for small touch device - BLI: EL-339", () => {
      expect(isTablet()).toBe(false);
    });
  });

  describe("mocked tablet device", () => {
    beforeEach(() => {
      Object.defineProperty(navigator, "maxTouchPoints", {
        value: 5,
        writable: true,
        configurable: true,
      });
      // Tablet: smallest screen dimension >= 600
      Object.defineProperty(window.screen, "width", {
        value: 768,
        writable: true,
        configurable: true,
      });
      Object.defineProperty(window.screen, "height", {
        value: 1024,
        writable: true,
        configurable: true,
      });
      Object.defineProperty(window, "devicePixelRatio", {
        value: 1,
        writable: true,
        configurable: true,
      });
    });

    it("isTablet returns true for large touch device - BLI: EL-339", () => {
      expect(isTablet()).toBe(true);
    });

    it("isPhone returns false for tablet-sized device - BLI: EL-339", () => {
      expect(isPhone()).toBe(false);
    });
  });

  describe("desktop detection", () => {
    it("isDesktop returns true for non-touch device - BLI: EL-339", () => {
      Object.defineProperty(navigator, "maxTouchPoints", {
        value: 0,
        writable: true,
        configurable: true,
      });

      // Remove ontouchstart if it exists
      const win = window as any;
      const hadTouch = "ontouchstart" in win;
      if (hadTouch) {
        delete win.ontouchstart;
      }

      // Test
      expect(supportsTouch()).toBe(false);
      expect(isPhone()).toBe(false);
      expect(isTablet()).toBe(false);
      expect(isDesktop()).toBe(true);

      // Restore
      if (hadTouch) {
        win.ontouchstart = null;
      }
    });

    it("isDesktop returns true for Windows 8+ even with touch - BLI: EL-339", () => {
      Object.defineProperty(navigator, "platform", {
        value: "Win32",
        writable: true,
        configurable: true,
      });
      Object.defineProperty(navigator, "userAgent", {
        value: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        writable: true,
        configurable: true,
      });
      Object.defineProperty(navigator, "maxTouchPoints", {
        value: 5,
        writable: true,
        configurable: true,
      });

      expect(isDesktop()).toBe(true);
    });
  });

  describe("iPad detection", () => {
    it("detects iPad from user agent - BLI: EL-339", () => {
      Object.defineProperty(navigator, "userAgent", {
        value: "Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15",
        writable: true,
        configurable: true,
      });

      expect(isTablet()).toBe(true);
    });

    it("detects iPad iOS 13+ (reports as Mac) - BLI: EL-339", () => {
      Object.defineProperty(navigator, "userAgent", {
        value: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15",
        writable: true,
        configurable: true,
      });

      // Add ontouchend to document to simulate touch-capable Mac (iPad)
      Object.defineProperty(document, "ontouchend", {
        value: null,
        writable: true,
        configurable: true,
      });

      expect(isTablet()).toBe(true);
      expect(isIOS()).toBe(true);

      // Clean up
      delete (document as any).ontouchend;
    });
  });

  describe("iOS detection", () => {
    it("detects iPhone from platform - BLI: EL-339", () => {
      Object.defineProperty(navigator, "platform", {
        value: "iPhone",
        writable: true,
        configurable: true,
      });

      expect(isIOS()).toBe(true);
    });

    it("detects iPad from platform - BLI: EL-339", () => {
      Object.defineProperty(navigator, "platform", {
        value: "iPad",
        writable: true,
        configurable: true,
      });

      expect(isIOS()).toBe(true);
    });

    it("detects iPod from platform - BLI: EL-339", () => {
      Object.defineProperty(navigator, "platform", {
        value: "iPod",
        writable: true,
        configurable: true,
      });

      expect(isIOS()).toBe(true);
    });
  });

  describe("Chrome detection", () => {
    it("detects Chrome from user agent - BLI: EL-339", () => {
      Object.defineProperty(navigator, "userAgent", {
        value: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        writable: true,
        configurable: true,
      });

      expect(isChrome()).toBe(true);
    });

    it("detects Chrome iOS (CriOS) - BLI: EL-339", () => {
      Object.defineProperty(navigator, "userAgent", {
        value: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/91.0.4472.80 Mobile/15E148 Safari/604.1",
        writable: true,
        configurable: true,
      });

      expect(isChrome()).toBe(true);
    });

    it("does not detect Safari as Chrome - BLI: EL-339", () => {
      Object.defineProperty(navigator, "userAgent", {
        value: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15",
        writable: true,
        configurable: true,
      });

      expect(isChrome()).toBe(false);
    });
  });

  describe("Safari detection", () => {
    it("detects Safari from user agent - BLI: EL-339", () => {
      Object.defineProperty(navigator, "userAgent", {
        value: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15",
        writable: true,
        configurable: true,
      });

      expect(isSafari()).toBe(true);
      expect(isChrome()).toBe(false);
    });

    it("does not detect Chrome as Safari - BLI: EL-339", () => {
      Object.defineProperty(navigator, "userAgent", {
        value: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        writable: true,
        configurable: true,
      });

      expect(isSafari()).toBe(false);
      expect(isChrome()).toBe(true);
    });

    it("detects PhantomJS as Safari-like - BLI: EL-339", () => {
      Object.defineProperty(navigator, "userAgent", {
        value: "Mozilla/5.0 (Macintosh; Intel Mac OS X) AppleWebKit/538.1 (KHTML, like Gecko) PhantomJS/2.1.1 Safari/538.1",
        writable: true,
        configurable: true,
      });

      expect(isSafari()).toBe(true);
    });
  });

  describe("Android detection", () => {
    it("detects Android Chrome tablet - BLI: EL-339", () => {
      Object.defineProperty(navigator, "userAgent", {
        value: "Mozilla/5.0 (Linux; Android 11; SM-T870) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Safari/537.36",
        writable: true,
        configurable: true,
      });
      Object.defineProperty(navigator, "platform", {
        value: "Linux armv8l",
        writable: true,
        configurable: true,
      });
      Object.defineProperty(navigator, "maxTouchPoints", {
        value: 5,
        writable: true,
        configurable: true,
      });

      // Note: UA doesn't contain "Mobile Safari" so it's detected as tablet
      expect(isTablet()).toBe(true);
      expect(isPhone()).toBe(false);
    });

    it("detects Android Chrome phone with Mobile Safari - BLI: EL-339", () => {
      Object.defineProperty(navigator, "userAgent", {
        value: "Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36",
        writable: true,
        configurable: true,
      });
      Object.defineProperty(navigator, "platform", {
        value: "Linux armv8l",
        writable: true,
        configurable: true,
      });
      Object.defineProperty(navigator, "maxTouchPoints", {
        value: 5,
        writable: true,
        configurable: true,
      });
      Object.defineProperty(window.screen, "width", {
        value: 360,
        writable: true,
        configurable: true,
      });
      Object.defineProperty(window.screen, "height", {
        value: 800,
        writable: true,
        configurable: true,
      });

      // Has "Mobile Safari" in UA, so detected as phone
      expect(isPhone()).toBe(true);
      expect(isTablet()).toBe(false);
    });
  });

  describe("Windows detection", () => {
    it("detects Windows platform - BLI: EL-339", () => {
      Object.defineProperty(navigator, "platform", {
        value: "Win32",
        writable: true,
        configurable: true,
      });
      Object.defineProperty(navigator, "userAgent", {
        value: "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36",
        writable: true,
        configurable: true,
      });

      // Windows 7 (NT 6.1) is < 8, so isWindows8OrAbove should be false
      // But isDesktop should still be true for non-touch
      Object.defineProperty(navigator, "maxTouchPoints", {
        value: 0,
        writable: true,
        configurable: true,
      });

      // Remove ontouchstart
      const win = window as any;
      const hadTouch = "ontouchstart" in win;
      if (hadTouch) {
        delete win.ontouchstart;
      }

      expect(isDesktop()).toBe(true);

      // Restore
      if (hadTouch) {
        win.ontouchstart = null;
      }
    });

    it("detects Windows 8 touch device as desktop - BLI: EL-339", () => {
      Object.defineProperty(navigator, "platform", {
        value: "Win32",
        writable: true,
        configurable: true,
      });
      Object.defineProperty(navigator, "userAgent", {
        value: "Mozilla/5.0 (Windows NT 10.0; Touch; Win64; x64) AppleWebKit/537.36",
        writable: true,
        configurable: true,
      });
      Object.defineProperty(navigator, "maxTouchPoints", {
        value: 5,
        writable: true,
        configurable: true,
      });
      Object.defineProperty(window.screen, "width", {
        value: 768,
        writable: true,
        configurable: true,
      });
      Object.defineProperty(window.screen, "height", {
        value: 1024,
        writable: true,
        configurable: true,
      });

      // Ensure ontouchstart exists
      const win = window as any;
      if (!("ontouchstart" in win)) {
        win.ontouchstart = null;
      }

      // Windows 10 (NT 10.0) is >= 8, so should be treated as desktop even with touch
      expect(isTablet()).toBe(true); // Screen size qualifies
      expect(isDesktop()).toBe(true); // But Windows 8+ is always desktop
    });
  });

  describe("webkit version handling", () => {
    it("handles high webkit version on Android - BLI: EL-339", () => {
      Object.defineProperty(navigator, "userAgent", {
        value: "Mozilla/5.0 (Linux; Android 11) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/91.0.4472.120 Mobile Safari/537.36",
        writable: true,
        configurable: true,
      });
      Object.defineProperty(navigator, "platform", {
        value: "Linux armv8l",
        writable: true,
        configurable: true,
      });
      Object.defineProperty(navigator, "maxTouchPoints", {
        value: 5,
        writable: true,
        configurable: true,
      });
      Object.defineProperty(window.screen, "width", {
        value: 360,
        writable: true,
        configurable: true,
      });
      Object.defineProperty(window.screen, "height", {
        value: 800,
        writable: true,
        configurable: true,
      });
      Object.defineProperty(window, "devicePixelRatio", {
        value: 3,
        writable: true,
        configurable: true,
      });

      // High webkit version (>= 537.10) should use density factor 1
      expect(isPhone()).toBe(true);
    });
  });
});
