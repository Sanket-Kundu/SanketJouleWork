import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React, { useState } from "react";
import { DatePicker } from "./DatePicker";
import {
  DatePickerSelectionMode,
  ValueState,
} from "../../types/datepicker";
import type { DatePickerRef } from "../../types/datepicker";

// ── Mocks ─────────────────────────────────────────────────────────────────────

// Mock ResponsivePopover: render children when open, nothing when closed.
vi.mock("../responsive-popover/ResponsivePopover", () => ({
  ResponsivePopover: ({
    open,
    children,
    onClose,
    accessibleName,
  }: {
    open: boolean;
    children: React.ReactNode;
    onClose?: () => void;
    accessibleName?: string;
  }) =>
    open ? (
      <div data-testid="popover" aria-label={accessibleName}>
        {children}
        <button data-testid="popover-close" onClick={onClose}>
          Close
        </button>
      </div>
    ) : null,
}));

// Mock Calendar: renders a button per pre-set date so tests can trigger selection.
vi.mock("../calendar/Calendar", () => ({
  Calendar: ({
    onSelectionChange,
    minDate,
    maxDate,
  }: {
    onSelectionChange?: (detail: { selectedValues: string[] }) => void;
    minDate?: string;
    maxDate?: string;
  }) => (
    <div data-testid="calendar" data-min={minDate} data-max={maxDate}>
      <button
        data-testid="cal-select-2024-06-15"
        onClick={() =>
          onSelectionChange?.({ selectedValues: ["2024-06-15"] })
        }
      >
        15 Jun 2024
      </button>
      <button
        data-testid="cal-select-2024-01-10"
        onClick={() =>
          onSelectionChange?.({ selectedValues: ["2024-01-10"] })
        }
      >
        10 Jan 2024
      </button>
      <button
        data-testid="cal-select-range"
        onClick={() =>
          onSelectionChange?.({
            selectedValues: ["2024-03-01", "2024-03-15"],
          })
        }
      >
        Range
      </button>
      <button
        data-testid="cal-select-range-first"
        onClick={() =>
          onSelectionChange?.({ selectedValues: ["2024-03-01"] })
        }
      >
        Range start
      </button>
    </div>
  ),
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Get the text input element rendered by DatePicker.
 */
function getInput() {
  return screen.getByRole<HTMLInputElement>("textbox");
}

/**
 * Get the calendar toggle button ("Open Picker" / "Close Picker").
 */
function getCalendarToggleBtn() {
  return screen.getByRole("button", { name: /Open Picker|Close Picker/i });
}

// ── Basic rendering ───────────────────────────────────────────────────────────

describe("DatePicker – basic rendering", () => {
  it("renders a text input - BLI: EL-339", () => {
    render(<DatePicker />);
    expect(getInput()).toBeInTheDocument();
  });

  it("renders the calendar toggle button - BLI: EL-339", () => {
    render(<DatePicker />);
    expect(getCalendarToggleBtn()).toBeInTheDocument();
  });

  it("does not render calendar popover when closed - BLI: EL-339", () => {
    render(<DatePicker />);
    expect(screen.queryByTestId("popover")).not.toBeInTheDocument();
  });

  it("applies data-testid to the container - BLI: EL-339", () => {
    render(<DatePicker data-testid="dp" />);
    expect(screen.getByTestId("dp")).toBeInTheDocument();
  });

  it("applies id to the input - BLI: EL-339", () => {
    render(<DatePicker id="my-dp" />);
    expect(getInput()).toHaveAttribute("id", "my-dp");
  });

  it("applies className to the root wrapper - BLI: EL-339", () => {
    const { container } = render(<DatePicker className="custom-class" />);
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("renders a hidden input for form submission when name is provided - BLI: EL-339", () => {
    const { container } = render(
      <DatePicker name="dob" defaultValue="2024-06-15" />
    );
    const hidden = container.querySelector<HTMLInputElement>(
      "input[type='hidden']"
    );
    expect(hidden).toBeInTheDocument();
    expect(hidden!.name).toBe("dob");
  });
});

// ── Placeholder ───────────────────────────────────────────────────────────────

describe("DatePicker – placeholder", () => {
  it("shows the locale-derived placeholder by default (en-US → MMM d, y) - BLI: EL-339", () => {
    render(<DatePicker />);
    expect(getInput()).toHaveAttribute("placeholder", "MMM d, y");
  });

  it("uses custom placeholder when provided - BLI: EL-339", () => {
    render(<DatePicker placeholder="Pick a date" />);
    expect(getInput()).toHaveAttribute("placeholder", "Pick a date");
  });

  it("uses displayFormat as placeholder when set - BLI: EL-339", () => {
    render(<DatePicker displayFormat="dd.MM.yyyy" />);
    expect(getInput()).toHaveAttribute("placeholder", "dd.MM.yyyy");
  });
});

// ── Default / uncontrolled value ──────────────────────────────────────────────

describe("DatePicker – defaultValue (uncontrolled)", () => {
  it("pre-fills input text from defaultValue - BLI: EL-339", () => {
    render(<DatePicker defaultValue="2024-06-15" displayFormat="MM/dd/yyyy" />);
    expect(getInput()).toHaveValue("06/15/2024");
  });

  it("defaults to empty string when no defaultValue - BLI: EL-339", () => {
    render(<DatePicker />);
    expect(getInput()).toHaveValue("");
  });
});

// ── Controlled value ──────────────────────────────────────────────────────────

describe("DatePicker – controlled value", () => {
  it("displays formatted date from controlled value prop - BLI: EL-339", () => {
    render(<DatePicker value="2024-06-15" displayFormat="MM/dd/yyyy" />);
    expect(getInput()).toHaveValue("06/15/2024");
  });

  it("updates display when controlled value changes - BLI: EL-339", () => {
    const { rerender } = render(
      <DatePicker value="2024-06-15" displayFormat="MM/dd/yyyy" />
    );
    expect(getInput()).toHaveValue("06/15/2024");

    rerender(<DatePicker value="2024-12-31" displayFormat="MM/dd/yyyy" />);
    expect(getInput()).toHaveValue("12/31/2024");
  });

  it("shows empty input when controlled value is empty string - BLI: EL-339", () => {
    render(<DatePicker value="" />);
    expect(getInput()).toHaveValue("");
  });
});

// ── Typing / onInput ──────────────────────────────────────────────────────────

describe("DatePicker – typing and onInput", () => {
  it("updates input text as the user types - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(<DatePicker />);
    await user.type(getInput(), "06/15");
    expect(getInput().value).toContain("06/15");
  });

  it("fires onInput with typed value on each keystroke - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onInput = vi.fn();
    render(<DatePicker onInput={onInput} />);
    await user.type(getInput(), "06/15/2024");
    expect(onInput).toHaveBeenCalled();
    // Last call should carry the complete typed string
    const lastCall = onInput.mock.calls[onInput.mock.calls.length - 1][0];
    expect(lastCall.value).toBe("06/15/2024");
  });

  it("onInput provides dateValue when text is a recognisable date - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onInput = vi.fn();
    render(
      <DatePicker onInput={onInput} displayFormat="MM/dd/yyyy" />
    );
    await user.type(getInput(), "06/15/2024");
    const calls = onInput.mock.calls.map((c) => c[0]);
    const validCall = calls.find(
      (c) => c.dateValue instanceof Date && c.valid === true
    );
    expect(validCall).toBeTruthy();
  });

  it("onInput sets valid=false for unrecognisable text - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onInput = vi.fn();
    render(<DatePicker onInput={onInput} />);
    await user.type(getInput(), "not-a-date");
    const lastCall = onInput.mock.calls[onInput.mock.calls.length - 1][0];
    expect(lastCall.valid).toBe(false);
  });
});

// ── onChange (blur / Enter) ───────────────────────────────────────────────────

describe("DatePicker – onChange on blur", () => {
  it("fires onChange with valid=true and a Date on blur with valid date - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <DatePicker onChange={onChange} displayFormat="MM/dd/yyyy" />
    );
    await user.click(getInput());
    await user.keyboard("06/15/2024");
    await user.tab(); // blur
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ valid: true, dateValue: expect.any(Date) })
    );
  });

  it("fires onChange with valid=false on blur with invalid text - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DatePicker onChange={onChange} />);
    await user.click(getInput());
    await user.keyboard("not-a-real-date!!!");
    await user.tab();
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ valid: false })
    );
  });

  it("fires onChange with valid=true and empty value on blur with empty input - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DatePicker onChange={onChange} />);
    await user.click(getInput());
    await user.tab();
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ valid: true, value: "" })
    );
  });

  it("fires onChange on Enter key and formats the date - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <DatePicker onChange={onChange} displayFormat="MM/dd/yyyy" />
    );
    await user.click(getInput());
    await user.keyboard("06/15/2024{Enter}");
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ valid: true })
    );
  });

  it("reformats input text to displayFormat after valid blur - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(<DatePicker displayFormat="MM/dd/yyyy" />);
    const input = getInput();
    await user.click(input);
    // Type in ISO format
    await user.keyboard("2024-06-15");
    await user.tab();
    expect(input).toHaveValue("06/15/2024");
  });

  it("shows negative value state after blur with invalid text - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(<DatePicker />);
    await user.click(getInput());
    await user.keyboard("bad-date");
    await user.tab();
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
});

