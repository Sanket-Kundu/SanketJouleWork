# Spec 07: Generate TNT Illustrations

## Overview
Generate all TNT illustration React components from UI5 source. TNT has both V4 and V5 versions. For now, generate V4 as the default with V5 support structure in place.

## Requirements

### Expected TNT Illustrations (46 total)
Avatar, Calculator, ChartArea, ChartArea2, ChartBar, ChartBPMNFlow, ChartBullet, ChartDoughnut, ChartFlow, ChartGantt, ChartOrg, ChartPie, CodePlaceholder, Company, Compass, Components, Dialog, EmptyContentPane, ExternalLink, FaceID, Fingerprint, Handshake, Help, Lock, Mission, MissionFailed, NoApplications, NoFlows, NoUsers, Radar, RoadMap, Secrets, Services, SessionExpired, SessionExpiring, Settings, Success, SuccessfulAuth, Systems, Teams, Tools, Tutorials, UnableToLoad, Unlock, UnsuccessfulAuth, User2

### TNT Naming Convention
- UI5 uses `tnt-{Size}-{Name}.svg` for SVG files
- UI5 component references use `TntAvatar`, `TntSuccess`, etc.
- Our exports should use the short name WITHOUT the `Tnt` prefix since they're already in the `tnt/` namespace:
  ```tsx
  import { Avatar, Success } from "@fx-illustrations/tnt";
  ```
- The `metadata.name` should include the `Tnt` prefix for compatibility: `TntAvatar`

### V5 Handling
- V5 illustrations exist at `/Users/i524143/SAPDevelop/ui5-webcomponents/packages/fiori/src/illustrations-v5/tnt/`
- For this spec: generate V4 only
- Set `collection: "V4"` in metadata
- V5 support can be added later via a `collection` prop on the illustration or theme context

### Build Verification
- Each TNT `.tsx` file compiles without errors
- `src/tnt/index.ts` exports all 46 illustrations
- The illustrations package builds successfully

## Acceptance Criteria
- [ ] 46 TNT illustration `.tsx` files exist in `packages/illustrations/src/tnt/`
- [ ] Each file exports a named component (short name, e.g., `Avatar` not `TntAvatar`)
- [ ] Each file has Dot, Spot, Dialog, Scene variants
- [ ] Metadata `name` uses `Tnt` prefix (e.g., `TntAvatar`) for compatibility
- [ ] Metadata `set` is `"tnt"`, `collection` is `"V4"`
- [ ] `src/tnt/index.ts` exports all 46 illustrations
- [ ] TypeScript compiles without errors
- [ ] Random sample check: `Success.tsx` renders correct SVGs
- [ ] Main `src/index.ts` re-exports both fiori and tnt

**Output when complete:** `<promise>DONE</promise>`
