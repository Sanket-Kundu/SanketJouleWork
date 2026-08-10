# CLAUDE.md - AI Assistant Instructions

## Auto-Run Tests

After editing any component file under `src/components/`, check if a corresponding `.test.tsx` file exists in the same directory. If it does, run `/test` on that file to verify nothing is broken.

## IMPORTANT: Git Rules

**NEVER push to remote unless the user explicitly says "push" or "full update".**

- Commits are OK when the user asks to commit
- But do NOT push until the user has tested and explicitly requests it
- Wait for user approval before any `git push` command

## Deployment Rules

- **Do NOT commit, push, or deploy unless explicitly told to** - always wait for user testing and approval first
- **"full update"** means: commit, push, and deploy to GitHub Pages
- Only perform these actions when the user explicitly requests them

## Architecture Separation

Keep logic properly separated between components and demo app:

- **`src/components/fx/FxLayout.tsx`** - Contains layout logic ported from `fx-components/src/FxLayout.ts`
  - Pane visibility calculations
  - Breakpoint handling and maxPanes calculation
  - Resize observers and responsive behavior
  - Navigation collapse/expand state
  - Toggle functions for panes
  - Context provider for child components

- **`src/components/fx/FxPaneHeader.tsx`** - Contains header logic ported from `fx-components/src/FxPaneHeader.ts`
  - Toggle button rendering and icons
  - Title editing
  - Relations menu
  - Action overflow handling

- **`demos/el-demo/src/App.tsx`** - Demo app logic (equivalent to `fx-components/index.html`)
  - Navigation item configuration (noStartPane, utilityEndPane, etc.)
  - Section/mode switching
  - Content rendering for each pane
  - Application state management
  - Event handlers that respond to layout events

## Reference Implementation

The `../fx-components` project serves as the reference for expected functionality:
- `fx-components/src/FxLayout.ts` - Layout component reference
- `fx-components/src/FxPaneHeader.ts` - Header component reference
- `fx-components/index.html` - Demo app reference

## Demo Page Registration (DEMO_PAGES in `demos/demo/src/main.tsx`)

When adding a new entry to the `DEMO_PAGES` array, always set the correct flags:

- **`doc: true`** — for non-component pages (guides, docs, tools). Examples: "Getting Started", "Theming", "Theme Generator", "Components". Pages with this flag are excluded from the component count shown in the sidebar filter.
- **`ready: true`** — for components that are fully implemented and reviewed. This shows a "Ready" badge in the sidebar and includes the component in the "Ready (N)" filter count.
- **No flags** — for component pages still in progress. They appear in the "All (N)" count but not "Ready".

```ts
// Doc/guide page — always add doc: true
{ id: "installation", name: "Getting Started", doc: true },

// Finished component — add ready: true
{ id: "button", name: "Button", ready: true },

// Work-in-progress component — no extra flags
{ id: "calendar", name: "Calendar" },
```

## Key Implementation Patterns

### React Children & Fragments

**Problem:** `Children.toArray()` does NOT recursively flatten React Fragments when a Fragment is passed as a single child.

```tsx
// When a component renders actions wrapped in a Fragment:
const renderActions = () => (
  <>
    <Action text="A" />
    <Action text="B" />
  </>
);

<Header>{renderActions()}</Header>
// children is a SINGLE Fragment element, not two Action elements
```

**Solution:** Use a recursive flatten function:

```tsx
const flattenChildren = (nodes: React.ReactNode): React.ReactElement[] => {
  const result: React.ReactElement[] = [];
  Children.forEach(nodes, (child) => {
    if (!isValidElement(child)) return;
    if (child.type === React.Fragment) {
      result.push(...flattenChildren(child.props.children));
    } else {
      result.push(child);
    }
  });
  return result;
};
```

### Portal Click-Outside Detection

**Problem:** When using portals for submenus/dropdowns, clicks inside the portal are detected as "outside" the parent menu because portals render outside the parent's DOM tree.

```tsx
// This closes the menu when clicking submenu items!
const handleClickOutside = (e: MouseEvent) => {
  if (!menuRef.current.contains(e.target)) {
    closeMenu(); // Submenu is in a portal, so this fires
  }
};
```

