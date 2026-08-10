/**
 * DateTimePicker.test.tsx
 *
 * The DateTimePicker uses ResponsivePopover which internally renders a Popover
 * component. The Popover uses the native Popover API (showPopover/hidePopover)
 * and is not a <dialog> element. This has several consequences for testing
 * under jsdom:
 *
 * 1. jsdom does not implement showPopover/hidePopover or `:popover-open`, so we
 *    polyfill them with a data-attribute marker per the pattern in Dialog.test.tsx.
 *
 * 2. Because the popover element uses `popover="manual"` but never gains an HTML
 *    `open` attribute in jsdom, @testing-library treats its children as hidden.
 *    All queries inside the open popover must pass `{ hidden: true }`.
 *
 * 3. jsdom lacks ResizeObserver and Element.prototype.scrollTo — we stub both.
 *
 * 4. The `displayFormat` prop in DateTimePicker is the DATE-ONLY portion. The
 *    component builds the full format as `${dateDisplayFormat} ${timeDisplayFormat}`.
 *    Do NOT pass a combined date+time string as `displayFormat` or the time will
 *    be appended twice.
 *
 * 5. The test environment locale defaults to en-US with 24h detection. We pass
 *    `timeFormat="24h"` and `displayFormat="MM/dd/yyyy"` explicitly in most
 *    tests via FORMAT_24H for determinism. The CLDR medium format for en-US is
 *    "MMM d, y" — always set displayFormat explicitly when testing formatted values.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, within, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { DateTimePicker } from "./DateTimePicker";
import { TimePicker } from "./TimePicker";
import type { DateTimePickerRef } from "../../types/datetimepicker";
import { ValueState } from "../../types/datepicker";

// ---------------------------------------------------------------------------
// Mock isPhone to always return false (desktop mode) in tests
// ---------------------------------------------------------------------------

vi.mock("../../lib/Device", () => ({
  isPhone: () => false,
  isTablet: () => false,
  isDesktop: () => true,
  supportsTouch: () => false,
  isIOS: () => false,
  isChrome: () => false,
  isSafari: () => false,
}));

// ---------------------------------------------------------------------------
// Global stubs (once, never restored)
// ---------------------------------------------------------------------------

if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
}

if (!Element.prototype.scrollTo) {
  Element.prototype.scrollTo = function () {} as unknown as typeof Element.prototype.scrollTo;
}

if (!window.scrollTo) {
  window.scrollTo = function () {} as unknown as typeof window.scrollTo;
}

// Mock getBoundingClientRect to return a non-zero rect so the Popover's
// reposition() logic does not interpret every element as "off-screen" and
// call doClose().  jsdom always returns all-zeros which would trigger the
// "opener removed from DOM" guard in reposition() and close the popover.
Element.prototype.getBoundingClientRect = function () {
  return {
    top: 100, bottom: 200, left: 100, right: 300,
    width: 200, height: 100, x: 100, y: 100,
    toJSON() { return this; },
  } as DOMRect;
};

// ---------------------------------------------------------------------------
// Popover API polyfill - set once in beforeAll
// ---------------------------------------------------------------------------

const POPOVER_OPEN_ATTR = "data-popover-open";

/**
 * Install the Popover API polyfill once per test file.
 * Uses a marker attribute instead of the native :popover-open pseudo-class.
 */
function installPopoverPolyfill() {
  HTMLElement.prototype.showPopover = function () {
    this.setAttribute(POPOVER_OPEN_ATTR, "true");
  };
  HTMLElement.prototype.hidePopover = function () {
    this.removeAttribute(POPOVER_OPEN_ATTR);
  };
  const origMatches = Element.prototype.matches;
  Element.prototype.matches = function (selector: string): boolean {
    if (selector === ":popover-open") {
      return this.hasAttribute(POPOVER_OPEN_ATTR);
    }
    return origMatches.call(this, selector);
  };
}

