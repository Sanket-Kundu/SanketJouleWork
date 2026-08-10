import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { SegmentedButton, SegmentedButtonItem } from "./SegmentedButton";
import type { SegmentedButtonSelectionChangeDetail } from "../../types/segmented-button";
import en from "../../i18n/locales/en.json";

// ── Helpers ──────────────────────────────────────────────────────────────────

const StarIcon = () => <svg data-testid="star-icon" aria-hidden="true" />;

function renderThreeItems(overrides: Partial<React.ComponentProps<typeof SegmentedButton>> = {}) {
  return render(
    <SegmentedButton selectedId="view" {...overrides}>
      <SegmentedButtonItem id="view" text="View" />
      <SegmentedButtonItem id="edit" text="Edit" />
      <SegmentedButtonItem id="test" text="Test" />
    </SegmentedButton>
  );
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe("SegmentedButton", () => {
  // ── Rendering ─────────────────────────────────────────────────────────────

  it("renders a listbox - BLI: EL-339", () => {
    renderThreeItems();
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("has default aria-label from i18n on the listbox - BLI: EL-339", () => {
    renderThreeItems();
    expect(screen.getByRole("listbox")).toHaveAttribute(
      "aria-label",
      en.SEGMENTEDBUTTON_ARIA_DESCRIPTION
    );
  });

  it("renders three option items - BLI: EL-339", () => {
    renderThreeItems();
    expect(screen.getAllByRole("option")).toHaveLength(3);
  });

  it("renders item text - BLI: EL-339", () => {
    renderThreeItems();
    expect(screen.getByText("View")).toBeInTheDocument();
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("applies custom className to listbox - BLI: EL-339", () => {
    render(
      <SegmentedButton className="my-class">
        <SegmentedButtonItem id="a" text="A" />
      </SegmentedButton>
    );
    expect(screen.getByRole("listbox").className).toContain("my-class");
  });

  it("applies inline style to listbox - BLI: EL-339", () => {
    render(
      <SegmentedButton style={{ color: "red" }}>
        <SegmentedButtonItem id="a" text="A" />
      </SegmentedButton>
    );
    expect(screen.getByRole("listbox")).toHaveStyle({ color: "rgb(255, 0, 0)" });
  });

  // ── Single selection ───────────────────────────────────────────────────────

  it("marks selectedId item as aria-selected=true - BLI: EL-339", () => {
    renderThreeItems();
    const items = screen.getAllByRole("option");
    expect(items[0]).toHaveAttribute("aria-selected", "true");  // view
    expect(items[1]).toHaveAttribute("aria-selected", "false"); // edit
    expect(items[2]).toHaveAttribute("aria-selected", "false"); // test
  });

  it("selected item has tabIndex=0, others -1 - BLI: EL-339", () => {
    renderThreeItems();
    const items = screen.getAllByRole("option");
    expect(items[0]).toHaveAttribute("tabindex", "0");
    expect(items[1]).toHaveAttribute("tabindex", "-1");
  });

  it("calls onSelectionChange with correct detail when item is clicked (Single) - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    renderThreeItems({ onSelectionChange: handler });

    await user.click(screen.getByText("Edit"));

    expect(handler).toHaveBeenCalledOnce();
    const detail: SegmentedButtonSelectionChangeDetail = handler.mock.calls[0][0];
    expect(detail.selectedId).toBe("edit");
    expect(detail.selectedIds).toEqual(["edit"]);
    expect(detail.selectedItem.id).toBe("edit");
  });

  it("does not fire onSelectionChange when disabled item is clicked - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    render(
      <SegmentedButton onSelectionChange={handler}>
        <SegmentedButtonItem id="a" text="A" disabled />
      </SegmentedButton>
    );
    await user.click(screen.getByText("A"));
    expect(handler).not.toHaveBeenCalled();
  });

  // ── Multiple selection ─────────────────────────────────────────────────────

  it("does not set aria-multiselectable in Single mode - BLI: EL-339", () => {
    renderThreeItems();
    expect(screen.getByRole("listbox")).not.toHaveAttribute("aria-multiselectable");
  });

  it("sets aria-multiselectable='true' in Multiple mode - BLI: EL-339", () => {
    render(
      <SegmentedButton selectionMode="Multiple" selectedIds={["view"]}>
        <SegmentedButtonItem id="view" text="View" />
        <SegmentedButtonItem id="edit" text="Edit" />
      </SegmentedButton>
    );
    expect(screen.getByRole("listbox")).toHaveAttribute("aria-multiselectable", "true");
  });

  it("marks both items selected when selectedIds includes both (Multiple) - BLI: EL-339", () => {
    render(
      <SegmentedButton selectionMode="Multiple" selectedIds={["view", "edit"]}>
        <SegmentedButtonItem id="view" text="View" />
        <SegmentedButtonItem id="edit" text="Edit" />
        <SegmentedButtonItem id="test" text="Test" />
      </SegmentedButton>
    );
    const items = screen.getAllByRole("option");
    expect(items[0]).toHaveAttribute("aria-selected", "true");
    expect(items[1]).toHaveAttribute("aria-selected", "true");
    expect(items[2]).toHaveAttribute("aria-selected", "false");
  });

  it("adds an id to selectedIds when clicking unselected item (Multiple) - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    render(
      <SegmentedButton
        selectionMode="Multiple"
        selectedIds={["view"]}
        onSelectionChange={handler}
      >
        <SegmentedButtonItem id="view" text="View" />
        <SegmentedButtonItem id="edit" text="Edit" />
      </SegmentedButton>
    );
    await user.click(screen.getByText("Edit"));
    const detail: SegmentedButtonSelectionChangeDetail = handler.mock.calls[0][0];
    expect(detail.selectedIds).toContain("view");
    expect(detail.selectedIds).toContain("edit");
  });

  it("removes an id from selectedIds when clicking already-selected item (Multiple) - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    render(
      <SegmentedButton
        selectionMode="Multiple"
        selectedIds={["view", "edit"]}
        onSelectionChange={handler}
      >
        <SegmentedButtonItem id="view" text="View" />
        <SegmentedButtonItem id="edit" text="Edit" />
      </SegmentedButton>
    );
    await user.click(screen.getByText("Edit"));
    const detail: SegmentedButtonSelectionChangeDetail = handler.mock.calls[0][0];
    expect(detail.selectedIds).not.toContain("edit");
    expect(detail.selectedIds).toContain("view");
  });

  it("handles Multiple mode with no initial selectedIds (undefined) - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    render(
      <SegmentedButton selectionMode="Multiple" onSelectionChange={handler}>
        <SegmentedButtonItem id="view" text="View" />
        <SegmentedButtonItem id="edit" text="Edit" />
      </SegmentedButton>
    );
    await user.click(screen.getByText("View"));
    const detail: SegmentedButtonSelectionChangeDetail = handler.mock.calls[0][0];
    expect(detail.selectedIds).toEqual(["view"]);
  });

  // ── SegmentedButtonItem ───────────────────────────────────────────────────

  it("renders icon - BLI: EL-339", () => {
    render(
      <SegmentedButton>
        <SegmentedButtonItem id="a" icon={<StarIcon />} />
      </SegmentedButton>
    );
    expect(screen.getByTestId("star-icon")).toBeInTheDocument();
  });

  it("renders icon with text - BLI: EL-339", () => {
    render(
      <SegmentedButton>
        <SegmentedButtonItem id="a" icon={<StarIcon />} text="Star" />
      </SegmentedButton>
    );
    expect(screen.getByTestId("star-icon")).toBeInTheDocument();
    expect(screen.getByText("Star")).toBeInTheDocument();
  });

  it("icon-only item gets square dimensions and no padding - BLI: EL-339", () => {
    render(
      <SegmentedButton>
        <SegmentedButtonItem id="a" icon={<StarIcon />} />
      </SegmentedButton>
    );
    const item = screen.getByRole("option");
    expect(item.classList.contains("w-10")).toBe(true);
  });

  it("item with text does not apply icon-only padding - BLI: EL-339", () => {
    render(
      <SegmentedButton>
        <SegmentedButtonItem id="a" text="Label" />
      </SegmentedButton>
    );
    const item = screen.getByRole("option");
    // px-4 should be present (Large default), not icon-only sizing
    expect(item.classList.contains("px-4")).toBe(true);
    expect(item.classList.contains("px-2")).toBe(false);
  });

  it("disabled item has aria-disabled=true - BLI: EL-339", () => {
    render(
      <SegmentedButton>
        <SegmentedButtonItem id="a" text="A" disabled />
      </SegmentedButton>
    );
    expect(screen.getByRole("option")).toHaveAttribute("aria-disabled", "true");
  });

  it("non-disabled item does not have aria-disabled - BLI: EL-339", () => {
    render(
      <SegmentedButton>
        <SegmentedButtonItem id="a" text="A" />
      </SegmentedButton>
    );
    expect(screen.getByRole("option")).not.toHaveAttribute("aria-disabled");
  });

  it("applies tooltip as title attribute - BLI: EL-339", () => {
    render(
      <SegmentedButton>
        <SegmentedButtonItem id="a" text="A" tooltip="My tooltip" />
      </SegmentedButton>
    );
    expect(screen.getByRole("option")).toHaveAttribute("title", "My tooltip");
  });

  it("applies custom className to item - BLI: EL-339", () => {
    render(
      <SegmentedButton>
        <SegmentedButtonItem id="a" text="A" className="custom-item" />
      </SegmentedButton>
    );
    expect(screen.getByRole("option").className).toContain("custom-item");
  });

  it("controlled selected prop overrides context selection - BLI: EL-339", () => {
    render(
      <SegmentedButton selectedId="b">
        <SegmentedButtonItem id="a" text="A" selected={true} />
        <SegmentedButtonItem id="b" text="B" />
      </SegmentedButton>
    );
    const items = screen.getAllByRole("option");
    // Item A has selected=true override, B has selectedId="b" from context
    expect(items[0]).toHaveAttribute("aria-selected", "true");
    expect(items[1]).toHaveAttribute("aria-selected", "true");
  });

  it("controlled selected=false overrides context even if id matches selectedId - BLI: EL-339", () => {
    render(
      <SegmentedButton selectedId="a">
        <SegmentedButtonItem id="a" text="A" selected={false} />
      </SegmentedButton>
    );
    expect(screen.getByRole("option")).toHaveAttribute("aria-selected", "false");
  });

  it("item has aria-roledescription from i18n - BLI: EL-339", () => {
    render(
      <SegmentedButton>
        <SegmentedButtonItem id="a" text="A" />
      </SegmentedButton>
    );
    expect(screen.getByRole("option")).toHaveAttribute(
      "aria-roledescription",
      en.SEGMENTEDBUTTONITEM_ARIA_DESCRIPTION
    );
  });

  it("applies accessibleName as aria-label on the listbox - BLI: EL-339", () => {
    render(
      <SegmentedButton accessibleName="View mode" selectedId="a">
        <SegmentedButtonItem id="a" text="A" />
      </SegmentedButton>
    );
    expect(screen.getByRole("listbox")).toHaveAttribute("aria-label", "View mode");
  });

  it("applies accessibleNameRef as aria-labelledby on the listbox - BLI: EL-339", () => {
    render(
      <SegmentedButton accessibleNameRef="ext-label" selectedId="a">
        <SegmentedButtonItem id="a" text="A" />
      </SegmentedButton>
    );
    expect(screen.getByRole("listbox")).toHaveAttribute("aria-labelledby", "ext-label");
  });

  // ── Forwarded ref ─────────────────────────────────────────────────────────

  it("forwards ref to the <ul> element - BLI: EL-339", () => {
    const ref = React.createRef<HTMLUListElement>();
    render(
      <SegmentedButton ref={ref}>
        <SegmentedButtonItem id="a" text="A" />
      </SegmentedButton>
    );
    expect(ref.current).toBeInstanceOf(HTMLUListElement);
    expect(ref.current).toBe(screen.getByRole("listbox"));
  });

  it("SegmentedButtonItem forwards ref to <li> element - BLI: EL-339", () => {
    const ref = React.createRef<HTMLLIElement>();
    render(
      <SegmentedButton>
        <SegmentedButtonItem ref={ref} id="a" text="A" />
      </SegmentedButton>
    );
    expect(ref.current).toBeInstanceOf(HTMLLIElement);
    expect(ref.current).toBe(screen.getByRole("option"));
  });

  // ── Keyboard navigation ───────────────────────────────────────────────────

  it("ArrowRight moves focus to next item - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderThreeItems();

    const items = screen.getAllByRole("option");
    items[0].focus();
    await user.keyboard("{ArrowRight}");

    expect(document.activeElement).toBe(items[1]);
  });

  it("ArrowLeft moves focus to previous item - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderThreeItems();

    const items = screen.getAllByRole("option");
    items[1].focus();
    await user.keyboard("{ArrowLeft}");

    expect(document.activeElement).toBe(items[0]);
  });

  it("ArrowRight wraps from last to first - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderThreeItems();

    const items = screen.getAllByRole("option");
    items[2].focus();
    await user.keyboard("{ArrowRight}");

    expect(document.activeElement).toBe(items[0]);
  });

  it("ArrowLeft wraps from first to last - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderThreeItems();

    const items = screen.getAllByRole("option");
    items[0].focus();
    await user.keyboard("{ArrowLeft}");

    expect(document.activeElement).toBe(items[2]);
  });

  it("Enter triggers click on focused item - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    renderThreeItems({ onSelectionChange: handler });

    const items = screen.getAllByRole("option");
    items[1].focus();
    await user.keyboard("{Enter}");

    expect(handler).toHaveBeenCalledOnce();
    expect(handler.mock.calls[0][0].selectedId).toBe("edit");
  });

  it("Space triggers click on focused item - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    renderThreeItems({ onSelectionChange: handler });

    const items = screen.getAllByRole("option");
    items[2].focus();
    await user.keyboard(" ");

    expect(handler).toHaveBeenCalledOnce();
    expect(handler.mock.calls[0][0].selectedId).toBe("test");
  });

  it("ArrowRight skips disabled items - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(
      <SegmentedButton selectedId="view">
        <SegmentedButtonItem id="view" text="View" />
        <SegmentedButtonItem id="edit" text="Edit" disabled />
        <SegmentedButtonItem id="test" text="Test" />
      </SegmentedButton>
    );
    const items = screen.getAllByRole("option");
    // Only non-disabled items are in the focusable set
    // view -> ArrowRight -> should skip disabled edit -> go to test
    items[0].focus();
    await user.keyboard("{ArrowRight}");
    // The querySelectorAll filters by aria-disabled="true", so edit is skipped
    expect(document.activeElement).toBe(items[2]);
  });

  // ── displayName ───────────────────────────────────────────────────────────

  it("ArrowRight does nothing when all items are disabled (no focusable items) - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(
      <SegmentedButton>
        <SegmentedButtonItem id="a" text="A" disabled />
      </SegmentedButton>
    );
    // Focus the listbox itself (not an item) and press ArrowRight
    const listbox = screen.getByRole("listbox");
    listbox.focus();
    // No crash expected
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("ArrowRight does nothing when active element is not inside an li - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderThreeItems();
    // Focus the listbox container (not an li)
    screen.getByRole("listbox").focus();
    await user.keyboard("{ArrowRight}");
    // currentIndex will be -1, nothing should happen (no crash)
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("accepts a function ref - BLI: EL-339", () => {
    const refFn = vi.fn();
    render(
      <SegmentedButton ref={refFn}>
        <SegmentedButtonItem id="a" text="A" />
      </SegmentedButton>
    );
    expect(refFn).toHaveBeenCalledWith(expect.any(HTMLUListElement));
  });
});
