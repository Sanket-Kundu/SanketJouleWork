# FxLayout

The `FxLayout` component is the main container that provides the three-pane layout structure with side navigation, headers, content areas, and the AI prompt input.

## Basic Usage

```tsx
<FxLayout
  mode="conversations"
  navItems={navItems}
  onModeChange={handleModeChange}
  startHeader={<FxPaneHeader title="List" pane="start" />}
  centerHeader={<FxPaneHeader title="Details" pane="center" />}
  startContent={<YourList />}
  centerContent={<YourDetail />}
  input={<FxPromptInput />}
/>
```

## Props Reference

### Core Layout Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mode` | `string` | - | Current navigation mode (matches `navItems[].name`) |
| `navItems` | `FxNavItemConfig[]` | `[]` | Navigation item configurations |
| `hideStart` | `boolean` | `false` | Hide the start (left) pane |
| `hideCenter` | `boolean` | `false` | Hide the center pane |
| `hideEnd` | `boolean` | `false` | Hide the end (right) pane |
| `priorityPane` | `'Start' \| 'Center' \| 'End'` | `'Center'` | Which pane to show when space is limited |
| `suppressEnd` | `boolean` | `false` | Completely remove end pane (not just hide) |

### Content Slots

| Prop | Type | Description |
|------|------|-------------|
| `startHeader` | `ReactElement<FxPaneHeaderProps>` | Header for start pane (must be `FxPaneHeader`) |
| `centerHeader` | `ReactElement<FxPaneHeaderProps>` | Header for center pane (must be `FxPaneHeader`) |
| `endHeader` | `ReactElement<FxPaneHeaderProps>` | Header for end pane (must be `FxPaneHeader`) |
| `startContent` | `ReactNode` | Content for start pane (lists, navigation) |
| `centerContent` | `ReactNode` | Content for center pane (detail views) |
| `endContent` | `ReactNode` | Content for end pane (chat, sources) |
| `input` | `ReactNode` | Prompt input component |

**Note:** Header slots are typed as `ReactElement<FxPaneHeaderProps>` because FxLayout injects props into the headers (like `showBorder` for scroll state). Always use `FxPaneHeader` for these slots.

### User Menu Props

| Prop | Type | Description |
|------|------|-------------|
| `userMenu` | `ReactElement<FxUserMenuProps>` | Complete FxUserMenu element (FxLayout controls open/close/dialog mode) |

### Notifications Props

| Prop | Type | Description |
|------|------|-------------|
| `notificationsBadge` | `string \| number` | Badge count on notifications button |
| `notificationsLocked` | `boolean` | Lock notifications nav item (disables flyout hover when panel is open) |

### Event Handlers

| Prop | Type | Description |
|------|------|-------------|
| `onModeChange` | `(detail: FxModeChangeDetail) => void` | Navigation mode changed |
| `onVisibilityChange` | `(detail: FxVisibilityChangeDetail) => void` | Pane visibility changed |
| `onLayoutChange` | `(detail: FxLayoutChangeDetail) => void` | Layout dimensions changed |
| `onAddClick` | `(detail?: { mode: string }) => void` | Add button clicked |
| `onNotificationsClick` | `(opener: HTMLElement) => void` | Notifications button clicked (receives button element for anchoring) |

## Layout Behavior

### Responsive Breakpoints

The layout automatically adjusts based on available width:

| Available Width | Max Panes | Behavior |
|-----------------|-----------|----------|
| **≥1965px** | 3 | All three panes can be visible simultaneously |
| **≥1020px** | 2 | Two panes visible, third hidden or overlapping |
| **<1020px** | 1 | Single pane visible, priority determines which |

### Priority Pane

When space is constrained, `priorityPane` determines which pane is shown:

```tsx
// Show end pane (chat) when opening it on mobile
<FxLayout
  priorityPane="End"
  hideEnd={false}
  // ...
/>
```

**Important:** Update `priorityPane` in your `onLayoutChange` handler to respond to internal toggle button clicks:

```tsx
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
```

### Settings Mode

FxLayout has built-in support for a "settings" mode. When `mode="settings"`:

- **End pane is suppressed** - No end pane toggle button, no chat/AI panel
- **Start pane is allowed** - Can show settings navigation
- **Input is hidden** - No prompt input in settings mode

This is a reserved mode name that doesn't require a nav item configuration:

```tsx
// Enter settings mode (e.g., from user menu)
const handleUserMenuItemClick = useCallback((detail: FxUserMenuItemClickDetail) => {
  if (detail.text === 'Settings') {
    setCurrentMode('settings');  // Built-in mode
    setHideStart(false);         // Show settings navigation
  }
}, []);

// Settings mode automatically:
// - Suppresses end pane and toggle button
// - Hides prompt input
<FxLayout
  mode={currentMode}
  navItems={navItems}  // No "settings" nav item needed
  // ...
/>
```

## Example: Full Configuration

```tsx
<FxLayout
  // Navigation
  mode={currentSection}
  navItems={navItems}
  onModeChange={({ mode }) => goToCreate(mode)}
  onAddClick={({ mode }) => goToCreate(mode)}

  // Pane visibility
  hideStart={hideStart}
  hideEnd={hideEnd}
  priorityPane={priorityPane}
  suppressEnd={isCreateMode}
  onLayoutChange={handleLayoutChange}
  onVisibilityChange={handleVisibilityChange}

  // Headers
  startHeader={startHeader}
  centerHeader={centerHeader}
  endHeader={endHeader}

  // Content
  startContent={renderStartContent()}
  centerContent={renderCenterContent()}
  endContent={renderEndContent()}

  // Input
  input={promptInput}

  // User menu (complete element - FxLayout injects open/close/dialog mode)
  userMenu={
    <FxUserMenu
      accounts={userMenuAccounts}
      showOtherAccounts
      showManageAccount
      onItemClick={handleUserMenuItemClick}
      onChangeAccount={handleUserMenuChangeAccount}
      onSignOutClick={() => console.log('Sign out')}
    >
      <FxUserMenuItem text="Settings" icon={<Settings />} />
      <FxUserMenuItem text="Help" icon={<HelpCircle />} />
    </FxUserMenu>
  }

  // Notifications
  notificationsBadge={3}
  notificationsLocked={notificationsOpen}
  onNotificationsClick={(opener) => {
    setNotificationsOpener(opener);
    setNotificationsOpen(true);
  }}
/>
```

## Ref API

```tsx
const layoutRef = useRef<FxLayoutRef>(null);

// Available methods:
layoutRef.current?.focusPane('center');
layoutRef.current?.closeProfileFlyout();
layoutRef.current?.getNativeElement();
```
