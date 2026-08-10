# Input Component - Suggestions/Autocomplete

## Acceptance Criteria

- [x] `showSuggestions` prop enables suggestion dropdown
- [x] `suggestions` prop accepts array of suggestion items
- [x] Suggestions shown when input focused and has value
- [x] Suggestions filter as user types
- [x] `filter` prop controls filter mode: StartsWith, StartsWithPerTerm, Contains, None
- [x] `noTypeahead` prop disables auto-completion of first match
- [x] Arrow keys navigate through suggestions
- [x] Enter/click selects highlighted suggestion
- [x] Escape closes suggestions without selecting
- [x] Selected suggestion fills input value
- [x] `onSuggestionSelect` fires when suggestion chosen
- [x] `highlightMatch` prop highlights matching characters
- [x] Grouped suggestions supported
- [x] Custom suggestion rendering supported
- [ ] Mobile: suggestions in full-screen dialog (future enhancement)
- [ ] Virtualization for large suggestion lists (50+ items) (future enhancement)

## Test Cases

1. **Show suggestions**
   - Input: `<Input showSuggestions suggestions={["Apple", "Banana"]} />`
   - Action: Focus and type "a"
   - Expected: Dropdown shows "Apple"

2. **Filter StartsWith**
   - Input: `<Input filter="StartsWith" suggestions={["Apple", "Banana"]} />`
   - Action: Type "Ba"
   - Expected: Only "Banana" shown

3. **Filter Contains**
   - Input: `<Input filter="Contains" suggestions={["Apple", "Pineapple"]} />`
   - Action: Type "app"
   - Expected: Both shown (both contain "app")

4. **Filter None**
   - Input: `<Input filter="None" suggestions={["A", "B", "C"]} />`
   - Action: Type anything
   - Expected: All suggestions always shown

5. **Typeahead completion**
   - Input: `<Input showSuggestions suggestions={["Apple"]} />`
   - Action: Type "App"
   - Expected: Input shows "Apple" with "le" selected

6. **No typeahead**
   - Input: `<Input showSuggestions noTypeahead suggestions={["Apple"]} />`
   - Action: Type "App"
   - Expected: Input shows only "App"

7. **Arrow navigation**
   - Input: Suggestions open with items
   - Action: Press Arrow Down
   - Expected: First item highlighted

8. **Enter to select**
   - Input: Suggestion highlighted
   - Action: Press Enter
   - Expected: Value set, dropdown closes

9. **Click to select**
   - Input: Suggestions open
   - Action: Click on suggestion
   - Expected: Value set, dropdown closes

10. **Escape to close**
    - Input: Suggestions open
    - Action: Press Escape
    - Expected: Dropdown closes, value unchanged

11. **onSuggestionSelect**
    - Input: `<Input onSuggestionSelect={fn} suggestions={[...]} />`
    - Action: Select suggestion
    - Expected: fn called with selected item data

12. **Highlight matching**
    - Input: `<Input highlightMatch suggestions={["Apple"]} />`
    - Action: Type "App"
    - Expected: "App" portion of "Apple" is bold/highlighted

13. **Grouped suggestions**
    - Input: `<Input suggestions={[{ group: "Fruits", items: ["Apple"] }]} />`
    - Expected: Group header shown, not selectable

14. **Custom rendering**
    - Input: `<Input suggestionRenderer={(item) => <Custom />} />`
    - Expected: Custom component rendered for each suggestion

15. **Mobile dialog**
    - Input: View on mobile viewport
    - Action: Focus input
    - Expected: Suggestions in full-screen dialog with OK/Cancel

16. **Large list virtualization**
    - Input: `<Input suggestions={arrayOf1000Items} />`
    - Expected: Only visible items rendered, smooth scrolling

17. **Scroll event**
    - Input: `<Input onSuggestionScroll={fn} suggestions={manyItems} />`
    - Action: Scroll suggestion list
    - Expected: fn called with scroll position

18. **No suggestions message**
    - Input: `<Input showSuggestions suggestions={[]} />`
    - Action: Type text
    - Expected: "No suggestions" message or dropdown hidden

## Implementation Notes

- Reuse patterns from ComboBox component
- Use @tanstack/react-virtual for large lists
- Filter functions should be memoized
- Typeahead: select from cursor to end of completed text
- Debounce filter for performance
- Mobile detection: matchMedia("(max-width: 768px)")
