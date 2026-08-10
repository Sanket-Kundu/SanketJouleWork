import { useState } from "react";
import {
  BusyIndicator,
  BusyIndicatorSize,
  Button,
  Switch,
} from "@sap-ui/fx-components";
import { CodeBlock } from "./components/CodeBlock";

export function BusyIndicatorPage() {
  const [overlayActive, setOverlayActive] = useState(true);
  const [delayActive, setDelayActive] = useState(false);
  const [toggleActive, setToggleActive] = useState(false);

  return (
    <div className="space-y-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">BusyIndicator</h1>
        <code className="text-sm text-primary/70 font-mono">{'import { BusyIndicator } from "@sap-ui/fx-components"'}</code>
      </header>

      {/* Basic */}
      <section id="basic" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Basic</h2>
        <p className="text-secondary-foreground mb-4">
          Default and Joule variants side by side.
        </p>
        <div className="flex items-center gap-12">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-secondary-foreground">Default</span>
            <BusyIndicator active delay={0} size="M" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-secondary-foreground">Joule</span>
            <BusyIndicator active delay={0} size="M" joule />
          </div>
        </div>
      </section>

      {/* Standalone — All Sizes */}
      <section id="sizes" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Sizes</h2>
        <p className="text-secondary-foreground mb-4">
          Small, Medium, and Large busy indicators in both default and Joule variants.
        </p>
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-secondary-foreground">Small</span>
            <BusyIndicator active delay={0} size="S" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-secondary-foreground">Medium</span>
            <BusyIndicator active delay={0} size="M" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-secondary-foreground">Large</span>
            <BusyIndicator active delay={0} size="L" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-secondary-foreground">Small (Joule)</span>
            <BusyIndicator active delay={0} size="S" joule />
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-secondary-foreground">Medium (Joule)</span>
            <BusyIndicator active delay={0} size="M" joule />
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-secondary-foreground">Large (Joule)</span>
            <BusyIndicator active delay={0} size="L" joule />
          </div>
        </div>
      </section>

      {/* With Text */}
      <section id="with-text" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">With Text</h2>
        <p className="text-secondary-foreground mb-4">
          Text label can appear above or below the animated dots.
        </p>
        <div className="flex items-start gap-12">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-secondary-foreground">Bottom (default)</span>
            <BusyIndicator
              active
              delay={0}
              size="M"
              text="Loading..."
              textPlacement="Bottom"
            />
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-secondary-foreground">Top</span>
            <BusyIndicator
              active
              delay={0}
              size="M"
              text="Please wait"
              textPlacement="Top"
            />
          </div>
        </div>
      </section>

      {/* Over Content */}
      <section id="over-content" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Over Content</h2>
        <p className="text-secondary-foreground mb-4">
          When wrapping children, the busy indicator dims the content and
          displays an overlay. Toggle the indicator on and off.
        </p>
        <div className="flex items-start gap-4">
          <Button
            design="Primary"
            onClick={() => setOverlayActive((v) => !v)}
          >
            {overlayActive ? "Deactivate" : "Activate"}
          </Button>
        </div>
        <div className="mt-4">
          <BusyIndicator active={overlayActive} delay={0} size="M" text="Loading data...">
            <div className="p-6 border border-border rounded-lg bg-background space-y-3">
              <h3 className="font-semibold">Product Details</h3>
              <p className="text-sm text-secondary-foreground">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <div className="flex gap-2">
                <Button>Action 1</Button>
                <Button design="Tertiary">Action 2</Button>
              </div>
            </div>
          </BusyIndicator>
        </div>
      </section>

      {/* Delay Demo */}
      <section id="delay-behavior" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Delay Behavior</h2>
        <p className="text-secondary-foreground mb-4">
          The busy indicator only appears after a 2-second delay. Click
          &quot;Start Loading&quot; and observe the delay before the dots appear.
        </p>
        <div className="flex items-start gap-4">
          <Button
            design="Primary"
            onClick={() => setDelayActive((v) => !v)}
          >
            {delayActive ? "Stop Loading" : "Start Loading"}
          </Button>
        </div>
        <div className="mt-4">
          <BusyIndicator active={delayActive} delay={2000} size="M" text="Loading with 2s delay...">
            <div className="p-6 border border-border rounded-lg bg-background">
              <p className="text-sm">
                This content will be covered after the 2-second delay elapses.
              </p>
            </div>
          </BusyIndicator>
        </div>
      </section>

      {/* Interactive Toggle */}
      <section id="interactive-toggle" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Interactive Toggle</h2>
        <p className="text-secondary-foreground mb-4">
          Toggle the busy state with no delay to see instant activation.
        </p>
        <div className="flex items-center gap-3">
          <Switch
            checked={toggleActive}
            onChange={(detail) => setToggleActive(detail.checked)}
            accessibleName="Toggle busy state"
          />
          <span className="text-sm">{toggleActive ? "Active" : "Inactive"}</span>
        </div>
        <div className="mt-4 flex items-center gap-8">
          {Object.values(BusyIndicatorSize).map((s) => (
            <BusyIndicator key={s} active={toggleActive} delay={0} size={s} />
          ))}
        </div>
      </section>

      {/* Usage Example */}
      <section id="usage-example" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-4">Usage Example</h2>
        <CodeBlock
          language="tsx"
          code={`import { BusyIndicator } from "@sap-ui/fx-components";

// Standalone spinner (no content)
<BusyIndicator active size="M" delay={0} />

// With text label
<BusyIndicator active size="L" text="Loading..." textPlacement="Bottom" />

// Wrapping content with overlay
<BusyIndicator active={isLoading} delay={1000} size="M" text="Loading data...">
  <div>
    <h3>Product Details</h3>
    <p>Content is dimmed while loading.</p>
  </div>
</BusyIndicator>

// Different sizes: "S", "M", "L"
<BusyIndicator active size="S" delay={0} />
<BusyIndicator active size="M" delay={0} />
<BusyIndicator active size="L" delay={0} />`}
        />
      </section>
    </div>
  );
}
