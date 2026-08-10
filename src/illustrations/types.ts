import type * as React from "react";
import type { IllustrationDesign } from "../types/illustrated-message";

/**
 * Raw SVG component for a single size variant.
 */
export type SvgComponent = React.FC<{ className?: string }>;

/**
 * Props accepted by illustration components created via createIllustration.
 *
 * Each illustration is a self-contained component that renders an
 * IllustratedMessage internally.
 */
export interface IllustrationProps {
  /** Size design — "Auto" (default) uses responsive breakpoints */
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
 * Metadata embedded in each illustration component.
 */
export interface IllustrationMeta {
  /** Illustration name (e.g., "BeforeSearch", "TntSuccess") */
  name: string;
  /** Default title text */
  title: string;
  /** Default subtitle text */
  subtitle: string;
}

/**
 * The component returned by createIllustration.
 */
export interface IllustrationComponent
  extends React.FC<IllustrationProps> {
  /** Direct access to the ExtraSmall SVG variant (lazy-loaded) */
  ExtraSmall: SvgComponent;
  /** Direct access to the Small SVG variant (lazy-loaded) */
  Small: SvgComponent;
  /** Direct access to the Medium SVG variant (lazy-loaded) */
  Medium: SvgComponent;
  /** Direct access to the Large SVG variant (lazy-loaded) */
  Large: SvgComponent;
  /** Illustration metadata */
  metadata: IllustrationMeta;
  displayName: string;
}
