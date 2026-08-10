# Spec 11: Select Accessibility & Value State

## Overview
Implement full accessibility and value state support for Select.

## Requirements

### ARIA Attributes
- `role="combobox"` on the Select display element
- `aria-haspopup="listbox"` - Indicates list popup
- `aria-expanded` - Dropdown state
- `aria-controls` - Points to listbox
- `aria-label` / `aria-labelledby` - Accessible name
- `aria-describedby` - Value state message
- `aria-disabled` - Disabled state
- `aria-required` - Required state
- `aria-readonly` - Readonly state

### Listbox ARIA
- `role="listbox"` on options container
- `role="option"` on each option
- `aria-selected` on selected option

### Accessibility Props
- `accessibleName: string` - Direct label
- `accessibleNameRef: string` - Label element reference
- `accessibleDescription: string` - Description text
- `accessibleDescriptionRef: string` - Description element reference

### Value State
- Same states as ComboBox (None, Positive, Negative, Critical, Information)
- Value state message slot/prop
- Desktop: Popover below Select
- Mobile: In dialog header

### Screen Reader
- Announce "Item X of Y" on navigation
- Announce selection changes
- Announce value state

## Acceptance Criteria
- [ ] role="combobox" on Select element
- [ ] aria-haspopup="listbox" present
- [ ] aria-expanded reflects dropdown state
- [ ] aria-controls links to listbox
- [ ] aria-label from accessibleName
- [ ] aria-labelledby from accessibleNameRef
- [ ] aria-describedby links to value state
- [ ] Listbox has role="listbox"
- [ ] Options have role="option"
- [ ] Selected option has aria-selected="true"
- [ ] Value state visual styling
- [ ] Value state message popover (desktop)
- [ ] "Item X of Y" announced
- [ ] Selection changes announced

**Output when complete:** `<promise>DONE</promise>`
