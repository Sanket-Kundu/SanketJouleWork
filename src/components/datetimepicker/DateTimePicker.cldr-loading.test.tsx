/**
 * Tests for DateTimePicker when CLDR data is not yet loaded.
 * Covers the `!cldrReady` fallback branches: empty input value, empty placeholder,
 * null formatters, null parsers.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

// Mock useEnsureCldr to return false (CLDR not loaded)
vi.mock("../../i18n", async (importOriginal) => {
  const mod = await importOriginal<typeof import("../../i18n")>();
  return {
    ...mod,
    useEnsureCldr: () => false,
  };
});

// Mock isPhone
vi.mock("../../lib/Device", () => ({
  isPhone: () => false,
  isTablet: () => false,
  isDesktop: () => true,
  supportsTouch: () => false,
  isIOS: () => false,
  isChrome: () => false,
  isSafari: () => false,
}));

// Mock ResponsivePopover
vi.mock("../responsive-popover/ResponsivePopover", () => ({
  ResponsivePopover: ({ open, children }: { open: boolean; children: React.ReactNode }) =>
    open ? <div data-testid="popover">{children}</div> : null,
}));

// Mock Calendar
vi.mock("../calendar/Calendar", () => ({
  Calendar: () => <div data-testid="calendar" />,
}));

import { DateTimePicker } from "./DateTimePicker";

describe("DateTimePicker (CLDR loading state)", () => {
  it("renders empty input value when CLDR is not ready", () => {
    render(<DateTimePicker value="2024-06-15T10:30:00" />);
    const input = screen.getByRole<HTMLInputElement>("textbox");
    // Input value should be empty (suppressed) while CLDR loads
    expect(input.value).toBe("");
  });

  it("renders empty placeholder when CLDR is not ready and no displayFormat", () => {
    render(<DateTimePicker />);
    const input = screen.getByRole<HTMLInputElement>("textbox");
    // Placeholder should be empty, not "yyyy-MM-dd HH:mm"
    expect(input.placeholder).toBe("");
  });

  it("uses explicit displayFormat as placeholder even when CLDR is not ready", () => {
    render(<DateTimePicker displayFormat="dd.MM.yyyy" timeFormat="24h" />);
    const input = screen.getByRole<HTMLInputElement>("textbox");
    // When displayFormat is explicitly set, it should still appear as placeholder
    expect(input.placeholder).toBe("dd.MM.yyyy HH:mm");
  });

  it("renders without crashing when value is set but CLDR is not ready", () => {
    render(<DateTimePicker value="2024-06-15T14:30:00" />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });
});
