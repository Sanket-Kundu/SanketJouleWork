# Spec 08: Accessibility

## Overview
Implement full accessibility support for the IllustratedMessage component following WCAG 2.1 AA and matching UI5's accessibility implementation.

## Requirements

### ARIA Attributes on Root Container
- `role="group"` by default (groups illustration + text + actions)
- When `decorative` is true: `role="presentation"`
- `aria-label` from `accessibleName` prop
- `aria-roledescription="Illustrated message"` for screen readers

### Illustration Container
- When `decorative` is true: `aria-hidden="true"` on illustration container
- When `decorative` is false: illustration container gets `role="img"` with `aria-label` describing the illustration
  - If no `accessibleName` provided, use the illustration's metadata title as fallback

### Title and Subtitle
- Title element should use appropriate heading level or `role="heading"` with `aria-level`
- Subtitle wrapped in a `<p>` or has appropriate semantics
- Both should be associated with the root via `aria-describedby` when relevant

### Focus Management
- Root container should be focusable only if it contains interactive actions
- Tab order should flow naturally: illustration (if interactive) -> title -> actions
- Actions (children) manage their own focus

### Screen Reader
- The complete message should be announced coherently: illustration description + title + subtitle
- At Base size (no illustration), only title + subtitle announced
- At Dot size (compact), all content still accessible

### Keyboard
- No special keyboard handling needed for IllustratedMessage itself
- Action buttons inside handle their own keyboard events

## Acceptance Criteria
- [ ] Root has `role="group"` with `aria-roledescription="Illustrated message"`
- [ ] `accessibleName` prop maps to `aria-label` on root
- [ ] `decorative` sets `aria-hidden="true"` on illustration container
- [ ] Non-decorative illustration has `role="img"` with accessible label
- [ ] Title renders with heading semantics
- [ ] Actions are reachable via tab navigation
- [ ] Screen reader can announce title + subtitle coherently
- [ ] Component works correctly with VoiceOver/NVDA (manual check)

## Test Cases

1. **Default accessibility**
   - Input: `<IllustratedMessage illustration={<Svg />} titleText="No data" subtitleText="Try again" />`
   - Expected: `role="group"`, illustration has `role="img"`, title/subtitle readable

2. **Decorative mode**
   - Input: `<IllustratedMessage decorative illustration={<Svg />} titleText="Hello" />`
   - Expected: Illustration `aria-hidden="true"`, root `role="presentation"`

3. **Custom accessible name**
   - Input: `<IllustratedMessage accessibleName="Empty state illustration" />`
   - Expected: Root has `aria-label="Empty state illustration"`

**Output when complete:** `<promise>DONE</promise>`
