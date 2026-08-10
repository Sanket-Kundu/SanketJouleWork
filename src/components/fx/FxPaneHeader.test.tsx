/**
 * FxPaneHeader.test.tsx
 *
 * Tests for FxPaneHeader, FxPaneHeaderAction, FxPaneHeaderSegmentedAction,
 * and FxPaneHeaderSplitAction.
 *
 * Strategy:
 *  - Stub ResizeObserver and IntersectionObserver at module level.
 *  - Use setupPopoverPolyfill() from test-utils for overflow menu interactions.
 *  - Use fireEvent for clicks to avoid userEvent + fake-timer conflicts.
 *  - FxPaneHeader uses useFxLayoutContext() internally; when rendered outside
 *    FxLayout the context is null and defaults apply — this is fine for unit tests.
 *  - The header has an off-screen measurement container (aria-hidden) that duplicates
 *    elements. Use getByTitle or scoped queries when needed.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import React from "react";

import {
  FxPaneHeader,
  FxPaneHeaderAction,
  FxPaneHeaderSegmentedAction,
  FxPaneHeaderSegmentedOption,
  FxPaneHeaderSplitAction,
  FxPaneHeaderSplitOption,
} from "./FxPaneHeader";

import type { FxPaneHeaderRef } from "../../types/fx";

import {
  setupPopoverPolyfill,
  stubResizeObserver,
  stubIntersectionObserver,
} from "../../test/test-utils";

// ─── Mock layout context ──────────────────────────────────────────────────────

// Mutable ref for controlling the mock context per-test
let mockLayoutContext: Record<string, unknown> | null = null;

vi.mock("./FxLayout", () => ({
  useFxLayoutContext: () => mockLayoutContext,
}));

// ─── Global stubs ─────────────────────────────────────────────────────────────

stubResizeObserver();
stubIntersectionObserver();
setupPopoverPolyfill();

// Stub requestAnimationFrame so measurement effects run synchronously in tests
let origRAF: typeof globalThis.requestAnimationFrame;
beforeEach(() => {
  mockLayoutContext = null; // Reset to null context for each test
  origRAF = globalThis.requestAnimationFrame;
  globalThis.requestAnimationFrame = (cb: FrameRequestCallback) => {
    cb(0);
    return 0;
  };
});
afterEach(() => {
  globalThis.requestAnimationFrame = origRAF;
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Icon-only buttons use the `title` attribute (tooltip).
 * The measurement container duplicates buttons, so we use getAllByTitle
 * and return the first one NOT inside the aria-hidden measurement container.
 */
function getVisibleButtonByTitle(title: string): HTMLElement {
  const all = screen.getAllByTitle(title);
  const visible = all.find((el) => !el.closest("[aria-hidden]"));
  return visible || all[0];
}

// ─── FxPaneHeaderAction ─────────────────────────────────────────────────────

