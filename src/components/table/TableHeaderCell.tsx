import React from "react";
import { cn } from "../../lib/utils";
import type { TableHeaderCellProps } from "../../types/table";
import { SortAscendingIcon, SortDescendingIcon } from "../../icons";
import { useTableContext } from "./TableContext";
import { getAlignmentClass } from "./table-utils";

function TableHeaderCellInner(
  {
    children,
    width: _width,
    minWidth: _minWidth,
    importance: _importance,
    popinText: _popinText,
    sortIndicator,
    popinHidden: _popinHidden,
    horizontalAlign,
    action,
    className,
    _columnIndex,
    _navPosition,
    "data-testid": dataTestId,
    ...rest
  }: TableHeaderCellProps & { _columnIndex?: number; _navPosition?: number },
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const ctx = useTableContext();

  const isFirstColumn = _columnIndex != null && _columnIndex === ctx.visibleColumnIndices[0];
  const isLastColumn = _columnIndex != null && _columnIndex === ctx.visibleColumnIndices[ctx.visibleColumnIndices.length - 1];
  const needsExtraLeftPad = isFirstColumn && !ctx.hasSelectionColumn;
  const needsExtraRightPad = isLastColumn && !ctx.hasActionsColumn;

  // Navigation column index uses sequential position for contiguous indices
  const selectionOffset = ctx.hasSelectionColumn ? 1 : 0;
  const navColumnIndex = _navPosition != null
    ? _navPosition + selectionOffset
    : undefined;

  const ariaSortMap = { Ascending: "ascending", Descending: "descending" } as const;
  const ariaSortValue = sortIndicator
    ? (ariaSortMap[sortIndicator as keyof typeof ariaSortMap] ?? "none")
    : undefined;

  const isCellMode = ctx.navigationMode === "Cell";

  return (
    <div
      ref={ref}
      role="columnheader"
      aria-sort={ariaSortValue}
      tabIndex={isCellMode ? -1 : undefined}
      data-cell-focusable="true"
      data-column-index={navColumnIndex}
      className={cn(
        "flex items-center gap-2 px-2 py-1 font-semibold text-foreground text-sm",
        "min-h-[40px]",
        "outline-none focus:ring-2 focus:ring-ring focus:ring-inset",
        needsExtraLeftPad && "pl-4",
        needsExtraLeftPad && !ctx.hasToolbar && "rounded-tl-lg",
        needsExtraRightPad && "pr-4",
        needsExtraRightPad && !ctx.hasToolbar && "rounded-tr-lg",
        getAlignmentClass(horizontalAlign as string),
        className,
      )}
      data-testid={dataTestId}
      {...rest}
    >
      {action}
      <span className="truncate">{children}</span>
      {sortIndicator && sortIndicator !== "None" && (
        sortIndicator === "Ascending"
          ? <SortAscendingIcon className="h-4 w-4" aria-hidden="true" />
          : <SortDescendingIcon className="h-4 w-4" aria-hidden="true" />
      )}
    </div>
  );
}

export const TableHeaderCell = React.forwardRef(TableHeaderCellInner);
TableHeaderCell.displayName = "TableHeaderCell";
(TableHeaderCell as unknown as { _tableRole: string })._tableRole = "HeaderCell";
