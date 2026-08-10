import { describe, it, expect } from "vitest";
import { cn, findFirstFocusable } from "./utils";

describe("cn", () => {
  it("merges simple class names - BLI: EL-339", () => {
    expect(cn("px-2", "py-1")).toBe("px-2 py-1");
  });

  it("merges conflicting Tailwind classes (last wins) - BLI: EL-339", () => {
    // tailwind-merge resolves conflicts: px-2 and px-4 => px-4
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("handles conditional classes with falsy values - BLI: EL-339", () => {
    expect(cn("base", false && "hidden", undefined, null, "extra")).toBe(
      "base extra"
    );
  });

  it("handles empty arguments - BLI: EL-339", () => {
    expect(cn()).toBe("");
  });

  it("handles array input (clsx feature) - BLI: EL-339", () => {
    expect(cn(["px-2", "py-1"])).toBe("px-2 py-1");
  });

  it("handles object input for conditional classes - BLI: EL-339", () => {
    expect(cn({ "bg-red-500": true, "bg-blue-500": false })).toBe(
      "bg-red-500"
    );
  });

  it("merges complex conflicting utilities - BLI: EL-339", () => {
    // p-4 sets all padding, px-2 overrides horizontal padding
    const result = cn("p-4", "px-2");
    expect(result).toContain("px-2");
  });

  it("deduplicates identical classes - BLI: EL-339", () => {
    const result = cn("flex", "flex");
    expect(result).toBe("flex");
  });
});

describe("findFirstFocusable", () => {
  it("returns null when container is null - BLI: EL-339", () => {
    expect(findFirstFocusable(null)).toBeNull();
  });

  it("finds a button element - BLI: EL-339", () => {
    const container = document.createElement("div");
    const btn = document.createElement("button");
    btn.textContent = "Click";
    container.appendChild(btn);
    expect(findFirstFocusable(container)).toBe(btn);
  });

  it("finds an input element - BLI: EL-339", () => {
    const container = document.createElement("div");
    const input = document.createElement("input");
    container.appendChild(input);
    expect(findFirstFocusable(container)).toBe(input);
  });

  it("skips disabled buttons - BLI: EL-339", () => {
    const container = document.createElement("div");
    const disabledBtn = document.createElement("button");
    disabledBtn.disabled = true;
    const enabledBtn = document.createElement("button");
    container.appendChild(disabledBtn);
    container.appendChild(enabledBtn);
    expect(findFirstFocusable(container)).toBe(enabledBtn);
  });

  it("finds element with tabindex - BLI: EL-339", () => {
    const container = document.createElement("div");
    const div = document.createElement("div");
    div.setAttribute("tabindex", "0");
    container.appendChild(div);
    expect(findFirstFocusable(container)).toBe(div);
  });

  it("skips elements with tabindex=-1 - BLI: EL-339", () => {
    const container = document.createElement("div");
    const div = document.createElement("div");
    div.setAttribute("tabindex", "-1");
    container.appendChild(div);
    expect(findFirstFocusable(container)).toBeNull();
  });

  it("returns null for empty container - BLI: EL-339", () => {
    const container = document.createElement("div");
    expect(findFirstFocusable(container)).toBeNull();
  });

  it("finds anchor with href - BLI: EL-339", () => {
    const container = document.createElement("div");
    const a = document.createElement("a");
    a.href = "https://example.com";
    container.appendChild(a);
    expect(findFirstFocusable(container)).toBe(a);
  });
});
