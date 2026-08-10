import { useState, useCallback, useRef, useEffect } from "react";
import { getTabbableElements } from "../../list/utils/tabbable";

// ─── Types ───────────────────────────────────────────────────────────────────

interface FocusMemory {
  rowIndex: number;
  columnIndex: number;
  elementIndex?: number;
}

// ─── Pure keyboard handler (no hooks) ────────────────────────────────────────

export interface HandleTableKeyboardNavigationOptions {
  event: React.KeyboardEvent;
  isCellMode: boolean;
  currentRow: number;
  currentCol: number;
  dataLength: number;
  hasGrowingButton: boolean;
  horizontalForwardKey: "ArrowLeft" | "ArrowRight";
  horizontalBackwardKey: "ArrowLeft" | "ArrowRight";
  columnIndices: number[];
  focusRowAt: (rowIndex: number) => void;
  focusCellAt: (rowIndex: number, columnIndex: number) => void;
  onRowShiftRange?: (sourceRow: number, destinationRow: number) => void;
  onCellShiftRange?: (sourceRow: number, destinationRow: number) => void;
  pageSize?: number;
}

export function handleTableKeyboardNavigation(opts: HandleTableKeyboardNavigationOptions): boolean {
  if (!opts.isCellMode) {
    return handleRowModeKey(opts);
  }
  return handleCellModeKey(opts);
}

// ─── Row mode helpers ────────────────────────────────────────────────────────

function handleRowArrowDown(
  event: React.KeyboardEvent,
  currentRow: number,
  dataLength: number,
  hasGrowingButton: boolean,
  focusRowAt: (i: number) => void,
  onRowShiftRange?: (src: number, dst: number) => void,
): void {
  const nextRow = currentRow < 0 ? 0 : Math.min(currentRow + 1, dataLength - 1);

  if (event.shiftKey && onRowShiftRange && dataLength > 0) {
    event.preventDefault();
    onRowShiftRange(currentRow, nextRow);
    focusRowAt(currentRow >= dataLength - 1 && hasGrowingButton ? dataLength : nextRow);
    return;
  }

  event.preventDefault();
  if (currentRow < 0) {
    if (dataLength > 0) focusRowAt(0);
  } else if (currentRow >= dataLength - 1) {
    if (hasGrowingButton) focusRowAt(dataLength);
  } else {
    focusRowAt(currentRow + 1);
  }
}

function handleRowArrowUp(
  event: React.KeyboardEvent,
  currentRow: number,
  dataLength: number,
  focusRowAt: (i: number) => void,
  onRowShiftRange?: (src: number, dst: number) => void,
): void {
  const nextRow = currentRow === dataLength ? dataLength - 1 : Math.max(currentRow - 1, 0);

  if (event.shiftKey && onRowShiftRange && dataLength > 0) {
    event.preventDefault();
    onRowShiftRange(currentRow, nextRow);
    focusRowAt(currentRow === dataLength ? dataLength - 1 : nextRow);
    return;
  }

  event.preventDefault();
  if (currentRow === dataLength) {
    focusRowAt(dataLength - 1);
  } else if (currentRow <= 0) {
    focusRowAt(-1);
  } else {
    focusRowAt(currentRow - 1);
  }
}

function handleRowPageNavigation(
  key: string,
  event: React.KeyboardEvent,
  currentRow: number,
  dataLength: number,
  hasGrowingButton: boolean,
  focusRowAt: (i: number) => void,
  pageSize: number,
): boolean {
  event.preventDefault();
  if (key === "PageUp") {
    focusRowAt(currentRow <= 0 ? -1 : Math.max(currentRow - pageSize, 0));
  } else {
    if (currentRow >= dataLength - 1) {
      if (hasGrowingButton) focusRowAt(dataLength);
    } else {
      focusRowAt(Math.min(currentRow + pageSize, dataLength - 1));
    }
  }
  return true;
}

function handleRowModeKey(opts: HandleTableKeyboardNavigationOptions): boolean {
  const { event, currentRow, dataLength, hasGrowingButton, horizontalForwardKey, focusRowAt, focusCellAt, onRowShiftRange, pageSize = 10 } = opts;

  switch (event.key) {
    case "ArrowDown":
      handleRowArrowDown(event, currentRow, dataLength, hasGrowingButton, focusRowAt, onRowShiftRange);
      return true;

    case "ArrowUp":
      handleRowArrowUp(event, currentRow, dataLength, focusRowAt, onRowShiftRange);
      return true;

    case "ArrowRight":
    case "ArrowLeft": {
      if (event.key !== horizontalForwardKey) return true;
      if (currentRow <= dataLength - 1) {
        event.preventDefault();
        focusCellAt(currentRow, 0);
      }
      return true;
    }

    case "Home": {
      event.preventDefault();
      focusRowAt(currentRow === 0 ? -1 : 0);
      return true;
    }

    case "End": {
      event.preventDefault();
      if (dataLength === 0) { focusRowAt(-1); return true; }
      focusRowAt(currentRow === dataLength - 1 && hasGrowingButton ? dataLength : dataLength - 1);
      return true;
    }

    case "PageUp":
    case "PageDown":
      return handleRowPageNavigation(event.key, event, currentRow, dataLength, hasGrowingButton, focusRowAt, pageSize);

    default:
      return false;
  }
}

// ─── Cell mode helpers ───────────────────────────────────────────────────────

