import { useState } from "react";
import {
  Breadcrumbs,
  BreadcrumbsItem,
  BreadcrumbsDesign,
  BreadcrumbsSeparator,
  BreadcrumbsItemClickEventDetail,
} from "@sap-ui/fx-components";
import { CodeBlock } from "./components/CodeBlock";

export function BreadcrumbsPage() {
  const [lastClicked, setLastClicked] = useState<string>("(none)");

  const handleItemClick = (detail: BreadcrumbsItemClickEventDetail) => {
    const text =
      typeof detail.item.children === "string"
        ? detail.item.children
        : `Item #${detail.index}`;
    setLastClicked(
      `${text} (index: ${detail.index}, href: ${detail.item.href ?? "none"})`
    );
    // Prevent default navigation for demo purposes
    detail.originalEvent.preventDefault();
  };

  return (
    <div className="space-y-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Breadcrumbs</h1>
        <code className="text-sm text-primary/70 font-mono">{'import { Breadcrumbs, BreadcrumbsItem } from "@sap-ui/fx-components"'}</code>
      </header>

      {/* ─── Figma Sample ────────────────────────────────────────── */}
      <section id="figma-sample" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Figma Sample</h2>
        <p className="text-secondary-foreground mb-4">
          Mix of link items (blue accent) and a non-link current page (foreground text).
          Matches the Sapphire Theme Figma spec.
        </p>
        <Breadcrumbs onItemClick={handleItemClick}>
          <BreadcrumbsItem href="/level-01">Level 01</BreadcrumbsItem>
          <BreadcrumbsItem href="/level-02">Level 02</BreadcrumbsItem>
          <BreadcrumbsItem>Level 03</BreadcrumbsItem>
        </Breadcrumbs>
      </section>

      {/* ─── Basic ────────────────────────────────────────────────── */}
      <section id="basic-breadcrumbs" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Basic Breadcrumbs</h2>
        <p className="text-secondary-foreground mb-4">
          Default <code>Standard</code> design: the last item is rendered as
          non-interactive current-page text.
        </p>
        <Breadcrumbs onItemClick={handleItemClick}>
          <BreadcrumbsItem href="/">Home</BreadcrumbsItem>
          <BreadcrumbsItem href="/products">Products</BreadcrumbsItem>
          <BreadcrumbsItem href="/products/shoes">Shoes</BreadcrumbsItem>
          <BreadcrumbsItem>Running Shoes</BreadcrumbsItem>
        </Breadcrumbs>
        <div className="mt-4 p-3 bg-muted rounded-md text-sm font-mono">
          Last clicked: {lastClicked}
        </div>
      </section>

      {/* ─── Standard design with href on last item ───────────────── */}
      <section className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">
          Standard Design — Last Item with href
        </h2>
        <p className="text-secondary-foreground mb-4">
          When the last item has an <code>href</code>, it's rendered as an
          emphasized link with <code>aria-current="page"</code>.
        </p>
        <Breadcrumbs onItemClick={handleItemClick}>
          <BreadcrumbsItem href="/">Home</BreadcrumbsItem>
          <BreadcrumbsItem href="/dashboard">Dashboard</BreadcrumbsItem>
          <BreadcrumbsItem href="/dashboard/analytics">Analytics</BreadcrumbsItem>
        </Breadcrumbs>
      </section>

      {/* ─── NoCurrentPage design ─────────────────────────────────── */}
      <section id="nocurrentpage-design" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">NoCurrentPage Design</h2>
        <p className="text-secondary-foreground mb-4">
          All items are rendered as regular links with separators. No special
          last-item treatment.
        </p>
        <Breadcrumbs design={BreadcrumbsDesign.NoCurrentPage} onItemClick={handleItemClick}>
          <BreadcrumbsItem href="/">Home</BreadcrumbsItem>
          <BreadcrumbsItem href="/settings">Settings</BreadcrumbsItem>
          <BreadcrumbsItem href="/settings/profile">Profile</BreadcrumbsItem>
          <BreadcrumbsItem href="/settings/profile/edit">Edit</BreadcrumbsItem>
        </Breadcrumbs>
      </section>

      {/* ─── Separator styles ─────────────────────────────────────── */}
      <section id="separator-styles" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Separator Styles</h2>
        <p className="text-secondary-foreground mb-4">
          Six separator styles are available.
        </p>
        <div className="space-y-4">
          {Object.values(BreadcrumbsSeparator).map((sep) => (
            <div key={sep}>
              <span className="text-xs font-medium text-secondary-foreground uppercase tracking-wider mb-1 block">
                {sep}
              </span>
              <Breadcrumbs separators={sep}>
                <BreadcrumbsItem href="/">Home</BreadcrumbsItem>
                <BreadcrumbsItem href="/docs">Docs</BreadcrumbsItem>
                <BreadcrumbsItem href="/docs/api">API</BreadcrumbsItem>
                <BreadcrumbsItem>Breadcrumbs</BreadcrumbsItem>
              </Breadcrumbs>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Overflow ─────────────────────────────────────────────── */}
      <section id="responsive-overflow" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Responsive Overflow</h2>
        <p className="text-secondary-foreground mb-4">
          Resize the container to see items collapse into a dropdown. Items
          overflow from the left; the last item always stays visible. Use{" "}
          <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">
            F4
          </kbd>{" "}
          or{" "}
          <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">
            Alt+↓
          </kbd>{" "}
          to open the overflow dropdown.
        </p>

        <div className="space-y-6">
          <div>
            <span className="text-xs font-medium text-secondary-foreground mb-1 block">
              Full width
            </span>
            <Breadcrumbs onItemClick={handleItemClick}>
              <BreadcrumbsItem href="/">Home</BreadcrumbsItem>
              <BreadcrumbsItem href="/workspace">Workspace</BreadcrumbsItem>
              <BreadcrumbsItem href="/workspace/projects">Projects</BreadcrumbsItem>
              <BreadcrumbsItem href="/workspace/projects/alpha">Project Alpha</BreadcrumbsItem>
              <BreadcrumbsItem href="/workspace/projects/alpha/tasks">Tasks</BreadcrumbsItem>
              <BreadcrumbsItem href="/workspace/projects/alpha/tasks/123">Task #123</BreadcrumbsItem>
              <BreadcrumbsItem>Subtask Details</BreadcrumbsItem>
            </Breadcrumbs>
          </div>

          <div>
            <span className="text-xs font-medium text-secondary-foreground mb-1 block">
              400px container
            </span>
            <div className="w-[400px] border-2 border-dashed border-border rounded-lg p-3">
              <Breadcrumbs onItemClick={handleItemClick}>
                <BreadcrumbsItem href="/">Home</BreadcrumbsItem>
                <BreadcrumbsItem href="/workspace">Workspace</BreadcrumbsItem>
                <BreadcrumbsItem href="/workspace/projects">Projects</BreadcrumbsItem>
                <BreadcrumbsItem href="/workspace/projects/alpha">Project Alpha</BreadcrumbsItem>
                <BreadcrumbsItem href="/workspace/projects/alpha/tasks">Tasks</BreadcrumbsItem>
                <BreadcrumbsItem href="/workspace/projects/alpha/tasks/123">Task #123</BreadcrumbsItem>
                <BreadcrumbsItem>Subtask Details</BreadcrumbsItem>
              </Breadcrumbs>
            </div>
          </div>

          <div>
            <span className="text-xs font-medium text-secondary-foreground mb-1 block">
              250px container (heavy overflow)
            </span>
            <div className="w-[250px] border-2 border-dashed border-border rounded-lg p-3">
              <Breadcrumbs onItemClick={handleItemClick}>
                <BreadcrumbsItem href="/">Home</BreadcrumbsItem>
                <BreadcrumbsItem href="/workspace">Workspace</BreadcrumbsItem>
                <BreadcrumbsItem href="/workspace/projects">Projects</BreadcrumbsItem>
                <BreadcrumbsItem href="/workspace/projects/alpha">Project Alpha</BreadcrumbsItem>
                <BreadcrumbsItem href="/workspace/projects/alpha/tasks">Tasks</BreadcrumbsItem>
                <BreadcrumbsItem>Subtask Details</BreadcrumbsItem>
              </Breadcrumbs>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Accessibility info ───────────────────────────────────── */}
      <section className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">
          Accessibility & Custom Accessible Names
        </h2>
        <p className="text-secondary-foreground mb-4">
          Each item gets a positional label (e.g.{" "}
          <code>"Products 2 of 4"</code>) for screen readers. Custom{" "}
          <code>accessibleName</code> is appended.
        </p>
        <Breadcrumbs accessibleName="Application navigation" onItemClick={handleItemClick}>
          <BreadcrumbsItem href="/" accessibleName="Main page">
            Home
          </BreadcrumbsItem>
          <BreadcrumbsItem href="/spaces" accessibleName="All spaces">
            Spaces
          </BreadcrumbsItem>
          <BreadcrumbsItem
            href="/spaces/12345"
            accessibleName="Return Order 13034557"
          >
            Return Order
          </BreadcrumbsItem>
          <BreadcrumbsItem>BikePros</BreadcrumbsItem>
        </Breadcrumbs>
      </section>

      {/* ─── Keyboard Shortcuts ───────────────────────────────────── */}
      <section id="keyboard-shortcuts" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-4">Keyboard Shortcuts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-3">Trail Navigation</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-secondary-foreground">Move focus left/right</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">← →</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-foreground">First / Last item</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Home / End</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-foreground">Activate link</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Enter</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-foreground">Activate current page label</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Enter / Space</kbd>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Overflow Dropdown</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-secondary-foreground">Open / close overflow</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">F4 / Alt+↓↑</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-foreground">Also opens overflow</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Space</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-foreground">Navigate items in dropdown</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">↑ ↓</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-foreground">Select item</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Enter / Space</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-foreground">Close dropdown</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Escape</kbd>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Link targets ─────────────────────────────────────────── */}
      <section id="link-targets" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Link Targets</h2>
        <p className="text-secondary-foreground mb-4">
          Items can specify <code>target</code> for external links. Links with{" "}
          <code>target="_blank"</code> automatically get{" "}
          <code>rel="noopener noreferrer"</code>.
        </p>
        <Breadcrumbs onItemClick={handleItemClick}>
          <BreadcrumbsItem href="/" target="_self">
            Home
          </BreadcrumbsItem>
          <BreadcrumbsItem href="https://github.com" target="_blank">
            GitHub (new tab)
          </BreadcrumbsItem>
          <BreadcrumbsItem>Current Page</BreadcrumbsItem>
        </Breadcrumbs>
      </section>

      {/* ─── Single item ──────────────────────────────────────────── */}
      <section id="edge-cases" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Edge Cases</h2>
        <div className="space-y-4">
          <div>
            <span className="text-xs font-medium text-secondary-foreground mb-1 block">
              Single item (no overflow, no separator)
            </span>
            <Breadcrumbs>
              <BreadcrumbsItem>Home</BreadcrumbsItem>
            </Breadcrumbs>
          </div>
          <div>
            <span className="text-xs font-medium text-secondary-foreground mb-1 block">
              Two items
            </span>
            <Breadcrumbs>
              <BreadcrumbsItem href="/">Home</BreadcrumbsItem>
              <BreadcrumbsItem>Products</BreadcrumbsItem>
            </Breadcrumbs>
          </div>
          <div>
            <span className="text-xs font-medium text-secondary-foreground mb-1 block">
              Empty breadcrumbs
            </span>
            <Breadcrumbs />
          </div>
          <div>
            <span className="text-xs font-medium text-secondary-foreground mb-1 block">
              Long current page label truncates (300px container)
            </span>
            <div className="w-[300px] border-2 border-dashed border-border rounded-lg p-3">
              <Breadcrumbs>
                <BreadcrumbsItem href="/">Home</BreadcrumbsItem>
                <BreadcrumbsItem href="/workspace">Workspace</BreadcrumbsItem>
                <BreadcrumbsItem href="/workspace/projects">Projects</BreadcrumbsItem>
                <BreadcrumbsItem>This is a very long current page label that should be truncated</BreadcrumbsItem>
              </Breadcrumbs>
            </div>
          </div>
        </div>
      </section>

      {/* Usage Example */}
      <section id="usage-example" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-4">Usage Example</h2>
        <CodeBlock
          language="tsx"
          code={`import { Breadcrumbs, BreadcrumbsItem } from "@sap-ui/fx-components";

// Basic breadcrumbs with click handler
<Breadcrumbs onItemClick={(detail) => console.log(detail)}>
  <BreadcrumbsItem href="/">Home</BreadcrumbsItem>
  <BreadcrumbsItem href="/products">Products</BreadcrumbsItem>
  <BreadcrumbsItem href="/products/shoes">Shoes</BreadcrumbsItem>
  <BreadcrumbsItem>Running Shoes</BreadcrumbsItem>
</Breadcrumbs>

// NoCurrentPage design (all items are links)
<Breadcrumbs design="NoCurrentPage">
  <BreadcrumbsItem href="/">Home</BreadcrumbsItem>
  <BreadcrumbsItem href="/settings">Settings</BreadcrumbsItem>
  <BreadcrumbsItem href="/settings/profile">Profile</BreadcrumbsItem>
</Breadcrumbs>

// Custom separator style
<Breadcrumbs separators="DoubleGreaterThan">
  <BreadcrumbsItem href="/">Home</BreadcrumbsItem>
  <BreadcrumbsItem href="/docs">Docs</BreadcrumbsItem>
  <BreadcrumbsItem>API</BreadcrumbsItem>
</Breadcrumbs>`}
        />
      </section>
    </div>
  );
}
