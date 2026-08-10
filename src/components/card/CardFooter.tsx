import type { Ref } from "react";
import { cn } from "../../lib/utils";
import { CardFooterProps } from "../../types/card";

/**
 * CardFooter component
 *
 * A footer section for Card components, typically containing action buttons.
 * Buttons are automatically aligned to the right bottom of the card.
 *
 * @example
 * ```tsx
 * // Footer with overflow toolbar
 * <CardFooter>
 *   <Toolbar design="Transparent" alignContent="End">
 *     <ToolbarItem><Button design="Tertiary">Cancel</Button></ToolbarItem>
 *     <ToolbarItem><Button design="Primary">Submit</Button></ToolbarItem>
 *   </Toolbar>
 * </CardFooter>
 * ```
 */
export function CardFooter({ children, className, style, "data-testid": dataTestId, ref }: CardFooterProps & { ref?: Ref<HTMLDivElement> }) {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-end gap-4 p-4 pt-3 border-t border-sapphire-border-primary",
          className
        )}
        style={style}
        data-testid={dataTestId}
        data-part="footer"
      >
        {children}
      </div>
    );
  }
