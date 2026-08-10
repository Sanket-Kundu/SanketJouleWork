import { Option } from "../select/Option";
import type { ToolbarSelectOptionProps } from "../../types/toolbar";

/**
 * ToolbarSelectOption
 *
 * Thin wrapper around Option for use inside ToolbarSelect.
 */
export function ToolbarSelectOption({ value, selected, children, ref }: ToolbarSelectOptionProps) {
    return (
      <Option ref={ref} value={value} selected={selected}>
        {children}
      </Option>
    );
}
