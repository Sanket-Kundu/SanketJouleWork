# Spec 04: Responsive Breakpoints (useIllustrationSize)

## Overview
Implement the `useIllustrationSize` hook that provides responsive size resolution for the IllustratedMessage component using ResizeObserver on the container element.

## Requirements

### Hook: `useIllustrationSize`
- Create `src/components/illustrated-message/useIllustrationSize.ts`
- Signature: `useIllustrationSize(containerRef: RefObject<HTMLDivElement | null>, design: IllustrationDesign): IllustrationSize`

### Auto Mode Behavior
When `design` is `Auto`, observe the container's width:
- Width > 681px -> `Scene`
- Width <= 681px -> `Dialog`
- Width <= 360px -> `Spot`
- Width <= 260px -> `Dot`
- Width <= 160px -> `Base`

### Fixed Mode Behavior
When `design` is NOT `Auto`, resolve aliases directly:
- `ExtraSmall` / `Dot` -> `IllustrationSize.Dot`
- `Small` / `Spot` -> `IllustrationSize.Spot`
- `Medium` / `Dialog` -> `IllustrationSize.Dialog`
- `Large` / `Scene` -> `IllustrationSize.Scene`
- `Base` -> `IllustrationSize.Base`

### SSR Safety
- Guard `ResizeObserver` with `typeof ResizeObserver !== 'undefined'`
- Default to `IllustrationSize.Dialog` when ResizeObserver is not available

### Performance
- Use `ResizeObserver` (not window resize event)
- Observe only the container element
- Clean up observer on unmount
- Avoid unnecessary re-renders (only update state when size actually changes)

### Integration with IllustratedMessage
The hook is called inside `IllustratedMessage.tsx`:
```tsx
const containerRef = useRef<HTMLDivElement>(null);
const resolvedSize = useIllustrationSize(containerRef, design);
// resolvedSize is then provided via IllustrationSizeContext
```

## Acceptance Criteria
- [ ] Hook returns correct `IllustrationSize` for each width breakpoint
- [ ] Auto mode observes container width via ResizeObserver
- [ ] Fixed mode returns the correct mapped size without observing
- [ ] Alias designs (ExtraSmall, Small, Medium, Large) resolve correctly
- [ ] SSR-safe: doesn't crash when ResizeObserver is undefined
- [ ] Defaults to Dialog when SSR
- [ ] Observer is disconnected on unmount
- [ ] State only updates when resolved size actually changes
- [ ] IllustratedMessage correctly passes resolved size to context

## Test Cases

1. **Auto mode - large container**
   - Container width: 800px
   - Expected: `IllustrationSize.Scene`

2. **Auto mode - medium container**
   - Container width: 500px
   - Expected: `IllustrationSize.Dialog`

3. **Auto mode - small container**
   - Container width: 300px
   - Expected: `IllustrationSize.Spot`

4. **Auto mode - extra small container**
   - Container width: 200px
   - Expected: `IllustrationSize.Dot`

5. **Auto mode - tiny container**
   - Container width: 100px
   - Expected: `IllustrationSize.Base`

6. **Fixed mode - ExtraSmall**
   - Design: `IllustrationDesign.ExtraSmall`
   - Expected: `IllustrationSize.Dot` (regardless of container width)

7. **Resize triggers update**
   - Container starts at 800px (Scene), then shrinks to 300px
   - Expected: Transitions from Scene to Spot

**Output when complete:** `<promise>DONE</promise>`
