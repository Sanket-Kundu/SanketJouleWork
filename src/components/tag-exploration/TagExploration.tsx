import React, {
  useRef,
  useCallback,
  useImperativeHandle,
} from "react";
import { useTranslation } from "react-i18next";
import { cn, subTestId } from "../../lib/utils";
import {
  TagExplorationProps,
  TagExplorationDesign,
  TagExplorationSize,
  TagExplorationWrappingType,
  TagExplorationColorScheme,
} from "../../types/tag-exploration";
import { DeclineIcon } from "../../icons/Decline";
import { SysEnter2Icon } from "../../icons/SysEnter2";
import { ErrorIcon } from "../../icons/Error";
import { AlertIcon } from "../../icons/Alert";
import { InformationIcon } from "../../icons/Information";
import { SysHelp2Icon } from "../../icons/SysHelp2";

/**
 * Semantic design classes
 */
const semanticDesignClass: Record<string, string> = {
  [TagExplorationDesign.Neutral]: "bg-background text-sapphire-text-accent-2 border-sapphire-tag-border",
  [TagExplorationDesign.Information]: "bg-sapphire-info-bg text-sapphire-info border-transparent",
  [TagExplorationDesign.Positive]: "bg-sapphire-positive-bg text-sapphire-positive border-transparent",
  [TagExplorationDesign.Negative]: "bg-sapphire-negative-bg text-sapphire-negative border-transparent",
  [TagExplorationDesign.Critical]: "bg-sapphire-warning-bg text-sapphire-warning border-transparent",
};

/**
 * State icons per semantic design (auto icons when no custom icon provided)
 */
const stateIconMap: Record<string, React.FC<{ className?: string }>> = {
  [TagExplorationDesign.Positive]: SysEnter2Icon,
  [TagExplorationDesign.Negative]: ErrorIcon,
  [TagExplorationDesign.Critical]: AlertIcon,
  [TagExplorationDesign.Information]: InformationIcon,
  [TagExplorationDesign.Neutral]: SysHelp2Icon,
};

/**
 * Set1 (bold) color scheme classes — vivid bg + contrasting text
 */
const set1Classes: Record<string, string> = {
  [TagExplorationColorScheme.CS1]: "bg-purple-600 text-sapphire-neutral-foreground-white border-transparent",
  [TagExplorationColorScheme.CS2]: "bg-blue-600 text-sapphire-neutral-foreground-white border-transparent",
  [TagExplorationColorScheme.CS3]: "bg-neutral-600 text-sapphire-neutral-foreground-white border-transparent",
  [TagExplorationColorScheme.CS4]: "bg-purple-700 text-sapphire-neutral-foreground-white border-transparent",
  [TagExplorationColorScheme.CS5]: "bg-blue-700 text-sapphire-neutral-foreground-white border-transparent",
  [TagExplorationColorScheme.CS6]: "bg-neutral-700 text-sapphire-neutral-foreground-white border-transparent",
  [TagExplorationColorScheme.CS7]: "bg-purple-800 text-sapphire-neutral-foreground-white border-transparent",
  [TagExplorationColorScheme.CS8]: "bg-blue-800 text-sapphire-neutral-foreground-white border-transparent",
  [TagExplorationColorScheme.CS9]: "bg-neutral-800 text-sapphire-neutral-foreground-white border-transparent",
  [TagExplorationColorScheme.CS10]: "bg-purple-500 text-sapphire-neutral-foreground-white border-transparent",
};

/**
 * Set2 (tinted) color scheme classes — light bg + colored text
 */
const set2Classes: Record<string, string> = {
  [TagExplorationColorScheme.CS1]: "bg-purple-100 text-purple-700 border-transparent",
  [TagExplorationColorScheme.CS2]: "bg-blue-100 text-blue-700 border-transparent",
  [TagExplorationColorScheme.CS3]: "bg-neutral-100 text-neutral-700 border-transparent",
  [TagExplorationColorScheme.CS4]: "bg-purple-200 text-purple-800 border-transparent",
  [TagExplorationColorScheme.CS5]: "bg-blue-200 text-blue-800 border-transparent",
  [TagExplorationColorScheme.CS6]: "bg-neutral-200 text-neutral-800 border-transparent",
  [TagExplorationColorScheme.CS7]: "bg-purple-50 text-purple-600 border-transparent",
  [TagExplorationColorScheme.CS8]: "bg-blue-50 text-blue-600 border-transparent",
  [TagExplorationColorScheme.CS9]: "bg-neutral-50 text-neutral-600 border-transparent",
  [TagExplorationColorScheme.CS10]: "bg-purple-100 text-purple-600 border-transparent",
};

/**
 * Get design classes for a tag
 */
function getDesignClasses(design: TagExplorationDesign, colorScheme: string, accent: boolean): string {
  if (design === TagExplorationDesign.Set1) {
    return set1Classes[colorScheme] ?? set1Classes[TagExplorationColorScheme.CS1];
  }
  if (design === TagExplorationDesign.Set2) {
    return set2Classes[colorScheme] ?? set2Classes[TagExplorationColorScheme.CS1];
  }
  if (design === TagExplorationDesign.Neutral && accent) {
    return "bg-sapphire-tag-accent-bg text-sapphire-text-accent-2 border-sapphire-tag-accent-bg";
  }
  return semanticDesignClass[design] ?? semanticDesignClass[TagExplorationDesign.Neutral];
}

