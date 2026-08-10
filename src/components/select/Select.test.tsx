/**
 * Select.test.tsx
 *
 * The Select component uses the Popover API (showPopover/hidePopover) internally
 * via its SelectPopover → ResponsivePopover → Popover chain.
 *
 * jsdom polyfill requirements:
 * 1. showPopover / hidePopover / ':popover-open' — polyfilled via a data attribute.
 * 2. ResizeObserver — no-op stub.
 * 3. getBoundingClientRect — returns a non-zero rect so the Popover positions itself.
 * 4. ontouchstart — deleted from window so isPhone() returns false and
 *    ResponsivePopover renders as a desktop Popover (not a full-screen Dialog).
 *
 * The Popover uses `popover="manual"` which puts the element in the top layer.
 * jsdom treats top-layer elements as inaccessible, so all queries for elements
 * inside an open dropdown MUST use { hidden: true }.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { Select } from "./Select";
import { Option } from "./Option";
import { OptionCustom } from "./OptionCustom";
import { ValueState } from "../../types/combobox";
import { TextSeparator } from "../../types/select";

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

  // getBoundingClientRect — non-zero rect so Popover positioning works
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
  vi.restoreAllMocks();
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function renderSelect(props: React.ComponentProps<typeof Select> = {}) {
  return render(
    <Select {...props}>
      <Option value="apple">Apple</Option>
      <Option value="banana">Banana</Option>
      <Option value="cherry">Cherry</Option>
    </Select>
  );
}

/** The combobox trigger element */
function getTrigger() {
  return screen.getByRole("combobox");
}

/**
 * Get the listbox — must use { hidden: true } because the Popover element
 * uses `popover="manual"` and jsdom treats it as a hidden top-layer element.
 */
function getListbox() {
  return screen.getByRole("listbox", { hidden: true });
}

function queryListbox() {
  return screen.queryByRole("listbox", { hidden: true });
}

/**
 * Open the Select dropdown by clicking the trigger.
 * Returns the listbox element.
 */
async function openDropdown(user: ReturnType<typeof userEvent.setup>) {
  await user.click(getTrigger());
  return getListbox();
}

// ─── Basic rendering ──────────────────────────────────────────────────────────

