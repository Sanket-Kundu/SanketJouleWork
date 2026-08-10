import React, { ReactNode, RefObject, CSSProperties } from "react";
import { PopoverPlacement, PopoverHorizontalAlign, PopoverVerticalAlign, PopupAccessibleRole, PopoverBeforeCloseDetail } from "./popover";

/**
 * Props for the ResponsivePopover component.
 *
 * On desktop/tablet it renders as a Popover; on phone it renders as a full-screen Dialog.
 * The API matches the Popover API with additional mobile-specific options.
 * @public
 */
export interface ResponsivePopoverProps {
  /** Ref for imperative access */
  ref?: React.Ref<ResponsivePopoverRef>;
  // --- Popover props ---

  /** Text displayed in the header. Ignored when `header` prop is provided. */
  headerText?: string;

  /** Placement side relative to the opener (Popover mode only). @default "End" */
  placement?: `${PopoverPlacement}`;

  /** Horizontal alignment when placement is Top/Bottom (Popover mode only). @default "Center" */
  horizontalAlign?: `${PopoverHorizontalAlign}`;

  /** Vertical alignment when placement is Start/End (Popover mode only). @default "Center" */
  verticalAlign?: `${PopoverVerticalAlign}`;

  /** Whether the arrow indicator is hidden (Popover mode only). @default false */
  hideArrow?: boolean;

  /** Distance (in pixels) between the popover and its opener (Popover mode only). @default 8 */
  offset?: number;

  /** Whether the popover can overlap the opener (Popover mode only). @default false */
  allowTargetOverlap?: boolean;

  /**
   * The element the popover is anchored to (Popover mode only).
   * Accepts a React ref (including imperative handle refs with `nativeElement`) or an HTMLElement.
   */
  opener?: RefObject<HTMLElement | null> | RefObject<{ nativeElement: HTMLElement | null } | null> | HTMLElement | null;

  // --- Popup base ---

  /** Whether the popup is open. @default false */
  open?: boolean;

  /** ID of the element inside the popup that should receive initial focus. */
  initialFocus?: string;

  /** Whether to restore focus to the previously focused element on close. @default false */
  preventFocusRestore?: boolean;

  /** Whether to prevent automatic initial focus when opening. @default false */
  preventInitialFocus?: boolean;

  /** Accessible name for the popup. */
  accessibleName?: string;

  /** ID of an external element that labels the popup. */
  accessibleNameRef?: string;

  /** Accessible role. @default "Dialog" */
  accessibleRole?: `${PopupAccessibleRole}`;

  /** Accessible description for the popup. */
  accessibleDescription?: string;

  // --- Slots as React props ---

  /** Custom header content. When provided, `headerText` is ignored. */
  header?: ReactNode;

  /** Custom footer content. */
  footer?: ReactNode;

  /** Main content. */
  children?: ReactNode;

  // --- Events ---

  /** Called before the popup opens. Return `false` to prevent opening. */
  onBeforeOpen?: () => boolean | void;

  /** Called after the popup is opened. */
  onOpen?: () => void;

  /** Called before the popup closes. Return `false` to prevent closing. */
  onBeforeClose?: (detail: PopoverBeforeCloseDetail) => boolean | void;

  /** Called after the popup is closed. */
  onClose?: () => void;

  // --- ResponsivePopover-specific ---

  /**
   * Removes padding from the content area.
   * Useful when the content provides its own padding (e.g. a List).
   * @default false
   */
  noPadding?: boolean;

  /** Hides the header bottom border line. @default false */
  hideHeaderBorder?: boolean;

  /** Hides the footer top border line. @default false */
  hideFooterBorder?: boolean;

  /**
   * When true, header and footer are hidden in Popover mode (desktop).
   * They remain visible in Dialog mode (phone).
   * @default false
   */
  contentOnlyOnDesktop?: boolean;

  /**
   * Whether to show a close button in the Dialog header on phone.
   * Only applies when no custom `header` prop is provided.
   * @default true
   */
  showCloseButton?: boolean;

  // --- Standard HTML ---

  /** Additional CSS classes. */
  className?: string;

  /** Inline styles. */
  style?: CSSProperties;

  /** Element ID. */
  id?: string;

  /** Forwarded to the rendered popover/dialog root for test selectors. */
  "data-testid"?: string;
}

/**
 * Imperative handle exposed via ref.
 * @public
 */
export interface ResponsivePopoverRef {
  /** Programmatically opens the popup. */
  open(): void;
  /** Programmatically closes the popup. */
  close(): void;
  /** Moves focus into the popup. */
  applyFocus(): Promise<void>;
  /** Whether the popup is currently open. */
  isOpen(): boolean;
  /** The underlying DOM element. */
  readonly nativeElement: HTMLElement | null;
}
