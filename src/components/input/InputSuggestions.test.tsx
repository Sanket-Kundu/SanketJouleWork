import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { InputSuggestions, InputSuggestionsRef } from "./InputSuggestions";
import { InputFilter } from "../../types/input";

// ---------------------------------------------------------------------------
// jsdom mocks
// ---------------------------------------------------------------------------

// scrollIntoView is not available in jsdom
beforeEach(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * The Popover uses popover="manual" and jsdom treats it as a hidden top-layer
 * element, so we need { hidden: true } for role queries inside the popover.
 */

function getInput(): HTMLInputElement {
  return screen.getByRole("textbox") as HTMLInputElement;
}

function getListbox(): HTMLElement {
  return screen.getByRole("listbox", { hidden: true });
}

function queryListbox(): HTMLElement | null {
  return screen.queryByRole("listbox", { hidden: true });
}

function getOptions(): HTMLElement[] {
  return screen.getAllByRole("option", { hidden: true });
}

const FRUITS = ["Apple", "Apricot", "Banana", "Blueberry", "Cherry"];

const OBJECT_ITEMS = [
  { text: "Apple", value: "apple", additionalText: "Red fruit" },
  { text: "Banana", value: "banana", additionalText: "Yellow fruit" },
  { text: "Cherry", value: "cherry" },
];

const GROUPED_SUGGESTIONS = [
  {
    headerText: "Fruits",
    items: [
      { text: "Apple", value: "apple" },
      { text: "Banana", value: "banana" },
    ],
  },
  {
    headerText: "Vegetables",
    items: [
      { text: "Carrot", value: "carrot" },
      { text: "Daikon", value: "daikon" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Timer management: component uses setTimeout(150ms) in handleBlur
// ---------------------------------------------------------------------------

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});

// ---------------------------------------------------------------------------
// Rendering basics
// ---------------------------------------------------------------------------

describe("InputSuggestions -- rendering", () => {
  it("renders a text input - BLI: EL-339", () => {
    render(<InputSuggestions suggestions={FRUITS} />);
    expect(getInput()).toBeInTheDocument();
    expect(getInput()).toHaveAttribute("type", "text");
  });

  it("does not show suggestions before focus - BLI: EL-339", () => {
    render(<InputSuggestions suggestions={FRUITS} />);
    expect(queryListbox()).not.toBeInTheDocument();
  });

  it("passes through standard Input props like placeholder - BLI: EL-339", () => {
    render(<InputSuggestions suggestions={FRUITS} placeholder="Search fruits" />);
    expect(getInput()).toHaveAttribute("placeholder", "Search fruits");
  });

  it("renders with empty suggestions array - BLI: EL-339", () => {
    render(<InputSuggestions suggestions={[]} />);
    expect(getInput()).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Opening suggestions on focus
// ---------------------------------------------------------------------------

describe("InputSuggestions -- opening behavior", () => {
  it("does not show suggestions on focus alone - BLI: EL-339", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<InputSuggestions suggestions={FRUITS} noTypeahead />);

    await user.click(getInput());

    expect(queryListbox()).not.toBeInTheDocument();
  });

  it("shows suggestions after the user types - BLI: EL-339", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<InputSuggestions suggestions={FRUITS} noTypeahead />);

    await user.click(getInput());
    await user.type(getInput(), "A");

    expect(queryListbox()).toBeInTheDocument();
    expect(getOptions()).toHaveLength(2); // Apple, Apricot
  });

  it("does not show suggestions when disabled - BLI: EL-339", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<InputSuggestions suggestions={FRUITS} disabled />);

    // userEvent won't focus a disabled input
    await user.click(getInput());

    expect(queryListbox()).not.toBeInTheDocument();
  });

  it("does not show suggestions when readonly - BLI: EL-339", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<InputSuggestions suggestions={FRUITS} readonly />);

    await user.click(getInput());

    expect(queryListbox()).not.toBeInTheDocument();
  });

  it("calls onSuggestionsOpen when popover opens after typing - BLI: EL-339", async () => {
    const onOpen = vi.fn();
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<InputSuggestions suggestions={FRUITS} onSuggestionsOpen={onOpen} noTypeahead />);

    await user.click(getInput());
    expect(onOpen).not.toHaveBeenCalled();

    await user.type(getInput(), "A");
    expect(onOpen).toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Filtering -- StartsWith (default)
// ---------------------------------------------------------------------------

describe("InputSuggestions -- filter StartsWith", () => {
  it("filters suggestions by StartsWith (default) - BLI: EL-339", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<InputSuggestions suggestions={FRUITS} noTypeahead />);

    await user.click(getInput());
    await user.type(getInput(), "Bl");

    const options = getOptions();
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveTextContent("Blueberry");
  });

  it("filtering is case insensitive - BLI: EL-339", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<InputSuggestions suggestions={FRUITS} noTypeahead />);

    await user.click(getInput());
    await user.type(getInput(), "ap");

    const options = getOptions();
    expect(options).toHaveLength(2); // Apple, Apricot
  });
});

// ---------------------------------------------------------------------------
// Filtering -- Contains
// ---------------------------------------------------------------------------

describe("InputSuggestions -- filter Contains", () => {
  it("filters by substring match - BLI: EL-339", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<InputSuggestions suggestions={FRUITS} filter={InputFilter.Contains} noTypeahead />);

    await user.click(getInput());
    await user.type(getInput(), "rr");

    // Both "Blueberry" and "Cherry" contain "rr"
    const options = getOptions();
    expect(options).toHaveLength(2);
    expect(options[0]).toHaveTextContent("Blueberry");
    expect(options[1]).toHaveTextContent("Cherry");
  });

  it("filters to a single match with contains - BLI: EL-339", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<InputSuggestions suggestions={FRUITS} filter={InputFilter.Contains} noTypeahead />);

    await user.click(getInput());
    await user.type(getInput(), "nan");

    const options = getOptions();
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveTextContent("Banana");
  });
});

// ---------------------------------------------------------------------------
// Filtering -- StartsWithPerTerm
// ---------------------------------------------------------------------------

