import type { ReactNode } from "react";
import type { ToolbarProps } from "./toolbar";

// ─── Enums ───────────────────────────────────────────────────────────────────

export enum TableOverflowMode {
  Scroll = "Scroll",
  Popin = "Popin",
}

export enum TableGrowingMode {
  Button = "Button",
  Scroll = "Scroll",
}

export enum TableCellHorizontalAlign {
  Left = "Left",
  Start = "Start",
  Right = "Right",
  End = "End",
  Center = "Center",
}

export enum TableSelectionBehavior {
  RowSelector = "RowSelector",
  RowOnly = "RowOnly",
}

export enum TableSelectionMultiHeaderSelector {
  SelectAll = "SelectAll",
  ClearAll = "ClearAll",
}

export enum TableSortOrder {
  None = "None",
  Ascending = "Ascending",
  Descending = "Descending",
}

// ─── Event Detail Types ──────────────────────────────────────────────────────

export interface TableRowClickEventDetail {
  row: HTMLElement;
  rowKey: string;
}

export interface TableSelectionChangeEventDetail {
  selectedKeys: Set<string>;
  previousSelectedKeys: Set<string>;
}

export interface TableGrowingLoadMoreEventDetail {}

export interface TableRowActionClickEventDetail {
  rowKey: string;
}

export interface TableMoveOverEventDetail {
  source: { rowKey: string };
  destination: { rowKey: string; placement: "Before" | "On" | "After" };
}

export interface TableMoveEventDetail {
  source: { rowKey: string };
  destination: { rowKey: string; placement: "Before" | "On" | "After" };
}

export interface TableHeaderCellActionAIClickEventDetail {
  targetRef: Element;
}

// ─── Ref Types ───────────────────────────────────────────────────────────────

export interface TableRef {
  readonly tableElement: HTMLDivElement | null;
  readonly scrollContainer: HTMLDivElement | null;
  focus: () => void;
}

export interface TableSelectionMultiRef {
  getSelectedRows: () => HTMLElement[];
  areAllRowsSelected: () => boolean;
  getSelectedAsSet: () => Set<string>;
  setSelectedAsSet: (set: Set<string>) => void;
  isSelected: (rowKey: string) => boolean;
  setSelected: (rowKey: string, selected: boolean) => void;
}

export interface TableSelectionSingleRef {
  getSelectedRow: () => HTMLElement | undefined;
  isSelected: (rowKey: string) => boolean;
  setSelected: (rowKey: string, selected: boolean) => void;
}

// ─── Component Props ─────────────────────────────────────────────────────────

export interface TableProps {
  children?: ReactNode;
  accessibleName?: string;
  accessibleNameRef?: string;
  noDataText?: string;
  noData?: ReactNode;
  overflowMode?: TableOverflowMode | `${TableOverflowMode}`;
  scrollHeight?: string;
  loading?: boolean;
  loadingDelay?: number;
  rowActionCount?: number;
  alternateRowColors?: boolean;
  stickyTop?: string;
  onRowClick?: (detail: TableRowClickEventDetail) => void;
  onMoveOver?: (detail: TableMoveOverEventDetail) => boolean;
  onMove?: (detail: TableMoveEventDetail) => void;
  onRowActionClick?: (detail: TableRowActionClickEventDetail) => void;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  "data-testid"?: string;
}

export interface TableHeaderRowProps {
  children?: ReactNode;
  sticky?: boolean;
  className?: string;
  style?: React.CSSProperties;
  /** Forwarded to the rendered row element for test selectors. */
  "data-testid"?: string;
}

export interface TableHeaderCellProps {
  children?: ReactNode;
  width?: string;
  minWidth?: string;
  importance?: number;
  popinText?: string;
  sortIndicator?: TableSortOrder | `${TableSortOrder}`;
  popinHidden?: boolean;
  horizontalAlign?: TableCellHorizontalAlign | `${TableCellHorizontalAlign}`;
  action?: ReactNode;
  className?: string;
  /** Forwarded to the rendered cell element for test selectors. */
  "data-testid"?: string;
}

export interface TableRowProps {
  children?: ReactNode;
  rowKey: string;
  interactive?: boolean;
  navigated?: boolean;
  movable?: boolean;
  className?: string;
  /** Forwarded to the rendered row element for test selectors. */
  "data-testid"?: string;
}

export interface TableCellProps {
  children?: ReactNode;
  merged?: boolean;
  rowHeader?: boolean;
  horizontalAlign?: TableCellHorizontalAlign | `${TableCellHorizontalAlign}`;
  className?: string;
  /** Forwarded to the rendered cell element for test selectors. */
  "data-testid"?: string;
}

export interface TableSelectionMultiProps {
  selected?: string;
  defaultSelected?: string;
  behavior?: TableSelectionBehavior | `${TableSelectionBehavior}`;
  headerSelector?: TableSelectionMultiHeaderSelector | `${TableSelectionMultiHeaderSelector}`;
  onChange?: (detail: TableSelectionChangeEventDetail) => void;
  ref?: React.Ref<TableSelectionMultiRef>;
}

export interface TableSelectionSingleProps {
  selected?: string;
  defaultSelected?: string;
  behavior?: TableSelectionBehavior | `${TableSelectionBehavior}`;
  onChange?: (detail: TableSelectionChangeEventDetail) => void;
  ref?: React.Ref<TableSelectionSingleRef>;
}

export interface TableGrowingProps {
  mode?: TableGrowingMode | `${TableGrowingMode}`;
  text?: string;
  subtext?: string;
  onLoadMore?: (detail: TableGrowingLoadMoreEventDetail) => void;
}

export interface TableRowActionProps {
  icon?: ReactNode;
  text?: string;
  invisible?: boolean;
  onClick?: () => void;
}

export interface TableRowActionNavigationProps {
  invisible?: boolean;
  onClick?: () => void;
}

export interface TableHeaderCellActionAIProps {
  onClick?: (detail: TableHeaderCellActionAIClickEventDetail) => void;
}

export interface TableToolbarProps extends Omit<ToolbarProps, "design"> {
  /** When true the toolbar sticks to the top of the scrolling ancestor. */
  sticky?: boolean;
}
