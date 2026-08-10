# Spec 01: Bar Component — Core

## Overview

A layout container with three zones (start, middle, end) used as page headers, subheaders, footers, and floating footers. Purely structural — no events.

**Source:** `ui5-bar` from UI5 Web Components

---

## Requirements

### Rendering
- [x] Renders a root `<div>` with three child `<div>` elements (startContent, midContent, endContent)
- [x] All three container divs render even when their content prop is empty/undefined
- [x] Root div has `data-design` attribute reflecting current design value
- [x] Each container div has `data-part` attribute: `startContent`, `midContent`, `endContent`
- [x] Component sets `displayName` to `"Bar"`

### Design Variants
- [x] **Header** (default): height 2.75rem (`h-11`), header background, header shadow
- [x] **Subheader**: height 3rem (`h-12`), header background, header shadow, `-mt-px`
- [x] **Footer**: height 2.75rem (`h-11`), footer background, top border, no shadow
- [x] **FloatingFooter**: height 2.75rem (`h-11`), footer background, border-radius, drop shadow, no border

### Content Layout
- [x] Start content: flex, shrinkable, left-aligned (LTR), `padding-inline-start: 1rem`
- [x] Middle content: flex, centered (`justify-center`), `flex: 1`, horizontal padding `0.5rem`, `min-width: 0`, `overflow: hidden`
- [x] End content: flex, non-shrinkable, right-aligned (LTR), `padding-inline-end: 1rem`
- [x] Direct children of each zone get: `margin: 0 0.25rem`, `max-width: 100%`, `white-space: nowrap`, `overflow: hidden`, `text-overflow: ellipsis`
- [x] Middle content is centered in the remaining space between start and end zones

### Props
- [x] `design` accepts `BarDesign` enum values and string literals (`"Header"`, `"Footer"`, etc.)
- [x] `startContent` renders ReactNode in start zone
- [x] `children` renders ReactNode in middle zone
- [x] `endContent` renders ReactNode in end zone
- [x] `className` is merged onto root element via `cn()`
- [x] `style` is applied to root element
- [x] `id` is set on root element
- [x] `data-testid` is forwarded to root element

### Ref (BarRef)
- [x] `forwardRef` exposes `BarRef` interface
- [x] `focus()` focuses the root element
- [x] `blur()` blurs the root element
- [x] `isFocused()` returns `true` when root is the active element
- [x] `nativeElement` returns the root `HTMLDivElement`

### Accessibility
- [x] `role="toolbar"` when `accessibleRole` is `"Toolbar"` (default)
- [x] No role attribute when `accessibleRole` is `"None"`
- [x] `aria-label` set from `accessibleName` when provided
- [x] `aria-label` falls back to design name (e.g. `"Header"`) when no explicit `accessibleName` or `accessibleNameRef`
- [x] `aria-labelledby` set from `accessibleNameRef` when provided
- [x] `aria-label` is omitted when `accessibleNameRef` is set (avoid conflict)

### RTL Support
- [x] Start padding uses logical property `padding-inline-start` (Tailwind `ps-4`)
- [x] End padding uses logical property `padding-inline-end` (Tailwind `pe-4`)
- [x] Layout respects `dir="rtl"` automatically via logical properties

### Overflow / Shrink Behavior
- [x] Content exceeding available space is clipped (no horizontal scroll on the bar)
- [x] All containers have `min-width: 0` to allow flex shrinking
- [x] Middle zone overflow is hidden

### Theming
- [x] Uses SAP CSS variables with fallbacks to project design tokens (e.g. `var(--sapPageHeader_Background, hsl(var(--background)))`)
- [x] Renders correctly without SAP theme variables defined (uses fallback tokens)
- [x] Renders correctly with SAP theme variables defined (uses SAP values)

---

## Test Cases

1. **Default render**: `<Bar>Title</Bar>` renders Header design with "Title" centered
2. **Three zones**: `<Bar startContent={<A/>} endContent={<B/>}><C/></Bar>` — all three zones populated
3. **Empty zones**: `<Bar />` — all three container divs still render
4. **Footer design**: `<Bar design="Footer" />` — has border-top, footer background, no shadow
5. **FloatingFooter design**: `<Bar design="FloatingFooter" />` — border-radius, shadow
6. **Subheader design**: `<Bar design="Subheader" />` — taller height, negative margin-top
7. **Accessible role None**: `<Bar accessibleRole="None" />` — no `role` attribute
8. **Custom aria-label**: `<Bar accessibleName="Main navigation" />` — `aria-label="Main navigation"`
9. **aria-labelledby**: `<Bar accessibleNameRef="title-1" />` — `aria-labelledby="title-1"`, no `aria-label`
10. **Ref methods**: Create ref, call `focus()`, verify `isFocused()` returns true
11. **className merge**: `<Bar className="custom" />` — custom class present alongside generated classes
12. **Long content overflow**: Middle content with very long text — no horizontal scroll, text truncated

---

## Acceptance Criteria

- [x] TypeScript compiles without errors (`pnpm build:components`)
- [x] Component renders correctly in all four design variants
- [x] Ref methods work correctly
- [x] ARIA attributes are correct for both Toolbar and None roles
- [x] No horizontal overflow on narrow widths
- [x] `className` and `style` overrides work
- [x] All three container divs always render

**Output when complete:** `<promise>DONE</promise>`
