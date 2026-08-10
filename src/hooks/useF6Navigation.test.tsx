import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, act } from "@testing-library/react";
import {
  isF6Next,
  isF6Previous,
  isElementVisible,
  getFirstFocusableElement,
  collectGroups,
  findContainer,
  findSelectedGroup,
  focusNextGroup,
  focusPreviousGroup,
  handleKeydown,
  useF6Navigation,
  DATA_ATTR,
  CONTAINER_ATTR,
} from "./useF6Navigation";

// Helper to create a KeyboardEvent-like object
const makeKeyEvent = (overrides: Partial<KeyboardEvent> = {}): KeyboardEvent =>
  ({
    key: "",
    shiftKey: false,
    ctrlKey: false,
    altKey: false,
    metaKey: false,
    preventDefault: vi.fn(),
    ...overrides,
  } as unknown as KeyboardEvent);

// Helper component that calls the hook
function F6Host() {
  useF6Navigation();
  return null;
}

describe("useF6Navigation", () => {
  // -----------------------------------------------------------------------
  // Key detection
  // -----------------------------------------------------------------------
  describe("isF6Next", () => {
    it("returns true for plain F6 - BLI: EL-339", () => {
      expect(isF6Next(makeKeyEvent({ key: "F6" }))).toBe(true);
    });

    it("returns false for Shift+F6 - BLI: EL-339", () => {
      expect(isF6Next(makeKeyEvent({ key: "F6", shiftKey: true }))).toBe(false);
    });

    it("returns true for Ctrl+Alt+ArrowDown - BLI: EL-339", () => {
      expect(isF6Next(makeKeyEvent({ key: "ArrowDown", ctrlKey: true, altKey: true }))).toBe(true);
    });

    it("returns false for unrelated keys - BLI: EL-339", () => {
      expect(isF6Next(makeKeyEvent({ key: "Tab" }))).toBe(false);
    });
  });

  describe("isF6Previous", () => {
    it("returns true for Shift+F6 - BLI: EL-339", () => {
      expect(isF6Previous(makeKeyEvent({ key: "F6", shiftKey: true }))).toBe(true);
    });

    it("returns false for plain F6 - BLI: EL-339", () => {
      expect(isF6Previous(makeKeyEvent({ key: "F6" }))).toBe(false);
    });

    it("returns true for Ctrl+Alt+ArrowUp - BLI: EL-339", () => {
      expect(isF6Previous(makeKeyEvent({ key: "ArrowUp", ctrlKey: true, altKey: true }))).toBe(true);
    });
  });

  // -----------------------------------------------------------------------
  // Visibility
  // -----------------------------------------------------------------------
  describe("isElementVisible", () => {
    it("returns true for a visible element - BLI: EL-339", () => {
      const el = document.createElement("div");
      document.body.appendChild(el);
      expect(isElementVisible(el)).toBe(true);
      el.remove();
    });

    it("returns false when element has display:none - BLI: EL-339", () => {
      const el = document.createElement("div");
      el.style.display = "none";
      document.body.appendChild(el);
      expect(isElementVisible(el)).toBe(false);
      el.remove();
    });

    it("returns false when ancestor has visibility:hidden - BLI: EL-339", () => {
      const parent = document.createElement("div");
      parent.style.visibility = "hidden";
      const child = document.createElement("div");
      parent.appendChild(child);
      document.body.appendChild(parent);
      expect(isElementVisible(child)).toBe(false);
      parent.remove();
    });
  });

  // -----------------------------------------------------------------------
  // getFirstFocusableElement
  // -----------------------------------------------------------------------
  describe("getFirstFocusableElement", () => {
    it("returns container itself if it is focusable - BLI: EL-339", () => {
      const btn = document.createElement("button");
      btn.textContent = "Click";
      document.body.appendChild(btn);
      expect(getFirstFocusableElement(btn)).toBe(btn);
      btn.remove();
    });

    it("returns first focusable child - BLI: EL-339", () => {
      const div = document.createElement("div");
      const input = document.createElement("input");
      div.appendChild(document.createElement("span"));
      div.appendChild(input);
      document.body.appendChild(div);
      expect(getFirstFocusableElement(div)).toBe(input);
      div.remove();
    });

    it("returns null when no focusable elements exist - BLI: EL-339", () => {
      const div = document.createElement("div");
      div.innerHTML = "<span>text</span>";
      document.body.appendChild(div);
      expect(getFirstFocusableElement(div)).toBeNull();
      div.remove();
    });
  });

  // -----------------------------------------------------------------------
  // collectGroups
  // -----------------------------------------------------------------------
  describe("collectGroups", () => {
    it("finds groups in DOM order - BLI: EL-339", () => {
      const root = document.createElement("div");
      const g1 = document.createElement("div");
      g1.setAttribute(DATA_ATTR, "true");
      const g2 = document.createElement("div");
      g2.setAttribute(DATA_ATTR, "true");
      root.appendChild(g1);
      root.appendChild(g2);
      document.body.appendChild(root);

      const groups = collectGroups(root);
      expect(groups).toEqual([g1, g2]);
      root.remove();
    });

    it("skips hidden groups - BLI: EL-339", () => {
      const root = document.createElement("div");
      const visible = document.createElement("div");
      visible.setAttribute(DATA_ATTR, "true");
      const hidden = document.createElement("div");
      hidden.setAttribute(DATA_ATTR, "true");
      hidden.style.display = "none";
      root.appendChild(visible);
      root.appendChild(hidden);
      document.body.appendChild(root);

      const groups = collectGroups(root);
      expect(groups).toEqual([visible]);
      root.remove();
    });

    it("finds nested groups as separate stops - BLI: EL-339", () => {
      const root = document.createElement("div");
      const outer = document.createElement("div");
      outer.setAttribute(DATA_ATTR, "true");
      const inner = document.createElement("div");
      inner.setAttribute(DATA_ATTR, "true");
      outer.appendChild(inner);
      root.appendChild(outer);
      document.body.appendChild(root);

      const groups = collectGroups(root);
      expect(groups).toEqual([outer, inner]);
      root.remove();
    });
  });

  // -----------------------------------------------------------------------
  // findContainer
  // -----------------------------------------------------------------------
  describe("findContainer", () => {
    it("returns document.body when no container is set - BLI: EL-339", () => {
      expect(findContainer()).toBe(document.body);
    });

    it("returns the closest container scope - BLI: EL-339", () => {
      const container = document.createElement("div");
      container.setAttribute(CONTAINER_ATTR, "true");
      const btn = document.createElement("button");
      container.appendChild(btn);
      document.body.appendChild(container);
      btn.focus();

      expect(findContainer()).toBe(container);
      container.remove();
    });
  });

  // -----------------------------------------------------------------------
  // findSelectedGroup
  // -----------------------------------------------------------------------
  describe("findSelectedGroup", () => {
    it("returns -1 when focus is outside any group - BLI: EL-339", () => {
      const groups = [document.createElement("div")];
      expect(findSelectedGroup(groups)).toBe(-1);
    });

    it("returns the index of the group containing the focused element - BLI: EL-339", () => {
      const g1 = document.createElement("div");
      g1.setAttribute(DATA_ATTR, "true");
      const g2 = document.createElement("div");
      g2.setAttribute(DATA_ATTR, "true");
      const btn = document.createElement("button");
      g2.appendChild(btn);
      document.body.appendChild(g1);
      document.body.appendChild(g2);
      btn.focus();

      expect(findSelectedGroup([g1, g2])).toBe(1);
      g1.remove();
      g2.remove();
    });
  });

  // -----------------------------------------------------------------------
  // focusNextGroup / focusPreviousGroup
  // -----------------------------------------------------------------------
  describe("focusNextGroup", () => {
    let root: HTMLDivElement;
    let groups: HTMLElement[];
    let btns: HTMLButtonElement[];

    beforeEach(() => {
      root = document.createElement("div");
      groups = [];
      btns = [];
      for (let i = 0; i < 3; i++) {
        const g = document.createElement("div");
        g.setAttribute(DATA_ATTR, "true");
        const b = document.createElement("button");
        b.textContent = `B${i}`;
        g.appendChild(b);
        root.appendChild(g);
        groups.push(g);
        btns.push(b);
      }
      document.body.appendChild(root);
    });

    afterEach(() => root.remove());

    it("moves focus to next group - BLI: EL-339", () => {
      focusNextGroup(groups, 0);
      expect(document.activeElement).toBe(btns[1]);
    });

    it("wraps from last to first - BLI: EL-339", () => {
      focusNextGroup(groups, 2);
      expect(document.activeElement).toBe(btns[0]);
    });

    it("skips groups with no focusable children - BLI: EL-339", () => {
      // Remove button from group 1
      btns[1].remove();
      focusNextGroup(groups, 0);
      expect(document.activeElement).toBe(btns[2]);
    });

    it("starts at first group when currentIndex is -1 - BLI: EL-339", () => {
      focusNextGroup(groups, -1);
      expect(document.activeElement).toBe(btns[0]);
    });
  });

  describe("focusPreviousGroup", () => {
    let root: HTMLDivElement;
    let groups: HTMLElement[];
    let btns: HTMLButtonElement[];

    beforeEach(() => {
      root = document.createElement("div");
      groups = [];
      btns = [];
      for (let i = 0; i < 3; i++) {
        const g = document.createElement("div");
        g.setAttribute(DATA_ATTR, "true");
        const b = document.createElement("button");
        b.textContent = `B${i}`;
        g.appendChild(b);
        root.appendChild(g);
        groups.push(g);
        btns.push(b);
      }
      document.body.appendChild(root);
    });

    afterEach(() => root.remove());

    it("moves focus to previous group - BLI: EL-339", () => {
      focusPreviousGroup(groups, 2);
      expect(document.activeElement).toBe(btns[1]);
    });

    it("wraps from first to last - BLI: EL-339", () => {
      focusPreviousGroup(groups, 0);
      expect(document.activeElement).toBe(btns[2]);
    });

    it("goes to last group when currentIndex is -1 - BLI: EL-339", () => {
      focusPreviousGroup(groups, -1);
      expect(document.activeElement).toBe(btns[2]);
    });

    it("skips groups with no focusable children - BLI: EL-339", () => {
      btns[1].remove();
      focusPreviousGroup(groups, 2);
      expect(document.activeElement).toBe(btns[0]);
    });
  });

  // -----------------------------------------------------------------------
  // handleKeydown (integration)
  // -----------------------------------------------------------------------
  describe("handleKeydown", () => {
    let root: HTMLDivElement;
    let btns: HTMLButtonElement[];

    beforeEach(() => {
      root = document.createElement("div");
      btns = [];
      for (let i = 0; i < 3; i++) {
        const g = document.createElement("div");
        g.setAttribute(DATA_ATTR, "true");
        const b = document.createElement("button");
        b.textContent = `Btn${i}`;
        g.appendChild(b);
        root.appendChild(g);
        btns.push(b);
      }
      document.body.appendChild(root);
    });

    afterEach(() => root.remove());

    it("moves focus forward on F6 - BLI: EL-339", () => {
      btns[0].focus();
      const event = makeKeyEvent({ key: "F6" });
      handleKeydown(event);
      expect(document.activeElement).toBe(btns[1]);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it("moves focus backward on Shift+F6 - BLI: EL-339", () => {
      btns[1].focus();
      const event = makeKeyEvent({ key: "F6", shiftKey: true });
      handleKeydown(event);
      expect(document.activeElement).toBe(btns[0]);
    });

    it("does nothing for unrelated keys - BLI: EL-339", () => {
      btns[0].focus();
      const event = makeKeyEvent({ key: "Tab" });
      handleKeydown(event);
      expect(document.activeElement).toBe(btns[0]);
      expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it("does nothing when no groups exist - BLI: EL-339", () => {
      // Remove all group attrs
      root.querySelectorAll(`[${DATA_ATTR}]`).forEach((el) =>
        el.removeAttribute(DATA_ATTR)
      );
      btns[0].focus();
      const event = makeKeyEvent({ key: "F6" });
      handleKeydown(event);
      expect(event.preventDefault).not.toHaveBeenCalled();
    });
  });

  // -----------------------------------------------------------------------
  // Container scoping
  // -----------------------------------------------------------------------
  describe("container scoping", () => {
    it("cycles only within scoped container - BLI: EL-339", () => {
      const container = document.createElement("div");
      container.setAttribute(CONTAINER_ATTR, "true");
      const btns: HTMLButtonElement[] = [];
      for (let i = 0; i < 2; i++) {
        const g = document.createElement("div");
        g.setAttribute(DATA_ATTR, "true");
        const b = document.createElement("button");
        b.textContent = `Scoped${i}`;
        g.appendChild(b);
        container.appendChild(g);
        btns.push(b);
      }

      // Group outside container — should NOT be reachable
      const outside = document.createElement("div");
      outside.setAttribute(DATA_ATTR, "true");
      const outsideBtn = document.createElement("button");
      outsideBtn.textContent = "Outside";
      outside.appendChild(outsideBtn);

      document.body.appendChild(outside);
      document.body.appendChild(container);

      btns[0].focus();
      handleKeydown(makeKeyEvent({ key: "F6" }));
      expect(document.activeElement).toBe(btns[1]);

      // Should wrap within container, not go to outside group
      handleKeydown(makeKeyEvent({ key: "F6" }));
      expect(document.activeElement).toBe(btns[0]);

      container.remove();
      outside.remove();
    });
  });

  // -----------------------------------------------------------------------
  // Hook integration
  // -----------------------------------------------------------------------
  describe("useF6Navigation hook", () => {
    it("attaches and removes keydown listener - BLI: EL-339", () => {
      const addSpy = vi.spyOn(document, "addEventListener");
      const removeSpy = vi.spyOn(document, "removeEventListener");

      const { unmount } = render(<F6Host />);
      expect(addSpy).toHaveBeenCalledWith("keydown", expect.any(Function));

      unmount();
      expect(removeSpy).toHaveBeenCalledWith("keydown", expect.any(Function));

      addSpy.mockRestore();
      removeSpy.mockRestore();
    });

    it("handles F6 key events on the document - BLI: EL-339", () => {
      const root = document.createElement("div");
      const btns: HTMLButtonElement[] = [];
      for (let i = 0; i < 2; i++) {
        const g = document.createElement("div");
        g.setAttribute(DATA_ATTR, "true");
        const b = document.createElement("button");
        b.textContent = `Hook${i}`;
        g.appendChild(b);
        root.appendChild(g);
        btns.push(b);
      }
      document.body.appendChild(root);

      render(<F6Host />);
      btns[0].focus();

      act(() => {
        document.dispatchEvent(
          new KeyboardEvent("keydown", { key: "F6", bubbles: true })
        );
      });

      expect(document.activeElement).toBe(btns[1]);
      root.remove();
    });
  });
});
