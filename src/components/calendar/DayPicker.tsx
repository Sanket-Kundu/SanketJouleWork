import React, { useRef, useCallback, useEffect, type Ref } from "react";
import { cn, cva } from "../../lib/utils";
import {
  getMonthDays,
  getWeekNumber,
  isSameMonthUtil,
  isToday,
  format,
  formatDateToISO,
} from "../../lib/date-utils";
import {
  CalendarWeekNumbering,
  CalendarLegendItemType,
} from "../../types/calendar";
import { useTranslation } from "react-i18next";
import getCachedLocaleDataInstance from "@ui5/webcomponents-localization/dist/getCachedLocaleDataInstance.js";
import { getLocale, getWeekStartDay } from "../../lib/locale-utils";
import { useEnsureCldr } from "../../i18n";

/**
 * Day cell button variants — controls the inner button appearance.
 * Range highlighting is handled separately by a wrapper element.
 */
/**
 * Outer 32×32 container — receives keyboard focus.
 * The inner 24×24 element carries today-border / selected-bg via dayCellInnerVariants.
 */
const dayCellVariants = cva(
  "relative z-[1] w-8 h-8 rounded text-sm font-normal transition-colors focus:outline-none focus:[box-shadow:inset_0_0_0_2px_var(--border-focus)] flex items-center justify-center",
  {
    variants: {
      variant: {
        default: "text-foreground",
        selected: "",
        rangeStart: "",
        rangeEnd: "",
        rangeBetween: "",
        today: "",
        outside: "text-sapphire-text-tertiary",
        disabled: "text-sapphire-text-tertiary opacity-40 cursor-not-allowed",
      },
      specialType: {
        none: "",
        Type01: "border-b-2 border-b-blue-500",
        Type02: "border-b-2 border-b-green-500",
        Type03: "border-b-2 border-b-yellow-500",
        Type04: "border-b-2 border-b-red-500",
        Type05: "border-b-2 border-b-purple-500",
        Type06: "border-b-2 border-b-pink-500",
        Type07: "border-b-2 border-b-indigo-500",
        Type08: "border-b-2 border-b-cyan-500",
        Type09: "border-b-2 border-b-teal-500",
        Type10: "border-b-2 border-b-orange-500",
        Type11: "border-b-2 border-b-lime-500",
        Type12: "border-b-2 border-b-emerald-500",
        Type13: "border-b-2 border-b-sky-500",
        Type14: "border-b-2 border-b-violet-500",
        Type15: "border-b-2 border-b-fuchsia-500",
        Type16: "border-b-2 border-b-rose-500",
        Type17: "border-b-2 border-b-amber-500",
        Type18: "border-b-2 border-b-slate-500",
        Type19: "border-b-2 border-b-zinc-500",
        Type20: "border-b-2 border-b-neutral-500",
        Today: "font-bold",
        Selected: "",
        Working: "bg-sapphire-positive-bg",
        NonWorking: "bg-sapphire-negative-bg",
      },
    },
    defaultVariants: {
      variant: "default",
      specialType: "none",
    },
  },
);

type DayCellVariant = "default" | "selected" | "rangeStart" | "rangeEnd" | "rangeBetween" | "today" | "outside" | "disabled";
type DayCellSpecialType = "none" | "Type01" | "Type02" | "Type03" | "Type04" | "Type05" | "Type06" | "Type07" | "Type08" | "Type09" | "Type10" | "Type11" | "Type12" | "Type13" | "Type14" | "Type15" | "Type16" | "Type17" | "Type18" | "Type19" | "Type20" | "Today" | "Selected" | "Working" | "NonWorking";

/**
 * Inner 24×24 element — carries today border, selected background, hover, etc.
 */
