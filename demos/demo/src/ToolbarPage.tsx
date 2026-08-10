import { useState } from "react";
import {
  Toolbar,
  ToolbarButton,
  ToolbarSeparator,
  ToolbarSpacer,
  ToolbarSelect,
  ToolbarSelectOption,
  ToolbarItem,
  ToolbarDesign,
  ToolbarAlign,
  ToolbarItemOverflowBehavior,
  Option,
  Title,
  SearchField,
  ActivityItemsIcon,
  ActionSettingsIcon,
  ExcelAttachmentIcon,
  FullScreenIcon,
} from "@sap-ui/fx-components";
import {
  Edit,
  Copy,
  Trash2,
  Download,
  Upload,
  Settings,
  Search,
  Plus,
  Save,
  Share2,
  Filter,
  RefreshCw,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
} from "lucide-react";
import { CodeBlock } from "./components/CodeBlock";

export function ToolbarPage() {
  const [lastAction, setLastAction] = useState("(none)");
  const [fontSize, setFontSize] = useState("14");
  const [fontFamily, setFontFamily] = useState("sans-serif");

  return (
    <div className="space-y-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Toolbar</h1>
        <code className="text-sm text-primary/70 font-mono">{'import { Toolbar, ToolbarButton } from "@sap-ui/fx-components"'}</code>
      </header>

      {/* Action tracker */}
      <section className="p-4 border border-border rounded-lg bg-muted/50">
        <p className="text-sm text-secondary-foreground">
          Last action: <span className="font-medium text-foreground">{lastAction}</span>
        </p>
      </section>

      {/* Figma Sample */}
      <section id="toolbar" className="space-y-3">
        <h2 className="text-lg font-bold">Toolbar</h2>
        <div>
          <Toolbar>
            <ToolbarItem overflowPriority={ToolbarItemOverflowBehavior.NeverOverflow} className="min-w-0 !shrink">
              <Title level="H5">Toolbar Title</Title>
            </ToolbarItem>
            <ToolbarSpacer />
            <ToolbarButton text="Create" design="Primary" onClick={() => setLastAction("Create")} />
            <ToolbarButton text="Copy" onClick={() => setLastAction("Copy")} />
            <ToolbarButton text="Paste" onClick={() => setLastAction("Paste")} />
            <ToolbarButton text="Delete" overflowPriority={ToolbarItemOverflowBehavior.AlwaysOverflow} onClick={() => setLastAction("Delete")} />
            <ToolbarButton text="Export" overflowPriority={ToolbarItemOverflowBehavior.AlwaysOverflow} onClick={() => setLastAction("Export")} />
          </Toolbar>
        </div>
      </section>

      {/* Table Toolbar */}
      <section id="table-toolbar" className="space-y-3">
        <h2 className="text-lg font-semibold">Table Toolbar</h2>
        <p className="text-sm text-secondary-foreground">
          A toolbar used above a table with a title, search field, action buttons, and icon-only utility buttons separated by a divider.
        </p>
        <Toolbar>
          <ToolbarItem overflowPriority={ToolbarItemOverflowBehavior.NeverOverflow} className="min-w-0 !shrink">
            <Title level="H5">Sales Orders (15)</Title>
          </ToolbarItem>
          <ToolbarSpacer />
          <ToolbarItem overflowPriority={ToolbarItemOverflowBehavior.NeverOverflow}>
            <SearchField placeholder="Search" style={{ width: "280px" }} />
          </ToolbarItem>
          <ToolbarButton text="Create" design="Tertiary" onClick={() => setLastAction("Create")} />
          <ToolbarButton text="Delete" design="Tertiary" onClick={() => setLastAction("Delete")} />
          <ToolbarSeparator />
          <ToolbarButton icon={<ActivityItemsIcon />} design="SecondaryNeutral" tooltip="Activity Items" onClick={() => setLastAction("Activity Items")} />
          <ToolbarButton icon={<ActionSettingsIcon />} design="SecondaryNeutral" tooltip="Settings" onClick={() => setLastAction("Settings")} />
          <ToolbarButton icon={<ExcelAttachmentIcon />} design="SecondaryNeutral" tooltip="Export to Excel" onClick={() => setLastAction("Export to Excel")} />
          <ToolbarButton icon={<FullScreenIcon />} design="SecondaryNeutral" tooltip="Full Screen" onClick={() => setLastAction("Full Screen")} />
        </Toolbar>
      </section>

      {/* 1. Basic Toolbar */}
      <section id="basic-toolbar" className="space-y-3">
        <h2 className="text-lg font-semibold">Basic Toolbar</h2>
        <p className="text-sm text-secondary-foreground">
          A toolbar with several buttons, some with icons and text.
        </p>
        <Toolbar>
          <ToolbarButton
            text="New"
            icon={<Plus className="h-4 w-4" />}
            onClick={() => setLastAction("New")}
          />
          <ToolbarButton
            text="Edit"
            icon={<Edit className="h-4 w-4" />}
            onClick={() => setLastAction("Edit")}
          />
          <ToolbarButton
            text="Save"
            icon={<Save className="h-4 w-4" />}
            design="Primary"
            onClick={() => setLastAction("Save")}
          />
          <ToolbarButton
            icon={<Search className="h-4 w-4" />}
            tooltip="Search"
            onClick={() => setLastAction("Search")}
          />
          <ToolbarButton
            text="Delete"
            icon={<Trash2 className="h-4 w-4" />}
            design="Neutral"
            onClick={() => setLastAction("Delete")}
          />
        </Toolbar>
      </section>

      {/* 2. Design Variants */}
      <section id="design-variants" className="space-y-3">
        <h2 className="text-lg font-semibold">Design Variants</h2>
        <p className="text-sm text-secondary-foreground">
          Solid (default) vs Transparent design.
        </p>
        <div className="space-y-4">
          <div>
            <p className="text-xs font-medium mb-1 text-secondary-foreground">Solid</p>
            <Toolbar design={ToolbarDesign.Solid}>
              <ToolbarButton text="Action A" onClick={() => setLastAction("Solid: A")} />
              <ToolbarButton text="Action B" onClick={() => setLastAction("Solid: B")} />
              <ToolbarButton text="Action C" onClick={() => setLastAction("Solid: C")} />
            </Toolbar>
          </div>
          <div>
            <p className="text-xs font-medium mb-1 text-secondary-foreground">Transparent</p>
            <Toolbar design={ToolbarDesign.Transparent}>
              <ToolbarButton text="Action A" onClick={() => setLastAction("Transparent: A")} />
              <ToolbarButton text="Action B" onClick={() => setLastAction("Transparent: B")} />
              <ToolbarButton text="Action C" onClick={() => setLastAction("Transparent: C")} />
            </Toolbar>
          </div>
        </div>
      </section>

      {/* 3. Content Alignment */}
      <section id="content-alignment" className="space-y-3">
        <h2 className="text-lg font-semibold">Content Alignment</h2>
        <p className="text-sm text-secondary-foreground">
          Items aligned to Start vs End.
        </p>
        <div className="space-y-4">
          <div>
            <p className="text-xs font-medium mb-1 text-secondary-foreground">alignContent=&quot;Start&quot;</p>
            <Toolbar alignContent={ToolbarAlign.Start}>
              <ToolbarButton text="First" onClick={() => setLastAction("Start: First")} />
              <ToolbarButton text="Second" onClick={() => setLastAction("Start: Second")} />
            </Toolbar>
          </div>
          <div>
            <p className="text-xs font-medium mb-1 text-secondary-foreground">alignContent=&quot;End&quot;</p>
            <Toolbar alignContent={ToolbarAlign.End}>
              <ToolbarButton text="First" onClick={() => setLastAction("End: First")} />
              <ToolbarButton text="Second" onClick={() => setLastAction("End: Second")} />
            </Toolbar>
          </div>
        </div>
      </section>

      {/* 4. Separator and Spacer */}
      <section id="separator-and-spacer" className="space-y-3">
        <h2 className="text-lg font-semibold">Separator and Spacer</h2>
        <p className="text-sm text-secondary-foreground">
          Buttons separated by a visual separator and pushed apart with a spacer.
        </p>
        <Toolbar alignContent="Start">
          <ToolbarButton
            text="Copy"
            icon={<Copy className="h-4 w-4" />}
            onClick={() => setLastAction("Copy")}
          />
          <ToolbarButton
            text="Download"
            icon={<Download className="h-4 w-4" />}
            onClick={() => setLastAction("Download")}
          />
          <ToolbarSeparator />
          <ToolbarButton
            text="Upload"
            icon={<Upload className="h-4 w-4" />}
            onClick={() => setLastAction("Upload")}
          />
          <ToolbarSpacer />
          <ToolbarButton
            text="Settings"
            icon={<Settings className="h-4 w-4" />}
            design="Tertiary"
            onClick={() => setLastAction("Settings")}
          />
        </Toolbar>
      </section>

      {/* 5. Overflow Behavior */}
      <section id="overflow-behavior" className="space-y-3">
        <h2 className="text-lg font-semibold">Overflow Behavior</h2>
        <p className="text-sm text-secondary-foreground">
          Resize the container to see items overflow into a popover. Drag the right edge.
        </p>
        <div
          className="resize-x overflow-hidden border border-dashed border-border rounded-lg"
          style={{ width: "100%", minWidth: 200, maxWidth: "100%" }}
        >
          <Toolbar alignContent="Start">
            <ToolbarButton
              text="Bold"
              icon={<Bold className="h-4 w-4" />}
              onClick={() => setLastAction("Bold")}
            />
            <ToolbarButton
              text="Italic"
              icon={<Italic className="h-4 w-4" />}
              onClick={() => setLastAction("Italic")}
            />
            <ToolbarButton
              text="Underline"
              icon={<Underline className="h-4 w-4" />}
              onClick={() => setLastAction("Underline")}
            />
            <ToolbarSeparator />
            <ToolbarButton
              text="Align Left"
              icon={<AlignLeft className="h-4 w-4" />}
              onClick={() => setLastAction("Align Left")}
            />
            <ToolbarButton
              text="Align Center"
              icon={<AlignCenter className="h-4 w-4" />}
              onClick={() => setLastAction("Align Center")}
            />
            <ToolbarButton
              text="Align Right"
              icon={<AlignRight className="h-4 w-4" />}
              onClick={() => setLastAction("Align Right")}
            />
            <ToolbarSeparator />
            <ToolbarButton
              text="Undo"
              icon={<Undo className="h-4 w-4" />}
              onClick={() => setLastAction("Undo")}
            />
            <ToolbarButton
              text="Redo"
              icon={<Redo className="h-4 w-4" />}
              onClick={() => setLastAction("Redo")}
            />
          </Toolbar>
        </div>
      </section>

      {/* 6. Overflow Priorities */}
      <section id="overflow-priorities" className="space-y-3">
        <h2 className="text-lg font-semibold">Overflow Priorities</h2>
        <p className="text-sm text-secondary-foreground">
          &quot;Share&quot; is AlwaysOverflow (always in popover), &quot;Save&quot; is NeverOverflow (always visible), others are Default.
        </p>
        <div
          className="resize-x overflow-hidden border border-dashed border-border rounded-lg"
          style={{ width: "100%", minWidth: 200, maxWidth: "100%" }}
        >
          <Toolbar alignContent="Start">
            <ToolbarButton
              text="Save"
              icon={<Save className="h-4 w-4" />}
              design="Primary"
              overflowPriority={ToolbarItemOverflowBehavior.NeverOverflow}
              onClick={() => setLastAction("Save (NeverOverflow)")}
            />
            <ToolbarButton
              text="Edit"
              icon={<Edit className="h-4 w-4" />}
              onClick={() => setLastAction("Edit (Default)")}
            />
            <ToolbarButton
              text="Copy"
              icon={<Copy className="h-4 w-4" />}
              onClick={() => setLastAction("Copy (Default)")}
            />
            <ToolbarButton
              text="Refresh"
              icon={<RefreshCw className="h-4 w-4" />}
              onClick={() => setLastAction("Refresh (Default)")}
            />
            <ToolbarButton
              text="Share"
              icon={<Share2 className="h-4 w-4" />}
              overflowPriority={ToolbarItemOverflowBehavior.AlwaysOverflow}
              onClick={() => setLastAction("Share (AlwaysOverflow)")}
            />
          </Toolbar>
        </div>
      </section>

      {/* 7. Toolbar with Select */}
      <section id="toolbar-with-select" className="space-y-3">
        <h2 className="text-lg font-semibold">Toolbar with Select</h2>
        <p className="text-sm text-secondary-foreground">
          ToolbarSelect alongside buttons. The Select can also overflow into the popover.
        </p>
        <div
          className="resize-x overflow-hidden border border-dashed border-border rounded-lg"
          style={{ width: "100%", minWidth: 200, maxWidth: "100%" }}
        >
          <Toolbar alignContent="Start">
            <ToolbarButton
              text="Bold"
              icon={<Bold className="h-4 w-4" />}
              onClick={() => setLastAction("Bold")}
            />
            <ToolbarButton
              text="Italic"
              icon={<Italic className="h-4 w-4" />}
              onClick={() => setLastAction("Italic")}
            />
            <ToolbarSeparator />
            <ToolbarSelect
              value={fontSize}
              width="90px"
              onChange={(detail) => {
                const val = detail.selectedOption?.value;
                if (val) {
                  setFontSize(val);
                  setLastAction(`Font size: ${val}`);
                }
              }}
            >
              <Option value="10">10px</Option>
              <Option value="12">12px</Option>
              <Option value="14">14px</Option>
              <Option value="16">16px</Option>
              <Option value="18">18px</Option>
              <Option value="24">24px</Option>
            </ToolbarSelect>
            <ToolbarSelect
              value={fontFamily}
              width="140px"
              onChange={(detail) => {
                const val = detail.selectedOption?.value;
                if (val) {
                  setFontFamily(val);
                  setLastAction(`Font: ${val}`);
                }
              }}
            >
              <Option value="sans-serif">Sans Serif</Option>
              <Option value="serif">Serif</Option>
              <Option value="monospace">Monospace</Option>
            </ToolbarSelect>
            <ToolbarSpacer />
            <ToolbarButton
              icon={<Filter className="h-4 w-4" />}
              tooltip="Filter"
              design="Tertiary"
              onClick={() => setLastAction("Filter")}
            />
          </Toolbar>
        </div>
      </section>

      {/* 8. Generic ToolbarItem */}
      <section id="generic-toolbaritem" className="space-y-3">
        <h2 className="text-lg font-semibold">Generic ToolbarItem</h2>
        <p className="text-sm text-secondary-foreground">
          Wrap arbitrary content using ToolbarItem.
        </p>
        <Toolbar alignContent="Start">
          <ToolbarItem>
            <span className="text-sm font-medium text-secondary-foreground">Items: 42</span>
          </ToolbarItem>
          <ToolbarSpacer />
          <ToolbarButton
            text="Refresh"
            icon={<RefreshCw className="h-4 w-4" />}
            design="Tertiary"
            onClick={() => setLastAction("Refresh")}
          />
        </Toolbar>
      </section>

      {/* 9. Keyboard Navigation */}
      <section id="keyboard-navigation" className="space-y-3">
        <h2 className="text-lg font-semibold">Keyboard Navigation</h2>
        <div className="p-4 bg-muted/30 rounded-lg space-y-2 text-sm">
          <p className="font-semibold mb-3">Toolbar Navigation</p>
          <p>
            <kbd className="px-2 py-1 bg-card rounded border border-border">Tab</kbd>{" "}
            - Move focus into / out of the toolbar
          </p>
          <p>
            <kbd className="px-2 py-1 bg-card rounded border border-border">&larr;</kbd>{" / "}
            <kbd className="px-2 py-1 bg-card rounded border border-border">&rarr;</kbd>{" "}
            - Navigate between items
          </p>
          <p>
            <kbd className="px-2 py-1 bg-card rounded border border-border">Home</kbd>{" "}
            - Focus first item
          </p>
          <p>
            <kbd className="px-2 py-1 bg-card rounded border border-border">End</kbd>{" "}
            - Focus last item
          </p>
          <p className="font-semibold mb-3 mt-4">Item Actions</p>
          <p>
            <kbd className="px-2 py-1 bg-card rounded border border-border">Enter</kbd>{" / "}
            <kbd className="px-2 py-1 bg-card rounded border border-border">Space</kbd>{" "}
            - Activate focused button / toggle select
          </p>
          <p className="font-semibold mb-3 mt-4">Overflow</p>
          <p>
            When items overflow, a{" "}
            <kbd className="px-2 py-1 bg-card rounded border border-border">&hellip;</kbd>{" "}
            button appears. Activate it to open the overflow popover. Items inside
            the popover close it on click by default.
          </p>
        </div>
      </section>

      {/* Usage Example */}
      <section id="usage-example" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-4">Usage Example</h2>
        <CodeBlock
          language="tsx"
          code={`import {
  Toolbar, ToolbarButton, ToolbarSeparator,
  ToolbarSpacer, ToolbarItemOverflowBehavior,
} from "@sap-ui/fx-components";
import { Plus, Save, Search, Settings } from "lucide-react";

<Toolbar alignContent="Start">
  <ToolbarButton
    text="New"
    icon={<Plus className="h-4 w-4" />}
    onClick={() => console.log("New")}
  />
  <ToolbarButton
    text="Save"
    icon={<Save className="h-4 w-4" />}
    design="Primary"
    overflowPriority={ToolbarItemOverflowBehavior.NeverOverflow}
    onClick={() => console.log("Save")}
  />
  <ToolbarSeparator />
  <ToolbarButton
    icon={<Search className="h-4 w-4" />}
    tooltip="Search"
    onClick={() => console.log("Search")}
  />
  <ToolbarSpacer />
  <ToolbarButton
    icon={<Settings className="h-4 w-4" />}
    tooltip="Settings"
    design="Tertiary"
    onClick={() => console.log("Settings")}
  />
</Toolbar>`}
        />
      </section>
    </div>
  );
}