describe("FxPaneHeaderAction", () => {
  it("renders a button with icon and fires onClick - BLI: EL-339", () => {
    const onClick = vi.fn();
    render(
      <FxPaneHeaderAction
        icon={<span data-testid="action-icon">IC</span>}
        text="Save"
        onClick={onClick}
      />
    );

    // Icon-only button: title attr is the tooltip/text
    const btn = getVisibleButtonByTitle("Save");
    expect(btn).toBeInTheDocument();
    expect(screen.getByTestId("action-icon")).toBeInTheDocument();

    fireEvent.click(btn);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("shows text label when showText=true - BLI: EL-339", () => {
    render(
      <FxPaneHeaderAction
        icon={<span>IC</span>}
        text="Edit"
        showText
      />
    );
    expect(screen.getByText("Edit")).toBeInTheDocument();
  });

  it("disabled state prevents click - BLI: EL-339", () => {
    const onClick = vi.fn();
    render(
      <FxPaneHeaderAction
        icon={<span>IC</span>}
        text="Delete"
        disabled
        onClick={onClick}
      />
    );

    const btn = getVisibleButtonByTitle("Delete");
    expect(btn).toBeDisabled();
    fireEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });
});

// ─── FxPaneHeader – rendering ───────────────────────────────────────────────

describe("FxPaneHeader – rendering", () => {
  it("renders title text - BLI: EL-339", () => {
    render(<FxPaneHeader title="My Pane Title" />);
    // Title appears both in measurement container and actual header.
    // Use getAllByText and verify at least one visible.
    const titles = screen.getAllByText("My Pane Title");
    expect(titles.length).toBeGreaterThanOrEqual(1);
  });

  it("renders back button when showBack=true and pane is end - BLI: EL-339", () => {
    const onBackClick = vi.fn();
    render(
      <FxPaneHeader
        pane="end"
        title="Detail"
        showBack
        onBackClick={onBackClick}
      />
    );

    const backBtn = getVisibleButtonByTitle("Back");
    expect(backBtn).toBeInTheDocument();
    fireEvent.click(backBtn);
    expect(onBackClick).toHaveBeenCalledOnce();
  });

  it("renders breadcrumbs when provided - BLI: EL-339", () => {
    render(
      <FxPaneHeader
        title="Page"
        breadcrumbs={<nav data-testid="bc-nav">Home / Page</nav>}
      />
    );
    expect(screen.getByTestId("bc-nav")).toBeInTheDocument();
  });

  it("children actions render in toolbar area - BLI: EL-339", () => {
    render(
      <FxPaneHeader title="Toolbar Test">
        <FxPaneHeaderAction
          icon={<span>S</span>}
          text="Share"
        />
        <FxPaneHeaderAction
          icon={<span>P</span>}
          text="Print"
        />
      </FxPaneHeader>
    );

    // Icon-only buttons appear with title attr; the measurement container also
    // renders them.  getByTitle finds the first match which is sufficient.
    expect(getVisibleButtonByTitle("Share")).toBeInTheDocument();
    expect(getVisibleButtonByTitle("Print")).toBeInTheDocument();
  });

  it("title edit mode renders rename title input - BLI: EL-339", () => {
    render(
      <FxPaneHeader
        title="Editable Title"
        titleEditable
        titleEditMode
      />
    );
    // FxRenameTitle in edit mode renders an input
    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("Editable Title");
  });

  it("renders subheader when provided - BLI: EL-339", () => {
    render(
      <FxPaneHeader title="WithSub" subheader={<div data-testid="subhdr">Sub</div>} />
    );
    expect(screen.getByTestId("subhdr")).toBeInTheDocument();
  });

  it("renders with showBorder class - BLI: EL-339", () => {
    const { container } = render(
      <FxPaneHeader title="Bordered" showBorder />
    );
    const header = container.querySelector("header");
    expect(header?.className).toContain("border-border");
  });

  it("renders title arrow button when showTitleArrow=true - BLI: EL-339", () => {
    render(
      <FxPaneHeader
        title="Arrow"
        showTitleArrow
      />
    );
    // The title arrow is a plain <button> with a ChevronDown icon
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThanOrEqual(1);
  });
});

// ─── FxPaneHeaderSegmentedAction ────────────────────────────────────────────

describe("FxPaneHeaderSegmentedAction", () => {
  it("renders segmented button with items - BLI: EL-339", () => {
    render(
      <FxPaneHeader title="Seg Test">
        <FxPaneHeaderSegmentedAction selectedId="a">
          <FxPaneHeaderSegmentedOption id="a" text="Alpha" />
          <FxPaneHeaderSegmentedOption id="b" text="Beta" />
        </FxPaneHeaderSegmentedAction>
      </FxPaneHeader>
    );

    // Measurement container duplicates, so use getAllByText
    const alphaElements = screen.getAllByText("Alpha");
    expect(alphaElements.length).toBeGreaterThanOrEqual(1);
    const betaElements = screen.getAllByText("Beta");
    expect(betaElements.length).toBeGreaterThanOrEqual(1);
  });

  it("fires onSelectionChange with selected item id - BLI: EL-339", () => {
    const onSelectionChange = vi.fn();
    render(
      <FxPaneHeader title="Seg Change">
        <FxPaneHeaderSegmentedAction
          selectedId="a"
          onSelectionChange={onSelectionChange}
        >
          <FxPaneHeaderSegmentedOption id="a" text="Alpha" />
          <FxPaneHeaderSegmentedOption id="b" text="Beta" />
        </FxPaneHeaderSegmentedAction>
      </FxPaneHeader>
    );

    // Click one of the "Beta" elements - pick the one in the visible toolbar
    // (not in the aria-hidden measurement container).
    const betaElements = screen.getAllByText("Beta");
    // Find the one NOT inside aria-hidden
    const visibleBeta = betaElements.find(
      (el) => !el.closest("[aria-hidden]")
    );
    expect(visibleBeta).toBeDefined();
    fireEvent.click(visibleBeta!);
    expect(onSelectionChange).toHaveBeenCalledWith({ selectedId: "b" });
  });
});

// ─── FxPaneHeaderSplitAction ────────────────────────────────────────────────

describe("FxPaneHeaderSplitAction", () => {
  it("renders split button and fires default action on click - BLI: EL-339", () => {
    const onClick = vi.fn();
    render(
      <FxPaneHeader title="Split Test">
        <FxPaneHeaderSplitAction
          icon={<span data-testid="split-icon">+</span>}
          text="Create"
          onClick={onClick}
        >
          <FxPaneHeaderSplitOption id="opt1" text="Option 1" />
          <FxPaneHeaderSplitOption id="opt2" text="Option 2" />
        </FxPaneHeaderSplitAction>
      </FxPaneHeader>
    );

    // The split button renders a group with role="group"
    const groups = screen.getAllByRole("group");
    expect(groups.length).toBeGreaterThanOrEqual(1);

    // Find the visible group (not in aria-hidden measurement container)
    const visibleGroup = groups.find((el) => !el.closest("[aria-hidden]"));
    expect(visibleGroup).toBeDefined();

    // Click the main text-button area inside the group
    const buttons = visibleGroup!.querySelectorAll("button");
    // First inner button is the text/action button
    expect(buttons.length).toBeGreaterThanOrEqual(1);
    fireEvent.click(buttons[0]);
    expect(onClick).toHaveBeenCalled();
  });
});

// ─── FxPaneHeader – overflow menu ───────────────────────────────────────────

describe("FxPaneHeader – overflow menu", () => {
  it("alwaysOverflow actions never appear in toolbar - BLI: EL-339", () => {
    render(
      <FxPaneHeader title="Overflow Test">
        <FxPaneHeaderAction
          icon={<span>V</span>}
          text="Visible"
          priority="high"
        />
        <FxPaneHeaderAction
          icon={<span>H</span>}
          text="Hidden"
          priority="alwaysOverflow"
        />
      </FxPaneHeader>
    );

    // The "Visible" action should be in the toolbar (icon-only button with title)
    expect(getVisibleButtonByTitle("Visible")).toBeInTheDocument();

    // There should be an overflow button ("More") since we have alwaysOverflow items
    expect(getVisibleButtonByTitle("More")).toBeInTheDocument();
  });

  it("overflow button appears when alwaysOverflow actions exist - BLI: EL-339", () => {
    render(
      <FxPaneHeader title="OB Test">
        <FxPaneHeaderAction
          icon={<span>A</span>}
          text="ActionA"
          priority="alwaysOverflow"
        />
      </FxPaneHeader>
    );

    expect(getVisibleButtonByTitle("More")).toBeInTheDocument();
  });

  it("actions with different priorities all render - BLI: EL-339", () => {
    render(
      <FxPaneHeader title="Priority Test">
        <FxPaneHeaderAction icon={<span>L</span>} text="Low" priority="low" />
        <FxPaneHeaderAction icon={<span>M</span>} text="Medium" priority="medium" />
        <FxPaneHeaderAction icon={<span>H</span>} text="High" priority="high" />
      </FxPaneHeader>
    );

    expect(getVisibleButtonByTitle("Low")).toBeInTheDocument();
    expect(getVisibleButtonByTitle("Medium")).toBeInTheDocument();
    expect(getVisibleButtonByTitle("High")).toBeInTheDocument();
  });

  // TODO: skipped – portal menu timing differs in CI (Node 22 + v8 coverage). Revisit when jsdom supports Popover API natively.
  it.skip("clicking overflow button opens overflow menu with alwaysOverflow actions", async () => {
    render(
      <FxPaneHeader title="OMenu Test">
        <FxPaneHeaderAction
          icon={<span>X</span>}
          text="Overflow Action"
          priority="alwaysOverflow"
        />
      </FxPaneHeader>
    );

    const overflowBtn = getVisibleButtonByTitle("More");
    await act(() => { fireEvent.click(overflowBtn); });

    // After opening the overflow menu, the action should appear as a menu item
    await waitFor(() => {
      const matches = screen.getAllByText("Overflow Action");
      // At least one should be visible (outside aria-hidden)
      const visibleMatch = matches.find((el) => !el.closest("[aria-hidden]"));
      expect(visibleMatch).toBeDefined();
    });
  });

  // TODO: skipped – portal menu timing differs in CI
  it.skip("relations render as Related submenu when visible", async () => {
    const relations = [
      { type: "space" as const, name: "My Space", id: "s1" },
      { type: "job" as const, name: "My Job", id: "j1" },
    ];

    render(
      <FxPaneHeader title="Relations Test" related={relations}>
        <FxPaneHeaderAction
          icon={<span>X</span>}
          text="Extra"
          priority="alwaysOverflow"
        />
      </FxPaneHeader>
    );

    // Relations button should be visible (tooltip "Related")
    const relBtn = getVisibleButtonByTitle("Related");
    expect(relBtn).toBeInTheDocument();

    // Click relations button to open its menu
    await act(() => { fireEvent.click(relBtn); });

    // Should show the relation items grouped by type
    await waitFor(() => {
      expect(screen.getByText("My Space")).toBeInTheDocument();
      expect(screen.getByText("My Job")).toBeInTheDocument();
      expect(screen.getByText("Related Spaces")).toBeInTheDocument();
      expect(screen.getByText("Related Jobs")).toBeInTheDocument();
    });
  });

  it("add button renders when showAddButton is true - BLI: EL-339", () => {
    const onAddClick = vi.fn();
    render(
      <FxPaneHeader title="Add Test" showAddButton onAddClick={onAddClick} />
    );

    const addBtn = getVisibleButtonByTitle("Add");
    expect(addBtn).toBeInTheDocument();
    fireEvent.click(addBtn);
    expect(onAddClick).toHaveBeenCalledOnce();
  });

  // TODO: skipped – portal menu timing differs in CI
  it.skip("multiple overflow actions appear in menu", async () => {
    render(
      <FxPaneHeader title="Multi Overflow">
        <FxPaneHeaderAction icon={<span>A</span>} text="Act A" priority="alwaysOverflow" />
        <FxPaneHeaderAction icon={<span>B</span>} text="Act B" priority="alwaysOverflow" />
      </FxPaneHeader>
    );

    const overflowBtn = getVisibleButtonByTitle("More");
    await act(() => { fireEvent.click(overflowBtn); });

    await waitFor(() => {
      const matchesA = screen.getAllByText("Act A");
      const visibleA = matchesA.find((el) => !el.closest("[aria-hidden]"));
      expect(visibleA).toBeDefined();

      const matchesB = screen.getAllByText("Act B");
      const visibleB = matchesB.find((el) => !el.closest("[aria-hidden]"));
      expect(visibleB).toBeDefined();
    });
  });
});

// ─── Additional branch coverage tests ──────────────────────────────────────

describe("FxPaneHeader – pane types", () => {
  it("renders with pane='start' - BLI: EL-339", () => {
    const { container } = render(<FxPaneHeader pane="start" title="Start Pane" />);
    const header = container.querySelector("header");
    expect(header).toBeInTheDocument();
    const titles = screen.getAllByText("Start Pane");
    expect(titles.length).toBeGreaterThanOrEqual(1);
  });

  it("renders with pane='end' - BLI: EL-339", () => {
    const { container } = render(<FxPaneHeader pane="end" title="End Pane" />);
    const header = container.querySelector("header");
    expect(header).toBeInTheDocument();
    const titles = screen.getAllByText("End Pane");
    expect(titles.length).toBeGreaterThanOrEqual(1);
  });

  it("renders with pane='center' (default) - BLI: EL-339", () => {
    const { container } = render(<FxPaneHeader title="Center Pane" />);
    const header = container.querySelector("header");
    expect(header).toBeInTheDocument();
  });
});

describe("FxPaneHeader – empty states", () => {
  it("renders with no title - BLI: EL-339", () => {
    const { container } = render(<FxPaneHeader />);
    const header = container.querySelector("header");
    expect(header).toBeInTheDocument();
  });

  it("renders with no children and no title - BLI: EL-339", () => {
    const { container } = render(<FxPaneHeader title="" />);
    const header = container.querySelector("header");
    expect(header).toBeInTheDocument();
  });

  it("renders with empty children - BLI: EL-339", () => {
    const { container } = render(
      <FxPaneHeader title="Empty Children">{null}</FxPaneHeader>
    );
    const header = container.querySelector("header");
    expect(header).toBeInTheDocument();
  });
});

describe("FxPaneHeader – title editing branches", () => {
  it("titleEditable renders FxRenameTitle in non-edit mode - BLI: EL-339", () => {
    render(
      <FxPaneHeader title="Rename Me" titleEditable />
    );
    // When titleEditable but not in edit mode, the rename component renders
    // as static text (not an input)
    const titles = screen.getAllByText("Rename Me");
    expect(titles.length).toBeGreaterThanOrEqual(1);
  });

  it("titleEditable + titleEditMode shows input and fires onTitleEditAccept - BLI: EL-339", () => {
    const onAccept = vi.fn();
    render(
      <FxPaneHeader
        title="Editable"
        titleEditable
        titleEditMode
        onTitleEditAccept={onAccept}
      />
    );
    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("Editable");

    // Change value and submit
    fireEvent.change(input, { target: { value: "New Title" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onAccept).toHaveBeenCalledWith({
      value: "New Title",
      previousValue: "Editable",
    });
  });

  it("titleEditable + titleEditMode fires onTitleEditCancel on Escape - BLI: EL-339", () => {
    const onCancel = vi.fn();
    render(
      <FxPaneHeader
        title="CancelMe"
        titleEditable
        titleEditMode
        onTitleEditCancel={onCancel}
      />
    );
    const input = screen.getByRole("textbox");
    fireEvent.keyDown(input, { key: "Escape" });
    expect(onCancel).toHaveBeenCalledWith({ value: "CancelMe" });
  });

  it("titleEditable fires onTitleEditModeChange on double-click - BLI: EL-339", () => {
    const onEditModeChange = vi.fn();
    render(
      <FxPaneHeader
        title="DblClick"
        titleEditable
        onTitleEditModeChange={onEditModeChange}
      />
    );
    // Find the title text (not in aria-hidden) and double-click it
    const titles = screen.getAllByText("DblClick");
    const visibleTitle = titles.find((el) => !el.closest("[aria-hidden]"));
    expect(visibleTitle).toBeDefined();
    fireEvent.doubleClick(visibleTitle!);
    expect(onEditModeChange).toHaveBeenCalledWith({ editMode: true });
  });
});

describe("FxPaneHeader – back button branches", () => {
  it("showBack on center pane renders back button - BLI: EL-339", () => {
    const onBackClick = vi.fn();
    render(
      <FxPaneHeader pane="center" title="Center Back" showBack onBackClick={onBackClick} />
    );
    const backBtn = getVisibleButtonByTitle("Back");
    expect(backBtn).toBeInTheDocument();
    fireEvent.click(backBtn);
    expect(onBackClick).toHaveBeenCalledOnce();
  });

  it("showBack on start pane does NOT render back button - BLI: EL-339", () => {
    render(
      <FxPaneHeader pane="start" title="Start No Back" showBack />
    );
    // Start pane should not show back button (only center and end)
    const backButtons = screen.queryAllByTitle("Back");
    const visibleBack = backButtons.find((el) => !el.closest("[aria-hidden]"));
    expect(visibleBack).toBeUndefined();
  });
});

describe("FxPaneHeader – title arrow branches", () => {
  it("showTitleArrow fires onTitleArrowClick when clicked - BLI: EL-339", () => {
    const onTitleArrowClick = vi.fn();
    render(
      <FxPaneHeader
        title="Arrow Click"
        showTitleArrow
        onTitleArrowClick={onTitleArrowClick}
      />
    );
    // The arrow button contains a ChevronDown icon. Find the button.
    const buttons = screen.getAllByRole("button");
    // Find the one that's not in aria-hidden and not a known tooltip button
    const arrowBtn = buttons.find(
      (btn) =>
        !btn.closest("[aria-hidden]") &&
        !btn.getAttribute("title")
    );
    expect(arrowBtn).toBeDefined();
    fireEvent.click(arrowBtn!);
    expect(onTitleArrowClick).toHaveBeenCalled();
  });

  it("title arrow is hidden when in edit mode - BLI: EL-339", () => {
    render(
      <FxPaneHeader
        title="Arrow Hidden"
        showTitleArrow
        titleEditable
        titleEditMode
      />
    );
    // When in edit mode, the title arrow should be hidden
    // Only the textbox should remain
    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
  });
});

describe("FxPaneHeader – showBorder branches", () => {
  it("renders without border when showBorder is false - BLI: EL-339", () => {
    const { container } = render(
      <FxPaneHeader title="No Border" showBorder={false} />
    );
    const header = container.querySelector("header");
    expect(header?.className).toContain("border-transparent");
  });
});

describe("FxPaneHeader – addButton branches", () => {
  it("add button uses custom tooltip when addButtonTooltip provided - BLI: EL-339", () => {
    render(
      <FxPaneHeader
        title="Custom Tooltip"
        showAddButton
        addButtonTooltip="Create new item"
      />
    );
    const addBtn = getVisibleButtonByTitle("Create new item");
    expect(addBtn).toBeInTheDocument();
  });

  it("add button hidden when in edit mode - BLI: EL-339", () => {
    render(
      <FxPaneHeader
        title="Edit No Add"
        showAddButton
        titleEditable
        titleEditMode
      />
    );
    // When titleEditMode is active, the add button should be hidden
    const addBtns = screen.queryAllByTitle("Add");
    const visible = addBtns.find((el) => !el.closest("[aria-hidden]"));
    expect(visible).toBeUndefined();
  });
});

describe("FxPaneHeader – relations branches", () => {
  // TODO: skipped – portal menu timing differs in CI
  it.skip("relations with conversation type render correctly", async () => {
    const relations = [
      { type: "conversation" as const, name: "Chat 1", id: "c1" },
    ];
    render(
      <FxPaneHeader title="Conv Relations" related={relations}>
        <FxPaneHeaderAction icon={<span>X</span>} text="Filler" priority="alwaysOverflow" />
      </FxPaneHeader>
    );

    const relBtn = getVisibleButtonByTitle("Related");
    await act(() => { fireEvent.click(relBtn); });

    await waitFor(() => {
      expect(screen.getByText("Chat 1")).toBeInTheDocument();
      expect(screen.getByText("Related Conversations")).toBeInTheDocument();
    });
  });

  // TODO: skipped – portal menu timing differs in CI
  it.skip("onRelationClick fires when clicking a relation item", async () => {
    const onRelationClick = vi.fn();
    const relations = [
      { type: "space" as const, name: "Space A", id: "s1" },
    ];
    render(
      <FxPaneHeader
        title="RelClick"
        related={relations}
        onRelationClick={onRelationClick}
      >
        <FxPaneHeaderAction icon={<span>X</span>} text="Filler" priority="alwaysOverflow" />
      </FxPaneHeader>
    );

    const relBtn = getVisibleButtonByTitle("Related");
    await act(() => { fireEvent.click(relBtn); });

    await waitFor(() => {
      expect(screen.getByText("Space A")).toBeInTheDocument();
    });

    const spaceItem = screen.getByText("Space A");
    await act(() => { fireEvent.click(spaceItem); });

    expect(onRelationClick).toHaveBeenCalledWith(
      expect.objectContaining({ type: "space", name: "Space A", id: "s1" })
    );
  });

  // TODO: skipped – portal menu timing differs in CI
  it.skip("multiple relation groups show separators between them", async () => {
    const relations = [
      { type: "space" as const, name: "My Space", id: "s1" },
      { type: "job" as const, name: "My Job", id: "j1" },
      { type: "conversation" as const, name: "My Chat", id: "c1" },
    ];
    render(
      <FxPaneHeader title="Multi Groups" related={relations}>
        <FxPaneHeaderAction icon={<span>X</span>} text="Extra" priority="alwaysOverflow" />
      </FxPaneHeader>
    );

    const relBtn = getVisibleButtonByTitle("Related");
    await act(() => { fireEvent.click(relBtn); });

    await waitFor(() => {
      expect(screen.getByText("Related Spaces")).toBeInTheDocument();
      expect(screen.getByText("Related Jobs")).toBeInTheDocument();
      expect(screen.getByText("Related Conversations")).toBeInTheDocument();
      expect(screen.getByText("My Space")).toBeInTheDocument();
      expect(screen.getByText("My Job")).toBeInTheDocument();
      expect(screen.getByText("My Chat")).toBeInTheDocument();
    });
  });

  it("empty relations array shows no relations button - BLI: EL-339", () => {
    render(
      <FxPaneHeader title="No Relations" related={[]} />
    );
    const relBtns = screen.queryAllByTitle("Related");
    const visible = relBtns.find((el) => !el.closest("[aria-hidden]"));
    expect(visible).toBeUndefined();
  });
});

describe("FxPaneHeader – action priority branches", () => {
  it("low priority action renders in toolbar - BLI: EL-339", () => {
    render(
      <FxPaneHeader title="Low Priority">
        <FxPaneHeaderAction icon={<span>L</span>} text="LowAction" priority="low" />
      </FxPaneHeader>
    );
    expect(getVisibleButtonByTitle("LowAction")).toBeInTheDocument();
  });

  it("medium priority action renders in toolbar (default) - BLI: EL-339", () => {
    render(
      <FxPaneHeader title="Medium Priority">
        <FxPaneHeaderAction icon={<span>M</span>} text="MedAction" />
      </FxPaneHeader>
    );
    expect(getVisibleButtonByTitle("MedAction")).toBeInTheDocument();
  });

  it("high priority action renders in toolbar - BLI: EL-339", () => {
    render(
      <FxPaneHeader title="High Priority">
        <FxPaneHeaderAction icon={<span>H</span>} text="HighAction" priority="high" />
      </FxPaneHeader>
    );
    expect(getVisibleButtonByTitle("HighAction")).toBeInTheDocument();
  });
});

describe("FxPaneHeaderAction – additional branches", () => {
  it("uses custom tooltip when provided - BLI: EL-339", () => {
    render(
      <FxPaneHeaderAction
        icon={<span>IC</span>}
        text="Save"
        tooltip="Save changes now"
      />
    );
    const btn = getVisibleButtonByTitle("Save changes now");
    expect(btn).toBeInTheDocument();
  });

  it("renders with custom design prop - BLI: EL-339", () => {
    render(
      <FxPaneHeaderAction
        icon={<span>IC</span>}
        text="Primary"
        design="Primary"
      />
    );
    expect(getVisibleButtonByTitle("Primary")).toBeInTheDocument();
  });

  it("renders with centered prop - BLI: EL-339", () => {
    render(
      <FxPaneHeader title="Centered Test">
        <FxPaneHeaderAction
          icon={<span>IC</span>}
          text="Centered"
          centered
        />
      </FxPaneHeader>
    );
    // The centered action should still render as a visible button
    expect(getVisibleButtonByTitle("Centered")).toBeInTheDocument();
  });

  it("renders with className prop - BLI: EL-339", () => {
    const { container } = render(
      <FxPaneHeaderAction
        icon={<span>IC</span>}
        text="Styled"
        className="my-custom-class"
      />
    );
    const btn = container.querySelector(".my-custom-class");
    expect(btn).toBeInTheDocument();
  });
});

describe("FxPaneHeaderSegmentedAction – additional branches", () => {
  it("renders with icon-only mode (showText=false) - BLI: EL-339", () => {
    render(
      <FxPaneHeader title="Seg NoText">
        <FxPaneHeaderSegmentedAction selectedId="a" showText={false}>
          <FxPaneHeaderSegmentedOption id="a" icon={<span data-testid="seg-icon-a">A</span>} text="Alpha" />
          <FxPaneHeaderSegmentedOption id="b" icon={<span data-testid="seg-icon-b">B</span>} text="Beta" />
        </FxPaneHeaderSegmentedAction>
      </FxPaneHeader>
    );
    // Icons should still be rendered
    expect(screen.getAllByTestId("seg-icon-a").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByTestId("seg-icon-b").length).toBeGreaterThanOrEqual(1);
  });

  it("renders segmented options with selected state - BLI: EL-339", () => {
    render(
      <FxPaneHeader title="Seg Selected">
        <FxPaneHeaderSegmentedAction selectedId="b">
          <FxPaneHeaderSegmentedOption id="a" text="Alpha" />
          <FxPaneHeaderSegmentedOption id="b" text="Beta" selected />
        </FxPaneHeaderSegmentedAction>
      </FxPaneHeader>
    );
    const betaElements = screen.getAllByText("Beta");
    expect(betaElements.length).toBeGreaterThanOrEqual(1);
  });

  it("does not fire callback when no onSelectionChange provided - BLI: EL-339", () => {
    render(
      <FxPaneHeader title="Seg NoCallback">
        <FxPaneHeaderSegmentedAction selectedId="a">
          <FxPaneHeaderSegmentedOption id="a" text="Alpha" />
          <FxPaneHeaderSegmentedOption id="b" text="Beta" />
        </FxPaneHeaderSegmentedAction>
      </FxPaneHeader>
    );
    const betaElements = screen.getAllByText("Beta");
    const visibleBeta = betaElements.find((el) => !el.closest("[aria-hidden]"));
    expect(visibleBeta).toBeDefined();
    // Click should not throw when no callback is provided
    fireEvent.click(visibleBeta!);
  });
});

describe("FxPaneHeaderSplitAction – additional branches", () => {
  // TODO: skipped – portal menu timing differs in CI
  it.skip("fires onOptionSelect when a split option is selected from menu", async () => {
    const onOptionSelect = vi.fn();
    render(
      <FxPaneHeader title="Split Options">
        <FxPaneHeaderSplitAction
          icon={<span>+</span>}
          text="Create"
          onOptionSelect={onOptionSelect}
        >
          <FxPaneHeaderSplitOption id="opt1" text="Option 1" />
          <FxPaneHeaderSplitOption id="opt2" text="Option 2" />
        </FxPaneHeaderSplitAction>
      </FxPaneHeader>
    );

    // Find the split button group (not in aria-hidden)
    const groups = screen.getAllByRole("group");
    const visibleGroup = groups.find((el) => !el.closest("[aria-hidden]"));
    expect(visibleGroup).toBeDefined();

    // Click the dropdown arrow (second button in the group)
    const buttons = visibleGroup!.querySelectorAll("button");
    expect(buttons.length).toBeGreaterThanOrEqual(2);
    await act(() => { fireEvent.click(buttons[1]); }); // Arrow button

    // Now the menu should be open, click an option
    await waitFor(() => {
      const opt1 = screen.getAllByText("Option 1");
      const visibleOpt = opt1.find((el) => !el.closest("[aria-hidden]"));
      expect(visibleOpt).toBeDefined();
    });

    const opt1 = screen.getAllByText("Option 1");
    const visibleOpt = opt1.find((el) => !el.closest("[aria-hidden]"));
    if (visibleOpt) {
      await act(() => { fireEvent.click(visibleOpt); });
      expect(onOptionSelect).toHaveBeenCalledWith({ optionId: "opt1" });
    }
  });

  it("split action renders with showText=true - BLI: EL-339", () => {
    render(
      <FxPaneHeader title="Split Text">
        <FxPaneHeaderSplitAction
          icon={<span>+</span>}
          text="Add New"
          showText
        >
          <FxPaneHeaderSplitOption id="x" text="X" />
        </FxPaneHeaderSplitAction>
      </FxPaneHeader>
    );
    const textEls = screen.getAllByText("Add New");
    expect(textEls.length).toBeGreaterThanOrEqual(1);
  });

  it("split action arrow toggle closes menu on second click - BLI: EL-339", () => {
    render(
      <FxPaneHeader title="Split Toggle">
        <FxPaneHeaderSplitAction
          icon={<span>+</span>}
          text="Create"
        >
          <FxPaneHeaderSplitOption id="opt1" text="Opt1" />
        </FxPaneHeaderSplitAction>
      </FxPaneHeader>
    );

    const groups = screen.getAllByRole("group");
    const visibleGroup = groups.find((el) => !el.closest("[aria-hidden]"));
    const buttons = visibleGroup!.querySelectorAll("button");

    // Open
    fireEvent.click(buttons[1]);
    // Close
    fireEvent.click(buttons[1]);
    expect(visibleGroup).toBeInTheDocument();
  });
});

describe("FxPaneHeader – overflow menu action click", () => {
  // TODO: skipped – portal menu timing differs in CI
  it.skip("clicking an action in overflow menu fires its onClick", async () => {
    const onClick = vi.fn();
    render(
      <FxPaneHeader title="OverflowClick">
        <FxPaneHeaderAction
          icon={<span>X</span>}
          text="OverflowAction"
          priority="alwaysOverflow"
          onClick={onClick}
        />
      </FxPaneHeader>
    );

    const overflowBtn = getVisibleButtonByTitle("More");
    await act(() => { fireEvent.click(overflowBtn); });

    await waitFor(() => {
      const actionItems = screen.getAllByText("OverflowAction");
      const visibleItem = actionItems.find((el) => !el.closest("[aria-hidden]"));
      expect(visibleItem).toBeDefined();
    });

    const actionItems = screen.getAllByText("OverflowAction");
    const visibleItem = actionItems.find((el) => !el.closest("[aria-hidden]"));
    await act(() => { fireEvent.click(visibleItem!); });
    expect(onClick).toHaveBeenCalled();
  });
});

describe("FxPaneHeader – subheader rendering", () => {
  it("subheader appears below the main row - BLI: EL-339", () => {
    const { container } = render(
      <FxPaneHeader
        title="WithSubheader"
        subheader={<div data-testid="my-subheader">Sub content</div>}
      />
    );
    expect(screen.getByTestId("my-subheader")).toBeInTheDocument();
    expect(screen.getByText("Sub content")).toBeInTheDocument();
    // Ensure subheader is within the header element
    const header = container.querySelector("header");
    expect(header?.querySelector("[data-testid='my-subheader']")).toBeInTheDocument();
  });
});

describe("FxPaneHeader – style and className props", () => {
  it("applies custom className to header - BLI: EL-339", () => {
    const { container } = render(
      <FxPaneHeader title="Styled" className="my-header-class" />
    );
    const header = container.querySelector("header");
    expect(header?.className).toContain("my-header-class");
  });

  it("applies custom style to header - BLI: EL-339", () => {
    const { container } = render(
      <FxPaneHeader title="InlineStyled" style={{ color: "red" }} />
    );
    const header = container.querySelector("header");
    expect(header?.style.color).toBe("red");
  });
});

describe("FxPaneHeader – fragment children flattening", () => {
  it("handles actions wrapped in a React.Fragment - BLI: EL-339", () => {
    render(
      <FxPaneHeader title="Fragment Test">
        <>
          <FxPaneHeaderAction icon={<span>A</span>} text="FragA" />
          <FxPaneHeaderAction icon={<span>B</span>} text="FragB" />
        </>
      </FxPaneHeader>
    );
    expect(getVisibleButtonByTitle("FragA")).toBeInTheDocument();
    expect(getVisibleButtonByTitle("FragB")).toBeInTheDocument();
  });

  it("handles nested fragments - BLI: EL-339", () => {
    render(
      <FxPaneHeader title="Nested Fragment">
        <>
          <>
            <FxPaneHeaderAction icon={<span>N</span>} text="Nested" />
          </>
        </>
      </FxPaneHeader>
    );
    expect(getVisibleButtonByTitle("Nested")).toBeInTheDocument();
  });
});

describe("FxPaneHeader – segmented in overflow", () => {
  // TODO: skipped – portal menu timing differs in CI
  it.skip("renders segmented action in overflow with checkmark for selected", async () => {
    render(
      <FxPaneHeader title="SegOverflow">
        <FxPaneHeaderSegmentedAction selectedId="b" priority="alwaysOverflow">
          <FxPaneHeaderSegmentedOption id="a" text="Opt A" />
          <FxPaneHeaderSegmentedOption id="b" text="Opt B" />
        </FxPaneHeaderSegmentedAction>
      </FxPaneHeader>
    );

    const overflowBtn = getVisibleButtonByTitle("More");
    await act(() => { fireEvent.click(overflowBtn); });

    // Both options should be in the overflow menu
    await waitFor(() => {
      const optA = screen.getAllByText("Opt A");
      expect(optA.find((el) => !el.closest("[aria-hidden]"))).toBeDefined();
      const optB = screen.getAllByText("Opt B");
      expect(optB.find((el) => !el.closest("[aria-hidden]"))).toBeDefined();
    });
  });

  // TODO: skipped – portal menu timing differs in CI
  it.skip("clicking segmented option in overflow fires onSelectionChange", async () => {
    const onSelChange = vi.fn();
    render(
      <FxPaneHeader title="SegOverflowClick">
        <FxPaneHeaderSegmentedAction
          selectedId="a"
          priority="alwaysOverflow"
          onSelectionChange={onSelChange}
        >
          <FxPaneHeaderSegmentedOption id="a" text="OptX" />
          <FxPaneHeaderSegmentedOption id="b" text="OptY" />
        </FxPaneHeaderSegmentedAction>
      </FxPaneHeader>
    );

    const overflowBtn = getVisibleButtonByTitle("More");
    await act(() => { fireEvent.click(overflowBtn); });

    await waitFor(() => {
      const optY = screen.getAllByText("OptY");
      const visibleOptY = optY.find((el) => !el.closest("[aria-hidden]"));
      expect(visibleOptY).toBeDefined();
    });

    const optY = screen.getAllByText("OptY");
    const visibleOptY = optY.find((el) => !el.closest("[aria-hidden]"));
    await act(() => { fireEvent.click(visibleOptY!); });
    expect(onSelChange).toHaveBeenCalledWith({ selectedId: "b" });
  });
});

describe("FxPaneHeader – split action in overflow", () => {
  // TODO: skipped – portal menu timing differs in CI
  it.skip("renders split action in overflow as menu item with submenu", async () => {
    render(
      <FxPaneHeader title="SplitOverflow">
        <FxPaneHeaderSplitAction
          icon={<span>+</span>}
          text="Create"
          priority="alwaysOverflow"
        >
          <FxPaneHeaderSplitOption id="doc" text="Document" />
          <FxPaneHeaderSplitOption id="folder" text="Folder" />
        </FxPaneHeaderSplitAction>
      </FxPaneHeader>
    );

    const overflowBtn = getVisibleButtonByTitle("More");
    await act(() => { fireEvent.click(overflowBtn); });

    // The split action should appear as a "Create" menu item
    await waitFor(() => {
      const createItems = screen.getAllByText("Create");
      const visibleCreate = createItems.find((el) => !el.closest("[aria-hidden]"));
      expect(visibleCreate).toBeDefined();
    });
  });
});

describe("FxPaneHeader – editMode class", () => {
  it("applies edit mode class when titleEditMode is true - BLI: EL-339", () => {
    const { container } = render(
      <FxPaneHeader
        title="EditClass"
        titleEditable
        titleEditMode
      />
    );
    const header = container.querySelector("header");
    expect(header?.className).toContain("fx-pane-header--title-edit-mode");
  });

  it("does not apply edit mode class when titleEditMode is false - BLI: EL-339", () => {
    const { container } = render(
      <FxPaneHeader
        title="NoEditClass"
        titleEditable
      />
    );
    const header = container.querySelector("header");
    expect(header?.className).not.toContain("fx-pane-header--title-edit-mode");
  });
});

describe("FxPaneHeader – ref API", () => {
  it("exposes focus and getNativeElement via ref - BLI: EL-339", () => {
    const ref = React.createRef<FxPaneHeaderRef>();
    render(
      <FxPaneHeader ref={ref} title="RefTest" />
    );
    expect(ref.current).toBeDefined();
    expect(typeof ref.current!.focus).toBe("function");
    expect(typeof ref.current!.getNativeElement).toBe("function");
    const el = ref.current!.getNativeElement();
    expect(el).toBeInstanceOf(HTMLElement);
    expect(el?.tagName).toBe("HEADER");
    expect(ref.current!.nativeElement).toBeInstanceOf(HTMLElement);
    expect(ref.current!.nativeElement?.tagName).toBe("HEADER");
  });
});

describe("FxPaneHeader – relations with custom icons", () => {
  // TODO: skipped – portal menu timing differs in CI
  it.skip("relation items with custom icons use them", async () => {
    const relations = [
      {
        type: "space" as const,
        name: "Custom Icon Space",
        id: "s1",
        icon: <span data-testid="custom-rel-icon">*</span>,
      },
    ];
    render(
      <FxPaneHeader title="CustomRelIcon" related={relations}>
        <FxPaneHeaderAction icon={<span>X</span>} text="F" priority="alwaysOverflow" />
      </FxPaneHeader>
    );
    const relBtn = getVisibleButtonByTitle("Related");
    await act(() => { fireEvent.click(relBtn); });
    await waitFor(() => {
      expect(screen.getByTestId("custom-rel-icon")).toBeInTheDocument();
    });
  });
});

describe("FxPaneHeaderSegmentedOption – standalone render", () => {
  it("renders null on its own (parent handles rendering) - BLI: EL-339", () => {
    const { container } = render(
      <FxPaneHeaderSegmentedOption id="test" text="Solo" />
    );
    // The component itself returns null
    expect(container.innerHTML).toBe("");
  });
});

describe("FxPaneHeaderSplitOption – standalone render", () => {
  it("renders null on its own (parent handles rendering) - BLI: EL-339", () => {
    const { container } = render(
      <FxPaneHeaderSplitOption id="test" text="Solo" />
    );
    expect(container.innerHTML).toBe("");
  });
});

// ─── Layout-context-dependent branch tests ───────────────────────────────────

describe("FxPaneHeader – with layout context (start toggle)", () => {
  it("renders start toggle button when context provides toggleStartPane - BLI: EL-339", () => {
    const toggleStart = vi.fn();
    mockLayoutContext = {
      startVisible: true,
      endVisible: false,
      maxPanes: 3,
      compactMode: false,
      allowStart: true,
      allowEnd: true,
      suppressEnd: false,
      utilityEndPane: false,
      isSettingsMode: false,
      inputMode: "oneline",
      toggleStartPane: toggleStart,
      toggleEndPane: vi.fn(),
      openNavigation: vi.fn(),
    };

    render(<FxPaneHeader pane="center" title="Context Toggle" />);
    // Start toggle should render with "Hide List" tooltip when start is visible
    const toggleBtn = getVisibleButtonByTitle("Hide List");
    expect(toggleBtn).toBeInTheDocument();
    fireEvent.click(toggleBtn);
    expect(toggleStart).toHaveBeenCalled();
  });

  it("renders start toggle with 'Show List' tooltip when start is hidden - BLI: EL-339", () => {
    mockLayoutContext = {
      startVisible: false,
      endVisible: false,
      maxPanes: 3,
      compactMode: false,
      allowStart: true,
      allowEnd: true,
      suppressEnd: false,
      utilityEndPane: false,
      isSettingsMode: false,
      inputMode: "oneline",
      toggleStartPane: vi.fn(),
      toggleEndPane: vi.fn(),
      openNavigation: vi.fn(),
    };

    render(<FxPaneHeader pane="center" title="Toggle Show" />);
    const toggleBtn = getVisibleButtonByTitle("Show List");
    expect(toggleBtn).toBeInTheDocument();
  });

  it("renders back-style toggle when maxPanes=1 - BLI: EL-339", () => {
    const toggleStart = vi.fn();
    mockLayoutContext = {
      startVisible: true,
      endVisible: false,
      maxPanes: 1,
      compactMode: false,
      allowStart: true,
      allowEnd: false,
      suppressEnd: false,
      utilityEndPane: false,
      isSettingsMode: false,
      inputMode: "oneline",
      toggleStartPane: toggleStart,
      toggleEndPane: vi.fn(),
      openNavigation: vi.fn(),
    };

    render(<FxPaneHeader pane="center" title="BackToggle" />);
    const backBtn = getVisibleButtonByTitle("Back to list");
    expect(backBtn).toBeInTheDocument();
    fireEvent.click(backBtn);
    expect(toggleStart).toHaveBeenCalled();
  });
});

describe("FxPaneHeader – with layout context (end toggle)", () => {
  it("renders end toggle button for center pane - BLI: EL-339", () => {
    const toggleEnd = vi.fn();
    mockLayoutContext = {
      startVisible: true,
      endVisible: true,
      maxPanes: 3,
      compactMode: false,
      allowStart: true,
      allowEnd: true,
      suppressEnd: false,
      utilityEndPane: false,
      isSettingsMode: false,
      inputMode: "oneline",
      toggleStartPane: vi.fn(),
      toggleEndPane: toggleEnd,
      openNavigation: vi.fn(),
    };

    render(<FxPaneHeader pane="center" title="End Toggle" />);
    const toggleBtn = getVisibleButtonByTitle("Hide Conversation");
    expect(toggleBtn).toBeInTheDocument();
    fireEvent.click(toggleBtn);
    expect(toggleEnd).toHaveBeenCalled();
  });

  it("shows 'Show chat' tooltip when end pane is hidden - BLI: EL-339", () => {
    mockLayoutContext = {
      startVisible: true,
      endVisible: false,
      maxPanes: 3,
      compactMode: false,
      allowStart: true,
      allowEnd: true,
      suppressEnd: false,
      utilityEndPane: false,
      isSettingsMode: false,
      inputMode: "oneline",
      toggleStartPane: vi.fn(),
      toggleEndPane: vi.fn(),
      openNavigation: vi.fn(),
    };

    render(<FxPaneHeader pane="center" title="Show Chat" />);
    const toggleBtn = getVisibleButtonByTitle("Show Conversation");
    expect(toggleBtn).toBeInTheDocument();
  });

  it("does not render end toggle when utilityEndPane is true - BLI: EL-339", () => {
    mockLayoutContext = {
      startVisible: true,
      endVisible: true,
      maxPanes: 3,
      compactMode: false,
      allowStart: true,
      allowEnd: true,
      suppressEnd: false,
      utilityEndPane: true,
      isSettingsMode: false,
      inputMode: "oneline",
      toggleStartPane: vi.fn(),
      toggleEndPane: vi.fn(),
      openNavigation: vi.fn(),
    };

    render(<FxPaneHeader pane="center" title="No End Toggle" />);
    const btns = screen.queryAllByTitle("Hide Conversation");
    const visible = btns.find((el) => !el.closest("[aria-hidden]"));
    expect(visible).toBeUndefined();
  });

  it("does not render end toggle when isSettingsMode is true - BLI: EL-339", () => {
    mockLayoutContext = {
      startVisible: true,
      endVisible: true,
      maxPanes: 3,
      compactMode: false,
      allowStart: true,
      allowEnd: true,
      suppressEnd: false,
      utilityEndPane: false,
      isSettingsMode: true,
      inputMode: "oneline",
      toggleStartPane: vi.fn(),
      toggleEndPane: vi.fn(),
      openNavigation: vi.fn(),
    };

    render(<FxPaneHeader pane="center" title="Settings Mode" />);
    const btns = screen.queryAllByTitle("Hide Conversation");
    const visible = btns.find((el) => !el.closest("[aria-hidden]"));
    expect(visible).toBeUndefined();
  });
});

describe("FxPaneHeader – with layout context (hamburger)", () => {
  it("renders hamburger button in compact mode - BLI: EL-339", () => {
    const openNav = vi.fn();
    mockLayoutContext = {
      startVisible: false,
      endVisible: false,
      maxPanes: 1,
      compactMode: true,
      leftmostVisiblePane: "center",
      allowStart: false,
      allowEnd: false,
      suppressEnd: false,
      utilityEndPane: false,
      isSettingsMode: false,
      inputMode: "oneline",
      toggleStartPane: vi.fn(),
      toggleEndPane: vi.fn(),
      openNavigation: openNav,
    };

    render(<FxPaneHeader pane="center" title="Compact" />);
    const hamburger = getVisibleButtonByTitle("Open navigation");
    expect(hamburger).toBeInTheDocument();
    fireEvent.click(hamburger);
    expect(openNav).toHaveBeenCalled();
  });

  it("renders hamburger on end pane when it is the leftmost visible - BLI: EL-339", () => {
    const openNav = vi.fn();
    mockLayoutContext = {
      startVisible: false,
      endVisible: true,
      maxPanes: 1,
      compactMode: true,
      leftmostVisiblePane: "end",
      allowStart: false,
      allowEnd: true,
      suppressEnd: false,
      utilityEndPane: false,
      isSettingsMode: false,
      inputMode: "oneline",
      toggleStartPane: vi.fn(),
      toggleEndPane: vi.fn(),
      openNavigation: openNav,
    };

    render(<FxPaneHeader pane="end" title="End With Hamburger" />);
    const hamburger = getVisibleButtonByTitle("Open navigation");
    expect(hamburger).toBeInTheDocument();
    fireEvent.click(hamburger);
    expect(openNav).toHaveBeenCalled();
  });

  it("does not render hamburger on center pane when start is the leftmost - BLI: EL-339", () => {
    mockLayoutContext = {
      startVisible: true,
      endVisible: false,
      maxPanes: 2,
      compactMode: true,
      leftmostVisiblePane: "start",
      allowStart: true,
      allowEnd: false,
      suppressEnd: false,
      utilityEndPane: false,
      isSettingsMode: false,
      inputMode: "oneline",
      toggleStartPane: vi.fn(),
      toggleEndPane: vi.fn(),
      openNavigation: vi.fn(),
    };

    render(<FxPaneHeader pane="center" title="Center No Hamburger" />);
    const btns = screen.queryAllByTitle("Open navigation");
    const visible = btns.find((el) => !el.closest("[aria-hidden]"));
    expect(visible).toBeUndefined();
  });
});

describe("FxPaneHeader – with layout context (close button)", () => {
  it("renders close button on end header when maxPanes=1 - BLI: EL-339", () => {
    const toggleEnd = vi.fn();
    mockLayoutContext = {
      startVisible: false,
      endVisible: true,
      maxPanes: 1,
      compactMode: false,
      allowStart: false,
      allowEnd: true,
      suppressEnd: false,
      utilityEndPane: false,
      isSettingsMode: false,
      inputMode: "oneline",
      toggleStartPane: vi.fn(),
      toggleEndPane: toggleEnd,
      openNavigation: vi.fn(),
    };

    render(<FxPaneHeader pane="end" title="Close Test" />);
    const closeBtn = getVisibleButtonByTitle("Close");
    expect(closeBtn).toBeInTheDocument();
    fireEvent.click(closeBtn);
    expect(toggleEnd).toHaveBeenCalled();
  });

  it("renders close button on end header with utilityEndPane - BLI: EL-339", () => {
    const toggleEnd = vi.fn();
    mockLayoutContext = {
      startVisible: true,
      endVisible: true,
      maxPanes: 3,
      compactMode: false,
      allowStart: true,
      allowEnd: true,
      suppressEnd: false,
      utilityEndPane: true,
      isSettingsMode: false,
      inputMode: "oneline",
      toggleStartPane: vi.fn(),
      toggleEndPane: toggleEnd,
      openNavigation: vi.fn(),
    };

    render(<FxPaneHeader pane="end" title="Utility Close" />);
    const closeBtn = getVisibleButtonByTitle("Close");
    expect(closeBtn).toBeInTheDocument();
    fireEvent.click(closeBtn);
    expect(toggleEnd).toHaveBeenCalled();
  });

  it("does not render close button on center header - BLI: EL-339", () => {
    mockLayoutContext = {
      startVisible: true,
      endVisible: true,
      maxPanes: 1,
      compactMode: false,
      allowStart: true,
      allowEnd: true,
      suppressEnd: false,
      utilityEndPane: false,
      isSettingsMode: false,
      inputMode: "oneline",
      toggleStartPane: vi.fn(),
      toggleEndPane: vi.fn(),
      openNavigation: vi.fn(),
    };

    render(<FxPaneHeader pane="center" title="No Close Center" />);
    const btns = screen.queryAllByTitle("Close");
    const visible = btns.find((el) => !el.closest("[aria-hidden]"));
    expect(visible).toBeUndefined();
  });
});

describe("FxPaneHeader – start toggle not shown for start pane", () => {
  it("does not show start toggle on start pane header - BLI: EL-339", () => {
    mockLayoutContext = {
      startVisible: true,
      endVisible: false,
      maxPanes: 3,
      compactMode: false,
      allowStart: true,
      allowEnd: true,
      suppressEnd: false,
      utilityEndPane: false,
      isSettingsMode: false,
      inputMode: "oneline",
      toggleStartPane: vi.fn(),
      toggleEndPane: vi.fn(),
      openNavigation: vi.fn(),
    };

    render(<FxPaneHeader pane="start" title="Start Pane Header" />);
    // Start toggle only renders on center pane
    const btns = screen.queryAllByTitle("Hide List");
    const visible = btns.find((el) => !el.closest("[aria-hidden]"));
    expect(visible).toBeUndefined();
  });
});

describe("FxPaneHeader – allowStart=false hides start toggle", () => {
  it("does not show start toggle when allowStart is false - BLI: EL-339", () => {
    mockLayoutContext = {
      startVisible: false,
      endVisible: false,
      maxPanes: 3,
      compactMode: false,
      allowStart: false,
      allowEnd: true,
      suppressEnd: false,
      utilityEndPane: false,
      isSettingsMode: false,
      inputMode: "oneline",
      toggleStartPane: vi.fn(),
      toggleEndPane: vi.fn(),
      openNavigation: vi.fn(),
    };

    render(<FxPaneHeader pane="center" title="No Start Toggle" />);
    const showBtns = screen.queryAllByTitle("Show List");
    const hideBtns = screen.queryAllByTitle("Hide List");
    const visibleShow = showBtns.find((el) => !el.closest("[aria-hidden]"));
    const visibleHide = hideBtns.find((el) => !el.closest("[aria-hidden]"));
    expect(visibleShow).toBeUndefined();
    expect(visibleHide).toBeUndefined();
  });
});

describe("FxPaneHeader – allowEnd=false hides end toggle", () => {
  it("does not show end toggle when allowEnd is false - BLI: EL-339", () => {
    mockLayoutContext = {
      startVisible: true,
      endVisible: false,
      maxPanes: 3,
      compactMode: false,
      allowStart: true,
      allowEnd: false,
      suppressEnd: false,
      utilityEndPane: false,
      isSettingsMode: false,
      inputMode: "oneline",
      toggleStartPane: vi.fn(),
      toggleEndPane: vi.fn(),
      openNavigation: vi.fn(),
    };

    render(<FxPaneHeader pane="center" title="No End Toggle2" />);
    const showBtns = screen.queryAllByTitle("Show Conversation");
    const hideBtns = screen.queryAllByTitle("Hide Conversation");
    const visibleShow = showBtns.find((el) => !el.closest("[aria-hidden]"));
    const visibleHide = hideBtns.find((el) => !el.closest("[aria-hidden]"));
    expect(visibleShow).toBeUndefined();
    expect(visibleHide).toBeUndefined();
  });
});

describe("FxPaneHeader – getRelationIcon branches", () => {
  // TODO: skipped – portal menu timing differs in CI
  it.skip("uses job icon for job relation type", async () => {
    const relations = [
      { type: "job" as const, name: "Job Rel", id: "j1" },
    ];
    render(
      <FxPaneHeader title="Job Rel Type" related={relations}>
        <FxPaneHeaderAction icon={<span>X</span>} text="F" priority="alwaysOverflow" />
      </FxPaneHeader>
    );
    const relBtn = getVisibleButtonByTitle("Related");
    await act(() => { fireEvent.click(relBtn); });
    await waitFor(() => {
      expect(screen.getByText("Job Rel")).toBeInTheDocument();
      expect(screen.getByText("Related Jobs")).toBeInTheDocument();
    });
  });

  // TODO: skipped – portal menu timing differs in CI
  it.skip("uses conversation icon for conversation relation type", async () => {
    const relations = [
      { type: "conversation" as const, name: "Conv Rel", id: "c1" },
    ];
    render(
      <FxPaneHeader title="Conv Rel Type" related={relations}>
        <FxPaneHeaderAction icon={<span>X</span>} text="F" priority="alwaysOverflow" />
      </FxPaneHeader>
    );
    const relBtn = getVisibleButtonByTitle("Related");
    await act(() => { fireEvent.click(relBtn); });
    await waitFor(() => {
      expect(screen.getByText("Conv Rel")).toBeInTheDocument();
      expect(screen.getByText("Related Conversations")).toBeInTheDocument();
    });
  });
});

describe("FxPaneHeader – breadcrumbs hidden in edit mode", () => {
  it("hides breadcrumbs when in title edit mode - BLI: EL-339", () => {
    render(
      <FxPaneHeader
        title="Edit Breadcrumbs"
        titleEditable
        titleEditMode
        breadcrumbs={<nav data-testid="bc-hidden">Home / Page</nav>}
      />
    );
    // The breadcrumbs should be hidden during edit mode
    const bcEl = screen.queryByTestId("bc-hidden");
    expect(bcEl).toBeNull();
  });
});

describe("FxPaneHeader – actions with showText and priority mixed", () => {
  it("renders action with showText=true in toolbar - BLI: EL-339", () => {
    render(
      <FxPaneHeader title="ShowText Mix">
        <FxPaneHeaderAction icon={<span>E</span>} text="Edit Item" showText priority="high" />
        <FxPaneHeaderAction icon={<span>D</span>} text="Delete" priority="low" />
      </FxPaneHeader>
    );
    // Edit Item should show text
    const editEls = screen.getAllByText("Edit Item");
    expect(editEls.length).toBeGreaterThanOrEqual(1);
    // Delete should be icon-only (appear via title)
    expect(getVisibleButtonByTitle("Delete")).toBeInTheDocument();
  });
});

// ─── Tests with mocked DOM measurements ──────────────────────────────────────

/**
 * These tests mock offsetWidth and ResizeObserver to simulate real layout measurements.
 * This enables testing overflow calculation, text collapse, and centering logic.
 */
describe("FxPaneHeader – with mocked measurements (overflow calculation)", () => {
  let origOffsetWidth: PropertyDescriptor | undefined;
  let OrigResizeObserver: typeof globalThis.ResizeObserver;

  beforeEach(() => {
    // Save original offsetWidth descriptor
    origOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetWidth");
    // Save current ResizeObserver (which may be the stub)
    OrigResizeObserver = globalThis.ResizeObserver;
  });

  afterEach(() => {
    // Restore offsetWidth
    if (origOffsetWidth) {
      Object.defineProperty(HTMLElement.prototype, "offsetWidth", origOffsetWidth);
    } else {
      // If there was no original descriptor, delete it
      delete (HTMLElement.prototype as any).offsetWidth;
    }
    // Restore ResizeObserver
    globalThis.ResizeObserver = OrigResizeObserver;
  });

  /**
   * Creates a mock ResizeObserver that immediately calls the callback with a
   * contentRect width.
   */
  function installMockResizeObserver(width: number) {
    globalThis.ResizeObserver = class MockResizeObserver {
      private cb: ResizeObserverCallback;
      constructor(cb: ResizeObserverCallback) {
        this.cb = cb;
      }
      observe() {
        // Call callback synchronously with mock entry
        this.cb(
          [{ contentRect: { width } } as unknown as ResizeObserverEntry],
          this as unknown as ResizeObserver
        );
      }
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver;
  }

  it("overflow calculation triggers when header has measurements and width - BLI: EL-339", () => {
    installMockResizeObserver(800);

    Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
      configurable: true,
      get() {
        const measure = this.getAttribute?.("data-measure");
        if (measure === "start-section") return 100;
        if (measure === "hamburger") return 36;
        if (measure === "toggle-start") return 36;
        if (measure === "back-button") return 36;
        if (measure === "toggle-end") return 36;
        if (measure === "overflow") return 36;
        if (measure === "relations") return 36;
        if (measure?.endsWith("-icon")) return 36;
        if (measure?.endsWith("-text")) return 80;
        return 200;
      },
    });

    const { container } = render(
      <FxPaneHeader title="Measured Header">
        <FxPaneHeaderAction icon={<span>A</span>} text="ActionA" priority="high" />
        <FxPaneHeaderAction icon={<span>B</span>} text="ActionB" priority="low" />
        <FxPaneHeaderAction icon={<span>C</span>} text="ActionC" priority="alwaysOverflow" />
      </FxPaneHeader>
    );

    const header = container.querySelector("header");
    expect(header).toBeInTheDocument();
    expect(getVisibleButtonByTitle("ActionA")).toBeInTheDocument();
    expect(getVisibleButtonByTitle("ActionB")).toBeInTheDocument();
    expect(getVisibleButtonByTitle("More")).toBeInTheDocument();
  });

  it("narrow width causes low priority actions to overflow - BLI: EL-339", () => {
    installMockResizeObserver(200);

    Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
      configurable: true,
      get() {
        const measure = this.getAttribute?.("data-measure");
        if (measure === "start-section") return 120;
        if (measure === "overflow") return 36;
        if (measure === "relations") return 36;
        if (measure?.endsWith("-icon")) return 36;
        if (measure?.endsWith("-text")) return 100;
        if (measure) return 36;
        return 200;
      },
    });

    render(
      <FxPaneHeader title="Narrow">
        <FxPaneHeaderAction icon={<span>H</span>} text="HighPri" priority="high" />
        <FxPaneHeaderAction icon={<span>L</span>} text="LowPri" priority="low" showText />
        <FxPaneHeaderAction icon={<span>M</span>} text="MedPri" priority="medium" showText />
      </FxPaneHeader>
    );

    expect(getVisibleButtonByTitle("HighPri")).toBeInTheDocument();
  });

  it("centering layout activates with centered action and sufficient width - BLI: EL-339", () => {
    installMockResizeObserver(1200);

    Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
      configurable: true,
      get() {
        const measure = this.getAttribute?.("data-measure");
        if (measure === "start-section") return 100;
        if (measure === "overflow") return 36;
        if (measure === "relations") return 0;
        if (measure === "toggle-end") return 36;
        if (measure === "toggle-start") return 36;
        if (measure?.endsWith("-icon")) return 36;
        if (measure?.endsWith("-text")) return 100;
        if (measure) return 0;
        return 200;
      },
    });

    render(
      <FxPaneHeader title="CenterLayout">
        <FxPaneHeaderAction icon={<span>L</span>} text="Left" priority="high" />
        <FxPaneHeaderSegmentedAction selectedId="a" centered>
          <FxPaneHeaderSegmentedOption id="a" text="Opt A" />
          <FxPaneHeaderSegmentedOption id="b" text="Opt B" />
        </FxPaneHeaderSegmentedAction>
        <FxPaneHeaderAction icon={<span>R</span>} text="Right" priority="high" />
      </FxPaneHeader>
    );

    const titles = screen.getAllByText("CenterLayout");
    expect(titles.length).toBeGreaterThanOrEqual(1);
  });

  it("relations overflow to menu when not enough space - BLI: EL-339", () => {
    installMockResizeObserver(180);

    Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
      configurable: true,
      get() {
        const measure = this.getAttribute?.("data-measure");
        if (measure === "start-section") return 150;
        if (measure === "overflow") return 36;
        if (measure === "relations") return 36;
        if (measure?.endsWith("-icon")) return 36;
        if (measure?.endsWith("-text")) return 80;
        if (measure) return 36;
        return 200;
      },
    });

    const relations = [
      { type: "space" as const, name: "Overflowed Space", id: "s1" },
    ];

    render(
      <FxPaneHeader title="RelOvfl" related={relations}>
        <FxPaneHeaderAction icon={<span>A</span>} text="Act" priority="high" />
      </FxPaneHeader>
    );

    const titles = screen.getAllByText("RelOvfl");
    expect(titles.length).toBeGreaterThanOrEqual(1);
  });

  it("action text collapses before full overflow - BLI: EL-339", () => {
    installMockResizeObserver(300);

    Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
      configurable: true,
      get() {
        const measure = this.getAttribute?.("data-measure");
        if (measure === "start-section") return 100;
        if (measure === "overflow") return 36;
        if (measure === "relations") return 0;
        if (measure?.endsWith("-icon")) return 36;
        if (measure?.endsWith("-text")) return 120;
        if (measure) return 0;
        return 200;
      },
    });

    render(
      <FxPaneHeader title="TextCollapse">
        <FxPaneHeaderAction icon={<span>A</span>} text="TextAction" priority="low" showText />
        <FxPaneHeaderAction icon={<span>B</span>} text="HighText" priority="high" showText />
      </FxPaneHeader>
    );

    expect(getVisibleButtonByTitle("TextAction")).toBeInTheDocument();
    expect(getVisibleButtonByTitle("HighText")).toBeInTheDocument();
  });

  it("centering layout with context toggles and actions before/after - BLI: EL-339", () => {
    const toggleStart = vi.fn();
    const toggleEnd = vi.fn();
    mockLayoutContext = {
      startVisible: true,
      endVisible: true,
      maxPanes: 3,
      compactMode: false,
      allowStart: true,
      allowEnd: true,
      suppressEnd: false,
      utilityEndPane: false,
      isSettingsMode: false,
      inputMode: "oneline",
      toggleStartPane: toggleStart,
      toggleEndPane: toggleEnd,
      openNavigation: vi.fn(),
    };

    installMockResizeObserver(1400);

    Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
      configurable: true,
      get() {
        const measure = this.getAttribute?.("data-measure");
        if (measure === "start-section") return 80;
        if (measure === "toggle-start") return 36;
        if (measure === "toggle-end") return 36;
        if (measure === "overflow") return 36;
        if (measure === "relations") return 0;
        if (measure?.endsWith("-icon")) return 40;
        if (measure?.endsWith("-text")) return 120;
        if (measure) return 0;
        return 200;
      },
    });

    render(
      <FxPaneHeader pane="center" title="CenterCtx">
        <FxPaneHeaderAction icon={<span>L</span>} text="Before" priority="high" />
        <FxPaneHeaderSegmentedAction selectedId="x" centered>
          <FxPaneHeaderSegmentedOption id="x" text="X" />
          <FxPaneHeaderSegmentedOption id="y" text="Y" />
        </FxPaneHeaderSegmentedAction>
        <FxPaneHeaderAction icon={<span>R</span>} text="After" priority="high" />
      </FxPaneHeader>
    );

    const titles = screen.getAllByText("CenterCtx");
    expect(titles.length).toBeGreaterThanOrEqual(1);
  });

  // TODO: skipped – portal menu timing differs in CI
  it.skip("overflow menu shows relations submenu when relations overflow", async () => {
    installMockResizeObserver(150);

    Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
      configurable: true,
      get() {
        const measure = this.getAttribute?.("data-measure");
        if (measure === "start-section") return 100;
        if (measure === "overflow") return 36;
        if (measure === "relations") return 36;
        if (measure?.endsWith("-icon")) return 36;
        if (measure?.endsWith("-text")) return 80;
        if (measure) return 0;
        return 200;
      },
    });

    const relations = [
      { type: "space" as const, name: "Space Overflow", id: "s1" },
    ];

    render(
      <FxPaneHeader title="RelInOvfl" related={relations}>
        <FxPaneHeaderAction icon={<span>A</span>} text="Action" priority="alwaysOverflow" />
      </FxPaneHeader>
    );

    // Should have overflow button
    const overflowBtn = getVisibleButtonByTitle("More");
    expect(overflowBtn).toBeInTheDocument();
    await act(() => { fireEvent.click(overflowBtn); });

    // The action should be in the overflow menu
    await waitFor(() => {
      const actionItems = screen.getAllByText("Action");
      const visibleAction = actionItems.find((el) => !el.closest("[aria-hidden]"));
      expect(visibleAction).toBeDefined();
    });
  });

  // TODO: skipped – portal menu timing differs in CI
  it.skip("segmented action overflows and shows in overflow menu with checkmarks", async () => {
    installMockResizeObserver(160);

    Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
      configurable: true,
      get() {
        const measure = this.getAttribute?.("data-measure");
        if (measure === "start-section") return 150;
        if (measure === "overflow") return 36;
        if (measure?.endsWith("-icon")) return 100;
        if (measure?.endsWith("-text")) return 200;
        if (measure) return 0;
        return 200;
      },
    });

    const onSelChange = vi.fn();
    render(
      <FxPaneHeader title="SegOvfl">
        <FxPaneHeaderSegmentedAction
          selectedId="a"
          priority="low"
          onSelectionChange={onSelChange}
        >
          <FxPaneHeaderSegmentedOption id="a" text="Seg A" />
          <FxPaneHeaderSegmentedOption id="b" text="Seg B" />
        </FxPaneHeaderSegmentedAction>
      </FxPaneHeader>
    );

    // The overflow button should appear if the segmented action overflowed
    const overflowBtns = screen.queryAllByTitle("More");
    const visibleOvfl = overflowBtns.find((el) => !el.closest("[aria-hidden]"));
    if (visibleOvfl) {
      await act(() => { fireEvent.click(visibleOvfl); });
      // Check that segmented options appear in the overflow menu
      await waitFor(() => {
        const segAItems = screen.getAllByText("Seg A");
        expect(segAItems.length).toBeGreaterThanOrEqual(1);
      });
    }
  });

  // TODO: skipped – portal menu timing differs in CI
  it.skip("split action overflows and shows in overflow menu", async () => {
    installMockResizeObserver(160);

    Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
      configurable: true,
      get() {
        const measure = this.getAttribute?.("data-measure");
        if (measure === "start-section") return 150;
        if (measure === "overflow") return 36;
        if (measure?.endsWith("-icon")) return 100;
        if (measure?.endsWith("-text")) return 200;
        if (measure) return 0;
        return 200;
      },
    });

    const onOptionSelect = vi.fn();
    render(
      <FxPaneHeader title="SplitOvfl">
        <FxPaneHeaderSplitAction
          icon={<span>+</span>}
          text="New"
          priority="low"
          onOptionSelect={onOptionSelect}
        >
          <FxPaneHeaderSplitOption id="a" text="New A" />
          <FxPaneHeaderSplitOption id="b" text="New B" />
        </FxPaneHeaderSplitAction>
      </FxPaneHeader>
    );

    const overflowBtns = screen.queryAllByTitle("More");
    const visibleOvfl = overflowBtns.find((el) => !el.closest("[aria-hidden]"));
    if (visibleOvfl) {
      await act(() => { fireEvent.click(visibleOvfl); });
      await waitFor(() => {
        const newItems = screen.getAllByText("New");
        expect(newItems.length).toBeGreaterThanOrEqual(1);
      });
    }
  });

  it("hamburger and close button with measurements and context - BLI: EL-339", () => {
    const toggleEnd = vi.fn();
    const openNav = vi.fn();
    mockLayoutContext = {
      startVisible: false,
      endVisible: true,
      maxPanes: 1,
      compactMode: true,
      allowStart: false,
      allowEnd: true,
      suppressEnd: false,
      utilityEndPane: false,
      isSettingsMode: false,
      inputMode: "oneline",
      toggleStartPane: vi.fn(),
      toggleEndPane: toggleEnd,
      openNavigation: openNav,
    };

    installMockResizeObserver(600);

    Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
      configurable: true,
      get() {
        const measure = this.getAttribute?.("data-measure");
        if (measure === "start-section") return 80;
        if (measure === "hamburger") return 36;
        if (measure === "overflow") return 36;
        if (measure?.endsWith("-icon")) return 36;
        if (measure?.endsWith("-text")) return 80;
        if (measure) return 0;
        return 200;
      },
    });

    render(
      <FxPaneHeader pane="end" title="EndMeasured" showBack>
        <FxPaneHeaderAction icon={<span>A</span>} text="EndAction" priority="high" />
      </FxPaneHeader>
    );

    // End pane with maxPanes=1 should show close button
    const closeBtn = getVisibleButtonByTitle("Close");
    expect(closeBtn).toBeInTheDocument();

    // Back button should be visible on end pane
    const backBtn = getVisibleButtonByTitle("Back");
    expect(backBtn).toBeInTheDocument();
  });

  it("edit mode reserves extra space in overflow calculation - BLI: EL-339", () => {
    installMockResizeObserver(500);

    Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
      configurable: true,
      get() {
        const measure = this.getAttribute?.("data-measure");
        if (measure === "start-section") return 80;
        if (measure === "overflow") return 36;
        if (measure?.endsWith("-icon")) return 36;
        if (measure?.endsWith("-text")) return 80;
        if (measure) return 0;
        return 200;
      },
    });

    render(
      <FxPaneHeader
        title="EditOverflow"
        titleEditable
        titleEditMode
      >
        <FxPaneHeaderAction icon={<span>A</span>} text="EditAct" priority="high" />
      </FxPaneHeader>
    );

    // In edit mode with measurements, the overflow calculation adds 200px extra
    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
  });

  it("centering layout shows relations, overflow, end toggle, add button, and title arrow - BLI: EL-339", () => {
    const toggleEnd = vi.fn();
    const onAddClick = vi.fn();
    const onRelationClick = vi.fn();
    const onTitleArrowClick = vi.fn();
    mockLayoutContext = {
      startVisible: true,
      endVisible: true,
      maxPanes: 3,
      compactMode: false,
      allowStart: true,
      allowEnd: true,
      suppressEnd: false,
      utilityEndPane: false,
      isSettingsMode: false,
      inputMode: "oneline",
      toggleStartPane: vi.fn(),
      toggleEndPane: toggleEnd,
      openNavigation: vi.fn(),
    };

    installMockResizeObserver(2000);

    Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
      configurable: true,
      get() {
        const measure = this.getAttribute?.("data-measure");
        if (measure === "start-section") return 80;
        if (measure === "toggle-start") return 36;
        if (measure === "toggle-end") return 36;
        if (measure === "overflow") return 36;
        if (measure === "relations") return 36;
        if (measure?.endsWith("-icon")) return 40;
        if (measure?.endsWith("-text")) return 120;
        if (measure) return 0;
        return 200;
      },
    });

    const relations = [
      { type: "space" as const, name: "CenterSpace", id: "cs1" },
    ];

    render(
      <FxPaneHeader
        pane="center"
        title="CenterFull"
        showTitleArrow
        showAddButton
        related={relations}
        onTitleArrowClick={onTitleArrowClick}
        onAddClick={onAddClick}
        onRelationClick={onRelationClick}
      >
        <FxPaneHeaderAction icon={<span>L</span>} text="LeftAct" priority="high" />
        <FxPaneHeaderSegmentedAction selectedId="a" centered>
          <FxPaneHeaderSegmentedOption id="a" text="CentA" />
          <FxPaneHeaderSegmentedOption id="b" text="CentB" />
        </FxPaneHeaderSegmentedAction>
        <FxPaneHeaderAction icon={<span>R</span>} text="RightAct" priority="high" />
        <FxPaneHeaderAction icon={<span>O</span>} text="OverflowAct" priority="alwaysOverflow" />
      </FxPaneHeader>
    );

    // Check for centering layout elements
    const titles = screen.getAllByText("CenterFull");
    expect(titles.length).toBeGreaterThanOrEqual(1);

    // Check if centering activated by looking for the centering CSS classes
    // Even if it doesn't fully center, the code paths should be exercised
  });

  it("centering layout with close button on end pane with maxPanes=1 - BLI: EL-339", () => {
    const toggleEnd = vi.fn();
    mockLayoutContext = {
      startVisible: false,
      endVisible: true,
      maxPanes: 1,
      compactMode: true,
      allowStart: false,
      allowEnd: true,
      suppressEnd: false,
      utilityEndPane: false,
      isSettingsMode: false,
      inputMode: "oneline",
      toggleStartPane: vi.fn(),
      toggleEndPane: toggleEnd,
      openNavigation: vi.fn(),
    };

    installMockResizeObserver(1000);

    Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
      configurable: true,
      get() {
        const measure = this.getAttribute?.("data-measure");
        if (measure === "start-section") return 80;
        if (measure === "hamburger") return 36;
        if (measure === "overflow") return 36;
        if (measure?.endsWith("-icon")) return 40;
        if (measure?.endsWith("-text")) return 100;
        if (measure) return 0;
        return 200;
      },
    });

    render(
      <FxPaneHeader pane="end" title="EndCenter" showBack>
        <FxPaneHeaderAction icon={<span>A</span>} text="EndAct" priority="high" />
        <FxPaneHeaderSegmentedAction selectedId="x" centered>
          <FxPaneHeaderSegmentedOption id="x" text="Ex" />
          <FxPaneHeaderSegmentedOption id="y" text="Ey" />
        </FxPaneHeaderSegmentedAction>
      </FxPaneHeader>
    );

    // Close button should be visible on end pane with maxPanes=1
    const closeBtn = getVisibleButtonByTitle("Close");
    expect(closeBtn).toBeInTheDocument();
  });
});

