# Spec 09: Theming & CSS Variables

## Overview
Set up the CSS custom properties that illustration SVGs use for theming, with sensible defaults that work with the existing Tailwind/shadcn theme.

## Requirements

### CSS Custom Properties
UI5 illustrations use `var(--sapContent_Illustrative_Color1)` through `var(--sapContent_Illustrative_Color25)` in SVG `fill` attributes. These need to be defined with defaults so illustrations render correctly out of the box.

### Define Defaults
Create a CSS file or style block that defines all illustration color variables. The defaults should map to the existing theme palette:

```css
:root {
  --sapContent_Illustrative_Color1: hsl(var(--primary));
  --sapContent_Illustrative_Color2: hsl(var(--primary) / 0.7);
  --sapContent_Illustrative_Color3: hsl(var(--accent));
  --sapContent_Illustrative_Color4: hsl(var(--muted-foreground) / 0.4);
  --sapContent_Illustrative_Color5: hsl(var(--muted) / 0.7);
  --sapContent_Illustrative_Color6: hsl(var(--muted) / 0.5);
  --sapContent_Illustrative_Color7: hsl(var(--background));
  --sapContent_Illustrative_Color8: hsl(var(--muted));
  /* ... through Color25 */
}
```

### Location Options
- Option A: Add to `src/components/illustrated-message/illustrated-message.css` and import in the component
- Option B: Add to `packages/illustrations/src/illustration-theme.css` in the illustrations package
- Preferred: Option A (stays with the component that uses it)

### Override Support
- All variables should be overridable at any CSS scope
- Consumers can set `--sapContent_Illustrative_Color*` on any parent element to customize
- SAP theme variables (sap_horizon, sap_fiori_3) can be loaded to get exact SAP theming

### Dark Mode
- The defaults should work reasonably in both light and dark mode since they use Tailwind CSS variables that already adapt
- No special dark mode handling needed beyond what the theme provides

## Acceptance Criteria
- [ ] All 25 `--sapContent_Illustrative_Color*` variables are defined with defaults
- [ ] Defaults map to existing theme palette (primary, accent, muted, etc.)
- [ ] Illustrations render with visible, sensible colors without any extra setup
- [ ] Variables are overridable at any CSS scope
- [ ] Works in both light and dark mode (via theme CSS variables)
- [ ] CSS is loaded when IllustratedMessage component is imported
- [ ] No visual regression for other components (variables scoped appropriately)

## Test Cases

1. **Default rendering**
   - Render a Fiori illustration with no custom CSS
   - Expected: Illustration shows with theme-appropriate colors

2. **Custom override**
   - Set `--sapContent_Illustrative_Color1: red` on a parent div
   - Expected: Primary color in illustration changes to red

3. **Dark mode**
   - Switch theme to dark mode
   - Expected: Illustration colors adapt automatically

**Output when complete:** `<promise>DONE</promise>`
