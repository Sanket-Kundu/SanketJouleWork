import { useState } from "react";
import { ProgressIndicator } from "@sap-ui/fx-components";
import { CodeBlock } from "./components/CodeBlock";

export function ProgressIndicatorPage() {
  const [interactiveValue, setInteractiveValue] = useState(45);

  return (
    <div className="space-y-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">ProgressIndicator</h1>
        <code className="text-sm text-primary/70 font-mono">
          {'import { ProgressIndicator } from "@sap-ui/fx-components"'}
        </code>
      </header>

      {/* ================================================================
          Figma Spec — All States
          ================================================================ */}
      <section id="design-spec">
        <h2 className="text-2xl font-semibold mb-6">Design Spec</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-lg overflow-hidden border border-border">
          {/* Regular column */}
          <div className="bg-background p-10">
            <p className="text-sm font-medium text-foreground mb-6">Regular</p>
            <div className="flex flex-col gap-6 max-w-xs">
              <ProgressIndicator value={60} accessibleName="Progress" />
              <ProgressIndicator value={60} valueState="Information" accessibleName="Information progress" />
              <ProgressIndicator value={60} valueState="Positive" accessibleName="Positive progress" />
              <ProgressIndicator value={60} valueState="Critical" accessibleName="Critical progress" />
              <ProgressIndicator value={60} valueState="Negative" accessibleName="Negative progress" />
            </div>
          </div>

          {/* Disabled column */}
          <div className="bg-background p-10">
            <p className="text-sm font-medium text-foreground mb-6">Disabled</p>
            <div className="flex flex-col gap-6 max-w-xs">
              <ProgressIndicator value={60} disabled accessibleName="Disabled progress" />
              <ProgressIndicator value={60} valueState="Information" disabled accessibleName="Disabled information progress" />
              <ProgressIndicator value={60} valueState="Positive" disabled accessibleName="Disabled positive progress" />
              <ProgressIndicator value={60} valueState="Critical" disabled accessibleName="Disabled critical progress" />
              <ProgressIndicator value={60} valueState="Negative" disabled accessibleName="Disabled negative progress" />
            </div>
          </div>
        </div>
      </section>

      {/* Basic Sample — matches UI5 docs */}
      <section id="basic-sample" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-lg font-semibold mb-4">Basic Sample</h2>
        <div className="flex flex-col gap-4 max-w-lg">
          <ProgressIndicator value={25} accessibleName="Basic progress" />
        </div>
      </section>

      {/* Display Value — matches UI5 docs */}
      <section id="display-value" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-lg font-semibold mb-4">Display Value</h2>
        <p className="text-secondary-foreground mb-4">
          Use the <code>displayValue</code> property to define an alternative of the value, that is actually displayed.
        </p>
        <div className="flex flex-col gap-4 max-w-lg">
          <ProgressIndicator value={25} displayValue="1/4" accessibleName="Task progress" />
        </div>
      </section>

      {/* States — matches UI5 docs: same values and states */}
      <section id="states" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-lg font-semibold mb-4">States</h2>
        <p className="text-secondary-foreground mb-4">
          ProgressIndicator supports several semantic value states.
        </p>
        <div className="flex flex-col gap-4 max-w-lg">
          <ProgressIndicator value={25} valueState="Positive" accessibleName="Positive state progress" />
          <ProgressIndicator value={45} valueState="Information" accessibleName="Information state progress" />
          <ProgressIndicator value={15} valueState="Critical" accessibleName="Critical state progress" />
          <ProgressIndicator value={65} valueState="Negative" accessibleName="Negative state progress" />
        </div>
      </section>

      {/* Hidden Value */}
      <section id="hidden-value" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-lg font-semibold mb-4">Hidden Value</h2>
        <p className="text-secondary-foreground mb-4">
          Progress bar without any text label.
        </p>
        <div className="flex flex-col gap-4 max-w-lg">
          <ProgressIndicator value={40} hideValue accessibleName="Progress without label" />
          <ProgressIndicator value={70} hideValue valueState="Positive" accessibleName="Positive progress without label" />
        </div>
      </section>

      {/* Accessible Name */}
      <section id="accessible-name" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-lg font-semibold mb-4">Accessible Name</h2>
        <p className="text-secondary-foreground mb-4">
          Use <code>accessibleName</code> for aria-label or <code>accessibleNameRef</code> to reference an external label via aria-labelledby.
        </p>
        <div className="flex flex-col gap-4 max-w-lg">
          <ProgressIndicator value={60} accessibleName="File upload progress" />
          <div>
            <p id="download-label" className="text-sm font-medium mb-2">Download Progress</p>
            <ProgressIndicator value={35} accessibleNameRef="download-label" />
          </div>
        </div>
      </section>

      {/* Interactive */}
      <section id="interactive" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-lg font-semibold mb-4">Interactive</h2>
        <p className="text-secondary-foreground mb-4">
          Use the slider to change the value and see the animation.
        </p>
        <div className="max-w-lg space-y-4">
          <input
            type="range"
            min={0}
            max={100}
            value={interactiveValue}
            onChange={(e) => setInteractiveValue(Number(e.target.value))}
            className="w-full"
          />
          <ProgressIndicator
            value={interactiveValue}
            accessibleName="Interactive progress indicator"
            valueState={
              interactiveValue >= 80
                ? "Positive"
                : interactiveValue >= 50
                  ? "Information"
                  : interactiveValue >= 30
                    ? "Critical"
                    : "Negative"
            }
          />
          <p className="text-sm text-secondary-foreground">
            Current value: <strong>{interactiveValue}%</strong>
          </p>
        </div>
      </section>

      {/* Usage Example */}
      <section id="usage-example" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-4">Usage Example</h2>
        <CodeBlock
          language="tsx"
          code={`import { ProgressIndicator } from "@sap-ui/fx-components";

// Basic
<ProgressIndicator value={25} />

// Display value
<ProgressIndicator value={25} displayValue="1/4" />

// States
<ProgressIndicator value={25} valueState="Positive" />
<ProgressIndicator value={45} valueState="Information" />
<ProgressIndicator value={15} valueState="Critical" />
<ProgressIndicator value={65} valueState="Negative" />

// Hidden value
<ProgressIndicator value={40} hideValue />

// Accessible name
<ProgressIndicator value={60} accessibleName="File upload progress" />

// Reference external label
<p id="download-label">Download Progress</p>
<ProgressIndicator value={35} accessibleNameRef="download-label" />`}
        />
      </section>
    </div>
  );
}

export default ProgressIndicatorPage;