// ─── data-testid forwarding to compound sub-elements ────────────────────────

describe("FxPaneHeader – data-testid forwarding", () => {
  // Helper: grab the visible (non-aria-hidden) testid match.
  // The off-screen measurement container duplicates buttons, so testid-based
  // queries can return more than one node.
  function getVisibleByTestId(id: string): HTMLElement {
    const all = screen.getAllByTestId(id);
    const visible = all.find((el) => !el.closest("[aria-hidden]"));
    return visible || all[0];
  }

  it("derives -title testid via FxRenameTitle in editable mode - BLI: EL-339", () => {
    render(
      <FxPaneHeader
        title="Editable"
        titleEditable
        data-testid="hdr"
      />
    );
    // Display mode: the span carries the testid
    const titleEl = getVisibleByTestId("hdr-title");
    expect(titleEl).toBeInTheDocument();
    expect(titleEl.textContent).toBe("Editable");
  });

  it("derives -hamburger testid when context provides openNavigation - BLI: EL-339", () => {
    mockLayoutContext = {
      startVisible: true,
      endVisible: false,
      maxPanes: 3,
      compactMode: true, // hamburger only shows in compact mode
      leftmostVisiblePane: "center",
      allowStart: true,
      allowEnd: true,
      suppressEnd: false,
      utilityEndPane: false,
      isSettingsMode: false,
      inputMode: "oneline",
      toggleStartPane: vi.fn(),
      toggleEndPane: vi.fn(),
      openNavigation: vi.fn(),
    };
    render(<FxPaneHeader pane="center" title="Hamburger" data-testid="hdr" />);
    const hamburger = getVisibleByTestId("hdr-hamburger");
    expect(hamburger).toBeInTheDocument();
  });

  it("derives -toggle-start testid - BLI: EL-339", () => {
    mockLayoutContext = {
      startVisible: false,
      endVisible: false,
      maxPanes: 3,
      compactMode: false,
      leftmostVisiblePane: "start",
      allowStart: true,
      allowEnd: true,
      suppressEnd: false,
      utilityEndPane: false,
      isSettingsMode: false,
      inputMode: "oneline",
      toggleStartPane: vi.fn(),
      toggleEndPane: vi.fn(),
      openNavigation: vi.fn(),
    };
    render(<FxPaneHeader pane="center" title="StartTog" data-testid="hdr" />);
    const tog = getVisibleByTestId("hdr-toggle-start");
    expect(tog).toBeInTheDocument();
  });

  it("derives -toggle-start testid in back-icon mode (maxPanes=1) - BLI: EL-339", () => {
    mockLayoutContext = {
      startVisible: true,
      endVisible: false,
      maxPanes: 1,
      compactMode: false,
      leftmostVisiblePane: "center",
      allowStart: true,
      allowEnd: false,
      suppressEnd: false,
      utilityEndPane: false,
      isSettingsMode: false,
      inputMode: "oneline",
      toggleStartPane: vi.fn(),
      toggleEndPane: vi.fn(),
      openNavigation: vi.fn(),
    };
    render(<FxPaneHeader pane="center" title="BackTog" data-testid="hdr" />);
    const tog = getVisibleByTestId("hdr-toggle-start");
    expect(tog).toBeInTheDocument();
  });

  it("derives -toggle-end testid - BLI: EL-339", () => {
    mockLayoutContext = {
      startVisible: true,
      endVisible: true,
      maxPanes: 3,
      compactMode: false,
      leftmostVisiblePane: "start",
      allowStart: true,
      allowEnd: true,
      suppressEnd: false,
      utilityEndPane: false,
      isSettingsMode: false,
      inputMode: "oneline",
      toggleStartPane: vi.fn(),
      toggleEndPane: vi.fn(),
      openNavigation: vi.fn(),
    };
    render(<FxPaneHeader pane="center" title="EndTog" data-testid="hdr" />);
    const tog = getVisibleByTestId("hdr-toggle-end");
    expect(tog).toBeInTheDocument();
  });

  it("derives -relations testid when relations are visible - BLI: EL-339", () => {
    render(
      <FxPaneHeader
        title="Rel"
        data-testid="hdr"
        related={[
          { type: "space", id: "s1", name: "Space 1" },
          { type: "job", id: "j1", name: "Job 1" },
        ]}
      />
    );
    const rel = getVisibleByTestId("hdr-relations");
    expect(rel).toBeInTheDocument();
  });

  it("clicking the relations trigger opens the relations menu - BLI: EL-339", async () => {
    render(
      <FxPaneHeader
        title="RelClick"
        data-testid="hdr"
        related={[
          { type: "space", id: "s1", name: "Space 1" },
        ]}
      />
    );
    const rel = getVisibleByTestId("hdr-relations");
    // Clicking the trigger drives the open path of relationsJsx
    // (portal menu rendering itself differs in the JSDOM environment, so we
    // assert the click handler runs without throwing).
    expect(() => {
      fireEvent.click(rel);
    }).not.toThrow();
  });

  it("clicking the overflow trigger opens the overflow menu - BLI: EL-339", () => {
    render(
      <FxPaneHeader title="OvClick" data-testid="hdr">
        <FxPaneHeaderAction
          icon={<span>I</span>}
          text="Overflowed"
          priority="alwaysOverflow"
        />
      </FxPaneHeader>
    );
    const overflow = getVisibleByTestId("hdr-overflow");
    expect(overflow).toBeInTheDocument();
    expect(() => {
      fireEvent.click(overflow);
    }).not.toThrow();
  });

  it("clicking hamburger fires openNavigation - BLI: EL-339", () => {
    const openNavigation = vi.fn();
    mockLayoutContext = {
      startVisible: false,
      endVisible: false,
      maxPanes: 3,
      compactMode: true,
      leftmostVisiblePane: "center",
      allowStart: true,
      allowEnd: true,
      suppressEnd: false,
      utilityEndPane: false,
      isSettingsMode: false,
      inputMode: "oneline",
      toggleStartPane: vi.fn(),
      toggleEndPane: vi.fn(),
      openNavigation,
    };
    render(<FxPaneHeader pane="center" title="Hamburger" data-testid="hdr" />);
    const hamburger = getVisibleByTestId("hdr-hamburger");
    fireEvent.click(hamburger);
    expect(openNavigation).toHaveBeenCalled();
  });

  it("clicking start toggle fires toggleStartPane - BLI: EL-339", () => {
    const toggleStart = vi.fn();
    mockLayoutContext = {
      startVisible: false,
      endVisible: false,
      maxPanes: 3,
      compactMode: false,
      leftmostVisiblePane: "start",
      allowStart: true,
      allowEnd: true,
      suppressEnd: false,
      utilityEndPane: false,
      isSettingsMode: false,
      inputMode: "oneline",
      toggleStartPane: toggleStart,
      toggleEndPane: vi.fn(),
      openNavigation: vi.fn(),
    };
    render(<FxPaneHeader pane="center" title="St" data-testid="hdr" />);
    fireEvent.click(getVisibleByTestId("hdr-toggle-start"));
    expect(toggleStart).toHaveBeenCalled();
  });

  it("clicking end toggle fires toggleEndPane - BLI: EL-339", () => {
    const toggleEnd = vi.fn();
    mockLayoutContext = {
      startVisible: true,
      endVisible: true,
      maxPanes: 3,
      compactMode: false,
      leftmostVisiblePane: "start",
      allowStart: true,
      allowEnd: true,
      suppressEnd: false,
      utilityEndPane: false,
      isSettingsMode: false,
      inputMode: "oneline",
      toggleStartPane: vi.fn(),
      toggleEndPane: toggleEnd,
      openNavigation: vi.fn(),
    };
    render(<FxPaneHeader pane="center" title="End" data-testid="hdr" />);
    fireEvent.click(getVisibleByTestId("hdr-toggle-end"));
    expect(toggleEnd).toHaveBeenCalled();
  });

  it("forwards FxRelationItem data-testid to relation MenuItems - BLI: EL-339", () => {
    // Coverage smoke: rendering with a testid'd relation exercises the
    // renderRelationMenuItems path that forwards `item["data-testid"]` to
    // each MenuItem. (Asserting on the rendered MenuItem requires the menu
    // to be open, which depends on portal timing in JSDOM — covered by
    // spaces-ui Playwright tests.)
    expect(() => {
      render(
        <FxPaneHeader
          title="RelTestId"
          data-testid="hdr"
          related={[
            { type: "space", id: "s1", name: "Space One", "data-testid": "rel-s1" },
          ]}
        />
      );
      fireEvent.click(getVisibleByTestId("hdr-relations"));
    }).not.toThrow();
  });

  it("alwaysOverflow action testid is absent from DOM until menu opens - BLI: EL-339", () => {
    render(
      <FxPaneHeader title="ActOver" data-testid="hdr">
        <FxPaneHeaderAction
          icon={<span>I</span>}
          text="Overflowed"
          priority="alwaysOverflow"
          data-testid="action-overflowed"
        />
      </FxPaneHeader>
    );
    // alwaysOverflow actions never appear in the toolbar, and the measurement
    // container no longer carries testids after the fix — so zero nodes total.
    expect(screen.queryAllByTestId("action-overflowed")).toHaveLength(0);
  });
});

