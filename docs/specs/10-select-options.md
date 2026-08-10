# Spec 10: Select Option Components

## Overview
Implement Option and OptionCustom components for Select.

## Requirements

### Option Component
- `value: string` - Form submission value
- `icon: string` - Icon before text
- `additionalText: string` - Secondary text column
- `tooltip: string` - Hover tooltip
- `selected: boolean` - Selection state
- `disabled: boolean` - Cannot select
- `children` - Text content

### Option Rendering
- Icon (optional) + Text + Additional Text layout
- Disabled items visually muted
- Tooltip on hover
- Selected state styling

### OptionCustom Component
- `displayText: string` - Text shown in Select when selected
- `value: string` - Form submission value
- `selected: boolean` - Selection state
- `disabled: boolean` - Cannot select
- `children` - Custom ReactNode content

### Custom Content
- Full control over option rendering
- `displayText` used in Select display when selected
- Can include images, badges, complex layouts

### Two-Column Layout (Readonly)
- When Select is readonly, show text + additionalText
- `textSeparator` prop: "Dash" (–), "Bullet" (·), "VerticalLine" (|)

## Acceptance Criteria
- [ ] Option renders text from children
- [ ] Option `icon` displays before text
- [ ] Option `additionalText` displays in second column
- [ ] Option `tooltip` shows on hover (title attribute)
- [ ] Option `disabled` prevents selection and mutes visually
- [ ] OptionCustom renders children as content
- [ ] OptionCustom `displayText` shown in Select when selected
- [ ] Custom content can include any ReactNode
- [ ] Readonly Select shows text + additionalText
- [ ] `textSeparator` prop controls separator character
- [ ] Both components use forwardRef
- [ ] Tailwind styling with CVA variants

**Output when complete:** `<promise>DONE</promise>`
