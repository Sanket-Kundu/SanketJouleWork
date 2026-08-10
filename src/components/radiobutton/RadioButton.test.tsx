import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { RadioButton } from "./RadioButton";
import {
  RadioButtonValueState,
  RadioButtonWrappingType,
} from "../../types/radiobutton";
import type { RadioButtonRef } from "../../types/radiobutton";

describe("RadioButton", () => {
  // --- Rendering ---

  it("renders a radio input - BLI: EL-339", () => {
    render(<RadioButton text="Option A" />);
    expect(screen.getByRole("radio")).toBeInTheDocument();
  });

  it("renders text label - BLI: EL-339", () => {
    render(<RadioButton text="Option A" />);
    expect(screen.getByText("Option A")).toBeInTheDocument();
  });

  it("renders children as label - BLI: EL-339", () => {
    render(<RadioButton><span>Custom label</span></RadioButton>);
    expect(screen.getByText("Custom label")).toBeInTheDocument();
  });

  it("children takes precedence over text prop when both provided - BLI: EL-339", () => {
    render(<RadioButton text="Text prop"><span>Children content</span></RadioButton>);
    // children ?? text — children wins
    expect(screen.getByText("Children content")).toBeInTheDocument();
    expect(screen.queryByText("Text prop")).not.toBeInTheDocument();
  });

  it("renders unchecked by default - BLI: EL-339", () => {
    render(<RadioButton text="A" />);
    expect(screen.getByRole("radio")).not.toBeChecked();
  });

  it("renders checked when defaultChecked=true - BLI: EL-339", () => {
    render(<RadioButton text="A" defaultChecked />);
    expect(screen.getByRole("radio")).toBeChecked();
  });

  it("applies data-testid to the label element - BLI: EL-339", () => {
    render(<RadioButton text="A" data-testid="rb-1" />);
    expect(screen.getByTestId("rb-1")).toBeInTheDocument();
  });

  it("applies provided id to the hidden input - BLI: EL-339", () => {
    const { container } = render(<RadioButton text="A" id="radio-a" />);
    const input = container.querySelector('input[type="radio"]');
    expect(input).toHaveAttribute("id", "radio-a");
  });

  it("applies custom className to root wrapper - BLI: EL-339", () => {
    render(<RadioButton text="A" className="custom-rb" />);
    expect(screen.getByRole("radio").className).toContain("custom-rb");
  });

  it("applies inline style to root wrapper - BLI: EL-339", () => {
    render(<RadioButton text="A" style={{ opacity: 0.5 }} />);
    expect(screen.getByRole("radio")).toHaveStyle({ opacity: "0.5" });
  });

  // --- Controlled ---

  it("renders controlled checked=true - BLI: EL-339", () => {
    render(<RadioButton text="A" checked={true} onChange={() => {}} />);
    expect(screen.getByRole("radio")).toBeChecked();
  });

  it("renders controlled checked=false - BLI: EL-339", () => {
    render(<RadioButton text="A" checked={false} onChange={() => {}} />);
    expect(screen.getByRole("radio")).not.toBeChecked();
  });

  it("does not update state when controlled and clicked - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(<RadioButton text="A" checked={false} onChange={() => {}} />);

    await user.click(screen.getByRole("radio"));
    expect(screen.getByRole("radio")).not.toBeChecked();
  });

  it("calls onChange with checked=true in controlled mode - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<RadioButton text="A" value="alpha" checked={false} onChange={handleChange} />);

    await user.click(screen.getByRole("radio"));
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({ checked: true, value: "alpha" })
    );
  });

  // --- Uncontrolled ---

  it("toggles to checked on click (uncontrolled) - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<RadioButton text="A" value="a" onChange={handleChange} />);

    await user.click(screen.getByRole("radio"));

    expect(screen.getByRole("radio")).toBeChecked();
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({ checked: true, value: "a" })
    );
  });

  it("onChange passes originalEvent - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<RadioButton text="A" onChange={handleChange} />);

    await user.click(screen.getByRole("radio"));
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({ originalEvent: expect.any(Object) })
    );
  });

  // --- Disabled ---

  it("is disabled when disabled=true - BLI: EL-339", () => {
    render(<RadioButton text="A" disabled />);
    expect(screen.getByRole("radio")).toHaveAttribute("aria-disabled", "true");
  });

  it("does not change state when disabled and clicked - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<RadioButton text="A" disabled onChange={handleChange} />);

    await user.click(screen.getByRole("radio"));
    expect(handleChange).not.toHaveBeenCalled();
  });

  // --- Readonly ---

  it("is readonly when readonly=true - BLI: EL-339", () => {
    render(<RadioButton text="A" readonly />);
    expect(screen.getByRole("radio")).not.toHaveAttribute("aria-readonly");
  });

  it("keeps the hidden input outside the interactive radio container - BLI: EL-339", () => {
    const { container } = render(<RadioButton text="A" />);
    const radio = screen.getByRole("radio");
    const input = container.querySelector('input[type="radio"]');

    expect(input).toBeInTheDocument();
    expect(radio.querySelector('input[type="radio"]')).toBeNull();
  });

  it("does not change state when readonly and clicked - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<RadioButton text="A" readonly onChange={handleChange} />);

    await user.click(screen.getByRole("radio"));
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("does not fire onChange for Enter when readonly - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<RadioButton text="A" readonly onChange={handleChange} />);

    screen.getByRole("radio").focus();
    await user.keyboard("{Enter}");
    expect(handleChange).not.toHaveBeenCalled();
  });

  // --- Keyboard ---

  it("selects on Space key (handled natively) - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<RadioButton text="A" onChange={handleChange} />);

    screen.getByRole("radio").focus();
    await user.keyboard(" ");
    expect(handleChange).toHaveBeenCalledOnce();
  });

  it("selects on Enter key - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<RadioButton text="A" onChange={handleChange} />);

    screen.getByRole("radio").focus();
    await user.keyboard("{Enter}");
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({ checked: true })
    );
  });

  it("does not fire onChange on Enter when already checked - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<RadioButton text="A" defaultChecked onChange={handleChange} />);

    screen.getByRole("radio").focus();
    await user.keyboard("{Enter}");
    // already checked, Enter handler bails out
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("does not fire onChange on Enter when disabled - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<RadioButton text="A" disabled onChange={handleChange} />);

    screen.getByRole("radio").focus();
    await user.keyboard("{Enter}");
    expect(handleChange).not.toHaveBeenCalled();
  });

  // --- Required ---

  it("sets aria-required when required - BLI: EL-339", () => {
    render(<RadioButton text="A" required />);
    expect(screen.getByRole("radio")).toHaveAttribute("aria-required", "true");
  });

  it("renders required indicator asterisk in label - BLI: EL-339", () => {
    render(<RadioButton text="Option" required />);
    // the CSS after:content-['*'] is on the span; we can verify it has the required class
    const labelSpan = screen.getByText("Option");
    expect(labelSpan.className).toContain("after:content-['*']");
  });

  // --- Accessibility ---

  it("applies accessibleName as aria-label - BLI: EL-339", () => {
    render(<RadioButton accessibleName="Choose A" />);
    expect(screen.getByRole("radio")).toHaveAttribute("aria-label", "Choose A");
  });

  it("applies accessibleNameRef as aria-labelledby - BLI: EL-339", () => {
    render(<RadioButton accessibleNameRef="label-id" />);
    expect(screen.getByRole("radio")).toHaveAttribute("aria-labelledby", "label-id");
  });

  it("sets aria-invalid for Negative valueState - BLI: EL-339", () => {
    render(<RadioButton text="A" valueState={RadioButtonValueState.Negative} />);
    expect(screen.getByRole("radio")).toHaveAttribute("aria-invalid", "true");
  });

  it("does NOT set aria-invalid for non-Negative valueStates - BLI: EL-339", () => {
    render(<RadioButton text="A" valueState={RadioButtonValueState.Positive} />);
    expect(screen.getByRole("radio")).not.toHaveAttribute("aria-invalid", "true");
  });

  it("renders valueStateMessage as hidden description - BLI: EL-339", () => {
    render(
      <RadioButton
        text="A"
        valueState={RadioButtonValueState.Negative}
        valueStateMessage="This field is required"
      />
    );
    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  it("does not render valueStateMessage when valueState is None - BLI: EL-339", () => {
    render(
      <RadioButton
        text="A"
        valueState={RadioButtonValueState.None}
        valueStateMessage="Hidden message"
      />
    );
    expect(screen.queryByText("Hidden message")).not.toBeInTheDocument();
  });

  it("renders accessibleDescription in hidden span - BLI: EL-339", () => {
    render(<RadioButton text="A" accessibleDescription="Extra detail" />);
    expect(screen.getByText("Extra detail")).toBeInTheDocument();
  });

  it("links aria-describedby to valueStateMessage - BLI: EL-339", () => {
    render(
      <RadioButton
        id="rb-desc"
        text="A"
        valueState={RadioButtonValueState.Critical}
        valueStateMessage="Warning!"
      />
    );
    const input = screen.getByRole("radio");
    const describedBy = input.getAttribute("aria-describedby");
    expect(describedBy).toContain("rb-desc-description");
  });

  it("links aria-describedby to accessibleDescription - BLI: EL-339", () => {
    render(
      <RadioButton id="rb-desc2" text="A" accessibleDescription="Some detail" />
    );
    const input = screen.getByRole("radio");
    const describedBy = input.getAttribute("aria-describedby");
    expect(describedBy).toContain("rb-desc2-desc-text");
  });

  // --- Value states ---

  it.each([
    RadioButtonValueState.Positive,
    RadioButtonValueState.Negative,
    RadioButtonValueState.Critical,
    RadioButtonValueState.Information,
  ])("renders with valueState=%s without crashing - BLI: EL-339", (valueState) => {
    render(<RadioButton text="A" valueState={valueState} />);
    expect(screen.getByRole("radio")).toBeInTheDocument();
  });

  it.each([
    RadioButtonValueState.Positive,
    RadioButtonValueState.Negative,
    RadioButtonValueState.Critical,
    RadioButtonValueState.Information,
  ])("renders checked with valueState=%s without crashing - BLI: EL-339", (valueState) => {
    render(<RadioButton text="A" valueState={valueState} defaultChecked />);
    expect(screen.getByRole("radio")).toBeChecked();
  });

  it.each([
    [RadioButtonValueState.Negative, "Invalid entry"],
    [RadioButtonValueState.Critical, "Warning issued"],
    [RadioButtonValueState.Positive, "Entry successfully validated"],
    [RadioButtonValueState.Information, "Informative entry"],
  ])("renders default value state text for %s - BLI: EL-339", (valueState, expectedText) => {
    render(<RadioButton text="A" valueState={valueState} />);
    expect(screen.getByText(expectedText)).toBeInTheDocument();
  });

  it("uses custom valueStateMessage over default text - BLI: EL-339", () => {
    render(
      <RadioButton
        text="A"
        valueState={RadioButtonValueState.Negative}
        valueStateMessage="Custom error message"
      />
    );
    expect(screen.getByText("Custom error message")).toBeInTheDocument();
    expect(screen.queryByText("Invalid entry")).not.toBeInTheDocument();
  });

  it("sets aria-describedby for value state without custom message - BLI: EL-339", () => {
    render(
      <RadioButton
        id="rb-vs"
        text="A"
        valueState={RadioButtonValueState.Negative}
      />
    );
    const radio = screen.getByRole("radio");
    expect(radio).toHaveAttribute("aria-describedby", expect.stringContaining("rb-vs-description"));
  });

  // --- Form integration ---

  it("applies name to hidden input - BLI: EL-339", () => {
    const { container } = render(<RadioButton text="A" name="group1" />);
    const input = container.querySelector('input[type="radio"]');
    expect(input).toHaveAttribute("name", "group1");
  });

  it("applies value to hidden input - BLI: EL-339", () => {
    const { container } = render(<RadioButton text="A" value="option-a" />);
    const input = container.querySelector('input[type="radio"]');
    expect(input).toHaveAttribute("value", "option-a");
  });

  it("groups radio buttons by name (controlled) - BLI: EL-339", async () => {
    const user = userEvent.setup();
    // Use controlled mode so selecting B correctly un-checks A
    const onChange = vi.fn();
    const { rerender } = render(
      <>
        <RadioButton text="A" name="group" value="a" checked={true} onChange={onChange} />
        <RadioButton text="B" name="group" value="b" checked={false} onChange={onChange} />
      </>
    );

    const [radioA, radioB] = screen.getAllByRole("radio");
    expect(radioA).toBeChecked();
    expect(radioB).not.toBeChecked();

    // Clicking B fires onChange for B
    await user.click(radioB);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ checked: true, value: "b" })
    );

    // Simulate the controlled parent updating: A unchecked, B checked
    rerender(
      <>
        <RadioButton text="A" name="group" value="a" checked={false} onChange={onChange} />
        <RadioButton text="B" name="group" value="b" checked={true} onChange={onChange} />
      </>
    );

    const [updatedA, updatedB] = screen.getAllByRole("radio");
    expect(updatedA).not.toBeChecked();
    expect(updatedB).toBeChecked();
  });

  it("moves to the next radio in a group on ArrowRight - BLI: EL-339", async () => {
    const user = userEvent.setup();

    render(
      <>
        <RadioButton text="A" name="group-nav" defaultChecked />
        <RadioButton text="B" name="group-nav" />
        <RadioButton text="C" name="group-nav" />
      </>
    );

    const [radioA, radioB, radioC] = screen.getAllByRole("radio");

    radioA.focus();
    await user.keyboard("{ArrowRight}");

    expect(radioB).toHaveFocus();
    expect(radioA).not.toBeChecked();
    expect(radioB).toBeChecked();
    expect(radioC).not.toBeChecked();
  });

  it("wraps to the first radio in a group on ArrowDown from the last item - BLI: EL-339", async () => {
    const user = userEvent.setup();

    render(
      <>
        <RadioButton text="A" name="group-wrap-next" />
        <RadioButton text="B" name="group-wrap-next" />
        <RadioButton text="C" name="group-wrap-next" defaultChecked />
      </>
    );

    const [radioA, radioB, radioC] = screen.getAllByRole("radio");

    radioC.focus();
    await user.keyboard("{ArrowDown}");

    expect(radioA).toHaveFocus();
    expect(radioA).toBeChecked();
    expect(radioB).not.toBeChecked();
    expect(radioC).not.toBeChecked();
  });

  it("wraps to the last radio in a group on ArrowUp from the first item - BLI: EL-339", async () => {
    const user = userEvent.setup();

    render(
      <>
        <RadioButton text="A" name="group-wrap-prev" defaultChecked />
        <RadioButton text="B" name="group-wrap-prev" />
        <RadioButton text="C" name="group-wrap-prev" />
      </>
    );

    const [radioA, radioB, radioC] = screen.getAllByRole("radio");

    radioA.focus();
    await user.keyboard("{ArrowUp}");

    expect(radioC).toHaveFocus();
    expect(radioA).not.toBeChecked();
    expect(radioB).not.toBeChecked();
    expect(radioC).toBeChecked();
  });

  // --- WrappingType ---

  it("truncates label with wrappingType=None - BLI: EL-339", () => {
    render(<RadioButton text="Long label text" wrappingType={RadioButtonWrappingType.None} />);
    const labelSpan = screen.getByText("Long label text");
    expect(labelSpan.className).toContain("truncate");
  });

  it("wraps label with wrappingType=Normal (default) - BLI: EL-339", () => {
    render(<RadioButton text="Normal wrapping text" wrappingType={RadioButtonWrappingType.Normal} />);
    const labelSpan = screen.getByText("Normal wrapping text");
    expect(labelSpan.className).toContain("break-words");
  });

  it("accepts wrappingType as string value 'None' - BLI: EL-339", () => {
    render(<RadioButton text="A" wrappingType="None" />);
    expect(screen.getByText("A").className).toContain("truncate");
  });

  // --- No label ---

  it("renders without any label when text and children are omitted - BLI: EL-339", () => {
    render(<RadioButton />);
    expect(screen.getByRole("radio")).toBeInTheDocument();
  });

  // --- tabIndex ---

  it("uses tabIndex=0 by default - BLI: EL-339", () => {
    render(<RadioButton text="A" />);
    expect(screen.getByRole("radio")).toHaveAttribute("tabindex", "0");
  });

  it("applies custom tabIndex - BLI: EL-339", () => {
    render(<RadioButton text="A" tabIndex={-1} />);
    expect(screen.getByRole("radio")).toHaveAttribute("tabindex", "-1");
  });

  // --- Focus / Blur events ---

  it("calls onFocus when radio receives focus - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onFocus = vi.fn();
    render(<RadioButton text="A" onFocus={onFocus} />);

    await user.tab();
    expect(onFocus).toHaveBeenCalledOnce();
  });

  it("calls onBlur when radio loses focus - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onBlur = vi.fn();
    render(<RadioButton text="A" onBlur={onBlur} />);

    await user.tab();
    await user.tab();
    expect(onBlur).toHaveBeenCalledOnce();
  });

  // --- Ref (imperative handle) ---

  it("exposes focus/blur/isFocused/isChecked/nativeElement via ref - BLI: EL-339", () => {
    const ref = React.createRef<RadioButtonRef>();
    render(<RadioButton ref={ref} text="Ref test" />);

    expect(ref.current).not.toBeNull();
    expect(ref.current!.nativeElement).toBeInstanceOf(HTMLInputElement);
    expect(ref.current!.isChecked()).toBe(false);

    ref.current!.focus();
    expect(ref.current!.isFocused()).toBe(true);

    ref.current!.blur();
    expect(ref.current!.isFocused()).toBe(false);
  });

  it("ref.isChecked returns true when defaultChecked - BLI: EL-339", () => {
    const ref = React.createRef<RadioButtonRef>();
    render(<RadioButton ref={ref} text="Checked" defaultChecked />);

    expect(ref.current!.isChecked()).toBe(true);
  });

  it("ref.nativeElement is the hidden input - BLI: EL-339", () => {
    const ref = React.createRef<RadioButtonRef>();
    render(<RadioButton ref={ref} text="Native" />);

    expect(ref.current!.nativeElement).toBeInstanceOf(HTMLInputElement);
  });

  it("sets aria-describedby with accessibleDescriptionRef - BLI: EL-339", () => {
    render(
      <>
        <span id="ext-desc">External description</span>
        <RadioButton text="Option A" accessibleDescriptionRef="ext-desc" />
      </>
    );
    const radio = screen.getByRole("radio");
    expect(radio).toHaveAttribute("aria-describedby", expect.stringContaining("ext-desc"));
  });

});
