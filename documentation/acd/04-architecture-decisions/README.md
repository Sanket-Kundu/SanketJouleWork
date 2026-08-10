# 4 — Architecture Decisions

## 4.1 Technology Decisions

| Area | Decision | Alternatives Considered | Rationale |
|---|---|---|---|
| UI Framework | React 19 | Vue, Svelte, Web Components | React is the dominant framework in SAP's React-based application landscape; React 19 provides concurrent rendering and improved hook performance |
| Styling | Tailwind CSS 4 + CVA | CSS Modules, styled-components, Emotion | Utility-first CSS eliminates runtime style injection; Tailwind 4's `@theme` directive maps directly to CSS custom properties; CVA provides type-safe variant management; 10–17x smaller bundles than UI5 Web Components |
| Build Tool | tsup (esbuild) | Rollup, webpack, tsc | tsup provides zero-config TypeScript bundling with esbuild speed; native ESM + CJS dual output; automatic `.d.ts` generation |
| Dev Server | Vite | webpack-dev-server, Parcel | Fast HMR, native ESM dev server, zero-config TypeScript support; used for demo applications |
| Virtualization | @tanstack/react-virtual | react-window, react-virtuoso | Headless (no DOM opinions), small footprint, active maintenance, works with any container element |
| Date Handling | date-fns | Luxon, Day.js, Moment.js | Tree-shakeable by design; each locale is a separate module (2–5 KB); no global mutation |
| NLP Date Parsing | chrono-node | Sugar.js, custom regex | Production-grade natural language date parsing; supports multiple locales |
| Icon Generation | Auto-generated React components | Icon fonts, SVG sprites, manual components | Each icon is a standalone tree-shakeable component; no runtime SVG loading; 500+ icons |
| Type Separation | Separate `src/types/` directory | Co-located types, `.d.ts` files | Consumers can import types without pulling in component code; cleaner dependency graph |
| Module Formats | ESM + CJS dual output | ESM-only, CJS-only | ESM for modern bundlers (tree-shaking); CJS for Node.js and legacy tool compatibility |
| Class Merging | clsx + tailwind-merge (`cn()`) | classnames, template literals | `clsx` handles conditional logic; `tailwind-merge` resolves Tailwind class conflicts (e.g., `p-2` vs `p-4`) |
| UI String Translation | i18next + react-i18next | Custom React Context, Format.js, Lingui | Industry-standard i18n library; singleton architecture enables shell integration (shared instance); namespace isolation (fx) prevents key collisions; built-in interpolation; 13 JSON locale files replace hardcoded string exports |
| Testing | Vitest + React Testing Library | Jest + RTL, Cypress Component Testing | Vitest shares Vite's transform pipeline (zero extra config); native ESM support matches the library's module format; RTL enforces accessible query patterns; V8 coverage provider avoids Istanbul instrumentation overhead |

## 4.2 Major Architecture Decisions

| Decision | Description | Rationale |
|---|---|---|
| Layered token architecture | Four-layer theme flow: Sapphire tokens → shadcn mapping → Tailwind @theme → component classes | Decouples SAP design tokens from component code; enables theme switching without component changes; maintains shadcn ecosystem compatibility |
| Provider + singleton configuration | ThemeProvider as React context provider; i18next as global singleton (fx namespace) | ThemeProvider uses standard React context pattern for theming; i18next uses a singleton to enable shared instances with the Engagement Layer shell — the shell owns the i18next instance and fx-components registers its namespace, enabling automatic language propagation without a wrapper component |
| Multi-entry sub-path exports | Eight separate entry points in `package.json` exports | Enables fine-grained tree-shaking; consumers importing only Calendar avoid pulling in Table, Icons, etc. |
| Priority-based overflow | FxPaneHeader actions have overflow priorities (alwaysOverflow, low, medium, high) | Matches UI5 Web Components behavior; ensures the most important actions remain visible as viewport shrinks |
| Controlled + uncontrolled dual mode | All interactive components support both patterns | Reduces consumer boilerplate; uncontrolled mode works out-of-box; controlled mode enables form libraries and complex state management |
| CSS-only custom theming | Consumer-defined themes via CSS variable overrides in a `.theme-{id}` class; no JavaScript, no Tailwind config changes required | Themes need only ~19 core CSS variables; sapphire-* extension tokens auto-derive from core tokens via the fallback system; enables the demo's 19 themes and any shadcn community theme as drop-in replacements |

