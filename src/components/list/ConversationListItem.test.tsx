import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { createRef } from "react";
import { ConversationListItem } from "./ConversationListItem";
import { ListItemRef } from "../../types/list";

describe("ConversationListItem", () => {
  it("renders content text - BLI: EL-339", () => {
    render(
      <ConversationListItem itemKey="1" content="Cash Flow Improvement" />
    );
    expect(screen.getByText("Cash Flow Improvement")).toBeInTheDocument();
  });

  it("applies accent styling when selected=true - BLI: EL-339", () => {
    render(
      <ConversationListItem itemKey="1" content="Selected Item" selected />
    );
    const contentEl = screen.getByText("Selected Item");
    expect(contentEl).toHaveClass("font-semibold");
    expect(contentEl).toHaveClass("text-sapphire-text-accent");
  });

  it("applies font-bold class when bold=true - BLI: EL-339", () => {
    render(
      <ConversationListItem itemKey="1" content="Bold Item" bold />
    );
    const contentEl = screen.getByText("Bold Item");
    expect(contentEl).toHaveClass("font-bold");
  });

  it("applies font-normal when neither selected nor bold - BLI: EL-339", () => {
    render(
      <ConversationListItem itemKey="1" content="Normal Item" />
    );
    const contentEl = screen.getByText("Normal Item");
    expect(contentEl).toHaveClass("font-normal");
  });

  it("fires onClick handler when clicked - BLI: EL-339", () => {
    const onClick = vi.fn();
    render(
      <ConversationListItem itemKey="1" content="Clickable" onClick={onClick} />
    );
    fireEvent.click(screen.getByText("Clickable"));
    expect(onClick).toHaveBeenCalled();
  });

  it("renders action buttons from actions prop - BLI: EL-339", () => {
    render(
      <ConversationListItem
        itemKey="1"
        content="With Actions"
        actions={
          <>
            <button data-testid="action-rename">Rename</button>
            <button data-testid="action-delete">Delete</button>
          </>
        }
      />
    );
    expect(screen.getByTestId("action-rename")).toBeInTheDocument();
    expect(screen.getByTestId("action-delete")).toBeInTheDocument();
  });

  it("does not render actions container when actions prop is not provided - BLI: EL-339", () => {
    const { container } = render(
      <ConversationListItem itemKey="1" content="No Actions" />
    );
    // The actions wrapper div should not be present
    // The main structure has one inner div (flex container) with one child div (content)
    const flexContainer = container.querySelector(".flex.items-center.gap-2");
    // Only the content div, no actions div
    expect(flexContainer?.children.length).toBe(1);
  });

  it("merges custom className - BLI: EL-339", () => {
    const { container } = render(
      <ConversationListItem itemKey="1" content="Custom" className="my-custom-class" />
    );
    const li = container.querySelector("li");
    expect(li).toHaveClass("my-custom-class");
  });

  it("forwards ref with imperative handle methods - BLI: EL-339", () => {
    const ref = createRef<ListItemRef>();
    render(
      <ConversationListItem ref={ref} itemKey="1" content="Ref Test" />
    );
    expect(ref.current).toBeTruthy();
    expect(typeof ref.current?.focus).toBe("function");
    expect(typeof ref.current?.blur).toBe("function");
    expect(typeof ref.current?.isFocused).toBe("function");
    expect(ref.current?.nativeElement).toBeInstanceOf(HTMLLIElement);
  });

  it("applies selected background and ring styling - BLI: EL-339", () => {
    const { container } = render(
      <ConversationListItem itemKey="1" content="Selected BG" selected />
    );
    const li = container.querySelector("li");
    expect(li).toHaveClass("!ring-1");
    expect(li).toHaveClass("!ring-inset");
    expect(li).toHaveClass("!ring-sapphire-border-active");
    expect(li).toHaveClass("rounded-[4px]");
  });

  it("selected takes precedence over bold for styling - BLI: EL-339", () => {
    render(
      <ConversationListItem itemKey="1" content="Both" selected bold />
    );
    const contentEl = screen.getByText("Both");
    // selected styling wins
    expect(contentEl).toHaveClass("font-semibold");
    expect(contentEl).not.toHaveClass("font-bold");
  });

  it("renders custom React element as content - BLI: EL-339", () => {
    render(
      <ConversationListItem
        itemKey="1"
        content={
          <input
            type="text"
            data-testid="custom-input"
            placeholder="Enter title"
            defaultValue="Editable Content"
          />
        }
      />
    );
    const input = screen.getByTestId("custom-input");
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("Editable Content");
  });

  it("applies correct styles to custom React element content - BLI: EL-339", () => {
    render(
      <ConversationListItem
        itemKey="1"
        content={<span data-testid="custom-span">Custom Element</span>}
        bold
      />
    );
    // Find the content wrapper div that should have styling classes
    const contentWrapper = screen.getByTestId("custom-span").parentElement;
    expect(contentWrapper).toHaveClass("font-bold");
    expect(contentWrapper).toHaveClass("text-sapphire-text-primary");
  });

  it("shows actions on hover and when selected - BLI: EL-339", () => {
    const { rerender } = render(
      <ConversationListItem
        itemKey="1"
        content="Item"
        actions={<button data-testid="action">Act</button>}
      />
    );
    // Actions container should be invisible by default (shown on hover via CSS)
    const actionsContainer = screen.getByTestId("action").parentElement;
    expect(actionsContainer).toHaveClass("invisible");
    expect(actionsContainer).toHaveClass("group-hover:visible");

    // Re-render with selected — always visible
    rerender(
      <ConversationListItem
        itemKey="1"
        content="Item"
        selected
        actions={<button data-testid="action">Act</button>}
      />
    );
    const actionsContainerSelected = screen.getByTestId("action").parentElement;
    expect(actionsContainerSelected).toHaveClass("visible");
    expect(actionsContainerSelected).toHaveClass("opacity-100");
  });

  it("does not apply hover text color change - BLI: EL-339", () => {
    const { container } = render(
      <ConversationListItem itemKey="1" content="No Hover Color" />
    );
    const li = container.querySelector("li");
    expect(li?.className).not.toContain("brand-foreground");
  });

  it("overrides ListItemBase bg with transparent by default - BLI: EL-339", () => {
    const { container } = render(
      <ConversationListItem itemKey="1" content="Transparent BG" />
    );
    const li = container.querySelector("li");
    expect(li).toHaveClass("!bg-transparent");
  });

  describe("action-fixed visibility", () => {
    it("container remains invisible when no action-fixed children present (backward compat)", () => {
      render(
        <ConversationListItem
          itemKey="1"
          content="Item"
          actions={
            <>
              <button data-testid="action-a">A</button>
              <button data-testid="action-b">B</button>
            </>
          }
        />
      );
      const container = screen.getByTestId("action-a").parentElement;
      expect(container).toHaveClass("invisible");
      expect(container).toHaveClass("absolute");
      expect(container).toHaveClass("group-hover:visible");
    });

    it("container has has-[>.action-fixed] override classes", () => {
      render(
        <ConversationListItem
          itemKey="1"
          content="Item"
          actions={
            <>
              <button data-testid="fixed-action" className="action-fixed">Pin</button>
              <button data-testid="hover-action">Delete</button>
            </>
          }
        />
      );
      const container = screen.getByTestId("fixed-action").parentElement;
      expect(container).toHaveClass("has-[>.action-fixed]:visible");
      expect(container).toHaveClass("has-[>.action-fixed]:opacity-100");
      expect(container).toHaveClass("has-[>.action-fixed]:relative");
    });

    it("applies per-child opacity classes scoped to has-[>.action-fixed]", () => {
      render(
        <ConversationListItem
          itemKey="1"
          content="Item"
          actions={
            <>
              <button data-testid="fixed-action" className="action-fixed">Pin</button>
              <button data-testid="hover-action">Delete</button>
            </>
          }
        />
      );
      const container = screen.getByTestId("fixed-action").parentElement;
      expect(container).toHaveClass("has-[>.action-fixed]:[&>.action-fixed]:opacity-100");
      expect(container).toHaveClass("has-[>.action-fixed]:[&>*:not(.action-fixed)]:opacity-0");
    });

    it("reveals non-fixed children on hover via scoped group-hover", () => {
      render(
        <ConversationListItem
          itemKey="1"
          content="Item"
          actions={
            <>
              <button data-testid="fixed-action" className="action-fixed">Pin</button>
              <button data-testid="hover-action">Delete</button>
            </>
          }
        />
      );
      const container = screen.getByTestId("fixed-action").parentElement;
      expect(container).toHaveClass("has-[>.action-fixed]:group-hover:[&>*:not(.action-fixed)]:opacity-100");
    });

    it("children have transition-opacity for smooth animation", () => {
      render(
        <ConversationListItem
          itemKey="1"
          content="Item"
          actions={
            <>
              <button data-testid="fixed-action" className="action-fixed">Pin</button>
              <button data-testid="hover-action">Delete</button>
            </>
          }
        />
      );
      const container = screen.getByTestId("fixed-action").parentElement;
      expect(container).toHaveClass("[&>*]:transition-opacity");
    });

    it("selected state makes all children visible", () => {
      render(
        <ConversationListItem
          itemKey="1"
          content="Item"
          selected
          actions={
            <>
              <button data-testid="fixed-action" className="action-fixed">Pin</button>
              <button data-testid="hover-action">Delete</button>
            </>
          }
        />
      );
      const container = screen.getByTestId("fixed-action").parentElement;
      expect(container).toHaveClass("visible");
      expect(container).toHaveClass("opacity-100");
      expect(container).toHaveClass("[&>*]:opacity-100");
    });
  });
});
