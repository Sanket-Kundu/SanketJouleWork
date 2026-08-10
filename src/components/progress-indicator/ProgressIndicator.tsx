import React, { useRef, useImperativeHandle } from "react";
import { cn } from "../../lib/utils";
import {
  ProgressIndicatorProps,
  ProgressIndicatorValueState,
} from "../../types/progress-indicator";
import { SysEnterIcon } from "../../icons/SysEnter";
import { Warning2Icon } from "../../icons/Warning2";
import { MessageErrorIcon } from "../../icons/MessageError";
import { MessageInformationIcon } from "../../icons/MessageInformation";

/**
 * Bar + end-cap color per value state
 */
const barColorClass: Record<string, string> = {
  [ProgressIndicatorValueState.None]: "bg-sapphire-neutral-foreground-muted",
  [ProgressIndicatorValueState.Positive]: "bg-sapphire-positive",
  [ProgressIndicatorValueState.Critical]: "bg-sapphire-warning",
  [ProgressIndicatorValueState.Negative]: "bg-sapphire-negative",
  [ProgressIndicatorValueState.Information]: "bg-sapphire-info",
};

/**
 * Icon text color per value state
 */
const iconColorClass: Record<string, string> = {
  [ProgressIndicatorValueState.Positive]: "text-sapphire-positive",
  [ProgressIndicatorValueState.Critical]: "text-sapphire-warning",
  [ProgressIndicatorValueState.Negative]: "text-sapphire-negative",
  [ProgressIndicatorValueState.Information]: "text-sapphire-info",
};

/**
 * State icon components per value state (filled SAP icons matching Figma spec)
 */
const stateIconMap: Record<string, React.FC<{ className?: string }>> = {
  [ProgressIndicatorValueState.Positive]: SysEnterIcon,
  [ProgressIndicatorValueState.Critical]: Warning2Icon,
  [ProgressIndicatorValueState.Negative]: MessageErrorIcon,
  [ProgressIndicatorValueState.Information]: MessageInformationIcon,
};

/**
 * Accessible state labels per value state
 */
const stateLabel: Record<string, string> = {
  [ProgressIndicatorValueState.None]: "",
  [ProgressIndicatorValueState.Positive]: "Positive",
  [ProgressIndicatorValueState.Critical]: "Critical",
  [ProgressIndicatorValueState.Negative]: "Negative",
  [ProgressIndicatorValueState.Information]: "Information",
};

/**
 * ProgressIndicator component
 *
 * Displays a visual bar that fills to show percentage progress,
 * with optional semantic value states (Positive, Negative, Critical, Information).
 *
 * @example
 * ```tsx
 * <ProgressIndicator value={75} />
 * <ProgressIndicator value={50} valueState="Positive" />
 * <ProgressIndicator value={30} displayValue="3 of 10" />
 * ```
 */
export function ProgressIndicator({
  value = 0,
  displayValue,
  hideValue = false,
  disabled = false,
  valueState = ProgressIndicatorValueState.None,
  accessibleName,
  accessibleNameRef,
  className,
  style,
  id,
  "data-testid": dataTestId,
  ref,
}: ProgressIndicatorProps) {
    const rootRef = useRef<HTMLDivElement>(null);

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
        get nativeElement() {
          return rootRef.current;
        },
      }),
      []
    );

    // Clamp value to 0-100, treat NaN as 0
    const clampedValue = Math.min(100, Math.max(0, Number.isNaN(value) ? 0 : value));

    // Value text
    const valueText = displayValue || `${clampedValue}%`;
    const vs = valueState as ProgressIndicatorValueState;
    const label = stateLabel[vs] || "";
    const ariaValueText = displayValue
      ? displayValue
      : label
        ? `${valueText} ${label}`
        : valueText;

    // State icon
    const StateIcon = stateIconMap[vs] || null;
    const hasIcon = vs !== ProgressIndicatorValueState.None && StateIcon;

    return (
      <div
        ref={rootRef}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={clampedValue}
        aria-valuetext={ariaValueText}
        aria-label={accessibleName}
        aria-labelledby={accessibleNameRef}
        aria-disabled={disabled || undefined}
        tabIndex={-1}
        id={id}
        data-testid={dataTestId}
        data-part="root"
        className={cn(
          "w-full",
          disabled && "opacity-40 pointer-events-none",
          className
        )}
        style={style}
      >
        {/* Value label above the bar */}
        {!hideValue && (
          <span
            data-part="value"
            className="block text-sm text-sapphire-text-secondary leading-5"
          >
            {valueText}
          </span>
        )}

        {/* Track area + icon row */}
        <div
          data-part="indicator"
          className={cn("flex w-full", hasIcon ? "items-center gap-1.5" : "items-start")}
        >
          {/* Track container */}
          <div data-part="track-container" className="relative h-4 flex-1">
            {/* Track — thin background rail */}
            <div
              data-part="track"
              className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1.5 rounded bg-sapphire-neutral-pressed-background-2"
            />

            {/* Progress bar — thicker filled portion */}
            <div
              data-part="bar"
              className={cn(
                "absolute top-1/2 -translate-y-1/2 h-1.5 rounded-full transition-[width] duration-300 ease-linear",
                barColorClass[vs] || barColorClass[ProgressIndicatorValueState.None],
                clampedValue === 0 && "w-0"
              )}
              style={clampedValue > 0 ? { width: `${clampedValue}%` } : undefined}
            />

            {/* End cap dot */}
            <div
              data-part="end-cap"
              className={cn(
                "absolute right-px top-1/2 -translate-y-1/2 size-1 rounded-full",
                barColorClass[vs] || barColorClass[ProgressIndicatorValueState.None]
              )}
            />
          </div>

          {/* State icon */}
          {hasIcon && (
            <StateIcon
              data-part="icon"
              className={cn("h-4 w-4 shrink-0", iconColorClass[vs])}
            />
          )}
        </div>
      </div>
    );
}
