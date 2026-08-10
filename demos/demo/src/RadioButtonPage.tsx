import { useState } from "react";
import {
  RadioButton,
  RadioButtonSize,
  RadioButtonValueState,
  RadioButtonWrappingType,
  Button,
} from "@sap-ui/fx-components";
import { CodeBlock } from "./components/CodeBlock";

function RadioButtonPage() {
  const [selectedSize, setSelectedSize] = useState("md");
  const [selectedPriority, setSelectedPriority] = useState("medium");
  const [selectedPayment, setSelectedPayment] = useState("credit");
  const [valueState, setValueState] = useState<RadioButtonValueState>(RadioButtonValueState.None);
  const [selectedPlan, setSelectedPlan] = useState("");

  return (
    <div className="space-y-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">RadioButton</h1>
        <code className="text-sm text-primary/70 font-mono">{'import { RadioButton } from "@sap-ui/fx-components"'}</code>
      </header>

      {/* Figma States Matrix */}
      <section id="states-matrix" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-6">States Matrix</h2>

        {/* Large (default) */}
        <h3 className="font-medium text-sm text-secondary-foreground mb-3">Large (default)</h3>
        <div className="grid grid-cols-3 gap-x-8 gap-y-2 mb-8">
          <span className="font-medium text-sm text-secondary-foreground">Regular</span>
          <span className="font-medium text-sm text-secondary-foreground">Read-only</span>
          <span className="font-medium text-sm text-secondary-foreground">Disabled</span>

          <RadioButton name="matrix-lg-reg" text="With text" />
          <RadioButton name="matrix-lg-ro-unc" text="With text" readonly />
          <RadioButton name="matrix-lg-dis-unc" text="With text" disabled />

          <RadioButton name="matrix-lg-reg" text="With text" defaultChecked />
          <RadioButton name="matrix-lg-ro-chk" text="With text" readonly defaultChecked />
          <RadioButton name="matrix-lg-dis-chk" text="With text" disabled defaultChecked />
        </div>

        {/* Small */}
        <h3 className="font-medium text-sm text-secondary-foreground mb-3">Small (compact)</h3>
        <div className="grid grid-cols-3 gap-x-8 gap-y-2">
          <span className="font-medium text-sm text-secondary-foreground">Regular</span>
          <span className="font-medium text-sm text-secondary-foreground">Read-only</span>
          <span className="font-medium text-sm text-secondary-foreground">Disabled</span>

          <RadioButton name="matrix-sm-reg" text="With text" size={RadioButtonSize.Small} />
          <RadioButton name="matrix-sm-ro-unc" text="With text" size={RadioButtonSize.Small} readonly />
          <RadioButton name="matrix-sm-dis-unc" text="With text" size={RadioButtonSize.Small} disabled />

          <RadioButton name="matrix-sm-reg" text="With text" size={RadioButtonSize.Small} defaultChecked />
          <RadioButton name="matrix-sm-ro-chk" text="With text" size={RadioButtonSize.Small} readonly defaultChecked />
          <RadioButton name="matrix-sm-dis-chk" text="With text" size={RadioButtonSize.Small} disabled defaultChecked />
        </div>
      </section>

      {/* Without Text */}
      <section id="without-text" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Without Text</h2>
        <p className="text-secondary-foreground mb-4">
          RadioButton rendered without a label.
        </p>
        <div className="flex items-center gap-4">
          <RadioButton name="no-text-group" accessibleName="Unselected option" />
          <RadioButton name="no-text-group" defaultChecked accessibleName="Selected option" />
          <RadioButton disabled accessibleName="Disabled unselected option" />
          <RadioButton disabled defaultChecked accessibleName="Disabled selected option" />
        </div>
      </section>

      {/* Text Overflow */}
      <section id="text-overflow" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Text Overflow</h2>
        <p className="text-secondary-foreground mb-4">
          When text exceeds the available space. Normal wrapping (default) vs truncation.
        </p>
        <div className="space-y-6">
          <div className="max-w-[250px] border border-dashed border-border rounded-lg p-4 space-y-2">
            <h3 className="font-medium text-sm text-secondary-foreground mb-3">Wrapping</h3>
            <RadioButton name="wrap-long" text="I agree to all terms and conditions of this software license agreement" defaultChecked />
          </div>
          <div className="max-w-[250px] border border-dashed border-border rounded-lg p-4 space-y-2">
            <h3 className="font-medium text-sm text-secondary-foreground mb-3">Truncated</h3>
            <RadioButton name="trunc-long" text="I agree to all terms and conditions of this software license agreement" wrappingType="None" defaultChecked className="max-w-full" />
          </div>
        </div>
      </section>

      {/* Basic RadioButton Group */}
      <section id="basic-radiobutton-group" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Basic RadioButton Group</h2>
        <p className="text-secondary-foreground mb-4">
          Select one option from a group. Radio buttons with the same name are mutually exclusive.
        </p>
        <div className="flex flex-col gap-4 max-w-md">
          <div className="flex flex-col gap-2">
            <RadioButton
              name="size"
              value="sm"
              checked={selectedSize === "sm"}
              onChange={() => setSelectedSize("sm")}
            >
              Small
            </RadioButton>
            <RadioButton
              name="size"
              value="md"
              checked={selectedSize === "md"}
              onChange={() => setSelectedSize("md")}
            >
              Medium
            </RadioButton>
            <RadioButton
              name="size"
              value="lg"
              checked={selectedSize === "lg"}
              onChange={() => setSelectedSize("lg")}
            >
              Large
            </RadioButton>
          </div>
          <div className="p-3 bg-muted rounded-md font-mono text-sm">
            <strong>Selected:</strong> {selectedSize}
          </div>
        </div>
      </section>

      {/* Horizontal Layout */}
      <section id="horizontal-layout" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Horizontal Layout</h2>
        <p className="text-secondary-foreground mb-4">
          Radio buttons can be laid out horizontally using flex.
        </p>
        <div className="flex flex-col gap-4 max-w-lg">
          <div className="flex flex-wrap gap-4">
            <RadioButton
              name="priority"
              value="low"
              checked={selectedPriority === "low"}
              onChange={() => setSelectedPriority("low")}
            >
              Low
            </RadioButton>
            <RadioButton
              name="priority"
              value="medium"
              checked={selectedPriority === "medium"}
              onChange={() => setSelectedPriority("medium")}
            >
              Medium
            </RadioButton>
            <RadioButton
              name="priority"
              value="high"
              checked={selectedPriority === "high"}
              onChange={() => setSelectedPriority("high")}
            >
              High
            </RadioButton>
            <RadioButton
              name="priority"
              value="critical"
              checked={selectedPriority === "critical"}
              onChange={() => setSelectedPriority("critical")}
            >
              Critical
            </RadioButton>
          </div>
          <div className="p-3 bg-muted rounded-md font-mono text-sm">
            <strong>Selected Priority:</strong> {selectedPriority}
          </div>
        </div>
      </section>

      {/* Value States */}
      <section id="value-states" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Value States</h2>
        <p className="text-secondary-foreground mb-4">
          Visual feedback for validation states.
        </p>
        <div className="flex flex-col gap-4 max-w-md">
          <div className="flex gap-2 flex-wrap">
            {Object.values(RadioButtonValueState).map((state) => (
              <Button
                key={state}
                onClick={() => setValueState(state)}
                design={valueState === state ? "Primary" : "Secondary"}
              >
                {state}
              </Button>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <RadioButton
              name="valuestate-demo"
              value="option1"
              valueState={valueState}
              valueStateMessage={
                valueState === RadioButtonValueState.Negative
                  ? "This option is not available"
                  : valueState === RadioButtonValueState.Critical
                    ? "This option requires approval"
                    : valueState === RadioButtonValueState.Positive
                      ? "Great choice!"
                      : valueState === RadioButtonValueState.Information
                        ? "Most popular option"
                        : undefined
              }
            >
              Option 1
            </RadioButton>
            <RadioButton
              name="valuestate-demo"
              value="option2"
              valueState={valueState}
            >
              Option 2
            </RadioButton>
            <RadioButton
              name="valuestate-demo"
              value="option3"
              valueState={valueState}
            >
              Option 3
            </RadioButton>
          </div>
        </div>
      </section>

      {/* Required Radio Buttons */}
      <section id="required-field" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Required Field</h2>
        <p className="text-secondary-foreground mb-4">
          Mark radio button groups as required with an asterisk indicator.
        </p>
        <div className="flex flex-col gap-4 max-w-md">
          <p className="text-sm font-medium">Select a payment method <span className="text-red-500">*</span></p>
          <div className="flex flex-col gap-2">
            <RadioButton
              name="payment"
              value="credit"
              required
              checked={selectedPayment === "credit"}
              onChange={() => setSelectedPayment("credit")}
            >
              Credit Card
            </RadioButton>
            <RadioButton
              name="payment"
              value="debit"
              required
              checked={selectedPayment === "debit"}
              onChange={() => setSelectedPayment("debit")}
            >
              Debit Card
            </RadioButton>
            <RadioButton
              name="payment"
              value="paypal"
              required
              checked={selectedPayment === "paypal"}
              onChange={() => setSelectedPayment("paypal")}
            >
              PayPal
            </RadioButton>
          </div>
        </div>
      </section>

      {/* Disabled & Readonly */}
      <section id="disabled-readonly" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Disabled & Readonly</h2>
        <p className="text-secondary-foreground mb-4">
          Non-interactive states for RadioButton.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
          <div>
            <p className="text-sm font-medium mb-2">Disabled</p>
            <div className="flex flex-col gap-2">
              <RadioButton name="disabled-demo" value="a" disabled>
                Disabled unchecked
              </RadioButton>
              <RadioButton name="disabled-demo" value="b" disabled checked>
                Disabled checked
              </RadioButton>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Readonly</p>
            <div className="flex flex-col gap-2">
              <RadioButton name="readonly-demo" value="a" readonly>
                Readonly unchecked
              </RadioButton>
              <RadioButton name="readonly-demo" value="b" readonly checked>
                Readonly checked
              </RadioButton>
            </div>
          </div>
        </div>
      </section>

      {/* Wrapping Types */}
      <section id="wrapping-types" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Wrapping Types</h2>
        <p className="text-secondary-foreground mb-4">
          Control how label text wraps when space is limited.
        </p>
        <div className="flex flex-col gap-6 max-w-md">
          <div>
            <p className="text-sm text-secondary-foreground mb-2">
              <strong>Normal (default):</strong> Text wraps to multiple lines
            </p>
            <div className="w-64 border border-dashed border-border p-2 rounded">
              <RadioButton
                name="wrap-normal"
                value="normal"
                wrappingType={RadioButtonWrappingType.Normal}
              >
                This is a very long label text that will wrap to multiple lines when it exceeds the container width
              </RadioButton>
            </div>
          </div>
          <div>
            <p className="text-sm text-secondary-foreground mb-2">
              <strong>None:</strong> Text truncates
            </p>
            <div className="w-64 border border-dashed border-border p-2 rounded">
              <RadioButton
                name="wrap-none"
                value="none"
                wrappingType={RadioButtonWrappingType.None}
                className="max-w-full"
              >
                This is a very long label text that will be truncated when it exceeds the container width
              </RadioButton>
            </div>
          </div>
        </div>
      </section>

      {/* Card Selection Pattern */}
      <section id="card-selection-pattern" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Card Selection Pattern</h2>
        <p className="text-secondary-foreground mb-4">
          Use radio buttons for selecting from card-style options.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl">
          {[
            { value: "basic", name: "Basic", price: "$9/mo", features: ["5 projects", "Basic support"] },
            { value: "pro", name: "Pro", price: "$29/mo", features: ["Unlimited projects", "Priority support", "API access"] },
            { value: "enterprise", name: "Enterprise", price: "$99/mo", features: ["Everything in Pro", "Custom integrations", "Dedicated manager"] },
          ].map((plan) => (
            <label
              key={plan.value}
              className={`relative flex flex-col p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedPlan === plan.value
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="font-semibold">{plan.name}</span>
                  <span className="block text-lg font-bold text-primary">{plan.price}</span>
                </div>
                <RadioButton
                  name="plan"
                  value={plan.value}
                  accessibleName={`${plan.name} plan ${plan.price}`}
                  checked={selectedPlan === plan.value}
                  onChange={() => setSelectedPlan(plan.value)}
                />
              </div>
              <ul className="text-sm text-secondary-foreground space-y-1">
                {plan.features.map((feature, i) => (
                  <li key={i}>• {feature}</li>
                ))}
              </ul>
            </label>
          ))}
        </div>
        <div className="mt-4 p-3 bg-muted rounded-md font-mono text-sm max-w-3xl">
          <strong>Selected Plan:</strong> {selectedPlan || "None"}
        </div>
      </section>

      {/* Keyboard Navigation */}
      <section id="keyboard-navigation" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-4">Keyboard Navigation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-3">Selection</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-secondary-foreground">Select focused option</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Space / Enter</kbd>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Navigation</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-secondary-foreground">Move between options</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Arrow keys</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-foreground">Enter/exit group</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Tab</kbd>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accessibility */}
      <section id="accessibility-features" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-4">Accessibility Features</h2>
        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-semibold mb-2">Screen Reader Support</h3>
            <ul className="list-disc list-inside text-secondary-foreground space-y-1">
              <li>Each radio button has an accessible label</li>
              <li>Group relationship is conveyed through the name attribute</li>
              <li>Value state messages are announced to screen readers</li>
              <li>Required state is communicated via ARIA attributes</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Native Behavior</h3>
            <ul className="list-disc list-inside text-secondary-foreground space-y-1">
              <li>Uses native radio input for form integration</li>
              <li>Supports form validation and submission</li>
              <li>Works with browser autofill</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Usage Example */}
      <section id="usage-example" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-4">Usage Example</h2>
        <CodeBlock
          language="tsx"
          code={`import { useState } from "react";
import { RadioButton } from "@sap-ui/fx-components";

function ShippingOptions() {
  const [shipping, setShipping] = useState("standard");

  return (
    <div>
      <p>Select shipping method:</p>

      <RadioButton
        name="shipping"
        value="standard"
        checked={shipping === "standard"}
        onChange={() => setShipping("standard")}
      >
        Standard (5-7 days)
      </RadioButton>

      <RadioButton
        name="shipping"
        value="express"
        checked={shipping === "express"}
        onChange={() => setShipping("express")}
      >
        Express (2-3 days)
      </RadioButton>

      <RadioButton
        name="shipping"
        value="overnight"
        checked={shipping === "overnight"}
        onChange={() => setShipping("overnight")}
      >
        Overnight
      </RadioButton>

      {/* Disabled option */}
      <RadioButton
        name="shipping"
        value="drone"
        disabled
      >
        Drone (coming soon)
      </RadioButton>

      <p>Selected: {shipping}</p>
    </div>
  );
}`}
        />
      </section>
    </div>
  );
}

export default RadioButtonPage;
