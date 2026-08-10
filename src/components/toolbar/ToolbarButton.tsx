import React, { useCallback } from "react";
import { cn } from "../../lib/utils";
import { Button } from "../button/Button";
import { useToolbarContext } from "./ToolbarContext";
import { ButtonDesign, ButtonSize } from "../../types/button";
import type { ToolbarButtonProps } from "../../types/toolbar";

/**
 * ToolbarButton
 *
 * Button for use inside a Toolbar.
 * In normal mode, renders as a standard Button.
 * In overflow mode, renders as a full-width menu-item-style button.
 */
export function ToolbarButton({
  design = ButtonDesign.SecondaryNeutral,
  icon,
  endIcon,
  text,
  tooltip,
  disabled = false,
  width,
  overflowPriority: _overflowPriority,
  preventOverflowClosing = false,
  accessibleName,
  accessibleNameRef,
  onClick,
  className,
  ref,
}: ToolbarButtonProps) {
    const { isInOverflow, closeOverflow } = useToolbarContext();

    const handleOverflowClick = useCallback(
      (e: React.MouseEvent) => {
        onClick?.(e);
        if (!preventOverflowClosing) {
          closeOverflow();
        }
      },
      [onClick, preventOverflowClosing, closeOverflow]
    );

    if (isInOverflow) {
      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          type="button"
          disabled={disabled}
          title={tooltip}
          aria-label={accessibleName}
          aria-labelledby={accessibleNameRef}
          onClick={handleOverflowClick}
          className={cn(
            "w-full flex items-center gap-2 px-3 py-2 text-sm",
            "hover:bg-muted rounded-md text-left",
            "focus:outline-none focus:ring-2 focus:ring-inset focus:ring-ring focus:z-10",
            "disabled:pointer-events-none disabled:opacity-50",
            className
          )}
        >
          {icon && (
            <span className="inline-flex items-center shrink-0 [&>svg]:h-4 [&>svg]:w-4">
              {icon}
            </span>
          )}
          {text && <span className="flex-1">{text}</span>}
          {text == null && tooltip && <span className="flex-1">{tooltip}</span>}
          {endIcon && (
            <span className="inline-flex items-center shrink-0 [&>svg]:h-4 [&>svg]:w-4">
              {endIcon}
            </span>
          )}
        </button>
      );
    }

    const isIconOnly = !!icon && !text;

    return (
      <div ref={ref as React.Ref<HTMLDivElement>} className="shrink-0" style={width ? { width } : undefined}>
        <Button
          design={design}
          size={ButtonSize.Medium}
          icon={icon}
          endIcon={endIcon}
          iconOnly={isIconOnly}
          disabled={disabled}
          tooltip={tooltip}
          accessibleName={accessibleName}
          accessibleNameRef={accessibleNameRef}
          onClick={(detail) => onClick?.(detail.originalEvent as React.MouseEvent)}
          className={cn(width && "w-full", className)}
        >
          {text}
        </Button>
      </div>
    );
}

ToolbarButton.displayName = "ToolbarButton";
