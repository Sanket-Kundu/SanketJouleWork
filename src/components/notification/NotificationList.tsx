import * as React from "react";
import {
  useRef,
  useMemo,
  useImperativeHandle,
  useContext,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";
import { List } from "../list/List";
import { ListRef } from "../../types/list";
import {
  NotificationListProps,
  NotificationListContextValue,
} from "../../types/notification";

// ============================================================================
// CONTEXT
// ============================================================================

export const NotificationListContext =
  React.createContext<NotificationListContextValue | null>(null);

export function useNotificationListContext() {
  const context = useContext(NotificationListContext);
  if (!context) {
    throw new Error(
      "Notification item components must be used within a NotificationList"
    );
  }
  return context;
}

export function useOptionalNotificationListContext() {
  return useContext(NotificationListContext);
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function NotificationList(props: NotificationListProps) {
  const {
    children,
    noDataText = "No notifications",

    // Events
    onItemClick,
    onItemClose,
    onItemToggle,

    // Accessibility
    accessibleName = "Notifications",
    accessibleNameRef,

    // Standard
    className,
    style,
    id,
    "data-testid": dataTestId,
    ref,
  } = props;

  const listRef = useRef<ListRef>(null);
  const allNavigationItemsRef = useRef<HTMLElement[]>([]);

  // Update navigation items array when children change or after toggle
  const updateNavigationItems = useCallback(() => {
    const container = listRef.current?.scrollContainer;
    if (!container) {
      // Ref not ready yet, skip for now
      return;
    }

    const items: HTMLElement[] = [];

    // Get the main ul element
    const mainList = container.querySelector<HTMLElement>(':scope > ul');
    if (!mainList) return;

    // Process all top-level items in document order
    const topLevelItems = Array.from(mainList.children) as HTMLElement[];

    topLevelItems.forEach((item) => {
      // Skip if not a notification item
      if (!item.hasAttribute('data-notification-item')) {
        return;
      }

      const isGroup = item.hasAttribute('data-notification-group');

      if (isGroup) {
        // 1. Add the group header button
        const groupButton = item.querySelector<HTMLElement>('[role="button"]');
        if (groupButton) {
          items.push(groupButton);
        }

        // 2. Add child items if group is expanded
        const isCollapsed = groupButton?.getAttribute('aria-expanded') === 'false';
        if (!isCollapsed) {
          const childList = item.querySelector('ul[id]');
          if (childList) {
            // Query ALL li elements with data-notification-item
            const childItems = childList.querySelectorAll<HTMLElement>('li[data-notification-item]');
            childItems.forEach(child => items.push(child));
          }

          // 3. Add growing button if present (within this group)
          const growingBtn = item.querySelector<HTMLElement>('[data-growing-button]');
          if (growingBtn) {
            items.push(growingBtn);
          }
        }
      } else {
        // Standalone notification item
        items.push(item);
      }
    });

    allNavigationItemsRef.current = items;

    // Update tabindex: first item gets 0, rest get -1
    items.forEach((item, index) => {
      const newTabIndex = index === 0 ? '0' : '-1';
      item.setAttribute('tabindex', newTabIndex);
    });
  }, []);

  // Update navigation items on mount and when children change
  useLayoutEffect(() => {
    updateNavigationItems();
  }, [children, updateNavigationItems]);

  // Force tabindex attributes to stick (override React's rendering)
  useEffect(() => {
    const container = listRef.current?.scrollContainer;
    if (!container) return;

    // Apply tabindex immediately
    updateNavigationItems();

    // Watch for React re-renders that might override our tabindex
    const observer = new MutationObserver(() => {
      const items = allNavigationItemsRef.current;
      items.forEach((item, index) => {
        const expectedTabIndex = index === 0 ? '0' : '-1';
        const currentTabIndex = item.getAttribute('tabindex');
        // Only update if React changed it
        if (currentTabIndex !== expectedTabIndex) {
          item.setAttribute('tabindex', expectedTabIndex);
        }
      });
    });

    observer.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['tabindex', 'aria-expanded'],
    });

    return () => observer.disconnect();
  }, [updateNavigationItems]);

  // Helper to find group boundaries
  const findGroupStart = useCallback((items: HTMLElement[], currentIndex: number): number => {
    let groupStartIndex = 0;
    for (let i = currentIndex - 1; i >= 0; i--) {
      const item = items[i];
      const isGroupBtn = item.getAttribute('role') === 'button' &&
                        item.closest('[data-notification-group]');
      if (isGroupBtn) {
        groupStartIndex = i + 1;
        break;
      }
    }
    return groupStartIndex;
  }, []);

  const findGroupEnd = useCallback((items: HTMLElement[], currentIndex: number): number => {
    let groupEndIndex = items.length - 1;
    for (let i = currentIndex + 1; i < items.length; i++) {
      const item = items[i];
      const isGroupBtn = item.getAttribute('role') === 'button' &&
                        item.closest('[data-notification-group]');
      if (isGroupBtn) {
        groupEndIndex = i - 1;
        break;
      }
    }
    return groupEndIndex;
  }, []);

  // Calculate next navigation index based on key
  const getNextNavigationIndex = useCallback((
    key: string,
    currentIndex: number,
    items: HTMLElement[],
    isGroupButton: boolean | Element | null,
    isExpanded: boolean
  ): number => {
    if (key === 'ArrowDown' || key === 'ArrowRight') {
      // Special case: ArrowRight on expanded group button enters the group
      if (key === 'ArrowRight' && isGroupButton && isExpanded) {
        return currentIndex + 1;
      }
      return Math.min(items.length - 1, currentIndex + 1);
    }

    if (key === 'ArrowUp' || key === 'ArrowLeft') {
      return Math.max(0, currentIndex - 1);
    }

    if (key === 'Home') {
      return findGroupStart(items, currentIndex);
    }

    if (key === 'End') {
      return findGroupEnd(items, currentIndex);
    }

    return currentIndex;
  }, [findGroupStart, findGroupEnd]);

  // Keyboard navigation handler
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;

    // Check if this is a group button or notification item
    const isGroupButton = target.getAttribute('role') === 'button' &&
                         target.closest('[data-notification-group]');
    const isNotificationItem = target.hasAttribute('data-notification-item');
    const isGrowingButton = target.hasAttribute('data-growing-button');

    if (!isGroupButton && !isNotificationItem && !isGrowingButton) {
      return;
    }

    const items = allNavigationItemsRef.current;
    const currentIndex = items.indexOf(target);
    if (currentIndex === -1) return;

    // Check if key is navigable
    const navigableKeys = ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Home', 'End'];
    if (!navigableKeys.includes(e.key)) return;

    e.preventDefault();

    const isExpanded = target.getAttribute?.('aria-expanded') === 'true';
    const nextIndex = getNextNavigationIndex(e.key, currentIndex, items, isGroupButton, isExpanded);

    if (nextIndex !== currentIndex) {
      const nextItem = items[nextIndex];
      if (nextItem) {
        // Update tabindex
        items.forEach((item, idx) => {
          item.setAttribute('tabindex', idx === nextIndex ? '0' : '-1');
        });

        // Focus the new item
        nextItem.focus();
      }
    }
  }, [getNextNavigationIndex]);

  // Context value with updateNavigationItems callback
  const contextValue = useMemo<NotificationListContextValue>(
    () => ({
      onItemClick,
      onItemClose,
      onItemToggle: (detail) => {
        onItemToggle?.(detail);
        // Update navigation items after toggle
        setTimeout(updateNavigationItems, 0);
      },
      updateNavigationItems,
    }),
    [onItemClick, onItemClose, onItemToggle, updateNavigationItems]
  );

  // Imperative handle
  useImperativeHandle(
    ref,
    () => ({
      focus: () => {
        listRef.current?.focus();
      },
      blur: () => {
        (document.activeElement as HTMLElement)?.blur();
      },
      isFocused: () => {
        return listRef.current?.scrollContainer?.contains(document.activeElement) ?? false;
      },
      get nativeElement() {
        return listRef.current?.scrollContainer ?? null;
      },
    }),
    []
  );

  return (
    <NotificationListContext.Provider value={contextValue}>
      <div onKeyDown={handleKeyDown} className="[&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2">
        <List
          ref={listRef}
          noDataText={noDataText}
          accessibleName={accessibleName}
          accessibleNameRef={accessibleNameRef}
          className={className}
          style={style}
          id={id}
          data-testid={dataTestId}
        >
          {children}
        </List>
      </div>
    </NotificationListContext.Provider>
  );
}
