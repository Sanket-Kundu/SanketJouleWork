import type React from "react";

/**
 * Per-path metadata for icons with non-default fill/clip rules
 */
export interface PathMeta {
  fillRule?: "evenodd" | "nonzero";
  clipRule?: "evenodd" | "nonzero";
}

/**
 * Icon design variants
 */
export enum IconDesign {
  Default = "Default",
  Contrast = "Contrast",
  Critical = "Critical",
  Information = "Information",
  Positive = "Positive",
  Negative = "Negative",
  Neutral = "Neutral",
  NonInteractive = "NonInteractive",
}

/**
 * Icon mode - determines interaction behavior
 */
export enum IconMode {
  /** Icon is purely decorative */
  Decorative = "Decorative",
  /** Icon has semantic meaning (use with accessibleName) */
  Image = "Image",
  /** Icon is interactive/clickable */
  Interactive = "Interactive",
}

/**
 * Icon click event detail
 */
export interface IconClickDetail {
  /** The original DOM event */
  originalEvent: React.MouseEvent<SVGSVGElement> | React.KeyboardEvent<SVGSVGElement>;
  /** Whether the click was triggered by keyboard */
  isKeyboard: boolean;
}

/**
 * Icon component props
 */
export interface IconProps {
  /** Ref for imperative access */
  ref?: React.Ref<IconRef>;

  /**
   * SVG path data for the icon.
   * @internal Provided by generated icon components.
   */
  pathData?: readonly string[];

  /**
   * Custom viewBox for the SVG.
   * @default "0 0 512 512"
   */
  viewBox?: string;

  /**
   * Per-path metadata (fillRule, clipRule) indexed by path position.
   * @internal Used by icon components with non-default fill rules.
   */
  pathMeta?: readonly (PathMeta | undefined)[];

  /**
   * Visual design variant
   * @default IconDesign.Default
   */
  design?: IconDesign | `${IconDesign}`;

  /**
   * Interaction mode
   * @default IconMode.Decorative
   */
  mode?: IconMode | `${IconMode}`;

  /**
   * Accessible name for screen readers (required for Image and Interactive modes)
   */
  accessibleName?: string;

  /**
   * Whether to show tooltip on hover (uses accessibleName as tooltip text)
   * @default false
   */
  showTooltip?: boolean;

  /**
   * Click handler (only works when mode is Interactive)
   */
  onClick?: (detail: IconClickDetail) => void;

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Inline styles
   */
  style?: React.CSSProperties;

  /**
   * Element ID
   */
  id?: string;

  /**
   * Test ID for testing
   */
  "data-testid"?: string;
}

/**
 * Icon component ref
 */
export interface IconRef {
  focus(): void;
  blur(): void;
  isFocused(): boolean;
  readonly nativeElement: SVGSVGElement | null;
}