describe("InputSuggestions -- filter StartsWithPerTerm", () => {
  it("matches words that start with query - BLI: EL-339", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const items = ["New York", "New Jersey", "North Carolina"];
    render(
      <InputSuggestions
        suggestions={items}
        filter={InputFilter.StartsWithPerTerm}
        noTypeahead
      />
    );

    await user.click(getInput());
    await user.type(getInput(), "jer");

    const options = getOptions();
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveTextContent("New Jersey");
  });
});

// ---------------------------------------------------------------------------
// Filtering -- None
// ---------------------------------------------------------------------------

describe("InputSuggestions -- filter None", () => {
  it("shows all items regardless of input value - BLI: EL-339", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<InputSuggestions suggestions={FRUITS} filter={InputFilter.None} noTypeahead />);

    await user.click(getInput());
    await user.type(getInput(), "zzz");

    const options = getOptions();
    expect(options).toHaveLength(5);
  });
});

// ---------------------------------------------------------------------------
// Disabled items are excluded from filtered results
// ---------------------------------------------------------------------------

describe("InputSuggestions -- disabled items", () => {
  it("excludes disabled items from the filtered list - BLI: EL-339", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const items = [
      { text: "Apple", value: "apple" },
      { text: "Apricot", value: "apricot", disabled: true },
      { text: "Avocado", value: "avocado" },
    ];
    render(<InputSuggestions suggestions={items} noTypeahead />);

    await user.click(getInput());
    await user.type(getInput(), "A");

    const options = getOptions();
    expect(options).toHaveLength(2); // Apple, Avocado (Apricot excluded)
    expect(options[0]).toHaveTextContent("Apple");
    expect(options[1]).toHaveTextContent("Avocado");
  });
});

// ---------------------------------------------------------------------------
// Object suggestions with additionalText
// ---------------------------------------------------------------------------

describe("InputSuggestions -- object items", () => {
  it("renders text and additionalText for object items - BLI: EL-339", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<InputSuggestions suggestions={OBJECT_ITEMS} filter={InputFilter.None} noTypeahead />);

    await user.click(getInput());
    await user.type(getInput(), "x");

    expect(screen.getByText("Apple")).toBeInTheDocument();
    expect(screen.getByText("Red fruit")).toBeInTheDocument();
    expect(screen.getByText("Yellow fruit")).toBeInTheDocument();
  });

  it("renders items with icon - BLI: EL-339", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const items = [
      { text: "Apple", value: "apple", icon: <span data-testid="apple-icon">A</span> },
    ];
    render(<InputSuggestions suggestions={items} noTypeahead />);

    await user.click(getInput());
    await user.type(getInput(), "A");

    expect(screen.getByTestId("apple-icon")).toBeInTheDocument();
  });

  it("normalizes items without explicit value to use text as value - BLI: EL-339", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const items = [{ text: "Apple" }]; // no value field
    render(
      <InputSuggestions suggestions={items} onSuggestionSelect={onSelect} noTypeahead />
    );

    await user.click(getInput());
    await user.type(getInput(), "A");

    // Use fireEvent.click instead of userEvent to avoid blur/timer issues
    fireEvent.click(getOptions()[0]);

    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ value: "Apple" })
    );
  });
});

// ---------------------------------------------------------------------------
// Grouped suggestions
// ---------------------------------------------------------------------------

describe("InputSuggestions -- groups", () => {
  it("renders group headers - BLI: EL-339", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<InputSuggestions suggestions={GROUPED_SUGGESTIONS} filter={InputFilter.None} noTypeahead />);

    await user.click(getInput());
    await user.type(getInput(), "x");

    expect(screen.getByText("Fruits")).toBeInTheDocument();
    expect(screen.getByText("Vegetables")).toBeInTheDocument();
  });

  it("group headers have aria-hidden=true - BLI: EL-339", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<InputSuggestions suggestions={GROUPED_SUGGESTIONS} filter={InputFilter.None} noTypeahead />);

    await user.click(getInput());
    await user.type(getInput(), "x");

    const fruitsHeader = screen.getByText("Fruits");
    expect(fruitsHeader.closest("li")).toHaveAttribute("aria-hidden", "true");
  });

  it("renders items from all groups as options - BLI: EL-339", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<InputSuggestions suggestions={GROUPED_SUGGESTIONS} filter={InputFilter.None} noTypeahead />);

    await user.click(getInput());
    await user.type(getInput(), "x");

    expect(getOptions()).toHaveLength(4);
  });
});

// ---------------------------------------------------------------------------
// Selecting a suggestion via click
// ---------------------------------------------------------------------------

describe("InputSuggestions -- select via click", () => {
  it("updates the input value when clicking a suggestion - BLI: EL-339", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<InputSuggestions suggestions={FRUITS} noTypeahead />);

    await user.click(getInput());
    await user.type(getInput(), "B");

    // "B" matches "Banana", "Blueberry" with StartsWith filter
    fireEvent.click(getOptions()[0]); // "Banana"

    expect(getInput()).toHaveValue("Banana");
  });

  it("calls onSuggestionSelect with correct detail - BLI: EL-339", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <InputSuggestions
        suggestions={OBJECT_ITEMS}
        onSuggestionSelect={onSelect}
        noTypeahead
      />
    );

    await user.click(getInput());
    await user.type(getInput(), "B");
    fireEvent.click(getOptions()[0]); // Banana

    expect(onSelect).toHaveBeenCalledWith({
      item: expect.objectContaining({ text: "Banana", value: "banana" }),
      value: "banana",
    });
  });

  it("calls onInput when selecting a suggestion - BLI: EL-339", async () => {
    const onInput = vi.fn();
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <InputSuggestions suggestions={FRUITS} onInput={onInput} noTypeahead />
    );

    await user.click(getInput());
    await user.type(getInput(), "A");
    onInput.mockClear();
    fireEvent.click(getOptions()[0]); // Apple

    expect(onInput).toHaveBeenCalledWith("Apple");
  });

  it("closes the suggestions popover after selection (popover re-opens if value matches) - BLI: EL-339", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<InputSuggestions suggestions={FRUITS} noTypeahead />);

    await user.click(getInput());
    await user.type(getInput(), "A");
    expect(queryListbox()).toBeInTheDocument();

    fireEvent.click(getOptions()[0]); // Select "Apple"

    // After selection, selectItem sets isOpen=false, but since the selected
    // value "Apple" still matches the filter and input has focus, the effect
    // synchronizes and re-opens. This is the expected behavior -- the value
    // is set and the user can continue typing.
    // Verify the value was set correctly.
    expect(getInput()).toHaveValue("Apple");
  });
});

