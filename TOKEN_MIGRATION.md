# Token Migration — Workfile → FX UI Kit

> Old source: [Workfile — Sapphire Theme](https://www.figma.com/design/gystUZmRneztewBEvssBo0/Workfile---Sapphire-Theme?node-id=5287-63408&m=dev)
> New source: [FX UI Kit](https://www.figma.com/design/fk2ebBh4AcyW25ZwZrOVZu/FX-UI-Kit?node-id=275-3725&view=variables&var-set-id=30-9235&m=dev)
>
> Generated: 2026-04-17

---

## 1. Tokens With a Replacement (rename / remap)

> **Figma-verified 2026-04-17:** Tab, PaneHeader, Calendar, and Input designs were checked against the FX UI Kit. Several usages that previously mapped to `button-accent` actually need context-specific tokens — see the ⚠️ notes below.

| Status | Old Token | New Token | Old Value (Light) | New Value (Light) | CSS Variable | Components Using It | What It Styles |
|---|---|---|---|---|---|---|---|
| ✅ Done | `button-accent` | **Context-dependent** (see notes) | `#0070F2` | `#0070F2` | `--button-accent` | Button, SplitButton, ToggleButton, Calendar, DateTimePicker, TimePicker, FileUploader, ConversationListItem, ConversationGroupListItem, List, MultiComboBox, NotificationListItem, NotificationListGroupItem, Tab, Tokenizer, TableGrowing, FxUserMenuContent | ⚠️ **Not a 1:1 rename.** Replacement depends on context — see mapping below |
| ✅ | ↳ *Buttons* | `Brand/background` | | `#0070F2` | `--brand-background` | Button, SplitButton, ToggleButton | Primary button background |
| ✅ | ↳ *Tab indicator* | `Text/text-accent` / `Border/border-accent` | | `#0057D2` | `--text-accent` / `--border-accent` | Tab | Active tab indicator bar and text (Figma uses text-accent, not button-accent) |
| ✅ | ↳ *Calendar selected* | `Brand/hover-background` | | `#0057D2` | `--brand-hover-background` | Calendar (Month/Year/Legend) | Selected date cell background (Figma uses Brand/hover-background) |
| ✅ | ↳ *Spinners/accents* | `Brand/foreground` | | `#0057D2` | `--brand-foreground` | BusyIndicator, loading states, accent links | Foreground accent color for non-button contexts |
| ✅ Done | `button-accent-hover` | `Brand/hover-background` | `#0057D2` | `#0057D2` | `--button-accent-hover` | Button, SplitButton, ToggleButton | Primary button hover bg, pressed state bg |
| ✅ Done | `button-accent2` | `Joule/background` | `#5D36FF` | `#5D36FF` | `--button-accent2` | Button, SplitButton, ToggleButton | PrimaryJoule (AI) button bg |
| ✅ Done | `button-accent2-hover` | `Joule/hover-background` | `#470CED` | `#470CED` | `--button-accent2-hover` | Button, SplitButton, ToggleButton | PrimaryJoule button hover/pressed bg |
| ✅ Done | `button-on-accent` | **Context-dependent** (see notes) | `#FFFFFF` | `#FFFFFF` | `--button-on-accent` | Button, SplitButton, ToggleButton, Calendar, TimePicker, TagExploration, FxUserMenuContent | ⚠️ **Not a 1:1 rename.** See mapping below |
| ✅ | ↳ *Buttons* | `Neutral/foreground-white` | | `#FFFFFF` | `--neutral-foreground-white` | Button, SplitButton, ToggleButton | Text/icon on filled buttons |
| ✅ | ↳ *Calendar selected text* | `Text/text-on-surface` | | `#FFFFFF` | `--text-on-surface` | Calendar (Month/Year/Legend) | Selected date cell text (Figma uses text-on-surface) |
| ✅ Done | `button-bg-accent-selected` | **Context-dependent** (see notes) | `#E5ECF5` | `#E5ECF5` | `--button-bg-accent-selected` | CheckBox, ComboBoxItem, ListItemBase, MultiComboBoxItem, Option, OptionCustom, TableGrowing, TableRow | ⚠️ **Not a 1:1 rename.** Replacement depends on context — see mapping below |
| ✅ | ↳ *Table (row, growing, sticky cols)* | `Brand/selected-background` | | `#E5ECF5` | `--brand-selected-background` | TableRow, TableGrowing | Selected row bg, active growing btn (dark: Neutrals/800 #2C313A) |
| ✅ | ↳ *ComboBox/MultiComboBox/Option* | `Brand/selected-background` | | `#E5ECF5` | `--brand-selected-background` | ComboBoxItem, MultiComboBoxItem, Option, OptionCustom | Selected dropdown item bg |
| ✅ | ↳ *CheckBox hover* | `Shell/shell-button-bg-selected` | | `#E5ECF5` | `--shell-button-bg-selected` | CheckBox | Hover bg for unchecked/checked (dark: Neutrals/700 #353C4A) |
| ✅ | ↳ *List selected* | `Brand/selected-background` | | `#E5ECF5` | `--brand-selected-background` | ListItemBase | Selected list item bg (Figma shows raw palette, but using brand-selected-background for proper dark mode) |
| ✅ Done | `icon-accent` | `Brand/foreground` | `#0057D2` | `#0057D2` | `--icon-accent` | TableHeaderCellActionAI | AI action header icon color |
| ✅ Done | `icon-primary` | `Text/text-primary` | `#0B0C0F` | `#0B0C0F` | `--icon-primary` | FxLayout, FxPaneHeader (19 uses) | All pane header icons (Figma-verified: PaneBar uses `text/text-primary`) |
| ✅ Done | `icon-muted` | `Text/text-tertiary` | `#616D85` | `#636D83` | `--icon-muted` | Dialog, Popover, TableRowActionNavigation | Resize corner icon, slim arrow icon (Figma-verified: Table uses Text/text-tertiary) |
| ✅ Done | `icon-inverted` | `Neutral/foreground-white` | `#FDFEFF` | `#FFFFFF` | `--icon-inverted` | CheckBox | Checkmark icon on checked state (note: value shifts from `#FDFEFF` to `#FFFFFF`) |
| ✅ Done | `Text/text-muted` | `Text/text-tertiary` | `#7C879C` | `#636D83` | `--text-muted`, `--muted-foreground` | Input (2), InputSuggestions (3), ComboBox, ComboBoxPopover (2), ComboBoxItemGroup, MultiComboBox, MultiComboBoxItemGroup, Select (3), Avatar, BusyIndicator, Menu (3), Panel (3), Card, Icon (2), SideNavigation, Table (2), TableGrowing, TableRow, Textarea, value-state-utils | Placeholder text, loading labels, empty states, group headers, icon colors, secondary text. ⚠️ Figma-verified: Input placeholder uses `Text/text-tertiary` (`#636D83`). The merge is intentional — `text-muted` no longer exists as a separate level. |
| ⏳ Pending | `Neutrals/500` | `Neutrals/500` | `#616D85` | `#636D83` | `--color-neutral-500` | (indirect via muted-foreground) | Value changed slightly |
| ⏳ Pending | `Semantic/negative` | `Semantic/negative` | `#BC2D29` | `#C72F2B` | `--negative` | (via semantic utils) | Error/destructive text & borders |
| ⏳ Pending | `Semantic/positive` | `Semantic/positive` | `#007038` | `#007B3E` | `--positive` | (via semantic utils) | Success text & borders |
| ⏳ Pending | `Semantic/info` | `Semantic/info` | `#0052CC` | `#0064D9` | `--info` | (via semantic utils) | Info text & borders |
| ⏳ Pending | `Semantic/Info-bg` | `Semantic/info-bg` | `#E2EBF8` | `#E2E9F8` | `--info-bg` | (via semantic utils) | Info background |
| ⏳ Pending | `Text/text-disabled` | `Text/text-disabled` | `#0F111566` (alpha) | `#B5BCCA` (solid) | `--text-disabled` | (via disabled states) | Disabled text — changed from 40% alpha to solid neutral-300 |

---

## 2. Tokens Needing Design Clarification (no 1:1 replacement)

> ~~`Text/text-muted`~~ — **Resolved:** Figma Input design confirms placeholder uses `Text/text-tertiary` (`#636D83`). The merge is intentional. Moved to Section 1.

| Old Token | Old Value | CSS Variable | Components Using It | What It Styles | Question for Design |
|---|---|---|---|---|---|
| `Shell/shell-button-fg-default` | `#040511` | `--shell-button-fg-default` | CollapsedItem (3 uses), ExpandedItem (2 uses) | Unselected nav item text & icon color | What should the default shell nav foreground be? Use `Neutral/foreground-black`? |
| `button-fg-disabled` | `#7C879C` | `--button-fg-disabled` | SegmentedButton | Disabled segment text color | No disabled foreground token in new set — what to use? `Text/text-disabled` (`#B5BCCA`)? |
| `button-bg-disabled` | `#E6E7EA` | `--button-bg-disabled` | (unused in components currently) | — | No disabled background token in new set — still needed for future use? |

---

## 3. Unused Tokens (safe to remove from `tokens.css`)

| Old Token | Old Value | CSS Variable | Notes |
|---|---|---|---|
| `button-muted` | `#616D85` | `--button-muted` | Zero component usage |
| `button-muted-hover` | `#353C4A` | `--button-muted-hover` | Zero component usage |
| `button-neutral` | `#0B0C0F` | `--button-neutral` | Zero component usage (demo theming UI only) |
| `button-neutral-hover` | `#0070F2` | `--button-neutral-hover` | Zero component usage (demo theming UI only) |
| `button-fg-accent-selected` | `#0070F2` | `--button-fg-accent-selected` | Zero component usage |
| `button-bg-selected` | `#E6E7EA` | `--button-bg-selected` | Zero component usage |
| `button-bg-accent2-selected` | `var(--color-purple-100)` | `--button-bg-accent2-selected` | Zero component usage |
| `icon-accent-2` | `#5D36FF` | `--icon-accent-2` | Zero component usage |
| `icon-neutral` | `#616D85` | `--icon-neutral` | Zero component usage |
| `Neutrals/950` | `#040511` | `--color-neutral-950` | Only consumed by `shell-button-fg-default` chain (also being removed) |

---

## 4. New Tokens to Add

| New Token | Light | Dark | CSS Variable (proposed) | Purpose |
|---|---|---|---|---|
| `Brand/background` | `#0070F2` | `#0070F2` | `--brand-background` | Already in CSS |
| `Brand/hover-background` | `#0057D2` | `#1B90FF` | `--brand-hover-background` | Already in CSS |
| `Brand/pressed-background` | `#0040B0` | `#4DB1FF` | `--brand-pressed-background` | Already in CSS |
| `Brand/foreground` | `#0057D2` | `#1B90FF` | `--brand-foreground` | Already in CSS |
| `Brand/pressed-foreground` | `#0040B0` | `#4DB1FF` | `--brand-pressed-foreground` | Already in CSS |
| `Brand/selected-background` | `#E5ECF5` | `#171A20` | `--brand-selected-background` | Already in CSS |
| `Brand/toggle-background` | `#D6E1F0` | `#2C313A` | `--brand-toggle-background` | Already in CSS |
| `Brand/gradient-1` | → canvas-primary | → canvas-primary | `--brand-gradient-1` | Already in CSS |
| `Brand/gradient-2` | `#FFFFFF` | → canvas-primary | `--brand-gradient-2` | Already in CSS |
| `Joule/background` | `#5D36FF` | `#5D36FF` | `--joule-background` | Already in CSS |
| `Joule/background-light` | `#E2D8FF` | `#2C13AD` | `--joule-background-light` | Already in CSS |
| `Joule/hover-background` | `#470CED` | `#7858FF` | `--joule-hover-background` | Already in CSS |
| `Joule/hover-background-2` | `#470CED` | `#E2D8FF` | `--joule-hover-background-2` | Already in CSS |
| `Joule/pressed-background` | `#2C13AD` | `#9B76FF` | `--joule-pressed-background` | Already in CSS |
| `Joule/foreground` | `#5D36FF` | `#8080FF` | `--joule-foreground` | Already in CSS |
| `Joule/pressed-foreground` | `#2C13AD` | `#9B76FF` | `--joule-pressed-foreground` | Already in CSS |
| `Neutral/background-white` | `#FFFFFF` | `rgba(255,255,255,0)` | `--neutral-background-white` | Already in CSS |
| `Neutral/background-grey` | `#B5BCCA` | `#636D83` | `--neutral-background-grey` | Already in CSS |
| `Neutral/hover-background` | `#F0F2F4` | `rgba(234,234,240,0)` | `--neutral-hover-background` | Already in CSS |
| `Neutral/hover-background-2` | `#F0F2F4` | `#171A20` | `--neutral-hover-background-2` | Already in CSS |
| `Neutral/pressed-background` | `#E6E7EA` | `rgba(226,226,233,0)` | `--neutral-pressed-background` | Already in CSS |
| `Neutral/pressed-background-2` | `#E6E7EA` | `#2C313A` | `--neutral-pressed-background-2` | Already in CSS |
| `Neutral/foreground-white` | `#FFFFFF` | `#FFFFFF` | `--neutral-foreground-white` | Already in CSS |
| `Neutral/foreground-black` | `#0B0C0F` | `#F0F2F4` | `--neutral-foreground-black` | Already in CSS |
| `Neutral/foreground-muted` | `#636D83` | `#B5BCCA` | `--neutral-foreground-muted` | Already in CSS |
| `Neutral/foreground-muted-pressed` | `#353C4A` | `#E6E7EA` | `--neutral-foreground-muted-pressed` | Already in CSS |
| `Border/border-secondary` | `#B5BCCA` | `#353C4A` | `--border-secondary` | Already in CSS |
| `Border/border-focus` | `#0040B0` | `#4DB1FF` | `--border-focus` | Already in CSS |
| `Border/border-focus-neutral` | `#353C4A` | `#FFFFFF` | `--border-focus-neutral` | Already in CSS |
| `Border/border-joule` | `#2C13AD` | `#9B76FF` | `--border-joule` | Already in CSS |
| `Border/border-toggle` | `#D6E1F0` | `#002A86` | `--border-toggle` | Already in CSS |
| `Semantic/negative-border` | `rgba(199,47,43,0.3)` | `rgba(255,105,102,0.3)` | `--negative-border` | Already in CSS |
| `Semantic/positive-border` | `rgba(0,123,62,0.3)` | `rgba(13,192,67,0.3)` | `--positive-border` | Already in CSS |
| `Semantic/info-border` | `rgba(0,100,217,0.3)` | `rgba(71,167,255,0.3)` | `--info-border` | Already in CSS |
| `Semantic/warning-border` | `rgba(169,90,0,0.3)` | `rgba(255,166,0,0.3)` | `--warning-border` | Already in CSS |
| `Neutrals/50` | `#FDFEFF` | — | `--color-neutral-50` | Already in CSS |
| `Neutrals/50-Alternate` | `#F8F9FA` | — | `--color-neutral-50-alt` | Already in CSS |
| `Colors/Specific/Brand-Blue-Toggle` | `#D6E1F0` | — | `--brand-blue-toggle` | Already in CSS |
| `Colors/Specific/Canvas-Gradient` | `#F2F3F6` | — | `--canvas-gradient` | Already in CSS |
| `Spacing/spacing-4xs` | `2px` | — | `--spacing-4xs` | Already in CSS |
| `Illustrative/color-1` … `color-31` | (see DESIGN_TOKENS.md) | (see DESIGN_TOKENS.md) | — | Not yet in CSS — add when illustration components need them |
