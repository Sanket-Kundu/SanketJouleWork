import React, {
  useRef,
  useState,
  useCallback,
  useEffect,
  useLayoutEffect,
  useImperativeHandle,
  Children,
  isValidElement,
  cloneElement,
} from "react";
import { cn, subTestId } from "../../lib/utils";
import { useTranslation } from "react-i18next";
import type {
  TokenizerProps,
} from "../../types/tokenizer";
import type {
  TokenInternalProps,
  TokenSelectEventDetail,
  TokenDeleteEventDetail,
} from "../../types/token";
import { Token } from "./Token";
import { ResponsivePopover } from "../responsive-popover/ResponsivePopover";
import { List } from "../list/List";
import { ListItem } from "../list/ListItem";
import { Button } from "../button/Button";
import { DeclineIcon } from "../../icons/Decline";

/**
 * Recursively flatten React Fragments so tokens wrapped in <>…</> are found.
 * See CLAUDE.md — Children.toArray does NOT flatten Fragments.
 */
const flattenChildren = (nodes: React.ReactNode): React.ReactElement[] => {
  const result: React.ReactElement[] = [];
  Children.forEach(nodes, (child) => {
    if (!isValidElement(child)) return;
    if (child.type === React.Fragment) {
      result.push(...flattenChildren((child.props as { children: React.ReactNode }).children));
    } else {
      result.push(child);
    }
  });
  return result;
};

/**
 * Tokenizer component
 *
 * A container that manages Token children in a single row,
 * handling keyboard navigation, selection, overflow, and deletion.
 *
 * Overflow strategy: an off-screen measurement div renders all tokens to
 * capture their natural widths. A ResizeObserver on the visible container
 * detects available width. On every change we compute how many tokens fit
 * alongside the "n more" indicator and only render those in the visible row.
 */
