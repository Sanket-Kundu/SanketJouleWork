import React, { useState, useCallback, useMemo, useImperativeHandle, useRef } from "react";
import { cn } from "../../lib/utils";
import {
  parseDate,
  getToday,
  getMonthName,
  getYear,
  getMonth,
  createDate,
  addMonthsToDate,
} from "../../lib/date-utils";
import { useCalendarSelection, useSpecialDates } from "../../hooks/useCalendarSelection";
import {
  CalendarProps,
  CalendarPickerView,
  CalendarSelectionMode,
  CalendarPickersMode,
} from "../../types/calendar";
import { CalendarHeader } from "./CalendarHeader";
import { DayPicker } from "./DayPicker";
import { MonthPicker } from "./MonthPicker";
import { YearPicker } from "./YearPicker";
import { CalendarLegend } from "./CalendarLegend";
import { useTranslation } from "react-i18next";
import { useEnsureCldr } from "../../i18n";

/**
 * Get the initial view based on pickersMode
 */
function getInitialView(pickersMode?: CalendarPickersMode | string): CalendarPickerView {
  switch (pickersMode) {
    case CalendarPickersMode.YEAR:
      return CalendarPickerView.Year;
    case CalendarPickersMode.MONTH_YEAR:
      return CalendarPickerView.Month;
    default:
      return CalendarPickerView.Day;
  }
}

/**
 * Calendar component - Native React implementation of UI5 Calendar
 *
 * A comprehensive calendar component supporting single, multiple, and range selection,
 * with special dates, disabled dates, week numbers, and full keyboard navigation.
 */
