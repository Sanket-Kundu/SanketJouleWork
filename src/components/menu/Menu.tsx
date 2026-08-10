import React, {
  useRef,
  useImperativeHandle,
  useEffect,
  useState,
  useCallback,
  useMemo,
  useId,
  createContext,
  useContext,
  Children,
  isValidElement,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "../../lib/utils";
import { SlimArrowRightIcon } from "../../icons/SlimArrowRight";
import { AcceptIcon } from "../../icons/Accept";
import { Loader2 } from "lucide-react";
import {
  MenuProps,
  MenuItemProps,
  MenuSeparatorProps,
  MenuHeaderProps,
  MenuItemGroupProps,
  MenuItemGroupCheckMode,
  MenuItemClickDetail,
} from "../../types/menu";
import { Popover } from "../popover/Popover";
import {
  PopoverPlacement,
  PopoverHorizontalAlign,
  PopoverVerticalAlign,
  PopupAccessibleRole,
} from "../../types/popover";
import { useTranslation } from "react-i18next";

/**
 * Menu context for communicating between Menu and MenuItem
 */
interface MenuContextValue {
  closeMenu: (escPressed?: boolean) => void;
  onItemClick?: (detail: MenuItemClickDetail) => void | boolean;
  onCheck?: (detail: MenuItemClickDetail) => void;
  closeAllSubmenus: () => void;
  registerSubmenu: (id: string, close: () => void) => void;
  unregisterSubmenu: (id: string) => void;
  submenuDepth: number;
}

const MenuContext = createContext<MenuContextValue>({
  closeMenu: () => {},
  closeAllSubmenus: () => {},
  registerSubmenu: () => {},
  unregisterSubmenu: () => {},
  submenuDepth: 0,
});

/**
 * MenuItemGroup context for check mode
 */
const MenuItemGroupContext = createContext<{
  checkMode: MenuItemGroupCheckMode;
} | null>(null);

/**
 * Calculate submenu position (opens to the right of parent item).
 * Uses viewport-relative coordinates since submenus use `position: fixed`.
 */
function calculateSubmenuPosition(
  parentItem: HTMLElement,
  submenu: HTMLElement
): { top: number; left: number } {
  const parentRect = parentItem.getBoundingClientRect();
  const submenuRect = submenu.getBoundingClientRect();
  const viewportWidth = document.documentElement.clientWidth;
  const viewportHeight = document.documentElement.clientHeight;
  const gap = 4;
  const margin = 8;

  const spaceRight = viewportWidth - parentRect.right - gap;
  const spaceLeft = parentRect.left - gap;

  let top = parentRect.top;
  let left: number;

  if (spaceRight >= submenuRect.width) {
    // Fits on the right without overlap
    left = parentRect.right + gap;
  } else if (spaceLeft >= submenuRect.width) {
    // Fits on the left without overlap
    left = parentRect.left - submenuRect.width - gap;
  } else {
    // Doesn't fit on either side — overlay on top of parent menu
    // so the submenu covers the parent rather than rendering beside/below it
    const parentMenu = parentItem.closest('[role="menu"], [data-submenu="true"]');
    if (parentMenu) {
      const parentMenuRect = parentMenu.getBoundingClientRect();
      left = parentMenuRect.left;
    } else {
      left = parentRect.left;
    }
    left = Math.max(Math.min(left, viewportWidth - submenuRect.width - margin), margin);
  }

  // Keep within vertical bounds
  if (top + submenuRect.height > viewportHeight - margin) {
    top = viewportHeight - submenuRect.height - margin;
  }
  if (top < margin) {
    top = margin;
  }

  return { top, left };
}

/**
 * Get focusable menu items within a container (direct items only, not nested submenus)
 */
function getFocusableItems(container: HTMLElement): HTMLElement[] {
  const all = Array.from(
    container.querySelectorAll<HTMLElement>(
      '[role^="menuitem"]:not([aria-disabled="true"])'
    )
  );
  // Only include items that belong to this menu level (not inside a nested [data-submenu] or nested [role="menu"])
  return all.filter((item) => {
    let parent = item.parentElement;
    while (parent && parent !== container) {
      if (parent.getAttribute("role") === "menu" || parent.getAttribute("data-submenu") === "true") {
        return false;
      }
      parent = parent.parentElement;
    }
    return true;
  });
}

/**
 * Hook for keyboard navigation within a menu container
 */
function useMenuNavigation(
  containerRef: React.RefObject<HTMLElement | null>,
  options?: { isSubmenu?: boolean; onClose?: () => void; parentItemRef?: React.RefObject<HTMLElement | null>; onCloseRoot?: () => void }
) {
  const typeAheadBufferRef = useRef("");
  const typeAheadTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const container = containerRef.current;
      if (!container) return;

      const items = getFocusableItems(container);
      if (items.length === 0) return;

      const currentIndex = items.indexOf(
        document.activeElement as HTMLElement
      );

      switch (e.key) {
        case "ArrowDown": {
          e.preventDefault();
          e.stopPropagation();
          if (currentIndex < items.length - 1) {
            items[currentIndex + 1]?.focus();
          }
          break;
        }
        case "ArrowUp": {
          e.preventDefault();
          e.stopPropagation();
          if (currentIndex > 0) {
            items[currentIndex - 1]?.focus();
          }
          break;
        }
        case "Home": {
          e.preventDefault();
          e.stopPropagation();
          items[0]?.focus();
          break;
        }
        case "End": {
          e.preventDefault();
          e.stopPropagation();
          items[items.length - 1]?.focus();
          break;
        }
        case "ArrowLeft": {
          if (options?.isSubmenu) {
            e.preventDefault();
            e.stopPropagation();
            options.onClose?.();
            options.parentItemRef?.current?.focus();
          }
          break;
        }
        case "Escape": {
          if (options?.isSubmenu) {
            e.preventDefault();
            e.stopPropagation();
            // Prevent the native event from reaching the popup registry,
            // which would also close the root menu
            e.nativeEvent.stopImmediatePropagation();
            options.onClose?.();
            options.parentItemRef?.current?.focus();
          }
          break;
        }
        case "Tab": {
          e.preventDefault();
          if (options?.isSubmenu) {
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
            options.onClose?.();
            options.parentItemRef?.current?.focus();
          } else {
            options?.onCloseRoot?.();
          }
          break;
        }
        default: {
          // Type-ahead: single printable character
          if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
            e.stopPropagation();
            if (typeAheadTimeoutRef.current) {
              clearTimeout(typeAheadTimeoutRef.current);
            }
            typeAheadBufferRef.current += e.key.toLowerCase();
            typeAheadTimeoutRef.current = setTimeout(() => {
              typeAheadBufferRef.current = "";
            }, 500);

            const buffer = typeAheadBufferRef.current;
            const match = items.find((item) => {
              const text = item.textContent?.toLowerCase() || "";
              return text.startsWith(buffer);
            });
            if (match) {
              match.focus();
            }
          }
          break;
        }
      }
    },
    [containerRef, options]
  );

  // Cleanup
  useEffect(() => {
    return () => {
      if (typeAheadTimeoutRef.current) {
        clearTimeout(typeAheadTimeoutRef.current);
      }
    };
  }, []);

  return handleKeyDown;
}