function handleCellVerticalArrow(
  direction: 1 | -1,
  event: React.KeyboardEvent,
  currentRow: number,
  currentCol: number,
  dataLength: number,
  hasGrowingButton: boolean,
  focusRowAt: (i: number) => void,
  focusCellAt: (r: number, c: number) => void,
  onCellShiftRange?: (src: number, dst: number) => void,
): boolean {
  event.preventDefault();

  const destinationRow = currentRow + direction;
  if (
    event.shiftKey
    && onCellShiftRange
    && currentRow >= 0
    && currentRow < dataLength
    && destinationRow >= 0
    && destinationRow < dataLength
  ) {
    onCellShiftRange(currentRow, destinationRow);
  }

  if (direction === 1) {
    if (currentRow < dataLength - 1) {
      focusCellAt(currentRow + 1, currentCol);
    } else if (hasGrowingButton) {
      focusRowAt(dataLength);
    }
  } else {
    focusCellAt(currentRow <= -1 ? -1 : currentRow - 1, currentCol);
  }
  return true;
}

function handleCellPageNavigation(
  key: string,
  event: React.KeyboardEvent,
  currentRow: number,
  currentCol: number,
  dataLength: number,
  hasGrowingButton: boolean,
  focusRowAt: (i: number) => void,
  focusCellAt: (r: number, c: number) => void,
  pageSize: number,
): boolean {
  event.preventDefault();
  if (key === "PageUp") {
    focusCellAt(currentRow <= 0 ? -1 : Math.max(currentRow - pageSize, 0), currentCol);
  } else {
    if (currentRow >= dataLength - 1) {
      if (hasGrowingButton) focusRowAt(dataLength);
    } else {
      focusCellAt(Math.min(currentRow + pageSize, dataLength - 1), currentCol);
    }
  }
  return true;
}

function handleCellModeKey(opts: HandleTableKeyboardNavigationOptions): boolean {
  const {
    event, currentRow, currentCol, dataLength, hasGrowingButton,
    horizontalForwardKey, horizontalBackwardKey,
    columnIndices, focusRowAt, focusCellAt, onCellShiftRange, pageSize = 10,
  } = opts;

  const indices = columnIndices.length > 0 ? columnIndices : [currentCol];
  const firstColumn = indices[0] ?? 0;
  const lastColumn = indices[indices.length - 1] ?? firstColumn;
  const currentColPosition = indices.findIndex((index) => index === currentCol);

  switch (event.key) {
    case "ArrowLeft":
    case "ArrowRight": {
      if (event.key === horizontalBackwardKey) {
        event.preventDefault();
        if (currentColPosition <= 0) {
          focusRowAt(currentRow);
        } else {
          focusCellAt(currentRow, indices[currentColPosition - 1] ?? firstColumn);
        }
        return true;
      }
      if (event.key === horizontalForwardKey) {
        event.preventDefault();
        if (currentColPosition !== -1 && currentColPosition < indices.length - 1) {
          focusCellAt(currentRow, indices[currentColPosition + 1] ?? lastColumn);
        }
      }
      return true;
    }

    case "ArrowUp":
      return handleCellVerticalArrow(-1, event, currentRow, currentCol, dataLength, hasGrowingButton, focusRowAt, focusCellAt, onCellShiftRange);

    case "ArrowDown":
      return handleCellVerticalArrow(1, event, currentRow, currentCol, dataLength, hasGrowingButton, focusRowAt, focusCellAt, onCellShiftRange);

    case "Home": {
      event.preventDefault();
      if (currentCol === firstColumn) {
        focusRowAt(currentRow);
      } else {
        focusCellAt(currentRow, firstColumn);
      }
      return true;
    }

    case "End": {
      event.preventDefault();
      if (currentCol === lastColumn) {
        focusRowAt(currentRow);
      } else {
        focusCellAt(currentRow, lastColumn);
      }
      return true;
    }

    case "PageUp":
    case "PageDown":
      return handleCellPageNavigation(event.key, event, currentRow, currentCol, dataLength, hasGrowingButton, focusRowAt, focusCellAt, pageSize);

    default:
      return false;
  }
}

// ─── State-only hook (Tier 1) ────────────────────────────────────────────────

export interface UseTableNavigationOptions {
  rowCount: number;
  columnCount: number;
  pageSize?: number;
  hasHeaderRow?: boolean;
  hasGrowingButton?: boolean;
  onNavigate?: (rowIndex: number, columnIndex?: number) => void;
  onFocusHeader?: () => void;
  onFocusGrowing?: () => void;
}

export interface UseTableNavigationReturn {
  focusedRowIndex: number;
  focusedCell: { rowIndex: number; columnIndex: number } | null;
  isCellContentFocused: boolean;
  setIsCellContentFocused: (v: boolean) => void;
  navigateTo: (rowIndex: number, columnIndex?: number) => void;
  enterCellMode: (rowIndex: number, columnIndex?: number) => void;
  exitCellMode: (rowIndex: number) => void;
  setFocusedRowIndex: (index: number) => void;
  focusMemoryRef: React.RefObject<FocusMemory | null>;
  mouseNavigatingRef: React.RefObject<boolean>;
}

