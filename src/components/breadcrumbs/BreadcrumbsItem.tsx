import { useContext, useRef, useEffect } from "react";
import { cn, cva } from "../../lib/utils";
import { BreadcrumbsItemProps } from "../../types/breadcrumbs";
import {
  BreadcrumbsContext,
  breadcrumbSeparatorVariants,
} from "./Breadcrumbs";
import { Link } from "../link/Link";
import { LinkDesign, LinkRef, LinkWrappingType } from "../../types/link";

// ─── CVA Variants ───────────────────────────────────────────────────────────

/** Current-page label (non-link). */
const breadcrumbCurrentVariants = cva([
  "text-base font-semibold text-foreground truncate",
  "rounded-sm px-0.5 py-0.5",
  "cursor-default",
]);

/**
 * BreadcrumbsItem
 *
 * Represents a single item in a `<Breadcrumbs>` trail.
 * Renders its own `<li>` element with a `Link` or `<span>` current-page
 * label, following the UI5 pattern.
 *
 * @example
 * ```tsx
 * <Breadcrumbs>
 *   <BreadcrumbsItem href="/home">Home</BreadcrumbsItem>
 *   <BreadcrumbsItem href="/products">Products</BreadcrumbsItem>
 *   <BreadcrumbsItem>Current Page</BreadcrumbsItem>
 * </Breadcrumbs>
 * ```
 */
export function BreadcrumbsItem({
  href,
  target,
  accessibleName,
  children,
  className,
  style,
  "data-testid": dataTestId,
  _index,
  ref,
}: BreadcrumbsItemProps) {
  const ctx = useContext(BreadcrumbsContext);
  const linkRef = useRef<LinkRef>(null);
  const spanRef = useRef<HTMLSpanElement>(null);

  const globalIndex = _index ?? -1;
  const active = ctx != null && _index != null;

  const isStandard = ctx?.isStandard ?? false;
  const totalCount = ctx?.totalCount ?? 0;
  const visibleCount = ctx?.visibleCount ?? 0;
  const overflowSize = ctx?.overflowSize ?? 0;
  const separatorChar = ctx?.separatorChar ?? "/";
  const linkDesign = ctx?.linkDesign ?? LinkDesign.Default;
  const getTabIndex = ctx?.getTabIndex;
  const onLinkClick = ctx?.onLinkClick;
  const registerItemRef = ctx?.registerItemRef;

  const isOverflowed = globalIndex < overflowSize;
  const isLastItem = globalIndex === totalCount - 1;
  const isCurrentPage = isStandard && isLastItem && !href;
  const isCurrentPageLink = isStandard && isLastItem && !!href;

  // Register ref with parent for keyboard navigation (must always run).
  useEffect(() => {
    if (!active || isOverflowed || !registerItemRef) return;
    const el = isCurrentPage ? spanRef.current : (linkRef.current?.nativeElement ?? null);
    registerItemRef(globalIndex, el);
    return () => registerItemRef(globalIndex, null);
  }, [active, isOverflowed, isCurrentPage, globalIndex, registerItemRef]);

  // Set imperative attributes on the native <a> element.
  useEffect(() => {
    if (!active || isOverflowed || isCurrentPage) return;
    const el = linkRef.current?.nativeElement;
    if (!el) return;
    el.setAttribute("data-bc-link-index", String(globalIndex));
    if (isCurrentPageLink) {
      el.setAttribute("aria-current", "page");
    } else {
      el.removeAttribute("aria-current");
    }
  }, [active, isOverflowed, isCurrentPage, isCurrentPageLink, globalIndex]);

  // Not inside a Breadcrumbs provider.
  if (!active) return null;

  // Overflowed items are rendered in the popover by the parent.
  if (isOverflowed) return null;

  const positionInVisible = globalIndex - overflowSize + 1;

  // ── Current-page label (Standard design, last item, no href) ──

  if (isCurrentPage) {
    const textContent = typeof children === "string" ? children : "";
    const posLabel = `${visibleCount} of ${visibleCount}`;
    const ariaLabel = [textContent, accessibleName, posLabel]
      .filter(Boolean)
      .join(" ");

    return (
      <li
        ref={ref}
        className={cn("inline-flex items-center min-w-0 flex-1", className)}
        style={style}
        data-testid={dataTestId}
      >
        <span
          ref={spanRef}
          data-bc-current
          aria-current="page"
          aria-label={ariaLabel}
          className={breadcrumbCurrentVariants()}
        >
          {children}
        </span>
      </li>
    );
  }

  // ── Link item ──

  const textContent = typeof children === "string" ? children : "";
  const posLabel = `${positionInVisible} of ${visibleCount}`;
  const ariaLabel = [textContent, accessibleName, posLabel]
    .filter(Boolean)
    .join(" ");

  // Show separator after every link except the terminal item in the trail.
  const isTerminalItem = isCurrentPageLink || (!isStandard && isLastItem);
  const needsSeparator = !isTerminalItem;

  const ownProps: BreadcrumbsItemProps = {
    href,
    target,
    accessibleName,
    children,
    className,
    style,
    "data-testid": dataTestId,
  };

  return (
    <li
      ref={ref}
      className={cn("inline-flex items-center min-w-0", isTerminalItem ? "" : "shrink-0", className)}
      style={style}
      data-testid={dataTestId}
    >
      <Link
        ref={linkRef}
        href={href}
        target={target}
        rel={target === "_blank" ? "noopener noreferrer" : undefined}
        design={isCurrentPageLink ? LinkDesign.Subtle : linkDesign}
        wrappingType={LinkWrappingType.None}
        accessibleName={ariaLabel}
        tabIndex={getTabIndex?.(`link-${globalIndex}`) ?? -1}
        onClick={({ originalEvent }) =>
          onLinkClick?.(originalEvent as React.MouseEvent<HTMLAnchorElement>, ownProps, globalIndex)
        }
        className={cn(
          "text-base font-semibold px-0.5 py-0.5 mx-0 my-0",
          isCurrentPageLink && "!text-foreground !no-underline",
          isTerminalItem && "truncate max-w-full"
        )}
      >
        {children}
      </Link>
      {needsSeparator && (
        <span
          className={breadcrumbSeparatorVariants()}
          aria-hidden="true"
        >
          {separatorChar}
        </span>
      )}
    </li>
  );
}

/** @internal Marker for parent to identify BreadcrumbsItem children without displayName. */
(BreadcrumbsItem as unknown as Record<string, unknown>).__isBreadcrumbsItem = true;

BreadcrumbsItem.displayName = "BreadcrumbsItem";
