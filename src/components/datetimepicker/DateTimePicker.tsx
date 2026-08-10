import React, {
  useState,
  useCallback,
  useRef,
  useImperativeHandle,
  useMemo,
} from "react";
import { CalendarIcon } from "../../icons/Calendar";
import { FobWatchIcon } from "../../icons/FobWatch";
import { cn } from "../../lib/utils";
import {
  DateTimePickerProps,
} from "../../types/datetimepicker";
import { ValueState, DatePickerSize } from "../../types/datepicker";
import { Calendar } from "../calendar/Calendar";
import { CalendarSelectionMode } from "../../types/calendar";
import { ResponsivePopover } from "../responsive-popover/ResponsivePopover";
import { Button } from "../button/Button";
import { ButtonDesign, ButtonSize } from "../../types/button";
import { DeclineIcon } from "../../icons/Decline";
import { TimePicker } from "./TimePicker";
import { inputContainerVariants } from "../datepicker/DatePicker";
import DateFormat from "@ui5/webcomponents-localization/dist/DateFormat.js";
import Locale from "@ui5/webcomponents-base/dist/locale/Locale.js";
import { useTranslation } from "react-i18next";
import { useEnsureCldr } from "../../i18n";
import { getLocaleDateFormat } from "../../lib/locale-utils";
import { isPhone } from "../../lib/Device";

function isValidDate(d: Date | null | undefined): d is Date {
  return d instanceof Date && !isNaN(d.getTime());
}

/**
 * Get the effective time format based on locale
 */
function getLocaleTimeFormat(locale?: string): "12h" | "24h" {
  try {
    const formatted = new Intl.DateTimeFormat(locale || "en-US", { hour: "numeric" }).format(new Date());
    return /AM|PM/i.test(formatted) ? "12h" : "24h";
  } catch {
    return "24h";
  }
}

/**
 * DateTimePicker component
 *
 * Combines a DatePicker-style input with a calendar and time picker in a responsive popover.
 * Supports both 12h and 24h time formats, configurable minute/second steps, and full keyboard navigation.
 */
