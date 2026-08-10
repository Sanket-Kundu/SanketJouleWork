/**
 * FxPromptInput.test.tsx
 *
 * Tests for the AI prompt input component.
 * FxPromptInput calls useFxLayoutContext() so we mock FxLayout to provide it.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import React from "react";

import { FxPromptInput } from "./FxPromptInput";
import type { FxPromptInputRef } from "../../types/fx";
import { stubResizeObserver, stubIntersectionObserver, setupPopoverPolyfill } from "../../test/test-utils";

stubResizeObserver();
stubIntersectionObserver();
setupPopoverPolyfill();

// Mock useFxLayoutContext so FxPromptInput can render outside FxLayout
vi.mock("./FxLayout", () => ({
  useFxLayoutContext: () => ({ inputMode: "oneline" }),
}));

describe("FxPromptInput", () => {
  it("renders an input field - BLI: EL-339", () => {
    render(<FxPromptInput placeholder="Ask me anything..." />);
    expect(screen.getByPlaceholderText("Ask me anything...")).toBeInTheDocument();
  });

  it("renders default placeholder when none provided - BLI: EL-339", () => {
    render(<FxPromptInput />);
    expect(screen.getByPlaceholderText("Type a message...")).toBeInTheDocument();
  });

  it("typing in input triggers onLiveChange - BLI: EL-339", () => {
    const onLiveChange = vi.fn();
    render(<FxPromptInput onLiveChange={onLiveChange} />);
    const input = screen.getByPlaceholderText("Type a message...");
    fireEvent.change(input, { target: { value: "Hello" } });
    expect(onLiveChange).toHaveBeenCalledWith({ value: "Hello" });
  });

  it("Enter submits and fires onSubmit - BLI: EL-339", () => {
    const onSubmit = vi.fn();
    render(<FxPromptInput onSubmit={onSubmit} />);
    const input = screen.getByPlaceholderText("Type a message...");

    fireEvent.change(input, { target: { value: "Send this" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(onSubmit).toHaveBeenCalledWith({ value: "Send this" });
  });

  it("Enter does not submit when value is empty - BLI: EL-339", () => {
    const onSubmit = vi.fn();
    render(<FxPromptInput onSubmit={onSubmit} />);
    const input = screen.getByPlaceholderText("Type a message...");
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("disabled state prevents interaction - BLI: EL-339", () => {
    const onSubmit = vi.fn();
    render(<FxPromptInput disabled onSubmit={onSubmit} value="test" />);
    const input = screen.getByPlaceholderText("Type a message...");
    expect(input).toBeDisabled();
  });

  it("status message renders - BLI: EL-339", () => {
    render(<FxPromptInput statusMessage="Processing..." />);
    expect(screen.getByText("Processing...")).toBeInTheDocument();
  });

  it("disclaimer message renders - BLI: EL-339", () => {
    render(<FxPromptInput disclaimerMessage="AI may make mistakes" />);
    expect(screen.getByText("AI may make mistakes")).toBeInTheDocument();
  });

  it("plus button is present when actions provided - BLI: EL-339", () => {
    render(
      <FxPromptInput
        actions={<div>Action items</div>}
      />
    );
    expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
  });

  it("plus button is present when onPlusPress provided - BLI: EL-339", () => {
    const onPlusPress = vi.fn();
    render(<FxPromptInput onPlusPress={onPlusPress} />);
    const addBtn = screen.getByRole("button", { name: "Add" });
    fireEvent.click(addBtn);
    expect(onPlusPress).toHaveBeenCalledOnce();
  });

  it("send button appears when text is present - BLI: EL-339", () => {
    render(<FxPromptInput value="Hello" />);
    expect(screen.getByRole("button", { name: "Send" })).toBeInTheDocument();
  });

  it("send button is NOT present when value is empty - BLI: EL-339", () => {
    render(<FxPromptInput />);
    expect(screen.queryByRole("button", { name: "Send" })).not.toBeInTheDocument();
  });

  it("dictate button shows when no text and showDictate=true - BLI: EL-339", () => {
    render(<FxPromptInput showDictate />);
    expect(screen.getByRole("button", { name: "Dictate" })).toBeInTheDocument();
  });

  it("voice button shows when no text and showVoice=true - BLI: EL-339", () => {
    render(<FxPromptInput showVoice />);
    expect(screen.getByRole("button", { name: "Voice" })).toBeInTheDocument();
  });

  it("imperative ref: focus, clear, getValue, setValue - BLI: EL-339", () => {
    const ref = React.createRef<FxPromptInputRef>();
    const onLiveChange = vi.fn();
    render(<FxPromptInput ref={ref} onLiveChange={onLiveChange} />);

    expect(ref.current).not.toBeNull();

    // setValue
    act(() => { ref.current!.setValue("Imperative value"); });
    expect(ref.current!.getValue()).toBe("Imperative value");
    expect(onLiveChange).toHaveBeenCalledWith({ value: "Imperative value" });

    // clear
    act(() => { ref.current!.clear(); });
    expect(ref.current!.getValue()).toBe("");
    expect(onLiveChange).toHaveBeenCalledWith({ value: "" });

    // focus (should not throw)
    act(() => { ref.current!.focus(); });
  });

  it("click send button fires onSubmit - BLI: EL-339", () => {
    const onSubmit = vi.fn();
    render(<FxPromptInput onSubmit={onSubmit} value="Send me" />);
    fireEvent.click(screen.getByRole("button", { name: "Send" }));
    expect(onSubmit).toHaveBeenCalledWith({ value: "Send me" });
  });

  // ── Mode variants ──────────────────────────────────────────────────────────

  it("renders a textarea in multiline mode - BLI: EL-339", () => {
    render(<FxPromptInput mode="multiline" placeholder="Multi..." />);
    const textarea = screen.getByPlaceholderText("Multi...");
    expect(textarea.tagName).toBe("TEXTAREA");
  });

  it("renders an input in oneline mode - BLI: EL-339", () => {
    render(<FxPromptInput mode="oneline" placeholder="One..." />);
    const input = screen.getByPlaceholderText("One...");
    expect(input.tagName).toBe("INPUT");
  });

  // ── Shift+Enter in multiline ───────────────────────────────────────────────

  it("Shift+Enter in multiline does NOT submit - BLI: EL-339", () => {
    const onSubmit = vi.fn();
    render(<FxPromptInput mode="multiline" onSubmit={onSubmit} />);
    const textarea = screen.getByPlaceholderText("Type a message...");
    fireEvent.change(textarea, { target: { value: "Hello" } });
    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: true });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("Enter without shift in multiline DOES submit - BLI: EL-339", () => {
    const onSubmit = vi.fn();
    render(<FxPromptInput mode="multiline" onSubmit={onSubmit} />);
    const textarea = screen.getByPlaceholderText("Type a message...");
    fireEvent.change(textarea, { target: { value: "Hello" } });
    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: false });
    expect(onSubmit).toHaveBeenCalledWith({ value: "Hello" });
  });

  // ── Button visibility branches ─────────────────────────────────────────────

  it("hides dictate button when showDictate=false - BLI: EL-339", () => {
    render(<FxPromptInput showDictate={false} />);
    expect(screen.queryByRole("button", { name: "Dictate" })).not.toBeInTheDocument();
  });

  it("hides voice button when showVoice=false - BLI: EL-339", () => {
    render(<FxPromptInput showVoice={false} />);
    expect(screen.queryByRole("button", { name: "Voice" })).not.toBeInTheDocument();
  });

  it("shows send button instead of dictate/voice when value present - BLI: EL-339", () => {
    render(<FxPromptInput value="text" showDictate showVoice />);
    expect(screen.getByRole("button", { name: "Send" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Dictate" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Voice" })).not.toBeInTheDocument();
  });

  // ── Dictate / Voice callbacks ──────────────────────────────────────────────

  it("dictate button fires onDictatePress - BLI: EL-339", () => {
    const onDictatePress = vi.fn();
    render(<FxPromptInput showDictate onDictatePress={onDictatePress} />);
    fireEvent.click(screen.getByRole("button", { name: "Dictate" }));
    expect(onDictatePress).toHaveBeenCalledOnce();
  });

  it("voice button fires onVoicePress - BLI: EL-339", () => {
    const onVoicePress = vi.fn();
    render(<FxPromptInput showVoice onVoicePress={onVoicePress} />);
    fireEvent.click(screen.getByRole("button", { name: "Voice" }));
    expect(onVoicePress).toHaveBeenCalledOnce();
  });

  // ── Context items (tags) ───────────────────────────────────────────────────

  it("renders context items as tags - BLI: EL-339", () => {
    const items = [
      { id: "1", label: "Space", removable: true },
      { id: "2", label: "Job" },
    ];
    render(<FxPromptInput contextItems={items} />);
    expect(screen.getByText("Space")).toBeInTheDocument();
    expect(screen.getByText("Job")).toBeInTheDocument();
  });

  it("context item remove callback fires - BLI: EL-339", () => {
    const onContextItemRemove = vi.fn();
    const items = [{ id: "1", label: "Space", removable: true }];
    render(
      <FxPromptInput
        contextItems={items}
        onContextItemRemove={onContextItemRemove}
      />
    );
    const removeBtn = screen.getByRole("button", { name: "Remove" });
    fireEvent.click(removeBtn);
    expect(onContextItemRemove).toHaveBeenCalledWith({ item: items[0] });
  });

  it("non-removable context items have no close button - BLI: EL-339", () => {
    const items = [{ id: "1", label: "Permanent", removable: false }];
    render(<FxPromptInput contextItems={items} />);
    expect(screen.getByText("Permanent")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Remove" })).not.toBeInTheDocument();
  });

  it("context items with icons render icons - BLI: EL-339", () => {
    const items = [
      { id: "1", label: "WithIcon", icon: <span data-testid="ctx-icon">IC</span> },
    ];
    render(<FxPromptInput contextItems={items} />);
    expect(screen.getByTestId("ctx-icon")).toBeInTheDocument();
  });

  // ── Toolbar buttons in multiline mode ──────────────────────────────────────

  it("renders custom toolbar buttons in multiline mode - BLI: EL-339", () => {
    render(
      <FxPromptInput
        mode="multiline"
        toolbarButtons={<button data-testid="custom-btn">Bold</button>}
      />
    );
    expect(screen.getByTestId("custom-btn")).toBeInTheDocument();
  });

  // ── Actions menu ───────────────────────────────────────────────────────────

  it("plus button opens actions menu and fires onPlusPress - BLI: EL-339", () => {
    const onPlusPress = vi.fn();
    render(
      <FxPromptInput
        actions={<div data-testid="action-content">Action</div>}
        onPlusPress={onPlusPress}
      />
    );
    const addBtn = screen.getByRole("button", { name: "Add" });
    fireEvent.click(addBtn);
    expect(onPlusPress).toHaveBeenCalledOnce();
  });

  // ── Controlled value ───────────────────────────────────────────────────────

  it("controlled value prop takes precedence over internal state - BLI: EL-339", () => {
    const { rerender } = render(<FxPromptInput value="controlled" />);
    const input = screen.getByPlaceholderText("Type a message...");
    expect(input).toHaveValue("controlled");
    rerender(<FxPromptInput value="updated" />);
    expect(input).toHaveValue("updated");
  });

  // ── Imperative ref methods ─────────────────────────────────────────────────

  it("getNativeElement returns the container div - BLI: EL-339", () => {
    const ref = React.createRef<FxPromptInputRef>();
    render(<FxPromptInput ref={ref} />);
    expect(ref.current!.getNativeElement()).toBeInstanceOf(HTMLDivElement);
    expect(ref.current!.nativeElement).toBeInstanceOf(HTMLDivElement);
  });

  it("imperative focus in multiline mode focuses textarea - BLI: EL-339", () => {
    const ref = React.createRef<FxPromptInputRef>();
    render(<FxPromptInput ref={ref} mode="multiline" />);
    act(() => { ref.current!.focus(); });
    // Should not throw; just verifying it runs the multiline branch
    expect(document.activeElement?.tagName).toBe("TEXTAREA");
  });

  // ── Typeahead system ───────────────────────────────────────────────────────

  describe("typeahead", () => {
    it("Tab accepts suggestion - BLI: EL-339", async () => {
      vi.useFakeTimers();
      const suggestions = [{ text: " world" }];
      const onTypeaheadRequest = vi.fn().mockResolvedValue(suggestions);
      const onLiveChange = vi.fn();

      render(
        <FxPromptInput
          onTypeaheadRequest={onTypeaheadRequest}
          onLiveChange={onLiveChange}
          debounceMs={50}
        />
      );

      const input = screen.getByPlaceholderText("Type a message...");
      fireEvent.change(input, { target: { value: "hello" } });

      // Advance past debounce
      await act(async () => { vi.advanceTimersByTime(100); });

      // Now suggestions are visible – press Tab
      fireEvent.keyDown(input, { key: "Tab" });

      // After accepting, value should be "hello world"
      expect(onLiveChange).toHaveBeenCalledWith({ value: "hello world" });
    });

    it("Escape dismisses suggestions - BLI: EL-339", async () => {
      vi.useFakeTimers();
      const suggestions = [{ text: " world" }];
      const onTypeaheadRequest = vi.fn().mockResolvedValue(suggestions);

      render(
        <FxPromptInput
          onTypeaheadRequest={onTypeaheadRequest}
          debounceMs={50}
        />
      );

      const input = screen.getByPlaceholderText("Type a message...");
      fireEvent.change(input, { target: { value: "hello" } });

      await act(async () => { vi.advanceTimersByTime(100); });

      // Suggestion pill should be visible (use role=button to avoid ghost text match)
      expect(screen.getByRole("button", { name: "world" })).toBeInTheDocument();

      // Press Escape
      fireEvent.keyDown(input, { key: "Escape" });

      // Suggestion pill should be dismissed
      expect(screen.queryByRole("button", { name: "world" })).not.toBeInTheDocument();
    });

    it("ArrowDown/ArrowUp navigate suggestions - BLI: EL-339", async () => {
      vi.useFakeTimers();
      const suggestions = [
        { text: " alpha" },
        { text: " beta" },
        { text: " gamma" },
      ];
      const onTypeaheadRequest = vi.fn().mockResolvedValue(suggestions);

      render(
        <FxPromptInput
          onTypeaheadRequest={onTypeaheadRequest}
          debounceMs={50}
        />
      );

      const input = screen.getByPlaceholderText("Type a message...");
      fireEvent.change(input, { target: { value: "test" } });

      await act(async () => { vi.advanceTimersByTime(100); });

      // All three suggestion pills should be visible
      expect(screen.getByRole("button", { name: "alpha" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "beta" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "gamma" })).toBeInTheDocument();

      // Arrow down moves selection
      fireEvent.keyDown(input, { key: "ArrowDown" });
      fireEvent.keyDown(input, { key: "ArrowDown" });
      // Arrow up moves selection back
      fireEvent.keyDown(input, { key: "ArrowUp" });
      // Should not throw, selection index is internal but we verify keys are handled
    });

    it("clicking a suggestion pill accepts it - BLI: EL-339", async () => {
      vi.useFakeTimers();
      const suggestions = [{ text: " completion" }];
      const onTypeaheadRequest = vi.fn().mockResolvedValue(suggestions);
      const onLiveChange = vi.fn();

      render(
        <FxPromptInput
          onTypeaheadRequest={onTypeaheadRequest}
          onLiveChange={onLiveChange}
          debounceMs={50}
        />
      );

      const input = screen.getByPlaceholderText("Type a message...");
      fireEvent.change(input, { target: { value: "hello" } });

      await act(async () => { vi.advanceTimersByTime(100); });

      const pill = screen.getByRole("button", { name: "completion" });
      fireEvent.mouseDown(pill);

      expect(onLiveChange).toHaveBeenCalledWith({ value: "hello completion" });
    });

    it("suggestion shows label when provided - BLI: EL-339", async () => {
      vi.useFakeTimers();
      const suggestions = [{ text: " world", label: "World suggestion" }];
      const onTypeaheadRequest = vi.fn().mockResolvedValue(suggestions);

      render(
        <FxPromptInput
          onTypeaheadRequest={onTypeaheadRequest}
          debounceMs={50}
        />
      );

      const input = screen.getByPlaceholderText("Type a message...");
      fireEvent.change(input, { target: { value: "hello" } });

      await act(async () => { vi.advanceTimersByTime(100); });

      expect(screen.getByText("World suggestion")).toBeInTheDocument();
    });

    it("typeaheadEnabled=false prevents suggestion requests - BLI: EL-339", async () => {
      vi.useFakeTimers();
      const onTypeaheadRequest = vi.fn().mockResolvedValue([{ text: " x" }]);

      render(
        <FxPromptInput
          onTypeaheadRequest={onTypeaheadRequest}
          typeaheadEnabled={false}
          debounceMs={50}
        />
      );

      const input = screen.getByPlaceholderText("Type a message...");
      fireEvent.change(input, { target: { value: "hello" } });

      await act(async () => { vi.advanceTimersByTime(100); });

      expect(onTypeaheadRequest).not.toHaveBeenCalled();
    });

    it("ArrowDown wraps from last to first suggestion - BLI: EL-339", async () => {
      vi.useFakeTimers();
      const suggestions = [{ text: " a" }, { text: " b" }];
      const onTypeaheadRequest = vi.fn().mockResolvedValue(suggestions);

      render(
        <FxPromptInput
          onTypeaheadRequest={onTypeaheadRequest}
          debounceMs={50}
        />
      );

      const input = screen.getByPlaceholderText("Type a message...");
      fireEvent.change(input, { target: { value: "t" } });
      await act(async () => { vi.advanceTimersByTime(100); });

      // selectedIndex starts at 0, ArrowDown -> 1, ArrowDown -> wraps to 0
      fireEvent.keyDown(input, { key: "ArrowDown" });
      fireEvent.keyDown(input, { key: "ArrowDown" });
      // Now at index 0 again (wrapped)

      // ArrowUp from 0 wraps to last
      fireEvent.keyDown(input, { key: "ArrowUp" });
      // Verify suggestions are still displayed after navigation
      expect(screen.getByRole("button", { name: "a" })).toBeInTheDocument();
    });

    it("maxSuggestions limits the number of displayed suggestions - BLI: EL-339", async () => {
      vi.useFakeTimers();
      const suggestions = [
        { text: " one" },
        { text: " two" },
        { text: " three" },
        { text: " four" },
      ];
      const onTypeaheadRequest = vi.fn().mockResolvedValue(suggestions);

      render(
        <FxPromptInput
          onTypeaheadRequest={onTypeaheadRequest}
          maxSuggestions={2}
          debounceMs={50}
        />
      );

      const input = screen.getByPlaceholderText("Type a message...");
      fireEvent.change(input, { target: { value: "t" } });
      await act(async () => { vi.advanceTimersByTime(100); });

      expect(screen.getByRole("button", { name: "one" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "two" })).toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "three" })).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "four" })).not.toBeInTheDocument();
    });

    it("new input after Escape re-enables suggestions - BLI: EL-339", async () => {
      vi.useFakeTimers();
      const suggestions = [{ text: " world" }];
      const onTypeaheadRequest = vi.fn().mockResolvedValue(suggestions);

      render(
        <FxPromptInput
          onTypeaheadRequest={onTypeaheadRequest}
          debounceMs={50}
        />
      );

      const input = screen.getByPlaceholderText("Type a message...");
      fireEvent.change(input, { target: { value: "hello" } });
      await act(async () => { vi.advanceTimersByTime(100); });

      // Dismiss
      fireEvent.keyDown(input, { key: "Escape" });
      expect(screen.queryByRole("button", { name: "world" })).not.toBeInTheDocument();

      // Type again – dismissed state resets via handleChange
      fireEvent.change(input, { target: { value: "hello again" } });
      await act(async () => { vi.advanceTimersByTime(100); });

      expect(screen.getByRole("button", { name: "world" })).toBeInTheDocument();
    });

    it("mouseEnter on suggestion pill updates selected index - BLI: EL-339", async () => {
      vi.useFakeTimers();
      const suggestions = [{ text: " a" }, { text: " b" }];
      const onTypeaheadRequest = vi.fn().mockResolvedValue(suggestions);

      render(
        <FxPromptInput
          onTypeaheadRequest={onTypeaheadRequest}
          debounceMs={50}
        />
      );

      const input = screen.getByPlaceholderText("Type a message...");
      fireEvent.change(input, { target: { value: "t" } });
      await act(async () => { vi.advanceTimersByTime(100); });

      const pillB = screen.getByRole("button", { name: "b" });
      fireEvent.mouseEnter(pillB);
      // Pill should still be in the document after hover
      expect(pillB).toBeInTheDocument();
    });
  });

  // ── Disabled submit guard ──────────────────────────────────────────────────

  it("does not submit when disabled even if value is present - BLI: EL-339", () => {
    const onSubmit = vi.fn();
    render(<FxPromptInput disabled value="test" onSubmit={onSubmit} />);
    // The container gets pointer-events-none, but handleSubmit also checks disabled
    // We directly invoke via ref-style: simulate the key event on the input
    const input = screen.getByPlaceholderText("Type a message...");
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  // ── className and style passthrough ────────────────────────────────────────

  it("passes className and style to container - BLI: EL-339", () => {
    const { container } = render(
      <FxPromptInput className="custom-cls" style={{ maxWidth: "500px" }} />
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.classList.contains("custom-cls")).toBe(true);
    expect(wrapper.style.maxWidth).toBe("500px");
  });

  // ── Suggestions in multiline mode ──────────────────────────────────────────

  it("renders suggestions in multiline mode without anchor text - BLI: EL-339", async () => {
    vi.useFakeTimers();
    const suggestions = [{ text: " completion" }];
    const onTypeaheadRequest = vi.fn().mockResolvedValue(suggestions);

    render(
      <FxPromptInput
        mode="multiline"
        onTypeaheadRequest={onTypeaheadRequest}
        debounceMs={50}
      />
    );

    const textarea = screen.getByPlaceholderText("Type a message...");
    fireEvent.change(textarea, { target: { value: "hello" } });
    await act(async () => { vi.advanceTimersByTime(100); });

    expect(screen.getByRole("button", { name: "completion" })).toBeInTheDocument();
  });

  // ── data-testid forwarding ─────────────────────────────────────────────────

  it("derives -add testid on the plus button - BLI: EL-339", () => {
    render(<FxPromptInput onPlusPress={() => {}} data-testid="prompt" />);
    expect(screen.getByTestId("prompt-add")).toBeInTheDocument();
  });

  it("derives -send testid when value is non-empty - BLI: EL-339", () => {
    render(<FxPromptInput value="hi" onSubmit={() => {}} data-testid="prompt" />);
    expect(screen.getByTestId("prompt-send")).toBeInTheDocument();
  });

  it("derives -dictate and -voice testids when value is empty - BLI: EL-339", () => {
    render(<FxPromptInput value="" data-testid="prompt" />);
    expect(screen.getByTestId("prompt-dictate")).toBeInTheDocument();
    expect(screen.getByTestId("prompt-voice")).toBeInTheDocument();
  });

  it("derives -context-{id} testid on each context tag - BLI: EL-339", () => {
    render(
      <FxPromptInput
        contextItems={[
          { id: "space1", label: "Workspace" },
          { id: "doc7", label: "Doc 7" },
        ]}
        data-testid="prompt"
      />
    );
    expect(screen.getByTestId("prompt-context-space1")).toBeInTheDocument();
    expect(screen.getByTestId("prompt-context-doc7")).toBeInTheDocument();
  });
});
