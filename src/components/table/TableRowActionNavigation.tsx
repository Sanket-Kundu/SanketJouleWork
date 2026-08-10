import React from "react";
import type { TableRowActionNavigationProps } from "../../types/table";
import type { ButtonRef } from "../../types/button";
import { Button } from "../button";
import { SlimArrowRightIcon } from "../../icons/SlimArrowRight";
import { useTranslation } from "react-i18next";

function TableRowActionNavigationInner(
  { invisible = false, onClick }: TableRowActionNavigationProps,
  ref: React.ForwardedRef<ButtonRef>,
) {
  const { t } = useTranslation("fx");

  if (invisible) {
    return <span className="w-8" aria-hidden="true" />;
  }

  return (
    <Button
      ref={ref}
      design="TertiaryNeutral"
      size="Small"
      icon={<SlimArrowRightIcon />}
      iconOnly
      onClick={onClick}
      accessibleName={t("TABLE_NAVIGATION")}
      tooltip={t("TABLE_NAVIGATION")}
    />
  );
}

export const TableRowActionNavigation = React.forwardRef(TableRowActionNavigationInner);
TableRowActionNavigation.displayName = "TableRowActionNavigation";
(TableRowActionNavigation as unknown as { _tableRole: string })._tableRole = "RowActionNavigation";
