import { useState, useRef } from "react";
import {
  Panel,
  PanelRef,
  PanelAccessibleRole,
  PanelDesign,
  Button,
  Tag,
  EditIcon,
} from "@sap-ui/fx-components";
import { TitleLevel } from "@sap-ui/fx-components";
import { CodeBlock } from "./components/CodeBlock";

export function PanelPage() {
  const [controlledCollapsed, setControlledCollapsed] = useState(false);
  const [toggleCount, setToggleCount] = useState(0);
  const panelRef = useRef<PanelRef>(null);

  return (
    <div className="space-y-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Panel</h1>
        <code className="text-sm text-primary/70 font-mono">{'import { Panel } from "@sap-ui/fx-components"'}</code>
      </header>

      {/* Basic Panel */}
      <section id="basic-panel" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Basic Panel</h2>
        <p className="text-secondary-foreground mb-4">
          A collapsible panel with header text. Click the header to expand/collapse.
        </p>
        <div className="max-w-xl">
          <Panel headerText="Personal Information">
            <p className="text-sm text-secondary-foreground">
              This is the panel content. It is visible when the panel is expanded
              and hidden when collapsed. Click the header to toggle.
            </p>
          </Panel>
        </div>
      </section>

      {/* Design Variants */}
      <section id="design-variants" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Design Variants</h2>
        <p className="text-secondary-foreground mb-4">
          Three visual styles: <code>Primary</code> (default), <code>Secondary</code>, and <code>Child</code>.
        </p>
        <div className="max-w-2xl space-y-4">
          <Panel headerText="Primary Panel" design={PanelDesign.Primary}>
            <p className="text-sm text-secondary-foreground">
              Primary design: white card background with border. This is the default.
            </p>
          </Panel>
          <Panel headerText="Secondary Panel" design={PanelDesign.Secondary}>
            <p className="text-sm text-secondary-foreground">
              Secondary design: secondary background with border.
            </p>
          </Panel>
          <Panel headerText="Child Panel" design={PanelDesign.Child}>
            <p className="text-sm text-secondary-foreground">
              Child design: transparent, borderless, compact header. Used for nesting inside other panels.
            </p>
          </Panel>
        </div>
      </section>

      {/* Subtitle & EndSlot */}
      <section id="subtitle-end-slot" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Subtitle & End Slot</h2>
        <p className="text-secondary-foreground mb-4">
          Use <code>subtitle</code> for secondary text and <code>endSlot</code> for actions in the header.
        </p>
        <div className="max-w-2xl space-y-4">
          <Panel
            headerText="Order Details"
            subtitle="3 items - $51.49"
            endSlot={<Tag>Delivered</Tag>}
          >
            <p className="text-sm text-secondary-foreground">
              Primary panel with subtitle and an end-slot Tag.
            </p>
          </Panel>
          <Panel
            design={PanelDesign.Secondary}
            headerText="Settings"
            subtitle="Last updated 2 hours ago"
            endSlot={<Button design="SecondaryNeutral" icon={<EditIcon />}>Edit</Button>}
          >
            <p className="text-sm text-secondary-foreground">
              Secondary panel with subtitle and an end-slot Button.
            </p>
          </Panel>
          <Panel
            design={PanelDesign.Child}
            headerText="Child with Subtitle"
            subtitle="5 results"
            endSlot={<Button design="SecondaryNeutral">View All</Button>}
          >
            <p className="text-sm text-secondary-foreground">
              Child panel also supports subtitle and end slot.
            </p>
          </Panel>
        </div>
      </section>

      {/* Footer */}
      <section id="footer" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Footer</h2>
        <p className="text-secondary-foreground mb-4">
          The <code>footer</code> prop adds a footer area below content. Secondary variant has a tinted footer background.
        </p>
        <div className="max-w-2xl space-y-4">
          <Panel
            headerText="Primary with Footer"
            footer={
              <div className="flex justify-end gap-2 w-full">
                <Button design="Tertiary">Cancel</Button>
                <Button design="Primary">Save</Button>
              </div>
            }
          >
            <p className="text-sm text-secondary-foreground">
              Primary panel footer has no special background.
            </p>
          </Panel>
          <Panel
            design={PanelDesign.Secondary}
            headerText="Secondary with Footer"
            subtitle="Review your answers"
            footer={
              <div className="flex justify-end gap-2 w-full">
                <Button design="Tertiary">Skip</Button>
                <Button design="Primary">Submit</Button>
              </div>
            }
          >
            <p className="text-sm text-secondary-foreground">
              Secondary panel footer has a tinted background.
            </p>
          </Panel>
        </div>
      </section>

      {/* Nested Child Panels */}
      <section id="nested-child-panels" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Nested Child Panels</h2>
        <p className="text-secondary-foreground mb-4">
          Child panels are designed to nest inside Primary or Secondary panels.
        </p>
        <div className="max-w-2xl">
          <Panel headerText="Shipping Information" subtitle="Step 1 of 3">
            <div className="space-y-1">
              <Panel design={PanelDesign.Child} headerText="Recipient" subtitle="John Doe">
                <p className="text-sm text-secondary-foreground">
                  Name, phone, and email address.
                </p>
              </Panel>
              <Panel design={PanelDesign.Child} headerText="Address" subtitle="123 Main St" defaultCollapsed>
                <p className="text-sm text-secondary-foreground">
                  Street, city, state, and ZIP code.
                </p>
              </Panel>
              <Panel design={PanelDesign.Child} headerText="Delivery Method" defaultCollapsed>
                <p className="text-sm text-secondary-foreground">
                  Standard, express, or overnight shipping.
                </p>
              </Panel>
            </div>
          </Panel>
        </div>
      </section>

      {/* All Variants Collapsed */}
      <section id="all-variants-collapsed" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">All Variants Collapsed</h2>
        <p className="text-secondary-foreground mb-4">
          All three design variants in collapsed state.
        </p>
        <div className="max-w-2xl space-y-4">
          <Panel headerText="Primary Collapsed" subtitle="Click to expand" defaultCollapsed />
          <Panel design={PanelDesign.Secondary} headerText="Secondary Collapsed" subtitle="Click to expand" defaultCollapsed />
          <Panel design={PanelDesign.Child} headerText="Child Collapsed" subtitle="Click to expand" defaultCollapsed />
        </div>
      </section>

      {/* Initially Collapsed */}
      <section id="initially-collapsed" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Initially Collapsed</h2>
        <p className="text-secondary-foreground mb-4">
          A panel that starts in the collapsed state using <code>defaultCollapsed</code>.
        </p>
        <div className="max-w-xl">
          <Panel headerText="Expand to see details" defaultCollapsed>
            <p className="text-sm text-secondary-foreground">
              This content was initially hidden. You expanded the panel to see it!
            </p>
          </Panel>
        </div>
      </section>

      {/* Fixed Panel */}
      <section id="fixed-panel" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Fixed Panel</h2>
        <p className="text-secondary-foreground mb-4">
          A non-collapsible panel. The toggle icon is hidden and the header is not interactive.
        </p>
        <div className="max-w-xl">
          <Panel headerText="Always Visible Content" fixed>
            <p className="text-sm text-secondary-foreground">
              This panel cannot be collapsed. The content is always visible.
            </p>
          </Panel>
        </div>
      </section>

      {/* No Animation */}
      <section id="no-animation" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">No Animation</h2>
        <p className="text-secondary-foreground mb-4">
          Expand/collapse without slide animation.
        </p>
        <div className="max-w-xl">
          <Panel headerText="Instant Toggle" noAnimation>
            <p className="text-sm text-secondary-foreground">
              This panel toggles instantly without any animation.
            </p>
          </Panel>
        </div>
      </section>

      {/* Controlled Collapsed */}
      <section id="controlled-state" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Controlled State</h2>
        <p className="text-secondary-foreground mb-4">
          The collapsed state is controlled externally. Toggle count: <strong>{toggleCount}</strong>
        </p>
        <div className="flex flex-col gap-4 max-w-xl">
          <div className="flex gap-2">
            <Button
              onClick={() => {
                setControlledCollapsed(!controlledCollapsed);
                setToggleCount((c) => c + 1);
              }}
            >
              {controlledCollapsed ? "Expand" : "Collapse"}
            </Button>
            <Button
              design="Tertiary"
              onClick={() => panelRef.current?.focus()}
            >
              Focus Header
            </Button>
          </div>
          <Panel
            ref={panelRef}
            headerText="Controlled Panel"
            collapsed={controlledCollapsed}
            onToggle={(detail) => {
              setControlledCollapsed(detail.collapsed);
              setToggleCount((c) => c + 1);
            }}
          >
            <p className="text-sm text-secondary-foreground">
              This panel's state is managed by the parent component.
              You can toggle it via the button above or by clicking the header.
            </p>
          </Panel>
        </div>
      </section>

      {/* Custom Header */}
      <section id="custom-header" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Custom Header</h2>
        <p className="text-secondary-foreground mb-4">
          The <code>header</code> prop accepts any ReactNode, overriding <code>headerText</code>.
        </p>
        <div className="max-w-xl">
          <Panel
            header={
              <div className="flex items-center justify-between w-full">
                <div>
                  <span className="font-semibold text-sm">Order #12345</span>
                  <span className="text-xs text-secondary-foreground ml-2">3 items</span>
                </div>
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-green-100 text-green-700">
                  Delivered
                </span>
              </div>
            }
          >
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-secondary-foreground">Widget A</span>
                <span>$29.99</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-foreground">Widget B</span>
                <span>$14.50</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-foreground">Widget C</span>
                <span>$7.00</span>
              </div>
              <div className="flex justify-between font-semibold border-t border-border pt-2">
                <span>Total</span>
                <span>$51.49</span>
              </div>
            </div>
          </Panel>
        </div>
      </section>

      {/* Sticky Header */}
      <section id="sticky-header" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Sticky Header</h2>
        <p className="text-secondary-foreground mb-4">
          The header stays visible at the top when scrolling content.
        </p>
        <div className="max-w-xl max-h-48 overflow-auto border border-border rounded-lg">
          <Panel headerText="Sticky Header Panel" stickyHeader>
            <div className="space-y-4">
              {Array.from({ length: 10 }, (_, i) => (
                <p key={i} className="text-sm text-secondary-foreground">
                  Paragraph {i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              ))}
            </div>
          </Panel>
        </div>
      </section>

      {/* Heading Levels */}
      <section id="heading-levels" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Heading Levels</h2>
        <p className="text-secondary-foreground mb-4">
          The <code>headerLevel</code> prop sets the semantic heading tag (h1–h4).
          Visual styling is the same, but screen readers see the correct heading level.
        </p>
        <div className="max-w-xl space-y-3">
          {(["H1", "H2", "H3", "H4"] as TitleLevel[]).map((level) => (
            <Panel
              key={level}
              headerText={`Panel with headerLevel="${level}"`}
              headerLevel={level}
              defaultCollapsed
            >
              <p className="text-sm text-secondary-foreground">
                This panel's header renders as an <code>&lt;{level.toLowerCase()}&gt;</code> element.
              </p>
            </Panel>
          ))}
        </div>
      </section>

      {/* Accessible Roles */}
      <section id="accessible-roles" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Accessible Roles</h2>
        <p className="text-secondary-foreground mb-4">
          The <code>accessibleRole</code> sets the ARIA landmark role on the panel root.
        </p>
        <div className="max-w-xl space-y-3">
          <Panel
            headerText="Form (default)"
            accessibleRole={PanelAccessibleRole.Form}
            defaultCollapsed
          >
            <p className="text-sm text-secondary-foreground">
              role="form" — a landmark region containing a form.
            </p>
          </Panel>
          <Panel
            headerText="Region"
            accessibleRole={PanelAccessibleRole.Region}
            defaultCollapsed
          >
            <p className="text-sm text-secondary-foreground">
              role="region" — a perceivable section of the page.
            </p>
          </Panel>
          <Panel
            headerText="Complementary"
            accessibleRole={PanelAccessibleRole.Complementary}
            defaultCollapsed
          >
            <p className="text-sm text-secondary-foreground">
              role="complementary" — content complementary to the main area.
            </p>
          </Panel>
        </div>
      </section>

      {/* Multiple Panels */}
      <section id="multiple-panels-accordion-like" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Multiple Panels (Accordion-like)</h2>
        <p className="text-secondary-foreground mb-4">
          Stack panels for an accordion-style layout. Each panel toggles independently.
        </p>
        <div className="max-w-xl space-y-2">
          <Panel headerText="Shipping Information" defaultCollapsed>
            <p className="text-sm text-secondary-foreground">
              Enter your shipping address and preferred delivery method.
            </p>
          </Panel>
          <Panel headerText="Payment Details" defaultCollapsed>
            <p className="text-sm text-secondary-foreground">
              Select a payment method and enter your billing information.
            </p>
          </Panel>
          <Panel headerText="Order Summary">
            <p className="text-sm text-secondary-foreground">
              Review your order before confirming the purchase.
            </p>
          </Panel>
        </div>
      </section>

      {/* Keyboard Shortcuts */}
      <section id="keyboard-handling" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-4">Keyboard Handling</h2>
        <p className="text-secondary-foreground mb-4">
          The panel header is focusable and supports the standard button keyboard pattern.
          Try focusing a panel header with Tab and using these keys:
        </p>
        <div className="max-w-xl">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-secondary-foreground">Toggle expand/collapse (immediate)</span>
              <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Enter</kbd>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-secondary-foreground">Toggle expand/collapse (fires on key release)</span>
              <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Space</kbd>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-secondary-foreground">Cancel pending Space toggle before releasing</span>
              <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Escape</kbd>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-secondary-foreground">Navigate between panels</span>
              <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Tab / Shift+Tab</kbd>
            </div>
          </div>
        </div>
        <p className="text-sm text-secondary-foreground mt-4">
          Space follows the standard button pattern: the action fires on key-up,
          allowing you to press Escape while Space is held to cancel the toggle.
        </p>
      </section>

      {/* API Reference */}
      <section id="api-reference" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-4">API Reference</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Panel Props</h3>
            <div className="bg-muted rounded-md p-4 text-sm font-mono overflow-auto">
              <pre>{`interface PanelProps {
  // Visual
  design?: PanelDesign;            // "Primary" | "Secondary" | "Child" (default: "Primary")

  // Content
  children?: ReactNode;            // Panel content (visible when expanded)
  headerText?: string;             // Header text (overridden by header slot)
  header?: ReactNode;              // Custom header content
  subtitle?: string;               // Subtitle below header title
  endSlot?: ReactNode;             // Right-aligned header content
  footer?: ReactNode;              // Footer below content (suppressed for Child)

  // Behavior
  fixed?: boolean;                 // Non-collapsible (default: false)
  collapsed?: boolean;             // Controlled collapsed state
  defaultCollapsed?: boolean;      // Initial collapsed state (default: false)
  noAnimation?: boolean;           // Disable slide animation (default: false)
  stickyHeader?: boolean;          // Sticky header on scroll (default: false)
  noPadding?: boolean;             // Remove content padding (default: false)

  // Accessibility
  accessibleRole?: PanelAccessibleRole; // "Form" | "Region" | "Complementary"
  headerLevel?: TitleLevel;        // "H1" - "H4" (default: "H2")
  accessibleName?: string;         // aria-label for the panel

  // Events
  onToggle?: (detail: PanelToggleEventDetail) => void;

  // Standard HTML
  className?: string;
  style?: CSSProperties;
  id?: string;
}`}</pre>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">PanelRef (Imperative Handle)</h3>
            <div className="bg-muted rounded-md p-4 text-sm font-mono overflow-auto">
              <pre>{`interface PanelRef {
  focus(): void;                   // Focus the panel header
  blur(): void;                    // Blur the panel header
  isFocused(): boolean;            // Check if header is focused
  readonly nativeElement: HTMLDivElement | null;
}`}</pre>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Enums</h3>
            <div className="bg-muted rounded-md p-4 text-sm font-mono overflow-auto">
              <pre>{`enum PanelDesign {
  Primary = "Primary",             // White bg, border (default)
  Secondary = "Secondary",         // Gray bg, border, tinted footer
  Child = "Child",                 // No border, compact header
}

enum PanelAccessibleRole {
  Complementary = "Complementary", // Complementary landmark
  Form = "Form",                   // Form landmark (default)
  Region = "Region",               // Region landmark
}

// TitleLevel is shared with the Title component
enum TitleLevel {
  H1 = "H1", H2 = "H2", H3 = "H3",
  H4 = "H4",
}`}</pre>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Usage Example</h3>
            <div className="bg-muted rounded-md p-4 text-sm font-mono overflow-auto">
              <pre>{`import { Panel, PanelAccessibleRole } from '@sap-ui/fx-components';
import { useState } from 'react';

function MyComponent() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Uncontrolled (manages its own state) */}
      <Panel headerText="Details" defaultCollapsed>
        <p>Content here...</p>
      </Panel>

      {/* Controlled */}
      <Panel
        headerText="Settings"
        collapsed={collapsed}
        onToggle={(detail) => setCollapsed(detail.collapsed)}
        accessibleRole={PanelAccessibleRole.Region}
        headerLevel="H3"
      >
        <p>Controlled content...</p>
      </Panel>

      {/* Custom header */}
      <Panel header={<div>Custom header content</div>}>
        <p>Panel with custom header...</p>
      </Panel>

      {/* Fixed (non-collapsible) */}
      <Panel headerText="Always Open" fixed>
        <p>This content is always visible.</p>
      </Panel>
    </>
  );
}`}</pre>
            </div>
          </div>
        </div>
      </section>

      {/* Usage Example */}
      <section id="usage-example" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-4">Usage Example</h2>
        <CodeBlock
          language="tsx"
          code={`import { useState } from "react";
import { Panel, PanelAccessibleRole } from "@sap-ui/fx-components";

function MyComponent() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div>
      {/* Uncontrolled - manages its own state */}
      <Panel headerText="Details" defaultCollapsed>
        <p>Content here...</p>
      </Panel>

      {/* Controlled collapsed state */}
      <Panel
        headerText="Settings"
        collapsed={collapsed}
        onToggle={(detail) => setCollapsed(detail.collapsed)}
        accessibleRole={PanelAccessibleRole.Region}
        headerLevel="H3"
      >
        <p>Controlled content...</p>
      </Panel>

      {/* Fixed (non-collapsible) */}
      <Panel headerText="Always Open" fixed>
        <p>This content is always visible.</p>
      </Panel>

      {/* Custom header */}
      <Panel header={<div>Custom header content</div>}>
        <p>Panel with custom header...</p>
      </Panel>
    </div>
  );
}`}
        />
      </section>
    </div>
  );
}

export default PanelPage;
