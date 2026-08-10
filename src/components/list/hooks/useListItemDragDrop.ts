import { useCallback } from "react";
import { useOptionalListContext } from "../List";

export interface UseListItemDragDropOptions {
  id: string;
  movable?: boolean;
  disabled?: boolean;
  onDragStart?: () => void;
}

export interface UseListItemDragDropResult {
  isDragging: boolean;
  isDropTarget: boolean;
  dropPlacement: "Before" | "After" | "On" | null;
  handleDragStart: (e: React.DragEvent) => void;
  handleDragEnd: (e: React.DragEvent) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragEnter: (e: React.DragEvent) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
}

/**
 * Hook for managing list item drag and drop behavior
 */
export function useListItemDragDrop(options: UseListItemDragDropOptions): UseListItemDragDropResult {
  const { id, movable, disabled, onDragStart: onDragStartProp } = options;
  const listContext = useOptionalListContext();

  // Drag state from context
  const isDragging = listContext?.draggedKey === id;
  const isDropTarget = listContext?.dropTargetKey === id;
  const dropPlacement = isDropTarget ? listContext?.dropPlacement : null;

  // Drag and drop handlers
  const handleDragStart = useCallback((e: React.DragEvent) => {
    if (!movable || disabled) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.dropEffect = "move";
    e.dataTransfer.setData("text/plain", id);
    listContext?.onDragStart?.(id, e);
    onDragStartProp?.();
  }, [movable, disabled, id, listContext, onDragStartProp]);

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    listContext?.onDragEnd?.(id, e);
  }, [id, listContext]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    listContext?.onDragOver?.(id, e);
  }, [id, listContext]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    listContext?.onDrop?.(id, e);
  }, [id, listContext]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDragLeave = useCallback((_e: React.DragEvent) => {
    // Handled by parent list
  }, []);

  return {
    isDragging,
    isDropTarget,
    dropPlacement: dropPlacement || null,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
  };
}