export function useTableNavigation(options: UseTableNavigationOptions): UseTableNavigationReturn {
  const {
    rowCount,
    columnCount,
    hasHeaderRow = true,
    hasGrowingButton = false,
    onNavigate,
    onFocusHeader,
    onFocusGrowing,
  } = options;

  const [focusedRowIndex, setFocusedRowIndex] = useState(-1);
  const [focusedCell, setFocusedCell] = useState<{ rowIndex: number; columnIndex: number } | null>(null);
  const [isCellContentFocused, setIsCellContentFocused] = useState(false);
  const focusMemoryRef = useRef<FocusMemory | null>(null);
  const mouseNavigatingRef = useRef(false);

  const navigateTo = useCallback(
    (rowIndex: number, columnIndex?: number) => {
      const minRow = hasHeaderRow ? -1 : 0;
      const maxRow = hasGrowingButton ? rowCount : rowCount - 1;
      let targetRow = Math.max(minRow, Math.min(rowIndex, maxRow));

      // Header
      if (targetRow === -1 && hasHeaderRow) {
        if (columnIndex !== undefined) {
          const col = Math.max(0, Math.min(columnIndex, columnCount - 1));
          setFocusedRowIndex(-1);
          setFocusedCell({ rowIndex: -1, columnIndex: col });
          setIsCellContentFocused(false);
          onNavigate?.(-1, col);
          return;
        }
        setFocusedRowIndex(-1);
        setFocusedCell(null);
        setIsCellContentFocused(false);
        onFocusHeader?.();
        return;
      }

      // Growing button
      if (targetRow === rowCount && hasGrowingButton) {
        setFocusedRowIndex(rowCount);
        setFocusedCell(null);
        setIsCellContentFocused(false);
        onFocusGrowing?.();
        return;
      }

      targetRow = Math.max(0, Math.min(targetRow, rowCount - 1));

      if (columnIndex !== undefined) {
        const col = Math.max(0, Math.min(columnIndex, columnCount - 1));
        setFocusedRowIndex(targetRow);
        setFocusedCell({ rowIndex: targetRow, columnIndex: col });
        setIsCellContentFocused(false);
        onNavigate?.(targetRow, col);
      } else {
        setFocusedRowIndex(targetRow);
        setFocusedCell(null);
        setIsCellContentFocused(false);
        onNavigate?.(targetRow);
      }
    },
    [rowCount, columnCount, hasHeaderRow, hasGrowingButton, onNavigate, onFocusHeader, onFocusGrowing],
  );

  const enterCellMode = useCallback(
    (rowIndex: number, columnIndex: number = 0) => {
      const col = Math.max(0, Math.min(columnIndex, columnCount - 1));
      setFocusedCell({ rowIndex, columnIndex: col });
      setIsCellContentFocused(false);
      onNavigate?.(rowIndex, col);
    },
    [columnCount, onNavigate],
  );

  const exitCellMode = useCallback(
    (rowIndex: number) => {
      setFocusedCell(null);
      setIsCellContentFocused(false);
      onNavigate?.(rowIndex);
    },
    [onNavigate],
  );

  return {
    focusedRowIndex,
    focusedCell,
    isCellContentFocused,
    setIsCellContentFocused,
    navigateTo,
    enterCellMode,
    exitCellMode,
    setFocusedRowIndex,
    focusMemoryRef,
    mouseNavigatingRef,
  };
}

// ─── DOM-aware hook (Tier 2) ─────────────────────────────────────────────────

function isTextInputLike(el: HTMLElement | null): boolean {
  if (!el) return false;
  if (el.isContentEditable) return true;
  const tag = el.tagName.toLowerCase();
  return tag === "textarea" || tag === "input";
}

export interface UseTableDomNavigationOptions {
  tableContainerRef: React.RefObject<HTMLDivElement | null>;
  tableRef: React.RefObject<HTMLDivElement | null>;
  beforeSentinelRef: React.RefObject<HTMLDivElement | null>;
  afterSentinelRef: React.RefObject<HTMLDivElement | null>;
  mouseNavigatingRef: React.RefObject<boolean>;
  dataLength: number;
  hasGrowingButton: boolean;
  hasSelectionColumn: boolean;
  selectionMode: "None" | "Single" | "Multi";
  navigationState: UseTableNavigationReturn;
  selectionState: {
    toggleSelection: (key: string) => void;
    selectAll: () => void;
    deselectAll: () => void;
    areAllSelected: () => boolean;
    applyKeyboardRange: (currentKey: string, endKey: string) => void;
    selectRange: (startKey: string, endKey: string) => void;
    getLastSelectedKey: () => string | null;
    clearRangeSession: (options?: { clearAnchor?: boolean }) => void;
  };
  getRowKey: (rowIndex: number) => string | null;
  pageSize?: number;
}

