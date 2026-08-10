import * as React from "react";
import { useTranslation } from "react-i18next";
import { cn, cva } from "../../lib/utils";
import { Button } from "../button/Button";
import { OverflowIcon } from "../../icons/Overflow";
import { ButtonDesign, ButtonClickEventDetail } from "../../types/button";
import {
  ListItemProps,
  ListItemType,
  ListItemHighlight,
  ListItemValueState,
  ListItemWrappingType,
} from "../../types/list";
import { ListItemBase } from "./ListItemBase";

// Navigation right arrow icon (16×16, Figma spec)
function NavArrowIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M5.20493 3.23532C5.48927 2.93424 5.96333 2.92076 6.2645 3.20504L10.7645 7.45211C10.9144 7.59365 10.9997 7.79085 10.9998 7.99704C10.9999 8.20338 10.9145 8.40121 10.7645 8.54293L6.2645 12.7949C5.96343 13.0792 5.48937 13.0656 5.20493 12.7646C4.92058 12.4635 4.93419 11.9895 5.2352 11.705L9.15707 7.99704L5.2352 4.29489C4.93413 4.01054 4.92064 3.53648 5.20493 3.23532Z" fill="currentColor"/>
    </svg>
  );
}

// ============================================================================
// VARIANTS
// ============================================================================

const highlightBarVariants = cva(
  "absolute left-0 top-0 bottom-0 w-[3px]",
  {
    variants: {
      highlight: {
        [ListItemHighlight.None]: "bg-transparent",
        [ListItemHighlight.Positive]: "bg-sapphire-positive",
        [ListItemHighlight.Critical]: "bg-sapphire-warning",
        [ListItemHighlight.Information]: "bg-sapphire-info",
        [ListItemHighlight.Negative]: "bg-sapphire-negative",
      },
    },
    defaultVariants: {
      highlight: ListItemHighlight.None,
    },
  }
);

const additionalTextVariants = cva(
  "text-xs shrink-0",
  {
    variants: {
      state: {
        [ListItemValueState.None]: "text-sapphire-text-tertiary",
        [ListItemValueState.Positive]: "text-sapphire-positive",
        [ListItemValueState.Critical]: "text-sapphire-warning",
        [ListItemValueState.Information]: "text-sapphire-info",
        [ListItemValueState.Negative]: "text-sapphire-negative",
      },
    },
    defaultVariants: {
      state: ListItemValueState.None,
    },
  }
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Standard list item with predefined content structure (icon, text, description, etc.)
 * This is a wrapper around ListItemBase that provides structured content layout.
 */
export function ListItem(props: ListItemProps) {
    const { t } = useTranslation("fx");
    const {
      ref,
      // Content
      text,
      description,
      icon,
      iconEnd = false,
      additionalText,
      additionalTextState = ListItemValueState.None,
      image,
      action,
      children,

      // Behavior
      type = ListItemType.Active,
      highlight = ListItemHighlight.None,
      navigated = false,
      wrappingType = ListItemWrappingType.None,
      tooltip,

      // Events
      onDetailClick,
      onDelete: _onDelete,

      // Custom elements
      deleteButton,

      // Rest passed to ListItemBase
      ...baseProps
    } = props;

    // Determine if text should wrap
    const shouldWrap = String(wrappingType) === "Normal";

    // Content rendering
    const displayIcon = icon && !iconEnd;
    const displayIconEnd = icon && iconEnd;

    // Handle detail button click
    const handleDetailButtonClick = React.useCallback((detail: ButtonClickEventDetail) => {
      onDetailClick?.(detail.originalEvent);
    }, [onDetailClick]);

    const showNavArrow = String(type) === "Navigation" || navigated;

    return (
      <ListItemBase
        ref={ref}
        type={type}
        deleteButton={deleteButton}
        {...baseProps}
      >
        {({ isSelected }) => (
          <>
            {/* Highlight bar */}
            {String(highlight) !== "None" && (
              <span className={highlightBarVariants({ highlight: highlight as ListItemHighlight })} />
            )}

            {/* Row layout: px-4 py-2, gap-2 between icon↔content */}
            <span className="flex-1 flex items-center px-4 py-2 gap-2 min-w-0">
              {/* Optional: Image/Avatar */}
              {image && (
                <span className="shrink-0 size-8 max-w-8 max-h-8 overflow-hidden flex items-center justify-center">
                  {image}
                </span>
              )}
              {displayIcon && (
                <span className={cn("shrink-0", isSelected ? "text-sapphire-text-accent" : "text-sapphire-text-tertiary")}>
                  {icon}
                </span>
              )}

              {/* Title / Subtitle */}
              <span className="flex-1 flex flex-col justify-center min-w-0 min-h-9">
                <span
                  className={cn(
                    "text-sm leading-5 font-semibold",
                    isSelected ? "text-sapphire-text-accent" : "text-sapphire-text-primary",
                    !shouldWrap && "truncate",
                    shouldWrap && "break-words"
                  )}
                  title={tooltip}
                >
                  {children || text}
                </span>
                {description && (
                  <span
                    className={cn(
                      "text-xs leading-4 text-sapphire-text-tertiary",
                      !shouldWrap && "truncate",
                      shouldWrap && "break-words"
                    )}
                  >
                    {description}
                  </span>
                )}
              </span>

              {/* Additional text */}
              {additionalText && (
                <span className={cn(
                  additionalTextVariants({ state: additionalTextState as ListItemValueState }),
                  "shrink-0"
                )}>
                  {additionalText}
                </span>
              )}

              {/* Icon (end) */}
              {displayIconEnd && (
                <span className="shrink-0 text-sapphire-text-tertiary">
                  {icon}
                </span>
              )}

              {/* Detail button */}
              {String(type) === "Detail" && (
                <span className="shrink-0">
                  <Button
                    design={ButtonDesign.Tertiary}
                    iconOnly
                    icon={<OverflowIcon className="h-4 w-4" />}
                    onClick={handleDetailButtonClick}
                    accessibleName={t("LIST_SHOW_DETAILS")}
                    tooltip={t("LIST_DETAILS")}
                  />
                </span>
              )}

              {/* Optional action + navigation arrow area (gap-[0.5rem] between them) */}
              {(action || showNavArrow) && (
                <span className="shrink-0 flex items-center gap-[0.5rem]">
                  {action && (
                    <span
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                    >
                      {action}
                    </span>
                  )}
                  {showNavArrow && (
                    <NavArrowIcon className="text-sapphire-text-tertiary" />
                  )}
                </span>
              )}
            </span>
          </>
        )}
      </ListItemBase>
    );
  }

ListItem.displayName = "ListItem";
