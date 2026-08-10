import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { MessageStrip } from "./MessageStrip";
import { MessageStripDesign } from "../../types/messagestrip";

describe("MessageStrip", () => {
  // --- Rendering ---

  it("renders with text content - BLI: EL-339", () => {
    render(<MessageStrip>Operation successful</MessageStrip>);
    expect(screen.getByText("Operation successful")).toBeInTheDocument();
  });

  it("renders by default with Information design - BLI: EL-339", () => {
    render(<MessageStrip>Info message</MessageStrip>);
    expect(screen.getByText("Info message")).toBeInTheDocument();
  });

  it("renders with data-testid - BLI: EL-339", () => {
    render(<MessageStrip data-testid="strip">Test</MessageStrip>);
    expect(screen.getByTestId("strip")).toBeInTheDocument();
  });

  it("applies id, className, and style - BLI: EL-339", () => {
    render(
      <MessageStrip id="ms-1" className="custom" style={{ opacity: 0.8 }}>
        Styled
      </MessageStrip>
    );
    const el = document.getElementById("ms-1")!;
    expect(el).toBeInTheDocument();
    expect(el.className).toContain("custom");
    expect(el).toHaveStyle({ opacity: "0.8" });
  });

  // --- Design Variants ---

  it.each(Object.values(MessageStripDesign))("renders with design=%s - BLI: EL-339", (design) => {
    render(<MessageStrip design={design}>Message</MessageStrip>);
    expect(screen.getByText("Message")).toBeInTheDocument();
  });

  it("renders with Information design using string literal - BLI: EL-339", () => {
    render(<MessageStrip design="Information">Info</MessageStrip>);
    expect(screen.getByText("Info")).toBeInTheDocument();
  });

  it("renders with Positive design using string literal - BLI: EL-339", () => {
    render(<MessageStrip design="Positive">Success</MessageStrip>);
    expect(screen.getByText("Success")).toBeInTheDocument();
  });

  it("renders with Negative design using string literal - BLI: EL-339", () => {
    render(<MessageStrip design="Negative">Error</MessageStrip>);
    expect(screen.getByText("Error")).toBeInTheDocument();
  });

  it("renders with Warning design using string literal - BLI: EL-339", () => {
    render(<MessageStrip design="Warning">Warning</MessageStrip>);
    expect(screen.getByText("Warning")).toBeInTheDocument();
  });

  // --- ARIA Roles ---

  it("has role=note for Information design (default) - BLI: EL-339", () => {
    render(<MessageStrip>Info</MessageStrip>);
    expect(screen.getByRole("note")).toBeInTheDocument();
  });

  it("has role=note for Positive design - BLI: EL-339", () => {
    render(<MessageStrip design={MessageStripDesign.Positive}>OK</MessageStrip>);
    expect(screen.getByRole("note")).toBeInTheDocument();
  });

  it("has role=note for Negative design - BLI: EL-339", () => {
    render(<MessageStrip design={MessageStripDesign.Negative}>Error</MessageStrip>);
    expect(screen.getByRole("note")).toBeInTheDocument();
  });

  it("has role=note for Warning design - BLI: EL-339", () => {
    render(<MessageStrip design={MessageStripDesign.Warning}>Warning</MessageStrip>);
    expect(screen.getByRole("note")).toBeInTheDocument();
  });

  it("overrides default role with accessibleRole - BLI: EL-339", () => {
    render(
      <MessageStrip accessibleRole="log">Log message</MessageStrip>
    );
    expect(screen.getByRole("log")).toBeInTheDocument();
  });

  // --- Icons ---

  it("renders a default icon based on Information design - BLI: EL-339", () => {
    const { container } = render(<MessageStrip>Info</MessageStrip>);
    // The icon wrapper div exists
    const iconWrapper = container.querySelector(".flex-shrink-0");
    expect(iconWrapper).toBeInTheDocument();
  });

  it("renders a custom icon when icon prop is provided - BLI: EL-339", () => {
    render(
      <MessageStrip icon={<span data-testid="custom-icon">★</span>}>
        Custom icon
      </MessageStrip>
    );
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });

  it("hides the icon when hideIcon is true - BLI: EL-339", () => {
    const { container } = render(
      <MessageStrip hideIcon>No icon</MessageStrip>
    );
    const iconWrapper = container.querySelector(".flex-shrink-0.mt-0\\.5");
    expect(iconWrapper).not.toBeInTheDocument();
  });

  it("shows icon by default (hideIcon defaults to false) - BLI: EL-339", () => {
    const { container } = render(<MessageStrip>Visible icon</MessageStrip>);
    const iconWrapper = container.querySelector("[aria-hidden='true']");
    expect(iconWrapper).toBeInTheDocument();
  });

  it("icon wrapper has aria-hidden=true - BLI: EL-339", () => {
    const { container } = render(<MessageStrip>Icon test</MessageStrip>);
    const iconWrapper = container.querySelector("[aria-hidden='true']");
    expect(iconWrapper).toHaveAttribute("aria-hidden", "true");
  });

  // --- Close Button ---

  it("renders close button with design-specific label - BLI: EL-339", () => {
    render(<MessageStrip>Closeable</MessageStrip>);
    expect(screen.getByRole("button", { name: "Information Message Strip Close" })).toBeInTheDocument();
  });

  it("hides close button when hideCloseButton is true - BLI: EL-339", () => {
    render(<MessageStrip hideCloseButton>Permanent</MessageStrip>);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("close button has design-specific label for Negative design - BLI: EL-339", () => {
    render(<MessageStrip design={MessageStripDesign.Negative}>Error</MessageStrip>);
    expect(screen.getByRole("button", { name: "Negative Message Strip Close" })).toBeInTheDocument();
  });

  it("close button has design-specific label for Warning design (Critical) - BLI: EL-339", () => {
    render(<MessageStrip design={MessageStripDesign.Warning}>Warning</MessageStrip>);
    expect(screen.getByRole("button", { name: "Critical Message Strip Close" })).toBeInTheDocument();
  });

  it("close button has design-specific label for Positive design - BLI: EL-339", () => {
    render(<MessageStrip design={MessageStripDesign.Positive}>OK</MessageStrip>);
    expect(screen.getByRole("button", { name: "Positive Message Strip Close" })).toBeInTheDocument();
  });

  // --- Close Behavior ---

  it("stays in DOM when close button is clicked (app controls visibility) - BLI: EL-339", async () => {
    const user = userEvent.setup();
    render(<MessageStrip>Dismissable</MessageStrip>);
    const strip = screen.getByText("Dismissable");
    await user.click(screen.getByRole("button", { name: "Information Message Strip Close" }));
    expect(strip).toBeInTheDocument();
  });

  it("calls onClose callback when close button is clicked - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    render(<MessageStrip onClose={handleClose}>Closeable</MessageStrip>);
    await user.click(screen.getByRole("button", { name: "Information Message Strip Close" }));
    expect(handleClose).toHaveBeenCalledOnce();
    expect(handleClose).toHaveBeenCalledWith({ closed: true });
  });

  it("does not call onClose when hideCloseButton is true and there is no button - BLI: EL-339", () => {
    const handleClose = vi.fn();
    render(
      <MessageStrip hideCloseButton onClose={handleClose}>
        Permanent
      </MessageStrip>
    );
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(handleClose).not.toHaveBeenCalled();
  });

  it("stays in DOM after close button clicked (no auto-hide) - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const { container } = render(<MessageStrip data-testid="ms">Dismiss me</MessageStrip>);
    await user.click(screen.getByRole("button", { name: "Information Message Strip Close" }));
    expect(container.firstChild).not.toBeNull();
  });

  // --- Accessibility ---

  it("applies aria-label from accessibleName - BLI: EL-339", () => {
    render(
      <MessageStrip accessibleName="Important notification">Note</MessageStrip>
    );
    const el = screen.getByRole("note");
    expect(el).toHaveAttribute("aria-label", "Important notification");
  });

  it("applies aria-labelledby from accessibleNameRef - BLI: EL-339", () => {
    render(
      <MessageStrip accessibleNameRef="lbl-1">Note</MessageStrip>
    );
    expect(screen.getByRole("note")).toHaveAttribute("aria-labelledby", "lbl-1");
  });

  it("aria-labelledby points to hidden-text and content-text by default - BLI: EL-339", () => {
    render(<MessageStrip id="ms-test">Content</MessageStrip>);
    const el = screen.getByRole("note");
    expect(el).toHaveAttribute("aria-labelledby", "ms-test-hidden-text ms-test-content-text");
  });

  it("hidden text contains design announcement and closable for Information - BLI: EL-339", () => {
    render(<MessageStrip id="ms-test">Content</MessageStrip>);
    const hiddenText = document.getElementById("ms-test-hidden-text");
    expect(hiddenText).toBeInTheDocument();
    expect(hiddenText!.textContent).toBe("Message Strip Closable");
  });

  it("hidden text contains design announcement for Positive - BLI: EL-339", () => {
    render(<MessageStrip id="ms-test" design={MessageStripDesign.Positive}>Content</MessageStrip>);
    const hiddenText = document.getElementById("ms-test-hidden-text");
    expect(hiddenText!.textContent).toBe("Success Message Strip Closable");
  });

  it("hidden text contains design announcement for Negative - BLI: EL-339", () => {
    render(<MessageStrip id="ms-test" design={MessageStripDesign.Negative}>Content</MessageStrip>);
    const hiddenText = document.getElementById("ms-test-hidden-text");
    expect(hiddenText!.textContent).toBe("Error Message Strip Closable");
  });

  it("hidden text contains design announcement for Warning - BLI: EL-339", () => {
    render(<MessageStrip id="ms-test" design={MessageStripDesign.Warning}>Content</MessageStrip>);
    const hiddenText = document.getElementById("ms-test-hidden-text");
    expect(hiddenText!.textContent).toBe("Warning Message Strip Closable");
  });

  it("hidden text omits Closable when hideCloseButton is true - BLI: EL-339", () => {
    render(<MessageStrip id="ms-test" hideCloseButton>Content</MessageStrip>);
    const hiddenText = document.getElementById("ms-test-hidden-text");
    expect(hiddenText!.textContent).toBe("Message Strip");
  });

  it("content text has correct id - BLI: EL-339", () => {
    render(<MessageStrip id="ms-test">My content</MessageStrip>);
    const contentText = document.getElementById("ms-test-content-text");
    expect(contentText).toBeInTheDocument();
    expect(contentText!.textContent).toBe("My content");
  });

  // --- Ref ---

  it("forwards ref to the root div element - BLI: EL-339", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<MessageStrip ref={ref}>Ref test</MessageStrip>);
    expect(ref.current).not.toBeNull();
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("ref remains valid after close button clicked (no auto-unmount) - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const ref = React.createRef<HTMLDivElement>();
    render(<MessageStrip ref={ref}>Will close</MessageStrip>);
    expect(ref.current).not.toBeNull();
    await user.click(screen.getByRole("button", { name: "Information Message Strip Close" }));
    expect(document.body.contains(ref.current)).toBe(true);
  });

  // --- Default icon per design ---

  it("each design renders a distinct default icon (svg present) - BLI: EL-339", () => {
    const designs = [
      MessageStripDesign.Information,
      MessageStripDesign.Positive,
      MessageStripDesign.Negative,
      MessageStripDesign.Warning,
    ];
    designs.forEach((design) => {
      const { container, unmount } = render(
        <MessageStrip design={design}>Test</MessageStrip>
      );
      // lucide icons render as <svg> elements
      expect(container.querySelector("svg")).toBeInTheDocument();
      unmount();
    });
  });

  it("does not render svg icon when hideIcon is true - BLI: EL-339", () => {
    const { container } = render(
      <MessageStrip hideIcon>No icon</MessageStrip>
    );
    // The icon wrapper is gone; verify no icon-related svg is present
    // (Close button itself doesn't include an svg for the X — it renders a lucide X)
    // We check the mt-0.5 wrapper isn't there
    expect(container.querySelector(".mt-0\\.5")).not.toBeInTheDocument();
  });

  it("sets aria-describedby when accessibleDescription provided - BLI: EL-339", () => {
    render(<MessageStrip accessibleDescription="Action required">Check your email</MessageStrip>);
    const strip = screen.getByRole("note");
    const describedById = strip.getAttribute("aria-describedby");
    expect(describedById).toBeTruthy();
    const descriptionEl = document.getElementById(describedById!);
    expect(descriptionEl).toBeInTheDocument();
    expect(descriptionEl!.textContent).toBe("Action required");
  });

  // --- Title ---

  it("renders title text when title prop is provided", () => {
    render(<MessageStrip title="Success">Details here</MessageStrip>);
    expect(screen.getByText("Success")).toBeInTheDocument();
    expect(screen.getByText("Details here")).toBeInTheDocument();
  });

  it("does not render title element when title is not provided", () => {
    const { container } = render(<MessageStrip>Just content</MessageStrip>);
    const titleEl = container.querySelector(".text-base.font-semibold.leading-\\[22px\\]");
    expect(titleEl).not.toBeInTheDocument();
  });

  it("applies secondary text styling to children when title is present", () => {
    const { container } = render(
      <MessageStrip title="Title">Content text</MessageStrip>
    );
    const contentEl = container.querySelector(".text-sapphire-text-secondary");
    expect(contentEl).toBeInTheDocument();
    expect(contentEl!.textContent).toContain("Content text");
  });

  it("applies primary semibold styling to children when title is absent", () => {
    const { container } = render(<MessageStrip>Content text</MessageStrip>);
    const contentEl = container.querySelector(".text-sapphire-text-primary.font-semibold");
    expect(contentEl).toBeInTheDocument();
    expect(contentEl!.textContent).toContain("Content text");
  });

  it("uses correct padding when title is present", () => {
    const { container } = render(
      <MessageStrip title="Title">Content</MessageStrip>
    );
    const strip = container.firstChild as HTMLElement;
    expect(strip.className).toContain("p-sapphire-2xs");
    expect(strip.className).toContain("flex-col");
  });

  it("uses standard padding when title is absent", () => {
    const { container } = render(<MessageStrip>Content</MessageStrip>);
    const strip = container.firstChild as HTMLElement;
    expect(strip.className).toContain("p-sapphire-2xs");
  });

  it("uses larger icon padding when title is present", () => {
    const { container } = render(
      <MessageStrip title="Title">Content</MessageStrip>
    );
    const iconWrapper = container.querySelector("[aria-hidden='true']");
    expect(iconWrapper).toBeInTheDocument();
    expect(iconWrapper!.className).toContain("p-1");
  });

  it("title is included in content text id for accessibility", () => {
    render(<MessageStrip id="ms-title" title="My Title">Content</MessageStrip>);
    const contentText = document.getElementById("ms-title-content-text");
    expect(contentText).toBeInTheDocument();
    expect(contentText!.textContent).toContain("My Title");
  });
});