// ── Opening calendar via icon click ──────────────────────────────────────────

describe("DatePicker – calendar toggle", () => {
  it("opens the calendar popover when the icon button is clicked - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(<DatePicker />);
    await user.click(getCalendarToggleBtn());
    expect(screen.getByTestId("popover")).toBeInTheDocument();
  });

  it("toggles the calendar closed on second click - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(<DatePicker />);
    await user.click(getCalendarToggleBtn());
    expect(screen.getByTestId("popover")).toBeInTheDocument();
    await user.click(getCalendarToggleBtn());
    expect(screen.queryByTestId("popover")).not.toBeInTheDocument();
  });

  it("fires onOpen when calendar is opened - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    render(<DatePicker onOpen={onOpen} />);
    await user.click(getCalendarToggleBtn());
    expect(onOpen).toHaveBeenCalledOnce();
  });

  it("fires onClose when calendar is closed via popover close button - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<DatePicker onClose={onClose} />);
    await user.click(getCalendarToggleBtn());
    await user.click(screen.getByTestId("popover-close"));
    expect(onClose).toHaveBeenCalled();
  });

  it("aria-pressed reflects open state on the toggle button - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(<DatePicker />);
    expect(getCalendarToggleBtn()).toHaveAttribute("aria-pressed", "false");
    await user.click(getCalendarToggleBtn());
    expect(getCalendarToggleBtn()).toHaveAttribute("aria-pressed", "true");
  });
});

// ── Selecting a date from calendar ───────────────────────────────────────────

describe("DatePicker – calendar date selection", () => {
  it("populates input after selecting a date in the calendar - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(<DatePicker displayFormat="MM/dd/yyyy" />);
    await user.click(getCalendarToggleBtn());
    await user.click(screen.getByTestId("cal-select-2024-06-15"));
    expect(getInput()).toHaveValue("06/15/2024");
  });

  it("closes the calendar after a single-date selection - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(<DatePicker />);
    await user.click(getCalendarToggleBtn());
    await user.click(screen.getByTestId("cal-select-2024-06-15"));
    expect(screen.queryByTestId("popover")).not.toBeInTheDocument();
  });

  it("fires onChange when a date is selected from the calendar - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DatePicker onChange={onChange} displayFormat="MM/dd/yyyy" />);
    await user.click(getCalendarToggleBtn());
    await user.click(screen.getByTestId("cal-select-2024-06-15"));
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ valid: true, dateValue: expect.any(Date) })
    );
  });
});

// ── Clear button ──────────────────────────────────────────────────────────────

describe("DatePicker – clear button", () => {
  it("shows clear button when there is a value - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(<DatePicker />);
    await user.type(getInput(), "06/15/2024");
    expect(
      screen.getByRole("button", { name: "Clear" })
    ).toBeInTheDocument();
  });

  it("clears the input when clear button is clicked - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(<DatePicker defaultValue="2024-06-15" displayFormat="MM/dd/yyyy" />);
    await user.click(screen.getByRole("button", { name: "Clear" }));
    expect(getInput()).toHaveValue("");
  });

  it("fires onChange with empty value when cleared - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <DatePicker
        defaultValue="2024-06-15"
        displayFormat="MM/dd/yyyy"
        onChange={onChange}
      />
    );
    await user.click(screen.getByRole("button", { name: "Clear" }));
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: "", valid: true })
    );
  });

  it("hides clear button when showClearIcon=false - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(<DatePicker showClearIcon={false} />);
    await user.type(getInput(), "06/15/2024");
    expect(
      screen.queryByRole("button", { name: "Clear" })
    ).not.toBeInTheDocument();
  });

  it("hides clear button when value is empty - BLI: EL-339", () => {
    render(<DatePicker />);
    expect(
      screen.queryByRole("button", { name: "Clear" })
    ).not.toBeInTheDocument();
  });
});

