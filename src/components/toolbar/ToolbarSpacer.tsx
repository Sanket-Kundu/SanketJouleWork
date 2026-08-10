import { cn } from "../../lib/utils";
import { useToolbarContext } from "./ToolbarContext";
import type { ToolbarSpacerProps } from "../../types/toolbar";

/**
 * ToolbarSpacer
 *
 * Flexible or fixed-width spacer between toolbar items.
 * When width is not specified (or "auto"), uses flex-grow to push items apart.
 * Returns null in overflow mode (spacers are meaningless in vertical layout).
 */
export function ToolbarSpacer({ width, className, ref }: ToolbarSpacerProps) {
  const { isInOverflow } = useToolbarContext();

  if (isInOverflow) {
    return null;
  }

  const isFixed = width && width !== "auto";

  return (
    <div
      ref={ref}
      className={cn(isFixed ? "shrink-0" : "flex-auto", className)}
      style={isFixed ? { width } : undefined}
    />
  );
}
