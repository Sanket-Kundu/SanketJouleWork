# Dialog Component

A modal dialog component following UI5 Web Components API with full enterprise feature parity.

## Features

✅ **Complete UI5 Feature Parity**
- All properties (open, headerText, stretch, draggable, resizable, state)
- All events (before-open, after-open, before-close, after-close)
- All slots (header, content, footer)
- Keyboard shortcuts (Escape, Tab/Shift+Tab focus trapping)
- Full ARIA support (role, aria-modal, aria-labelledby, aria-describedby)

✅ **Modern React Patterns**
- Controlled and uncontrolled modes
- TypeScript-first with full type inference
- Composition API for flexible layouts
- Imperative handle for programmatic control

✅ **Accessibility (WCAG 2.1 AA)**
- Proper ARIA roles and attributes
- Focus management and trapping
- Keyboard navigation
- Screen reader announcements

✅ **Enterprise Features**
- State-based styling (Error, Warning, Success, Information)
- Draggable and resizable modes
- Backdrop click handling
- Return values from dialogs
- Event prevention for validation

## Installation

The Dialog component is part of the shadcn-ui5 components package.

```bash
npm install @shadcn-ui5/components
```

## Basic Usage

### Controlled Dialog

```tsx
import { useState } from "react";
import { Dialog, Button } from "@shadcn-ui5/components";

function App() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Dialog</Button>

      <Dialog
        open={open}
        onOpenChange={setOpen}
        headerText="Confirm Action"
        footer={
          <>
            <Button onClick={() => setOpen(false)}>Confirm</Button>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          </>
        }
      >
        Are you sure you want to proceed with this action?
      </Dialog>
    </>
  );
}
```

### Uncontrolled Dialog

```tsx
import { Dialog, Button } from "@shadcn-ui5/components";

function App() {
  return (
    <Dialog
      defaultOpen={false}
      headerText="Information"
      footer={<Button>OK</Button>}
    >
      This is an uncontrolled dialog.
    </Dialog>
  );
}
```

## Props

### DialogProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | - | Controls whether dialog is open (controlled mode) |
| `defaultOpen` | `boolean` | `false` | Initial open state (uncontrolled mode) |
| `headerText` | `string` | - | Title text in dialog header |
| `header` | `ReactNode` | - | Custom header content (replaces default) |
| `children` | `ReactNode` | - | Main dialog content |
| `footer` | `ReactNode` | - | Footer content (usually buttons) |
| `state` | `DialogState` | `"None"` | Semantic state styling |
| `stretch` | `boolean` | `false` | Makes dialog full-width |
| `draggable` | `boolean` | `false` | Enables dragging by header |
| `resizable` | `boolean` | `false` | Enables resizing |
| `preventInitialFocus` | `boolean` | `false` | Prevents auto-focus on open |
| `enableBackdropClick` | `boolean` | `false` | Allows closing by clicking backdrop |
| `initialFocus` | `string` | - | ID of element to focus on open |
| `accessibleName` | `string` | - | Accessible name for screen readers |
| `accessibleNameRef` | `string` | - | ID of labeling element |
| `accessibleDescribedBy` | `string` | - | ID of describing element |
| `onBeforeOpen` | `(detail) => boolean \| void` | - | Before open (can prevent) |
| `onAfterOpen` | `() => void` | - | After open animation |
| `onBeforeClose` | `(detail) => boolean \| void` | - | Before close (can prevent) |
| `onAfterClose` | `(detail) => void` | - | After close animation |
| `onEscapePress` | `() => void` | - | When Escape pressed |
| `onOpenChange` | `(open: boolean) => void` | - | Open state changes |
| `className` | `string` | - | Additional CSS classes |
| `id` | `string` | - | Element ID |

### DialogState Enum

```typescript
enum DialogState {
  None = "None",          // Default neutral
  Error = "Error",        // Red border/header
  Warning = "Warning",    // Orange border/header
  Success = "Success",    // Green border/header
  Information = "Information" // Blue border/header
}
```

## Advanced Examples

### State-Based Styling

```tsx
import { Dialog, DialogState, Button } from "@shadcn-ui5/components";

function ErrorDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      headerText="Error Occurred"
      state={DialogState.Error}
      footer={<Button onClick={() => setOpen(false)}>OK</Button>}
    >
      An error occurred while processing your request.
      Please try again later.
    </Dialog>
  );
}
```

