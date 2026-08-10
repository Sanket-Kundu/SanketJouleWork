# Spec 06: Generate Fiori Illustrations

## Overview
Run the code generation script to produce all Fiori illustration React components. Verify the output is correct and compiles.

## Requirements

### Run Generation
- Execute `node packages/illustrations/generate-illustrations.cjs`
- Verify all 73 Fiori illustrations are generated

### Expected Fiori Illustrations (73 total)
Achievement, AddColumn, AddDimensions, AddPeople, AddPeopleToCalendar, AddingColumns, BalloonSky, BeforeSearch, Connection, DragFilesToUpload, EmptyCalendar, EmptyList, EmptyPlanningCalendar, ErrorScreen, FilterTable, FilteringColumns, GroupTable, GroupingColumns, KeyTask, NewMail, NoActivities, NoChartData, NoColumnsSet, NoData, NoDimensionsSet, NoEntries, NoFilterResults, NoMail, NoMail_v1, NoNotifications, NoSavedItems, NoSavedItems_v1, NoSearchResults, NoTasks, NoTasks_v1, PageNotFound, ReceiveAppreciation, ReloadScreen, ResizeColumn, ResizingColumns, SearchEarth, SearchFolder, SignOut, SimpleBalloon, SimpleBell, SimpleCalendar, SimpleCheckMark, SimpleConnection, SimpleEmptyDoc, SimpleEmptyList, SimpleError, SimpleMagnifier, SimpleMail, SimpleNoSavedItems, SimpleNotFoundMagnifier, SimpleReload, SimpleTask, SleepingBell, SortColumn, SortingColumns, SuccessBalloon, SuccessCheckMark, SuccessHighFive, SuccessScreen, Survey, Tent, UnableToLoad, UnableToLoadImage, UnableToUpload, UploadCollection, UploadToCloud, UserHasSignedUp

### Verification
- Each `.tsx` file should:
  - Export a named component matching the illustration name
  - Have a default export
  - Include all 4 size variants (Dot, Spot, Dialog, Scene)
  - Have embedded metadata with title/subtitle from i18n
  - Compile without TypeScript errors

- `src/fiori/index.ts` should export all 73 illustrations

### Build Verification
- Run `npm run build` in the illustrations package
- Verify no TypeScript errors
- Verify the dist output contains the correct files

## Acceptance Criteria
- [ ] 73 Fiori illustration `.tsx` files exist in `packages/illustrations/src/fiori/`
- [ ] Each file exports a named component and default export
- [ ] Each file has Dot, Spot, Dialog, Scene variants
- [ ] `src/fiori/index.ts` exports all 73 illustrations
- [ ] SVG `fill` attributes using CSS variables are preserved
- [ ] TypeScript compiles without errors
- [ ] Random sample check: `BeforeSearch.tsx` renders correct SVGs at each size
- [ ] Random sample check: `NoData.tsx` has correct title/subtitle metadata

**Output when complete:** `<promise>DONE</promise>`
