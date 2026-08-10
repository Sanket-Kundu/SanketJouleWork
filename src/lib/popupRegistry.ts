/**
 * Unified Popup Registry
 *
 * A shared stack for all popup-type components (Popover, Dialog, etc.).
 * Ported from UI5's OpenedPopupsRegistry pattern.
 *
 * - Escape closes only the topmost popup.
 * - Click-outside walks from top down, closing non-modal popups that weren't clicked.
 * - Dialogs are always modal from the click-outside perspective (clicks handled by their own backdrop).
 */

export type PopupType = "popover" | "dialog";

export interface RegisteredPopup {
  /** The popup's DOM element */
  element: HTMLElement;
  /** Close callback. escPressed=true when closed via Escape. */
  close: (escPressed?: boolean) => void;
  /** Popup type */
  type: PopupType;
  /** Whether the popup is modal (blocks click-through) */
  isModal: boolean;
  /** For popovers: returns the opener element (for click-outside detection) */
  getOpenerEl?: () => HTMLElement | null;
  /** Custom predicate: return true if target should be considered "inside" this popup (e.g., portalled submenus) */
  isInsidePopup?: (target: Node) => boolean;
}

const openedPopups: RegisteredPopup[] = [];

function attachListeners() {
  document.addEventListener("keydown", handleKeydown);
  document.addEventListener("mousedown", handleClick, true);
}

function detachListeners() {
  document.removeEventListener("keydown", handleKeydown);
  document.removeEventListener("mousedown", handleClick, true);
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key !== "Escape" || openedPopups.length === 0) return;
  e.preventDefault();
  e.stopImmediatePropagation();
  // Close only the topmost popup
  const topmost = openedPopups[openedPopups.length - 1];
  topmost.close(true);
}

function handleClick(e: MouseEvent) {
  if (openedPopups.length === 0) return;
  const target = e.target as Node;

  // Walk from topmost popup down
  for (let i = openedPopups.length - 1; i >= 0; i--) {
    const entry = openedPopups[i];

    // Modal popup or dialog blocks — stop walking
    if (entry.isModal || entry.type === "dialog") return;

    // Click on opener — stop walking (popovers only)
    if (entry.getOpenerEl) {
      const openerEl = entry.getOpenerEl();
      if (openerEl?.contains(target)) return;
    }

    // Click inside popup — stop walking
    if (entry.element.contains(target)) return;

    // Custom inside-check (e.g., for portalled submenus)
    if (entry.isInsidePopup?.(target)) return;

    // Click is outside — close this popup
    entry.close();
  }
}

/**
 * Add a popup to the global registry stack.
 */
export function addOpenedPopup(entry: RegisteredPopup): void {
  openedPopups.push(entry);
  if (openedPopups.length === 1) {
    attachListeners();
  }
}

/**
 * Remove a popup from the global registry stack.
 */
export function removeOpenedPopup(element: HTMLElement): void {
  const idx = openedPopups.findIndex((p) => p.element === element);
  if (idx !== -1) openedPopups.splice(idx, 1);
  if (openedPopups.length === 0) {
    detachListeners();
  }
}

/**
 * Check if a popup is the topmost in the stack.
 */
export function isTopmostPopup(element: HTMLElement): boolean {
  if (openedPopups.length === 0) return false;
  return openedPopups[openedPopups.length - 1].element === element;
}

/**
 * Get the current stack size.
 */
export function getOpenedPopupCount(): number {
  return openedPopups.length;
}
