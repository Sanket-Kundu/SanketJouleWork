import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import React from "react";
import { IllustratedMessage } from "./IllustratedMessage";
import {
  IllustrationDesign,
} from "../../types/illustrated-message";
import type { IllustratedMessageRef } from "../../types/illustrated-message";
import { createIllustration } from "../../illustrations/createIllustration";

// ── ResizeObserver mock ──────────────────────────────────────────────────────

type ResizeCallback = (entries: ResizeObserverEntry[]) => void;

let resizeCallback: ResizeCallback | null = null;

class MockResizeObserver {
  constructor(cb: ResizeCallback) {
    resizeCallback = cb;
  }
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
}

beforeEach(() => {
  resizeCallback = null;
  vi.stubGlobal("ResizeObserver", MockResizeObserver);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

/** Simulate ResizeObserver firing with a given container width. */
function fireResize(width: number) {
  act(() => {
    resizeCallback?.([
      {
        contentBoxSize: [{ inlineSize: width, blockSize: 0 }],
        contentRect: { width } as DOMRectReadOnly,
        borderBoxSize: [],
        devicePixelContentBoxSize: [],
        target: document.createElement("div"),
      } as unknown as ResizeObserverEntry,
    ]);
  });
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const TestIllustration = () => (
  <svg data-testid="illustration-svg" />
);

// ── Tests ────────────────────────────────────────────────────────────────────

describe("IllustratedMessage", () => {
  // ── Basic rendering ────────────────────────────────────────────────────────

  it("renders without crashing (minimal props) - BLI: EL-339", () => {
    render(<IllustratedMessage />);
    expect(document.querySelector('[data-part="root"]')).toBeInTheDocument();
  });

  it("renders titleText - BLI: EL-339", () => {
    render(<IllustratedMessage titleText="Hello World" />);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  it("renders subtitleText - BLI: EL-339", () => {
    render(<IllustratedMessage subtitleText="A description" />);
    expect(screen.getByText("A description")).toBeInTheDocument();
  });

  it("renders custom title node (overrides titleText) - BLI: EL-339", () => {
    render(
      <IllustratedMessage
        titleText="text-title"
        title={<strong data-testid="custom-title">Custom</strong>}
      />
    );
    expect(screen.getByTestId("custom-title")).toBeInTheDocument();
    // titleText should not appear separately since title slot takes priority
    expect(screen.queryByText("text-title")).not.toBeInTheDocument();
  });

  it("renders custom subtitle node - BLI: EL-339", () => {
    render(
      <IllustratedMessage
        subtitle={<em data-testid="custom-sub">Custom sub</em>}
      />
    );
    expect(screen.getByTestId("custom-sub")).toBeInTheDocument();
  });

  it("does not render content section when neither title nor subtitle provided - BLI: EL-339", () => {
    render(<IllustratedMessage />);
    expect(document.querySelector('[data-part="content"]')).not.toBeInTheDocument();
  });

  it("renders illustration when design is not Base - BLI: EL-339", () => {
    render(
      <IllustratedMessage
        design={IllustrationDesign.Large}
        illustration={<TestIllustration />}
      />
    );
    expect(screen.getByTestId("illustration-svg")).toBeInTheDocument();
  });

  it("hides illustration when design is Base - BLI: EL-339", () => {
    render(
      <IllustratedMessage
        design={IllustrationDesign.Base}
        illustration={<TestIllustration />}
      />
    );
    expect(screen.queryByTestId("illustration-svg")).not.toBeInTheDocument();
  });

  it("does not render illustration wrapper when no illustration prop passed - BLI: EL-339", () => {
    render(<IllustratedMessage design={IllustrationDesign.Large} />);
    expect(document.querySelector('[data-part="illustration"]')).not.toBeInTheDocument();
  });

  // ── data-testid, id, className, style ─────────────────────────────────────

  it("forwards data-testid to root - BLI: EL-339", () => {
    render(<IllustratedMessage data-testid="im-root" />);
    expect(screen.getByTestId("im-root")).toBeInTheDocument();
  });

  it("applies id to root element - BLI: EL-339", () => {
    render(<IllustratedMessage id="my-msg" />);
    expect(document.getElementById("my-msg")).toBeInTheDocument();
  });

  it("applies className to root element - BLI: EL-339", () => {
    render(<IllustratedMessage className="extra-class" />);
    expect(document.querySelector('[data-part="root"]')!.className).toContain("extra-class");
  });

  it("applies inline style to root element - BLI: EL-339", () => {
    render(<IllustratedMessage style={{ color: "red" }} />);
    const root = document.querySelector('[data-part="root"]') as HTMLElement;
    expect(root.style.color).toBe("red");
  });

  // ── Actions (children) ─────────────────────────────────────────────────────

  it("renders children as actions for Large design - BLI: EL-339", () => {
    render(
      <IllustratedMessage design={IllustrationDesign.Large}>
        <button>Act</button>
      </IllustratedMessage>
    );
    expect(screen.getByRole("button", { name: "Act" })).toBeInTheDocument();
    expect(document.querySelector('[data-part="actions"]')).toBeInTheDocument();
  });

  it("renders children for Medium design - BLI: EL-339", () => {
    render(
      <IllustratedMessage design={IllustrationDesign.Medium}>
        <button>Act</button>
      </IllustratedMessage>
    );
    expect(document.querySelector('[data-part="actions"]')).toBeInTheDocument();
  });

  it("renders children for Small design - BLI: EL-339", () => {
    render(
      <IllustratedMessage design={IllustrationDesign.Small}>
        <button>Act</button>
      </IllustratedMessage>
    );
    expect(document.querySelector('[data-part="actions"]')).toBeInTheDocument();
  });

  it("renders actions for ExtraSmall design - BLI: EL-339", () => {
    render(
      <IllustratedMessage design={IllustrationDesign.ExtraSmall}>
        <button>Act</button>
      </IllustratedMessage>
    );
    expect(document.querySelector('[data-part="actions"]')).toBeInTheDocument();
  });

  it("hides actions for Base design - BLI: EL-339", () => {
    render(
      <IllustratedMessage design={IllustrationDesign.Base}>
        <button>Act</button>
      </IllustratedMessage>
    );
    expect(document.querySelector('[data-part="actions"]')).not.toBeInTheDocument();
  });

  it("does not render actions section when no children - BLI: EL-339", () => {
    render(<IllustratedMessage design={IllustrationDesign.Large} />);
    expect(document.querySelector('[data-part="actions"]')).not.toBeInTheDocument();
  });

  // ── Illustration accessibility ─────────────────────────────────────────────

  it("illustration has role=img by default - BLI: EL-339", () => {
    render(
      <IllustratedMessage
        design={IllustrationDesign.Large}
        illustration={<TestIllustration />}
      />
    );
    expect(document.querySelector('[data-part="illustration"]')).toHaveAttribute("role", "img");
  });

  it("illustration has role=presentation when decorative=true - BLI: EL-339", () => {
    render(
      <IllustratedMessage
        design={IllustrationDesign.Large}
        illustration={<TestIllustration />}
        decorative
      />
    );
    const illus = document.querySelector('[data-part="illustration"]')!;
    expect(illus).toHaveAttribute("role", "presentation");
    expect(illus).toHaveAttribute("aria-hidden", "true");
  });

  it("aria-hidden is not set when decorative=false - BLI: EL-339", () => {
    render(
      <IllustratedMessage
        design={IllustrationDesign.Large}
        illustration={<TestIllustration />}
        decorative={false}
      />
    );
    const illus = document.querySelector('[data-part="illustration"]')!;
    expect(illus).not.toHaveAttribute("aria-hidden");
  });

  it("applies accessibleName as aria-label on illustration when not decorative - BLI: EL-339", () => {
    render(
      <IllustratedMessage
        design={IllustrationDesign.Large}
        illustration={<TestIllustration />}
        accessibleName="Decorative art"
      />
    );
    const illus = document.querySelector('[data-part="illustration"]')!;
    expect(illus).toHaveAttribute("aria-label", "Decorative art");
  });

  it("does not apply aria-label on illustration when decorative - BLI: EL-339", () => {
    render(
      <IllustratedMessage
        design={IllustrationDesign.Large}
        illustration={<TestIllustration />}
        decorative
        accessibleName="Hidden name"
      />
    );
    const illus = document.querySelector('[data-part="illustration"]')!;
    expect(illus).not.toHaveAttribute("aria-label");
  });

  it("falls back to 'Illustration' aria-label when accessibleName is not provided", () => {
    render(
      <IllustratedMessage
        design={IllustrationDesign.Large}
        illustration={<TestIllustration />}
      />
    );
    const illus = document.querySelector('[data-part="illustration"]')!;
    expect(illus).toHaveAttribute("aria-label", "Illustration");
  });

  // ── Fixed design sizes ─────────────────────────────────────────────────────

  it.each([
    IllustrationDesign.Large,
    IllustrationDesign.Medium,
    IllustrationDesign.Small,
    IllustrationDesign.ExtraSmall,
    IllustrationDesign.Base,
  ])("renders without crashing for design=%s - BLI: EL-339", (design) => {
    render(
      <IllustratedMessage
        design={design}
        illustration={<TestIllustration />}
        titleText="T"
        subtitleText="S"
      >
        <button>A</button>
      </IllustratedMessage>
    );
    expect(document.querySelector('[data-part="root"]')).toBeInTheDocument();
  });

  // ── ExtraSmall layout ──────────────────────────────────────────────────────

  it("renders illustration for ExtraSmall design - BLI: EL-339", () => {
    render(
      <IllustratedMessage
        design={IllustrationDesign.ExtraSmall}
        illustration={<TestIllustration />}
      />
    );
    expect(screen.getByTestId("illustration-svg")).toBeInTheDocument();
  });

  it("content section has text-center class in ExtraSmall design - BLI: EL-339", () => {
    render(
      <IllustratedMessage
        design={IllustrationDesign.ExtraSmall}
        titleText="Title"
      />
    );
    const content = document.querySelector('[data-part="content"]')!;
    expect(content.className).toContain("text-center");
  });

  it("content section does not have text-left class for Large design - BLI: EL-339", () => {
    render(
      <IllustratedMessage design={IllustrationDesign.Large} titleText="Title" />
    );
    const content = document.querySelector('[data-part="content"]')!;
    // className should be undefined / not contain text-left
    expect(content.className || "").not.toContain("text-left");
  });

  // ── Auto design (ResizeObserver) ───────────────────────────────────────────

  it("defaults to Medium size in Auto mode before ResizeObserver fires - BLI: EL-339", () => {
    render(
      <IllustratedMessage
        design={IllustrationDesign.Auto}
        illustration={<TestIllustration />}
        titleText="Title"
      >
        <button>Act</button>
      </IllustratedMessage>
    );
    // Medium shows illustration and actions
    expect(screen.getByTestId("illustration-svg")).toBeInTheDocument();
    expect(document.querySelector('[data-part="actions"]')).toBeInTheDocument();
  });

  it("Auto: transitions to Large when ResizeObserver fires width > 681 - BLI: EL-339", () => {
    render(
      <IllustratedMessage
        design={IllustrationDesign.Auto}
        illustration={<TestIllustration />}
        titleText="Title"
      />
    );
    fireResize(700);
    const root = document.querySelector('[data-part="root"]')!;
    // Large has gap-4 p-4 in its class
    expect(root.className).toContain("gap-4");
  });

  it("Auto: transitions to Medium when ResizeObserver fires width in (260, 681] - BLI: EL-339", () => {
    render(
      <IllustratedMessage
        design={IllustrationDesign.Auto}
        illustration={<TestIllustration />}
      />
    );
    fireResize(400);
    const root = document.querySelector('[data-part="root"]')!;
    expect(root.className).toContain("gap-3");
  });

  it("Auto: transitions to Small when ResizeObserver fires width in (260, 360] - BLI: EL-339", () => {
    render(
      <IllustratedMessage
        design={IllustrationDesign.Auto}
        illustration={<TestIllustration />}
      />
    );
    fireResize(300);
    const root = document.querySelector('[data-part="root"]')!;
    expect(root.className).toContain("gap-2");
  });

  it("Auto: transitions to ExtraSmall when ResizeObserver fires width in (160, 260] - BLI: EL-339", () => {
    render(
      <IllustratedMessage
        design={IllustrationDesign.Auto}
        illustration={<TestIllustration />}
      />
    );
    fireResize(220);
    const root = document.querySelector('[data-part="root"]')!;
    expect(root.className).toContain("gap-3");
  });

  it("Auto: hides illustration when width <= 160 (Base) - BLI: EL-339", () => {
    render(
      <IllustratedMessage
        design={IllustrationDesign.Auto}
        illustration={<TestIllustration />}
        titleText="Title"
      />
    );
    fireResize(100);
    expect(screen.queryByTestId("illustration-svg")).not.toBeInTheDocument();
  });

  it("Auto: hides actions when width <= 160 (Base) - BLI: EL-339", () => {
    render(
      <IllustratedMessage design={IllustrationDesign.Auto}>
        <button>Act</button>
      </IllustratedMessage>
    );
    fireResize(100);
    expect(document.querySelector('[data-part="actions"]')).not.toBeInTheDocument();
  });

  it("Auto: shows actions when width <= 260 (ExtraSmall) - BLI: EL-339", () => {
    render(
      <IllustratedMessage design={IllustrationDesign.Auto}>
        <button>Act</button>
      </IllustratedMessage>
    );
    fireResize(200);
    expect(document.querySelector('[data-part="actions"]')).toBeInTheDocument();
  });

  // ── Imperative ref ─────────────────────────────────────────────────────────

  it("exposes nativeElement via ref - BLI: EL-339", () => {
    const ref = React.createRef<IllustratedMessageRef>();
    render(<IllustratedMessage ref={ref} data-testid="im" />);
    expect(ref.current).not.toBeNull();
    expect(ref.current!.nativeElement).toBeInstanceOf(HTMLDivElement);
  });

  it("nativeElement matches root DOM node - BLI: EL-339", () => {
    const ref = React.createRef<IllustratedMessageRef>();
    render(<IllustratedMessage ref={ref} data-testid="im-ref" />);
    const rootEl = screen.getByTestId("im-ref");
    expect(ref.current!.nativeElement).toBe(rootEl);
  });

  // ── String enum values ─────────────────────────────────────────────────────

  it("accepts string enum value 'Base' for design - BLI: EL-339", () => {
    render(
      <IllustratedMessage
        design="Base"
        illustration={<TestIllustration />}
        titleText="T"
      />
    );
    expect(screen.queryByTestId("illustration-svg")).not.toBeInTheDocument();
    expect(screen.getByText("T")).toBeInTheDocument();
  });

  it("accepts string enum value 'Large' for design - BLI: EL-339", () => {
    render(
      <IllustratedMessage
        design="Large"
        illustration={<TestIllustration />}
      />
    );
    expect(screen.getByTestId("illustration-svg")).toBeInTheDocument();
  });

  // ── Both title + subtitle together ────────────────────────────────────────

  it("renders both title and subtitle sections - BLI: EL-339", () => {
    render(
      <IllustratedMessage titleText="My Title" subtitleText="My Subtitle" />
    );
    expect(document.querySelector('[data-part="title"]')).toBeInTheDocument();
    expect(document.querySelector('[data-part="subtitle"]')).toBeInTheDocument();
  });

  it("renders only title section when only titleText provided - BLI: EL-339", () => {
    render(<IllustratedMessage titleText="Title only" />);
    expect(document.querySelector('[data-part="title"]')).toBeInTheDocument();
    expect(document.querySelector('[data-part="subtitle"]')).not.toBeInTheDocument();
  });

  it("renders only subtitle section when only subtitleText provided - BLI: EL-339", () => {
    render(<IllustratedMessage subtitleText="Sub only" />);
    expect(document.querySelector('[data-part="title"]')).not.toBeInTheDocument();
    expect(document.querySelector('[data-part="subtitle"]')).toBeInTheDocument();
  });
});

// ── createIllustration accessibility ─────────────────────────────────────────

describe("createIllustration – accessibleName fallback to name", () => {

  const dummySvg: React.FC<{ className?: string }> = () => (
    <svg data-testid="dummy-svg" />
  );
  const lazyDummy = () => Promise.resolve({ default: dummySvg });

  const TestIllustration = createIllustration({
    name: "NoData",
    title: "No data available",
    subtitle: "Try adjusting your filters",
    lazyExtraSmall: lazyDummy,
    lazySmall: lazyDummy,
    lazyMedium: lazyDummy,
    lazyLarge: lazyDummy,
  });

  it("uses illustration name as aria-label when accessibleName is not provided", async () => {
    render(<TestIllustration design="Large" />);
    // Wait for lazy SVG to resolve
    await screen.findByTestId("dummy-svg");
    const illus = document.querySelector('[data-part="illustration"]')!;
    expect(illus).toHaveAttribute("aria-label", "NoData");
  });

  it("prefers explicit accessibleName over illustration name", async () => {
    render(<TestIllustration design="Large" accessibleName="Custom label" />);
    await screen.findByTestId("dummy-svg");
    const illus = document.querySelector('[data-part="illustration"]')!;
    expect(illus).toHaveAttribute("aria-label", "Custom label");
  });

  it("does not set aria-label when decorative, even with name fallback", async () => {
    render(<TestIllustration design="Large" decorative />);
    await screen.findByTestId("dummy-svg");
    const illus = document.querySelector('[data-part="illustration"]')!;
    expect(illus).not.toHaveAttribute("aria-label");
  });
});
