import * as React from "react";
import { ReactNode, type Ref } from "react";
import { cn } from "../../lib/utils";
import { ListItemGroup } from "./ListItemGroup";
import { ListItemWrappingType } from "../../types/list";
import { Button } from "../button/Button";
import { ButtonDesign } from "../../types/button";
import { SlimArrowDownIcon } from "../../icons/SlimArrowDown";
import { SlimArrowRightIcon } from "../../icons/SlimArrowRight";

// ============================================================================
// TYPES
// ============================================================================

export interface ConversationGroupListItemProps {
  /**
   * Group header text
   */
  headerText: string;

  /**
   * Whether the group is collapsible
   * @default true
   */
  collapsible?: boolean;

  /**
   * Whether the group is initially collapsed
   * @default false
   */
  defaultCollapsed?: boolean;

  /**
   * Controlled collapse state
   */
  collapsed?: boolean;

  /**
   * Callback when group is toggled
   */
  onToggle?: (collapsed: boolean) => void;

  /**
   * Whether to show sticky header
   * @default false
   */
  stickyHeader?: boolean;

  /**
   * Optional "See All" action at the bottom of the group
   */
  onSeeAll?: () => void;

  /**
   * Group content (conversation list items)
   */
  children?: ReactNode;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Optional data-testid
   */
  "data-testid"?: string;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * ConversationGroupListItem - A specialized group wrapper for conversation lists
 * with collapsible header and optional "See All" footer.
 *
 * @example
 * ```tsx
 * <ConversationGroupListItem
 *   headerText="Active Conversations"
 *   collapsible
 *   onSeeAll={() => console.log('see all')}
 * >
 *   <ConversationListItem itemKey="1" title="Cash Flow Improvement" />
 *   <ConversationListItem itemKey="2" title="DSO Analysis: Q4 2025" />
 * </ConversationGroupListItem>
 * ```
 */
export function ConversationGroupListItem({
      headerText,
      collapsible = true,
      defaultCollapsed = false,
      collapsed,
      onToggle,
      stickyHeader = false,
      onSeeAll,
      children,
      className,
      "data-testid": dataTestId,
      ref,
    }: ConversationGroupListItemProps & { ref?: Ref<HTMLLIElement> }) {
    // Determine if collapsed (for custom header)
    const [internalCollapsed, setInternalCollapsed] = React.useState(defaultCollapsed);
    const isControlled = collapsed !== undefined;
    const isCollapsed = isControlled ? collapsed : internalCollapsed;

    // Wrap children with "See All" button if provided
    const content = onSeeAll ? (
      <>
        {children}
        <li className="list-none px-4 py-2">
          <Button
            design={ButtonDesign.Tertiary}
            onClick={onSeeAll}
            className="text-sm font-semibold text-sapphire-text hover:text-sapphire-brand-foreground"
          >
            See All
          </Button>
        </li>
      </>
    ) : children;

    // Custom header with right-aligned icon
    const customHeader = collapsible ? (
      <div className="flex items-center justify-between w-full gap-2">
        <span className="flex-1 truncate font-normal text-sm text-sapphire-text-tertiary">
          {headerText}
        </span>
        <span
          className="shrink-0 flex items-center justify-center w-8 h-8 text-sapphire-text-tertiary"
          aria-hidden="true"
        >
          {isCollapsed ? (
            <SlimArrowRightIcon className="h-4 w-4 pointer-events-none" />
          ) : (
            <SlimArrowDownIcon className="h-4 w-4 pointer-events-none" />
          )}
        </span>
      </div>
    ) : (
      <span className="font-normal text-sm text-sapphire-text-tertiary">
        {headerText}
      </span>
    );

    return (
      <ListItemGroup
        ref={ref}
        header={customHeader}
        collapsible={collapsible}
        defaultCollapsed={defaultCollapsed}
        collapsed={collapsed}
        onToggle={(newCollapsed) => {
          if (!isControlled) {
            setInternalCollapsed(newCollapsed);
          }
          onToggle?.(newCollapsed);
        }}
        stickyHeader={stickyHeader}
        wrappingType={ListItemWrappingType.None}
        className={cn(
          "[&>[data-group-header]]:!bg-transparent",
          "[&>[data-group-header]]:pl-4",
          "[&>[data-group-header]]:pr-0",
          "[&>[data-group-header]]:py-1.5",
          "[&>ul>li]:border-b-0",
          className
        )}
        data-testid={dataTestId}
      >
        {content}
      </ListItemGroup>
    );
  }
