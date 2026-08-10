import { describe, it, expect, vi } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { Card } from "./Card";
import { CardHeader } from "./CardHeader";
import { CardContent } from "./CardContent";
import { CardFooter } from "./CardFooter";
import type { CardRef, CardHeaderRef } from "../../types/card";
import { CardHeaderStatus, CardDesign } from "../../types/card";

describe("Card", () => {
  // --- Rendering ---

  it("renders as article with region role when not interactive - BLI: EL-339", () => {
    render(<Card data-testid="card"><CardContent>Hello</CardContent></Card>);
    expect(screen.getByRole("region")).toBeInTheDocument();
    expect(screen.getByTestId("card")).toHaveAttribute("role", "region");
  });

  it("does not render aria-roledescription - BLI: EL-339", () => {
    render(<Card data-testid="card"><CardContent>Hello</CardContent></Card>);
    expect(screen.getByTestId("card")).not.toHaveAttribute("aria-roledescription");
  });

  it("renders as listitem role when interactive", () => {
    render(<Card interactive data-testid="card"><CardContent>Hello</CardContent></Card>);
    expect(screen.getByTestId("card")).toHaveAttribute("role", "listitem");
  });

  it("has tabIndex=0 when interactive", () => {
    render(<Card interactive data-testid="card"><CardContent>Hello</CardContent></Card>);
    expect(screen.getByTestId("card")).toHaveAttribute("tabindex", "0");
  });

  it("has cursor-pointer when interactive", () => {
    render(<Card interactive data-testid="card"><CardContent>Hello</CardContent></Card>);
    expect(screen.getByTestId("card").className).toContain("cursor-pointer");
  });

  it("does not have tabIndex when not interactive", () => {
    render(<Card data-testid="card"><CardContent>Hello</CardContent></Card>);
    expect(screen.getByTestId("card")).not.toHaveAttribute("tabindex");
  });

  it("renders children content - BLI: EL-339", () => {
    render(<Card><CardContent><p>Body</p></CardContent></Card>);
    expect(screen.getByText("Body")).toBeInTheDocument();
  });

  it("renders header - BLI: EL-339", () => {
    render(
      <Card header={<CardHeader titleText="Title" />}>
        <CardContent>Body</CardContent>
      </Card>
    );
    expect(screen.getByText("Title")).toBeInTheDocument();
  });

  it("renders footer - BLI: EL-339", () => {
    render(
      <Card footer={<CardFooter><span>Footer</span></CardFooter>}>
        <CardContent>Body</CardContent>
      </Card>
    );
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });

  it("does not render content area when no children - BLI: EL-339", () => {
    const { container } = render(<Card header={<CardHeader titleText="Empty" />} />);
    expect(container.querySelector("[data-part='content']")).not.toBeInTheDocument();
  });

  it("applies data-testid, id, className, and style - BLI: EL-339", () => {
    render(
      <Card data-testid="card" id="c1" className="custom" style={{ width: "300px" }}>
        <CardContent>X</CardContent>
      </Card>
    );
    const card = screen.getByTestId("card");
    expect(card).toHaveAttribute("id", "c1");
    expect(card.className).toContain("custom");
    expect(card).toHaveStyle({ width: "300px" });
  });

  // --- Accessibility ---

  it("applies accessibleName - BLI: EL-339", () => {
    render(<Card accessibleName="Product card"><CardContent>X</CardContent></Card>);
    expect(screen.getByRole("region")).toHaveAttribute("aria-label", "Product card");
  });

  it("applies accessibleNameRef - BLI: EL-339", () => {
    render(<Card accessibleNameRef="title-1"><CardContent>X</CardContent></Card>);
    expect(screen.getByRole("region")).toHaveAttribute("aria-labelledby", "title-1");
  });

  it("applies accessibleDescriptionRef - BLI: EL-339", () => {
    render(<Card accessibleDescriptionRef="desc-1"><CardContent>X</CardContent></Card>);
    expect(screen.getByRole("region")).toHaveAttribute("aria-describedby", "desc-1");
  });

  // --- Loading ---

  it("sets aria-busy when loading - BLI: EL-339", () => {
    render(<Card loading><CardContent>X</CardContent></Card>);
    expect(screen.getByRole("region")).toHaveAttribute("aria-busy", "true");
  });

  it("shows loading overlay after default delay - BLI: EL-339", () => {
    vi.useFakeTimers();
    const { container } = render(<Card loading><CardContent>X</CardContent></Card>);

    // Not visible before delay
    expect(container.querySelector("[aria-hidden='true']")).not.toBeInTheDocument();

    act(() => { vi.advanceTimersByTime(1000); });
    expect(container.querySelector("[aria-hidden='true']")).toBeInTheDocument();
    vi.useRealTimers();
  });

  it("shows loading overlay immediately with loadingDelay=0 - BLI: EL-339", () => {
    const { container } = render(<Card loading loadingDelay={0}><CardContent>X</CardContent></Card>);
    expect(container.querySelector("[aria-hidden='true']")).toBeInTheDocument();
  });

  it("hides loading overlay when loading becomes false - BLI: EL-339", () => {
    vi.useFakeTimers();
    const { container, rerender } = render(
      <Card loading loadingDelay={0}><CardContent>X</CardContent></Card>
    );
    expect(container.querySelector("[aria-hidden='true']")).toBeInTheDocument();

    rerender(<Card loading={false} loadingDelay={0}><CardContent>X</CardContent></Card>);
    expect(container.querySelector("[aria-hidden='true']")).not.toBeInTheDocument();
    vi.useRealTimers();
  });

  // --- Ref ---

  it("exposes focus/blur via ref - BLI: EL-339", () => {
    const ref = React.createRef<CardRef>();
    render(<Card ref={ref}><CardContent>Ref test</CardContent></Card>);
    expect(ref.current).not.toBeNull();
    expect(ref.current!.nativeElement).toBeInstanceOf(HTMLElement);

    ref.current!.focus();
    ref.current!.blur();
  });
});

