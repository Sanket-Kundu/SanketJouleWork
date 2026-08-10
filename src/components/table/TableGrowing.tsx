import React, { useState, useCallback, useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";
import { useTranslation } from "react-i18next";
import type { TableGrowingProps } from "../../types/table";
import { useTableContext } from "./TableContext";
import { findVerticalScrollContainer } from "./table-utils";

function TableGrowingInner(
  { mode = "Button", text, subtext, onLoadMore }: TableGrowingProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const ctx = useTableContext();
  const [isLoading, setIsLoading] = useState(false);
  const [activeState, setActiveState] = useState(false);
  const isLoadingRef = useRef(false);
  const onLoadMoreRef = useRef(onLoadMore);
  onLoadMoreRef.current = onLoadMore;
  const prevDataRowCountRef = useRef(ctx.dataRowCount);
  const endRowRef = useRef<HTMLDivElement>(null);
  const hadFocusRef = useRef(false);
  const { t } = useTranslation("fx");

  // In Scroll mode: true → show button fallback (table not scrollable), false → observe
  const [showButtonFallback, setShowButtonFallback] = useState(mode === "Scroll");

  // ─── Load more (stable callback) ─────────────────────────────────────
  const handleLoadMore = useCallback(async () => {
    if (isLoadingRef.current || !onLoadMoreRef.current) return;
    // Remember if the growing button had focus before data loads and the button may unmount
    const activeEl = document.activeElement as HTMLElement | null;
    hadFocusRef.current = !!activeEl?.hasAttribute("data-growing-button");
    isLoadingRef.current = true;
    setIsLoading(true);
    try {
      await Promise.resolve(onLoadMoreRef.current({}));
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }, []);

  // ─── Button interactions ──────────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setActiveState(true);
        handleLoadMore();
      }
    },
    [handleLoadMore],
  );

  const handleKeyUp = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        setActiveState(false);
      }
    },
    [],
  );

  const handleFocusOut = useCallback(() => setActiveState(false), []);

  const { dataRowCount, setFocusedRow } = ctx;

  // ─── Focus first new row after growing (Button mode only) ─────────────
  useEffect(() => {
    const prevCount = prevDataRowCountRef.current;
    prevDataRowCountRef.current = dataRowCount;

    if (mode !== "Button" && !showButtonFallback) return;
    if (dataRowCount <= prevCount || prevCount === 0) return;

    if (hadFocusRef.current) {
      hadFocusRef.current = false;
      setFocusedRow(prevCount);
    }
  }, [dataRowCount, mode, showButtonFallback, setFocusedRow]);

  // ─── Scroll mode: detect scrollability & observe end row ──────────────
  useEffect(() => {
    if (mode !== "Scroll") return;

    const endRow = endRowRef.current;
    if (!endRow) return;

    // Find the scroll container — the closest ancestor with overflow-y auto/scroll
    const scrollContainer = findVerticalScrollContainer(endRow);
    if (!scrollContainer) return;

    const isScrollable = scrollContainer.scrollHeight > scrollContainer.clientHeight;

    if (!isScrollable) {
      setShowButtonFallback(true);
      return;
    }

    setShowButtonFallback(false);

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && !isLoadingRef.current) {
          handleLoadMore();
        }
      },
      {
        root: scrollContainer,
        rootMargin: "0px 0px 5px 0px",
      },
    );

    observer.observe(endRow);
    return () => observer.disconnect();
  }, [mode, handleLoadMore, dataRowCount]);

  // ─── Shared button renderer ───────────────────────────────────────────
  const buttonText = text ?? t("TABLE_MORE");

  const renderButton = () => (
    <button
      type="button"
      data-growing-button="true"
      aria-label={[buttonText, subtext].filter(Boolean).join(", ")}
      aria-busy={isLoading || undefined}
      onClick={handleLoadMore}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onBlur={handleFocusOut}
      className={cn(
        "flex items-center flex-col cursor-pointer w-full",
        "border-t border-border bg-background rounded-b-lg",
        "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
        "hover:bg-sapphire-neutral-hover-background-2",
        activeState && "bg-sapphire-brand-selected-background",
        isLoading && "opacity-50 pointer-events-none",
      )}
    >
      <span className={cn("pt-3 text-sm font-bold text-sapphire-brand-foreground", !subtext && "pb-3")}>
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          buttonText
        )}
      </span>
      {subtext && (
        <span className="pt-3 pb-3 text-sm text-sapphire-brand-foreground">{subtext}</span>
      )}
      <span className="sr-only">{t("TABLE_MORE_DESCRIPTION")}</span>
    </button>
  );

  // ─── Scroll mode ──────────────────────────────────────────────────────
  if (mode === "Scroll") {
    return (
      <div ref={ref} style={{ gridColumn: "1 / -1" }}>
        {/* Sentinel for IntersectionObserver — must be inside the scroll container's
            overflow area. Rendered via a portal into the table's scroll container. */}
        <div ref={endRowRef} aria-hidden="true" data-growing-sentinel="true" className="h-px" />

        {showButtonFallback
          ? renderButton()
          : isLoading && (
              <div className="flex items-center justify-center py-4 text-sm text-sapphire-text-tertiary">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                {t("TABLE_LOADING_MORE")}
              </div>
            )}
      </div>
    );
  }

  // ─── Button mode ──────────────────────────────────────────────────────
  return (
    <div ref={ref} style={{ gridColumn: "1 / -1" }}>
      {renderButton()}
    </div>
  );
}

export const TableGrowing = React.forwardRef(TableGrowingInner);
TableGrowing.displayName = "TableGrowing";
(TableGrowing as unknown as { _tableRole: string })._tableRole = "Growing";
