import React, {
  useRef,
  useState,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useId,
  createContext,
  Children,
  isValidElement,
  cloneElement,
} from "react";
import { cn, cva, subTestId } from "../../lib/utils";
import {
  BreadcrumbsProps,
  BreadcrumbsItemProps,
  BreadcrumbsDesign,
  BreadcrumbsSeparator,
  BreadcrumbsItemClickEventDetail,
  BreadcrumbsContextValue,
  SEPARATOR_MAP,
} from "../../types/breadcrumbs";
import { SlimArrowDownIcon } from "../../icons/SlimArrowDown";
import { List } from "../list/List";
import { ListItemBase } from "../list/ListItemBase";
import { ListAccessibleRole } from "../../types/list";
import { Link } from "../link/Link";
import { LinkDesign, LinkWrappingType, LinkRef, LinkAccessibleRole } from "../../types/link";
import { ResponsivePopover } from "../responsive-popover/ResponsivePopover";
import { PopoverPlacement, PopoverHorizontalAlign, PopupAccessibleRole } from "../../types/popover";
import { isPhone } from "../../lib/Device";

// ─── Context ──────────────────────────────────────────────────────────────────

export const BreadcrumbsContext = createContext<BreadcrumbsContextValue | null>(null);

// ─── CVA Variants ───────────────────────────────────────────────────────────

/** Separator between items. */
export const breadcrumbSeparatorVariants = cva([
  "mx-1 text-foreground font-semibold text-base select-none shrink-0",
]);

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Check if a React element is a BreadcrumbsItem. */
function isBreadcrumbsItem(child: React.ReactElement): boolean {
  return (child.type as { __isBreadcrumbsItem?: boolean })?.__isBreadcrumbsItem === true;
}

/** Extract BreadcrumbsItemProps from React children (used for measure row + overflow popover). */
function extractItems(children: React.ReactNode): BreadcrumbsItemProps[] {
  const items: BreadcrumbsItemProps[] = [];
  Children.forEach(children, (child) => {
    if (isValidElement(child) && isBreadcrumbsItem(child)) {
      items.push(child.props as BreadcrumbsItemProps);
    }
  });
  return items;
}

/** Detect F4 / Alt+ArrowDown / Alt+ArrowUp (the "show" key combo). */
function isShowKey(e: React.KeyboardEvent): boolean {
  if (e.key === "F4" && !e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) return true;
  if (e.altKey && (e.key === "ArrowDown" || e.key === "ArrowUp")) return true;
  return false;
}

/** Inject `_index` into each BreadcrumbsItem child via cloneElement. */
function injectIndices(children: React.ReactNode): React.ReactNode {
  let idx = 0;
  return Children.map(children, (child) => {
    if (isValidElement(child) && isBreadcrumbsItem(child)) {
      const injected = cloneElement(child as React.ReactElement<any>, { _index: idx });
      idx++;
      return injected;
    }
    return child;
  });
}

// ─── Breadcrumbs ─────────────────────────────────────────────────────────────

/**
 * Breadcrumbs — a responsive navigation trail with overflow.
 *
 * Feature-complete counterpart to the UI5 `ui5-breadcrumbs` web component:
 *
 * - **Design variants**: `Standard` (last item = current page) and `NoCurrentPage`.
 * - **6 separator styles**: Slash, BackSlash, DoubleSlash, DoubleBackSlash, GreaterThan, DoubleGreaterThan.
 * - **Responsive overflow**: Items that don't fit collapse into a dropdown popover (overflow starts from the left).
 * - **Roving tabindex**: Arrow-key navigation across the trail; single Tab-stop.
 * - **Full keyboard support**: Left/Right/Home/End for the trail; F4/Alt+Arrow to open overflow; Escape to close; Enter/Space to activate items.
 * - **Accessibility**: `<nav>` landmark with `aria-label`, `<ol>` list, `aria-current="page"` on the current item, positional labels ("2 of 5"), `aria-haspopup` on the overflow button, `aria-hidden` separators.
 * - **`onItemClick` event**: Cancelable via `originalEvent.preventDefault()`.
 *
 * @example
 * ```tsx
 * <Breadcrumbs onItemClick={(d) => console.log(d.item)}>
 *   <BreadcrumbsItem href="/">Home</BreadcrumbsItem>
 *   <BreadcrumbsItem href="/products">Products</BreadcrumbsItem>
 *   <BreadcrumbsItem>Current Page</BreadcrumbsItem>
 * </Breadcrumbs>
 * ```
 */