## 4.3 Risks

| ID | Risk | Impact | Probability | Mitigation | Responsible | Due |
|---|---|---|---|---|---|---|
| R-1 | React 19 peer dependency limits adoption | High | Low | React 19 is stable and widely adopted; document minimum requirements clearly; consider relaxing to `^18.0.0 \|\| ^19.0.0` if demand arises | Development Team | v1.0 |
| R-2 | Icon bundle size when tree-shaking is not available | High | Low | Provide sub-path import (`/icons`) so consumers can avoid loading icons from the main entry; document tree-shaking requirements | Development Team | Ongoing |
| R-3 | Incomplete test automation coverage | Medium | Medium | Unit tests established (40 files, CI-integrated coverage); remaining gaps are visual regression testing and automated a11y verification | Development Team | v1.0 |
| R-4 | Large component files (FxLayout, FxPaneHeader) | Low | High | Functional but harder to maintain; plan extraction of sub-components and custom hooks to reduce file size | Development Team | v1.0 |

## 4.4 Use / Reuse of Existing Components

### 4.4.1 SAP-Internal Components and Services

| Component | Relationship | Mandatory | Notes |
|---|---|---|---|
| SAP Fiori Design Guidelines | Design authority | Yes | Component behavior, visual design, and interaction patterns follow SAP Sapphire specifications |
| Sapphire Design Tokens | Token source | Yes | CSS custom properties sourced from SAP's Sapphire visual language |
| UI5 Web Components | Feature-parity reference | No | Used as reference for expected component behavior; not a runtime dependency |

### 4.4.2 External Components (Open Source)

| Component | License | Mandatory | Purpose | Alternatives | Risks |
|---|---|---|---|---|---|
| React 19 | MIT | Yes (peer) | UI rendering framework | n/a | Major version lock; mitigated by widespread React 19 adoption |
| Tailwind CSS 4 | MIT | No (optional peer) | Utility-first CSS generation | Pre-built CSS fallback provided | Tailwind 4 is newer; mitigated by optional peer dependency |
| @tanstack/react-virtual | MIT | Yes | Virtualized list/table rendering | react-window | Active maintenance; headless design reduces coupling |
| date-fns | MIT | Yes | Date formatting and locale data | Day.js, Luxon | Large locale set is tree-shakeable; no global state mutation |
| chrono-node | MIT | Yes | Natural language date parsing | Custom regex | Mature library; well-tested NLP patterns |
| class-variance-authority | Apache-2.0 | Yes | Type-safe CSS variant management | Manual variant logic | Small footprint; actively maintained |
| clsx | MIT | Yes | Conditional class joining | classnames | Smaller than classnames; no runtime overhead |
| tailwind-merge | MIT | Yes | Tailwind class conflict resolution | Manual deduplication | Necessary when component classes are overridden by consumers |
| i18next | MIT | Yes (peer) | UI string translation and locale management | Format.js, Lingui | Industry-standard; singleton enables shell integration; namespace isolation |
| react-i18next | MIT | Yes (peer) | React bindings for i18next (useTranslation hook) | Custom context hook | Standard companion to i18next; automatic re-render on language change |
| lucide-react | ISC | Yes | Icon component generation | Custom SVG components | 500+ icons; consistent API; tree-shakeable |

### 4.4.3 External Services

Not applicable. `@sap-ui/fx-components` is a client-side UI component library with no runtime dependencies on external services. It makes no HTTP, WebSocket, or fetch calls. All data is provided by the consuming application via React props.

## 4.5 Integration Concept

### 4.5.1 NPM Consumption

Consumers install the library as an NPM dependency:

```bash
npm install @sap-ui/fx-components
# or use the CLI init script:
npx @sap-ui/fx-components
```

The CLI init script bootstraps the consumer project with the required CSS imports, ThemeProvider configuration, and i18next initialization via `initFxI18n()`.

### 4.5.2 Initialization and Provider Wrapping

Consumers initialize i18next and wrap their application root with the library's theme provider:

```tsx
import { initFxI18n } from '@sap-ui/fx-components';

// Initialize i18n before React renders
await initFxI18n("en");
```

```tsx
<ThemeProvider defaultTheme="light">
  <App />
</ThemeProvider>
```

For Engagement Layer shell integration, the app provides translations via the AppAPI contract:

```tsx
import { loadFxTranslations } from '@sap-ui/fx-components';

// In AppAPI implementation:
async loadTranslations(lang) { return loadFxTranslations(lang); }
getAppConfig() { return { i18nNamespace: "fx", ... }; }
```

