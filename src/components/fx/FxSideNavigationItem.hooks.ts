import { useRef, useState, useCallback, useEffect } from "react";
import { useFxSideNavigationContext } from "./FxSideNavigationContext";

/**
 * Hook for managing flyout state and behavior
 */
export function useFlyoutState(
  name: string,
  locked: boolean,
  disabled: boolean,
  skipFlyoutOnFocusRef?: { current: boolean }
) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isAddButtonFocused, setIsAddButtonFocused] = useState(false);
  // Prevent hydration issues by only showing flyout on client side
  const isMounted = typeof window !== 'undefined';
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMouseInsideRef = useRef(false);
  const prevLockedRef = useRef(locked);

  const context = useFxSideNavigationContext();

  // Register flyout close handler with parent
  useEffect(() => {
    if (context?.registerFlyoutClose) {
      const closeHandler = () => {
        setIsHovered(false);
        setIsFocused(false);
      };
      context.registerFlyoutClose(name, closeHandler);
      return () => context.unregisterFlyoutClose(name);
    }
  }, [context, name]);

  // Handle locked state changes
  useEffect(() => {
    if (locked && !prevLockedRef.current) {
      setTimeout(() => {
        setIsHovered(false);
        setIsFocused(false);
      }, 0);
    } else if (!locked && prevLockedRef.current) {
      if (isMouseInsideRef.current) {
        setTimeout(() => {
          setIsHovered(true);
        }, 0);
      }
    }
    prevLockedRef.current = locked;
  }, [locked]);

  // Clear any pending timeout
  const clearHoverTimeout = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      clearHoverTimeout();
    };
  }, [clearHoverTimeout]);

  // Mouse/focus handlers
  const handleMouseEnter = useCallback(() => {
    isMouseInsideRef.current = true;
    if (locked || disabled) return;
    clearHoverTimeout();
    context?.closeOtherFlyouts(name);
    setIsHovered(true);
  }, [locked, disabled, clearHoverTimeout, context, name]);

  const handleMouseLeave = useCallback(() => {
    isMouseInsideRef.current = false;
    if (!isFocused && !isAddButtonFocused) {
      hoverTimeoutRef.current = setTimeout(() => {
        setIsHovered(false);
      }, 100);
    }
  }, [isFocused, isAddButtonFocused]);

  const handleFocus = useCallback(() => {
    if (locked || disabled) return;
    // Skip opening flyout if flag is set (e.g., after add button click)
    if (skipFlyoutOnFocusRef?.current) return;
    clearHoverTimeout();
    context?.closeOtherFlyouts(name);
    setIsFocused(true);
    setIsHovered(true);
  }, [locked, disabled, clearHoverTimeout, context, name, skipFlyoutOnFocusRef]);

  const handleBlur = useCallback((e: React.FocusEvent) => {
    const relatedTarget = e.relatedTarget as HTMLElement | null;
    const container = e.currentTarget.closest('.relative');

    if (relatedTarget) {
      if (container?.contains(relatedTarget)) {
        return;
      }
      if (relatedTarget.closest('[data-flyout-child="true"]')) {
        return;
      }
    }

    setIsFocused(false);

    if (!isMouseInsideRef.current) {
      hoverTimeoutRef.current = setTimeout(() => {
        setIsHovered(false);
      }, 100);
    }
  }, []);

  const handleFlyoutMouseEnter = useCallback(() => {
    isMouseInsideRef.current = true;
    clearHoverTimeout();
  }, [clearHoverTimeout]);

  const handleFlyoutMouseLeave = useCallback(() => {
    isMouseInsideRef.current = false;
    if (!isFocused && !isAddButtonFocused) {
      hoverTimeoutRef.current = setTimeout(() => {
        setIsHovered(false);
      }, 100);
    }
  }, [isFocused, isAddButtonFocused]);

  return {
    isHovered,
    isFocused,
    isAddButtonFocused,
    isMounted,
    setIsHovered,
    setIsFocused,
    setIsAddButtonFocused,
    handleMouseEnter,
    handleMouseLeave,
    handleFocus,
    handleBlur,
    handleFlyoutMouseEnter,
    handleFlyoutMouseLeave,
  };
}

/**
 * Hook for managing item interactions (click, keyboard)
 */
export function useItemInteractions(
  name: string,
  disabled: boolean,
  onClick?: (event: React.MouseEvent) => void,
  setIsHovered?: (value: boolean) => void,
  setIsFocused?: (value: boolean) => void,
  itemRef?: React.RefObject<HTMLAnchorElement | HTMLButtonElement | null>
) {
  const context = useFxSideNavigationContext();

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();

      if (disabled) return;
      setIsFocused?.(false);
      if (onClick) {
        onClick(e);
      } else {
        context?.onItemClick(name);
      }
      // Keep focus on the item after click
      // Use setTimeout to ensure focus is restored after any re-renders
      // (e.g., when clicking expand/collapse button)
      setTimeout(() => {
        itemRef?.current?.focus();
      }, 0);
    },
    [disabled, onClick, context, name, setIsFocused, itemRef]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setIsHovered?.(false);
        setIsFocused?.(false);
        context?.navigateToItem(name, 'next');
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setIsHovered?.(false);
        setIsFocused?.(false);
        context?.navigateToItem(name, 'prev');
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (disabled) return;

        // Close flyout
        setIsHovered?.(false);
        setIsFocused?.(false);

        if (onClick) {
          onClick(e as unknown as React.MouseEvent);
        } else {
          context?.onItemClick(name);
        }

        // Keep focus on the item after activation
        // Use setTimeout to ensure focus is restored after any re-renders
        setTimeout(() => {
          itemRef?.current?.focus();
        }, 0);
      } else if (e.key === 'Escape') {
        setIsHovered?.(false);
        setIsFocused?.(false);
        itemRef?.current?.blur();
      }
    },
    [context, name, disabled, onClick, setIsHovered, setIsFocused, itemRef]
  );

  return {
    handleClick,
    handleKeyDown,
  };
}
