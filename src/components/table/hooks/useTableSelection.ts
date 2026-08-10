import { useState, useCallback, useRef } from "react";

type RangeOperationType = "select" | "deselect";

interface RangeSessionState {
  type: RangeOperationType;
  anchorKey: string;
  baseKeys: Set<string>;
}

interface ClearRangeSessionOptions {
  clearAnchor?: boolean;
}

export interface UseTableSelectionOptions {
  mode: "None" | "Single" | "Multi";
  selected?: string;
  defaultSelected?: string;
  allRowKeys: string[];
  onChange?: (detail: { selectedKeys: Set<string>; previousSelectedKeys: Set<string> }) => void;
}

export interface UseTableSelectionReturn {
  selectedKeys: Set<string>;
  isSelected: (rowKey: string) => boolean;
  toggleSelection: (rowKey: string) => void;
  setSelected: (rowKey: string, selected: boolean) => void;
  setSelectedAsSet: (keys: Set<string>) => void;
  selectAll: () => void;
  deselectAll: () => void;
  areAllSelected: () => boolean;
  selectRange: (anchorKey: string, endKey: string) => void;
  deselectRange: (startKey: string, endKey: string) => void;
  applyKeyboardRange: (currentKey: string, endKey: string) => void;
  getLastSelectedKey: () => string | null;
  clearRangeSession: (options?: ClearRangeSessionOptions) => void;
}

function parseSelected(value: string | undefined): Set<string> {
  if (!value) return new Set();
  return new Set(value.split(" ").filter(Boolean));
}

