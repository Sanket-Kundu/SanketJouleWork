import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTabDragDrop } from "./useTabDragDrop";

// Helper to create a mock DragEvent
function createDragEvent(overrides: Record<string, unknown> = {}): React.DragEvent {
  return {
    preventDefault: vi.fn(),
    stopPropagation: vi.fn(),
    dataTransfer: {
      effectAllowed: "",
      dropEffect: "",
      setData: vi.fn(),
      getData: vi.fn(),
    },
    currentTarget: {
      classList: { add: vi.fn(), remove: vi.fn() },
      getBoundingClientRect: () => ({
        left: 0, right: 300, top: 0, bottom: 40, width: 300, height: 40, x: 0, y: 0,
      }),
    },
    clientX: 150, // middle third by default
    ...overrides,
  } as unknown as React.DragEvent;
}

describe("useTabDragDrop", () => {
  const tabIds = ["tab1", "tab2", "tab3"];

  describe("disabled state", () => {
    it("returns empty drag props when disabled - BLI: EL-339", () => {
      const { result } = renderHook(() =>
        useTabDragDrop({ enabled: false, tabIds })
      );
      expect(result.current.getDragProps("tab1")).toEqual({});
    });

    it("returns empty drag props for non-movable tab - BLI: EL-339", () => {
      const { result } = renderHook(() =>
        useTabDragDrop({ enabled: true, tabIds })
      );
      expect(result.current.getDragProps("tab1", false)).toEqual({});
    });

    it("isAnyDragging is false initially - BLI: EL-339", () => {
      const { result } = renderHook(() =>
        useTabDragDrop({ enabled: true, tabIds })
      );
      expect(result.current.isAnyDragging).toBe(false);
      expect(result.current.draggedTabId).toBeNull();
    });
  });

  describe("drag start", () => {
    it("sets draggedTabId on drag start - BLI: EL-339", () => {
      const { result } = renderHook(() =>
        useTabDragDrop({ enabled: true, tabIds })
      );
      const event = createDragEvent();
      act(() => result.current.handleDragStart(event, "tab1"));
      expect(result.current.draggedTabId).toBe("tab1");
      expect(result.current.isAnyDragging).toBe(true);
    });

    it("sets dataTransfer effectAllowed to move - BLI: EL-339", () => {
      const { result } = renderHook(() =>
        useTabDragDrop({ enabled: true, tabIds })
      );
      const event = createDragEvent();
      act(() => result.current.handleDragStart(event, "tab1"));
      expect(event.dataTransfer.effectAllowed).toBe("move");
    });
  });

  describe("drag end", () => {
    it("clears drag state - BLI: EL-339", () => {
      const { result } = renderHook(() =>
        useTabDragDrop({ enabled: true, tabIds })
      );
      act(() => result.current.handleDragStart(createDragEvent(), "tab1"));
      expect(result.current.draggedTabId).toBe("tab1");

      act(() => result.current.handleDragEnd(createDragEvent()));
      expect(result.current.draggedTabId).toBeNull();
      expect(result.current.isAnyDragging).toBe(false);
    });
  });

  describe("drag over", () => {
    it("computes position=before for left third - BLI: EL-339", () => {
      const { result } = renderHook(() =>
        useTabDragDrop({ enabled: true, tabIds })
      );
      act(() => result.current.handleDragStart(createDragEvent(), "tab1"));

      // clientX=50 → left third of 300px
      const overEvent = createDragEvent({ clientX: 50 });
      act(() => result.current.handleDragOver(overEvent, "tab2"));

      expect(result.current.getDropIndicator("tab2")).toBe("before");
    });

    it("computes position=after for right third - BLI: EL-339", () => {
      const { result } = renderHook(() =>
        useTabDragDrop({ enabled: true, tabIds })
      );
      act(() => result.current.handleDragStart(createDragEvent(), "tab1"));

      // clientX=250 → right third of 300px
      const overEvent = createDragEvent({ clientX: 250 });
      act(() => result.current.handleDragOver(overEvent, "tab2"));

      expect(result.current.getDropIndicator("tab2")).toBe("after");
    });

    it("computes position=on for middle third - BLI: EL-339", () => {
      const { result } = renderHook(() =>
        useTabDragDrop({ enabled: true, tabIds })
      );
      act(() => result.current.handleDragStart(createDragEvent(), "tab1"));

      // clientX=150 → middle third of 300px
      const overEvent = createDragEvent({ clientX: 150 });
      act(() => result.current.handleDragOver(overEvent, "tab2"));

      expect(result.current.getDropIndicator("tab2")).toBe("on");
    });

    it("ignores drag over on self - BLI: EL-339", () => {
      const { result } = renderHook(() =>
        useTabDragDrop({ enabled: true, tabIds })
      );
      act(() => result.current.handleDragStart(createDragEvent(), "tab1"));

      const overEvent = createDragEvent();
      act(() => result.current.handleDragOver(overEvent, "tab1"));

      expect(result.current.getDropIndicator("tab1")).toBeNull();
    });
  });

  describe("drop", () => {
    it("fires onMove callback with correct detail - BLI: EL-339", () => {
      const onMove = vi.fn();
      const { result } = renderHook(() =>
        useTabDragDrop({ enabled: true, tabIds, onMove })
      );
      act(() => result.current.handleDragStart(createDragEvent(), "tab1"));

      const dropEvent = createDragEvent({ clientX: 250 }); // right third → after
      act(() => result.current.handleDrop(dropEvent, "tab2"));

      expect(onMove).toHaveBeenCalledWith({
        sourceTabId: "tab1",
        sourceIndex: 0,
        destinationTabId: "tab2",
        destinationIndex: 1,
        placement: "after",
      });
    });

    it("clears drag state after drop - BLI: EL-339", () => {
      const { result } = renderHook(() =>
        useTabDragDrop({ enabled: true, tabIds, onMove: vi.fn() })
      );
      act(() => result.current.handleDragStart(createDragEvent(), "tab1"));
      act(() => result.current.handleDrop(createDragEvent({ clientX: 50 }), "tab2"));
      expect(result.current.draggedTabId).toBeNull();
    });
  });

  describe("circular reference detection", () => {
    it("prevents dropping parent onto its child - BLI: EL-339", () => {
      const getTabChildren = vi.fn((id: string) =>
        id === "tab1" ? ["tab2"] : []
      );
      const onMove = vi.fn();
      const { result } = renderHook(() =>
        useTabDragDrop({ enabled: true, tabIds, onMove, getTabChildren })
      );

      act(() => result.current.handleDragStart(createDragEvent(), "tab1"));
      act(() => result.current.handleDrop(createDragEvent(), "tab2"));

      expect(onMove).not.toHaveBeenCalled();
    });
  });

  describe("maxNestingLevel enforcement", () => {
    it("maxNestingLevel=0 prevents nesting (center becomes before/after) - BLI: EL-339", () => {
      const { result } = renderHook(() =>
        useTabDragDrop({
          enabled: true,
          tabIds,
          maxNestingLevel: 0,
          getTabNestingLevel: () => 0,
        })
      );

      act(() => result.current.handleDragStart(createDragEvent(), "tab1"));

      // clientX=150 → middle third, but nesting blocked
      const overEvent = createDragEvent({ clientX: 150 });
      act(() => result.current.handleDragOver(overEvent, "tab2"));

      // Should fallback to "before" or "after" instead of "on"
      expect(result.current.getDropIndicator("tab2")).not.toBe("on");
    });
  });

  describe("onMoveOver with preventDefault", () => {
    it("cancels drop when onMoveOver prevents default - BLI: EL-339", () => {
      const onMoveOver = vi.fn((detail) => detail.preventDefault());
      const { result } = renderHook(() =>
        useTabDragDrop({ enabled: true, tabIds, onMoveOver })
      );

      act(() => result.current.handleDragStart(createDragEvent(), "tab1"));
      const overEvent = createDragEvent({ clientX: 50 });
      act(() => result.current.handleDragOver(overEvent, "tab2"));

      expect(overEvent.dataTransfer.dropEffect).toBe("none");
      expect(result.current.getDropIndicator("tab2")).toBeNull();
    });
  });

  describe("getDragProps", () => {
    it("returns draggable props when enabled - BLI: EL-339", () => {
      const { result } = renderHook(() =>
        useTabDragDrop({ enabled: true, tabIds })
      );
      const props = result.current.getDragProps("tab1");
      expect(props).toHaveProperty("draggable", true);
      expect(props).toHaveProperty("onDragStart");
      expect(props).toHaveProperty("onDragEnd");
      expect(props).toHaveProperty("onDragOver");
    });
  });

  describe("isDragging", () => {
    it("returns true for dragged tab - BLI: EL-339", () => {
      const { result } = renderHook(() =>
        useTabDragDrop({ enabled: true, tabIds })
      );
      act(() => result.current.handleDragStart(createDragEvent(), "tab2"));
      expect(result.current.isDragging("tab2")).toBe(true);
      expect(result.current.isDragging("tab1")).toBe(false);
    });
  });
});
