import React from "react";
import { cn } from "../../lib/utils";
import { AcceptIcon } from "../../icons/Accept";
import { MultiComboBoxItemProps } from "../../types/multicombobox";

/**
 * MultiComboBoxItem component
 *
 * Renders a single selectable item in the MultiComboBox dropdown.
 * Each item includes a checkbox on the left to indicate selection state.
 * Uses a plain <li> with role="option" for correct listbox semantics
 * and precise 32px height matching the Figma spec.
 */
export function MultiComboBoxItem(
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
      tabIndex,
      ref,
    }: MultiComboBoxItemProps & { ref?: React.Ref<HTMLLIElement>; tabIndex?: number }
  ) {
    if (!isVisible) {
      return null;
    }

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
        tabIndex={tabIndex}
        className={cn(
          "flex items-center h-8 px-4 gap-2 text-sm cursor-pointer",
          "text-sapphire-text-primary",
          "transition-colors outline-none relative",
          !disabled && !selected && "bg-sapphire-background-primary",
          !disabled && !selected && "hover:bg-sapphire-neutral-hover-background-2",
          focused && "after:absolute after:inset-0.5 after:border-2 after:border-ring after:pointer-events-none",
          selected && "bg-sapphire-brand-selected-background",
          selected && "hover:bg-sapphire-brand-selected-hover-background",
          disabled && "opacity-50 pointer-events-none cursor-not-allowed",
          className,
        )}
      >
        {/* Checkbox visual — matches CheckBox Small styling */}
        <span
          className={cn(
            "relative inline-flex items-center justify-center shrink-0",
            "size-4 rounded p-[2px] border border-solid transition-colors",
            selected
              ? "bg-sapphire-canvas-primary border-primary text-primary"
              : "bg-sapphire-canvas-primary border-sapphire-border-secondary",
          )}
          aria-hidden="true"
        >
          {selected && <AcceptIcon className="size-3" />}
        </span>

        <span className="flex-1 truncate">{children || displayText}</span>
        {additionalText && (
          <span className="shrink-0 text-sapphire-text-tertiary text-sm">
            {additionalText}
          </span>
        )}
      </li>
    );
  }

MultiComboBoxItem.displayName = "MultiComboBoxItem";
