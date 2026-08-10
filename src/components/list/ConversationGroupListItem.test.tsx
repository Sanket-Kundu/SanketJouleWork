import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { createRef } from "react";
import { ConversationGroupListItem } from "./ConversationGroupListItem";

describe("ConversationGroupListItem", () => {
  it("renders headerText in the header - BLI: EL-339", () => {
    render(
      <ConversationGroupListItem headerText="Today" />
    );
    expect(screen.getByText("Today")).toBeInTheDocument();
  });

  it("renders children inside the group - BLI: EL-339", () => {
    render(
      <ConversationGroupListItem headerText="Today">
        <li data-testid="child-item">Child content</li>
      </ConversationGroupListItem>
    );
    expect(screen.getByTestId("child-item")).toBeInTheDocument();
    expect(screen.getByText("Child content")).toBeInTheDocument();
  });

  describe("collapsible behavior", () => {
    it("shows chevron down when collapsible and expanded - BLI: EL-339", () => {
      const { container } = render(
        <ConversationGroupListItem headerText="Today" collapsible />
      );
      // ChevronDown is rendered when expanded (default)
      // The component renders its own chevron in the custom header
      const svgs = container.querySelectorAll("svg");
      expect(svgs.length).toBeGreaterThan(0);
    });

    it("toggles collapsed state when clicking the header - BLI: EL-339", () => {
      const { container } = render(
        <ConversationGroupListItem headerText="Today" collapsible />
      );
      const header = container.querySelector('[data-group-header="true"]');
      expect(header).toBeInTheDocument();

      // Initially expanded — children list should be visible
      const contentList = container.querySelector('ul[role="group"]');
      expect(contentList).not.toHaveClass("hidden");

      // Click header to collapse
      fireEvent.click(header!);
      expect(contentList).toHaveClass("hidden");

      // Click header again to expand
      fireEvent.click(header!);
      expect(contentList).not.toHaveClass("hidden");
    });

    it("shows plain header without chevron when collapsible=false - BLI: EL-339", () => {
      const { container } = render(
        <ConversationGroupListItem headerText="Today" collapsible={false} />
      );
      const header = container.querySelector('[data-group-header="true"]');
      expect(header).toBeInTheDocument();
      // The header should have role="heading" instead of "button"
      expect(header).toHaveAttribute("role", "heading");
      // No aria-expanded on non-collapsible
      expect(header).not.toHaveAttribute("aria-expanded");
    });
  });

  it("starts collapsed when defaultCollapsed is true - BLI: EL-339", () => {
    const { container } = render(
      <ConversationGroupListItem headerText="Today" collapsible defaultCollapsed>
        <li>Hidden child</li>
      </ConversationGroupListItem>
    );
    const contentList = container.querySelector('ul[role="group"]');
    expect(contentList).toHaveClass("hidden");
  });

  it("respects controlled collapsed prop - BLI: EL-339", () => {
    const { container, rerender } = render(
      <ConversationGroupListItem headerText="Today" collapsible collapsed={false}>
        <li>Child</li>
      </ConversationGroupListItem>
    );
    const contentList = container.querySelector('ul[role="group"]');
    expect(contentList).not.toHaveClass("hidden");

    // Re-render with collapsed=true
    rerender(
      <ConversationGroupListItem headerText="Today" collapsible collapsed={true}>
        <li>Child</li>
      </ConversationGroupListItem>
    );
    expect(contentList).toHaveClass("hidden");
  });

  it("fires onToggle callback when toggled - BLI: EL-339", () => {
    const onToggle = vi.fn();
    const { container } = render(
      <ConversationGroupListItem headerText="Today" collapsible onToggle={onToggle} />
    );
    const header = container.querySelector('[data-group-header="true"]');
    fireEvent.click(header!);
    expect(onToggle).toHaveBeenCalledWith(true);

    fireEvent.click(header!);
    expect(onToggle).toHaveBeenCalledWith(false);
    expect(onToggle).toHaveBeenCalledTimes(2);
  });

  it("renders 'See All' button when onSeeAll is provided and clicking calls handler - BLI: EL-339", () => {
    const onSeeAll = vi.fn();
    render(
      <ConversationGroupListItem headerText="Today" onSeeAll={onSeeAll}>
        <li>Item 1</li>
      </ConversationGroupListItem>
    );
    const seeAllButton = screen.getByText("See All");
    expect(seeAllButton).toBeInTheDocument();

    fireEvent.click(seeAllButton);
    expect(onSeeAll).toHaveBeenCalledTimes(1);
  });

  it("does not render 'See All' button when onSeeAll is not provided - BLI: EL-339", () => {
    render(
      <ConversationGroupListItem headerText="Today">
        <li>Item 1</li>
      </ConversationGroupListItem>
    );
    expect(screen.queryByText("See All")).not.toBeInTheDocument();
  });

  it("applies stickyHeader styling - BLI: EL-339", () => {
    const { container } = render(
      <ConversationGroupListItem headerText="Today" stickyHeader />
    );
    const header = container.querySelector('[data-group-header="true"]');
    expect(header).toHaveClass("sticky");
  });

  it("merges custom className - BLI: EL-339", () => {
    const { container } = render(
      <ConversationGroupListItem headerText="Today" className="my-custom-class" />
    );
    // The className is applied to the outer li[role="group"]
    const group = container.querySelector('li[role="group"]');
    expect(group).toHaveClass("my-custom-class");
  });

  it("passes data-testid through - BLI: EL-339", () => {
    render(
      <ConversationGroupListItem headerText="Today" data-testid="my-group" />
    );
    expect(screen.getByTestId("my-group")).toBeInTheDocument();
  });

  it("forwards ref to the underlying li element - BLI: EL-339", () => {
    const ref = createRef<HTMLLIElement>();
    render(
      <ConversationGroupListItem ref={ref} headerText="Today" />
    );
    expect(ref.current).toBeInstanceOf(HTMLLIElement);
    expect(ref.current?.tagName).toBe("LI");
  });
});
