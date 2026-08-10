import React, { useState } from 'react';
import { Tabbar, TabbarSelectionChangeDetail, TabbarItem } from '@sap-ui/fx-components';

const TABS: TabbarItem[] = [
  { id: 'inbox', label: 'Inbox (12)' },
  { id: 'drafts', label: 'Drafts (3)' },
  { id: 'sent', label: 'Sent' },
  { id: 'archive', label: 'Archive' },
  { id: 'spam', label: 'Spam (1)' },
  { id: 'trash', label: 'Trash' },
  { id: 'starred', label: 'Starred (5)' },
  { id: 'important', label: 'Important' },
];

export default function TabbarDemo() {
  const [selectedTab1, setSelectedTab1] = useState<string>('inbox');
  const [lastEventLog, setLastEventLog] = useState<string>('');

  const handleTabSelect = (detail: TabbarSelectionChangeDetail) => {
    setLastEventLog(`Selected: ${detail.selectedTab} (Previous: ${detail.previousTab})`);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-foreground">Tabbar Component</h1>
          <p className="text-base text-secondary-foreground mb-8">
            A tab bar component with overflow handling. Supports both controlled and uncontrolled modes with click interaction, keyboard navigation, and responsive overflow.
          </p>
        </div>

        {/* Example 1: Uncontrolled Mode */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-1">Example 1: Uncontrolled Mode</h2>
            <p className="text-sm text-secondary-foreground">Click on tabs to change selection. Component manages its own state.</p>
          </div>
          <div className="border border-border rounded-lg p-6 bg-card">
            <Tabbar items={TABS} defaultSelectedTab="inbox" enableOverflow />
          </div>
        </div>

        {/* Example 2: Controlled Mode */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-1">Example 2: Controlled Mode</h2>
            <p className="text-sm text-secondary-foreground">Parent component controls the selected tab state</p>
          </div>
          <div className="border border-border rounded-lg p-6 bg-card space-y-4">
            <Tabbar items={TABS} selectedTab={selectedTab1} onTabSelect={(detail) => setSelectedTab1(detail.selectedTab)} enableOverflow />
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedTab1('inbox')}
                className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors text-sm"
              >
                Select Inbox
              </button>
              <button
                onClick={() => setSelectedTab1('drafts')}
                className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors text-sm"
              >
                Select Drafts
              </button>
              <button
                onClick={() => setSelectedTab1('starred')}
                className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors text-sm"
              >
                Select Starred
              </button>
            </div>
            <div className="text-sm text-secondary-foreground">
              <strong>Current selection:</strong> {selectedTab1}
            </div>
          </div>
        </div>

        {/* Example 3: With Event Handler */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-1">Example 3: With Event Handler</h2>
            <p className="text-sm text-secondary-foreground">Listen to tab selection changes with onTabSelect callback</p>
          </div>
          <div className="border border-border rounded-lg p-6 bg-card space-y-4">
            <Tabbar items={TABS} defaultSelectedTab="drafts" onTabSelect={handleTabSelect} enableOverflow />
            {lastEventLog && (
              <div className="p-3 bg-muted rounded text-sm font-mono text-foreground">
                Event: {lastEventLog}
              </div>
            )}
          </div>
        </div>

        {/* Example 4: With Overflow */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-1">Example 4: With Overflow Handling</h2>
            <p className="text-sm text-secondary-foreground">
              Resize the container to see overflow behavior. Tabs that don't fit move to a "More" dropdown menu.
              The selected tab is always kept visible.
            </p>
          </div>
          <div className="border border-border rounded-lg p-6 bg-card space-y-4">
            <div className="resize-x overflow-hidden min-w-[200px] max-w-full border-2 border-dashed border-primary/30 p-2">
              <Tabbar items={TABS} defaultSelectedTab="inbox" enableOverflow />
            </div>
            <p className="text-xs text-secondary-foreground italic">
              Drag the bottom-right corner of the dashed box to resize and see overflow in action
            </p>
          </div>
        </div>

        {/* Example 5: Without Underline */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-1">Example 5: Without Underline</h2>
            <p className="text-sm text-secondary-foreground">Use the noUnderline prop to remove the bottom line</p>
          </div>
          <div className="border border-border rounded-lg p-6 bg-card space-y-4">
            <Tabbar items={TABS} defaultSelectedTab="inbox" noUnderline enableOverflow />
          </div>
        </div>

        {/* All States Side by Side */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-1">All States Comparison</h2>
            <p className="text-sm text-secondary-foreground">Different selected states shown together (static)</p>
          </div>
          <div className="border border-border rounded-lg p-6 bg-card space-y-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-secondary-foreground uppercase">State 1: Inbox</p>
              <Tabbar items={TABS} selectedTab="inbox" enableOverflow />
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold text-secondary-foreground uppercase">State 2: Drafts</p>
              <Tabbar items={TABS} selectedTab="drafts" enableOverflow />
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold text-secondary-foreground uppercase">State 3: Starred</p>
              <Tabbar items={TABS} selectedTab="starred" enableOverflow />
            </div>
          </div>
        </div>

        {/* Custom Styling Example */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-1">Custom Styling Example</h2>
            <p className="text-sm text-secondary-foreground">Tabbar with custom className applied</p>
          </div>
          <div className="border border-border rounded-lg p-6 bg-muted">
            <Tabbar items={TABS} defaultSelectedTab="drafts" className="bg-card rounded shadow-sm px-4" enableOverflow />
          </div>
        </div>

        {/* Features */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-1">Key Features</h2>
          </div>
          <div className="border border-border rounded-lg p-6 bg-card">
            <ul className="list-disc list-inside space-y-2 text-secondary-foreground">
              <li>
                <strong className="text-foreground">Controlled & Uncontrolled:</strong> Works in both controlled (via selectedTab prop) and uncontrolled (via defaultSelectedTab) modes
              </li>
              <li>
                <strong className="text-foreground">Click Interaction:</strong> Click on any tab to select it
              </li>
              <li>
                <strong className="text-foreground">Event Callbacks:</strong> onTabSelect event provides both current and previous tab values
              </li>
              <li>
                <strong className="text-foreground">Overflow Handling:</strong> Automatically moves tabs to a "More" dropdown when they don't fit. Ensures selected tab is always visible.
              </li>
              <li>
                <strong className="text-foreground">Responsive:</strong> ResizeObserver automatically recalculates overflow on container size changes
              </li>
              <li>
                <strong className="text-foreground">Smart Measurement:</strong> Measures tab widths dynamically and caches them for performance
              </li>
              <li>
                <strong className="text-foreground">Accessibility:</strong> Uses proper ARIA attributes (role="tab", aria-selected, aria-controls)
              </li>
              <li>
                <strong className="text-foreground">Keyboard Support:</strong> Proper tabIndex management for keyboard navigation
              </li>
              <li>
                <strong className="text-foreground">Hover States:</strong> Visual feedback on hover with semi-transparent border
              </li>
              <li>
                <strong className="text-foreground">Visual Design:</strong> Matches Figma design with blue accent color, selected border, and font weight changes
              </li>
            </ul>
          </div>
        </div>

        {/* Usage Example */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-1">Usage Example</h2>
          </div>
          <div className="border border-border rounded-lg p-6 bg-card">
            <pre className="text-sm overflow-x-auto bg-muted p-4 rounded">
              <code>{`import { Tabbar, TabbarItem } from '@sap-ui/fx-components';
import { useState } from 'react';

const tabs: TabbarItem[] = [
  { id: 'tab1', label: 'First' },
  { id: 'tab2', label: 'Second' },
  { id: 'tab3', label: 'Third' },
];

// Uncontrolled mode
function Example1() {
  return <Tabbar items={tabs} defaultSelectedTab="tab1" />;
}

// Controlled mode
function Example2() {
  const [selected, setSelected] = useState('tab1');

  return (
    <Tabbar
      items={tabs}
      selectedTab={selected}
      onTabSelect={(detail) => setSelected(detail.selectedTab)}
    />
  );
}

// With overflow handling
function Example3() {
  return (
    <Tabbar
      items={tabs}
      defaultSelectedTab="tab1"
      enableOverflow
    />
  );
}

// Without underline
function Example4() {
  return <Tabbar items={tabs} defaultSelectedTab="tab1" noUnderline />;
}`}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
