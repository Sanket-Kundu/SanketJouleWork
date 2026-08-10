import {
  useRef,
  useImperativeHandle,
  useCallback,
  useEffect,
  useState,
} from "react";
import React from "react";
import { cn } from "../../lib/utils";
import { AddIcon } from "../../icons/Add";
import { Button } from "../button/Button";
import { FxSideNavigationItemProps } from "../../types/fx";
import { ButtonClickEventDetail } from "../../types/button";
import { useFxSideNavigationContext } from "./FxSideNavigationContext";
import { useFlyoutState, useItemInteractions } from "./FxSideNavigationItem.hooks";
import { useTranslation } from "react-i18next";

/** Helper to compute element className - extracted to reduce cognitive complexity */
function getElementClassName(opts: {
  settledCollapsed: boolean;
  canShowAddButton: boolean;
  selected: boolean;
  disabled: boolean;
  showForcedFocusRing: boolean;
  showFlyout: boolean;
  isFixedSection: boolean;
  hasSelectedIcon: boolean;
  hasAvatar: boolean;
  className?: string;
}) {
  const {
    settledCollapsed, canShowAddButton, selected, disabled,
    showForcedFocusRing, showFlyout, isFixedSection, hasSelectedIcon, hasAvatar, className
  } = opts;

  const useJouleTheme = hasSelectedIcon || isFixedSection;
  const selectedBg = useJouleTheme ? "bg-sapphire-joule-background-area-2" : "bg-sapphire-chrome-button-bg-selected";
  const selectedText = useJouleTheme ? "text-sapphire-text-accent-3" : "text-sapphire-text-accent";
  const focusRingClasses = useJouleTheme
    ? "focus-visible:ring-2 focus-visible:ring-sapphire-border-joule"
    : "focus-visible:ring-2 focus-visible:ring-sapphire-border-focus";
  const forcedRingClasses = useJouleTheme
    ? "ring-2 ring-sapphire-border-joule"
    : "ring-2 ring-sapphire-border-focus";

  return cn(
    "fx-side-nav-item relative",
    "flex items-center text-sm rounded cursor-pointer no-underline overflow-hidden min-w-10",
    !settledCollapsed && "gap-3",
    !settledCollapsed && (canShowAddButton ? "flex-1" : "w-full"),
    selected ? selectedText : "text-sapphire-chrome-button-fg-default",
    "focus-visible:outline-none",
    !canShowAddButton && focusRingClasses,
    showForcedFocusRing && settledCollapsed && !showFlyout && forcedRingClasses,
    !hasAvatar && settledCollapsed && !showFlyout && !disabled && !selected && (useJouleTheme ? "hover:bg-sapphire-joule-background-light" : "hover:bg-sapphire-neutral-hover-background-2"),
    !hasAvatar && settledCollapsed && selected && !showFlyout && selectedBg,
    !hasAvatar && !settledCollapsed && !canShowAddButton && selected && selectedBg,
    !hasAvatar && !settledCollapsed && !canShowAddButton && !disabled && !selected && (useJouleTheme ? "hover:bg-sapphire-joule-background-light" : "hover:bg-sapphire-neutral-hover-background-2"),
    !hasAvatar && !settledCollapsed && !canShowAddButton && selected && !disabled && (useJouleTheme ? "hover:bg-sapphire-joule-background-light" : "hover:bg-sapphire-chrome-button-bg-selected"),
    settledCollapsed && showFlyout && "opacity-0",
    disabled && "opacity-50 cursor-not-allowed pointer-events-none",
    isFixedSection && "border-0 text-left",
    className
  );
}

/** Classes for the content wrapper div — extracted to keep the main render's
 * cognitive complexity within the SonarQube budget. */
