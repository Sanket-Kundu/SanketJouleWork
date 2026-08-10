# FX Components Documentation

This documentation provides a comprehensive guide for integrating and using the FX (Fiori Experience) layout components in your React application. These components provide a modern, responsive three-pane layout system with AI-first design patterns.

## Table of Contents

1. [Getting Started](./01-getting-started.md) - Installation and basic setup
2. [FxLayout](./02-fx-layout.md) - The main layout container component
3. [Pane Management](./03-pane-management.md) - Controlling pane visibility and priority
4. [Navigation Items](./04-navigation-items.md) - Configuring the side navigation
5. [FxPaneHeader](./05-fx-pane-header.md) - Header component with actions
6. [Header Actions](./06-header-actions.md) - Regular, segmented, and split actions
7. [FxPromptInput](./07-fx-prompt-input.md) - AI prompt input component
8. [User Menu & Notifications](./08-user-menu-notifications.md) - User account and notification panels
9. [Styling & Theming](./09-styling-theming.md) - Customization options
10. [Reference Implementation](./10-reference-implementation.md) - el-demo patterns

## Component Overview

| Component | Purpose |
|-----------|---------|
| `FxLayout` | Main container with three-pane layout, side navigation, and input |
| `FxPaneHeader` | Header bar for each pane with title, actions, breadcrumbs |
| `FxPaneHeaderAction` | Standard action button in header |
| `FxPaneHeaderSegmentedAction` | Toggle group action (View/Edit/Test) |
| `FxPaneHeaderSplitAction` | Button with dropdown menu |
| `FxPromptInput` | AI prompt input with actions menu and context chips |
| `FxSideNavigation` | Collapsible side navigation (internal to FxLayout) |

## What's Part of FX Components vs. Your App

**FX Components provide:**
- Layout structure (three panes, side navigation, responsive behavior)
- Header components with overflow handling
- Navigation rail with expand/collapse
- Prompt input with typeahead
- User menu infrastructure
- Notifications button with badge (apps provide their own notifications UI)

**Your application provides:**
- Navigation item configuration (icons, labels, badges)
- Pane content (lists, detail views, forms)
- Chat message display (FX does not prescribe message formatting)
- Notifications panel UI (FX fires click event, you show the panel)
- Action handlers (what happens on click)
- Application state management
- Data fetching and business logic

## Quick Start

```tsx
import {
  FxLayout,
  FxPaneHeader,
  FxPaneHeaderAction,
  FxPromptInput,
} from '@sap-ui/fx-components';

function App() {
  return (
    <FxLayout
      mode="conversations"
      navItems={[
        { name: 'conversations', text: 'Conversations', icon: <ChatIcon /> },
        { name: 'spaces', text: 'Spaces', icon: <SpaceIcon /> },
      ]}
      startHeader={<FxPaneHeader title="Conversations" pane="start" />}
      centerHeader={<FxPaneHeader title="Selected Item" pane="center" />}
      startContent={<YourListComponent />}
      centerContent={<YourDetailComponent />}
      input={<FxPromptInput placeholder="Ask Joule..." />}
    />
  );
}
```

## Design Philosophy

The FX layout follows these principles:

1. **AI-First**: Joule AI assistant is integrated at the layout level
2. **Responsive**: Automatically adapts from mobile to desktop
3. **Priority-Based**: When space is limited, priority determines which pane shows
4. **Utility vs. Chat Panes**: End pane can be AI chat or utility content (sources, settings)
5. **Progressive Disclosure**: Actions overflow to menu when space is constrained
