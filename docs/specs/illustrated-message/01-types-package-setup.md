# Spec 01: Types & Package Setup

## Overview
Create the TypeScript types for IllustratedMessage and set up the `packages/illustrations` package in the monorepo.

## Requirements

### Type Definitions
- Create `src/types/illustrated-message.ts` with:

**`IllustrationDesign` enum:**
- `Auto` - Responsive, picks size based on container width
- `Base` - No illustration shown (<=160px equivalent)
- `Dot` / `ExtraSmall` - 45x45 SVG
- `Spot` / `Small` - 128x128 SVG
- `Dialog` / `Medium` - 160x160 SVG
- `Scene` / `Large` - 320x240 SVG

**`IllustrationSize` enum (resolved internal sizes):**
- `Base`, `Dot`, `Spot`, `Dialog`, `Scene`

**`IllustratedMessageProps` interface:**
- `illustration?: React.ReactNode` - Illustration component to render
- `design?: IllustrationDesign | \`${IllustrationDesign}\`` (default "Auto")
- `titleText?: string` - Title text
- `subtitleText?: string` - Subtitle text
- `title?: React.ReactNode` - Custom title slot (overrides titleText)
- `subtitle?: React.ReactNode` - Custom subtitle slot (overrides subtitleText)
- `children?: React.ReactNode` - Action buttons
- `decorative?: boolean` (default false)
- `accessibleName?: string`
- `className?: string`
- `style?: React.CSSProperties`
- `id?: string`
- `"data-testid"?: string`

**`IllustratedMessageRef` interface:**
- `focus(): void`
- `blur(): void`
- `readonly nativeElement: HTMLDivElement | null`

### Illustrations Package
- Create `packages/illustrations/package.json`:
  - Name: `@fx-illustrations`
  - Type: module
  - Peer dependency on react ^19.0.0
  - Dependency on `@sap-ui/fx-components`
  - Exports: `.`, `./fiori`, `./tnt`
  - Build script using tsup

- Create `packages/illustrations/tsconfig.json`:
  - Match the components package tsconfig pattern
  - Target ES2020, JSX react-jsx, strict mode

- Create `packages/illustrations/tsup.config.ts`:
  - Entry points for index, fiori/index, tnt/index
  - ESM + CJS formats, dts, sourcemap, treeshake
  - External: react, react-dom, @sap-ui/fx-components

- Create `packages/illustrations/src/types.ts`:
  - `IllustrationProps` interface: `size?: IllustrationSize`, `className?: string`
  - `IllustrationMeta` interface: `name: string`, `set: string`, `collection: string`, `title: string`, `subtitle: string`
  - Re-export `IllustrationSize` from @sap-ui/fx-components

### Shared Context Export
- Create `src/components/illustrated-message/IllustrationContext.ts`:
  - Export `IllustrationSizeContext` with default value `IllustrationSize.Dialog`
  - Export `useIllustrationSize` consumer hook (just `useContext(IllustrationSizeContext)`)

## Acceptance Criteria
- [ ] `IllustrationDesign` enum has all 10 values (Auto, Base, Dot, ExtraSmall, Spot, Small, Dialog, Medium, Scene, Large)
- [ ] `IllustrationSize` enum has 5 values (Base, Dot, Spot, Dialog, Scene)
- [ ] `IllustratedMessageProps` interface has all listed props
- [ ] `IllustratedMessageRef` interface exposes focus/blur/nativeElement
- [ ] `packages/illustrations/package.json` exists with correct exports
- [ ] `packages/illustrations/tsconfig.json` exists
- [ ] `packages/illustrations/tsup.config.ts` exists with correct entry points
- [ ] `packages/illustrations/src/types.ts` exports `IllustrationProps` and `IllustrationMeta`
- [ ] `IllustrationSizeContext` is created and exported
- [ ] TypeScript compiles without errors in both packages
- [ ] `npm install` succeeds with the new package

**Output when complete:** `<promise>DONE</promise>`