describe("Select – basic rendering", () => {
  it("renders an element with role=combobox - BLI: EL-339", () => {
    renderSelect();
    expect(getTrigger()).toBeInTheDocument();
  });

  it("defaults to showing the first option text - BLI: EL-339", () => {
    renderSelect();
    // The trigger shows the text in a visible span
    expect(getTrigger().textContent).toContain("Apple");
  });

  it("shows the defaultValue option when provided - BLI: EL-339", () => {
    renderSelect({ defaultValue: "banana" });
    expect(getTrigger().textContent).toContain("Banana");
  });

  it("shows the controlled value option when provided - BLI: EL-339", () => {
    renderSelect({ value: "cherry" });
    expect(getTrigger().textContent).toContain("Cherry");
  });

  it("shows a placeholder when there are no options - BLI: EL-339", () => {
    render(<Select />);
    expect(screen.getByText("Select...")).toBeInTheDocument();
  });

  it("renders a custom label slot instead of selected text - BLI: EL-339", () => {
    renderSelect({ label: <span data-testid="custom-label">My Label</span> });
    expect(screen.getByTestId("custom-label")).toBeInTheDocument();
  });

  it("applies a custom className to the root element - BLI: EL-339", () => {
    const { container } = renderSelect({ className: "my-class" });
    expect(container.firstChild).toHaveClass("my-class");
  });

  it("renders a chevron icon when not in readonly mode - BLI: EL-339", () => {
    renderSelect();
    // ChevronDown svg is rendered inside the trigger
    expect(getTrigger().querySelector("svg")).toBeInTheDocument();
  });

  it("does not render a chevron in readonly mode - BLI: EL-339", () => {
    renderSelect({ readonly: true });
    const svgIcons = getTrigger().querySelectorAll("svg");
    expect(svgIcons).toHaveLength(0);
  });

  it("sets aria-expanded=false when closed - BLI: EL-339", () => {
    renderSelect();
    expect(getTrigger()).toHaveAttribute("aria-expanded", "false");
  });

  it("sets aria-haspopup=listbox - BLI: EL-339", () => {
    renderSelect();
    expect(getTrigger()).toHaveAttribute("aria-haspopup", "listbox");
  });

  it("sets aria-required when required=true - BLI: EL-339", () => {
    renderSelect({ required: true });
    expect(getTrigger()).toHaveAttribute("aria-required", "true");
  });

  it("sets aria-disabled when disabled=true - BLI: EL-339", () => {
    renderSelect({ disabled: true });
    expect(getTrigger()).toHaveAttribute("aria-disabled", "true");
  });

  it("sets aria-readonly when readonly=true - BLI: EL-339", () => {
    renderSelect({ readonly: true });
    expect(getTrigger()).toHaveAttribute("aria-readonly", "true");
  });

  it("sets aria-invalid when valueState=Negative - BLI: EL-339", () => {
    renderSelect({ valueState: ValueState.Negative });
    expect(getTrigger()).toHaveAttribute("aria-invalid", "true");
  });

  it("does not set aria-invalid for other value states - BLI: EL-339", () => {
    renderSelect({ valueState: ValueState.None });
    expect(getTrigger()).not.toHaveAttribute("aria-invalid", "true");
  });

  it("sets aria-label via accessibleName - BLI: EL-339", () => {
    renderSelect({ accessibleName: "Fruit picker" });
    expect(getTrigger()).toHaveAttribute("aria-label", "Fruit picker");
  });

  it("sets aria-labelledby via accessibleNameRef - BLI: EL-339", () => {
    renderSelect({ accessibleNameRef: "label-el" });
    expect(getTrigger()).toHaveAttribute("aria-labelledby", "label-el");
  });

  it("sets title/tooltip attribute - BLI: EL-339", () => {
    renderSelect({ tooltip: "Pick a fruit" });
    expect(getTrigger()).toHaveAttribute("title", "Pick a fruit");
  });

  it("has tabIndex=0 when not disabled - BLI: EL-339", () => {
    renderSelect();
    expect(getTrigger()).toHaveAttribute("tabIndex", "0");
  });

  it("has tabIndex=-1 when disabled - BLI: EL-339", () => {
    renderSelect({ disabled: true });
    expect(getTrigger()).toHaveAttribute("tabIndex", "-1");
  });

  it("renders a hidden form input when name is given - BLI: EL-339", () => {
    renderSelect({ name: "fruit" });
    const hidden = document.querySelector('input[type="hidden"][name="fruit"]');
    expect(hidden).toBeInTheDocument();
  });

  it("hidden input value reflects selected option value - BLI: EL-339", () => {
    renderSelect({ name: "fruit", value: "banana" });
    const hidden = document.querySelector('input[type="hidden"][name="fruit"]') as HTMLInputElement;
    expect(hidden.value).toBe("banana");
  });
});

// ─── Opening and closing ──────────────────────────────────────────────────────

describe("Select – opening and closing", () => {
  it("opens the dropdown on click - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderSelect();
    await openDropdown(user);
    expect(getListbox()).toBeInTheDocument();
  });

  it("sets aria-expanded=true when open - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderSelect();
    await openDropdown(user);
    expect(getTrigger()).toHaveAttribute("aria-expanded", "true");
  });

  it("sets aria-controls when open - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderSelect();
    await openDropdown(user);
    expect(getTrigger()).toHaveAttribute("aria-controls");
  });

  it("closes the dropdown on a second click - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderSelect();
    await openDropdown(user);
    await user.click(getTrigger());
    expect(queryListbox()).not.toBeInTheDocument();
  });

  it("calls onOpen when dropdown opens - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    renderSelect({ onOpen });
    await openDropdown(user);
    expect(onOpen).toHaveBeenCalledOnce();
  });

  it("calls onClose when dropdown closes - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderSelect({ onClose });
    await openDropdown(user);
    await user.click(getTrigger());
    expect(onClose).toHaveBeenCalled();
  });

  it("opens with defaultOpen=true - BLI: EL-339", () => {
    renderSelect({ defaultOpen: true });
    expect(getListbox()).toBeInTheDocument();
  });

  it("does not open when disabled - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderSelect({ disabled: true });
    await user.click(getTrigger());
    expect(queryListbox()).not.toBeInTheDocument();
  });

  it("does not open when readonly - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderSelect({ readonly: true });
    await user.click(getTrigger());
    expect(queryListbox()).not.toBeInTheDocument();
  });
});

// ─── Option rendering ─────────────────────────────────────────────────────────

