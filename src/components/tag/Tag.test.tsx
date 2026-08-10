import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { Tag } from "./Tag";
import { TagDesign } from "../../types/tag";
import type { TagRef } from "../../types/tag";

const ALL_DESIGNS = Object.values(TagDesign);

describe("Tag", () => {
  // --- Rendering ---

  it("renders text content", () => {
    render(<Tag>Positive</Tag>);
    expect(screen.getByText("Positive")).toBeInTheDocument();
  });

  it("renders with data-testid", () => {
    render(<Tag data-testid="my-tag">Test</Tag>);
    expect(screen.getByTestId("my-tag")).toBeInTheDocument();
  });

  it("applies id, className, and style", () => {
    render(<Tag id="t1" className="custom" style={{ opacity: 0.5 }}>X</Tag>);
    const el = document.getElementById("t1")!;
    expect(el).toBeInTheDocument();
    expect(el.className).toContain("custom");
    expect(el).toHaveStyle({ opacity: "0.5" });
  });

  // --- All 9 designs render ---

  it.each(ALL_DESIGNS)("renders with design=%s", (design) => {
    render(<Tag design={design}>{design}</Tag>);
    expect(screen.getByText(design)).toBeInTheDocument();
  });

  // --- Default icons ---

  it.each(ALL_DESIGNS)("shows default icon for design=%s", (design) => {
    const { container } = render(<Tag design={design}>Text</Tag>);
    const icon = container.querySelector("[data-part='icon']");
    expect(icon).toBeInTheDocument();
  });

  it("hides icon when hideIcon is true", () => {
    const { container } = render(<Tag design="Positive" hideIcon>OK</Tag>);
    const icon = container.querySelector("[data-part='icon']");
    expect(icon).not.toBeInTheDocument();
  });

  it("uses custom icon instead of default", () => {
    render(
      <Tag design="Positive" icon={<span data-testid="custom">★</span>}>Star</Tag>
    );
    expect(screen.getByTestId("custom")).toBeInTheDocument();
  });

  // --- Display only (no interactive elements) ---

  it("is not a button", () => {
    const { container } = render(<Tag design="Positive">OK</Tag>);
    const root = container.querySelector("[data-part='root']");
    expect(root?.tagName).not.toBe("BUTTON");
  });

  it("is not focusable", () => {
    const { container } = render(<Tag design="Positive">OK</Tag>);
    const root = container.querySelector("[data-part='root']");
    expect(root).not.toHaveAttribute("tabindex");
  });

  // --- Visual styles ---

  it("Waiting design has visible border", () => {
    const { container } = render(<Tag design="Waiting">Wait</Tag>);
    const root = container.querySelector("[data-part='root']")!;
    // Should have "border" but not "border-transparent"
    expect(root.className).toMatch(/\bborder\b/);
    expect(root.className).toContain("border-sapphire-joule-foreground");
  });

  it("Paused design has visible border", () => {
    const { container } = render(<Tag design="Paused">Paused</Tag>);
    const root = container.querySelector("[data-part='root']")!;
    expect(root.className).toContain("border-sapphire-border-active");
  });

  it("Positive design has no visible border", () => {
    const { container } = render(<Tag design="Positive">OK</Tag>);
    const root = container.querySelector("[data-part='root']")!;
    expect(root.className).toContain("border-transparent");
  });

  // --- Accessibility ---

  it("has hidden text 'Tag' for screen readers", () => {
    const { container } = render(<Tag design="Positive">OK</Tag>);
    const root = container.querySelector("[data-part='root']")!;
    const hiddenText = root.querySelector(".sr-only");
    expect(hiddenText).toBeInTheDocument();
    expect(hiddenText).toHaveTextContent("Tag");
  });

  // --- Ref ---

  it("exposes nativeElement via ref", () => {
    const ref = React.createRef<TagRef>();
    render(<Tag ref={ref}>Ref</Tag>);
    expect(ref.current).not.toBeNull();
    expect(ref.current!.nativeElement).toBeInstanceOf(HTMLSpanElement);
  });

  // --- Fixed sizing ---

  it("has h-6 (24px height) class", () => {
    const { container } = render(<Tag design="Positive">OK</Tag>);
    const root = container.querySelector("[data-part='root']")!;
    expect(root.className).toContain("h-6");
  });

  it("has font-semibold class", () => {
    const { container } = render(<Tag design="Positive">OK</Tag>);
    const root = container.querySelector("[data-part='root']")!;
    expect(root.className).toContain("font-semibold");
  });

  // --- Outline variant ---

  it("outline variant has border-primary and text-secondary", () => {
    const { container } = render(<Tag design="Positive" variant="outline">OK</Tag>);
    const root = container.querySelector("[data-part='root']")!;
    expect(root.className).toContain("border-sapphire-border-primary");
    expect(root.className).toContain("text-sapphire-text-secondary");
    expect(root.className).not.toContain("bg-sapphire-positive-bg");
  });

  it("outline variant icon keeps semantic color", () => {
    const { container } = render(<Tag design="Positive" variant="outline">OK</Tag>);
    const icon = container.querySelector("[data-part='icon']")!;
    expect(icon.className).toContain("text-sapphire-positive");
  });

  it("outline variant works for all 5 semantic designs", () => {
    const semanticDesigns = ["Positive", "Negative", "Critical", "Information", "None"] as const;
    for (const design of semanticDesigns) {
      const { container } = render(<Tag design={design} variant="outline">{design}</Tag>);
      const root = container.querySelector("[data-part='root']")!;
      expect(root.className).toContain("border-sapphire-border-primary");
    }
  });

  it("outline variant falls back to filled for non-semantic designs", () => {
    const { container } = render(<Tag design="Draft" variant="outline">Draft</Tag>);
    const root = container.querySelector("[data-part='root']")!;
    expect(root.className).toContain("bg-sapphire-background-quaternary");
    expect(root.className).not.toContain("border-sapphire-border-primary");
  });

  it("defaults to filled variant", () => {
    const { container } = render(<Tag design="Positive">OK</Tag>);
    const root = container.querySelector("[data-part='root']")!;
    expect(root.className).toContain("bg-sapphire-positive-bg");
  });
});