**Solution:** Mark portal content with a data attribute and check for it:

```tsx
// On the portal container:
<div data-submenu="true">
  {submenuContent}
</div>

// In click-outside handler:
const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as Node;
  const isInsideMenu = menuRef.current?.contains(target);
  const isInsideSubmenu = (target as Element).closest?.('[data-submenu="true"]');

  if (!isInsideMenu && !isInsideSubmenu) {
    closeMenu();
  }
};
```

### Overflow Menu Architecture (FxPaneHeader)

The overflow system has these key parts:

1. **Priority-based overflow:** Actions have priorities (`alwaysOverflow`, `low`, `medium`, `high`)
   - `alwaysOverflow` actions NEVER appear in toolbar, always in overflow menu
   - Lower priority items overflow first when space is constrained

2. **Measurement system:** Off-screen container measures button widths to calculate overflow

3. **Overflow menu contents:**
   - **Relations:** Rendered as "Related" menu item with submenu containing grouped items
   - **Regular actions:** Simple menu items
   - **Segmented actions:** Flat items with checkmarks for selected state
   - **Split actions:** Menu items with submenus for their options

4. **Menu with submenus:**
   - Submenus detected by checking children for MenuItem/MenuSeparator/MenuHeader displayName
   - Submenus rendered as portals with MenuContext.Provider for proper context access
   - Hover timeout (150ms) prevents flickering when moving between parent and submenu

### `data-testid` forwarding (mandatory for all components)

Every component MUST accept and forward `data-testid` to its outermost rendered DOM element. Consumers (e.g. spaces-ui Playwright tests) rely on this convention.

