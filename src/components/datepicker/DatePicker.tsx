import React, { useState, useCallback, useRef, useImperativeHandle, useMemo, useId, useEffect } from "react";
import { cn, cva, subTestId } from "../../lib/utils";
import { Appointment2Icon } from "../../icons/Appointment2";
import { Button } from "../button";
import { ToggleButton } from "../toggle-button/ToggleButton";
import { ButtonDesign, ButtonSize } from "../../types/button";
import { DeclineIcon } from "../../icons";
import {
  DatePickerProps,
  DatePickerSize,
  DatePickerSelectionMode,
  ValueState,
} from "../../types/datepicker";
import { Calendar } from "../calendar/Calendar";
import { CalendarSelectionMode } from "../../types/calendar";
import { ResponsivePopover } from "../responsive-popover/ResponsivePopover";
import DateFormat from "@ui5/webcomponents-localization/dist/DateFormat.js";
import Locale from "@ui5/webcomponents-base/dist/locale/Locale.js";
import { useTranslation } from "react-i18next";
import { useEnsureCldr } from "../../i18n";
import { getLocaleDateFormat } from "../../lib/locale-utils";
import * as chrono from "chrono-node";

function isValidDate(d: Date | null | undefined): d is Date {
  return d instanceof Date && !isNaN(d.getTime());
}

/**
 * Extracts the visible (non-decorative) text from a label element.
 * Walks the DOM tree and skips nodes with aria-hidden="true"
 * (e.g. the required asterisk *) and sr-only elements
 * (e.g. the "(required)" screen-reader text), so the resulting
 * string matches the label text visible to sighted users.
 *
 * This avoids post-processing raw textContent with fragile string/regex
 * stripping and is resilient to Label markup changes.
 */
function getAccessibleLabelText(label: HTMLLabelElement): string {
  const parts: string[] = [];
  const walk = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      parts.push(node.textContent ?? "");
      return;
    }
    if (node instanceof HTMLElement) {
      if (node.getAttribute("aria-hidden") === "true") return;
      if (node.classList.contains("sr-only")) return;
    }
    node.childNodes.forEach(child => walk(child));
  };
  walk(label);
  return parts.join("").trim();
}

/**
 * Input container variants based on value state and size
 */
export const inputContainerVariants = cva(
  [
    "flex items-center border bg-card",
    "overflow-clip transition-colors relative",
  ],
  {
    variants: {
      size: {
        [DatePickerSize.Large]: [
          "h-10 rounded-lg",
          "pl-3.5 pr-1 py-1",
          "focus-within:border-2 focus-within:pl-[13px] focus-within:pr-[3px] focus-within:py-[3px]",
        ],
        [DatePickerSize.Medium]: [
          "h-8 rounded",
          "pl-3 pr-1 py-1",
          "focus-within:border-2 focus-within:pl-[11px] focus-within:pr-[3px] focus-within:py-[3px]",
        ],
      },
      valueState: {
        [ValueState.None]:
          "border-sapphire-border-active hover:border-sapphire-border-accent focus-within:border-sapphire-border-accent",
        [ValueState.Positive]:
          "bg-sapphire-positive-bg hover:bg-sapphire-canvas-primary focus-within:bg-sapphire-canvas-primary border-sapphire-positive focus-within:border-sapphire-positive",
        [ValueState.Negative]:
          "bg-sapphire-negative-bg hover:bg-sapphire-canvas-primary focus-within:bg-sapphire-canvas-primary border-sapphire-negative focus-within:border-sapphire-negative",
        [ValueState.Critical]:
          "bg-sapphire-warning-bg hover:bg-sapphire-canvas-primary focus-within:bg-sapphire-canvas-primary border-sapphire-warning focus-within:border-sapphire-warning",
        [ValueState.Information]:
          "bg-sapphire-info-bg hover:bg-sapphire-canvas-primary focus-within:bg-sapphire-canvas-primary border-sapphire-info focus-within:border-sapphire-info",
      },
      disabled: {
        true: "opacity-40 pointer-events-none",
        false: "",
      },
      readonly: {
        true: "bg-sapphire-bg-secondary",
        false: "",
      },
    },
    defaultVariants: {
      size: DatePickerSize.Large,
      valueState: ValueState.None,
      disabled: false,
      readonly: false,
    },
  }
);

/**
 * Maps value state to the corresponding text color class.
 * Defined at module level to avoid per-render allocation and reduce cognitive complexity.
 */
