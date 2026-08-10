import React, { ReactNode } from "react";

/**
 * Event detail when tokens are deleted from the Tokenizer.
 */
export interface TokenizerTokenDeleteEventDetail {
  /** Indices of the deleted tokens */
  tokens: number[];
}

/**
 * Event detail when token selection changes inside a Tokenizer.
 */
export interface TokenizerSelectionChangeEventDetail {
  /** Indices of all currently selected tokens */
  selectedIndices: number[];
}

/**
 * Tokenizer ref methods for imperative control
 */
export interface TokenizerRef {
  /** Focus the tokenizer (focuses the first or last-focused token) */
  focus(): void;
  /** Focus the last token in the tokenizer */
  focusLast(): void;
  /** Blur the tokenizer */
  blur(): void;
  /** Check if any token inside the tokenizer is focused */
  isFocused(): boolean;
  /** Access native tokenizer container element */
  readonly nativeElement: HTMLDivElement | null;
}

/**
 * Props for the Tokenizer component.
 *
 * A container that manages Token children in a single row,
 * handling keyboard navigation, selection, overflow, and deletion.
 *
 * @example
 * ```tsx
 * <Tokenizer onTokenDelete={({ tokens }) => removeTokens(tokens)}>
 *   <Token text="React" />
 *   <Token text="TypeScript" />
 *   <Token text="Tailwind" />
 * </Tokenizer>
 * ```
 */
export interface TokenizerProps {
  /** Ref for imperative access */
  ref?: React.Ref<TokenizerRef>;
  // === Content ===
  /** Token elements to display */
  children: ReactNode;

  // === Behavior ===
  /** Makes all tokens read-only */
  readonly?: boolean;
  /** Disables all interaction */
  disabled?: boolean;
  /** Whether tokens are displayed on multiple lines (showing all tokens) */
  multiLine?: boolean;
  /** Show "Clear All" button to delete all tokens at once */
  showClearAll?: boolean;

  // === Events ===
  /** Called when tokens are deleted (via close icon, Backspace, Delete, Cut, or Clear All) */
  onTokenDelete?: (detail: TokenizerTokenDeleteEventDetail) => void;
  /** Called when token selection changes */
  onSelectionChange?: (detail: TokenizerSelectionChangeEventDetail) => void;
  /**
   * Called when the "n more" indicator is clicked.
   * If provided, the Tokenizer's built-in overflow popover is suppressed
   * and the parent component is responsible for handling the action.
   */
  onNMoreClick?: () => void;

  // === Accessibility ===
  /** Accessible name for the token list (aria-label) */
  accessibleName?: string;
  /** ID of labelling element (aria-labelledby) */
  accessibleNameRef?: string;

  // === Standard HTML ===
  /** Additional class names */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Element ID */
  id?: string;
  /** Data attribute for testing */
  "data-testid"?: string;
}
