# Spec 14: Loading State & Lazy Loading

## Overview
Implement loading indicators and support for lazy loading patterns.

## Requirements

### Loading Indicator
- `loading: boolean` prop shows loading state
- Spinner/indicator in dropdown
- Replaces item list while loading
- Accessible loading announcement

### Lazy Loading Support
- `filter="None"` for server-side filtering
- `onLoadMore` callback when scrolling to bottom
- `hasMore: boolean` to indicate more items available
- Virtual scrolling considerations

### Loading States
1. Initial load - Show loading in dropdown
2. Filter load - Show loading while filtering
3. Load more - Show loading at bottom of list

### Visual Design
- Spinner centered in dropdown
- "Loading..." text for screen readers
- Fade transition when loading completes
- Minimum loading time to prevent flicker

## Acceptance Criteria
- [ ] `loading` prop shows loading indicator
- [ ] Loading indicator replaces items list
- [ ] Spinner centered in popover
- [ ] Screen reader announces "Loading"
- [ ] `filter="None"` disables client-side filter
- [ ] `onLoadMore` callback on scroll to bottom
- [ ] `hasMore` shows load more indicator
- [ ] Smooth transition when loading completes
- [ ] Loading state prevents selection
- [ ] TypeScript types for all props

**Output when complete:** `<promise>DONE</promise>`
