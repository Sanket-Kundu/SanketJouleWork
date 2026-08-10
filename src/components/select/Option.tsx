import { cn } from "../../lib/utils";
import { ListItem } from "../list/ListItem";
import { ListItemAccessibleRole } from "../../types/list";
import { OptionProps } from "../../types/select";

/**
 * Option component
 *
 * Represents a single selectable option in the Select dropdown.
 * Wraps ListItem with accessibleRole="Option" for correct listbox semantics.
 */
export function Option(
    {
      value,
      icon,
      additionalText,
      tooltip,
      selected = false,
      disabled = false,
      focused = false,
      onClick,
      children,
      className,
    }: OptionProps
  ) {
    const displayText = typeof children === "string" ? children : "";

    return (
      <ListItem
        accessibleRole={ListItemAccessibleRole.Option}
        text={displayText}
        icon={icon ? <span className="text-current">{icon}</span> : undefined}
        additionalText={additionalText}
        tooltip={tooltip}
        selected={selected}
        disabled={disabled}
        focused={focused}
        onClick={onClick ? () => onClick() : undefined}
        itemKey={value ?? displayText}
        className={cn(
          "!min-h-8 !h-8 [&>span]:!px-4 [&>span]:!py-0 [&_span]:!font-normal",
          // Override the default ring focus style with an inset ::after pseudo-element
          // so the focus ring is not clipped by the popover's rounded corners
          "!ring-0",
          focused && "after:absolute after:inset-0.5 after:border-2 after:border-ring after:pointer-events-none",
          selected && "!bg-sapphire-brand-selected-background",
          className,
        )}
      >
        {typeof children !== "string" ? children : undefined}
      </ListItem>
    );
  }

Option.displayName = "Option";
