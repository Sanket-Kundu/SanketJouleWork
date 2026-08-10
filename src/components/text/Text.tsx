import { useImperativeHandle, useRef } from "react";
import { cn } from "../../lib/utils";
import { TextProps, TextEmptyIndicatorMode } from "../../types/text";

function isEmpty(children: React.ReactNode): boolean {
  if (children == null) return true;
  if (typeof children === "string" && children.trim() === "") return true;
  if (Array.isArray(children) && children.length === 0) return true;
  return false;
}

/**
 * Text component
 *
 * A native React implementation of the UI5 Text component.
 * Renders a `<span>` with support for line clamping and empty indicator.
 *
 * @example
 * ```tsx
 * <Text>Hello World</Text>
 * <Text maxLines={2}>Long text that will be clamped to 2 lines...</Text>
 * <Text emptyIndicatorMode="On" />
 * ```
 */
export function Text({
  maxLines = 0,
  emptyIndicatorMode = TextEmptyIndicatorMode.Off,
  children,
  className,
  style,
  ref,
  "data-testid": dataTestId,
}: TextProps) {
  const innerRef = useRef<HTMLSpanElement>(null);

  useImperativeHandle(
    ref,
    () => ({
      focus: () => innerRef.current?.focus(),
      get nativeElement() {
        return innerRef.current;
      },
    }),
    []
  );

  const showEmptyIndicator =
    emptyIndicatorMode === TextEmptyIndicatorMode.On && isEmpty(children);

  const clampStyles: React.CSSProperties =
    maxLines === 1
      ? { maxWidth: "100%" }
      : maxLines > 1
        ? {
            display: "-webkit-inline-box",
            WebkitLineClamp: maxLines,
            lineClamp: maxLines,
            WebkitBoxOrient: "vertical" as const,
          }
        : {};

  return (
    <span
      ref={innerRef}
      className={cn(
        "text-foreground font-normal text-sm",
        maxLines === 1 &&
          "inline-block overflow-hidden text-ellipsis whitespace-nowrap",
        maxLines > 1 && "overflow-hidden",
        className
      )}
      style={{ ...clampStyles, ...style }}
      data-testid={dataTestId}
    >
      {showEmptyIndicator ? (
        <span className="text-sapphire-text-tertiary">{"\u2013"}</span>
      ) : (
        children
      )}
    </span>
  );
}
