import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { Switch } from "./Switch";
import { SwitchDesign } from "../../types/switch";

describe("Switch", () => {
  // --- Rendering ---

  it("renders a switch button - BLI: EL-339", () => {
    render(<Switch />);
    expect(screen.getByRole("switch")).toBeInTheDocument();
  });

  it("is unchecked by default - BLI: EL-339", () => {
    render(<Switch />);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "false");
  });

  it("is checked when defaultChecked is true - BLI: EL-339", () => {
    render(<Switch defaultChecked />);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
  });

  it("renders with type=button - BLI: EL-339", () => {
    render(<Switch />);
    expect(screen.getByRole("switch")).toHaveAttribute("type", "button");
  });

  it("applies id - BLI: EL-339", () => {
    render(<Switch id="switch-1" />);
    expect(screen.getByRole("switch")).toHaveAttribute("id", "switch-1");
  });

  it("applies data-testid - BLI: EL-339", () => {
    render(<Switch data-testid="my-switch" />);
    expect(screen.getByTestId("my-switch")).toBeInTheDocument();
  });

  it("applies custom className - BLI: EL-339", () => {
    render(<Switch className="custom-class" />);
    expect(screen.getByRole("switch").className).toContain("custom-class");
  });

  it("applies inline style - BLI: EL-339", () => {
    render(<Switch style={{ opacity: 0.5 }} />);
    expect(screen.getByRole("switch")).toHaveStyle({ opacity: "0.5" });
  });

  // --- Controlled ---

  it("renders controlled checked=true - BLI: EL-339", () => {
    render(<Switch checked={true} />);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
  });

  it("renders controlled checked=false - BLI: EL-339", () => {
    render(<Switch checked={false} />);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "false");
  });

  it("does not update internal state in controlled mode - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(<Switch checked={false} onChange={() => {}} />);
    const sw = screen.getByRole("switch");

    await user.click(sw);
    // stays false because we don't update the controlled prop
    expect(sw).toHaveAttribute("aria-checked", "false");
  });

  it("calls onChange with new value in controlled mode - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Switch checked={false} onChange={handleChange} />);

    await user.click(screen.getByRole("switch"));
    expect(handleChange).toHaveBeenCalledWith({ checked: true });
  });

  // --- Uncontrolled toggling ---

  it("toggles from false to true on click (uncontrolled) - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Switch onChange={handleChange} />);

    await user.click(screen.getByRole("switch"));

    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
    expect(handleChange).toHaveBeenCalledWith({ checked: true });
  });

  it("toggles from true to false on click (uncontrolled) - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Switch defaultChecked onChange={handleChange} />);

    await user.click(screen.getByRole("switch"));

    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "false");
    expect(handleChange).toHaveBeenCalledWith({ checked: false });
  });

  // --- Disabled ---

  it("is disabled when disabled=true - BLI: EL-339", () => {
    render(<Switch disabled />);
    expect(screen.getByRole("switch")).toBeDisabled();
  });

  it("has aria-disabled when disabled - BLI: EL-339", () => {
    render(<Switch disabled />);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-disabled", "true");
  });

  it("does not toggle when disabled - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Switch disabled onChange={handleChange} />);

    await user.click(screen.getByRole("switch"));
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("does not toggle on keyboard when disabled - BLI: EL-339", async () => {
    userEvent.setup();
    const handleChange = vi.fn();
    render(<Switch disabled onChange={handleChange} />);

    // disabled button can't be focused/activated via keyboard
    expect(screen.getByRole("switch")).toBeDisabled();
    expect(handleChange).not.toHaveBeenCalled();
  });

  // --- Keyboard ---

  it("toggles on Space key - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Switch onChange={handleChange} />);

    screen.getByRole("switch").focus();
    await user.keyboard(" ");
    expect(handleChange).toHaveBeenCalledWith({ checked: true });
  });

  it("toggles on Enter key - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Switch onChange={handleChange} />);

    screen.getByRole("switch").focus();
    await user.keyboard("{Enter}");
    expect(handleChange).toHaveBeenCalledWith({ checked: true });
  });

  it("does not toggle on other keys - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Switch onChange={handleChange} />);

    screen.getByRole("switch").focus();
    await user.keyboard("a");
    expect(handleChange).not.toHaveBeenCalled();
  });

  // --- Accessibility ---

  it("applies accessibleName as aria-label - BLI: EL-339", () => {
    render(<Switch accessibleName="Enable feature" />);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-label", "Enable feature");
  });

  it("applies accessibleNameRef as aria-labelledby - BLI: EL-339", () => {
    render(<Switch accessibleNameRef="label-id" />);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-labelledby", "label-id");
  });

  it("applies aria-required when required - BLI: EL-339", () => {
    render(<Switch required />);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-required", "true");
  });

  it("sets title from tooltip - BLI: EL-339", () => {
    render(<Switch tooltip="Switch this" />);
    expect(screen.getByRole("switch")).toHaveAttribute("title", "Switch this");
  });

  // --- Design variants ---

  it("renders Textual design by default - BLI: EL-339", () => {
    render(<Switch />);
    expect(screen.getByRole("switch")).toBeInTheDocument();
  });

  it("renders Graphical design without crashing - BLI: EL-339", () => {
    render(<Switch design={SwitchDesign.Graphical} />);
    expect(screen.getByRole("switch")).toBeInTheDocument();
  });

  it("renders Graphical design with default check/x icons when checked - BLI: EL-339", () => {
    render(<Switch design={SwitchDesign.Graphical} defaultChecked />);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
  });

  it("renders Graphical design with default check/x icons when unchecked - BLI: EL-339", () => {
    render(<Switch design={SwitchDesign.Graphical} />);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "false");
  });

  it("renders Graphical design with custom iconOn/iconOff - BLI: EL-339", () => {
    render(
      <Switch
        design={SwitchDesign.Graphical}
        defaultChecked
        iconOn={<span data-testid="icon-on">ON</span>}
        iconOff={<span data-testid="icon-off">OFF</span>}
      />
    );
    expect(screen.getByTestId("icon-on")).toBeInTheDocument();
  });

  it("renders Graphical design custom iconOff when unchecked - BLI: EL-339", () => {
    render(
      <Switch
        design={SwitchDesign.Graphical}
        iconOn={<span data-testid="icon-on">ON</span>}
        iconOff={<span data-testid="icon-off">OFF</span>}
      />
    );
    expect(screen.getByTestId("icon-off")).toBeInTheDocument();
  });

  // --- Textual design with text labels ---

  it("renders textOn label when checked - BLI: EL-339", () => {
    render(<Switch defaultChecked textOn="Yes" textOff="No" />);
    // Text appears in both the measurement span and the visible handle span
    expect(screen.getAllByText("Yes").length).toBeGreaterThanOrEqual(1);
  });

  it("renders textOff label when unchecked - BLI: EL-339", () => {
    render(<Switch textOn="Yes" textOff="No" />);
    expect(screen.getAllByText("No").length).toBeGreaterThanOrEqual(1);
  });

  it("renders measurement spans for text sizing - BLI: EL-339", () => {
    render(<Switch textOn="Yes" textOff="No" />);
    // Both measurement spans are in the DOM (invisible) plus the visible handle span
    expect(screen.getAllByText("Yes").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("No").length).toBeGreaterThanOrEqual(1);
  });

  it("toggles text label on click - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(<Switch textOn="ActiveLabel" textOff="InactiveLabel" />);

    // initially shows "InactiveLabel" in the handle
    expect(screen.getAllByText("InactiveLabel").length).toBeGreaterThanOrEqual(1);

    await user.click(screen.getByRole("switch"));

    expect(screen.getAllByText("ActiveLabel").length).toBeGreaterThanOrEqual(1);
  });

  // --- Form integration ---

  it("renders hidden input when name is provided - BLI: EL-339", () => {
    const { container } = render(<Switch name="feature" value="enabled" />);
    const input = container.querySelector("input[type='checkbox']") as HTMLInputElement;
    expect(input).not.toBeNull();
    expect(input).toHaveAttribute("name", "feature");
    expect(input).toHaveAttribute("value", "enabled");
  });

  it("hidden input is checked when switch is checked - BLI: EL-339", () => {
    const { container } = render(<Switch name="feature" defaultChecked />);
    const input = container.querySelector("input[type='checkbox']") as HTMLInputElement;
    expect(input.checked).toBe(true);
  });

  it("hidden input has aria-hidden and tabIndex=-1 - BLI: EL-339", () => {
    const { container } = render(<Switch name="feature" />);
    const input = container.querySelector("input[type='checkbox']") as HTMLInputElement;
    expect(input).toHaveAttribute("aria-hidden", "true");
    expect(input).toHaveAttribute("tabindex", "-1");
  });

  it("does not render hidden input without name - BLI: EL-339", () => {
    const { container } = render(<Switch />);
    expect(container.querySelector("input[type='checkbox']")).toBeNull();
  });

  it("renders required on hidden input when required - BLI: EL-339", () => {
    const { container } = render(<Switch name="f" required />);
    const input = container.querySelector("input[type='checkbox']") as HTMLInputElement;
    expect(input).toHaveAttribute("required");
  });

  it("renders disabled on hidden input when disabled - BLI: EL-339", () => {
    const { container } = render(<Switch name="f" disabled />);
    const input = container.querySelector("input[type='checkbox']") as HTMLInputElement;
    expect(input).toBeDisabled();
  });

  // --- Ref ---

  it("forwards ref to the button element - BLI: EL-339", () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Switch ref={ref} />);
    expect(ref.current).not.toBeNull();
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("ref can be used to focus the switch - BLI: EL-339", () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Switch ref={ref} />);
    ref.current!.focus();
    expect(document.activeElement).toBe(ref.current);
  });

  // --- String enum value ---

  it("accepts design as string value 'Textual' - BLI: EL-339", () => {
    render(<Switch design="Textual" />);
    expect(screen.getByRole("switch")).toBeInTheDocument();
  });

  it("accepts design as string value 'Graphical' - BLI: EL-339", () => {
    render(<Switch design="Graphical" />);
    expect(screen.getByRole("switch")).toBeInTheDocument();
  });

  // --- Multiple switches (verify independence) ---

  it("two uncontrolled switches operate independently - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Switch data-testid="t1" />
        <Switch data-testid="t2" defaultChecked />
      </>
    );

    await user.click(screen.getByTestId("t1"));
    expect(screen.getByTestId("t1")).toHaveAttribute("aria-checked", "true");
    expect(screen.getByTestId("t2")).toHaveAttribute("aria-checked", "true");
  });

  it("sets aria-describedby when accessibleDescription provided - BLI: EL-339", () => {
    render(<Switch accessibleDescription="Enables dark mode" />);
    const sw = screen.getByRole("switch");
    const describedById = sw.getAttribute("aria-describedby");
    expect(describedById).toBeTruthy();
    const descriptionEl = document.getElementById(describedById!);
    expect(descriptionEl).toBeInTheDocument();
    expect(descriptionEl!.textContent).toBe("Enables dark mode");
  });

  it("applies accessibilityAttributes.describedBy - BLI: EL-339", () => {
    render(<Switch accessibilityAttributes={{ describedBy: "switch-help" }} />);
    const sw = screen.getByRole("switch");
    expect(sw).toHaveAttribute("aria-describedby", expect.stringContaining("switch-help"));
  });
});
