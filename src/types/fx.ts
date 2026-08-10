import React from "react";
import type { ButtonRef } from "./button";
import type { SplitButtonRef } from "./split-button";

// =============================================================================
// FxNavItem - Configuration component for navigation items in FxLayout
// =============================================================================

/**
 * Configuration for a navigation item in FxLayout
 */
export interface FxNavItemConfig {
  /** Unique name/key for the navigation item */
  name: string;
  /** Icon to display (React node or icon name) */
  icon?: React.ReactNode;
  /** Icon to display when the item is selected (e.g. filled variant) */
  selectedIcon?: React.ReactNode;
  /** Text label */
  text?: string;
  /** Tooltip for create action button */
  createActionTooltip?: string;
  /** Hide start pane for this mode */
  noStartPane?: boolean;
  /** End pane is a utility pane (different styling) */
  utilityEndPane?: boolean;
  /** Hide create action button for this mode */
  noCreateAction?: boolean;
  /**
   * End pane has its own externally managed input.
   * When true and end pane is open, the layout's input slot is hidden
   * (the view loaded in the end pane provides its own input).
   * When end pane is closed, input renders in center pane as normal.
   */
  externalEndPaneInput?: boolean;
  /** Forwarded to the rendered FxSideNavigationItem for test selectors. */
  "data-testid"?: string;
}

// =============================================================================
// FxPaneHeader Types
// =============================================================================

/**
 * Action priority for overflow ordering
 */
export type ActionPriority = "low" | "medium" | "high" | "alwaysOverflow";

/**
 * Related item type
 */
export type RelationType = "space" | "job" | "conversation";

/**
 * Related item for the relations menu
 */
export interface FxRelationItem {
  type: RelationType;
  name: string;
  id: string;
  icon?: React.ReactNode;
  selected?: boolean;
  /** Forwarded to the rendered relation MenuItem for test selectors. */
  "data-testid"?: string;
}

/**
 * FxPaneHeaderAction props
 */
export interface FxPaneHeaderActionProps {
  /** Ref for imperative access */
  ref?: React.Ref<ButtonRef>;
  /** Icon for the action */
  icon?: React.ReactNode;
  /** Text label */
  text?: string;
  /** Button design */
  design?: "Primary" | "PrimaryJoule" | "Secondary" | "SecondaryJoule" | "Tertiary" | "TertiaryJoule" | "Neutral" | "SecondaryNeutral" | "TertiaryNeutral";
  /** Button size (only applies when rendered in the toolbar; ignored when the action overflows into the menu) */
  size?: "Large" | "Medium" | "Small";
  /** Show text alongside icon */
  showText?: boolean;
  /** Overflow priority */
  priority?: ActionPriority;
  /** Whether this action should be centered */
  centered?: boolean;
  /** Whether disabled */
  disabled?: boolean;
  /** Tooltip */
  tooltip?: string;
  /** Click handler - receives event and the DOM element ref (button in toolbar, or overflow button if overflowed) */
  onClick?: (event: React.MouseEvent, ref: HTMLElement | null) => void;
  /** Additional className */
  className?: string;
  /** Forwarded to the underlying button element for test selectors. */
  "data-testid"?: string;
}

/**
 * FxPaneHeaderSegmentedAction props
 */
export interface FxPaneHeaderSegmentedActionProps {
  /** Ref for imperative access */
  ref?: React.Ref<HTMLUListElement>;
  /** Icon for collapsed view */
  icon?: React.ReactNode;
  /** Text for collapsed view */
  text?: string;
  /** Button size (defaults to Medium to match neighbouring chrome buttons) */
  size?: "Large" | "Medium" | "Small";
  /** Show text alongside icon */
  showText?: boolean;
  /** Overflow priority */
  priority?: ActionPriority;
  /** Whether centered */
  centered?: boolean;
  /** Currently selected option ID */
  selectedId?: string;
  /** Options */
  children?: React.ReactNode;
  /** Selection change handler */
  onSelectionChange?: (detail: { selectedId: string }) => void;
  /** Click handler for collapsed view */
  onClick?: (event: React.MouseEvent) => void;
  /** Additional className */
  className?: string;
  /** Forwarded to the underlying SegmentedButton root for test selectors. */
  "data-testid"?: string;
}

