// types/dialog.ts

import type * as React from "react";

/**
 * Dialog state for semantic styling
 */
export enum DialogState {
  None = "None",
  Error = "Error",
  Warning = "Warning",
  Success = "Success",
  Information = "Information",
}

/**
 * Event detail for before-open event
 */
export interface DialogBeforeOpenDetail {
  /** ID of the element that triggered the dialog */
  targetId?: string;
}

/**
 * Event detail for before-close event
 */
export interface DialogBeforeCloseDetail {
  /** Whether the Escape key was pressed */
  escPressed?: boolean;
  /** Action identifier (e.g., button ID) */
  action?: string;
  /** Return value from the dialog */
  returnValue?: string;
}

/**
 * Event detail for after-close event
 */
export interface DialogAfterCloseDetail {
  /** Return value from the dialog */
  returnValue?: string;
}

/**
 * Main Dialog component props
 */
export interface DialogProps {
  /** Ref for imperative access */
  ref?: React.Ref<DialogRef>;
  // Value
  /** Controls whether the dialog is open or closed */
  open?: boolean;
  /** Initial open state for uncontrolled mode */
  defaultOpen?: boolean;

  // Header
  /** Title text displayed in the dialog header */
  headerText?: string;
  /** Optional subtitle text below the header title */
  subHeaderText?: string;
  /** Content rendered at the end (right) of the dialog header — e.g. search, filter buttons. Max 50% width. */
  headerEndContent?: React.ReactNode;
  /** Shows a back arrow button in the header (only visible when state is None) */
  showBackButton?: boolean;
  /** Callback when the back button is clicked */
  onBackButtonClick?: () => void;
  /** @deprecated Use `hideBorders` instead. */
  hideHeaderBorder?: boolean;
  /** Hides the header and footer border lines when content is not scrollable. When content overflows, borders are always shown regardless of this prop. */
  hideBorders?: boolean;

  // Behavior
  /** Makes dialog stretch to full available viewport width */
  stretch?: boolean;
  /** Enables dragging the dialog by its header */
  draggable?: boolean;
  /** Enables resizing dialog corners/edges */
  resizable?: boolean;
  /** Prevents automatic focus on first focusable element */
  preventInitialFocus?: boolean;
  /** Allows closing dialog by clicking backdrop */
  enableBackdropClick?: boolean;

  /**
   * Removes padding from the content area.
   * Useful when the content provides its own padding (e.g. a List).
   * @default false
   */
  noPadding?: boolean;

  // Validation
  /** Dialog state indicator for semantic styling */
  state?: DialogState | `${DialogState}`;

  // Accessibility
  /** ID of element to receive initial focus when dialog opens */
  initialFocus?: string;
  /** Accessible name for screen readers */
  accessibleName?: string;
  /** ID of element that labels the dialog */
  accessibleNameRef?: string;
  /** ID of element that describes the dialog */
  accessibleDescribedBy?: string;
  /** Accessible role for the dialog (dialog or alertdialog) */
  accessibleRole?: "dialog" | "alertdialog";
  /** Aria role description for screen readers */
  ariaRoleDescription?: string;

  // Slots/Children
  /** Custom header content (replaces default header) */
  header?: React.ReactNode;
  /** Main dialog content */
  children?: React.ReactNode;
  /** Dialog footer content (usually action buttons) */
  footer?: React.ReactNode;

  // Events
  /** Fired before dialog opens (can be prevented) */
  onBeforeOpen?: (detail: DialogBeforeOpenDetail) => boolean | void;
  /** Fired after dialog has opened and animation complete */
  onAfterOpen?: () => void;
  /** Fired before dialog closes (can be prevented) */
  onBeforeClose?: (detail: DialogBeforeCloseDetail) => boolean | void;
  /** Fired after dialog has closed and animation complete */
  onAfterClose?: (detail: DialogAfterCloseDetail) => void;
  /** Fired when Escape key is pressed */
  onEscapePress?: () => void;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;

  // Standard
  className?: string;
  id?: string;
  /**
   * Forwarded to the root `<dialog>` element for test selectors.
   * The header back button (when `showBackButton` is set) automatically
   * derives `${dataTestId}-back`. See `subTestId` in `src/lib/utils.ts`.
   *
   * Footer / `headerEndContent` slots are user-supplied — consumers should
   * pass `data-testid` directly on those elements.
   */
  "data-testid"?: string;
}

/**
 * Dialog ref methods for programmatic control
 */
export interface DialogRef {
  /** Opens dialog in modeless mode */
  show: () => void;
  /** Opens dialog as modal (standard) */
  showModal: () => void;
  /** Programmatically closes dialog */
  close: (returnValue?: string) => void;
  /** Sets focus to dialog */
  focus: () => void;
}

/**
 * Dialog Header props
 */
export interface DialogHeaderProps {
  /** Header title text */
  title?: string;
  /** Dialog state for header styling */
  state?: DialogState | `${DialogState}`;
  /** Show close button */
  showCloseButton?: boolean;
  /** Close button click handler */
  onClose?: () => void;
  /** Custom header content */
  children?: React.ReactNode;
  className?: string;
}

/**
 * Dialog Footer props
 */
export interface DialogFooterProps {
  /** Footer content */
  children?: React.ReactNode;
  className?: string;
}

/**
 * Dialog Content props
 */
export interface DialogContentProps {
  /** Content */
  children?: React.ReactNode;
  className?: string;
}
