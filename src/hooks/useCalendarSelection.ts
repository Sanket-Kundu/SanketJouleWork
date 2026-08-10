import { useState, useCallback } from "react";
import {
  parseDate,
  formatDateToISO,
  isSameDayUtil,
  isDateInRange,
  isDateBefore,
  isDateAfter,
} from "../lib/date-utils";
import type {
  CalendarSelectionMode,
  CalendarLegendItemType,
  DisabledDateRange,
  SpecialCalendarDate,
} from "../types/calendar";

/**
 * Hook for managing calendar date selection
 */
export function useCalendarSelection(
  mode: CalendarSelectionMode,
  initialDates?: string[],
  rangeStart?: string,
  rangeEnd?: string,
  minDate?: string,
  maxDate?: string,
  disabledDates?: DisabledDateRange[]
) {
  const [selectedDates, setSelectedDates] = useState<Date[]>(() => {
    if (mode === "Range") return [];
    return initialDates?.map((d) => parseDate(d)) || [];
  });

  const [rangeStartDate, setRangeStartDate] = useState<Date | null>(() =>
    rangeStart ? parseDate(rangeStart) : null
  );

  const [rangeEndDate, setRangeEndDate] = useState<Date | null>(() =>
    rangeEnd ? parseDate(rangeEnd) : null
  );

  // Hover preview for range mode: when 1 date is selected, hovering shows a preview range
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  const minDateObj = minDate ? parseDate(minDate) : null;
  const maxDateObj = maxDate ? parseDate(maxDate) : null;

  /**
   * Check if a date is disabled
   */
  const isDateDisabled = useCallback(
    (date: Date): boolean => {
      // Check min/max boundaries
      if (minDateObj && isDateBefore(date, minDateObj)) return true;
      if (maxDateObj && isDateAfter(date, maxDateObj)) return true;

      // Check disabled date ranges
      if (disabledDates) {
        for (const range of disabledDates) {
          const start = range.startDate ? parseDate(range.startDate) : null;
          const end = range.endDate ? parseDate(range.endDate) : null;

          if (start && end) {
            if (isDateInRange(date, start, end)) return true;
          } else if (start) {
            if (isSameDayUtil(date, start) || isDateAfter(date, start)) return true;
          } else if (end) {
            if (isSameDayUtil(date, end) || isDateBefore(date, end)) return true;
          }
        }
      }

      return false;
    },
    [minDateObj, maxDateObj, disabledDates]
  );

  /**
   * Check if a date is selected
   */
  const isDateSelected = useCallback(
    (date: Date): boolean => {
      if (mode === "Range") {
        if (!rangeStartDate) return false;
        if (!rangeEndDate) return isSameDayUtil(date, rangeStartDate);
        return isDateInRange(date, rangeStartDate, rangeEndDate);
      }

      return selectedDates.some((d) => isSameDayUtil(d, date));
    },
    [mode, selectedDates, rangeStartDate, rangeEndDate]
  );

  /**
   * Check if a date is the start of a range (including hover preview)
   */
  const isRangeStart = useCallback(
    (date: Date): boolean => {
      if (mode !== "Range" || !rangeStartDate) return false;
      // When hovering with 1 date selected, the earlier date is the start
      if (!rangeEndDate && hoveredDate) {
        if (isDateBefore(hoveredDate, rangeStartDate)) {
          return isSameDayUtil(date, hoveredDate);
        }
      }
      return isSameDayUtil(date, rangeStartDate);
    },
    [mode, rangeStartDate, rangeEndDate, hoveredDate]
  );

  /**
   * Check if a date is the end of a range (including hover preview)
   */
  const isRangeEnd = useCallback(
    (date: Date): boolean => {
      if (mode !== "Range") return false;
      if (rangeEndDate) return isSameDayUtil(date, rangeEndDate);
      // When hovering with 1 date selected, the later date is the end
      if (rangeStartDate && hoveredDate) {
        if (isDateBefore(hoveredDate, rangeStartDate)) {
          return isSameDayUtil(date, rangeStartDate);
        }
        return isSameDayUtil(date, hoveredDate);
      }
      return false;
    },
    [mode, rangeStartDate, rangeEndDate, hoveredDate]
  );

  /**
   * Check if a date is between range start and end (not including start/end),
   * also considering hover preview when only 1 date is selected.
   */
  const isDateBetweenRange = useCallback(
    (date: Date): boolean => {
      if (mode !== "Range" || !rangeStartDate) return false;

      // Committed range
      if (rangeEndDate) {
        return (
          isDateInRange(date, rangeStartDate, rangeEndDate) &&
          !isSameDayUtil(date, rangeStartDate) &&
          !isSameDayUtil(date, rangeEndDate)
        );
      }

      // Hover preview range
      if (hoveredDate) {
        const previewStart = isDateBefore(hoveredDate, rangeStartDate) ? hoveredDate : rangeStartDate;
        const previewEnd = isDateBefore(hoveredDate, rangeStartDate) ? rangeStartDate : hoveredDate;
        return (
          isDateInRange(date, previewStart, previewEnd) &&
          !isSameDayUtil(date, previewStart) &&
          !isSameDayUtil(date, previewEnd)
        );
      }

      return false;
    },
    [mode, rangeStartDate, rangeEndDate, hoveredDate]
  );

  /**
   * Select a date
   * Returns the updated selection data immediately for callback use
   */
  const selectDate = useCallback(
    (date: Date): { selectedValues: string[]; selectedTimestamps: number[] } | null => {
      if (isDateDisabled(date)) return null;

      let newSelectedValues: string[] = [];
      let newSelectedTimestamps: number[] = [];

      if (mode === "Single") {
        setSelectedDates([date]);
        newSelectedValues = [formatDateToISO(date)];
        newSelectedTimestamps = [Math.floor(date.getTime() / 1000)];
      } else if (mode === "Multiple") {
        let newDates: Date[] = [];
        setSelectedDates((prev) => {
          const exists = prev.some((d) => isSameDayUtil(d, date));
          if (exists) {
            newDates = prev.filter((d) => !isSameDayUtil(d, date));
          } else {
            newDates = [...prev, date];
          }
          return newDates;
        });
        // Calculate for the updated state
        const exists = selectedDates.some((d) => isSameDayUtil(d, date));
        if (exists) {
          newDates = selectedDates.filter((d) => !isSameDayUtil(d, date));
        } else {
          newDates = [...selectedDates, date];
        }
        newSelectedValues = newDates.map(formatDateToISO);
        newSelectedTimestamps = newDates.map((d) => Math.floor(d.getTime() / 1000));
      } else if (mode === "Range") {
        if (!rangeStartDate || (rangeStartDate && rangeEndDate)) {
          // Start new range
          setRangeStartDate(date);
          setRangeEndDate(null);
          setHoveredDate(null);
          newSelectedValues = [formatDateToISO(date)];
          newSelectedTimestamps = [Math.floor(date.getTime() / 1000)];
        } else {
          // Complete range
          let newStart: Date;
          let newEnd: Date;
          if (isDateBefore(date, rangeStartDate)) {
            newStart = date;
            newEnd = rangeStartDate;
            setRangeStartDate(date);
            setRangeEndDate(rangeStartDate);
          } else {
            newStart = rangeStartDate;
            newEnd = date;
            setRangeEndDate(date);
          }
          setHoveredDate(null);
          newSelectedValues = [formatDateToISO(newStart), formatDateToISO(newEnd)];
          newSelectedTimestamps = [
            Math.floor(newStart.getTime() / 1000),
            Math.floor(newEnd.getTime() / 1000),
          ];
        }
      }

      return { selectedValues: newSelectedValues, selectedTimestamps: newSelectedTimestamps };
    },
    [mode, isDateDisabled, rangeStartDate, rangeEndDate, selectedDates]
  );

  /**
   * Get selected dates as ISO strings
   */
  const getSelectedValuesAsISO = useCallback((): string[] => {
    if (mode === "Range") {
      const values: string[] = [];
      if (rangeStartDate) values.push(formatDateToISO(rangeStartDate));
      if (rangeEndDate) values.push(formatDateToISO(rangeEndDate));
      return values;
    }
    return selectedDates.map(formatDateToISO);
  }, [mode, selectedDates, rangeStartDate, rangeEndDate]);

  /**
   * Get selected dates as timestamps
   */
  const getSelectedTimestamps = useCallback((): number[] => {
    if (mode === "Range") {
      const timestamps: number[] = [];
      if (rangeStartDate) timestamps.push(Math.floor(rangeStartDate.getTime() / 1000));
      if (rangeEndDate) timestamps.push(Math.floor(rangeEndDate.getTime() / 1000));
      return timestamps;
    }
    return selectedDates.map((d) => Math.floor(d.getTime() / 1000));
  }, [mode, selectedDates, rangeStartDate, rangeEndDate]);

  // Whether we're in the "picking second date" state (for hover preview)
  const isRangeSelectionInProgress = mode === "Range" && rangeStartDate !== null && rangeEndDate === null;

  return {
    selectedDates,
    rangeStartDate,
    rangeEndDate,
    hoveredDate,
    setHoveredDate,
    isRangeSelectionInProgress,
    isDateDisabled,
    isDateSelected,
    isRangeStart,
    isRangeEnd,
    isDateBetweenRange,
    selectDate,
    getSelectedValuesAsISO,
    getSelectedTimestamps,
  };
}

/**
 * Hook for managing special dates lookup
 */
export function useSpecialDates(specialDates?: SpecialCalendarDate[]) {
  const getSpecialDate = useCallback(
    (date: Date): { type: CalendarLegendItemType; tooltip?: string } | null => {
      if (!specialDates) return null;

      const found = specialDates.find((sd) => {
        const specialDate = parseDate(sd.date);
        return isSameDayUtil(specialDate, date);
      });

      return found ? { type: found.type, tooltip: found.tooltip } : null;
    },
    [specialDates]
  );

  return { getSpecialDate };
}
