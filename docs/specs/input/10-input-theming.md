# Input Component - Theming

## Acceptance Criteria

- [x] Input uses CSS variables for all colors
- [x] Input respects theme class on root element (.theme-dark, .theme-fiori, etc.)
- [x] All states have theme-aware colors (border, background, text, focus)
- [x] Value state colors themeable
- [x] Icon colors adapt to theme
- [x] Placeholder color adapts to theme
- [x] Disabled styling adapts to theme
- [x] Focus ring color themeable
- [x] Custom className prop merges without breaking themes
- [x] Tailwind dark mode class support (dark:)
- [ ] High contrast mode support

## Test Cases

1. **Default theme**
   - Input: `<Input />` (no theme class)
   - Expected: Light mode colors from :root variables

2. **Dark theme**
   - Input: `<div class="theme-dark"><Input /></div>`
   - Expected: Dark background, light text

3. **Fiori theme**
   - Input: `<div class="theme-fiori"><Input /></div>`
   - Expected: SAP Fiori brand colors

4. **Value state in dark theme**
   - Input: `<div class="theme-dark"><Input valueState="Negative" /></div>`
   - Expected: Red border visible against dark background

5. **Placeholder in dark theme**
   - Input: `<div class="theme-dark"><Input placeholder="Enter..." /></div>`
   - Expected: Muted light text for placeholder

6. **Disabled in dark theme**
   - Input: `<div class="theme-dark"><Input disabled /></div>`
   - Expected: Proper contrast, visible as disabled

7. **Focus ring in themes**
   - Input: Each theme, focus input
   - Expected: Focus ring uses theme's ring color

8. **Icon color adaptation**
   - Input: `<div class="theme-dark"><Input icon={<Icon />} /></div>`
   - Expected: Icon color matches theme foreground

9. **Custom className**
   - Input: `<Input className="my-custom-class" />`
   - Expected: Custom class applied, theme styles preserved

10. **Tailwind dark mode**
    - Input: `<html class="dark"><Input /></html>`
    - Expected: dark: variants apply

11. **CSS variable override**
    - Input: `<div style="--primary: 120 100% 50%"><Input /></div>`
    - Expected: Custom primary color applied

12. **High contrast mode (Windows)**
    - Input: Enable Windows High Contrast
    - Expected: Borders and focus visible with forced colors

13. **Border radius theming**
    - Input: `<div style="--radius: 1rem"><Input /></div>`
    - Expected: Input has 1rem border radius

14. **Multiple themes switching**
    - Input: Switch between themes dynamically
    - Expected: Colors update immediately

## CSS Variables Used

```css
/* Core colors */
--background: /* Input background */
--foreground: /* Text color */
--border: /* Default border color */
--input: /* Input-specific border color */
--ring: /* Focus ring color */
--muted: /* Disabled/readonly background */
--muted-foreground: /* Placeholder, disabled text */

/* Value states */
--destructive: /* Negative state */
--warning: /* Critical state (custom) */
--success: /* Positive state (custom) */
--info: /* Information state (custom) */

/* Sizing */
--radius: /* Border radius base */
```

## Implementation Notes

- Never use hardcoded colors - always CSS variables or Tailwind classes
- Use `hsl(var(--variable))` pattern for colors
- Support both `.theme-*` classes and Tailwind's `dark:` prefix
- Test all themes in Storybook or demo app
- Ensure color contrast meets WCAG AA (4.5:1 for text)
