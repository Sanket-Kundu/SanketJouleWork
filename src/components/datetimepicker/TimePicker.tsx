import React, { useRef, useCallback, useEffect, useMemo, type Ref } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "../../lib/utils";

interface TimePickerProps {
  /** Selected hours (0-23) */
  hours: number;
  /** Selected minutes (0-59) */
  minutes: number;
  /** Selected seconds (0-59) */
  seconds: number;
  /** Whether to show seconds column */
  showSeconds?: boolean;
  /** Time format: "12h" or "24h" */
  timeFormat?: "12h" | "24h";
  /** Minute step */
  minuteStep?: number;
  /** Second step */
  secondStep?: number;
  /** Callback when time changes */
  onTimeChange: (hours: number, minutes: number, seconds: number) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Generate an array of numbers from start to end (inclusive) with step
 */
function rangeWithStep(start: number, end: number, step: number): number[] {
  const result: number[] = [];
  for (let i = start; i <= end; i += step) {
    result.push(i);
  }
  return result;
}

/**
 * TimeColumn - a scrollable column of selectable time values
 */
const TimeColumn: React.FC<{
  values: { value: number; label: string }[];
  selected: number;
  onSelect: (value: number) => void;
  label: string;
}> = ({ values, selected, onSelect, label }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedRef.current && containerRef.current) {
      const container = containerRef.current;
      const el = selectedRef.current;
      const top = el.offsetTop - container.clientHeight / 2 + el.clientHeight / 2;
      container.scrollTo({ top, behavior: "smooth" });
    }
  }, [selected]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, idx: number) => {
    if (e.key === "ArrowUp" && idx > 0) {
      e.preventDefault();
      onSelect(values[idx - 1].value);
    } else if (e.key === "ArrowDown" && idx < values.length - 1) {
      e.preventDefault();
      onSelect(values[idx + 1].value);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(values[idx].value);
    }
  }, [values, onSelect]);

  return (
    <div className="flex flex-col min-w-[3rem]">
      <div className="text-xs font-medium text-sapphire-text-tertiary text-center py-1 border-b border-sapphire-border">
        {label}
      </div>
      <div
        ref={containerRef}
        className="overflow-y-auto max-h-48 scrollbar-thin"
        role="listbox"
        aria-label={label}
      >
        {values.map((item, idx) => {
          const isSelected = item.value === selected;
          return (
            <button
              key={item.value}
              ref={isSelected ? selectedRef : undefined}
              type="button"
              role="option"
              aria-selected={isSelected}
              tabIndex={isSelected ? 0 : -1}
              className={cn(
                "w-full py-1.5 px-2 text-sm text-center transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sapphire-ring focus-visible:ring-inset",
                isSelected
                  ? "bg-sapphire-brand-hover-background text-sapphire-text-on-surface font-medium"
                  : "hover:bg-sapphire-bg-secondary text-sapphire-text"
              )}
              onClick={() => onSelect(item.value)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

/**
 * TimePicker - vertical column-based time selector
 */
export function TimePicker({
      hours,
      minutes,
      seconds,
      showSeconds = false,
      timeFormat = "24h",
      minuteStep = 1,
      secondStep = 1,
      onTimeChange,
      className,
      ref,
    }: TimePickerProps & { ref?: Ref<HTMLDivElement> }) {
    const { t } = useTranslation("fx");
    const is12h = timeFormat === "12h";
    const period = hours >= 12 ? "PM" : "AM";

    // Generate hours values
    const hourValues = useMemo(() => {
      if (is12h) {
        return Array.from({ length: 12 }, (_, i) => {
          const h = i === 0 ? 12 : i;
          return { value: i, label: String(h).padStart(2, "0") };
        });
      }
      return Array.from({ length: 24 }, (_, i) => ({
        value: i,
        label: String(i).padStart(2, "0"),
      }));
    }, [is12h]);

    // Generate minutes values
    const minuteValues = useMemo(() => {
      return rangeWithStep(0, 59, minuteStep).map(m => ({
        value: m,
        label: String(m).padStart(2, "0"),
      }));
    }, [minuteStep]);

    // Generate seconds values
    const secondValues = useMemo(() => {
      return rangeWithStep(0, 59, secondStep).map(s => ({
        value: s,
        label: String(s).padStart(2, "0"),
      }));
    }, [secondStep]);

    // Period values for 12h mode
    const periodValues = useMemo(() => [
      { value: 0, label: "AM" },
      { value: 1, label: "PM" },
    ], []);

    // Convert 24h hours to 12h display index
    const displayHour = is12h ? hours % 12 : hours;

    const handleHourChange = useCallback((h: number) => {
      if (is12h) {
        // Convert 12h value back to 24h
        const h24 = period === "PM" ? (h === 0 ? 12 : h + 12) : h;
        onTimeChange(h24, minutes, seconds);
      } else {
        onTimeChange(h, minutes, seconds);
      }
    }, [is12h, period, minutes, seconds, onTimeChange]);

    const handleMinuteChange = useCallback((m: number) => {
      onTimeChange(hours, m, seconds);
    }, [hours, seconds, onTimeChange]);

    const handleSecondChange = useCallback((s: number) => {
      onTimeChange(hours, minutes, s);
    }, [hours, minutes, onTimeChange]);

    const handlePeriodChange = useCallback((p: number) => {
      const isPM = p === 1;
      let h24 = hours;
      if (isPM && hours < 12) h24 = hours + 12;
      else if (!isPM && hours >= 12) h24 = hours - 12;
      onTimeChange(h24, minutes, seconds);
    }, [hours, minutes, seconds, onTimeChange]);

    return (
      <div
        ref={ref}
        className={cn("flex border-l border-sapphire-border", className)}
        role="group"
        aria-label={t("TIMEPICKER_LABEL")}
      >
        <TimeColumn
          values={hourValues}
          selected={displayHour}
          onSelect={handleHourChange}
          label={t("TIMEPICKER_HOURS")}
        />
        <div className="w-px bg-sapphire-border" />
        <TimeColumn
          values={minuteValues}
          selected={minutes}
          onSelect={handleMinuteChange}
          label={t("TIMEPICKER_MINUTES")}
        />
        {showSeconds && (
          <>
            <div className="w-px bg-sapphire-border" />
            <TimeColumn
              values={secondValues}
              selected={seconds}
              onSelect={handleSecondChange}
              label={t("TIMEPICKER_SECONDS")}
            />
          </>
        )}
        {is12h && (
          <>
            <div className="w-px bg-sapphire-border" />
            <TimeColumn
              values={periodValues}
              selected={period === "PM" ? 1 : 0}
              onSelect={handlePeriodChange}
              label="AP"
            />
          </>
        )}
      </div>
    );
  }
