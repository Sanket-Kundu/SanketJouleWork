import React from "react";

export enum TextEmptyIndicatorMode {
  Off = "Off",
  On = "On",
}

export interface TextProps {
  /** Ref for imperative access */
  ref?: React.Ref<TextRef>;
  /** Max visible lines (0 = unlimited). Uses CSS line-clamp. */
  maxLines?: number;
  /** Show "\u2013" indicator when content is empty */
  emptyIndicatorMode?: TextEmptyIndicatorMode | `${TextEmptyIndicatorMode}`;
  /** Text content */
  children?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Forwarded to the root <span> element for test selectors. */
  "data-testid"?: string;
}

export interface TextRef {
  /** Focus the text element */
  focus(): void;
  /** Access the underlying DOM element */
  nativeElement: HTMLSpanElement | null;
}
