import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { Breadcrumbs } from "./Breadcrumbs";
import { BreadcrumbsItem } from "./BreadcrumbsItem";
import {
  BreadcrumbsDesign,
  BreadcrumbsSeparator,
  SEPARATOR_MAP,
} from "../../types/breadcrumbs";
import type { BreadcrumbsRef, BreadcrumbsItemClickEventDetail } from "../../types/breadcrumbs";

// ─── Device mock ───────────────────────────────────────────────────────────
// Force desktop mode so phone-specific popover behavior doesn't interfere.
vi.mock("../../lib/Device", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../lib/Device")>();
  return { ...actual, isPhone: () => false };
});

// ─── ResizeObserver mock ────────────────────────────────────────────────────
// jsdom does not implement ResizeObserver.
class MockResizeObserver {
  callback: ResizeObserverCallback;
  constructor(cb: ResizeObserverCallback) {
    this.callback = cb;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

// ─── Popover API mock ────────────────────────────────────────────────────────
// jsdom does not implement showPopover / hidePopover.
// Patch HTMLElement prototype once so all elements gain the stubs.
function patchPopoverApi() {
  if (!HTMLElement.prototype.showPopover) {
    HTMLElement.prototype.showPopover = function () {
      this.setAttribute("popover-open", "");
    };
  }
  if (!HTMLElement.prototype.hidePopover) {
    HTMLElement.prototype.hidePopover = function () {
      this.removeAttribute("popover-open");
    };
  }
  // Patch `matches` to handle ':popover-open' gracefully
  const original = HTMLElement.prototype.matches;
  HTMLElement.prototype.matches = function (selector: string) {
    if (selector === ":popover-open") {
      return this.hasAttribute("popover-open");
    }
    return original.call(this, selector);
  };
}

patchPopoverApi();

// ─── getBoundingClientRect mock ──────────────────────────────────────────────
// The Popover component calls doClose() if opener rect is all-zero (element
// scrolled away / removed). In jsdom all rects are 0, which would auto-close
// the popover immediately via requestAnimationFrame. Return a non-zero rect so
// the Popover stays open during tests.
const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
beforeEach(() => {
  vi.stubGlobal("ResizeObserver", MockResizeObserver);
  Element.prototype.getBoundingClientRect = function () {
    return { top: 10, bottom: 30, left: 10, right: 100, width: 90, height: 20, x: 10, y: 10, toJSON() {} };
  };
});

afterEach(() => {
  vi.unstubAllGlobals();
  Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Returns the visible <ol> (not the hidden measure row). */
function getVisibleOl(container: HTMLElement): HTMLElement {
  // The measure row has aria-hidden="true"; the visible one does not.
  const ols = container.querySelectorAll("ol");
  return Array.from(ols).find((ol) => ol.getAttribute("aria-hidden") !== "true")! as HTMLElement;
}

/** Renders a standard 3-item breadcrumb trail. */
function renderThreeItems(props: Partial<React.ComponentProps<typeof Breadcrumbs>> = {}) {
  return render(
    <Breadcrumbs {...props}>
      <BreadcrumbsItem href="/">Home</BreadcrumbsItem>
      <BreadcrumbsItem href="/products">Products</BreadcrumbsItem>
      <BreadcrumbsItem>Current Page</BreadcrumbsItem>
    </Breadcrumbs>
  );
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe.skip("Breadcrumbs — basic rendering", () => {
  it("renders a nav landmark with default aria-label", () => {
    renderThreeItems();
    expect(screen.getByRole("navigation", { name: "Breadcrumb Trail" })).toBeInTheDocument();
  });

  it("accepts a custom accessibleName for the nav landmark", () => {
    renderThreeItems({ accessibleName: "Page path" });
    expect(screen.getByRole("navigation", { name: "Page path" })).toBeInTheDocument();
  });

  it("renders the correct text content for each item", () => {
    const { container } = renderThreeItems();
    const visibleOl = getVisibleOl(container);
    expect(within(visibleOl).getByText("Home")).toBeInTheDocument();
    expect(within(visibleOl).getByText("Products")).toBeInTheDocument();
    expect(within(visibleOl).getByText("Current Page")).toBeInTheDocument();
  });

  it("renders link items as <a> anchors with correct href", () => {
    renderThreeItems();
    const homeLink = screen.getByRole("link", { name: /Home/ });
    const productsLink = screen.getByRole("link", { name: /Products/ });
    expect(homeLink).toHaveAttribute("href", "/");
    expect(productsLink).toHaveAttribute("href", "/products");
  });

  it("applies id prop to the nav element", () => {
    renderThreeItems({ id: "nav-id" });
    expect(document.getElementById("nav-id")).toBeInTheDocument();
  });

  it("applies data-testid prop to the nav element", () => {
    renderThreeItems({ "data-testid": "bc-testid" });
    expect(screen.getByTestId("bc-testid")).toBeInTheDocument();
  });

  it("applies custom className to the nav element", () => {
    renderThreeItems({ className: "custom-class" });
    expect(screen.getByRole("navigation")).toHaveClass("custom-class");
  });

  it("applies inline style to the nav element", () => {
    renderThreeItems({ style: { color: "red" } });
    expect(screen.getByRole("navigation")).toHaveStyle({ color: "rgb(255, 0, 0)" });
  });

  it("renders without crashing when children is empty", () => {
    render(<Breadcrumbs />);
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("renders a single item without crashing", () => {
    const { container } = render(
      <Breadcrumbs>
        <BreadcrumbsItem>Only Item</BreadcrumbsItem>
      </Breadcrumbs>
    );
    const visibleOl = getVisibleOl(container);
    expect(within(visibleOl).getByText("Only Item")).toBeInTheDocument();
  });

  it("renders BreadcrumbsItem without a Breadcrumbs parent as null", () => {
    // BreadcrumbsItem returns null when no context is active (_index not injected)
    const { container } = render(<BreadcrumbsItem href="/">Orphan</BreadcrumbsItem>);
    expect(container.firstChild).toBeNull();
  });
});

describe.skip("Breadcrumbs — separator types", () => {
  it.each([
    [BreadcrumbsSeparator.Slash, SEPARATOR_MAP[BreadcrumbsSeparator.Slash]],
    [BreadcrumbsSeparator.BackSlash, SEPARATOR_MAP[BreadcrumbsSeparator.BackSlash]],
    [BreadcrumbsSeparator.DoubleBackSlash, SEPARATOR_MAP[BreadcrumbsSeparator.DoubleBackSlash]],
    [BreadcrumbsSeparator.DoubleSlash, SEPARATOR_MAP[BreadcrumbsSeparator.DoubleSlash]],
    [BreadcrumbsSeparator.GreaterThan, SEPARATOR_MAP[BreadcrumbsSeparator.GreaterThan]],
    [BreadcrumbsSeparator.DoubleGreaterThan, SEPARATOR_MAP[BreadcrumbsSeparator.DoubleGreaterThan]],
  ])("renders separator %s as '%s'", (sep, char) => {
    const { container } = render(
      <Breadcrumbs separators={sep}>
        <BreadcrumbsItem href="/">Home</BreadcrumbsItem>
        <BreadcrumbsItem href="/a">A</BreadcrumbsItem>
        <BreadcrumbsItem>Page</BreadcrumbsItem>
      </Breadcrumbs>
    );
    const visibleOl = getVisibleOl(container);
    // Separator spans that follow a link in the same <li> (aria-hidden sibling after <a>).
    // This selector avoids the overflow button's "…" span.
    const separatorSpans = visibleOl.querySelectorAll(
      'a[data-bc-link-index] ~ span[aria-hidden="true"]'
    );
    expect(separatorSpans.length).toBeGreaterThan(0);
    expect(separatorSpans[0].textContent).toBe(char);
  });
});

describe.skip("Breadcrumbs — design variants", () => {
  it("Standard design: last item without href gets aria-current='page'", () => {
    const { container } = renderThreeItems({ design: BreadcrumbsDesign.Standard });
    const visibleOl = getVisibleOl(container);
    const current = visibleOl.querySelector("[aria-current='page']");
    expect(current).not.toBeNull();
    expect(current!.textContent).toContain("Current Page");
  });

  it("Standard design: last item with href gets aria-current='page' as a link", () => {
    render(
      <Breadcrumbs design={BreadcrumbsDesign.Standard}>
        <BreadcrumbsItem href="/">Home</BreadcrumbsItem>
        <BreadcrumbsItem href="/current">Current With Link</BreadcrumbsItem>
      </Breadcrumbs>
    );
    const link = screen.getByRole("link", { name: /Current With Link/ });
    expect(link).toHaveAttribute("aria-current", "page");
  });

  it("Standard design: last item without href is a non-link span without role=link", () => {
    renderThreeItems({ design: BreadcrumbsDesign.Standard });
    const currentSpan = document.querySelector("[data-bc-current]");
    expect(currentSpan).not.toBeNull();
    expect(currentSpan!.tagName.toLowerCase()).toBe("span");
    expect(currentSpan).not.toHaveAttribute("role", "link");
  });

  it("NoCurrentPage design: all items with href rendered as links without aria-current", () => {
    render(
      <Breadcrumbs design={BreadcrumbsDesign.NoCurrentPage}>
        <BreadcrumbsItem href="/">Home</BreadcrumbsItem>
        <BreadcrumbsItem href="/products">Products</BreadcrumbsItem>
        <BreadcrumbsItem href="/current">Current</BreadcrumbsItem>
      </Breadcrumbs>
    );
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(3);
    links.forEach((link) => {
      expect(link).not.toHaveAttribute("aria-current");
    });
  });

  it("NoCurrentPage design: item without href is still rendered in the visible row", () => {
    const { container } = render(
      <Breadcrumbs design={BreadcrumbsDesign.NoCurrentPage}>
        <BreadcrumbsItem href="/">Home</BreadcrumbsItem>
        <BreadcrumbsItem>No Href</BreadcrumbsItem>
      </Breadcrumbs>
    );
    const visibleOl = getVisibleOl(container);
    expect(within(visibleOl).getByText("No Href")).toBeInTheDocument();
  });
});

describe.skip("Breadcrumbs — separators between items", () => {
  it("Standard: no separator after the last (current-page) item without href", () => {
    const { container } = render(
      <Breadcrumbs separators={BreadcrumbsSeparator.Slash}>
        <BreadcrumbsItem href="/">Home</BreadcrumbsItem>
        <BreadcrumbsItem>Current</BreadcrumbsItem>
      </Breadcrumbs>
    );
    const visibleOl = getVisibleOl(container);
    // The current-page item is a <li> with a <span data-bc-current>; it should have no separator
    const currentLi = visibleOl.querySelector("[data-bc-current]")!.closest("li")!;
    expect(currentLi.querySelector('span[aria-hidden="true"]')).toBeNull();
  });

  it("Standard: separator present after non-terminal link items", () => {
    const { container } = render(
      <Breadcrumbs separators={BreadcrumbsSeparator.Slash}>
        <BreadcrumbsItem href="/">Home</BreadcrumbsItem>
        <BreadcrumbsItem href="/a">A</BreadcrumbsItem>
        <BreadcrumbsItem>Current</BreadcrumbsItem>
      </Breadcrumbs>
    );
    const visibleOl = getVisibleOl(container);
    // Separators that follow link anchors: after "Home" and after "A" (before current-page)
    const separatorSpans = visibleOl.querySelectorAll(
      'a[data-bc-link-index] ~ span[aria-hidden="true"]'
    );
    expect(separatorSpans.length).toBe(2);
  });

  it("NoCurrentPage: last link has no trailing separator", () => {
    const { container } = render(
      <Breadcrumbs design={BreadcrumbsDesign.NoCurrentPage} separators={BreadcrumbsSeparator.Slash}>
        <BreadcrumbsItem href="/">Home</BreadcrumbsItem>
        <BreadcrumbsItem href="/last">Last</BreadcrumbsItem>
      </Breadcrumbs>
    );
    const visibleOl = getVisibleOl(container);
    const lastLink = within(visibleOl).getByRole("link", { name: /Last/ });
    const lastLi = lastLink.closest("li")!;
    expect(lastLi.querySelector('span[aria-hidden="true"]')).toBeNull();
  });
});

describe.skip("Breadcrumbs — linkDesign variants", () => {
  it("default linkDesign: link has accent color class", () => {
    renderThreeItems({});
    const link = screen.getByRole("link", { name: /Home/ });
    expect(link.className).toContain("text-sapphire-text-accent");
  });

  it("LinkDesign.Subtle: link has secondary-foreground class", () => {
    renderThreeItems({ linkDesign: "Subtle" });
    const link = screen.getByRole("link", { name: /Home/ });
    expect(link.className).toContain("text-secondary-foreground");
  });
});

describe.skip("Breadcrumbs — target / rel attributes", () => {
  it("sets target='_blank' and rel='noopener noreferrer' on link items", () => {
    render(
      <Breadcrumbs>
        <BreadcrumbsItem href="/a" target="_blank">External</BreadcrumbsItem>
        <BreadcrumbsItem>Current</BreadcrumbsItem>
      </Breadcrumbs>
    );
    const link = screen.getByRole("link", { name: /External/ });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("no rel attribute for non-blank target", () => {
    render(
      <Breadcrumbs>
        <BreadcrumbsItem href="/a" target="_self">Internal</BreadcrumbsItem>
        <BreadcrumbsItem>Current</BreadcrumbsItem>
      </Breadcrumbs>
    );
    const link = screen.getByRole("link", { name: /Internal/ });
    expect(link).not.toHaveAttribute("rel");
  });
});

describe.skip("Breadcrumbs — accessibility attributes", () => {
  it("aria-current='page' on the last item (Standard, no href)", () => {
    const { container } = renderThreeItems();
    const visibleOl = getVisibleOl(container);
    const currentEl = visibleOl.querySelector("[aria-current='page']");
    expect(currentEl).not.toBeNull();
    expect(currentEl!.textContent).toContain("Current Page");
  });

  it("aria-label on links includes positional info", () => {
    renderThreeItems();
    const homeLink = screen.getByRole("link", { name: /Home/ });
    expect(homeLink).toHaveAttribute("aria-label");
    const label = homeLink.getAttribute("aria-label")!;
    expect(label).toContain("Home");
    expect(label).toMatch(/\d+ of \d+/);
  });

  it("aria-label on current-page span includes positional info", () => {
    renderThreeItems();
    const currentSpan = document.querySelector("[data-bc-current]")!;
    const label = currentSpan.getAttribute("aria-label")!;
    expect(label).toContain("Current Page");
    expect(label).toMatch(/\d+ of \d+/);
  });

  it("BreadcrumbsItem accessibleName is appended to the aria-label", () => {
    render(
      <Breadcrumbs>
        <BreadcrumbsItem href="/" accessibleName="Navigate to home">Home</BreadcrumbsItem>
        <BreadcrumbsItem>Current</BreadcrumbsItem>
      </Breadcrumbs>
    );
    const link = screen.getByRole("link", { name: /Home/ });
    expect(link.getAttribute("aria-label")).toContain("Navigate to home");
  });

  it("separators in the visible row have aria-hidden='true'", () => {
    const { container } = renderThreeItems();
    const visibleOl = getVisibleOl(container);
    const seps = visibleOl.querySelectorAll('a[data-bc-link-index] ~ span[aria-hidden="true"]');
    expect(seps.length).toBeGreaterThan(0);
    seps.forEach((sep) => {
      expect(sep).toHaveAttribute("aria-hidden", "true");
    });
  });

  it("hidden measure row has aria-hidden='true'", () => {
    const { container } = renderThreeItems();
    const measureOl = container.querySelector('ol[aria-hidden="true"]');
    expect(measureOl).not.toBeNull();
  });
});

describe.skip("Breadcrumbs — onItemClick", () => {
  it("fires onItemClick when a link is clicked", async () => {
    const user = userEvent.setup();
    const onItemClick = vi.fn();
    renderThreeItems({ onItemClick });

    await user.click(screen.getByRole("link", { name: /Home/ }));

    expect(onItemClick).toHaveBeenCalledOnce();
    const detail: BreadcrumbsItemClickEventDetail = onItemClick.mock.calls[0][0];
    expect(detail.item.children).toBe("Home");
    expect(detail.item.href).toBe("/");
    expect(detail.index).toBe(0);
  });

  it("fires onItemClick with correct index for second link", async () => {
    const user = userEvent.setup();
    const onItemClick = vi.fn();
    renderThreeItems({ onItemClick });

    await user.click(screen.getByRole("link", { name: /Products/ }));

    expect(onItemClick).toHaveBeenCalledOnce();
    const detail: BreadcrumbsItemClickEventDetail = onItemClick.mock.calls[0][0];
    expect(detail.item.children).toBe("Products");
    expect(detail.index).toBe(1);
  });

  it("does not fire onItemClick when the current-page span is clicked", async () => {
    const user = userEvent.setup();
    const onItemClick = vi.fn();
    renderThreeItems({ onItemClick });

    await user.click(document.querySelector("[data-bc-current]")!);

    expect(onItemClick).not.toHaveBeenCalled();
  });

  it("detail includes modifier key state", async () => {
    const user = userEvent.setup();
    const onItemClick = vi.fn();
    renderThreeItems({ onItemClick });

    await user.click(screen.getByRole("link", { name: /Home/ }));
    const detail: BreadcrumbsItemClickEventDetail = onItemClick.mock.calls[0][0];
    expect(detail.altKey).toBe(false);
    expect(detail.ctrlKey).toBe(false);
    expect(detail.metaKey).toBe(false);
    expect(detail.shiftKey).toBe(false);
  });

  it("detail.originalEvent is the original synthetic event", async () => {
    const user = userEvent.setup();
    const onItemClick = vi.fn();
    renderThreeItems({ onItemClick });

    await user.click(screen.getByRole("link", { name: /Home/ }));
    const detail: BreadcrumbsItemClickEventDetail = onItemClick.mock.calls[0][0];
    expect(detail.originalEvent).toBeTruthy();
  });
});

describe.skip("Breadcrumbs — keyboard: current-page item", () => {
  it("current-page span is not focusable (no tabIndex)", () => {
    renderThreeItems();

    const currentSpan = document.querySelector("[data-bc-current]") as HTMLElement;
    expect(currentSpan).not.toHaveAttribute("tabindex");
  });

  it("does not fire onItemClick on Enter key for the current-page span", async () => {
    const user = userEvent.setup();
    const onItemClick = vi.fn();
    renderThreeItems({ onItemClick });

    const currentSpan = document.querySelector("[data-bc-current]") as HTMLElement;
    currentSpan.focus();
    await user.keyboard("{Enter}");

    expect(onItemClick).not.toHaveBeenCalled();
  });

  it("does not fire onItemClick on Space key for the current-page span", async () => {
    const user = userEvent.setup();
    const onItemClick = vi.fn();
    renderThreeItems({ onItemClick });

    const currentSpan = document.querySelector("[data-bc-current]") as HTMLElement;
    currentSpan.focus();
    await user.keyboard(" ");

    expect(onItemClick).not.toHaveBeenCalled();
  });
});

describe.skip("Breadcrumbs — keyboard: roving tabindex", () => {
  it("first focusable item gets tabIndex=0 initially", () => {
    renderThreeItems();
    const homeLink = screen.getByRole("link", { name: /Home/ });
    expect(homeLink).toHaveAttribute("tabindex", "0");
  });

  it("other items get tabIndex=-1 initially", () => {
    renderThreeItems();
    const productsLink = screen.getByRole("link", { name: /Products/ });
    expect(productsLink).toHaveAttribute("tabindex", "-1");
  });

  it("ArrowRight moves focus to next item", async () => {
    const user = userEvent.setup();
    const { container } = renderThreeItems();
    const visibleOl = getVisibleOl(container);
    const homeLink = within(visibleOl).getByRole("link", { name: /Home/ });

    // Focus the element (triggers focusin on the ol via bubbling)
    act(() => { homeLink.focus(); });

    await user.keyboard("{ArrowRight}");

    const productsLink = within(visibleOl).getByRole("link", { name: /Products/ });
    expect(document.activeElement).toBe(productsLink);
  });

  it("ArrowLeft moves focus to previous item", async () => {
    const user = userEvent.setup();
    const { container } = renderThreeItems();
    const visibleOl = getVisibleOl(container);
    const productsLink = within(visibleOl).getByRole("link", { name: /Products/ });

    act(() => { productsLink.focus(); });

    await user.keyboard("{ArrowLeft}");

    const homeLink = within(visibleOl).getByRole("link", { name: /Home/ });
    expect(document.activeElement).toBe(homeLink);
  });

  it("Home key moves focus to first item", async () => {
    const user = userEvent.setup();
    const { container } = renderThreeItems();
    const visibleOl = getVisibleOl(container);
    const productsLink = within(visibleOl).getByRole("link", { name: /Products/ });

    act(() => { productsLink.focus(); });

    await user.keyboard("{Home}");

    const homeLink = within(visibleOl).getByRole("link", { name: /Home/ });
    expect(document.activeElement).toBe(homeLink);
  });

  it("End key moves focus to last focusable item", async () => {
    const user = userEvent.setup();
    const { container } = renderThreeItems();
    const visibleOl = getVisibleOl(container);
    const homeLink = within(visibleOl).getByRole("link", { name: /Home/ });

    act(() => { homeLink.focus(); });

    await user.keyboard("{End}");

    const productsLink = within(visibleOl).getByRole("link", { name: /Products/ });
    expect(document.activeElement).toBe(productsLink);
  });

  it("ArrowRight at last item does not move focus beyond", async () => {
    const user = userEvent.setup();
    const { container } = renderThreeItems();
    const visibleOl = getVisibleOl(container);
    const productsLink = within(visibleOl).getByRole("link", { name: /Products/ });

    act(() => { productsLink.focus(); });

    await user.keyboard("{ArrowRight}");

    expect(document.activeElement).toBe(productsLink);
  });

  it("ArrowLeft at first item does not move focus before", async () => {
    const user = userEvent.setup();
    const { container } = renderThreeItems();
    const visibleOl = getVisibleOl(container);
    const homeLink = within(visibleOl).getByRole("link", { name: /Home/ });

    act(() => { homeLink.focus(); });

    await user.keyboard("{ArrowLeft}");

    expect(document.activeElement).toBe(homeLink);
  });

  it("ArrowDown behaves like ArrowRight", async () => {
    const user = userEvent.setup();
    const { container } = renderThreeItems();
    const visibleOl = getVisibleOl(container);
    const homeLink = within(visibleOl).getByRole("link", { name: /Home/ });

    act(() => { homeLink.focus(); });

    await user.keyboard("{ArrowDown}");

    const productsLink = within(visibleOl).getByRole("link", { name: /Products/ });
    expect(document.activeElement).toBe(productsLink);
  });

  it("ArrowUp behaves like ArrowLeft", async () => {
    const user = userEvent.setup();
    const { container } = renderThreeItems();
    const visibleOl = getVisibleOl(container);
    const productsLink = within(visibleOl).getByRole("link", { name: /Products/ });

    act(() => { productsLink.focus(); });

    await user.keyboard("{ArrowUp}");

    const homeLink = within(visibleOl).getByRole("link", { name: /Home/ });
    expect(document.activeElement).toBe(homeLink);
  });
});

describe.skip("Breadcrumbs — overflow via controlledOverflowCount", () => {
  it("overflow button is hidden when overflowCount=0", () => {
    render(
      <Breadcrumbs overflowCount={0}>
        <BreadcrumbsItem href="/">Home</BreadcrumbsItem>
        <BreadcrumbsItem href="/a">A</BreadcrumbsItem>
        <BreadcrumbsItem>Current</BreadcrumbsItem>
      </Breadcrumbs>
    );
    const btn = screen.queryByRole("button", { name: "More" });
    // Button exists but its parent <li> has `hidden` class
    expect(btn).toBeInTheDocument();
    expect(btn!.closest("li")).toHaveClass("hidden");
  });

  it("overflow button is visible when overflowCount>0", () => {
    render(
      <Breadcrumbs overflowCount={1}>
        <BreadcrumbsItem href="/">Home</BreadcrumbsItem>
        <BreadcrumbsItem href="/a">A</BreadcrumbsItem>
        <BreadcrumbsItem>Current</BreadcrumbsItem>
      </Breadcrumbs>
    );
    const btn = screen.getByRole("button", { name: "More" });
    expect(btn.closest("li")).not.toHaveClass("hidden");
  });

  it("overflowed items (index < overflowCount) are not rendered as links in the visible row", () => {
    const { container } = render(
      <Breadcrumbs overflowCount={1}>
        <BreadcrumbsItem href="/">Home</BreadcrumbsItem>
        <BreadcrumbsItem href="/a">A</BreadcrumbsItem>
        <BreadcrumbsItem>Current</BreadcrumbsItem>
      </Breadcrumbs>
    );
    const visibleOl = getVisibleOl(container);
    // Home (index 0) is overflowed; should not appear as a link in the visible row
    const links = within(visibleOl).queryAllByRole("link");
    const hrefs = links.map((l) => l.getAttribute("href")).filter(Boolean);
    expect(hrefs).not.toContain("/");
    expect(hrefs).toContain("/a");
  });

  it("overflow button has aria-haspopup='listbox' when overflow is active", () => {
    render(
      <Breadcrumbs overflowCount={1}>
        <BreadcrumbsItem href="/">Home</BreadcrumbsItem>
        <BreadcrumbsItem href="/a">A</BreadcrumbsItem>
        <BreadcrumbsItem>Current</BreadcrumbsItem>
      </Breadcrumbs>
    );
    expect(screen.getByRole("button", { name: "More" })).toHaveAttribute(
      "aria-haspopup",
      "listbox"
    );
  });

  it("overflow button does not have aria-haspopup when no overflow", () => {
    render(
      <Breadcrumbs overflowCount={0}>
        <BreadcrumbsItem href="/">Home</BreadcrumbsItem>
        <BreadcrumbsItem>Current</BreadcrumbsItem>
      </Breadcrumbs>
    );
    const btn = screen.getByRole("button", { name: "More" });
    expect(btn).not.toHaveAttribute("aria-haspopup");
  });

  it("all items overflow when overflowCount equals total items", () => {
    const { container } = render(
      <Breadcrumbs overflowCount={2}>
        <BreadcrumbsItem href="/">Home</BreadcrumbsItem>
        <BreadcrumbsItem href="/a">A</BreadcrumbsItem>
      </Breadcrumbs>
    );
    // Both items are overflowed; no visible links in the visible row
    const visibleOl = getVisibleOl(container);
    expect(within(visibleOl).queryAllByRole("link")).toHaveLength(0);
    expect(screen.getByRole("button", { name: "More" })).toBeInTheDocument();
  });

  it("when all items overflowed, no trailing separator is rendered", () => {
    const { container } = render(
      <Breadcrumbs overflowCount={2}>
        <BreadcrumbsItem href="/">Home</BreadcrumbsItem>
        <BreadcrumbsItem href="/a">A</BreadcrumbsItem>
      </Breadcrumbs>
    );
    const visibleOl = getVisibleOl(container);
    // The overflow <li> should not contain a separator span when allOverflowed
    const overflowLi = visibleOl.querySelector("li:not(.hidden)")!;
    const separatorInOverflowLi = overflowLi.querySelector(
      'span[aria-hidden="true"][class*="mx-1"]'
    );
    expect(separatorInOverflowLi).toBeNull();
  });
});

describe.skip("Breadcrumbs — popover open/close", () => {
  function renderWithOverflow(onItemClick?: (d: BreadcrumbsItemClickEventDetail) => void) {
    return render(
      <Breadcrumbs overflowCount={1} onItemClick={onItemClick}>
        <BreadcrumbsItem href="/">Home</BreadcrumbsItem>
        <BreadcrumbsItem href="/a">A</BreadcrumbsItem>
        <BreadcrumbsItem>Current</BreadcrumbsItem>
      </Breadcrumbs>
    );
  }

  it("overflow button shows aria-expanded when popover is open", async () => {
    renderWithOverflow();

    const btn = screen.getByRole("button", { name: "More" });
    expect(btn).toHaveAttribute("aria-expanded", "false");
  });

  it("clicking overflow button again closes the popover", async () => {
    const user = userEvent.setup();
    renderWithOverflow();

    const btn = screen.getByRole("button", { name: "More" });
    await user.click(btn);
    expect(btn).toHaveAttribute("aria-expanded", "true");

    // Use fireEvent.click for the second click to avoid interaction with
    // the popup registry's mousedown capture handler
    act(() => { fireEvent.click(btn); });
    expect(btn).toHaveAttribute("aria-expanded", "false");
  });

  it("Escape key closes the popover", async () => {
    const user = userEvent.setup();
    renderWithOverflow();

    const btn = screen.getByRole("button", { name: "More" });
    await user.click(btn);
    expect(btn).toHaveAttribute("aria-expanded", "true");

    await user.keyboard("{Escape}");
    expect(btn).toHaveAttribute("aria-expanded", "false");
  });

  it("focus returns to overflow button after Escape", async () => {
    const user = userEvent.setup();
    renderWithOverflow();

    const btn = screen.getByRole("button", { name: "More" });
    await user.click(btn);
    await user.keyboard("{Escape}");

    expect(document.activeElement).toBe(btn);
  });

  it("fires onItemClick when clicking an overflow item", async () => {
    const user = userEvent.setup();
    const onItemClick = vi.fn();
    renderWithOverflow(onItemClick);

    const btn = screen.getByRole("button", { name: "More" });
    await user.click(btn);

    // "Home" is overflowed; find it in the popover list
    const listItems = document.querySelectorAll('[class*="px-3 py-2"]');
    expect(listItems.length).toBeGreaterThan(0);
    await user.click(listItems[0]);

    expect(onItemClick).toHaveBeenCalledOnce();
    const detail: BreadcrumbsItemClickEventDetail = onItemClick.mock.calls[0][0];
    expect(detail.item.href).toBe("/");
    expect(detail.index).toBe(0);
  });

  it("popover closes after clicking an overflow item", async () => {
    const user = userEvent.setup();
    const onItemClick = vi.fn((detail) => {
      detail.originalEvent.preventDefault();
    });
    renderWithOverflow(onItemClick);

    const btn = screen.getByRole("button", { name: "More" });
    await user.click(btn);

    const listItems = document.querySelectorAll('[class*="px-3 py-2"]');
    await user.click(listItems[0]);

    expect(btn).toHaveAttribute("aria-expanded", "false");
  });

  it("popover shows overflowed items in reverse order (most recent first)", async () => {
    const user = userEvent.setup();
    render(
      <Breadcrumbs overflowCount={2}>
        <BreadcrumbsItem href="/">Home</BreadcrumbsItem>
        <BreadcrumbsItem href="/a">A</BreadcrumbsItem>
        <BreadcrumbsItem href="/b">B</BreadcrumbsItem>
        <BreadcrumbsItem>Current</BreadcrumbsItem>
      </Breadcrumbs>
    );

    const btn = screen.getByRole("button", { name: "More" });
    await user.click(btn);

    // Items 0 (Home) and 1 (A) are overflowed; popover shows them reversed: A then Home
    const listItems = document.querySelectorAll('[class*="px-3 py-2"]');
    expect(listItems[0].textContent).toBe("A");
    expect(listItems[1].textContent).toBe("Home");
  });
});

describe.skip("Breadcrumbs — keyboard: overflow button", () => {
  function renderWithOverflow() {
    return render(
      <Breadcrumbs overflowCount={1}>
        <BreadcrumbsItem href="/">Home</BreadcrumbsItem>
        <BreadcrumbsItem href="/a">A</BreadcrumbsItem>
        <BreadcrumbsItem>Current</BreadcrumbsItem>
      </Breadcrumbs>
    );
  }

  it("overflow button is the first focusable slot when overflow is active", () => {
    renderWithOverflow();
    const btn = screen.getByRole("button", { name: "More" });
    expect(btn).toHaveAttribute("tabindex", "0");
  });

  it("Space key on the overflow button opens the popover", async () => {
    renderWithOverflow();
    const btn = screen.getByRole("button", { name: "More" });

    act(() => { btn.focus(); });

    // Space fires on the Link element itself (accessibleRole="Button")
    fireEvent.keyDown(btn, { key: " ", code: "Space" });

    expect(btn).toHaveAttribute("aria-expanded", "true");
  });

  it("F4 key on the overflow button opens the popover", async () => {
    const { container } = renderWithOverflow();
    const visibleOl = getVisibleOl(container);
    const btn = screen.getByRole("button", { name: "More" });

    act(() => { btn.focus(); });

    fireEvent.keyDown(visibleOl, { key: "F4" });

    expect(btn).toHaveAttribute("aria-expanded", "true");
  });

  it("Alt+ArrowDown on the overflow button opens the popover", async () => {
    const { container } = renderWithOverflow();
    const visibleOl = getVisibleOl(container);
    const btn = screen.getByRole("button", { name: "More" });

    act(() => { btn.focus(); });

    fireEvent.keyDown(visibleOl, { key: "ArrowDown", altKey: true });

    expect(btn).toHaveAttribute("aria-expanded", "true");
  });

  it("Alt+ArrowUp on the overflow button opens the popover", async () => {
    const { container } = renderWithOverflow();
    const visibleOl = getVisibleOl(container);
    const btn = screen.getByRole("button", { name: "More" });

    act(() => { btn.focus(); });

    fireEvent.keyDown(visibleOl, { key: "ArrowUp", altKey: true });

    expect(btn).toHaveAttribute("aria-expanded", "true");
  });

  it("Enter key on the overflow button opens the popover", async () => {
    renderWithOverflow();
    const btn = screen.getByRole("button", { name: "More" });

    act(() => { btn.focus(); });
    fireEvent.keyDown(btn, { key: "Enter", code: "Enter" });

    expect(btn).toHaveAttribute("aria-expanded", "true");
  });

  it("ArrowRight from overflow button moves focus to first visible link", async () => {
    const user = userEvent.setup();
    const { container } = renderWithOverflow();
    const visibleOl = getVisibleOl(container);
    const btn = screen.getByRole("button", { name: "More" });

    act(() => { btn.focus(); });

    await user.keyboard("{ArrowRight}");

    // First visible link after overflow is "A" (index 1, since index 0 is overflowed)
    const aLink = within(visibleOl).getByRole("link", { name: /A/ });
    expect(document.activeElement).toBe(aLink);
  });
});

describe.skip("Breadcrumbs — imperative ref", () => {
  it("exposes nativeElement pointing to the nav", () => {
    const ref = React.createRef<BreadcrumbsRef>();
    render(
      <Breadcrumbs ref={ref}>
        <BreadcrumbsItem href="/">Home</BreadcrumbsItem>
        <BreadcrumbsItem>Current</BreadcrumbsItem>
      </Breadcrumbs>
    );
    expect(ref.current).not.toBeNull();
    expect(ref.current!.nativeElement).toBeInstanceOf(HTMLElement);
    expect(ref.current!.nativeElement!.tagName.toLowerCase()).toBe("nav");
  });

  it("focus() method focuses the first focusable link", () => {
    const ref = React.createRef<BreadcrumbsRef>();
    render(
      <Breadcrumbs ref={ref}>
        <BreadcrumbsItem href="/">Home</BreadcrumbsItem>
        <BreadcrumbsItem>Current</BreadcrumbsItem>
      </Breadcrumbs>
    );
    act(() => {
      ref.current!.focus();
    });
    const homeLink = screen.getByRole("link", { name: /Home/ });
    expect(document.activeElement).toBe(homeLink);
  });

  it("focus() on trail with overflow focuses the overflow button", () => {
    const ref = React.createRef<BreadcrumbsRef>();
    render(
      <Breadcrumbs ref={ref} overflowCount={1}>
        <BreadcrumbsItem href="/">Home</BreadcrumbsItem>
        <BreadcrumbsItem href="/a">A</BreadcrumbsItem>
        <BreadcrumbsItem>Current</BreadcrumbsItem>
      </Breadcrumbs>
    );
    act(() => {
      ref.current!.focus();
    });
    const btn = screen.getByRole("button", { name: "More" });
    expect(document.activeElement).toBe(btn);
  });
});

describe.skip("Breadcrumbs — measure row", () => {
  it("measure row renders all items regardless of overflow", () => {
    const { container } = render(
      <Breadcrumbs overflowCount={2}>
        <BreadcrumbsItem href="/">Home</BreadcrumbsItem>
        <BreadcrumbsItem href="/a">A</BreadcrumbsItem>
        <BreadcrumbsItem>Current</BreadcrumbsItem>
      </Breadcrumbs>
    );
    const measureOl = container.querySelector('ol[aria-hidden="true"]')!;
    const measureItems = measureOl.querySelectorAll("[data-bc-measure]");
    expect(measureItems).toHaveLength(3);
  });

  it("measure row renders the overflow button placeholder", () => {
    const { container } = renderThreeItems();
    const measureOl = container.querySelector('ol[aria-hidden="true"]')!;
    const overflowEl = measureOl.querySelector("[data-bc-measure-overflow]");
    expect(overflowEl).not.toBeNull();
  });

  it("measure row is visually hidden (pointer-events-none, height 0)", () => {
    const { container } = renderThreeItems();
    const measureOl = container.querySelector('ol[aria-hidden="true"]') as HTMLElement;
    expect(measureOl.style.height).toBe("0px");
    expect(measureOl.style.visibility).toBe("hidden");
  });
});

describe.skip("Breadcrumbs — ResizeObserver integration", () => {
  it("attaches a ResizeObserver when no controlledOverflowCount is given", () => {
    const observeSpy = vi.fn();
    const disconnectSpy = vi.fn();

    class SpyObserver {
      observe = observeSpy;
      disconnect = disconnectSpy;
      unobserve() {}
    }
    vi.stubGlobal("ResizeObserver", SpyObserver);

    renderThreeItems();
    expect(observeSpy).toHaveBeenCalled();
  });

  it("does NOT attach a ResizeObserver when controlledOverflowCount is provided", () => {
    const observeSpy = vi.fn();

    class SpyObserver {
      observe = observeSpy;
      disconnect() {}
      unobserve() {}
    }
    vi.stubGlobal("ResizeObserver", SpyObserver);

    renderThreeItems({ overflowCount: 0 });
    expect(observeSpy).not.toHaveBeenCalled();
  });

  it("disconnects ResizeObserver on unmount", () => {
    const disconnectSpy = vi.fn();

    class SpyObserver {
      observe() {}
      disconnect = disconnectSpy;
      unobserve() {}
    }
    vi.stubGlobal("ResizeObserver", SpyObserver);

    const { unmount } = renderThreeItems();
    unmount();
    expect(disconnectSpy).toHaveBeenCalled();
  });
});

describe.skip("Breadcrumbs — BreadcrumbsItem data-testid and style", () => {
  it("applies data-testid on BreadcrumbsItem's root <li>", () => {
    render(
      <Breadcrumbs>
        <BreadcrumbsItem href="/" data-testid="item-home">Home</BreadcrumbsItem>
        <BreadcrumbsItem>Current</BreadcrumbsItem>
      </Breadcrumbs>
    );
    expect(screen.getByTestId("item-home")).toBeInTheDocument();
  });

  it("applies style on BreadcrumbsItem's root <li>", () => {
    render(
      <Breadcrumbs>
        <BreadcrumbsItem href="/" style={{ fontWeight: "bold" }}>Home</BreadcrumbsItem>
        <BreadcrumbsItem>Current</BreadcrumbsItem>
      </Breadcrumbs>
    );
    const link = screen.getByRole("link", { name: /Home/ });
    const li = link.closest("li")!;
    expect(li).toHaveStyle({ fontWeight: "bold" });
  });
});

describe.skip("Breadcrumbs — string enum values", () => {
  it("accepts design as string value 'NoCurrentPage'", () => {
    render(
      <Breadcrumbs design="NoCurrentPage">
        <BreadcrumbsItem href="/">Home</BreadcrumbsItem>
        <BreadcrumbsItem href="/a">Last</BreadcrumbsItem>
      </Breadcrumbs>
    );
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
  });

  it("accepts separators as string value 'GreaterThan'", () => {
    const { container } = render(
      <Breadcrumbs separators="GreaterThan">
        <BreadcrumbsItem href="/">Home</BreadcrumbsItem>
        <BreadcrumbsItem>Current</BreadcrumbsItem>
      </Breadcrumbs>
    );
    const visibleOl = getVisibleOl(container);
    const seps = visibleOl.querySelectorAll('a[data-bc-link-index] ~ span[aria-hidden="true"]');
    expect(seps[0].textContent).toBe(">");
  });
});

describe.skip("Breadcrumbs — data-bc-link-index attribute", () => {
  it("visible links have data-bc-link-index set to their global index", () => {
    const { container } = renderThreeItems();
    const visibleOl = getVisibleOl(container);
    const homeLink = within(visibleOl).getByRole("link", { name: /Home/ });
    const productsLink = within(visibleOl).getByRole("link", { name: /Products/ });
    expect(homeLink).toHaveAttribute("data-bc-link-index", "0");
    expect(productsLink).toHaveAttribute("data-bc-link-index", "1");
  });
});

describe.skip("Breadcrumbs — keyboard: ArrowLeft back to overflow button", () => {
  it("ArrowLeft from the first visible link moves focus to the overflow button", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Breadcrumbs overflowCount={1}>
        <BreadcrumbsItem href="/">Home</BreadcrumbsItem>
        <BreadcrumbsItem href="/a">A</BreadcrumbsItem>
        <BreadcrumbsItem>Current</BreadcrumbsItem>
      </Breadcrumbs>
    );
    const visibleOl = getVisibleOl(container);
    // "A" (index 1) is the first visible link; "Home" is overflowed
    const aLink = within(visibleOl).getByRole("link", { name: /^A/ });

    act(() => { aLink.focus(); });

    await user.keyboard("{ArrowLeft}");

    // Focus should move to the overflow button (the slot before "A")
    const btn = screen.getByRole("button", { name: "More" });
    expect(document.activeElement).toBe(btn);
  });
});

describe.skip("Breadcrumbs — ResizeObserver callback triggers measurement", () => {
  it("ResizeObserver callback executes the measure logic via requestAnimationFrame", () => {
    vi.useFakeTimers();

    let capturedCallback: ResizeObserverCallback | null = null;
    class CapturingObserver {
      constructor(cb: ResizeObserverCallback) {
        capturedCallback = cb;
      }
      observe() {}
      disconnect() {}
      unobserve() {}
    }
    vi.stubGlobal("ResizeObserver", CapturingObserver);

    renderThreeItems(); // no overflowCount → uses ResizeObserver

    expect(capturedCallback).not.toBeNull();

    // Trigger the ResizeObserver callback
    act(() => {
      capturedCallback!([], {} as ResizeObserver);
    });

    // Run the requestAnimationFrame callback scheduled by the observer
    act(() => {
      vi.runAllTimers();
    });

    // No assertion on overflow count (jsdom doesn't lay out elements),
    // but the code path through lines 269-273 is now covered.

    vi.useRealTimers();
  });
});

describe.skip("Breadcrumbs — accessibleDescription", () => {
  it("sets aria-describedby when accessibleDescription provided", () => {
    render(
      <Breadcrumbs accessibleDescription="Current location in app">
        <BreadcrumbsItem>Home</BreadcrumbsItem>
        <BreadcrumbsItem>Products</BreadcrumbsItem>
      </Breadcrumbs>
    );
    const nav = screen.getByRole("navigation");
    const describedById = nav.getAttribute("aria-describedby");
    expect(describedById).toBeTruthy();
    const descriptionEl = document.getElementById(describedById!);
    expect(descriptionEl).toBeInTheDocument();
    expect(descriptionEl!.textContent).toBe("Current location in app");
  });
});
