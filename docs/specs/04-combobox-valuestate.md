# Spec 04: ComboBox Value State & Validation

## Overview
Implement value state indicators and form validation support.

## Requirements

### Value States
- `None` (default) - No styling
- `Positive` (green) - Success state (no message popup)
- `Negative` (red) - Error state with message
- `Critical` (orange) - Warning state with message
- `Information` (blue) - Info state with message

### Value State Message
- `valueStateMessage` slot/prop for custom message
- Default localized messages per state
- Displayed in popover below input (desktop)
- Displayed in picker header (mobile)
- Icon indicates state type (error, warning, info icons)

### Value State Popover
- Auto-opens on focus (desktop only, if not readonly)
- Shows below input
- Can contain clickable links
- Closed by Tab, Escape, clicking outside

### Form Integration
- `name` prop for form submission
- `required` prop for validation
- Form validity: `valueMissing` if required and empty
- Works with HTML form validation

### Clear Icon
- `showClearIcon` prop to show X icon
- Visible when: has value, not readonly, not disabled
- Clicking clears value and fires `onInput`
- Focus returns to input after clear

## Acceptance Criteria
- [ ] ValueState enum with all 5 states
- [ ] Visual styling for each value state (border/background colors)
- [ ] `valueStateMessage` prop accepts ReactNode
- [ ] Value state popover shows on focus (non-Positive states)
- [ ] Value state icons displayed (Horizon theme style)
- [ ] Positive state does NOT show message popover
- [ ] `showClearIcon` prop shows clear button
- [ ] Clear icon clears value and fires callback
- [ ] Clear icon hidden when disabled/readonly/empty
- [ ] `name` and `required` props for form support
- [ ] Form validation message for required empty field
- [ ] Value state colors use Tailwind classes

**Output when complete:** `<promise>DONE</promise>`