describe("Select – option rendering", () => {
  it("renders all options when opened - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderSelect();
    const listbox = await openDropdown(user);
    expect(within(listbox).getAllByRole("option", { hidden: true })).toHaveLength(3);
  });

  it("renders option text content - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderSelect();
    const listbox = await openDropdown(user);
    expect(within(listbox).getByText("Apple")).toBeInTheDocument();
    expect(within(listbox).getByText("Banana")).toBeInTheDocument();
    expect(within(listbox).getByText("Cherry")).toBeInTheDocument();
  });

  it("marks the selected option with aria-selected=true - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderSelect({ defaultValue: "banana" });
    const listbox = await openDropdown(user);
    const options = within(listbox).getAllByRole("option", { hidden: true });
    const banana = options.find((o) => o.textContent?.includes("Banana"));
    expect(banana).toHaveAttribute("aria-selected", "true");
  });

  it("renders additionalText on an option - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(
      <Select>
        <Option value="apple" additionalText="Sweet fruit">Apple</Option>
      </Select>
    );
    const listbox = await openDropdown(user);
    expect(within(listbox).getByText("Sweet fruit")).toBeInTheDocument();
  });

  it("renders disabled option with aria-disabled=true - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(
      <Select>
        <Option value="apple" disabled>Apple</Option>
        <Option value="banana">Banana</Option>
      </Select>
    );
    const listbox = await openDropdown(user);
    const options = within(listbox).getAllByRole("option", { hidden: true });
    const apple = options.find((o) => o.textContent?.includes("Apple"));
    expect(apple).toHaveAttribute("aria-disabled", "true");
  });
});

// ─── OptionCustom rendering ───────────────────────────────────────────────────

describe("Select – OptionCustom rendering", () => {
  it("renders OptionCustom children in the dropdown - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(
      <Select>
        <OptionCustom value="custom" displayText="Custom Option">
          <span data-testid="custom-content">Custom!</span>
        </OptionCustom>
      </Select>
    );
    const listbox = await openDropdown(user);
    expect(within(listbox).getByTestId("custom-content")).toBeInTheDocument();
  });

  it("shows displayText in the trigger when OptionCustom is selected - BLI: EL-339", () => {
    render(
      <Select value="custom">
        <OptionCustom value="custom" displayText="My Custom">
          <span>Custom!</span>
        </OptionCustom>
      </Select>
    );
    expect(getTrigger().textContent).toContain("My Custom");
  });

  it("falls back to empty string when OptionCustom has no displayText - BLI: EL-339", () => {
    render(
      <Select value="custom">
        <OptionCustom value="custom">
          <span>Custom!</span>
        </OptionCustom>
      </Select>
    );
    // No crash and trigger renders
    expect(getTrigger()).toBeInTheDocument();
  });
});

// ─── Selection ────────────────────────────────────────────────────────────────

describe("Select – selection", () => {
  it("selects an option on click and shows it in the trigger - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderSelect();
    const listbox = await openDropdown(user);
    await user.click(within(listbox).getByText("Banana"));
    expect(getTrigger().textContent).toContain("Banana");
    // Dropdown should close after selection
    expect(queryListbox()).not.toBeInTheDocument();
  });

  it("calls onChange with the selected option data - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderSelect({ onChange });
    const listbox = await openDropdown(user);
    await user.click(within(listbox).getByText("Cherry"));
    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        selectedOption: expect.objectContaining({ value: "cherry", text: "Cherry" }),
      })
    );
  });

  it("does not call onChange when a disabled option is clicked - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Select onChange={onChange}>
        <Option value="apple" disabled>Apple</Option>
        <Option value="banana">Banana</Option>
      </Select>
    );
    const listbox = await openDropdown(user);
    await user.click(within(listbox).getByText("Apple"));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("does not select a disabled option via click - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(
      <Select defaultValue="banana">
        <Option value="apple" disabled>Apple</Option>
        <Option value="banana">Banana</Option>
      </Select>
    );
    const listbox = await openDropdown(user);
    await user.click(within(listbox).getByText("Apple"));
    // Still shows Banana as selected
    expect(getTrigger().textContent).toContain("Banana");
  });

  it("selects option by text when value prop is absent on Option - BLI: EL-339", () => {
    render(
      <Select defaultValue="Mango">
        <Option>Mango</Option>
        <Option>Papaya</Option>
      </Select>
    );
    expect(getTrigger().textContent).toContain("Mango");
  });

  it("handles option with selected prop - BLI: EL-339", () => {
    render(
      <Select>
        <Option value="apple">Apple</Option>
        <Option value="banana" selected>Banana</Option>
        <Option value="cherry">Cherry</Option>
      </Select>
    );
    // Banana has selected prop, should be shown
    expect(getTrigger().textContent).toContain("Banana");
  });
});

