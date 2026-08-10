import type { Ref } from "react";
import { cn } from "../../lib/utils";
import { TabSeparatorProps } from "../../types/tabs";

/**
 * TabSeparator component
 *
 * A visual separator between tabs.
 * Renders as a vertical line.
 */
export function TabSeparator({ className, style, "data-testid": dataTestId, ref }: TabSeparatorProps & { ref?: Ref<HTMLSpanElement> }) {
    return (
      <span
        ref={ref}
        role="separator"
        aria-orientation="vertical"
        className={cn(
          "inline-block h-4 w-px mx-2",
          "bg-sapphire-border-primary",
          "self-center",
          className
        )}
        style={style}
        data-testid={dataTestId}
      />
    );
  }

TabSeparator.displayName = "TabSeparator";