export function Tokenizer({
  children,
  readonly = false,
  disabled = false,
  multiLine: controlledMultiLine,
  showClearAll = false,
  onTokenDelete,
  onSelectionChange,
  onNMoreClick,
  accessibleName,
  accessibleNameRef,
  className,
  style,
  id,
  "data-testid": dataTestId,
  ref,
}: TokenizerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const nMoreRef = useRef<HTMLSpanElement>(null);
    const selectionAnchorRef = useRef<number>(-1);
    const skipNextFocusRef = useRef(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
    const [visibleCount, setVisibleCount] = useState<number | null>(null); // null = show all (not yet measured)
    const [internalExpanded] = useState(false);
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [liveAnnouncement, setLiveAnnouncement] = useState("");
    const { t } = useTranslation("fx");

    const expanded = controlledMultiLine ?? internalExpanded;

    // Collect Token children (flatten Fragments first)
    const tokens = flattenChildren(children).filter(
      (child) => child.type === Token
    ) as React.ReactElement<TokenInternalProps>[];

    const tokenCount = tokens.length;
    const effectiveVisible = expanded ? tokenCount : (visibleCount ?? tokenCount);
    const nMoreCount = tokenCount - effectiveVisible;

    useImperativeHandle(
      ref,
      () => ({
        focus() {
          const idx = focusedIndex >= 0 ? focusedIndex : 0;
          setFocusedIndex(idx);
          const el = contentRef.current?.children[idx] as HTMLElement | undefined;
          el?.focus();
        },
        focusLast() {
          const lastIdx = effectiveVisible - 1;
          if (lastIdx >= 0) {
            skipNextFocusRef.current = true;
            setFocusedIndex(lastIdx);
            const el = contentRef.current?.children[lastIdx] as HTMLElement | undefined;
            el?.focus();
          }
        },
        blur() {
          (document.activeElement as HTMLElement)?.blur();
        },
        isFocused() {
          return contentRef.current?.contains(document.activeElement) ?? false;
        },
        get nativeElement() {
          return containerRef.current;
        },
      }),
      [focusedIndex, effectiveVisible]
    );

    // ─── Overflow detection ───────────────────────────────────────────
    // Strategy: on mount and resize, we temporarily render all tokens in
    // the content div (by setting visibleCount=null), measure their widths
    // in a useLayoutEffect, then immediately set the correct visibleCount
    // before the browser paints. This avoids a separate measurement div.
    const tokenWidthsRef = useRef<number[]>([]);
    const needsMeasureRef = useRef(true);
    const zeroWidthRetriesRef = useRef(0);

    // When token count changes, request a re-measure
    useEffect(() => {
      needsMeasureRef.current = true;
      zeroWidthRetriesRef.current = 0;
      setVisibleCount(null); // show all tokens temporarily for measurement
    }, [tokenCount]);

    /**
     * Measure token widths from the DOM and compute how many fit.
     * Called from useLayoutEffect (synchronous) and from rAF retries
     * when the container or tokens had zero width on a previous attempt.
     */
    const measureAndRecalculate = useCallback(() => {
      if (expanded || !contentRef.current || !containerRef.current) return;

      // --- Phase 1: Measure token widths (if needed) ---
      if (needsMeasureRef.current || tokenWidthsRef.current.length !== tokenCount) {
        const content = contentRef.current;
        const tokenEls = Array.from(content.children).filter(
          (el) => el.getAttribute("data-part") === "root"
        ) as HTMLElement[];

        const widths = tokenEls.map((el) => el.getBoundingClientRect().width);

        // If widths are all zero the container isn't laid out yet —
        // schedule a retry after the next frame (max 10 attempts).
        if (widths.length > 0 && widths.every((w) => w === 0)) {
          if (zeroWidthRetriesRef.current < 10) {
            zeroWidthRetriesRef.current++;
            requestAnimationFrame(measureAndRecalculate);
          }
          return;
        }

        tokenWidthsRef.current = widths;
        needsMeasureRef.current = false;
      }

      // --- Phase 2: Calculate how many tokens fit ---
      const availableWidth = containerRef.current.getBoundingClientRect().width;
      if (availableWidth === 0) {
        // Container not yet laid out — retry after the next frame (max 10 attempts)
        if (zeroWidthRetriesRef.current < 10) {
          zeroWidthRetriesRef.current++;
          requestAnimationFrame(measureAndRecalculate);
        }
        return;
      }
      zeroWidthRetriesRef.current = 0;

      const widths = tokenWidthsRef.current;
      if (widths.length === 0) {
        setVisibleCount(null);
        return;
      }

      const gap = 4;

      // Check if all tokens fit
      let total = 0;
      for (let i = 0; i < widths.length; i++) {
        total += widths[i] + (i > 0 ? gap : 0);
      }
      if (total <= availableWidth) {
        setVisibleCount(null);
        return;
      }

      // Not all fit — find how many fit alongside "n more"
      const nMoreEl = nMoreRef.current;
      const nMoreWidth = nMoreEl
        ? nMoreEl.getBoundingClientRect().width + gap
        : 50;

      let used = 0;
      let fits = 0;
      for (let i = 0; i < widths.length; i++) {
        const needed = widths[i] + (i > 0 ? gap : 0);
        if (used + needed + nMoreWidth > availableWidth) break;
        used += needed;
        fits++;
      }

      setVisibleCount(fits);
    }, [expanded, tokenCount]);

    useLayoutEffect(() => {
      if (expanded || !contentRef.current || !containerRef.current) {
        setVisibleCount(null);
        return;
      }
      measureAndRecalculate();
    });

    // ResizeObserver to recalculate on container resize.
    // We observe both the container AND its parent because when tokens
    // overflow the Tokenizer shrinks and its own width stops changing,
    // so only the parent's resize can tell us space became available.
    const lastParentWidthRef = useRef(0);

    useEffect(() => {
      if (expanded || !containerRef.current) return;

      const container = containerRef.current;
      const parent = container.parentElement;
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.target === parent) {
            const newWidth = entry.contentRect.width;
            const grew = newWidth > lastParentWidthRef.current;
            lastParentWidthRef.current = newWidth;

            if (grew && visibleCount !== null) {
              // Parent grew while tokens are overflowed — show all tokens
              // so the layout effect can re-measure the correct visible count.
              needsMeasureRef.current = true;
              zeroWidthRetriesRef.current = 0;
              setVisibleCount(null);
              return;
            }
          }
        }
        requestAnimationFrame(measureAndRecalculate);
      });

      observer.observe(container);
      if (parent) {
        lastParentWidthRef.current = parent.getBoundingClientRect().width;
        observer.observe(parent);
      }
      return () => observer.disconnect();
    }, [expanded, measureAndRecalculate, visibleCount]);

    // ─── Callbacks ────────────────────────────────────────────────────

    const handleNMoreClick = useCallback(() => {
      if (onNMoreClick) {
        onNMoreClick();
      } else {
        setPopoverOpen((prev) => !prev);
      }
    }, [onNMoreClick]);

    const handleTokenSelect = useCallback(
      (index: number, detail: TokenSelectEventDetail) => {
        if (disabled) return;
        setSelectedIndices((prev) => {
          const next = new Set(prev);
          if (detail.selected) {
            next.add(index);
          } else {
            next.delete(index);
          }
          return next;
        });
        setFocusedIndex(index);
        selectionAnchorRef.current = -1;
      },
      [disabled]
    );

    useEffect(() => {
      onSelectionChange?.({ selectedIndices: Array.from(selectedIndices) });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedIndices]);

    useEffect(() => {
      if (selectedIndices.size > 0) {
        setLiveAnnouncement(
          t("TOKENIZER_TOKENS_SELECTED", { count: selectedIndices.size })
        );
      }
    }, [selectedIndices, t]);

    useEffect(() => {
      if (tokenCount > 0) {
        setLiveAnnouncement(
          t("TOKENIZER_TOKEN_COUNT", { count: tokenCount })
        );
      }
    }, [tokenCount, t]);

    const handleTokenDelete = useCallback(
      (index: number, _detail: TokenDeleteEventDetail) => {
        if (disabled) return;
        onTokenDelete?.({ tokens: [index] });
        const nextIndex = tokenCount <= 1 ? -1 : index >= tokenCount - 1 ? Math.max(0, index - 1) : index;
        setFocusedIndex(nextIndex);
        if (nextIndex >= 0) {
          requestAnimationFrame(() => {
            const el = contentRef.current?.children[nextIndex] as HTMLElement | undefined;
            el?.focus();
          });
        }
      },
      [disabled, onTokenDelete, tokenCount]
    );

    const handlePopoverTokenDelete = useCallback(
      (originalIndex: number) => {
        if (disabled || readonly) return;
        onTokenDelete?.({ tokens: [originalIndex] });
      },
      [disabled, readonly, onTokenDelete]
    );

    const handleClearAll = useCallback(() => {
      if (disabled || readonly) return;
      const allIndices = Array.from({ length: tokenCount }, (_, i) => i);
      onTokenDelete?.({ tokens: allIndices });
      setSelectedIndices(new Set());
    }, [disabled, readonly, onTokenDelete, tokenCount]);

    const scrollTokenIntoView = useCallback((index: number) => {
      const el = contentRef.current?.children[index] as HTMLElement | undefined;
      el?.scrollIntoView?.({ block: "nearest", inline: "nearest" });
    }, []);

    // ─── Keyboard ─────────────────────────────────────────────────────

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (disabled || tokenCount === 0) return;

        const visCount = expanded ? tokenCount : effectiveVisible;

        switch (e.key) {
          case "ArrowRight":
          case "ArrowDown": {
            e.preventDefault();
            const next = Math.min((focusedIndex < 0 ? 0 : focusedIndex) + 1, visCount - 1);
            if (e.shiftKey) {
              if (selectionAnchorRef.current < 0) {
                selectionAnchorRef.current = focusedIndex >= 0 ? focusedIndex : 0;
              }
              const anchor = selectionAnchorRef.current;
              const start = Math.min(anchor, next);
              const end = Math.max(anchor, next);
              const range = new Set<number>();
              for (let i = start; i <= end; i++) range.add(i);
              setSelectedIndices(range);
            } else {
              selectionAnchorRef.current = -1;
            }
            setFocusedIndex(next);
            const el = contentRef.current?.children[next] as HTMLElement | undefined;
            el?.focus();
            scrollTokenIntoView(next);
            break;
          }
          case "ArrowLeft":
          case "ArrowUp": {
            e.preventDefault();
            if (focusedIndex < 0) break;
            const prev = Math.max(focusedIndex - 1, 0);
            if (e.shiftKey) {
              if (selectionAnchorRef.current < 0) {
                selectionAnchorRef.current = focusedIndex;
              }
              const anchor = selectionAnchorRef.current;
              const start = Math.min(anchor, prev);
              const end = Math.max(anchor, prev);
              const range = new Set<number>();
              for (let i = start; i <= end; i++) range.add(i);
              setSelectedIndices(range);
            } else {
              selectionAnchorRef.current = -1;
            }
            setFocusedIndex(prev);
            const el = contentRef.current?.children[prev] as HTMLElement | undefined;
            el?.focus();
            scrollTokenIntoView(prev);
            break;
          }
          case "Home": {
            e.preventDefault();
            selectionAnchorRef.current = -1;
            setFocusedIndex(0);
            const el = contentRef.current?.children[0] as HTMLElement | undefined;
            el?.focus();
            scrollTokenIntoView(0);
            break;
          }
          case "End": {
            e.preventDefault();
            selectionAnchorRef.current = -1;
            const lastIdx = visCount - 1;
            setFocusedIndex(lastIdx);
            const el = contentRef.current?.children[lastIdx] as HTMLElement | undefined;
            el?.focus();
            scrollTokenIntoView(lastIdx);
            break;
          }
          case "a":
          case "A": {
            if (e.ctrlKey || e.metaKey) {
              e.preventDefault();
              if (selectedIndices.size === tokenCount) {
                setSelectedIndices(new Set());
              } else {
                setSelectedIndices(new Set(Array.from({ length: tokenCount }, (_, i) => i)));
              }
            }
            break;
          }
          case "c":
          case "C": {
            if (e.ctrlKey || e.metaKey) {
              const selectedTexts = tokens
                .filter((_, i) => selectedIndices.has(i))
                .map((t) => t.props.text);
              if (selectedTexts.length > 0) {
                navigator.clipboard.writeText(selectedTexts.join("\r\n"));
              }
            }
            break;
          }
          case "x":
          case "X": {
            if ((e.ctrlKey || e.metaKey) && !readonly) {
              const selectedTexts = tokens
                .filter((_, i) => selectedIndices.has(i))
                .map((t) => t.props.text);
              if (selectedTexts.length > 0) {
                navigator.clipboard.writeText(selectedTexts.join("\r\n"));
                onTokenDelete?.({ tokens: Array.from(selectedIndices).sort((a, b) => a - b) });
                setSelectedIndices(new Set());
              }
            }
            break;
          }
          case "Backspace":
          case "Delete": {
            if (readonly || disabled) break;
            if (selectedIndices.size > 1) {
              e.preventDefault();
              e.stopPropagation();
              const sorted = Array.from(selectedIndices).sort((a, b) => a - b);
              onTokenDelete?.({ tokens: sorted });
              setSelectedIndices(new Set());
              const nextIdx = Math.min(sorted[0], tokenCount - sorted.length - 1);
              if (nextIdx >= 0) {
                setFocusedIndex(nextIdx);
                requestAnimationFrame(() => {
                  const el = contentRef.current?.children[nextIdx] as HTMLElement | undefined;
                  el?.focus();
                });
              }
            }
            break;
          }
        }
      },
      [disabled, readonly, tokenCount, effectiveVisible, focusedIndex, expanded, selectedIndices, tokens, onTokenDelete, scrollTokenIntoView]
    );

    const handleFocus = useCallback(
      (e: React.FocusEvent<HTMLDivElement>) => {
        if (disabled) return;
        // Skip if focus was set programmatically by focusLast()
        if (skipNextFocusRef.current) {
          skipNextFocusRef.current = false;
          return;
        }
        if (!contentRef.current?.contains(e.relatedTarget as Node)) {
          const idx = focusedIndex >= 0 && focusedIndex < effectiveVisible ? focusedIndex : 0;
          setFocusedIndex(idx);
        }
      },
      [disabled, focusedIndex, effectiveVisible]
    );

    // ─── Build token elements ─────────────────────────────────────────

    // Visible tokens — rendered in the interactive content div
    const visibleTokens = tokens.slice(0, effectiveVisible).map((token, index) => {
      return cloneElement(token, {
        key: token.key ?? index,
        tabIndex: index === focusedIndex ? 0 : -1,
        readonly: readonly || token.props.readonly,
        selected: selectedIndices.has(index) || token.props.selected,
        singleToken: tokenCount === 1,
        onSelect: (detail: TokenSelectEventDetail) => {
          token.props.onSelect?.(detail);
          handleTokenSelect(index, detail);
        },
        onDelete: (detail: TokenDeleteEventDetail) => {
          token.props.onDelete?.(detail);
          handleTokenDelete(index, detail);
        },
      });
    });

    const showNMore = !expanded && nMoreCount > 0;

    // ─── Render ───────────────────────────────────────────────────────

    return (
      <div
        ref={containerRef}
        id={id}
        className={cn(
          "box-border",
          expanded ? "inline-flex flex-wrap items-start" : "flex items-center h-9",
          disabled && "opacity-40 pointer-events-none",
          className
        )}
        style={style}
        data-testid={dataTestId}
        data-part="tokenizer-root"
      >
        {/* Visible content — only the tokens that fit */}
        <div
          ref={contentRef}
          role="listbox"
          aria-label={accessibleName}
          aria-labelledby={accessibleNameRef}
          aria-disabled={disabled || undefined}
          aria-readonly={readonly || undefined}
          aria-orientation="horizontal"
          aria-roledescription="Tokenizer"
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          className={cn(
            "flex items-center gap-1 box-border",
            expanded
              ? "flex-wrap"
              : "flex-nowrap h-full min-w-0 flex-1",
            tokenCount === 1 && !expanded && "max-w-full flex-1 pr-1"
          )}
          data-part="content"
        >
          {visibleTokens}
          {expanded && showClearAll && tokenCount > 0 && !readonly && !disabled && (
            <span
              role="button"
              tabIndex={0}
              onClick={handleClearAll}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleClearAll();
                }
              }}
              className={cn(
                "cursor-pointer whitespace-nowrap outline-none self-center",
                "text-sm font-normal text-sapphire-brand-foreground",
                "hover:underline active:no-underline"
              )}
              data-part="clear-all"
            >
              {t("TOKENIZER_CLEAR_ALL")}
            </span>
          )}
        </div>

        {/* "N More" indicator */}
        {showNMore && (
          <>
            <span
              ref={nMoreRef}
              role="button"
              tabIndex={0}
              aria-haspopup="dialog"
              onClick={handleNMoreClick}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleNMoreClick();
                }
              }}
              className={cn(
                "inline-block ml-1 cursor-pointer whitespace-nowrap flex-shrink-0",
                "text-sm font-normal text-sapphire-brand-foreground",
                "hover:underline active:no-underline"
              )}
              data-part="n-more"
              data-testid={subTestId(dataTestId, "nmore")}
            >
              {t("TOKENIZER_SHOW_MORE", { count: nMoreCount })}
            </span>
            {/* Built-in overflow popover — suppressed when parent handles onNMoreClick */}
            {!onNMoreClick && (
            <ResponsivePopover
              opener={containerRef}
              open={popoverOpen}
              onClose={() => setPopoverOpen(false)}
              placement="Bottom"
              noPadding
            >
              <List
                selectionMode={readonly ? "None" : "Delete"}
                onItemDelete={(detail) => {
                  const originalIndex = Number(detail.item.id);
                  if (!isNaN(originalIndex)) {
                    handlePopoverTokenDelete(originalIndex);
                  }
                }}
                className={cn(
                  "[&_li]:!min-h-8 [&_li]:!h-8 [&_li]:relative [&_li_>_span]:!py-1",
                  "[&_li]:!ring-0 [&_li]:!shadow-none",
                  "[&_li:focus]:after:absolute [&_li:focus]:after:inset-0.5 [&_li:focus]:after:border-2 [&_li:focus]:after:border-ring [&_li:focus]:after:rounded-sm [&_li:focus]:after:pointer-events-none",
                )}
                items={tokens.map((t, i) => ({
                  id: String(i),
                  text: t.props.text || "",
                }))}
                renderItem={(item) => (
                  <ListItem
                    key={item.id}
                    itemKey={item.id}
                    text={item.text}
                    type={readonly ? "Inactive" : "Active"}
                    deleteButton={
                      !readonly ? (
                        <Button
                          design="Tertiary"
                          size="Small"
                          iconOnly
                          icon={<DeclineIcon className="h-3 w-3" />}
                          accessibleName={t("TOKEN_DELETE")}
                          tabIndex={-1}
                        />
                      ) : undefined
                    }
                  />
                )}
              />
            </ResponsivePopover>
            )}
          </>
        )}

        {/* Collapsed-mode Clear All */}
        {!expanded && showClearAll && tokenCount > 0 && !readonly && !disabled && (
          <span
            role="button"
            tabIndex={0}
            onClick={handleClearAll}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleClearAll();
              }
            }}
            className={cn(
              "ml-1 cursor-pointer whitespace-nowrap outline-none flex-shrink-0",
              "text-sm font-normal text-sapphire-brand-foreground",
              "hover:underline active:no-underline"
            )}
            data-part="clear-all"
          >
            {t("TOKENIZER_CLEAR_ALL")}
          </span>
        )}

        {/* Visually hidden live region for accessibility announcements */}
        <div
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
          data-part="live-region"
        >
          {liveAnnouncement}
        </div>
      </div>
    );
}