/**
 * Tag component
 *
 * A categorization label with optional close/remove functionality.
 * Supports semantic designs, color schemes, interactive mode, and a close button.
 *
 * @example
 * ```tsx
 * // Basic tag
 * <Tag design="Information">Draft</Tag>
 *
 * // With close button
 * <Tag design="Positive" onClose={(e) => handleRemove(e)}>Approved</Tag>
 *
 * // Interactive tag
 * <Tag interactive onClick={(e) => handleClick(e)}>Clickable</Tag>
 *
 * // Color scheme
 * <Tag design="Set2" colorScheme="1">Category</Tag>
 * ```
 */
export function TagExploration({
  design = TagExplorationDesign.Neutral,
  size = TagExplorationSize.S,
  colorScheme = TagExplorationColorScheme.CS1,
  children,
  icon,
  interactive = false,
  readOnly = false,
  accent = false,
  wrappingType = TagExplorationWrappingType.None,
  hideStateIcon = false,
  onClose,
  onClick,
  accessibleName,
  accessibleNameRef,
  className,
  style,
  id,
  "data-testid": dataTestId,
  ref,
}: TagExplorationProps) {
    const { t } = useTranslation("fx");
    const tagRef = useRef<HTMLSpanElement>(null);
    const d = design as TagExplorationDesign;
    const s = size as TagExplorationSize;
    const cs = colorScheme as string;

    useImperativeHandle(
      ref,
      () => ({
        focus() {
          tagRef.current?.focus();
        },
        blur() {
          tagRef.current?.blur();
        },
        isFocused() {
          return document.activeElement === tagRef.current;
        },
        get nativeElement() {
          return tagRef.current;
        },
      }),
      [tagRef]
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

    const handleCloseClick = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        onClose?.({ originalEvent: e, isKeyboard: false });
      },
      [onClose]
    );

    const handleCloseKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLButtonElement>) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();
          onClose?.({ originalEvent: e, isKeyboard: true });
        }
      },
      [onClose]
    );

    // Determine icon to display
    const isSemanticDesign = d !== TagExplorationDesign.Set1 && d !== TagExplorationDesign.Set2;
    let displayIcon: React.ReactNode = null;
    if (icon) {
      displayIcon = icon;
    } else if (isSemanticDesign && !hideStateIcon) {
      const StateIcon = stateIconMap[d];
      if (StateIcon) {
        const iconSizeClass = s === TagExplorationSize.L ? "h-4 w-4" : "h-3 w-3";
        displayIcon = <StateIcon className={iconSizeClass} />;
      }
    }

    // Size classes
    const sizeClass =
      s === TagExplorationSize.L
        ? "text-sm px-[9px] py-0.5 rounded-full gap-1"
        : "text-xs px-2 py-1 rounded-full gap-1";

    const closeBtnSizeClass = s === TagExplorationSize.L ? "h-4 w-4" : "h-3 w-3";

    // Wrapping
    const wrappingClasses =
      wrappingType === TagExplorationWrappingType.None
        ? "max-w-full"
        : "";

    const textWrappingClasses =
      wrappingType === TagExplorationWrappingType.None
        ? "overflow-hidden text-ellipsis whitespace-nowrap"
        : "whitespace-normal break-words";

    // Interactive — focus padding compensates for border going 1px → 2px (size-aware)
    const focusPaddingClass = s === TagExplorationSize.L
      ? "focus-visible:px-[8px] focus-visible:py-px"   // 9px-1=8px, 2px-1=1px
      : "focus-visible:px-[7px] focus-visible:py-[3px]"; // 8px-1=7px, 4px-1=3px

    const interactiveClasses = interactive && !readOnly
      ? [
          "cursor-pointer",
          "hover:bg-sapphire-tag-hover-bg hover:border-transparent",
          "active:bg-sapphire-tag-active-bg active:border-transparent active:rounded-[20px]",
          `focus-visible:outline-none focus-visible:bg-sapphire-tag-hover-bg focus-visible:border-2 focus-visible:border-sapphire-tag-focus-border ${focusPaddingClass}`,
        ].join(" ")
      : "";

    return (
      <span
        ref={tagRef}
        id={id}
        role={interactive && !readOnly ? "button" : undefined}
        tabIndex={interactive && !readOnly ? 0 : undefined}
        aria-label={accessibleName}
        aria-labelledby={accessibleNameRef}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={cn(
          "inline-flex items-center border transition-colors font-normal leading-5 tracking-[0.25px]",
          sizeClass,
          getDesignClasses(d, cs, accent),
          wrappingClasses,
          interactiveClasses,
          readOnly && "opacity-40 pointer-events-none",
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
          <span data-part="text" className={textWrappingClasses}>
            {children}
          </span>
        )}
        {onClose && !readOnly && (
          <button
            type="button"
            onClick={handleCloseClick}
            onKeyDown={handleCloseKeyDown}
            aria-label={t("TAG_REMOVE")}
            data-part="close"
            data-testid={subTestId(dataTestId, "close")}
            className={cn(
              "flex-shrink-0 inline-flex items-center justify-center rounded-full",
              "hover:opacity-70 focus:outline-none focus:ring-1 focus:ring-ring",
              "cursor-pointer"
            )}
            tabIndex={0}
          >
            <DeclineIcon className={closeBtnSizeClass} />
          </button>
        )}
      </span>
    );
}
