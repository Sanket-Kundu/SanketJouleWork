# Spec 09: Select Keyboard & Type-Ahead

## Overview
Implement keyboard navigation and type-ahead search for Select.

## Requirements

### Keyboard (Dropdown Closed)
- `F4` / `Alt+Up` / `Alt+Down` - Open dropdown
- `Space` / `Enter` - Open dropdown
- `ArrowUp` / `ArrowDown` - Select prev/next option (without opening)
- `Home` / `End` - Select first/last option
- Letter keys - Type-ahead search

### Keyboard (Dropdown Open)
- `ArrowUp` / `ArrowDown` - Focus prev/next option
- `Home` / `End` - Focus first/last option
- `Enter` / `Space` - Confirm focused option
- `Escape` - Close and revert selection
- `Tab` - Close dropdown

### Type-Ahead Search
- Typing letters searches for matching option
- Same character repeated (e.g., "aaa") searches for "a"
- Different characters build search string (e.g., "ab")
- 1 second timeout clears typed buffer
- Cycles through matching options

### Live Change vs Change
- `onLiveChange` - Fires during keyboard navigation (preview)
- `onChange` - Fires on final selection (Enter, click)

### Focus Management
- Focus trap inside dropdown when open
- Return focus to Select on close
- Visual focus indicator on options

## Acceptance Criteria
- [ ] F4/Alt+Arrow/Space/Enter opens dropdown
- [ ] Arrow keys navigate options when closed
- [ ] Arrow keys navigate options when open
- [ ] Home/End navigate to first/last
- [ ] Enter/Space confirms selection
- [ ] Escape closes and reverts
- [ ] Tab closes dropdown
- [ ] Type-ahead finds matching option
- [ ] Repeated character cycles through matches
- [ ] 1-second timeout clears type buffer
- [ ] `onLiveChange` fires on keyboard navigation
- [ ] `onChange` fires on final selection
- [ ] Focus returns to Select after close

**Output when complete:** `<promise>DONE</promise>`
