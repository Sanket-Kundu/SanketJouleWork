import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { Text } from "./Text";
import { TextEmptyIndicatorMode } from "../../types/text";
import type { TextRef } from "../../types/text";

describe("Text", () => {
  // --- Basic rendering ---

  it("renders a <span> element - BLI: EL-339", () => {
    const { container } = render(<Text>Hello</Text>);
    expect(container.querySelector("span")).toBeInTheDocument();
  });

  it("renders text content - BLI: EL-339", () => {
    render(<Text>Hello World</Text>);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  it("renders React element children - BLI: EL-339", () => {
    render(<Text><strong>Bold</strong></Text>);
    expect(screen.getByText("Bold")).toBeInTheDocument();
  });

  it("applies className - BLI: EL-339", () => {
    const { container } = render(<Text className="custom">X</Text>);
    expect(container.querySelector("span")!.className).toContain("custom");
  });

  it("applies inline style - BLI: EL-339", () => {
    const { container } = render(<Text style={{ color: "rgb(0, 0, 255)" }}>X</Text>);
    expect(container.querySelector("span")).toHaveStyle({ color: "rgb(0, 0, 255)" });
  });

  it("has default font and text classes - BLI: EL-339", () => {
    const { container } = render(<Text>X</Text>);
    const span = container.querySelector("span")!;
    expect(span.className).toContain("text-foreground");
    expect(span.className).toContain("font-normal");
    expect(span.className).toContain("text-sm");
  });

  // --- maxLines=0 (default, unlimited) ---

  it("does not apply clamping classes when maxLines=0 (default) - BLI: EL-339", () => {
    const { container } = render(<Text>No clamp</Text>);
    const span = container.querySelector("span")!;
    expect(span.className).not.toContain("overflow-hidden");
    expect(span.className).not.toContain("whitespace-nowrap");
  });

  // --- maxLines=1 ---

  it("applies single-line truncation classes when maxLines=1 - BLI: EL-339", () => {
    const { container } = render(<Text maxLines={1}>Long text</Text>);
    const span = container.querySelector("span")!;
    expect(span.className).toContain("whitespace-nowrap");
    expect(span.className).toContain("overflow-hidden");
    expect(span.className).toContain("text-ellipsis");
    expect(span.className).toContain("inline-block");
  });

  it("applies maxWidth:100% style when maxLines=1 - BLI: EL-339", () => {
    const { container } = render(<Text maxLines={1}>Long text</Text>);
    expect(container.querySelector("span")).toHaveStyle({ maxWidth: "100%" });
  });

  // --- maxLines > 1 ---

  it("applies overflow-hidden class when maxLines=2 - BLI: EL-339", () => {
    const { container } = render(<Text maxLines={2}>Multi line</Text>);
    const span = container.querySelector("span")!;
    expect(span.className).toContain("overflow-hidden");
    expect(span.className).not.toContain("whitespace-nowrap");
  });

  it("applies WebkitLineClamp style when maxLines=3 - BLI: EL-339", () => {
    const { container } = render(<Text maxLines={3}>Clamped</Text>);
    const span = container.querySelector("span")!;
    expect(span).toHaveStyle({ WebkitLineClamp: 3 });
  });

  it("applies display -webkit-inline-box when maxLines=2 - BLI: EL-339", () => {
    const { container } = render(<Text maxLines={2}>Box</Text>);
    const span = container.querySelector("span")!;
    expect(span).toHaveStyle({ display: "-webkit-inline-box" });
  });

  it("merges user style with clamp style - BLI: EL-339", () => {
    const { container } = render(
      <Text maxLines={2} style={{ color: "rgb(255, 0, 0)" }}>Styled</Text>
    );
    const span = container.querySelector("span")!;
    expect(span).toHaveStyle({ color: "rgb(255, 0, 0)" });
    expect(span).toHaveStyle({ WebkitLineClamp: 2 });
  });

  // --- emptyIndicatorMode=Off (default) ---

  it("does not show empty indicator by default when children is provided - BLI: EL-339", () => {
    render(<Text>Hello</Text>);
    // em-dash should not appear
    expect(screen.queryByText("–")).not.toBeInTheDocument();
  });

  it("does not show empty indicator when mode=Off and children is null - BLI: EL-339", () => {
    const { container } = render(<Text emptyIndicatorMode={TextEmptyIndicatorMode.Off} />);
    expect(container.querySelector("span")!.textContent).toBe("");
  });

  it("does not show empty indicator when mode=Off and children is empty string - BLI: EL-339", () => {
    render(<Text emptyIndicatorMode={TextEmptyIndicatorMode.Off}>{""}</Text>);
    expect(screen.queryByText("–")).not.toBeInTheDocument();
  });

  // --- emptyIndicatorMode=On ---

  it("shows em-dash indicator when mode=On and no children - BLI: EL-339", () => {
    render(<Text emptyIndicatorMode={TextEmptyIndicatorMode.On} />);
    expect(screen.getByText("–")).toBeInTheDocument();
  });

  it("shows em-dash indicator when mode=On and children is null - BLI: EL-339", () => {
    render(<Text emptyIndicatorMode={TextEmptyIndicatorMode.On}>{null}</Text>);
    expect(screen.getByText("–")).toBeInTheDocument();
  });

  it("shows em-dash indicator when mode=On and children is empty string - BLI: EL-339", () => {
    render(<Text emptyIndicatorMode={TextEmptyIndicatorMode.On}>{""}</Text>);
    expect(screen.getByText("–")).toBeInTheDocument();
  });

  it("shows em-dash indicator when mode=On and children is whitespace only - BLI: EL-339", () => {
    render(<Text emptyIndicatorMode={TextEmptyIndicatorMode.On}>{"   "}</Text>);
    expect(screen.getByText("–")).toBeInTheDocument();
  });

  it("shows em-dash indicator when mode=On and children is empty array - BLI: EL-339", () => {
    render(<Text emptyIndicatorMode={TextEmptyIndicatorMode.On}>{[]}</Text>);
    expect(screen.getByText("–")).toBeInTheDocument();
  });

  it("does NOT show em-dash when mode=On but children has content - BLI: EL-339", () => {
    render(<Text emptyIndicatorMode={TextEmptyIndicatorMode.On}>Hello</Text>);
    expect(screen.queryByText("–")).not.toBeInTheDocument();
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("accepts emptyIndicatorMode as string literal 'On' - BLI: EL-339", () => {
    render(<Text emptyIndicatorMode="On" />);
    expect(screen.getByText("–")).toBeInTheDocument();
  });

  it("the em-dash indicator span has tertiary text class - BLI: EL-339", () => {
    const { container } = render(<Text emptyIndicatorMode={TextEmptyIndicatorMode.On} />);
    const indicator = container.querySelector("span span")!;
    expect(indicator.className).toContain("sapphire-text-tertiary");
  });

  // --- Ref ---

  it("forwards ref to the underlying span element - BLI: EL-339", () => {
    const ref = React.createRef<TextRef>();
    render(<Text ref={ref}>Ref text</Text>);
    expect(ref.current!.nativeElement).toBeInstanceOf(HTMLSpanElement);
  });

  it("exposes nativeElement via ref - BLI: EL-339", () => {
    const ref = React.createRef<TextRef>();
    render(<Text ref={ref}>Native</Text>);
    expect(ref.current!.nativeElement).toBeInstanceOf(HTMLSpanElement);
  });

  it("exposes focus() via ref - BLI: EL-339", () => {
    const ref = React.createRef<TextRef>();
    render(<Text ref={ref}>Focus</Text>);
    expect(typeof ref.current!.focus).toBe("function");
  });
});
