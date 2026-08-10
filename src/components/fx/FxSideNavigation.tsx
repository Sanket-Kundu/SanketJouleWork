import React, {
  useRef,
  useImperativeHandle,
  useCallback,
  useMemo,
  Children,
  cloneElement,
  isValidElement,
} from "react";
import { cn } from "../../lib/utils";
import { FxSideNavigationProps } from "../../types/fx";
import { FxSideNavigationContext, FxSideNavigationContextValue } from "./FxSideNavigationContext";
import { useTranslation } from "react-i18next";

/**
 * Helper to count valid FxSideNavigationItem children
 */
function countNavigationItems(children: React.ReactNode): number {
  let count = 0;
  Children.forEach(children, (child) => {
    if (isValidElement(child)) {
      count++;
    }
  });
  return count;
}

/**
 * Helper to inject aria-roledescription into FxSideNavigationItem children
 */
function enrichChildrenWithAria(children: React.ReactNode, totalCount: number, startIndex = 1): React.ReactNode {
  let currentIndex = startIndex;
  return Children.map(children, (child) => {
    if (isValidElement(child)) {
      const ariaRoleDescription = `navigation item, ${currentIndex} of ${totalCount}`;
      currentIndex++;
      return cloneElement(child as React.ReactElement<{ ariaRoleDescription?: string }>, { ariaRoleDescription });
    }
    return child;
  });
}

/**
 * FxSideNavigation - Side navigation with collapse/expand and flyout support
 *
 * Features:
 * - Collapsed mode (64px, icons only with flyout on hover)
 * - Expanded mode (256px, icons + text + badges + add buttons)
 * - Merged mode controlled by parent (FxLayout) for vertical responsiveness
 *
 * @example
 * ```tsx
 * <FxSideNavigation
 *   collapsed={isCollapsed}
 *   forceMerged={isMerged}
 *   onSelectionChange={({ name }) => setMode(name)}
 *   header={<JouleIcon />}
 *   fixedItems={
 *     <>
 *       <FxSideNavigationItem name="notifications" icon={<Bell />} badge="3" locked />
 *       <FxSideNavigationItem name="profile" avatar={<Avatar />} locked />
 *     </>
 *   }
 * >
 *   <FxSideNavigationItem name="conversations" icon={<Chat />} text="Conversations" />
 *   <FxSideNavigationItem name="discover" icon={<Search />} text="Discover" />
 * </FxSideNavigation>
 * ```
 */
