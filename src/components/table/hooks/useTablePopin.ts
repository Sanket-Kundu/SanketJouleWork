import { useState, useEffect, useCallback, useLayoutEffect, useRef } from "react";
import type { ColumnMeta } from "../TableContext";

export interface UseTablePopinOptions {
  columnsMeta: ColumnMeta[];
  enabled: boolean;
  containerRef: React.RefObject<HTMLElement | null>;
  reservedWidth?: number;
}

export interface UseTablePopinReturn {
  visibleIndices: number[];
  popinIndices: number[];
  isPopinActive: boolean;
  containerWidth: number;
  recalculate: () => void;
}

function parseWidth(width?: string): number {
  if (!width) return 150;
  const num = parseFloat(width);
  return isNaN(num) ? 150 : num;
}

function calculatePopin(
  columnsMeta: ColumnMeta[],
  availableWidth: number,
  reservedWidth: number,
): { visible: number[]; popin: number[] } {
  if (columnsMeta.length === 0) return { visible: [], popin: [] };

  const spaceForColumns = availableWidth - reservedWidth;
  if (spaceForColumns <= 0) {
    // Show at least the most important column
    const sorted = columnsMeta.map((col, idx) => ({ col, idx }))
      .sort((a, b) => b.col.importance - a.col.importance);
    return {
      visible: [sorted[0].idx],
      popin: sorted.slice(1).filter(({ col }) => !col.popinHidden).map(({ idx }) => idx),
    };
  }

  // Sort by importance (lower = less important = pops in first)
  const indexed = columnsMeta.map((col, idx) => ({ col, idx }));
  const byImportance = [...indexed].sort((a, b) => b.col.importance - a.col.importance);

  let usedWidth = 0;
  const visible: number[] = [];
  const popin: number[] = [];
  let overflowed = false;

  for (const { col, idx } of byImportance) {
    const colWidth = parseWidth(col.width || col.minWidth);
    if (!overflowed && usedWidth + colWidth <= spaceForColumns) {
      visible.push(idx);
      usedWidth += colWidth;
    } else {
      overflowed = true;
      if (!col.popinHidden) {
        popin.push(idx);
      }
    }
  }

  // Keep original column order
  visible.sort((a, b) => a - b);
  popin.sort((a, b) => a - b);

  // Ensure at least one column is visible
  if (visible.length === 0 && columnsMeta.length > 0) {
    const mostImportant = byImportance[0].idx;
    visible.push(mostImportant);
    const popinIdx = popin.indexOf(mostImportant);
    if (popinIdx !== -1) popin.splice(popinIdx, 1);
  }

  return { visible, popin };
}

export function useTablePopin(options: UseTablePopinOptions): UseTablePopinReturn {
  const { columnsMeta, enabled, containerRef, reservedWidth = 0 } = options;
  const [containerWidth, setContainerWidth] = useState(0);
  const observerRef = useRef<ResizeObserver | null>(null);

  const allIndices = columnsMeta.map((_col, idx) => idx);

  const recalculate = useCallback(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.clientWidth);
    }
  }, [containerRef]);

  // Initial measurement
  useLayoutEffect(() => {
    if (enabled && containerRef.current) {
      setContainerWidth(containerRef.current.clientWidth);
    }
  }, [enabled, containerRef]);

  // ResizeObserver
  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    observer.observe(containerRef.current);
    observerRef.current = observer;

    return () => {
      observer.disconnect();
      observerRef.current = null;
    };
  }, [enabled, containerRef]);

  if (!enabled || containerWidth === 0) {
    return {
      visibleIndices: allIndices,
      popinIndices: [],
      isPopinActive: false,
      containerWidth,
      recalculate,
    };
  }

  const { visible, popin } = calculatePopin(columnsMeta, containerWidth, reservedWidth);

  return {
    visibleIndices: visible,
    popinIndices: popin,
    isPopinActive: popin.length > 0,
    containerWidth,
    recalculate,
  };
}
