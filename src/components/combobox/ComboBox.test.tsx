/**
 * ComboBox.test.tsx
 *
 * The ComboBox component uses the Popover API (showPopover/hidePopover) internally
 * via its ComboBoxPopover -> ResponsivePopover -> Popover chain.
 *
 * jsdom polyfill requirements:
 * 1. showPopover / hidePopover / ':popover-open' -- polyfilled via a data attribute.
 * 2. ResizeObserver -- no-op stub.
 * 3. getBoundingClientRect -- returns a non-zero rect so the Popover positions itself.
 * 4. ontouchstart -- deleted from window so isPhone() returns false and
 *    ResponsivePopover renders as a desktop Popover (not a full-screen Dialog).
 *
 * The Popover uses `popover="manual"` which puts the element in the top layer.
 * jsdom treats top-layer elements as inaccessible, so all queries for elements
 * inside an open dropdown MUST use { hidden: true }.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { ComboBox } from "./ComboBox";
import { ComboBoxItem } from "./ComboBoxItem";
import { ComboBoxItemGroup } from "./ComboBoxItemGroup";
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
  // jsdom sets `ontouchstart` on `window`, which makes isPhone() return true
  // and causes ResponsivePopover to render a Dialog instead of a Popover.
  // Delete it so the component renders as a desktop Popover.
  // @ts-ignore
  delete (window as Window & { ontouchstart?: unknown }).ontouchstart;

  // matchMedia stub (not used by isPhone() but needed to avoid unimplemented errors)
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

  // Save originals
  originalShowPopover = HTMLElement.prototype.showPopover;
  originalHidePopover = HTMLElement.prototype.hidePopover;
  originalMatches = Element.prototype.matches;

  // showPopover / hidePopover polyfill
  HTMLElement.prototype.showPopover = function () {
    this.setAttribute(POPOVER_OPEN_ATTR, "true");
  };
  HTMLElement.prototype.hidePopover = function () {
    this.removeAttribute(POPOVER_OPEN_ATTR);
  };

  // ':popover-open' pseudo-class polyfill
  Element.prototype.matches = function (selector: string): boolean {
    if (selector === ":popover-open") {
      return this.hasAttribute(POPOVER_OPEN_ATTR);
    }
    return originalMatches.call(this, selector);
  };

  // getBoundingClientRect -- non-zero rect so Popover positioning works
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

function renderComboBox(props: React.ComponentProps<typeof ComboBox> = {}) {
  return render(
    <ComboBox placeholder="Pick a fruit" {...props}>
      <ComboBoxItem text="Apple" />
      <ComboBoxItem text="Banana" />
      <ComboBoxItem text="Cherry" />
    </ComboBox>
  );
}

/** Return the text input that carries role="combobox" */
function getInput() {
  return screen.getByRole("combobox");
}

/** Return the "Open suggestions" toggle button */
function getToggleButton() {
  return screen.getByRole("button", { name: /open suggestions/i });
}

/**
 * Get the listbox -- must use { hidden: true } because the Popover element
 * uses `popover="manual"` and jsdom treats it as a hidden top-layer element.
 */
function getListbox() {
  return screen.getByRole("listbox", { hidden: true });
}

function queryListbox() {
  return screen.queryByRole("listbox", { hidden: true });
}

/**
 * Open the dropdown by clicking the toggle arrow, then focus the input so
 * that keyboard events are handled by the input's onKeyDown handler.
 * Returns the listbox element.
 */
async function openDropdown(user: ReturnType<typeof userEvent.setup>) {
  await user.click(getToggleButton());
  // Re-focus the input so keyboard navigation works
  getInput().focus();
  return getListbox();
}

// ---------------------------------------------------------------------------
// Basic rendering
// ---------------------------------------------------------------------------