// Install once for all tests
installPopoverPolyfill();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * FORMAT_24H provides props that give deterministic 24-hour display in en-US.
 * With en-US locale + timeFormat="24h" + displayFormat="MM/dd/yyyy",
 * effectiveDisplayFormat = "MM/dd/yyyy HH:mm".
 * NOTE: do NOT include a combined date+time string as displayFormat (see file header note #4).
 */
const FORMAT_24H = {
  timeFormat: "24h" as const,
  valueFormat: "yyyy-MM-dd'T'HH:mm:ss",
  displayFormat: "MM/dd/yyyy",
};

/**
 * Render DateTimePicker with the popover already open.
 * Flushes React effects so that the popover DOM is in place.
 */
async function renderOpen(props: React.ComponentProps<typeof DateTimePicker> = {}) {
  const user = userEvent.setup();
  const utils = render(<DateTimePicker {...FORMAT_24H} {...props} />);
  const btn = screen.getByRole("button", { name: /open date and time picker/i });
  await user.click(btn);
  await act(async () => {});
  return { user, ...utils };
}

// ---------------------------------------------------------------------------
// TimePicker – isolated unit tests
// ---------------------------------------------------------------------------

describe("TimePicker", () => {
  it("renders Hr and Min columns in 24h mode - BLI: EL-339", () => {
    render(
      <TimePicker hours={9} minutes={30} seconds={0} onTimeChange={vi.fn()} />
    );
    expect(screen.getByRole("listbox", { name: /hr/i })).toBeInTheDocument();
    expect(screen.getByRole("listbox", { name: /min/i })).toBeInTheDocument();
    expect(screen.queryByRole("listbox", { name: /sec/i })).not.toBeInTheDocument();
  });

  it("renders Sec column when showSeconds=true - BLI: EL-339", () => {
    render(
      <TimePicker hours={0} minutes={0} seconds={0} showSeconds onTimeChange={vi.fn()} />
    );
    expect(screen.getByRole("listbox", { name: /sec/i })).toBeInTheDocument();
  });

  it("renders AM/PM column in 12h mode - BLI: EL-339", () => {
    render(
      <TimePicker hours={14} minutes={0} seconds={0} timeFormat="12h" onTimeChange={vi.fn()} />
    );
    expect(screen.getByRole("listbox", { name: /ap/i })).toBeInTheDocument();
  });

  it("does not render AM/PM column in 24h mode - BLI: EL-339", () => {
    render(
      <TimePicker hours={14} minutes={0} seconds={0} timeFormat="24h" onTimeChange={vi.fn()} />
    );
    expect(screen.queryByRole("listbox", { name: /ap/i })).not.toBeInTheDocument();
  });

  it("marks the selected hour as aria-selected in 24h mode - BLI: EL-339", () => {
    render(
      <TimePicker hours={9} minutes={30} seconds={0} onTimeChange={vi.fn()} />
    );
    const hourList = screen.getByRole("listbox", { name: /hr/i });
    const selected = within(hourList).getAllByRole("option", { selected: true });
    expect(selected).toHaveLength(1);
    expect(selected[0]).toHaveTextContent("09");
  });

  it("marks the selected minute as aria-selected - BLI: EL-339", () => {
    render(
      <TimePicker hours={0} minutes={45} seconds={0} onTimeChange={vi.fn()} />
    );
    const minList = screen.getByRole("listbox", { name: /min/i });
    const selected = within(minList).getAllByRole("option", { selected: true });
    expect(selected[0]).toHaveTextContent("45");
  });

  it("marks the selected second as aria-selected - BLI: EL-339", () => {
    render(
      <TimePicker hours={0} minutes={0} seconds={20} showSeconds onTimeChange={vi.fn()} />
    );
    const secList = screen.getByRole("listbox", { name: /sec/i });
    const selected = within(secList).getAllByRole("option", { selected: true });
    expect(selected[0]).toHaveTextContent("20");
  });

  it("calls onTimeChange when a different hour is clicked - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <TimePicker hours={0} minutes={0} seconds={0} onTimeChange={onChange} />
    );
    const hourList = screen.getByRole("listbox", { name: /hr/i });
    await user.click(within(hourList).getByRole("option", { name: "05" }));
    expect(onChange).toHaveBeenCalledWith(5, 0, 0);
  });

  it("calls onTimeChange when a different minute is clicked - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <TimePicker hours={10} minutes={0} seconds={0} onTimeChange={onChange} />
    );
    const minList = screen.getByRole("listbox", { name: /min/i });
    await user.click(within(minList).getByRole("option", { name: "15" }));
    expect(onChange).toHaveBeenCalledWith(10, 15, 0);
  });

  it("calls onTimeChange when a second is clicked - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <TimePicker hours={0} minutes={0} seconds={0} showSeconds onTimeChange={onChange} />
    );
    const secList = screen.getByRole("listbox", { name: /sec/i });
    await user.click(within(secList).getByRole("option", { name: "30" }));
    expect(onChange).toHaveBeenCalledWith(0, 0, 30);
  });

  it("respects minuteStep - BLI: EL-339", () => {
    render(
      <TimePicker hours={0} minutes={0} seconds={0} minuteStep={15} onTimeChange={vi.fn()} />
    );
    const minList = screen.getByRole("listbox", { name: /min/i });
    const options = within(minList).getAllByRole("option");
    expect(options.map((o) => o.textContent)).toEqual(["00", "15", "30", "45"]);
  });

  it("respects secondStep - BLI: EL-339", () => {
    render(
      <TimePicker hours={0} minutes={0} seconds={0} showSeconds secondStep={30} onTimeChange={vi.fn()} />
    );
    const secList = screen.getByRole("listbox", { name: /sec/i });
    const options = within(secList).getAllByRole("option");
    expect(options.map((o) => o.textContent)).toEqual(["00", "30"]);
  });

  it("generates 24 hour options in 24h mode - BLI: EL-339", () => {
    render(
      <TimePicker hours={0} minutes={0} seconds={0} timeFormat="24h" onTimeChange={vi.fn()} />
    );
    const hourList = screen.getByRole("listbox", { name: /hr/i });
    const options = within(hourList).getAllByRole("option");
    expect(options).toHaveLength(24);
    expect(options[0]).toHaveTextContent("00");
    expect(options[23]).toHaveTextContent("23");
  });

  it("generates 12 hour options in 12h mode - BLI: EL-339", () => {
    render(
      <TimePicker hours={0} minutes={0} seconds={0} timeFormat="12h" onTimeChange={vi.fn()} />
    );
    const hourList = screen.getByRole("listbox", { name: /hr/i });
    expect(within(hourList).getAllByRole("option")).toHaveLength(12);
  });

  it("converts 12h AM hour selection to 24h correctly - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    // hours=2 is AM (< 12)
    render(
      <TimePicker hours={2} minutes={0} seconds={0} timeFormat="12h" onTimeChange={onChange} />
    );
    const hourList = screen.getByRole("listbox", { name: /hr/i });
    await user.click(within(hourList).getByRole("option", { name: "03" }));
    // Period is AM; value h=3, h24 = 3
    expect(onChange).toHaveBeenCalledWith(3, 0, 0);
  });

  it("converts 12h PM hour selection to 24h correctly - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    // hours=14 is PM
    render(
      <TimePicker hours={14} minutes={0} seconds={0} timeFormat="12h" onTimeChange={onChange} />
    );
    const hourList = screen.getByRole("listbox", { name: /hr/i });
    // click "03" → period PM → h24 = 3 + 12 = 15
    await user.click(within(hourList).getByRole("option", { name: "03" }));
    expect(onChange).toHaveBeenCalledWith(15, 0, 0);
  });

  it("converts value=0 in 12h mode (midnight) to 24h=0 - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <TimePicker hours={0} minutes={0} seconds={0} timeFormat="12h" onTimeChange={onChange} />
    );
    const hourList = screen.getByRole("listbox", { name: /hr/i });
    // value=0 → label "12" (midnight); AM; h24 = 0
    await user.click(within(hourList).getByRole("option", { name: "12" }));
    expect(onChange).toHaveBeenCalledWith(0, 0, 0);
  });

  it("toggles AM to PM when PM period is selected - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <TimePicker hours={9} minutes={0} seconds={0} timeFormat="12h" onTimeChange={onChange} />
    );
    const apList = screen.getByRole("listbox", { name: /ap/i });
    await user.click(within(apList).getByRole("option", { name: "PM" }));
    // hours=9 (AM) → PM: 9+12=21
    expect(onChange).toHaveBeenCalledWith(21, 0, 0);
  });

  it("toggles PM to AM when AM period is selected - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <TimePicker hours={14} minutes={0} seconds={0} timeFormat="12h" onTimeChange={onChange} />
    );
    const apList = screen.getByRole("listbox", { name: /ap/i });
    await user.click(within(apList).getByRole("option", { name: "AM" }));
    // hours=14 (PM) → AM: 14-12=2
    expect(onChange).toHaveBeenCalledWith(2, 0, 0);
  });

  it("navigates hours with ArrowDown key - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <TimePicker hours={5} minutes={0} seconds={0} onTimeChange={onChange} />
    );
    const hourList = screen.getByRole("listbox", { name: /hr/i });
    const selected = within(hourList).getAllByRole("option", { selected: true })[0];
    selected.focus();
    await user.keyboard("{ArrowDown}");
    expect(onChange).toHaveBeenCalledWith(6, 0, 0);
  });

  it("navigates hours with ArrowUp key - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <TimePicker hours={5} minutes={0} seconds={0} onTimeChange={onChange} />
    );
    const hourList = screen.getByRole("listbox", { name: /hr/i });
    const selected = within(hourList).getAllByRole("option", { selected: true })[0];
    selected.focus();
    await user.keyboard("{ArrowUp}");
    expect(onChange).toHaveBeenCalledWith(4, 0, 0);
  });

  it("does not navigate ArrowUp past the first item - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <TimePicker hours={0} minutes={0} seconds={0} onTimeChange={onChange} />
    );
    const hourList = screen.getByRole("listbox", { name: /hr/i });
    const selected = within(hourList).getAllByRole("option", { selected: true })[0];
    selected.focus();
    await user.keyboard("{ArrowUp}");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("does not navigate ArrowDown past the last item - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <TimePicker hours={23} minutes={0} seconds={0} onTimeChange={onChange} />
    );
    const hourList = screen.getByRole("listbox", { name: /hr/i });
    const selected = within(hourList).getAllByRole("option", { selected: true })[0];
    selected.focus();
    await user.keyboard("{ArrowDown}");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("selects the focused item with Enter key - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <TimePicker hours={5} minutes={0} seconds={0} onTimeChange={onChange} />
    );
    const hourList = screen.getByRole("listbox", { name: /hr/i });
    const selected = within(hourList).getAllByRole("option", { selected: true })[0];
    selected.focus();
    await user.keyboard("{Enter}");
    expect(onChange).toHaveBeenCalledWith(5, 0, 0);
  });

  it("selects the focused item with Space key - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <TimePicker hours={5} minutes={0} seconds={0} onTimeChange={onChange} />
    );
    const hourList = screen.getByRole("listbox", { name: /hr/i });
    const selected = within(hourList).getAllByRole("option", { selected: true })[0];
    selected.focus();
    await user.keyboard(" ");
    expect(onChange).toHaveBeenCalledWith(5, 0, 0);
  });

  it("has accessible group role labeled 'Time picker' - BLI: EL-339", () => {
    render(
      <TimePicker hours={0} minutes={0} seconds={0} onTimeChange={vi.fn()} />
    );
    expect(screen.getByRole("group", { name: /time picker/i })).toBeInTheDocument();
  });

  it("accepts additional className prop - BLI: EL-339", () => {
    const { container } = render(
      <TimePicker hours={0} minutes={0} seconds={0} onTimeChange={vi.fn()} className="custom-tp" />
    );
    expect(container.firstChild).toHaveClass("custom-tp");
  });
});

