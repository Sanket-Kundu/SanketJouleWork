import React, { ReactNode, RefObject, CSSProperties } from "react";

/**
 * Popover placement relative to the opener element.
 * @public
 */
export enum PopoverPlacement {
  /** Placed at the logical start (left in LTR, right in RTL) */
  Start = "Start",
  /** Placed at the logical end (right in LTR, left in RTL) */
  End = "End",
  /** Placed above the opener */
  Top = "Top",
  /** Placed below the opener */
  Bottom = "Bottom",
}

/**
 * Horizontal alignment of the popover relative to the opener.
 * Applies when placement is Top or Bottom.
 * @public
 */
export enum PopoverHorizontalAlign {
  /** Centered relative to the opener */
  Center = "Center",
  /** Aligned with the logical start edge of the opener */
  Start = "Start",
  /** Aligned with the logical end edge of the opener */
  End = "End",
  /** Stretched to match the opener's width */
  Stretch = "Stretch",
}

/**
 * Vertical alignment of the popover relative to the opener.
 * Applies when placement is Start or End.
 * @public
 */
export enum PopoverVerticalAlign {
  /** Centered relative to the opener */
  Center = "Center",
  /** Aligned with the top edge of the opener */
  Top = "Top",
  /** Aligned with the bottom edge of the opener */
  Bottom = "Bottom",
  /** Stretched to match the opener's height */
  Stretch = "Stretch",
}

/**
 * Accessible role for the popup.
 * @public
 */
export enum PopupAccessibleRole {
  Dialog = "Dialog",
  AlertDialog = "AlertDialog",
  None = "None",
}

/**
 * Detail object passed to onBeforeClose callback.
 */
export interface PopoverBeforeCloseDetail {
  /** Whether the close was triggered by pressing Escape */
  escPressed: boolean;
}

/**
 * Props for the Popover component.
 * @public
 */
export interface PopoverProps {
  /** Ref for imperative access */
  ref?: React.Ref<PopoverRef>;
  // --- Popover-specific ---

  /** Text displayed in the header. Ignored when `header` prop is provided. */
  headerText?: string;

  /** Placement side relative to the opener. @default "End" */
  placement?: `${PopoverPlacement}`;

  /** Horizontal alignment when placement is Top/Bottom. @default "Center" */
  horizontalAlign?: `${PopoverHorizontalAlign}`;

  /** Vertical alignment when placement is Start/End. @default "Center" */
  verticalAlign?: `${PopoverVerticalAlign}`;

  /** Whether the arrow indicator is hidden. @default false */
  hideArrow?: boolean;

  /** Distance (in pixels) between the popover and its opener. @default 8 (arrow size) */
  offset?: number;

  /** Whether the popover can overlap the opener when there's no space. @default false */
  allowTargetOverlap?: boolean;

  /** Whether the popover is resizable by dragging. Desktop only. @default false */
  resizable?: boolean;

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
   * The element the popover is anchored to.
   * Accepts a React ref (including imperative handle refs with `nativeElement`)
   * or an HTMLElement directly.
   */
  opener?: RefObject<HTMLElement | null> | RefObject<{ nativeElement: HTMLElement | null } | null> | HTMLElement | null;

  // --- Popup base ---

  /** Whether the popover is open. @default false */
  open?: boolean;

  /** ID of the element inside the popover that should receive initial focus. */
  initialFocus?: string;

  /** Whether to restore focus to the previously focused element on close. @default false */
  preventFocusRestore?: boolean;

  /** Whether to prevent automatic initial focus when opening. @default false */
  preventInitialFocus?: boolean;

  /** Accessible name for the popover. */
  accessibleName?: string;

  /** ID of an external element that labels the popover. */
  accessibleNameRef?: string;

  /** Accessible role. @default "Dialog" */
  accessibleRole?: `${PopupAccessibleRole}`;

  /** Accessible description for the popover. */
  accessibleDescription?: string;

  // --- Slots as React props ---

  /** Custom header content. When provided, `headerText` is ignored. */
  header?: ReactNode;

  /** Custom footer content. */
  footer?: ReactNode;

  /** Main content of the popover. */
  children?: ReactNode;

  // --- Events ---

  /** Called before the popover opens. Return `false` to prevent opening. */
  onBeforeOpen?: () => boolean | void;

  /** Called after the popover is opened and focus is applied. */
  onOpen?: () => void;

  /** Called before the popover closes. Return `false` to prevent closing. */
  onBeforeClose?: (detail: PopoverBeforeCloseDetail) => boolean | void;

  /** Called after the popover is closed. */
  onClose?: () => void;

  /**
   * Custom predicate for click-outside detection.
   * Return true if the given target node should be considered "inside" this popup
   * (e.g., portalled submenus that live outside the Popover DOM tree).
   */
  isInsidePopup?: (target: Node) => boolean;

  // --- Standard HTML ---

  /** Additional CSS classes. */
  className?: string;

  /** Inline styles. */
  style?: CSSProperties;

  /** Element ID. */
  id?: string;

  /** Forwarded to the rendered popover root for test selectors. */
  "data-testid"?: string;
}

/**
 * Imperative handle exposed via ref.
 * @public
 */
export interface PopoverRef {
  /** Programmatically opens the popover. */
  open(): void;
  /** Programmatically closes the popover. */
  close(): void;
  /** Moves focus into the popover. */
  applyFocus(): Promise<void>;
  /** Whether the popover is currently open. */
  isOpen(): boolean;
  /** The underlying DOM element. */
  readonly nativeElement: HTMLDivElement | null;
}
