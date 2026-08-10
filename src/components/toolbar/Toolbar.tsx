import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useImperativeHandle,
  useId,
  Children,
  isValidElement,
} from "react";
import { useTranslation } from "react-i18next";
import { cn, cva } from "../../lib/utils";
import { OverflowIcon } from "../../icons/Overflow";
import { Button } from "../button/Button";
import { Popover } from "../popover/Popover";
import { ToolbarContext } from "./ToolbarContext";
import {
  ToolbarProps,
  ToolbarDesign,
  ToolbarAlign,
  ToolbarItemOverflowBehavior,
} from "../../types/toolbar";

// ── CVA Variants ─────────────────────────────────────────────────────────────

const toolbarVariants = cva(
  ["flex items-center w-full min-h-[40px] px-2 gap-2"],
  {
    variants: {
      design: {
        [ToolbarDesign.Solid]: "bg-card border-b border-border",
        [ToolbarDesign.Transparent]: "bg-transparent",
      },
      align: {
        [ToolbarAlign.Start]: "justify-start",
        [ToolbarAlign.End]: "justify-end",
      },
    },
    defaultVariants: {
      design: ToolbarDesign.Solid,
      align: ToolbarAlign.End,
    },
  }
);

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Recursively flatten Fragments to get actual child elements */
const flattenChildren = (nodes: React.ReactNode): React.ReactElement[] => {
  const result: React.ReactElement[] = [];
  Children.forEach(nodes, (child) => {
    if (!isValidElement(child)) return;
    if (child.type === React.Fragment) {
      result.push(
        ...flattenChildren(
          (child.props as { children?: React.ReactNode }).children
        )
      );
    } else {
      result.push(child);
    }
  });
  return result;
};

/** Read overflow priority from a child element's props */
function getOverflowPriority(
  child: React.ReactElement
): ToolbarItemOverflowBehavior {
  const props = child.props as { overflowPriority?: string };
  const val = props.overflowPriority;
  if (val === ToolbarItemOverflowBehavior.NeverOverflow || val === "NeverOverflow")
    return ToolbarItemOverflowBehavior.NeverOverflow;
  if (val === ToolbarItemOverflowBehavior.AlwaysOverflow || val === "AlwaysOverflow")
    return ToolbarItemOverflowBehavior.AlwaysOverflow;
  return ToolbarItemOverflowBehavior.Default;
}

/** Check if a child is a separator */
function isSeparator(child: React.ReactElement): boolean {
  return (child.type as { displayName?: string })?.displayName === "ToolbarSeparator";
}

/** Check if a child element is or contains a Title component */
function startsWithTitle(child: React.ReactElement): boolean {
  const typeName =
    (child.type as { displayName?: string })?.displayName ??
    (child.type as { name?: string })?.name;
  if (typeName === "Title") return true;
  // ToolbarItem wrapping a Title
  if (typeName === "ToolbarItem") {
    const inner = Children.toArray(
      (child.props as { children?: React.ReactNode }).children,
    );
    return inner.some(
      (c) =>
        isValidElement(c) &&
        (((c.type as { displayName?: string })?.displayName ??
          (c.type as { name?: string })?.name) === "Title"),
    );
  }
  return false;
}

// Estimated overflow button width (icon button + gap)
const OVERFLOW_BTN_WIDTH = 40;

// ── Component ────────────────────────────────────────────────────────────────

/**
 * Toolbar
 *
 * A horizontal bar of actions that automatically overflows items into a
 * popover when space is constrained. Follows UI5 Toolbar semantics.
 *
 * @example
 * ```tsx
 * <Toolbar>
 *   <ToolbarButton text="Edit" icon={<Edit className="h-4 w-4" />} />
 *   <ToolbarSpacer />
 *   <ToolbarButton text="Delete" design="Neutral" />
 * </Toolbar>
 * ```
 */