// ---------------------------------------------------------------------------
// DateTimePicker – basic rendering
// ---------------------------------------------------------------------------

describe("DateTimePicker – basic rendering", () => {
  it("renders the text input field - BLI: EL-339", () => {
    const { container } = render(<DateTimePicker />);
    expect(container.querySelector("input[type='text']")).toBeInTheDocument();
  });

  it("renders the calendar toggle button - BLI: EL-339", () => {
    render(<DateTimePicker />);
    expect(
      screen.getByRole("button", { name: /open date and time picker/i })
    ).toBeInTheDocument();
  });

  it("applies data-testid to the container element - BLI: EL-339", () => {
    render(<DateTimePicker data-testid="dtp" />);
    expect(screen.getByTestId("dtp")).toBeInTheDocument();
  });

  it("applies id to the input element - BLI: EL-339", () => {
    const { container } = render(<DateTimePicker id="my-dtp" />);
    expect(container.querySelector("#my-dtp")).toBeInTheDocument();
  });

  it("applies className to the root element - BLI: EL-339", () => {
    const { container } = render(<DateTimePicker className="custom-class" />);
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("applies inline style to the root element - BLI: EL-339", () => {
    const { container } = render(<DateTimePicker style={{ width: 300 }} />);
    expect(container.firstChild).toHaveStyle({ width: "300px" });
  });

  it("has a non-empty placeholder derived from the display format - BLI: EL-339", () => {
    const { container } = render(<DateTimePicker />);
    const input = container.querySelector("input[type='text']") as HTMLInputElement;
    expect(input.placeholder.length).toBeGreaterThan(0);
  });

  it("accepts a custom placeholder - BLI: EL-339", () => {
    const { container } = render(<DateTimePicker placeholder="Pick date and time" />);
    const input = container.querySelector("input[type='text']") as HTMLInputElement;
    expect(input.placeholder).toBe("Pick date and time");
  });

  it("renders hidden input for form name - BLI: EL-339", () => {
    const { container } = render(<DateTimePicker name="appointment" />);
    expect(container.querySelector("input[name='appointment']")).toBeInTheDocument();
  });

  it("sets aria-label via accessibleName - BLI: EL-339", () => {
    const { container } = render(<DateTimePicker accessibleName="Appointment date and time" />);
    const input = container.querySelector("input[type='text']") as HTMLInputElement;
    expect(input).toHaveAttribute("aria-label", "Appointment date and time");
  });

  it("sets aria-labelledby via accessibleNameRef - BLI: EL-339", () => {
    const { container } = render(<DateTimePicker accessibleNameRef="label-id" />);
    const input = container.querySelector("input[type='text']") as HTMLInputElement;
    expect(input).toHaveAttribute("aria-labelledby", "label-id");
  });

  it("sets required attribute on the input - BLI: EL-339", () => {
    const { container } = render(<DateTimePicker required />);
    expect(container.querySelector("input[type='text']")).toBeRequired();
  });
});

// ---------------------------------------------------------------------------
// DateTimePicker – disabled / readonly
// ---------------------------------------------------------------------------

describe("DateTimePicker – disabled/readonly", () => {
  it("disables the text input when disabled - BLI: EL-339", () => {
    const { container } = render(<DateTimePicker disabled />);
    expect(container.querySelector("input[type='text']")).toBeDisabled();
  });

  it("disables the toggle button when disabled - BLI: EL-339", () => {
    render(<DateTimePicker disabled />);
    expect(
      screen.getByRole("button", { name: /open date and time picker/i })
    ).toBeDisabled();
  });

  it("does not open popover on click when disabled - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    render(<DateTimePicker disabled onOpen={onOpen} />);
    await user.click(screen.getByRole("button", { name: /open date and time picker/i }));
    expect(onOpen).not.toHaveBeenCalled();
  });

  it("marks the input as readonly when readonly prop is set - BLI: EL-339", () => {
    const { container } = render(<DateTimePicker readonly />);
    expect(container.querySelector("input[type='text']")).toHaveAttribute("readonly");
  });

  it("disables the toggle button when readonly - BLI: EL-339", () => {
    render(<DateTimePicker readonly />);
    expect(
      screen.getByRole("button", { name: /open date and time picker/i })
    ).toBeDisabled();
  });

  it("does not open popover on click when readonly - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    render(<DateTimePicker readonly onOpen={onOpen} />);
    await user.click(screen.getByRole("button", { name: /open date and time picker/i }));
    expect(onOpen).not.toHaveBeenCalled();
  });

  it("does not show clear icon when disabled and value is set - BLI: EL-339", () => {
    render(
      <DateTimePicker disabled value="2024-06-15T10:30:00" {...FORMAT_24H} />
    );
    expect(screen.queryByRole("button", { name: /clear datetime/i })).not.toBeInTheDocument();
  });

  it("does not show clear icon when readonly and value is set - BLI: EL-339", () => {
    render(
      <DateTimePicker readonly value="2024-06-15T10:30:00" {...FORMAT_24H} />
    );
    expect(screen.queryByRole("button", { name: /clear datetime/i })).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// DateTimePicker – opening and closing popover
// ---------------------------------------------------------------------------

describe("DateTimePicker – opening and closing", () => {
  it("calls onOpen when the popover opens - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    render(<DateTimePicker {...FORMAT_24H} onOpen={onOpen} />);
    await user.click(screen.getByRole("button", { name: /open date and time picker/i }));
    await act(async () => {});
    expect(onOpen).toHaveBeenCalled();
  });

  it("sets aria-expanded=false on toggle button when closed - BLI: EL-339", () => {
    render(<DateTimePicker />);
    expect(
      screen.getByRole("button", { name: /open date and time picker/i })
    ).toHaveAttribute("aria-expanded", "false");
  });

  it("sets aria-expanded=true on toggle button when open - BLI: EL-339", async () => {
    await renderOpen();
    expect(
      screen.getByRole("button", { name: /open date and time picker/i })
    ).toHaveAttribute("aria-expanded", "true");
  });

  it("calls onClose when Cancel button is clicked - BLI: EL-339", async () => {
    const onClose = vi.fn();
    const { user } = await renderOpen({ onClose });
    await user.click(screen.getByRole("button", { name: /cancel/i, hidden: true }));
    expect(onClose).toHaveBeenCalled();
  });

  it("calls onClose when OK button is clicked - BLI: EL-339", async () => {
    const onClose = vi.fn();
    const { user } = await renderOpen({ onClose });
    await user.click(screen.getByRole("button", { name: /^ok$/i, hidden: true }));
    expect(onClose).toHaveBeenCalled();
  });

  it("opens and closes with F4 keyboard shortcut - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    const { container } = render(<DateTimePicker {...FORMAT_24H} onOpen={onOpen} />);
    const input = container.querySelector("input[type='text']") as HTMLInputElement;
    input.focus();

    await user.keyboard("{F4}");
    await act(async () => {});
    expect(onOpen).toHaveBeenCalled();
    // aria-expanded reflects open state
    expect(
      screen.getByRole("button", { name: /open date and time picker/i })
    ).toHaveAttribute("aria-expanded", "true");
  });

  it("opens with Alt+ArrowDown keyboard shortcut - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    const { container } = render(<DateTimePicker {...FORMAT_24H} onOpen={onOpen} />);
    const input = container.querySelector("input[type='text']") as HTMLInputElement;
    input.focus();
    await user.keyboard("{Alt>}{ArrowDown}{/Alt}");
    await act(async () => {});
    expect(onOpen).toHaveBeenCalledOnce();
  });

  it("closes with Alt+ArrowUp keyboard shortcut when open - BLI: EL-339", async () => {
    const onClose = vi.fn();
    const { user, container } = await renderOpen({ onClose });
    const input = container.querySelector("input[type='text']") as HTMLInputElement;
    input.focus();
    await user.keyboard("{Alt>}{ArrowUp}{/Alt}");
    await act(async () => {});
    // After Alt+ArrowUp the popover closes
    expect(
      screen.getByRole("button", { name: /open date and time picker/i })
    ).toHaveAttribute("aria-expanded", "false");
  });

  it("respects controlled open=true prop - BLI: EL-339", async () => {
    render(<DateTimePicker {...FORMAT_24H} open={true} />);
    await act(async () => {});
    // The popover is in DOM but may be hidden; check aria-expanded
    expect(
      screen.getByRole("button", { name: /open date and time picker/i })
    ).toHaveAttribute("aria-expanded", "true");
  });

  it("respects controlled open=false prop - BLI: EL-339", () => {
    render(<DateTimePicker {...FORMAT_24H} open={false} />);
    expect(
      screen.getByRole("button", { name: /open date and time picker/i })
    ).toHaveAttribute("aria-expanded", "false");
  });

  it("calls onClose but stays aria-expanded when controlled open=true and Cancel is clicked - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<DateTimePicker {...FORMAT_24H} open={true} onClose={onClose} />);
    await act(async () => {});
    await user.click(screen.getByRole("button", { name: /cancel/i, hidden: true }));
    expect(onClose).toHaveBeenCalled();
    // Controlled open=true hasn't changed, so the component still reports open
    expect(
      screen.getByRole("button", { name: /open date and time picker/i })
    ).toHaveAttribute("aria-expanded", "true");
  });
});

