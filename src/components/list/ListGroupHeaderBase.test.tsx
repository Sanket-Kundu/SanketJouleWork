import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ListGroupHeaderBase } from "./ListGroupHeaderBase";
import { List } from "./List";
import { ListItem } from "./ListItem";

describe("ListGroupHeaderBase", () => {
  it("should render children as text - BLI: EL-339", () => {
    render(
      <List>
        <ListGroupHeaderBase data-testid="header">
          My Header
        </ListGroupHeaderBase>
      </List>
    );
    expect(screen.getByTestId("header")).toHaveTextContent("My Header");
  });

  it("should render children as function - BLI: EL-339", () => {
    render(
      <List>
        <ListGroupHeaderBase data-testid="header">
          {({ isCollapsed, isFocused, collapsible }) => (
            <div>
              Collapsed: {String(isCollapsed)}, Focused: {String(isFocused)},
              Collapsible: {String(collapsible)}
            </div>
          )}
        </ListGroupHeaderBase>
      </List>
    );

    const header = screen.getByTestId("header");
    expect(header).toHaveTextContent("Collapsed: false");
    expect(header).toHaveTextContent("Focused: false");
    expect(header).toHaveTextContent("Collapsible: false");
  });

  describe("non-collapsible", () => {
    it("should render as heading role - BLI: EL-339", () => {
      render(
        <List>
          <ListGroupHeaderBase data-testid="header">
            Non-collapsible Header
          </ListGroupHeaderBase>
        </List>
      );

      const header = screen.getByTestId("header");
      expect(header).toHaveAttribute("role", "heading");
      expect(header).toHaveAttribute("aria-level", "3");
    });

    it("should not have aria-expanded - BLI: EL-339", () => {
      render(
        <List>
          <ListGroupHeaderBase data-testid="header">
            Non-collapsible Header
          </ListGroupHeaderBase>
        </List>
      );

      const header = screen.getByTestId("header");
      expect(header).not.toHaveAttribute("aria-expanded");
    });

    it("should not have aria-controls - BLI: EL-339", () => {
      render(
        <List>
          <ListGroupHeaderBase data-testid="header">
            Non-collapsible Header
          </ListGroupHeaderBase>
        </List>
      );

      const header = screen.getByTestId("header");
      expect(header).not.toHaveAttribute("aria-controls");
    });

    it("should not toggle on click - BLI: EL-339", async () => {
      const user = userEvent.setup();
      const onToggle = vi.fn();

      render(
        <List>
          <ListGroupHeaderBase data-testid="header" onToggle={onToggle}>
            Non-collapsible Header
          </ListGroupHeaderBase>
        </List>
      );

      const header = screen.getByTestId("header");
      await user.click(header);

      expect(onToggle).not.toHaveBeenCalled();
    });
  });

  describe("collapsible", () => {
    it("should render as button role - BLI: EL-339", () => {
      render(
        <List>
          <ListGroupHeaderBase data-testid="header" collapsible>
            Collapsible Header
          </ListGroupHeaderBase>
        </List>
      );

      const header = screen.getByTestId("header");
      expect(header).toHaveAttribute("role", "button");
      expect(header).not.toHaveAttribute("aria-level");
    });

    it("should have aria-expanded attribute - BLI: EL-339", () => {
      render(
        <List>
          <ListGroupHeaderBase data-testid="header" collapsible>
            Collapsible Header
          </ListGroupHeaderBase>
        </List>
      );

      const header = screen.getByTestId("header");
      expect(header).toHaveAttribute("aria-expanded");
    });

    it("should toggle on click - BLI: EL-339", async () => {
      const user = userEvent.setup();
      const onToggle = vi.fn();

      render(
        <List>
          <ListGroupHeaderBase
            data-testid="header"
            collapsible
            onToggle={onToggle}
          >
            Collapsible Header
          </ListGroupHeaderBase>
        </List>
      );

      const header = screen.getByTestId("header");
      await user.click(header);

      expect(onToggle).toHaveBeenCalled();
    });

    it("should start collapsed when defaultCollapsed is true - BLI: EL-339", () => {
      render(
        <List>
          <ListGroupHeaderBase
            data-testid="header"
            collapsible
            defaultCollapsed={true}
          >
            {({ isCollapsed }) => <div>Collapsed: {String(isCollapsed)}</div>}
          </ListGroupHeaderBase>
        </List>
      );

      expect(screen.getByTestId("header")).toHaveTextContent("Collapsed: true");
    });

    it("should start expanded when defaultCollapsed is false - BLI: EL-339", () => {
      render(
        <List>
          <ListGroupHeaderBase
            data-testid="header"
            collapsible
            defaultCollapsed={false}
          >
            {({ isCollapsed }) => <div>Collapsed: {String(isCollapsed)}</div>}
          </ListGroupHeaderBase>
        </List>
      );

      expect(screen.getByTestId("header")).toHaveTextContent(
        "Collapsed: false"
      );
    });

    it("should respect controlled collapsed prop - BLI: EL-339", () => {
      const { rerender } = render(
        <List>
          <ListGroupHeaderBase
            data-testid="header"
            collapsible
            collapsed={true}
          >
            {({ isCollapsed }) => <div>Collapsed: {String(isCollapsed)}</div>}
          </ListGroupHeaderBase>
        </List>
      );

      expect(screen.getByTestId("header")).toHaveTextContent("Collapsed: true");

      rerender(
        <List>
          <ListGroupHeaderBase
            data-testid="header"
            collapsible
            collapsed={false}
          >
            {({ isCollapsed }) => <div>Collapsed: {String(isCollapsed)}</div>}
          </ListGroupHeaderBase>
        </List>
      );

      expect(screen.getByTestId("header")).toHaveTextContent(
        "Collapsed: false"
      );
    });
  });

  it("should apply custom className - BLI: EL-339", () => {
    render(
      <List>
        <ListGroupHeaderBase
          data-testid="header"
          className="custom-class"
        >
          Header
        </ListGroupHeaderBase>
      </List>
    );

    expect(screen.getByTestId("header")).toHaveClass("custom-class");
  });

  it("should apply accessibleName as aria-label - BLI: EL-339", () => {
    render(
      <List>
        <ListGroupHeaderBase
          data-testid="header"
          accessibleName="Custom Accessible Name"
        >
          Header
        </ListGroupHeaderBase>
      </List>
    );

    expect(screen.getByTestId("header")).toHaveAttribute(
      "aria-label",
      "Custom Accessible Name"
    );
  });

  it("should have data-group-header attribute - BLI: EL-339", () => {
    render(
      <List>
        <ListGroupHeaderBase data-testid="header">
          Header
        </ListGroupHeaderBase>
      </List>
    );

    expect(screen.getByTestId("header")).toHaveAttribute(
      "data-group-header",
      "true"
    );
  });

  it("should handle keyboard navigation - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();

    render(
      <List>
        <ListGroupHeaderBase
          data-testid="header"
          collapsible
          onToggle={onToggle}
        >
          Header
        </ListGroupHeaderBase>
        <ListItem>Item 1</ListItem>
      </List>
    );

    const header = screen.getByTestId("header");
    header.focus();

    // Test Enter key
    await user.keyboard("{Enter}");
    expect(onToggle).toHaveBeenCalled();

    onToggle.mockClear();

    // Test Space key
    await user.keyboard(" ");
    expect(onToggle).toHaveBeenCalled();
  });
});
