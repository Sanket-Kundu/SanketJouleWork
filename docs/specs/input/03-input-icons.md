# Input Component - Icons and Clear Button

## Acceptance Criteria

- [x] `icon` prop accepts ReactNode to display icon inside input
- [x] Icon positioned at start (left in LTR, right in RTL) by default
- [x] `iconPosition` prop allows "start" or "end" positioning
- [x] `showClearIcon` prop shows clear button when input has value
- [x] Clear icon only visible when: value exists, not disabled, not readonly
- [x] Clicking clear icon clears value and fires onChange
- [x] Clear icon has proper accessible name for screen readers
- [x] Clear icon has hover/focus states
- [ ] Multiple icons supported via array (future enhancement)
- [x] Icons don't interfere with input text area
- [ ] Icon click events can be handled via icon's onClick

## Test Cases

1. **Icon at start**
   - Input: `<Input icon={<SearchIcon />} />`
   - Expected: Search icon visible at left side of input

2. **Icon at end**
   - Input: `<Input icon={<CalendarIcon />} iconPosition="end" />`
   - Expected: Calendar icon visible at right side of input

3. **Clear icon visibility**
   - Input: `<Input showClearIcon value="text" />`
   - Expected: X icon visible at end of input

4. **Clear icon hidden when empty**
   - Input: `<Input showClearIcon value="" />`
   - Expected: No clear icon visible

5. **Clear icon hidden when disabled**
   - Input: `<Input showClearIcon value="text" disabled />`
   - Expected: No clear icon visible

6. **Clear icon hidden when readonly**
   - Input: `<Input showClearIcon value="text" readonly />`
   - Expected: No clear icon visible

7. **Clear icon click**
   - Input: `<Input showClearIcon value="text" onChange={fn} />`
   - Action: Click clear icon
   - Expected: Value cleared, onChange called with empty string

8. **Clear icon accessibility**
   - Input: `<Input showClearIcon value="text" />`
   - Expected: Clear button has aria-label="Clear input"

9. **Clear icon keyboard**
   - Input: Focus clear icon, press Enter or Space
   - Expected: Value cleared

10. **Multiple icons**
    - Input: `<Input icon={[<Icon1 />, <Icon2 />]} />`
    - Expected: Both icons render in sequence

11. **Icon with input padding**
    - Input: `<Input icon={<SearchIcon />} />`
    - Expected: Text doesn't overlap with icon

12. **Clickable icon**
    - Input: `<Input icon={<SearchIcon onClick={fn} />} />`
    - Action: Click icon
    - Expected: fn is called

## Implementation Notes

- Use flexbox layout with icon wrapper elements
- Clear icon should use lucide-react X icon
- Padding adjustments based on icon presence
- Tab order: input first, then clear icon (if interactive)
- Clear icon should prevent event bubbling to avoid triggering form submit