export function Breadcrumbs({
  design = BreadcrumbsDesign.Standard,
  separators = BreadcrumbsSeparator.Slash,
  linkDesign = LinkDesign.Default,
  overflowCount: controlledOverflowCount,
  noPadding = false,
  children,
  accessibleName = "Breadcrumb Trail",
  accessibleDescription,
  accessibleDescriptionRef,
  onItemClick,
  className,
  style,
  id,
  "data-testid": dataTestId,
  ref,
}: BreadcrumbsProps) {
    // ── Refs ──────────────────────────────────────────────────────────────
    const navRef = useRef<HTMLElement>(null);
    const olRef = useRef<HTMLOListElement>(null);
    const measureRef = useRef<HTMLOListElement>(null);
    const overflowBtnRef = useRef<LinkRef>(null);
    const itemRefs = useRef<Map<number, HTMLElement>>(new Map());

    // ── State ─────────────────────────────────────────────────────────────
    const [internalOverflowSize, setInternalOverflowSize] = useState(0);
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const [phone] = useState(() => isPhone());

    // ── Derived data ──────────────────────────────────────────────────────
    const allItems = useMemo(() => extractItems(children), [children]);
    const totalCount = allItems.length;

    // Use controlled overflow count if provided, otherwise use internal state.
    // Clamp to [0, totalCount] to guard against stale state or invalid controlled values.
    const rawOverflow = controlledOverflowCount !== undefined ? controlledOverflowCount : internalOverflowSize;
    const overflowSize = Math.max(0, Math.min(rawOverflow, totalCount));

    const isStandard = design === BreadcrumbsDesign.Standard;
    const separatorChar = SEPARATOR_MAP[separators as BreadcrumbsSeparator] ?? "/";

    const overflowItems = useMemo(
      () => allItems.slice(0, overflowSize),
      [allItems, overflowSize]
    );
    const visibleItems = useMemo(
      () => allItems.slice(overflowSize),
      [allItems, overflowSize]
    );

    const hasOverflow = overflowItems.length > 0;
    const allOverflowed = overflowSize >= totalCount && totalCount > 0;
    const lastItem = visibleItems[visibleItems.length - 1];

    const endsWithCurrentLocation = isStandard && totalCount > 0;
    const lastItemIsLink = !!lastItem?.href;

    const linkItems = useMemo(() => {
      if (endsWithCurrentLocation && !lastItemIsLink) {
        return visibleItems.slice(0, -1);
      }
      return visibleItems;
    }, [visibleItems, endsWithCurrentLocation, lastItemIsLink]);

    // Build a flat list of focusable "slots" for roving tabindex.
    const focusableIds = useMemo(() => {
      const ids: string[] = [];
      if (hasOverflow) ids.push("overflow");
      linkItems.forEach((_, i) => ids.push(`link-${overflowSize + i}`));
      return ids;
    }, [hasOverflow, linkItems, overflowSize, endsWithCurrentLocation, lastItemIsLink, totalCount]);

    // Clamp focusedIndex when focusable slots change (e.g. after resize overflow).
    useEffect(() => {
      setFocusedIndex((prev) => {
        if (prev < 0) return prev;
        return prev >= focusableIds.length ? focusableIds.length - 1 : prev;
      });
    }, [focusableIds]);

    // ── Imperative ref ────────────────────────────────────────────────────
    useImperativeHandle(ref, () => ({
      focus() {
        const first = focusableIds[0];
        if (!first) return;
        if (first === "overflow") {
          overflowBtnRef.current?.focus();
        } else {
          // Parse the global index from the slot id (e.g. "link-2" → 2)
          const globalIdx = Number(first.split("-")[1]);
          const el = itemRefs.current.get(globalIdx);
          el?.focus();
        }
      },
      get nativeElement() {
        return navRef.current;
      },
    }));

    // ── Overflow measurement ──────────────────────────────────────────────
    // We use a hidden "measure row" that always renders ALL items.
    // This lets us read every item's width regardless of overflow state.

    const widthCacheRef = useRef<number[]>([]);
    const overflowBtnWidthRef = useRef(0);
    const measureScheduledRef = useRef(false);

    const measureAndUpdate = useCallback(() => {
      const measureOl = measureRef.current;
      const visibleOl = olRef.current;
      if (!measureOl || !visibleOl) return;

      const availableWidth = visibleOl.offsetWidth;
      if (availableWidth === 0) return;

      // Measure ALL items from the hidden measure row.
      const wrappers = measureOl.querySelectorAll<HTMLElement>("[data-bc-measure]");
      const widths: number[] = [];
      wrappers.forEach((wrapper) => {
        const idx = Number(wrapper.dataset.bcMeasure);
        widths[idx] = Math.ceil(wrapper.getBoundingClientRect().width);
      });
      widthCacheRef.current = widths;

      // Measure the overflow button from the measure row.
      const overflowEl = measureOl.querySelector<HTMLElement>("[data-bc-measure-overflow]");
      overflowBtnWidthRef.current = overflowEl
        ? Math.ceil(overflowEl.getBoundingClientRect().width)
        : 0;

      // Calculate how many items to overflow from the start.
      let requiredWidth = widths.reduce((s, w) => s + (w || 0), 0);
      let newOverflow = 0;
      const maxOverflow = Math.max(0, totalCount - 1);

      if (requiredWidth > availableWidth && maxOverflow > 0) {
        requiredWidth += overflowBtnWidthRef.current;

        while (requiredWidth > availableWidth && newOverflow < maxOverflow) {
          requiredWidth -= widths[newOverflow] || 0;
          newOverflow++;
        }
      }

      setInternalOverflowSize((prev) => (prev !== newOverflow ? newOverflow : prev));
    }, [totalCount]);

    // ResizeObserver on the visible <ol> - only used when overflow is not controlled
    useEffect(() => {
      // Skip automatic measurement if overflow is controlled externally
      if (controlledOverflowCount !== undefined) return;

      const ol = olRef.current;
      if (!ol) return;

      const ro = new ResizeObserver(() => {
        if (!measureScheduledRef.current) {
          measureScheduledRef.current = true;
          requestAnimationFrame(() => {
            measureScheduledRef.current = false;
            measureAndUpdate();
          });
        }
      });
      ro.observe(ol);
      return () => ro.disconnect();
    }, [measureAndUpdate, controlledOverflowCount]);

    // Re-measure when items change - only when overflow is not controlled
    useEffect(() => {
      if (controlledOverflowCount !== undefined) return;
      const frameId = requestAnimationFrame(() => measureAndUpdate());
      return () => cancelAnimationFrame(frameId);
    }, [totalCount, children, measureAndUpdate, controlledOverflowCount]);

    // ── Event handlers ────────────────────────────────────────────────────

    const fireItemClick = useCallback(
      (
        e: React.MouseEvent | React.KeyboardEvent,
        itemProps: BreadcrumbsItemProps,
        itemIndex: number
      ) => {
        const detail: BreadcrumbsItemClickEventDetail = {
          originalEvent: e,
          item: itemProps,
          index: itemIndex,
          altKey: e.altKey,
          ctrlKey: e.ctrlKey,
          metaKey: e.metaKey,
          shiftKey: e.shiftKey,
        };
        onItemClick?.(detail);
      },
      [onItemClick]
    );

    const handleLinkClick = useCallback(
      (e: React.MouseEvent<HTMLAnchorElement>, itemProps: BreadcrumbsItemProps, itemIndex: number) => {
        fireItemClick(e, itemProps, itemIndex);
      },
      [fireItemClick]
    );

    const handleCurrentPageClick = useCallback(
      (e: React.MouseEvent | React.KeyboardEvent, itemProps: BreadcrumbsItemProps, itemIndex: number) => {
        fireItemClick(e, itemProps, itemIndex);
      },
      [fireItemClick]
    );

    const togglePopover = useCallback(() => {
      setPopoverOpen((prev) => !prev);
    }, []);

    // ── Item ref registration (exposed via context) ──────────────────────

    const registerItemRef = useCallback(
      (globalIndex: number, element: HTMLElement | null) => {
        if (element) itemRefs.current.set(globalIndex, element);
        else itemRefs.current.delete(globalIndex);
      },
      []
    );

    // ── Roving tabindex: keyboard on the <ol> ─────────────────────────────

    const moveFocus = useCallback(
      (newIdx: number) => {
        if (newIdx < 0 || newIdx >= focusableIds.length) return;
        setFocusedIndex(newIdx);

        const slotId = focusableIds[newIdx];
        if (slotId === "overflow") {
          overflowBtnRef.current?.focus();
        } else {
          const globalIdx = Number(slotId.split("-")[1]);
          const el = itemRefs.current.get(globalIdx);
          el?.focus();
        }
      },
      [focusableIds]
    );

    const handleOlKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        const currentIdx = focusedIndex >= 0 ? focusedIndex : 0;
        const isRTL = document.documentElement.dir === "rtl";

        switch (e.key) {
          case "ArrowRight": {
            if (e.altKey) break;
            e.preventDefault();
            const nextIdx = isRTL
              ? Math.max(currentIdx - 1, 0)
              : Math.min(currentIdx + 1, focusableIds.length - 1);
            moveFocus(nextIdx);
            break;
          }
          case "ArrowDown": {
            if (e.altKey) break;
            e.preventDefault();
            moveFocus(Math.min(currentIdx + 1, focusableIds.length - 1));
            break;
          }
          case "ArrowLeft": {
            if (e.altKey) break;
            e.preventDefault();
            const prevIdx = isRTL
              ? Math.min(currentIdx + 1, focusableIds.length - 1)
              : Math.max(currentIdx - 1, 0);
            moveFocus(prevIdx);
            break;
          }
          case "ArrowUp": {
            if (e.altKey) break;
            e.preventDefault();
            moveFocus(Math.max(currentIdx - 1, 0));
            break;
          }
          case "Home": {
            e.preventDefault();
            moveFocus(0);
            break;
          }
          case "End": {
            e.preventDefault();
            moveFocus(focusableIds.length - 1);
            break;
          }
          case " ": {
            e.preventDefault();
            const id = focusableIds[currentIdx];
            if (id === "overflow") break; // handled below by isShowKey
            const globalIdx = Number(id.split("-")[1]);
            const el = itemRefs.current.get(globalIdx);
            if (el) (el as HTMLElement).click();
            break;
          }
          default:
            break;
        }

        if (isShowKey(e) && focusableIds[currentIdx] === "overflow") {
          e.preventDefault();
          togglePopover();
        }

      },
      [focusedIndex, focusableIds, moveFocus, togglePopover]
    );

    const handleOlFocusIn = useCallback(
      (e: React.FocusEvent) => {
        const target = e.target as HTMLElement;
        if (target === overflowBtnRef.current?.nativeElement) {
          const idx = focusableIds.indexOf("overflow");
          if (idx >= 0) setFocusedIndex(idx);
          return;
        }
        // Match focused element against registered item refs or data-bc-link-index
        for (const [globalIdx, el] of itemRefs.current.entries()) {
          if (el && (el === target || el.contains(target))) {
            const slotId = `link-${globalIdx}`;
            const idx = focusableIds.indexOf(slotId);
            if (idx >= 0) setFocusedIndex(idx);
            return;
          }
        }
        const globalIdx = target.closest<HTMLElement>("[data-bc-link-index]")?.dataset.bcLinkIndex;
        if (globalIdx != null) {
          const slotId = `link-${globalIdx}`;
          const idx = focusableIds.indexOf(slotId);
          if (idx >= 0) setFocusedIndex(idx);
        }
      },
      [focusableIds]
    );

    // ── Tabindex helper ───────────────────────────────────────────────────
    const getTabIndex = useCallback(
      (slotId: string): 0 | -1 => {
        const idx = focusableIds.indexOf(slotId);
        if (focusedIndex < 0) return idx === 0 ? 0 : -1;
        return idx === focusedIndex ? 0 : -1;
      },
      [focusableIds, focusedIndex]
    );

    // ── Context value ─────────────────────────────────────────────────────

    const visibleCount = visibleItems.length;

    const hasCurrentPageLabel = endsWithCurrentLocation && !lastItemIsLink;

    const contextValue = useMemo<BreadcrumbsContextValue>(
      () => ({
        separatorChar,
        isStandard,
        totalCount,
        visibleCount,
        overflowSize,
        linkDesign,
        getTabIndex,
        onLinkClick: handleLinkClick,
        onCurrentPageClick: handleCurrentPageClick,
        registerItemRef,
        hasCurrentPageLabel,
      }),
      [separatorChar, isStandard, totalCount, visibleCount, overflowSize, linkDesign, getTabIndex, handleLinkClick, handleCurrentPageClick, registerItemRef, hasCurrentPageLabel]
    );

    // ── Inject _index into each BreadcrumbsItem child ─────────────────────

    const indexedChildren = useMemo(() => injectIndices(children), [children]);

    // Generate description ID for accessible description
    const descriptionId = useId();

    // ── Render ────────────────────────────────────────────────────────────

    return (
      <nav
        ref={navRef}
        id={id}
        aria-label={accessibleName}
        aria-describedby={
          [
            accessibleDescriptionRef,
            accessibleDescription ? descriptionId : null,
          ].filter(Boolean).join(" ") || undefined
        }
        className={cn("block w-full relative", className)}
        style={style}
        data-testid={dataTestId}
      >
        {accessibleDescription && (
          <span id={descriptionId} className="sr-only">
            {accessibleDescription}
          </span>
        )}
        {/* ── Hidden measure row: renders ALL items to capture widths ── */}
        <ol
          ref={measureRef}
          aria-hidden="true"
          className="flex items-center list-none m-0 p-0 whitespace-nowrap absolute top-0 left-0 w-full pointer-events-none"
          style={{ visibility: "hidden", height: 0, overflow: "hidden" }}
        >
          {/* Measure the overflow button */}
          <li data-bc-measure-overflow className="inline-flex items-center shrink-0">
            <span className="inline-flex items-center gap-0.5 text-base px-0.5 py-0.5">
              <span>…</span>
              <SlimArrowDownIcon className="h-3 w-3 block" />
            </span>
            <span className="mx-1 text-base font-semibold select-none">{separatorChar}</span>
          </li>

          {/* Measure every item (always rendered) */}
          {allItems.map((item, idx) => {
            const isLastItem = idx === totalCount - 1;
            const showSep = !(isStandard && isLastItem && !item.href);

            return (
              <li
                key={idx}
                data-bc-measure={idx}
                className="inline-flex items-center shrink-0"
              >
                <span
                  className="text-base font-semibold whitespace-nowrap px-0.5 py-0.5"
                >
                  {item.children}
                </span>
                {showSep && (
                  <span className="mx-1 text-base font-semibold select-none">{separatorChar}</span>
                )}
              </li>
            );
          })}
        </ol>

        {/* ── Visible row ────────────────────────────────────────────── */}
        <ol
          ref={olRef}
          className={cn(
            "flex items-center list-none m-0 p-0 whitespace-nowrap overflow-x-clip overflow-y-visible",
            !noPadding && "px-1 py-0.5"
          )}
          onKeyDown={handleOlKeyDown}
          onFocusCapture={handleOlFocusIn}
        >
          {/* Overflow dropdown button */}
          <li
            className={cn(
              "inline-flex items-center shrink-0",
              !hasOverflow && "hidden"
            )}
          >
            <Link
              ref={overflowBtnRef}
              accessibleRole={LinkAccessibleRole.Button}
              accessibleName="More"
              accessibilityAttributes={{
                hasPopup: hasOverflow ? "listbox" : undefined,
                expanded: hasOverflow ? popoverOpen : undefined,
              }}
              design={linkDesign}
              wrappingType={LinkWrappingType.None}
              tabIndex={hasOverflow ? getTabIndex("overflow") : -1}
              onClick={() => togglePopover()}
              endIcon={<SlimArrowDownIcon className="h-3 w-3 block" aria-hidden="true" />}
              className="text-sm px-0.5 py-0.5 gap-0"
              data-testid={subTestId(dataTestId, "overflow")}
            >
              <span aria-hidden="true">…</span>
            </Link>
            {/* Hide separator when all items are overflowed (parent provides separator) */}
            {!allOverflowed && (
              <span
                className={breadcrumbSeparatorVariants()}
                aria-hidden="true"
              >
                {separatorChar}
              </span>
            )}
          </li>

          {/* Visible items — each BreadcrumbsItem renders its own <li> */}
          <BreadcrumbsContext.Provider value={contextValue}>
            {indexedChildren}
          </BreadcrumbsContext.Provider>
        </ol>

        {/* ── Overflow popover ──────────────────────────────────────── */}
        <ResponsivePopover
          opener={overflowBtnRef}
          open={popoverOpen}
          onClose={() => setPopoverOpen(false)}
          placement={PopoverPlacement.Bottom}
          horizontalAlign={PopoverHorizontalAlign.Start}
          hideArrow
          noPadding
          accessibleRole={PopupAccessibleRole.None}
          contentOnlyOnDesktop
          headerText="Breadcrumb Trail"
        >
          <List
            accessibleRole={ListAccessibleRole.Menu}
            accessibleName="Breadcrumb Trail"
          >
            {[...(phone ? allItems : overflowItems)].reverse().map((item, displayIdx) => {
              const globalIdx = phone
                ? totalCount - 1 - displayIdx
                : overflowSize - 1 - displayIdx;
              return (
                <ListItemBase
                  key={globalIdx}
                  itemKey={`overflow-${globalIdx}`}
                  onClick={(e) => {
                    fireItemClick(e as React.MouseEvent, item, globalIdx);
                    setPopoverOpen(false);
                  }}
                  className="px-3 py-2 text-sm"
                >
                  {item.children}
                </ListItemBase>
              );
            })}
          </List>
        </ResponsivePopover>
      </nav>
    );
}
