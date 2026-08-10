import * as React from "react";
import "./Tab.css";
import { useContext, useRef, useId, useCallback, useState, Children, isValidElement, type Ref } from "react";
import { cn, cva, type VariantProps } from "../../lib/utils";
import { TabProps, TabSemanticDesign, TabContainerContextValue, TabLayout, TabsPlacement } from "../../types/tabs";
import { useTranslation } from "react-i18next";
import { SlimArrowDownIcon } from "../../icons/SlimArrowDown";
import { StatusPositiveIcon } from "../../icons/StatusPositive";
import { ErrorIcon } from "../../icons/Error";
import { WarningIcon } from "../../icons/Warning";
import { ResponsivePopover } from "../responsive-popover/ResponsivePopover";
import { PopoverPlacement, PopoverHorizontalAlign } from "../../types/popover";
import { Button } from "../button/Button";

// ============================================================================
// VARIANTS
// ============================================================================

const tabVariants = cva(
  [
    "relative inline-flex items-center justify-center whitespace-nowrap",
    "px-4 py-2 text-sm font-medium",
    "transition-colors duration-200",
    "cursor-pointer select-none",
    "border-transparent",
  ],
  {
    variants: {
      design: {
        [TabSemanticDesign.Default]: [
          "text-sapphire-text-tertiary",
          "hover:text-sapphire-text-primary hover:bg-muted/50",
        ],
        [TabSemanticDesign.Positive]: [
          "text-sapphire-positive",
          "hover:text-sapphire-positive/80 hover:bg-sapphire-positive-bg",
          "data-[selected=true]:text-sapphire-positive data-[selected=true]:border-sapphire-positive",
        ],
        [TabSemanticDesign.Negative]: [
          "text-sapphire-negative",
          "hover:text-sapphire-negative/80 hover:bg-sapphire-negative/10",
        ],
        [TabSemanticDesign.Critical]: [
          "text-sapphire-warning",
          "hover:text-sapphire-warning/80 hover:bg-sapphire-warning-bg",
          "data-[selected=true]:text-sapphire-warning data-[selected=true]:border-sapphire-warning",
        ],
        [TabSemanticDesign.Neutral]: [
          "text-sapphire-text-tertiary",
          "hover:text-sapphire-text-primary hover:bg-muted/50",
        ],
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed pointer-events-none",
        false: "",
      },
      collapsed: {
        true: "px-3",
        false: "",
      },
    },
    defaultVariants: {
      design: TabSemanticDesign.Default,
      disabled: false,
      collapsed: false,
    },
  }
);

// ============================================================================
// CONTEXT
// ============================================================================

export const TabContainerContext = React.createContext<TabContainerContextValue | null>(null);

export function useTabContainerContext() {
  const context = useContext(TabContainerContext);
  if (!context) {
    throw new Error("Tab must be used within a TabContainer");
  }
  return context;
}

// ============================================================================
// HELPERS
// ============================================================================

/** Get the selected border color class for a given design */
function getSelectedBorderColor(design: string): string {
  switch (design) {
    case TabSemanticDesign.Positive: return "border-sapphire-positive";
    case TabSemanticDesign.Negative: return "border-sapphire-negative";
    case TabSemanticDesign.Critical: return "border-sapphire-warning";
    case TabSemanticDesign.Neutral: return "border-sapphire-text-tertiary";
    default: return "border-sapphire-border-accent";
  }
}

/** Get the selected text color class for a given design */
function getSelectedTextColor(design: string): string {
  switch (design) {
    case TabSemanticDesign.Positive: return "text-sapphire-positive";
    case TabSemanticDesign.Negative: return "text-sapphire-negative";
    case TabSemanticDesign.Critical: return "text-sapphire-warning";
    case TabSemanticDesign.Neutral: return "text-sapphire-text-tertiary";
    default: return "text-sapphire-text-primary";
  }
}