// ---------------------------------------------------------------------------
// DateTimePicker – uncontrolled (defaultValue)
// ---------------------------------------------------------------------------

describe("DateTimePicker – uncontrolled", () => {
  it("renders an empty input with no defaultValue - BLI: EL-339", () => {
    const { container } = render(<DateTimePicker />);
    const input = container.querySelector("input[type='text']") as HTMLInputElement;
    expect(input.value).toBe("");
  });

  it("pre-fills the input when defaultValue is provided - BLI: EL-339", () => {
    const { container } = render(
      <DateTimePicker defaultValue="2024-06-15T10:30:00" {...FORMAT_24H} />
    );
    const input = container.querySelector("input[type='text']") as HTMLInputElement;
    // en-US + 24h → "MM/dd/yyyy HH:mm"
    expect(input.value).toBe("06/15/2024 10:30");
  });

  it("calls onChange with valid: true when typing a valid datetime and blurring - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = render(
      <DateTimePicker onChange={onChange} {...FORMAT_24H} />
    );
    const input = container.querySelector("input[type='text']") as HTMLInputElement;
    await user.click(input);
    await user.type(input, "06/15/2024 10:30");
    await user.tab();
    expect(onChange).toHaveBeenCalled();
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall.valid).toBe(true);
    expect(lastCall.dateValue).toBeInstanceOf(Date);
  });

  it("calls onChange with valid: false when typing invalid text and blurring - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = render(
      <DateTimePicker onChange={onChange} {...FORMAT_24H} />
    );
    const input = container.querySelector("input[type='text']") as HTMLInputElement;
    await user.click(input);
    await user.type(input, "not a date");
    await user.tab();
    expect(onChange).toHaveBeenCalled();
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall.valid).toBe(false);
    expect(lastCall.dateValue).toBeNull();
  });

  it("calls onChange with empty value when clearing the input and blurring - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = render(
      <DateTimePicker
        defaultValue="2024-06-15T10:30:00"
        onChange={onChange}
        {...FORMAT_24H}
      />
    );
    const input = container.querySelector("input[type='text']") as HTMLInputElement;
    await user.click(input);
    await user.keyboard("{Control>}a{/Control}");
    await user.keyboard("{Backspace}");
    await user.tab();
    expect(onChange).toHaveBeenCalled();
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall.value).toBe("");
    expect(lastCall.valid).toBe(true);
  });

  it("commits value on Enter key press - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = render(
      <DateTimePicker onChange={onChange} {...FORMAT_24H} />
    );
    const input = container.querySelector("input[type='text']") as HTMLInputElement;
    await user.click(input);
    await user.type(input, "06/15/2024 10:30");
    await user.keyboard("{Enter}");
    expect(onChange).toHaveBeenCalled();
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall.valid).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// DateTimePicker – controlled value
// ---------------------------------------------------------------------------

