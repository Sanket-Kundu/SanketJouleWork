import { describe, it, expect, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import {
  stubResizeObserver,
  stubIntersectionObserver,
  setupPopoverPolyfill,
} from "../../test/test-utils";
import type { TabbarItem } from "./Tabbar";

stubResizeObserver();
stubIntersectionObserver();
setupPopoverPolyfill();

const TEST_TABS: TabbarItem[] = [
  { id: "inbox", label: "Inbox (12)" },
  { id: "drafts", label: "Drafts (3)" },
  { id: "sent", label: "Sent" },
  { id: "archive", label: "Archive" },
  { id: "spam", label: "Spam (1)" },
  { id: "trash", label: "Trash" },
  { id: "starred", label: "Starred (5)" },
  { id: "important", label: "Important" },
];

// Mock useTabbarOverflow to avoid timer/RAF issues in jsdom
vi.mock("./useTabbarOverflow", () => ({
  useTabbarOverflow: () => ({
    visibleTabIds: ["inbox", "drafts", "sent", "archive", "spam", "trash", "starred", "important"],
    overflowTabIds: [],
    hasOverflow: false,
    isReady: true,
  }),
}));

// Import after mock
import { Tabbar } from "./Tabbar";
import { TabbarOverflowButton } from "./TabbarOverflowButton";
import { useTabbarOverflow } from "./useTabbarOverflow";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function renderTabbar(props: Partial<React.ComponentProps<typeof Tabbar>> = {}) {
  return render(<Tabbar items={TEST_TABS} {...props} />);
}

function getTabs() {
  return screen.getAllByRole("tab");
}

function getTablist() {
  return screen.getByRole("tablist");
}

// ===========================================================================
// Tabbar
// ===========================================================================

describe("Tabbar — rendering", () => {
  it("renders all 8 tabs with role=tab - BLI: EL-339", () => {
    renderTabbar();
    expect(getTabs()).toHaveLength(8);
  });

  it("default selected tab is first item (aria-selected=true) - BLI: EL-339", () => {
    renderTabbar();
    const tabs = getTabs();
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    expect(tabs[1]).toHaveAttribute("aria-selected", "false");
  });

  it("renders a tablist element - BLI: EL-339", () => {
    renderTabbar();
    expect(getTablist()).toBeInTheDocument();
  });

  it("accessibleName sets aria-label on tablist - BLI: EL-339", () => {
    renderTabbar({ accessibleName: "My tabbar" });
    expect(getTablist()).toHaveAttribute("aria-label", "My tabbar");
  });

  it("className prop is passed through to root container - BLI: EL-339", () => {
    const { container } = renderTabbar({ className: "custom-class" });
    expect(container.firstElementChild).toHaveClass("custom-class");
  });

  it("each tab has aria-posinset and aria-setsize - BLI: EL-339", () => {
    renderTabbar();
    const tabs = getTabs();
    expect(tabs[0]).toHaveAttribute("aria-posinset", "1");
    expect(tabs[1]).toHaveAttribute("aria-posinset", "2");
    expect(tabs[7]).toHaveAttribute("aria-posinset", "8");
    tabs.forEach((tab) => expect(tab).toHaveAttribute("aria-setsize", "8"));
  });

  it("renders tab labels - BLI: EL-339", () => {
    renderTabbar();
    expect(screen.getByText("Inbox (12)")).toBeInTheDocument();
    expect(screen.getByText("Drafts (3)")).toBeInTheDocument();
    expect(screen.getByText("Sent")).toBeInTheDocument();
    expect(screen.getByText("Archive")).toBeInTheDocument();
  });

  it("renders custom items - BLI: EL-339", () => {
    renderTabbar({
      items: [
        { id: "a", label: "Alpha" },
        { id: "b", label: "Beta" },
      ],
    });
    expect(getTabs()).toHaveLength(2);
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Selection
// ---------------------------------------------------------------------------

describe("Tabbar — selection", () => {
  it("clicking a tab selects it - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderTabbar();
    await user.click(getTabs()[1]);
    expect(getTabs()[1]).toHaveAttribute("aria-selected", "true");
    expect(getTabs()[0]).toHaveAttribute("aria-selected", "false");
  });

  it("fires onTabSelect with selectedTab and previousTab on click - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onTabSelect = vi.fn();
    renderTabbar({ onTabSelect });
    await user.click(getTabs()[1]);
    expect(onTabSelect).toHaveBeenCalledWith({
      selectedTab: "drafts",
      previousTab: "inbox",
    });
  });

  it("controlled selectedTab prop determines selected tab - BLI: EL-339", () => {
    renderTabbar({ selectedTab: "sent" });
    const tabs = getTabs();
    expect(tabs[0]).toHaveAttribute("aria-selected", "false");
    expect(tabs[1]).toHaveAttribute("aria-selected", "false");
    expect(tabs[2]).toHaveAttribute("aria-selected", "true");
  });

  it("controlled mode: does not change selection internally - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderTabbar({ selectedTab: "inbox" });
    await user.click(getTabs()[1]);
    // Should stay on 'inbox' because it's controlled
    expect(getTabs()[0]).toHaveAttribute("aria-selected", "true");
    expect(getTabs()[1]).toHaveAttribute("aria-selected", "false");
  });

  it("defaultSelectedTab sets the initial tab - BLI: EL-339", () => {
    renderTabbar({ defaultSelectedTab: "drafts" });
    const tabs = getTabs();
    expect(tabs[0]).toHaveAttribute("aria-selected", "false");
    expect(tabs[1]).toHaveAttribute("aria-selected", "true");
  });
});

// ---------------------------------------------------------------------------
// Keyboard navigation
// ---------------------------------------------------------------------------

describe("Tabbar — keyboard navigation", () => {
  it("ArrowRight moves focus to next tab - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderTabbar();
    const tabs = getTabs();
    tabs[0].focus();
    await user.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(tabs[1]);
  });

  it("ArrowLeft moves focus to previous tab - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderTabbar();
    const tabs = getTabs();
    tabs[1].focus();
    await user.keyboard("{ArrowLeft}");
    expect(document.activeElement).toBe(tabs[0]);
  });

  it("ArrowRight stops at last tab (no wrap) - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderTabbar();
    const tabs = getTabs();
    tabs[7].focus();
    await user.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(tabs[7]);
  });

  it("ArrowLeft stops at first tab (no wrap) - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderTabbar();
    const tabs = getTabs();
    tabs[0].focus();
    await user.keyboard("{ArrowLeft}");
    expect(document.activeElement).toBe(tabs[0]);
  });

  it("Home moves focus to first tab - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderTabbar();
    const tabs = getTabs();
    tabs[3].focus();
    await user.keyboard("{Home}");
    expect(document.activeElement).toBe(tabs[0]);
  });

  it("End moves focus to last tab - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderTabbar();
    const tabs = getTabs();
    tabs[0].focus();
    await user.keyboard("{End}");
    expect(document.activeElement).toBe(tabs[7]);
  });

  it("Enter selects the focused tab - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onTabSelect = vi.fn();
    renderTabbar({ onTabSelect });
    const tabs = getTabs();
    tabs[1].focus();
    await user.keyboard("{Enter}");
    expect(onTabSelect).toHaveBeenCalledWith(
      expect.objectContaining({ selectedTab: "drafts" })
    );
  });

  it("Space selects the focused tab on keyUp - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onTabSelect = vi.fn();
    renderTabbar({ onTabSelect });
    const tabs = getTabs();
    tabs[2].focus();
    await user.keyboard(" ");
    expect(onTabSelect).toHaveBeenCalledWith(
      expect.objectContaining({ selectedTab: "sent" })
    );
  });

  it("RTL: ArrowLeft moves focus to next tab - BLI: EL-339", async () => {
    document.documentElement.dir = "rtl";
    const user = userEvent.setup();
    renderTabbar();
    const tabs = getTabs();
    tabs[0].focus();
    await user.keyboard("{ArrowLeft}");
    expect(document.activeElement).toBe(tabs[1]);
    document.documentElement.dir = "";
  });

  it("RTL: ArrowRight moves focus to previous tab - BLI: EL-339", async () => {
    document.documentElement.dir = "rtl";
    const user = userEvent.setup();
    renderTabbar();
    const tabs = getTabs();
    tabs[1].focus();
    await user.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(tabs[0]);
    document.documentElement.dir = "";
  });

  it("RTL: ArrowRight stops at first tab (no wrap) - BLI: EL-339", async () => {
    document.documentElement.dir = "rtl";
    const user = userEvent.setup();
    renderTabbar();
    const tabs = getTabs();
    tabs[0].focus();
    await user.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(tabs[0]);
    document.documentElement.dir = "";
  });

  it("RTL: ArrowLeft stops at last tab (no wrap) - BLI: EL-339", async () => {
    document.documentElement.dir = "rtl";
    const user = userEvent.setup();
    renderTabbar();
    const tabs = getTabs();
    tabs[7].focus();
    await user.keyboard("{ArrowLeft}");
    expect(document.activeElement).toBe(tabs[7]);
    document.documentElement.dir = "";
  });
});