// ============================================================================
// CARD – INTERACTIVE MODE
// ============================================================================

describe("Card interactive", () => {
  it("fires onClick with isKeyboard=false on mouse click", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <Card interactive onClick={onClick} data-testid="card">
        <CardContent>Body</CardContent>
      </Card>
    );
    await user.click(screen.getByTestId("card"));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick.mock.calls[0][0].isKeyboard).toBe(false);
  });

  it("fires onClick with isKeyboard=true on Enter key", () => {
    const onClick = vi.fn();
    render(
      <Card interactive onClick={onClick} data-testid="card">
        <CardContent>Body</CardContent>
      </Card>
    );
    fireEvent.keyDown(screen.getByTestId("card"), { key: "Enter" });
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick.mock.calls[0][0].isKeyboard).toBe(true);
  });

  it("fires onClick with isKeyboard=true on Space keyUp (ARIA spec)", () => {
    const onClick = vi.fn();
    render(
      <Card interactive onClick={onClick} data-testid="card">
        <CardContent>Body</CardContent>
      </Card>
    );
    const card = screen.getByTestId("card");
    fireEvent.keyDown(card, { key: " " });
    expect(onClick).not.toHaveBeenCalled();
    fireEvent.keyUp(card, { key: " " });
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick.mock.calls[0][0].isKeyboard).toBe(true);
  });

  it("does NOT fire onClick when not interactive", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <Card onClick={onClick} data-testid="card">
        <CardContent>Body</CardContent>
      </Card>
    );
    await user.click(screen.getByTestId("card"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("heading role preserved on CardHeader title when Card is interactive", () => {
    render(
      <Card interactive header={<CardHeader titleText="Title" />}>
        <CardContent>Body</CardContent>
      </Card>
    );
    const title = screen.getByText("Title");
    expect(title).toHaveAttribute("role", "heading");
    expect(title).toHaveAttribute("aria-level", "3");
  });

  it("preserves heading role on CardHeader title when Card is not interactive", () => {
    render(
      <Card header={<CardHeader titleText="Title" ariaLevel={4} />}>
        <CardContent>Body</CardContent>
      </Card>
    );
    const heading = screen.getByRole("heading");
    expect(heading).toHaveAttribute("aria-level", "4");
  });

  it("action button click does NOT fire Card onClick (stopPropagation)", () => {
    const cardClick = vi.fn();
    const actionClick = vi.fn();
    render(
      <Card
        interactive
        onClick={cardClick}
        header={
          <CardHeader
            titleText="Title"
            action={<button data-testid="action-btn" onClick={actionClick}>Act</button>}
          />
        }
      >
        <CardContent>Body</CardContent>
      </Card>
    );
    fireEvent.click(screen.getByTestId("action-btn"));
    expect(actionClick).toHaveBeenCalled();
    expect(cardClick).not.toHaveBeenCalled();
  });

  it("Joule card toolbar hidden by default, visible via toolbarVisible prop", () => {
    const { container, rerender } = render(
      <Card
        design={CardDesign.Joule}
        data-testid="card"
        toolbar={<button>Edit</button>}
      >
        <CardContent>Body</CardContent>
      </Card>
    );
    const toolbarDiv = container.querySelector("[data-part='toolbar']")!;
    expect(toolbarDiv.className).toContain("invisible");

    rerender(
      <Card
        design={CardDesign.Joule}
        data-testid="card"
        toolbarVisible
        toolbar={<button>Edit</button>}
      >
        <CardContent>Body</CardContent>
      </Card>
    );
    expect(toolbarDiv.className).not.toContain("invisible");
  });

  it("Joule card toolbar does NOT show on hover (no group-hover class)", () => {
    const { container } = render(
      <Card
        design={CardDesign.Joule}
        data-testid="card"
        toolbar={<button>Edit</button>}
      >
        <CardContent>Body</CardContent>
      </Card>
    );
    const toolbarDiv = container.querySelector("[data-part='toolbar']")!;
    expect(toolbarDiv.className).toContain("invisible");
    expect(toolbarDiv.className).not.toContain("group-hover");
  });

  it("non-Joule card toolbar shows on hover (has group-hover class)", () => {
    const { container } = render(
      <Card
        design={CardDesign.Default}
        data-testid="card"
        toolbar={<button>Edit</button>}
      >
        <CardContent>Body</CardContent>
      </Card>
    );
    const toolbarDiv = container.querySelector("[data-part='toolbar']")!;
    expect(toolbarDiv.className).toContain("group-hover");
  });

  it("button inside content does NOT fire Card onClick", () => {
    const cardClick = vi.fn();
    const btnClick = vi.fn();
    render(
      <Card interactive onClick={cardClick} data-testid="card">
        <CardContent>
          <button data-testid="content-btn" onClick={btnClick}>Inner</button>
        </CardContent>
      </Card>
    );
    fireEvent.click(screen.getByTestId("content-btn"));
    expect(btnClick).toHaveBeenCalled();
    expect(cardClick).not.toHaveBeenCalled();
  });

  it("link inside content does NOT fire Card onClick", () => {
    const cardClick = vi.fn();
    render(
      <Card interactive onClick={cardClick} data-testid="card">
        <CardContent>
          <a href="#" data-testid="content-link">Link</a>
        </CardContent>
      </Card>
    );
    fireEvent.click(screen.getByTestId("content-link"));
    expect(cardClick).not.toHaveBeenCalled();
  });

  it("clicking non-interactive content fires Card onClick", () => {
    const cardClick = vi.fn();
    render(
      <Card interactive onClick={cardClick} data-testid="card">
        <CardContent><p data-testid="text">Text</p></CardContent>
      </Card>
    );
    fireEvent.click(screen.getByTestId("text"));
    expect(cardClick).toHaveBeenCalledTimes(1);
  });

  it("applies pressed styles on Enter keyDown and clears on keyUp (Joule)", () => {
    render(
      <Card interactive design={CardDesign.Joule} data-testid="card">
        <CardContent>Body</CardContent>
      </Card>
    );
    const card = screen.getByTestId("card");
    const classesWithout = card.className;

    fireEvent.keyDown(card, { key: "Enter" });
    const classesWith = card.className;
    expect(classesWith).not.toBe(classesWithout);

    fireEvent.keyUp(card, { key: "Enter" });
    expect(card.className).toBe(classesWithout);
  });

  it("applies pressed styles on Space keyDown and clears on keyUp (Default)", () => {
    render(
      <Card interactive design={CardDesign.Default} data-testid="card">
        <CardContent>Body</CardContent>
      </Card>
    );
    const card = screen.getByTestId("card");
    const classesWithout = card.className;

    fireEvent.keyDown(card, { key: " " });
    const classesWith = card.className;
    expect(classesWith).not.toBe(classesWithout);
    expect(classesWith).toContain("border-sapphire-border-active");

    fireEvent.keyUp(card, { key: " " });
    expect(card.className).toBe(classesWithout);
  });

  it("mouseDown on nested button does NOT apply pressed styles to card", () => {
    render(
      <Card interactive design={CardDesign.Default} data-testid="card">
        <CardContent>
          <button data-testid="inner-btn">Inner</button>
        </CardContent>
      </Card>
    );
    const card = screen.getByTestId("card");
    const classesAtRest = card.className;

    fireEvent.mouseDown(screen.getByTestId("inner-btn"));
    expect(card.className).toBe(classesAtRest);
  });

  it("keyDown on nested button does NOT apply pressed styles to card", () => {
    const cardClick = vi.fn();
    render(
      <Card interactive design={CardDesign.Default} data-testid="card">
        <CardContent>
          <button data-testid="inner-btn">Inner</button>
        </CardContent>
      </Card>
    );
    const card = screen.getByTestId("card");
    const classesAtRest = card.className;

    fireEvent.keyDown(screen.getByTestId("inner-btn"), { key: "Enter" });
    expect(card.className).toBe(classesAtRest);
    expect(cardClick).not.toHaveBeenCalled();

    fireEvent.keyDown(screen.getByTestId("inner-btn"), { key: " " });
    expect(card.className).toBe(classesAtRest);
  });

  it("clears pressed styles on mouse leave", () => {
    render(
      <Card interactive design={CardDesign.Default} data-testid="card">
        <CardContent>Body</CardContent>
      </Card>
    );
    const card = screen.getByTestId("card");
    const classesAtRest = card.className;

    fireEvent.mouseDown(card);
    expect(card.className).not.toBe(classesAtRest);

    fireEvent.mouseLeave(card);
    expect(card.className).toBe(classesAtRest);
  });

  it("forwards onMouseLeave when interactive and pressed", () => {
    const onMouseLeave = vi.fn();
    render(
      <Card interactive onMouseLeave={onMouseLeave} design={CardDesign.Default} data-testid="card">
        <CardContent>Body</CardContent>
      </Card>
    );
    const card = screen.getByTestId("card");
    fireEvent.mouseDown(card);
    fireEvent.mouseLeave(card);
    expect(onMouseLeave).toHaveBeenCalledTimes(1);
  });

  it("isNestedInteractive does not escape card boundary", () => {
    const cardClick = vi.fn();
    render(
      <div role="button" data-testid="outer-button">
        <Card interactive onClick={cardClick} data-testid="card">
          <CardContent><p data-testid="text">Text</p></CardContent>
        </Card>
      </div>
    );
    fireEvent.click(screen.getByTestId("text"));
    expect(cardClick).toHaveBeenCalledTimes(1);
  });

  it("onBlur on toolbar wrapper only fires when focus leaves entirely", () => {
    const onBlur = vi.fn();
    const { container } = render(
      <Card
        interactive
        onBlur={onBlur}
        data-testid="card"
        toolbar={<button data-testid="tb-btn">Edit</button>}
      >
        <CardContent>Body</CardContent>
      </Card>
    );

    const tbBtn = screen.getByTestId("tb-btn");
    const wrapper = container.querySelector("[data-part='card-toolbar-wrapper']")!;

    // Focus moves from card to toolbar button — blur should NOT fire
    fireEvent.blur(wrapper, { relatedTarget: tbBtn });
    expect(onBlur).not.toHaveBeenCalled();

    // Focus leaves entirely — blur should fire
    fireEvent.blur(wrapper, { relatedTarget: null });
    expect(onBlur).toHaveBeenCalledTimes(1);
  });
});

