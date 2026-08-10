import React, {
  useRef,
  useCallback,
  useImperativeHandle,
  useId,
} from "react";
import { cn } from "../../lib/utils";
import {
  BadgeProps,
  BadgeVariant,
  BadgeDesign,
  BadgeSize,
  BadgeWrappingType,
} from "../../types/badge";

/**
 * Dot color classes per design (used for Minimal & Outline variants)
 */
const dotColorClass: Record<string, string> = {
  [BadgeDesign.Neutral]: "bg-sapphire-border-active",
  [BadgeDesign.Information]: "bg-sapphire-info",
  [BadgeDesign.Positive]: "bg-sapphire-positive",
  [BadgeDesign.Negative]: "bg-sapphire-negative",
  [BadgeDesign.Critical]: "bg-sapphire-warning",
};

/**
 * Border color classes per design (used for Outline variant)
 */
const outlineBorderClass: Record<string, string> = {
  [BadgeDesign.Neutral]: "border-sapphire-border-active",
  [BadgeDesign.Information]: "border-sapphire-info",
  [BadgeDesign.Positive]: "border-sapphire-positive",
  [BadgeDesign.Negative]: "border-sapphire-negative",
  [BadgeDesign.Critical]: "border-sapphire-warning",
};

/**
 * Filled variant: colored bg + colored text, no border
 */
const filledDesignClass: Record<string, string> = {
  [BadgeDesign.Neutral]: "bg-muted text-foreground",
  [BadgeDesign.Information]: "bg-sapphire-info-bg text-sapphire-info",
  [BadgeDesign.Positive]: "bg-sapphire-positive-bg text-sapphire-positive",
  [BadgeDesign.Negative]: "bg-sapphire-negative-bg text-sapphire-negative",
  [BadgeDesign.Critical]: "bg-sapphire-warning-bg text-sapphire-warning",
};

/**
 * Tinted variant: colored bg + colored border + colored text
 */
const tintedDesignClass: Record<string, string> = {
  [BadgeDesign.Neutral]: "bg-muted text-foreground border-sapphire-border-active",
  [BadgeDesign.Information]: "bg-sapphire-info-bg text-sapphire-info border-sapphire-info",
  [BadgeDesign.Positive]: "bg-sapphire-positive-bg text-sapphire-positive border-sapphire-positive",
  [BadgeDesign.Negative]: "bg-sapphire-negative-bg text-sapphire-negative border-sapphire-negative",
  [BadgeDesign.Critical]: "bg-sapphire-warning-bg text-sapphire-warning border-sapphire-warning",
};

/**
 * Size classes per variant
 */
const sizeClasses = {
  [BadgeVariant.Filled]: {
    [BadgeSize.S]: "text-sm px-2 py-1 gap-1.5",
    [BadgeSize.L]: "text-sm px-2 py-1 gap-1.5",
  },
  [BadgeVariant.Minimal]: {
    [BadgeSize.S]: "text-xs leading-[18px] px-2 py-[3px] gap-1.5",
    [BadgeSize.L]: "text-base leading-[18px] px-3 py-[3px] gap-2",
  },
  [BadgeVariant.Outline]: {
    [BadgeSize.S]: "text-xs leading-[18px] px-2 py-[3px] gap-1.5",
    [BadgeSize.L]: "text-base leading-[18px] px-3 py-[3px] gap-2",
  },
  [BadgeVariant.Tinted]: {
    [BadgeSize.S]: "text-xs leading-[18px] px-2 py-[3px] gap-1.5",
    [BadgeSize.L]: "text-base leading-[18px] px-3 py-[3px] gap-2",
  },
};

/**
 * Get the colored dot element for Minimal/Outline variants
 */
function getDotIcon(design: BadgeDesign | `${BadgeDesign}`, size: BadgeSize | `${BadgeSize}`) {
  const dotSize = size === BadgeSize.L ? "w-2.5 h-2.5" : "w-2 h-2";
  return (
    <span
      className={cn("rounded-full flex-shrink-0 inline-block", dotSize, dotColorClass[design as BadgeDesign])}
      aria-hidden="true"
    />
  );
}

/**
 * Badge component
 *
 * A small label for categorization and status indication.
 * Supports three visual variants matching the Figma Sapphire design system:
 *
 * - **Filled**: Colored background with bold colored text (Status tag)
 * - **Minimal**: Gray border with colored dot and neutral text (Status-Minimal)
 * - **Outline**: Colored border with colored dot and neutral text
 *
 * @example
 * ```tsx
 * // Filled status tag (default)
 * <Badge design="Positive">Approved</Badge>
 *
 * // Minimal with dot
 * <Badge variant="Minimal" design="Positive">Approved</Badge>
 *
 * // Outline with colored border
 * <Badge variant="Outline" design="Negative">Rejected</Badge>
 *
 * // Large minimal
 * <Badge variant="Minimal" design="Information" size="L">In Review</Badge>
 * ```
 */
