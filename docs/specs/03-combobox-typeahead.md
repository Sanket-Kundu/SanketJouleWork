# Spec 03: ComboBox Type-Ahead & Filtering

## Overview
Implement type-ahead (autocomplete) functionality and all filter modes.

## Requirements

### Filter Modes
1. **StartsWithPerTerm** (default) - Match first letter of each word
2. **StartsWith** - Match at beginning only
3. **Contains** - Match anywhere in text
4. **None** - No filtering (for lazy loading)

### Type-Ahead Behavior
- Enabled by default (can disable with `noTypeahead` prop)
- On character input, find first matching item
- Auto-complete text in input with selection highlight
- Selected portion shown in lighter color (selection range)
- User can accept (Enter) or continue typing (overrides)

### Type-Ahead Disabled Conditions
- `noTypeahead={true}` prop
- Backspace/Delete operations
- IME composition active

### Filter Logic
- Track `filterValue` separately from display `value`
- Auto-open picker on typing (if matches found)
- Auto-close picker if no matches (desktop)
- Items marked as `isVisible` based on filter

### Item Visibility
- Filtering sets `isVisible` on each item
- Group visible if ANY child item visible
- Non-matching items hidden but remain in DOM

## Acceptance Criteria
- [ ] `noTypeahead` prop disables autocomplete
- [ ] StartsWithPerTerm filter works correctly
- [ ] StartsWith filter works correctly
- [ ] Contains filter works correctly
- [ ] None filter shows all items always
- [ ] Type-ahead completes text in input
- [ ] Selection highlight shows autocompleted portion
- [ ] Backspace does not trigger type-ahead
- [ ] Picker auto-opens on typing with matches
- [ ] Picker closes when no matches (desktop)
- [ ] Groups hidden when all children filtered out
- [ ] `filterValue` tracked separately from `value`
- [ ] Filter is case-insensitive

**Output when complete:** `<promise>DONE</promise>`
