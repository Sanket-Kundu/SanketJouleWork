# Spec 06: ComboBox Item Features

## Overview
Implement full ComboBoxItem and ComboBoxItemGroup features.

## Requirements

### ComboBoxItem Props
- `text: string` - Main display text (or children)
- `additionalText: string` - Secondary column text
- `value: string` - Value for form submission (defaults to text)
- `icon: string` - Icon name from lucide-react
- `selected: boolean` - Selection state
- `disabled: boolean` - Item cannot be selected

### Item Rendering
- Two-column layout: text + additionalText
- Icon displayed before text (optional)
- Disabled items visually muted and not selectable
- Hover/focus states with Tailwind

### ComboBoxItemGroup Props
- `headerText: string` - Group header display
- `children` - ComboBoxItem children

### Group Behavior
- Visual separator/header styling
- Not selectable (keyboard skips over)
- Hidden if all children filtered out
- Announces "Group header: [text]" to screen readers

### Item States
- Default (unselected, unfocused)
- Focused (keyboard navigation)
- Selected (currently selected value)
- Disabled (cannot select)
- Hover (mouse interaction)

## Acceptance Criteria
- [ ] ComboBoxItem renders text content
- [ ] additionalText displays in second column
- [ ] icon prop renders icon before text
- [ ] value prop used for selection (falls back to text)
- [ ] disabled items are visually muted
- [ ] disabled items cannot be selected via click/keyboard
- [ ] ComboBoxItemGroup renders header
- [ ] Group headers not selectable
- [ ] Groups hidden when all children filtered
- [ ] Hover state styling with Tailwind
- [ ] Focus state with visible ring/outline
- [ ] Selected state with primary background
- [ ] CVA variants for all states

**Output when complete:** `<promise>DONE</promise>`
