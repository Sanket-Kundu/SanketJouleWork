import { describe, it, expect, vi } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { Panel } from "./Panel";
import { PanelAccessibleRole, PanelDesign } from "../../types/panel";
import { TitleLevel } from "../../types/title";
import type { PanelRef } from "../../types/panel";

describe("Panel", () => {
  // --- Rendering ---

  it("renders children content - BLI: EL-339", () => {
    render(<Panel noAnimation>Panel content</Panel>);
    expect(screen.getByText("Panel content")).toBeInTheDocument();
  });

  it("renders with data-testid - BLI: EL-339", () => {
    render(<Panel data-testid="panel-1" noAnimation>Test</Panel>);
    expect(screen.getByTestId("panel-1")).toBeInTheDocument();
  });

  it("applies id, className, and style to root - BLI: EL-339", () => {
    render(
      <Panel id="p1" className="custom" style={{ opacity: 0.5 }} noAnimation>
        Content
      </Panel>
    );
    const el = document.getElementById("p1")!;
    expect(el).toBeInTheDocument();
    expect(el.className).toContain("custom");
    expect(el).toHaveStyle({ opacity: "0.5" });
  });

  it("renders with data-part=root on the root element - BLI: EL-339", () => {
    render(<Panel data-testid="p" noAnimation>Root</Panel>);
    expect(screen.getByTestId("p")).toHaveAttribute("data-part", "root");
  });

  // --- Header ---

  it("renders headerText as an h2 by default - BLI: EL-339", () => {
    render(<Panel headerText="My Panel" noAnimation>Content</Panel>);
    expect(screen.getByRole("heading", { level: 2, name: "My Panel" })).toBeInTheDocument();
  });

  it("renders headerText with the specified heading level - BLI: EL-339", () => {
    render(
      <Panel headerText="Section" headerLevel={TitleLevel.H3} noAnimation>
        Content
      </Panel>
    );
    expect(screen.getByRole("heading", { level: 3, name: "Section" })).toBeInTheDocument();
  });

  it.each(Object.values(TitleLevel))(
    "renders headerText with headerLevel=%s",
    (level) => {
      const levelNum = parseInt(level.replace("H", ""), 10);
      render(
        <Panel headerText="Title" headerLevel={level} noAnimation>
          Content
        </Panel>
      );
      expect(screen.getByRole("heading", { level: levelNum })).toBeInTheDocument();
    }
  );

  it("renders custom header slot when header prop is provided - BLI: EL-339", () => {
    render(
      <Panel header={<div data-testid="custom-header">Custom</div>} noAnimation>
        Content
      </Panel>
    );
    expect(screen.getByTestId("custom-header")).toBeInTheDocument();
  });

  it("prefers custom header over headerText - BLI: EL-339", () => {
    render(
      <Panel
        headerText="Text header"
        header={<span data-testid="custom">Custom</span>}
        noAnimation
      >
        Content
      </Panel>
    );
    expect(screen.getByTestId("custom")).toBeInTheDocument();
    expect(screen.queryByText("Text header")).not.toBeInTheDocument();
  });

  it("renders header with data-part=header - BLI: EL-339", () => {
    const { container } = render(
      <Panel headerText="Header" noAnimation>
        Content
      </Panel>
    );
    expect(container.querySelector("[data-part='header']")).toBeInTheDocument();
  });

  // --- Expand/Collapse (uncontrolled) ---

  it("starts expanded by default - BLI: EL-339", () => {
    render(<Panel noAnimation>Content</Panel>);
    expect(screen.getByText("Content")).toBeInTheDocument();
    // Content area should be visible (no display:none)
    const content = document.querySelector("[data-part='content']") as HTMLElement;
    expect(content.style.display).not.toBe("none");
  });

  it("starts collapsed when defaultCollapsed=true - BLI: EL-339", () => {
    render(
      <Panel defaultCollapsed noAnimation>
        Content
      </Panel>
    );
    const content = document.querySelector("[data-part='content']") as HTMLElement;
    expect(content.style.display).toBe("none");
  });

  it("expands when header is clicked while collapsed - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(
      <Panel defaultCollapsed noAnimation headerText="Toggle">
        Content
      </Panel>
    );
    const header = screen.getByRole("button");
    const content = document.querySelector("[data-part='content']") as HTMLElement;
    expect(content.style.display).toBe("none");

    await user.click(header);
    expect(content.style.display).not.toBe("none");
  });

  it("collapses when header is clicked while expanded - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(
      <Panel noAnimation headerText="Toggle">
        Content
      </Panel>
    );
    const header = screen.getByRole("button");
    const content = document.querySelector("[data-part='content']") as HTMLElement;

    await user.click(header);
    expect(content.style.display).toBe("none");
  });

  it("fires onToggle with collapsed=true when collapsing - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleToggle = vi.fn();
    render(
      <Panel noAnimation headerText="Toggle" onToggle={handleToggle}>
        Content
      </Panel>
    );
    await user.click(screen.getByRole("button"));
    expect(handleToggle).toHaveBeenCalledOnce();
    expect(handleToggle).toHaveBeenCalledWith({ collapsed: true });
  });

  it("fires onToggle with collapsed=false when expanding - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleToggle = vi.fn();
    render(
      <Panel noAnimation headerText="Toggle" defaultCollapsed onToggle={handleToggle}>
        Content
      </Panel>
    );
    await user.click(screen.getByRole("button"));
    expect(handleToggle).toHaveBeenCalledWith({ collapsed: false });
  });

  // --- Controlled collapsed ---

  it("respects controlled collapsed=true - BLI: EL-339", () => {
    render(
      <Panel collapsed noAnimation>
        Controlled content
      </Panel>
    );
    const content = document.querySelector("[data-part='content']") as HTMLElement;
    expect(content.style.display).toBe("none");
  });

  it("respects controlled collapsed=false - BLI: EL-339", () => {
    render(
      <Panel collapsed={false} noAnimation>
        Controlled content
      </Panel>
    );
    const content = document.querySelector("[data-part='content']") as HTMLElement;
    expect(content.style.display).not.toBe("none");
  });

  it("fires onToggle when controlled but does not change internal state - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleToggle = vi.fn();
    render(
      <Panel collapsed={false} noAnimation headerText="Controlled" onToggle={handleToggle}>
        Content
      </Panel>
    );
    await user.click(screen.getByRole("button"));
    // onToggle is called but the collapse state does not change (controlled)
    expect(handleToggle).toHaveBeenCalledOnce();
    expect(handleToggle).toHaveBeenCalledWith({ collapsed: true });

    // Content is still visible because caller controls it
    const content = document.querySelector("[data-part='content']") as HTMLElement;
    expect(content.style.display).not.toBe("none");
  });

  it("updates correctly when controlled collapsed prop changes - BLI: EL-339", () => {
    const { rerender } = render(
      <Panel collapsed={false} noAnimation>
        Controlled
      </Panel>
    );
    let content = document.querySelector("[data-part='content']") as HTMLElement;
    expect(content.style.display).not.toBe("none");

    rerender(
      <Panel collapsed noAnimation>
        Controlled
      </Panel>
    );
    content = document.querySelector("[data-part='content']") as HTMLElement;
    expect(content.style.display).toBe("none");
  });

  // --- Fixed ---

  it("does not show toggle icon when fixed - BLI: EL-339", () => {
    render(
      <Panel fixed headerText="Fixed Panel">
        Content
      </Panel>
    );
    // ChevronRight is rendered inside the header only when interactive
    // When fixed, no button role on header
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("does not collapse when header is clicked and fixed - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(
      <Panel fixed headerText="Fixed">
        Content
      </Panel>
    );
    // No button role for the header when fixed
    // Clicking the header div should not collapse
    const header = document.querySelector("[data-part='header']") as HTMLElement;
    await user.click(header);
    const content = document.querySelector("[data-part='content']") as HTMLElement;
    expect(content.style.display).not.toBe("none");
  });

  it("does not call onToggle when fixed - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleToggle = vi.fn();
    render(
      <Panel fixed headerText="Fixed" onToggle={handleToggle}>
        Content
      </Panel>
    );
    const header = document.querySelector("[data-part='header']") as HTMLElement;
    await user.click(header);
    expect(handleToggle).not.toHaveBeenCalled();
  });

  it("always shows content when fixed, even with defaultCollapsed - BLI: EL-339", () => {
    render(
      <Panel fixed defaultCollapsed noAnimation>
        Fixed content
      </Panel>
    );
    const content = document.querySelector("[data-part='content']") as HTMLElement;
    expect(content.style.display).not.toBe("none");
  });

  // --- Keyboard ---

  it("toggles on Enter keypress - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(
      <Panel noAnimation headerText="Keyboard">
        Content
      </Panel>
    );
    const header = screen.getByRole("button");
    header.focus();
    await user.keyboard("{Enter}");
    const content = document.querySelector("[data-part='content']") as HTMLElement;
    expect(content.style.display).toBe("none");
  });

  it("toggles on Space keypress (keyup) - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(
      <Panel noAnimation headerText="Keyboard">
        Content
      </Panel>
    );
    const header = screen.getByRole("button");
    header.focus();
    await user.keyboard(" ");
    const content = document.querySelector("[data-part='content']") as HTMLElement;
    expect(content.style.display).toBe("none");
  });

  it("cancels Space toggle when Escape is pressed between keydown and keyup - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleToggle = vi.fn();
    render(
      <Panel noAnimation headerText="Keyboard" onToggle={handleToggle}>
        Content
      </Panel>
    );
    const header = screen.getByRole("button");
    header.focus();
    // Simulate Space keydown followed by Escape, then Space keyup should not toggle
    await user.keyboard("[Space>]"); // Space held down
    await user.keyboard("[Escape]"); // Cancel
    await user.keyboard("[/Space]"); // Space released
    expect(handleToggle).not.toHaveBeenCalled();
  });

  it("does not toggle on keyboard when fixed - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleToggle = vi.fn();
    render(
      <Panel fixed headerText="Fixed" onToggle={handleToggle}>
        Content
      </Panel>
    );
    // Fixed panels don't have button role; manually focus and fire keyboard
    const header = document.querySelector("[data-part='header']") as HTMLElement;
    header.focus();
    await user.keyboard("{Enter}");
    expect(handleToggle).not.toHaveBeenCalled();
  });

  // --- ARIA / Accessibility ---

  it("header has role=button when interactive - BLI: EL-339", () => {
    render(<Panel headerText="Header" noAnimation>Content</Panel>);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("header has tabIndex=0 when interactive - BLI: EL-339", () => {
    render(<Panel headerText="Header" noAnimation>Content</Panel>);
    expect(screen.getByRole("button")).toHaveAttribute("tabindex", "0");
  });

  it("header has aria-expanded=true when expanded - BLI: EL-339", () => {
    render(<Panel headerText="Expandable" noAnimation>Content</Panel>);
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");
  });

  it("header has aria-expanded=false when collapsed - BLI: EL-339", () => {
    render(
      <Panel headerText="Expandable" defaultCollapsed noAnimation>
        Content
      </Panel>
    );
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "false");
  });

  it("header aria-controls points to content id - BLI: EL-339", () => {
    render(
      <Panel id="test-panel" headerText="Panel" noAnimation>
        Content
      </Panel>
    );
    const header = screen.getByRole("button");
    expect(header).toHaveAttribute("aria-controls", "test-panel-content");
  });

  it("panel root has role=form by default - BLI: EL-339", () => {
    render(<Panel noAnimation>Content</Panel>);
    expect(screen.getByRole("form")).toBeInTheDocument();
  });

  it.each([
    [PanelAccessibleRole.Complementary, "complementary"],
    [PanelAccessibleRole.Form, "form"],
    [PanelAccessibleRole.Region, "region"],
  ])("applies accessibleRole=%s as aria role=%s - BLI: EL-339", (panelRole, ariaRole) => {
    render(
      <Panel accessibleRole={panelRole} accessibleName="Section" noAnimation>
        Content
      </Panel>
    );
    // For "region", the content inner div also has role="region"; use the named one
    const elements = document.querySelectorAll(`[role="${ariaRole}"]`);
    // At least one element with the role should exist
    expect(elements.length).toBeGreaterThanOrEqual(1);
    // The root panel element should have the expected role
    const root = document.querySelector("[data-part='root']")!;
    expect(root).toHaveAttribute("role", ariaRole);
  });

  it("applies aria-label from accessibleName - BLI: EL-339", () => {
    render(
      <Panel accessibleName="My section" noAnimation>
        Content
      </Panel>
    );
    expect(screen.getByRole("form")).toHaveAttribute("aria-label", "My section");
  });

  it("uses aria-labelledby pointing to header when no accessibleName - BLI: EL-339", () => {
    render(
      <Panel id="p2" headerText="Header" noAnimation>
        Content
      </Panel>
    );
    expect(screen.getByRole("form")).toHaveAttribute("aria-labelledby", "p2-header");
  });

  it("does not set aria-labelledby when accessibleName is provided - BLI: EL-339", () => {
    render(
      <Panel accessibleName="Explicit label" headerText="Header" noAnimation>
        Content
      </Panel>
    );
    expect(screen.getByRole("form")).not.toHaveAttribute("aria-labelledby");
  });

  it("content region has role=region - BLI: EL-339", () => {
    render(<Panel noAnimation>Content</Panel>);
    // There may be multiple regions; get the content one by data-part
    const content = document.querySelector("[data-part='content']")!;
    expect(content).toHaveAttribute("role", "region");
  });

  // --- noPadding ---

  it("applies padding classes by default - BLI: EL-339", () => {
    const { container } = render(<Panel noAnimation>Content</Panel>);
    const contentInner = container.querySelector("[data-part='content'] > div")!;
    expect(contentInner.className).toContain("p-4");
  });

  it("removes padding when noPadding is true - BLI: EL-339", () => {
    const { container } = render(<Panel noPadding noAnimation>Content</Panel>);
    const contentInner = container.querySelector("[data-part='content'] > div")!;
    expect(contentInner.className).not.toContain("p-4");
    expect(contentInner.className).not.toContain("p-3");
  });

  // --- stickyHeader ---

  it("applies sticky class to header when stickyHeader is true - BLI: EL-339", () => {
    const { container } = render(
      <Panel stickyHeader headerText="Sticky" noAnimation>
        Content
      </Panel>
    );
    const header = container.querySelector("[data-part='header']")!;
    expect(header.className).toContain("sticky");
  });

  it("does not apply sticky class when stickyHeader is false - BLI: EL-339", () => {
    const { container } = render(
      <Panel headerText="Normal" noAnimation>
        Content
      </Panel>
    );
    const header = container.querySelector("[data-part='header']")!;
    expect(header.className).not.toContain("sticky");
  });

  // --- Ref ---

  it("exposes focus/blur/isFocused/nativeElement via ref - BLI: EL-339", () => {
    const ref = React.createRef<PanelRef>();
    render(
      <Panel ref={ref} headerText="Ref panel" noAnimation>
        Content
      </Panel>
    );

    expect(ref.current).not.toBeNull();
    expect(ref.current!.nativeElement).toBeInstanceOf(HTMLDivElement);

    ref.current!.focus();
    expect(ref.current!.isFocused()).toBe(true);

    ref.current!.blur();
    expect(ref.current!.isFocused()).toBe(false);
  });

  // --- Animation mode ---

  it("renders content immediately without animation when noAnimation is true and collapsing - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(
      <Panel noAnimation headerText="Panel">
        Content
      </Panel>
    );
    await user.click(screen.getByRole("button"));
    const content = document.querySelector("[data-part='content']") as HTMLElement;
    expect(content.style.display).toBe("none");
  });

  it("renders content immediately without animation when noAnimation is true and expanding - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(
      <Panel noAnimation defaultCollapsed headerText="Panel">
        Content
      </Panel>
    );
    await user.click(screen.getByRole("button"));
    const content = document.querySelector("[data-part='content']") as HTMLElement;
    expect(content.style.display).not.toBe("none");
  });

  // --- Animation paths ---

  it("triggers animated collapse (slideUp) when noAnimation is false - BLI: EL-339", () => {
    // Stub rAF to run callbacks synchronously with a progressing timestamp
    const rafCallbacks: FrameRequestCallback[] = [];
    const rafSpy = vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      rafCallbacks.push(cb);
      return rafCallbacks.length;
    });
    const cancelSpy = vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});

    render(
      <Panel headerText="Animated">
        Animated content
      </Panel>
    );
    const header = screen.getByRole("button");
    const content = document.querySelector("[data-part='content']") as HTMLElement;

    // Initially expanded
    expect(content.style.display).not.toBe("none");

    // Click to collapse — queues a rAF callback
    fireEvent.click(header);

    // Run frames to completion (progress = 1 requires elapsed >= 400ms)
    act(() => {
      // First frame: start animation (timestamp = 0)
      const cb1 = rafCallbacks.shift();
      cb1?.(0);
      // Second frame: complete animation (timestamp > 400ms)
      const cb2 = rafCallbacks.shift();
      cb2?.(500);
    });

    rafSpy.mockRestore();
    cancelSpy.mockRestore();

    expect(content.style.display).toBe("none");
  });

  it("triggers animated expand (slideDown) when noAnimation is false - BLI: EL-339", () => {
    let rafCallbacks: FrameRequestCallback[] = [];
    const rafSpy = vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      rafCallbacks.push(cb);
      return rafCallbacks.length;
    });
    const cancelSpy = vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});

    render(
      <Panel headerText="Animated" defaultCollapsed>
        Animated content
      </Panel>
    );
    const header = screen.getByRole("button");
    const content = document.querySelector("[data-part='content']") as HTMLElement;

    expect(content.style.display).toBe("none");

    // Click to expand
    fireEvent.click(header);

    act(() => {
      const cb1 = rafCallbacks.shift();
      cb1?.(0);
      const cb2 = rafCallbacks.shift();
      cb2?.(500);
    });

    rafSpy.mockRestore();
    cancelSpy.mockRestore();

    expect(content.style.display).not.toBe("none");
  });

  it("cancels in-flight animation when toggled again quickly - BLI: EL-339", () => {
    let rafHandle = 0;
    const liveCallbacks = new Map<number, FrameRequestCallback>();
    const cancelledHandles: number[] = [];

    const rafSpy = vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      rafHandle++;
      liveCallbacks.set(rafHandle, cb);
      return rafHandle;
    });
    const cancelSpy = vi.spyOn(window, "cancelAnimationFrame").mockImplementation((h) => {
      cancelledHandles.push(h);
      liveCallbacks.delete(h);
    });

    render(
      <Panel headerText="Animated">
        Content
      </Panel>
    );
    const header = screen.getByRole("button");

    // Start collapse animation — queues rAF
    act(() => { fireEvent.click(header); });

    // Run the first frame so animationRef.current is set to a new handle
    act(() => {
      const [handle, cb] = Array.from(liveCallbacks.entries())[0] ?? [];
      if (cb) {
        liveCallbacks.delete(handle);
        cb(0); // sets start time, re-queues for next frame
      }
    });

    // Click again while animation is in flight — should cancel it
    act(() => { fireEvent.click(header); });

    // cancelAnimationFrame should have been called for the in-flight animation
    expect(cancelledHandles.length).toBeGreaterThan(0);

    rafSpy.mockRestore();
    cancelSpy.mockRestore();
  });

  it("cleanup function cancels animation on unmount - BLI: EL-339", () => {
    const cancelledHandles: number[] = [];
    let rafHandle = 0;

    const rafSpy = vi.spyOn(window, "requestAnimationFrame").mockImplementation((_cb) => {
      rafHandle++;
      return rafHandle;
    });
    const cancelSpy = vi.spyOn(window, "cancelAnimationFrame").mockImplementation((h) => {
      cancelledHandles.push(h);
    });

    const { unmount } = render(
      <Panel headerText="Animated">
        Content
      </Panel>
    );

    // Start animation by clicking
    fireEvent.click(screen.getByRole("button"));

    // Unmount while animation is in-flight
    expect(() => unmount()).not.toThrow();

    // cancelAnimationFrame should have been called during cleanup
    expect(cancelSpy).toHaveBeenCalled();

    rafSpy.mockRestore();
    cancelSpy.mockRestore();
  });

  // --- Without header ---

  it("renders interactive header even without headerText (panel is collapsible) - BLI: EL-339", () => {
    render(<Panel noAnimation>Content</Panel>);
    // The panel still renders an interactive header with a chevron
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("panel without headerText uses aria-labelledby only if header exists - BLI: EL-339", () => {
    render(<Panel id="bare" noAnimation>Content</Panel>);
    // No headerText = no aria-labelledby on root (hasHeader is false for headerText/header)
    const root = document.getElementById("bare")!;
    // Since there's no headerText or custom header, aria-labelledby should not be set
    expect(root).not.toHaveAttribute("aria-labelledby");
  });

  // --- Design Variants ---

  it("renders with Primary design by default", () => {
    const { container } = render(<Panel noAnimation>Content</Panel>);
    const root = container.querySelector("[data-part='root']")!;
    expect(root.className).toContain("bg-sapphire-card-bg-primary");
    expect(root.className).toContain("border");
  });

  it("renders with Secondary design", () => {
    const { container } = render(
      <Panel design={PanelDesign.Secondary} noAnimation>Content</Panel>
    );
    const root = container.querySelector("[data-part='root']")!;
    expect(root.className).toContain("bg-sapphire-background-secondary");
    expect(root.className).toContain("border");
  });

  it("renders with Child design (no border, no background)", () => {
    const { container } = render(
      <Panel design={PanelDesign.Child} noAnimation>Content</Panel>
    );
    const root = container.querySelector("[data-part='root']")!;
    expect(root.className).not.toContain("border");
    expect(root.className).not.toContain("bg-sapphire-card-bg-primary");
    expect(root.className).not.toContain("bg-sapphire-background-secondary");
  });

  it("accepts design as string literal", () => {
    const { container } = render(
      <Panel design="Secondary" noAnimation>Content</Panel>
    );
    const root = container.querySelector("[data-part='root']")!;
    expect(root.className).toContain("bg-sapphire-background-secondary");
  });

  it("falls back to Primary for unknown design value", () => {
    const { container } = render(
      <Panel design={"Unknown" as any} noAnimation>Content</Panel>
    );
    const root = container.querySelector("[data-part='root']")!;
    expect(root.className).toContain("bg-sapphire-card-bg-primary");
  });

  it("renders Child header with rounded-lg", () => {
    const { container } = render(
      <Panel design={PanelDesign.Child} headerText="Child" noAnimation>Content</Panel>
    );
    const header = container.querySelector("[data-part='header']")!;
    expect(header.className).toContain("rounded-lg");
    expect(header.className).not.toContain("rounded-t-lg");
  });

  it("renders Primary header title as text-base", () => {
    const { container } = render(
      <Panel headerText="Title" noAnimation>Content</Panel>
    );
    const heading = container.querySelector("[data-part='header-text']")!;
    expect(heading.className).toContain("text-base");
  });

  it("renders Child header title as text-sm", () => {
    const { container } = render(
      <Panel design={PanelDesign.Child} headerText="Title" noAnimation>Content</Panel>
    );
    const heading = container.querySelector("[data-part='header-text']")!;
    expect(heading.className).toContain("text-sm");
  });

  it("applies p-3 content padding for Child design", () => {
    const { container } = render(
      <Panel design={PanelDesign.Child} noAnimation>Content</Panel>
    );
    const contentInner = container.querySelector("[data-part='content'] > div")!;
    expect(contentInner.className).toContain("p-3");
  });

  // --- Subtitle ---

  it("renders subtitle text below header title", () => {
    const { container } = render(
      <Panel headerText="Title" subtitle="Subtitle text" noAnimation>Content</Panel>
    );
    const sub = container.querySelector("[data-part='header-subtitle']")!;
    expect(sub).toBeInTheDocument();
    expect(sub.textContent).toBe("Subtitle text");
  });

  it("renders subtitle for Child variant", () => {
    const { container } = render(
      <Panel design={PanelDesign.Child} headerText="Title" subtitle="Child sub" noAnimation>Content</Panel>
    );
    const sub = container.querySelector("[data-part='header-subtitle']")!;
    expect(sub).toBeInTheDocument();
    expect(sub.textContent).toBe("Child sub");
  });

  it("does not render subtitle when prop is not provided", () => {
    const { container } = render(
      <Panel headerText="Title" noAnimation>Content</Panel>
    );
    expect(container.querySelector("[data-part='header-subtitle']")).not.toBeInTheDocument();
  });

  it("renders subtitle without headerText", () => {
    const { container } = render(
      <Panel subtitle="Standalone subtitle" noAnimation>Content</Panel>
    );
    const sub = container.querySelector("[data-part='header-subtitle']")!;
    expect(sub).toBeInTheDocument();
    expect(sub.textContent).toBe("Standalone subtitle");
  });

  // --- EndSlot ---

  it("renders endSlot content in header", () => {
    const { container } = render(
      <Panel headerText="Title" endSlot={<span data-testid="end">Action</span>} noAnimation>
        Content
      </Panel>
    );
    expect(screen.getByTestId("end")).toBeInTheDocument();
    expect(container.querySelector("[data-part='header-end-slot']")).toBeInTheDocument();
  });

  it("endSlot click does not toggle panel", async () => {
    const user = userEvent.setup();
    const handleToggle = vi.fn();
    render(
      <Panel
        headerText="Title"
        endSlot={<button data-testid="end-btn">Edit</button>}
        noAnimation
        onToggle={handleToggle}
      >
        Content
      </Panel>
    );
    await user.click(screen.getByTestId("end-btn"));
    expect(handleToggle).not.toHaveBeenCalled();
  });

  it("does not render endSlot when custom header is provided", () => {
    const { container } = render(
      <Panel
        header={<span>Custom</span>}
        endSlot={<span data-testid="end">Action</span>}
        noAnimation
      >
        Content
      </Panel>
    );
    expect(container.querySelector("[data-part='header-end-slot']")).not.toBeInTheDocument();
  });

  it("renders endSlot without headerText", () => {
    const { container } = render(
      <Panel endSlot={<button data-testid="end-btn">Action</button>} noAnimation>
        Content
      </Panel>
    );
    expect(screen.getByTestId("end-btn")).toBeInTheDocument();
    expect(container.querySelector("[data-part='header-end-slot']")).toBeInTheDocument();
  });

  it("endSlot keyboard events do not toggle panel", () => {
    const handleToggle = vi.fn();
    render(
      <Panel
        headerText="Title"
        endSlot={<button data-testid="end-btn">Edit</button>}
        noAnimation
        onToggle={handleToggle}
      >
        Content
      </Panel>
    );
    const btn = screen.getByTestId("end-btn");
    fireEvent.keyDown(btn, { key: "Enter" });
    fireEvent.keyDown(btn, { key: " " });
    fireEvent.keyUp(btn, { key: " " });
    expect(handleToggle).not.toHaveBeenCalled();
  });

  // --- Footer ---

  it("renders footer when expanded", () => {
    const { container } = render(
      <Panel footer={<button>Save</button>} noAnimation>Content</Panel>
    );
    const footer = container.querySelector("[data-part='footer']")!;
    expect(footer).toBeInTheDocument();
    expect(screen.getByText("Save")).toBeInTheDocument();
  });

  it("hides footer when collapsed (inside animated wrapper)", () => {
    const { container } = render(
      <Panel footer={<button>Save</button>} defaultCollapsed noAnimation>Content</Panel>
    );
    const content = document.querySelector("[data-part='content']") as HTMLElement;
    expect(content.style.display).toBe("none");
    // Footer is inside the hidden wrapper, so it should not be visible
    const footer = container.querySelector("[data-part='footer']");
    expect(footer).not.toBeVisible();
  });

  it("does not render footer for Child variant", () => {
    const { container } = render(
      <Panel design={PanelDesign.Child} footer={<button>Save</button>} noAnimation>
        Content
      </Panel>
    );
    expect(container.querySelector("[data-part='footer']")).not.toBeInTheDocument();
  });

  it("renders footer with secondary background for Secondary design", () => {
    const { container } = render(
      <Panel design={PanelDesign.Secondary} footer={<button>Save</button>} noAnimation>
        Content
      </Panel>
    );
    const footer = container.querySelector("[data-part='footer']")!;
    expect(footer.className).toContain("bg-sapphire-card-bg-secondary");
  });

  it("renders footer without background for Primary design", () => {
    const { container } = render(
      <Panel design={PanelDesign.Primary} footer={<button>Save</button>} noAnimation>
        Content
      </Panel>
    );
    const footer = container.querySelector("[data-part='footer']")!;
    expect(footer.className).not.toContain("bg-sapphire-card-bg-secondary");
  });
});
