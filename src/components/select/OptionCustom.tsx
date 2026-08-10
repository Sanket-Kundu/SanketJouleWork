import { cn } from "../../lib/utils";
import { ListItemCustom } from "../list/ListItemCustom";
import { ListItemAccessibleRole } from "../../types/list";
import { OptionCustomProps } from "../../types/select";

/**
 * OptionCustom component
 *
 * A custom option that allows arbitrary content. When selected,
 * the `displayText` prop is shown in the Select trigger.
 * Wraps ListItemCustom with accessibleRole="Option" for correct listbox semantics.
 */
export function OptionCustom(
    {
      displayText,
      value,
      selected = false,
      disabled = false,
      focused = false,
      onClick,
      children,
      className,
    }: OptionCustomProps
  ) {
    return (
      <ListItemCustom
        accessibleRole={ListItemAccessibleRole.Option}
        selected={selected}
        disabled={disabled}
        focused={focused}
        onClick={onClick ? () => onClick() : undefined}
        itemKey={value ?? displayText ?? ""}
        className={cn(
          "!min-h-8 !h-8 [&>span]:!px-4 [&>span]:!py-0",
          // Override the default ring focus style with an inset ::after pseudo-element
          // so the focus ring is not clipped by the popover's rounded corners
          "!ring-0",
          focused && "after:absolute after:inset-0.5 after:border-2 after:border-ring after:pointer-events-none",
          selected && "!bg-sapphire-brand-selected-background",
          className,
        )}
      >
        {children}
      </ListItemCustom>
    );
  }

OptionCustom.displayName = "OptionCustom";
