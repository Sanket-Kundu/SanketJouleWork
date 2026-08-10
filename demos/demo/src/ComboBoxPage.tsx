import { useState } from 'react';
import {
  ComboBox,
  ComboBoxItem,
  ComboBoxItemGroup,
  ComboBoxFilter,
  ComboBoxSize,
  ValueState,
  Button,
  Link,
} from '@sap-ui/fx-components';
import { CodeBlock } from "./components/CodeBlock";

const countries = [
  { name: 'United States', code: 'US', continent: 'North America' },
  { name: 'Canada', code: 'CA', continent: 'North America' },
  { name: 'Mexico', code: 'MX', continent: 'North America' },
  { name: 'Brazil', code: 'BR', continent: 'South America' },
  { name: 'Argentina', code: 'AR', continent: 'South America' },
  { name: 'United Kingdom', code: 'UK', continent: 'Europe' },
  { name: 'Germany', code: 'DE', continent: 'Europe' },
  { name: 'France', code: 'FR', continent: 'Europe' },
  { name: 'Italy', code: 'IT', continent: 'Europe' },
  { name: 'Spain', code: 'ES', continent: 'Europe' },
  { name: 'Japan', code: 'JP', continent: 'Asia' },
  { name: 'China', code: 'CN', continent: 'Asia' },
  { name: 'India', code: 'IN', continent: 'Asia' },
  { name: 'South Korea', code: 'KR', continent: 'Asia' },
  { name: 'Australia', code: 'AU', continent: 'Oceania' },
  { name: 'New Zealand', code: 'NZ', continent: 'Oceania' },
];

const groupedCountries = countries.reduce((acc, country) => {
  if (!acc[country.continent]) {
    acc[country.continent] = [];
  }
  acc[country.continent].push(country);
  return acc;
}, {} as Record<string, typeof countries>);

const colHeader = "font-medium text-sm text-secondary-foreground";
const colWidth = "w-[240px] min-w-[200px]";

const valueStates = [
  { state: ValueState.Positive, label: "Positive" },
  { state: ValueState.Negative, label: "Negative" },
  { state: ValueState.Critical, label: "Warning" },
  { state: ValueState.Information, label: "Information" },
] as const;

