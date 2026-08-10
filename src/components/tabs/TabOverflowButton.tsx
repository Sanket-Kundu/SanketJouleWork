import * as React from "react";
import { useState, useRef, useCallback, isValidElement, cloneElement, type Ref } from "react";
import { cn } from "../../lib/utils";
import { SlimArrowDownIcon } from "../../icons/SlimArrowDown";
import { TabProps, TabOverflowMode } from "../../types/tabs";
import { ResponsivePopover } from "../responsive-popover/ResponsivePopover";
import { PopoverPlacement, PopoverHorizontalAlign } from "../../types/popover";
import { List, ListItem } from "../list/index";
import { Button } from "../button/Button";
import { useTranslation } from "react-i18next";

// ============================================================================
// TYPES
// ============================================================================

export interface TabOverflowButtonProps {
  /** Tab IDs in the overflow */
  tabIds: string[];
  /** Tab data for rendering menu items */
  tabs: React.ReactElement[];
  /** Currently selected tab ID */
  selectedTabId: string | null;
  /** Called when a tab is selected from overflow */
  onSelect: (tabId: string) => void;
  /** Position of the overflow button */
  position: "start" | "end";
  /** Overflow mode — affects button label */
  overflowMode: TabOverflowMode | `${TabOverflowMode}`;
  /** Called when arrow key should move focus back into the tab strip */
  onArrowOut?: () => void;
  /** Custom trigger element to replace the default button */
  customTrigger?: React.ReactNode;
  /** Additional class name */
  className?: string;
}

// ============================================================================
// OVERFLOW BUTTON
// ============================================================================

/**
 * TabOverflowButton component
 * Renders an overflow button with dropdown menu for hidden tabs
 */
export function TabOverflowButton({ tabIds, tabs, selectedTabId, onSelect, position, overflowMode, onArrowOut, customTrigger, className, ref }: TabOverflowButtonProps & { ref?: Ref<HTMLButtonElement> }) {
    const { t } = useTranslation("fx");
    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Sync forwarded ref
    React.useImperativeHandle(ref, () => buttonRef.current!, []);

    // Filter tabs to only those in overflow
    const overflowTabs = tabs.filter((tab) => {
      const props = tab.props as TabProps;
      return tabIds.includes(props.id);
    });

    // Check if any overflowed tab is selected
    const hasSelectedInOverflow = selectedTabId && tabIds.includes(selectedTabId);

    const handleClick = useCallback(() => {
      setIsOpen((prev) => !prev);
    }, []);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        if (e.key === "ArrowDown") {
          // ArrowDown always opens the dropdown regardless of position
          setIsOpen(true);
        } else {
          const isRTL = document.documentElement.dir === "rtl";
          // Arrow toward visible tabs → onArrowOut; arrow away from tabs → open dropdown
          const towardTabs =
            position === "end"
              ? (isRTL ? "ArrowRight" : "ArrowLeft")
              : (isRTL ? "ArrowLeft" : "ArrowRight");
          const awayFromTabs =
            position === "end"
              ? (isRTL ? "ArrowLeft" : "ArrowRight")
              : (isRTL ? "ArrowRight" : "ArrowLeft");

          if (e.key === towardTabs) {
            onArrowOut?.();
          } else if (e.key === awayFromTabs) {
            setIsOpen(true);
          }
        }
        // ArrowUp: no action (symmetric - no popover trigger on ArrowUp)
      }
    }, [position, onArrowOut]);

    if (tabIds.length === 0) return null;

    // In End-only mode: end button shows "More", start never exists
    // In StartAndEnd mode: both buttons show +N
    const isStartAndEnd = overflowMode === TabOverflowMode.StartAndEnd;
    const label = (position === "end" && !isStartAndEnd) ? t("TAB_MORE") : `+${tabIds.length}`;

    return (
      <>
        {customTrigger && isValidElement(customTrigger) ? (
          cloneElement(customTrigger as React.ReactElement<Record<string, unknown>>, {
            ref: buttonRef,
            onClick: handleClick,
            onKeyDown: handleKeyDown,
            "aria-expanded": isOpen,
            "aria-haspopup": "menu",
            "aria-label": position === "start" ? t("TAB_MORE_TABS_START") : t("TAB_MORE_TABS"),
          })
        ) : (
          <button
            ref={buttonRef}
            type="button"
            tabIndex={-1}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            aria-expanded={isOpen}
            aria-haspopup="menu"
            aria-label={position === "start" ? t("TAB_MORE_TABS_START") : t("TAB_MORE_TABS")}
            className={cn(
              "inline-flex items-center justify-center gap-1",
              "px-3 py-2 text-sm font-medium",
              "text-sapphire-text-secondary hover:text-sapphire-text-primary",
              "hover:bg-muted/50",
              "border-b-2 border-transparent",
              "relative focus:outline-none fx-tab-item",
              "transition-colors duration-200",
              "flex-shrink-0",
              "fx-tab-overflow-btn",
              hasSelectedInOverflow && "text-sapphire-text-accent border-sapphire-border-accent",
              className
            )}
          >
            {label}
            {position === "end" && <SlimArrowDownIcon className="h-3 w-3" />}
          </button>
        )}

        <ResponsivePopover
          open={isOpen}
          opener={buttonRef}
          placement={PopoverPlacement.Bottom}
          horizontalAlign={position === "end" ? PopoverHorizontalAlign.End : PopoverHorizontalAlign.Start}
          hideArrow
          noPadding
          showCloseButton={false}
          contentOnlyOnDesktop
          footer={
            <div className="flex justify-end px-4 py-2">
              <Button design="Tertiary" onClick={() => setIsOpen(false)}>{t("CANCEL")}</Button>
            </div>
          }
          onClose={() => setIsOpen(false)}
          accessibleRole="None"
        >
          <div className="min-w-[200px] max-h-[300px] overflow-auto">
            <List selectionMode="None" separators="None">
              {overflowTabs.map((tab) => {
              const tabProps = tab.props as TabProps;
              const isSelected = selectedTabId === tabProps.id;
              return (
                <ListItem
                  key={tabProps.id}
                  itemKey={tabProps.id}
                  text={tabProps.text ?? ""}
                  icon={tabProps.icon}
                  additionalText={tabProps.additionalText}
                  disabled={tabProps.disabled}
                  selected={isSelected}
                  onClick={() => {
                    if (!tabProps.disabled) {
                      onSelect(tabProps.id);
                      setIsOpen(false);
                    }
                  }}
                />
              );
            })}
            </List>
          </div>
        </ResponsivePopover>
      </>
    );
  }