/**
 * FxPaneHeaderSegmentedOption props
 */
export interface FxPaneHeaderSegmentedOptionProps {
  /** Unique ID */
  id: string;
  /** Icon */
  icon?: React.ReactNode;
  /** Text */
  text?: string;
  /** Whether selected */
  selected?: boolean;
}

/**
 * FxPaneHeaderSplitAction props
 */
export interface FxPaneHeaderSplitActionProps {
  /** Ref for imperative access */
  ref?: React.Ref<SplitButtonRef>;
  /** Icon for main button */
  icon?: React.ReactNode;
  /** Text for main button */
  text?: string;
  /** Button size (defaults to Medium to match neighbouring chrome buttons) */
  size?: "Large" | "Medium" | "Small";
  /** Show text alongside icon */
  showText?: boolean;
  /** Overflow priority */
  priority?: ActionPriority;
  /** Menu options */
  children?: React.ReactNode;
  /** Main button click handler */
  onClick?: (event: React.MouseEvent) => void;
  /** Option selected handler */
  onOptionSelect?: (detail: { optionId: string }) => void;
  /** Additional className */
  className?: string;
  /** Forwarded to the underlying SplitButton root for test selectors. The arrow button derives `${dataTestId}-arrow`. */
  "data-testid"?: string;
}

/**
 * FxPaneHeaderSplitOption props
 */
export interface FxPaneHeaderSplitOptionProps {
  /** Unique ID */
  id: string;
  /** Icon */
  icon?: React.ReactNode;
  /** Text */
  text?: string;
}

/**
 * FxPaneHeader props
 */
export interface FxPaneHeaderProps {
  /** Ref for imperative access */
  ref?: React.Ref<FxPaneHeaderRef>;
  /** Which pane this header belongs to - affects which buttons are shown */
  pane?: "start" | "center" | "end";
  /** Whether to show back button */
  showBack?: boolean;
  /** Title text */
  title?: string;
  /** Show title dropdown arrow */
  showTitleArrow?: boolean;
  /** Related items for relation button */
  related?: FxRelationItem[];
  /** Title is editable */
  titleEditable?: boolean;
  /** Title is in edit mode */
  titleEditMode?: boolean;
  /** Show add (+) button next to title */
  showAddButton?: boolean;
  /** Tooltip for add button */
  addButtonTooltip?: string;
  /** Breadcrumbs slot content */
  breadcrumbs?: React.ReactNode;
  /** Subheader slot content */
  subheader?: React.ReactNode;
  /** Action buttons (children) */
  children?: React.ReactNode;
  /** Back button clicked */
  onBackClick?: () => void;
  /** Title arrow clicked */
  onTitleArrowClick?: (arrowRef: HTMLElement) => void;
  /** Relation clicked */
  onRelationClick?: (relation: FxRelationItem) => void;
  /** Title edit accepted */
  onTitleEditAccept?: (detail: { value: string; previousValue: string }) => void;
  /** Title edit cancelled */
  onTitleEditCancel?: (detail: { value: string }) => void;
  /** Title edit mode changed (for controlled mode) */
  onTitleEditModeChange?: (detail: { editMode: boolean }) => void;
  /** Add button clicked */
  onAddClick?: () => void;
  /** Show bottom border (e.g., when content is scrolled) */
  showBorder?: boolean;
  /** Heading level for the title (default: "h1" for center pane, "h2" for start/end) */
  headingLevel?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  /** Additional className */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /**
   * Forwarded to the root <header> element for test selectors. Sub-elements
   * (back button, title, title arrow, add button, relations menu trigger,
   * overflow menu trigger) auto-derive testids using kebab-case suffixes —
   * e.g. `${dataTestId}-back`, `-title`, `-title-arrow`, `-add`, `-relations`,
   * `-overflow`. See `subTestId` in `src/lib/utils.ts`.
   */
  "data-testid"?: string;
}

/**
 * FxPaneHeader ref
 */
export interface FxPaneHeaderRef {
  /** Focus the header */
  focus: () => void;
  /** Access native DOM element */
  readonly nativeElement: HTMLElement | null;
  /** @deprecated Use nativeElement instead */
  getNativeElement: () => HTMLElement | null;
}

