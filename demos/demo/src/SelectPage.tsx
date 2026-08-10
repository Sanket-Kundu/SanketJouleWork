import { useState } from 'react';
import {
  Select,
  Option,
  OptionCustom,
  ValueState,
  TextSeparator,
  SelectSize,
  Button,
  Label,
} from '@sap-ui/fx-components';
import { CodeBlock } from "./components/CodeBlock";

const sizes = [
  { value: 'xs', label: 'Extra Small', price: '$9' },
  { value: 'sm', label: 'Small', price: '$19' },
  { value: 'md', label: 'Medium', price: '$29' },
  { value: 'lg', label: 'Large', price: '$49' },
  { value: 'xl', label: 'Extra Large', price: '$79' },
];

const priorities = [
  { value: 'low', label: 'Low', icon: '🟢' },
  { value: 'medium', label: 'Medium', icon: '🟡' },
  { value: 'high', label: 'High', icon: '🟠' },
  { value: 'critical', label: 'Critical', icon: '🔴' },
];

const colors = [
  { value: 'red', label: 'Red', hex: '#ef4444' },
  { value: 'orange', label: 'Orange', hex: '#f97316' },
  { value: 'yellow', label: 'Yellow', hex: '#eab308' },
  { value: 'green', label: 'Green', hex: '#22c55e' },
  { value: 'blue', label: 'Blue', hex: '#3b82f6' },
  { value: 'purple', label: 'Purple', hex: '#a855f7' },
  { value: 'pink', label: 'Pink', hex: '#ec4899' },
];

