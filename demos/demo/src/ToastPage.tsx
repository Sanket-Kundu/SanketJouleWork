import { useState } from "react";
import { Toast, ToastPlacement, Button, Select, Option, Input, Label } from "@sap-ui/fx-components";
import { CodeBlock } from "./components/CodeBlock";

export function ToastPage() {
  const [basicOpen, setBasicOpen] = useState(false);
  const [placementOpen, setPlacementOpen] = useState(false);
  const [selectedPlacement, setSelectedPlacement] = useState<string>(ToastPlacement.BottomCenter);
  const [durationOpen, setDurationOpen] = useState(false);
  const [customDuration, setCustomDuration] = useState("3000");

  return (
    <div className="space-y-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Toast</h1>
        <code className="text-sm text-primary/70 font-mono">{'import { Toast } from "@sap-ui/fx-components"'}</code>
      </header>

      {/* Basic Usage */}
      <section id="basic-usage" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Basic Usage</h2>
        <p className="text-secondary-foreground mb-4">
          A small, non-disruptive popup for success or information messages that disappears automatically.
        </p>
        <Button onClick={() => setBasicOpen(true)}>Show Toast</Button>
        <Toast open={basicOpen} onClose={() => setBasicOpen(false)}>
          Changes saved successfully
        </Toast>
      </section>

      {/* Placement */}
      <section id="placement" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Placement</h2>
        <p className="text-secondary-foreground mb-4">
          Control where the toast appears on screen with the <code className="bg-muted px-1 rounded">placement</code> prop.
        </p>
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <Label className="mb-1">Placement</Label>
            <Select
              value={selectedPlacement}
              onChange={(detail) => setSelectedPlacement(detail.selectedOption?.value ?? ToastPlacement.BottomCenter)}
            >
              {Object.values(ToastPlacement).map((p) => (
                <Option key={p} value={p}>{p}</Option>
              ))}
            </Select>
          </div>
          <Button onClick={() => setPlacementOpen(true)}>Show Toast</Button>
        </div>
        <Toast
          open={placementOpen}
          onClose={() => setPlacementOpen(false)}
          placement={selectedPlacement as ToastPlacement}
        >
          Placement: {selectedPlacement}
        </Toast>
      </section>

      {/* Custom Duration */}
      <section id="custom-duration" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Custom Duration</h2>
        <p className="text-secondary-foreground mb-4">
          Set how long the toast stays visible (minimum 500ms, default 3000ms).
        </p>
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <Label className="mb-1">Duration (ms)</Label>
            <Input
              value={customDuration}
              onInput={(val) => setCustomDuration(val)}
              type="number"
            />
          </div>
          <Button onClick={() => setDurationOpen(true)}>Show Toast</Button>
        </div>
        <Toast
          open={durationOpen}
          onClose={() => setDurationOpen(false)}
          duration={Number(customDuration)}
        >
          This toast lasts {customDuration}ms
        </Toast>
      </section>

      {/* Usage Example */}
      <section id="usage-example" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-4">Usage Example</h2>
        <CodeBlock
          language="tsx"
          code={`import { Toast, ToastPlacement } from "@sap-ui/fx-components";
import { useState } from "react";

function MyComponent() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        Show Toast
      </Button>

      <Toast
        open={open}
        onClose={() => setOpen(false)}
        duration={3000}
        placement={ToastPlacement.BottomCenter}
      >
        Operation completed successfully
      </Toast>
    </>
  );
}`}
        />
      </section>
    </div>
  );
}

export default ToastPage;
