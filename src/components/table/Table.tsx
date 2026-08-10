import React, { useId, useMemo, useRef, useCallback, useState, useEffect, useImperativeHandle } from "react";
import { cn } from "../../lib/utils";
import type { TableProps, TableRef } from "../../types/table";
import { TableContext } from "./TableContext";
import type { TableContextValue } from "./TableContext";
import {
  scanTableChildren,
  extractColumnsMeta,
  extractRowKeys,
  buildGridTemplateColumns,
} from "./table-utils";
import { useTableSelection } from "./hooks/useTableSelection";
import { useTableNavigation, useTableDomNavigation } from "./hooks/useTableNavigation";
import { useTablePopin } from "./hooks/useTablePopin";
import { useTranslation } from "react-i18next";

function TableInner(
  {
    children,
    accessibleName,
    accessibleNameRef,
    noDataText,
    noData,
    overflowMode = "Popin",
    scrollHeight,
    loading = false,
    loadingDelay = 1000,
    rowActionCount = 0,
    alternateRowColors = false,
    stickyTop = "0px",
    onRowClick,
    onMoveOver: _onMoveOver,
    onMove: _onMove,
    onRowActionClick,
    className,
    style,
    id,
    "data-testid": dataTestId,
  }: TableProps,
  ref: React.ForwardedRef<TableRef>,
) {
  const generatedId = useId();
  const tableId = id ?? generatedId;

  const gridRef = useRef<HTMLDivElement>(null);
  const tableWrapperRef = useRef<HTMLDivElement>(null);
  const beforeSentinelRef = useRef<HTMLDivElement>(null);
  const afterSentinelRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const noDataRef = useRef<HTMLDivElement>(null);
  const skipLoadingRedirectRef = useRef(false);
  const skipNoDataRedirectRef = useRef(false);
  const loadingHadFocusRef = useRef(false);
  const lastFocusWasNoDataRef = useRef<boolean | null>(null);
  const prevHadGrowingRef = useRef(false);
  const prevRowCountRef = useRef(0);

  // Scan children for features and structure
  const scanned = useMemo(() => scanTableChildren(children), [children]);
  const { toolbar, headerRow, dataRows, selectionFeature, growingFeature } = scanned;

  // Extract column metadata from header cells
  const columnsMeta = useMemo(() => extractColumnsMeta(headerRow), [headerRow]);

  // Extract row keys
  const rowKeys = useMemo(() => extractRowKeys(dataRows), [dataRows]);

  // Determine feature presence
  const selectionMode = useMemo(() => {
    if (!selectionFeature) return "None" as const;
    const role = (selectionFeature.type as { _tableRole?: string })?._tableRole;
    return role === "SelectionMulti" ? "Multi" as const : "Single" as const;
  }, [selectionFeature]);

  const selectionProps = useMemo(() => {
    if (!selectionFeature) return {};
    return selectionFeature.props as Record<string, unknown>;
  }, [selectionFeature]);

  const selectionBehavior = (selectionProps.behavior as string) ?? "RowSelector";
  const headerSelector = (selectionProps.headerSelector as string) ?? "SelectAll";

  const hasSelectionColumn = selectionMode !== "None" && selectionBehavior === "RowSelector";
  const hasActionsColumn = rowActionCount > 0;

  // Detect if any row has navigated=true
  const hasNavigatedColumn = useMemo(
    () => dataRows.some((row) => (row.props as Record<string, unknown>).navigated === true),
    [dataRows],
  );

  // ─── Selection hook ─────────────────────────────────────────────────────────
  const selection = useTableSelection({
    mode: selectionMode,
    selected: selectionProps.selected as string | undefined,
    defaultSelected: selectionProps.defaultSelected as string | undefined,
    allRowKeys: rowKeys,
    onChange: selectionProps.onChange as ((detail: { selectedKeys: Set<string>; previousSelectedKeys: Set<string> }) => void) | undefined,
  });

  // ─── Selection status announcement (aria-live) ─────────────────────────────
  const { t } = useTranslation("fx");
  const [selectionAnnouncement, setSelectionAnnouncement] = useState("");
  const selectionCountRef = useRef(selection.selectedKeys.size);
  useEffect(() => {
    const count = selection.selectedKeys.size;
    if (count !== selectionCountRef.current) {
      selectionCountRef.current = count;
      if (selectionMode !== "None" && count > 0) {
        setSelectionAnnouncement(t(count === 1 ? "TABLE_SINGLE_ROW_SELECTED" : "TABLE_ROWS_SELECTED", { count }));
      } else {
        setSelectionAnnouncement("");
      }
    }
  }, [selection.selectedKeys, selectionMode, t]);

  // ─── Popin hook ─────────────────────────────────────────────────────────────
  // Reserved width accounts for all non-data-column space:
  //  - Selection column: 40px
  //  - Actions column: each action button ~32px + 4px gap between buttons + 16px cell padding (px-2 each side)
  //  - Navigated indicator: 4px
  const actionsReserved = hasActionsColumn
    ? rowActionCount * 32 + Math.max(0, rowActionCount - 1) * 4 + 16
    : 0;
  const popin = useTablePopin({
    columnsMeta,
    enabled: overflowMode === "Popin",
    containerRef: tableWrapperRef,
    reservedWidth: (hasSelectionColumn ? 40 : 0) + actionsReserved + (hasNavigatedColumn ? 4 : 0),
  });

  // Compute popin column index (after visible data columns + actions)
  const totalGridCols = popin.visibleIndices.length + (hasSelectionColumn ? 1 : 0) + (hasActionsColumn ? 1 : 0);
  const popinColumnIndex = totalGridCols; // popin is the column after all visible grid columns

  // Column count for navigation includes popin cell when active
  const navColumnCount = totalGridCols + (popin.isPopinActive ? 1 : 0);

  // Grid template columns
  const gridTemplateColumns = useMemo(
    () => buildGridTemplateColumns(columnsMeta, popin.visibleIndices, hasSelectionColumn, hasActionsColumn, hasNavigatedColumn),
    [columnsMeta, popin.visibleIndices, hasSelectionColumn, hasActionsColumn, hasNavigatedColumn],
  );

  // Row key lookup
  const getRowIndexByKey = useCallback(
    (rowKey: string) => rowKeys.indexOf(rowKey),
    [rowKeys],
  );

  const getRowKey = useCallback(
    (rowIndex: number) => rowKeys[rowIndex] ?? null,
    [rowKeys],
  );

  // Growing mode — Table only needs to know if a growing button exists for keyboard navigation
  const hasGrowingButton = !!growingFeature;

  // When scrollHeight is set with Scroll mode, the grid element is the vertical scroll container
  const isGridScrollContainer = overflowMode === "Scroll" && !!scrollHeight;

  // Toolbar presence and sticky coordination
  const hasToolbar = !!toolbar;
  const isToolbarSticky = hasToolbar && !!(toolbar.props as Record<string, unknown>)?.sticky;
  const isHeaderSticky = !!headerRow && !!(headerRow.props as Record<string, unknown>)?.sticky;
  const TOOLBAR_HEIGHT = 48; // Toolbar min-h-[48px]
  const toolbarTop = stickyTop;
  const headerRowTopWhenNotScrollContainer = (isToolbarSticky && isHeaderSticky)
    ? `calc(${stickyTop} + ${TOOLBAR_HEIGHT}px)`
    : stickyTop;
  const headerRowTop = isGridScrollContainer
    // Toolbar renders outside the grid scroll container, so it does not affect
    // the header's sticky offset inside the scrolling grid.
    ? "0px"
    : headerRowTopWhenNotScrollContainer;

  // ─── Navigation hooks (two-tier) ───────────────────────────────────────────
  const navigationState = useTableNavigation({
    rowCount: dataRows.length,
    columnCount: navColumnCount,
    pageSize: 10,
    hasHeaderRow: !!headerRow,
    hasGrowingButton,
  });

  const domNavigation = useTableDomNavigation({
    tableContainerRef: tableWrapperRef,
    tableRef: gridRef,
    beforeSentinelRef,
    afterSentinelRef,
    mouseNavigatingRef: navigationState.mouseNavigatingRef,
    dataLength: dataRows.length,
    hasGrowingButton,
    hasSelectionColumn,
    selectionMode,
    navigationState,
    selectionState: {
      toggleSelection: selection.toggleSelection,
      selectAll: selection.selectAll,
      deselectAll: selection.deselectAll,
      areAllSelected: selection.areAllSelected,
      applyKeyboardRange: selection.applyKeyboardRange,
      selectRange: selection.selectRange,
      getLastSelectedKey: selection.getLastSelectedKey,
      clearRangeSession: selection.clearRangeSession,
    },
    getRowKey,
    pageSize: 10,
  });

  // ARIA counts
  const ariaRowCount = dataRows.length + 1; // +1 for header
  const ariaColCount = navColumnCount;

  // Loading delay
  const [showLoading, setShowLoading] = useState(loading && loadingDelay === 0);
  useEffect(() => {
    if (!loading) {
      setShowLoading(false);
      return;
    }
    if (loadingDelay === 0) {
      setShowLoading(true);
      return;
    }
    const timer = setTimeout(() => setShowLoading(true), loadingDelay);
    return () => clearTimeout(timer);
  }, [loading, loadingDelay]);

  // Empty state
  const isEmpty = dataRows.length === 0 && !loading;

  // ─── Loading focus handling ───────────────────────────────────────────────
  // When loading overlay is visible, sentinel focus redirects to the loading
  // element. Tab / Shift+Tab on the loading element exits the table via sentinels.
  const handleBeforeSentinelFocus = useCallback(() => {
    if (skipLoadingRedirectRef.current) {
      skipLoadingRedirectRef.current = false;
      return;
    }
    if (skipNoDataRedirectRef.current) {
      skipNoDataRedirectRef.current = false;
      return;
    }
    // Let domNavigation check its skip flag first (Tab-exit from inside the table)
    if (domNavigation.handleBeforeSentinelFocus()) return;
    if (showLoading) {
      loadingRef.current?.focus();
      return;
    }
    // For empty tables: restore to last position, or noData on first visit
    if (isEmpty && lastFocusWasNoDataRef.current !== false) {
      noDataRef.current?.focus();
    }
  }, [showLoading, isEmpty, domNavigation]);

  const handleAfterSentinelFocus = useCallback(() => {
    if (skipLoadingRedirectRef.current) {
      skipLoadingRedirectRef.current = false;
      return;
    }
    if (skipNoDataRedirectRef.current) {
      skipNoDataRedirectRef.current = false;
      return;
    }
    // Let domNavigation check its skip flag first (Tab-exit from inside the table)
    if (domNavigation.handleAfterSentinelFocus()) return;
    if (showLoading) {
      loadingRef.current?.focus();
      return;
    }
    if (isEmpty && lastFocusWasNoDataRef.current !== false) {
      noDataRef.current?.focus();
    }
  }, [showLoading, isEmpty, domNavigation]);

  const handleLoadingKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== "Tab") return;
    skipLoadingRedirectRef.current = true;
    if (e.shiftKey) {
      beforeSentinelRef.current?.focus();
    } else {
      afterSentinelRef.current?.focus();
    }
  }, []);

  const handleNoDataKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Tab") {
      skipNoDataRedirectRef.current = true;
      if (e.shiftKey) {
        beforeSentinelRef.current?.focus();
      } else {
        afterSentinelRef.current?.focus();
      }
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      lastFocusWasNoDataRef.current = false;
      domNavigation.focusRowAt(-1);
    }
  }, [domNavigation]);

  // When loading starts: if focus is inside the table, move it to loading overlay.
  // When loading ends: if focus was on the loading overlay, restore to last row or noData.
  useEffect(() => {
    if (showLoading) {
      if (tableWrapperRef.current?.contains(document.activeElement)) {
        loadingRef.current?.focus();
      }
    } else {
      if (loadingHadFocusRef.current) {
        loadingHadFocusRef.current = false;
        if (isEmpty) {
          noDataRef.current?.focus();
        } else {
          domNavigation.focusRememberedOrFirstRow();
        }
      }
    }
  }, [showLoading, isEmpty, domNavigation]);

  // When growing button disappears after final load, focus the first new row
  useEffect(() => {
    const prevHadGrowing = prevHadGrowingRef.current;
    const prevCount = prevRowCountRef.current;
    prevHadGrowingRef.current = hasGrowingButton;
    prevRowCountRef.current = dataRows.length;

    // Growing just disappeared and new rows were added
    if (prevHadGrowing && !hasGrowingButton && dataRows.length > prevCount && prevCount > 0) {
      // Focus was on the growing button (now gone) — activeElement falls to body
      const activeEl = document.activeElement;
      if (!activeEl || activeEl === document.body || !tableWrapperRef.current?.contains(activeEl)) {
        domNavigation.focusRowAt(prevCount);
      }
    }
  }, [hasGrowingButton, dataRows.length, domNavigation]);

  // Imperative handle
  useImperativeHandle(ref, () => ({
    get tableElement() { return gridRef.current; },
    get scrollContainer() { return tableWrapperRef.current; },
    focus() {
      // Check DOM for the actual focusable targets
      if (showLoading && loadingRef.current) {
        loadingRef.current.focus();
        return;
      }
      if (noDataRef.current && !gridRef.current?.querySelector("[data-row-key]")) {
        noDataRef.current.focus();
        return;
      }
      domNavigation.focusRememberedOrFirstRow();
    },
  }), [showLoading, domNavigation]);

  // Wire the consumer's selection ref to the real selection hook methods
  const selectionRef = selectionProps.ref as React.Ref<unknown> | undefined;
  useImperativeHandle(selectionRef ?? null, () => {
    if (selectionMode === "None") return {};
    if (selectionMode === "Multi") {
      return {
        getSelectedRows: () => {
          const grid = gridRef.current;
          if (!grid) return [];
          return [...selection.selectedKeys]
            .map((key) => grid.querySelector(`[data-row-key="${key}"]`) as HTMLElement)
            .filter(Boolean);
        },
        areAllRowsSelected: () => selection.areAllSelected(),
        getSelectedAsSet: () => new Set(selection.selectedKeys),
        setSelectedAsSet: (set: Set<string>) => {
          selection.setSelectedAsSet(set);
        },
        isSelected: (rowKey: string) => selection.isSelected(rowKey),
        setSelected: (rowKey: string, selected: boolean) => selection.setSelected(rowKey, selected),
      };
    }
    // Single mode
    return {
      getSelectedRow: () => {
        const grid = gridRef.current;
        if (!grid) return undefined;
        const key = [...selection.selectedKeys][0];
        if (!key) return undefined;
        return grid.querySelector(`[data-row-key="${key}"]`) as HTMLElement | undefined;
      },
      isSelected: (rowKey: string) => selection.isSelected(rowKey),
      setSelected: (rowKey: string, selected: boolean) => selection.setSelected(rowKey, selected),
    };
  }, [selectionMode, selection]);

  // ─── Context ────────────────────────────────────────────────────────────────
  const contextValue: TableContextValue = useMemo(() => ({
    tableId,
    columnCount: columnsMeta.length,
    columnsMeta,
    gridTemplateColumns,
    selectionMode,
    selectionBehavior,
    headerSelector,
    isSelected: selection.isSelected,
    toggleSelection: selection.toggleSelection,
    selectRange: selection.selectRange,
    applyKeyboardRange: selection.applyKeyboardRange,
    clearRangeSession: selection.clearRangeSession,
    selectedKeys: selection.selectedKeys,
    areAllSelected: selection.areAllSelected,
    selectAll: selection.selectAll,
    deselectAll: selection.deselectAll,
    getLastSelectedKey: selection.getLastSelectedKey,
    focusedRowIndex: navigationState.focusedRowIndex,
    focusedCellIndex: navigationState.focusedCell?.columnIndex ?? null,
    focusedCell: navigationState.focusedCell,
    navigationMode: navigationState.focusedCell ? "Cell" : "Row",
    setFocusedRow: (index: number) => {
      domNavigation.focusRowAt(index);
    },
    setFocusedCell: (rowIndex: number, cellIndex: number | null) => {
      if (cellIndex !== null) {
        domNavigation.focusCellAt(rowIndex, cellIndex);
      } else {
        domNavigation.focusRowAt(rowIndex);
      }
    },
    rowActionCount,
    hasSelectionColumn,
    hasActionsColumn,
    overflowMode: overflowMode as string,
    rowKeys,
    getRowIndexByKey,
    visibleColumnIndices: popin.visibleIndices,
    popinColumnIndices: popin.popinIndices,
    isPopinActive: popin.isPopinActive,
    popinColumnIndex,
    onRowClick,
    onRowActionClick,
    setMouseNavigating: () => { navigationState.mouseNavigatingRef.current = true; },
    navigateToRow: (rowIndex: number) => { navigationState.navigateTo(rowIndex); },
    dataRowCount: dataRows.length,
    alternateRowColors,
    hasNavigatedColumn,
    hasGrowingButton,
    hasToolbar,
  }), [
    tableId, columnsMeta, gridTemplateColumns, selectionMode, selectionBehavior,
    headerSelector, selection, navigationState, rowActionCount, hasSelectionColumn,
    hasActionsColumn, overflowMode, rowKeys, getRowIndexByKey, popin,
    popinColumnIndex, onRowClick, onRowActionClick, domNavigation, dataRows.length,
    alternateRowColors, hasNavigatedColumn, hasGrowingButton, hasToolbar,
  ]);

  // ArrowDown from header in empty table → focus noData
  const handleKeyDownCapture = useCallback((e: React.KeyboardEvent) => {
    if (isEmpty && e.key === "ArrowDown") {
      const target = e.target as HTMLElement;
      if (target.closest("[data-header-row]")) {
        e.preventDefault();
        noDataRef.current?.focus();
        return;
      }
    }
    domNavigation.handleKeyDown(e);
  }, [isEmpty, domNavigation]);

  const selectionDescription = selectionMode === "Multi"
    ? t("TABLE_MULTI_SELECTABLE")
    : selectionMode === "Single"
      ? t("TABLE_SINGLE_SELECTABLE")
      : undefined;

  return (
    <TableContext.Provider value={contextValue}>
      <div
        ref={tableWrapperRef}
        className={cn("relative overflow-x-clip flex flex-col border border-border rounded-lg", className)}
        style={style}
        data-testid={dataTestId}
        onKeyDownCapture={handleKeyDownCapture}
        onKeyUpCapture={domNavigation.handleKeyUp}
        onFocusCapture={domNavigation.handleFocusCapture}
      >
        {/* Table toolbar — rendered before scroll container, inside the rounded wrapper */}
        {toolbar && React.cloneElement(toolbar as React.ReactElement<Record<string, unknown>>, {
          style: {
            ...((toolbar.props as Record<string, unknown>)?.style as React.CSSProperties | undefined),
            ...(isToolbarSticky ? { top: toolbarTop } : {}),
          },
        })}

        {/* Before sentinel for keyboard navigation */}
        <div
          ref={beforeSentinelRef}
          tabIndex={0}
          onFocus={handleBeforeSentinelFocus}
          role="none"
          className="absolute w-0 h-0 overflow-hidden"
        />

        {/* Grid */}
        <div
          ref={gridRef}
          id={tableId}
          role="grid"
          aria-rowcount={ariaRowCount}
          aria-colcount={ariaColCount}
          aria-label={accessibleName}
          aria-labelledby={accessibleNameRef}
          aria-busy={loading || undefined}
          aria-multiselectable={selectionMode === "Multi" || undefined}
          aria-description={selectionDescription}
          onMouseDown={() => { navigationState.mouseNavigatingRef.current = true; }}
          style={{
            display: "grid",
            gridTemplateColumns,
            ...(overflowMode === "Scroll" && scrollHeight ? { height: scrollHeight } : {}),
          }}
          className={cn(
            "w-full text-sm [&>[data-row-key]:last-child]:border-b-0 content-start",
            isGridScrollContainer && "[&>[data-row-key]:has(+:not([data-row-key]))]:border-b-0",
            !hasGrowingButton && "[&>[data-row-key]:last-child]:rounded-b-lg",
            overflowMode === "Scroll" && "overflow-x-auto",
            overflowMode === "Scroll" && scrollHeight && "overflow-y-auto",
          )}
        >
          {/* Header row */}
          {headerRow && React.cloneElement(headerRow as React.ReactElement<Record<string, unknown>>, {
            style: {
              ...((headerRow.props as Record<string, unknown>)?.style as React.CSSProperties | undefined),
              ...((headerRow.props as Record<string, unknown>)?.sticky ? { top: headerRowTop } : {}),
            },
          })}

          {/* Data rows */}
          {dataRows.map((row) => row)}

          {/* Growing feature — inside grid when grid is the scroll container */}
          {isGridScrollContainer && growingFeature}
        </div>

        {/* Empty state */}
        {isEmpty && (
          <div
            ref={noDataRef}
            tabIndex={0}
            onKeyDown={handleNoDataKeyDown}
            onFocus={() => { lastFocusWasNoDataRef.current = true; }}
            className="flex items-center justify-center py-12 text-sapphire-text-tertiary text-sm outline-none focus:ring-2 focus:ring-ring focus:ring-inset"
            role="status"
          >
            {noData ?? noDataText ?? "No data available"}
          </div>
        )}

        {/* Growing feature — outside grid when consumer provides their own scroll container */}
        {!isGridScrollContainer && growingFeature}

        {/* Loading overlay — placed before after-sentinel so Tab exits forward */}
        {showLoading && (
          <div
            ref={loadingRef}
            tabIndex={0}
            onKeyDown={handleLoadingKeyDown}
            onFocus={() => { loadingHadFocusRef.current = true; }}
            onBlur={() => { loadingHadFocusRef.current = false; }}
            className="absolute inset-0 flex items-center justify-center bg-background/60 z-20 outline-none focus:ring-2 focus:ring-ring focus:ring-inset"
            role="status"
            aria-label={t("TABLE_LOADING")}
          >
            <div className="flex items-center gap-2 text-sm text-sapphire-text-tertiary">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {t("LOADING")}
            </div>
          </div>
        )}

        {/* After sentinel for keyboard navigation */}
        <div
          ref={afterSentinelRef}
          tabIndex={0}
          onFocus={handleAfterSentinelFocus}
          role="none"
          className="absolute w-0 h-0 overflow-hidden"
        />

        {/* Selection status announcement for screen readers */}
        {selectionMode !== "None" && (
          <div aria-live="polite" aria-atomic="true" className="sr-only">
            {selectionAnnouncement}
          </div>
        )}
      </div>
    </TableContext.Provider>
  );
}

export const Table = React.forwardRef(TableInner);
(Table as React.FC).displayName = "Table";
