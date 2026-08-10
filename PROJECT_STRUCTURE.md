# Project Structure

This document explains the repository layout, build system, and development workflow for the FX Components library.

## Overview

FX Components is a React component library implementing SAP Fiori design patterns with Tailwind CSS. The repository contains:

- **The library** (`src/`) — publishable as `@sap-ui/fx-components` on npm
- **Demo apps** (`demos/`) — Vite-based apps that showcase and test the components

## Directory Layout

```
fx-components/
├── src/                         # Library source code
│   ├── components/              # React components (one folder per component)
│   │   ├── avatar/
│   │   ├── badge/
│   │   ├── button/
│   │   ├── calendar/
│   │   ├── card/
│   │   ├── checkbox/
│   │   ├── combobox/
│   │   ├── datepicker/
│   │   ├── dialog/
│   │   ├── fx/                  # FxLayout system (layout, pane header, side nav, etc.)
│   │   ├── icon/
│   │   ├── illustrated-message/
│   │   ├── input/
│   │   ├── list/
│   │   ├── menu/
│   │   ├── select/
│   │   ├── table/
│   │   ├── tabs/
│   │   └── ...                  # (30+ component directories)
│   ├── types/                   # TypeScript type definitions for each component
│   ├── hooks/                   # Shared React hooks
│   ├── icons/                   # Icon components
│   ├── illustrations/           # Illustration components (fiori, tnt)
│   ├── i18n/                    # Internationalization utilities
│   ├── lib/                     # Shared utilities (cn, date-utils, etc.)
│   ├── theme/                   # Theme provider and definitions
│   └── index.ts                 # Main barrel export
│
├── demos/
│   ├── demo/                    # Component showcase — one page per component
│   │   ├── src/
│   │   │   ├── App.tsx          # Router with navigation to all component pages
│   │   │   ├── ButtonPage.tsx   # Example: Button demo page
│   │   │   └── ...
│   │   ├── vite.config.ts
│   │   ├── tailwind.config.js
│   │   └── package.json
│   │
│   └── el-demo/                 # FxLayout demo — main demo app
│       ├── src/
│       │   ├── App.tsx          # Full FxLayout app with nav, panes, chat
│       │   └── components/      # Demo-specific components
│       ├── vite.config.ts
│       ├── tailwind.config.js
│       └── package.json
│
├── illustrations/               # Raw illustration SVG source files
├── illustrations-v5/            # V5 illustration assets
├── generate-illustrations.cjs   # Script to generate illustration components
│
├── scripts/
│   └── generate-api-registry.mjs  # Generates API docs from type definitions
│
├── docs/                        # Design docs, specs, and guides
├── deploy/                      # Cloud Foundry deployment config
│
├── package.json                 # Library package (@sap-ui/fx-components)
├── tsup.config.ts               # Library build configuration (tsup)
├── tsconfig.json                # Library TypeScript configuration
├── .github/workflows/           # CI and deploy pipelines
└── CLAUDE.md                    # AI assistant instructions
```

## Library (`src/`)

### Component Organization

Each component lives in its own directory under `src/components/`:

```
src/components/button/
├── Button.tsx          # Main component implementation
├── index.ts            # Barrel export
└── button-variants.ts  # (optional) CVA variant definitions

src/types/button.ts     # Props interface, enums, ref types
```

### Entry Points

The library has multiple entry points defined in `tsup.config.ts`:

| Import path | Entry file | Purpose |
|---|---|---|
| `@sap-ui/fx-components` | `src/index.ts` | Main export — all components |
| `@sap-ui/fx-components/calendar` | `src/components/calendar/index.ts` | Tree-shakeable calendar |
| `@sap-ui/fx-components/combobox` | `src/components/combobox/index.ts` | Tree-shakeable combobox |
| `@sap-ui/fx-components/select` | `src/components/select/index.ts` | Tree-shakeable select |
| `@sap-ui/fx-components/input` | `src/components/input/index.ts` | Tree-shakeable input |
| `@sap-ui/fx-components/illustrations` | `src/illustrations/index.ts` | All illustrations |
| `@sap-ui/fx-components/illustrations/fiori` | `src/illustrations/fiori/index.ts` | Fiori illustrations |
| `@sap-ui/fx-components/illustrations/tnt` | `src/illustrations/tnt/index.ts` | TNT illustrations |

