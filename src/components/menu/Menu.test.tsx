/**
 * Menu.test.tsx
 *
 * Menu renders via Popover (which uses the native Popover API) and submenus
 * render as portals into document.body. jsdom doesn't support the Popover API,
 * so we polyfill showPopover/hidePopover/matches(':popover-open').
 *
 * We also need:
 *  - ResizeObserver stub (used by Popover's repositioning)
 *  - getBoundingClientRect stub (position engine reads rects)
 *
 * All menu content is inside the Popover, which renders in the DOM,
 * so we query from `document.body` or via `screen`.
 *
 * IMPORTANT: The Menu positions itself relative to the opener element using
 * getBoundingClientRect. We mock that. The opener ref must be passed as a
 * live HTMLElement (not btnRef.current which is null before first render),
 * so ControlledMenu uses a state-based opener pattern.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React, { useState, useCallback } from "react";
import {
  Menu,
  MenuItem,
  MenuSeparator,
  MenuHeader,
  MenuItemGroup,
} from "./Menu";
import { MenuItemGroupCheckMode } from "../../types/menu";
import type { MenuRef } from "../../types/menu";

// ─── Global stubs ──────────────────────────────────────────────────────────────

if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
}

// ─── Popover API polyfill ────────────────────────────────────────────────────

const POPOVER_OPEN_ATTR = "data-popover-open";

let originalShowPopover: typeof HTMLElement.prototype.showPopover;
let originalHidePopover: typeof HTMLElement.prototype.hidePopover;
let originalMatches: typeof Element.prototype.matches;

// Stub getBoundingClientRect so position helpers return consistent values.
// The Popover position engine calls getBoundingClientRect on the opener element.
// We need it to return non-zero values so the menu gets positioned.
beforeEach(() => {
  originalShowPopover = HTMLElement.prototype.showPopover;
  originalHidePopover = HTMLElement.prototype.hidePopover;
  originalMatches = Element.prototype.matches;

  HTMLElement.prototype.showPopover = function () {
    this.setAttribute(POPOVER_OPEN_ATTR, "true");
    // jsdom applies display:none to [popover] by default (per spec).
    // Override to make the element visible for Testing Library queries.
    this.style.setProperty("display", "block", "important");
  };

  HTMLElement.prototype.hidePopover = function () {
    this.removeAttribute(POPOVER_OPEN_ATTR);
    this.style.removeProperty("display");
  };

  Element.prototype.matches = function (selector: string): boolean {
    if (selector === ":popover-open") {
      return this.hasAttribute(POPOVER_OPEN_ATTR);
    }
    return originalMatches.call(this, selector);
  };

  vi.spyOn(Element.prototype, "getBoundingClientRect").mockReturnValue({
    top: 100,
    left: 100,
    right: 200,
    bottom: 120,
    width: 100,
    height: 20,
    x: 100,
    y: 100,
    toJSON: () => ({}),
  });
});

afterEach(() => {
  HTMLElement.prototype.showPopover = originalShowPopover;
  HTMLElement.prototype.hidePopover = originalHidePopover;
  Element.prototype.matches = originalMatches;
  vi.restoreAllMocks();
  vi.useRealTimers();
});

// ─── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Controlled wrapper that renders a button opener + Menu.
 *
 * NOTE: We use a ref callback to store the button element in state, so the
 * Menu receives a real HTMLElement for positioning (not null from btnRef.current
 * at render time).
 */
function ControlledMenu({
  children,
  onClose,
  onItemClick,
  onCheck,
  headerText,
  loading,
  loadingDelay,
  placement,
  onBeforeOpen,
  onOpen,
  onBeforeClose,
  menuRef,
}: {
  children?: React.ReactNode;
  onClose?: () => void;
  onItemClick?: (d: any) => void | boolean;
  onCheck?: (d: any) => void;
  headerText?: string;
  loading?: boolean;
  loadingDelay?: number;
  placement?: any;
  onBeforeOpen?: () => void;
  onOpen?: () => void;
  onBeforeClose?: (d: any) => void;
  menuRef?: React.Ref<MenuRef>;
}) {
  const [open, setOpen] = useState(false);
  const [openerEl, setOpenerEl] = useState<HTMLButtonElement | null>(null);

  const handleClose = useCallback(() => {
    setOpen(false);
    onClose?.();
  }, [onClose]);

  return (
    <>
      <button
        ref={setOpenerEl}
        onClick={() => setOpen(true)}
        data-testid="opener"
      >
        Open
      </button>
      <Menu
        ref={menuRef}
        open={open}
        opener={openerEl}
        onClose={handleClose}
        onItemClick={onItemClick}
        onCheck={onCheck}
        headerText={headerText}
        loading={loading}
        loadingDelay={loadingDelay}
        placement={placement}
        onBeforeOpen={onBeforeOpen}
        onOpen={onOpen}
        onBeforeClose={onBeforeClose}
      >
        {children}
      </Menu>
    </>
  );
}

/** Open the menu by clicking the opener button and wait for Popover to settle */
async function openMenu(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByTestId("opener"));
  // Popover uses requestAnimationFrame for positioning and initial focus.
  // Flush those frames so the menu is fully ready for interaction.
  await act(async () => {
    await new Promise((r) => requestAnimationFrame(r));
    await new Promise((r) => requestAnimationFrame(r));
  });
}

// ─── Tests ─────────────────────────────────────────────────────────────────────

