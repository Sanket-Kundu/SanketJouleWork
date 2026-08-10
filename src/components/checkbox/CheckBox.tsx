import React, {
  useRef,
  useState,
  useCallback,
  useImperativeHandle,
  useId,
} from "react";
import { cn } from "../../lib/utils";
import { Check } from "lucide-react";
import { CompleteIcon } from "../../icons/Complete";
import { BorderIcon } from "../../icons/Border";
import { TriStateIcon } from "../../icons/TriState";
import {
  CheckBoxProps,
  CheckBoxSize,
  WrappingType,
} from "../../types/checkbox";

/**
 * CheckBox component
 *
 * A native React implementation of the UI5 CheckBox component.
 * Supports checked, unchecked, and indeterminate states with value state validation.
 */
export function CheckBox({
      checked: controlledChecked,
      defaultChecked = false,
      indeterminate = false,
      disabled = false,
      readonly = false,
      displayOnly = false,
      required = false,
      size = CheckBoxSize.Large,
      text,
      children,
      wrappingType = WrappingType.Normal,
      valueState = "None",
      valueStateMessage,
      name,
      value = "on",
      accessibleName,
      accessibleNameRef,
      accessibleDescription,
      onChange,
      onFocus,
      onBlur,
      className,
      style,
      id: providedId,
      "data-testid": dataTestId,
      tabIndex,
      accessibilityAttributes,
      ref,
    }: CheckBoxProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const rootRef = useRef<HTMLDivElement>(null);
    const generatedId = useId();
    const id = providedId || generatedId;
    const descriptionId = `${id}-description`;

    // Controlled vs uncontrolled state
    const [internalChecked, setInternalChecked] = useState(defaultChecked);
    const isControlled = controlledChecked !== undefined;
    const isChecked = isControlled ? controlledChecked : internalChecked;

    const isActive = isChecked || indeterminate;

    const doToggle = useCallback(
      (originalEvent?: React.SyntheticEvent) => {
        if (disabled || readonly || displayOnly) return;

        const newChecked = !isChecked;
        if (!isControlled) {
          setInternalChecked(newChecked);
        }

        onChange?.({
          checked: newChecked,
          indeterminate: false,
          originalEvent: originalEvent as React.SyntheticEvent,
        });
      },
      [disabled, readonly, displayOnly, isChecked, isControlled, onChange]
    );

    // Expose imperative methods
    useImperativeHandle(
      ref,
      () => ({
        focus() {
          rootRef.current?.focus();
        },
        blur() {
          rootRef.current?.blur();
        },
        isFocused() {
          return document.activeElement === rootRef.current;
        },
        isChecked() {
          return isChecked;
        },
        toggle() {
          doToggle();
        },
        get nativeElement() {
          return inputRef.current;
        },
      }),
      [isChecked, doToggle]
    );

    // Handle click on the root div
    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (disabled || readonly || displayOnly) {
          e.preventDefault();
          return;
        }
        doToggle(e);
      },
      [disabled, readonly, displayOnly, doToggle]
    );

    // Prevent disabled/displayOnly checkbox from gaining focus on mousedown
    const handleMouseDown = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (disabled || displayOnly) {
          e.preventDefault();
        }
      },
      [disabled, displayOnly]
    );

    // Handle keyboard - Space and Enter toggle, matching ui5-checkbox behavior
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (disabled || readonly || displayOnly) return;

        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
        }
      },
      [disabled, readonly, displayOnly]
    );

    const handleKeyUp = useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (disabled || readonly || displayOnly) return;

        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          doToggle(e);
        }
      },
      [disabled, readonly, displayOnly, doToggle]
    );

    // Label content
    const labelContent = children || text;
    const isSmall = size === CheckBoxSize.Small;
    const isInteractive = !disabled && !readonly && !displayOnly;

    // Alignment strategy (matches UI5 Web Components):
    // Container: items-start (box stays at top when text wraps)
    // Label: self-center (centers for single-line; no effect when wrapping fills height)
    // Compact box: mt-0.5 compensates for padding to visually center in 32px touch area
    const hasWrappingLabel = wrappingType !== WrappingType.None && !!labelContent;

    // Determine checkbox box border color based on value state (unchecked only)
    const getValueStateBorderClass = () => {
      if (isActive) return "";
      const borderMap: Record<string, string> = {
        Positive: "border-sapphire-positive",
        Negative: "border-sapphire-negative",
        Critical: "border-sapphire-warning",
        Information: "border-sapphire-info",
      };
      return borderMap[valueState] ?? "";
    };

    // Determine checkbox box background color based on value state when checked
    const getValueStateCheckedClass = () => {
      if (!isActive) return "";
      const checkedMap: Record<string, string> = {
        Positive: "bg-sapphire-positive border-sapphire-positive",
        Negative: "bg-sapphire-negative border-sapphire-negative",
        Critical: "bg-sapphire-warning border-sapphire-warning",
        Information: "bg-sapphire-info border-sapphire-info",
      };
      // None: white bg + secondary border + blue icon (per Figma Sapphire Theme)
      return checkedMap[valueState] ?? "bg-sapphire-canvas-primary border-sapphire-border-secondary";
    };

    // Display-only mode: SAP icon-based rendering (complete, border, tri-state)
    const renderDisplayOnlyIcon = () => {
      const cls = "size-4 text-foreground";
      if (indeterminate) return <TriStateIcon className={cls} />;
      if (isChecked) return <CompleteIcon className={cls} />;
      return <BorderIcon className={cls} />;
    };

    return (
      <div className="relative inline-block max-w-full align-top">
        {/* Hidden native input for form submission — outside role="checkbox" to avoid nested interactive violation */}
        <input
          ref={inputRef}
          type="checkbox"
          name={name}
          value={value}
          checked={isChecked}
          disabled={disabled || displayOnly}
          readOnly={readonly}
          required={required}
          tabIndex={-1}
          aria-hidden="true"
          onChange={() => {/* controlled by root div */}}
          className="absolute size-0 opacity-0 pointer-events-none"
        />

        {/* Root element receives focus, like ui5-checkbox */}
        <div
          ref={rootRef}
          id={id}
          role="checkbox"
          aria-checked={indeterminate ? "mixed" : isChecked}
          aria-label={accessibleName}
          aria-labelledby={!accessibleName ? (accessibleNameRef || (labelContent ? `${id}-label` : undefined)) : undefined}
          aria-describedby={
            [
              valueState !== "None" && valueStateMessage ? descriptionId : null,
              accessibleDescription ? `${id}-desc-text` : null,
              accessibilityAttributes?.describedBy,
            ]
              .filter(Boolean)
              .join(" ") || undefined
          }
          aria-disabled={disabled || displayOnly || undefined}
          aria-readonly={readonly || undefined}
          aria-invalid={valueState === "Negative" || undefined}
          aria-required={required || undefined}
          tabIndex={tabIndex !== undefined ? tabIndex : (disabled || displayOnly ? -1 : 0)}
          onMouseDown={handleMouseDown}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onFocus={onFocus}
          onBlur={onBlur}
          className={cn(
            "group relative inline-flex select-none max-w-full",
            "outline-none",
            labelContent ? "items-start" : "items-center justify-center",
            // Touch area: Cozy = 44px, Compact = 32px
            isSmall
              ? labelContent
                ? "min-h-8 py-1.5 ps-1 pe-1 gap-2"
                : "size-8 p-2"
              : labelContent
                ? "min-h-[44px] py-[11px] ps-1 pe-2 gap-[11px]"
                : "size-[44px] p-[11px]",
            "text-sm",
            "rounded-lg",
            // Focus ring via pseudo-element for asymmetric insets
            "outline-none",
            "after:content-[''] after:absolute after:pointer-events-none after:border-2 after:border-transparent after:rounded-md",
            labelContent
              ? isSmall
                ? "after:inset-x-0 after:inset-y-0"
                : "after:left-0 after:right-[2px] after:inset-y-[5px]"
              : "after:inset-[5px] after:rounded-lg",
            "focus:after:border-[var(--color-ring)]",
            disabled && "opacity-40 cursor-not-allowed",
            readonly && "cursor-default",
            displayOnly && "cursor-default",
            isInteractive && "cursor-pointer",
            className
          )}
          style={style}
          data-testid={dataTestId}
        >
          {/* Checkbox visual */}
          {displayOnly ? (
            renderDisplayOnlyIcon()
          ) : (
            <span
              className={cn(
                "relative inline-flex items-center justify-center",
                "shrink-0",
                isSmall
                  ? labelContent ? "size-4 rounded p-[2px] mt-0.5" : "size-4 rounded p-[2px]"
                  : "size-[22px] rounded p-[3px]",
                "transition-colors",
                // Border style: dashed for readonly, solid otherwise
                readonly ? "border border-dashed" : "border border-solid",
                // --- Unchecked state ---
                !isActive && !readonly && "bg-sapphire-canvas-primary border-sapphire-border-secondary",
                // --- Checked / indeterminate state (not readonly) ---
                // None value state: blue icon on white bg; value states: white icon on colored bg
                isActive && !readonly && valueState === "None" && "text-sapphire-shell-button-fg-selected",
                isActive && !readonly && valueState !== "None" && "text-sapphire-neutral-foreground-white",
                !readonly && getValueStateCheckedClass(),
                !readonly && getValueStateBorderClass(),
                // --- Hover (unchecked, not readonly/disabled, no value state) ---
                !isActive && isInteractive && valueState === "None" &&
                  "group-hover:border-primary group-hover:bg-sapphire-shell-button-bg-selected",
                // --- Hover (checked, not readonly/disabled, no value state) ---
                isActive && isInteractive && valueState === "None" &&
                  "group-hover:bg-sapphire-shell-button-bg-selected group-hover:border-primary",
                // --- Read-only state: gray bg + dashed secondary border ---
                readonly && "bg-sapphire-background-secondary border-sapphire-border-secondary",
                // --- Read-only icon color: secondary-foreground (#353C4A) ---
                readonly && isActive && "text-secondary-foreground"
              )}
            >
              {indeterminate ? (
                // Solid square for tristate per Figma: 12px large, 8px small
                <span className={cn(
                  "block bg-current",
                  isSmall ? "size-2" : "size-3"
                )} />
              ) : isChecked ? (
                <Check className={isSmall ? "size-3" : "size-4"} strokeWidth={3} />
              ) : null}
            </span>
          )}

          {/* Label text */}
          {labelContent && (
            <span
              id={`${id}-label`}
              className={cn(
                "text-sm min-w-0 flex-1 text-foreground",
                hasWrappingLabel && "self-center",
                wrappingType === WrappingType.None && "truncate",
                wrappingType === WrappingType.Normal && "break-words",
                required && "after:content-['*'] after:ml-0.5 after:text-sapphire-negative"
              )}
            >
              {labelContent}
            </span>
          )}

          {/* Hidden descriptions for screen readers */}
          {valueState !== "None" && valueStateMessage && (
            <span id={descriptionId} className="sr-only">
              {valueStateMessage}
            </span>
          )}
          {accessibleDescription && (
            <span id={`${id}-desc-text`} className="sr-only">
              {accessibleDescription}
            </span>
          )}
        </div>
      </div>
    );
  }
