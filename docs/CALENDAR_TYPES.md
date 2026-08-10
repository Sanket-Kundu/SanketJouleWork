# Calendar Types and Internationalization

## Current Support

The shadcn-ui5 Calendar currently supports **Gregorian calendar** with the following internationalization features:

✅ **Supported:**
- RTL (Right-to-Left) layout for Arabic, Hebrew, etc.
- Date formatting via date-fns (supports 100+ locales)
- Week numbering schemes (ISO 8601, Western, Middle Eastern)
- Customizable first day of week

## Calendar Types Not Yet Implemented

The UI5 Web Components Calendar supports multiple calendar types:
- Buddhist calendar
- Islamic (Hijri) calendar
- Japanese calendar (with era-based years: Reiwa 令和, Heisei 平成, etc.)
- Persian calendar

These are **not yet implemented** in shadcn-ui5 but could be added in the future.

## How UI5 Implements Calendar Types

UI5 uses the `@ui5/webcomponents-localization` package which provides:
1. Calendar type conversion (Gregorian ↔ Japanese/Islamic/etc.)
2. Era-based year formatting (e.g., "Reiwa 4" instead of "2022")
3. Locale-specific month names for each calendar type
4. Date arithmetic respecting calendar rules

## Adding Calendar Type Support

To add Japanese/Islamic/Buddhist/Persian calendar support, we would need to:

### Option 1: Use Intl.DateTimeFormat
```typescript
// Japanese calendar with eras
const formatter = new Intl.DateTimeFormat('ja-JP-u-ca-japanese', {
  era: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

// Example output: "令和4年12月25日" (Reiwa 4, December 25)
```

**Pros:**
- Built into JavaScript (no dependencies)
- Supports Japanese, Buddhist, Islamic, Persian, Hebrew calendars
- Proper era handling

**Cons:**
- Limited date arithmetic support
- Would need to mix with date-fns for calculations
- Era boundaries require special handling

### Option 2: Use date-fns with Custom Calendar Logic
```typescript
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

// Format with Japanese locale
format(date, 'yyyy年MM月dd日', { locale: ja });
// Output: "2022年12月25日"

// But this doesn't convert to Japanese calendar eras
// Would need custom era conversion
```

**Pros:**
- Already using date-fns
- Good for date arithmetic

**Cons:**
- Doesn't handle non-Gregorian calendars
- Would need custom era conversion logic
- More complex implementation

### Option 3: Use a Specialized Library
```typescript
// Example: moment-hijri for Islamic calendar
import moment from 'moment-hijri';
moment('2022-12-25', 'YYYY-MM-DD').format('iYYYY/iMM/iDD');
// Output: "1444/06/02" (Hijri date)
```

**Pros:**
- Purpose-built for specific calendars
- Handles all edge cases

**Cons:**
- Additional dependencies (moment-hijri, etc.)
- Would need different libraries for each calendar type
- Larger bundle size

## Recommended Approach

For full calendar type support, I recommend:

1. **Use Intl.DateTimeFormat for display** (no dependencies)
2. **Use date-fns for date arithmetic** (already included)
3. **Add calendar type prop to Calendar component:**

```tsx
<Calendar
  calendarType="Japanese"  // or "Buddhist", "Islamic", "Persian"
  locale="ja-JP"
  // ... other props
/>
```

4. **Implement converter utilities:**

```typescript
// src/lib/calendar-converters.ts

export function formatDateForCalendar(
  date: Date,
  calendarType: 'Gregorian' | 'Japanese' | 'Islamic' | 'Buddhist' | 'Persian',
  locale: string
): string {
  const calendar = calendarType.toLowerCase();

  return new Intl.DateTimeFormat(locale, {
    calendar,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...(calendarType === 'Japanese' && { era: 'long' })
  }).format(date);
}
```

## Example: Japanese Calendar Demo

If we implement calendar types, the demo would show:

```tsx
// Gregorian calendar
<Calendar calendarType="Gregorian" />
// Shows: "December 2024"

// Japanese calendar
<Calendar calendarType="Japanese" locale="ja-JP" />
// Shows: "令和6年 12月" (Reiwa 6, December)

// Islamic calendar
<Calendar calendarType="Islamic" locale="ar-SA" />
// Shows: "جمادى الآخرة 1446" (Jumada al-Akhirah 1446)
```

## Current Workaround

For now, you can use locale formatting for month/day names:

```tsx
// Japanese month names (but Gregorian calendar)
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

format(new Date(), 'yyyy年M月', { locale: ja });
// Output: "2024年12月" (December 2024 in Japanese)
```

But this still uses Gregorian year numbers, not Japanese eras.

## Contribution Welcome!

Adding calendar type support would be a great contribution. The implementation would need:
- [ ] CalendarType enum in types
- [ ] Calendar conversion utilities
- [ ] Updated DayPicker to use calendar-aware dates
- [ ] Updated MonthPicker with calendar-specific month names
- [ ] Updated YearPicker with era support (for Japanese)
- [ ] Tests for calendar conversions
- [ ] Demo examples for each calendar type

See the original UI5 implementation for reference:
- `@ui5/webcomponents-localization/dist/features/calendar/Japanese.js`
- `packages/localization/src/sap/ui/core/date/` (conversion logic)
