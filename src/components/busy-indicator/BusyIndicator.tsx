import React, {
  useRef,
  useState,
  useEffect,
  useId,
  useImperativeHandle,
} from "react";
import { useTranslation } from "react-i18next";
import { cn, cva } from "../../lib/utils";
import {
  BusyIndicatorProps,
  BusyIndicatorSize,
  BusyIndicatorTextPlacement,
} from "../../types/busy-indicator";

const dotVariants = cva("rounded-full bg-current inline-block", {
  variants: {
    size: {
      [BusyIndicatorSize.S]: "w-2 h-2",
      [BusyIndicatorSize.M]: "w-4 h-4",
      [BusyIndicatorSize.L]: "w-8 h-8",
    },
  },
  defaultVariants: { size: BusyIndicatorSize.M },
});

const dotGapClasses: Record<string, string> = {
  [BusyIndicatorSize.S]: "gap-px",
  [BusyIndicatorSize.M]: "gap-[0.1875rem]",
  [BusyIndicatorSize.L]: "gap-1",
};

/**
 * BusyIndicator component
 *
 * A native React implementation of the UI5 BusyIndicator.
 * Displays animated dots to indicate a loading/busy state.
 * Can wrap content to show an overlay, or render standalone.
 */
export function BusyIndicator({
  size = BusyIndicatorSize.M,
  textPlacement = BusyIndicatorTextPlacement.Bottom,
  joule = false,
  active = false,
  delay = 1000,
  text,
  children,
  accessibleName,
  className,
  style,
  id,
  "data-testid": dataTestId,
  ref,
}: BusyIndicatorProps) {
    const { t } = useTranslation("fx");
    const rootRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const [isBusy, setIsBusy] = useState(false);
    const labelId = useId();

    const hasChildren = React.Children.count(children) > 0;
    const normalizedSize = (size as BusyIndicatorSize) || BusyIndicatorSize.M;
    const isTopPlacement = (textPlacement as string) === "Top";

    // Delay mechanism
    useEffect(() => {
      if (!active) {
        setIsBusy(false);
        return;
      }

      if (delay <= 0) {
        setIsBusy(true);
        return;
      }

      const timer = setTimeout(() => {
        setIsBusy(true);
      }, delay);

      return () => clearTimeout(timer);
    }, [active, delay]);

    useImperativeHandle(
      ref,
      () => ({
        focus() {
          if (isBusy && overlayRef.current) {
            overlayRef.current.focus();
          } else {
            rootRef.current?.focus();
          }
        },
        blur() {
          if (isBusy && overlayRef.current) {
            overlayRef.current.blur();
          } else {
            rootRef.current?.blur();
          }
        },
        isFocused() {
          return (
            document.activeElement === overlayRef.current ||
            document.activeElement === rootRef.current
          );
        },
        get nativeElement() {
          return rootRef.current;
        },
      }),
      [isBusy]
    );

    const textLabel = text ? (
      <span
        id={labelId}
        className={cn(
          "w-full text-center text-sapphire-text-tertiary text-sm font-medium",
          isTopPlacement ? "mb-2" : "mt-2"
        )}
      >
        {text}
      </span>
    ) : null;

    const dots = (
      <div
        className={cn(
          "inline-flex items-center leading-none",
          dotGapClasses[normalizedSize]
        )}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={dotVariants({ size: normalizedSize as BusyIndicatorSize })}
            style={{
              animation: `busy-grow 1.6s cubic-bezier(0.32, 0.06, 0.85, 1.11) ${i * 200}ms infinite`,
            }}
          />
        ))}
      </div>
    );

    return (
      <div
        ref={rootRef}
        id={id}
        className={cn(
          "inline-block",
          hasChildren && "relative",
          isBusy && (joule ? "text-sapphire-joule-foreground" : "text-ring"),
          className
        )}
        style={{ ...style, borderRadius: "inherit", height: "inherit" }}
        data-testid={dataTestId}
        data-part="root"
      >
        {/* Keyframes for the grow animation */}
        <style>{`@keyframes busy-grow{0%,50%,100%{transform:scale(.5)}25%{transform:scale(1)}}`}</style>

        {/* Busy overlay */}
        {isBusy && (
          <div
            ref={overlayRef}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuetext="Busy"
            aria-labelledby={text ? labelId : undefined}
            aria-label={!text ? (accessibleName ?? t("BUSYINDICATOR_PLEASE_WAIT")) : undefined}
            title={!text ? (accessibleName ?? t("BUSYINDICATOR_PLEASE_WAIT")) : undefined}
            tabIndex={0}
            data-sap-focus-ref
            className={cn(
              "flex flex-col items-center justify-center",
              "bg-inherit rounded-[inherit]",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-[-2px]",
              hasChildren && "absolute inset-0 z-[99]"
            )}
          >
            {isTopPlacement && textLabel}
            {dots}
            {!isTopPlacement && textLabel}
          </div>
        )}

        {/* Wrapped content */}
        {children && (
          <div
            className={cn(isBusy && "opacity-40")}
            {...(isBusy ? { inert: true } : {})}
          >
            {children}
          </div>
        )}
      </div>
    );
}
