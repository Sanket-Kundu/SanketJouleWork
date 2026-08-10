import { describe, it, expect, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import React from "react";
import { BusyIndicator } from "./BusyIndicator";
import { BusyIndicatorSize } from "../../types/busy-indicator";
import type { BusyIndicatorRef } from "../../types/busy-indicator";

describe("BusyIndicator", () => {
  // --- Rendering (inactive) ---

  it("renders without indicator when not active - BLI: EL-339", () => {
    render(<BusyIndicator data-testid="bi" />);
    expect(screen.getByTestId("bi")).toBeInTheDocument();
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it("renders children - BLI: EL-339", () => {
    render(<BusyIndicator><p>Content</p></BusyIndicator>);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  // --- Active with delay ---

  it("shows indicator after default delay - BLI: EL-339", () => {
    vi.useFakeTimers();
    render(<BusyIndicator active data-testid="bi" />);
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();

    act(() => { vi.advanceTimersByTime(1000); });
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    vi.useRealTimers();
  });

  it("shows indicator immediately with delay=0 - BLI: EL-339", () => {
    render(<BusyIndicator active delay={0} />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("shows indicator after custom delay - BLI: EL-339", () => {
    vi.useFakeTimers();
    render(<BusyIndicator active delay={500} />);
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();

    act(() => { vi.advanceTimersByTime(500); });
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    vi.useRealTimers();
  });

  it("hides indicator when active becomes false - BLI: EL-339", () => {
    vi.useFakeTimers();
    const { rerender } = render(<BusyIndicator active delay={0} />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();

    rerender(<BusyIndicator active={false} delay={0} />);
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    vi.useRealTimers();
  });

  // --- Text ---

  it("displays text when active - BLI: EL-339", () => {
    render(<BusyIndicator active delay={0} text="Loading..." />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("uses text as aria-labelledby - BLI: EL-339", () => {
    render(<BusyIndicator active delay={0} text="Loading..." />);
    const progressbar = screen.getByRole("progressbar");
    expect(progressbar).toHaveAttribute("aria-labelledby");
  });

  it("uses accessibleName when no text - BLI: EL-339", () => {
    render(<BusyIndicator active delay={0} accessibleName="Processing" />);
    const progressbar = screen.getByRole("progressbar");
    expect(progressbar).toHaveAttribute("aria-label", "Processing");
  });

  it("falls back to 'Please wait' when no text or accessibleName - BLI: EL-339", () => {
    render(<BusyIndicator active delay={0} />);
    const progressbar = screen.getByRole("progressbar");
    expect(progressbar).toHaveAttribute("aria-label", "Please wait");
    expect(progressbar).toHaveAttribute("title", "Please wait");
  });

  it("sets title from accessibleName when no text - BLI: EL-339", () => {
    render(<BusyIndicator active delay={0} accessibleName="Loading data" />);
    const progressbar = screen.getByRole("progressbar");
    expect(progressbar).toHaveAttribute("aria-label", "Loading data");
    expect(progressbar).toHaveAttribute("title", "Loading data");
  });

  it("does not set title when text prop is provided - BLI: EL-339", () => {
    render(<BusyIndicator active delay={0} text="Processing..." />);
    const progressbar = screen.getByRole("progressbar");
    expect(progressbar).not.toHaveAttribute("title");
    expect(progressbar).toHaveAttribute("aria-labelledby");
  });

  it("does not set title when both text and accessibleName are provided - BLI: EL-339", () => {
    render(<BusyIndicator active delay={0} text="Processing..." accessibleName="Custom name" />);
    const progressbar = screen.getByRole("progressbar");
    // When text is present, use aria-labelledby instead of aria-label/title
    expect(progressbar).not.toHaveAttribute("title");
    expect(progressbar).not.toHaveAttribute("aria-label");
    expect(progressbar).toHaveAttribute("aria-labelledby");
  });

  // --- Text placement ---

  it("renders text below dots by default (Bottom) - BLI: EL-339", () => {
    render(<BusyIndicator active delay={0} text="Loading..." />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders text above dots when textPlacement=Top - BLI: EL-339", () => {
    render(<BusyIndicator active delay={0} text="Loading..." textPlacement="Top" />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  // --- Sizes ---

  it.each(Object.values(BusyIndicatorSize))("renders with size=%s - BLI: EL-339", (size) => {
    render(<BusyIndicator active delay={0} size={size} data-testid="bi" />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  // --- Overlay on children ---

  it("dims children when active - BLI: EL-339", () => {
    render(
      <BusyIndicator active delay={0}>
        <p>Content</p>
      </BusyIndicator>
    );
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("makes children inert when busy - BLI: EL-339", () => {
    const { container } = render(
      <BusyIndicator active delay={0}>
        <p>Content</p>
      </BusyIndicator>
    );
    const contentWrapper = container.querySelector("[inert]");
    expect(contentWrapper).toBeInTheDocument();
  });

  // --- Props ---

  it("applies id, className, style, and data-testid - BLI: EL-339", () => {
    render(
      <BusyIndicator id="bi-1" className="custom" style={{ width: "100px" }} data-testid="bi">
        <p>Content</p>
      </BusyIndicator>
    );
    const el = screen.getByTestId("bi");
    expect(el).toHaveAttribute("id", "bi-1");
    expect(el.className).toContain("custom");
  });

  // --- Ref ---

  it("exposes focus/blur/isFocused via ref when not busy - BLI: EL-339", () => {
    const ref = React.createRef<BusyIndicatorRef>();
    render(<BusyIndicator ref={ref} data-testid="bi" />);
    expect(ref.current).not.toBeNull();
    expect(ref.current!.nativeElement).toBeInstanceOf(HTMLDivElement);
  });

  it("focuses overlay when busy - BLI: EL-339", () => {
    const ref = React.createRef<BusyIndicatorRef>();
    render(<BusyIndicator ref={ref} active delay={0} />);
    ref.current!.focus();
    expect(ref.current!.isFocused()).toBe(true);
    ref.current!.blur();
    expect(ref.current!.isFocused()).toBe(false);
  });
});
