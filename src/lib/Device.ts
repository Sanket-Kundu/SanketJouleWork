/**
 * Device Detection Utilities
 *
 * Ported from UI5 Web Components Device.ts.
 * Provides device-capability checks (touch, phone, tablet, desktop)
 * based on user-agent and screen properties — NOT viewport width.
 */

const isSSR = typeof document === "undefined";

function getUserAgent(): string {
  return isSSR ? "" : navigator.userAgent;
}

function hasTouch(): boolean {
  if (isSSR) return false;
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

function isIPad(): boolean {
  if (isSSR) return false;
  const ua = getUserAgent();
  return /ipad/i.test(ua) || (/Macintosh/i.test(ua) && "ontouchend" in document);
}

function isWindowsPlatform(): boolean {
  if (isSSR) return false;
  return navigator.platform.indexOf("Win") !== -1;
}

function isWindows8OrAbove(): boolean {
  if (!isWindowsPlatform()) return false;
  const matches = getUserAgent().match(/Windows NT (\d+)/);
  const winVer = matches ? parseFloat(matches[1]) : 0;
  return winVer >= 8;
}

function isAndroidUA(): boolean {
  if (isSSR) return false;
  return !isWindowsPlatform() && /Android/.test(getUserAgent());
}

function isChromeUA(): boolean {
  if (isSSR) return false;
  return /(Chrome|CriOS)/.test(getUserAgent());
}

function isWebkitUA(): boolean {
  if (isSSR) return false;
  return /webkit/.test(getUserAgent());
}

/**
 * Detect if the current device is a tablet.
 * Uses user-agent, touch capability, and screen size — not viewport width.
 */
export function isTablet(): boolean {
  if (isSSR) return false;

  const touch = hasTouch();
  const ua = getUserAgent();

  if (isIPad()) return true;

  if (touch) {
    if (isWindows8OrAbove()) return true;

    // Chrome on Android: tablet if NOT mobile
    if (isChromeUA() && isAndroidUA()) {
      return !/Mobile Safari\/[.0-9]+/.test(ua);
    }

    // Generic touch: tablet if smallest screen dimension >= 600 (at device density)
    let densityFactor = window.devicePixelRatio || 1;
    if (isAndroidUA() && isWebkitUA()) {
      const wkMatches = ua.match(/(webkit)[ /]([\w.]+)/);
      const wkVer = wkMatches ? parseFloat(wkMatches[2]) : 0;
      if (wkVer >= 537.10) densityFactor = 1;
    }

    return Math.min(
      window.screen.width / densityFactor,
      window.screen.height / densityFactor
    ) >= 600;
  }

  // Non-touch fallbacks
  return ua.indexOf("Touch") !== -1 || (isAndroidUA() && !/(?=android)(?=.*mobile)/i.test(ua));
}

/**
 * Detect if the current device is a phone.
 * Phone = touch-capable AND not a tablet.
 */
export function isPhone(): boolean {
  if (isSSR) return false;
  return hasTouch() && !isTablet();
}

/**
 * Detect if the current device is a desktop.
 * Desktop = not phone AND not tablet (or Windows 8+ with touch — combi device).
 */
export function isDesktop(): boolean {
  if (isSSR) return false;
  return (!isTablet() && !isPhone()) || isWindows8OrAbove();
}

/**
 * Whether the device supports touch input.
 */
export function supportsTouch(): boolean {
  return hasTouch();
}

/**
 * Whether the platform is iOS (iPhone/iPad/iPod).
 */
export function isIOS(): boolean {
  if (isSSR) return false;
  return !!(navigator.platform.match(/iPhone|iPad|iPod/)) ||
    !!(getUserAgent().match(/Mac/) && "ontouchend" in document);
}

/**
 * Whether the browser is Chrome.
 */
export function isChrome(): boolean {
  return isChromeUA();
}

/**
 * Whether the browser is Safari.
 */
export function isSafari(): boolean {
  if (isSSR) return false;
  return !isChromeUA() && /(Version|PhantomJS)\/(\d+\.\d+).*Safari/.test(getUserAgent());
}