export function FxSideNavigation({
  collapsed = false,
  isTransitioning = false,
  transitionDirection = null,
  forceMerged = false,
  dialogMode = false,
  children,
  fixedItems,
  header,
  onSelectionChange,
  onMergeChange: _onMergeChange, // Deprecated - merge is now controlled by parent
  className,
  style,
  ref,
  "data-testid": dataTestId,
}: FxSideNavigationProps) {
    const { t } = useTranslation("fx");
    const containerRef = useRef<HTMLElement>(null);
    const flexibleRef = useRef<HTMLDivElement>(null);
    const fixedRef = useRef<HTMLDivElement>(null);

    // Flyout close handlers registry
    const flyoutCloseHandlersRef = useRef<Map<string, () => void>>(new Map());

    // Item refs registry for keyboard navigation
    const itemRefsRef = useRef<Map<string, HTMLAnchorElement | HTMLButtonElement>>(new Map());
    // Track item order for navigation
    const itemOrderRef = useRef<string[]>([]);

    // Register/unregister flyout close handlers
    const registerFlyoutClose = useCallback((name: string, handler: () => void) => {
      flyoutCloseHandlersRef.current.set(name, handler);
    }, []);

    const unregisterFlyoutClose = useCallback((name: string) => {
      flyoutCloseHandlersRef.current.delete(name);
    }, []);

    // Register item refs for keyboard navigation
    const registerItemRef = useCallback((name: string, ref: HTMLAnchorElement | HTMLButtonElement | null) => {
      if (ref) {
        itemRefsRef.current.set(name, ref);
        // Update order based on DOM position
        const allItems = Array.from(itemRefsRef.current.entries());
        allItems.sort((a, b) => {
          const aRect = a[1].getBoundingClientRect();
          const bRect = b[1].getBoundingClientRect();
          return aRect.top - bRect.top;
        });
        itemOrderRef.current = allItems.map(([name]) => name);
      } else {
        itemRefsRef.current.delete(name);
        itemOrderRef.current = itemOrderRef.current.filter(n => n !== name);
      }
    }, []);

    // Navigate to next/previous item
    const navigateToItem = useCallback((currentName: string, direction: 'next' | 'prev') => {
      const order = itemOrderRef.current;
      const currentIndex = order.indexOf(currentName);
      if (currentIndex === -1) return;

      let targetIndex: number;
      if (direction === 'next') {
        targetIndex = currentIndex + 1;
        if (targetIndex >= order.length) targetIndex = 0; // Wrap around
      } else {
        targetIndex = currentIndex - 1;
        if (targetIndex < 0) targetIndex = order.length - 1; // Wrap around
      }

      const targetName = order[targetIndex];
      const targetRef = itemRefsRef.current.get(targetName);
      targetRef?.focus();
    }, []);

    // Close flyout for a specific item
    const closeFlyout = useCallback((itemName: string) => {
      const handler = flyoutCloseHandlersRef.current.get(itemName);
      handler?.();
    }, []);

    // Close all flyouts except the specified one
    const closeOtherFlyouts = useCallback((exceptName: string) => {
      flyoutCloseHandlersRef.current.forEach((handler, name) => {
        if (name !== exceptName) {
          handler();
        }
      });
    }, []);

    // Imperative API
    useImperativeHandle(ref, () => ({
      closeFlyout,
      get isMerged() { return forceMerged; },
      get nativeElement() { return containerRef.current; },
      getNativeElement: () => containerRef.current,
    }));

    // Handle item click
    const handleItemClick = useCallback(
      (name: string) => {
        onSelectionChange?.({ name });
      },
      [onSelectionChange]
    );

    // Compute total count and enrich children with aria-roledescription
    const totalCount = useMemo(() => countNavigationItems(children), [children]);
    const enrichedChildren = useMemo(() => enrichChildrenWithAria(children, totalCount, 1), [children, totalCount]);

    // Context value for child items
    const flexibleContextValue = useMemo<FxSideNavigationContextValue>(
      () => ({
        collapsed,
        isTransitioning,
        transitionDirection,
        isFixedSection: false,
        onItemClick: handleItemClick,
        registerFlyoutClose,
        unregisterFlyoutClose,
        closeOtherFlyouts,
        registerItemRef,
        navigateToItem,
      }),
      [collapsed, isTransitioning, transitionDirection, handleItemClick, registerFlyoutClose, unregisterFlyoutClose, closeOtherFlyouts, registerItemRef, navigateToItem]
    );

    const fixedContextValue = useMemo<FxSideNavigationContextValue>(
      () => ({
        collapsed,
        isTransitioning,
        transitionDirection,
        isFixedSection: true,
        onItemClick: handleItemClick,
        registerFlyoutClose,
        unregisterFlyoutClose,
        closeOtherFlyouts,
        registerItemRef,
        navigateToItem,
      }),
      [collapsed, isTransitioning, transitionDirection, handleItemClick, registerFlyoutClose, unregisterFlyoutClose, closeOtherFlyouts, registerItemRef, navigateToItem]
    );

    return (
      <nav
        ref={containerRef as React.RefObject<HTMLElement>}
        className={cn(
          "fx-side-navigation flex flex-col bg-sapphire-shell-bg-primary pb-6",
          !dialogMode && "h-full",
          dialogMode && "pt-4",
          collapsed && "collapsed",
          forceMerged && "merged",
          className
        )}
        style={{
          overflow: "visible", // Allow flyouts to extend beyond nav
          paddingLeft: '1.25rem',
          paddingRight: '1.25rem',
          ...style,
        }}
        data-testid={dataTestId}
      >
        {/* Header (logo/branding) - stays left-aligned */}
        {header && (
          <div
            className="flex items-center shrink-0 py-6"
            style={{ paddingLeft: '0.25rem' }}
          >
            {header}
          </div>
        )}

        {/* Top spacer - only shown in sidebar mode (not dialog mode) */}
        {/* flex-1 in both modes: centers icons vertically on large screens */}
        {!dialogMode && (
          <div
            className="flex-1"
            style={{ minHeight: 0 }}
          />
        )}

        {forceMerged ? (
          // Merged: single list with divider (no flex spacer - items flow naturally after top spacer)
          <div
            ref={flexibleRef}
            className="relative"
            style={{ overflow: "visible" }}
          >
            <ul
              role="list"
              aria-label={t("FX_MAIN_NAVIGATION")}
              className="list-none p-0 m-0 flex flex-col gap-4"
            >
              <FxSideNavigationContext.Provider value={flexibleContextValue}>
                {enrichedChildren}
              </FxSideNavigationContext.Provider>

              {fixedItems && (
                <>
                  {/* Divider */}
                  <li role="separator" className="my-1.5 h-px bg-sapphire-border-primary" />
                  <FxSideNavigationContext.Provider value={fixedContextValue}>
                    {fixedItems}
                  </FxSideNavigationContext.Provider>
                </>
              )}
            </ul>
          </div>
        ) : (
          // Separate: flexible list + spacer + fixed list
          <>
            {/* Flexible list (main navigation items) */}
            <div
              ref={flexibleRef}
              className="shrink-0 relative"
              style={{ overflow: "visible" }}
            >
              <ul
                role="list"
                aria-label={t("FX_MAIN_NAVIGATION")}
                className="list-none p-0 m-0 flex flex-col gap-4"
              >
                <FxSideNavigationContext.Provider value={flexibleContextValue}>
                  {enrichedChildren}
                </FxSideNavigationContext.Provider>
              </ul>
            </div>

            {/* Spacer (pushes fixed items to bottom) */}
            <div className="flex-1" />

            {/* Fixed list (notifications, profile, toggle) */}
            {fixedItems && (
              <div
                ref={fixedRef}
                className="shrink-0 relative"
                style={{ overflow: "visible" }}
              >
                <div role="toolbar" aria-label={t("FX_USER_ACTIONS")} className="flex flex-col gap-4">
                  <FxSideNavigationContext.Provider value={fixedContextValue}>
                    {fixedItems}
                  </FxSideNavigationContext.Provider>
                </div>
              </div>
            )}
          </>
        )}
      </nav>
    );
}
