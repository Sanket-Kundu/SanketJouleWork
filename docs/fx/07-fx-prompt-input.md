# FxPromptInput

The `FxPromptInput` component provides an AI-focused text input with actions menu, context chips, typeahead suggestions, and voice input buttons.

## Basic Usage

```tsx
import { FxPromptInput } from '@sap-ui/fx-components';

<FxPromptInput
  placeholder="Ask Joule anything..."
  onSubmit={({ value }) => console.log('Submitted:', value)}
/>
```

## Props Reference

### Core Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Controlled input value |
| `placeholder` | `string` | - | Placeholder text |
| `disabled` | `boolean` | `false` | Disabled state |
| `mode` | `'oneline' \| 'multiline'` | `'oneline'` | Input mode |

### Messages

| Prop | Type | Description |
|------|------|-------------|
| `statusMessage` | `string` | Status text above input (e.g., "Thinking...") |
| `disclaimerMessage` | `string` | Disclaimer text below input |

### Voice Buttons

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showDictate` | `boolean` | `true` | Show dictate (microphone) button |
| `showVoice` | `boolean` | `true` | Show voice (speaker) button |

### Actions Menu

| Prop | Type | Description |
|------|------|-------------|
| `actions` | `ReactNode` | Menu items for the + button dropdown |
| `onActionSelect` | `(detail: { action }) => void` | Action selected from menu |
| `onPlusPress` | `() => void` | + button clicked (without menu) |

### Context Items

| Prop | Type | Description |
|------|------|-------------|
| `contextItems` | `FxPromptInputContextItem[]` | Context chips (e.g., selected space) |
| `onContextItemRemove` | `(detail: { item }) => void` | Context item removed |

### Typeahead

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `typeaheadEnabled` | `boolean` | `true` | Enable typeahead suggestions |
| `maxSuggestions` | `number` | `5` | Max suggestions to display |
| `debounceMs` | `number` | `150` | Debounce delay in ms |
| `onTypeaheadRequest` | `(detail: FxTypeaheadRequest) => Promise<FxTypeaheadSuggestion[]>` | Suggestion provider |

### Event Handlers

| Prop | Type | Description |
|------|------|-------------|
| `onSubmit` | `(detail: { value }) => void` | Enter pressed or send button clicked |
| `onLiveChange` | `(detail: { value }) => void` | Real-time value changes |
| `onDictatePress` | `() => void` | Dictate button clicked |
| `onVoicePress` | `() => void` | Voice button clicked |

## Actions Menu

Add menu items that appear when clicking the + button:

```tsx
import { MenuItem } from '@sap-ui/fx-components';

const actions = (
  <>
    <MenuItem icon={<LayoutGrid className="h-4 w-4" />} text="Create Space" />
    <MenuItem icon={<Bot className="h-4 w-4" />} text="Agent Mode" />
    <MenuItem icon={<Microscope className="h-4 w-4" />} text="Deep Research" />
    <MenuItem icon={<Search className="h-4 w-4" />} text="Search" />
    <MenuItem icon={<Paperclip className="h-4 w-4" />} text="Add Attachment" />
  </>
);

<FxPromptInput
  placeholder="Ask Joule..."
  actions={actions}
  onActionSelect={({ action }) => console.log('Selected:', action.text)}
  onSubmit={handleSubmit}
/>
```

## Context Items

Show contextual information as removable chips:

```tsx
const [contextItems, setContextItems] = useState<FxPromptInputContextItem[]>([
  { id: 'space1', icon: <SpacesIcon />, label: 'Sales Analytics' },
  { id: 'doc1', icon: <FileIcon />, label: 'Q4 Report.pdf' },
]);

const handleContextItemRemove = useCallback((detail: { item: FxPromptInputContextItem }) => {
  setContextItems(prev => prev.filter(item => item.id !== detail.item.id));
}, []);

<FxPromptInput
  contextItems={contextItems}
  onContextItemRemove={handleContextItemRemove}
