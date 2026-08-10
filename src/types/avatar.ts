import React from "react";

/**
 * Avatar shape types
 */
export enum AvatarShape {
  Circle = "Circle",
  Square = "Square",
}

/**
 * Avatar size types
 */
export enum AvatarSize {
  XS = "XS",
  S = "S",
  M = "M",
  L = "L",
  XL = "XL",
}

/**
 * Avatar color scheme types
 */
export enum AvatarColorScheme {
  Accent1 = "Accent1",
  Accent2 = "Accent2",
  Accent3 = "Accent3",
  Accent4 = "Accent4",
  Accent5 = "Accent5",
  Accent6 = "Accent6",
  Accent7 = "Accent7",
  Accent8 = "Accent8",
  Accent9 = "Accent9",
  Accent10 = "Accent10",
  Placeholder = "Placeholder",
}

/**
 * Avatar props interface
 */
export interface AvatarProps {
  /** Ref for imperative access */
  ref?: React.Ref<AvatarRef>;
  /** Shape of the avatar */
  shape?: AvatarShape | `${AvatarShape}`;
  /** Size of the avatar */
  size?: AvatarSize | `${AvatarSize}`;
  /** Color scheme for background when no image */
  colorScheme?: AvatarColorScheme | `${AvatarColorScheme}`;
  /** Icon to display (React node) */
  icon?: React.ReactNode;
  /** Image source URL */
  image?: string;
  /** Fallback image URL */
  fallbackImage?: string;
  /** Initials to display (1-3 characters) */
  initials?: string;
  /** Interactive avatar (clickable) */
  interactive?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Toggled (selected) state — shows an active border */
  toggled?: boolean;
  /** Accessible name */
  accessibleName?: string;
  /** Badge content (shown as indicator) */
  badge?: React.ReactNode;
  /** Click handler */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Forwarded to the root element for test selectors. */
  "data-testid"?: string;
}

/**
 * Avatar ref interface
 */
export interface AvatarRef {
  /** Focus the avatar */
  focus: () => void;
  /** Check if focused */
  isFocused: () => boolean;
  /** Access native DOM element */
  readonly nativeElement: HTMLDivElement | null;
  /** @deprecated Use nativeElement instead */
  getNativeElement: () => HTMLDivElement | null;
}
