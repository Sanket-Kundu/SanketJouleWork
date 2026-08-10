import React, { useCallback, useRef, useEffect, type Ref } from "react";
import { cn, cva } from "../../lib/utils";
import { getMonthName, createDate } from "../../lib/date-utils";
import { useEnsureCldr } from "../../i18n";
import { useTranslation } from "react-i18next";

const monthCellVariants = cva(
  "h-8 w-full rounded-lg text-sm font-normal transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "hover:bg-sapphire-bg-secondary hover:text-sapphire-text",
        selected: "bg-sapphire-brand-hover-background text-sapphire-text-on-surface hover:bg-sapphire-brand-hover-background",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface MonthPickerProps {
  /** Currently displayed year */
  currentYear: number;

  /** Currently focused month (0-11) */
  focusedMonth: number;

  /** Selected month (if any) */
  selectedMonth?: number;

  /** Callback when a month is selected */
  onSelectMonth: (month: number) => void;

  /** Callback when focus changes */
  onFocusChange: (month: number) => void;

  /** Callback to navigate to previous year (PageUp) */
  onPreviousYear?: () => void;

  /** Callback to navigate to next year (PageDown) */
  onNextYear?: () => void;

  /** Locale code (e.g., 'en-US', 'ja-JP') */
  locale?: string;

  /** Additional CSS classes */
  className?: string;
}

export function MonthPicker({
      currentYear,
      focusedMonth,
      selectedMonth,
      onSelectMonth,
      onFocusChange,
      onPreviousYear,
      onNextYear,
      locale,
      className,
      ref,
    }: MonthPickerProps & { ref?: Ref<HTMLDivElement> }) {
    const { t } = useTranslation("fx");
    const months = Array.from({ length: 12 }, (_, i) => i);
    const focusedCellRef = useRef<HTMLDivElement>(null);
    const cldrReady = useEnsureCldr(locale);

    // Auto-focus the focused month when it changes OR on mount
    useEffect(() => {
      if (focusedCellRef.current) {
        focusedCellRef.current.focus({ preventScroll: true });
      }
    }, [focusedMonth]);

    // Auto-focus on mount
    useEffect(() => {
      if (focusedCellRef.current) {
        focusedCellRef.current.focus({ preventScroll: true });
      }
    }, []);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent, month: number) => {
        let newMonth: number | null = null;

        switch (e.key) {
          case "ArrowLeft":
            e.preventDefault();
            e.stopPropagation();
            newMonth = month === 0 ? 11 : month - 1;
            break;
          case "ArrowRight":
            e.preventDefault();
            e.stopPropagation();
            newMonth = month === 11 ? 0 : month + 1;
            break;
          case "ArrowUp":
            e.preventDefault();
            e.stopPropagation();
            newMonth = month < 3 ? month + 9 : month - 3;
            break;
          case "ArrowDown":
            e.preventDefault();
            e.stopPropagation();
            newMonth = month > 8 ? month - 9 : month + 3;
            break;
          case "Home":
            e.preventDefault();
            e.stopPropagation();
            if (e.ctrlKey) {
              newMonth = 0; // First month of year
            } else {
              // First month of current row
              newMonth = Math.floor(month / 3) * 3;
            }
            break;
          case "End":
            e.preventDefault();
            e.stopPropagation();
            if (e.ctrlKey) {
              newMonth = 11; // Last month of year
            } else {
              // Last month of current row
              newMonth = Math.min(Math.floor(month / 3) * 3 + 2, 11);
            }
            break;
          case "PageUp":
            e.preventDefault();
            e.stopPropagation();
            onPreviousYear?.();
            return;
          case "PageDown":
            e.preventDefault();
            e.stopPropagation();
            onNextYear?.();
            return;
          case "Enter":
          case " ":
            e.preventDefault();
            e.stopPropagation();
            onSelectMonth(month);
            return;
        }

        if (newMonth !== null) {
          onFocusChange(newMonth);
        }
      },
      [onSelectMonth, onFocusChange, onPreviousYear, onNextYear]
    );

    return (
      <div ref={ref} className={cn("h-60 w-full flex items-center px-3", className)}>
        <div className="flex flex-col gap-2 w-full" role="grid" aria-label={t("CALENDAR_SELECT_MONTH")}>
          {Array.from({ length: 4 }, (_, rowIndex) => {
            const rowMonths = months.slice(rowIndex * 3, (rowIndex + 1) * 3);

            return (
              <div key={rowIndex} role="row" className="grid grid-cols-3 gap-2">
                {rowMonths.map((month) => {
                  const date = createDate(currentYear, month);
                  const monthName = cldrReady
                    ? getMonthName(date, "short", locale)
                    : "";
                  const isFocused = month === focusedMonth;
                  const isSelected = month === selectedMonth;

                  return (
                    <div
                      key={month}
                      ref={isFocused ? focusedCellRef : undefined}
                      role="gridcell"
                      aria-label={t("CALENDAR_MONTH_YEAR", { monthName, year: currentYear })}
                      aria-selected={isSelected}
                      tabIndex={isFocused ? 0 : -1}
                      className={cn(
                        monthCellVariants({
                          variant: isSelected ? "selected" : "default",
                        }),
                        "flex items-center justify-center cursor-pointer"
                      )}
                      onClick={() => onSelectMonth(month)}
                      onKeyDown={(e) => handleKeyDown(e, month)}
                    >
                      {cldrReady ? monthName : (
                        <span className="inline-block h-3.5 w-8 rounded bg-muted animate-pulse" />
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
