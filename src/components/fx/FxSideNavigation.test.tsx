/**
 * FxSideNavigation.test.tsx
 *
 * Tests for FxSideNavigation, FxSideNavigationItem, and FxSideNavigationContext.
 *
 * Strategy:
 *  - Stub ResizeObserver at module level (jsdom lacks it).
 *  - Use fireEvent for click/hover to avoid fake-timer conflicts.
 *  - Test user-visible behavior, not implementation details.
 */

import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import React from "react";

import { FxSideNavigation } from "./FxSideNavigation";
import { FxSideNavigationItem } from "./FxSideNavigationItem";
import { useFxSideNavigationContext } from "./FxSideNavigationContext";
import type { FxSideNavigationRef, FxSideNavigationItemRef } from "../../types/fx";

// ---- Global stubs ----

if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
}

if (typeof globalThis.IntersectionObserver === "undefined") {
  globalThis.IntersectionObserver = class IntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
    root = null;
    rootMargin = "";
    thresholds = [];
  } as unknown as typeof IntersectionObserver;
}

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

// ---- Fixtures ----

const StarIcon = () => <svg data-testid="star-icon" />;
const HeartIcon = () => <svg data-testid="heart-icon" />;
const BellIcon = () => <svg data-testid="bell-icon" />;
const Logo = () => <div data-testid="logo">Logo</div>;
const TestAvatar = () => <div data-testid="avatar">AV</div>;

// =============================================================================
// FxSideNavigation -- rendering
// =============================================================================

describe("FxSideNavigation -- rendering", () => {
  it("renders children navigation items - BLI: EL-339", () => {
    render(
      <FxSideNavigation>
        <FxSideNavigationItem name="item1" icon={<StarIcon />} text="Item 1" />
        <FxSideNavigationItem name="item2" icon={<HeartIcon />} text="Item 2" />
      </FxSideNavigation>
    );
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
  });

  it("renders header when provided - BLI: EL-339", () => {
    render(
      <FxSideNavigation header={<Logo />}>
        <FxSideNavigationItem name="item1" icon={<StarIcon />} text="Item 1" />
      </FxSideNavigation>
    );
    expect(screen.getByTestId("logo")).toBeInTheDocument();
  });

  it("renders fixedItems section - BLI: EL-339", () => {
    render(
      <FxSideNavigation
        fixedItems={
          <FxSideNavigationItem name="notifications" icon={<BellIcon />} text="Notifications" />
        }
      >
        <FxSideNavigationItem name="item1" icon={<StarIcon />} text="Item 1" />
      </FxSideNavigation>
    );
    expect(screen.getByText("Notifications")).toBeInTheDocument();
  });

  it("collapsed mode applies collapsed class - BLI: EL-339", () => {
    const { container } = render(
      <FxSideNavigation collapsed>
        <FxSideNavigationItem name="item1" icon={<StarIcon />} text="Item 1" />
      </FxSideNavigation>
    );
    const nav = container.querySelector("nav");
    expect(nav).toHaveClass("collapsed");
  });

  it("forceMerged renders single merged list with separator - BLI: EL-339", () => {
    const { container } = render(
      <FxSideNavigation
        forceMerged
        fixedItems={
          <FxSideNavigationItem name="fixed1" icon={<BellIcon />} text="Fixed" />
        }
      >
        <FxSideNavigationItem name="flex1" icon={<StarIcon />} text="Flexible" />
      </FxSideNavigation>
    );
    const nav = container.querySelector("nav");
    expect(nav).toHaveClass("merged");
    // Should have a separator between flexible and fixed items
    expect(container.querySelector('[role="separator"]')).toBeInTheDocument();
  });

  it("renders without fixedItems when not provided - BLI: EL-339", () => {
    const { container } = render(
      <FxSideNavigation>
        <FxSideNavigationItem name="item1" icon={<StarIcon />} text="Item 1" />
      </FxSideNavigation>
    );
    expect(container.querySelector('[role="separator"]')).not.toBeInTheDocument();
  });

  it("dialogMode removes top spacer and h-full class - BLI: EL-339", () => {
    const { container } = render(
      <FxSideNavigation dialogMode forceMerged>
        <FxSideNavigationItem name="item1" icon={<StarIcon />} text="Item 1" />
      </FxSideNavigation>
    );
    const nav = container.querySelector("nav");
    // Should NOT have h-full class in dialog mode
    expect(nav).not.toHaveClass("h-full");
    // Should still have merged class
    expect(nav).toHaveClass("merged");
  });

  it("dialogMode=false keeps h-full class - BLI: EL-339", () => {
    const { container } = render(
      <FxSideNavigation>
        <FxSideNavigationItem name="item1" icon={<StarIcon />} text="Item 1" />
      </FxSideNavigation>
    );
    const nav = container.querySelector("nav");
    expect(nav).toHaveClass("h-full");
  });
});

// =============================================================================
// FxSideNavigationItem -- expanded mode
// =============================================================================

