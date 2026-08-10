import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { Link } from "./Link";
import {
  LinkDesign,
  LinkInteractiveAreaSize,
  LinkWrappingType,
  LinkAccessibleRole,
} from "../../types/link";
import type { LinkRef } from "../../types/link";

describe("Link", () => {
  // --- Rendering ---

  it("renders text content - BLI: EL-339", () => {
    render(<Link href="/test">Click me</Link>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("renders as an anchor element with href - BLI: EL-339", () => {
    render(<Link href="/test">Home</Link>);
    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
  });

  it("renders with the provided href - BLI: EL-339", () => {
    render(<Link href="/about">About</Link>);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/about");
  });

  it("renders with data-testid - BLI: EL-339", () => {
    render(<Link data-testid="my-link">Test</Link>);
    expect(screen.getByTestId("my-link")).toBeInTheDocument();
  });

  it("applies id, className, and style - BLI: EL-339", () => {
    render(
      <Link id="link-1" className="custom" style={{ color: "red" }}>
        Styled
      </Link>
    );
    const el = document.getElementById("link-1")!;
    expect(el).toBeInTheDocument();
    expect(el.className).toContain("custom");
    expect(el).toHaveStyle({ color: "rgb(255, 0, 0)" });
  });

  it("renders with data-part=root attribute - BLI: EL-339", () => {
    render(<Link href="/">Root</Link>);
    expect(screen.getByRole("link")).toHaveAttribute("data-part", "root");
  });

  // --- href when disabled ---

  it("removes href when disabled - BLI: EL-339", () => {
    render(<Link href="/page" disabled>Disabled</Link>);
    // A disabled link loses its href, which removes the implicit "link" role.
    // Query by the anchor element directly.
    const el = document.querySelector("a")!;
    expect(el).toBeInTheDocument();
    expect(el).not.toHaveAttribute("href");
  });

  it("keeps href when not disabled - BLI: EL-339", () => {
    render(<Link href="/page">Enabled</Link>);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/page");
  });

  // --- target and rel ---

  it("applies target attribute - BLI: EL-339", () => {
    render(
      <Link href="https://example.com" target="_blank">
        External
      </Link>
    );
    expect(screen.getByRole("link")).toHaveAttribute("target", "_blank");
  });

  it("applies explicit rel attribute - BLI: EL-339", () => {
    render(
      <Link href="https://example.com" rel="noopener noreferrer">
        Safe
      </Link>
    );
    expect(screen.getByRole("link")).toHaveAttribute("rel", "noopener noreferrer");
  });

  // --- Design Variants ---

  it.each(Object.values(LinkDesign))("renders with design=%s without crashing - BLI: EL-339", (design) => {
    render(<Link href="/page" design={design}>Design</Link>);
    expect(screen.getByRole("link")).toBeInTheDocument();
  });

  it("renders with default design when none is specified - BLI: EL-339", () => {
    render(<Link href="/">Default</Link>);
    expect(screen.getByRole("link")).toBeInTheDocument();
  });

  // --- Interactive Area Size ---

  it.each(Object.values(LinkInteractiveAreaSize))(
    "renders with interactiveAreaSize=%s",
    (size) => {
      render(<Link href="/page" interactiveAreaSize={size}>Size</Link>);
      expect(screen.getByRole("link")).toBeInTheDocument();
    }
  );

  // --- Wrapping Type ---

  it.each(Object.values(LinkWrappingType))("renders with wrappingType=%s - BLI: EL-339", (type) => {
    render(<Link href="/page" wrappingType={type}>Wrap</Link>);
    expect(screen.getByRole("link")).toBeInTheDocument();
  });

  // --- Icons ---

  it("renders start icon in icon slot - BLI: EL-339", () => {
    render(
      <Link href="/page" icon={<span data-testid="start-icon">★</span>}>With icon</Link>
    );
    expect(screen.getByTestId("start-icon")).toBeInTheDocument();
    const iconWrapper = screen.getByTestId("start-icon").parentElement!;
    expect(iconWrapper).toHaveAttribute("data-part", "icon");
  });

  it("renders end icon in end-icon slot - BLI: EL-339", () => {
    render(
      <Link href="/page" endIcon={<span data-testid="end-icon">→</span>}>With end icon</Link>
    );
    expect(screen.getByTestId("end-icon")).toBeInTheDocument();
    const iconWrapper = screen.getByTestId("end-icon").parentElement!;
    expect(iconWrapper).toHaveAttribute("data-part", "end-icon");
  });

  it("wraps text children in a data-part=text span - BLI: EL-339", () => {
    render(<Link href="/page">Text here</Link>);
    const textSpan = screen.getByText("Text here").closest("[data-part='text']");
    expect(textSpan).toBeInTheDocument();
  });

  it("does not render icon slot when icon is not provided - BLI: EL-339", () => {
    const { container } = render(<Link href="/page">No icon</Link>);
    expect(container.querySelector("[data-part='icon']")).not.toBeInTheDocument();
  });

  it("does not render end-icon slot when endIcon is not provided - BLI: EL-339", () => {
    const { container } = render(<Link href="/page">No end icon</Link>);
    expect(container.querySelector("[data-part='end-icon']")).not.toBeInTheDocument();
  });

  it("does not render text span when children is not provided - BLI: EL-339", () => {
    const { container } = render(<Link />);
    expect(container.querySelector("[data-part='text']")).not.toBeInTheDocument();
  });

  it("icon wrapper has size-3 class - BLI: EL-339", () => {
    render(
      <Link href="/page" icon={<span data-testid="ic">★</span>} endIcon={<span data-testid="eic">→</span>}>
        Text
      </Link>
    );
    const iconWrapper = screen.getByTestId("ic").parentElement!;
    expect(iconWrapper.className).toContain("size-3");
    const endIconWrapper = screen.getByTestId("eic").parentElement!;
    expect(endIconWrapper.className).toContain("size-3");
  });

  // --- Tooltip ---

  it("sets title attribute from tooltip prop - BLI: EL-339", () => {
    render(<Link href="/page" tooltip="More info">Info</Link>);
    expect(screen.getByRole("link")).toHaveAttribute("title", "More info");
  });

  // --- Disabled state ---

  it("applies aria-disabled when disabled - BLI: EL-339", () => {
    render(<Link disabled href="/page">Disabled</Link>);
    // Disabled link loses href → no implicit link role; query by element directly
    const el = document.querySelector("a")!;
    expect(el).toHaveAttribute("aria-disabled", "true");
  });

  it("applies disabled styling classes when disabled - BLI: EL-339", () => {
    render(<Link disabled href="/page">Disabled</Link>);
    const el = document.querySelector("a")!;
    expect(el.className).toContain("pointer-events-none");
    expect(el.className).toContain("cursor-default");
  });

  it("does not apply aria-disabled when not disabled - BLI: EL-339", () => {
    render(<Link href="/">Enabled</Link>);
    expect(screen.getByRole("link")).not.toHaveAttribute("aria-disabled");
  });

  // --- Click Handling ---

  it("calls onClick when clicked - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Link href="/page" onClick={handleClick}>Click me</Link>);
    await user.click(screen.getByRole("link"));
    expect(handleClick).toHaveBeenCalledOnce();
    expect(handleClick).toHaveBeenCalledWith(
      expect.objectContaining({ isKeyboard: false })
    );
  });

  it("does not call onClick when disabled and clicked - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Link disabled href="/page" onClick={handleClick}>Disabled</Link>);
    // Disabled link has no href → no implicit link role. Query by text.
    await user.click(screen.getByText("Disabled"));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("passes modifier keys in the click event detail - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Link href="/page" onClick={handleClick}>Click</Link>);
    await user.click(screen.getByRole("link"));
    expect(handleClick).toHaveBeenCalledWith(
      expect.objectContaining({
        altKey: expect.any(Boolean),
        ctrlKey: expect.any(Boolean),
        metaKey: expect.any(Boolean),
        shiftKey: expect.any(Boolean),
        originalEvent: expect.any(Object),
      })
    );
  });

  // --- Keyboard Handling ---

  it("calls onClick with isKeyboard=true on Enter - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Link href="/page" onClick={handleClick}>Press Enter</Link>);
    screen.getByRole("link").focus();
    await user.keyboard("{Enter}");
    expect(handleClick).toHaveBeenCalledWith(
      expect.objectContaining({ isKeyboard: true })
    );
  });

  it("calls onClick with isKeyboard=true on Space when role is Button - BLI: EL-339", () => {
    const handleClick = vi.fn();
    render(
      <Link accessibleRole={LinkAccessibleRole.Button} onClick={handleClick}>
        Press Space
      </Link>
    );
    const el = screen.getByRole("button");
    fireEvent.keyDown(el, { key: " ", code: "Space" });
    expect(handleClick).toHaveBeenCalledWith(
      expect.objectContaining({ isKeyboard: true })
    );
  });

  it("does NOT call onClick on Space when role is Link (default) - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Link href="/page" onClick={handleClick}>Press Space</Link>);
    screen.getByRole("link").focus();
    await user.keyboard(" ");
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("does not call onClick on keyboard when disabled - BLI: EL-339", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Link disabled href="/page" onClick={handleClick}>Disabled</Link>);
    // Disabled link loses href → no link role. Focus via the DOM element directly.
    const el = document.querySelector("a")!;
    el.focus();
    await user.keyboard("{Enter}");
    expect(handleClick).not.toHaveBeenCalled();
  });

  // --- Accessible Role ---

  it("renders with default link role by default - BLI: EL-339", () => {
    render(<Link href="/">Home</Link>);
    expect(screen.getByRole("link")).toBeInTheDocument();
  });

  it("renders with button role when accessibleRole=Button - BLI: EL-339", () => {
    render(<Link accessibleRole={LinkAccessibleRole.Button}>Action</Link>);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("renders with button role using string enum value - BLI: EL-339", () => {
    render(<Link accessibleRole="Button">Action</Link>);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("does not set role attribute when accessibleRole=Link - BLI: EL-339", () => {
    render(<Link href="/" accessibleRole={LinkAccessibleRole.Link}>Link</Link>);
    const el = screen.getByRole("link");
    // The role attribute should not be explicitly set (uses implicit link role from <a>)
    expect(el).not.toHaveAttribute("role");
  });

  // --- Accessibility Attributes ---

  it("applies aria-label from accessibleName - BLI: EL-339", () => {
    render(<Link href="/page" accessibleName="Visit homepage">Home</Link>);
    expect(screen.getByRole("link")).toHaveAttribute("aria-label", "Visit homepage");
  });

  it("applies aria-labelledby from accessibleNameRef - BLI: EL-339", () => {
    render(<Link href="/page" accessibleNameRef="label-id">Home</Link>);
    expect(screen.getByRole("link")).toHaveAttribute("aria-labelledby", "label-id");
  });

  it("applies aria-describedby from accessibleDescription - BLI: EL-339", () => {
    render(<Link href="/page" accessibleDescription="desc-id">Home</Link>);
    expect(screen.getByRole("link")).toHaveAttribute("aria-describedby", "desc-id");
  });

  it("applies aria-expanded from accessibilityAttributes - BLI: EL-339", () => {
    render(
      <Link href="/page" accessibilityAttributes={{ expanded: true }}>Toggle</Link>
    );
    expect(screen.getByRole("link")).toHaveAttribute("aria-expanded", "true");
  });

  it("applies aria-haspopup from accessibilityAttributes - BLI: EL-339", () => {
    render(
      <Link href="/page" accessibilityAttributes={{ hasPopup: "menu" }}>Menu</Link>
    );
    expect(screen.getByRole("link")).toHaveAttribute("aria-haspopup", "menu");
  });

  // --- aria-current ---

  it("applies aria-current=page from accessibilityAttributes - BLI: EL-339", () => {
    render(
      <Link href="/page" accessibilityAttributes={{ current: "page" }}>Current</Link>
    );
    expect(screen.getByRole("link")).toHaveAttribute("aria-current", "page");
  });

  it("applies aria-current=true from accessibilityAttributes - BLI: EL-339", () => {
    render(
      <Link href="/page" accessibilityAttributes={{ current: true }}>Current</Link>
    );
    expect(screen.getByRole("link")).toHaveAttribute("aria-current", "true");
  });

  it("does not set aria-current when not provided - BLI: EL-339", () => {
    render(<Link href="/page">No current</Link>);
    expect(screen.getByRole("link")).not.toHaveAttribute("aria-current");
  });

  it("applies aria-current=step from accessibilityAttributes - BLI: EL-339", () => {
    render(
      <Link href="/page" accessibilityAttributes={{ current: "step" }}>Step</Link>
    );
    expect(screen.getByRole("link")).toHaveAttribute("aria-current", "step");
  });

  // --- Ref (imperative handle) ---

  it("exposes focus/blur/isFocused/nativeElement via ref - BLI: EL-339", () => {
    const ref = React.createRef<LinkRef>();
    render(<Link ref={ref} href="/">Ref test</Link>);

    expect(ref.current).not.toBeNull();
    expect(ref.current!.nativeElement).toBeInstanceOf(HTMLAnchorElement);

    ref.current!.focus();
    expect(ref.current!.isFocused()).toBe(true);

    ref.current!.blur();
    expect(ref.current!.isFocused()).toBe(false);
  });

  it("nativeElement is valid after mount - BLI: EL-339", () => {
    const ref = React.createRef<LinkRef>();
    render(<Link ref={ref} href="/page">Ref</Link>);
    expect(ref.current!.nativeElement).not.toBeNull();
    expect(ref.current!.nativeElement).toBeInstanceOf(HTMLAnchorElement);
  });

  // --- Visual CSS class verification ---

  describe("Visual Styling (Sapphire tokens)", () => {
    it("Default design applies accent color and no underline - BLI: EL-339", () => {
      render(<Link href="/page" design={LinkDesign.Default}>Default</Link>);
      const el = screen.getByRole("link");
      expect(el.className).toContain("text-sapphire-text-accent");
      expect(el.className).toContain("no-underline");
    });

    it("Subtle design applies secondary-foreground color and dotted underline on text span - BLI: EL-339", () => {
      render(<Link href="/page" design={LinkDesign.Subtle}>Subtle</Link>);
      const el = screen.getByRole("link");
      expect(el.className).toContain("text-secondary-foreground");
      const textSpan = el.querySelector('[data-part="text"]')!;
      expect(textSpan.className).toContain("underline");
      expect(textSpan.className).toContain("decoration-dotted");
    });

    it("Emphasized design applies font-semibold accent color and no underline - BLI: EL-339", () => {
      render(<Link href="/page" design={LinkDesign.Emphasized}>Emphasized</Link>);
      const el = screen.getByRole("link");
      expect(el.className).toContain("font-semibold");
      expect(el.className).toContain("no-underline");
      expect(el.className).toContain("text-sapphire-text-accent");
    });

    it("Default design includes hover underline on text span and active color classes - BLI: EL-339", () => {
      render(<Link href="/page" design={LinkDesign.Default}>Default</Link>);
      const el = screen.getByRole("link");
      expect(el.className).toContain("hover:text-sapphire-brand-hover-background");
      expect(el.className).toContain("active:text-sapphire-brand-pressed-foreground");
      const textSpan = el.querySelector('[data-part="text"]')!;
      expect(textSpan.className).toContain("group-hover:underline");
      expect(textSpan.className).toContain("group-hover:decoration-dotted");
    });

    it("Default design with icon still underlines text span on hover - BLI: EL-339", () => {
      render(
        <Link href="/page" design={LinkDesign.Default} icon={<span>ic</span>}>
          With icon
        </Link>
      );
      const el = screen.getByRole("link");
      const textSpan = el.querySelector('[data-part="text"]')!;
      expect(textSpan.className).toContain("group-hover:underline");
      expect(textSpan.className).toContain("group-hover:decoration-dotted");
    });

    it("Subtle design includes hover and active color classes - BLI: EL-339", () => {
      render(<Link href="/page" design={LinkDesign.Subtle}>Subtle</Link>);
      const el = screen.getByRole("link");
      expect(el.className).toContain("hover:text-sapphire-brand-hover-background");
      expect(el.className).toContain("active:text-sapphire-brand-pressed-foreground");
    });

    it("base classes include focus-visible border - BLI: EL-339", () => {
      render(<Link href="/page">Focusable</Link>);
      const el = screen.getByRole("link");
      expect(el.className).toContain("focus-visible:border-sapphire-border-focus");
      expect(el.className).toContain("rounded-[4px]");
    });

    it("base classes use font-normal weight - BLI: EL-339", () => {
      render(<Link href="/page">Normal weight</Link>);
      const el = screen.getByRole("link");
      expect(el.className).toContain("font-normal");
    });

    it("uses gap-0.5 for icon spacing - BLI: EL-339", () => {
      render(<Link href="/page">Gap check</Link>);
      const el = screen.getByRole("link");
      expect(el.className).toContain("gap-0.5");
    });

    it("Large interactiveAreaSize applies leading-6 - BLI: EL-339", () => {
      render(<Link href="/page" interactiveAreaSize={LinkInteractiveAreaSize.Large}>Large</Link>);
      const el = screen.getByRole("link");
      expect(el.className).toContain("leading-6");
    });

    it("wrappingType None applies truncation classes - BLI: EL-339", () => {
      render(<Link href="/page" wrappingType={LinkWrappingType.None}>Truncate</Link>);
      const el = screen.getByRole("link");
      expect(el.className).toContain("whitespace-nowrap");
      // Ellipsis and overflow are on the inner text span, not on the <a>
      const textSpan = screen.getByText("Truncate").closest("[data-part='text']")!;
      expect(textSpan.className).toContain("text-ellipsis");
      expect(textSpan.className).toContain("overflow-hidden");
      expect(textSpan.className).toContain("min-w-0");
    });

    it("wrappingType Normal applies wrapping classes - BLI: EL-339", () => {
      render(<Link href="/page" wrappingType={LinkWrappingType.Normal}>Wrap</Link>);
      const el = screen.getByRole("link");
      expect(el.className).toContain("whitespace-normal");
      expect(el.className).toContain("break-words");
    });
  });

  // --- tabIndex / focus accessibility ---

  it("defaults tabIndex to 0 for links with href - ACC fix", () => {
    render(<Link href="/page">Focusable</Link>);
    expect(screen.getByRole("link")).toHaveAttribute("tabindex", "0");
  });

  it("defaults tabIndex to 0 for button-role links without href - ACC fix", () => {
    render(<Link accessibleRole={LinkAccessibleRole.Button}>Action</Link>);
    expect(screen.getByRole("button")).toHaveAttribute("tabindex", "0");
  });

  it("sets tabIndex to -1 when disabled - ACC fix", () => {
    render(<Link href="/page" disabled>Disabled</Link>);
    const el = document.querySelector("a")!;
    expect(el).toHaveAttribute("tabindex", "-1");
  });

  it("honours explicit tabIndex prop over default - ACC fix", () => {
    render(<Link href="/page" tabIndex={-1}>Hidden from tab</Link>);
    expect(screen.getByRole("link")).toHaveAttribute("tabindex", "-1");
  });

  it("ignores explicit tabIndex={0} when link is disabled - ACC fix", () => {
    render(<Link href="/page" disabled tabIndex={0}>Disabled</Link>);
    const el = document.querySelector("a")!;
    expect(el).toHaveAttribute("tabindex", "-1");
  });

  // --- Truncation / ellipsis on text span ---

  it("applies ellipsis classes on text span when wrappingType=None - ACC fix", () => {
    render(<Link href="/page" wrappingType={LinkWrappingType.None}>Long text</Link>);
    const textSpan = screen.getByText("Long text").closest("[data-part='text']")!;
    expect(textSpan.className).toContain("overflow-hidden");
    expect(textSpan.className).toContain("text-ellipsis");
    expect(textSpan.className).toContain("min-w-0");
  });

  it("does not apply ellipsis classes on text span when wrappingType=Normal - ACC fix", () => {
    render(<Link href="/page" wrappingType={LinkWrappingType.Normal}>Long text</Link>);
    const textSpan = screen.getByText("Long text").closest("[data-part='text']")!;
    expect(textSpan.className).not.toContain("overflow-hidden");
    expect(textSpan.className).not.toContain("text-ellipsis");
  });

  // --- Design type screen reader announcement ---

  it("renders sr-only 'Subtle' text for Subtle design - ACC fix", () => {
    const { container } = render(<Link href="/page" design={LinkDesign.Subtle}>Link</Link>);
    const srSpan = container.querySelector("[data-part='link-type']")!;
    expect(srSpan).toBeInTheDocument();
    expect(srSpan.textContent).toBeTruthy();
    expect(srSpan.className).toContain("sr-only");
  });

  it("renders sr-only 'Emphasized' text for Emphasized design - ACC fix", () => {
    const { container } = render(<Link href="/page" design={LinkDesign.Emphasized}>Link</Link>);
    const srSpan = container.querySelector("[data-part='link-type']")!;
    expect(srSpan).toBeInTheDocument();
    expect(srSpan.textContent).toBeTruthy();
    expect(srSpan.className).toContain("sr-only");
  });

  it("does not render link-type span for Default design - ACC fix", () => {
    const { container } = render(<Link href="/page" design={LinkDesign.Default}>Link</Link>);
    expect(container.querySelector("[data-part='link-type']")).not.toBeInTheDocument();
  });

  it("does not render link-type span when no design is specified - ACC fix", () => {
    const { container } = render(<Link href="/page">Link</Link>);
    expect(container.querySelector("[data-part='link-type']")).not.toBeInTheDocument();
  });

  // --- Auto cross-origin rel ---

  describe("Auto cross-origin rel", () => {
    it("auto-adds rel for cross-origin _blank links - BLI: EL-339", () => {
      render(
        <Link href="https://external.example.com" target="_blank">
          External
        </Link>
      );
      expect(screen.getByRole("link")).toHaveAttribute("rel", "noreferrer noopener");
    });

    it("does not auto-add rel for same-origin _blank links - BLI: EL-339", () => {
      render(
        <Link href="/page" target="_blank">
          Same origin
        </Link>
      );
      expect(screen.getByRole("link")).not.toHaveAttribute("rel");
    });

    it("explicit rel prop takes precedence over auto-rel - BLI: EL-339", () => {
      render(
        <Link href="https://external.example.com" target="_blank" rel="nofollow">
          With explicit rel
        </Link>
      );
      expect(screen.getByRole("link")).toHaveAttribute("rel", "nofollow");
    });

    it("does not add rel without target=_blank - BLI: EL-339", () => {
      render(
        <Link href="https://external.example.com">
          No target
        </Link>
      );
      expect(screen.getByRole("link")).not.toHaveAttribute("rel");
    });
  });

  // --- SEC-100: URL Protocol Injection Protection ---

  describe("SEC-100: URL Protocol Injection Protection", () => {
    let originalDescriptor: PropertyDescriptor | undefined;
    let mockHref: (value: string) => void;

    beforeEach(() => {
      // Capture the current descriptor at the start of each test
      originalDescriptor = Object.getOwnPropertyDescriptor(window, "location");
      mockHref = vi.fn();

      Object.defineProperty(window, "location", {
        configurable: true,
        enumerable: true,
        value: {
          href: "http://localhost/",
          assign: vi.fn(),
          replace: vi.fn(),
        },
      });

      Object.defineProperty(window.location, "href", {
        configurable: true,
        enumerable: true,
        get: () => "http://localhost/",
        set: mockHref,
      });
    });

    afterEach(() => {
      if (originalDescriptor) {
        Object.defineProperty(window, "location", originalDescriptor);
      }
    });

    it("blocks javascript: protocol URLs on keyboard navigation", () => {
      render(<Link href="javascript:alert('XSS')">Malicious Link</Link>);

      const link = screen.getByRole("link");
      link.focus();
      fireEvent.keyDown(link, { key: "Enter", code: "Enter" });

      expect(mockHref).not.toHaveBeenCalled();
    });

    it("blocks data: protocol URLs on keyboard navigation", () => {
      render(<Link href="data:text/html,<script>alert('XSS')</script>">Malicious Link</Link>);

      const link = screen.getByRole("link");
      link.focus();
      fireEvent.keyDown(link, { key: "Enter", code: "Enter" });

      expect(mockHref).not.toHaveBeenCalled();
    });

    it("blocks javascript: URLs with mixed case", () => {
      render(<Link href="JaVaScRiPt:alert('XSS')">Malicious Link</Link>);

      const link = screen.getByRole("link");
      link.focus();
      fireEvent.keyDown(link, { key: "Enter", code: "Enter" });

      expect(mockHref).not.toHaveBeenCalled();
    });

    it("allows https: URLs on keyboard navigation", () => {
      render(<Link href="https://example.com">Safe Link</Link>);

      const link = screen.getByRole("link");
      link.focus();
      fireEvent.keyDown(link, { key: "Enter", code: "Enter" });

      expect(mockHref).toHaveBeenCalledWith("https://example.com");
    });

    it("allows http: URLs on keyboard navigation", () => {
      render(<Link href="http://example.com">Safe Link</Link>);

      const link = screen.getByRole("link");
      link.focus();
      fireEvent.keyDown(link, { key: "Enter", code: "Enter" });

      expect(mockHref).toHaveBeenCalledWith("http://example.com");
    });

    it("allows mailto: URLs on keyboard navigation", () => {
      render(<Link href="mailto:user@example.com">Email Link</Link>);

      const link = screen.getByRole("link");
      link.focus();
      fireEvent.keyDown(link, { key: "Enter", code: "Enter" });

      expect(mockHref).toHaveBeenCalledWith("mailto:user@example.com");
    });

    it("allows tel: URLs on keyboard navigation", () => {
      render(<Link href="tel:+1234567890">Phone Link</Link>);

      const link = screen.getByRole("link");
      link.focus();
      fireEvent.keyDown(link, { key: "Enter", code: "Enter" });

      expect(mockHref).toHaveBeenCalledWith("tel:+1234567890");
    });

    it("allows relative URLs on keyboard navigation", () => {
      render(<Link href="/dashboard">Relative Link</Link>);

      const link = screen.getByRole("link");
      link.focus();
      fireEvent.keyDown(link, { key: "Enter", code: "Enter" });

      expect(mockHref).toHaveBeenCalledWith("/dashboard");
    });

    it("blocks other dangerous protocols like vbscript:", () => {
      render(<Link href="vbscript:msgbox('XSS')">Malicious Link</Link>);

      const link = screen.getByRole("link");
      link.focus();
      fireEvent.keyDown(link, { key: "Enter", code: "Enter" });

      expect(mockHref).not.toHaveBeenCalled();
    });

    it("blocks blob: URLs", () => {
      render(<Link href="blob:http://example.com/uuid">Blob Link</Link>);

      const link = screen.getByRole("link");
      link.focus();
      fireEvent.keyDown(link, { key: "Enter", code: "Enter" });

      expect(mockHref).not.toHaveBeenCalled();
    });
  });
});
