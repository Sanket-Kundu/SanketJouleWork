# Input Component - Internationalization

## Acceptance Criteria

- [x] `locale` prop or context for locale-aware behavior
- [x] Placeholder text can be localized
- [x] Error messages can be localized
- [x] Clear icon accessible name localized ("Clear" in current language)
- [ ] Suggestion count announcements localized (pending suggestions feature)
- [x] RTL layout support for Arabic, Hebrew, etc.
- [x] Text direction auto-detected or settable via `dir` prop
- [x] Number formatting respects locale (decimal separator)
- [x] Date/time input respects locale formats
- [x] Keyboard shortcuts adapt to locale (Cmd vs Ctrl)

## Test Cases

1. **RTL layout**
   - Input: `<Input dir="rtl" />`
   - Expected: Input text aligned right, icon positions swapped

2. **RTL with icon**
   - Input: `<Input dir="rtl" icon={<SearchIcon />} />`
   - Expected: Icon on right side (start in RTL)

3. **RTL with clear icon**
   - Input: `<Input dir="rtl" showClearIcon value="text" />`
   - Expected: Clear icon on left side (end in RTL)

4. **Localized placeholder**
   - Input: `<Input placeholder={t("search_placeholder")} />`
   - Expected: Shows translated placeholder

5. **Localized value state message**
   - Input: `<Input valueState="Negative" valueStateMessage={t("invalid_email")} />`
   - Expected: Shows translated error message

6. **Localized clear icon label**
   - Context: German locale
   - Input: `<Input showClearIcon />`
   - Expected: Clear icon aria-label is "Löschen" (or localized)

7. **Suggestion count announcement - English**
   - Input: 1 suggestion available
   - Expected: Announces "1 suggestion available"

8. **Suggestion count announcement - plural**
   - Input: 5 suggestions available
   - Expected: Announces "5 suggestions available" (proper plural)

9. **Decimal separator - US**
   - Input: `<Input type="Number" locale="en-US" />`
   - Action: Type "3.14"
   - Expected: Accepts period as decimal separator

10. **Decimal separator - German**
    - Input: `<Input type="Number" locale="de-DE" />`
    - Action: Type "3,14"
    - Expected: Accepts comma as decimal separator

11. **CSS logical properties**
    - Input: Check all styles use logical properties
    - Expected: margin-inline-start instead of margin-left, etc.

12. **Keyboard shortcut text**
    - Context: Mac vs Windows
    - Expected: Tooltips show "Cmd" on Mac, "Ctrl" on Windows

13. **Mixed direction text**
    - Input: `<Input value="Hello שלום World" />`
    - Expected: Bidirectional text renders correctly

14. **Locale context**
    - Input: `<LocaleProvider locale="ja"><Input /></LocaleProvider>`
    - Expected: Input respects Japanese locale settings

## Implementation Notes

- Use CSS logical properties: `padding-inline-start`, `margin-inline-end`
- Detect Mac: `navigator.platform.includes('Mac')`
- Create i18n keys file for all user-facing strings
- Consider Intl API for number/date formatting
- RTL: use `[dir="rtl"]` selectors or logical properties
- Provide default English strings, allow override via context/props

## i18n String Keys

```typescript
const i18nKeys = {
  INPUT_CLEAR: "Clear input",
  INPUT_SUGGESTIONS_AVAILABLE: "{count} suggestions available",
  INPUT_SUGGESTIONS_ONE: "1 suggestion available",
  INPUT_SUGGESTIONS_NONE: "No suggestions",
  VALUE_STATE_ERROR: "Error",
  VALUE_STATE_WARNING: "Warning",
  VALUE_STATE_SUCCESS: "Success",
  VALUE_STATE_INFORMATION: "Information",
};
```
