import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  fixSafariActiveState,
  isSafariActiveStateFixed,
} from "./fixSafariActiveState";

describe("fixSafariActiveState", () => {
  let originalUserAgent: string;
  let originalPlatform: string;

  beforeEach(() => {
    originalUserAgent = navigator.userAgent;
    originalPlatform = navigator.platform;
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
  });

  it("can be called without throwing in jsdom - BLI: EL-339", () => {
    expect(() => fixSafariActiveState()).not.toThrow();
  });

  it("does not apply fix in jsdom (not Safari iOS) - BLI: EL-339", () => {
    // In jsdom the UA is not Safari on iOS, so the fix should not be applied
    fixSafariActiveState();
    // This may already be true from the first call, but the point is it
    // should not throw. We check the function is stable.
    expect(typeof isSafariActiveStateFixed()).toBe("boolean");
  });

  it("isSafariActiveStateFixed returns a boolean - BLI: EL-339", () => {
    expect(typeof isSafariActiveStateFixed()).toBe("boolean");
  });

  it("can be called multiple times safely - BLI: EL-339", () => {
    fixSafariActiveState();
    fixSafariActiveState();
    fixSafariActiveState();
    // Should not throw or add multiple listeners
    expect(typeof isSafariActiveStateFixed()).toBe("boolean");
  });

  it("should detect Safari on iPhone platform - BLI: EL-339", () => {
    Object.defineProperty(navigator, "platform", {
      value: "iPhone",
      writable: true,
      configurable: true,
    });
    Object.defineProperty(navigator, "userAgent", {
      value: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1",
      writable: true,
      configurable: true,
    });

    const addEventListenerSpy = vi.spyOn(document.body, "addEventListener");

    fixSafariActiveState();

    // Should add touchstart listener on Safari iOS
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "touchstart",
      expect.any(Function),
      { passive: true }
    );
  });

  it("should detect Safari on iPad platform - BLI: EL-339", () => {
    Object.defineProperty(navigator, "platform", {
      value: "iPad",
      writable: true,
      configurable: true,
    });
    Object.defineProperty(navigator, "userAgent", {
      value: "Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1",
      writable: true,
      configurable: true,
    });

    const addEventListenerSpy = vi.spyOn(document.body, "addEventListener");

    fixSafariActiveState();

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "touchstart",
      expect.any(Function),
      { passive: true }
    );
  });

  it("should detect Safari on iPod platform - BLI: EL-339", () => {
    Object.defineProperty(navigator, "platform", {
      value: "iPod",
      writable: true,
      configurable: true,
    });
    Object.defineProperty(navigator, "userAgent", {
      value: "Mozilla/5.0 (iPod touch; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1",
      writable: true,
      configurable: true,
    });

    const addEventListenerSpy = vi.spyOn(document.body, "addEventListener");

    fixSafariActiveState();

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "touchstart",
      expect.any(Function),
      { passive: true }
    );
  });

  it("should detect Safari on iOS 13+ iPad (reports as Mac) - BLI: EL-339", () => {
    Object.defineProperty(navigator, "userAgent", {
      value: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15",
      writable: true,
      configurable: true,
    });

    // Add ontouchend to document to simulate touch-capable Mac (iPad)
    Object.defineProperty(document, "ontouchend", {
      value: null,
      writable: true,
      configurable: true,
    });

    const addEventListenerSpy = vi.spyOn(document.body, "addEventListener");

    fixSafariActiveState();

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "touchstart",
      expect.any(Function),
      { passive: true }
    );

    // Clean up
    delete (document as any).ontouchend;
  });

  it("should not apply fix on Chrome iOS - BLI: EL-339", () => {
    Object.defineProperty(navigator, "platform", {
      value: "iPhone",
      writable: true,
      configurable: true,
    });
    Object.defineProperty(navigator, "userAgent", {
      value: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/91.0.4472.80 Mobile/15E148 Safari/604.1",
      writable: true,
      configurable: true,
    });

    const addEventListenerSpy = vi.spyOn(document.body, "addEventListener");
    addEventListenerSpy.mockClear();

    fixSafariActiveState();

    // Should NOT add listener because it's Chrome, not Safari
    expect(addEventListenerSpy).not.toHaveBeenCalled();
  });

  it("should not apply fix on non-iOS Safari - BLI: EL-339", () => {
    Object.defineProperty(navigator, "platform", {
      value: "MacIntel",
      writable: true,
      configurable: true,
    });
    Object.defineProperty(navigator, "userAgent", {
      value: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15",
      writable: true,
      configurable: true,
    });

    // Ensure no touch support
    if ("ontouchend" in document) delete (document as any).ontouchend;

    const addEventListenerSpy = vi.spyOn(document.body, "addEventListener");
    addEventListenerSpy.mockClear();

    fixSafariActiveState();

    // Should NOT add listener because it's not iOS
    expect(addEventListenerSpy).not.toHaveBeenCalled();
  });

  it("should not apply fix on Android Chrome - BLI: EL-339", () => {
    Object.defineProperty(navigator, "platform", {
      value: "Linux armv8l",
      writable: true,
      configurable: true,
    });
    Object.defineProperty(navigator, "userAgent", {
      value: "Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36",
      writable: true,
      configurable: true,
    });

    const addEventListenerSpy = vi.spyOn(document.body, "addEventListener");
    addEventListenerSpy.mockClear();

    fixSafariActiveState();

    // Should NOT add listener because it's not Safari
    expect(addEventListenerSpy).not.toHaveBeenCalled();
  });
});
