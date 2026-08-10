import React, { ReactNode } from "react";

/**
 * Size variants for the BusyIndicator dots
 */
export enum BusyIndicatorSize {
  /** Small dots (0.5rem) */
  S = "S",
  /** Medium dots (1rem) - default */
  M = "M",
  /** Large dots (2rem) */
  L = "L",
}

/**
 * Placement of the text label relative to the animated dots
 */
export enum BusyIndicatorTextPlacement {
  /** Text appears above the dots */
  Top = "Top",
  /** Text appears below the dots (default) */
  Bottom = "Bottom",
}

/**
 * BusyIndicator ref methods for imperative control
 */
export interface BusyIndicatorRef {
  /** Focus the busy indicator (overlay when busy, root otherwise) */
  focus(): void;
  /** Blur the busy indicator */
  blur(): void;
  /** Check if the busy indicator is focused */
  isFocused(): boolean;
  /** Access the native root element */
  readonly nativeElement: HTMLDivElement | null;
}

/**
 * Props for the BusyIndicator component
 */
export interface BusyIndicatorProps {
  /** Ref for imperative access */
  ref?: React.Ref<BusyIndicatorRef>;
  // === Visual ===
  /**
   * Size of the animated dots.
   * @default "M"
   */
  size?: BusyIndicatorSize | `${BusyIndicatorSize}`;
  /**
   * Placement of the text label relative to the dots.
   * @default "Bottom"
   */
  textPlacement?: BusyIndicatorTextPlacement | `${BusyIndicatorTextPlacement}`;
  /**
   * When true, renders dots in the Joule purple color scheme
   * instead of the default blue.
   * @default false
   */
  joule?: boolean;

  // === Behavior ===
  /**
   * Whether the busy indicator is active. The visual indicator
   * appears after the configured `delay` has elapsed.
   * @default false
   */
  active?: boolean;
  /**
   * Delay in milliseconds before showing the busy indicator
   * after `active` becomes true. Prevents flashing for quick operations.
   * @default 1000
   */
  delay?: number;

  // === Content ===
  /**
   * Text displayed alongside the animated dots (above or below,
   * depending on `textPlacement`).
   */
  text?: string;
  /**
   * Content over which the busy overlay appears.
   * When children are present and the indicator is active,
   * the content is dimmed and an overlay is displayed on top.
   * When no children are present, the dots render inline.
   */
  children?: ReactNode;

  // === Accessibility ===
  /**
   * Accessible name for the busy indicator (aria-label).
   * Used when no `text` prop is provided.
   */
  accessibleName?: string;

  // === Standard HTML ===
  /** Additional class names */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Element ID */
  id?: string;
  /** Data attributes for testing */
  "data-testid"?: string;
}
