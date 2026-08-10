import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { Title } from "./Title";
import { TitleLevel, TitleWrappingType } from "../../types/title";

describe("Title", () => {
  // --- Default rendering ---

  it("renders an <h2> by default - BLI: EL-339", () => {
    const { container } = render(<Title>Default</Title>);
    expect(container.querySelector("h2")).toBeInTheDocument();
  });

  it("renders text content - BLI: EL-339", () => {
    render(<Title>Page Title</Title>);
    expect(screen.getByText("Page Title")).toBeInTheDocument();
  });

  it("renders React element children - BLI: EL-339", () => {
    render(<Title><span>Inner</span></Title>);
    expect(screen.getByText("Inner")).toBeInTheDocument();
  });

  it("applies className - BLI: EL-339", () => {
    render(<Title className="my-class">X</Title>);
    expect(screen.getByText("X").className).toContain("my-class");
  });

  it("applies inline style - BLI: EL-339", () => {
    render(<Title style={{ color: "rgb(0, 0, 255)" }}>Styled</Title>);
    expect(screen.getByText("Styled")).toHaveStyle({ color: "rgb(0, 0, 255)" });
  });

  it("applies id attribute - BLI: EL-339", () => {
    render(<Title id="my-title">With ID</Title>);
    expect(screen.getByText("With ID")).toHaveAttribute("id", "my-title");
  });

  // --- Level variants: correct HTML tag ---

  it("renders an <h1> when level=H1 - BLI: EL-339", () => {
    render(<Title level={TitleLevel.H1}>H1</Title>);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("renders an <h2> when level=H2 - BLI: EL-339", () => {
    render(<Title level={TitleLevel.H2}>H2</Title>);
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });

  it("renders an <h3> when level=H3 - BLI: EL-339", () => {
    render(<Title level={TitleLevel.H3}>H3</Title>);
    expect(screen.getByRole("heading", { level: 3 })).toBeInTheDocument();
  });

  it("renders an <h4> when level=H4 - BLI: EL-339", () => {
    render(<Title level={TitleLevel.H4}>H4</Title>);
    expect(screen.getByRole("heading", { level: 4 })).toBeInTheDocument();
  });

  it("renders an <h5> when level=H5 - BLI: EL-339", () => {
    render(<Title level={TitleLevel.H5}>H5</Title>);
    expect(screen.getByRole("heading", { level: 5 })).toBeInTheDocument();
  });

  it("renders an <h6> when level=H6 - BLI: EL-339", () => {
    render(<Title level={TitleLevel.H6}>H6</Title>);
    expect(screen.getByRole("heading", { level: 6 })).toBeInTheDocument();
  });

  it("accepts level as string literal 'H1' - BLI: EL-339", () => {
    render(<Title level="H1">Str H1</Title>);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("falls back to h2 for unknown level string - BLI: EL-339", () => {
    // @ts-expect-error - intentional bad value for test
    render(<Title level="Unknown">Fallback</Title>);
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });

  // --- Size classes per level ---

  it("applies text-[3.5rem] for H1 - BLI: EL-339", () => {
    render(<Title level={TitleLevel.H1}>H1</Title>);
    expect(screen.getByRole("heading", { level: 1 }).className).toContain("text-[3.5rem]");
  });

  it("applies text-[2.5rem] for H2 - BLI: EL-339", () => {
    render(<Title level={TitleLevel.H2}>H2</Title>);
    expect(screen.getByRole("heading", { level: 2 }).className).toContain("text-[2.5rem]");
  });

  it("applies text-[2rem] for H3 - BLI: EL-339", () => {
    render(<Title level={TitleLevel.H3}>H3</Title>);
    expect(screen.getByRole("heading", { level: 3 }).className).toContain("text-[2rem]");
  });

  it("applies text-xl for H4 - BLI: EL-339", () => {
    render(<Title level={TitleLevel.H4}>H4</Title>);
    expect(screen.getByRole("heading", { level: 4 }).className).toContain("text-xl");
  });

  it("applies text-base for H5 - BLI: EL-339", () => {
    render(<Title level={TitleLevel.H5}>H5</Title>);
    expect(screen.getByRole("heading", { level: 5 }).className).toContain("text-base");
  });

  it("applies text-base for H6 - BLI: EL-339", () => {
    render(<Title level={TitleLevel.H6}>H6</Title>);
    expect(screen.getByRole("heading", { level: 6 }).className).toContain("text-base");
  });

  // --- Default styling ---

  it("has font-normal and text-foreground classes - BLI: EL-339", () => {
    render(<Title>Styled</Title>);
    const el = screen.getByText("Styled");
    expect(el.className).toContain("font-normal");
    expect(el.className).toContain("text-foreground");
  });

  // --- wrappingType ---

  it("applies truncate class by default (wrappingType=None) - BLI: EL-339", () => {
    render(<Title>Truncated</Title>);
    expect(screen.getByText("Truncated").className).toContain("truncate");
  });

  it("applies truncate class when wrappingType=None explicit - BLI: EL-339", () => {
    render(<Title wrappingType={TitleWrappingType.None}>No Wrap</Title>);
    expect(screen.getByText("No Wrap").className).toContain("truncate");
  });

  it("does NOT apply truncate class when wrappingType=Normal - BLI: EL-339", () => {
    render(<Title wrappingType={TitleWrappingType.Normal}>Wrapping</Title>);
    expect(screen.getByText("Wrapping").className).not.toContain("truncate");
  });

  it("accepts wrappingType as string literal 'Normal' - BLI: EL-339", () => {
    render(<Title wrappingType="Normal">Normal Wrap</Title>);
    expect(screen.getByText("Normal Wrap").className).not.toContain("truncate");
  });

  it("accepts wrappingType as string literal 'None' - BLI: EL-339", () => {
    render(<Title wrappingType="None">None Wrap</Title>);
    expect(screen.getByText("None Wrap").className).toContain("truncate");
  });

  // --- All levels iterate ---

  it.each(Object.values(TitleLevel))("renders with level=%s - BLI: EL-339", (level) => {
    render(<Title level={level}>{level} heading</Title>);
    expect(screen.getByText(`${level} heading`)).toBeInTheDocument();
  });

  it.each(Object.values(TitleWrappingType))("renders with wrappingType=%s - BLI: EL-339", (wt) => {
    render(<Title wrappingType={wt}>Wrap test</Title>);
    expect(screen.getByText("Wrap test")).toBeInTheDocument();
  });

  // --- Ref ---

  it("forwards ref to the underlying heading element - BLI: EL-339", () => {
    const ref = React.createRef<HTMLHeadingElement>();
    render(<Title level={TitleLevel.H1} ref={ref}>Ref Title</Title>);
    expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
    expect(ref.current!.tagName.toLowerCase()).toBe("h1");
  });

  it("forwards ref to h2 by default - BLI: EL-339", () => {
    const ref = React.createRef<HTMLHeadingElement>();
    render(<Title ref={ref}>Default Ref</Title>);
    expect(ref.current!.tagName.toLowerCase()).toBe("h2");
  });
});
