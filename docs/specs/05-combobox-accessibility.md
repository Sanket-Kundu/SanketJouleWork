# Spec 05: ComboBox Accessibility

## Overview
Implement full WCAG AA accessibility for ComboBox.

## Requirements

### ARIA Attributes
- `role="combobox"` on input element
- `aria-expanded="true/false"` - Picker open state
- `aria-haspopup="listbox"` - Indicates list popup
- `aria-autocomplete="both"` - Supports input and suggestions
- `aria-describedby` - Links to value state message
- `aria-label` / `aria-labelledby` - Accessible name
- `aria-required` - Required state
- `aria-controls` - Points to popover ID
- `aria-activedescendant` - Points to focused option

### Item ARIA
- `role="listbox"` on list container
- `role="option"` on each item
- `aria-selected` on selected item
- `role="group"` on group containers
- `aria-label` on groups with header text

### Screen Reader Announcements
- Announce item selection: "Item X of Y"
- Announce group headers: "Group header: [text]"
- Announce value state: "Error", "Warning", etc.
- Announce when picker opens with item count

### Accessibility Props
- `accessibleName: string` - Direct ARIA label
- `accessibleNameRef: string` - Reference to labeling element

### Keyboard Shortcut Documentation
- `aria-keyshortcuts` on relevant elements
- F4, Arrow keys, Enter documented

## Acceptance Criteria
- [ ] Input has role="combobox"
- [ ] aria-expanded reflects picker state
- [ ] aria-haspopup="listbox" present
- [ ] aria-autocomplete="both" present
- [ ] aria-describedby links to value state
- [ ] aria-controls links to popover
- [ ] aria-activedescendant updates on navigation
- [ ] List has role="listbox"
- [ ] Items have role="option"
- [ ] Selected item has aria-selected="true"
- [ ] Groups have role="group" with aria-label
- [ ] accessibleName prop sets aria-label
- [ ] accessibleNameRef prop sets aria-labelledby
- [ ] Screen reader announces selections
- [ ] Keyboard shortcuts documented

**Output when complete:** `<promise>DONE</promise>`
