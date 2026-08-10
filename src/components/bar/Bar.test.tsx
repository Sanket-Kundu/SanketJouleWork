import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { Bar } from "./Bar";
import { BarDesign, BarAccessibleRole } from "../../types/bar";
import type { BarRef } from "../../types/bar";

describe("Bar", () => {
  // --- Rendering ---

  it("renders with children in middle slot - BLI: EL-339", () => {
    render(<Bar>Title</Bar>);
    expect(screen.getByText("Title")).toBeInTheDocument();
  });

  it("renders start content - BLI: EL-339", () => {
    render(<Bar startContent={<span data-testid="start">Back</span>}>Title</Bar>);
    expect(screen.getByTestId("start")).toBeInTheDocument();
  });

  it("renders end content - BLI: EL-339", () => {
    render(<Bar endContent={<span data-testid="end">Save</span>}>Title</Bar>);
    expect(screen.getByTestId("end")).toBeInTheDocument();
  });

  it("renders all three content slots - BLI: EL-339", () => {
    render(
      <Bar
        startContent={<span>Start</span>}
        endContent={<span>End</span>}
      >
        Middle
      </Bar>
    );
    expect(screen.getByText("Start")).toBeInTheDocument();
    expect(screen.getByText("Middle")).toBeInTheDocument();
    expect(screen.getByText("End")).toBeInTheDocument();
  });

  it("supports data-testid - BLI: EL-339", () => {
    render(<Bar data-testid="my-bar">Content</Bar>);
    expect(screen.getByTestId("my-bar")).toBeInTheDocument();
  });

  it("applies id, className, and style - BLI: EL-339", () => {
    render(<Bar id="bar-1" className="custom" style={{ height: "48px" }}>X</Bar>);
    const el = document.getElementById("bar-1")!;
    expect(el.className).toContain("custom");
    expect(el).toHaveStyle({ height: "48px" });
  });

  // --- Design Variants ---

  it.each(Object.values(BarDesign))("renders with design=%s - BLI: EL-339", (design) => {
    render(<Bar design={design} data-testid="bar">Content</Bar>);
    expect(screen.getByTestId("bar")).toHaveAttribute("data-design", design);
  });

  // --- Accessibility ---

  it("renders with toolbar role by default - BLI: EL-339", () => {
    render(<Bar>Content</Bar>);
    expect(screen.getByRole("toolbar")).toBeInTheDocument();
  });

  it("uses design name as default aria-label when no accessibleName - BLI: EL-339", () => {
    render(<Bar design="Footer">Content</Bar>);
    expect(screen.getByRole("toolbar")).toHaveAttribute("aria-label", "Footer");
  });

  it("applies custom accessibleName - BLI: EL-339", () => {
    render(<Bar accessibleName="Page header">Content</Bar>);
    expect(screen.getByRole("toolbar")).toHaveAttribute("aria-label", "Page header");
  });

  it("applies aria-labelledby and omits aria-label - BLI: EL-339", () => {
    render(<Bar accessibleNameRef="title-1">Content</Bar>);
    const bar = screen.getByRole("toolbar");
    expect(bar).toHaveAttribute("aria-labelledby", "title-1");
    expect(bar).not.toHaveAttribute("aria-label");
  });

  it("renders without role when accessibleRole is None - BLI: EL-339", () => {
    render(<Bar accessibleRole={BarAccessibleRole.None} data-testid="bar">Content</Bar>);
    const bar = screen.getByTestId("bar");
    expect(bar).not.toHaveAttribute("role");
  });

  // --- Ref ---

  it("exposes focus/blur/isFocused via ref - BLI: EL-339", () => {
    const ref = React.createRef<BarRef>();
    render(<Bar ref={ref}>Ref test</Bar>);
    expect(ref.current).not.toBeNull();
    expect(ref.current!.nativeElement).toBeInstanceOf(HTMLDivElement);

    // Bar doesn't have tabIndex by default, so test ref methods exist
    expect(typeof ref.current!.focus).toBe("function");
    expect(typeof ref.current!.blur).toBe("function");
    expect(typeof ref.current!.isFocused).toBe("function");
  });
});
