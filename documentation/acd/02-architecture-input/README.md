# 2 — Architecture Input

## 2.1 Introduction

`@sap-ui/fx-components` is a React 19 component library that implements SAP Sapphire design patterns using Tailwind CSS 4 and the Sapphire design language. Part of the *Joule Work FX UI Components* product line, the library provides re-usable UI components for the Engagement Layer (Joule Work), implementing Future-of-UX concepts including the compositional design system. It serves as a modern, lightweight alternative to UI5 Web Components for teams building React-based enterprise applications.

The library provides 38+ components — from basic elements (Button, Badge, Input) through composite patterns (Calendar, DatePicker, ComboBox) to the multi-pane responsive layout system (FxLayout). It integrates SAP's Sapphire design tokens, supports 30+ locales including RTL languages, and targets WCAG 2.1 Level AA accessibility.

This section captures the influence factors that shape the architecture.

## 2.2 Business Goals

| ID | Goal | Rationale |
|---|---|---|
| BG-1 | Provide React-native Sapphire components | Enable teams already using React to adopt SAP Sapphire patterns without framework bridging or Web Component interop overhead |
| BG-2 | Achieve 10–17x smaller bundles than UI5 Web Components | Improve page load performance — measured savings of 92–366 ms depending on connection speed; total bundle for Calendar + ComboBox + Select drops from ~296 KB to ~22 KB gzipped (92.6% reduction) |
| BG-3 | Deliver enterprise-grade accessibility | Meet WCAG 2.1 Level AA across all components to satisfy SAP product standard requirements and enterprise procurement criteria |
| BG-4 | Support globalization out of the box | Provide 30+ locales with automatic RTL layout, locale-specific week start days, and localized month/weekday names |
| BG-5 | Offer an AI-ready component API | Design self-documenting, composable, predictable APIs that generative UI tools can consume effectively |

## 2.3 Requirements

### 2.3.1 Functional Requirements

| ID | Requirement | Status |
|---|---|---|
| FR-1 | 38+ UI components covering forms, navigation, layout, feedback, and data display | Implemented |
| FR-2 | FxLayout multi-pane responsive layout with breakpoint-driven pane visibility | Implemented |
| FR-3 | Theming via Sapphire design tokens with runtime theme switching | Implemented |
| FR-4 | Internationalization: UI strings for 13 languages via i18next and date formatting for 30+ locales via date-fns | Implemented |
| FR-5 | RTL layout support for Arabic, Hebrew, and other RTL locales | Implemented |
| FR-6 | 500+ auto-generated icon components | Implemented |
| FR-7 | Virtualized table rendering for large data sets via @tanstack/react-virtual | Implemented |
| FR-8 | Tree-shakeable sub-path imports for calendar, combobox, select, input, icons, and illustrations | Implemented |
| FR-9 | CLI init script (`npx @sap-ui/fx-components`) for consumer project setup | Implemented |
| FR-10 | Controlled and uncontrolled component patterns for all interactive components | Implemented |

### 2.3.2 Non-Functional Requirements

| ID | Requirement | Target |
|---|---|---|
| NFR-1 | Bundle size per component | < 10 KB gzipped for individual components |
| NFR-2 | Time to interactive | < 100 ms overhead on 4G connections |
| NFR-3 | Type safety | Full TypeScript coverage with exported type definitions |
| NFR-4 | Browser support | All modern evergreen browsers (Chrome, Firefox, Safari, Edge) |
| NFR-5 | React compatibility | React 19+ (peer dependency) |
| NFR-6 | Build output formats | ESM and CJS dual output with declaration files |

## 2.4 Qualities

### 2.4.1 Product-Specific Qualities

**QAS-1: Bundle Size Performance**

| Dimension | Value |
|---|---|
| Interactor | Application bundler (webpack, Vite, esbuild) |
| Executor | @sap-ui/fx-components package |
| Interaction | Tree-shaking at build time |
| Conditions | Consumer imports a single component (e.g., Calendar) |
| Result | Only the imported component and its direct dependencies are included in the output bundle |
| KPI | Individual component < 10 KB gzipped; total library < 50 KB gzipped for typical usage |

**QAS-2: Accessibility Compliance**

| Dimension | Value |
|---|---|
| Interactor | Screen reader user navigating with keyboard |
| Executor | Calendar component |
| Interaction | Keyboard navigation and ARIA announcements |
| Conditions | User presses arrow keys, Enter, Escape, PageUp/PageDown |
| Result | Focus moves predictably; dates are announced with full context (day, date, special markers); selection state is communicated |
| KPI | WCAG 2.1 Level AA — all ARIA roles, keyboard shortcuts, and focus management match UI5 Web Components parity |

**QAS-3: Internationalization Correctness**

| Dimension | Value |
|---|---|
| Interactor | Application code setting locale |
| Executor | i18next fx namespace, JSON locale bundles, and date-fns locale loader |
| Interaction | Locale change at runtime |
| Conditions | Application switches from en-US to ar-SA |
| Result | Month/weekday names update to Arabic; layout flips to RTL; week starts on Saturday |
| KPI | Correct locale behavior for all 30+ supported locales |

### 2.4.2 Product Standards