// ============================================================================
// CARD HEADER – STATUS VARIANTS
// ============================================================================

describe("CardHeader status variants", () => {
  it.each([
    CardHeaderStatus.None,
    CardHeaderStatus.Positive,
    CardHeaderStatus.Negative,
    CardHeaderStatus.Critical,
    CardHeaderStatus.Information,
  ])("renders additionalText with status=%s - BLI: EL-339", (status) => {
    render(
      <CardHeader
        titleText="Title"
        additionalText="Extra"
        status={status}
        data-testid="hdr"
      />
    );
    expect(screen.getByText("Extra")).toBeInTheDocument();
    expect(screen.getByText("Extra").closest("[data-part='additional-text']")).toBeInTheDocument();
  });
});

// ============================================================================
// CARD HEADER – AVATAR SLOT
// ============================================================================

describe("CardHeader avatar slot", () => {
  it("renders avatar when provided - BLI: EL-339", () => {
    render(
      <CardHeader
        titleText="User"
        avatar={<span data-testid="avatar-icon">AV</span>}
      />
    );
    expect(screen.getByTestId("avatar-icon")).toBeInTheDocument();
  });

  it("wraps avatar in data-part=avatar container - BLI: EL-339", () => {
    const { container } = render(
      <CardHeader titleText="User" avatar={<span>AV</span>} />
    );
    expect(container.querySelector("[data-part='avatar']")).toBeInTheDocument();
  });

  it("does not render avatar container when avatar is not provided - BLI: EL-339", () => {
    const { container } = render(<CardHeader titleText="User" />);
    expect(container.querySelector("[data-part='avatar']")).not.toBeInTheDocument();
  });
});

