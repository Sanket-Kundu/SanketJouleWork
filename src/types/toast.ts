import React from "react";

/**
 * Toast placement on screen
 */
export enum ToastPlacement {
  TopStart = "TopStart",
  TopCenter = "TopCenter",
  TopEnd = "TopEnd",
  MiddleStart = "MiddleStart",
  MiddleCenter = "MiddleCenter",
  MiddleEnd = "MiddleEnd",
  BottomStart = "BottomStart",
  BottomCenter = "BottomCenter",
  BottomEnd = "BottomEnd",
}

/**
 * Props for the Toast component
 */
export interface ToastProps {
  /** Ref for imperative access */
  ref?: React.Ref<HTMLDivElement>;

  // === Visibility ===
  /** Whether the toast is visible */
  open?: boolean;

  // === Behavior ===
  /** Duration in ms before auto-close (min 500, default 3000) */
  duration?: number;
  /** Screen placement */
  placement?: ToastPlacement | `${ToastPlacement}`;

  // === Content ===
  /** Toast message content */
  children?: React.ReactNode;

  // === Events ===
  /** Called after the toast auto-closes */
  onClose?: () => void;

  // === Standard HTML ===
  /** Additional class names */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Element ID */
  id?: string;
  /** Test ID */
  "data-testid"?: string;
}
