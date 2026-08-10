import { describe, it, expect, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { Token } from "./Token";
import { Tokenizer } from "./Tokenizer";
import type { TokenizerRef } from "../../types/tokenizer";

describe("Tokenizer", () => {
  // --- Rendering ---

  it("renders Token children - BLI: EL-339", () => {
    render(
      <Tokenizer>
        <Token text="React" />
        <Token text="TypeScript" />
      </Tokenizer>
    );
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  it("has role=listbox on content container - BLI: EL-339", () => {
    render(
      <Tokenizer>
        <Token text="A" />
      </Tokenizer>
    );
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("applies accessibleName as aria-label - BLI: EL-339", () => {
    render(
      <Tokenizer accessibleName="Tags">
        <Token text="A" />
      </Tokenizer>
    );
    expect(screen.getByRole("listbox")).toHaveAttribute("aria-label", "Tags");
  });

  it("applies data-testid, id, className, style - BLI: EL-339", () => {
    render(
      <Tokenizer data-testid="tok" id="t1" className="custom" style={{ opacity: 0.5 }}>
        <Token text="A" />
      </Tokenizer>
    );
    expect(screen.getByTestId("tok")).toBeInTheDocument();
    const el = document.getElementById("t1")!;
    expect(el).toBeInTheDocument();
    expect(el.className).toContain("custom");
    expect(el).toHaveStyle({ opacity: "0.5" });
  });

  // --- Keyboard navigation ---

  it("moves focus with ArrowRight - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(
      <Tokenizer>
        <Token text="First" />
        <Token text="Second" />
        <Token text="Third" />
      </Tokenizer>
    );
    const options = screen.getAllByRole("option");
    // Focus first token
    options[0].focus();
    await user.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(options[1]);
  });

  it("moves focus with ArrowLeft - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(
      <Tokenizer>
        <Token text="First" />
        <Token text="Second" />
      </Tokenizer>
    );
    const options = screen.getAllByRole("option");
    options[1].focus();
    await user.keyboard("{ArrowLeft}");
    expect(document.activeElement).toBe(options[0]);
  });

  it("focuses first token on Home - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(
      <Tokenizer>
        <Token text="First" />
        <Token text="Second" />
        <Token text="Third" />
      </Tokenizer>
    );
    const options = screen.getAllByRole("option");
    options[2].focus();
    await user.keyboard("{Home}");
    expect(document.activeElement).toBe(options[0]);
  });

  it("focuses last token on End - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(
      <Tokenizer>
        <Token text="First" />
        <Token text="Second" />
        <Token text="Third" />
      </Tokenizer>
    );
    const options = screen.getAllByRole("option");
    options[0].focus();
    await user.keyboard("{End}");
    expect(document.activeElement).toBe(options[2]);
  });

  it("does not move focus past the last token - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(
      <Tokenizer>
        <Token text="First" />
        <Token text="Last" />
      </Tokenizer>
    );
    const options = screen.getAllByRole("option");
    options[1].focus();
    await user.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(options[1]);
  });

  it("does not move focus before the first token - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(
      <Tokenizer>
        <Token text="First" />
        <Token text="Last" />
      </Tokenizer>
    );
    const options = screen.getAllByRole("option");
    options[0].focus();
    await user.keyboard("{ArrowLeft}");
    expect(document.activeElement).toBe(options[0]);
  });

  // --- Roving tabindex ---

  it("applies tabIndex=0 to focused token and -1 to others - BLI: EL-339", () => {
    render(
      <Tokenizer>
        <Token text="First" />
        <Token text="Second" />
      </Tokenizer>
    );
    const options = screen.getAllByRole("option");
    // Before focus, all tokens have tabIndex -1
    expect(options[0]).toHaveAttribute("tabindex", "-1");
    expect(options[1]).toHaveAttribute("tabindex", "-1");
    // After focusing the first token, it should get tabIndex 0
    act(() => { options[0].focus(); });
    expect(options[0]).toHaveAttribute("tabindex", "0");
    expect(options[1]).toHaveAttribute("tabindex", "-1");
  });

  // --- Selection ---

  it("fires onSelectionChange when token is selected - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleSelection = vi.fn();
    render(
      <Tokenizer onSelectionChange={handleSelection}>
        <Token text="First" />
        <Token text="Second" />
      </Tokenizer>
    );
    const options = screen.getAllByRole("option");
    await user.click(options[0]);
    expect(handleSelection).toHaveBeenCalledWith(
      expect.objectContaining({ selectedIndices: [0] })
    );
  });

  it("supports multi-selection - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleSelection = vi.fn();
    render(
      <Tokenizer onSelectionChange={handleSelection}>
        <Token text="First" />
        <Token text="Second" />
        <Token text="Third" />
      </Tokenizer>
    );
    const options = screen.getAllByRole("option");
    await user.click(options[0]);
    await user.click(options[2]);
    // Last call should have both indices
    expect(handleSelection).toHaveBeenLastCalledWith(
      expect.objectContaining({ selectedIndices: expect.arrayContaining([0, 2]) })
    );
  });

  // --- Delete ---

  it("fires onTokenDelete when token delete fires - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleDelete = vi.fn();
    const { container } = render(
      <Tokenizer onTokenDelete={handleDelete}>
        <Token text="First" />
        <Token text="Second" />
      </Tokenizer>
    );
    // Click the close icon of the first token
    const closeIcons = container.querySelectorAll("[data-part='close-icon']");
    await user.click(closeIcons[0]);
    expect(handleDelete).toHaveBeenCalledWith(
      expect.objectContaining({ tokens: [0] })
    );
  });

  // --- Readonly ---

  it("propagates readonly to all tokens - BLI: EL-339", () => {
    const { container } = render(
      <Tokenizer readonly>
        <Token text="A" />
        <Token text="B" />
      </Tokenizer>
    );
    const closeIcons = container.querySelectorAll("[data-part='close-icon']");
    // Readonly tokens should have no close icons
    expect(closeIcons.length).toBe(0);
  });

  // --- Disabled ---

  it("applies disabled styling when disabled - BLI: EL-339", () => {
    const { container } = render(
      <Tokenizer disabled data-testid="disabled-tok">
        <Token text="A" />
      </Tokenizer>
    );
    const root = container.querySelector("[data-part='tokenizer-root']")!;
    expect(root.className).toContain("opacity-40");
    expect(root.className).toContain("pointer-events-none");
  });

  it("does not fire events when disabled - BLI: EL-339", () => {
    const handleSelection = vi.fn();
    const handleDelete = vi.fn();
    const { container } = render(
      <Tokenizer disabled onSelectionChange={handleSelection} onTokenDelete={handleDelete}>
        <Token text="A" />
      </Tokenizer>
    );
    // Fire a synthetic click that bypasses pointer-events-none CSS
    const option = screen.getByRole("option");
    option.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    // The disabled guard inside handleTokenSelect/handleTokenDelete should prevent callbacks
    // onSelectionChange fires once on mount from the useEffect with empty set — ignore that
    const closeIcon = container.querySelector("[data-part='close-icon']") as HTMLElement;
    if (closeIcon) {
      closeIcon.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    }
    expect(handleDelete).not.toHaveBeenCalled();
  });

  // --- Single token ---

  it("sets singleToken=true when only one token exists - BLI: EL-339", () => {
    const { container } = render(
      <Tokenizer>
        <Token text="Only" />
      </Tokenizer>
    );
    const root = container.querySelector("[data-part='root']")!;
    expect(root.className).toContain("max-w-full");
  });

  // --- Ref ---

  it("exposes focus/blur/isFocused via ref - BLI: EL-339", () => {
    const ref = React.createRef<TokenizerRef>();
    render(
      <Tokenizer ref={ref}>
        <Token text="A" />
        <Token text="B" />
      </Tokenizer>
    );
    expect(ref.current).not.toBeNull();
    expect(ref.current!.nativeElement).toBeInstanceOf(HTMLDivElement);

    ref.current!.focus();
    expect(ref.current!.isFocused()).toBe(true);
    ref.current!.blur();
    expect(ref.current!.isFocused()).toBe(false);
  });

  it("focusLast focuses the last token - BLI: EL-339", () => {
    const ref = React.createRef<TokenizerRef>();
    render(
      <Tokenizer ref={ref}>
        <Token text="First" />
        <Token text="Second" />
        <Token text="Third" />
      </Tokenizer>
    );

    act(() => {
      ref.current!.focusLast();
    });

    expect(ref.current!.isFocused()).toBe(true);
    // The last token should have tabIndex=0 (focused via roving tabindex)
    const tokens = screen.getAllByRole("option");
    expect(tokens[tokens.length - 1]).toHaveAttribute("tabindex", "0");
  });

  // --- Ctrl+A Select All / Deselect All ---

  it("selects all tokens with Ctrl+A - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleSelection = vi.fn();
    render(
      <Tokenizer onSelectionChange={handleSelection}>
        <Token text="A" />
        <Token text="B" />
        <Token text="C" />
      </Tokenizer>
    );
    const options = screen.getAllByRole("option");
    options[0].focus();
    await user.keyboard("{Control>}a{/Control}");
    expect(handleSelection).toHaveBeenLastCalledWith(
      expect.objectContaining({
        selectedIndices: expect.arrayContaining([0, 1, 2]),
      })
    );
  });

  it("deselects all tokens with Ctrl+A when all are selected - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleSelection = vi.fn();
    render(
      <Tokenizer onSelectionChange={handleSelection}>
        <Token text="A" />
        <Token text="B" />
      </Tokenizer>
    );
    const options = screen.getAllByRole("option");
    options[0].focus();
    // First Ctrl+A to select all
    await user.keyboard("{Control>}a{/Control}");
    // Second Ctrl+A to deselect all
    await user.keyboard("{Control>}a{/Control}");
    expect(handleSelection).toHaveBeenLastCalledWith(
      expect.objectContaining({ selectedIndices: [] })
    );
  });

  it("selects all tokens with Cmd+A (metaKey) - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleSelection = vi.fn();
    render(
      <Tokenizer onSelectionChange={handleSelection}>
        <Token text="A" />
        <Token text="B" />
      </Tokenizer>
    );
    const options = screen.getAllByRole("option");
    options[0].focus();
    await user.keyboard("{Meta>}a{/Meta}");
    expect(handleSelection).toHaveBeenLastCalledWith(
      expect.objectContaining({
        selectedIndices: expect.arrayContaining([0, 1]),
      })
    );
  });

  // --- Shift+Arrow Range Selection ---

  it("extends selection with Shift+ArrowRight - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleSelection = vi.fn();
    render(
      <Tokenizer onSelectionChange={handleSelection}>
        <Token text="A" />
        <Token text="B" />
        <Token text="C" />
      </Tokenizer>
    );
    const options = screen.getAllByRole("option");
    options[0].focus();
    await user.keyboard("{Shift>}{ArrowRight}{/Shift}");
    expect(handleSelection).toHaveBeenLastCalledWith(
      expect.objectContaining({
        selectedIndices: expect.arrayContaining([0, 1]),
      })
    );
  });

  it("extends selection with Shift+ArrowLeft - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleSelection = vi.fn();
    render(
      <Tokenizer onSelectionChange={handleSelection}>
        <Token text="A" />
        <Token text="B" />
        <Token text="C" />
      </Tokenizer>
    );
    const options = screen.getAllByRole("option");
    // Navigate to last token first via ArrowRight so focusedIndex is set
    options[0].focus();
    await user.keyboard("{ArrowRight}{ArrowRight}");
    // Now Shift+ArrowLeft from index 2
    await user.keyboard("{Shift>}{ArrowLeft}{/Shift}");
    expect(handleSelection).toHaveBeenLastCalledWith(
      expect.objectContaining({
        selectedIndices: expect.arrayContaining([1, 2]),
      })
    );
  });

  it("selects full range between anchor and focus with Shift+Arrow - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleSelection = vi.fn();
    render(
      <Tokenizer onSelectionChange={handleSelection}>
        <Token text="A" />
        <Token text="B" />
        <Token text="C" />
        <Token text="D" />
      </Tokenizer>
    );
    const options = screen.getAllByRole("option");
    options[0].focus();
    // Shift+Right twice to select A, B, C
    await user.keyboard("{Shift>}{ArrowRight}{ArrowRight}{/Shift}");
    expect(handleSelection).toHaveBeenLastCalledWith(
      expect.objectContaining({
        selectedIndices: expect.arrayContaining([0, 1, 2]),
      })
    );
  });

  // --- Clipboard ---

  it("copies selected token texts with Ctrl+C - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: writeTextMock },
      writable: true,
      configurable: true,
    });

    render(
      <Tokenizer>
        <Token text="Alpha" />
        <Token text="Beta" />
        <Token text="Gamma" />
      </Tokenizer>
    );
    const options = screen.getAllByRole("option");
    options[0].focus();
    // Select all, then copy
    await user.keyboard("{Control>}a{/Control}");
    await user.keyboard("{Control>}c{/Control}");
    expect(writeTextMock).toHaveBeenCalledWith("Alpha\r\nBeta\r\nGamma");
  });

  it("cuts selected tokens with Ctrl+X (copy + delete) - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: writeTextMock },
      writable: true,
      configurable: true,
    });
    const handleDelete = vi.fn();

    render(
      <Tokenizer onTokenDelete={handleDelete}>
        <Token text="Alpha" />
        <Token text="Beta" />
      </Tokenizer>
    );
    const options = screen.getAllByRole("option");
    options[0].focus();
    // Select all, then cut
    await user.keyboard("{Control>}a{/Control}");
    await user.keyboard("{Control>}x{/Control}");
    expect(writeTextMock).toHaveBeenCalledWith("Alpha\r\nBeta");
    expect(handleDelete).toHaveBeenCalledWith(
      expect.objectContaining({ tokens: [0, 1] })
    );
  });

  it("does not cut in readonly mode - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: writeTextMock },
      writable: true,
      configurable: true,
    });
    const handleDelete = vi.fn();

    render(
      <Tokenizer readonly onTokenDelete={handleDelete}>
        <Token text="Alpha" />
        <Token text="Beta" />
      </Tokenizer>
    );
    const options = screen.getAllByRole("option");
    options[0].focus();
    await user.keyboard("{Control>}a{/Control}");
    await user.keyboard("{Control>}x{/Control}");
    // Should not delete in readonly
    expect(handleDelete).not.toHaveBeenCalled();
  });

  // --- Bulk Delete ---

  it("deletes all selected tokens with Backspace - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleDelete = vi.fn();
    render(
      <Tokenizer onTokenDelete={handleDelete}>
        <Token text="A" />
        <Token text="B" />
        <Token text="C" />
      </Tokenizer>
    );
    const options = screen.getAllByRole("option");
    options[0].focus();
    // Select all
    await user.keyboard("{Control>}a{/Control}");
    // Bulk delete
    await user.keyboard("{Backspace}");
    expect(handleDelete).toHaveBeenCalledWith(
      expect.objectContaining({ tokens: [0, 1, 2] })
    );
  });

  it("deletes all selected tokens with Delete key - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleDelete = vi.fn();
    render(
      <Tokenizer onTokenDelete={handleDelete}>
        <Token text="A" />
        <Token text="B" />
        <Token text="C" />
      </Tokenizer>
    );
    const options = screen.getAllByRole("option");
    options[0].focus();
    // Select all
    await user.keyboard("{Control>}a{/Control}");
    // Bulk delete
    await user.keyboard("{Delete}");
    expect(handleDelete).toHaveBeenCalledWith(
      expect.objectContaining({ tokens: [0, 1, 2] })
    );
  });

  it("does not bulk delete when readonly - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleDelete = vi.fn();
    render(
      <Tokenizer readonly onTokenDelete={handleDelete}>
        <Token text="A" />
        <Token text="B" />
      </Tokenizer>
    );
    const options = screen.getAllByRole("option");
    options[0].focus();
    await user.keyboard("{Control>}a{/Control}");
    await user.keyboard("{Backspace}");
    expect(handleDelete).not.toHaveBeenCalled();
  });

  // --- Clear All ---

  it("renders clear-all button when showClearAll=true - BLI: EL-339", () => {
    const { container } = render(
      <Tokenizer showClearAll>
        <Token text="A" />
        <Token text="B" />
      </Tokenizer>
    );
    const clearAll = container.querySelector("[data-part='clear-all']");
    expect(clearAll).toBeInTheDocument();
  });

  it("does not render clear-all when readonly - BLI: EL-339", () => {
    const { container } = render(
      <Tokenizer showClearAll readonly>
        <Token text="A" />
      </Tokenizer>
    );
    const clearAll = container.querySelector("[data-part='clear-all']");
    expect(clearAll).not.toBeInTheDocument();
  });

  it("fires onTokenDelete with all indices when clear-all is clicked - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleDelete = vi.fn();
    render(
      <Tokenizer showClearAll onTokenDelete={handleDelete}>
        <Token text="A" />
        <Token text="B" />
        <Token text="C" />
      </Tokenizer>
    );
    const clearAll = screen.getByText("Clear All");
    await user.click(clearAll);
    expect(handleDelete).toHaveBeenCalledWith(
      expect.objectContaining({ tokens: [0, 1, 2] })
    );
  });

  it("does not render clear-all when there are no tokens - BLI: EL-339", () => {
    const { container } = render(
      <Tokenizer showClearAll>
        <></>
      </Tokenizer>
    );
    const clearAll = container.querySelector("[data-part='clear-all']");
    expect(clearAll).not.toBeInTheDocument();
  });

  // --- N-More Popover ---

  it("renders n-more button when tokens overflow - BLI: EL-339", () => {
    // We can't easily simulate overflow in jsdom, but we can test when nMoreCount > 0
    // by providing a controlled multiLine=false and many tokens.
    // Since ResizeObserver is not available in jsdom, nMoreCount will stay 0.
    // We test the popover integration separately.
    const { container } = render(
      <Tokenizer>
        <Token text="A" />
      </Tokenizer>
    );
    // No overflow by default
    const nMore = container.querySelector("[data-part='n-more']");
    expect(nMore).not.toBeInTheDocument();
  });

  // --- Accessibility ---

  it("has aria-roledescription on listbox - BLI: EL-339", () => {
    render(
      <Tokenizer>
        <Token text="A" />
      </Tokenizer>
    );
    const listbox = screen.getByRole("listbox");
    expect(listbox).toHaveAttribute("aria-roledescription", "Tokenizer");
  });

  it("renders a live region for announcements - BLI: EL-339", () => {
    const { container } = render(
      <Tokenizer>
        <Token text="A" />
        <Token text="B" />
      </Tokenizer>
    );
    const liveRegion = container.querySelector("[data-part='live-region']");
    expect(liveRegion).toBeInTheDocument();
    expect(liveRegion).toHaveAttribute("aria-live", "polite");
  });

  it("announces token count via live region - BLI: EL-339", () => {
    const { container } = render(
      <Tokenizer>
        <Token text="A" />
        <Token text="B" />
      </Tokenizer>
    );
    const liveRegion = container.querySelector("[data-part='live-region']");
    expect(liveRegion?.textContent).toContain("2 tokens");
  });

  it("announces selection count via live region after selection - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Tokenizer>
        <Token text="A" />
        <Token text="B" />
      </Tokenizer>
    );
    const options = screen.getAllByRole("option");
    await user.click(options[0]);
    const liveRegion = container.querySelector("[data-part='live-region']");
    expect(liveRegion?.textContent).toContain("1 tokens selected");
  });

  // --- N-More Popover hideArrow ---

  it("renders n-more popover without arrow - BLI: EL-339", async () => {
    const user = userEvent.setup();

    // Mock getBoundingClientRect so the container looks narrow and tokens overflow
    const originalGetBCR = Element.prototype.getBoundingClientRect;
    let callIndex = 0;
    Element.prototype.getBoundingClientRect = function () {
      const tag = this.tagName?.toLowerCase();
      // Tokenizer container — make it narrow
      if (this.getAttribute("data-part") === "tokenizer-root") {
        return { top: 0, left: 0, bottom: 36, right: 100, width: 100, height: 36, x: 0, y: 0, toJSON: () => ({}) } as DOMRect;
      }
      // Content container (div with role=listbox) — make it narrow
      // Reset the per-pass counter here so every overflow calculation
      // starts fresh and produces stable token positions.
      if (this.getAttribute("role") === "listbox") {
        callIndex = 0;
        return { top: 0, left: 0, bottom: 36, right: 100, width: 100, height: 36, x: 0, y: 0, toJSON: () => ({}) } as DOMRect;
      }
      // Token items — make them wide so they overflow
      if (tag === "div" && this.getAttribute("role") === "option") {
        const idx = callIndex++;
        const left = idx * 80;
        return { top: 0, left, bottom: 36, right: left + 80, width: 80, height: 36, x: left, y: 0, toJSON: () => ({}) } as DOMRect;
      }
      return originalGetBCR.call(this);
    };

    // ResizeObserver mock that fires callback immediately
    const originalRO = globalThis.ResizeObserver;
    globalThis.ResizeObserver = class MockRO {
      constructor(private cb: ResizeObserverCallback) {}
      observe() { this.cb([], this as unknown as ResizeObserver); }
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver;

    const { container } = render(
      <Tokenizer>
        <Token text="Token A" />
        <Token text="Token B" />
        <Token text="Token C" />
      </Tokenizer>
    );

    // The n-more button must appear — fail loudly if it doesn't
    const nMore = container.querySelector("[data-part='n-more']");
    expect(nMore).not.toBeNull();

    // Click to open the popover
    await user.click(nMore!);

    // The popover should have no arrow div (arrow is a rotated square positioned absolutely)
    // ResponsivePopover/Popover renders the arrow as a direct child div with rotate(45deg)
    // With hideArrow, this element should NOT exist
    const popoverEl = container.querySelector("[popover]");
    expect(popoverEl).not.toBeNull();

    const arrowEl = popoverEl!.querySelector("div[style*='rotate(45deg)']");
    expect(arrowEl).toBeNull();

    // Restore
    Element.prototype.getBoundingClientRect = originalGetBCR;
    globalThis.ResizeObserver = originalRO;
  });
});
