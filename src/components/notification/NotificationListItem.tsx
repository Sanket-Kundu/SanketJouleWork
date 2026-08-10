import * as React from "react";
import {
  useRef,
  useState,
  useCallback,
  useEffect,
  useImperativeHandle,
} from "react";
import { useTranslation } from "react-i18next";
import { cn, cva, subTestId } from "../../lib/utils";
import { useOptionalNotificationListContext } from "./NotificationList";
import { ListItemBase } from "../list/ListItemBase";
import { ListItemType, ListItemRef } from "../../types/list";
import { Button } from "../button/Button";
import { ButtonDesign, ButtonSize } from "../../types/button";
import { Link } from "../link/Link";
import { Tag } from "../tag/Tag";
import { TagDesign } from "../../types/tag";
import {
  NotificationListItemProps,
  NotificationListItemState,
  NotificationListItemImportance,
} from "../../types/notification";
import { ListItemWrappingType } from "../../types/list";
import { ButtonRef } from "../../types/button";
import { DeclineIcon } from "../../icons/Decline";
import { OverflowIcon } from "../../icons/Overflow";
import { Loader2 } from "lucide-react";

// ============================================================================
// VARIANTS
// ============================================================================

const titleVariants = cva("text-[13px] leading-4", {
  variants: {
    read: {
      true: "font-normal",
      false: "font-bold",
    },
    wrapping: {
      [ListItemWrappingType.None]: "line-clamp-2",
      [ListItemWrappingType.Normal]: "break-words",
    },
  },
  defaultVariants: {
    read: false,
    wrapping: ListItemWrappingType.None,
  },
});

const stateIconVariants = cva("h-4 w-4 shrink-0", {
  variants: {
    state: {
      [NotificationListItemState.None]: "hidden",
      [NotificationListItemState.Positive]: "text-sapphire-positive",
      [NotificationListItemState.Critical]: "text-sapphire-warning",
      [NotificationListItemState.Negative]: "text-sapphire-negative",
      [NotificationListItemState.Information]: "text-sapphire-info",
    },
  },
  defaultVariants: {
    state: NotificationListItemState.None,
  },
});

// ============================================================================
// HELPERS
// ============================================================================

function getStateText(state: NotificationListItemState | `${NotificationListItemState}`): string {
  const normalized = state as NotificationListItemState;
  switch (normalized) {
    case NotificationListItemState.Positive:
      return "Positive";
    case NotificationListItemState.Critical:
      return "Critical";
    case NotificationListItemState.Negative:
      return "Negative";
    case NotificationListItemState.Information:
      return "Information";
    default:
      return "";
  }
}