describe("ComboBox – basic rendering", () => {
  it("renders an input with role=combobox - BLI: EL-339", () => {
    renderComboBox();
    expect(getInput()).toBeInTheDocument();
  });

  it("renders a toggle button - BLI: EL-339", () => {
    renderComboBox();
    expect(getToggleButton()).toBeInTheDocument();
  });

  it("shows placeholder text - BLI: EL-339", () => {
    renderComboBox({ placeholder: "Choose fruit" });
    expect(getInput()).toHaveAttribute("placeholder", "Choose fruit");
  });

  it("renders with a defaultValue - BLI: EL-339", () => {
    renderComboBox({ defaultValue: "Banana" });
    expect(getInput()).toHaveValue("Banana");
  });

  it("renders with a controlled value - BLI: EL-339", () => {
    renderComboBox({ value: "Cherry", onChange: vi.fn() });
    expect(getInput()).toHaveValue("Cherry");
  });

  it("does not show the listbox when closed - BLI: EL-339", () => {
    renderComboBox();
    expect(queryListbox()).not.toBeInTheDocument();
  });

  it("sets aria-expanded=false when closed - BLI: EL-339", () => {
    renderComboBox();
    expect(getInput()).toHaveAttribute("aria-expanded", "false");
  });

  it("applies a custom className to the root wrapper - BLI: EL-339", () => {
    const { container } = renderComboBox({ className: "my-custom-class" });
    expect(container.firstChild).toHaveClass("my-custom-class");
  });

  it("applies name attribute to the input - BLI: EL-339", () => {
    renderComboBox({ name: "fruit-field" });
    expect(getInput()).toHaveAttribute("name", "fruit-field");
  });

  it("applies accessibleName as aria-label - BLI: EL-339", () => {
    renderComboBox({ accessibleName: "Fruit picker" });
    expect(getInput()).toHaveAttribute("aria-label", "Fruit picker");
  });

  it("applies accessibleNameRef as aria-labelledby - BLI: EL-339", () => {
    renderComboBox({ accessibleNameRef: "label-el" });
    expect(getInput()).toHaveAttribute("aria-labelledby", "label-el");
  });

  it("sets aria-required when required - BLI: EL-339", () => {
    renderComboBox({ required: true });
    expect(getInput()).toHaveAttribute("aria-required", "true");
  });

  it("sets aria-invalid when valueState is Negative - BLI: EL-339", () => {
    renderComboBox({ valueState: ValueState.Negative });
    expect(getInput()).toHaveAttribute("aria-invalid", "true");
  });

  it("does not set aria-invalid for other value states - BLI: EL-339", () => {
    renderComboBox({ valueState: ValueState.None });
    expect(getInput()).not.toHaveAttribute("aria-invalid", "true");
  });

  it("renders a custom icon slot - BLI: EL-339", () => {
    renderComboBox({ icon: <span data-testid="custom-icon">★</span> });
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });

  it("hides the dropdown arrow button when readonly - BLI: EL-339", () => {
    renderComboBox({ readonly: true });
    expect(screen.queryByRole("button", { name: /open suggestions/i })).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Opening / closing
// ---------------------------------------------------------------------------

describe("ComboBox – opening and closing", () => {
  it("opens the listbox when the toggle button is clicked - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderComboBox();
    await openDropdown(user);
    expect(getListbox()).toBeInTheDocument();
  });

  it("sets aria-expanded=true when open - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderComboBox();
    await openDropdown(user);
    expect(getInput()).toHaveAttribute("aria-expanded", "true");
  });

  it("closes the listbox when the toggle button is clicked again - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderComboBox();
    await openDropdown(user);
    await user.click(getToggleButton());
    expect(queryListbox()).not.toBeInTheDocument();
  });

  it("calls onOpen when the dropdown opens - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    renderComboBox({ onOpen });
    await openDropdown(user);
    expect(onOpen).toHaveBeenCalledOnce();
  });

  it("calls onClose when the dropdown closes - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderComboBox({ onClose });
    await openDropdown(user);
    await user.click(getToggleButton());
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("opens with defaultOpen=true - BLI: EL-339", () => {
    renderComboBox({ defaultOpen: true });
    expect(getListbox()).toBeInTheDocument();
  });

  it("closes when Escape is pressed - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderComboBox();
    await openDropdown(user);
    await user.keyboard("{Escape}");
    expect(queryListbox()).not.toBeInTheDocument();
  });

  it("closes when Tab is pressed - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderComboBox();
    await openDropdown(user);
    await user.keyboard("{Tab}");
    expect(queryListbox()).not.toBeInTheDocument();
  });

  it("closes on click outside - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <ComboBox>
          <ComboBoxItem text="Apple" />
        </ComboBox>
        <button>Outside</button>
      </div>
    );
    await user.click(screen.getByRole("button", { name: /open suggestions/i }));
    expect(getListbox()).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Outside" }));
    expect(queryListbox()).not.toBeInTheDocument();
  });

  it("does not open when disabled - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderComboBox({ disabled: true });
    // toggle button is disabled so click has no effect
    const toggle = getToggleButton();
    await user.click(toggle);
    expect(queryListbox()).not.toBeInTheDocument();
  });

  it("does not open when readonly - BLI: EL-339", async () => {
    userEvent.setup();
    renderComboBox({ readonly: true });
    // no toggle button rendered in readonly mode -- popover should stay closed
    expect(queryListbox()).not.toBeInTheDocument();
  });

  it("opens via F4 key - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderComboBox();
    getInput().focus();
    await user.keyboard("{F4}");
    expect(getListbox()).toBeInTheDocument();
  });

  it("toggles closed via F4 when already open - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderComboBox();
    await openDropdown(user);
    getInput().focus();
    await user.keyboard("{F4}");
    expect(queryListbox()).not.toBeInTheDocument();
  });

  it("opens via Alt+ArrowDown - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderComboBox();
    getInput().focus();
    await user.keyboard("{Alt>}{ArrowDown}{/Alt}");
    expect(getListbox()).toBeInTheDocument();
  });

  it("closes via Alt+ArrowUp - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderComboBox();
    await openDropdown(user);
    getInput().focus();
    await user.keyboard("{Alt>}{ArrowUp}{/Alt}");
    expect(queryListbox()).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Item rendering in the listbox
// ---------------------------------------------------------------------------

describe("ComboBox – item rendering", () => {
  it("renders all items in the listbox when opened - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderComboBox();
    const listbox = await openDropdown(user);
    expect(within(listbox).getAllByRole("option", { hidden: true })).toHaveLength(3);
  });

  it("renders item text content - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderComboBox();
    await openDropdown(user);
    const listbox = getListbox();
    expect(within(listbox).getByText("Apple")).toBeInTheDocument();
    expect(within(listbox).getByText("Banana")).toBeInTheDocument();
    expect(within(listbox).getByText("Cherry")).toBeInTheDocument();
  });

  it("renders additionalText on an item - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(
      <ComboBox>
        <ComboBoxItem text="Apple" additionalText="Fruit" />
      </ComboBox>
    );
    await openDropdown(user);
    expect(screen.getByText("Fruit")).toBeInTheDocument();
  });

  it("renders items using children text instead of text prop - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(
      <ComboBox>
        <ComboBoxItem>Mango</ComboBoxItem>
      </ComboBox>
    );
    await openDropdown(user);
    expect(screen.getByText("Mango")).toBeInTheDocument();
  });

  it("renders a loading spinner instead of items when loading=true - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderComboBox({ loading: true });
    // Don't use openDropdown() because loading replaces the List (no listbox)
    await user.click(getToggleButton());
    getInput().focus();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    expect(screen.queryByRole("option", { hidden: true })).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Selecting an item
// ---------------------------------------------------------------------------

describe("ComboBox – item selection", () => {
  it("selects an item on click and closes the dropdown - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderComboBox();
    await openDropdown(user);
    const listbox = getListbox();
    await user.click(within(listbox).getByText("Banana"));
    expect(getInput()).toHaveValue("Banana");
    expect(queryListbox()).not.toBeInTheDocument();
  });

  it("calls onSelectionChange with item details on selection - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    renderComboBox({ onSelectionChange });
    await openDropdown(user);
    const listbox = getListbox();
    await user.click(within(listbox).getByText("Apple"));
    expect(onSelectionChange).toHaveBeenCalledOnce();
    expect(onSelectionChange).toHaveBeenCalledWith(
      expect.objectContaining({
        value: "Apple",
        item: expect.objectContaining({ text: "Apple" }),
      })
    );
  });

  it("calls onChange on item selection - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderComboBox({ onChange });
    await openDropdown(user);
    const listbox = getListbox();
    await user.click(within(listbox).getByText("Cherry"));
    expect(onChange).toHaveBeenCalledWith("Cherry");
  });

  it("calls onInput on item selection - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onInput = vi.fn();
    renderComboBox({ onInput });
    await openDropdown(user);
    const listbox = getListbox();
    await user.click(within(listbox).getByText("Cherry"));
    expect(onInput).toHaveBeenCalledWith("Cherry");
  });

  it("marks the selected item with aria-selected=true - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderComboBox({ defaultValue: "Apple" });
    await openDropdown(user);
    const listbox = getListbox();
    const options = within(listbox).getAllByRole("option", { hidden: true });
    const apple = options.find((o) => o.textContent?.includes("Apple"));
    expect(apple).toHaveAttribute("aria-selected", "true");
  });

  it("does not select a disabled item on click - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(
      <ComboBox onSelectionChange={onSelectionChange}>
        <ComboBoxItem text="Apple" disabled />
        <ComboBoxItem text="Banana" />
      </ComboBox>
    );
    await openDropdown(user);
    const listbox = getListbox();
    await user.click(within(listbox).getByText("Apple"));
    expect(onSelectionChange).not.toHaveBeenCalled();
  });

  it("uses separate value prop for selection detail when provided - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(
      <ComboBox onSelectionChange={onSelectionChange}>
        <ComboBoxItem text="Apple" value="apple-id" />
      </ComboBox>
    );
    await openDropdown(user);
    const listbox = getListbox();
    await user.click(within(listbox).getByText("Apple"));
    expect(onSelectionChange).toHaveBeenCalledWith(
      expect.objectContaining({
        item: expect.objectContaining({ value: "apple-id" }),
      })
    );
  });
});

// ---------------------------------------------------------------------------
// Typing / filtering
// ---------------------------------------------------------------------------