### 4.5.3 Tree-Shakeable Imports

The library supports both barrel imports and sub-path imports:

```tsx
// Barrel import (all components available; bundler tree-shakes unused)
import { Button, Calendar, Table } from '@sap-ui/fx-components';

// Sub-path import (only calendar code is in scope)
import { Calendar } from '@sap-ui/fx-components/calendar';
```

### 4.5.4 CSS Integration

Three CSS files must be imported by the consumer:

```tsx
import '@sap-ui/fx-components/tokens.css';   // Sapphire design tokens
import '@sap-ui/fx-components/theme.css';     // Theme class definitions
import '@sap-ui/fx-components/styles.css';    // Tailwind utility classes
```

Consumers using Tailwind CSS 4 can alternatively reference `tokens.css` in their own Tailwind configuration for native integration.

### 4.5.5 Offered Public APIs

The library exposes its public API through React component props, context hooks, and TypeScript type exports. The full API surface is documented in the generated API registry (`api-registry.json`, produced during CI).

**Summary of API categories:**

| Category | Examples | Mechanism |
|---|---|---|
| Component props | `Button: design, icon, disabled, onClick` | Standard React props with TypeScript interfaces |
| Context hooks | `useTheme()`, `useFxLayout()` | React context consumers |
| i18n API | `initFxI18n()`, `loadFxTranslations()`, `useTranslation("fx")`, `useDirection()` | Module exports + react-i18next hook |
| Enum types | `ButtonDesign`, `InputType`, `PopoverPlacement` | Exported TypeScript enums |
| Event payloads | `onSelectionChange(event)`, `onDateChange(date)` | Callback props with typed arguments |
| Layout system | `FxLayout: items, maxPanes, breakpoints` | Declarative prop-driven configuration |

The library exposes one global singleton — the i18next instance (fx namespace) — initialized via `initFxI18n()`. This is a deliberate architectural choice to enable shared instances with the Engagement Layer shell. All other interaction is through React's declarative component model.

## 4.6 Security Concept

### 4.6.1 Secure Design

`@sap-ui/fx-components` is a client-side UI component library. It does not process, store, or transmit data independently — all data handling is the responsibility of the consuming application.

**XSS Protection:**
- React's JSX rendering escapes all dynamic content by default, preventing script injection through component props.
- The library does not use `dangerouslySetInnerHTML` in any component.
- User-provided content (e.g., ComboBox items, Table cell content) is rendered through JSX, not raw HTML insertion.

**Static Analysis:**
- SAST scanning is performed in the CI pipeline via Checkmarx and BlackDuck.
- The GitHub repository has secret scanning enabled to prevent accidental credential commits.

**Dependency Security:**
- All dependencies are open-source with permissive licenses (MIT, Apache-2.0, ISC).
- Dependency vulnerabilities are monitored via `npm audit` and GitHub Dependabot.

### 4.6.2 Data Privacy Protection

The library does not collect, store, or process personal data. It renders UI based on props provided by the consuming application. Data privacy compliance is the responsibility of the consuming application.

## 4.7 Deployment, Migration, and Operations

### 4.7.1 Deployment Structure

The library is deployed through three channels:

1. **NPM Registry** — The component library itself is published as `@sap-ui/fx-components` via Piper pipeline to the SAP NPM registry.
2. **GitHub Pages** — Demo applications are deployed to GitHub Pages for documentation and testing. The component showcase is served at the root path; the FxLayout demo is served at `/fx-layout/`.
3. **Cloud Foundry (optional)** — A CF manifest (`deploy/manifest.yml`) is provided for deploying the demo to SAP BTP using the `staticfile_buildpack` (64 MB memory, static file serving).

### 4.7.2 System Landscape

Not applicable. The library is a client-side NPM package with no server infrastructure, databases, message queues, or service mesh. It runs entirely within the consuming application's browser runtime. There is no system landscape to depict beyond the build-time NPM registry dependency documented in section 3.8 (Security Context Diagram).

### 4.7.3 CI/CD Pipeline

The CI/CD pipeline is implemented as two GitHub Actions workflows on self-hosted runners (Node.js 22):

**CI workflow** (pull requests to `main`):
1. Checkout and install dependencies
2. TypeScript type-check
3. Generate API registry
4. Build library
5. Build component showcase demo
6. Build FxLayout demo
7. Run unit tests with coverage (`vitest run --coverage`)

