import React, { useCallback } from "react";
import { cn } from "../../lib/utils";
import type { TableHeaderRowProps } from "../../types/table";
import { CheckBox } from "../checkbox";
import { getTabbableElements } from "../list/utils/tabbable";
import { useTranslation } from "react-i18next";
import { useTableContext } from "./TableContext";

function TableHeaderRowInner(
  { children, sticky, className, style, "data-testid": dataTestId }: TableHeaderRowProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const ctx = useTableContext();
  const { t } = useTranslation("fx");

  const { headerSelector, deselectAll, areAllSelected, selectAll } = ctx;

  const handleHeaderCheckbox = useCallback(() => {
    if (headerSelector === "ClearAll") {
      deselectAll();
    } else if (areAllSelected()) {
      deselectAll();
    } else {
      selectAll();
    }
  }, [headerSelector, deselectAll, areAllSelected, selectAll]);

  const isInteractiveTarget = useCallback(
    (target: HTMLElement, rowElement: HTMLElement) => {
      if (target.closest('input, button, a, [role="checkbox"], [role="radio"]')) return true;
      const tabbableElements = getTabbableElements(rowElement);
      return tabbableElements.some((el) => el === target || el.contains(target));
    },
    [],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      const rowElement = e.currentTarget as HTMLElement;
      if (isInteractiveTarget(target, rowElement)) return;
      ctx.setMouseNavigating();
      ctx.navigateToRow(-1);
      setTimeout(() => {
        rowElement.focus({ preventScroll: true });
      }, 0);
    },
    [ctx, isInteractiveTarget],
  );

  const allSelected = ctx.selectionMode === "Multi" && ctx.areAllSelected() && ctx.rowKeys.length > 0;

  const isFocusedRow = ctx.focusedRowIndex === -1 && ctx.focusedCell == null;
  const isCellMode = ctx.navigationMode === "Cell";

  // 1-based aria-colindex for the actions column header (after selection + visible data columns)
  const visibleDataCount = ctx.visibleColumnIndices.length > 0 ? ctx.visibleColumnIndices.length : ctx.columnCount;
  const actionsAriaColIndex = (ctx.hasSelectionColumn ? 1 : 0) + visibleDataCount + 1;

  return (
    <div
      ref={ref}
      role="row"
      aria-rowindex={1}
      tabIndex={isFocusedRow ? 0 : -1}
      data-header-row="true"
      data-row-focusable="true"
      onMouseDown={handleMouseDown}
      className={cn(
        "group/row grid col-span-full border-b border-border bg-sapphire-canvas-primary",
        ctx.hasToolbar && "border-t",
        !ctx.hasToolbar && "rounded-t-lg",
        "outline-none focus:ring-2 focus:ring-ring focus:ring-inset",
        sticky && "sticky z-10",
        className,
      )}
      style={{
        gridTemplateColumns: "subgrid",
        gridColumn: "1 / -1",
        ...style,
      }}
      data-testid={dataTestId}
    >
      {/* Selection column header */}
      {ctx.hasSelectionColumn && (
        <div
          role="columnheader"
          aria-colindex={1}
          aria-description={
            ctx.selectionMode === "Multi"
              ? (allSelected ? t("TABLE_SELECT_ALL_CHECKED") : t("TABLE_SELECT_ALL_NOT_CHECKED"))
              : undefined
          }
          data-cell-focusable="true"
          data-column-index={0}
          tabIndex={isCellMode ? -1 : undefined}
          className={cn(
            "flex items-center justify-center min-h-[40px]",
            "outline-none focus:ring-2 focus:ring-ring focus:ring-inset",
            !ctx.hasToolbar && "rounded-tl-lg",
            ctx.overflowMode === "Scroll" && "sticky left-0 z-[2] bg-sapphire-canvas-primary",
            ctx.overflowMode === "Scroll" && (ctx.hasToolbar
              ? "group-focus/row:[clip-path:inset(2px)]"
              : "group-focus/row:[clip-path:inset(2px_round_8px_0_0_0)]"),
          )}
        >
          {ctx.selectionMode === "Single" && (
            <span className="sr-only">{t("TABLE_SELECTION")}</span>
          )}
          {ctx.selectionMode === "Multi" && (
            <CheckBox
              checked={allSelected}
              onChange={handleHeaderCheckbox}
              size="Small"
              tabIndex={-1}
              accessibleName={allSelected ? t("TABLE_DESELECT_ALL_ROWS") : t("TABLE_SELECT_ALL_ROWS")}
            />
          )}
        </div>
      )}

      {/* Visible header cells */}
      {React.Children.toArray(children)
        .filter(React.isValidElement)
        .map((child, origIdx) => ({ child, origIdx }))
        .filter(({ origIdx }) =>
          ctx.visibleColumnIndices.length === 0 || ctx.visibleColumnIndices.includes(origIdx),
        )
        .map(({ child, origIdx }, idx) =>
          React.cloneElement(child as React.ReactElement<Record<string, unknown>>, {
            key: `col-${origIdx}`,
            "aria-colindex": (ctx.hasSelectionColumn ? 2 : 1) + idx,
            _columnIndex: origIdx,
            _navPosition: idx,
          }),
        )}

      {/* Actions column header */}
      {ctx.hasActionsColumn && (
        <div
          role="columnheader"
          aria-colindex={actionsAriaColIndex}
          data-cell-focusable="true"
          data-column-index={(ctx.hasSelectionColumn ? 1 : 0) + visibleDataCount}
          tabIndex={isCellMode ? -1 : undefined}
          className={cn(
            "flex items-center px-2 py-1 min-h-[40px]",
            "outline-none focus:ring-2 focus:ring-ring focus:ring-inset",
            !ctx.hasToolbar && "rounded-tr-lg",
            ctx.overflowMode === "Scroll" && "sticky right-0 z-[2] bg-sapphire-canvas-primary",
            ctx.overflowMode === "Scroll" && (ctx.hasToolbar
              ? "group-focus/row:[clip-path:inset(2px)]"
              : "group-focus/row:[clip-path:inset(2px_round_0_8px_0_0)]"),
          )}
        >
          <span className="sr-only">{t("TABLE_ROW_ACTIONS")}</span>
        </div>
      )}

      {/* Navigated indicator column header (decoration only) */}
      {ctx.hasNavigatedColumn && (
        <div aria-hidden="true" />
      )}
    </div>
  );
}

export const TableHeaderRow = React.forwardRef(TableHeaderRowInner);
TableHeaderRow.displayName = "TableHeaderRow";
(TableHeaderRow as unknown as { _tableRole: string })._tableRole = "HeaderRow";
