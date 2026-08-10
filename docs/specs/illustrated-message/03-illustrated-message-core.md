# Spec 03: IllustratedMessage Core Component

## Overview
Implement the main `IllustratedMessage` component that provides layout, context, and slots for illustration, title, subtitle, and action buttons.

## Requirements

### Component Structure
- Create `src/components/illustrated-message/IllustratedMessage.tsx`
- Uses `React.forwardRef` with `IllustratedMessageRef`
- Uses `cva` for layout variants and `cn()` for class merging

### Layout Variants (cva)

**Root container variants by size:**
- `Scene`: `flex-col items-center justify-center text-center gap-4 p-4`
- `Dialog`: `flex-col items-center justify-center text-center gap-3 p-4`
- `Spot`: `flex-col items-center justify-center text-center gap-2 p-2`
- `Dot`: `flex-row items-center gap-3 p-2` (horizontal layout)
- `Base`: `flex-col items-center justify-center text-center gap-1 p-1`

**Title variants by size:**
- `Scene`: `text-xl font-semibold text-foreground max-w-[61.9375rem]`
- `Dialog`: `text-lg font-semibold text-foreground max-w-[40.5625rem]`
- `Spot`: `text-base font-semibold text-foreground max-w-[21.5rem]`
- `Dot`: `text-sm font-semibold text-foreground`
- `Base`: `text-sm font-semibold text-foreground max-w-[10rem]`

**Subtitle variants by size:**
- `Scene`: `text-base text-muted-foreground max-w-[61.9375rem]`
- `Dialog`: `text-sm text-muted-foreground max-w-[40.5625rem]`
- `Spot`: `text-sm text-muted-foreground max-w-[21.5rem]`
- `Dot`: `text-xs text-muted-foreground`
- `Base`: `text-xs text-muted-foreground max-w-[10rem]`

**Illustration container sizes:**
- `Scene`: `w-80 h-60` (320x240)
- `Dialog`: `w-40 h-40` (160x160)
- `Spot`: `w-32 h-32` (128x128)
- `Dot`: `w-[2.8125rem] h-[2.8125rem]` (~45x45)
- `Base`: hidden (display none)

### Rendering Structure
```
<div ref={containerRef} data-part="root" class="{rootVariant}" role/aria>
  <IllustrationSizeContext.Provider value={resolvedSize}>
    <!-- Illustration area (hidden at Base) -->
    <div data-part="illustration" class="{illustrationSize}" aria-hidden={decorative}>
      {illustration}
    </div>

    <!-- Text content -->
    <div data-part="content" class="{dotAlignment}">
      <div data-part="title" class="{titleVariant}">
        {title || titleText}
      </div>
      <div data-part="subtitle" class="{subtitleVariant}">
        {subtitle || subtitleText}
      </div>
    </div>

    <!-- Actions (hidden at Base and Dot sizes) -->
    <div data-part="actions" class="flex gap-2">
      {children}
    </div>
  </IllustrationSizeContext.Provider>
</div>
```

### Props Behavior
- `illustration` - Rendered inside the illustration container; wrapped in context
- `title` slot takes precedence over `titleText`
- `subtitle` slot takes precedence over `subtitleText`
- `children` (actions) hidden at Base and Dot sizes
- Illustration area hidden at Base size
- At Dot size, text content left-aligned (not centered)
- `design` defaults to "Auto"

### Ref Methods
- `focus()` - Focus the container div
- `blur()` - Blur the container div
- `nativeElement` - Returns the container div element

## Acceptance Criteria
- [ ] Component renders with correct layout for each size variant
- [ ] `illustration` prop renders inside the illustration container
- [ ] `IllustrationSizeContext.Provider` wraps the illustration
- [ ] `titleText` and `subtitleText` render with correct size styling
- [ ] `title` and `subtitle` slots override text props
- [ ] `children` (actions) render below text, hidden at Base/Dot
- [ ] Illustration area hidden at Base size
- [ ] Dot size uses horizontal (flex-row) layout
- [ ] Dot text content is left-aligned
- [ ] Ref forwarding works (focus/blur/nativeElement)
- [ ] `className` prop merges with root element
- [ ] `decorative` prop sets aria-hidden on illustration container
- [ ] Component has displayName "IllustratedMessage"
- [ ] Uses `cn()` and `cva` from project utilities

## Test Cases

1. **Basic rendering with illustration**
   - Input: `<IllustratedMessage illustration={<MockSvg />} titleText="Hello" subtitleText="World" />`
   - Expected: Renders illustration, title, subtitle in vertical layout

2. **Actions slot**
   - Input: `<IllustratedMessage titleText="Error"><Button>Retry</Button></IllustratedMessage>`
   - Expected: Button renders below subtitle

3. **Title slot override**
   - Input: `<IllustratedMessage titleText="Ignored" title={<h2>Custom</h2>} />`
   - Expected: Renders `<h2>Custom</h2>`, not "Ignored"

4. **Dot horizontal layout**
   - When size resolves to Dot, layout is flex-row with text left-aligned

5. **Base hides illustration and actions**
   - When size resolves to Base, illustration container and actions are not rendered

**Output when complete:** `<promise>DONE</promise>`
