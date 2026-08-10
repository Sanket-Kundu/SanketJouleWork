# FX Components (React)

> **[Components](https://pages.github.tools.sap/ui/fx-components/)**
>
> **[Shell](https://pages.github.tools.sap/ui/fx-components/fx-layout/)**

React implementation of SAP Fiori fx-components, styled with Tailwind CSS. This project provides enterprise-grade UI components for building SAP Fiori experiences in React.

## Overview

FX Components is a React-native implementation of SAP Fiori UI patterns. It provides the same design language and user experience as the fx-components web components library, reimplemented as pure React components with Tailwind CSS styling.

### Key Features

- **Pure React** - No Web Components dependencies, just React and Tailwind CSS
- **Enterprise-ready** - Implements SAP Fiori design specifications
- **Accessible** - Built with accessibility in mind (ARIA attributes, keyboard navigation)
- **Customizable** - Tailwind CSS-based styling that's easy to extend
- **TypeScript** - Full TypeScript support with comprehensive type definitions

## Components

### Core Components
- Button, Input, Select, ComboBox, Checkbox, RadioButton
- Label, Link, Badge, Title
- Card, List, Table, Tabs
- Toggle, ToggleButton, SegmentedButton
- Menu, MessageStrip, DatePicker, Calendar

### Fx Layout Components (Fiori Experience)
- **FxLayout** - Three-pane responsive layout with navigation
- **FxSideNavigation** - Side navigation with collapse/expand and flyout behavior
- **FxPaneHeader** - Header component for layout panes
- **FxPromptInput** - AI assistant prompt input field

📖 **[FX Components Integration Guide](./docs/fx/README.md)** - Comprehensive documentation for building apps with FxLayout

## Installation

```bash
npm install @sap-ui/fx-components
```

## Setup

There are two ways to set up theming:

### Quick Setup

One import — Sapphire theme with light/dark mode works out of the box:

```tsx
// main.tsx
import '@sap-ui/fx-components/styles.css'
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
)
```

`styles.css` is pre-compiled — it includes all CSS the components need. No Tailwind installation required in your project.

### Custom Tailwind Setup

Use this when you want to use Tailwind utility classes in your own code, or customize theme colors.

Generate the CSS entry file:

```bash
npx @sap-ui/fx-components init              # writes src/index.css
npx @sap-ui/fx-components init src/app.css  # custom path
```

This creates a Tailwind entry file with library imports and **all Sapphire token values inlined** — edit any color directly. Or write it by hand:

```css
/* src/index.css */
@import "tailwindcss";
@import "@sap-ui/fx-components/theme.css";
@import "@sap-ui/fx-components/components.css";

@custom-variant dark (&:is(.dark *, .theme-dark *));

/* Your token values */
:root {
  --background: #fff;
  --foreground: #111;
  --primary: #0040CD;
  /* ... */
}

.theme-dark {
  --background: #040511;
  --foreground: #F3F4F6;
  /* ... */
}
```

Requires Tailwind CSS v4:

```bash
npm install -D tailwindcss @tailwindcss/vite        # Vite
npm install -D tailwindcss @tailwindcss/postcss      # Next.js / PostCSS
```

## Use Components

```tsx
import { Button, Badge, Input, Card, CardHeader } from '@sap-ui/fx-components'

function App() {
  return (
    <Card>
      <CardHeader titleText="My App" />
      <Input placeholder="Enter your name" />
      <Button design="Primary">Save</Button>
      <Badge design="Positive">Active</Badge>
    </Card>
  )
}
```

## Icons

The library ships 703 SAP icon components generated from the SAP-icons-v5 collection. Each icon carries its original JSON name on the `iconName` property.

### Single icon import

```tsx
import { AcceptIcon } from '@sap-ui/fx-components/icons'

<AcceptIcon />

AcceptIcon.iconName // "accept"
```

### Tree-shakeable deep import

```tsx
import { EmployeeIcon } from '@sap-ui/fx-components/icons/Employee'
```

### Building a name-to-icon map

```tsx
import * as AllIcons from '@sap-ui/fx-components/icons'

const iconMap = Object.fromEntries(
  Object.values(AllIcons)
    .filter(icon => icon.iconName)
    .map(icon => [icon.iconName, icon])
)

// Look up by original JSON name
const Icon = iconMap['add-filter'] // AddFilterIcon
```

### Fonts (optional)

The Sapphire theme uses the SAP 72 font. Copy the `.woff2` files from [public/fonts](./public/fonts) into your `public/fonts/` folder, then add the import to your CSS:

```css
@import url('/fonts/72.css');
```

## FxLayout Example

```tsx
import { FxLayout, FxPaneHeader, FxPromptInput } from '@sap-ui/fx-components';

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
  );
}
```

## Development

```bash
# Install dependencies
npm install

# Build the component library
npm run build

# Start demo dev server
npm run dev:demo

# Start el-demo dev server
npm run dev:el-demo

# Run all tests
npm test

# Run tests matching a pattern
npm test -- Button

# Run tests with coverage report
npm run test:coverage
```

### Claude Code Commands

**`/start`** — Start the demo dev server (`npm run dev:demo`) for local development.

**`/start-el`** — Start the el-demo dev server (`npm run dev:el-demo`) for local development.

**`/test`** — Run the component test suite with code coverage.

```
/test                 # run all tests with coverage report
/test Button          # run only tests matching "Button"
```

**Note:** The `coverage` report is generated at the root and gitignored.

**`/release`** — Trigger a release via GitHub Actions (bump version, commit, tag, push, Piper).

```
/release              # patch bump (default): 0.1.12 → 0.1.13
/release minor        # minor bump: 0.1.12 → 0.2.0
/release major        # major bump: 0.1.12 → 1.0.0
/release 0.3.0        # specific version (resolved to the appropriate bump type)
```

**Note:** The release command shows current and target versions, asks for confirmation, then dispatches the workflow and provides a link to monitor the run.

## Project Structure

```
├── src/                    # Component library source
│   ├── components/         # React components
│   ├── types/              # TypeScript definitions
│   ├── hooks/              # Hooks
│   ├── icons/              # Icon components
│   ├── illustrations/      # Illustration components
│   ├── i18n/               # Internationalization
│   ├── lib/                # Utilities
│   ├── theme/              # Theme utilities
│   └── index.ts            # Main entry point
├── demos/
│   ├── demo/               # Component showcase
│   └── el-demo/            # Main demo app (FxLayout)
├── scripts/                # Build scripts
└── docs/                   # Documentation
```

## Related Projects

- **[fx-components](https://github.tools.sap/user-assistance/fx-components)** - The original Web Components library
- **[UI5 Web Components](https://github.com/SAP/ui5-webcomponents)** - SAP Fiori Web Components

## License

Apache-2.0
