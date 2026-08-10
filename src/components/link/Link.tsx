import React, {
  useRef,
  useCallback,
  useImperativeHandle,
  useMemo,
} from "react";
import { cn, cva } from "../../lib/utils";
import { useTranslation } from "react-i18next";
import {
  LinkProps,
  LinkDesign,
  LinkInteractiveAreaSize,
  LinkWrappingType,
  LinkAccessibleRole,
} from "../../types/link";

const SAFE_PROTOCOLS = ['http:', 'https:', 'mailto:', 'tel:'];
const isSafeUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url, window.location.href);
    return SAFE_PROTOCOLS.includes(parsed.protocol);
  } catch {
    return false;
  }
};

/**
 * Compute the rel attribute. If an explicit rel is provided, use it.
 * Otherwise, auto-add "noreferrer noopener" for cross-origin _blank links.
 */
const computeRel = (href?: string, target?: string, rel?: string): string | undefined => {
  if (rel) return rel;
  if (target === "_blank" && href) {
    try {
      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) {
        return "noreferrer noopener";
      }
    } catch { /* invalid URL, skip */ }
  }
  return undefined;
};

/**
 * Link design and size variants using CVA — Figma Sapphire spec
 */
const linkVariants = cva(
  [
    // Layout
    "inline-flex items-center gap-0.5",
    // Typography — Figma: '72' Regular, 14px, line-height 20px
    "text-sm leading-5 font-normal cursor-pointer",
    // Transition
    "transition-colors",
    // Focus box: constant padding + transparent border to prevent layout shift.
    // Figma focus spec: border-focus, rounded 4px, px-4px py-2px.
    // Negative margins compensate for the padding+border so the link
    // sits flush in normal state.
    "px-1 py-0.5 -mx-1.5 -my-1",
    "border-2 border-transparent rounded-[4px]",
    "focus-visible:outline-none focus-visible:border-sapphire-border-focus",
  ],
  {
    variants: {
      design: {
        [LinkDesign.Default]: [
          "text-sapphire-text-accent",
          "no-underline",
          "hover:text-sapphire-brand-hover-background",
          "active:text-sapphire-brand-pressed-foreground",
        ],
        [LinkDesign.Subtle]: [
          "text-secondary-foreground",
          "no-underline",
          "hover:text-sapphire-brand-hover-background",
          "active:text-sapphire-brand-pressed-foreground",
        ],
        [LinkDesign.Emphasized]: [
          "text-sapphire-text-accent font-semibold",
          "no-underline",
          "hover:text-sapphire-brand-hover-background",
          "active:text-sapphire-brand-pressed-foreground",
        ],
      },
      interactiveAreaSize: {
        [LinkInteractiveAreaSize.Normal]: "",
        [LinkInteractiveAreaSize.Large]: "leading-6",
      },
      wrappingType: {
        [LinkWrappingType.None]: "whitespace-nowrap max-w-full",
        [LinkWrappingType.Normal]: "whitespace-normal break-words",
      },
    },
    defaultVariants: {
      design: LinkDesign.Default,
      interactiveAreaSize: LinkInteractiveAreaSize.Normal,
      wrappingType: LinkWrappingType.None,
    },
  }
);

/**
 * Link component
 *
 * A hyperlink element for navigation and triggering actions. Supports standard
 * link behavior with additional design variants, keyboard navigation, and
 * accessibility features.
 *
 * @example
 * ```tsx
 * // Basic link
 * <Link href="https://example.com">Visit Website</Link>
 *
 * // With design variant
 * <Link href="/page" design="Emphasized">
 *   Important Link
 * </Link>
 *
 * // Opens in new tab (auto-adds rel for cross-origin)
 * <Link href="https://example.com" target="_blank">
 *   External Link
 * </Link>
 *
 * // With icons
 * <Link
 *   href="/download"
 *   icon={<Download className="w-3 h-3" />}
 * >
 *   Download File
 * </Link>
 *
 * // As button (no href)
 * <Link
 *   accessibleRole="Button"
 *   onClick={(detail) => console.log('Link clicked', detail)}
 * >
 *   Trigger Action
 * </Link>
 *
 * // Large interactive area for touch
 * <Link href="/mobile" interactiveAreaSize="Large">
 *   Mobile Friendly Link
 * </Link>
 * ```
 */
