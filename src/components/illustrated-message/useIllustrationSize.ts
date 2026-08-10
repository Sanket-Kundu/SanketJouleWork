import { useState, useEffect } from "react";
import {
  IllustrationDesign,
  IllustrationSize,
} from "../../types/illustrated-message";

/**
 * Hook that resolves the illustration size based on container width (Auto mode)
 * or a fixed design prop.
 *
 * Breakpoints (Auto mode):
 * - >681px  -> Large
 * - <=681px -> Medium
 * - <=360px -> Small
 * - <=260px -> ExtraSmall
 * - <=160px -> Base
 */
export function useIllustrationSize(
  containerRef: React.RefObject<HTMLDivElement | null>,
  design: IllustrationDesign | string
): IllustrationSize {
  const isAuto = design === IllustrationDesign.Auto || design === "Auto";

  const [resolvedSize, setResolvedSize] = useState<IllustrationSize>(
    isAuto ? IllustrationSize.Medium : (design as IllustrationSize)
  );

  useEffect(() => {
    if (!isAuto) {
      setResolvedSize(design as IllustrationSize);
      return;
    }

    const el = containerRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;

    const ro = new ResizeObserver(([entry]) => {
      const width =
        entry.contentBoxSize?.[0]?.inlineSize ?? entry.contentRect.width;

      let newSize: IllustrationSize;
      if (width <= 160) {
        newSize = IllustrationSize.Base;
      } else if (width <= 260) {
        newSize = IllustrationSize.ExtraSmall;
      } else if (width <= 360) {
        newSize = IllustrationSize.Small;
      } else if (width <= 681) {
        newSize = IllustrationSize.Medium;
      } else {
        newSize = IllustrationSize.Large;
      }

      setResolvedSize((prev) => (prev !== newSize ? newSize : prev));
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, [design, isAuto, containerRef]);

  return resolvedSize;
}
