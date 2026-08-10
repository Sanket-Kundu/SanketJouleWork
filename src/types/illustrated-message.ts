import type * as React from "react";

/**
 * Design (size mode) for the IllustratedMessage component.
 * Controls whether the component auto-sizes or uses a fixed size.
 */
export enum IllustrationDesign {
  /** Automatically selects size based on container width */
  Auto = "Auto",
  /** No illustration shown (<=160px equivalent) */
  Base = "Base",
  /** Extra small - 45x45 SVG, horizontal layout */
  ExtraSmall = "ExtraSmall",
  /** Small - 128x128 SVG */
  Small = "Small",
  /** Medium - 160x160 SVG */
  Medium = "Medium",
  /** Large - 320x240 SVG */
  Large = "Large",
}

/**
 * Resolved illustration size used internally.
 * Unlike IllustrationDesign, this has no aliases or Auto mode.
 */
export enum IllustrationSize {
  /** No illustration shown */
  Base = "Base",
  /** 45x45 */
  ExtraSmall = "ExtraSmall",
  /** 128x128 */
  Small = "Small",
  /** 160x160 */
  Medium = "Medium",
  /** 320x240 */
  Large = "Large",
}

/**
 * Props for the IllustratedMessage component.
 */
export interface IllustratedMessageProps {
  /** Ref for imperative access */
  ref?: React.Ref<IllustratedMessageRef>;

  /** Illustration component to render (e.g., <BeforeSearch />) */
  illustration?: React.ReactNode;

  /** Size design - "Auto" (default) uses responsive breakpoints */
  design?: IllustrationDesign | `${IllustrationDesign}`;

  /** Title text */
  titleText?: string;

  /** Subtitle text */
  subtitleText?: string;

  /** Custom title slot (overrides titleText) */
  title?: React.ReactNode;

  /** Custom subtitle slot (overrides subtitleText) */
  subtitle?: React.ReactNode;

  /** Action buttons */
  children?: React.ReactNode;

  /** Makes illustration decorative (aria-hidden) */
  decorative?: boolean;

  /** Accessible name for the component */
  accessibleName?: string;

  /** Additional CSS classes */
  className?: string;

  /** Inline styles */
  style?: React.CSSProperties;

  /** Element ID */
  id?: string;

  /** Test ID */
  "data-testid"?: string;
}

/**
 * Ref interface for IllustratedMessage.
 */
export interface IllustratedMessageRef {
  /** The underlying DOM element */
  readonly nativeElement: HTMLDivElement | null;
}
