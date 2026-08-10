import React from "react";
import { cn } from "../../lib/utils";
import { ComboBoxItemProps } from "../../types/combobox";

/**
 * ComboBoxItem component
 *
 * Renders a single selectable item in the ComboBox dropdown.
 * Uses a plain <li> with role="option" for correct listbox semantics
 * and precise 32px height matching the Figma spec.
 */
export function ComboBoxItem(
    {
      text,
      additionalText,
      value,
      icon: _icon,
      disabled = false,
      selected = false,
      focused = false,
      isVisible = true,
      onClick,
      children,
      className,
      ref,
    }: ComboBoxItemProps & { ref?: React.Ref<HTMLLIElement> }
  ) {
    // Don't render if not visible (filtered out)
    if (!isVisible) {
      return null;
    }

    // Determine display text
    const displayText = text ?? (typeof children === "string" ? children : "");
    const itemValue = value ?? displayText;

    return (
      <li
        ref={ref}
        role="option"
        aria-selected={selected}
        aria-disabled={disabled || undefined}
        id={itemValue}
        data-value={itemValue}
        onClick={onClick && !disabled ? () => onClick() : undefined}
        className={cn(
          "flex items-center min-h-8 px-4 py-1.5 gap-4 text-sm cursor-pointer",
          "bg-sapphire-background-primary text-sapphire-text-primary",
          "transition-colors outline-none relative",
          !disabled && "hover:bg-sapphire-neutral-hover-background dark:hover:bg-neutral-800",
          focused && !selected && "bg-sapphire-neutral-hover-background dark:bg-neutral-800",
          focused && "after:absolute after:inset-0.5 after:border-2 after:border-ring after:pointer-events-none",
          selected && "bg-sapphire-brand-selected-background",
          disabled && "opacity-50 pointer-events-none cursor-not-allowed",
          className,
        )}
      >
        <span className="flex-1">{children || displayText}</span>
        {additionalText && (
          <span className="shrink-0 text-sapphire-text-tertiary text-sm">
            {additionalText}
          </span>
        )}
      </li>
    );
  }

ComboBoxItem.displayName = "ComboBoxItem";