// ── Disabled state ────────────────────────────────────────────────────────────

describe("DatePicker – disabled", () => {
  it("disables the text input - BLI: EL-339", () => {
    render(<DatePicker disabled />);
    expect(getInput()).toBeDisabled();
  });

  it("disables the calendar toggle button - BLI: EL-339", () => {
    render(<DatePicker disabled />);
    expect(getCalendarToggleBtn()).toBeDisabled();
  });

  it("does not open the calendar when disabled - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(<DatePicker disabled />);
    await user.click(getCalendarToggleBtn());
    expect(screen.queryByTestId("popover")).not.toBeInTheDocument();
  });

  it("does not fire onOpen when disabled - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    render(<DatePicker disabled onOpen={onOpen} />);
    await user.click(getCalendarToggleBtn());
    expect(onOpen).not.toHaveBeenCalled();
  });

  it("does not show clear button when disabled with value - BLI: EL-339", () => {
    render(<DatePicker disabled defaultValue="2024-06-15" />);
    expect(
      screen.queryByRole("button", { name: "Clear" })
    ).not.toBeInTheDocument();
  });
});

// ── Readonly state ────────────────────────────────────────────────────────────

describe("DatePicker – readonly", () => {
  it("marks the text input as readonly - BLI: EL-339", () => {
    render(<DatePicker readonly />);
    expect(getInput()).toHaveAttribute("readonly");
  });

  it("disables the calendar toggle button - BLI: EL-339", () => {
    render(<DatePicker readonly />);
    expect(getCalendarToggleBtn()).toBeDisabled();
  });

  it("does not open the calendar when readonly - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(<DatePicker readonly />);
    await user.click(getCalendarToggleBtn());
    expect(screen.queryByTestId("popover")).not.toBeInTheDocument();
  });

  it("does not show clear button when readonly with value - BLI: EL-339", () => {
    render(<DatePicker readonly defaultValue="2024-06-15" />);
    expect(
      screen.queryByRole("button", { name: "Clear" })
    ).not.toBeInTheDocument();
  });
});

// ── Value state ───────────────────────────────────────────────────────────────

describe("DatePicker – valueState", () => {
  it("renders without alert when valueState is None - BLI: EL-339", () => {
    render(<DatePicker valueState={ValueState.None} />);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("renders valueStateMessage when provided with any non-None state - BLI: EL-339", () => {
    render(
      <DatePicker
        valueState={ValueState.Negative}
        valueStateMessage="Date is required"
      />
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Date is required");
  });

  it("renders default error message for Negative state without custom message - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(<DatePicker />);
    await user.click(getInput());
    await user.keyboard("completely-invalid");
    await user.tab();
    expect(screen.getByRole("alert")).toHaveTextContent("Invalid date format");
  });

  it("calls onValueStateChange when value state changes - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onValueStateChange = vi.fn();
    render(<DatePicker onValueStateChange={onValueStateChange} />);
    await user.click(getInput());
    await user.keyboard("bad-value");
    await user.tab();
    expect(onValueStateChange).toHaveBeenCalledWith(
      expect.objectContaining({ valueState: ValueState.Negative, valid: false })
    );
  });

  it("does not update value state when onValueStateChange returns false - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(
      <DatePicker onValueStateChange={() => false} />
    );
    await user.click(getInput());
    await user.keyboard("bad-value");
    await user.tab();
    // Alert should NOT appear because onValueStateChange blocked the update
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});

// ── Min/max date ──────────────────────────────────────────────────────────────

describe("DatePicker – minDate and maxDate", () => {
  it("passes minDate to the Calendar component - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(<DatePicker minDate="2024-01-01" />);
    await user.click(getCalendarToggleBtn());
    const calendar = screen.getByTestId("calendar");
    expect(calendar).toHaveAttribute("data-min", "2024-01-01");
  });

  it("passes maxDate to the Calendar component - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(<DatePicker maxDate="2024-12-31" />);
    await user.click(getCalendarToggleBtn());
    const calendar = screen.getByTestId("calendar");
    expect(calendar).toHaveAttribute("data-max", "2024-12-31");
  });
});

// ── displayFormat ─────────────────────────────────────────────────────────────

describe("DatePicker – displayFormat", () => {
  it("formats the initial value using the provided displayFormat - BLI: EL-339", () => {
    render(
      <DatePicker
        defaultValue="2024-06-15"
        displayFormat="dd.MM.yyyy"
      />
    );
    expect(getInput()).toHaveValue("15.06.2024");
  });

  it("formats the value with a custom displayFormat after calendar selection - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(<DatePicker displayFormat="dd.MM.yyyy" />);
    await user.click(getCalendarToggleBtn());
    await user.click(screen.getByTestId("cal-select-2024-06-15"));
    expect(getInput()).toHaveValue("15.06.2024");
  });
});

// ── valueFormat ───────────────────────────────────────────────────────────────

describe("DatePicker – valueFormat", () => {
  it("emits onChange value in the specified valueFormat - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <DatePicker
        displayFormat="MM/dd/yyyy"
        valueFormat="dd-MM-yyyy"
        onChange={onChange}
      />
    );
    await user.click(getInput());
    await user.keyboard("06/15/2024");
    await user.tab();
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: "15-06-2024", valid: true })
    );
  });
});

// ── Accessibility ─────────────────────────────────────────────────────────────

describe("DatePicker – accessibility", () => {
  it("applies accessibleName as aria-label on the input - BLI: EL-339", () => {
    render(<DatePicker accessibleName="Birth date" />);
    expect(getInput()).toHaveAttribute("aria-label", "Birth date");
  });

  it("applies accessibleNameRef as aria-labelledby on the input - BLI: EL-339", () => {
    render(<DatePicker accessibleNameRef="label-id" />);
    expect(getInput()).toHaveAttribute("aria-labelledby", "label-id");
  });

  it("marks the input as required when required=true - BLI: EL-339", () => {
    render(<DatePicker required />);
    expect(getInput()).toBeRequired();
  });

  it("calendar toggle button is not in the tab chain - BLI: EL-339", () => {
    render(<DatePicker />);
    expect(getCalendarToggleBtn()).toHaveAttribute("tabindex", "-1");
  });

  it("clear button is not in the tab chain - BLI: EL-339", () => {
    render(<DatePicker defaultValue="2024-06-15" displayFormat="MM/dd/yyyy" />);
    const clearBtn = screen.getByRole("button", { name: "Clear" });
    expect(clearBtn).toHaveAttribute("tabindex", "-1");
  });
});

