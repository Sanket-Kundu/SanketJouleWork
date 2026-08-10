import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { DropIndicator } from "./DropIndicator";

describe("DropIndicator", () => {
  it("should not render when not visible - BLI: EL-339", () => {
    const { container } = render(
      <DropIndicator visible={false} placement="Before" />
    );
    expect(container.firstChild).toBeNull();
  });

  it("should render when visible - BLI: EL-339", () => {
    render(<DropIndicator visible={true} placement="Before" />);
    const indicator = document.querySelector('[data-drop-indicator]');
    expect(indicator).toBeInTheDocument();
  });

  describe("vertical orientation", () => {
    it("should render Before placement - BLI: EL-339", () => {
      render(
        <DropIndicator
          visible={true}
          placement="Before"
          orientation="vertical"
        />
      );
      const indicator = document.querySelector('[data-placement="Before"]');
      expect(indicator).toBeInTheDocument();
      expect(indicator).toHaveClass("-top-px");
    });

    it("should render After placement - BLI: EL-339", () => {
      render(
        <DropIndicator
          visible={true}
          placement="After"
          orientation="vertical"
        />
      );
      const indicator = document.querySelector('[data-placement="After"]');
      expect(indicator).toBeInTheDocument();
      expect(indicator).toHaveClass("-bottom-px");
    });

    it("should render On placement with dashed border - BLI: EL-339", () => {
      render(
        <DropIndicator visible={true} placement="On" orientation="vertical" />
      );
      const indicator = document.querySelector('[data-placement="On"]');
      expect(indicator).toBeInTheDocument();
      expect(indicator).toHaveClass("border-dashed");
      expect(indicator).toHaveClass("inset-0");
      expect(indicator).toHaveClass("h-full");
    });
  });

  describe("horizontal orientation", () => {
    it("should render Before placement - BLI: EL-339", () => {
      render(
        <DropIndicator
          visible={true}
          placement="Before"
          orientation="horizontal"
        />
      );
      const indicator = document.querySelector('[data-placement="Before"]');
      expect(indicator).toBeInTheDocument();
      expect(indicator).toHaveClass("-left-px");
    });

    it("should render After placement - BLI: EL-339", () => {
      render(
        <DropIndicator
          visible={true}
          placement="After"
          orientation="horizontal"
        />
      );
      const indicator = document.querySelector('[data-placement="After"]');
      expect(indicator).toBeInTheDocument();
      expect(indicator).toHaveClass("-right-px");
    });

    it("should render On placement with dashed border - BLI: EL-339", () => {
      render(
        <DropIndicator visible={true} placement="On" orientation="horizontal" />
      );
      const indicator = document.querySelector('[data-placement="On"]');
      expect(indicator).toBeInTheDocument();
      expect(indicator).toHaveClass("border-dashed");
      expect(indicator).toHaveClass("inset-0");
      expect(indicator).toHaveClass("w-full");
    });
  });

  it("should use vertical as default orientation - BLI: EL-339", () => {
    render(<DropIndicator visible={true} placement="Before" />);
    const indicator = document.querySelector('[data-drop-indicator]');
    expect(indicator).toBeInTheDocument();
    expect(indicator).toHaveClass("left-0");
    expect(indicator).toHaveClass("right-0");
  });

  it("should apply custom className - BLI: EL-339", () => {
    render(
      <DropIndicator
        visible={true}
        placement="Before"
        className="custom-class"
      />
    );
    const indicator = document.querySelector('[data-drop-indicator]');
    expect(indicator).toHaveClass("custom-class");
  });

  it("should have aria-hidden attribute - BLI: EL-339", () => {
    render(<DropIndicator visible={true} placement="Before" />);
    const indicator = document.querySelector('[data-drop-indicator]');
    expect(indicator).toHaveAttribute("aria-hidden", "true");
  });

  it("should have pointer-events-none class - BLI: EL-339", () => {
    render(<DropIndicator visible={true} placement="Before" />);
    const indicator = document.querySelector('[data-drop-indicator]');
    expect(indicator).toHaveClass("pointer-events-none");
  });
});
