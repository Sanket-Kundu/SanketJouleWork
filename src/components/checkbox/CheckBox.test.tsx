import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { CheckBox } from "./CheckBox";
import type { CheckBoxRef } from "../../types/checkbox";

describe("CheckBox", () => {
  // --- Rendering ---

  it("renders with text label - BLI: EL-339", () => {
    render(<CheckBox text="Accept terms" />);
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
    expect(screen.getByText("Accept terms")).toBeInTheDocument();
  });

  it("renders with children as label - BLI: EL-339", () => {
    render(<CheckBox><span>Custom label</span></CheckBox>);
    expect(screen.getByText("Custom label")).toBeInTheDocument();
  });

  it("renders unchecked by default - BLI: EL-339", () => {
    render(<CheckBox text="Test" />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-checked", "false");
  });

  it("renders checked when defaultChecked - BLI: EL-339", () => {
    render(<CheckBox text="Test" defaultChecked />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-checked", "true");
  });

  it("applies data-testid - BLI: EL-339", () => {
    render(<CheckBox text="Test" data-testid="cb" />);
    expect(screen.getByTestId("cb")).toBeInTheDocument();
  });

  // --- Controlled ---

  it("renders controlled checked state - BLI: EL-339", () => {
    render(<CheckBox text="Test" checked={true} />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-checked", "true");
  });

  it("renders controlled unchecked state - BLI: EL-339", () => {
    render(<CheckBox text="Test" checked={false} />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-checked", "false");
  });

  // --- Indeterminate ---

  it("renders indeterminate state as mixed - BLI: EL-339", () => {
    render(<CheckBox text="Test" indeterminate />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-checked", "mixed");
  });

  // --- Click Toggle ---

  it("toggles on click (uncontrolled) - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<CheckBox text="Toggle" onChange={handleChange} />);

    await user.click(screen.getByRole("checkbox"));
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({ checked: true, indeterminate: false })
    );
  });

  it("calls onChange with checked=false when unchecking - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<CheckBox text="Toggle" defaultChecked onChange={handleChange} />);

    await user.click(screen.getByRole("checkbox"));
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({ checked: false })
    );
  });

  // --- Disabled ---

  it("is not toggleable when disabled - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<CheckBox text="Disabled" disabled onChange={handleChange} />);

    await user.click(screen.getByRole("checkbox"));
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("has aria-disabled when disabled - BLI: EL-339", () => {
    render(<CheckBox text="Test" disabled />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-disabled", "true");
  });

  it("has tabIndex=-1 when disabled - BLI: EL-339", () => {
    render(<CheckBox text="Test" disabled />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("tabindex", "-1");
  });

  // --- Readonly ---

  it("is not toggleable when readonly - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<CheckBox text="Readonly" readonly onChange={handleChange} />);

    await user.click(screen.getByRole("checkbox"));
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("has aria-readonly when readonly - BLI: EL-339", () => {
    render(<CheckBox text="Test" readonly />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-readonly", "true");
  });

  // --- DisplayOnly ---

  it("is not toggleable when displayOnly - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<CheckBox text="Display" displayOnly onChange={handleChange} />);

    await user.click(screen.getByRole("checkbox"));
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("has tabIndex=-1 when displayOnly - BLI: EL-339", () => {
    render(<CheckBox text="Test" displayOnly />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("tabindex", "-1");
  });

  // --- Keyboard ---

  it("toggles on Space key - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<CheckBox text="KB" onChange={handleChange} />);

    screen.getByRole("checkbox").focus();
    await user.keyboard(" ");
    expect(handleChange).toHaveBeenCalledOnce();
  });

  it("toggles on Enter key - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<CheckBox text="KB" onChange={handleChange} />);

    screen.getByRole("checkbox").focus();
    await user.keyboard("{Enter}");
    expect(handleChange).toHaveBeenCalledOnce();
  });

  it("does not toggle on keyboard when disabled - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<CheckBox text="KB" disabled onChange={handleChange} />);

    screen.getByRole("checkbox").focus();
    await user.keyboard(" ");
    expect(handleChange).not.toHaveBeenCalled();
  });

  // --- Accessibility ---

  it("applies accessibleName as aria-label - BLI: EL-339", () => {
    render(<CheckBox accessibleName="Accept" />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-label", "Accept");
  });

  it("applies accessibleNameRef as aria-labelledby - BLI: EL-339", () => {
    render(<CheckBox accessibleNameRef="label-1" />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-labelledby", "label-1");
  });

  it("sets aria-required when required - BLI: EL-339", () => {
    render(<CheckBox text="Required" required />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-required", "true");
  });

  it("sets aria-invalid for Negative valueState - BLI: EL-339", () => {
    render(<CheckBox text="Error" valueState="Negative" />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("renders value state message as hidden description - BLI: EL-339", () => {
    render(<CheckBox text="Test" valueState="Negative" valueStateMessage="Error occurred" />);
    expect(screen.getByText("Error occurred")).toBeInTheDocument();
  });

  it("renders accessible description - BLI: EL-339", () => {
    render(<CheckBox text="Test" accessibleDescription="Extra info" />);
    expect(screen.getByText("Extra info")).toBeInTheDocument();
  });

  it("hides native input to avoid nested-interactive axe violation - BLI: EL-339", () => {
    const { container } = render(<CheckBox text="Test" name="agree" />);
    const input = container.querySelector("input[type='checkbox']") as HTMLElement;
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass("absolute", "size-0", "opacity-0", "pointer-events-none");
    expect(input).toHaveAttribute("aria-hidden", "true");
  });

  it("native input is not nested inside the role=checkbox element - BLI: EL-339", () => {
    const { container } = render(<CheckBox text="Test" name="agree" />);
    const roleCheckbox = screen.getByRole("checkbox");
    const input = container.querySelector("input[type='checkbox']") as HTMLElement;
    expect(input).toBeInTheDocument();
    expect(roleCheckbox.contains(input)).toBe(false);
  });

  it("places id on the role=checkbox div, not the hidden input - BLI: EL-339", () => {
    const { container } = render(<CheckBox text="Test" id="my-cb" />);
    const roleCheckbox = screen.getByRole("checkbox");
    expect(roleCheckbox).toHaveAttribute("id", "my-cb");
    const input = container.querySelector("input[type='checkbox']") as HTMLElement;
    expect(input).not.toHaveAttribute("id");
  });

  // --- Value States (border styling) ---

  it.each(["Positive", "Negative", "Critical", "Information"] as const)(
    "renders with valueState=%s",
    (valueState) => {
      render(<CheckBox text="Test" valueState={valueState} />);
      expect(screen.getByRole("checkbox")).toBeInTheDocument();
    }
  );

  it.each(["Positive", "Negative", "Critical", "Information"] as const)(
    "renders checked with valueState=%s",
    (valueState) => {
      render(<CheckBox text="Test" checked valueState={valueState} />);
      expect(screen.getByRole("checkbox")).toHaveAttribute("aria-checked", "true");
    }
  );

  // --- Form integration ---

  it("renders hidden input with name and value - BLI: EL-339", () => {
    const { container } = render(<CheckBox text="Test" name="agree" value="yes" />);
    const input = container.querySelector("input[type='checkbox']") as HTMLInputElement;
    expect(input).toHaveAttribute("name", "agree");
    expect(input).toHaveAttribute("value", "yes");
  });

  // --- Focus/Blur events ---

  it("calls onFocus and onBlur - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    render(<CheckBox text="Focus" onFocus={onFocus} onBlur={onBlur} />);

    await user.tab();
    expect(onFocus).toHaveBeenCalledOnce();
    await user.tab();
    expect(onBlur).toHaveBeenCalledOnce();
  });

  // --- Wrapping ---

  it("truncates label with wrappingType=None - BLI: EL-339", () => {
    render(<CheckBox text="Long text" wrappingType="None" />);
    const label = screen.getByText("Long text");
    expect(label.className).toContain("truncate");
  });

  // --- Custom tabIndex ---

  it("applies custom tabIndex - BLI: EL-339", () => {
    render(<CheckBox text="Test" tabIndex={5} />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("tabindex", "5");
  });

  // --- Ref ---

  it("exposes focus/blur/isFocused/isChecked/toggle via ref - BLI: EL-339", () => {
    const ref = React.createRef<CheckBoxRef>();
    const handleChange = vi.fn();
    render(<CheckBox ref={ref} text="Ref test" onChange={handleChange} />);

    expect(ref.current).not.toBeNull();
    expect(ref.current!.nativeElement).toBeInstanceOf(HTMLInputElement);
    expect(ref.current!.isChecked()).toBe(false);

    ref.current!.focus();
    expect(ref.current!.isFocused()).toBe(true);
    ref.current!.blur();
    expect(ref.current!.isFocused()).toBe(false);

    ref.current!.toggle();
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({ checked: true })
    );
  });

  // --- accessibilityAttributes ---

  it("applies accessibilityAttributes.describedBy - BLI: EL-339", () => {
    render(<CheckBox accessibilityAttributes={{ describedBy: "help-text" }} text="Accept" />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveAttribute("aria-describedby", expect.stringContaining("help-text"));
  });
});
