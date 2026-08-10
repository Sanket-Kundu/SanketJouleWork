/**
 * icons.test.tsx
 *
 * Tests that each named icon export renders an SVG element.
 */

import { describe, it, expect } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import React from "react";

import * as Icons from "./icons";
import { JouleIcon, JouleWorkLogo } from "./icons";

const iconEntries = Object.entries(Icons).filter(
  ([, value]) => typeof value === "function" || (typeof value === "object" && value !== null && "displayName" in value)
) as [string, React.ComponentType<Record<string, unknown>>][];

describe("icons", () => {
  it.each(iconEntries)("%s renders an SVG element - BLI: EL-339", (_name, Icon) => {
    const { container } = render(<Icon />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });
});

describe("JouleIcon", () => {
  it("renders with default size", () => {
    const { container } = render(<JouleIcon />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "21");
    expect(svg).toHaveAttribute("height", "20");
  });

  it("renders with size prop (square)", () => {
    const { container } = render(<JouleIcon size={32} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "32");
    expect(svg).toHaveAttribute("height", "32");
  });

  it("renders with height prop (aspect-ratio preserved)", () => {
    const { container } = render(<JouleIcon height={32} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "34");
    expect(svg).toHaveAttribute("height", "32");
  });

  it("size prop takes precedence over height", () => {
    const { container } = render(<JouleIcon size={24} height={32} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "24");
    expect(svg).toHaveAttribute("height", "24");
  });

  it("applies hover gradient colors on mouseEnter", () => {
    const { container } = render(<JouleIcon />);
    const svg = container.querySelector("svg")!;
    fireEvent.mouseEnter(svg);
    const stop = svg.querySelector("linearGradient stop");
    expect(stop).toHaveAttribute("stop-color", "#5a2aff");
  });

  it("restores default gradient colors on mouseLeave", () => {
    const { container } = render(<JouleIcon />);
    const svg = container.querySelector("svg")!;
    fireEvent.mouseEnter(svg);
    fireEvent.mouseLeave(svg);
    const stop = svg.querySelector("linearGradient stop");
    expect(stop).toHaveAttribute("stop-color", "#4013E3");
  });

  it("uses controlled isHovered prop", () => {
    const { container } = render(<JouleIcon isHovered={true} />);
    const svg = container.querySelector("svg")!;
    const stop = svg.querySelector("linearGradient stop");
    expect(stop).toHaveAttribute("stop-color", "#5a2aff");
  });
});

describe("JouleWorkLogo", () => {
  it("renders with default height", () => {
    const { container } = render(<JouleWorkLogo />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("height", "36");
    expect(svg).toHaveAttribute("width", "135");
  });

  it("renders with custom height prop", () => {
    const { container } = render(<JouleWorkLogo height={32} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("height", "32");
    expect(svg).toHaveAttribute("width", "120");
  });

  it("renders diamond gradients and text paths", () => {
    const { container } = render(<JouleWorkLogo />);
    const svg = container.querySelector("svg")!;
    const paths = svg.querySelectorAll("path");
    expect(paths.length).toBeGreaterThan(8);
    const gradients = svg.querySelectorAll("linearGradient");
    expect(gradients.length).toBe(6);
  });

  it("applies hover gradient colors on mouseEnter", () => {
    const { container } = render(<JouleWorkLogo />);
    const svg = container.querySelector("svg")!;
    fireEvent.mouseEnter(svg);
    const stop = svg.querySelector("linearGradient stop");
    expect(stop).toHaveAttribute("stop-color", "#5a2aff");
  });

  it("restores default gradient colors on mouseLeave", () => {
    const { container } = render(<JouleWorkLogo />);
    const svg = container.querySelector("svg")!;
    fireEvent.mouseEnter(svg);
    fireEvent.mouseLeave(svg);
    const stop = svg.querySelector("linearGradient stop");
    expect(stop).toHaveAttribute("stop-color", "#4013E3");
  });

  it("uses controlled isHovered prop", () => {
    const { container } = render(<JouleWorkLogo isHovered={true} />);
    const svg = container.querySelector("svg")!;
    const stop = svg.querySelector("linearGradient stop");
    expect(stop).toHaveAttribute("stop-color", "#5a2aff");
  });

  it("text paths use CSS variable fills", () => {
    const { container } = render(<JouleWorkLogo />);
    const svg = container.querySelector("svg")!;
    const paths = Array.from(svg.querySelectorAll("path"));
    const logo1Path = paths.find(p => p.getAttribute("fill") === "var(--joule-logo-1)");
    const logo2Path = paths.find(p => p.getAttribute("fill") === "var(--joule-logo-2)");
    expect(logo1Path).toBeInTheDocument();
    expect(logo2Path).toBeInTheDocument();
  });
});