function getContentClassName(opts: {
  settledCollapsed: boolean;
  canShowAddButton: boolean;
  selected: boolean;
  disabled: boolean;
  hasSelectedIcon: boolean;
  isAddButtonFocused: boolean;
}) {
  const { settledCollapsed, canShowAddButton, selected, disabled, hasSelectedIcon, isAddButtonFocused } = opts;
  const expandedWithAdd = !settledCollapsed && canShowAddButton;
  return cn(
    "relative flex items-center",
    expandedWithAdd && "gap-2 rounded pr-2.5",
    expandedWithAdd && selected && (hasSelectedIcon ? "bg-sapphire-joule-background-area-2" : "bg-sapphire-chrome-button-bg-selected"),
    expandedWithAdd && !disabled && !selected && (hasSelectedIcon ? "hover:bg-sapphire-joule-background-light" : "hover:bg-sapphire-neutral-hover-background-2"),
    expandedWithAdd && selected && !disabled && (hasSelectedIcon ? "hover:bg-sapphire-joule-background-light" : "hover:bg-sapphire-chrome-button-bg-selected"),
    expandedWithAdd && !isAddButtonFocused && (hasSelectedIcon
      ? "focus-within:ring-2 focus-within:ring-sapphire-border-joule focus-within:ring-offset-0"
      : "focus-within:ring-2 focus-within:ring-sapphire-border-focus focus-within:ring-offset-0"),
  );
}