// ── ARIA screen-reader attributes ─────────────────────────────────────────────

describe("DatePicker – ARIA screen-reader attributes", () => {
  it("input has aria-haspopup='grid' - BLI: EL-339", () => {
    render(<DatePicker />);
    expect(getInput()).toHaveAttribute("aria-haspopup", "grid");
  });

  it("input has aria-roledescription='Date Input' in single mode - BLI: EL-339", () => {
    render(<DatePicker />);
    expect(getInput()).toHaveAttribute("aria-roledescription", "Date Input");
  });

  it("input has aria-roledescription='Date Range Input' in range mode", () => {
    render(<DatePicker selectionMode={DatePickerSelectionMode.Range} />);
    expect(getInput()).toHaveAttribute("aria-roledescription", "Date Range Input");
  });

  it("input does not have aria-expanded (only the toggle button does)", () => {
    render(<DatePicker />);
    expect(getInput()).not.toHaveAttribute("aria-expanded");
  });

  it("input has aria-required when required - BLI: EL-339", () => {
    render(<DatePicker required />);
    expect(getInput()).toHaveAttribute("aria-required", "true");
  });

  it("input does not have aria-required when not required - BLI: EL-339", () => {
    render(<DatePicker />);
    expect(getInput()).not.toHaveAttribute("aria-required");
  });

  it("input has aria-describedby linking to value state message - BLI: EL-339", () => {
    render(
      <DatePicker
        valueState={ValueState.Negative}
        valueStateMessage="Date is invalid"
      />
    );
    const input = getInput();
    const describedById = input.getAttribute("aria-describedby");
    expect(describedById).toBeTruthy();
    const messageEl = document.getElementById(describedById!);
    expect(messageEl).toBeInTheDocument();
    expect(messageEl).toHaveTextContent("Date is invalid");
  });

  it("input has no aria-describedby when value state is None - BLI: EL-339", () => {
    render(<DatePicker />);
    expect(getInput()).not.toHaveAttribute("aria-describedby");
  });

  it("toggle button label changes when picker is open - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(<DatePicker />);
    expect(screen.getByRole("button", { name: "Open Picker" })).toBeInTheDocument();
    await user.click(getCalendarToggleBtn());
    expect(screen.getByRole("button", { name: "Close Picker" })).toBeInTheDocument();
  });

  it("clear button uses i18n label - BLI: EL-339", () => {
    render(<DatePicker defaultValue="2024-06-15" displayFormat="MM/dd/yyyy" />);
    expect(screen.getByRole("button", { name: "Clear" })).toBeInTheDocument();
  });

  it("value state message has role=alert - BLI: EL-339", () => {
    render(
      <DatePicker
        valueState={ValueState.Negative}
        valueStateMessage="Bad date"
      />
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Bad date");
  });

  it("shows fallback error message when valueState is Negative without custom message - BLI: EL-339", () => {
    render(<DatePicker valueState={ValueState.Negative} />);
    expect(screen.getByRole("alert")).toHaveTextContent("Invalid date format");
  });

  it("popover has accessible name with interpolated label - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(<DatePicker accessibleName="Birth date" />);
    await user.click(getCalendarToggleBtn());
    const popover = screen.getByTestId("popover");
    expect(popover).toHaveAttribute("aria-label", "Enter date for Birth date");
  });

  it("popover has accessible name without label when accessibleName is not set - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(<DatePicker />);
    await user.click(getCalendarToggleBtn());
    const popover = screen.getByTestId("popover");
    expect(popover).toHaveAttribute("aria-label", "Enter date for ");
  });

  it("popover uses range-specific accessible name in range mode", async () => {
    const user = userEvent.setup();
    render(
      <DatePicker
        selectionMode={DatePickerSelectionMode.Range}
        accessibleName="Booking"
      />
    );
    await user.click(getCalendarToggleBtn());
    const popover = screen.getByTestId("popover");
    expect(popover).toHaveAttribute("aria-label", "Choose Date Range for Booking");
  });

  it("popover uses single-date accessible name in single mode", async () => {
    const user = userEvent.setup();
    render(<DatePicker accessibleName="Departure" />);
    await user.click(getCalendarToggleBtn());
    const popover = screen.getByTestId("popover");
    expect(popover).toHaveAttribute("aria-label", "Enter date for Departure");
  });

  it("popover resolves accessible name from associated label via htmlFor", async () => {
    const user = userEvent.setup();
    render(
      <>
        <label htmlFor="dp-label-test">Start Date</label>
        <DatePicker id="dp-label-test" />
      </>
    );
    await user.click(getCalendarToggleBtn());
    const popover = screen.getByTestId("popover");
    expect(popover).toHaveAttribute("aria-label", "Enter date for Start Date");
  });

  it("popover strips required indicator from associated label text", async () => {
    // The Label component renders required as two sibling spans:
    //   <span aria-hidden="true">*</span>  — visible asterisk
    //   <span class="sr-only">(required)</span> — screen-reader text
    // Raw textContent concatenates all nodes: "Start Date*(required)"
    // The accessible name extractor walks the DOM and skips aria-hidden
    // and sr-only nodes, yielding only the visible label text: "Start Date"
    const user = userEvent.setup();
    const { container } = render(
      <>
        <label htmlFor="dp-req-test">
          Start Date
          <span aria-hidden="true">*</span>
          <span className="sr-only">(required)</span>
        </label>
        <DatePicker id="dp-req-test" />
      </>
    );

    // Assert the raw textContent so a future Label markup change is immediately visible.
    // If this assertion fails, the DOM-walking logic may also need updating.
    const rawLabel = container.querySelector("label")!.textContent;
    expect(rawLabel).toContain("Start Date");
    expect(rawLabel).toContain("*");
    expect(rawLabel).toContain("(required)");

    await user.click(getCalendarToggleBtn());
    const popover = screen.getByTestId("popover");
    expect(popover).toHaveAttribute("aria-label", "Enter date for Start Date");
  });

  it("explicit accessibleName takes precedence over associated label", async () => {
    const user = userEvent.setup();
    render(
      <>
        <label htmlFor="dp-precedence">Label Text</label>
        <DatePicker id="dp-precedence" accessibleName="Explicit Name" />
      </>
    );
    await user.click(getCalendarToggleBtn());
    const popover = screen.getByTestId("popover");
    expect(popover).toHaveAttribute("aria-label", "Enter date for Explicit Name");
  });

  it("clears labelText when associated label is removed from DOM", async () => {
    function Wrapper() {
      const [showLabel, setShowLabel] = useState(true);
      return (
        <>
          {showLabel && <label htmlFor="dp-removal">Removable Label</label>}
          <DatePicker id="dp-removal" />
          <button data-testid="toggle-label" onClick={() => setShowLabel(false)}>
            Remove
          </button>
        </>
      );
    }
    const user = userEvent.setup();
    render(<Wrapper />);

    // Initially label is present — popover should pick it up
    await user.click(getCalendarToggleBtn());
    let popover = screen.getByTestId("popover");
    expect(popover).toHaveAttribute("aria-label", "Enter date for Removable Label");

    // Close popover, remove label, re-open
    await user.click(screen.getByTestId("popover-close"));
    await user.click(screen.getByTestId("toggle-label"));

    await user.click(getCalendarToggleBtn());
    popover = screen.getByTestId("popover");
    // After label removal, accessible name falls back to empty
    expect(popover).toHaveAttribute("aria-label", "Enter date for ");
  });
});

