import React, { Children, isValidElement } from "react";
import { cn } from "../../lib/utils";
import type { TableCellProps } from "../../types/table";
import { useTableContext } from "./TableContext";
import { getAlignmentClass } from "./table-utils";

function TableCellInner(
  { children, merged, rowHeader, horizontalAlign, className, _columnIndex, _navPosition, _isLastRow, "data-testid": dataTestId, ...rest }: TableCellProps & { _columnIndex?: number; _navPosition?: number; _isLastRow?: boolean },
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const ctx = useTableContext();

  // Fall back to the header cell's horizontalAlign if not set on this cell
  const effectiveAlign =
    horizontalAlign ??
    (_columnIndex != null ? ctx.columnsMeta[_columnIndex]?.horizontalAlign : undefined);

  const isFirstColumn = _columnIndex != null && _columnIndex === ctx.visibleColumnIndices[0];
  const isLastColumn = _columnIndex != null && _columnIndex === ctx.visibleColumnIndices[ctx.visibleColumnIndices.length - 1];
  const needsExtraLeftPad = isFirstColumn && !ctx.hasSelectionColumn;
  const needsExtraRightPad = isLastColumn && !ctx.hasActionsColumn;

  // Navigation column index uses sequential position for contiguous indices
  const selectionOffset = ctx.hasSelectionColumn ? 1 : 0;
  const navColumnIndex = _navPosition != null
    ? _navPosition + selectionOffset
    : undefined;

  // Only make cells focusable during keyboard (cell) navigation.
  // In row mode, omitting tabIndex prevents mouse clicks from focusing cells.
  const isCellMode = ctx.navigationMode === "Cell";

  const isTextOnly = Children.toArray(children).every((child) => !isValidElement(child));

  return (
    <div
      ref={ref}
      role={rowHeader ? "rowheader" : "gridcell"}
      tabIndex={isCellMode ? -1 : undefined}
      data-cell-focusable="true"
      data-column-index={navColumnIndex}
      className={cn(
        "flex items-center px-2 py-1 text-sm font-normal text-foreground",
        "min-h-[40px]",
        "outline-none focus:ring-2 focus:ring-ring focus:ring-inset",
        needsExtraLeftPad && "pl-4",
        needsExtraRightPad && "pr-4",
        _isLastRow && needsExtraLeftPad && "rounded-bl-lg",
        _isLastRow && needsExtraRightPad && "rounded-br-lg",
        merged && "border-t-0",
        getAlignmentClass(effectiveAlign as string),
        className,
      )}
      data-testid={dataTestId}
      {...rest}
    >
      {isTextOnly
        ? <span className={cn("truncate", effectiveAlign ? undefined : "text-start")}>{children}</span>
        : children}
    </div>
  );
}

export const TableCell = React.forwardRef(TableCellInner);
TableCell.displayName = "TableCell";
(TableCell as unknown as { _tableRole: string })._tableRole = "Cell";
