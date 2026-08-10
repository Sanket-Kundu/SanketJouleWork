import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { TableContext, useTableContext, type TableContextValue, type ColumnMeta } from "./TableContext";

// ── Helper: renders a component that reads context and exposes values ────────

function ContextReader({ onContext }: { onContext: (ctx: TableContextValue) => void }) {
  const ctx = useTableContext();
  onContext(ctx);
  return <div data-testid="reader" />;
}

// ── Default context (no provider) ────────────────────────────────────────────

describe("TableContext – defaults", () => {
  it("useTableContext returns default values when used outside a provider - BLI: EL-339", () => {
    let ctx!: TableContextValue;
    render(<ContextReader onContext={(c) => { ctx = c; }} />);

    expect(ctx.tableId).toBe("");
    expect(ctx.columnCount).toBe(0);
    expect(ctx.columnsMeta).toEqual([]);
    expect(ctx.gridTemplateColumns).toBe("");
  });

  it("default selection fields are inert - BLI: EL-339", () => {
    let ctx!: TableContextValue;
    render(<ContextReader onContext={(c) => { ctx = c; }} />);

    expect(ctx.selectionMode).toBe("None");
    expect(ctx.selectionBehavior).toBe("RowSelector");
    expect(ctx.headerSelector).toBe("SelectAll");
    expect(ctx.isSelected("any")).toBe(false);
    expect(ctx.areAllSelected()).toBe(false);
    expect(ctx.getLastSelectedKey()).toBeNull();
    expect(ctx.selectedKeys.size).toBe(0);

    // Should not throw
    ctx.toggleSelection("k");
    ctx.selectRange("a", "b");
    ctx.applyKeyboardRange("a", "b");
    ctx.clearRangeSession();
    ctx.clearRangeSession({ clearAnchor: true });
    ctx.selectAll();
    ctx.deselectAll();
  });

  it("default navigation fields - BLI: EL-339", () => {
    let ctx!: TableContextValue;
    render(<ContextReader onContext={(c) => { ctx = c; }} />);

    expect(ctx.focusedRowIndex).toBe(-1);
    expect(ctx.focusedCellIndex).toBeNull();
    expect(ctx.focusedCell).toBeNull();
    expect(ctx.navigationMode).toBe("Row");

    // Should not throw
    ctx.setFocusedRow(0);
    ctx.setFocusedCell(0, 1);
  });

  it("default feature flags - BLI: EL-339", () => {
    let ctx!: TableContextValue;
    render(<ContextReader onContext={(c) => { ctx = c; }} />);

    expect(ctx.rowActionCount).toBe(0);
    expect(ctx.hasSelectionColumn).toBe(false);
    expect(ctx.hasActionsColumn).toBe(false);
    expect(ctx.overflowMode).toBe("Scroll");
    expect(ctx.dataRowCount).toBe(0);
  });

  it("default row tracking returns empty/fallback - BLI: EL-339", () => {
    let ctx!: TableContextValue;
    render(<ContextReader onContext={(c) => { ctx = c; }} />);

    expect(ctx.rowKeys).toEqual([]);
    expect(ctx.getRowIndexByKey("missing")).toBe(-1);
  });

  it("default popin fields - BLI: EL-339", () => {
    let ctx!: TableContextValue;
    render(<ContextReader onContext={(c) => { ctx = c; }} />);

    expect(ctx.visibleColumnIndices).toEqual([]);
    expect(ctx.popinColumnIndices).toEqual([]);
    expect(ctx.isPopinActive).toBe(false);
    expect(ctx.popinColumnIndex).toBe(0);
  });

  it("default mouse navigation and event handlers - BLI: EL-339", () => {
    let ctx!: TableContextValue;
    render(<ContextReader onContext={(c) => { ctx = c; }} />);

    // Should not throw
    ctx.setMouseNavigating();
    ctx.navigateToRow(0);

    expect(ctx.onRowClick).toBeUndefined();
    expect(ctx.onRowActionClick).toBeUndefined();
  });
});

