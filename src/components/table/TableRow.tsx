import React, { useCallback, useMemo, useRef, useState } from "react";
import { cn } from "../../lib/utils";
import type { TableRowActionProps, TableRowProps } from "../../types/table";
import type { ButtonRef } from "../../types/button";
import { Button } from "../button";
import { CheckBox } from "../checkbox";
import { getTabbableElements } from "../list/utils/tabbable";
import { Menu, MenuItem } from "../menu/Menu";
import { RadioButton } from "../radiobutton";
import { OverflowIcon } from "../../icons/Overflow";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import { useTableContext } from "./TableContext";
import { scanRowChildren } from "./table-utils";

// ── Helpers ─────────────────────────────────────────────────────────────────

interface StickyStateClasses {
  isScroll: boolean;
  isAlternate: boolean;
  isInteractive: boolean;
  isSelected: boolean;
  enterActive: boolean;
}

/** Shared scroll-mode sticky-cell background classes (selection, actions). */
function stickyScrollClasses(
  { isScroll, isAlternate, isInteractive, isSelected, enterActive }: StickyStateClasses,
  isBottomEdge: boolean,
  side: "left" | "right",
) {
  if (!isScroll) return "";
  const stickyBase = side === "left"
    ? "sticky left-0 z-[1] bg-sapphire-canvas-primary"
    : "sticky right-0 z-[1] bg-sapphire-canvas-primary";

  const clipNormal = "group-focus/row:[clip-path:inset(2px)]";
  const clipBottom = side === "left"
    ? "group-focus/row:[clip-path:inset(2px_round_0_0_0_8px)]"
    : "group-focus/row:[clip-path:inset(2px_round_0_0_8px_0)]";

  return cn(
    stickyBase,
    !isBottomEdge && clipNormal,
    isBottomEdge && clipBottom,
    isAlternate && "bg-accent/60",
    isInteractive && "group-hover/row:bg-sapphire-neutral-hover-background-2",
    isInteractive && "group-focus/row:group-active/row:bg-sapphire-neutral-pressed-background",
    isSelected && !enterActive && "bg-sapphire-brand-selected-background",
    isSelected && !enterActive && isInteractive && "group-hover/row:bg-sapphire-brand-selected-hover-background",
    isInteractive && isSelected && "group-focus/row:group-active/row:bg-sapphire-neutral-pressed-background",
    enterActive && "bg-sapphire-neutral-pressed-background",
  );
}

// ── Selection Cell ──────────────────────────────────────────────────────────

function SelectionCell({
  ctx, isSelected, isCellMode, isBottomEdge, stickyState,
  handleCheckboxChange, t,
}: {
  ctx: ReturnType<typeof useTableContext>;
  isSelected: boolean;
  isCellMode: boolean;
  isBottomEdge: boolean;
  stickyState: StickyStateClasses;
  handleCheckboxChange: (detail: { checked: boolean; originalEvent: React.SyntheticEvent }) => void;
  t: TFunction;
}) {
  return (
    <div
      role="gridcell"
      aria-colindex={1}
      data-cell-focusable="true"
      data-column-index={0}
      tabIndex={isCellMode ? -1 : undefined}
      className={cn(
        "flex items-center justify-center min-h-[40px] cursor-pointer",
        "outline-none focus:ring-2 focus:ring-ring focus:ring-inset",
        isBottomEdge && "rounded-bl-lg",
        stickyScrollClasses(stickyState, isBottomEdge, "left"),
      )}
      onClick={(e) => e.stopPropagation()}
    >
      {ctx.selectionMode === "Multi" && (
        <CheckBox
          checked={isSelected}
          onChange={handleCheckboxChange}
          size="Small"
          tabIndex={-1}
          accessibleName={t("TABLE_ROW_SELECTION")}
        />
      )}
      {ctx.selectionMode === "Single" && (
        <RadioButton
          checked={isSelected}
          onChange={handleCheckboxChange}
          size="Small"
          tabIndex={-1}
          name={`${ctx.tableId}-selection`}
          accessibleName={t("TABLE_ROW_SELECTION")}
        />
      )}
    </div>
  );
}

