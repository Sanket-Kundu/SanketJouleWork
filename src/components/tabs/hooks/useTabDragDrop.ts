import { useState, useCallback, useRef } from "react";
import { UseTabDragDropOptions, TabMoveDetail, TabMoveOverDetail } from "../../../types/tabs";

/**
 * Hook for managing tab drag and drop reordering with nesting support
 *
 * Uses HTML5 Drag and Drop API to allow users to reorder tabs
 * by dragging them to new positions. Supports nesting by dropping
 * on the center of a tab.
 */
export function useTabDragDrop(options: UseTabDragDropOptions) {
  const {
    enabled = false,
    tabIds,
    onMove,
    onMoveOver,
    maxNestingLevel,
    getTabNestingLevel,
    getTabChildren,
  } = options;

  // State for drag operation
  const [draggedTabId, setDraggedTabId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const [dropPosition, setDropPosition] = useState<"before" | "after" | "on" | null>(null);

  // Ref to track the drag image element
  const dragImageRef = useRef<HTMLElement | null>(null);

  // Check if dropping sourceId onto targetId would create a circular reference
  const wouldCreateCircle = useCallback(
    (sourceId: string, targetId: string): boolean => {
      if (!getTabChildren) return false;

      // Get all descendants of sourceId
      const getDescendants = (id: string): Set<string> => {
        const descendants = new Set<string>();
        const children = getTabChildren(id);
        for (const childId of children) {
          descendants.add(childId);
          const childDescendants = getDescendants(childId);
          childDescendants.forEach(d => descendants.add(d));
        }
        return descendants;
      };

      const descendants = getDescendants(sourceId);
      return descendants.has(targetId);
    },
    [getTabChildren]
  );

  // Check if nesting is allowed at target
  const canNestAt = useCallback(
    (targetId: string): boolean => {
      if (maxNestingLevel === undefined) return true;
      if (maxNestingLevel === 0) return false;

      if (getTabNestingLevel) {
        const targetLevel = getTabNestingLevel(targetId);
        return targetLevel < maxNestingLevel;
      }

      return true;
    },
    [maxNestingLevel, getTabNestingLevel]
  );

  // Handle drag start
  const handleDragStart = useCallback(
    (e: React.DragEvent, tabId: string) => {
      if (!enabled) return;

      // Set the dragged tab ID
      setDraggedTabId(tabId);

      // Set data transfer
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", tabId);
      e.dataTransfer.setData("application/x-tab-id", tabId);

      // Add dragging class to the element
      const target = e.currentTarget as HTMLElement;
      target.classList.add("dragging");
    },
    [enabled]
  );

  // Handle drag end
  const handleDragEnd = useCallback(
    (e: React.DragEvent) => {
      if (!enabled) return;

      // Remove dragging class
      const target = e.currentTarget as HTMLElement;
      target.classList.remove("dragging");

      // Clear drag state
      setDraggedTabId(null);
      setDropTargetId(null);
      setDropPosition(null);

      // Clean up drag image if created
      if (dragImageRef.current) {
        dragImageRef.current.remove();
        dragImageRef.current = null;
      }
    },
    [enabled]
  );

  // Handle drag over (determines drop position)
  const handleDragOver = useCallback(
    (e: React.DragEvent, tabId: string) => {
      if (!enabled || !draggedTabId || draggedTabId === tabId) return;

      // Prevent circular drops
      if (wouldCreateCircle(draggedTabId, tabId)) {
        e.dataTransfer.dropEffect = "none";
        return;
      }

      e.preventDefault();
      e.dataTransfer.dropEffect = "move";

      // Calculate drop position based on mouse position
      // Left third = before, right third = after, middle third = on (nest)
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      const thirdWidth = rect.width / 3;

      let position: "before" | "after" | "on";
      if (relativeX < thirdWidth) {
        position = "before";
      } else if (relativeX > thirdWidth * 2) {
        position = "after";
      } else {
        // Center = nest, but only if allowed
        position = canNestAt(tabId) ? "on" : (relativeX < rect.width / 2 ? "before" : "after");
      }

      // Fire onMoveOver callback if provided, allowing consumers to cancel
      if (onMoveOver) {
        let prevented = false;
        const detail: TabMoveOverDetail = {
          sourceTabId: draggedTabId,
          destinationTabId: tabId,
          placement: position,
          preventDefault: () => { prevented = true; },
          get defaultPrevented() { return prevented; },
        };
        onMoveOver(detail);

        if (prevented) {
          e.dataTransfer.dropEffect = "none";
          setDropTargetId(null);
          setDropPosition(null);
          return;
        }
      }

      setDropTargetId(tabId);
      setDropPosition(position);
    },
    [enabled, draggedTabId, wouldCreateCircle, canNestAt, onMoveOver]
  );

  // Handle drag enter
  const handleDragEnter = useCallback(
    (e: React.DragEvent, tabId: string) => {
      if (!enabled || !draggedTabId || draggedTabId === tabId) return;

      // Prevent circular drops
      if (wouldCreateCircle(draggedTabId, tabId)) {
        return;
      }

      e.preventDefault();
      setDropTargetId(tabId);
    },
    [enabled, draggedTabId, wouldCreateCircle]
  );

  // Handle drag leave
  const handleDragLeave = useCallback(
    (e: React.DragEvent, tabId: string) => {
      if (!enabled) return;

      // Only clear if leaving the actual target (not a child)
      const relatedTarget = e.relatedTarget as Node | null;
      const currentTarget = e.currentTarget as Node;

      if (!relatedTarget || !currentTarget.contains(relatedTarget)) {
        if (dropTargetId === tabId) {
          setDropTargetId(null);
          setDropPosition(null);
        }
      }
    },
    [enabled, dropTargetId]
  );

  // Handle drop
  const handleDrop = useCallback(
    (e: React.DragEvent, tabId: string) => {
      if (!enabled || !draggedTabId || draggedTabId === tabId) return;

      // Prevent circular drops
      if (wouldCreateCircle(draggedTabId, tabId)) {
        return;
      }

      e.preventDefault();

      // Calculate final drop position
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      const thirdWidth = rect.width / 3;

      let placement: "before" | "after" | "on";
      if (relativeX < thirdWidth) {
        placement = "before";
      } else if (relativeX > thirdWidth * 2) {
        placement = "after";
      } else {
        placement = canNestAt(tabId) ? "on" : (relativeX < rect.width / 2 ? "before" : "after");
      }

      // Get indices
      const sourceIndex = tabIds.indexOf(draggedTabId);
      const destinationIndex = tabIds.indexOf(tabId);

      // Destination must be valid, but source can be -1 (nested tab being dragged out)
      if (destinationIndex === -1) return;

      // Create move detail
      const detail: TabMoveDetail = {
        sourceTabId: draggedTabId,
        sourceIndex,
        destinationTabId: tabId,
        destinationIndex,
        placement,
      };

      // Fire callback
      onMove?.(detail);

      // Clear drag state
      setDraggedTabId(null);
      setDropTargetId(null);
      setDropPosition(null);
    },
    [enabled, draggedTabId, tabIds, onMove, wouldCreateCircle, canNestAt]
  );

  // Get drag props for a tab element
  const getDragProps = useCallback(
    (tabId: string, isMovable: boolean = true) => {
      if (!enabled || !isMovable) {
        return {};
      }

      return {
        draggable: true,
        onDragStart: (e: React.DragEvent) => handleDragStart(e, tabId),
        onDragEnd: handleDragEnd,
        onDragOver: (e: React.DragEvent) => handleDragOver(e, tabId),
        onDragEnter: (e: React.DragEvent) => handleDragEnter(e, tabId),
        onDragLeave: (e: React.DragEvent) => handleDragLeave(e, tabId),
        onDrop: (e: React.DragEvent) => handleDrop(e, tabId),
      };
    },
    [
      enabled,
      handleDragStart,
      handleDragEnd,
      handleDragOver,
      handleDragEnter,
      handleDragLeave,
      handleDrop,
    ]
  );

  // Get drop indicator position for a tab
  const getDropIndicator = useCallback(
    (tabId: string): "before" | "after" | "on" | null => {
      if (!enabled || !draggedTabId || dropTargetId !== tabId) {
        return null;
      }
      return dropPosition;
    },
    [enabled, draggedTabId, dropTargetId, dropPosition]
  );

  // Check if a tab is being dragged
  const isDragging = useCallback(
    (tabId: string) => draggedTabId === tabId,
    [draggedTabId]
  );

  // Check if dragging is active at all
  const isAnyDragging = draggedTabId !== null;

  return {
    // State
    draggedTabId,
    dropTargetId,
    dropPosition,
    isAnyDragging,

    // Methods
    getDragProps,
    getDropIndicator,
    isDragging,

    // Raw handlers (for custom implementations)
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
  };
}
