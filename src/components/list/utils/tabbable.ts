/**
 * Utility functions for finding tabbable elements within a container.
 * Based on UI5 web components TabbableElements.js
 */

const TABBABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'button:not([disabled])',
  'iframe',
  'object',
  'embed',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable]:not([contenteditable="false"])',
].join(',');

/**
 * Returns all tabbable elements within a container
 */
export function getTabbableElements(container: HTMLElement | null): HTMLElement[] {
  if (!container) return [];

  const elements = Array.from(
    container.querySelectorAll<HTMLElement>(TABBABLE_SELECTOR)
  );

  // Filter out elements with tabindex="-1" or that are not visible
  return elements.filter(el => {
    const tabindex = el.getAttribute('tabindex');
    if (tabindex === '-1') return false;

    // Check if element is visible
    const style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden') return false;

    // Check if element or any parent has aria-hidden (but stop at container boundary)
    let current: HTMLElement | null = el;
    while (current && current !== container) {
      if (current.getAttribute('aria-hidden') === 'true') return false;
      current = current.parentElement;
    }

    return true;
  });
}

/**
 * Returns the first tabbable element within a container
 */
export function getFirstTabbableElement(container: HTMLElement | null): HTMLElement | null {
  const tabbables = getTabbableElements(container);
  return tabbables[0] || null;
}

/**
 * Returns the last tabbable element within a container
 */
export function getLastTabbableElement(container: HTMLElement | null): HTMLElement | null {
  const tabbables = getTabbableElements(container);
  return tabbables[tabbables.length - 1] || null;
}

/**
 * Returns the currently active element (works across shadow DOM boundaries)
 */
export function getActiveElement(): Element | null {
  let activeElement = document.activeElement;

  // Traverse through shadow DOM boundaries
  while (activeElement?.shadowRoot?.activeElement) {
    activeElement = activeElement.shadowRoot.activeElement;
  }

  return activeElement;
}