describe("ComboBox – typing and filtering", () => {
  it("calls onInput as the user types - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onInput = vi.fn();
    renderComboBox({ onInput, noTypeahead: true });
    await user.type(getInput(), "app");
    expect(onInput).toHaveBeenCalledWith("app");
  });

  it("filters items with StartsWithPerTerm (default) - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(
      <ComboBox noTypeahead defaultOpen>
        <ComboBoxItem text="Apple" />
        <ComboBoxItem text="Green Apple" />
        <ComboBoxItem text="Cherry" />
      </ComboBox>
    );
    await user.type(getInput(), "app");
    const listbox = getListbox();
    const options = within(listbox).getAllByRole("option", { hidden: true });
    expect(options).toHaveLength(2);
    expect(within(listbox).getByText("Apple")).toBeInTheDocument();
    expect(within(listbox).getByText("Green Apple")).toBeInTheDocument();
  });

  it("filters items with StartsWith filter - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(
      <ComboBox filter={ComboBoxFilter.StartsWith} noTypeahead defaultOpen>
        <ComboBoxItem text="Apple" />
        <ComboBoxItem text="Green Apple" />
        <ComboBoxItem text="Cherry" />
      </ComboBox>
    );
    await user.type(getInput(), "app");
    const listbox = getListbox();
    const options = within(listbox).getAllByRole("option", { hidden: true });
    expect(options).toHaveLength(1);
    expect(within(listbox).getByText("Apple")).toBeInTheDocument();
  });

  it("filters items with Contains filter - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(
      <ComboBox filter={ComboBoxFilter.Contains} noTypeahead defaultOpen>
        <ComboBoxItem text="Apple" />
        <ComboBoxItem text="Pineapple" />
        <ComboBoxItem text="Cherry" />
      </ComboBox>
    );
    await user.type(getInput(), "apple");
    const listbox = getListbox();
    const options = within(listbox).getAllByRole("option", { hidden: true });
    expect(options).toHaveLength(2);
  });

  it("shows all items with filter=None regardless of input - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(
      <ComboBox filter={ComboBoxFilter.None} noTypeahead defaultOpen>
        <ComboBoxItem text="Apple" />
        <ComboBoxItem text="Cherry" />
      </ComboBox>
    );
    await user.type(getInput(), "xyz");
    const listbox = getListbox();
    expect(within(listbox).getAllByRole("option", { hidden: true })).toHaveLength(2);
  });

  it("auto-opens the dropdown when the user starts typing - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderComboBox({ noTypeahead: true });
    expect(queryListbox()).not.toBeInTheDocument();
    await user.type(getInput(), "a");
    expect(getListbox()).toBeInTheDocument();
  });

  it("clears filter value when an item is selected - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderComboBox({ noTypeahead: true });
    await user.type(getInput(), "ban");
    const listbox = getListbox();
    await user.click(within(listbox).getByText("Banana"));
    // Close & re-open to verify all items are shown
    await openDropdown(user);
    const listbox2 = getListbox();
    expect(within(listbox2).getAllByRole("option", { hidden: true })).toHaveLength(3);
  });
});

// ---------------------------------------------------------------------------
// Typeahead / autocomplete
// ---------------------------------------------------------------------------

describe("ComboBox – typeahead", () => {
  it("does not autocomplete when noTypeahead=true - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderComboBox({ noTypeahead: true });
    await user.type(getInput(), "app");
    expect(getInput()).toHaveValue("app");
  });

  it("autocompletes the matching item text (default behaviour) - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderComboBox();
    const input = getInput();
    await user.type(input, "A");
    // Value should be autocompleted to "Apple"
    await waitFor(() => expect(input).toHaveValue("Apple"));
  });
});

// ---------------------------------------------------------------------------
// Keyboard navigation
// ---------------------------------------------------------------------------

describe("ComboBox – keyboard navigation", () => {
  it("navigates down the list with ArrowDown - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderComboBox();
    await openDropdown(user);
    await user.keyboard("{ArrowDown}");
    // First item becomes focused: aria-activedescendant set on input
    expect(getInput()).toHaveAttribute("aria-activedescendant");
  });

  it("stops at last item on ArrowDown (no wrapping) - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderComboBox();
    await openDropdown(user);
    // focusedIndex starts at -1 (no item focused) on open
    // ArrowDown: -1->0(Apple)->1(Banana)->2(Cherry)->2 (stays at last)
    await user.keyboard("{ArrowDown}{ArrowDown}{ArrowDown}{ArrowDown}");
    // Should stay at last item (Cherry)
    expect(getInput()).toHaveAttribute("aria-activedescendant", "Cherry");
  });

  it("navigates up the list with ArrowUp - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderComboBox();
    await openDropdown(user);
    // focusedIndex starts at -1 on open
    // ArrowDown x3: -1->0(Apple)->1(Banana)->2(Cherry), ArrowUp: 2->1(Banana)
    await user.keyboard("{ArrowDown}{ArrowDown}{ArrowDown}");
    await user.keyboard("{ArrowUp}");
    expect(getInput()).toHaveAttribute("aria-activedescendant", "Banana");
  });

  it("returns focus to input on ArrowUp at first item - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderComboBox();
    await openDropdown(user);
    // Navigate to first item then back up
    await user.keyboard("{ArrowDown}"); // focus Apple
    await user.keyboard("{ArrowUp}"); // returns focus to input
    expect(getInput()).not.toHaveAttribute("aria-activedescendant");
  });

  it("jumps to first item with Home key - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderComboBox();
    await openDropdown(user);
    await user.keyboard("{ArrowDown}{ArrowDown}");
    await user.keyboard("{Home}");
    expect(getInput()).toHaveAttribute("aria-activedescendant", "Apple");
  });

  it("jumps to last item with End key - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderComboBox();
    await openDropdown(user);
    await user.keyboard("{End}");
    expect(getInput()).toHaveAttribute("aria-activedescendant", "Cherry");
  });

  it("jumps forward 10 items with PageDown (clamped to last) - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderComboBox();
    await openDropdown(user);
    await user.keyboard("{PageDown}");
    expect(getInput()).toHaveAttribute("aria-activedescendant", "Cherry");
  });

  it("jumps back 10 items with PageUp (clamped to first) - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderComboBox();
    await openDropdown(user);
    await user.keyboard("{End}");
    await user.keyboard("{PageUp}");
    expect(getInput()).toHaveAttribute("aria-activedescendant", "Apple");
  });

  it("selects the focused item on Enter - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    renderComboBox({ onSelectionChange });
    await openDropdown(user);
    // Navigate to Banana: ArrowDown->Apple, ArrowDown->Banana, then confirm with Enter
    await user.keyboard("{ArrowDown}{ArrowDown}");
    await user.keyboard("{Enter}");
    expect(onSelectionChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: "Banana" })
    );
    expect(queryListbox()).not.toBeInTheDocument();
  });

  it("Enter does nothing when no item is focused on open - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    renderComboBox({ onSelectionChange });
    await openDropdown(user);
    // focusedIndex is -1 on open, so Enter should not select anything
    await user.keyboard("{Enter}");
    expect(onSelectionChange).not.toHaveBeenCalled();
  });

  it("navigates next item on ArrowDown when closed without committing - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onInput = vi.fn();
    const onSelectionChange = vi.fn();
    const onChange = vi.fn();
    renderComboBox({ defaultValue: "Apple", onInput, onSelectionChange, onChange });
    getInput().focus();
    // Dropdown is closed; ArrowDown navigates and fires onSelectionChange but not onChange
    await user.keyboard("{ArrowDown}");
    expect(onInput).toHaveBeenCalledWith("Banana");
    expect(onSelectionChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: "Banana" })
    );
    expect(onChange).not.toHaveBeenCalled();
  });

  it("navigates previous item on ArrowUp when closed without committing - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onInput = vi.fn();
    const onSelectionChange = vi.fn();
    const onChange = vi.fn();
    renderComboBox({ defaultValue: "Cherry", onInput, onSelectionChange, onChange });
    getInput().focus();
    await user.keyboard("{ArrowUp}");
    expect(onInput).toHaveBeenCalledWith("Banana");
    expect(onSelectionChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: "Banana" })
    );
    expect(onChange).not.toHaveBeenCalled();
  });

  it("skips disabled items during keyboard navigation - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(
      <ComboBox>
        <ComboBoxItem text="Apple" />
        <ComboBoxItem text="Banana" disabled />
        <ComboBoxItem text="Cherry" />
      </ComboBox>
    );
    await openDropdown(user);
    // focusedIndex starts at -1 on open
    // navigableItems: index 0 = Apple, index 1 = Cherry (Banana skipped)
    await user.keyboard("{ArrowDown}"); // focus navigable index 0 = Apple
    await user.keyboard("{ArrowDown}"); // focus navigable index 1 = Cherry
    expect(getInput()).toHaveAttribute("aria-activedescendant", "Cherry");
  });
});

