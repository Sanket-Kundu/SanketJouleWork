import React from "react";
import { cn, cva } from "@sap-ui/fx-components";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ChatMessageType = "user" | "assistant";

export interface ChatMessageProps {
  /** Who sent the message — controls alignment, color, and border-radius. */
  type: ChatMessageType;
  /** Message content (text or rich JSX). */
  children?: React.ReactNode;
  /** Timestamp text displayed above the bubble (e.g., "Today 9:45 AM"). */
  timestamp?: string;
  /** Additional className on the outer wrapper. */
  className?: string;
  /** Inline styles on the outer wrapper. */
  style?: React.CSSProperties;
  /** Data attribute for testing. */
  "data-testid"?: string;
}

// ─── CVA Variants ────────────────────────────────────────────────────────────

/**
 * Outer wrapper — controls horizontal alignment.
 */
const messageWrapperVariants = cva("flex w-full", {
  variants: {
    type: {
      user: "justify-end",
      assistant: "justify-start",
    },
  },
  defaultVariants: {
    type: "assistant",
  },
});

/**
 * Bubble — colors, radius, padding, max-width.
 *
 * Figma spec:
 *   Max-width:  600px
 *   Padding:    8px 16px
 *   Radius:     16 16 2 16  (user — tail bottom-right)
 *               16 16 16 2  (assistant — tail bottom-left)
 *   User:       linear-gradient(#E2EBF9 → #D9E4FF), dark text
 *   Assistant:  transparent (no bubble background)
 */
const messageBubbleVariants = cva(
  [
    "max-w-[600px] px-4 py-2",
    "text-sm whitespace-pre-wrap break-words",
  ],
  {
    variants: {
      type: {
        user: [
          "text-foreground",
          "rounded-tl-[16px] rounded-tr-[16px] rounded-br-[2px] rounded-bl-[16px]",
        ],
        assistant: [
          "text-foreground",
        ],
      },
    },
    defaultVariants: {
      type: "assistant",
    },
  }
);

/** Timestamp label. */
const messageTimestampVariants = cva([
  "text-xs text-sapphire-text-tertiary text-center mb-2 select-none",
]);

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * ChatMessage — a read-only chat bubble for conversations.
 *
 * Renders a message aligned left (assistant) or right (user) with
 * Figma-spec border-radius (16/16/2/16 tail pattern), padding (8px 16px),
 * max-width (600px), and theme-aware colors.
 *
 * The assistant bubble uses a subtle gradient derived from the theme's
 * primary color (`primary/8%` → `primary/12%`), so it adapts automatically
 * to any theme while matching the Figma reference (#E2EBF9 → #D9E4FF).
 *
 * @example
 * ```tsx
 * <ChatMessage type="user">
 *   Can you analyze our Q4 sales performance?
 * </ChatMessage>
 *
 * <ChatMessage type="assistant" timestamp="Today 9:45 AM">
 *   <p>Revenue is up <strong>23%</strong> year-over-year.</p>
 * </ChatMessage>
 * ```
 */
export const ChatMessage = React.forwardRef<HTMLDivElement, ChatMessageProps>(
  (
    {
      type,
      children,
      timestamp,
      className,
      style,
      "data-testid": dataTestId,
    },
    ref
  ) => {
    // User bubble gets the Figma gradient via inline style.
    const bubbleStyle: React.CSSProperties | undefined =
      type === "user"
        ? {
            background: "linear-gradient(135deg, var(--background-secondary), var(--background-tertiary))",
          }
        : undefined;

    return (
      <div
        ref={ref}
        className={cn(className)}
        style={style}
        data-testid={dataTestId}
      >
        {timestamp && (
          <p className={messageTimestampVariants()}>{timestamp}</p>
        )}
        <div className={messageWrapperVariants({ type })}>
          <div
            className={messageBubbleVariants({ type })}
            style={bubbleStyle}
          >
            {children}
          </div>
        </div>
      </div>
    );
  }
);

ChatMessage.displayName = "ChatMessage";
