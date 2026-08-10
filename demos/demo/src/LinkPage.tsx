import { useState } from "react";
import {
  Link,
  LinkDesign,
  LinkInteractiveAreaSize,
  LinkWrappingType,
  LinkAccessibleRole,
  LinkClickEventDetail,
} from "@sap-ui/fx-components";
import { ExternalLink, Download, ArrowRight, Home, LinkIcon } from "lucide-react";
import { CodeBlock } from "./components/CodeBlock";

export function LinkPage() {
  const [lastClick, setLastClick] = useState<string>("");

  const handleClick = (label: string) => (detail: LinkClickEventDetail) => {
    const modifiers = [];
    if (detail.altKey) modifiers.push("Alt");
    if (detail.ctrlKey) modifiers.push("Ctrl");
    if (detail.metaKey) modifiers.push("Cmd");
    if (detail.shiftKey) modifiers.push("Shift");

    const modifierStr = modifiers.length > 0 ? ` [${modifiers.join("+")}]` : "";
    const methodStr = detail.isKeyboard ? " (keyboard)" : " (mouse)";
    setLastClick(`${label}${modifierStr}${methodStr}`);
  };

  return (
    <div className="space-y-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Link</h1>
        <code className="text-sm text-primary/70 font-mono">{'import { Link } from "@sap-ui/fx-components"'}</code>
      </header>

      {lastClick && (
        <div className="p-4 bg-muted rounded-md">
          <p className="text-sm">
            <span className="font-semibold">Last clicked:</span> {lastClick}
          </p>
        </div>
      )}

      {/* Visual States */}
      <section id="visual-states" className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Visual States</h2>
          <p className="text-secondary-foreground text-sm">
            All design variants across interactive states. Hover, press, and focus the links to see state changes.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="text-sm">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-muted-foreground font-normal">Variant</th>
                <th className="px-4 py-2 text-left text-muted-foreground font-normal min-w-[120px]">Regular</th>
                <th className="px-4 py-2 text-left text-muted-foreground font-normal min-w-[120px]">Disabled</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-3 text-muted-foreground">Default</td>
                <td className="px-4 py-3">
                  <Link href="https://example.com" onClick={handleClick("Default")}>Link</Link>
                </td>
                <td className="px-4 py-3">
                  <Link href="https://example.com" disabled>Link</Link>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-muted-foreground">Subtle</td>
                <td className="px-4 py-3">
                  <Link href="https://example.com" design={LinkDesign.Subtle} onClick={handleClick("Subtle")}>Link</Link>
                </td>
                <td className="px-4 py-3">
                  <Link href="https://example.com" design={LinkDesign.Subtle} disabled>Link</Link>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-muted-foreground">Emphasized</td>
                <td className="px-4 py-3">
                  <Link href="https://example.com" design={LinkDesign.Emphasized} onClick={handleClick("Emphasized")}>Link</Link>
                </td>
                <td className="px-4 py-3">
                  <Link href="https://example.com" design={LinkDesign.Emphasized} disabled>Link</Link>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-muted-foreground">Default + Icon</td>
                <td className="px-4 py-3">
                  <Link href="https://example.com" endIcon={<LinkIcon className="w-3 h-3" />} onClick={handleClick("Default+Icon")}>Link</Link>
                </td>
                <td className="px-4 py-3">
                  <Link href="https://example.com" endIcon={<LinkIcon className="w-3 h-3" />} disabled>Link</Link>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-muted-foreground">Subtle + Icon</td>
                <td className="px-4 py-3">
                  <Link href="https://example.com" design={LinkDesign.Subtle} endIcon={<LinkIcon className="w-3 h-3" />} onClick={handleClick("Subtle+Icon")}>Link</Link>
                </td>
                <td className="px-4 py-3">
                  <Link href="https://example.com" design={LinkDesign.Subtle} endIcon={<LinkIcon className="w-3 h-3" />} disabled>Link</Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Design Variants */}
      <section id="design-variants" className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Design Variants</h2>
          <p className="text-secondary-foreground text-sm">
            Three design styles for different emphasis levels.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <Link
            href="https://example.com"
            design={LinkDesign.Default}
            onClick={handleClick("Default Link")}
          >
            Default Link
          </Link>

          <Link
            href="https://example.com"
            design={LinkDesign.Subtle}
            onClick={handleClick("Subtle Link")}
          >
            Subtle Link
          </Link>

          <Link
            href="https://example.com"
            design={LinkDesign.Emphasized}
            onClick={handleClick("Emphasized Link")}
          >
            Emphasized Link
          </Link>
        </div>
      </section>

      {/* With Icons */}
      <section id="with-icons" className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">With Icons</h2>
          <p className="text-secondary-foreground text-sm">
            Links can include icons at the start or end. Icons are 12px per Figma spec.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <Link
            href="https://example.com"
            icon={<Home className="w-3 h-3" />}
            onClick={handleClick("Home")}
          >
            Home
          </Link>

          <Link
            href="https://example.com"
            endIcon={<ExternalLink className="w-3 h-3" />}
            target="_blank"
            onClick={handleClick("External")}
          >
            External Link
          </Link>

          <Link
            href="/download"
            icon={<Download className="w-3 h-3" />}
            endIcon={<ArrowRight className="w-3 h-3" />}
            onClick={handleClick("Download")}
          >
            Download File
          </Link>
        </div>
      </section>

      {/* Interactive Area Sizes */}
      <section id="interactive-area-size" className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Interactive Area Size</h2>
          <p className="text-secondary-foreground text-sm">
            Large size provides better touch targets (WCAG 2.2 compliant).
          </p>
        </div>

        <div className="flex flex-wrap gap-6 items-center">
          <Link
            href="https://example.com"
            interactiveAreaSize={LinkInteractiveAreaSize.Normal}
            onClick={handleClick("Normal Size")}
          >
            Normal Size
          </Link>

          <Link
            href="https://example.com"
            interactiveAreaSize={LinkInteractiveAreaSize.Large}
            onClick={handleClick("Large Size")}
          >
            Large Size (Touch Friendly)
          </Link>
        </div>
      </section>

      {/* Text Wrapping */}
      <section id="text-wrapping" className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Text Wrapping</h2>
          <p className="text-secondary-foreground text-sm">
            Control how long text behaves: truncate or wrap.
          </p>
        </div>

        <div className="space-y-4 max-w-xs">
          <div>
            <p className="text-xs text-secondary-foreground mb-2">None (truncate):</p>
            <Link
              href="https://example.com"
              wrappingType={LinkWrappingType.None}
              onClick={handleClick("Truncated Link")}
            >
              This is a very long link text that should be truncated with an ellipsis
            </Link>
          </div>

          <div>
            <p className="text-xs text-secondary-foreground mb-2">Normal (wrap):</p>
            <Link
              href="https://example.com"
              wrappingType={LinkWrappingType.Normal}
              onClick={handleClick("Wrapped Link")}
            >
              This is a very long link text that should wrap to multiple lines naturally
            </Link>
          </div>
        </div>
      </section>

      {/* States */}
      <section id="states" className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">States</h2>
          <p className="text-secondary-foreground text-sm">
            Links can be disabled to prevent interaction.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <Link href="https://example.com" onClick={handleClick("Active Link")}>
            Active Link
          </Link>

          <Link
            href="https://example.com"
            disabled
            onClick={handleClick("Disabled Link")}
          >
            Disabled Link
          </Link>
        </div>
      </section>

      {/* Button Role */}
      <section id="button-role" className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Button Role</h2>
          <p className="text-secondary-foreground text-sm">
            Links without href can act as buttons (activated with Enter or Space).
          </p>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <Link
            accessibleRole={LinkAccessibleRole.Button}
            onClick={handleClick("Button Link")}
          >
            Trigger Action
          </Link>

          <Link
            accessibleRole={LinkAccessibleRole.Button}
            icon={<Download className="w-3 h-3" />}
            onClick={handleClick("Download Action")}
          >
            Download Without Navigation
          </Link>
        </div>
      </section>

      {/* Accessibility */}
      <section id="accessibility" className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Accessibility</h2>
          <p className="text-secondary-foreground text-sm">
            Links support ARIA attributes including aria-current for navigation context.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <Link
            href="https://example.com"
            accessibleName="Navigate to external website"
            tooltip="Opens in new tab"
            target="_blank"
            onClick={handleClick("Accessible Link")}
          >
            Visit Website
          </Link>

          <Link
            href="#section"
            accessibilityAttributes={{
              expanded: false,
              hasPopup: "menu",
            }}
            onClick={handleClick("Menu Link")}
          >
            Open Menu
          </Link>

          <Link
            href="/current-page"
            accessibilityAttributes={{ current: "page" }}
            onClick={handleClick("Current Page")}
          >
            Current Page (aria-current)
          </Link>
        </div>
      </section>

      {/* Example in Conversation */}
      <section id="example-in-conversation" className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Example in Conversation</h2>
          <p className="text-secondary-foreground text-sm">
            Links used inline within body text, matching the Figma spec.
          </p>
        </div>

        <div className="p-4 bg-muted/50 rounded-lg text-sm leading-5">
          <p>
            Your biggest quick win is{" "}
            <Link href="#disputes" onClick={handleClick("Disputes")}>
              resolving 8 open disputes worth $890K
            </Link>
            . I've flagged these as{" "}
            <span className="font-bold">critical path items</span>{" "}
            for this week. Right now you're tracking at{" "}
            <span className="font-bold">$0.9M released</span>{" "}
            (18% of goal) - ahead of plan!
          </p>
        </div>
      </section>

      {/* Combined Examples */}
      <section id="combined-examples" className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Combined Examples</h2>
          <p className="text-secondary-foreground text-sm">
            Real-world usage patterns combining multiple features.
          </p>
        </div>

        <div className="space-y-6">
          {/* Documentation link */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <h3 className="text-sm font-semibold mb-2">Documentation</h3>
            <Link
              href="/docs"
              design={LinkDesign.Default}
              endIcon={<ArrowRight className="w-3 h-3" />}
              onClick={handleClick("Docs")}
            >
              Read the documentation
            </Link>
          </div>

          {/* Download section */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <h3 className="text-sm font-semibold mb-2">Downloads</h3>
            <div className="flex flex-col gap-2">
              <Link
                href="/download/user-guide.pdf"
                icon={<Download className="w-3 h-3" />}
                onClick={handleClick("User Guide")}
              >
                User Guide (PDF)
              </Link>
              <Link
                href="/download/api-reference.pdf"
                icon={<Download className="w-3 h-3" />}
                onClick={handleClick("API Reference")}
              >
                API Reference (PDF)
              </Link>
            </div>
          </div>

          {/* External resources */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <h3 className="text-sm font-semibold mb-2">External Resources</h3>
            <div className="flex flex-col gap-2">
              <Link
                href="https://github.com/example"
                endIcon={<ExternalLink className="w-3 h-3" />}
                target="_blank"
                onClick={handleClick("GitHub")}
              >
                View on GitHub
              </Link>
              <Link
                href="https://example.com"
                design={LinkDesign.Subtle}
                endIcon={<ExternalLink className="w-3 h-3" />}
                target="_blank"
                onClick={handleClick("Website")}
              >
                Visit website
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Keyboard Navigation */}
      <section id="keyboard-navigation" className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Keyboard Navigation</h2>
          <p className="text-secondary-foreground text-sm">
            Try using Tab to focus and Enter to activate. Space works for button role links.
          </p>
        </div>

        <div className="p-4 border border-border rounded-lg space-y-2">
          <Link href="https://example.com" onClick={handleClick("Link 1")}>
            First Link (Enter)
          </Link>
          {" | "}
          <Link href="https://example.com" onClick={handleClick("Link 2")}>
            Second Link (Enter)
          </Link>
          {" | "}
          <Link
            accessibleRole={LinkAccessibleRole.Button}
            onClick={handleClick("Button Link")}
          >
            Button Link (Enter or Space)
          </Link>
        </div>
      </section>

      {/* Usage Example */}
      <section id="usage-example" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-4">Usage Example</h2>
        <CodeBlock
          language="tsx"
          code={`import { Link, LinkDesign } from "@sap-ui/fx-components";
import { ExternalLink } from "lucide-react";

function MyComponent() {
  return (
    <div>
      {/* Basic link */}
      <Link href="/dashboard">Go to Dashboard</Link>

      {/* External link — auto-adds rel="noreferrer noopener" */}
      <Link
        href="https://example.com"
        target="_blank"
        endIcon={<ExternalLink className="w-3 h-3" />}
      >
        Visit Website
      </Link>

      {/* Subtle and Emphasized designs */}
      <Link href="/help" design={LinkDesign.Subtle}>Help</Link>
      <Link href="/docs" design={LinkDesign.Emphasized}>Documentation</Link>

      {/* Disabled link */}
      <Link href="/restricted" disabled>Restricted Area</Link>

      {/* Button-role link (no navigation) */}
      <Link
        accessibleRole="Button"
        onClick={(detail) => console.log("Clicked", detail)}
      >
        Trigger Action
      </Link>

      {/* With aria-current for navigation */}
      <Link
        href="/current"
        accessibilityAttributes={{ current: "page" }}
      >
        Current Page
      </Link>
    </div>
  );
}`}
        />
      </section>
    </div>
  );
}
