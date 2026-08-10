import { useState, useRef } from "react";
import {
  SearchField,
  SearchFieldSize,
  Button,
} from "@sap-ui/fx-components";
import type { SearchFieldSearchDetail, SearchFieldRef } from "@sap-ui/fx-components";
import { CodeBlock } from "./components/CodeBlock";

export function SearchFieldPage() {
  const [searchedValue, setSearchedValue] = useState("");
  const [controlled, setControlled] = useState("controlled value");
  const [lastEvent, setLastEvent] = useState("");
  const sfRef = useRef<SearchFieldRef>(null);

  const handleSearch = (detail: SearchFieldSearchDetail) => {
    setSearchedValue(detail.value);
    setLastEvent(
      `onSearch: value="${detail.value}", clearButtonPressed=${detail.clearButtonPressed}`
    );
  };

  return (
    <div className="space-y-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">SearchField</h1>
        <code className="text-sm text-primary/70 font-mono">
          import {"{ SearchField }"} from &quot;@sap-ui/fx-components&quot;
        </code>
        <p className="text-muted-foreground mt-2 text-sm">
          A search input field with search trigger, clear icon, and loading state.
          Maps to the UI5 SearchField (fiori package).
        </p>
      </header>

      {/* ── Basic ─────────────────────────────────────── */}
      <section id="basic">
        <h2 className="text-lg font-semibold mb-4">Basic</h2>
        <div className="max-w-md space-y-2">
          <SearchField
            placeholder="Search for products..."
            onSearch={handleSearch}
          />
          <SearchField
            placeholder="Search for products... (Medium)"
            onSearch={handleSearch}
            size={SearchFieldSize.Medium}
          />
          {searchedValue && (
            <p className="text-sm text-muted-foreground">
              Searched: <strong>{searchedValue}</strong>
            </p>
          )}
          {lastEvent && (
            <p className="text-xs text-muted-foreground font-mono">{lastEvent}</p>
          )}
        </div>
      </section>

      {/* ── States Matrix ─────────────────────────────── */}
      <section id="design-states">
        <h2 className="text-lg font-semibold mb-4">Design States</h2>
        <p className="text-sm text-muted-foreground mb-4">
          The four visual states from the Figma specification.
        </p>

        {/* Large — 40px */}
        <h3 className="text-base font-bold mb-3">Large — 40px</h3>
        <div className="grid grid-cols-2 gap-6 max-w-2xl mb-8">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Regular (empty)</p>
            <SearchField placeholder="Search" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Regular (with value)</p>
            <SearchField defaultValue="Products" showClearIcon />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Hover (interact to see)</p>
            <SearchField placeholder="Hover over me" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Focus (click to see)</p>
            <SearchField placeholder="Click to focus" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Disabled (empty)</p>
            <SearchField placeholder="Search" disabled />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Disabled (with value)</p>
            <SearchField value="Products" disabled />
          </div>
        </div>

        {/* Medium — 32px */}
        <h3 className="text-base font-bold mb-3">Medium — 32px</h3>
        <div className="grid grid-cols-2 gap-6 max-w-2xl">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Regular (empty)</p>
            <SearchField placeholder="Search" size={SearchFieldSize.Medium} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Regular (with value)</p>
            <SearchField defaultValue="Products" showClearIcon size={SearchFieldSize.Medium} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Hover (interact to see)</p>
            <SearchField placeholder="Hover over me" size={SearchFieldSize.Medium} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Focus (click to see)</p>
            <SearchField placeholder="Click to focus" size={SearchFieldSize.Medium} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Disabled (empty)</p>
            <SearchField placeholder="Search" disabled size={SearchFieldSize.Medium} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Disabled (with value)</p>
            <SearchField value="Products" disabled size={SearchFieldSize.Medium} />
          </div>
        </div>
      </section>

      {/* ── Controlled ────────────────────────────────── */}
      <section id="controlled">
        <h2 className="text-lg font-semibold mb-4">Controlled</h2>
        <div className="max-w-md space-y-2">
          <SearchField
            value={controlled}
            onInput={(val) => setControlled(val)}
            onSearch={(detail) => setSearchedValue(detail.value)}
            showClearIcon
          />
          <p className="text-sm text-muted-foreground">
            Current value: <strong>{controlled}</strong>
          </p>
          <Button onClick={() => setControlled("")}>Reset</Button>
        </div>
        <CodeBlock className="mt-3">{`const [value, setValue] = useState("");
<SearchField
  value={value}
  onInput={setValue}
  showClearIcon
/>`}</CodeBlock>
      </section>

      {/* ── Placeholder ───────────────────────────────── */}
      <section id="custom-placeholder">
        <h2 className="text-lg font-semibold mb-4">Custom Placeholder</h2>
        <div className="max-w-md space-y-3">
          <SearchField placeholder="Search employees..." />
          <SearchField placeholder="Find documents..." />
          <SearchField placeholder="Look up orders..." />
        </div>
      </section>

      {/* ── Show Clear Icon ───────────────────────────── */}
      <section id="show-clear-icon">
        <h2 className="text-lg font-semibold mb-4">Show Clear Icon</h2>
        <p className="text-sm text-muted-foreground mb-4">
          When <code>showClearIcon</code> is true, a clear button appears when there is a value.
        </p>
        <div className="max-w-md space-y-3">
          <SearchField
            defaultValue="Type and clear"
            showClearIcon
            onSearch={handleSearch}
          />
        </div>
        <CodeBlock className="mt-3">{`<SearchField
  defaultValue="Type and clear"
  showClearIcon
/>`}</CodeBlock>
      </section>

      {/* ── Loading ───────────────────────────────────── */}
      <section id="loading">
        <h2 className="text-lg font-semibold mb-4">Loading</h2>
        <p className="text-sm text-muted-foreground mb-4">
          When <code>loading</code> is true, a spinner replaces the search icon.
        </p>
        <div className="max-w-md">
          <SearchField
            placeholder="Searching..."
            loading
          />
        </div>
        <CodeBlock className="mt-3">{`<SearchField loading placeholder="Searching..." />`}</CodeBlock>
      </section>

      {/* ── Disabled ──────────────────────────────────── */}
      <section id="disabled">
        <h2 className="text-lg font-semibold mb-4">Disabled</h2>
        <div className="max-w-md space-y-3">
          <SearchField placeholder="Search" disabled />
          <SearchField value="Disabled with value" disabled />
        </div>
        <CodeBlock className="mt-3">{`<SearchField disabled placeholder="Search" />`}</CodeBlock>
      </section>

      {/* ── Imperative API ────────────────────────────── */}
      <section id="imperative-api">
        <h2 className="text-lg font-semibold mb-4">Imperative API</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Use a ref to programmatically control the search field.
        </p>
        <div className="max-w-md space-y-3">
          <SearchField
            ref={sfRef}
            placeholder="Controlled via ref..."
            showClearIcon
          />
          <div className="flex gap-2 flex-wrap">
            <Button onClick={() => sfRef.current?.focus()}>Focus</Button>
            <Button onClick={() => sfRef.current?.setValue("Programmatic!")}>
              Set Value
            </Button>
            <Button onClick={() => {
              const val = sfRef.current?.getValue();
              alert(`Current value: "${val}"`);
            }}>
              Get Value
            </Button>
            <Button onClick={() => sfRef.current?.clear()}>Clear</Button>
          </div>
        </div>
        <CodeBlock className="mt-3">{`const ref = useRef<SearchFieldRef>(null);
<SearchField ref={ref} />
<Button onClick={() => ref.current?.focus()}>Focus</Button>
<Button onClick={() => ref.current?.clear()}>Clear</Button>`}</CodeBlock>
      </section>
    </div>
  );
}