export function Badge({
  variant = BadgeVariant.Filled,
  design = BadgeDesign.Neutral,
  size = BadgeSize.S,
  interactive = false,
  wrappingType = BadgeWrappingType.Normal,
  hideStateIcon = false,
  showBorder = true,
  icon,
  children,
  accessibleName,
  accessibleNameRef,
  accessibleDescription,
  accessibleDescriptionRef,
  onClick,
  className,
  style,
  id,
  "data-testid": dataTestId,
  ref,
}: BadgeProps) {
    const badgeRef = useRef<HTMLSpanElement>(null);
    const generatedId = useId();
    const v = variant as BadgeVariant;
    const d = design as BadgeDesign;
    const s = size as BadgeSize;

    const descriptionId = `${id ?? generatedId}-desc`;
    const ariaDescribedBy =
      [accessibleDescriptionRef, accessibleDescription ? descriptionId : null]
        .filter(Boolean)
        .join(" ") || undefined;

    useImperativeHandle(
      ref,
      () => ({
        focus() {
          badgeRef.current?.focus();
        },
        blur() {
          badgeRef.current?.blur();
        },
        isFocused() {
          return document.activeElement === badgeRef.current;
        },
        get nativeElement() {
          return badgeRef.current;
        },
      }),
      []
    );

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLSpanElement>) => {
        if (!interactive) return;
        onClick?.({ originalEvent: e, isKeyboard: false });
      },
      [interactive, onClick]
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLSpanElement>) => {
        if (!interactive) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.({ originalEvent: e, isKeyboard: true });
        }
      },
      [interactive, onClick]
    );

    // Determine icon to display
    let displayIcon: React.ReactNode = null;
    if (icon) {
      // Custom icon always wins
      displayIcon = icon;
    } else if (!hideStateIcon && (v === BadgeVariant.Minimal || v === BadgeVariant.Outline || v === BadgeVariant.Tinted)) {
      // Dot icon for Minimal/Outline
      displayIcon = getDotIcon(d, s);
    }
    // Filled: no default icon

    // Build class list
    const variantClasses = (() => {
      switch (v) {
        case BadgeVariant.Filled:
          return cn("font-semibold", filledDesignClass[d]);
        case BadgeVariant.Minimal:
          return cn("font-normal text-sapphire-text-secondary border border-sapphire-border-primary");
        case BadgeVariant.Outline:
          return cn("font-normal text-sapphire-text-secondary border", outlineBorderClass[d]);
        case BadgeVariant.Tinted:
          // showBorder=false: keep the tinted bg+text tokens (same values as filledDesignClass),
          // but omit the border — intentionally reuses filledDesignClass since it shares
          // the same bg/text tokens as the borderless tinted state.
          return showBorder
            ? cn("font-normal border", tintedDesignClass[d])
            : cn("font-normal", filledDesignClass[d]);
        default:
          return filledDesignClass[d];
      }
    })();

    const wrappingClasses =
      wrappingType === BadgeWrappingType.None
        ? "whitespace-nowrap overflow-hidden text-ellipsis max-w-full"
        : "whitespace-normal break-words";

    const interactiveClasses = interactive
      ? "cursor-pointer hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
      : "";

    return (
      <span
        ref={badgeRef}
        id={id}
        role={interactive ? "button" : undefined}
        tabIndex={interactive ? 0 : undefined}
        aria-label={accessibleName}
        aria-labelledby={accessibleNameRef}
        aria-describedby={ariaDescribedBy}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={cn(
          "inline-flex items-center rounded transition-colors",
          variantClasses,
          sizeClasses[v]?.[s] ?? sizeClasses[BadgeVariant.Filled][BadgeSize.S],
          wrappingClasses,
          interactiveClasses,
          className
        )}
        style={style}
        data-testid={dataTestId}
        data-part="root"
      >
        {displayIcon && (
          <span className="flex-shrink-0" data-part="icon">
            {displayIcon}
          </span>
        )}
        {children && (
          <span data-part="text">
            {children}
          </span>
        )}
        {accessibleDescription && (
          <span id={descriptionId} className="sr-only">
            {accessibleDescription}
          </span>
        )}
      </span>
    );
}
