import React from "react";

/**
 * Title level types - maps to HTML heading levels
 */
export enum TitleLevel {
  H1 = "H1",
  H2 = "H2",
  H3 = "H3",
  H4 = "H4",
  H5 = "H5",
  H6 = "H6",
}

/**
 * Title wrapping type
 */
export enum TitleWrappingType {
  None = "None",
  Normal = "Normal",
}

/**
 * Title props interface
 */
export interface TitleProps {
  /** Ref for imperative access */
  ref?: React.Ref<HTMLHeadingElement>;
  /** Heading level (H1-H6) */
  level?: TitleLevel | `${TitleLevel}`;
  /** Text wrapping behavior */
  wrappingType?: TitleWrappingType | `${TitleWrappingType}`;
  /** Title content */
  children?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** HTML id attribute */
  id?: string;
  /** Forwarded to the rendered heading element for test selectors. */
  "data-testid"?: string;
}