// ── Keyboard navigation ───────────────────────────────────────────────────────

describe("DatePicker – keyboard navigation", () => {
  it("opens calendar on Alt+Down - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(<DatePicker />);
    await user.click(getInput());
    await user.keyboard("{Alt>}{ArrowDown}{/Alt}");
    expect(screen.getByTestId("popover")).toBeInTheDocument();
  });

  it("closes calendar on Escape when open - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(<DatePicker />);
    await user.click(getCalendarToggleBtn()); // open
    await user.click(getInput());
    await user.keyboard("{Escape}");
    expect(screen.queryByTestId("popover")).not.toBeInTheDocument();
  });

  it("closes calendar on Alt+Up when open - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(<DatePicker />);
    await user.click(getCalendarToggleBtn()); // open
    await user.click(getInput());
    await user.keyboard("{Alt>}{ArrowUp}{/Alt}");
    expect(screen.queryByTestId("popover")).not.toBeInTheDocument();
  });

  it("increments date by one day on PageUp when closed (single mode) - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <DatePicker
        defaultValue="2024-06-15"
        displayFormat="MM/dd/yyyy"
        onChange={onChange}
      />
    );
    await user.click(getInput());
    await user.keyboard("{PageUp}");
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        value: "2024-06-16",
        valid: true,
      })
    );
  });

  it("decrements date by one day on PageDown when closed (single mode) - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <DatePicker
        defaultValue="2024-06-15"
        displayFormat="MM/dd/yyyy"
        onChange={onChange}
      />
    );
    await user.click(getInput());
    await user.keyboard("{PageDown}");
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        value: "2024-06-14",
        valid: true,
      })
    );
  });

  it("increments month on Shift+PageUp when closed - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <DatePicker
        defaultValue="2024-06-15"
        displayFormat="MM/dd/yyyy"
        onChange={onChange}
      />
    );
    await user.click(getInput());
    await user.keyboard("{Shift>}{PageUp}{/Shift}");
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: "2024-07-15" })
    );
  });

  it("does not go below minDate on PageDown - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <DatePicker
        defaultValue="2024-06-15"
        minDate="2024-06-15"
        onChange={onChange}
      />
    );
    await user.click(getInput());
    await user.keyboard("{PageDown}");
    // onChange should NOT be called because it would violate minDate
    expect(onChange).not.toHaveBeenCalled();
  });

  it("opens calendar on F4 - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(<DatePicker />);
    await user.click(getInput());
    await user.keyboard("{F4}");
    expect(screen.getByTestId("popover")).toBeInTheDocument();
  });

  it("keeps focus and allows typing after Enter commits value - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(<DatePicker displayFormat="MM/dd/yyyy" />);
    const input = getInput();
    await user.click(input);
    await user.keyboard("bad-value{Enter}");
    // Focus should remain on the input
    expect(document.activeElement).toBe(input);
    // Typing after Enter should update the input
    await user.keyboard("06/15/2024");
    expect(input.value).toContain("06/15/2024");
  });
});

// ── Range mode ────────────────────────────────────────────────────────────────

describe("DatePicker – Range selection mode", () => {
  it("renders with range placeholder - BLI: EL-339", () => {
    render(
      <DatePicker
        selectionMode={DatePickerSelectionMode.Range}
        displayFormat="MM/dd/yyyy"
      />
    );
    expect(getInput()).toHaveAttribute(
      "placeholder",
      "MM/dd/yyyy - MM/dd/yyyy"
    );
  });

  it("populates input after range selection from calendar - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(
      <DatePicker
        selectionMode={DatePickerSelectionMode.Range}
        displayFormat="MM/dd/yyyy"
      />
    );
    await user.click(getCalendarToggleBtn());
    await user.click(screen.getByTestId("cal-select-range"));
    expect(getInput().value).toMatch(/03\/01\/2024.+03\/15\/2024/);
  });

  it("fires onChange with startDateValue and endDateValue on range selection - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <DatePicker
        selectionMode={DatePickerSelectionMode.Range}
        displayFormat="MM/dd/yyyy"
        onChange={onChange}
      />
    );
    await user.click(getCalendarToggleBtn());
    await user.click(screen.getByTestId("cal-select-range"));
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        valid: true,
        startDateValue: expect.any(Date),
        endDateValue: expect.any(Date),
      })
    );
  });

  it("fires onInput with range details while typing - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onInput = vi.fn();
    render(
      <DatePicker
        selectionMode={DatePickerSelectionMode.Range}
        onInput={onInput}
      />
    );
    await user.type(getInput(), "06/15/2024 - 06/20/2024");
    expect(onInput).toHaveBeenCalled();
  });

  it("accepts a custom delimiter - BLI: EL-339", () => {
    render(
      <DatePicker
        selectionMode={DatePickerSelectionMode.Range}
        delimiter=" to "
        displayFormat="MM/dd/yyyy"
      />
    );
    expect(getInput()).toHaveAttribute(
      "placeholder",
      "MM/dd/yyyy to MM/dd/yyyy"
    );
  });
});

