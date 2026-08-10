import React, { ReactNode } from "react";

/**
 * Tag design — 9 fixed visual styles from Figma Sapphire "Status Tag" spec.
 *
 * Semantic (5): Positive, Negative, Critical, None, Information
 * Jobs (4): Draft, Active, Waiting, Paused
 */
export enum TagDesign {
  /** Green tinted bg, green text, checkmark icon */
  Positive = "Positive",
  /** Red tinted bg, red text, error icon */
  Negative = "Negative",
  /** Yellow tinted bg, yellow text, warning icon */
  Critical = "Critical",
  /** Gray bg, secondary text, hash icon */
  None = "None",
  /** Blue tinted bg, blue text, info icon */
  Information = "Information",
  /** Gray bg, primary text, busy icon */
  Draft = "Draft",
  /** Purple filled bg, purple text, sync icon */
  Active = "Active",
  /** Transparent bg, purple border, purple text, flag icon */
  Waiting = "Waiting",
  /** Transparent bg, gray border, primary text, pause icon */
  Paused = "Paused",
}

/**
 * Tag ref methods for imperative control
 */
export interface TagRef {
  /** Focus the tag */
  focus(): void;
  /** Blur the tag */
  blur(): void;
  /** Check if tag is focused */
  isFocused(): boolean;
  /** Access native tag element */
  readonly nativeElement: HTMLSpanElement | null;
}

/**
 * Props for the Tag component — display-only status tag.
 */
export interface TagProps {
  /** Ref for imperative access */
  ref?: React.Ref<TagRef>;

  // === Visual ===
  /** Tag design (determines bg, border, text color, and default icon) */
  design?: TagDesign | `${TagDesign}`;
  /** Visual variant. "filled" (default) uses tinted backgrounds; "outline" uses border-only with secondary text. */
  variant?: "filled" | "outline";

  // === Content ===
  /** Tag text content */
  children?: ReactNode;
  /** Custom icon to display (overrides default design icon) */
  icon?: ReactNode;
  /** Hide the default design icon */
  hideIcon?: boolean;

  // === Standard HTML ===
  /** Additional class names */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Tag ID */
  id?: string;
  /** Data attributes for testing */
  "data-testid"?: string;
}