// ─── Controlled vs uncontrolled ──────────────────────────────────────────────

describe("Select – controlled", () => {
  it("respects controlled value (does not update on click when controlled) - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderSelect({ value: "apple", onChange });
    const listbox = await openDropdown(user);
    await user.click(within(listbox).getByText("Banana"));
    // onChange fires but the displayed value stays "Apple" because parent controls it
    expect(onChange).toHaveBeenCalledOnce();
    expect(getTrigger().textContent).toContain("Apple");
  });

  it("respects controlled open=true - BLI: EL-339", () => {
    renderSelect({ open: true });
    expect(getListbox()).toBeInTheDocument();
  });

  it("respects controlled open=false - BLI: EL-339", () => {
    renderSelect({ open: false });
    expect(queryListbox()).not.toBeInTheDocument();
  });

  it("calls onOpen when trigger clicked in controlled-open mode - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    renderSelect({ open: false, onOpen });
    await user.click(getTrigger());
    expect(onOpen).toHaveBeenCalledOnce();
  });
});

// ─── Uncontrolled (defaultValue) ─────────────────────────────────────────────

describe("Select – uncontrolled", () => {
  it("defaults to first option when no defaultValue given - BLI: EL-339", () => {
    renderSelect();
    expect(getTrigger().textContent).toContain("Apple");
  });

  it("uses defaultValue to set initial selection - BLI: EL-339", () => {
    renderSelect({ defaultValue: "cherry" });
    expect(getTrigger().textContent).toContain("Cherry");
  });

  it("updates internal selection on click - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderSelect({ defaultValue: "apple" });
    const listbox = await openDropdown(user);
    await user.click(within(listbox).getByText("Banana"));
    expect(getTrigger().textContent).toContain("Banana");
  });
});

// ─── Keyboard navigation ──────────────────────────────────────────────────────

