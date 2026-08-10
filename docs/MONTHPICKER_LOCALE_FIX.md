# MonthPicker Localization Fix

## Issue

The MonthPicker component was displaying English month names ("Jan", "Feb", "Mar", etc.) regardless of the selected locale. This was because the `getMonthName()` function was being called without the `locale` parameter.

## Root Cause

In `MonthPicker.tsx` line 122:
```tsx
const monthName = getMonthName(date, "short");
// Missing locale parameter! ❌
```

The `locale` prop was not defined in the `MonthPickerProps` interface, and the component was not accepting or using the locale.

## Solution

### 1. Added locale prop to MonthPickerProps interface

```tsx
interface MonthPickerProps {
  // ... existing props

  /** Locale code (e.g., 'en-US', 'ja-JP') */
  locale?: string;

  // ... rest of props
}
```

### 2. Updated MonthPicker to accept and use locale

```tsx
export const MonthPicker = React.forwardRef<HTMLDivElement, MonthPickerProps>(
  (
    {
      currentYear,
      focusedMonth,
      selectedMonth,
      onSelectMonth,
      onFocusChange,
      locale,  // ✅ Added locale parameter
      className,
    },
    ref
  ) => {
    // ... component logic

    // Now passes locale to getMonthName
    const monthName = getMonthName(date, "short", locale);  // ✅ Fixed
  }
);
```

### 3. Updated Calendar.tsx to pass locale to MonthPicker

```tsx
{currentView === CalendarPickerView.Month && (
  <MonthPicker
    currentYear={getYear(displayedDate)}
    focusedMonth={getMonth(focusDate)}
    selectedMonth={getMonth(displayedDate)}
    locale={locale}  // ✅ Added locale prop
    onSelectMonth={handleMonthSelect}
    onFocusChange={(month) => {
      const newDate = createDate(getYear(displayedDate), month);
      setFocusDate(newDate);
    }}
  />
)}
```

## Result

Now when users switch locales, the MonthPicker displays localized month names:

- **English (en-US)**: Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec
- **Japanese (ja-JP)**: 1月, 2月, 3月, 4月, 5月, 6月, 7月, 8月, 9月, 10月, 11月, 12月
- **German (de-DE)**: Jan., Feb., März, Apr., Mai, Juni, Juli, Aug., Sept., Okt., Nov., Dez.
- **Arabic (ar-SA)**: يناير, فبراير, مارس, أبريل, مايو, يونيو, يوليو, أغسطس, سبتمبر, أكتوبر, نوفمبر, ديسمبر
- **French (fr-FR)**: janv., févr., mars, avr., mai, juin, juil., août, sept., oct., nov., déc.

## Files Modified

1. `src/components/calendar/MonthPicker.tsx`
   - Added `locale?: string` to props interface
   - Destructured `locale` from props
   - Passed `locale` to `getMonthName(date, "short", locale)`

2. `src/components/calendar/Calendar.tsx`
   - Added `locale={locale}` prop when rendering `<MonthPicker>`

## Testing

✅ Build successful - No TypeScript errors
✅ Month names now localize correctly when switching locales
✅ All 30+ locales supported in MonthPicker
✅ RTL locales (Arabic, Hebrew) also work correctly

## Verification Steps

1. Run demo app: `yarn demo:calendar`
2. Switch to "Japanese (日本語)" locale
3. Press F4 to open Month Picker
4. Verify months show as: 1月, 2月, 3月, etc.
5. Switch to "Arabic (العربية)" locale
6. Press F4 to open Month Picker
7. Verify months show in Arabic script

## Status

✅ **FIXED** - MonthPicker now fully localized across all 30+ supported locales!
