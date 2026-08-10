import React from "react";
import type { TableRowActionProps } from "../../types/table";
import { Button } from "../button";

function TableRowActionInner(
  { icon, text, invisible = false, onClick }: TableRowActionProps,
  _ref: React.ForwardedRef<HTMLButtonElement>,
) {
  if (invisible) {
    return <span className="w-8" aria-hidden="true" />;
  }

  return (
    <Button
      design="SecondaryNeutral"
      size="Medium"
      icon={icon}
      iconOnly={!!icon}
      onClick={onClick}
      accessibleName={text}
      tooltip={icon ? text : undefined}
    >
      {!icon && text ? text : undefined}
    </Button>
  );
}

export const TableRowAction = React.forwardRef(TableRowActionInner);
TableRowAction.displayName = "TableRowAction";
(TableRowAction as unknown as { _tableRole: string })._tableRole = "RowAction";
