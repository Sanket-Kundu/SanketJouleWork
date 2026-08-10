# User Menu & Notifications

FxLayout includes built-in support for user account management and notifications in the side navigation.

## User Menu

The user menu is passed to FxLayout as a complete `FxUserMenu` element. FxLayout automatically controls opening/closing and injects dialog mode for compact (mobile) layouts.

### Configuration

```tsx
import { FxUserMenu, FxUserMenuItem } from '@sap-ui/fx-components';
import type { FxUserMenuAccountData } from '@sap-ui/fx-components';

const userMenuAccounts: FxUserMenuAccountData[] = [
  {
    id: '1',
    avatarSrc: './img/woman_avatar.png',
    titleText: 'Maria Jose Perreira',
    subtitleText: 'maria.jose.perreira@company.com',
    description: 'Delivery Manager',
    additionalInfo: 'Primary Employment',
    selected: true,
  },
  {
    id: '2',
    avatarSrc: './img/man_avatar.png',
    titleText: 'John Smith',
    subtitleText: 'john.smith@company.com',
    description: 'Software Developer',
    additionalInfo: 'Secondary Employment',
  },
  {
    id: '3',
    avatarInitials: 'AJ',  // Fallback to initials
    titleText: 'Anna Johnson',
    subtitleText: 'anna.johnson@company.com',
    description: 'Product Manager',
    additionalInfo: 'Contractor',
  },
];

<FxLayout
  userMenu={
    <FxUserMenu
      accounts={userMenuAccounts}
      showOtherAccounts
      showManageAccount
      onItemClick={handleUserMenuItemClick}
      onChangeAccount={handleChangeAccount}
      onSignOutClick={handleSignOut}
    >
      <FxUserMenuItem text="Settings" icon={<Settings className="h-4 w-4" />} />
      <FxUserMenuItem text="AI Notice" icon={<Bot className="h-4 w-4" />} />
      <FxUserMenuItem text="Help" icon={<HelpCircle className="h-4 w-4" />} />
    </FxUserMenu>
  }
/>
```

### FxUserMenuAccountData

```tsx
interface FxUserMenuAccountData {
  id: string;           // Unique identifier
  avatarSrc?: string;   // Avatar image URL
  avatarInitials?: string; // Fallback initials if no image
  titleText: string;    // Display name
  subtitleText?: string; // Email or secondary info
  description?: string; // Role/title
  additionalInfo?: string; // Employment type, etc.
  selected?: boolean;   // Currently selected account
}
```

### FxUserMenu Props

| Prop | Type | Description |
|------|------|-------------|
| `accounts` | `FxUserMenuAccountData[]` | Account data for switcher |
| `showManageAccount` | `boolean` | Show "Manage Account" button |
| `showOtherAccounts` | `boolean` | Show "Other Accounts" section |
| `showEditAccounts` | `boolean` | Show "Edit Accounts" button |
| `showEditButton` | `boolean` | Show edit badge on avatar |
| `avatarInteractive` | `boolean` | Whether the avatar is clickable (default true) |
| `footer` | `ReactNode` | Custom footer (replaces Sign Out) |
| `children` | `ReactNode` | Menu items (FxUserMenuItem elements) |

**Note:** FxLayout automatically injects `open`, `opener`, `useDialog`, `onClose`, and `onBackClick` props.

### Event Handlers

```tsx
// Handle menu item clicks
const handleUserMenuItemClick = useCallback((detail: FxUserMenuItemClickDetail) => {
  if (detail.text === 'Settings') {
    enterSettings();
  } else if (detail.text === 'AI Notice') {
    setAiNoticeDialogOpen(true);
  }
  // Return false to prevent menu from closing
}, []);

// Handle account switching
const handleChangeAccount = useCallback((detail: FxUserMenuChangeAccountDetail) => {
  setUserMenuAccounts(prev =>
    prev.map(account => ({
      ...account,
      selected: account.id === detail.selectedAccount.id,
    }))
  );
  // Return false to prevent switch if needed
}, []);

// Handle sign out
const handleSignOut = useCallback(() => {
  console.log('User signed out');
  // Return false to prevent menu from closing
}, []);

<FxLayout
  userMenu={
    <FxUserMenu
      accounts={userMenuAccounts}
      showOtherAccounts
      showManageAccount
      onItemClick={handleUserMenuItemClick}
      onChangeAccount={handleChangeAccount}
      onSignOutClick={handleSignOut}
      onManageAccountClick={() => window.open('/account')}
      onEditAccountsClick={() => window.open('/accounts')}
      onAvatarClick={() => console.log('Avatar clicked')}
    >
      {/* Menu items */}
    </FxUserMenu>
  }
/>
```

### FxUserMenuItemClickDetail

```tsx
interface FxUserMenuItemClickDetail {
  item: HTMLElement; // The clicked menu item element
  text: string;      // Item text
}
```

### FxUserMenuChangeAccountDetail

```tsx
interface FxUserMenuChangeAccountDetail {
  selectedAccount: FxUserMenuAccountData;
  prevSelectedAccount: FxUserMenuAccountData;
}
```

## Notifications

FxLayout provides events for notifications but does not include a built-in notifications panel. Your application provides its own notifications UI.

### Badge

Show a notification count badge on the nav item:

```tsx
<FxLayout
  notificationsBadge={3}  // Number or string (e.g., "99+")
  onNotificationsClick={(opener) => {
    setNotificationsOpener(opener);
    setNotificationsOpen(true);
  }}
/>
```

### Handling Notifications

The `onNotificationsClick` callback receives the button element, which you can use to anchor a popover. Use `notificationsLocked` to prevent the flyout from expanding while your panel is open:

```tsx
const [notificationsOpen, setNotificationsOpen] = useState(false);
const [notificationsOpener, setNotificationsOpener] = useState<HTMLElement | null>(null);

<FxLayout
  notificationsBadge={notifications.length}
  notificationsLocked={notificationsOpen}  // Disable flyout while panel is open
  onNotificationsClick={(opener) => {
    setNotificationsOpener(opener);
    setNotificationsOpen(true);
  }}
/>

{/* Your custom notifications UI - use ResponsivePopover for dialog on mobile */}
<ResponsivePopover
  open={notificationsOpen}
  opener={notificationsOpener}
  onClose={() => setNotificationsOpen(false)}
>
  {/* Your notifications content */}
</ResponsivePopover>
```

### Notification Props & Events

| Prop | Type | Description |
|------|------|-------------|
| `notificationsBadge` | `string \| number` | Badge count on notifications button |
| `notificationsLocked` | `boolean` | Lock nav item (disables flyout hover when panel is open) |
| `onNotificationsClick` | `(opener: HTMLElement) => void` | Notifications button clicked, receives button element for anchoring |

See the [el-demo](../../demos/el-demo/) for a sample notifications panel implementation.

## Side Navigation Fixed Items

The user menu and notifications appear in the "fixed" section at the bottom of the side navigation. These are handled internally by FxLayout—the side navigation components (`FxSideNavigation`, `FxSideNavigationItem`) are internal and not exported from the public API.

## Settings Integration

A common pattern is to open settings from the user menu:

```tsx
const handleUserMenuItemClick = useCallback((detail: FxUserMenuItemClickDetail) => {
  if (detail.text === 'Settings') {
    // Enter settings mode
    setCurrentSection('settings');
    setHideStart(false);  // Show settings nav
    setHideEnd(true);
  }
}, []);
```

See the [el-demo](../../demos/el-demo/) for a complete settings implementation with search and navigation.