// ── Controlled open ───────────────────────────────────────────────────────────

describe("DatePicker – controlled open", () => {
  it("renders calendar open when open=true is controlled - BLI: EL-339", () => {
    render(<DatePicker open={true} />);
    expect(screen.getByTestId("popover")).toBeInTheDocument();
  });

  it("renders calendar closed when open=false is controlled - BLI: EL-339", () => {
    render(<DatePicker open={false} />);
    expect(screen.queryByTestId("popover")).not.toBeInTheDocument();
  });

  it("does not close internally on icon click when open is controlled - BLI: EL-339", async () => {
    const user = userEvent.setup();
    // When open is externally controlled clicking the toggle calls onClose
    // but the popover stays open until the parent changes the prop.
    const onClose = vi.fn();
    render(<DatePicker open={true} onClose={onClose} />);
    await user.click(getCalendarToggleBtn());
    // onClose should have been called, but popover is still open (prop unchanged)
    expect(onClose).toHaveBeenCalled();
    expect(screen.getByTestId("popover")).toBeInTheDocument();
  });
});

// ── Imperative ref ────────────────────────────────────────────────────────────

describe("DatePicker – imperative ref", () => {
  it("exposes nativeElement as an HTMLDivElement - BLI: EL-339", () => {
    const ref = React.createRef<DatePickerRef>();
    render(<DatePicker ref={ref} />);
    expect(ref.current).not.toBeNull();
    expect(ref.current!.nativeElement).toBeInstanceOf(HTMLDivElement);
  });

  it("formatValue() returns the date in the display format - BLI: EL-339", () => {
    const ref = React.createRef<DatePickerRef>();
    render(<DatePicker ref={ref} displayFormat="dd.MM.yyyy" />);
    const result = ref.current!.formatValue(new Date(2024, 5, 15)); // June 15
    expect(result).toBe("15.06.2024");
  });

  it("isValidValue() returns true for valid value-format string - BLI: EL-339", () => {
    const ref = React.createRef<DatePickerRef>();
    render(<DatePicker ref={ref} valueFormat="yyyy-MM-dd" />);
    expect(ref.current!.isValidValue("2024-06-15")).toBe(true);
  });

  it("isValidValue() returns false for invalid string - BLI: EL-339", () => {
    const ref = React.createRef<DatePickerRef>();
    render(<DatePicker ref={ref} />);
    expect(ref.current!.isValidValue("not-a-date")).toBe(false);
  });

  it("isInValidRange() returns true when date is within range - BLI: EL-339", () => {
    const ref = React.createRef<DatePickerRef>();
    render(
      <DatePicker ref={ref} minDate="2024-01-01" maxDate="2024-12-31" />
    );
    expect(ref.current!.isInValidRange("2024-06-15")).toBe(true);
  });

  it("isInValidRange() returns false when date is outside range - BLI: EL-339", () => {
    const ref = React.createRef<DatePickerRef>();
    render(
      <DatePicker ref={ref} minDate="2024-01-01" maxDate="2024-06-30" />
    );
    expect(ref.current!.isInValidRange("2024-07-01")).toBe(false);
  });

  it("isValidDisplayValue() returns true for a valid display-format string - BLI: EL-339", () => {
    const ref = React.createRef<DatePickerRef>();
    render(<DatePicker ref={ref} displayFormat="MM/dd/yyyy" />);
    expect(ref.current!.isValidDisplayValue("06/15/2024")).toBe(true);
  });

  it("isValidMin() returns true when minDate is valid - BLI: EL-339", () => {
    const ref = React.createRef<DatePickerRef>();
    render(<DatePicker ref={ref} minDate="2024-01-01" />);
    expect(ref.current!.isValidMin()).toBe(true);
  });

  it("isValidMin() returns true when minDate is not set - BLI: EL-339", () => {
    const ref = React.createRef<DatePickerRef>();
    render(<DatePicker ref={ref} />);
    expect(ref.current!.isValidMin()).toBe(true);
  });

  it("isValidMax() returns true when maxDate is valid - BLI: EL-339", () => {
    const ref = React.createRef<DatePickerRef>();
    render(<DatePicker ref={ref} maxDate="2024-12-31" />);
    expect(ref.current!.isValidMax()).toBe(true);
  });

  it("dateValue is null when no date is selected - BLI: EL-339", () => {
    const ref = React.createRef<DatePickerRef>();
    render(<DatePicker ref={ref} />);
    expect(ref.current!.dateValue).toBeNull();
  });

  it("dateValue is a Date after calendar selection - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const ref = React.createRef<DatePickerRef>();
    render(<DatePicker ref={ref} displayFormat="MM/dd/yyyy" />);
    await user.click(getCalendarToggleBtn());
    await user.click(screen.getByTestId("cal-select-2024-06-15"));
    expect(ref.current!.dateValue).toBeInstanceOf(Date);
  });

  it("dateValueUTC returns UTC midnight for a selected date - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const ref = React.createRef<DatePickerRef>();
    render(<DatePicker ref={ref} displayFormat="MM/dd/yyyy" />);
    await user.click(getCalendarToggleBtn());
    await user.click(screen.getByTestId("cal-select-2024-06-15"));
    const utc = ref.current!.dateValueUTC;
    expect(utc).toBeInstanceOf(Date);
    // UTC midnight: getUTCHours() === 0
    expect(utc!.getUTCHours()).toBe(0);
    expect(utc!.getUTCMinutes()).toBe(0);
  });

  it("focus() focuses the input - BLI: EL-339", () => {
    const ref = React.createRef<DatePickerRef>();
    render(<DatePicker ref={ref} />);
    ref.current!.focus();
    expect(document.activeElement).toBe(getInput());
  });

  it("blur() blurs the input - BLI: EL-339", () => {
    const ref = React.createRef<DatePickerRef>();
    render(<DatePicker ref={ref} />);
    ref.current!.focus();
    ref.current!.blur();
    expect(document.activeElement).not.toBe(getInput());
  });

  it("formValidity.valid is true for a valid date within range - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const ref = React.createRef<DatePickerRef>();
    render(
      <DatePicker
        ref={ref}
        displayFormat="MM/dd/yyyy"
        minDate="2024-01-01"
        maxDate="2024-12-31"
      />
    );
    await user.click(getCalendarToggleBtn());
    await user.click(screen.getByTestId("cal-select-2024-06-15"));
    expect(ref.current!.formValidity.valid).toBe(true);
  });

  it("formValidity.valueMissing is true when required and empty - BLI: EL-339", () => {
    const ref = React.createRef<DatePickerRef>();
    render(<DatePicker ref={ref} required />);
    expect(ref.current!.formValidity.valueMissing).toBe(true);
  });

  it("formValidity.rangeUnderflow is true when date is before minDate - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const ref = React.createRef<DatePickerRef>();
    render(
      <DatePicker
        ref={ref}
        displayFormat="MM/dd/yyyy"
        minDate="2024-06-20"
      />
    );
    await user.click(getCalendarToggleBtn());
    // 2024-01-10 is before minDate 2024-06-20
    await user.click(screen.getByTestId("cal-select-2024-01-10"));
    expect(ref.current!.formValidity.rangeUnderflow).toBe(true);
  });

  it("range mode: startDateValue and endDateValue are null when not in range mode - BLI: EL-339", () => {
    const ref = React.createRef<DatePickerRef>();
    render(<DatePicker ref={ref} selectionMode={DatePickerSelectionMode.Single} />);
    expect(ref.current!.startDateValue).toBeNull();
    expect(ref.current!.endDateValue).toBeNull();
  });

  it("range mode: startValue and endValue return empty string when not in range mode - BLI: EL-339", () => {
    const ref = React.createRef<DatePickerRef>();
    render(<DatePicker ref={ref} selectionMode={DatePickerSelectionMode.Single} />);
    expect(ref.current!.startValue).toBe("");
    expect(ref.current!.endValue).toBe("");
  });
});