// ---------------------------------------------------------------------------
// Auto-focus and input sync on open
// ---------------------------------------------------------------------------

describe("ComboBox – focus behavior on open", () => {
  it("does not focus any item when dropdown opens with no value", async () => {
    const user = userEvent.setup();
    renderComboBox();
    await openDropdown(user);
    // focusedIndex should be -1, no aria-activedescendant
    expect(getInput()).not.toHaveAttribute("aria-activedescendant");
  });

  it("does not change input value when dropdown opens with no value", async () => {
    const user = userEvent.setup();
    renderComboBox();
    await openDropdown(user);
    expect(getInput()).toHaveValue("");
  });

  it("focuses first item on ArrowDown after open", async () => {
    const user = userEvent.setup();
    renderComboBox();
    await openDropdown(user);
    await user.keyboard("{ArrowDown}");
    expect(getInput()).toHaveAttribute("aria-activedescendant", "Apple");
  });

  it("updates input text to match focused item on ArrowDown navigation", async () => {
    const user = userEvent.setup();
    renderComboBox();
    await openDropdown(user);
    await user.keyboard("{ArrowDown}");
    expect(getInput()).toHaveValue("Apple");
    await user.keyboard("{ArrowDown}");
    expect(getInput()).toHaveValue("Banana");
    await user.keyboard("{ArrowDown}");
    expect(getInput()).toHaveValue("Cherry");
  });

  it("returns to input value on ArrowUp at first item", async () => {
    const user = userEvent.setup();
    renderComboBox();
    await openDropdown(user);
    // Navigate to first item
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{ArrowUp}");
    // Returns focus to input, restores filter value (empty since no typing)
    expect(getInput()).toHaveValue("");
  });

  it("updates input text on Home key", async () => {
    const user = userEvent.setup();
    renderComboBox();
    await openDropdown(user);
    await user.keyboard("{End}");
    expect(getInput()).toHaveValue("Cherry");
    await user.keyboard("{Home}");
    expect(getInput()).toHaveValue("Apple");
  });

  it("updates input text on End key", async () => {
    const user = userEvent.setup();
    renderComboBox();
    await openDropdown(user);
    await user.keyboard("{End}");
    expect(getInput()).toHaveValue("Cherry");
  });

  it("updates input text on PageDown key", async () => {
    const user = userEvent.setup();
    renderComboBox();
    await openDropdown(user);
    await user.keyboard("{PageDown}");
    // PageDown jumps 10, clamped to last (Cherry)
    expect(getInput()).toHaveValue("Cherry");
  });

  it("updates input text on PageUp key", async () => {
    const user = userEvent.setup();
    renderComboBox();
    await openDropdown(user);
    await user.keyboard("{End}");
    await user.keyboard("{PageUp}");
    // PageUp jumps back 10, clamped to first (Apple)
    expect(getInput()).toHaveValue("Apple");
  });

  it("does not sync input when dropdown opens from typing", async () => {
    const user = userEvent.setup();
    renderComboBox({ noTypeahead: true });
    // Type to trigger auto-open
    await user.type(getInput(), "B");
    // Input should still be "B", not overridden by the first item
    expect(getInput()).toHaveValue("B");
  });

  it("does not focus any item when dropdown opens from typing", async () => {
    const user = userEvent.setup();
    renderComboBox({ noTypeahead: true });
    await user.type(getInput(), "C");
    // Dropdown opened from typing, focusedIndex stays at -1
    expect(getInput()).not.toHaveAttribute("aria-activedescendant");
  });

  it("focuses the already-selected item when dropdown reopens, not the first item", async () => {
    const user = userEvent.setup();
    renderComboBox();
    // Open, navigate to Cherry (3 ArrowDowns from -1) and select it
    await openDropdown(user);
    await user.keyboard("{ArrowDown}{ArrowDown}{ArrowDown}{Enter}");
    expect(getInput()).toHaveValue("Cherry");
    expect(queryListbox()).not.toBeInTheDocument();
    // Reopen the dropdown — focus should go to Cherry (the selected item)
    await openDropdown(user);
    expect(getInput()).toHaveAttribute("aria-activedescendant", "Cherry");
    expect(getInput()).toHaveValue("Cherry");
  });

  it("focuses the selected item (index 1) when defaultValue matches Banana", async () => {
    const user = userEvent.setup();
    renderComboBox({ defaultValue: "Banana" });
    await openDropdown(user);
    // Should focus Banana (navigable index 1), not Apple (index 0)
    expect(getInput()).toHaveAttribute("aria-activedescendant", "Banana");
    expect(getInput()).toHaveValue("Banana");
  });

  it("focuses the selected item in a longer list (not first or last)", async () => {
    const user = userEvent.setup();
    render(
      <ComboBox defaultValue="Cherry">
        <ComboBoxItem text="Apple" />
        <ComboBoxItem text="Banana" />
        <ComboBoxItem text="Cherry" />
        <ComboBoxItem text="Date" />
        <ComboBoxItem text="Elderberry" />
      </ComboBox>
    );
    await openDropdown(user);
    // Cherry is at index 2, should be focused
    expect(getInput()).toHaveAttribute("aria-activedescendant", "Cherry");
    expect(getInput()).toHaveValue("Cherry");
  });

  it("does not focus any item when the current value does not match", async () => {
    const user = userEvent.setup();
    renderComboBox({ defaultValue: "Mango" });
    await openDropdown(user);
    // "Mango" is not in the list, so no item is focused
    expect(getInput()).not.toHaveAttribute("aria-activedescendant");
  });

  it("does not focus any item when no value is set", async () => {
    const user = userEvent.setup();
    renderComboBox();
    await openDropdown(user);
    expect(getInput()).not.toHaveAttribute("aria-activedescendant");
  });
});

// ---------------------------------------------------------------------------
// Escape key – reset behaviour
// ---------------------------------------------------------------------------

describe("ComboBox – Escape key reset", () => {
  it("resets to last committed value on Escape when closed - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderComboBox({ defaultValue: "Apple", noTypeahead: true });
    // Type something new without selecting
    const input = getInput();
    await user.clear(input);
    await user.type(input, "Ban");
    // Close any open dropdown first
    await user.keyboard("{Escape}");
    // Press Escape again (dropdown already closed) to reset
    await user.keyboard("{Escape}");
    expect(input).toHaveValue("Apple");
  });
});

// ---------------------------------------------------------------------------
// Clear icon
// ---------------------------------------------------------------------------