export function DateTimePicker({
      size = DatePickerSize.Large,
      value: controlledValue,
      defaultValue = "",
      minDate,
      maxDate,
      disabled = false,
      readonly = false,
      required = false,
      open: controlledOpen,
      showClearIcon = true,
      showSeconds = false,
      timeFormat: timeFormatProp,
      minuteStep = 1,
      secondStep = 1,
      placeholder,
      displayFormat: displayFormatProp,
      valueFormat = "yyyy-MM-dd'T'HH:mm:ss",
      valueState = ValueState.None,
      valueStateMessage,
      accessibleName,
      accessibleNameRef,
      hideWeekNumbers = false,
      name,
      id,
      onInput,
      onChange,
      onOpen,
      onClose,
      onValueStateChange,
      className,
      style,
      "data-testid": dataTestId,
      ref,
    }: DateTimePickerProps) {
    const { i18n } = useTranslation("fx");
    const locale = i18n.language;
    const cldrReady = useEnsureCldr(locale);
    const isPhoneDevice = useMemo(() => isPhone(), []);
    const [phoneTab, setPhoneTab] = useState<"date" | "time">("date");
    const isMedium = size === DatePickerSize.Medium;

    const timeFormat = timeFormatProp || getLocaleTimeFormat(locale);

    const dateDisplayFormat = useMemo(() => {
      if (displayFormatProp) return displayFormatProp;
      if (!cldrReady) return "yyyy-MM-dd";
      return getLocaleDateFormat(locale);
    }, [displayFormatProp, cldrReady, locale]);
    const timeDisplayFormat = showSeconds
      ? (timeFormat === "12h" ? "hh:mm:ss a" : "HH:mm:ss")
      : (timeFormat === "12h" ? "hh:mm a" : "HH:mm");

    const effectiveDisplayFormat = `${dateDisplayFormat} ${timeDisplayFormat}`;
    // While CLDR is loading, show an empty placeholder instead of English fallback format
    const effectivePlaceholder = placeholder || (
      !cldrReady && !displayFormatProp ? "" : effectiveDisplayFormat
    );

    // Pass explicit locale so DateFormat uses the correct CLDR data (not the UI5 global default).
    // Cast: webcomponents Locale is runtime-compatible with OpenUI5 Locale but types diverge.
    const loc = useMemo(() => new Locale(locale) as unknown as import("sap/ui/core/Locale").default, [locale]);
    const { displayFmt, valueFmt, isoDateFmt } = useMemo(() => {
      if (!cldrReady) return { displayFmt: null, valueFmt: null, isoDateFmt: null };
      return {
        displayFmt: DateFormat.getDateTimeInstance({ pattern: effectiveDisplayFormat }, loc),
        valueFmt: DateFormat.getDateTimeInstance({ pattern: valueFormat }, loc),
        isoDateFmt: DateFormat.getDateInstance({ pattern: "yyyy-MM-dd" }, loc),
      };
    }, [cldrReady, effectiveDisplayFormat, valueFormat, loc]);

    const formatDT      = useCallback((d: Date): string => displayFmt?.format(d) ?? "", [displayFmt]);
    const formatVal     = useCallback((d: Date): string => valueFmt?.format(d) ?? "", [valueFmt]);
    const formatISODate = useCallback((d: Date): string => isoDateFmt?.format(d) ?? "", [isoDateFmt]);
    const parseDT = useCallback((str: string, pattern: string): Date | null => {
      if (!cldrReady) return null;
      return (DateFormat.getDateTimeInstance({ pattern, strictParsing: true }, loc).parse(str) as Date | null) ?? null;
    }, [cldrReady, loc]);
    const parseISODate = useCallback((str: string): Date | null => {
      if (!cldrReady) return null;
      return (DateFormat.getDateInstance({ pattern: "yyyy-MM-dd", strictParsing: true }, loc).parse(str) as Date | null) ?? null;
    }, [cldrReady, loc]);

    // State — only what cannot be derived
    const [internalValue, setInternalValue] = useState(defaultValue);
    const [internalOpen, setInternalOpen] = useState(false);
    const [inputText, setInputText] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [internalValueState, setInternalValueState] = useState<ValueState>(valueState as ValueState);

    // Controlled vs uncontrolled
    const isOpen = controlledOpen ?? internalOpen;
    const value = controlledValue ?? internalValue;

    // Derived — parsed from `value` every render, no state needed.
    const selectedDate = (cldrReady && value)
      ? (parseDT(value, valueFormat) ?? undefined)
      : undefined;

    // Temporary time state for the popover (committed on OK)
    const [tempHours, setTempHours] = useState(0);
    const [tempMinutes, setTempMinutes] = useState(0);
    const [tempSeconds, setTempSeconds] = useState(0);
    const [tempDate, setTempDate] = useState<Date | undefined>(undefined);

    // Refs
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const rootRef = useRef<HTMLDivElement>(null);
    const skipFocusSyncRef = useRef(false);

    // Parse min/max
    const minDateObj = useMemo(() => minDate ? parseISODate(minDate) : undefined, [minDate, parseISODate]);
    const maxDateObj = useMemo(() => maxDate ? parseISODate(maxDate) : undefined, [maxDate, parseISODate]);

    // Update value state with callback gate
    const updateValueState = useCallback((newState: ValueState, valid: boolean) => {
      if (onValueStateChange) {
        const result = onValueStateChange({ valueState: newState, valid });
        if (result === false) return;
      }
      setInternalValueState(newState);
    }, [onValueStateChange]);

    // Open/close popover
    const openPopover = useCallback(() => {
      if (disabled || readonly) return;
      // Sync temp state with current selection when opening
      setTempDate(selectedDate);
      setTempHours(selectedDate?.getHours() ?? 0);
      setTempMinutes(selectedDate?.getMinutes() ?? 0);
      setTempSeconds(selectedDate?.getSeconds() ?? 0);
      setPhoneTab("date");
      if (controlledOpen === undefined) {
        setInternalOpen(true);
      }
      onOpen?.();
    }, [disabled, readonly, controlledOpen, onOpen, selectedDate]);

    const closePopover = useCallback(() => {
      if (controlledOpen === undefined) {
        setInternalOpen(false);
      }
      onClose?.();
    }, [controlledOpen, onClose]);

    // Derived display value — computed every render, no memo/effect needed.
    const getDisplayValue = (): string => {
      if (!cldrReady) return "";
      if (isEditing) return inputText;
      if (isValidDate(selectedDate)) return formatDT(selectedDate);
      return value;
    };
    const displayValue = getDisplayValue();

    // Build combined datetime from date + time
    const buildDateTime = useCallback((date: Date | undefined, h: number, m: number, s: number): Date | null => {
      if (!date) return null;
      const dt = new Date(date);
      dt.setHours(h, m, s, 0);
      return dt;
    }, []);

    // Commit the selected datetime
    const commitDateTime = useCallback((dt: Date) => {
      const formattedValue = formatVal(dt);
      updateValueState(valueState as ValueState, true);

      if (!controlledValue) {
        setInternalValue(formattedValue);
      }

      onChange?.({
        value: formattedValue,
        dateValue: dt,
        valid: true,
      });
    }, [controlledValue, valueState, onChange, updateValueState, formatVal]);

    // Handle OK button click
    const handleOk = useCallback(() => {
      const dt = buildDateTime(tempDate, tempHours, tempMinutes, tempSeconds);
      if (dt && isValidDate(dt)) {
        commitDateTime(dt);
      }
      closePopover();
    }, [tempDate, tempHours, tempMinutes, tempSeconds, buildDateTime, commitDateTime, closePopover]);

    // Handle Cancel
    const handleCancel = useCallback(() => {
      closePopover();
    }, [closePopover]);

    // Handle date selection in calendar
    const handleCalendarSelect = useCallback((detail: { selectedValues: string[] }) => {
      if (detail.selectedValues.length > 0) {
        const parsed = parseISODate(detail.selectedValues[0]);
        if (isValidDate(parsed)) {
          setTempDate(parsed);
        }
      }
    }, [parseISODate]);

    // Handle time change
    const handleTimeChange = useCallback((h: number, m: number, s: number) => {
      setTempHours(h);
      setTempMinutes(m);
      setTempSeconds(s);
    }, []);

    // Track focus — sync inputText from current display so editing starts from correct text.
    const handleFocus = useCallback(() => {
      if (skipFocusSyncRef.current) {
        skipFocusSyncRef.current = false;
      } else {
        setInputText(displayValue);
      }
      setIsEditing(true);
    }, [displayValue]);

    // Handle input change
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const newText = e.target.value;
      setInputText(newText);

      const parsed = parseDT(newText, effectiveDisplayFormat);
      const valid = isValidDate(parsed);

      onInput?.({
        value: newText,
        dateValue: valid ? parsed : null,
        valid,
      });
    }, [effectiveDisplayFormat, onInput, parseDT]);

    // Handle input blur
    const handleBlur = useCallback(() => {
      setIsEditing(false);
      if (!inputText.trim()) {
        updateValueState(valueState as ValueState, true);
        if (!controlledValue) setInternalValue("");
        onChange?.({ value: "", dateValue: null, valid: true });
        return;
      }

      const parsed = parseDT(inputText.trim(), effectiveDisplayFormat);
      if (isValidDate(parsed)) {
        commitDateTime(parsed);
      } else {
        updateValueState(ValueState.Negative, false);
        onChange?.({ value: inputText, dateValue: null, valid: false });
      }
    }, [inputText, effectiveDisplayFormat, commitDateTime, controlledValue, valueState, onChange, updateValueState, parseDT]);

    // Handle keyboard
    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case "Enter":
          e.preventDefault();
          handleBlur();
          inputRef.current?.blur();
          return;
        case "F4":
          e.preventDefault();
          if (isOpen) closePopover(); else openPopover();
          return;
        case "ArrowDown":
          if (!e.altKey) return;
          e.preventDefault();
          if (!isOpen) openPopover();
          return;
        case "ArrowUp":
          if (!e.altKey) return;
          e.preventDefault();
          if (isOpen) closePopover();
          return;
      }
    }, [handleBlur, isOpen, openPopover, closePopover]);

    // Toggle popover
    const togglePopover = useCallback(() => {
      if (disabled || readonly) return;
      if (isOpen) closePopover();
      else openPopover();
    }, [disabled, readonly, isOpen, openPopover, closePopover]);

    // Clear value
    const handleClear = useCallback(() => {
      setInputText("");
      skipFocusSyncRef.current = true;
      updateValueState(valueState as ValueState, true);
      if (!controlledValue) setInternalValue("");
      onChange?.({ value: "", dateValue: null, valid: true });
      inputRef.current?.focus();
    }, [controlledValue, valueState, onChange, updateValueState]);

    // Imperative ref
    useImperativeHandle(ref, () => ({
      formatValue(date: Date): string {
        return formatDT(date);
      },
      isValidValue(val: string): boolean {
        return isValidDate(parseDT(val, valueFormat));
      },
      get dateValue(): Date | null {
        return selectedDate && isValidDate(selectedDate) ? selectedDate : null;
      },
      get nativeElement(): HTMLDivElement | null {
        return rootRef.current;
      },
      focus() {
        inputRef.current?.focus();
      },
      blur() {
        inputRef.current?.blur();
      },
    }), [valueFormat, selectedDate, formatDT, parseDT]);

    // Shared calendar/time props to avoid repetition and reduce JSX complexity
    const calendarProps = {
      selectionMode: CalendarSelectionMode.Single,
      selectedDates: tempDate ? [formatISODate(tempDate)] : [],
      onSelectionChange: handleCalendarSelect,
      minDate: minDateObj ? formatISODate(minDateObj) : undefined,
      maxDate: maxDateObj ? formatISODate(maxDateObj) : undefined,
      hideWeekNumbers,
      locale,
    } as const;
    const timePickerProps = {
      hours: tempHours,
      minutes: tempMinutes,
      seconds: tempSeconds,
      showSeconds,
      timeFormat,
      minuteStep,
      secondStep,
      onTimeChange: handleTimeChange,
    } as const;

    // Footer for the popover
    const popoverFooter = (
      <div className="flex justify-end gap-2 p-3 border-t border-sapphire-border">
        <Button design="Tertiary" onClick={handleCancel}>
          Cancel
        </Button>
        <Button design="Primary" onClick={handleOk}>
          OK
        </Button>
      </div>
    );

    // Value state message class
    const getValueStateClass = (): string | false => {
      switch (internalValueState) {
        case ValueState.Positive: return "text-sapphire-positive";
        case ValueState.Negative: return "text-sapphire-negative";
        case ValueState.Critical: return "text-sapphire-warning";
        case ValueState.Information: return "text-sapphire-info";
        default: return false;
      }
    };

    return (
      <div ref={rootRef} className={cn("relative", className)} style={style}>
        <div
          ref={containerRef}
          className={inputContainerVariants({
            size: size as DatePickerSize,
            valueState: internalValueState,
            disabled,
            readonly,
          })}
          data-testid={dataTestId}
        >
          <input
            ref={inputRef}
            id={id}
            type="text"
            value={displayValue}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            readOnly={readonly}
            required={required}
            placeholder={effectivePlaceholder}
            aria-label={accessibleName}
            aria-labelledby={accessibleNameRef}
            className={cn(
              "flex-1 min-w-0 bg-transparent text-sm outline-none",
              "placeholder:text-sapphire-text-tertiary",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
          />

          {showClearIcon && displayValue && !disabled && !readonly && (
            <span onMouseDown={(e) => e.preventDefault()}>
              <Button
                design={ButtonDesign.SecondaryNeutral}
                size={isMedium ? ButtonSize.Small : ButtonSize.Medium}
                iconOnly
                icon={<DeclineIcon className={isMedium ? "h-3 w-3" : "h-4 w-4"} />}
                tabIndex={-1}
                onClick={handleClear}
                accessibleName="Clear datetime"
                className="shrink-0"
              />
            </span>
          )}

          <span onMouseDown={(e) => e.preventDefault()}>
            <Button
              design={ButtonDesign.SecondaryNeutral}
              size={isMedium ? ButtonSize.Small : ButtonSize.Medium}
              iconOnly
              icon={<CalendarIcon className={isMedium ? "h-3 w-3" : "h-4 w-4"} />}
              tabIndex={-1}
              onClick={togglePopover}
              disabled={disabled || readonly}
              accessibleName="Open date and time picker"
              accessibilityAttributes={{ expanded: isOpen }}
              className="shrink-0"
            />
          </span>
        </div>

        {/* Value state message */}
        {(valueStateMessage || internalValueState === ValueState.Negative) && (
          <div
            className={cn("mt-2 text-sm", getValueStateClass())}
            role="alert"
          >
            {valueStateMessage || (internalValueState === ValueState.Negative && "Invalid date/time format")}
          </div>
        )}

        {/* Responsive popover with calendar + time picker */}
        <ResponsivePopover
          open={isOpen}
          opener={containerRef}
          placement="Bottom"
          hideArrow
          noPadding
          headerText="Select Date & Time"
          footer={popoverFooter}
          onClose={closePopover}
          preventInitialFocus
        >
          {isPhoneDevice ? (
            // Phone mode: tabs for Date / Time
            <div className="flex flex-col w-full">
              <div className="flex border-b border-sapphire-border">
                <button
                  type="button"
                  className={cn(
                    "flex-1 py-2 px-4 text-sm font-medium text-center transition-colors",
                    phoneTab === "date"
                      ? "border-b-2 border-sapphire-border-accent text-sapphire-text-accent"
                      : "text-sapphire-text-tertiary hover:text-sapphire-text"
                  )}
                  onClick={() => setPhoneTab("date")}
                >
                  <CalendarIcon className="h-4 w-4 inline-block mr-1" />
                  Date
                </button>
                <button
                  type="button"
                  className={cn(
                    "flex-1 py-2 px-4 text-sm font-medium text-center transition-colors",
                    phoneTab === "time"
                      ? "border-b-2 border-sapphire-border-accent text-sapphire-text-accent"
                      : "text-sapphire-text-tertiary hover:text-sapphire-text"
                  )}
                  onClick={() => setPhoneTab("time")}
                >
                  <FobWatchIcon className="h-4 w-4 inline-block mr-1" />
                  Time
                </button>
              </div>
              {phoneTab === "date" ? (
                <Calendar {...calendarProps} />
              ) : (
                <div className="p-4 flex justify-center">
                  <TimePicker {...timePickerProps} />
                </div>
              )}
            </div>
          ) : (
            // Desktop mode: calendar + time picker side-by-side
            <div className="flex">
              <Calendar {...calendarProps} className="border-0 shadow-none rounded-none" />
              <TimePicker {...timePickerProps} />
            </div>
          )}
        </ResponsivePopover>

        {/* Hidden input for native form submission */}
        {name && (
          <input type="hidden" name={name} value={value} />
        )}
      </div>
    );
  }
