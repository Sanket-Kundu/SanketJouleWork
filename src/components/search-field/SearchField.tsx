import React, {
  useState,
  useCallback,
  useRef,
  useImperativeHandle,
  useId,
} from "react";
import { cn, cva, subTestId } from "../../lib/utils";
import { useTranslation } from "react-i18next";
import { SearchIcon } from "../../icons/Search";
import { DeclineIcon } from "../../icons/Decline";
import { Button } from "../button";
import { ButtonDesign, ButtonSize, ButtonType } from "../../types/button";
import type { SearchFieldProps } from "../../types/search-field";
import { SearchFieldSize } from "../../types/search-field";

/**
 * Container variants — size-aware per Figma spec
 * Large: h-10 (40px), rounded-lg (8px), 14px left padding
 * Medium: h-8 (32px), rounded (4px), 14px left padding
 */
const containerVariants = cva(
  [
    "flex items-center w-full border bg-sapphire-canvas-primary",
    "overflow-clip transition-colors relative",
    "border-sapphire-border-active hover:border-sapphire-border-accent",
  ],
  {
    variants: {
      size: {
        [SearchFieldSize.Large]: [
          "h-10 rounded-lg",
          "pl-3.5 pr-1 py-1 gap-1",
          "focus-within:border-2 focus-within:border-sapphire-border-accent focus-within:pl-[13px] focus-within:pr-[3px] focus-within:py-[3px]",
        ],
        [SearchFieldSize.Medium]: [
          "h-8 rounded",
          "pl-3 pr-1 py-1 gap-1",
          "focus-within:border-2 focus-within:border-sapphire-border-accent focus-within:pl-[11px] focus-within:pr-[3px] focus-within:py-[3px]",
        ],
      },
      disabled: {
        true: "opacity-40 cursor-not-allowed pointer-events-none",
        false: "",
      },
    },
    defaultVariants: {
      size: SearchFieldSize.Large,
      disabled: false,
    },
  }
);

/**
 * SearchField component
 *
 * A native React implementation of the UI5 SearchField with:
 * - Search trigger via Enter key or search icon click
 * - Optional clear icon
 * - Loading state with spinner
 * - Controlled and uncontrolled modes
 * - Full keyboard accessibility
 */
