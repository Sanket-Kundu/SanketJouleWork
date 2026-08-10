import { createContext, useContext } from "react";
import { IllustrationSize } from "../../types/illustrated-message";

/**
 * Context that provides the resolved illustration size from IllustratedMessage
 * to illustration children. Illustrations read this to auto-select the correct
 * SVG size variant.
 */
export const IllustrationSizeContext = createContext<IllustrationSize>(
  IllustrationSize.Medium
);

/**
 * Hook to read the current illustration size from context.
 * Used by illustration components created via createIllustration.
 */
export function useIllustrationSizeContext(): IllustrationSize {
  return useContext(IllustrationSizeContext);
}
