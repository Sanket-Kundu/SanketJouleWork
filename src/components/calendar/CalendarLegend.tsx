import type { Ref } from "react";
import { cn } from "../../lib/utils";
import { CalendarLegendItemType } from "../../types/calendar";
import { CalendarLegendProps } from "../../types/calendar-legend";
import { CalendarLegendItem } from "./CalendarLegendItem";
import { useTranslation } from "react-i18next";

export function CalendarLegend({
      hideToday = false,
      hideSelectedDay = false,
      hideNonWorkingDay = false,
      hideWorkingDay = false,
      items = [],
      onLegendItemSelect,
      locale: _locale,
      className,
      ref,
      "data-testid": dataTestId,
    }: CalendarLegendProps & { ref?: Ref<HTMLDivElement> }) {
    const { t } = useTranslation("fx");

    const legendLabels: Record<string, string> = {
      [CalendarLegendItemType.Today]: t("CALENDAR_LEGEND_TODAY"),
      [CalendarLegendItemType.Selected]: t("CALENDAR_LEGEND_SELECTED"),
      [CalendarLegendItemType.Working]: t("CALENDAR_LEGEND_WORKING"),
      [CalendarLegendItemType.NonWorking]: t("CALENDAR_LEGEND_NONWORKING"),
    };

    // Default legend items
    const defaultItems = [
      {
        type: CalendarLegendItemType.Today,
        text: legendLabels[CalendarLegendItemType.Today],
        hidden: hideToday,
      },
      {
        type: CalendarLegendItemType.Selected,
        text: legendLabels[CalendarLegendItemType.Selected],
        hidden: hideSelectedDay,
      },
      {
        type: CalendarLegendItemType.Working,
        text: legendLabels[CalendarLegendItemType.Working],
        hidden: hideWorkingDay,
      },
      {
        type: CalendarLegendItemType.NonWorking,
        text: legendLabels[CalendarLegendItemType.NonWorking],
        hidden: hideNonWorkingDay,
      },
    ].filter((item) => !item.hidden);

    // Combine default and custom items
    const allItems = [...defaultItems, ...items];

    if (allItems.length === 0) {
      return null;
    }

    return (
      <div
        ref={ref}
        role="list"
        aria-label={t("CALENDAR_LEGEND")}
        className={cn(
          "p-3 bg-sapphire-card-bg border-t border-sapphire-border",
          "columns-2 sm:columns-3 gap-2",
          "w-full",
          className
        )}
        data-testid={dataTestId}
      >
        {allItems.map((item, index) => (
          <CalendarLegendItem
            key={`${item.type}-${index}`}
            type={item.type}
            text={item.text}
            onClick={onLegendItemSelect ? () => onLegendItemSelect({ type: item.type, text: item.text }) : undefined}
          />
        ))}
      </div>
    );
  }
