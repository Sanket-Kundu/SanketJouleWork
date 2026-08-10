# Breaking Changes

---

## Status / Tag Restructure

### Summary

The `Status` component has been removed and replaced by a new display-only `Tag` component with 9 fixed designs matching the Figma Sapphire "Status Tag" spec. The previous `Tag` component (interactive, with color schemes) has been renamed to `TagExploration`.

### Removed Exports

| Export | Type | Replacement |
|---|---|---|
| `Status` | Component | `Tag` |
| `StatusDesign` | Enum | `TagDesign` |
| `StatusVariant` | Enum | Removed — no replacement needed |
| `StatusSize` | Enum | Removed — fixed 24px height |
| `StatusWrappingType` | Enum | Removed |
| `StatusProps` | Interface | `TagProps` |
| `StatusRef` | Interface | `TagRef` |
| `StatusClickEventDetail` | Interface | Removed — Tag is not interactive |

### Renamed Exports (old Tag → TagExploration)

| Before | After |
|---|---|
| `Tag` | `TagExploration` |
| `TagDesign` | `TagExplorationDesign` |
| `TagSize` | `TagExplorationSize` |
| `TagWrappingType` | `TagExplorationWrappingType` |
| `TagColorScheme` | `TagExplorationColorScheme` |
| `TagProps` | `TagExplorationProps` |
| `TagRef` | `TagExplorationRef` |
| `TagClickEventDetail` | `TagExplorationClickEventDetail` |
| `TagCloseEventDetail` | `TagExplorationCloseEventDetail` |

### Removed Props

The new `Tag` is display-only. These props no longer exist:

- `variant` — each design has a fixed visual style
- `size` — fixed at 24px
- `interactive` — Tag is never interactive
- `readOnly`
- `onClick`
- `onClose`
- `showBorder` — borders are determined by the design (only `Waiting` and `Paused` have borders)
- `colorScheme` — no color scheme support
- `wrappingType`
- `accent`
- `hideStateIcon` — renamed to `hideIcon`
- `accessibleNameRef`

### New Props