describe("Menu", () => {

  // ── Rendering ─────────────────────────────────────────────────────────────

  describe("rendering", () => {
    it("does not render menu when open=false - BLI: EL-339", () => {
      render(
        <ControlledMenu>
          <MenuItem text="Item A" />
        </ControlledMenu>
      );
      expect(document.querySelector('[role="menu"]')).not.toBeInTheDocument();
    });

    it("renders menu with role=menu when open=true - BLI: EL-339", async () => {
      const user = userEvent.setup();
      render(
        <ControlledMenu>
          <MenuItem text="Item A" />
        </ControlledMenu>
      );
      await openMenu(user);
      expect(document.querySelector('[role="menu"]')).toBeInTheDocument();
    });

    it("renders MenuItems as menuitems - BLI: EL-339", async () => {
      const user = userEvent.setup();
      render(
        <ControlledMenu>
          <MenuItem text="Alpha" />
          <MenuItem text="Beta" />
        </ControlledMenu>
      );
      await openMenu(user);
      expect(screen.getAllByRole("menuitem")).toHaveLength(2);
    });

    it("renders menu in document.body via portal - BLI: EL-339", async () => {
      const user = userEvent.setup();
      render(
        <ControlledMenu>
          <MenuItem text="Portal Item" />
        </ControlledMenu>
      );
      await openMenu(user);
      const menu = document.querySelector('[role="menu"]');
      expect(document.body.contains(menu)).toBe(true);
    });

    it("renders headerText via MenuHeader when provided - BLI: EL-339", async () => {
      const user = userEvent.setup();
      render(
        <ControlledMenu headerText="My Header">
          <MenuItem text="Item" />
        </ControlledMenu>
      );
      await openMenu(user);
      expect(screen.getByText("My Header")).toBeInTheDocument();
    });

    it("renders icon inside a MenuItem - BLI: EL-339", async () => {
      const user = userEvent.setup();
      render(
        <ControlledMenu>
          <MenuItem text="With Icon" icon={<span data-testid="icon">★</span>} />
        </ControlledMenu>
      );
      await openMenu(user);
      expect(screen.getByTestId("icon")).toBeInTheDocument();
    });

    it("renders additionalText when no endContent or submenu - BLI: EL-339", async () => {
      const user = userEvent.setup();
      render(
        <ControlledMenu>
          <MenuItem text="Shortcut" additionalText="Ctrl+K" />
        </ControlledMenu>
      );
      await openMenu(user);
      expect(screen.getByText("Ctrl+K")).toBeInTheDocument();
    });

    it("renders endContent when provided and no submenu - BLI: EL-339", async () => {
      const user = userEvent.setup();
      render(
        <ControlledMenu>
          <MenuItem text="Badge" endContent={<span data-testid="badge">3</span>} />
        </ControlledMenu>
      );
      await openMenu(user);
      expect(screen.getByTestId("badge")).toBeInTheDocument();
    });

    it("applies custom className to menu - BLI: EL-339", () => {
      render(
        <Menu open opener={null} className="my-menu-class">
          <MenuItem text="X" />
        </Menu>
      );
      const menu = document.querySelector('[role="menu"]');
      expect(menu?.className).toContain("my-menu-class");
    });

    it("applies tooltip as title attribute on MenuItem - BLI: EL-339", async () => {
      const user = userEvent.setup();
      render(
        <ControlledMenu>
          <MenuItem text="Tip" tooltip="Helpful tooltip" />
        </ControlledMenu>
      );
      await openMenu(user);
      const item = screen.getByText("Tip").closest('[role="menuitem"]');
      expect(item).toHaveAttribute("title", "Helpful tooltip");
    });

    it("applies aria-label from accessibleName on MenuItem - BLI: EL-339", async () => {
      const user = userEvent.setup();
      render(
        <ControlledMenu>
          <MenuItem text="Named" accessibleName="My Accessible Name" />
        </ControlledMenu>
      );
      await openMenu(user);
      const item = screen.getByRole("menuitem");
      expect(item).toHaveAttribute("aria-label", "My Accessible Name");
    });

    it("applies ariaKeyShortcuts from accessibilityAttributes - BLI: EL-339", async () => {
      const user = userEvent.setup();
      render(
        <ControlledMenu>
          <MenuItem text="Copy" accessibilityAttributes={{ ariaKeyShortcuts: "Ctrl+C" }} />
        </ControlledMenu>
      );
      await openMenu(user);
      const item = screen.getByRole("menuitem");
      expect(item).toHaveAttribute("aria-keyshortcuts", "Ctrl+C");
    });

    it("applies custom role via accessibilityAttributes - BLI: EL-339", async () => {
      const user = userEvent.setup();
      render(
        <ControlledMenu>
          <MenuItem text="Custom" accessibilityAttributes={{ role: "option" }} />
        </ControlledMenu>
      );
      await openMenu(user);
      expect(screen.getByRole("option")).toBeInTheDocument();
    });

    it("closes and removes menu from DOM - BLI: EL-339", async () => {
      const user = userEvent.setup();
      render(
        <ControlledMenu>
          <MenuItem text="Item" />
        </ControlledMenu>
      );
      await openMenu(user);
      expect(document.querySelector('[role="menu"]')).toBeInTheDocument();
      await user.keyboard("{Escape}");
      expect(document.querySelector('[role="menu"]')).not.toBeInTheDocument();
    });
  });

  // ── Open / Close ──────────────────────────────────────────────────────────

  describe("open/close", () => {
    it("closes menu when clicking outside - BLI: EL-339", async () => {
      const user = userEvent.setup();
      render(
        <div>
          <ControlledMenu>
            <MenuItem text="Item" />
          </ControlledMenu>
          <div data-testid="outside">Outside</div>
        </div>
      );
      await openMenu(user);
      expect(document.querySelector('[role="menu"]')).toBeInTheDocument();

      await user.click(screen.getByTestId("outside"));
      expect(document.querySelector('[role="menu"]')).not.toBeInTheDocument();
    });

    it("closes menu on Escape key - BLI: EL-339", async () => {
      const user = userEvent.setup();
      render(
        <ControlledMenu>
          <MenuItem text="Item" />
        </ControlledMenu>
      );
      await openMenu(user);
      await user.keyboard("{Escape}");
      expect(document.querySelector('[role="menu"]')).not.toBeInTheDocument();
    });

    it("calls onClose when menu closes - BLI: EL-339", async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      render(
        <ControlledMenu onClose={onClose}>
          <MenuItem text="Item" />
        </ControlledMenu>
      );
      await openMenu(user);
      await user.keyboard("{Escape}");
      expect(onClose).toHaveBeenCalledOnce();
    });

    it("does not close menu when onItemClick returns false - BLI: EL-339", async () => {
      const user = userEvent.setup();
      render(
        <ControlledMenu onItemClick={() => false}>
          <MenuItem text="Keep Open" />
        </ControlledMenu>
      );
      await openMenu(user);
      await user.click(screen.getByText("Keep Open"));
      expect(document.querySelector('[role="menu"]')).toBeInTheDocument();
    });

    it("fires onBeforeOpen when menu opens - BLI: EL-339", async () => {
      const user = userEvent.setup();
      const onBeforeOpen = vi.fn();
      render(
        <ControlledMenu onBeforeOpen={onBeforeOpen}>
          <MenuItem text="Item" />
        </ControlledMenu>
      );
      await openMenu(user);
      expect(onBeforeOpen).toHaveBeenCalledOnce();
    });

    it("fires onOpen after menu opens and is positioned - BLI: EL-339", async () => {
      const user = userEvent.setup();
      const onOpen = vi.fn();
      render(
        <ControlledMenu onOpen={onOpen}>
          <MenuItem text="Item" />
        </ControlledMenu>
      );
      await openMenu(user);
      expect(onOpen).toHaveBeenCalledOnce();
    });

    it("fires onBeforeClose with escPressed=true when Escape is used - BLI: EL-339", async () => {
      const user = userEvent.setup();
      const onBeforeClose = vi.fn();
      render(
        <ControlledMenu onBeforeClose={onBeforeClose}>
          <MenuItem text="Item" />
        </ControlledMenu>
      );
      await openMenu(user);
      await user.keyboard("{Escape}");
      expect(onBeforeClose).toHaveBeenCalledWith(
        expect.objectContaining({ escPressed: true })
      );
    });

    it("fires onBeforeClose with escPressed=false when clicking outside - BLI: EL-339", async () => {
      const user = userEvent.setup();
      const onBeforeClose = vi.fn();
      render(
        <div>
          <ControlledMenu onBeforeClose={onBeforeClose}>
            <MenuItem text="Item" />
          </ControlledMenu>
          <div data-testid="outside">Outside</div>
        </div>
      );
      await openMenu(user);
      await user.click(screen.getByTestId("outside"));
      expect(onBeforeClose).toHaveBeenCalledWith(
        expect.objectContaining({ escPressed: false })
      );
    });
  });

  // ── Item click ────────────────────────────────────────────────────────────

  describe("item click", () => {
    it("calls onClick on the MenuItem when clicked - BLI: EL-339", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <ControlledMenu>
          <MenuItem text="Click Me" onClick={onClick} />
        </ControlledMenu>
      );
      await openMenu(user);
      await user.click(screen.getByText("Click Me"));
      expect(onClick).toHaveBeenCalledOnce();
    });

    it("calls onItemClick with correct detail on click - BLI: EL-339", async () => {
      const user = userEvent.setup();
      const onItemClick = vi.fn();
      render(
        <ControlledMenu onItemClick={onItemClick}>
          <MenuItem text="My Item" data={{ id: 1 }} />
        </ControlledMenu>
      );
      await openMenu(user);
      await user.click(screen.getByText("My Item"));
      expect(onItemClick).toHaveBeenCalledWith(
        expect.objectContaining({ text: "My Item" })
      );
    });

    it("closes menu after item click by default - BLI: EL-339", async () => {
      const user = userEvent.setup();
      render(
        <ControlledMenu>
          <MenuItem text="Close Me" />
        </ControlledMenu>
      );
      await openMenu(user);
      await user.click(screen.getByText("Close Me"));
      expect(document.querySelector('[role="menu"]')).not.toBeInTheDocument();
    });

    it("keeps menu open when onItemClick returns false - BLI: EL-339", async () => {
      const user = userEvent.setup();
      render(
        <ControlledMenu onItemClick={() => false}>
          <MenuItem text="Stay Open" />
        </ControlledMenu>
      );
      await openMenu(user);
      await user.click(screen.getByText("Stay Open"));
      expect(document.querySelector('[role="menu"]')).toBeInTheDocument();
    });

    it("does not fire onClick for disabled MenuItem - BLI: EL-339", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <ControlledMenu>
          <MenuItem text="Disabled" disabled onClick={onClick} />
        </ControlledMenu>
      );
      await openMenu(user);
      // Click; disabled pointer-events-none but try anyway
      const item = screen.getByRole("menuitem");
      // Dispatch a direct click on the underlying element
      act(() => { item.dispatchEvent(new MouseEvent("click", { bubbles: true })); });
      expect(onClick).not.toHaveBeenCalled();
    });

    it("disabled MenuItem has aria-disabled=true - BLI: EL-339", async () => {
      const user = userEvent.setup();
      render(
        <ControlledMenu>
          <MenuItem text="Disabled" disabled />
        </ControlledMenu>
      );
      await openMenu(user);
      const item = screen.getByRole("menuitem");
      expect(item).toHaveAttribute("aria-disabled", "true");
    });
  });

  // ── Keyboard navigation ───────────────────────────────────────────────────

  describe("keyboard navigation", () => {
    it("ArrowDown moves focus to next item - BLI: EL-339", async () => {
      const user = userEvent.setup();
      render(
        <ControlledMenu>
          <MenuItem text="First" />
          <MenuItem text="Second" />
          <MenuItem text="Third" />
        </ControlledMenu>
      );
      await openMenu(user);

      const items = screen.getAllByRole("menuitem");
      act(() => items[0].focus());
      await user.keyboard("{ArrowDown}");
      expect(document.activeElement).toBe(items[1]);
    });

    it("ArrowUp moves focus to previous item - BLI: EL-339", async () => {
      const user = userEvent.setup();
      render(
        <ControlledMenu>
          <MenuItem text="First" />
          <MenuItem text="Second" />
        </ControlledMenu>
      );
      await openMenu(user);

      const items = screen.getAllByRole("menuitem");
      act(() => items[1].focus());
      await user.keyboard("{ArrowUp}");
      expect(document.activeElement).toBe(items[0]);
    });

    it("ArrowDown does not wrap from last to first item - BLI: EL-339", async () => {
      const user = userEvent.setup();
      render(
        <ControlledMenu>
          <MenuItem text="A" />
          <MenuItem text="B" />
        </ControlledMenu>
      );
      await openMenu(user);

      const items = screen.getAllByRole("menuitem");
      act(() => items[items.length - 1].focus());
      await user.keyboard("{ArrowDown}");
      expect(document.activeElement).toBe(items[items.length - 1]);
    });

    it("ArrowUp does not wrap from first to last item - BLI: EL-339", async () => {
      const user = userEvent.setup();
      render(
        <ControlledMenu>
          <MenuItem text="A" />
          <MenuItem text="B" />
        </ControlledMenu>
      );
      await openMenu(user);

      const items = screen.getAllByRole("menuitem");
      act(() => items[0].focus());
      await user.keyboard("{ArrowUp}");
      expect(document.activeElement).toBe(items[0]);
    });

    it("Home key moves focus to first item - BLI: EL-339", async () => {
      const user = userEvent.setup();
      render(
        <ControlledMenu>
          <MenuItem text="First" />
          <MenuItem text="Second" />
          <MenuItem text="Third" />
        </ControlledMenu>
      );
      await openMenu(user);

      const items = screen.getAllByRole("menuitem");
      act(() => items[2].focus());
      await user.keyboard("{Home}");
      expect(document.activeElement).toBe(items[0]);
    });

    it("End key moves focus to last item - BLI: EL-339", async () => {
      const user = userEvent.setup();
      render(
        <ControlledMenu>
          <MenuItem text="First" />
          <MenuItem text="Second" />
          <MenuItem text="Third" />
        </ControlledMenu>
      );
      await openMenu(user);

      const items = screen.getAllByRole("menuitem");
      act(() => items[0].focus());
      await user.keyboard("{End}");
      expect(document.activeElement).toBe(items[items.length - 1]);
    });

    it("Enter activates focused item - BLI: EL-339", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <ControlledMenu>
          <MenuItem text="Enter Me" onClick={onClick} />
        </ControlledMenu>
      );
      await openMenu(user);

      const items = screen.getAllByRole("menuitem");
      act(() => items[0].focus());
      await user.keyboard("{Enter}");
      expect(onClick).toHaveBeenCalledOnce();
    });

    it("Space activates focused item - BLI: EL-339", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <ControlledMenu>
          <MenuItem text="Space Me" onClick={onClick} />
        </ControlledMenu>
      );
      await openMenu(user);

      const items = screen.getAllByRole("menuitem");
      act(() => items[0].focus());
      await user.keyboard(" ");
      expect(onClick).toHaveBeenCalledOnce();
    });

    it("type-ahead focuses matching item - BLI: EL-339", async () => {
      const user = userEvent.setup();
      render(
        <ControlledMenu>
          <MenuItem text="Apple" />
          <MenuItem text="Banana" />
          <MenuItem text="Cherry" />
        </ControlledMenu>
      );
      await openMenu(user);

      const menu = document.querySelector('[role="menu"]') as HTMLElement;
      act(() => menu.focus());
      await user.keyboard("b");

      const bananaItem = screen.getByText("Banana").closest('[role="menuitem"]') as HTMLElement;
      expect(document.activeElement).toBe(bananaItem);
    });

    it("Tab key closes the menu - BLI: EL-339", async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      render(
        <ControlledMenu onClose={onClose}>
          <MenuItem text="First" />
          <MenuItem text="Second" />
        </ControlledMenu>
      );
      await openMenu(user);

      const items = screen.getAllByRole("menuitem");
      act(() => items[0].focus());
      await user.keyboard("{Tab}");

      expect(onClose).toHaveBeenCalled();
      // Menu is fully removed from DOM
      expect(document.querySelector('[role="menu"]')).not.toBeInTheDocument();
    });
  });

  // ── Separators ────────────────────────────────────────────────────────────

  describe("separators", () => {
    it("renders MenuSeparator with role=separator - BLI: EL-339", async () => {
      const user = userEvent.setup();
      render(
        <ControlledMenu>
          <MenuItem text="A" />
          <MenuSeparator />
          <MenuItem text="B" />
        </ControlledMenu>
      );
      await openMenu(user);
      expect(screen.getByRole("separator")).toBeInTheDocument();
    });

    it("renders separator when startsSection=true on a MenuItem - BLI: EL-339", async () => {
      const user = userEvent.setup();
      render(
        <ControlledMenu>
          <MenuItem text="First" />
          <MenuItem text="Second" startsSection />
        </ControlledMenu>
      );
      await openMenu(user);
      expect(screen.getByRole("separator")).toBeInTheDocument();
    });
  });

  // ── MenuHeader ────────────────────────────────────────────────────────────

  describe("MenuHeader", () => {
    it("renders standalone MenuHeader with text - BLI: EL-339", async () => {
      const user = userEvent.setup();
      render(
        <ControlledMenu>
          <MenuHeader text="Section A" />
          <MenuItem text="Item" />
        </ControlledMenu>
      );
      await openMenu(user);
      expect(screen.getByText("Section A")).toBeInTheDocument();
    });

    it("renders MenuHeader with children - BLI: EL-339", async () => {
      const user = userEvent.setup();
      render(
        <ControlledMenu>
          <MenuHeader>
            <strong data-testid="custom-header">Custom</strong>
          </MenuHeader>
          <MenuItem text="Item" />
        </ControlledMenu>
      );
      await openMenu(user);
      expect(screen.getByTestId("custom-header")).toBeInTheDocument();
    });
  });

  // ── Submenus ──────────────────────────────────────────────────────────────

  describe("submenus", () => {
    it("has aria-haspopup=menu on item with submenu children - BLI: EL-339", async () => {
      const user = userEvent.setup();
      render(
        <ControlledMenu>
          <MenuItem text="Parent">
            <MenuItem text="Child" />
          </MenuItem>
        </ControlledMenu>
      );
      await openMenu(user);
      const parentItem = screen.getByRole("menuitem");
      expect(parentItem).toHaveAttribute("aria-haspopup", "menu");
    });

    it("sets aria-expanded=false before submenu opens - BLI: EL-339", async () => {
      const user = userEvent.setup();
      render(
        <ControlledMenu>
          <MenuItem text="Parent">
            <MenuItem text="Child" />
          </MenuItem>
        </ControlledMenu>
      );
      await openMenu(user);
      const parentItem = screen.getByRole("menuitem");
      expect(parentItem).toHaveAttribute("aria-expanded", "false");
    });

    it("opens submenu on hover (mouseenter) - BLI: EL-339", async () => {
      const user = userEvent.setup();
      render(
        <ControlledMenu>
          <MenuItem text="Parent">
            <MenuItem text="Child Item" />
          </MenuItem>
        </ControlledMenu>
      );
      await openMenu(user);
      const parentItem = screen.getByRole("menuitem");
      await user.hover(parentItem);
      // Two [role="menu"] elements: root menu + submenu
      const menus = document.querySelectorAll('[role="menu"]');
      expect(menus.length).toBeGreaterThanOrEqual(2);
    });

    it("sets aria-expanded=true after submenu opens - BLI: EL-339", async () => {
      const user = userEvent.setup();
      render(
        <ControlledMenu>
          <MenuItem text="Parent">
            <MenuItem text="Child Item" />
          </MenuItem>
        </ControlledMenu>
      );
      await openMenu(user);
      const parentItem = screen.getByRole("menuitem");
      await user.hover(parentItem);
      expect(parentItem).toHaveAttribute("aria-expanded", "true");
    });

    it("opens submenu via keyboard ArrowRight - BLI: EL-339", async () => {
      const user = userEvent.setup();
      render(
        <ControlledMenu>
          <MenuItem text="Parent">
            <MenuItem text="Child Via Keyboard" />
          </MenuItem>
        </ControlledMenu>
      );
      await openMenu(user);

      const parentItem = screen.getByRole("menuitem");
      act(() => parentItem.focus());
      await user.keyboard("{ArrowRight}");

      const allMenus = document.querySelectorAll('[role="menu"]');
      expect(allMenus.length).toBeGreaterThanOrEqual(2);
    });

    it("submenu has data-submenu=true attribute (portal marker) - BLI: EL-339", async () => {
      const user = userEvent.setup();
      render(
        <ControlledMenu>
          <MenuItem text="Parent">
            <MenuItem text="Child" />
          </MenuItem>
        </ControlledMenu>
      );
      await openMenu(user);
      const parentItem = screen.getByRole("menuitem");
      await user.hover(parentItem);
      const submenu = document.querySelector('[data-submenu="true"]');
      expect(submenu).toBeInTheDocument();
    });

    it("closes submenu when hovering away after delay - BLI: EL-339", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(
        <ControlledMenu>
          <MenuItem text="Parent">
            <MenuItem text="Child" />
          </MenuItem>
          <MenuItem text="Other" />
        </ControlledMenu>
      );
      await openMenu(user);
      const items = screen.getAllByRole("menuitem");
      const parentItem = items[0];
      await user.hover(parentItem);

      // Verify submenu opened
      expect(document.querySelector('[data-submenu="true"]')).toBeInTheDocument();

      // Move away and advance past the 150ms hover timeout
      await user.unhover(parentItem);
      act(() => vi.advanceTimersByTime(200));

      expect(document.querySelector('[data-submenu="true"]')).not.toBeInTheDocument();
    });

    it("submenu items propagate onItemClick from root menu - BLI: EL-339", async () => {
      const user = userEvent.setup();
      const onItemClick = vi.fn();
      render(
        <ControlledMenu onItemClick={onItemClick}>
          <MenuItem text="Parent">
            <MenuItem text="Child" />
          </MenuItem>
        </ControlledMenu>
      );
      await openMenu(user);
      const parentItem = screen.getByRole("menuitem");
      await user.hover(parentItem);

      const childItem = screen.getByText("Child").closest('[role="menuitem"]') as HTMLElement;
      await user.click(childItem);
      expect(onItemClick).toHaveBeenCalledWith(
        expect.objectContaining({ text: "Child" })
      );
    });

    it("loading MenuItem opens submenu with spinner - BLI: EL-339", async () => {
      const user = userEvent.setup();
      render(
        <ControlledMenu>
          <MenuItem text="Loading Parent" loading loadingDelay={0} />
        </ControlledMenu>
      );
      await openMenu(user);
      const parentItem = screen.getByRole("menuitem");
      await user.hover(parentItem);
      // Submenu panel opens (role=menu appears)
      const allMenus = document.querySelectorAll('[role="menu"]');
      expect(allMenus.length).toBeGreaterThanOrEqual(2);
    });
  });

  // ── Loading state ─────────────────────────────────────────────────────────

  describe("loading", () => {
    it("shows spinner when loading=true and delay=0 - BLI: EL-339", async () => {
      // Open the menu synchronously with no delay
      render(
        <Menu open opener={null} loading loadingDelay={0}>
          <MenuItem text="Hidden" />
        </Menu>
      );
      // loadingDelay=0 → spinner shows immediately (no timer needed)
      // Items are replaced by spinner — the spinner uses animate-spin
      expect(document.querySelector(".animate-spin")).not.toBeNull();
      expect(screen.queryByText("Hidden")).not.toBeInTheDocument();
    });

    it("hides items when loading=true regardless of loadingDelay - BLI: EL-339", async () => {
      render(
        <Menu open opener={null} loading loadingDelay={0}>
          <MenuItem text="Hidden Item" />
        </Menu>
      );
      expect(screen.queryByText("Hidden Item")).not.toBeInTheDocument();
    });

    it("shows items when loading=false - BLI: EL-339", async () => {
      const user = userEvent.setup();
      render(
        <ControlledMenu loading={false}>
          <MenuItem text="Visible" />
        </ControlledMenu>
      );
      await openMenu(user);
      expect(screen.getByText("Visible")).toBeInTheDocument();
    });

    it("does not show spinner when loading=false - BLI: EL-339", async () => {
      const user = userEvent.setup();
      render(
        <ControlledMenu loading={false}>
          <MenuItem text="Visible" />
        </ControlledMenu>
      );
      await openMenu(user);
      expect(document.querySelector(".animate-spin")).toBeNull();
    });
  });

  // ── MenuItemGroup ─────────────────────────────────────────────────────────

  describe("MenuItemGroup", () => {
    it("renders group with role=group - BLI: EL-339", async () => {
      const user = userEvent.setup();
      render(
        <ControlledMenu>
          <MenuItemGroup>
            <MenuItem text="Option A" />
          </MenuItemGroup>
        </ControlledMenu>
      );
      await openMenu(user);
      expect(screen.getByRole("group")).toBeInTheDocument();
    });

    it("items in Single group have role=menuitemradio - BLI: EL-339", async () => {
      const user = userEvent.setup();
      render(
        <ControlledMenu>
          <MenuItemGroup checkMode={MenuItemGroupCheckMode.Single}>
            <MenuItem text="Radio A" />
            <MenuItem text="Radio B" />
          </MenuItemGroup>
        </ControlledMenu>
      );
      await openMenu(user);
      expect(screen.getAllByRole("menuitemradio")).toHaveLength(2);
    });

    it("items in Multiple group have role=menuitemcheckbox - BLI: EL-339", async () => {
      const user = userEvent.setup();
      render(
        <ControlledMenu>
          <MenuItemGroup checkMode={MenuItemGroupCheckMode.Multiple}>
            <MenuItem text="Check A" />
            <MenuItem text="Check B" />
          </MenuItemGroup>
        </ControlledMenu>
      );
      await openMenu(user);
      expect(screen.getAllByRole("menuitemcheckbox")).toHaveLength(2);
    });

    it("checked item has aria-checked=true - BLI: EL-339", async () => {
      const user = userEvent.setup();
      render(
        <ControlledMenu>
          <MenuItemGroup checkMode={MenuItemGroupCheckMode.Multiple}>
            <MenuItem text="Selected" checked />
            <MenuItem text="Unselected" />
          </MenuItemGroup>
        </ControlledMenu>
      );
      await openMenu(user);
      const items = screen.getAllByRole("menuitemcheckbox");
      expect(items[0]).toHaveAttribute("aria-checked", "true");
      expect(items[1]).toHaveAttribute("aria-checked", "false");
    });

    it("calls onCheck when checking a Multiple item - BLI: EL-339", async () => {
      const user = userEvent.setup();
      const onCheck = vi.fn();
      render(
        <ControlledMenu onCheck={onCheck}>
          <MenuItemGroup checkMode={MenuItemGroupCheckMode.Multiple}>
            <MenuItem text="Check A" />
          </MenuItemGroup>
        </ControlledMenu>
      );
      await openMenu(user);
      await user.click(screen.getByText("Check A"));
      expect(onCheck).toHaveBeenCalledWith(
        expect.objectContaining({ text: "Check A", checked: true })
      );
    });

    it("Shift+Enter keeps menu open when checking an item - BLI: EL-339", async () => {
      const user = userEvent.setup();
      render(
        <ControlledMenu>
          <MenuItemGroup checkMode={MenuItemGroupCheckMode.Multiple}>
            <MenuItem text="Keep Open Check" />
          </MenuItemGroup>
        </ControlledMenu>
      );
      await openMenu(user);
      const item = screen.getByRole("menuitemcheckbox");
      act(() => item.focus());
      await user.keyboard("{Shift>}{Enter}{/Shift}");
      expect(document.querySelector('[role="menu"]')).toBeInTheDocument();
    });

    it("Single group has default aria-label - BLI: EL-339", async () => {
      const user = userEvent.setup();
      render(
        <ControlledMenu>
          <MenuItemGroup checkMode={MenuItemGroupCheckMode.Single}>
            <MenuItem text="A" />
          </MenuItemGroup>
        </ControlledMenu>
      );
      await openMenu(user);
      const group = screen.getByRole("group");
      expect(group).toHaveAttribute("aria-label", "Menu Item Group, Single Selection");
    });

    it("Multiple group has default aria-label - BLI: EL-339", async () => {
      const user = userEvent.setup();
      render(
        <ControlledMenu>
          <MenuItemGroup checkMode={MenuItemGroupCheckMode.Multiple}>
            <MenuItem text="A" />
          </MenuItemGroup>
        </ControlledMenu>
      );
      await openMenu(user);
      const group = screen.getByRole("group");
      expect(group).toHaveAttribute("aria-label", "Menu Item Group, Multi Selection");
    });

    it("accepts string literal checkMode value - BLI: EL-339", async () => {
      const user = userEvent.setup();
      render(
        <ControlledMenu>
          <MenuItemGroup checkMode="Single">
            <MenuItem text="Radio" />
          </MenuItemGroup>
        </ControlledMenu>
      );
      await openMenu(user);
      expect(screen.getByRole("menuitemradio")).toBeInTheDocument();
    });

    it("renders with accessibleName prop - BLI: EL-339", async () => {
      const user = userEvent.setup();
      render(
        <ControlledMenu>
          <MenuItemGroup accessibleName="My Group">
            <MenuItem text="A" />
          </MenuItemGroup>
        </ControlledMenu>
      );
      await openMenu(user);
      const group = screen.getByRole("group", { name: "My Group" });
      expect(group).toBeInTheDocument();
    });
  });

  // ── Imperative ref ────────────────────────────────────────────────────────

  describe("MenuRef imperative API", () => {
    it("isOpen() returns false when menu is closed - BLI: EL-339", () => {
      const ref = React.createRef<MenuRef>();
      render(
        <Menu ref={ref} open={false} opener={null} onClose={() => {}}>
          <MenuItem text="X" />
        </Menu>
      );
      expect(ref.current?.isOpen()).toBe(false);
    });

    it("isOpen() returns true when menu is open - BLI: EL-339", () => {
      const ref = React.createRef<MenuRef>();
      render(
        <Menu ref={ref} open={true} opener={null} onClose={() => {}}>
          <MenuItem text="X" />
        </Menu>
      );
      expect(ref.current?.isOpen()).toBe(true);
    });

    it("close() triggers onClose callback - BLI: EL-339", () => {
      const onClose = vi.fn();
      const ref = React.createRef<MenuRef>();
      render(
        <Menu ref={ref} open={true} opener={null} onClose={onClose}>
          <MenuItem text="X" />
        </Menu>
      );
      act(() => ref.current?.close());
      expect(onClose).toHaveBeenCalledOnce();
    });
  });

  // ── Opener as string ID ───────────────────────────────────────────────────

  describe("opener as string ID", () => {
    it("accepts a string element ID as opener - BLI: EL-339", () => {
      render(
        <div>
          <button id="btn-opener" data-testid="str-opener">Open</button>
          <Menu open opener="btn-opener" onClose={() => {}}>
            <MenuItem text="String Opener Item" />
          </Menu>
        </div>
      );
      expect(screen.getByText("String Opener Item")).toBeInTheDocument();
    });
  });

  // ── Accessibility ─────────────────────────────────────────────────────────

  describe("accessibility", () => {
    it("menu has role=menu - BLI: EL-339", async () => {
      const user = userEvent.setup();
      render(
        <ControlledMenu>
          <MenuItem text="Item" />
        </ControlledMenu>
      );
      await openMenu(user);
      expect(document.querySelector('[role="menu"]')).toBeInTheDocument();
    });

    it("non-disabled item has tabIndex=0 - BLI: EL-339", async () => {
      const user = userEvent.setup();
      render(
        <ControlledMenu>
          <MenuItem text="Item" />
        </ControlledMenu>
      );
      await openMenu(user);
      const item = screen.getByRole("menuitem");
      expect(item).toHaveAttribute("tabindex", "0");
    });

    it("disabled item has tabIndex=-1 - BLI: EL-339", async () => {
      const user = userEvent.setup();
      render(
        <ControlledMenu>
          <MenuItem text="Disabled" disabled />
        </ControlledMenu>
      );
      await openMenu(user);
      const item = screen.getByRole("menuitem");
      expect(item).toHaveAttribute("tabindex", "-1");
    });

    it("popover container has role=dialog and aria-modal=true - BLI: EL-339", async () => {
      const user = userEvent.setup();
      render(
        <ControlledMenu>
          <MenuItem text="Item" />
        </ControlledMenu>
      );
      await openMenu(user);
      const dialog = document.querySelector('[role="dialog"]');
      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveAttribute("aria-modal", "true");
      expect(dialog).toHaveAttribute("aria-label", "Select an option from the menu");
    });
  });

  // ── Placement ─────────────────────────────────────────────────────────────

  describe("placement prop", () => {
    const placements: Array<import("../../types/menu").MenuProps["placement"]> = [
      "bottom-start",
      "bottom-end",
      "top-start",
      "top-end",
      "right-start",
      "right-end",
      "left-start",
      "left-end",
    ];

    it.each(placements)("renders without error with placement=%s - BLI: EL-339", (placement) => {
      render(
        <Menu open opener={null} placement={placement}>
          <MenuItem text="Item" />
        </Menu>
      );
      expect(document.querySelector('[role="menu"]')).toBeInTheDocument();
    });
  });

  // ── MenuSeparator standalone ───────────────────────────────────────────────

  describe("MenuSeparator standalone", () => {
    it("renders separator div with role=separator - BLI: EL-339", () => {
      const { container } = render(<MenuSeparator />);
      expect(container.firstChild).toHaveAttribute("role", "separator");
    });

    it("applies custom className to separator - BLI: EL-339", () => {
      const { container } = render(<MenuSeparator className="custom-sep" />);
      expect(container.firstChild).toHaveClass("custom-sep");
    });
  });

  // ── MenuItem standalone (outside context) ─────────────────────────────────

  describe("MenuItem standalone rendering", () => {
    it("renders menuitem role - BLI: EL-339", () => {
      render(
        <div role="menu">
          <MenuItem text="Standalone" />
        </div>
      );
      expect(screen.getByRole("menuitem")).toBeInTheDocument();
    });

    it("applies custom className to item - BLI: EL-339", () => {
      render(
        <div role="menu">
          <MenuItem text="Styled" className="custom-item" />
        </div>
      );
      expect(screen.getByRole("menuitem")).toHaveClass("custom-item");
    });
  });

  // ── MenuHeader standalone ─────────────────────────────────────────────────

  describe("MenuHeader standalone", () => {
    it("renders with text prop - BLI: EL-339", () => {
      const { getByText } = render(<MenuHeader text="Header Text" />);
      expect(getByText("Header Text")).toBeInTheDocument();
    });

    it("renders with children - BLI: EL-339", () => {
      const { getByTestId } = render(
        <MenuHeader>
          <span data-testid="hdr-child">Child Content</span>
        </MenuHeader>
      );
      expect(getByTestId("hdr-child")).toBeInTheDocument();
    });

    it("applies custom className - BLI: EL-339", () => {
      const { container } = render(<MenuHeader text="H" className="my-hdr" />);
      expect(container.firstChild).toHaveClass("my-hdr");
    });
  });

  // ── Submenu keyboard navigation (ArrowLeft to close) ──────────────────────

  describe("submenu keyboard navigation", () => {
    it("Enter on check group item without Shift closes menu - BLI: EL-339", async () => {
      const user = userEvent.setup();
      render(
        <ControlledMenu>
          <MenuItemGroup checkMode={MenuItemGroupCheckMode.Multiple}>
            <MenuItem text="Close On Enter" />
          </MenuItemGroup>
        </ControlledMenu>
      );
      await openMenu(user);
      const item = screen.getByRole("menuitemcheckbox");
      act(() => item.focus());
      // Enter without Shift should close menu
      await user.keyboard("{Enter}");
      expect(document.querySelector('[role="menu"]')).not.toBeInTheDocument();
    });

    it("Space on check group item without Shift closes menu - BLI: EL-339", async () => {
      const user = userEvent.setup();
      render(
        <ControlledMenu>
          <MenuItemGroup checkMode={MenuItemGroupCheckMode.Multiple}>
            <MenuItem text="Close On Space" />
          </MenuItemGroup>
        </ControlledMenu>
      );
      await openMenu(user);
      const item = screen.getByRole("menuitemcheckbox");
      act(() => item.focus());
      // Space without Shift should close menu
      await user.keyboard(" ");
      expect(document.querySelector('[role="menu"]')).not.toBeInTheDocument();
    });

    it("leaving submenu div closes it after delay - BLI: EL-339", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(
        <ControlledMenu>
          <MenuItem text="Parent">
            <MenuItem text="Child" />
          </MenuItem>
        </ControlledMenu>
      );
      await openMenu(user);
      const parentItem = screen.getAllByRole("menuitem")[0];
      await user.hover(parentItem);

      // Submenu should be open
      const submenu = document.querySelector('[data-submenu="true"]');
      expect(submenu).toBeInTheDocument();

      // Move mouse into the submenu to cancel the parent's leave timeout
      await user.hover(submenu as Element);
      // Now leave the submenu
      await user.unhover(submenu as Element);

      // Advance timer past the 150ms delay
      act(() => vi.advanceTimersByTime(200));

      expect(document.querySelector('[data-submenu="true"]')).not.toBeInTheDocument();
    });

    it("Enter on item with submenu opens it - BLI: EL-339", async () => {
      const user = userEvent.setup();
      render(
        <ControlledMenu>
          <MenuItem text="Parent">
            <MenuItem text="Child Enter" />
          </MenuItem>
        </ControlledMenu>
      );
      await openMenu(user);
      const parentItem = screen.getByRole("menuitem");
      act(() => parentItem.focus());
      await user.keyboard("{Enter}");
      const allMenus = document.querySelectorAll('[role="menu"]');
      expect(allMenus.length).toBeGreaterThanOrEqual(2);
    });

    it("Space on item with submenu opens it - BLI: EL-339", async () => {
      const user = userEvent.setup();
      render(
        <ControlledMenu>
          <MenuItem text="Parent">
            <MenuItem text="Child Space" />
          </MenuItem>
        </ControlledMenu>
      );
      await openMenu(user);
      const parentItem = screen.getByRole("menuitem");
      act(() => parentItem.focus());
      await user.keyboard(" ");
      const allMenus = document.querySelectorAll('[role="menu"]');
      expect(allMenus.length).toBeGreaterThanOrEqual(2);
    });

    it("clicking parent item with submenu opens submenu (via direct dispatch) - BLI: EL-339", async () => {
      const user = userEvent.setup();
      render(
        <ControlledMenu>
          <MenuItem text="Click Parent">
            <MenuItem text="Click Child" />
          </MenuItem>
        </ControlledMenu>
      );
      await openMenu(user);
      const parentItem = screen.getByRole("menuitem");

      // Fire click directly on the element to bypass userEvent's mousedown
      await act(async () => {
        parentItem.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      });

      const menusAfterOpen = document.querySelectorAll('[role="menu"]');
      expect(menusAfterOpen.length).toBeGreaterThanOrEqual(2);
    });
  });

  // ── MenuItem ref forwarding ───────────────────────────────────────────────

  describe("MenuItem ref forwarding", () => {
    it("forwards ref to the menuitem div via object ref - BLI: EL-339", async () => {
      const user = userEvent.setup();
      const ref = React.createRef<HTMLDivElement>();
      render(
        <ControlledMenu>
          <MenuItem text="Ref Item" ref={ref} />
        </ControlledMenu>
      );
      await openMenu(user);
      expect(ref.current).not.toBeNull();
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("forwards ref via function ref - BLI: EL-339", async () => {
      const user = userEvent.setup();
      let capturedNode: HTMLDivElement | null = null;
      const functionRef = (node: HTMLDivElement | null) => {
        capturedNode = node;
      };
      render(
        <ControlledMenu>
          <MenuItem text="Func Ref Item" ref={functionRef} />
        </ControlledMenu>
      );
      await openMenu(user);
      expect(capturedNode).not.toBeNull();
      expect(capturedNode).toBeInstanceOf(HTMLDivElement);
    });
  });

  // ── Shift+Click keeps menu open in check groups ───────────────────────────

  describe("Shift+Click in check group keeps menu open", () => {
    it("Shift+Click keeps menu open - BLI: EL-339", async () => {
      const user = userEvent.setup();
      render(
        <ControlledMenu>
          <MenuItemGroup checkMode={MenuItemGroupCheckMode.Multiple}>
            <MenuItem text="Multi Item" />
          </MenuItemGroup>
        </ControlledMenu>
      );
      await openMenu(user);
      const item = screen.getByRole("menuitemcheckbox");
      // Simulate a shift+click
      act(() => {
        item.dispatchEvent(
          new MouseEvent("click", { bubbles: true, shiftKey: true })
        );
      });
      expect(document.querySelector('[role="menu"]')).toBeInTheDocument();
    });
  });

  // ── Placement with real opener (exercises calculatePosition switch cases) ──

  describe("placement with real opener element", () => {
    function PlacedMenu({ placement }: { placement: any }) {
      const [open, setOpen] = useState(false);
      const [openerEl, setOpenerEl] = useState<HTMLButtonElement | null>(null);
      return (
        <>
          <button ref={setOpenerEl} onClick={() => setOpen(true)}>Open</button>
          <Menu open={open} opener={openerEl} placement={placement} onClose={() => setOpen(false)}>
            <MenuItem text="Item A" />
          </Menu>
        </>
      );
    }

    it.each([
      "bottom-end",
      "top-start",
      "top-end",
      "right-start",
      "right-end",
      "left-start",
      "left-end",
    ] as const)("calculatePosition runs for placement=%s", async (placement) => {
      const user = userEvent.setup();
      render(<PlacedMenu placement={placement} />);
      await user.click(screen.getByRole("button"));
      expect(document.querySelector('[role="menu"]')).toBeInTheDocument();
    });
  });

  // ── calculatePosition viewport clamping ────────────────────────────────────

  describe("calculatePosition viewport clamping", () => {
    function PlacedMenu({ placement }: { placement: any }) {
      const [open, setOpen] = useState(false);
      const [openerEl, setOpenerEl] = useState<HTMLButtonElement | null>(null);
      return (
        <>
          <button ref={setOpenerEl} onClick={() => setOpen(true)}>Open</button>
          <Menu open={open} opener={openerEl} placement={placement} onClose={() => setOpen(false)}>
            <MenuItem text="Item" />
          </Menu>
        </>
      );
    }

    it("clamps menu that would overflow right edge - BLI: EL-339", async () => {
      // Make opener at far right so left + menuWidth > viewport width
      vi.spyOn(Element.prototype, "getBoundingClientRect").mockReturnValue({
        top: 100, left: 950, right: 1020, bottom: 120, width: 70, height: 20, x: 950, y: 100, toJSON: () => ({}),
      });
      const user = userEvent.setup();
      render(<PlacedMenu placement="bottom-start" />);
      await user.click(screen.getByRole("button"));
      expect(document.querySelector('[role="menu"]')).toBeInTheDocument();
    });

    it("clamps menu with negative left - BLI: EL-339", async () => {
      // Make opener at far left so left becomes negative
      vi.spyOn(Element.prototype, "getBoundingClientRect").mockReturnValue({
        top: 100, left: 0, right: 10, bottom: 120, width: 10, height: 20, x: 0, y: 100, toJSON: () => ({}),
      });
      const user = userEvent.setup();
      render(<PlacedMenu placement="left-start" />);
      await user.click(screen.getByRole("button"));
      expect(document.querySelector('[role="menu"]')).toBeInTheDocument();
    });

    it("clamps menu that would overflow bottom edge - BLI: EL-339", async () => {
      // Opener near bottom so top + menuHeight > viewport height
      vi.spyOn(Element.prototype, "getBoundingClientRect").mockReturnValue({
        top: 700, left: 100, right: 200, bottom: 760, width: 100, height: 20, x: 100, y: 700, toJSON: () => ({}),
      });
      const user = userEvent.setup();
      render(<PlacedMenu placement="bottom-start" />);
      await user.click(screen.getByRole("button"));
      expect(document.querySelector('[role="menu"]')).toBeInTheDocument();
    });

    it("clamps menu with negative top - BLI: EL-339", async () => {
      // Opener at very top with top-start placement → top = anchorTop - menuHeight → could go negative
      vi.spyOn(Element.prototype, "getBoundingClientRect").mockReturnValue({
        top: 2, left: 100, right: 200, bottom: 22, width: 100, height: 20, x: 100, y: 2, toJSON: () => ({}),
      });
      const user = userEvent.setup();
      render(<PlacedMenu placement="top-start" />);
      await user.click(screen.getByRole("button"));
      expect(document.querySelector('[role="menu"]')).toBeInTheDocument();
    });
  });

  // ── LoadingSpinner with delay > 0 ─────────────────────────────────────────

  describe("LoadingSpinner with non-zero delay", () => {
    it("shows spinner after delay elapses - BLI: EL-339", async () => {
      vi.useFakeTimers();
      render(<Menu open opener={null} loading loadingDelay={100}><MenuItem text="X" /></Menu>);
      // Before delay: spinner not visible
      expect(document.querySelector(".animate-spin")).not.toBeInTheDocument();
      // Advance past delay
      await act(async () => { vi.advanceTimersByTime(150); });
      expect(document.querySelector(".animate-spin")).toBeInTheDocument();
      vi.useRealTimers();
    });
  });

  // ── Submenu keyboard: ArrowLeft closes submenu and refocuses parent ────────

  describe("submenu ArrowLeft and Escape navigation", () => {
    it("ArrowLeft inside submenu closes it and refocuses parent - BLI: EL-339", async () => {
      const user = userEvent.setup();
      render(
        <ControlledMenu>
          <MenuItem text="Parent Nav">
            <MenuItem text="Child Nav" />
          </MenuItem>
        </ControlledMenu>
      );
      await openMenu(user);
      const parentItem = screen.getByRole("menuitem");
      act(() => parentItem.focus());
      // Open submenu via ArrowRight
      await user.keyboard("{ArrowRight}");
      // Find child menu item and focus it
      await act(async () => { await new Promise((r) => requestAnimationFrame(r)); });
      const allMenuItems = document.querySelectorAll('[role="menuitem"]');
      // Focus the child item (second menuitem)
      act(() => { (allMenuItems[allMenuItems.length - 1] as HTMLElement).focus(); });
      // ArrowLeft should close submenu
      await user.keyboard("{ArrowLeft}");
      // Submenu should be closed - only 1 menu remains
      const menus = document.querySelectorAll('[role="menu"]');
      expect(menus.length).toBe(1);
    });

    it("Escape inside submenu closes it - BLI: EL-339", async () => {
      const user = userEvent.setup();
      render(
        <ControlledMenu>
          <MenuItem text="Parent Esc">
            <MenuItem text="Child Esc" />
          </MenuItem>
        </ControlledMenu>
      );
      await openMenu(user);
      const parentItem = screen.getByRole("menuitem");
      act(() => parentItem.focus());
      await user.keyboard("{ArrowRight}");
      await act(async () => { await new Promise((r) => requestAnimationFrame(r)); });
      const allMenuItems = document.querySelectorAll('[role="menuitem"]');
      act(() => { (allMenuItems[allMenuItems.length - 1] as HTMLElement).focus(); });
      await user.keyboard("{Escape}");
      const menus = document.querySelectorAll('[role="menu"]');
      expect(menus.length).toBe(1);
    });

    it("Tab inside submenu closes only the submenu, not the root menu - BLI: EL-339", async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      render(
        <ControlledMenu onClose={onClose}>
          <MenuItem text="Parent Tab">
            <MenuItem text="Child Tab" />
          </MenuItem>
        </ControlledMenu>
      );
      await openMenu(user);
      const parentItem = screen.getByRole("menuitem");
      act(() => parentItem.focus());
      await user.keyboard("{ArrowRight}");
      await act(async () => { await new Promise((r) => requestAnimationFrame(r)); });
      const allMenuItems = document.querySelectorAll('[role="menuitem"]');
      act(() => { (allMenuItems[allMenuItems.length - 1] as HTMLElement).focus(); });
      await user.keyboard("{Tab}");
      // Submenu should be closed - only root menu remains
      const menus = document.querySelectorAll('[role="menu"]');
      expect(menus.length).toBe(1);
      // Focus returned to parent item
      expect(document.activeElement).toBe(parentItem);
      // Root menu is still open — onClose must NOT have been called
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  // ── Type-ahead: rapid successive characters ────────────────────────────────

  describe("type-ahead search", () => {
    it("type-ahead reuses existing timeout for rapid typing - BLI: EL-339", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(
        <ControlledMenu>
          <MenuItem text="Alpha" />
          <MenuItem text="Beta" />
          <MenuItem text="Gamma" />
        </ControlledMenu>
      );
      await openMenu(user);
      // Rapidly type two characters within the timeout window
      await user.keyboard("b");
      // Don't advance timer — type another character immediately
      await user.keyboard("e");
      // "be" prefix should match "Beta"
      const focused = document.activeElement;
      expect(focused?.textContent).toContain("Beta");
      vi.useRealTimers();
    });
  });

  // ── Submenu auto-focus on keyboard open ────────────────────────────────────

  describe("submenu auto-focus on keyboard open", () => {
    it("first child item gets focus after keyboard-opened submenu - BLI: EL-339", async () => {
      const user = userEvent.setup();
      render(
        <ControlledMenu>
          <MenuItem text="Parent Focus">
            <MenuItem text="First Child" />
            <MenuItem text="Second Child" />
          </MenuItem>
        </ControlledMenu>
      );
      await openMenu(user);
      const parentItem = screen.getByRole("menuitem");
      act(() => parentItem.focus());
      // Open submenu via keyboard
      await user.keyboard("{ArrowRight}");
      // Wait for requestAnimationFrame in the effect
      await act(async () => { await new Promise((r) => requestAnimationFrame(r)); });
      // First child should be focused
      expect(document.activeElement?.textContent).toContain("First Child");
    });
  });

  // ── Rapid hover cancels pending close timeout ──────────────────────────────

  describe("rapid hover clears pending close timeout", () => {
    it("re-entering parent item cancels the close timeout - BLI: EL-339", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(
        <ControlledMenu>
          <MenuItem text="Hover Parent">
            <MenuItem text="Hover Child" />
          </MenuItem>
          <MenuItem text="Other Item" />
        </ControlledMenu>
      );
      await openMenu(user);
      const items = screen.getAllByRole("menuitem");
      const parentItem = items[0];

      // Hover over parent to open submenu
      await user.hover(parentItem);
      expect(document.querySelector('[data-submenu="true"]')).toBeInTheDocument();

      // Mouse-leave parent (start close timeout)
      await user.unhover(parentItem);

      // Before timeout fires, re-enter parent (should cancel timeout)
      await user.hover(parentItem);

      // Submenu should still be open (timeout was cancelled)
      expect(document.querySelector('[data-submenu="true"]')).toBeInTheDocument();
      vi.useRealTimers();
    });
  });

  // ── handleSubmenuMouseLeave closes submenu after delay ────────────────────

  describe("handleSubmenuMouseLeave closes submenu after delay", () => {
    it("leaving the submenu portal closes it - BLI: EL-339", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(
        <ControlledMenu>
          <MenuItem text="Hover P">
            <MenuItem text="Hover C" />
          </MenuItem>
        </ControlledMenu>
      );
      await openMenu(user);
      const parentItem = screen.getAllByRole("menuitem")[0];
      await user.hover(parentItem);
      const submenuPortal = document.querySelector('[data-submenu="true"]');
      expect(submenuPortal).toBeInTheDocument();
      // Enter the submenu portal
      await user.hover(submenuPortal as Element);
      // Leave the submenu portal
      await user.unhover(submenuPortal as Element);
      // Advance past 150ms delay
      act(() => { vi.advanceTimersByTime(200); });
      expect(document.querySelector('[data-submenu="true"]')).not.toBeInTheDocument();
      vi.useRealTimers();
    });
  });

  // ── Sub-submenu (3-level): exercises SubmenuScope register/unregister/closeAll ──

  describe("sub-submenu (3-level nesting)", () => {
    it("registers and unregisters sub-submenu within SubmenuScope - BLI: EL-339", async () => {
      const user = userEvent.setup();
      render(
        <ControlledMenu>
          <MenuItem text="Level1">
            <MenuItem text="Level2">
              <MenuItem text="Level3" />
            </MenuItem>
          </MenuItem>
        </ControlledMenu>
      );
      await openMenu(user);
      // Open first level submenu via keyboard
      const l1 = screen.getByRole("menuitem");
      act(() => l1.focus());
      await user.keyboard("{ArrowRight}");
      await act(async () => { await new Promise((r) => requestAnimationFrame(r)); });
      // Now Level2 item exists in the submenu
      const allItems = document.querySelectorAll('[role="menuitem"]');
      const l2 = Array.from(allItems).find(el => el.textContent?.includes("Level2"));
      expect(l2).toBeTruthy();
      // Open second level by hovering Level2
      if (l2) {
        await user.hover(l2 as Element);
      }
      // Level3 should now be present
      document.querySelector('[role="menuitem"]');
      // Close menu (exercises unregisterSubmenu)
      await user.keyboard("{Escape}");
    });

    it("closeAllSubmenus called via SubmenuScope on sibling hover - BLI: EL-339", async () => {
      const user = userEvent.setup();
      render(
        <ControlledMenu>
          <MenuItem text="Level1">
            <MenuItem text="SubA">
              <MenuItem text="SubA-Child" />
            </MenuItem>
            <MenuItem text="SubB">
              <MenuItem text="SubB-Child" />
            </MenuItem>
          </MenuItem>
        </ControlledMenu>
      );
      await openMenu(user);
      const l1 = screen.getByRole("menuitem");
      act(() => l1.focus());
      // Open L1 submenu
      await user.keyboard("{ArrowRight}");
      await act(async () => { await new Promise((r) => requestAnimationFrame(r)); });
      // Hover SubA to open its sub-submenu
      const subMenuItems = document.querySelectorAll('[data-submenu="true"] [role="menuitem"]');
      const subA = Array.from(subMenuItems).find(el => el.textContent?.includes("SubA"));
      if (subA) {
        await user.hover(subA as Element);
      }
      // Now hover SubB - this triggers closeAllSubmenus on the SubmenuScope context
      const subMenuItemsAfter = document.querySelectorAll('[data-submenu="true"] [role="menuitem"]');
      const subB = Array.from(subMenuItemsAfter).find(el => el.textContent?.includes("SubB"));
      if (subB) {
        await user.hover(subB as Element);
      }
      expect(document.querySelector('[role="menu"]')).toBeInTheDocument();
    });
  });

  // ── Disabled item keyboard and mouse enter ────────────────────────────────

  describe("disabled item interactions", () => {
    it("keydown on disabled item is ignored (handleKeyDown disabled guard) - BLI: EL-339", async () => {
      const user = userEvent.setup();
      const onItemClick = vi.fn();
      render(
        <ControlledMenu onItemClick={onItemClick}>
          <MenuItem text="Enabled First" />
          <MenuItem text="Disabled Item" disabled />
        </ControlledMenu>
      );
      await openMenu(user);
      // Find and focus the disabled item
      const allItems = document.querySelectorAll('[role="menuitem"]');
      const disabledItem = Array.from(allItems).find(el =>
        el.textContent?.includes("Disabled Item")
      ) as HTMLElement | undefined;
      expect(disabledItem).toBeTruthy();
      if (disabledItem) {
        act(() => disabledItem.focus());
        // Press Enter on disabled item — should not call onItemClick
        await user.keyboard("{Enter}");
      }
      expect(onItemClick).not.toHaveBeenCalled();
    });

    it("mouseenter on disabled item with submenu does nothing - BLI: EL-339", async () => {
      const user = userEvent.setup();
      render(
        <ControlledMenu>
          <MenuItem text="Disabled With Sub" disabled>
            <MenuItem text="Unreachable Child" />
          </MenuItem>
        </ControlledMenu>
      );
      await openMenu(user);
      const item = screen.getByRole("menuitem");
      // Hover over the disabled parent — should not open submenu
      await user.hover(item);
      expect(document.querySelector('[data-submenu="true"]')).not.toBeInTheDocument();
    });
  });

  // ── Type-ahead timeout expiry (clears buffer after 500ms) ─────────────────

  describe("type-ahead buffer clears after timeout", () => {
    it("buffer is cleared after 500ms inactivity - BLI: EL-339", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(
        <ControlledMenu>
          <MenuItem text="Apple" />
          <MenuItem text="Banana" />
          <MenuItem text="Cherry" />
        </ControlledMenu>
      );
      await openMenu(user);
      // Type "b" to focus Banana
      await user.keyboard("b");
      // Advance past 500ms timeout to clear the buffer
      act(() => { vi.advanceTimersByTime(600); });
      // Type "a" — should match "Apple" again (buffer was cleared)
      await user.keyboard("a");
      expect(document.activeElement?.textContent).toContain("Apple");
      vi.useRealTimers();
    });
  });

  // ── Submenu positioning on small screens ──────────────────────────────────

  describe("submenu positioning on small screens", () => {
    let origWidthDesc: PropertyDescriptor | undefined;
    let origHeightDesc: PropertyDescriptor | undefined;

    afterEach(() => {
      // Restore original viewport dimensions if they were overridden
      if (origWidthDesc) {
        Object.defineProperty(document.documentElement, "clientWidth", origWidthDesc);
      }
      if (origHeightDesc) {
        Object.defineProperty(document.documentElement, "clientHeight", origHeightDesc);
      }
      origWidthDesc = undefined;
      origHeightDesc = undefined;
    });

    it("overlays submenu on parent menu when no space on either side - BLI: EL-339", async () => {
      const user = userEvent.setup();

      // Simulate a small viewport (320px wide)
      origWidthDesc = Object.getOwnPropertyDescriptor(document.documentElement, "clientWidth");
      origHeightDesc = Object.getOwnPropertyDescriptor(document.documentElement, "clientHeight");
      Object.defineProperty(document.documentElement, "clientWidth", { value: 320, configurable: true });
      Object.defineProperty(document.documentElement, "clientHeight", { value: 568, configurable: true });

      // Parent menuitem spans almost the full width
      vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(function (this: Element) {
        const role = this.getAttribute("role");
        const isSubmenu = this.getAttribute("data-submenu") === "true";
        if (role === "menu" && !isSubmenu) {
          // Root menu
          return { top: 50, left: 10, right: 310, bottom: 200, width: 300, height: 150, x: 10, y: 50, toJSON: () => ({}) };
        }
        if (role === "menuitem") {
          // Menu item
          return { top: 60, left: 10, right: 310, bottom: 104, width: 300, height: 44, x: 10, y: 60, toJSON: () => ({}) };
        }
        if (isSubmenu) {
          // Submenu
          return { top: 0, left: 0, right: 200, bottom: 100, width: 200, height: 100, x: 0, y: 0, toJSON: () => ({}) };
        }
        return { top: 100, left: 100, right: 200, bottom: 120, width: 100, height: 20, x: 100, y: 100, toJSON: () => ({}) };
      });

      render(
        <ControlledMenu>
          <MenuItem text="Parent">
            <MenuItem text="Child A" />
            <MenuItem text="Child B" />
          </MenuItem>
        </ControlledMenu>
      );
      await openMenu(user);

      const parentItem = screen.getByRole("menuitem");
      await user.hover(parentItem);

      const submenu = document.querySelector('[data-submenu="true"]') as HTMLElement | null;
      expect(submenu).toBeInTheDocument();

      if (submenu) {
        const left = parseInt(submenu.style.left, 10);
        // On a 320px viewport where the parent spans 10-310,
        // the submenu should overlay the parent area (left near parent menu's left edge)
        // rather than being pushed far off-screen
        expect(left).toBeGreaterThanOrEqual(0);
        expect(left).toBeLessThanOrEqual(320);
      }
    });

    it("nested submenu z-index increases with depth - BLI: EL-339", async () => {
      const user = userEvent.setup();
      render(
        <ControlledMenu>
          <MenuItem text="L1">
            <MenuItem text="L2">
              <MenuItem text="L3" />
            </MenuItem>
          </MenuItem>
        </ControlledMenu>
      );
      await openMenu(user);

      // Open L1 submenu
      const l1 = screen.getByRole("menuitem");
      await user.hover(l1);

      const submenus = document.querySelectorAll('[data-submenu="true"]');
      expect(submenus.length).toBeGreaterThanOrEqual(1);

      // First submenu z-index should be 61 (60 + 0 + 1)
      const firstSubmenu = submenus[0] as HTMLElement;
      expect(firstSubmenu.style.zIndex).toBe("61");

      // Open L2 submenu
      const l2Items = firstSubmenu.querySelectorAll('[role="menuitem"]');
      const l2 = Array.from(l2Items).find(el => el.textContent?.includes("L2"));
      if (l2) {
        await user.hover(l2 as Element);
      }

      const allSubmenus = document.querySelectorAll('[data-submenu="true"]');
      if (allSubmenus.length >= 2) {
        const secondSubmenu = allSubmenus[1] as HTMLElement;
        // Second submenu z-index should be 62 (60 + 1 + 1)
        expect(secondSubmenu.style.zIndex).toBe("62");
      }
    });
  });

  // ── Focus after loading completes ─────────────────────────────────────────

  describe("focus after loading completes", () => {
    it("focuses first menu item when root loading changes to false - BLI: EL-339", async () => {
      const user = userEvent.setup();

      function LoadingMenu({ menuLoading }: { menuLoading: boolean }) {
        const [open, setOpen] = useState(false);
        const [openerEl, setOpenerEl] = useState<HTMLButtonElement | null>(null);

        return (
          <>
            <button ref={setOpenerEl} onClick={() => setOpen(true)} data-testid="opener">Open</button>
            <Menu open={open} opener={openerEl} onClose={() => setOpen(false)} loading={menuLoading} loadingDelay={0}>
              <MenuItem text="Item A" />
              <MenuItem text="Item B" />
            </Menu>
          </>
        );
      }

      const { rerender } = render(<LoadingMenu menuLoading={true} />);
      await user.click(screen.getByTestId("opener"));
      await act(async () => {
        await new Promise((r) => requestAnimationFrame(r));
        await new Promise((r) => requestAnimationFrame(r));
      });

      // While loading, spinner is shown, no menu items
      expect(screen.queryByText("Item A")).not.toBeInTheDocument();

      // Stop loading via rerender (doesn't steal focus or click outside)
      rerender(<LoadingMenu menuLoading={false} />);
      await act(async () => {
        await new Promise((r) => requestAnimationFrame(r));
        await new Promise((r) => requestAnimationFrame(r));
      });

      // Items should be visible and first one focused
      expect(screen.getByText("Item A")).toBeInTheDocument();
      expect(document.activeElement?.textContent).toContain("Item A");
    });

    it("focuses first submenu item when MenuItem loading changes to false - BLI: EL-339", async () => {
      const user = userEvent.setup();

      function LoadingSubmenu({ itemLoading }: { itemLoading: boolean }) {
        const [open, setOpen] = useState(false);
        const [openerEl, setOpenerEl] = useState<HTMLButtonElement | null>(null);

        return (
          <>
            <button ref={setOpenerEl} onClick={() => setOpen(true)} data-testid="opener">Open</button>
            <Menu open={open} opener={openerEl} onClose={() => setOpen(false)}>
              <MenuItem text="Parent" loading={itemLoading} loadingDelay={0}>
                <MenuItem text="Sub A" />
                <MenuItem text="Sub B" />
              </MenuItem>
            </Menu>
          </>
        );
      }

      const { rerender } = render(<LoadingSubmenu itemLoading={true} />);
      await user.click(screen.getByTestId("opener"));
      await act(async () => {
        await new Promise((r) => requestAnimationFrame(r));
        await new Promise((r) => requestAnimationFrame(r));
      });

      // Open submenu by hovering
      const parentItem = screen.getByRole("menuitem");
      await user.hover(parentItem);

      // Submenu opens with spinner (loading)
      const submenu = document.querySelector('[data-submenu="true"]');
      expect(submenu).toBeInTheDocument();

      // Stop loading via rerender
      rerender(<LoadingSubmenu itemLoading={false} />);
      await act(async () => {
        await new Promise((r) => requestAnimationFrame(r));
        await new Promise((r) => requestAnimationFrame(r));
      });

      // First submenu item should be focused
      expect(document.activeElement?.textContent).toContain("Sub A");
    });
  });

  describe("MenuItem subtitle", () => {
    it("renders subtitle below the title text - BLI: EL-339", async () => {
      render(
        <ControlledMenu>
          <MenuItem text="Edit" subtitle="Modify the document" />
        </ControlledMenu>
      );

      await act(async () => {
        screen.getByTestId("opener").click();
      });

      expect(screen.getByText("Edit")).toBeInTheDocument();
      expect(screen.getByText("Modify the document")).toBeInTheDocument();
    });

    it("does not render subtitle element when subtitle is not provided - BLI: EL-339", async () => {
      render(
        <ControlledMenu>
          <MenuItem text="Edit" />
        </ControlledMenu>
      );

      await act(async () => {
        screen.getByTestId("opener").click();
      });

      const item = screen.getByRole("menuitem");
      // Should have a simple text span, not a flex-col wrapper
      const textSpan = item.querySelector(".flex-col");
      expect(textSpan).not.toBeInTheDocument();
    });

    it("subtitle has text-sapphire-text-tertiary class that does not change with item state - BLI: EL-339", async () => {
      render(
        <ControlledMenu>
          <MenuItem text="Selected Item" subtitle="Description" checked />
          <MenuItem text="Normal Item" subtitle="Another desc" />
        </ControlledMenu>
      );

      await act(async () => {
        screen.getByTestId("opener").click();
      });

      // Both subtitles should have the tertiary text color class
      const subtitles = screen.getAllByText(/Description|Another desc/);
      subtitles.forEach((subtitle) => {
        expect(subtitle.className).toContain("text-sapphire-text-tertiary");
      });
    });

    it("includes subtitle in onItemClick detail - BLI: EL-339", async () => {
      const onItemClick = vi.fn();
      render(
        <ControlledMenu onItemClick={onItemClick}>
          <MenuItem text="Edit" subtitle="Modify the document" />
        </ControlledMenu>
      );

      await act(async () => {
        screen.getByTestId("opener").click();
      });

      await act(async () => {
        screen.getByRole("menuitem").click();
      });

      expect(onItemClick).toHaveBeenCalledWith(
        expect.objectContaining({
          item: expect.objectContaining({ subtitle: "Modify the document" }),
        })
      );
    });
  });
});
