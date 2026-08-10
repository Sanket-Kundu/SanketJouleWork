# Spec 12: Shared Hooks & Utilities

## Overview
Create shared hooks and utilities used by both ComboBox and Select.

## Requirements

### useComboboxSelection Hook
- Manages selection state for both components
- Handles single selection logic
- Returns helper functions:
  - `selectOption(value)` - Select by value
  - `getSelectedOption()` - Get current selection
  - `isOptionSelected(value)` - Check if selected

### usePopover Hook
- Manages popover open/close state
- Handles focus management
- Returns:
  - `isOpen: boolean`
  - `open()`, `close()`, `toggle()`
  - `popoverRef` for positioning
  - `triggerRef` for focus return

### useTypeAhead Hook
- Character buffer with timeout
- Finds matching option
- Returns:
  - `handleKeyPress(char)` - Add character
  - `reset()` - Clear buffer

### useAnnounce Hook
- Screen reader announcements
- Uses aria-live region
- Polite mode for non-interrupting updates

### Utility Functions (in lib/)
- `filterItems(items, value, mode)` - Apply filter
- `getNextOption(items, current, direction)` - Navigation
- `findOptionByValue(items, value)` - Lookup

## Acceptance Criteria
- [ ] useComboboxSelection hook created in hooks/
- [ ] Hook handles selection state correctly
- [ ] usePopover hook manages open/close
- [ ] Popover handles focus trap and return
- [ ] useTypeAhead hook with 1-second timeout
- [ ] Type-ahead finds matching items
- [ ] useAnnounce hook for screen reader
- [ ] Announcements use aria-live region
- [ ] filterItems utility with all filter modes
- [ ] getNextOption handles wraparound
- [ ] findOptionByValue returns correct item
- [ ] All hooks exported from hooks/index.ts
- [ ] All utilities exported from lib/

**Output when complete:** `<promise>DONE</promise>`