export function FxSideNavigationItem({
  name,
  icon,
  selectedIcon,
  text,
  badge,
  showAddButton = false,
  addButtonTooltip,
  selected = false,
  disabled = false,
  locked = false,
  avatar,
  onClick,
  onAddClick,
  className,
  ariaRoleDescription,
  ref,
  "data-testid": dataTestId,
}: FxSideNavigationItemProps) {
    const { t } = useTranslation("fx");
    const itemRef = useRef<HTMLAnchorElement | HTMLButtonElement>(null);
    const flyoutRef = useRef<HTMLDivElement>(null);
    const skipFlyoutOnFocusRef = useRef(false);
    const focusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const rafRef = useRef<number | null>(null);
    const flagResetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [showForcedFocusRing, setShowForcedFocusRing] = useState(false);

    const context = useFxSideNavigationContext();
    const collapsed = context?.collapsed ?? false;
    const isTransitioning = context?.isTransitioning ?? false;
    const isFixedSection = context?.isFixedSection ?? false;

    const flyoutState = useFlyoutState(name, locked, disabled, skipFlyoutOnFocusRef);

    useEffect(() => {
      if (context?.registerItemRef && itemRef.current) {
        context.registerItemRef(name, itemRef.current);
        return () => context.registerItemRef(name, null);
      }
    }, [context, name]);

    useEffect(() => {
      return () => {
        if (focusTimerRef.current !== null) clearTimeout(focusTimerRef.current);
        if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        if (flagResetTimerRef.current !== null) clearTimeout(flagResetTimerRef.current);
      };
    }, []);

    const { handleClick, handleKeyDown } = useItemInteractions(
      name,
      disabled,
      onClick,
      flyoutState.setIsHovered,
      flyoutState.setIsFocused,
      itemRef
    );

    const { setIsAddButtonFocused, setIsHovered, setIsFocused } = flyoutState;

    const handleAddClick = useCallback(
      (detail: ButtonClickEventDetail) => {
        detail.originalEvent.stopPropagation();
        onAddClick?.();

        if (collapsed) {
          skipFlyoutOnFocusRef.current = true;
          setIsAddButtonFocused(false);
          setIsHovered(false);
          setIsFocused(false);

          focusTimerRef.current = setTimeout(() => {
            itemRef.current?.blur();
            rafRef.current = requestAnimationFrame(() => {
              if (itemRef.current) {
                setShowForcedFocusRing(true);
                itemRef.current.focus();
              }
              flagResetTimerRef.current = setTimeout(() => {
                skipFlyoutOnFocusRef.current = false;
              }, 50);
            });
          }, 100);
        }
      },
      [onAddClick, setIsAddButtonFocused, setIsHovered, setIsFocused, collapsed]
    );

    useImperativeHandle(ref, () => ({
      closeFlyout: () => {
        flyoutState.setIsHovered(false);
        flyoutState.setIsFocused(false);
      },
      get nativeElement() { return itemRef.current; },
      getNativeElement: () => itemRef.current,
    }));

    const settledCollapsed = collapsed && !isTransitioning;

    const showFlyout = flyoutState.isMounted && settledCollapsed &&
      (flyoutState.isHovered || flyoutState.isFocused || flyoutState.isAddButtonFocused) &&
      !locked;
    const canShowAddButton = showAddButton && !isFixedSection;
    const showBadgeDot = settledCollapsed && !showFlyout && badge;

    const Element = isFixedSection ? 'button' : 'a';
    const elementProps = isFixedSection
      ? { type: 'button' as const }
      : { href: '#' as const };

    // Icon/avatar for the main render. Nested so its branching lives in its own
    // function and doesn't count against the main render's complexity budget.
    const renderMainIcon = () => {
      if (avatar && isFixedSection) {
        return <span className={cn("inline-flex shrink-0 items-center justify-center h-8 w-8 leading-none rounded-full [&>*]:block [&>*]:h-8 [&>*]:w-8", selected && "outline outline-1 outline-sapphire-border-joule")}>{avatar}</span>;
      }
      if ((selected || flyoutState.isHovered) && selectedIcon) return selectedIcon;
      return icon;
    };

    // Text label + badge for the expanded main render. Nested to keep its
    // conditionals out of the main render's complexity budget.
    const renderTextAndBadge = () => {
      if (settledCollapsed) return null;
      return (
        <>
          <span
            className="flex-1 truncate text-left font-semibold whitespace-nowrap overflow-hidden"
            style={{
              opacity: collapsed ? 0 : 1,
              transition: isTransitioning ? 'opacity 150ms ease' : 'none',
            }}
          >
            {text}
          </span>

          {badge && (
            <span
              className="flex items-center justify-center min-w-4 h-4 px-1 text-xs font-semibold rounded-full bg-sapphire-negative text-sapphire-text-on-surface border border-sapphire-text-on-surface shrink-0"
              style={{
                fontSize: "0.625rem",
                opacity: collapsed ? 0 : 1,
                transition: isTransitioning ? 'opacity 150ms ease' : 'none',
              }}
              aria-hidden="true"
            >
              {badge}
            </span>
          )}
        </>
      );
    };

    const content = (
      <div
        className={getContentClassName({
          settledCollapsed,
          canShowAddButton,
          selected,
          disabled,
          hasSelectedIcon: !!selectedIcon,
          isAddButtonFocused: flyoutState.isAddButtonFocused,
        })}
        style={{ zIndex: showFlyout ? 50 : "auto" }}
        onMouseEnter={flyoutState.handleMouseEnter}
        onMouseLeave={flyoutState.handleMouseLeave}
      >
        {/* Main clickable element — never remounted */}
        <Element
          ref={itemRef as React.RefObject<HTMLAnchorElement & HTMLButtonElement>}
          {...elementProps}
          data-name={name}
          data-testid={dataTestId}
          className={getElementClassName({
            settledCollapsed,
            canShowAddButton,
            selected,
            disabled,
            showForcedFocusRing,
            showFlyout,
            isFixedSection,
            hasSelectedIcon: !!selectedIcon,
            hasAvatar: !!avatar,
            className,
          })}
          style={{
            padding: '0.625rem',
          }}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          onFocus={flyoutState.handleFocus}
          onBlur={(e) => {
            flyoutState.handleBlur(e);
            setShowForcedFocusRing(false);
          }}
          onMouseEnter={!settledCollapsed ? flyoutState.handleMouseEnter : undefined}
          onMouseLeave={!settledCollapsed ? flyoutState.handleMouseLeave : undefined}
          title={settledCollapsed && !showFlyout ? text : undefined}
          aria-expanded={settledCollapsed ? showFlyout : undefined}
          aria-current={selected ? "page" : undefined}
          aria-label={settledCollapsed ? text : (badge ? `${text} (${badge})` : text)}
          aria-roledescription={!isFixedSection ? ariaRoleDescription : undefined}
          data-label={text}
        >
          {/* Icon — always visible */}
          <span className="shrink-0 flex items-center justify-center h-5 w-5" aria-hidden="true">
            {renderMainIcon()}
          </span>

          {/* Text + badge — kept in DOM during transition so they can fade out */}
          {renderTextAndBadge()}
        </Element>

        {/* Add button — only in expanded mode */}
        {canShowAddButton && !collapsed && (
          <Button
            design="SecondaryNeutral"
            size="Medium"
            iconOnly
            icon={<AddIcon className="h-4 w-4" />}
            onClick={handleAddClick}
            disabled={disabled}
            tooltip={addButtonTooltip}
            aria-label={addButtonTooltip || t("SIDENAV_ADD_NEW", { text: text?.toLowerCase() })}
            tabIndex={0}
            onFocus={() => setIsAddButtonFocused(true)}
            onBlur={() => setIsAddButtonFocused(false)}
            className="shrink-0"
          />
        )}

        {/* Badge dot — collapsed mode only */}
        {showBadgeDot && (
          <span
            className="absolute w-2 h-2 rounded-full pointer-events-none bg-sapphire-negative"
            style={{ top: '2px', right: collapsed ? '9px' : '2px' }}
            aria-hidden="true"
          />
        )}

        {/* Flyout overlay — collapsed mode hover/focus */}
        {showFlyout && (() => {
          const useJouleTheme = !!(selectedIcon || isFixedSection);
          const flyoutFocusRing = useJouleTheme ? "ring-2 ring-sapphire-border-joule" : "ring-2 ring-sapphire-border-focus";
          const flyoutSelectedBg = useJouleTheme
            ? "bg-sapphire-joule-background-light text-sapphire-text-accent-3 drop-shadow-[0_1px_2px_rgba(10,10,10,0.25)]"
            : "bg-sapphire-chrome-button-bg-selected text-sapphire-text-accent";
          const flyoutDefaultBg = useJouleTheme
            ? "bg-sapphire-joule-background-light text-sapphire-chrome-button-fg-default drop-shadow-[0_1px_2px_rgba(10,10,10,0.25)]"
            : "bg-sapphire-neutral-hover-background-2 text-sapphire-chrome-button-fg-default";

          return (
          <div
            ref={flyoutRef}
            data-name={name}
            data-flyout-child="true"
            onMouseEnter={flyoutState.handleFlyoutMouseEnter}
            onMouseLeave={flyoutState.handleFlyoutMouseLeave}
            onClick={handleClick}
            className={cn(
              "absolute top-0 left-0 flex items-center gap-2 text-sm rounded h-10 px-2.5 cursor-pointer",
              flyoutState.isFocused && !flyoutState.isAddButtonFocused && flyoutFocusRing,
              disabled && "opacity-50 cursor-not-allowed",
              selected ? flyoutSelectedBg : flyoutDefaultBg,
            )}
            style={{
              whiteSpace: "nowrap",
              position: "absolute",
              zIndex: 10,
              willChange: "filter",
            }}
          >
            <span className="shrink-0 flex items-center justify-center h-5 w-5" aria-hidden="true">
              {avatar && isFixedSection
                ? <span className={cn("inline-flex shrink-0 items-center justify-center h-8 w-8 leading-none rounded-full [&>*]:block [&>*]:h-8 [&>*]:w-8", selected && "outline outline-1 outline-sapphire-border-joule")}>{avatar}</span>
                : (selectedIcon || icon)}
            </span>

            <span className="whitespace-nowrap font-semibold" aria-hidden="true">{text}</span>

            {(badge || canShowAddButton) && (
              <span className="flex items-center gap-2 shrink-0">
                {badge && (
                  <span
                    className="flex items-center justify-center min-w-4 h-4 px-1 text-xs font-semibold rounded-full bg-sapphire-negative text-sapphire-text-on-surface border border-sapphire-text-on-surface"
                    style={{ fontSize: "0.625rem" }}
                    aria-hidden="true"
                  >
                    {badge}
                  </span>
                )}
                {canShowAddButton && (
                  <Button
                    design="SecondaryNeutral"
                    size="Medium"
                    iconOnly
                    icon={<AddIcon className="h-4 w-4" />}
                    onClick={handleAddClick}
                    disabled={disabled}
                    tooltip={addButtonTooltip}
                    aria-label={addButtonTooltip || t("SIDENAV_ADD_NEW", { text: text?.toLowerCase() })}
                    tabIndex={0}
                    onFocus={() => setIsAddButtonFocused(true)}
                    onBlur={(e) => {
                      setIsAddButtonFocused(false);
                      const relatedTarget = e.relatedTarget as HTMLElement | null;
                      const container = e.currentTarget.closest('.relative');
                      if (!relatedTarget || !container?.contains(relatedTarget)) {
                        setIsHovered(false);
                      }
                    }}
                    className="shrink-0"
                  />
                )}
              </span>
            )}
          </div>
          );
        })()}
      </div>
    );

    if (isFixedSection) {
      return <div>{content}</div>;
    }
    return <li className="list-none">{content}</li>;
}
