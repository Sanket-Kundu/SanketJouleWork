import { Title, TitleLevel, TitleWrappingType } from "@sap-ui/fx-components";
import { CodeBlock } from "./components/CodeBlock";

export function TitlePage() {
  return (
    <div className="space-y-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Title</h1>
        <code className="text-sm text-primary/70 font-mono">{'import { Title } from "@sap-ui/fx-components"'}</code>
      </header>

      {/* All Levels */}
      <section id="title-levels" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold text-foreground mb-2">Title Levels</h2>
        <p className="text-secondary-foreground mb-4">
          Title renders semantic HTML headings (H1–H4) with consistent styling.
        </p>
        <div className="flex flex-col gap-4">
          <Title level={TitleLevel.H1}>Title 1 — Light 56/64</Title>
          <Title level={TitleLevel.H2}>Title 2 — Regular 40/48</Title>
          <Title level={TitleLevel.H3}>Title 3 — Regular 32/40</Title>
          <Title level={TitleLevel.H4}>Title 4 — Regular 20/28</Title>
          <Title level={TitleLevel.H4} className="font-semibold leading-8">Title 4 Strong — Semibold 20/32</Title>
        </div>
      </section>

      {/* Default Level */}
      <section id="default-level" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold text-foreground mb-2">Default Level</h2>
        <p className="text-secondary-foreground mb-4">
          Without a <code className="bg-muted px-1 rounded">level</code> prop, Title defaults to H2.
        </p>
        <Title>This is a default Title (H2)</Title>
      </section>

      {/* Wrapping Types */}
      <section id="wrapping-types" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold text-foreground mb-2">Wrapping Types</h2>
        <p className="text-secondary-foreground mb-4">
          Control how text behaves when it exceeds the container width.
        </p>
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-sm text-secondary-foreground mb-2">
              <strong>None (default):</strong> Truncates with ellipsis
            </p>
            <div className="max-w-xs border border-dashed border-border p-4 rounded">
              <Title level={TitleLevel.H4} wrappingType={TitleWrappingType.None}>
                This is a very long title that will be truncated with an ellipsis when it overflows the container
              </Title>
            </div>
          </div>
          <div>
            <p className="text-sm text-secondary-foreground mb-2">
              <strong>Normal:</strong> Wraps to multiple lines
            </p>
            <div className="max-w-xs border border-dashed border-border p-4 rounded">
              <Title level={TitleLevel.H4} wrappingType={TitleWrappingType.Normal}>
                This is a very long title that will wrap to multiple lines when it overflows the container
              </Title>
            </div>
          </div>
        </div>
      </section>

      {/* Page Layout Example */}
      <section id="page-layout-example" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold text-foreground mb-2">Page Layout Example</h2>
        <p className="text-secondary-foreground mb-4">
          Using Title to build a structured content hierarchy.
        </p>
        <div className="border border-border rounded-lg p-6 bg-background space-y-4">
          <Title level={TitleLevel.H2}>Getting Started</Title>
          <p className="text-secondary-foreground text-sm">
            Welcome to the platform. Follow the steps below to set up your account.
          </p>
          <Title level={TitleLevel.H4}>Step 1: Create an Account</Title>
          <p className="text-secondary-foreground text-sm">
            Visit the registration page and fill out the required fields.
          </p>
          <Title level={TitleLevel.H4}>Step 2: Verify Your Email</Title>
          <p className="text-secondary-foreground text-sm">
            Check your inbox and click the confirmation link.
          </p>
          <Title level={TitleLevel.H4}>Step 3: Configure Your Profile</Title>
          <p className="text-secondary-foreground text-sm">
            Add a profile picture and set your preferences.
          </p>
        </div>
      </section>

      {/* Custom Styling */}
      <section id="custom-styling" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold text-foreground mb-2">Custom Styling</h2>
        <p className="text-secondary-foreground mb-4">
          Override styles via <code className="bg-muted px-1 rounded">className</code> or{" "}
          <code className="bg-muted px-1 rounded">style</code>.
        </p>
        <div className="flex flex-col gap-4">
          <Title level={TitleLevel.H3} className="text-primary">
            Primary colored title
          </Title>
          <Title level={TitleLevel.H3} className="text-sapphire-positive">
            Positive colored title
          </Title>
          <Title level={TitleLevel.H3} className="text-sapphire-text-tertiary">
            Tertiary colored title
          </Title>
          <Title level={TitleLevel.H3} style={{ letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Uppercase spaced title
          </Title>
        </div>
      </section>

      {/* Usage Example */}
      <section id="usage-example" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-4">Usage Example</h2>
        <CodeBlock
          language="tsx"
          code={`import { Title, TitleLevel, TitleWrappingType } from "@sap-ui/fx-components";

// Default (H2)
<Title>Section Heading</Title>

// Specific heading level
<Title level={TitleLevel.H1}>Page Title</Title>
<Title level={TitleLevel.H4}>Subsection</Title>

// Wrapping — truncate with ellipsis (default)
<Title level={TitleLevel.H3}>
  This will truncate when too long...
</Title>

// Wrapping — allow multi-line
<Title level={TitleLevel.H3} wrappingType={TitleWrappingType.Normal}>
  This title will wrap to multiple lines instead of truncating
</Title>

// Custom styling
<Title level={TitleLevel.H2} className="text-primary">
  Styled Heading
</Title>`}
        />
      </section>
    </div>
  );
}
