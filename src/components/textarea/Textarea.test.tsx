import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { Textarea } from "./Textarea";
import { ValueState, type TextareaRef } from "../../types/textarea";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getTextarea(): HTMLTextAreaElement {
  return screen.getByRole("textbox") as HTMLTextAreaElement;
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

describe("Textarea – rendering", () => {
  it("renders a textarea element - BLI: EL-339", () => {
    render(<Textarea />);
    expect(getTextarea()).toBeInTheDocument();
    expect(getTextarea().tagName.toLowerCase()).toBe("textarea");
  });

  it("renders with data-testid on native textarea - BLI: EL-339", () => {
    render(<Textarea data-testid="my-ta" />);
    expect(screen.getByTestId("my-ta")).toBeInTheDocument();
  });

  it("renders placeholder text - BLI: EL-339", () => {
    render(<Textarea placeholder="Write here..." />);
    expect(getTextarea()).toHaveAttribute("placeholder", "Write here...");
  });

  it("renders with a custom id - BLI: EL-339", () => {
    render(<Textarea id="ta-id" />);
    expect(getTextarea()).toHaveAttribute("id", "ta-id");
  });

  it("renders with a name attribute - BLI: EL-339", () => {
    render(<Textarea name="comments" />);
    expect(getTextarea()).toHaveAttribute("name", "comments");
  });

  it("applies className to outer wrapper - BLI: EL-339", () => {
    const { container } = render(<Textarea className="my-class" />);
    expect(container.firstChild).toHaveClass("my-class");
  });

  it("applies inline style to outer wrapper - BLI: EL-339", () => {
    const { container } = render(<Textarea style={{ width: "300px" }} />);
    expect(container.firstChild).toHaveStyle({ width: "300px" });
  });

  it("renders with rows attribute when rows > 0 - BLI: EL-339", () => {
    render(<Textarea rows={5} />);
    expect(getTextarea()).toHaveAttribute("rows", "5");
  });

  it("does not set rows attribute when rows=0 (default) - BLI: EL-339", () => {
    render(<Textarea rows={0} />);
    expect(getTextarea()).not.toHaveAttribute("rows");
  });
});

// ---------------------------------------------------------------------------
// Controlled / uncontrolled value
// ---------------------------------------------------------------------------

describe("Textarea – controlled value", () => {
  it("displays controlled value - BLI: EL-339", () => {
    render(<Textarea value="hello" onChange={vi.fn()} />);
    expect(getTextarea()).toHaveValue("hello");
  });

  it("updates displayed value when controlled value changes - BLI: EL-339", () => {
    const { rerender } = render(<Textarea value="first" onChange={vi.fn()} />);
    expect(getTextarea()).toHaveValue("first");
    rerender(<Textarea value="second" onChange={vi.fn()} />);
    expect(getTextarea()).toHaveValue("second");
  });

  it("displays defaultValue in uncontrolled mode - BLI: EL-339", () => {
    render(<Textarea defaultValue="default text" />);
    expect(getTextarea()).toHaveValue("default text");
  });

  it("updates uncontrolled value on typing - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(<Textarea defaultValue="" />);
    await user.type(getTextarea(), "abc");
    expect(getTextarea()).toHaveValue("abc");
  });
});

// ---------------------------------------------------------------------------
// onInput / onChange events
// ---------------------------------------------------------------------------