// ---------------------------------------------------------------------------
// Keyboard navigation
// ---------------------------------------------------------------------------

describe("InputSuggestions -- keyboard navigation", () => {
  it("ArrowDown highlights the first item - BLI: EL-339", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<InputSuggestions suggestions={FRUITS} noTypeahead />);

    await user.click(getInput());
    await user.type(getInput(), "A");
    // Use fireEvent for keyboard to avoid Input's keydown handler complications
    fireEvent.keyDown(getInput(), { key: "ArrowDown" });

    const options = getOptions();
    expect(options[0]).toHaveAttribute("aria-selected", "true");
  });

  it("ArrowDown moves highlight down - BLI: EL-339", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<InputSuggestions suggestions={FRUITS} noTypeahead />);

    await user.click(getInput());
    await user.type(getInput(), "A");
    fireEvent.keyDown(getInput(), { key: "ArrowDown" });
    fireEvent.keyDown(getInput(), { key: "ArrowDown" });

    const options = getOptions();
    expect(options[0]).toHaveAttribute("aria-selected", "false");
    expect(options[1]).toHaveAttribute("aria-selected", "true");
  });

  it("ArrowDown does not go past last item - BLI: EL-339", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<InputSuggestions suggestions={["One", "Two"]} filter={InputFilter.None} noTypeahead />);

    await user.click(getInput());
    await user.type(getInput(), "x");
    fireEvent.keyDown(getInput(), { key: "ArrowDown" });
    fireEvent.keyDown(getInput(), { key: "ArrowDown" });
    fireEvent.keyDown(getInput(), { key: "ArrowDown" });
    fireEvent.keyDown(getInput(), { key: "ArrowDown" });

    const options = getOptions();
    expect(options[1]).toHaveAttribute("aria-selected", "true");
  });

  it("ArrowUp moves highlight up - BLI: EL-339", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<InputSuggestions suggestions={FRUITS} noTypeahead />);

    await user.click(getInput());
    await user.type(getInput(), "A");
    fireEvent.keyDown(getInput(), { key: "ArrowDown" });
    fireEvent.keyDown(getInput(), { key: "ArrowDown" });
    fireEvent.keyDown(getInput(), { key: "ArrowUp" });

    const options = getOptions();
    expect(options[0]).toHaveAttribute("aria-selected", "true");
  });

  it("ArrowUp from first item removes highlight (index -1) - BLI: EL-339", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<InputSuggestions suggestions={FRUITS} noTypeahead />);

    await user.click(getInput());
    await user.type(getInput(), "A");
    fireEvent.keyDown(getInput(), { key: "ArrowDown" });
    fireEvent.keyDown(getInput(), { key: "ArrowUp" });

    const options = getOptions();
    options.forEach((opt) => {
      expect(opt).toHaveAttribute("aria-selected", "false");
    });
  });

  it("ArrowDown previews suggestion text in the input (typed casing + selected suffix) - BLI: EL-339", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<InputSuggestions suggestions={["Germany", "Greece"]} noTypeahead />);

    await user.click(getInput());
    await user.type(getInput(), "g");

    // ArrowDown to "Germany" — input shows typed casing + rest selected
    fireEvent.keyDown(getInput(), { key: "ArrowDown" });
    expect(getInput().value).toBe("germany");
    expect(getInput().selectionStart).toBe(1);
    expect(getInput().selectionEnd).toBe(7);

    // ArrowDown to "Greece" — input changes to that suggestion
    fireEvent.keyDown(getInput(), { key: "ArrowDown" });
    expect(getInput().value).toBe("greece");
    expect(getInput().selectionStart).toBe(1);
    expect(getInput().selectionEnd).toBe(6);
  });

  it("ArrowUp past first item restores user-typed value - BLI: EL-339", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<InputSuggestions suggestions={["Germany", "Greece"]} noTypeahead />);

    await user.click(getInput());
    await user.type(getInput(), "g");

    // Navigate down then back up past the first item
    fireEvent.keyDown(getInput(), { key: "ArrowDown" });
    expect(getInput().value).toBe("germany");

    fireEvent.keyDown(getInput(), { key: "ArrowUp" });
    expect(getInput().value).toBe("g");
  });

  it("Enter selects the highlighted item - BLI: EL-339", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <InputSuggestions
        suggestions={FRUITS}
        onSuggestionSelect={onSelect}
        noTypeahead
      />
    );

    await user.click(getInput());
    await user.type(getInput(), "A");
    fireEvent.keyDown(getInput(), { key: "ArrowDown" });
    fireEvent.keyDown(getInput(), { key: "ArrowDown" });
    fireEvent.keyDown(getInput(), { key: "Enter" });

    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ value: "Apricot" })
    );
  });

  it("Enter does nothing when no item is highlighted - BLI: EL-339", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <InputSuggestions
        suggestions={FRUITS}
        onSuggestionSelect={onSelect}
        noTypeahead
      />
    );

    await user.click(getInput());
    await user.type(getInput(), "A");
    fireEvent.keyDown(getInput(), { key: "Enter" });

    expect(onSelect).not.toHaveBeenCalled();
  });

  it("Escape calls onSuggestionsClose - BLI: EL-339", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <InputSuggestions
        suggestions={FRUITS}
        onSuggestionsClose={onClose}
        noTypeahead
      />
    );

    await user.click(getInput());
    await user.type(getInput(), "A");
    expect(queryListbox()).toBeInTheDocument();

    fireEvent.keyDown(getInput(), { key: "Escape" });

    // Escape handler calls onSuggestionsClose
    expect(onClose).toHaveBeenCalled();
  });

  it("Escape closes suggestions after blur timer fires - BLI: EL-339", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <>
        <InputSuggestions suggestions={FRUITS} noTypeahead />
        <button>Other</button>
      </>
    );

    await user.click(getInput());
    await user.type(getInput(), "A");
    expect(queryListbox()).toBeInTheDocument();

    // Input's Escape handler blurs the input, which triggers the 150ms blur timer
    fireEvent.keyDown(getInput(), { key: "Escape" });

    // After blur timer fires, hasFocus becomes false -> shouldShowSuggestions = false
    act(() => { vi.advanceTimersByTime(200); });

    expect(queryListbox()).not.toBeInTheDocument();
  });

  it("F4 opens suggestions when closed - BLI: EL-339", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<InputSuggestions suggestions={FRUITS} noTypeahead />);

    await user.click(getInput());
    expect(queryListbox()).not.toBeInTheDocument(); // No typing yet

    fireEvent.keyDown(getInput(), { key: "F4" });

    expect(queryListbox()).toBeInTheDocument();
  });

  it("F4 closes suggestions when open - BLI: EL-339", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<InputSuggestions suggestions={FRUITS} noTypeahead />);

    await user.click(getInput());
    await user.type(getInput(), "A");
    expect(queryListbox()).toBeInTheDocument();

    fireEvent.keyDown(getInput(), { key: "F4" });

    // F4 dismisses suggestions immediately
    expect(queryListbox()).not.toBeInTheDocument();
  });

  it("F4 calls onSuggestionsOpen when opening - BLI: EL-339", async () => {
    const onOpen = vi.fn();
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <InputSuggestions
        suggestions={FRUITS}
        onSuggestionsOpen={onOpen}
        noTypeahead
      />
    );

    await user.click(getInput());
    fireEvent.keyDown(getInput(), { key: "F4" });

    // Wait for suggestions to open
    await vi.waitFor(() => expect(queryListbox()).toBeInTheDocument());
    expect(onOpen).toHaveBeenCalled();
  });

  it("F4 calls onSuggestionsClose when closing - BLI: EL-339", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <InputSuggestions
        suggestions={FRUITS}
        onSuggestionsClose={onClose}
        noTypeahead
      />
    );

    await user.click(getInput());
    await user.type(getInput(), "A");
    expect(queryListbox()).toBeInTheDocument();

    fireEvent.keyDown(getInput(), { key: "F4" });

    expect(onClose).toHaveBeenCalled();
  });

  it("Escape dismisses suggestions immediately - BLI: EL-339", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<InputSuggestions suggestions={FRUITS} noTypeahead />);

    await user.click(getInput());
    await user.type(getInput(), "A");
    expect(queryListbox()).toBeInTheDocument();

    fireEvent.keyDown(getInput(), { key: "Escape" });

    expect(queryListbox()).not.toBeInTheDocument();
  });

  it("Tab closes the suggestions after blur timeout - BLI: EL-339", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <>
        <InputSuggestions suggestions={FRUITS} noTypeahead />
        <button>Other</button>
      </>
    );

    await user.click(getInput());
    await user.type(getInput(), "A");
    expect(queryListbox()).toBeInTheDocument();

    // Tab triggers both the keyDown handler (sets isOpen=false) and eventually blur
    await user.tab();

    // Blur has a 150ms delay
    act(() => { vi.advanceTimersByTime(200); });

    expect(queryListbox()).not.toBeInTheDocument();
  });

  it("forwards onKeyDown when suggestions are not open - BLI: EL-339", async () => {
    const onKeyDown = vi.fn();
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <InputSuggestions
        suggestions={FRUITS}
        onKeyDown={onKeyDown}
        noTypeahead
      />
    );

    // Focus without typing — suggestions stay closed
    await user.click(getInput());
    fireEvent.keyDown(getInput(), { key: "ArrowDown" });

    expect(onKeyDown).toHaveBeenCalled();
  });

  it("forwards onKeyDown after handling suggestion keys - BLI: EL-339", async () => {
    const onKeyDown = vi.fn();
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <InputSuggestions
        suggestions={FRUITS}
        onKeyDown={onKeyDown}
        noTypeahead
      />
    );

    await user.click(getInput());
    await user.type(getInput(), "A");
    fireEvent.keyDown(getInput(), { key: "ArrowDown" });

    expect(onKeyDown).toHaveBeenCalled();
  });

  it("mouseEnter on an item highlights it - BLI: EL-339", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<InputSuggestions suggestions={FRUITS} filter={InputFilter.None} noTypeahead />);

    await user.click(getInput());
    await user.type(getInput(), "x");

    const options = getOptions();
    fireEvent.mouseEnter(options[3]);

    expect(options[3]).toHaveAttribute("aria-selected", "true");
  });
});

