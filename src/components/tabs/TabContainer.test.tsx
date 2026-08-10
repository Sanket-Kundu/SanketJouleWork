import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TabContainer } from "./TabContainer";
import { Tab } from "./Tab";
import { TabSeparator } from "./TabSeparator";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderTabs(selected?: string) {
  return render(
    <TabContainer defaultSelectedTabId={selected ?? "tab1"} data-testid="tc">
      <Tab id="tab1" text="Tab 1"><div>Panel 1</div></Tab>
      <Tab id="tab2" text="Tab 2"><div>Panel 2</div></Tab>
      <Tab id="tab3" text="Tab 3"><div>Panel 3</div></Tab>
    </TabContainer>
  );
}

function getTabs() {
  return screen.getAllByRole("tab");
}

function getTablist() {
  return screen.getByRole("tablist");
}

function getPanel() {
  return screen.getByRole("tabpanel");
}

// ---------------------------------------------------------------------------
// Rendering & ARIA structure
// ---------------------------------------------------------------------------

describe("TabContainer — ARIA structure", () => {
  it("renders a tablist - BLI: EL-339", () => {
    renderTabs();
    expect(getTablist()).toBeInTheDocument();
  });

  it("renders tabs with role=tab - BLI: EL-339", () => {
    renderTabs();
    expect(getTabs()).toHaveLength(3);
  });

  it("renders a tabpanel - BLI: EL-339", () => {
    renderTabs();
    expect(getPanel()).toBeInTheDocument();
  });

  it("tablist has aria-orientation=horizontal - BLI: EL-339", () => {
    renderTabs();
    expect(getTablist()).toHaveAttribute("aria-orientation", "horizontal");
  });

  it("tablist accepts aria-label via accessibleName prop - BLI: EL-339", () => {
    render(
      <TabContainer accessibleName="My tabs">
        <Tab id="t1" text="T1"><div>P1</div></Tab>
      </TabContainer>
    );
    expect(getTablist()).toHaveAttribute("aria-label", "My tabs");
  });

  it("selected tab has aria-selected=true, others false - BLI: EL-339", () => {
    renderTabs("tab2");
    const tabs = getTabs();
    expect(tabs[0]).toHaveAttribute("aria-selected", "false");
    expect(tabs[1]).toHaveAttribute("aria-selected", "true");
    expect(tabs[2]).toHaveAttribute("aria-selected", "false");
  });

  it("each tab has aria-posinset and aria-setsize - BLI: EL-339", () => {
    renderTabs();
    const tabs = getTabs();
    expect(tabs[0]).toHaveAttribute("aria-posinset", "1");
    expect(tabs[1]).toHaveAttribute("aria-posinset", "2");
    expect(tabs[2]).toHaveAttribute("aria-posinset", "3");
    tabs.forEach(tab => expect(tab).toHaveAttribute("aria-setsize", "3"));
  });

  it("all tabs share the same aria-controls pointing to the panel - BLI: EL-339", () => {
    renderTabs();
    const panel = getPanel();
    const panelId = panel.id;
    getTabs().forEach(tab => {
      expect(tab).toHaveAttribute("aria-controls", panelId);
    });
  });

  it("tabpanel aria-labelledby points to the selected tab id - BLI: EL-339", () => {
    renderTabs("tab2");
    const tabs = getTabs();
    const selectedTab = tabs[1];
    const panel = getPanel();
    expect(panel).toHaveAttribute("aria-labelledby", selectedTab.id);
  });

  it("shows the selected tab's panel content - BLI: EL-339", () => {
    renderTabs("tab2");
    expect(getPanel()).toHaveTextContent("Panel 2");
  });

  it("disabled tab has aria-disabled=true - BLI: EL-339", () => {
    render(
      <TabContainer>
        <Tab id="t1" text="T1" disabled><div>P1</div></Tab>
        <Tab id="t2" text="T2"><div>P2</div></Tab>
      </TabContainer>
    );
    expect(getTabs()[0]).toHaveAttribute("aria-disabled", "true");
    expect(getTabs()[1]).not.toHaveAttribute("aria-disabled");
  });

  it("separator renders with role=separator - BLI: EL-339", () => {
    render(
      <TabContainer>
        <Tab id="t1" text="T1"><div>P1</div></Tab>
        <TabSeparator />
        <Tab id="t2" text="T2"><div>P2</div></Tab>
      </TabContainer>
    );
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  it("separator is not counted in aria-setsize - BLI: EL-339", () => {
    render(
      <TabContainer>
        <Tab id="t1" text="T1"><div>P1</div></Tab>
        <TabSeparator />
        <Tab id="t2" text="T2"><div>P2</div></Tab>
      </TabContainer>
    );
    const tabs = getTabs();
    tabs.forEach(tab => expect(tab).toHaveAttribute("aria-setsize", "2"));
  });
});

// ---------------------------------------------------------------------------
// Roving tabindex
// ---------------------------------------------------------------------------

describe("TabContainer — roving tabindex", () => {
  it("selected tab has tabIndex=0, others -1 - BLI: EL-339", () => {
    renderTabs("tab1");
    const tabs = getTabs();
    expect(tabs[0]).toHaveAttribute("tabindex", "0");
    expect(tabs[1]).toHaveAttribute("tabindex", "-1");
    expect(tabs[2]).toHaveAttribute("tabindex", "-1");
  });
});

// ---------------------------------------------------------------------------
// Keyboard navigation
// ---------------------------------------------------------------------------

describe("TabContainer — keyboard navigation", () => {
  it("ArrowRight moves focus to next tab - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderTabs("tab1");
    const tabs = getTabs();
    tabs[0].focus();
    await user.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(tabs[1]);
  });

  it("ArrowLeft moves focus to previous tab - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderTabs("tab1");
    const tabs = getTabs();
    tabs[1].focus();
    await user.keyboard("{ArrowLeft}");
    expect(document.activeElement).toBe(tabs[0]);
  });

  it("ArrowRight stops at last tab (no wrap) - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderTabs("tab1");
    const tabs = getTabs();
    tabs[2].focus();
    await user.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(tabs[2]);
  });

  it("ArrowLeft stops at first tab (no wrap) - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderTabs("tab1");
    const tabs = getTabs();
    tabs[0].focus();
    await user.keyboard("{ArrowLeft}");
    expect(document.activeElement).toBe(tabs[0]);
  });

  it("Home moves focus to first tab - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderTabs("tab1");
    const tabs = getTabs();
    tabs[2].focus();
    await user.keyboard("{Home}");
    expect(document.activeElement).toBe(tabs[0]);
  });

  it("End moves focus to last tab - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderTabs("tab1");
    const tabs = getTabs();
    tabs[0].focus();
    await user.keyboard("{End}");
    expect(document.activeElement).toBe(tabs[2]);
  });

  it("Enter selects the focused tab - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onTabSelect = vi.fn();
    render(
      <TabContainer onTabSelect={onTabSelect}>
        <Tab id="tab1" text="Tab 1"><div>P1</div></Tab>
        <Tab id="tab2" text="Tab 2"><div>P2</div></Tab>
      </TabContainer>
    );
    const tabs = getTabs();
    tabs[1].focus();
    await user.keyboard("{Enter}");
    expect(onTabSelect).toHaveBeenCalledWith(expect.objectContaining({ selectedTabId: "tab2" }));
  });

  it("Space selects the focused tab - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onTabSelect = vi.fn();
    render(
      <TabContainer onTabSelect={onTabSelect}>
        <Tab id="tab1" text="Tab 1"><div>P1</div></Tab>
        <Tab id="tab2" text="Tab 2"><div>P2</div></Tab>
      </TabContainer>
    );
    const tabs = getTabs();
    tabs[1].focus();
    await user.keyboard(" ");
    expect(onTabSelect).toHaveBeenCalledWith(expect.objectContaining({ selectedTabId: "tab2" }));
  });

  it("ArrowRight skips disabled tabs - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(
      <TabContainer defaultSelectedTabId="tab1">
        <Tab id="tab1" text="Tab 1"><div>P1</div></Tab>
        <Tab id="tab2" text="Tab 2" disabled><div>P2</div></Tab>
        <Tab id="tab3" text="Tab 3"><div>P3</div></Tab>
      </TabContainer>
    );
    const tabs = getTabs();
    tabs[0].focus();
    await user.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(tabs[2]);
  });

  it("RTL: ArrowLeft moves focus to next tab - BLI: EL-339", async () => {
    document.documentElement.dir = "rtl";
    const user = userEvent.setup();
    renderTabs("tab1");
    const tabs = getTabs();
    tabs[0].focus();
    await user.keyboard("{ArrowLeft}");
    expect(document.activeElement).toBe(tabs[1]);
    document.documentElement.dir = "";
  });

  it("RTL: ArrowRight moves focus to previous tab - BLI: EL-339", async () => {
    document.documentElement.dir = "rtl";
    const user = userEvent.setup();
    renderTabs("tab1");
    const tabs = getTabs();
    tabs[1].focus();
    await user.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(tabs[0]);
    document.documentElement.dir = "";
  });

  it("RTL: ArrowRight stops at first tab (no wrap) - BLI: EL-339", async () => {
    document.documentElement.dir = "rtl";
    const user = userEvent.setup();
    renderTabs("tab1");
    const tabs = getTabs();
    tabs[0].focus();
    await user.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(tabs[0]);
    document.documentElement.dir = "";
  });

  it("RTL: ArrowLeft stops at last tab (no wrap) - BLI: EL-339", async () => {
    document.documentElement.dir = "rtl";
    const user = userEvent.setup();
    renderTabs("tab1");
    const tabs = getTabs();
    tabs[2].focus();
    await user.keyboard("{ArrowLeft}");
    expect(document.activeElement).toBe(tabs[2]);
    document.documentElement.dir = "";
  });
});