// ── Actions Cell ────────────────────────────────────────────────────────────

function ActionsCell({
  actionsColumnIndex, isCellMode, isBottomEdge, stickyState,
  flexibleVisible, overflowActions, fixedVisible, hasOverflow,
  overflowMenuOpen, setOverflowMenuOpen, overflowOpener, setOverflowOpener,
  overflowButtonRef, t,
}: {
  actionsColumnIndex: number;
  isCellMode: boolean;
  isBottomEdge: boolean;
  stickyState: StickyStateClasses;
  flexibleVisible: React.ReactElement[];
  overflowActions: React.ReactElement[];
  fixedVisible: React.ReactElement[];
  hasOverflow: boolean;
  overflowMenuOpen: boolean;
  setOverflowMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  overflowOpener: HTMLElement | null;
  setOverflowOpener: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  overflowButtonRef: React.RefObject<ButtonRef | null>;
  t: TFunction;
}) {
  return (
    <div
      role="gridcell"
      aria-colindex={actionsColumnIndex + 1}
      aria-label={t("TABLE_ROW_ACTIONS")}
      data-cell-focusable="true"
      data-column-index={actionsColumnIndex}
      tabIndex={isCellMode ? -1 : undefined}
      className={cn(
        "flex items-center gap-1 px-2 py-1 min-h-[40px]",
        "outline-none focus:ring-2 focus:ring-ring focus:ring-inset",
        isBottomEdge && "rounded-br-lg",
        stickyScrollClasses(stickyState, isBottomEdge, "right"),
      )}
    >
      {flexibleVisible}
      {hasOverflow && (
        <>
          <Button
            ref={overflowButtonRef}
            design="SecondaryNeutral"
            size="Medium"
            icon={<OverflowIcon/>}
            iconOnly
            accessibleName="More actions"
            onClick={(e) => {
              e.originalEvent?.stopPropagation?.();
              setOverflowOpener(overflowButtonRef.current?.nativeElement ?? null);
              setOverflowMenuOpen((prev) => !prev);
            }}
          />
          <Menu
            open={overflowMenuOpen}
            opener={overflowOpener}
            onClose={() => setOverflowMenuOpen(false)}
          >
            {overflowActions.map((action, actionIdx) => {
              const props = action.props as TableRowActionProps;
              return (
                <MenuItem
                  key={props.text ?? `overflow-${actionIdx}`}
                  icon={props.icon}
                  text={props.text ?? ""}
                  onClick={() => props.onClick?.()}
                />
              );
            })}
          </Menu>
        </>
      )}
      {fixedVisible}
    </div>
  );
}

// ── Popin Area ──────────────────────────────────────────────────────────────

