import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  findFirstFocusableElement,
  findLastFocusableElement,
  findAllFocusableElements,
  isFocusable,
} from "./focusUtils";

describe("focusUtils", () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  // --- findFirstFocusableElement ---

  describe("findFirstFocusableElement", () => {
    it("returns null for null container - BLI: EL-339", () => {
      expect(findFirstFocusableElement(null)).toBeNull();
    });

    it("returns null when container has no focusable elements - BLI: EL-339", () => {
      container.innerHTML = "<div><span>text</span></div>";
      expect(findFirstFocusableElement(container)).toBeNull();
    });

    it("finds the first button - BLI: EL-339", () => {
      container.innerHTML =
        '<div><span>text</span><button id="btn1">First</button><button id="btn2">Second</button></div>';
      const result = findFirstFocusableElement(container);
      expect(result).not.toBeNull();
      expect(result!.id).toBe("btn1");
    });

    it("finds an input element - BLI: EL-339", () => {
      container.innerHTML = '<div><input id="inp" type="text" /></div>';
      const result = findFirstFocusableElement(container);
      expect(result).not.toBeNull();
      expect(result!.id).toBe("inp");
    });

    it("finds an anchor with href - BLI: EL-339", () => {
      container.innerHTML = '<a id="link" href="#">Link</a>';
      const result = findFirstFocusableElement(container);
      expect(result).not.toBeNull();
      expect(result!.id).toBe("link");
    });

    it("finds element with tabindex=0 - BLI: EL-339", () => {
      container.innerHTML = '<div id="custom" tabindex="0">Custom</div>';
      const result = findFirstFocusableElement(container);
      expect(result).not.toBeNull();
      expect(result!.id).toBe("custom");
    });

    it("skips disabled buttons - BLI: EL-339", () => {
      container.innerHTML =
        '<button disabled id="disabled">No</button><button id="enabled">Yes</button>';
      const result = findFirstFocusableElement(container);
      expect(result).not.toBeNull();
      expect(result!.id).toBe("enabled");
    });

    it("skips elements with tabindex=-1 - BLI: EL-339", () => {
      container.innerHTML =
        '<button tabindex="-1" id="skip">Skip</button><button id="pick">Pick</button>';
      const result = findFirstFocusableElement(container);
      expect(result).not.toBeNull();
      expect(result!.id).toBe("pick");
    });

    it("skips hidden elements (hidden attribute) - BLI: EL-339", () => {
      container.innerHTML =
        '<button hidden id="hidden">Hidden</button><button id="visible">Visible</button>';
      const result = findFirstFocusableElement(container);
      expect(result).not.toBeNull();
      expect(result!.id).toBe("visible");
    });

    it("uses initialFocusId when provided and element exists - BLI: EL-339", () => {
      container.innerHTML =
        '<button id="first">First</button><input id="target" type="text" />';
      const result = findFirstFocusableElement(container, "target");
      expect(result).not.toBeNull();
      expect(result!.id).toBe("target");
    });

    it("falls back to first focusable when initialFocusId element not found - BLI: EL-339", () => {
      container.innerHTML = '<button id="btn">Button</button>';
      const result = findFirstFocusableElement(container, "nonexistent");
      expect(result).not.toBeNull();
      expect(result!.id).toBe("btn");
    });
  });

  // --- findLastFocusableElement ---

  describe("findLastFocusableElement", () => {
    it("returns null for null container - BLI: EL-339", () => {
      expect(findLastFocusableElement(null)).toBeNull();
    });

    it("returns null when container has no focusable elements - BLI: EL-339", () => {
      container.innerHTML = "<p>Just text</p>";
      expect(findLastFocusableElement(container)).toBeNull();
    });

    it("finds the last button - BLI: EL-339", () => {
      container.innerHTML =
        '<button id="first">First</button><button id="last">Last</button>';
      const result = findLastFocusableElement(container);
      expect(result).not.toBeNull();
      expect(result!.id).toBe("last");
    });

    it("finds the last nested focusable element - BLI: EL-339", () => {
      container.innerHTML =
        '<div><button id="a">A</button></div><div><input id="b" type="text" /></div>';
      const result = findLastFocusableElement(container);
      expect(result).not.toBeNull();
      expect(result!.id).toBe("b");
    });
  });

  // --- findAllFocusableElements ---

  describe("findAllFocusableElements", () => {
    it("returns empty array for null container - BLI: EL-339", () => {
      expect(findAllFocusableElements(null)).toEqual([]);
    });

    it("returns empty array when no focusable elements - BLI: EL-339", () => {
      container.innerHTML = "<div><span>text</span></div>";
      expect(findAllFocusableElements(container)).toHaveLength(0);
    });

    it("returns all focusable elements - BLI: EL-339", () => {
      container.innerHTML =
        '<button id="a">A</button><input id="b" /><a id="c" href="#">C</a><select id="d"><option>O</option></select>';
      const result = findAllFocusableElements(container);
      expect(result.length).toBe(4);
    });

    it("excludes disabled elements - BLI: EL-339", () => {
      container.innerHTML =
        '<button id="ok">OK</button><button disabled id="no">No</button>';
      const result = findAllFocusableElements(container);
      expect(result.length).toBe(1);
      expect(result[0].id).toBe("ok");
    });

    it("excludes elements with tabindex=-1 - BLI: EL-339", () => {
      container.innerHTML =
        '<button id="a">A</button><button tabindex="-1" id="b">B</button>';
      const result = findAllFocusableElements(container);
      expect(result.length).toBe(1);
      expect(result[0].id).toBe("a");
    });
  });

  // --- isFocusable ---

  describe("isFocusable", () => {
    it("returns true for a visible button - BLI: EL-339", () => {
      const btn = document.createElement("button");
      btn.textContent = "Click";
      container.appendChild(btn);
      expect(isFocusable(btn)).toBe(true);
    });

    it("returns false for a disabled button - BLI: EL-339", () => {
      const btn = document.createElement("button");
      btn.disabled = true;
      container.appendChild(btn);
      expect(isFocusable(btn)).toBe(false);
    });

    it("returns true for an input element - BLI: EL-339", () => {
      const input = document.createElement("input");
      container.appendChild(input);
      expect(isFocusable(input)).toBe(true);
    });

    it("returns false for a plain div - BLI: EL-339", () => {
      const div = document.createElement("div");
      container.appendChild(div);
      expect(isFocusable(div)).toBe(false);
    });

    it("returns true for a div with tabindex=0 - BLI: EL-339", () => {
      const div = document.createElement("div");
      div.setAttribute("tabindex", "0");
      container.appendChild(div);
      expect(isFocusable(div)).toBe(true);
    });

    it("returns false for a div with tabindex=-1 - BLI: EL-339", () => {
      const div = document.createElement("div");
      div.setAttribute("tabindex", "-1");
      container.appendChild(div);
      expect(isFocusable(div)).toBe(false);
    });

    it("returns false for a hidden element - BLI: EL-339", () => {
      const btn = document.createElement("button");
      btn.hidden = true;
      container.appendChild(btn);
      expect(isFocusable(btn)).toBe(false);
    });

    it("returns true for an anchor with href - BLI: EL-339", () => {
      const a = document.createElement("a");
      a.href = "#";
      container.appendChild(a);
      expect(isFocusable(a)).toBe(true);
    });

    it("returns true for a select element - BLI: EL-339", () => {
      const select = document.createElement("select");
      container.appendChild(select);
      expect(isFocusable(select)).toBe(true);
    });

    it("returns true for a textarea - BLI: EL-339", () => {
      const textarea = document.createElement("textarea");
      container.appendChild(textarea);
      expect(isFocusable(textarea)).toBe(true);
    });
  });
});
