import { useState } from "react";
import { SegmentedButton, SegmentedButtonItem, Button, ButtonDesign, ToggleButton, ShowIcon, EditIcon, PlayIcon, ListIcon, GridIcon, TextAlignLeftIcon, TextAlignCenterIcon, TextAlignRightIcon, TextAlignJustifiedIcon, LightModeIcon, DarkModeIcon, SysMonitorIcon, MapIcon, BoldTextIcon, ItalicTextIcon, UnderlineTextIcon, UndoIcon, RedoIcon } from "@sap-ui/fx-components";
import { CodeBlock } from "./components/CodeBlock";

export function SegmentedButtonPage() {
  const [mode, setMode] = useState("view");
  const [layout, setLayout] = useState("list");
  const [align, setAlign] = useState("left");
  const [theme, setTheme] = useState("system");
  const [mapType, setMapType] = useState("map");
  const [size, setSize] = useState("medium");
  const [period, setPeriod] = useState("day");

  return (
    <div className="space-y-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">SegmentedButton</h1>
        <code className="text-sm text-primary/70 font-mono">{'import { SegmentedButton, SegmentedButtonItem } from "@sap-ui/fx-components"'}</code>
      </header>

      {/* State Tracker */}
      <section className="p-4 border border-border rounded-lg bg-muted/50">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <span><strong>Mode:</strong> {mode}</span>
          <span><strong>Layout:</strong> {layout}</span>
          <span><strong>Align:</strong> {align}</span>
          <span><strong>Theme:</strong> {theme}</span>
        </div>
      </section>

      {/* Basic */}
      <section id="basic" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Basic</h2>
        <p className="text-secondary-foreground mb-4">
          Three size variants: <code>Large</code> (default, 40px height, 8px radius), <code>Medium</code> (32px height, 4px radius), and <code>Small</code> (24px height, 4px radius).
        </p>
        <div className="flex flex-wrap items-center gap-6">
          <div>
            <p className="text-sm text-secondary-foreground mb-2">Large (default)</p>
            <SegmentedButton
              selectedId={mode}
              onSelectionChange={({ selectedId }) => setMode(selectedId)}
            >
              <SegmentedButtonItem id="view" icon={<ShowIcon />} text="View" />
              <SegmentedButtonItem id="edit" icon={<EditIcon />} text="Edit" />
              <SegmentedButtonItem id="test" icon={<PlayIcon />} text="Test" />
            </SegmentedButton>
          </div>
          <div>
            <p className="text-sm text-secondary-foreground mb-2">Medium</p>
            <SegmentedButton
              size="Medium"
              selectedId={mode}
              onSelectionChange={({ selectedId }) => setMode(selectedId)}
            >
              <SegmentedButtonItem id="view" icon={<ShowIcon />} text="View" />
              <SegmentedButtonItem id="edit" icon={<EditIcon />} text="Edit" />
              <SegmentedButtonItem id="test" icon={<PlayIcon />} text="Test" />
            </SegmentedButton>
          </div>
          <div>
            <p className="text-sm text-secondary-foreground mb-2">Small</p>
            <SegmentedButton
              size="Small"
              selectedId={mode}
              onSelectionChange={({ selectedId }) => setMode(selectedId)}
            >
              <SegmentedButtonItem id="view" icon={<ShowIcon />} text="View" />
              <SegmentedButtonItem id="edit" icon={<EditIcon />} text="Edit" />
              <SegmentedButtonItem id="test" icon={<PlayIcon />} text="Test" />
            </SegmentedButton>
          </div>
        </div>
      </section>

      {/* Icon Only */}
      <section id="icon-only" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Icon Only</h2>
        <p className="text-secondary-foreground mb-4">
          Compact icon-only variant for toolbars.
        </p>
        <div className="flex flex-wrap gap-6">
          <div>
            <p className="text-sm text-secondary-foreground mb-2">Layout (Large)</p>
            <SegmentedButton
              size="Large"
              selectedId={layout}
              onSelectionChange={({ selectedId }) => setLayout(selectedId)}
            >
              <SegmentedButtonItem id="list" icon={<ListIcon />} tooltip="List view" />
              <SegmentedButtonItem id="grid" icon={<GridIcon />} tooltip="Grid view" />
              <SegmentedButtonItem id="tiles" icon={<GridIcon />} tooltip="Tile view" />
            </SegmentedButton>
          </div>

          <div>
            <p className="text-sm text-secondary-foreground mb-2">Layout (Medium)</p>
            <SegmentedButton
              size="Medium"
              selectedId={layout}
              onSelectionChange={({ selectedId }) => setLayout(selectedId)}
            >
              <SegmentedButtonItem id="list" icon={<ListIcon />} tooltip="List view" />
              <SegmentedButtonItem id="grid" icon={<GridIcon />} tooltip="Grid view" />
              <SegmentedButtonItem id="tiles" icon={<GridIcon />} tooltip="Tile view" />
            </SegmentedButton>
          </div>

          <div>
            <p className="text-sm text-secondary-foreground mb-2">Layout (Small)</p>
            <SegmentedButton
              size="Small"
              selectedId={layout}
              onSelectionChange={({ selectedId }) => setLayout(selectedId)}
            >
              <SegmentedButtonItem id="list" icon={<ListIcon />} tooltip="List view" />
              <SegmentedButtonItem id="grid" icon={<GridIcon />} tooltip="Grid view" />
              <SegmentedButtonItem id="tiles" icon={<GridIcon />} tooltip="Tile view" />
            </SegmentedButton>
          </div>

          <div>
            <p className="text-sm text-secondary-foreground mb-2">Text Alignment</p>
            <SegmentedButton
              selectedId={align}
              onSelectionChange={({ selectedId }) => setAlign(selectedId)}
            >
              <SegmentedButtonItem id="left" icon={<TextAlignLeftIcon />} tooltip="Align left" />
              <SegmentedButtonItem id="center" icon={<TextAlignCenterIcon />} tooltip="Align center" />
              <SegmentedButtonItem id="right" icon={<TextAlignRightIcon />} tooltip="Align right" />
              <SegmentedButtonItem id="justify" icon={<TextAlignJustifiedIcon />} tooltip="Justify" />
            </SegmentedButton>
          </div>
        </div>
      </section>

      {/* Text Only */}
      <section id="text-only" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Text Only</h2>
        <p className="text-secondary-foreground mb-4">
          Text-only variant without icons.
        </p>
        <div className="flex flex-wrap gap-6">
          <div>
            <p className="text-sm text-secondary-foreground mb-2">Size (Large)</p>
            <SegmentedButton
              size="Large"
              selectedId={size}
              onSelectionChange={({ selectedId }) => setSize(selectedId)}
            >
              <SegmentedButtonItem id="small" text="S" />
              <SegmentedButtonItem id="medium" text="M" />
              <SegmentedButtonItem id="large" text="L" />
              <SegmentedButtonItem id="xlarge" text="XL" />
            </SegmentedButton>
          </div>

          <div>
            <p className="text-sm text-secondary-foreground mb-2">Size (Medium)</p>
            <SegmentedButton
              size="Medium"
              selectedId={size}
              onSelectionChange={({ selectedId }) => setSize(selectedId)}
            >
              <SegmentedButtonItem id="small" text="S" />
              <SegmentedButtonItem id="medium" text="M" />
              <SegmentedButtonItem id="large" text="L" />
              <SegmentedButtonItem id="xlarge" text="XL" />
            </SegmentedButton>
          </div>

          <div>
            <p className="text-sm text-secondary-foreground mb-2">Size (Small)</p>
            <SegmentedButton
              size="Small"
              selectedId={size}
              onSelectionChange={({ selectedId }) => setSize(selectedId)}
            >
              <SegmentedButtonItem id="small" text="S" />
              <SegmentedButtonItem id="medium" text="M" />
              <SegmentedButtonItem id="large" text="L" />
              <SegmentedButtonItem id="xlarge" text="XL" />
            </SegmentedButton>
          </div>

          <div>
            <p className="text-sm text-secondary-foreground mb-2">Period</p>
            <SegmentedButton
              selectedId={period}
              onSelectionChange={({ selectedId }) => setPeriod(selectedId)}
            >
              <SegmentedButtonItem id="day" text="Day" />
              <SegmentedButtonItem id="week" text="Week" />
              <SegmentedButtonItem id="month" text="Month" />
              <SegmentedButtonItem id="year" text="Year" />
            </SegmentedButton>
          </div>
        </div>
      </section>

      {/* Theme Switcher */}
      <section id="theme-switcher-example" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Theme Switcher Example</h2>
        <p className="text-secondary-foreground mb-4">
          A common pattern for theme/appearance switching.
        </p>
        <SegmentedButton
          selectedId={theme}
          onSelectionChange={({ selectedId }) => setTheme(selectedId)}
        >
          <SegmentedButtonItem id="light" icon={<LightModeIcon />} text="Light" />
          <SegmentedButtonItem id="dark" icon={<DarkModeIcon />} text="Dark" />
          <SegmentedButtonItem id="system" icon={<SysMonitorIcon />} text="System" />
        </SegmentedButton>
      </section>

      {/* Map Type Selector */}
      <section id="map-type-selector" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Map Type Selector</h2>
        <p className="text-secondary-foreground mb-4">
          Another practical example with icons and text.
        </p>
        <SegmentedButton
          selectedId={mapType}
          onSelectionChange={({ selectedId }) => setMapType(selectedId)}
        >
          <SegmentedButtonItem id="map" icon={<MapIcon />} text="Map" />
          <SegmentedButtonItem id="satellite" icon={<MapIcon />} text="Satellite" />
          <SegmentedButtonItem id="terrain" icon={<MapIcon />} text="Terrain" />
        </SegmentedButton>
      </section>

      {/* Disabled Items */}
      <section id="disabled-items" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Disabled Items</h2>
        <p className="text-secondary-foreground mb-4">
          Individual items can be disabled while others remain interactive.
        </p>
        <SegmentedButton
          selectedId="view"
          onSelectionChange={() => {}}
        >
          <SegmentedButtonItem id="view" icon={<ShowIcon />} text="View" />
          <SegmentedButtonItem id="edit" icon={<EditIcon />} text="Edit" disabled />
          <SegmentedButtonItem id="test" icon={<PlayIcon />} text="Test" disabled />
        </SegmentedButton>
      </section>

      {/* Toolbar Example */}
      <section id="toolbar-example" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Toolbar Example</h2>
        <p className="text-secondary-foreground mb-4">
          Button, ToggleButton, and SegmentedButton side by side — demonstrating height alignment across all sizes.
        </p>
        <div className="space-y-6">
          <div>
            <p className="text-sm text-secondary-foreground mb-2">Large (48px)</p>
            <div className="flex items-center gap-2">
              <Button design={ButtonDesign.Primary} icon={<UndoIcon />}>Undo</Button>
              <Button design={ButtonDesign.Secondary} icon={<RedoIcon />}>Redo</Button>
              <ToggleButton icon={<BoldTextIcon />}>Bold</ToggleButton>
              <ToggleButton icon={<ItalicTextIcon />}>Italic</ToggleButton>
              <ToggleButton icon={<UnderlineTextIcon />}>Underline</ToggleButton>
              <SegmentedButton
                size="Large"
                selectedId={layout}
                onSelectionChange={({ selectedId }) => setLayout(selectedId)}
              >
                <SegmentedButtonItem id="list" icon={<ListIcon />} tooltip="List view" />
                <SegmentedButtonItem id="grid" icon={<GridIcon />} tooltip="Grid view" />
                <SegmentedButtonItem id="tiles" icon={<GridIcon />} tooltip="Tile view" />
              </SegmentedButton>
            </div>
          </div>

          <div>
            <p className="text-sm text-secondary-foreground mb-2">Medium (40px)</p>
            <div className="flex items-center gap-2">
              <Button design={ButtonDesign.Primary} size="Medium" icon={<UndoIcon />}>Undo</Button>
              <Button design={ButtonDesign.Secondary} size="Medium" icon={<RedoIcon />}>Redo</Button>
              <ToggleButton size="Medium" icon={<BoldTextIcon />}>Bold</ToggleButton>
              <ToggleButton size="Medium" icon={<ItalicTextIcon />}>Italic</ToggleButton>
              <ToggleButton size="Medium" icon={<UnderlineTextIcon />}>Underline</ToggleButton>
              <SegmentedButton
                size="Medium"
                selectedId={layout}
                onSelectionChange={({ selectedId }) => setLayout(selectedId)}
              >
                <SegmentedButtonItem id="list" icon={<ListIcon />} tooltip="List view" />
                <SegmentedButtonItem id="grid" icon={<GridIcon />} tooltip="Grid view" />
                <SegmentedButtonItem id="tiles" icon={<GridIcon />} tooltip="Tile view" />
              </SegmentedButton>
            </div>
          </div>

          <div>
            <p className="text-sm text-secondary-foreground mb-2">Small (32px)</p>
            <div className="flex items-center gap-2">
              <Button design={ButtonDesign.Primary} size="Small" icon={<UndoIcon />}>Undo</Button>
              <Button design={ButtonDesign.Secondary} size="Small" icon={<RedoIcon />}>Redo</Button>
              <ToggleButton size="Small" icon={<BoldTextIcon />}>Bold</ToggleButton>
              <ToggleButton size="Small" icon={<ItalicTextIcon />}>Italic</ToggleButton>
              <ToggleButton size="Small" icon={<UnderlineTextIcon />}>Underline</ToggleButton>
              <SegmentedButton
                size="Small"
                selectedId={layout}
                onSelectionChange={({ selectedId }) => setLayout(selectedId)}
              >
                <SegmentedButtonItem id="list" icon={<ListIcon />} tooltip="List view" />
                <SegmentedButtonItem id="grid" icon={<GridIcon />} tooltip="Grid view" />
                <SegmentedButtonItem id="tiles" icon={<GridIcon />} tooltip="Tile view" />
              </SegmentedButton>
            </div>
          </div>
        </div>
      </section>

      {/* Usage Example */}
      <section id="usage-example" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-4">Usage Example</h2>
        <CodeBlock language="tsx" code={`import { SegmentedButton, SegmentedButtonItem, ShowIcon, EditIcon, PlayIcon } from '@sap-ui/fx-components';
import { useState } from 'react';

function MyComponent() {
  const [mode, setMode] = useState('view');

  return (
    <SegmentedButton
      selectedId={mode}
      onSelectionChange={({ selectedId }) => setMode(selectedId)}
    >
      <SegmentedButtonItem id="view" icon={<ShowIcon />} text="View" />
      <SegmentedButtonItem id="edit" icon={<EditIcon />} text="Edit" />
      <SegmentedButtonItem id="test" icon={<PlayIcon />} text="Test" />
    </SegmentedButton>
  );
}`} />
      </section>
    </div>
  );
}
