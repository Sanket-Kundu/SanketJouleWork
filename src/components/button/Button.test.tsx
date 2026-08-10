import { describe, it, expect, vi } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { Button } from "./Button";
import {
  ButtonDesign,
  ButtonSize,
  ButtonType,
  ButtonAccessibleRole,
} from "../../types/button";
import type { ButtonRef } from "../../types/button";

describe("Button", () => {
  // --- Rendering ---

  it("renders with text content - BLI: EL-339", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("renders with default button type - BLI: EL-339", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("renders as submit button - BLI: EL-339", () => {
    render(<Button type={ButtonType.Submit}>Submit</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("renders as reset button - BLI: EL-339", () => {
    render(<Button type={ButtonType.Reset}>Reset</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "reset");
  });

  it("renders submit with string enum value - BLI: EL-339", () => {
    render(<Button type="Submit">Submit</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("renders reset with string enum value - BLI: EL-339", () => {
    render(<Button type="Reset">Reset</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "reset");
  });

  it("supports data-testid - BLI: EL-339", () => {
    render(<Button data-testid="my-button">Test</Button>);
    expect(screen.getByTestId("my-button")).toBeInTheDocument();
  });

  it("applies id, tabIndex, and custom className - BLI: EL-339", () => {
    render(<Button id="btn-1" tabIndex={-1} className="custom">Go</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("id", "btn-1");
    expect(button).toHaveAttribute("tabindex", "-1");
    expect(button.className).toContain("custom");
  });

  it("applies inline style - BLI: EL-339", () => {
    render(<Button style={{ color: "red" }}>Styled</Button>);
    expect(screen.getByRole("button")).toHaveStyle({ color: "rgb(255, 0, 0)" });
  });

  // --- Design Variants ---

  it.each([
    ButtonDesign.Primary,
    ButtonDesign.PrimaryJoule,
    ButtonDesign.Secondary,
    ButtonDesign.SecondaryJoule,
    ButtonDesign.Tertiary,
    ButtonDesign.TertiaryJoule,
    ButtonDesign.Neutral,
  ])("renders with design=%s without crashing - BLI: EL-339", (design) => {
    render(<Button design={design}>Button</Button>);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  // --- Size Variants ---

  it("renders with medium size - BLI: EL-339", () => {
    render(<Button size={ButtonSize.Medium}>Medium</Button>);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("renders with small size - BLI: EL-339", () => {
    render(<Button size={ButtonSize.Small}>Small</Button>);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  // --- Icon Only ---

  it("renders icon-only button - BLI: EL-339", () => {
    render(
      <Button iconOnly icon={<span data-testid="icon">X</span>}>
        Hidden text
      </Button>
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  // --- Disabled & Loading ---

  it("is disabled when disabled prop is true - BLI: EL-339", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("is focusable but aria-disabled when loading - BLI: EL-339", () => {
    render(<Button loading>Loading</Button>);
    const button = screen.getByRole("button");
    expect(button).not.toBeDisabled();
    expect(button).toHaveAttribute("aria-disabled", "true");
    expect(button).toHaveAttribute("aria-busy", "true");
  });

  it("shows aria-busy when loading - BLI: EL-339", () => {
    render(<Button loading>Saving</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "true");
  });

  it("keeps end icon visible when loading with overlay - BLI: EL-339", () => {
    render(
      <Button loading endIcon={<span data-testid="end-icon">▼</span>}>
        Save
      </Button>
    );
    expect(screen.getByTestId("end-icon")).toBeInTheDocument();
  });

  // --- Click Handling ---

  it("calls onClick when clicked - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>Click me</Button>);
    await user.click(screen.getByRole("button"));

    expect(handleClick).toHaveBeenCalledOnce();
    expect(handleClick).toHaveBeenCalledWith(
      expect.objectContaining({ isKeyboard: false })
    );
  });

  it("does not call onClick when disabled - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <Button disabled onClick={handleClick}>
        Click me
      </Button>
    );
    await user.click(screen.getByRole("button"));

    expect(handleClick).not.toHaveBeenCalled();
  });

  it("does not call onClick when loading - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <Button loading onClick={handleClick}>
        Click me
      </Button>
    );
    await user.click(screen.getByRole("button"));

    expect(handleClick).not.toHaveBeenCalled();
  });

  // --- Keyboard Handling ---

  it("triggers onClick with isKeyboard=true on Space - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>Press me</Button>);
    screen.getByRole("button").focus();
    await user.keyboard(" ");

    expect(handleClick).toHaveBeenCalledWith(
      expect.objectContaining({ isKeyboard: true })
    );
  });

  it("does not fire onClick on Space keydown, only on keyup", async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Press me</Button>);
    const button = screen.getByRole("button");

    const user = userEvent.setup();
    await user.tab();

    fireEvent.keyDown(button, { key: " " });
    expect(handleClick).not.toHaveBeenCalled();

    fireEvent.keyUp(button, { key: " " });
    expect(handleClick).toHaveBeenCalledOnce();
    expect(handleClick).toHaveBeenCalledWith(
      expect.objectContaining({ isKeyboard: true })
    );
  });

  it("fires onClick on Enter via native button behavior", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Press me</Button>);
    screen.getByRole("button").focus();

    await user.keyboard("{Enter}");
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it("does not trigger keyboard handler when disabled - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <Button disabled onClick={handleClick}>
        Press me
      </Button>
    );
    screen.getByRole("button").focus();
    await user.keyboard(" ");

    expect(handleClick).not.toHaveBeenCalled();
  });

  // --- Accessibility ---

  it("applies accessible name as aria-label - BLI: EL-339", () => {
    render(<Button accessibleName="Close dialog">X</Button>);
    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-label",
      "Close dialog"
    );
  });

  it("applies accessibleNameRef as aria-labelledby - BLI: EL-339", () => {
    render(<Button accessibleNameRef="label-1">X</Button>);
    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-labelledby",
      "label-1"
    );
  });

  it("applies aria-expanded - BLI: EL-339", () => {
    render(
      <Button accessibilityAttributes={{ expanded: true }}>Menu</Button>
    );
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");
  });

  it("applies aria-haspopup - BLI: EL-339", () => {
    render(
      <Button accessibilityAttributes={{ hasPopup: "menu" }}>Options</Button>
    );
    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-haspopup",
      "menu"
    );
  });

  it("applies aria-controls - BLI: EL-339", () => {
    render(
      <Button accessibilityAttributes={{ controls: "panel-1" }}>Toggle</Button>
    );
    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-controls",
      "panel-1"
    );
  });

  it("applies aria-pressed - BLI: EL-339", () => {
    render(
      <Button accessibilityAttributes={{ pressed: true }}>Toggle</Button>
    );
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
  });

  it("renders with link role when accessibleRole is Link - BLI: EL-339", () => {
    render(<Button accessibleRole="Link">Go</Button>);
    expect(screen.getByRole("link")).toBeInTheDocument();
  });

  it("renders with link role using enum value - BLI: EL-339", () => {
    render(<Button accessibleRole={ButtonAccessibleRole.Link}>Go</Button>);
    expect(screen.getByRole("link")).toBeInTheDocument();
  });

  // --- Tooltip ---

  it("sets title attribute from tooltip prop - BLI: EL-339", () => {
    render(<Button tooltip="More info">Info</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("title", "More info");
  });

  // --- Icons ---

  it("renders icon before text - BLI: EL-339", () => {
    render(
      <Button icon={<span data-testid="start-icon">★</span>}>Star</Button>
    );
    expect(screen.getByTestId("start-icon")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Star/ })).toBeInTheDocument();
  });

  it("renders end icon after text - BLI: EL-339", () => {
    render(
      <Button endIcon={<span data-testid="end-icon">▼</span>}>Expand</Button>
    );
    expect(screen.getByTestId("end-icon")).toBeInTheDocument();
  });

  // --- Form Integration ---

  it("passes name and value for form submission - BLI: EL-339", () => {
    render(<Button name="action" value="save">Save</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("name", "action");
    expect(button).toHaveAttribute("value", "save");
  });

  it("passes form attribute - BLI: EL-339", () => {
    render(<Button form="my-form">Submit</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("form", "my-form");
  });

  // --- Focus / Blur Events ---

  it("calls onFocus and onBlur handlers - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onFocus = vi.fn();
    const onBlur = vi.fn();

    render(<Button onFocus={onFocus} onBlur={onBlur}>Focus me</Button>);

    await user.tab();
    expect(onFocus).toHaveBeenCalledOnce();

    await user.tab();
    expect(onBlur).toHaveBeenCalledOnce();
  });

  // --- Ref (imperative handle) ---

  it("exposes focus/blur/isFocused via ref - BLI: EL-339", () => {
    const ref = React.createRef<ButtonRef>();
    render(<Button ref={ref}>Ref test</Button>);

    expect(ref.current).not.toBeNull();
    expect(ref.current!.nativeElement).toBeInstanceOf(HTMLButtonElement);

    // focus and check isFocused
    ref.current!.focus();
    expect(ref.current!.isFocused()).toBe(true);

    // blur and check isFocused
    ref.current!.blur();
    expect(ref.current!.isFocused()).toBe(false);
  });

  // --- Multi-state ---

  it("renders multi-state button with initial state - BLI: EL-339", () => {
    const states = [
      { name: "generate", text: "Generate", icon: <span data-testid="gen-icon">G</span> },
      { name: "stop", text: "Stop", icon: <span data-testid="stop-icon">S</span> },
    ];

    render(<Button states={states} state="generate">Fallback</Button>);

    expect(screen.getAllByText("Generate").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByTestId("gen-icon").length).toBeGreaterThanOrEqual(1);
  });

  it("defaults to first state when state prop not provided - BLI: EL-339", () => {
    const states = [
      { name: "first", text: "First" },
      { name: "second", text: "Second" },
    ];

    render(<Button states={states} />);
    expect(screen.getAllByText("First").length).toBeGreaterThanOrEqual(1);
  });

  it("renders multi-state icon-only when state has no text - BLI: EL-339", () => {
    const states = [
      { name: "icon-state", icon: <span data-testid="only-icon">I</span> },
    ];

    render(<Button states={states} state="icon-state" />);
    expect(screen.getAllByTestId("only-icon").length).toBeGreaterThanOrEqual(1);
  });

  it("renders end icon in multi-state - BLI: EL-339", () => {
    const states = [
      { name: "with-end", text: "Action", endIcon: <span data-testid="ms-end-icon">E</span> },
    ];

    render(<Button states={states} state="with-end" />);
    expect(screen.getAllByTestId("ms-end-icon").length).toBeGreaterThanOrEqual(1);
  });

  it("renders hidden measurement button for multi-state - BLI: EL-339", () => {
    const states = [
      { name: "a", text: "Alpha", icon: <span>A</span>, endIcon: <span>→</span> },
      { name: "b", text: "Beta" },
    ];

    render(<Button states={states} state="a" />);
    // Hidden button exists with aria-hidden
    const buttons = document.querySelectorAll("button");
    const hiddenButton = Array.from(buttons).find(
      (b) => b.getAttribute("aria-hidden") === "true"
    );
    expect(hiddenButton).toBeTruthy();
    expect(hiddenButton!.tabIndex).toBe(-1);
  });

  it("animates through phases on state change - BLI: EL-339", async () => {
    vi.useFakeTimers();
    const states = [
      { name: "a", text: "Alpha" },
      { name: "b", text: "Beta" },
    ];

    const { rerender } = render(<Button states={states} state="a" />);
    expect(screen.getAllByText("Alpha").length).toBeGreaterThanOrEqual(1);

    // Change state to trigger animation
    rerender(<Button states={states} state="b" />);

    // fade-out phase (180ms)
    act(() => { vi.advanceTimersByTime(180); });

    // fade-mid phase (20ms) — state switches to new content
    act(() => { vi.advanceTimersByTime(20); });

    // fade-in phase (160ms)
    act(() => { vi.advanceTimersByTime(160); });

    expect(screen.getAllByText("Beta").length).toBeGreaterThanOrEqual(1);

    vi.useRealTimers();
  });

  it("renders pulsing text when state has pulsing=true - BLI: EL-339", () => {
    const states = [
      { name: "processing", text: "Thinking...", pulsing: true },
    ];

    render(<Button states={states} state="processing" />);
    // Pulsing renders the text twice (base + animated overlay), plus hidden measurement button
    const matches = screen.getAllByText("Thinking...");
    expect(matches.length).toBeGreaterThanOrEqual(2);
  });

  it("supports stateTransition='none' - BLI: EL-339", async () => {
    vi.useFakeTimers();
    const states = [
      { name: "a", text: "Alpha" },
      { name: "b", text: "Beta" },
    ];

    const { rerender } = render(
      <Button states={states} state="a" stateTransition="none" />
    );
    rerender(<Button states={states} state="b" stateTransition="none" />);

    act(() => { vi.advanceTimersByTime(400); });

    expect(screen.getAllByText("Beta").length).toBeGreaterThanOrEqual(1);
    vi.useRealTimers();
  });

  it.each([
    "fade",
    "scale",
    "flip",
    "slide-down",
    "slide-left",
    "slide-right",
  ] as const)("supports stateTransition='%s'", async (transition) => {
    vi.useFakeTimers();
    const states = [
      { name: "a", text: "Alpha" },
      { name: "b", text: "Beta" },
    ];

    const { rerender } = render(
      <Button states={states} state="a" stateTransition={transition} />
    );
    rerender(<Button states={states} state="b" stateTransition={transition} />);

    act(() => { vi.advanceTimersByTime(180); });
    act(() => { vi.advanceTimersByTime(20); });
    act(() => { vi.advanceTimersByTime(160); });

    expect(screen.getAllByText("Beta").length).toBeGreaterThanOrEqual(1);
    vi.useRealTimers();
  });

  // --- data-growing-button ---

  it("applies data-growing-button attribute - BLI: EL-339", () => {
    render(<Button data-growing-button="true">Grow</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("data-growing-button", "true");
  });
});
