import { createContext, useContext } from "react";

/**
 * Context value for FxSideNavigation
 */
export interface FxSideNavigationContextValue {
  /** Whether the navigation is collapsed (icon-only mode) */
  collapsed: boolean;
  /** Whether the nav is mid-transition between collapsed/expanded */
  isTransitioning: boolean;
  /** Direction of the current transition */
  transitionDirection: 'collapsing' | 'expanding' | null;
  /** Whether we're in the fixed section (bottom items) */
  isFixedSection: boolean;
  /** Handler when an item is clicked */
  onItemClick: (name: string) => void;
  /** Register a flyout close handler for an item */
  registerFlyoutClose: (name: string, handler: () => void) => void;
  /** Unregister a flyout close handler for an item */
  unregisterFlyoutClose: (name: string) => void;
  /** Close all flyouts except the specified one */
  closeOtherFlyouts: (exceptName: string) => void;
  /** Register an item ref for keyboard navigation */
  registerItemRef: (name: string, ref: HTMLAnchorElement | HTMLButtonElement | null) => void;
  /** Navigate to next/previous item */
  navigateToItem: (currentName: string, direction: 'next' | 'prev') => void;
}

/**
 * Context for FxSideNavigation state sharing between parent and items
 */
export const FxSideNavigationContext = createContext<FxSideNavigationContextValue | null>(null);

/**
 * Hook to access FxSideNavigation context
 */
export const useFxSideNavigationContext = () => {
  const context = useContext(FxSideNavigationContext);
  return context;
};
