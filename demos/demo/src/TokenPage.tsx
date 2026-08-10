import { useState } from "react";
import { Token } from "@sap-ui/fx-components";
import { CodeBlock } from "./components/CodeBlock";

export function TokenPage() {
  // Closable tokens state
  const [tokens, setTokens] = useState([
    { id: 1, label: "React" },
    { id: 2, label: "TypeScript" },
    { id: 3, label: "Tailwind" },
    { id: 4, label: "Vite" },
    { id: 5, label: "Vitest" },
  ]);

  const removeToken = (id: number) => {
    setTokens((prev) => prev.filter((t) => t.id !== id));
  };

  // Basic tokens selection state
  const [basicSelected, setBasicSelected] = useState<Set<string>>(new Set());

  const toggleBasicSelected = (label: string) => {
    setBasicSelected((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  };

  // Selected tokens state
  const [selected, setSelected] = useState<Set<number>>(new Set([1, 3]));

  const toggleSelected = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="space-y-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Token</h1>
        <code className="text-sm text-sapphire-brand-foreground font-mono">
          {'import { Token } from "@sap-ui/fx-components"'}
        </code>
      </header>

      {/* Basic Tokens */}
      <section id="basic" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-lg font-semibold text-foreground mb-4">Basic</h2>
        <p className="text-sm text-secondary-foreground mb-3">
          Basic tokens representing selected values. Click to select, each token has a close icon.
        </p>
        <div className="flex flex-wrap gap-2 items-center">
          {["React", "TypeScript", "Tailwind CSS", "Node.js"].map((label) => (
            <Token
              key={label}
              text={label}
              tabIndex={0}
              selected={basicSelected.has(label)}
              onSelect={() => toggleBasicSelected(label)}
            />
          ))}
        </div>
      </section>

      {/* Selected Tokens */}
      <section id="selected-tokens" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-lg font-semibold text-foreground mb-4">Selected Tokens</h2>
        <p className="text-sm text-secondary-foreground mb-3">
          Click a token to toggle selection. Selected tokens show an accent background.
        </p>
        <div className="flex flex-wrap gap-2 items-center">
          {[
            { id: 1, label: "Frontend" },
            { id: 2, label: "Backend" },
            { id: 3, label: "DevOps" },
            { id: 4, label: "Design" },
          ].map((t) => (
            <Token
              key={t.id}
              text={t.label}
              tabIndex={0}
              selected={selected.has(t.id)}
              onSelect={() => toggleSelected(t.id)}
            />
          ))}
        </div>
        <p className="text-xs text-secondary-foreground mt-2">
          Selected: {Array.from(selected).join(", ") || "none"}
        </p>
      </section>

      {/* Read-only Tokens */}
      <section id="read-only-tokens" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-lg font-semibold text-foreground mb-4">Read-only Tokens</h2>
        <p className="text-sm text-secondary-foreground mb-3">
          Read-only tokens have no close icon and cannot be selected or deleted.
        </p>
        <div className="flex flex-wrap gap-2 items-center">
          <Token text="React" readonly tabIndex={0} />
          <Token text="TypeScript" readonly tabIndex={0} />
          <Token text="Tailwind CSS" readonly tabIndex={0} />
          <Token text="Node.js" readonly tabIndex={0} />
        </div>
      </section>

      {/* Closable Tokens */}
      <section id="closable-tokens" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-lg font-semibold text-foreground mb-4">Closable Tokens</h2>
        <p className="text-sm text-secondary-foreground mb-3">
          Standalone tokens with individual <code className="text-sapphire-brand-foreground">onDelete</code> handlers.
        </p>
        <div className="flex flex-wrap gap-2 items-center">
          {tokens.map((t) => (
            <Token
              key={t.id}
              text={t.label}
              tabIndex={0}
              onDelete={() => removeToken(t.id)}
            />
          ))}
          {tokens.length === 0 && (
            <span className="text-sm text-secondary-foreground italic">All tokens removed</span>
          )}
        </div>
      </section>

      {/* Usage Example */}
      <section id="usage-example" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Usage Example</h2>
        <CodeBlock
          language="tsx"
          code={`import { Token } from "@sap-ui/fx-components";

// Basic token
<Token text="React" />

// Selected token
<Token text="Active" selected />

// Read-only token (no close icon, not interactive)
<Token text="Locked" readonly />

// With delete handler
<Token
  text="Removable"
  onDelete={(detail) => {
    console.log("Deleted via:", detail.isKeyboard ? "keyboard" : "mouse");
  }}
/>

// With select handler
<Token
  text="Clickable"
  selected={isSelected}
  onSelect={(detail) => {
    console.log("Selected:", detail.selected);
  }}
/>`}
        />
      </section>
    </div>
  );
}

export default TokenPage;
