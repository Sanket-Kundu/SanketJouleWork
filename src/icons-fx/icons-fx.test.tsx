import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import React from "react";

import * as FxIcons from "./index";

const iconEntries = Object.entries(FxIcons) as [
  string,
  React.ComponentType<Record<string, unknown>>,
][];

describe("icons-fx", () => {
  it.each(iconEntries)("%s renders an SVG element", (_name, Icon) => {
    const { container } = render(<Icon />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it.each(iconEntries)("%s uses a 20-unit viewBox", (_name, Icon) => {
    const { container } = render(<Icon />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("viewBox")).toMatch(/^0 0 20 \d+$/);
  });

  it.each(iconEntries)("%s contains at least one path", (_name, Icon) => {
    const { container } = render(<Icon />);
    const paths = container.querySelectorAll("path");
    expect(paths.length).toBeGreaterThan(0);
  });
});
