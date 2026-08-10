import * as React from "react";
import {
  useState,
  useCallback,
  useMemo,
  useRef,
  useImperativeHandle,
  useId,
  Children,
  isValidElement,
  cloneElement,
} from "react";
import { cn, cva } from "../../lib/utils";
import {
  TabContainerProps,
  TabContainerContextValue,
  TabContainerBackgroundDesign,
  TabLayout,
  TabOverflowMode,
  TabSelectionChangeDetail,
  TabRegistration,
  TabsPlacement,
  TabProps,
} from "../../types/tabs";
import { Tab, TabContainerContext, TabInternalProps } from "./Tab";
import { TabSeparator } from "./TabSeparator";
import { useTabDragDrop } from "./hooks/useTabDragDrop";
import { useTabOverflow } from "./hooks/useTabOverflow";
import { TabOverflowButton } from "./TabOverflowButton";

// ============================================================================
// VARIANTS
// ============================================================================

const containerVariants = cva(
  "w-full",
  {
    variants: {
      backgroundDesign: {
        [TabContainerBackgroundDesign.Solid]: "",
        [TabContainerBackgroundDesign.Transparent]: "",
        [TabContainerBackgroundDesign.Translucent]: "",
      },
    },
    defaultVariants: {
      backgroundDesign: TabContainerBackgroundDesign.Solid,
    },
  }
);

const headerBackgroundVariants = cva(
  "",
  {
    variants: {
      backgroundDesign: {
        [TabContainerBackgroundDesign.Solid]: "bg-sapphire-background-primary",
        [TabContainerBackgroundDesign.Transparent]: "bg-transparent",
        [TabContainerBackgroundDesign.Translucent]: "bg-sapphire-background-primary/80 backdrop-blur-sm",
      },
    },
    defaultVariants: {
      backgroundDesign: TabContainerBackgroundDesign.Solid,
    },
  }
);

const tabListVariants = cva(
  [
    "flex items-center",
    "border-b border-sapphire-border-primary",
  ],
  {
    variants: {
      layout: {
        [TabLayout.Inline]: "flex-row",
        [TabLayout.Standard]: "flex-row",
      },
      hasOverflow: {
        true: "overflow-hidden",
        false: "overflow-x-auto scrollbar-thin scrollbar-thumb-muted",
      },
    },
    defaultVariants: {
      layout: TabLayout.Inline,
      hasOverflow: false,
    },
  }
);

const tabPanelVariants = cva(
  "p-4",
  {
    variants: {
      backgroundDesign: {
        [TabContainerBackgroundDesign.Solid]: "bg-sapphire-background-primary",
        [TabContainerBackgroundDesign.Transparent]: "bg-transparent",
        [TabContainerBackgroundDesign.Translucent]: "bg-sapphire-background-primary/80 backdrop-blur-sm",
      },
    },
    defaultVariants: {
      backgroundDesign: TabContainerBackgroundDesign.Solid,
    },
  }
);

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Recursively extract nested tabs (handles Fragments)
 * Also tracks which parent tab each nested tab belongs to
 */
function extractNestedTabs(
  subTabs: React.ReactNode,
  tabContents: Map<string, React.ReactNode>,
  disabledIds: Set<string>,
  allTabIds: string[],
  nestedToParent: Map<string, string>,
  parentToChildren: Map<string, string[]>,
  childToDirectParent: Map<string, string>,
  parentId: string,
  directParentId: string
) {
  Children.forEach(subTabs, (child) => {
    if (!isValidElement(child)) return;

    // Handle React Fragments - recurse into their children
    if (child.type === React.Fragment) {
      extractNestedTabs((child.props as { children?: React.ReactNode }).children, tabContents, disabledIds, allTabIds, nestedToParent, parentToChildren, childToDirectParent, parentId, directParentId);
      return;
    }

    const displayName = (child.type as { displayName?: string })?.displayName;

    if (displayName === "Tab" || child.type === Tab) {
      const props = child.props as TabInternalProps;
      const tabId = props.id;

      if (tabId) {
        allTabIds.push(tabId);
        // Track this nested tab's root parent (for visual selection)
        nestedToParent.set(tabId, parentId);
        // Track direct parent-child relationship (for nesting level calculation)
        if (!parentToChildren.has(directParentId)) {
          parentToChildren.set(directParentId, []);
        }
        parentToChildren.get(directParentId)!.push(tabId);
        // Track child to direct parent mapping (for nesting level traversal)
        childToDirectParent.set(tabId, directParentId);

        if (props.children) {
          tabContents.set(tabId, props.children);
        }
        if (props.disabled) {
          disabledIds.add(tabId);
        }

        // Recursively extract from subTabs (nested tabs keep the same root parent, but new direct parent)
        if (props.subTabs) {
          extractNestedTabs(props.subTabs, tabContents, disabledIds, allTabIds, nestedToParent, parentToChildren, childToDirectParent, parentId, tabId);
        }
      }
    }
  });
}