function StateIcon({ state }: { state: NotificationListItemState | `${NotificationListItemState}` }) {
  const normalized = state as NotificationListItemState;
  const baseClassName = stateIconVariants({ state: normalized });

  switch (normalized) {
    case NotificationListItemState.Positive:
      return (
        <svg className={baseClassName} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="8" cy="8" r="8" fill="currentColor" />
          <path d="M11.3333 5.5L6.75 10.0833L4.66667 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case NotificationListItemState.Critical:
      return (
        <svg className={baseClassName} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6.86078 2.75995L1.21078 12.2499C1.09697 12.4547 1.03736 12.6863 1.03772 12.9218C1.03809 13.1574 1.09843 13.3888 1.21288 13.5933C1.32733 13.7977 1.49214 13.9681 1.69198 14.0881C1.89182 14.2081 2.11982 14.2736 2.35245 14.2783H13.6524C13.8851 14.2736 14.1131 14.2081 14.3129 14.0881C14.5128 13.9681 14.6776 13.7977 14.792 13.5933C14.9065 13.3888 14.9668 13.1574 14.9672 12.9218C14.9675 12.6863 14.9079 12.4547 14.7941 12.2499L9.14412 2.75995C9.02679 2.56103 8.86051 2.39698 8.66099 2.28264C8.46148 2.1683 8.23542 2.10767 8.00495 2.10767C7.77448 2.10767 7.54842 2.1683 7.34891 2.28264C7.14939 2.39698 6.98311 2.56103 6.86578 2.75995H6.86078Z" fill="currentColor" />
          <path d="M8 6V9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="8" cy="11.5" r="0.75" fill="white" />
        </svg>
      );
    case NotificationListItemState.Negative:
      return (
        <svg className={baseClassName} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="8" cy="8" r="8" fill="currentColor" />
          <path d="M10 6L6 10M6 6L10 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case NotificationListItemState.Information:
      return (
        <svg className={baseClassName} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="8" cy="8" r="8" fill="currentColor" />
          <path d="M8 11V8M8 5H8.00667" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
}

function ImportanceBadge({
  importance,
}: {
  importance: NotificationListItemImportance | `${NotificationListItemImportance}`;
}) {
  if (String(importance) !== "Important") return null;

  return (
    <Tag design={TagDesign.Negative}>
      Important
    </Tag>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function NotificationListItem(props: NotificationListItemProps) {
  const { t } = useTranslation("fx");
  const {
    // Content
    titleText,
    children,
    avatar,
    menu,
    footnotes,

    // Visual
    wrappingType = ListItemWrappingType.None,
    state = NotificationListItemState.None,
    importance = NotificationListItemImportance.Standard,
    read = false,

    // Behavior
    showClose = false,
    loading = false,
    loadingDelay = 1000,

    // Events
    onClose,
    onClick,

    // Standard
    className,
    style,
    id,
    "data-testid": dataTestId,
    ref,
  } = props;

  const baseItemRef = useRef<ListItemRef>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const menuBtnRef = useRef<ButtonRef>(null);

  const listContext = useOptionalNotificationListContext();

  // Determine item ID for ARIA labeling
  const itemId = id || baseItemRef.current?.nativeElement?.id;

  // Build aria-labelledby composite label
  const ariaLabelledBy = React.useMemo(() => {
    if (!itemId) return undefined;

    const ids: string[] = [];

    // Importance (if present)
    if (String(importance) === "Important") {
      ids.push(`${itemId}-importance`);
    }

    // State (if present)
    if (String(state) !== "None") {
      ids.push(`${itemId}-state`);
    }

    // Title (always present)
    ids.push(`${itemId}-title`);

    // Read status (always present)
    ids.push(`${itemId}-read-status`);

    // Description (if present)
    if (React.Children.count(children) > 0) {
      ids.push(`${itemId}-description`);
    }

    // Footnotes (if present)
    if (footnotes && footnotes.length > 0) {
      ids.push(`${itemId}-footnotes`);
    }

    return ids.join(" ");
  }, [itemId, importance, state, children, footnotes]);

  // Loading delay
  const [showLoading, setShowLoading] = useState(false);
  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => setShowLoading(true), loadingDelay);
      return () => clearTimeout(timer);
    } else {
      setShowLoading(false);
    }
  }, [loading, loadingDelay]);

  // Show More/Less for description overflow
  const [expanded, setExpanded] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const hasOverflowRef = useRef(false);
  const expandedRef = useRef(false);

  useEffect(() => {
    expandedRef.current = expanded;
  }, [expanded]);

  useEffect(() => {
    const el = descriptionRef.current;
    if (!el || String(wrappingType) === "Normal") return;

    const observer = new ResizeObserver(() => {
      if (!expandedRef.current) {
        const isOverflowing = el.scrollHeight > el.clientHeight;
        hasOverflowRef.current = isOverflowing;
        setHasOverflow(isOverflowing);
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [wrappingType]);

  const toggleExpanded = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  // Menu state
  const [menuOpen, setMenuOpen] = useState(false);

  // Event handlers
  const handleClick = useCallback(
    (e: React.MouseEvent | React.KeyboardEvent) => {
      onClick?.(e);
      const el = baseItemRef.current?.nativeElement;
      if (el) {
        listContext?.onItemClick?.({ item: el, originalEvent: e });
      }
    },
    [listContext, onClick]
  );

  const handleClose = useCallback(
    () => {
      onClose?.();
      const el = baseItemRef.current?.nativeElement;
      if (el) {
        listContext?.onItemClose?.({ item: el });
      }
    },
    [onClose, listContext]
  );

  // Imperative handle
  useImperativeHandle(
    ref,
    () => ({
      focus: () => baseItemRef.current?.focus?.(),
      blur: () => baseItemRef.current?.blur?.(),
      isFocused: () => baseItemRef.current?.isFocused?.() ?? false,
      get nativeElement() {
        return baseItemRef.current?.nativeElement ?? null;
      },
    }),
    []
  );

  const normalizedState = state as NotificationListItemState;
  const normalizedWrapping = wrappingType as ListItemWrappingType;
  const hasDescription = React.Children.count(children) > 0;
  const hasFootnotes = footnotes && footnotes.length > 0;
  const showStateIcon = String(state) !== "None";

  return (
    <ListItemBase
      ref={baseItemRef}
      itemKey={id}
      type={ListItemType.Active}
      onClick={handleClick}
      accessibleNameRef={ariaLabelledBy}
      className={cn(
        "relative border border-border rounded",
        "transition-colors duration-150",
        "hover:bg-[var(--neutral-hover-background-2)]",
        "active:bg-[var(--neutral-pressed-background-2)]",
        "bg-[var(--canvas-primary)]",
        className
      )}
      style={style}
      data-testid={dataTestId}
      data-notification-item
    >
      {/* Loading overlay */}
      {showLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-20 rounded">
          <Loader2 className="h-5 w-5 animate-spin text-sapphire-brand-foreground" />
        </div>
      )}

      {/* Content wrapper */}
      <div
        className={cn(
          "flex gap-3 w-full min-w-0 p-4",
          showLoading && "opacity-60 pointer-events-none"
        )}
      >
        {/* Hidden screen reader text for importance */}
        {String(importance) === "Important" && itemId && (
          <span id={`${itemId}-importance`} className="sr-only">
            Important
          </span>
        )}

        {/* Hidden screen reader text for state */}
        {showStateIcon && itemId && (
          <span id={`${itemId}-state`} className="sr-only">
            {getStateText(state)}
          </span>
        )}

        {/* Hidden screen reader text for read status */}
        {itemId && (
          <span id={`${itemId}-read-status`} className="sr-only">
            {read ? t("NOTIFICATION_READ") : t("NOTIFICATION_UNREAD")}
          </span>
        )}

        {/* Avatar */}
        {avatar && <div className="shrink-0 [&_svg]:!h-[16px] [&_svg]:!w-[16px]">{avatar}</div>}

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Title row */}
          <div className="flex items-start gap-1 pr-16">
            {/* State icon + Title */}
            <div className="flex-1 min-w-0 flex items-start gap-1">
              {showStateIcon && <StateIcon state={normalizedState} />}
              <span
                id={itemId ? `${itemId}-title` : undefined}
                className={cn(
                  titleVariants({ read, wrapping: normalizedWrapping }),
                  "flex-1 min-w-0"
                )}
              >
                {titleText}
              </span>
            </div>

            {/* Action buttons - positioned absolutely */}
            <div className="absolute top-2 right-2 flex items-center gap-0.5 shrink-0">
              {/* Menu button */}
              {menu && (
                <span onClick={(e) => e.stopPropagation()}>
                  <Button
                    ref={menuBtnRef}
                    design={ButtonDesign.Tertiary}
                    size={ButtonSize.Medium}
                    icon={<OverflowIcon className="h-4 w-4" />}
                    onClick={(detail) => {
                      detail.originalEvent.stopPropagation();
                      setMenuOpen(!menuOpen);
                    }}
                    accessibleName={t("NOTIFICATION_MORE_ACTIONS")}
                    accessibilityAttributes={{ hasPopup: "menu" }}
                  />
                  {React.isValidElement(menu) &&
                    React.cloneElement(
                      menu as React.ReactElement<Record<string, unknown>>,
                      {
                        open: menuOpen,
                        opener: menuBtnRef.current?.nativeElement ?? null,
                        onClose: () => setMenuOpen(false),
                      }
                    )}
                </span>
              )}

              {/* Close button */}
              {showClose && (
                <Button
                  design={ButtonDesign.Tertiary}
                  size={ButtonSize.Medium}
                  icon={<DeclineIcon className="h-4 w-4" />}
                  onClick={(detail) => {
                    detail.originalEvent.stopPropagation();
                    handleClose();
                  }}
                  accessibleName={t("NOTIFICATION_CLOSE")}
                  data-testid={subTestId(dataTestId, "close")}
                />
              )}
            </div>
          </div>

          {/* Description */}
          {hasDescription && (
            <div className="mt-2">
              <div
                id={itemId ? `${itemId}-description` : undefined}
                ref={descriptionRef}
                className={cn(
                  "text-sm leading-normal text-[var(--text\/text-secondary,#353c4a)]",
                  String(wrappingType) !== "Normal" &&
                    !expanded &&
                    "line-clamp-2",
                  String(wrappingType) === "Normal" && "break-words"
                )}
              >
                {children}
              </div>
            </div>
          )}

          {/* Footnotes and More/Less */}
          {(hasFootnotes || hasOverflow || expanded) && (
            <div className="flex items-center gap-2 mt-2 text-sm text-[var(--text\/text-tertiary,#616d85)]">
              {/* Footnotes */}
              {hasFootnotes && (
                <>
                  {footnotes!.map((footnote, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && (
                        <span>•</span>
                      )}
                      <span
                        id={index === 0 && itemId ? `${itemId}-footnotes` : undefined}
                      >
                        {footnote}
                      </span>
                    </React.Fragment>
                  ))}
                </>
              )}

              {/* More/Less link */}
              {(hasOverflow || expanded) && (
                <Link
                  onClick={(detail) => {
                    detail.originalEvent.stopPropagation();
                    toggleExpanded();
                  }}
                >
                  {expanded ? t("NOTIFICATION_LESS") : t("NOTIFICATION_MORE")}
                </Link>
              )}
            </div>
          )}

          {/* Importance badge */}
          {String(importance) === "Important" && (
            <div className="mt-2">
              <ImportanceBadge importance={importance} />
            </div>
          )}
        </div>
      </div>
    </ListItemBase>
  );
}
