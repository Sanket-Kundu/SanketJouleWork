# Pane Management

This guide covers how to control pane visibility, handle responsive layouts, and manage the priority system.

## The Three Panes

| Pane | Purpose | Typical Content |
|------|---------|-----------------|
| **Start** | Navigation/List | Item lists, navigation trees, settings nav |
| **Center** | Primary Content | Detail views, editors, forms |
| **End** | Secondary Content | AI chat (Joule), sources, contextual info |

## Visibility Control

### Props

```tsx
<FxLayout
  hideStart={hideStart}    // boolean - hide start pane
  hideEnd={hideEnd}        // boolean - hide end pane
  suppressEnd={true}       // boolean - completely remove end pane
/>
```

### Visibility vs. Suppress

- **`hideStart`/`hideEnd`**: Pane exists but is hidden. Can be shown via toggle buttons.
- **`suppressEnd`**: Pane is completely removed from the layout. Use for modes that don't have an end pane (e.g., create screens, settings).

```tsx
// Suppress end pane in create mode
const isCreateMode = !selectedItemId && ['spaces', 'jobs', 'develop'].includes(currentSection);

<FxLayout
  suppressEnd={isCreateMode || currentSection === 'settings'}
/>
```

## Priority System

When screen width is limited, not all panes can be shown simultaneously. The `priorityPane` prop determines which pane takes precedence.

### Priority Values

| Value | Effect |
|-------|--------|
| `'Start'` | Start pane visible, others hidden on mobile |
| `'Center'` | Center pane visible (default) |
| `'End'` | End pane visible |

### Responding to Layout Changes

FxLayout fires `onLayoutChange` when internal toggles are clicked. Your app should update its state accordingly:

```tsx
const [hideStart, setHideStart] = useState(true);
const [hideEnd, setHideEnd] = useState(true);
const [priorityPane, setPriorityPane] = useState<'Start' | 'Center' | 'End'>('Center');

const handleLayoutChange = useCallback((change: FxLayoutChangeDetail) => {
  if (change.priorityPane !== undefined) {
    setPriorityPane(change.priorityPane);
  }
  if (change.hideStart !== undefined) {
    setHideStart(change.hideStart);
  }
  if (change.hideEnd !== undefined) {
    setHideEnd(change.hideEnd);
  }
}, []);

<FxLayout
  hideStart={hideStart}
  hideEnd={hideEnd}
  priorityPane={priorityPane}
  onLayoutChange={handleLayoutChange}
/>
```

### Opening the End Pane

When programmatically opening the end pane (e.g., clicking "Sources" button), set priority to `'End'`:

```tsx
const openEndPane = useCallback((type: 'chat' | 'sources', itemId?: string) => {
  setEndPaneContent({ type, itemId });
  setHideEnd(false);
  setPriorityPane('End'); // Important! Shows end pane on mobile
}, []);
```

### Selecting an Item (Center Focus)

When selecting an item from the list, set priority to `'Center'`:

```tsx
const selectItem = useCallback((itemId: string) => {
  setSelectedItemId(itemId);
  setPriorityPane('Center'); // Show detail view
}, []);
```

## Utility End Pane

The end pane can be either:

1. **AI Chat Pane**: Interactive Joule assistant (default)
2. **Utility Pane**: Static content like sources, settings

Configure per navigation mode:

```tsx
const navItems: FxNavItemConfig[] = [
  {
    name: 'conversations',
    utilityEndPane: true, // End pane shows sources, not Joule chat
  },
  {
    name: 'spaces',
    // utilityEndPane: false (default) - End pane is Joule chat
  },
];
```

When `utilityEndPane` is true:
- End pane toggle button is hidden from center header
- End pane opens via explicit actions (e.g., "Sources" button in message footer)

## Suppressing Toggle Buttons

Control which toggle buttons appear in headers:

```tsx
<FxPaneHeader
  pane="center"
  suppressStartToggleButton={!startPaneAllowed}  // Hide if no start pane
  suppressEndToggleButton={isUtilityEndPane || isCreateMode}  // Hide in certain modes
/>
```

### When to Suppress

| Scenario | Suppress Start | Suppress End |
|----------|---------------|--------------|
| `noStartPane` mode (discover) | ✓ | - |
| `utilityEndPane` mode | - | ✓ |
| Create mode (no item selected) | - | ✓ |
| Settings mode | ✓ | ✓ |

## Visibility Change Events

The `onVisibilityChange` callback fires when pane visibility changes via toggle buttons:

```tsx
const handleVisibilityChange = useCallback(
  ({ pane, visible }: { pane: 'start' | 'center' | 'end'; visible: boolean }) => {
    if (pane === 'end') {
      if (visible) {
        // Set content type based on current mode
        if (currentSection === 'conversations') {
          setEndPaneContent({ type: 'sources' });
        } else {
          setEndPaneContent({ type: 'chat' });
        }
      } else {
        // Pane is being hidden - clear content
        setEndPaneContent({ type: null });
      }
    }
  },
  [currentSection]
);
```

## Common Patterns

### Initial State by Section

```tsx
const switchSection = useCallback((section: NavSection) => {
  setCurrentSection(section);

  if (section === 'conversations') {
    // Home page: center only
    setHideStart(true);
    setHideEnd(true);
  } else if (section === 'discover') {
    // No start pane
    setHideStart(true);
    setHideEnd(true);
  } else {
    // List + detail (spaces, jobs, develop)
    setHideStart(false);
    setHideEnd(true);
  }

  setPriorityPane('Center');
}, []);
```

### Creating a New Item

```tsx
const goToCreate = useCallback((section?: NavSection) => {
  setSelectedItemId(null);

  if (targetSection === 'conversations') {
    // Conversations: show home page
    setIsHomePage(true);
    setHideStart(true);
    setHideEnd(true);
  } else {
    // Other sections: show list + create view
    setHideStart(false);
    setHideEnd(true);
  }

  setPriorityPane('Center');
}, []);
```

### After Creating (Selecting New Item)

```tsx
const createConversation = useCallback((conversationId: string) => {
  setIsHomePage(false);
  setHideStart(false);  // Show list
  setHideEnd(true);     // Chat happens in center pane
  setSelectedItemId(conversationId);
  setPriorityPane('Center');
}, []);
```
