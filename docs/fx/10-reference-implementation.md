# Reference Implementation

The `el-demo` application serves as the reference implementation for FX components. This guide explains the key patterns and architecture decisions.

## Application Structure

```
demos/el-demo/src/
├── App.tsx              # Main application component
├── hooks/
│   ├── index.ts
│   └── useAppState.ts   # Central state management
├── components/
│   ├── ChatMessage.tsx      # Chat bubble component (app-specific)
│   ├── NotificationsPanel.tsx # Notifications UI (app-specific)
│   ├── ConversationsList.tsx
│   ├── ConversationDetail.tsx
│   ├── SpacesList.tsx
│   ├── SpaceDetail.tsx
│   ├── JobsList.tsx
│   ├── JobDetail.tsx
│   ├── ProjectsList.tsx
│   ├── ProjectDetail.tsx
│   ├── ChatPane.tsx
│   ├── SettingsNav.tsx
│   ├── SettingsContent.tsx
│   └── ...
├── data/
│   └── index.ts         # Sample data
└── types/
    └── index.ts         # TypeScript types
```

## State Management Pattern

### useAppState Hook

The `useAppState` hook centralizes all layout-related state:

```tsx
export function useAppState() {
  // Navigation
  const [currentSection, setCurrentSection] = useState<NavSection>('conversations');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isHomePage, setIsHomePage] = useState(true);

  // Search
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Layout visibility
  const [hideStart, setHideStart] = useState(true);
  const [hideEnd, setHideEnd] = useState(true);
  const [priorityPane, setPriorityPane] = useState<'Start' | 'Center' | 'End'>('Center');

  // End pane content
  const [endPaneContent, setEndPaneContent] = useState<{
    type: 'chat' | 'sources' | null;
    itemId?: string;
    sourceCount?: number;
  }>({ type: null });

  // Drilldown state
  const [jobDrilldown, setJobDrilldown] = useState<JobDrilldown | null>(null);
  const [spaceDrilldown, setSpaceDrilldown] = useState<SpaceDrilldown | null>(null);

  // Settings
  const [settingsState, setSettingsState] = useState<SettingsState>({
    selectedSectionId: 'appearance',
    searchQuery: '',
  });

  // ... actions and handlers
}
```

### Key Actions

```tsx
// Switch navigation section
const switchSection = useCallback((section: NavSection) => {
  setCurrentSection(section);
  // Reset state appropriately for the section
  // ...
}, []);

// Select an item from list
const selectItem = useCallback((itemId: string | null) => {
  setSelectedItemId(itemId);
  setIsHomePage(false);
  setPriorityPane('Center'); // Focus center on selection
}, []);

// Open end pane with content
const openEndPane = useCallback((
  type: 'chat' | 'sources',
  itemId?: string,
  initialMessage?: string,
  sourceCount?: number
) => {
  setEndPaneContent({ type, itemId, initialMessage, sourceCount });
  setHideEnd(false);
  setPriorityPane('End'); // Show end pane on mobile
}, []);

// Go to create screen
const goToCreate = useCallback((section?: NavSection) => {
  setSelectedItemId(null);
  // Configure layout for create mode
  // ...
}, []);
```

## Render Patterns

### Conditional Content by Section

```tsx
const renderCenterContent = () => {
  if (currentSection === 'settings') {
    return <SettingsContent sectionId={settingsState.selectedSectionId} />;
  }

  if (currentSection === 'conversations') {
    if (isHomePage) {
      return <ConversationsHomePage onSubmit={handleSubmit} />;
    }
    if (selectedItem) {
      return <ConversationDetail conversation={selectedItem} />;
    }
  }

  if (currentSection === 'spaces') {
    if (selectedItem) {
      return <SpaceDetail space={selectedItem} />;
    }
    return <SpacesCreatePage />;
  }

  // Similar for jobs, develop...
};
```

### Conditional Actions by Section

```tsx
const renderCenterHeaderActions = () => {
  if (!selectedItemId) return null;

  switch (currentSection) {
    case 'conversations':
      return (
        <>
          <FxPaneHeaderAction icon={<Pencil />} text="Rename" priority="alwaysOverflow" />
          <FxPaneHeaderAction icon={<Download />} text="Export" priority="alwaysOverflow" />
          <FxPaneHeaderAction icon={<Trash2 />} text="Delete" priority="alwaysOverflow" />
        </>
      );

    case 'spaces':
      return (
        <>
          <FxPaneHeaderAction icon={<Pencil />} text="Rename" priority="alwaysOverflow" />
          <FxPaneHeaderAction icon={<TrendingUp />} text="Insights" design={showInsights ? "Emphasized" : "Transparent"} />
        </>
      );

    case 'develop':
      return (
        <>
          <FxPaneHeaderSegmentedAction selectedId={viewMode} centered priority="high">
            <FxPaneHeaderSegmentedOption id="view" icon={<Eye />} text="View" />
            <FxPaneHeaderSegmentedOption id="edit" icon={<Code />} text="Edit" />
            <FxPaneHeaderSegmentedOption id="test" icon={<TestTube />} text="Test" />
          </FxPaneHeaderSegmentedAction>
          <FxPaneHeaderAction icon={<Rocket />} text="Deploy" showText priority="high" />
          <FxPaneHeaderSplitAction icon={<ExternalLink />} text="Open" showText>
            <FxPaneHeaderSplitOption id="vscode" text="VS Code" />
            <FxPaneHeaderSplitOption id="bas" text="BAS" />
          </FxPaneHeaderSplitAction>
        </>
      );

    default:
      return null;
  }
};
```

## Drilldown Pattern

For hierarchical navigation (e.g., Job → Run → Details):

