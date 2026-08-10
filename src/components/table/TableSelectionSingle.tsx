import React, { useImperativeHandle } from "react";
import type { TableSelectionSingleProps, TableSelectionSingleRef } from "../../types/table";

function TableSelectionSingleInner(
  _props: TableSelectionSingleProps,
  ref: React.ForwardedRef<TableSelectionSingleRef>,
) {
  useImperativeHandle(ref, () => ({
    getSelectedRow: () => undefined,
    isSelected: () => false,
    setSelected: () => {},
  }), []);

  return null;
}

export const TableSelectionSingle = React.forwardRef(TableSelectionSingleInner);
TableSelectionSingle.displayName = "TableSelectionSingle";
(TableSelectionSingle as unknown as { _tableRole: string })._tableRole = "SelectionSingle";
