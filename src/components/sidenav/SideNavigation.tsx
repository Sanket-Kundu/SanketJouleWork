import React, {
  useRef,
  useImperativeHandle,
  useState,
  useCallback,
  createContext,
  useContext,
} from "react";
import { useTranslation } from "react-i18next";
import { cn } from "../../lib/utils";
import { SlimArrowDownIcon } from "../../icons/SlimArrowDown";
import { SlimArrowRightIcon } from "../../icons/SlimArrowRight";
import {
  SideNavigationProps,
  SideNavigationItemProps,
  SideNavigationSubItemProps,
  SideNavigationGroupProps,
  SideNavigationContextValue,
} from "../../types/sidenav";

/**
 * SideNavigation context
 */
const SideNavigationContext = createContext<SideNavigationContextValue>({
  collapsed: false,
  onItemSelect: () => {},
});

/**
 * SideNavigation component
 *
 * A vertical navigation component for app navigation.
 *
 * @example
 * ```tsx
 * <SideNavigation selectedKey="home" onSelectionChange={({ item }) => navigate(item.itemKey)}>
 *   <SideNavigationItem itemKey="home" text="Home" icon={<Home />} />
 *   <SideNavigationItem itemKey="settings" text="Settings" icon={<Settings />}>
 *     <SideNavigationSubItem itemKey="profile" text="Profile" />
 *     <SideNavigationSubItem itemKey="account" text="Account" />
 *   </SideNavigationItem>
 * </SideNavigation>
 * ```
 */
export function SideNavigation({
  collapsed = false,
  selectedKey,
  children,
  fixedItems,
  header,
  onSelectionChange,
  className,
  style,
  ref,
  "data-testid": dataTestId,
}: SideNavigationProps) {
    const { t } = useTranslation("fx");
    const navRef = useRef<HTMLElement>(null);

    useImperativeHandle(ref, () => ({
      get nativeElement() { return navRef.current; },
      getNativeElement: () => navRef.current,
    }));

    const handleItemSelect = useCallback(
      (key: string, item: SideNavigationItemProps) => {
        onSelectionChange?.({ item: { ...item, itemKey: key } });
      },
      [onSelectionChange]
    );

    return (
      <SideNavigationContext.Provider
        value={{
          collapsed,
          selectedKey,
          onItemSelect: handleItemSelect,
        }}
      >
        <nav
          ref={navRef}
          role="navigation"
          aria-label={t("SIDENAV_ARIA_LABEL")}
          className={cn(
            "flex flex-col h-full bg-card",
            collapsed ? "w-14" : "w-60",
            "transition-[width] duration-200",
            className
          )}
          style={style}
          data-testid={dataTestId}
        >
          {header && (
            <div className="flex-shrink-0 p-3 border-b border-border">
              {header}
            </div>
          )}
          <div className="flex-1 overflow-y-auto py-2">
            <ul role="tree" className="space-y-1 px-2">
              {children}
            </ul>
          </div>
          {fixedItems && (
            <div className="flex-shrink-0 border-t border-border py-2">
              <ul className="space-y-1 px-2">{fixedItems}</ul>
            </div>
          )}
        </nav>
      </SideNavigationContext.Provider>
    );
}

/**
 * SideNavigationItem component
 */
