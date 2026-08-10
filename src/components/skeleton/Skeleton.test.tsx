import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Skeleton } from "./Skeleton";

describe("Skeleton", () => {
  it("renders with data-slot skeleton", () => {
    render(<Skeleton data-testid="skel" />);
    expect(screen.getByTestId("skel")).toHaveAttribute("data-slot", "skeleton");
  });

  it("applies shimmer class", () => {
    render(<Skeleton data-testid="skel" />);
    expect(screen.getByTestId("skel").className).toContain("skeleton-shimmer");
  });

  it("applies default rounded-md", () => {
    render(<Skeleton data-testid="skel" />);
    expect(screen.getByTestId("skel").className).toContain("rounded-md");
  });

  it("merges custom className", () => {
    render(<Skeleton data-testid="skel" className="h-4 w-[250px]" />);
    const el = screen.getByTestId("skel");
    expect(el.className).toContain("h-4");
    expect(el.className).toContain("w-[250px]");
  });

  it("renders children when provided", () => {
    render(
      <Skeleton data-testid="skel">
        <span>Loading</span>
      </Skeleton>,
    );
    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

  it("passes through HTML attributes", () => {
    render(<Skeleton data-testid="skel" id="sk-1" aria-hidden="true" />);
    const el = screen.getByTestId("skel");
    expect(el).toHaveAttribute("id", "sk-1");
    expect(el).toHaveAttribute("aria-hidden", "true");
  });

  it("has correct displayName", () => {
    expect(Skeleton.displayName).toBe("Skeleton");
  });
});