// ============================================================================
// CARD HEADER – ACTION SLOT
// ============================================================================

describe("CardHeader action slot", () => {
  it("renders action when provided - BLI: EL-339", () => {
    render(
      <CardHeader
        titleText="Title"
        action={<button data-testid="action-btn">Act</button>}
      />
    );
    expect(screen.getByTestId("action-btn")).toBeInTheDocument();
  });

  it("wraps action in data-part=action container - BLI: EL-339", () => {
    const { container } = render(
      <CardHeader titleText="Title" action={<button>Act</button>} />
    );
    expect(container.querySelector("[data-part='action']")).toBeInTheDocument();
  });

  it("stops click propagation from action slot", () => {
    const cardClick = vi.fn();
    const actionClick = vi.fn();
    render(
      <Card
        interactive
        onClick={cardClick}
        header={
          <CardHeader
            titleText="Title"
            action={<button data-testid="action-btn" onClick={actionClick}>Act</button>}
          />
        }
      >
        <CardContent>Body</CardContent>
      </Card>
    );
    fireEvent.click(screen.getByTestId("action-btn"));
    expect(actionClick).toHaveBeenCalled();
    expect(cardClick).not.toHaveBeenCalled();
  });

  it("suppresses ring when action is focused", () => {
    const { container } = render(
      <Card
        interactive
        header={
          <CardHeader
            titleText="Title"
            action={<button data-testid="action-btn">Act</button>}
          />
        }
      >
        <CardContent>Body</CardContent>
      </Card>
    );
    const actionWrapper = container.querySelector("[data-part='action']")!;
    fireEvent.focus(actionWrapper);
    fireEvent.blur(actionWrapper);
    expect(actionWrapper).toBeInTheDocument();
  });
});

