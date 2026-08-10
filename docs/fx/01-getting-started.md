# Getting Started

## Installation

The FX components are part of the `@sap-ui/fx-components` package:

```bash
npm install @sap-ui/fx-components
```

## Required Setup

### 1. Import Styles

Import the component styles in your app's entry point:

```tsx
// main.tsx or App.tsx
import '@sap-ui/fx-components/dist/style.css';
```

### 2. Theme Provider

Wrap your app with the ThemeProvider for theme support:

```tsx
import { ThemeProvider } from '@sap-ui/fx-components';

const THEMES = [
  { id: 'light', name: 'Light', category: 'Standard' },
  { id: 'dark', name: 'Dark', category: 'Standard' },
  { id: 'system', name: 'System', category: 'Standard' },
];

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ThemeProvider themes={THEMES}>
    <App />
  </ThemeProvider>
);
```

### 3. I18n Provider (Optional)

For internationalization support:

```tsx
import { I18nProvider, ThemeProvider } from '@sap-ui/fx-components';

<ThemeProvider themes={THEMES}>
  <I18nProvider locale="en-US" dir="ltr">
    <App />
  </I18nProvider>
</ThemeProvider>
```

## Basic Layout Structure

```tsx
import {
  FxLayout,
  FxPaneHeader,
  FxPromptInput,
} from '@sap-ui/fx-components';

function App() {
  const [mode, setMode] = useState('conversations');

  return (
    <div className="h-screen w-screen overflow-hidden">
      <FxLayout
        mode={mode}
        navItems={navItems}
        onModeChange={({ mode }) => setMode(mode)}
        startHeader={startHeader}
        centerHeader={centerHeader}
        endHeader={endHeader}
        startContent={startContent}
        centerContent={centerContent}
        endContent={endContent}
        input={<FxPromptInput placeholder="Ask Joule..." />}
      />
    </div>
  );
}
```

## Imports Reference

### Main Components

```tsx
import {
  // Layout
  FxLayout,

  // Headers
  FxPaneHeader,
  FxPaneHeaderAction,
  FxPaneHeaderSegmentedAction,
  FxPaneHeaderSegmentedOption,
  FxPaneHeaderSplitAction,
  FxPaneHeaderSplitOption,

  // Input
  FxPromptInput,

  // Icons (convenience exports)
  ConversationsIcon,
  DiscoverIcon,
  SpacesIcon,
  JobsIcon,
  CodeIcon,
  JouleIcon,

  // User Menu
  FxUserMenu,
  FxUserMenuItem,
  FxUserMenuItemGroup,
} from '@sap-ui/fx-components';
```

### Types

```tsx
import type {
  // Navigation
  FxNavItemConfig,

  // Layout Events
  FxLayoutChangeDetail,
  FxModeChangeDetail,
  FxVisibilityChangeDetail,

  // Header
  FxPaneHeaderProps,
  FxRelationItem,
  ActionPriority,

  // Prompt Input
  FxPromptInputContextItem,
  FxTypeaheadSuggestion,
  FxTypeaheadRequest,

  // User Menu
  FxUserMenuAccountData,
  FxUserMenuItemClickDetail,
  FxUserMenuChangeAccountDetail,
  FxUserMenuItemCheckMode,
} from '@sap-ui/fx-components';
```

## Full Example

See the [el-demo](../../demos/el-demo/) application for a complete reference implementation showing all features working together.
