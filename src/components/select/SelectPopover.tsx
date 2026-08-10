import React from "react";
import { cva } from "../../lib/utils";
import { SelectPopoverProps } from "../../types/select";
import { ValueState } from "../../types/combobox";
import { ResponsivePopoverRef } from "../../types/responsive-popover";
import { ResponsivePopover } from "../responsive-popover/ResponsivePopover";
import { List } from "../list/List";
import { ListAccessibleRole, ListSeparator } from "../../types/list";

/**
 * Value state styling variants
 */
export const valueStateVariants = cva(
  "flex items-center gap-2 px-3 py-2 text-sm border-b",
  {
    variants: {
      state: {
        [ValueState.None]: "hidden",
        [ValueState.Positive]: "bg-sapphire-positive-bg text-sapphire-positive border-sapphire-positive",
        [ValueState.Negative]: "bg-sapphire-negative-bg text-sapphire-negative border-sapphire-negative",
        [ValueState.Critical]: "bg-sapphire-warning-bg text-sapphire-warning border-sapphire-warning",
        [ValueState.Information]: "bg-sapphire-info-bg text-sapphire-info border-sapphire-info",
      },
    },
    defaultVariants: {
      state: ValueState.None,
    },
  }
);

/**
 * SelectPopover component
 *
 * The dropdown popover for Select. Uses ResponsivePopover internally:
 * on desktop it renders as a positioned popover below the trigger,
 * on phone it renders as a full-screen dialog.
 */
export function SelectPopover(
    {
      open,
      triggerRef,
      valueState: _valueState,
      valueStateMessage: _valueStateMessage,
      hasValueState = false,
      valueStatePortalRef,
      mobileTitle = "Select option",
      onBeforeClose,
      onClose,
      children,
      className,
      ref,
    }: SelectPopoverProps & { ref?: React.Ref<ResponsivePopoverRef> }
  ) {
    return (
      <ResponsivePopover
        ref={ref}
        open={open}
        opener={triggerRef}
        placement="Bottom"
        horizontalAlign="Stretch"
        hideArrow
        preventInitialFocus
        preventFocusRestore
        noPadding
        headerText={mobileTitle}
        contentOnlyOnDesktop
        onBeforeClose={onBeforeClose}
        onClose={onClose}
        className={className}
      >
        <div className="flex flex-col">
          {/* Portal target — value state message is portaled here from Select */}
          {hasValueState && <div ref={valueStatePortalRef} />}

          {/* Options list */}
          <List
            accessibleRole={ListAccessibleRole.ListBox}
            separators={ListSeparator.None}
          >
            {children}
          </List>
        </div>
      </ResponsivePopover>
    );
  }
