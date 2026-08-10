import React, {
  useRef,
  useImperativeHandle,
  useEffect,
  useState,
  useCallback,
  useContext,
  createContext,
} from "react";
import { cn } from "../../lib/utils";
import { Button } from "../button/Button";
import { Title } from "../title/Title";
import { ListItem } from "../list/ListItem";
import { ResponsivePopover } from "../responsive-popover/ResponsivePopover";
import { ButtonDesign } from "../../types/button";
import { TitleLevel } from "../../types/title";
import { LogOut } from "lucide-react";
import { FxUserMenuContent } from "./FxUserMenuContent";
import { FxUserMenuPanel } from "./FxUserMenuPanel";
import { useTranslation } from "react-i18next";
import type {
  FxUserMenuProps,
  FxUserMenuAccountData,
  FxUserMenuItemProps,
  FxUserMenuItemGroupProps,
  FxUserMenuItemClickDetail,
  FxUserMenuItemCheckMode,
} from "../../types/fx-user-menu";
import type { ResponsivePopoverRef } from "../../types/responsive-popover";

// =============================================================================
// CONTEXT
// =============================================================================

interface FxUserMenuContextValue {
  closeMenu: () => void;
  onItemClick?: (detail: FxUserMenuItemClickDetail) => boolean | void;
}

const FxUserMenuContext = createContext<FxUserMenuContextValue>({
  closeMenu: () => {},
});

interface FxUserMenuItemGroupContextValue {
  checkMode: FxUserMenuItemCheckMode | string;
  checkedItems: Set<string>;
  onCheck: (itemId: string) => void;
}

const FxUserMenuItemGroupContext = createContext<FxUserMenuItemGroupContextValue | null>(null);

// =============================================================================
// FX USER MENU
// =============================================================================

/**
 * FxUserMenu component
 *
 * A user menu for FxLayout showing the current user's account info,
 * optional multi-account switching, action menu items, and a sign-out button.
 *
 * On desktop (useDialog=false): renders inside a ResponsivePopover.
 * On compact/phone (useDialog=true): renders inside a sliding panel from the left.
 *
 * Note: This component is designed to work with FxLayout, which automatically
 * injects open/opener/useDialog/onClose/onBackClick props.
 *
 * @example
 * ```tsx
 * <FxLayout
 *   userMenu={
 *     <FxUserMenu
 *       accounts={[{ id: "1", titleText: "John Doe", subtitleText: "john@example.com", selected: true }]}
 *       showManageAccount
 *       onSignOutClick={() => console.log("sign out")}
 *     >
 *       <FxUserMenuItem text="Settings" icon={<Settings />} />
 *       <FxUserMenuItem text="Privacy" />
 *     </FxUserMenu>
 *   }
 * />
 * ```
 */
