import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { Avatar } from "./Avatar";
import { AvatarShape, AvatarSize, AvatarColorScheme } from "../../types/avatar";
import type { AvatarRef } from "../../types/avatar";

describe("Avatar", () => {
  // --- Rendering ---

  it("renders with default placeholder icon - BLI: EL-339", () => {
    render(<Avatar accessibleName="User" />);
    expect(screen.getByRole("img", { name: "User" })).toBeInTheDocument();
  });

  it("renders with initials - BLI: EL-339", () => {
    render(<Avatar initials="JD" />);
    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("truncates initials to 3 characters - BLI: EL-339", () => {
    render(<Avatar initials="ABCD" />);
    expect(screen.getByText("ABC")).toBeInTheDocument();
  });

  it("renders with custom icon - BLI: EL-339", () => {
    render(<Avatar icon={<span data-testid="custom-icon">★</span>} />);
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });

  it("renders with image - BLI: EL-339", () => {
    render(<Avatar image="/user.jpg" accessibleName="John" />);
    const img = screen.getByAltText("John");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/user.jpg");
  });

  // --- Image Error Fallback ---

  it("falls back to fallbackImage on image error - BLI: EL-339", () => {
    render(<Avatar image="/bad.jpg" fallbackImage="/fallback.jpg" accessibleName="User" />);
    const img = screen.getByAltText("User");
    fireEvent.error(img);
    // After primary error, fallback image should be shown
    const fallbackImg = screen.getByAltText("User");
    expect(fallbackImg).toHaveAttribute("src", "/fallback.jpg");
  });

  it("falls back to initials when both images fail - BLI: EL-339", () => {
    render(<Avatar image="/bad.jpg" fallbackImage="/bad2.jpg" initials="AB" accessibleName="User" />);
    // Fail primary image
    fireEvent.error(screen.getByAltText("User"));
    // Fail fallback image
    fireEvent.error(screen.getByAltText("User"));
    expect(screen.getByText("AB")).toBeInTheDocument();
  });

  it("falls back to default icon when image fails and no initials - BLI: EL-339", () => {
    render(<Avatar image="/bad.jpg" accessibleName="User" />);
    fireEvent.error(screen.getByAltText("User"));
    // Default User icon should render (SVG)
    expect(screen.getByRole("img", { name: "User" })).toBeInTheDocument();
  });

  // --- Shapes ---

  it.each([AvatarShape.Circle, AvatarShape.Square])(
    "renders with shape=%s",
    (shape) => {
      render(<Avatar shape={shape} accessibleName="User" />);
      expect(screen.getByRole("img")).toBeInTheDocument();
    }
  );

  // --- Sizes ---

  it.each([AvatarSize.XS, AvatarSize.S, AvatarSize.M, AvatarSize.L, AvatarSize.XL])(
    "renders with size=%s",
    (size) => {
      render(<Avatar size={size} accessibleName="User" />);
      expect(screen.getByRole("img")).toBeInTheDocument();
    }
  );

  // --- Color Schemes ---

  it.each(Object.values(AvatarColorScheme))(
    "renders with colorScheme=%s",
    (colorScheme) => {
      render(<Avatar colorScheme={colorScheme} initials="A" />);
      expect(screen.getByText("A")).toBeInTheDocument();
    }
  );

  it("applies accent color CSS class for accent colorScheme", () => {
    const { container } = render(
      <Avatar colorScheme={AvatarColorScheme.Accent1} initials="A" />
    );
    const avatar = container.querySelector("[role='img']") as HTMLElement;
    expect(avatar.className).toContain("bg-sapphire-accent-bg-1");
    expect(avatar.className).toContain("text-sapphire-accent-1");
  });

  it("does not apply accent classes for Placeholder colorScheme", () => {
    const { container } = render(
      <Avatar colorScheme={AvatarColorScheme.Placeholder} initials="A" />
    );
    const avatar = container.querySelector("[role='img']") as HTMLElement;
    expect(avatar.className).not.toContain("avatar-accent");
  });

  // --- Interactive ---

  it("renders as button when interactive - BLI: EL-339", () => {
    render(<Avatar interactive accessibleName="User" />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("is focusable when interactive - BLI: EL-339", () => {
    render(<Avatar interactive accessibleName="User" />);
    expect(screen.getByRole("button")).toHaveAttribute("tabindex", "0");
  });

  it("is not focusable when interactive but disabled - BLI: EL-339", () => {
    render(<Avatar interactive disabled accessibleName="User" />);
    expect(screen.getByRole("button")).not.toHaveAttribute("tabindex");
  });

  it("calls onClick when interactive and clicked - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Avatar interactive onClick={handleClick} accessibleName="User" />);
    await user.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it("does not call onClick when disabled - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Avatar interactive disabled onClick={handleClick} accessibleName="User" />);
    await user.click(screen.getByRole("button"));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("does not call onClick when not interactive - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Avatar onClick={handleClick} accessibleName="User" />);
    await user.click(screen.getByRole("img"));
    expect(handleClick).not.toHaveBeenCalled();
  });

  // --- Keyboard ---

  it("activates on Enter when interactive - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Avatar interactive onClick={handleClick} accessibleName="User" />);
    screen.getByRole("button").focus();
    await user.keyboard("{Enter}");
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it("activates on Space when interactive - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Avatar interactive onClick={handleClick} accessibleName="User" />);
    screen.getByRole("button").focus();
    await user.keyboard(" ");
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it("does not fire onClick on Space keydown, only on keyup", () => {
    const handleClick = vi.fn();
    render(<Avatar interactive onClick={handleClick} accessibleName="User" />);
    const button = screen.getByRole("button");
    fireEvent.keyDown(button, { key: " " });
    expect(handleClick).not.toHaveBeenCalled();
    fireEvent.keyUp(button, { key: " " });
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it("fires onClick on Enter keydown immediately", () => {
    const handleClick = vi.fn();
    render(<Avatar interactive onClick={handleClick} accessibleName="User" />);
    const button = screen.getByRole("button");
    fireEvent.keyDown(button, { key: "Enter" });
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it("does not activate on keyboard when disabled - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Avatar interactive disabled onClick={handleClick} accessibleName="User" />);
    screen.getByRole("button").focus();
    await user.keyboard("{Enter}");
    expect(handleClick).not.toHaveBeenCalled();
  });

  // --- Badge ---

  it("renders badge content - BLI: EL-339", () => {
    render(
      <Avatar accessibleName="User" badge={<span data-testid="badge">3</span>} />
    );
    expect(screen.getByTestId("badge")).toBeInTheDocument();
  });

  // --- Ref ---

  it("exposes focus and isFocused via ref - BLI: EL-339", () => {
    const ref = React.createRef<AvatarRef>();
    render(<Avatar ref={ref} interactive accessibleName="User" />);
    expect(ref.current).not.toBeNull();
    expect(ref.current!.getNativeElement()).toBeInstanceOf(HTMLDivElement);
    expect(ref.current!.nativeElement).toBeInstanceOf(HTMLDivElement);

    ref.current!.focus();
    expect(ref.current!.isFocused()).toBe(true);
  });

  // --- Default accessibleName ---

  it("has default aria-label 'Avatar' when no accessibleName or initials provided - BLI: EL-339", () => {
    render(<Avatar />);
    expect(screen.getByRole("img")).toHaveAttribute("aria-label", "Avatar");
  });

  it("appends initials to default accessibleName - BLI: EL-339", () => {
    render(<Avatar initials="JD" />);
    expect(screen.getByRole("img")).toHaveAttribute("aria-label", "Avatar JD");
  });

  // --- Styling ---

  it("applies className and style - BLI: EL-339", () => {
    render(<Avatar className="custom" style={{ opacity: 0.5 }} accessibleName="User" />);
    const avatar = screen.getByRole("img");
    expect(avatar.className).toContain("custom");
    expect(avatar).toHaveStyle({ opacity: "0.5" });
  });
});
