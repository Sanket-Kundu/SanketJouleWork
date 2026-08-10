import React, { useState } from "react";
import {
  TabContainer,
  Tab,
  TabSeparator,
  TabSemanticDesign,
  TabContainerBackgroundDesign,
  TabLayout,
  TabMoveDetail,
  TabOverflowMode,
} from "@sap-ui/fx-components";
import { Home, Settings, User, Bell, FileText, MessageCircle, Heart, Star, GripVertical, Mail, Calendar, Folder, Archive, Trash, Send, Inbox, Clock, Tag, Bookmark, Plus } from "lucide-react";
import { CodeBlock } from "./components/CodeBlock";

// Define nested tab structure for drag-drop demo
interface NestedTab {
  id: string;
  text: string;
  icon?: React.ReactNode;
  children?: NestedTab[];
}

export function TabContainerPage() {
  const [controlledTabId, setControlledTabId] = useState("info");
  const [callbackLog, setCallbackLog] = useState<string[]>([]);

  // State for drag and drop demo
  const [draggableTabs, setDraggableTabs] = useState([
    { id: "tab-1", text: "Dashboard", icon: <Home className="h-4 w-4" /> },
    { id: "tab-2", text: "Analytics", icon: <FileText className="h-4 w-4" /> },
    { id: "tab-3", text: "Users", icon: <User className="h-4 w-4" /> },
    { id: "tab-4", text: "Settings", icon: <Settings className="h-4 w-4" /> },
  ]);

  // State for nested drag and drop demo
  const [nestedDraggableTabs, setNestedDraggableTabs] = useState<NestedTab[]>([
    { id: "nest-1", text: "Projects", icon: <Folder className="h-4 w-4" />, children: [] },
    { id: "nest-2", text: "Documents", icon: <FileText className="h-4 w-4" />, children: [] },
    { id: "nest-3", text: "Emails", icon: <Mail className="h-4 w-4" />, children: [] },
    { id: "nest-4", text: "Calendar", icon: <Calendar className="h-4 w-4" />, children: [] },
    { id: "nest-5", text: "Settings", icon: <Settings className="h-4 w-4" />, children: [] },
  ]);

  const addLog = (message: string) => {
    setCallbackLog((prev) => [...prev.slice(-9), message]);
  };

  // Handle tab reordering
  const handleTabMove = (detail: TabMoveDetail) => {
    const { sourceIndex, destinationIndex, placement } = detail;

    setDraggableTabs((prevTabs) => {
      const newTabs = [...prevTabs];
      const [movedTab] = newTabs.splice(sourceIndex, 1);

      // Calculate the actual insertion index
      let insertIndex = destinationIndex;
      if (sourceIndex < destinationIndex) {
        insertIndex = destinationIndex - 1;
      }
      if (placement === "after") {
        insertIndex += 1;
      }

      newTabs.splice(insertIndex, 0, movedTab);
      return newTabs;
    });

    addLog(`Moved tab from index ${sourceIndex} to ${destinationIndex} (${placement})`);
  };

  // Handle nested tab drag-drop (supports nesting via "on" placement)
  const handleNestedTabMove = (detail: TabMoveDetail) => {
    const { sourceTabId, destinationTabId, placement, sourceIndex } = detail;

    addLog(`Nested move: ${sourceTabId} -> ${destinationTabId} (${placement}, srcIdx: ${sourceIndex})`);

    setNestedDraggableTabs((prevTabs) => {
      // Helper to find and remove a tab from the tree (searches recursively)
      const removeTab = (tabs: NestedTab[], tabId: string): { tabs: NestedTab[]; removed: NestedTab | null } => {
        for (let i = 0; i < tabs.length; i++) {
          if (tabs[i].id === tabId) {
            const removed = tabs[i];
            return { tabs: [...tabs.slice(0, i), ...tabs.slice(i + 1)], removed };
          }
          if (tabs[i].children && tabs[i].children!.length > 0) {
            const result = removeTab(tabs[i].children!, tabId);
            if (result.removed) {
              return {
                tabs: [
                  ...tabs.slice(0, i),
                  { ...tabs[i], children: result.tabs },
                  ...tabs.slice(i + 1),
                ],
                removed: result.removed,
              };
            }
          }
        }
        return { tabs, removed: null };
      };

      // Helper to insert a tab at a destination (searches recursively)
      const insertTab = (
        tabs: NestedTab[],
        tab: NestedTab,
        destId: string,
        placement: "before" | "after" | "on"
      ): { tabs: NestedTab[]; inserted: boolean } => {
        for (let i = 0; i < tabs.length; i++) {
          if (tabs[i].id === destId) {
            if (placement === "on") {
              // Nest inside destination tab
              const newChildren = [...(tabs[i].children || []), tab];
              return {
                tabs: [
                  ...tabs.slice(0, i),
                  { ...tabs[i], children: newChildren },
                  ...tabs.slice(i + 1),
                ],
                inserted: true,
              };
            } else if (placement === "before") {
              return {
                tabs: [...tabs.slice(0, i), tab, ...tabs.slice(i)],
                inserted: true,
              };
            } else {
              // after
              return {
                tabs: [...tabs.slice(0, i + 1), tab, ...tabs.slice(i + 1)],
                inserted: true,
              };
            }
          }
          if (tabs[i].children && tabs[i].children!.length > 0) {
            const result = insertTab(tabs[i].children!, tab, destId, placement);
            if (result.inserted) {
              return {
                tabs: [
                  ...tabs.slice(0, i),
                  { ...tabs[i], children: result.tabs },
                  ...tabs.slice(i + 1),
                ],
                inserted: true,
              };
            }
          }
        }
        return { tabs, inserted: false };
      };

      // First remove the source tab from wherever it is
      const { tabs: tabsAfterRemove, removed } = removeTab(prevTabs, sourceTabId);
      if (!removed) return prevTabs;

      // Clear children when moving (flatten)
      const tabToMove = { ...removed, children: [] };

      // Then insert at destination
      const { tabs: finalTabs } = insertTab(tabsAfterRemove, tabToMove, destinationTabId, placement);
      return finalTabs;
    });
  };

  // Render nested tabs recursively
  const renderNestedTabs = (tabs: NestedTab[], level: number = 0): React.ReactNode => {
    return tabs.map((tab) => (
      <Tab
        key={tab.id}
        id={tab.id}
        text={tab.text}
        icon={tab.icon}
        subTabs={tab.children && tab.children.length > 0 ? renderNestedTabs(tab.children, level + 1) : undefined}
      >
        <div className="space-y-2">
          <h3 className="text-lg font-medium">{tab.text}</h3>
          <p>Content for {tab.text}. Nesting level: {level}</p>
          {tab.children && tab.children.length > 0 && (
            <p className="text-sm text-secondary-foreground">
              Has {tab.children.length} nested tab(s): {tab.children.map(c => c.text).join(", ")}
            </p>
          )}
        </div>
      </Tab>
    ));
  };

  // Get flat list of all tab IDs (for display)
  const getFlatTabList = (tabs: NestedTab[], indent: string = ""): string[] => {
    const result: string[] = [];
    for (const tab of tabs) {
      result.push(`${indent}${tab.text}`);
      if (tab.children && tab.children.length > 0) {
        result.push(...getFlatTabList(tab.children, indent + "  └─ "));
      }
    }
    return result;
  };

  return (
    <div className="space-y-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">TabContainer</h1>
        <code className="text-sm text-primary/70 font-mono">{'import { TabContainer, Tab } from "@sap-ui/fx-components"'}</code>
      </header>

      {/* Basic Tabs */}
      <section id="basic-tabs" className="space-y-4">
        <h2 className="text-xl font-semibold">Basic Tabs</h2>
        <p className="text-sm text-secondary-foreground">
          Simple tabs with text labels. First tab is selected by default.
        </p>

        <div className="border rounded-lg overflow-hidden">
          <TabContainer>
            <Tab id="home" text="Home">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Welcome Home</h3>
                <p>This is the home panel content. It appears when the Home tab is selected.</p>
              </div>
            </Tab>
            <Tab id="profile" text="Profile">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Your Profile</h3>
                <p>Manage your profile settings and personal information here.</p>
              </div>
            </Tab>
            <Tab id="settings" text="Settings">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Application Settings</h3>
                <p>Configure your application preferences and options.</p>
              </div>
            </Tab>
          </TabContainer>
        </div>
      </section>

      {/* Interactive Content */}
      <section id="interactive-panel-content" className="space-y-4">
        <h2 className="text-xl font-semibold">Interactive Panel Content</h2>
        <p className="text-sm text-secondary-foreground">
          When panel content has focusable elements, the panel itself should not be a tab stop — focus should move directly into the content.
        </p>

        <div className="border rounded-lg overflow-hidden">
          <TabContainer>
            <Tab id="interactive-actions" text="Actions">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Action Panel</h3>
                <p className="text-sm text-secondary-foreground">Tab past the tab strip — focus should land on the first button below, not on the panel itself.</p>
                <div className="flex gap-2">
                  <button className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90">
                    Save
                  </button>
                  <button className="px-4 py-2 text-sm border rounded hover:bg-muted">
                    Cancel
                  </button>
                  <button className="px-4 py-2 text-sm border rounded text-destructive hover:bg-destructive/10">
                    Delete
                  </button>
                </div>
              </div>
            </Tab>
            <Tab id="interactive-form" text="Form">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Form Panel</h3>
                <div className="space-y-3 max-w-sm">
                  <div className="space-y-1">
                    <label className="text-sm font-medium" htmlFor="tab-name-input">Name</label>
                    <input
                      id="tab-name-input"
                      type="text"
                      placeholder="Enter name..."
                      className="w-full px-3 py-2 text-sm border rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium" htmlFor="tab-email-input">Email</label>
                    <input
                      id="tab-email-input"
                      type="email"
                      placeholder="Enter email..."
                      className="w-full px-3 py-2 text-sm border rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <button className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90">
                    Submit
                  </button>
                </div>
              </div>
            </Tab>
            <Tab id="interactive-empty" text="No Interactions">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Plain Content</h3>
                <p>This panel has no interactive elements — verify that tabbing past the tab strip behaves correctly here too.</p>
              </div>
            </Tab>
          </TabContainer>
        </div>
      </section>

      {/* Tabs with Icons */}
      <section id="tabs-with-icons" className="space-y-4">
        <h2 className="text-xl font-semibold">Tabs with Icons</h2>
        <p className="text-sm text-secondary-foreground">
          Tabs can include icons alongside text for better visual recognition.
        </p>

        <div className="border rounded-lg overflow-hidden">
          <TabContainer>
            <Tab id="home-icon" text="Home" icon={<Home className="h-4 w-4" />}>
              <p>Home content with icon in the tab.</p>
            </Tab>
            <Tab id="profile-icon" text="Profile" icon={<User className="h-4 w-4" />}>
              <p>Profile content with icon in the tab.</p>
            </Tab>
            <Tab id="notifications" text="Notifications" icon={<Bell className="h-4 w-4" />}>
              <p>Notifications content with icon in the tab.</p>
            </Tab>
            <Tab id="settings-icon" text="Settings" icon={<Settings className="h-4 w-4" />}>
              <p>Settings content with icon in the tab.</p>
            </Tab>
          </TabContainer>
        </div>
      </section>

      {/* Tabs with Additional Text (Badges) */}
      <section id="tabs-with-badges" className="space-y-4">
        <h2 className="text-xl font-semibold">Tabs with Badges</h2>
        <p className="text-sm text-secondary-foreground">
          Use additionalText to show counts or badges on tabs.
        </p>

        <div className="border rounded-lg overflow-hidden">
          <TabContainer>
            <Tab id="inbox" text="Inbox" icon={<MessageCircle className="h-4 w-4" />} additionalText="24">
              <p>You have 24 unread messages in your inbox.</p>
            </Tab>
            <Tab id="favorites" text="Favorites" icon={<Heart className="h-4 w-4" />} additionalText="12">
              <p>Your favorite items are listed here.</p>
            </Tab>
            <Tab id="reviews" text="Reviews" icon={<Star className="h-4 w-4" />} additionalText="5">
              <p>Pending reviews await your attention.</p>
            </Tab>
          </TabContainer>
        </div>
      </section>

      {/* Semantic Designs */}
      <section id="semantic-color-designs" className="space-y-4">
        <h2 className="text-xl font-semibold">Semantic Color Designs</h2>
        <p className="text-sm text-secondary-foreground">
          Tabs support semantic colors to convey meaning (status, warnings, errors).
        </p>

        <div className="border rounded-lg overflow-hidden">
          <TabContainer>
            <Tab
              id="info"
              text="Information"
              icon={<FileText className="h-4 w-4" />}
              design={TabSemanticDesign.Default}
            >
              <p>Default design for neutral information.</p>
            </Tab>
            <Tab
              id="success"
              text="Completed"
              icon={<FileText className="h-4 w-4" />}
              design={TabSemanticDesign.Positive}
              additionalText="42"
            >
              <p>Positive design for success states.</p>
            </Tab>
            <Tab
              id="errors"
              text="Errors"
              icon={<FileText className="h-4 w-4" />}
              design={TabSemanticDesign.Negative}
              additionalText="3"
            >
              <p>Negative design for error states.</p>
            </Tab>
            <Tab
              id="warnings"
              text="Warnings"
              icon={<FileText className="h-4 w-4" />}
              design={TabSemanticDesign.Critical}
              additionalText="12"
            >
              <p>Critical design for warning states.</p>
            </Tab>
            <Tab
              id="neutral"
              text="Archive"
              icon={<FileText className="h-4 w-4" />}
              design={TabSemanticDesign.Neutral}
            >
              <p>Neutral design for less prominent items.</p>
            </Tab>
          </TabContainer>
        </div>
      </section>

      {/* Tabs with Separators */}
      <section id="tabs-with-separators" className="space-y-4">
        <h2 className="text-xl font-semibold">Tabs with Separators</h2>
        <p className="text-sm text-secondary-foreground">
          Use TabSeparator to visually group related tabs.
        </p>

        <div className="border rounded-lg overflow-hidden">
          <TabContainer>
            <Tab id="dashboard" text="Dashboard" icon={<Home className="h-4 w-4" />}>
              <p>Dashboard overview content.</p>
            </Tab>
            <Tab id="analytics" text="Analytics" icon={<FileText className="h-4 w-4" />}>
              <p>Analytics and reports content.</p>
            </Tab>
            <TabSeparator />
            <Tab id="users" text="Users" icon={<User className="h-4 w-4" />}>
              <p>User management content.</p>
            </Tab>
            <Tab id="config" text="Config" icon={<Settings className="h-4 w-4" />}>
              <p>Configuration settings content.</p>
            </Tab>
          </TabContainer>
        </div>
      </section>

      {/* Disabled Tabs */}
      <section id="disabled-tabs" className="space-y-4">
        <h2 className="text-xl font-semibold">Disabled Tabs</h2>
        <p className="text-sm text-secondary-foreground">
          Individual tabs can be disabled to prevent selection.
        </p>

        <div className="border rounded-lg overflow-hidden">
          <TabContainer>
            <Tab id="active-1" text="Active Tab">
              <p>This tab is active and selectable.</p>
            </Tab>
            <Tab id="disabled-1" text="Disabled Tab" disabled>
              <p>This content is not accessible.</p>
            </Tab>
            <Tab id="active-2" text="Another Active">
              <p>This tab is also active.</p>
            </Tab>
          </TabContainer>
        </div>
      </section>

      {/* Drag and Drop Tabs */}
      <section id="drag-and-drop-reordering" className="space-y-4">
        <h2 className="text-xl font-semibold">Drag and Drop Reordering</h2>
        <p className="text-sm text-secondary-foreground">
          Enable drag and drop to allow users to reorder tabs by dragging them.
        </p>

        <div className="border rounded-lg overflow-hidden">
          <TabContainer enableDragDrop onTabMove={handleTabMove}>
            {draggableTabs.map((tab) => (
              <Tab key={tab.id} id={tab.id} text={tab.text} icon={tab.icon}>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">{tab.text}</h3>
                  <p>Drag tabs to reorder them. The new order will be persisted.</p>
                  <p className="text-sm text-secondary-foreground">Tab ID: {tab.id}</p>
                </div>
              </Tab>
            ))}
          </TabContainer>
        </div>

        <div className="text-sm text-secondary-foreground">
          <p>Current order: {draggableTabs.map(t => t.text).join(" → ")}</p>
        </div>
      </section>

      {/* Nested Drag and Drop */}
      <section id="nested-drag-and-drop" className="space-y-4">
        <h2 className="text-xl font-semibold">Nested Drag and Drop</h2>
        <p className="text-sm text-secondary-foreground">
          Drag tabs onto other tabs to nest them. Drop on left/right edge to reorder, drop on center to nest.
          Use maxNestingLevel to limit how deep nesting can go (set to 2 in this example).
        </p>

        <div className="border rounded-lg overflow-hidden">
          <TabContainer
            enableDragDrop
            maxNestingLevel={2}
            onTabMove={handleNestedTabMove}
          >
            {renderNestedTabs(nestedDraggableTabs)}
          </TabContainer>
        </div>

        <div className="text-sm text-secondary-foreground space-y-1">
          <p className="font-medium">Current structure:</p>
          <pre className="bg-muted/30 p-3 rounded-md text-xs font-mono whitespace-pre">
            {getFlatTabList(nestedDraggableTabs).join("\n")}
          </pre>
        </div>
      </section>

      {/* Controlled Tabs */}
      <section id="controlled-tabs" className="space-y-4">
        <h2 className="text-xl font-semibold">Controlled Tabs</h2>
        <p className="text-sm text-secondary-foreground">
          Tab selection can be controlled externally via props.
        </p>

        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setControlledTabId("info")}
            className="px-3 py-1 text-sm border rounded hover:bg-muted"
          >
            Select Info
          </button>
          <button
            onClick={() => setControlledTabId("success")}
            className="px-3 py-1 text-sm border rounded hover:bg-muted"
          >
            Select Success
          </button>
          <button
            onClick={() => setControlledTabId("errors")}
            className="px-3 py-1 text-sm border rounded hover:bg-muted"
          >
            Select Errors
          </button>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <TabContainer
            selectedTabId={controlledTabId}
            onTabSelect={(detail) => {
              setControlledTabId(detail.selectedTabId);
              addLog(`Selected: ${detail.selectedTabId}, Previous: ${detail.previousTabId}`);
            }}
          >
            <Tab id="info" text="Information" design={TabSemanticDesign.Default}>
              <p>Information tab content.</p>
            </Tab>
            <Tab id="success" text="Success" design={TabSemanticDesign.Positive}>
              <p>Success tab content.</p>
            </Tab>
            <Tab id="errors" text="Errors" design={TabSemanticDesign.Negative}>
              <p>Errors tab content.</p>
            </Tab>
          </TabContainer>
        </div>

        <div className="text-sm text-secondary-foreground">
          Currently selected: <code className="bg-muted px-1 rounded">{controlledTabId}</code>
        </div>
      </section>

      {/* Background Designs */}
      <section id="background-designs" className="space-y-4">
        <h2 className="text-xl font-semibold">Background Designs</h2>
        <p className="text-sm text-secondary-foreground">
          TabContainer supports different background designs.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-lg overflow-hidden">
            <p className="p-2 text-xs font-medium bg-muted/50">Solid (default)</p>
            <TabContainer backgroundDesign={TabContainerBackgroundDesign.Solid}>
              <Tab id="solid-1" text="Tab 1">
                <p>Solid background content.</p>
              </Tab>
              <Tab id="solid-2" text="Tab 2">
                <p>Second tab content.</p>
              </Tab>
            </TabContainer>
          </div>

          <div className="border rounded-lg overflow-hidden bg-gradient-to-r from-blue-500/20 to-purple-500/20">
            <p className="p-2 text-xs font-medium bg-muted/50">Transparent</p>
            <TabContainer backgroundDesign={TabContainerBackgroundDesign.Transparent}>
              <Tab id="transparent-1" text="Tab 1">
                <p>Transparent background content.</p>
              </Tab>
              <Tab id="transparent-2" text="Tab 2">
                <p>Second tab content.</p>
              </Tab>
            </TabContainer>
          </div>

          <div className="border rounded-lg overflow-hidden bg-gradient-to-r from-green-500/20 to-teal-500/20">
            <p className="p-2 text-xs font-medium bg-muted/50">Translucent</p>
            <TabContainer backgroundDesign={TabContainerBackgroundDesign.Translucent}>
              <Tab id="translucent-1" text="Tab 1">
                <p>Translucent background with blur.</p>
              </Tab>
              <Tab id="translucent-2" text="Tab 2">
                <p>Second tab content.</p>
              </Tab>
            </TabContainer>
          </div>
        </div>
      </section>

      {/* Nested Tabs */}
      <section id="nested-tabs-sub-tabs" className="space-y-4">
        <h2 className="text-xl font-semibold">Nested Tabs (Sub-Tabs)</h2>
        <p className="text-sm text-secondary-foreground">
          Tabs can contain nested sub-tabs accessible via a dropdown. There are two modes:
        </p>
        <ul className="text-sm text-secondary-foreground list-disc pl-6 space-y-1">
          <li><strong>Two-click area:</strong> Tab has both content AND sub-tabs. Click tab to view content, click arrow to see sub-tabs.</li>
          <li><strong>Single-click area:</strong> Tab has only sub-tabs, no own content. Click anywhere to open dropdown.</li>
        </ul>

        <div className="border rounded-lg overflow-hidden">
          <TabContainer
            onTabSelect={(detail) => {
              addLog(`Selected nested tab: ${detail.selectedTabId}`);
            }}
          >
            {/* Regular tab with no sub-tabs */}
            <Tab id="overview" text="Overview" icon={<Home className="h-4 w-4" />}>
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Overview</h3>
                <p>This is a regular tab with no sub-tabs.</p>
              </div>
            </Tab>

            {/* Two-click area: has own content AND sub-tabs */}
            <Tab
              id="products"
              text="Products"
              icon={<FileText className="h-4 w-4" />}
              subTabs={
                <>
                  <Tab id="products-electronics" text="Electronics">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Electronics</h3>
                      <p>Browse our electronics catalog.</p>
                    </div>
                  </Tab>
                  <Tab id="products-clothing" text="Clothing">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Clothing</h3>
                      <p>Browse our clothing catalog.</p>
                    </div>
                  </Tab>
                  <Tab id="products-books" text="Books" additionalText="New">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Books</h3>
                      <p>Browse our book catalog.</p>
                    </div>
                  </Tab>
                </>
              }
            >
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Products Overview</h3>
                <p>This is the main Products tab content. Click the arrow to see product categories.</p>
              </div>
            </Tab>

            {/* Single-click area: has ONLY sub-tabs, no own content */}
            <Tab
              id="reports"
              text="Reports"
              icon={<FileText className="h-4 w-4" />}
              subTabs={
                <>
                  <Tab id="reports-sales" text="Sales Report" design={TabSemanticDesign.Positive}>
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Sales Report</h3>
                      <p>View sales metrics and performance.</p>
                    </div>
                  </Tab>
                  <Tab id="reports-inventory" text="Inventory Report" design={TabSemanticDesign.Critical}>
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Inventory Report</h3>
                      <p>View inventory status and alerts.</p>
                    </div>
                  </Tab>
                  <Tab id="reports-errors" text="Error Log" design={TabSemanticDesign.Negative} additionalText="3">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Error Log</h3>
                      <p>View system errors and issues.</p>
                    </div>
                  </Tab>
                </>
              }
            />

            {/* Deeply nested tabs */}
            <Tab
              id="settings-parent"
              text="Settings"
              icon={<Settings className="h-4 w-4" />}
              subTabs={
                <>
                  <Tab
                    id="settings-general"
                    text="General"
                    subTabs={
                      <>
                        <Tab id="settings-general-profile" text="Profile">
                          <p>Edit your profile settings.</p>
                        </Tab>
                        <Tab id="settings-general-preferences" text="Preferences">
                          <p>Configure your preferences.</p>
                        </Tab>
                      </>
                    }
                  >
                    <p>General settings overview.</p>
                  </Tab>
                  <Tab id="settings-security" text="Security">
                    <p>Security and privacy settings.</p>
                  </Tab>
                  <Tab id="settings-notifications" text="Notifications">
                    <p>Notification preferences.</p>
                  </Tab>
                </>
              }
            >
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Settings</h3>
                <p>This tab has nested sub-tabs with further nesting (deeply nested).</p>
              </div>
            </Tab>
          </TabContainer>
        </div>
      </section>

      {/* Collapsed Mode */}
      <section id="collapsed-mode-icon-only" className="space-y-4">
        <h2 className="text-xl font-semibold">Collapsed Mode (Icon Only)</h2>
        <p className="text-sm text-secondary-foreground">
          In collapsed mode, only icons are shown in the tab strip.
        </p>

        <div className="border rounded-lg overflow-hidden max-w-md">
          <TabContainer collapsed>
            <Tab id="collapsed-home" text="Home" icon={<Home className="h-4 w-4" />} tooltip="Home">
              <p>Home content in collapsed mode.</p>
            </Tab>
            <Tab id="collapsed-user" text="User" icon={<User className="h-4 w-4" />} tooltip="User Profile">
              <p>User profile content.</p>
            </Tab>
            <Tab id="collapsed-bell" text="Notifications" icon={<Bell className="h-4 w-4" />} tooltip="Notifications">
              <p>Notifications content.</p>
            </Tab>
            <Tab id="collapsed-settings" text="Settings" icon={<Settings className="h-4 w-4" />} tooltip="Settings">
              <p>Settings content.</p>
            </Tab>
          </TabContainer>
        </div>
      </section>

      {/* End Overflow Mode */}
      <section id="tab-overflow---end-mode" className="space-y-4">
        <h2 className="text-xl font-semibold">Tab Overflow - End Mode</h2>
        <p className="text-sm text-secondary-foreground">
          When tabs overflow the container, a "More" button appears at the end showing hidden tabs in a dropdown.
          The selected tab is always kept visible.
        </p>

        <div className="border rounded-lg overflow-hidden w-[960px]">
          <TabContainer tabsOverflowMode overflowMode={TabOverflowMode.End}>
            <Tab id="overflow-inbox" text="Inbox" icon={<Inbox className="h-4 w-4" />} additionalText="24">
              <p>Inbox content - you have 24 unread messages.</p>
            </Tab>
            <Tab id="overflow-sent" text="Sent" icon={<Send className="h-4 w-4" />}>
              <p>Sent messages content.</p>
            </Tab>
            <Tab id="overflow-drafts" text="Drafts" icon={<FileText className="h-4 w-4" />} additionalText="3">
              <p>Draft messages content.</p>
            </Tab>
            <Tab id="overflow-archive" text="Archive" icon={<Archive className="h-4 w-4" />}>
              <p>Archived messages content.</p>
            </Tab>
            <Tab id="overflow-trash" text="Trash" icon={<Trash className="h-4 w-4" />}>
              <p>Deleted messages content.</p>
            </Tab>
            <Tab id="overflow-calendar" text="Calendar" icon={<Calendar className="h-4 w-4" />}>
              <p>Calendar view content.</p>
            </Tab>
            <Tab id="overflow-contacts" text="Contacts" icon={<User className="h-4 w-4" />}>
              <p>Contact list content.</p>
            </Tab>
            <Tab id="overflow-settings" text="Settings" icon={<Settings className="h-4 w-4" />}>
              <p>Settings content.</p>
            </Tab>
            <Tab id="overflow-notifications" text="Notifications" icon={<Bell className="h-4 w-4" />} additionalText="7">
              <p>Notifications content.</p>
            </Tab>
            <Tab id="overflow-bookmarks" text="Bookmarks" icon={<Bookmark className="h-4 w-4" />}>
              <p>Bookmarks content.</p>
            </Tab>
            <Tab id="overflow-tags" text="Tags" icon={<Tag className="h-4 w-4" />}>
              <p>Tags content.</p>
            </Tab>
            <Tab id="overflow-reports" text="Reports" icon={<FileText className="h-4 w-4" />}>
              <p>Reports content.</p>
            </Tab>
            <Tab id="overflow-tasks" text="Tasks" icon={<Clock className="h-4 w-4" />} additionalText="5">
              <p>Tasks content.</p>
            </Tab>
            <Tab id="overflow-starred" text="Starred" icon={<Star className="h-4 w-4" />}>
              <p>Starred content.</p>
            </Tab>
            <Tab id="overflow-folders" text="Folders" icon={<Folder className="h-4 w-4" />}>
              <p>Folders content.</p>
            </Tab>
          </TabContainer>
        </div>
      </section>

      {/* StartAndEnd Overflow Mode */}
      <section id="tab-overflow---start-and-end-mode" className="space-y-4">
        <h2 className="text-xl font-semibold">Tab Overflow - Start and End Mode</h2>
        <p className="text-sm text-secondary-foreground">
          With StartAndEnd overflow mode, tabs can overflow to both sides. The selected tab stays centered,
          and overflow buttons appear on both ends. Tab order is preserved.
        </p>

        <div className="border rounded-lg overflow-hidden w-[960px]">
          <TabContainer tabsOverflowMode overflowMode={TabOverflowMode.StartAndEnd} defaultSelectedTabId="overflow2-tasks">
            <Tab id="overflow2-home" text="Home" icon={<Home className="h-4 w-4" />}>
              <p>Home content.</p>
            </Tab>
            <Tab id="overflow2-files" text="Files" icon={<Folder className="h-4 w-4" />}>
              <p>Files content.</p>
            </Tab>
            <Tab id="overflow2-mail" text="Mail" icon={<Mail className="h-4 w-4" />} additionalText="5">
              <p>Mail content with 5 unread.</p>
            </Tab>
            <Tab id="overflow2-calendar" text="Calendar" icon={<Calendar className="h-4 w-4" />}>
              <p>Calendar content.</p>
            </Tab>
            <Tab id="overflow2-tasks" text="Tasks" icon={<Clock className="h-4 w-4" />} additionalText="12">
              <p>Tasks content with 12 pending.</p>
            </Tab>
            <Tab id="overflow2-bookmarks" text="Bookmarks" icon={<Bookmark className="h-4 w-4" />}>
              <p>Bookmarks content.</p>
            </Tab>
            <Tab id="overflow2-tags" text="Tags" icon={<Tag className="h-4 w-4" />}>
              <p>Tags content.</p>
            </Tab>
            <Tab id="overflow2-archive" text="Archive" icon={<Archive className="h-4 w-4" />}>
              <p>Archive content.</p>
            </Tab>
            <Tab id="overflow2-settings" text="Settings" icon={<Settings className="h-4 w-4" />}>
              <p>Settings content.</p>
            </Tab>
            <Tab id="overflow2-inbox" text="Inbox" icon={<Inbox className="h-4 w-4" />} additionalText="3">
              <p>Inbox content.</p>
            </Tab>
            <Tab id="overflow2-sent" text="Sent" icon={<Send className="h-4 w-4" />}>
              <p>Sent content.</p>
            </Tab>
            <Tab id="overflow2-notifications" text="Notifications" icon={<Bell className="h-4 w-4" />} additionalText="2">
              <p>Notifications content.</p>
            </Tab>
            <Tab id="overflow2-contacts" text="Contacts" icon={<User className="h-4 w-4" />}>
              <p>Contacts content.</p>
            </Tab>
            <Tab id="overflow2-reports" text="Reports" icon={<FileText className="h-4 w-4" />}>
              <p>Reports content.</p>
            </Tab>
            <Tab id="overflow2-starred" text="Starred" icon={<Star className="h-4 w-4" />}>
              <p>Starred content.</p>
            </Tab>
          </TabContainer>
        </div>
      </section>

      {/* Callback Log */}
      <section id="event-log" className="space-y-4">
        <h2 className="text-xl font-semibold">Event Log</h2>
        <p className="text-sm text-secondary-foreground">
          Events from the controlled tabs example above.
        </p>

        <div className="border rounded-lg p-4 bg-muted/30 min-h-[120px]">
          {callbackLog.length === 0 ? (
            <p className="text-sm text-secondary-foreground">No events yet. Try switching tabs above.</p>
          ) : (
            <ul className="space-y-1 font-mono text-sm">
              {callbackLog.map((log, i) => (
                <li key={i} className="text-secondary-foreground">
                  {log}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Keyboard Navigation */}
      <section id="keyboard-navigation" className="space-y-4">
        <h2 className="text-xl font-semibold">Keyboard Navigation</h2>
        <p className="text-sm text-secondary-foreground">
          Full keyboard support following ARIA Tabs pattern.
        </p>

        <div className="border rounded-lg p-4 bg-muted/30">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-4">Key</th>
                <th className="text-left py-2 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2 px-4"><code>Arrow Left/Right</code></td>
                <td className="py-2 px-4">Move focus between tabs</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-4"><code>Home</code></td>
                <td className="py-2 px-4">Move focus to first tab</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-4"><code>End</code></td>
                <td className="py-2 px-4">Move focus to last tab</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-4"><code>Enter / Space</code></td>
                <td className="py-2 px-4">Select focused tab</td>
              </tr>
              <tr>
                <td className="py-2 px-4"><code>Tab</code></td>
                <td className="py-2 px-4">Move focus out of tab list</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Usage Example */}
      <section id="usage-example" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-4">Usage Example</h2>
        <CodeBlock
          language="tsx"
          code={`import { TabContainer, Tab, TabSeparator } from "@sap-ui/fx-components";
import { Home, User, Settings } from "lucide-react";

const [selectedTab, setSelectedTab] = useState("home");

<TabContainer
  selectedTabId={selectedTab}
  onTabSelect={(detail) => {
    setSelectedTab(detail.selectedTabId);
    console.log("Previous:", detail.previousTabId);
  }}
>
  <Tab id="home" text="Home" icon={<Home className="h-4 w-4" />}>
    <p>Home content goes here.</p>
  </Tab>
  <Tab
    id="profile"
    text="Profile"
    icon={<User className="h-4 w-4" />}
    additionalText="3"
  >
    <p>Profile content with badge count.</p>
  </Tab>
  <TabSeparator />
  <Tab id="settings" text="Settings" icon={<Settings className="h-4 w-4" />}>
    <p>Settings content goes here.</p>
  </Tab>
</TabContainer>`}
        />
      </section>
    </div>
  );
}

export default TabContainerPage;
