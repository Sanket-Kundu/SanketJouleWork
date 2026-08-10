import { useCallback } from "react";
import { cn } from "../../lib/utils";
import { Select } from "../select/Select";
import { useToolbarContext } from "./ToolbarContext";
import type { ToolbarSelectProps } from "../../types/toolbar";
import type { SelectChangeDetail } from "../../types/select";

/**
 * ToolbarSelect
 *
 * Select dropdown for use inside a Toolbar.
 * In normal mode, renders with optional fixed width.
 * In overflow mode, renders full-width.
 */
export function ToolbarSelect({
  width,
  value,
  disabled = false,
  overflowPriority: _overflowPriority,
  preventOverflowClosing = false,
  accessibleName,
  accessibleNameRef,
  onChange,
  onOpen,
  onClose,
  children,
  className,
  ref,
}: ToolbarSelectProps) {
    const { isInOverflow, closeOverflow } = useToolbarContext();

    const handleChange = useCallback(
      (detail: SelectChangeDetail) => {
        onChange?.(detail);
        if (isInOverflow && !preventOverflowClosing) {
          closeOverflow();
        }
      },
      [onChange, isInOverflow, preventOverflowClosing, closeOverflow]
    );

    if (isInOverflow) {
      return (
        <div ref={ref} className={cn("w-full px-3 py-1", className)}>
          <Select
            value={value}
            disabled={disabled}
            accessibleName={accessibleName}
            accessibleNameRef={accessibleNameRef}
            onChange={handleChange}
            onOpen={onOpen}
            onClose={onClose}
            className="w-full"
          >
            {children}
          </Select>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn("shrink-0", className)}
        style={width ? { width } : undefined}
      >
        <Select
          value={value}
          disabled={disabled}
          accessibleName={accessibleName}
          accessibleNameRef={accessibleNameRef}
          onChange={handleChange}
          onOpen={onOpen}
          onClose={onClose}
          className={cn(width && "w-full")}
        >
          {children}
        </Select>
      </div>
    );
}

ToolbarSelect.displayName = "ToolbarSelect";
