import { useId, Children, isValidElement } from "react";
import { cn, cva, subTestId } from "../../lib/utils";
import { MessageStripProps, MessageStripDesign } from "../../types/messagestrip";
import { MessageSuccessIcon } from "../../icons/MessageSuccess";
import { MessageErrorIcon } from "../../icons/MessageError";
import { MessageWarningIcon } from "../../icons/MessageWarning";
import { MessageInformationIcon } from "../../icons/MessageInformation";
import { useTranslation } from "react-i18next";
import { Button } from "../button/Button";
import { ButtonDesign, ButtonSize } from "../../types/button";
import { DeclineIcon } from "../../icons/Decline";
import { RefreshIcon } from "../../icons/Refresh";

/**
 * MessageStrip container variants
 */
const messageStripVariants = cva(
  [
    "relative flex gap-sapphire-3xs rounded-[4px] border border-solid min-h-[40px] transition-all duration-200",
  ],
  {
    variants: {
      design: {
        [MessageStripDesign.Information]: "bg-sapphire-info-bg border-sapphire-info-border",
        [MessageStripDesign.Positive]: "bg-sapphire-positive-bg border-sapphire-positive-border",
        [MessageStripDesign.Negative]: "bg-sapphire-negative-bg border-sapphire-negative-border",
        [MessageStripDesign.Warning]: "bg-sapphire-warning-bg border-sapphire-warning-border",
      },
      hasTitle: {
        true: "flex-col p-sapphire-2xs",
        false: "items-start p-sapphire-2xs",
      },
    },
    defaultVariants: {
      design: MessageStripDesign.Information,
      hasTitle: false,
    },
  }
);

/**
 * MessageStrip icon variants
 */
const iconVariants = cva("flex-shrink-0", {
  variants: {
    design: {
      [MessageStripDesign.Information]: "text-sapphire-info",
      [MessageStripDesign.Positive]: "text-sapphire-positive",
      [MessageStripDesign.Negative]: "text-sapphire-negative",
      [MessageStripDesign.Warning]: "text-sapphire-warning",
    },
  },
  defaultVariants: {
    design: MessageStripDesign.Information,
  },
});

/**
 * Maps design to the i18n key for the design type announcement
 */
const designAnnouncementKey = {
  [MessageStripDesign.Information]: "MESSAGE_STRIP_INFORMATION",
  [MessageStripDesign.Positive]: "MESSAGE_STRIP_SUCCESS",
  [MessageStripDesign.Negative]: "MESSAGE_STRIP_ERROR",
  [MessageStripDesign.Warning]: "MESSAGE_STRIP_WARNING",
} as const;

/**
 * Maps design to the i18n key for the close button label
 */
const designCloseButtonKey = {
  [MessageStripDesign.Information]: "MESSAGE_STRIP_CLOSE_BUTTON_INFORMATION",
  [MessageStripDesign.Positive]: "MESSAGE_STRIP_CLOSE_BUTTON_POSITIVE",
  [MessageStripDesign.Negative]: "MESSAGE_STRIP_CLOSE_BUTTON_NEGATIVE",
  [MessageStripDesign.Warning]: "MESSAGE_STRIP_CLOSE_BUTTON_CRITICAL",
} as const;

/**
 * MessageStrip component
 *
 * Displays contextual messages with different severity levels.
 * Supports Information, Positive, Negative, and Warning designs.
 */
