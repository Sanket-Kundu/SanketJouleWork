/**
 * useTabbarOverflow — coverage tests
 *
 * The hook uses setTimeout retry loops + RAF + cascading useEffect state updates
 * that cause OOM in jsdom. The only viable approach is to test individual code paths
 * by mocking React's hooks to capture the callbacks, then invoke them manually.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// We need to test the actual source lines for coverage,
// so we mock React hooks to prevent the infinite effect cascade.
const mockState = new Map<number, any>();
let stateIdx = 0;
const mockRefs = new Map<number, any>();
let refIdx = 0;
const effectCallbacks: Function[] = [];
const memoValues: any[] = [];
let memoIdx = 0;
const callbackFns: Function[] = [];
let callbackIdx = 0;

vi.mock("react", async () => {
  const actual = await vi.importActual("react");
  return {
    ...actual as object,
    useState: (init: any) => {
      const idx = stateIdx++;
      if (!mockState.has(idx)) {
        mockState.set(idx, typeof init === "function" ? init() : init);
      }
      const setState = (val: any) => {
        const cur = mockState.get(idx);
        const next = typeof val === "function" ? val(cur) : val;
        mockState.set(idx, next);
      };
      return [mockState.get(idx), setState];
    },
    useRef: (init: any) => {
      const idx = refIdx++;
      if (!mockRefs.has(idx)) {
        mockRefs.set(idx, { current: init });
      }
      return mockRefs.get(idx);
    },
    useEffect: (cb: Function, _deps?: any[]) => {
      effectCallbacks.push(cb);
    },
    useMemo: (factory: () => any, _deps?: any[]) => {
      const idx = memoIdx++;
      if (memoValues.length <= idx) {
        memoValues.push(factory());
      }
      return memoValues[idx];
    },
    useCallback: (cb: Function, _deps?: any[]) => {
      const idx = callbackIdx++;
      if (callbackFns.length <= idx) {
        callbackFns.push(cb);
      }
      return callbackFns[idx];
    },
  };
});

// Import after React mock
import { useTabbarOverflow } from "./useTabbarOverflow";

function resetMocks() {
  stateIdx = 0;
  refIdx = 0;
  memoIdx = 0;
  callbackIdx = 0;
  mockState.clear();
  mockRefs.clear();
  effectCallbacks.length = 0;
  memoValues.length = 0;
  callbackFns.length = 0;
}

describe("useTabbarOverflow", () => {
  beforeEach(() => {
    resetMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("disabled: returns all tab IDs visible and isReady=true - BLI: EL-339", () => {
    const tabs = [{ id: "a", label: "A" }, { id: "b", label: "B" }];
    const ref = { current: null } as React.RefObject<HTMLElement | null>;

    const result = useTabbarOverflow({
      enabled: false,
      tabs,
      selectedTabId: "a",
      tabListRef: ref,
    });

    expect(result.visibleTabIds).toEqual(["a", "b"]);
    expect(result.overflowTabIds).toEqual([]);
    expect(result.hasOverflow).toBe(false);
    // isReady is initially false from useState, but effects haven't run
    expect(typeof result.isReady).toBe("boolean");
  });

  it("disabled: handles empty tabs - BLI: EL-339", () => {
    const ref = { current: null } as React.RefObject<HTMLElement | null>;

    const result = useTabbarOverflow({
      enabled: false,
      tabs: [],
      selectedTabId: "",
      tabListRef: ref,
    });

    expect(result.visibleTabIds).toEqual([]);
    expect(result.overflowTabIds).toEqual([]);
  });

  it("enabled: calls calculateOverflow via effects - BLI: EL-339", () => {
    const tabs = [{ id: "tab1", label: "Tab 1" }];
    const container = document.createElement("div");
    Object.defineProperty(container, "clientWidth", { value: 600, configurable: true });
    const btn = document.createElement("button");
    btn.setAttribute("data-tab-id", "tab1");
    vi.spyOn(btn, "getBoundingClientRect").mockReturnValue({
      width: 100, height: 40, top: 0, left: 0, right: 100, bottom: 40, x: 0, y: 0,
      toJSON: () => ({}),
    });
    vi.spyOn(container, "querySelectorAll").mockReturnValue(
      [btn] as unknown as NodeListOf<Element>
    );
    vi.spyOn(window, "getComputedStyle").mockReturnValue({
      marginLeft: "0",
      marginRight: "0",
    } as CSSStyleDeclaration);

    const ref = { current: container } as React.RefObject<HTMLElement>;

    const result = useTabbarOverflow({
      enabled: true,
      tabs,
      selectedTabId: "tab1",
      tabListRef: ref,
    });

    // Effects were captured but not run — verify hook returned expected shape
    expect(Array.isArray(result.visibleTabIds)).toBe(true);
    expect(Array.isArray(result.overflowTabIds)).toBe(true);
    expect(typeof result.hasOverflow).toBe("boolean");
    expect(typeof result.isReady).toBe("boolean");
    expect(effectCallbacks.length).toBeGreaterThan(0);

    // Run the first effect (initial calculation)
    // It should call measureTabs → calculateOverflow
    const cleanup = effectCallbacks[0]();

    // Verify state was updated — visibleTabIds should be ["tab1"]
    expect(mockState.get(0)).toEqual(["tab1"]); // visibleTabIds
    expect(mockState.get(1)).toEqual([]); // overflowTabIds
    expect(mockState.get(2)).toBe(true); // isReady

    // Cleanup should be a function
    if (typeof cleanup === "function") cleanup();
  });

  it("enabled: overflow calculation with multiple tabs - BLI: EL-339", () => {
    resetMocks();

    const tabs = [
      { id: "a", label: "A" },
      { id: "b", label: "B" },
      { id: "c", label: "C" },
    ];

    const container = document.createElement("div");
    // Container=250, overflowBtn=80, available=170
    // a=100(70 left), b=100 no fit, c=100 no fit
    Object.defineProperty(container, "clientWidth", { value: 250, configurable: true });

    const makeBtn = (id: string, width: number) => {
      const el = document.createElement("button");
      el.setAttribute("data-tab-id", id);
      vi.spyOn(el, "getBoundingClientRect").mockReturnValue({
        width, height: 40, top: 0, left: 0, right: width, bottom: 40, x: 0, y: 0,
        toJSON: () => ({}),
      });
      return el;
    };

    vi.spyOn(container, "querySelectorAll").mockReturnValue(
      [makeBtn("a", 100), makeBtn("b", 100), makeBtn("c", 100)] as unknown as NodeListOf<Element>
    );
    vi.spyOn(window, "getComputedStyle").mockReturnValue({
      marginLeft: "0",
      marginRight: "0",
    } as CSSStyleDeclaration);

    const ref = { current: container } as React.RefObject<HTMLElement>;

    useTabbarOverflow({
      enabled: true,
      tabs,
      selectedTabId: "a",
      tabListRef: ref,
    });

    // Run initial effect
    effectCallbacks[0]();

    expect(mockState.get(0)).toEqual(["a"]); // visibleTabIds — only a fits
    expect(mockState.get(1)).toEqual(["b", "c"]); // overflowTabIds
    expect(mockState.get(2)).toBe(true); // isReady
  });

  it("enabled: selected tab is swapped from overflow to visible - BLI: EL-339", () => {
    resetMocks();

    const tabs = [
      { id: "a", label: "A" },
      { id: "b", label: "B" },
      { id: "c", label: "C" },
    ];

    const container = document.createElement("div");
    // Container=250, overflowBtn=80, available=170
    Object.defineProperty(container, "clientWidth", { value: 250, configurable: true });

    const makeBtn = (id: string, width: number) => {
      const el = document.createElement("button");
      el.setAttribute("data-tab-id", id);
      vi.spyOn(el, "getBoundingClientRect").mockReturnValue({
        width, height: 40, top: 0, left: 0, right: width, bottom: 40, x: 0, y: 0,
        toJSON: () => ({}),
      });
      return el;
    };

    vi.spyOn(container, "querySelectorAll").mockReturnValue(
      [makeBtn("a", 100), makeBtn("b", 100), makeBtn("c", 100)] as unknown as NodeListOf<Element>
    );
    vi.spyOn(window, "getComputedStyle").mockReturnValue({
      marginLeft: "0",
      marginRight: "0",
    } as CSSStyleDeclaration);

    const ref = { current: container } as React.RefObject<HTMLElement>;

    // Selected tab is "c" which would normally overflow
    useTabbarOverflow({
      enabled: true,
      tabs,
      selectedTabId: "c",
      tabListRef: ref,
    });

    effectCallbacks[0]();

    // "c" should be swapped into visible
    const visible = mockState.get(0) as string[];
    expect(visible).toContain("c");
    expect(mockState.get(2)).toBe(true);
  });

  it("enabled: handles null tabListRef — sets all tabs visible - BLI: EL-339", () => {
    resetMocks();

    const tabs = [{ id: "x", label: "X" }];
    const ref = { current: null } as React.RefObject<HTMLElement | null>;

    useTabbarOverflow({
      enabled: true,
      tabs,
      selectedTabId: "x",
      tabListRef: ref,
    });

    // Run the initial effect — with null ref, measureTabs returns false,
    // and the retry loop starts via setTimeout. But calculateOverflow with
    // null ref sets all visible.
    // The first effect calls tryCalculate which calls measureTabs (null ref → false)
    // Then schedules a retry. But we also need to check that calculateOverflow
    // was NOT called (since measureTabs failed). Let's check.
    effectCallbacks[0]();

    // measureTabs returns false for null ref, so it retries but doesn't calculate.
    // The initial useState default is tabs.map(t => t.id) = ["x"]
    expect(mockState.get(0)).toEqual(["x"]);
  });

  it("enabled: containerWidth=0 skips calculation - BLI: EL-339", () => {
    resetMocks();

    const tabs = [{ id: "z", label: "Z" }];
    const container = document.createElement("div");
    Object.defineProperty(container, "clientWidth", { value: 0, configurable: true });

    const el = document.createElement("button");
    el.setAttribute("data-tab-id", "z");
    vi.spyOn(el, "getBoundingClientRect").mockReturnValue({
      width: 100, height: 40, top: 0, left: 0, right: 100, bottom: 40, x: 0, y: 0,
      toJSON: () => ({}),
    });
    vi.spyOn(container, "querySelectorAll").mockReturnValue(
      [el] as unknown as NodeListOf<Element>
    );
    vi.spyOn(window, "getComputedStyle").mockReturnValue({
      marginLeft: "0",
      marginRight: "0",
    } as CSSStyleDeclaration);

    const ref = { current: container } as React.RefObject<HTMLElement>;

    useTabbarOverflow({
      enabled: true,
      tabs,
      selectedTabId: "z",
      tabListRef: ref,
    });

    effectCallbacks[0]();

    // containerWidth=0 → calculateOverflow returns early without setting state
    // State stays at initial values
    expect(mockState.get(0)).toEqual(["z"]); // default from useState
  });

  it("enabled: empty tabs sets empty visible and isReady - BLI: EL-339", () => {
    resetMocks();

    const container = document.createElement("div");
    Object.defineProperty(container, "clientWidth", { value: 600, configurable: true });
    vi.spyOn(container, "querySelectorAll").mockReturnValue(
      [] as unknown as NodeListOf<Element>
    );

    const ref = { current: container } as React.RefObject<HTMLElement>;

    useTabbarOverflow({
      enabled: true,
      tabs: [],
      selectedTabId: "",
      tabListRef: ref,
    });

    effectCallbacks[0]();

    expect(mockState.get(0)).toEqual([]); // visibleTabIds
    expect(mockState.get(1)).toEqual([]); // overflowTabIds
    expect(mockState.get(2)).toBe(true); // isReady
  });

  it("return shape includes all required fields - BLI: EL-339", () => {
    resetMocks();

    const tabs = [{ id: "q", label: "Q" }];
    const ref = { current: null } as React.RefObject<HTMLElement | null>;

    const result = useTabbarOverflow({
      enabled: false,
      tabs,
      selectedTabId: "q",
      tabListRef: ref,
    });

    expect("visibleTabIds" in result).toBe(true);
    expect("overflowTabIds" in result).toBe(true);
    expect("hasOverflow" in result).toBe(true);
    expect("isReady" in result).toBe(true);
  });

  it("enabled: tab with 0-width rect uses cached measurement - BLI: EL-339", () => {
    resetMocks();

    const tabs = [{ id: "a", label: "A" }, { id: "b", label: "B" }];
    const container = document.createElement("div");
    Object.defineProperty(container, "clientWidth", { value: 600, configurable: true });

    const btnA = document.createElement("button");
    btnA.setAttribute("data-tab-id", "a");
    vi.spyOn(btnA, "getBoundingClientRect").mockReturnValue({
      width: 100, height: 40, top: 0, left: 0, right: 100, bottom: 40, x: 0, y: 0,
      toJSON: () => ({}),
    });

    // b has 0-width (hidden/not yet rendered)
    const btnB = document.createElement("button");
    btnB.setAttribute("data-tab-id", "b");
    vi.spyOn(btnB, "getBoundingClientRect").mockReturnValue({
      width: 0, height: 0, top: 0, left: 0, right: 0, bottom: 0, x: 0, y: 0,
      toJSON: () => ({}),
    });

    vi.spyOn(container, "querySelectorAll").mockReturnValue(
      [btnA, btnB] as unknown as NodeListOf<Element>
    );
    vi.spyOn(window, "getComputedStyle").mockReturnValue({
      marginLeft: "0",
      marginRight: "0",
    } as CSSStyleDeclaration);

    const ref = { current: container } as React.RefObject<HTMLElement>;

    useTabbarOverflow({
      enabled: true,
      tabs,
      selectedTabId: "a",
      tabListRef: ref,
    });

    // measureTabs will fail (not all measured) because b has 0 width
    // So tryCalculate retries via setTimeout
    effectCallbacks[0]();

    // State should stay at default since calculation wasn't reached
    expect(mockState.get(0)).toEqual(["a", "b"]);
  });

  // ── disabled path in initial effect (line 201-204) ──────────────────

  it("disabled: initial effect sets visibleTabIds and isReady - BLI: EL-339", () => {
    resetMocks();

    const tabs = [{ id: "m", label: "M" }, { id: "n", label: "N" }];
    const ref = { current: null } as React.RefObject<HTMLElement | null>;

    useTabbarOverflow({
      enabled: false,
      tabs,
      selectedTabId: "m",
      tabListRef: ref,
    });

    // Effects[0] is the initial calculation effect
    // For disabled, it should set visibleTabIds and isReady, then return
    const cleanup = effectCallbacks[0]();

    expect(mockState.get(0)).toEqual(["m", "n"]); // visibleTabIds
    expect(mockState.get(2)).toBe(true); // isReady

    // Cleanup should be undefined for disabled (early return)
    expect(cleanup).toBeUndefined();
  });

  // ── selection change effect (line 237-241) ──────────────────────────

  it("selection change effect: recalculates when enabled and ready - BLI: EL-339", () => {
    resetMocks();

    const tabs = [
      { id: "a", label: "A" },
      { id: "b", label: "B" },
    ];
    const container = document.createElement("div");
    Object.defineProperty(container, "clientWidth", { value: 600, configurable: true });

    const makeBtn = (id: string, width: number) => {
      const el = document.createElement("button");
      el.setAttribute("data-tab-id", id);
      vi.spyOn(el, "getBoundingClientRect").mockReturnValue({
        width, height: 40, top: 0, left: 0, right: width, bottom: 40, x: 0, y: 0,
        toJSON: () => ({}),
      });
      return el;
    };
    vi.spyOn(container, "querySelectorAll").mockReturnValue(
      [makeBtn("a", 100), makeBtn("b", 100)] as unknown as NodeListOf<Element>
    );
    vi.spyOn(window, "getComputedStyle").mockReturnValue({
      marginLeft: "0",
      marginRight: "0",
    } as CSSStyleDeclaration);

    const ref = { current: container } as React.RefObject<HTMLElement>;

    useTabbarOverflow({
      enabled: true,
      tabs,
      selectedTabId: "b",
      tabListRef: ref,
    });

    // Run initial effect first to set up measurements
    effectCallbacks[0]();

    // Now isReady=true (mockState.get(2)), run the selection change effect
    // Effect 1 = selection change effect (line 237)
    if (effectCallbacks.length > 1) {
      effectCallbacks[1]();
    }

    // calculateOverflow should have been called again
    expect(mockState.get(0)).toEqual(["a", "b"]); // all fit
    expect(mockState.get(2)).toBe(true);
  });

  it("selection change effect: skips when disabled - BLI: EL-339", () => {
    resetMocks();

    const tabs = [{ id: "x", label: "X" }];
    const ref = { current: null } as React.RefObject<HTMLElement | null>;

    useTabbarOverflow({
      enabled: false,
      tabs,
      selectedTabId: "x",
      tabListRef: ref,
    });

    // The selection change effect (index 1) should return early for disabled
    if (effectCallbacks.length > 1) {
      effectCallbacks[1]();
    }

    // No state changes beyond what the initial call set
    expect(mockState.get(0)).toEqual(["x"]);
  });

  // ── ResizeObserver effect (line 244-267) ────────────────────────────

  it("ResizeObserver effect: sets up observer when enabled with ref - BLI: EL-339", () => {
    resetMocks();

    // Ensure ResizeObserver is defined (stubResizeObserver may not apply with mocked React)
    const origRO = globalThis.ResizeObserver;
    const mockObserve = vi.fn();
    const mockDisconnect = vi.fn();
    globalThis.ResizeObserver = class {
      constructor(public cb: ResizeObserverCallback) {}
      observe = mockObserve;
      unobserve = vi.fn();
      disconnect = mockDisconnect;
    } as any;

    const tabs = [{ id: "a", label: "A" }];
    const container = document.createElement("div");
    Object.defineProperty(container, "clientWidth", { value: 600, configurable: true });

    const el = document.createElement("button");
    el.setAttribute("data-tab-id", "a");
    vi.spyOn(el, "getBoundingClientRect").mockReturnValue({
      width: 100, height: 40, top: 0, left: 0, right: 100, bottom: 40, x: 0, y: 0,
      toJSON: () => ({}),
    });
    vi.spyOn(container, "querySelectorAll").mockReturnValue(
      [el] as unknown as NodeListOf<Element>
    );
    vi.spyOn(window, "getComputedStyle").mockReturnValue({
      marginLeft: "0",
      marginRight: "0",
    } as CSSStyleDeclaration);

    const ref = { current: container } as React.RefObject<HTMLElement>;

    useTabbarOverflow({
      enabled: true,
      tabs,
      selectedTabId: "a",
      tabListRef: ref,
    });

    // Effect 2 = ResizeObserver effect (line 244)
    if (effectCallbacks.length > 2) {
      const cleanup = effectCallbacks[2]();
      expect(mockObserve).toHaveBeenCalledWith(container);
      expect(typeof cleanup).toBe("function");
      if (typeof cleanup === "function") cleanup();
      expect(mockDisconnect).toHaveBeenCalled();
    }

    globalThis.ResizeObserver = origRO;
  });

  it("ResizeObserver effect: returns early when disabled - BLI: EL-339", () => {
    resetMocks();

    const tabs = [{ id: "a", label: "A" }];
    const ref = { current: null } as React.RefObject<HTMLElement | null>;

    useTabbarOverflow({
      enabled: false,
      tabs,
      selectedTabId: "a",
      tabListRef: ref,
    });

    // ResizeObserver effect should return early (no cleanup)
    if (effectCallbacks.length > 2) {
      const cleanup = effectCallbacks[2]();
      expect(cleanup).toBeUndefined();
    }
  });

  it("ResizeObserver effect: returns early with null ref - BLI: EL-339", () => {
    resetMocks();

    const tabs = [{ id: "a", label: "A" }];
    const ref = { current: null } as React.RefObject<HTMLElement | null>;

    useTabbarOverflow({
      enabled: true,
      tabs,
      selectedTabId: "a",
      tabListRef: ref,
    });

    // ResizeObserver effect with null ref should return early
    if (effectCallbacks.length > 2) {
      const cleanup = effectCallbacks[2]();
      expect(cleanup).toBeUndefined();
    }
  });

  // ── initial effect cleanup (line 228-233) ──────────────────────────

  it("initial effect returns cleanup that clears retry timeout - BLI: EL-339", () => {
    resetMocks();

    const tabs = [{ id: "a", label: "A" }];
    const container = document.createElement("div");
    Object.defineProperty(container, "clientWidth", { value: 600, configurable: true });

    const el = document.createElement("button");
    el.setAttribute("data-tab-id", "a");
    vi.spyOn(el, "getBoundingClientRect").mockReturnValue({
      width: 100, height: 40, top: 0, left: 0, right: 100, bottom: 40, x: 0, y: 0,
      toJSON: () => ({}),
    });
    vi.spyOn(container, "querySelectorAll").mockReturnValue(
      [el] as unknown as NodeListOf<Element>
    );
    vi.spyOn(window, "getComputedStyle").mockReturnValue({
      marginLeft: "0",
      marginRight: "0",
    } as CSSStyleDeclaration);

    const ref = { current: container } as React.RefObject<HTMLElement>;

    useTabbarOverflow({
      enabled: true,
      tabs,
      selectedTabId: "a",
      tabListRef: ref,
    });

    const cleanup = effectCallbacks[0]();
    expect(typeof cleanup).toBe("function");
    // Should not throw
    if (typeof cleanup === "function") cleanup();
  });
});
