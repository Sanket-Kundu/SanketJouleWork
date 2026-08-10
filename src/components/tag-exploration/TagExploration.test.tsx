import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { TagExploration as Tag } from "./TagExploration";
import { TagExplorationDesign as TagDesign, TagExplorationWrappingType as TagWrappingType, TagExplorationColorScheme as TagColorScheme } from "../../types/tag-exploration";
import type { TagExplorationRef as TagRef } from "../../types/tag-exploration";

describe("Tag", () => {
  // --- Rendering ---

  it("renders text content - BLI: EL-339", () => {
    render(<Tag>Active</Tag>);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("renders with data-testid - BLI: EL-339", () => {
    render(<Tag data-testid="my-tag">Test</Tag>);
    expect(screen.getByTestId("my-tag")).toBeInTheDocument();
  });

  it("applies id, className, and style - BLI: EL-339", () => {
    render(<Tag id="t1" className="custom" style={{ opacity: 0.5 }}>X</Tag>);
    const el = document.getElementById("t1")!;
    expect(el).toBeInTheDocument();
    expect(el.className).toContain("custom");
    expect(el).toHaveStyle({ opacity: "0.5" });
  });

  // --- Designs ---

  it.each([
    TagDesign.Neutral,
    TagDesign.Information,
    TagDesign.Positive,
    TagDesign.Negative,
    TagDesign.Critical,
  ])("renders with semantic design=%s - BLI: EL-339", (design) => {
    render(<Tag design={design}>Status</Tag>);
    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  it("renders with Set1 design - BLI: EL-339", () => {
    render(<Tag design="Set1" colorScheme="1">Set1</Tag>);
    expect(screen.getByText("Set1")).toBeInTheDocument();
  });

  it("renders with Set2 design - BLI: EL-339", () => {
    render(<Tag design="Set2" colorScheme="2">Set2</Tag>);
    expect(screen.getByText("Set2")).toBeInTheDocument();
  });

  // --- Sizes ---

  it("renders size S with rounded-full (pill shape) - BLI: EL-339", () => {
    const { container } = render(<Tag size="S">Small</Tag>);
    expect(container.querySelector("[data-part='root']")!.className).toContain("rounded-full");
  });

  it("renders size L with rounded-full - BLI: EL-339", () => {
    const { container } = render(<Tag size="L">Large</Tag>);
    expect(container.querySelector("[data-part='root']")!.className).toContain("rounded-full");
  });

  // --- State Icons ---

  it("shows state icon for Positive design by default - BLI: EL-339", () => {
    const { container } = render(<Tag design="Positive">OK</Tag>);
    const icon = container.querySelector("[data-part='icon']");
    expect(icon).toBeInTheDocument();
  });

  it("shows state icon for Negative design by default - BLI: EL-339", () => {
    const { container } = render(<Tag design="Negative">Error</Tag>);
    const icon = container.querySelector("[data-part='icon']");
    expect(icon).toBeInTheDocument();
  });

  it("shows state icon for Critical design by default - BLI: EL-339", () => {
    const { container } = render(<Tag design="Critical">Warning</Tag>);
    const icon = container.querySelector("[data-part='icon']");
    expect(icon).toBeInTheDocument();
  });

  it("shows state icon for Information design by default - BLI: EL-339", () => {
    const { container } = render(<Tag design="Information">Info</Tag>);
    const icon = container.querySelector("[data-part='icon']");
    expect(icon).toBeInTheDocument();
  });

  it("shows state icon for Neutral design by default - BLI: EL-339", () => {
    const { container } = render(<Tag design="Neutral">Default</Tag>);
    const icon = container.querySelector("[data-part='icon']");
    expect(icon).toBeInTheDocument();
  });

  it("hides state icon when hideStateIcon is true - BLI: EL-339", () => {
    const { container } = render(
      <Tag design="Positive" hideStateIcon>OK</Tag>
    );
    const icon = container.querySelector("[data-part='icon']");
    expect(icon).not.toBeInTheDocument();
  });

  it("uses custom icon instead of state icon - BLI: EL-339", () => {
    render(
      <Tag design="Positive" icon={<span data-testid="custom">★</span>}>Star</Tag>
    );
    expect(screen.getByTestId("custom")).toBeInTheDocument();
  });

  it("does not show state icon for Set1 design - BLI: EL-339", () => {
    const { container } = render(<Tag design="Set1" colorScheme="1">S1</Tag>);
    const icon = container.querySelector("[data-part='icon']");
    expect(icon).not.toBeInTheDocument();
  });

  it("does not show state icon for Set2 design - BLI: EL-339", () => {
    const { container } = render(<Tag design="Set2" colorScheme="1">S2</Tag>);
    const icon = container.querySelector("[data-part='icon']");
    expect(icon).not.toBeInTheDocument();
  });

  // --- Color Schemes ---

  it.each(Object.values(TagColorScheme))("renders Set1 with colorScheme=%s - BLI: EL-339", (cs) => {
    render(<Tag design="Set1" colorScheme={cs}>CS{cs}</Tag>);
    expect(screen.getByText(`CS${cs}`)).toBeInTheDocument();
  });

  it.each(Object.values(TagColorScheme))("renders Set2 with colorScheme=%s - BLI: EL-339", (cs) => {
    render(<Tag design="Set2" colorScheme={cs}>CS{cs}</Tag>);
    expect(screen.getByText(`CS${cs}`)).toBeInTheDocument();
  });

  // --- Wrapping ---

  it("truncates text when wrappingType is None (default) - BLI: EL-339", () => {
    const { container } = render(<Tag>Long text</Tag>);
    expect(container.querySelector("[data-part='text']")!.className).toContain("overflow-hidden");
    expect(container.querySelector("[data-part='text']")!.className).toContain("text-ellipsis");
  });

  it("wraps text when wrappingType is Normal - BLI: EL-339", () => {
    const { container } = render(<Tag wrappingType={TagWrappingType.Normal}>Long text</Tag>);
    expect(container.querySelector("[data-part='text']")!.className).toContain("whitespace-normal");
  });

  // --- Interactive ---

  it("renders as button role when interactive - BLI: EL-339", () => {
    render(<Tag interactive>Click me</Tag>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("is focusable when interactive - BLI: EL-339", () => {
    render(<Tag interactive>Click</Tag>);
    const root = document.querySelector("[data-part='root']") as HTMLElement;
    expect(root).toHaveAttribute("tabindex", "0");
  });

  it("calls onClick when interactive and clicked - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Tag interactive onClick={handleClick}>Go</Tag>);
    await user.click(screen.getByText("Go"));
    expect(handleClick).toHaveBeenCalledOnce();
    expect(handleClick).toHaveBeenCalledWith(expect.objectContaining({ isKeyboard: false }));
  });

  it("does not call onClick when not interactive - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Tag onClick={handleClick}>No click</Tag>);
    await user.click(screen.getByText("No click"));
    expect(handleClick).not.toHaveBeenCalled();
  });

  // --- Keyboard ---

  it("triggers onClick with isKeyboard=true on Enter - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Tag interactive onClick={handleClick}>Press</Tag>);
    const root = document.querySelector("[data-part='root']") as HTMLElement;
    root.focus();
    await user.keyboard("{Enter}");
    expect(handleClick).toHaveBeenCalledWith(expect.objectContaining({ isKeyboard: true }));
  });

  it("triggers onClick with isKeyboard=true on Space - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Tag interactive onClick={handleClick}>Press</Tag>);
    const root = document.querySelector("[data-part='root']") as HTMLElement;
    root.focus();
    await user.keyboard(" ");
    expect(handleClick).toHaveBeenCalledWith(expect.objectContaining({ isKeyboard: true }));
  });

  // --- Close Button ---

  it("renders close button when onClose is provided - BLI: EL-339", () => {
    render(<Tag onClose={() => {}}>Closable</Tag>);
    const closeBtn = document.querySelector("[data-part='close']");
    expect(closeBtn).toBeInTheDocument();
  });

  it("does not render close button when onClose is not provided - BLI: EL-339", () => {
    render(<Tag>No close</Tag>);
    const closeBtn = document.querySelector("[data-part='close']");
    expect(closeBtn).not.toBeInTheDocument();
  });

  it("fires onClose when close button is clicked - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    render(<Tag onClose={handleClose}>Remove me</Tag>);
    const closeBtn = document.querySelector("[data-part='close']") as HTMLElement;
    await user.click(closeBtn);
    expect(handleClose).toHaveBeenCalledOnce();
    expect(handleClose).toHaveBeenCalledWith(expect.objectContaining({ isKeyboard: false }));
  });

  it("fires onClose with isKeyboard on Enter - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    render(<Tag onClose={handleClose}>Remove</Tag>);
    const closeBtn = document.querySelector("[data-part='close']") as HTMLElement;
    closeBtn.focus();
    await user.keyboard("{Enter}");
    expect(handleClose).toHaveBeenCalledWith(expect.objectContaining({ isKeyboard: true }));
  });

  it("close button click does not trigger tag onClick - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    const handleClose = vi.fn();
    render(<Tag interactive onClick={handleClick} onClose={handleClose}>Both</Tag>);
    const closeBtn = document.querySelector("[data-part='close']") as HTMLElement;
    await user.click(closeBtn);
    expect(handleClose).toHaveBeenCalledOnce();
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("close button has aria-label Remove - BLI: EL-339", () => {
    render(<Tag onClose={() => {}}>Test</Tag>);
    const closeBtn = document.querySelector("[data-part='close']") as HTMLElement;
    expect(closeBtn).toHaveAttribute("aria-label", "Remove");
  });

  // --- Accessibility ---

  it("applies aria-label - BLI: EL-339", () => {
    render(<Tag interactive accessibleName="Status tag">OK</Tag>);
    const root = document.querySelector("[data-part='root']") as HTMLElement;
    expect(root).toHaveAttribute("aria-label", "Status tag");
  });

  it("applies aria-labelledby - BLI: EL-339", () => {
    render(<Tag interactive accessibleNameRef="label-1">OK</Tag>);
    const root = document.querySelector("[data-part='root']") as HTMLElement;
    expect(root).toHaveAttribute("aria-labelledby", "label-1");
  });

  // --- Ref ---

  it("exposes focus/blur/isFocused via ref - BLI: EL-339", () => {
    const ref = React.createRef<TagRef>();
    render(<Tag ref={ref} interactive>Ref</Tag>);
    expect(ref.current).not.toBeNull();
    expect(ref.current!.nativeElement).toBeInstanceOf(HTMLSpanElement);

    ref.current!.focus();
    expect(ref.current!.isFocused()).toBe(true);
    ref.current!.blur();
    expect(ref.current!.isFocused()).toBe(false);
  });

  // --- Figma spec: Border ---

  it("Neutral design has border-sapphire-tag-border class", () => {
    const { container } = render(<Tag design="Neutral">Bordered</Tag>);
    expect(container.querySelector("[data-part='root']")!.className).toContain("border-sapphire-tag-border");
  });

  // --- Figma spec: Accent ---

  it("accent variant has bg-sapphire-tag-accent-bg class", () => {
    const { container } = render(<Tag accent>Accent</Tag>);
    expect(container.querySelector("[data-part='root']")!.className).toContain("bg-sapphire-tag-accent-bg");
  });

  // --- Figma spec: ReadOnly ---

  it("readOnly applies opacity-40 class", () => {
    const { container } = render(<Tag readOnly>Read Only</Tag>);
    expect(container.querySelector("[data-part='root']")!.className).toContain("opacity-40");
  });

  it("readOnly hides close button even when onClose is provided", () => {
    render(<Tag readOnly onClose={() => {}}>Read Only</Tag>);
    const closeBtn = document.querySelector("[data-part='close']");
    expect(closeBtn).not.toBeInTheDocument();
  });

  it("readOnly + interactive is not focusable", () => {
    const { container } = render(<Tag readOnly interactive>Read Only</Tag>);
    const root = container.querySelector("[data-part='root']") as HTMLElement;
    expect(root).not.toHaveAttribute("tabindex");
  });
});