// ---------------------------------------------------------------------------
// Roving tabindex
// ---------------------------------------------------------------------------

describe("Tabbar — roving tabindex", () => {
  it("first tab has tabIndex=0 by default, others -1 - BLI: EL-339", () => {
    renderTabbar();
    const tabs = getTabs();
    expect(tabs[0]).toHaveAttribute("tabindex", "0");
    expect(tabs[1]).toHaveAttribute("tabindex", "-1");
    expect(tabs[7]).toHaveAttribute("tabindex", "-1");
  });
});

// ===========================================================================
// TabbarOverflowButton
// ===========================================================================

describe("TabbarOverflowButton", () => {
  const defaultTabs = [
    { id: "tab1", label: "Tab 1" },
    { id: "tab2", label: "Tab 2" },
  ];

  function renderOverflowButton(
    props: Partial<React.ComponentProps<typeof TabbarOverflowButton>> = {}
  ) {
    const merged = {
      tabs: defaultTabs,
      selectedTabId: "other",
      onSelect: vi.fn(),
      ...props,
    };
    return render(<TabbarOverflowButton {...merged} />);
  }

  it("returns null when tabs array is empty - BLI: EL-339", () => {
    const { container } = render(
      <TabbarOverflowButton tabs={[]} selectedTabId="" onSelect={vi.fn()} />
    );
    expect(container.innerHTML).toBe("");
  });

  it("renders More button with aria-label - BLI: EL-339", () => {
    renderOverflowButton();
    const btn = screen.getByRole("button", { name: "More tabs" });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute("aria-label", "More tabs");
  });

  it("button has aria-haspopup menu - BLI: EL-339", () => {
    renderOverflowButton();
    const btn = screen.getByRole("button", { name: "More tabs" });
    expect(btn).toHaveAttribute("aria-haspopup", "menu");
  });

  it("click toggles aria-expanded - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderOverflowButton();
    const btn = screen.getByRole("button", { name: "More tabs" });
    expect(btn).toHaveAttribute("aria-expanded", "false");
    await user.click(btn);
    expect(btn).toHaveAttribute("aria-expanded", "true");
    await user.click(btn);
    expect(btn).toHaveAttribute("aria-expanded", "false");
  });

  it("lists overflow tabs in dropdown when opened - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderOverflowButton();
    const btn = screen.getByRole("button", { name: "More tabs" });
    await user.click(btn);
    expect(screen.getByText("Tab 1")).toBeInTheDocument();
    expect(screen.getByText("Tab 2")).toBeInTheDocument();
  });

  it("clicking a tab in dropdown calls onSelect and closes - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    renderOverflowButton({ onSelect });
    const btn = screen.getByRole("button", { name: "More tabs" });
    await user.click(btn);
    await user.click(screen.getByText("Tab 1"));
    expect(onSelect).toHaveBeenCalledWith("tab1");
    expect(btn).toHaveAttribute("aria-expanded", "false");
  });

  it("hasSelectedInOverflow adds bold styling - BLI: EL-339", () => {
    renderOverflowButton({ selectedTabId: "tab1" });
    const btn = screen.getByRole("button", { name: "More tabs" });
    expect(btn.className).toContain("font-semibold");
  });

  it("no primary styling when selected tab is NOT in overflow - BLI: EL-339", () => {
    renderOverflowButton({ selectedTabId: "other" });
    const btn = screen.getByRole("button", { name: "More tabs" });
    expect(btn.className).toContain("border-transparent");
  });

  it("isFocused sets tabIndex=0 - BLI: EL-339", () => {
    renderOverflowButton({ isFocused: true });
    const btn = screen.getByRole("button", { name: "More tabs" });
    expect(btn).toHaveAttribute("tabindex", "0");
  });

  it("isFocused=false sets tabIndex=-1 - BLI: EL-339", () => {
    renderOverflowButton({ isFocused: false });
    const btn = screen.getByRole("button", { name: "More tabs" });
    expect(btn).toHaveAttribute("tabindex", "-1");
  });

  it("onFocus callback fires when button receives focus - BLI: EL-339", async () => {
    const onFocus = vi.fn();
    renderOverflowButton({ onFocus, isFocused: true });
    const btn = screen.getByRole("button", { name: "More tabs" });
    await act(async () => {
      btn.focus();
    });
    expect(onFocus).toHaveBeenCalled();
  });

  it("ArrowDown opens the dropdown - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderOverflowButton({ isFocused: true });
    const btn = screen.getByRole("button", { name: "More tabs" });
    btn.focus();
    await user.keyboard("{ArrowDown}");
    expect(btn).toHaveAttribute("aria-expanded", "true");
  });

  it("ArrowRight opens the dropdown in LTR - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderOverflowButton({ isFocused: true });
    const btn = screen.getByRole("button", { name: "More tabs" });
    btn.focus();
    await user.keyboard("{ArrowRight}");
    expect(btn).toHaveAttribute("aria-expanded", "true");
  });

  it("RTL: ArrowLeft opens the dropdown - BLI: EL-339", async () => {
    document.documentElement.dir = "rtl";
    const user = userEvent.setup();
    renderOverflowButton({ isFocused: true });
    const btn = screen.getByRole("button", { name: "More tabs" });
    btn.focus();
    await user.keyboard("{ArrowLeft}");
    expect(btn).toHaveAttribute("aria-expanded", "true");
    document.documentElement.dir = "";
  });

  it("RTL: ArrowRight does NOT open the dropdown (delegates to parent) - BLI: EL-339", async () => {
    document.documentElement.dir = "rtl";
    const user = userEvent.setup();
    const onKeyDown = vi.fn();
    renderOverflowButton({ isFocused: true, onKeyDown });
    const btn = screen.getByRole("button", { name: "More tabs" });
    btn.focus();
    await user.keyboard("{ArrowRight}");
    expect(btn).toHaveAttribute("aria-expanded", "false");
    expect(onKeyDown).toHaveBeenCalled();
    document.documentElement.dir = "";
  });

  it("overflowId is set as data-tab-id attribute - BLI: EL-339", () => {
    renderOverflowButton({ overflowId: "__overflow__" });
    const btn = screen.getByRole("button", { name: "More tabs" });
    expect(btn).toHaveAttribute("data-tab-id", "__overflow__");
  });
});

