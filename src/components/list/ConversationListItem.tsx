import type { Ref } from "react";
import { cn } from "../../lib/utils";
import { ListItemBase } from "./ListItemBase";
import { ListItemRef, ListItemType } from "../../types/list";

// ============================================================================
// TYPES
// ============================================================================

export interface ConversationListItemProps {
  /**
   * Unique key for the list item
   */
  itemKey: string;

  /**
   * Conversation content - can be a string or a custom element (e.g. input for inline editing)
   */
  content: React.ReactNode;

  /**
   * Whether the item is currently selected
   */
  selected?: boolean;

  /**
   * Whether the content should render in bold (e.g. pinned conversations)
   * @default false
   */
  bold?: boolean;

  /**
   * Optional click handler
   */
  onClick?: () => void;

  /**
   * Custom action buttons to display on hover/focus
   */
  actions?: React.ReactNode;

  /**
   * Additional CSS classes
   */
  className?: string;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * ConversationListItem - A specialized list item for displaying conversations
 * with flexible content (text or custom elements) and customizable action buttons.
 *
 * @example
 * ```tsx
 * // Simple text content
 * <ConversationListItem
 *   itemKey="conv-1"
 *   content="Cash Flow Improvement"
 *   selected
 *   actions={
 *     <>
 *       <Button iconOnly icon={<RotateCwIcon />} onClick={...} />
 *       <Button iconOnly icon={<OverflowIcon />} onClick={...} />
 *     </>
 *   }
 * />
 *
 * // Editable content with input
 * <ConversationListItem
 *   itemKey="conv-2"
 *   content={
 *     <input
 *       type="text"
 *       value={title}
 *       onChange={...}
 *       className="w-full bg-transparent outline-none"
 *     />
 *   }
 * />
 * ```
 */
export function ConversationListItem({
      itemKey,
      content,
      selected = false,
      bold = false,
      onClick,
      actions,
      className,
      ref,
    }: ConversationListItemProps & { ref?: Ref<ListItemRef> }) {
    const isStringContent = typeof content === 'string';

    return (
      <ListItemBase
        ref={ref}
        itemKey={itemKey}
        type={ListItemType.Active}
        selected={selected}
        onClick={onClick}
        className={cn(
          "group px-4 py-[7px] h-12 gap-2 rounded-[4px]",
          "!bg-transparent",
          !selected && "hover:!bg-sapphire-background-tertiary",
          selected && [
            "!bg-sapphire-card-bg-primary",
            "hover:!bg-sapphire-background-tertiary",
            "!ring-1 !ring-inset !ring-sapphire-border-active",
            "focus:!ring-2 focus:!ring-sapphire-border-focus",
          ],
          className
        )}
      >
        {({ isFocused, isFocusedWithin }) => (
          <div className="flex items-center gap-2 w-full min-w-0">
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className={cn(
                "text-sm",
                isStringContent && "truncate",
                selected
                  ? "font-semibold text-sapphire-text-accent"
                  : bold
                    ? "font-bold text-sapphire-text-primary"
                    : "font-normal text-sapphire-text-primary"
              )}>
                {content}
              </div>
            </div>

            {/* Action buttons - show on hover, when selected, or when focus is within */}
            {actions && (
              <div className={cn(
                "shrink-0 flex items-center gap-1 transition-opacity",
                (selected || isFocused || isFocusedWithin)
                  ? "visible opacity-100 relative [&>*]:opacity-100 [&>*]:transition-opacity"
                  : cn(
                      // Default: hide entire container (backward compat when no action-fixed children)
                      "invisible opacity-0 absolute",
                      "group-hover:visible group-hover:opacity-100 group-hover:relative",
                      // Override: when container has at least one .action-fixed child, stay in-flow
                      "has-[>.action-fixed]:visible has-[>.action-fixed]:opacity-100 has-[>.action-fixed]:relative",
                      // Per-child opacity (scoped: only when has fixed actions)
                      "has-[>.action-fixed]:[&>.action-fixed]:opacity-100",
                      "has-[>.action-fixed]:[&>*:not(.action-fixed)]:opacity-0",
                      // On hover, reveal non-fixed children
                      "has-[>.action-fixed]:group-hover:[&>*:not(.action-fixed)]:opacity-100",
                      // Smooth transitions on children
                      "[&>*]:transition-opacity",
                    )
              )}>
                {actions}
              </div>
            )}
          </div>
        )}
      </ListItemBase>
    );
  }
