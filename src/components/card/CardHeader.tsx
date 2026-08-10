import React, {
  useRef,
  useImperativeHandle,
} from "react";
import { cn, cva } from "../../lib/utils";
import type { CardHeaderProps, CardHeaderRef } from "../../types/card";
import { CardHeaderStatus } from "../../types/card";

const statusVariants = cva("text-sm", {
  variants: {
    status: {
      [CardHeaderStatus.None]: "text-sapphire-text-tertiary",
      [CardHeaderStatus.Positive]: "text-sapphire-positive",
      [CardHeaderStatus.Negative]: "text-sapphire-negative",
      [CardHeaderStatus.Critical]: "text-sapphire-warning",
      [CardHeaderStatus.Information]: "text-sapphire-info",
    },
  },
  defaultVariants: {
    status: CardHeaderStatus.None,
  },
});

export const CardHeader = React.forwardRef<CardHeaderRef, CardHeaderProps>(
  (
    {
      titleText,
      subtitleText,
      additionalText,
      avatar,
      action,
      status = CardHeaderStatus.None,
      ariaLevel = 3,
      accessibleName,
      accessibleNameRef,
      accessibleDescriptionRef,
      className,
      style,
      id,
      "data-testid": dataTestId,
    },
    ref
  ) => {
    const headerRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(
      ref,
      () => ({
        focus() {
          headerRef.current?.focus();
        },
        blur() {
          headerRef.current?.blur();
        },
        isFocused() {
          return headerRef.current?.contains(document.activeElement) === true;
        },
        get nativeElement() {
          return headerRef.current;
        },
      }),
      []
    );

    return (
      <div
        ref={headerRef}
        id={id}
        tabIndex={-1}
        aria-label={accessibleName}
        aria-labelledby={accessibleNameRef}
        aria-describedby={accessibleDescriptionRef}
        className={cn(
          "flex items-center gap-4 p-4 border-b border-sapphire-border-primary rounded-t-[8px]",
          className
        )}
        style={style}
        data-testid={dataTestId}
        data-part="header-root"
      >
        <div
          className="flex items-start gap-3 flex-1 min-w-0"
          data-part="content-area"
        >
          {avatar && (
            <div className="flex-shrink-0" data-part="avatar">
              {avatar}
            </div>
          )}
          <div className="flex-1 min-w-0">
            {(titleText || additionalText) && (
              <div className="flex items-center gap-2">
                {titleText && (
                  <div
                    role="heading"
                    aria-level={ariaLevel}
                    className="text-base font-semibold text-sapphire-text-primary leading-[22px] line-clamp-3 flex-1 min-w-0"
                    data-part="title"
                  >
                    {titleText}
                  </div>
                )}
                {additionalText && (
                  <span
                    className={cn("flex-shrink-0", statusVariants({ status: status as CardHeaderStatus }))}
                    data-part="additional-text"
                  >
                    {additionalText}
                  </span>
                )}
              </div>
            )}
            {subtitleText && (
              <p className="text-sm leading-5 text-sapphire-text-secondary line-clamp-2 mt-1" data-part="subtitle">
                {subtitleText}
              </p>
            )}
          </div>
        </div>

        {action && (
          <div
            className="flex-shrink-0 z-10"
            data-part="action"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") e.stopPropagation();
            }}
          >
            {action}
          </div>
        )}
      </div>
    );
  }
);

CardHeader.displayName = "CardHeader";
