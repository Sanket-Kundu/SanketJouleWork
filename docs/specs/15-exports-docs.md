# Spec 15: Exports, Documentation & Demo

## Overview
Finalize exports, create documentation, and build demo page.

## Requirements

### Main Index Exports
Update `src/index.ts` to export:
- All ComboBox components
- All Select components
- ComboSelect unified component
- All types and enums
- All hooks

### Package.json Updates
- Ensure entry points cover new components
- Add to tsup config if needed

### Demo Page
Create demo HTML/React page showing:
- Basic ComboBox with items
- ComboBox with groups
- ComboBox with value states
- ComboBox filtering modes
- Select basic usage
- Select with icons
- ComboSelect in both modes
- Mobile responsive behavior

### README Documentation
Update README.md with:
- ComboBox API reference
- Select API reference
- ComboSelect API reference
- Keyboard shortcuts table
- Accessibility features list
- Usage examples
- Styling customization guide

### Storybook Stories (if applicable)
- ComboBox stories
- Select stories
- Interactive playground

## Acceptance Criteria
- [ ] All components exported from main index.ts
- [ ] All types exported from main index.ts
- [ ] All hooks exported from hooks/index.ts
- [ ] Demo page created showing all features
- [ ] Demo includes value state examples
- [ ] Demo includes grouping examples
- [ ] Demo includes mobile view
- [ ] README has ComboBox documentation
- [ ] README has Select documentation
- [ ] README has ComboSelect documentation
- [ ] Keyboard shortcuts documented
- [ ] Accessibility features documented
- [ ] TypeScript compiles without errors
- [ ] Package builds successfully

**Output when complete:** `<promise>DONE</promise>`
