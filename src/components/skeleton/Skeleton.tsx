import * as React from "react";
import { cn } from "../../lib/utils";
import "./Skeleton.css";

export type SkeletonProps = React.ComponentProps<"div">;

/**
 * @experimental This component is not production-ready. Use at your own risk.
 */
function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      className={cn("skeleton-shimmer rounded-md", className)}
      {...props}
    />
  );
}

Skeleton.displayName = "Skeleton";

export { Skeleton };
