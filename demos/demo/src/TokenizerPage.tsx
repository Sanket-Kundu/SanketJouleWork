import { useState } from "react";
import { Token, Tokenizer } from "@sap-ui/fx-components";
import { CodeBlock } from "./components/CodeBlock";

export function TokenizerPage() {
  // N-More popover demo (narrow container — matches UI5 "Tokenizer with n-more items")
  const [nMoreTokens, setNMoreTokens] = useState([
    "Andora", "Bulgaria", "Canada", "Denmark", "Estonia",
  ]);

  // Basic tokenizer demo
  const [tokenizerTokens, setTokenizerTokens] = useState([
    "JavaScript", "TypeScript", "Python", "Rust", "Go", "Java", "C++", "Swift", "Kotlin", "Ruby",
  ]);

  // Select all & range demo
  const [selectAllTokens] = useState(["Alpha", "Beta", "Gamma", "Delta", "Epsilon"]);
  const [selectedCount, setSelectedCount] = useState(0);

  // Clear all demo (matches UI5 "Multi Line with clear all")
  const [clearAllTokens, setClearAllTokens] = useState([
    "Andora", "Bulgaria", "Canada", "Denmark", "Estonia",
    "Finland", "Germany", "Hungary", "Ireland", "Japan", "Korea", "Latvia",
  ]);

  // Deletable tokens demo (matches UI5 "Deletable tokens")
  const [deletableTokens, setDeletableTokens] = useState([
    "Andora", "Bulgaria", "Canada", "Denmark", "Estonia",
  ]);
  const [deleteLog, setDeleteLog] = useState("Event [token-delete] :: N/A");
  const [deleteCounter, setDeleteCounter] = useState(0);

  // Single token (matches UI5 "Single token")
  const [singleToken, setSingleToken] = useState(true);

  /** Dashed preview frame used around each tokenizer sample */
  const Frame = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div
      className={`border-2 border-dashed border-sapphire-border-active rounded-lg p-4 resize-x overflow-auto ${className}`}
    >
      {children}
    </div>
  );

  return (
    <div className="space-y-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Tokenizer</h1>
        <code className="text-sm text-sapphire-brand-foreground font-mono">
          {'import { Token, Tokenizer } from "@sap-ui/fx-components"'}
        </code>
      </header>

      {/* Multi-Line Tokenizer — matches UI5 "Expanded tokenizer" */}
      <section id="multi-line-tokenizer" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-lg font-semibold text-foreground mb-4">Multi-Line Tokenizer</h2>
        <p className="text-sm text-secondary-foreground mb-3">
          With <code className="text-sapphire-brand-foreground">multiLine</code> prop, all tokens are visible with no overflow indicator.
        </p>
        <Frame>
          <Tokenizer multiLine accessibleName="Multi-line example">
            <Token text="Andora" />
            <Token text="Bulgaria" />
            <Token text="Canada" />
            <Token text="Denmark" />
            <Token text="Estonia" />
          </Tokenizer>
        </Frame>
      </section>

      {/* N-More Tokenizer — matches UI5 "Tokenizer with n-more items" */}
      <section id="tokenizer-with-n-more" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-lg font-semibold text-foreground mb-4">Tokenizer with N-More</h2>
        <p className="text-sm text-secondary-foreground mb-3">
          In a constrained width, overflowing tokens collapse into an "N More" link.
          Click it to open a popover listing the hidden tokens.
        </p>
        <Frame className="max-w-xs">
          <Tokenizer
            className="w-full"
            onTokenDelete={({ tokens: indices }) => {
              const toRemove = new Set(indices);
              setNMoreTokens((prev) => prev.filter((_, i) => !toRemove.has(i)));
            }}
          >
            {nMoreTokens.map((name) => (
              <Token key={name} text={name} />
            ))}
          </Tokenizer>
        </Frame>
        <p className="text-xs text-secondary-foreground mt-2">
          {nMoreTokens.length} tokens — drag the resize handle to see overflow change
        </p>
      </section>

      {/* Readonly Tokens — matches UI5 "Readonly tokenizer" */}
      <section id="readonly-tokenizer" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-lg font-semibold text-foreground mb-4">Readonly Tokenizer</h2>
        <p className="text-sm text-secondary-foreground mb-3">
          A tokenizer with <code className="text-sapphire-brand-foreground">readonly</code> propagates readonly to all tokens. No close icons.
        </p>
        <Frame className="max-w-xs">
          <Tokenizer readonly className="w-full">
            <Token text="Andora" />
            <Token text="Bulgaria" />
            <Token text="Canada" />
            <Token text="Denmark" />
            <Token text="Estonia" />
          </Tokenizer>
        </Frame>
      </section>

      {/* Disabled Tokenizer — matches UI5 "Disabled tokenizer" */}
      <section id="disabled-tokenizer" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-lg font-semibold text-foreground mb-4">Disabled Tokenizer</h2>
        <p className="text-sm text-secondary-foreground mb-3">
          A disabled tokenizer. All interaction is prevented, rendered at 40% opacity.
        </p>
        <Frame className="max-w-xs">
          <Tokenizer disabled className="w-full">
            <Token text="Andora" />
            <Token text="Bulgaria" />
            <Token text="Canada" />
            <Token text="Denmark" />
            <Token text="Estonia" />
          </Tokenizer>
        </Frame>
      </section>

      {/* Deletable Tokens — matches UI5 "Deletable tokens" */}
      <section id="deletable-tokens" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-lg font-semibold text-foreground mb-4">Deletable Tokens</h2>
        <p className="text-sm text-secondary-foreground mb-3">
          Tokens fire <code className="text-sapphire-brand-foreground">onTokenDelete</code> when removed via close icon, Backspace, or Delete key.
        </p>
        <Frame className="max-w-xs">
          <Tokenizer
            className="w-full"
            onTokenDelete={({ tokens: indices }) => {
              const removed = indices.map((i) => deletableTokens[i]);
              const toRemove = new Set(indices);
              setDeletableTokens((prev) => prev.filter((_, i) => !toRemove.has(i)));
              setDeleteCounter((c) => c + 1);
              setDeleteLog(`Event [token-delete] :: ${removed.join(", ")}`);
            }}
          >
            {deletableTokens.map((name) => (
              <Token key={name} text={name} />
            ))}
          </Tokenizer>
        </Frame>
        <p className="text-xs text-secondary-foreground mt-2">{deleteLog}</p>
        <p className="text-xs text-secondary-foreground">Event [token-delete] counter :: {deleteCounter}</p>
      </section>

      {/* Single Token — matches UI5 "Single token" */}
      <section id="single-token" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-lg font-semibold text-foreground mb-4">Single Token</h2>
        <p className="text-sm text-secondary-foreground mb-3">
          A single token in a tokenizer truncates with ellipsis when text overflows.
        </p>
        <Frame className="max-w-xs">
          <Tokenizer
            className="w-full"
            onTokenDelete={() => setSingleToken(false)}
          >
            {singleToken && (
              <Token text="Enim do esse anim magna enim fugiat Lorem enim nostrud sit laborum ea." />
            )}
          </Tokenizer>
        </Frame>
      </section>

      {/* Tokenizer with many tokens */}
      <section id="tokenizer-many-tokens" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-lg font-semibold text-foreground mb-4">Tokenizer (Many Tokens)</h2>
        <p className="text-sm text-secondary-foreground mb-3">
          A wider tokenizer with many tokens. Overflow is detected dynamically.
        </p>
        <Frame className="max-w-md">
          <Tokenizer
            className="w-full"
            onTokenDelete={({ tokens: indices }) => {
              const toRemove = new Set(indices);
              setTokenizerTokens((prev) => prev.filter((_, i) => !toRemove.has(i)));
            }}
          >
            {tokenizerTokens.map((name) => (
              <Token key={name} text={name} />
            ))}
          </Tokenizer>
        </Frame>
        <p className="text-xs text-secondary-foreground mt-2">
          {tokenizerTokens.length} tokens
        </p>
      </section>

      {/* Select All & Range Selection */}
      <section id="select-all-range-selection" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-lg font-semibold text-foreground mb-4">Select All & Range Selection</h2>
        <p className="text-sm text-secondary-foreground mb-3">
          Use <kbd className="font-mono bg-muted text-foreground px-1.5 py-0.5 rounded text-xs">Ctrl+A</kbd> to select/deselect all.
          Hold <kbd className="font-mono bg-muted text-foreground px-1.5 py-0.5 rounded text-xs">Shift</kbd> + Arrow to extend selection range.
        </p>
        <Frame className="max-w-md">
          <Tokenizer
            className="w-full"
            onSelectionChange={({ selectedIndices }) => setSelectedCount(selectedIndices.length)}
          >
            {selectAllTokens.map((name) => (
              <Token key={name} text={name} />
            ))}
          </Tokenizer>
        </Frame>
        <p className="text-xs text-secondary-foreground mt-2">
          {selectedCount} of {selectAllTokens.length} tokens selected
        </p>
      </section>

      {/* Clear All — matches UI5 "Multi Line with clear all" */}
      <section id="tokenizer-with-clear-all" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-lg font-semibold text-foreground mb-4">Tokenizer with Clear All</h2>
        <p className="text-sm text-secondary-foreground mb-3">
          When <code className="text-sapphire-brand-foreground">showClearAll</code> is enabled, a "Clear All" link appears.
        </p>
        <Frame className="max-w-sm">
          <Tokenizer
            showClearAll
            multiLine
            className="w-full"
            onTokenDelete={({ tokens: indices }) => {
              const toRemove = new Set(indices);
              setClearAllTokens((prev) => prev.filter((_, i) => !toRemove.has(i)));
            }}
          >
            {clearAllTokens.map((name) => (
              <Token key={name} text={name} />
            ))}
          </Tokenizer>
        </Frame>
        <p className="text-xs text-secondary-foreground mt-2">
          {clearAllTokens.length} tokens
        </p>
      </section>

      {/* Clipboard */}
      <section id="clipboard-support" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-lg font-semibold text-foreground mb-4">Clipboard Support</h2>
        <p className="text-sm text-secondary-foreground mb-3">
          Select tokens, then <kbd className="font-mono bg-muted text-foreground px-1 py-0.5 rounded text-xs">Ctrl+C</kbd> to copy
          or <kbd className="font-mono bg-muted text-foreground px-1 py-0.5 rounded text-xs">Ctrl+X</kbd> to cut.
          Paste into the textarea to verify.
        </p>
        <Frame className="max-w-md">
          <Tokenizer className="w-full">
            <Token text="Copy" />
            <Token text="These" />
            <Token text="Tokens" />
          </Tokenizer>
        </Frame>
        <textarea
          className="w-full max-w-md h-20 mt-3 p-2 text-sm border border-border rounded-md bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Paste copied token text here (Ctrl+V)..."
        />
      </section>

      {/* Keyboard Shortcuts */}
      <section id="keyboard-interaction" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-lg font-semibold text-foreground mb-4">Keyboard Interaction</h2>
        <div className="text-sm space-y-1.5">
          {[
            ["Space", "Toggle token selection"],
            ["Backspace", "Delete focused token (or all selected)"],
            ["Delete", "Delete focused token (or all selected)"],
            ["Arrow Left/Right", "Navigate between tokens"],
            ["Home / End", "Jump to first/last token"],
            ["Ctrl+A", "Select all / deselect all tokens"],
            ["Shift+Arrow", "Extend selection range"],
            ["Ctrl+C", "Copy selected token texts"],
            ["Ctrl+X", "Cut selected tokens (copy + delete)"],
          ].map(([key, desc]) => (
            <div key={key} className="flex gap-4">
              <kbd className="font-mono bg-muted text-foreground px-1.5 py-0.5 rounded text-xs min-w-[120px]">{key}</kbd>
              <span className="text-secondary-foreground">{desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Usage Example */}
      <section id="usage-example" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Usage Example</h2>
        <CodeBlock
          language="tsx"
          code={`import { Token, Tokenizer } from "@sap-ui/fx-components";

// Tokenizer — keyboard navigation, overflow & popover
<Tokenizer
  onTokenDelete={({ tokens }) => removeTokens(tokens)}
  onSelectionChange={({ selectedIndices }) => setSelected(selectedIndices)}
>
  <Token text="JavaScript" />
  <Token text="TypeScript" />
  <Token text="Python" />
</Tokenizer>

// Expanded (wrapping) with Clear All
<Tokenizer showClearAll multiLine>
  <Token text="React" />
  <Token text="Vue" />
</Tokenizer>

// Readonly tokenizer
<Tokenizer readonly>
  <Token text="React" />
  <Token text="Vue" />
</Tokenizer>

// Disabled tokenizer
<Tokenizer disabled>
  <Token text="React" />
  <Token text="Vue" />
</Tokenizer>`}
        />
      </section>
    </div>
  );
}

export default TokenizerPage;