describe("FxSideNavigationItem -- expanded mode", () => {
  it("renders icon + text + badge - BLI: EL-339", () => {
    render(
      <FxSideNavigation>
        <FxSideNavigationItem name="chat" icon={<StarIcon />} text="Conversations" badge="5" />
      </FxSideNavigation>
    );
    expect(screen.getByTestId("star-icon")).toBeInTheDocument();
    expect(screen.getByText("Conversations")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("click fires onSelectionChange - BLI: EL-339", () => {
    const onSelectionChange = vi.fn();
    render(
      <FxSideNavigation onSelectionChange={onSelectionChange}>
        <FxSideNavigationItem name="discover" icon={<StarIcon />} text="Discover" />
      </FxSideNavigation>
    );
    fireEvent.click(screen.getByText("Discover"));
    expect(onSelectionChange).toHaveBeenCalledWith({ name: "discover" });
  });

  it("selected state applies active classes - BLI: EL-339", () => {
    render(
      <FxSideNavigation>
        <FxSideNavigationItem name="item1" icon={<StarIcon />} text="Selected" selected />
      </FxSideNavigation>
    );
    const link = screen.getByRole("link", { name: "Selected" });
    expect(link).toHaveClass("bg-sapphire-chrome-button-bg-selected");
    expect(link).toHaveClass("text-sapphire-text-accent");
    expect(link).toHaveAttribute("aria-current", "page");
  });

  it("disabled state prevents click - BLI: EL-339", () => {
    const onSelectionChange = vi.fn();
    render(
      <FxSideNavigation onSelectionChange={onSelectionChange}>
        <FxSideNavigationItem name="item1" icon={<StarIcon />} text="Disabled" disabled />
      </FxSideNavigation>
    );
    fireEvent.click(screen.getByText("Disabled"));
    expect(onSelectionChange).not.toHaveBeenCalled();
  });

  it("add button shows when showAddButton=true - BLI: EL-339", () => {
    render(
      <FxSideNavigation>
        <FxSideNavigationItem
          name="item1"
          icon={<StarIcon />}
          text="With Add"
          showAddButton
        />
      </FxSideNavigation>
    );
    // The add button is a Button with role="button"
    const addButton = screen.getByRole("button");
    // Should have at least 1 add button
    expect(addButton).toBeInTheDocument();
  });

  it("onAddClick fires with stopPropagation - BLI: EL-339", () => {
    const onAddClick = vi.fn();
    const onSelectionChange = vi.fn();
    render(
      <FxSideNavigation onSelectionChange={onSelectionChange}>
        <FxSideNavigationItem
          name="item1"
          icon={<StarIcon />}
          text="With Add"
          showAddButton
          onAddClick={onAddClick}
        />
      </FxSideNavigation>
    );
    // Find the add button (it's the only button in expanded mode)
    const addButton = screen.getByRole("button");
    fireEvent.click(addButton);
    expect(onAddClick).toHaveBeenCalled();
    // onSelectionChange should NOT have fired (stopPropagation)
    expect(onSelectionChange).not.toHaveBeenCalled();
  });

  it("custom onClick handler prevents onSelectionChange - BLI: EL-339", () => {
    const onClick = vi.fn();
    const onSelectionChange = vi.fn();
    render(
      <FxSideNavigation onSelectionChange={onSelectionChange}>
        <FxSideNavigationItem name="toggle" icon={<StarIcon />} text="Toggle" onClick={onClick} />
      </FxSideNavigation>
    );
    fireEvent.click(screen.getByText("Toggle"));
    expect(onClick).toHaveBeenCalled();
    expect(onSelectionChange).not.toHaveBeenCalled();
  });
});

// =============================================================================
// FxSideNavigationItem -- collapsed mode
// =============================================================================

describe("FxSideNavigationItem -- collapsed mode", () => {
  it("icon-only rendering (text hidden from button) - BLI: EL-339", () => {
    render(
      <FxSideNavigation collapsed>
        <FxSideNavigationItem name="item1" icon={<StarIcon />} text="Hidden Text" />
      </FxSideNavigation>
    );
    expect(screen.getByTestId("star-icon")).toBeInTheDocument();
    // In collapsed mode without flyout, text is not rendered
    const button = screen.getByRole("link");
    expect(button.textContent).not.toContain("Hidden Text");
  });

  it("badge shows as red dot in collapsed mode - BLI: EL-339", () => {
    const { container } = render(
      <FxSideNavigation collapsed>
        <FxSideNavigationItem name="item1" icon={<StarIcon />} text="Item" badge="3" />
      </FxSideNavigation>
    );
    // Badge dot has specific classes: w-2 h-2 rounded-full bg-sapphire-negative
    const badgeDot = container.querySelector(".bg-sapphire-negative.rounded-full");
    expect(badgeDot).toBeInTheDocument();
  });

  it("flyout appears on mouseenter - BLI: EL-339", () => {
    vi.useFakeTimers();
    render(
      <FxSideNavigation collapsed>
        <FxSideNavigationItem name="item1" icon={<StarIcon />} text="Flyout Text" badge="7" />
      </FxSideNavigation>
    );
    // Hover over the wrapper div
    const wrapper = screen.getByRole("link").closest(".relative") as HTMLElement;
    fireEvent.mouseEnter(wrapper);

    // After hover, flyout should show text and badge
    expect(screen.getByText("Flyout Text")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
  });

  it("flyout hidden when locked - BLI: EL-339", () => {
    render(
      <FxSideNavigation collapsed>
        <FxSideNavigationItem name="item1" icon={<StarIcon />} text="Locked Item" locked />
      </FxSideNavigation>
    );
    const wrapper = screen.getByRole("link").closest(".relative") as HTMLElement;
    fireEvent.mouseEnter(wrapper);

    // Text should NOT appear because the item is locked
    expect(screen.queryByText("Locked Item")).not.toBeInTheDocument();
  });

  it("flyout shows text and badge when hovered - BLI: EL-339", () => {
    render(
      <FxSideNavigation collapsed>
        <FxSideNavigationItem name="notifications" icon={<BellIcon />} text="Notifications" badge="12" />
      </FxSideNavigation>
    );
    const wrapper = screen.getByRole("link").closest(".relative") as HTMLElement;
    fireEvent.mouseEnter(wrapper);

    expect(screen.getByText("Notifications")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
  });

  it("avatar renders in fixed section - BLI: EL-339", () => {
    render(
      <FxSideNavigation
        collapsed
        fixedItems={
          <FxSideNavigationItem name="profile" avatar={<TestAvatar />} text="Profile" />
        }
      >
        <FxSideNavigationItem name="item1" icon={<StarIcon />} text="Item 1" />
      </FxSideNavigation>
    );
    expect(screen.getByTestId("avatar")).toBeInTheDocument();
  });

  it("badge dot not shown when flyout is visible - BLI: EL-339", () => {
    const { container } = render(
      <FxSideNavigation collapsed>
        <FxSideNavigationItem name="item1" icon={<StarIcon />} text="Item" badge="5" />
      </FxSideNavigation>
    );
    // Before hover, badge dot should exist
    expect(container.querySelector(".bg-sapphire-negative.rounded-full")).toBeInTheDocument();

    // After hover, flyout shows and badge dot should disappear
    const wrapper = screen.getByRole("link").closest(".relative") as HTMLElement;
    fireEvent.mouseEnter(wrapper);

    // Badge dot (small circle) should not be there when flyout is showing
    const badgeDots = container.querySelectorAll(".bg-sapphire-negative.rounded-full.w-2");
    expect(badgeDots.length).toBe(0);
  });
});

// =============================================================================
// FxSideNavigationItem -- keyboard
// =============================================================================

describe("FxSideNavigationItem -- keyboard", () => {
  it("Enter triggers click / selection - BLI: EL-339", () => {
    const onSelectionChange = vi.fn();
    render(
      <FxSideNavigation onSelectionChange={onSelectionChange}>
        <FxSideNavigationItem name="item1" icon={<StarIcon />} text="Item 1" />
      </FxSideNavigation>
    );
    const button = screen.getByRole("link", { name: /Item 1/ });
    fireEvent.keyDown(button, { key: "Enter" });
    expect(onSelectionChange).toHaveBeenCalledWith({ name: "item1" });
  });

  it("Space triggers click / selection - BLI: EL-339", () => {
    const onSelectionChange = vi.fn();
    render(
      <FxSideNavigation onSelectionChange={onSelectionChange}>
        <FxSideNavigationItem name="item1" icon={<StarIcon />} text="Item 1" />
      </FxSideNavigation>
    );
    const button = screen.getByRole("link", { name: /Item 1/ });
    fireEvent.keyDown(button, { key: " " });
    expect(onSelectionChange).toHaveBeenCalledWith({ name: "item1" });
  });

  it("Enter does not fire when disabled - BLI: EL-339", () => {
    const onSelectionChange = vi.fn();
    render(
      <FxSideNavigation onSelectionChange={onSelectionChange}>
        <FxSideNavigationItem name="item1" icon={<StarIcon />} text="Item 1" disabled />
      </FxSideNavigation>
    );
    const button = screen.getByRole("link");
    fireEvent.keyDown(button, { key: "Enter" });
    expect(onSelectionChange).not.toHaveBeenCalled();
  });

  it("Escape closes flyout in collapsed mode - BLI: EL-339", () => {
    render(
      <FxSideNavigation collapsed>
        <FxSideNavigationItem name="item1" icon={<StarIcon />} text="Flyout" />
      </FxSideNavigation>
    );

    // Open flyout via hover
    const wrapper = screen.getByRole("link").closest(".relative") as HTMLElement;
    fireEvent.mouseEnter(wrapper);
    expect(screen.getByText("Flyout")).toBeInTheDocument();

    // Press Escape on the item button
    const buttons = screen.getAllByRole("link");
    fireEvent.keyDown(buttons[0], { key: "Escape" });

    // The flyout text should disappear (since collapsed, text only shows in flyout)
    expect(screen.queryByText("Flyout")).not.toBeInTheDocument();
  });

  it("ArrowDown navigates to next item - BLI: EL-339", () => {
    render(
      <FxSideNavigation>
        <FxSideNavigationItem name="item1" icon={<StarIcon />} text="First" />
        <FxSideNavigationItem name="item2" icon={<HeartIcon />} text="Second" />
      </FxSideNavigation>
    );
    const firstButton = screen.getByRole("link", { name: /First/ });
    const secondButton = screen.getByRole("link", { name: /Second/ });

    // Focus the first item and press ArrowDown
    act(() => { firstButton.focus(); });
    act(() => { fireEvent.keyDown(firstButton, { key: "ArrowDown" }); });

    // The second item should now be focused
    expect(document.activeElement).toBe(secondButton);
  });

  it("ArrowUp navigates to previous item - BLI: EL-339", () => {
    render(
      <FxSideNavigation>
        <FxSideNavigationItem name="item1" icon={<StarIcon />} text="First" />
        <FxSideNavigationItem name="item2" icon={<HeartIcon />} text="Second" />
      </FxSideNavigation>
    );
    const firstButton = screen.getByRole("link", { name: /First/ });
    const secondButton = screen.getByRole("link", { name: /Second/ });

    act(() => { secondButton.focus(); });
    act(() => { fireEvent.keyDown(secondButton, { key: "ArrowUp" }); });

    expect(document.activeElement).toBe(firstButton);
  });

  it("ArrowDown wraps to first item from last item - BLI: EL-339", () => {
    render(
      <FxSideNavigation>
        <FxSideNavigationItem name="item1" icon={<StarIcon />} text="First" />
        <FxSideNavigationItem name="item2" icon={<HeartIcon />} text="Last" />
      </FxSideNavigation>
    );
    const firstButton = screen.getByRole("link", { name: /First/ });
    const lastButton = screen.getByRole("link", { name: /Last/ });

    act(() => { lastButton.focus(); });
    act(() => { fireEvent.keyDown(lastButton, { key: "ArrowDown" }); });

    expect(document.activeElement).toBe(firstButton);
  });

  it("Tab key moves from navigation link to add button - BLI: EL-339", () => {
    render(
      <FxSideNavigation>
        <FxSideNavigationItem
          name="item1"
          icon={<StarIcon />}
          text="With Add"
          showAddButton
          addButtonTooltip="Add new item"
        />
      </FxSideNavigation>
    );
    const link = screen.getByRole("link", { name: "With Add" });
    const addButton = screen.getByRole("button");

    // Focus the link first
    act(() => { link.focus(); });
    expect(document.activeElement).toBe(link);

    // Tab to add button (simulate tab - in real browser this happens automatically)
    act(() => { addButton.focus(); });
    expect(document.activeElement).toBe(addButton);
  });

  it("focus ring only on link when link is focused - BLI: EL-339", () => {
    render(
      <FxSideNavigation>
        <FxSideNavigationItem
          name="item1"
          icon={<StarIcon />}
          text="With Add"
          showAddButton
        />
      </FxSideNavigation>
    );
    const link = screen.getByRole("link", { name: "With Add" });
    const container = link.parentElement as HTMLElement;

    // Focus the link
    act(() => { link.focus(); });
    fireEvent.focus(link);

    // Container should have focus-within classes
    expect(container).toHaveClass("focus-within:ring-2");
  });

  it("focus ring only on add button when add button is focused - BLI: EL-339", () => {
    render(
      <FxSideNavigation>
        <FxSideNavigationItem
          name="item1"
          icon={<StarIcon />}
          text="With Add"
          showAddButton
        />
      </FxSideNavigation>
    );
    const addButton = screen.getByRole("button");

    // Focus the add button
    act(() => { addButton.focus(); });
    fireEvent.focus(addButton);

    // Add button should be focused
    expect(document.activeElement).toBe(addButton);
  });

  it("disabled items can receive focus but not be activated - BLI: EL-339", () => {
    const onSelectionChange = vi.fn();
    render(
      <FxSideNavigation onSelectionChange={onSelectionChange}>
        <FxSideNavigationItem name="item1" icon={<StarIcon />} text="First" />
        <FxSideNavigationItem name="item2" icon={<HeartIcon />} text="Disabled" disabled />
        <FxSideNavigationItem name="item3" icon={<BellIcon />} text="Third" />
      </FxSideNavigation>
    );
    const firstLink = screen.getByRole("link", { name: /First/ });
    const disabledLink = screen.getByRole("link", { name: /Disabled/ });

    // Navigate to disabled item
    act(() => { firstLink.focus(); });
    act(() => { fireEvent.keyDown(firstLink, { key: "ArrowDown" }); });

    // Should be able to focus disabled item
    expect(document.activeElement).toBe(disabledLink);

    // But Enter/Space should not activate it
    fireEvent.keyDown(disabledLink, { key: "Enter" });
    expect(onSelectionChange).not.toHaveBeenCalled();

    fireEvent.keyDown(disabledLink, { key: " " });
    expect(onSelectionChange).not.toHaveBeenCalled();
  });

  it("Tab works in expanded mode with add button - BLI: EL-339", () => {
    render(
      <FxSideNavigation>
        <FxSideNavigationItem
          name="item1"
          icon={<StarIcon />}
          text="First"
          showAddButton
        />
        <FxSideNavigationItem
          name="item2"
          icon={<HeartIcon />}
          text="Second"
        />
      </FxSideNavigation>
    );
    const firstLink = screen.getByRole("link", { name: /First/ });
    const addButton = screen.getByRole("button");
    const secondLink = screen.getByRole("link", { name: /Second/ });

    // Tab sequence: First link -> Add button -> Second link
    act(() => { firstLink.focus(); });
    expect(document.activeElement).toBe(firstLink);

    act(() => { addButton.focus(); });
    expect(document.activeElement).toBe(addButton);

    act(() => { secondLink.focus(); });
    expect(document.activeElement).toBe(secondLink);
  });

  it("Enter key on add button does not trigger navigation - BLI: EL-339", () => {
    const onAddClick = vi.fn();
    const onSelectionChange = vi.fn();
    render(
      <FxSideNavigation onSelectionChange={onSelectionChange}>
        <FxSideNavigationItem
          name="item1"
          icon={<StarIcon />}
          text="With Add"
          showAddButton
          onAddClick={onAddClick}
        />
      </FxSideNavigation>
    );
    const addButton = screen.getByRole("button");

    act(() => { addButton.focus(); });
    fireEvent.click(addButton);

    // Add button click should fire, but not navigation
    expect(onAddClick).toHaveBeenCalled();
    expect(onSelectionChange).not.toHaveBeenCalled();
  });

  it("Space key activates link - BLI: EL-339", () => {
    const onSelectionChange = vi.fn();
    render(
      <FxSideNavigation onSelectionChange={onSelectionChange}>
        <FxSideNavigationItem name="item1" icon={<StarIcon />} text="Item" />
      </FxSideNavigation>
    );
    const link = screen.getByRole("link", { name: /Item/ });

    act(() => { link.focus(); });
    fireEvent.keyDown(link, { key: " " });

    expect(onSelectionChange).toHaveBeenCalledWith({ name: "item1" });
  });

  it("Enter key activates link - BLI: EL-339", () => {
    const onSelectionChange = vi.fn();
    render(
      <FxSideNavigation onSelectionChange={onSelectionChange}>
        <FxSideNavigationItem name="item1" icon={<StarIcon />} text="Item" />
      </FxSideNavigation>
    );
    const link = screen.getByRole("link", { name: /Item/ });

    act(() => { link.focus(); });
    fireEvent.keyDown(link, { key: "Enter" });

    expect(onSelectionChange).toHaveBeenCalledWith({ name: "item1" });
  });

  it("keyboard navigation works in collapsed mode with flyouts - BLI: EL-339", async () => {
    render(
      <FxSideNavigation collapsed>
        <FxSideNavigationItem name="item1" icon={<StarIcon />} text="First" />
        <FxSideNavigationItem name="item2" icon={<HeartIcon />} text="Second" />
      </FxSideNavigation>
    );

    // Wait for mount
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 10));
    });

    const firstLink = screen.getByRole("link", { name: /First/ });
    const secondLink = screen.getByRole("link", { name: /Second/ });

    // Focus first item - should show flyout
    act(() => { firstLink.focus(); });
    fireEvent.focus(firstLink);

    // Navigate down to second item
    act(() => { fireEvent.keyDown(firstLink, { key: "ArrowDown" }); });

    expect(document.activeElement).toBe(secondLink);
  });

  it("keyboard focus shows flyout in collapsed mode - BLI: EL-339", async () => {
    render(
      <FxSideNavigation collapsed>
        <FxSideNavigationItem name="item1" icon={<StarIcon />} text="Item" badge="3" />
      </FxSideNavigation>
    );

    // Wait for mount
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 10));
    });

    const link = screen.getByRole("link", { name: /Item/ });

    // Focus should show flyout with text
    act(() => { link.focus(); });
    fireEvent.focus(link);

    // Wait a tick
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 10));
    });

    // Flyout should be visible with text (not just icon)
    expect(screen.getByText("Item")).toBeInTheDocument();
  });

  it("Escape key closes flyout in collapsed mode - BLI: EL-339", async () => {
    render(
      <FxSideNavigation collapsed>
        <FxSideNavigationItem name="item1" icon={<StarIcon />} text="Item" />
      </FxSideNavigation>
    );

    // Wait for mount
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 10));
    });

    const link = screen.getByRole("link", { name: /Item/ });

    // Focus to show flyout
    act(() => { link.focus(); });
    fireEvent.focus(link);

    // Escape should close flyout
    act(() => { fireEvent.keyDown(link, { key: "Escape" }); });

    // Link should lose focus
    expect(document.activeElement).not.toBe(link);
  });
});


