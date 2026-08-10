import { CalendarLegendItemType } from "./calendar";

/**
 * CalendarLegendItem - Individual legend item component
 */
export interface CalendarLegendItemProps {
  /** Type of the legend item (determines color) */
  type: CalendarLegendItemType;

  /** Text label displayed next to the color box */
  text?: string;

  /** Optional click handler */
  onClick?: () => void;

  /** Additional CSS classes */
  className?: string;

  /** Forwarded to the rendered legend item element for test selectors. */
  "data-testid"?: string;
}

/**
 * CalendarLegend - Container for legend items
 */
export interface CalendarLegendProps {
  /** Hide the "Today" item in the legend */
  hideToday?: boolean;

  /** Hide the "Selected Day" item in the legend */
  hideSelectedDay?: boolean;

  /** Hide the "Non-Working Day" item in the legend */
  hideNonWorkingDay?: boolean;

  /** Hide the "Working Day" item in the legend */
  hideWorkingDay?: boolean;

  /** Custom legend items */
  items?: Array<{ type: CalendarLegendItemType; text: string }>;

  /** Called when a legend item is clicked */
  onLegendItemSelect?: (detail: { type: CalendarLegendItemType; text: string }) => void;

  /** Locale for default item labels */
  locale?: string;

  /** Additional CSS classes */
  className?: string;

  /** Forwarded to the legend root element for test selectors. */
  "data-testid"?: string;
}
