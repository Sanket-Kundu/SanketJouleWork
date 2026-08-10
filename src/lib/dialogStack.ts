/**
 * Dialog Stack Manager
 *
 * Manages multiple open dialogs with proper z-index stacking and scroll management.
 * Only the topmost dialog prevents body scrolling.
 */

interface DialogStackItem {
  id: string;
  backdropEl: HTMLDivElement;
  cleanupBackdrop: () => void;
}

class DialogStackManager {
  private stack: DialogStackItem[] = [];
  private baseZIndex = 50;

  private createBackdrop(onBackdropClick?: () => void): { el: HTMLDivElement; cleanup: () => void } {
    const el = document.createElement("div");
    el.setAttribute("aria-hidden", "true");
    el.setAttribute("data-dialog-backdrop", "true");
    el.setAttribute("popover", "manual");
    el.style.cssText = "position:fixed;inset:0;pointer-events:all;background:transparent;width:100vw;height:100vh;";

    const stop = (e: Event) => e.stopPropagation();
    el.addEventListener("pointerdown", stop);
    el.addEventListener("pointerup", stop);

    const handleClick = (e: Event) => {
      e.stopPropagation();
      onBackdropClick?.();
    };
    el.addEventListener("click", handleClick);

    document.body.appendChild(el);
    el.showPopover();

    const cleanup = () => {
      el.removeEventListener("pointerdown", stop);
      el.removeEventListener("pointerup", stop);
      el.removeEventListener("click", handleClick);
    };

    return { el, cleanup };
  }

  private destroyBackdrop(item: DialogStackItem): void {
    item.cleanupBackdrop();
    try { item.backdropEl.hidePopover(); } catch { /* already removed */ }
    item.backdropEl.remove();
  }

  /**
   * Register a new dialog on the stack
   */
  push(id: string, onBackdropClick?: () => void): number {
    const { el: backdropEl, cleanup: cleanupBackdrop } = this.createBackdrop(onBackdropClick);
    this.stack.push({ id, backdropEl, cleanupBackdrop });

    return this.baseZIndex + this.stack.length;
  }

  /**
   * Remove a dialog from the stack
   */
  pop(id: string): void {
    const index = this.stack.findIndex(item => item.id === id);
    if (index === -1) return;

    const item = this.stack[index];
    this.stack.splice(index, 1);
    this.destroyBackdrop(item);
  }

  /**
   * Get z-index for a specific dialog
   */
  getZIndex(id: string): number {
    const index = this.stack.findIndex(item => item.id === id);
    if (index === -1) return this.baseZIndex;
    return this.baseZIndex + index + 1;
  }

  /**
   * Check if dialog is the topmost
   */
  isTop(id: string): boolean {
    if (this.stack.length === 0) return false;
    return this.stack[this.stack.length - 1].id === id;
  }

  /**
   * Get the number of open dialogs
   */
  getCount(): number {
    return this.stack.length;
  }
}

// Singleton instance
export const dialogStack = new DialogStackManager();
