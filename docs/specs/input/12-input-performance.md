# Input Component - Performance

## Acceptance Criteria

- [x] Component renders in < 16ms (60fps budget)
- [x] No unnecessary re-renders on parent updates
- [x] Event handlers are memoized
- [ ] Large suggestion lists virtualized (future enhancement)
- [x] Bundle size < 10KB gzipped (core input)
- [x] Tree-shakeable exports
- [x] No memory leaks on mount/unmount cycles
- [ ] Debounced input events for heavy operations (optional via user implementation)
- [ ] Lazy load suggestion popover (future enhancement)
- [x] CSS-in-JS overhead minimized (Tailwind classes)

## Test Cases

1. **Initial render performance**
   - Input: Measure `<Input />` render time
   - Expected: < 5ms for simple input

2. **Re-render on typing**
   - Input: Type rapidly in input
   - Expected: No frame drops, smooth cursor

3. **Parent re-render isolation**
   - Input: Parent state changes unrelated to input
   - Expected: Input doesn't re-render (React.memo)

4. **Memoized handlers**
   - Input: Check onChange reference stability
   - Expected: Same reference across renders (when deps unchanged)

5. **Large suggestions list**
   - Input: 10,000 suggestions
   - Expected: Opens quickly, scrolls smoothly

6. **Bundle size**
   - Input: Build and measure
   - Expected: < 10KB gzipped for Input component

7. **Tree shaking**
   - Input: Import only Input, not suggestions
   - Expected: Suggestions code not in bundle

8. **Memory on unmount**
   - Input: Mount/unmount 1000 times
   - Expected: No memory growth (check heap)

9. **Debounced onInput**
   - Input: `<Input onInput={heavyFn} debounce={300} />`
   - Action: Type rapidly
   - Expected: heavyFn called at most every 300ms

10. **Lazy popover**
    - Input: `<Input showSuggestions suggestions={[]} />`
    - Expected: Popover code not loaded until first open

11. **CSS class performance**
    - Input: Profile style recalculation
    - Expected: < 1ms style recalc on state change

12. **Event delegation**
    - Input: 100 inputs on page
    - Expected: Events efficiently delegated, not 100 listeners

13. **Controlled input performance**
    - Input: `<Input value={state} onChange={setState} />`
    - Action: Type at 10 chars/second
    - Expected: No lag, no dropped characters

14. **Virtualized scroll**
    - Input: Scroll through 10,000 suggestions
    - Expected: Constant 60fps, low memory

## Performance Optimization Techniques

### 1. Memoization
```typescript
// Memoize component
export const Input = React.memo(InputComponent);

// Memoize callbacks
const handleChange = useCallback((e) => {
  onChange?.(e.target.value);
}, [onChange]);

// Memoize computed values
const filteredSuggestions = useMemo(
  () => suggestions.filter(s => s.includes(filter)),
  [suggestions, filter]
);
```

### 2. Lazy Loading
```typescript
// Lazy load heavy features
const SuggestionsPopover = lazy(() =>
  import('./SuggestionsPopover')
);

// Only render when needed
{showSuggestions && isOpen && (
  <Suspense fallback={null}>
    <SuggestionsPopover />
  </Suspense>
)}
```

### 3. Virtualization
```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

const virtualizer = useVirtualizer({
  count: suggestions.length,
  getScrollElement: () => listRef.current,
  estimateSize: () => 40, // item height
  overscan: 5,
});
```

### 4. Debouncing
```typescript
const debouncedOnInput = useMemo(
  () => debounce(onInput, debounceMs),
  [onInput, debounceMs]
);
```

### 5. CSS Optimization
```typescript
// Use Tailwind classes (static, no runtime)
className="flex h-10 w-full rounded-md border"

// Avoid inline styles that cause recalc
// Bad: style={{ color: 'red' }}
// Good: className="text-red-500"
```

## Bundle Size Budget

| Part | Budget |
|------|--------|
| Core Input | < 5KB |
| Value States | < 1KB |
| Icons | < 1KB |
| Suggestions | < 4KB |
| Total | < 10KB |

## Implementation Notes

- Use `React.memo` with custom comparison for complex props
- Split suggestions into separate chunk
- Avoid `useEffect` for derived state (use `useMemo`)
- Profile with React DevTools Profiler
- Test on low-end devices (4x CPU slowdown)
- Consider `startTransition` for non-urgent updates
