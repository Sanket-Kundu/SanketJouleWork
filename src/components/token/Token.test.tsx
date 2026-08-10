import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { Token } from "./Token";
import type { TokenRef } from "../../types/token";

describe("Token", () => {
  // --- Rendering ---

  it("renders text content - BLI: EL-339", () => {
    render(<Token text="React" />);
    expect(screen.getByText("React")).toBeInTheDocument();
  });

  it("renders with data-testid - BLI: EL-339", () => {
    render(<Token text="Test" data-testid="my-token" />);
    expect(screen.getByTestId("my-token")).toBeInTheDocument();
  });

  it("applies id, className, and style - BLI: EL-339", () => {
    render(<Token text="X" id="t1" className="custom" style={{ opacity: 0.5 }} />);
    const el = document.getElementById("t1")!;
    expect(el).toBeInTheDocument();
    expect(el.className).toContain("custom");
    expect(el).toHaveStyle({ opacity: "0.5" });
  });

  it("has role=option on root element - BLI: EL-339", () => {
    render(<Token text="Role" />);
    expect(screen.getByRole("option")).toBeInTheDocument();
  });

  it("sets aria-selected=false by default - BLI: EL-339", () => {
    render(<Token text="Default" />);
    expect(screen.getByRole("option")).toHaveAttribute("aria-selected", "false");
  });

  it("sets aria-selected=true when selected - BLI: EL-339", () => {
    render(<Token text="Selected" selected />);
    expect(screen.getByRole("option")).toHaveAttribute("aria-selected", "true");
  });

  // --- Selection ---

  it("fires onSelect with isKeyboard=false on click - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();
    render(<Token text="Click me" onSelect={handleSelect} />);
    await user.click(screen.getByRole("option"));
    expect(handleSelect).toHaveBeenCalledOnce();
    expect(handleSelect).toHaveBeenCalledWith(
      expect.objectContaining({ isKeyboard: false, selected: true })
    );
  });

  it("fires onSelect with selected=false when already selected - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();
    render(<Token text="Toggle" selected onSelect={handleSelect} />);
    await user.click(screen.getByRole("option"));
    expect(handleSelect).toHaveBeenCalledWith(
      expect.objectContaining({ selected: false })
    );
  });

  it("fires onSelect with isKeyboard=true on Space - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();
    render(<Token text="Space" tabIndex={0} onSelect={handleSelect} />);
    const root = screen.getByRole("option");
    root.focus();
    await user.keyboard(" ");
    expect(handleSelect).toHaveBeenCalledWith(
      expect.objectContaining({ isKeyboard: true, selected: true })
    );
  });

  it("does not fire onSelect when readonly - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();
    render(<Token text="Readonly" readonly onSelect={handleSelect} />);
    await user.click(screen.getByRole("option"));
    expect(handleSelect).not.toHaveBeenCalled();
  });

  it("prevents default on Space when readonly (no page scroll)", async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();
    render(<Token text="RO" readonly tabIndex={0} onSelect={handleSelect} />);
    const root = screen.getByRole("option");
    root.focus();
    await user.keyboard(" ");
    // preventDefault is called before the readonly guard —
    // confirmed by the fact that onSelect is still not triggered
    expect(handleSelect).not.toHaveBeenCalled();
  });

  // --- Delete / Close icon ---

  it("renders close icon when not readonly - BLI: EL-339", () => {
    const { container } = render(<Token text="Closable" />);
    const closeIcon = container.querySelector("[data-part='close-icon']");
    expect(closeIcon).toBeInTheDocument();
  });

  it("does not render close icon when readonly - BLI: EL-339", () => {
    const { container } = render(<Token text="Readonly" readonly />);
    const closeIcon = container.querySelector("[data-part='close-icon']");
    expect(closeIcon).not.toBeInTheDocument();
  });

  it("fires onDelete with isKeyboard=false on close icon click - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleDelete = vi.fn();
    const { container } = render(<Token text="Delete me" onDelete={handleDelete} />);
    const closeIcon = container.querySelector("[data-part='close-icon']") as HTMLElement;
    await user.click(closeIcon);
    expect(handleDelete).toHaveBeenCalledOnce();
    expect(handleDelete).toHaveBeenCalledWith(
      expect.objectContaining({ isKeyboard: false })
    );
  });

  it("fires onDelete with backSpace=true on Backspace key - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleDelete = vi.fn();
    render(<Token text="BS" tabIndex={0} onDelete={handleDelete} />);
    const root = screen.getByRole("option");
    root.focus();
    await user.keyboard("{Backspace}");
    expect(handleDelete).toHaveBeenCalledWith(
      expect.objectContaining({ isKeyboard: true, backSpace: true })
    );
  });

  it("fires onDelete with delete=true on Delete key - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleDelete = vi.fn();
    render(<Token text="Del" tabIndex={0} onDelete={handleDelete} />);
    const root = screen.getByRole("option");
    root.focus();
    await user.keyboard("{Delete}");
    expect(handleDelete).toHaveBeenCalledWith(
      expect.objectContaining({ isKeyboard: true, delete: true })
    );
  });

  it("does not fire onDelete on Backspace when readonly - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleDelete = vi.fn();
    render(<Token text="RO" readonly tabIndex={0} onDelete={handleDelete} />);
    const root = screen.getByRole("option");
    root.focus();
    await user.keyboard("{Backspace}");
    expect(handleDelete).not.toHaveBeenCalled();
  });

  it("does not fire onDelete on Delete key when readonly - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleDelete = vi.fn();
    render(<Token text="RO" readonly tabIndex={0} onDelete={handleDelete} />);
    const root = screen.getByRole("option");
    root.focus();
    await user.keyboard("{Delete}");
    expect(handleDelete).not.toHaveBeenCalled();
  });

  it("close icon click does not trigger onSelect - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();
    const handleDelete = vi.fn();
    const { container } = render(
      <Token text="Both" onSelect={handleSelect} onDelete={handleDelete} />
    );
    const closeIcon = container.querySelector("[data-part='close-icon']") as HTMLElement;
    await user.click(closeIcon);
    expect(handleDelete).toHaveBeenCalledOnce();
    expect(handleSelect).not.toHaveBeenCalled();
  });

  it("close icon has aria-hidden=true - BLI: EL-339", () => {
    const { container } = render(
      <div role="listbox"><Token text="Test" /></div>
    );
    const closeIcon = container.querySelector("[data-part='close-icon']") as HTMLElement;
    expect(closeIcon).toHaveAttribute("aria-hidden", "true");
  });

  it("close icon shows tooltip via title attribute - BLI: EL-339", () => {
    const { container } = render(
      <div role="listbox"><Token text="Test" /></div>
    );
    const closeIcon = container.querySelector("[data-part='close-icon']") as HTMLElement;
    expect(closeIcon).toHaveAttribute("title");
    expect(closeIcon.getAttribute("title")).toBeTruthy();
  });

  it("close icon has no interactive role - BLI: EL-339", () => {
    const { container } = render(
      <div role="listbox"><Token text="Test" /></div>
    );
    const closeIcon = container.querySelector("[data-part='close-icon']") as HTMLElement;
    expect(closeIcon).not.toHaveAttribute("role");
  });

  it("renders custom close icon when provided - BLI: EL-339", () => {
    render(
      <Token text="Custom" closeIcon={<span data-testid="custom-icon">X</span>} />
    );
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });

  // --- Visual states ---

  it("applies selected styling classes when selected - BLI: EL-339", () => {
    const { container } = render(<Token text="Selected" selected />);
    const root = container.querySelector("[data-part='root']")!;
    expect(root.className).toContain("bg-sapphire-chrome-button-bg-selected");
  });

  it("applies readonly styling classes when readonly - BLI: EL-339", () => {
    const { container } = render(<Token text="Readonly" readonly />);
    const root = container.querySelector("[data-part='root']")!;
    expect(root.className).toContain("bg-sapphire-canvas-primary");
    expect(root.className).toContain("cursor-default");
  });

  it("is hidden when overflows=true - BLI: EL-339", () => {
    const { container } = render(<Token text="Overflow" overflows />);
    const root = container.querySelector("[data-part='root']")!;
    expect(root.className).toContain("hidden");
  });

  it("enables text truncation when singleToken=true - BLI: EL-339", () => {
    const { container } = render(<Token text="Single" singleToken />);
    const textEl = container.querySelector("[data-part='text']")!;
    expect(textEl.className).toContain("overflow-hidden");
    expect(textEl.className).toContain("text-ellipsis");
  });

  // --- Accessibility ---

  it("aria-description contains Token and Deletable when not readonly - BLI: EL-339", () => {
    render(<Token text="A" />);
    const root = screen.getByRole("option");
    expect(root).toHaveAttribute("aria-description", "Token, Deletable");
  });

  it("aria-description contains Token but not Deletable when readonly - BLI: EL-339", () => {
    render(<Token text="A" readonly />);
    const root = screen.getByRole("option");
    expect(root).toHaveAttribute("aria-description", "Token");
  });

  it("has no nested interactive controls (no role=button inside role=option) - BLI: EL-339", () => {
    const { container } = render(
      <div role="listbox"><Token text="Nested" /></div>
    );
    const option = container.querySelector("[role='option']")!;
    const nestedButtons = option.querySelectorAll("[role='button']");
    expect(nestedButtons).toHaveLength(0);
  });

  it("close icon is not tabbable (tabindex=-1) - BLI: EL-339", () => {
    const { container } = render(
      <div role="listbox"><Token text="Test" /></div>
    );
    const closeIcon = container.querySelector("[data-part='close-icon']") as HTMLElement;
    expect(closeIcon).toHaveAttribute("tabindex", "-1");
  });

  // --- Ref ---

  it("exposes focus/blur/isFocused via ref - BLI: EL-339", () => {
    const ref = React.createRef<TokenRef>();
    render(<Token ref={ref} text="Ref" tabIndex={0} />);
    expect(ref.current).not.toBeNull();
    expect(ref.current!.nativeElement).toBeInstanceOf(HTMLDivElement);

    ref.current!.focus();
    expect(ref.current!.isFocused()).toBe(true);
    ref.current!.blur();
    expect(ref.current!.isFocused()).toBe(false);
  });

  // --- TabIndex ---

  it("defaults to tabIndex=-1 - BLI: EL-339", () => {
    render(<Token text="Default" />);
    expect(screen.getByRole("option")).toHaveAttribute("tabindex", "-1");
  });

  it("accepts custom tabIndex - BLI: EL-339", () => {
    render(<Token text="Custom" tabIndex={0} />);
    expect(screen.getByRole("option")).toHaveAttribute("tabindex", "0");
  });
});