function SearchFieldBase(props: SearchFieldProps) {
  const {
    ref,
    size = SearchFieldSize.Large,
    value: controlledValue,
    defaultValue = "",
    placeholder,
    disabled = false,
    loading = false,
    showClearIcon = false,
    accessibleName,
    accessibleNameRef,
    accessibleDescription,
    accessibleDescriptionRef,
    name,
    id,
    onInput,
    onSearch,
    onChange,
    onFocus,
    onBlur,
    onKeyDown,
    className,
    style,
    "data-testid": dataTestId,
  } = props;

  const { t } = useTranslation("fx");
  const inputRef = useRef<HTMLInputElement>(null);
  const descId = useId();
  const generatedId = useId();

  // Use provided id or generate fallback for autofill support
  const inputId = id || generatedId;

  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = isControlled ? controlledValue : internalValue;

  // Imperative API
  useImperativeHandle(
    ref,
    () => ({
      focus: () => inputRef.current?.focus(),
      blur: () => inputRef.current?.blur(),
      getValue: () => inputRef.current?.value ?? "",
      setValue: (val: string) => {
        if (!isControlled) {
          setInternalValue(val);
        }
        onInput?.(val);
      },
      clear: () => {
        if (!isControlled) {
          setInternalValue("");
        }
        onInput?.("");
      },
      get nativeElement() {
        return inputRef.current;
      },
    }),
    [isControlled, onInput]
  );

  const handleNativeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if (!isControlled) {
        setInternalValue(val);
      }
      onInput?.(val);
    },
    [isControlled, onInput]
  );

  const handleNativeBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      onChange?.(e.target.value);
      onBlur?.(e);
    },
    [onChange, onBlur]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(e);
      // When loading, the submit button is disabled, so form submission via Enter won't work.
      // We need to manually trigger search on Enter during loading state.
      if (e.key === "Enter" && !e.defaultPrevented && loading) {
        e.preventDefault();
        onSearch?.({
          value: inputRef.current?.value ?? "",
          clearButtonPressed: false,
        });
      } else if (e.key === "Escape" && !e.defaultPrevented) {
        // Escape key triggers clear behavior (keyboard alternative to clear button).
        // In controlled mode, the field won't visually clear unless the parent responds
        // to onInput and updates the value prop.
        const currentVal = inputRef.current?.value ?? "";
        if (currentVal.length > 0) {
          e.preventDefault();
          if (!isControlled) {
            setInternalValue("");
          }
          onInput?.("");
          onSearch?.({
            value: "",
            clearButtonPressed: true,
          });
        }
      }
    },
    [onKeyDown, isControlled, onInput, onSearch, loading]
  );

  const handleSubmit = useCallback((e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch?.({
      value: inputRef.current?.value ?? "",
      clearButtonPressed: false,
    });
    inputRef.current?.focus();
  }, [onSearch]);

  const handleClear = useCallback(() => {
    // Clear button click triggers clear behavior.
    // In controlled mode, the field won't visually clear unless the parent responds
    // to onInput and updates the value prop.
    if (!isControlled) {
      setInternalValue("");
    }
    onInput?.("");
    onSearch?.({
      value: "",
      clearButtonPressed: true,
    });
    inputRef.current?.focus();
  }, [isControlled, onInput, onSearch]);

  const hasValue = currentValue.length > 0;
  const isMedium = size === SearchFieldSize.Medium;

  // Build aria-describedby: explicit ref > explicit description > default i18n description
  const hasCustomDescription = accessibleDescription && !accessibleDescriptionRef;
  const ariaDescribedBy = accessibleDescriptionRef
    ? accessibleDescriptionRef
    : descId;

  return (
    <div
      className={cn("inline-flex w-full", className)}
      style={style}
      data-testid={dataTestId}
    >
      <form
        onSubmit={handleSubmit}
        className={containerVariants({ size: size as SearchFieldSize, disabled: !!disabled })}
      >
        {/* Hidden description span: custom or default i18n description */}
        {!accessibleDescriptionRef && (
          <span id={descId} className="sr-only">
            {hasCustomDescription ? accessibleDescription : t("SEARCHFIELD_ARIA_DESCRIPTION")}
          </span>
        )}

        {/* Native search input */}
        <input
          ref={inputRef}
          type="search"
          id={inputId}
          name={name}
          disabled={disabled}
          role="searchbox"
          enterKeyHint="search"
          aria-label={accessibleNameRef ? undefined : (accessibleName || t("SEARCHFIELD_SEARCH"))}
          aria-labelledby={accessibleNameRef}
          aria-describedby={ariaDescribedBy}
          aria-roledescription={t("SEARCHFIELD_ROLE_DESCRIPTION")}
          aria-disabled={disabled || undefined}
          value={currentValue}
          placeholder={placeholder}
          className={cn(
            "flex-1 min-w-0 bg-transparent outline-none text-sm text-foreground",
            "placeholder:text-sapphire-text-tertiary placeholder:italic",
            "[&::-webkit-search-cancel-button]:appearance-none",
            "[&::-webkit-search-decoration]:appearance-none",
            disabled && "cursor-not-allowed"
          )}
          onChange={handleNativeChange}
          onFocus={onFocus}
          onBlur={handleNativeBlur}
          onKeyDown={handleKeyDown}
        />

        {/* Clear icon */}
        {showClearIcon && hasValue && !disabled && (
          <span onMouseDown={(e) => e.preventDefault()}>
            <Button
              design={ButtonDesign.SecondaryNeutral}
              size={isMedium ? ButtonSize.Small : ButtonSize.Medium}
              iconOnly
              icon={<span className={cn("inline-flex items-center justify-center", isMedium ? "h-3 w-3" : "h-4 w-4")}><DeclineIcon className="h-full w-full" /></span>}
              tabIndex={-1}
              onClick={handleClear}
              accessibleName={t("SEARCHFIELD_CLEAR")}
              className="flex-none"
              data-testid={subTestId(dataTestId, "clear")}
            />
          </span>
        )}

        {/* Search icon / Loading spinner */}
        <span onMouseDown={(e) => e.preventDefault()}>
          <Button
            design={ButtonDesign.SecondaryNeutral}
            size={isMedium ? ButtonSize.Small : ButtonSize.Medium}
            iconOnly
            type={ButtonType.Submit}
            icon={
              loading ? (
                <span
                  className={cn(
                    "block rounded-full border-2 border-current border-t-transparent animate-spin",
                    isMedium ? "h-3 w-3" : "h-4 w-4"
                  )}
                  role="status"
                  aria-label={t("LOADING")}
                />
              ) : (
                <span className={cn("inline-flex items-center justify-center", isMedium ? "h-3 w-3" : "h-4 w-4")}><SearchIcon className="h-full w-full" /></span>
              )
            }
            tabIndex={-1}
            disabled={disabled || loading}
            accessibleName={t("SEARCHFIELD_SEARCH")}
            className="flex-none"
            data-testid={subTestId(dataTestId, "search")}
          />
        </span>
      </form>
    </div>
  );
}

export const SearchField = React.memo(SearchFieldBase);
SearchField.displayName = "SearchField";
