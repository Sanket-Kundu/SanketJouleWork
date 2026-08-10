import { useRef, useCallback } from "react";
import type { TableHeaderCellActionAIProps } from "../../types/table";
import type { IconRef, IconClickDetail } from "../../types/icon";
import { AiIcon } from "../../icons/Ai";
import { IconMode } from "../../types/icon";
import { useTranslation } from "react-i18next";

export function TableHeaderCellActionAI({ onClick }: TableHeaderCellActionAIProps) {
  const iconRef = useRef<IconRef>(null);
  const { t } = useTranslation("fx");

  const handleClick = useCallback(
    (detail: IconClickDetail) => {
      const el = iconRef.current?.nativeElement;
      if (onClick && el) {
        detail.originalEvent.stopPropagation();
        onClick({ targetRef: el });
      }
    },
    [onClick],
  );

  return (
    <AiIcon
      ref={iconRef}
      mode={IconMode.Interactive}
      accessibleName={t("TABLE_AI_GENERATED")}
      showTooltip
      onClick={handleClick}
      className="h-4 w-4 text-sapphire-brand-foreground"
    />
  );
}

TableHeaderCellActionAI.displayName = "TableHeaderCellActionAI";
