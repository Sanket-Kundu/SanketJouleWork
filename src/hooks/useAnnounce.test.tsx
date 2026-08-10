import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { render, screen } from "@testing-library/react";
import { useAnnounce, LiveRegion } from "./useAnnounce";

describe("useAnnounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("initially has an empty message - BLI: EL-339", () => {
    const { result } = renderHook(() => useAnnounce());
    expect(result.current.message).toBe("");
  });

  it("sets message when announce is called - BLI: EL-339", () => {
    const { result } = renderHook(() => useAnnounce());

    act(() => {
      result.current.announce("Item selected");
    });

    expect(result.current.message).toBe("Item selected");
  });

  it("clears message after 3000ms timeout - BLI: EL-339", () => {
    const { result } = renderHook(() => useAnnounce());

    act(() => {
      result.current.announce("Deleted");
    });
    expect(result.current.message).toBe("Deleted");

    act(() => {
      vi.advanceTimersByTime(2999);
    });
    expect(result.current.message).toBe("Deleted");

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current.message).toBe("");
  });

  it("replaces pending message when announce is called again - BLI: EL-339", () => {
    const { result } = renderHook(() => useAnnounce());

    act(() => {
      result.current.announce("First");
    });
    expect(result.current.message).toBe("First");

    act(() => {
      result.current.announce("Second");
    });
    expect(result.current.message).toBe("Second");

    // Only one timeout should be active; advancing clears "Second"
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(result.current.message).toBe("");
  });

  it("supports assertive mode in liveRegionProps - BLI: EL-339", () => {
    const { result } = renderHook(() => useAnnounce());

    act(() => {
      result.current.announce("Urgent message", "assertive");
    });

    expect(result.current.liveRegionProps["aria-live"]).toBe("assertive");
    expect(result.current.liveRegionProps.children).toBe("Urgent message");
  });

  it("defaults to polite mode in liveRegionProps - BLI: EL-339", () => {
    const { result } = renderHook(() => useAnnounce());

    act(() => {
      result.current.announce("Normal message");
    });

    expect(result.current.liveRegionProps["aria-live"]).toBe("polite");
  });

  it("liveRegionProps has correct shape - BLI: EL-339", () => {
    const { result } = renderHook(() => useAnnounce());
    const props = result.current.liveRegionProps;

    expect(props).toHaveProperty("aria-live", "polite");
    expect(props).toHaveProperty("aria-atomic", true);
    expect(props).toHaveProperty("className", "sr-only");
    expect(props).toHaveProperty("children");
  });

  it("liveRegionProps.children reflects current message - BLI: EL-339", () => {
    const { result } = renderHook(() => useAnnounce());

    expect(result.current.liveRegionProps.children).toBe("");

    act(() => {
      result.current.announce("Hello");
    });
    expect(result.current.liveRegionProps.children).toBe("Hello");
  });

  it("cleans up timeout on unmount - BLI: EL-339", () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, "clearTimeout");
    const { result, unmount } = renderHook(() => useAnnounce());

    act(() => {
      result.current.announce("Will unmount");
    });

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });
});

describe("LiveRegion", () => {
  it("renders an invisible live region with the message - BLI: EL-339", () => {
    render(<LiveRegion message="Screen reader text" />);
    const region = screen.getByText("Screen reader text");
    expect(region).toBeInTheDocument();
    expect(region).toHaveAttribute("aria-live", "polite");
    expect(region).toHaveAttribute("aria-atomic", "true");
    expect(region).toHaveClass("sr-only");
  });

  it("renders empty when message is empty - BLI: EL-339", () => {
    const { container } = render(<LiveRegion message="" />);
    const div = container.querySelector('[aria-live="polite"]');
    expect(div).toBeInTheDocument();
    expect(div!.textContent).toBe("");
  });

  it("renders with assertive mode when specified - BLI: EL-339", () => {
    render(<LiveRegion message="Urgent" mode="assertive" />);
    const region = screen.getByText("Urgent");
    expect(region).toHaveAttribute("aria-live", "assertive");
  });
});
