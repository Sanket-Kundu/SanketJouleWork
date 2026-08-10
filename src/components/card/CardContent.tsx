import type { Ref } from "react";
import { cn } from "../../lib/utils";
import { CardContentProps } from "../../types/card";

/**
 * CardContent component
 *
 * A wrapper for the main content area of a Card.
 * Provides consistent padding and styling.
 *
 * @example
 * ```tsx
 * <CardContent>
 *   <p>Card body content goes here.</p>
 * </CardContent>
 * ```
 */
export function CardContent({ children, className, style, "data-testid": dataTestId, ref }: CardContentProps & { ref?: Ref<HTMLDivElement> }) {
    return (
      <div
        ref={ref}
        className={cn("p-4", className)}
        style={style}
        data-testid={dataTestId}
        data-part="content"
      >
        {children}
      </div>
    );
  }