### Draggable Dialog

```tsx
<Dialog
  open={open}
  onOpenChange={setOpen}
  headerText="Draggable Dialog"
  draggable
  footer={<Button onClick={() => setOpen(false)}>Close</Button>}
>
  Drag me by the header to reposition!
</Dialog>
```

### Resizable Dialog

```tsx
<Dialog
  open={open}
  onOpenChange={setOpen}
  headerText="Resizable Dialog"
  resizable
  footer={<Button onClick={() => setOpen(false)}>Close</Button>}
>
  Resize me by dragging the corners/edges!
</Dialog>
```

### Stretch (Full Width)

```tsx
<Dialog
  open={open}
  onOpenChange={setOpen}
  headerText="Full Width Dialog"
  stretch
  footer={<Button onClick={() => setOpen(false)}>Close</Button>}
>
  This dialog stretches to full available width.
</Dialog>
```

### Preventing Close

```tsx
function UnsavedChangesDialog() {
  const [open, setOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(true);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      headerText="Confirm Close"
      onBeforeClose={(detail) => {
        if (hasUnsavedChanges) {
          // Prevent close and show confirmation
          const confirmed = confirm("You have unsaved changes. Close anyway?");
          return !confirmed; // Return true to prevent close
        }
      }}
      footer={
        <>
          <Button onClick={() => {
            setHasUnsavedChanges(false);
            setOpen(false);
          }}>
            Save & Close
          </Button>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Discard Changes
          </Button>
        </>
      }
    >
      <textarea placeholder="Make some changes..." />
    </Dialog>
  );
}
```

### Custom Header

```tsx
import { Dialog, Button } from "@shadcn-ui5/components";
import { AlertCircle } from "lucide-react";

function CustomHeaderDialog() {
  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      header={
        <div className="flex items-center gap-2 px-6 py-4 border-b bg-red-50 dark:bg-red-950/20">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <h2 className="text-lg font-semibold">Critical Error</h2>
        </div>
      }
      footer={<Button onClick={() => setOpen(false)}>Acknowledge</Button>}
    >
      A critical error has occurred.
    </Dialog>
  );
}
```

### Initial Focus

```tsx
<Dialog
  open={open}
  onOpenChange={setOpen}
  headerText="Login"
  initialFocus="username-input"
  footer={
    <>
      <Button type="submit">Login</Button>
      <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
    </>
  }
>
  <form>
    <input id="username-input" type="text" placeholder="Username" />
    <input type="password" placeholder="Password" />
  </form>
</Dialog>
```

### Imperative API

```tsx
import { useRef } from "react";
import { Dialog, DialogRef, Button } from "@shadcn-ui5/components";

function ImperativeDialog() {
  const dialogRef = useRef<DialogRef>(null);

  return (
    <>
      <Button onClick={() => dialogRef.current?.showModal()}>
        Open via Ref
      </Button>

      <Dialog
        ref={dialogRef}
        headerText="Imperative Dialog"
        footer={
          <Button onClick={() => dialogRef.current?.close("confirmed")}>
            Close with Return Value
          </Button>
        }
        onAfterClose={(detail) => {
          console.log("Return value:", detail.returnValue);
        }}
      >
        This dialog was opened imperatively.
      </Dialog>
    </>
  );
}
```

### Using Header and Footer Props

For custom header and footer content, use the `header` and `footer` props:

```tsx
import {
  Dialog,
  Button,
} from "@shadcn-ui5/components";

function CustomDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      header={
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Custom Header</h2>
          <Badge>New</Badge>
        </div>
      }
      footer={
        <>
          <Button onClick={() => setOpen(false)}>OK</Button>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
        </>
      }
    >
      <p>Dialog content goes here as children.</p>
    </Dialog>
  );
}
```

**Important:** The Dialog component automatically wraps `children` in its own content container. Use the `header` and `footer` props for customization instead of wrapping content in additional containers.

## Accessibility

The Dialog component is fully accessible:

### ARIA Attributes

- `role="dialog"` or `role="alertdialog"` (Error state) - Semantic role for screen readers
- Native `<dialog>` element with Popover API for top-layer rendering
- `aria-labelledby` - Links header text
- `aria-describedby` - Links description and drag/resize instructions
- `aria-label` - Fallback accessible name

