import { useEffect } from "react";

// =============================================================================
// F6 Fast Navigation — React port of UI5 F6Navigation
// =============================================================================
// F6 / Shift+F6 cycles focus between groups marked with
// data-sap-ui-fastnavgroup="true". Groups inside a container marked with
// data-sap-ui-fastnavgroup-container="true" form an isolated cycle.

export const DATA_ATTR = "data-sap-ui-fastnavgroup";
export const CONTAINER_ATTR = "data-sap-ui-fastnavgroup-container";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export const isF6Next = (e: KeyboardEvent): boolean =>
  (e.key === "F6" && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) ||
  (e.key === "ArrowDown" && e.ctrlKey && e.altKey && !e.shiftKey && !e.metaKey);

export const isF6Previous = (e: KeyboardEvent): boolean =>
  (e.key === "F6" && e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) ||
  (e.key === "ArrowUp" && e.ctrlKey && e.altKey && !e.shiftKey && !e.metaKey);

/** Check whether an element and all its ancestors are visible */
export const isElementVisible = (el: HTMLElement): boolean => {
  let current: HTMLElement | null = el;
  while (current && current !== document.documentElement) {
    const style = window.getComputedStyle(current);
    if (
      style.display === "none" ||
      style.visibility === "hidden" ||
      style.opacity === "0" ||
      (style.width === "0px" && style.height === "0px")
    ) {
      return false;
    }
    current = current.parentElement;
  }
  return true;
};

/** Focusable selector — covers interactive elements and anything with tabindex */
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(",");

export const getFirstFocusableElement = (container: HTMLElement): HTMLElement | null => {
  if (container.matches(FOCUSABLE_SELECTOR) && isElementVisible(container)) {
    return container;
  }
  const candidates = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
  for (const el of candidates) {
    if (isElementVisible(el)) return el;
  }
  return null;
};

// ---------------------------------------------------------------------------
// Group discovery (recursive, DOM-order)
// ---------------------------------------------------------------------------

export const collectGroups = (root: HTMLElement): HTMLElement[] => {
  const groups: HTMLElement[] = [];

  const walk = (el: HTMLElement) => {
    if (el.getAttribute(DATA_ATTR) === "true") {
      if (isElementVisible(el)) {
        groups.push(el);
      }
      // Still recurse into children — nested groups are separate F6 stops
      // (matches UI5 reference behavior)
    }
    let child = el.firstElementChild as HTMLElement | null;
    while (child) {
      if (child.nodeType === 1) walk(child);
      child = child.nextElementSibling as HTMLElement | null;
    }
  };

  walk(root);
  return groups;
};

// ---------------------------------------------------------------------------
// Find the container that scopes F6 navigation
// ---------------------------------------------------------------------------

export const findContainer = (): HTMLElement => {
  const el = document.activeElement as HTMLElement | null;
  const scope = el?.closest<HTMLElement>(`[${CONTAINER_ATTR}="true"]`);
  return scope || document.body;
};

// ---------------------------------------------------------------------------
// Find which group the currently focused element belongs to
// ---------------------------------------------------------------------------

export const findSelectedGroup = (groups: HTMLElement[]): number => {
  let el = document.activeElement as HTMLElement | null;

  while (el && el !== document.documentElement) {
    if (el.getAttribute(DATA_ATTR) === "true") {
      const idx = groups.indexOf(el);
      if (idx !== -1) return idx;
    }
    el = el.parentElement;
  }

  return -1;
};

// ---------------------------------------------------------------------------
// Focus cycling
// ---------------------------------------------------------------------------

export const focusNextGroup = (groups: HTMLElement[], currentIndex: number): void => {
  for (const _group of groups) {
    currentIndex = currentIndex + 1 >= groups.length ? 0 : currentIndex + 1;
    const target = getFirstFocusableElement(groups[currentIndex]);
    if (target) {
      target.focus();
      return;
    }
  }
};

export const focusPreviousGroup = (groups: HTMLElement[], currentIndex: number): void => {
  // Compute distance-to-skip once based on the original position
  // (handles neighbor groups sharing the same first focusable element)
  let startIndex = currentIndex;

  if (startIndex < 0) {
    // Not inside any group — go to last group
    startIndex = groups.length;
  }

  const currentFocusable = currentIndex >= 0
    ? getFirstFocusableElement(groups[currentIndex])
    : null;

  let distance = 1;
  if (currentIndex > 0 && currentFocusable) {
    for (let d = 1; d < groups.length; d++) {
      const prevIdx = currentIndex - d;
      if (prevIdx < 0) break;
      const prevFocusable = getFirstFocusableElement(groups[prevIdx]);
      if (prevFocusable === currentFocusable) {
        distance++;
      } else {
        break;
      }
    }
  }

  let targetIndex = startIndex - distance;
  if (targetIndex < 0) targetIndex = groups.length - 1;

  for (const _group of groups) {
    const target = getFirstFocusableElement(groups[targetIndex]);
    if (target) {
      target.focus();
      return;
    }
    // Skip to next candidate if this group has no focusable element
    targetIndex = targetIndex - 1 < 0 ? groups.length - 1 : targetIndex - 1;
  }
};

// ---------------------------------------------------------------------------
// Keydown handler
// ---------------------------------------------------------------------------

export const handleKeydown = (event: KeyboardEvent): void => {
  const forward = isF6Next(event);
  const backward = isF6Previous(event);
  if (!forward && !backward) return;

  const container = findContainer();
  const groups = collectGroups(container);
  if (groups.length === 0) return;

  event.preventDefault();

  const currentIndex = findSelectedGroup(groups);

  if (forward) {
    focusNextGroup(groups, currentIndex);
  } else {
    focusPreviousGroup(groups, currentIndex);
  }
};

// ---------------------------------------------------------------------------
// React hook
// ---------------------------------------------------------------------------

/**
 * Enables F6 fast navigation. Call once at the app/layout root.
 *
 * Mark F6 groups with `data-sap-ui-fastnavgroup="true"`.
 * Optionally scope navigation within a container using
 * `data-sap-ui-fastnavgroup-container="true"`.
 */
export function useF6Navigation(): void {
  useEffect(() => {
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, []);
}
