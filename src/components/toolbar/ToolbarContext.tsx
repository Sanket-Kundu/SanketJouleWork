import { createContext, useContext } from "react";

export interface ToolbarContextValue {
  /** Whether the item is currently rendered inside the overflow popover */
  isInOverflow: boolean;
  /** Close the overflow popover */
  closeOverflow: () => void;
}

const noop = () => {};

export const ToolbarContext = createContext<ToolbarContextValue>({
  isInOverflow: false,
  closeOverflow: noop,
});

export const useToolbarContext = () => useContext(ToolbarContext);