/>
```

### FxPromptInputContextItem

```tsx
interface FxPromptInputContextItem {
  id: string;        // Unique identifier
  icon?: ReactNode;  // Icon element
  label: string;     // Display text
  removable?: boolean; // Can be removed (default: true)
}
```

## Typeahead Suggestions

Provide real-time suggestions as the user types:

```tsx
const handleTypeaheadRequest = useCallback(
  async (detail: FxTypeaheadRequest): Promise<FxTypeaheadSuggestion[]> => {
    const { value, signal } = detail;

    // Fetch suggestions from your backend
    const response = await fetch(`/api/suggestions?q=${encodeURIComponent(value)}`, {
      signal, // Allows cancellation
    });

    if (!response.ok) return [];

    const data = await response.json();

    return data.suggestions.map((s: string) => ({
      text: s,
      label: s, // Optional: different display text
      probability: 0.9, // Optional: confidence score
    }));
  },
  []
);

<FxPromptInput
  typeaheadEnabled
  maxSuggestions={5}
  debounceMs={200}
  onTypeaheadRequest={handleTypeaheadRequest}
/>
```

### FxTypeaheadSuggestion

```tsx
interface FxTypeaheadSuggestion {
  text: string;                          // Completion text to append
  label?: string;                        // Display label (defaults to text)
  probability?: number;                  // Confidence score 0-1
  metadata?: Record<string, unknown>;    // Extensible metadata
}
```

### FxTypeaheadRequest

```tsx
interface FxTypeaheadRequest {
  value: string;         // Current input value
  requestId: number;     // For ordering/stale detection
  cursorPosition?: number; // Cursor position
  signal: AbortSignal;   // For cancellation
}
```

## Layout Integration

### In FxLayout

Pass the input to `FxLayout.input`:

```tsx
const showInput = !isCreateMode && currentSection !== 'settings';

<FxLayout
  input={showInput ? <FxPromptInput placeholder="Ask Joule..." /> : undefined}
/>
```

### On Create Screens

Embed directly in your create screen content:

```tsx
const CreateScreen = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <JouleIcon size={64} />
    <h1>Start a new conversation</h1>
    <div className="w-full max-w-2xl">
      <FxPromptInput
        placeholder="Ask Joule anything..."
        onSubmit={handleSubmit}
      />
    </div>
  </div>
);
```

## Handling Submit

```tsx
const handleSubmit = useCallback(({ value }: { value: string }) => {
  if (!value.trim()) return;

  // On conversations home page, create a new conversation
  if (currentSection === 'conversations' && isHomePage) {
    createConversation(value);
    return;
  }

  // On create screens, create the item
  if (!selectedItemId && ['spaces', 'jobs', 'develop'].includes(currentSection)) {
    createItem(currentSection, value);
    return;
  }

  // With selected item, send message to AI
  if (selectedItemId) {
    sendMessage(value);
    // Open chat pane if not already open
    if (hideEnd) {
      openEndPane('chat', selectedItemId);
    }
  }
}, [currentSection, isHomePage, selectedItemId, hideEnd]);
```

## Ref API

```tsx
const inputRef = useRef<FxPromptInputRef>(null);

// Available methods:
inputRef.current?.focus();
inputRef.current?.clear();
inputRef.current?.getValue();
inputRef.current?.setValue('New value');
inputRef.current?.getNativeElement();
```

## Complete Example

```tsx
const [contextItems, setContextItems] = useState<FxPromptInputContextItem[]>([
  { id: 'space1', icon: <SpacesIcon />, label: 'Space' },
]);

const actions = (
  <>
    <MenuItem icon={<LayoutGrid />} text="Create Space" />
    <MenuItem icon={<Bot />} text="Agent Mode" />
    <MenuItem icon={<Search />} text="Search" />
    <MenuItem icon={<Paperclip />} text="Add Attachment" />
  </>
);

<FxPromptInput
  placeholder="Ask Joule anything..."
  contextItems={contextItems}
  onContextItemRemove={({ item }) => {
    setContextItems(prev => prev.filter(i => i.id !== item.id));
  }}
  actions={actions}
  onActionSelect={({ action }) => handleAction(action)}
  onSubmit={({ value }) => handleSubmit(value)}
  typeaheadEnabled
  onTypeaheadRequest={handleTypeahead}
/>
```
