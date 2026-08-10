# 1 — Project Information and Document Status

## 1.1 Stakeholders and Roles

| Role | Name               |
|---|--------------------|
| Area / Chief Product Manager | Stefan Beck        |
| Lead Architect | Peter Muessig      |
| Program Architect | Peter Muessig      |
| Product Team Architect | Petar Skelin       |
| Architect(s) of Implementation Team | Petar Skelin       |
| Product Manager | Stanislava Baltova |
| Development Manager | Georgui Krounev    |
| UX Representative | Bart Meeuwssen     |
| UA Representative | N/A                |
| Security Representative | Nikolay Deshev     |
| Support Representative | N/A                |

## 1.2 Business Context and Related Documents

| Item | Value                                                                                       |
|---|---------------------------------------------------------------------------------------------|
| Business Case | Joule Work FX UI Components — Re-usable UI components for the Engagement Layer (Joule Work) |
| Product Type | Technology (React Component Library)                                                        |
| Delivery Type | NPM package (on-premise and cloud)                                                          |
| Product Line / Architecture Guideline | SAP Sapphire / Future-of-UX                                                                 |
| Description | Implements Future-of-UX concepts including the compositional design system                  |
| Product Name | `@sap-ui/fx-components`                                                                     |
| Current Version | 0.1.15                                                                                      |
| License | [SAP Developer License Agreement](https://tools.hana.ondemand.com/developer-license.txt)    |
| Design Documents | SAP Sapphire Design Guidelines, Sapphire Design Tokens                                      |
| Related Projects | UI5 Web Components (predecessor)                                                            |
| Sirius Project | [Sirius](https://sirius.hyperspace.tools.sap/#/program/8D9F4EDFCCCA274ACA2AF1664C8F2B3E/delivery/D69F84C8A9E3F34F05E9481580DC157C)                             |

## 1.3 Content Status — Architecture Input

| Section | Status | Remark |
|---|---|---|
| Business Goals | OK | Derived from product vision and bundle size analysis |
| Requirements | OK | Extracted from component inventory and feature documentation |
| Qualities — Product-specific | OK | Accessibility, performance, and bundle size documented |
| Qualities — Product Standards | OK | Applicable standards identified |
| Qualities — Cross Topics | OK | Scalability and deployment covered |
| Existing Technology | OK | UI5 Web Components predecessor documented |
| Boundary Conditions | OK | React 19 and Tailwind CSS 4 peer dependencies noted |
| Scope and Assumptions | OK | In-scope and out-of-scope items listed |
| Architecture Drivers | OK | Key drivers identified and prioritized |

## 1.4 Content Status — Architecture Decisions

| Section | Status | Remark |
|---|---|---|
| Technology Decisions | OK | All major technology choices documented with rationale |
| Major Architecture Decisions | OK | Layered architecture and provider patterns described |
| Risks | OK | Four risks identified with mitigation plans |
| Reuse: SAP-internal Components & Services | OK | SAP Sapphire specs and UI5 Web Components reference documented |
| Reuse: External Components (Open Source) | OK | shadcn/ui patterns and all OSS dependencies documented |
| External Services | OK | Not applicable — client-side library with no external service dependencies |
| Integration Concept | OK | NPM consumption, provider wrapping, and public API surface described |
| Security Concept | OK | XSS protection and SAST scanning covered |
| Deployment Structure and Options | OK | NPM, GitHub Pages, and CF deployment described |
| System Landscape | OK | Not applicable — client-side library with no server infrastructure |
| Migration Concept | OK | Initial release cycle; UI5 conversion guide referenced |
| Operations Concept | OK | Not applicable — no server-side runtime |
| Building and Testing | OK | Build pipeline and test strategy documented |
| Technical Debts | OK | Three debts identified with resolution plans |