// =============================================================================
// FxLayout Types
// =============================================================================

/**
 * Layout mode (which navigation item is active)
 */
export type FxLayoutMode = string;

/**
 * Priority pane when space is constrained
 */
export type FxPriorityPane = "start" | "center" | "end";

/**
 * Visibility change event detail
 */
export interface FxVisibilityChangeDetail {
  pane: "start" | "center" | "end";
  visible: boolean;
}

/**
 * Mode change event detail
 */
export interface FxModeChangeDetail {
  mode: string;
  previousMode: string;
}

/**
 * Layout change event detail
 */
export interface FxLayoutChangeDetail {
  priorityPane: "Start" | "Center" | "End";
  hideStart?: boolean;
  hideEnd?: boolean;
}

/**
 * FxLayout props
 */
export interface FxLayoutProps {
  /** Ref for imperative access */
  ref?: React.Ref<FxLayoutRef>;
  /** ID attribute for the layout element */
  id?: string;
  /** Hide start pane */
  hideStart?: boolean;
  /** Hide center pane */
  hideCenter?: boolean;
  /** Hide end pane */
  hideEnd?: boolean;
  /** Priority pane when space is limited */
  priorityPane?: "Start" | "Center" | "End";
  /** Suppress end pane entirely */
  suppressEnd?: boolean;
  /** Current navigation mode */
  mode?: FxLayoutMode;
  /** Notifications badge count */
  notificationsBadge?: string | number;
  /** Lock notifications nav item (disables flyout when panel is open) */
  notificationsLocked?: boolean;
  /** Hide the notifications item entirely */
  hideNotifications?: boolean;
  /** Navigation items */
  navItems?: FxNavItemConfig[];
  /** Minimum width for panes in pixels (default 320). Use smaller value for compact layout on smaller screens. */
  paneMinWidth?: number;
  /** Minimum main area width (excluding nav) to show 3 panes (default 1366). Use larger value (e.g. 1965) to require bigger screens. */
  threePaneMinWidth?: number;
  /** Start pane header (FxPaneHeader element) */
  startHeader?: React.ReactElement<FxPaneHeaderProps>;
  /** Center pane header (FxPaneHeader element) */
  centerHeader?: React.ReactElement<FxPaneHeaderProps>;
  /** End pane header (FxPaneHeader element) */
  endHeader?: React.ReactElement<FxPaneHeaderProps>;
  /** Start pane content */
  startContent?: React.ReactNode;
  /** Center pane content */
  centerContent?: React.ReactNode;
  /** End pane content */
  endContent?: React.ReactNode;
  /** User menu component (UserMenu element). FxLayout controls open/close and injects useDialog for compact mode. */
  userMenu?: React.ReactElement<{
    open?: boolean;
    opener?: HTMLElement | null;
    useDialog?: boolean;
    placement?: string;
    verticalAlign?: string;
    offset?: number;
    accounts?: Array<{
      id: string;
      avatarSrc?: string;
      avatarInitials?: string;
      avatarColorScheme?: string;
      titleText: string;
      selected?: boolean;
    }>;
    onClose?: () => void;
    onBackClick?: () => void;
  }>;
  /** AI input component */
  input?: React.ReactNode;
  /** Visibility changed */
  onVisibilityChange?: (detail: FxVisibilityChangeDetail) => void;
  /** Mode changed */
  onModeChange?: (detail: FxModeChangeDetail) => void;
  /** Add button clicked (includes mode for nav item + buttons) */
  onAddClick?: (detail?: { mode: string }) => void;
  /** Layout dimensions changed */
  onLayoutChange?: (detail: FxLayoutChangeDetail) => void;
  /** Notifications button clicked - receives the button element for anchoring popovers */
  onNotificationsClick?: (opener: HTMLElement) => void;
  /** Custom sidebar logo. `collapsed` replaces the Joule gem icon; `expanded` replaces the Joule Work logo. Omit either key to keep the default. */
  navLogo?: { collapsed?: React.ReactNode; expanded?: React.ReactNode };
  /** Additional className */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Children (for fallback/custom content) */
  children?: React.ReactNode;
  /**
   * Forwarded to the rendered FxLayout root element. Sub-elements derive
   * stable testids using kebab-case suffixes — `${dataTestId}-notifications`,
   * `-profile`, `-nav-toggle` (sidebar collapse/expand), `-nav-close`
   * (compact-mode dialog close). Per-mode nav items derive their testid
   * from `FxNavItemConfig["data-testid"]`.
   */
  "data-testid"?: string;
}

