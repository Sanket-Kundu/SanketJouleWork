# Spec 05: Code Generation Script

## Overview
Create a Node.js script that reads UI5 SVG illustration files and generates React component files for the illustrations package. Follows the same pattern as `src/components/icon/generate-icons.cjs`.

## Requirements

### Script Location
- Create `packages/illustrations/generate-illustrations.cjs`

### Input Sources
- **Fiori V4 SVGs:** `/Users/i524143/SAPDevelop/ui5-webcomponents/packages/fiori/src/illustrations/`
  - Pattern: `sapIllus-{Size}-{Name}.svg` (e.g., `sapIllus-Spot-BeforeSearch.svg`)
  - Sizes: Dot, Spot, Dialog, Scene
- **TNT V4 SVGs:** `/Users/i524143/SAPDevelop/ui5-webcomponents/packages/fiori/src/illustrations/tnt/`
  - Pattern: `tnt-{Size}-{Name}.svg` (e.g., `tnt-Spot-Avatar.svg`)
- **TNT V5 SVGs:** `/Users/i524143/SAPDevelop/ui5-webcomponents/packages/fiori/src/illustrations-v5/tnt/`
  - Same naming pattern as V4
- **i18n:** `/Users/i524143/SAPDevelop/ui5-webcomponents/packages/fiori/src/i18n/messagebundle_en.properties`
  - Entries like: `IM_TITLE_BEFORESEARCH=Let's get some results`
  - Entries like: `IM_SUBTITLE_BEFORESEARCH=Start by providing your search criteria.`

### SVG to JSX Conversion
For each SVG file:
1. Read the SVG content
2. Convert HTML attributes to JSX:
   - `fill-rule` -> `fillRule`
   - `clip-rule` -> `clipRule`
   - `fill-opacity` -> `fillOpacity`
   - `stroke-width` -> `strokeWidth`
   - `stroke-linecap` -> `strokeLinecap`
   - `stroke-linejoin` -> `strokeLinejoin`
   - `xmlns:xlink` -> remove
   - `xlink:href` -> `xlinkHref`
3. Remove the `id` attribute from the root `<svg>` element
4. Add `className={className}` to the root `<svg>` element
5. Ensure all SVG tags are self-closing where appropriate
6. Preserve `fill="var(--sapContent_Illustrative_Color*)"` values as-is

### Generated Output Structure

**Per Fiori illustration** (`src/fiori/{Name}.tsx`):
```tsx
import * as React from "react";
import { createIllustration } from "../createIllustration";

const Dot: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* ... converted paths */}
  </svg>
);

const Spot: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* ... converted paths */}
  </svg>
);

const Dialog: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* ... converted paths */}
  </svg>
);

const Scene: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* ... converted paths */}
  </svg>
);

export const BeforeSearch = createIllustration({
  name: "BeforeSearch",
  set: "fiori",
  collection: "V4",
  title: "Let's get some results",
  subtitle: "Start by providing your search criteria.",
  Dot, Spot, Dialog, Scene,
});

export default BeforeSearch;
```

**Per TNT illustration** (`src/tnt/{Name}.tsx`):
Same pattern but with `set: "tnt"`. If V5 variant exists, include it as additional size variants (or consider a V5 flag - for now include V4 only, V5 support deferred).

**Barrel exports** (`src/fiori/index.ts`, `src/tnt/index.ts`):
```ts
export { BeforeSearch } from "./BeforeSearch";
export { NoData } from "./NoData";
// ... etc
```

**Main index** (`src/index.ts`):
```ts
export * from "./fiori";
export * from "./tnt";
export { createIllustration } from "./createIllustration";
export type { IllustrationProps, IllustrationMeta } from "./types";
```

### i18n Parsing
- Parse `messagebundle_en.properties` for `IM_TITLE_{NAME}` and `IM_SUBTITLE_{NAME}` entries
- Convert keys like `IM_TITLE_BEFORESEARCH` to illustration name `BeforeSearch`
- Use as default title/subtitle in metadata
- Fall back to empty strings for TNT illustrations not in messagebundle

### Script Output
- Print count of generated files per set
- Print any illustrations that had missing size variants
- Print the total output size

## Acceptance Criteria
- [ ] Script reads SVGs from UI5 source directories
- [ ] SVG attributes are correctly converted to JSX
- [ ] Each Fiori illustration generates one `.tsx` file with all 4 size variants
- [ ] Each TNT illustration generates one `.tsx` file with all 4 size variants
- [ ] Barrel `index.ts` files are generated for `fiori/` and `tnt/`
- [ ] Main `index.ts` is generated re-exporting everything
- [ ] i18n title/subtitle are extracted and embedded in metadata
- [ ] Generated TypeScript compiles without errors
- [ ] `fill="var(--sapContent_Illustrative_Color*)"` values preserved in output
- [ ] SVG `viewBox` attributes are preserved correctly

**Output when complete:** `<promise>DONE</promise>`