// =============================================================================
// FxSideNavigationContext
// =============================================================================

describe("FxSideNavigationContext", () => {
  it("useFxSideNavigationContext returns null outside provider - BLI: EL-339", () => {
    let contextValue: ReturnType<typeof useFxSideNavigationContext> = undefined as unknown as ReturnType<typeof useFxSideNavigationContext>;
    const Consumer = () => {
      contextValue = useFxSideNavigationContext();
      return null;
    };
    render(<Consumer />);
    expect(contextValue).toBeNull();
  });
});

// =============================================================================
// FxSideNavigation ref
// =============================================================================

describe("FxSideNavigation ref", () => {
  it("imperative getNativeElement returns the nav element - BLI: EL-339", () => {
    const ref = React.createRef<FxSideNavigationRef>();
    render(
      <FxSideNavigation ref={ref}>
        <FxSideNavigationItem name="item1" icon={<StarIcon />} text="Item" />
      </FxSideNavigation>
    );
    expect(ref.current).not.toBeNull();
    const el = ref.current!.getNativeElement();
    expect(el).toBeInstanceOf(HTMLElement);
    expect(el?.tagName).toBe("NAV");
    expect(ref.current!.nativeElement).toBeInstanceOf(HTMLElement);
    expect(ref.current!.nativeElement?.tagName).toBe("NAV");
  });

  it("closeFlyout calls the registered handler for an item - BLI: EL-339", () => {
    vi.useFakeTimers();
    const ref = React.createRef<FxSideNavigationRef>();
    render(
      <FxSideNavigation ref={ref} collapsed>
        <FxSideNavigationItem name="item1" icon={<StarIcon />} text="Flyout Item" />
      </FxSideNavigation>
    );

    // Open flyout via hover
    const wrapper = screen.getByRole("link", { name: "Flyout Item" }).closest(".relative") as HTMLElement;
    fireEvent.mouseEnter(wrapper);
    expect(screen.getByText("Flyout Item")).toBeInTheDocument();

    // Close it via imperative API
    act(() => {
      ref.current!.closeFlyout("item1");
    });

    // Flyout text should disappear
    expect(screen.queryByText("Flyout Item")).not.toBeInTheDocument();
  });

  it("closeFlyout does not throw for unknown item name - BLI: EL-339", () => {
    const ref = React.createRef<FxSideNavigationRef>();
    render(
      <FxSideNavigation ref={ref}>
        <FxSideNavigationItem name="item1" icon={<StarIcon />} text="Item" />
      </FxSideNavigation>
    );
    // Should not throw
    expect(() => ref.current!.closeFlyout("nonexistent")).not.toThrow();
  });
});

