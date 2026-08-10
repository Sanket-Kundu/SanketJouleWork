import React, { ReactNode } from "react";

/**
 * Event detail for token delete events.
 * Fired when the close icon is clicked, or Backspace/Delete key is pressed.
 */
export interface TokenDeleteEventDetail {
  /** Original mouse or keyboard event */
  originalEvent: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>;
  /** Whether activation was via keyboard */
  isKeyboard: boolean;
  /** True when triggered by Backspace key */
  backSpace?: boolean;
  /** True when triggered by Delete key */
  delete?: boolean;
}

/**
 * Event detail for token select events.
 * Fired when the token is clicked or Space is pressed.
 */
export interface TokenSelectEventDetail {
  /** Original mouse or keyboard event */
  originalEvent: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>;
  /** Whether activation was via keyboard */
  isKeyboard: boolean;
  /** The new selection state */
  selected: boolean;
}

/**
 * Token ref methods for imperative control
 */
export interface TokenRef {
  /** Focus the token */
  focus(): void;
  /** Blur the token */
  blur(): void;
  /** Check if token is focused */
  isFocused(): boolean;
  /** Access native token element */
  readonly nativeElement: HTMLDivElement | null;
}

/**
 * Props for the Token component (public API).
 *
 * A small interactive chip representing a selected value.
 * Typically used inside a Tokenizer or MultiInput.
 *
 * @example
 * ```tsx
 * <Token text="React" />
 * <Token text="Selected" selected />
 * <Token text="Closable" onDelete={(e) => console.log("deleted")} />
 * ```
 */
export interface TokenProps {
  /** Ref for imperative access */
  ref?: React.Ref<TokenRef>;
  // === Content ===
  /** Text content of the token */
  text: string;
  /** Optional custom close icon (defaults to Decline/X icon) */
  closeIcon?: ReactNode;

  // === Behavior ===
  /** Whether the token is selected */
  selected?: boolean;

  // === Events ===
  /** Called when the token is clicked or Space is pressed to toggle selection */
  onSelect?: (detail: TokenSelectEventDetail) => void;
  /** Called when the close icon is clicked, or Backspace/Delete key is pressed */
  onDelete?: (detail: TokenDeleteEventDetail) => void;

  // === Standard HTML ===
  /** Additional class names */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Element ID */
  id?: string;
  /** Data attribute for testing */
  "data-testid"?: string;
  /** Tab index (managed by Tokenizer via roving tabindex) */
  tabIndex?: number;
}

/**
 * Internal props injected by the Tokenizer — not part of the public API.
 * @internal
 */
export interface TokenInternalProps extends TokenProps {
  /** Makes the token read-only (no close icon, no delete, no selection toggle). Set by Tokenizer. */
  readonly?: boolean;
  /** Set by Tokenizer when this is the only token — enables truncation */
  singleToken?: boolean;
  /** Set by Tokenizer when the token is hidden in the "more" area */
  overflows?: boolean;
}