| Prop | Type | Description |
|---|---|---|
| `design` | `TagDesign` | One of 9 fixed designs (default: `None`) |
| `icon` | `ReactNode` | Custom icon (overrides the design's default icon) |
| `hideIcon` | `boolean` | Hides the default icon |
| `accessibleName` | `string` | `aria-label` |
| `className` | `string` | |
| `style` | `CSSProperties` | |
| `id` | `string` | |
| `data-testid` | `string` | |
| `ref` | `Ref<TagRef>` | |

### New `TagDesign` Values

#### Semantic (5)

| Design | Background | Text | Default Icon |
|---|---|---|---|
| `Positive` | green tinted | green | checkmark |
| `Negative` | red tinted | red | error circle |
| `Critical` | yellow tinted | yellow | warning triangle |
| `None` | gray | secondary text | hash `#` |
| `Information` | blue tinted | blue | info circle |

#### Jobs (4)

| Design | Background | Border | Text | Default Icon |
|---|---|---|---|---|
| `Draft` | gray | none | primary text | busy dots |
| `Active` | purple (theme-aware) | none | purple (theme-aware) | sync arrows |
| `Waiting` | transparent | purple | purple | flag |
| `Paused` | transparent | gray | primary text | pause |

### Migration Examples

#### Status → Tag

```diff
- import { Status, StatusDesign } from "@sap-ui/fx-components";
+ import { Tag, TagDesign } from "@sap-ui/fx-components";

- <Status variant="Filled" design="Positive">Approved</Status>
+ <Tag design="Positive">Approved</Tag>

- <Status variant="Tinted" design="Negative" size="S">Error</Status>
+ <Tag design="Negative">Error</Tag>

- <Status variant="Outline" design="Information">Info</Status>
+ <Tag design="Information">Info</Tag>

- <Status design="Neutral">Default</Status>
+ <Tag design="None">Default</Tag>

- <Status variant="Filled" design="Positive" interactive onClick={handleClick}>Click</Status>
+ // Tag is display-only — interactive status tags are no longer supported
```

#### Old Tag → TagExploration

```diff
- import { Tag, TagDesign, TagSize } from "@sap-ui/fx-components";
+ import { TagExploration, TagExplorationDesign, TagExplorationSize } from "@sap-ui/fx-components";

- <Tag design="Set1" colorScheme="3" size="S" onClose={handleClose}>Label</Tag>
+ <TagExploration design="Set1" colorScheme="3" size="S" onClose={handleClose}>Label</TagExploration>
```

#### Design name mapping (Status → Tag)

| `StatusDesign` value | `TagDesign` value |
|---|---|
| `Positive` | `Positive` |
| `Negative` | `Negative` |
| `Critical` | `Critical` |
| `Information` | `Information` |
| `Neutral` | `None` |

---

## Card — `interactive` moved from CardHeader to Card

### Summary

The `interactive` behavior has moved from `CardHeader` to `Card`. The entire card is now the interactive surface — not just the header. Non-interactive cards use `role="region"`; interactive cards use `role="listitem"` and must be placed inside a `role="list"` container.

### Removed from CardHeaderProps

| Export | Type | Replacement |
|---|---|---|
| `interactive` | `boolean` prop | Use `interactive` on `Card` |
| `onClick` | event handler | Use `onClick` on `Card` |
| `CardHeaderClickEventDetail` | Interface | `CardClickEventDetail` (deprecated alias kept) |

### Changed on Card

| Before | After |
|---|---|
| `role="region"` (default) / `role="button"` (interactive) | `role="region"` (default) / `role="listitem"` (interactive) |
| `aria-roledescription="Card"` / `"Interactive Card"` | Removed |
| Header heading suppressed when interactive | Heading always renders with `role="heading"` |
| Clicks on nested buttons fire Card onClick | Clicks on nested interactive elements (`button`, `a`, `input`, etc.) are ignored |
| Pressed styles via CSS `:active` pseudo-class | Pressed styles via state (mouse/keyboard), skipped when clicking nested interactives |

### Toolbar visibility (Joule cards)

Joule cards no longer show the toolbar on hover. The toolbar is controlled entirely by the `toolbarVisible` prop. The application is responsible for:
- Setting `toolbarVisible={true}` in the `onClick` handler
- Setting `toolbarVisible={false}` in the `onBlur` handler

When a Card has a toolbar, `onBlur` fires on the outer wrapper and only when focus leaves the card+toolbar unit entirely (not when moving between card and toolbar buttons).

### Migration

```diff
- <CardHeader
-   interactive
-   onClick={handleClick}
-   titleText="Title"
- />
+ <Card
+   interactive
+   onClick={handleClick}
+   header={<CardHeader titleText="Title" />}
+ >
+   ...
+ </Card>
```

Joule toolbar pattern:

```tsx
const [showToolbar, setShowToolbar] = useState(false);

<Card
  design="Joule"
  interactive
  onClick={() => setShowToolbar(true)}
  onBlur={() => setShowToolbar(false)}
  toolbarVisible={showToolbar}
  toolbar={<Button iconOnly icon={<EditIcon />} />}
  header={<CardHeader titleText="Title" />}
>
  <CardContent>...</CardContent>
</Card>
```

Interactive cards must be placed inside a list container:

```tsx
<div role="list">
  <Card interactive header={<CardHeader titleText="Card 1" />}>...</Card>
  <Card interactive header={<CardHeader titleText="Card 2" />}>...</Card>
</div>
```

---

## MessageStrip — Close button no longer auto-hides

Wrap the `MessageStrip` in a conditional and manage visibility in your app state:

```diff
+ const [showMessage, setShowMessage] = useState(true);

- <MessageStrip onClose={() => console.log("closed")}>
-   This message auto-hides on close.
- </MessageStrip>
+ {showMessage && (
+   <MessageStrip onClose={() => setShowMessage(false)}>
+     This message is controlled by app state.
+   </MessageStrip>
+ )}
```
