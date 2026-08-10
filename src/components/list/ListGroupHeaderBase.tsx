import * as React from "react";
import { type Ref } from "react";
import { cn } from "../../lib/utils";
import { useListGroupHeader } from "./useListGroupHeader";
import { LIST_ITEM_BASE_CLASSES, LIST_ITEM_FOCUS_CLASSES } from "./shared-styles";

export interface ListGroupHeaderBaseProps {
  // Behavior
  collapsible?: boolean;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onToggle?: (collapsed: boolean) => void;

  // Accessibility
  accessibleName?: string;

  // Rendering
  children?: React.ReactNode | ((state: ListGroupHeaderBaseRenderState) => React.ReactNode);

  // Standard
  className?: string;
  style?: React.CSSProperties;
  "data-testid"?: string;
}

export interface ListGroupHeaderBaseRenderState {
  isCollapsed: boolean;
  isFocused: boolean;
  collapsible: boolean;
}

/**
 * Base group header component that provides collapsible behavior and navigation integration
 * without any opinionated rendering.
 *
 * Use this to build custom group headers that integrate with List's keyboard navigation.
 *
 * @example
 * ```tsx
 * <ListGroupHeaderBase collapsible defaultCollapsed={false}>
 *   {({ isCollapsed, isFocused, collapsible }) => (
 *     <div className={cn("p-2", isFocused && "ring-2")}>
 *       {collapsible && (isCollapsed ? "▶" : "▼")}
 *       My Group Header
 *     </div>
 *   )}
 * </ListGroupHeaderBase>
 * ```
 */
export function ListGroupHeaderBase(props: ListGroupHeaderBaseProps & { ref?: Ref<HTMLDivElement> }) {
    const {
      ref,
      collapsible = false,
      collapsed,
      defaultCollapsed = false,
      onToggle,
      accessibleName,
      children,
      className,
      style,
      "data-testid": dataTestId,
    } = props;

    const groupHeader = useListGroupHeader({
      collapsible,
      collapsed,
      defaultCollapsed,
      onToggle,
    });

    // Prepare render state for children function
    const renderState: ListGroupHeaderBaseRenderState = {
      isCollapsed: groupHeader.isCollapsed,
      isFocused: groupHeader.isFocused,
      collapsible,
    };

    return (
      <div
        ref={(node) => {
          (groupHeader.headerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
          }
        }}
        id={groupHeader.headerId}
        role={collapsible ? "button" : "heading"}
        aria-level={!collapsible ? 3 : undefined}
        aria-expanded={collapsible ? !groupHeader.isCollapsed : undefined}
        aria-controls={collapsible ? groupHeader.contentId : undefined}
        aria-label={accessibleName}
        tabIndex={groupHeader.tabIndex}
        onClick={collapsible ? groupHeader.handleToggle : undefined}
        onKeyDown={groupHeader.handleKeyDown}
        onFocus={groupHeader.handleFocus}
        onBlur={groupHeader.handleBlur}
        data-group-header="true"
        className={cn(
          LIST_ITEM_BASE_CLASSES,
          groupHeader.isFocused && LIST_ITEM_FOCUS_CLASSES,
          className
        )}
        style={style}
        data-testid={dataTestId}
      >
        {typeof children === "function" ? children(renderState) : children}
      </div>
    );
  }
