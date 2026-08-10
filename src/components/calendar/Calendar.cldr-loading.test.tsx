/**
 * Tests for Calendar, DayPicker, MonthPicker and YearPicker when CLDR data is not yet loaded.
 * Covers the `!cldrReady` skeleton loading state: pulsing placeholder bars for
 * month names, weekday headers, day cells, week numbers and year cells.
 *
 * Uses vi.mock to force useEnsureCldr → false so we exercise the loading-state
 * code paths without needing to control the async CLDR fetch.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("../../i18n", async (importOriginal) => {
  const mod = await importOriginal<typeof import("../../i18n")>();
  return {
    ...mod,
    useEnsureCldr: () => false,
  };
});

import { Calendar } from "./Calendar";

describe("Calendar (CLDR loading state)", () => {
  it("renders with skeleton month button when CLDR is not ready - BLI: EL-339", () => {
    render(<Calendar focusedDate="2025-01-15" data-testid="calendar" />);
    expect(screen.getByTestId("calendar")).toBeInTheDocument();
    const monthBtn = screen.getByRole("button", { name: /select month/i });
    expect(monthBtn).toBeInTheDocument();
    expect(monthBtn.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("renders with skeleton year button when CLDR is not ready - BLI: EL-339", () => {
    render(<Calendar focusedDate="2025-01-15" data-testid="calendar" />);
    const yearBtn = screen.getByRole("button", { name: /select year/i });
    expect(yearBtn.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("renders day grid with skeleton weekday headers when CLDR is not ready - BLI: EL-339", () => {
    render(<Calendar focusedDate="2025-01-15" data-testid="calendar" />);
    const columnHeaders = screen.getAllByRole("columnheader");
    const skeletonHeaders = columnHeaders.filter(
      (h) => h.querySelector(".animate-pulse") !== null,
    );
    expect(skeletonHeaders.length).toBe(7);
  });

  it("renders day cells with skeleton content when CLDR is not ready - BLI: EL-339", () => {
    render(<Calendar focusedDate="2025-01-15" data-testid="calendar" />);
    const cells = screen.getAllByRole("gridcell");
    expect(cells.length).toBeGreaterThan(0);
    // Every day cell should show a skeleton, not a number
    const skeletonCells = cells.filter(
      (c) => c.querySelector(".animate-pulse") !== null,
    );
    expect(skeletonCells.length).toBe(cells.length);
  });

  it("renders week number column with skeletons when CLDR is not ready - BLI: EL-339", () => {
    render(<Calendar focusedDate="2025-01-15" hideWeekNumbers={false} data-testid="calendar" />);
    const rowHeaders = screen.getAllByRole("rowheader");
    expect(rowHeaders.length).toBeGreaterThan(0);
    const skeletonRowHeaders = rowHeaders.filter(
      (h) => h.querySelector(".animate-pulse") !== null,
    );
    expect(skeletonRowHeaders.length).toBe(rowHeaders.length);
  });

  it("renders year view with skeleton cells when CLDR is not ready - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(<Calendar focusedDate="2025-01-15" data-testid="calendar" />);
    // Navigate to year view
    await user.click(screen.getByRole("button", { name: /select year/i }));
    await user.click(screen.getByRole("button", { name: /select year/i }));
    // YearPicker should not mount — skeleton grid shown instead
    expect(screen.queryByRole("gridcell", { name: /year 2025/i })).not.toBeInTheDocument();
    // Skeleton placeholders should be present
    const container = screen.getByTestId("calendar");
    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);
  });
});
