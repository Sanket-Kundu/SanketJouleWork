import * as React from "react";
import {
  useRef,
  useState,
  useCallback,
  useEffect,
  useImperativeHandle,
  useId,
} from "react";
import { useOptionalNotificationListContext } from "./NotificationList";
import { Button } from "../button/Button";
import { ButtonDesign } from "../../types/button";
import {
  NotificationListGroupItemProps,
} from "../../types/notification";
import { ListGrowingMode } from "../../types/list";
import { SlimArrowDownIcon } from "../../icons/SlimArrowDown";
import { SlimArrowRightIcon } from "../../icons/SlimArrowRight";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * NotificationListGroupItem - Group container for notification items
 *
 * Matches UI5 Web Components structure:
 * <li> (group root)
 *   <div> (content wrapper)
 *     <div role="button"> (collapsible header)
 *     <div> (list container)
 *       <ul> (nested list)
 *         <li>Child items</li>
 *       </ul>
 *     </div>
 *   </div>
 * </li>
 */
export function NotificationListGroupItem(props: NotificationListGroupItemProps) {
  const {
    // Content
    titleText,
    children,

    // Behavior
    collapsed: controlledCollapsed,
    defaultCollapsed = false,
    growing = ListGrowingMode.None,
    loading = false,
    loadingDelay = 1000,

    // Events
    onToggle,
    onLoadMore,

    // Standard
    className,
    style,
    accessibleName,
    "data-testid": dataTestId,
    ref,
  } = props;

  const groupRef = useRef<HTMLLIElement>(null);
  const listContext = useOptionalNotificationListContext();
  const contentId = useId();

  // Collapse state management
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
  const isControlled = controlledCollapsed !== undefined;
  const isCollapsed = isControlled ? controlledCollapsed : internalCollapsed;

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

  // Toggle handler
  const handleToggle = useCallback(() => {
    const newCollapsed = !isCollapsed;
    if (!isControlled) {
      setInternalCollapsed(newCollapsed);
    }
    onToggle?.(newCollapsed);
    listContext?.onItemToggle?.({
      item: groupRef.current!,
      collapsed: newCollapsed,
    });
  }, [isCollapsed, isControlled, onToggle, listContext]);

  // Keyboard handler for header button
  const handleHeaderKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Determine if we should handle this key
    const shouldToggle =
      e.key === "Enter" ||
      e.key === " " ||
      (e.key === "+" && isCollapsed) ||
      (e.key === "-" && !isCollapsed) ||
      (e.key === "ArrowRight" && isCollapsed) ||
      (e.key === "ArrowLeft" && !isCollapsed);

    if (!shouldToggle) return;

    e.preventDefault();

    // Stop propagation for arrow keys to prevent navigation
    if (e.key === "ArrowRight" || e.key === "ArrowLeft" || e.key === "+" || e.key === "-") {
      e.stopPropagation();
    }

    handleToggle();
  }, [handleToggle, isCollapsed]);

  // Imperative handle
  useImperativeHandle(
    ref,
    () => ({
      focus: () => groupRef.current?.focus(),
      blur: () => groupRef.current?.blur(),
      isFocused: () => document.activeElement === groupRef.current,
      toggle: handleToggle,
      get nativeElement() {
        return groupRef.current;
      },
    }),
    [handleToggle]
  );

  return (
    <li
      ref={groupRef}
      role="listitem"
      aria-level={1}
      aria-labelledby={accessibleName ? undefined : `${contentId}-title`}
      aria-label={accessibleName || undefined}
      data-notification-item
      data-notification-group
      className={cn(
        "mb-2",
        className
      )}
      style={style}
      data-testid={dataTestId}
    >
      {/* Content wrapper */}
      <div className="w-full">
        {/* Collapsible header */}
        <div
          role="button"
          aria-expanded={!isCollapsed}
          aria-controls={!isCollapsed ? contentId : undefined}
          aria-label={accessibleName || titleText}
          tabIndex={0}
          onClick={handleToggle}
          onKeyDown={handleHeaderKeyDown}
          className={cn(
            "flex items-center gap-1 w-full pl-1 pr-2 py-1 cursor-pointer rounded",
            "hover:bg-sapphire-canvas-tertiary focus:outline-none transition-colors",
            "focus:shadow-[inset_0_0_0_2px_var(--border-focus)]"
          )}
        >
          {/* Collapse indicator */}
          <span className="shrink-0 h-8 w-8 flex items-center justify-center text-sapphire-text-primary">
            {isCollapsed ? (
              <SlimArrowRightIcon className="h-4 w-4" />
            ) : (
              <SlimArrowDownIcon className="h-4 w-4" />
            )}
          </span>

          {/* Title */}
          <span
            id={`${contentId}-title`}
            className={cn(
              "flex-1 text-base leading-[22px] truncate font-semibold text-[var(--text\/text-primary,#0b0c0f)]"
            )}
          >
            {titleText}
          </span>
        </div>

        {/* Items list container */}
        {!isCollapsed && (
          <div className="relative">
            {/* Loading overlay */}
            {showLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-20">
                <Loader2 className="h-5 w-5 animate-spin text-sapphire-brand-foreground" />
              </div>
            )}

            {/* Nested list for child items */}
            <ul
              id={contentId}
              className={cn(
                "m-0 p-0 list-none flex flex-col gap-2",
                showLoading && "opacity-60 pointer-events-none"
              )}
            >
              {children}
            </ul>

            {/* Growing button */}
            {String(growing) === ListGrowingMode.Button && (
              <div className="flex items-center justify-center py-2 border-t border-border">
                <Button
                  design={ButtonDesign.Tertiary}
                  onClick={(detail) => {
                    detail.originalEvent.stopPropagation();
                    onLoadMore?.();
                  }}
                  disabled={showLoading}
                  className="w-full mx-4"
                  data-growing-button="true"
                >
                  {showLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  More
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </li>
  );
}
