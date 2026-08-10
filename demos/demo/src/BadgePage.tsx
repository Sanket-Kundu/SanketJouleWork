import { Badge } from "@sap-ui/fx-components";
import { CodeBlock } from "./components/CodeBlock";

/**
 * Badge demo page — mirrors Figma Foundation Snapshot tiles exactly.
 *
 * Three columns matching Figma:
 *   - "Check Light"  → Minimal S (4) + Minimal L (4) + Filled (4)
 *   - "Check Dark"   → same badges on dark background
 *   - "Marcel - Status-Minimal Tryout" → Tinted/Outline pairs S (8) + Outline L (4)
 */
export function BadgePage() {
  return (
    <div className="space-y-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Badge</h1>
        <code className="text-sm text-primary/70 font-mono">{'import { Badge } from "@sap-ui/fx-components"'}</code>
      </header>


      {/* ================================================================
          THREE-COLUMN LAYOUT matching Figma snapshot
          ================================================================ */}
      <div className="grid grid-cols-2 gap-8">

        {/* ── Check Light / Check Dark (switch theme to see dark) ── */}
        <div>
          <h2 className="text-sm font-medium text-secondary-foreground mb-3">Check Light / Dark</h2>
          <div className="p-6 border border-border rounded-lg bg-card flex flex-col gap-3 items-start">
            {/* Minimal Small (4) */}
            <Badge variant="Minimal" design="Positive" size="S">Approved</Badge>
            <Badge variant="Minimal" design="Information" size="S">Approved</Badge>
            <Badge variant="Minimal" design="Negative" size="S">Approved</Badge>
            <Badge variant="Minimal" design="Critical" size="S">Approved</Badge>

            {/* Minimal Large (4) */}
            <Badge variant="Minimal" design="Positive" size="L">Approved</Badge>
            <Badge variant="Minimal" design="Information" size="L">Approved</Badge>
            <Badge variant="Minimal" design="Negative" size="L">Approved</Badge>
            <Badge variant="Minimal" design="Critical" size="L">Approved</Badge>

            {/* Filled (4) */}
            <Badge variant="Filled" design="Positive">Approved</Badge>
            <Badge variant="Filled" design="Information">Submitted</Badge>
            <Badge variant="Filled" design="Negative">Rejected</Badge>
            <Badge variant="Filled" design="Critical">Rejected</Badge>
          </div>
        </div>

        {/* ── Marcel - Status-Minimal Tryout ── */}
        <div>
          <h2 className="text-sm font-medium text-secondary-foreground mb-3">Marcel - Status-Minimal Tryout</h2>
          <div className="p-6 border border-border rounded-lg bg-card flex flex-col gap-3 items-start">
            {/* Small pairs: Tinted + Outline per color (8) */}
            <Badge variant="Tinted" design="Positive" size="S">Approved</Badge>
            <Badge variant="Outline" design="Positive" size="S">Approved</Badge>
            <Badge variant="Tinted" design="Information" size="S">Approved</Badge>
            <Badge variant="Outline" design="Information" size="S">Approved</Badge>
            <Badge variant="Tinted" design="Negative" size="S">Approved</Badge>
            <Badge variant="Outline" design="Negative" size="S">Approved</Badge>
            <Badge variant="Tinted" design="Critical" size="S">Approved</Badge>
            <Badge variant="Outline" design="Critical" size="S">Approved</Badge>

            {/* Large Outline (4) */}
            <Badge variant="Outline" design="Positive" size="L">Approved</Badge>
            <Badge variant="Outline" design="Information" size="L">Approved</Badge>
            <Badge variant="Outline" design="Negative" size="L">Approved</Badge>
            <Badge variant="Outline" design="Critical" size="L">Approved</Badge>
          </div>
        </div>

      </div>

      {/* ================================================================
          STATUS TAGS — showBorder on/off pairs per Figma
          ================================================================ */}
      <div>
        <h2 className="text-sm font-medium text-secondary-foreground mb-3">Status Tags</h2>
        <div className="p-6 border border-border rounded-lg bg-card flex flex-col gap-3 items-start">
          {(["Positive", "Information", "Negative", "Critical"] as const).map((design) => (
            <div key={design} className="flex flex-wrap gap-2 items-center">
              <Badge variant="Tinted" design={design} showBorder={false}>{design}</Badge>
              <Badge variant="Tinted" design={design}>{design}</Badge>
            </div>
          ))}
        </div>
      </div>

      {/* ================================================================
          ALL VARIANTS / DESIGNS / SIZES — reference grid
          ================================================================ */}
      <section id="all-variants" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-lg font-semibold mb-4">All Variants</h2>
        <div className="space-y-6">
          {(["Filled", "Minimal", "Outline", "Tinted"] as const).map((variant) => (
            <div key={variant}>
              <h3 className="text-sm font-medium text-secondary-foreground mb-2">{variant}</h3>
              <div className="space-y-2">
                {(["S", "L"] as const).map((size) => (
                  <div key={size} className="flex flex-wrap gap-2 items-center">
                    <span className="text-xs text-secondary-foreground w-6">{size}</span>
                    <Badge variant={variant} design="Positive" size={size}>Approved</Badge>
                    <Badge variant={variant} design="Information" size={size}>Submitted</Badge>
                    <Badge variant={variant} design="Negative" size={size}>Rejected</Badge>
                    <Badge variant={variant} design="Critical" size={size}>Warning</Badge>
                    <Badge variant={variant} design="Neutral" size={size}>Neutral</Badge>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Usage Example */}
      <section id="usage-example" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-4">Usage Example</h2>
        <CodeBlock
          language="tsx"
          code={`import { Badge } from "@sap-ui/fx-components";

// Filled variants
<Badge variant="Filled" design="Positive">Approved</Badge>
<Badge variant="Filled" design="Negative">Rejected</Badge>
<Badge variant="Filled" design="Critical">Warning</Badge>
<Badge variant="Filled" design="Information">Info</Badge>

// Minimal variant with size
<Badge variant="Minimal" design="Positive" size="S">Small</Badge>
<Badge variant="Minimal" design="Positive" size="L">Large</Badge>

// Tinted and Outline variants
<Badge variant="Tinted" design="Information">Tinted</Badge>
<Badge variant="Outline" design="Negative">Outline</Badge>

// Neutral design
<Badge variant="Filled" design="Neutral">Neutral</Badge>`}
        />
      </section>

      {/* Interactive Badges */}
      <section id="interactive-badges" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-4">Interactive Badges</h2>
        <p className="text-secondary-foreground mb-4">Badges with <code>interactive</code> become focusable buttons.</p>
        <div className="flex flex-wrap gap-3">
          <Badge variant="Filled" design="Positive" interactive onClick={() => alert("Approved clicked")}>Approved</Badge>
          <Badge variant="Filled" design="Negative" interactive onClick={() => alert("Rejected clicked")}>Rejected</Badge>
          <Badge variant="Tinted" design="Information" interactive onClick={() => alert("Info clicked")}>Info</Badge>
          <Badge variant="Outline" design="Critical" interactive onClick={() => alert("Warning clicked")}>Warning</Badge>
        </div>
      </section>
    </div>
  );
}

export default BadgePage;
