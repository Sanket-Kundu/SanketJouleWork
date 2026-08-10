import { createContext, useContext } from "react";
import type { TableCellHorizontalAlign, TableSortOrder } from "../../types/table";

export interface ColumnMeta {
  width?: string;
  minWidth?: string;
  importance: number;
  popinText?: string;
  headerText?: string;
  popinHidden?: boolean;
  horizontalAlign?: TableCellHorizontalAlign | `${TableCellHorizontalAlign}`;
  sortIndicator?: TableSortOrder | `${TableSortOrder}`;
}

export interface TableContextValue {
  tableId: string;
  columnCount: number;
  columnsMeta: ColumnMeta[];
  gridTemplateColumns: string;

  // Selection
  selectionMode: "None" | "Single" | "Multi";
  selectionBehavior: string;
  headerSelector: string;
  isSelected: (rowKey: string) => boolean;
  toggleSelection: (rowKey: string) => void;
  selectRange: (anchorKey: string, endKey: string) => void;
  applyKeyboardRange: (currentKey: string, endKey: string) => void;
  clearRangeSession: (options?: { clearAnchor?: boolean }) => void;
  selectedKeys: Set<string>;
  areAllSelected: () => boolean;
  selectAll: () => void;
  deselectAll: () => void;
  getLastSelectedKey: () => string | null;

  // Navigation
  focusedRowIndex: number;
  focusedCellIndex: number | null;
  focusedCell: { rowIndex: number; columnIndex: number } | null;
  navigationMode: "Row" | "Cell";
  setFocusedRow: (index: number) => void;
  setFocusedCell: (rowIndex: number, cellIndex: number | null) => void;

  // Features
  rowActionCount: number;
  hasSelectionColumn: boolean;
  hasActionsColumn: boolean;
  overflowMode: string;

  // Row tracking
  rowKeys: string[];
  getRowIndexByKey: (rowKey: string) => number;

  // Popin
  visibleColumnIndices: number[];
  popinColumnIndices: number[];
  isPopinActive: boolean;
  popinColumnIndex: number;

  // Mouse navigation
  setMouseNavigating: () => void;
  navigateToRow: (rowIndex: number) => void;

  // Events
  onRowClick?: (detail: { row: HTMLElement; rowKey: string }) => void;
  onRowActionClick?: (detail: { rowKey: string }) => void;

  // Row count (for plugins like Growing that need to know how many data rows exist)
  dataRowCount: number;

  // Alternate row colors
  alternateRowColors: boolean;

  // Navigated indicator column
  hasNavigatedColumn: boolean;

  // Growing button presence (affects last-row rounding)
  hasGrowingButton: boolean;

  // Toolbar presence (affects header-row rounding)
  hasToolbar: boolean;
}

const defaultContext: TableContextValue = {
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
};

export const TableContext = createContext<TableContextValue>(defaultContext);
TableContext.displayName = "TableContext";

export function useTableContext(): TableContextValue {
  return useContext(TableContext);
}
