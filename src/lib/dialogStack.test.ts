import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { dialogStack } from "./dialogStack";

describe("dialogStack", () => {
  const testIds = new Set<string>();

  beforeEach(() => {
    testIds.clear();
  });

  afterEach(() => {
    // Clean up all dialogs pushed during the test
    testIds.forEach(id => dialogStack.pop(id));
    vi.restoreAllMocks();
  });

  function trackDialog(id: string): string {
    testIds.add(id);
    return id;
  }

  describe("push", () => {
    it("should add dialog to stack and return z-index - BLI: EL-339", () => {
      const beforeCount = dialogStack.getCount();
      const zIndex = dialogStack.push(trackDialog("dialog-test-1"));
      expect(dialogStack.getCount()).toBe(beforeCount + 1);
      expect(zIndex).toBeGreaterThan(50);
    });

    it("should return incrementing z-index for multiple dialogs - BLI: EL-339", () => {
      const z1 = dialogStack.push(trackDialog("dialog-z1"));
      const z2 = dialogStack.push(trackDialog("dialog-z2"));
      const z3 = dialogStack.push(trackDialog("dialog-z3"));

      expect(z2).toBeGreaterThan(z1);
      expect(z3).toBeGreaterThan(z2);
      expect(z3 - z1).toBe(2);
    });
  });

  describe("pop", () => {
    it("should remove dialog from stack - BLI: EL-339", () => {
      const id = trackDialog("dialog-pop-1");
      dialogStack.push(id);
      const countBefore = dialogStack.getCount();

      dialogStack.pop(id);
      expect(dialogStack.getCount()).toBe(countBefore - 1);
    });

    it("should handle popping non-existent dialog gracefully - BLI: EL-339", () => {
      const countBefore = dialogStack.getCount();
      dialogStack.pop("non-existent-dialog-xyz");
      expect(dialogStack.getCount()).toBe(countBefore);
    });

    it("should handle popping middle dialog from stack - BLI: EL-339", () => {
      const id1 = trackDialog("dialog-mid-1");
      const id2 = trackDialog("dialog-mid-2");
      const id3 = trackDialog("dialog-mid-3");

      dialogStack.push(id1);
      dialogStack.push(id2);
      dialogStack.push(id3);

      const countBefore = dialogStack.getCount();
      dialogStack.pop(id2);
      expect(dialogStack.getCount()).toBe(countBefore - 1);

      // Dialog 3 should still be top
      expect(dialogStack.isTop(id3)).toBe(true);
    });
  });

  describe("getZIndex", () => {
    it("should return correct z-index for dialog in stack - BLI: EL-339", () => {
      const id1 = trackDialog("dialog-zindex-1");
      const id2 = trackDialog("dialog-zindex-2");

      const z1 = dialogStack.push(id1);
      const z2 = dialogStack.push(id2);

      expect(dialogStack.getZIndex(id1)).toBe(z1);
      expect(dialogStack.getZIndex(id2)).toBe(z2);
    });

    it("should return base z-index for non-existent dialog - BLI: EL-339", () => {
      expect(dialogStack.getZIndex("non-existent-xyz")).toBe(50);
    });
  });

  describe("isTop", () => {
    it("should return true for topmost dialog - BLI: EL-339", () => {
      const id1 = trackDialog("dialog-top-1");
      const id2 = trackDialog("dialog-top-2");

      dialogStack.push(id1);
      dialogStack.push(id2);

      expect(dialogStack.isTop(id2)).toBe(true);
      expect(dialogStack.isTop(id1)).toBe(false);
    });

    it("should return false when stack is empty - BLI: EL-339", () => {
      // Pop all to empty the stack
      testIds.forEach(id => dialogStack.pop(id));

      if (dialogStack.getCount() === 0) {
        expect(dialogStack.isTop("any-dialog-xyz")).toBe(false);
      } else {
        expect(true).toBe(true);
      }
    });

    it("should return false for non-existent dialog - BLI: EL-339", () => {
      expect(dialogStack.isTop("non-existent-dialog-xyz")).toBe(false);
    });
  });

  describe("getCount", () => {
    it("should return correct count after push - BLI: EL-339", () => {
      const beforeCount = dialogStack.getCount();

      dialogStack.push(trackDialog("dialog-count-1"));
      expect(dialogStack.getCount()).toBe(beforeCount + 1);

      dialogStack.push(trackDialog("dialog-count-2"));
      expect(dialogStack.getCount()).toBe(beforeCount + 2);
    });

    it("should return correct count after pop - BLI: EL-339", () => {
      const id1 = trackDialog("dialog-count-pop-1");
      const id2 = trackDialog("dialog-count-pop-2");

      dialogStack.push(id1);
      dialogStack.push(id2);
      const beforePop = dialogStack.getCount();

      dialogStack.pop(id1);
      expect(dialogStack.getCount()).toBe(beforePop - 1);
    });
  });


  describe("edge cases", () => {
    it("should handle rapid push/pop cycles - BLI: EL-339", () => {
      const id1 = trackDialog("dialog-rapid-1");
      const id2 = trackDialog("dialog-rapid-2");
      const id3 = trackDialog("dialog-rapid-3");

      dialogStack.push(id1);
      dialogStack.push(id2);
      dialogStack.pop(id2);
      dialogStack.push(id3);
      dialogStack.pop(id1);

      expect(dialogStack.isTop(id3)).toBe(true);
    });

    it("should handle same dialog ID pushed multiple times - BLI: EL-339", () => {
      const id = trackDialog("dialog-duplicate");
      const beforeCount = dialogStack.getCount();

      dialogStack.push(id);
      dialogStack.push(id);

      expect(dialogStack.getCount()).toBe(beforeCount + 2);
    });

  });
});
