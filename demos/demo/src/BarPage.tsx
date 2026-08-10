import { useRef, useState } from "react";
import {
  Bar, Button, ButtonDesign, Title, Text,
  SplitButton, SegmentedButton, SegmentedButtonItem,
  Tag, Avatar, AvatarShape, AvatarSize, AvatarColorScheme,
  Breadcrumbs, BreadcrumbsItem,
} from "@sap-ui/fx-components";
import type { BarRef } from "@sap-ui/fx-components";
import { ArrowLeft, Save, Share2, MoreHorizontal, Search, Settings, Bell, Play, ChevronDown, Eye, Paintbrush, Code, ClipboardList } from "lucide-react";
import { CodeBlock } from "./components/CodeBlock";

export function BarPage() {
  const barRef = useRef<BarRef>(null);
  const [refInfo, setRefInfo] = useState("");
  const [devViewMode, setDevViewMode] = useState("view");

  return (
    <div className="space-y-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Bar</h1>
        <code className="text-sm text-primary/70 font-mono">{'import { Bar } from "@sap-ui/fx-components"'}</code>
      </header>

      {/* Application Toolbar Bars (Figma reference) */}
      <section id="application-toolbar-bars" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Application Toolbar Bars</h2>
        <p className="text-secondary-foreground mb-4">
          Real-world toolbar bars as seen in SAP application headers, combining avatars, badges, split buttons, and segmented controls.
        </p>
        <div className="space-y-4">
          {/* Bar 1: Load Optimization Solution */}
          <div className="border border-border rounded-lg overflow-hidden">
            <Bar
              startContent={
                <div className="flex items-center gap-2">
                  <Avatar size={AvatarSize.XS} shape={AvatarShape.Square} colorScheme={AvatarColorScheme.Accent1} initials="LO" />
                  <Button design={ButtonDesign.Tertiary} endIcon={<ChevronDown className="h-3.5 w-3.5" />}>
                    LoadOpt
                  </Button>
                  <Tag design="None">R.1.1</Tag>
                </div>
              }
              endContent={
                <div className="flex items-center gap-1">
                  <SplitButton text="Open" icon={<ClipboardList className="h-4 w-4" />} />
                  <Button design={ButtonDesign.Primary} icon={<Play className="h-4 w-4" />}>Run</Button>
                  <Button design={ButtonDesign.Tertiary} icon={<MoreHorizontal className="h-4 w-4" />} iconOnly tooltip="More actions" />
                  <Button design={ButtonDesign.Tertiary} icon={<ClipboardList className="h-4 w-4" />} iconOnly tooltip="Task list" />
                </div>
              }
            />
          </div>

          {/* Bar 2: Development / Requirements Development */}
          <div className="border border-border rounded-lg overflow-hidden">
            <Bar
              startContent={
                <div className="flex items-center gap-2">
                  <Avatar size={AvatarSize.XS} shape={AvatarShape.Square} colorScheme={AvatarColorScheme.Accent1} initials="RD" />
                  <Text className="font-medium whitespace-nowrap">Development</Text>
                </div>
              }
              endContent={
                <div className="flex items-center gap-1">
                  <Button design={ButtonDesign.Primary} icon={<Play className="h-4 w-4" />}>Build</Button>
                  <Button design={ButtonDesign.Tertiary} icon={<Share2 className="h-4 w-4" />} iconOnly tooltip="Share" />
                  <Button design={ButtonDesign.Tertiary} icon={<MoreHorizontal className="h-4 w-4" />} iconOnly tooltip="More actions" />
                  <Button design={ButtonDesign.Tertiary} icon={<ClipboardList className="h-4 w-4" />} iconOnly tooltip="Task list" />
                </div>
              }
            >
              <SegmentedButton
                onSelectionChange={(detail) => setDevViewMode(detail.selectedItem.id)}
              >
                <SegmentedButtonItem id="view" text="View" selected={devViewMode === "view"} />
                <SegmentedButtonItem id="code" text="Code" selected={devViewMode === "code"} />
              </SegmentedButton>
            </Bar>
          </div>
        </div>
      </section>

      {/* Default Header Bar */}
      <section id="header-bar-default" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Header Bar (Default)</h2>
        <p className="text-secondary-foreground mb-4">
          The default design. Used as a page header with start, middle, and end content zones.
        </p>
        <div className="border border-border rounded-lg overflow-hidden">
          <Bar
            startContent={
              <Button design={ButtonDesign.Tertiary} icon={<ArrowLeft className="h-4 w-4" />} iconOnly tooltip="Back" />
            }
            endContent={
              <div className="flex items-center gap-1">
                <Button design={ButtonDesign.Tertiary} icon={<Search className="h-4 w-4" />} iconOnly tooltip="Search" />
                <Button design={ButtonDesign.Tertiary} icon={<Bell className="h-4 w-4" />} iconOnly tooltip="Notifications" />
                <Button design={ButtonDesign.Tertiary} icon={<Settings className="h-4 w-4" />} iconOnly tooltip="Settings" />
              </div>
            }
          >
            <Title level="H4">Product Details</Title>
          </Bar>
        </div>
      </section>

      {/* Subheader Bar */}
      <section id="subheader-bar" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Subheader Bar</h2>
        <p className="text-secondary-foreground mb-4">
          Slightly taller than Header. Typically placed directly below a Header bar.
        </p>
        <div className="border border-border rounded-lg overflow-hidden">
          <Bar design="Header">
            <Title level="H4">Main Header</Title>
          </Bar>
          <Bar design="Subheader">
            <span className="text-sm text-secondary-foreground">Subheader with additional context</span>
          </Bar>
        </div>
      </section>

      {/* Footer Bar */}
      <section id="footer-bar" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Footer Bar</h2>
        <p className="text-secondary-foreground mb-4">
          Used at the bottom of a page or dialog. Has a top border and no shadow.
        </p>
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="h-32 flex items-center justify-center text-secondary-foreground text-sm">
            Page content area
          </div>
          <Bar
            design="Footer"
            endContent={
              <div className="flex items-center gap-1">
                <Button>Cancel</Button>
                <Button design="Primary">Save</Button>
              </div>
            }
          />
        </div>
      </section>

      {/* Floating Footer Bar */}
      <section id="floating-footer-bar" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Floating Footer Bar</h2>
        <p className="text-secondary-foreground mb-4">
          Has rounded corners and a drop shadow. Floats above the page content.
        </p>
        <div className="relative bg-muted/30 rounded-lg p-6">
          <div className="h-24 flex items-center justify-center text-secondary-foreground text-sm mb-4">
            Page content area
          </div>
          <div className="px-4">
            <Bar
              design="FloatingFooter"
              endContent={
                <div className="flex items-center gap-1">
                  <Button>Reject</Button>
                  <Button design="Primary">Accept</Button>
                </div>
              }
            >
              <span className="text-sm">2 items require your approval</span>
            </Bar>
          </div>
        </div>
      </section>

      {/* All Design Variants Side by Side */}
      <section id="all-design-variants" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">All Design Variants</h2>
        <p className="text-secondary-foreground mb-4">
          Comparison of all four designs.
        </p>
        <div className="space-y-4">
          {(["Header", "Subheader", "Footer", "FloatingFooter"] as const).map((design) => (
            <div key={design}>
              <div className="text-sm font-medium mb-1">{design}</div>
              <div className="border border-border rounded-lg overflow-hidden">
                <Bar
                  design={design}
                  startContent={<span className="text-sm font-medium">Start</span>}
                  endContent={<span className="text-sm font-medium">End</span>}
                >
                  <span className="text-sm">{design} Design</span>
                </Bar>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Three Content Zones */}
      <section id="content-zones" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Content Zones</h2>
        <p className="text-secondary-foreground mb-4">
          The Bar has three zones: <code>startContent</code> (left), <code>children</code> (centered), and <code>endContent</code> (right).
        </p>
        <div className="space-y-4">
          <div>
            <div className="text-sm font-medium mb-1">All three zones</div>
            <div className="border border-border rounded-lg overflow-hidden">
              <Bar
                startContent={
                  <Button design={ButtonDesign.Tertiary} icon={<ArrowLeft className="h-4 w-4" />} iconOnly tooltip="Back" />
                }
                endContent={
                  <div className="flex items-center gap-1">
                    <Button className="h-8 px-3 text-xs" icon={<Share2 className="h-3 w-3" />}>
                      Share
                    </Button>
                    <Button className="h-8 px-3 text-xs" design="Primary" icon={<Save className="h-3 w-3" />}>
                      Save
                    </Button>
                  </div>
                }
              >
                <Title level="H4">Document Title</Title>
              </Bar>
            </div>
          </div>
          <div>
            <div className="text-sm font-medium mb-1">Middle only</div>
            <div className="border border-border rounded-lg overflow-hidden">
              <Bar>
                <Title level="H4">Centered Title Only</Title>
              </Bar>
            </div>
          </div>
          <div>
            <div className="text-sm font-medium mb-1">Start and end only (no middle)</div>
            <div className="border border-border rounded-lg overflow-hidden">
              <Bar
                startContent={<span className="text-sm font-medium">Navigation</span>}
                endContent={<Button className="h-8 px-3 text-xs">Action</Button>}
              />
            </div>
          </div>
          <div>
            <div className="text-sm font-medium mb-1">Empty bar</div>
            <div className="border border-border rounded-lg overflow-hidden">
              <Bar />
            </div>
          </div>
        </div>
      </section>

      {/* Accessible Role */}
      <section id="accessible-role" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Accessible Role</h2>
        <p className="text-secondary-foreground mb-4">
          Use <code>accessibleRole="Toolbar"</code> when the bar has 2+ interactive elements.
          Use <code>"None"</code> for decorative or single-element bars.
        </p>
        <div className="space-y-4">
          <div>
            <div className="text-sm font-medium mb-1">role="toolbar" (default)</div>
            <div className="border border-border rounded-lg overflow-hidden">
              <Bar
                accessibleName="Page actions toolbar"
                endContent={
                  <div className="flex items-center gap-1">
                    <Button className="h-8 px-3 text-xs">Edit</Button>
                    <Button className="h-8 px-3 text-xs">Delete</Button>
                    <Button design={ButtonDesign.Tertiary} icon={<MoreHorizontal className="h-4 w-4" />} iconOnly tooltip="More actions" />
                  </div>
                }
              >
                <Title level="H4">With Toolbar Role</Title>
              </Bar>
            </div>
          </div>
          <div>
            <div className="text-sm font-medium mb-1">role=none (decorative)</div>
            <div className="border border-border rounded-lg overflow-hidden">
              <Bar accessibleRole="None">
                <Title level="H4">Decorative Header</Title>
              </Bar>
            </div>
          </div>
        </div>
      </section>

      {/* Ref Methods */}
      <section id="ref-methods" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Ref Methods</h2>
        <p className="text-secondary-foreground mb-4">
          The Bar exposes <code>focus()</code>, <code>blur()</code>, <code>isFocused()</code>, and <code>nativeElement</code> via ref.
        </p>
        <div className="border border-border rounded-lg overflow-hidden">
          <Bar ref={barRef} tabIndex={-1}>
            <Title level="H4">Focusable Bar</Title>
          </Bar>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Button
            className="h-8 px-3 text-xs"
            onClick={() => {
              barRef.current?.focus();
              setTimeout(() => setRefInfo(`focus() called, isFocused: ${barRef.current?.isFocused()}`));
            }}
          >
            Focus Bar
          </Button>
          <Button
            className="h-8 px-3 text-xs"
            onClick={() => {
              barRef.current?.blur();
              setTimeout(() => setRefInfo(`blur() called, isFocused: ${barRef.current?.isFocused()}`));
            }}
          >
            Blur Bar
          </Button>
          <Button
            className="h-8 px-3 text-xs"
            onClick={() => {
              setRefInfo(`nativeElement tagName: ${barRef.current?.nativeElement?.tagName}`);
            }}
          >
            Get Element
          </Button>
        </div>
        {refInfo && (
          <div className="mt-2 p-3 bg-muted rounded-md font-mono text-sm">{refInfo}</div>
        )}
      </section>

      {/* Centering Behavior (min-width trade-off) */}
      <section id="centering-behavior" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Centering Behavior</h2>
        <p className="text-secondary-foreground mb-4">
          The middle zone is centered in the <em>remaining</em> space between start and end — not the full bar width.
          When start/end content is asymmetric, the title shifts off-center.
        </p>
        <div className="space-y-4">
          <div>
            <div className="text-sm font-medium mb-1">Symmetric start/end — title is centered</div>
            <div className="border border-border rounded-lg overflow-hidden">
              <Bar
                startContent={<Button design={ButtonDesign.Tertiary} icon={<ArrowLeft className="h-4 w-4" />} iconOnly tooltip="Back" />}
                endContent={<Button design={ButtonDesign.Tertiary} icon={<Settings className="h-4 w-4" />} iconOnly tooltip="Settings" />}
              >
                <Title level="H4">Centered Title</Title>
              </Bar>
            </div>
          </div>
          <div>
            <div className="text-sm font-medium mb-1">Heavy end content — title shifts left</div>
            <div className="border border-border rounded-lg overflow-hidden">
              <Bar
                startContent={<Button design={ButtonDesign.Tertiary} icon={<ArrowLeft className="h-4 w-4" />} iconOnly tooltip="Back" />}
                endContent={
                  <div className="flex items-center gap-1">
                    <Button className="h-8 px-3 text-xs">Edit</Button>
                    <Button className="h-8 px-3 text-xs">Share</Button>
                    <Button className="h-8 px-3 text-xs">Export</Button>
                    <Button className="h-8 px-3 text-xs" design="Primary">Save</Button>
                  </div>
                }
              >
                <Title level="H4">Off-Center Title</Title>
              </Bar>
            </div>
            <p className="text-xs text-secondary-foreground mt-1">
              In UI5, a ResizeObserver reserves ~30% min-width per zone so the title stays closer to true center.
              Our CSS-only approach lets zones size to their content, so large end content pushes the middle zone left.
            </p>
          </div>
        </div>
      </section>

      {/* Overflow Behavior */}
      <section id="overflow-behavior" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Overflow Behavior</h2>
        <p className="text-secondary-foreground mb-4">
          Long content is clipped. No horizontal scrollbar appears.
        </p>
        <div className="max-w-md border border-border rounded-lg overflow-hidden">
          <Bar
            startContent={<span className="text-sm">Start content that is quite long</span>}
            endContent={<span className="text-sm">End content that is also long</span>}
          >
            <span className="text-sm">
              This is a very long middle content that should be clipped when the bar is narrow
            </span>
          </Bar>
        </div>
      </section>

      {/* API Reference */}
      <section id="api-reference" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-4">API Reference</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Bar Props</h3>
            <div className="bg-muted rounded-md p-4 text-sm font-mono overflow-auto">
              <pre>{`interface BarProps {
  design?: "Header" | "Subheader" | "Footer" | "FloatingFooter";
  startContent?: ReactNode;
  children?: ReactNode;        // middle content
  endContent?: ReactNode;
  accessibleRole?: "Toolbar" | "None";
  accessibleName?: string;
  accessibleNameRef?: string;
  className?: string;
  style?: CSSProperties;
  id?: string;
  "data-testid"?: string;
}`}</pre>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Usage Example</h3>
            <div className="bg-muted rounded-md p-4 text-sm font-mono overflow-auto">
              <pre>{`import { Bar, Title, Button } from '@sap-ui/fx-components';

// Page header
<Bar
  startContent={<Button icon={<ArrowLeft />} />}
  endContent={<Button>Save</Button>}
>
  <Title>Page Title</Title>
</Bar>

// Footer with actions
<Bar design="Footer" endContent={
  <>
    <Button>Cancel</Button>
    <Button design="Primary">Submit</Button>
  </>
} />

// Floating footer
<Bar design="FloatingFooter">
  <span>Status message</span>
</Bar>`}</pre>
            </div>
          </div>
        </div>
      </section>
      {/* Usage Example */}
      <section id="usage-example" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-4">Usage Example</h2>
        <CodeBlock
          language="tsx"
          code={`import { Bar, Title, Button } from "@sap-ui/fx-components";

// Page header with start, middle, and end content
<Bar
  design="Header"
  startContent={<Button icon={<ArrowLeft />} />}
  endContent={
    <div className="flex gap-1">
      <Button>Share</Button>
      <Button design="Primary">Save</Button>
    </div>
  }
>
  <Title level="H4">Page Title</Title>
</Bar>

// Footer with actions
<Bar
  design="Footer"
  endContent={
    <>
      <Button>Cancel</Button>
      <Button design="Primary">Submit</Button>
    </>
  }
/>

// Floating footer with status message
<Bar design="FloatingFooter">
  <span>2 items selected</span>
</Bar>`}
        />
      </section>
    </div>
  );
}

export default BarPage;
