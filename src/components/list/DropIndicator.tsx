import type { Ref } from "react";
import { cn } from "../../lib/utils";

export type DropPlacement = "Before" | "After" | "On";

interface DropIndicatorProps {
  /** Whether the indicator is visible */
  visible: boolean;
  /** The placement relative to the target */
  placement: DropPlacement;
  /** Orientation of the list */
  orientation?: "vertical" | "horizontal";
  /** CSS class name */
  className?: string;
}

/**
 * Visual indicator for drag and drop operations
 */
export function DropIndicator({ visible, placement, orientation = "vertical", className, ref }: DropIndicatorProps & { ref?: Ref<HTMLDivElement> }) {
    if (!visible) return null;

    const isVertical = orientation === "vertical";
    const isBefore = placement === "Before";
    const isOn = placement === "On";

    return (
      <div
        ref={ref}
        className={cn(
          "absolute pointer-events-none z-20",
          isVertical
            ? cn(
                "left-0 right-0 h-0.5 bg-primary",
                isBefore ? "-top-px" : isOn ? "inset-0 h-full bg-primary/10 border-2 border-primary border-dashed" : "-bottom-px"
              )
            : cn(
                "top-0 bottom-0 w-0.5 bg-primary",
                isBefore ? "-left-px" : isOn ? "inset-0 w-full bg-primary/10 border-2 border-primary border-dashed" : "-right-px"
              ),
          className
        )}
        aria-hidden="true"
        data-drop-indicator
        data-placement={placement}
      />
    );
  }
