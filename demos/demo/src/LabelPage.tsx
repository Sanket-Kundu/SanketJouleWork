import { useState } from "react";
import {
  Label,
  LabelWrappingType,
  Input,
  CheckBox,
  Button,
} from "@sap-ui/fx-components";
import { CodeBlock } from "./components/CodeBlock";

function LabelPage() {
  const [inputValue, setInputValue] = useState("");

  return (
    <div className="space-y-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Label</h1>
        <code className="text-sm text-primary/70 font-mono">{'import { Label } from "@sap-ui/fx-components"'}</code>
      </header>

      {/* Basic Label */}
      <section id="basic-label" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Basic Label</h2>
        <p className="text-secondary-foreground mb-4">
          Simple text label for form fields.
        </p>
        <div className="flex flex-col gap-4 max-w-md">
          <div className="space-y-1">
            <Label htmlFor="basic-input">Name</Label>
            <Input
              id="basic-input"
              placeholder="Enter your name..."
              value={inputValue}
              onInput={setInputValue}
            />
          </div>
        </div>
      </section>

      {/* Required Label */}
      <section id="required-label" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Required Label</h2>
        <p className="text-secondary-foreground mb-4">
          Display an asterisk (*) to indicate required fields.
        </p>
        <div className="flex flex-col gap-4 max-w-md">
          <div className="space-y-1">
            <Label htmlFor="required-input" required>
              Email Address
            </Label>
            <Input
              id="required-input"
              type="email"
              placeholder="email@example.com"
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="required-input-2" required>
              Password
            </Label>
            <Input
              id="required-input-2"
              type="password"
              placeholder="Enter password"
              required
            />
          </div>
        </div>
      </section>

      {/* Label with Colon */}
      <section id="label-with-colon" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Label with Colon</h2>
        <p className="text-secondary-foreground mb-4">
          Automatically append a colon for form layouts.
        </p>
        <div className="flex flex-col gap-4 max-w-md">
          <div className="grid grid-cols-[120px_1fr] items-center gap-4">
            <Label htmlFor="colon-input-1" showColon>
              First Name
            </Label>
            <Input id="colon-input-1" placeholder="John" />
          </div>
          <div className="grid grid-cols-[120px_1fr] items-center gap-4">
            <Label htmlFor="colon-input-2" showColon>
              Last Name
            </Label>
            <Input id="colon-input-2" placeholder="Doe" />
          </div>
          <div className="grid grid-cols-[120px_1fr] items-center gap-4">
            <Label htmlFor="colon-input-3" showColon required>
              Email
            </Label>
            <Input id="colon-input-3" type="email" placeholder="john@example.com" />
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
          <div className="space-y-1">
            <p className="text-sm text-secondary-foreground mb-2">
              <strong>Normal (default):</strong> Text wraps to multiple lines
            </p>
            <div className="w-48 border border-dashed border-border p-2 rounded">
              <Label wrappingType={LabelWrappingType.Normal}>
                This is a very long label text that will wrap to multiple lines when it exceeds the container width
              </Label>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-secondary-foreground mb-2">
              <strong>None:</strong> Text truncates with ellipsis
            </p>
            <div className="w-48 border border-dashed border-border p-2 rounded">
              <Label wrappingType={LabelWrappingType.None} className="block">
                This is a very long label text that will be truncated when it exceeds the container width
              </Label>
            </div>
          </div>
        </div>
      </section>

      {/* Label with Different Inputs */}
      <section id="label-with-different-inputs" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Label with Different Inputs</h2>
        <p className="text-secondary-foreground mb-4">
          Labels work with various input types.
        </p>
        <div className="flex flex-col gap-4 max-w-md">
          <div className="space-y-1">
            <Label htmlFor="text-input">Text Input</Label>
            <Input id="text-input" placeholder="Enter text..." />
          </div>
          <div className="flex items-center gap-2">
            <CheckBox id="checkbox-input" />
            <Label htmlFor="checkbox-input">I agree to the terms and conditions</Label>
          </div>
          <div className="flex items-center gap-2">
            <CheckBox id="checkbox-input-2" />
            <Label htmlFor="checkbox-input-2" required>
              Subscribe to newsletter
            </Label>
          </div>
        </div>
      </section>

      {/* Using text prop */}
      <section id="using-text-prop" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Using text Prop</h2>
        <p className="text-secondary-foreground mb-4">
          Alternative to children for setting label text.
        </p>
        <div className="flex flex-col gap-4 max-w-md">
          <div className="space-y-1">
            <Label htmlFor="text-prop-input" text="Username" required />
            <Input id="text-prop-input" placeholder="Enter username..." />
          </div>
        </div>
      </section>

      {/* Form Example */}
      <section id="complete-form-example" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Complete Form Example</h2>
        <p className="text-secondary-foreground mb-4">
          A typical form layout using Label components.
        </p>
        <form className="flex flex-col gap-4 max-w-lg" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="form-first" required>First Name</Label>
              <Input id="form-first" placeholder="John" required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="form-last" required>Last Name</Label>
              <Input id="form-last" placeholder="Doe" required />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="form-email" required>Email</Label>
            <Input id="form-email" type="email" placeholder="john@example.com" required />
          </div>
          <div className="space-y-1">
            <Label htmlFor="form-phone">Phone (optional)</Label>
            <Input id="form-phone" type="tel" placeholder="+1 (555) 000-0000" />
          </div>
          <div className="flex items-start gap-2">
            <CheckBox id="form-terms" required />
            <Label htmlFor="form-terms" required>
              I agree to the terms and conditions
            </Label>
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="Submit" design="Primary">Submit</Button>
            <Button type="Reset" design="Secondary">Reset</Button>
          </div>
        </form>
      </section>

      {/* Accessibility */}
      <section id="accessibility" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-4">Accessibility</h2>
        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-semibold mb-2">Screen Reader Support</h3>
            <ul className="list-disc list-inside text-secondary-foreground space-y-1">
              <li>Labels are automatically associated with inputs via the <code className="bg-muted px-1 rounded">htmlFor</code> attribute</li>
              <li>Required labels announce "(required)" to screen readers</li>
              <li>The asterisk (*) is hidden from screen readers to avoid redundancy</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Click Behavior</h3>
            <ul className="list-disc list-inside text-secondary-foreground space-y-1">
              <li>Clicking the label focuses the associated input</li>
              <li>For checkboxes, clicking the label toggles the checkbox</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Usage Example */}
      <section id="usage-example" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-4">Usage Example</h2>
        <CodeBlock
          language="tsx"
          code={`import { Label, LabelWrappingType, Input } from "@sap-ui/fx-components";

function MyForm() {
  return (
    <form>
      {/* Basic label linked to an input */}
      <Label htmlFor="name">Full Name</Label>
      <Input id="name" placeholder="Enter your name" />

      {/* Required label with colon */}
      <Label htmlFor="email" required showColon>
        Email Address
      </Label>
      <Input id="email" type="email" required />

      {/* Label using text prop */}
      <Label htmlFor="phone" text="Phone Number" />
      <Input id="phone" type="tel" />

      {/* Truncated label for narrow layouts */}
      <Label
        htmlFor="notes"
        wrappingType={LabelWrappingType.None}
      >
        This label truncates with an ellipsis
      </Label>
      <Input id="notes" />
    </form>
  );
}`}
        />
      </section>
    </div>
  );
}

export default LabelPage;
