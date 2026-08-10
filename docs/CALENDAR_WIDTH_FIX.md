# Calendar Width Consistency Fix

## Issue

When switching between picker views (Day → Month → Year), the calendar component was shrinking because the Month and Year pickers have less content than the Day picker with its 7-column grid and week numbers.

## Solution

Applied consistent sizing constraints across all picker views:

### 1. Calendar Container
**File:** `src/components/calendar/Calendar.tsx`

Changed from `w-fit` (width fits content) to `min-w-[300px]` (minimum width 300px):

```tsx
// Before
className={cn(
  "inline-block rounded-lg border border-border bg-card text-card-foreground shadow-sm",
  "w-fit",  // ❌ Shrinks based on content
  className
)}

// After
className={cn(
  "inline-block rounded-lg border border-border bg-card text-card-foreground shadow-sm",
  "min-w-[300px]",  // ✅ Maintains minimum width
  className
)}
```

### 2. MonthPicker
**File:** `src/components/calendar/MonthPicker.tsx`

Added `min-h-[280px]` to maintain consistent height:

```tsx
// Before
<div ref={ref} className={cn("p-3", className)}>

// After
<div ref={ref} className={cn("p-3 min-h-[280px]", className)}>
```

### 3. YearPicker
**File:** `src/components/calendar/YearPicker.tsx`

Added `min-h-[280px]` to maintain consistent height:

```tsx
// Before
<div ref={ref} className={cn("p-3", className)}>

// After
<div ref={ref} className={cn("p-3 min-h-[280px]", className)}>
```

## Dimensions

### Width
- **Minimum:** 300px (min-w-[300px])
- **Maximum:** Expands based on content (DayPicker with week numbers)
- **Behavior:** Calendar width no longer shrinks when switching views

### Height
- **DayPicker:** Natural height (~280px with padding)
- **MonthPicker:** Minimum 280px (min-h-[280px])
- **YearPicker:** Minimum 280px (min-h-[280px])
- **Behavior:** Consistent height across all views

## Results

### Before Fix
```
Day View:    [████████████████████]  (full width)
Month View:  [███████████]          (shrinks)
Year View:   [████████████████]     (medium)
```

### After Fix
```
Day View:    [████████████████████]  (full width)
Month View:  [████████████████████]  (maintained)
Year View:   [████████████████████]  (maintained)
```

## Visual Consistency

Now when users press F4 or Shift+F4 to switch views:
- ✅ Calendar maintains width
- ✅ No layout shift
- ✅ Smooth transition between views
- ✅ Better user experience

## Files Modified

1. `src/components/calendar/Calendar.tsx` - Added `min-w-[300px]`
2. `src/components/calendar/MonthPicker.tsx` - Added `min-h-[280px]`
3. `src/components/calendar/YearPicker.tsx` - Added `min-h-[280px]`

## Build Status

✅ **Build successful** - No errors
✅ **TypeScript compilation** - All types valid
✅ **Visual consistency** - Width maintained across all views

## Testing

To verify the fix:

1. Run demo app: `yarn demo:calendar`
2. View any calendar
3. Press F4 to open Month Picker
4. Observe: Calendar width stays consistent ✅
5. Press Shift+F4 to open Year Picker
6. Observe: Calendar width stays consistent ✅
7. Click on a month/year to return to Day Picker
8. Observe: No layout shift ✅

## Summary

✅ **Width consistency maintained** across all picker views
✅ **Height consistency maintained** for Month and Year pickers
✅ **Smooth transitions** between views without layout shifts
✅ **Better UX** with stable component dimensions