/** Get semantic status icon component and color */
function getSemanticIcon(design: string) {
  switch (design) {
    case TabSemanticDesign.Positive:
      return { Icon: StatusPositiveIcon, colorClass: "text-sapphire-positive" };
    case TabSemanticDesign.Negative:
      return { Icon: ErrorIcon, colorClass: "text-sapphire-negative" };
    case TabSemanticDesign.Critical:
      return { Icon: WarningIcon, colorClass: "text-sapphire-warning" };
    default:
      return null;
  }
}

// ============================================================================
// NESTED TAB ITEM (for dropdown)
// ============================================================================

interface NestedTabItemProps {
  tab: React.ReactElement;
  level: number;
  onSelect: (tabId: string) => void;
  selectedTabId: string | null;
  // Drag and drop props
  enableDragDrop?: boolean;
  onDrop?: (e: React.DragEvent, tabId: string, placement: "before" | "after" | "on") => void;
  onDragStart?: (e: React.DragEvent, tabId: string) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  draggedTabId?: string | null;
}

function NestedTabItem({
  tab,
  level,
  onSelect,
  selectedTabId,
  enableDragDrop,
  onDrop,
  onDragStart,
  onDragEnd,
  draggedTabId,
}: NestedTabItemProps) {
  const props = tab.props as TabProps;
  const isSelected = selectedTabId === props.id;
  const isBeingDragged = draggedTabId === props.id;

  // Local drop indicator state for vertical positioning
  const [localDropIndicator, setLocalDropIndicator] = useState<"before" | "after" | "on" | null>(null);

  // Recursively get sub-tabs - handle fragments
  const subTabElements: React.ReactElement[] = [];

  const extractTabs = (children: React.ReactNode) => {
    Children.forEach(children, (child) => {
      if (!isValidElement(child)) return;

      if (child.type === React.Fragment) {
        extractTabs((child.props as { children?: React.ReactNode }).children);
      } else {
        subTabElements.push(child as React.ReactElement);
      }
    });
  };

  if (props.subTabs) {
    extractTabs(props.subTabs);
  }

  // Handle drag over with vertical position detection
  const handleDragOver = useCallback((e: React.DragEvent) => {
    if (!enableDragDrop || isBeingDragged || draggedTabId === props.id) return;

    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";

    // Calculate drop position based on Y axis (vertical)
    // Top third = before, bottom third = after, middle third = on (nest)
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const relativeY = e.clientY - rect.top;
    const thirdHeight = rect.height / 3;

    let position: "before" | "after" | "on";
    if (relativeY < thirdHeight) {
      position = "before";
    } else if (relativeY > thirdHeight * 2) {
      position = "after";
    } else {
      position = "on";
    }

    setLocalDropIndicator(position);
  }, [enableDragDrop, isBeingDragged, draggedTabId, props.id]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    if (!enableDragDrop || isBeingDragged || draggedTabId === props.id) return;
    e.preventDefault();
    e.stopPropagation();
  }, [enableDragDrop, isBeingDragged, draggedTabId, props.id]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    if (!enableDragDrop) return;

    // Only clear if leaving the actual element (not entering a child)
    const relatedTarget = e.relatedTarget as Node | null;
    const currentTarget = e.currentTarget as Node;

    if (!relatedTarget || !currentTarget.contains(relatedTarget)) {
      setLocalDropIndicator(null);
    }
  }, [enableDragDrop]);

  const handleDropEvent = useCallback((e: React.DragEvent) => {
    if (!enableDragDrop || isBeingDragged || draggedTabId === props.id) return;

    e.preventDefault();
    e.stopPropagation();

    // Calculate final position
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const relativeY = e.clientY - rect.top;
    const thirdHeight = rect.height / 3;

    let placement: "before" | "after" | "on";
    if (relativeY < thirdHeight) {
      placement = "before";
    } else if (relativeY > thirdHeight * 2) {
      placement = "after";
    } else {
      placement = "on";
    }

    setLocalDropIndicator(null);
    onDrop?.(e, props.id, placement);
  }, [enableDragDrop, isBeingDragged, draggedTabId, props.id, onDrop]);

  return (
    <>
      <div className="relative">
        {/* Drop indicator - before (top line) */}
        {localDropIndicator === "before" && (
          <div className="absolute left-2 right-2 top-0 h-0.5 bg-sapphire-text-accent rounded-full z-10" />
        )}

        {/* Drop indicator - on (nesting) */}
        {localDropIndicator === "on" && (
          <div className="absolute inset-1 border-2 border-sapphire-border-accent border-dashed rounded-md z-10 pointer-events-none bg-sapphire-text-accent/10" />
        )}

        <button
          type="button"
          draggable={enableDragDrop && !props.disabled}
          onClick={() => {
            if (!props.disabled && props.children) {
              onSelect(props.id);
            }
          }}
          disabled={props.disabled}
          onDragStart={enableDragDrop ? (e) => onDragStart?.(e, props.id) : undefined}
          onDragEnd={enableDragDrop ? onDragEnd : undefined}
          onDragOver={enableDragDrop ? handleDragOver : undefined}
          onDragEnter={enableDragDrop ? handleDragEnter : undefined}
          onDragLeave={enableDragDrop ? handleDragLeave : undefined}
          onDrop={enableDragDrop ? handleDropEvent : undefined}
          className={cn(
            "w-full text-left px-3 py-2 text-sm",
            "hover:bg-muted/50 focus:outline-none focus:bg-muted/50",
            "flex items-center gap-2",
            isSelected && "bg-muted font-medium",
            props.disabled && "opacity-50 cursor-not-allowed",
            isBeingDragged && "opacity-50",
            enableDragDrop && !props.disabled && "cursor-grab active:cursor-grabbing"
          )}
          style={{ paddingLeft: `${12 + level * 16}px` }}
        >
          {/* Semantic design indicator */}
          {props.design && props.design !== TabSemanticDesign.Default && props.design !== TabSemanticDesign.Neutral && (
            <span
              className={cn(
                "w-2 h-2 rounded-full flex-shrink-0",
                props.design === TabSemanticDesign.Positive && "bg-sapphire-positive",
                props.design === TabSemanticDesign.Negative && "bg-sapphire-negative",
                props.design === TabSemanticDesign.Critical && "bg-sapphire-warning"
              )}
            />
          )}

          {/* Icon */}
          {props.icon && <span className="flex-shrink-0">{props.icon}</span>}

          {/* Text */}
          <span className="flex-1">{props.text}</span>

          {/* Additional text */}
          {props.additionalText && (
            <span className="text-xs text-sapphire-text-tertiary">{props.additionalText}</span>
          )}
        </button>

        {/* Drop indicator - after (bottom line) */}
        {localDropIndicator === "after" && (
          <div className="absolute left-2 right-2 bottom-0 h-0.5 bg-sapphire-text-accent rounded-full z-10" />
        )}
      </div>

      {/* Render sub-tabs recursively */}
      {subTabElements.map((subTab) => (
        <NestedTabItem
          key={(subTab.props as TabProps).id}
          tab={subTab}
          level={level + 1}
          onSelect={onSelect}
          selectedTabId={selectedTabId}
          enableDragDrop={enableDragDrop}
          onDrop={onDrop}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          draggedTabId={draggedTabId}
        />
      ))}
    </>
  );
}

