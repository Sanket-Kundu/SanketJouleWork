import type { Ref } from "react";
import { cn } from "../../lib/utils";

// ============================================================================
// TYPES
// ============================================================================

export interface ListItemSeparatorProps {
  /** CSS class name */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Data test ID */
  "data-testid"?: string;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * List item separator - a visual divider between list items or sections.
 * Similar to ui5-li-separator.
 *
 * @example
 * ```tsx
 * <List>
 *   <ListItem text="Item 1" />
 *   <ListItemSeparator />
 *   <ListItem text="Item 2" />
 * </List>
 * ```
 */
export function ListItemSeparator(props: ListItemSeparatorProps & { ref?: Ref<HTMLLIElement> }) {
    const {
      ref,
      className,
      style,
      "data-testid": dataTestId,
    } = props;

    return (
      <li
        ref={ref}
        role="separator"
        aria-orientation="horizontal"
        className={cn(
          "relative",
          "w-full",
          "h-px",
          "bg-sapphire-border-primary",
          "my-2",
          "pointer-events-none",
          className
        )}
        style={style}
        data-testid={dataTestId}
      />
    );
  }
