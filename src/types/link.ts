import React, { ReactNode } from "react";

/**
 * Link design variants
 */
export enum LinkDesign {
  /** Default link appearance */
  Default = "Default",
  /** Subtle/less prominent link */
  Subtle = "Subtle",
  /** Emphasized/prominent link */
  Emphasized = "Emphasized",
}

/**
 * Link interactive area size
 */
export enum LinkInteractiveAreaSize {
  /** Normal touch target size */
  Normal = "Normal",
  /** Large touch target size (WCAG 2.2 compliant) */
  Large = "Large",
}

/**
 * Link text wrapping behavior
 */
export enum LinkWrappingType {
  /** No wrapping - truncate with ellipsis */
  None = "None",
  /** Normal wrapping */
  Normal = "Normal",
}

/**
 * Link accessible role
 */
export enum LinkAccessibleRole {
  /** Link role (default) */
  Link = "Link",
  /** Button role for links that trigger actions */
  Button = "Button",
}

/**
 * Accessibility attributes for link
 */
export interface LinkAccessibilityAttributes {
  /** Whether the link controls an expanded element */
  expanded?: boolean;
  /** Type of popup the link controls */
  hasPopup?: "menu" | "listbox" | "tree" | "grid" | "dialog" | boolean;
  /** Indicates the current item within a set (e.g., page navigation) */
  current?: "page" | "step" | "location" | "date" | "time" | boolean;
}

/**
 * Event detail for link click events
 */
export interface LinkClickEventDetail {
  /** Original mouse or keyboard event */
  originalEvent: React.MouseEvent<HTMLAnchorElement> | React.KeyboardEvent<HTMLAnchorElement>;
  /** Whether Alt key was pressed */
  altKey: boolean;
  /** Whether Ctrl key was pressed */
  ctrlKey: boolean;
  /** Whether Meta key (Cmd on Mac) was pressed */
  metaKey: boolean;
  /** Whether Shift key was pressed */
  shiftKey: boolean;
  /** Whether activation was via keyboard */
  isKeyboard: boolean;
}

/**
 * Link ref methods for imperative control
 */
export interface LinkRef {
  /** Focus the link */
  focus(): void;
  /** Blur the link */
  blur(): void;
  /** Check if link is focused */
  isFocused(): boolean;
  /** Access native link element */
  readonly nativeElement: HTMLAnchorElement | null;
}

/**
 * Props for the Link component
 */
export interface LinkProps {
  /** Ref for imperative access */
  ref?: React.Ref<LinkRef>;
  // === Visual ===
  /** Link design variant */
  design?: LinkDesign | `${LinkDesign}`;
  /** Interactive area size */
  interactiveAreaSize?: LinkInteractiveAreaSize | `${LinkInteractiveAreaSize}`;

  // === Navigation ===
  /** URL to navigate to */
  href?: string;
  /** Where to open the linked document */
  target?: "_self" | "_blank" | "_parent" | "_top" | string;
  /** Relationship between current document and linked document */
  rel?: string;

  // === Content ===
  /** Link text content */
  children?: ReactNode;
  /** Icon element to display at start */
  icon?: ReactNode;
  /** Icon element to display at end */
  endIcon?: ReactNode;
  /** Tooltip text */
  tooltip?: string;

  // === Behavior ===
  /** Whether the link is disabled */
  disabled?: boolean;
  /** Text wrapping behavior */
  wrappingType?: LinkWrappingType | `${LinkWrappingType}`;

  // === Accessibility ===
  /** Accessible name (aria-label) */
  accessibleName?: string;
  /** ID of labelling element (aria-labelledby) */
  accessibleNameRef?: string;
  /** Accessible description (aria-describedby) */
  accessibleDescription?: string;
  /** Link accessible role */
  accessibleRole?: LinkAccessibleRole | `${LinkAccessibleRole}`;
  /** Accessibility attributes */
  accessibilityAttributes?: LinkAccessibilityAttributes;

  // === Events ===
  /** Called when link is clicked */
  onClick?: (detail: LinkClickEventDetail) => void;

  // === Standard HTML ===
  /** Additional class names */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Link ID */
  id?: string;
  /** Tab index for roving tabindex patterns */
  tabIndex?: number;
  /** Data attributes for testing */
  "data-testid"?: string;
}
