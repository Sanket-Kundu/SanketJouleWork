import { useState } from "react";
import { Text, TextEmptyIndicatorMode } from "@sap-ui/fx-components";
import { CodeBlock } from "./components/CodeBlock";

const LONG_TEXT =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

export function TextPage() {
  const [dynamicMaxLines, setDynamicMaxLines] = useState(3);

  return (
    <div className="space-y-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Text</h1>
        <code className="text-sm text-primary/70 font-mono">{'import { Text } from "@sap-ui/fx-components"'}</code>
      </header>

      {/* Basic Text */}
      <section id="basic-text" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold text-foreground mb-2">Basic Text</h2>
        <p className="text-secondary-foreground mb-4">
          Simple text rendered as a span element.
        </p>
        <div className="flex flex-col gap-4">
          <Text>Hello World</Text>
          <Text>This is a basic text component with default styling.</Text>
        </div>
      </section>

      {/* Max Lines (Single Line) */}
      <section className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Max Lines (Single Line)
        </h2>
        <p className="text-secondary-foreground mb-4">
          Text truncated to a single line with ellipsis using{" "}
          <code className="bg-muted px-1 rounded">maxLines=&#123;1&#125;</code>.
        </p>
        <div className="max-w-md border border-dashed border-border p-4 rounded">
          <Text maxLines={1}>{LONG_TEXT}</Text>
        </div>
      </section>

      {/* Max Lines (Multi-line) */}
      <section className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Max Lines (Multi-line)
        </h2>
        <p className="text-secondary-foreground mb-4">
          Text clamped to 3 lines using{" "}
          <code className="bg-muted px-1 rounded">maxLines=&#123;3&#125;</code>.
        </p>
        <div className="max-w-md border border-dashed border-border p-4 rounded">
          <Text maxLines={3}>{LONG_TEXT}</Text>
        </div>
      </section>

      {/* Unlimited Text */}
      <section id="unlimited-text" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold text-foreground mb-2">Unlimited Text</h2>
        <p className="text-secondary-foreground mb-4">
          Default behavior (no maxLines) — text wraps freely.
        </p>
        <div className="max-w-md border border-dashed border-border p-4 rounded">
          <Text>{LONG_TEXT}</Text>
        </div>
      </section>

      {/* Empty Indicator */}
      <section id="empty-indicator" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold text-foreground mb-2">Empty Indicator</h2>
        <p className="text-secondary-foreground mb-4">
          When{" "}
          <code className="bg-muted px-1 rounded">
            emptyIndicatorMode="On"
          </code>{" "}
          and content is empty, an en-dash is displayed.
        </p>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-secondary-foreground w-40">
              Empty (indicator On):
            </span>
            <Text emptyIndicatorMode={TextEmptyIndicatorMode.On} />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-secondary-foreground w-40">
              Empty (indicator Off):
            </span>
            <Text emptyIndicatorMode={TextEmptyIndicatorMode.Off} />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-secondary-foreground w-40">
              With content (indicator On):
            </span>
            <Text emptyIndicatorMode="On">This text has content</Text>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-secondary-foreground w-40">
              Whitespace only (indicator On):
            </span>
            <Text emptyIndicatorMode="On">{"   "}</Text>
          </div>
        </div>
      </section>

      {/* Custom Styling */}
      <section id="custom-styling" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold text-foreground mb-2">Custom Styling</h2>
        <p className="text-secondary-foreground mb-4">
          Apply custom CSS via the{" "}
          <code className="bg-muted px-1 rounded">style</code> prop.
        </p>
        <div className="flex flex-col gap-4">
          <Text style={{ color: "var(--positive)", fontSize: "1.25rem" }}>
            Positive styled text (1.25rem)
          </Text>
          <Text
            style={{
              color: "var(--negative)",
              fontSize: "1rem",
              fontStyle: "italic",
            }}
          >
            Negative italic styled text (1rem)
          </Text>
        </div>
      </section>

      {/* Render White Space */}
      <section id="render-white-space" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold text-foreground mb-2">Render White Space</h2>
        <p className="text-secondary-foreground mb-4">
          Preserve white space formatting with{" "}
          <code className="bg-muted px-1 rounded">white-space: pre</code>.
        </p>
        <div className="max-w-sm border border-dashed border-border p-4 rounded">
          <Text style={{ whiteSpace: "pre", width: "300px" }}>
            {"  White spaces are preserved on this line.\n\nThis line is preceded by an empty line.\n\tThis line is preceded by a tab."}
          </Text>
        </div>
      </section>

      {/* Hyphenation */}
      <section id="hyphenation" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold text-foreground mb-2">Hyphenation</h2>
        <p className="text-secondary-foreground mb-4">
          Control word wrapping with CSS{" "}
          <code className="bg-muted px-1 rounded">hyphens</code> property.
        </p>
        <div className="flex gap-8">
          <div>
            <p className="text-sm text-secondary-foreground mb-2">
              <strong>hyphens: auto</strong>
            </p>
            <div className="border border-dashed border-border p-2 rounded" style={{ width: "80px" }}>
              <Text style={{ hyphens: "auto", width: "60px" }}>
                An extraordinarily long English word!
              </Text>
            </div>
          </div>
          <div>
            <p className="text-sm text-secondary-foreground mb-2">
              <strong>hyphens: manual</strong>
            </p>
            <div className="border border-dashed border-border p-2 rounded" style={{ width: "80px" }}>
              <Text style={{ hyphens: "manual", width: "60px" }}>
                An extraord&shy;inarily long English word!
              </Text>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Max Lines */}
      <section id="dynamic-max-lines" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold text-foreground mb-2">Dynamic Max Lines</h2>
        <p className="text-secondary-foreground mb-4">
          Adjust the max lines value with the slider to see live clamping.
        </p>
        <div className="flex items-center gap-4 mb-4">
          <label className="text-sm font-medium text-foreground">
            maxLines: {dynamicMaxLines}
          </label>
          <input
            type="range"
            min={0}
            max={10}
            value={dynamicMaxLines}
            onChange={(e) => setDynamicMaxLines(Number(e.target.value))}
            className="w-48"
          />
          <span className="text-sm text-secondary-foreground">
            {dynamicMaxLines === 0 ? "(unlimited)" : `(${dynamicMaxLines} lines)`}
          </span>
        </div>
        <div className="max-w-md border border-dashed border-border p-4 rounded">
          <Text maxLines={dynamicMaxLines}>{LONG_TEXT}</Text>
        </div>
      </section>

      {/* Usage Example */}
      <section id="usage-example" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-4">Usage Example</h2>
        <CodeBlock
          language="tsx"
          code={`import { Text } from "@sap-ui/fx-components";

// Basic text
<Text>Hello World</Text>

// Truncate to a single line with ellipsis
<Text maxLines={1}>
  This is a very long text that will be truncated...
</Text>

// Multi-line clamping
<Text maxLines={3}>
  Long content that will be clamped to 3 lines
  before showing an ellipsis.
</Text>

// Preserve whitespace and line breaks
<Text style={{ whiteSpace: "pre" }}>
  {"  Indented line\\nNew line\\n\\tTabbed line"}
</Text>

// Empty indicator (shows en-dash when content is empty)
<Text emptyIndicatorMode="On">{""}</Text>`}
        />
      </section>
    </div>
  );
}