function SelectPage() {
  const [basicValue, setBasicValue] = useState('md');
  const [priorityValue, setPriorityValue] = useState('medium');
  const [colorValue, setColorValue] = useState('blue');
  const [valueStateValue, setValueStateValue] = useState('');
  const [valueState, setValueState] = useState<ValueState>(ValueState.None);
  const [separatorValue] = useState('md');
  const [separator, setSeparator] = useState<TextSeparator>(TextSeparator.Dash);
  const [liveValue, setLiveValue] = useState('md');
  const [previewValue, setPreviewValue] = useState<string | null>(null);

  return (
    <div className="space-y-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Select</h1>
        <code className="text-sm text-primary/70 font-mono">{'import { Select, Option } from "@sap-ui/fx-components"'}</code>
      </header>

      {/* Basic Select */}
      <section id="basic-select" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Basic Select</h2>
        <div className="max-w-md space-y-4">
          <Select>
            {sizes.map((s) => <Option key={s.value} value={s.value}>{s.label}</Option>)}
          </Select>
          <Select size={SelectSize.Medium}>
            {sizes.map((s) => <Option key={s.value} value={s.value}>{s.label}</Option>)}
          </Select>
        </div>
      </section>

      {/* States Matrix */}
      <section id="states-matrix" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-6">States Matrix</h2>

        {/* Large — 40px */}
        <div className="mb-10">
          <h3 className="text-lg font-bold mb-6">Large — 40px</h3>
          <div className="flex flex-wrap gap-8">
            <div className="w-[200px] min-w-[180px]">
              <span className="font-medium text-sm text-secondary-foreground">Regular</span>
              <div className="mt-4 space-y-3">
                <Select>
                  {sizes.map((s) => <Option key={s.value} value={s.value}>{s.label}</Option>)}
                </Select>
              </div>
            </div>
            <div className="w-[200px] min-w-[180px]">
              <span className="font-medium text-sm text-secondary-foreground">Disabled</span>
              <div className="mt-4 space-y-3">
                <Select disabled>
                  {sizes.map((s) => <Option key={s.value} value={s.value}>{s.label}</Option>)}
                </Select>
              </div>
            </div>
            <div className="w-[200px] min-w-[180px]">
              <span className="font-medium text-sm text-secondary-foreground">Read only</span>
              <div className="mt-4 space-y-3">
                <Select readonly>
                  {sizes.map((s) => <Option key={s.value} value={s.value}>{s.label}</Option>)}
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Medium — 32px */}
        <div className="mb-10">
          <h3 className="text-lg font-bold mb-6">Medium — 32px</h3>
          <div className="flex flex-wrap gap-8">
            <div className="w-[200px] min-w-[180px]">
              <span className="font-medium text-sm text-secondary-foreground">Regular</span>
              <div className="mt-4 space-y-3">
                <Select size={SelectSize.Medium}>
                  {sizes.map((s) => <Option key={s.value} value={s.value}>{s.label}</Option>)}
                </Select>
              </div>
            </div>
            <div className="w-[200px] min-w-[180px]">
              <span className="font-medium text-sm text-secondary-foreground">Disabled</span>
              <div className="mt-4 space-y-3">
                <Select size={SelectSize.Medium} disabled>
                  {sizes.map((s) => <Option key={s.value} value={s.value}>{s.label}</Option>)}
                </Select>
              </div>
            </div>
            <div className="w-[200px] min-w-[180px]">
              <span className="font-medium text-sm text-secondary-foreground">Read only</span>
              <div className="mt-4 space-y-3">
                <Select size={SelectSize.Medium} readonly>
                  {sizes.map((s) => <Option key={s.value} value={s.value}>{s.label}</Option>)}
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Value States — Large */}
        <h3 className="text-lg font-bold mt-10 mb-6">Value State — Large</h3>
        <div className="flex flex-wrap gap-8">
          {([
            { state: ValueState.Positive, label: "Positive" },
            { state: ValueState.Negative, label: "Negative" },
            { state: ValueState.Critical, label: "Warning" },
            { state: ValueState.Information, label: "Information" },
          ] as const).map(({ state, label }) => (
            <div key={state} className="w-[200px] min-w-[180px]">
              <span className="font-medium text-sm text-secondary-foreground">{label}</span>
              <div className="mt-4">
                <Select valueState={state} valueStateMessage="Message text giving further context.">
                  {sizes.map((s) => <Option key={s.value} value={s.value}>{s.label}</Option>)}
                </Select>
              </div>
            </div>
          ))}
        </div>

        {/* Value States — Medium */}
        <h3 className="text-lg font-bold mt-10 mb-6">Value State — Medium</h3>
        <div className="flex flex-wrap gap-8">
          {([
            { state: ValueState.Positive, label: "Positive" },
            { state: ValueState.Negative, label: "Negative" },
            { state: ValueState.Critical, label: "Warning" },
            { state: ValueState.Information, label: "Information" },
          ] as const).map(({ state, label }) => (
            <div key={state} className="w-[200px] min-w-[180px]">
              <span className="font-medium text-sm text-secondary-foreground">{label}</span>
              <div className="mt-4">
                <Select size={SelectSize.Medium} valueState={state} valueStateMessage="Message text giving further context.">
                  {sizes.map((s) => <Option key={s.value} value={s.value}>{s.label}</Option>)}
                </Select>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Select */}
      <section id="interactive-select" className="p-6 border border-border rounded-lg bg-card">
            <h2 className="text-2xl font-semibold mb-2">Interactive Select</h2>
            <p className="text-secondary-foreground mb-4">
              Click to open dropdown. Type letters to jump to matching options.
            </p>
            <div className="flex flex-col gap-4 max-w-md">
              <Label id="basic-select-label">Size</Label>
              <Select
                value={basicValue}
                accessibleNameRef="basic-select-label"
                onChange={(detail) => setBasicValue(detail.selectedOption?.value ?? '')}
              >
                {sizes.map((size) => (
                  <Option key={size.value} value={size.value}>
                    {size.label}
                  </Option>
                ))}
              </Select>
              <div className="p-3 bg-muted rounded-md font-mono text-sm">
                <strong>Selected:</strong> {basicValue || 'None'}
              </div>
            </div>
          </section>

          {/* With Icons and Additional Text */}
          <section id="with-icons-additional-text" className="p-6 border border-border rounded-lg bg-card">
            <h2 className="text-2xl font-semibold mb-2">With Icons & Additional Text</h2>
            <p className="text-secondary-foreground mb-4">
              Options can display icons and secondary text for more context.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
              <div>
                <Label id="priority-select-label" className="text-sm font-medium mb-2 block">Priority</Label>
                <Select
                  value={priorityValue}
                  accessibleNameRef="priority-select-label"
                  onChange={(detail) => setPriorityValue(detail.selectedOption?.value ?? '')}
                >
                  {priorities.map((p) => (
                    <Option key={p.value} value={p.value} icon={p.icon}>
                      {p.label}
                    </Option>
                  ))}
                </Select>
              </div>
              <div>
                <Label id="size-price-select-label" className="text-sm font-medium mb-2 block">Size with Price</Label>
                <Select
                  value={basicValue}
                  accessibleNameRef="size-price-select-label"
                  onChange={(detail) => setBasicValue(detail.selectedOption?.value ?? '')}
                >
                  {sizes.map((size) => (
                    <Option
                      key={size.value}
                      value={size.value}
                      additionalText={size.price}
                    >
                      {size.label}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>
          </section>

          {/* Custom Content with OptionCustom */}
          <section id="custom-content-optioncustom" className="p-6 border border-border rounded-lg bg-card">
            <h2 className="text-2xl font-semibold mb-2">Custom Content (OptionCustom)</h2>
            <p className="text-secondary-foreground mb-4">
              Use OptionCustom for completely custom option layouts.
            </p>
            <div className="flex flex-col gap-4 max-w-md">
              <Label id="color-select-label">Color</Label>
              <Select
                value={colorValue}
                accessibleNameRef="color-select-label"
                onChange={(detail) => setColorValue(detail.selectedOption?.value ?? '')}
              >
                {colors.map((color) => (
                  <OptionCustom
                    key={color.value}
                    value={color.value}
                    displayText={color.label}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-6 h-6 rounded-md border border-border"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span>{color.label}</span>
                      <span className="text-secondary-foreground text-xs ml-auto">
                        {color.hex}
                      </span>
                    </div>
                  </OptionCustom>
                ))}
              </Select>
              <div className="p-3 bg-muted rounded-md font-mono text-sm">
                <strong>Selected:</strong> {colorValue || 'None'}
              </div>
            </div>
          </section>

          {/* Value States */}
          <section id="value-states" className="p-6 border border-border rounded-lg bg-card">
            <h2 className="text-2xl font-semibold mb-2">Value States</h2>
            <p className="text-secondary-foreground mb-4">
              Visual validation feedback for form fields.
            </p>
            <div className="flex flex-col gap-4 max-w-md">
              <div className="flex gap-2 flex-wrap">
                {Object.values(ValueState).map((state) => (
                  <Button
                    key={state}
                    onClick={() => setValueState(state)}
                    design={valueState === state ? 'Primary' : 'Secondary'}
                  >
                    {state}
                  </Button>
                ))}
              </div>
              <Select
                value={valueStateValue}
                accessibleName="Size"
                valueState={valueState}
                valueStateMessage={
                  valueState === ValueState.Negative
                    ? 'Please select a valid option'
                    : valueState === ValueState.Critical
                      ? 'This selection requires review'
                      : valueState === ValueState.Information
                        ? 'Choose the size that fits your needs'
                        : undefined
                }
                onChange={(detail) => setValueStateValue(detail.selectedOption?.value ?? '')}
              >
                <Option value="">Select a size...</Option>
                {sizes.map((size) => (
                  <Option key={size.value} value={size.value}>
                    {size.label}
                  </Option>
                ))}
              </Select>
            </div>
          </section>

          {/* Readonly with Text Separator */}
          <section id="readonly-with-text-separator" className="p-6 border border-border rounded-lg bg-card">
            <h2 className="text-2xl font-semibold mb-2">Readonly with Text Separator</h2>
            <p className="text-secondary-foreground mb-4">
              In readonly mode, shows text and additionalText with a configurable separator.
            </p>
            <div className="flex flex-col gap-4 max-w-md">
              <div className="flex gap-2 flex-wrap">
                {Object.values(TextSeparator).map((sep) => (
                  <Button
                    key={sep}
                    onClick={() => setSeparator(sep)}
                    design={separator === sep ? 'Primary' : 'Secondary'}
                  >
                    {sep}
                  </Button>
                ))}
              </div>
              <Select
                value={separatorValue}
                accessibleName="Size"
                readonly
                textSeparator={separator}
              >
                {sizes.map((size) => (
                  <Option
                    key={size.value}
                    value={size.value}
                    additionalText={size.price}
                  >
                    {size.label}
                  </Option>
                ))}
              </Select>
              <div className="p-3 bg-muted rounded-md text-sm">
                <div><strong>Dash:</strong> Medium – $29</div>
                <div><strong>Bullet:</strong> Medium · $29</div>
                <div><strong>VerticalLine:</strong> Medium | $29</div>
              </div>
            </div>
          </section>

          {/* Live Change vs Change */}
          <section id="live-change-vs-change" className="p-6 border border-border rounded-lg bg-card">
            <h2 className="text-2xl font-semibold mb-2">Live Change vs Change</h2>
            <p className="text-secondary-foreground mb-4">
              <code className="bg-muted px-1 rounded">onLiveChange</code> fires during keyboard navigation (preview).
              <code className="bg-muted px-1 rounded">onChange</code> fires on final selection.
            </p>
            <div className="flex flex-col gap-4 max-w-md">
              <Select
                value={liveValue}
                accessibleName="Size"
                onChange={(detail) => {
                  setLiveValue(detail.selectedOption?.value ?? '');
                  setPreviewValue(null);
                }}
                onLiveChange={(detail) => {
                  setPreviewValue(detail.selectedOption?.value ?? null);
                }}
              >
                {sizes.map((size) => (
                  <Option key={size.value} value={size.value}>
                    {size.label}
                  </Option>
                ))}
              </Select>
              <div className="p-3 bg-muted rounded-md font-mono text-sm space-y-1">
                <div><strong>Committed Value:</strong> {liveValue}</div>
                <div><strong>Preview (Live):</strong> {previewValue ?? '(none)'}</div>
              </div>
              <p className="text-sm text-secondary-foreground">
                Open the dropdown and use arrow keys to see the preview update.
                Press Enter to commit, or Escape to revert.
              </p>
            </div>
          </section>

          {/* Disabled Options */}
          <section id="disabled-options" className="p-6 border border-border rounded-lg bg-card">
            <h2 className="text-2xl font-semibold mb-2">Disabled Options</h2>
            <p className="text-secondary-foreground mb-4">
              Individual options can be disabled.
            </p>
            <div className="flex flex-col gap-4 max-w-md">
              <Select accessibleName="Size">
                <Option value="xs">Extra Small</Option>
                <Option value="sm">Small</Option>
                <Option value="md">Medium</Option>
                <Option value="lg" disabled>Large (Out of Stock)</Option>
                <Option value="xl" disabled>Extra Large (Out of Stock)</Option>
              </Select>
            </div>
          </section>

          {/* Disabled & Readonly */}
          <section id="disabled-readonly-states" className="p-6 border border-border rounded-lg bg-card">
            <h2 className="text-2xl font-semibold mb-2">Disabled & Readonly States</h2>
            <p className="text-secondary-foreground mb-4">
              Non-interactive states for Select.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
              <div>
                <Label id="disabled-select-label" className="text-sm font-medium mb-2 block">Disabled</Label>
                <Select value="md" disabled accessibleNameRef="disabled-select-label">
                  {sizes.map((size) => (
                    <Option key={size.value} value={size.value}>
                      {size.label}
                    </Option>
                  ))}
                </Select>
              </div>
              <div>
                <Label id="readonly-select-label" className="text-sm font-medium mb-2 block">Readonly</Label>
                <Select value="md" readonly accessibleNameRef="readonly-select-label">
                  {sizes.map((size) => (
                    <Option key={size.value} value={size.value}>
                      {size.label}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>
          </section>

          {/* Keyboard Shortcuts */}
          <section id="keyboard-shortcuts" className="p-6 border border-border rounded-lg bg-card">
            <h2 className="text-2xl font-semibold mb-4">Keyboard Shortcuts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Navigation</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-secondary-foreground">Open dropdown</span>
                    <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">F4 / Space / Enter</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-foreground">Alt shortcuts</span>
                    <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Alt+Up/Down</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-foreground">Navigate options</span>
                    <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Up / Down</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-foreground">First/last option</span>
                    <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Home/End</kbd>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Actions</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-secondary-foreground">Confirm selection</span>
                    <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Enter / Space</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-foreground">Close & revert</span>
                    <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Escape</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-foreground">Type-ahead search</span>
                    <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">A-Z</kbd>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ComboBox vs Select */}
          <section id="combobox-vs-select" className="p-6 border border-border rounded-lg bg-card">
            <h2 className="text-2xl font-semibold mb-4">ComboBox vs Select</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pr-4">Feature</th>
                    <th className="text-left py-2 pr-4">ComboBox</th>
                    <th className="text-left py-2">Select</th>
                  </tr>
                </thead>
                <tbody className="text-secondary-foreground">
                  <tr className="border-b">
                    <td className="py-2 pr-4 font-medium text-foreground">Text Input</td>
                    <td className="py-2 pr-4">Yes</td>
                    <td className="py-2">No</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-4 font-medium text-foreground">Filtering</td>
                    <td className="py-2 pr-4">Yes (4 modes)</td>
                    <td className="py-2">No</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-4 font-medium text-foreground">Type-ahead</td>
                    <td className="py-2 pr-4">Autocomplete</td>
                    <td className="py-2">Character search</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-4 font-medium text-foreground">Custom Values</td>
                    <td className="py-2 pr-4">Yes</td>
                    <td className="py-2">No</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-medium text-foreground">Use Case</td>
                    <td className="py-2 pr-4">Autocomplete input</td>
                    <td className="py-2">Fixed choices</td>
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
              code={`import { useState } from "react";
import { Select, Option } from "@sap-ui/fx-components";

function SizeSelector() {
  const [size, setSize] = useState("md");

  return (
    <div>
      <label>Choose a size:</label>

      <Select
        value={size}
        onChange={(detail) =>
          setSize(detail.selectedOption?.value ?? "")
        }
      >
        <Option value="sm">Small</Option>
        <Option value="md">Medium</Option>
        <Option value="lg">Large</Option>
        <Option value="xl" disabled>
          Extra Large (Out of Stock)
        </Option>
      </Select>

      {/* With icons and additional text */}
      <Select value="medium">
        <Option value="low" icon="🟢">Low</Option>
        <Option value="medium" icon="🟡" additionalText="Default">
          Medium
        </Option>
        <Option value="high" icon="🔴">High</Option>
      </Select>

      {/* Readonly and disabled states */}
      <Select value="md" readonly>
        <Option value="md">Medium</Option>
      </Select>

      <Select value="md" disabled>
        <Option value="md">Medium</Option>
      </Select>

      <p>Selected: {size}</p>
    </div>
  );
}`}
            />
          </section>
    </div>
  );
}

export default SelectPage;
