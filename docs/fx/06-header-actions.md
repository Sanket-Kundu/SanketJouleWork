# Header Actions

FxPaneHeader supports three types of actions: regular actions, segmented actions (toggle groups), and split actions (button with dropdown).

## Action Types

| Component | Use Case | Example |
|-----------|----------|---------|
| `FxPaneHeaderAction` | Standard button | Edit, Delete, Export |
| `FxPaneHeaderSegmentedAction` | Mode toggle | View/Edit/Test |
| `FxPaneHeaderSplitAction` | Button + dropdown | Open (with IDE options) |

## FxPaneHeaderAction

Standard action button that can show icon, text, or both.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `ReactNode` | - | Icon element |
| `text` | `string` | - | Button text (used in overflow menu) |
| `showText` | `boolean` | `false` | Show text alongside icon |
| `design` | `ButtonDesign` | `'Tertiary'` | Button visual style |
| `priority` | `ActionPriority` | `'medium'` | Overflow priority |
| `disabled` | `boolean` | `false` | Disabled state |
| `tooltip` | `string` | - | Tooltip text |
| `onClick` | `(event, ref) => void` | - | Click handler (see below) |

### onClick Handler

The `onClick` handler receives two arguments:

```tsx
onClick?: (event: React.MouseEvent, ref: HTMLElement | null) => void
```

| Argument | Type | Description |
|----------|------|-------------|
| `event` | `React.MouseEvent` | The click event |
| `ref` | `HTMLElement \| null` | DOM element of the action button |

**Important:** The `ref` argument provides the actual DOM element where the action is rendered:
- **In toolbar**: Returns the button element itself
- **In overflow menu**: Returns the overflow menu button (three-dot button)

This is essential for anchoring popovers, menus, or tooltips to the action:

```tsx
const [menuOpen, setMenuOpen] = useState(false);
const [menuOpener, setMenuOpener] = useState<HTMLElement | null>(null);

<FxPaneHeaderAction
  icon={<Settings className="h-4 w-4" />}
  text="Options"
  onClick={(_event, ref) => {
    setMenuOpener(ref);
    setMenuOpen(true);
  }}
/>

<Menu
  open={menuOpen}
  opener={menuOpener}
  onClose={() => setMenuOpen(false)}
>
  <MenuItem text="Option 1" />
  <MenuItem text="Option 2" />
</Menu>
```

### Priority Levels

| Priority | Behavior |
|----------|----------|
| `'high'` | Last to overflow, stays visible longest |
| `'medium'` | Default priority |
| `'low'` | First to overflow when space is limited |
| `'alwaysOverflow'` | Always in overflow menu, never in toolbar |

### Examples

```tsx
// Icon-only button (default)
<FxPaneHeaderAction
  icon={<Search className="h-4 w-4" />}
  text="Search"
  onClick={handleSearch}
/>

// Icon + text button
<FxPaneHeaderAction
  icon={<Plus className="h-4 w-4" />}
  text="New Item"
  showText
  design="Secondary"
  onClick={handleNew}
/>

// Toggle button (changes design based on state)
<FxPaneHeaderAction
  icon={<TrendingUp className="h-4 w-4" />}
  text="Insights"
  design={showInsights ? "Primary" : "Tertiary"}
  onClick={toggleInsights}
/>

// Always in overflow menu
<FxPaneHeaderAction
  icon={<Pencil className="h-4 w-4" />}
  text="Rename"
  onClick={handleRename}
  priority="alwaysOverflow"
/>

// High priority (stays visible)
<FxPaneHeaderAction
  icon={<Rocket className="h-4 w-4" />}
  text="Deploy"
  showText
  design="Secondary"
  priority="high"
  onClick={handleDeploy}
/>
```

## FxPaneHeaderSegmentedAction

Toggle group for mutually exclusive options (like View/Edit/Test mode switcher).

### Props

| Prop | Type | Description |
|------|------|-------------|
| `selectedId` | `string` | Currently selected option ID |
| `onSelectionChange` | `(detail: { selectedId }) => void` | Selection changed |
| `priority` | `ActionPriority` | Overflow priority |
| `centered` | `boolean` | Position at center of header (for 3-part layout) |
| `children` | `ReactNode` | `FxPaneHeaderSegmentedOption` children |

### FxPaneHeaderSegmentedOption Props

| Prop | Type | Description |
|------|------|-------------|
| `id` | `string` | Unique option ID |
| `icon` | `ReactNode` | Option icon |
| `text` | `string` | Option text |

### Example