/**
 * FxLayout ref
 */
export interface FxLayoutRef {
  /** Focus a specific pane */
  focusPane: (pane: "start" | "center" | "end") => void;
  /** Close profile flyout */
  closeProfileFlyout: () => void;
  /** Access native DOM element */
  readonly nativeElement: HTMLElement | null;
  /** @deprecated Use nativeElement instead */
  getNativeElement: () => HTMLElement | null;
}

// =============================================================================
// FxPromptInput Types
// =============================================================================

/**
 * Prompt input mode
 */
export type FxPromptInputMode = "oneline" | "multiline";

/**
 * FxPromptInputAction props
 */
export interface FxPromptInputActionProps {
  /** Icon */
  icon?: React.ReactNode;
  /** Text */
  text?: string;
  /** Description */
  description?: string;
  /** Action data */
  actionData?: unknown;
}

/**
 * Typeahead suggestion
 */
export interface FxTypeaheadSuggestion {
  /** Completion text to append */
  text: string;
  /** Display label (defaults to text) */
  label?: string;
  /** Confidence score 0-1 */
  probability?: number;
  /** Extensible metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Typeahead request detail
 */
export interface FxTypeaheadRequest {
  /** Current input value */
  value: string;
  /** Request ID for ordering/stale detection */
  requestId: number;
  /** Cursor position in input */
  cursorPosition?: number;
  /** Abort signal for cancellation */
  signal: AbortSignal;
}

/**
 * Context item for prompt input (shown as chips)
 */
export interface FxPromptInputContextItem {
  /** Unique ID */
  id: string;
  /** Icon */
  icon?: React.ReactNode;
  /** Label text */
  label: string;
  /** Can be removed */
  removable?: boolean;
}

/**
 * FxPromptInput props
 */
export interface FxPromptInputProps {
  /** Ref for imperative access */
  ref?: React.Ref<FxPromptInputRef>;
  /** Current value */
  value?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Status message above input (e.g., "Thinking...") */
  statusMessage?: string;
  /** Disclaimer message below input */
  disclaimerMessage?: string;
  /** Show dictate button (default true) */
  showDictate?: boolean;
  /** Show voice button (default true) */
  showVoice?: boolean;
  /** Input mode - oneline for single row, multiline for textarea */
  mode?: FxPromptInputMode;
  /** Enable typeahead suggestions (default true) */
  typeaheadEnabled?: boolean;
  /** Max suggestions to display (default 5) */
  maxSuggestions?: number;
  /** Debounce delay in ms (default 150) */
  debounceMs?: number;
  /** Action menu items (ReactNode) */
  actions?: React.ReactNode;
  /** Context items shown as chips (e.g., selected space) */
  contextItems?: FxPromptInputContextItem[];
  /** Toolbar buttons for multiline mode */
  toolbarButtons?: React.ReactNode;
  /** Submit handler - Enter key or send button */
  onSubmit?: (detail: { value: string }) => void;
  /** Real-time value change handler */
  onLiveChange?: (detail: { value: string }) => void;
  /** Plus button clicked */
  onPlusPress?: () => void;
  /** Dictate button clicked */
  onDictatePress?: () => void;
  /** Voice button clicked */
  onVoicePress?: () => void;
  /** Typeahead request handler - return suggestions or use setSuggestions */
  onTypeaheadRequest?: (detail: FxTypeaheadRequest) => Promise<FxTypeaheadSuggestion[]> | void;
  /** Action selected from menu */
  onActionSelect?: (detail: { action: FxPromptInputActionProps }) => void;
  /** Context item removed */
  onContextItemRemove?: (detail: { item: FxPromptInputContextItem }) => void;
  /** Additional className */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /**
   * Forwarded to the rendered FxPromptInput root element. Sub-elements
   * derive testids using kebab-case suffixes — `${dataTestId}-add` (plus),
   * `-send`, `-dictate`, `-voice`, and `-context-${item.id}` (context tag).
   */
  "data-testid"?: string;
}

/**
 * FxPromptInput ref
 */
export interface FxPromptInputRef {
  /** Focus the input */
  focus: () => void;
  /** Clear the input */
  clear: () => void;
  /** Get current value */
  getValue: () => string;
  /** Set value */
  setValue: (value: string) => void;
  /** Access native DOM element */
  readonly nativeElement: HTMLElement | null;
  /** @deprecated Use nativeElement instead */
  getNativeElement: () => HTMLElement | null;
}

// =============================================================================
// FxSideNavigation Types
// =============================================================================

/**
 * FxSideNavigation props
 */
export interface FxSideNavigationProps {
  /** Ref for imperative access */
  ref?: React.Ref<FxSideNavigationRef>;
  /** Whether the navigation is collapsed (icon-only mode) */
  collapsed?: boolean;
  /** Whether the nav is mid-transition between collapsed/expanded */
  isTransitioning?: boolean;
  /** Direction of the current transition */
  transitionDirection?: 'collapsing' | 'expanding' | null;
  /** Force merged mode (single list with divider) */
  forceMerged?: boolean;
  /** Dialog mode - items flow from top without spacer (for hamburger menu) */
  dialogMode?: boolean;
  /** Flexible items (main navigation) */
  children?: React.ReactNode;
  /** Fixed items (bottom section: notifications, profile, toggle) */
  fixedItems?: React.ReactNode;
  /** Header content (logo/branding) */
  header?: React.ReactNode;
  /** Selection change handler */
  onSelectionChange?: (detail: { name: string }) => void;
  /** @deprecated Merge is now controlled by the parent via `forceMerged`. This callback is no longer invoked. */
  onMergeChange?: (detail: { merged: boolean }) => void;
  /** Additional className */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Forwarded to the root <nav> element for test selectors. Items accept their own `data-testid`. */
  "data-testid"?: string;
}

/**
 * FxSideNavigationItem props
 */
export interface FxSideNavigationItemProps {
  /** Ref for imperative access */
  ref?: React.Ref<FxSideNavigationItemRef>;
  /** Unique name/key for the item */
  name: string;
  /** Icon to display */
  icon?: React.ReactNode;
  /** Icon to display when selected (e.g. filled variant) */
  selectedIcon?: React.ReactNode;
  /** Text label */
  text?: string;
  /** Badge count (for notifications) */
  badge?: string;
  /** Show add button (+) */
  showAddButton?: boolean;
  /** Tooltip for add button */
  addButtonTooltip?: string;
  /** Whether this item is selected */
  selected?: boolean;
  /** Whether this item is disabled */
  disabled?: boolean;
  /** Disable flyout (for items with their own popovers) */
  locked?: boolean;
  /** Avatar element (for fixed items like profile) */
  avatar?: React.ReactNode;
  /** Click handler */
  onClick?: (event: React.MouseEvent) => void;
  /** Add button click handler (receives mode/name of the nav item) */
  onAddClick?: (detail?: { mode: string }) => void;
  /** Additional className */
  className?: string;
  /** @internal ARIA role description for position (e.g., "navigation item, 1 of 5") */
  ariaRoleDescription?: string;
  /** Forwarded to the rendered item element for test selectors. */
  "data-testid"?: string;
}

/**
 * FxSideNavigation ref
 */
export interface FxSideNavigationRef {
  /** Close flyout for a specific item */
  closeFlyout: (itemName: string) => void;
  /** Whether the navigation is in merged mode (items combined into single list) */
  readonly isMerged: boolean;
  /** Access native DOM element */
  readonly nativeElement: HTMLElement | null;
  /** @deprecated Use nativeElement instead */
  getNativeElement: () => HTMLElement | null;
}

/**
 * FxSideNavigationItem ref
 */
export interface FxSideNavigationItemRef {
  /** Close this item's flyout */
  closeFlyout: () => void;
  /** Access native DOM element */
  readonly nativeElement: HTMLElement | null;
  /** @deprecated Use nativeElement instead */
  getNativeElement: () => HTMLElement | null;
}