export function useTableDomNavigation({
  tableContainerRef,
  tableRef,
  beforeSentinelRef,
  afterSentinelRef,
  mouseNavigatingRef,
  dataLength,
  hasGrowingButton,
  hasSelectionColumn,
  selectionMode,
  navigationState,
  selectionState,
  getRowKey,
  pageSize = 10,
}: UseTableDomNavigationOptions) {
  const lastFocusedRowRef = useRef<number | null>(null);
  const lastFocusedCellRef = useRef<{ rowIndex: number; columnIndex: number } | null>(null);
  const skipSentinelRedirectRef = useRef<"before" | "after" | null>(null);
  const rowInteractiveMemoryRef = useRef(0);
  const cellInteractiveMemoryRef = useRef(0);

  // ─── DOM queries ─────────────────────────────────────────────────────────

  const getHeaderRowElement = useCallback(() => {
    return tableRef.current?.querySelector<HTMLElement>('[data-header-row="true"]') ?? null;
  }, [tableRef]);

  const getBodyRowElement = useCallback((rowIndex: number) => {
    return tableRef.current?.querySelector<HTMLElement>(`[data-row-focusable="true"][data-row-index="${rowIndex}"]`) ?? null;
  }, [tableRef]);

  const getGrowingButtonElement = useCallback(() => {
    return tableContainerRef.current?.querySelector<HTMLElement>("[data-growing-button]") ?? null;
  }, [tableContainerRef]);

  const getRowElement = useCallback((rowIndex: number) => {
    if (rowIndex === -1) return getHeaderRowElement();
    if (rowIndex >= 0 && rowIndex < dataLength) return getBodyRowElement(rowIndex);
    return null;
  }, [dataLength, getBodyRowElement, getHeaderRowElement]);

  const getFocusableCellsInRow = useCallback((rowEl: HTMLElement | null) => {
    if (!rowEl) return [] as HTMLElement[];
    return Array.from(rowEl.querySelectorAll<HTMLElement>('[data-cell-focusable="true"]'));
  }, []);

  const getColumnIndicesForRow = useCallback((rowIndex: number) => {
    const rowEl = getRowElement(rowIndex);
    const cells = getFocusableCellsInRow(rowEl);
    return cells
      .map((cell) => Number(cell.dataset.columnIndex))
      .filter((value) => !Number.isNaN(value))
      .sort((a, b) => a - b);
  }, [getFocusableCellsInRow, getRowElement]);

  const getCellElement = useCallback((rowIndex: number, columnIndex: number) => {
    const rowEl = getRowElement(rowIndex);
    const cells = getFocusableCellsInRow(rowEl);
    if (cells.length === 0) return null;
    const exact = cells.find((cell) => Number(cell.dataset.columnIndex) === columnIndex);
    if (exact) return exact;
    return cells[0] ?? null;
  }, [getFocusableCellsInRow, getRowElement]);

  const getInteractiveElements = useCallback((container: HTMLElement | null) => {
    return getTabbableElements(container).filter(
      (el) => !el.matches('[data-row-focusable="true"], [data-cell-focusable="true"]'),
    );
  }, []);

  const resolveRowIndexFromElement = useCallback((element: HTMLElement | null): number | null => {
    if (!element) return null;
    if (element.hasAttribute("data-growing-button")) return dataLength;

    const rowEl = element.closest<HTMLElement>('[data-row-index][data-row-focusable="true"], [data-header-row="true"]');
    if (!rowEl) return null;
    if (rowEl.dataset.headerRow === "true") return -1;

    const rowIndex = Number(rowEl.dataset.rowIndex);
    return Number.isNaN(rowIndex) ? null : rowIndex;
  }, [dataLength]);

  const resolveColumnIndexFromElement = useCallback((element: HTMLElement | null): number | null => {
    if (!element) return null;
    const cellEl = element.closest<HTMLElement>('[data-cell-focusable="true"]');
    if (!cellEl) return null;
    const colIndex = Number(cellEl.dataset.columnIndex);
    return Number.isNaN(colIndex) ? null : colIndex;
  }, []);

  // ─── Focus methods ───────────────────────────────────────────────────────

  const focusRowAt = useCallback(
    (rowIndex: number, options?: { syncNavigation?: boolean; remember?: boolean; preventScroll?: boolean }) => {
      const { syncNavigation = true, remember = true, preventScroll = false } = options ?? {};

      if (rowIndex === dataLength && hasGrowingButton) {
        const growingButton = getGrowingButtonElement();
        if (syncNavigation) navigationState.navigateTo(rowIndex);
        if (growingButton && growingButton !== document.activeElement) {
          growingButton.focus({ preventScroll });
        }
        if (remember) lastFocusedCellRef.current = null;
        return Boolean(growingButton);
      }

      const rowEl = getRowElement(rowIndex);
      if (!rowEl) return false;

      if (syncNavigation) navigationState.navigateTo(rowIndex);
      if (rowEl !== document.activeElement) rowEl.focus({ preventScroll });

      // Clean up imperatively-set tabindex on cells when returning to row mode.
      // focusCellAt sets tabindex before React renders; React's tabIndex={undefined}
      // doesn't remove manually-set DOM attributes.
      const cellEls = rowEl.querySelectorAll<HTMLElement>('[data-cell-focusable="true"][tabindex]');
      cellEls.forEach((el) => el.removeAttribute("tabindex"));

      if (remember && rowIndex >= -1 && rowIndex < dataLength) {
        lastFocusedRowRef.current = rowIndex;
        lastFocusedCellRef.current = null;
        // Clear F7 cell-remembering sentinel so it doesn't carry over to a different row
        if (cellInteractiveMemoryRef.current === -1) cellInteractiveMemoryRef.current = 0;
      }

      return true;
    },
    [dataLength, getGrowingButtonElement, getRowElement, hasGrowingButton, navigationState],
  );

  const focusCellAt = useCallback(
    (rowIndex: number, columnIndex: number, options?: { syncNavigation?: boolean; remember?: boolean; preventScroll?: boolean; forceCellFocus?: boolean }) => {
      const { syncNavigation = true, remember = true, preventScroll = false, forceCellFocus = false } = options ?? {};

      const cellEl = getCellElement(rowIndex, columnIndex);
      if (!cellEl) return false;

      const resolvedColumnIndex = Number(cellEl.dataset.columnIndex ?? columnIndex);
      if (syncNavigation) navigationState.navigateTo(rowIndex, resolvedColumnIndex);

      const activeEl = document.activeElement as HTMLElement | null;
      const activeIsInteractiveInsideTarget = Boolean(activeEl) && activeEl !== cellEl && cellEl.contains(activeEl);

      if ((forceCellFocus || !activeIsInteractiveInsideTarget) && cellEl !== activeEl) {
        // Ensure cell is focusable before calling focus — React may not have
        // rendered the tabIndex yet when entering cell mode synchronously.
        if (!cellEl.hasAttribute("tabindex")) {
          cellEl.setAttribute("tabindex", "-1");
        }
        cellEl.focus({ preventScroll });
      }

      if (remember && rowIndex >= -1 && rowIndex < dataLength) {
        lastFocusedRowRef.current = rowIndex;
        lastFocusedCellRef.current = { rowIndex, columnIndex: resolvedColumnIndex };
      }

      return true;
    },
    [dataLength, getCellElement, navigationState],
  );

  const focusRememberedOrFirstRow = useCallback(() => {
    const remembered = lastFocusedRowRef.current;
    if (typeof remembered === "number" && remembered >= -1 && remembered < dataLength) {
      if (focusRowAt(remembered)) return;
    }
    if (dataLength > 0) {
      focusRowAt(0);
      return;
    }
    focusRowAt(-1);
  }, [dataLength, focusRowAt]);

  const focusInteractiveInRow = useCallback((rowIndex: number, preferredIndex: number) => {
    const rowEl = getRowElement(rowIndex);
    const interactive = getInteractiveElements(rowEl);
    if (interactive.length === 0) return false;
    const targetIndex = Math.max(0, Math.min(preferredIndex, interactive.length - 1));
    rowInteractiveMemoryRef.current = targetIndex;
    interactive[targetIndex]?.focus();
    return true;
  }, [getInteractiveElements, getRowElement]);

  const focusInteractiveInCell = useCallback((rowIndex: number, columnIndex: number, preferredIndex: number) => {
    const cellEl = getCellElement(rowIndex, columnIndex);
    const interactive = getInteractiveElements(cellEl);
    if (interactive.length === 0) return false;
    const targetIndex = Math.max(0, Math.min(preferredIndex, interactive.length - 1));
    cellInteractiveMemoryRef.current = targetIndex;
    interactive[targetIndex]?.focus();
    return true;
  }, [getCellElement, getInteractiveElements]);

  const focusMatchingInteractiveInCell = useCallback(
    (rowIndex: number, columnIndex: number, sourceElement: HTMLElement) => {
      const cellEl = getCellElement(rowIndex, columnIndex);
      if (!cellEl) return false;

      const sourceRole = sourceElement.getAttribute("role");
      if (sourceRole) {
        const roleMatch = cellEl.querySelector<HTMLElement>(`[role="${sourceRole}"]`);
        if (roleMatch) { roleMatch.focus(); return true; }
      }

      const tagMatch = cellEl.querySelector<HTMLElement>(sourceElement.tagName.toLowerCase());
      if (tagMatch) { tagMatch.focus(); return true; }

      return false;
    },
    [getCellElement],
  );

  const rememberInteractivePosition = useCallback((target: HTMLElement) => {
    const rowEl = target.closest<HTMLElement>('[data-row-index][data-row-focusable="true"], [data-header-row="true"]');
    if (rowEl) {
      const rowInteractive = getInteractiveElements(rowEl);
      const rowIdx = rowInteractive.findIndex((el) => el === target || el.contains(target));
      if (rowIdx >= 0) rowInteractiveMemoryRef.current = rowIdx;
    }

    const cellEl = target.closest<HTMLElement>('[data-cell-focusable="true"]');
    if (cellEl) {
      const cellInteractive = getInteractiveElements(cellEl);
      const cellIdx = cellInteractive.findIndex((el) => el === target || el.contains(target));
      if (cellIdx >= 0) cellInteractiveMemoryRef.current = cellIdx;
    }
  }, [getInteractiveElements]);

  // ─── Tab forwarding ──────────────────────────────────────────────────────

  const forwardFocusOutOfTable = useCallback((shiftKey: boolean) => {
    const currentRow = navigationState.focusedCell?.rowIndex ?? navigationState.focusedRowIndex;
    if (currentRow >= -1 && currentRow < dataLength) {
      lastFocusedRowRef.current = currentRow;
    }
    if (navigationState.focusedCell) {
      lastFocusedCellRef.current = navigationState.focusedCell;
    }

    if (shiftKey) {
      skipSentinelRedirectRef.current = "before";
      beforeSentinelRef.current?.focus();
      return;
    }
    skipSentinelRedirectRef.current = "after";
    afterSentinelRef.current?.focus();
  }, [dataLength, navigationState.focusedCell, navigationState.focusedRowIndex, beforeSentinelRef, afterSentinelRef]);

  const handleBeforeSentinelFocus = useCallback((): boolean => {
    if (skipSentinelRedirectRef.current === "before") {
      skipSentinelRedirectRef.current = null;
      return true;
    }
    focusRememberedOrFirstRow();
    return false;
  }, [focusRememberedOrFirstRow]);

  const handleAfterSentinelFocus = useCallback((): boolean => {
    if (skipSentinelRedirectRef.current === "after") {
      skipSentinelRedirectRef.current = null;
      return true;
    }
    focusRememberedOrFirstRow();
    return false;
  }, [focusRememberedOrFirstRow]);

  // ─── Shift+Arrow range selection ─────────────────────────────────────────

  const applyKeyboardRangeBetweenRows = useCallback((sourceRow: number, destinationRow: number) => {
    if (selectionMode !== "Multi") return;
    if (sourceRow < 0 || sourceRow >= dataLength) return;
    if (destinationRow < 0 || destinationRow >= dataLength) return;

    const sourceKey = getRowKey(sourceRow);
    const destinationKey = getRowKey(destinationRow);
    if (sourceKey && destinationKey) {
      selectionState.applyKeyboardRange(sourceKey, destinationKey);
    }
  }, [dataLength, getRowKey, selectionMode, selectionState]);

  const applyRowModeShiftRangeSelection = useCallback((sourceRow: number, destinationRow: number) => {
    if (selectionMode !== "Multi" || dataLength === 0) return;
    if (destinationRow < 0 || destinationRow >= dataLength) return;

    let normalizedSourceRow: number;
    if (sourceRow === dataLength) {
      normalizedSourceRow = dataLength - 1;
    } else if (sourceRow < 0) {
      normalizedSourceRow = destinationRow;
    } else {
      normalizedSourceRow = sourceRow;
    }

    const anchorKey =
      selectionState.getLastSelectedKey()
      ?? getRowKey(normalizedSourceRow);
    const endKey = getRowKey(destinationRow);

    if (anchorKey && endKey) {
      selectionState.selectRange(anchorKey, endKey);
    }
  }, [dataLength, getRowKey, selectionMode, selectionState]);

  // ─── Interactive element arrow handling ──────────────────────────────────

  const handleInteractiveInCellArrow = useCallback((
    e: React.KeyboardEvent,
    target: HTMLElement,
    currentRow: number,
    currentCol: number,
  ) => {
    if (isTextInputLike(target) && !(e.ctrlKey || e.metaKey)) return false;

    e.preventDefault();
    rememberInteractivePosition(target);

    const direction = e.key === "ArrowDown" ? 1 : -1;
    const destinationRow = currentRow + direction;

    if (
      e.shiftKey
      && selectionMode === "Multi"
      && currentRow >= 0
      && currentRow < dataLength
      && destinationRow >= 0
      && destinationRow < dataLength
    ) {
      applyKeyboardRangeBetweenRows(currentRow, destinationRow);
    }

    if (destinationRow < -1) {
      focusCellAt(-1, currentCol);
      return true;
    }

    if (destinationRow > dataLength - 1) {
      if (hasGrowingButton) focusRowAt(dataLength);
      return true;
    }

    if (
      !focusInteractiveInCell(destinationRow, currentCol, cellInteractiveMemoryRef.current)
      && !focusMatchingInteractiveInCell(destinationRow, currentCol, target)
    ) {
      focusCellAt(destinationRow, currentCol);
    }
    return true;
  }, [
    applyKeyboardRangeBetweenRows, dataLength, focusCellAt, focusInteractiveInCell,
    focusMatchingInteractiveInCell, focusRowAt, hasGrowingButton, rememberInteractivePosition, selectionMode,
  ]);

  // ─── F2 / F7 / Enter ────────────────────────────────────────────────────

  const handleF2Key = useCallback((
    e: React.KeyboardEvent,
    currentRow: number,
    currentCol: number,
    targetIsInteractiveInCell: boolean,
    targetIsInteractiveInRow: boolean,
    targetIsCell: boolean,
    targetIsRow: boolean,
  ) => {
    if (targetIsInteractiveInCell) {
      e.preventDefault();
      focusCellAt(currentRow, currentCol, { forceCellFocus: true });
      return;
    }
    if (targetIsInteractiveInRow) {
      e.preventDefault();
      focusRowAt(currentRow);
      return;
    }
    if (targetIsCell) {
      e.preventDefault();
      focusInteractiveInCell(currentRow, currentCol, 0);
      return;
    }
    if (targetIsRow && currentRow >= 0 && currentRow < dataLength) {
      e.preventDefault();
      focusInteractiveInRow(currentRow, 0);
    }
  }, [dataLength, focusCellAt, focusInteractiveInCell, focusInteractiveInRow, focusRowAt]);

  const handleF7Key = useCallback((
    e: React.KeyboardEvent,
    target: HTMLElement,
    currentRow: number,
    targetIsInteractiveInCell: boolean,
    targetIsInteractiveInRow: boolean,
    targetIsCell: boolean,
    targetIsRow: boolean,
  ) => {
    if (targetIsInteractiveInCell || targetIsInteractiveInRow) {
      e.preventDefault();
      rememberInteractivePosition(target);
      focusRowAt(currentRow);
      return;
    }
    if (targetIsCell) {
      e.preventDefault();
      cellInteractiveMemoryRef.current = -1;
      focusRowAt(currentRow, { remember: false });
      return;
    }
    if (targetIsRow && currentRow >= 0 && currentRow < dataLength) {
      e.preventDefault();
      // If F7 was used from a cell (remembering mode), return to that cell
      if (cellInteractiveMemoryRef.current === -1) {
        const cell = lastFocusedCellRef.current;
        cellInteractiveMemoryRef.current = 0;
        if (cell && cell.rowIndex === currentRow) {
          focusCellAt(currentRow, cell.columnIndex);
          return;
        }
      }
      focusInteractiveInRow(currentRow, rowInteractiveMemoryRef.current);
    }
  }, [dataLength, focusCellAt, focusInteractiveInRow, focusRowAt, rememberInteractivePosition]);

  // ─── Selection key handling ──────────────────────────────────────────────

  const handleSelectAllToggle = useCallback(() => {
    if (selectionState.areAllSelected()) {
      selectionState.deselectAll();
    } else {
      selectionState.selectAll();
    }
  }, [selectionState]);

  const handleSelectionKey = useCallback((e: React.KeyboardEvent, isCellMode: boolean, currentRow: number): boolean => {
    if ((e.key === "a" || e.key === "A") && (e.ctrlKey || e.metaKey) && selectionMode === "Multi") {
      e.preventDefault();
      handleSelectAllToggle();
      return true;
    }

    if (e.key === " " && !isCellMode && selectionMode !== "None") {
      if (currentRow === -1) {
        e.preventDefault();
        handleSelectAllToggle();
        return true;
      }
      if (currentRow >= 0 && currentRow < dataLength) {
        e.preventDefault();
        const key = getRowKey(currentRow);
        if (key) selectionState.toggleSelection(key);
        return true;
      }
    }
    return false;
  }, [dataLength, getRowKey, handleSelectAllToggle, selectionMode, selectionState]);

  // ─── Focus capture ───────────────────────────────────────────────────────

  const handleFocusCapture = useCallback((e: React.FocusEvent) => {
    const target = e.target as HTMLElement;
    if (!tableContainerRef.current?.contains(target)) return;
    if (target.closest("[role='toolbar']")) return;

    const rowIndex = resolveRowIndexFromElement(target);

    if (rowIndex !== null && rowIndex >= -1 && rowIndex < dataLength) {
      lastFocusedRowRef.current = rowIndex;
    }

    if (target.matches('[data-row-focusable="true"]')) {
      if (rowIndex !== null) navigationState.navigateTo(rowIndex);
      return;
    }

    if (target.matches('[data-cell-focusable="true"]')) {
      const colIndex = resolveColumnIndexFromElement(target);
      if (rowIndex !== null && colIndex !== null) {
        navigationState.navigateTo(rowIndex, colIndex);
        if (rowIndex >= -1 && rowIndex < dataLength) {
          lastFocusedCellRef.current = { rowIndex, columnIndex: colIndex };
        }
      }
      return;
    }

    if (target.hasAttribute("data-growing-button")) {
      navigationState.navigateTo(dataLength);
      return;
    }

    rememberInteractivePosition(target);
  }, [
    dataLength, navigationState, rememberInteractivePosition,
    resolveColumnIndexFromElement, resolveRowIndexFromElement, tableContainerRef,
  ]);

  // ─── Context resolution ──────────────────────────────────────────────────

  const resolveKeydownContext = useCallback((e: React.KeyboardEvent) => {
    const target = (e.target as HTMLElement) ?? (document.activeElement as HTMLElement | null);
    if (!target || !tableContainerRef.current?.contains(target)) return null;

    // Toolbar has its own keyboard handling — don't intercept
    if (target.closest("[role='toolbar']")) return null;

    // noData / loading overlay handle their own keyboard — don't intercept
    if (target.closest("[role='status']")) return null;

    const rowEl = target.closest<HTMLElement>('[data-row-index][data-row-focusable="true"], [data-header-row="true"]');
    const cellEl = target.closest<HTMLElement>('[data-cell-focusable="true"]');

    const targetIsRow = target.matches('[data-row-focusable="true"]') || target.hasAttribute("data-growing-button");
    const targetIsCell = target.matches('[data-cell-focusable="true"]');
    const targetIsInteractiveInRow = Boolean(rowEl) && !targetIsRow && !targetIsCell;
    const targetIsInteractiveInCell = Boolean(cellEl) && !targetIsCell;

    const rowIndexFromDom = resolveRowIndexFromElement(target);
    const colIndexFromDom = resolveColumnIndexFromElement(target);

    const stateRow = navigationState.focusedCell?.rowIndex ?? navigationState.focusedRowIndex;
    const stateCol = navigationState.focusedCell?.columnIndex ?? 0;

    return {
      target,
      currentRow: rowIndexFromDom ?? stateRow,
      currentCol: colIndexFromDom ?? stateCol,
      isCellMode: targetIsCell || (!targetIsRow && !targetIsInteractiveInRow && navigationState.focusedCell !== null),
      targetIsRow,
      targetIsCell,
      targetIsInteractiveInRow,
      targetIsInteractiveInCell,
    };
  }, [navigationState.focusedCell, navigationState.focusedRowIndex, resolveColumnIndexFromElement, resolveRowIndexFromElement, tableContainerRef]);

  // ─── Selection cell key handler ──────────────────────────────────────────
  const handleSelectionCellKey = useCallback((e: React.KeyboardEvent, currentRow: number): boolean => {
    if (selectionMode !== "None" && currentRow >= 0 && currentRow < dataLength) {
      e.preventDefault();
      const key = getRowKey(currentRow);
      if (key) selectionState.toggleSelection(key);
      return true;
    }
    if (currentRow === -1 && selectionMode === "Multi") {
      e.preventDefault();
      handleSelectAllToggle();
      return true;
    }
    return false;
  }, [dataLength, getRowKey, handleSelectAllToggle, selectionMode, selectionState]);

  // ─── Escape key handler ────────────────────────────────────────────────
  const handleEscapeKey = useCallback((e: React.KeyboardEvent, currentRow: number, currentCol: number, targetIsInteractiveInCell: boolean, targetIsCell: boolean): boolean => {
    if (targetIsInteractiveInCell) {
      e.preventDefault();
      focusCellAt(currentRow, currentCol, { forceCellFocus: true });
      return true;
    }
    if (targetIsCell) {
      e.preventDefault();
      focusRowAt(currentRow);
      return true;
    }
    return false;
  }, [focusCellAt, focusRowAt]);

  // ─── Main keydown handler (capture phase) ────────────────────────────────

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.defaultPrevented) return;

    const ctx = resolveKeydownContext(e);
    if (!ctx) return;

    const { target, currentRow, currentCol, isCellMode, targetIsRow, targetIsCell, targetIsInteractiveInRow, targetIsInteractiveInCell } = ctx;

    const isRtl = tableRef.current
      ? window.getComputedStyle(tableRef.current).direction === "rtl"
      : document?.documentElement?.dir === "rtl";
    const horizontalForwardKey = isRtl ? "ArrowLeft" as const : "ArrowRight" as const;
    const horizontalBackwardKey = isRtl ? "ArrowRight" as const : "ArrowLeft" as const;

    // Space on row/cell → always prevent browser scroll, regardless of selection mode
    if (e.key === " " && (targetIsRow || targetIsCell)) {
      e.preventDefault();
    }

    // Tab → exit table
    if ((targetIsRow || targetIsCell) && e.key === "Tab") {
      forwardFocusOutOfTable(e.shiftKey);
      return;
    }

    // Arrow Up/Down on interactive inside cell — only for buttons, links, checkboxes, radios
    if (targetIsInteractiveInCell && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      const tag = target.tagName.toLowerCase();
      const role = target.getAttribute("role");
      const isNavigable = tag === "button" || tag === "a" || role === "button" || role === "link" || role === "checkbox" || role === "radio";
      if (isNavigable) {
        handleInteractiveInCellArrow(e, target, currentRow, currentCol);
        return;
      }
    }

    // F2
    if (e.key === "F2") {
      handleF2Key(e, currentRow, currentCol, targetIsInteractiveInCell, targetIsInteractiveInRow, targetIsCell, targetIsRow);
      return;
    }

    // F7
    if (e.key === "F7") {
      handleF7Key(e, target, currentRow, targetIsInteractiveInCell, targetIsInteractiveInRow, targetIsCell, targetIsRow);
      return;
    }

    // Space/Enter on selection cell → toggle selection
    if ((e.key === " " || e.key === "Enter") && targetIsCell && hasSelectionColumn && currentCol === 0) {
      if (handleSelectionCellKey(e, currentRow)) return;
    }

    // Enter on cell → focus interactive
    if (e.key === "Enter" && targetIsCell) {
      e.preventDefault();
      focusInteractiveInCell(currentRow, currentCol, 0);
      return;
    }

    // Escape
    if (e.key === "Escape") {
      if (handleEscapeKey(e, currentRow, currentCol, targetIsInteractiveInCell, targetIsCell)) return;
    }

    // Don't override keys on interactive elements in cells (except Up/Down on buttons/links, F2, F7, Escape — handled above)
    if (targetIsInteractiveInCell) return;

    // Don't override keys on interactive elements in rows (except Up/Down on navigable controls, F2, F7 — handled above)
    if (targetIsInteractiveInRow) {
      if ((e.key === "ArrowDown" || e.key === "ArrowUp")) {
        const tag = target.tagName.toLowerCase();
        const role = target.getAttribute("role");
        const isNavigable = tag === "button" || tag === "a" || role === "button" || role === "link" || role === "checkbox" || role === "radio";
        if (isNavigable) {
          // Navigate rows from action buttons/links in row mode
          e.preventDefault();
          const direction = e.key === "ArrowDown" ? 1 : -1;
          const nextRow = currentRow + direction;
          if (nextRow >= -1 && nextRow <= (hasGrowingButton ? dataLength : dataLength - 1)) {
            focusRowAt(nextRow);
          }
        }
      }
      return;
    }

    // Selection keys
    if (handleSelectionKey(e, isCellMode, currentRow)) return;

    // Navigation keys
    handleTableKeyboardNavigation({
      event: e,
      isCellMode,
      currentRow,
      currentCol,
      dataLength,
      hasGrowingButton,
      horizontalForwardKey,
      horizontalBackwardKey,
      columnIndices: isCellMode ? getColumnIndicesForRow(currentRow) : [],
      focusRowAt,
      focusCellAt,
      onRowShiftRange: selectionMode === "Multi" ? applyRowModeShiftRangeSelection : undefined,
      onCellShiftRange: selectionMode === "Multi" ? applyKeyboardRangeBetweenRows : undefined,
      pageSize,
    });
  }, [
    applyKeyboardRangeBetweenRows, applyRowModeShiftRangeSelection,
    dataLength, focusCellAt, focusInteractiveInCell, focusRowAt,
    forwardFocusOutOfTable, getColumnIndicesForRow, handleF2Key, handleF7Key,
    handleEscapeKey, handleInteractiveInCellArrow,
    handleSelectionCellKey, handleSelectionKey,
    hasGrowingButton, hasSelectionColumn,
    pageSize, resolveKeydownContext, selectionMode, tableRef,
  ]);

  // ─── KeyUp handler ───────────────────────────────────────────────────────

  const handleKeyUp = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Shift") {
      selectionState.clearRangeSession({ clearAnchor: true });
    }
  }, [selectionState]);

  // ─── Focus sync effect ───────────────────────────────────────────────────

  const prevFocusSnapshotRef = useRef(`row:${navigationState.focusedRowIndex}`);
  useEffect(() => {
    const cell = navigationState.focusedCell;
    const snapshot = cell
      ? `cell:${cell.rowIndex}:${cell.columnIndex}`
      : `row:${navigationState.focusedRowIndex}`;

    if (snapshot === prevFocusSnapshotRef.current) return;
    prevFocusSnapshotRef.current = snapshot;

    if (mouseNavigatingRef.current) {
      mouseNavigatingRef.current = false;
      return;
    }

    if (cell) {
      focusCellAt(cell.rowIndex, cell.columnIndex, { syncNavigation: false, remember: false });
      return;
    }

    focusRowAt(navigationState.focusedRowIndex, { syncNavigation: false, remember: false });
  }, [navigationState.focusedCell, navigationState.focusedRowIndex, focusCellAt, focusRowAt, mouseNavigatingRef]);

  return {
    focusRowAt,
    focusCellAt,
    focusRememberedOrFirstRow,
    handleKeyDown,
    handleKeyUp,
    handleFocusCapture,
    handleBeforeSentinelFocus,
    handleAfterSentinelFocus,
    lastFocusedCellRef,
  };
}
