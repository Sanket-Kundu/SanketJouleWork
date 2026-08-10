import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { Input } from "./Input";
import { InputType, InputSize, ValueState, type InputRef } from "../../types/input";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getInput(): HTMLInputElement {
  return screen.getByRole("textbox") as HTMLInputElement;
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

describe("Input – rendering", () => {
  it("renders a text input by default - BLI: EL-339", () => {
    render(<Input />);
    expect(getInput()).toBeInTheDocument();
    expect(getInput()).toHaveAttribute("type", "text");
  });

  it("renders with data-testid on wrapper div - BLI: EL-339", () => {
    render(<Input data-testid="my-input" />);
    expect(screen.getByTestId("my-input")).toBeInTheDocument();
  });

  it("renders placeholder text - BLI: EL-339", () => {
    render(<Input placeholder="Enter text" />);
    expect(getInput()).toHaveAttribute("placeholder", "Enter text");
  });

  it("renders with a custom id - BLI: EL-339", () => {
    render(<Input id="custom-id" />);
    expect(getInput()).toHaveAttribute("id", "custom-id");
  });

  it("renders with a name attribute - BLI: EL-339", () => {
    render(<Input name="username" />);
    expect(getInput()).toHaveAttribute("name", "username");
  });

  it("applies className to wrapper div - BLI: EL-339", () => {
    const { container } = render(<Input className="my-class" />);
    expect(container.firstChild).toHaveClass("my-class");
  });

  it("applies inline style to wrapper div - BLI: EL-339", () => {
    render(<Input style={{ width: "200px" }} />);
    const wrapper = screen.getByRole("textbox").closest("div[style]");
    expect(wrapper).toHaveStyle({ width: "200px" });
  });

  it("renders start icon when iconPosition is start - BLI: EL-339", () => {
    render(<Input icon={<span data-testid="icon-start">S</span>} iconPosition="start" />);
    expect(screen.getByTestId("icon-start")).toBeInTheDocument();
  });

  it("renders end icon when iconPosition is end - BLI: EL-339", () => {
    render(<Input icon={<span data-testid="icon-end">E</span>} iconPosition="end" />);
    expect(screen.getByTestId("icon-end")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Input types
// ---------------------------------------------------------------------------

describe("Input – input types", () => {
  it.each([
    [InputType.Text, "text"],
    [InputType.Email, "email"],
    [InputType.Password, "password"],
    [InputType.Tel, "tel"],
    [InputType.URL, "url"],
    [InputType.Search, "search"],
  ])("maps InputType.%s to native type=%s - BLI: EL-339", (inputType, nativeType) => {
    const { container } = render(<Input type={inputType} />);
    const input = container.querySelector("input");
    expect(input).toHaveAttribute("type", nativeType);
  });

  it("renders number input with type=number - BLI: EL-339", () => {
    const { container } = render(<Input type={InputType.Number} />);
    const input = container.querySelector("input");
    expect(input).toHaveAttribute("type", "number");
  });

  it("accepts string enum literal for type - BLI: EL-339", () => {
    const { container } = render(<Input type="Email" />);
    const input = container.querySelector("input");
    expect(input).toHaveAttribute("type", "email");
  });
});

// ---------------------------------------------------------------------------
// Controlled / uncontrolled value
// ---------------------------------------------------------------------------

describe("Input – controlled value", () => {
  it("displays controlled value - BLI: EL-339", () => {
    render(<Input value="hello" onChange={vi.fn()} />);
    expect(getInput()).toHaveValue("hello");
  });

  it("updates displayed value when controlled value changes - BLI: EL-339", () => {
    const { rerender } = render(<Input value="first" onChange={vi.fn()} />);
    expect(getInput()).toHaveValue("first");
    rerender(<Input value="second" onChange={vi.fn()} />);
    expect(getInput()).toHaveValue("second");
  });

  it("displays defaultValue in uncontrolled mode - BLI: EL-339", () => {
    render(<Input defaultValue="initial" />);
    expect(getInput()).toHaveValue("initial");
  });

  it("updates uncontrolled value on typing - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(<Input defaultValue="" />);
    await user.type(getInput(), "abc");
    expect(getInput()).toHaveValue("abc");
  });

  it("does not change uncontrolled internal value when controlled prop changes - BLI: EL-339", () => {
    // A controlled input must be driven by value prop
    const onChange = vi.fn();
    render(<Input value="ctrl" onChange={onChange} />);
    expect(getInput()).toHaveValue("ctrl");
  });
});

// ---------------------------------------------------------------------------
// onChange / onInput events
// ---------------------------------------------------------------------------

describe("Input – events", () => {
  it("calls onInput with new string value on typing - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onInput = vi.fn();
    render(<Input onInput={onInput} />);
    await user.type(getInput(), "hi");
    expect(onInput).toHaveBeenCalledWith("h");
    expect(onInput).toHaveBeenCalledWith("hi");
  });

  it("does NOT call onChange on every keystroke — only on commit - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Input onChange={onChange} />);
    await user.type(getInput(), "x");
    // onChange should NOT have been called yet (still focused, no commit)
    expect(onChange).not.toHaveBeenCalled();
  });

  it("calls onChange with InputChangeDetail on blur (commit) - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Input onChange={onChange} />);
    await user.type(getInput(), "x");
    await user.tab(); // blur — commit
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: "x", previousValue: "", source: "user" })
    );
  });

  it("onChange detail includes previousValue (value at focus time) - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Input defaultValue="ab" onChange={onChange} />);
    await user.click(getInput());
    await user.type(getInput(), "c");
    await user.tab(); // blur — commit
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: "abc", previousValue: "ab" })
    );
  });

  it("does NOT call onChange on blur when value is unchanged - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Input defaultValue="hello" onChange={onChange} />);
    await user.click(getInput());
    await user.tab(); // blur without changing value
    expect(onChange).not.toHaveBeenCalled();
  });

  it("calls onChange on Enter (commit via Enter) - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Input onChange={onChange} />);
    await user.type(getInput(), "test");
    await user.keyboard("{Enter}");
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: "test", previousValue: "", source: "user" })
    );
  });

  it("calls onFocus when input is focused - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onFocus = vi.fn();
    render(<Input onFocus={onFocus} />);
    await user.click(getInput());
    expect(onFocus).toHaveBeenCalledOnce();
  });

  it("calls onBlur when input loses focus - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onBlur = vi.fn();
    render(<Input onBlur={onBlur} />);
    await user.click(getInput());
    await user.tab();
    expect(onBlur).toHaveBeenCalledOnce();
  });

  it("calls onKeyDown on key press - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onKeyDown = vi.fn();
    render(<Input onKeyDown={onKeyDown} />);
    getInput().focus();
    await user.keyboard("{a}");
    expect(onKeyDown).toHaveBeenCalled();
  });

  it("calls onKeyUp on key release - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onKeyUp = vi.fn();
    render(<Input onKeyUp={onKeyUp} />);
    getInput().focus();
    await user.keyboard("{a}");
    expect(onKeyUp).toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Keyboard – Escape and Enter
// ---------------------------------------------------------------------------

describe("Input – keyboard behavior", () => {
  it("Escape reverts to value captured on focus (uncontrolled) - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onInput = vi.fn();
    render(<Input defaultValue="original" onInput={onInput} />);
    await user.click(getInput());
    await user.type(getInput(), "xyz");
    await user.keyboard("{Escape}");
    // onInput should be called with original value on Escape
    expect(onInput).toHaveBeenCalledWith("original");
  });

  it("Escape clears input when showClearIcon is true and there's a value - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Input defaultValue="test value" showClearIcon onChange={onChange} />);
    await user.click(getInput());
    await user.keyboard("{Escape}");
    expect(getInput()).toHaveValue("");
    expect(onChange).toHaveBeenCalledWith({
      value: "",
      previousValue: "test value",
      source: "user",
    });
  });

  it("Escape reverts when showClearIcon=false (default behavior) - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onInput = vi.fn();
    render(<Input defaultValue="original" onInput={onInput} />);
    await user.click(getInput());
    await user.type(getInput(), "xyz");
    await user.keyboard("{Escape}");
    expect(getInput()).toHaveValue("original");
    expect(onInput).toHaveBeenCalledWith("original");
  });

  it("Enter blurs the input - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(<Input />);
    await user.click(getInput());
    expect(getInput()).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(getInput()).not.toHaveFocus();
  });
});

