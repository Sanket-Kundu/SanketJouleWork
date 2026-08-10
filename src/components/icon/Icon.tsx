import React, { useRef, useCallback, useImperativeHandle } from "react";
import { cn, cva } from "../../lib/utils";
import {
  IconProps,
  IconDesign,
  IconMode,
} from "../../types/icon";

/**
 * Icon design variants
 */
const iconVariants = cva(
  [
    "inline-block flex-shrink-0",
    "transition-colors",
    "fill-current", // Use fill-current to inherit parent's text color
  ],
  {
    variants: {
      design: {
        [IconDesign.Default]: "", // No color set - inherits from parent
        [IconDesign.Contrast]: "text-foreground-contrast",
        [IconDesign.Critical]: "text-sapphire-warning",
        [IconDesign.Information]: "text-sapphire-info",
        [IconDesign.Positive]: "text-sapphire-positive",
        [IconDesign.Negative]: "text-sapphire-negative",
        [IconDesign.Neutral]: "text-sapphire-text-tertiary",
        [IconDesign.NonInteractive]: "text-sapphire-text-tertiary opacity-60",
      },
      mode: {
        [IconMode.Decorative]: "",
        [IconMode.Image]: "",
        [IconMode.Interactive]: "cursor-pointer hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
      },
    },
    defaultVariants: {
      design: IconDesign.Default,
      mode: IconMode.Decorative,
    },
  }
);

/**
 * Icon component
 *
 * A pure React SVG icon component using SAP Fiori icon paths.
 * Works like lucide-react - accepts className for easy styling.
 *
 * @example
 * ```tsx
 * import { EmployeeIcon } from "@sap-ui/fx-components/icons/Employee";
 *
 * // Basic usage with default size
 * <EmployeeIcon />
 *
 * // Custom size and color via className
 * <EmployeeIcon className="h-6 w-6 text-primary" />
 *
 * // Interactive icon
 * <EmployeeIcon
 *   mode="Interactive"
 *   accessibleName="Employee"
 *   onClick={(detail) => console.log('clicked')}
 *   className="h-5 w-5"
 * />
 *
 * // With design variant
 * <EmployeeIcon design="Negative" className="h-8 w-8" />
 * ```
 */
export function Icon({
  pathData,
  viewBox = "0 0 512 512",
  pathMeta,
  design = IconDesign.Default,
  mode = IconMode.Decorative,
  accessibleName,
  showTooltip = false,
  onClick,
  className,
  style,
  id,
  "data-testid": dataTestId,
  ref,
}: IconProps) {
    const iconRef = useRef<SVGSVGElement>(null);

    // Expose imperative methods
    useImperativeHandle(
      ref,
      () => ({
        focus() {
          iconRef.current?.focus();
        },
        blur() {
          iconRef.current?.blur();
        },
        isFocused() {
          return document.activeElement === iconRef.current;
        },
        get nativeElement() {
          return iconRef.current;
        },
      }),
      []
    );

    // Handle click
    const handleClick = useCallback(
      (e: React.MouseEvent<SVGSVGElement>) => {
        if (mode !== IconMode.Interactive) return;

        onClick?.({
          originalEvent: e,
          isKeyboard: false,
        });
      },
      [mode, onClick]
    );

    // Handle keyboard activation
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<SVGSVGElement>) => {
        if (mode !== IconMode.Interactive) return;

        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.({
            originalEvent: e,
            isKeyboard: true,
          });
        }
      },
      [mode, onClick]
    );

    if (!pathData || pathData.length === 0) {
      return null;
    }

    // Determine ARIA attributes
    const isInteractive = mode === IconMode.Interactive;
    const isImage = mode === IconMode.Image;
    const role = isInteractive ? "button" : isImage ? "img" : "presentation";
    const ariaLabel = accessibleName || undefined;
    const ariaHidden = !accessibleName && !isInteractive ? true : undefined;
    const tabIndex = isInteractive ? 0 : undefined;

    return (
      <svg
        ref={iconRef}
        id={id}
        role={role}
        aria-label={ariaLabel}
        aria-hidden={ariaHidden}
        tabIndex={tabIndex}
        viewBox={viewBox}
        xmlns="http://www.w3.org/2000/svg"
        focusable={isInteractive ? "true" : "false"}
        preserveAspectRatio="xMidYMid meet"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={cn(
          iconVariants({
            design: design as IconDesign,
            mode: mode as IconMode,
          }),
          // Default size (can be overridden by className)
          "h-4 w-4",
          className
        )}
        style={style}
        data-testid={dataTestId}
      >
        {showTooltip && accessibleName && (
          <title>{accessibleName}</title>
        )}
        <g role="presentation">
          {pathData.map((path, index) => (
            <path
              key={index} // NOSONAR: static paths never reorder
              d={path}
              fillRule={pathMeta?.[index]?.fillRule}
              clipRule={pathMeta?.[index]?.clipRule}
            />
          ))}
        </g>
      </svg>
    );
}
