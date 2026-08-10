# Spec 02: createIllustration Factory

## Overview
Create the factory function that generates smart illustration React components with automatic size selection via context, explicit size submodules (`.Dot`, `.Spot`, `.Dialog`, `.Scene`), and embedded metadata.

## Requirements

### Factory Function
- Create `packages/illustrations/src/createIllustration.tsx`
- The factory accepts:
  ```ts
  {
    name: string;
    set: string;
    collection: string;
    title: string;
    subtitle: string;
    Dot: React.FC<{ className?: string }>;
    Spot: React.FC<{ className?: string }>;
    Dialog: React.FC<{ className?: string }>;
    Scene: React.FC<{ className?: string }>;
  }
  ```

### Returned Component Behavior
- Reads `IllustrationSizeContext` from `@sap-ui/fx-components` to determine current size
- Accepts optional `size` prop to override context
- Accepts `className` prop passed through to the SVG
- Renders the correct size variant (Dot/Spot/Dialog/Scene)
- At `Base` size, renders nothing (returns null)
- Has `displayName` set to the illustration name

### Static Submodules
The returned component has static properties:
- `.Dot` - Direct access to the Dot (45x45) SVG component
- `.Spot` - Direct access to the Spot (128x128) SVG component
- `.Dialog` - Direct access to the Dialog (160x160) SVG component
- `.Scene` - Direct access to the Scene (320x240) SVG component
- `.metadata` - Object with `{ name, set, collection, title, subtitle }`

### Usage Pattern
```tsx
import { BeforeSearch } from "@fx-illustrations/fiori";

// Smart (reads size from context)
<BeforeSearch />
<BeforeSearch className="my-class" />

// Explicit size prop
<BeforeSearch size="Spot" />

// Direct submodule access
<BeforeSearch.Spot className="w-32 h-32" />
<BeforeSearch.Scene />

// Metadata access
console.log(BeforeSearch.metadata.title); // "Let's get some results"
```

## Acceptance Criteria
- [ ] `createIllustration` function exists in `packages/illustrations/src/createIllustration.tsx`
- [ ] Returned component reads `IllustrationSizeContext` and renders correct variant
- [ ] `size` prop overrides context value
- [ ] `className` prop is forwarded to the SVG component
- [ ] `Base` size returns null
- [ ] `.Dot`, `.Spot`, `.Dialog`, `.Scene` static properties work
- [ ] `.metadata` contains name, set, collection, title, subtitle
- [ ] Component has correct `displayName`
- [ ] TypeScript types are correct - component accepts `IllustrationProps`
- [ ] Works correctly when used outside any context (falls back to Dialog size)

## Test Cases

1. **Context-driven rendering**
   - Input: Wrap `<BeforeSearch />` in `IllustrationSizeContext.Provider value={IllustrationSize.Spot}`
   - Expected: Renders the Spot variant SVG

2. **Size prop override**
   - Input: `<BeforeSearch size="Scene" />` inside Spot context
   - Expected: Renders Scene variant (prop wins over context)

3. **Submodule access**
   - Input: `<BeforeSearch.Dot />`
   - Expected: Renders Dot variant SVG regardless of context

4. **Base size**
   - Input: `<BeforeSearch size="Base" />`
   - Expected: Returns null

5. **Metadata**
   - Input: `BeforeSearch.metadata`
   - Expected: `{ name: "BeforeSearch", set: "fiori", ... }`

**Output when complete:** `<promise>DONE</promise>`