// ============================================================================
// NESTED TABS DROPDOWN
// ============================================================================

interface NestedTabsDropdownProps {
  subTabs: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (tabId: string) => void;
  selectedTabId: string | null;
  anchorRef: React.RefObject<HTMLElement>;
  // Drag and drop props
  enableDragDrop?: boolean;
  onDropTab?: (tabId: string, placement: "before" | "after" | "on") => void;
  onDragStart?: (e: React.DragEvent, tabId: string) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  draggedTabId?: string | null;
}

function NestedTabsDropdown({
  subTabs,
  isOpen,
  onClose,
  onSelect,
  selectedTabId,
  anchorRef,
  enableDragDrop,
  onDropTab,
  onDragStart,
  onDragEnd,
  draggedTabId,
}: NestedTabsDropdownProps) {
  const { t } = useTranslation("fx");
  // Handle drop from NestedTabItem
  const handleNestedDrop = useCallback((_e: React.DragEvent, tabId: string, placement: "before" | "after" | "on") => {
    onDropTab?.(tabId, placement);
    onClose();
  }, [onDropTab, onClose]);

  // Extract tab elements - handle fragments and direct children
  const tabElements: React.ReactElement[] = [];
  const extractTabs = (children: React.ReactNode) => {
    Children.forEach(children, (child) => {
      if (!isValidElement(child)) return;
      if (child.type === React.Fragment) {
        extractTabs((child.props as { children?: React.ReactNode }).children);
      } else {
        tabElements.push(child as React.ReactElement);
      }
    });
  };
  extractTabs(subTabs);

  return (
    <ResponsivePopover
      open={isOpen}
      opener={anchorRef}
      placement={PopoverPlacement.Bottom}
      horizontalAlign={PopoverHorizontalAlign.Start}
      hideArrow
      showCloseButton={false}
      contentOnlyOnDesktop
      footer={
        <div className="flex justify-end px-4 py-2">
          <Button design="Tertiary" onClick={onClose}>{t("CANCEL")}</Button>
        </div>
      }
      onClose={onClose}
      accessibleRole="None"
    >
      <div className="-mx-4 -my-3 min-w-[200px] max-h-[300px] overflow-auto py-1">
        {tabElements.map((tab) => (
          <NestedTabItem
            key={(tab.props as TabProps).id}
            tab={tab}
            level={0}
            onSelect={(tabId) => {
              onSelect(tabId);
              onClose();
            }}
            selectedTabId={selectedTabId}
            enableDragDrop={enableDragDrop}
            onDrop={handleNestedDrop}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            draggedTabId={draggedTabId}
          />
        ))}
      </div>
    </ResponsivePopover>
  );
}

