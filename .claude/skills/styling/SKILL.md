---
name: styling
description: Figma-to-Tailwind styling reference for fx-components. Use when editing or creating component files under src/components/, styling with Tailwind classes, user references Figma tokens, asks which Tailwind classes to use, asks about token-to-class mapping, or mentions color tokens.
user-invocable: false
---

## Lookup Flow

### Step 1: Identify the token name in Figma

In the Figma Dev Screens, colors are named with semantic tokens like `text/tertiary`, `bg/canvas`, `border/active`, `button/accent`, etc.

### Step 2: Map it to a CSS variable

The token name maps directly to a CSS variable in `src/theme/tokens.css`:

- `text/tertiary` → `--text-tertiary`
- `bg/canvas` → `--canvas-primary`
- `border/active` → `--border-active`
- `button/accent` → `--button-accent`

### Step 3: Map to `sapphire-*` Tailwind classes

Always prefer `sapphire-*` prefixed classes to match Figma token names directly. When Figma says `text-primary`, use `text-sapphire-text-primary` in code.

| Figma token | CSS var | Tailwind class |
|---|---|---|
| text/tertiary | --text-tertiary | `text-sapphire-text-tertiary` |
| text/quarternary | --text-quarternary | `text-sapphire-text-quarternary` |
| text/disabled | --text-disabled | `text-sapphire-text-disabled` |
| text/accent-2 | --text-accent-2 | `text-sapphire-text-accent-2` |
| bg/canvas | --canvas-primary | `bg-sapphire-canvas-primary` |
| bg/tertiary | --background-tertiary | `bg-sapphire-background-tertiary` |
| bg/quaternary | --background-quaternary | `bg-sapphire-background-quaternary` |
| card-bg/secondary | --card-bg-secondary | `bg-sapphire-card-bg-secondary` |
| border/active | --border-active | `border-sapphire-border-active` |
| border/accent | --border-accent | `border-sapphire-border-accent` |
| button/accent | --button-accent | `bg-sapphire-button-accent` |
| button/accent-hover | --button-accent-hover | `hover:bg-sapphire-button-accent-hover` |
| button/accent2 | --button-accent2 | `bg-sapphire-button-accent2` |
| button/on-accent | --button-on-accent | `text-sapphire-button-on-accent` |
| button/muted | --button-muted | `text-sapphire-button-muted` |
| button/muted-hover | --button-muted-hover | `text-sapphire-button-muted-hover` |
| button/fg-disabled | --button-fg-disabled | `text-sapphire-button-fg-disabled` |
| button/bg-disabled | --button-bg-disabled | `bg-sapphire-button-bg-disabled` |
| button/bg-accent-selected | --button-bg-accent-selected | `bg-sapphire-button-bg-accent-selected` |
| button/fg-accent-selected | --button-fg-accent-selected | `text-sapphire-button-fg-accent-selected` |
| button/bg-selected | --button-bg-selected | `bg-sapphire-button-bg-selected` |
| icon/accent | --icon-accent | `text-sapphire-icon-accent` |
| icon/accent-2 | --icon-accent-2 | `text-sapphire-icon-accent-2` |
| icon/primary | --icon-primary | `text-sapphire-icon-primary` |
| icon/muted | --icon-muted | `text-sapphire-icon-muted` |
| chrome/bg | --chrome-bg-primary | `bg-sapphire-chrome-bg-primary` |
| chrome/fg | --chrome-fg-primary | `text-sapphire-chrome-fg-primary` |
| positive | --positive | `text-sapphire-positive` |
| negative | --negative | `text-sapphire-negative` |
| warning | --warning | `text-sapphire-warning` |
| info | --info | `text-sapphire-info` |
| positive-bg | --positive-bg | `bg-sapphire-positive-bg` |
| negative-bg | --negative-bg | `bg-sapphire-negative-bg` |
| warning-bg | --warning-bg | `bg-sapphire-warning-bg` |
| info-bg | --info-bg | `bg-sapphire-info-bg` |
| prompt/accent | --prompt-accent | `text-sapphire-prompt-accent` |
| prompt/accent-muted | --prompt-accent-muted | `border-sapphire-prompt-accent-muted` |

**For palette colors** (direct Tailwind names — no sapphire prefix):

| Figma | Tailwind class |
|---|---|
| blue/500 | `bg-blue-500` (lighter blue, #1B90FF) |
| blue/600 | `bg-blue-600` (brand blue, #0070F2) |
| purple/500 | `text-purple-500` |
| purple/600 | `text-purple-600` (brand purple, #5D36FF) |
| neutral/700 | `text-neutral-700` |
| brand-purple | `bg-brand-purple` |

**For spacing** (prefixed with `sapphire-` to avoid clashing with Tailwind built-in sizes):

| Token | Class | Value |
|---|---|---|
| --spacing-3xs | `p-sapphire-3xs`, `gap-sapphire-3xs`, `m-sapphire-3xs` | 4px |
| --spacing-2xs | `p-sapphire-2xs`, `gap-sapphire-2xs` | 8px |
| --spacing-xs | `p-sapphire-xs`, `gap-sapphire-xs` | 12px |
| --spacing-s | `p-sapphire-s`, `gap-sapphire-s` | 16px |
| --spacing-m | `p-sapphire-m`, `gap-sapphire-m` | 20px |
| --spacing-l | `p-sapphire-l`, `gap-sapphire-l` | 24px |
| --spacing-xl | `p-sapphire-xl`, `gap-sapphire-xl` | 32px |
| --spacing-2xl | `p-sapphire-2xl`, `gap-sapphire-2xl` | 40px |
| --spacing-3xl | `p-sapphire-3xl`, `gap-sapphire-3xl` | 48px |
| --spacing-4xl | `p-sapphire-4xl`, `gap-sapphire-4xl` | 64px |

### Step 4: Quick verification

If unsure, grep `sapphire-theme.css` for the token:

```
grep "button-accent" src/theme/sapphire-theme.css
```

This shows the exact Tailwind variable registration and confirms the class name.

## Rules

1. **Never hard-code colors** like `text-green-500` or `bg-[#3498db]` — always use a token
2. **Prefer `sapphire-*` tokens** — always use `sapphire-*` prefixed classes to match Figma design logic directly (e.g., Figma `text-primary` → `text-sapphire-text-primary`)
3. **Palette direct** — for raw color shades, use direct names: `bg-purple-500`, `text-neutral-700` (no sapphire prefix)
4. **For inline styles** (rare), use `var(--border-active)` not hex values
5. **Tailwind prefix depends on CSS property**, not the token name — `button/accent` becomes `bg-sapphire-button-accent` for backgrounds, `text-sapphire-button-accent` for text color

## Key Files

- `src/theme/tokens.css` — CSS variable definitions (light + dark values). **Source of truth — edit this file.**
- `src/theme/sapphire-theme.css` — Tailwind @theme registration. **Auto-generated by `scripts/sync-theme-tokens.mjs` — never edit manually.**
- `scripts/sync-theme-tokens.mjs` — Reads tokens.css and regenerates sapphire-theme.css on every build
- `CLAUDE.md` — CSS class conventions section

## Figma Reference

- Dev Screens (Base Colors / Theme Colors): https://www.figma.com/design/1H9aeNhaaTYFncQ2KM1pUZ/Dev-Screens?node-id=375-5986
