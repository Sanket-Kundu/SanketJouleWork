# Input Component - Accessibility

## Acceptance Criteria

- [x] `accessibleName` prop sets aria-label on input
- [x] `accessibleNameRef` prop sets aria-labelledby on input
- [x] Associated `<label>` elements automatically linked
- [x] `aria-invalid="true"` when valueState is Negative
- [x] `aria-required="true"` when required prop is true
- [x] `aria-disabled="true"` when disabled prop is true
- [x] `aria-readonly="true"` when readonly prop is true
- [x] `aria-describedby` links to value state message when present
- [x] Input can be focused via Tab key
- [x] Focus visible indicator meets WCAG contrast requirements
- [x] Screen readers announce value state type (Error, Warning, etc.)
- [x] Clear icon has accessible name and role="button"
- [x] All interactive elements are keyboard accessible

## Test Cases

1. **Accessible name**
   - Input: `<Input accessibleName="Email address" />`
   - Expected: aria-label="Email address"

2. **Accessible name ref**
   - Input: `<label id="email-label">Email</label><Input accessibleNameRef="email-label" />`
   - Expected: aria-labelledby="email-label"

3. **Associated label**
   - Input: `<label><span>Email</span><Input /></label>`
   - Expected: Label click focuses input

4. **External label with htmlFor**
   - Input: `<label htmlFor="email">Email</label><Input id="email" />`
   - Expected: Label click focuses input

5. **Invalid state**
   - Input: `<Input valueState="Negative" />`
   - Expected: aria-invalid="true"

6. **Required state**
   - Input: `<Input required />`
   - Expected: aria-required="true"

7. **Disabled state**
   - Input: `<Input disabled />`
   - Expected: aria-disabled="true", not in tab order

8. **Readonly state**
   - Input: `<Input readonly />`
   - Expected: aria-readonly="true", still in tab order

9. **Described by message**
   - Input: `<Input valueState="Negative" valueStateMessage="Invalid" />`
   - Expected: aria-describedby points to message element ID

10. **Focus visibility**
    - Input: Tab to input
    - Expected: Clear focus ring visible (2px, proper contrast)

11. **Screen reader announcement**
    - Input: `<Input valueState="Negative" valueStateMessage="Email is invalid" />`
    - Expected: Screen reader announces "Error: Email is invalid"

12. **Clear icon accessibility**
    - Input: `<Input showClearIcon value="text" />`
    - Expected: Clear icon has role="button", aria-label="Clear input"

13. **Keyboard navigation**
    - Input: Tab through input with clear icon
    - Expected: Input focused first, then clear icon

14. **High contrast mode**
    - Input: View in Windows High Contrast Mode
    - Expected: All states visible with proper contrast

## Implementation Notes

- Use useId() hook for generating unique IDs
- Combine multiple aria-describedby values (message + other hints)
- Focus ring: `focus-visible:ring-2 focus-visible:ring-offset-2`
- Clear icon should be a button element with type="button"
- Consider aria-live region for dynamic announcements