describe("DateTimePicker – controlled value", () => {
  it("displays the controlled value in the input - BLI: EL-339", () => {
    const { container } = render(
      <DateTimePicker value="2024-03-20T14:45:00" {...FORMAT_24H} />
    );
    const input = container.querySelector("input[type='text']") as HTMLInputElement;
    expect(input.value).toBe("03/20/2024 14:45");
  });

  it("updates the displayed value when the controlled value changes - BLI: EL-339", () => {
    const { container, rerender } = render(
      <DateTimePicker value="2024-03-20T14:45:00" {...FORMAT_24H} />
    );
    rerender(<DateTimePicker value="2024-07-04T09:00:00" {...FORMAT_24H} />);
    const input = container.querySelector("input[type='text']") as HTMLInputElement;
    expect(input.value).toBe("07/04/2024 09:00");
  });

  it("calls onChange when the OK button is clicked in controlled mode - BLI: EL-339", async () => {
    const onChange = vi.fn();
    const { user } = await renderOpen({
      value: "2024-03-20T14:45:00",
      onChange,
    });
    await user.click(screen.getByRole("button", { name: /^ok$/i, hidden: true }));
    expect(onChange).toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// DateTimePicker – onChange / onInput callbacks
// ---------------------------------------------------------------------------

describe("DateTimePicker – callbacks", () => {
  it("fires onInput on every keystroke - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onInput = vi.fn();
    const { container } = render(
      <DateTimePicker onInput={onInput} {...FORMAT_24H} />
    );
    const input = container.querySelector("input[type='text']") as HTMLInputElement;
    await user.click(input);
    await user.type(input, "0");
    expect(onInput).toHaveBeenCalled();
    const firstCall = onInput.mock.calls[0][0];
    expect(firstCall).toHaveProperty("value");
    expect(firstCall).toHaveProperty("valid");
  });

  it("fires onInput with valid=true when text forms a complete datetime - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onInput = vi.fn();
    const { container } = render(
      <DateTimePicker onInput={onInput} {...FORMAT_24H} />
    );
    const input = container.querySelector("input[type='text']") as HTMLInputElement;
    await user.click(input);
    await user.type(input, "06/15/2024 10:30");
    const lastCall = onInput.mock.calls[onInput.mock.calls.length - 1][0];
    expect(lastCall.valid).toBe(true);
    expect(lastCall.dateValue).toBeInstanceOf(Date);
  });

  it("fires onInput with valid=false for incomplete text - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onInput = vi.fn();
    const { container } = render(
      <DateTimePicker onInput={onInput} {...FORMAT_24H} />
    );
    const input = container.querySelector("input[type='text']") as HTMLInputElement;
    await user.click(input);
    await user.type(input, "06/15");
    const lastCall = onInput.mock.calls[onInput.mock.calls.length - 1][0];
    expect(lastCall.valid).toBe(false);
  });

  it("calls onChange with the ISO value string on commit - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = render(
      <DateTimePicker onChange={onChange} {...FORMAT_24H} />
    );
    const input = container.querySelector("input[type='text']") as HTMLInputElement;
    await user.click(input);
    await user.type(input, "06/15/2024 10:30");
    await user.tab();
    const call = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(call.value).toMatch(/2024-06-15T10:30/);
  });

  it("fires onValueStateChange on invalid input blur - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onValueStateChange = vi.fn();
    const { container } = render(
      <DateTimePicker onValueStateChange={onValueStateChange} {...FORMAT_24H} />
    );
    const input = container.querySelector("input[type='text']") as HTMLInputElement;
    await user.click(input);
    await user.type(input, "bad value");
    await user.tab();
    expect(onValueStateChange).toHaveBeenCalled();
    const call = onValueStateChange.mock.calls[onValueStateChange.mock.calls.length - 1][0];
    expect(call.valueState).toBe(ValueState.Negative);
    expect(call.valid).toBe(false);
  });

  it("onValueStateChange returning false prevents the state update - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onValueStateChange = vi.fn().mockReturnValue(false);
    const { container } = render(
      <DateTimePicker onValueStateChange={onValueStateChange} {...FORMAT_24H} />
    );
    const input = container.querySelector("input[type='text']") as HTMLInputElement;
    await user.click(input);
    await user.type(input, "bad value");
    await user.tab();
    // Alert should NOT appear because the value state change was blocked
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// DateTimePicker – clear icon
// ---------------------------------------------------------------------------

describe("DateTimePicker – clear icon", () => {
  it("does not show clear icon when input is empty - BLI: EL-339", () => {
    render(<DateTimePicker />);
    expect(screen.queryByRole("button", { name: /clear datetime/i })).not.toBeInTheDocument();
  });

  it("shows clear icon when a value is present - BLI: EL-339", () => {
    render(
      <DateTimePicker value="2024-06-15T10:30:00" {...FORMAT_24H} />
    );
    expect(screen.getByRole("button", { name: /clear datetime/i })).toBeInTheDocument();
  });

  it("hides clear icon when showClearIcon=false - BLI: EL-339", () => {
    render(
      <DateTimePicker value="2024-06-15T10:30:00" showClearIcon={false} {...FORMAT_24H} />
    );
    expect(screen.queryByRole("button", { name: /clear datetime/i })).not.toBeInTheDocument();
  });

  it("clears the value and fires onChange when clear button is clicked - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <DateTimePicker value="2024-06-15T10:30:00" {...FORMAT_24H} onChange={onChange} />
    );
    await user.click(screen.getByRole("button", { name: /clear datetime/i }));
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: "", dateValue: null, valid: true })
    );
  });

  it("clears the input text when clear button is clicked (uncontrolled) - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <DateTimePicker defaultValue="2024-06-15T10:30:00" {...FORMAT_24H} />
    );
    await user.click(screen.getByRole("button", { name: /clear datetime/i }));
    const input = container.querySelector("input[type='text']") as HTMLInputElement;
    expect(input.value).toBe("");
    expect(screen.queryByRole("button", { name: /clear datetime/i })).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// DateTimePicker – value state