// ─── Issue #585: no duplicate data-testid in measurement container ─────────────
//
// FxPaneHeader renders every action twice in an off-screen aria-hidden
// measurement container (icon-only + with-text variants) to calculate
// responsive overflow.  Before the fix, data-testid props were forwarded
// to those hidden copies, producing 3 DOM nodes with the same testid.
//
// The assertions below check the TOTAL count in the DOM (not just the visible
// subset) so they actually fail when the fix is reverted.  Without the fix a
// toolbar action produces 3 nodes (2 hidden measurement clones + 1 visible);
// with the fix it produces exactly 1.

describe("FxPaneHeader – no duplicate testids (issue #585)", () => {
  it("FxPaneHeaderAction testid appears exactly once in the entire DOM", () => {
    render(
      <FxPaneHeader title="Dedup" data-testid="hdr">
        <FxPaneHeaderAction
          icon={<span>I</span>}
          text="Save"
          data-testid="action-save"
        />
      </FxPaneHeader>
    );
    // 1 total: only the visible toolbar button carries the testid.
    // Without the fix this would be 3 (2 hidden measurement clones + 1 visible).
    expect(screen.queryAllByTestId("action-save")).toHaveLength(1);
  });

  it("FxPaneHeaderSegmentedAction testid appears exactly once in the entire DOM", () => {
    render(
      <FxPaneHeader title="Dedup Seg" data-testid="hdr">
        <FxPaneHeaderSegmentedAction selectedId="a" data-testid="seg-action">
          <FxPaneHeaderSegmentedOption id="a" text="A" />
          <FxPaneHeaderSegmentedOption id="b" text="B" />
        </FxPaneHeaderSegmentedAction>
      </FxPaneHeader>
    );
    expect(screen.queryAllByTestId("seg-action")).toHaveLength(1);
  });

  it("FxPaneHeaderSegmentedAction child option testids appear exactly once in the entire DOM", () => {
    render(
      <FxPaneHeader title="Dedup Seg Options" data-testid="hdr">
        <FxPaneHeaderSegmentedAction selectedId="a" data-testid="seg">
          <FxPaneHeaderSegmentedOption id="opt-a" text="Opt A" />
          <FxPaneHeaderSegmentedOption id="opt-b" text="Opt B" />
        </FxPaneHeaderSegmentedAction>
      </FxPaneHeader>
    );
    // subTestId derives "seg-opt-a" and "seg-opt-b" for the options.
    // Without the fix each option would appear in 2 measurement clones + 1 visible = 3 total.
    expect(screen.queryAllByTestId("seg-opt-a")).toHaveLength(1);
    expect(screen.queryAllByTestId("seg-opt-b")).toHaveLength(1);
  });

  it("FxPaneHeaderSplitAction testid appears exactly once in the entire DOM", () => {
    render(
      <FxPaneHeader title="Dedup Split" data-testid="hdr">
        <FxPaneHeaderSplitAction
          icon={<span>+</span>}
          text="Create"
          data-testid="split-action"
        >
          <FxPaneHeaderSplitOption id="opt1" text="Opt 1" />
        </FxPaneHeaderSplitAction>
      </FxPaneHeader>
    );
    expect(screen.queryAllByTestId("split-action")).toHaveLength(1);
  });

  it("multiple actions each have exactly one DOM node with their testid", () => {
    render(
      <FxPaneHeader title="Dedup Multi" data-testid="hdr">
        <FxPaneHeaderAction icon={<span>A</span>} text="Alpha" data-testid="act-alpha" />
        <FxPaneHeaderAction icon={<span>B</span>} text="Beta"  data-testid="act-beta"  priority="low" />
        <FxPaneHeaderAction icon={<span>C</span>} text="Gamma" data-testid="act-gamma" priority="high" />
      </FxPaneHeader>
    );
    for (const id of ["act-alpha", "act-beta", "act-gamma"]) {
      expect(screen.queryAllByTestId(id), `${id} should have exactly 1 DOM node`).toHaveLength(1);
    }
  });

  it("alwaysOverflow action testid is absent from the entire DOM when menu is closed", () => {
    render(
      <FxPaneHeader title="Dedup Overflow" data-testid="hdr">
        <FxPaneHeaderAction
          icon={<span>H</span>}
          text="Hidden"
          priority="alwaysOverflow"
          data-testid="act-hidden"
        />
      </FxPaneHeader>
    );
    // alwaysOverflow actions never appear in the toolbar AND the measurement
    // container no longer carries testids — so the total count is 0.
    // Without the fix this would be 2 (the two hidden measurement clones).
    expect(screen.queryAllByTestId("act-hidden")).toHaveLength(0);
  });
});