const dayCellInnerVariants = cva(
  "w-6 h-6 rounded flex items-center justify-center transition-colors",
  {
    variants: {
      variant: {
        default: "hover:bg-sapphire-bg-secondary",
        selected:
          "bg-sapphire-brand-hover-background text-sapphire-text-on-surface hover:bg-sapphire-brand-hover-background hover:text-sapphire-text-on-surface",
        rangeStart: "bg-sapphire-brand-hover-background text-sapphire-text-on-surface hover:bg-sapphire-brand-hover-background",
        rangeEnd: "bg-sapphire-brand-hover-background text-sapphire-text-on-surface hover:bg-sapphire-brand-hover-background",
        rangeBetween:
          "border border-sapphire-border-accent bg-sapphire-brand-toggle-background text-sapphire-text hover:bg-sapphire-brand-toggle-background",
        today: "rounded-sm border border-sapphire-border-accent text-sapphire-text-accent font-semibold",
        outside: "",
        disabled: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

interface DayPickerProps {
  /** Currently displayed month */
  currentMonth: Date;

  /** Currently focused date */
  focusedDate: Date;

  /** When true, focus the focused cell on mount (used inside DatePicker popover) */
  autoFocus?: boolean;

  /** Check if a date is selected */
  isDateSelected: (date: Date) => boolean;

  /** Check if a date is disabled */
  isDateDisabled: (date: Date) => boolean;

  /** Check if a date is the start of a range */
  isRangeStart: (date: Date) => boolean;

  /** Check if a date is the end of a range */
  isRangeEnd: (date: Date) => boolean;

  /** Check if a date is between a range */
  isDateBetweenRange: (date: Date) => boolean;

  /** Whether a range selection is in progress (1 date selected, waiting for second) */
  isRangeSelectionInProgress?: boolean;

  /** Get special date info for a date */
  getSpecialDate: (
    date: Date,
  ) => { type: CalendarLegendItemType; tooltip?: string } | null;

  /** Callback when a date is selected */
  onSelectDate: (date: Date) => void;

  /** Callback when focus changes */
  onFocusChange: (date: Date) => void;

  /** Callback when a date is hovered (for range preview) */
  onHoverDate?: (date: Date | null) => void;

  /** Show week numbers */
  showWeekNumbers?: boolean;

  /** Week numbering scheme */
  weekNumbering?: CalendarWeekNumbering;

  /** First day of the week: 0=Sunday, 1=Monday, …, 6=Saturday (default: 1) */
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;

  /** Locale code (e.g., 'en-US', 'ja-JP') */
  locale?: string;

  /** Additional CSS classes */
  className?: string;
}

const FALLBACK_WIDE_DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const FALLBACK_FIRST_DAY_OF_WEEK = 1; // Monday
const FALLBACK_WIDE_MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function DayPicker({
      currentMonth,
      focusedDate,
      autoFocus = false,
      isDateSelected,
      isDateDisabled,
      isRangeStart,
      isRangeEnd,
      isDateBetweenRange,
      isRangeSelectionInProgress = false,
      getSpecialDate,
      onSelectDate,
      onFocusChange,
      onHoverDate,
      showWeekNumbers = false,
      weekNumbering,
      firstDayOfWeek,
      locale,
      className,
      ref,
    }: DayPickerProps & { ref?: Ref<HTMLDivElement> }) {
    const { t } = useTranslation("fx");
    const cldrReady = useEnsureCldr(locale);

    // Generate weekday names from CLDR data (skeleton shown while loading).
    // Resolve the effective first day of the week:
    // explicit prop wins; otherwise derive from CLDR once loaded; fall back to 0 (Sunday)
    const effectiveFirstDay = React.useMemo(() => {
      if (firstDayOfWeek !== undefined) return firstDayOfWeek;
      if (cldrReady) return getWeekStartDay(locale);
      return FALLBACK_FIRST_DAY_OF_WEEK;
    }, [firstDayOfWeek, cldrReady, locale]);

    const days = getMonthDays(currentMonth, effectiveFirstDay);

    // Generate weekday names from CLDR data (blank while loading to avoid English flash)
    const weekDays = React.useMemo(() => {
      if (!cldrReady) return null;
      const localeData = getCachedLocaleDataInstance(getLocale(locale));
      const allDays = localeData.getDaysStandAlone("abbreviated");
      // Rotate so the effective first day of week appears first
      const start = ((effectiveFirstDay % 7) + 7) % 7;
      return [...allDays.slice(start), ...allDays.slice(0, start)];
    }, [locale, cldrReady, effectiveFirstDay]);

    // Pre-compute wide names for aria-labels (one lookup per locale change, not per cell).
    // English fallback reserves layout space before CLDR is ready.
    const { wideDays, wideMonths } = React.useMemo(() => {
      if (!cldrReady) return {
        wideDays:   FALLBACK_WIDE_DAYS,
        wideMonths: FALLBACK_WIDE_MONTHS,
      };
      const localeData = getCachedLocaleDataInstance(getLocale(locale));
      return {
        wideDays:   localeData.getDaysStandAlone("wide"),
        wideMonths: localeData.getMonthsStandAlone("wide"),
      };
    }, [locale, cldrReady]);

    const gridRef = useRef<HTMLDivElement>(null);
    const focusedCellRef = useRef<HTMLDivElement>(null);
    const isMountedRef = useRef(false);

    // Auto-focus the focused date when the cell node is (re-)mounted after
    // a re-render (e.g. variant change on range start). Skip the very first mount to avoid
    // stealing focus from whatever triggered the calendar to open.
    const setFocusedCellRef = useCallback((node: HTMLDivElement | null) => {
      focusedCellRef.current = node;
      if (node && isMountedRef.current) {
        node.focus({ preventScroll: true });
      }
    }, []);

    // Re-focus when focusedDate changes (e.g. keyboard navigation).
    // On mount this also fires but may silently fail if inside a popover
    // that hasn't been promoted to the top layer yet — autoFocus handles that.
    useEffect(() => {
      if (focusedCellRef.current) {
        focusedCellRef.current.focus({ preventScroll: true });
      }
    }, [focusedDate]);

    useEffect(() => {
      isMountedRef.current = true;
    }, []);

    // When autoFocus is true (DatePicker popover), retry focus after a rAF
    // so the popover has been promoted to the top layer via showPopover().
    useEffect(() => {
      if (!autoFocus) return;
      const rafId = requestAnimationFrame(() => {
        focusedCellRef.current?.focus({ preventScroll: true });
      });
      return () => cancelAnimationFrame(rafId);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Handle keyboard navigation
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent, date: Date) => {
        let newDate: Date | null = null;
        const currentDate = new Date(date);

        switch (e.key) {
          case "ArrowLeft":
            e.preventDefault();
            e.stopPropagation();
            currentDate.setDate(currentDate.getDate() - 1);
            newDate = currentDate;
            break;
          case "ArrowRight":
            e.preventDefault();
            e.stopPropagation();
            currentDate.setDate(currentDate.getDate() + 1);
            newDate = currentDate;
            break;
          case "ArrowUp":
            e.preventDefault();
            e.stopPropagation();
            currentDate.setDate(currentDate.getDate() - 7);
            newDate = currentDate;
            break;
          case "ArrowDown":
            e.preventDefault();
            e.stopPropagation();
            currentDate.setDate(currentDate.getDate() + 7);
            newDate = currentDate;
            break;
          case "Home":
            e.preventDefault();
            if (e.ctrlKey) {
              // First day of month
              newDate = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                1,
              );
            } else {
              // First day of week (relative to effectiveFirstDay)
              const dayOfWeek = currentDate.getDay();
              const diff = (dayOfWeek - effectiveFirstDay + 7) % 7;
              currentDate.setDate(currentDate.getDate() - diff);
              newDate = currentDate;
            }
            break;
          case "End":
            e.preventDefault();
            if (e.ctrlKey) {
              // Last day of month
              newDate = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() + 1,
                0,
              );
            } else {
              // Last day of week (relative to effectiveFirstDay)
              const dayOfWeek = currentDate.getDay();
              const diff = (effectiveFirstDay + 6 - dayOfWeek + 7) % 7;
              currentDate.setDate(currentDate.getDate() + diff);
              newDate = currentDate;
            }
            break;
          case "PageUp":
            e.preventDefault();
            if (e.shiftKey && e.ctrlKey) {
              // -10 years
              currentDate.setFullYear(currentDate.getFullYear() - 10);
            } else if (e.shiftKey) {
              // -1 year
              currentDate.setFullYear(currentDate.getFullYear() - 1);
            } else {
              // -1 month
              currentDate.setMonth(currentDate.getMonth() - 1);
            }
            newDate = currentDate;
            break;
          case "PageDown":
            e.preventDefault();
            if (e.shiftKey && e.ctrlKey) {
              // +10 years
              currentDate.setFullYear(currentDate.getFullYear() + 10);
            } else if (e.shiftKey) {
              // +1 year
              currentDate.setFullYear(currentDate.getFullYear() + 1);
            } else {
              // +1 month
              currentDate.setMonth(currentDate.getMonth() + 1);
            }
            newDate = currentDate;
            break;
          case "Enter":
          case " ":
            e.preventDefault();
            onSelectDate(date);
            return;
        }

        if (newDate && !isDateDisabled(newDate)) {
          onFocusChange(newDate);
          // Update hover preview during keyboard navigation in range mode
          if (isRangeSelectionInProgress && onHoverDate) {
            onHoverDate(newDate);
          }
        }
      },
      [isDateDisabled, onSelectDate, onFocusChange, isRangeSelectionInProgress, onHoverDate, effectiveFirstDay],
    );

    // Handle mouseover for range hover preview
    const handleMouseOver = useCallback(
      (date: Date) => {
        if (isRangeSelectionInProgress && onHoverDate) {
          onHoverDate(date);
        }
      },
      [isRangeSelectionInProgress, onHoverDate],
    );

    // Clear hover when mouse leaves the grid
    const handleMouseLeave = useCallback(() => {
      if (isRangeSelectionInProgress && onHoverDate) {
        onHoverDate(null);
      }
    }, [isRangeSelectionInProgress, onHoverDate]);

    // Get variant for a day cell
    const getDayCellVariant = (date: Date): string => {
      if (isDateDisabled(date)) return "disabled";
      const isStart = isRangeStart(date);
      const isEnd = isRangeEnd(date);
      // Single-day range: both start and end — keep fully rounded
      if (isStart && isEnd) return "selected";
      if (isStart) return "rangeStart";
      if (isEnd) return "rangeEnd";
      if (isDateBetweenRange(date)) return "rangeBetween";
      if (isDateSelected(date)) return "selected";
      if (!isSameMonthUtil(date, currentMonth)) return "outside";
      if (isToday(date)) return "today";
      return "default";
    };

    // Get special type for a day cell
    const getDayCellSpecialType = (date: Date) => {
      const special = getSpecialDate(date);
      return special?.type || CalendarLegendItemType.None;
    };

    // Get week numbers for each row
    const getWeekNumbers = () => {
      if (!showWeekNumbers) return [];
      const weeks: number[] = [];
      for (let i = 0; i < days.length; i += 7) {
        weeks.push(getWeekNumber(days[i], weekNumbering));
      }
      return weeks;
    };

    /**
     * Determine range-strip wrapper classes for the cell.
     *
     * UI5 Horizon draws a continuous selection background strip behind
     * all cells in a range. We replicate this using a wrapper div with
     * a ::before pseudo-element that extends into the grid gap on the
     * appropriate side(s).
     *
     * - rangeStart: strip extends to the right (into the gap toward the next cell)
     * - rangeEnd: strip extends to the left (into the gap from the previous cell)
     * - rangeBetween: strip extends both left and right
     */
    const getRangeStripClass = (date: Date, idx: number): string | null => {
      const isStart = isRangeStart(date);
      const isEnd = isRangeEnd(date);
      const isBetween = isDateBetweenRange(date);

      if (!isStart && !isEnd && !isBetween) return null;

      // Check position in the 7-column grid row
      const colIdx = idx % 7;
      const isFirstCol = colIdx === 0;
      const isLastCol = colIdx === 6;

      if (isStart && isEnd) {
        // Single-day range — no strip
        return null;
      }

      if (isStart) {
        // Extend right unless last column
        return isLastCol ? null : "range-strip range-strip-right";
      }
      if (isEnd) {
        // Extend left unless first column
        return isFirstCol ? null : "range-strip range-strip-left";
      }

      // Between — extend both sides, clipped at row edges
      if (isFirstCol) return "range-strip range-strip-right";
      if (isLastCol) return "range-strip range-strip-left";
      return "range-strip range-strip-both";
    };

    const weekNumbers = getWeekNumbers();
    const gridCols = showWeekNumbers
      ? "grid-cols-[repeat(8,2rem)]"
      : "grid-cols-[repeat(7,2rem)]";

    return (
      <div ref={ref} className={cn("p-2 flex flex-col items-center", className)}>
        {/* Inline style for range strip pseudo-elements */}
        <style>{`
          .range-strip {
            position: relative;
          }
          .range-strip::before {
            content: "";
            position: absolute;
            top: 0;
            bottom: 0;
            z-index: 0;
            background: transparent;
            border-radius: 0;
            pointer-events: none;
          }
          .range-strip-right::before {
            left: 0;
            right: 0;
            border-radius: 0;
          }
          .range-strip-left::before {
            left: 0;
            right: 0;
            border-radius: 0;
          }
          .range-strip-both::before {
            left: 0;
            right: 0;
            border-radius: 0;
          }
        `}</style>

        {/* Days grid with week numbers */}
        <div
          ref={gridRef}
          className="flex flex-col"
          role="grid"
          aria-label={t("CALENDAR_DAYS")}
          onMouseLeave={handleMouseLeave}
        >
          {/* Column headers row (day names) */}
          <div role="row" className={cn("grid", gridCols)}>
            {showWeekNumbers && (
              <div
                role="columnheader"
                className="h-8 w-full flex items-center justify-center text-xs font-medium text-sapphire-text-tertiary"
              ></div>
            )}
            {weekDays
              ? weekDays.map((day) => (
                  <div
                    key={day}
                    role="columnheader"
                    className="h-8 w-full flex items-center justify-center text-xs font-medium text-sapphire-text-tertiary"
                  >
                    {day}
                  </div>
                ))
              : Array.from({ length: 7 }, (_, i) => (
                  <div
                    key={i}
                    role="columnheader"
                    className="h-8 w-full flex items-center justify-center"
                  >
                    <span className="inline-block h-3 w-6 rounded bg-muted animate-pulse" />
                  </div>
                ))
            }
          </div>

          {/* Day rows */}
          {Array.from({ length: Math.ceil(days.length / 7) }, (_, weekIndex) => {
            const weekStart = weekIndex * 7;
            const weekDates = days.slice(weekStart, weekStart + 7);
            // Use the first date of the week as the key for stable identity
            const weekKey = weekDates.length > 0 ? `week-${formatDateToISO(weekDates[0])}` : `week-${weekIndex}`;

            return (
              <div key={weekKey} role="row" className={cn("grid items-center", gridCols)}>
                {showWeekNumbers && (
                  <div
                    role="rowheader"
                    className="h-8 w-full flex items-center justify-center text-xs text-sapphire-text-tertiary"
                  >
                    {cldrReady
                      ? weekNumbers[weekIndex]
                      : <span className="inline-block h-3 w-4 rounded bg-muted animate-pulse" />
                    }
                  </div>
                )}
                {weekDates.map((date, dayIndex) => {
                  const idx = weekStart + dayIndex;
                  const variant = getDayCellVariant(date);
                  const specialType = getDayCellSpecialType(date);
                  const special = getSpecialDate(date);
                  const isFocused =
                    focusedDate && date.getTime() === focusedDate.getTime();
                  const isCurrentMonth = isSameMonthUtil(date, currentMonth);
                  const isTodayDate = isToday(date);
                  const isDisabled = isDateDisabled(date);
                  const rangeStripClass = getRangeStripClass(date, idx);

                  // Build comprehensive aria-label using CLDR long day/month names
                  const dayName = wideDays[date.getDay()];
                  const monthName = wideMonths[date.getMonth()];
                  let ariaLabel = `${dayName}, ${monthName} ${date.getDate()}, ${date.getFullYear()}`;
                  if (isTodayDate) ariaLabel += ", Today";
                  if (!isCurrentMonth) ariaLabel += ", Outside current month";
                  if (isDisabled) ariaLabel += ", Not available";
                  if (special?.tooltip) ariaLabel += `, ${special.tooltip}`;

                  const isWeekend = date.getDay() === 0 || date.getDay() === 6;

                  const gridcell = (
                    <div
                      ref={isFocused ? setFocusedCellRef : undefined}
                      role="gridcell"
                      aria-label={ariaLabel}
                      aria-selected={isDateSelected(date)}
                      aria-current={isTodayDate ? "date" : undefined}
                      aria-disabled={isDisabled}
                      title={special?.tooltip}
                      tabIndex={isFocused ? 0 : -1}
                      className={cn(
                        dayCellVariants({
                          variant: variant as DayCellVariant,
                          specialType: specialType as DayCellSpecialType,
                        }),
                        "cursor-pointer",
                        isWeekend && variant === "default" && "bg-sapphire-background-quaternary border border-sapphire-background-primary rounded",
                      )}
                      onClick={() => { if (!isDateDisabled(date)) { onFocusChange(date); onSelectDate(date); } }}
                      onMouseOver={() => handleMouseOver(date)}
                      onKeyDown={(e) => handleKeyDown(e, date)}
                    >
                      <span className={dayCellInnerVariants({ variant: variant as DayCellVariant })}>
                        {cldrReady
                          ? format(date, "d")
                          : <span className="inline-block h-3 w-4 rounded bg-muted animate-pulse" />
                        }
                      </span>
                    </div>
                  );

                  return rangeStripClass ? (
                    <div key={formatDateToISO(date)} className={rangeStripClass}>
                      {gridcell}
                    </div>
                  ) : (
                    <React.Fragment key={formatDateToISO(date)}>{gridcell}</React.Fragment>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