// ---------------------------------------------------------------------------

describe("DateTimePicker – value state", () => {
  it("shows the custom error message when valueState=Negative - BLI: EL-339", () => {
    render(
      <DateTimePicker valueState={ValueState.Negative} valueStateMessage="Invalid date" />
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Invalid date");
  });

  it("shows default error message for Negative state after invalid blur - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const { container } = render(<DateTimePicker {...FORMAT_24H} />);
    const input = container.querySelector("input[type='text']") as HTMLInputElement;
    await user.click(input);
    await user.type(input, "bad input");
    await user.tab();
    expect(screen.getByRole("alert")).toHaveTextContent(/invalid date/i);
  });

  it("shows a positive value state message - BLI: EL-339", () => {
    render(
      <DateTimePicker valueState={ValueState.Positive} valueStateMessage="Date confirmed" />
    );
    expect(screen.getByText("Date confirmed")).toBeInTheDocument();
  });

  it("shows an information value state message - BLI: EL-339", () => {
    render(
      <DateTimePicker valueState={ValueState.Information} valueStateMessage="Choose a future date" />
    );
    expect(screen.getByText("Choose a future date")).toBeInTheDocument();
  });

  it("shows a critical value state message - BLI: EL-339", () => {
    render(
      <DateTimePicker valueState={ValueState.Critical} valueStateMessage="Warning: past date" />
    );
    expect(screen.getByText("Warning: past date")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// DateTimePicker – popover content (calendar + time)
// ---------------------------------------------------------------------------

describe("DateTimePicker – popover content", () => {
  it("reveals the time picker when the popover is open - BLI: EL-339", async () => {
    await renderOpen();
    expect(
      screen.getByRole("group", { name: /time picker/i, hidden: true })
    ).toBeInTheDocument();
  });

  it("renders OK and Cancel buttons in the popover - BLI: EL-339", async () => {
    await renderOpen();
    expect(screen.getByRole("button", { name: /^ok$/i, hidden: true })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i, hidden: true })).toBeInTheDocument();
  });

  it("OK button commits a time change and fires onChange - BLI: EL-339", async () => {
    const onChange = vi.fn();
    const { user } = await renderOpen({
      defaultValue: "2024-06-15T10:30:00",
      onChange,
    });

    const hourList = screen.getByRole("listbox", { name: /hr/i, hidden: true });
    await user.click(within(hourList).getByRole("option", { name: "11", hidden: true }));
    await user.click(screen.getByRole("button", { name: /^ok$/i, hidden: true }));

    expect(onChange).toHaveBeenCalled();
    const call = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(call.valid).toBe(true);
    expect(call.value).toMatch(/T11:/);
  });

  it("Cancel button closes the popover without committing changes - BLI: EL-339", async () => {
    const onChange = vi.fn();
    const { user } = await renderOpen({
      defaultValue: "2024-06-15T10:30:00",
      onChange,
    });

    const hourList = screen.getByRole("listbox", { name: /hr/i, hidden: true });
    await user.click(within(hourList).getByRole("option", { name: "11", hidden: true }));
    await user.click(screen.getByRole("button", { name: /cancel/i, hidden: true }));

    const wasCalled = onChange.mock.calls.some((c) => c[0]?.value?.includes("T11:"));
    expect(wasCalled).toBe(false);
  });

  it("shows the seconds column when showSeconds=true - BLI: EL-339", async () => {
    await renderOpen({ showSeconds: true });
    expect(screen.getByRole("listbox", { name: /sec/i, hidden: true })).toBeInTheDocument();
  });

  it("shows AM/PM column when timeFormat=12h - BLI: EL-339", async () => {
    await renderOpen({ timeFormat: "12h" });
    expect(screen.getByRole("listbox", { name: /ap/i, hidden: true })).toBeInTheDocument();
  });

  it("does not show AM/PM column for 24h format - BLI: EL-339", async () => {
    await renderOpen({ timeFormat: "24h" });
    expect(screen.queryByRole("listbox", { name: /ap/i, hidden: true })).not.toBeInTheDocument();
  });

  it("syncs the temp time with the current selection when popover opens - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(
      <DateTimePicker defaultValue="2024-06-15T14:30:00" {...FORMAT_24H} />
    );
    await user.click(screen.getByRole("button", { name: /open date and time picker/i }));
    await act(async () => {});

    const hourList = screen.getByRole("listbox", { name: /hr/i, hidden: true });
    const selectedHour = within(hourList).getAllByRole("option", { selected: true, hidden: true })[0];
    expect(selectedHour).toHaveTextContent("14");

    const minList = screen.getByRole("listbox", { name: /min/i, hidden: true });
    const selectedMin = within(minList).getAllByRole("option", { selected: true, hidden: true })[0];
    expect(selectedMin).toHaveTextContent("30");
  });

  it("renders minute options with step applied inside the popover - BLI: EL-339", async () => {
    await renderOpen({ minuteStep: 15 });
    const minList = screen.getByRole("listbox", { name: /min/i, hidden: true });
    const options = within(minList).getAllByRole("option", { hidden: true });
    expect(options.map((o) => o.textContent)).toEqual(["00", "15", "30", "45"]);
  });

  it("renders second options with step applied inside the popover - BLI: EL-339", async () => {
    await renderOpen({ showSeconds: true, secondStep: 30 });
    const secList = screen.getByRole("listbox", { name: /sec/i, hidden: true });
    const options = within(secList).getAllByRole("option", { hidden: true });
    expect(options.map((o) => o.textContent)).toEqual(["00", "30"]);
  });
});

// ---------------------------------------------------------------------------
// DateTimePicker – min/max date
// ---------------------------------------------------------------------------

describe("DateTimePicker – min/max date", () => {
  it("renders correctly with minDate and maxDate constraints - BLI: EL-339", async () => {
    await renderOpen({
      minDate: "2024-01-01",
      maxDate: "2024-12-31",
    });
    // Popover is open; confirm the time picker is present
    expect(
      screen.getByRole("group", { name: /time picker/i, hidden: true })
    ).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// DateTimePicker – display format
// ---------------------------------------------------------------------------

describe("DateTimePicker – display format", () => {
  it("formats the value with a custom displayFormat (date portion only) - BLI: EL-339", () => {
    // displayFormat is treated as the DATE-ONLY part; time is appended automatically.
    // timeFormat="24h" → time part becomes "HH:mm" → effective = "dd/MM/yyyy HH:mm"
    const { container } = render(
      <DateTimePicker
        value="2024-06-15T10:30:00"
        valueFormat="yyyy-MM-dd'T'HH:mm:ss"
        timeFormat="24h"
        displayFormat="dd/MM/yyyy"
      />
    );
    const input = container.querySelector("input[type='text']") as HTMLInputElement;
    expect(input.value).toBe("15/06/2024 10:30");
  });

  it("reformats the display text when displayFormat changes - BLI: EL-339", () => {
    const { container, rerender } = render(
      <DateTimePicker
        value="2024-06-15T10:30:00"
        valueFormat="yyyy-MM-dd'T'HH:mm:ss"
        timeFormat="24h"
        displayFormat="MM/dd/yyyy"
      />
    );
    rerender(
      <DateTimePicker
        value="2024-06-15T10:30:00"
        valueFormat="yyyy-MM-dd'T'HH:mm:ss"
        timeFormat="24h"
        displayFormat="dd.MM.yyyy"
      />
    );
    const input = container.querySelector("input[type='text']") as HTMLInputElement;
    expect(input.value).toBe("15.06.2024 10:30");
  });
});

// ---------------------------------------------------------------------------
// DateTimePicker – imperative ref
// ---------------------------------------------------------------------------

describe("DateTimePicker – imperative ref", () => {
  it("exposes dateValue as null when no value is set - BLI: EL-339", () => {
    const ref = React.createRef<DateTimePickerRef>();
    render(<DateTimePicker ref={ref} />);
    expect(ref.current).not.toBeNull();
    expect(ref.current!.dateValue).toBeNull();
  });

  it("exposes dateValue as Date when valid value is set - BLI: EL-339", () => {
    const ref = React.createRef<DateTimePickerRef>();
    render(<DateTimePicker ref={ref} value="2024-06-15T10:30:00" {...FORMAT_24H} />);
    expect(ref.current!.dateValue).toBeInstanceOf(Date);
  });

  it("exposes nativeElement as HTMLDivElement - BLI: EL-339", () => {
    const ref = React.createRef<DateTimePickerRef>();
    render(<DateTimePicker ref={ref} />);
    expect(ref.current!.nativeElement).toBeInstanceOf(HTMLDivElement);
  });

  it("focus() sets focus on the input - BLI: EL-339", () => {
    const ref = React.createRef<DateTimePickerRef>();
    const { container } = render(<DateTimePicker ref={ref} />);
    act(() => { ref.current!.focus(); });
    const input = container.querySelector("input[type='text']") as HTMLInputElement;
    expect(document.activeElement).toBe(input);
  });

  it("blur() removes focus from the input - BLI: EL-339", () => {
    const ref = React.createRef<DateTimePickerRef>();
    const { container } = render(<DateTimePicker ref={ref} />);
    const input = container.querySelector("input[type='text']") as HTMLInputElement;
    input.focus();
    act(() => { ref.current!.blur(); });
    expect(document.activeElement).not.toBe(input);
  });

  it("formatValue returns a formatted date string using the effective display format - BLI: EL-339", () => {
    const ref = React.createRef<DateTimePickerRef>();
    // en-US + 24h + explicit displayFormat → effectiveDisplayFormat = "MM/dd/yyyy HH:mm"
    render(<DateTimePicker ref={ref} valueFormat="yyyy-MM-dd'T'HH:mm:ss" timeFormat="24h" displayFormat="MM/dd/yyyy" />);
    const result = ref.current!.formatValue(new Date(2024, 5, 15, 10, 30));
    expect(result).toBe("06/15/2024 10:30");
  });

  it("isValidValue returns true for a valid ISO datetime string - BLI: EL-339", () => {
    const ref = React.createRef<DateTimePickerRef>();
    render(<DateTimePicker ref={ref} valueFormat="yyyy-MM-dd'T'HH:mm:ss" />);
    expect(ref.current!.isValidValue("2024-06-15T10:30:00")).toBe(true);
  });

  it("isValidValue returns false for an invalid string - BLI: EL-339", () => {
    const ref = React.createRef<DateTimePickerRef>();
    render(<DateTimePicker ref={ref} valueFormat="yyyy-MM-dd'T'HH:mm:ss" />);
    expect(ref.current!.isValidValue("not-a-date")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// DateTimePicker – form integration
// ---------------------------------------------------------------------------

describe("DateTimePicker – form integration", () => {
  it("renders hidden input with the current value - BLI: EL-339", () => {
    const { container } = render(
      <DateTimePicker name="meetingTime" value="2024-06-15T10:30:00" {...FORMAT_24H} />
    );
    const hidden = container.querySelector("input[name='meetingTime']") as HTMLInputElement;
    expect(hidden).toBeInTheDocument();
    expect(hidden.value).toBe("2024-06-15T10:30:00");
  });

  it("does not render a named hidden input when name is not provided - BLI: EL-339", () => {
    const { container } = render(<DateTimePicker />);
    const allInputs = Array.from(container.querySelectorAll("input"));
    const hasNamedHidden = allInputs.some((i) => i.type === "hidden" && i.name);
    expect(hasNamedHidden).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Size variants
// ---------------------------------------------------------------------------

describe("DateTimePicker – size variants", () => {
  it("defaults to Large size with h-10 and rounded-lg - BLI: EL-339", () => {
    render(<DateTimePicker data-testid="dtp" />);
    const container = screen.getByTestId("dtp");
    expect(container).toHaveClass("h-10");
    expect(container).toHaveClass("rounded-lg");
  });

  it("renders Medium size with h-8 and rounded - BLI: EL-339", () => {
    render(<DateTimePicker size="Medium" data-testid="dtp" />);
    const container = screen.getByTestId("dtp");
    expect(container).toHaveClass("h-8");
    expect(container).toHaveClass("rounded");
    expect(container).not.toHaveClass("rounded-lg");
  });

  it("Large size does not have h-8 class - BLI: EL-339", () => {
    render(<DateTimePicker size="Large" data-testid="dtp" />);
    const container = screen.getByTestId("dtp");
    expect(container).not.toHaveClass("h-8");
    expect(container).toHaveClass("h-10");
  });

  it("Medium size renders Small calendar toggle button - BLI: EL-339", () => {
    render(<DateTimePicker size="Medium" />);
    const btn = screen.getByRole("button", { name: /open date and time picker/i });
    expect(btn).toHaveClass("h-6");
  });

  it("Large size renders Medium calendar toggle button - BLI: EL-339", () => {
    render(<DateTimePicker size="Large" />);
    const btn = screen.getByRole("button", { name: /open date and time picker/i });
    expect(btn).toHaveClass("h-8");
  });

  it("Medium size uses correct padding classes - BLI: EL-339", () => {
    render(<DateTimePicker size="Medium" data-testid="dtp" />);
    const container = screen.getByTestId("dtp");
    expect(container).toHaveClass("pl-3");
  });

  it("Large size uses correct padding classes - BLI: EL-339", () => {
    render(<DateTimePicker size="Large" data-testid="dtp" />);
    const container = screen.getByTestId("dtp");
    expect(container).toHaveClass("pl-3.5");
  });
});