describe("Select – keyboard navigation", () => {
  it("opens with Space key - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderSelect();
    getTrigger().focus();
    await user.keyboard(" ");
    expect(getListbox()).toBeInTheDocument();
  });

  it("opens with Enter key - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderSelect();
    getTrigger().focus();
    await user.keyboard("{Enter}");
    expect(getListbox()).toBeInTheDocument();
  });

  it("opens with F4 key - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderSelect();
    getTrigger().focus();
    await user.keyboard("{F4}");
    expect(getListbox()).toBeInTheDocument();
  });

  it("closes with F4 when already open - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderSelect();
    getTrigger().focus();
    await user.keyboard("{F4}");
    await user.keyboard("{F4}");
    expect(queryListbox()).not.toBeInTheDocument();
  });

  it("opens with Alt+ArrowDown - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderSelect();
    getTrigger().focus();
    await user.keyboard("{Alt>}{ArrowDown}{/Alt}");
    expect(getListbox()).toBeInTheDocument();
  });

  it("closes with Alt+ArrowUp - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderSelect();
    getTrigger().focus();
    await user.keyboard("{F4}"); // open
    await user.keyboard("{Alt>}{ArrowUp}{/Alt}");
    expect(queryListbox()).not.toBeInTheDocument();
  });

  it("closes with Escape key - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderSelect();
    getTrigger().focus();
    await user.keyboard("{F4}");
    expect(getListbox()).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(queryListbox()).not.toBeInTheDocument();
  });

  it("selects focused option on Enter when open - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderSelect({ onChange, defaultValue: "apple" });
    getTrigger().focus();
    await user.keyboard("{F4}"); // open
    await user.keyboard("{ArrowDown}"); // navigate to Banana
    await user.keyboard("{Enter}"); // select
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        selectedOption: expect.objectContaining({ value: "banana" }),
      })
    );
  });

  it("selects focused option on Space when open - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderSelect({ onChange, defaultValue: "apple" });
    getTrigger().focus();
    await user.keyboard("{F4}"); // open
    await user.keyboard("{ArrowDown}"); // navigate to Banana
    await user.keyboard(" "); // select
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        selectedOption: expect.objectContaining({ value: "banana" }),
      })
    );
  });

  it("navigates down with ArrowDown when open - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onLiveChange = vi.fn();
    renderSelect({ onLiveChange, defaultValue: "apple" });
    getTrigger().focus();
    await user.keyboard("{F4}");
    await user.keyboard("{ArrowDown}");
    expect(onLiveChange).toHaveBeenCalledWith(
      expect.objectContaining({
        selectedOption: expect.objectContaining({ value: "banana" }),
      })
    );
  });

  it("navigates up with ArrowUp when open - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onLiveChange = vi.fn();
    renderSelect({ onLiveChange, defaultValue: "cherry" });
    getTrigger().focus();
    await user.keyboard("{F4}");
    await user.keyboard("{ArrowUp}");
    expect(onLiveChange).toHaveBeenCalledWith(
      expect.objectContaining({
        selectedOption: expect.objectContaining({ value: "banana" }),
      })
    );
  });

  it("wraps ArrowDown from last to first option - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onLiveChange = vi.fn();
    renderSelect({ onLiveChange, defaultValue: "cherry" });
    getTrigger().focus();
    await user.keyboard("{F4}");
    await user.keyboard("{ArrowDown}"); // wraps to first
    expect(onLiveChange).toHaveBeenCalledWith(
      expect.objectContaining({
        selectedOption: expect.objectContaining({ value: "apple" }),
      })
    );
  });

  it("wraps ArrowUp from first to last option - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onLiveChange = vi.fn();
    renderSelect({ onLiveChange, defaultValue: "apple" });
    getTrigger().focus();
    await user.keyboard("{F4}");
    await user.keyboard("{ArrowUp}"); // wraps to last
    expect(onLiveChange).toHaveBeenCalledWith(
      expect.objectContaining({
        selectedOption: expect.objectContaining({ value: "cherry" }),
      })
    );
  });

  it("Home key focuses the first non-disabled option - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onLiveChange = vi.fn();
    renderSelect({ onLiveChange, defaultValue: "cherry" });
    getTrigger().focus();
    await user.keyboard("{F4}");
    await user.keyboard("{Home}");
    expect(onLiveChange).toHaveBeenCalledWith(
      expect.objectContaining({
        selectedOption: expect.objectContaining({ value: "apple" }),
      })
    );
  });

  it("End key focuses the last non-disabled option - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onLiveChange = vi.fn();
    renderSelect({ onLiveChange, defaultValue: "apple" });
    getTrigger().focus();
    await user.keyboard("{F4}");
    await user.keyboard("{End}");
    expect(onLiveChange).toHaveBeenCalledWith(
      expect.objectContaining({
        selectedOption: expect.objectContaining({ value: "cherry" }),
      })
    );
  });

  it("ArrowDown selects next option when closed - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderSelect({ onChange, defaultValue: "apple" });
    getTrigger().focus();
    await user.keyboard("{ArrowDown}");
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        selectedOption: expect.objectContaining({ value: "banana" }),
      })
    );
    // Dropdown stays closed
    expect(queryListbox()).not.toBeInTheDocument();
  });

  it("ArrowUp selects previous option when closed - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderSelect({ onChange, defaultValue: "cherry" });
    getTrigger().focus();
    await user.keyboard("{ArrowUp}");
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        selectedOption: expect.objectContaining({ value: "banana" }),
      })
    );
  });

  it("skips disabled options during ArrowDown navigation - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Select onChange={onChange} defaultValue="apple">
        <Option value="apple">Apple</Option>
        <Option value="banana" disabled>Banana</Option>
        <Option value="cherry">Cherry</Option>
      </Select>
    );
    getTrigger().focus();
    await user.keyboard("{F4}");
    await user.keyboard("{ArrowDown}"); // skip disabled Banana → focus Cherry
    await user.keyboard("{Enter}"); // select the focused option (Cherry)
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        selectedOption: expect.objectContaining({ value: "cherry" }),
      })
    );
  });

  it("Escape reverts selection to what it was before opening - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderSelect({ defaultValue: "apple" });
    getTrigger().focus();
    await user.keyboard("{F4}"); // open
    await user.keyboard("{ArrowDown}"); // move focus to Banana (not yet selected)
    await user.keyboard("{Escape}"); // revert
    expect(getTrigger().textContent).toContain("Apple");
  });

  it("does not open with keyboard when disabled - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderSelect({ disabled: true });
    getTrigger().focus();
    await user.keyboard("{F4}");
    expect(queryListbox()).not.toBeInTheDocument();
  });

  it("type-ahead selects matching option when closed - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderSelect({ onChange });
    getTrigger().focus();
    await user.keyboard("b"); // type "b" → Banana
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        selectedOption: expect.objectContaining({ value: "banana" }),
      })
    );
  });

  it("type-ahead focuses matching option when open - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onLiveChange = vi.fn();
    renderSelect({ onLiveChange });
    getTrigger().focus();
    await user.keyboard("{F4}"); // open
    await user.keyboard("c"); // type "c" → Cherry
    expect(onLiveChange).toHaveBeenCalledWith(
      expect.objectContaining({
        selectedOption: expect.objectContaining({ value: "cherry" }),
      })
    );
  });
});