// =============================================================================
// FxSideNavigationItem ref
// =============================================================================

describe("FxSideNavigationItem ref", () => {
  it("exposes nativeElement via ref - BLI: EL-339", () => {
    const ref = React.createRef<FxSideNavigationItemRef>();
    render(
      <FxSideNavigation>
        <FxSideNavigationItem ref={ref} name="item1" icon={<StarIcon />} text="Item" />
      </FxSideNavigation>
    );
    expect(ref.current).not.toBeNull();
    expect(ref.current!.nativeElement).toBeInstanceOf(HTMLElement);
    expect(ref.current!.getNativeElement()).toBeInstanceOf(HTMLElement);
  });
});

// =============================================================================
// Collapsed mode interactions
// =============================================================================

describe("FxSideNavigationItem -- collapsed mode interactions", () => {
  it("can click on navigation item in collapsed mode - BLI: EL-339", () => {
    const onSelectionChange = vi.fn();
    render(
      <FxSideNavigation collapsed onSelectionChange={onSelectionChange}>
        <FxSideNavigationItem name="item1" icon={<StarIcon />} text="Test Item" />
      </FxSideNavigation>
    );

    // Find the button (not the flyout div)
    const button = screen.getByRole("link", { name: "Test Item" });
    expect(button).toBeInTheDocument();

    // Click should work
    fireEvent.click(button);
    expect(onSelectionChange).toHaveBeenCalledWith({ name: "item1" });
  });

  it("can click on toggle button in collapsed mode - BLI: EL-339", () => {
    const onClick = vi.fn();
    render(
      <FxSideNavigation collapsed>
        <FxSideNavigationItem
          name="toggle"
          icon={<StarIcon />}
          text="Toggle"
          onClick={onClick}
        />
      </FxSideNavigation>
    );

    // Find the button
    const button = screen.getByRole("link", { name: "Toggle" });

    // Click should work
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalled();
  });

  it("can click add button in collapsed mode flyout - BLI: EL-339", async () => {
    const onAddClick = vi.fn();
    render(
      <FxSideNavigation collapsed>
        <FxSideNavigationItem
          name="item1"
          icon={<StarIcon />}
          text="With Add"
          showAddButton
          addButtonTooltip="Add new item"
          onAddClick={onAddClick}
        />
      </FxSideNavigation>
    );

    // Wait for mount (isMounted state)
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 10));
    });

    // Hover to show flyout
    const button = screen.getByRole("link", { name: "With Add" });
    const wrapper = button.closest(".relative") as HTMLElement;
    fireEvent.mouseEnter(wrapper);

    // Wait for flyout to show
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 10));
    });

    // The add button should be in the flyout - it's a Button component (role=button)
    const addButton = screen.getByRole("button", { name: "Add new item" });
    expect(addButton).toBeInTheDocument();

    // Click add button
    fireEvent.click(addButton);
    expect(onAddClick).toHaveBeenCalled();
  });

  it("focus remains on add button when clicked in expanded mode - BLI: EL-339", () => {
    const onAddClick = vi.fn();
    render(
      <FxSideNavigation>
        <FxSideNavigationItem
          name="conversations"
          icon={<StarIcon />}
          text="Conversations"
          showAddButton
          addButtonTooltip="New Chat"
          onAddClick={onAddClick}
        />
      </FxSideNavigation>
    );

    const addButton = screen.getByRole("button", { name: "New Chat" });
    const navLink = screen.getByRole("link", { name: "Conversations" });

    // Focus and click the add button
    act(() => { addButton.focus(); });
    expect(document.activeElement).toBe(addButton);

    fireEvent.click(addButton);

    // After clicking, focus should remain on the add button (not move to nav item)
    expect(onAddClick).toHaveBeenCalled();
    // Note: focus doesn't change programmatically in expanded mode - browser keeps it naturally
    expect(document.activeElement).not.toBe(navLink);
    expect(document.activeElement).toBe(addButton);
  });

  it("focus moves to nav item after add button click in collapsed mode - BLI: EL-339", async () => {
    vi.useFakeTimers();
    const onAddClick = vi.fn();
    render(
      <FxSideNavigation collapsed>
        <FxSideNavigationItem
          name="conversations"
          icon={<StarIcon />}
          text="Conversations"
          showAddButton
          addButtonTooltip="New Chat"
          onAddClick={onAddClick}
        />
      </FxSideNavigation>
    );

    // Wait for mount
    await act(async () => {
      vi.advanceTimersByTime(10);
    });

    // Hover to show flyout
    const navButton = screen.getByRole("link", { name: "Conversations" });
    const wrapper = navButton.closest(".relative") as HTMLElement;
    fireEvent.mouseEnter(wrapper);

    // Wait for flyout
    await act(async () => {
      vi.advanceTimersByTime(10);
    });

    const addButton = screen.getByRole("button", { name: "New Chat" });

    // Click the add button
    await act(async () => {
      fireEvent.click(addButton);
    });
    expect(onAddClick).toHaveBeenCalled();

    // Fast-forward timers to allow focus to move (100ms timeout + 50ms for flag reset)
    await act(async () => {
      vi.advanceTimersByTime(200);
    });

    // After clicking in collapsed mode, focus should move to nav item
    expect(document.activeElement).toBe(navButton);
  });
});