describe("Textarea – events", () => {
  it("calls onInput with detail containing value on typing - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onInput = vi.fn();
    render(<Textarea onInput={onInput} />);
    await user.type(getTextarea(), "hi");
    expect(onInput).toHaveBeenCalledWith(
      expect.objectContaining({ value: expect.any(String), escapePressed: false })
    );
  });

  it("calls onInput with escapePressed=true when Escape is pressed - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onInput = vi.fn();
    render(<Textarea onInput={onInput} />);
    getTextarea().focus();
    await user.keyboard("{Escape}");
    expect(onInput).toHaveBeenCalledWith(
      expect.objectContaining({ escapePressed: true })
    );
  });

  it("calls onChange with TextareaChangeDetail on blur when value changed - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Textarea defaultValue="" onChange={onChange} />);
    await user.type(getTextarea(), "text");
    await user.tab(); // blur
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: "text", source: "user" })
    );
  });

  it("does NOT call onChange on blur when value has not changed - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Textarea defaultValue="same" onChange={onChange} />);
    await user.click(getTextarea());
    await user.tab(); // blur without changing
    expect(onChange).not.toHaveBeenCalled();
  });

  it("onChange detail includes previousValue - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Textarea defaultValue="before" onChange={onChange} />);
    await user.clear(getTextarea());
    await user.type(getTextarea(), "after");
    await user.tab();
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ previousValue: "before", value: "after" })
    );
  });

  it("calls onFocus when textarea is focused - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onFocus = vi.fn();
    render(<Textarea onFocus={onFocus} />);
    await user.click(getTextarea());
    expect(onFocus).toHaveBeenCalledOnce();
  });

  it("calls onBlur when textarea loses focus - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onBlur = vi.fn();
    render(<Textarea onBlur={onBlur} />);
    await user.click(getTextarea());
    await user.tab();
    expect(onBlur).toHaveBeenCalledOnce();
  });

  it("calls onKeyDown on key press - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onKeyDown = vi.fn();
    render(<Textarea onKeyDown={onKeyDown} />);
    getTextarea().focus();
    await user.keyboard("{a}");
    expect(onKeyDown).toHaveBeenCalled();
  });

  it("calls onKeyUp on key release - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onKeyUp = vi.fn();
    render(<Textarea onKeyUp={onKeyUp} />);
    getTextarea().focus();
    await user.keyboard("{a}");
    expect(onKeyUp).toHaveBeenCalled();
  });

  it("calls onSelect when text is selected - BLI: EL-339", () => {
    const onSelect = vi.fn();
    render(<Textarea defaultValue="select me" onSelect={onSelect} />);
    // Simulate a select event
    getTextarea().setSelectionRange(0, 6);
    fireEvent.select(getTextarea());
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ start: 0, end: 6, selectedText: "select" })
    );
  });

  it("calls onScroll when textarea scrolls - BLI: EL-339", () => {
    const onScroll = vi.fn();
    render(<Textarea onScroll={onScroll} />);
    fireEvent.scroll(getTextarea());
    expect(onScroll).toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Disabled state
// ---------------------------------------------------------------------------

describe("Textarea – disabled", () => {
  it("has disabled attribute when disabled=true - BLI: EL-339", () => {
    render(<Textarea disabled />);
    expect(getTextarea()).toBeDisabled();
  });

  it("does not respond to typing when disabled (userEvent respects disabled) - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onInput = vi.fn();
    render(<Textarea disabled defaultValue="original" onInput={onInput} />);
    await user.type(getTextarea(), "typed");
    expect(onInput).not.toHaveBeenCalled();
    expect(getTextarea()).toHaveValue("original");
  });
});

// ---------------------------------------------------------------------------
// Readonly state
// ---------------------------------------------------------------------------

describe("Textarea – readonly", () => {
  it("has readOnly attribute when readonly=true - BLI: EL-339", () => {
    render(<Textarea readonly />);
    expect(getTextarea()).toHaveAttribute("readonly");
  });

  it("readonly textarea has the native readonly attribute (no separate aria-readonly) - BLI: EL-339", () => {
    render(<Textarea readonly />);
    // The component uses native readOnly prop; aria-readonly is not explicitly set
    expect(getTextarea()).toHaveAttribute("readonly");
  });
});

// ---------------------------------------------------------------------------
// Required
// ---------------------------------------------------------------------------

describe("Textarea – required", () => {
  it("has required attribute when required=true - BLI: EL-339", () => {
    render(<Textarea required />);
    expect(getTextarea()).toBeRequired();
  });

  it("has aria-required when required - BLI: EL-339", () => {
    render(<Textarea required />);
    expect(getTextarea()).toHaveAttribute("aria-required", "true");
  });
});

// ---------------------------------------------------------------------------
// Value states
// ---------------------------------------------------------------------------

describe("Textarea – value states", () => {
  it.each([
    ValueState.Positive,
    ValueState.Negative,
    ValueState.Critical,
    ValueState.Information,
  ])("renders without crashing for valueState=%s - BLI: EL-339", (state) => {
    render(<Textarea valueState={state} />);
    expect(getTextarea()).toBeInTheDocument();
  });

  it("sets aria-invalid on Negative state - BLI: EL-339", () => {
    render(<Textarea valueState={ValueState.Negative} />);
    expect(getTextarea()).toHaveAttribute("aria-invalid", "true");
  });

  it("does NOT set aria-invalid for non-Negative states - BLI: EL-339", () => {
    render(<Textarea valueState={ValueState.Positive} />);
    expect(getTextarea()).not.toHaveAttribute("aria-invalid");
  });

  it("renders valueStateMessage text - BLI: EL-339", () => {
    render(
      <Textarea
        valueState={ValueState.Negative}
        valueStateMessage="Required field"
      />
    );
    expect(screen.getByText("Required field")).toBeInTheDocument();
  });

  it("valueStateMessage container has role=alert - BLI: EL-339", () => {
    render(
      <Textarea
        valueState={ValueState.Negative}
        valueStateMessage="Error!"
      />
    );
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("renders value state icon inside message when valueState is not None - BLI: EL-339", () => {
    const { container } = render(
      <Textarea
        valueState={ValueState.Negative}
        valueStateMessage="Error"
      />
    );
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("accepts string literal for valueState - BLI: EL-339", () => {
    render(<Textarea valueState="Negative" />);
    expect(getTextarea()).toHaveAttribute("aria-invalid", "true");
  });

  it("aria-describedby references message element when valueStateMessage is set - BLI: EL-339", () => {
    render(
      <Textarea
        valueState={ValueState.Information}
        valueStateMessage="Info message"
      />
    );
    const describedById = getTextarea().getAttribute("aria-describedby");
    expect(describedById).toBeTruthy();
    expect(document.getElementById(describedById!)).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Character counter and maxLength
// ---------------------------------------------------------------------------

describe("Textarea – character counter", () => {
  it("shows character count and max when maxLength is set - BLI: EL-339", () => {
    render(<Textarea defaultValue="hi" maxLength={10} />);
    expect(screen.getByText("2 / 10")).toBeInTheDocument();
  });

  it("counter reflects current character count as user types - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(<Textarea defaultValue="" maxLength={20} />);
    await user.type(getTextarea(), "abc");
    expect(screen.getByText("3 / 20")).toBeInTheDocument();
  });

  it("enforces maxLength on native element when showExceededText is false - BLI: EL-339", () => {
    render(<Textarea maxLength={5} showExceededText={false} />);
    expect(getTextarea()).toHaveAttribute("maxlength", "5");
  });

  it("does NOT set maxLength on native element when showExceededText=true - BLI: EL-339", () => {
    render(<Textarea maxLength={5} showExceededText />);
    expect(getTextarea()).not.toHaveAttribute("maxlength");
  });

  it("shows exceeded count when showExceededText=true and over limit - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(<Textarea defaultValue="" maxLength={3} showExceededText />);
    // Type more than maxLength (no native enforcement)
    await user.type(getTextarea(), "abcdef");
    // Should show +3 exceeded indicator (6 chars - 3 max)
    expect(screen.getByText("+3")).toBeInTheDocument();
  });

  it("does not show exceeded indicator when within limit - BLI: EL-339", () => {
    render(<Textarea defaultValue="ab" maxLength={5} showExceededText />);
    expect(screen.queryByText(/^\+\d+$/)).not.toBeInTheDocument();
  });

  it("does not show character counter when maxLength is not set - BLI: EL-339", () => {
    render(<Textarea defaultValue="hello" />);
    // Counter element should not be in the DOM
    const counter = document.querySelector("[data-part='counter']");
    expect(counter).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// minLength
// ---------------------------------------------------------------------------

describe("Textarea – minLength", () => {
  it("applies minLength attribute - BLI: EL-339", () => {
    render(<Textarea minLength={5} />);
    expect(getTextarea()).toHaveAttribute("minlength", "5");
  });
});

// ---------------------------------------------------------------------------
// Accessibility
// ---------------------------------------------------------------------------

describe("Textarea – accessibility", () => {
  it("applies aria-label via accessibleName - BLI: EL-339", () => {
    render(<Textarea accessibleName="Comments" />);
    expect(getTextarea()).toHaveAttribute("aria-label", "Comments");
  });

  it("applies aria-labelledby via accessibleNameRef - BLI: EL-339", () => {
    render(<Textarea accessibleNameRef="label-el" />);
    expect(getTextarea()).toHaveAttribute("aria-labelledby", "label-el");
  });

  it("applies aria-describedby via accessibleDescriptionRef - BLI: EL-339", () => {
    render(<Textarea accessibleDescriptionRef="desc-el" />);
    expect(getTextarea()).toHaveAttribute("aria-describedby", "desc-el");
  });

  it("combines accessibleDescriptionRef and valueStateMessage id in aria-describedby - BLI: EL-339", () => {
    render(
      <Textarea
        valueState={ValueState.Negative}
        valueStateMessage="Oops"
        accessibleDescriptionRef="extra"
      />
    );
    const describedBy = getTextarea().getAttribute("aria-describedby") ?? "";
    expect(describedBy).toContain("extra");
    expect(describedBy.split(" ").length).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// Imperative ref
// ---------------------------------------------------------------------------

describe("Textarea – imperative ref", () => {
  it("exposes getValue() - BLI: EL-339", () => {
    const ref = React.createRef<TextareaRef>();
    render(<Textarea ref={ref} defaultValue="initial" />);
    expect(ref.current!.getValue()).toBe("initial");
  });

  it("exposes setValue() in uncontrolled mode - BLI: EL-339", () => {
    const ref = React.createRef<TextareaRef>();
    render(<Textarea ref={ref} />);
    act(() => { ref.current!.setValue("programmatic"); });
    expect(ref.current!.getValue()).toBe("programmatic");
  });

  it("setValue fires onChange with source=programmatic - BLI: EL-339", () => {
    const ref = React.createRef<TextareaRef>();
    const onChange = vi.fn();
    render(<Textarea ref={ref} onChange={onChange} />);
    ref.current!.setValue("new");
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: "new", source: "programmatic" })
    );
  });

  it("setValue with silent=true does not fire onChange - BLI: EL-339", () => {
    const ref = React.createRef<TextareaRef>();
    const onChange = vi.fn();
    render(<Textarea ref={ref} onChange={onChange} />);
    ref.current!.setValue("silent", { silent: true });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("exposes clear() - BLI: EL-339", () => {
    const ref = React.createRef<TextareaRef>();
    const onChange = vi.fn();
    render(<Textarea ref={ref} defaultValue="hello" onChange={onChange} />);
    act(() => { ref.current!.clear(); });
    expect(ref.current!.getValue()).toBe("");
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: "", source: "programmatic" })
    );
  });

  it("exposes focus() and blur() - BLI: EL-339", () => {
    const ref = React.createRef<TextareaRef>();
    render(<Textarea ref={ref} />);
    ref.current!.focus();
    expect(getTextarea()).toHaveFocus();
    ref.current!.blur();
    expect(getTextarea()).not.toHaveFocus();
  });

  it("exposes getState() with correct fields - BLI: EL-339", () => {
    const ref = React.createRef<TextareaRef>();
    render(<Textarea ref={ref} defaultValue="test" maxLength={10} valueState={ValueState.Negative} />);
    const state = ref.current!.getState();
    expect(state.value).toBe("test");
    expect(state.valueState).toBe(ValueState.Negative);
    expect(state.characterCount).toBe(4);
    expect(state.exceededCharacters).toBe(0);
    expect(typeof state.focused).toBe("boolean");
    expect(typeof state.valid).toBe("boolean");
  });

  it("getState reflects exceededCharacters when over limit - BLI: EL-339", () => {
    const ref = React.createRef<TextareaRef>();
    render(<Textarea ref={ref} defaultValue="abcdef" maxLength={3} showExceededText />);
    const state = ref.current!.getState();
    expect(state.exceededCharacters).toBe(3);
  });

  it("exposes nativeElement - BLI: EL-339", () => {
    const ref = React.createRef<TextareaRef>();
    render(<Textarea ref={ref} />);
    expect(ref.current!.nativeElement).toBeInstanceOf(HTMLTextAreaElement);
  });

  it("exposes checkValidity() - BLI: EL-339", () => {
    const ref = React.createRef<TextareaRef>();
    render(<Textarea ref={ref} />);
    expect(typeof ref.current!.checkValidity()).toBe("boolean");
  });

  it("exposes select() - BLI: EL-339", () => {
    const ref = React.createRef<TextareaRef>();
    render(<Textarea ref={ref} defaultValue="select me" />);
    expect(() => ref.current!.select()).not.toThrow();
  });

  it("exposes setSelectionRange() - BLI: EL-339", () => {
    const ref = React.createRef<TextareaRef>();
    render(<Textarea ref={ref} defaultValue="hello" />);
    expect(() => ref.current!.setSelectionRange(0, 3)).not.toThrow();
  });

  it("exposes scrollTo() without throwing when supported - BLI: EL-339", () => {
    const ref = React.createRef<TextareaRef>();
    render(<Textarea ref={ref} />);
    // jsdom does not implement scrollTo on textarea; mock it so we can test the ref method exists
    const nativeEl = ref.current!.nativeElement!;
    const mockScrollTo = vi.fn();
    Object.defineProperty(nativeEl, "scrollTo", { value: mockScrollTo, writable: true });
    ref.current!.scrollTo(0, 100);
    expect(mockScrollTo).toHaveBeenCalledWith(0, 100);
  });
});

// ---------------------------------------------------------------------------
// Growing behavior
// ---------------------------------------------------------------------------

describe("Textarea – growing", () => {
  it("renders without crashing when growing=true - BLI: EL-339", () => {
    render(<Textarea growing />);
    expect(getTextarea()).toBeInTheDocument();
  });

  it("renders without crashing with growingMaxRows - BLI: EL-339", () => {
    render(<Textarea growing growingMaxRows={5} />);
    expect(getTextarea()).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// autocomplete
// ---------------------------------------------------------------------------

describe("Textarea – autocomplete", () => {
  it("applies autocomplete attribute - BLI: EL-339", () => {
    render(<Textarea autocomplete="off" />);
    expect(getTextarea()).toHaveAttribute("autocomplete", "off");
  });
});

// ---------------------------------------------------------------------------
// data-ai-field
// ---------------------------------------------------------------------------

describe("Textarea – data-ai-field", () => {
  it("applies data-ai-field to native textarea - BLI: EL-339", () => {
    render(<Textarea data-ai-field="comments-field" />);
    const el = document.querySelector("[data-ai-field='comments-field']");
    expect(el).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// IME composition
// ---------------------------------------------------------------------------

describe("Textarea – IME composition", () => {
  it("calls onInput with composed value after compositionEnd - BLI: EL-339", () => {
    const onInput = vi.fn();
    render(<Textarea onInput={onInput} />);
    const ta = getTextarea();

    fireEvent.compositionStart(ta);
    // simulate the composed value appearing in the textarea
    Object.defineProperty(ta, "value", { configurable: true, writable: true, value: "あ" });
    fireEvent.compositionEnd(ta);

    expect(onInput).toHaveBeenCalledWith(
      expect.objectContaining({ value: "あ", escapePressed: false })
    );
  });

  it("does not call onInput during composition on regular input events - BLI: EL-339", () => {
    const onInput = vi.fn();
    render(<Textarea onInput={onInput} />);
    const ta = getTextarea();

    fireEvent.compositionStart(ta);
    // fire a regular input event while composing – should be skipped
    fireEvent.input(ta);
    expect(onInput).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Validity methods
// ---------------------------------------------------------------------------

describe("Textarea – validity methods", () => {
  it("exposes reportValidity() - BLI: EL-339", () => {
    const ref = React.createRef<TextareaRef>();
    render(<Textarea ref={ref} />);
    expect(typeof ref.current!.reportValidity()).toBe("boolean");
  });

  it("exposes setCustomValidity() - BLI: EL-339", () => {
    const ref = React.createRef<TextareaRef>();
    render(<Textarea ref={ref} />);
    expect(() => ref.current!.setCustomValidity("Custom error")).not.toThrow();
    expect(ref.current!.checkValidity()).toBe(false);
    ref.current!.setCustomValidity("");
    expect(ref.current!.checkValidity()).toBe(true);
  });
});