function PopinArea({
  ctx, popinCells, rowIndex, popinTabIndex, isInteractive, enterActive, isSelected,
}: {
  ctx: ReturnType<typeof useTableContext>;
  popinCells: React.ReactElement[];
  rowIndex: number;
  popinTabIndex: number | undefined;
  isInteractive: boolean;
  enterActive: boolean;
  isSelected: boolean;
}) {
  const start = ctx.hasSelectionColumn ? "2" : "1";
  // Popin must not span into the actions or navigated indicator columns
  const trailingCols = (ctx.hasActionsColumn ? 1 : 0) + (ctx.hasNavigatedColumn ? 1 : 0);
  const end = trailingCols > 0 ? `${-(trailingCols + 1)}` : "-1";

  return (
    <div
      role="gridcell"
      aria-colindex={ctx.popinColumnIndex + 1}
      data-cell-focusable="true"
      data-column-index={ctx.popinColumnIndex}
      data-row-index={rowIndex}
      data-popin-row="true"
      tabIndex={popinTabIndex}
      className={cn(
        "py-1 bg-clip-content",
        "outline-none focus:ring-2 focus:ring-ring focus:ring-inset",
        ctx.hasSelectionColumn ? "px-2" : "pl-4 pr-2",
        !enterActive && isSelected ? "bg-sapphire-brand-selected-background" : !enterActive && "bg-muted/20",
        !enterActive && isSelected && isInteractive && "group-hover/row:bg-sapphire-brand-selected-hover-background",
        !enterActive && !isSelected && isInteractive && "group-hover/row:bg-sapphire-neutral-hover-background-2",
        isInteractive && "group-focus/row:group-active/row:bg-sapphire-neutral-pressed-background",
        enterActive && "bg-sapphire-neutral-pressed-background",
      )}
      style={{ gridColumn: `${start} / ${end}` }}
    >
      {popinCells.map((cell, idx) => {
        const colIdx = ctx.popinColumnIndices[idx];
        const meta = ctx.columnsMeta[colIdx];
        const label = meta?.popinText ?? meta?.headerText;
        return (
          <div key={colIdx} className="flex items-center gap-2 py-1 text-sm">
            {label && (
              <span className="text-sapphire-text-tertiary font-medium">
                {label}:
              </span>
            )}
            <span>{(cell.props as Record<string, unknown>).children as React.ReactNode}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────

function TableRowInner(
  { children, rowKey, interactive, navigated, movable: _movable, className, "data-testid": dataTestId }: TableRowProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const ctx = useTableContext();
  const { t } = useTranslation("fx");
  const rowIndex = ctx.getRowIndexByKey(rowKey);
  const isSelected = ctx.isSelected(rowKey);
  const isAlternate = ctx.alternateRowColors && rowIndex % 2 === 1;
  const isLastRow = rowIndex === ctx.dataRowCount - 1;
  const isBottomEdge = isLastRow && !ctx.hasGrowingButton;
  const isInteractive = !!(interactive || ctx.selectionBehavior === "RowOnly");

  const { cells, actions, navigationAction } = useMemo(() => scanRowChildren(children), [children]);

  const isFocusedRow = ctx.focusedRowIndex === rowIndex && ctx.focusedCell == null;
  const isCellMode = ctx.navigationMode === "Cell";

  const [enterActive, setEnterActive] = useState(false);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      const rowElement = e.currentTarget as HTMLElement;
      const tabbableElements = getTabbableElements(rowElement);
      if (tabbableElements.some((el) => el === target || el.contains(target))) return;

      if (e.shiftKey && ctx.selectionMode === "Multi") {
        const anchor = ctx.getLastSelectedKey();
        if (anchor) { ctx.selectRange(anchor, rowKey); return; }
      }
      if (ctx.selectionMode !== "None" && ctx.selectionBehavior === "RowOnly") {
        ctx.toggleSelection(rowKey);
        return;
      }
      if (interactive && ctx.onRowClick) {
        ctx.onRowClick({ row: e.currentTarget, rowKey });
      }
    },
    [ctx, rowKey, interactive],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key !== "Enter" || e.repeat) return;
      const target = e.target as HTMLElement;
      if (!target.matches('[data-row-focusable="true"]')) return;
      if (!isInteractive) return;
      e.preventDefault();
      setEnterActive(true);
    },
    [isInteractive],
  );

  const handleKeyUp = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key !== "Enter") return;
      const target = e.target as HTMLElement;
      if (!target.matches('[data-row-focusable="true"]') || !enterActive) return;
      setEnterActive(false);
      if (ctx.selectionMode !== "None" && ctx.selectionBehavior === "RowOnly") {
        ctx.toggleSelection(rowKey);
        return;
      }
      if (interactive && ctx.onRowClick) {
        ctx.onRowClick({ row: e.currentTarget, rowKey });
      }
    },
    [ctx, rowKey, interactive, enterActive],
  );

  const handleCheckboxChange = useCallback(
    (detail: { checked: boolean; originalEvent: React.SyntheticEvent }) => {
      if (ctx.selectionMode === "Multi") {
        const nativeEvent = detail.originalEvent?.nativeEvent as MouseEvent | undefined;
        if (nativeEvent?.shiftKey) {
          const lastKey = ctx.getLastSelectedKey();
          if (lastKey) { ctx.selectRange(lastKey, rowKey); return; }
        }
      }
      ctx.toggleSelection(rowKey);
    },
    [ctx, rowKey],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      const rowElement = e.currentTarget as HTMLElement;
      const tabbableElements = getTabbableElements(rowElement);
      if (tabbableElements.some((el) => el === target || el.contains(target))) return;
      // If the click landed inside a cell that contains interactive elements,
      // don't steal focus to the row (e.g. clicking padding around a Select).
      const cell = target.closest<HTMLElement>('[data-cell-focusable="true"]');
      if (cell && tabbableElements.some((el) => cell.contains(el))) return;
      ctx.setMouseNavigating();
      ctx.navigateToRow(rowIndex);
      setTimeout(() => { rowElement.focus({ preventScroll: true }); }, 0);
    },
    [ctx, rowIndex],
  );

  // ── Derived data ────────────────────────────────────────────────────────

  const visibleCells = ctx.visibleColumnIndices.length > 0
    ? cells.filter((_cell, idx) => ctx.visibleColumnIndices.includes(idx))
    : cells;

  const popinCells = ctx.isPopinActive
    ? cells.filter((_cell, idx) => ctx.popinColumnIndices.includes(idx))
    : [];

  const [overflowMenuOpen, setOverflowMenuOpen] = useState(false);
  const [overflowOpener, setOverflowOpener] = useState<HTMLElement | null>(null);
  const overflowButtonRef = useRef<ButtonRef>(null);

  const { flexibleVisible, overflowActions, fixedVisible, hasOverflow } = useMemo(() => {
    const fixedActions: React.ReactElement[] = navigationAction ? [navigationAction] : [];
    const fixedCount = fixedActions.length;
    const totalCount = ctx.rowActionCount || (actions.length + fixedCount);
    const visibleFlexible = actions.filter((a) => !(a.props as TableRowActionProps).invisible);

    let maxFlexible = totalCount - fixedCount;
    let flexVisible: React.ReactElement[];
    let overflow: React.ReactElement[];

    if (maxFlexible < 1) {
      flexVisible = [];
      overflow = visibleFlexible;
    } else if (visibleFlexible.length <= maxFlexible) {
      flexVisible = actions;
      overflow = [];
    } else {
      maxFlexible -= 1;
      flexVisible = visibleFlexible.slice(0, maxFlexible);
      overflow = visibleFlexible.slice(maxFlexible);
    }

    const hasOvf = overflow.length > 0;
    const fixedVis = hasOvf ? fixedActions.slice(0, Math.max(0, totalCount - 1)) : fixedActions;

    return { flexibleVisible: flexVisible, overflowActions: overflow, fixedVisible: fixedVis, hasOverflow: hasOvf };
  }, [actions, navigationAction, ctx.rowActionCount]);

  const actionsColumnIndex = (ctx.hasSelectionColumn ? 1 : 0)
    + (ctx.visibleColumnIndices.length > 0 ? ctx.visibleColumnIndices.length : cells.length);

  const isFocusedPopinCell =
    ctx.focusedCell?.rowIndex === rowIndex && ctx.focusedCell?.columnIndex === ctx.popinColumnIndex;
  const popinTabIndex = isCellMode ? (isFocusedPopinCell ? 0 : -1) : undefined;

  const stickyState: StickyStateClasses = {
    isScroll: ctx.overflowMode === "Scroll",
    isAlternate,
    isInteractive,
    isSelected,
    enterActive,
  };

  // Find the first rowHeader cell among visible cells for aria-labelledby
  const rowHeaderIndex = useMemo(() => {
    return visibleCells.findIndex((cell) => (cell.props as Record<string, unknown>).rowHeader);
  }, [visibleCells]);
  const rowHeaderCellId = rowHeaderIndex !== -1 ? `${ctx.tableId}-row${rowIndex}-rowheader` : undefined;

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <div
      ref={ref}
      role="row"
      aria-rowindex={rowIndex + 2}
      aria-selected={ctx.selectionMode !== "None" ? isSelected : undefined}
      aria-current={navigated ? "true" : undefined}
      aria-labelledby={rowHeaderCellId}
      tabIndex={isFocusedRow ? 0 : -1}
      data-row-focusable="true"
      data-row-index={rowIndex}
      data-row-key={rowKey}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      className={cn(
        "group/row grid col-span-full border-b border-border bg-sapphire-canvas-primary",
        "outline-none focus:ring-2 focus:ring-ring focus:ring-inset",
        ctx.hasNavigatedColumn && "relative",
        className,
        isAlternate && "bg-accent/60",
        isInteractive && "cursor-pointer",
        isInteractive && "hover:bg-sapphire-neutral-hover-background-2",
        isInteractive && "focus:active:bg-sapphire-neutral-pressed-background",
        isSelected && !enterActive && "bg-sapphire-brand-selected-background",
        isSelected && !enterActive && isInteractive && "hover:bg-sapphire-brand-selected-hover-background",
        isSelected && isInteractive && "focus:active:bg-sapphire-neutral-pressed-background",
        enterActive && "bg-sapphire-neutral-pressed-background",
      )}
      style={{ gridTemplateColumns: "subgrid", gridColumn: "1 / -1" }}
      data-testid={dataTestId}
    >
      {ctx.hasSelectionColumn && (
        <SelectionCell
          ctx={ctx} isSelected={isSelected}
          isCellMode={isCellMode} isBottomEdge={isBottomEdge}
          stickyState={stickyState} handleCheckboxChange={handleCheckboxChange} t={t}
        />
      )}

      {visibleCells.map((cell, idx) => {
        const colIdx = ctx.visibleColumnIndices.length > 0 ? ctx.visibleColumnIndices[idx] : idx;
        return React.cloneElement(cell as React.ReactElement<Record<string, unknown>>, {
          key: `cell-${colIdx}`,
          "aria-colindex": (ctx.hasSelectionColumn ? 2 : 1) + idx,
          ...(idx === rowHeaderIndex ? { id: rowHeaderCellId } : {}),
          _columnIndex: colIdx,
          _navPosition: idx,
          _isLastRow: isBottomEdge,
        });
      })}

      {ctx.hasActionsColumn && (
        <ActionsCell
          actionsColumnIndex={actionsColumnIndex} isCellMode={isCellMode}
          isBottomEdge={isBottomEdge} stickyState={stickyState}
          flexibleVisible={flexibleVisible} overflowActions={overflowActions}
          fixedVisible={fixedVisible} hasOverflow={hasOverflow}
          overflowMenuOpen={overflowMenuOpen} setOverflowMenuOpen={setOverflowMenuOpen}
          overflowOpener={overflowOpener} setOverflowOpener={setOverflowOpener}
          overflowButtonRef={overflowButtonRef} t={t}
        />
      )}

      {popinCells.length > 0 && (
        <PopinArea
          ctx={ctx} popinCells={popinCells} rowIndex={rowIndex}
          popinTabIndex={popinTabIndex} isInteractive={isInteractive}
          enterActive={enterActive} isSelected={isSelected}
        />
      )}

      {ctx.hasNavigatedColumn && <div aria-hidden="true" />}
      {ctx.hasNavigatedColumn && navigated && (
        <div
          aria-hidden="true"
          className="absolute inset-y-0 end-0 w-[3px] bg-primary pointer-events-none group-focus/row:inset-y-1 group-focus/row:me-1"
        />
      )}
    </div>
  );
}

export const TableRow = React.forwardRef(TableRowInner);
TableRow.displayName = "TableRow";
(TableRow as unknown as { _tableRole: string })._tableRole = "Row";