// ─── Disabled state ───────────────────────────────────────────────────────────

describe("Select – disabled state", () => {
  it("does not fire onOpen when disabled and clicked - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    renderSelect({ disabled: true, onOpen });
    await user.click(getTrigger());
    expect(onOpen).not.toHaveBeenCalled();
  });

  it("ignores ArrowDown keyboard navigation when disabled - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderSelect({ disabled: true, onChange });
    getTrigger().focus();
    await user.keyboard("{ArrowDown}");
    expect(onChange).not.toHaveBeenCalled();
  });
});

// ─── Readonly state ───────────────────────────────────────────────────────────

describe("Select – readonly state", () => {
  it("does not open dropdown on click when readonly - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderSelect({ readonly: true });
    await user.click(getTrigger());
    expect(queryListbox()).not.toBeInTheDocument();
  });

  it("shows additionalText in readonly mode with dash separator (default) - BLI: EL-339", () => {
    render(
      <Select value="apple" readonly>
        <Option value="apple" additionalText="Sweet">Apple</Option>
      </Select>
    );
    // The trigger renders "Apple – Sweet" as a span
    expect(getTrigger().textContent).toMatch(/Apple.*–.*Sweet/);
  });

  it("shows additionalText with bullet separator in readonly mode - BLI: EL-339", () => {
    render(
      <Select value="apple" readonly textSeparator={TextSeparator.Bullet}>
        <Option value="apple" additionalText="Sweet">Apple</Option>
      </Select>
    );
    expect(getTrigger().textContent).toMatch(/Apple.*·.*Sweet/);
  });

  it("shows additionalText with vertical line separator in readonly mode - BLI: EL-339", () => {
    render(
      <Select value="apple" readonly textSeparator={TextSeparator.VerticalLine}>
        <Option value="apple" additionalText="Sweet">Apple</Option>
      </Select>
    );
    expect(getTrigger().textContent).toMatch(/Apple.*\|.*Sweet/);
  });
});

// ─── Value states ─────────────────────────────────────────────────────────────

describe("Select – value states", () => {
  it.each([
    ValueState.None,
    ValueState.Positive,
    ValueState.Negative,
    ValueState.Critical,
    ValueState.Information,
  ] as const)("renders without crashing for valueState=%s", (valueState) => {
    renderSelect({ valueState });
    expect(getTrigger()).toBeInTheDocument();
  });

  it("shows valueStateMessage in the popover for Negative state - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderSelect({
      valueState: ValueState.Negative,
      valueStateMessage: "This field is required",
    });
    const listbox = await openDropdown(user);
    // Value state message is rendered in the popover, near the listbox
    const popoverEl = listbox.closest("[data-popover-open]") ?? listbox.parentElement;
    expect(popoverEl?.textContent).toContain("This field is required");
  });

  it("shows valueStateMessage for Critical state - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderSelect({
      valueState: ValueState.Critical,
      valueStateMessage: "Warning: value out of range",
    });
    const listbox = await openDropdown(user);
    const popoverEl = listbox.closest("[data-popover-open]") ?? listbox.parentElement;
    expect(popoverEl?.textContent).toContain("Warning: value out of range");
  });

  it("shows valueStateMessage for Information state - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderSelect({
      valueState: ValueState.Information,
      valueStateMessage: "Informational note",
    });
    const listbox = await openDropdown(user);
    const popoverEl = listbox.closest("[data-popover-open]") ?? listbox.parentElement;
    expect(popoverEl?.textContent).toContain("Informational note");
  });

  it("shows valueStateMessage for Positive state - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderSelect({
      valueState: ValueState.Positive,
      valueStateMessage: "All good",
    });
    const listbox = await openDropdown(user);
    const popoverEl = listbox.closest("[data-popover-open]") ?? listbox.parentElement;
    expect(popoverEl?.textContent).toContain("All good");
  });

  it("renders a screen-reader description for non-None valueState with message - BLI: EL-339", () => {
    renderSelect({
      valueState: ValueState.Negative,
      valueStateMessage: "Error message",
    });
    const srDesc = document.querySelector(".sr-only");
    expect(srDesc).toBeInTheDocument();
    expect(srDesc?.textContent).toContain("Error message");
  });

  it("renders accessibleDescription as sr-only text - BLI: EL-339", () => {
    renderSelect({ accessibleDescription: "Extra context" });
    const srNodes = document.querySelectorAll(".sr-only");
    const texts = Array.from(srNodes).map((n) => n.textContent);
    expect(texts.some((t) => t?.includes("Extra context"))).toBe(true);
  });
});