1. Declare `"data-testid"?: string` in the component's `Props` interface in `src/types/<component>.ts`.
2. Destructure as `"data-testid": dataTestId` in the component function signature and apply `data-testid={dataTestId}` to the **root** JSX element — not an inner wrapper.
3. For **compound components** (a header with multiple buttons, a dialog with close+back, a split button with an arrow), auto-derive sub-element testids with kebab-case suffixes — `${dataTestId}-close`, `${dataTestId}-back`, `${dataTestId}-arrow`, etc. — using the `subTestId(root, suffix)` helper from `src/lib/utils.ts`. `subTestId` returns `undefined` when the root testid is unset, so the attribute is simply omitted.
4. Components with **dynamic children** (Menu, SideNavigation, SegmentedButton, List, Tabs, Table, Tokenizer, Breadcrumbs) require each child component to accept its own `data-testid` prop — never auto-derive from index or text.
5. Established suffix vocabulary (use these names whenever the role matches): `-close`, `-back`, `-arrow`, `-clear`, `-search`, `-browse`, `-toggle`, `-toggle-start`, `-toggle-end`, `-add`, `-relations`, `-overflow`, `-hamburger`, `-title`, `-title-arrow`, `-header`, `-content`, `-toolbar`, `-start-icon`, `-end-icon`, `-nmore`, `-send`, `-dictate`, `-voice`, `-notifications`, `-profile`, `-nav-toggle`, `-nav-close`. For overflow-menu items synthesized from compound action children (FxPaneHeader's segmented and split actions), each option-level testid is derived as `${rootTestId}-<optionId>`. Use distinct prefixed suffixes (`-start-icon`/`-end-icon`) rather than a bare `-icon` whenever a component has more than one icon slot, even if the slots are mutually exclusive today — collisions caused by future changes are silent and hard to debug.

## Common Commands

```bash
# Development
npm run dev:demo       # Start demo dev server
npm run dev:el-demo    # Start el-demo dev server

# Testing
npm test               # Run all tests (single run)
npm test -- Button     # Run tests matching "Button"
npm run test:watch     # Watch mode (re-runs on save)
npm run test:coverage  # Run with coverage report

# Building
npm run build          # Build component library
npm run build:demo     # Build demo app
npm run build:el-demo  # Build el-demo app

# Deployment (only when explicitly requested)
npx gh-pages -d demos/demo/dist
```

## CSS / Tailwind Class Conventions

All utility classes are auto-generated from `tokens.css` → `sapphire-theme.css` → Tailwind.

### Prefer `sapphire-*` tokens (match Figma design logic)

Always use `sapphire-*` prefixed Tailwind classes to match the Figma token names directly. When a Figma design specifies a token like `text-primary`, use `text-sapphire-text-primary` in code.

| Category | Classes |
|---|---|
| Text levels | `text-sapphire-text-primary`, `text-sapphire-text-secondary`, `text-sapphire-text-tertiary`, `text-sapphire-text-disabled` |
| Surfaces | `bg-sapphire-background-primary`, `bg-sapphire-background-secondary`, `bg-sapphire-background-tertiary`, `bg-sapphire-background-quaternary`, `bg-sapphire-canvas-primary` |
| Borders | `border-sapphire-border-primary`, `border-sapphire-border-active`, `border-sapphire-border-accent` |
| Buttons | `bg-sapphire-button-accent`, `bg-sapphire-button-accent2`, `text-sapphire-button-on-accent`, etc. |
| Notifications | `text-sapphire-positive`, `text-sapphire-negative`, `bg-sapphire-info-bg`, `bg-sapphire-warning-bg` |
| Chrome | `bg-sapphire-chrome-bg-primary`, `text-sapphire-chrome-fg-primary`, etc. |
| Icons | `text-sapphire-icon-accent`, `text-sapphire-icon-muted`, etc. |
| Prompt | `text-sapphire-prompt-accent`, `border-sapphire-prompt-accent-muted` |
| Spacing | `p-sapphire-3xs` (4px), `gap-sapphire-s` (16px), `m-sapphire-xl` (32px) |
| Palette | `bg-purple-500`, `text-blue-600`, `bg-neutral-100`, `bg-brand-purple`, etc. |

### Do NOT use hard-coded colors

Do not use generic Tailwind colors like `text-green-*` / `bg-orange-*` → use semantic tokens like `text-sapphire-positive` / `bg-sapphire-warning-bg`.

For inline styles, use CSS variables like `var(--border-active)` instead of hard-coded colors.

### Adding new tokens

Add tokens to `tokens.css` in both `:root` and `.theme-dark`. Run `npm run build` — the sync script regenerates `sapphire-theme.css` automatically. Never edit it by hand.

### Component CSS files

When a component needs non-Tailwind CSS (keyframe animations, scrollbar styling, pseudo-elements, WebKit-specific selectors), create a dedicated `.css` file next to the component. **You must also add an `@import` for it in `src/theme/styles-input.css`** under the "Component CSS" section — otherwise consumers using the pre-built `styles.css` will be missing those styles.

### ButtonDesign Enum

The valid `ButtonDesign` values are: `Primary`, `PrimaryJoule`, `Secondary`, `SecondaryJoule`, `Tertiary`, `TertiaryJoule`, `Neutral`, `SecondaryNeutral`, `TertiaryNeutral`.

**Do NOT use** `Positive`, `Negative`, or `Attention` — these have been removed.

## Demo Page Conventions

The demo app (`demos/demo/src/main.tsx`) has a `DEMO_PAGES` array that lists all pages in the side navigation. Each entry drives the component counter in the nav.

**Flags:**

- **`doc: true`** — Add this to non-component pages (e.g., Getting Started, Theming, Theme Generator). Pages with `doc: true` are excluded from the component counter.
- **`ready: true`** — Add this to component pages that are considered production-ready. The "Ready" count in the nav counter reflects this.
- **No flags** — A page without `doc: true` is counted as a component. A component without `ready: true` is counted as "not ready".

**When creating a new page:**

1. If it's a **documentation/guide page** (not a component), add `doc: true` to its entry.
2. If it's a **component page**, do NOT add `doc: true`. Add `ready: true` once the component is production-ready.

This ensures the side nav counter accurately shows "Ready (X) / All (Y)" for components only.

## Component Usage Rules

**ALWAYS use library components instead of native HTML elements:**

- Use `<Button>` instead of `<button>`
- Use `<Input>` instead of `<input>`
- Use `<List>` / `<ListItem>` instead of `<ul>` / `<li>`
- Use `<Menu>` / `<MenuItem>` instead of custom dropdown implementations

This ensures consistent styling, accessibility, and behavior across the application.
