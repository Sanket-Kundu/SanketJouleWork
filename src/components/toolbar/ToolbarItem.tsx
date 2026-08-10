import { cn } from "../../lib/utils";
import { useToolbarContext } from "./ToolbarContext";
import type { ToolbarItemProps } from "../../types/toolbar";

/**
 * ToolbarItem
 *
 * Generic wrapper for arbitrary content in a Toolbar.
 * In normal mode, renders as an inline-flex shrink-0 container.
 * In overflow mode, renders full-width with padding.
 */
export function ToolbarItem({ overflowPriority: _overflowPriority, preventOverflowClosing: _preventOverflowClosing, children, className, ref }: ToolbarItemProps) {
    const { isInOverflow } = useToolbarContext();

    if (isInOverflow) {
      return (
        <div ref={ref} className={cn("w-full px-3 py-2", className)}>
          {children}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn("shrink-0 inline-flex items-center", className)}
      >
        {children}
      </div>
    );
}

ToolbarItem.displayName = "ToolbarItem";