| Standard | Relevance | Notes |
|---|---|---|
| Accessibility | **Applicable** | WCAG 2.1 Level AA; full ARIA, keyboard navigation, screen reader support, high contrast, reduced motion |
| Globalization | **Applicable** | 30+ locales, RTL, locale-specific formatting |
| Security | **Applicable** | XSS protection via React JSX escaping; SAST scanning in CI pipeline |
| Software Lifecycle | **Applicable** | Semantic versioning; NPM distribution; CI/CD via GitHub Actions |
| UX Consistency | **Applicable** | Follows SAP Sapphire design guidelines and Sapphire design language |
| Performance | **Applicable** | Tree-shaking, virtualization, lazy loading patterns |
| Business Configuration | Not applicable | Library does not provide configuration UI |
| Cloud Delivery Excellence | Not applicable | Library is consumed as an NPM dependency, not deployed as a service |
| Integration | Not applicable | No direct system-to-system integration; consumed via JavaScript imports |
| Operations & Support | Not applicable | No runtime operations; library runs client-side only |

### 2.4.3 Quality Cross Topics

| Topic | Approach |
|---|---|
| Scalability | Tree-shakeable sub-path imports ensure bundle size scales with usage, not library size; virtualized rendering for large data sets |
| Authentication / Authorization | Not applicable — UI component library with no backend or data access |
| Translation | 13 languages via i18next JSON locale files (131 keys each); date-fns for locale-aware date formatting (2–5 KB per locale); future: calendar type support (Japanese Era, Islamic, Buddhist) |
| User Documentation | Demo applications (component showcase + FxLayout demo) deployed to GitHub Pages; API registry generation |
| Deployment | NPM registry via Piper pipeline; GitHub Pages for demos; optional CF deployment for SAP BTP |
| Availability | Client-side library — availability depends on the consuming application |
| Monitoring & Operations | Not applicable — no server-side runtime |

## 2.5 Existing Technology

The library builds upon and replaces aspects of the following existing technology:

| Technology | Relationship | Notes |
|---|---|---|
| UI5 Web Components | Predecessor | Feature-parity target; fx-components provides equivalent functionality with 10–17x smaller bundles by using native React rendering instead of a custom element engine |
| SAP Fiori Design System | Design authority | Component behavior, visual design, and interaction patterns follow SAP Sapphire guidelines |
| Sapphire Design Language | Token source | CSS custom properties (design tokens) sourced from SAP's Sapphire visual language |
| shadcn/ui | Pattern reference | Component composition patterns, CVA variant approach, and `cn()` utility adopted from shadcn/ui conventions |
| date-fns | Locale engine | Provides tree-shakeable locale data for date formatting (month/weekday names, week start days) |
| i18next + react-i18next | Translation engine | UI string translation, namespace-based resource loading, runtime language switching; singleton architecture enables shell integration |

## 2.6 Boundary Conditions

| Condition | Impact |
|---|---|
| React 19 peer dependency | Consumers must use React 19+; limits adoption in projects on earlier React versions |
| Tailwind CSS 4 peer dependency (optional) | Consumers using Tailwind get native integration; those without Tailwind use pre-built CSS output |
| i18next / react-i18next peer dependencies | Consumers must provide i18next >=23 and react-i18next >=14; required for components using translated strings; shell environments share the singleton instance |
| No legacy browser support | No IE11 or pre-Chromium Edge; reduces bundle size and complexity |
| License  | [SAP Developer License Agreement](https://tools.hana.ondemand.com/developer-license.txt) |
| Node.js 22 for build tooling | CI/CD and local development require Node.js 22 |

## 2.7 Scope and Assumptions

### In Scope

- React component library (38+ components) with TypeScript types
- Sapphire design token integration and ThemeProvider
- Internationalization via i18next (fx namespace) with JSON locale bundles and date-fns
- FxLayout responsive multi-pane layout system
- Icon and illustration component sets
- CLI init script for consumer project bootstrapping
- Demo applications for documentation and testing
- CI/CD pipeline for build validation and GitHub Pages deployment

### Out of Scope

- Application-level business logic
- Server-side rendering (SSR) optimization
- Backend services or APIs
- Data fetching or state management
- Native mobile rendering
- Visual regression test infrastructure (planned for future; unit tests are in scope and implemented — see section 4.8.2)

### Assumptions

- Consumers use a modern JavaScript bundler that supports tree-shaking (Vite, webpack 5+, esbuild)
- Consumers have React 19 in their dependency tree
- The SAP Sapphire design guidelines remain the authoritative source for component behavior
- The Sapphire design token specification is stable for the v0.x release cycle

## 2.8 Architecture Drivers

The following factors have the highest influence on architecture decisions, ordered by priority:

| Priority | Driver | Influence |
|---|---|---|
| 1 | **Bundle size** | Drives the choice of Tailwind CSS over CSS-in-JS, tree-shakeable sub-path exports, and the use of tsup/esbuild over heavier bundlers |
| 2 | **Developer experience** | Drives TypeScript-first design, CVA variant patterns, controlled/uncontrolled dual support, and comprehensive type exports |
| 3 | **Enterprise accessibility** | Drives ARIA implementation depth, keyboard navigation parity with UI5, and screen reader announcement patterns |
| 4 | **Sapphire design compliance** | Drives the Sapphire token system, ThemeProvider architecture, and component behavior specifications |
| 5 | **Globalization** | Drives the i18next namespace pattern, date-fns date formatting, shell-compatible translation loading, and RTL-aware CSS architecture |
| 6 | **AI readiness** | Drives self-documenting prop APIs, composable component patterns, and predictable event payloads |
