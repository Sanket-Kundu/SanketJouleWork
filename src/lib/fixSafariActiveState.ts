/**
 * Safari iOS Active State Fix
 *
 * Safari on iOS does not apply the :active CSS pseudo-class unless there is
 * a touchstart event handler attached to the document body. This affects:
 *
 * 1. Visual feedback - buttons and interactive elements won't show pressed state
 * 2. Screen readers - VoiceOver relies on active state for announcements
 * 3. Accessibility - users need visual feedback when interacting with elements
 *
 * This fix adds an empty touchstart listener to enable the :active state.
 * The listener is only added once and only on Safari iOS.
 *
 * @see https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/AdjustingtheTextSize/AdjustingtheTextSize.html
 */

let listenerAttached = false;

/**
 * Detect if running on iOS
 */
function isIOS(): boolean {
  if (typeof navigator === "undefined") return false;

  // Check for iPhone/iPad/iPod in platform
  if (/iPhone|iPad|iPod/.test(navigator.platform)) {
    return true;
  }

  // iOS 13+ on iPad reports as Mac with touch support
  if (
    /Mac/.test(navigator.userAgent) &&
    typeof document !== "undefined" &&
    "ontouchend" in document
  ) {
    return true;
  }

  return false;
}

/**
 * Detect if running Safari browser
 */
function isSafari(): boolean {
  if (typeof navigator === "undefined") return false;

  const ua = navigator.userAgent;
  // Safari but not Chrome/Chromium-based browsers
  return /Safari/.test(ua) && !/Chrome|Chromium|CriOS|EdgiOS/.test(ua);
}

/**
 * Apply the Safari iOS active state fix.
 * Call this once when your app initializes (e.g., in a useEffect or component mount).
 *
 * @example
 * ```tsx
 * import { fixSafariActiveState } from '@sap-ui/fx-components';
 *
 * // In your app root
 * useEffect(() => {
 *   fixSafariActiveState();
 * }, []);
 * ```
 */
export function fixSafariActiveState(): void {
  if (
    typeof document !== "undefined" &&
    isSafari() &&
    isIOS() &&
    !listenerAttached
  ) {
    // Safari on iOS does not use the :active state unless there is a
    // touchstart event handler on the <body> element
    document.body.addEventListener("touchstart", () => {}, { passive: true });
    listenerAttached = true;
  }
}

/**
 * Check if the fix has been applied
 */
export function isSafariActiveStateFixed(): boolean {
  return listenerAttached;
}
