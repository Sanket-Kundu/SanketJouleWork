import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { ProgressIndicator } from "./ProgressIndicator";
import { ProgressIndicatorValueState } from "../../types/progress-indicator";
import type { ProgressIndicatorRef } from "../../types/progress-indicator";

describe("ProgressIndicator", () => {
  // --- Rendering ---

  it("renders with default props - BLI: EL-339", () => {
    render(<ProgressIndicator data-testid="pi" />);
    const el = screen.getByTestId("pi");
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute("role", "progressbar");
  });

  it("renders with custom value - BLI: EL-339", () => {
    render(<ProgressIndicator value={42} data-testid="pi" />);
    expect(screen.getByTestId("pi")).toHaveAttribute("aria-valuenow", "42");
  });

  it("displays percentage text by default - BLI: EL-339", () => {
    render(<ProgressIndicator value={75} />);
    expect(screen.getByText("75%")).toBeInTheDocument();
  });

  it("applies className, style, and id - BLI: EL-339", () => {
    render(
      <ProgressIndicator id="pi1" className="custom" style={{ opacity: 0.5 }} data-testid="pi" />
    );
    const el = screen.getByTestId("pi");
    expect(el.id).toBe("pi1");
    expect(el.className).toContain("custom");
    expect(el).toHaveStyle({ opacity: "0.5" });
  });

  it("applies data-testid - BLI: EL-339", () => {
    render(<ProgressIndicator data-testid="my-pi" />);
    expect(screen.getByTestId("my-pi")).toBeInTheDocument();
  });

  // --- Value Clamping ---

  it("clamps value below 0 to 0 - BLI: EL-339", () => {
    render(<ProgressIndicator value={-10} data-testid="pi" />);
    expect(screen.getByTestId("pi")).toHaveAttribute("aria-valuenow", "0");
  });

  it("clamps value above 100 to 100 - BLI: EL-339", () => {
    render(<ProgressIndicator value={150} data-testid="pi" />);
    expect(screen.getByTestId("pi")).toHaveAttribute("aria-valuenow", "100");
  });

  it("treats NaN as 0 - BLI: EL-339", () => {
    render(<ProgressIndicator value={NaN} data-testid="pi" />);
    expect(screen.getByTestId("pi")).toHaveAttribute("aria-valuenow", "0");
  });

  // --- Value States ---

  it.each([
    [ProgressIndicatorValueState.None, "bg-sapphire-neutral-foreground-muted"],
    [ProgressIndicatorValueState.Positive, "bg-sapphire-positive"],
    [ProgressIndicatorValueState.Critical, "bg-sapphire-warning"],
    [ProgressIndicatorValueState.Negative, "bg-sapphire-negative"],
    [ProgressIndicatorValueState.Information, "bg-sapphire-info"],
  ])("applies correct bar color for valueState=%s - BLI: EL-339", (state, expectedClass) => {
    const { container } = render(
      <ProgressIndicator value={50} valueState={state} />
    );
    const bar = container.querySelector("[data-part='bar']");
    expect(bar?.className).toContain(expectedClass);
  });

  // --- Display Value ---

  it("shows custom displayValue instead of percentage - BLI: EL-339", () => {
    render(<ProgressIndicator value={25} displayValue="2/8 Steps" />);
    expect(screen.getByText("2/8 Steps")).toBeInTheDocument();
    expect(screen.queryByText("25%")).not.toBeInTheDocument();
  });

  it("hides value text when hideValue is true - BLI: EL-339", () => {
    render(<ProgressIndicator value={50} hideValue />);
    expect(screen.queryByText("50%")).not.toBeInTheDocument();
  });

  // --- Value Label Position ---

  it("renders value label above the bar - BLI: EL-339", () => {
    const { container } = render(<ProgressIndicator value={30} />);
    const valueEl = container.querySelector("[data-part='value']");
    expect(valueEl).toBeInTheDocument();
    expect(valueEl?.textContent).toContain("30%");
    // Label should be a direct child of root, not inside the bar
    const root = container.querySelector("[data-part='root']");
    expect(root?.firstElementChild).toBe(valueEl);
  });

  it("value label is above the bar regardless of value - BLI: EL-339", () => {
    const { container } = render(<ProgressIndicator value={75} />);
    const root = container.querySelector("[data-part='root']");
    const valueEl = container.querySelector("[data-part='value']");
    expect(root?.firstElementChild).toBe(valueEl);
    expect(valueEl?.textContent).toContain("75%");
  });

  // --- State Icon ---

  it("does not show icon for None state - BLI: EL-339", () => {
    const { container } = render(
      <ProgressIndicator value={30} valueState="None" />
    );
    const indicator = container.querySelector("[data-part='indicator']");
    const svg = indicator?.querySelector("svg");
    expect(svg).not.toBeInTheDocument();
  });

  it("shows icon for Positive state - BLI: EL-339", () => {
    const { container } = render(
      <ProgressIndicator value={30} valueState="Positive" />
    );
    const indicator = container.querySelector("[data-part='indicator']");
    const svg = indicator?.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("shows icon for Critical state - BLI: EL-339", () => {
    const { container } = render(
      <ProgressIndicator value={30} valueState="Critical" />
    );
    const indicator = container.querySelector("[data-part='indicator']");
    const svg = indicator?.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("shows icon for Negative state - BLI: EL-339", () => {
    const { container } = render(
      <ProgressIndicator value={30} valueState="Negative" />
    );
    const indicator = container.querySelector("[data-part='indicator']");
    const svg = indicator?.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("shows icon for Information state - BLI: EL-339", () => {
    const { container } = render(
      <ProgressIndicator value={30} valueState="Information" />
    );
    const indicator = container.querySelector("[data-part='indicator']");
    const svg = indicator?.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  // --- Disabled ---

  it("applies disabled styling when disabled - BLI: EL-339", () => {
    render(
      <ProgressIndicator value={50} disabled data-testid="pi" />
    );
    const root = screen.getByTestId("pi");
    expect(root.className).toContain("opacity-40");
    expect(root).toHaveAttribute("aria-disabled", "true");
  });

  it("does not apply disabled styling by default - BLI: EL-339", () => {
    render(<ProgressIndicator value={50} data-testid="pi" />);
    const root = screen.getByTestId("pi");
    expect(root.className).not.toContain("opacity-40");
    expect(root).not.toHaveAttribute("aria-disabled");
  });

  // --- ARIA Attributes ---

  it("has role=progressbar - BLI: EL-339", () => {
    render(<ProgressIndicator data-testid="pi" />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("sets aria-valuemin=0 - BLI: EL-339", () => {
    render(<ProgressIndicator data-testid="pi" />);
    expect(screen.getByTestId("pi")).toHaveAttribute("aria-valuemin", "0");
  });

  it("sets aria-valuemax=100 - BLI: EL-339", () => {
    render(<ProgressIndicator data-testid="pi" />);
    expect(screen.getByTestId("pi")).toHaveAttribute("aria-valuemax", "100");
  });

  it("sets aria-valuenow to clamped value - BLI: EL-339", () => {
    render(<ProgressIndicator value={65} data-testid="pi" />);
    expect(screen.getByTestId("pi")).toHaveAttribute("aria-valuenow", "65");
  });

  it("sets aria-valuetext with percentage - BLI: EL-339", () => {
    render(<ProgressIndicator value={42} data-testid="pi" />);
    expect(screen.getByTestId("pi")).toHaveAttribute("aria-valuetext", "42%");
  });

  it("sets aria-valuetext with state label - BLI: EL-339", () => {
    render(
      <ProgressIndicator value={42} valueState="Positive" data-testid="pi" />
    );
    expect(screen.getByTestId("pi")).toHaveAttribute("aria-valuetext", "42% Positive");
  });

  it("sets aria-valuetext with custom displayValue - BLI: EL-339", () => {
    render(
      <ProgressIndicator value={42} displayValue="Loading..." data-testid="pi" />
    );
    expect(screen.getByTestId("pi")).toHaveAttribute("aria-valuetext", "Loading...");
  });

  it("sets aria-valuetext to just displayValue when displayValue and valueState are both set - BLI: EL-339", () => {
    render(
      <ProgressIndicator value={42} displayValue="Loading..." valueState="Positive" data-testid="pi" />
    );
    expect(screen.getByTestId("pi")).toHaveAttribute("aria-valuetext", "Loading...");
  });

  it("sets aria-label from accessibleName - BLI: EL-339", () => {
    render(<ProgressIndicator accessibleName="Upload progress" data-testid="pi" />);
    expect(screen.getByTestId("pi")).toHaveAttribute("aria-label", "Upload progress");
  });

  it("sets aria-labelledby from accessibleNameRef - BLI: EL-339", () => {
    render(<ProgressIndicator accessibleNameRef="label-id" data-testid="pi" />);
    expect(screen.getByTestId("pi")).toHaveAttribute("aria-labelledby", "label-id");
  });

  it("sets both aria-label and aria-labelledby when both props provided - BLI: EL-339", () => {
    render(
      <ProgressIndicator
        accessibleName="Upload progress"
        accessibleNameRef="label-id"
        data-testid="pi"
      />
    );
    expect(screen.getByTestId("pi")).toHaveAttribute("aria-label", "Upload progress");
    expect(screen.getByTestId("pi")).toHaveAttribute("aria-labelledby", "label-id");
  });

  // --- Ref ---

  it("exposes focus/blur/isFocused via ref - BLI: EL-339", () => {
    const ref = React.createRef<ProgressIndicatorRef>();
    render(<ProgressIndicator ref={ref} data-testid="pi" />);
    expect(ref.current).not.toBeNull();
    expect(ref.current!.nativeElement).toBeInstanceOf(HTMLDivElement);

    ref.current!.focus();
    expect(ref.current!.isFocused()).toBe(true);
    ref.current!.blur();
    expect(ref.current!.isFocused()).toBe(false);
  });

  // --- Edge Cases ---

  it("renders correctly at value=0 - BLI: EL-339", () => {
    const { container } = render(<ProgressIndicator value={0} data-testid="pi" />);
    const bar = container.querySelector("[data-part='bar']");
    expect(bar?.className).toContain("w-0");
    expect(screen.getByTestId("pi")).toHaveAttribute("aria-valuenow", "0");
  });

  it("bar has width style matching clamped value - BLI: EL-339", () => {
    const { container } = render(<ProgressIndicator value={60} />);
    const bar = container.querySelector("[data-part='bar']") as HTMLElement;
    expect(bar.style.width).toBe("60%");
  });

  it("renders track, bar, and end-cap elements - BLI: EL-339", () => {
    const { container } = render(<ProgressIndicator value={50} />);
    expect(container.querySelector("[data-part='track']")).toBeInTheDocument();
    expect(container.querySelector("[data-part='bar']")).toBeInTheDocument();
    expect(container.querySelector("[data-part='start-cap']")).not.toBeInTheDocument();
    expect(container.querySelector("[data-part='end-cap']")).toBeInTheDocument();
  });
});