export function useTableSelection(options: UseTableSelectionOptions): UseTableSelectionReturn {
  const { mode, selected: controlledSelected, defaultSelected, allRowKeys, onChange } = options;
  const isControlled = controlledSelected !== undefined;

  const [internalSelected, setInternalSelected] = useState<Set<string>>(
    () => parseSelected(defaultSelected),
  );
  const lastSelectedRef = useRef<string | null>(null);
  const rangeSessionRef = useRef<RangeSessionState | null>(null);

  const selectedKeys = isControlled ? parseSelected(controlledSelected) : internalSelected;

  const fireChange = useCallback(
    (newKeys: Set<string>, prevKeys: Set<string>) => {
      onChange?.({ selectedKeys: newKeys, previousSelectedKeys: prevKeys });
    },
    [onChange],
  );

  const updateSelection = useCallback(
    (newKeys: Set<string>) => {
      const prev = new Set(selectedKeys);
      if (!isControlled) {
        setInternalSelected(newKeys);
      }
      fireChange(newKeys, prev);
    },
    [selectedKeys, isControlled, fireChange],
  );

  const isSelected = useCallback(
    (rowKey: string) => selectedKeys.has(rowKey),
    [selectedKeys],
  );

  const toggleSelection = useCallback(
    (rowKey: string) => {
      if (mode === "None") return;
      const newKeys = new Set(selectedKeys);

      if (mode === "Single") {
        if (newKeys.has(rowKey)) {
          newKeys.clear();
        } else {
          newKeys.clear();
          newKeys.add(rowKey);
        }
      } else {
        if (newKeys.has(rowKey)) {
          newKeys.delete(rowKey);
        } else {
          newKeys.add(rowKey);
        }
      }

      // Direct toggle clears range session and sets anchor
      rangeSessionRef.current = null;
      lastSelectedRef.current = rowKey;
      updateSelection(newKeys);
    },
    [mode, selectedKeys, updateSelection],
  );

  const setSelected = useCallback(
    (rowKey: string, value: boolean) => {
      if (mode === "None") return;
      const newKeys = new Set(selectedKeys);

      if (mode === "Single") {
        newKeys.clear();
        if (value) newKeys.add(rowKey);
      } else {
        if (value) {
          newKeys.add(rowKey);
        } else {
          newKeys.delete(rowKey);
        }
      }

      // Direct toggle clears range session
      rangeSessionRef.current = null;
      if (value) {
        lastSelectedRef.current = rowKey;
      }
      updateSelection(newKeys);
    },
    [mode, selectedKeys, updateSelection],
  );

  const selectAll = useCallback(() => {
    if (mode !== "Multi") return;
    rangeSessionRef.current = null;
    const newKeys = new Set(allRowKeys);
    updateSelection(newKeys);
  }, [mode, allRowKeys, updateSelection]);

  const deselectAll = useCallback(() => {
    rangeSessionRef.current = null;
    updateSelection(new Set());
  }, [updateSelection]);

  const areAllSelected = useCallback(
    () => allRowKeys.length > 0 && allRowKeys.every((key) => selectedKeys.has(key)),
    [allRowKeys, selectedKeys],
  );

  const selectRange = useCallback(
    (anchorKey: string, endKey: string) => {
      if (mode !== "Multi") return;
      const anchorIdx = allRowKeys.indexOf(anchorKey);
      const endIdx = allRowKeys.indexOf(endKey);
      if (anchorIdx === -1 || endIdx === -1) return;

      const start = Math.min(anchorIdx, endIdx);
      const end = Math.max(anchorIdx, endIdx);

      // Use base keys from active session to preserve disjoint selections
      const activeSession = rangeSessionRef.current;
      const keepSessionBase =
        activeSession?.type === "select"
        && activeSession.anchorKey === anchorKey;
      const baseKeys = keepSessionBase
        ? activeSession.baseKeys
        : selectedKeys;

      const newKeys = new Set(baseKeys);
      for (let i = start; i <= end; i++) {
        newKeys.add(allRowKeys[i]);
      }

      updateSelection(newKeys);

      // Keep anchor stable while range end changes
      lastSelectedRef.current = anchorKey;
      rangeSessionRef.current = {
        type: "select",
        anchorKey,
        baseKeys,
      };
    },
    [mode, allRowKeys, selectedKeys, updateSelection],
  );

  const deselectRange = useCallback(
    (startKey: string, endKey: string) => {
      if (mode !== "Multi") return;
      const startIdx = allRowKeys.indexOf(startKey);
      const endIdx = allRowKeys.indexOf(endKey);
      if (startIdx === -1 || endIdx === -1) return;

      const minIdx = Math.min(startIdx, endIdx);
      const maxIdx = Math.max(startIdx, endIdx);

      // Use base keys from active session to preserve disjoint selections
      const activeSession = rangeSessionRef.current;
      const keepSessionBase =
        activeSession?.type === "deselect"
        && activeSession.anchorKey === startKey;
      const baseKeys = keepSessionBase
        ? activeSession.baseKeys
        : selectedKeys;

      const rangeKeys = new Set(allRowKeys.slice(minIdx, maxIdx + 1));
      const newKeys = new Set([...baseKeys].filter((key) => !rangeKeys.has(key)));

      updateSelection(newKeys);

      // Keep anchor stable while range end changes
      lastSelectedRef.current = startKey;
      rangeSessionRef.current = {
        type: "deselect",
        anchorKey: startKey,
        baseKeys,
      };
    },
    [mode, allRowKeys, selectedKeys, updateSelection],
  );

  const applyKeyboardRange = useCallback(
    (currentKey: string, endKey: string) => {
      if (mode !== "Multi") return;

      const shouldSelect = isSelected(currentKey);
      const anchorKey = shouldSelect
        ? (lastSelectedRef.current ?? currentKey)
        : currentKey;

      if (!anchorKey) return;

      if (shouldSelect) {
        selectRange(anchorKey, endKey);
      } else {
        deselectRange(anchorKey, endKey);
      }
    },
    [deselectRange, isSelected, mode, selectRange],
  );

  const getLastSelectedKey = useCallback(
    () => lastSelectedRef.current,
    [],
  );

  const clearRangeSession = useCallback((options?: ClearRangeSessionOptions) => {
    rangeSessionRef.current = null;
    if (options?.clearAnchor) {
      lastSelectedRef.current = null;
    }
  }, []);

  const setSelectedAsSet = useCallback(
    (newKeys: Set<string>) => {
      rangeSessionRef.current = null;
      updateSelection(newKeys);
    },
    [updateSelection],
  );

  return {
    selectedKeys,
    isSelected,
    toggleSelection,
    setSelected,
    setSelectedAsSet,
    selectAll,
    deselectAll,
    areAllSelected,
    selectRange,
    deselectRange,
    applyKeyboardRange,
    getLastSelectedKey,
    clearRangeSession,
  };
}