function StatesMatrix({
  countries,
  matrixClearValue,
  setMatrixClearValue,
}: {
  countries: { name: string; code: string; continent: string }[];
  matrixClearValue: string;
  setMatrixClearValue: (v: string) => void;
}) {
  const renderItems = () => countries.map((c) => <ComboBoxItem key={c.code} text={c.name} value={c.code} />);
  return (
    <section id="states-matrix" className="p-6 border border-border rounded-lg bg-card">
      <h2 className="text-2xl font-semibold mb-6">States Matrix</h2>

      {/* Large — 40px */}
      <div className="mb-10">
        <h3 className="text-lg font-bold mb-6">Large — 40px</h3>
        <div className="flex flex-wrap gap-8">
          <div className={colWidth}>
            <span className={colHeader}>Regular</span>
            <div className="mt-4 space-y-3">
              <ComboBox placeholder="Placeholder...">
                {renderItems()}
              </ComboBox>
              <ComboBox value="Germany">
                {renderItems()}
              </ComboBox>
              <ComboBox value={matrixClearValue} showClearIcon onInput={(v) => setMatrixClearValue(v)} onChange={(v) => setMatrixClearValue(v)}>
                {renderItems()}
              </ComboBox>
            </div>
          </div>
          <div className={colWidth}>
            <span className={colHeader}>Disabled</span>
            <div className="mt-4 space-y-3">
              <ComboBox placeholder="Placeholder..." disabled>
                {renderItems()}
              </ComboBox>
              <ComboBox value="Germany" disabled>
                {renderItems()}
              </ComboBox>
            </div>
          </div>
          <div className={colWidth}>
            <span className={colHeader}>Read only</span>
            <div className="mt-4 space-y-3">
              <ComboBox value="Germany" readonly>
                {renderItems()}
              </ComboBox>
            </div>
          </div>
        </div>
      </div>

      {/* Medium — 32px */}
      <div className="mb-10">
        <h3 className="text-lg font-bold mb-6">Medium — 32px</h3>
        <div className="flex flex-wrap gap-8">
          <div className={colWidth}>
            <span className={colHeader}>Regular</span>
            <div className="mt-4 space-y-3">
              <ComboBox placeholder="Placeholder..." size={ComboBoxSize.Medium}>
                {renderItems()}
              </ComboBox>
              <ComboBox value="Germany" size={ComboBoxSize.Medium}>
                {renderItems()}
              </ComboBox>
              <ComboBox value="Germany" showClearIcon size={ComboBoxSize.Medium}>
                {renderItems()}
              </ComboBox>
            </div>
          </div>
          <div className={colWidth}>
            <span className={colHeader}>Disabled</span>
            <div className="mt-4 space-y-3">
              <ComboBox placeholder="Placeholder..." disabled size={ComboBoxSize.Medium}>
                {renderItems()}
              </ComboBox>
              <ComboBox value="Germany" disabled size={ComboBoxSize.Medium}>
                {renderItems()}
              </ComboBox>
            </div>
          </div>
          <div className={colWidth}>
            <span className={colHeader}>Read only</span>
            <div className="mt-4 space-y-3">
              <ComboBox value="Germany" readonly size={ComboBoxSize.Medium}>
                {renderItems()}
              </ComboBox>
            </div>
          </div>
        </div>
      </div>

      {/* Value State — Large */}
      <div className="mb-10">
        <h3 className="text-lg font-bold mb-6">Value State — Large</h3>
        <div className="flex flex-wrap gap-8">
          <div className={colWidth}>
            <span className={colHeader}>Placeholder</span>
            <div className="mt-4 space-y-5">
              {valueStates.map(({ state }) => (
                <ComboBox
                  key={state}
                  placeholder="Placeholder..."
                  valueState={state}
                  valueStateMessage="Message text giving further context."
                >
                  {renderItems()}
                </ComboBox>
              ))}
            </div>
          </div>
          <div className={colWidth}>
            <span className={colHeader}>Regular</span>
            <div className="mt-4 space-y-5">
              {valueStates.map(({ state }) => (
                <ComboBox
                  key={state}
                  value="Germany"
                  valueState={state}
                  valueStateMessage="Message text giving further context."
                >
                  {renderItems()}
                </ComboBox>
              ))}
            </div>
          </div>
          <div className={colWidth}>
            <span className={colHeader}>With Action</span>
            <div className="mt-4 space-y-5">
              {valueStates.map(({ state }) => (
                <ComboBox
                  key={state}
                  value="Germany"
                  valueState={state}
                  valueStateMessage="Message text giving further context."
                  showClearIcon
                >
                  {renderItems()}
                </ComboBox>
              ))}
            </div>
          </div>
          <div className={colWidth}>
            <span className={colHeader}>Disabled</span>
            <div className="mt-4 space-y-5">
              {valueStates.map(({ state }) => (
                <ComboBox
                  key={state}
                  value="Germany"
                  valueState={state}
                  valueStateMessage="Message text giving further context."
                  disabled
                >
                  {renderItems()}
                </ComboBox>
              ))}
            </div>
          </div>
          <div className={colWidth}>
            <span className={colHeader}>Read only</span>
            <div className="mt-4 space-y-5">
              {valueStates.map(({ state }) => (
                <ComboBox
                  key={state}
                  value="Germany"
                  valueState={state}
                  valueStateMessage="Message text giving further context."
                  readonly
                >
                  {renderItems()}
                </ComboBox>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Value State — Medium */}
      <div>
        <h3 className="text-lg font-bold mb-6">Value State — Medium</h3>
        <div className="flex flex-wrap gap-8">
          <div className={colWidth}>
            <span className={colHeader}>Placeholder</span>
            <div className="mt-4 space-y-5">
              {valueStates.map(({ state }) => (
                <ComboBox
                  key={state}
                  placeholder="Placeholder..."
                  valueState={state}
                  valueStateMessage="Message text giving further context."
                  size={ComboBoxSize.Medium}
                >
                  {renderItems()}
                </ComboBox>
              ))}
            </div>
          </div>
          <div className={colWidth}>
            <span className={colHeader}>Regular</span>
            <div className="mt-4 space-y-5">
              {valueStates.map(({ state }) => (
                <ComboBox
                  key={state}
                  value="Germany"
                  valueState={state}
                  valueStateMessage="Message text giving further context."
                  size={ComboBoxSize.Medium}
                >
                  {renderItems()}
                </ComboBox>
              ))}
            </div>
          </div>
          <div className={colWidth}>
            <span className={colHeader}>With Action</span>
            <div className="mt-4 space-y-5">
              {valueStates.map(({ state }) => (
                <ComboBox
                  key={state}
                  value="Germany"
                  valueState={state}
                  valueStateMessage="Message text giving further context."
                  showClearIcon
                  size={ComboBoxSize.Medium}
                >
                  {renderItems()}
                </ComboBox>
              ))}
            </div>
          </div>
          <div className={colWidth}>
            <span className={colHeader}>Disabled</span>
            <div className="mt-4 space-y-5">
              {valueStates.map(({ state }) => (
                <ComboBox
                  key={state}
                  value="Germany"
                  valueState={state}
                  valueStateMessage="Message text giving further context."
                  disabled
                  size={ComboBoxSize.Medium}
                >
                  {renderItems()}
                </ComboBox>
              ))}
            </div>
          </div>
          <div className={colWidth}>
            <span className={colHeader}>Read only</span>
            <div className="mt-4 space-y-5">
              {valueStates.map(({ state }) => (
                <ComboBox
                  key={state}
                  value="Germany"
                  valueState={state}
                  valueStateMessage="Message text giving further context."
                  readonly
                  size={ComboBoxSize.Medium}
                >
                  {renderItems()}
                </ComboBox>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ComboBoxPage() {
  const [basicValue, setBasicValue] = useState('');
  const [selectedValueDemo, setSelectedValueDemo] = useState('');
  const [selectedCode, setSelectedCode] = useState<string | undefined>(undefined);
  const [groupedValue, setGroupedValue] = useState('');
  const [filterMode, setFilterMode] = useState<ComboBoxFilter>(ComboBoxFilter.StartsWithPerTerm);
  const [filterValue, setFilterValue] = useState('');
  const [valueStateValue, setValueStateValue] = useState('');
  const [valueState, setValueState] = useState<ValueState>(ValueState.None);
  const [clearableValue, setClearableValue] = useState('Germany');
  const [matrixClearValue, setMatrixClearValue] = useState('Germany');
  const [loadingValue, setLoadingValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const simulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="space-y-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">ComboBox</h1>
        <code className="text-sm text-primary/70 font-mono">{'import { ComboBox, ComboBoxItem } from "@sap-ui/fx-components"'}</code>
      </header>

      {/* Basic ComboBox */}
      <section id="basic-combobox" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Basic ComboBox</h2>
        <div className="max-w-md space-y-4">
          <ComboBox placeholder="Select a country...">
            {countries.map((c) => <ComboBoxItem key={c.code} text={c.name} value={c.code} />)}
          </ComboBox>
          <ComboBox placeholder="Select a country... (Medium)" size={ComboBoxSize.Medium}>
            {countries.map((c) => <ComboBoxItem key={c.code} text={c.name} value={c.code} />)}
          </ComboBox>
        </div>
      </section>

      {/* States Matrix */}
      <StatesMatrix
        countries={countries}
        matrixClearValue={matrixClearValue}
        setMatrixClearValue={setMatrixClearValue}
      />

      {/* Basic ComboBox (interactive) */}
      <section id="interactive-combobox" className="p-6 border border-border rounded-lg bg-card">
            <h2 className="text-2xl font-semibold mb-2">Interactive ComboBox</h2>
            <p className="text-secondary-foreground mb-4">
              Type to filter items. Use arrow keys to navigate, Enter to select.
            </p>
            <div className="flex flex-col gap-4 max-w-md">
              <ComboBox
                value={basicValue}
                placeholder="Select a country..."
                onInput={(v) => setBasicValue(v)}
                onChange={(v) => console.log('Changed:', v)}
                onSelectionChange={(detail) => console.log('Selection:', detail)}
              >
                {countries.map((country) => (
                  <ComboBoxItem
                    key={country.code}
                    text={country.name}
                    value={country.code}
                    additionalText={country.code}
                  />
                ))}
              </ComboBox>
              <div className="p-3 bg-muted rounded-md font-mono text-sm">
                <strong>Value:</strong> {basicValue || 'None'}
              </div>
            </div>
          </section>

          {/* Selected Value */}
          <section id="selected-value" className="p-6 border border-border rounded-lg bg-card">
            <h2 className="text-2xl font-semibold mb-2">Selected Value</h2>
            <p className="text-secondary-foreground mb-4">
              Use <code className="text-sm bg-muted px-1 rounded">selectedValue</code> to track the unique identifier (e.g. country code) separately from the display text.
            </p>
            <div className="flex flex-col gap-4 max-w-md">
              <ComboBox
                value={selectedValueDemo}
                selectedValue={selectedCode}
                placeholder="Select a country..."
                onInput={(v) => setSelectedValueDemo(v)}
                onSelectionChange={(detail) => {
                  setSelectedCode(detail.item?.value);
                }}
              >
                {countries.map((country) => (
                  <ComboBoxItem
                    key={country.code}
                    text={country.name}
                    value={country.code}
                    additionalText={country.code}
                  />
                ))}
              </ComboBox>
              <div className="p-3 bg-muted rounded-md font-mono text-sm space-y-1">
                <div><strong>Display text:</strong> {selectedValueDemo || 'None'}</div>
                <div><strong>Selected value:</strong> {selectedCode || 'None'}</div>
              </div>
            </div>
          </section>

          {/* Grouped Items */}
          <section id="grouped-items" className="p-6 border border-border rounded-lg bg-card">
            <h2 className="text-2xl font-semibold mb-2">Grouped Items</h2>
            <p className="text-secondary-foreground mb-4">
              Items organized into groups by continent. Group headers are not selectable.
            </p>
            <div className="flex flex-col gap-4 max-w-md">
              <ComboBox
                value={groupedValue}
                placeholder="Select a country..."
                onInput={(v) => setGroupedValue(v)}
              >
                {Object.entries(groupedCountries).map(([continent, items]) => (
                  <ComboBoxItemGroup key={continent} headerText={continent}>
                    {items.map((country) => (
                      <ComboBoxItem
                        key={country.code}
                        text={country.name}
                        value={country.code}
                        additionalText={country.code}
                      />
                    ))}
                  </ComboBoxItemGroup>
                ))}
              </ComboBox>
              <div className="p-3 bg-muted rounded-md font-mono text-sm">
                <strong>Value:</strong> {groupedValue || 'None'}
              </div>
            </div>
          </section>

          {/* Filter Modes */}
          <section id="filter-modes" className="p-6 border border-border rounded-lg bg-card">
            <h2 className="text-2xl font-semibold mb-2">Filter Modes</h2>
            <p className="text-secondary-foreground mb-4">
              Try different filter strategies. Type "united" or "states" to see the difference.
            </p>
            <div className="flex flex-col gap-4 max-w-md">
              <div className="flex gap-2 flex-wrap">
                {Object.values(ComboBoxFilter).map((mode) => (
                  <Button
                    key={mode}
                    onClick={() => setFilterMode(mode)}
                    design={filterMode === mode ? 'Primary' : 'Secondary'}
                  >
                    {mode}
                  </Button>
                ))}
              </div>
              <ComboBox
                value={filterValue}
                placeholder={`Filter mode: ${filterMode}`}
                filter={filterMode}
                onInput={(v) => setFilterValue(v)}
              >
                {countries.map((country) => (
                  <ComboBoxItem
                    key={country.code}
                    text={country.name}
                    value={country.code}
                    additionalText={country.continent}
                  />
                ))}
              </ComboBox>
              <div className="p-3 bg-muted rounded-md text-sm space-y-1">
                <div><strong>StartsWithPerTerm:</strong> Matches start of any word</div>
                <div><strong>StartsWith:</strong> Matches start of text only</div>
                <div><strong>Contains:</strong> Matches anywhere in text</div>
                <div><strong>None:</strong> No filtering (for lazy loading)</div>
              </div>
            </div>
          </section>

          {/* Value State with Interactive Message */}
          <section id="value-state-with-interactive-message" className="p-6 border border-border rounded-lg bg-card">
            <h2 className="text-2xl font-semibold mb-2">Value State with Interactive Message</h2>
            <p className="text-secondary-foreground mb-4">
              The value state message can contain interactive elements like links. Open the dropdown to see the message inside the popover — links remain clickable.
            </p>
            <div className="flex flex-col gap-4 max-w-md">
              <ComboBox
                placeholder="Select a country..."
                valueState={ValueState.Negative}
                valueStateMessage={
                  <span>
                    Invalid country.{" "}
                    <Link
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        alert("See all countries clicked!");
                      }}
                    >
                      See all countries
                    </Link>{" "}
                    or{" "}
                    <Link
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        alert("Contact support clicked!");
                      }}
                    >
                      contact support
                    </Link>.
                  </span>
                }
              >
                {countries.map((c) => <ComboBoxItem key={c.code} text={c.name} value={c.code} />)}
              </ComboBox>
              <ComboBox
                placeholder="Select a country..."
                valueState={ValueState.Information}
                valueStateMessage={
                  <span>
                    Choosing a country sets your default currency.{" "}
                    <Link
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        alert("Learn more clicked!");
                      }}
                    >
                      Learn more
                    </Link>
                  </span>
                }
              >
                {countries.map((c) => <ComboBoxItem key={c.code} text={c.name} value={c.code} />)}
              </ComboBox>
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
              <ComboBox
                value={valueStateValue}
                placeholder="Select a country..."
                valueState={valueState}
                valueStateMessage={
                  valueState === ValueState.Negative
                    ? 'Please select a valid country'
                    : valueState === ValueState.Critical
                      ? 'This selection requires approval'
                      : valueState === ValueState.Information
                        ? 'Select your country of residence'
                        : valueState === ValueState.Positive
                          ? 'Valid selection'
                          : undefined
                }
                onInput={(v) => setValueStateValue(v)}
              >
                {countries.map((country) => (
                  <ComboBoxItem
                    key={country.code}
                    text={country.name}
                    value={country.code}
                  />
                ))}
              </ComboBox>
            </div>
          </section>

          {/* Clear Icon */}
          <section id="clear-icon" className="p-6 border border-border rounded-lg bg-card">
            <h2 className="text-2xl font-semibold mb-2">Clear Icon</h2>
            <p className="text-secondary-foreground mb-4">
              Show a clear button when value exists. Click the X to clear.
            </p>
            <div className="flex flex-col gap-4 max-w-md">
              <ComboBox
                value={clearableValue}
                placeholder="Select a country..."
                showClearIcon
                onInput={(v) => setClearableValue(v)}
                onChange={(v) => setClearableValue(v)}
              >
                {countries.map((country) => (
                  <ComboBoxItem
                    key={country.code}
                    text={country.name}
                    value={country.code}
                  />
                ))}
              </ComboBox>
              <div className="p-3 bg-muted rounded-md font-mono text-sm">
                <strong>Value:</strong> {clearableValue || 'None'}
              </div>
            </div>
          </section>

          {/* Loading State */}
          <section id="loading-state" className="p-6 border border-border rounded-lg bg-card">
            <h2 className="text-2xl font-semibold mb-2">Loading State</h2>
            <p className="text-secondary-foreground mb-4">
              Show a loading indicator while fetching data.
            </p>
            <div className="flex flex-col gap-4 max-w-md">
              <div className="flex gap-2">
                <Button onClick={simulateLoading} design="Primary">
                  Simulate Loading
                </Button>
              </div>
              <ComboBox
                value={loadingValue}
                placeholder="Select a country..."
                loading={isLoading}
                onInput={(v) => setLoadingValue(v)}
              >
                {countries.map((country) => (
                  <ComboBoxItem
                    key={country.code}
                    text={country.name}
                    value={country.code}
                  />
                ))}
              </ComboBox>
            </div>
          </section>

          {/* Disabled & Readonly */}
          <section id="disabled-readonly" className="p-6 border border-border rounded-lg bg-card">
            <h2 className="text-2xl font-semibold mb-2">Disabled & Readonly</h2>
            <p className="text-secondary-foreground mb-4">
              Non-interactive states for ComboBox.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
              <div>
                <label className="text-sm font-medium mb-2 block">Disabled</label>
                <ComboBox
                  value="United States"
                  placeholder="Select a country..."
                  disabled
                >
                  {countries.map((country) => (
                    <ComboBoxItem
                      key={country.code}
                      text={country.name}
                      value={country.code}
                    />
                  ))}
                </ComboBox>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Readonly</label>
                <ComboBox
                  value="Germany"
                  placeholder="Select a country..."
                  readonly
                >
                  {countries.map((country) => (
                    <ComboBoxItem
                      key={country.code}
                      text={country.name}
                      value={country.code}
                    />
                  ))}
                </ComboBox>
              </div>
            </div>
          </section>

          {/* Long Items */}
          <section id="long-items" className="p-6 border border-border rounded-lg bg-card">
            <h2 className="text-2xl font-semibold mb-2">Long Items</h2>
            <p className="text-secondary-foreground mb-4">
              ComboBox with very long item texts to test overflow and wrapping behavior.
            </p>
            <div className="flex flex-col gap-4 max-w-md">
              <ComboBox placeholder="Select an option...">
                <ComboBoxItem text="Short" value="1" />
                <ComboBoxItem text="A moderately long item description that might wrap" value="2" />
                <ComboBoxItem text="This is an extremely long combo box item text that should definitely overflow or wrap depending on the container width configuration" value="3" />
                <ComboBoxItem text="International Business Machines Corporation — Enterprise Cloud Infrastructure and Hybrid Multi-Cloud Platform Services Division" value="4" />
                <ComboBoxItem text="OK" value="5" />
              </ComboBox>
              <ComboBox
                placeholder="With value state..."
                valueState={ValueState.Negative}
                valueStateMessage="This is a very long validation message that explains in great detail why the selected option is not valid and what the user should do to fix it."
              >
                <ComboBoxItem text="A moderately long item description that might wrap" value="1" />
                <ComboBoxItem text="This is an extremely long combo box item text that should definitely overflow or wrap depending on the container width configuration" value="2" />
                <ComboBoxItem text="International Business Machines Corporation — Enterprise Cloud Infrastructure and Hybrid Multi-Cloud Platform Services Division" value="3" />
              </ComboBox>
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
                    <span className="text-secondary-foreground">Toggle dropdown</span>
                    <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">F4</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-foreground">Open dropdown</span>
                    <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Alt+Down</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-foreground">Navigate items</span>
                    <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Up / Down</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-foreground">First/last item</span>
                    <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Home/End</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-foreground">Skip 10 items</span>
                    <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">PgUp/PgDn</kbd>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Actions</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-secondary-foreground">Select item</span>
                    <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Enter</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-foreground">Close/reset</span>
                    <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Escape</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-foreground">Close & move focus</span>
                    <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Tab</kbd>
                  </div>
                </div>
              </div>
            </div>
          </section>

      {/* Usage Example */}
      <section id="usage-example" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-4">Usage Example</h2>
        <CodeBlock
          language="tsx"
          code={`import { ComboBox, ComboBoxItem, ComboBoxItemGroup } from "@sap-ui/fx-components";

// Basic ComboBox
<ComboBox
  value={value}
  placeholder="Select a country..."
  onInput={(v) => setValue(v)}
  onChange={(v) => console.log("Changed:", v)}
  onSelectionChange={(detail) => console.log("Selected:", detail)}
>
  <ComboBoxItem text="United States" value="US" additionalText="US" />
  <ComboBoxItem text="Germany" value="DE" additionalText="DE" />
  <ComboBoxItem text="Japan" value="JP" additionalText="JP" />
</ComboBox>

// Grouped items
<ComboBox value={value} placeholder="Select...">
  <ComboBoxItemGroup headerText="Europe">
    <ComboBoxItem text="Germany" value="DE" />
    <ComboBoxItem text="France" value="FR" />
  </ComboBoxItemGroup>
  <ComboBoxItemGroup headerText="Asia">
    <ComboBoxItem text="Japan" value="JP" />
    <ComboBoxItem text="India" value="IN" />
  </ComboBoxItemGroup>
</ComboBox>

// With filter, value state, and clear icon
<ComboBox
  value={value}
  filter="Contains"
  valueState="Negative"
  valueStateMessage="Please select a valid option"
  showClearIcon
  onInput={(v) => setValue(v)}
>
  <ComboBoxItem text="Option A" value="a" />
  <ComboBoxItem text="Option B" value="b" />
</ComboBox>`}
        />
      </section>
    </div>
  );
}

export default ComboBoxPage;
