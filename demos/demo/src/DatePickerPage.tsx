import { useState } from "react";
import {
  DatePicker,
  DatePickerSelectionMode,
  DatePickerSize,
  ValueState,
  DatePickerChangeDetail,
  DateRangePickerChangeDetail,
  Label,
  Button,
  ButtonDesign,
} from "@sap-ui/fx-components";
import { CodeBlock } from "./components/CodeBlock";

export function DatePickerPage() {
  const toISO = (d: Date) => d.toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState("");
  const [controlledDate, setControlledDate] = useState(new Date().toISOString().slice(0, 10));
  const [rangeValue, setRangeValue] = useState("");

  const handleChange = (detail: DatePickerChangeDetail) => {
    console.log("onChange:", detail);
    setSelectedDate(detail.value);
  };

  const handleRangeChange = (detail: DatePickerChangeDetail | DateRangePickerChangeDetail) => {
    console.log("onRangeChange:", detail);
    setRangeValue(detail.value);
  };

  return (
    <div className="space-y-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">DatePicker</h1>
        <code className="text-sm text-primary/70 font-mono">{'import { DatePicker } from "@sap-ui/fx-components"'}</code>
      </header>

      {/* Basic DatePicker */}
      <section id="basic-datepicker" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Basic DatePicker</h2>
        <p className="text-secondary-foreground mb-4">
          Simple date selection with calendar popover.
        </p>
        <div className="max-w-md space-y-4">
          <div>
            <Label htmlFor="datepicker-basic">Select Date (Large)</Label>
            <DatePicker
              id="datepicker-basic"
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="datepicker-basic-medium">Select Date (Medium)</Label>
            <DatePicker
              id="datepicker-basic-medium"
              size={DatePickerSize.Medium}
              onChange={handleChange}
            />
          </div>
          <p className="text-sm text-secondary-foreground">
            Selected: {selectedDate || "(none)"}
          </p>
        </div>
      </section>

      {/* Controlled DatePicker */}
      <section id="controlled-datepicker" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Controlled DatePicker</h2>
        <p className="text-secondary-foreground mb-4">
          Date value is controlled by parent component.
        </p>
        <div className="max-w-md space-y-4">
          <div>
            <Label htmlFor="datepicker-controlled">Date</Label>
            <DatePicker
              id="datepicker-controlled"
              value={controlledDate}
              onChange={(detail) => setControlledDate(detail.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button
              design={ButtonDesign.Secondary}
              onClick={() => setControlledDate(toISO(new Date()))}
            >
              Today
            </Button>
            <Button
              design={ButtonDesign.Tertiary}
              onClick={() => setControlledDate("")}
            >
              Clear
            </Button>
          </div>
        </div>
      </section>

      {/* Date Range Picker */}
      <section id="date-range-picker" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Date Range Picker</h2>
        <p className="text-secondary-foreground mb-4">
          Select a date range with start and end dates.
        </p>
        <div className="max-w-md space-y-4">
          <div>
            <Label htmlFor="datepicker-range">Date Range</Label>
            <DatePicker
              id="datepicker-range"
              selectionMode={DatePickerSelectionMode.Range}
              onChange={handleRangeChange}
            />
          </div>
          <p className="text-sm text-secondary-foreground">
            Selected: {rangeValue || "(none)"}
          </p>
        </div>
      </section>

      {/* Date Range with Custom Delimiter */}
      <section id="date-range-with-custom-delimiter" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Date Range with Custom Delimiter</h2>
        <p className="text-secondary-foreground mb-4">
          Custom delimiter between start and end dates.
        </p>
        <div className="max-w-md space-y-4">
          <div>
            <Label htmlFor="datepicker-range-custom">Date Range (Custom)</Label>
            <DatePicker
              id="datepicker-range-custom"
              selectionMode={DatePickerSelectionMode.Range}
              delimiter=" to "
            />
          </div>
        </div>
      </section>

      {/* Flexible Date Input */}
      <section id="flexible-date-input" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Flexible Date Input</h2>
        <p className="text-secondary-foreground mb-4">
          Type dates in various formats - the picker will understand them!
        </p>
        <div className="max-w-2xl space-y-4">
          <div>
            <Label htmlFor="datepicker-flexible">Try Different Formats</Label>
            <DatePicker
              id="datepicker-flexible"
            />
          </div>
          <div className="text-sm text-secondary-foreground space-y-2">
            <p className="font-semibold">Supported formats (examples for March 15, 2026):</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><code>3/15/2026</code> - Short numeric</li>
              <li><code>03/15/2026</code> - Padded numeric</li>
              <li><code>March 15, 2026</code> - Long month name</li>
              <li><code>Mar 15, 2026</code> - Short month name</li>
              <li><code>15 March 2026</code> - Day first</li>
              <li><code>2026-03-15</code> - ISO format</li>
              <li><code>15.03.2026</code> - European format</li>
              <li><code>tomorrow</code>, <code>today</code>, <code>yesterday</code> - Natural language</li>
              <li><code>next friday</code>, <code>last monday</code> - Relative dates</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Flexible Range Input */}
      <section id="flexible-range-input" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Flexible Range Input</h2>
        <p className="text-secondary-foreground mb-4">
          Type date ranges with any delimiter or natural language.
        </p>
        <div className="max-w-2xl space-y-4">
          <div>
            <Label htmlFor="datepicker-flexible-range">Try Different Range Formats</Label>
            <DatePicker
              id="datepicker-flexible-range"
              selectionMode={DatePickerSelectionMode.Range}
            />
          </div>
          <div className="text-sm text-secondary-foreground space-y-2">
            <p className="font-semibold">Supported range formats:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><code>3/1/2026 - 3/15/2026</code> - With dash</li>
              <li><code>March 1 to March 15</code> - With "to"</li>
              <li><code>Mar 1 through Mar 15, 2026</code> - With "through"</li>
              <li><code>01.03.2026..15.03.2026</code> - With double dots</li>
              <li><code>March 1 - March 15, 2026</code> - Month name ranges</li>
              <li><code>Jan 1 until Jan 31</code> - With "until"</li>
              <li><code>3/1/26 to 3/15/26</code> - Short year format</li>
            </ul>
            <p className="mt-2 italic">The picker automatically reformats to your preferred delimiter on blur.</p>
          </div>
        </div>
      </section>

      {/* Value States */}
      <section id="value-states" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Value States</h2>
        <p className="text-secondary-foreground mb-4">
          Different states for validation feedback.
        </p>
        <div className="max-w-md space-y-6">
          <div>
            <Label htmlFor="datepicker-positive">Positive</Label>
            <DatePicker
              id="datepicker-positive"
              valueState={ValueState.Positive}
              valueStateMessage="Date is valid!"
              defaultValue={toISO(new Date())}
            />
          </div>

          <div>
            <Label htmlFor="datepicker-negative">Negative</Label>
            <DatePicker
              id="datepicker-negative"
              valueState={ValueState.Negative}
              valueStateMessage="Please select a valid date."
            />
          </div>

          <div>
            <Label htmlFor="datepicker-critical">Critical</Label>
            <DatePicker
              id="datepicker-critical"
              valueState={ValueState.Critical}
              valueStateMessage="Selected date is outside working hours."
            />
          </div>

          <div>
            <Label htmlFor="datepicker-information">Information</Label>
            <DatePicker
              id="datepicker-information"
              valueState={ValueState.Information}
              valueStateMessage="Tip: Click the calendar icon to open the date picker."
            />
          </div>
        </div>
      </section>

      {/* Date Constraints */}
      <section id="date-constraints" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Date Constraints</h2>
        <p className="text-secondary-foreground mb-4">
          Set minimum and maximum selectable dates.
        </p>
        <div className="max-w-md space-y-6">
          <div>
            <Label htmlFor="datepicker-minmax">Date Range (Next 30 days)</Label>
            <DatePicker
              id="datepicker-minmax"
              minDate={toISO(new Date())}
              maxDate={toISO(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))}
            />
          </div>

          <div>
            <Label htmlFor="datepicker-future">Future Dates Only</Label>
            <DatePicker
              id="datepicker-future"
              minDate={toISO(new Date())}
            />
          </div>
        </div>
      </section>

      {/* States */}
      <section id="states" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">States</h2>
        <p className="text-secondary-foreground mb-4">
          Disabled, readonly, and required states.
        </p>

        <h3 className="text-lg font-bold mb-4">Large — 40px</h3>
        <div className="max-w-md space-y-6 mb-8">
          <div>
            <Label htmlFor="datepicker-disabled">Disabled</Label>
            <DatePicker
              id="datepicker-disabled"
              disabled
              defaultValue={toISO(new Date())}
            />
          </div>

          <div>
            <Label htmlFor="datepicker-readonly">Readonly</Label>
            <DatePicker
              id="datepicker-readonly"
              readonly
              defaultValue={toISO(new Date())}
            />
          </div>

          <div>
            <Label htmlFor="datepicker-required" required>Required</Label>
            <DatePicker
              id="datepicker-required"
              required
            />
          </div>
        </div>

        <h3 className="text-lg font-bold mb-4">Medium — 32px</h3>
        <div className="max-w-md space-y-6">
          <div>
            <Label htmlFor="datepicker-disabled-md">Disabled</Label>
            <DatePicker
              id="datepicker-disabled-md"
              disabled
              size={DatePickerSize.Medium}
              defaultValue={toISO(new Date())}
            />
          </div>

          <div>
            <Label htmlFor="datepicker-readonly-md">Readonly</Label>
            <DatePicker
              id="datepicker-readonly-md"
              readonly
              size={DatePickerSize.Medium}
              defaultValue={toISO(new Date())}
            />
          </div>

          <div>
            <Label htmlFor="datepicker-required-md" required>Required</Label>
            <DatePicker
              id="datepicker-required-md"
              required
              size={DatePickerSize.Medium}
            />
          </div>
        </div>
      </section>

      {/* Format Options */}
      <section id="format-options" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Format Options</h2>
        <p className="text-secondary-foreground mb-4">
          Customize display format for different locales and preferences.
        </p>
        <div className="max-w-md space-y-6">
          <div>
            <Label htmlFor="datepicker-us">US Format (MM/dd/yyyy)</Label>
            <DatePicker
              id="datepicker-us"
              displayFormat="MM/dd/yyyy"
            />
          </div>

          <div>
            <Label htmlFor="datepicker-eu">European Format (dd.MM.yyyy)</Label>
            <DatePicker
              id="datepicker-eu"
              displayFormat="dd.MM.yyyy"
            />
          </div>

          <div>
            <Label htmlFor="datepicker-iso">ISO Format (yyyy-MM-dd)</Label>
            <DatePicker
              id="datepicker-iso"
              displayFormat="yyyy-MM-dd"
            />
          </div>

          <div>
            <Label htmlFor="datepicker-long">Long Format (MMMM d, yyyy)</Label>
            <DatePicker
              id="datepicker-long"
              displayFormat="MMMM d, yyyy"
            />
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
              alert(`Submitted:\nStart Date: ${formData.get("startDate")}\nEnd Date: ${formData.get("endDate")}`);
            }}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="form-start-date" required>
                Start Date
              </Label>
              <DatePicker
                id="form-start-date"
                name="startDate"
                required
              />
            </div>
            <div>
              <Label htmlFor="form-end-date" required>
                End Date
              </Label>
              <DatePicker
                id="form-end-date"
                name="endDate"
                required
              />
            </div>
            <Button design={ButtonDesign.Primary} type="submit">
              Submit
            </Button>
          </form>
        </div>
      </section>

      {/* Keyboard Navigation */}
      <section id="keyboard-navigation" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Keyboard Navigation</h2>
        <p className="text-secondary-foreground mb-6">
          Full keyboard support following UI5 Web Components specification.
        </p>

        <div className="space-y-6">
          {/* Input Field shortcuts */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Input Field (Calendar Closed)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 font-semibold">Key</th>
                    <th className="text-left py-2 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr><td className="py-2 pr-4"><kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">F4</kbd></td><td className="py-2">Open calendar popover</td></tr>
                  <tr><td className="py-2 pr-4"><kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">Alt + ↓</kbd> / <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">Alt + ↑</kbd></td><td className="py-2">Open calendar popover</td></tr>
                  <tr><td className="py-2 pr-4"><kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">Page Up</kbd></td><td className="py-2">Increment day by 1</td></tr>
                  <tr><td className="py-2 pr-4"><kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">Page Down</kbd></td><td className="py-2">Decrement day by 1</td></tr>
                  <tr><td className="py-2 pr-4"><kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">Shift + Page Up / Down</kbd></td><td className="py-2">Increment / decrement month by 1</td></tr>
                  <tr><td className="py-2 pr-4"><kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">Ctrl + Shift + Page Up / Down</kbd></td><td className="py-2">Increment / decrement year by 1</td></tr>
                  <tr><td className="py-2 pr-4"><kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">Enter</kbd></td><td className="py-2">Parse and commit the typed value</td></tr>
                  <tr><td className="py-2 pr-4"><kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">Escape</kbd></td><td className="py-2">Close calendar (when open)</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Day Picker */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Day Picker (Calendar Grid)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 font-semibold">Key</th>
                    <th className="text-left py-2 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr><td className="py-2 pr-4"><kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">← → ↑ ↓</kbd></td><td className="py-2">Navigate between days</td></tr>
                  <tr><td className="py-2 pr-4"><kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">Page Up / Down</kbd></td><td className="py-2">Previous / next month</td></tr>
                  <tr><td className="py-2 pr-4"><kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">Shift + Page Up / Down</kbd></td><td className="py-2">Previous / next year</td></tr>
                  <tr><td className="py-2 pr-4"><kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">Ctrl + Shift + Page Up / Down</kbd></td><td className="py-2">Navigate by 10 years</td></tr>
                  <tr><td className="py-2 pr-4"><kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">Home / End</kbd></td><td className="py-2">First / last day of week</td></tr>
                  <tr><td className="py-2 pr-4"><kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">Ctrl + Home / End</kbd></td><td className="py-2">First / last day of month</td></tr>
                  <tr><td className="py-2 pr-4"><kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">Enter / Space</kbd></td><td className="py-2">Select focused day</td></tr>
                  <tr><td className="py-2 pr-4"><kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">F4</kbd></td><td className="py-2">Switch to month picker</td></tr>
                  <tr><td className="py-2 pr-4"><kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">Shift + F4</kbd></td><td className="py-2">Switch to year picker</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Month & Year Picker */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Month & Year Picker</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 font-semibold">Key</th>
                    <th className="text-left py-2 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr><td className="py-2 pr-4"><kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">← → ↑ ↓</kbd></td><td className="py-2">Navigate between items</td></tr>
                  <tr><td className="py-2 pr-4"><kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">Page Up / Down</kbd></td><td className="py-2">Previous / next year (month picker) or year range (year picker)</td></tr>
                  <tr><td className="py-2 pr-4"><kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">Home / End</kbd></td><td className="py-2">First / last item in current row</td></tr>
                  <tr><td className="py-2 pr-4"><kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">Ctrl + Home / End</kbd></td><td className="py-2">First / last item in view</td></tr>
                  <tr><td className="py-2 pr-4"><kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">Enter / Space</kbd></td><td className="py-2">Select focused item</td></tr>
                  <tr><td className="py-2 pr-4"><kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">F4</kbd></td><td className="py-2">Switch to day/month picker</td></tr>
                  <tr><td className="py-2 pr-4"><kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">Shift + F4</kbd></td><td className="py-2">Switch to year picker</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Interactive test area */}
        <div className="mt-8 pt-6 border-t border-border">
          <h3 className="text-lg font-semibold mb-3">Try It</h3>
          <p className="text-secondary-foreground mb-4">
            Focus the input below and try the keyboard shortcuts listed above.
          </p>
          <div className="max-w-md">
            <Label htmlFor="datepicker-keyboard">Keyboard Navigation Test</Label>
            <DatePicker
              id="datepicker-keyboard"
              placeholder="Focus here and try keyboard shortcuts"
            />
          </div>
        </div>
      </section>

      {/* Usage Example */}
      <section id="usage-example" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-4">Usage Example</h2>
        <CodeBlock
          language="tsx"
          code={`import { DatePicker } from "@sap-ui/fx-components";

// Basic date picker
<DatePicker
  value={date}
  onChange={(detail) => setDate(detail.value)}
/>

// With display format and constraints
<DatePicker
  displayFormat="MM/dd/yyyy"
  minDate="2026-01-01"
  maxDate="2026-12-31"
  onChange={(detail) => console.log(detail.value)}
/>

// Date range picker
<DatePicker
  selectionMode="Range"
  delimiter=" to "
  onChange={(detail) => console.log(detail.value)}
/>

// With value state and form integration
<DatePicker
  name="startDate"
  required
  valueState="Negative"
  valueStateMessage="Please select a valid date."
  onChange={(detail) => setDate(detail.value)}
/>`}
        />
      </section>
    </div>
  );
}
