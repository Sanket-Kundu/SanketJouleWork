import { useState, useRef } from "react";
import { ResponsivePopover, Button } from "@sap-ui/fx-components";
import { CodeBlock } from "./components/CodeBlock";

export function ResponsivePopoverPage() {
  // Basic
  const basicBtnRef = useRef<HTMLButtonElement>(null);
  const [basicOpen, setBasicOpen] = useState(false);

  // Content only on desktop
  const contentOnlyBtnRef = useRef<HTMLButtonElement>(null);
  const [contentOnlyOpen, setContentOnlyOpen] = useState(false);

  // Custom header + footer
  const customBtnRef = useRef<HTMLButtonElement>(null);
  const [customOpen, setCustomOpen] = useState(false);

  // No close button
  const noCloseBtnRef = useRef<HTMLButtonElement>(null);
  const [noCloseOpen, setNoCloseOpen] = useState(false);

  return (
    <div className="space-y-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">ResponsivePopover</h1>
        <code className="text-sm text-primary/70 font-mono">{'import { ResponsivePopover } from "@sap-ui/fx-components"'}</code>
      </header>

      {/* Info */}
      <section className="p-4 border border-border rounded-lg bg-muted/50">
        <div className="text-sm text-secondary-foreground">
          <strong>ResponsivePopover</strong> renders as a{" "}
          <strong>Popover on desktop/tablet</strong> and a{" "}
          <strong>full-screen Dialog on phone</strong>. Detection is
          device-based (touch + screen size), not viewport-width based —
          matching UI5 Web Components behavior. On a desktop browser, it
          always renders as a Popover regardless of window size.
        </div>
      </section>

      {/* Basic */}
      <section id="basic" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Basic</h2>
        <p className="text-secondary-foreground mb-4">
          On desktop this renders as a Popover. On a real phone device it
          renders as a full-screen Dialog (device detection uses touch +
          screen size, matching UI5 behavior).
        </p>
        <div className="flex items-start gap-4">
          <Button
            ref={basicBtnRef}
            onClick={() => setBasicOpen((prev) => !prev)}
          >
            Open ResponsivePopover
          </Button>
          <ResponsivePopover
            opener={basicBtnRef}
            open={basicOpen}
            headerText="Details"
            placement="Bottom"
            horizontalAlign="Start"
            onClose={() => setBasicOpen(false)}
          >
            <div style={{ width: 260 }}>
              <p className="text-sm text-secondary-foreground">
                This is a basic ResponsivePopover with a header and simple text content.
                On desktop it renders as a Popover, on phone as a full-screen Dialog.
              </p>
            </div>
          </ResponsivePopover>
        </div>
      </section>

      {/* Content Only on Desktop */}
      <section id="content-only-on-desktop" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Content Only on Desktop</h2>
        <p className="text-secondary-foreground mb-4">
          With <code className="bg-muted px-1 rounded">contentOnlyOnDesktop=true</code>,
          the header and footer are hidden in Popover mode but shown in Dialog mode (phone).
        </p>
        <div className="flex items-start gap-4">
          <Button
            ref={contentOnlyBtnRef}
            onClick={() => setContentOnlyOpen((prev) => !prev)}
          >
            Open (Content Only on Desktop)
          </Button>
          <ResponsivePopover
            opener={contentOnlyBtnRef}
            open={contentOnlyOpen}
            headerText="This header is hidden on desktop"
            placement="Bottom"
            horizontalAlign="Start"
            contentOnlyOnDesktop
            footer={
              <Button design="Primary" onClick={() => setContentOnlyOpen(false)}>
                Done
              </Button>
            }
            onClose={() => setContentOnlyOpen(false)}
          >
            <div style={{ width: 250 }}>
              <p className="text-sm text-secondary-foreground">
                On desktop, only this content is visible — no header or footer.
                On phone, the header and footer will appear.
              </p>
            </div>
          </ResponsivePopover>
        </div>
      </section>

      {/* Custom Header + Footer */}
      <section id="custom-header-footer" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Custom Header & Footer</h2>
        <p className="text-secondary-foreground mb-4">
          Custom <code className="bg-muted px-1 rounded">header</code> and{" "}
          <code className="bg-muted px-1 rounded">footer</code> props are
          passed through to both Popover and Dialog modes.
        </p>
        <div className="flex items-start gap-4">
          <Button
            ref={customBtnRef}
            onClick={() => setCustomOpen((prev) => !prev)}
          >
            Open with Custom Header
          </Button>
          <ResponsivePopover
            opener={customBtnRef}
            open={customOpen}
            placement="Bottom"
            horizontalAlign="Start"
            header={
              <div className="flex items-center gap-3 px-sapphire-s py-sapphire-xs border-b border-sapphire-border-primary">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                  JS
                </div>
                <div>
                  <div className="font-semibold text-sm">Jane Smith</div>
                  <div className="text-xs text-secondary-foreground">Product Manager</div>
                </div>
              </div>
            }
            footer={
              <div className="flex justify-end gap-2">
                <Button design="Primary" onClick={() => setCustomOpen(false)}>
                  View Profile
                </Button>
                <Button onClick={() => setCustomOpen(false)}>Close</Button>
              </div>
            }
            onClose={() => setCustomOpen(false)}
          >
            <div style={{ width: 280 }} className="space-y-2 text-sm">
              <p className="text-secondary-foreground">Team: Design Systems</p>
              <p className="text-secondary-foreground">Location: Walldorf, Germany</p>
              <p className="text-secondary-foreground">Projects: 12 active</p>
            </div>
          </ResponsivePopover>
        </div>
      </section>

      {/* No Close Button */}
      <section id="without-close-button-phone" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Without Close Button (Phone)</h2>
        <p className="text-secondary-foreground mb-4">
          Set <code className="bg-muted px-1 rounded">showCloseButton=false</code> to
          hide the close button in the Dialog header on phone. Users must use the
          footer actions or Escape to close.
        </p>
        <div className="flex items-start gap-4">
          <Button
            ref={noCloseBtnRef}
            onClick={() => setNoCloseOpen((prev) => !prev)}
          >
            Open (No Close Button)
          </Button>
          <ResponsivePopover
            opener={noCloseBtnRef}
            open={noCloseOpen}
            headerText="Confirmation"
            placement="Bottom"
            horizontalAlign="Start"
            showCloseButton={false}
            footer={
              <div className="flex justify-end gap-2">
                <Button design="Primary" onClick={() => setNoCloseOpen(false)}>
                  Confirm
                </Button>
                <Button onClick={() => setNoCloseOpen(false)}>Cancel</Button>
              </div>
            }
            onClose={() => setNoCloseOpen(false)}
          >
            <div style={{ width: 260 }}>
              <p className="text-sm text-secondary-foreground">
                Are you sure you want to proceed? On phone, there is no close button
                — use the footer actions or Escape key.
              </p>
            </div>
          </ResponsivePopover>
        </div>
      </section>

      {/* Usage Example */}
      <section id="usage-example" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-4">Usage Example</h2>
        <CodeBlock language="tsx" code={`import { ResponsivePopover, Button } from '@sap-ui/fx-components';
import { useState, useRef } from 'react';

function MyComponent() {
  const buttonRef = useRef(null);
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button ref={buttonRef} onClick={() => setOpen(true)}>
        Open
      </Button>
      <ResponsivePopover
        opener={buttonRef}
        open={open}
        headerText="Settings"
        placement="Bottom"
        onClose={() => setOpen(false)}
      >
        <p>Renders as Popover on desktop, Dialog on phone</p>
      </ResponsivePopover>
    </>
  );
}`} />
      </section>
    </div>
  );
}