export function Toolbar({
  design = ToolbarDesign.Solid,
  alignContent = ToolbarAlign.End,
  accessibleName,
  accessibleNameRef,
  accessibleDescription,
  accessibleDescriptionRef,
  children,
  className,
  style,
  id,
  ref,
  "data-testid": dataTestId,
}: ToolbarProps) {
    const { t } = useTranslation("fx");
    const toolbarRef = useRef<HTMLDivElement>(null);
    const measureRef = useRef<HTMLDivElement>(null);
    const overflowBtnRef = useRef<HTMLDivElement>(null);

    const [containerWidth, setContainerWidth] = useState(0);
    const [itemWidths, setItemWidths] = useState<number[]>([]);
    const [overflowOpen, setOverflowOpen] = useState(false);

    // Expose imperative handle
    useImperativeHandle(
      ref,
      () => ({
        focus() {
          toolbarRef.current?.focus();
        },
        get nativeElement() {
          return toolbarRef.current;
        },
      }),
      []
    );

    // Flatten children
    const flatItems = useMemo(() => flattenChildren(children), [children]);

    // Generate description ID for accessible description
    const descriptionId = useId();

    // ── ResizeObserver on toolbar container ────────────────────────────────
    useEffect(() => {
      const el = toolbarRef.current;
      if (!el) return;

      const observer = new ResizeObserver((entries) => {
        const newWidth = Math.floor(entries[0]?.contentRect.width || 0);
        setContainerWidth((prev) => (newWidth !== prev ? newWidth : prev));
      });
      observer.observe(el);
      return () => observer.disconnect();
    }, []);

    // ── Off-screen measurement ────────────────────────────────────────────
    useEffect(() => {
      if (flatItems.length === 0) return;

      const frame = requestAnimationFrame(() => {
        const container = measureRef.current;
        if (!container) return;

        const widths: number[] = [];
        for (let i = 0; i < flatItems.length; i++) {
          const el = container.querySelector(
            `[data-measure="${i}"]`
          ) as HTMLElement | null;
          widths.push(el ? el.offsetWidth : 0);
        }
        setItemWidths(widths);
      });

      return () => cancelAnimationFrame(frame);
    }, [flatItems]);

    // ── Overflow distribution ─────────────────────────────────────────────
    const overflowedSet = useMemo(() => {
      const set = new Set<number>();
      if (containerWidth === 0 || itemWidths.length === 0) return set;

      // Phase 1: AlwaysOverflow items
      flatItems.forEach((child, i) => {
        if (getOverflowPriority(child) === ToolbarItemOverflowBehavior.AlwaysOverflow) {
          set.add(i);
        }
      });

      // Calculate total width of non-overflowed items
      const GAP = 8; // gap-2 = 0.5rem = 8px
      let totalNeeded = 0;
      flatItems.forEach((_, i) => {
        if (!set.has(i)) {
          totalNeeded += (itemWidths[i] || 0) + GAP;
        }
      });

      // Available width — reserve overflow button space only when it will appear
      const hasAlwaysOverflow = set.size > 0;
      let available = containerWidth;

      // Phase 2: overflow Default items from the end
      // The overflow button appears when there are AlwaysOverflow items OR
      // when Default items don't fit. Reserve its width accordingly.
      if (hasAlwaysOverflow || totalNeeded > available) {
        available -= OVERFLOW_BTN_WIDTH + GAP;
      }

      if (totalNeeded > available) {

        // Walk from end, overflow Default items until we fit
        for (let i = flatItems.length - 1; i >= 0; i--) {
          if (set.has(i)) continue;
          const priority = getOverflowPriority(flatItems[i]);
          if (priority === ToolbarItemOverflowBehavior.NeverOverflow) continue;

          if (totalNeeded > available) {
            totalNeeded -= (itemWidths[i] || 0) + GAP;
            set.add(i);
          }
        }
      }

      // Phase 3: hide separators whose neighbors are all overflowed
      flatItems.forEach((child, i) => {
        if (!isSeparator(child) || set.has(i)) return;
        // Check if previous visible item exists
        let hasPrev = false;
        for (let j = i - 1; j >= 0; j--) {
          if (!set.has(j) && !isSeparator(flatItems[j])) {
            hasPrev = true;
            break;
          }
          if (set.has(j)) break;
        }
        // Check if next visible item exists
        let hasNext = false;
        for (let j = i + 1; j < flatItems.length; j++) {
          if (!set.has(j) && !isSeparator(flatItems[j])) {
            hasNext = true;
            break;
          }
          if (set.has(j)) break;
        }
        if (!hasPrev || !hasNext) {
          set.add(i);
        }
      });

      return set;
    }, [containerWidth, itemWidths, flatItems]);

    // Items split into visible and overflowed
    const visibleItems = flatItems.filter((_, i) => !overflowedSet.has(i));
    const overflowedItems = flatItems.filter((_, i) => overflowedSet.has(i));
    const hasOverflow = overflowedItems.length > 0;

    // Close overflow callback
    const closeOverflow = useCallback(() => {
      setOverflowOpen(false);
    }, []);

    // Toggle overflow popover (focus is managed by the Popover component)
    const handleOverflowClick = useCallback(() => {
      setOverflowOpen((prev) => !prev);
    }, []);

    // Determine role — use toolbar role when there are multiple interactive items
    const interactiveCount = flatItems.filter((child) => {
      const dn = (child.type as { displayName?: string })?.displayName;
      return (
        dn === "ToolbarButton" ||
        dn === "ToolbarSelect" ||
        dn === "ToolbarItem"
      );
    }).length;
    const role = interactiveCount > 1 ? "toolbar" : undefined;

    // Extra start padding when the first child is a Title
    const hasLeadingTitle = flatItems.length > 0 && startsWithTitle(flatItems[0]);

    // ── Keyboard navigation (WAI-ARIA toolbar pattern) ──────────────────
    const getFocusableItems = useCallback((): HTMLElement[] => {
      const el = toolbarRef.current;
      if (!el) return [];
      return Array.from(
        el.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [role="combobox"]:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
        )
      ).filter((node) => {
        // Exclude items inside the hidden measurement container
        return !node.closest("[data-measure]") && !node.closest("[aria-hidden='true']");
      });
    }, []);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        const items = getFocusableItems();
        if (items.length === 0) return;

        const currentIndex = items.indexOf(
          document.activeElement as HTMLElement
        );

        let nextIndex: number | null = null;

        switch (e.key) {
          case "ArrowRight":
            e.preventDefault();
            nextIndex =
              currentIndex < 0 ? 0 : (currentIndex + 1) % items.length;
            break;
          case "ArrowLeft":
            e.preventDefault();
            nextIndex =
              currentIndex < 0
                ? items.length - 1
                : (currentIndex - 1 + items.length) % items.length;
            break;
          case "Home":
            e.preventDefault();
            nextIndex = 0;
            break;
          case "End":
            e.preventDefault();
            nextIndex = items.length - 1;
            break;
        }

        if (nextIndex !== null) {
          items[nextIndex].focus();
        }
      },
      [getFocusableItems]
    );

    return (
      <>
        {/* Main toolbar */}
        <div
          ref={toolbarRef}
          role={role}
          aria-label={accessibleName}
          aria-labelledby={accessibleNameRef}
          aria-describedby={
            [
              accessibleDescriptionRef,
              accessibleDescription ? descriptionId : null,
            ].filter(Boolean).join(" ") || undefined
          }
          id={id}
          style={style}
          onKeyDown={handleKeyDown}
          className={cn(
            toolbarVariants({
              design: design as ToolbarDesign,
              align: alignContent as ToolbarAlign,
            }),
            hasLeadingTitle && "ps-4",
            className
          )}
          data-testid={dataTestId}
        >
          {visibleItems}

          {/* Overflow button */}
          {hasOverflow && (
            <div ref={overflowBtnRef} className="shrink-0">
              <Button
                design="SecondaryNeutral"
                size="Medium"
                iconOnly
                icon={<OverflowIcon className="h-4 w-4" />}
                accessibleName={t("TOOLBAR_MORE_ACTIONS")}
                onClick={handleOverflowClick}
                accessibilityAttributes={{
                  expanded: overflowOpen,
                  hasPopup: "menu",
                }}
              />
            </div>
          )}

          {accessibleDescription && (
            <span id={descriptionId} className="sr-only">
              {accessibleDescription}
            </span>
          )}
        </div>

        {/* Overflow popover */}
        {hasOverflow && (
          <Popover
            open={overflowOpen}
            opener={overflowBtnRef}
            placement="Bottom"
            horizontalAlign="End"
            hideArrow
            noPadding
            onClose={closeOverflow}
            accessibleRole="None"
          >
            <ToolbarContext.Provider
              value={{ isInOverflow: true, closeOverflow }}
            >
              <div
                className="flex flex-col w-56 px-sapphire-2xs"
              >
                {overflowedItems}
              </div>
            </ToolbarContext.Provider>
          </Popover>
        )}

        {/* Hidden measurement container */}
        <div
          ref={measureRef}
          aria-hidden="true"
          className="absolute invisible -top-[9999px] -left-[9999px] flex items-center gap-2 w-fit"
          style={{ pointerEvents: "none" }}
        >
          <ToolbarContext.Provider value={{ isInOverflow: false, closeOverflow }}>
            {flatItems.map((child, i) => (
              <div key={i} data-measure={i} className="shrink-0">
                {child}
              </div>
            ))}
          </ToolbarContext.Provider>
        </div>
      </>
    );
}