// ============================================================================
// CARD HEADER – STRUCTURE
// ============================================================================

describe("CardHeader structure", () => {
  it("action is outside content-area (sibling)", () => {
    const { container } = render(
      <CardHeader
        titleText="Title"
        action={<button data-testid="action-btn">Act</button>}
      />
    );

    const headerRoot = container.querySelector("[data-part='header-root']")!;
    const contentArea = container.querySelector("[data-part='content-area']")!;
    const actionWrapper = container.querySelector("[data-part='action']")!;
    expect(headerRoot.contains(actionWrapper)).toBe(true);
    expect(contentArea.contains(actionWrapper)).toBe(false);
  });

  it("does not have interactive-area data-part", () => {
    const { container } = render(
      <CardHeader titleText="Title" />
    );
    expect(container.querySelector("[data-part='interactive-area']")).not.toBeInTheDocument();
  });

  it("does not have button role", () => {
    const { container } = render(
      <CardHeader titleText="Title" action={<button>Act</button>} />
    );
    const headerRoot = container.querySelector("[data-part='header-root']")!;
    expect(headerRoot).not.toHaveAttribute("role", "button");
  });

  it("action button is keyboard accessible", async () => {
    const user = userEvent.setup();
    const actionClick = vi.fn();

    render(
      <Card
        interactive
        data-testid="card"
        header={
          <CardHeader
            titleText="Title"
            action={<button data-testid="action-btn" onClick={actionClick}>Act</button>}
          />
        }
      >
        <CardContent>Body</CardContent>
      </Card>
    );

    // Focus card first
    const card = screen.getByTestId("card");
    card.focus();

    // Tab to action button
    await user.tab();

    const actionBtn = screen.getByTestId("action-btn");
    expect(document.activeElement).toBe(actionBtn);

    await user.keyboard("{Enter}");
    expect(actionClick).toHaveBeenCalled();
  });

  it("content-area contains avatar and title", () => {
    const { container } = render(
      <CardHeader
        titleText="Title"
        avatar={<div data-testid="avatar">AV</div>}
        action={<button>Act</button>}
      />
    );

    const contentArea = container.querySelector("[data-part='content-area']")!;
    const avatar = screen.getByTestId("avatar");
    const title = screen.getByText("Title");

    expect(contentArea.contains(avatar)).toBe(true);
    expect(contentArea.contains(title)).toBe(true);
  });

  it("title has heading role when Card is not interactive", () => {
    render(
      <Card header={<CardHeader titleText="Title" />}>
        <CardContent>Body</CardContent>
      </Card>
    );
    const title = screen.getByText("Title");
    expect(title).toHaveAttribute("role", "heading");
  });

  it("title has heading role regardless of Card interactivity", () => {
    render(
      <Card interactive header={<CardHeader titleText="Title" action={<button>Act</button>} />}>
        <CardContent>Body</CardContent>
      </Card>
    );
    const title = screen.getByText("Title");
    expect(title).toHaveAttribute("role", "heading");
    expect(title).toHaveAttribute("aria-level", "3");
  });
});

