---
name: install
description: Installation and setup guide for @sap-ui/fx-components. Use when a consumer asks how to install, set up styles, configure the registry, wrap with ThemeProvider, resolve peer dependencies (React 19, Tailwind v4), troubleshoot missing styles or broken themes, or scaffold a new project consuming this library.
user-invocable: false
---

## Package Info

- **Package:** `@sap-ui/fx-components`
- **Registry:** SAP npm registry (scoped to `@sap-ui`)
- **Peer deps:** `react ^19`, `react-dom ^19`, `tailwindcss ^4` (optional)
- **Two setup paths:** Quick (pre-built CSS) or Custom Tailwind (editable tokens)

## Step 1: Registry Setup (one-time)

```bash
npm config set @sap-ui:registry https://common.repositories.cloud.sap/artifactory/api/npm/deploy-releases-hyperspace-npm/
npm login --registry=https://common.repositories.cloud.sap/artifactory/api/npm/deploy-releases-hyperspace-npm/
```

Then install:

```bash
npm install @sap-ui/fx-components
```

## Step 2: Choose a Setup Path

### Quick Setup (no Tailwind required)

Import the pre-built CSS bundle — includes all component styles, Sapphire theme tokens, and light/dark mode:

```tsx
// main.tsx
import '@sap-ui/fx-components/styles.css'
```

That's it for styles. Skip to Step 3.

### Custom Tailwind Setup (editable tokens)

Use this when the consumer already has Tailwind v4, wants to use Tailwind utilities alongside library components, or needs to customize theme colors.

**Install Tailwind v4** (if not present):

- Vite: `npm install -D tailwindcss @tailwindcss/vite` → add `tailwindcss()` plugin to `vite.config.ts`
- Next.js / PostCSS: `npm install -D tailwindcss @tailwindcss/postcss` → add to `postcss.config.mjs`

**Generate the CSS entry file:**

```bash
npx @sap-ui/fx-components init              # writes src/index.css
npx @sap-ui/fx-components init src/app.css  # custom path
```

This generates a file containing:
- `@import "tailwindcss"`
- `@import "@sap-ui/fx-components/theme.css"` — Tailwind @theme mappings for `sapphire-*` utility classes
- `@import "@sap-ui/fx-components/components.css"` — component styles
- `@custom-variant dark (&:is(.dark *, .theme-dark *))` — dark mode variant
- All Sapphire light/dark token values inlined — edit any value to customize

**Or write it by hand** (see `demos/demo/src/InstallationPage.tsx` for full token list).

Import the generated file in the app entry point:

```tsx
import './index.css'
```

## Step 3: ThemeProvider

Wrap the app root:

```tsx
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

## Step 4: Optional — I18nProvider

```tsx
import { I18nProvider } from '@sap-ui/fx-components'

<ThemeProvider ...>
  <I18nProvider locale="en-US" dir="ltr">
    <App />
  </I18nProvider>
</ThemeProvider>
```

## Step 5: Optional — SAP 72 Font

The Sapphire theme uses the SAP 72 font family. Components fall back to the system font stack if not installed.

- The `init` CLI creates `public/fonts/72.css` automatically
- Copy `.woff2` font files into `public/fonts/`
- Add `@import url('/fonts/72.css')` to the CSS entry file (uncomment the generated line)

## Smoke Test

```tsx
import { Button } from '@sap-ui/fx-components'

function App() {
  return <Button design="Primary">It works!</Button>
}
```

## Exports

| Import | What it provides |
|---|---|
| `@sap-ui/fx-components` | All components, ThemeProvider, I18nProvider, types |
| `@sap-ui/fx-components/styles.css` | Pre-built CSS bundle (Quick Setup) |
| `@sap-ui/fx-components/theme.css` | Tailwind @theme mappings only (Custom Setup) |
| `@sap-ui/fx-components/components.css` | Component CSS only (Custom Setup) |
| `@sap-ui/fx-components/tokens.css` | Raw token values (advanced) |
| `@sap-ui/fx-components/icons` | Icon components |
| `@sap-ui/fx-components/illustrations` | Illustration components |

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| No styles at all | Missing CSS import | Add `styles.css` (quick) or run `init` (tailwind) |
| Components unstyled but Tailwind works | Missing `components.css` | Add `@import "@sap-ui/fx-components/components.css"` |
| Dark mode not working | Missing custom variant | Add `@custom-variant dark (&:is(.dark *, .theme-dark *))` |
| Tailwind classes not applying | Missing `theme.css` | Add `@import "@sap-ui/fx-components/theme.css"` |
| Wrong font | 72 font not loaded | Copy `.woff2` files and import `72.css` |
