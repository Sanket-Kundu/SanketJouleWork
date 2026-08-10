import React, { useState, useCallback, useRef, useId } from "react";
import { cn } from "../../lib/utils";
import { SwitchProps, SwitchDesign } from "../../types/switch";
import { AcceptIcon } from "../../icons/Accept";
import { LessIcon } from "../../icons/Less";
import "./Switch.css";

/**
 * Switch container base classes (state-specific styles applied via inline style + CSS)
 */
const switchContainerBase =
  "relative inline-flex items-center rounded-full transition-colors duration-200 ease-in-out cursor-pointer focus:outline-none box-border";

/**
 * Switch handle: 14x14 circle, sits inside 32x20 track with 3px vertical / 4px horizontal gap
 */
const switchHandleBase =
  "absolute rounded-full transition-transform duration-200 ease-in-out flex items-center justify-center box-border";

/**
 * Switch component
 *
 * A switch component for toggling between binary states (on/off).
 * Supports both textual labels and graphical (icon) representations.
 */
export function Switch({
      checked: controlledChecked,
      defaultChecked = false,
      disabled = false,
      required = false,
      design = SwitchDesign.Textual,
      textOn,
      textOff,
      iconOn,
      iconOff,
      accessibleName,
      accessibleNameRef,
      accessibleDescription,
      accessibleDescriptionRef,
      tooltip,
      name,
      value = "on",
      id,
      onChange,
      className,
      style,
      "data-testid": dataTestId,
      accessibilityAttributes,
      ref,
    }: SwitchProps) {
    // State
    const [internalChecked, setInternalChecked] = useState(defaultChecked);
    const textOnRef = useRef<HTMLSpanElement>(null);
    const textOffRef = useRef<HTMLSpanElement>(null);
    const [textWidths, setTextWidths] = useState({ on: 0, off: 0 });
    const generatedId = useId();

    // Controlled vs uncontrolled
    const isControlled = controlledChecked !== undefined;
    const checked = isControlled ? controlledChecked : internalChecked;

    const descriptionId = `${id ?? generatedId}-desc`;
    const ariaDescribedBy = [accessibleDescriptionRef, accessibleDescription ? descriptionId : null, accessibilityAttributes?.describedBy].filter(Boolean).join(" ") || undefined;

    const isGraphical = design === SwitchDesign.Graphical;
    const hasText = !isGraphical && (textOn || textOff);

    // Measure text widths via ref callback (avoids setState-in-effect lint error)
    const measureTextWidths = useCallback(() => {
      const onWidth = textOnRef.current?.offsetWidth || 0;
      const offWidth = textOffRef.current?.offsetWidth || 0;
      if (onWidth !== textWidths.on || offWidth !== textWidths.off) {
        setTextWidths({ on: onWidth, off: offWidth });
      }
    }, [textWidths.on, textWidths.off]);

    // Use ref callback on the hidden spans to trigger measurement
    const textOnCallbackRef = useCallback((node: HTMLSpanElement | null) => {
      (textOnRef as React.MutableRefObject<HTMLSpanElement | null>).current = node;
      if (node) measureTextWidths();
    }, [measureTextWidths]);

    const textOffCallbackRef = useCallback((node: HTMLSpanElement | null) => {
      (textOffRef as React.MutableRefObject<HTMLSpanElement | null>).current = node;
      if (node) measureTextWidths();
    }, [measureTextWidths]);

    // Calculate dimensions
    // Handle contains the text, so handle width = text width + padding
    const handlePadding = 12; // 6px each side (px-1.5 * 2)
    const borderWidth = 2; // border-2 on container
    const handleWidthOn = hasText ? textWidths.on + handlePadding : 14;
    const handleWidthOff = hasText ? textWidths.off + handlePadding : 14;
    const maxHandleWidth = Math.max(handleWidthOn, handleWidthOff);

    // Container needs to fit the largest handle plus some space (1.6x instead of 2x for more compact)
    const containerWidth = hasText ? Math.ceil(maxHandleWidth * 1.6) : 32;
    const currentHandleWidth = checked ? handleWidthOn : handleWidthOff;
    const handleTranslateX = hasText
      ? (checked ? (containerWidth - currentHandleWidth - borderWidth * 2) : 0)
      : (checked ? 10 : 0);

    // Handle toggle
    const handleToggle = useCallback(() => {
      if (disabled) return;

      const newChecked = !checked;

      if (!isControlled) {
        setInternalChecked(newChecked);
      }

      onChange?.({ checked: newChecked });
    }, [checked, disabled, isControlled, onChange]);

    // Handle keyboard
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          handleToggle();
        }
      },
      [handleToggle],
    );

    return (
      <>
        <button
          ref={ref}
          id={id}
          type="button"
          role="switch"
          aria-checked={checked}
          aria-label={accessibleName}
          aria-labelledby={accessibleNameRef}
          aria-describedby={ariaDescribedBy}
          aria-required={required}
          aria-disabled={disabled}
          title={tooltip}
          disabled={disabled}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          data-testid={dataTestId}
          className={cn(
            switchContainerBase,
            "fx-switch",
            className,
          )}
          style={{
            ...style,
            backgroundColor: 'var(--_switch-bg)',
            width: hasText ? `${containerWidth}px` : '32px',
            height: '20px',
          }}
        >
          {/* Hidden measurement spans */}
          {hasText && (
            <>
              <span
                ref={textOnCallbackRef}
                className="absolute invisible text-xs font-medium px-1.5"
                aria-hidden="true"
              >
                {textOn}
              </span>
              <span
                ref={textOffCallbackRef}
                className="absolute invisible text-xs font-medium px-1.5"
                aria-hidden="true"
              >
                {textOff}
              </span>
            </>
          )}

          {/* Handle: 14x14 circle */}
          <span
            className={switchHandleBase}
            style={{
              transform: `translateX(${handleTranslateX}px)`,
              width: '14px',
              height: '14px',
              top: '3px',
              left: '4px',
              backgroundColor: 'var(--_switch-handle-bg)',
              boxShadow: '0 0 0 1px var(--_switch-handle-border)',
            }}
            aria-hidden="true"
          >
            {isGraphical ? (
              <>
                {checked ? (
                  iconOn || <AcceptIcon className="h-3 w-3" style={{ color: 'var(--_switch-bg)' }} />
                ) : (
                  iconOff || <LessIcon className="h-3 w-3" />
                )}
              </>
            ) : hasText ? (
              <span className="whitespace-nowrap">
                {checked ? textOn : textOff}
              </span>
            ) : null}
          </span>
        </button>

        {/* Hidden input for form integration */}
        {name && (
          <input
            type="checkbox"
            name={name}
            value={value}
            checked={checked}
            onChange={() => {}} // Controlled by button
            required={required}
            disabled={disabled}
            className="sr-only"
            tabIndex={-1}
            aria-hidden="true"
          />
        )}

        {accessibleDescription && (
          <span id={descriptionId} className="sr-only">
            {accessibleDescription}
          </span>
        )}
      </>
    );
  }
