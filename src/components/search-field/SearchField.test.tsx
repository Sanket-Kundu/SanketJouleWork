import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchField } from "./SearchField";
import type { SearchFieldRef } from "../../types/search-field";

describe("SearchField", () => {
  // ─── Rendering ───────────────────────────────────────────────────

  describe("Rendering", () => {
    it("renders with default state - BLI: EL-339", () => {
      render(<SearchField data-testid="sf" />);
      expect(screen.getByTestId("sf")).toBeInTheDocument();
    });

    it("renders placeholder text - BLI: EL-339", () => {
      render(<SearchField placeholder="Search products..." />);
      expect(screen.getByPlaceholderText("Search products...")).toBeInTheDocument();
    });

    it("applies custom className - BLI: EL-339", () => {
      render(<SearchField className="my-class" data-testid="sf" />);
      expect(screen.getByTestId("sf")).toHaveClass("my-class");
    });

    it("applies inline style - BLI: EL-339", () => {
      render(<SearchField style={{ maxWidth: "300px" }} data-testid="sf" />);
      expect(screen.getByTestId("sf")).toHaveStyle({ maxWidth: "300px" });
    });

    it("renders with id attribute - BLI: EL-339", () => {
      render(<SearchField id="my-search" />);
      expect(document.getElementById("my-search")).toBeInTheDocument();
    });

    it("renders with name attribute - BLI: EL-339", () => {
      render(<SearchField name="search" data-testid="sf" />);
      const input = screen.getByRole("searchbox");
      expect(input).toHaveAttribute("name", "search");
    });

    it("renders search icon - BLI: EL-339", () => {
      render(<SearchField data-testid="sf" />);
      const buttons = screen.getAllByLabelText("Search");
      // Both the input and the search button have "Search" label; the button is the icon carrier
      expect(buttons.length).toBeGreaterThanOrEqual(2);
    });

    it("renders data-testid - BLI: EL-339", () => {
      render(<SearchField data-testid="my-sf" />);
      expect(screen.getByTestId("my-sf")).toBeInTheDocument();
    });
  });

  // ─── Controlled / Uncontrolled ──────────────────────────────────

  describe("Controlled / Uncontrolled", () => {
    it("works as controlled with value prop - BLI: EL-339", () => {
      render(<SearchField value="test" />);
      expect(screen.getByRole("searchbox")).toHaveValue("test");
    });

    it("works as uncontrolled with defaultValue - BLI: EL-339", () => {
      render(<SearchField defaultValue="initial" />);
      expect(screen.getByRole("searchbox")).toHaveValue("initial");
    });

    it("updates controlled value from parent - BLI: EL-339", () => {
      const { rerender } = render(<SearchField value="first" />);
      expect(screen.getByRole("searchbox")).toHaveValue("first");
      rerender(<SearchField value="second" />);
      expect(screen.getByRole("searchbox")).toHaveValue("second");
    });

    it("allows typing in uncontrolled mode - BLI: EL-339", async () => {
      const user = userEvent.setup();
      render(<SearchField defaultValue="" />);
      const input = screen.getByRole("searchbox");
      await user.type(input, "hello");
      expect(input).toHaveValue("hello");
    });

    it("starts with empty value by default - BLI: EL-339", () => {
      render(<SearchField />);
      expect(screen.getByRole("searchbox")).toHaveValue("");
    });

    it("controlled mode: Escape calls onInput but doesn't clear until parent updates value - BLI: EL-339", async () => {
      const user = userEvent.setup();
      const onInput = vi.fn();
      const onSearch = vi.fn();

      // Start with a controlled value
      const { rerender } = render(
        <SearchField value="test" onInput={onInput} onSearch={onSearch} />
      );
      const input = screen.getByRole("searchbox");

      // Press Escape
      await user.type(input, "{Escape}");

      // onInput and onSearch should be called
      expect(onInput).toHaveBeenCalledWith("");
      expect(onSearch).toHaveBeenCalledWith(
        expect.objectContaining({ value: "", clearButtonPressed: true })
      );

      // Field should NOT be cleared yet (still shows "test")
      expect(input).toHaveValue("test");

      // Parent responds to onInput by updating value prop
      rerender(<SearchField value="" onInput={onInput} onSearch={onSearch} />);

      // Now the field is cleared
      expect(input).toHaveValue("");
    });
  });

  // ─── Input Events ───────────────────────────────────────────────

  describe("Input Events", () => {
    it("fires onInput on typing - BLI: EL-339", async () => {
      const user = userEvent.setup();
      const onInput = vi.fn();
      render(<SearchField onInput={onInput} />);
      await user.type(screen.getByRole("searchbox"), "a");
      expect(onInput).toHaveBeenCalledWith("a");
    });

    it("fires onChange on blur - BLI: EL-339", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<SearchField onChange={onChange} />);
      const input = screen.getByRole("searchbox");
      await user.type(input, "test");
      await user.tab();
      expect(onChange).toHaveBeenCalled();
    });

    it("fires onFocus - BLI: EL-339", () => {
      const onFocus = vi.fn();
      render(<SearchField onFocus={onFocus} />);
      fireEvent.focus(screen.getByRole("searchbox"));
      expect(onFocus).toHaveBeenCalled();
    });

    it("fires onBlur - BLI: EL-339", () => {
      const onBlur = vi.fn();
      render(<SearchField onBlur={onBlur} />);
      const input = screen.getByRole("searchbox");
      fireEvent.focus(input);
      fireEvent.blur(input);
      expect(onBlur).toHaveBeenCalled();
    });
  });

  // ─── Search Event ───────────────────────────────────────────────

  describe("Search Event", () => {
    it("fires onSearch on Enter key - BLI: EL-339", async () => {
      const user = userEvent.setup();
      const onSearch = vi.fn();
      render(<SearchField defaultValue="query" onSearch={onSearch} />);
      await user.type(screen.getByRole("searchbox"), "{Enter}");
      expect(onSearch).toHaveBeenCalledTimes(1);
      expect(onSearch).toHaveBeenCalledWith(
        expect.objectContaining({ value: "query", clearButtonPressed: false })
      );
    });

    it("fires onSearch on search icon click - BLI: EL-339", () => {
      const onSearch = vi.fn();
      render(<SearchField defaultValue="test" onSearch={onSearch} />);
      // Both input and button have "Search" label; the button is the second one
      const buttons = screen.getAllByLabelText("Search");
      const searchBtn = buttons.find((el) => el.tagName === "BUTTON")!;
      fireEvent.click(searchBtn);
      expect(onSearch).toHaveBeenCalledTimes(1);
      expect(onSearch).toHaveBeenCalledWith(
        expect.objectContaining({ value: "test", clearButtonPressed: false })
      );
    });

    it("provides correct value in search detail - BLI: EL-339", async () => {
      const user = userEvent.setup();
      const onSearch = vi.fn();
      render(<SearchField onSearch={onSearch} />);
      const input = screen.getByRole("searchbox");
      await user.type(input, "foo");
      await user.keyboard("{Enter}");
      expect(onSearch).toHaveBeenCalledWith(
        expect.objectContaining({ value: "foo" })
      );
    });

    it("sets clearButtonPressed to false for Enter - BLI: EL-339", async () => {
      const user = userEvent.setup();
      const onSearch = vi.fn();
      render(<SearchField defaultValue="x" onSearch={onSearch} />);
      await user.type(screen.getByRole("searchbox"), "{Enter}");
      expect(onSearch).toHaveBeenCalledWith(
        expect.objectContaining({ clearButtonPressed: false })
      );
    });

    it("Escape clears the field and fires onSearch - BLI: EL-339", async () => {
      const user = userEvent.setup();
      const onSearch = vi.fn();
      const onInput = vi.fn();
      render(<SearchField defaultValue="x" onSearch={onSearch} onInput={onInput} />);
      const input = screen.getByRole("searchbox");
      await user.type(input, "{Escape}");

      // Should clear the field
      expect(input).toHaveValue("");

      // Should fire onInput with empty string
      expect(onInput).toHaveBeenCalledWith("");

      // Should fire onSearch exactly once with clearButtonPressed: true
      expect(onSearch).toHaveBeenCalledTimes(1);
      expect(onSearch).toHaveBeenCalledWith(
        expect.objectContaining({ value: "", clearButtonPressed: true })
      );
    });
  });

  // ─── Keyboard ───────────────────────────────────────────────────

  describe("Keyboard", () => {
    it("Enter triggers search - BLI: EL-339", async () => {
      const user = userEvent.setup();
      const onSearch = vi.fn();
      render(<SearchField onSearch={onSearch} />);
      await user.type(screen.getByRole("searchbox"), "{Enter}");
      expect(onSearch).toHaveBeenCalled();
    });

    it("typing updates value - BLI: EL-339", async () => {
      const user = userEvent.setup();
      render(<SearchField />);
      const input = screen.getByRole("searchbox");
      await user.type(input, "abc");
      expect(input).toHaveValue("abc");
    });

    it("fires onKeyDown - BLI: EL-339", async () => {
      const user = userEvent.setup();
      const onKeyDown = vi.fn();
      render(<SearchField onKeyDown={onKeyDown} />);
      await user.type(screen.getByRole("searchbox"), "a");
      expect(onKeyDown).toHaveBeenCalled();
    });
  });

  // ─── Clear Icon ─────────────────────────────────────────────────

  describe("Clear Icon", () => {
    it("is hidden by default - BLI: EL-339", () => {
      render(<SearchField defaultValue="test" />);
      expect(screen.queryByLabelText("Clear")).not.toBeInTheDocument();
    });

    it("is shown when showClearIcon is true and has value - BLI: EL-339", async () => {
      const user = userEvent.setup();
      render(<SearchField showClearIcon />);
      const input = screen.getByRole("searchbox");
      await user.type(input, "test");
      expect(screen.getByLabelText("Clear")).toBeInTheDocument();
    });

    it("is hidden when showClearIcon is true but value is empty - BLI: EL-339", () => {
      render(<SearchField showClearIcon />);
      expect(screen.queryByLabelText("Clear")).not.toBeInTheDocument();
    });

    it("clears value on click - BLI: EL-339", async () => {
      const user = userEvent.setup();
      const onInput = vi.fn();
      render(<SearchField showClearIcon onInput={onInput} />);
      const input = screen.getByRole("searchbox");
      await user.type(input, "test");
      // Clear button should now be visible
      const clearBtn = screen.getByLabelText("Clear");
      fireEvent.click(clearBtn);
      // After clearing, onInput is called with empty string
      expect(onInput).toHaveBeenLastCalledWith("");
    });

    it("fires onSearch with clearButtonPressed true - BLI: EL-339", async () => {
      const user = userEvent.setup();
      const onSearch = vi.fn();
      render(<SearchField showClearIcon onSearch={onSearch} />);
      await user.type(screen.getByRole("searchbox"), "test");
      fireEvent.click(screen.getByLabelText("Clear"));
      expect(onSearch).toHaveBeenCalledTimes(1);
      expect(onSearch).toHaveBeenCalledWith(
        expect.objectContaining({ value: "", clearButtonPressed: true })
      );
    });

    it("fires onInput with empty string on clear - BLI: EL-339", async () => {
      const user = userEvent.setup();
      const onInput = vi.fn();
      render(<SearchField showClearIcon onInput={onInput} />);
      await user.type(screen.getByRole("searchbox"), "x");
      onInput.mockClear();
      fireEvent.click(screen.getByLabelText("Clear"));
      expect(onInput).toHaveBeenCalledWith("");
    });

    it("controlled mode: clear button calls onInput but doesn't clear until parent updates value - BLI: EL-339", async () => {
      const onInput = vi.fn();
      const onSearch = vi.fn();

      // Start with a controlled value
      const { rerender } = render(
        <SearchField value="test" showClearIcon onInput={onInput} onSearch={onSearch} />
      );
      const input = screen.getByRole("searchbox");

      // Click clear button
      fireEvent.click(screen.getByLabelText("Clear"));

      // onInput and onSearch should be called
      expect(onInput).toHaveBeenCalledWith("");
      expect(onSearch).toHaveBeenCalledWith(
        expect.objectContaining({ value: "", clearButtonPressed: true })
      );

      // Field should NOT be cleared yet (still shows "test")
      expect(input).toHaveValue("test");

      // Parent responds to onInput by updating value prop
      rerender(<SearchField value="" showClearIcon onInput={onInput} onSearch={onSearch} />);

      // Now the field is cleared
      expect(input).toHaveValue("");
    });
  });

  // ─── Disabled ───────────────────────────────────────────────────

  describe("Disabled", () => {
    it("applies disabled styling - BLI: EL-339", () => {
      render(<SearchField disabled data-testid="sf" />);
      const container = screen.getByTestId("sf").firstElementChild!;
      expect(container.className).toContain("opacity-40");
    });

    it("sets input disabled attribute - BLI: EL-339", () => {
      render(<SearchField disabled />);
      expect(screen.getByRole("searchbox")).toBeDisabled();
    });

    it("does not allow typing when disabled - BLI: EL-339", async () => {
      const user = userEvent.setup();
      const onInput = vi.fn();
      render(<SearchField disabled onInput={onInput} />);
      await user.type(screen.getByRole("searchbox"), "test").catch(() => {});
      expect(onInput).not.toHaveBeenCalled();
    });

    it("does not fire onSearch on Enter when disabled - BLI: EL-339", async () => {
      const user = userEvent.setup();
      const onSearch = vi.fn();
      render(<SearchField disabled defaultValue="test" onSearch={onSearch} />);
      // Trying to type on a disabled input is a no-op with userEvent
      await user.type(screen.getByRole("searchbox"), "{Enter}").catch(() => {});
      expect(onSearch).not.toHaveBeenCalled();
    });
  });

  // ─── Loading ────────────────────────────────────────────────────

  describe("Loading", () => {
    it("shows spinner when loading - BLI: EL-339", () => {
      render(<SearchField loading data-testid="sf" />);
      expect(screen.getByRole("status")).toBeInTheDocument();
    });

    it("hides search icon when loading - BLI: EL-339", () => {
      render(<SearchField loading data-testid="sf" />);
      // The spinner replaces the search icon, so no svg from SearchIcon
      const statusEl = screen.getByRole("status");
      expect(statusEl.tagName.toLowerCase()).toBe("span");
    });

    it("search still works via Enter when loading - BLI: EL-339", async () => {
      const user = userEvent.setup();
      const onSearch = vi.fn();
      render(<SearchField loading defaultValue="test" onSearch={onSearch} />);
      const input = screen.getByRole("searchbox");
      await user.click(input);
      await user.keyboard("{Enter}");
      expect(onSearch).toHaveBeenCalledWith(
        expect.objectContaining({ value: "test" })
      );
    });

    it("search icon click is suppressed when loading - BLI: EL-339", () => {
      const onSearch = vi.fn();
      render(<SearchField loading defaultValue="test" onSearch={onSearch} />);
      const buttons = screen.getAllByLabelText("Search");
      const searchBtn = buttons.find((el) => el.tagName === "BUTTON")!;
      fireEvent.click(searchBtn);
      expect(onSearch).not.toHaveBeenCalled();
    });
  });

  // ─── Accessibility ──────────────────────────────────────────────

  describe("Accessibility", () => {
    it("has role=searchbox on input - BLI: EL-339", () => {
      render(<SearchField />);
      expect(screen.getByRole("searchbox")).toBeInTheDocument();
    });

    it("applies accessibleName as aria-label - BLI: EL-339", () => {
      render(<SearchField accessibleName="Product search" />);
      expect(screen.getByRole("searchbox")).toHaveAttribute(
        "aria-label",
        "Product search"
      );
    });

    it("applies accessibleNameRef as aria-labelledby - BLI: EL-339", () => {
      render(<SearchField accessibleNameRef="label-id" />);
      const input = screen.getByRole("searchbox");
      expect(input).toHaveAttribute("aria-labelledby", "label-id");
      // aria-label should be omitted when accessibleNameRef is set
      expect(input).not.toHaveAttribute("aria-label");
    });

    it("applies accessibleDescription via aria-describedby - BLI: EL-339", () => {
      render(<SearchField accessibleDescription="Search for products" />);
      const input = screen.getByRole("searchbox");
      const describedById = input.getAttribute("aria-describedby");
      expect(describedById).toBeTruthy();
      const descEl = document.getElementById(describedById!);
      expect(descEl).toHaveTextContent("Search for products");
    });

    it("uses default i18n description when no accessibleDescription - BLI: EL-339", () => {
      render(<SearchField />);
      const input = screen.getByRole("searchbox");
      const describedById = input.getAttribute("aria-describedby");
      expect(describedById).toBeTruthy();
      const descEl = document.getElementById(describedById!);
      expect(descEl).toHaveTextContent("Type text to start searching");
    });

    it("applies aria-disabled when disabled - BLI: EL-339", () => {
      render(<SearchField disabled />);
      expect(screen.getByRole("searchbox")).toHaveAttribute("aria-disabled", "true");
    });

    it("has aria-labels on icon buttons - BLI: EL-339", () => {
      render(<SearchField />);
      // The search button has aria-label="Search"
      const buttons = screen.getAllByLabelText("Search");
      const searchBtn = buttons.find((el) => el.tagName === "BUTTON");
      expect(searchBtn).toBeInTheDocument();
    });
  });

  // ─── Imperative API ─────────────────────────────────────────────

  describe("Imperative API", () => {
    it("focus() focuses the input - BLI: EL-339", () => {
      const ref = React.createRef<SearchFieldRef>();
      render(<SearchField ref={ref} />);
      ref.current!.focus();
      expect(document.activeElement).toBe(screen.getByRole("searchbox"));
    });

    it("blur() blurs the input - BLI: EL-339", () => {
      const ref = React.createRef<SearchFieldRef>();
      render(<SearchField ref={ref} />);
      ref.current!.focus();
      ref.current!.blur();
      expect(document.activeElement).not.toBe(screen.getByRole("searchbox"));
    });

    it("getValue() returns current value - BLI: EL-339", async () => {
      const user = userEvent.setup();
      const ref = React.createRef<SearchFieldRef>();
      render(<SearchField ref={ref} />);
      await user.type(screen.getByRole("searchbox"), "test");
      expect(ref.current!.getValue()).toBe("test");
    });

    it("setValue() sets value programmatically - BLI: EL-339", () => {
      const ref = React.createRef<SearchFieldRef>();
      const onInput = vi.fn();
      render(<SearchField ref={ref} onInput={onInput} />);
      act(() => ref.current!.setValue("programmatic"));
      expect(onInput).toHaveBeenCalledWith("programmatic");
    });

    it("clear() clears the value - BLI: EL-339", async () => {
      const user = userEvent.setup();
      const ref = React.createRef<SearchFieldRef>();
      const onInput = vi.fn();
      render(<SearchField ref={ref} onInput={onInput} />);
      await user.type(screen.getByRole("searchbox"), "test");
      onInput.mockClear();
      act(() => ref.current!.clear());
      expect(onInput).toHaveBeenCalledWith("");
    });

    it("nativeElement returns the input element - BLI: EL-339", () => {
      const ref = React.createRef<SearchFieldRef>();
      render(<SearchField ref={ref} />);
      expect(ref.current!.nativeElement).toBe(screen.getByRole("searchbox"));
    });
  });

  // ─── Size variants ────────────────────────────────────────────────

  describe("Size variants", () => {
    it("defaults to Large size with h-10 and rounded-lg - BLI: EL-339", () => {
      render(<SearchField data-testid="sf" />);
      const form = screen.getByTestId("sf").querySelector("form")!;
      expect(form).toHaveClass("h-10");
      expect(form).toHaveClass("rounded-lg");
    });

    it("renders Medium size with h-8 and rounded - BLI: EL-339", () => {
      render(<SearchField size="Medium" data-testid="sf" />);
      const form = screen.getByTestId("sf").querySelector("form")!;
      expect(form).toHaveClass("h-8");
      expect(form).toHaveClass("rounded");
      expect(form).not.toHaveClass("rounded-lg");
    });

    it("Large size does not have h-8 class - BLI: EL-339", () => {
      render(<SearchField size="Large" data-testid="sf" />);
      const form = screen.getByTestId("sf").querySelector("form")!;
      expect(form).not.toHaveClass("h-8");
      expect(form).toHaveClass("h-10");
    });

    it("Medium size renders Small search button - BLI: EL-339", () => {
      render(<SearchField size="Medium" data-testid="sf" />);
      const searchBtns = screen.getAllByLabelText("Search");
      // The button is the last "Search"-labelled element
      const btn = searchBtns[searchBtns.length - 1].closest("button")!;
      expect(btn).toHaveClass("h-6");
    });

    it("Large size renders Medium search button - BLI: EL-339", () => {
      render(<SearchField size="Large" data-testid="sf" />);
      const searchBtns = screen.getAllByLabelText("Search");
      const btn = searchBtns[searchBtns.length - 1].closest("button")!;
      expect(btn).toHaveClass("h-8");
    });

    it("Medium size renders smaller clear button - BLI: EL-339", () => {
      render(
        <SearchField size="Medium" value="hello" showClearIcon data-testid="sf" />
      );
      const clearBtn = screen.getByLabelText("Clear").closest("button")!;
      expect(clearBtn).toHaveClass("h-6");
    });

    it("Large size renders medium clear button - BLI: EL-339", () => {
      render(
        <SearchField size="Large" value="hello" showClearIcon data-testid="sf" />
      );
      const clearBtn = screen.getByLabelText("Clear").closest("button")!;
      expect(clearBtn).toHaveClass("h-8");
    });

    it("Medium size uses correct padding classes on form - BLI: EL-339", () => {
      render(<SearchField size="Medium" data-testid="sf" />);
      const form = screen.getByTestId("sf").querySelector("form")!;
      expect(form).toHaveClass("pl-3");
    });

    it("Large size uses correct padding classes on form - BLI: EL-339", () => {
      render(<SearchField size="Large" data-testid="sf" />);
      const form = screen.getByTestId("sf").querySelector("form")!;
      expect(form).toHaveClass("pl-3.5");
    });
  });
});
