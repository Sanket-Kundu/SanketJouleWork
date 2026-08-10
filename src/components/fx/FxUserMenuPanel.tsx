import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "../button/Button";
import { Title } from "../title/Title";
import { TitleLevel } from "../../types/title";
import type { ButtonRef } from "../../types/button";
import { useTranslation } from "react-i18next";

const NavBackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M13.4939 4.04418C13.1385 3.66784 12.5459 3.65098 12.1694 4.00634L6.54443 9.31517C6.357 9.4921 6.25047 9.7386 6.25024 9.99633C6.25018 10.2543 6.35696 10.5015 6.54443 10.6787L12.1694 15.9936C12.5458 16.3491 13.1383 16.3321 13.4939 15.9558C13.8493 15.5795 13.8323 14.9869 13.4561 14.6313L8.55371 9.99633L13.4561 5.36864C13.8324 5.01321 13.8492 4.42064 13.4939 4.04418Z" fill="currentColor"/>
  </svg>
);

// Ensure keyframe animations are available globally
let animationsInjected = false;
const injectAnimations = () => {
  if (animationsInjected) return;
  animationsInjected = true;
  const style = document.createElement("style");
  style.id = "fx-user-menu-panel-animations";
  style.textContent = `
    @keyframes fxUmFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes fxUmFadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
    @keyframes fxUmSlideInFromLeft {
      from { transform: translateX(-100%); }
      to { transform: translateX(0); }
    }
    @keyframes fxUmSlideOutToLeft {
      from { transform: translateX(0); }
      to { transform: translateX(-100%); }
    }
  `;
  document.head.appendChild(style);
};

interface FxUserMenuPanelProps {
  ref?: React.Ref<HTMLDivElement>;
  open: boolean;
  children: React.ReactNode;
  footer: React.ReactNode;
  accessibleName?: string;
  onClose: () => void;
  onBackClick?: () => void;
}

const ANIMATION_DURATION = 300;

export function FxUserMenuPanel({
  open,
  children,
  footer,
  accessibleName,
  onClose,
  onBackClick,
  ref,
}: FxUserMenuPanelProps) {
  const { t } = useTranslation("fx");
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const backButtonRef = useRef<ButtonRef>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const visibleRef = useRef(false);

  useEffect(() => {
    injectAnimations();
  }, []);

  // Keep ref in sync with state
  useEffect(() => {
    visibleRef.current = visible;
  }, [visible]);

  // Handle open/close transitions
  useEffect(() => {
    // Clear any existing close timer
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    if (open) {
      // Opening
      previousFocusRef.current = document.activeElement as HTMLElement;
      setVisible(true);
      setClosing(false);
    } else if (visibleRef.current) {
      // Closing: animate out then hide
      setClosing(true);
      closeTimerRef.current = setTimeout(() => {
        setVisible(false);
        setClosing(false);
        closeTimerRef.current = null;
      }, ANIMATION_DURATION);
    }

    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
    };
  }, [open]);

  // Focus the back button when panel opens
  useEffect(() => {
    if (visible && !closing) {
      requestAnimationFrame(() => {
        backButtonRef.current?.focus();
      });
    }
  }, [visible, closing]);

  // Restore focus when panel closes
  useEffect(() => {
    if (!visible && previousFocusRef.current) {
      previousFocusRef.current?.focus();
      previousFocusRef.current = null;
    }
  }, [visible]);

  const startClose = useCallback(
    (callback?: () => void) => {
      if (closing) return;
      setClosing(true);
      setTimeout(() => {
        setVisible(false);
        setClosing(false);
        onClose();
        callback?.();
      }, ANIMATION_DURATION);
    },
    [closing, onClose]
  );

  const handleBackdropClick = useCallback(() => {
    startClose();
  }, [startClose]);

  const handleBackClick = useCallback(() => {
    startClose(onBackClick);
  }, [startClose, onBackClick]);

  // Escape key closes the panel
  useEffect(() => {
    if (!visible) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        startClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [visible, startClose]);

  // Prevent body scroll when panel is open
  useEffect(() => {
    if (visible) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [visible]);

  if (!visible) return null;

  return createPortal(
    <div
      ref={ref}
      className="fixed inset-0 z-50 flex"
      role="dialog"
      aria-modal="true"
      aria-label={accessibleName || "User Menu"}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        style={{
          animation: closing
            ? `fxUmFadeOut ${ANIMATION_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1) forwards`
            : `fxUmFadeIn ${ANIMATION_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        }}
        onClick={handleBackdropClick}
      />

      {/* Panel - slides in from left */}
      <div
        className="relative h-full flex flex-col shadow-xl rounded-r-2xl"
        style={{
          minWidth: "20rem",
          maxWidth: "calc(100vw - 2rem)",
          backgroundColor: "var(--card-bg-primary)",
          borderRight: "1px solid var(--border-primary)",
          animation: closing
            ? `fxUmSlideOutToLeft ${ANIMATION_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1) forwards`
            : `fxUmSlideInFromLeft ${ANIMATION_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center h-12 px-2 shrink-0"
          style={{ borderBottom: "1px solid var(--border-primary)" }}
        >
          <Button
            ref={backButtonRef}
            design="SecondaryNeutral"
            size="Large"
            iconOnly
            icon={<NavBackIcon />}
            accessibleName={t("FX_BACK")}
            onClick={handleBackClick}
          />
          <Title level={TitleLevel.H4} className="flex-1 text-center pr-8">
            {t("FX_PROFILE")}
          </Title>
        </div>

        {/* Scrollable content */}
        <div
          className="flex-1 overflow-y-auto overflow-x-hidden"
          style={{ overscrollBehavior: "contain" }}
        >
          {children}
        </div>

        {/* Footer */}
        <div
          className="shrink-0 px-3 py-2"
          style={{ borderTop: "1px solid var(--border-primary)" }}
        >
          {footer}
        </div>
      </div>
    </div>,
    document.body
  );
}
