import { Tag, TagDesign } from "@sap-ui/fx-components";
import { CodeBlock } from "./components/CodeBlock";

const SEMANTIC_DESIGNS: { design: TagDesign; label: string }[] = [
  { design: TagDesign.Positive, label: "Approved" },
  { design: TagDesign.Negative, label: "Rejected" },
  { design: TagDesign.Critical, label: "Warning" },
  { design: TagDesign.None, label: "Neutral" },
  { design: TagDesign.Information, label: "Info" },
];

const JOB_DESIGNS: { design: TagDesign; label: string }[] = [
  { design: TagDesign.Draft, label: "Draft" },
  { design: TagDesign.Active, label: "Active" },
  { design: TagDesign.Waiting, label: "Waiting" },
  { design: TagDesign.Paused, label: "Paused" },
];

export function TagPage() {
  return (
    <div className="space-y-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Tag</h1>
        <code className="text-sm text-primary/70 font-mono">{'import { Tag, TagDesign } from "@sap-ui/fx-components"'}</code>
        <p className="text-secondary-foreground mt-2">
          Display-only status tag with 9 fixed designs — 5 semantic + 4 jobs.
          Each design has a predefined background, text color, and default icon.
        </p>
      </header>

      {/* ── Semantic Designs ── */}
      <section id="semantic-designs">
        <h2 className="text-lg font-bold mb-1">Semantic Designs</h2>
        <p className="text-sm text-muted-foreground mb-3">Positive, Negative, Critical, None, Information</p>
        <div className="p-6 border border-dashed border-border rounded-lg bg-card flex flex-wrap gap-4 items-center">
          {SEMANTIC_DESIGNS.map(({ design, label }) => (
            <Tag key={design} design={design}>{label}</Tag>
          ))}
        </div>
      </section>

      {/* ── Job Designs ── */}
      <section id="job-designs">
        <h2 className="text-lg font-bold mb-1">Job Designs</h2>
        <p className="text-sm text-muted-foreground mb-3">Draft, Active, Waiting, Paused</p>
        <div className="p-6 border border-dashed border-border rounded-lg bg-card flex flex-wrap gap-4 items-center">
          {JOB_DESIGNS.map(({ design, label }) => (
            <Tag key={design} design={design}>{label}</Tag>
          ))}
        </div>
      </section>

      {/* ── Outline ── */}
      <section id="outline">
        <h2 className="text-lg font-bold mb-1">Outline</h2>
        <p className="text-sm text-muted-foreground mb-3">
          <code>variant="outline"</code> — border-only outline with secondary text. Icons retain their semantic color.
        </p>
        <div className="p-6 border border-dashed border-border rounded-lg bg-card flex flex-wrap gap-4 items-center">
          {SEMANTIC_DESIGNS.map(({ design, label }) => (
            <Tag key={design} design={design} variant="outline">{label}</Tag>
          ))}
        </div>
      </section>

      {/* ── All Designs Grid ── */}
      <section id="all-designs" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-lg font-semibold mb-4">All Designs</h2>
        <p className="text-sm text-secondary-foreground mb-4">
          9 built-in designs via <code>design</code>. The <code>variant</code> prop switches between <code>"filled"</code> (default) and <code>"outline"</code> (border-only).
        </p>
        <div className="grid grid-cols-[auto_1fr_1fr] gap-x-6 gap-y-3 items-center">
          <div />
          <span className="text-xs font-semibold text-muted-foreground pb-2 border-b border-border">Filled (default)</span>
          <span className="text-xs font-semibold text-muted-foreground pb-2 border-b border-border">Outline</span>
          {SEMANTIC_DESIGNS.map(({ design, label }) => (
            <div key={design} className="contents">
              <span className="text-xs text-muted-foreground font-mono">{design}</span>
              <div><Tag design={design}>{label}</Tag></div>
              <div><Tag design={design} variant="outline">{label}</Tag></div>
            </div>
          ))}
          {JOB_DESIGNS.map(({ design, label }) => (
            <div key={design} className="contents">
              <span className="text-xs text-muted-foreground font-mono">{design}</span>
              <div><Tag design={design}>{label}</Tag></div>
              <div className="text-xs text-muted-foreground italic">—</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Custom Icon / Hidden Icon ── */}
      <section id="icon-options" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-lg font-semibold mb-4">Icon Options</h2>
        <p className="text-secondary-foreground mb-4">
          Each design has a default icon. You can hide it with <code>hideIcon</code> or override with <code>icon</code>.
        </p>
        <div className="flex flex-wrap gap-4 items-center">
          <Tag design="Positive">Default icon</Tag>
          <Tag design="Positive" hideIcon>No icon</Tag>
          <Tag design="Active">Sync icon</Tag>
          <Tag design="Active" hideIcon>No icon</Tag>
        </div>
      </section>

      {/* ── Usage Example ── */}
      <section id="usage-example" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-4">Usage Example</h2>
        <CodeBlock
          language="tsx"
          code={`import { Tag, TagDesign } from "@sap-ui/fx-components";

// Semantic designs — filled (default variant)
<Tag design="Positive">Approved</Tag>
<Tag design="Negative">Rejected</Tag>
<Tag design="Critical">Warning</Tag>
<Tag design="None">Neutral</Tag>
<Tag design="Information">Info</Tag>

// Semantic designs — outline variant (border-only, secondary text)
<Tag design="Positive" variant="outline">Approved</Tag>
<Tag design="Negative" variant="outline">Rejected</Tag>

// Job designs
<Tag design="Draft">Draft</Tag>
<Tag design="Active">Active</Tag>
<Tag design="Waiting">Waiting</Tag>
<Tag design="Paused">Paused</Tag>

// Hide the default icon
<Tag design="Positive" hideIcon>No icon</Tag>

// Custom icon
<Tag design="Active" icon={<MyIcon className="h-3 w-3" />}>Custom</Tag>`}
        />
      </section>
    </div>
  );
}

export default TagPage;