/**
 * Extract tab children from TabContainer children (including nested tabs)
 */
function extractTabChildren(children: React.ReactNode): {
  tabs: React.ReactElement[];
  tabIds: string[];
  allTabIds: string[]; // Includes nested tab IDs for content lookup
  tabContents: Map<string, React.ReactNode>;
  disabledIds: Set<string>;
  nestedToParent: Map<string, string>; // Maps nested tab ID to its root parent tab ID
  parentToChildren: Map<string, string[]>; // Maps tab ID to its direct children tab IDs
  childToDirectParent: Map<string, string>; // Maps child tab ID to its direct parent tab ID
} {
  const tabs: React.ReactElement[] = [];
  const tabIds: string[] = []; // Top-level tab IDs only (for navigation)
  const allTabIds: string[] = []; // All tab IDs including nested (for content lookup)
  const tabContents = new Map<string, React.ReactNode>();
  const disabledIds = new Set<string>();
  const nestedToParent = new Map<string, string>(); // Maps nested tab ID to root parent
  const parentToChildren = new Map<string, string[]>(); // Maps tab ID to direct children
  const childToDirectParent = new Map<string, string>(); // Maps child to direct parent

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;

    const displayName = (child.type as { displayName?: string })?.displayName;

    if (displayName === "Tab" || child.type === Tab) {
      const props = child.props as TabInternalProps;
      const tabId = props.id;

      if (tabId) {
        tabs.push(child);
        tabIds.push(tabId);
        allTabIds.push(tabId);
        if (props.children) {
          tabContents.set(tabId, props.children);
        }
        if (props.disabled) {
          disabledIds.add(tabId);
        }

        // Extract nested tabs with parent tracking
        if (props.subTabs) {
          extractNestedTabs(props.subTabs, tabContents, disabledIds, allTabIds, nestedToParent, parentToChildren, childToDirectParent, tabId, tabId);
        }
      }
    } else if (displayName === "TabSeparator" || child.type === TabSeparator) {
      tabs.push(child);
    }
  });

  return { tabs, tabIds, allTabIds, tabContents, disabledIds, nestedToParent, parentToChildren, childToDirectParent };
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * TabContainer component
 */
