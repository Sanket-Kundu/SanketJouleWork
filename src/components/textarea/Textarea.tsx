import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useImperativeHandle,
  useId,
} from "react";
import { cn, cva } from "../../lib/utils";
import { valueStateIcons, valueStateMessageColors, valueStateLabelKeys } from "../../lib/value-state-utils";
import {
  TextareaProps,
  ValueState,
} from "../../types/textarea";
import { useTranslation } from "react-i18next";
import type { I18nStrings } from "../../i18n/types";

/**
 * Textarea container variants based on value state
 */
const textareaContainerVariants = cva(
  [
    "flex flex-col w-full rounded border bg-sapphire-canvas-primary",
    "overflow-clip transition-colors relative",
    "p-1",
    "focus-within:border-2 focus-within:p-[3px]",
  ],
  {
    variants: {
      valueState: {
        [ValueState.None]:
          "border-sapphire-border-secondary hover:border-sapphire-border-accent focus-within:border-sapphire-border-accent",
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
      valueState: ValueState.None,
      disabled: false,
      readonly: false,
    },
  }
);

/**
 * Textarea component
 *
 * A native React implementation of the UI5 TextArea with full enterprise features:
 * - Multi-line text input
 * - Value states with semantic feedback
 * - Growing behavior with auto-expand
 * - Character counter and max length
 * - Full accessibility support
 * - Controlled and uncontrolled modes
 * - Form integration
 * - AI-ready imperative API
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Textarea placeholder="Enter your comments" rows={4} />
 *
 * // With validation
 * <Textarea
 *   maxLength={200}
 *   showExceededText
 *   valueState="Negative"
 *   valueStateMessage="Comments are required"
 * />
 *
 * // Growing textarea
 * <Textarea
 *   growing
 *   growingMaxRows={10}
 *   placeholder="Type here..."
 * />
 *
 * // Controlled
 * <Textarea value={value} onChange={(detail) => setValue(detail.value)} />
 * ```
 */
export function Textarea(props: TextareaProps) {
    const {
      value: controlledValue,
      defaultValue = "",
      disabled = false,
      readonly = false,
      required = false,
      autocomplete,
      valueState = ValueState.None,
      valueStateMessage,
      maxLength,
      showExceededText = false,
      minLength,
      rows = 0,
      growing = false,
      growingMaxRows,
      placeholder,
      accessibleName,
      accessibleNameRef,
      accessibleDescriptionRef,
      name,
      id: providedId,
      onInput,
      onChange,
      onFocus,
      onBlur,
      onKeyDown,
      onKeyUp,
      onSelect,
      onScroll,
      className,
      style,
      "data-testid": dataTestId,
      "data-ai-field": dataAiField,
      ref,
    } = props;

    // Context
    const { t } = useTranslation("fx");

    // State
    const [internalValue, setInternalValue] = useState(defaultValue);
    const [focused, setFocused] = useState(false);
    const [previousValue, setPreviousValue] = useState(defaultValue);

    // Refs
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const isComposing = useRef(false);

    // Determine if controlled
    const isControlled = controlledValue !== undefined;
    const currentValue = isControlled ? controlledValue : internalValue;

    // IDs
    const generatedId = useId();
    const textareaId = providedId || generatedId;
    const valueStateId = `${textareaId}-valuestate`;

    // Character counting
    const characterCount = currentValue.length;
    const exceededCharacters = maxLength ? Math.max(0, characterCount - maxLength) : 0;
    const hasExceededMax = exceededCharacters > 0;

    // Auto-grow calculation
    useEffect(() => {
      if (growing && textareaRef.current) {
        const textarea = textareaRef.current;

        // Reset height to auto to get the correct scrollHeight
        textarea.style.height = "auto";

        // Calculate new height
        const newHeight = textarea.scrollHeight;

        // Apply height constraints
        if (growingMaxRows) {
          const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
          const maxHeight = lineHeight * growingMaxRows;
          textarea.style.height = `${Math.min(newHeight, maxHeight)}px`;
        } else {
          textarea.style.height = `${newHeight}px`;
        }
      }
    }, [currentValue, growing, growingMaxRows]);

    // Handle internal value updates
    const handleInternalValueChange = useCallback(
      (newValue: string) => {
        if (!isControlled) {
          setInternalValue(newValue);
        }
      },
      [isControlled]
    );

    // Input handler
    const handleInput = useCallback(
      (e: React.FormEvent<HTMLTextAreaElement>) => {
        if (isComposing.current) return;

        const newValue = e.currentTarget.value;
        handleInternalValueChange(newValue);

        onInput?.({
          value: newValue,
          escapePressed: false,
        });
      },
      [handleInternalValueChange, onInput]
    );

    // Change handler (on blur)
    const handleChange = useCallback(() => {
      if (currentValue !== previousValue) {
        onChange?.({
          value: currentValue,
          previousValue,
          source: "user",
        });
        setPreviousValue(currentValue);
      }
    }, [currentValue, previousValue, onChange]);

    // Focus handler
    const handleFocus = useCallback(
      (e: React.FocusEvent<HTMLTextAreaElement>) => {
        setFocused(true);
        onFocus?.(e);
      },
      [onFocus]
    );

    // Blur handler
    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLTextAreaElement>) => {
        setFocused(false);
        handleChange();
        onBlur?.(e);
      },
      [onBlur, handleChange]
    );

    // Key down handler
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Escape") {
          onInput?.({
            value: currentValue,
            escapePressed: true,
          });
        }
        onKeyDown?.(e);
      },
      [onKeyDown, onInput, currentValue]
    );

    // Select handler
    const handleSelect = useCallback(
      () => {
        if (!textareaRef.current) return;
        const { selectionStart, selectionEnd, value } = textareaRef.current;
        onSelect?.({
          start: selectionStart,
          end: selectionEnd,
          selectedText: value.substring(selectionStart, selectionEnd),
        });
      },
      [onSelect]
    );

    // Composition handlers for IME input
    const handleCompositionStart = useCallback(() => {
      isComposing.current = true;
    }, []);

    const handleCompositionEnd = useCallback(
      (e: React.CompositionEvent<HTMLTextAreaElement>) => {
        isComposing.current = false;
        const newValue = e.currentTarget.value;
        handleInternalValueChange(newValue);
        onInput?.({
          value: newValue,
          escapePressed: false,
        });
      },
      [handleInternalValueChange, onInput]
    );

    // Imperative handle
    useImperativeHandle(
      ref,
      () => ({
        focus: () => textareaRef.current?.focus(),
        blur: () => textareaRef.current?.blur(),
        select: () => textareaRef.current?.select(),
        setSelectionRange: (start: number, end: number) => {
          textareaRef.current?.setSelectionRange(start, end);
        },
        getValue: () => currentValue,
        setValue: (value: string, options?: { silent?: boolean }) => {
          handleInternalValueChange(value);
          if (!options?.silent) {
            onChange?.({
              value,
              previousValue: currentValue,
              source: "programmatic",
            });
          }
          setPreviousValue(value);
        },
        clear: () => {
          handleInternalValueChange("");
          onChange?.({
            value: "",
            previousValue: currentValue,
            source: "programmatic",
          });
          setPreviousValue("");
        },
        getState: () => ({
          value: currentValue,
          focused,
          valid: textareaRef.current?.checkValidity() ?? true,
          valueState: valueState as ValueState,
          characterCount,
          exceededCharacters,
        }),
        checkValidity: () => textareaRef.current?.checkValidity() ?? true,
        reportValidity: () => textareaRef.current?.reportValidity() ?? true,
        setCustomValidity: (message: string) => {
          textareaRef.current?.setCustomValidity(message);
        },
        scrollTo: (x: number, y: number) => {
          textareaRef.current?.scrollTo(x, y);
        },
        get nativeElement() {
          return textareaRef.current;
        },
      }),
      [
        currentValue,
        focused,
        valueState,
        characterCount,
        exceededCharacters,
        handleInternalValueChange,
        onChange,
      ]
    );

    const effectiveValueState = valueState as ValueState;
    const isNegativeState = effectiveValueState === ValueState.Negative;

    // Value state icon
    const ValueStateIcon = valueStateIcons[effectiveValueState];
    const showValueStateIcon = ValueStateIcon && effectiveValueState !== ValueState.None;

    // ARIA attributes
    const ariaLabel = accessibleName;
    const ariaLabelledBy = accessibleNameRef;
    const ariaDescribedBy = [
      accessibleDescriptionRef,
      valueStateMessage ? valueStateId : null,
    ]
      .filter(Boolean)
      .join(" ") || undefined;
    const ariaInvalid = effectiveValueState === ValueState.Negative ? true : undefined;
    const ariaRequired = required || undefined;

    return (
      <div className={cn("w-full", className)} style={style}>
        {/* Textarea container */}
        <div
          className={cn(textareaContainerVariants({
            valueState: effectiveValueState,
            disabled,
            readonly,
          }))}
          data-part="container"
        >
          <textarea
            ref={textareaRef}
            id={textareaId}
            name={name}
            value={currentValue}
            disabled={disabled}
            readOnly={readonly}
            required={required}
            placeholder={placeholder}
            maxLength={maxLength && !showExceededText ? maxLength : undefined}
            minLength={minLength}
            rows={rows || undefined}
            autoComplete={autocomplete}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            aria-describedby={ariaDescribedBy}
            aria-invalid={ariaInvalid}
            aria-required={ariaRequired}
            data-testid={dataTestId}
            data-ai-field={dataAiField}
            data-part="textarea"
            onInput={handleInput}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onKeyUp={onKeyUp}
            onSelect={handleSelect}
            onScroll={onScroll}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            className={cn(
              "w-full resize-none bg-transparent px-2 py-[3px]",
              "text-sm leading-5 text-sapphire-text-primary outline-none",
              "placeholder:text-sapphire-text-tertiary placeholder:italic",
              "disabled:cursor-not-allowed",
              readonly && "text-sapphire-text-secondary",
              growing && "overflow-hidden"
            )}
          />
        </div>

        {/* Character counter — below container */}
        {(maxLength || showExceededText) && (
          <div
            className={cn(
              "flex items-center justify-end gap-2 text-xs mt-1",
              hasExceededMax ? "text-sapphire-negative" : "text-sapphire-text-tertiary"
            )}
            data-part="counter"
          >
            {showExceededText && hasExceededMax && (
              <span>+{exceededCharacters}</span>
            )}
            {maxLength && (
              <span>
                {characterCount} / {maxLength}
              </span>
            )}
          </div>
        )}

        {/* Value state message — persistent live region for reliable announcements */}
        <div
          id={valueStateId}
          role={isNegativeState ? "alert" : "status"}
          className={cn(
            "text-sm flex items-start gap-1",
            valueStateMessage ? "mt-2" : "hidden",
            valueStateMessageColors[effectiveValueState]
          )}
          data-part="value-state-message"
        >
          {valueStateMessage && (
            <>
              {/* Screen reader prefix for value state type */}
              {effectiveValueState !== ValueState.None && valueStateLabelKeys[effectiveValueState] && (
                <span className="sr-only">
                  {t(valueStateLabelKeys[effectiveValueState] as keyof I18nStrings)}:{" "}
                </span>
              )}
              {showValueStateIcon && ValueStateIcon && (
                <ValueStateIcon className="h-4 w-4 shrink-0 mt-0.5" />
              )}
              <span>{valueStateMessage}</span>
            </>
          )}
        </div>
      </div>
    );
  }