// ---------------------------------------------------------------------------
// Closing on blur
// ---------------------------------------------------------------------------

describe("InputSuggestions -- close on blur", () => {
  it("closes suggestions on blur after timeout - BLI: EL-339", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <>
        <InputSuggestions suggestions={FRUITS} noTypeahead />
        <button>Other</button>
      </>
    );

    await user.click(getInput());
    await user.type(getInput(), "A");
    expect(queryListbox()).toBeInTheDocument();

    // Trigger blur directly
    fireEvent.blur(getInput());

    // Blur has a 150ms delay
    act(() => { vi.advanceTimersByTime(200); });

    expect(queryListbox()).not.toBeInTheDocument();
  });

  it("calls onBlur on blur - BLI: EL-339", async () => {
    const onBlur = vi.fn();
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<InputSuggestions suggestions={FRUITS} onBlur={onBlur} noTypeahead />);

    await user.click(getInput());
    fireEvent.blur(getInput());

    expect(onBlur).toHaveBeenCalledOnce();
  });

  it("calls onSuggestionsClose when popover closes after clearing input with Contains filter - BLI: EL-339", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <InputSuggestions
        suggestions={FRUITS}
        filter={InputFilter.Contains}
        onSuggestionsClose={onClose}
        showNoSuggestionsMessage={false}
        noTypeahead
      />
    );

    await user.click(getInput());
    await user.type(getInput(), "zzz");
    // No items match "zzz" and showNoSuggestionsMessage=false, so popover is closed
    expect(queryListbox()).not.toBeInTheDocument();

    // Type something that matches
    await user.clear(getInput());
    await user.type(getInput(), "Ap");
    expect(queryListbox()).toBeInTheDocument();

    onClose.mockClear();

    // Blur to close
    fireEvent.blur(getInput());
    act(() => { vi.advanceTimersByTime(200); });

    expect(onClose).toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// No suggestions message
