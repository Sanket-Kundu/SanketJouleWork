# Spec 10: Exports & Build Integration

## Overview
Wire up all exports, update the monorepo build configuration, and verify the complete integration between the components and illustrations packages.

## Requirements

### Component Package Exports

**`src/components/illustrated-message/index.ts`:**
```ts
export { IllustratedMessage } from "./IllustratedMessage";
export { IllustrationSizeContext, useIllustrationSizeContext } from "./IllustrationContext";
```

**`src/index.ts`** - Add:
```ts
// IllustratedMessage
export * from "./components/illustrated-message";
export * from "./types/illustrated-message";
```

### Illustrations Package Exports

**`packages/illustrations/src/index.ts`:**
```ts
export * from "./fiori";
export * from "./tnt";
export { createIllustration } from "./createIllustration";
export type { IllustrationProps, IllustrationMeta } from "./types";
```

**`packages/illustrations/package.json` exports:**
```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    },
    "./fiori": {
      "types": "./dist/fiori/index.d.ts",
      "import": "./dist/fiori/index.js",
      "require": "./dist/fiori/index.cjs"
    },
    "./tnt": {
      "types": "./dist/tnt/index.d.ts",
      "import": "./dist/tnt/index.js",
      "require": "./dist/tnt/index.cjs"
    }
  }
}
```

### Build Configuration

**Root `package.json`** - Update scripts:
```json
{
  "build": "npm run build",
  "build:illustrations": "npm run build"
}
```

**`packages/illustrations/tsup.config.ts`:**
```ts
export default defineConfig({
  entry: {
    index: "src/index.ts",
    "fiori/index": "src/fiori/index.ts",
    "tnt/index": "src/tnt/index.ts",
  },
  format: ["cjs", "esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom", "@sap-ui/fx-components"],
  treeshake: true,
});
```

### Integration Verification
- Build the components package first (provides IllustrationSizeContext)
- Build the illustrations package second (depends on components)
- Both packages should build without errors

### End-to-End Usage Test
Create or update a demo page that shows:
```tsx
import { IllustratedMessage } from "@sap-ui/fx-components";
import { BeforeSearch } from "@fx-illustrations/fiori";
import { Success } from "@fx-illustrations/tnt";

// Usage in demo
<IllustratedMessage
  illustration={<BeforeSearch />}
  titleText="Start searching"
  subtitleText="Enter your search criteria to find results"
>
  <Button>Search Now</Button>
</IllustratedMessage>
```

## Acceptance Criteria
- [ ] `IllustratedMessage` is exported from `@sap-ui/fx-components`
- [ ] `IllustrationSizeContext` is exported from `@sap-ui/fx-components`
- [ ] All types are exported from `@sap-ui/fx-components`
- [ ] `@fx-illustrations` root export includes all fiori + tnt
- [ ] `@fx-illustrations/fiori` exports all fiori illustrations
- [ ] `@fx-illustrations/tnt` exports all tnt illustrations
- [ ] `npm run build` succeeds
- [ ] `npm run build` succeeds
- [ ] `npm run build:all` succeeds
- [ ] `npm run dev:demo` can import and render IllustratedMessage with illustrations
- [ ] Tree-shaking works: importing one illustration doesn't bundle all
- [ ] TypeScript IntelliSense works for all exports

## Test Cases

1. **Import from @sap-ui/fx-components**
   - `import { IllustratedMessage, IllustrationDesign } from "@sap-ui/fx-components"`
   - Expected: Both available with types

2. **Import from @fx-illustrations/fiori**
   - `import { BeforeSearch, NoData } from "@fx-illustrations/fiori"`
   - Expected: Both available with `.Spot`, `.Scene` etc.

3. **Import from @fx-illustrations/tnt**
   - `import { Success } from "@fx-illustrations/tnt"`
   - Expected: Available with metadata

4. **Full integration**
   - Render `<IllustratedMessage illustration={<BeforeSearch />} />`
   - Expected: Correct illustration renders at correct size

**Output when complete:** `<promise>DONE</promise>`
