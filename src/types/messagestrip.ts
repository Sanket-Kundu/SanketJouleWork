import React from "react";

/**
 * Design variant for MessageStrip
 */
export enum MessageStripDesign {
  Information = "Information",
  Positive = "Positive",
  Negative = "Negative",
  Warning = "Warning",
}

/**
 * Event detail for message strip close events
 */
export interface MessageStripCloseDetail {
  /** Whether the message strip was closed */
  closed: boolean;
}

/**
 * Props for the MessageStrip component
 */
export interface MessageStripProps {
  /** Ref for imperative access */
  ref?: React.Ref<HTMLDivElement>;
  // === Design ===
  /** Design variant - Information, Positive, Negative, or Warning */
  design?: MessageStripDesign | `${MessageStripDesign}`;

  // === Content ===
  /** Title text displayed above the content (enables 2-line layout) */
  title?: string;
  /** Truncate the title with ellipsis instead of wrapping. Default is false (wrap). */
  titleTruncate?: boolean;
  /** Main content/message text */
  children?: React.ReactNode;
  /** Custom icon to display (defaults based on design if not provided) */
  icon?: React.ReactNode;
  /** Hide the default icon */
  hideIcon?: boolean;
  /** Show close button */
  hideCloseButton?: boolean;

  // === Events ===
  /** Called when close button is clicked */
  onClose?: (detail: MessageStripCloseDetail) => void;
  /** Called when the refresh button is clicked */
  onRefresh?: () => void;

  // === Display ===
  /** Show the refresh button before the close button. Hidden by default. */
  showRefresh?: boolean;

  // === Accessibility ===
  /** Accessible name (aria-label) */
  accessibleName?: string;
  /** ID of labelling element (aria-labelledby) */
  accessibleNameRef?: string;
  /** Accessible role override (defaults to "alert" for Negative/Warning, "status" otherwise) */
  accessibleRole?: string;
  /** Accessible description for screen readers */
  accessibleDescription?: string;
  /** ID of element that describes this message strip */
  accessibleDescriptionRef?: string;

  // === Standard HTML ===
  /** Message strip ID */
  id?: string;
  /** Additional class names */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Data attributes for testing/AI */
  "data-testid"?: string;
}
