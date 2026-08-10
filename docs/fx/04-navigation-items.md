# Navigation Items

Navigation items configure the side navigation rail and determine per-mode layout behavior.

## Basic Configuration

```tsx
import type { FxNavItemConfig } from '@sap-ui/fx-components';

const navItems: FxNavItemConfig[] = [
  {
    name: 'conversations',
    text: 'Conversations',
    icon: <ConversationsIcon className="h-5 w-5" />,
  },
  {
    name: 'spaces',
    text: 'Spaces',
    icon: <SpacesIcon className="h-5 w-5" />,
  },
];

<FxLayout navItems={navItems} mode="conversations" />
```

## FxNavItemConfig Properties

### Identity

| Property | Type | Description |
|----------|------|-------------|
| `name` | `string` | **Required.** Unique identifier, used as `mode` value |
| `text` | `string` | Display label (shown in expanded nav and flyout) |
| `icon` | `ReactNode` | Icon element (use h-5 w-5 for consistency) |

### Pane Configuration

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `noStartPane` | `boolean` | `false` | Disable start pane for this mode |
| `utilityEndPane` | `boolean` | `false` | End pane is utility content (not AI chat) |

### Create Action

| Property | Type | Description |
|----------|------|-------------|
| `createActionTooltip` | `string` | Tooltip for the + button in nav flyout |
| `noCreateAction` | `boolean` | Hide the + button entirely |

## Complete Example

```tsx
const navItems: FxNavItemConfig[] = [
  {
    name: 'conversations',
    text: 'Conversations',
    icon: <ConversationsIcon className="h-5 w-5" />,
    createActionTooltip: 'New Chat',
    utilityEndPane: true,           // End pane shows sources, not Joule
  },
  {
    name: 'discover',
    text: 'Discover',
    icon: <DiscoverIcon className="h-5 w-5" />,
    noStartPane: true,              // No list view for discover
    noCreateAction: true,           // No + button
  },
  {
    name: 'spaces',
    text: 'Spaces',
    icon: <SpacesIcon className="h-5 w-5" />,
    createActionTooltip: 'New Space',
  },
  {
    name: 'jobs',
    text: 'Jobs',
    icon: <JobsIcon className="h-5 w-5" />,
    // No createActionTooltip (uses default behavior)
  },
  {
    name: 'develop',
    text: 'Develop',
    icon: <CodeIcon className="h-5 w-5" />,
  },
];
```

## Mode Change Handling

When a navigation item is clicked:

```tsx
const handleModeChange = useCallback(({ mode }: FxModeChangeDetail) => {
  // Typically navigate to create screen for the new section
  goToCreate(mode as NavSection);
}, [goToCreate]);

<FxLayout
  mode={currentSection}
  navItems={navItems}
  onModeChange={handleModeChange}
/>
```

## Add Button (+) Behavior

The + button in navigation flyouts triggers `onAddClick` with the mode:

```tsx
const handleAddClick = useCallback((detail?: { mode: string }) => {
  if (detail?.mode) {
    // Clicked from nav flyout - go to that section's create screen
    goToCreate(detail.mode as NavSection);
  } else {
    // Clicked from elsewhere - use current section
    goToCreate();
  }
}, [goToCreate]);

<FxLayout
  onAddClick={handleAddClick}
/>
```

## Available Icons

The library exports common navigation icons:

```tsx
import {
  ConversationsIcon,
  DiscoverIcon,
  SpacesIcon,
  JobsIcon,
  CodeIcon,
  JouleIcon,
} from '@sap-ui/fx-components';
```

Or use any React icon component (Lucide, Material Icons, etc.):

```tsx
import { MessageSquare, Search, Folder, Clock, Code } from 'lucide-react';

const navItems = [
  { name: 'chat', icon: <MessageSquare className="h-5 w-5" />, text: 'Chat' },
  // ...
];
```

## Side Navigation Behavior

### Collapsed Mode (Default)

- Shows only icons
- Hovering shows flyout with text, badge, and + button
- Flyout disabled when `locked` (e.g., when item has its own popover open)

### Expanded Mode

- Shows icons, text, badges, and + buttons inline
- Toggle via collapse/expand button at bottom of nav

### Keyboard Navigation

- Arrow Up/Down to move between items
- Enter/Space to select
- Escape to close flyout

## Checking Current Nav Item Config

Access the current nav item's config in your app:

```tsx
const currentNavItem = useMemo(
  () => navItems.find((item) => item.name === currentSection),
  [navItems, currentSection]
);

// Use for conditional logic
const startPaneAllowed = !currentNavItem?.noStartPane;
const isUtilityEndPane = currentNavItem?.utilityEndPane ?? false;
```
