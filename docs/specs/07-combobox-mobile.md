# Spec 07: ComboBox Mobile Support

## Overview
Implement mobile-specific behavior and full-screen dialog mode.

## Requirements

### Mobile Detection
- Use media query or viewport detection
- `isMobile` state for conditional rendering

### Mobile Picker (Full-Screen Dialog)
- Converts to full-screen dialog on mobile
- Header with:
  - Title: "Suggestions"
  - Close button (X icon)
  - Search input field
  - Value state message (if applicable)
- Footer with:
  - OK button (primary/emphasized)
  - Cancel button (secondary)

### Mobile Input Behavior
- Tap on input opens dialog
- Separate input inside dialog for filtering
- Mobile keyboard appears on open
- Main input shows selected value only

### Mobile Events
- Item click selects and closes
- OK button confirms selection
- Cancel button reverts to previous value
- Escape reverts and closes

### Mobile Value State
- Displayed in dialog header (not separate popover)
- Icon + message at top of dialog

## Acceptance Criteria
- [ ] Mobile detection via media query (< 768px or touch device)
- [ ] Full-screen dialog on mobile instead of popover
- [ ] Dialog header with title and close button
- [ ] Search input in dialog header
- [ ] Dialog footer with OK/Cancel buttons
- [ ] OK confirms current selection
- [ ] Cancel reverts to previous selection
- [ ] Item tap selects and closes
- [ ] Value state shows in dialog header
- [ ] Main input only shows value (no editing on mobile)
- [ ] Proper mobile keyboard handling
- [ ] Dialog uses Tailwind for responsive styling

**Output when complete:** `<promise>DONE</promise>`
