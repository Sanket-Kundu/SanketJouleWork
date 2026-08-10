import React, { useImperativeHandle } from "react";
import type { TableSelectionMultiProps, TableSelectionMultiRef } from "../../types/table";

// This is a renderless config component — it doesn't render any DOM.
// The Table reads its props and uses them to configure selection behavior.
function TableSelectionMultiInner(
  _props: TableSelectionMultiProps,
  ref: React.ForwardedRef<TableSelectionMultiRef>,
) {
  // Imperative methods are wired by Table via context
  useImperativeHandle(ref, () => ({
    getSelectedRows: () => [],
    areAllRowsSelected: () => false,
    getSelectedAsSet: () => new Set<string>(),
    setSelectedAsSet: () => {},
    isSelected: () => false,
    setSelected: () => {},
  }), []);

  return null;
}

export const TableSelectionMulti = React.forwardRef(TableSelectionMultiInner);
TableSelectionMulti.displayName = "TableSelectionMulti";
(TableSelectionMulti as unknown as { _tableRole: string })._tableRole = "SelectionMulti";
