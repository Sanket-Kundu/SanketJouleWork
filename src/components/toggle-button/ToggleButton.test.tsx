import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { ToggleButton } from "./ToggleButton";
import { ButtonDesign } from "../../types/button";
import type { ToggleButtonRef } from "../../types/toggle-button";

describe("ToggleButton", () => {
  // --- Rendering ---

  it("renders a button element - BLI: EL-339", () => {
    render(<ToggleButton>Favorite</ToggleButton>);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("renders children text - BLI: EL-339", () => {
    render(<ToggleButton>Star</ToggleButton>);
    expect(screen.getByRole("button", { name: /Star/ })).toBeInTheDocument();
  });

  it("has type=button - BLI: EL-339", () => {
    render(<ToggleButton>Click</ToggleButton>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("renders unpressed by default - BLI: EL-339", () => {
    render(<ToggleButton>Toggle</ToggleButton>);
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "false");
  });

  it("applies custom className - BLI: EL-339", () => {
    render(<ToggleButton className="my-class">T</ToggleButton>);
    expect(screen.getByRole("button").className).toContain("my-class");
  });

  it("applies inline style - BLI: EL-339", () => {
    render(<ToggleButton style={{ color: "blue" }}>T</ToggleButton>);
    expect(screen.getByRole("button")).toHaveStyle({ color: "rgb(0, 0, 255)" });
  });

  // --- Controlled ---

  it("renders pressed=true when controlled - BLI: EL-339", () => {
    render(<ToggleButton pressed={true}>Bold</ToggleButton>);
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
  });

  it("renders pressed=false when controlled - BLI: EL-339", () => {
    render(<ToggleButton pressed={false}>Bold</ToggleButton>);
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "false");
  });

  it("does not update internal state when controlled - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(<ToggleButton pressed={false} onChange={() => {}}>Bold</ToggleButton>);

    await user.click(screen.getByRole("button"));
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "false");
  });

  it("calls onChange with new value in controlled mode - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<ToggleButton pressed={false} onChange={handleChange}>Bold</ToggleButton>);

    await user.click(screen.getByRole("button"));
    expect(handleChange).toHaveBeenCalledWith({ pressed: true });
  });

  it("calls onChange with pressed=false when toggling off - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<ToggleButton pressed={true} onChange={handleChange}>Bold</ToggleButton>);

    await user.click(screen.getByRole("button"));
    expect(handleChange).toHaveBeenCalledWith({ pressed: false });
  });

  // --- Uncontrolled ---

  it("toggles from false to true on click (uncontrolled) - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<ToggleButton onChange={handleChange}>Toggle</ToggleButton>);

    await user.click(screen.getByRole("button"));

    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
    expect(handleChange).toHaveBeenCalledWith({ pressed: true });
  });

  it("toggles from true to false on click (uncontrolled) - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    // No pressed prop but click to get to true, then click again
    render(<ToggleButton onChange={handleChange}>Toggle</ToggleButton>);

    await user.click(screen.getByRole("button")); // -> true
    await user.click(screen.getByRole("button")); // -> false

    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "false");
    expect(handleChange).toHaveBeenLastCalledWith({ pressed: false });
  });

  // --- Disabled ---

  it("is disabled when disabled=true - BLI: EL-339", () => {
    render(<ToggleButton disabled>Disabled</ToggleButton>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("does not toggle when disabled - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<ToggleButton disabled onChange={handleChange}>Toggle</ToggleButton>);

    await user.click(screen.getByRole("button"));
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("does not call onClick when disabled - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<ToggleButton disabled onClick={handleClick}>Toggle</ToggleButton>);

    await user.click(screen.getByRole("button"));
    expect(handleClick).not.toHaveBeenCalled();
  });

  // --- onClick prop ---

  it("calls onClick on click - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<ToggleButton onClick={handleClick}>Toggle</ToggleButton>);

    await user.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it("calls both onChange and onClick on click - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const handleClick = vi.fn();
    render(<ToggleButton onChange={handleChange} onClick={handleClick}>Toggle</ToggleButton>);

    await user.click(screen.getByRole("button"));
    expect(handleChange).toHaveBeenCalledOnce();
    expect(handleClick).toHaveBeenCalledOnce();
  });

  // --- Design variants ---

  it.each([
    ButtonDesign.Secondary,
    ButtonDesign.Primary,
    ButtonDesign.PrimaryJoule,
    ButtonDesign.SecondaryJoule,
    ButtonDesign.Neutral,
    ButtonDesign.Tertiary,
    ButtonDesign.TertiaryJoule,
  ])("renders design=%s without crashing - BLI: EL-339", (design) => {
    render(<ToggleButton design={design}>T</ToggleButton>);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("renders with string design value 'Secondary' - BLI: EL-339", () => {
    render(<ToggleButton design="Secondary">T</ToggleButton>);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  // --- Icon ---

  it("renders start icon - BLI: EL-339", () => {
    render(
      <ToggleButton icon={<span data-testid="start-icon">★</span>}>
        Star
      </ToggleButton>
    );
    expect(screen.getByTestId("start-icon")).toBeInTheDocument();
  });

  it("renders end icon - BLI: EL-339", () => {
    render(
      <ToggleButton endIcon={<span data-testid="end-icon">▼</span>}>
        Expand
      </ToggleButton>
    );
    expect(screen.getByTestId("end-icon")).toBeInTheDocument();
  });

  it("renders both start and end icons - BLI: EL-339", () => {
    render(
      <ToggleButton
        icon={<span data-testid="s">S</span>}
        endIcon={<span data-testid="e">E</span>}
      >
        Both
      </ToggleButton>
    );
    expect(screen.getByTestId("s")).toBeInTheDocument();
    expect(screen.getByTestId("e")).toBeInTheDocument();
    expect(screen.getByText("Both")).toBeInTheDocument();
  });

  // --- iconOnly ---

  it("renders icon-only when iconOnly=true - BLI: EL-339", () => {
    render(
      <ToggleButton iconOnly icon={<span data-testid="icon">★</span>}>
        Hidden
      </ToggleButton>
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
    expect(screen.queryByText("Hidden")).not.toBeInTheDocument();
  });

  it("renders icon-only automatically when icon provided without children - BLI: EL-339", () => {
    render(
      <ToggleButton icon={<span data-testid="only-icon">★</span>} />
    );
    expect(screen.getByTestId("only-icon")).toBeInTheDocument();
    // no text children, button has w-10 class
    expect(screen.getByRole("button").className).toContain("w-10");
  });

  it("does NOT hide children when there is text alongside an icon - BLI: EL-339", () => {
    render(
      <ToggleButton icon={<span data-testid="i">★</span>}>Label</ToggleButton>
    );
    expect(screen.getByText("Label")).toBeInTheDocument();
  });

  // --- Accessibility ---

  it("applies accessibleName as aria-label - BLI: EL-339", () => {
    render(<ToggleButton accessibleName="Toggle bold">B</ToggleButton>);
    expect(screen.getByRole("button")).toHaveAttribute("aria-label", "Toggle bold");
  });

  it("sets title from tooltip - BLI: EL-339", () => {
    render(<ToggleButton tooltip="Toggle me">T</ToggleButton>);
    expect(screen.getByRole("button")).toHaveAttribute("title", "Toggle me");
  });

  // --- Keyboard ---

  it("toggles on Space key - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<ToggleButton onChange={handleChange}>T</ToggleButton>);

    screen.getByRole("button").focus();
    await user.keyboard(" ");
    expect(handleChange).toHaveBeenCalledWith({ pressed: true });
  });

  it("toggles on Enter key - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<ToggleButton onChange={handleChange}>T</ToggleButton>);

    screen.getByRole("button").focus();
    await user.keyboard("{Enter}");
    expect(handleChange).toHaveBeenCalledWith({ pressed: true });
  });

  // --- Ref (imperative handle) ---

  it("exposes focus, isFocused, getNativeElement via ref - BLI: EL-339", () => {
    const ref = React.createRef<ToggleButtonRef>();
    render(<ToggleButton ref={ref}>Ref test</ToggleButton>);

    expect(ref.current).not.toBeNull();
    expect(ref.current!.getNativeElement()).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current!.nativeElement).toBeInstanceOf(HTMLButtonElement);

    ref.current!.focus();
    expect(ref.current!.isFocused()).toBe(true);
  });

  it("getNativeElement returns the button element - BLI: EL-339", () => {
    const ref = React.createRef<ToggleButtonRef>();
    render(<ToggleButton ref={ref}>Get element</ToggleButton>);

    const nativeEl = ref.current!.getNativeElement();
    expect(nativeEl).toBe(screen.getByRole("button"));
  });

  it("isFocused returns false when not focused - BLI: EL-339", () => {
    const ref = React.createRef<ToggleButtonRef>();
    render(<ToggleButton ref={ref}>Focus test</ToggleButton>);

    expect(ref.current!.isFocused()).toBe(false);
  });

  // --- Multiple toggle buttons (independence) ---

  it("two uncontrolled toggle buttons operate independently - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(
      <>
        <ToggleButton>First</ToggleButton>
        <ToggleButton>Second</ToggleButton>
      </>
    );

    const [first, second] = screen.getAllByRole("button");
    await user.click(first);

    expect(first).toHaveAttribute("aria-pressed", "true");
    expect(second).toHaveAttribute("aria-pressed", "false");
  });
});
