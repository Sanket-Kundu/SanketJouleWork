# Input Component - Keyboard Navigation

## Acceptance Criteria

- [x] Tab key moves focus to input
- [x] Shift+Tab moves focus away from input
- [x] Escape key reverts to value before focus (optional behavior)
- [x] Enter key fires onSubmit/triggers form submission
- [x] Home key moves cursor to start of input
- [x] End key moves cursor to end of input
- [x] Ctrl/Cmd+A selects all text
- [x] Clear icon reachable via Tab when visible
- [x] Enter/Space on clear icon clears value
- [x] Arrow keys move cursor within text
- [x] Standard text editing shortcuts work (Ctrl+C, Ctrl+V, etc.)
- [x] IME composition supported for Asian languages

## Test Cases

1. **Tab focus**
   - Action: Press Tab when input is next focusable element
   - Expected: Input receives focus

2. **Tab away**
   - Input: Input is focused
   - Action: Press Tab
   - Expected: Focus moves to next element

3. **Shift+Tab**
   - Input: Input is focused
   - Action: Press Shift+Tab
   - Expected: Focus moves to previous element

4. **Escape key**
   - Input: Input focused with modified value
   - Action: Press Escape
   - Expected: Value reverts to original (if feature enabled)

5. **Enter key**
   - Input: `<form><Input /></form>`
   - Action: Press Enter while focused
   - Expected: Form submits

6. **Enter key without form**
   - Input: `<Input onKeyDown={fn} />`
   - Action: Press Enter
   - Expected: onKeyDown receives Enter key event

7. **Home key**
   - Input: `<Input value="hello world" />` with cursor at end
   - Action: Press Home
   - Expected: Cursor moves to position 0

8. **End key**
   - Input: `<Input value="hello world" />` with cursor at start
   - Action: Press End
   - Expected: Cursor moves to end

9. **Select all**
   - Input: `<Input value="hello" />`
   - Action: Press Ctrl+A (Cmd+A on Mac)
   - Expected: All text selected

10. **Clear icon via Tab**
    - Input: `<Input showClearIcon value="text" />`
    - Action: Tab from input
    - Expected: Clear icon receives focus

11. **Clear via keyboard**
    - Input: Clear icon is focused
    - Action: Press Enter or Space
    - Expected: Value cleared, focus returns to input

12. **Arrow keys**
    - Input: `<Input value="hello" />`
    - Action: Press Left/Right arrows
    - Expected: Cursor moves within text

13. **IME composition**
    - Input: Type Japanese with IME
    - Expected: Composition handled correctly, no premature commits

14. **Disabled input**
    - Input: `<Input disabled />`
    - Action: Try to Tab to it
    - Expected: Input skipped in tab order

## Implementation Notes

- Use onKeyDown for keyboard handling
- Track `valueBeforeFocus` for Escape revert functionality
- IME: Monitor compositionstart, compositionend events
- Prevent default on Enter in inputs outside forms if needed
- Clear icon should receive focus only when visible
