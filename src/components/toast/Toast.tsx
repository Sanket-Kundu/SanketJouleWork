import React, { useRef, useEffect, useState, useCallback } from "react";
import { cn } from "../../lib/utils";
import { ToastProps, ToastPlacement } from "../../types/toast";

const MIN_DURATION = 500;
const MAX_TRANSITION = 1000;

/**
 * Placement → inline position styles
 * Must be inline to override the popover UA stylesheet (inset: 0; margin: auto)
 */
const placementStyles: Record<string, React.CSSProperties> = {
  [ToastPlacement.TopStart]: { top: "3rem", left: "2rem" },
  [ToastPlacement.TopCenter]: { top: "3rem", left: "50%", transform: "translateX(-50%)" },
  [ToastPlacement.TopEnd]: { top: "3rem", right: "2rem" },
  [ToastPlacement.MiddleStart]: { top: "50%", left: "2rem", transform: "translateY(-50%)" },
  [ToastPlacement.MiddleCenter]: { top: "50%", left: "50%", transform: "translate(-50%, -50%)" },
  [ToastPlacement.MiddleEnd]: { top: "50%", right: "2rem", transform: "translateY(-50%)" },
  [ToastPlacement.BottomStart]: { bottom: "3rem", left: "2rem" },
  [ToastPlacement.BottomCenter]: { bottom: "3rem", left: "50%", transform: "translateX(-50%)" },
  [ToastPlacement.BottomEnd]: { bottom: "3rem", right: "2rem" },
};

/**
 * Toast component
 *
 * A small, non-disruptive popup for success or information messages
 * that disappears automatically after a configurable duration.
 * Uses the native Popover API for top-layer rendering.
 *
 * @example
 * ```tsx
 * <Toast open={showToast} onClose={() => setShowToast(false)}>
 *   Changes saved successfully
 * </Toast>
 * ```
 */
export function Toast({
  open = false,
  duration = 3000,
  placement = ToastPlacement.BottomCenter,
  children,
  onClose,
  className,
  style,
  id,
  "data-testid": dataTestId,
  ref,
}: ToastProps) {
  const toastRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [fading, setFading] = useState(false);

  // Merge refs
  React.useImperativeHandle(ref, () => toastRef.current!, []);

  const effectiveDuration = Math.max(duration, MIN_DURATION);
  const transitionDuration = Math.min(effectiveDuration / 3, MAX_TRANSITION);

  // Show/hide via Popover API
  useEffect(() => {
    const el = toastRef.current;
    if (!el) return;

    if (open) {
      if (!el.matches(":popover-open")) {
        el.showPopover();
      }
      // Start the fade-out after a frame so the transition kicks in
      requestAnimationFrame(() => {
        setFading(true);
      });
    } else {
      setFading(false);
      if (el.matches(":popover-open")) {
        el.hidePopover();
      }
    }
  }, [open]);

  // Handle transition end → auto-close
  const handleTransitionEnd = useCallback(() => {
    if (hovered || focused) return;
    setFading(false);
    onClose?.();
  }, [hovered, focused, onClose]);

  // Pause/resume: when hover or focus changes while open, update opacity
  const paused = hovered || focused;

  // Ctrl+Shift+M to focus the toast (a11y)
  useEffect(() => {
    if (!open) return;

    const handleKeydown = (e: KeyboardEvent) => {
      const isCtrl = e.metaKey || (!navigator.userAgent.includes("Mac") && e.ctrlKey);
      if (isCtrl && e.shiftKey && e.key.toLowerCase() === "m") {
        e.preventDefault();
        if (focused) {
          setFocused(false);
        } else {
          toastRef.current?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [open, focused]);

  // Escape to unfocus
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setFocused(false);
    }
  }, []);

  const posStyles = placementStyles[placement as string] || placementStyles[ToastPlacement.BottomCenter];

  return (
    <div
      ref={toastRef}
      id={id}
      popover="manual"
      role="alert"
      tabIndex={focused ? 0 : -1}
      data-testid={dataTestId}
      className={cn(
        // Visual style
        "max-w-60 rounded p-4",
        "bg-foreground dark:bg-neutral-300 text-background text-sm text-center",
        "shadow-lg",
        "break-words whitespace-pre-line",
        // Focus ring
        focused && "outline-2 outline-offset-[-3px] outline-[var(--ring)]",
        className
      )}
      style={{
        // Reset popover UA defaults — must be inline to win specificity
        position: "fixed",
        inset: "unset",
        margin: 0,
        padding: undefined,
        border: "none",
        background: undefined,
        // Placement positioning
        ...posStyles,
        // Fade transition
        transitionProperty: "opacity",
        transitionDuration: fading ? `${transitionDuration}ms` : "0ms",
        transitionDelay: fading ? `${effectiveDuration - transitionDuration}ms` : "0ms",
        opacity: fading && !paused ? 0 : 1,
        ...style,
      }}
      onTransitionEnd={handleTransitionEnd}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={() => setFocused(false)}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  );
}

Toast.displayName = "Toast";
