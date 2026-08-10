import { useState } from "react";
import {
  Switch,
  SwitchDesign,
  SwitchChangeDetail,
  Label,
} from "@sap-ui/fx-components";
import { Sun, Moon, Volume2, VolumeX } from "lucide-react";
import { CodeBlock } from "./components/CodeBlock";

export function SwitchPage() {
  const [, setChecked] = useState(false);
  const [themeToggle1, setThemeToggle1] = useState(false);
  const [themeToggle2, setThemeToggle2] = useState(true);
  const [themeToggle3, setThemeToggle3] = useState(false);
  const [volumeToggle1, setVolumeToggle1] = useState(false);
  const [volumeToggle2, setVolumeToggle2] = useState(true);
  const [volumeToggle3, setVolumeToggle3] = useState(false);

  const handleChange = (detail: SwitchChangeDetail) => {
    console.log("onChange:", detail);
    setChecked(detail.checked);
  };

  return (
    <div className="space-y-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Switch</h1>
        <code className="text-sm text-primary/70 font-mono">{'import { Switch } from "@sap-ui/fx-components"'}</code>
      </header>

      {/* Basic Switch */}
      <section id="basic-switch" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Basic Switch</h2>
        <p className="text-secondary-foreground mb-4">
          Simple on/off switch with smooth animation.
        </p>
        <div className="max-w-md space-y-4">
          <div className="flex items-center gap-4">
            <Switch accessibleName="Basic switch" onChange={handleChange} />
			<Switch accessibleName="Checked switch" defaultChecked />
			<Switch accessibleName="Graphical switch" design={SwitchDesign.Graphical} />
            <Switch accessibleName="Graphical checked switch" design={SwitchDesign.Graphical} defaultChecked />
          </div>
        </div>
      </section>

      {/* With Labels */}
      <section id="with-labels" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">With Labels</h2>
        <p className="text-secondary-foreground mb-4">
          Switch combined with Label component.
        </p>
        <div className="max-w-md space-y-6">
          <div className="flex items-center gap-4">
            <Switch id="notifications" defaultChecked />
            <Label htmlFor="notifications" className="cursor-pointer">
              Enable notifications
            </Label>
          </div>

          <div className="flex items-center gap-4">
            <Switch id="darkmode" design={SwitchDesign.Graphical} />
            <Label htmlFor="darkmode" className="cursor-pointer">
              Dark mode
            </Label>
          </div>

          <div className="flex items-center gap-4">
            <Switch id="marketing" />
            <Label htmlFor="marketing" className="cursor-pointer">
              Receive marketing emails
            </Label>
          </div>
        </div>
      </section>

      {/* Form Integration */}
      <section id="form-integration" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Form Integration</h2>
        <p className="text-secondary-foreground mb-4">
          Works seamlessly with HTML forms.
        </p>
        <div className="max-w-md">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const data = Object.fromEntries(formData.entries());
              alert(`Form submitted:\n${JSON.stringify(data, null, 2)}`);
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <Switch
                  id="agree-terms"
                  name="agreeToTerms"
                  value="accepted"
                  required
                />
                <Label htmlFor="agree-terms" required className="cursor-pointer">
                  I agree to the terms and conditions
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <Switch
                  id="newsletter"
                  name="newsletter"
                  value="subscribed"
                  defaultChecked
                />
                <Label htmlFor="newsletter" className="cursor-pointer">
                  Subscribe to newsletter
                </Label>
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90"
            >
              Submit
            </button>
          </form>
        </div>
      </section>

      {/* Accessibility */}
      <section id="accessibility" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Accessibility</h2>
        <p className="text-secondary-foreground mb-4">
          Switch with accessibility features.
        </p>
        <div className="max-w-md space-y-6">
          <div className="space-y-2">
            <Label>With Accessible Name</Label>
            <Switch accessibleName="Enable auto-save feature" defaultChecked />
          </div>

          <div className="space-y-2">
            <Label>With Tooltip</Label>
            <Switch
              accessibleName="Real-time notifications"
              tooltip="Enable to receive real-time notifications"
              defaultChecked
            />
          </div>

          <div className="space-y-2">
            <Label id="wifi-label">Wi-Fi Connection</Label>
            <Switch accessibleNameRef="wifi-label" design={SwitchDesign.Graphical} defaultChecked />
          </div>
        </div>
      </section>

      {/* Animation Showcase */}
      <section id="seamless-animations" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Seamless Animations</h2>
        <p className="text-secondary-foreground mb-4">
          All transitions use smooth 300ms ease-in-out animations for a polished feel.
        </p>
        <div className="max-w-2xl space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Default</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Switch accessibleName="Default animation 1" />
                  <Switch accessibleName="Default animation 2" defaultChecked />
                  <Switch accessibleName="Default animation 3" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Graphical Design</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Switch accessibleName="Graphical animation 1" design={SwitchDesign.Graphical} />
                  <Switch accessibleName="Graphical animation 2" design={SwitchDesign.Graphical} defaultChecked />
                  <Switch accessibleName="Graphical animation 3" design={SwitchDesign.Graphical} />
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    accessibleName="Theme toggle 1"
                    design={SwitchDesign.Graphical}
                    iconOn={<Sun className="h-3 w-3 text-yellow-500" />}
                    iconOff={<Moon className="h-3 w-3 text-slate-400" />}
                    checked={themeToggle1}
                    onChange={(detail) => setThemeToggle1(detail.checked)}
                    className={themeToggle1 ? "bg-yellow-100 border-yellow-300" : "bg-slate-800 border-slate-700"}
                  />
                  <Switch
                    accessibleName="Theme toggle 2"
                    design={SwitchDesign.Graphical}
                    iconOn={<Sun className="h-3 w-3 text-yellow-500" />}
                    iconOff={<Moon className="h-3 w-3 text-slate-400" />}
                    checked={themeToggle2}
                    onChange={(detail) => setThemeToggle2(detail.checked)}
                    className={themeToggle2 ? "bg-yellow-100 border-yellow-300" : "bg-slate-800 border-slate-700"}
                  />
                  <Switch
                    accessibleName="Theme toggle 3"
                    design={SwitchDesign.Graphical}
                    iconOn={<Sun className="h-3 w-3 text-yellow-500" />}
                    iconOff={<Moon className="h-3 w-3 text-slate-400" />}
                    checked={themeToggle3}
                    onChange={(detail) => setThemeToggle3(detail.checked)}
                    className={themeToggle3 ? "bg-yellow-100 border-yellow-300" : "bg-slate-800 border-slate-700"}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    accessibleName="Volume toggle 1"
                    design={SwitchDesign.Graphical}
                    iconOn={<Volume2 className="h-3 w-3 text-green-600 animate-pulse" />}
                    iconOff={<VolumeX className="h-3 w-3 text-red-600" />}
                    checked={volumeToggle1}
                    onChange={(detail) => setVolumeToggle1(detail.checked)}
                    className={
                      volumeToggle1
                        ? "bg-gradient-to-r from-green-100 to-green-200 border-green-400 shadow-lg hover:shadow-xl transition-all"
                        : "bg-gradient-to-r from-red-100 to-red-200 border-red-400 shadow-lg hover:shadow-xl transition-all"
                    }
                  />
                  <Switch
                    accessibleName="Volume toggle 2"
                    design={SwitchDesign.Graphical}
                    iconOn={<Volume2 className="h-3 w-3 text-green-600 animate-pulse" />}
                    iconOff={<VolumeX className="h-3 w-3 text-red-600" />}
                    checked={volumeToggle2}
                    onChange={(detail) => setVolumeToggle2(detail.checked)}
                    className={
                      volumeToggle2
                        ? "bg-gradient-to-r from-green-100 to-green-200 border-green-400 shadow-lg hover:shadow-xl transition-all"
                        : "bg-gradient-to-r from-red-100 to-red-200 border-red-400 shadow-lg hover:shadow-xl transition-all"
                    }
                  />
                  <Switch
                    accessibleName="Volume toggle 3"
                    design={SwitchDesign.Graphical}
                    iconOn={<Volume2 className="h-3 w-3 text-green-600 animate-pulse" />}
                    iconOff={<VolumeX className="h-3 w-3 text-red-600" />}
                    checked={volumeToggle3}
                    onChange={(detail) => setVolumeToggle3(detail.checked)}
                    className={
                      volumeToggle3
                        ? "bg-gradient-to-r from-green-100 to-green-200 border-green-400 shadow-lg hover:shadow-xl transition-all"
                        : "bg-gradient-to-r from-red-100 to-red-200 border-red-400 shadow-lg hover:shadow-xl transition-all"
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Constrained Container – Issue #259 */}
      <section id="constrained-container" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Constrained Container</h2>
        <p className="text-secondary-foreground mb-4">
          Testing min-width behavior when the switch is inside narrow or shrinking containers.
        </p>
        <div className="space-y-6">
          {/* Narrow fixed-width container */}
          <div>
            <h3 className="text-sm font-medium mb-2 text-muted-foreground">Fixed 24px-wide container</h3>
            <div className="flex items-center border border-dashed border-destructive p-1" style={{ width: 24 }}>
              <Switch accessibleName="Narrow container switch" />
            </div>
          </div>

          {/* Flex row with long text siblings that steal space */}
          <div>
            <h3 className="text-sm font-medium mb-2 text-muted-foreground">Flex row — long sibling text steals space</h3>
            <div className="flex items-center gap-2 border border-dashed border-destructive p-2" style={{ width: 120 }}>
              <span className="truncate text-sm">Very long label that takes all space</span>
              <Switch accessibleName="Flex row switch" />
            </div>
          </div>

          {/* Same but with Graphical design */}
          <div>
            <h3 className="text-sm font-medium mb-2 text-muted-foreground">Graphical — flex row with long sibling</h3>
            <div className="flex items-center gap-2 border border-dashed border-destructive p-2" style={{ width: 120 }}>
              <span className="truncate text-sm">Very long label that takes all space</span>
              <Switch accessibleName="Graphical flex row switch" design={SwitchDesign.Graphical} />
            </div>
          </div>

          {/* Grid with tiny column */}
          <div>
            <h3 className="text-sm font-medium mb-2 text-muted-foreground">CSS Grid — 1fr / auto columns (narrow viewport)</h3>
            <div className="grid border border-dashed border-destructive p-2" style={{ gridTemplateColumns: "1fr auto", width: 100 }}>
              <span className="truncate text-sm">Label</span>
              <Switch accessibleName="Grid switch" defaultChecked />
            </div>
          </div>

          {/* Multiple switches in a very narrow flex container */}
          <div>
            <h3 className="text-sm font-medium mb-2 text-muted-foreground">Multiple switches — 80px flex container</h3>
            <div className="flex items-center gap-1 border border-dashed border-destructive p-1" style={{ width: 80 }}>
              <Switch accessibleName="Narrow switch 1" />
              <Switch accessibleName="Narrow switch 2" defaultChecked />
              <Switch accessibleName="Narrow graphical switch" design={SwitchDesign.Graphical} />
            </div>
          </div>
        </div>
      </section>

      {/* Usage Example */}
      <section id="usage-example" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-4">Usage Example</h2>
        <CodeBlock
          language="tsx"
          code={`import { Switch, SwitchDesign } from "@sap-ui/fx-components";

const [checked, setChecked] = useState(false);

// Basic switch
<Switch
  checked={checked}
  onChange={(detail) => setChecked(detail.checked)}
/>

// Graphical design with custom icons
<Switch
  design={SwitchDesign.Graphical}
  iconOn={<Sun className="h-3 w-3" />}
  iconOff={<Moon className="h-3 w-3" />}
  checked={checked}
  onChange={(detail) => setChecked(detail.checked)}
/>

// Disabled switch
<Switch disabled defaultChecked />

// With label and form integration
<Switch id="notifications" name="notifications" value="on" />
<Label htmlFor="notifications">Enable notifications</Label>`}
        />
      </section>
    </div>
  );
}
