import React from "react";
import { useTranslation } from "react-i18next";
import { ResponsivePopoverRef } from "../../types/responsive-popover";
import { ResponsivePopover } from "../responsive-popover/ResponsivePopover";
import { List } from "../list/List";
import { ListAccessibleRole, ListSeparator } from "../../types/list";
import { Loader2 } from "lucide-react";

interface ComboBoxPopoverProps {
  open: boolean;
  triggerRef: React.RefObject<HTMLElement | null>;
  /** Whether a value state message will be portaled into this popover */
  hasValueState?: boolean;
  /** Ref to the portal target div where the value state message will be rendered */
  valueStatePortalRef?: React.RefCallback<HTMLDivElement>;
  /** Content rendered above the list (e.g. Select All row) */
  headerContent?: React.ReactNode;
  loading?: boolean;
  mobileTitle?: string;
  onBeforeClose?: (detail: { escPressed: boolean }) => boolean | void;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

/**
 * ComboBoxPopover component
 *
 * The dropdown popover for ComboBox. Uses ResponsivePopover internally:
 * on desktop it renders as a positioned popover below the trigger,
 * on phone it renders as a full-screen dialog.
 */
export function ComboBoxPopover(
    {
      open,
      triggerRef,
      hasValueState = false,
      valueStatePortalRef,
      headerContent,
      loading = false,
      mobileTitle = "Suggestions",
      onBeforeClose,
      onClose,
      children,
      className,
      ref,
    }: ComboBoxPopoverProps & { ref?: React.Ref<ResponsivePopoverRef> }
  ) {
    const { t } = useTranslation("fx");
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
          {/* Portal target — value state message is portaled here from ComboBox */}
          {hasValueState && <div ref={valueStatePortalRef} />}

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-sapphire-text-tertiary" />
              <span className="ml-2 text-sm text-sapphire-text-tertiary">{t("COMBOBOX_LOADING")}</span>
            </div>
          ) : (
            <>
              {headerContent}
              <List
                accessibleRole={ListAccessibleRole.ListBox}
                separators={ListSeparator.None}
              >
                {children}
              </List>
            </>
          )}
        </div>
      </ResponsivePopover>
    );
  }
