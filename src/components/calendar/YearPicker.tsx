import React, { useCallback, useRef, useEffect, type Ref } from "react";
import { cn, cva } from "../../lib/utils";
import { useTranslation } from "react-i18next";

const yearCellVariants = cva(
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

interface YearPickerProps {
  /** Start year of the range */
  startYear: number;

  /** End year of the range */
  endYear: number;

  /** Currently focused year */
  focusedYear: number;

  /** Selected year (if any) */
  selectedYear?: number;

  /** Callback when a year is selected */
  onSelectYear: (year: number) => void;

  /** Callback when focus changes */
  onFocusChange: (year: number) => void;

  /** Callback to navigate to previous year range */
  onPreviousRange: () => void;

  /** Callback to navigate to next year range */
  onNextRange: () => void;

  /** Additional CSS classes */
  className?: string;
}

export function YearPicker({
      startYear,
      endYear,
      focusedYear,
      selectedYear,
      onSelectYear,
      onFocusChange,
      onPreviousRange,
      onNextRange,
      className,
      ref,
    }: YearPickerProps & { ref?: Ref<HTMLDivElement> }) {
    const { t } = useTranslation("fx");
    const years = Array.from(
      { length: endYear - startYear + 1 },
      (_, i) => startYear + i
    );
    const focusedCellRef = useRef<HTMLDivElement>(null);

    // Auto-focus the focused year when it changes
    useEffect(() => {
      if (focusedCellRef.current) {
        focusedCellRef.current.focus({ preventScroll: true });
      }
    }, [focusedYear]);

    // Auto-focus on mount
    useEffect(() => {
      if (focusedCellRef.current) {
        focusedCellRef.current.focus({ preventScroll: true });
      }
    }, []);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent, year: number) => {
        const currentIndex = years.indexOf(year);
        let newYear: number | null = null;

        switch (e.key) {
          case "ArrowLeft":
            e.preventDefault();
            e.stopPropagation();
            if (currentIndex > 0) {
              newYear = years[currentIndex - 1];
            } else {
              onPreviousRange();
            }
            break;
          case "ArrowRight":
            e.preventDefault();
            e.stopPropagation();
            if (currentIndex < years.length - 1) {
              newYear = years[currentIndex + 1];
            } else {
              onNextRange();
            }
            break;
          case "ArrowUp":
            e.preventDefault();
            e.stopPropagation();
            if (currentIndex >= 4) {
              newYear = years[currentIndex - 4];
            } else {
              onPreviousRange();
            }
            break;
          case "ArrowDown":
            e.preventDefault();
            e.stopPropagation();
            if (currentIndex < years.length - 4) {
              newYear = years[currentIndex + 4];
            } else {
              onNextRange();
            }
            break;
          case "Home":
            e.preventDefault();
            e.stopPropagation();
            if (e.ctrlKey) {
              newYear = years[0]; // First year of range
            } else {
              // First year of current row
              newYear = years[Math.floor(currentIndex / 4) * 4];
            }
            break;
          case "End":
            e.preventDefault();
            e.stopPropagation();
            if (e.ctrlKey) {
              newYear = years[years.length - 1]; // Last year of range
            } else {
              // Last year of current row
              newYear = years[Math.min(Math.floor(currentIndex / 4) * 4 + 3, years.length - 1)];
            }
            break;
          case "PageUp":
            e.preventDefault();
            e.stopPropagation();
            onPreviousRange();
            return;
          case "PageDown":
            e.preventDefault();
            e.stopPropagation();
            onNextRange();
            return;
          case "Enter":
          case " ":
            e.preventDefault();
            e.stopPropagation();
            onSelectYear(year);
            return;
        }

        if (newYear !== null) {
          onFocusChange(newYear);
        }
      },
      [years, onSelectYear, onFocusChange, onPreviousRange, onNextRange]
    );

    return (
      <div ref={ref} className={cn("h-60 w-full flex items-center px-3", className)}>
        <div className="flex flex-col gap-2 w-full" role="grid" aria-label={t("CALENDAR_SELECT_YEAR")}>
          {Array.from({ length: 5 }, (_, rowIndex) => {
            const rowYears = years.slice(rowIndex * 4, (rowIndex + 1) * 4);

            return (
              <div key={rowIndex} role="row" className="grid grid-cols-4 gap-2">
                {rowYears.map((year) => {
                  const isFocused = year === focusedYear;
                  const isSelected = year === selectedYear;

                  return (
                    <div
                      key={year}
                      ref={isFocused ? focusedCellRef : undefined}
                      role="gridcell"
                      aria-label={t("CALENDAR_YEAR", { year })}
                      aria-selected={isSelected}
                      tabIndex={isFocused ? 0 : -1}
                      className={cn(
                        yearCellVariants({
                          variant: isSelected ? "selected" : "default",
                        }),
                        "flex items-center justify-center cursor-pointer"
                      )}
                      onClick={() => onSelectYear(year)}
                      onKeyDown={(e) => handleKeyDown(e, year)}
                    >
                      {year}
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
