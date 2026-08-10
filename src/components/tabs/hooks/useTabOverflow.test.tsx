import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { render, screen, act, cleanup } from "@testing-library/react";
import {
  useTabOverflow,
  UseTabOverflowOptions,
  UseTabOverflowResult,
} from "./useTabOverflow";

// ---------------------------------------------------------------------------
// Mock ResizeObserver (not available in jsdom)
// ---------------------------------------------------------------------------
if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
}

// ---------------------------------------------------------------------------
// Test wrapper — renders hook output as data-attributes.
//
// NOTE: We do NOT use renderHook() because React 19 + @testing-library/react
// renderHook causes infinite render cycles with this hook and OOM crashes.
// Using a real component with render() works correctly.
// ---------------------------------------------------------------------------

let lastResult: UseTabOverflowResult | null = null;

function HookConsumer(props: UseTabOverflowOptions) {
  const result = useTabOverflow(props);
  lastResult = result;
  return (
    <div
      data-testid="hook-result"
      data-visible={JSON.stringify(result.visibleTabIds)}
      data-start={JSON.stringify(result.startOverflowTabIds)}
      data-end={JSON.stringify(result.endOverflowTabIds)}
      data-has-start={String(result.hasStartOverflow)}
      data-has-end={String(result.hasEndOverflow)}
      data-ready={String(result.isReady)}
      data-recalculate={typeof result.recalculate}
    />
  );
}

