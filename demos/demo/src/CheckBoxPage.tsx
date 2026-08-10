import { useState } from "react";
import {
  Button,
  CheckBox,
  CheckBoxChangeEventDetail,
  CheckBoxSize,
  WrappingType,
} from "@sap-ui/fx-components";
import { CodeBlock } from "./components/CodeBlock";

export function CheckBoxPage() {
  const [basicChecked, setBasicChecked] = useState(false);
  const [selectAllState, setSelectAllState] = useState<{
    checked: boolean;
    indeterminate: boolean;
  }>({ checked: false, indeterminate: false });
  const [items, setItems] = useState([
    { id: "1", label: "Option 1", checked: false },
    { id: "2", label: "Option 2", checked: false },
    { id: "3", label: "Option 3", checked: false },
  ]);

  const handleBasicChange = (detail: CheckBoxChangeEventDetail) => {
    setBasicChecked(detail.checked);
  };

  // Handle select all logic
  const handleSelectAll = (detail: CheckBoxChangeEventDetail) => {
    const newChecked = detail.checked;
    setItems(items.map((item) => ({ ...item, checked: newChecked })));
    setSelectAllState({ checked: newChecked, indeterminate: false });
  };

  const handleItemChange = (id: string, detail: CheckBoxChangeEventDetail) => {
    const newItems = items.map((item) =>
      item.id === id ? { ...item, checked: detail.checked } : item
    );
    setItems(newItems);

    // Update select all state
    const checkedCount = newItems.filter((i) => i.checked).length;
    if (checkedCount === 0) {
      setSelectAllState({ checked: false, indeterminate: false });
    } else if (checkedCount === newItems.length) {
      setSelectAllState({ checked: true, indeterminate: false });
    } else {
      setSelectAllState({ checked: false, indeterminate: true });
    }
  };

  return (
    <div className="space-y-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">CheckBox</h1>
        <code className="text-sm text-primary/70 font-mono">{'import { CheckBox } from "@sap-ui/fx-components"'}</code>
      </header>

      {/* Figma States Matrix */}
      <section id="states-matrix" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-6">States Matrix</h2>

        {/* Compact */}
        <div className="mb-10">
          <h3 className="text-lg font-bold mb-6">Compact</h3>
          <div className="grid grid-cols-4 gap-x-8 gap-y-2">
            <span className="font-medium text-sm text-secondary-foreground">Regular</span>
            <span className="font-medium text-sm text-secondary-foreground">Read-only</span>
            <span className="font-medium text-sm text-secondary-foreground">Display-only</span>
            <span className="font-medium text-sm text-secondary-foreground">Disabled</span>

            <CheckBox text="With text" size={CheckBoxSize.Small} />
            <CheckBox text="With text" size={CheckBoxSize.Small} readonly />
            <CheckBox text="With text" size={CheckBoxSize.Small} displayOnly />
            <CheckBox text="With text" size={CheckBoxSize.Small} disabled />

            <CheckBox text="With text" size={CheckBoxSize.Small} defaultChecked />
            <CheckBox text="With text" size={CheckBoxSize.Small} defaultChecked readonly />
            <CheckBox text="With text" size={CheckBoxSize.Small} defaultChecked displayOnly />
            <CheckBox text="With text" size={CheckBoxSize.Small} defaultChecked disabled />

            <CheckBox text="With text" size={CheckBoxSize.Small} indeterminate />
            <CheckBox text="With text" size={CheckBoxSize.Small} indeterminate readonly />
            <CheckBox text="With text" size={CheckBoxSize.Small} indeterminate displayOnly />
            <CheckBox text="With text" size={CheckBoxSize.Small} indeterminate disabled />
          </div>
        </div>

        {/* Cozy */}
        <div>
          <h3 className="text-lg font-bold mb-6">Cozy</h3>
          <div className="grid grid-cols-4 gap-x-8 gap-y-2">
            <span className="font-medium text-sm text-secondary-foreground">Regular</span>
            <span className="font-medium text-sm text-secondary-foreground">Read-only</span>
            <span className="font-medium text-sm text-secondary-foreground">Display-only</span>
            <span className="font-medium text-sm text-secondary-foreground">Disabled</span>

            <CheckBox text="With text" />
            <CheckBox text="With text" readonly />
            <CheckBox text="With text" displayOnly />
            <CheckBox text="With text" disabled />

            <CheckBox text="With text" defaultChecked />
            <CheckBox text="With text" defaultChecked readonly />
            <CheckBox text="With text" defaultChecked displayOnly />
            <CheckBox text="With text" defaultChecked disabled />

            <CheckBox text="With text" indeterminate />
            <CheckBox text="With text" indeterminate readonly />
            <CheckBox text="With text" indeterminate displayOnly />
            <CheckBox text="With text" indeterminate disabled />
          </div>
        </div>
      </section>

      {/* State Tracker */}
      <section className="p-4 border border-border rounded-lg bg-muted/50">
        <div className="flex items-center gap-4 text-sm">
          <span>
            <strong>Basic Checkbox:</strong> {basicChecked ? "Checked" : "Unchecked"}
          </span>
          <span>
            <strong>Items Checked:</strong> {items.filter((i) => i.checked).length} / {items.length}
          </span>
        </div>
      </section>

      {/* No Text */}
      <section id="without-text" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Without Text</h2>
        <p className="text-secondary-foreground mb-4">
          Checkbox rendered without a label.
        </p>
        <div className="flex items-center gap-4">
          <CheckBox accessibleName="Unchecked" />
          <CheckBox defaultChecked accessibleName="Checked" />
          <CheckBox indeterminate accessibleName="Indeterminate" />
          <CheckBox disabled accessibleName="Disabled unchecked" />
          <CheckBox disabled defaultChecked accessibleName="Disabled checked" />
        </div>
      </section>

      {/* Basic Usage */}
      <section id="basic-usage" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Basic Usage</h2>
        <p className="text-secondary-foreground mb-4">
          Simple checkbox with controlled state.
        </p>
        <div className="space-y-4">
          <CheckBox
            text="I agree to the terms and conditions"
            checked={basicChecked}
            onChange={handleBasicChange}
          />
          <CheckBox text="Uncontrolled checkbox" defaultChecked />
          <CheckBox text="Default unchecked" />
        </div>
      </section>

      {/* Sizes */}
      <section id="sizes" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Sizes</h2>
        <p className="text-secondary-foreground mb-4">
          Large (default, 44px touch area) and Small (32px touch area) variants.
        </p>
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">Large (default)</h3>
            <CheckBox text="Large checkbox" size={CheckBoxSize.Large} />
            <CheckBox text="Large checked" size={CheckBoxSize.Large} defaultChecked />
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Small</h3>
            <CheckBox text="Small checkbox" size={CheckBoxSize.Small} />
            <CheckBox text="Small checked" size={CheckBoxSize.Small} defaultChecked />
          </div>
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
            <CheckBox text="I agree to all terms and conditions of this software license agreement" defaultChecked />
            <CheckBox text="I agree to all terms and conditions of this software license agreement" size={CheckBoxSize.Small} defaultChecked />
          </div>
          <div className="max-w-[250px] border border-dashed border-border rounded-lg p-4 [&>*]:block [&>*]:overflow-hidden space-y-2">
            <h3 className="font-medium text-sm text-secondary-foreground mb-3">Truncated</h3>
            <CheckBox text="I agree to all terms and conditions of this software license agreement" wrappingType="None" defaultChecked />
            <CheckBox text="I agree to all terms and conditions of this software license agreement" wrappingType="None" size={CheckBoxSize.Small} defaultChecked />
          </div>
        </div>
      </section>

      {/* Indeterminate State */}
      <section id="indeterminate-state" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Indeterminate State</h2>
        <p className="text-secondary-foreground mb-4">
          Use indeterminate state for "select all" patterns where some but not all items are selected.
        </p>
        <div className="space-y-4">
          <CheckBox
            text="Select All"
            checked={selectAllState.checked}
            indeterminate={selectAllState.indeterminate}
            onChange={handleSelectAll}
          />
          <div className="ml-6 space-y-2 border-l-2 border-border pl-4">
            {items.map((item) => (
              <CheckBox
                key={item.id}
                text={item.label}
                checked={item.checked}
                onChange={(detail) => handleItemChange(item.id, detail)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Value States */}
      <section id="value-states" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Value States</h2>
        <p className="text-secondary-foreground mb-4">
          Checkboxes can show validation states with colored borders.
        </p>
        <div className="space-y-4">
          <CheckBox text="None (default)" valueState="None" defaultChecked />
          <CheckBox
            text="Positive (success)"
            valueState="Positive"
            defaultChecked
          />
          <CheckBox
            text="Negative (error)"
            valueState="Negative"
            defaultChecked
          />
          <CheckBox
            text="Critical (warning)"
            valueState="Critical"
            defaultChecked
          />
          <CheckBox
            text="Information"
            valueState="Information"
            defaultChecked
          />
        </div>
      </section>

      {/* Value States Unchecked */}
      <section id="value-states-unchecked" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Value States (Unchecked)</h2>
        <p className="text-secondary-foreground mb-4">
          Value states also affect the border color when unchecked.
        </p>
        <div className="space-y-4">
          <CheckBox text="None (default)" valueState="None" />
          <CheckBox text="Positive (success)" valueState="Positive" />
          <CheckBox text="Negative (error)" valueState="Negative" />
          <CheckBox text="Critical (warning)" valueState="Critical" />
          <CheckBox text="Information" valueState="Information" />
        </div>
      </section>

      {/* Required Field */}
      <section id="required-field" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Required Field</h2>
        <p className="text-secondary-foreground mb-4">
          Mark a checkbox as required with an asterisk indicator.
        </p>
        <div className="space-y-4">
          <CheckBox text="I accept the privacy policy" required />
          <CheckBox
            text="Required with error state"
            required
            valueState="Negative"
          />
        </div>
      </section>

      {/* Disabled & Read-only */}
      <section id="disabled-read-only-states" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Disabled & Read-only States</h2>
        <p className="text-secondary-foreground mb-4">
          Non-interactive checkboxes for different use cases.
        </p>
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">Disabled</h3>
            <CheckBox text="Disabled unchecked" disabled />
            <CheckBox text="Disabled checked" disabled defaultChecked />
            <CheckBox text="Disabled indeterminate" disabled indeterminate />
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Read-only</h3>
            <CheckBox text="Read-only unchecked" readonly />
            <CheckBox text="Read-only checked" readonly defaultChecked />
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Display-only (not focusable)</h3>
            <CheckBox text="Display-only unchecked" displayOnly />
            <CheckBox text="Display-only checked" displayOnly defaultChecked />
          </div>
        </div>
      </section>

      {/* Text Wrapping */}
      <section id="text-wrapping" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Text Wrapping</h2>
        <p className="text-secondary-foreground mb-4">
          Control how long label text is displayed.
        </p>
        <div className="space-y-4 max-w-md">
          <div>
            <h3 className="font-medium mb-2">Normal (wraps)</h3>
            <CheckBox
              wrappingType="Normal"
              text="This is a very long checkbox label that will wrap to multiple lines when the container is not wide enough to fit everything on a single line."
            />
          </div>
          <div>
            <h3 className="font-medium mb-2">None (truncates)</h3>
            <CheckBox
              wrappingType="None"
              text="This is a very long checkbox label that will be truncated when the container is not wide enough."
            />
          </div>
        </div>
      </section>

      {/* Form Integration */}
      <section id="form-integration" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Form Integration</h2>
        <p className="text-secondary-foreground mb-4">
          Checkboxes integrate with HTML forms using name and value props.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const values: Record<string, string> = {};
            formData.forEach((value, key) => {
              values[key] = value as string;
            });
            alert(`Form submitted:\n${JSON.stringify(values, null, 2)}`);
          }}
          className="space-y-4"
        >
          <CheckBox name="newsletter" value="yes" text="Subscribe to newsletter" />
          <CheckBox
            name="notifications"
            value="email"
            text="Receive email notifications"
            defaultChecked
          />
          <CheckBox
            name="notifications"
            value="sms"
            text="Receive SMS notifications"
          />
          <Button type="Submit" design="Primary">
            Submit Form
          </Button>
        </form>
      </section>

      {/* All States Gallery */}
      <section id="states-gallery" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-4">States Gallery</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <h3 className="font-medium text-secondary-foreground">Unchecked</h3>
            <CheckBox text="Default" />
            <CheckBox text="Positive" valueState="Positive" />
            <CheckBox text="Negative" valueState="Negative" />
            <CheckBox text="Critical" valueState="Critical" />
            <CheckBox text="Information" valueState="Information" />
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-secondary-foreground">Checked</h3>
            <CheckBox text="Default" defaultChecked />
            <CheckBox text="Positive" valueState="Positive" defaultChecked />
            <CheckBox text="Negative" valueState="Negative" defaultChecked />
            <CheckBox text="Critical" valueState="Critical" defaultChecked />
            <CheckBox text="Information" valueState="Information" defaultChecked />
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-secondary-foreground">Indeterminate</h3>
            <CheckBox text="Default" indeterminate />
            <CheckBox text="Positive" valueState="Positive" indeterminate />
            <CheckBox text="Negative" valueState="Negative" indeterminate />
            <CheckBox text="Critical" valueState="Critical" indeterminate />
            <CheckBox text="Information" valueState="Information" indeterminate />
          </div>
        </div>
      </section>

      {/* Usage Example */}
      <section id="usage-example" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-4">Usage Example</h2>
        <CodeBlock
          language="tsx"
          code={`import { CheckBox } from '@sap-ui/fx-components';
import { useState } from 'react';

function MyComponent() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="space-y-4">
      {/* Basic controlled checkbox */}
      <CheckBox
        text="Accept terms"
        checked={checked}
        onChange={(detail) => setChecked(detail.checked)}
      />

      {/* With value state */}
      <CheckBox
        text="Required field"
        valueState="Negative"
        required
      />

      {/* Indeterminate for "select all" */}
      <CheckBox
        text="Select all"
        indeterminate={someSelected && !allSelected}
        checked={allSelected}
        onChange={handleSelectAll}
      />

      {/* Form integration */}
      <CheckBox
        name="subscribe"
        value="newsletter"
        text="Subscribe to newsletter"
      />
    </div>
  );
}`}
        />
      </section>
    </div>
  );
}