export function FxUserMenu({
  open = false,
  opener,
  useDialog = false,
  showManageAccount = false,
  showOtherAccounts = false,
  showEditAccounts = false,
  showEditButton = false,
  avatarInteractive = true,
  accounts = [],
  children,
  footer,
  onAvatarClick,
  onManageAccountClick,
  onEditAccountsClick,
  onSignOutClick,
  onOpen,
  onClose,
  onBackClick,
  onChangeAccount,
  onItemClick,
  placement = "Bottom",
  horizontalAlign = "End",
  verticalAlign,
  offset,
  className,
  accessibleName,
  ref,
  "data-testid": dataTestId,
}: FxUserMenuProps) {
    const popoverRef = useRef<ResponsivePopoverRef>(null);
    const { t } = useTranslation("fx");
    // Anchor ref placed inside children — its parentElement is the Popover's scroll container
    const anchorRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLSpanElement>(null);
    const [titleMovedToHeader, setTitleMovedToHeader] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    // Tracks when the Popover has fully rendered its DOM (fires via onOpen callback)
    const [popoverReady, setPopoverReady] = useState(false);

    // Determine selected account
    const selectedAccount = accounts.find(a => a.selected) || accounts[0];
    const otherAccounts = accounts.filter(a => a !== selectedAccount);

    // Expose ref methods
    useImperativeHandle(ref, () => ({
      close: () => onClose?.(),
      isOpen: () => open,
    }));

    const closeMenu = useCallback(() => {
      onClose?.();
    }, [onClose]);

    const handleOpen = useCallback(() => {
      setPopoverReady(true);
      onOpen?.();
    }, [onOpen]);

    const handleClose = useCallback(() => {
      setPopoverReady(false);
      setTitleMovedToHeader(false);
      setIsScrolled(false);
      onClose?.();
    }, [onClose]);

    // Scroll listener + IntersectionObserver on the Popover's scroll container.
    // Only active in popover mode. Depends on popoverReady to ensure the DOM exists.
    useEffect(() => {
      if (useDialog || !popoverReady) return;

      const scrollContainer = anchorRef.current?.parentElement;
      if (!scrollContainer || !titleRef.current) return;

      const handleScroll = () => {
        setIsScrolled(scrollContainer.scrollTop > 0);
      };
      scrollContainer.addEventListener("scroll", handleScroll);

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.target === titleRef.current) {
              setTitleMovedToHeader(!entry.isIntersecting);
            }
          });
        },
        {
          root: scrollContainer,
          threshold: [0.15],
        }
      );
      observer.observe(titleRef.current);

      return () => {
        scrollContainer.removeEventListener("scroll", handleScroll);
        observer.disconnect();
      };
    }, [useDialog, popoverReady, selectedAccount]);

    // Account switch handler
    const handleAccountSwitch = useCallback(
      (account: FxUserMenuAccountData) => {
        if (!selectedAccount || account.id === selectedAccount.id) return;
        const result = onChangeAccount?.({
          prevSelectedAccount: selectedAccount,
          selectedAccount: account,
        });
        if (result === false) return;
      },
      [selectedAccount, onChangeAccount]
    );

    // Sign out handler
    const handleSignOut = useCallback(() => {
      const result = onSignOutClick?.();
      if (result === false) return;
      closeMenu();
    }, [onSignOutClick, closeMenu]);

    // Menu item click handler
    const handleItemClick = useCallback(
      (detail: FxUserMenuItemClickDetail) => {
        const result = onItemClick?.(detail);
        if (result === false) return;
        closeMenu();
      },
      [onItemClick, closeMenu]
    );

    const hasCustomFooter = footer !== undefined && footer !== null;
    const accessibleNameText = accessibleName || (selectedAccount ? `User Menu ${selectedAccount.titleText}` : "User Menu");

    // Build footer content (shared between popover and panel)
    const footerContent = hasCustomFooter ? (
      <div className="flex justify-end items-center w-full">
        {footer}
      </div>
    ) : (
      <div className="flex justify-end items-center w-full">
        <Button
          design={ButtonDesign.Tertiary}
          icon={<LogOut className="h-4 w-4" />}
          className="font-semibold"
          onClick={handleSignOut}
        >
          {t("SIGN_OUT")}
        </Button>
      </div>
    );

    // Shared content component
    const menuContent = (
      <FxUserMenuContent
        selectedAccount={selectedAccount}
        otherAccounts={otherAccounts}
        showManageAccount={showManageAccount}
        showOtherAccounts={showOtherAccounts}
        showEditAccounts={showEditAccounts}
        showEditButton={showEditButton}
        avatarInteractive={avatarInteractive}
        titleRef={titleRef}
        onAvatarClick={onAvatarClick}
        onManageAccountClick={onManageAccountClick}
        onEditAccountsClick={onEditAccountsClick}
        onAccountSwitch={handleAccountSwitch}
      >
        {children}
      </FxUserMenuContent>
    );

    // =========================================================================
    // PANEL MODE (compact/phone)
    // =========================================================================
    if (useDialog) {
      return (
        <FxUserMenuContext.Provider value={{ closeMenu, onItemClick: handleItemClick }}>
          <FxUserMenuPanel
            open={open}
            footer={footerContent}
            accessibleName={accessibleNameText}
            onClose={closeMenu}
            onBackClick={onBackClick}
          >
            {menuContent}
          </FxUserMenuPanel>
        </FxUserMenuContext.Provider>
      );
    }

    // =========================================================================
    // POPOVER MODE (desktop - default)
    // =========================================================================

    // Fixed header bar — lives in the Popover's header slot (outside scroll area).
    // Shows the user name only when the original title has scrolled out of view.
    const headerContent = (
      <div
        className={cn(
          "flex items-center px-3 min-h-[2.75rem]",
          (isScrolled || titleMovedToHeader)
            ? "border-b border-border shadow-sm"
            : ""
        )}
      >
        <div className="flex-1 min-w-0">
          {titleMovedToHeader && selectedAccount && (
            <Title level={TitleLevel.H4} className="truncate">
              {selectedAccount.titleText}
            </Title>
          )}
        </div>
      </div>
    );

    return (
      <FxUserMenuContext.Provider value={{ closeMenu, onItemClick: handleItemClick }}>
        <ResponsivePopover
          ref={popoverRef}
          opener={opener}
          open={open}
          placement={placement}
          horizontalAlign={horizontalAlign}
          verticalAlign={verticalAlign}
          offset={offset}
          noPadding
          accessibleName={accessibleNameText}
          header={headerContent}
          footer={footerContent}
          onOpen={handleOpen}
          onClose={handleClose}
          showCloseButton
          className={cn("w-80", className)}
          data-testid={dataTestId}
        >
          {/* Invisible anchor — its parentElement is the Popover's scroll container */}
          <div ref={anchorRef} className="contents" />

          {/* All content below scrolls within the Popover's content area */}
          {menuContent}
        </ResponsivePopover>
      </FxUserMenuContext.Provider>
    );
}