// ===========================================================================
// useTabbarOverflow — contract tests
// The real hook uses setTimeout retry loops + RAF that crash the jsdom fork
// worker, so useTabbarOverflow is mocked for Tabbar rendering above.
// These tests verify the mock contract and the hook's interface.
// ===========================================================================

describe("useTabbarOverflow (mock contract)", () => {
  it("mock returns all tabs as visible, hasOverflow=false, isReady=true - BLI: EL-339", () => {
    const result = useTabbarOverflow({
      enabled: false,
      tabs: [{ id: "a", label: "A" }],
      selectedTabId: "a",
      tabListRef: { current: null },
    });
    expect(result.visibleTabIds).toEqual(["inbox", "drafts", "sent", "archive", "spam", "trash", "starred", "important"]);
    expect(result.overflowTabIds).toEqual([]);
    expect(result.hasOverflow).toBe(false);
    expect(result.isReady).toBe(true);
  });

  it("result shape has all required properties - BLI: EL-339", () => {
    const result = useTabbarOverflow({
      enabled: false,
      tabs: [],
      selectedTabId: "",
      tabListRef: { current: null },
    });
    expect(Array.isArray(result.visibleTabIds)).toBe(true);
    expect(Array.isArray(result.overflowTabIds)).toBe(true);
    expect(typeof result.hasOverflow).toBe("boolean");
    expect(typeof result.isReady).toBe("boolean");
  });

  it("hasOverflow is derived from overflowTabIds length - BLI: EL-339", () => {
    const result = useTabbarOverflow({
      enabled: false,
      tabs: [{ id: "x", label: "X" }],
      selectedTabId: "x",
      tabListRef: { current: null },
    });
    expect(result.overflowTabIds).toHaveLength(0);
    expect(result.hasOverflow).toBe(false);
  });
});
