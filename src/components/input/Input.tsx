import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
  useImperativeHandle,
  useId,
  type CompositionEvent,
} from "react";
import { cn, cva, subTestId } from "../../lib/utils";
import { valueStateIcons, valueStateMessageColors, valueStateLabelKeys } from "../../lib/value-state-utils";
import { DeclineIcon } from "../../icons/Decline";
import { Button } from "../button";
import { ButtonDesign, ButtonSize } from "../../types/button";
import {
  InputProps,
  InputType,
  InputSize,
  ValueState,
} from "../../types/input";
import { useTranslation } from "react-i18next";
import type { I18nStrings } from "../../i18n/types";

/**
 * Input container variants based on value state and size
 */
const inputContainerVariants = cva(
  [
    "flex items-center w-full border bg-sapphire-canvas-primary",
    "overflow-clip transition-colors relative",
  ],
  {
    variants: {
      size: {
        [InputSize.Large]: [
          "h-10 rounded-lg min-w-[2.75rem]",
          "pl-3.5 pr-1 py-1 gap-2",
          "focus-within:border-2 focus-within:pl-[13px] focus-within:pr-[3px] focus-within:py-[3px]",
        ],
        [InputSize.Small]: [
          "h-8 rounded min-w-[2rem]",
          "pl-3 pr-1 py-1 gap-2",
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
        true: "opacity-40 cursor-not-allowed pointer-events-none",
        false: "",
      },
      readonly: {
        true: "bg-sapphire-background-secondary border-sapphire-border-primary hover:border-sapphire-border-primary focus-within:!border-sapphire-border-accent",
        false: "",
      },
    },
    defaultVariants: {
      size: InputSize.Large,
      valueState: ValueState.None,
      disabled: false,
      readonly: false,
    },
  }
);

/**
 * Map InputType to native input type
 */
function mapInputType(type: InputType | `${InputType}`): string {
  switch (type) {
    case InputType.Text:
      return "text";
    case InputType.Email:
      return "email";
    case InputType.Number:
      return "number";
    case InputType.Password:
      return "password";
    case InputType.Tel:
      return "tel";
    case InputType.URL:
      return "url";
    case InputType.Search:
      return "search";
    default:
      return "text";
  }
}

/**
 * Input component
 *
 * A native React implementation of the UI5 Input with full enterprise features:
 * - All standard input types (text, email, number, password, tel, url, search)
 * - Value states with semantic feedback
 * - Icons and clear button
 * - Full accessibility support
 * - Controlled and uncontrolled modes
 * - Form integration
 * - AI-ready imperative API
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Input placeholder="Enter your name" />
 *
 * // With validation
 * <Input
 *   type="Email"
 *   valueState="Negative"
 *   valueStateMessage="Please enter a valid email"
 * />
 *
 * // Controlled
 * <Input value={email} onChange={(d) => setEmail(d.value)} />
 * ```
 */
function InputBase(
    {
      // Value
      value: controlledValue,
      defaultValue = "",

      // Type
      type = InputType.Text,

      // Size
      size = InputSize.Large,

      // Behavior
      disabled = false,
      readonly = false,
      required = false,
      autocomplete,

      // Validation
      valueState = ValueState.None,
      valueStateMessage,
      showValueStateIcon = false,

      // Constraints
      maxLength,
      minLength,
      pattern,
      min,
      max,
      step,

      // Display
      placeholder,
      showClearIcon = false,
      hideStepButtons = false,

      // Icons
      icon,
      iconPosition = "start",

      // Accessibility
      accessibleName,
      accessibleNameRef,
      accessibleDescriptionRef,

      // Form
      name,
      id: providedId,

      // Events
      onInput,
      onChange,
      onFocus,
      onBlur,
      onKeyDown,
      onKeyUp,

      // Standard
      className,
      style,
      "data-testid": dataTestId,
      "data-ai-field": dataAiField,
      accessibilityAttributes,
      ref,
    }: InputProps
  ) {
    // i18n
    const { t } = useTranslation("fx");

    // Refs
    const inputRef = useRef<HTMLInputElement>(null);

    // Generate unique IDs
    const generatedId = useId();
    const inputId = providedId ?? generatedId;
    const messageId = `${inputId}-message`;

    // State
    const [internalValue, setInternalValue] = useState(defaultValue);
    const [previousValue, setPreviousValue] = useState(defaultValue);
    const [valueOnFocus, setValueOnFocus] = useState(defaultValue);
    const [isFocused, setIsFocused] = useState(false);
    const [isComposing, setIsComposing] = useState(false);

    // Controlled vs uncontrolled
    const value = controlledValue ?? internalValue;
    const isControlled = controlledValue !== undefined;

    // Check if Number type (maxLength doesn't apply)
    const isNumberType = String(type) === "Number";

    // Normalize valueState to enum value for comparisons
    const normalizedValueState = valueState as ValueState;
    const isNegativeState = normalizedValueState === ValueState.Negative;

    // Expose imperative methods via ref
    useImperativeHandle(
      ref,
      () => ({
        focus: () => inputRef.current?.focus(),
        blur: () => inputRef.current?.blur(),
        select: () => inputRef.current?.select(),
        setSelectionRange: (start: number, end: number) =>
          inputRef.current?.setSelectionRange(start, end),
        getValue: () => value,
        getValueAsNumber: () => inputRef.current?.valueAsNumber ?? parseFloat(value) ?? NaN,
        setValue: (newValue: string, options?: { silent?: boolean }) => {
          if (!isControlled) {
            setInternalValue(newValue);
          }
          if (!options?.silent) {
            onInput?.(newValue);
            onChange?.({
              value: newValue,
              previousValue: value,
              source: "programmatic",
            });
          }
        },
        clear: () => {
          if (!isControlled) {
            setInternalValue("");
          }
          onInput?.("");
          onChange?.({
            value: "",
            previousValue: value,
            source: "programmatic",
          });
        },
        getState: () => ({
          value,
          focused: isFocused,
          valid: inputRef.current?.checkValidity() ?? true,
          valueState: valueState as ValueState,
        }),
        checkValidity: () => inputRef.current?.checkValidity() ?? true,
        reportValidity: () => inputRef.current?.reportValidity() ?? true,
        setCustomValidity: (message: string) =>
          inputRef.current?.setCustomValidity(message),
        get nativeElement() {
          return inputRef.current;
        },
      }),
      [value, isFocused, valueState, isControlled, onInput, onChange]
    );

    // Sync internal value with controlled value
    useEffect(() => {
      if (isControlled) {
        setInternalValue(controlledValue);
      }
    }, [controlledValue, isControlled]);

    // Handle input change — only fires onInput (real-time), NOT onChange
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;

        if (!isControlled) {
          setInternalValue(newValue);
        }

        // Call onInput for real-time updates (every keystroke)
        onInput?.(newValue);
      },
      [isControlled, onInput]
    );

    // Handle focus
    const handleFocus = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(true);
        setPreviousValue(value);
        setValueOnFocus(value);
        onFocus?.(e);
      },
      [value, onFocus]
    );

    // Handle blur - commit value: fire onChange only if value changed since focus
    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(false);

        // Fire onChange on commit (blur) only if value actually changed since focus
        const currentValue = e.target.value;
        if (currentValue !== valueOnFocus) {
          onChange?.({
            value: currentValue,
            previousValue: valueOnFocus,
            source: "user",
          });
          setPreviousValue(currentValue);
        }

        onBlur?.(e);
      },
      [valueOnFocus, onChange, onBlur]
    );

    // Handle key down
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Skip keyboard handling during IME composition
        if (isComposing) {
          onKeyDown?.(e);
          return;
        }

        // Escape - if clear icon is shown and there's a value, clear it
        if (e.key === "Escape") {
          if (showClearIcon && value && !disabled && !readonly) {
            e.preventDefault();
            const oldValue = value;
            if (!isControlled) {
              setInternalValue("");
            }
            onInput?.("");
            onChange?.({
              value: "",
              previousValue: oldValue,
              source: "user",
            });
          } else {
            // Otherwise revert to value when focused
            if (!isControlled) {
              setInternalValue(valueOnFocus);
            }
            onInput?.(valueOnFocus);
            setPreviousValue(valueOnFocus);
            // Don't fire onChange since we're reverting
            inputRef.current?.blur();
          }
        }

        // Enter commits value — blur will fire onChange if value changed
        if (e.key === "Enter") {
          inputRef.current?.blur();
        }

        onKeyDown?.(e);
      },
      [value, previousValue, valueOnFocus, isControlled, isComposing, showClearIcon, disabled, readonly, onChange, onInput, onKeyDown]
    );

    // Handle IME composition start
    const handleCompositionStart = useCallback(() => {
      setIsComposing(true);
    }, []);

    // Handle IME composition end
    const handleCompositionEnd = useCallback(
      (e: CompositionEvent<HTMLInputElement>) => {
        setIsComposing(false);
        // Process the composed value
        const newValue = e.currentTarget.value;
        if (!isControlled) {
          setInternalValue(newValue);
        }
        onInput?.(newValue);
      },
      [isControlled, onInput]
    );

    // Handle clear
    const handleClear = useCallback(
      (detail: { originalEvent: React.SyntheticEvent; isKeyboard: boolean }) => {
        detail.originalEvent.preventDefault();
        detail.originalEvent.stopPropagation();

        const oldValue = value;

        if (!isControlled) {
          setInternalValue("");
        }

        onInput?.("");
        onChange?.({
          value: "",
          previousValue: oldValue,
          source: "user",
        });

        // Return focus to input
        inputRef.current?.focus();
      },
      [value, isControlled, onInput, onChange]
    );

    // Show clear icon?
    // Render (but hide) the button when focused + empty so clearing doesn't shrink the input.
    // When unfocused + empty, remove it entirely so it doesn't eat into the typing area.
    const clearVisible = showClearIcon && !!value && !disabled && !readonly;
    const clearReserveSpace = showClearIcon && !disabled && !readonly && isFocused && !value;
    const showClear = clearVisible || clearReserveSpace;

    // Get value state icon
    const ValueStateIcon = valueStateIcons[valueState as ValueState];
    const showStateIcon = showValueStateIcon && ValueStateIcon;

    // Build aria-describedby
    const ariaDescribedBy = useMemo(() => {
      const ids: string[] = [];
      if (valueStateMessage) ids.push(messageId);
      if (accessibleDescriptionRef) ids.push(accessibleDescriptionRef);
      return ids.length > 0 ? ids.join(" ") : undefined;
    }, [valueStateMessage, accessibleDescriptionRef, messageId]);

    return (
      <div
        className={cn("w-full", className)}
        style={style}
        data-testid={dataTestId}
        data-ai-field={dataAiField}
      >
        {/* Input container */}
        <div
          className={cn(
            inputContainerVariants({
              size: size as InputSize,
              valueState: valueState as ValueState,
              disabled,
              readonly,
            }),
            hideStepButtons && "[&_input::-webkit-inner-spin-button]:appearance-none [&_input::-webkit-outer-spin-button]:appearance-none [&_input]:[-moz-appearance:textfield]"
          )}
        >
          {/* Start icon */}
          {icon && iconPosition === "start" && (
            <span
              className="flex items-center justify-center shrink-0 text-sapphire-text-tertiary"
              data-testid={subTestId(dataTestId, "start-icon")}
            >
              {icon}
            </span>
          )}

          {/* Native input */}
          <input
            ref={inputRef}
            id={inputId}
            name={name}
            type={mapInputType(type)}
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readonly}
            required={required}
            autoComplete={autocomplete}
            maxLength={isNumberType ? undefined : maxLength}
            minLength={minLength}
            pattern={pattern}
            min={isNumberType ? min : undefined}
            max={isNumberType ? max : undefined}
            step={isNumberType ? step : undefined}
            role={accessibilityAttributes?.role}
            aria-label={accessibleName}
            aria-labelledby={accessibleNameRef}
            aria-describedby={ariaDescribedBy}
            aria-invalid={isNegativeState || undefined}
            aria-required={required || undefined}
            aria-disabled={disabled || undefined}
            aria-readonly={readonly || undefined}
            aria-controls={accessibilityAttributes?.controls}
            aria-haspopup={accessibilityAttributes?.hasPopup || undefined}
            aria-expanded={accessibilityAttributes?.expanded}
            aria-autocomplete={accessibilityAttributes?.autoComplete}
            aria-activedescendant={accessibilityAttributes?.activeDescendant}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onKeyUp={onKeyUp}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            className={cn(
              "flex-1 h-full bg-transparent text-sm text-sapphire-text-primary",
              "outline-none min-w-0",
              "placeholder:text-sapphire-text-tertiary placeholder:italic",
              "disabled:cursor-not-allowed",
              readonly && "text-sapphire-text-tertiary",
              "file:border-0 file:bg-transparent file:text-sm file:font-medium"
            )}
          />

          {/* Clear icon — always rendered when enabled to preserve layout, invisible when empty */}
          {showClear && (
            <span
              onMouseDown={(e) => e.preventDefault()}
              className={cn(!clearVisible && "invisible")}
            >
              <Button
                design={ButtonDesign.SecondaryNeutral}
                size={size === InputSize.Small ? ButtonSize.Small : ButtonSize.Medium}
                iconOnly
                icon={<DeclineIcon className={size === InputSize.Small ? "h-3 w-3" : "h-4 w-4"} />}
                tabIndex={-1}
                onClick={handleClear}
                accessibleName={t("INPUT_CLEAR")}
                className="shrink-0"
                data-testid={subTestId(dataTestId, "clear")}
              />
            </span>
          )}

          {/* End icon */}
          {icon && iconPosition === "end" && (
            <span
              className="flex items-center justify-center shrink-0 text-sapphire-text-tertiary"
              data-testid={subTestId(dataTestId, "end-icon")}
            >
              {icon}
            </span>
          )}
        </div>

        {/* Value state message */}
        {valueStateMessage && (
          <div
            id={messageId}
            role={isNegativeState ? "alert" : undefined}
            aria-live={isNegativeState ? "assertive" : "polite"}
            className={cn(
              "mt-2 text-sm flex items-start gap-1",
              valueStateMessageColors[valueState as ValueState]
            )}
          >
            {/* Screen reader prefix for value state type */}
            {normalizedValueState !== ValueState.None && valueStateLabelKeys[normalizedValueState] && (
              <span className="sr-only">
                {t(valueStateLabelKeys[normalizedValueState] as keyof I18nStrings)}:{" "}
              </span>
            )}
            {/* Value state icon */}
            {showStateIcon && ValueStateIcon && (
              <ValueStateIcon className="h-4 w-4 shrink-0 mt-0.5" />
            )}
            <span>{valueStateMessage}</span>
          </div>
        )}
      </div>
    );
  }

// Wrap in React.memo to prevent unnecessary re-renders
export const Input = React.memo(InputBase);
Input.displayName = "Input";