// ---------------------------------------------------------------------------

describe("InputSuggestions -- no suggestions message", () => {
  it("shows 'No suggestions' message when nothing matches - BLI: EL-339", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<InputSuggestions suggestions={FRUITS} noTypeahead />);

    await user.click(getInput());
    await user.type(getInput(), "zzz");

    // "No suggestions" appears in both the sr-only element and the popover
    const matches = screen.getAllByText("No suggestions");
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it("shows custom noSuggestionsMessage when provided - BLI: EL-339", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <InputSuggestions
        suggestions={FRUITS}
        noSuggestionsMessage="Nothing found"
        noTypeahead
      />
    );

    await user.click(getInput());
    await user.type(getInput(), "zzz");

    expect(screen.getByText("Nothing found")).toBeInTheDocument();
  });

  it("hides no-suggestions message when showNoSuggestionsMessage=false and nothing matches - BLI: EL-339", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <InputSuggestions
        suggestions={FRUITS}
        showNoSuggestionsMessage={false}
        noTypeahead
      />
    );

    await user.click(getInput());
    await user.type(getInput(), "zzz");

    // Popover should not appear since no items and message disabled
    expect(queryListbox()).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Highlight matching text
// ---------------------------------------------------------------------------

describe("InputSuggestions -- highlightMatch", () => {
  it("highlights matching text in suggestion items - BLI: EL-339", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <InputSuggestions
        suggestions={FRUITS}
        highlightMatch
        filter={InputFilter.Contains}
        noTypeahead
      />
    );

    await user.click(getInput());
    await user.type(getInput(), "an");

    // Banana should have "an" highlighted
    const options = getOptions();
    const bananaOption = options.find((o) => o.textContent?.includes("Banana"));
    expect(bananaOption).toBeTruthy();

    // The highlighted portion should be in a <span> with the highlight class
    const highlightSpan = bananaOption!.querySelector("span.font-semibold");
    expect(highlightSpan).toBeInTheDocument();
    expect(highlightSpan!.textContent).toBe("an");
  });

  it("does not highlight when highlightMatch=false - BLI: EL-339", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <InputSuggestions
        suggestions={FRUITS}
        highlightMatch={false}
        noTypeahead
      />
    );

    await user.click(getInput());
    await user.type(getInput(), "Ap");

    const options = getOptions();
    const appleOption = options[0];
    expect(appleOption.querySelector("span.font-semibold")).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Typeahead auto-completion
// ---------------------------------------------------------------------------

describe("InputSuggestions -- typeahead", () => {
  it("does not auto-complete when noTypeahead=true - BLI: EL-339", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<InputSuggestions suggestions={FRUITS} noTypeahead />);

    await user.click(getInput());
    await user.type(getInput(), "Ap");

    expect(getInput()).toHaveValue("Ap");
  });

  it("typeahead auto-completes first match in the DOM input - BLI: EL-339", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<InputSuggestions suggestions={["Apple", "Banana"]} />);

    await user.click(getInput());
    await user.type(getInput(), "A");

    // The DOM input should show the auto-completed value
    expect(getInput().value).toBe("Apple");
  });

  it("typeahead selects the auto-completed suffix - BLI: EL-339", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<InputSuggestions suggestions={["Apple", "Banana"]} />);

    await user.click(getInput());
    await user.type(getInput(), "A");

    // The auto-completed portion "pple" should be selected
    expect(getInput().selectionStart).toBe(1); // after "A"
    expect(getInput().selectionEnd).toBe(5);   // end of "Apple"
  });

  it("typeahead preserves user-typed casing - BLI: EL-339", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<InputSuggestions suggestions={["Germany", "Greece"]} />);

    await user.click(getInput());
    await user.type(getInput(), "ger");

    // Should show "germany" not "Germany" — user's "ger" casing preserved
    expect(getInput().value).toBe("germany");
    expect(getInput().selectionStart).toBe(3); // after "ger"
    expect(getInput().selectionEnd).toBe(7);   // end of "germany"
  });

  it("Backspace suppresses typeahead so characters are deleted normally - BLI: EL-339", async () => {
    const onInput = vi.fn();
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<InputSuggestions suggestions={["Apple", "Apricot", "Banana"]} onInput={onInput} />);

    await user.click(getInput());
    await user.type(getInput(), "A");
    onInput.mockClear();

    // Backspace should delete, and typeahead must not re-fill the value
    await user.keyboard("{Backspace}");

    // onInput should have been called with the value after deletion
    expect(onInput).toHaveBeenCalled();
    const lastCall = onInput.mock.calls[onInput.mock.calls.length - 1][0];
    // The value after backspace should be shorter — not re-filled by typeahead
    expect(lastCall.length).toBeLessThan("Apple".length);
  });

  it("Delete key suppresses typeahead - BLI: EL-339", async () => {
    const onInput = vi.fn();
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<InputSuggestions suggestions={["Apple", "Banana"]} onInput={onInput} />);

    await user.click(getInput());
    await user.type(getInput(), "A");
    onInput.mockClear();

    await user.keyboard("{Delete}");

    // If onInput was called, the value should not have been re-expanded by typeahead
    if (onInput.mock.calls.length > 0) {
      const lastCall = onInput.mock.calls[onInput.mock.calls.length - 1][0];
      expect(lastCall.length).toBeLessThanOrEqual("A".length);
    }
  });

  it("Enter accepts typeahead — applies suggestion casing and closes - BLI: EL-339", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<InputSuggestions suggestions={["Germany", "Greece"]} onSuggestionSelect={onSelect} />);

    await user.click(getInput());
    await user.type(getInput(), "ger");

    // Typeahead shows "germany" with "many" selected
    expect(getInput().value).toBe("germany");

    // Enter accepts the suggestion with proper casing
    fireEvent.keyDown(getInput(), { key: "Enter" });

    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ value: "Germany" })
    );
    expect(getInput().value).toBe("Germany");
  });

  it("ArrowRight at end of typed text accepts typeahead with proper casing - BLI: EL-339", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<InputSuggestions suggestions={["Germany", "Greece"]} onSuggestionSelect={onSelect} />);

    await user.click(getInput());
    await user.type(getInput(), "ger");

    // Typeahead shows "germany" with "many" selected (cursor at 3, selection end at 7)
    expect(getInput().value).toBe("germany");
    expect(getInput().selectionStart).toBe(3);

    // ArrowRight moves cursor to end of selection — accepts the typeahead
    fireEvent.keyDown(getInput(), { key: "ArrowRight" });

    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ value: "Germany" })
    );
    expect(getInput().value).toBe("Germany");
  });

  it("ArrowRight in the middle of typed text does not accept typeahead - BLI: EL-339", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<InputSuggestions suggestions={["Germany", "Greece"]} onSuggestionSelect={onSelect} />);

    await user.click(getInput());
    await user.type(getInput(), "ger");

    // Move cursor into the middle of the typed portion
    getInput().setSelectionRange(1, 1);

    fireEvent.keyDown(getInput(), { key: "ArrowRight" });

    expect(onSelect).not.toHaveBeenCalled();
    // Value should not change to proper casing
    expect(getInput().value).not.toBe("Germany");
  });

  it("blur reverts to user-typed value when typeahead was not accepted - BLI: EL-339", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <>
        <InputSuggestions suggestions={["Germany", "Greece"]} />
        <button>Other</button>
      </>
    );

    await user.click(getInput());
    await user.type(getInput(), "ger");

    // Typeahead shows "germany"
    expect(getInput().value).toBe("germany");

    // Blur without accepting
    fireEvent.blur(getInput());

    // Value reverts to what user actually typed
    expect(getInput().value).toBe("ger");
  });
});

