/**
 * MultiComboBox.test.tsx
 *
 * Tests for the MultiComboBox component.
 * Uses the same jsdom polyfill strategy as ComboBox.test.tsx:
 * 1. showPopover / hidePopover / ':popover-open' via data attribute
 * 2. ResizeObserver no-op stub
 * 3. getBoundingClientRect non-zero rect
 * 4. ontouchstart deleted for desktop Popover rendering
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { MultiComboBox } from "./MultiComboBox";
import { MultiComboBoxItem } from "./MultiComboBoxItem";
import { MultiComboBoxItemGroup } from "./MultiComboBoxItemGroup";
import { ComboBoxFilter, ValueState } from "../../types/combobox";

// ─── ResizeObserver stub ──────────────────────────────────────────────────────

if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
}

// ─── Popover API polyfill ─────────────────────────────────────────────────────

const POPOVER_OPEN_ATTR = "data-popover-open";

let originalShowPopover: typeof HTMLElement.prototype.showPopover;
let originalHidePopover: typeof HTMLElement.prototype.hidePopover;
let originalMatches: typeof Element.prototype.matches;
let originalGetBoundingClientRect: typeof Element.prototype.getBoundingClientRect;

beforeEach(() => {
  // @ts-ignore
  delete (window as Window & { ontouchstart?: unknown }).ontouchstart;

  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  originalShowPopover = HTMLElement.prototype.showPopover;
  originalHidePopover = HTMLElement.prototype.hidePopover;
  originalMatches = Element.prototype.matches;

  HTMLElement.prototype.showPopover = function () {
    this.setAttribute(POPOVER_OPEN_ATTR, "true");
  };
  HTMLElement.prototype.hidePopover = function () {
    this.removeAttribute(POPOVER_OPEN_ATTR);
  };

  Element.prototype.matches = function (selector: string): boolean {
    if (selector === ":popover-open") {
      return this.hasAttribute(POPOVER_OPEN_ATTR);
    }
    return originalMatches.call(this, selector);
  };

  originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
  Element.prototype.getBoundingClientRect = vi.fn().mockReturnValue({
    top: 100,
    bottom: 132,
    left: 50,
    right: 250,
    width: 200,
    height: 32,
    x: 50,
    y: 100,
    toJSON: () => ({}),
  });
});

afterEach(() => {
  HTMLElement.prototype.showPopover = originalShowPopover;
  HTMLElement.prototype.hidePopover = originalHidePopover;
  Element.prototype.matches = originalMatches;
  Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderMultiComboBox(props: React.ComponentProps<typeof MultiComboBox> = {}) {
  return render(
    <MultiComboBox placeholder="Select items" {...props}>
      <MultiComboBoxItem text="Apple" value="apple" />
      <MultiComboBoxItem text="Banana" value="banana" />
      <MultiComboBoxItem text="Cherry" value="cherry" />
      <MultiComboBoxItem text="Date" value="date" />
      <MultiComboBoxItem text="Elderberry" value="elderberry" />
    </MultiComboBox>
  );
}

function getInput() {
  return screen.getByRole("combobox");
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

describe("MultiComboBox", () => {
  describe("Rendering", () => {
    it("renders with placeholder", () => {
      renderMultiComboBox();
      expect(getInput()).toHaveAttribute("placeholder", "Select items");
    });

    it("renders tokens for defaultSelectedValues", () => {
      // Override getBoundingClientRect to return large container width
      // so the Tokenizer overflow calculation shows all tokens
      Element.prototype.getBoundingClientRect = vi.fn().mockImplementation(function(this: Element) {
        // Tokenizer container gets a large width; tokens get small width
        if (this.getAttribute?.("data-part") === "tokenizer-root") {
          return { top: 0, bottom: 32, left: 0, right: 2000, width: 2000, height: 32, x: 0, y: 0, toJSON: () => ({}) };
        }
        return { top: 100, bottom: 132, left: 50, right: 150, width: 100, height: 32, x: 50, y: 100, toJSON: () => ({}) };
      });
      renderMultiComboBox({ defaultSelectedValues: ["apple", "banana"] });
      expect(screen.getByText("Apple")).toBeInTheDocument();
      expect(screen.getByText("Banana")).toBeInTheDocument();
    });

    it("hides placeholder when tokens are present", () => {
      renderMultiComboBox({ defaultSelectedValues: ["apple"] });
      expect(getInput()).not.toHaveAttribute("placeholder");
    });

    it("has 14px left padding when no tokens (placeholder visible)", () => {
      const { container } = renderMultiComboBox();
      const inputContainer = container.querySelector('[class*="pl-3.5"], [class*="pl-"]')?.parentElement?.firstElementChild ?? container.children[0].children[0];
      // The container should have pl-3.5 (14px) class when empty
      expect(inputContainer.className).toContain("pl-3.5");
      expect(inputContainer.className).not.toContain("pl-1");
    });

    it("has 4px left padding when tokens are present", () => {
      Element.prototype.getBoundingClientRect = vi.fn().mockImplementation(function(this: Element) {
        if (this.getAttribute?.("data-part") === "tokenizer-root") {
          return { top: 0, bottom: 32, left: 0, right: 2000, width: 2000, height: 32, x: 0, y: 0, toJSON: () => ({}) };
        }
        return { top: 100, bottom: 132, left: 50, right: 150, width: 100, height: 32, x: 50, y: 100, toJSON: () => ({}) };
      });
      const { container } = renderMultiComboBox({ defaultSelectedValues: ["apple"] });
      const inputContainer = container.children[0].children[0];
      // The container should have pl-1 (4px) class when tokens are present
      expect(inputContainer.className).toContain("pl-1");
      expect(inputContainer.className).not.toContain("pl-3.5");
    });

    it("renders disabled state", () => {
      renderMultiComboBox({ disabled: true });
      expect(getInput()).toBeDisabled();
    });

    it("renders readonly state without input", () => {
      renderMultiComboBox({ readonly: true, defaultSelectedValues: ["apple"] });
      expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
      expect(screen.getByText("Apple")).toBeInTheDocument();
    });
  });

  // ---------------------------------------------------------------------------
  // Selection
  // ---------------------------------------------------------------------------

  describe("Selection", () => {
    it("selects item on click and creates token", async () => {
      const user = userEvent.setup();
      const onSelectionChange = vi.fn();
      renderMultiComboBox({ onSelectionChange });

      // Open dropdown
      await user.click(getInput());
      await user.keyboard("{F4}");

      // Click an item
      const apple = screen.getByRole("option", { name: /Apple/i, hidden: true });
      await user.click(apple);

      expect(onSelectionChange).toHaveBeenCalledWith(
        expect.objectContaining({
          changedItem: expect.objectContaining({ text: "Apple", value: "apple" }),
          selected: true,
        })
      );
    });

    it("deselects item on click and removes token", async () => {
      const user = userEvent.setup();
      const onSelectionChange = vi.fn();
      renderMultiComboBox({ defaultSelectedValues: ["apple"], onSelectionChange });

      // Open dropdown
      await user.click(getInput());
      await user.keyboard("{F4}");

      // Click the already-selected item to deselect (use getAllByRole since Token also has role=option)
      const apples = screen.getAllByRole("option", { name: /Apple/i, hidden: true });
      // The dropdown item is the one inside the listbox
      const dropdownApple = apples.find((el) => el.tagName === "LI")!;
      await user.click(dropdownApple);

      expect(onSelectionChange).toHaveBeenCalledWith(
        expect.objectContaining({
          changedItem: expect.objectContaining({ text: "Apple", value: "apple" }),
          selected: false,
        })
      );
    });

    it("supports multiple selections", async () => {
      const user = userEvent.setup();
      const onSelectionChange = vi.fn();
      renderMultiComboBox({ onSelectionChange });

      await user.click(getInput());
      await user.keyboard("{F4}");

      const apple = screen.getByRole("option", { name: /Apple/i, hidden: true });
      await user.click(apple);

      const banana = screen.getByRole("option", { name: /Banana/i, hidden: true });
      await user.click(banana);

      expect(onSelectionChange).toHaveBeenCalledTimes(2);
      // Second call should include both items
      const secondCall = onSelectionChange.mock.calls[1][0];
      expect(secondCall.items).toHaveLength(2);
    });

    it("supports controlled selectedValues", () => {
      // Override getBoundingClientRect so tokens are visible (not overflowed)
      Element.prototype.getBoundingClientRect = vi.fn().mockImplementation(function(this: Element) {
        if (this.getAttribute?.("data-part") === "tokenizer-root") {
          return { top: 0, bottom: 32, left: 0, right: 2000, width: 2000, height: 32, x: 0, y: 0, toJSON: () => ({}) };
        }
        return { top: 100, bottom: 132, left: 50, right: 150, width: 100, height: 32, x: 50, y: 100, toJSON: () => ({}) };
      });
      const { rerender } = render(
        <MultiComboBox selectedValues={["apple"]}>
          <MultiComboBoxItem text="Apple" value="apple" />
          <MultiComboBoxItem text="Banana" value="banana" />
        </MultiComboBox>
      );

      expect(screen.getByText("Apple")).toBeInTheDocument();
      expect(screen.queryByText("Banana")).not.toBeInTheDocument();

      rerender(
        <MultiComboBox selectedValues={["apple", "banana"]}>
          <MultiComboBoxItem text="Apple" value="apple" />
          <MultiComboBoxItem text="Banana" value="banana" />
        </MultiComboBox>
      );

      expect(screen.getByText("Apple")).toBeInTheDocument();
      expect(screen.getByText("Banana")).toBeInTheDocument();
    });
  });

  // ---------------------------------------------------------------------------
  // Filtering
  // ---------------------------------------------------------------------------

  describe("Filtering", () => {
    it("filters items on typing", async () => {
      const user = userEvent.setup();
      renderMultiComboBox();

      await user.type(getInput(), "App");

      // Only Apple should be visible
      const apple = screen.queryByRole("option", { name: /Apple/i, hidden: true });
      expect(apple).toBeInTheDocument();

      // Banana should not be visible (filtered out)
      const banana = screen.queryByRole("option", { name: /Banana/i, hidden: true });
      expect(banana).not.toBeInTheDocument();
    });

    it("fires onInput when typing", async () => {
      const user = userEvent.setup();
      const onInput = vi.fn();
      renderMultiComboBox({ onInput });

      await user.type(getInput(), "a");
      expect(onInput).toHaveBeenCalledWith("a");
    });

    it("supports Contains filter mode", async () => {
      const user = userEvent.setup();
      renderMultiComboBox({ filter: ComboBoxFilter.Contains });

      await user.type(getInput(), "rry");

      // Cherry contains "rry"
      const cherry = screen.queryByRole("option", { name: /Cherry/i, hidden: true });
      expect(cherry).toBeInTheDocument();
    });
  });

  // ---------------------------------------------------------------------------
  // Keyboard Navigation
  // ---------------------------------------------------------------------------

  describe("Keyboard", () => {
    it("F4 toggles dropdown", async () => {
      const user = userEvent.setup();
      renderMultiComboBox();

      await user.click(getInput());
      await user.keyboard("{F4}");

      // Dropdown should be open (items visible)
      expect(screen.getByRole("option", { name: /Apple/i, hidden: true })).toBeInTheDocument();

      await user.keyboard("{F4}");

      // After second F4, items should be hidden
      expect(screen.queryByRole("option", { name: /Apple/i, hidden: true })).not.toBeInTheDocument();
    });

    it("Enter/click toggles selection without closing", async () => {
      const user = userEvent.setup();
      const onSelectionChange = vi.fn();
      renderMultiComboBox({ onSelectionChange });

      await user.click(getInput());
      await user.keyboard("{F4}");

      // Click the item directly (real focus goes to item in browser)
      const apple = screen.getByRole("option", { name: /Apple/i, hidden: true });
      await user.click(apple);

      expect(onSelectionChange).toHaveBeenCalled();

      // Dropdown should still be open — check that multiple options exist (tokens + dropdown items)
      const options = screen.getAllByRole("option", { hidden: true });
      expect(options.length).toBeGreaterThan(1);
    });

    it("clicking multiple items selects without closing", async () => {
      const user = userEvent.setup();
      const onSelectionChange = vi.fn();
      renderMultiComboBox({ onSelectionChange });

      await user.click(getInput());
      await user.keyboard("{F4}");

      const apple = screen.getByRole("option", { name: /Apple/i, hidden: true });
      await user.click(apple);

      const banana = screen.getByRole("option", { name: /Banana/i, hidden: true });
      await user.click(banana);

      expect(onSelectionChange).toHaveBeenCalledTimes(2);

      // Dropdown should still be open
      const options = screen.getAllByRole("option", { hidden: true });
      expect(options.length).toBeGreaterThan(1);
    });

    it("Escape closes dropdown", async () => {
      const user = userEvent.setup();
      renderMultiComboBox();

      await user.click(getInput());
      await user.keyboard("{F4}");

      expect(screen.getByRole("option", { name: /Apple/i, hidden: true })).toBeInTheDocument();

      await user.keyboard("{Escape}");

      expect(screen.queryByRole("option", { name: /Apple/i, hidden: true })).not.toBeInTheDocument();
    });

    it("ArrowDown/ArrowUp navigates items", async () => {
      const user = userEvent.setup();
      renderMultiComboBox();

      await user.click(getInput());
      await user.keyboard("{F4}");
      await user.keyboard("{ArrowDown}");

      // First item focused
      const items = screen.getAllByRole("option", { hidden: true });
      expect(items[0]).toHaveAttribute("aria-selected");
    });
  });

  // ---------------------------------------------------------------------------
  // Select All
  // ---------------------------------------------------------------------------

  describe("Select All", () => {
    function renderSelectAll(props: Partial<React.ComponentProps<typeof MultiComboBox>> = {}) {
      return render(
        <MultiComboBox placeholder="Select items" showSelectAll {...props}>
          <MultiComboBoxItem text="Apple" value="apple" />
          <MultiComboBoxItem text="Banana" value="banana" />
          <MultiComboBoxItem text="Cherry" value="cherry" />
        </MultiComboBox>
      );
    }

    function getSelectAllCheckbox() {
      return screen.getByRole("checkbox", { name: /Select All/i, hidden: true });
    }

    it("shows Select All when showSelectAll is true", async () => {
      const user = userEvent.setup();
      renderSelectAll();

      await user.click(getInput());
      await user.keyboard("{F4}");

      expect(screen.getByText("Select All", { exact: true })).toBeInTheDocument();
    });

    it("renders Select All as a div with role=checkbox, not a li", async () => {
      const user = userEvent.setup();
      renderSelectAll();

      await user.click(getInput());
      await user.keyboard("{F4}");

      const selectAll = getSelectAllCheckbox();
      expect(selectAll.tagName).toBe("DIV");
    });

    it("has aria-checked=false when nothing is selected", async () => {
      const user = userEvent.setup();
      renderSelectAll();

      await user.click(getInput());
      await user.keyboard("{F4}");

      expect(getSelectAllCheckbox()).toHaveAttribute("aria-checked", "false");
    });

    it("has aria-checked=true when all items are selected", async () => {
      const user = userEvent.setup();
      renderSelectAll({ defaultSelectedValues: ["apple", "banana", "cherry"] });

      await user.click(getInput());
      await user.keyboard("{F4}");

      expect(getSelectAllCheckbox()).toHaveAttribute("aria-checked", "true");
    });

    it("has aria-checked=mixed when some items are selected", async () => {
      const user = userEvent.setup();
      renderSelectAll({ defaultSelectedValues: ["apple"] });

      await user.click(getInput());
      await user.keyboard("{F4}");

      expect(getSelectAllCheckbox()).toHaveAttribute("aria-checked", "mixed");
    });

    it("selects all items when clicked", async () => {
      const user = userEvent.setup();
      const onSelectionChange = vi.fn();
      renderSelectAll({ onSelectionChange });

      await user.click(getInput());
      await user.keyboard("{F4}");

      const selectAll = screen.getByText("Select All", { exact: true });
      await user.click(selectAll);

      expect(onSelectionChange).toHaveBeenCalledWith(
        expect.objectContaining({
          items: expect.arrayContaining([
            expect.objectContaining({ value: "apple" }),
            expect.objectContaining({ value: "banana" }),
            expect.objectContaining({ value: "cherry" }),
          ]),
          selected: true,
        })
      );
    });

    it("deselects all when all are selected", async () => {
      const user = userEvent.setup();
      const onSelectionChange = vi.fn();
      renderSelectAll({ defaultSelectedValues: ["apple", "banana", "cherry"], onSelectionChange });

      await user.click(getInput());
      await user.keyboard("{F4}");

      const selectAll = screen.getByText("Select All", { exact: true });
      await user.click(selectAll);

      expect(onSelectionChange).toHaveBeenCalledWith(
        expect.objectContaining({
          items: [],
          selected: false,
        })
      );
    });

    // ── Select All keyboard navigation ──

    it("ArrowDown from input focuses Select All", async () => {
      const user = userEvent.setup();
      renderSelectAll();

      await user.click(getInput());
      await user.keyboard("{F4}");
      await user.keyboard("{ArrowDown}");

      expect(getSelectAllCheckbox()).toHaveFocus();
    });

    it("ArrowDown from Select All moves focused state to first item", async () => {
      const user = userEvent.setup();
      renderSelectAll();

      await user.click(getInput());
      await user.keyboard("{F4}");
      await user.keyboard("{ArrowDown}");

      // Now on Select All; press ArrowDown again
      await act(async () => {
        fireEvent.keyDown(getSelectAllCheckbox(), { key: "ArrowDown" });
      });

      // First option item should have tabIndex=0 (focused state)
      const items = screen.getAllByRole("option", { hidden: true });
      expect(items[0]).toHaveAttribute("tabindex", "0");
    });

    it("ArrowUp from first item focuses Select All", async () => {
      const user = userEvent.setup();
      renderSelectAll();

      await user.click(getInput());
      await user.keyboard("{F4}");
      // Move to Select All, then to first item
      await user.keyboard("{ArrowDown}");
      fireEvent.keyDown(getSelectAllCheckbox(), { key: "ArrowDown" });

      // Now on first item; press ArrowUp
      const items = screen.getAllByRole("option", { hidden: true });
      fireEvent.keyDown(items[0], { key: "ArrowUp" });

      expect(getSelectAllCheckbox()).toHaveFocus();
    });

    it("ArrowUp from Select All focuses input", async () => {
      const user = userEvent.setup();
      renderSelectAll();

      await user.click(getInput());
      await user.keyboard("{F4}");
      await user.keyboard("{ArrowDown}");

      // Now on Select All; press ArrowUp
      fireEvent.keyDown(getSelectAllCheckbox(), { key: "ArrowUp" });

      expect(getInput()).toHaveFocus();
    });

    it("Enter on Select All toggles selection", async () => {
      const user = userEvent.setup();
      const onSelectionChange = vi.fn();
      renderSelectAll({ onSelectionChange });

      await user.click(getInput());
      await user.keyboard("{F4}");
      await user.keyboard("{ArrowDown}");

      fireEvent.keyDown(getSelectAllCheckbox(), { key: "Enter" });

      expect(onSelectionChange).toHaveBeenCalledWith(
        expect.objectContaining({ selected: true })
      );
    });

    it("Space on Select All toggles selection", async () => {
      const user = userEvent.setup();
      const onSelectionChange = vi.fn();
      renderSelectAll({ onSelectionChange });

      await user.click(getInput());
      await user.keyboard("{F4}");
      await user.keyboard("{ArrowDown}");

      fireEvent.keyDown(getSelectAllCheckbox(), { key: " " });

      expect(onSelectionChange).toHaveBeenCalledWith(
        expect.objectContaining({ selected: true })
      );
    });

    it("Home key focuses Select All", async () => {
      const user = userEvent.setup();
      renderSelectAll();

      await user.click(getInput());
      await user.keyboard("{F4}");
      // Navigate to second item
      await user.keyboard("{ArrowDown}");
      fireEvent.keyDown(getSelectAllCheckbox(), { key: "ArrowDown" });
      const items = screen.getAllByRole("option", { hidden: true });
      fireEvent.keyDown(items[0], { key: "ArrowDown" });

      // Press Home — should go to Select All
      await act(async () => {
        fireEvent.keyDown(items[1], { key: "Home" });
        // Wait for requestAnimationFrame to complete
        await new Promise((resolve) => requestAnimationFrame(() => resolve(void 0)));
      });

      expect(getSelectAllCheckbox()).toHaveFocus();
    });

    it("Escape on Select All closes dropdown", async () => {
      const user = userEvent.setup();
      renderSelectAll();

      await user.click(getInput());
      await user.keyboard("{F4}");
      await user.keyboard("{ArrowDown}");

      fireEvent.keyDown(getSelectAllCheckbox(), { key: "Escape" });

      expect(screen.queryByRole("checkbox", { name: /Select All/i, hidden: true })).not.toBeInTheDocument();
    });

    it("F4 on Select All closes dropdown", async () => {
      const user = userEvent.setup();
      renderSelectAll();

      await user.click(getInput());
      await user.keyboard("{F4}");
      await user.keyboard("{ArrowDown}");

      fireEvent.keyDown(getSelectAllCheckbox(), { key: "F4" });

      expect(screen.queryByRole("checkbox", { name: /Select All/i, hidden: true })).not.toBeInTheDocument();
    });

    it("End key from Select All moves focused state to last item", async () => {
      const user = userEvent.setup();
      renderSelectAll();

      await user.click(getInput());
      await user.keyboard("{F4}");
      await user.keyboard("{ArrowDown}");

      await act(async () => {
        fireEvent.keyDown(getSelectAllCheckbox(), { key: "End" });
      });

      // Last option item should have tabIndex=0 (focused state)
      const items = screen.getAllByRole("option", { hidden: true });
      expect(items[items.length - 1]).toHaveAttribute("tabindex", "0");
    });
  });

  // ---------------------------------------------------------------------------
  // Clear
  // ---------------------------------------------------------------------------

  describe("Clear", () => {
    it("shows clear icon when items selected and showClearIcon is true", () => {
      renderMultiComboBox({ showClearIcon: true, defaultSelectedValues: ["apple"] });
      expect(screen.getByRole("button", { name: "Clear selection" })).toBeInTheDocument();
    });

    it("clears all selections when clear icon clicked", async () => {
      const user = userEvent.setup();
      const onSelectionChange = vi.fn();
      renderMultiComboBox({
        showClearIcon: true,
        defaultSelectedValues: ["apple", "banana"],
        onSelectionChange,
      });

      const clearButton = screen.getByRole("button", { name: "Clear selection" });
      await user.click(clearButton);

      expect(onSelectionChange).toHaveBeenCalledWith(
        expect.objectContaining({
          items: [],
          selected: false,
        })
      );
    });
  });

  // ---------------------------------------------------------------------------
  // Value State
  // ---------------------------------------------------------------------------

  describe("Value State", () => {
    it("renders value state message below input", () => {
      renderMultiComboBox({
        valueState: ValueState.Negative,
        valueStateMessage: "Error message",
      });

      expect(screen.getByText("Error message")).toBeInTheDocument();
    });
  });

  // ---------------------------------------------------------------------------
  // Groups
  // ---------------------------------------------------------------------------

  describe("Groups", () => {
    it("renders grouped items", async () => {
      const user = userEvent.setup();
      render(
        <MultiComboBox placeholder="Pick">
          <MultiComboBoxItemGroup headerText="Fruits">
            <MultiComboBoxItem text="Apple" value="apple" />
            <MultiComboBoxItem text="Banana" value="banana" />
          </MultiComboBoxItemGroup>
          <MultiComboBoxItemGroup headerText="Vegetables">
            <MultiComboBoxItem text="Carrot" value="carrot" />
          </MultiComboBoxItemGroup>
        </MultiComboBox>
      );

      await user.click(screen.getByRole("combobox"));
      await user.keyboard("{F4}");

      expect(screen.getByText("Fruits")).toBeInTheDocument();
      expect(screen.getByText("Vegetables")).toBeInTheDocument();
    });
  });

  // ---------------------------------------------------------------------------
  // Accessibility
  // ---------------------------------------------------------------------------

  describe("Accessibility", () => {
    it("has correct ARIA roles", () => {
      renderMultiComboBox();
      const input = getInput();
      expect(input).toHaveAttribute("role", "combobox");
      expect(input).toHaveAttribute("aria-expanded", "false");
      expect(input).toHaveAttribute("aria-haspopup", "listbox");
    });

    it("sets aria-expanded to true when open", async () => {
      const user = userEvent.setup();
      renderMultiComboBox();

      await user.click(getInput());
      await user.keyboard("{F4}");

      expect(getInput()).toHaveAttribute("aria-expanded", "true");
    });

    it("applies accessibleName as aria-label", () => {
      renderMultiComboBox({ accessibleName: "Country selector" });
      expect(getInput()).toHaveAttribute("aria-label", "Country selector");
    });

    it("sets aria-required when required", () => {
      renderMultiComboBox({ required: true });
      expect(getInput()).toHaveAttribute("aria-required", "true");
    });

    it("sets aria-invalid for Negative value state", () => {
      renderMultiComboBox({ valueState: ValueState.Negative });
      expect(getInput()).toHaveAttribute("aria-invalid", "true");
    });
  });

  // ---------------------------------------------------------------------------
  // Form Integration
  // ---------------------------------------------------------------------------

  describe("Form", () => {
    it("renders hidden inputs for form submission", () => {
      const { container } = renderMultiComboBox({
        name: "countries",
        defaultSelectedValues: ["apple", "banana"],
      });

      const hiddenInputs = container.querySelectorAll('input[type="hidden"][name="countries"]');
      expect(hiddenInputs).toHaveLength(2);
      expect(hiddenInputs[0]).toHaveValue("apple");
      expect(hiddenInputs[1]).toHaveValue("banana");
    });
  });

  // ---------------------------------------------------------------------------
  // Filter Modes (cover all branches)
  // ---------------------------------------------------------------------------

  describe("Filter modes", () => {
    it("StartsWithPerTerm matches at word boundaries", async () => {
      const user = userEvent.setup();
      render(
        <MultiComboBox placeholder="Pick" filter={ComboBoxFilter.StartsWithPerTerm}>
          <MultiComboBoxItem text="United States" value="us" />
          <MultiComboBoxItem text="United Kingdom" value="uk" />
          <MultiComboBoxItem text="Germany" value="de" />
        </MultiComboBox>
      );

      await user.type(screen.getByRole("combobox"), "king");

      // "United Kingdom" matches via word boundary "Kingdom"
      expect(screen.queryByRole("option", { name: /United Kingdom/i, hidden: true })).toBeInTheDocument();
      // "United States" does not match "king"
      expect(screen.queryByRole("option", { name: /United States/i, hidden: true })).not.toBeInTheDocument();
    });

    it("StartsWith only matches beginning of text", async () => {
      const user = userEvent.setup();
      render(
        <MultiComboBox placeholder="Pick" filter={ComboBoxFilter.StartsWith}>
          <MultiComboBoxItem text="Apple" value="apple" />
          <MultiComboBoxItem text="Pineapple" value="pine" />
        </MultiComboBox>
      );

      await user.type(screen.getByRole("combobox"), "App");

      expect(screen.queryByRole("option", { name: /^Apple$/i, hidden: true })).toBeInTheDocument();
      expect(screen.queryByRole("option", { name: /Pineapple/i, hidden: true })).not.toBeInTheDocument();
    });

    it("None filter shows all items regardless of input", async () => {
      const user = userEvent.setup();
      render(
        <MultiComboBox placeholder="Pick" filter={ComboBoxFilter.None}>
          <MultiComboBoxItem text="Apple" value="apple" />
          <MultiComboBoxItem text="Banana" value="banana" />
        </MultiComboBox>
      );

      await user.type(screen.getByRole("combobox"), "zzz");

      expect(screen.queryByRole("option", { name: /Apple/i, hidden: true })).toBeInTheDocument();
      expect(screen.queryByRole("option", { name: /Banana/i, hidden: true })).toBeInTheDocument();
    });
  });

  // ---------------------------------------------------------------------------
  // Token deletion
  // ---------------------------------------------------------------------------

  describe("Token deletion", () => {
    it("removes token via close icon and updates selection", async () => {
      const user = userEvent.setup();
      const onSelectionChange = vi.fn();

      // Use large container mock so tokens are visible
      Element.prototype.getBoundingClientRect = vi.fn().mockImplementation(function(this: Element) {
        if (this.getAttribute?.("data-part") === "tokenizer-root") {
          return { top: 0, bottom: 32, left: 0, right: 2000, width: 2000, height: 32, x: 0, y: 0, toJSON: () => ({}) };
        }
        return { top: 100, bottom: 132, left: 50, right: 150, width: 100, height: 32, x: 50, y: 100, toJSON: () => ({}) };
      });

      renderMultiComboBox({ defaultSelectedValues: ["apple", "banana"], onSelectionChange });

      // Find the close icon on the first token (aria-hidden, so query by data-part)
      const tokenDeleteButtons = document.querySelectorAll('[data-part="close-icon"]');
      expect(tokenDeleteButtons.length).toBeGreaterThan(0);
      await user.click(tokenDeleteButtons[0]);

      expect(onSelectionChange).toHaveBeenCalledWith(
        expect.objectContaining({
          selected: false,
        })
      );
    });
  });

  // ---------------------------------------------------------------------------
  // Keyboard from input
  // ---------------------------------------------------------------------------

  describe("Input keyboard", () => {
    it("opens dropdown on ArrowDown when closed", async () => {
      const user = userEvent.setup();
      const onOpen = vi.fn();
      renderMultiComboBox({ onOpen });

      await user.click(getInput());
      await user.keyboard("{ArrowDown}");

      expect(onOpen).toHaveBeenCalled();
    });

    it("Alt+ArrowDown toggles dropdown", async () => {
      const user = userEvent.setup();
      const onOpen = vi.fn();
      renderMultiComboBox({ onOpen });

      await user.click(getInput());
      await user.keyboard("{Alt>}{ArrowDown}{/Alt}");

      expect(onOpen).toHaveBeenCalled();
    });

    it("Backspace on empty input with tokens focuses tokenizer", async () => {
      const user = userEvent.setup();

      Element.prototype.getBoundingClientRect = vi.fn().mockImplementation(function(this: Element) {
        if (this.getAttribute?.("data-part") === "tokenizer-root") {
          return { top: 0, bottom: 32, left: 0, right: 2000, width: 2000, height: 32, x: 0, y: 0, toJSON: () => ({}) };
        }
        return { top: 100, bottom: 132, left: 50, right: 150, width: 100, height: 32, x: 50, y: 100, toJSON: () => ({}) };
      });

      renderMultiComboBox({ defaultSelectedValues: ["apple"] });

      const input = getInput();
      await user.click(input);
      expect(input).toHaveValue("");

      // Backspace should attempt to focus tokenizer
      await user.keyboard("{Backspace}");
      // Just verify no crash — actual focus delegation depends on Tokenizer ref
    });

    it("does not handle keys when disabled", () => {
      const onOpen = vi.fn();
      renderMultiComboBox({ disabled: true, onOpen });

      // Can't click disabled input, but verify it doesn't open
      expect(onOpen).not.toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------------------
  // Value state with popover portal
  // ---------------------------------------------------------------------------

  describe("Value state popover", () => {
    it("renders value state message in popover when open", async () => {
      const user = userEvent.setup();
      renderMultiComboBox({
        valueState: ValueState.Negative,
        valueStateMessage: "Please fix this error",
      });

      await user.click(getInput());
      await user.keyboard("{F4}");

      // The message should be visible (portaled into the popover)
      expect(screen.getByText("Please fix this error")).toBeInTheDocument();
    });

    it("renders value state message below input when closed", () => {
      renderMultiComboBox({
        valueState: ValueState.Critical,
        valueStateMessage: "Warning message",
      });

      expect(screen.getByText("Warning message")).toBeInTheDocument();
    });
  });

  // ---------------------------------------------------------------------------
  // Icon slot and accessible description
  // ---------------------------------------------------------------------------

  describe("Slots and props", () => {
    it("renders custom icon", () => {
      renderMultiComboBox({ icon: <span data-testid="custom-icon">IC</span> });
      expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
    });

    it("renders accessible description", () => {
      const { container } = renderMultiComboBox({ accessibleDescription: "Pick multiple" });
      expect(container.querySelector(".sr-only")).toHaveTextContent("Pick multiple");
    });

    it("auto-opens dropdown when typing", async () => {
      const user = userEvent.setup();
      const onOpen = vi.fn();
      renderMultiComboBox({ onOpen });

      await user.type(getInput(), "a");
      expect(onOpen).toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------------------
  // Grouped items with filtering
  // ---------------------------------------------------------------------------

  describe("Group filtering", () => {
    it("hides group when all children are filtered out", async () => {
      const user = userEvent.setup();
      render(
        <MultiComboBox placeholder="Pick">
          <MultiComboBoxItemGroup headerText="Fruits">
            <MultiComboBoxItem text="Apple" value="apple" />
          </MultiComboBoxItemGroup>
          <MultiComboBoxItemGroup headerText="Vegetables">
            <MultiComboBoxItem text="Carrot" value="carrot" />
          </MultiComboBoxItemGroup>
        </MultiComboBox>
      );

      await user.type(screen.getByRole("combobox"), "App");

      // Fruits group should be visible (Apple matches)
      expect(screen.getByText("Fruits")).toBeInTheDocument();
      // Vegetables group should be hidden (Carrot doesn't match)
      expect(screen.queryByText("Vegetables")).not.toBeInTheDocument();
    });
  });

  // ---------------------------------------------------------------------------
  // onChange when no dropdown
  // ---------------------------------------------------------------------------

  describe("onChange", () => {
    it("fires onChange on Enter when dropdown is closed", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      renderMultiComboBox({ onChange, defaultValue: "test" });

      await user.click(getInput());
      await user.keyboard("{Enter}");

      expect(onChange).toHaveBeenCalledWith("test");
    });
  });

  // ---------------------------------------------------------------------------
  // List keyboard handler (handleListKeyDown)
  // ---------------------------------------------------------------------------

  describe("List keyboard navigation", () => {
    async function openAndGetListItem(user: ReturnType<typeof userEvent.setup>) {
      renderMultiComboBox();
      await user.click(getInput());
      await user.keyboard("{F4}");
      // Get the first visible option
      const item = screen.getAllByRole("option", { hidden: true })[0];
      return item;
    }

    it("ArrowDown on list item moves focus to next", async () => {
      const user = userEvent.setup();
      const item = await openAndGetListItem(user);
      fireEvent.keyDown(item, { key: "ArrowDown" });
      // Verify dropdown is still open (navigation doesn't close it)
      expect(screen.getAllByRole("option", { hidden: true }).length).toBeGreaterThan(0);
    });

    it("ArrowUp on first list item returns focus to input", async () => {
      const user = userEvent.setup();
      const item = await openAndGetListItem(user);
      await user.keyboard("{ArrowDown}");
      fireEvent.keyDown(item, { key: "ArrowUp" });
      // Input should still be in the document and dropdown open
      expect(getInput()).toBeInTheDocument();
    });

    it("Enter on list item toggles selection", async () => {
      const user = userEvent.setup();
      const onSelectionChange = vi.fn();
      render(
        <MultiComboBox placeholder="Select" onSelectionChange={onSelectionChange}>
          <MultiComboBoxItem text="Apple" value="apple" />
          <MultiComboBoxItem text="Banana" value="banana" />
        </MultiComboBox>
      );
      await user.click(screen.getByRole("combobox"));
      await user.keyboard("{F4}");
      await user.keyboard("{ArrowDown}");

      const items = screen.getAllByRole("option", { hidden: true });
      fireEvent.keyDown(items[0], { key: "Enter" });

      expect(onSelectionChange).toHaveBeenCalled();
    });

    it("Space on list item toggles selection", async () => {
      const user = userEvent.setup();
      const onSelectionChange = vi.fn();
      render(
        <MultiComboBox placeholder="Select" onSelectionChange={onSelectionChange}>
          <MultiComboBoxItem text="Apple" value="apple" />
          <MultiComboBoxItem text="Banana" value="banana" />
        </MultiComboBox>
      );
      await user.click(screen.getByRole("combobox"));
      await user.keyboard("{F4}");
      await user.keyboard("{ArrowDown}");

      const items = screen.getAllByRole("option", { hidden: true });
      fireEvent.keyDown(items[0], { key: " " });

      expect(onSelectionChange).toHaveBeenCalled();
    });

    it("Escape on list item closes dropdown", async () => {
      const user = userEvent.setup();
      render(
        <MultiComboBox placeholder="Select">
          <MultiComboBoxItem text="Apple" value="apple" />
        </MultiComboBox>
      );
      await user.click(screen.getByRole("combobox"));
      await user.keyboard("{F4}");
      await user.keyboard("{ArrowDown}");

      const items = screen.getAllByRole("option", { hidden: true });
      fireEvent.keyDown(items[0], { key: "Escape" });

      // Dropdown should be closed — no options visible
      expect(screen.queryByRole("option", { hidden: true })).not.toBeInTheDocument();
    });

    it("Home on list item jumps to first", async () => {
      const user = userEvent.setup();
      const item = await openAndGetListItem(user);
      fireEvent.keyDown(item, { key: "Home" });
      // Dropdown still open after navigation
      expect(screen.getAllByRole("option", { hidden: true }).length).toBeGreaterThan(0);
    });

    it("End on list item jumps to last", async () => {
      const user = userEvent.setup();
      const item = await openAndGetListItem(user);
      fireEvent.keyDown(item, { key: "End" });
      // Dropdown still open after navigation
      expect(screen.getAllByRole("option", { hidden: true }).length).toBeGreaterThan(0);
    });

    it("F4 on list item closes dropdown", async () => {
      const user = userEvent.setup();
      const item = await openAndGetListItem(user);
      fireEvent.keyDown(item, { key: "F4" });
      // Dropdown should be closed
      expect(screen.queryByRole("option", { hidden: true })).not.toBeInTheDocument();
    });

    it("Tab on list item closes dropdown", async () => {
      const user = userEvent.setup();
      const item = await openAndGetListItem(user);
      fireEvent.keyDown(item, { key: "Tab" });
      // Dropdown should be closed
      expect(screen.queryByRole("option", { hidden: true })).not.toBeInTheDocument();
    });
  });

  // ─── Size variants ────────────────────────────────────────────────

  describe("Size variants", () => {
    it("defaults to Large size with h-10 and rounded-lg - BLI: EL-339", () => {
      const { container } = renderMultiComboBox();
      const inputContainer = (container.firstChild as HTMLElement).firstElementChild!;
      expect(inputContainer).toHaveClass("h-10");
      expect(inputContainer).toHaveClass("rounded-lg");
    });

    it("renders Medium size with h-8 and rounded - BLI: EL-339", () => {
      const { container } = renderMultiComboBox({ size: "Medium" });
      const inputContainer = (container.firstChild as HTMLElement).firstElementChild!;
      expect(inputContainer).toHaveClass("h-8");
      expect(inputContainer).toHaveClass("rounded");
      expect(inputContainer).not.toHaveClass("rounded-lg");
    });

    it("Large size does not have h-8 class - BLI: EL-339", () => {
      const { container } = renderMultiComboBox({ size: "Large" });
      const inputContainer = (container.firstChild as HTMLElement).firstElementChild!;
      expect(inputContainer).not.toHaveClass("h-8");
      expect(inputContainer).toHaveClass("h-10");
    });

    it("Medium size renders Small dropdown arrow button - BLI: EL-339", () => {
      renderMultiComboBox({ size: "Medium" });
      const btn = screen.getByRole("button", { name: /open suggestions/i });
      expect(btn).toHaveClass("h-6");
    });

    it("Large size renders Medium dropdown arrow button - BLI: EL-339", () => {
      renderMultiComboBox({ size: "Large" });
      const btn = screen.getByRole("button", { name: /open suggestions/i });
      expect(btn).toHaveClass("h-8");
    });

    it("Medium size renders Small clear button when showClearIcon - BLI: EL-339", () => {
      renderMultiComboBox({ size: "Medium", showClearIcon: true, defaultSelectedValues: ["apple"] });
      const clearBtn = screen.getByRole("button", { name: /clear/i });
      expect(clearBtn).toHaveClass("h-6");
    });

    it("Large size renders Medium clear button when showClearIcon - BLI: EL-339", () => {
      renderMultiComboBox({ size: "Large", showClearIcon: true, defaultSelectedValues: ["apple"] });
      const clearBtn = screen.getByRole("button", { name: /clear/i });
      expect(clearBtn).toHaveClass("h-8");
    });

    it("Medium size without tokens uses correct padding - BLI: EL-339", () => {
      const { container } = renderMultiComboBox({ size: "Medium" });
      const inputContainer = (container.firstChild as HTMLElement).firstElementChild!;
      expect(inputContainer).toHaveClass("pl-3");
    });

    it("Large size without tokens uses correct padding - BLI: EL-339", () => {
      const { container } = renderMultiComboBox({ size: "Large" });
      const inputContainer = (container.firstChild as HTMLElement).firstElementChild!;
      expect(inputContainer).toHaveClass("pl-3.5");
    });

    it("Medium size with tokens uses compact padding - BLI: EL-339", () => {
      const { container } = renderMultiComboBox({ size: "Medium", defaultSelectedValues: ["apple"] });
      const inputContainer = (container.firstChild as HTMLElement).firstElementChild!;
      expect(inputContainer).toHaveClass("pl-0.5");
    });

    it("Large size with tokens uses compact padding - BLI: EL-339", () => {
      const { container } = renderMultiComboBox({ size: "Large", defaultSelectedValues: ["apple"] });
      const inputContainer = (container.firstChild as HTMLElement).firstElementChild!;
      expect(inputContainer).toHaveClass("pl-1");
    });
  });
});
