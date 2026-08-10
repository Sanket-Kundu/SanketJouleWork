// Tab components
export { TabContainer } from "./TabContainer";
export { Tab, TabContainerContext, useTabContainerContext } from "./Tab";
export { TabSeparator } from "./TabSeparator";
export { TabOverflowButton } from "./TabOverflowButton";

// Hooks
export { useTabNavigation } from "./hooks/useTabNavigation";
export { useTabDragDrop } from "./hooks/useTabDragDrop";
export { useTabOverflow } from "./hooks/useTabOverflow";

// Re-export types
export type {
  TabContainerProps,
  TabProps,
  TabSeparatorProps,
  TabContainerRef,
  TabContainerContextValue,
  TabSelectionChangeDetail,
  TabMoveDetail,
  TabMoveOverDetail,
  UseTabNavigationOptions,
  UseTabOverflowOptions,
  UseTabDragDropOptions,
} from "../../types/tabs";

export {
  TabLayout,
  TabOverflowMode,
  TabContainerBackgroundDesign,
  TabSemanticDesign,
  TabsPlacement,
} from "../../types/tabs";