export function MessageStrip({
  design = MessageStripDesign.Information,
  title,
  titleTruncate = false,
  children,
  icon,
  hideIcon = false,
  hideCloseButton = false,
  onClose,
  onRefresh,
  showRefresh = false,
  accessibleName,
  accessibleNameRef,
  accessibleRole,
  accessibleDescription,
  accessibleDescriptionRef,
  id: idProp,
  className,
  style,
  "data-testid": dataTestId,
  ref,
}: MessageStripProps) {
    const autoId = useId();
    const descriptionId = useId();
    const { t } = useTranslation("fx");

    const id = idProp || autoId;
    const hiddenTextId = `${id}-hidden-text`;
    const contentTextId = `${id}-content-text`;

    // Normalize design to enum value
    const normalizedDesign = design as MessageStripDesign;
    const hasTitle = !!title;

    // Determine default icon based on design
    const getDefaultIcon = () => {
      switch (normalizedDesign) {
        case MessageStripDesign.Positive:
          return <MessageSuccessIcon className="block h-4 w-4" />;
        case MessageStripDesign.Negative:
          return <MessageErrorIcon className="block h-4 w-4" />;
        case MessageStripDesign.Warning:
          return <MessageWarningIcon className="block h-4 w-4" />;
        case MessageStripDesign.Information:
        default:
          return <MessageInformationIcon className="block h-4 w-4" />;
      }
    };

    // Build hidden text for screen readers (design announcement + closable state)
    const announcementKey = designAnnouncementKey[normalizedDesign] || designAnnouncementKey[MessageStripDesign.Information];
    const announcementText = t(announcementKey);
    const closableText = !hideCloseButton ? ` ${t("MESSAGE_STRIP_CLOSABLE")}` : "";
    const hiddenText = `${announcementText}${closableText}`;

    // Design-specific close button label
    const closeButtonKey = designCloseButtonKey[normalizedDesign] || designCloseButtonKey[MessageStripDesign.Information];
    const closeButtonText = t(closeButtonKey);

    const refreshText = t("MESSAGE_STRIP_REFRESH") as string;

    const handleClose = () => {
      onClose?.({ closed: true });
    };

    const hasButtons = showRefresh || !hideCloseButton;

    const buttonsArea = hasButtons ? (
      <div className="flex items-center flex-shrink-0 self-start">
        {showRefresh && (
          <Button
            design={ButtonDesign.Tertiary}
            size={ButtonSize.Small}
            icon={<RefreshIcon className="h-3 w-3" />}
            onClick={onRefresh}
          >
            {refreshText}
          </Button>
        )}
        {!hideCloseButton && (
          <Button
            design={ButtonDesign.SecondaryNeutral}
            size={ButtonSize.Small}
            icon={<DeclineIcon className="h-3 w-3" />}
            iconOnly
            onClick={handleClose}
            accessibleName={closeButtonText}
            tooltip={closeButtonText}
            data-testid={subTestId(dataTestId, "close")}
          />
        )}
      </div>
    ) : null;

    return (
      <div
        ref={ref}
        id={id}
        role={accessibleRole || "note"}
        aria-label={accessibleName}
        aria-labelledby={accessibleNameRef || `${hiddenTextId} ${contentTextId}`}
        aria-describedby={[accessibleDescriptionRef, accessibleDescription ? descriptionId : null].filter(Boolean).join(" ") || undefined}
        data-testid={dataTestId}
        className={cn(messageStripVariants({ design: normalizedDesign, hasTitle }), className)}
        style={style}
      >
        {/* Hidden text for screen readers */}
        <span className="sr-only" id={hiddenTextId}>{hiddenText}</span>

        {hasTitle ? (
          <>
            {/* Title row: icon + title + close */}
            <div className="flex items-center gap-sapphire-3xs w-full">
              {!hideIcon && (
                <div className={cn(iconVariants({ design: normalizedDesign }), "p-1 self-start")} aria-hidden="true">
                  {icon || getDefaultIcon()}
                </div>
              )}
              <div className={cn("flex-1 min-w-0 text-sm font-semibold leading-5 text-sapphire-text-primary", titleTruncate && "truncate")} id={contentTextId}>
                {title}
              </div>
              {buttonsArea}
            </div>
            {/* Body text row — indented to align with title */}
            {children && (
              <div className={cn(
                "text-sm font-normal leading-5 text-sapphire-text-secondary flex flex-wrap items-start gap-2",
                !hideIcon && "pl-7"
              )}>
                {children}
              </div>
            )}
          </>
        ) : (
          <>
            {!hideIcon && (
              <div className={cn(iconVariants({ design: normalizedDesign }), "p-1")} aria-hidden="true">
                {icon || getDefaultIcon()}
              </div>
            )}
            <div className={cn("flex-1 text-sm font-semibold leading-5 text-sapphire-text-primary min-w-0 py-0.5", titleTruncate && "flex items-baseline")} id={contentTextId}>
              {titleTruncate ? (() => {
                const textParts: React.ReactNode[] = [];
                const elementParts: React.ReactNode[] = [];
                Children.forEach(children, (child) => {
                  if (isValidElement(child)) {
                    elementParts.push(child);
                  } else {
                    textParts.push(child);
                  }
                });
                return (
                  <>
                    <span className="min-w-0 truncate">{textParts}</span>
                    {elementParts.length > 0 && (
                      <span className="flex-shrink-0 whitespace-nowrap ml-1 [&_a]:overflow-visible [&_a]:max-w-none">{elementParts}</span>
                    )}
                  </>
                );
              })() : children}
            </div>
            {buttonsArea}
          </>
        )}

        {accessibleDescription && (
          <span id={descriptionId} className="sr-only">
            {accessibleDescription}
          </span>
        )}
      </div>
    );
}
