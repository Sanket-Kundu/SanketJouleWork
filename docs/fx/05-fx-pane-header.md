# FxPaneHeader

The `FxPaneHeader` component provides a consistent header bar for each pane with title, actions, breadcrumbs, and toggle buttons.

## Basic Usage

```tsx
import { FxPaneHeader, FxPaneHeaderAction } from '@sap-ui/fx-components';

<FxPaneHeader
  pane="center"
  title="My Item"
>
  <FxPaneHeaderAction icon={<Edit />} text="Edit" onClick={handleEdit} />
</FxPaneHeader>
```

## Props Reference

### Core Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `pane` | `'start' \| 'center' \| 'end'` | - | Which pane this header belongs to |
| `title` | `string` | - | Header title text |

### Navigation Props

| Prop | Type | Description |
|------|------|-------------|
| `showBack` | `boolean` | Show back button (for drilldown) |
| `onBackClick` | `() => void` | Back button clicked |
| `breadcrumbs` | `ReactNode` | Breadcrumbs component (shown inline with title) |

### Title Props

| Prop | Type | Description |
|------|------|-------------|
| `titleEditable` | `boolean` | Enable inline title editing |
| `titleEditMode` | `boolean` | Controlled edit mode state |
| `showTitleArrow` | `boolean` | Show dropdown arrow after title |
| `onTitleArrowClick` | `(arrowRef: HTMLElement) => void` | Arrow clicked (for dropdown) |
| `onTitleEditAccept` | `(detail: { value, previousValue }) => void` | Edit confirmed |
| `onTitleEditCancel` | `(detail: { value }) => void` | Edit cancelled |
| `onTitleEditModeChange` | `(detail: { editMode }) => void` | Edit mode changed |

### Relations Props

| Prop | Type | Description |
|------|------|-------------|
| `related` | `FxRelationItem[]` | Related items for relations menu |
| `onRelationClick` | `(relation: FxRelationItem) => void` | Relation item clicked |

### Add Button Props

| Prop | Type | Description |
|------|------|-------------|
| `showAddButton` | `boolean` | Show + button next to title |
| `addButtonTooltip` | `string` | Tooltip for add button |
| `onAddClick` | `() => void` | Add button clicked |

### Styling Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | `string` | Additional CSS classes |
| `style` | `CSSProperties` | Inline styles |

### Slots

| Prop | Type | Description |
|------|------|-------------|
| `subheader` | `ReactNode` | Content below header (e.g., search input) |
| `children` | `ReactNode` | Action components |

## Header Types by Pane

### Start Pane Header

```tsx
<FxPaneHeader
  pane="start"
  title="Conversations"
  subheader={searchInput}
>
  <FxPaneHeaderAction icon={<Search />} text="Search" onClick={toggleSearch} />
  <FxPaneHeaderAction icon={<Filter />} text="Filter" />
  <FxPaneHeaderAction icon={<Plus />} text="New" design="Secondary" showText />
</FxPaneHeader>
```

### Center Pane Header

```tsx
<FxPaneHeader
  pane="center"
  title={selectedItem?.name || 'New Item'}
  showBack={isDrilldown}
  onBackClick={handleBackClick}
  breadcrumbs={breadcrumbs}
  subheader={developSubheader}
  related={relations}
  onRelationClick={handleRelationClick}
  titleEditable={!!selectedItem}
  titleEditMode={titleEditMode}
  onTitleEditAccept={handleTitleRename}
  showTitleArrow={isDevelop && !!selectedItem}
  onTitleArrowClick={handleTitleArrowClick}
>
  {renderActions()}
</FxPaneHeader>
```

### End Pane Header

```tsx
<FxPaneHeader
  pane="end"
  title="Joule"
  showAddButton
  addButtonTooltip="New Chat"
  onAddClick={handleAddClick}
/>
```

## Editable Title

Allow users to rename items by double-clicking the title:

```tsx
const [titleEditMode, setTitleEditMode] = useState(false);

const handleTitleRename = useCallback((detail: { value: string; previousValue: string }) => {
  if (detail.value !== detail.previousValue) {
    // Save the new name
    updateItemName(selectedItemId, detail.value);
  }
  setTitleEditMode(false);
}, [selectedItemId]);

<FxPaneHeader
  title={itemName}
  titleEditable={!!selectedItem}
  titleEditMode={titleEditMode}
  onTitleEditAccept={handleTitleRename}
  onTitleEditCancel={() => setTitleEditMode(false)}
  onTitleEditModeChange={({ editMode }) => setTitleEditMode(editMode)}
>
  {/* Rename action to trigger edit mode */}
  <FxPaneHeaderAction
    icon={<Pencil />}
    text="Rename"
    onClick={() => setTitleEditMode(true)}
    priority="alwaysOverflow"
  />
</FxPaneHeader>
```

## Title Dropdown Arrow

Show a dropdown for switching contexts (e.g., project switcher):

```tsx
const [dropdownOpen, setDropdownOpen] = useState(false);
const [dropdownOpener, setDropdownOpener] = useState<HTMLElement | null>(null);

const handleTitleArrowClick = useCallback((arrowRef: HTMLElement) => {
  setDropdownOpener(arrowRef);
  setDropdownOpen(true);
}, []);

<FxPaneHeader
  title={project.name}
  showTitleArrow={true}
  onTitleArrowClick={handleTitleArrowClick}
/>

<Popover
  open={dropdownOpen}
  opener={dropdownOpener}
  onClose={() => setDropdownOpen(false)}
>
  <List>
    {projects.map(p => (
      <ListItem key={p.id} onClick={() => selectProject(p.id)}>
        {p.name}
      </ListItem>
    ))}
  </List>
</Popover>
```

## Breadcrumbs

Show navigation path for drilldown scenarios:

```tsx
import { Breadcrumbs, BreadcrumbsItem } from '@sap-ui/fx-components';

const breadcrumbs = (
  <Breadcrumbs design="NoCurrentPage" onItemClick={handleBreadcrumbClick}>
    <BreadcrumbsItem key="parent">{parentItem.name}</BreadcrumbsItem>
    {level2 && (
      <BreadcrumbsItem key="level1">{level1.title}</BreadcrumbsItem>
    )}
  </Breadcrumbs>
);

<FxPaneHeader
  title={currentLevel.title}
  breadcrumbs={breadcrumbs}
  showBack={true}
  onBackClick={exitDrilldown}
/>
```

## Subheader

Add content below the header (search input, stepper, etc.):

```tsx
const searchSubheader = searchVisible ? (
  <Input
    value={searchQuery}
    onInput={setSearchQuery}
    placeholder="Search..."
    showClearIcon
  />
) : undefined;

<FxPaneHeader
  title="Items"
  subheader={searchSubheader}
>
  <FxPaneHeaderAction icon={<Search />} onClick={toggleSearch} />
</FxPaneHeader>
```

## Relations Menu

Show related items (linked spaces, jobs, conversations):

```tsx
const relations: FxRelationItem[] = [
  { type: 'space', name: 'Sales Analytics', id: 'space1', icon: <SpacesIcon /> },
  { type: 'job', name: 'Daily Report', id: 'job1', icon: <JobsIcon /> },
  { type: 'conversation', name: 'Q4 Discussion', id: 'conv1', icon: <ConversationsIcon /> },
];

const handleRelationClick = useCallback((relation: FxRelationItem) => {
  if (relation.type === 'conversation') {
    openEndPane('sources', relation.id);
  } else {
    switchSection(relation.type === 'space' ? 'spaces' : 'jobs');
    selectItem(relation.id);
  }
}, []);

<FxPaneHeader
  title={item.name}
  related={relations}
  onRelationClick={handleRelationClick}
/>
```
