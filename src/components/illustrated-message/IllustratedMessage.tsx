import * as React from "react";
import { useRef } from "react";
import { cn, cva } from "../../lib/utils";
import {
  IllustrationDesign,
  IllustrationSize,
  type IllustratedMessageProps,
} from "../../types/illustrated-message";
import { IllustrationSizeContext } from "./IllustrationContext";
import { useIllustrationSize } from "./useIllustrationSize";
import "./illustrated-message.css";

const rootVariants = cva(
  ["flex w-full h-full box-border"],
  {
    variants: {
      size: {
        [IllustrationSize.Large]:
          "flex-col items-center justify-center text-center gap-4 p-4",
        [IllustrationSize.Medium]:
          "flex-col items-center justify-center text-center gap-3 p-4",
        [IllustrationSize.Small]:
          "flex-col items-center justify-center text-center gap-2 p-2",
        [IllustrationSize.ExtraSmall]: "flex-row items-start justify-center gap-3 p-2",
        [IllustrationSize.Base]:
          "flex-col items-center justify-center text-center gap-1 p-1",
      },
    },
    defaultVariants: {
      size: IllustrationSize.Large,
    },
  }
);

const titleVariants = cva("text-foreground", {
  variants: {
    size: {
      [IllustrationSize.Large]: "text-[32px] font-normal leading-[40px] max-w-[61.9375rem]",
      [IllustrationSize.Medium]: "text-xl font-semibold leading-[32px] max-w-[40.5625rem]",
      [IllustrationSize.Small]: "text-xl font-semibold leading-[32px] max-w-[21.5rem]",
      [IllustrationSize.ExtraSmall]: "text-base font-semibold leading-[22px]",
      [IllustrationSize.Base]: "text-sm font-semibold leading-[22px] max-w-[10rem]",
    },
  },
});

const subtitleVariants = cva("text-secondary-foreground", {
  variants: {
    size: {
      [IllustrationSize.Large]: "text-base leading-[22px] max-w-[61.9375rem]",
      [IllustrationSize.Medium]: "text-sm leading-[20px] max-w-[40.5625rem]",
      [IllustrationSize.Small]: "text-sm leading-[20px] max-w-[21.5rem]",
      [IllustrationSize.ExtraSmall]: "text-xs leading-[20px]",
      [IllustrationSize.Base]: "text-xs leading-[20px] max-w-[10rem]",
    },
  },
});

const illustrationSizeClasses: Record<string, string> = {
  [IllustrationSize.Large]: "w-80 h-60",
  [IllustrationSize.Medium]: "w-40 h-40",
  [IllustrationSize.Small]: "w-32 h-32",
  [IllustrationSize.ExtraSmall]: "w-[2.8125rem] h-[2.8125rem] flex-shrink-0",
  [IllustrationSize.Base]: "hidden",
};

export function IllustratedMessage({
  illustration,
  design = IllustrationDesign.Auto,
  titleText,
  subtitleText,
  title,
  subtitle,
  children,
  decorative = false,
  accessibleName,
  className,
  style,
  id,
  "data-testid": dataTestId,
  ref,
}: IllustratedMessageProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const resolvedSize = useIllustrationSize(containerRef, design);

    React.useImperativeHandle(ref, () => ({
      get nativeElement() {
        return containerRef.current;
      },
    }), []);

    const hasTitle = !!(title || titleText);
    const hasSubtitle = !!(subtitle || subtitleText);
    const showIllustration = resolvedSize !== IllustrationSize.Base;
    const showActions = resolvedSize !== IllustrationSize.Base;
    const effectiveAccessibleName = accessibleName || "Illustration";

    return (
      <div
        ref={containerRef}
        id={id}
        className={cn(rootVariants({ size: resolvedSize }), className)}
        style={style}
        data-testid={dataTestId}
        data-part="root"
      >
        <IllustrationSizeContext.Provider value={resolvedSize}>
          {showIllustration && illustration && (
            <div
              data-part="illustration"
              role={decorative ? "presentation" : "img"}
              aria-hidden={decorative || undefined}
              aria-label={!decorative ? effectiveAccessibleName : undefined}
              className={illustrationSizeClasses[resolvedSize]}
            >
              {illustration}
            </div>
          )}

          {resolvedSize === IllustrationSize.ExtraSmall ? (
            <div className="flex flex-col items-center gap-2">
              {(hasTitle || hasSubtitle) && (
                <div data-part="content" className="text-center">
                  {hasTitle && (
                    <div
                      data-part="title"
                      className={titleVariants({ size: resolvedSize })}
                    >
                      {title || titleText}
                    </div>
                  )}
                  {hasSubtitle && (
                    <div
                      data-part="subtitle"
                      className={subtitleVariants({ size: resolvedSize })}
                    >
                      {subtitle || subtitleText}
                    </div>
                  )}
                </div>
              )}
              {showActions && children && (
                <div data-part="actions" className="flex gap-2">
                  {children}
                </div>
              )}
            </div>
          ) : (
            <>
              {(hasTitle || hasSubtitle) && (
                <div data-part="content">
                  {hasTitle && (
                    <div
                      data-part="title"
                      className={titleVariants({ size: resolvedSize })}
                    >
                      {title || titleText}
                    </div>
                  )}
                  {hasSubtitle && (
                    <div
                      data-part="subtitle"
                      className={subtitleVariants({ size: resolvedSize })}
                    >
                      {subtitle || subtitleText}
                    </div>
                  )}
                </div>
              )}
              {showActions && children && (
                <div data-part="actions" className="flex gap-2 mt-2">
                  {children}
                </div>
              )}
            </>
          )}
        </IllustrationSizeContext.Provider>
      </div>
    );
}
