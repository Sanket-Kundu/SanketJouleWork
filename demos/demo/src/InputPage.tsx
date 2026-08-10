import { useState, useRef } from "react";
import {
  Input,
  InputSuggestions,
  InputSize,
  ValueState,
  InputType,
  InputChangeDetail,
  InputRef,
  InputFilter,
  isRTLLocale,
  Button,
} from "@sap-ui/fx-components";
import { useTranslation } from "react-i18next";
import {
  Search,
  Mail,
  Lock,
  Phone,
  Globe,
  User,
  Apple,
  Cherry,
  Grape,
} from "lucide-react";
import { CodeBlock } from "./components/CodeBlock";

/**
 * Figma-aligned states matrix for Input component.
 * Mirrors the Figma spec sheet layout: columns = states, rows = variants.
 */
function StatesMatrix() {
  const colHeader = "font-medium text-sm text-secondary-foreground";
  const colWidth = "w-[200px] min-w-[180px]";
  const states = [
    { state: ValueState.Positive, label: "Positive" },
    { state: ValueState.Negative, label: "Negative" },
    { state: ValueState.Critical, label: "Warning" },
    { state: ValueState.Information, label: "Information" },
  ] as const;

  return (
    <section id="states-matrix" className="p-6 border border-border rounded-lg bg-card">
      <h2 className="text-2xl font-semibold mb-6">States Matrix</h2>

      {/* Regular - 40px */}
      <div className="mb-10">
        <h3 className="text-lg font-bold mb-6">Regular - 40px</h3>
        <div className="flex flex-wrap gap-8">
          <div className={colWidth}>
            <span className={colHeader}>Regular</span>
            <div className="mt-4 space-y-3">
              <Input placeholder="Placeholder..." accessibleName="Regular placeholder" />
              <Input defaultValue="Typed Text" accessibleName="Regular typed text" />
              <Input defaultValue="Typed Text with Action" showClearIcon accessibleName="Regular with clear" />
            </div>
          </div>
          <div className={colWidth}>
            <span className={colHeader}>Disabled</span>
            <div className="mt-4 space-y-3">
              <Input placeholder="Placeholder..." disabled accessibleName="Disabled placeholder" />
              <Input defaultValue="Typed Text" disabled accessibleName="Disabled typed text" />
            </div>
          </div>
          <div className={colWidth}>
            <span className={colHeader}>Read only</span>
            <div className="mt-4 space-y-3">
              <Input defaultValue="Typed Text" readonly accessibleName="Read only typed text" />
            </div>
          </div>
        </div>
      </div>

      {/* Small - 32px */}
      <div className="mb-10">
        <h3 className="text-lg font-bold mb-6">Small - 32px</h3>
        <div className="flex flex-wrap gap-8">
          <div className={colWidth}>
            <span className={colHeader}>Regular</span>
            <div className="mt-4 space-y-3">
              <Input placeholder="Placeholder..." size={InputSize.Small} accessibleName="Small placeholder" />
              <Input defaultValue="Typed Text" size={InputSize.Small} accessibleName="Small typed text" />
              <Input defaultValue="Typed Text with Action" showClearIcon size={InputSize.Small} accessibleName="Small with clear" />
            </div>
          </div>
          <div className={colWidth}>
            <span className={colHeader}>Disabled</span>
            <div className="mt-4 space-y-3">
              <Input placeholder="Placeholder..." disabled size={InputSize.Small} accessibleName="Small disabled placeholder" />
              <Input defaultValue="Typed Text" disabled size={InputSize.Small} accessibleName="Small disabled typed text" />
            </div>
          </div>
          <div className={colWidth}>
            <span className={colHeader}>Read only</span>
            <div className="mt-4 space-y-3">
              <Input defaultValue="Typed Text" readonly size={InputSize.Small} accessibleName="Small read only typed text" />
            </div>
          </div>
        </div>
      </div>

      {/* Value State */}
      <div>
        <h3 className="text-lg font-bold mb-6">Value State</h3>
        <div className="flex flex-wrap gap-8">
          {/* Placeholder (no text) */}
          <div className={colWidth}>
            <span className={colHeader}>Placeholder</span>
            <div className="mt-4 space-y-5">
              {states.map(({ state, label }) => (
                <Input
                  key={state}
                  placeholder="Placeholder..."
                  valueState={state}
                  valueStateMessage="Message text giving further context."
                  showValueStateIcon
                  accessibleName={`${label} state placeholder`}
                />
              ))}
            </div>
          </div>
          {/* Regular */}
          <div className={colWidth}>
            <span className={colHeader}>Regular</span>
            <div className="mt-4 space-y-5">
              {states.map(({ state, label }) => (
                <Input
                  key={state}
                  defaultValue="Typed Text"
                  valueState={state}
                  valueStateMessage="Message text giving further context."
                  showValueStateIcon
                  accessibleName={`${label} state typed text`}
                />
              ))}
            </div>
          </div>
          {/* With Action */}
          <div className={colWidth}>
            <span className={colHeader}>With Action</span>
            <div className="mt-4 space-y-5">
              {states.map(({ state, label }) => (
                <Input
                  key={state}
                  defaultValue="Typed Text"
                  valueState={state}
                  valueStateMessage="Message text giving further context."
                  showValueStateIcon
                  showClearIcon
                  accessibleName={`${label} state with clear`}
                />
              ))}
            </div>
          </div>
          {/* Disabled */}
          <div className={colWidth}>
            <span className={colHeader}>Disabled</span>
            <div className="mt-4 space-y-5">
              {states.map(({ state, label }) => (
                <Input
                  key={state}
                  defaultValue="Typed Text"
                  valueState={state}
                  valueStateMessage="Message text giving further context."
                  showValueStateIcon
                  disabled
                  accessibleName={`${label} state disabled`}
                />
              ))}
            </div>
          </div>
          {/* Read only */}
          <div className={colWidth}>
            <span className={colHeader}>Read only</span>
            <div className="mt-4 space-y-5">
              {states.map(({ state, label }) => (
                <Input
                  key={state}
                  defaultValue="Typed Text"
                  valueState={state}
                  valueStateMessage="Message text giving further context."
                  showValueStateIcon
                  readonly
                  accessibleName={`${label} state read only`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function InputPage() {
  const [basicValue, setBasicValue] = useState("");
  const [controlledValue, setControlledValue] = useState("Hello World");
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [numberValue, setNumberValue] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const handleChange = (detail: InputChangeDetail) => {
    console.log("onChange:", detail);
  };

  return (
    <div className="space-y-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Input</h1>
        <code className="text-sm text-primary/70 font-mono">{'import { Input } from "@sap-ui/fx-components"'}</code>
      </header>

      {/* Basic Input */}
      <section id="basic-input" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Basic Input</h2>
        <div className="max-w-md space-y-4">
          <Input placeholder="Enter your name..." showClearIcon accessibleName="Name" />
          <Input placeholder="Enter your name..." showClearIcon size={InputSize.Small} accessibleName="Name small" />
        </div>
      </section>

      {/* ================================================================
          Figma States Matrix
          ================================================================ */}
      <StatesMatrix />

      {/* Small Size Input */}
      <section id="small-size-input-32px" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Small Size Input (32px)</h2>
        <p className="text-secondary-foreground mb-4">
          Compact input for dense layouts. Uses 4px border radius and smaller action buttons.
        </p>
        <div className="max-w-md space-y-4">
          <Input
            placeholder="Small input..."
            size={InputSize.Small}
            accessibleName="Small input"
          />
          <Input
            defaultValue="With clear icon"
            size={InputSize.Small}
            showClearIcon
            accessibleName="Small with clear icon"
          />
          <Input
            placeholder="With icon"
            size={InputSize.Small}
            icon={<Search className="h-4 w-4" />}
            accessibleName="Small with icon"
          />
          <Input
            defaultValue="Negative state"
            size={InputSize.Small}
            valueState={ValueState.Negative}
            valueStateMessage="Validation error"
            showValueStateIcon
            accessibleName="Small negative state"
          />
        </div>
      </section>

      {/* Controlled Input */}
      <section id="controlled-input" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Controlled Input</h2>
        <p className="text-secondary-foreground mb-4">
          Value is controlled by parent component.
        </p>
        <div className="max-w-md space-y-4">
          <Input
            value={controlledValue}
            onInput={setControlledValue}
            onChange={handleChange}
            accessibleName="Controlled input"
          />
          <div className="flex gap-2">
            <Button onClick={() => setControlledValue("Reset Value")}>
              Reset
            </Button>
            <Button onClick={() => setControlledValue("")}>
              Clear
            </Button>
          </div>
        </div>
      </section>

      {/* Input Types */}
      <section id="input-types" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Input Types</h2>
        <p className="text-secondary-foreground mb-4">
          Different input types for various use cases.
        </p>
        <div className="max-w-md space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              type={InputType.Email}
              placeholder="email@example.com"
              icon={<Mail className="h-4 w-4" />}
              value={emailValue}
              onInput={setEmailValue}
              accessibleName="Email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <Input
              type={InputType.Password}
              placeholder="Enter password"
              icon={<Lock className="h-4 w-4" />}
              value={passwordValue}
              onInput={setPasswordValue}
              accessibleName="Password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Number</label>
            <Input
              type={InputType.Number}
              placeholder="Enter number"
              min={0}
              max={100}
              step={5}
              value={numberValue}
              onInput={setNumberValue}
              accessibleName="Number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Search</label>
            <Input
              type={InputType.Search}
              placeholder="Search..."
              icon={<Search className="h-4 w-4" />}
              showClearIcon
              value={searchValue}
              onInput={setSearchValue}
              accessibleName="Search"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tel</label>
            <Input
              type={InputType.Tel}
              placeholder="+1 (555) 000-0000"
              icon={<Phone className="h-4 w-4" />}
              accessibleName="Telephone"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">URL</label>
            <Input
              type={InputType.URL}
              placeholder="https://example.com"
              icon={<Globe className="h-4 w-4" />}
              accessibleName="URL"
            />
          </div>
        </div>
      </section>

      {/* Value States */}
      <section id="value-states" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Value States</h2>
        <p className="text-secondary-foreground mb-4">
          Visual feedback for validation states with colored backgrounds, underlines, and message icons.
        </p>
        <div className="max-w-md space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              None (Default)
            </label>
            <Input placeholder="Default state" valueState={ValueState.None} accessibleName="None state" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Positive (Success)
            </label>
            <Input
              defaultValue="Valid email"
              valueState={ValueState.Positive}
              valueStateMessage="Email address is valid"
              showValueStateIcon
              accessibleName="Positive state"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Negative (Error)
            </label>
            <Input
              defaultValue="invalid-email"
              valueState={ValueState.Negative}
              valueStateMessage="Please enter a valid email address"
              showValueStateIcon
              accessibleName="Negative state"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Critical (Warning)
            </label>
            <Input
              defaultValue="weak-password"
              valueState={ValueState.Critical}
              valueStateMessage="Password strength is weak"
              showValueStateIcon
              accessibleName="Critical state"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Information
            </label>
            <Input
              defaultValue="username123"
              valueState={ValueState.Information}
              valueStateMessage="Username will be visible to other users"
              showValueStateIcon
              accessibleName="Information state"
            />
          </div>
        </div>
      </section>

      {/* Icons */}
      <section id="icons-clear-button" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Icons & Clear Button</h2>
        <p className="text-secondary-foreground mb-4">
          Input with icons and clear functionality.
        </p>
        <div className="max-w-md space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Icon at Start
            </label>
            <Input
              placeholder="Search users..."
              icon={<User className="h-4 w-4" />}
              iconPosition="start"
              accessibleName="Icon at start"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Icon at End
            </label>
            <Input
              placeholder="Search..."
              icon={<Search className="h-4 w-4" />}
              iconPosition="end"
              accessibleName="Icon at end"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              With Clear Icon
            </label>
            <Input
              placeholder="Type to see clear button..."
              showClearIcon
              defaultValue="Clear me!"
              accessibleName="With clear icon"
            />
          </div>
        </div>
      </section>

      {/* States */}
      <section id="disabled-readonly" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Disabled & Readonly</h2>
        <p className="text-secondary-foreground mb-4">
          Input states for different scenarios.
        </p>
        <div className="max-w-md space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Disabled</label>
            <Input defaultValue="Cannot edit this" disabled accessibleName="Disabled" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Readonly</label>
            <Input defaultValue="Can select but not edit" readonly accessibleName="Readonly" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Required</label>
            <Input placeholder="This field is required" required accessibleName="Required" />
          </div>
        </div>
      </section>

      {/* Constraints */}
      <section id="constraints" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Constraints</h2>
        <p className="text-secondary-foreground mb-4">
          Input with validation constraints.
        </p>
        <div className="max-w-md space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Max Length (10 characters)
            </label>
            <Input placeholder="Max 10 chars" maxLength={10} accessibleName="Max length" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Number with Min/Max (0-100, step 10)
            </label>
            <Input
              type={InputType.Number}
              min={0}
              max={100}
              step={10}
              placeholder="0-100"
              accessibleName="Number with min max"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Hidden Spinners
            </label>
            <Input
              type={InputType.Number}
              hideStepButtons
              placeholder="Number without spinners"
              accessibleName="Hidden spinners"
            />
          </div>
        </div>
      </section>

      {/* Keyboard Features */}
      <section id="keyboard-navigation" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Keyboard Navigation</h2>
        <p className="text-secondary-foreground mb-4">
          Enhanced keyboard support including Escape to revert.
        </p>
        <div className="max-w-md space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Escape to Revert
            </label>
            <Input
              defaultValue="Original value"
              placeholder="Edit then press Escape to revert"
              accessibleName="Escape to revert"
            />
            <p className="mt-1 text-sm text-secondary-foreground">
              Edit the value, then press Escape to revert to what it was when
              you focused.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Enter to Commit
            </label>
            <Input
              placeholder="Type and press Enter"
              onChange={(detail) => alert(`Committed: ${detail.value}`)}
              accessibleName="Enter to commit"
            />
            <p className="mt-1 text-sm text-secondary-foreground">
              Press Enter to commit the value (fires onChange).
            </p>
          </div>
        </div>
      </section>

      {/* AI-Ready Features */}
      <AIReadyDemo />

      {/* Suggestions/Autocomplete */}
      <SuggestionsDemo />

      {/* i18n */}
      <I18nDemo />

      {/* Usage Example */}
      <section id="usage-example" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-4">Usage Example</h2>
        <CodeBlock
          language="tsx"
          code={`import { Input, ValueState } from "@sap-ui/fx-components";

// Basic input with placeholder
<Input
  placeholder="Enter your name..."
  value={value}
  onInput={(v) => setValue(v)}
  onChange={(detail) => console.log(detail.value)}
/>

// With icon and clear button
<Input
  placeholder="Search..."
  icon={<Search />}
  showClearIcon
  onInput={(v) => setValue(v)}
/>

// Value state for validation feedback
<Input
  value="invalid-email"
  valueState="Negative"
  valueStateMessage="Please enter a valid email address"
  showValueStateIcon
/>

// Password input
<Input type="Password" placeholder="Enter password" />

// Disabled and readonly
<Input value="Cannot edit" disabled />
<Input value="Can select but not edit" readonly />`}
        />
      </section>
    </div>
  );
}

function AIReadyDemo() {
  const inputRef = useRef<InputRef>(null);
  const [log, setLog] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setLog((prev) => [...prev.slice(-4), msg]);
  };

  const handleFocus = () => {
    inputRef.current?.focus();
    addLog("focus() called");
  };

  const handleSelect = () => {
    inputRef.current?.select();
    addLog("select() called");
  };

  const handleGetValue = () => {
    const value = inputRef.current?.getValue();
    addLog(`getValue() = "${value}"`);
  };

  const handleSetValue = () => {
    inputRef.current?.setValue("AI typed this!");
    addLog('setValue("AI typed this!") called');
  };

  const handleSetValueSilent = () => {
    inputRef.current?.setValue("Silent update", { silent: true });
    addLog('setValue("Silent update", { silent: true }) called');
  };

  const handleClear = () => {
    inputRef.current?.clear();
    addLog("clear() called");
  };

  const handleGetState = () => {
    const state = inputRef.current?.getState();
    addLog(`getState() = ${JSON.stringify(state)}`);
  };

  const handleCheckValidity = () => {
    const valid = inputRef.current?.checkValidity();
    addLog(`checkValidity() = ${valid}`);
  };

  const handleGetValueAsNumber = () => {
    const num = inputRef.current?.getValueAsNumber();
    addLog(`getValueAsNumber() = ${num} (NaN if not a number)`);
  };

  // Simulate AI typing
  const handleTypeAI = async () => {
    const text = "Hello from AI!";
    inputRef.current?.setValue("");
    for (let i = 0; i <= text.length; i++) {
      inputRef.current?.setValue(text.slice(0, i), { silent: true });
      await new Promise((r) => setTimeout(r, 50));
    }
    addLog("AI typing simulation complete");
  };

  return (
    <section id="ai-ready-imperative-api" className="p-6 border border-border rounded-lg bg-card">
      <h2 className="text-2xl font-semibold mb-2">AI-Ready Imperative API</h2>
      <p className="text-secondary-foreground mb-4">
        Full programmatic control via ref for AI agents and automation.
      </p>
      <div className="max-w-2xl space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Input with Ref
          </label>
          <Input
            ref={inputRef}
            type={InputType.Text}
            placeholder="Controlled via ref..."
            defaultValue="Initial value"
            data-ai-field="demo-input"
            accessibleName="Input with ref"
            onChange={(d) =>
              addLog(`onChange: source=${d.source}, value="${d.value}"`)
            }
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={handleFocus} design="Primary">
            focus()
          </Button>
          <Button onClick={handleSelect} design="Primary">
            select()
          </Button>
          <Button onClick={handleGetValue} design="Primary">
            getValue()
          </Button>
          <Button onClick={handleGetValueAsNumber} design="Primary">
            getValueAsNumber()
          </Button>
          <Button onClick={handleSetValue} design="Primary">
            setValue()
          </Button>
          <Button onClick={handleSetValueSilent} design="Secondary">
            setValue(silent)
          </Button>
          <Button onClick={handleClear} design="Secondary">
            clear()
          </Button>
          <Button onClick={handleGetState} design="Primary">
            getState()
          </Button>
          <Button onClick={handleCheckValidity} design="Primary">
            checkValidity()
          </Button>
          <Button onClick={handleTypeAI} design="Primary">
            Simulate AI Typing
          </Button>
        </div>

        {log.length > 0 && (
          <div className="bg-muted p-3 rounded font-mono text-sm">
            {log.map((entry, i) => (
              <div key={i} className="text-secondary-foreground">
                {entry}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// Sample suggestions data
const fruitSuggestions = [
  {
    text: "Apple",
    value: "apple",
    additionalText: "Fruit",
    icon: <Apple className="h-4 w-4" />,
  },
  { text: "Apricot", value: "apricot", additionalText: "Fruit" },
  { text: "Banana", value: "banana", additionalText: "Fruit" },
  { text: "Blueberry", value: "blueberry", additionalText: "Berry" },
  {
    text: "Cherry",
    value: "cherry",
    additionalText: "Fruit",
    icon: <Cherry className="h-4 w-4" />,
  },
  {
    text: "Grape",
    value: "grape",
    additionalText: "Fruit",
    icon: <Grape className="h-4 w-4" />,
  },
  { text: "Grapefruit", value: "grapefruit", additionalText: "Citrus" },
  { text: "Lemon", value: "lemon", additionalText: "Citrus" },
  { text: "Mango", value: "mango", additionalText: "Tropical" },
  { text: "Orange", value: "orange", additionalText: "Citrus" },
  { text: "Peach", value: "peach", additionalText: "Stone Fruit" },
  { text: "Pear", value: "pear", additionalText: "Pome Fruit" },
  { text: "Pineapple", value: "pineapple", additionalText: "Tropical" },
  { text: "Strawberry", value: "strawberry", additionalText: "Berry" },
];

const countrySuggestions = [
  "United States",
  "United Kingdom",
  "Germany",
  "France",
  "Japan",
  "Canada",
  "Australia",
  "Brazil",
  "India",
  "China",
];

function SuggestionsDemo() {
  const [selectedFruit, setSelectedFruit] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");

  return (
    <section className="p-6 border border-border rounded-lg bg-card">
      <h2 className="text-2xl font-semibold mb-2">
        Autocomplete / Suggestions
      </h2>
      <p className="text-secondary-foreground mb-4">
        Input with dropdown suggestions, filtering, and keyboard navigation.
      </p>
      <div className="max-w-lg space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">
            Simple String Suggestions
          </label>
          <InputSuggestions
            suggestions={countrySuggestions}
            placeholder="Search countries..."
            icon={<Search className="h-4 w-4" />}
            filter={InputFilter.Contains}
            highlightMatch
            accessibleName="Simple string suggestions"
            onSuggestionSelect={(d) => {
              setSelectedCountry(d.value);
              console.log("Selected country:", d);
            }}
          />
          {selectedCountry && (
            <p className="mt-1 text-sm text-secondary-foreground">
              Selected: {selectedCountry}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Object Suggestions with Icons
          </label>
          <InputSuggestions
            suggestions={fruitSuggestions}
            placeholder="Search fruits..."
            filter={InputFilter.StartsWith}
            highlightMatch
            accessibleName="Object suggestions with icons"
            onSuggestionSelect={(d) => {
              setSelectedFruit(d.value);
              console.log("Selected fruit:", d);
            }}
          />
          {selectedFruit && (
            <p className="mt-1 text-sm text-secondary-foreground">
              Selected: {selectedFruit}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            With Typeahead (auto-complete)
          </label>
          <InputSuggestions
            suggestions={countrySuggestions}
            placeholder="Type to see typeahead..."
            filter={InputFilter.StartsWith}
            accessibleName="With typeahead"
          />
          <p className="mt-1 text-xs text-secondary-foreground">
            Type "Un" and see it auto-complete to "United States"
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">No Typeahead</label>
          <InputSuggestions
            suggestions={countrySuggestions}
            placeholder="No auto-complete..."
            filter={InputFilter.StartsWith}
            noTypeahead
            accessibleName="No typeahead"
          />
        </div>
      </div>
    </section>
  );
}

function I18nDemo() {
  const { t, i18n } = useTranslation("fx");
  const locale = i18n.language;
  const isRTL = isRTLLocale(locale);
  const dir = isRTL ? "rtl" : "ltr";

  return (
    <section className="p-6 border border-border rounded-lg bg-card">
      <h2 className="text-2xl font-semibold mb-2">
        Internationalization (i18n)
      </h2>
      <p className="text-secondary-foreground mb-4">
        All components inherit locale and direction from the global i18next configuration.
        Use the language selector in the header to change the locale.
      </p>

      {/* Current locale info */}
      <div className="mb-6 p-4 bg-muted rounded-lg">
        <h3 className="font-medium mb-2">Current Settings</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-secondary-foreground">Locale:</span>{" "}
            <span className="font-mono">{locale}</span>
          </div>
          <div>
            <span className="text-secondary-foreground">Direction:</span>{" "}
            <span className="font-mono">{dir}</span>
          </div>
          <div>
            <span className="text-secondary-foreground">Is RTL:</span>{" "}
            <span className="font-mono">{isRTL ? "Yes" : "No"}</span>
          </div>
          <div>
            <span className="text-secondary-foreground">Clear label:</span>{" "}
            <span className="font-mono">"{t("INPUT_CLEAR")}"</span>
          </div>
        </div>
      </div>

      <div className="max-w-lg space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">
            Input with Clear Icon
          </label>
          <Input
            defaultValue="Try changing the language!"
            showClearIcon
            placeholder="Global i18n applied..."
            accessibleName="Input with clear icon"
          />
          <p className="mt-1 text-xs text-secondary-foreground">
            Hover over the clear button to see the localized tooltip
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Input with Icon (RTL-aware)
          </label>
          <Input
            defaultValue="Icon position adapts to RTL"
            icon={<Search className="h-4 w-4" />}
            showClearIcon
            accessibleName="Input with icon RTL-aware"
          />
          <p className="mt-1 text-xs text-secondary-foreground">
            In RTL mode, icon positions are automatically mirrored
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Value State with Localized Label
          </label>
          <Input
            defaultValue="Validation message"
            valueState={ValueState.Negative}
            valueStateMessage={t("VALUE_STATE_ERROR") + ": Invalid input"}
            showValueStateIcon
            accessibleName="Value state with localized label"
          />
          <p className="mt-1 text-xs text-secondary-foreground">
            Screen readers announce the localized state prefix
          </p>
        </div>
      </div>
    </section>
  );
}