// ── Provider overrides ───────────────────────────────────────────────────────

describe("TableContext – provider", () => {
  it("provides custom values to children - BLI: EL-339", () => {
    const mockToggle = vi.fn();
    const mockIsSelected = vi.fn().mockReturnValue(true);

    const value: TableContextValue = {
      tableId: "test-table",
      columnCount: 3,
      columnsMeta: [
        { importance: 0 },
        { importance: 1, width: "200px" },
        { importance: 2, popinText: "Details", horizontalAlign: "Center" },
      ] as ColumnMeta[],
      gridTemplateColumns: "1fr 200px 1fr",
      selectionMode: "Multi",
      selectionBehavior: "Row",
      headerSelector: "SelectAll",
      isSelected: mockIsSelected,
      toggleSelection: mockToggle,
      selectRange: vi.fn(),
      applyKeyboardRange: vi.fn(),
      clearRangeSession: vi.fn(),
      selectedKeys: new Set(["r1", "r3"]),
      areAllSelected: () => false,
      selectAll: vi.fn(),
      deselectAll: vi.fn(),
      getLastSelectedKey: () => "r3",
      focusedRowIndex: 1,
      focusedCellIndex: 2,
      focusedCell: { rowIndex: 1, columnIndex: 2 },
      navigationMode: "Cell",
      setFocusedRow: vi.fn(),
      setFocusedCell: vi.fn(),
      rowActionCount: 2,
      hasSelectionColumn: true,
      hasActionsColumn: true,
      overflowMode: "Popin",
      rowKeys: ["r1", "r2", "r3"],
      getRowIndexByKey: (key) => ["r1", "r2", "r3"].indexOf(key),
      visibleColumnIndices: [0, 1],
      popinColumnIndices: [2],
      isPopinActive: true,
      popinColumnIndex: 2,
      setMouseNavigating: vi.fn(),
      navigateToRow: vi.fn(),
      onRowClick: vi.fn(),
      onRowActionClick: vi.fn(),
      dataRowCount: 3,
      alternateRowColors: false,
      hasNavigatedColumn: false,
      hasGrowingButton: false,
      hasToolbar: false,
    };

    let ctx!: TableContextValue;
    render(
      <TableContext.Provider value={value}>
        <ContextReader onContext={(c) => { ctx = c; }} />
      </TableContext.Provider>,
    );

    expect(ctx.tableId).toBe("test-table");
    expect(ctx.columnCount).toBe(3);
    expect(ctx.gridTemplateColumns).toBe("1fr 200px 1fr");
    expect(ctx.selectionMode).toBe("Multi");
    expect(ctx.navigationMode).toBe("Cell");
    expect(ctx.focusedRowIndex).toBe(1);
    expect(ctx.focusedCellIndex).toBe(2);
    expect(ctx.focusedCell).toEqual({ rowIndex: 1, columnIndex: 2 });
    expect(ctx.hasSelectionColumn).toBe(true);
    expect(ctx.hasActionsColumn).toBe(true);
    expect(ctx.overflowMode).toBe("Popin");
    expect(ctx.dataRowCount).toBe(3);
    expect(ctx.rowActionCount).toBe(2);
    expect(ctx.isPopinActive).toBe(true);
    expect(ctx.popinColumnIndex).toBe(2);
    expect(ctx.visibleColumnIndices).toEqual([0, 1]);
    expect(ctx.popinColumnIndices).toEqual([2]);
  });

  it("selection functions are callable through provider - BLI: EL-339", () => {
    const toggleSelection = vi.fn();
    const selectRange = vi.fn();
    const applyKeyboardRange = vi.fn();
    const clearRangeSession = vi.fn();
    const selectAll = vi.fn();
    const deselectAll = vi.fn();
    const isSelected = vi.fn().mockReturnValue(true);

    const value = makeContext({
      toggleSelection,
      selectRange,
      applyKeyboardRange,
      clearRangeSession,
      selectAll,
      deselectAll,
      isSelected,
      selectedKeys: new Set(["r1"]),
    });

    let ctx!: TableContextValue;
    render(
      <TableContext.Provider value={value}>
        <ContextReader onContext={(c) => { ctx = c; }} />
      </TableContext.Provider>,
    );

    ctx.toggleSelection("r2");
    expect(toggleSelection).toHaveBeenCalledWith("r2");

    ctx.selectRange("r1", "r3");
    expect(selectRange).toHaveBeenCalledWith("r1", "r3");

    ctx.applyKeyboardRange("r1", "r4");
    expect(applyKeyboardRange).toHaveBeenCalledWith("r1", "r4");

    ctx.clearRangeSession({ clearAnchor: true });
    expect(clearRangeSession).toHaveBeenCalledWith({ clearAnchor: true });

    ctx.selectAll();
    expect(selectAll).toHaveBeenCalled();

    ctx.deselectAll();
    expect(deselectAll).toHaveBeenCalled();

    expect(ctx.isSelected("r1")).toBe(true);
    expect(isSelected).toHaveBeenCalledWith("r1");

    expect(ctx.selectedKeys.has("r1")).toBe(true);
  });

  it("navigation functions are callable through provider - BLI: EL-339", () => {
    const setFocusedRow = vi.fn();
    const setFocusedCell = vi.fn();
    const setMouseNavigating = vi.fn();
    const navigateToRow = vi.fn();

    const value = makeContext({
      setFocusedRow,
      setFocusedCell,
      setMouseNavigating,
      navigateToRow,
    });

    let ctx!: TableContextValue;
    render(
      <TableContext.Provider value={value}>
        <ContextReader onContext={(c) => { ctx = c; }} />
      </TableContext.Provider>,
    );

    ctx.setFocusedRow(5);
    expect(setFocusedRow).toHaveBeenCalledWith(5);

    ctx.setFocusedCell(2, 3);
    expect(setFocusedCell).toHaveBeenCalledWith(2, 3);

    ctx.setMouseNavigating();
    expect(setMouseNavigating).toHaveBeenCalled();

    ctx.navigateToRow(7);
    expect(navigateToRow).toHaveBeenCalledWith(7);
  });

  it("event callbacks are callable through provider - BLI: EL-339", () => {
    const onRowClick = vi.fn();
    const onRowActionClick = vi.fn();

    const value = makeContext({ onRowClick, onRowActionClick });

    let ctx!: TableContextValue;
    render(
      <TableContext.Provider value={value}>
        <ContextReader onContext={(c) => { ctx = c; }} />
      </TableContext.Provider>,
    );

    const mockRow = document.createElement("tr");
    ctx.onRowClick!({ row: mockRow, rowKey: "r1" });
    expect(onRowClick).toHaveBeenCalledWith({ row: mockRow, rowKey: "r1" });

    ctx.onRowActionClick!({ rowKey: "r2" });
    expect(onRowActionClick).toHaveBeenCalledWith({ rowKey: "r2" });
  });

  it("row tracking via getRowIndexByKey - BLI: EL-339", () => {
    const rowKeys = ["alpha", "beta", "gamma"];
    const value = makeContext({
      rowKeys,
      getRowIndexByKey: (key: string) => rowKeys.indexOf(key),
    });

    let ctx!: TableContextValue;
    render(
      <TableContext.Provider value={value}>
        <ContextReader onContext={(c) => { ctx = c; }} />
      </TableContext.Provider>,
    );

    expect(ctx.getRowIndexByKey("alpha")).toBe(0);
    expect(ctx.getRowIndexByKey("gamma")).toBe(2);
    expect(ctx.getRowIndexByKey("missing")).toBe(-1);
    expect(ctx.rowKeys).toEqual(["alpha", "beta", "gamma"]);
  });

  it("columnsMeta is accessible through provider - BLI: EL-339", () => {
    const columnsMeta: ColumnMeta[] = [
      { importance: 0, width: "100px", minWidth: "50px", horizontalAlign: "Start" },
      { importance: 1, popinText: "Name", popinHidden: true, sortIndicator: "Ascending" },
      { importance: 2 },
    ];

    const value = makeContext({ columnsMeta, columnCount: 3 });

    let ctx!: TableContextValue;
    render(
      <TableContext.Provider value={value}>
        <ContextReader onContext={(c) => { ctx = c; }} />
      </TableContext.Provider>,
    );

    expect(ctx.columnsMeta).toHaveLength(3);
    expect(ctx.columnsMeta[0].width).toBe("100px");
    expect(ctx.columnsMeta[0].minWidth).toBe("50px");
    expect(ctx.columnsMeta[0].horizontalAlign).toBe("Start");
    expect(ctx.columnsMeta[1].popinText).toBe("Name");
    expect(ctx.columnsMeta[1].popinHidden).toBe(true);
    expect(ctx.columnsMeta[1].sortIndicator).toBe("Ascending");
    expect(ctx.columnsMeta[2].importance).toBe(2);
  });

  it("areAllSelected and getLastSelectedKey through provider - BLI: EL-339", () => {
    const value = makeContext({
      areAllSelected: () => true,
      getLastSelectedKey: () => "r5",
    });

    let ctx!: TableContextValue;
    render(
      <TableContext.Provider value={value}>
        <ContextReader onContext={(c) => { ctx = c; }} />
      </TableContext.Provider>,
    );

    expect(ctx.areAllSelected()).toBe(true);
    expect(ctx.getLastSelectedKey()).toBe("r5");
  });
});