export function TabContainer(props: TabContainerProps) {
    const {
      ref,
      selectedTabId: controlledSelectedTabId,
      defaultSelectedTabId,
      noAutoSelection = false,
      layout = TabLayout.Inline,
      backgroundDesign = TabContainerBackgroundDesign.Solid,
      headerBackgroundDesign,
      contentBackgroundDesign,
      collapsed = false,
      tabsPlacement = TabsPlacement.Top,
      overflowMode = TabOverflowMode.End,
      tabsOverflowMode = false,
      overflowButton,
      startOverflowButton,
      enableDragDrop = false,
      maxNestingLevel,
      onTabSelect,
      onTabMove,
      onTabMoveOver,
      accessibleName,
      accessibleNameRef,
      children,
      className,
      style,
      "data-testid": dataTestId,
      id: providedId,
    } = props;

    // Compute effective background designs
    const effectiveHeaderBg = (headerBackgroundDesign ?? backgroundDesign) as TabContainerBackgroundDesign;
    const effectiveContentBg = (contentBackgroundDesign ?? backgroundDesign) as TabContainerBackgroundDesign;
    const isBottom = String(tabsPlacement) === TabsPlacement.Bottom;

    // Generate IDs
    const generatedId = useId();
    const containerId = providedId || `tabs-${generatedId}`;

    // Refs
    const tabListRef = useRef<HTMLDivElement>(null);
    const tabPanelRef = useRef<HTMLDivElement>(null);
    const tabRegistrations = useRef<Map<string, TabRegistration>>(new Map());
    const startOverflowButtonRef = useRef<HTMLButtonElement>(null);
    const endOverflowButtonRef = useRef<HTMLButtonElement>(null);

    // Extract tab information from children
    const { tabs, tabIds, allTabIds, tabContents, disabledIds, nestedToParent, parentToChildren, childToDirectParent } = useMemo(
      () => extractTabChildren(children),
      [children]
    );

    // Detect tab display mode by scanning top-level tabs for icons
    const tabDisplayMode = useMemo<"text-only" | "icon" | "mixed">(() => {
      let hasIcon = false;
      let hasNoIcon = false;
      for (const tab of tabs) {
        if (!isValidElement(tab)) continue;
        const displayName = (tab.type as { displayName?: string })?.displayName;
        if (displayName === "Tab" || tab.type === Tab) {
          const tabProps = tab.props as TabProps;
          if (tabProps.icon) {
            hasIcon = true;
          } else {
            hasNoIcon = true;
          }
        }
      }
      if (hasIcon && hasNoIcon) return "mixed";
      if (hasIcon) return "icon";
      return "text-only";
    }, [tabs]);

    // State
    const [internalSelectedTabId, setInternalSelectedTabId] = useState<string | null>(
      () => {
        if (defaultSelectedTabId) return defaultSelectedTabId;
        if (noAutoSelection) return null;
        return tabIds[0] ?? null;
      }
    );
    const [focusedTabId, setFocusedTabId] = useState<string | null>(null);

    // Determine selected tab (the actual content tab)
    const selectedTabId = controlledSelectedTabId ?? internalSelectedTabId;

    // Determine which top-level tab should appear selected
    // If selected tab is nested, find its parent; otherwise use selected tab directly
    const selectedTopLevelTabId = useMemo(() => {
      if (!selectedTabId) return null;
      // If it's a top-level tab, return it
      if (tabIds.includes(selectedTabId)) return selectedTabId;
      // If it's a nested tab, return its parent
      return nestedToParent.get(selectedTabId) ?? null;
    }, [selectedTabId, tabIds, nestedToParent]);

    // The tab that should have tabIndex=0 (roving tabindex)
    const activeTabId = focusedTabId ?? selectedTabId ?? tabIds[0];

    // Helper to get nesting level of a tab (for drag-drop nesting level enforcement)
    const getTabNestingLevel = useCallback(
      (tabId: string): number => {
        let level = 0;
        let currentId = tabId;

        // Count how many times we can traverse up via childToDirectParent
        while (childToDirectParent.has(currentId)) {
          level++;
          currentId = childToDirectParent.get(currentId)!;
        }

        return level;
      },
      [childToDirectParent]
    );

    // Helper to get children of a tab (for preventing circular drops)
    const getTabChildren = useCallback(
      (tabId: string): string[] => {
        return parentToChildren.get(tabId) ?? [];
      },
      [parentToChildren]
    );

    // Tab drag and drop hook
    const {
      getDragProps,
      getDropIndicator,
      isDragging,
      isAnyDragging,
      draggedTabId,
      handleDragStart,
      handleDragEnd,
      handleDragOver,
      handleDragEnter,
      handleDragLeave,
      handleDrop,
    } = useTabDragDrop({
      enabled: enableDragDrop,
      tabIds,
      onMove: onTabMove,
      onMoveOver: onTabMoveOver,
      maxNestingLevel,
      getTabNestingLevel,
      getTabChildren,
    });

    // Tab overflow hook
    const {
      visibleTabIds,
      startOverflowTabIds,
      endOverflowTabIds,
      hasStartOverflow,
      hasEndOverflow,
      isReady: overflowReady,
    } = useTabOverflow({
      enabled: tabsOverflowMode,
      overflowMode,
      tabIds,
      selectedTabId: selectedTopLevelTabId,
      tabListRef,
    });

    // Focus a tab element by ID
    const focusTabById = useCallback((targetId: string) => {
      const registration = tabRegistrations.current.get(targetId);
      if (registration?.element) {
        registration.element.focus();
      }
    }, []);

    // Select tab handler - works for both top-level and nested tabs
    const selectTab = useCallback(
      (tabId: string) => {
        // Check if this tab exists in allTabIds (includes nested)
        if (!allTabIds.includes(tabId)) return;
        if (disabledIds.has(tabId)) return;

        const previousTabId = selectedTabId;

        if (controlledSelectedTabId === undefined) {
          setInternalSelectedTabId(tabId);
        }

        const detail: TabSelectionChangeDetail = {
          selectedTabId: tabId,
          previousTabId: previousTabId,
          tabIndex: allTabIds.indexOf(tabId),
        };
        onTabSelect?.(detail);
      },
      [allTabIds, disabledIds, selectedTabId, controlledSelectedTabId, onTabSelect]
    );

    // Handle keyboard navigation - this is called by Tab components
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent, currentTabId: string) => {
        // Use only visible tabs for navigation when overflow is active
        const navTabIds = (tabsOverflowMode && overflowReady && visibleTabIds.length > 0)
          ? visibleTabIds
          : tabIds;

        // Find current index
        const currentIndex = navTabIds.indexOf(currentTabId);
        if (currentIndex === -1) return;

        // Helper to find next enabled tab (stops at edges, no wrap-around)
        const findNextEnabled = (startIndex: number, direction: 1 | -1): number => {
          let index = startIndex;
          const count = navTabIds.length;

          while (true) {
            const next = index + direction;
            if (next < 0 || next >= count) return startIndex; // hit the edge without finding enabled tab, stay put
            index = next;
            if (!disabledIds.has(navTabIds[index])) return index;
          }
        };

        // Helper to find first enabled tab
        const findFirstEnabled = (): number => {
          for (let i = 0; i < navTabIds.length; i++) {
            if (!disabledIds.has(navTabIds[i])) return i;
          }
          return 0;
        };

        // Helper to find last enabled tab
        const findLastEnabled = (): number => {
          for (let i = navTabIds.length - 1; i >= 0; i--) {
            if (!disabledIds.has(navTabIds[i])) return i;
          }
          return navTabIds.length - 1;
        };

        let targetIndex = -1;
        const isRTL = document.documentElement.dir === "rtl";

        switch (e.key) {
          case "ArrowRight":
            e.preventDefault();
            targetIndex = findNextEnabled(currentIndex, isRTL ? -1 : 1);
            // If we're already at the edge and overflow exists, focus it
            if (targetIndex === currentIndex) {
              const overflowRef = isRTL ? startOverflowButtonRef : endOverflowButtonRef;
              if (overflowRef.current) {
                overflowRef.current.focus();
                return;
              }
            }
            break;

          case "ArrowLeft":
            e.preventDefault();
            targetIndex = findNextEnabled(currentIndex, isRTL ? 1 : -1);
            // If we're already at the edge and overflow exists, focus it
            if (targetIndex === currentIndex) {
              const overflowRef = isRTL ? endOverflowButtonRef : startOverflowButtonRef;
              if (overflowRef.current) {
                overflowRef.current.focus();
                return;
              }
            }
            break;

          case "Home":
            e.preventDefault();
            targetIndex = findFirstEnabled();
            break;

          case "End":
            e.preventDefault();
            targetIndex = findLastEnabled();
            break;

          case "Enter":
            e.preventDefault();
            selectTab(currentTabId);
            return;

          case " ":
            // Prevent page scroll; activation fires on keyUp
            e.preventDefault();
            return;

          default:
            return;
        }

        // Focus the target tab
        if (targetIndex >= 0 && targetIndex !== currentIndex) {
          const targetId = navTabIds[targetIndex];
          setFocusedTabId(targetId);
          focusTabById(targetId);
        }
      },
      [tabIds, visibleTabIds, tabsOverflowMode, overflowReady, disabledIds, selectTab, focusTabById]
    );

    // Handle Space key activation (fires on keyUp to avoid page scroll)
    const handleKeyUp = useCallback(
      (e: React.KeyboardEvent, currentTabId: string) => {
        if (e.key === " ") {
          e.preventDefault();
          selectTab(currentTabId);
        }
      },
      [selectTab]
    );

    // Handle tab focus
    const handleTabFocus = useCallback((tabId: string) => {
      setFocusedTabId(tabId);
    }, []);

    // Handle tab blur
    const handleTabBlur = useCallback((e: React.FocusEvent) => {
      // Only clear if focus is leaving the tab list entirely
      const relatedTarget = e.relatedTarget as Node | null;
      if (!tabListRef.current?.contains(relatedTarget)) {
        setFocusedTabId(null);
      }
    }, []);

    // Register tab
    const registerTab = useCallback((id: string, element: HTMLElement) => {
      tabRegistrations.current.set(id, { id, element, disabled: disabledIds.has(id) });
    }, [disabledIds]);

    // Unregister tab
    const unregisterTab = useCallback((id: string) => {
      tabRegistrations.current.delete(id);
    }, []);

    // Get tab index
    const getTabIndex = useCallback(
      (id: string) => tabIds.indexOf(id),
      [tabIds]
    );

    // Context value
    const contextValue = useMemo<TabContainerContextValue>(
      () => ({
        selectedTabId,
        selectTab,
        registerTab,
        unregisterTab,
        layout,
        collapsed,
        enableDragDrop,
        onTabMove,
        containerId,
        focusTab: focusTabById,
        getTabIndex,
        onKeyDown: handleKeyDown,
        onKeyUp: handleKeyUp,
        onTabFocus: handleTabFocus,
        onTabBlur: handleTabBlur,
        activeTabId,
        getDragProps,
        getDropIndicator,
        isDragging,
        isAnyDragging,
        draggedTabId,
        handleDragStart,
        handleDragEnd,
        handleDragOver,
        handleDragEnter,
        handleDragLeave,
        handleDrop,
        tabsPlacement,
        tabDisplayMode,
      }),
      [
        selectedTabId,
        selectTab,
        registerTab,
        unregisterTab,
        layout,
        collapsed,
        enableDragDrop,
        onTabMove,
        containerId,
        focusTabById,
        getTabIndex,
        handleKeyDown,
        handleKeyUp,
        handleTabFocus,
        handleTabBlur,
        activeTabId,
        getDragProps,
        getDropIndicator,
        isDragging,
        isAnyDragging,
        draggedTabId,
        handleDragStart,
        handleDragEnd,
        handleDragOver,
        handleDragEnter,
        handleDragLeave,
        handleDrop,
        tabsPlacement,
        tabDisplayMode,
      ]
    );

    // Imperative handle
    useImperativeHandle(ref, () => ({
      selectTab,
      getSelectedTabId: () => selectedTabId,
      getTabIds: () => tabIds,
      scrollToTab: (id: string) => {
        const registration = tabRegistrations.current.get(id);
        registration?.element?.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      },
      focus: () => {
        const tabToFocus = selectedTabId ?? tabIds[0];
        if (tabToFocus) {
          focusTabById(tabToFocus);
        }
      },
      get tabListElement() {
        return tabListRef.current;
      },
      get tabPanelElement() {
        return tabPanelRef.current;
      },
    }), [selectedTabId, tabIds, selectTab, focusTabById]);

    // Render tabs with internal props
    const renderedTabs = useMemo(() => {
      let tabIndex = 0;
      return Children.map(tabs, (child) => {
        if (!isValidElement(child)) return child;

        const displayName = (child.type as { displayName?: string })?.displayName;

        if (displayName === "Tab" || child.type === Tab) {
          const tabProps = child.props as TabInternalProps;
          const currentIndex = tabIndex;
          tabIndex++;

          // Only hide tabs when overflow is ready (measured)
          // Before ready, show all tabs so they can be measured
          const shouldHide = tabsOverflowMode && overflowReady && !visibleTabIds.includes(tabProps.id);

          // Use selectedTopLevelTabId for visual selection of parent tabs
          return cloneElement(child, {
            _selected: selectedTopLevelTabId === tabProps.id,
            _index: currentIndex,
            _posinset: currentIndex + 1,
            _setsize: tabIds.length,
            style: shouldHide
              ? { ...tabProps.style, display: "none" }
              : tabProps.style,
            "aria-hidden": shouldHide || undefined,
          } as Partial<TabInternalProps>);
        }

        return child;
      });
    }, [tabs, selectedTopLevelTabId, tabsOverflowMode, visibleTabIds, overflowReady]);

    // Get selected tab content
    const selectedTabContent = selectedTabId ? tabContents.get(selectedTabId) : null;
    const panelId = `${containerId}-panel`;
    const tabControlId = selectedTabId ? `${containerId}-tab-${selectedTabId}` : undefined;

    return (
      <TabContainerContext.Provider value={contextValue}>
        <div
          className={cn(
            containerVariants({ backgroundDesign: backgroundDesign as TabContainerBackgroundDesign }),
            "flex",
            isBottom ? "flex-col-reverse" : "flex-col",
            className
          )}
          style={style}
          data-testid={dataTestId}
          id={containerId}
        >
          {/* Tab List */}
          <div
            ref={tabListRef}
            role="tablist"
            aria-label={accessibleName}
            aria-labelledby={accessibleNameRef}
            aria-orientation="horizontal"
            className={cn(
              "fx-tab-list",
              tabListVariants({ layout: layout as TabLayout, hasOverflow: tabsOverflowMode && overflowReady }),
              headerBackgroundVariants({ backgroundDesign: effectiveHeaderBg }),
              isBottom && "border-b-0 border-t border-sapphire-border-primary",
            )}
          >
            {/* Start overflow button */}
            {tabsOverflowMode && overflowReady && hasStartOverflow && (
              <TabOverflowButton
                ref={startOverflowButtonRef}
                tabIds={startOverflowTabIds}
                tabs={tabs}
                selectedTabId={selectedTopLevelTabId}
                onSelect={selectTab}
                position="start"
                overflowMode={overflowMode}
                customTrigger={startOverflowButton}
                onArrowOut={() => {
                  const firstVisible = visibleTabIds.find(id => !disabledIds.has(id));
                  if (firstVisible) { setFocusedTabId(firstVisible); focusTabById(firstVisible); }
                }}
              />
            )}

            {/* Visible tabs */}
            {renderedTabs}

            {/* End overflow button */}
            {tabsOverflowMode && overflowReady && hasEndOverflow && (
              <TabOverflowButton
                ref={endOverflowButtonRef}
                tabIds={endOverflowTabIds}
                tabs={tabs}
                selectedTabId={selectedTopLevelTabId}
                onSelect={selectTab}
                position="end"
                overflowMode={overflowMode}
                customTrigger={overflowButton}
                onArrowOut={() => {
                  const lastVisible = [...visibleTabIds].reverse().find(id => !disabledIds.has(id));
                  if (lastVisible) { setFocusedTabId(lastVisible); focusTabById(lastVisible); }
                }}
              />
            )}
          </div>

          {/* Tab Panel with collapse/expand animation */}
          <div
            className={cn(
              "grid transition-[grid-template-rows] duration-300 ease-in-out",
              selectedTabContent ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            )}
          >
            <div className="overflow-hidden">
              <div
                ref={tabPanelRef}
                id={panelId}
                role="tabpanel"
                aria-labelledby={tabControlId}
                aria-hidden={!selectedTabContent || undefined}
                className={cn(
                  tabPanelVariants({ backgroundDesign: effectiveContentBg })
                )}
              >
                {selectedTabContent}
              </div>
            </div>
          </div>
        </div>
      </TabContainerContext.Provider>
    );
  }
