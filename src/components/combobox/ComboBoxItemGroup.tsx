import React from "react";
import { cn } from "../../lib/utils";
import { ComboBoxItemGroupProps } from "../../types/combobox";

/**
 * ComboBoxItemGroup component
 *
 * Groups ComboBox items under a header. The group header is not selectable
 * and keyboard navigation skips over it. The group is hidden when all
 * children are filtered out.
 */
export function ComboBoxItemGroup({ headerText, isVisible = true, children, className, ref }: ComboBoxItemGroupProps & { ref?: React.Ref<HTMLDivElement> }) {
  // Don't render if not visible (all children filtered out)
  if (!isVisible) {
    return null;
  }

  return (
    <div
      ref={ref}
      role="group"
      aria-label={headerText}
      className={cn("py-1", className)}
    >
      {/* Group header */}
      <div
        className={cn(
          "px-3 py-1.5 text-xs font-medium text-sapphire-text-tertiary",
          "uppercase tracking-wide select-none"
        )}
        aria-hidden="true"
      >
        {headerText}
      </div>

      {/* Group items */}
      <div role="presentation">{children}</div>
    </div>
  );
}

ComboBoxItemGroup.displayName = "ComboBoxItemGroup";