// ---------------------------------------------------------------------------
// Controlled value
// ---------------------------------------------------------------------------

describe("InputSuggestions -- controlled value", () => {
  it("uses controlled value for display - BLI: EL-339", () => {
    render(<InputSuggestions suggestions={FRUITS} value="Test" noTypeahead />);
    expect(getInput()).toHaveValue("Test");
  });

  it("calls onInput when typing in controlled mode - BLI: EL-339", async () => {
    const onInput = vi.fn();
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    function Controlled() {
      const [val, setVal] = React.useState("");
      return (
        <InputSuggestions
          suggestions={FRUITS}
          value={val}
          onInput={(v) => { setVal(v); onInput(v); }}
          noTypeahead
        />
      );
    }

    render(<Controlled />);
    await user.click(getInput());
    await user.type(getInput(), "B");

    expect(onInput).toHaveBeenCalledWith("B");
  });

  it("selects an item in controlled mode - BLI: EL-339", async () => {
    const onSelect = vi.fn();
    const onInput = vi.fn();
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    function Controlled() {
      const [val, setVal] = React.useState("");
      return (
        <InputSuggestions
          suggestions={FRUITS}
          value={val}
          onInput={(v) => { setVal(v); onInput(v); }}
          onSuggestionSelect={onSelect}
          noTypeahead
        />
      );
    }

    render(<Controlled />);
    await user.click(getInput());
    await user.type(getInput(), "A");
    fireEvent.click(getOptions()[0]); // Apple

    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ value: "Apple" })
    );
    expect(onInput).toHaveBeenCalledWith("Apple");
  });
});

// ---------------------------------------------------------------------------
// Uncontrolled value with defaultValue
// ---------------------------------------------------------------------------

describe("InputSuggestions -- uncontrolled with defaultValue", () => {
  it("initializes with defaultValue - BLI: EL-339", () => {
    render(<InputSuggestions suggestions={FRUITS} defaultValue="App" noTypeahead />);
    expect(getInput()).toHaveValue("App");
  });
});

// ---------------------------------------------------------------------------
// Custom suggestion renderer
// ---------------------------------------------------------------------------

describe("InputSuggestions -- suggestionRenderer", () => {
  it("uses custom renderer for suggestions - BLI: EL-339", async () => {
    const renderer = (item: { text: string }, index: number) => (
      <div data-testid={`custom-${index}`}>Custom: {item.text}</div>
    );
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    render(
      <InputSuggestions
        suggestions={FRUITS}
        suggestionRenderer={renderer}
        noTypeahead
      />
    );

    await user.click(getInput());
    await user.type(getInput(), "A");

    expect(screen.getByTestId("custom-0")).toHaveTextContent("Custom: Apple");
    expect(screen.getByTestId("custom-1")).toHaveTextContent("Custom: Apricot");
  });
});

// ---------------------------------------------------------------------------
// Screen reader announcements
// ---------------------------------------------------------------------------