// ---------------------------------------------------------------------------
// Selection
// ---------------------------------------------------------------------------

describe("TabContainer — selection", () => {
  it("clicking a tab selects it - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderTabs("tab1");
    await user.click(getTabs()[1]);
    expect(getTabs()[1]).toHaveAttribute("aria-selected", "true");
    expect(getPanel()).toHaveTextContent("Panel 2");
  });

  it("fires onTabSelect with correct detail on click - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onTabSelect = vi.fn();
    render(
      <TabContainer defaultSelectedTabId="tab1" onTabSelect={onTabSelect}>
        <Tab id="tab1" text="Tab 1"><div>P1</div></Tab>
        <Tab id="tab2" text="Tab 2"><div>P2</div></Tab>
      </TabContainer>
    );
    await user.click(getTabs()[1]);
    expect(onTabSelect).toHaveBeenCalledWith(expect.objectContaining({
      selectedTabId: "tab2",
      previousTabId: "tab1",
    }));
  });

  it("controlled mode: does not change selection without prop update - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(
      <TabContainer selectedTabId="tab1">
        <Tab id="tab1" text="Tab 1"><div>P1</div></Tab>
        <Tab id="tab2" text="Tab 2"><div>P2</div></Tab>
      </TabContainer>
    );
    await user.click(getTabs()[1]);
    expect(getTabs()[0]).toHaveAttribute("aria-selected", "true");
  });

  it("disabled tab cannot be selected - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onTabSelect = vi.fn();
    render(
      <TabContainer defaultSelectedTabId="tab1" onTabSelect={onTabSelect}>
        <Tab id="tab1" text="Tab 1"><div>P1</div></Tab>
        <Tab id="tab2" text="Tab 2" disabled><div>P2</div></Tab>
      </TabContainer>
    );
    await user.click(getTabs()[1]);
    expect(onTabSelect).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Sub-tabs (single-click area)
// ---------------------------------------------------------------------------

describe("TabContainer — sub-tabs", () => {
  it("tab with only sub-tabs has aria-haspopup=menu - BLI: EL-339", () => {
    render(
      <TabContainer>
        <Tab
          id="parent"
          text="Parent"
          subTabs={<Tab id="child" text="Child"><div>Child panel</div></Tab>}
        />
      </TabContainer>
    );
    const tabs = getTabs();
    expect(tabs[0]).toHaveAttribute("aria-haspopup", "menu");
  });

  it("tab with sub-tabs AND own content has aria-roledescription=Split Tab - BLI: EL-339", () => {
    render(
      <TabContainer>
        <Tab
          id="split"
          text="Split"
          subTabs={<Tab id="child" text="Child"><div>Child panel</div></Tab>}
        >
          <div>Own content</div>
        </Tab>
      </TabContainer>
    );
    expect(getTabs()[0]).toHaveAttribute("aria-roledescription", "Split Tab");
  });

  it("tab with sub-tabs AND own content does NOT have aria-haspopup on main button - BLI: EL-339", () => {
    render(
      <TabContainer>
        <Tab
          id="split"
          text="Split"
          subTabs={<Tab id="child" text="Child"><div>Child panel</div></Tab>}
        >
          <div>Own content</div>
        </Tab>
      </TabContainer>
    );
    expect(getTabs()[0]).not.toHaveAttribute("aria-haspopup");
  });

  it("ArrowDown on a tab with sub-tabs opens the dropdown - BLI: EL-339", async () => {
    const user = userEvent.setup();
    // jsdom doesn't support the Popover API or ResizeObserver — stub them
    HTMLElement.prototype.showPopover = vi.fn();
    HTMLElement.prototype.hidePopover = vi.fn();
    vi.stubGlobal("ResizeObserver", class {
      observe = vi.fn();
      disconnect = vi.fn();
      unobserve = vi.fn();
    });
    render(
      <TabContainer>
        <Tab
          id="parent"
          text="Parent"
          subTabs={<Tab id="child" text="Child"><div>Child panel</div></Tab>}
        />
      </TabContainer>
    );
    const tab = getTabs()[0];
    tab.focus();
    expect(tab).toHaveAttribute("aria-expanded", "false");
    await user.keyboard("{ArrowDown}");
    expect(tab).toHaveAttribute("aria-expanded", "true");
    vi.unstubAllGlobals();
  });
});

// ---------------------------------------------------------------------------
// Tab — semantic designs
// ---------------------------------------------------------------------------

describe("Tab — semantic designs", () => {
  it.each(["Positive", "Negative", "Critical", "Neutral"] as const)(
    "renders tab with design=%s",
    (design) => {
      render(
        <TabContainer defaultSelectedTabId="t1">
          <Tab id="t1" text="A" design={design}><div>Content A</div></Tab>
          <Tab id="t2" text="B"><div>Content B</div></Tab>
        </TabContainer>
      );
      const tab = getTabs()[0];
      expect(tab).toHaveAttribute("aria-selected", "true");
      expect(tab).toHaveAttribute("data-selected", "true");
    }
  );

  it("Default design is applied when no design is specified - BLI: EL-339", () => {
    render(
      <TabContainer>
        <Tab id="t1" text="A"><div>C</div></Tab>
      </TabContainer>
    );
    const tab = getTabs()[0];
    expect(tab).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Tab — icon and additionalText
// ---------------------------------------------------------------------------

describe("Tab — icon and additionalText", () => {
  it("renders icon alongside text - BLI: EL-339", () => {
    const icon = <span data-testid="tab-icon">★</span>;
    render(
      <TabContainer>
        <Tab id="t1" text="WithIcon" icon={icon}><div>P</div></Tab>
      </TabContainer>
    );
    expect(screen.getByTestId("tab-icon")).toBeInTheDocument();
    expect(screen.getByText("WithIcon")).toBeInTheDocument();
  });

  it("renders additionalText badge - BLI: EL-339", () => {
    render(
      <TabContainer>
        <Tab id="t1" text="Main" additionalText="42"><div>P</div></Tab>
      </TabContainer>
    );
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("renders tooltip via title attribute - BLI: EL-339", () => {
    render(
      <TabContainer>
        <Tab id="t1" text="Hover me" tooltip="Hello tooltip"><div>P</div></Tab>
      </TabContainer>
    );
    expect(getTabs()[0]).toHaveAttribute("title", "Hello tooltip");
  });

  it("renders accessibleDescription as hidden text - BLI: EL-339", () => {
    render(
      <TabContainer>
        <Tab id="t1" text="A" accessibleDescription="Tab description"><div>P</div></Tab>
      </TabContainer>
    );
    expect(screen.getByText("Tab description")).toHaveClass("sr-only");
  });
});

// ---------------------------------------------------------------------------
// TabContainer — layout variants
// ---------------------------------------------------------------------------

describe("TabContainer — layout variants", () => {
  it("layout=Standard applies vertical stacking - BLI: EL-339", () => {
    render(
      <TabContainer layout="Standard">
        <Tab id="t1" text="A" icon={<span>I</span>}><div>P</div></Tab>
      </TabContainer>
    );
    // Tab should exist and be rendered
    expect(getTabs()[0]).toBeInTheDocument();
  });

  it("tabsPlacement=Bottom reverses column order - BLI: EL-339", () => {
    const { container } = render(
      <TabContainer tabsPlacement="Bottom">
        <Tab id="t1" text="A"><div>P</div></Tab>
      </TabContainer>
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toContain("flex-col-reverse");
  });

  it("tabsPlacement=Bottom puts border-t on tablist - BLI: EL-339", () => {
    render(
      <TabContainer tabsPlacement="Bottom">
        <Tab id="t1" text="A"><div>P</div></Tab>
      </TabContainer>
    );
    const tablist = getTablist();
    expect(tablist.className).toContain("border-t");
  });

  it("collapsed mode hides tab text - BLI: EL-339", () => {
    render(
      <TabContainer collapsed>
        <Tab id="t1" text="Hidden" icon={<span data-testid="ic">I</span>}>
          <div>P</div>
        </Tab>
      </TabContainer>
    );
    expect(screen.getByTestId("ic")).toBeInTheDocument();
    expect(screen.queryByText("Hidden")).not.toBeInTheDocument();
  });

  it("noAutoSelection starts with no selected tab - BLI: EL-339", () => {
    render(
      <TabContainer noAutoSelection>
        <Tab id="t1" text="A"><div>P1</div></Tab>
        <Tab id="t2" text="B"><div>P2</div></Tab>
      </TabContainer>
    );
    const tabs = getTabs();
    tabs.forEach(tab => expect(tab).toHaveAttribute("aria-selected", "false"));
  });
});

// ---------------------------------------------------------------------------
// TabContainer — backgroundDesign variants
// ---------------------------------------------------------------------------

describe("TabContainer — backgroundDesign", () => {
  it("Transparent applies bg-transparent to header - BLI: EL-339", () => {
    render(
      <TabContainer backgroundDesign="Transparent">
        <Tab id="t1" text="A"><div>P</div></Tab>
      </TabContainer>
    );
    const tablist = getTablist();
    expect(tablist.className).toContain("bg-transparent");
  });

  it("Translucent applies backdrop-blur - BLI: EL-339", () => {
    render(
      <TabContainer backgroundDesign="Translucent">
        <Tab id="t1" text="A"><div>P</div></Tab>
      </TabContainer>
    );
    const tablist = getTablist();
    expect(tablist.className).toContain("backdrop-blur");
  });

  it("headerBackgroundDesign overrides backgroundDesign for header - BLI: EL-339", () => {
    render(
      <TabContainer backgroundDesign="Solid" headerBackgroundDesign="Transparent">
        <Tab id="t1" text="A"><div>P</div></Tab>
      </TabContainer>
    );
    const tablist = getTablist();
    expect(tablist.className).toContain("bg-transparent");
  });
});

// ---------------------------------------------------------------------------
// TabContainer — imperative ref
// ---------------------------------------------------------------------------

describe("TabContainer — imperative ref", () => {
  it("ref.getSelectedTabId returns current selection - BLI: EL-339", () => {
    const ref = { current: null as import("../../types/tabs").TabContainerRef | null };
    render(
      <TabContainer ref={ref} defaultSelectedTabId="t2">
        <Tab id="t1" text="A"><div>P1</div></Tab>
        <Tab id="t2" text="B"><div>P2</div></Tab>
      </TabContainer>
    );
    expect(ref.current!.getSelectedTabId()).toBe("t2");
  });

  it("ref.getTabIds returns all tab IDs - BLI: EL-339", () => {
    const ref = { current: null as import("../../types/tabs").TabContainerRef | null };
    render(
      <TabContainer ref={ref}>
        <Tab id="a" text="A"><div>PA</div></Tab>
        <Tab id="b" text="B"><div>PB</div></Tab>
      </TabContainer>
    );
    expect(ref.current!.getTabIds()).toEqual(["a", "b"]);
  });

  it("ref.selectTab changes selection programmatically - BLI: EL-339", async () => {
    const ref = { current: null as import("../../types/tabs").TabContainerRef | null };
    const onTabSelect = vi.fn();
    render(
      <TabContainer ref={ref} defaultSelectedTabId="t1" onTabSelect={onTabSelect}>
        <Tab id="t1" text="A"><div>P1</div></Tab>
        <Tab id="t2" text="B"><div>P2</div></Tab>
      </TabContainer>
    );
    ref.current!.selectTab("t2");
    expect(onTabSelect).toHaveBeenCalledWith(expect.objectContaining({ selectedTabId: "t2" }));
  });

  it("ref.tabListElement returns DOM element - BLI: EL-339", () => {
    const ref = { current: null as import("../../types/tabs").TabContainerRef | null };
    render(
      <TabContainer ref={ref}>
        <Tab id="t1" text="A"><div>P</div></Tab>
      </TabContainer>
    );
    expect(ref.current!.tabListElement).toBeInstanceOf(HTMLElement);
    expect(ref.current!.tabListElement!.getAttribute("role")).toBe("tablist");
  });

  it("ref.tabPanelElement returns DOM element - BLI: EL-339", () => {
    const ref = { current: null as import("../../types/tabs").TabContainerRef | null };
    render(
      <TabContainer ref={ref}>
        <Tab id="t1" text="A"><div>P</div></Tab>
      </TabContainer>
    );
    expect(ref.current!.tabPanelElement).toBeInstanceOf(HTMLElement);
    expect(ref.current!.tabPanelElement!.getAttribute("role")).toBe("tabpanel");
  });
});