### Types Convention

Each component's types are defined separately in `src/types/<component>.ts`. This keeps component files focused on implementation and enables the API registry generator to parse props without importing React.

## Demos (`demos/`)

Demo apps import the library **directly from source** during development using a Vite alias:

```ts
// In demos/*/vite.config.ts
resolve: {
  alias: {
    '@sap-ui/fx-components': path.resolve(__dirname, '../../src/index.ts'),
  },
},
```

This provides:
- Hot module replacement (HMR) — edit a component, see changes instantly
- No need to rebuild the library during development
- TypeScript path mapping in `tsconfig.json` mirrors the Vite alias

Demo apps have their own `package.json` with their own dependencies (Vite, React, Tailwind). They do **not** depend on `@sap-ui/fx-components` as an npm package.

## Build System

### Library Build (tsup)

```bash
npm run build      # Build once
npm run dev        # Watch mode
```

- **Bundler:** tsup (esbuild-based)
- **Output formats:** ESM (`.js`) + CJS (`.cjs`)
- **Type declarations:** Auto-generated `.d.ts` files
- **Output directory:** `dist/`
- **External:** `react`, `react-dom` (peer dependencies)

### Demo Build (Vite)

```bash
npm run dev:demo      # Start component showcase dev server
npm run dev:el-demo   # Start FxLayout demo dev server
npm run build:demo    # Production build
npm run build:el-demo # Production build
```

### All npm Scripts

| Script | Description |
|---|---|
| `npm run build` | Build the component library |
| `npm run dev` | Watch mode for library |
| `npm run type-check` | Run TypeScript compiler (no emit) |
| `npm run lint` | Lint library source |
| `npm run dev:demo` | Start component showcase dev server |
| `npm run dev:el-demo` | Start FxLayout demo dev server |
| `npm run build:demo` | Build component showcase |
| `npm run build:el-demo` | Build FxLayout demo |
| `npm run build:all` | Build library + both demos |
| `npm run generate:api-registry` | Generate API docs from types |

## Adding a New Component

1. **Create the component directory:**
   ```
   src/components/my-component/
   ├── MyComponent.tsx
   └── index.ts
   ```

2. **Create the types file:**
   ```
   src/types/my-component.ts
   ```
   Define `MyComponentProps` interface with JSDoc comments for each prop.

3. **Add exports to `src/index.ts`:**
   ```ts
   export * from "./components/my-component";
   export * from "./types/my-component";
   ```

4. **(Optional) Add a sub-entry point** in `tsup.config.ts` if the component should be independently importable:
   ```ts
   entry: {
     // ...existing entries
     "components/my-component/index": "src/components/my-component/index.ts",
   },
   ```
   And add the corresponding `exports` entry in `package.json`.

5. **Add a demo page** in `demos/demo/src/MyComponentPage.tsx` and register it in `App.tsx`.

## CI/CD

### CI (`ci.yaml`)
Runs on pull requests to `main`:
- Installs dependencies (root + demos)
- Runs `type-check`, `generate:api-registry`, `build`, and builds both demos

### Deploy (`deploy.yaml`)
Runs on push to `main`:
- Same build steps as CI
- Combines demo outputs into `dist-combined/`
- Deploys to GitHub Pages via `gh-pages` branch

## Design Tokens

The library uses **sapphire design tokens** via Tailwind CSS. Always prefer `sapphire-*` prefixed classes over generic Tailwind defaults. See the token mapping table in `CLAUDE.md` for the full reference.

CSS variables (`--sapphire-*`, `--text-primary`, `--border-primary`, etc.) are defined in each demo's `index.css` and support light/dark theme switching.