```tsx
const [viewMode, setViewMode] = useState('view');

<FxPaneHeader pane="center" title="My Project">
  <FxPaneHeaderSegmentedAction
    selectedId={viewMode}
    onSelectionChange={({ selectedId }) => setViewMode(selectedId)}
    priority="high"
    centered
  >
    <FxPaneHeaderSegmentedOption
      id="view"
      icon={<Eye className="h-4 w-4" />}
      text="View"
    />
    <FxPaneHeaderSegmentedOption
      id="edit"
      icon={<Code className="h-4 w-4" />}
      text="Edit"
    />
    <FxPaneHeaderSegmentedOption
      id="test"
      icon={<TestTube className="h-4 w-4" />}
      text="Test"
    />
  </FxPaneHeaderSegmentedAction>
</FxPaneHeader>
```

### Overflow Behavior

When space is limited, the segmented action collapses into a single button that opens a menu with the options. The currently selected option is shown as the button.

## FxPaneHeaderSplitAction

Button with a dropdown menu for additional options.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `icon` | `ReactNode` | Main button icon |
| `text` | `string` | Main button text |
| `showText` | `boolean` | Show text alongside icon |
| `priority` | `ActionPriority` | Overflow priority |
| `onClick` | `(event) => void` | Main button clicked |
| `onOptionSelect` | `(detail: { optionId }) => void` | Menu option selected |
| `children` | `ReactNode` | `FxPaneHeaderSplitOption` children |

### FxPaneHeaderSplitOption Props

| Prop | Type | Description |
|------|------|-------------|
| `id` | `string` | Unique option ID |
| `icon` | `ReactNode` | Option icon |
| `text` | `string` | Option text |

### Example

```tsx
const handleOpenInIDE = useCallback(() => {
  console.log('Opening in default IDE');
}, []);

const handleOpenOption = useCallback((detail: { optionId: string }) => {
  switch (detail.optionId) {
    case 'vscode':
      console.log('Opening in VS Code');
      break;
    case 'bas':
      console.log('Opening in Business Application Studio');
      break;
  }
}, []);

<FxPaneHeader pane="center" title="My Project">
  <FxPaneHeaderSplitAction
    icon={<ExternalLink className="h-4 w-4" />}
    text="Open"
    showText
    onClick={handleOpenInIDE}
    onOptionSelect={handleOpenOption}
  >
    <FxPaneHeaderSplitOption
      id="vscode"
      icon={<Terminal className="h-4 w-4" />}
      text="Open in VS Code"
    />
    <FxPaneHeaderSplitOption
      id="bas"
      icon={<Globe className="h-4 w-4" />}
      text="Open in BAS"
    />
  </FxPaneHeaderSplitAction>
</FxPaneHeader>
```

## Overflow Menu

When actions don't fit in the available space, they automatically move to an overflow menu (three-dot button).

### Overflow Order

1. `alwaysOverflow` actions are never in toolbar
2. `low` priority actions overflow first
3. `medium` priority actions overflow next
4. `high` priority actions overflow last

### In Overflow Menu

- Regular actions become menu items
- Segmented actions show as items with checkmarks
- Split actions show as items with submenus

## Complete Example

```tsx
const renderCenterHeaderActions = () => {
  if (!selectedItemId) return null;

  return (
    <>
      {/* Always in overflow */}
      <FxPaneHeaderAction
        icon={<Pencil className="h-4 w-4" />}
        text="Rename"
        onClick={handleRename}
        priority="alwaysOverflow"
      />
      <FxPaneHeaderAction
        icon={<Trash2 className="h-4 w-4" />}
        text="Delete"
        onClick={handleDelete}
        priority="alwaysOverflow"
      />

      {/* Centered mode switcher */}
      <FxPaneHeaderSegmentedAction
        selectedId={viewMode}
        onSelectionChange={({ selectedId }) => setViewMode(selectedId)}
        priority="high"
        centered
      >
        <FxPaneHeaderSegmentedOption id="view" icon={<Eye />} text="View" />
        <FxPaneHeaderSegmentedOption id="edit" icon={<Code />} text="Edit" />
        <FxPaneHeaderSegmentedOption id="test" icon={<TestTube />} text="Test" />
      </FxPaneHeaderSegmentedAction>

      {/* High priority actions */}
      <FxPaneHeaderAction
        icon={<Rocket className="h-4 w-4" />}
        text="Deploy"
        showText
        design="Secondary"
        priority="high"
        onClick={handleDeploy}
      />

      {/* Split button */}
      <FxPaneHeaderSplitAction
        icon={<ExternalLink className="h-4 w-4" />}
        text="Open"
        showText
        onClick={handleOpen}
        onOptionSelect={handleOpenOption}
      >
        <FxPaneHeaderSplitOption id="vscode" icon={<Terminal />} text="VS Code" />
        <FxPaneHeaderSplitOption id="bas" icon={<Globe />} text="BAS" />
      </FxPaneHeaderSplitAction>
    </>
  );
};

<FxPaneHeader pane="center" title={title}>
  {renderCenterHeaderActions()}
</FxPaneHeader>
```