const valueStateTextColorMap: Record<string, string | undefined> = {
  [ValueState.Positive]: "text-sapphire-positive",
  [ValueState.Negative]: "text-sapphire-negative",
  [ValueState.Critical]: "text-sapphire-warning",
  [ValueState.Information]: "text-sapphire-info",
};

/**
 * DatePicker component
 *
 * A minimal date picker that combines an input field with a calendar popover.
 * Supports both single date and date range selection.
 * Reuses the Calendar component for date selection.
 */
export function DatePicker({
      size = DatePickerSize.Large,
      selectionMode = DatePickerSelectionMode.Single,
      delimiter = " - ",
      value: controlledValue,
      defaultValue = "",
      minDate,
      maxDate,
      disabled = false,
      readonly = false,
      required = false,
      open: controlledOpen,
      showClearIcon = true,
      placeholder,
      displayFormat,
      valueFormat = "yyyy-MM-dd",
      valueState = ValueState.None,
      valueStateMessage,
      accessibleName,
      accessibleNameRef,
      hideWeekNumbers = false,
      calendarWeekNumbering,
      firstDayOfWeek,
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
    }: DatePickerProps) {
    // Get locale from context
    const { t, i18n } = useTranslation("fx");
    const locale = i18n.language;
    const cldrReady = useEnsureCldr(locale);

    // Stable IDs for aria-describedby linkage
    const valueStateDescId = useId();

    // Resolve accessible name from associated <label> when id is set but accessibleName is not.
    // Uses document.getElementById(id) to avoid stale inputRef dependency issues —
    // the effect correctly depends on `id` and re-runs when it changes.
    const [labelText, setLabelText] = useState<string | undefined>(undefined);
    useEffect(() => {
      if (accessibleName) {
        setLabelText(undefined);
        return;
      }

      if (!id) {
        setLabelText(undefined);
        return;
      }

      let labelObserver: MutationObserver | null = null;

      const readLabel = () => {
        const input = document.getElementById(id) as HTMLInputElement | null;
        const firstLabel = input?.labels?.[0] ?? null;
        const next = firstLabel
          ? getAccessibleLabelText(firstLabel) || undefined
          : undefined;
        // Functional updater: React skips re-render when value is unchanged
        setLabelText(prev => prev === next ? prev : next);

        // Dynamically observe/disconnect the label element for text changes
        if (firstLabel && !labelObserver) {
          labelObserver = new MutationObserver(readLabel);
          labelObserver.observe(firstLabel, { childList: true, characterData: true, subtree: true });
        } else if (!firstLabel && labelObserver) {
          labelObserver.disconnect();
          labelObserver = null;
        }
      };

      readLabel();

      // Observe the DatePicker's parent container (closest common ancestor of
      // label and input) with childList only — covers label mount/unmount
      // without watching the entire document subtree.
      const container = rootRef.current?.parentElement;
      const containerObserver = container ? new MutationObserver(readLabel) : null;
      containerObserver?.observe(container!, { childList: true });

      return () => {
        containerObserver?.disconnect();
        labelObserver?.disconnect();
      };
    }, [accessibleName, id]);

    // Effective accessible name: explicit prop > label association > empty
    const effectiveAccessibleName = accessibleName ?? labelText ?? "";

    // Check if range mode
    const isRangeMode = selectionMode === DatePickerSelectionMode.Range;
    const isMedium = size === DatePickerSize.Medium;

    // Use locale-specific CLDR format if not explicitly provided
    const effectiveDisplayFormat = useMemo(() => {
      if (displayFormat) return displayFormat;
      if (!cldrReady) return "yyyy-MM-dd";
      return getLocaleDateFormat(locale);
    }, [displayFormat, cldrReady, locale]);

    // DateFormat.getDateInstance accesses CLDR data internally — guard with cldrReady.
    // Pass explicit locale so DateFormat uses the correct CLDR data (not the UI5 global default).
    // Cast: webcomponents Locale is runtime-compatible with OpenUI5 Locale but types diverge.
    const loc = useMemo(() => new Locale(locale) as unknown as import("sap/ui/core/Locale").default, [locale]);
    const { displayFmt, valueFmt, isoFmt } = useMemo(() => {
      if (!cldrReady) return { displayFmt: null, valueFmt: null, isoFmt: null };
      return {
        displayFmt: DateFormat.getDateInstance({ pattern: effectiveDisplayFormat }, loc),
        valueFmt: DateFormat.getDateInstance({ pattern: valueFormat }, loc),
        isoFmt: DateFormat.getDateInstance({ pattern: "yyyy-MM-dd" }, loc),
      };
    }, [cldrReady, effectiveDisplayFormat, valueFormat, loc]);

    const formatDate      = useCallback((d: Date): string => displayFmt?.format(d) ?? "", [displayFmt]);
    const formatDateValue = useCallback((d: Date | null): string => d && valueFmt ? valueFmt.format(d) : "", [valueFmt]);
    const formatISO       = useCallback((d: Date): string => isoFmt?.format(d) ?? "", [isoFmt]);

    const parseDate = useCallback((str: string, fmt: DateFormat | null): Date | null =>
      fmt ? (fmt.parse(str) as Date | null) ?? null : null, []);
    const parseDatePattern = useCallback((str: string, pattern: string): Date | null => {
      if (!cldrReady) return null;
      return parseDate(str, DateFormat.getDateInstance({ pattern, strictParsing: true }, loc));
    }, [parseDate, cldrReady, loc]);

    // Generate appropriate placeholder.
    // While CLDR is loading, show an empty placeholder instead of the English
    // fallback format — avoids a visible flash of "yyyy-MM-dd" for non-English locales.
    const getPlaceholder = (): string => {
      if (placeholder) return placeholder;
      if (!cldrReady && !displayFormat) return "";
      if (isRangeMode) return `${effectiveDisplayFormat}${delimiter}${effectiveDisplayFormat}`;
      return effectiveDisplayFormat;
    };
    const effectivePlaceholder = getPlaceholder();

    // State — only what cannot be derived
    const [internalValue, setInternalValue] = useState(defaultValue);
    const [internalOpen, setInternalOpen] = useState(false);
    const [inputText, setInputText] = useState(defaultValue);
    const [isEditing, setIsEditing] = useState(false);
    const [internalValueState, setInternalValueState] = useState<ValueState>(valueState as ValueState);

    // Controlled vs uncontrolled open
    const isOpen = controlledOpen ?? internalOpen;

    // Controlled vs uncontrolled value
    const value = controlledValue ?? internalValue;

    // Derived dates — parsed from `value` every render, no state needed.
    // Cheap string parse; no memo required.
    const selectedDate = (!isRangeMode && cldrReady && value)
      ? (parseDatePattern(value, valueFormat) ?? undefined)
      : undefined;

    const rangeParts = (isRangeMode && cldrReady && value) ? value.split(delimiter) : [];
    const rangeStartDate = rangeParts[0]
      ? (parseDatePattern(rangeParts[0].trim(), valueFormat) ?? undefined)
      : undefined;
    const rangeEndDate = rangeParts[1]
      ? (parseDatePattern(rangeParts[1].trim(), valueFormat) ?? undefined)
      : undefined;

    // Refs
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const rootRef = useRef<HTMLDivElement>(null);
    const skipFocusSyncRef = useRef(false);

    // Parse min/max dates
    const minDateObj = React.useMemo(
      () => (minDate ? parseDatePattern(minDate, "yyyy-MM-dd") : undefined),
      [minDate, parseDatePattern]
    );
    const maxDateObj = React.useMemo(
      () => (maxDate ? parseDatePattern(maxDate, "yyyy-MM-dd") : undefined),
      [maxDate, parseDatePattern]
    );

    // Helper: update value state with callback gate
    const updateValueState = useCallback((newState: ValueState, valid: boolean) => {
      if (onValueStateChange) {
        const result = onValueStateChange({ valueState: newState, valid });
        if (result === false) return;
      }
      setInternalValueState(newState);
    }, [onValueStateChange]);

    // Helper: open popover
    const openPopover = useCallback(() => {
      if (disabled || readonly) return;
      if (controlledOpen === undefined) {
        setInternalOpen(true);
      }
      onOpen?.();
    }, [disabled, readonly, controlledOpen, onOpen]);

    // Helper: close popover
    const closePopover = useCallback(() => {
      if (controlledOpen === undefined) {
        setInternalOpen(false);
      }
      onClose?.();
    }, [controlledOpen, onClose]);

    // Derived display value — computed every render, no memo/effect needed.
    // When cldrReady, formatter, or dates change, the next render shows the right text.
    const getDisplayValue = (): string => {
      if (!cldrReady) return "";
      if (isEditing) return inputText;
      if (isRangeMode && isValidDate(rangeStartDate)) {
        if (isValidDate(rangeEndDate)) {
          return `${formatDate(rangeStartDate)}${delimiter}${formatDate(rangeEndDate)}`;
        }
        return formatDate(rangeStartDate);
      }
      if (!isRangeMode && isValidDate(selectedDate)) {
        return formatDate(selectedDate);
      }
      return value;
    };
    const displayValue = getDisplayValue();

    // Parse date from input text with flexible parsing
    const parseDateFromInput = useCallback((text: string): Date | null => {
      if (!text || !text.trim()) return null;

      // Try display format first
      const parsed = parseDatePattern(text.trim(), effectiveDisplayFormat);
      if (isValidDate(parsed)) return parsed;

      // Try chrono for natural language
      try {
        const chronoResult = chrono.parseDate(text.trim());
        if (chronoResult && isValidDate(chronoResult)) return chronoResult;
      } catch { /* continue */ }

      // Common fallback formats
      const commonFormats = [
        "yyyy-MM-dd", "MM/dd/yyyy", "dd/MM/yyyy", "dd.MM.yyyy",
        "yyyy/MM/dd", "MMMM d, yyyy", "MMM d, yyyy", "d MMMM yyyy",
        "d MMM yyyy", "MM-dd-yyyy", "dd-MM-yyyy",
      ];
      for (const fmt of commonFormats) {
        const fallback = parseDatePattern(text.trim(), fmt);
        if (isValidDate(fallback)) return fallback;
      }

      return null;
    }, [effectiveDisplayFormat, parseDatePattern]);

    // Parse range from input text with flexible delimiters and natural language
    const parseRangeFromInput = useCallback((text: string): { start: Date | null; end: Date | null } => {
      if (!text || !text.trim()) {
        return { start: null, end: null };
      }

      const trimmedText = text.trim();

      // Try multiple common delimiters first (more reliable than chrono for explicit ranges)
      const delimiters = [
        delimiter, // User's specified delimiter first
        " - ",
        " to ",
        " – ", // en dash
        " — ", // em dash
        " TO ",
        "-",
        " through ",
        " thru ",
        "..",
        " .. ",
        " until ",
        " till ",
      ];

      for (const delim of delimiters) {
        if (trimmedText.includes(delim)) {
          const parts = trimmedText.split(delim).map(p => p.trim());
          if (parts.length === 2 && parts[0] && parts[1]) {
            const start = parseDateFromInput(parts[0]);
            const end = parseDateFromInput(parts[1]);
            if (start && end) {
              // Both dates parsed successfully
              return { start, end };
            } else if (start || end) {
              // At least one parsed - return what we have
              return { start, end };
            }
          }
        }
      }

      // If no delimiter worked, try chrono's range parsing as fallback
      try {
        const chronoResults = chrono.parse(trimmedText);
        if (chronoResults.length >= 2) {
          // Found multiple dates - use first two as range
          const start = chronoResults[0].start.date();
          const end = chronoResults[1].start.date();
          if (isValidDate(start) && isValidDate(end)) {
            return { start, end };
          }
        } else if (chronoResults.length === 1 && chronoResults[0].end) {
          // Found a single result with both start and end (e.g., "March 1-15")
          const start = chronoResults[0].start.date();
          const end = chronoResults[0].end.date();
          if (isValidDate(start) && isValidDate(end)) {
            return { start, end };
          }
        } else if (chronoResults.length === 1) {
          // Found one date only
          const date = chronoResults[0].start.date();
          if (isValidDate(date)) {
            return { start: date, end: null };
          }
        }
      } catch {
        // Chrono parsing failed
      }

      // Last resort - try single date
      const singleDate = parseDateFromInput(trimmedText);
      return { start: singleDate, end: null };
    }, [parseDateFromInput, delimiter]);

    // Track focus — sync inputText from current display so editing starts from correct text.
    // skipFocusSyncRef: when handleClear already set inputText, skip overwriting it.
    const handleFocus = useCallback(() => {
      if (skipFocusSyncRef.current) {
        skipFocusSyncRef.current = false;
      } else {
        setInputText(displayValue);
      }
      setIsEditing(true);
    }, [displayValue]);

    // Handle input change - just update the text, don't format
    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newText = e.target.value;
        setInputText(newText);

        if (isRangeMode) {
          // Parse range input with flexible delimiters
          const { start, end } = parseRangeFromInput(newText);
          const valid = start !== null && end !== null;

          onInput?.({
            value: newText,
            startDateValue: start,
            endDateValue: end,
            valid,
          });
        } else {
          // Parse single date
          const dateValue = parseDateFromInput(newText);
          const valid = dateValue !== null;

          onInput?.({
            value: newText,
            dateValue,
            valid,
          });
        }
      },
      [parseDateFromInput, parseRangeFromInput, onInput, isRangeMode]
    );

    // Handle calendar date selection
    const handleDateSelect = useCallback(
      (date: Date) => {
        if (isRangeMode) {
          // Range selection logic
          if (!rangeStartDate || (rangeStartDate && rangeEndDate)) {
            // Start new range
            const formattedValue = formatDateValue(date);
            updateValueState(valueState as ValueState, false);

            if (!controlledValue) {
              setInternalValue(formattedValue);
            }

            onChange?.({
              value: formattedValue,
              startDateValue: date,
              endDateValue: null,
              valid: false, // Range not complete yet
            });
          } else {
            // Complete the range
            const start = date < rangeStartDate ? date : rangeStartDate;
            const end = date < rangeStartDate ? rangeStartDate : date;

            const formattedValue = `${formatDateValue(start)}${delimiter}${formatDateValue(end)}`;
            updateValueState(valueState as ValueState, true);

            if (!controlledValue) {
              setInternalValue(formattedValue);
            }

            onChange?.({
              value: formattedValue,
              startDateValue: start,
              endDateValue: end,
              valid: true,
            });

            closePopover();
          }
        } else {
          // Single date selection
          const formattedValue = formatDateValue(date);
          updateValueState(valueState as ValueState, true);

          if (!controlledValue) {
            setInternalValue(formattedValue);
          }

          onChange?.({
            value: formattedValue,
            dateValue: date,
            valid: true,
          });


          closePopover();
        }
      },
      [
        formatDateValue,
        controlledValue,
        valueState,
        onChange,
        closePopover,
        updateValueState,
        isRangeMode,
        rangeStartDate,
        rangeEndDate,
        delimiter,
      ]
    );

    // Handle input blur - format and validate the date
    const handleBlur = useCallback(() => {
      setIsEditing(false);
      if (isRangeMode) {
        const { start: startDate, end: endDate } = parseRangeFromInput(inputText);

        if (startDate && isValidDate(startDate) && endDate && isValidDate(endDate)) {
          const formattedValue = `${formatDateValue(startDate)}${delimiter}${formatDateValue(endDate)}`;
          updateValueState(valueState as ValueState, true);

          if (!controlledValue) {
            setInternalValue(formattedValue);
          }

          onChange?.({
            value: formattedValue,
            startDateValue: startDate,
            endDateValue: endDate,
            valid: true,
          });
        } else if (inputText.trim()) {
          updateValueState(ValueState.Negative, false);

          onChange?.({
            value: inputText,
            startDateValue: startDate,
            endDateValue: endDate,
            valid: false,
          });
        } else {
          updateValueState(valueState as ValueState, true);
          if (!controlledValue) {
            setInternalValue("");
          }

          onChange?.({
            value: "",
            startDateValue: null,
            endDateValue: null,
            valid: true,
          });
        }
      } else {
        const dateValue = parseDateFromInput(inputText);

        if (dateValue && isValidDate(dateValue)) {
          const formattedValue = formatDateValue(dateValue);
          updateValueState(valueState as ValueState, true);

          if (!controlledValue) {
            setInternalValue(formattedValue);
          }

          onChange?.({
            value: formattedValue,
            dateValue,
            valid: true,
          });
        } else if (inputText.trim()) {
          updateValueState(ValueState.Negative, false);

          onChange?.({
            value: inputText,
            dateValue: null,
            valid: false,
          });
        } else {
          updateValueState(valueState as ValueState, true);
          if (!controlledValue) {
            setInternalValue("");
          }

          onChange?.({
            value: "",
            dateValue: null,
            valid: true,
          });
        }
      }
    }, [
      inputText,
      parseDateFromInput,
      parseRangeFromInput,
      formatDateValue,
      controlledValue,
      valueState,
      onChange,
      updateValueState,
      isRangeMode,
      delimiter,
    ]);

    // Toggle popover
    const togglePopover = useCallback(() => {
      if (disabled || readonly) return;

      if (isOpen) {
        closePopover();
      } else {
        openPopover();
      }
    }, [disabled, readonly, isOpen, openPopover, closePopover]);

    // Clear value
    const handleClear = useCallback(
      () => {
        setInputText("");
        skipFocusSyncRef.current = true; // prevent handleFocus from overwriting inputText
        updateValueState(valueState as ValueState, true);

        if (!controlledValue) {
          setInternalValue("");
        }

        if (isRangeMode) {
          onChange?.({
            value: "",
            startDateValue: null,
            endDateValue: null,
            valid: true,
          });
        } else {
          onChange?.({
            value: "",
            dateValue: null,
            valid: true,
          });
        }

        inputRef.current?.focus();
      },
      [controlledValue, valueState, onChange, updateValueState, isRangeMode]
    );

    // Handle keyboard events
    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
      // Enter key - parse and commit, but keep focus
      if (e.key === "Enter") {
        e.preventDefault();
        handleBlur();
        // handleBlur sets isEditing=false, but focus stays on the input.
        // Re-enable editing so subsequent keystrokes update the display.
        setIsEditing(true);
        return;
      }

      // F4 - toggle picker (when open, F4 goes to calendar for view switching)
      if (e.key === "F4") {
        e.preventDefault();
        if (!isOpen) {
          openPopover();
        }
        // When open, F4 propagates to Calendar for month/year view switching
        return;
      }

      // F6 - toggle picker open/close
      if (e.key === "F6") {
        e.preventDefault();
        if (isOpen) {
          closePopover();
        } else {
          openPopover();
        }
        return;
      }

      // Alt+Down or Alt+Up - open picker if closed, close if open
      if (e.altKey && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
        e.preventDefault();
        if (isOpen) {
          closePopover();
        } else {
          openPopover();
        }
        return;
      }

      // Escape - clear if clear icon is shown and there's a value, otherwise close picker
      if (e.key === "Escape") {
        e.preventDefault();
        if (isOpen) {
          closePopover();
        } else if (showClearIcon && displayValue && !disabled && !readonly) {
          handleClear();
        }
        return;
      }

      // PageUp/PageDown when picker is closed (single mode only)
      // UI5 spec: PageUp = increment, PageDown = decrement
      if (!isOpen && !isRangeMode && (e.key === "PageUp" || e.key === "PageDown")) {
        e.preventDefault();
        const currentDate = selectedDate || new Date();
        const direction = e.key === "PageUp" ? 1 : -1;
        let newDate: Date;

        if (e.ctrlKey && e.shiftKey) {
          // Ctrl+Shift+PageUp/Down: previous/next year
          const d = new Date(currentDate); d.setFullYear(d.getFullYear() + direction); newDate = d;
        } else if (e.shiftKey) {
          // Shift+PageUp/Down: previous/next month
          const d = new Date(currentDate); d.setMonth(d.getMonth() + direction); newDate = d;
        } else {
          // PageUp/Down: previous/next day
          const d = new Date(currentDate); d.setDate(d.getDate() + direction); newDate = d;
        }

        // Validate against min/max
        if (minDateObj && newDate < minDateObj) return;
        if (maxDateObj && newDate > maxDateObj) return;

        const formattedValue = formatDateValue(newDate);
        const formattedDisplay = formatDate(newDate);
        updateValueState(valueState as ValueState, true);

        if (!controlledValue) {
          setInternalValue(formattedValue);
        }

        // Update inputText so the display refreshes (isEditing is true while focused)
        setInputText(formattedDisplay);

        onChange?.({
          value: formattedValue,
          dateValue: newDate,
          valid: true,
        });
        return;
      }
    }, [
      handleBlur,
      isOpen,
      openPopover,
      closePopover,
      isRangeMode,
      selectedDate,
      minDateObj,
      maxDateObj,
      controlledValue,
      valueState,
      onChange,
      updateValueState,
      formatDateValue,
      formatDate,
      showClearIcon,
      displayValue,
      disabled,
      readonly,
      handleClear,
    ]);

    // Helper: check if value is in valid range
    const isInValidRange = useCallback((val: string): boolean => {
      const parsed = parseDatePattern(val, valueFormat);
      if (!isValidDate(parsed)) return false;
      if (minDateObj && parsed < minDateObj) return false;
      if (maxDateObj && parsed > maxDateObj) return false;
      return true;
    }, [valueFormat, minDateObj, maxDateObj, parseDatePattern]);

    // Helper: check if value is valid
    const isValidValue = useCallback((val: string): boolean => {
      return isValidDate(parseDatePattern(val, valueFormat));
    }, [valueFormat, parseDatePattern]);

    // Imperative ref handle
    useImperativeHandle(ref, () => ({
      formatValue(date: Date): string {
        return formatDate(date);
      },
      isValidValue(val: string): boolean {
        return isValidValue(val);
      },
      isInValidRange(val: string): boolean {
        return isInValidRange(val);
      },
      isValidDisplayValue(val: string): boolean {
        return isValidDate(parseDatePattern(val, effectiveDisplayFormat));
      },
      isValidMin(): boolean {
        if (!minDate) return true;
        return isValidDate(parseDatePattern(minDate, valueFormat));
      },
      isValidMax(): boolean {
        if (!maxDate) return true;
        return isValidDate(parseDatePattern(maxDate, valueFormat));
      },
      get dateValue(): Date | null {
        return selectedDate && isValidDate(selectedDate) ? selectedDate : null;
      },
      get dateValueUTC(): Date | null {
        if (!selectedDate || !isValidDate(selectedDate)) return null;
        return new Date(Date.UTC(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate()
        ));
      },
      get startDateValue(): Date | null {
        if (!isRangeMode) return null;
        return rangeStartDate && isValidDate(rangeStartDate) ? rangeStartDate : null;
      },
      get endDateValue(): Date | null {
        if (!isRangeMode) return null;
        return rangeEndDate && isValidDate(rangeEndDate) ? rangeEndDate : null;
      },
      get startValue(): string {
        if (!isRangeMode || !rangeStartDate || !isValidDate(rangeStartDate)) return "";
        return formatDate(rangeStartDate);
      },
      get endValue(): string {
        if (!isRangeMode || !rangeEndDate || !isValidDate(rangeEndDate)) return "";
        return formatDate(rangeEndDate);
      },
      get nativeElement(): HTMLDivElement | null {
        return rootRef.current;
      },
      get formValidity() {
        const currentValue = controlledValue ?? internalValue;
        const parsed = currentValue ? parseDatePattern(currentValue, valueFormat) : null;
        const isValidDate_ = parsed && isValidDate(parsed);
        const valueMissing = required && !currentValue;
        const patternMismatch = !!currentValue && !isValidDate_;
        const rangeUnderflow = isValidDate_ && minDateObj ? parsed < minDateObj : false;
        const rangeOverflow = isValidDate_ && maxDateObj ? parsed > maxDateObj : false;
        return {
          valueMissing,
          patternMismatch,
          rangeUnderflow,
          rangeOverflow,
          valid: !valueMissing && !patternMismatch && !rangeUnderflow && !rangeOverflow,
        };
      },
      focus() {
        inputRef.current?.focus();
      },
      blur() {
        inputRef.current?.blur();
      },
    }), [
      effectiveDisplayFormat,
      selectedDate,
      rangeStartDate,
      rangeEndDate,
      isRangeMode,
      isValidValue,
      isInValidRange,
      controlledValue,
      internalValue,
      valueFormat,
      minDate,
      maxDate,
      required,
      minDateObj,
      maxDateObj,
      formatDate,
      parseDatePattern,
    ]);

    return (
      <div ref={rootRef} className={cn("relative", className)} style={style}>
        <div
          ref={containerRef}
          className={cn(
            inputContainerVariants({
              size: size as DatePickerSize,
              valueState: internalValueState,
              disabled,
              readonly,
            }),
            isOpen && !disabled && !readonly && internalValueState !== ValueState.None && "bg-sapphire-canvas-primary",
          )}
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
            aria-haspopup="grid"
            aria-roledescription={isRangeMode ? t("DATERANGE_DESCRIPTION") : t("DATEPICKER_DATE_DESCRIPTION")}
            aria-required={required ? "true" : undefined}
            aria-describedby={
              (valueStateMessage || internalValueState === ValueState.Negative)
                ? valueStateDescId
                : undefined
            }
            className={cn(
              "flex-1 min-w-0 bg-transparent text-sm outline-none",
              "placeholder:text-sapphire-text-tertiary",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
          />

          {/* Clear button */}
          {showClearIcon && displayValue && !disabled && !readonly && (
            <span onMouseDown={(e) => e.preventDefault()}>
              <Button
                design={ButtonDesign.SecondaryNeutral}
                size={isMedium ? ButtonSize.Small : ButtonSize.Medium}
                iconOnly
                icon={<span className={cn("inline-flex items-center justify-center", isMedium ? "h-3 w-3" : "h-4 w-4")}><DeclineIcon className="h-full w-full" /></span>}
                tabIndex={-1}
                onClick={handleClear}
                accessibleName={t("INPUT_CLEAR_ICON_ACC_NAME")}
                className="shrink-0"
                data-testid={subTestId(dataTestId, "clear")}
              />
            </span>
          )}

          {/* Calendar toggle button */}
          <span onMouseDown={(e) => e.preventDefault()}>
            <ToggleButton
            design={ButtonDesign.SecondaryNeutral}
            size={isMedium ? ButtonSize.Small : ButtonSize.Medium}
            iconOnly
            icon={<span className={cn("inline-flex items-center justify-center", isMedium ? "h-3 w-3" : "h-4 w-4")}><Appointment2Icon className="h-full w-full" /></span>}
            pressed={isOpen}
            tabIndex={-1}
            onClick={togglePopover}
            disabled={disabled || readonly}
            accessibleName={isOpen ? t("DATEPICKER_OPEN_ICON_TITLE_OPENED") : t("DATEPICKER_OPEN_ICON_TITLE")}
            className="shrink-0 active:!bg-sapphire-brand-toggle-background"
            data-testid={subTestId(dataTestId, "calendar-toggle")}
          />
          </span>
        </div>

        {/* Value state message */}
        {(valueStateMessage || internalValueState === ValueState.Negative) && (
          <div
            id={valueStateDescId}
            className={cn("mt-2 text-sm", valueStateTextColorMap[internalValueState])}
            role="alert"
          >
            {valueStateMessage || (internalValueState === ValueState.Negative && "Invalid date format")}
          </div>
        )}

        {/* Calendar popover using ResponsivePopover */}
        <ResponsivePopover
          open={isOpen}
          opener={containerRef}
          placement="Bottom"
          horizontalAlign="Start"
          hideArrow
          noPadding
          headerText="Select Date"
          preventInitialFocus
          accessibleName={isRangeMode
            ? t("DATERANGEPICKER_POPOVER_ACCESSIBLE_NAME", { "0": effectiveAccessibleName })
            : t("DATEPICKER_POPOVER_ACCESSIBLE_NAME", { "0": effectiveAccessibleName })
          }
          contentOnlyOnDesktop
          onClose={closePopover}
        >
          <Calendar
            selectionMode={isRangeMode ? CalendarSelectionMode.Range : CalendarSelectionMode.Single}
            selectedDates={!isRangeMode && selectedDate ? [formatISO(selectedDate)] : []}
            rangeStartDate={isRangeMode && rangeStartDate ? formatISO(rangeStartDate) : undefined}
            rangeEndDate={isRangeMode && rangeEndDate ? formatISO(rangeEndDate) : undefined}
            autoFocus
            onSelectionChange={(detail) => {
              if (isRangeMode) {
                // Handle range selection from calendar
                if (detail.selectedValues.length === 2) {
                  // Calendar already sorted start/end
                  const start = parseDatePattern(detail.selectedValues[0], "yyyy-MM-dd");
                  const end   = parseDatePattern(detail.selectedValues[1], "yyyy-MM-dd");
                  if (isValidDate(start) && isValidDate(end)) {
                    const formattedValue = `${formatDateValue(start)}${delimiter}${formatDateValue(end)}`;
                    updateValueState(valueState as ValueState, true);

                    if (!controlledValue) {
                      setInternalValue(formattedValue);
                    }

                    onChange?.({
                      value: formattedValue,
                      startDateValue: start,
                      endDateValue: end,
                      valid: true,
                    });

                    closePopover();
                  }
                } else if (detail.selectedValues.length === 1) {
                  const date = parseDatePattern(detail.selectedValues[0], "yyyy-MM-dd");
                  if (isValidDate(date)) {
                    handleDateSelect(date);
                  }
                }
              } else {
                // Handle single date selection
                if (detail.selectedValues.length > 0) {
                  const parsed = parseDatePattern(detail.selectedValues[0], "yyyy-MM-dd");
                  if (isValidDate(parsed)) handleDateSelect(parsed);
                }
              }
            }}
            minDate={minDateObj ? formatISO(minDateObj) : undefined}
            maxDate={maxDateObj ? formatISO(maxDateObj) : undefined}
            hideWeekNumbers={hideWeekNumbers}
            calendarWeekNumbering={calendarWeekNumbering}
            firstDayOfWeek={firstDayOfWeek}
            locale={locale}
            onKeyDown={(e) => {
              if (e.key === "F6") {
                e.preventDefault();
                closePopover();
                inputRef.current?.focus();
              }
            }}
            className="border-0 shadow-none rounded-none"
          />
        </ResponsivePopover>

        {/* Hidden input for native form submission */}
        {name && (
          <input
            type="hidden"
            name={name}
            value={value}
          />
        )}
      </div>
    );
  }
