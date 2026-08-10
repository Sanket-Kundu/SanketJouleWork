import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useTabNavigation } from "./useTabNavigation";

// Helper to create a keyboard event
function createKeyEvent(key: string): React.KeyboardEvent {
  return { key, preventDefault: vi.fn() } as unknown as React.KeyboardEvent;
}

describe("useTabNavigation", () => {
  describe("findNextEnabledTab", () => {
    it("returns next index forward - BLI: EL-339", () => {
      const { result } = renderHook(() =>
        useTabNavigation({ tabCount: 5, focusedIndex: 0 })
      );
      expect(result.current.findNextEnabledTab(0, 1)).toBe(1);
    });

    it("wraps around forward - BLI: EL-339", () => {
      const { result } = renderHook(() =>
        useTabNavigation({ tabCount: 3, focusedIndex: 2 })
      );
      expect(result.current.findNextEnabledTab(2, 1)).toBe(0);
    });

    it("wraps around backward - BLI: EL-339", () => {
      const { result } = renderHook(() =>
        useTabNavigation({ tabCount: 3, focusedIndex: 0 })
      );
      expect(result.current.findNextEnabledTab(0, -1)).toBe(2);
    });

    it("skips disabled tabs - BLI: EL-339", () => {
      const { result } = renderHook(() =>
        useTabNavigation({
          tabCount: 4,
          focusedIndex: 0,
          disabledTabs: new Set([1]),
        })
      );
      expect(result.current.findNextEnabledTab(0, 1)).toBe(2);
    });

    it("returns current if all tabs are disabled - BLI: EL-339", () => {
      const { result } = renderHook(() =>
        useTabNavigation({
          tabCount: 3,
          focusedIndex: 0,
          disabledTabs: new Set([0, 1, 2]),
        })
      );
      expect(result.current.findNextEnabledTab(0, 1)).toBe(0);
    });

    it("returns -1 when tabCount is 0 - BLI: EL-339", () => {
      const { result } = renderHook(() =>
        useTabNavigation({ tabCount: 0, focusedIndex: -1 })
      );
      expect(result.current.findNextEnabledTab(-1, 1)).toBe(-1);
    });
  });

  describe("findFirstEnabledTab", () => {
    it("returns first non-disabled index - BLI: EL-339", () => {
      const { result } = renderHook(() =>
        useTabNavigation({
          tabCount: 4,
          focusedIndex: 2,
          disabledTabs: new Set([0]),
        })
      );
      expect(result.current.findFirstEnabledTab()).toBe(1);
    });

    it("returns 0 when no tabs are disabled - BLI: EL-339", () => {
      const { result } = renderHook(() =>
        useTabNavigation({ tabCount: 3, focusedIndex: 1 })
      );
      expect(result.current.findFirstEnabledTab()).toBe(0);
    });

    it("returns 0 when all tabs are disabled (fallback) - BLI: EL-339", () => {
      const { result } = renderHook(() =>
        useTabNavigation({
          tabCount: 3,
          focusedIndex: 0,
          disabledTabs: new Set([0, 1, 2]),
        })
      );
      expect(result.current.findFirstEnabledTab()).toBe(0);
    });
  });

  describe("findLastEnabledTab", () => {
    it("returns last non-disabled index - BLI: EL-339", () => {
      const { result } = renderHook(() =>
        useTabNavigation({
          tabCount: 4,
          focusedIndex: 0,
          disabledTabs: new Set([3]),
        })
      );
      expect(result.current.findLastEnabledTab()).toBe(2);
    });

    it("returns last index when no tabs are disabled - BLI: EL-339", () => {
      const { result } = renderHook(() =>
        useTabNavigation({ tabCount: 3, focusedIndex: 0 })
      );
      expect(result.current.findLastEnabledTab()).toBe(2);
    });
  });

  describe("handleKeyDown", () => {
    it("ArrowRight navigates forward - BLI: EL-339", () => {
      const onNavigate = vi.fn();
      const { result } = renderHook(() =>
        useTabNavigation({ tabCount: 3, focusedIndex: 0, onNavigate })
      );
      const event = createKeyEvent("ArrowRight");
      result.current.handleKeyDown(event);
      expect(onNavigate).toHaveBeenCalledWith(1);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it("ArrowLeft navigates backward - BLI: EL-339", () => {
      const onNavigate = vi.fn();
      const { result } = renderHook(() =>
        useTabNavigation({ tabCount: 3, focusedIndex: 1, onNavigate })
      );
      const event = createKeyEvent("ArrowLeft");
      result.current.handleKeyDown(event);
      expect(onNavigate).toHaveBeenCalledWith(0);
    });

    it("RTL reverses ArrowRight to navigate backward - BLI: EL-339", () => {
      const onNavigate = vi.fn();
      const { result } = renderHook(() =>
        useTabNavigation({ tabCount: 3, focusedIndex: 1, onNavigate, rtl: true })
      );
      const event = createKeyEvent("ArrowRight");
      result.current.handleKeyDown(event);
      expect(onNavigate).toHaveBeenCalledWith(0);
    });

    it("RTL reverses ArrowLeft to navigate forward - BLI: EL-339", () => {
      const onNavigate = vi.fn();
      const { result } = renderHook(() =>
        useTabNavigation({ tabCount: 3, focusedIndex: 0, onNavigate, rtl: true })
      );
      const event = createKeyEvent("ArrowLeft");
      result.current.handleKeyDown(event);
      expect(onNavigate).toHaveBeenCalledWith(1);
    });

    it("Home navigates to first tab - BLI: EL-339", () => {
      const onNavigate = vi.fn();
      const { result } = renderHook(() =>
        useTabNavigation({ tabCount: 3, focusedIndex: 2, onNavigate })
      );
      const event = createKeyEvent("Home");
      result.current.handleKeyDown(event);
      expect(onNavigate).toHaveBeenCalledWith(0);
    });

    it("End navigates to last tab - BLI: EL-339", () => {
      const onNavigate = vi.fn();
      const { result } = renderHook(() =>
        useTabNavigation({ tabCount: 3, focusedIndex: 0, onNavigate })
      );
      const event = createKeyEvent("End");
      result.current.handleKeyDown(event);
      expect(onNavigate).toHaveBeenCalledWith(2);
    });

    it("Enter selects focused tab - BLI: EL-339", () => {
      const onSelect = vi.fn();
      const { result } = renderHook(() =>
        useTabNavigation({ tabCount: 3, focusedIndex: 1, onSelect })
      );
      const event = createKeyEvent("Enter");
      result.current.handleKeyDown(event);
      expect(onSelect).toHaveBeenCalledWith(1);
    });

    it("Space selects focused tab - BLI: EL-339", () => {
      const onSelect = vi.fn();
      const { result } = renderHook(() =>
        useTabNavigation({ tabCount: 3, focusedIndex: 1, onSelect })
      );
      const event = createKeyEvent(" ");
      result.current.handleKeyDown(event);
      expect(onSelect).toHaveBeenCalledWith(1);
    });

    it("Enter does not select disabled tab - BLI: EL-339", () => {
      const onSelect = vi.fn();
      const { result } = renderHook(() =>
        useTabNavigation({
          tabCount: 3,
          focusedIndex: 1,
          onSelect,
          disabledTabs: new Set([1]),
        })
      );
      const event = createKeyEvent("Enter");
      result.current.handleKeyDown(event);
      expect(onSelect).not.toHaveBeenCalled();
    });

    it("does not call onNavigate if already at first for Home - BLI: EL-339", () => {
      const onNavigate = vi.fn();
      const { result } = renderHook(() =>
        useTabNavigation({ tabCount: 3, focusedIndex: 0, onNavigate })
      );
      result.current.handleKeyDown(createKeyEvent("Home"));
      expect(onNavigate).not.toHaveBeenCalled();
    });

    it("Tab key does not call preventDefault (bubbles naturally) - BLI: EL-339", () => {
      const { result } = renderHook(() =>
        useTabNavigation({ tabCount: 3, focusedIndex: 0 })
      );
      const event = createKeyEvent("Tab");
      result.current.handleKeyDown(event);
      expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it("unrecognized key is ignored - BLI: EL-339", () => {
      const onNavigate = vi.fn();
      const onSelect = vi.fn();
      const { result } = renderHook(() =>
        useTabNavigation({ tabCount: 3, focusedIndex: 0, onNavigate, onSelect })
      );
      const event = createKeyEvent("a");
      result.current.handleKeyDown(event);
      expect(onNavigate).not.toHaveBeenCalled();
      expect(onSelect).not.toHaveBeenCalled();
    });
  });
});
