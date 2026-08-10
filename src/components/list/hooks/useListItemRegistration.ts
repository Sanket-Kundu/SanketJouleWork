import { useRef, useEffect } from "react";
import { useOptionalListContext } from "../List";

export interface UseListItemRegistrationOptions {
  itemRef: React.RefObject<HTMLLIElement>;
  itemKey?: string;
}

export interface UseListItemRegistrationResult {
  // Empty - registration is a side effect only
}

/**
 * Hook for registering list items with the parent List context
 */
export function useListItemRegistration(options: UseListItemRegistrationOptions): UseListItemRegistrationResult {
  const { itemRef, itemKey } = options;
  const listContext = useOptionalListContext();
  const itemIndexRef = useRef(-1);

  // Register with list context
  useEffect(() => {
    if (listContext && itemKey) {
      // Find root list element
      let rootList = itemRef.current?.parentElement;
      while (rootList && rootList.getAttribute('role') !== 'list' && rootList.getAttribute('role') !== 'listbox') {
        rootList = rootList.parentElement;
      }

      if (rootList) {
        const allNavigable = Array.from(
          rootList.querySelectorAll<HTMLElement>(
            'div[data-group-header="true"], li[role="listitem"]'
          )
        );
        const index = allNavigable.indexOf(itemRef.current!);
        if (index >= 0) {
          itemIndexRef.current = index;
          listContext.registerItem(itemKey, index);
          listContext.registerNavigationItem(index, itemRef.current);
        }
      }
    }
    return () => {
      if (listContext && itemKey && itemIndexRef.current >= 0) {
        listContext.unregisterItem(itemKey);
        listContext.registerNavigationItem(itemIndexRef.current, null);
        itemIndexRef.current = -1;
      }
    };
  }, [listContext, itemKey, itemRef]);

  return {};
}