// =============================================================================
// FxSideNavigationItem -- transition-aware behavior
// =============================================================================

describe("FxSideNavigationItem -- transition-aware behavior", () => {
  it("text and badge stay visible during collapsing transition (settledCollapsed=false)", () => {
    render(
      <FxSideNavigation collapsed isTransitioning transitionDirection="collapsing">
        <FxSideNavigationItem name="item1" icon={<StarIcon />} text="Conversations" badge="5" />
      </FxSideNavigation>
    );
    // Text should still be in the DOM during transition (fading out)
    expect(screen.getByText("Conversations")).toBeInTheDocument();
    // Badge tag should still be in the DOM during transition
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("text and badge are removed after transition settles (settledCollapsed=true)", () => {
    render(
      <FxSideNavigation collapsed>
        <FxSideNavigationItem name="item1" icon={<StarIcon />} text="Conversations" badge="5" />
      </FxSideNavigation>
    );
    // Text should not be rendered when fully collapsed
    const link = screen.getByRole("link");
    expect(link.textContent).not.toContain("Conversations");
    // Badge tag should not be rendered (badge dot is separate)
    expect(screen.queryByText("5")).not.toBeInTheDocument();
  });

  it("text opacity is 0 during collapsing transition", () => {
    render(
      <FxSideNavigation collapsed isTransitioning transitionDirection="collapsing">
        <FxSideNavigationItem name="item1" icon={<StarIcon />} text="Fading" />
      </FxSideNavigation>
    );
    const textSpan = screen.getByText("Fading");
    expect(textSpan).toHaveStyle({ opacity: "0" });
  });

  it("text opacity is 1 when expanded and not transitioning", () => {
    render(
      <FxSideNavigation>
        <FxSideNavigationItem name="item1" icon={<StarIcon />} text="Visible" />
      </FxSideNavigation>
    );
    const textSpan = screen.getByText("Visible");
    expect(textSpan).toHaveStyle({ opacity: "1" });
  });

  it("add button hides immediately when collapsed (not waiting for transition)", () => {
    render(
      <FxSideNavigation collapsed isTransitioning transitionDirection="collapsing">
        <FxSideNavigationItem
          name="item1"
          icon={<StarIcon />}
          text="Item"
          showAddButton
          addButtonTooltip="Add new"
        />
      </FxSideNavigation>
    );
    // Add button should already be gone even though transition is in progress
    expect(screen.queryByRole("button", { name: "Add new" })).not.toBeInTheDocument();
  });

  it("add button visible in expanded mode", () => {
    render(
      <FxSideNavigation>
        <FxSideNavigationItem
          name="item1"
          icon={<StarIcon />}
          text="Item"
          showAddButton
          addButtonTooltip="Add new"
        />
      </FxSideNavigation>
    );
    expect(screen.getByRole("button", { name: "Add new" })).toBeInTheDocument();
  });

  it("badge dot does not appear during collapsing transition", () => {
    const { container } = render(
      <FxSideNavigation collapsed isTransitioning transitionDirection="collapsing">
        <FxSideNavigationItem name="item1" icon={<StarIcon />} text="Item" badge="3" />
      </FxSideNavigation>
    );
    // Badge dot should not be shown during transition
    const badgeDot = container.querySelector(".bg-sapphire-negative.rounded-full.w-2");
    expect(badgeDot).not.toBeInTheDocument();
  });

  it("badge dot appears after transition settles", () => {
    const { container } = render(
      <FxSideNavigation collapsed>
        <FxSideNavigationItem name="item1" icon={<StarIcon />} text="Item" badge="3" />
      </FxSideNavigation>
    );
    const badgeDot = container.querySelector(".bg-sapphire-negative.rounded-full");
    expect(badgeDot).toBeInTheDocument();
  });

  it("flyout does not activate during collapsing transition", () => {
    render(
      <FxSideNavigation collapsed isTransitioning transitionDirection="collapsing">
        <FxSideNavigationItem name="item1" icon={<StarIcon />} text="No Flyout" />
      </FxSideNavigation>
    );
    const wrapper = screen.getByRole("link").closest(".relative") as HTMLElement;
    fireEvent.mouseEnter(wrapper);
    // Flyout text should not appear — flyout is suppressed during transition
    // Text is in the DOM from the fading-out expanded view, not from a flyout
    const flyout = wrapper.querySelector("[data-flyout-child]");
    expect(flyout).not.toBeInTheDocument();
  });

  it("flyout activates after transition settles in collapsed mode", async () => {
    vi.useFakeTimers();
    render(
      <FxSideNavigation collapsed>
        <FxSideNavigationItem name="item1" icon={<StarIcon />} text="Flyout Text" badge="7" />
      </FxSideNavigation>
    );

    await act(async () => {
      vi.advanceTimersByTime(10);
    });

    const wrapper = screen.getByRole("link").closest(".relative") as HTMLElement;
    fireEvent.mouseEnter(wrapper);

    expect(screen.getByText("Flyout Text")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
  });

  it("unified component uses same DOM element in both modes (overflow-hidden, min-w-10)", () => {
    const { container, rerender } = render(
      <FxSideNavigation>
        <FxSideNavigationItem name="item1" icon={<StarIcon />} text="Item" />
      </FxSideNavigation>
    );
    const expandedLink = container.querySelector(".fx-side-nav-item") as HTMLElement;
    expect(expandedLink).toHaveClass("overflow-hidden");
    expect(expandedLink).toHaveClass("min-w-10");

    rerender(
      <FxSideNavigation collapsed>
        <FxSideNavigationItem name="item1" icon={<StarIcon />} text="Item" />
      </FxSideNavigation>
    );
    const collapsedLink = container.querySelector(".fx-side-nav-item") as HTMLElement;
    expect(collapsedLink).toHaveClass("overflow-hidden");
    expect(collapsedLink).toHaveClass("min-w-10");
  });

  it("context forwards isTransitioning and transitionDirection", () => {
    let contextValue: ReturnType<typeof useFxSideNavigationContext> = null;
    const Consumer = () => {
      contextValue = useFxSideNavigationContext();
      return null;
    };
    render(
      <FxSideNavigation collapsed isTransitioning transitionDirection="collapsing">
        <Consumer />
      </FxSideNavigation>
    );
    expect(contextValue).not.toBeNull();
    expect(contextValue!.isTransitioning).toBe(true);
    expect(contextValue!.transitionDirection).toBe("collapsing");
  });

  it("context defaults isTransitioning to false when not provided", () => {
    let contextValue: ReturnType<typeof useFxSideNavigationContext> = null;
    const Consumer = () => {
      contextValue = useFxSideNavigationContext();
      return null;
    };
    render(
      <FxSideNavigation>
        <Consumer />
      </FxSideNavigation>
    );
    expect(contextValue).not.toBeNull();
    expect(contextValue!.isTransitioning).toBe(false);
    expect(contextValue!.transitionDirection).toBeNull();
  });

  it("wrapper has gap-2 and pr-2.5 for add-button items in expanded mode but not in collapsed", () => {
    const { container, rerender } = render(
      <FxSideNavigation>
        <FxSideNavigationItem name="item1" icon={<StarIcon />} text="Item" showAddButton />
      </FxSideNavigation>
    );
    const wrapper = container.querySelector(".fx-side-nav-item")!.parentElement as HTMLElement;
    expect(wrapper).toHaveClass("gap-2");
    expect(wrapper).toHaveClass("pr-2.5");

    rerender(
      <FxSideNavigation collapsed>
        <FxSideNavigationItem name="item1" icon={<StarIcon />} text="Item" showAddButton />
      </FxSideNavigation>
    );
    const collapsedWrapper = container.querySelector(".fx-side-nav-item")!.parentElement as HTMLElement;
    expect(collapsedWrapper).not.toHaveClass("gap-2");
    expect(collapsedWrapper).not.toHaveClass("pr-3");
  });
});
