import React, { useRef, useImperativeHandle, useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "../../lib/utils";
import type { SliderProps } from "../../types/slider";
import "./Slider.css";

function snapToStep(value: number, step: number, min: number): number {
  if (step <= 0) return value;
  return Math.round((value - min) / step) * step + min;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function getDecimalPrecision(num: number): number {
  const str = String(num);
  const dot = str.indexOf(".");
  return dot === -1 ? 0 : str.length - dot - 1;
}

const DirectionArrowsIcon = () => (
  <svg width="12" height="6" viewBox="0 0 12 6" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.80311 0.150195C2.96711 -0.0020038 3.20613 -0.0424792 3.41127 0.0469257C3.61641 0.136343 3.74903 0.338848 3.74906 0.56254V5.43744C3.74906 5.66115 3.61641 5.86363 3.41127 5.95306C3.20611 6.04248 2.96712 6.00202 2.80311 5.84979L0.177008 3.41234C-0.0589857 3.19317 -0.0590199 2.80681 0.177008 2.58765L2.80311 0.150195ZM8.58873 0.0469257C8.79387 -0.0424792 9.03289 -0.0020038 9.19689 0.150195L11.823 2.58765C12.059 2.80681 12.059 3.19317 11.823 3.41234L9.19689 5.84979C9.03288 6.00202 8.79389 6.04248 8.58873 5.95306C8.38359 5.86363 8.25094 5.66115 8.25094 5.43744V0.56254C8.25097 0.338848 8.38359 0.136343 8.58873 0.0469257Z" />
  </svg>
);

/**
 * @experimental This component is not production-ready. Use at your own risk.
 */
export function Slider({
  value: controlledValue,
  defaultValue = 0,
  min = 0,
  max = 100,
  step = 1,
  showTooltip = false,
  showTickmarks = false,
  labelInterval = 0,
  labels,
  disabled = false,
  accessibleName,
  accessibleNameRef,
  name,
  onInput,
  onChange,
  className,
  style,
  "data-testid": dataTestId,
  ref,
}: SliderProps) {
  const { t } = useTranslation("fx");
  const rootRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const valueAtFocusIn = useRef<number | undefined>(undefined);
  const valueAtInteractionStart = useRef<number | undefined>(undefined);

  const isControlled = controlledValue !== undefined;
  const currentValue = clamp(isControlled ? controlledValue : internalValue, min, max);
  const range = max - min;
  const percentage = range === 0 ? 0 : ((currentValue - min) / range) * 100;
  const precision = getDecimalPrecision(step);

  useImperativeHandle(ref, () => ({
    focus: () => handleRef.current?.focus(),
    blur: () => handleRef.current?.blur(),
    isFocused: () => document.activeElement === handleRef.current,
    get nativeElement() { return rootRef.current; },
    getNativeElement: () => rootRef.current,
  }));

  const setValue = useCallback((newValue: number, fireInput?: boolean) => {
    const snapped = snapToStep(newValue, step, min);
    const clamped = clamp(snapped, min, max);
    const rounded = Number(clamped.toFixed(precision));

    if (!isControlled) {
      setInternalValue(rounded);
    }
    if (fireInput) {
      onInput?.({ value: rounded });
    }
  }, [step, min, max, precision, isControlled, onInput]);

  const fireChange = useCallback((val: number) => {
    const snapped = snapToStep(val, step, min);
    const clamped = clamp(snapped, min, max);
    const rounded = Number(clamped.toFixed(precision));
    onChange?.({ value: rounded });
  }, [step, min, max, precision, onChange]);

  const getValueFromPosition = useCallback((clientX: number) => {
    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect) return currentValue;
    const padding = 12;
    const trackStart = rect.left + padding;
    const trackWidth = rect.width - padding * 2;
    const ratio = clamp((clientX - trackStart) / trackWidth, 0, 1);
    return min + ratio * range;
  }, [min, range, currentValue]);

  // Mouse/touch drag
  useEffect(() => {
    if (!isPressed) return;

    const onMove = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const newValue = getValueFromPosition(clientX);
      setValue(newValue, true);
    };

    const onUp = (e: MouseEvent | TouchEvent) => {
      const clientX = "changedTouches" in e ? e.changedTouches[0].clientX : (e as MouseEvent).clientX;
      const newValue = getValueFromPosition(clientX);
      setValue(newValue, true);
      setIsPressed(false);

      const snapped = snapToStep(newValue, step, min);
      const clamped = clamp(snapped, min, max);
      if (valueAtInteractionStart.current !== Number(clamped.toFixed(precision))) {
        fireChange(clamped);
      }
      valueAtInteractionStart.current = undefined;
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [isPressed, getValueFromPosition, setValue, fireChange, step, min, max, precision]);

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (disabled || step === 0) return;
    e.preventDefault();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const newValue = getValueFromPosition(clientX);

    valueAtInteractionStart.current = currentValue;
    setValue(newValue, true);
    setIsPressed(true);
    handleRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled || step === 0) return;

    const bigStep = Math.max(range / 10, step);
    let newValue: number | undefined;

    switch (e.key) {
      case "ArrowLeft":
      case "ArrowDown":
        newValue = currentValue - (e.ctrlKey || e.metaKey ? bigStep : step);
        break;
      case "ArrowRight":
      case "ArrowUp":
        newValue = currentValue + (e.ctrlKey || e.metaKey ? bigStep : step);
        break;
      case "+":
        newValue = currentValue + step;
        break;
      case "-":
        newValue = currentValue - step;
        break;
      case "Home":
        newValue = min;
        break;
      case "End":
        newValue = max;
        break;
      case "PageUp":
        newValue = currentValue + bigStep;
        break;
      case "PageDown":
        newValue = currentValue - bigStep;
        break;
      case "Escape":
        if (valueAtFocusIn.current !== undefined) {
          newValue = valueAtFocusIn.current;
        }
        break;
      default:
        return;
    }

    if (newValue !== undefined) {
      e.preventDefault();
      valueAtInteractionStart.current = currentValue;
      setValue(newValue, true);
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (disabled) return;
    const actionKeys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "+", "-", "Home", "End", "PageUp", "PageDown", "Escape"];
    if (actionKeys.includes(e.key) && valueAtInteractionStart.current !== currentValue) {
      fireChange(currentValue);
    }
    valueAtInteractionStart.current = undefined;
  };

  const handleFocusIn = () => {
    if (valueAtFocusIn.current === undefined) {
      valueAtFocusIn.current = currentValue;
    }
    setIsFocused(true);
  };

  const handleFocusOut = () => {
    valueAtFocusIn.current = undefined;
    setIsFocused(false);
  };

  // Tickmarks computation
  const effectiveStep = step > 0 ? step : 1;
  const numSteps = Math.floor(range / effectiveStep);
  const tickmarks: boolean[] = [];
  if (showTickmarks && numSteps > 0 && numSteps <= 200) {
    for (let i = 0; i <= numSteps; i++) {
      tickmarks.push(true);
    }
  }

  // Labels computation
  const labelItems: { position: number; text: string }[] = [];
  if (labels && labels.length > 0) {
    labels.forEach((text, i) => {
      const pos = labels.length === 1 ? 0 : (i / (labels.length - 1)) * 100;
      labelItems.push({ position: pos, text });
    });
  } else if (showTickmarks && labelInterval > 0 && numSteps > 0) {
    for (let i = 0; i <= numSteps; i += labelInterval) {
      const val = Number((min + i * effectiveStep).toFixed(precision));
      const pos = (i / numSteps) * 100;
      labelItems.push({ position: pos, text: String(val) });
    }
  }

  const isFocusOnly = isFocused && !isPressed;
  const showTooltipNow = showTooltip && (isPressed || isHovered) && !disabled;

  return (
    <div
      ref={rootRef}
      className={cn(
        "fx-slider relative w-full select-none",
        disabled && "opacity-40 pointer-events-none",
        className
      )}
      style={style}
      data-testid={dataTestId}
    >
      {name && <input type="hidden" name={name} value={currentValue} />}

      {/* Track area — clickable */}
      <div
        className="relative h-4 flex items-center cursor-pointer"
        onMouseDown={handlePointerDown}
        onTouchStart={handlePointerDown}
      >
        {/* Track background — full width */}
        <div className="absolute left-0 right-0 h-1.5 rounded bg-sapphire-neutral-pressed-background-2" />

        {/* End point */}
        <svg className="absolute right-px top-1/2 -translate-y-1/2 z-[1]" width="4" height="4" viewBox="0 0 4 4" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="2" cy="2" r="2" className="fill-sapphire-neutral-foreground-muted" />
        </svg>

        {/* Progress bar */}
        <div
          className="absolute left-0 h-1.5 rounded-full bg-sapphire-info"
          style={{ width: `calc(12px + ${percentage / 100} * (100% - 24px))` }}
        />

        {/* Handle — positioned within 12px-padded zone to align with ticks */}
        <div
          ref={handleRef}
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-valuenow={currentValue}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-orientation="horizontal"
          aria-label={accessibleName || t("SLIDER_ARIA_DESCRIPTION")}
          aria-labelledby={accessibleNameRef}
          aria-disabled={disabled || undefined}
          aria-keyshortcuts="ArrowLeft ArrowRight ArrowUp ArrowDown Home End PageUp PageDown Escape"
          className={cn(
            "fx-slider-handle absolute flex items-center justify-center w-6 h-5 rounded-full cursor-grab z-10 outline-none",
            "transition-[background-color,border-color] duration-150",
            "text-sapphire-text-primary",
            isFocusOnly
              ? "bg-transparent border-2 border-sapphire-border-focus"
              : isPressed
                ? "bg-sapphire-neutral-hover-background-2 border border-sapphire-neutral-foreground-muted"
                : "bg-sapphire-canvas-primary border border-sapphire-neutral-foreground-muted hover:bg-sapphire-neutral-hover-background-2",
          )}
          style={{ left: `calc(12px + ${percentage / 100} * (100% - 24px))`, transform: "translate(-50%, -50%)", top: "50%" }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onFocus={handleFocusIn}
          onBlur={handleFocusOut}
        >
          {!isFocusOnly && <DirectionArrowsIcon />}
        </div>

        {/* Tooltip */}
        {showTooltipNow && (
          <div
            className="absolute -top-9 flex items-center justify-center px-[11px] py-1 rounded bg-sapphire-neutral-pressed-background-2 border border-sapphire-border-secondary pointer-events-none z-20"
            style={{ left: `calc(12px + ${percentage / 100} * (100% - 24px))`, transform: "translateX(-50%)" }}
          >
            <span className="text-xs leading-4 text-sapphire-text-primary text-center">
              {currentValue.toFixed(precision)}
            </span>
          </div>
        )}
      </div>

      {/* Tickmarks */}
      {showTickmarks && tickmarks.length > 0 && (
        <div className="flex items-center justify-between" style={{ padding: "4px 12px 0 12px" }}>
          {tickmarks.map((_, i) => (
            <div
              key={i}
              className="w-0.5 h-0.5 rounded-full bg-sapphire-neutral-foreground-muted"
            />
          ))}
        </div>
      )}

      {/* Labels */}
      {labelItems.length > 0 && (
        <div className="flex items-center justify-between mt-0.5 px-3">
          {labelItems.map((item, i) => (
            <div key={i} className="relative w-0 flex justify-center">
              <span className="text-xs leading-4 text-sapphire-text-tertiary whitespace-nowrap">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
