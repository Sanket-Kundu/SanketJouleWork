# Input Component - Core Implementation

## Acceptance Criteria

- [x] Input renders as a standard text input with proper styling
- [x] Supports all input types: Text, Email, Number, Password, Tel, URL, Search
- [x] Controlled mode: `value` prop controls the input value
- [x] Uncontrolled mode: `defaultValue` sets initial value, internal state manages updates
- [x] `disabled` prop prevents all interaction and shows disabled styling
- [x] `readonly` prop prevents editing but allows focus and selection
- [x] `required` prop marks input as required for form validation
- [x] `placeholder` prop shows hint text when empty
- [x] `name` prop integrates with HTML forms
- [x] `maxLength` prop limits character count (except for Number type)
- [x] `id` prop passed to native input element
- [x] `className` prop merges with component classes
- [x] `ref` forwarded to native input element (via InputRef interface)
- [x] Component has displayName "Input"

## Test Cases

1. **Basic rendering**
   - Input: `<Input />`
   - Expected: Renders empty text input with default styling

2. **Controlled value**
   - Input: `<Input value="hello" onChange={fn} />`
   - Expected: Shows "hello", calls onChange on typing

3. **Uncontrolled value**
   - Input: `<Input defaultValue="initial" />`
   - Expected: Shows "initial", updates internally on typing

4. **Input types**
   - Input: `<Input type="Password" />`
   - Expected: Renders password input with masked characters

5. **Disabled state**
   - Input: `<Input disabled />`
   - Expected: Not focusable, 50% opacity, cursor-not-allowed

6. **Readonly state**
   - Input: `<Input readonly value="fixed" />`
   - Expected: Focusable, selectable, but not editable

7. **Placeholder**
   - Input: `<Input placeholder="Enter text..." />`
   - Expected: Shows placeholder in muted color when empty

8. **Max length**
   - Input: `<Input maxLength={10} />`
   - Expected: Cannot type more than 10 characters

9. **Form integration**
   - Input: `<form><Input name="email" required /></form>`
   - Expected: Input participates in form submission

10. **Ref forwarding**
    - Input: `const ref = useRef(); <Input ref={ref} />`
    - Expected: ref.current is the native input element

## Implementation Notes

- Use `React.forwardRef` for ref forwarding
- Map InputType enum to lowercase native type attribute
- Number type should ignore maxLength prop
- Use Tailwind's `disabled:` variants for disabled styling