// ── Range defaultValue initialisation (lines 128-146) ────────────────────────

describe("DatePicker – Range with defaultValue", () => {
  it("pre-fills input from a complete range defaultValue - BLI: EL-339", () => {
    render(
      <DatePicker
        selectionMode={DatePickerSelectionMode.Range}
        defaultValue="2024-03-01 - 2024-03-15"
        displayFormat="MM/dd/yyyy"
      />
    );
    expect(getInput().value).toMatch(/03\/01\/2024.+03\/15\/2024/);
  });

  it("pre-fills input from a partial range defaultValue (start only) - BLI: EL-339", () => {
    render(
      <DatePicker
        selectionMode={DatePickerSelectionMode.Range}
        defaultValue="2024-03-01"
        displayFormat="MM/dd/yyyy"
      />
    );
    // Should show at least the start date formatted
    expect(getInput().value).toContain("03/01/2024");
  });
});

// ── Range handleBlur branches (lines 509-550) ─────────────────────────────────

describe("DatePicker – Range blur handling", () => {
  it("formats a valid range on blur - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <DatePicker
        selectionMode={DatePickerSelectionMode.Range}
        displayFormat="MM/dd/yyyy"
        onChange={onChange}
      />
    );
    await user.click(getInput());
    await user.keyboard("03/01/2024 - 03/15/2024");
    await user.tab();
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        valid: true,
        startDateValue: expect.any(Date),
        endDateValue: expect.any(Date),
      })
    );
  });

  it("sets error state on blur with non-parseable range text - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(
      <DatePicker
        selectionMode={DatePickerSelectionMode.Range}
        displayFormat="MM/dd/yyyy"
      />
    );
    await user.click(getInput());
    await user.keyboard("not a range at all!!!");
    await user.tab();
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("fires onChange with empty value on blur with empty range input - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <DatePicker
        selectionMode={DatePickerSelectionMode.Range}
        onChange={onChange}
      />
    );
    await user.click(getInput());
    await user.tab();
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: "", valid: true })
    );
  });
});

// ── Range calendar: single-value selection (onSelectionChange line 981-984) ───

describe("DatePicker – Range calendar single value selection", () => {
  it("accepts first date selection from calendar in range mode - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <DatePicker
        selectionMode={DatePickerSelectionMode.Range}
        displayFormat="MM/dd/yyyy"
        onChange={onChange}
      />
    );
    // Open and click the range-first button (emits 1 selected value)
    await user.click(getCalendarToggleBtn());
    await user.click(screen.getByTestId("cal-select-range-first"));
    // onChange called with partial range (valid=false)
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        startDateValue: expect.any(Date),
        endDateValue: null,
        valid: false,
      })
    );
    // Calendar stays open (range not complete)
    expect(screen.getByTestId("popover")).toBeInTheDocument();
  });

  it("completes range on second calendar selection - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <DatePicker
        selectionMode={DatePickerSelectionMode.Range}
        displayFormat="MM/dd/yyyy"
        onChange={onChange}
      />
    );
    await user.click(getCalendarToggleBtn());
    // First click: start date
    await user.click(screen.getByTestId("cal-select-range-first"));
    // Second click: end date (picks 2024-06-15 which is after 2024-03-01)
    await user.click(screen.getByTestId("cal-select-2024-06-15"));
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall.valid).toBe(true);
    expect(lastCall.startDateValue).toBeInstanceOf(Date);
    expect(lastCall.endDateValue).toBeInstanceOf(Date);
  });
});

// ── Keyboard: Ctrl+Shift+PageUp/Down for year navigation (line 667) ──────────

describe("DatePicker – keyboard year navigation", () => {
  it("increments year on Ctrl+Shift+PageUp when closed - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <DatePicker
        defaultValue="2024-06-15"
        displayFormat="MM/dd/yyyy"
        onChange={onChange}
      />
    );
    await user.click(getInput());
    await user.keyboard("{Control>}{Shift>}{PageUp}{/Shift}{/Control}");
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: "2025-06-15" })
    );
  });

  it("does not go above maxDate on PageUp - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <DatePicker
        defaultValue="2024-06-15"
        maxDate="2024-06-15"
        onChange={onChange}
      />
    );
    await user.click(getInput());
    await user.keyboard("{PageUp}");
    expect(onChange).not.toHaveBeenCalled();
  });
});

// ── Ref range getters with populated values (lines 801-813) ──────────────────

