# Architecture Concept Document — @sap-ui/fx-components

## Executive Summary

`@sap-ui/fx-components` (v0.1.7) — *Joule Work FX UI Components 1.0* — provides re-usable UI components for the Engagement Layer (Joule Work), implementing the Future-of-UX concepts including the compositional design system. Built on React 19, Tailwind CSS 4, and the SAP Sapphire design language, the library delivers 38+ components — from basic UI elements (Button, Input, Badge) through composite patterns (Calendar, DatePicker, ComboBox, Table) to a responsive multi-pane layout system (FxLayout) — as a modern, lightweight alternative to UI5 Web Components.

The library achieves 10–17x smaller gzipped bundles compared to UI5 Web Components by using native React rendering, Tailwind CSS utility classes, and tree-shakeable sub-path exports. A four-layer theming architecture (Sapphire tokens → shadcn mapping → Tailwind @theme → CVA component classes) enables runtime theme switching without component-level changes. Enterprise requirements are addressed through WCAG 2.1 Level AA accessibility, 30+ locales with RTL support, and static security analysis in the CI pipeline.

The primary outstanding items are visual regression testing and automated accessibility verification — unit tests are established with 40 test files (~30K lines) covering 39 of 40 components, integrated into the CI pipeline with coverage reporting.

---

**ACD Template Version:** V2508 v4.4

## Table of Contents

1. [Project Information and Document Status](./01-project/README.md)
   - Stakeholders, business context, content status
2. [Architecture Input](./02-architecture-input/README.md)
   - Business goals, requirements, qualities, scope, drivers
3. [Architecture Overview](./03-architecture-overview/README.md)
   - Architecture description with TAM diagrams
4. [Architecture Decisions](./04-architecture-decisions/README.md)
   - Technology decisions, risks, reuse, security, deployment, testing
5. [Summary](./05-summary/README.md)
   - Major findings, recommendations, and license

**Reference:**
- [Glossary](./GLOSSARY.md) — Terms and abbreviations

## Document Revision History

| Version | Status | Date       | Author(s)      | Remarks                                                          |
|---------|---|------------|----------------|------------------------------------------------------------------|
| 0.1     | Draft | 2026-03-30 | Biser Miloshev | Initial ACD creation covering v0.1.15 architecture               |
| 0.2     | Draft | 2026-04-01 | Biser Miloshev | Architecture Overview enhancements covering v0.1.16 architecture |
| 0.3     | Draft | 2026-04-23 | Biser Miloshev | i18n architecture update: I18nProvider → i18next + react-i18next (PR #481) |