export function Link({
  design = LinkDesign.Default,
  interactiveAreaSize = LinkInteractiveAreaSize.Normal,
  wrappingType = LinkWrappingType.None,
  href,
  target,
  rel,
  disabled = false,
  icon,
  endIcon,
  tooltip,
  children,
  accessibleName,
  accessibleNameRef,
  accessibleDescription,
  accessibleRole = LinkAccessibleRole.Link,
  accessibilityAttributes,
  onClick,
  className,
  style,
  id,
  tabIndex,
  "data-testid": dataTestId,
  ref,
}: LinkProps) {
    const linkRef = useRef<HTMLAnchorElement>(null);

    // Expose imperative methods
    useImperativeHandle(
      ref,
      () => ({
        focus() {
          linkRef.current?.focus();
        },
        blur() {
          linkRef.current?.blur();
        },
        isFocused() {
          return document.activeElement === linkRef.current;
        },
        get nativeElement() {
          return linkRef.current;
        },
      }),
      []
    );

    // Design type announcement for screen readers (Subtle / Emphasized)
    const { t } = useTranslation("fx");
    const linkTypeText = useMemo(() => {
      if (design === LinkDesign.Subtle) return t("LINK_SUBTLE");
      if (design === LinkDesign.Emphasized) return t("LINK_EMPHASIZED");
      return undefined;
    }, [design, t]);

    // Auto cross-origin rel computation
    const computedRel = useMemo(
      () => computeRel(href, target, rel),
      [href, target, rel]
    );

    // Default tabIndex: 0 for enabled links, -1 for disabled.
    // An <a> without href is not focusable by default, so we must
    // set tabIndex explicitly (matching ui5-webcomponents behaviour).
    const effectiveTabIndex = disabled ? -1 : (tabIndex ?? 0);

    // Handle click
    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (disabled) {
          e.preventDefault();
          return;
        }

        onClick?.({
          originalEvent: e,
          altKey: e.altKey,
          ctrlKey: e.ctrlKey,
          metaKey: e.metaKey,
          shiftKey: e.shiftKey,
          isKeyboard: false,
        });
      },
      [disabled, onClick]
    );

    // Focus on mousedown so the link is focusable on click (Safari doesn't do this by default for <a>)
    const handleMouseDown = useCallback(
      (_e: React.MouseEvent<HTMLAnchorElement>) => {
        if (!disabled) {
          linkRef.current?.focus();
        }
      },
      [disabled]
    );

    // Handle keyboard activation
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLAnchorElement>) => {
        if (disabled) return;

        if (e.key === "Enter" || e.key === " ") {
          // Space should only work for button role
          if (e.key === " " && accessibleRole !== LinkAccessibleRole.Button) {
            return;
          }

          e.preventDefault();
          onClick?.({
            originalEvent: e,
            altKey: e.altKey,
            ctrlKey: e.ctrlKey,
            metaKey: e.metaKey,
            shiftKey: e.shiftKey,
            isKeyboard: true,
          });

          // If there's an href and it's not prevented, navigate (with URL validation)
          if (href && !disabled && isSafeUrl(href)) {
            window.location.href = href;
          }
        }
      },
      [disabled, onClick, href, accessibleRole]
    );

    return (
      <a
        ref={linkRef}
        id={id}
        href={disabled ? undefined : href}
        target={target}
        rel={computedRel}
        role={accessibleRole === LinkAccessibleRole.Button ? "button" : undefined}
        aria-label={accessibleName}
        aria-labelledby={accessibleNameRef}
        aria-describedby={accessibleDescription}
        aria-disabled={disabled || undefined}
        aria-expanded={accessibilityAttributes?.expanded}
        aria-haspopup={accessibilityAttributes?.hasPopup}
        aria-current={accessibilityAttributes?.current || undefined}
        title={tooltip}
        tabIndex={effectiveTabIndex}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onKeyDown={handleKeyDown}
        className={cn(
          linkVariants({
            design: design as LinkDesign,
            interactiveAreaSize: interactiveAreaSize as LinkInteractiveAreaSize,
            wrappingType: wrappingType as LinkWrappingType,
          }),
          disabled && "pointer-events-none cursor-default opacity-[var(--disabled-opacity)]",
          "group",
          className
        )}
        style={style}
        data-testid={dataTestId}
        data-part="root"
      >
        {icon && (
          <span className="flex-shrink-0 size-3" data-part="icon">
            {icon}
          </span>
        )}
        {children && (
          <span
            className={cn(
              wrappingType === LinkWrappingType.None && "overflow-hidden text-ellipsis min-w-0",
              design === LinkDesign.Subtle &&
                "underline decoration-dotted underline-offset-[0.25em]",
              (design === LinkDesign.Default || design === LinkDesign.Emphasized) &&
                "group-hover:underline group-hover:decoration-dotted group-hover:underline-offset-[0.25em]"
            )}
            data-part="text"
          >
            {children}
          </span>
        )}
        {endIcon && (
          <span className="flex-shrink-0 size-3" data-part="end-icon">
            {endIcon}
          </span>
        )}
        {linkTypeText && (
          <span className="sr-only" data-part="link-type">
            {linkTypeText}
          </span>
        )}
      </a>
    );
}
