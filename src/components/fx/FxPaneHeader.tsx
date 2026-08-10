import React, {
  useRef,
  useImperativeHandle,
  useState,
  useCallback,
  useEffect,
  useMemo,
  Children,
  isValidElement,
  cloneElement,
} from "react";
import { cn, subTestId } from "../../lib/utils";
import {
  X,
  ChevronDown,

  Plus,
} from "lucide-react";
import { Button } from "../button/Button";
import type { ButtonClickEventDetail, ButtonRef } from "../../types/button";
import type { SplitButtonRef } from "../../types/split-button";
import { ToggleButton } from "../toggle-button/ToggleButton";
import { Menu, MenuItem, MenuSeparator, MenuHeader } from "../menu/Menu";
import type { RelationType } from "../../types/fx";
import { ConversationsIcon, SpacesIcon, JobsIcon, MenuIcon, MoreIcon, OpenCommandFieldIcon, CloseCommandFieldIcon, OpenCommandFieldRightIcon, CloseCommandFieldRightIcon } from "./icons";
import { SegmentedButton, SegmentedButtonItem } from "../segmented-button/SegmentedButton";
import { SplitButton } from "../split-button/SplitButton";
import {
  FxPaneHeaderProps,
  FxPaneHeaderActionProps,
  FxPaneHeaderSegmentedActionProps,
  FxPaneHeaderSplitActionProps,
} from "../../types/fx";
import { useFxLayoutContext } from "./FxLayout";
import { FxRenameTitle } from "./FxRenameTitle";
import { useTranslation } from "react-i18next";
import { NavigationLeftArrowIcon } from "../../icons/NavigationLeftArrow";
import "./FxPaneHeader.css";

// =============================================================================
// Constants
// =============================================================================

const BUTTON_GAP_SMALL = 4; // Gap between buttons within a group (gap-1 = 0.25rem = 4px)
const BUTTON_GAP_LARGE = 16; // Gap between button groups (ml-sapphire-s = 1rem = 16px)
const BREADCRUMB_TITLE_GAP = 16; // Extra spacing for breadcrumbs area (gaps + "/" separator) ~1rem
// Extra margin for bordered actions in start pane (12px + 4px gap = 16px total)
const BORDERED_ACTION_EXTRA_MARGIN = 12;
// Button designs that have a visible border (non-Tertiary)
// Button designs that have a VISIBLE border (not border-transparent)
// SecondaryNeutral and TertiaryNeutral have border-transparent, so they're NOT bordered
const BORDERED_DESIGNS = ["Primary", "PrimaryJoule", "Secondary", "SecondaryJoule", "Neutral"];
const PRIORITY_ORDER: Record<string, number> = {
  alwaysOverflow: -1,
  low: 0,
  medium: 1,
  high: 2,
};
// Breakpoint below which title edit mode hides all buttons except title
const SMALL_SCREEN_BREAKPOINT = 600;

const RELATION_TYPE_ORDER: RelationType[] = ["space", "job", "conversation"];

// =============================================================================
// FxPaneHeaderAction Component
// =============================================================================

export function FxPaneHeaderAction({
  icon,
  text,
  design = "Tertiary",
  size = "Medium",
  showText = false,
  priority = "medium",
  centered = false,
  disabled = false,
  tooltip,
  onClick,
  className,
  ref,
  "data-testid": dataTestId,
}: FxPaneHeaderActionProps) {
    const showTextLabel = showText && text;
    const buttonRef = useRef<ButtonRef>(null);

    // Combine forwarded ref with internal ref
    useImperativeHandle(ref, () => buttonRef.current as ButtonRef);

    const handleClick = (_detail: ButtonClickEventDetail) => {
      onClick?.({} as React.MouseEvent, buttonRef.current?.nativeElement || null);
    };

    return (
      <Button
        ref={buttonRef}
        design={design}
        size={size}
        disabled={disabled}
        tooltip={tooltip || text}
        icon={icon}
        iconOnly={!showTextLabel}
        onClick={handleClick}
        className={cn("shrink-0 fx-pane-header-action", className)}
        data-priority={priority}
        data-centered={centered}
        data-show-text={showText}
        data-text={text}
        data-testid={dataTestId}
      >
        {showTextLabel && text}
      </Button>
    );
}

FxPaneHeaderAction.displayName = "FxPaneHeaderAction";

// =============================================================================
// FxPaneHeaderSegmentedAction Component
// =============================================================================

interface SegmentedOptionProps {
  id: string;
  icon?: React.ReactNode;
  text?: string;
  selected?: boolean;
}

export function FxPaneHeaderSegmentedAction({
  priority = "medium",
  centered = false,
  selectedId,
  size = "Medium",
  showText = true,  // Can be controlled externally for text collapse
  children,
  onSelectionChange,
  className,
  ref,
  "data-testid": dataTestId,
}: FxPaneHeaderSegmentedActionProps) {
    // Extract options from children
    const options: SegmentedOptionProps[] = [];
    Children.forEach(children, (child) => {
      if (isValidElement(child) && (child.type as any)?.displayName === "FxPaneHeaderSegmentedOption") {
        options.push(child.props as SegmentedOptionProps);
      }
    });

    return (
      <SegmentedButton
        ref={ref}
        selectedId={selectedId}
        size={size}
        onSelectionChange={(detail) => onSelectionChange?.({ selectedId: detail.selectedId })}
        className={cn("shrink-0", className)}
        data-priority={priority}
        data-centered={centered}
        data-show-text={showText}
        data-testid={dataTestId}
      >
        {options.map((option) => (
          <SegmentedButtonItem
            key={option.id}
            id={option.id}
            icon={option.icon}
            // Only show text if showText is true
            text={showText ? option.text : undefined}
            selected={option.selected}
            data-testid={subTestId(dataTestId, option.id)}
          />
        ))}
      </SegmentedButton>
    );
}

FxPaneHeaderSegmentedAction.displayName = "FxPaneHeaderSegmentedAction";

// =============================================================================
// FxPaneHeaderSegmentedOption Component
// =============================================================================

export const FxPaneHeaderSegmentedOption: React.FC<{
  id: string;
  icon?: React.ReactNode;
  text?: string;
  selected?: boolean;
}> = () => null; // Render is handled by parent

FxPaneHeaderSegmentedOption.displayName = "FxPaneHeaderSegmentedOption";

// =============================================================================
// FxPaneHeaderSplitAction Component
// =============================================================================

interface SplitOptionProps {
  id: string;
  icon?: React.ReactNode;
  text?: string;
}

export function FxPaneHeaderSplitAction({
  icon,
  text,
  size = "Medium",
  showText = false,
  children,
  onClick,
  onOptionSelect,
  className,
  ref,
  "data-testid": dataTestId,
}: FxPaneHeaderSplitActionProps) {
    const splitRef = useRef<SplitButtonRef>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const showTextLabel = showText && text;

    // Extract options from children
    const options: SplitOptionProps[] = [];
    Children.forEach(children, (child) => {
      if (isValidElement(child) && (child.type as any)?.displayName === "FxPaneHeaderSplitOption") {
        options.push(child.props as SplitOptionProps);
      }
    });

    // Merge refs: forward ref + internal splitRef
    const mergedRef = useCallback(
      (node: SplitButtonRef | null) => {
        splitRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<SplitButtonRef | null>).current = node;
        }
      },
      [ref]
    );

    return (
      <>
        <SplitButton
          ref={mergedRef}
          icon={icon}
          text={showTextLabel ? text : undefined}
          size={size}
          onClick={() => onClick?.(undefined as unknown as React.MouseEvent)}
          onArrowClick={() => setDropdownOpen(prev => !prev)}
          activeArrowButton={dropdownOpen}
          className={cn("shrink-0", className)}
          data-testid={dataTestId}
        />
        <Menu
          opener={splitRef.current?.nativeElement}
          open={dropdownOpen}
          onClose={() => setDropdownOpen(false)}
          onItemClick={(detail) => {
            const optionId = detail.item.data as string;
            if (optionId) onOptionSelect?.({ optionId });
            setDropdownOpen(false);
          }}
        >
          {options.map((option) => (
            <MenuItem
              key={option.id}
              icon={option.icon}
              text={option.text}
              data={option.id}
              data-testid={subTestId(dataTestId, option.id)}
            />
          ))}
        </Menu>
      </>
    );
}

