import { type Ref } from "react";
import { cva } from "../../lib/utils";
import {
  ListItemCustomProps,
  ListItemRef,
  ListItemType,
  ListItemHighlight,
} from "../../types/list";
import { ListItemBase } from "./ListItemBase";

// ============================================================================
// VARIANTS
// ============================================================================

const highlightBarVariants = cva(
  "absolute left-0 top-0 bottom-0 w-[3px]",
  {
    variants: {
      highlight: {
        [ListItemHighlight.None]: "bg-transparent",
        [ListItemHighlight.Positive]: "bg-sapphire-positive",
        [ListItemHighlight.Critical]: "bg-sapphire-warning",
        [ListItemHighlight.Information]: "bg-sapphire-info",
        [ListItemHighlight.Negative]: "bg-sapphire-negative",
      },
    },
    defaultVariants: {
      highlight: ListItemHighlight.None,
    },
  }
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Custom list item that allows full control over content rendering.
 * This is a wrapper around ListItemBase for cases where you need complete control
 * over the content layout.
 */
export function ListItemCustom(props: ListItemCustomProps & { ref?: Ref<ListItemRef> }) {
    const {
      ref,
      // Content
      children,

      // Behavior
      type = ListItemType.Active,
      highlight = ListItemHighlight.None,

      // Rest passed to ListItemBase
      ...baseProps
    } = props;

    return (
      <ListItemBase
        ref={ref}
        type={type}
        {...baseProps}
      >
        {() => (
          <>
            {/* Highlight bar */}
            {String(highlight) !== "None" && (
              <span className={highlightBarVariants({ highlight: highlight as ListItemHighlight })} />
            )}

            {/* Custom content - full control to the user */}
            <span className="flex-1 px-3 py-2 min-w-0">
              {children}
            </span>
          </>
        )}
      </ListItemBase>
    );
  }

ListItemCustom.displayName = "ListItemCustom";
