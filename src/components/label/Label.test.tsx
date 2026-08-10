import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { Label } from "./Label";
import { LabelWrappingType } from "../../types/label";

describe("Label", () => {
  // --- Basic rendering ---

  it("renders children text - BLI: EL-339", () => {
    render(<Label>First Name</Label>);
    expect(screen.getByText("First Name")).toBeInTheDocument();
  });

  it("renders text via the text prop - BLI: EL-339", () => {
    render(<Label text="Last Name" />);
    expect(screen.getByText("Last Name")).toBeInTheDocument();
  });

  it("prefers children over text prop - BLI: EL-339", () => {
    render(<Label text="Fallback">Primary</Label>);
    expect(screen.getByText("Primary")).toBeInTheDocument();
    expect(screen.queryByText("Fallback")).not.toBeInTheDocument();
  });

  it("renders a <label> element - BLI: EL-339", () => {
    render(<Label data-testid="lbl">Name</Label>);
    expect(screen.getByTestId("lbl").tagName.toLowerCase()).toBe("label");
  });

  it("applies data-testid - BLI: EL-339", () => {
    render(<Label data-testid="my-label">X</Label>);
    expect(screen.getByTestId("my-label")).toBeInTheDocument();
  });

  it("applies className - BLI: EL-339", () => {
    render(<Label className="custom" data-testid="lbl">X</Label>);
    expect(screen.getByTestId("lbl").className).toContain("custom");
  });

  it("applies inline style - BLI: EL-339", () => {
    render(<Label style={{ color: "rgb(255, 0, 0)" }} data-testid="lbl">X</Label>);
    expect(screen.getByTestId("lbl")).toHaveStyle({ color: "rgb(255, 0, 0)" });
  });

  // --- htmlFor / for prop ---

  it("associates label with an input via htmlFor - BLI: EL-339", () => {
    render(
      <>
        <Label htmlFor="email-input">Email</Label>
        <input id="email-input" />
      </>
    );
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("associates label with an input via the for prop - BLI: EL-339", () => {
    render(
      <>
        <Label for="name-input">Name</Label>
        <input id="name-input" />
      </>
    );
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
  });

  it("prefers the for prop over htmlFor - BLI: EL-339", () => {
    render(
      <>
        <Label for="first" htmlFor="second">Pick</Label>
        <input id="first" />
        <input id="second" />
      </>
    );
    const lbl = screen.getByText("Pick").closest("label")!;
    expect(lbl).toHaveAttribute("for", "first");
  });

  it("renders with no htmlFor when neither prop is provided - BLI: EL-339", () => {
    render(<Label data-testid="lbl">No target</Label>);
    expect(screen.getByTestId("lbl")).not.toHaveAttribute("for");
  });

  // --- showColon ---

  it("does not show colon by default - BLI: EL-339", () => {
    render(<Label data-testid="lbl">Field</Label>);
    expect(screen.getByTestId("lbl").textContent).not.toContain(":");
  });

  it("shows colon when showColon=true - BLI: EL-339", () => {
    render(<Label showColon data-testid="lbl">Field</Label>);
    expect(screen.getByTestId("lbl").textContent).toContain(":");
  });

  it("does not show colon when showColon=false - BLI: EL-339", () => {
    render(<Label showColon={false} data-testid="lbl">Field</Label>);
    expect(screen.getByTestId("lbl").textContent).not.toContain(":");
  });

  // --- required ---

  it("does not show asterisk by default - BLI: EL-339", () => {
    render(<Label data-testid="lbl">Field</Label>);
    expect(screen.getByTestId("lbl").textContent).not.toContain("*");
  });

  it("shows asterisk when required=true - BLI: EL-339", () => {
    render(<Label required data-testid="lbl">Field</Label>);
    expect(screen.getByTestId("lbl").textContent).toContain("*");
  });

  it("renders visually-hidden '(required)' text for screen readers when required - BLI: EL-339", () => {
    render(<Label required>Field</Label>);
    expect(screen.getByText("(required)")).toBeInTheDocument();
    const srOnly = screen.getByText("(required)");
    expect(srOnly.className).toContain("sr-only");
  });

  it("marks the asterisk as aria-hidden - BLI: EL-339", () => {
    const { container } = render(<Label required>Field</Label>);
    const star = container.querySelector("[aria-hidden='true']");
    expect(star).toBeInTheDocument();
    expect(star!.textContent).toBe("*");
  });

  it("does not render asterisk or sr-only span when not required - BLI: EL-339", () => {
    render(<Label data-testid="lbl">Field</Label>);
    expect(screen.queryByText("(required)")).not.toBeInTheDocument();
    expect(screen.queryByText("*")).not.toBeInTheDocument();
  });

  // --- showColon + required together ---

  it("shows both colon and asterisk when showColon and required - BLI: EL-339", () => {
    render(<Label showColon required data-testid="lbl">Field</Label>);
    expect(screen.getByTestId("lbl").textContent).toContain(":");
    expect(screen.getByTestId("lbl").textContent).toContain("*");
  });

  // --- wrappingType ---

  it("applies truncate class when wrappingType=None - BLI: EL-339", () => {
    render(<Label wrappingType={LabelWrappingType.None} data-testid="lbl">Long</Label>);
    expect(screen.getByTestId("lbl").className).toContain("truncate");
  });

  it("applies break-words class when wrappingType=Normal (default) - BLI: EL-339", () => {
    render(<Label data-testid="lbl">Normal</Label>);
    expect(screen.getByTestId("lbl").className).toContain("break-words");
  });

  it("applies break-words class when wrappingType=Normal explicit - BLI: EL-339", () => {
    render(<Label wrappingType={LabelWrappingType.Normal} data-testid="lbl">Normal</Label>);
    expect(screen.getByTestId("lbl").className).toContain("break-words");
  });

  it("accepts wrappingType as string literal 'None' - BLI: EL-339", () => {
    render(<Label wrappingType="None" data-testid="lbl">Long</Label>);
    expect(screen.getByTestId("lbl").className).toContain("truncate");
  });

  // --- Default styling classes ---

  it("has default text-sm and font-normal classes - BLI: EL-339", () => {
    render(<Label data-testid="lbl">X</Label>);
    const el = screen.getByTestId("lbl");
    expect(el.className).toContain("text-sm");
    expect(el.className).toContain("font-normal");
  });

  // --- Ref ---

  it("forwards ref to the underlying <label> element - BLI: EL-339", () => {
    const ref = React.createRef<HTMLLabelElement>();
    render(<Label ref={ref}>Ref Label</Label>);
    expect(ref.current).toBeInstanceOf(HTMLLabelElement);
    expect(ref.current!.tagName.toLowerCase()).toBe("label");
  });

  // --- Children as node ---

  it("renders React element children - BLI: EL-339", () => {
    render(<Label><strong>Bold</strong></Label>);
    expect(screen.getByText("Bold")).toBeInTheDocument();
  });
});
