import { cn } from "../../lib/utils";
import { useToolbarContext } from "./ToolbarContext";
import type { ToolbarSeparatorProps } from "../../types/toolbar";

/**
 * ToolbarSeparator
 *
 * Visual separator between toolbar items.
 * Renders as a vertical line in toolbar mode, horizontal line in overflow mode.
 */
export function ToolbarSeparator({ className, ref }: ToolbarSeparatorProps) {
  const { isInOverflow } = useToolbarContext();

  if (isInOverflow) {
    return (
      <div
        ref={ref}
        role="separator"
        className={cn("h-px w-full bg-border my-1", className)}
      />
    );
  }

  return (
    <div
      ref={ref}
      role="separator"
      className={cn("h-[26px] w-px bg-border shrink-0", className)}
    />
  );
}

ToolbarSeparator.displayName = "ToolbarSeparator";
