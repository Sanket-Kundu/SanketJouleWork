import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React, { createRef } from "react";
import { TabOverflowButton, TabOverflowButtonProps } from "./TabOverflowButton";
import { TabOverflowMode } from "../../types/tabs";
import {
  stubResizeObserver,
  stubIntersectionObserver,
  setupPopoverPolyfill,
} from "../../test/test-utils";

stubResizeObserver();
stubIntersectionObserver();
setupPopoverPolyfill();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const mockTabs = [
  React.createElement("div", { id: "tab1", text: "Tab 1", key: "tab1" }),
  React.createElement("div", { id: "tab2", text: "Tab 2", key: "tab2" }),
  React.createElement("div", { id: "tab3", text: "Tab 3", key: "tab3" }),
];

function renderOverflowButton(overrides: Partial<TabOverflowButtonProps> = {}) {
  const defaultProps: TabOverflowButtonProps = {
    tabIds: ["tab1", "tab2", "tab3"],
    tabs: mockTabs,
    selectedTabId: null,
    onSelect: vi.fn(),
    position: "end",
    overflowMode: TabOverflowMode.End,
    ...overrides,
  };
  return render(<TabOverflowButton {...defaultProps} />);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("TabOverflowButton", () => {
  it("returns null when tabIds is empty - BLI: EL-339", () => {
    const { container } = renderOverflowButton({ tabIds: [] });
    expect(container.innerHTML).toBe("");
  });

  it('renders button with aria-label "More tabs" for position="end" - BLI: EL-339', () => {
    renderOverflowButton({ position: "end" });
    expect(
      screen.getByRole("button", { name: "More tabs" })
    ).toBeInTheDocument();
  });

  it('renders button with aria-label "More tabs at start" for position="start" - BLI: EL-339', () => {
    renderOverflowButton({ position: "start" });
    expect(
      screen.getByRole("button", { name: "More tabs at start" })
    ).toBeInTheDocument();
  });

  it('label is "More" for position="end" with overflowMode="End" - BLI: EL-339', () => {
    renderOverflowButton({
      position: "end",
      overflowMode: TabOverflowMode.End,
    });
    const btn = screen.getByRole("button", { name: "More tabs" });
    expect(btn.textContent).toContain("More");
  });

  it('label is "+N" for position="end" with overflowMode="StartAndEnd" - BLI: EL-339', () => {
    renderOverflowButton({
      position: "end",
      overflowMode: TabOverflowMode.StartAndEnd,
      tabIds: ["tab1", "tab2"],
    });
    const btn = screen.getByRole("button", { name: "More tabs" });
    expect(btn.textContent).toContain("+2");
  });

  it('label is "+N" for position="start" - BLI: EL-339', () => {
    renderOverflowButton({
      position: "start",
      tabIds: ["tab1", "tab3"],
    });
    const btn = screen.getByRole("button", { name: "More tabs at start" });
    expect(btn.textContent).toContain("+2");
  });

  it("click toggles aria-expanded - BLI: EL-339", async () => {
    const user = userEvent.setup();
    renderOverflowButton();
    const btn = screen.getByRole("button", { name: "More tabs" });
    expect(btn).toHaveAttribute("aria-expanded", "false");
    await user.click(btn);
    expect(btn).toHaveAttribute("aria-expanded", "true");
    await user.click(btn);
    expect(btn).toHaveAttribute("aria-expanded", "false");
  });

  it("ArrowDown opens dropdown (sets aria-expanded=true) - BLI: EL-339", () => {
    renderOverflowButton();
    const btn = screen.getByRole("button", { name: "More tabs" });
    expect(btn).toHaveAttribute("aria-expanded", "false");
    fireEvent.keyDown(btn, { key: "ArrowDown" });
    expect(btn).toHaveAttribute("aria-expanded", "true");
  });

  it('ArrowLeft calls onArrowOut when position="end" - BLI: EL-339', () => {
    const onArrowOut = vi.fn();
    renderOverflowButton({ position: "end", onArrowOut });
    const btn = screen.getByRole("button", { name: "More tabs" });
    fireEvent.keyDown(btn, { key: "ArrowLeft" });
    expect(onArrowOut).toHaveBeenCalledOnce();
  });

  it('ArrowRight calls onArrowOut when position="start" - BLI: EL-339', () => {
    const onArrowOut = vi.fn();
    renderOverflowButton({ position: "start", onArrowOut });
    const btn = screen.getByRole("button", { name: "More tabs at start" });
    fireEvent.keyDown(btn, { key: "ArrowRight" });
    expect(onArrowOut).toHaveBeenCalledOnce();
  });

  it("hasSelectedInOverflow shows primary styling when selectedTabId is in tabIds - BLI: EL-339", () => {
    renderOverflowButton({
      selectedTabId: "tab2",
      tabIds: ["tab1", "tab2", "tab3"],
    });
    const btn = screen.getByRole("button", { name: "More tabs" });
    expect(btn.className).toContain("text-sapphire-text-accent");
    expect(btn.className).toContain("border-sapphire-border-accent");
  });

  it("no primary styling when selectedTabId is not in tabIds - BLI: EL-339", () => {
    renderOverflowButton({
      selectedTabId: "tab99",
      tabIds: ["tab1", "tab2", "tab3"],
    });
    const btn = screen.getByRole("button", { name: "More tabs" });
    expect(btn.className).not.toContain("text-sapphire-text-accent");
  });

  it("customTrigger renders the custom element instead of default button - BLI: EL-339", () => {
    const custom = <button data-testid="custom-trigger">Custom</button>;
    renderOverflowButton({ customTrigger: custom });
    const customBtn = screen.getByTestId("custom-trigger");
    expect(customBtn).toBeInTheDocument();
    expect(customBtn).toHaveAttribute("aria-label", "More tabs");
    expect(customBtn).toHaveAttribute("aria-haspopup", "menu");
  });

  it("ref forwarding via useImperativeHandle - BLI: EL-339", () => {
    const ref = createRef<HTMLButtonElement>();
    const props: TabOverflowButtonProps = {
      tabIds: ["tab1"],
      tabs: mockTabs,
      selectedTabId: null,
      onSelect: vi.fn(),
      position: "end",
      overflowMode: TabOverflowMode.End,
    };
    render(<TabOverflowButton ref={ref} {...props} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
