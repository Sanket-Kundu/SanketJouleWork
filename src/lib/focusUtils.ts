/**
 * Utilities for finding and managing focusable elements
 * Based on UI5 Web Components implementation (simplified)
 */

/**
 * Check if an element is hidden
 */
function isElementHidden(element: HTMLElement): boolean {
  if (element.hidden) {
    return true;
  }

  const style = window.getComputedStyle(element);
  if (style.display === 'none' || style.visibility === 'hidden') {
    return true;
  }

  return false;
}

/**
 * Check if element is scrollable
 */
function isScrollable(element: HTMLElement): boolean {
  const style = window.getComputedStyle(element);
  const overflowX = style.overflowX;
  const overflowY = style.overflowY;

  return (
    (overflowX === 'scroll' || overflowX === 'auto' || overflowY === 'scroll' || overflowY === 'auto') &&
    (element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth)
  );
}

/**
 * Check if element is clickable (can receive click events)
 */
function isElementClickable(element: HTMLElement): boolean {
  if ((element as HTMLButtonElement).disabled) {
    return false;
  }

  const tabindex = element.getAttribute('tabindex');
  if (tabindex && parseInt(tabindex, 10) < 0) {
    return false;
  }

  // Check for clickable elements
  const clickableTags = ['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA'];
  if (clickableTags.includes(element.tagName)) {
    return true;
  }

  // Check if has click handlers
  if (element.onclick || element.hasAttribute('onclick')) {
    return true;
  }

  // Has explicit tabindex >= 0
  if (tabindex && parseInt(tabindex, 10) >= 0) {
    return true;
  }

  return false;
}

/**
 * Check if element should be included in focus traversal
 */
function isElemFocusable(element: HTMLElement): boolean {
  // Hidden elements are not focusable
  if (isElementHidden(element)) {
    return false;
  }

  return true;
}

/**
 * Get all child elements to traverse (including shadow DOM and slots)
 */
function getChildrenForTraversal(element: HTMLElement): HTMLElement[] {
  const children: HTMLElement[] = [];

  // Check shadow root first
  if (element.shadowRoot) {
    children.push(...Array.from(element.shadowRoot.children) as HTMLElement[]);
  }

  // Check slot assigned elements
  if (element instanceof HTMLSlotElement) {
    const assigned = element.assignedElements({ flatten: true });
    children.push(...assigned as HTMLElement[]);
  } else {
    // Regular children
    children.push(...Array.from(element.children) as HTMLElement[]);
  }

  return children.filter(child => child.nodeType === 1); // Element nodes only
}

/**
 * Recursively find focusable element in the DOM tree
 *
 * @param container - The container to search within
 * @param forward - Direction of traversal (true = forward, false = backward)
 * @param startFromContainer - Whether to consider the container itself
 * @returns The first focusable element found, or null
 */
function findFocusableElementRecursive(
  container: HTMLElement,
  forward: boolean = true,
  startFromContainer: boolean = false
): HTMLElement | null {
  // Check if container itself is focusable
  if (startFromContainer && isElemFocusable(container) && isElementClickable(container)) {
    return container;
  }

  // Get children to traverse
  const children = getChildrenForTraversal(container);

  // Traverse in correct direction
  const traverseOrder = forward ? children : children.reverse();

  for (const child of traverseOrder) {
    // Check child itself
    if (isElemFocusable(child) && isElementClickable(child)) {
      // Safari: Skip non-clickable scrollable elements
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      if (isSafari && isScrollable(child) && !isElementClickable(child)) {
        continue;
      }

      return child;
    }

    // Recurse into child
    const found = findFocusableElementRecursive(child, forward, false);
    if (found) {
      return found;
    }
  }

  return null;
}

/**
 * Find the first focusable element within a container
 *
 * @param container - The container element to search within
 * @param initialFocusId - Optional ID of element to focus first (takes priority)
 * @returns The first focusable element, or null if none found
 *
 * @example
 * ```ts
 * const dialogElement = document.getElementById('my-dialog');
 * const firstFocusable = findFirstFocusableElement(dialogElement);
 * firstFocusable?.focus();
 * ```
 *
 * @example
 * ```ts
 * // With initial focus ID
 * const firstFocusable = findFirstFocusableElement(dialogElement, 'username-input');
 * // Will return element with id="username-input" if it exists and is focusable
 * ```
 */
export function findFirstFocusableElement(
  container: HTMLElement | null,
  initialFocusId?: string
): HTMLElement | null {
  if (!container) return null;

  // If initialFocusId is provided, try to find that element first
  if (initialFocusId) {
    const targetElement = document.getElementById(initialFocusId);
    if (targetElement && container.contains(targetElement) && isElemFocusable(targetElement) && isElementClickable(targetElement)) {
      return targetElement;
    }
  }

  // Use recursive traversal to find first focusable element
  return findFocusableElementRecursive(container, true, false);
}

/**
 * Check if an element is focusable
 *
 * An element is focusable if:
 * - It's not disabled
 * - It's visible (not hidden or display:none)
 * - It has a non-negative tabindex (or is naturally focusable)
 *
 * @param element - The element to check
 * @returns True if the element is focusable
 */
export function isFocusable(element: HTMLElement): boolean {
  return isElemFocusable(element) && isElementClickable(element);
}

/**
 * Find all focusable elements within a container
 *
 * @param container - The container element to search within
 * @returns Array of all focusable elements
 */
export function findAllFocusableElements(container: HTMLElement | null): HTMLElement[] {
  if (!container) return [];

  const focusableElements: HTMLElement[] = [];

  function collectFocusable(element: HTMLElement) {
    if (isElemFocusable(element) && isElementClickable(element)) {
      focusableElements.push(element);
    }

    const children = getChildrenForTraversal(element);
    children.forEach(child => collectFocusable(child));
  }

  collectFocusable(container);

  return focusableElements;
}

/**
 * Get the last focusable element within a container
 *
 * @param container - The container element to search within
 * @returns The last focusable element, or null if none found
 */
export function findLastFocusableElement(container: HTMLElement | null): HTMLElement | null {
  if (!container) return null;

  // Use recursive traversal backwards
  return findFocusableElementRecursive(container, false, false);
}