describe("ComboBox – clear icon", () => {
  it("does not show clear icon by default - BLI: EL-339", () => {
    renderComboBox({ defaultValue: "Apple" });
    expect(screen.queryByRole("button", { name: /clear value/i })).not.toBeInTheDocument();
  });

  it("shows clear icon when showClearIcon=true and value is set - BLI: EL-339", () => {
    renderComboBox({ showClearIcon: true, defaultValue: "Apple" });
    expect(screen.getByRole("button", { name: /clear value/i })).toBeInTheDocument();
  });

  it("does not show clear icon when value is empty - BLI: EL-339", () => {
    renderComboBox({ showClearIcon: true, defaultValue: "" });
    expect(screen.queryByRole("button", { name: /clear value/i })).not.toBeInTheDocument();
  });

  it("clears the value when the clear button is clicked - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderComboBox({ showClearIcon: true, defaultValue: "Apple" });
    await user.click(screen.getByRole("button", { name: /clear value/i }));
    expect(getInput()).toHaveValue("");
  });

  it("calls onChange and onSelectionChange with empty string on clear - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onSelectionChange = vi.fn();
    renderComboBox({ showClearIcon: true, defaultValue: "Apple", onChange, onSelectionChange });
    await user.click(screen.getByRole("button", { name: /clear value/i }));
    expect(onChange).toHaveBeenCalledWith("");
    expect(onSelectionChange).toHaveBeenCalledWith({ item: null, value: "" });
  });

  it("does not show clear icon when disabled - BLI: EL-339", () => {
    renderComboBox({ showClearIcon: true, defaultValue: "Apple", disabled: true });
    expect(screen.queryByRole("button", { name: /clear value/i })).not.toBeInTheDocument();
  });

  it("does not show clear icon when readonly - BLI: EL-339", () => {
    renderComboBox({ showClearIcon: true, defaultValue: "Apple", readonly: true });
    expect(screen.queryByRole("button", { name: /clear value/i })).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Disabled state
// ---------------------------------------------------------------------------

describe("ComboBox – disabled state", () => {
  it("disables the input when disabled=true - BLI: EL-339", () => {
    renderComboBox({ disabled: true });
    expect(getInput()).toBeDisabled();
  });

  it("disables the toggle button when disabled=true - BLI: EL-339", () => {
    renderComboBox({ disabled: true });
    expect(getToggleButton()).toBeDisabled();
  });

  it("does not fire onOpen when disabled - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    renderComboBox({ disabled: true, onOpen });
    await user.click(getToggleButton());
    expect(onOpen).not.toHaveBeenCalled();
  });

  it("ignores keyboard events when disabled - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderComboBox({ disabled: true });
    getInput().focus();
    await user.keyboard("{ArrowDown}");
    expect(queryListbox()).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Readonly state
// ---------------------------------------------------------------------------

describe("ComboBox – readonly state", () => {
  it("makes the input readonly - BLI: EL-339", () => {
    renderComboBox({ readonly: true });
    expect(getInput()).toHaveAttribute("readonly");
  });

  it("does not open the dropdown on keyboard when readonly - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderComboBox({ readonly: true });
    getInput().focus();
    await user.keyboard("{ArrowDown}");
    expect(queryListbox()).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Value states
// ---------------------------------------------------------------------------

describe("ComboBox – value states", () => {
  it.each([
    ValueState.None,
    ValueState.Positive,
    ValueState.Negative,
    ValueState.Critical,
    ValueState.Information,
  ] as const)("renders without crashing for valueState=%s", (valueState) => {
    renderComboBox({ valueState });
    expect(getInput()).toBeInTheDocument();
  });

  it("shows valueStateMessage below the input for Negative state - BLI: EL-339", () => {
    renderComboBox({
      valueState: ValueState.Negative,
      valueStateMessage: "Field is required",
    });
    expect(screen.getByText("Field is required")).toBeInTheDocument();
    expect(screen.getByText("Field is required").closest("[role='alert']")).toBeTruthy();
  });

  it("shows valueStateMessage below the input for Critical state - BLI: EL-339", () => {
    renderComboBox({
      valueState: ValueState.Critical,
      valueStateMessage: "Warning: value out of range",
    });
    expect(screen.getByText("Warning: value out of range")).toBeInTheDocument();
  });

  it("shows valueStateMessage below the input for Information state - BLI: EL-339", () => {
    renderComboBox({
      valueState: ValueState.Information,
      valueStateMessage: "Informational note",
    });
    expect(screen.getByText("Informational note")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Controlled open state
// ---------------------------------------------------------------------------

describe("ComboBox – controlled open state", () => {
  it("respects controlled open=true - BLI: EL-339", () => {
    render(
      <ComboBox open={true} onClose={vi.fn()}>
        <ComboBoxItem text="Apple" />
      </ComboBox>
    );
    expect(getListbox()).toBeInTheDocument();
  });

  it("respects controlled open=false - BLI: EL-339", () => {
    render(
      <ComboBox open={false} onClose={vi.fn()}>
        <ComboBoxItem text="Apple" />
      </ComboBox>
    );
    expect(queryListbox()).not.toBeInTheDocument();
  });

  it("calls onOpen when toggle is clicked in controlled mode - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    const onClose = vi.fn();
    render(
      <ComboBox open={false} onOpen={onOpen} onClose={onClose}>
        <ComboBoxItem text="Apple" />
      </ComboBox>
    );
    await user.click(getToggleButton());
    expect(onOpen).toHaveBeenCalledOnce();
  });
});

// ---------------------------------------------------------------------------
// Controlled value
// ---------------------------------------------------------------------------

describe("ComboBox – controlled value", () => {
  it("does not update input when value is controlled - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ComboBox value="Apple" onChange={onChange}>
        <ComboBoxItem text="Apple" />
        <ComboBoxItem text="Banana" />
      </ComboBox>
    );
    // Clicking Banana fires onChange but the displayed value stays "Apple"
    // because the parent controls `value`
    await openDropdown(user);
    const listbox = getListbox();
    await user.click(within(listbox).getByText("Banana"));
    expect(onChange).toHaveBeenCalledWith("Banana");
    expect(getInput()).toHaveValue("Apple");
  });
});

// ---------------------------------------------------------------------------
// onChange on blur
// ---------------------------------------------------------------------------

describe("ComboBox – onChange on blur", () => {
  it("fires onChange when input loses focus with a new value - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <div>
        <ComboBox onChange={onChange} noTypeahead>
          <ComboBoxItem text="Apple" />
        </ComboBox>
        <button>Outside</button>
      </div>
    );
    await user.type(getInput(), "Apple");
    await user.click(screen.getByRole("button", { name: "Outside" }));
    expect(onChange).toHaveBeenCalledWith("Apple");
  });
});

// ---------------------------------------------------------------------------
// Item groups
// ---------------------------------------------------------------------------

describe("ComboBox – item groups", () => {
  it("renders groups with a header - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(
      <ComboBox>
        <ComboBoxItemGroup headerText="Fruits">
          <ComboBoxItem text="Apple" />
          <ComboBoxItem text="Banana" />
        </ComboBoxItemGroup>
        <ComboBoxItemGroup headerText="Veggies">
          <ComboBoxItem text="Carrot" />
        </ComboBoxItemGroup>
      </ComboBox>
    );
    await openDropdown(user);
    expect(screen.getByText("Fruits")).toBeInTheDocument();
    expect(screen.getByText("Veggies")).toBeInTheDocument();
  });

  it("hides a group header when all its items are filtered out - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(
      <ComboBox noTypeahead>
        <ComboBoxItemGroup headerText="Fruits">
          <ComboBoxItem text="Apple" />
        </ComboBoxItemGroup>
        <ComboBoxItemGroup headerText="Veggies">
          <ComboBoxItem text="Carrot" />
        </ComboBoxItemGroup>
      </ComboBox>
    );
    await openDropdown(user);
    // Type the filter
    await user.type(getInput(), "apple");
    expect(screen.getByText("Fruits")).toBeInTheDocument();
    expect(screen.queryByText("Veggies")).not.toBeInTheDocument();
  });

  it("renders all items from a group when opened - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(
      <ComboBox>
        <ComboBoxItemGroup headerText="Fruits">
          <ComboBoxItem text="Apple" />
          <ComboBoxItem text="Banana" />
        </ComboBoxItemGroup>
      </ComboBox>
    );
    await openDropdown(user);
    expect(screen.getByText("Apple")).toBeInTheDocument();
    expect(screen.getByText("Banana")).toBeInTheDocument();
  });

  it("can select an item inside a group - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(
      <ComboBox onSelectionChange={onSelectionChange}>
        <ComboBoxItemGroup headerText="Fruits">
          <ComboBoxItem text="Mango" />
        </ComboBoxItemGroup>
      </ComboBox>
    );
    await openDropdown(user);
    const listbox = getListbox();
    await user.click(within(listbox).getByText("Mango"));
    expect(onSelectionChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: "Mango" })
    );
  });
});