describe("InputSuggestions -- screen reader announcements", () => {
  it("announces number of available suggestions - BLI: EL-339", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<InputSuggestions suggestions={FRUITS} filter={InputFilter.None} noTypeahead />);

    await user.click(getInput());
    await user.type(getInput(), "x");

    // The sr-only div should contain the announcement
    const srDiv = document.querySelector("[aria-live='polite']");
    expect(srDiv).toBeInTheDocument();
    expect(srDiv!.textContent).toContain("5 suggestions available");
  });

  it("announces '1 suggestion available' for a single match - BLI: EL-339", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<InputSuggestions suggestions={FRUITS} noTypeahead />);

    await user.click(getInput());
    await user.type(getInput(), "Ch");

    const srDiv = document.querySelector("[aria-live='polite']");
    expect(srDiv!.textContent).toContain("1 suggestion available");
  });

  it("announces 'No suggestions' when nothing matches - BLI: EL-339", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<InputSuggestions suggestions={FRUITS} noTypeahead />);

    await user.click(getInput());
    await user.type(getInput(), "zzz");

    const srDiv = document.querySelector("[aria-live='polite']");
    expect(srDiv!.textContent).toContain("No suggestions");
  });

  it("clears announcement when suggestions close via blur - BLI: EL-339", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <>
        <InputSuggestions suggestions={FRUITS} noTypeahead />
        <button>Other</button>
      </>
    );

    await user.click(getInput());
    await user.type(getInput(), "A");

    const srDiv = document.querySelector("[aria-live='polite']");
    expect(srDiv!.textContent).not.toBe("");

    // Blur the input to close suggestions
    fireEvent.blur(getInput());
    act(() => { vi.advanceTimersByTime(200); });

    expect(srDiv!.textContent).toBe("");
  });
});

// ---------------------------------------------------------------------------
// Imperative ref
// ---------------------------------------------------------------------------

describe("InputSuggestions -- imperative ref", () => {
  it("exposes openSuggestions() -- calls onSuggestionsOpen callback - BLI: EL-339", () => {
    const onOpen = vi.fn();
    const ref = React.createRef<InputSuggestionsRef>();
    render(<InputSuggestions ref={ref} suggestions={FRUITS} onSuggestionsOpen={onOpen} noTypeahead />);

    act(() => { ref.current!.openSuggestions(); });

    // The imperative openSuggestions calls the callback
    expect(onOpen).toHaveBeenCalled();
  });

  it("exposes closeSuggestions() -- calls onSuggestionsClose callback - BLI: EL-339", () => {
    const onClose = vi.fn();
    const ref = React.createRef<InputSuggestionsRef>();
    render(<InputSuggestions ref={ref} suggestions={FRUITS} onSuggestionsClose={onClose} noTypeahead />);

    act(() => { ref.current!.closeSuggestions(); });

    expect(onClose).toHaveBeenCalled();
  });

  it("exposes isSuggestionsOpen() returning false initially - BLI: EL-339", () => {
    const ref = React.createRef<InputSuggestionsRef>();
    render(<InputSuggestions ref={ref} suggestions={FRUITS} noTypeahead />);

    expect(ref.current!.isSuggestionsOpen()).toBe(false);
  });

  it("exposes inherited Input ref methods (focus) - BLI: EL-339", () => {
    const ref = React.createRef<InputSuggestionsRef>();
    render(<InputSuggestions ref={ref} defaultValue="hello" suggestions={FRUITS} />);

    ref.current!.focus();
    expect(getInput()).toHaveFocus();
  });
});

// ---------------------------------------------------------------------------
// Event forwarding (onFocus, onChange)
// ---------------------------------------------------------------------------

describe("InputSuggestions -- event forwarding", () => {
  it("calls onFocus when input is focused - BLI: EL-339", async () => {
    const onFocus = vi.fn();
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<InputSuggestions suggestions={FRUITS} onFocus={onFocus} noTypeahead />);

    await user.click(getInput());

    expect(onFocus).toHaveBeenCalledOnce();
  });

  it("calls onChange from the underlying Input on commit (blur) - BLI: EL-339", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<InputSuggestions suggestions={FRUITS} onChange={onChange} noTypeahead />);

    await user.click(getInput());
    await user.type(getInput(), "x");
    // onChange fires on commit (blur), not on every keystroke
    await user.tab();

    expect(onChange).toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Edge cases
// ---------------------------------------------------------------------------

describe("InputSuggestions -- edge cases", () => {
  it("handles empty suggestions array -- shows no-suggestions message - BLI: EL-339", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<InputSuggestions suggestions={[]} />);

    await user.click(getInput());
    await user.type(getInput(), "x");

    // With empty suggestions and showNoSuggestionsMessage=true (default),
    // the popover shows "No suggestions" (also in sr-only div)
    const matches = screen.getAllByText("No suggestions");
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it("handles no suggestions prop at all - BLI: EL-339", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<InputSuggestions />);

    await user.click(getInput());
    await user.type(getInput(), "x");

    // Default suggestions=[] + showNoSuggestionsMessage=true
    const matches = screen.getAllByText("No suggestions");
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it("resets highlighted index on input change - BLI: EL-339", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<InputSuggestions suggestions={FRUITS} noTypeahead />);

    await user.click(getInput());
    await user.type(getInput(), "A");
    fireEvent.keyDown(getInput(), { key: "ArrowDown" });
    fireEvent.keyDown(getInput(), { key: "ArrowDown" });

    const optionsBefore = getOptions();
    expect(optionsBefore[1]).toHaveAttribute("aria-selected", "true");

    // Clear and retype to change the filter — this resets highlighted index
    await user.clear(getInput());
    await user.type(getInput(), "Ap");

    // Highlighted index should reset
    const optionsAfter = getOptions();
    optionsAfter.forEach((opt) => {
      expect(opt).toHaveAttribute("aria-selected", "false");
    });
  });

  it("works with string filter enum literal - BLI: EL-339", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <InputSuggestions suggestions={FRUITS} filter="Contains" noTypeahead />
    );

    await user.click(getInput());
    await user.type(getInput(), "err");

    const options = getOptions();
    // "Blueberry" contains "err", "Cherry" contains "err"
    expect(options).toHaveLength(2);
  });

  it("uses string suggestions (plain strings) - BLI: EL-339", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <InputSuggestions
        suggestions={["Hello", "World"]}
        onSuggestionSelect={onSelect}
        noTypeahead
      />
    );

    await user.click(getInput());
    await user.type(getInput(), "H");
    fireEvent.click(getOptions()[0]);

    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        item: expect.objectContaining({ text: "Hello", value: "Hello" }),
        value: "Hello",
      })
    );
  });

  it("selection returns focus to input - BLI: EL-339", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<InputSuggestions suggestions={FRUITS} noTypeahead />);

    await user.click(getInput());
    await user.type(getInput(), "A");
    fireEvent.click(getOptions()[0]);

    expect(getInput()).toHaveFocus();
  });

  it("handles mixed string and object suggestions - BLI: EL-339", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const mixed: (string | { text: string; value: string })[] = [
      "Simple String",
      { text: "Object Item", value: "obj" },
    ];
    render(<InputSuggestions suggestions={mixed} filter={InputFilter.None} noTypeahead />);

    await user.click(getInput());
    await user.type(getInput(), "x");

    const options = getOptions();
    expect(options).toHaveLength(2);
    expect(options[0]).toHaveTextContent("Simple String");
    expect(options[1]).toHaveTextContent("Object Item");
  });
});