function getResult() {
  const el = screen.getByTestId("hook-result");
  return {
    visibleTabIds: JSON.parse(el.getAttribute("data-visible")!) as string[],
    startOverflowTabIds: JSON.parse(el.getAttribute("data-start")!) as string[],
    endOverflowTabIds: JSON.parse(el.getAttribute("data-end")!) as string[],
    hasStartOverflow: el.getAttribute("data-has-start") === "true",
    hasEndOverflow: el.getAttribute("data-has-end") === "true",
    isReady: el.getAttribute("data-ready") === "true",
    recalculateType: el.getAttribute("data-recalculate"),
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeTabListRef(clientWidth = 0) {
  const el = document.createElement("div");
  Object.defineProperty(el, "clientWidth", {
    get: () => clientWidth,
    configurable: true,
  });
  return { current: el } as React.RefObject<HTMLElement>;
}

/**
 * Populate a container element with mock tab elements whose
 * getBoundingClientRect returns the specified widths, so measureTabs() succeeds.
 */
function addMockTabs(
  container: HTMLElement,
  tabIds: string[],
  widths: number[] | number = 100,
) {
  container.innerHTML = "";
  tabIds.forEach((id, i) => {
    const tab = document.createElement("button");
    tab.setAttribute("role", "tab");
    tab.setAttribute("data-tab-id", id);
    const w = Array.isArray(widths) ? widths[i] : widths;
    tab.getBoundingClientRect = () =>
      ({
        width: w,
        height: 32,
        top: 0,
        left: 0,
        right: w,
        bottom: 32,
        x: 0,
        y: 0,
        toJSON() {},
      }) as DOMRect;
    container.appendChild(tab);
  });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("useTabOverflow", () => {
  let computedStyleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.useFakeTimers();
    // Mock getComputedStyle to return zero margins (needed for tab width calc)
    computedStyleSpy = vi
      .spyOn(window, "getComputedStyle")
      .mockReturnValue({
        marginLeft: "0",
        marginRight: "0",
      } as unknown as CSSStyleDeclaration);
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    computedStyleSpy.mockRestore();
    vi.restoreAllMocks();
    lastResult = null;
    cleanup();
  });

  // =========================================================================
  // Disabled path (enabled = false)
  // =========================================================================
  describe("disabled (enabled = false)", () => {
    it("returns all tabs visible and isReady=true - BLI: EL-339", () => {
      const tabListRef = makeTabListRef();
      render(
        <HookConsumer
          enabled={false}
          tabIds={["a", "b", "c"]}
          selectedTabId="a"
          tabListRef={tabListRef}
          overflowMode="End"
        />,
      );

      const r = getResult();
      expect(r.isReady).toBe(true);
      expect(r.hasStartOverflow).toBe(false);
      expect(r.hasEndOverflow).toBe(false);
      expect(r.visibleTabIds).toEqual(["a", "b", "c"]);
      expect(r.startOverflowTabIds).toEqual([]);
      expect(r.endOverflowTabIds).toEqual([]);
    });

    it("handles empty tabs - BLI: EL-339", () => {
      const tabListRef = makeTabListRef();
      render(
        <HookConsumer
          enabled={false}
          tabIds={[]}
          selectedTabId={null}
          tabListRef={tabListRef}
          overflowMode="End"
        />,
      );

      const r = getResult();
      expect(r.isReady).toBe(true);
      expect(r.visibleTabIds).toEqual([]);
    });

    it("handles single tab - BLI: EL-339", () => {
      const tabListRef = makeTabListRef();
      render(
        <HookConsumer
          enabled={false}
          tabIds={["only"]}
          selectedTabId="only"
          tabListRef={tabListRef}
          overflowMode="StartAndEnd"
        />,
      );

      const r = getResult();
      expect(r.isReady).toBe(true);
      expect(r.visibleTabIds).toEqual(["only"]);
      expect(r.hasStartOverflow).toBe(false);
      expect(r.hasEndOverflow).toBe(false);
    });

    it("handles many tabs - BLI: EL-339", () => {
      const tabListRef = makeTabListRef();
      const manyTabs = Array.from({ length: 20 }, (_, i) => `tab-${i}`);
      render(
        <HookConsumer
          enabled={false}
          tabIds={manyTabs}
          selectedTabId="tab-5"
          tabListRef={tabListRef}
          overflowMode="End"
        />,
      );

      const r = getResult();
      expect(r.isReady).toBe(true);
      expect(r.visibleTabIds).toEqual(manyTabs);
    });

    it("works with StartAndEnd overflow mode - BLI: EL-339", () => {
      const tabListRef = makeTabListRef();
      render(
        <HookConsumer
          enabled={false}
          tabIds={["x", "y", "z"]}
          selectedTabId="y"
          tabListRef={tabListRef}
          overflowMode="StartAndEnd"
        />,
      );

      const r = getResult();
      expect(r.isReady).toBe(true);
      expect(r.visibleTabIds).toEqual(["x", "y", "z"]);
      expect(r.startOverflowTabIds).toEqual([]);
      expect(r.endOverflowTabIds).toEqual([]);
    });

    it("handles null selectedTabId - BLI: EL-339", () => {
      const tabListRef = makeTabListRef();
      render(
        <HookConsumer
          enabled={false}
          tabIds={["a", "b"]}
          selectedTabId={null}
          tabListRef={tabListRef}
          overflowMode="End"
        />,
      );

      const r = getResult();
      expect(r.isReady).toBe(true);
      expect(r.visibleTabIds).toEqual(["a", "b"]);
    });
  });

  // =========================================================================
  // Enabled — all tabs fit (no overflow)
  // =========================================================================
  describe("enabled - all tabs fit", () => {
    it("shows all tabs when total width < container width (End mode) - BLI: EL-339", () => {
      const tabListRef = makeTabListRef(500);
      const tabIds = ["a", "b", "c"];
      addMockTabs(tabListRef.current!, tabIds, 100); // 300 < 500

      render(
        <HookConsumer
          enabled={true}
          tabIds={tabIds}
          selectedTabId="a"
          tabListRef={tabListRef}
          overflowMode="End"
        />,
      );

      // Advance timers to flush retry loop
      act(() => {
        vi.advanceTimersByTime(400);
      });

      const r = getResult();
      expect(r.isReady).toBe(true);
      expect(r.visibleTabIds).toEqual(["a", "b", "c"]);
      expect(r.hasStartOverflow).toBe(false);
      expect(r.hasEndOverflow).toBe(false);
    });

    it("shows all tabs (StartAndEnd mode) - BLI: EL-339", () => {
      const tabListRef = makeTabListRef(500);
      const tabIds = ["a", "b", "c"];
      addMockTabs(tabListRef.current!, tabIds, 100);

      render(
        <HookConsumer
          enabled={true}
          tabIds={tabIds}
          selectedTabId="b"
          tabListRef={tabListRef}
          overflowMode="StartAndEnd"
        />,
      );

      act(() => {
        vi.advanceTimersByTime(400);
      });

      const r = getResult();
      expect(r.isReady).toBe(true);
      expect(r.visibleTabIds).toEqual(["a", "b", "c"]);
    });
  });

  // =========================================================================
  // Enabled — empty tabIds
  // =========================================================================
  describe("enabled with empty tabIds", () => {
    it("returns empty visible, isReady=true - BLI: EL-339", () => {
      const tabListRef = makeTabListRef(500);
      render(
        <HookConsumer
          enabled={true}
          tabIds={[]}
          selectedTabId={null}
          tabListRef={tabListRef}
          overflowMode="End"
        />,
      );

      act(() => {
        vi.advanceTimersByTime(400);
      });

      const r = getResult();
      expect(r.isReady).toBe(true);
      expect(r.visibleTabIds).toEqual([]);
    });
  });

  // =========================================================================
  // End overflow mode
  // =========================================================================
  describe("enabled - End overflow mode", () => {
    it("overflows rightmost tabs that do not fit - BLI: EL-339", () => {
      // Container: 290px. Total: 300px (3*100) > 290 -> overflow.
      // Available after button: 290-52=238. a(100)+b(100)=200 fits; c overflows.
      const tabListRef = makeTabListRef(290);
      const tabIds = ["a", "b", "c"];
      addMockTabs(tabListRef.current!, tabIds, 100);

      render(
        <HookConsumer
          enabled={true}
          tabIds={tabIds}
          selectedTabId="a"
          tabListRef={tabListRef}
          overflowMode="End"
        />,
      );

      act(() => {
        vi.advanceTimersByTime(400);
      });

      const r = getResult();
      expect(r.isReady).toBe(true);
      expect(r.visibleTabIds).toEqual(["a", "b"]);
      expect(r.endOverflowTabIds).toEqual(["c"]);
      expect(r.hasEndOverflow).toBe(true);
      expect(r.hasStartOverflow).toBe(false);
    });

    it("keeps selected tab visible by swapping from overflow - BLI: EL-339", () => {
      // Container: 290px. Total: 300px > 290 -> overflow.
      // Available: 290-52=238. First pass: a+b=200 fit; c overflows.
      // But c is selected -> swap b out, put c in.
      const tabListRef = makeTabListRef(290);
      const tabIds = ["a", "b", "c"];
      addMockTabs(tabListRef.current!, tabIds, 100);

      render(
        <HookConsumer
          enabled={true}
          tabIds={tabIds}
          selectedTabId="c"
          tabListRef={tabListRef}
          overflowMode="End"
        />,
      );

      act(() => {
        vi.advanceTimersByTime(400);
      });

      const r = getResult();
      expect(r.isReady).toBe(true);
      expect(r.visibleTabIds).toContain("c");
      expect(r.endOverflowTabIds).toContain("b");
    });

    it("handles all tabs overflowing except first - BLI: EL-339", () => {
      // Container: 180px, button: 52px -> available: 128px
      // Tabs: 120px each -> only first fits
      const tabListRef = makeTabListRef(180);
      const tabIds = ["a", "b", "c", "d"];
      addMockTabs(tabListRef.current!, tabIds, 120);

      render(
        <HookConsumer
          enabled={true}
          tabIds={tabIds}
          selectedTabId="a"
          tabListRef={tabListRef}
          overflowMode="End"
        />,
      );

      act(() => {
        vi.advanceTimersByTime(400);
      });

      const r = getResult();
      expect(r.isReady).toBe(true);
      expect(r.visibleTabIds).toEqual(["a"]);
      expect(r.endOverflowTabIds).toEqual(["b", "c", "d"]);
    });

    it("handles varying tab widths - BLI: EL-339", () => {
      // Container: 350px, button: 52px -> available: 298px
      // Widths: [50, 80, 120, 60, 90]
      // a(50)+b(80)+c(120)=250 fits; d(310)>298 overflows
      const tabListRef = makeTabListRef(350);
      const tabIds = ["a", "b", "c", "d", "e"];
      addMockTabs(tabListRef.current!, tabIds, [50, 80, 120, 60, 90]);

      render(
        <HookConsumer
          enabled={true}
          tabIds={tabIds}
          selectedTabId="a"
          tabListRef={tabListRef}
          overflowMode="End"
        />,
      );

      act(() => {
        vi.advanceTimersByTime(400);
      });

      const r = getResult();
      expect(r.isReady).toBe(true);
      expect(r.visibleTabIds).toEqual(["a", "b", "c"]);
      expect(r.endOverflowTabIds).toEqual(["d", "e"]);
    });
  });

  // =========================================================================
  // StartAndEnd overflow mode
  // =========================================================================
  describe("enabled - StartAndEnd overflow mode", () => {
    it("overflows tabs on both sides around selected tab - BLI: EL-339", () => {
      // Container: 300px, 2 buttons: 104px -> available: 196px
      // Tabs: 100px each. Selected "c" (idx 2). Only c fits.
      const tabListRef = makeTabListRef(300);
      const tabIds = ["a", "b", "c", "d", "e"];
      addMockTabs(tabListRef.current!, tabIds, 100);

      render(
        <HookConsumer
          enabled={true}
          tabIds={tabIds}
          selectedTabId="c"
          tabListRef={tabListRef}
          overflowMode="StartAndEnd"
        />,
      );

      act(() => {
        vi.advanceTimersByTime(400);
      });

      const r = getResult();
      expect(r.isReady).toBe(true);
      expect(r.visibleTabIds).toEqual(["c"]);
      expect(r.startOverflowTabIds).toEqual(["a", "b"]);
      expect(r.endOverflowTabIds).toEqual(["d", "e"]);
      expect(r.hasStartOverflow).toBe(true);
      expect(r.hasEndOverflow).toBe(true);
    });

    it("handles selected as first tab — only end overflow - BLI: EL-339", () => {
      // Container: 300px, 2 buttons: 104px -> available: 196px
      // Selected "a". Only a fits.
      const tabListRef = makeTabListRef(300);
      const tabIds = ["a", "b", "c", "d"];
      addMockTabs(tabListRef.current!, tabIds, 100);

      render(
        <HookConsumer
          enabled={true}
          tabIds={tabIds}
          selectedTabId="a"
          tabListRef={tabListRef}
          overflowMode="StartAndEnd"
        />,
      );

      act(() => {
        vi.advanceTimersByTime(400);
      });

      const r = getResult();
      expect(r.isReady).toBe(true);
      expect(r.visibleTabIds).toEqual(["a"]);
      expect(r.hasStartOverflow).toBe(false);
      expect(r.hasEndOverflow).toBe(true);
      expect(r.startOverflowTabIds).toEqual([]);
      expect(r.endOverflowTabIds).toEqual(["b", "c", "d"]);
    });

    it("handles selected as last tab — only start overflow - BLI: EL-339", () => {
      // Container: 300px, 2 buttons: 104px -> available: 196px
      // Selected "d" (last). Only d fits.
      const tabListRef = makeTabListRef(300);
      const tabIds = ["a", "b", "c", "d"];
      addMockTabs(tabListRef.current!, tabIds, 100);

      render(
        <HookConsumer
          enabled={true}
          tabIds={tabIds}
          selectedTabId="d"
          tabListRef={tabListRef}
          overflowMode="StartAndEnd"
        />,
      );

      act(() => {
        vi.advanceTimersByTime(400);
      });

      const r = getResult();
      expect(r.isReady).toBe(true);
      expect(r.visibleTabIds).toEqual(["d"]);
      expect(r.hasStartOverflow).toBe(true);
      expect(r.hasEndOverflow).toBe(false);
      expect(r.startOverflowTabIds).toEqual(["a", "b", "c"]);
    });

    it("shows multiple tabs when space allows - BLI: EL-339", () => {
      // Container: 450px, 2 buttons: 104px -> available: 346px
      // Tabs: 100px each. Selected "c". c+d=200, +b=300 fit. e=400>346.
      // visible=[b,c,d], start=[a], end=[e]
      const tabListRef = makeTabListRef(450);
      const tabIds = ["a", "b", "c", "d", "e"];
      addMockTabs(tabListRef.current!, tabIds, 100);

      render(
        <HookConsumer
          enabled={true}
          tabIds={tabIds}
          selectedTabId="c"
          tabListRef={tabListRef}
          overflowMode="StartAndEnd"
        />,
      );

      act(() => {
        vi.advanceTimersByTime(400);
      });

      const r = getResult();
      expect(r.isReady).toBe(true);
      expect(r.visibleTabIds).toEqual(["b", "c", "d"]);
      expect(r.startOverflowTabIds).toEqual(["a"]);
      expect(r.endOverflowTabIds).toEqual(["e"]);
    });
  });

  // =========================================================================
  // Edge cases
  // =========================================================================
  describe("edge cases", () => {
    it("handles null tabListRef without crashing - BLI: EL-339", () => {
      const tabListRef = {
        current: null,
      } as React.RefObject<HTMLElement | null>;

      render(
        <HookConsumer
          enabled={true}
          tabIds={["a", "b"]}
          selectedTabId="a"
          tabListRef={tabListRef}
          overflowMode="End"
        />,
      );

      act(() => {
        vi.advanceTimersByTime(400);
      });

      // With null ref, retries exhaust. Initial state preserved.
      const r = getResult();
      expect(r.visibleTabIds).toEqual(["a", "b"]);
    });

    it("handles containerWidth zero - BLI: EL-339", () => {
      const tabListRef = makeTabListRef(0);
      const tabIds = ["a", "b"];
      addMockTabs(tabListRef.current!, tabIds, 100);

      render(
        <HookConsumer
          enabled={true}
          tabIds={tabIds}
          selectedTabId="a"
          tabListRef={tabListRef}
          overflowMode="End"
        />,
      );

      act(() => {
        vi.advanceTimersByTime(400);
      });

      // containerWidth === 0 -> calculateOverflow returns early
      const r = getResult();
      expect(r.visibleTabIds).toEqual(["a", "b"]);
    });

    it("handles selectedTabId not in tabIds - BLI: EL-339", () => {
      const tabListRef = makeTabListRef(300);
      const tabIds = ["a", "b", "c"];
      addMockTabs(tabListRef.current!, tabIds, 100);

      render(
        <HookConsumer
          enabled={true}
          tabIds={tabIds}
          selectedTabId="nonexistent"
          tabListRef={tabListRef}
          overflowMode="End"
        />,
      );

      act(() => {
        vi.advanceTimersByTime(400);
      });

      // indexOf returns -1 -> safeSelectedIndex = 0
      const r = getResult();
      expect(r.isReady).toBe(true);
    });

    it("handles null selectedTabId when enabled - BLI: EL-339", () => {
      const tabListRef = makeTabListRef(500);
      const tabIds = ["a", "b"];
      addMockTabs(tabListRef.current!, tabIds, 100);

      render(
        <HookConsumer
          enabled={true}
          tabIds={tabIds}
          selectedTabId={null}
          tabListRef={tabListRef}
          overflowMode="End"
        />,
      );

      act(() => {
        vi.advanceTimersByTime(400);
      });

      const r = getResult();
      expect(r.isReady).toBe(true);
      expect(r.visibleTabIds).toEqual(["a", "b"]);
    });
  });

  // =========================================================================
  // Retry loop exhaustion
  // =========================================================================
  describe("retry loop", () => {
    it("stops retrying after maxRetries when measurement fails - BLI: EL-339", () => {
      const tabListRef = makeTabListRef(500);
      // No mock tabs -> measureTabs finds no [role=tab] elements
      const tabIds = ["a", "b"];

      render(
        <HookConsumer
          enabled={true}
          tabIds={tabIds}
          selectedTabId="a"
          tabListRef={tabListRef}
          overflowMode="End"
        />,
      );

      // 20 retries * 16ms = 320ms + buffer
      act(() => {
        vi.advanceTimersByTime(500);
      });

      // Retries exhausted; no infinite loop.
      const r = getResult();
      expect(r.visibleTabIds).toEqual(["a", "b"]);
    });
  });

  // =========================================================================
  // recalculate()
  // =========================================================================
  describe("recalculate", () => {
    it("exposes a recalculate function - BLI: EL-339", () => {
      const tabListRef = makeTabListRef();
      render(
        <HookConsumer
          enabled={false}
          tabIds={["a"]}
          selectedTabId="a"
          tabListRef={tabListRef}
          overflowMode="End"
        />,
      );

      const r = getResult();
      expect(r.recalculateType).toBe("function");
    });

    it("recalculate resets isReady then re-measures - BLI: EL-339", () => {
      const tabListRef = makeTabListRef(500);
      const tabIds = ["a", "b"];
      addMockTabs(tabListRef.current!, tabIds, 100);

      render(
        <HookConsumer
          enabled={true}
          tabIds={tabIds}
          selectedTabId="a"
          tabListRef={tabListRef}
          overflowMode="End"
        />,
      );

      // Let initial calculation complete
      act(() => {
        vi.advanceTimersByTime(400);
      });
      expect(getResult().isReady).toBe(true);

      // Call recalculate via the captured ref
      act(() => {
        lastResult?.recalculate();
      });
      expect(getResult().isReady).toBe(false);

      // Advance past setTimeout(0) in recalculate
      act(() => {
        vi.advanceTimersByTime(50);
      });
      expect(getResult().visibleTabIds).toEqual(["a", "b"]);
    });
  });

  // =========================================================================
  // Return value shape
  // =========================================================================
  describe("return value shape", () => {
    it("returns all expected properties with correct types - BLI: EL-339", () => {
      const tabListRef = makeTabListRef();
      render(
        <HookConsumer
          enabled={false}
          tabIds={["a"]}
          selectedTabId="a"
          tabListRef={tabListRef}
          overflowMode="End"
        />,
      );

      const r = getResult();
      expect(Array.isArray(r.visibleTabIds)).toBe(true);
      expect(Array.isArray(r.startOverflowTabIds)).toBe(true);
      expect(Array.isArray(r.endOverflowTabIds)).toBe(true);
      expect(typeof r.hasStartOverflow).toBe("boolean");
      expect(typeof r.hasEndOverflow).toBe("boolean");
      expect(r.recalculateType).toBe("function");
      expect(typeof r.isReady).toBe("boolean");
    });
  });

  // =========================================================================
  // Derived boolean consistency
  // =========================================================================
  describe("hasStartOverflow / hasEndOverflow consistency", () => {
    it("matches array lengths when there is overflow - BLI: EL-339", () => {
      const tabListRef = makeTabListRef(300);
      const tabIds = ["a", "b", "c", "d", "e"];
      addMockTabs(tabListRef.current!, tabIds, 100);

      render(
        <HookConsumer
          enabled={true}
          tabIds={tabIds}
          selectedTabId="c"
          tabListRef={tabListRef}
          overflowMode="StartAndEnd"
        />,
      );

      act(() => {
        vi.advanceTimersByTime(400);
      });

      const r = getResult();
      expect(r.hasStartOverflow).toBe(r.startOverflowTabIds.length > 0);
      expect(r.hasEndOverflow).toBe(r.endOverflowTabIds.length > 0);
    });

    it("both false when no overflow - BLI: EL-339", () => {
      const tabListRef = makeTabListRef();
      render(
        <HookConsumer
          enabled={false}
          tabIds={["a", "b", "c"]}
          selectedTabId="a"
          tabListRef={tabListRef}
          overflowMode="End"
        />,
      );

      const r = getResult();
      expect(r.hasStartOverflow).toBe(false);
      expect(r.hasEndOverflow).toBe(false);
    });
  });
});
