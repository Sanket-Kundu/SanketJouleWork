# Input Component - Events

## Acceptance Criteria

- [x] `onChange` fires when value changes and input loses focus
- [x] `onInput` fires on every keystroke/value change
- [x] `onFocus` fires when input receives focus
- [x] `onBlur` fires when input loses focus
- [x] `onKeyDown` fires on key press
- [x] `onKeyUp` fires on key release
- [x] Events include proper detail objects with value and metadata
- [x] Clear icon triggers onChange with empty value
- [x] Events fire in correct order: onInput → onChange (on blur)
- [x] Controlled mode: onChange provides new value for parent to use
- [x] Native events accessible via event.nativeEvent

## Test Cases

1. **onChange on blur**
   - Input: `<Input defaultValue="" onChange={fn} />`
   - Action: Type "hello", then blur
   - Expected: onChange called once with value "hello"

2. **onInput on typing**
   - Input: `<Input onInput={fn} />`
   - Action: Type "abc"
   - Expected: onInput called 3 times: "a", "ab", "abc"

3. **onFocus**
   - Input: `<Input onFocus={fn} />`
   - Action: Click on input
   - Expected: onFocus called with focus event

4. **onBlur**
   - Input: `<Input onBlur={fn} />`
   - Action: Focus input, then click elsewhere
   - Expected: onBlur called with blur event

5. **onKeyDown**
   - Input: `<Input onKeyDown={fn} />`
   - Action: Press "a" key
   - Expected: onKeyDown called with key="a"

6. **onKeyUp**
   - Input: `<Input onKeyUp={fn} />`
   - Action: Press and release "a" key
   - Expected: onKeyUp called with key="a"

7. **Event detail - onChange**
   - Input: `<Input onChange={fn} />`
   - Action: Type "new" and blur
   - Expected: fn receives { value: "new", previousValue: "" }

8. **Event detail - onInput**
   - Input: `<Input onInput={fn} />`
   - Action: Type "x"
   - Expected: fn receives "x" (current value)

9. **Clear icon triggers onChange**
   - Input: `<Input value="text" showClearIcon onChange={fn} />`
   - Action: Click clear icon
   - Expected: onChange called with value ""

10. **Event order**
    - Input: `<Input onInput={inputFn} onChange={changeFn} />`
    - Action: Type "a" then blur
    - Expected: onInput("a") fires first, then onChange({ value: "a" })

11. **Controlled mode events**
    - Input: `<Input value={state} onChange={setState} />`
    - Action: Type "x"
    - Expected: onChange called, parent updates state, input shows new value

12. **Native event access**
    - Input: `<Input onKeyDown={(e) => console.log(e.nativeEvent)} />`
    - Expected: Native KeyboardEvent accessible

13. **Prevent default**
    - Input: `<Input onKeyDown={(e) => e.preventDefault()} />`
    - Action: Press Enter
    - Expected: Default behavior prevented

14. **No onChange when value unchanged**
    - Input: `<Input defaultValue="same" onChange={fn} />`
    - Action: Focus, don't type, blur
    - Expected: onChange NOT called

## Implementation Notes

- Track `previousValue` for onChange detail
- Differentiate between user input and programmatic value changes
- Clear icon should focus input after clearing
- Consider debouncing onInput for performance-sensitive cases
- Use React's SyntheticEvent, expose nativeEvent