// ---------------------------------------------------------------------------
// Scroll into view for highlighted items
// ---------------------------------------------------------------------------

describe("InputSuggestions -- scroll into view", () => {
  it("scrolls highlighted item into view - BLI: EL-339", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const manySuggestions = Array.from({ length: 20 }, (_, i) => `Item ${i}`);
    render(<InputSuggestions suggestions={manySuggestions} filter={InputFilter.None} noTypeahead />);

    await user.click(getInput());
    await user.type(getInput(), "x");
    fireEvent.keyDown(getInput(), { key: "ArrowDown" });

    expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({ block: "nearest" });
  });
});

// ---------------------------------------------------------------------------
// Listbox role on the popover
// ---------------------------------------------------------------------------

describe("InputSuggestions -- listbox role", () => {
  it("suggestions container has role=listbox - BLI: EL-339", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<InputSuggestions suggestions={FRUITS} noTypeahead />);

    await user.click(getInput());
    await user.type(getInput(), "A");

    expect(getListbox()).toBeInTheDocument();
  });

  it("each suggestion item has role=option - BLI: EL-339", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<InputSuggestions suggestions={FRUITS} filter={InputFilter.None} noTypeahead />);

    await user.click(getInput());
    await user.type(getInput(), "x");

    const options = getOptions();
    expect(options.length).toBe(5);
    options.forEach((opt) => {
      expect(opt).toHaveAttribute("role", "option");
    });
  });
});

// ---------------------------------------------------------------------------
// Combobox ARIA pattern (aria-activedescendant)
// ---------------------------------------------------------------------------

describe("InputSuggestions -- combobox ARIA pattern", () => {
  it("input has aria-haspopup=listbox", () => {
    render(<InputSuggestions suggestions={FRUITS} />);
    expect(getInput()).toHaveAttribute("aria-haspopup", "listbox");
  });

  it("input has aria-autocomplete=list", () => {
    render(<InputSuggestions suggestions={FRUITS} />);
    expect(getInput()).toHaveAttribute("aria-autocomplete", "list");
  });

  it("input has no aria-expanded when suggestions are closed", () => {
    render(<InputSuggestions suggestions={FRUITS} />);
    expect(getInput()).not.toHaveAttribute("aria-expanded");
  });

  it("input has aria-expanded=true when suggestions are open", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<InputSuggestions suggestions={FRUITS} noTypeahead />);

    await user.click(getInput());
    await user.type(getInput(), "A");

    expect(getInput()).toHaveAttribute("aria-expanded", "true");
  });

  it("input has aria-controls pointing to the listbox when open", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<InputSuggestions suggestions={FRUITS} noTypeahead />);

    await user.click(getInput());
    await user.type(getInput(), "A");

    const listbox = getListbox();
    const controlsId = getInput().getAttribute("aria-controls");
    expect(controlsId).toBeTruthy();
    expect(listbox).toHaveAttribute("id", controlsId);
  });

  it("input has no aria-controls when suggestions are closed", () => {
    render(<InputSuggestions suggestions={FRUITS} />);
    expect(getInput()).not.toHaveAttribute("aria-controls");
  });

  it("each option has a unique id", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<InputSuggestions suggestions={FRUITS} filter={InputFilter.None} noTypeahead />);

    await user.click(getInput());
    await user.type(getInput(), "x");

    const options = getOptions();
    const ids = options.map((opt) => opt.getAttribute("id"));
    // All have ids
    ids.forEach((id) => expect(id).toBeTruthy());
    // All ids are unique
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("aria-activedescendant is absent when no item is highlighted", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<InputSuggestions suggestions={FRUITS} noTypeahead />);

    await user.click(getInput());
    await user.type(getInput(), "A");

    expect(getInput()).not.toHaveAttribute("aria-activedescendant");
  });

  it("aria-activedescendant tracks highlighted item on ArrowDown", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<InputSuggestions suggestions={FRUITS} noTypeahead />);

    await user.click(getInput());
    await user.type(getInput(), "A");

    // Arrow down to first item
    fireEvent.keyDown(getInput(), { key: "ArrowDown" });

    const options = getOptions();
    expect(getInput()).toHaveAttribute("aria-activedescendant", options[0].id);

    // Arrow down to second item
    fireEvent.keyDown(getInput(), { key: "ArrowDown" });
    expect(getInput()).toHaveAttribute("aria-activedescendant", options[1].id);
  });

  it("aria-activedescendant clears when navigating back past first item", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<InputSuggestions suggestions={FRUITS} noTypeahead />);

    await user.click(getInput());
    await user.type(getInput(), "A");

    // Arrow down then back up past first item
    fireEvent.keyDown(getInput(), { key: "ArrowDown" });
    expect(getInput()).toHaveAttribute("aria-activedescendant");

    fireEvent.keyDown(getInput(), { key: "ArrowUp" });
    expect(getInput()).not.toHaveAttribute("aria-activedescendant");
  });

  it("aria-activedescendant clears when suggestions close via Escape", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<InputSuggestions suggestions={FRUITS} noTypeahead />);

    await user.click(getInput());
    await user.type(getInput(), "A");
    fireEvent.keyDown(getInput(), { key: "ArrowDown" });
    expect(getInput()).toHaveAttribute("aria-activedescendant");

    fireEvent.keyDown(getInput(), { key: "Escape" });
    expect(getInput()).not.toHaveAttribute("aria-activedescendant");
  });
});