FxPaneHeaderSplitAction.displayName = "FxPaneHeaderSplitAction";

// =============================================================================
// FxPaneHeaderSplitOption Component
// =============================================================================

export const FxPaneHeaderSplitOption: React.FC<{
  id: string;
  icon?: React.ReactNode;
  text?: string;
}> = () => null; // Render is handled by parent

FxPaneHeaderSplitOption.displayName = "FxPaneHeaderSplitOption";

// =============================================================================
// Internal sub-components for FxPaneHeader's overflow / relations menus
//
// Extracted at module scope so the JSX they close over doesn't count toward
// `FxPaneHeader`'s cognitive complexity. Not exported — internal use only.
// =============================================================================

interface RelationsMenuTriggerProps {
  visible: boolean;
  open: boolean;
  onTriggerClick: () => void;
  onClose: () => void;
  tooltip: string;
  dataTestId?: string;
  renderItems: (closeMenu: () => void) => React.ReactNode;
}

function RelationsMenuTrigger({
  visible,
  open,
  onTriggerClick,
  onClose,
  tooltip,
  dataTestId,
  renderItems,
}: RelationsMenuTriggerProps) {
  // Hold the native element in state so we don't read `ref.current` during
  // render — the ref-callback below sets it once the Button mounts.
  const [opener, setOpener] = useState<HTMLElement | null>(null);
  const buttonRefCallback = useCallback((node: ButtonRef | null) => {
    setOpener(node?.nativeElement ?? null);
  }, []);

  if (!visible) return null;
  return (
    <>
      <Button
        ref={buttonRefCallback}
        design="SecondaryNeutral"
        size="Medium"
        iconOnly
        icon={<JobsIcon className="h-4 w-4" />}
        onClick={onTriggerClick}
        tooltip={tooltip}
        className="shrink-0 fx-pane-header-relations"
        data-testid={dataTestId}
      />
      {open && (
        <Menu
          key="relations-menu"
          open={open}
          opener={opener}
          onClose={onClose}
        >
          {renderItems(onClose)}
        </Menu>
      )}
    </>
  );
}

interface OverflowMenuTriggerProps {
  visible: boolean;
  open: boolean;
  onTriggerClick: () => void;
  onClose: () => void;
  tooltip: string;
  dataTestId?: string;
  showRelationsSubmenu: boolean;
  showSeparatorBeforeActions: boolean;
  renderRelationsSubmenu: (closeMenu: () => void) => React.ReactNode;
  renderActions: (closeMenu: () => void, isFirstInMenu: boolean) => React.ReactNode;
  actionsAreFirstInMenu: boolean;
  // The overflow button element is also used as the click target reference
  // for actions overflowed from the toolbar — exposed back to the parent so
  // those handlers can pass it along.
  onOpenerChange?: (el: HTMLElement | null) => void;
}

function OverflowMenuTrigger({
  visible,
  open,
  onTriggerClick,
  onClose,
  tooltip,
  dataTestId,
  showRelationsSubmenu,
  showSeparatorBeforeActions,
  renderRelationsSubmenu,
  renderActions,
  actionsAreFirstInMenu,
  onOpenerChange,
}: OverflowMenuTriggerProps) {
  const [opener, setOpener] = useState<HTMLElement | null>(null);
  const buttonRefCallback = useCallback((node: ButtonRef | null) => {
    const el = node?.nativeElement ?? null;
    setOpener(el);
    onOpenerChange?.(el);
  }, [onOpenerChange]);

  if (!visible) return null;
  return (
    <>
      <Button
        ref={buttonRefCallback}
        design="SecondaryNeutral"
        size="Medium"
        iconOnly
        icon={<MoreIcon className="h-4 w-4" />}
        onClick={onTriggerClick}
        tooltip={tooltip}
        className="shrink-0 fx-pane-header-overflow"
        data-testid={dataTestId}
      />
      {open && (
        <Menu
          key="overflow-menu"
          open={open}
          opener={opener}
          onClose={onClose}
        >
          {showRelationsSubmenu && renderRelationsSubmenu(onClose)}
          {showSeparatorBeforeActions && <MenuSeparator />}
          {renderActions(onClose, actionsAreFirstInMenu)}
        </Menu>
      )}
    </>
  );
}

// =============================================================================
// FxPaneHeader Component
// =============================================================================

/**
 * FxPaneHeader - Header bar for panes in FxLayout
 *
 * Features:
 * - Responsive overflow: actions collapse text then overflow to menu based on priority
 * - Title editing: double-click to edit with animated background
 * - Relations menu: shows related spaces/jobs/conversations
 * - Toggle buttons: show/hide start and end panes
 */