### Keyboard Navigation

- **Escape**: Close dialog (can be prevented, only closes topmost dialog in stacks)
- **Tab**: Move focus forward (trapped within dialog)
- **Shift+Tab**: Move focus backward (trapped within dialog)
- **Enter/Space**: Activate focused button
- **Arrow Keys** (when header focused): Drag dialog to reposition (for draggable dialogs)
- **Shift+Arrow Keys**: Resize dialog (for resizable dialogs)

### Focus Management

1. On open: Focus moves to first focusable element (or `initialFocus`)
2. While open: Focus trapped within dialog
3. On close: Focus returns to trigger element

## Theming

The Dialog uses Tailwind CSS and respects your theme configuration:

### CSS Variables

The component uses these CSS variables from your theme:

- `--background` - Dialog background
- `--foreground` - Text color
- `--border` - Border color
- `--ring` - Focus ring color
- State colors (`red`, `orange`, `green`, `blue`)

### Dark Mode

The Dialog automatically adapts to dark mode via Tailwind's `dark:` variants.

## Migration from UI5 Web Components

### Property Mapping

| UI5 Property | React Prop | Notes |
|--------------|------------|-------|
| `open` | `open` | Same |
| `header-text` | `headerText` | camelCase |
| `initial-focus` | `initialFocus` | camelCase |
| `prevent-initial-focus` | `preventInitialFocus` | camelCase |
| `state` | `state` | Same values |
| `stretch` | `stretch` | Same |
| `draggable` | `draggable` | Same |
| `resizable` | `resizable` | Same |

### Event Mapping

| UI5 Event | React Prop | Notes |
|-----------|------------|-------|
| `@before-open` | `onBeforeOpen` | Return `false` to prevent |
| `@after-open` | `onAfterOpen` | Same |
| `@before-close` | `onBeforeClose` | Return `false` to prevent |
| `@after-close` | `onAfterClose` | Same |

### Slot Mapping

| UI5 Slot | React Prop | Notes |
|----------|------------|-------|
| `<slot>` | `children` | Default content |
| `slot="header"` | `header` prop | Custom header |
| `slot="footer"` | `footer` prop | Footer buttons |

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Full support

## Additional Features

### Dialog Stacking
- Multiple dialogs can be open simultaneously
- Automatic z-index management via dialog stack
- ESC key only closes the topmost dialog
- Scroll locking applied by first dialog, removed when last dialog closes

### Keyboard Dragging & Resizing
- **Draggable**: Tab to header (focus ring appears), use Arrow keys to move
- **Resizable**: Press Shift+Arrow keys from anywhere in the dialog
- Full keyboard accessibility for repositioning and resizing

### RTL (Right-to-Left) Support
- Automatically detects RTL mode from document direction
- Reverses drag direction for natural behavior in RTL layouts

### Dynamic Content Handling
- ResizeObserver monitors content size changes
- Automatically repositions dialog to stay within viewport bounds
- Prevents dialogs from going off-screen when content grows

### Scroll Preservation
- Page scroll position saved when first dialog opens
- Restored when last dialog closes
- Works correctly with multiple stacked dialogs

## Performance

- Native `<dialog>` element with Popover API for optimal rendering
- ResizeObserver for efficient content change detection
- Lazy event listeners: Only attached when dialog is open
- Focus trap optimization: Minimal re-renders
- Event listener cleanup: Proper unmounting
- Body scroll lock: Only when dialogs are open (managed by dialog stack)

## TypeScript

Full TypeScript support with type inference:

```typescript
import type {
  DialogProps,
  DialogRef,
  DialogState,
  DialogBeforeOpenDetail,
  DialogBeforeCloseDetail,
  DialogAfterCloseDetail,
} from "@shadcn-ui5/components";
```

## Related Components

- **Button** - For dialog action buttons
- **MessageStrip** - For inline validation messages
- **Form components** - Input, Select, CheckBox, etc.

## Resources

- [UI5 Web Components Dialog Documentation](https://sap.github.io/ui5-webcomponents/playground/components/Dialog/)
- [ARIA Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialogmodal/)
- [HTML Dialog Element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog)
