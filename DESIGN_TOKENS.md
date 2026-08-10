# Sapphire Theme — Design Tokens

> Exported from Figma: [FX UI Kit](https://www.figma.com/design/fk2ebBh4AcyW25ZwZrOVZu/FX-UI-Kit?node-id=275-3725&view=variables&var-set-id=30-9235&m=dev)
>
> Date: 2026-04-24

---

## 1. Foundations (Palette)

Raw color scales and primitives. These are the building blocks referenced by semantic tokens.

### Blues

| Step | Hex |
|------|-----|
| 50 | `#EBF8FF` |
| 100 | `#D1EFFF` |
| 200 | `#A6E0FF` |
| 300 | `#89D1FF` |
| 400 | `#4DB1FF` |
| 500 | `#1B90FF` |
| 600-Base | `#0070F2` |
| 700 | `#0057D2` |
| 800 | `#0040B0` |
| 900 | `#002A86` |
| 950 | `#00144A` |

### Purples

| Step | Hex |
|------|-----|
| 50 | `#F1ECFF` |
| 100 | `#E2D8FF` |
| 200 | `#D3B6FF` |
| 300 | `#B894FF` |
| 400 | `#9B76FF` |
| 500 | `#7858FF` |
| 600-Base | `#5D36FF` |
| 700 | `#470CED` |
| 800 | `#2C13AD` |
| 900 | `#1C0C6E` |
| 950 | `#0E0637` |

### Neutrals

| Step | Hex |
|------|-----|
| White | `#FFFFFF` |
| 50 | `#FDFEFF` |
| 50-Alternate | `#F8F9FA` |
| 100 | `#F0F2F4` |
| 200 | `#E6E7EA` |
| 300 | `#B5BCCA` |
| 400 | `#7C879C` |
| 500 | `#636D83` |
| 600 | `#353C4A` |
| 700 | `#2C313A` |
| 800 | `#171A20` |
| 900 | `#0B0C0F` |
| Black | `#000000` |

### Specific / Brand

| Name | Value |
|------|-------|
| Brand-Blue | alias → Blues/600-Base (`#0070F2`) |
| Brand-Purple | alias → Purples/600-Base (`#5D36FF`) |
| Chrome-Bg-Light | `#F8F9FA` |
| Purple-Indigo-New | `#8080FF` |
| Brand-Blue-Selected | `#E5ECF5` |
| Brand-Blue-Toggle | `#D6E1F0` |
| Canvas-Gradient | `#F2F3F6` |
| Joule-Input-Gradient-Blue | `#4295FF` |

---

## 2. Theme Tokens (Light / Dark)

Semantic tokens that reference the palette above. These are the CSS custom properties used in components.

### Brand

| Token | Light | Dark |
|-------|-------|------|
| `background` | Blues/600-Base (`#0070F2`) | Blues/600-Base (`#0070F2`) |
| `hover-background` | Blues/700 (`#0057D2`) | Blues/500 (`#1B90FF`) |
| `pressed-background` | Blues/800 (`#0040B0`) | Blues/400 (`#4DB1FF`) |
| `foreground` | Blues/700 (`#0057D2`) | Blues/500 (`#1B90FF`) |
| `pressed-foreground` | Blues/800 (`#0040B0`) | Blues/400 (`#4DB1FF`) |
| `selected-background` | Brand-Blue-Selected (`#E5ECF5`) | Neutrals/700 (`#2C313A`) |
| `selected-hover-background` | Brand-Blue-Toggle (`#D6E1F0`) | Neutrals/600 (`#353C4A`) |
| `toggle-background` | Brand-Blue-Toggle (`#D6E1F0`) | Neutrals/700 (`#2C313A`) |
| `gradient-1` | → Surface/canvas-primary | → Surface/canvas-primary |
| `gradient-2` | Neutrals/White (`#FFFFFF`) | → Surface/canvas-primary |
| `gradient-3` | → Shell/shell-bg-primary | → Shell/shell-bg-primary |
| `gradient-4` | `rgba(248,249,250,0.80)` | `rgba(23,26,32,0.80)` |
| `gradient-5` | `rgba(248,249,250,0.20)` | `rgba(23,26,32,0.20)` |
| `gradient-6` | `rgba(255,255,255,0.00)` | `rgba(23,26,32,0.00)` |

### Joule

| Token | Light | Dark |
|-------|-------|------|
| `background` | Purples/600-Base (`#5D36FF`) | Purples/600-Base (`#5D36FF`) |
| `background-light` | Purples/100 (`#E2D8FF`) | Purples/800 (`#2C13AD`) |
| `background-area` | Purples/50 (`#F1ECFF`) | Purples/950 (`#0E0637`) |
| `hover-background` | Purples/700 (`#470CED`) | Purples/500 (`#7858FF`) |
| `hover-background-2` | Purples/700 (`#470CED`) | Purples/100 (`#E2D8FF`) |
| `pressed-background` | Purples/800 (`#2C13AD`) | Purples/400 (`#9B76FF`) |
| `foreground` | Purples/600-Base (`#5D36FF`) | Purple-Indigo-New (`#8080FF`) |
| `pressed-foreground` | Purples/800 (`#2C13AD`) | Purples/400 (`#9B76FF`) |
| `logo-1` | Purples/500 (`#7858FF`) | Purples/500 (`#7858FF`) |
| `logo-2` | Purples/900 (`#1C0C6E`) | Purples/100 (`#E2D8FF`) |

### Surface

| Token | Light | Dark |
|-------|-------|------|
| `canvas-primary` | Neutrals/50 (`#FDFEFF`) | Neutrals/900 (`#0B0C0F`) |
| `card-bg-primary` | Neutrals/50 (`#FDFEFF`) | Neutrals/900 (`#0B0C0F`) |
| `card-bg-primary-selected` | Neutrals/White (`#FFFFFF`) | Neutrals/700 (`#2C313A`) |
| `background-primary` | Neutrals/50 (`#FDFEFF`) | Neutrals/900 (`#0B0C0F`) |
| `background-secondary` | Neutrals/50-Alternate (`#F8F9FA`) | Neutrals/800 (`#171A20`) |
| `background-tertiary` | Neutrals/100 (`#F0F2F4`) | Neutrals/700 (`#2C313A`) |
| `background-quaternary` | Neutrals/200 (`#E6E7EA`) | Neutrals/600 (`#353C4A`) |

### Text

| Token | Light | Dark |
|-------|-------|------|
| `text-primary` | Neutrals/900 (`#0B0C0F`) | Neutrals/100 (`#F0F2F4`) |
| `text-secondary` | Neutrals/600 (`#353C4A`) | Neutrals/300 (`#B5BCCA`) |
| `text-tertiary` | Neutrals/500 (`#636D83`) | Neutrals/400 (`#7C879C`) |
| `text-disabled` | Neutrals/300 (`#B5BCCA`) | Neutrals/600 (`#353C4A`) |
| `text-on-surface` | Neutrals/White (`#FFFFFF`) | Neutrals/Black (`#000000`) |
| `text-accent` | Blues/700 (`#0057D2`) | Blues/400 (`#4DB1FF`) |
| `text-accent-2` | Purples/600-Base (`#5D36FF`) | Purples/500 (`#7858FF`) |

### Border

| Token | Light | Dark |
|-------|-------|------|
| `border-primary` | Neutrals/200 (`#E6E7EA`) | Neutrals/700 (`#2C313A`) |
| `border-secondary` | Neutrals/300 (`#B5BCCA`) | Neutrals/600 (`#353C4A`) |
| `border-active` | Neutrals/400 (`#7C879C`) | Neutrals/500 (`#636D83`) |
| `border-accent` | Blues/700 (`#0057D2`) | Blues/400 (`#4DB1FF`) |
| `border-focus` | Blues/800 (`#0040B0`) | Blues/400 (`#4DB1FF`) |
| `border-focus-neutral` | Neutrals/600 (`#353C4A`) | Neutrals/White (`#FFFFFF`) |
| `border-joule` | Purples/800 (`#2C13AD`) | Purples/400 (`#9B76FF`) |
| `border-area` | Purples/300 (`#B894FF`) | Purples/600-Base (`#5D36FF`) |
| `border-toggle` | Brand-Blue-Toggle (`#D6E1F0`) | Neutrals/600 (`#353C4A`) |

### Semantic

| Token | Light | Dark |
|-------|-------|------|
| `negative` | `#C72F2B` | `#FF6966` |
| `negative-bg` | `#F6E6E7` | `#3C1618` |
| `negative-border` | `rgba(199,47,43,0.3)` | `rgba(255,105,102,0.3)` |
| `positive` | `#007B3E` | `#0DC043` |
| `positive-bg` | `#DFEFE6` | `#162C20` |
| `positive-border` | `rgba(0,123,62,0.3)` | `rgba(13,192,67,0.3)` |
| `info` | `#0064D9` | `#47A7FF` |
| `info-bg` | `#E2E9F8` | `#102942` |
| `info-border` | `rgba(0,100,217,0.3)` | `rgba(71,167,255,0.3)` |
| `warning` | `#A95A00` | `#FFA600` |
| `warning-bg` | `#FEF5C8` | `#413601` |
| `warning-bg-transparent` | `rgba(254,245,200,0.00)` | `rgba(65,54,1,0.00)` |
| `warning-border` | `rgba(169,90,0,0.3)` | `rgba(255,166,0,0.3)` |

### Shell

| Token | Light | Dark |
|-------|-------|------|
| `shell-fg-primary` | `#354A5F` | `#354A5F` |
| `shell-bg-primary` | Chrome-Bg-Light (`#F8F9FA`) | Neutrals/800 (`#171A20`) |
| `shell-button-fg-selected` | Blues/700 (`#0057D2`) | Blues/400 (`#4DB1FF`) |
| `shell-button-bg-selected` | Brand-Blue-Selected (`#E5ECF5`) | Neutrals/700 (`#2C313A`) |

### Neutral

| Token | Light | Dark |
|-------|-------|------|
| `background-white` | Neutrals/White (`#FFFFFF`) | `rgba(255,255,255,0)` |
| `background-grey` | Neutrals/300 (`#B5BCCA`) | Neutrals/500 (`#636D83`) |
| `hover-background` | Neutrals/100 (`#F0F2F4`) | `rgba(234,234,240,0)` |
| `hover-background-2` | Neutrals/100 (`#F0F2F4`) | Neutrals/800 (`#171A20`) |
| `pressed-background` | Neutrals/200 (`#E6E7EA`) | `rgba(226,226,233,0)` |
| `pressed-background-2` | Neutrals/200 (`#E6E7EA`) | Neutrals/700 (`#2C313A`) |
| `foreground-white` | Neutrals/White (`#FFFFFF`) | Neutrals/White (`#FFFFFF`) |
| `foreground-black` | Neutrals/900 (`#0B0C0F`) | Neutrals/100 (`#F0F2F4`) |
| `foreground-muted` | Neutrals/500 (`#636D83`) | Neutrals/300 (`#B5BCCA`) |
| `foreground-muted-pressed` | Neutrals/600 (`#353C4A`) | Neutrals/200 (`#E6E7EA`) |
| `overlay` | `rgba(0,0,0,0.20)` | `rgba(0,0,0,0.50)` |

### Illustrative

| Token | Light | Dark |
|-------|-------|------|
| `color-1` | `#9B015D` | `#9B015D` |
| `color-2` | `#56BDFF` | `#4D82B8` |
| `color-3` | `#FF7F4C` | `#FF7F4C` |
| `color-4` | `#00144A` | `#688FB7` |
| `color-5` | `#A9B4BE` | `#FFFFFF` |
| `color-6` | `#D5DADD` | `#818F98` |
| `color-7` | `#DBF1FF` | `#101619` |
| `color-8` | `#FFFFFF` | `#D5DADD` |
| `color-9` | `#0899A7` | `#0899A7` |
| `color-10` | `#DBF1FF` | `#EBF8FF` |
| `color-11` | `#DF1278` | `#FA4F96` |
| `color-12` | `#00A800` | `#00A800` |
| `color-13` | `#0070F2` | `#3B5B7C` |
| `color-14` | `#0040B0` | `#2A4259` |
| `color-15` | `#C35500` | `#C35500` |
| `color-16` | `#8D2A00` | `#8D2A00` |
| `color-17` | `#046C7C` | `#046C7C` |
| `color-18` | `#BCE5FF` | `#2A4259` |
| `color-19` | `#A3DBFF` | `#324E6B` |
| `color-20` | `#89D1FF` | `#222F3B` |
| `color-21` | `#1B90FF` | `#101619` |
| `color-22` | `#00144A` | `#00144A` |
| `color-23` | `#D20A0A` | `#D20A0A` |
| `color-24` | `#FFB2D2` | `#D094B0` |
| `color-25` | `#FFEAF4` | `#D0C1CB` |
| `color-26` | `#FFDF72` | `#D0B863` |
| `color-27` | `#FFF8D6` | `#D0CDB3` |
| `color-28` | `#A93E00` | `#A93E00` |
| `color-29` | `#450B00` | `#450B00` |
| `color-30` | `#340800` | `#340800` |
| `color-31` | `#FFAB92` | `#FFAB92` |

### Chart

| Token | Light | Dark |
|-------|-------|------|
| `chart-color_1` | `#168EFF` | `#168EFF` |
| `chart-color_2` | `#DF1278` | `#FA4F96` |
| `chart-color_3` | `#8B47D7` | `#8B47D7` |
| `chart-color_4` | `#049F9A` | `#049F9A` |
| `chart-color_5` | `#5D36FF` | `#7858FF` |
| `chart-color_6` | `#DA6C6C` | `#F28585` |
| `chart-color_7` | `#CC00DC` | `#F31DED` |
| `chart-color_8` | `#0070F2` | `#0070F2` |
| `chart-color_9` | `#A68A5B` | `#A68A5B` |
| `chart-color_10` | `#798C77` | `#8EA18C` |
| `chart-color_11` | `#C87B00` | `#F2A634` |
| `chart-color_12` | `#75980B` | `#B4CE35` |

### Accent

| Token | Light | Dark |
|-------|-------|------|
| `accent-1` | `#A45D00` | `#FFDF72` |
| `accent-bg-1` | `#FFF3B8` | `#AE4000` |
| `accent-2` | `#AA0808` | `#FF8CB2` |
| `accent-bg-2` | `#FFD0E7` | `#890506` |
| `accent-3` | `#BA066C` | `#FECBDA` |
| `accent-bg-3` | `#FFDBE7` | `#B40569` |
| `accent-4` | `#A100C2` | `#FFAFED` |
| `accent-bg-4` | `#FFDCF3` | `#8700B8` |
| `accent-5` | `#552CFF` | `#D3B6FF` |
| `accent-bg-5` | `#DED3FF` | `#470CF1` |
| `accent-6` | `#0057D2` | `#A6E0FF` |
| `accent-bg-6` | `#D1EFFF` | `#0054CC` |
| `accent-7` | `#046C7A` | `#64EDD2` |
| `accent-bg-7` | `#C2FCEE` | `#036573` |
| `accent-8` | `#256F3A` | `#BDE986` |
| `accent-bg-8` | `#EBF5CB` | `#236C39` |
| `accent-9` | `#6C32A9` | `#B995E0` |
| `accent-bg-9` | `#DDCCF0` | `#4E247A` |
| `accent-10` | `#556B82` | `#D5DADD` |
| `accent-bg-10` | `#EAECEE` | `#45617C` |

---

## 3. Foundation Primitives (Non-Color)

### Spacing

| Token | Value |
|-------|-------|
| `spacing-null` | `0` |
| `spacing-4xs` | `2px` |
| `spacing-3xs` | `4px` |
| `spacing-2xs` | `8px` |
| `spacing-xs` | `12px` |
| `spacing-s` | `16px` |
| `spacing-m` | `20px` |
| `spacing-l` | `24px` |
| `spacing-xl` | `32px` |
| `spacing-2xl` | `36px` |
| `spacing-3xl` | `40px` |
| `spacing-4xl` | `48px` |
| `spacing-5xl` | `64px` |
| `spacing-6xl` | `80px` |
| `spacing-7xl` | `96px` |

### Border Radius

| Token | Value |
|-------|-------|
| `radius-null` | `0` |
| `radius-s` | `4px` |
| `radius-m` | `8px` |
| `radius-l` | `16px` |
| `radius-xl` | `32px` |

### Border Width

| Token | Value |
|-------|-------|
| `border-width-s` | `1px` |
| `border-width-m` | `2px` |

### Icon Sizes

| Token | Value |
|-------|-------|
| `size-s` | `16px` |
| `size-m` | `20px` |
| `size-l` | `24px` |

### Opacity

| Token | Value |
|-------|-------|
| `disabled-opacity` | `40%` |

---

## 4. Tokens Removed from FX-UI-Kit (were in Workfile)

The following tokens existed in the old Workfile — Sapphire Theme but are **not present** in FX-UI-Kit:

| Token | Notes |
|-------|-------|
| `Joule/hover-foreground` | Removed; only `foreground` and `pressed-foreground` remain |
| `Shell/shell-button-fg-default` | Removed from FX-UI-Kit |
| `Brand/toggle-hover-background` | Removed; replaced by `Brand/toggle-background` |
| `Neutral/950` (foundation) | Not in FX-UI-Kit foundations (file goes White → 50 → ... → 900 → Black) |

## 5. Tokens Added in FX-UI-Kit (not in Workfile)

| Token | Light | Dark |
|-------|-------|------|
| `Joule/background-light` | Purples/100 (`#E2D8FF`) | Purples/800 (`#2C13AD`) |
| `Joule/background-area` | Purples/50 (`#F1ECFF`) | Purples/950 (`#0E0637`) |
| `Joule/hover-background-2` | Purples/700 (`#470CED`) | Purples/100 (`#E2D8FF`) |
| `Joule/logo-1` | Purples/500 (`#7858FF`) | Purples/500 (`#7858FF`) |
| `Joule/logo-2` | Purples/900 (`#1C0C6E`) | Purples/100 (`#E2D8FF`) |
| `Neutral/background-grey` | Neutrals/300 (`#B5BCCA`) | Neutrals/500 (`#636D83`) |
| `Neutral/hover-background-2` | Neutrals/100 (`#F0F2F4`) | Neutrals/800 (`#171A20`) |
| `Neutral/pressed-background-2` | Neutrals/200 (`#E6E7EA`) | Neutrals/700 (`#2C313A`) |
| `Neutral/foreground-muted-pressed` | Neutrals/600 (`#353C4A`) | Neutrals/200 (`#E6E7EA`) |
| `Border/border-focus-neutral` | Neutrals/600 (`#353C4A`) | Neutrals/White (`#FFFFFF`) |
| `Border/border-secondary` | Neutrals/300 (`#B5BCCA`) | Neutrals/600 (`#353C4A`) |
| `Border/border-area` | Purples/300 (`#B894FF`) | Purples/600-Base (`#5D36FF`) |
| `Brand/selected-background` | Brand-Blue-Selected (`#E5ECF5`) | Neutrals/700 (`#2C313A`) |
| `Brand/gradient-1` | → canvas-primary | → canvas-primary |
| `Brand/gradient-2` | Neutrals/White | → canvas-primary |
| `Brand/gradient-3` | → Shell/shell-bg-primary | → Shell/shell-bg-primary |
| `Brand/gradient-4` | `rgba(248,249,250,0.80)` | `rgba(23,26,32,0.80)` |
| `Brand/gradient-5` | `rgba(248,249,250,0.20)` | `rgba(23,26,32,0.20)` |
| `Brand/gradient-6` | `rgba(255,255,255,0.00)` | `rgba(23,26,32,0.00)` |
| `Colors/Specific/Canvas-Gradient` | `#F2F3F6` | (foundation) |
| `Spacing/spacing-4xs` | `2px` | (foundation) |
| `Semantic/negative-border` | `rgba(199,47,43,0.3)` | `rgba(255,105,102,0.3)` |
| `Semantic/positive-border` | `rgba(0,123,62,0.3)` | `rgba(13,192,67,0.3)` |
| `Semantic/info-border` | `rgba(0,100,217,0.3)` | `rgba(71,167,255,0.3)` |
| `Semantic/warning-border` | `rgba(169,90,0,0.3)` | `rgba(255,166,0,0.3)` |
| `Illustrative/color-1` … `color-31` | (see Illustrative table above) | |
| `Chart/chart-color_1` … `chart-color_12` | (see Chart table above) | |
| `Brand/selected-hover-background` | Brand-Blue-Toggle (`#D6E1F0`) | Neutrals/600 (`#353C4A`) |
| `Neutral/overlay` | `rgba(0,0,0,0.20)` | `rgba(0,0,0,0.50)` |
| `Semantic/warning-bg-transparent` | `rgba(254,245,200,0.00)` | `rgba(65,54,1,0.00)` |
| `Colors/Specific/Joule-Input-Gradient-Blue` | `#4295FF` | (foundation) |
| `Accent/accent-1` … `accent-bg-10` | (see Accent table above) | |