export function FxPaneHeader({
  pane = "center",
  showBack = false,
  title = "",
  showTitleArrow = false,
  showAddButton = false,
  addButtonTooltip,
  related = [],
  titleEditable = false,
  titleEditMode: controlledEditMode,
  headingLevel,
  breadcrumbs,
  subheader,
  children,
  onBackClick,
  onTitleArrowClick,
  onRelationClick,
  onTitleEditAccept,
  onTitleEditCancel,
  onTitleEditModeChange,
  onAddClick,
  showBorder = false,
  className,
  style,
  ref,
  "data-testid": dataTestId,
}: FxPaneHeaderProps) {
    const { t } = useTranslation("fx");
    const relationTypeLabels: Record<RelationType, string> = {
      space: t("FX_RELATED_SPACES"),
      job: t("FX_RELATED_JOBS"),
      conversation: t("FX_RELATED_CONVERSATIONS"),
    };
    const headerRef = useRef<HTMLElement>(null);
    const Heading = headingLevel ?? (pane === "center" ? "h1" : "h2");
    const measureContainerRef = useRef<HTMLDivElement>(null);
    const titleArrowRef = useRef<HTMLButtonElement>(null);
    // Captured on mount via the OverflowMenuTrigger's ref callback so action
    // click handlers can pass the trigger element to consumers' onClick.
    const [overflowOpenerEl, setOverflowOpenerEl] = useState<HTMLElement | null>(null);
    const renameTitleRef = useRef<any>(null);

    const [internalEditMode, setInternalEditMode] = useState(false);
    const [relationsMenuOpen, setRelationsMenuOpen] = useState(false);
    const [overflowMenuOpen, setOverflowMenuOpen] = useState(false);
    const [headerWidth, setHeaderWidth] = useState(0);
    const [measurements, setMeasurements] = useState<{
      // Breadcrumb measurements
      breadcrumbItems: number[];      // Width of each item INCLUDING its trailing separator
      breadcrumbOverflow: number;     // Width of overflow button WITH separator (used when some items visible)
      breadcrumbOverflowOnly: number; // Width of overflow button WITHOUT separator (used when all overflowed)
      breadcrumbSeparator: number;    // Width of the "/" separator between breadcrumbs and title
      // Other measurements
      startSection: number;
      hamburger: number;
      toggleStart: number;
      backButton: number;
      toggleEnd: number;
      overflow: number;
      relations: number;
      actions: Array<{ iconOnly: number; withText: number }>;
    } | null>(null);

    const editMode = controlledEditMode ?? internalEditMode;

    // Get layout context for visibility state and toggle functions
    const layoutContext = useFxLayoutContext();

    // Use context values for pressed state, falling back to false if no context
    const startPaneVisible = layoutContext?.startVisible ?? false;
    const endPaneVisible = layoutContext?.endVisible ?? false;
    const compactMode = layoutContext?.compactMode ?? false;
    const leftmostVisiblePane = layoutContext?.leftmostVisiblePane ?? "start";
    const maxPanes = layoutContext?.maxPanes ?? 3;
    const utilityEndPane = layoutContext?.utilityEndPane ?? false;
    const isSettingsMode = layoutContext?.isSettingsMode ?? false;
    const allowStart = layoutContext?.allowStart ?? true;
    const allowEnd = layoutContext?.allowEnd ?? true;

    // Determine header type based on pane prop
    const isCenterHeader = pane === "center";
    const isEndHeader = pane === "end";

    // Internal handlers from layout context
    const handleToggleStart = layoutContext?.toggleStartPane;
    const handleToggleEnd = layoutContext?.toggleEndPane;
    const handleHamburger = layoutContext?.openNavigation;
    // Close button uses toggleEndPane from context (internal layout interaction)
    // Show close button on end header when: maxPanes === 1 OR utility mode (toggle button is suppressed in utility mode)
    const handleClose = isEndHeader && (maxPanes === 1 || utilityEndPane) ? layoutContext?.toggleEndPane : undefined;

    // Toggle button visibility derived from context (internal, not exposed as props)
    // - Start toggle: only in center header, when start pane is allowed
    // - End toggle: only in center header, when end pane is allowed and not utility mode
    const showStartToggle = isCenterHeader && allowStart && handleToggleStart && (maxPanes >= 2 || !showBack);
    const toggleStartUsesBackIcon = maxPanes === 1;

    // Show end toggle in center header (hidden in settings mode since end pane is suppressed)
    // Also hidden when utilityEndPane is true (conversations mode uses close button on end header instead)
    const showEndToggle = isCenterHeader && allowEnd && !utilityEndPane && !isSettingsMode && handleToggleEnd;

    // Hamburger shown only in the leftmost visible pane in compact mode
    // This ensures when vertical compact mode has multiple panes visible, hamburger appears once
    const showHamburger = compactMode && handleHamburger && pane === leftmostVisiblePane;

    // Back button shown in center and end headers when app sets showBack
    const showBackButton = (isCenterHeader || isEndHeader) && showBack;

    // Has related items
    const hasRelated = related.length > 0;

    // Small screen mode: when in edit mode AND header is narrow, hide all buttons except title
    const isSmallScreenEditMode = editMode && headerWidth > 0 && headerWidth < SMALL_SCREEN_BREAKPOINT;

    useImperativeHandle(ref, () => ({
      focus: () => headerRef.current?.focus(),
      get nativeElement() { return headerRef.current; },
      getNativeElement: () => headerRef.current,
    }));

    // Parse children into action items with metadata
    // Recursively flatten Fragments since Children.toArray doesn't do it for single Fragment children
    const actionItems = useMemo(() => {
      const items: Array<{
        element: React.ReactElement;
        priority: number;
        showText: boolean;
        text: string;
        icon: React.ReactNode;
        centered: boolean;
        isSegmented: boolean;
      }> = [];

      // Recursively flatten children, including Fragments
      const flattenChildren = (nodes: React.ReactNode): React.ReactElement[] => {
        const result: React.ReactElement[] = [];
        Children.forEach(nodes, (child) => {
          if (!isValidElement(child)) return;
          // Check if it's a Fragment (type is React.Fragment symbol)
          if (child.type === React.Fragment) {
            // Recursively flatten Fragment's children
            result.push(...flattenChildren((child.props as { children?: React.ReactNode }).children));
          } else {
            result.push(child);
          }
        });
        return result;
      };

      const flatChildren = flattenChildren(children);

      flatChildren.forEach((child) => {
        const props = child.props as any;
        const priorityProp = props.priority || "medium";
        const priorityValue = PRIORITY_ORDER[priorityProp] ?? 1;
        const displayName = (child.type as any)?.displayName;
        const isSegmented = displayName === "FxPaneHeaderSegmentedAction";
        items.push({
          element: child,
          priority: priorityValue,
          // For segmented actions, showText defaults to true (always has text initially)
          showText: isSegmented ? (props.showText ?? true) : (props.showText ?? false),
          text: props.text ?? "",
          icon: props.icon,
          centered: props.centered ?? false,
          isSegmented,
        });
      });

      return items;
    }, [children]);

    // Extract breadcrumb item data for measurement
    const breadcrumbItemData = useMemo(() => {
      if (!breadcrumbs || !isValidElement(breadcrumbs)) return [];
      const items: Array<{ text: string }> = [];
      Children.forEach((breadcrumbs as React.ReactElement<any>).props.children, (child) => {
        if (isValidElement(child) && (child.type as any)?.displayName === "BreadcrumbsItem") {
          const childProps = child.props as { children?: React.ReactNode };
          // Extract text - handle string children
          const text = typeof childProps.children === "string" ? childProps.children : "";
          items.push({ text });
        }
      });
      return items;
    }, [breadcrumbs]);

    // Calculate overflow state based on measurements and width
    const overflowState = useMemo(() => {
      // Always exclude alwaysOverflow actions from visible set
      const nonOverflowIndices = actionItems
        .map((item, i) => ({ item, i }))
        .filter(({ item }) => item.priority !== PRIORITY_ORDER.alwaysOverflow)
        .map(({ i }) => i);

      const totalBreadcrumbItems = breadcrumbItemData.length;

      if (!measurements || headerWidth === 0) {
        // Default: show all actions and breadcrumbs
        return {
          visibleIndices: new Set(nonOverflowIndices),
          textVisibility: actionItems.map((item) => item.showText),
          relationsVisible: hasRelated,
          breadcrumbOverflowCount: 0,
        };
      }

      const m = measurements;
      const availableWidth = headerWidth;

      // Calculate base fixed width (elements that never overflow, excluding breadcrumbs)
      // Left built-in buttons are grouped with 4px gaps, then 16px to title
      let baseFixedWidth = m.startSection; // Title section
      let hasLeftBuiltIn = false;

      if (showHamburger && m.hamburger > 0) {
        baseFixedWidth += m.hamburger;
        hasLeftBuiltIn = true;
      }
      if (showStartToggle && m.toggleStart > 0) {
        if (hasLeftBuiltIn) baseFixedWidth += BUTTON_GAP_SMALL;
        baseFixedWidth += m.toggleStart;
        hasLeftBuiltIn = true;
      }
      if (showBackButton && m.backButton > 0) {
        if (hasLeftBuiltIn) baseFixedWidth += BUTTON_GAP_SMALL;
        baseFixedWidth += m.backButton;
        hasLeftBuiltIn = true;
      }
      // Add 16px gap between left built-in group and title
      if (hasLeftBuiltIn) {
        baseFixedWidth += BUTTON_GAP_LARGE;
      }

      // Reserve extra space in edit mode
      if (editMode) {
        baseFixedWidth += 200;
      }

      // Right built-in buttons (toggle-end, add, close) - grouped with 4px gaps
      // They have 16px gap from user content group
      let builtInWidth = 0;
      let hasRightBuiltIn = false;
      if (showEndToggle && m.toggleEnd > 0) {
        builtInWidth += m.toggleEnd;
        hasRightBuiltIn = true;
      }
      // Note: add button and close button would be added here if measured
      // For now, toggle-end is the main one we measure

      // Add 16px gap before right built-in group (from user content)
      if (hasRightBuiltIn) {
        builtInWidth += BUTTON_GAP_LARGE;
      }

      // Calculate breadcrumbs width for a given overflow count
      // Includes the "/" separator and gaps between breadcrumbs and title
      const calcBreadcrumbsWidth = (overflowCount: number): number => {
        if (totalBreadcrumbItems === 0) return 0;

        if (overflowCount >= totalBreadcrumbItems) {
          // All items overflowed - just overflow button (no separator from breadcrumbs, header provides "/")
          return m.breadcrumbOverflowOnly + BREADCRUMB_TITLE_GAP;
        }

        if (overflowCount === 0) {
          // All items visible - sum of all items (each includes separator)
          const itemsWidth = m.breadcrumbItems.reduce((sum, w) => sum + w, 0);
          return itemsWidth + BREADCRUMB_TITLE_GAP;
        }

        // Some items overflowed - overflow button + visible items
        const visibleItemsWidth = m.breadcrumbItems.slice(overflowCount).reduce((sum, w) => sum + w, 0);
        return m.breadcrumbOverflow + visibleItemsWidth + BREADCRUMB_TITLE_GAP;
      };

      // Initialize action states
      const actionStates = actionItems.map((item, index) => ({
        index,
        showText: item.showText,
        visible: item.priority !== PRIORITY_ORDER.alwaysOverflow,
        priority: item.priority,
      }));

      let relationsVisible = hasRelated;
      let breadcrumbOverflowCount = 0;

      // Check if this is start pane for bordered action extra margin
      const isStartPane = pane === "start";

      // Calculate total width needed for user content group (actions, relations, overflow)
      // All items within this group have 4px gaps
      // In start pane: bordered actions get extra 12px margin (16px total gap from borderless buttons)
      const calcActionsWidth = (): number => {
        let width = 0;
        let itemCount = 0;

        if (relationsVisible && m.relations > 0) {
          width += m.relations;
          itemCount++;
        }

        for (const state of actionStates) {
          if (state.visible && m.actions[state.index]) {
            const aw = m.actions[state.index];
            const actionItem = actionItems[state.index];
            const actionProps = actionItem.element.props as FxPaneHeaderActionProps;
            const hasBorderedDesign = BORDERED_DESIGNS.includes(actionProps.design || "Tertiary");
            width += (state.showText ? aw.withText : aw.iconOnly);
            // Add extra margin for bordered actions in start pane only
            if (isStartPane && hasBorderedDesign) {
              width += BORDERED_ACTION_EXTRA_MARGIN;
            }
            itemCount++;
          }
        }

        // Overflow button if any hidden
        const hasHidden = actionStates.some((s) => !s.visible);
        const relationsOverflowed = hasRelated && !relationsVisible;
        if ((hasHidden || relationsOverflowed) && m.overflow > 0) {
          width += m.overflow;
          itemCount++;
        }

        // Add 4px gaps between items (itemCount - 1 gaps)
        if (itemCount > 1) {
          width += (itemCount - 1) * BUTTON_GAP_SMALL;
        }

        return width;
      };

      // Check if everything fits with given breadcrumb overflow count
      const fits = (bcOverflow: number): boolean => {
        const breadcrumbsWidth = calcBreadcrumbsWidth(bcOverflow);
        const fixedWidth = baseFixedWidth + breadcrumbsWidth;
        const spaceForButtons = availableWidth - fixedWidth - builtInWidth;
        return calcActionsWidth() <= spaceForButtons;
      };

      // Phase 1: Overflow breadcrumb items one by one (from left)
      while (!fits(breadcrumbOverflowCount) && breadcrumbOverflowCount < totalBreadcrumbItems) {
        breadcrumbOverflowCount++;
      }

      // Now calculate space with current breadcrumb overflow
      const breadcrumbsWidth = calcBreadcrumbsWidth(breadcrumbOverflowCount);
      const fixedWidth = baseFixedWidth + breadcrumbsWidth;
      const spaceForButtons = availableWidth - fixedWidth - builtInWidth;
      const fitsActions = () => calcActionsWidth() <= spaceForButtons;

      // Phase 2: Collapse action text by priority (low first), then left-to-right within same priority
      while (!fitsActions()) {
        let targetIdx = -1;
        let targetPriority = Infinity;
        let targetOriginalIndex = Infinity;

        for (let i = 0; i < actionStates.length; i++) {
          const state = actionStates[i];
          if (state.visible && state.showText) {
            if (
              state.priority < targetPriority ||
              (state.priority === targetPriority && state.index < targetOriginalIndex)
            ) {
              targetIdx = i;
              targetPriority = state.priority;
              targetOriginalIndex = state.index;
            }
          }
        }

        if (targetIdx === -1) break;
        actionStates[targetIdx].showText = false;
      }

      // Phase 3: Overflow relations (but keep visible if menu is open)
      if (!fitsActions() && relationsVisible && !relationsMenuOpen) {
        relationsVisible = false;
      }

      // Phase 4: Overflow actions by priority (low first), then left-to-right within same priority
      while (!fitsActions()) {
        let targetIdx = -1;
        let targetPriority = Infinity;
        let targetOriginalIndex = Infinity;

        for (let i = 0; i < actionStates.length; i++) {
          const state = actionStates[i];
          if (state.visible) {
            if (
              state.priority < targetPriority ||
              (state.priority === targetPriority && state.index < targetOriginalIndex)
            ) {
              targetIdx = i;
              targetPriority = state.priority;
              targetOriginalIndex = state.index;
            }
          }
        }

        if (targetIdx === -1) break;
        actionStates[targetIdx].visible = false;
      }

      return {
        visibleIndices: new Set(actionStates.filter((s) => s.visible).map((s) => s.index)),
        textVisibility: actionStates.map((s) => s.showText),
        relationsVisible,
        breadcrumbOverflowCount,
      };
    }, [
      measurements,
      headerWidth,
      actionItems,
      hasRelated,
      showHamburger,
      showStartToggle,
      showBackButton,
      showEndToggle,
      editMode,
      relationsMenuOpen,
      breadcrumbItemData,
    ]);

    // Find centered action index (first visible action with centered=true)
    const centeredActionIndex = useMemo(() => {
      for (let i = 0; i < actionItems.length; i++) {
        if (actionItems[i].centered && overflowState.visibleIndices.has(i)) {
          return i;
        }
      }
      return -1;
    }, [actionItems, overflowState.visibleIndices]);

    // Calculate centering available space
    const centeringAvailableSpace = useMemo((): [number, number] => {
      if (!measurements || headerWidth === 0 || centeredActionIndex === -1) {
        return [-1, -1];
      }

      const m = measurements;
      const centeredMeasurement = m.actions[centeredActionIndex];
      if (!centeredMeasurement) {
        return [-1, -1];
      }

      // Get centered action width (use text visibility from overflow state)
      const showText = overflowState.textVisibility[centeredActionIndex];
      const centeredWidth = showText ? centeredMeasurement.withText : centeredMeasurement.iconOnly;

      // Calculate left side content width
      // Left built-in buttons grouped with 4px gaps, then 16px to title
      let leftContentWidth = m.startSection;
      let leftBuiltInCount = 0;

      if (showHamburger && m.hamburger > 0) {
        leftContentWidth += m.hamburger;
        leftBuiltInCount++;
      }
      if (showStartToggle && m.toggleStart > 0) {
        leftContentWidth += m.toggleStart;
        leftBuiltInCount++;
      }
      // Add 4px gaps between left built-in buttons
      if (leftBuiltInCount > 1) {
        leftContentWidth += (leftBuiltInCount - 1) * BUTTON_GAP_SMALL;
      }
      // Add 16px gap between left built-in group and title
      if (leftBuiltInCount > 0) {
        leftContentWidth += BUTTON_GAP_LARGE;
      }

      // Add visible actions before centered (4px gaps between them)
      let actionsBeforeCount = 0;
      for (let i = 0; i < centeredActionIndex; i++) {
        if (overflowState.visibleIndices.has(i)) {
          const aw = m.actions[i];
          if (aw) {
            const hasText = overflowState.textVisibility[i];
            leftContentWidth += (hasText ? aw.withText : aw.iconOnly);
            actionsBeforeCount++;
          }
        }
      }
      if (actionsBeforeCount > 0) {
        leftContentWidth += actionsBeforeCount * BUTTON_GAP_SMALL; // gaps after each action
      }

      // Calculate right side content width
      // User content group (actions after centered, relations, overflow) with 4px gaps
      let rightUserContentWidth = 0;
      let rightUserContentCount = 0;

      for (let i = centeredActionIndex + 1; i < actionItems.length; i++) {
        if (overflowState.visibleIndices.has(i)) {
          const aw = m.actions[i];
          if (aw) {
            const hasText = overflowState.textVisibility[i];
            rightUserContentWidth += (hasText ? aw.withText : aw.iconOnly);
            rightUserContentCount++;
          }
        }
      }

      // Calculate if we need overflow button for centering calculation
      const hasOverflowedActions = actionItems.some((_, i) => !overflowState.visibleIndices.has(i));
      const relationsOverflowed = hasRelated && !overflowState.relationsVisible;
      const needsOverflowButton = hasOverflowedActions || relationsOverflowed;

      if (needsOverflowButton && m.overflow > 0) {
        rightUserContentWidth += m.overflow;
        rightUserContentCount++;
      }
      if (overflowState.relationsVisible && hasRelated && m.relations > 0) {
        rightUserContentWidth += m.relations;
        rightUserContentCount++;
      }

      // Add 4px gaps between user content items
      if (rightUserContentCount > 1) {
        rightUserContentWidth += (rightUserContentCount - 1) * BUTTON_GAP_SMALL;
      }

      // Right built-in buttons (toggle-end) with 16px gap from user content
      let rightBuiltInWidth = 0;
      if (showEndToggle && m.toggleEnd > 0) {
        rightBuiltInWidth += m.toggleEnd;
        // Add 16px gap before right built-in group
        rightBuiltInWidth += BUTTON_GAP_LARGE;
      }

      const rightContentWidth = rightUserContentWidth + rightBuiltInWidth;

      // Calculate available space on each side when centered
      const halfTotal = headerWidth / 2;
      const halfCentered = centeredWidth / 2;

      const leftSpace = halfTotal - halfCentered - leftContentWidth;
      const rightSpace = halfTotal - halfCentered - rightContentWidth;

      return [Math.floor(leftSpace), Math.floor(rightSpace)];
    }, [
      measurements,
      headerWidth,
      centeredActionIndex,
      actionItems,
      overflowState,
      showHamburger,
      showStartToggle,
      showEndToggle,
      hasRelated,
    ]);

    // Whether centering is active (requires BUTTON_GAP_SMALL space on each side)
    const centeringActive = centeringAvailableSpace[0] >= BUTTON_GAP_SMALL && centeringAvailableSpace[1] >= BUTTON_GAP_SMALL;

    // Visible and overflowed actions
    const visibleActions = actionItems.filter((_, i) => overflowState.visibleIndices.has(i));
    const overflowedActions = actionItems.filter((_, i) => !overflowState.visibleIndices.has(i));

    // Actions before and after the centered action (for 3-zone layout)
    const actionsBeforeCentered = centeringActive
      ? visibleActions.filter((_, i) => {
          const originalIndex = actionItems.indexOf(visibleActions[i]);
          return originalIndex < centeredActionIndex;
        })
      : [];
    const actionsAfterCentered = centeringActive
      ? visibleActions.filter((_, i) => {
          const originalIndex = actionItems.indexOf(visibleActions[i]);
          return originalIndex > centeredActionIndex;
        })
      : [];
    const centeredAction = centeringActive && centeredActionIndex !== -1
      ? actionItems[centeredActionIndex]
      : null;
    const showOverflowButton =
      overflowedActions.length > 0 || (hasRelated && !overflowState.relationsVisible);

    // ResizeObserver for responsive overflow
    useEffect(() => {
      const header = headerRef.current;
      if (!header) return;

      const observer = new ResizeObserver((entries) => {
        const newWidth = Math.floor(entries[0]?.contentRect.width || 0);
        if (newWidth !== headerWidth) {
          setHeaderWidth(newWidth);
        }
      });

      observer.observe(header);
      return () => observer.disconnect();
    }, [headerWidth]);

    // Clone breadcrumbs with controlled overflow and subtle link design
    const renderBreadcrumbs = useCallback(() => {
      if (!breadcrumbs || !isValidElement(breadcrumbs)) return breadcrumbs;
      return cloneElement(breadcrumbs as React.ReactElement<any>, {
        overflowCount: overflowState.breadcrumbOverflowCount,
        noPadding: true,
      });
    }, [breadcrumbs, overflowState.breadcrumbOverflowCount]);

    // Measure elements on mount and when children change
    useEffect(() => {
      const measureContainer = measureContainerRef.current;
      if (!measureContainer) return;

      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        const getWidth = (selector: string): number => {
          const el = measureContainer.querySelector<HTMLElement>(selector);
          return el?.offsetWidth || 0;
        };

        // Measure breadcrumb items
        const breadcrumbItems: number[] = [];
        for (let i = 0; i < breadcrumbItemData.length; i++) {
          breadcrumbItems.push(getWidth(`[data-measure="bc-item-${i}"]`));
        }

        const actions: Array<{ iconOnly: number; withText: number }> = [];
        for (let i = 0; i < actionItems.length; i++) {
          actions.push({
            iconOnly: getWidth(`[data-measure="${i}-icon"]`),
            withText: getWidth(`[data-measure="${i}-text"]`),
          });
        }

        setMeasurements({
          breadcrumbItems,
          breadcrumbOverflow: getWidth("[data-measure='bc-overflow']"),
          breadcrumbOverflowOnly: getWidth("[data-measure='bc-overflow-only']"),
          breadcrumbSeparator: getWidth("[data-measure='bc-separator']"),
          startSection: getWidth("[data-measure='start-section']"),
          hamburger: getWidth("[data-measure='hamburger']"),
          toggleStart: getWidth("[data-measure='toggle-start']"),
          backButton: getWidth("[data-measure='back-button']"),
          toggleEnd: getWidth("[data-measure='toggle-end']"),
          overflow: getWidth("[data-measure='overflow']"),
          relations: getWidth("[data-measure='relations']"),
          actions,
        });
      });
    }, [actionItems, breadcrumbItemData]);

    const handleTitleEditAccept = useCallback(
      (detail: { value: string; previousValue: string }) => {
        setInternalEditMode(false);
        onTitleEditAccept?.(detail);
      },
      [onTitleEditAccept]
    );

    const handleTitleEditCancel = useCallback(
      (detail: { value: string }) => {
        setInternalEditMode(false);
        onTitleEditCancel?.(detail);
      },
      [onTitleEditCancel]
    );

    const handleTitleEditModeChange = useCallback(
      ({ editMode: newEditMode }: { editMode: boolean }) => {
        setInternalEditMode(newEditMode);
        onTitleEditModeChange?.({ editMode: newEditMode });
      },
      [onTitleEditModeChange]
    );

    const getRelationIcon = (type: string) => {
      switch (type) {
        case "space":
          return <SpacesIcon className="h-4 w-4" />;
        case "job":
          return <JobsIcon className="h-4 w-4" />;
        case "conversation":
          return <ConversationsIcon className="h-4 w-4" />;
        default:
          return <JobsIcon className="h-4 w-4" />;
      }
    };

    // Group relations by type for menu rendering
    const groupedRelations = useMemo(() => {
      const groups: Record<RelationType, typeof related> = {
        space: [],
        job: [],
        conversation: [],
      };
      related.forEach((item) => {
        if (groups[item.type]) {
          groups[item.type].push(item);
        }
      });
      return groups;
    }, [related]);

    // Render grouped relation menu items
    const renderRelationMenuItems = useCallback(
      (closeMenu: () => void) => {
        const items: React.ReactNode[] = [];
        let isFirstGroup = true;

        RELATION_TYPE_ORDER.forEach((type) => {
          const typeRelations = groupedRelations[type];
          if (typeRelations.length === 0) return;

          // Add separator between groups (not before first)
          if (!isFirstGroup) {
            items.push(<MenuSeparator key={`sep-${type}`} />);
          }
          isFirstGroup = false;

          // Add group header
          items.push(
            <MenuHeader key={`header-${type}`} text={relationTypeLabels[type]} />
          );

          // Add items in this group
          typeRelations.forEach((item) => {
            items.push(
              <MenuItem
                key={item.id}
                icon={item.icon || getRelationIcon(item.type)}
                text={item.name}
                checked={item.selected}
                data-testid={item["data-testid"]}
                onClick={() => {
                  onRelationClick?.(item);
                  closeMenu();
                }}
              />
            );
          });
        });

        return items;
      },
      [groupedRelations, onRelationClick]
    );

    // Render an action with given text visibility
    // In start pane only: bordered actions (non-Tertiary design) get extra left margin (12px) for 16px total gap
    const isStartPane = pane === "start";

    const renderAction = (item: typeof actionItems[0], index: number, showText: boolean, forMeasurement = false) => {
      const child = item.element;
      const displayName = (child.type as any)?.displayName;
      const props = child.props as FxPaneHeaderActionProps;

      // Check if this action has a bordered design (for extra margin in start pane only)
      const hasBorderedDesign = BORDERED_DESIGNS.includes(props.design || "Tertiary");
      const extraMarginClass = (isStartPane && hasBorderedDesign) ? "ml-3" : ""; // 12px extra + 4px gap = 16px total

      // Clone with potentially modified showText
      if (displayName === "FxPaneHeaderAction") {
        return (
          <FxPaneHeaderAction
            key={index}
            {...props}
            showText={showText && props.showText}
            className={cn(props.className, extraMarginClass)}
            data-testid={forMeasurement ? undefined : props["data-testid"]}
          />
        );
      }

      // For segmented actions, they always have a border, so add extra margin in start pane
      if (displayName === "FxPaneHeaderSegmentedAction") {
        const segProps = child.props as FxPaneHeaderSegmentedActionProps;
        const segExtraMargin = isStartPane ? "ml-3" : "";
        return (
          <FxPaneHeaderSegmentedAction
            key={index}
            {...segProps}
            showText={showText}
            className={cn(segProps.className, segExtraMargin)}
            data-testid={forMeasurement ? undefined : segProps["data-testid"]}
          />
        );
      }

      // For split actions, they always have a border, so add extra margin in start pane
      if (displayName === "FxPaneHeaderSplitAction") {
        const splitProps = child.props as FxPaneHeaderSplitActionProps;
        const splitExtraMargin = isStartPane ? "ml-3" : "";
        return (
          <FxPaneHeaderSplitAction
            key={index}
            {...splitProps}
            showText={showText && splitProps.showText}
            className={cn(splitProps.className, splitExtraMargin)}
            data-testid={forMeasurement ? undefined : splitProps["data-testid"]}
          />
        );
      }

      // For unknown actions, render as-is but strip testid for measurement clones
      return React.cloneElement(child, {
        key: index,
        ...(forMeasurement ? { "data-testid": undefined } : {}),
      });
    };

    // Render overflowed actions in the overflow menu
    const renderOverflowedActions = useCallback(
      (closeMenu: () => void, isFirstInMenu: boolean) => {
        const items: React.ReactNode[] = [];

        overflowedActions.forEach((item, index) => {
          const child = item.element;
          const displayName = (child.type as any)?.displayName;
          const isFirst = index === 0 && isFirstInMenu;
          const isLast = index === overflowedActions.length - 1;

          if (displayName === "FxPaneHeaderAction") {
            // Regular action - render as a simple menu item
            const props = child.props as FxPaneHeaderActionProps;
            items.push(
              <MenuItem
                key={`action-${index}`}
                icon={props.icon}
                text={props.text || props.tooltip || "Action"}
                data-testid={props["data-testid"]}
                onClick={() => {
                  props.onClick?.({} as React.MouseEvent, overflowOpenerEl);
                  closeMenu();
                }}
              />
            );
          } else if (displayName === "FxPaneHeaderSegmentedAction") {
            // Segmented action - render each option as flat menu items with checkmarks
            // Add separator before if not first item in menu
            const props = child.props as FxPaneHeaderSegmentedActionProps;
            const segRootTestId = props["data-testid"];
            const options: Array<{ id: string; icon?: React.ReactNode; text?: string; selected?: boolean }> = [];
            Children.forEach(props.children, (optChild) => {
              if (isValidElement(optChild) && (optChild.type as any)?.displayName === "FxPaneHeaderSegmentedOption") {
                options.push(optChild.props as any);
              }
            });

            // Add separator before if not first
            if (!isFirst && items.length > 0) {
              items.push(<MenuSeparator key={`seg-sep-before-${index}`} />);
            }

            // Render each option with checkmark for selected
            options.forEach((opt) => {
              const isSelected = opt.selected || opt.id === props.selectedId;
              items.push(
                <MenuItem
                  key={`seg-${index}-${opt.id}`}
                  icon={opt.icon}
                  text={opt.text}
                  endContent={isSelected ? <span className="text-primary">✓</span> : undefined}
                  data-testid={subTestId(segRootTestId, opt.id)}
                  onClick={() => {
                    props.onSelectionChange?.({ selectedId: opt.id });
                    closeMenu();
                  }}
                />
              );
            });

            // Add separator after if not last
            if (!isLast) {
              items.push(<MenuSeparator key={`seg-sep-after-${index}`} />);
            }
          } else if (displayName === "FxPaneHeaderSplitAction") {
            // Split action - render as menu item with submenu for options
            const props = child.props as FxPaneHeaderSplitActionProps;
            const splitRootTestId = props["data-testid"];
            const options: Array<{ id: string; icon?: React.ReactNode; text?: string }> = [];
            Children.forEach(props.children, (optChild) => {
              if (isValidElement(optChild) && (optChild.type as any)?.displayName === "FxPaneHeaderSplitOption") {
                options.push(optChild.props as any);
              }
            });

            // Render as menu item with submenu
            items.push(
              <MenuItem
                key={`split-${index}`}
                icon={props.icon}
                text={props.text || "Action"}
                data-testid={splitRootTestId}
              >
                {/* Submenu items for options */}
                {options.map((opt) => (
                  <MenuItem
                    key={`split-opt-${index}-${opt.id}`}
                    icon={opt.icon}
                    text={opt.text}
                    data-testid={subTestId(splitRootTestId, opt.id)}
                    onClick={() => {
                      props.onOptionSelect?.({ optionId: opt.id });
                      closeMenu();
                    }}
                  />
                ))}
              </MenuItem>
            );
          } else {
            // Unknown action type - render with generic text if available
            const props = child.props as any;
            if (props.text || props.tooltip || props.icon) {
              items.push(
                <MenuItem
                  key={`unknown-${index}`}
                  icon={props.icon}
                  text={props.text || props.tooltip || "Action"}
                  data-testid={props["data-testid"]}
                  onClick={() => {
                    props.onClick?.({} as React.MouseEvent);
                    closeMenu();
                  }}
                />
              );
            }
          }
        });

        return items;
      },
      [overflowedActions, overflowOpenerEl]
    );

    // Render relations as a submenu in the overflow menu
    const renderOverflowRelationsSubmenu = useCallback(
      (closeMenu: () => void) => {
        // Create the submenu items (grouped by type)
        const submenuItems: React.ReactNode[] = [];
        let isFirstGroup = true;

        RELATION_TYPE_ORDER.forEach((type) => {
          const typeRelations = groupedRelations[type];
          if (typeRelations.length === 0) return;

          // Add separator between groups (not before first)
          if (!isFirstGroup) {
            submenuItems.push(<MenuSeparator key={`overflow-sep-${type}`} />);
          }
          isFirstGroup = false;

          // Add group header
          submenuItems.push(
            <MenuHeader key={`overflow-header-${type}`} text={relationTypeLabels[type]} />
          );

          // Add items in this group
          typeRelations.forEach((item) => {
            submenuItems.push(
              <MenuItem
                key={`overflow-rel-${item.id}`}
                icon={item.icon || getRelationIcon(item.type)}
                text={item.name}
                checked={item.selected}
                data-testid={item["data-testid"]}
                onClick={() => {
                  onRelationClick?.(item);
                  closeMenu();
                }}
              />
            );
          });
        });

        // Return a single "Related" menu item with the submenu items as children
        return (
          <MenuItem
            key="overflow-relations"
            icon={<JobsIcon className="h-4 w-4" />}
            text={t("FX_RELATED")}
            data-testid={subTestId(dataTestId, "relations")}
          >
            {submenuItems}
          </MenuItem>
        );
      },
      [groupedRelations, onRelationClick, dataTestId, t, relationTypeLabels]
    );

    // Hoisted button JSX shared between the regular and 3-part centering
    // layouts — keeps the two layout branches in lockstep and avoids
    // structural duplication across the two render trees.
    const backButtonJsx = showBackButton ? (
      <Button
        design="SecondaryNeutral"
        size="Medium"
        iconOnly
        icon={<NavigationLeftArrowIcon />}
        onClick={() => onBackClick?.()}
        tooltip={t("FX_BACK")}
        className="shrink-0 fx-pane-header-back"
        data-testid={subTestId(dataTestId, "back")}
      />
    ) : null;

    const addButtonJsx = showAddButton && !editMode ? (
      <Button
        design="Secondary"
        size="Medium"
        iconOnly
        icon={<Plus className="h-4 w-4" />}
        onClick={() => onAddClick?.()}
        tooltip={addButtonTooltip || t("FX_ADD")}
        className="shrink-0 fx-pane-header-add"
        data-testid={subTestId(dataTestId, "add")}
      />
    ) : null;

    const closeButtonJsx = handleClose ? (
      <Button
        design="Tertiary"
        size="Medium"
        iconOnly
        icon={<X className="h-4 w-4" />}
        onClick={() => handleClose?.()}
        tooltip={t("FX_CLOSE")}
        className="shrink-0 fx-pane-header-close text-sapphire-text-primary"
        data-testid={subTestId(dataTestId, "close")}
      />
    ) : null;

    const titleArrowJsx = showTitleArrow && !editMode ? (
      <button
        ref={titleArrowRef}
        type="button"
        onClick={() => onTitleArrowClick?.(titleArrowRef.current!)}
        className="shrink-0 p-0.5 hover:bg-muted rounded"
        data-testid={subTestId(dataTestId, "title-arrow")}
      >
        <ChevronDown className="h-4 w-4" />
      </button>
    ) : null;

    // Hamburger/start-toggle/end-toggle JSX — hoisted so both the regular
    // and 3-part centering layout branches render the same buttons with the
    // same testids. Toggle visibility predicates differ slightly between
    // branches (the regular branch hides toggles when isSmallScreenEditMode);
    // the consuming branch decides whether to render at all.
    const hamburgerJsx = showHamburger ? (
      <Button
        design="Tertiary"
        size="Medium"
        iconOnly
        icon={<MenuIcon className="h-4 w-4" />}
        onClick={() => handleHamburger?.()}
        tooltip={t("FX_OPEN_NAVIGATION")}
        className="shrink-0 fx-pane-header-hamburger text-sapphire-text-primary"
        data-testid={subTestId(dataTestId, "hamburger")}
      />
    ) : null;

    // Start-toggle has two icon variants — back-arrow when only one pane fits,
    // list-toggle otherwise. Picking the variant lives in its own const so the
    // outer ternary stays flat.
    const startToggleVariantJsx = toggleStartUsesBackIcon ? (
      <Button
        design="SecondaryNeutral"
        size="Medium"
        iconOnly
        icon={<NavigationLeftArrowIcon />}
        onClick={() => handleToggleStart?.()}
        tooltip={t("FX_BACK_TO_LIST")}
        className="shrink-0 fx-pane-header-toggle-start"
        data-testid={subTestId(dataTestId, "toggle-start")}
      />
    ) : (
      <ToggleButton
        design="SecondaryNeutral"
        size="Medium"
        icon={startPaneVisible ? <CloseCommandFieldIcon className="h-4 w-4" /> : <OpenCommandFieldIcon className="h-4 w-4" />}
        pressed={startPaneVisible}
        onClick={() => handleToggleStart?.()}
        tooltip={startPaneVisible ? t("FX_HIDE_LIST") : t("FX_SHOW_LIST")}
        className="fx-pane-header-toggle-start"
        data-testid={subTestId(dataTestId, "toggle-start")}
      />
    );

    const toggleStartJsx = showStartToggle ? startToggleVariantJsx : null;

    // End-toggle icon changes based on pane visibility state.
    const toggleEndJsx = showEndToggle ? (
      <ToggleButton
        design="SecondaryNeutral"
        size="Medium"
        icon={endPaneVisible ? <CloseCommandFieldRightIcon className="h-4 w-4" /> : <OpenCommandFieldRightIcon className="h-4 w-4" />}
        pressed={endPaneVisible}
        onClick={() => handleToggleEnd?.()}
        tooltip={endPaneVisible ? t("FX_HIDE_CHAT") : t("FX_SHOW_CHAT")}
        className="fx-pane-header-toggle-end"
        data-testid={subTestId(dataTestId, "toggle-end")}
      />
    ) : null;

    // Relations and overflow trigger buttons + their menus — hoisted so both
    // layout branches render the same trigger with the same testid.
    // The actual JSX lives in module-scope helpers (RelationsMenuTrigger /
    // OverflowMenuTrigger) so it doesn't push this function over Sonar's
    // cognitive-complexity threshold.
    const relationsJsx = (
      <RelationsMenuTrigger
        visible={overflowState.relationsVisible && hasRelated}
        open={relationsMenuOpen}
        onTriggerClick={() => {
          setOverflowMenuOpen(false);
          setRelationsMenuOpen(true);
        }}
        onClose={() => setRelationsMenuOpen(false)}
        tooltip={t("FX_RELATED")}
        dataTestId={subTestId(dataTestId, "relations")}
        renderItems={renderRelationMenuItems}
      />
    );

    const overflowJsx = (
      <OverflowMenuTrigger
        visible={showOverflowButton}
        open={overflowMenuOpen}
        onTriggerClick={() => {
          setRelationsMenuOpen(false);
          setOverflowMenuOpen(true);
        }}
        onClose={() => setOverflowMenuOpen(false)}
        tooltip={t("FX_MORE_ACTIONS")}
        dataTestId={subTestId(dataTestId, "overflow")}
        showRelationsSubmenu={!overflowState.relationsVisible && hasRelated}
        showSeparatorBeforeActions={
          !overflowState.relationsVisible && hasRelated && overflowedActions.length > 0
        }
        renderRelationsSubmenu={renderOverflowRelationsSubmenu}
        renderActions={renderOverflowedActions}
        actionsAreFirstInMenu={overflowState.relationsVisible || !hasRelated}
        onOpenerChange={setOverflowOpenerEl}
      />
    );

    const headingJsx = (
      <Heading
        className="text-base font-semibold whitespace-pre-line min-w-0 flex items-center min-h-12"
        data-testid={subTestId(dataTestId, "title")}
      >
        {title}
      </Heading>
    );

    return (
      <header
        ref={headerRef}
        className={cn(
          "fx-pane-header border-b transition-colors duration-200",
          showBorder ? "border-border" : "border-transparent",
          editMode && "fx-pane-header--title-edit-mode",
          className
        )}
        style={{
          containerType: "inline-size",
          marginInline: "-1.5rem",
          paddingInline: "1.5rem",
          paddingBlock: "1.25rem",
          ...style,
        }}
        data-testid={dataTestId}
      >
        {/* Off-screen measurement container */}
        <div
          ref={measureContainerRef}
          aria-hidden="true"
          style={{
            position: "absolute",
            visibility: "hidden",
            pointerEvents: "none",
            width: "max-content",
            top: "-9999px",
            left: "-9999px",
          }}
        >
          {/* Measure each breadcrumb item individually (link + separator) */}
          {breadcrumbItemData.map((item, idx) => (
            <div key={idx} data-measure={`bc-item-${idx}`} className="inline-flex items-center">
              <span className="inline-flex items-center gap-0.5 text-base font-semibold text-foreground px-0.5 py-0.5">
                {item.text}
              </span>
              <span className="mx-1.5 text-base font-semibold select-none">/</span>
            </div>
          ))}

          {/* Measure breadcrumb overflow button WITH separator (used when some items still visible) */}
          <div data-measure="bc-overflow" className="inline-flex items-center">
            <span className="inline-flex items-center gap-0.5 text-base px-0.5 py-0.5">
              <span>…</span>
              <ChevronDown className="h-3 w-3" />
            </span>
            <span className="mx-1.5 text-base font-semibold select-none">/</span>
          </div>

          {/* Measure breadcrumb overflow button WITHOUT separator (used when all items overflowed) */}
          <div data-measure="bc-overflow-only" className="inline-flex items-center">
            <span className="inline-flex items-center gap-0.5 text-base px-0.5 py-0.5">
              <span>…</span>
              <ChevronDown className="h-3 w-3" />
            </span>
          </div>

          {/* Measure the "/" separator between breadcrumbs and title */}
          <div data-measure="bc-separator" className="inline-flex items-center gap-2">
            <span className="text-foreground font-semibold">/</span>
          </div>

          {/* Measure start section (title + arrow) */}
          <div data-measure="start-section" className="inline-flex items-center gap-2">
            <span className="text-base font-semibold whitespace-pre-line">{title}</span>
            {showTitleArrow && <ChevronDown className="h-4 w-4" />}
          </div>

          {/* Measure hamburger */}
          <div data-measure="hamburger" className="inline-block">
            <Button design="Tertiary" size="Medium" iconOnly icon={<MenuIcon className="h-4 w-4" />} />
          </div>

          {/* Measure toggle-start */}
          <div data-measure="toggle-start" className="inline-block">
            <ToggleButton design="SecondaryNeutral" size="Medium" icon={<CloseCommandFieldIcon className="h-4 w-4" />} />
          </div>

          {/* Measure back button */}
          <div data-measure="back-button" className="inline-block">
            <Button design="SecondaryNeutral" size="Medium" iconOnly icon={<NavigationLeftArrowIcon />} />
          </div>

          {/* Measure toggle-end */}
          <div data-measure="toggle-end" className="inline-block">
            <ToggleButton design="SecondaryNeutral" size="Medium" icon={<CloseCommandFieldRightIcon className="h-4 w-4" />} />
          </div>

          {/* Measure overflow */}
          <div data-measure="overflow" className="inline-block">
            <Button design="SecondaryNeutral" size="Medium" iconOnly icon={<MoreIcon className="h-4 w-4" />} />
          </div>

          {/* Measure relations */}
          <div data-measure="relations" className="inline-block">
            <Button design="SecondaryNeutral" size="Medium" iconOnly icon={<JobsIcon className="h-4 w-4" />} />
          </div>

          {/* Measure actions - both icon-only and with-text variants */}
          {actionItems.map((item, index) => (
            <React.Fragment key={index}>
              <div data-measure={`${index}-icon`} className="inline-block">
                {renderAction(item, index, false, true)}
              </div>
              <div data-measure={`${index}-text`} className="inline-block">
                {renderAction(item, index, true, true)}
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Main header row */}
        <div className="flex items-center gap-2 min-h-12">
          {/* ============================================
              NORMAL LAYOUT (no centering)
              Two-part layout: header-start (flex:1) + header-end (flex:0 0 auto)
              ============================================ */}
          {!centeringActive && (
            <>
              {/* Left section: hamburger, start toggle, back, title */}
              <div className="flex items-center min-w-0 flex-1">
                {/* Built-in left buttons group (4px gap) - hidden in small screen edit mode */}
                {!isSmallScreenEditMode && (showHamburger || showStartToggle || showBackButton) && (
                  <div className="flex items-center gap-1 shrink-0">
                    {hamburgerJsx}
                    {toggleStartJsx}
                    {backButtonJsx}
                  </div>
                )}

                {/* Title area - breadcrumbs inline with title */}
                <div className={cn("flex flex-col min-w-0 flex-1", ((showHamburger || showStartToggle || showBackButton) && !isSmallScreenEditMode) && "ml-sapphire-s")}>
                  {/* Title row - breadcrumbs + title + arrow */}
                  <div className="flex items-center gap-2 min-w-0">
                    {/* Breadcrumbs (inline, shrinkable) - hidden in edit mode */}
                    {breadcrumbs && !editMode && (
                      <div className="min-w-0">
                        {renderBreadcrumbs()}
                      </div>
                    )}
                    {/* Separator when breadcrumbs present and title exists */}
                    {breadcrumbs && !editMode && title && (
                      <span className="text-foreground font-semibold text-base select-none shrink-0 -mx-1">/</span>
                    )}

                    {titleEditable ? (
                      <FxRenameTitle
                        ref={renameTitleRef}
                        text={title}
                        editMode={editMode}
                        wrappingType="Normal"
                        onEditAccept={handleTitleEditAccept}
                        onEditCancel={handleTitleEditCancel}
                        onEditModeChange={handleTitleEditModeChange}
                        className="min-w-0"
                        data-testid={subTestId(dataTestId, "title")}
                      />
                    ) : (
                      headingJsx
                    )}

                    {titleArrowJsx}
                  </div>
                </div>
              </div>

              {/* Right section: Actions + End buttons - hidden in small screen edit mode */}
              {!isSmallScreenEditMode && (
                <div className="flex items-center shrink-0 fx-pane-header-end-section">
                  {/* User content group: actions, relations, overflow (4px gap) */}
                  <div className="flex items-center gap-1">
                    {visibleActions.map((item) => {
                      const originalIndex = actionItems.indexOf(item);
                      return renderAction(item, originalIndex, overflowState.textVisibility[originalIndex]);
                    })}

                    {/* Relations button */}
                    {relationsJsx}

                    {/* Overflow menu */}
                    {overflowJsx}
                  </div>

                  {/* Built-in right buttons group: toggle end, add, close (4px gap, 16px from user content) */}
                  {(showEndToggle || showAddButton || handleClose) && (
                    <div className="flex items-center gap-1 ml-sapphire-s">
                      {/* End pane toggle */}
                      {toggleEndJsx}

                      {/* Add button */}
                      {addButtonJsx}

                      {/* Close button */}
                      {closeButtonJsx}
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* ============================================
              3-PART CENTERING LAYOUT
              Three zones: left (flex:1) + center (flex:0 0 auto) + right (flex:1)
              ============================================ */}
          {centeringActive && !isSmallScreenEditMode && (
            <>
              {/* Left zone: title area + actions before centered */}
              <div className="fx-pane-header-left-zone">
                {/* Built-in left buttons group (4px gap) */}
                {(showHamburger || showStartToggle || showBackButton) && (
                  <div className="flex items-center gap-1 shrink-0">
                    {/* Hamburger (compact mode) */}
                    {hamburgerJsx}

                    {/* Start pane toggle */}
                    {toggleStartJsx}

                    {/* Back button (app-controlled) */}
                    {backButtonJsx}
                  </div>
                )}

                {/* Title area - breadcrumbs inline with title */}
                <div className={cn("flex flex-col min-w-0 shrink-0", (showHamburger || showStartToggle || showBackButton) && "ml-sapphire-s")}>
                  {/* Title row - breadcrumbs + title + arrow */}
                  <div className="flex items-center gap-2 min-w-0">
                    {/* Breadcrumbs (inline, shrinkable) - hidden in edit mode */}
                    {breadcrumbs && !editMode && (
                      <div className="min-w-0">
                        {renderBreadcrumbs()}
                      </div>
                    )}
                    {/* Separator when breadcrumbs present and title exists */}
                    {breadcrumbs && !editMode && title && (
                      <span className="text-foreground font-semibold text-base select-none shrink-0 -mx-1">/</span>
                    )}

                    {titleEditable ? (
                      <FxRenameTitle
                        ref={renameTitleRef}
                        text={title}
                        editMode={editMode}
                        wrappingType="Normal"
                        onEditAccept={handleTitleEditAccept}
                        onEditCancel={handleTitleEditCancel}
                        onEditModeChange={handleTitleEditModeChange}
                        className="min-w-0"
                        data-testid={subTestId(dataTestId, "title")}
                      />
                    ) : (
                      headingJsx
                    )}

                    {titleArrowJsx}
                  </div>
                </div>

                {/* Spacer to push actions to the right within left-zone */}
                <div className="flex-1" />

                {/* Actions BEFORE the centered action */}
                {actionsBeforeCentered.map((item) => {
                  const originalIndex = actionItems.indexOf(item);
                  return renderAction(item, originalIndex, overflowState.textVisibility[originalIndex]);
                })}
              </div>

              {/* Center zone: the centered action */}
              <div className="fx-pane-header-center-zone">
                {centeredAction && renderAction(
                  centeredAction,
                  centeredActionIndex,
                  overflowState.textVisibility[centeredActionIndex]
                )}
              </div>

              {/* Right zone: actions after centered + end buttons */}
              <div className="fx-pane-header-right-zone">
                {/* User content group: actions after centered, relations, overflow (4px gap) */}
                <div className="flex items-center gap-1">
                  {/* Actions AFTER the centered action */}
                  {actionsAfterCentered.map((item) => {
                    const originalIndex = actionItems.indexOf(item);
                    return renderAction(item, originalIndex, overflowState.textVisibility[originalIndex]);
                  })}

                  {/* Relations button */}
                  {relationsJsx}

                  {/* Overflow menu */}
                  {overflowJsx}
                </div>

                {/* Built-in right buttons group: toggle end, add, close (4px gap, 16px from user content) */}
                {(showEndToggle || showAddButton || handleClose) && (
                  <div className="flex items-center gap-1 ml-sapphire-s">
                    {/* End pane toggle */}
                    {toggleEndJsx}

                    {/* Add button */}
                    {addButtonJsx}

                    {/* Close button */}
                    {closeButtonJsx}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Subheader - sits below the main header row */}
        {subheader && <div className="w-full mt-2">{subheader}</div>}
      </header>
    );
}