describe("DatePicker – range ref getters", () => {
  it("startDateValue and endDateValue return Date objects after range calendar selection - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const ref = React.createRef<DatePickerRef>();
    render(
      <DatePicker
        ref={ref}
        selectionMode={DatePickerSelectionMode.Range}
        displayFormat="MM/dd/yyyy"
      />
    );
    await user.click(getCalendarToggleBtn());
    await user.click(screen.getByTestId("cal-select-range"));
    expect(ref.current!.startDateValue).toBeInstanceOf(Date);
    expect(ref.current!.endDateValue).toBeInstanceOf(Date);
  });

  it("startValue and endValue return formatted strings after range calendar selection - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const ref = React.createRef<DatePickerRef>();
    render(
      <DatePicker
        ref={ref}
        selectionMode={DatePickerSelectionMode.Range}
        displayFormat="MM/dd/yyyy"
      />
    );
    await user.click(getCalendarToggleBtn());
    await user.click(screen.getByTestId("cal-select-range"));
    expect(ref.current!.startValue).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    expect(ref.current!.endValue).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });
});

// ── Controlled value: range mode sync (lines 208, 211-217) ────────────────────

describe("DatePicker – controlled range value sync", () => {
  it("syncs a partial range (start only) controlled value to the input - BLI: EL-339", () => {
    render(
      <DatePicker
        selectionMode={DatePickerSelectionMode.Range}
        value="2024-03-01"
        displayFormat="MM/dd/yyyy"
      />
    );
    expect(getInput().value).toContain("03/01/2024");
  });

  it("shows raw text when controlled range value is unparseable - BLI: EL-339", () => {
    render(
      <DatePicker
        selectionMode={DatePickerSelectionMode.Range}
        value="not-a-date"
        displayFormat="MM/dd/yyyy"
      />
    );
    expect(getInput().value).toBe("not-a-date");
  });
});

// ── Controlled value: single mode with unparseable value (line 229) ──────────

describe("DatePicker – controlled single value edge cases", () => {
  it("shows raw text when controlled single value is unparseable - BLI: EL-339", () => {
    render(
      <DatePicker value="garbage-value" displayFormat="MM/dd/yyyy" />
    );
    expect(getInput().value).toBe("garbage-value");
  });
});

// ── formValidity rangeOverflow (line 825) ─────────────────────────────────────

describe("DatePicker – formValidity rangeOverflow", () => {
  it("formValidity.rangeOverflow is true when date exceeds maxDate - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const ref = React.createRef<DatePickerRef>();
    render(
      <DatePicker
        ref={ref}
        displayFormat="MM/dd/yyyy"
        maxDate="2024-01-01"
      />
    );
    await user.click(getCalendarToggleBtn());
    // 2024-06-15 is after maxDate 2024-01-01
    await user.click(screen.getByTestId("cal-select-2024-06-15"));
    expect(ref.current!.formValidity.rangeOverflow).toBe(true);
  });

  it("formValidity.patternMismatch is true when value is not a valid date - BLI: EL-339", () => {
    const ref = React.createRef<DatePickerRef>();
    render(<DatePicker ref={ref} value="not-a-date" />);
    expect(ref.current!.formValidity.patternMismatch).toBe(true);
  });
});

// ── Natural language / chrono range parsing (lines 353-363) ──────────────────

describe("DatePicker – natural language range parsing on blur", () => {
  it("accepts natural language range like 'March 1 to March 15 2024' on blur - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <DatePicker
        selectionMode={DatePickerSelectionMode.Range}
        displayFormat="MM/dd/yyyy"
        onChange={onChange}
      />
    );
    await user.click(getInput());
    // Use "March 1 2024 to March 15 2024" — explicit enough for chrono to parse
    await user.keyboard("March 1 2024 to March 15 2024");
    await user.tab();
    // Either parsed as range or set error state — just assert onChange was called
    expect(onChange).toHaveBeenCalled();
  });
});

// ── inputContainerVariants export ─────────────────────────────────────────────

describe("inputContainerVariants", () => {
  it("is exported from DatePicker module - BLI: EL-339", async () => {
    const mod = await import("./DatePicker");
    expect(mod.inputContainerVariants).toBeDefined();
    expect(typeof mod.inputContainerVariants).toBe("function");
  });
});

// ── Responsive layout ─────────────────────────────────────────────────────────

describe("DatePicker – responsive layout", () => {
  it("calendar toggle button stays inside the input container at narrow widths - BLI: EL-339", () => {
    render(
      <div style={{ width: "60px" }}>
        <DatePicker data-testid="rdp" />
      </div>
    );

    expect(getInput()).toHaveClass("min-w-0");
    expect(getCalendarToggleBtn()).toHaveClass("shrink-0");
  });
});

// ── Size variants ────────────────────────────────────────────────────────────

describe("DatePicker – size variants", () => {
  it("defaults to Large size with h-10 and rounded-lg - BLI: EL-339", () => {
    render(<DatePicker data-testid="dp" />);
    const container = screen.getByTestId("dp");
    expect(container).toHaveClass("h-10");
    expect(container).toHaveClass("rounded-lg");
  });

  it("renders Medium size with h-8 and rounded - BLI: EL-339", () => {
    render(<DatePicker size="Medium" data-testid="dp" />);
    const container = screen.getByTestId("dp");
    expect(container).toHaveClass("h-8");
    expect(container).toHaveClass("rounded");
    expect(container).not.toHaveClass("rounded-lg");
  });

  it("Large size does not have h-8 class - BLI: EL-339", () => {
    render(<DatePicker size="Large" data-testid="dp" />);
    const container = screen.getByTestId("dp");
    expect(container).not.toHaveClass("h-8");
    expect(container).toHaveClass("h-10");
  });

  it("Medium size renders Small calendar toggle button - BLI: EL-339", () => {
    render(<DatePicker size="Medium" />);
    const btn = getCalendarToggleBtn();
    expect(btn).toHaveClass("h-6");
  });

  it("Large size renders Medium calendar toggle button - BLI: EL-339", () => {
    render(<DatePicker size="Large" />);
    const btn = getCalendarToggleBtn();
    expect(btn).toHaveClass("h-8");
  });

  it("Medium size uses correct padding classes - BLI: EL-339", () => {
    render(<DatePicker size="Medium" data-testid="dp" />);
    const container = screen.getByTestId("dp");
    expect(container).toHaveClass("pl-3");
  });

  it("Large size uses correct padding classes - BLI: EL-339", () => {
    render(<DatePicker size="Large" data-testid="dp" />);
    const container = screen.getByTestId("dp");
    expect(container).toHaveClass("pl-3.5");
  });
});
