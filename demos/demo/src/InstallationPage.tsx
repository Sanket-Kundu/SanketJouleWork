import { CodeBlock } from "./components/CodeBlock";
import { SectionHeading } from "./components/SectionHeading";

export function InstallationPage() {
  return (
    <div className="space-y-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-3">Getting Started</h1>
        <p className="text-lg text-secondary-foreground max-w-2xl">
          FX Components is a pure React UI library styled with Tailwind CSS.
          Fully typed, tree-shakeable, and enterprise-ready.
        </p>
      </header>

      {/* Install */}
      <section id="installation" className="p-6 border border-border rounded-lg bg-card">
        <SectionHeading id="installation" page="installation">Installation</SectionHeading>
        <p className="text-secondary-foreground mb-4">
          Configure the SAP npm registry for the <code className="text-xs bg-muted px-1.5 py-0.5 rounded">@sap-ui</code> scope,
          then install the package.
        </p>
        <div className="space-y-3">
          <CodeBlock
            title="One-time registry setup"
            language="bash"
            code={`npm config set @sap-ui:registry https://common.repositories.cloud.sap/artifactory/api/npm/deploy-releases-hyperspace-npm/
npm login --registry=https://common.repositories.cloud.sap/artifactory/api/npm/deploy-releases-hyperspace-npm/`}
          />
          <CodeBlock
            title="Install"
            language="bash"
            code="npm install @sap-ui/fx-components"
          />
        </div>
      </section>

      {/* Setup Options Overview */}
      <section id="setup-options" className="p-6 border border-border rounded-lg bg-card">
        <SectionHeading id="setup-options" page="installation">Setup Options</SectionHeading>
        <p className="text-secondary-foreground mb-5">
          Two ways to integrate the library, depending on how much control you need
          over CSS bundle size and theming.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="py-2 pr-4 font-medium"></th>
                <th className="py-2 px-4 font-medium">Quick Setup</th>
                <th className="py-2 px-4 font-medium">Custom Tailwind</th>
              </tr>
            </thead>
            <tbody className="text-secondary-foreground">
              <tr className="border-b border-border">
                <td className="py-2 pr-4 font-medium text-foreground">CSS size</td>
                <td className="py-2 px-4">~135 KB</td>
                <td className="py-2 px-4">~20 KB per component</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4 font-medium text-foreground">Tailwind required</td>
                <td className="py-2 px-4">No</td>
                <td className="py-2 px-4">Yes</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4 font-medium text-foreground">IntelliSense / @apply</td>
                <td className="py-2 px-4">No</td>
                <td className="py-2 px-4">Yes</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-foreground">Best for</td>
                <td className="py-2 px-4">Prototyping, quick start</td>
                <td className="py-2 px-4">Full theming control</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-sm text-secondary-foreground mt-4">
          CSS sizes measured for a Button-only app.
        </p>
      </section>

      {/* Quick Setup */}
      <section id="quick-setup" className="p-6 border border-border rounded-lg bg-card">
        <SectionHeading id="quick-setup" page="installation">Quick Setup</SectionHeading>
        <p className="text-secondary-foreground mb-4">
          The fastest way to get going. One import gives you all component styles,
          the Sapphire theme, and light/dark mode support. No Tailwind installation
          required in your project.
        </p>
        <CodeBlock
          title="main.tsx"
          language="tsx"
          code={`import '@sap-ui/fx-components/styles.css'
import { ThemeProvider } from '@sap-ui/fx-components'

createRoot(document.getElementById('root')!).render(
  <ThemeProvider
    themes={[
      { id: 'light', name: 'Light' },
      { id: 'dark', name: 'Dark' },
    ]}
    defaultTheme="light"
  >
    <App />
  </ThemeProvider>
)`}
        />
        <p className="text-sm text-secondary-foreground mt-3">
          <code className="text-xs bg-muted px-1.5 py-0.5 rounded">styles.css</code> is
          pre-compiled and includes everything the components need.
        </p>
      </section>

      {/* Custom Tailwind Setup */}
      <section id="custom-tailwind" className="p-6 border border-border rounded-lg bg-card">
        <SectionHeading id="custom-tailwind" page="installation">Custom Tailwind Setup</SectionHeading>
        <p className="text-secondary-foreground mb-4">
          Choose this path if you already have a Vite, Next.js, or similar project
          and want to use Tailwind utility classes alongside FX Components, or
          customize theme colors beyond the built-in presets. The steps below
          add Tailwind CSS to your existing build pipeline and wire up the
          library's design tokens so everything works together.
        </p>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">1. Install Tailwind CSS v4</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-3">
                <CodeBlock
                  title="Vite — install"
                  language="bash"
                  code="npm install -D tailwindcss @tailwindcss/vite"
                />
                <CodeBlock
                  title="vite.config.ts"
                  language="tsx"
                  code={`import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})`}
                />
              </div>
              <div className="space-y-3">
                <CodeBlock
                  title="Next.js / PostCSS — install"
                  language="bash"
                  code="npm install -D tailwindcss @tailwindcss/postcss"
                />
                <CodeBlock
                  title="postcss.config.mjs"
                  language="tsx"
                  code={`export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}`}
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">2. Generate the CSS entry file</h3>
            <p className="text-sm text-secondary-foreground mb-3">
              The init command creates a Tailwind entry file with library imports and all
              Sapphire token values inlined, ready for you to edit any color directly.
            </p>
            <CodeBlock
              language="bash"
              code={`npx @sap-ui/fx-components init              # writes src/index.css
npx @sap-ui/fx-components init src/app.css  # custom path`}
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">3. Or write it by hand</h3>
            <CodeBlock
              title="src/index.css"
              language="css"
              code={`@import "tailwindcss";
@import "@sap-ui/fx-components/theme.css";
@import "@sap-ui/fx-components/components.css";

@custom-variant dark (&:is(.dark *, .theme-dark *));

/* Sapphire Light — edit any value to customize */
:root {
  --background: #FEFDFF;
  --foreground: #0F1115;
  --card: #FFFFFF;
  --card-foreground: #0F1115;
  --popover: #FFFFFF;
  --popover-foreground: #0F1115;
  --primary: #0070F2;
  --primary-foreground: #FFFFFF;
  --secondary: #F8F9FA;
  --secondary-foreground: #2C313A;
  --muted: #F8F9FA;
  --muted-foreground: #636D83;
  --accent: #F8F9FA;
  --accent-foreground: #2C313A;
  --destructive-foreground: #FFFFFF;
  --border: #E6E7EA;
  --input: #E6E7EA;
  --ring: #0070F2;
  --radius: 0.5rem;
  --negative: #C72F2B;
  --warning: #CA7E0C;
  --info: #0064D9;
  --positive: #007B3E;
  --negative-bg: #F6E6E7;
  --positive-bg: #DFEFE6;
  --warning-bg: #FEF5C8;
  --info-bg: #E2E9F8;
}

/* Sapphire Dark */
.theme-dark {
  --background: #0F1115;
  --foreground: #F0F2F4;
  --card: #0F1115;
  --card-foreground: #F0F2F4;
  --popover: #0F1115;
  --popover-foreground: #F0F2F4;
  --primary: #1B90FF;
  --primary-foreground: #040511;
  --secondary: #0F1115;
  --secondary-foreground: #B5BCCA;
  --muted: #0F1115;
  --muted-foreground: #636D83;
  --accent: #171A20;
  --accent-foreground: #B5BCCA;
  --destructive-foreground: #FFFFFF;
  --border: #2C313A;
  --input: #2C313A;
  --ring: #4DB1FF;
  --radius: 0.5rem;
  --negative: #F63F3B;
  --warning: #FAAB19;
  --info: #1B90FB;
  --positive: #039F32;
  --negative-bg: #401B1A;
  --positive-bg: #112015;
  --warning-bg: #501507;
  --info-bg: #142B41;
}`}
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">4. Wrap your app in ThemeProvider</h3>
            <p className="text-sm text-secondary-foreground mb-3">
              ThemeProvider manages light/dark mode and theme switching.
              This step is the same as in the Quick Setup above.
            </p>
            <CodeBlock
              title="main.tsx"
              language="tsx"
              code={`import './index.css'
import { ThemeProvider } from '@sap-ui/fx-components'

createRoot(document.getElementById('root')!).render(
  <ThemeProvider
    themes={[
      { id: 'light', name: 'Light' },
      { id: 'dark', name: 'Dark' },
    ]}
    defaultTheme="light"
  >
    <App />
  </ThemeProvider>
)`}
            />
          </div>
        </div>
      </section>

      {/* Using Components */}
      <section id="using-components" className="p-6 border border-border rounded-lg bg-card">
        <SectionHeading id="using-components" page="installation">Using Components</SectionHeading>
        <p className="text-secondary-foreground mb-4">
          Import any component directly from the package. All components are tree-shakeable,
          fully typed, and enterprise-ready.
        </p>
        <CodeBlock
          title="App.tsx"
          language="tsx"
          code={`import { Button, Tag, Input, Card, CardHeader } from '@sap-ui/fx-components'

function App() {
  return (
    <Card>
      <CardHeader titleText="My App" />
      <Input placeholder="Enter your name" />
      <Button design="Primary">Save</Button>
      <Tag design="Positive">Active</Tag>
    </Card>
  )
}`}
        />
      </section>

      {/* Fonts */}
      <section id="fonts" className="p-6 border border-border rounded-lg bg-card">
        <SectionHeading id="fonts" page="installation">Fonts</SectionHeading>
        <p className="text-secondary-foreground mb-4">
          The Sapphire theme uses the SAP 72 font family. Copy
          the <code className="text-xs bg-muted px-1.5 py-0.5 rounded">.woff2</code> files
          from{" "}
          <a
            href="https://github.tools.sap/ui/fx-components/tree/main/public/fonts"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline hover:text-primary/80"
          >
            public/fonts
          </a>{" "}
          in the repository into
          your project's <code className="text-xs bg-muted px-1.5 py-0.5 rounded">public/fonts/</code> folder,
          then add the import to your CSS:
        </p>
        <CodeBlock
          language="css"
          code={`@import url('/fonts/72.css');`}
        />
        <p className="text-sm text-secondary-foreground mt-3">
          The font is optional. Components fall back to the system font stack
          (<code className="text-xs bg-muted px-1.5 py-0.5 rounded">-apple-system, BlinkMacSystemFont, ...</code>) when 72 is not available.
        </p>
      </section>

      {/* FxLayout Example */}
      <section id="fxlayout-example" className="p-6 border border-border rounded-lg bg-card">
        <SectionHeading id="fxlayout-example" page="installation">FxLayout Example</SectionHeading>
        <p className="text-secondary-foreground mb-4">
          Build SAP Fiori-style three-pane responsive layouts with the FxLayout component.
        </p>
        <CodeBlock
          language="tsx"
          code={`import { FxLayout, FxPaneHeader, FxPromptInput } from '@sap-ui/fx-components'

function App() {
  return (
    <FxLayout
      mode="conversations"
      navItems={[
        { name: 'conversations', text: 'Conversations', icon: <MessageIcon /> },
        { name: 'settings', text: 'Settings', icon: <SettingsIcon /> },
      ]}
      centerHeader={<FxPaneHeader title="Welcome" />}
      centerContent={<div>Your content here</div>}
      input={<FxPromptInput placeholder="Ask anything..." />}
    />
  )
}`}
        />
      </section>

      {/* What's Included */}
      <section id="whats-included" className="p-6 border border-border rounded-lg bg-card">
        <SectionHeading id="whats-included" page="installation">What's Included</SectionHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Core Components</h3>
            <ul className="space-y-1.5 text-sm text-secondary-foreground">
              <li>Button, Input, Select, ComboBox</li>
              <li>Checkbox, RadioButton, Switch</li>
              <li>Label, Link, Status, Text</li>
              <li>Card, List, Table, Tabs</li>
              <li>Menu, MessageStrip, DatePicker, Calendar</li>
              <li>Dialog, Popover, Panel</li>
              <li>SegmentedButton, SplitButton</li>
              <li>Breadcrumbs, Toolbar, Bar</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Layout Components</h3>
            <ul className="space-y-1.5 text-sm text-secondary-foreground">
              <li><strong>FxLayout</strong> — Three-pane responsive layout</li>
              <li><strong>FxSideNavigation</strong> — Collapsible side nav with flyout</li>
              <li><strong>FxPaneHeader</strong> — Header with overflow actions</li>
              <li><strong>FxPromptInput</strong> — AI prompt input field</li>
            </ul>
            <h3 className="text-lg font-medium mt-4 mb-2">Key Features</h3>
            <ul className="space-y-1.5 text-sm text-secondary-foreground">
              <li>Full TypeScript support</li>
              <li>WCAG 2.1 AA accessibility</li>
              <li>30+ locales with RTL support</li>
              <li>20+ theme presets</li>
              <li>Tree-shakeable exports</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
