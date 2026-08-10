import { useState } from 'react';
import {
  MultiComboBox,
  MultiComboBoxItem,
  MultiComboBoxItemGroup,
  ComboBoxFilter,
  ComboBoxSize,
  ValueState,
  Button,
} from '@sap-ui/fx-components';

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
  { name: 'Australia', code: 'AU', continent: 'Oceania' },
];

const groupedCountries = countries.reduce((acc, country) => {
  if (!acc[country.continent]) {
    acc[country.continent] = [];
  }
  acc[country.continent].push(country);
  return acc;
}, {} as Record<string, typeof countries>);

export function MultiComboBoxPage() {
  const [basicSelected, setBasicSelected] = useState<string[]>([]);
  const [controlledSelected, setControlledSelected] = useState<string[]>(['DE', 'FR']);
  const [filterMode, setFilterMode] = useState<ComboBoxFilter>(ComboBoxFilter.StartsWithPerTerm);
  const [valueState, setValueState] = useState<ValueState>(ValueState.None);

  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-2xl font-semibold mb-2">MultiComboBox</h2>
        <p className="text-muted-foreground mb-8">
          A multi-selection combo box that displays selected items as tokens and offers a filterable dropdown with checkboxes.
        </p>
      </div>

      {/* Basic */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Basic</h3>
        <div className="max-w-sm space-y-3">
          <MultiComboBox
            placeholder="Select countries (Large)"
            onSelectionChange={(detail) => {
              setBasicSelected(detail.items.map(i => i.value ?? i.text));
            }}
          >
            {countries.map((c) => (
              <MultiComboBoxItem key={c.code} text={c.name} value={c.code} />
            ))}
          </MultiComboBox>
          <MultiComboBox
            placeholder="Select countries (Medium)"
            size={ComboBoxSize.Medium}
            onSelectionChange={(detail) => {
              setBasicSelected(detail.items.map(i => i.value ?? i.text));
            }}
          >
            {countries.map((c) => (
              <MultiComboBoxItem key={c.code} text={c.name} value={c.code} />
            ))}
          </MultiComboBox>
          <p className="mt-2 text-sm text-muted-foreground">
            Selected: {basicSelected.length === 0 ? 'none' : basicSelected.join(', ')}
          </p>
        </div>
      </section>

      {/* Default Selection */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Default Selection</h3>
        <div className="max-w-sm">
          <MultiComboBox
            placeholder="Select countries"
            defaultSelectedValues={['US', 'DE', 'JP']}
          >
            {countries.map((c) => (
              <MultiComboBoxItem key={c.code} text={c.name} value={c.code} />
            ))}
          </MultiComboBox>
        </div>
      </section>

      {/* Grouped Items */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Grouped Items</h3>
        <div className="max-w-sm">
          <MultiComboBox placeholder="Select countries" defaultSelectedValues={['DE', 'JP']}>
            {Object.entries(groupedCountries).map(([continent, items]) => (
              <MultiComboBoxItemGroup key={continent} headerText={continent}>
                {items.map((c) => (
                  <MultiComboBoxItem key={c.code} text={c.name} value={c.code} />
                ))}
              </MultiComboBoxItemGroup>
            ))}
          </MultiComboBox>
        </div>
      </section>

      {/* Select All */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Select All</h3>
        <div className="max-w-sm">
          <MultiComboBox placeholder="Select countries" showSelectAll>
            {countries.slice(0, 6).map((c) => (
              <MultiComboBoxItem key={c.code} text={c.name} value={c.code} />
            ))}
          </MultiComboBox>
        </div>
      </section>

      {/* Filter Modes */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Filter Modes</h3>
        <div className="flex gap-2 mb-4">
          {Object.values(ComboBoxFilter).map((mode) => (
            <Button
              key={mode}
              design={filterMode === mode ? "Primary" : "Secondary"}
              onClick={() => setFilterMode(mode)}
            >
              {mode}
            </Button>
          ))}
        </div>
        <div className="max-w-sm">
          <MultiComboBox placeholder="Type to filter" filter={filterMode}>
            {countries.map((c) => (
              <MultiComboBoxItem key={c.code} text={c.name} value={c.code} />
            ))}
          </MultiComboBox>
        </div>
      </section>

      {/* Value States */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Value States</h3>
        <div className="flex gap-2 mb-4">
          {Object.values(ValueState).map((state) => (
            <Button
              key={state}
              design={valueState === state ? "Primary" : "Secondary"}
              onClick={() => setValueState(state)}
            >
              {state}
            </Button>
          ))}
        </div>
        <div className="max-w-sm">
          <MultiComboBox
            placeholder="Select countries"
            valueState={valueState}
            valueStateMessage={
              valueState !== ValueState.None
                ? `This is a ${valueState.toLowerCase()} message.`
                : undefined
            }
            defaultSelectedValues={['US', 'DE']}
          >
            {countries.map((c) => (
              <MultiComboBoxItem key={c.code} text={c.name} value={c.code} />
            ))}
          </MultiComboBox>
        </div>
      </section>

      {/* Controlled Selection */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Controlled Selection</h3>
        <div className="flex gap-2 mb-4">
          <Button onClick={() => setControlledSelected([...controlledSelected, 'JP'])}>
            Add Japan
          </Button>
          <Button onClick={() => setControlledSelected(controlledSelected.filter(v => v !== 'DE'))}>
            Remove Germany
          </Button>
          <Button onClick={() => setControlledSelected([])}>
            Clear All
          </Button>
        </div>
        <div className="max-w-sm">
          <MultiComboBox
            placeholder="Select countries"
            selectedValues={controlledSelected}
            onSelectionChange={(detail) => {
              setControlledSelected(detail.items.map(i => i.value ?? i.text));
            }}
          >
            {countries.map((c) => (
              <MultiComboBoxItem key={c.code} text={c.name} value={c.code} />
            ))}
          </MultiComboBox>
          <p className="mt-2 text-sm text-muted-foreground">
            Selected: {controlledSelected.join(', ') || 'none'}
          </p>
        </div>
      </section>

      {/* Disabled & Readonly */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Disabled & Readonly</h3>

        <p className="text-sm font-medium text-muted-foreground">Large — 40px</p>
        <div className="flex gap-8 mb-6">
          <div className="max-w-[280px] flex-1 space-y-2">
            <p className="text-sm font-medium">Disabled</p>
            <MultiComboBox
              placeholder="Disabled"
              disabled
              defaultSelectedValues={['US', 'DE']}
            >
              {countries.slice(0, 6).map((c) => (
                <MultiComboBoxItem key={c.code} text={c.name} value={c.code} />
              ))}
            </MultiComboBox>
          </div>
          <div className="max-w-[280px] flex-1 space-y-2">
            <p className="text-sm font-medium">Readonly</p>
            <MultiComboBox
              readonly
              defaultSelectedValues={['US', 'DE']}
            >
              {countries.slice(0, 6).map((c) => (
                <MultiComboBoxItem key={c.code} text={c.name} value={c.code} />
              ))}
            </MultiComboBox>
          </div>
        </div>

        <p className="text-sm font-medium text-muted-foreground">Medium — 32px</p>
        <div className="flex gap-8">
          <div className="max-w-[280px] flex-1 space-y-2">
            <p className="text-sm font-medium">Disabled</p>
            <MultiComboBox
              placeholder="Disabled"
              disabled
              size={ComboBoxSize.Medium}
              defaultSelectedValues={['US', 'DE']}
            >
              {countries.slice(0, 6).map((c) => (
                <MultiComboBoxItem key={c.code} text={c.name} value={c.code} />
              ))}
            </MultiComboBox>
          </div>
          <div className="max-w-[280px] flex-1 space-y-2">
            <p className="text-sm font-medium">Readonly</p>
            <MultiComboBox
              readonly
              size={ComboBoxSize.Medium}
              defaultSelectedValues={['US', 'DE']}
            >
              {countries.slice(0, 6).map((c) => (
                <MultiComboBoxItem key={c.code} text={c.name} value={c.code} />
              ))}
            </MultiComboBox>
          </div>
        </div>
      </section>

      {/* With Clear Icon */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">With Clear Icon</h3>
        <div className="max-w-sm">
          <MultiComboBox
            placeholder="Select and clear"
            showClearIcon
            defaultSelectedValues={['US', 'DE', 'JP']}
          >
            {countries.map((c) => (
              <MultiComboBoxItem key={c.code} text={c.name} value={c.code} />
            ))}
          </MultiComboBox>
        </div>
      </section>
    </div>
  );
}

export default MultiComboBoxPage;