// ─── Placeholder ──────────────────────────────────────────────────────────────

describe("Select – placeholder", () => {
  it("shows 'Select...' placeholder when there are no children - BLI: EL-339", () => {
    render(<Select />);
    expect(screen.getByText("Select...")).toBeInTheDocument();
  });

  it("placeholder element has text-sapphire-text-tertiary class - BLI: EL-339", () => {
    const { container } = render(<Select />);
    const placeholder = container.querySelector(".text-sapphire-text-tertiary");
    expect(placeholder?.textContent).toBe("Select...");
  });
});

// ─── Ref forwarding ───────────────────────────────────────────────────────────

describe("Select – ref forwarding", () => {
  it("forwards ref to the root div element - BLI: EL-339", () => {
    const ref = React.createRef<HTMLDivElement>();
    renderSelect({ ref } as React.ComponentProps<typeof Select> & { ref?: React.RefObject<HTMLDivElement> });
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("ref.current is the outer wrapper div - BLI: EL-339", () => {
    const ref = React.createRef<HTMLDivElement>();
    const { container } = render(
      <Select ref={ref}>
        <Option value="apple">Apple</Option>
      </Select>
    );
    expect(ref.current).toBe(container.firstChild);
  });
});

// ─── Icon-only mode ───────────────────────────────────────────────────────────

describe("Select – icon-only mode", () => {
  it("renders in icon-only mode when icon prop is given without label - BLI: EL-339", () => {
    const { container } = renderSelect({
      icon: <span data-testid="icon">★</span>,
    });
    expect(screen.getByTestId("icon")).toBeInTheDocument();
    // Root wrapper should have w-auto class (icon-only mode)
    expect(container.firstChild).toHaveClass("w-auto");
  });

  it("renders as full-width when label is also given alongside icon - BLI: EL-339", () => {
    const { container } = renderSelect({
      icon: <span data-testid="icon">★</span>,
      label: "Fruit",
    });
    expect(container.firstChild).not.toHaveClass("w-auto");
  });
});

// ─── Option standalone ────────────────────────────────────────────────────────

describe("Option component", () => {
  it("renders with role=option - BLI: EL-339", () => {
    render(<Option value="apple">Apple</Option>);
    expect(screen.getByRole("option")).toBeInTheDocument();
  });

  it("renders text content - BLI: EL-339", () => {
    render(<Option value="apple">Apple</Option>);
    expect(screen.getByText("Apple")).toBeInTheDocument();
  });

  it("marks as selected when selected=true - BLI: EL-339", () => {
    render(<Option value="apple" selected>Apple</Option>);
    expect(screen.getByRole("option")).toHaveAttribute("aria-selected", "true");
  });

  it("marks as disabled when disabled=true - BLI: EL-339", () => {
    render(<Option value="apple" disabled>Apple</Option>);
    expect(screen.getByRole("option")).toHaveAttribute("aria-disabled", "true");
  });

  it("calls onClick when clicked - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Option value="apple" onClick={onClick}>Apple</Option>);
    await user.click(screen.getByRole("option"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("does not call onClick when disabled and clicked - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Option value="apple" disabled onClick={onClick}>Apple</Option>);
    await user.click(screen.getByRole("option"));
    expect(onClick).not.toHaveBeenCalled();
  });
});

// ─── OptionCustom standalone ──────────────────────────────────────────────────

describe("OptionCustom component", () => {
  it("renders with role=option - BLI: EL-339", () => {
    render(<OptionCustom value="c1"><span>Custom</span></OptionCustom>);
    expect(screen.getByRole("option")).toBeInTheDocument();
  });

  it("renders custom children content - BLI: EL-339", () => {
    render(
      <OptionCustom value="c1">
        <span data-testid="custom-child">Hello</span>
      </OptionCustom>
    );
    expect(screen.getByTestId("custom-child")).toBeInTheDocument();
  });

  it("marks as selected when selected=true - BLI: EL-339", () => {
    render(<OptionCustom value="c1" selected><span>X</span></OptionCustom>);
    expect(screen.getByRole("option")).toHaveAttribute("aria-selected", "true");
  });

  it("marks as disabled when disabled=true - BLI: EL-339", () => {
    render(<OptionCustom value="c1" disabled><span>X</span></OptionCustom>);
    expect(screen.getByRole("option")).toHaveAttribute("aria-disabled", "true");
  });

  it("calls onClick when clicked - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<OptionCustom value="c1" onClick={onClick}><span>X</span></OptionCustom>);
    await user.click(screen.getByRole("option"));
    expect(onClick).toHaveBeenCalledOnce();
  });
});

// ─── Edge cases ───────────────────────────────────────────────────────────────

describe("Select – edge cases", () => {
  it("handles empty children gracefully - BLI: EL-339", () => {
    expect(() => render(<Select />)).not.toThrow();
  });

  it("handles all options disabled (falls back to index 0) - BLI: EL-339", () => {
    render(
      <Select>
        <Option value="apple" disabled>Apple</Option>
        <Option value="banana" disabled>Banana</Option>
      </Select>
    );
    // Should not crash; trigger still renders
    expect(getTrigger()).toBeInTheDocument();
  });

  it("does not fire onChange when ArrowDown is at the last enabled option (closed) - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderSelect({ onChange, defaultValue: "cherry" });
    getTrigger().focus();
    await user.keyboard("{ArrowDown}"); // already last, cannot go further
    expect(onChange).not.toHaveBeenCalled();
  });

  it("does not fire onChange when ArrowUp is at the first enabled option (closed) - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderSelect({ onChange, defaultValue: "apple" });
    getTrigger().focus();
    await user.keyboard("{ArrowUp}"); // already first
    expect(onChange).not.toHaveBeenCalled();
  });

  it("Tab key when open selects focused option and closes - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderSelect({ onChange, defaultValue: "apple" });
    getTrigger().focus();
    await user.keyboard("{F4}"); // open
    await user.keyboard("{ArrowDown}"); // focus Banana
    await user.keyboard("{Tab}");
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        selectedOption: expect.objectContaining({ value: "banana" }),
      })
    );
  });
});

