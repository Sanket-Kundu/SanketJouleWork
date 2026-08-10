import React, { useState, useRef, useCallback } from "react";
import { NavigationDownArrowIcon } from "../../icons/NavigationDownArrow";
import { ResponsivePopover } from "../responsive-popover/ResponsivePopover";
import { PopoverPlacement, PopoverHorizontalAlign } from "../../types/popover";
import { List, ListItem } from "../list";
import { Button } from "../button/Button";
import { useTranslation } from "react-i18next";
import './Tabbar.css';

export interface TabbarOverflowButtonProps {
  /** Ref for imperative access */
  ref?: React.Ref<HTMLButtonElement>;
  /** Tab items in the overflow */
  tabs: Array<{ id: string; label: string }>;
  /** Currently selected tab ID */
  selectedTabId: string;
  /** Called when a tab is selected from overflow */
  onSelect: (tabId: string) => void;
  /** Whether this button is the focused item in roving tabindex */
  isFocused?: boolean;
  /** Called when the button receives focus */
  onFocus?: () => void;
  /** The sentinel ID used for this button in the roving tabindex (for data-tab-id) */
  overflowId?: string;
  /** Keydown handler — forwarded from the tablist for arrow navigation */
  onKeyDown?: (e: React.KeyboardEvent) => void;
  /** Additional class name */
  className?: string;
}

/**
 * TabbarOverflowButton component
 * Renders an overflow "More" button with dropdown menu for hidden tabs
 */
export function TabbarOverflowButton({ tabs, selectedTabId, onSelect, isFocused, onFocus, overflowId, onKeyDown, className, ref }: TabbarOverflowButtonProps) {
    const { t } = useTranslation("fx");
    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Sync forwarded ref
    React.useImperativeHandle(ref, () => buttonRef.current!, []);

    // Check if any overflowed tab is selected
    const hasSelectedInOverflow = tabs.some(tab => tab.id === selectedTabId);

    const handleClick = useCallback(() => {
      setIsOpen((prev) => !prev);
    }, []);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
      const isRTL = document.documentElement.dir === "rtl";
      const openKey = isRTL ? 'ArrowLeft' : 'ArrowRight';
      if (e.key === 'ArrowDown' || e.key === openKey) {
        e.preventDefault();
        e.stopPropagation();
        setIsOpen(true);
        return;
      }
      onKeyDown?.(e);
    }, [onKeyDown]);

    if (tabs.length === 0) return null;

    return (
      <>
        <div className="fx-tabbar-item">
          <button
            ref={buttonRef}
            type="button"
            tabIndex={isFocused ? 0 : -1}
            onClick={handleClick}
            onFocus={onFocus}
            onKeyDown={handleKeyDown}
            data-tab-id={overflowId}
            aria-expanded={isOpen}
            aria-haspopup="menu"
            aria-label={t("TABBAR_MORE_TABS")}
            className={`flex h-full items-center p-2 cursor-pointer bg-transparent border-0 border-b-2 transition-colors gap-1 focus:outline-none border-transparent ${
              hasSelectedInOverflow || false
                ? 'font-semibold'
                : 'font-normal hover:font-semibold'
            } ${className || ''}`}
          >
            <span
              className="text-sm text-center whitespace-nowrap text-foreground after:content-[attr(data-text)] after:font-semibold after:block after:h-0 after:overflow-hidden after:invisible"
              data-text={t("TABBAR_MORE")}
            >
              {t("TABBAR_MORE")}
            </span>
            <NavigationDownArrowIcon className="h-5 w-5 text-foreground" />
          </button>
        </div>

        <ResponsivePopover
          open={isOpen}
          opener={buttonRef}
          placement={PopoverPlacement.Bottom}
          horizontalAlign={PopoverHorizontalAlign.End}
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
          <div className="min-w-[200px] max-h-[300px] overflow-auto p-0.5">
            <List selectionMode="None" separators="None">
              {tabs.map((tab) => {
                const isSelected = selectedTabId === tab.id;
                return (
                  <ListItem
                    key={tab.id}
                    itemKey={tab.id}
                    text={tab.label}
                    selected={isSelected}
                    onClick={() => {
                      onSelect(tab.id);
                      setIsOpen(false);
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
