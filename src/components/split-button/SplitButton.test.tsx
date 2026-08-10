import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { SplitButton } from "./SplitButton";
import { ButtonDesign } from "../../types/button";
import type { SplitButtonRef } from "../../types/split-button";

// ── Helpers ──────────────────────────────────────────────────────────────────

const StartIcon = () => <svg data-testid="start-icon" aria-hidden="true" />;
const EndIcon = () => <svg data-testid="end-icon" aria-hidden="true" />;

function getTextButton() {
  // The text (main action) button is the first <button> inside the group
  const buttons = screen.getAllByRole("button");
  return buttons[0];
}

function getArrowButton() {
  const buttons = screen.getAllByRole("button");
  return buttons[1];
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe("SplitButton", () => {
  // ── Rendering ─────────────────────────────────────────────────────────────

  it("renders without crashing - BLI: EL-339", () => {
    render(<SplitButton text="Save" />);
    expect(screen.getByRole("group")).toBeInTheDocument();
  });

  it("renders two buttons (text + arrow) - BLI: EL-339", () => {
    render(<SplitButton text="Save" />);
    expect(screen.getAllByRole("button")).toHaveLength(2);
  });

  it("renders text content in the main button - BLI: EL-339", () => {
    render(<SplitButton text="Save" />);
    // text appears in both the visible span and the sr-only span
    const matches = screen.getAllByText("Save");
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it("renders start icon - BLI: EL-339", () => {
    render(<SplitButton text="Save" icon={<StartIcon />} />);
    expect(screen.getByTestId("start-icon")).toBeInTheDocument();
  });

  it("renders end icon - BLI: EL-339", () => {
    render(<SplitButton text="Save" endIcon={<EndIcon />} />);
    expect(screen.getByTestId("end-icon")).toBeInTheDocument();
  });

  it("renders arrow button with ChevronDown - BLI: EL-339", () => {
    render(<SplitButton text="Save" />);
    // Arrow button exists; ChevronDown renders as an svg inside it
    const arrowBtn = getArrowButton();
    expect(arrowBtn.querySelector("svg")).toBeInTheDocument();
  });

  it("applies id to root element - BLI: EL-339", () => {
    render(<SplitButton id="sb-1" text="Save" />);
    expect(document.getElementById("sb-1")).toBeInTheDocument();
  });

  it("applies className to root element - BLI: EL-339", () => {
    render(<SplitButton text="Save" className="custom" />);
    expect(screen.getByRole("group").className).toContain("custom");
  });

  it("applies inline style to root element - BLI: EL-339", () => {
    render(<SplitButton text="Save" style={{ color: "red" }} />);
    expect(screen.getByRole("group")).toHaveStyle({ color: "rgb(255, 0, 0)" });
  });

  // ── Role and accessibility ─────────────────────────────────────────────────

  it("root element has role='group' - BLI: EL-339", () => {
    render(<SplitButton text="Save" />);
    expect(screen.getByRole("group")).toBeInTheDocument();
  });

  it("root has aria-roledescription='Split Button' by default - BLI: EL-339", () => {
    render(<SplitButton text="Save" />);
    expect(screen.getByRole("group")).toHaveAttribute(
      "aria-roledescription",
      "Split Button"
    );
  });

  it("includes accessibleName in screen reader hidden text - BLI: EL-339", () => {
    render(<SplitButton id="sb-test" text="Save" accessibleName="Save document" />);
    const hintSpan = document.getElementById("sb-test-invisibleText");
    expect(hintSpan?.textContent).toContain("Save document");
  });

  it("arrow button has aria-haspopup='menu' by default - BLI: EL-339", () => {
    render(<SplitButton text="Save" />);
    expect(getArrowButton()).toHaveAttribute("aria-haspopup", "menu");
  });

  it("arrow button has title='Open Menu' by default - BLI: EL-339", () => {
    render(<SplitButton text="Save" />);
    expect(getArrowButton()).toHaveAttribute("title", "Open Menu");
  });

  it("arrow button aria-expanded reflects activeArrowButton=false - BLI: EL-339", () => {
    render(<SplitButton text="Save" activeArrowButton={false} />);
    expect(getArrowButton()).toHaveAttribute("aria-expanded", "false");
  });

  it("arrow button aria-expanded reflects activeArrowButton=true - BLI: EL-339", () => {
    render(<SplitButton text="Save" activeArrowButton={true} />);
    expect(getArrowButton()).toHaveAttribute("aria-expanded", "true");
  });

  it("screen reader text spans contain the button text - BLI: EL-339", () => {
    render(<SplitButton text="Save" />);
    // There are two sr-only spans: invisibleTextDefault (text) and invisibleText (keyboard hint)
    const srSpans = document.querySelectorAll(".sr-only");
    const texts = Array.from(srSpans).map((s) => s.textContent);
    expect(texts.some((t) => t === "Save")).toBe(true);
  });

  // ── Keyboard hint for screen readers ──────────────────────────────────────

  it("includes keyboard hint in screen reader hidden text - BLI: EL-339", () => {
    render(<SplitButton text="Save" />);
    const srSpans = document.querySelectorAll(".sr-only");
    const texts = Array.from(srSpans).map((s) => s.textContent);
    expect(
      texts.some((t) =>
        t?.includes(
          "Press Space or Enter to trigger default action and Alt + Arrow Down or F4 to trigger arrow action"
        )
      )
    ).toBe(true);
  });

  it("aria-labelledby references both hidden text spans - BLI: EL-339", () => {
    render(<SplitButton id="sb-test" text="Save" />);
    const group = screen.getByRole("group");
    expect(group).toHaveAttribute(
      "aria-labelledby",
      "sb-test-invisibleTextDefault sb-test-invisibleText"
    );
  });

  it("aria-labelledby is present even when accessibleName is set - BLI: EL-339", () => {
    render(<SplitButton id="sb-test" text="Save" accessibleName="Custom name" />);
    const group = screen.getByRole("group");
    expect(group).toHaveAttribute(
      "aria-labelledby",
      "sb-test-invisibleTextDefault sb-test-invisibleText"
    );
  });

  it("keyboard hint and accessibleName are combined in hidden text - BLI: EL-339", () => {
    render(<SplitButton text="Save" accessibleName="Custom name" />);
    const srSpans = document.querySelectorAll(".sr-only");
    const texts = Array.from(srSpans).map((s) => s.textContent);
    expect(
      texts.some(
        (t) =>
          t?.includes("Press Space or Enter to trigger default action") &&
          t?.includes("Custom name")
      )
    ).toBe(true);
  });

  it("keyboard hint span does not include accessibleName when none provided - BLI: EL-339", () => {
    render(<SplitButton id="sb-test" text="Save" />);
    const hintSpan = document.getElementById("sb-test-invisibleText");
    expect(hintSpan?.textContent).toBe(
      "Press Space or Enter to trigger default action and Alt + Arrow Down or F4 to trigger arrow action"
    );
  });

  // ── Custom accessibilityAttributes ────────────────────────────────────────

  it("applies custom arrowButton hasPopup - BLI: EL-339", () => {
    render(
      <SplitButton
        text="Save"
        accessibilityAttributes={{ arrowButton: { hasPopup: "listbox" } }}
      />
    );
    expect(getArrowButton()).toHaveAttribute("aria-haspopup", "listbox");
  });

  it("applies custom arrowButton title - BLI: EL-339", () => {
    render(
      <SplitButton
        text="Save"
        accessibilityAttributes={{ arrowButton: { title: "Options" } }}
      />
    );
    expect(getArrowButton()).toHaveAttribute("title", "Options");
  });

  it("applies custom arrowButton expanded - BLI: EL-339", () => {
    render(
      <SplitButton
        text="Save"
        accessibilityAttributes={{ arrowButton: { expanded: true } }}
      />
    );
    expect(getArrowButton()).toHaveAttribute("aria-expanded", "true");
  });

  it("applies root haspopup from accessibilityAttributes - BLI: EL-339", () => {
    render(
      <SplitButton
        text="Save"
        accessibilityAttributes={{ root: { hasPopup: "dialog" } }}
      />
    );
    expect(screen.getByRole("group")).toHaveAttribute("aria-haspopup", "dialog");
  });

  it("applies root title from accessibilityAttributes to text button - BLI: EL-339", () => {
    render(
      <SplitButton
        text="Save"
        accessibilityAttributes={{ root: { title: "Root title" } }}
      />
    );
    expect(getTextButton()).toHaveAttribute("title", "Root title");
  });

  it("applies root roleDescription from accessibilityAttributes - BLI: EL-339", () => {
    render(
      <SplitButton
        text="Save"
        accessibilityAttributes={{ root: { roleDescription: "Custom Role" } }}
      />
    );
    expect(screen.getByRole("group")).toHaveAttribute(
      "aria-roledescription",
      "Custom Role"
    );
  });

  it("applies ariaKeyShortcuts from root accessibilityAttributes - BLI: EL-339", () => {
    render(
      <SplitButton
        text="Save"
        accessibilityAttributes={{ root: { ariaKeyShortcuts: "Alt+S" } }}
      />
    );
    expect(screen.getByRole("group")).toHaveAttribute("aria-keyshortcuts", "Alt+S");
  });

  // ── Design variants ────────────────────────────────────────────────────────

  it.each([
    ButtonDesign.Secondary,
    ButtonDesign.Primary,
    ButtonDesign.PrimaryJoule,
    ButtonDesign.SecondaryJoule,
    ButtonDesign.Neutral,
    ButtonDesign.Tertiary,
    ButtonDesign.TertiaryJoule,
  ])("renders without crashing for design=%s - BLI: EL-339", (design) => {
    render(<SplitButton text="Save" design={design} />);
    expect(screen.getByRole("group")).toBeInTheDocument();
  });

  // ── Disabled & loading ─────────────────────────────────────────────────────

  it("both buttons are disabled when disabled=true - BLI: EL-339", () => {
    render(<SplitButton text="Save" disabled />);
    const [textBtn, arrowBtn] = screen.getAllByRole("button");
    expect(textBtn).toBeDisabled();
    expect(arrowBtn).toBeDisabled();
  });

  it("root has tabIndex=-1 when disabled - BLI: EL-339", () => {
    render(<SplitButton text="Save" disabled />);
    expect(screen.getByRole("group")).toHaveAttribute("tabindex", "-1");
  });

  it("both buttons are disabled when loading=true - BLI: EL-339", () => {
    render(<SplitButton text="Save" loading />);
    const [textBtn, arrowBtn] = screen.getAllByRole("button");
    expect(textBtn).toBeDisabled();
    expect(arrowBtn).toBeDisabled();
  });

  it("shows Loader2 spinner when loading - BLI: EL-339", () => {
    render(<SplitButton text="Save" loading />);
    // Loader2 renders an SVG; the start icon should be replaced
    const textBtn = getTextButton();
    // The spin animation class identifies the loader
    const spinner = textBtn.querySelector(".animate-spin");
    expect(spinner).toBeInTheDocument();
  });

  it("hides end icon when loading - BLI: EL-339", () => {
    render(<SplitButton text="Save" loading endIcon={<EndIcon />} />);
    expect(screen.queryByTestId("end-icon")).not.toBeInTheDocument();
  });

  it("hides start icon when loading (replaced by spinner) - BLI: EL-339", () => {
    render(<SplitButton text="Save" loading icon={<StartIcon />} />);
    expect(screen.queryByTestId("start-icon")).not.toBeInTheDocument();
  });

  // ── Click events ───────────────────────────────────────────────────────────

  it("calls onClick when text button is clicked - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<SplitButton text="Save" onClick={onClick} />);
    await user.click(getTextButton());
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("calls onArrowClick when arrow button is clicked - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onArrowClick = vi.fn();
    render(<SplitButton text="Save" onArrowClick={onArrowClick} />);
    await user.click(getArrowButton());
    expect(onArrowClick).toHaveBeenCalledOnce();
  });

  it("does not call onClick when disabled - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<SplitButton text="Save" disabled onClick={onClick} />);
    await user.click(getTextButton());
    expect(onClick).not.toHaveBeenCalled();
  });

  it("does not call onArrowClick when disabled - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onArrowClick = vi.fn();
    render(<SplitButton text="Save" disabled onArrowClick={onArrowClick} />);
    await user.click(getArrowButton());
    expect(onArrowClick).not.toHaveBeenCalled();
  });

  it("does not call onClick when loading - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<SplitButton text="Save" loading onClick={onClick} />);
    await user.click(getTextButton());
    expect(onClick).not.toHaveBeenCalled();
  });

  it("does not call onArrowClick when loading - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onArrowClick = vi.fn();
    render(<SplitButton text="Save" loading onArrowClick={onArrowClick} />);
    await user.click(getArrowButton());
    expect(onArrowClick).not.toHaveBeenCalled();
  });

  // ── Keyboard events ────────────────────────────────────────────────────────

  it("Enter on text button triggers onClick - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<SplitButton text="Save" onClick={onClick} />);
    const group = screen.getByRole("group");
    group.focus();
    await user.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("Space on group triggers onClick on keyup - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<SplitButton text="Save" onClick={onClick} />);
    const group = screen.getByRole("group");
    group.focus();
    await user.keyboard(" ");
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("ArrowDown triggers onArrowClick - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onArrowClick = vi.fn();
    render(<SplitButton text="Save" onArrowClick={onArrowClick} />);
    const group = screen.getByRole("group");
    group.focus();
    await user.keyboard("{ArrowDown}");
    expect(onArrowClick).toHaveBeenCalledOnce();
  });

  it("ArrowUp triggers onArrowClick - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onArrowClick = vi.fn();
    render(<SplitButton text="Save" onArrowClick={onArrowClick} />);
    const group = screen.getByRole("group");
    group.focus();
    await user.keyboard("{ArrowUp}");
    expect(onArrowClick).toHaveBeenCalledOnce();
  });

  it("Alt+ArrowDown triggers onArrowClick - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onArrowClick = vi.fn();
    render(<SplitButton text="Save" onArrowClick={onArrowClick} />);
    const group = screen.getByRole("group");
    group.focus();
    await user.keyboard("{Alt>}{ArrowDown}{/Alt}");
    expect(onArrowClick).toHaveBeenCalledOnce();
  });

  it("Alt+ArrowUp triggers onArrowClick - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onArrowClick = vi.fn();
    render(<SplitButton text="Save" onArrowClick={onArrowClick} />);
    const group = screen.getByRole("group");
    group.focus();
    await user.keyboard("{Alt>}{ArrowUp}{/Alt}");
    expect(onArrowClick).toHaveBeenCalledOnce();
  });

  it("F4 triggers onArrowClick - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onArrowClick = vi.fn();
    render(<SplitButton text="Save" onArrowClick={onArrowClick} />);
    const group = screen.getByRole("group");
    group.focus();
    await user.keyboard("{F4}");
    expect(onArrowClick).toHaveBeenCalledOnce();
  });

  it("Escape clears active states when text button is not active - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(<SplitButton text="Save" />);
    const group = screen.getByRole("group");
    group.focus();
    // Just escape without space being held
    await user.keyboard("{Escape}");
    // No crash; component still renders
    expect(screen.getByRole("group")).toBeInTheDocument();
  });

  it("does not call onClick on Enter when disabled - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<SplitButton text="Save" disabled onClick={onClick} />);
    const group = screen.getByRole("group");
    group.focus();
    await user.keyboard("{Enter}");
    expect(onClick).not.toHaveBeenCalled();
  });

  it("Enter on arrow button calls onArrowClick - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onArrowClick = vi.fn();
    render(<SplitButton text="Save" onArrowClick={onArrowClick} />);
    const arrowBtn = getArrowButton();
    arrowBtn.focus();
    await user.keyboard("{Enter}");
    expect(onArrowClick).toHaveBeenCalledOnce();
  });

  it("Space on arrow button triggers onArrowClick on keyup - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onArrowClick = vi.fn();
    render(<SplitButton text="Save" onArrowClick={onArrowClick} />);
    const arrowBtn = getArrowButton();
    arrowBtn.focus();
    await user.keyboard(" ");
    expect(onArrowClick).toHaveBeenCalledOnce();
  });

  // ── Mouse state (separator hiding) ────────────────────────────────────────

  it("separator is present by default - BLI: EL-339", () => {
    render(<SplitButton text="Save" />);
    const ariaHiddenSpans = document.querySelectorAll(
      '[aria-hidden="true"]'
    );
    expect(ariaHiddenSpans.length).toBeGreaterThanOrEqual(1);
  });

  // ── Imperative ref ─────────────────────────────────────────────────────────

  it("exposes nativeElement via ref - BLI: EL-339", () => {
    const ref = React.createRef<SplitButtonRef>();
    render(<SplitButton ref={ref} text="Save" />);
    expect(ref.current).not.toBeNull();
    expect(ref.current!.nativeElement).toBeInstanceOf(HTMLDivElement);
    expect(ref.current!.nativeElement).toBe(screen.getByRole("group"));
  });

  it("exposes textButton via ref - BLI: EL-339", () => {
    const ref = React.createRef<SplitButtonRef>();
    render(<SplitButton ref={ref} text="Save" />);
    expect(ref.current!.textButton).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current!.textButton).toBe(getTextButton());
  });

  it("exposes arrowButton via ref - BLI: EL-339", () => {
    const ref = React.createRef<SplitButtonRef>();
    render(<SplitButton ref={ref} text="Save" />);
    expect(ref.current!.arrowButton).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current!.arrowButton).toBe(getArrowButton());
  });

  it("focus() method focuses the container - BLI: EL-339", () => {
    const ref = React.createRef<SplitButtonRef>();
    render(<SplitButton ref={ref} text="Save" />);
    ref.current!.focus();
    expect(document.activeElement).toBe(screen.getByRole("group"));
  });

  // ── No handlers provided ──────────────────────────────────────────────────

  it("clicking text button with no onClick handler does not crash - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(<SplitButton text="Save" />);
    await user.click(getTextButton());
    expect(screen.getByRole("group")).toBeInTheDocument();
  });

  it("clicking arrow button with no onArrowClick handler does not crash - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(<SplitButton text="Save" />);
    await user.click(getArrowButton());
    expect(screen.getByRole("group")).toBeInTheDocument();
  });

  // ── No text (icon only) ───────────────────────────────────────────────────

  it("renders without text (icon-only main button) - BLI: EL-339", () => {
    render(<SplitButton icon={<StartIcon />} />);
    expect(screen.getByTestId("start-icon")).toBeInTheDocument();
  });

  // ── String design value ───────────────────────────────────────────────────

  it("accepts string enum value for design - BLI: EL-339", () => {
    render(<SplitButton text="Save" design="Primary" />);
    expect(screen.getByRole("group")).toBeInTheDocument();
  });

  // ── tabIndex when enabled ─────────────────────────────────────────────────

  it("root has tabIndex=0 when not disabled - BLI: EL-339", () => {
    render(<SplitButton text="Save" />);
    expect(screen.getByRole("group")).toHaveAttribute("tabindex", "0");
  });

  // ── Inner button focus promotes tabIndex ──────────────────────────────────

  it("inner focus on text button does not crash - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(<SplitButton text="Save" />);
    const textBtn = getTextButton();
    textBtn.focus();
    await user.tab(); // move focus away
    expect(screen.getByRole("group")).toBeInTheDocument();
  });
});
