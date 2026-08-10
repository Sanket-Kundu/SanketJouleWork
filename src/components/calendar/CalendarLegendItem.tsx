import type { Ref } from "react";
import { cn, cva } from "../../lib/utils";
import { CalendarLegendItemType } from "../../types/calendar";
import { CalendarLegendItemProps } from "../../types/calendar-legend";

// Legend item color mapping to Tailwind classes
const legendItemBoxVariants = cva(
  "h-4 w-4 border border-sapphire-border flex items-center justify-center rounded-sm",
  {
    variants: {
      type: {
        [CalendarLegendItemType.None]: "",
        [CalendarLegendItemType.Today]: "border-2 border-sapphire-border-accent bg-transparent",
        [CalendarLegendItemType.Selected]: "bg-sapphire-brand-hover-background",
        [CalendarLegendItemType.Working]: "bg-sapphire-positive-bg",
        [CalendarLegendItemType.NonWorking]: "bg-sapphire-negative-bg",
        [CalendarLegendItemType.Type01]: "bg-blue-500",
        [CalendarLegendItemType.Type02]: "bg-green-500",
        [CalendarLegendItemType.Type03]: "bg-yellow-500",
        [CalendarLegendItemType.Type04]: "bg-red-500",
        [CalendarLegendItemType.Type05]: "bg-purple-500",
        [CalendarLegendItemType.Type06]: "bg-pink-500",
        [CalendarLegendItemType.Type07]: "bg-indigo-500",
        [CalendarLegendItemType.Type08]: "bg-cyan-500",
        [CalendarLegendItemType.Type09]: "bg-teal-500",
        [CalendarLegendItemType.Type10]: "bg-orange-500",
        [CalendarLegendItemType.Type11]: "bg-lime-500",
        [CalendarLegendItemType.Type12]: "bg-emerald-500",
        [CalendarLegendItemType.Type13]: "bg-sky-500",
        [CalendarLegendItemType.Type14]: "bg-violet-500",
        [CalendarLegendItemType.Type15]: "bg-fuchsia-500",
        [CalendarLegendItemType.Type16]: "bg-rose-500",
        [CalendarLegendItemType.Type17]: "bg-amber-500",
        [CalendarLegendItemType.Type18]: "bg-slate-500",
        [CalendarLegendItemType.Type19]: "bg-zinc-500",
        [CalendarLegendItemType.Type20]: "bg-neutral-500",
      },
    },
    defaultVariants: {
      type: CalendarLegendItemType.None,
    },
  }
);

/**
 * CalendarLegendItem - Individual legend item displaying a color box and label
 */
export function CalendarLegendItem({ type, text, onClick, className, ref }: CalendarLegendItemProps & { ref?: Ref<HTMLDivElement> }) {
    const isSelected = type === CalendarLegendItemType.Selected;

    return (
      <div
        ref={ref}
        role="listitem"
        tabIndex={-1}
        onClick={onClick}
        className={cn(
          "flex items-center gap-2 cursor-pointer",
          "hover:bg-sapphire-bg-secondary rounded-sm p-1 transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-sapphire-ring focus:ring-offset-1",
          className
        )}
      >
        <div className={cn(legendItemBoxVariants({ type }))}>
          {isSelected && (
            <div className="h-1.5 w-1.5 rounded-full bg-sapphire-text-on-surface" />
          )}
        </div>
        <span className="text-sm text-sapphire-text truncate">{text}</span>
      </div>
    );
  }
