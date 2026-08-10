import React, { ReactNode } from "react";

/**
 * Card visual design variants
 */
export enum CardDesign {
  /** Standard card with neutral border */
  Default = "Default",
  /** Joule AI card with purple border and shadow */
  Joule = "Joule",
}

/**
 * Card Header status indicator types
 */
export enum CardHeaderStatus {
  /** No status indicator */
  None = "None",
  /** Positive/success status */
  Positive = "Positive",
  /** Negative/error status */
  Negative = "Negative",
  /** Critical/warning status */
  Critical = "Critical",
  /** Information status */
  Information = "Information",
}

/**
 * Event detail for card click events (when interactive)
 */
export interface CardClickEventDetail {
  /** Original mouse or keyboard event */
  originalEvent: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>;
  /** Whether activation was via keyboard */
  isKeyboard: boolean;
}

/** @deprecated Use CardClickEventDetail instead */
export type CardHeaderClickEventDetail = CardClickEventDetail;

/**
 * Card Header ref methods for imperative control
 */
export interface CardHeaderRef {
  /** Focus the header (when interactive) */
  focus(): void;
  /** Blur the header */
  blur(): void;
  /** Check if header is focused */
  isFocused(): boolean;
  /** Access native header element */
  readonly nativeElement: HTMLDivElement | null;
}

/**
 * Props for the CardHeader component
 */
export interface CardHeaderProps {
  // === Content ===
  /** Main title text */
  titleText?: string;
  /** Subtitle text displayed below title */
  subtitleText?: string;
  /** Additional text displayed on the right side */
  additionalText?: string;

  // === Slots ===
  /**
   * Avatar element displayed in the left most part of the header.
   * Typically an Avatar component or icon.
   */
  avatar?: ReactNode;
  /**
   * Action element displayed in the right most part of the header.
   * Typically a Button or other interactive element.
   */
  action?: ReactNode;

  // === Status ===
  /**
   * Status indicator type for the additional text.
   * Applies semantic coloring to the additionalText.
   */
  status?: CardHeaderStatus | `${CardHeaderStatus}`;

  // === Accessibility ===
  /**
   * Heading level for the title (rendered via aria-level).
   * @default 3
   */
  ariaLevel?: number;
  /** Accessible name for the header (aria-label) */
  accessibleName?: string;
  /** ID of labelling element (aria-labelledby) */
  accessibleNameRef?: string;
  /** Accessible description (aria-describedby) */
  accessibleDescriptionRef?: string;

  // === Standard HTML ===
  /** Additional class names */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Header ID */
  id?: string;
  /** Data attributes for testing */
  "data-testid"?: string;
}

/**
 * Card ref methods for imperative control
 */
export interface CardRef {
  /** Focus the card */
  focus(): void;
  /** Blur the card */
  blur(): void;
  /** Access native card element */
  readonly nativeElement: HTMLDivElement | null;
}

/**
 * Props for the Card component.
 *
 * Non-interactive cards render with `role="region"`.
 * Interactive cards render with `role="listitem"` — place them inside
 * a container with `role="list"` for correct semantics.
 */
export interface CardProps {
  /** Ref for imperative access */
  ref?: React.Ref<CardRef>;

  // === Design ===
  /**
   * Visual design variant.
   * - `Default` — neutral border, no shadow
   * - `Joule` — purple border with Joule glow shadow
   * @default "Default"
   */
  design?: CardDesign | `${CardDesign}`;

  // === Behavior ===
  /**
   * Makes the entire card interactive with hover effects and click events.
   * When true, the card is focusable and fires onClick on click or Enter/Space.
   */
  interactive?: boolean;

  // === Content ===
  /**
   * Card content - any React elements.
   * For semantic cards, use CardHeader in the header slot.
   */
  children?: ReactNode;

  // === Header Slot ===
  /**
   * Header element for the card.
   * Use CardHeader component for the intended design with
   * proper keyboard handling, styling and accessibility.
   */
  header?: ReactNode;

  // === Footer Slot (Extension beyond UI5) ===
  /**
   * Footer element for the card.
   * Typically contains action buttons aligned to the right.
   * This is an extension beyond the standard UI5 Card.
   */
  footer?: ReactNode;

  // === Toolbar Slot ===
  /**
   * Floating action toolbar rendered above the card, visible on hover.
   * Typically icon-only Button elements.
   *
   * - **Default design**: toolbar appears on card hover and when `toolbarVisible` is true.
   * - **Joule design**: toolbar is hidden by default and controlled entirely
   *   by `toolbarVisible` — hover does not reveal it.
   */
  toolbar?: ReactNode;
  /**
   * Force toolbar visible (overrides hover-only behavior).
   * Use for selected/active states where the toolbar should persist.
   * @default false
   */
  toolbarVisible?: boolean;
  /**
   * Additional class names for the toolbar bar element.
   * Use to override default shape/shadow (e.g. rounded-lg vs rounded-t-lg).
   */
  toolbarClassName?: string;

  // === Loading State ===
  /**
   * Displays a loading indicator over the card content.
   * The card remains visible but is overlaid with a spinner.
   */
  loading?: boolean;
  /**
   * Delay in milliseconds before showing the loading indicator.
   * Prevents flashing for quick loads.
   * @default 1000
   */
  loadingDelay?: number;

  // === Accessibility ===
  /**
   * Accessible name for the card (aria-label).
   * Recommended to provide a unique name per card for screen readers.
   */
  accessibleName?: string;
  /** ID of labelling element (aria-labelledby) */
  accessibleNameRef?: string;
  /** Accessible description (aria-describedby) */
  accessibleDescriptionRef?: string;

  // === Standard HTML ===
  /** Additional class names */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Card ID */
  id?: string;
  /** Data attributes for testing */
  "data-testid"?: string;

  // === Event Handlers ===
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
  onMouseDown?: React.MouseEventHandler<HTMLDivElement>;
  onMouseUp?: React.MouseEventHandler<HTMLDivElement>;
  /**
   * Called when the card is clicked.
   * When `interactive` is true, also fires on Enter or Space key press
   * and includes `isKeyboard` in the event detail.
   */
  onClick?: (detail: CardClickEventDetail) => void;
  onFocus?: React.FocusEventHandler<HTMLDivElement>;
  onBlur?: React.FocusEventHandler<HTMLDivElement>;
}

/**
 * Props for the CardFooter component
 */
export interface CardFooterProps {
  /** Footer content - typically action buttons */
  children?: ReactNode;
  /** Additional class names */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Data attributes for testing */
  "data-testid"?: string;
}

/**
 * Props for the CardContent component
 */
export interface CardContentProps {
  /** Card body content */
  children?: ReactNode;
  /** Additional class names */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Data attributes for testing */
  "data-testid"?: string;
}
