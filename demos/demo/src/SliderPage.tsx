import { useState } from "react";
import { Slider } from "@sap-ui/fx-components";
import { CodeBlock } from "./components/CodeBlock";

function ValueBadge({ value, label }: { value: number | string; label?: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-sapphire-neutral-pressed-background-2 border border-sapphire-border-secondary text-sm font-mono text-sapphire-text-primary">
      {label && <span className="text-sapphire-text-tertiary font-sans text-xs">{label}</span>}
      <span className="font-semibold">{value}</span>
    </div>
  );
}

export function SliderPage() {
  const [basicValue, setBasicValue] = useState(30);
  const [tooltipValue, setTooltipValue] = useState(60);
  const [tickValue, setTickValue] = useState(40);
  const [textValue, setTextValue] = useState(1);
  const [rangeValue, setRangeValue] = useState(25);
  const [controlledValue, setControlledValue] = useState(40);
  const [inputValue, setInputValue] = useState(50);

  const textLabels = ["Small", "Medium", "Large"];

  return (
    <div className="space-y-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Slider</h1>
        <div className="px-4 py-3 rounded-lg bg-sapphire-warning-bg text-sapphire-text-primary text-sm mb-3">
          <strong>Experimental</strong> — This component is not production-ready. Use at your own risk.
        </div>
        <code className="text-sm text-primary/70 font-mono">
          {'import { Slider } from "@sap-ui/fx-components"'}
        </code>
      </header>

      {/* Basic */}
      <section id="basic" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-lg font-semibold mb-4">Basic</h2>
        <p className="text-secondary-foreground mb-4">Default slider with min 0, max 100, step 1.</p>
        <div className="max-w-lg space-y-3">
          <Slider value={basicValue} onInput={({ value }) => setBasicValue(value)} />
          <ValueBadge value={basicValue} label="Value" />
        </div>
      </section>

      {/* With Tooltip */}
      <section id="with-tooltip" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-lg font-semibold mb-4">With Tooltip</h2>
        <p className="text-secondary-foreground mb-4">Shows the current value above the handle when pressed or hovered.</p>
        <div className="max-w-lg space-y-3">
          <Slider showTooltip value={tooltipValue} onInput={({ value }) => setTooltipValue(value)} />
          <ValueBadge value={tooltipValue} label="Value" />
        </div>
      </section>

      {/* Tickmarks with Numeric Labels */}
      <section id="tickmarks-amp-numeric-labels" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-lg font-semibold mb-4">Tickmarks &amp; Numeric Labels</h2>
        <p className="text-secondary-foreground mb-4">Tickmarks with labels every 10 steps.</p>
        <div className="max-w-lg space-y-3">
          <Slider
            showTickmarks
            showTooltip
            step={10}
            labelInterval={1}
            value={tickValue}
            onInput={({ value }) => setTickValue(value)}
          />
          <ValueBadge value={tickValue} label="Value" />
        </div>
      </section>

      {/* Text Labels */}
      <section id="text-labels" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-lg font-semibold mb-4">Text Labels</h2>
        <p className="text-secondary-foreground mb-4">Custom text labels instead of numbers.</p>
        <div className="max-w-lg space-y-3">
          <Slider
            showTickmarks
            min={0}
            max={2}
            step={1}
            labels={textLabels}
            value={textValue}
            onInput={({ value }) => setTextValue(value)}
          />
          <ValueBadge value={textLabels[textValue] ?? textValue} label="Selection" />
        </div>
      </section>

      {/* Custom Range & Step */}
      <section id="custom-range-amp-step" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-lg font-semibold mb-4">Custom Range &amp; Step</h2>
        <p className="text-secondary-foreground mb-4">Min 0, max 50, step 5 with tickmarks and labels.</p>
        <div className="max-w-lg space-y-3">
          <Slider
            min={0}
            max={50}
            step={5}
            showTickmarks
            showTooltip
            labelInterval={1}
            value={rangeValue}
            onInput={({ value }) => setRangeValue(value)}
          />
          <ValueBadge value={rangeValue} label="Value" />
        </div>
      </section>

      {/* Disabled */}
      <section id="disabled" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-lg font-semibold mb-4">Disabled</h2>
        <p className="text-secondary-foreground mb-4">Slider in disabled state.</p>
        <div className="max-w-lg">
          <Slider disabled defaultValue={30} />
        </div>
      </section>

      {/* Controlled */}
      <section id="controlled" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-lg font-semibold mb-4">Controlled</h2>
        <p className="text-secondary-foreground mb-4">Value bound to React state.</p>
        <div className="max-w-lg space-y-3">
          <Slider
            value={controlledValue}
            showTooltip
            showTickmarks
            step={10}
            labelInterval={1}
            onInput={({ value }) => setControlledValue(value)}
          />
          <ValueBadge value={controlledValue} label="Value" />
        </div>
      </section>

      {/* onInput vs onChange */}
      <section id="events-oninput-vs-onchange" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-lg font-semibold mb-4">Events: onInput vs onChange</h2>
        <p className="text-secondary-foreground mb-4">
          <code>onInput</code> fires during drag, <code>onChange</code> fires on release.
        </p>
        <div className="max-w-lg space-y-3">
          <Slider
            value={inputValue}
            showTooltip
            onInput={({ value }) => setInputValue(value)}
            onChange={({ value }) => console.log("onChange:", value)}
          />
          <ValueBadge value={inputValue} label="Value" />
        </div>
      </section>

      {/* Usage Example */}
      <section id="usage-example" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-4">Usage Example</h2>
        <CodeBlock
          language="tsx"
          code={`import { Slider } from "@sap-ui/fx-components";

function App() {
  const [value, setValue] = useState(50);

  return (
    <Slider
      value={value}
      showTooltip
      showTickmarks
      step={10}
      labelInterval={1}
      onInput={({ value }) => setValue(value)}
      onChange={({ value }) => console.log("Final:", value)}
    />
  );
}`}
        />
      </section>
    </div>
  );
}

export default SliderPage;
