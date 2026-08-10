# Spec 13: Combined ComboSelect Component

## Overview
Create a unified component that combines ComboBox and Select behavior based on props.

## Requirements

### ComboSelect Props
- `mode: "combobox" | "select"` - Component behavior mode
- Inherits all props from ComboBox and Select
- Smart defaults based on mode

### Mode: "combobox"
- Text input enabled
- Filtering enabled
- Type-ahead autocomplete
- Can enter custom values

### Mode: "select"
- No text input (display only)
- No filtering
- Character type-ahead search
- Fixed options only

### Shared Features
- Same popover behavior
- Same keyboard navigation (with mode differences)
- Same value state support
- Same accessibility features
- Same mobile behavior

### API Design
```tsx
// As ComboBox
<ComboSelect mode="combobox" filter="Contains" noTypeahead>
  <ComboSelectItem>Option 1</ComboSelectItem>
</ComboSelect>

// As Select
<ComboSelect mode="select">
  <ComboSelectItem>Option 1</ComboSelectItem>
</ComboSelect>
```

## Acceptance Criteria
- [ ] ComboSelect component created
- [ ] `mode="combobox"` shows text input
- [ ] `mode="select"` shows display-only
- [ ] ComboBox features work in combobox mode
- [ ] Select features work in select mode
- [ ] Shared popover component used
- [ ] Shared keyboard navigation (mode-aware)
- [ ] Value state works in both modes
- [ ] Accessibility complete in both modes
- [ ] Mobile behavior works in both modes
- [ ] ComboSelectItem works for both modes
- [ ] TypeScript properly typed for both modes

**Output when complete:** `<promise>DONE</promise>`