**Deploy workflow** (push to `main`):
1. All CI steps
2. Combine demo outputs into `dist-combined/`
3. Deploy to GitHub Pages via `JamesIves/github-pages-deploy-action@v4.7.6`

### 4.7.4 Migration

The library is in its initial release cycle (v0.x). No migration from previous versions is required. Consumers migrating from UI5 Web Components should follow the conversion guide (`docs/UI5_TO_SHADCN_CONVERSION_GUIDE.md`) for API mapping between UI5 properties/events/slots and React props/callbacks/children.

### 4.7.5 Operations

As a client-side library consumed via NPM, there are no server-side operations to manage. The library has no runtime monitoring, health check, or metering requirements. Updates are distributed through NPM version bumps.

## 4.8 Building and Testing

### 4.8.1 Build Process

The library build consists of four steps (run via `npm run build`):

1. **tsup** — Bundles TypeScript source into ESM (`.js`) and CJS (`.cjs`) with auto-generated `.d.ts` declarations. React, react-dom, i18next, and react-i18next are externalized as peer dependencies.
2. **tailwindcss** — Compiles `src/theme/styles-input.css` into minified `dist/styles.css`.
3. **theme copy** — Copies `src/theme/sapphire-theme.css` to `dist/theme.css`.
4. **tokens copy** — Copies `src/theme/tokens.css` to `dist/tokens.css`.

### 4.8.2 Test Strategy

**Unit tests (implemented):**

| Aspect | Detail |
|---|---|
| Framework | Vitest 4.1.2 with jsdom environment |
| Component testing | @testing-library/react 16.3.2, @testing-library/user-event 14.6.1 |
| Assertions | @testing-library/jest-dom 6.9.1 |
| Coverage | @vitest/coverage-v8 with V8 provider; HTML + LCOV reporters |
| CI integration | `npm test -- --coverage` runs on every pull request via GitHub Actions |

The test suite contains 40 test files (~30,000 lines) covering 39 of 40 components (Tabs is the only component without a dedicated test file). Tests exercise:

- Rendering and prop variations
- User interaction events (click, keyboard, hover)
- Accessibility attributes (ARIA roles, labels, live regions)
- Ref forwarding and imperative handles
- Portal-based components (Popover, Dialog, Menu)
- Keyboard navigation (arrow keys, Tab, Escape, Enter)
- Controlled and uncontrolled component patterns
- Fake timers for debounced and animated behavior
- Parameterized tests (`describe.each`) for variant coverage

**Test scripts:**

| Script | Command | Description |
|---|---|---|
| Run once | `npm test` | Single run, all tests |
| Watch mode | `npm run test:watch` | Re-runs on file save |
| Coverage report | `npm run test:coverage` | Generates HTML + LCOV coverage reports |

**Demo applications (manual testing):**
- **Component showcase** (`demos/demo/`) — Renders all components with interactive controls for visual verification.
- **FxLayout demo** (`demos/el-demo/`) — Exercises the multi-pane layout system with navigation, pane toggling, and resize behavior.

**Planned (pre-v1.0):**
- **Visual regression tests** — Chromatic or Percy for pixel-level change detection.
- **Accessibility tests** — axe-core integration for automated WCAG compliance verification.
- **Type tests** — `tsd` for verifying exported type definitions match expected consumer usage.
- **Tabs component test** — Dedicated test file for the Tabs component.

## 4.9 Technical Debts

| ID | Debt | When Introduced | Consequence | Resolution Plan | Target |
|---|---|---|---|---|---|
| TD-1 | No visual regression or automated a11y tests | v0.1.0 | Unit tests catch behavioral regressions but pixel-level regressions and WCAG violations are not detected automatically | Add visual regression via Chromatic or Percy; integrate axe-core for automated a11y checks; add Tabs component test | v1.0 |
| TD-2 | Large FxLayout and FxPaneHeader files | v0.1.0 | Files exceed 1000 lines; harder to review, maintain, and extend | Extract sub-components (PaneManager, OverflowCalculator, ResizeObserver logic) into separate files; extract custom hooks | v1.0 |
| TD-3 | Limited calendar type coverage | v0.1.0 | Only Gregorian calendar is supported; Japanese Era, Islamic, Buddhist, and Persian calendars are not available | Implement additional calendar type adapters using date-fns extensions or custom logic | Post-v1.0 |