export function Calendar({
      selectionMode = CalendarSelectionMode.Single,
      hideWeekNumbers = false,
      calendarWeekNumbering,
      pickersMode = CalendarPickersMode.DAY_MONTH_YEAR,
      minDate,
      maxDate,
      selectedDates,
      rangeStartDate,
      rangeEndDate,
      specialDates,
      disabledDates,
      focusedDate,
      locale: localeProp,
      firstDayOfWeek,
      showLegend = false,
      hideLegendToday = false,
      hideLegendSelectedDay = false,
      hideLegendWorkingDay = false,
      hideLegendNonWorkingDay = false,
      legendItems = [],
      autoFocus = false,
      onSelectionChange,
      onShowMonthView,
      onShowYearView,
      onLegendItemSelect,
      onKeyDown,
      className,
      ref,
      "data-testid": dataTestId,
    }: CalendarProps) {
    // Get locale from context or use prop
    const { i18n, t } = useTranslation("fx");
    const locale = localeProp || i18n.language;
    const cldrReady = useEnsureCldr(locale);

    // Current view state
    const [currentView, setCurrentView] = useState<CalendarPickerView>(
      () => getInitialView(pickersMode as string)
    );

    // Current displayed date (for navigation)
    const [displayedDate, setDisplayedDate] = useState<Date>(() => {
      if (focusedDate) return parseDate(focusedDate);
      if (selectedDates && selectedDates.length > 0) return parseDate(selectedDates[0]);
      if (rangeStartDate) return parseDate(rangeStartDate);
      return getToday();
    });

    // Focused date for keyboard navigation
    const [focusDate, setFocusDate] = useState<Date>(displayedDate);

    // Year range for year picker
    const [yearRangeStart, setYearRangeStart] = useState<number>(() => {
      const year = getYear(displayedDate);
      return Math.floor(year / 20) * 20;
    });

    // Parse min/max dates for nav disabling
    const minDateObj = useMemo(() => minDate ? parseDate(minDate) : undefined, [minDate]);
    const maxDateObj = useMemo(() => maxDate ? parseDate(maxDate) : undefined, [maxDate]);

    // Compute whether previous/next navigation should be disabled
    const isPreviousDisabled = useMemo(() => {
      if (!minDateObj) return false;
      if (currentView === CalendarPickerView.Day) {
        // Disable if previous month is entirely before minDate
        const prevMonth = addMonthsToDate(displayedDate, -1);
        const lastDayOfPrevMonth = new Date(getYear(prevMonth), getMonth(prevMonth) + 1, 0);
        return lastDayOfPrevMonth < minDateObj;
      } else if (currentView === CalendarPickerView.Month) {
        // Disable if previous year is entirely before minDate
        return getYear(displayedDate) - 1 < getYear(minDateObj);
      } else if (currentView === CalendarPickerView.Year) {
        // Disable if previous year range end is before minDate year
        return yearRangeStart - 1 < getYear(minDateObj);
      }
      return false;
    }, [minDateObj, currentView, displayedDate, yearRangeStart]);

    const isNextDisabled = useMemo(() => {
      if (!maxDateObj) return false;
      if (currentView === CalendarPickerView.Day) {
        // Disable if next month is entirely after maxDate
        const nextMonth = addMonthsToDate(displayedDate, 1);
        const firstDayOfNextMonth = createDate(getYear(nextMonth), getMonth(nextMonth), 1);
        return firstDayOfNextMonth > maxDateObj;
      } else if (currentView === CalendarPickerView.Month) {
        // Disable if next year is entirely after maxDate
        return getYear(displayedDate) + 1 > getYear(maxDateObj);
      } else if (currentView === CalendarPickerView.Year) {
        // Disable if next year range start is after maxDate year
        return yearRangeStart + 20 > getYear(maxDateObj);
      }
      return false;
    }, [maxDateObj, currentView, displayedDate, yearRangeStart]);

    // Selection state
    const selection = useCalendarSelection(
      selectionMode as CalendarSelectionMode,
      selectedDates,
      rangeStartDate,
      rangeEndDate,
      minDate,
      maxDate,
      disabledDates
    );

    // Special dates lookup
    const { getSpecialDate } = useSpecialDates(specialDates);

    // Handle date selection
    const handleDateSelect = useCallback(
      (date: Date) => {
        const result = selection.selectDate(date);

        if (onSelectionChange && result) {
          onSelectionChange({
            selectedValues: result.selectedValues,
            selectedDates: result.selectedTimestamps,
            timestamp: Math.floor(date.getTime() / 1000),
          });
        }
      },
      [selection, onSelectionChange]
    );

    // Handle month selection
    const handleMonthSelect = useCallback((month: number) => {
      const newDate = createDate(getYear(displayedDate), month);
      setDisplayedDate(newDate);
      setFocusDate(newDate);

      if (pickersMode === CalendarPickersMode.MONTH_YEAR) {
        // In MONTH_YEAR mode, selecting a month fires onSelectionChange directly
        if (onSelectionChange) {
          const isoValue = `${getYear(newDate)}-${String(month + 1).padStart(2, "0")}`;
          onSelectionChange({
            selectedValues: [isoValue],
            selectedDates: [Math.floor(newDate.getTime() / 1000)],
            timestamp: Math.floor(newDate.getTime() / 1000),
          });
        }
      } else {
        setCurrentView(CalendarPickerView.Day);
      }
    }, [displayedDate, pickersMode, onSelectionChange]);

    // Handle year selection
    const handleYearSelect = useCallback((year: number) => {
      const newDate = createDate(year, getMonth(displayedDate));
      setDisplayedDate(newDate);
      setFocusDate(newDate);

      if (pickersMode === CalendarPickersMode.YEAR) {
        // In YEAR mode, selecting a year fires onSelectionChange directly
        if (onSelectionChange) {
          onSelectionChange({
            selectedValues: [String(year)],
            selectedDates: [Math.floor(newDate.getTime() / 1000)],
            timestamp: Math.floor(newDate.getTime() / 1000),
          });
        }
      } else {
        setCurrentView(CalendarPickerView.Month);
      }
    }, [displayedDate, pickersMode, onSelectionChange]);

    // Navigate to previous period
    const handlePrevious = useCallback(() => {
      if (currentView === CalendarPickerView.Day) {
        setDisplayedDate((prev) => addMonthsToDate(prev, -1));
      } else if (currentView === CalendarPickerView.Month) {
        setDisplayedDate((prev) => createDate(getYear(prev) - 1, getMonth(prev)));
      } else if (currentView === CalendarPickerView.Year) {
        setYearRangeStart((prev) => prev - 20);
      }
    }, [currentView]);

    // Navigate to next period
    const handleNext = useCallback(() => {
      if (currentView === CalendarPickerView.Day) {
        setDisplayedDate((prev) => addMonthsToDate(prev, 1));
      } else if (currentView === CalendarPickerView.Month) {
        setDisplayedDate((prev) => createDate(getYear(prev) + 1, getMonth(prev)));
      } else if (currentView === CalendarPickerView.Year) {
        setYearRangeStart((prev) => prev + 20);
      }
    }, [currentView]);

    // Switch to month view
    const handleShowMonthView = useCallback(() => {
      if (pickersMode === CalendarPickersMode.YEAR) return; // Can't show month view in YEAR mode
      setCurrentView(CalendarPickerView.Month);
      onShowMonthView?.();
    }, [onShowMonthView, pickersMode]);

    // Switch to year view
    const handleShowYearView = useCallback(() => {
      setCurrentView(CalendarPickerView.Year);
      onShowYearView?.();
    }, [onShowYearView]);

    // Get header text
    const getHeaderText = useCallback(() => {
      const year = getYear(displayedDate);
      const FALLBACK_LONG_MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      const month = cldrReady
        ? getMonthName(displayedDate, "long", locale)
        : FALLBACK_LONG_MONTHS[displayedDate.getMonth()];

      if (currentView === CalendarPickerView.Day) {
        return { monthText: month, yearText: String(year) };
      } else if (currentView === CalendarPickerView.Month) {
        return { monthText: "", yearText: String(year) };
      } else if (currentView === CalendarPickerView.Year) {
        return { monthText: "", yearText: `${yearRangeStart} - ${yearRangeStart + 19}` };
      }

      return { monthText: "", yearText: "" };
    }, [currentView, displayedDate, yearRangeStart, locale, cldrReady]);

    // Handle hover for range preview
    const handleHoverDate = useCallback((date: Date | null) => {
      selection.setHoveredDate(date);
    }, [selection]);

    // Handle focus change in day picker
    const handleFocusChange = useCallback((date: Date) => {
      setFocusDate(date);
      // If focused date is in different month, update displayed month
      if (getMonth(date) !== getMonth(displayedDate)) {
        setDisplayedDate(date);
      }
    }, [displayedDate]);

    // Handle keyboard shortcuts - scoped to this calendar instance
    const handleContainerKeyDown = useCallback((e: React.KeyboardEvent) => {
      onKeyDown?.(e);
      if (e.defaultPrevented) return;
      if (e.key === "F4") {
        e.preventDefault();
        if (e.shiftKey) {
          handleShowYearView();
        } else {
          handleShowMonthView();
        }
      }
    }, [handleShowMonthView, handleShowYearView, onKeyDown]);

    // Get tooltip text based on current view
    const getTooltipText = useCallback(() => {
      if (currentView === CalendarPickerView.Day) {
        return { previous: t("CALENDAR_PREVIOUS_MONTH"), next: t("CALENDAR_NEXT_MONTH") };
      } else if (currentView === CalendarPickerView.Month) {
        return { previous: t("CALENDAR_PREVIOUS_YEAR"), next: t("CALENDAR_NEXT_YEAR") };
      } else if (currentView === CalendarPickerView.Year) {
        return { previous: t("CALENDAR_PREVIOUS_YEAR_RANGE"), next: t("CALENDAR_NEXT_YEAR_RANGE") };
      }
      return { previous: t("CALENDAR_PREVIOUS"), next: t("CALENDAR_NEXT") };
    }, [currentView, t]);

    const headerText = getHeaderText();
    const tooltipText = getTooltipText();

    // Determine which buttons to show in header based on pickersMode
    const showMonthButton = pickersMode !== CalendarPickersMode.YEAR &&
      pickersMode !== CalendarPickersMode.MONTH_YEAR &&
      currentView === CalendarPickerView.Day;

    // Imperative ref handle
    const rootRef = useRef<HTMLDivElement>(null);
    useImperativeHandle(ref, () => ({
      switchToDayPicker() {
        if (pickersMode === CalendarPickersMode.YEAR || pickersMode === CalendarPickersMode.MONTH_YEAR) return;
        setCurrentView(CalendarPickerView.Day);
      },
      switchToMonthPicker() {
        if (pickersMode === CalendarPickersMode.YEAR) return;
        setCurrentView(CalendarPickerView.Month);
      },
      switchToYearPicker() {
        setCurrentView(CalendarPickerView.Year);
      },
      get nativeElement() {
        return rootRef.current;
      },
    }), [pickersMode]);

    return (
      <div
        ref={rootRef}
        data-testid={dataTestId}
        onKeyDown={handleContainerKeyDown}
        className={cn(
          "flex flex-col select-none rounded-lg border border-sapphire-border-primary bg-sapphire-card-bg-primary text-foreground shadow-[0_4px_10px_-2px_rgba(10,10,10,0.15),0_2px_5px_-2px_rgba(10,10,10,0.05)]",
          "w-fit min-w-[17rem]",
          className
        )}
      >
        <CalendarHeader
          monthText={showMonthButton ? headerText.monthText : ""}
          yearText={headerText.yearText}
          cldrReady={cldrReady}
          isPreviousDisabled={isPreviousDisabled}
          isNextDisabled={isNextDisabled}
          previousTooltip={tooltipText.previous}
          nextTooltip={tooltipText.next}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onMonthClick={handleShowMonthView}
          onYearClick={handleShowYearView}
        />

        <div className="relative w-full">
          {currentView === CalendarPickerView.Day && (
            <DayPicker
              currentMonth={displayedDate}
              focusedDate={focusDate}
              autoFocus={autoFocus}
              isDateSelected={selection.isDateSelected}
              isDateDisabled={selection.isDateDisabled}
              isRangeStart={selection.isRangeStart}
              isRangeEnd={selection.isRangeEnd}
              isDateBetweenRange={selection.isDateBetweenRange}
              isRangeSelectionInProgress={selection.isRangeSelectionInProgress}
              getSpecialDate={getSpecialDate}
              onSelectDate={handleDateSelect}
              onFocusChange={handleFocusChange}
              onHoverDate={handleHoverDate}
              showWeekNumbers={!hideWeekNumbers}
              weekNumbering={calendarWeekNumbering}
              firstDayOfWeek={firstDayOfWeek}
              locale={locale}
            />
          )}

          {currentView === CalendarPickerView.Month && (
            <MonthPicker
              currentYear={getYear(displayedDate)}
              focusedMonth={getMonth(focusDate)}
              selectedMonth={getMonth(displayedDate)}
              locale={locale}
              onSelectMonth={handleMonthSelect}
              onFocusChange={(month) => {
                const newDate = createDate(getYear(displayedDate), month);
                setFocusDate(newDate);
              }}
              onPreviousYear={() => {
                setDisplayedDate((prev) => createDate(getYear(prev) - 1, getMonth(prev)));
              }}
              onNextYear={() => {
                setDisplayedDate((prev) => createDate(getYear(prev) + 1, getMonth(prev)));
              }}
            />
          )}

          {currentView === CalendarPickerView.Year && (
            cldrReady ? (
              <YearPicker
                startYear={yearRangeStart}
                endYear={yearRangeStart + 19}
                focusedYear={getYear(focusDate)}
                selectedYear={getYear(displayedDate)}
                onSelectYear={handleYearSelect}
                onFocusChange={(year) => {
                  const newDate = createDate(year, getMonth(displayedDate));
                  setFocusDate(newDate);
                }}
                onPreviousRange={() => setYearRangeStart((prev) => prev - 20)}
                onNextRange={() => setYearRangeStart((prev) => prev + 20)}
              />
            ) : (
              <div className="p-3 w-full">
                <div className="flex flex-col gap-2 w-full">
                  {Array.from({ length: 5 }, (_, row) => (
                    <div key={row} className="grid grid-cols-4 gap-2">
                      {Array.from({ length: 4 }, (_, col) => (
                        <div key={col} className="min-h-[2.75rem] w-full flex items-center justify-center">
                          <span className="inline-block h-3.5 w-8 rounded bg-muted animate-pulse" />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>

        {showLegend && (
          <CalendarLegend
            hideToday={hideLegendToday}
            hideSelectedDay={hideLegendSelectedDay}
            hideWorkingDay={hideLegendWorkingDay}
            hideNonWorkingDay={hideLegendNonWorkingDay}
            items={legendItems}
            onLegendItemSelect={onLegendItemSelect}
            locale={locale}
          />
        )}
      </div>
    );
  }
