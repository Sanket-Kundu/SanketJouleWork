import { useState, useRef } from "react";
import { CodeBlock } from "./components/CodeBlock";
import {
  Popover,
  PopoverPlacement,
  PopoverHorizontalAlign,
  PopoverVerticalAlign,
  Button,
  NotificationList,
  NotificationListItem,
  NotificationListItemState,
  Avatar,
  AvatarColorScheme,
  CheckBox,
} from "@sap-ui/fx-components";
import { useAppLocale } from "./main";

export function PopoverPage() {
  const { locale } = useAppLocale();

  // Basic popover
  const basicBtnRef = useRef<HTMLButtonElement>(null);
  const [basicOpen, setBasicOpen] = useState(false);

  // Custom header/footer
  const customBtnRef = useRef<HTMLButtonElement>(null);
  const [customOpen, setCustomOpen] = useState(false);

  // Custom header (rich)
  const customHeaderBtnRef = useRef<HTMLButtonElement>(null);
  const [customHeaderOpen, setCustomHeaderOpen] = useState(false);

  // Placement demos
  const topBtnRef = useRef<HTMLButtonElement>(null);
  const bottomBtnRef = useRef<HTMLButtonElement>(null);
  const startBtnRef = useRef<HTMLButtonElement>(null);
  const endBtnRef = useRef<HTMLButtonElement>(null);
  const [placementOpen, setPlacementOpen] = useState<string | null>(null);

  // Horizontal alignment
  const hCenterRef = useRef<HTMLButtonElement>(null);
  const hStartRef = useRef<HTMLButtonElement>(null);
  const hEndRef = useRef<HTMLButtonElement>(null);
  const hStretchRef = useRef<HTMLButtonElement>(null);
  const [hAlignOpen, setHAlignOpen] = useState<string | null>(null);

  // Arrow options
  const arrowBtnRef = useRef<HTMLButtonElement>(null);
  const [arrowOpen, setArrowOpen] = useState(false);
  const [hideArrow, setHideArrow] = useState(false);

  // Resizable
  const resizeBtnRef = useRef<HTMLButtonElement>(null);
  const [resizeOpen, setResizeOpen] = useState(false);

  // Focus management
  const focusBtnRef = useRef<HTMLButtonElement>(null);
  const [focusOpen, setFocusOpen] = useState(false);

  // Events
  const eventBtnRef = useRef<HTMLButtonElement>(null);
  const [eventOpen, setEventOpen] = useState(false);
  const [eventLog, setEventLog] = useState<string[]>([]);
  const logEvent = (name: string) => {
    setEventLog((prev) => [
      `${new Date().toLocaleTimeString()} - ${name}`,
      ...prev.slice(0, 9),
    ]);
  };

  // Chained popovers
  const chainedBtnRef = useRef<HTMLButtonElement>(null);
  const [chainedOpen, setChainedOpen] = useState(false);
  const chainedInnerBtnRef = useRef<HTMLButtonElement>(null);
  const [chainedInnerOpen, setChainedInnerOpen] = useState(false);

  // Hidden borders
  const hiddenBorderBtnRef = useRef<HTMLButtonElement>(null);
  const [hiddenBorderOpen, setHiddenBorderOpen] = useState(false);

  return (
    <div className="space-y-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Popover</h1>
        <code className="text-sm text-primary/70 font-mono">{'import { Popover } from "@sap-ui/fx-components"'}</code>
      </header>

      {/* Locale Info */}
      <section className="p-4 border border-border rounded-lg bg-muted/50">
        <div className="flex items-center gap-4 text-sm">
          <span>
            <strong>Current Locale:</strong> {locale}
          </span>
        </div>
      </section>

      {/* Basic Popover with headerText */}
      <section id="basic-popover-headertext" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Basic Popover (headerText)</h2>
        <p className="text-secondary-foreground mb-4">
          Uses the <code className="bg-muted px-1 rounded">headerText</code> prop for a simple text header.
        </p>
        <div className="flex items-start gap-4">
          <Button
            ref={basicBtnRef}
            onClick={() => setBasicOpen((prev) => !prev)}
          >
            {basicOpen ? "Close Popover" : "Open Popover"}
          </Button>
          <Popover
            opener={basicBtnRef}
            open={basicOpen}
            headerText="Newsletter Subscription"
            placement="Bottom"
            horizontalAlign="Start"
            onClose={() => setBasicOpen(false)}
          >
            <div style={{ width: 280 }}>
              <p className="text-sm text-secondary-foreground">
                Subscribe to receive our weekly newsletter with the latest
                updates and announcements.
              </p>
            </div>
          </Popover>
          <div className="p-3 bg-muted rounded-md font-mono text-sm">
            <strong>Open:</strong> {basicOpen ? "true" : "false"}
          </div>
        </div>
      </section>

      {/* Popover with headerText + footer */}
      <section id="header-text-footer" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Header Text + Footer</h2>
        <p className="text-secondary-foreground mb-4">
          Combines <code className="bg-muted px-1 rounded">headerText</code> with
          a <code className="bg-muted px-1 rounded">footer</code> prop containing action buttons.
        </p>
        <div className="flex items-start gap-4">
          <Button
            ref={customBtnRef}
            onClick={() => setCustomOpen((prev) => !prev)}
          >
            Open Popover with Footer
          </Button>
          <Popover
            opener={customBtnRef}
            open={customOpen}
            headerText="Confirm Action"
            placement="Bottom"
            horizontalAlign="Start"
            footer={
              <div className="flex justify-end gap-2">
                <Button design="Primary" onClick={() => setCustomOpen(false)}>Confirm</Button>
                <Button onClick={() => setCustomOpen(false)}>Cancel</Button>
              </div>
            }
            onClose={() => setCustomOpen(false)}
          >
            <div style={{ width: 300 }}>
              <p className="text-sm text-secondary-foreground">
                Are you sure you want to proceed with this action? This cannot be undone.
              </p>
            </div>
          </Popover>
        </div>
      </section>

      {/* Hidden Borders */}
      <section id="hidden-borders" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Hidden Borders</h2>
        <p className="text-secondary-foreground mb-4">
          Use <code className="bg-muted px-1 rounded">hideHeaderBorder</code> and{" "}
          <code className="bg-muted px-1 rounded">hideFooterBorder</code> to remove the
          separator lines between header, content, and footer.
        </p>
        <div className="flex items-start gap-4">
          <Button
            ref={hiddenBorderBtnRef}
            onClick={() => setHiddenBorderOpen((prev) => !prev)}
          >
            Open Popover (No Borders)
          </Button>
          <Popover
            opener={hiddenBorderBtnRef}
            open={hiddenBorderOpen}
            headerText="No Borders"
            placement="Bottom"
            horizontalAlign="Start"
            hideHeaderBorder
            hideFooterBorder
            footer={
              <div className="flex justify-end gap-2">
                <Button design="Primary" onClick={() => setHiddenBorderOpen(false)}>OK</Button>
                <Button onClick={() => setHiddenBorderOpen(false)}>Cancel</Button>
              </div>
            }
            onClose={() => setHiddenBorderOpen(false)}
          >
            <div style={{ width: 300 }}>
              <p className="text-sm text-secondary-foreground">
                Header and footer separator lines are hidden in this popover.
              </p>
            </div>
          </Popover>
        </div>
      </section>

      {/* Notifications Popover */}
      <section id="notifications-popover" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Notifications Popover</h2>
        <p className="text-secondary-foreground mb-4">
          A notification panel using a custom <code className="bg-muted px-1 rounded">header</code> and{" "}
          <code className="bg-muted px-1 rounded">NotificationList</code> as content.
        </p>
        <div className="flex items-start gap-4">
          <Button
            ref={customHeaderBtnRef}
            onClick={() => setCustomHeaderOpen((prev) => !prev)}
          >
            Open Notifications
          </Button>
          <Popover
            opener={customHeaderBtnRef}
            open={customHeaderOpen}
            placement="Bottom"
            horizontalAlign="Start"
            noPadding
            header={
              <div className="flex items-center justify-between px-5 py-4">
                <span className="text-lg font-bold text-sapphire-text">Notifications</span>
                <Button design="Tertiary" onClick={() => setCustomHeaderOpen(false)}>
                  Clear All
                </Button>
              </div>
            }
            onClose={() => setCustomHeaderOpen(false)}
          >
            <div style={{ width: 380 }} className="p-sapphire-2xs">
              <NotificationList>
                <NotificationListItem
                  titleText="Campaign Success – Sales Recovered"
                  state={NotificationListItemState.Positive}
                  showClose
                  avatar={
                    <Avatar
                      initials="CS"
                      size="S"
                      colorScheme={AvatarColorScheme.Accent6}
                    />
                  }
                  footnotes={[
                    <span key="time" className="text-sapphire-text-tertiary text-xs">Just now</span>,
                  ]}
                >
                  Sales in New York increased by 14% following the marketing campaign. Revenue
                  is now tracking above forecast, and ROI exceeds expectation
                </NotificationListItem>
                <NotificationListItem
                  titleText="Notification Title can two lines"
                  showClose
                  avatar={
                    <Avatar
                      initials="SX"
                      size="S"
                      colorScheme={AvatarColorScheme.Accent2}
                    />
                  }
                  footnotes={[
                    <span key="space" className="text-sapphire-text-tertiary text-xs">Space_xyz</span>,
                    <span key="dot" className="text-sapphire-text-tertiary text-xs">•</span>,
                    <span key="time" className="text-sapphire-text-tertiary text-xs">11:13</span>,
                  ]}
                >
                  Description of notification topic
                </NotificationListItem>
                <NotificationListItem
                  titleText="Notification Title can two lines"
                  showClose
                  avatar={
                    <Avatar
                      initials="CX"
                      size="S"
                      colorScheme={AvatarColorScheme.Accent1}
                    />
                  }
                  footnotes={[
                    <span key="conv" className="text-sapphire-text-tertiary text-xs">Conversation_xyz</span>,
                    <span key="dot" className="text-sapphire-text-tertiary text-xs">•</span>,
                    <span key="time" className="text-sapphire-text-tertiary text-xs">11:13</span>,
                    <Button key="more" design="Tertiary" className="text-xs">More</Button>,
                  ]}
                >
                  Description of notification topic
                </NotificationListItem>
              </NotificationList>
            </div>
          </Popover>
        </div>
      </section>

      {/* Placement */}
      <section id="placement" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Placement</h2>
        <p className="text-secondary-foreground mb-4">
          The popover can be placed at{" "}
          <code className="bg-muted px-1 rounded">Top</code>,{" "}
          <code className="bg-muted px-1 rounded">Bottom</code>,{" "}
          <code className="bg-muted px-1 rounded">Start</code>, or{" "}
          <code className="bg-muted px-1 rounded">End</code> of the opener.
          Start/End are logical and flip in RTL.
        </p>
        <div className="flex flex-wrap gap-4 justify-center py-12">
          {([
            { label: "Top", ref: topBtnRef, placement: PopoverPlacement.Top },
            {
              label: "Bottom",
              ref: bottomBtnRef,
              placement: PopoverPlacement.Bottom,
            },
            {
              label: "Start",
              ref: startBtnRef,
              placement: PopoverPlacement.Start,
            },
            { label: "End", ref: endBtnRef, placement: PopoverPlacement.End },
          ] as const).map(({ label, ref: btnRef, placement: pl }) => (
            <div key={label}>
              <Button
                ref={btnRef}
                onClick={() =>
                  setPlacementOpen((prev) =>
                    prev === label ? null : label
                  )
                }
              >
                {label}
              </Button>
              <Popover
                opener={btnRef}
                open={placementOpen === label}
                placement={pl}
                headerText={`${label} Placement`}
                onClose={() => setPlacementOpen(null)}
              >
                <p className="text-sm" style={{ width: 180 }}>
                  Popover placed at <strong>{label}</strong>.
                </p>
              </Popover>
            </div>
          ))}
        </div>
      </section>

      {/* Horizontal Alignment */}
      <section className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">
          Horizontal Alignment
        </h2>
        <p className="text-secondary-foreground mb-4">
          When placement is Top or Bottom, control how the popover aligns
          horizontally.
        </p>
        <div className="flex flex-wrap gap-4 justify-center py-8">
          {([
            {
              label: "Center",
              ref: hCenterRef,
              align: PopoverHorizontalAlign.Center,
            },
            {
              label: "Start",
              ref: hStartRef,
              align: PopoverHorizontalAlign.Start,
            },
            {
              label: "End",
              ref: hEndRef,
              align: PopoverHorizontalAlign.End,
            },
            {
              label: "Stretch",
              ref: hStretchRef,
              align: PopoverHorizontalAlign.Stretch,
            },
          ] as const).map(({ label, ref: btnRef, align }) => (
            <div key={label}>
              <Button
                ref={btnRef}
                onClick={() =>
                  setHAlignOpen((prev) =>
                    prev === label ? null : label
                  )
                }
                className="w-40"
              >
                {label}
              </Button>
              <Popover
                opener={btnRef}
                open={hAlignOpen === label}
                placement="Bottom"
                horizontalAlign={align}
                headerText={`HAlign: ${label}`}
                onClose={() => setHAlignOpen(null)}
              >
                <p className="text-sm">
                  Horizontal alignment: <strong>{label}</strong>
                </p>
              </Popover>
            </div>
          ))}
        </div>
      </section>

      {/* Arrow Options */}
      <section id="arrow-options" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Arrow Options</h2>
        <p className="text-secondary-foreground mb-4">
          Toggle the arrow indicator with the{" "}
          <code className="bg-muted px-1 rounded">hideArrow</code> prop.
        </p>
        <div className="flex items-start gap-4">
          <div className="flex gap-2 items-center">
            <CheckBox
              text="Hide Arrow"
              checked={hideArrow}
              onChange={({ checked }) => setHideArrow(checked)}
            />
          </div>
          <Button
            ref={arrowBtnRef}
            onClick={() => setArrowOpen((prev) => !prev)}
          >
            Open Popover
          </Button>
          <Popover
            opener={arrowBtnRef}
            open={arrowOpen}
            placement="Bottom"
            hideArrow={hideArrow}
            headerText="Arrow Demo"
            onClose={() => setArrowOpen(false)}
          >
            <p className="text-sm" style={{ width: 200 }}>
              Arrow is{" "}
              <strong>{hideArrow ? "hidden" : "visible"}</strong>.
            </p>
          </Popover>
        </div>
      </section>

      {/* Resizable */}
      <section id="resizable-popover" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Resizable Popover</h2>
        <p className="text-secondary-foreground mb-4">
          When <code className="bg-muted px-1 rounded">resizable=true</code>
          , a resize handle appears (desktop only). Drag the corner to
          resize.
        </p>
        <div className="flex items-start gap-4">
          <Button
            ref={resizeBtnRef}
            onClick={() => setResizeOpen((prev) => !prev)}
          >
            Open Resizable Popover
          </Button>
          <Popover
            opener={resizeBtnRef}
            open={resizeOpen}
            placement="Bottom"
            horizontalAlign="Start"
            resizable
            headerText="Resizable"
            onClose={() => setResizeOpen(false)}
            style={{ width: 250 }}
          >
            <p className="text-sm text-secondary-foreground">
              Drag the corner handle to resize. Text reflows to match.
            </p>
          </Popover>
        </div>
      </section>

      {/* Focus Management */}
      <section id="focus-management" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Focus Management</h2>
        <p className="text-secondary-foreground mb-4">
          Focus is trapped within the popover. Tab and Shift+Tab cycle
          through focusable elements. Use{" "}
          <code className="bg-muted px-1 rounded">initialFocus</code> to
          set focus target.
        </p>
        <div className="flex items-start gap-4">
          <Button
            ref={focusBtnRef}
            onClick={() => setFocusOpen((prev) => !prev)}
          >
            Open Popover with Focus Trap
          </Button>
          <Popover
            opener={focusBtnRef}
            open={focusOpen}
            placement="Bottom"
            horizontalAlign="Start"
            headerText="Focus Demo"
            initialFocus="focus-target-input"
            hideFooterBorder
            onClose={() => setFocusOpen(false)}
            footer={
              <Button design="Tertiary" onClick={() => setFocusOpen(false)}>
                Close
              </Button>
            }
          >
            <div className="space-y-3" style={{ width: 280 }}>
              <p className="text-sm text-secondary-foreground">
                Focus should land on the input below (initialFocus).
                Tab cycles between the input and the button.
              </p>
              <input
                id="focus-target-input"
                type="text"
                placeholder="I receive initial focus"
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
              />
            </div>
          </Popover>
        </div>
      </section>

      {/* Events */}
      <section id="events" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Events</h2>
        <p className="text-secondary-foreground mb-4">
          All lifecycle events are logged below.
        </p>
        <div className="flex items-start gap-4">
          <Button
            ref={eventBtnRef}
            onClick={() => setEventOpen((prev) => !prev)}
          >
            Open Event Popover
          </Button>
          <Popover
            opener={eventBtnRef}
            open={eventOpen}
            placement="Bottom"
            horizontalAlign="Start"
            headerText="Event Demo"
            hideFooterBorder
            footer={
              <Button
                design="Tertiary"
                onClick={() => setEventOpen(false)}
              >
                Close
              </Button>
            }
            onBeforeOpen={() => {
              logEvent("onBeforeOpen");
            }}
            onOpen={() => logEvent("onOpen")}
            onBeforeClose={(detail) => {
              logEvent(
                `onBeforeClose (escPressed: ${detail.escPressed})`
              );
            }}
            onClose={() => {
              logEvent("onClose");
              setEventOpen(false);
            }}
          >
            <div style={{ width: 220 }}>
              <p className="text-sm">
                Open, close, and press Escape to see event logs.
              </p>
            </div>
          </Popover>
          <div className="p-3 bg-muted rounded-md font-mono text-xs max-h-48 overflow-auto">
            <strong>Event Log:</strong>
            {eventLog.length === 0 ? (
              <p className="text-secondary-foreground mt-1">No events yet</p>
            ) : (
              <ul className="mt-1 space-y-0.5">
                {eventLog.map((entry, i) => (
                  <li key={i}>{entry}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* Chained Popovers */}
      <section id="chained-popovers" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Chained Popovers</h2>
        <p className="text-secondary-foreground mb-4">
          Open a second popover from within the first. Each popover manages its own
          open/close state independently.
        </p>
        <div className="flex items-start gap-4">
          <Button
            ref={chainedBtnRef}
            onClick={() => setChainedOpen((prev) => !prev)}
          >
            Open First Popover
          </Button>
          <Popover
            opener={chainedBtnRef}
            open={chainedOpen}
            headerText="First Popover"
            placement="Bottom"
            horizontalAlign="Start"
            onClose={() => {
              setChainedOpen(false);
              setChainedInnerOpen(false);
            }}
          >
            <div style={{ width: 280 }} className="space-y-3">
              <p className="text-sm text-secondary-foreground">
                This is the first popover. Click the button below to open a
                second popover anchored to it.
              </p>
              <Button
                ref={chainedInnerBtnRef}
                onClick={() => setChainedInnerOpen((prev) => !prev)}
                design="Primary"
              >
                Open Second Popover
              </Button>
              <Popover
                opener={chainedInnerBtnRef}
                open={chainedInnerOpen}
                headerText="Second Popover"
                placement="End"
                onClose={() => setChainedInnerOpen(false)}
              >
                <div style={{ width: 220 }} className="space-y-2">
                  <p className="text-sm text-secondary-foreground">
                    This is a nested popover opened from inside the first one.
                  </p>
                  <Button
                    onClick={() => setChainedInnerOpen(false)}
                  >
                    Close
                  </Button>
                </div>
              </Popover>
            </div>
          </Popover>
        </div>
      </section>

      {/* Keyboard Shortcuts */}
      <section id="keyboard-shortcuts" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-4">Keyboard Shortcuts</h2>
        <div className="space-y-2 text-sm max-w-md">
          <div className="flex justify-between">
            <span className="text-secondary-foreground">Close popover</span>
            <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">
              Escape
            </kbd>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary-foreground">
              Cycle focus forward
            </span>
            <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">
              Tab
            </kbd>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary-foreground">
              Cycle focus backward
            </span>
            <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">
              Shift + Tab
            </kbd>
          </div>
        </div>
      </section>

      {/* Usage Example */}
      <section id="usage-example" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-4">Usage Example</h2>
        <CodeBlock language="tsx" code={`import { Popover, Button } from '@sap-ui/fx-components';
import { useState, useRef } from 'react';

function MyComponent() {
  const buttonRef = useRef(null);
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button ref={buttonRef} onClick={() => setOpen(true)}>
        Open
      </Button>
      <Popover
        opener={buttonRef}
        open={open}
        headerText="My Popover"
        placement="Bottom"
        onClose={() => setOpen(false)}
      >
        <p>Content here</p>
      </Popover>
    </>
  );
}

// Custom header & footer:
<Popover
  opener={buttonRef}
  open={open}
  header={<div className="flex gap-2">Custom Header</div>}
  footer={<Button onClick={() => setOpen(false)}>Close</Button>}
  onClose={() => setOpen(false)}
>
  <p>Content</p>
</Popover>`} />
      </section>
    </div>
  );
}