/**
 * Loading spinner with optional delay
 */
function LoadingSpinner({ delay = 50 }: { delay?: number }) {
  const [show, setShow] = useState(delay <= 0);

  useEffect(() => {
    if (delay <= 0) return;
    const timer = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (!show) return null;

  return (
    <div className="flex items-center justify-center py-4 px-8">
      <Loader2 className="h-5 w-5 animate-spin text-sapphire-text-tertiary" />
    </div>
  );
}

/**
 * Map Menu placement strings to Popover placement + alignment props.
 */
function mapMenuPlacementToPopover(menuPlacement: MenuProps["placement"] = "bottom-start") {
  switch (menuPlacement) {
    case "bottom-start":
      return { placement: PopoverPlacement.Bottom, horizontalAlign: PopoverHorizontalAlign.Start };
    case "bottom-end":
      return { placement: PopoverPlacement.Bottom, horizontalAlign: PopoverHorizontalAlign.End };
    case "top-start":
      return { placement: PopoverPlacement.Top, horizontalAlign: PopoverHorizontalAlign.Start };
    case "top-end":
      return { placement: PopoverPlacement.Top, horizontalAlign: PopoverHorizontalAlign.End };
    case "right-start":
      return { placement: PopoverPlacement.End, verticalAlign: PopoverVerticalAlign.Top };
    case "right-end":
      return { placement: PopoverPlacement.End, verticalAlign: PopoverVerticalAlign.Bottom };
    case "left-start":
      return { placement: PopoverPlacement.Start, verticalAlign: PopoverVerticalAlign.Top };
    case "left-end":
      return { placement: PopoverPlacement.Start, verticalAlign: PopoverVerticalAlign.Bottom };
    default:
      return { placement: PopoverPlacement.Bottom, horizontalAlign: PopoverHorizontalAlign.Start };
  }
}

/**
 * Menu component
 *
 * A dropdown menu that appears anchored to an opener element.
 * Uses Popover for positioning, Escape handling, click-outside, and focus management.
 * Supports nested submenus via MenuItem children.
 *
 * @example
 * ```tsx
 * const [open, setOpen] = useState(false);
 * const buttonRef = useRef<HTMLButtonElement>(null);
 *
 * <Button ref={buttonRef} onClick={() => setOpen(true)}>Open Menu</Button>
 * <Menu open={open} opener={buttonRef.current} onClose={() => setOpen(false)}>
 *   <MenuItem text="Edit" icon={<Edit />} onClick={() => console.log("edit")} />
 *   <MenuItem text="More Options" icon={<Settings />}>
 *     <MenuItem text="Option A" />
 *     <MenuItem text="Option B" />
 *   </MenuItem>
 *   <MenuSeparator />
 *   <MenuItem text="Settings" />
 * </Menu>
 * ```
 */
export function Menu(
    {
      open = false,
      opener,
      children,
      placement = "bottom-start",
      onClose,
      onItemClick,
      onCheck,
      className,
      style,
      headerText,
      loading,
      loadingDelay = 50,
      onBeforeOpen,
      onOpen,
      onBeforeClose,
      ref,
      "data-testid": dataTestId,
    }: MenuProps
  ) {
    const { t } = useTranslation("fx");
    const menuRef = useRef<HTMLDivElement>(null);
    const submenuClosersRef = useRef<Map<string, () => void>>(new Map());

    // Guard to prevent double-firing of callbacks when MenuItem closes the menu
    // (closeMenu fires onClose -> consumer sets open=false -> Popover's doClose fires onClose again)
    const closingRef = useRef(false);

    // Store callbacks in refs so they never appear in dependency arrays
    const onBeforeCloseRef = useRef(onBeforeClose);
    const onCloseRef = useRef(onClose);
    const onItemClickRef = useRef(onItemClick);
    const onCheckRef = useRef(onCheck);
    useEffect(() => {
      onBeforeCloseRef.current = onBeforeClose;
      onCloseRef.current = onClose;
      onItemClickRef.current = onItemClick;
      onCheckRef.current = onCheck;
    });

    // Resolve opener: accept HTMLElement directly or a string ID
    const resolvedOpener = typeof opener === "string"
      ? document.getElementById(opener)
      : opener;

    // Keep a ref for Popover's opener prop
    const openerRef = useRef<HTMLElement | null>(null);
    useEffect(() => {
      openerRef.current = resolvedOpener ?? null;
    }, [resolvedOpener]);

    // Called by MenuItems (and imperative ref) to close the menu
    const closeMenu = useCallback((escPressed?: boolean) => {
      closingRef.current = true;
      onBeforeCloseRef.current?.({ escPressed: !!escPressed });
      onCloseRef.current?.();
    }, []);

    useImperativeHandle(ref, () => ({
      close: () => closeMenu(),
      isOpen: () => open,
    }), [closeMenu, open]);

    // Reset the closing guard when menu opens
    useEffect(() => {
      if (open) {
        closingRef.current = false;
      }
    }, [open]);

    const closeAllSubmenus = useCallback(() => {
      submenuClosersRef.current.forEach((close) => close());
    }, []);

    const registerSubmenu = useCallback((id: string, close: () => void) => {
      submenuClosersRef.current.set(id, close);
    }, []);

    const unregisterSubmenu = useCallback((id: string) => {
      submenuClosersRef.current.delete(id);
    }, []);

    // Keyboard navigation
    const handleKeyDown = useMenuNavigation(menuRef, { onCloseRoot: closeMenu });

    // Stable wrappers for callbacks stored in refs
    const stableOnItemClick = useCallback(
      (detail: MenuItemClickDetail) => onItemClickRef.current?.(detail),
      []
    );
    const stableOnCheck = useCallback(
      (detail: MenuItemClickDetail) => onCheckRef.current?.(detail),
      []
    );

    // When loading finishes while the menu is open, focus the first menu item.
    // Uses [open, loading] as a combined key: the effect compares the previous
    // snapshot to detect a true loading→done transition and ignores stale state
    // from prior open/close cycles.
    const prevOpenLoadingRef = useRef({ open, loading });
    useEffect(() => {
      const prev = prevOpenLoadingRef.current;
      prevOpenLoadingRef.current = { open, loading };

      // Only focus when loading transitions true→false while the menu is open.
      // Ignore transitions that span an open/close boundary (prev.open=false
      // means the menu just opened — prevLoading is stale from a prior session).
      if (prev.open && open && prev.loading && !loading && menuRef.current) {
        requestAnimationFrame(() => {
          if (menuRef.current) {
            const items = getFocusableItems(menuRef.current);
            const selected = items.find((el) => el.hasAttribute("data-menu-selected") || el.getAttribute("aria-checked") === "true");
            (selected ?? items[0])?.focus();
          }
        });
      }
    }, [loading, open]);

    // Memoize context value to prevent unnecessary re-renders.
    // submenuDepth is always 0 at the root Menu level (not a prop/state).
    const menuContextValue = useMemo<MenuContextValue>(
      () => ({ closeMenu, onItemClick: stableOnItemClick, onCheck: stableOnCheck, closeAllSubmenus, registerSubmenu, unregisterSubmenu, submenuDepth: 0 }),
      [closeMenu, stableOnItemClick, stableOnCheck, closeAllSubmenus, registerSubmenu, unregisterSubmenu]
    );

    // Map placement for Popover
    const popoverPlacement = useMemo(
      () => mapMenuPlacementToPopover(placement),
      [placement]
    );

    // Focus selected item or first menu item on open (skips header buttons)
    const handleOpen = useCallback(() => {
      onOpen?.();
      if (!menuRef.current) return;
      const items = getFocusableItems(menuRef.current);
      const selected = items.find((el) => el.hasAttribute("data-menu-selected") || el.getAttribute("aria-checked") === "true");
      (selected ?? items[0])?.focus();
    }, [onOpen]);

    // Custom isInsidePopup for submenu portals
    const isInsidePopup = useCallback((target: Node) => {
      return !!(target as Element).closest?.('[data-submenu="true"]');
    }, []);

    // Popover callbacks — skip if closeMenu already fired them
    const handlePopoverBeforeClose = useCallback(({ escPressed }: { escPressed: boolean }) => {
      if (closingRef.current) return;
      onBeforeCloseRef.current?.({ escPressed });
    }, []);

    const handlePopoverClose = useCallback(() => {
      const wasClosing = closingRef.current;
      closingRef.current = false;
      if (wasClosing) return;
      onCloseRef.current?.();
    }, []);

    return (
      <Popover
        opener={openerRef}
        open={open}
        onBeforeOpen={onBeforeOpen}
        onOpen={handleOpen}
        onBeforeClose={handlePopoverBeforeClose}
        onClose={handlePopoverClose}
        hideArrow
        noPadding
        offset={4}
        placement={popoverPlacement.placement}
        horizontalAlign={popoverPlacement.horizontalAlign}
        verticalAlign={popoverPlacement.verticalAlign}
        accessibleRole={PopupAccessibleRole.Dialog}
        accessibleName={t("MENU_POPOVER_ACCESSIBLE_NAME")}
        isInsidePopup={isInsidePopup}
        className="p-0 border border-sapphire-border-primary shadow-lg [&>div]:overflow-visible"
        style={{
          filter: "none",
          ...style,
        }}
      >
        <MenuContext.Provider value={menuContextValue}>
          <div
            ref={menuRef}
            role="menu"
            tabIndex={-1}
            className={cn("min-w-[18.75rem] py-sapphire-2xs outline-none", className)}
            onKeyDown={handleKeyDown}
            data-testid={dataTestId}
          >
            {headerText && <MenuHeader text={headerText} />}
            {loading ? (
              <LoadingSpinner delay={loadingDelay} />
            ) : (
              children
            )}
          </div>
        </MenuContext.Provider>
      </Popover>
    );
  }

/**
 * Provides a scoped submenu management context.
 * Each submenu level gets its own register/unregister/closeAll so that
 * closing sibling submenus at one level doesn't destroy parent submenus.
 */
function SubmenuScope({ closeMenu, onItemClick, onCheck, parentDepth, children }: {
  closeMenu: MenuContextValue["closeMenu"];
  onItemClick: MenuContextValue["onItemClick"];
  onCheck: MenuContextValue["onCheck"];
  parentDepth: number;
  children: React.ReactNode;
}) {
  const submenuClosersRef = useRef<Map<string, () => void>>(new Map());

  const closeAllSubmenus = useCallback(() => {
    submenuClosersRef.current.forEach((close) => close());
  }, []);

  const registerSubmenu = useCallback((id: string, close: () => void) => {
    submenuClosersRef.current.set(id, close);
  }, []);

  const unregisterSubmenu = useCallback((id: string) => {
    submenuClosersRef.current.delete(id);
  }, []);

  const depth = parentDepth + 1;

  const contextValue = useMemo<MenuContextValue>(
    () => ({ closeMenu, onItemClick, onCheck, closeAllSubmenus, registerSubmenu, unregisterSubmenu, submenuDepth: depth }),
    [closeMenu, onItemClick, onCheck, closeAllSubmenus, registerSubmenu, unregisterSubmenu, depth]
  );

  return (
    <MenuContext.Provider value={contextValue}>
      {children}
    </MenuContext.Provider>
  );
}

/**
 * MenuItem component
 *
 * Supports submenus when children are provided. Children that are MenuItems
 * will render as a submenu that opens on hover.
 */
export function MenuItem(
    {
      text,
      subtitle,
      icon,
      endContent,
      disabled = false,
      startsSection = false,
      children,
      onClick,
      className,
      data,
      checked,
      additionalText,
      loading: itemLoading,
      loadingDelay = 50,
      tooltip,
      accessibleName,
      accessibilityAttributes,
      ref,
      "data-testid": dataTestId,
    }: MenuItemProps & { ref?: React.Ref<HTMLDivElement> }
  ) {
    const { closeMenu, onItemClick, onCheck, closeAllSubmenus, registerSubmenu, unregisterSubmenu, submenuDepth } = useContext(MenuContext);
    const groupContext = useContext(MenuItemGroupContext);
    const itemRef = useRef<HTMLDivElement>(null);
    const submenuRef = useRef<HTMLDivElement | null>(null);
    const [submenuOpen, setSubmenuOpen] = useState(false);
    const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
    const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const submenuId = useId();

    // Check if this item has submenu children (MenuItems as children)
    const submenuChildren: React.ReactNode[] = [];
    let hasSubmenu = false;

    Children.forEach(children, (child) => {
      if (isValidElement(child)) {
        const displayName = (child.type as any)?.displayName;
        if (displayName === "MenuItem" || displayName === "MenuSeparator" || displayName === "MenuHeader" || displayName === "MenuItemGroup") {
          hasSubmenu = true;
          submenuChildren.push(child);
        }
      }
    });

    // Also treat loading items as having submenu (shows spinner in popover)
    if (itemLoading && !hasSubmenu) {
      hasSubmenu = true;
    }

    // Determine role based on group context or accessibilityAttributes override
    const checkMode = groupContext?.checkMode ?? MenuItemGroupCheckMode.None;
    const isInCheckGroup = checkMode !== MenuItemGroupCheckMode.None;
    let role: string = "menuitem";
    if (checkMode === MenuItemGroupCheckMode.Single) {
      role = "menuitemradio";
    } else if (checkMode === MenuItemGroupCheckMode.Multiple) {
      role = "menuitemcheckbox";
    }
    if (accessibilityAttributes?.role) {
      role = accessibilityAttributes.role;
    }

    // Resolve portal container and open submenu.
    // The container is resolved eagerly (before render) so createPortal
    // receives a stable value without reading refs during render.
    const openSubmenu = useCallback(() => {
      if (itemRef.current) {
        const popoverEl = itemRef.current.closest<HTMLElement>('[popover]');
        setPortalContainer(popoverEl ?? document.body);
      }
      setSubmenuOpen(true);
    }, []);

    // Register/unregister submenu closer
    useEffect(() => {
      if (hasSubmenu) {
        registerSubmenu(submenuId, () => setSubmenuOpen(false));
        return () => unregisterSubmenu(submenuId);
      }
    }, [hasSubmenu, registerSubmenu, unregisterSubmenu]);

    // Submenu position update (direct DOM writes, scroll-aware)
    const updateSubmenuPosition = useCallback(() => {
      if (!itemRef.current || !submenuRef.current) return;
      const pos = calculateSubmenuPosition(itemRef.current, submenuRef.current);
      submenuRef.current.style.top = `${pos.top}px`;
      submenuRef.current.style.left = `${pos.left}px`;
    }, []);

    // Ref callback: position submenu immediately when mounted
    const setSubmenuRef = useCallback((node: HTMLDivElement | null) => {
      submenuRef.current = node;
      if (node) {
        updateSubmenuPosition();
      }
    }, [updateSubmenuPosition]);

    // Keep submenu anchored on scroll / resize
    useEffect(() => {
      if (!submenuOpen) return;

      window.addEventListener("scroll", updateSubmenuPosition, true);
      window.addEventListener("resize", updateSubmenuPosition);

      return () => {
        window.removeEventListener("scroll", updateSubmenuPosition, true);
        window.removeEventListener("resize", updateSubmenuPosition);
      };
    }, [submenuOpen, updateSubmenuPosition]);

    // When submenu loading finishes, focus the first submenu item.
    // Same combined-key pattern as root Menu to avoid stale state across
    // open/close cycles.
    const prevSubmenuLoadingRef = useRef({ submenuOpen, itemLoading });
    useEffect(() => {
      const prev = prevSubmenuLoadingRef.current;
      prevSubmenuLoadingRef.current = { submenuOpen, itemLoading };

      if (prev.submenuOpen && submenuOpen && prev.itemLoading && !itemLoading && submenuRef.current) {
        requestAnimationFrame(() => {
          if (submenuRef.current) {
            const items = getFocusableItems(submenuRef.current);
            items[0]?.focus();
          }
        });
      }
    }, [itemLoading, submenuOpen]);

    // Auto-focus first item in submenu when it opens (keyboard only, not on hover)
    const openedByKeyboardRef = useRef(false);
    useEffect(() => {
      if (submenuOpen && submenuRef.current && openedByKeyboardRef.current) {
        openedByKeyboardRef.current = false;
        requestAnimationFrame(() => {
          if (submenuRef.current) {
            const items = getFocusableItems(submenuRef.current);
            if (items.length > 0) {
              items[0].focus();
            }
          }
        });
      }
    }, [submenuOpen]);

    /** Activate a normal (non-check, non-submenu) item */
    const activateItem = (e?: React.SyntheticEvent) => {
      onClick?.(e as React.MouseEvent<HTMLDivElement>);
      const result = onItemClick?.({
        item: { text, subtitle, icon, endContent, disabled, startsSection, hasSubmenu, data, checked },
        text: text || "",
      });
      // If onItemClick returns false, keep menu open (cancelable pattern)
      if (result !== false) {
        closeMenu();
      }
    };

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return;

      // If has submenu, toggle it on click (for touch devices)
      if (hasSubmenu) {
        e.stopPropagation();
        if (submenuOpen) {
          setSubmenuOpen(false);
        } else {
          openSubmenu();
        }
        return;
      }

      // Check group items: fire onCheck and toggle
      if (isInCheckGroup) {
        const detail: MenuItemClickDetail = {
          item: { text, subtitle, icon, endContent, disabled, startsSection, hasSubmenu, data, checked },
          text: text || "",
          checked: !checked,
        };
        onCheck?.(detail);
        onClick?.(e);
        onItemClick?.(detail);
        // Don't close menu when checking items with Shift held
        if (!e.shiftKey) {
          closeMenu();
        }
        return;
      }

      activateItem(e);
    };

    const handleMouseEnter = () => {
      if (disabled) return;

      // Clear any pending close timeout
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }

      if (hasSubmenu) {
        // Close other submenus first
        closeAllSubmenus();
        openSubmenu();
      }
    };

    const handleMouseLeave = () => {
      if (hasSubmenu) {
        // Delay closing to allow moving to submenu
        hoverTimeoutRef.current = setTimeout(() => {
          setSubmenuOpen(false);
        }, 150);
      }
    };

    const handleSubmenuMouseEnter = () => {
      // Cancel the close timeout when entering submenu
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
    };

    const handleSubmenuMouseLeave = () => {
      // Close submenu when leaving it
      hoverTimeoutRef.current = setTimeout(() => {
        setSubmenuOpen(false);
      }, 150);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;

      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        // For check groups, Shift+Enter/Space keeps menu open (UI5 pattern)
        if (isInCheckGroup) {
          const detail: MenuItemClickDetail = {
            item: { text, subtitle, icon, endContent, disabled, startsSection, hasSubmenu, data, checked },
            text: text || "",
            checked: !checked,
          };
          onCheck?.(detail);
          onItemClick?.(detail);
          if (!e.shiftKey) {
            closeMenu();
          }
          return;
        }
        if (hasSubmenu) {
          e.stopPropagation();
          openedByKeyboardRef.current = true;
          openSubmenu();
          return;
        }
        activateItem(e);
      } else if (e.key === "ArrowRight" && hasSubmenu) {
        e.preventDefault();
        e.stopPropagation();
        openedByKeyboardRef.current = true;
        openSubmenu();
      }
    };

    // Submenu keyboard navigation
    const closeSubmenu = useCallback(() => setSubmenuOpen(false), []);
    const submenuKeyDown = useMenuNavigation(submenuRef, {
      isSubmenu: true,
      onClose: closeSubmenu,
      parentItemRef: itemRef,
    });

    // Cleanup timeout on unmount
    useEffect(() => {
      return () => {
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current);
        }
      };
    }, []);

    return (
      <>
        {startsSection && <MenuSeparator />}
        <div
          ref={(node) => {
            itemRef.current = node;
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
          }}
          role={role}
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled}
          aria-haspopup={hasSubmenu ? "menu" : undefined}
          aria-expanded={hasSubmenu ? submenuOpen : undefined}
          aria-checked={isInCheckGroup ? !!checked : undefined}
          data-menu-selected={checked && !isInCheckGroup ? "" : undefined}
          aria-label={accessibleName}
          aria-keyshortcuts={accessibilityAttributes?.ariaKeyShortcuts}
          title={tooltip}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onKeyDown={handleKeyDown}
          data-testid={dataTestId}
          className={cn(
            "group/item relative flex min-h-[54px] cursor-pointer select-none items-center gap-4 px-4 py-2 text-[0.875rem] font-semibold text-sapphire-text-primary outline outline-2 outline-transparent outline-offset-[-2px]",
            "hover:bg-sapphire-neutral-hover-background-2",
            "active:bg-sapphire-brand-selected-background active:text-sapphire-brand-foreground active:border-transparent active:outline-transparent",
            "focus:outline-ring focus:z-10",
            checked && !isInCheckGroup && "bg-sapphire-brand-selected-background text-sapphire-brand-foreground border border-sapphire-brand-foreground focus:border-transparent hover:bg-sapphire-brand-selected-hover-background hover:text-sapphire-brand-foreground",
            disabled && "pointer-events-none opacity-50",
            className
          )}
        >
          {/* Check indicator for items in a group */}
          {isInCheckGroup && (
            <span className="flex size-5 shrink-0 items-center justify-center">
              {checked && <AcceptIcon className="size-5" />}
            </span>
          )}
          {icon && <span className={cn("flex size-5 shrink-0 items-center justify-center text-sapphire-text-tertiary [&>svg]:size-5 group-active/item:text-sapphire-brand-foreground", checked && !isInCheckGroup && "text-sapphire-brand-foreground")}>{icon}</span>}
          {subtitle ? (
            <span className="flex min-w-0 flex-1 flex-col justify-center">
              <span className="truncate">{text}</span>
              <span className="truncate text-[0.75rem] font-normal leading-4 text-sapphire-text-tertiary">{subtitle}</span>
            </span>
          ) : (
            <span className="flex-1 truncate">{text}</span>
          )}
          {/* Priority: submenu arrow > endContent > additionalText */}
          {hasSubmenu ? (
            <SlimArrowRightIcon className="ml-auto size-5 shrink-0 text-sapphire-text-tertiary" />
          ) : endContent ? (
            <span className="ml-auto">{endContent}</span>
          ) : additionalText ? (
            <span className="ml-4 shrink-0 text-sm text-sapphire-text-tertiary">{additionalText}</span>
          ) : null}
        </div>

        {/* Submenu - rendered as portal into the popover's top-layer element.
            portalContainerRef is resolved in openSubmenu() before the render,
            ensuring no ref access happens during render. */}
        {hasSubmenu && submenuOpen && createPortal(
          <SubmenuScope closeMenu={closeMenu} onItemClick={onItemClick} onCheck={onCheck} parentDepth={submenuDepth}>
            <div
              ref={setSubmenuRef}
              role="menu"
              data-submenu="true"
              className="min-w-[18.75rem] overflow-hidden rounded-lg border border-sapphire-border-primary bg-sapphire-card-bg-primary py-sapphire-2xs text-popover-foreground shadow-lg"
              style={{
                position: "fixed",
                // submenuDepth is the *parent's* depth from context.
                // +1 yields the z-index for this child submenu, so nested
                // submenus stack correctly: depth 0→z61, depth 1→z62, etc.
                zIndex: 60 + submenuDepth + 1,
              }}
              onMouseEnter={handleSubmenuMouseEnter}
              onMouseLeave={handleSubmenuMouseLeave}
              onKeyDown={submenuKeyDown}
            >
              {itemLoading ? (
                <LoadingSpinner delay={loadingDelay} />
              ) : (
                submenuChildren
              )}
            </div>
          </SubmenuScope>,
          portalContainer ?? document.body
        )}
      </>
    );
  }