// ============================================================================
// TAB COMPONENT
// ============================================================================

export interface TabInternalProps extends TabProps {
  /** Internal: Whether this tab is selected (managed by TabContainer) */
  _selected?: boolean;
  /** Internal: Index of this tab */
  _index?: number;
  /** Internal: 1-based position in the tab list (for aria-posinset) */
  _posinset?: number;
  /** Internal: Total number of tabs in the list (for aria-setsize) */
  _setsize?: number;
}

/**
 * Tab component
 *
 * A single tab item within a TabContainer.
 * Supports text, icon, additional text (badge), semantic color designs, and nested sub-tabs.
 */
export function Tab(props: TabInternalProps & { ref?: Ref<HTMLButtonElement> }) {
    const {
      ref,
      id,
      text,
      icon,
      additionalText,
      disabled = false,
      design = TabSemanticDesign.Default,
      movable = true,
      subTabs,
      tooltip,
      accessibleDescription,
      children: _children,
      className,
      style,
      "data-testid": dataTestId,
      _selected,
      _posinset,
      _setsize,
    } = props;

    // Get context
    const context = useContext(TabContainerContext);

    // State for dropdown
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Refs
    const internalRef = useRef<HTMLButtonElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const { t } = useTranslation("fx");

    // Generate unique IDs
    const generatedId = useId();
    const tabId = id || generatedId;
    const panelId = `${context?.containerId || "tabs"}-panel`;

    // Determine selection state
    const isSelected = _selected ?? (context?.selectedTabId === tabId);
    const isCollapsed = context?.collapsed ?? false;
    const tabLayout = context?.layout ?? TabLayout.Inline;
    const isStandard = String(tabLayout) === TabLayout.Standard;
    const placement = context?.tabsPlacement ?? TabsPlacement.Top;
    const isBottomPlacement = String(placement) === TabsPlacement.Bottom;
    const tabDisplayMode = context?.tabDisplayMode ?? "text-only";

    // Roving tabindex - only the active tab gets tabIndex=0
    const isActiveTab = context?.activeTabId === tabId;

    // Determine if this tab has sub-tabs and/or own content
    const hasSubTabs = !!subTabs && Children.count(subTabs) > 0;
    const hasOwnContent = !!_children;

    // Two-click area: has both sub-tabs and own content
    // Single-click area: has only sub-tabs, no own content
    const isTwoClickArea = hasSubTabs && hasOwnContent;
    const isSingleClickArea = hasSubTabs && !hasOwnContent;

    // Drag and drop state
    const isDragDropEnabled = context?.enableDragDrop ?? false;
    const dragProps = isDragDropEnabled && movable
      ? context?.getDragProps?.(tabId, movable) ?? {}
      : {};
    const dropIndicator = context?.getDropIndicator?.(tabId);
    const isBeingDragged = context?.isDragging?.(tabId) ?? false;
    const isAnyDragging = context?.isAnyDragging ?? false;

    // Timer ref for auto-opening dropdown during drag
    const dragOpenTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Auto-open dropdown when dragging over a tab with sub-tabs
    React.useEffect(() => {
      // If we're being dragged over (drop indicator is set) and we have sub-tabs
      // and something is being dragged (but not this tab), open dropdown after delay
      if (
        hasSubTabs &&
        isAnyDragging &&
        !isBeingDragged &&
        dropIndicator === "on"
      ) {
        dragOpenTimerRef.current = setTimeout(() => {
          setIsDropdownOpen(true);
        }, 400); // 400ms delay before opening
      } else {
        // Clear timer if conditions no longer met
        if (dragOpenTimerRef.current) {
          clearTimeout(dragOpenTimerRef.current);
          dragOpenTimerRef.current = null;
        }
      }

      return () => {
        if (dragOpenTimerRef.current) {
          clearTimeout(dragOpenTimerRef.current);
        }
      };
    }, [hasSubTabs, isAnyDragging, isBeingDragged, dropIndicator]);

    // Close dropdown when drag ends
    React.useEffect(() => {
      if (!isAnyDragging && dragOpenTimerRef.current) {
        clearTimeout(dragOpenTimerRef.current);
        dragOpenTimerRef.current = null;
      }
    }, [isAnyDragging]);

    // Register with context on mount
    React.useLayoutEffect(() => {
      const element = internalRef.current;
      if (context && element) {
        context.registerTab(tabId, element);
        return () => {
          context.unregisterTab(tabId);
        };
      }
    }, [context, tabId]);

    // Sync forwarded ref
    React.useImperativeHandle(ref, () => internalRef.current!, []);

    // Handle main button click
    const handleClick = useCallback(() => {
      if (disabled) return;

      if (isSingleClickArea) {
        // Only sub-tabs, no content - toggle dropdown
        setIsDropdownOpen((prev) => !prev);
      } else if (context) {
        // Has content - select this tab
        context.selectTab(tabId);
      }
    }, [disabled, isSingleClickArea, context, tabId]);

    // Handle expand button click (for two-click area)
    const handleExpandClick = useCallback((e: React.MouseEvent) => {
      e.stopPropagation();
      if (!disabled) {
        setIsDropdownOpen((prev) => !prev);
      }
    }, [disabled]);

    // Handle sub-tab selection from dropdown
    const handleSubTabSelect = useCallback((selectedTabId: string) => {
      if (context) {
        context.selectTab(selectedTabId);
      }
    }, [context]);

    // Handle drop on dropdown item - needs to call onTabMove via context
    const handleDropdownDrop = useCallback((destinationTabId: string, placement: "before" | "after" | "on") => {
      if (!context?.draggedTabId || !context?.onTabMove) return;

      const sourceTabId = context.draggedTabId;

      // We need to trigger the move through the context
      // The TabContainer's onTabMove expects a TabMoveDetail
      context.onTabMove({
        sourceTabId,
        sourceIndex: -1, // Index not relevant for nested drops
        destinationTabId,
        destinationIndex: -1, // Index not relevant for nested drops
        placement,
      });
    }, [context]);

    // Handle keydown - delegate to container's keyboard handler
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
      // ArrowDown opens the sub-tab dropdown locally (don't delegate to container)
      if (e.key === "ArrowDown" && hasSubTabs) {
        e.preventDefault();
        setIsDropdownOpen(true);
        return;
      }
      if (context?.onKeyDown) {
        context.onKeyDown(e, tabId);
      }
    }, [context, tabId, hasSubTabs]);

    // Handle keyup - Space activates on keyUp (prevents page scroll on keyDown)
    const handleKeyUp = useCallback((e: React.KeyboardEvent) => {
      // For single-click area tabs, Space toggles the dropdown via native click — don't also selectTab
      if (isSingleClickArea) return;
      if (context?.onKeyUp) {
        context.onKeyUp(e, tabId);
      }
    }, [context, tabId, isSingleClickArea]);

    // Handle focus - notify container
    const handleFocus = useCallback(() => {
      if (context?.onTabFocus) {
        context.onTabFocus(tabId);
      }
    }, [context, tabId]);

    // Handle blur - notify container
    const handleBlur = useCallback((e: React.FocusEvent) => {
      if (context?.onTabBlur) {
        context.onTabBlur(e);
      }
    }, [context]);

    return (
      <div ref={containerRef} className="fx-tab-item relative inline-flex">
        {/* Drop indicator - before */}
        {dropIndicator === "before" && (
          <div className="absolute left-0 top-1 bottom-1 w-0.5 bg-sapphire-text-accent rounded-full z-10 -translate-x-1" />
        )}

        {/* Drop indicator - on (nesting) */}
        {dropIndicator === "on" && (
          <div className="absolute inset-0 border-2 border-sapphire-border-accent border-dashed rounded-md z-10 pointer-events-none bg-sapphire-text-accent/10" />
        )}

        <div className="inline-flex">
          {/* Main tab button */}
          <button
            ref={internalRef}
            id={`${context?.containerId || "tabs"}-tab-${tabId}`}
            role="tab"
            type="button"
            aria-selected={isSelected}
            aria-controls={hasOwnContent ? panelId : undefined}
            aria-disabled={disabled || undefined}
            aria-expanded={isSingleClickArea ? isDropdownOpen : undefined}
            aria-haspopup={isSingleClickArea ? "menu" : undefined}
            aria-roledescription={isTwoClickArea ? "Split Tab" : undefined}
            aria-posinset={_posinset}
            aria-setsize={_setsize}
            aria-describedby={accessibleDescription ? `${tabId}-desc` : undefined}
            tabIndex={isActiveTab ? 0 : -1}
            title={tooltip}
            disabled={disabled}
            data-selected={isSelected}
            data-tab-id={tabId}
            data-movable={movable}
            data-dragging={isBeingDragged || undefined}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={cn(
              tabVariants({
                design: design as TabSemanticDesign,
                disabled,
                collapsed: isCollapsed,
              }),
              // Border placement: top or bottom depending on tabsPlacement
              isBottomPlacement ? "border-t-2" : "border-b-2",
              // Selected state: border color + text color
              isSelected && getSelectedBorderColor(design),
              isSelected && getSelectedTextColor(design),
              // Standard layout: vertical stacking
              isStandard && !isCollapsed && "flex-col items-center gap-0.5 py-2.5",
              // Text-only mode: compact padding
              tabDisplayMode === "text-only" && !isStandard && "py-1.5",
              isTwoClickArea && "pr-1", // Less padding on right for expand button
              isBeingDragged && "opacity-50",
              isDragDropEnabled && movable && !disabled && "cursor-grab active:cursor-grabbing",
              className
            )}
            style={style}
            data-testid={dataTestId}
            {...(isTwoClickArea ? {} : dragProps)}
          >
            {/* Semantic status icon */}
            {(() => {
              const semanticInfo = getSemanticIcon(design);
              if (!semanticInfo) return null;
              const { Icon: SemanticIcon, colorClass } = semanticInfo;
              return <SemanticIcon className={cn("h-3 w-3 flex-shrink-0", colorClass)} />;
            })()}

            {/* Icon */}
            {icon && (
              <span className={cn(
                "flex-shrink-0",
                !isStandard && text && !isCollapsed && "mr-2"
              )}>
                {icon}
              </span>
            )}

            {/* Text (hidden in collapsed mode) */}
            {!isCollapsed && text && <span>{text}</span>}

            {/* Single-click area dropdown icon (embedded in text) */}
            {isSingleClickArea && !isCollapsed && (
              <SlimArrowDownIcon
                className={cn(
                  "ml-1 h-4 w-4 transition-transform",
                  isDropdownOpen && "rotate-180"
                )}
              />
            )}

            {/* Additional text (badge) */}
            {!isCollapsed && additionalText && (
              <span
                className={cn(
                  "inline-flex items-center justify-center",
                  // Mixed mode: tabs without icon get large prominent additionalText
                  tabDisplayMode === "mixed" && !icon
                    ? "text-[1.5rem] font-bold leading-none"
                    : cn(
                        isStandard ? "text-xs" : "ml-2",
                        "px-2 py-0.5 text-xs rounded-full",
                        "bg-muted text-sapphire-text-tertiary",
                        design === TabSemanticDesign.Positive && "bg-sapphire-positive-bg text-sapphire-positive",
                        design === TabSemanticDesign.Negative && "bg-sapphire-negative/10 text-sapphire-negative",
                        design === TabSemanticDesign.Critical && "bg-sapphire-warning-bg text-sapphire-warning"
                      )
                )}
              >
                {additionalText}
              </span>
            )}

            {/* Hidden description for screen readers */}
            {accessibleDescription && (
              <span id={`${tabId}-desc`} className="sr-only">
                {accessibleDescription}
              </span>
            )}
          </button>

          {/* Two-click area: separate expand button */}
          {isTwoClickArea && (
            <>
              {/* Separator */}
              <div className="w-px h-4 bg-sapphire-border-primary self-center" />

              {/* Expand button */}
              <button
                type="button"
                onClick={handleExpandClick}
                disabled={disabled}
                aria-expanded={isDropdownOpen}
                aria-haspopup="menu"
                aria-label={t("TAB_SHOW_SUBTABS")}
                tabIndex={-1}
                className={cn(
                  "inline-flex items-center justify-center",
                  "px-1 py-2",
                  "text-sapphire-text-tertiary hover:text-sapphire-text-primary",
                  "hover:bg-muted/50",
                  "focus:outline-none focus:ring-2 focus:ring-ring",
                  isBottomPlacement ? "border-t-2 border-transparent" : "border-b-2 border-transparent",
                  isSelected && (isBottomPlacement ? "border-t-2" : "border-b-2"),
                  isSelected && getSelectedBorderColor(design),
                  disabled && "opacity-50 cursor-not-allowed"
                )}
                {...dragProps}
              >
                <SlimArrowDownIcon
                  className={cn(
                    "h-4 w-4 transition-transform",
                    isDropdownOpen && "rotate-180"
                  )}
                />
              </button>
            </>
          )}
        </div>

        {/* Drop indicator - after */}
        {dropIndicator === "after" && (
          <div className="absolute right-0 top-1 bottom-1 w-0.5 bg-sapphire-text-accent rounded-full z-10 translate-x-1" />
        )}

        {/* Dropdown for sub-tabs */}
        {hasSubTabs && (
          <NestedTabsDropdown
            subTabs={subTabs}
            isOpen={isDropdownOpen}
            onClose={() => setIsDropdownOpen(false)}
            onSelect={handleSubTabSelect}
            selectedTabId={context?.selectedTabId ?? null}
            anchorRef={containerRef as React.RefObject<HTMLElement>}
            enableDragDrop={isDragDropEnabled}
            onDropTab={handleDropdownDrop}
            onDragStart={context?.handleDragStart}
            onDragEnd={context?.handleDragEnd}
            draggedTabId={context?.draggedTabId}
          />
        )}
      </div>
    );
  }

Tab.displayName = "Tab";

// Export variant types for external use
export type TabVariantProps = VariantProps<typeof tabVariants>;
