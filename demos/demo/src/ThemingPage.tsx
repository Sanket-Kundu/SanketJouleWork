import { useEffect, useState, useRef } from "react";
import { CodeBlock } from "./components/CodeBlock";
import { SectionHeading } from "./components/SectionHeading";

/** Reads a CSS custom property from the document root */
function getCssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/** A single color swatch row */
function Swatch({ variable, label }: { variable: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [resolved, setResolved] = useState("");

  useEffect(() => {
    // Read after paint so theme class is applied
    const frame = requestAnimationFrame(() => setResolved(getCssVar(variable)));
    return () => cancelAnimationFrame(frame);
  });

  return (
    <div className="flex items-center gap-3">
      <div
        ref={ref}
        className="w-8 h-8 rounded-md border border-border shrink-0"
        style={{ backgroundColor: `var(${variable})` }}
      />
      <div className="min-w-0 flex-1">
        <code className="text-xs font-mono text-foreground">{variable}</code>
        <div className="text-[11px] text-secondary-foreground truncate">{label}</div>
      </div>
      <code className="text-[11px] font-mono text-secondary-foreground hidden sm:block shrink-0">{resolved}</code>
    </div>
  );
}

/** A group of swatches under a heading */
function SwatchGroup({ title, tokens }: { title: string; tokens: { variable: string; label: string }[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground mb-3">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5">
        {tokens.map((t) => (
          <Swatch key={t.variable} {...t} />
        ))}
      </div>
    </div>
  );
}

export function ThemingPage() {
  const spacingScale = [
    { token: "3xs", px: 4 },
    { token: "2xs", px: 8 },
    { token: "xs", px: 12 },
    { token: "s", px: 16 },
    { token: "m", px: 20 },
    { token: "l", px: 24 },
    { token: "xl", px: 32 },
    { token: "2xl", px: 40 },
    { token: "3xl", px: 48 },
    { token: "4xl", px: 64 },
  ];

  return (
    <div className="space-y-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-3">Theming</h1>
        <p className="text-lg text-secondary-foreground max-w-2xl">
          How design tokens flow from Figma to your components — and what to use when writing styles.
        </p>
      </header>

      {/* ── The Pipeline ──────────────────────────────────────────── */}
      <section id="token-pipeline" className="p-6 border border-border rounded-lg bg-card">
        <SectionHeading id="token-pipeline" page="theming">Token Pipeline</SectionHeading>
        <p className="text-secondary-foreground mb-6">
          Every color, spacing value, and radius starts in Figma and flows through four layers before reaching a component.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              step: "1",
              title: "Figma Tokens",
              desc: "Design specs define base palette, semantic colors, spacing, and typography.",
              detail: "Source of truth for designers",
              color: "bg-blue-50 border-blue-200 text-blue-700",
              dotColor: "bg-blue-500",
            },
            {
              step: "2",
              title: "tokens.css",
              desc: "CSS custom properties in :root (light) and .theme-dark. Concrete values.",
              detail: "--primary: #0070F2",
              color: "bg-purple-50 border-purple-200 text-purple-700",
              dotColor: "bg-purple-500",
            },
            {
              step: "3",
              title: "sapphire-theme.css",
              desc: "Auto-generated @theme block registers CSS vars as Tailwind utilities.",
              detail: "--color-primary: var(--primary)",
              color: "bg-sapphire-positive-bg border-sapphire-positive text-sapphire-positive",
              dotColor: "bg-sapphire-positive",
            },
            {
              step: "4",
              title: "Component",
              desc: "Uses Tailwind utility classes like bg-primary, text-secondary-foreground, etc.",
              detail: 'className="bg-primary"',
              color: "bg-sapphire-warning-bg border-sapphire-warning text-sapphire-warning",
              dotColor: "bg-sapphire-warning",
            },
          ].map((item) => (
            <div key={item.step} className={`relative p-4 rounded-lg border ${item.color}`}>
              <div className={`absolute -top-2.5 left-4 w-5 h-5 rounded-full ${item.dotColor} text-white text-xs flex items-center justify-center font-bold`}>
                {item.step}
              </div>
              <h3 className="font-semibold mt-1 mb-1">{item.title}</h3>
              <p className="text-sm opacity-80 mb-2">{item.desc}</p>
              <code className="text-xs font-mono opacity-60">{item.detail}</code>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg space-y-3">
          <p className="text-sm text-secondary-foreground">
            <strong className="text-foreground">ThemeProvider</strong> toggles the <code className="text-xs bg-muted px-1 py-0.5 rounded">.theme-dark</code> class on the root element.
            It doesn't inject tokens — it just switches which set of CSS variables are active.
            Any custom theme just needs to define the same variables and it works.
          </p>
          <p className="text-sm text-secondary-foreground">
            <strong className="text-foreground">Step 2 → 3 is automatic.</strong>{" "}
            You only edit <code className="text-xs bg-muted px-1 py-0.5 rounded">tokens.css</code> — the theme file regenerates on every build,
            and the Tailwind classes are ready to use in your components. No manual wiring needed.
          </p>
        </div>
      </section>

      {/* ── Built on Tailwind & shadcn ─────────────────────────────── */}
      <section id="tailwind-shadcn" className="p-6 border border-border rounded-lg bg-card">
        <SectionHeading id="tailwind-shadcn" page="theming">Built on Tailwind CSS &amp; shadcn</SectionHeading>
        <p className="text-secondary-foreground mb-6">
          FX Components is built on Tailwind CSS v4 and follows the shadcn/ui token convention. This means you get full
          compatibility with the Tailwind and shadcn ecosystems out of the box — no adapters, no mapping layers, no surprises.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tailwind v4 */}
          <div className="p-5 border border-border rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-md bg-blue-100 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-blue-600" fill="currentColor"><path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" /></svg>
              </div>
              <h3 className="text-lg font-semibold">Tailwind CSS v4</h3>
            </div>
            <div className="space-y-3 text-sm">
              <p className="text-secondary-foreground">
                Components are styled entirely with Tailwind utility classes. We use the v4 <code className="text-xs bg-muted px-1 py-0.5 rounded">@theme</code> directive
                to register design tokens — no <code className="text-xs bg-muted px-1 py-0.5 rounded">tailwind.config.js</code> needed.
              </p>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-sapphire-positive mt-0.5">&#10003;</span>
                  <span className="text-secondary-foreground"><strong className="text-foreground">Native CSS-first config</strong> — tokens defined in CSS, not JavaScript</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-sapphire-positive mt-0.5">&#10003;</span>
                  <span className="text-secondary-foreground"><strong className="text-foreground">Opacity modifier support</strong> — write <code className="text-xs bg-muted px-1 py-0.5 rounded">bg-primary/50</code> and it just works</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-sapphire-positive mt-0.5">&#10003;</span>
                  <span className="text-secondary-foreground"><strong className="text-foreground">Full utility access</strong> — use any Tailwind class alongside FX Components</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-sapphire-positive mt-0.5">&#10003;</span>
                  <span className="text-secondary-foreground"><strong className="text-foreground">@custom-variant dark</strong> — dark mode via CSS class, not media query</span>
                </div>
              </div>
            </div>
          </div>

          {/* shadcn */}
          <div className="p-5 border border-border rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-md bg-neutral-100 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3L4 21h16L12 3z" /></svg>
              </div>
              <h3 className="text-lg font-semibold">shadcn/ui Convention</h3>
            </div>
            <div className="space-y-3 text-sm">
              <p className="text-secondary-foreground">
                Our token names follow the shadcn/ui standard: <code className="text-xs bg-muted px-1 py-0.5 rounded">--background</code>, <code className="text-xs bg-muted px-1 py-0.5 rounded">--primary</code>, <code className="text-xs bg-muted px-1 py-0.5 rounded">--muted</code>, etc.
                Any shadcn component or recipe works without modification.
              </p>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-sapphire-positive mt-0.5">&#10003;</span>
                  <span className="text-secondary-foreground"><strong className="text-foreground">Same CSS variable names</strong> — <code className="text-xs bg-muted px-1 py-0.5 rounded">--primary</code>, <code className="text-xs bg-muted px-1 py-0.5 rounded">--card</code>, <code className="text-xs bg-muted px-1 py-0.5 rounded">--border</code>, etc.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-sapphire-positive mt-0.5">&#10003;</span>
                  <span className="text-secondary-foreground"><strong className="text-foreground">Same utility classes</strong> — <code className="text-xs bg-muted px-1 py-0.5 rounded">bg-card</code>, <code className="text-xs bg-muted px-1 py-0.5 rounded">text-secondary-foreground</code> work identically</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-sapphire-positive mt-0.5">&#10003;</span>
                  <span className="text-secondary-foreground"><strong className="text-foreground">Drop-in themes</strong> — shadcn themes from the registry or community work as-is</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-sapphire-positive mt-0.5">&#10003;</span>
                  <span className="text-secondary-foreground"><strong className="text-foreground">Extended, not forked</strong> — sapphire-* tokens add to shadcn, never replace it</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How they layer */}
        <div className="mt-6 p-5 bg-muted/50 rounded-lg">
          <h3 className="text-sm font-semibold text-foreground mb-3">How the layers fit together</h3>
          <div className="space-y-1 text-sm font-mono">
            <div className="flex items-center gap-3">
              <span className="w-28 text-right text-secondary-foreground shrink-0">shadcn core</span>
              <div className="flex-1 h-8 bg-primary/15 rounded flex items-center px-3 text-xs">
                --background, --primary, --muted, --border, --card, --ring ...
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-28 text-right text-secondary-foreground shrink-0">+ sapphire</span>
              <div className="flex-1 h-8 bg-purple-100 rounded flex items-center px-3 text-xs">
                --text-tertiary, --button-accent2, --positive, --negative, --chrome-*, --spacing-* ...
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-28 text-right text-secondary-foreground shrink-0">= Tailwind</span>
              <div className="flex-1 h-8 bg-sapphire-positive-bg rounded flex items-center px-3 text-xs">
                bg-primary, text-sapphire-text-tertiary, p-sapphire-m, border-border ...
              </div>
            </div>
          </div>
          <p className="text-xs text-secondary-foreground mt-3">
            The shadcn layer gives you compatibility with the ecosystem. The sapphire layer gives you the enterprise tokens that shadcn doesn't cover.
            Both resolve through the same Tailwind @theme block, so there's no runtime cost — it's all CSS.
          </p>
        </div>

        {/* Why these specific names */}
        <div className="mt-6 p-5 border border-sapphire-border-active rounded-lg bg-sapphire-info-bg/30">
          <h3 className="text-sm font-semibold text-foreground mb-2">Why these specific variable names?</h3>
          <div className="space-y-2 text-sm text-secondary-foreground">
            <p>
              <strong className="text-foreground">Tailwind itself has no opinion on CSS variable names.</strong>{" "}
              You could name them <code className="text-xs bg-muted px-1 py-0.5 rounded">--banana</code> or{" "}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">--brand-surface</code> and Tailwind would
              happily generate utilities for them.
            </p>
            <p>
              The names <code className="text-xs bg-muted px-1 py-0.5 rounded">--primary</code>,{" "}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">--background</code>,{" "}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">--muted-foreground</code>, etc. come from{" "}
              <strong className="text-foreground">shadcn/ui</strong> — a widely adopted convention that has become a de facto
              standard in the Tailwind ecosystem. Our components render classes
              like <code className="text-xs bg-muted px-1 py-0.5 rounded">bg-primary</code> and{" "}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">text-secondary-foreground</code> that are bound to these names.
            </p>
            <p>
              <strong className="text-foreground">This means these variable names are a contract.</strong>{" "}
              To theme this library, you define values for these specific CSS variables.
              You don't need to use shadcn itself — just its naming convention for the token layer.
            </p>
          </div>
        </div>
      </section>

      {/* ── What Classes to Use ───────────────────────────────────── */}
      <section id="which-classes" className="p-6 border border-border rounded-lg bg-card">
        <SectionHeading id="which-classes" page="theming">Which Classes to Use</SectionHeading>
        <p className="text-secondary-foreground mb-4">
          Three tiers: <strong>shadcn standard</strong> first, then <strong>palette</strong> (direct color names), then <strong>sapphire-*</strong> for spacing and SAP-specific semantics.
        </p>

        <div className="mb-6 p-5 border border-sapphire-border-active rounded-lg bg-sapphire-info-bg/30">
          <h3 className="text-sm font-semibold text-foreground mb-2">When does "sapphire-" appear?</h3>
          <div className="space-y-2 text-sm text-secondary-foreground">
            <p>
              The naming follows a simple rule: if a token already has a well-known name in Tailwind or shadcn, you use that name directly.
              Everything else — the SAP-specific tokens that shadcn doesn't know about — gets
              a <code className="text-xs bg-muted px-1 py-0.5 rounded">sapphire-</code> prefix so it won't clash with standard names.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
              <div className="p-3 bg-background rounded-lg border border-border">
                <div className="text-xs font-semibold text-foreground mb-1">shadcn names → direct</div>
                <div className="text-xs">
                  <code className="bg-muted px-1 py-0.5 rounded">--primary</code> → <code className="bg-muted px-1 py-0.5 rounded">bg-primary</code>
                </div>
              </div>
              <div className="p-3 bg-background rounded-lg border border-border">
                <div className="text-xs font-semibold text-foreground mb-1">Palette → direct</div>
                <div className="text-xs">
                  <code className="bg-muted px-1 py-0.5 rounded">--color-purple-500</code> → <code className="bg-muted px-1 py-0.5 rounded">bg-purple-500</code>
                </div>
              </div>
              <div className="p-3 bg-background rounded-lg border border-border">
                <div className="text-xs font-semibold text-foreground mb-1">SAP-specific → sapphire-*</div>
                <div className="text-xs">
                  <code className="bg-muted px-1 py-0.5 rounded">--prompt-accent</code> → <code className="bg-muted px-1 py-0.5 rounded">text-sapphire-prompt-accent</code>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">shadcn standard (use these first)</h3>
            <div className="flex flex-wrap gap-2">
              {[
                "text-foreground", "text-secondary-foreground", "text-secondary-foreground",
                "bg-background", "bg-muted", "bg-card", "bg-accent",
                "bg-primary", "text-primary", "bg-destructive",
                "border-border", "ring-ring",
              ].map((cls) => (
                <code key={cls} className="text-xs bg-muted px-2 py-1 rounded font-mono">{cls}</code>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Palette colors (direct names — no prefix)</h3>
            <div className="flex flex-wrap gap-2">
              {[
                "bg-purple-500", "text-purple-600", "border-purple-300",
                "bg-blue-500", "text-blue-600",
                "bg-neutral-100", "text-neutral-700",
                "bg-brand-purple", "bg-brand-blue",
              ].map((cls) => (
                <code key={cls} className="text-xs bg-muted px-2 py-1 rounded font-mono">{cls}</code>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">sapphire-* extensions (what shadcn doesn't cover)</h3>
            <div className="overflow-x-auto">
              <table className="text-sm w-full">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="py-2 pr-4 font-medium text-secondary-foreground">Category</th>
                    <th className="py-2 font-medium text-secondary-foreground">Example Classes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    { cat: "Text levels", classes: "text-sapphire-text-tertiary, text-sapphire-text-disabled" },
                    { cat: "Surfaces", classes: "bg-sapphire-background-tertiary, bg-sapphire-background-quaternary, bg-sapphire-canvas-primary" },
                    { cat: "Borders", classes: "border-sapphire-border-active, border-sapphire-border-accent" },
                    { cat: "Buttons", classes: "bg-sapphire-brand-background, text-sapphire-neutral-foreground-white" },
                    { cat: "Notifications", classes: "text-sapphire-positive, bg-sapphire-info-bg" },
                    { cat: "Chrome", classes: "bg-sapphire-chrome-bg-primary, text-sapphire-chrome-fg-primary" },
                    { cat: "Icons", classes: "text-sapphire-brand-foreground, text-sapphire-text-tertiary" },
                    { cat: "Prompt", classes: "text-sapphire-prompt-accent, border-sapphire-prompt-accent-muted" },
                  ].map((row) => (
                    <tr key={row.cat}>
                      <td className="py-2 pr-4 font-medium whitespace-nowrap">{row.cat}</td>
                      <td className="py-2">
                        <div className="flex flex-wrap gap-1.5">
                          {row.classes.split(", ").map((cls) => (
                            <code key={cls} className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">{cls}</code>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-4 bg-sapphire-negative-bg rounded-lg">
            <p className="text-sm text-sapphire-negative font-medium">
              Do NOT use hard-coded colors like <code className="text-xs bg-background/50 px-1 py-0.5 rounded">text-green-500</code> or <code className="text-xs bg-background/50 px-1 py-0.5 rounded">bg-red-100</code>.
              Use semantic tokens so colors adapt to every theme automatically.
            </p>
          </div>
        </div>
      </section>

      {/* ── Spacing Scale ─────────────────────────────────────────── */}
      <section id="spacing-scale" className="p-6 border border-border rounded-lg bg-card">
        <SectionHeading id="spacing-scale" page="theming">Spacing Scale</SectionHeading>
        <p className="text-secondary-foreground mb-4">
          The Sapphire spacing scale provides named tokens from <strong>3XS</strong> (4px) to <strong>4XL</strong> (64px).
          Use standard Tailwind spacing (<code className="text-xs bg-muted px-1 py-0.5 rounded">p-4</code>, <code className="text-xs bg-muted px-1 py-0.5 rounded">gap-6</code>)
          for general layout. Use named spacing tokens when you need to match a specific Figma spec.
        </p>

        <div className="space-y-2 max-w-xl">
          {spacingScale.map(({ token, px }) => (
            <div key={token} className="flex items-center gap-4">
              <span className="text-sm font-medium w-10 text-right uppercase text-secondary-foreground">{token}</span>
              <span className="text-sm font-mono w-10 text-right text-secondary-foreground">{px}</span>
              <div className="flex-1 flex items-center">
                <div
                  className="h-2.5 rounded-full bg-primary"
                  style={{ width: `${px * 2}px` }}
                />
              </div>
              <code className="text-xs font-mono text-secondary-foreground hidden sm:block">p-{token}</code>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">CSS Variables</h3>
            <CodeBlock
              language="css"
              code={`:root {
  --spacing-3xs: 4px;
  --spacing-2xs: 8px;
  --spacing-xs:  12px;
  --spacing-s:   16px;
  --spacing-m:   20px;
  --spacing-l:   24px;
  --spacing-xl:  32px;
  --spacing-2xl: 40px;
  --spacing-3xl: 48px;
  --spacing-4xl: 64px;
}`}
            />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">Tailwind Classes</h3>
            <CodeBlock
              language="tsx"
              code={`// Named spacing (sapphire- prefix)
<div className="p-sapphire-m" />      // 20px
<div className="gap-sapphire-xl" />   // 32px
<div className="m-sapphire-s" />      // 16px

// Standard Tailwind (also fine)
<div className="p-4" />               // 16px
<div className="gap-6" />             // 24px`}
            />
          </div>
        </div>
      </section>

      {/* ── Color Tokens ─────────────────────────────────────────── */}
      <section id="color-tokens" className="p-6 border border-border rounded-lg bg-card">
        <SectionHeading id="color-tokens" page="theming">Color Tokens</SectionHeading>
        <p className="text-secondary-foreground mb-6">
          Every CSS variable defined in <code className="text-xs bg-muted px-1 py-0.5 rounded">tokens.css</code>, grouped by purpose.
          Swatches reflect the currently active theme. The resolved value is shown on the right.
        </p>

        <div className="space-y-8">
          <SwatchGroup
            title="Core (shadcn)"
            tokens={[
              { variable: "--background", label: "Page background" },
              { variable: "--foreground", label: "Default text" },
              { variable: "--card", label: "Card surface" },
              { variable: "--card-foreground", label: "Card text" },
              { variable: "--popover", label: "Popover surface" },
              { variable: "--popover-foreground", label: "Popover text" },
              { variable: "--primary", label: "Primary accent" },
              { variable: "--primary-foreground", label: "Text on primary" },
              { variable: "--secondary", label: "Secondary surface" },
              { variable: "--secondary-foreground", label: "Secondary text" },
              { variable: "--muted", label: "Muted surface" },
              { variable: "--muted-foreground", label: "Muted text" },
              { variable: "--accent", label: "Accent surface" },
              { variable: "--accent-foreground", label: "Accent text" },
              { variable: "--destructive", label: "Destructive action" },
              { variable: "--destructive-foreground", label: "Text on destructive" },
              { variable: "--border", label: "Default border" },
              { variable: "--input", label: "Input border" },
              { variable: "--ring", label: "Focus ring" },
            ]}
          />

          <hr className="border-border" />

          <SwatchGroup
            title="Text"
            tokens={[
              { variable: "--text-primary", label: "Primary text (→ foreground)" },
              { variable: "--text-secondary", label: "Secondary text (→ secondary-foreground)" },
              { variable: "--text-tertiary", label: "Tertiary text" },
              { variable: "--text-disabled", label: "Disabled text" },
              { variable: "--text-accent", label: "Accent text (→ primary)" },
              { variable: "--text-on-surface", label: "Text on colored surfaces" },
            ]}
          />

          <hr className="border-border" />

          <SwatchGroup
            title="Surfaces & Backgrounds"
            tokens={[
              { variable: "--background-primary", label: "Primary background (→ background)" },
              { variable: "--background-secondary", label: "Secondary background (→ secondary)" },
              { variable: "--background-tertiary", label: "Tertiary background" },
              { variable: "--background-quaternary", label: "Quaternary background" },
              { variable: "--canvas-primary", label: "Canvas / content area" },
              { variable: "--card-bg-primary", label: "Card background (→ card)" },
            ]}
          />

          <hr className="border-border" />

          <SwatchGroup
            title="Borders"
            tokens={[
              { variable: "--border-primary", label: "Default border (→ border)" },
              { variable: "--border-active", label: "Active / hover border" },
              { variable: "--border-accent", label: "Accent border (→ ring)" },
            ]}
          />

          <hr className="border-border" />

          <SwatchGroup
            title="Chrome (Shell UI)"
            tokens={[
              { variable: "--chrome-bg-primary", label: "Shell background" },
              { variable: "--chrome-fg-primary", label: "Shell foreground" },
              { variable: "--chrome-bg-tertiary", label: "Shell tertiary bg" },
              { variable: "--chrome-button-fg-default", label: "Shell button text" },
              { variable: "--chrome-button-bg-selected", label: "Shell button selected bg" },
              { variable: "--chrome-button-fg-selected", label: "Shell button selected text" },
              { variable: "--chrome-button-bg-default", label: "Shell button default bg" },
            ]}
          />

          <hr className="border-border" />

          <SwatchGroup
            title="Buttons"
            tokens={[
              { variable: "--brand-background", label: "Primary button bg" },
              { variable: "--brand-hover-background", label: "Primary button hover" },
              { variable: "--joule-background", label: "Joule / AI button bg" },
              { variable: "--joule-hover-background", label: "Joule button hover" },
              { variable: "--button-fg-disabled", label: "Disabled button text" },
              { variable: "--button-bg-disabled", label: "Disabled button bg" },
              { variable: "--neutral-foreground-white", label: "Text on accent button" },
            ]}
          />

          <hr className="border-border" />

          <SwatchGroup
            title="Icons"
            tokens={[
              { variable: "--brand-foreground", label: "Accent icon (→ Brand/foreground)" },
              { variable: "--text-primary", label: "Primary icon (→ Text/text-primary)" },
              { variable: "--text-tertiary", label: "Muted icon (→ Text/text-tertiary)" },
              { variable: "--neutral-foreground-white", label: "Inverted icon (→ Neutral/foreground-white)" },
            ]}
          />

          <hr className="border-border" />

          <SwatchGroup
            title="Notifications / Status"
            tokens={[
              { variable: "--negative", label: "Error / destructive" },
              { variable: "--warning", label: "Warning" },
              { variable: "--info", label: "Informational" },
              { variable: "--positive", label: "Success" },
              { variable: "--negative-bg", label: "Error background" },
              { variable: "--warning-bg", label: "Warning background" },
              { variable: "--info-bg", label: "Info background" },
              { variable: "--positive-bg", label: "Success background" },
            ]}
          />

          <hr className="border-border" />

          <SwatchGroup
            title="Prompt (Joule)"
            tokens={[
              { variable: "--prompt-accent", label: "Prompt accent (text/icons)" },
              { variable: "--prompt-accent-muted", label: "Prompt accent muted (borders)" },
              { variable: "--prompt-accent-subtle", label: "Prompt accent subtle (glows)" },
            ]}
          />

          <hr className="border-border" />

          <SwatchGroup
            title="Brand"
            tokens={[
              { variable: "--color-brand-blue", label: "Brand blue" },
              { variable: "--color-brand-purple", label: "Brand purple" },
            ]}
          />

          <SwatchGroup
            title="Neutrals (Palette)"
            tokens={[
              { variable: "--color-neutral-50", label: "Neutral 50" },
              { variable: "--color-neutral-100", label: "Neutral 100" },
              { variable: "--color-neutral-200", label: "Neutral 200" },
              { variable: "--color-neutral-300", label: "Neutral 300" },
              { variable: "--color-neutral-400", label: "Neutral 400" },
              { variable: "--color-neutral-500", label: "Neutral 500 (base)" },
              { variable: "--color-neutral-600", label: "Neutral 600" },
              { variable: "--color-neutral-700", label: "Neutral 700" },
              { variable: "--color-neutral-800", label: "Neutral 800" },
              { variable: "--color-neutral-900", label: "Neutral 900" },
              { variable: "--color-neutral-950", label: "Neutral 950" },
            ]}
          />

          <SwatchGroup
            title="Blues (Palette)"
            tokens={[
              { variable: "--color-blue-50", label: "Blue 50" },
              { variable: "--color-blue-100", label: "Blue 100" },
              { variable: "--color-blue-200", label: "Blue 200" },
              { variable: "--color-blue-300", label: "Blue 300" },
              { variable: "--color-blue-400", label: "Blue 400" },
              { variable: "--color-blue-500", label: "Blue 500 (brand)" },
              { variable: "--color-blue-600", label: "Blue 600" },
              { variable: "--color-blue-700", label: "Blue 700" },
              { variable: "--color-blue-800", label: "Blue 800" },
              { variable: "--color-blue-900", label: "Blue 900" },
              { variable: "--color-blue-950", label: "Blue 950" },
            ]}
          />

          <SwatchGroup
            title="Purples (Palette)"
            tokens={[
              { variable: "--color-purple-50", label: "Purple 50" },
              { variable: "--color-purple-100", label: "Purple 100" },
              { variable: "--color-purple-200", label: "Purple 200" },
              { variable: "--color-purple-300", label: "Purple 300" },
              { variable: "--color-purple-400", label: "Purple 400" },
              { variable: "--color-purple-500", label: "Purple 500 (brand)" },
              { variable: "--color-purple-600", label: "Purple 600" },
              { variable: "--color-purple-700", label: "Purple 700" },
              { variable: "--color-purple-800", label: "Purple 800" },
              { variable: "--color-purple-900", label: "Purple 900" },
              { variable: "--color-purple-950", label: "Purple 950" },
            ]}
          />
        </div>
      </section>

      {/* ── Token Files Reference ─────────────────────────────────── */}
      <section id="file-reference" className="p-6 border border-border rounded-lg bg-card">
        <SectionHeading id="file-reference" page="theming">File Reference</SectionHeading>
        <p className="text-secondary-foreground mb-4">
          Where to find and edit theme-related files.
        </p>

        <div className="space-y-4">
          {[
            {
              file: "src/theme/tokens.css",
              purpose: "Concrete CSS variable values",
              detail: "Defines :root (light) and .theme-dark values. This is the source of truth for all token values. Edit here to change the default Sapphire look.",
            },
            {
              file: "src/theme/sapphire-theme.css",
              purpose: "Tailwind @theme registration (auto-generated)",
              detail: "Auto-generated by scripts/sync-theme-tokens.mjs from tokens.css. Maps CSS variables to Tailwind utility classes. Never edit manually — run npm run build to regenerate.",
            },
            {
              file: "src/theme/styles-input.css",
              purpose: "CSS entry point",
              detail: "Imports Tailwind, theme, and component styles. The @custom-variant dark selector is defined here.",
            },
          ].map((item) => (
            <div key={item.file} className="p-4 border border-border rounded-lg">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <code className="text-sm font-mono font-semibold text-primary">{item.file}</code>
                  <span className="text-sm text-secondary-foreground ml-2">— {item.purpose}</span>
                  <p className="text-sm text-secondary-foreground mt-1">{item.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Creating a Custom Theme ───────────────────────────────── */}
      <section id="custom-theme" className="p-6 border border-border rounded-lg bg-card">
        <SectionHeading id="custom-theme" page="theming">Creating a Custom Theme</SectionHeading>
        <p className="text-secondary-foreground mb-6">
          Define the required CSS variables in a class, register it with ThemeProvider, and every component picks it up automatically.
        </p>

        {/* Required variables */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Required Variables</h3>
          <p className="text-sm text-secondary-foreground mb-3">
            Every theme <strong className="text-foreground">must</strong> define these {"\u007E"}19 core tokens.
            They control all component surfaces, text, borders, and status colors.
          </p>
          <CodeBlock
            language="css"
            code={`/* my-brand-theme.css */
.theme-mybrand {
  /* Surfaces */
  --background: #FFF8FA;            /* Page background */
  --card: #FFFFFF;                  /* Card / elevated surface */
  --card-foreground: #1A1A2E;       /* Text on cards */
  --popover: #FFFFFF;               /* Popover / dropdown surface */
  --popover-foreground: #1A1A2E;    /* Text on popovers */

  /* Text */
  --foreground: #1A1A2E;            /* Default body text */
  --muted: #FDE8F0;                 /* Muted surface */
  --muted-foreground: #6B4D57;      /* Secondary / helper text */

  /* Accent */
  --primary: #E91E63;               /* Primary action / links */
  --primary-foreground: #FFFFFF;    /* Text on primary */
  --secondary: #F5F0FF;             /* Secondary surface */
  --secondary-foreground: #1A1A2E;  /* Text on secondary */
  --accent: #FCE4EC;                /* Hover / highlight surface */
  --accent-foreground: #1A1A2E;     /* Text on accent */

  /* Borders & Focus */
  --border: #F3D5E0;                /* Default border */
  --input: #F3D5E0;                 /* Input border */
  --ring: #E91E63;                  /* Focus ring */
  --radius: 0.5rem;                 /* Corner radius */

  /* Destructive */
  --destructive: #DC2626;           /* Destructive action */
  --destructive-foreground: #FFFFFF;

  /* Status (used by Status, MessageStrip, etc.) */
  --negative: #DC2626;
  --warning: #CA7E0C;
  --info: #0064D9;
  --positive: #007B3E;
  --negative-bg: #FEE2E2;
  --warning-bg: #FEF3C7;
  --info-bg: #DBEAFE;
  --positive-bg: #DCFCE7;
}`}
          />
        </div>

        {/* Optional extensions */}
        <div className="mb-6 p-4 bg-muted/50 rounded-lg">
          <h3 className="text-sm font-semibold text-foreground mb-2">Sapphire extensions are optional</h3>
          <p className="text-sm text-secondary-foreground">
            The <code className="text-xs bg-muted px-1 py-0.5 rounded">sapphire-*</code> tokens
            (<code className="text-xs bg-muted px-1 py-0.5 rounded">--text-tertiary</code>,{" "}
            <code className="text-xs bg-muted px-1 py-0.5 rounded">--brand-background</code>,{" "}
            <code className="text-xs bg-muted px-1 py-0.5 rounded">--chrome-bg-primary</code>, etc.)
            are aliases that point to the core tokens via <code className="text-xs bg-muted px-1 py-0.5 rounded">var()</code>. For example,{" "}
            <code className="text-xs bg-muted px-1 py-0.5 rounded">--text-tertiary</code> resolves
            to <code className="text-xs bg-muted px-1 py-0.5 rounded">var(--color-neutral-700)</code> in light and{" "}
            <code className="text-xs bg-muted px-1 py-0.5 rounded">var(--color-neutral-300)</code> in dark.
            Custom themes only need to override them for finer control over specific UI areas.
          </p>
        </div>

        {/* Register */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Register Your Theme</h3>
          <p className="text-sm text-secondary-foreground mb-3">
            The <code className="text-xs bg-muted px-1 py-0.5 rounded">id</code> must match
            the CSS class suffix: <code className="text-xs bg-muted px-1 py-0.5 rounded">id: "mybrand"</code> {"\u2192"}{" "}
            <code className="text-xs bg-muted px-1 py-0.5 rounded">.theme-mybrand</code>.
          </p>
          <CodeBlock
            language="tsx"
            code={`<ThemeProvider
  themes={[
    { id: 'light', name: 'Sapphire Light' },
    { id: 'dark', name: 'Sapphire Dark' },
    { id: 'mybrand', name: 'My Brand' },
  ]}
  defaultTheme="mybrand"
>
  <App />
</ThemeProvider>`}
          />
        </div>

        {/* Summary */}
        <div className="p-4 bg-sapphire-positive-bg/50 rounded-lg">
          <p className="text-sm text-sapphire-positive font-medium">
            That's it. Define the CSS variables, add the class to ThemeProvider, and every component
            — buttons, cards, inputs, menus — uses your colors automatically. No Tailwind config changes,
            no component modifications.
          </p>
        </div>
      </section>
    </div>
  );
}