MenuItem.displayName = "MenuItem";

/**
 * MenuItemGroup component
 *
 * Groups MenuItems with optional check mode (Single/Multiple).
 */
export function MenuItemGroup({ checkMode = MenuItemGroupCheckMode.None, children, accessibleName, className, ref, "data-testid": dataTestId }: MenuItemGroupProps & { ref?: React.Ref<HTMLDivElement> }) {
    const mode = checkMode as MenuItemGroupCheckMode;

    let defaultLabel: string | undefined;
    if (mode === MenuItemGroupCheckMode.Single) {
      defaultLabel = "Menu Item Group, Single Selection";
    } else if (mode === MenuItemGroupCheckMode.Multiple) {
      defaultLabel = "Menu Item Group, Multi Selection";
    }

    const groupContextValue = useMemo(() => ({ checkMode: mode }), [mode]);

    return (
      <MenuItemGroupContext.Provider value={groupContextValue}>
        <div
          ref={ref}
          role="group"
          aria-label={accessibleName || defaultLabel}
          className={className}
          data-testid={dataTestId}
        >
          {children}
        </div>
      </MenuItemGroupContext.Provider>
    );
  }

MenuItemGroup.displayName = "MenuItemGroup";

/**
 * MenuSeparator component
 */
export function MenuSeparator({ className, ref, "data-testid": dataTestId }: MenuSeparatorProps & { ref?: React.Ref<HTMLDivElement> }) {
    return (
      <div
        ref={ref}
        role="separator"
        className={cn("my-2 h-px bg-border mx-4", className)}
        data-testid={dataTestId}
      />
    );
  }

MenuSeparator.displayName = "MenuSeparator";

/**
 * MenuHeader component
 */
export function MenuHeader({ text, children, endContent, className, ref, "data-testid": dataTestId }: MenuHeaderProps & { ref?: React.Ref<HTMLDivElement> }) {
    return (
      <div
        ref={ref}
        className={cn(
          "px-4 py-1.5 text-sm font-semibold text-sapphire-text-tertiary",
          endContent && "flex items-center gap-2",
          className
        )}
        data-testid={dataTestId}
      >
        <span className={endContent ? "flex-1" : undefined}>{text || children}</span>
        {endContent && <span className="flex shrink-0 items-center gap-1">{endContent}</span>}
      </div>
    );
  }

MenuHeader.displayName = "MenuHeader";