// ---------------------------------------------------------------------------
// ComboBoxItem standalone rendering
// ---------------------------------------------------------------------------

describe("ComboBoxItem", () => {
  it("renders with role=option - BLI: EL-339", () => {
    render(<ComboBoxItem text="Apple" />);
    expect(screen.getByRole("option", { hidden: true })).toBeInTheDocument();
  });

  it("renders with aria-selected=false by default - BLI: EL-339", () => {
    render(<ComboBoxItem text="Apple" />);
    expect(screen.getByRole("option", { hidden: true })).toHaveAttribute("aria-selected", "false");
  });

  it("renders with aria-selected=true when selected - BLI: EL-339", () => {
    render(<ComboBoxItem text="Apple" selected />);
    expect(screen.getByRole("option", { hidden: true })).toHaveAttribute("aria-selected", "true");
  });

  it("renders with aria-disabled=true when disabled - BLI: EL-339", () => {
    render(<ComboBoxItem text="Apple" disabled />);
    expect(screen.getByRole("option", { hidden: true })).toHaveAttribute("aria-disabled", "true");
  });

  it("returns null when isVisible=false - BLI: EL-339", () => {
    render(<ComboBoxItem text="Apple" isVisible={false} />);
    expect(screen.queryByRole("option", { hidden: true })).not.toBeInTheDocument();
  });

  it("calls onClick when clicked - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<ComboBoxItem text="Apple" onClick={onClick} />);
    await user.click(screen.getByRole("option", { hidden: true }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("does not call onClick when disabled and clicked - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<ComboBoxItem text="Apple" disabled onClick={onClick} />);
    await user.click(screen.getByRole("option", { hidden: true }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("renders additionalText - BLI: EL-339", () => {
    render(<ComboBoxItem text="Apple" additionalText="Sweet" />);
    expect(screen.getByText("Sweet")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// ComboBoxItemGroup standalone rendering
// ---------------------------------------------------------------------------

describe("ComboBoxItemGroup", () => {
  it("renders a group with a header - BLI: EL-339", () => {
    render(
      <ComboBoxItemGroup headerText="Fruits">
        <ComboBoxItem text="Apple" />
      </ComboBoxItemGroup>
    );
    expect(screen.getByText("Fruits")).toBeInTheDocument();
  });

  it("renders with role=group - BLI: EL-339", () => {
    render(
      <ComboBoxItemGroup headerText="Fruits">
        <ComboBoxItem text="Apple" />
      </ComboBoxItemGroup>
    );
    expect(screen.getByRole("group")).toBeInTheDocument();
  });

  it("returns null when isVisible=false - BLI: EL-339", () => {
    render(
      <ComboBoxItemGroup headerText="Fruits" isVisible={false}>
        <ComboBoxItem text="Apple" />
      </ComboBoxItemGroup>
    );
    expect(screen.queryByRole("group")).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// aria-controls
// ---------------------------------------------------------------------------

describe("ComboBox – aria attributes", () => {
  it("sets aria-controls on the input when the dropdown is open - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderComboBox();
    await openDropdown(user);
    expect(getInput()).toHaveAttribute("aria-controls");
  });

  it("removes aria-controls from the input when the dropdown is closed - BLI: EL-339", () => {
    renderComboBox();
    expect(getInput()).not.toHaveAttribute("aria-controls");
  });
});

// ── Phase 1 Accessibility enhancements ─────────────────────────────────────

describe("ComboBox a11y enhancements", () => {
  it("sets aria-busy when loading - BLI: EL-339", () => {
    renderComboBox({ loading: true });
    expect(getInput()).toHaveAttribute("aria-busy", "true");
  });

  it("does not set aria-busy when not loading - BLI: EL-339", () => {
    renderComboBox({ loading: false });
    expect(getInput()).not.toHaveAttribute("aria-busy");
  });

  it("links value state message via aria-describedby - BLI: EL-339", () => {
    renderComboBox({
      valueState: ValueState.Negative,
      valueStateMessage: "Invalid selection",
    });
    const input = getInput();
    const describedById = input.getAttribute("aria-describedby");
    expect(describedById).toBeTruthy();
    const firstId = describedById!.split(" ")[0];
    const descriptionEl = document.getElementById(firstId);
    expect(descriptionEl).toBeInTheDocument();
    expect(descriptionEl!.textContent).toContain("Invalid selection");
  });

  it("does not set aria-describedby when no value state message - BLI: EL-339", () => {
    renderComboBox({ valueState: ValueState.None });
    expect(getInput()).not.toHaveAttribute("aria-describedby");
  });

  it("sets aria-describedby when accessibleDescription provided - BLI: EL-339", () => {
    render(
      <ComboBox accessibleDescription="Select your preferred fruit">
        <ComboBoxItem text="Apple" />
      </ComboBox>
    );
    const input = screen.getByRole("combobox");
    const describedById = input.getAttribute("aria-describedby");
    expect(describedById).toBeTruthy();
    const descriptionEl = document.getElementById(describedById!);
    expect(descriptionEl).toBeInTheDocument();
    expect(descriptionEl!.textContent).toBe("Select your preferred fruit");
  });

  it("announces result count after filtering - BLI: EL-339", async () => {
    vi.useFakeTimers();
    const { container } = render(
      <ComboBox noTypeahead>
        <ComboBoxItem text="Apple" />
        <ComboBoxItem text="Apricot" />
        <ComboBoxItem text="Banana" />
      </ComboBox>
    );
    const input = screen.getByRole("combobox");
    // Use fireEvent to avoid userEvent timer conflicts with fake timers
    const { fireEvent, act } = await import("@testing-library/react");
    fireEvent.change(input, { target: { value: "App" } });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    const liveRegion = container.querySelector('[aria-live="polite"]');
    expect(liveRegion).toBeInTheDocument();
    expect(liveRegion!.textContent).toContain("result");
    vi.useRealTimers();
  });

  it("applies accessibilityAttributes.controls - BLI: EL-339", () => {
    renderComboBox({ accessibilityAttributes: { controls: "results-panel" } });
    expect(getInput()).toHaveAttribute("aria-controls", expect.stringContaining("results-panel"));
  });
});

// ---------------------------------------------------------------------------
// UI5 Compatibility: Typeahead & Backspace
// ---------------------------------------------------------------------------

describe("ComboBox – typeahead & backspace (UI5 compat)", () => {
  it("fires onSelectionChange with item=null on Backspace after typeahead", async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    renderComboBox({ onSelectionChange });
    const input = getInput();
    await user.type(input, "A");
    // Typeahead should have matched Apple and fired onSelectionChange
    expect(onSelectionChange).toHaveBeenCalled();
    onSelectionChange.mockClear();
    // Backspace deletes the autocompleted portion
    await user.keyboard("{Backspace}");
    expect(onSelectionChange).toHaveBeenCalledWith(
      expect.objectContaining({ item: null })
    );
  });

  it("fires onSelectionChange with item=null when typing non-matching text", async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    renderComboBox({ onSelectionChange });
    const input = getInput();
    await user.type(input, "A");
    onSelectionChange.mockClear();
    // Type something that won't match any item
    await user.clear(input);
    await user.type(input, "zzz");
    expect(onSelectionChange).toHaveBeenCalledWith(
      expect.objectContaining({ item: null })
    );
  });

  it("fires onSelectionChange with item data on typeahead match", async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    renderComboBox({ onSelectionChange });
    await user.type(getInput(), "A");
    expect(onSelectionChange).toHaveBeenCalledWith(
      expect.objectContaining({
        item: expect.objectContaining({ text: "Apple" }),
      })
    );
  });

  it("does not autocomplete when noTypeahead is true", async () => {
    const user = userEvent.setup();
    renderComboBox({ noTypeahead: true });
    await user.type(getInput(), "A");
    expect(getInput()).toHaveValue("A");
  });

  it("does not re-autocomplete after clearing input with Backspace", async () => {
    const user = userEvent.setup();
    renderComboBox({ noTypeahead: true });
    const input = getInput();
    await user.type(input, "App");
    expect(input).toHaveValue("App");
    await user.keyboard("{Backspace}");
    // Should be "Ap" — not re-autocompleted back to "Apple"
    expect(input).toHaveValue("Ap");
  });
});

// ---------------------------------------------------------------------------
// UI5 Compatibility: F4 behavior
// ---------------------------------------------------------------------------

describe("ComboBox – F4 behavior (UI5 compat)", () => {
  it("F4 opens popover and focuses matching item when value matches", async () => {
    const user = userEvent.setup();
    renderComboBox({ defaultValue: "Banana" });
    getInput().focus();
    await user.keyboard("{F4}");
    expect(getListbox()).toBeInTheDocument();
    expect(getInput()).toHaveAttribute("aria-activedescendant", "Banana");
  });

  it("F4 opens popover and focuses first item when value is empty", async () => {
    const user = userEvent.setup();
    renderComboBox();
    getInput().focus();
    await user.keyboard("{F4}");
    expect(getListbox()).toBeInTheDocument();
    expect(getInput()).toHaveAttribute("aria-activedescendant", "Apple");
    expect(getInput()).toHaveValue("Apple");
  });

  it("F4 opens popover with no focus when value doesn't match any item", async () => {
    const user = userEvent.setup();
    renderComboBox({ defaultValue: "Mango" });
    getInput().focus();
    await user.keyboard("{F4}");
    expect(getListbox()).toBeInTheDocument();
    expect(getInput()).not.toHaveAttribute("aria-activedescendant");
  });

  it("F4 closes popover when already open", async () => {
    const user = userEvent.setup();
    renderComboBox();
    await openDropdown(user);
    getInput().focus();
    await user.keyboard("{F4}");
    expect(queryListbox()).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// UI5 Compatibility: Popover auto-close on no matches
// ---------------------------------------------------------------------------

describe("ComboBox – popover auto-close (UI5 compat)", () => {
  it("closes popover when no items match the filter", async () => {
    const user = userEvent.setup();
    renderComboBox({ noTypeahead: true });
    await user.type(getInput(), "z");
    // Popover opens on typing but auto-closes because "z" matches no items
    expect(queryListbox()).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// UI5 Compatibility: Change event behavior
// ---------------------------------------------------------------------------

describe("ComboBox – change event (UI5 compat)", () => {
  it("fires onChange on focus-out with changed value", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <div>
        <ComboBox onChange={onChange} noTypeahead>
          <ComboBoxItem text="Apple" />
        </ComboBox>
        <button>Outside</button>
      </div>
    );
    await user.type(getInput(), "Apple");
    await user.click(screen.getByRole("button", { name: "Outside" }));
    expect(onChange).toHaveBeenCalledWith("Apple");
  });

  it("does not fire onChange on focus-out if value did not change", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <div>
        <ComboBox defaultValue="Apple" onChange={onChange}>
          <ComboBoxItem text="Apple" />
        </ComboBox>
        <button>Outside</button>
      </div>
    );
    getInput().focus();
    await user.click(screen.getByRole("button", { name: "Outside" }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("does not fire onChange during ArrowDown navigation in open popover", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderComboBox({ onChange });
    await openDropdown(user);
    await user.keyboard("{ArrowDown}");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("fires onChange when item is clicked from dropdown", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderComboBox({ onChange });
    await openDropdown(user);
    const listbox = getListbox();
    await user.click(within(listbox).getByText("Cherry"));
    expect(onChange).toHaveBeenCalledWith("Cherry");
  });
});

// ---------------------------------------------------------------------------
// UI5 Compatibility: Closed-picker navigation events
// ---------------------------------------------------------------------------

describe("ComboBox – closed-picker navigation (UI5 compat)", () => {
  it("ArrowDown fires onInput when picker is closed", async () => {
    const user = userEvent.setup();
    const onInput = vi.fn();
    renderComboBox({ defaultValue: "Apple", onInput });
    getInput().focus();
    await user.keyboard("{ArrowDown}");
    expect(onInput).toHaveBeenCalledWith("Banana");
  });

  it("ArrowDown fires onSelectionChange when picker is closed", async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    renderComboBox({ defaultValue: "Apple", onSelectionChange });
    getInput().focus();
    await user.keyboard("{ArrowDown}");
    expect(onSelectionChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: "Banana" })
    );
  });

  it("does not fire onChange on ArrowDown when picker is closed", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderComboBox({ defaultValue: "Apple", onChange });
    getInput().focus();
    await user.keyboard("{ArrowDown}");
    expect(onChange).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// UI5 Compatibility: Escape key reset
// ---------------------------------------------------------------------------

describe("ComboBox – Escape key (UI5 compat)", () => {
  it("first Escape closes the popover", async () => {
    const user = userEvent.setup();
    renderComboBox();
    await openDropdown(user);
    await user.keyboard("{Escape}");
    expect(queryListbox()).not.toBeInTheDocument();
  });

  it("second Escape reverts to last committed value when closed", async () => {
    const user = userEvent.setup();
    renderComboBox({ defaultValue: "Apple", noTypeahead: true });
    const input = getInput();
    await user.clear(input);
    await user.type(input, "Ban");
    // First Escape closes the popover
    await user.keyboard("{Escape}");
    // Second Escape reverts the value
    await user.keyboard("{Escape}");
    expect(input).toHaveValue("Apple");
  });

  it("Escape does not revert after a committed selection", async () => {
    const user = userEvent.setup();
    renderComboBox();
    await openDropdown(user);
    // Navigate to Banana and select with Enter
    await user.keyboard("{ArrowDown}{ArrowDown}{Enter}");
    expect(getInput()).toHaveValue("Banana");
    // Escape should not revert since "Banana" is committed
    await user.keyboard("{Escape}");
    expect(getInput()).toHaveValue("Banana");
  });
});

// ---------------------------------------------------------------------------
// UI5 Compatibility: Value state link keyboard navigation
// ---------------------------------------------------------------------------

describe("ComboBox – value state link navigation (UI5 compat)", () => {
  function renderWithLinks() {
    return render(
      <ComboBox
        placeholder="Pick a fruit"
        valueState={ValueState.Negative}
        valueStateMessage={
          <span>
            Invalid. <a href="#" data-testid="link1">Help</a> or <a href="#" data-testid="link2">Support</a>
          </span>
        }
      >
        <ComboBoxItem text="Apple" />
        <ComboBoxItem text="Banana" />
        <ComboBoxItem text="Cherry" />
      </ComboBox>
    );
  }

  it("Ctrl+Alt+F8 focuses the first link in the value state message", async () => {
    const user = userEvent.setup();
    renderWithLinks();
    await openDropdown(user);
    getInput().focus();
    await user.keyboard("{Control>}{Alt>}{F8}{/Alt}{/Control}");
    expect(document.activeElement).toBe(screen.getByTestId("link1"));
  });

  it("Tab from first link focuses the second link", async () => {
    const user = userEvent.setup();
    renderWithLinks();
    await openDropdown(user);
    getInput().focus();
    await user.keyboard("{Control>}{Alt>}{F8}{/Alt}{/Control}");
    await user.keyboard("{Tab}");
    expect(document.activeElement).toBe(screen.getByTestId("link2"));
  });

  it("Tab from last link returns focus to input", async () => {
    const user = userEvent.setup();
    renderWithLinks();
    await openDropdown(user);
    getInput().focus();
    await user.keyboard("{Control>}{Alt>}{F8}{/Alt}{/Control}");
    await user.keyboard("{Tab}");
    await user.keyboard("{Tab}");
    expect(document.activeElement).toBe(getInput());
  });

  it("Shift+Tab from first link returns focus to input", async () => {
    const user = userEvent.setup();
    renderWithLinks();
    await openDropdown(user);
    getInput().focus();
    await user.keyboard("{Control>}{Alt>}{F8}{/Alt}{/Control}");
    await user.keyboard("{Shift>}{Tab}{/Shift}");
    expect(document.activeElement).toBe(getInput());
  });

  it("ArrowUp from link returns focus to input", async () => {
    const user = userEvent.setup();
    renderWithLinks();
    await openDropdown(user);
    getInput().focus();
    await user.keyboard("{Control>}{Alt>}{F8}{/Alt}{/Control}");
    await user.keyboard("{ArrowUp}");
    expect(document.activeElement).toBe(getInput());
  });

  it("ArrowDown from link navigates to first list item", async () => {
    const user = userEvent.setup();
    renderWithLinks();
    await openDropdown(user);
    getInput().focus();
    await user.keyboard("{Control>}{Alt>}{F8}{/Alt}{/Control}");
    await user.keyboard("{ArrowDown}");
    expect(document.activeElement).toBe(getInput());
    expect(getInput()).toHaveAttribute("aria-activedescendant", "Apple");
  });

  it("Escape from link returns focus to input without closing popover", async () => {
    const user = userEvent.setup();
    renderWithLinks();
    await openDropdown(user);
    getInput().focus();
    await user.keyboard("{Control>}{Alt>}{F8}{/Alt}{/Control}");
    await user.keyboard("{Escape}");
    expect(document.activeElement).toBe(getInput());
    expect(getListbox()).toBeInTheDocument();
  });

  it("does not fire Ctrl+Alt+F8 when popover is closed", async () => {
    const user = userEvent.setup();
    renderWithLinks();
    getInput().focus();
    await user.keyboard("{Control>}{Alt>}{F8}{/Alt}{/Control}");
    expect(document.activeElement).toBe(getInput());
  });

  it("clears focused item index when focus moves to a link", async () => {
    const user = userEvent.setup();
    renderWithLinks();
    await openDropdown(user);
    getInput().focus();
    await user.keyboard("{ArrowDown}");
    expect(getInput()).toHaveAttribute("aria-activedescendant", "Apple");
    await user.keyboard("{Control>}{Alt>}{F8}{/Alt}{/Control}");
    expect(getInput()).not.toHaveAttribute("aria-activedescendant");
  });
});

// ---------------------------------------------------------------------------
// Size variants
// ---------------------------------------------------------------------------

describe("ComboBox – size variants", () => {
  it("defaults to Large size with h-10 and rounded-lg - BLI: EL-339", () => {
    const { container } = renderComboBox();
    // The input container is the second div (first child of root relative wrapper)
    const inputContainer = (container.firstChild as HTMLElement).firstElementChild!;
    expect(inputContainer).toHaveClass("h-10");
    expect(inputContainer).toHaveClass("rounded-lg");
  });

  it("renders Medium size with h-8 and rounded - BLI: EL-339", () => {
    const { container } = renderComboBox({ size: "Medium" });
    const inputContainer = (container.firstChild as HTMLElement).firstElementChild!;
    expect(inputContainer).toHaveClass("h-8");
    expect(inputContainer).toHaveClass("rounded");
    expect(inputContainer).not.toHaveClass("rounded-lg");
  });

  it("Large size does not have h-8 class - BLI: EL-339", () => {
    const { container } = renderComboBox({ size: "Large" });
    const inputContainer = (container.firstChild as HTMLElement).firstElementChild!;
    expect(inputContainer).not.toHaveClass("h-8");
    expect(inputContainer).toHaveClass("h-10");
  });

  it("Medium size renders Small dropdown arrow button - BLI: EL-339", () => {
    renderComboBox({ size: "Medium" });
    const btn = getToggleButton();
    expect(btn).toHaveClass("h-6");
  });

  it("Large size renders Medium dropdown arrow button - BLI: EL-339", () => {
    renderComboBox({ size: "Large" });
    const btn = getToggleButton();
    expect(btn).toHaveClass("h-8");
  });

  it("Medium size renders Small clear button when showClearIcon - BLI: EL-339", () => {
    renderComboBox({ size: "Medium", showClearIcon: true, value: "Apple" });
    const clearBtn = screen.getByRole("button", { name: /clear/i });
    expect(clearBtn).toHaveClass("h-6");
  });

  it("Large size renders Medium clear button when showClearIcon - BLI: EL-339", () => {
    renderComboBox({ size: "Large", showClearIcon: true, value: "Apple" });
    const clearBtn = screen.getByRole("button", { name: /clear/i });
    expect(clearBtn).toHaveClass("h-8");
  });

  it("Medium size uses correct padding classes - BLI: EL-339", () => {
    const { container } = renderComboBox({ size: "Medium" });
    const inputContainer = (container.firstChild as HTMLElement).firstElementChild!;
    expect(inputContainer).toHaveClass("pl-3");
  });

  it("Large size uses correct padding classes - BLI: EL-339", () => {
    const { container } = renderComboBox({ size: "Large" });
    const inputContainer = (container.firstChild as HTMLElement).firstElementChild!;
    expect(inputContainer).toHaveClass("pl-3.5");
  });
});
