import React from "react";
import type { ColumnMeta } from "./TableContext";

// ─── Role markers for child scanning ────────────────────────────────────────

export type TableChildRole =
  | "Toolbar"
  | "HeaderRow"
  | "Row"
  | "Cell"
  | "HeaderCell"
  | "SelectionMulti"
  | "SelectionSingle"
  | "Growing"
  | "RowAction"
  | "RowActionNavigation"
  | "NoData";

export interface TableRoleComponent {
  _tableRole: TableChildRole;
}

// ─── Child scanning ─────────────────────────────────────────────────────────

export interface ScannedChildren {
  toolbar: React.ReactElement | null;
  headerRow: React.ReactElement | null;
  dataRows: React.ReactElement[];
  selectionFeature: React.ReactElement | null;
  growingFeature: React.ReactElement | null;
}

export function scanTableChildren(children: React.ReactNode): ScannedChildren {
  let toolbar: React.ReactElement | null = null;
  let headerRow: React.ReactElement | null = null;
  const dataRows: React.ReactElement[] = [];
  let selectionFeature: React.ReactElement | null = null;
  let growingFeature: React.ReactElement | null = null;

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;
    const role = (child.type as unknown as TableRoleComponent)?._tableRole;
    switch (role) {
      case "Toolbar":
        toolbar = child;
        break;
      case "HeaderRow":
        headerRow = child;
        break;
      case "Row":
        dataRows.push(child);
        break;
      case "SelectionMulti":
      case "SelectionSingle":
        selectionFeature = child;
        break;
      case "Growing":
        growingFeature = child;
        break;
      default:
        break;
    }
  });

  return { toolbar, headerRow, dataRows, selectionFeature, growingFeature };
}

// ─── Extract column metadata from header row children ───────────────────────

/** Recursively extract plain text from React children */
function extractTextContent(node: React.ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractTextContent).join("");
  if (React.isValidElement(node)) {
    return extractTextContent((node.props as Record<string, unknown>).children as React.ReactNode);
  }
  return "";
}

export function extractColumnsMeta(headerRow: React.ReactElement | null): ColumnMeta[] {
  if (!headerRow) return [];
  const metas: ColumnMeta[] = [];

  React.Children.forEach((headerRow.props as { children?: React.ReactNode }).children, (child) => {
    if (!React.isValidElement(child)) return;
    const role = (child.type as unknown as TableRoleComponent)?._tableRole;
    if (role === "HeaderCell") {
      const p = child.props as Record<string, unknown>;
      const headerText = extractTextContent(p.children as React.ReactNode).trim() || undefined;
      metas.push({
        width: p.width as string | undefined,
        minWidth: p.minWidth as string | undefined,
        importance: (p.importance as number) ?? 0,
        popinText: p.popinText as string | undefined,
        headerText,
        popinHidden: p.popinHidden as boolean | undefined,
        horizontalAlign: p.horizontalAlign as ColumnMeta["horizontalAlign"],
        sortIndicator: p.sortIndicator as ColumnMeta["sortIndicator"],
      });
    }
  });

  return metas;
}

// ─── Extract row keys and actions from row children ─────────────────────────

export function extractRowKeys(dataRows: React.ReactElement[]): string[] {
  return dataRows.map((row) => {
    const p = row.props as Record<string, unknown>;
    return (p.rowKey as string) ?? "";
  });
}

export function scanRowChildren(children: React.ReactNode): {
  cells: React.ReactElement[];
  actions: React.ReactElement[];
  navigationAction: React.ReactElement | null;
} {
  const cells: React.ReactElement[] = [];
  const actions: React.ReactElement[] = [];
  let navigationAction: React.ReactElement | null = null;

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;
    const role = (child.type as unknown as TableRoleComponent)?._tableRole;
    switch (role) {
      case "Cell":
        cells.push(child);
        break;
      case "RowAction":
        actions.push(child);
        break;
      case "RowActionNavigation":
        navigationAction = child;
        break;
      default:
        cells.push(child);
        break;
    }
  });

  return { cells, actions, navigationAction };
}

// ─── DOM helpers ──────────────────────────────────────────────────────────────

/** Walk up the DOM to find the nearest ancestor with vertical scroll. */
export function findVerticalScrollContainer(element: HTMLElement): HTMLElement | null {
  let current = element.parentElement;
  while (current) {
    const { overflowY } = getComputedStyle(current);
    if (overflowY === "auto" || overflowY === "scroll") {
      return current;
    }
    current = current.parentElement;
  }
  return null;
}

// ─── Alignment helpers ──────────────────────────────────────────────────────

export function getAlignmentClass(align?: string): string {
  switch (align) {
    case "Left":
    case "Start":
      return "text-start justify-start";
    case "Right":
    case "End":
      return "text-end justify-end";
    case "Center":
      return "text-center justify-center";
    default:
      return "";
  }
}

// ─── Grid template columns builder ──────────────────────────────────────────

export function buildGridTemplateColumns(
  columnsMeta: ColumnMeta[],
  visibleIndices: number[],
  hasSelectionColumn: boolean,
  hasActionsColumn: boolean,
  hasNavigatedColumn: boolean,
): string {
  const parts: string[] = [];

  if (hasSelectionColumn) {
    parts.push("40px");
  }

  const isOnlyColumn = visibleIndices.length === 1;

  visibleIndices.forEach((idx) => {
    const col = columnsMeta[idx];
    if (isOnlyColumn) {
      // Single remaining column must fill available space
      const min = col?.width || col?.minWidth || "150px";
      parts.push(`minmax(${min}, 1fr)`);
    } else if (col?.width) {
      parts.push(col.width);
    } else if (col?.minWidth) {
      parts.push(`minmax(${col.minWidth}, 1fr)`);
    } else {
      parts.push("minmax(150px, 1fr)");
    }
  });

  if (hasActionsColumn) {
    parts.push("auto");
  }

  if (hasNavigatedColumn) {
    parts.push("4px");
  }

  return parts.join(" ");
}
