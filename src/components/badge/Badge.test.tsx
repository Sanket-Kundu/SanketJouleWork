import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { Badge } from "./Badge";
import { BadgeVariant, BadgeDesign, BadgeSize, BadgeWrappingType } from "../../types/badge";
import type { BadgeRef } from "../../types/badge";

describe("Badge", () => {
  // --- Rendering ---

  it("renders text content - BLI: EL-339", () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("renders with data-testid - BLI: EL-339", () => {
    render(<Badge data-testid="my-badge">Test</Badge>);
    expect(screen.getByTestId("my-badge")).toBeInTheDocument();
  });

  it("applies id, className, and style - BLI: EL-339", () => {
    render(<Badge id="b1" className="custom" style={{ opacity: 0.5 }}>X</Badge>);
    const el = document.getElementById("b1")!;
    expect(el).toBeInTheDocument();
    expect(el.className).toContain("custom");
    expect(el).toHaveStyle({ opacity: "0.5" });
  });

  // --- Variants ---

  it.each(Object.values(BadgeVariant))("renders with variant=%s - BLI: EL-339", (variant) => {
    render(<Badge variant={variant}>Badge</Badge>);
    expect(screen.getByText("Badge")).toBeInTheDocument();
  });

  // --- Designs ---

  it.each(Object.values(BadgeDesign))("renders with design=%s - BLI: EL-339", (design) => {
    render(<Badge design={design}>Status</Badge>);
    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  // --- Sizes ---

  it.each(Object.values(BadgeSize))("renders with size=%s - BLI: EL-339", (size) => {
    render(<Badge size={size}>Tag</Badge>);
    expect(screen.getByText("Tag")).toBeInTheDocument();
  });

  // --- Dot Icon ---

  it("shows dot icon for Minimal variant by default - BLI: EL-339", () => {
    render(<Badge variant="Minimal" design="Positive">OK</Badge>);
    const dot = document.querySelector("[aria-hidden='true']");
    expect(dot).toBeInTheDocument();
  });

  it("shows dot icon for Outline variant - BLI: EL-339", () => {
    render(<Badge variant="Outline" design="Negative">Error</Badge>);
    const dot = document.querySelector("[aria-hidden='true']");
    expect(dot).toBeInTheDocument();
  });

  it("shows dot icon for Tinted variant - BLI: EL-339", () => {
    render(<Badge variant="Tinted" design="Critical">Warning</Badge>);
    const dot = document.querySelector("[aria-hidden='true']");
    expect(dot).toBeInTheDocument();
  });

  it("does not show dot icon for Filled variant - BLI: EL-339", () => {
    const { container } = render(<Badge variant="Filled" design="Positive">OK</Badge>);
    const dot = container.querySelector("[data-part='icon']");
    expect(dot).not.toBeInTheDocument();
  });

  it("hides dot icon when hideStateIcon is true - BLI: EL-339", () => {
    const { container } = render(
      <Badge variant="Minimal" design="Positive" hideStateIcon>OK</Badge>
    );
    const icon = container.querySelector("[data-part='icon']");
    expect(icon).not.toBeInTheDocument();
  });

  it("uses custom icon instead of dot - BLI: EL-339", () => {
    render(
      <Badge variant="Minimal" icon={<span data-testid="custom">★</span>}>Star</Badge>
    );
    expect(screen.getByTestId("custom")).toBeInTheDocument();
  });

  // --- Dot size for Large ---

  it("renders larger dot for size L - BLI: EL-339", () => {
    const { container } = render(<Badge variant="Minimal" size="L" design="Information">Info</Badge>);
    const dot = container.querySelector("[aria-hidden='true']");
    expect(dot?.className).toContain("w-2.5");
  });

  // --- Wrapping ---

  it("truncates text when wrappingType is None - BLI: EL-339", () => {
    const { container } = render(<Badge wrappingType={BadgeWrappingType.None}>Long text</Badge>);
    expect(container.querySelector("[data-part='root']")!.className).toContain("whitespace-nowrap");
  });

  // --- Interactive ---

  it("renders as button role when interactive - BLI: EL-339", () => {
    render(<Badge interactive>Click me</Badge>);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("is focusable when interactive - BLI: EL-339", () => {
    render(<Badge interactive>Click</Badge>);
    expect(screen.getByRole("button")).toHaveAttribute("tabindex", "0");
  });

  it("calls onClick when interactive and clicked - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Badge interactive onClick={handleClick}>Go</Badge>);
    await user.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledOnce();
    expect(handleClick).toHaveBeenCalledWith(expect.objectContaining({ isKeyboard: false }));
  });

  it("does not call onClick when not interactive - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Badge onClick={handleClick}>No click</Badge>);
    await user.click(screen.getByText("No click"));
    expect(handleClick).not.toHaveBeenCalled();
  });

  // --- Keyboard ---

  it("triggers onClick with isKeyboard=true on Enter - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Badge interactive onClick={handleClick}>Press</Badge>);
    screen.getByRole("button").focus();
    await user.keyboard("{Enter}");
    expect(handleClick).toHaveBeenCalledWith(expect.objectContaining({ isKeyboard: true }));
  });

  it("triggers onClick with isKeyboard=true on Space - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Badge interactive onClick={handleClick}>Press</Badge>);
    screen.getByRole("button").focus();
    await user.keyboard(" ");
    expect(handleClick).toHaveBeenCalledWith(expect.objectContaining({ isKeyboard: true }));
  });

  it("does not trigger keyboard events when not interactive - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Badge onClick={handleClick}>Nope</Badge>);
    const el = screen.getByText("Nope").closest("[data-part='root']")!;
    (el as HTMLElement).focus();
    await user.keyboard("{Enter}");
    expect(handleClick).not.toHaveBeenCalled();
  });

  // --- Accessibility ---

  it("applies aria-label - BLI: EL-339", () => {
    render(<Badge interactive accessibleName="Status badge">OK</Badge>);
    expect(screen.getByRole("button")).toHaveAttribute("aria-label", "Status badge");
  });

  it("applies aria-labelledby - BLI: EL-339", () => {
    render(<Badge interactive accessibleNameRef="label-1">OK</Badge>);
    expect(screen.getByRole("button")).toHaveAttribute("aria-labelledby", "label-1");
  });

  // --- Ref ---

  it("exposes focus/blur/isFocused via ref - BLI: EL-339", () => {
    const ref = React.createRef<BadgeRef>();
    render(<Badge ref={ref} interactive>Ref</Badge>);
    expect(ref.current).not.toBeNull();
    expect(ref.current!.nativeElement).toBeInstanceOf(HTMLSpanElement);

    ref.current!.focus();
    expect(ref.current!.isFocused()).toBe(true);
    ref.current!.blur();
    expect(ref.current!.isFocused()).toBe(false);
  });

  it("sets aria-describedby when accessibleDescription provided - BLI: EL-339", () => {
    render(<Badge accessibleDescription="3 new notifications">3</Badge>);
    const badge = screen.getByText("3").closest("[aria-describedby]");
    expect(badge).toBeTruthy();
    const describedById = badge!.getAttribute("aria-describedby")!;
    const descriptionEl = document.getElementById(describedById);
    expect(descriptionEl).toBeInTheDocument();
    expect(descriptionEl!.textContent).toBe("3 new notifications");
  });

  // --- showBorder ---

  it("Tinted shows border by default", () => {
    const { container } = render(<Badge variant="Tinted" design="Positive">OK</Badge>);
    const root = container.querySelector("[data-part='root']")!;
    expect(root.className).toMatch(/\bborder\b/);
  });

  it("Tinted hides border when showBorder={false}", () => {
    const { container } = render(<Badge variant="Tinted" design="Positive" showBorder={false}>OK</Badge>);
    const root = container.querySelector("[data-part='root']")!;
    expect(root.className).not.toMatch(/\bborder\b/);
  });

  it("Tinted with showBorder={false} still shows dot icon", () => {
    const { container } = render(<Badge variant="Tinted" design="Positive" showBorder={false}>OK</Badge>);
    const dot = container.querySelector("[aria-hidden='true']");
    expect(dot).toBeInTheDocument();
  });

  it("Tinted with showBorder={false} uses font-normal", () => {
    const { container } = render(<Badge variant="Tinted" design="Positive" showBorder={false}>OK</Badge>);
    const root = container.querySelector("[data-part='root']")!;
    expect(root.className).toContain("font-normal");
    expect(root.className).not.toContain("font-semibold");
  });

  it("showBorder has no effect on Filled variant", () => {
    const { container } = render(<Badge variant="Filled" design="Positive" showBorder={false}>OK</Badge>);
    const root = container.querySelector("[data-part='root']")!;
    // Filled never has border regardless of showBorder
    expect(root.className).not.toMatch(/\bborder\b/);
    expect(root.className).toContain("font-semibold");
  });
});