export function SideNavigationItem({
  itemKey,
  text,
  icon,
  expanded: controlledExpanded,
  selected: controlledSelected,
  disabled = false,
  badge,
  href,
  target,
  children,
  onClick,
  className,
  wholeItemToggleable = false,
  ref,
}: SideNavigationItemProps) {
    const { collapsed, selectedKey, onItemSelect } = useContext(SideNavigationContext);
    const [internalExpanded, setInternalExpanded] = useState(false);

    const hasChildren = React.Children.count(children) > 0;
    const isExpanded = controlledExpanded ?? internalExpanded;
    const isSelected = controlledSelected ?? (itemKey ? selectedKey === itemKey : false);

    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
      if (disabled) return;

      if (hasChildren && !collapsed) {
        setInternalExpanded(!isExpanded);
        if (!wholeItemToggleable) {
          return;
        }
      }

      if (itemKey) {
        onItemSelect(itemKey, {
          itemKey,
          text,
          icon,
          expanded: isExpanded,
          selected: true,
          disabled,
          badge,
          href,
          target,
        });
      }

      onClick?.(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
      if (disabled) return;

      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick(e as unknown as React.MouseEvent<HTMLElement>);
      }

      if (hasChildren) {
        if (e.key === "ArrowRight" && !isExpanded) {
          setInternalExpanded(true);
        } else if (e.key === "ArrowLeft" && isExpanded) {
          setInternalExpanded(false);
        }
      }
    };

    const content = (
      <>
        {icon && (
          <span className="h-5 w-5 shrink-0 flex items-center justify-center">
            {icon}
          </span>
        )}
        {!collapsed && (
          <>
            <span className="flex-1 truncate">{text}</span>
            {badge && <span className="ml-auto">{badge}</span>}
            {hasChildren && (
              <span className="ml-1">
                {isExpanded ? (
                  <SlimArrowDownIcon className="h-4 w-4" />
                ) : (
                  <SlimArrowRightIcon className="h-4 w-4" />
                )}
              </span>
            )}
          </>
        )}
      </>
    );

    const itemClasses = cn(
      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
      "hover:bg-accent hover:text-accent-foreground",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      isSelected && "bg-primary/10 text-primary font-medium",
      disabled && "pointer-events-none opacity-50",
      collapsed && "justify-center px-0",
      className
    );

    return (
      <li ref={ref} role="treeitem" aria-selected={isSelected} aria-expanded={hasChildren ? isExpanded : undefined}>
        {href ? (
          <a
            href={href}
            target={target}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            className={itemClasses}
            tabIndex={disabled ? -1 : 0}
          >
            {content}
          </a>
        ) : (
          <div
            role="button"
            tabIndex={disabled ? -1 : 0}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            className={cn(itemClasses, "cursor-pointer")}
          >
            {content}
          </div>
        )}
        {hasChildren && isExpanded && !collapsed && (
          <ul role="group" className="mt-1 ml-4 space-y-1">
            {children}
          </ul>
        )}
      </li>
    );
}

/**
 * SideNavigationSubItem component
 */
export function SideNavigationSubItem({
  itemKey,
  text,
  icon,
  selected: controlledSelected,
  disabled = false,
  href,
  target,
  onClick,
  className,
  ref,
}: SideNavigationSubItemProps) {
    const { selectedKey, onItemSelect } = useContext(SideNavigationContext);

    const isSelected = controlledSelected ?? (itemKey ? selectedKey === itemKey : false);

    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
      if (disabled) return;

      if (itemKey) {
        onItemSelect(itemKey, {
          itemKey,
          text,
          icon,
          selected: true,
          disabled,
          href,
          target,
        });
      }

      onClick?.(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
      if (disabled) return;

      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick(e as unknown as React.MouseEvent<HTMLElement>);
      }
    };

    const itemClasses = cn(
      "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors",
      "hover:bg-accent hover:text-accent-foreground",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      isSelected && "bg-primary/10 text-primary font-medium",
      disabled && "pointer-events-none opacity-50",
      className
    );

    const content = (
      <>
        {icon && <span className="h-4 w-4 shrink-0">{icon}</span>}
        <span className="truncate">{text}</span>
      </>
    );

    return (
      <li ref={ref} role="treeitem" aria-selected={isSelected}>
        {href ? (
          <a
            href={href}
            target={target}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            className={itemClasses}
            tabIndex={disabled ? -1 : 0}
          >
            {content}
          </a>
        ) : (
          <div
            role="button"
            tabIndex={disabled ? -1 : 0}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            className={cn(itemClasses, "cursor-pointer")}
          >
            {content}
          </div>
        )}
      </li>
    );
}

/**
 * SideNavigationGroup component
 */
export function SideNavigationGroup({ text, expanded: controlledExpanded = true, children, className, ref }: SideNavigationGroupProps) {
    const [internalExpanded, setInternalExpanded] = useState(true);
    const { collapsed } = useContext(SideNavigationContext);

    const isExpanded = controlledExpanded ?? internalExpanded;

    if (collapsed) {
      // In collapsed mode, just render children without grouping
      return <>{children}</>;
    }

    return (
      <li ref={ref} className={cn("pt-4 first:pt-0", className)}>
        {text && (
          <button
            type="button"
            onClick={() => setInternalExpanded(!isExpanded)}
            className="flex items-center gap-2 px-3 py-1 text-xs font-semibold text-sapphire-text-tertiary uppercase tracking-wider w-full hover:text-foreground"
          >
            <span className="flex-1 text-left">{text}</span>
            {isExpanded ? (
              <SlimArrowDownIcon className="h-3 w-3" />
            ) : (
              <SlimArrowRightIcon className="h-3 w-3" />
            )}
          </button>
        )}
        {isExpanded && <ul className="mt-1 space-y-1">{children}</ul>}
      </li>
    );
}