// ── Phase 1B: aria-activedescendant ────────────────────────────────────────

describe("Select aria-activedescendant", () => {
  it("does not set aria-activedescendant when no option is focused - BLI: EL-339", () => {
    renderSelect();
    expect(getTrigger()).not.toHaveAttribute("aria-activedescendant");
  });

  it("sets aria-activedescendant during keyboard navigation - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderSelect({ defaultValue: "apple" });
    getTrigger().focus();
    await user.keyboard("{F4}"); // open
    await user.keyboard("{ArrowDown}"); // focus Banana (index 1)
    const trigger = getTrigger();
    const activeDescendant = trigger.getAttribute("aria-activedescendant");
    expect(activeDescendant).toBe("banana");
  });

  it("options have ids matching their values - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderSelect();
    getTrigger().focus();
    await user.keyboard("{F4}"); // open
    const listbox = getListbox();
    const options = within(listbox).getAllByRole("option", { hidden: true });
    expect(options[0].id).toBe("apple");
    expect(options[1].id).toBe("banana");
    expect(options[2].id).toBe("cherry");
  });

  it("announces option text during keyboard navigation when closed - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderSelect({ defaultValue: "apple" });
    getTrigger().focus();
    await user.keyboard("{ArrowDown}");
    const liveRegion = document.querySelector('[aria-live]');
    expect(liveRegion).toBeInTheDocument();
    expect(liveRegion!.textContent).toContain("selected");
  });
});

// ─── accessibilityAttributes ────────────────────────────────────────────────

describe("Select – accessibilityAttributes", () => {
  it("applies accessibilityAttributes.controls - BLI: EL-339", () => {
    renderSelect({ accessibilityAttributes: { controls: "target-panel" } });
    expect(getTrigger()).toHaveAttribute("aria-controls", expect.stringContaining("target-panel"));
  });
});
