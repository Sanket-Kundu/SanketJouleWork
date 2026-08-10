import { useState } from 'react';
import { Calendar, CalendarSelectionChangeDetail, isRTLLocale } from '@sap-ui/fx-components';
import { useAppLocale } from './main';
import { CodeBlock } from './components/CodeBlock';

function App() {
  const [singleSelection, setSingleSelection] = useState<string[]>([]);
  const [multipleSelection, setMultipleSelection] = useState<string[]>([]);
  const [rangeSelection, setRangeSelection] = useState<{ start: string | null; end: string | null }>({
    start: null,
    end: null,
  });

  // Use global locale from header
  const { locale, dir } = useAppLocale();
  const isRTL = isRTLLocale(locale);

  const handleSingleSelection = (detail: CalendarSelectionChangeDetail) => {
    setSingleSelection(detail.selectedValues);
  };

  const handleMultipleSelection = (detail: CalendarSelectionChangeDetail) => {
    setMultipleSelection(detail.selectedValues);
  };

  const handleRangeSelection = (detail: CalendarSelectionChangeDetail) => {
    const [start, end] = detail.selectedValues;
    setRangeSelection({ start: start || null, end: end || null });
  };

  return (
    <div className="space-y-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Calendar</h1>
        <code className="text-sm text-primary/70 font-mono">{'import { Calendar } from "@sap-ui/fx-components"'}</code>
      </header>

      {/* Current Locale Info */}
      <section className="p-4 border border-sapphire-border rounded-lg bg-sapphire-bg-secondary/50">
        <div className="flex items-center gap-4 text-sm">
          <span><strong>Current Locale:</strong> {locale}</span>
          <span><strong>Direction:</strong> {dir.toUpperCase()}</span>
          <span className={`px-2 py-0.5 rounded text-xs ${isRTL ? 'bg-sapphire-warning-bg text-sapphire-warning' : 'bg-sapphire-information-bg text-sapphire-information'}`}>
            {isRTL ? 'RTL' : 'LTR'}
          </span>
        </div>
      </section>

      {/* Single Selection */}
      <section className="p-6 border border-sapphire-border rounded-lg bg-sapphire-card-bg">
        <h2 className="text-2xl font-semibold mb-2">Single Selection</h2>
        <p className="text-secondary-foreground mb-4">Select a single date from the calendar.</p>
        <div className="flex flex-col gap-4">
          <div className="w-full max-w-sm">
            <Calendar selectionMode="Single" locale={locale} onSelectionChange={handleSingleSelection} />
          </div>
          <div className="p-4 bg-sapphire-bg-secondary rounded-md font-mono text-sm">
            <strong>Selected:</strong> {singleSelection.join(', ') || 'None'}
          </div>
        </div>
      </section>

      {/* Multiple Selection */}
      <section className="p-6 border border-sapphire-border rounded-lg bg-sapphire-card-bg">
        <h2 className="text-2xl font-semibold mb-2">Multiple Selection</h2>
        <p className="text-secondary-foreground mb-4">Select multiple independent dates.</p>
        <div className="flex flex-col gap-4">
          <div className="w-full max-w-sm">
            <Calendar selectionMode="Multiple" locale={locale} onSelectionChange={handleMultipleSelection} />
          </div>
          <div className="p-4 bg-sapphire-bg-secondary rounded-md font-mono text-sm">
            <strong>Selected:</strong> {multipleSelection.join(', ') || 'None'}
          </div>
        </div>
      </section>

      {/* Range Selection */}
      <section className="p-6 border border-sapphire-border rounded-lg bg-sapphire-card-bg">
        <h2 className="text-2xl font-semibold mb-2">Range Selection</h2>
        <p className="text-secondary-foreground mb-4">Select a date range with start and end dates.</p>
        <div className="flex flex-col gap-4">
          <div className="w-full max-w-sm">
            <Calendar selectionMode="Range" locale={locale} onSelectionChange={handleRangeSelection} />
          </div>
          <div className="p-4 bg-sapphire-bg-secondary rounded-md font-mono text-sm">
            <strong>Start:</strong> {rangeSelection.start || 'Not set'}
            <br />
            <strong>End:</strong> {rangeSelection.end || 'Not set'}
          </div>
        </div>
      </section>

      {/* Week Numbers */}
      <section className="p-6 border border-sapphire-border rounded-lg bg-sapphire-card-bg">
        <h2 className="text-2xl font-semibold mb-2">With Week Numbers</h2>
        <p className="text-secondary-foreground mb-4">Display week numbers using different numbering schemes.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2">ISO 8601</h3>
            <div className="w-full max-w-sm">
              <Calendar hideWeekNumbers={false} calendarWeekNumbering="ISO_8601" locale={locale} />
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-2">Western Traditional</h3>
            <div className="w-full max-w-sm">
              <Calendar hideWeekNumbers={false} calendarWeekNumbering="WesternTraditional" locale={locale} />
            </div>
          </div>
        </div>
      </section>

      {/* Special Dates */}
      <section className="p-6 border border-sapphire-border rounded-lg bg-sapphire-card-bg">
        <h2 className="text-2xl font-semibold mb-2">Special Dates with Legend</h2>
        <p className="text-secondary-foreground mb-4">Highlight specific dates with custom colors and display a legend.</p>
        <div className="w-full max-w-sm">
          <Calendar
            showLegend
            locale={locale}
            specialDates={[
              { date: '2024-12-25', type: 'Type05', tooltip: 'Christmas' },
              { date: '2024-12-31', type: 'Type01', tooltip: "New Year's Eve" },
              { date: '2025-01-01', type: 'Type07', tooltip: "New Year's Day" },
              { date: '2024-12-24', type: 'Type05', tooltip: "Christmas Eve" },
              { date: '2024-12-26', type: 'Type05', tooltip: "Boxing Day" },
            ]}
            legendItems={[
            { type: 'Type05', text: 'Holiday' },
            { type: 'Type01', text: 'Event' },
            { type: 'Type07', text: 'Celebration' },
          ]}
          focusedDate="2024-12-25"
        />
        </div>
      </section>

      {/* Disabled Dates */}
      <section className="p-6 border border-sapphire-border rounded-lg bg-sapphire-card-bg">
        <h2 className="text-2xl font-semibold mb-2">Disabled Dates</h2>
        <p className="text-secondary-foreground mb-4">Restrict selection to specific date ranges.</p>
        <div className="w-full max-w-sm">
          <Calendar
            locale={locale}
            minDate="2024-01-01"
            maxDate="2024-12-31"
            disabledDates={[
              { startDate: '2024-12-24', endDate: '2024-12-26' },
              { startDate: '2024-07-01', endDate: '2024-07-31' },
            ]}
          />
        </div>
      </section>

      {/* Responsive Sizing */}
      <section className="p-6 border border-sapphire-border rounded-lg bg-sapphire-card-bg">
        <h2 className="text-2xl font-semibold mb-2">Responsive Sizing</h2>
        <p className="text-secondary-foreground mb-4">
          The calendar automatically adapts to its container size. Try resizing your browser window!
        </p>
        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">Small Container (280px)</h3>
            <div className="w-[280px] border-2 border-dashed border-sapphire-border p-2 rounded-lg">
              <Calendar selectionMode="Single" locale={locale} />
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-2">Medium Container (384px / max-w-sm)</h3>
            <div className="max-w-sm border-2 border-dashed border-sapphire-border p-2 rounded-lg">
              <Calendar selectionMode="Single" locale={locale} />
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-2">Large Container (512px / max-w-lg)</h3>
            <div className="max-w-lg border-2 border-dashed border-sapphire-border p-2 rounded-lg">
              <Calendar selectionMode="Single" locale={locale} />
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-2">Full Width Container</h3>
            <div className="w-full border-2 border-dashed border-sapphire-border p-2 rounded-lg">
              <Calendar selectionMode="Single" locale={locale} />
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-2">In a Grid (2 Columns)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border-2 border-dashed border-sapphire-border p-2 rounded-lg">
                <Calendar selectionMode="Single" locale={locale} />
              </div>
              <div className="border-2 border-dashed border-sapphire-border p-2 rounded-lg">
                <Calendar selectionMode="Range" locale={locale} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="p-6 border border-sapphire-border rounded-lg bg-sapphire-card-bg">
        <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
        <ul className="list-disc list-inside space-y-2 text-secondary-foreground">
          <li>
            <strong className="text-foreground">3 Selection Modes:</strong> Single, Multiple, and Range selection
          </li>
          <li>
            <strong className="text-foreground">Keyboard Navigation:</strong> Full keyboard support with arrow keys,
            Page Up/Down, Home/End, and Ctrl combinations
          </li>
          <li>
            <strong className="text-foreground">Accessibility:</strong> WCAG 2.1 Level AA compliant with comprehensive
            ARIA support, screen reader announcements, and keyboard shortcuts
          </li>
          <li>
            <strong className="text-foreground">Internationalization:</strong> 30+ locales supported with
            automatic RTL layout for Arabic, Hebrew, and other RTL languages
          </li>
          <li>
            <strong className="text-foreground">Week Numbers:</strong> Multiple numbering schemes (ISO 8601,
            Western, Middle Eastern)
          </li>
          <li>
            <strong className="text-foreground">Special Dates:</strong> Highlight dates with 20 custom types and
            tooltips
          </li>
          <li>
            <strong className="text-foreground">Disabled Dates:</strong> Define non-selectable date ranges
          </li>
          <li>
            <strong className="text-foreground">Min/Max Boundaries:</strong> Restrict selectable date ranges
          </li>
          <li>
            <strong className="text-foreground">Multiple Views:</strong> Day, Month, and Year pickers
          </li>
          <li>
            <strong className="text-foreground">Responsive Design:</strong> Automatically adapts to container size,
            works in flex, grid, and fixed-width layouts
          </li>
          <li>
            <strong className="text-foreground">Tailwind Styling:</strong> Fully customizable with Tailwind CSS
            classes
          </li>
          <li>
            <strong className="text-foreground">High Contrast Support:</strong> Adapts to user's high contrast
            theme preferences
          </li>
        </ul>
      </section>

      {/* Keyboard Shortcuts */}
      <section className="p-6 border border-sapphire-border rounded-lg bg-sapphire-card-bg">
        <h2 className="text-2xl font-semibold mb-4">Keyboard Shortcuts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-3">Day Picker Navigation</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-secondary-foreground">Arrow Keys</span>
                <kbd className="px-2 py-1 bg-sapphire-bg-secondary rounded text-xs font-mono">↑ ↓ ← →</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-foreground">Previous/Next Month</span>
                <kbd className="px-2 py-1 bg-sapphire-bg-secondary rounded text-xs font-mono">PageUp/PageDown</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-foreground">Previous/Next Year</span>
                <kbd className="px-2 py-1 bg-sapphire-bg-secondary rounded text-xs font-mono">Shift+PageUp/PageDown</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-foreground">First/Last of Week</span>
                <kbd className="px-2 py-1 bg-sapphire-bg-secondary rounded text-xs font-mono">Home/End</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-foreground">First/Last of Month</span>
                <kbd className="px-2 py-1 bg-sapphire-bg-secondary rounded text-xs font-mono">Ctrl+Home/End</kbd>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-3">View Switching</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-secondary-foreground">Month Picker</span>
                <kbd className="px-2 py-1 bg-sapphire-bg-secondary rounded text-xs font-mono">F4</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-foreground">Year Picker</span>
                <kbd className="px-2 py-1 bg-sapphire-bg-secondary rounded text-xs font-mono">Shift+F4</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-foreground">Select Date</span>
                <kbd className="px-2 py-1 bg-sapphire-bg-secondary rounded text-xs font-mono">Enter/Space</kbd>
              </div>
            </div>
          </div>
        </div>
        <p className="text-sm text-secondary-foreground mt-4">
          Try navigating the calendar above using only your keyboard!
        </p>
      </section>

      {/* Usage Example */}
      <section className="p-6 border border-sapphire-border rounded-lg bg-sapphire-card-bg">
        <h2 className="text-2xl font-semibold mb-4">Usage Example</h2>
        <CodeBlock
          language="tsx"
          code={`import { Calendar } from '@sap-ui/fx-components';
import { useState } from 'react';

function MyComponent() {
  const [selected, setSelected] = useState([]);

  return (
    <Calendar
      selectionMode="Single"
      onSelectionChange={(detail) => {
        console.log('Selected:', detail.selectedValues);
        setSelected(detail.selectedValues);
      }}
    />
  );
}`}
        />
      </section>
    </div>
  );
}

export default App;