// ============================================================================
// CARD HEADER – ACCESSIBILITY
// ============================================================================

describe("CardHeader accessibility", () => {
  it("applies accessibleName as aria-label - BLI: EL-339", () => {
    const { container } = render(<CardHeader titleText="T" accessibleName="My card header" />);
    const headerRoot = container.querySelector("[data-part='header-root']")!;
    expect(headerRoot).toHaveAttribute("aria-label", "My card header");
  });

  it("applies accessibleNameRef as aria-labelledby - BLI: EL-339", () => {
    const { container } = render(<CardHeader titleText="T" accessibleNameRef="title-el" />);
    const headerRoot = container.querySelector("[data-part='header-root']")!;
    expect(headerRoot).toHaveAttribute("aria-labelledby", "title-el");
  });

  it("applies accessibleDescriptionRef as aria-describedby - BLI: EL-339", () => {
    const { container } = render(<CardHeader titleText="T" accessibleDescriptionRef="desc-el" />);
    const headerRoot = container.querySelector("[data-part='header-root']")!;
    expect(headerRoot).toHaveAttribute("aria-describedby", "desc-el");
  });

  it("renders heading with aria-level when not interactive - BLI: EL-339", () => {
    render(
      <Card header={<CardHeader titleText="T" ariaLevel={4} />}>
        <CardContent>Body</CardContent>
      </Card>
    );
    const heading = screen.getByRole("heading");
    expect(heading).toHaveAttribute("aria-level", "4");
  });
});

// ============================================================================
// CARD HEADER – REF
// ============================================================================

describe("CardHeader ref", () => {
  it("exposes focus, blur, isFocused and nativeElement via ref - BLI: EL-339", () => {
    const ref = React.createRef<CardHeaderRef>();
    render(
      <Card header={<CardHeader ref={ref} titleText="Ref test" />}>
        <CardContent>Body</CardContent>
      </Card>
    );
    expect(ref.current).not.toBeNull();
    expect(ref.current!.nativeElement).toBeInstanceOf(HTMLElement);

    ref.current!.focus();
    expect(ref.current!.isFocused()).toBe(true);

    ref.current!.blur();
    expect(ref.current!.isFocused()).toBe(false);
  });
});

// ============================================================================
// CARD CONTENT – BRANCH COVERAGE
// ============================================================================

describe("CardContent", () => {
  it("renders children inside data-part=content - BLI: EL-339", () => {
    const { container } = render(<CardContent>Hello</CardContent>);
    const el = container.querySelector("[data-part='content']")!;
    expect(el).toBeInTheDocument();
    expect(el.textContent).toBe("Hello");
  });

  it("applies custom className and style - BLI: EL-339", () => {
    render(<CardContent className="custom" style={{ padding: "8px" }} data-testid="cc">X</CardContent>);
    const el = screen.getByTestId("cc");
    expect(el).toHaveClass("custom");
    expect(el).toHaveStyle({ padding: "8px" });
  });

  it("forwards ref - BLI: EL-339", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<CardContent ref={ref}>Test</CardContent>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

// ============================================================================
// CARD FOOTER – BRANCH COVERAGE
// ============================================================================

describe("CardFooter", () => {
  it("renders children inside data-part=footer - BLI: EL-339", () => {
    const { container } = render(<CardFooter><button>OK</button></CardFooter>);
    const el = container.querySelector("[data-part='footer']")!;
    expect(el).toBeInTheDocument();
    expect(el.textContent).toBe("OK");
  });

  it("applies custom className and style - BLI: EL-339", () => {
    render(<CardFooter className="my-footer" style={{ gap: "4px" }} data-testid="cf">X</CardFooter>);
    const el = screen.getByTestId("cf");
    expect(el).toHaveClass("my-footer");
    expect(el).toHaveStyle({ gap: "4px" });
  });

  it("forwards ref - BLI: EL-339", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<CardFooter ref={ref}>Test</CardFooter>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