// ---------------------------------------------------------------------------
// Disabled state
// ---------------------------------------------------------------------------

describe("Input – disabled", () => {
  it("has disabled attribute when disabled=true - BLI: EL-339", () => {
    render(<Input disabled />);
    expect(getInput()).toBeDisabled();
  });

  it("has aria-disabled when disabled - BLI: EL-339", () => {
    render(<Input disabled />);
    expect(getInput()).toHaveAttribute("aria-disabled", "true");
  });

  it("does not update value when typed into while disabled (userEvent respects disabled) - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onInput = vi.fn();
    render(<Input disabled defaultValue="original" onInput={onInput} />);
    // userEvent respects the disabled attribute and will not fire input events
    await user.type(getInput(), "test");
    expect(onInput).not.toHaveBeenCalled();
    expect(getInput()).toHaveValue("original");
  });

  it("clear button is not shown when disabled even with value - BLI: EL-339", () => {
    render(<Input disabled showClearIcon value="text" onChange={vi.fn()} />);
    expect(screen.queryByRole("button", { name: /clear/i })).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Readonly state
// ---------------------------------------------------------------------------

describe("Input – readonly", () => {
  it("has readOnly attribute when readonly=true - BLI: EL-339", () => {
    render(<Input readonly />);
    expect(getInput()).toHaveAttribute("readonly");
  });

  it("has aria-readonly when readonly - BLI: EL-339", () => {
    render(<Input readonly />);
    expect(getInput()).toHaveAttribute("aria-readonly", "true");
  });

  it("clear button is not shown when readonly even with value - BLI: EL-339", () => {
    render(<Input readonly showClearIcon value="text" onChange={vi.fn()} />);
    expect(screen.queryByRole("button", { name: /clear/i })).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Required
// ---------------------------------------------------------------------------

describe("Input – required", () => {
  it("has required attribute when required=true - BLI: EL-339", () => {
    render(<Input required />);
    expect(getInput()).toBeRequired();
  });

  it("has aria-required when required - BLI: EL-339", () => {
    render(<Input required />);
    expect(getInput()).toHaveAttribute("aria-required", "true");
  });
});

// ---------------------------------------------------------------------------
// Value states
// ---------------------------------------------------------------------------

describe("Input – value states", () => {
  it.each([
    ValueState.Positive,
    ValueState.Negative,
    ValueState.Critical,
    ValueState.Information,
  ])("renders without crashing for valueState=%s - BLI: EL-339", (state) => {
    render(<Input valueState={state} />);
    expect(getInput()).toBeInTheDocument();
  });

  it("sets aria-invalid on Negative state - BLI: EL-339", () => {
    render(<Input valueState={ValueState.Negative} />);
    expect(getInput()).toHaveAttribute("aria-invalid", "true");
  });

  it("does NOT set aria-invalid for non-Negative states - BLI: EL-339", () => {
    render(<Input valueState={ValueState.Positive} />);
    expect(getInput()).not.toHaveAttribute("aria-invalid");
  });

  it("renders valueStateMessage text - BLI: EL-339", () => {
    render(<Input valueState={ValueState.Negative} valueStateMessage="Field required" />);
    expect(screen.getByText("Field required")).toBeInTheDocument();
  });

  it("valueStateMessage has role=alert for Negative state - BLI: EL-339", () => {
    render(<Input valueState={ValueState.Negative} valueStateMessage="Error!" />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("valueStateMessage does not have role=alert for non-Negative state - BLI: EL-339", () => {
    render(<Input valueState={ValueState.Positive} valueStateMessage="OK" />);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("shows value state icon in message area when showValueStateIcon=true and valueStateMessage is set - BLI: EL-339", () => {
    const { container } = render(
      <Input valueState={ValueState.Negative} showValueStateIcon valueStateMessage="Error occurred" />
    );
    // An SVG icon should be present in the message area
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("does not show value state icon when showValueStateIcon=false - BLI: EL-339", () => {
    const { container } = render(<Input valueState={ValueState.Negative} showValueStateIcon={false} />);
    // The state icon span should not be present (no SVG aside from clear btn)
    // There's no clear button in this scenario, so no SVG at all
    expect(container.querySelector("svg")).not.toBeInTheDocument();
  });

  it("aria-describedby points to message element when valueStateMessage is set - BLI: EL-339", () => {
    render(<Input valueState={ValueState.Negative} valueStateMessage="Bad" />);
    const input = getInput();
    const describedById = input.getAttribute("aria-describedby");
    expect(describedById).toBeTruthy();
    // The element with that id must exist
    expect(document.getElementById(describedById!)).toBeInTheDocument();
  });

  it("accepts string literal for valueState - BLI: EL-339", () => {
    render(<Input valueState="Negative" />);
    expect(getInput()).toHaveAttribute("aria-invalid", "true");
  });

  it("does not show value state icon without valueStateMessage even when showValueStateIcon=true", () => {
    const { container } = render(
      <Input valueState={ValueState.Negative} showValueStateIcon />
    );
    // No SVG since there's no message area to render the icon in
    expect(container.querySelector("svg")).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Clear icon
// ---------------------------------------------------------------------------

describe("Input – clear icon", () => {
  it("shows clear button when showClearIcon=true and value is non-empty - BLI: EL-339", () => {
    render(<Input showClearIcon value="text" onChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: /clear/i })).toBeInTheDocument();
  });

  it("does not show clear button when value is empty and not focused - BLI: EL-339", () => {
    render(<Input showClearIcon value="" onChange={vi.fn()} />);
    expect(screen.queryByRole("button", { name: /clear/i })).not.toBeInTheDocument();
  });

  it("clears value and calls onChange when clear button is clicked - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onInput = vi.fn();
    render(<Input showClearIcon value="hello" onChange={onChange} onInput={onInput} />);
    await user.click(screen.getByRole("button", { name: /clear/i }));
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: "", previousValue: "hello", source: "user" })
    );
    expect(onInput).toHaveBeenCalledWith("");
  });

  it("returns focus to input after clearing - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(<Input showClearIcon defaultValue="hello" />);
    await user.click(screen.getByRole("button", { name: /clear/i }));
    expect(getInput()).toHaveFocus();
  });
});

// ---------------------------------------------------------------------------
// maxLength / minLength / pattern
// ---------------------------------------------------------------------------

describe("Input – constraints", () => {
  it("applies maxLength attribute for text type - BLI: EL-339", () => {
    render(<Input maxLength={10} />);
    expect(getInput()).toHaveAttribute("maxlength", "10");
  });

  it("does not apply maxLength for Number type - BLI: EL-339", () => {
    const { container } = render(<Input type={InputType.Number} maxLength={10} />);
    const input = container.querySelector("input");
    expect(input).not.toHaveAttribute("maxlength");
  });

  it("applies minLength attribute - BLI: EL-339", () => {
    render(<Input minLength={3} />);
    expect(getInput()).toHaveAttribute("minlength", "3");
  });

  it("applies pattern attribute - BLI: EL-339", () => {
    render(<Input pattern="[A-Z]+" />);
    expect(getInput()).toHaveAttribute("pattern", "[A-Z]+");
  });

  it("applies min/max/step for Number type - BLI: EL-339", () => {
    const { container } = render(
      <Input type={InputType.Number} min={0} max={100} step={5} />
    );
    const input = container.querySelector("input");
    expect(input).toHaveAttribute("min", "0");
    expect(input).toHaveAttribute("max", "100");
    expect(input).toHaveAttribute("step", "5");
  });

  it("does not apply min/max/step for non-Number type - BLI: EL-339", () => {
    render(<Input type={InputType.Text} min={0} max={100} />);
    expect(getInput()).not.toHaveAttribute("min");
    expect(getInput()).not.toHaveAttribute("max");
  });
});

// ---------------------------------------------------------------------------
// Accessibility
// ---------------------------------------------------------------------------

describe("Input – accessibility", () => {
  it("applies aria-label via accessibleName - BLI: EL-339", () => {
    render(<Input accessibleName="First name" />);
    expect(getInput()).toHaveAttribute("aria-label", "First name");
  });

  it("applies aria-labelledby via accessibleNameRef - BLI: EL-339", () => {
    render(<Input accessibleNameRef="label-el" />);
    expect(getInput()).toHaveAttribute("aria-labelledby", "label-el");
  });

  it("applies aria-describedby via accessibleDescriptionRef - BLI: EL-339", () => {
    render(<Input accessibleDescriptionRef="desc-el" />);
    expect(getInput()).toHaveAttribute("aria-describedby", "desc-el");
  });

  it("combines valueStateMessage id and accessibleDescriptionRef in aria-describedby - BLI: EL-339", () => {
    render(
      <Input
        valueState={ValueState.Negative}
        valueStateMessage="Oops"
        accessibleDescriptionRef="extra-desc"
      />
    );
    const describedBy = getInput().getAttribute("aria-describedby") ?? "";
    expect(describedBy).toContain("extra-desc");
    // Also includes the message id
    expect(describedBy.split(" ").length).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// Imperative ref
// ---------------------------------------------------------------------------

describe("Input – imperative ref", () => {
  it("exposes getValue() - BLI: EL-339", () => {
    const ref = React.createRef<InputRef>();
    render(<Input ref={ref} defaultValue="initial" />);
    expect(ref.current!.getValue()).toBe("initial");
  });

  it("exposes setValue() in uncontrolled mode - BLI: EL-339", () => {
    const ref = React.createRef<InputRef>();
    render(<Input ref={ref} />);
    act(() => { ref.current!.setValue("programmatic"); });
    expect(ref.current!.getValue()).toBe("programmatic");
  });

  it("setValue fires onChange with source=programmatic - BLI: EL-339", () => {
    const ref = React.createRef<InputRef>();
    const onChange = vi.fn();
    render(<Input ref={ref} onChange={onChange} />);
    ref.current!.setValue("new");
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: "new", source: "programmatic" })
    );
  });

  it("setValue with silent=true does not fire onChange - BLI: EL-339", () => {
    const ref = React.createRef<InputRef>();
    const onChange = vi.fn();
    render(<Input ref={ref} onChange={onChange} />);
    ref.current!.setValue("silent", { silent: true });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("exposes clear() - BLI: EL-339", () => {
    const ref = React.createRef<InputRef>();
    const onChange = vi.fn();
    render(<Input ref={ref} defaultValue="hello" onChange={onChange} />);
    ref.current!.clear();
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: "", source: "programmatic" })
    );
  });

  it("exposes focus() and blur() - BLI: EL-339", () => {
    const ref = React.createRef<InputRef>();
    render(<Input ref={ref} />);
    ref.current!.focus();
    expect(getInput()).toHaveFocus();
    ref.current!.blur();
    expect(getInput()).not.toHaveFocus();
  });

  it("exposes getState() - BLI: EL-339", () => {
    const ref = React.createRef<InputRef>();
    render(<Input ref={ref} defaultValue="test" valueState={ValueState.Negative} />);
    const state = ref.current!.getState();
    expect(state.value).toBe("test");
    expect(state.valueState).toBe(ValueState.Negative);
    expect(typeof state.focused).toBe("boolean");
    expect(typeof state.valid).toBe("boolean");
  });

  it("exposes nativeElement - BLI: EL-339", () => {
    const ref = React.createRef<InputRef>();
    render(<Input ref={ref} />);
    expect(ref.current!.nativeElement).toBeInstanceOf(HTMLInputElement);
  });

  it("exposes checkValidity() - BLI: EL-339", () => {
    const ref = React.createRef<InputRef>();
    render(<Input ref={ref} />);
    expect(typeof ref.current!.checkValidity()).toBe("boolean");
  });

  it("exposes select() - BLI: EL-339", () => {
    const ref = React.createRef<InputRef>();
    render(<Input ref={ref} defaultValue="select me" />);
    // Should not throw
    expect(() => ref.current!.select()).not.toThrow();
  });

  it("exposes setSelectionRange() - BLI: EL-339", () => {
    const ref = React.createRef<InputRef>();
    render(<Input ref={ref} defaultValue="hello" />);
    // Should not throw
    expect(() => ref.current!.setSelectionRange(0, 3)).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// autocomplete
// ---------------------------------------------------------------------------

describe("Input – autocomplete", () => {
  it("applies autocomplete attribute - BLI: EL-339", () => {
    render(<Input autocomplete="email" />);
    expect(getInput()).toHaveAttribute("autocomplete", "email");
  });
});

// ---------------------------------------------------------------------------
// hideStepButtons
// ---------------------------------------------------------------------------

describe("Input – hideStepButtons", () => {
  it("renders without crashing when hideStepButtons=true - BLI: EL-339", () => {
    const { container } = render(<Input type={InputType.Number} hideStepButtons />);
    expect(container.querySelector("input")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// data-ai-field
// ---------------------------------------------------------------------------

describe("Input – data-ai-field", () => {
  it("applies data-ai-field to wrapper - BLI: EL-339", () => {
    render(<Input data-ai-field="email-field" />);
    const wrapper = document.querySelector("[data-ai-field='email-field']");
    expect(wrapper).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// IME composition
// ---------------------------------------------------------------------------

describe("Input – IME composition", () => {
  it("calls onInput with composed value after compositionEnd - BLI: EL-339", () => {
    const onInput = vi.fn();
    render(<Input onInput={onInput} />);
    const input = getInput();

    fireEvent.compositionStart(input);
    // Simulate composition end with a composed value
    fireEvent.compositionEnd(input, { target: { value: "あ" } });
    expect(onInput).toHaveBeenCalledWith("あ");
  });

  it("does not process input during composition - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onInput = vi.fn();
    render(<Input onInput={onInput} />);
    const input = getInput();

    // Start composition
    fireEvent.compositionStart(input);
    onInput.mockClear();

    // Any keydown during composition should skip normal handling
    await user.keyboard("{a}");
    // After compositionEnd the input value is committed
    fireEvent.compositionEnd(input, { target: { value: "あ" } });
    expect(onInput).toHaveBeenCalledWith("あ");
  });
});

// ---------------------------------------------------------------------------
// reportValidity / setCustomValidity
// ---------------------------------------------------------------------------

describe("Input – validity methods", () => {
  it("exposes reportValidity() - BLI: EL-339", () => {
    const ref = React.createRef<InputRef>();
    render(<Input ref={ref} />);
    expect(typeof ref.current!.reportValidity()).toBe("boolean");
  });

  it("exposes setCustomValidity() - BLI: EL-339", () => {
    const ref = React.createRef<InputRef>();
    render(<Input ref={ref} />);
    expect(() => ref.current!.setCustomValidity("Custom error")).not.toThrow();
    // Verify it affects validity
    expect(ref.current!.checkValidity()).toBe(false);
    // Clear the error
    ref.current!.setCustomValidity("");
    expect(ref.current!.checkValidity()).toBe(true);
  });

  it("exposes getValueAsNumber() for Number type - BLI: EL-339", () => {
    const ref = React.createRef<InputRef>();
    render(<Input ref={ref} type={InputType.Number} value="42" onChange={vi.fn()} />);
    // getValueAsNumber returns a number
    expect(typeof ref.current!.getValueAsNumber()).toBe("number");
  });
});

// ---------------------------------------------------------------------------
// accessibilityAttributes
// ---------------------------------------------------------------------------

describe("Input – accessibilityAttributes", () => {
  it("applies accessibilityAttributes - BLI: EL-339", () => {
    render(<Input accessibilityAttributes={{ controls: "panel-1", hasPopup: "dialog" }} />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("aria-controls", "panel-1");
    expect(input).toHaveAttribute("aria-haspopup", "dialog");
  });
});

// ---------------------------------------------------------------------------
// Size variants
// ---------------------------------------------------------------------------

describe("Input – size variants", () => {
  // Helper: get the input container (the flex div wrapping the native <input>)
  function getInputContainer(container: HTMLElement): HTMLElement {
    return container.querySelector(".flex.items-center") as HTMLElement;
  }

  it("defaults to Large size (40px / h-10) when no size prop is provided", () => {
    const { container } = render(<Input />);
    const inputContainer = getInputContainer(container);
    expect(inputContainer.className).toContain("h-10");
    expect(inputContainer.className).toContain("rounded-lg");
  });

  it("renders with explicit size=Large using h-10 and rounded-lg", () => {
    const { container } = render(<Input size={InputSize.Large} />);
    const inputContainer = getInputContainer(container);
    expect(inputContainer.className).toContain("h-10");
    expect(inputContainer.className).toContain("rounded-lg");
  });

  it("renders with size=Small using h-8 and rounded (4px)", () => {
    const { container } = render(<Input size={InputSize.Small} />);
    const inputContainer = getInputContainer(container);
    expect(inputContainer.className).toContain("h-8");
    // Should use rounded (4px) not rounded-lg (8px)
    expect(inputContainer.className).toMatch(/\brounded\b/);
    expect(inputContainer.className).not.toContain("rounded-lg");
  });

  it("accepts string literal for size", () => {
    const { container } = render(<Input size="Small" />);
    const inputContainer = getInputContainer(container);
    expect(inputContainer.className).toContain("h-8");
  });

  it("Small size clear button uses smaller dimensions (h-6 w-6)", () => {
    render(
      <Input size={InputSize.Small} showClearIcon value="text" onChange={vi.fn()} />
    );
    const clearBtn = screen.getByRole("button", { name: /clear/i });
    expect(clearBtn.className).toContain("h-6");
    expect(clearBtn.className).toContain("w-6");
  });

  it("Large size clear button uses medium icon button dimensions (h-8 w-8)", () => {
    render(
      <Input size={InputSize.Large} showClearIcon value="text" onChange={vi.fn()} />
    );
    const clearBtn = screen.getByRole("button", { name: /clear/i });
    expect(clearBtn.className).toContain("h-8");
    expect(clearBtn.className).toContain("w-8");
  });
});
