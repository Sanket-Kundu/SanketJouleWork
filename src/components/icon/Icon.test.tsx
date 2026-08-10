import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { Icon } from "./Icon";
import { IconDesign, IconMode } from "../../types/icon";
import type { IconRef } from "../../types/icon";

const PATH = ["M256 0 L512 512 L0 512 Z"];
const MULTI_PATH = ["M0 0 H512 V512 H0 Z", "M128 128 H384 V384 H128 Z"];

describe("Icon", () => {
  // --- Null render ---

  it("renders nothing when pathData is undefined - BLI: EL-339", () => {
    const { container } = render(<Icon />);
    expect(container.firstChild).toBeNull();
  });

  it("renders nothing when pathData is an empty array - BLI: EL-339", () => {
    const { container } = render(<Icon pathData={[]} />);
    expect(container.firstChild).toBeNull();
  });

  // --- Basic rendering ---

  it("renders an SVG element when given path data - BLI: EL-339", () => {
    render(<Icon pathData={PATH} data-testid="icon" />);
    expect(screen.getByTestId("icon")).toBeInTheDocument();
    expect(screen.getByTestId("icon").tagName.toLowerCase()).toBe("svg");
  });

  it("renders the correct number of <path> elements - BLI: EL-339", () => {
    const { container } = render(<Icon pathData={MULTI_PATH} />);
    const paths = container.querySelectorAll("path");
    expect(paths).toHaveLength(2);
  });

  it("applies the id prop - BLI: EL-339", () => {
    render(<Icon pathData={PATH} id="my-icon" />);
    expect(document.getElementById("my-icon")).toBeInTheDocument();
  });

  it("applies className - BLI: EL-339", () => {
    render(<Icon pathData={PATH} className="custom-class" data-testid="icon" />);
    expect(screen.getByTestId("icon").getAttribute("class")).toContain("custom-class");
  });

  it("applies inline style - BLI: EL-339", () => {
    render(<Icon pathData={PATH} style={{ opacity: 0.5 }} data-testid="icon" />);
    expect(screen.getByTestId("icon")).toHaveStyle({ opacity: "0.5" });
  });

  it("has default h-4 w-4 size classes - BLI: EL-339", () => {
    render(<Icon pathData={PATH} data-testid="icon" />);
    const el = screen.getByTestId("icon");
    expect(el.getAttribute("class")).toContain("h-4");
    expect(el.getAttribute("class")).toContain("w-4");
  });

  // --- Modes: ARIA roles ---

  it("has role='presentation' in Decorative mode (default) - BLI: EL-339", () => {
    render(<Icon pathData={PATH} data-testid="icon" />);
    expect(screen.getByTestId("icon")).toHaveAttribute("role", "presentation");
  });

  it("has role='img' in Image mode - BLI: EL-339", () => {
    render(<Icon pathData={PATH} mode={IconMode.Image} accessibleName="Chart" data-testid="icon" />);
    expect(screen.getByTestId("icon")).toHaveAttribute("role", "img");
  });

  it("has role='button' in Interactive mode - BLI: EL-339", () => {
    render(<Icon pathData={PATH} mode={IconMode.Interactive} accessibleName="Close" data-testid="icon" />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  // --- ARIA attributes ---

  it("applies aria-label when accessibleName is set - BLI: EL-339", () => {
    render(<Icon pathData={PATH} mode={IconMode.Image} accessibleName="Employee" data-testid="icon" />);
    expect(screen.getByTestId("icon")).toHaveAttribute("aria-label", "Employee");
  });

  it("sets aria-hidden=true when no accessibleName in Decorative mode - BLI: EL-339", () => {
    render(<Icon pathData={PATH} data-testid="icon" />);
    expect(screen.getByTestId("icon")).toHaveAttribute("aria-hidden", "true");
  });

  it("does not set aria-hidden when accessibleName is provided - BLI: EL-339", () => {
    render(<Icon pathData={PATH} mode={IconMode.Image} accessibleName="Info" data-testid="icon" />);
    expect(screen.getByTestId("icon")).not.toHaveAttribute("aria-hidden");
  });

  // --- tabIndex ---

  it("has tabIndex=0 in Interactive mode - BLI: EL-339", () => {
    render(<Icon pathData={PATH} mode={IconMode.Interactive} data-testid="icon" />);
    expect(screen.getByTestId("icon")).toHaveAttribute("tabindex", "0");
  });

  it("has no tabIndex in Decorative mode - BLI: EL-339", () => {
    render(<Icon pathData={PATH} data-testid="icon" />);
    expect(screen.getByTestId("icon")).not.toHaveAttribute("tabindex");
  });

  // --- SVG attributes ---

  it("sets viewBox to '0 0 512 512' - BLI: EL-339", () => {
    render(<Icon pathData={PATH} data-testid="icon" />);
    expect(screen.getByTestId("icon")).toHaveAttribute("viewBox", "0 0 512 512");
  });

  it("sets focusable='true' in Interactive mode - BLI: EL-339", () => {
    render(<Icon pathData={PATH} mode={IconMode.Interactive} data-testid="icon" />);
    expect(screen.getByTestId("icon")).toHaveAttribute("focusable", "true");
  });

  it("sets focusable='false' in Decorative mode - BLI: EL-339", () => {
    render(<Icon pathData={PATH} data-testid="icon" />);
    expect(screen.getByTestId("icon")).toHaveAttribute("focusable", "false");
  });

  // --- Tooltip ---

  it("does not render <title> by default - BLI: EL-339", () => {
    const { container } = render(<Icon pathData={PATH} accessibleName="Save" />);
    expect(container.querySelector("title")).toBeNull();
  });

  it("renders <title> when showTooltip=true and accessibleName is set - BLI: EL-339", () => {
    const { container } = render(
      <Icon pathData={PATH} accessibleName="Save" showTooltip />
    );
    const title = container.querySelector("title");
    expect(title).toBeInTheDocument();
    expect(title!.textContent).toBe("Save");
  });

  it("does not render <title> when showTooltip=true but no accessibleName - BLI: EL-339", () => {
    const { container } = render(<Icon pathData={PATH} showTooltip />);
    expect(container.querySelector("title")).toBeNull();
  });

  // --- Design variants ---

  it.each(Object.values(IconDesign))("renders with design=%s - BLI: EL-339", (design) => {
    render(<Icon pathData={PATH} design={design} data-testid="icon" />);
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("applies Negative design class - BLI: EL-339", () => {
    render(<Icon pathData={PATH} design={IconDesign.Negative} data-testid="icon" />);
    expect(screen.getByTestId("icon").getAttribute("class")).toContain("sapphire-negative");
  });

  it("applies Positive design class - BLI: EL-339", () => {
    render(<Icon pathData={PATH} design={IconDesign.Positive} data-testid="icon" />);
    expect(screen.getByTestId("icon").getAttribute("class")).toContain("sapphire-positive");
  });

  it("applies Critical design class - BLI: EL-339", () => {
    render(<Icon pathData={PATH} design={IconDesign.Critical} data-testid="icon" />);
    expect(screen.getByTestId("icon").getAttribute("class")).toContain("sapphire-warning");
  });

  it("applies Information design class - BLI: EL-339", () => {
    render(<Icon pathData={PATH} design={IconDesign.Information} data-testid="icon" />);
    expect(screen.getByTestId("icon").getAttribute("class")).toContain("sapphire-info");
  });

  it("applies Neutral design class (text-sapphire-text-tertiary) - BLI: EL-339", () => {
    render(<Icon pathData={PATH} design={IconDesign.Neutral} data-testid="icon" />);
    expect(screen.getByTestId("icon").getAttribute("class")).toContain("text-sapphire-text-tertiary");
  });

  it("applies NonInteractive design class with opacity - BLI: EL-339", () => {
    render(<Icon pathData={PATH} design={IconDesign.NonInteractive} data-testid="icon" />);
    const el = screen.getByTestId("icon");
    expect(el.getAttribute("class")).toContain("opacity-60");
  });

  // --- Click handler ---

  it("calls onClick with isKeyboard=false when clicked in Interactive mode - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <Icon pathData={PATH} mode={IconMode.Interactive} onClick={handleClick} data-testid="icon" />
    );
    await user.click(screen.getByTestId("icon"));
    expect(handleClick).toHaveBeenCalledOnce();
    expect(handleClick).toHaveBeenCalledWith(
      expect.objectContaining({ isKeyboard: false })
    );
  });

  it("does NOT call onClick when clicked in Decorative mode - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <Icon pathData={PATH} mode={IconMode.Decorative} onClick={handleClick} data-testid="icon" />
    );
    await user.click(screen.getByTestId("icon"));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("does NOT call onClick when clicked in Image mode - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <Icon pathData={PATH} mode={IconMode.Image} onClick={handleClick} data-testid="icon" />
    );
    await user.click(screen.getByTestId("icon"));
    expect(handleClick).not.toHaveBeenCalled();
  });

  // --- Keyboard handler ---

  it("calls onClick with isKeyboard=true on Enter key in Interactive mode - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <Icon pathData={PATH} mode={IconMode.Interactive} onClick={handleClick} data-testid="icon" />
    );
    screen.getByTestId("icon").focus();
    await user.keyboard("{Enter}");
    expect(handleClick).toHaveBeenCalledWith(
      expect.objectContaining({ isKeyboard: true })
    );
  });

  it("calls onClick with isKeyboard=true on Space key in Interactive mode - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <Icon pathData={PATH} mode={IconMode.Interactive} onClick={handleClick} data-testid="icon" />
    );
    screen.getByTestId("icon").focus();
    await user.keyboard(" ");
    expect(handleClick).toHaveBeenCalledWith(
      expect.objectContaining({ isKeyboard: true })
    );
  });

  it("does NOT call onClick on Enter in Decorative mode - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <Icon pathData={PATH} mode={IconMode.Decorative} onClick={handleClick} data-testid="icon" />
    );
    await user.keyboard("{Enter}");
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("does not call onClick for unrelated keys - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <Icon pathData={PATH} mode={IconMode.Interactive} onClick={handleClick} data-testid="icon" />
    );
    screen.getByTestId("icon").focus();
    await user.keyboard("{Escape}");
    expect(handleClick).not.toHaveBeenCalled();
  });

  // --- Interactive mode styling ---

  it("applies cursor-pointer class in Interactive mode - BLI: EL-339", () => {
    render(<Icon pathData={PATH} mode={IconMode.Interactive} data-testid="icon" />);
    expect(screen.getByTestId("icon").getAttribute("class")).toContain("cursor-pointer");
  });

  // --- Ref ---

  it("exposes focus, blur, isFocused, and nativeElement via ref - BLI: EL-339", () => {
    const ref = React.createRef<IconRef>();
    render(<Icon pathData={PATH} mode={IconMode.Interactive} ref={ref} data-testid="icon" />);
    expect(ref.current).not.toBeNull();
    expect(ref.current!.nativeElement).toBeInstanceOf(SVGSVGElement);

    ref.current!.focus();
    expect(ref.current!.isFocused()).toBe(true);
    ref.current!.blur();
    expect(ref.current!.isFocused()).toBe(false);
  });
});