```tsx
interface JobDrilldown {
  level1?: { id: string; title: string; type: 'run' | 'section' };
  level2?: { id: string; title: string; type: string };
}

// Enter drilldown
const enterJobDrilldown = useCallback((drilldown) => {
  setJobDrilldown({ level1: drilldown });
}, []);

// Exit drilldown (go back one level)
const exitJobDrilldown = useCallback(() => {
  setJobDrilldown(prev => {
    if (!prev) return null;
    if (prev.level2) return { level1: prev.level1 }; // Back to level 1
    return null; // Exit drilldown
  });
}, []);

// Breadcrumbs based on drilldown
const breadcrumbs = useMemo(() => {
  if (!jobDrilldown || !selectedItem) return undefined;

  const items = [];
  if (jobDrilldown.level1) {
    items.push(<BreadcrumbsItem key="job">{selectedItem.name}</BreadcrumbsItem>);
  }
  if (jobDrilldown.level2) {
    items.push(<BreadcrumbsItem key="l1">{jobDrilldown.level1.title}</BreadcrumbsItem>);
  }

  return items.length > 0 ? (
    <Breadcrumbs design="NoCurrentPage" onItemClick={exitJobDrilldown}>
      {items}
    </Breadcrumbs>
  ) : undefined;
}, [jobDrilldown, selectedItem, exitJobDrilldown]);
```

## Title Editing Pattern

```tsx
const [titleEditMode, setTitleEditMode] = useState(false);
const [customNames, setCustomNames] = useState<Record<string, string>>({});

// Get display name (custom or original)
const getItemDisplayName = useCallback((itemId: string, originalName: string) => {
  return customNames[itemId] ?? originalName;
}, [customNames]);

// Handle rename
const handleTitleRename = useCallback((detail: { value: string; previousValue: string }) => {
  if (selectedItemId && detail.value !== detail.previousValue) {
    setCustomNames(prev => ({ ...prev, [selectedItemId]: detail.value }));
  }
  setTitleEditMode(false);
}, [selectedItemId]);

// Reset edit mode on item change
useEffect(() => {
  setTitleEditMode(false);
}, [selectedItemId]);
```

## Event Handler Coordination

### onLayoutChange + onVisibilityChange

```tsx
// Handle internal layout changes (toggle buttons)
const handleLayoutChange = useCallback((change: FxLayoutChangeDetail) => {
  if (change.priorityPane !== undefined) setPriorityPane(change.priorityPane);
  if (change.hideStart !== undefined) setHideStart(change.hideStart);
  if (change.hideEnd !== undefined) {
    setHideEnd(change.hideEnd);
    if (change.hideEnd) setEndPaneContent({ type: null });
  }
}, []);

// Handle visibility changes (set content type)
const handleVisibilityChange = useCallback(({ pane, visible }) => {
  if (pane === 'end') {
    if (visible) {
      setEndPaneContent({
        type: currentSection === 'conversations' ? 'sources' : 'chat'
      });
    } else {
      setEndPaneContent({ type: null });
    }
  }
}, [currentSection]);
```

### onModeChange + onAddClick

```tsx
// Navigate to create screen on mode change
const handleModeChange = useCallback(({ mode }) => {
  goToCreate(mode as NavSection);
}, [goToCreate]);

// Handle add button from nav or header
const handleAddClick = useCallback((detail?: { mode: string }) => {
  if (detail?.mode) {
    goToCreate(detail.mode as NavSection);
  } else {
    goToCreate(); // Current section
  }
}, [goToCreate]);
```

## What's App Logic vs. FX Components

| Responsibility | FX Components | Your App |
|---------------|---------------|----------|
| Layout structure | ✓ | |
| Pane visibility logic | ✓ | State management |
| Navigation rail | ✓ | Item configuration |
| Header rendering | ✓ | Action configuration |
| Overflow handling | ✓ | |
| Responsive behavior | ✓ | Priority decisions |
| Notifications button | ✓ | Panel UI |
| Chat message display | | ✓ |
| List rendering | | ✓ |
| Detail rendering | | ✓ |
| Data fetching | | ✓ |
| Business logic | | ✓ |
| Custom actions | | ✓ |

## Notifications Pattern

FxLayout provides the notifications button with badge, but your app provides the notifications panel:

```tsx
// State for notifications
const [notificationsOpen, setNotificationsOpen] = useState(false);
const [notificationsOpener, setNotificationsOpener] = useState<HTMLElement | null>(null);

<FxLayout
  notificationsBadge={3}
  notificationsLocked={notificationsOpen}  // Lock flyout while panel is open
  onNotificationsClick={(opener) => {
    setNotificationsOpener(opener);
    setNotificationsOpen(true);
  }}
  // ...
/>

{/* Your notifications panel - use ResponsivePopover for mobile dialog support */}
<NotificationsPanel
  open={notificationsOpen}
  opener={notificationsOpener}
  onClose={() => setNotificationsOpen(false)}
/>
```

See `components/NotificationsPanel.tsx` for a sample implementation using `ResponsivePopover`.

## Chat Message Pattern

FxLayout does not prescribe how chat messages are displayed. Your app provides the chat UI:

```tsx
// components/ChatMessage.tsx - simple chat bubble
export const ChatMessage = ({ type, children, timestamp }) => {
  const isUser = type === 'user';
  return (
    <div className={isUser ? 'justify-end' : 'justify-start'}>
      <div className={isUser ? 'bg-primary/10 rounded-2xl' : ''}>
        {children}
      </div>
    </div>
  );
};

// Usage in ConversationDetail.tsx
{messages.map((msg, i) => (
  <ChatMessage key={i} type={msg.role}>
    {msg.content}
  </ChatMessage>
))}
```

See `components/ChatMessage.tsx` for the full implementation with Figma-spec styling.
