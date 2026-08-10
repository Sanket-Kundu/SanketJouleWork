# Spec 02: ComboBox Keyboard Navigation

## Overview
Implement full keyboard navigation for ComboBox following UI5 patterns.

## Requirements

### Picker Open/Close Keys
- `F4` - Toggle picker open/closed
- `Alt+Up` / `Alt+Down` - Toggle picker
- `Escape` - Close picker (if open); reset value to previous (if closed)
- `Enter` / `Return` - Select focused item and close picker

### Item Navigation (picker open)
- `ArrowDown` - Focus next item; skip group headers
- `ArrowUp` - Focus previous item; skip group headers
- `PageDown` - Skip 10 items forward
- `PageUp` - Skip 10 items backward
- `Home` - Focus first item
- `End` - Focus last item

### Item Navigation (picker closed)
- `ArrowDown` - Select next matching item
- `ArrowUp` - Select previous matching item
- `PageDown` - Select item 10 positions forward
- `PageUp` - Select item 10 positions backward

### Tab Navigation
- `Tab` - Close picker and move to next focusable element
- `Shift+Tab` - Close picker and move to previous element

### State Management
- Track `focusedIndex` for keyboard navigation
- Track `lastValue` for escape key reset
- Distinguish between keyboard navigation and typing

## Acceptance Criteria
- [ ] F4 toggles picker visibility
- [ ] Alt+Arrow toggles picker
- [ ] Escape closes picker
- [ ] Escape (closed) resets to last committed value
- [ ] Enter selects focused item
- [ ] ArrowDown/Up navigates items when open
- [ ] ArrowDown/Up selects items when closed
- [ ] PageDown/Up skips 10 items
- [ ] Home/End navigates to first/last item
- [ ] Tab closes picker and moves focus
- [ ] Group headers are skipped during navigation
- [ ] Focus indicator visible on current item
- [ ] Keyboard shortcuts documented via aria-keyshortcuts

**Output when complete:** `<promise>DONE</promise>`