// =============================================================================
// FX USER MENU ITEM
// =============================================================================

/**
 * FxUserMenuItem component
 *
 * A menu item for use inside FxUserMenu. Wraps ListItem for keyboard navigation.
 * Supports icons, checked state, and nested items.
 *
 * @example
 * ```tsx
 * <FxUserMenuItem text="Settings" icon={<Settings />} />
 * <FxUserMenuItem text="Dark Mode" checked />
 * ```
 */
export function FxUserMenuItem({
  text,
  icon,
  itemKey,
  checked,
  disabled = false,
  children: _children,
  onClick,
  className,
  ref,
}: FxUserMenuItemProps) {
    const { onItemClick } = useContext(FxUserMenuContext);
    const groupContext = useContext(FxUserMenuItemGroupContext);
    const generatedIdRef = useRef<string | null>(null);
    if (generatedIdRef.current === null) {
      generatedIdRef.current = Math.random().toString(36).slice(2);
    }
    const itemId = itemKey ?? generatedIdRef.current;

    // Determine checked state: from group context or from prop
    const isChecked = groupContext
      ? groupContext.checkedItems.has(itemId)
      : checked;

    const handleClick = useCallback(
      (e: React.MouseEvent | React.KeyboardEvent) => {
        if (disabled) return;

        // If in a group with check mode, toggle check
        if (groupContext && groupContext.checkMode !== "None") {
          groupContext.onCheck(itemId);
        }

        if (onClick) {
          onClick(e as React.MouseEvent<HTMLDivElement>);
        }

        const result = onItemClick?.({
          item: e.currentTarget as HTMLElement,
          text: text || "",
        });

        // If onItemClick returned false (via the FxUserMenu handler), don't close
        if (result === false) return;
      },
      [disabled, onClick, onItemClick, text, groupContext, itemId]
    );

    return (
      <ListItem
        ref={ref as React.Ref<any>}
        itemKey={itemId}
        text={text}
        icon={icon}
        disabled={disabled}
        additionalText={isChecked ? "✓" : undefined}
        onClick={handleClick}
        className={cn(
          "rounded-md",
          className
        )}
      />
    );
}

// =============================================================================
// FX USER MENU ITEM GROUP
// =============================================================================

/**
 * FxUserMenuItemGroup component
 *
 * Groups menu items with a check mode (None, Single, Multiple).
 *
 * @example
 * ```tsx
 * <FxUserMenuItemGroup checkMode="Single">
 *   <FxUserMenuItem text="Option A" />
 *   <FxUserMenuItem text="Option B" />
 * </FxUserMenuItemGroup>
 * ```
 */
export function FxUserMenuItemGroup({
  checkMode = "None",
  children,
  className,
  ref,
}: FxUserMenuItemGroupProps) {
    const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

    const handleCheck = useCallback(
      (itemId: string) => {
        setCheckedItems((prev) => {
          const next = new Set(prev);
          if (checkMode === "Single") {
            next.clear();
            next.add(itemId);
          } else if (checkMode === "Multiple") {
            if (next.has(itemId)) {
              next.delete(itemId);
            } else {
              next.add(itemId);
            }
          }
          return next;
        });
      },
      [checkMode]
    );

    return (
      <FxUserMenuItemGroupContext.Provider
        value={{
          checkMode,
          checkedItems,
          onCheck: handleCheck,
        }}
      >
        <div
          ref={ref}
          role="group"
          className={cn("py-0.5", className)}
        >
          {children}
        </div>
      </FxUserMenuItemGroupContext.Provider>
    );
}
