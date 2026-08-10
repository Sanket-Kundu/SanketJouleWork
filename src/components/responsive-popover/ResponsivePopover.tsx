import {
  useState,
  useRef,
  useImperativeHandle,
  useCallback,
} from "react";
import { Popover } from "../popover/Popover";
import { Dialog } from "../dialog/Dialog";
import { Button } from "../button/Button";
import { Title } from "../title/Title";
import type { PopoverRef } from "../../types/popover";
import type { DialogRef } from "../../types/dialog";
import type {
  ResponsivePopoverProps,
} from "../../types/responsive-popover";
import { isPhone } from "../../lib/Device";

/**
 * Hook that returns true on phone devices.
 * Evaluated once on mount (device type doesn't change at runtime).
 */
function useIsPhone(): boolean {
  const [phone] = useState(() => isPhone());
  return phone;
}

/**
 * ResponsivePopover component
 *
 * Renders as a Popover on desktop/tablet and a full-screen Dialog on phone.
 * The API matches the Popover API with additional mobile-specific options.
 *
 * @example
 * ```tsx
 * <Button ref={btnRef} onClick={() => setOpen(true)}>Open</Button>
 * <ResponsivePopover
 *   opener={btnRef}
 *   open={open}
 *   headerText="Settings"
 *   onClose={() => setOpen(false)}
 * >
 *   <p>Content adapts to device</p>
 * </ResponsivePopover>
 * ```
 */
export function ResponsivePopover(
    {
      headerText,
      placement,
      horizontalAlign,
      verticalAlign,
      hideArrow,
      offset,
      allowTargetOverlap,
      opener,
      open = false,
      initialFocus,
      preventFocusRestore,
      preventInitialFocus,
      accessibleName,
      accessibleNameRef,
      accessibleRole,
      accessibleDescription,
      header,
      footer,
      children,
      onBeforeOpen,
      onOpen,
      onBeforeClose,
      onClose,
      contentOnlyOnDesktop = false,
      noPadding = false,
      hideHeaderBorder = false,
      hideFooterBorder = false,
      showCloseButton = true,
      className,
      style,
      id,
      ref,
      "data-testid": dataTestId,
    }: ResponsivePopoverProps
  ) {
    const isPhone = useIsPhone();
    const popoverRef = useRef<PopoverRef>(null);
    const dialogRef = useRef<DialogRef>(null);

    // Close handler for the mobile close button
    const handleMobileClose = useCallback(() => {
      onBeforeClose?.({ escPressed: false });
      onClose?.();
    }, [onBeforeClose, onClose]);

    // Imperative handle — delegates to inner Popover or Dialog
    useImperativeHandle(
      ref,
      () => ({
        open() {
          if (isPhone) {
            dialogRef.current?.show();
          } else {
            popoverRef.current?.open();
          }
        },
        close() {
          if (isPhone) {
            dialogRef.current?.close();
          } else {
            popoverRef.current?.close();
          }
        },
        async applyFocus() {
          if (isPhone) {
            dialogRef.current?.focus();
          } else {
            await popoverRef.current?.applyFocus();
          }
        },
        isOpen() {
          if (isPhone) {
            return open;
          }
          return popoverRef.current?.isOpen() ?? false;
        },
        get nativeElement() {
          if (isPhone) {
            return null; // Dialog uses native <dialog> element
          }
          return popoverRef.current?.nativeElement ?? null;
        },
      }),
      [isPhone, open]
    );

    // ── Phone mode: render as Dialog ──────────────────────────────────────
    if (isPhone) {
      // Build mobile header: custom header or title + optional close button
      const titleId = `${id || "responsive-popover"}-title`;
      const mobileHeader = (header || headerText || showCloseButton) ? (
        <div className="flex items-center justify-between w-full">
          {header || (headerText && (
            <Title level="H1" id={titleId} className="text-base font-semibold">
              {headerText}
            </Title>
          ))}
          {showCloseButton && (
            <Button
              design="Tertiary"
              iconOnly
              accessibleName="Close"
              onClick={handleMobileClose}
              className="ml-auto"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              }
            />
          )}
        </div>
      ) : undefined;

      return (
        <Dialog
          ref={dialogRef}
          open={open}
          onOpenChange={(isOpen) => {
            if (!isOpen) onClose?.();
          }}
          headerText={!header && !showCloseButton ? headerText : undefined}
          header={mobileHeader}
          footer={footer}
          stretch={true}
          noPadding={noPadding}
          hideHeaderBorder={hideHeaderBorder}
          initialFocus={initialFocus}
          preventInitialFocus={preventInitialFocus}
          accessibleName={accessibleName}
          accessibleNameRef={
            accessibleNameRef ||
            (!accessibleName && headerText && !header && showCloseButton ? titleId : undefined)
          }
          accessibleRole={
            accessibleRole === "AlertDialog"
              ? "alertdialog"
              : accessibleRole === "None"
                ? undefined
                : "dialog"
          }
          onBeforeOpen={() => onBeforeOpen?.()}
          onAfterOpen={() => onOpen?.()}
          onBeforeClose={(detail) =>
            onBeforeClose?.({ escPressed: !!detail.escPressed })
          }
          onAfterClose={() => onClose?.()}
          className={className}
          id={id}
          data-testid={dataTestId}
        >
          {children}
        </Dialog>
      );
    }

    // ── Desktop/Tablet mode: render as Popover ───────────────────────────
    return (
      <Popover
        ref={popoverRef}
        open={open}
        opener={opener}
        headerText={contentOnlyOnDesktop ? undefined : headerText}
        header={contentOnlyOnDesktop ? undefined : header}
        footer={contentOnlyOnDesktop ? undefined : footer}
        placement={placement}
        horizontalAlign={horizontalAlign}
        verticalAlign={verticalAlign}
        hideArrow={hideArrow}
        offset={offset}
        allowTargetOverlap={allowTargetOverlap}
        noPadding={noPadding}
        hideHeaderBorder={hideHeaderBorder}
        hideFooterBorder={hideFooterBorder}
        initialFocus={initialFocus}
        preventFocusRestore={preventFocusRestore}
        preventInitialFocus={preventInitialFocus}
        accessibleName={accessibleName}
        accessibleNameRef={accessibleNameRef}
        accessibleRole={accessibleRole}
        accessibleDescription={accessibleDescription}
        onBeforeOpen={onBeforeOpen}
        onOpen={onOpen}
        onBeforeClose={onBeforeClose}
        onClose={onClose}
        className={className}
        style={style}
        id={id}
        data-testid={dataTestId}
      >
        {children}
      </Popover>
    );
  }