// ── Context displayName ──────────────────────────────────────────────────────

describe("TableContext – metadata", () => {
  it("has correct displayName - BLI: EL-339", () => {
    expect(TableContext.displayName).toBe("TableContext");
  });
});

// ── Nested providers ─────────────────────────────────────────────────────────

describe("TableContext – nesting", () => {
  it("inner provider overrides outer provider - BLI: EL-339", () => {
    const outer = makeContext({ tableId: "outer", selectionMode: "Multi" });
    const inner = makeContext({ tableId: "inner", selectionMode: "Single" });

    let ctx!: TableContextValue;
    render(
      <TableContext.Provider value={outer}>
        <TableContext.Provider value={inner}>
          <ContextReader onContext={(c) => { ctx = c; }} />
        </TableContext.Provider>
      </TableContext.Provider>,
    );

    expect(ctx.tableId).toBe("inner");
    expect(ctx.selectionMode).toBe("Single");
  });
});

// ── Helper to build partial context ──────────────────────────────────────────

function makeContext(overrides: Partial<TableContextValue> = {}): TableContextValue {
  return {
    tableId: "",
    columnCount: 0,
    columnsMeta: [],
    gridTemplateColumns: "",
    selectionMode: "None",
    selectionBehavior: "RowSelector",
    headerSelector: "SelectAll",
    isSelected: () => false,
    toggleSelection: () => {},
    selectRange: () => {},
    applyKeyboardRange: () => {},
    clearRangeSession: () => {},
    selectedKeys: new Set(),
    areAllSelected: () => false,
    selectAll: () => {},
    deselectAll: () => {},
    getLastSelectedKey: () => null,
    focusedRowIndex: -1,
    focusedCellIndex: null,
    focusedCell: null,
    navigationMode: "Row",
    setFocusedRow: () => {},
    setFocusedCell: () => {},
    rowActionCount: 0,
    hasSelectionColumn: false,
    hasActionsColumn: false,
    overflowMode: "Scroll",
    rowKeys: [],
    getRowIndexByKey: () => -1,
    visibleColumnIndices: [],
    popinColumnIndices: [],
    isPopinActive: false,
    popinColumnIndex: 0,
    setMouseNavigating: () => {},
    navigateToRow: () => {},
    onRowClick: undefined,
    onRowActionClick: undefined,
    dataRowCount: 0,
    alternateRowColors: false,
    hasNavigatedColumn: false,
    hasGrowingButton: false,
    hasToolbar: false,
    ...overrides,
  };
}
