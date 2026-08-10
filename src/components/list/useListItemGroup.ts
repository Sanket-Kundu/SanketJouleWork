import { createContext, useContext } from "react";

export interface ListItemGroupContextValue {
  isCollapsed: boolean;
  collapsible: boolean;
  toggle: () => void;
  contentId: string;
}

export const ListItemGroupContext = createContext<ListItemGroupContextValue | null>(null);

/**
 * Hook to access the parent ListItemGroup's state and controls.
 * Use this inside custom header components to access collapse state.
 *
 * @example
 * ```tsx
 * function CustomGroupHeader({ title }: { title: string }) {
 *   const group = useListItemGroup();
 *
 *   return (
 *     <div onClick={group?.toggle}>
 *       {group?.collapsible && (group.isCollapsed ? "▶" : "▼")}
 *       {title}
 *     </div>
 *   );
 * }
 * ```
 */
export function useListItemGroup() {
  return useContext(ListItemGroupContext);
}
