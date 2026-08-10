import { useState, useRef } from "react";
import {
  Dialog,
  DialogState,
  DialogRef,
  Button,
  Input,
  MessageStrip,
  Label,
  CheckBox,
  Panel,
  SearchField,
  Tag,
  NoData,
} from "@sap-ui/fx-components";
import { AlertCircle, Info, CheckCircle, AlertTriangle, Wrench, GripVertical, MoreHorizontal, Pencil, X, Plus, Filter, ChevronDown } from "lucide-react";
import { CodeBlock } from "./components/CodeBlock";

export function DialogPage() {
  // Basic Dialog
  const [basicOpen, setBasicOpen] = useState(false);

  // Variant Dialogs
  const [variantBasicOpen, setVariantBasicOpen] = useState(false);
  const [backSubOpen, setBackSubOpen] = useState(false);
  const [variantErrorOpen, setVariantErrorOpen] = useState(false);
  const [variantSuccessOpen, setVariantSuccessOpen] = useState(false);
  const [removeSectionOpen, setRemoveSectionOpen] = useState(false);

  // State Dialogs
  const [errorOpen, setErrorOpen] = useState(false);
  const [warningOpen, setWarningOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

  // Scrollable content dialog
  const [scrollableInfoOpen, setScrollableInfoOpen] = useState(false);
  const [draggableOpen, setDraggableOpen] = useState(false);
  const [resizableOpen, setResizableOpen] = useState(false);
  const [bothOpen, setBothOpen] = useState(false);
  const [stretchOpen, setStretchOpen] = useState(false);
  const [noBackdropOpen, setNoBackdropOpen] = useState(false);

  // Advanced Dialogs
  const [unsavedChangesOpen, setUnsavedChangesOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [focusOpen, setFocusOpen] = useState(false);
  const [preventCloseOpen, setPreventCloseOpen] = useState(false);
  const [canClose, setCanClose] = useState(false);

  // Multiple stacked dialogs
  const [dialog1Open, setDialog1Open] = useState(false);
  const [dialog2Open, setDialog2Open] = useState(false);
  const [dialog3Open, setDialog3Open] = useState(false);

  // Dynamic content test
  const [dynamicOpen, setDynamicOpen] = useState(false);
  const [contentLines, setContentLines] = useState(3);

  // Scroll preservation test
  const [scrollTestOpen, setScrollTestOpen] = useState(false);

  // Dialog with Panels
  const [panelsDialogOpen, setPanelsDialogOpen] = useState(false);

  // Agent Catalog Dialog
  const [catalogOpen, setCatalogOpen] = useState(false);

  // Border behavior demos
  const [borderDefaultOpen, setBorderDefaultOpen] = useState(false);
  const [borderHiddenOpen, setBorderHiddenOpen] = useState(false);
  const [borderScrollableOpen, setBorderScrollableOpen] = useState(false);
  const [borderScrollableHiddenOpen, setBorderScrollableHiddenOpen] = useState(false);

  // Imperative API
  const dialogRef = useRef<DialogRef>(null);
  const [returnValue, setReturnValue] = useState<string>("");

  // Event Log
  const [eventLog, setEventLog] = useState<string[]>([]);
  const addEvent = (event: string) => {
    setEventLog((prev) => [...prev.slice(-4), `${new Date().toLocaleTimeString()}: ${event}`]);
  };

  return (
    <div className="space-y-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Dialog</h1>
        <code className="text-sm text-primary/70 font-mono">{'import { Dialog } from "@sap-ui/fx-components"'}</code>
      </header>

      {/* Event Log */}
      <section className="p-4 border border-border rounded-lg bg-muted/50">
        <div className="text-sm space-y-1">
          <strong>Event Log:</strong>
          {eventLog.length === 0 && <p className="text-secondary-foreground">No events yet...</p>}
          {eventLog.map((event, i) => (
            <div key={i} className="font-mono text-xs">
              {event}
            </div>
          ))}
        </div>
      </section>

      {/* Basic Examples */}
      <section id="basic-usage" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Basic Usage</h2>
        <p className="text-secondary-foreground mb-4">
          Simple confirmation dialog with header, content, and footer buttons.
        </p>
        <Button onClick={() => setBasicOpen(true)}>Open Basic Dialog</Button>

        <Dialog
          open={basicOpen}
          onOpenChange={setBasicOpen}
          headerText="Confirm Action"
          hideBorders
          initialFocus="basic-confirm-btn"
          onBeforeOpen={() => addEvent("Dialog: before-open")}
          onAfterOpen={() => addEvent("Dialog: after-open")}
          onBeforeClose={() => addEvent("Dialog: before-close")}
          onAfterClose={() => addEvent("Dialog: after-close")}
          footer={
            <div className="flex gap-2">
              <Button
                id="basic-confirm-btn"
                size="Large"
                design="Primary"
                onClick={() => {
                  addEvent("Button: Confirm clicked");
                  setBasicOpen(false);
                }}
              >
                Confirm
              </Button>
              <Button size="Large" design="Tertiary" onClick={() => setBasicOpen(false)}>
                Cancel
              </Button>
            </div>
          }
        >
          <p>Are you sure you want to proceed with this action?</p>
          <p className="text-sm text-secondary-foreground mt-2">
            This action cannot be undone.
          </p>
        </Dialog>
      </section>

      {/* Dialog Variants */}
      <section id="dialog-variants" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Dialog Variants</h2>
        <p className="text-secondary-foreground mb-4">
          Header enhancements: state icons, back button, subtitle, and borderless mode.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button onClick={() => setVariantBasicOpen(true)}>Basic</Button>
          <Button onClick={() => setBackSubOpen(true)}>Back + Subtitle</Button>
          <Button design="Secondary" onClick={() => setVariantErrorOpen(true)}>Error</Button>
          <Button design="Primary" onClick={() => setVariantSuccessOpen(true)}>Success</Button>
          <Button design="Neutral" onClick={() => setRemoveSectionOpen(true)}>Borderless</Button>
        </div>

        {/* Basic variant */}
        <Dialog
          open={variantBasicOpen}
          onOpenChange={setVariantBasicOpen}
          headerText="Dialog Title"
          initialFocus="variant-basic-ok-btn"
          footer={
            <div className="flex gap-2">
              <Button id="variant-basic-ok-btn" size="Large" design="Primary" onClick={() => setVariantBasicOpen(false)}>OK</Button>
              <Button size="Large" design="Tertiary" onClick={() => setVariantBasicOpen(false)}>Cancel</Button>
            </div>
          }
        >
          <p>Text</p>
        </Dialog>

        {/* Back button + subtitle */}
        <Dialog
          open={backSubOpen}
          onOpenChange={setBackSubOpen}
          headerText="Dialog Title"
          subHeaderText="Dialog Subtitle"
          showBackButton
          onBackButtonClick={() => setBackSubOpen(false)}
          initialFocus="back-sub-ok-btn"
          footer={
            <div className="flex gap-2">
              <Button id="back-sub-ok-btn" size="Large" design="Primary" onClick={() => setBackSubOpen(false)}>OK</Button>
              <Button size="Large" design="Tertiary" onClick={() => setBackSubOpen(false)}>Cancel</Button>
            </div>
          }
        >
          <p>Text</p>
        </Dialog>

        {/* Error state */}
        <Dialog
          open={variantErrorOpen}
          onOpenChange={setVariantErrorOpen}
          headerText="Dialog Title"
          state={DialogState.Error}
          initialFocus="variant-error-ok-btn"
          footer={
            <div className="flex gap-2">
              <Button id="variant-error-ok-btn" size="Large" design="Primary" onClick={() => setVariantErrorOpen(false)}>OK</Button>
              <Button size="Large" design="Tertiary" onClick={() => setVariantErrorOpen(false)}>Cancel</Button>
            </div>
          }
        >
          <p>Text</p>
        </Dialog>

        {/* Success state */}
        <Dialog
          open={variantSuccessOpen}
          onOpenChange={setVariantSuccessOpen}
          headerText="Dialog Title"
          state={DialogState.Success}
          initialFocus="variant-success-ok-btn"
          footer={
            <div className="flex gap-2">
              <Button id="variant-success-ok-btn" size="Large" design="Primary" onClick={() => setVariantSuccessOpen(false)}>OK</Button>
              <Button size="Large" design="Tertiary" onClick={() => setVariantSuccessOpen(false)}>Cancel</Button>
            </div>
          }
        >
          <p>Text</p>
        </Dialog>

        {/* Borderless - Remove Section */}
        <Dialog
          open={removeSectionOpen}
          onOpenChange={setRemoveSectionOpen}
          headerText="Remove Section"
          hideBorders
          initialFocus="remove-section-btn"
          footer={
            <div className="flex gap-2">
              <Button id="remove-section-btn" size="Large" design="Primary" onClick={() => setRemoveSectionOpen(false)}>Remove</Button>
              <Button size="Large" design="Tertiary" onClick={() => setRemoveSectionOpen(false)}>Cancel</Button>
            </div>
          }
        >
          <NoData
            design="Medium"
            titleText="Remove Section"
            subtitleText="You're about to delete the &quot;Insights&quot; section. This action cannot be reverted, all content from this section will be lost."
          />
        </Dialog>
      </section>

      {/* State Variants */}
      <section id="state-variants" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">State Variants</h2>
        <p className="text-secondary-foreground mb-4">
          Semantic state styling for different dialog types (Error, Warning, Success, Information).
        </p>
        <div className="flex flex-wrap gap-4">
          <Button design="Secondary" icon={<AlertCircle className="h-4 w-4" />} onClick={() => setErrorOpen(true)}>
            Error Dialog
          </Button>
          <Button design="Neutral" icon={<AlertTriangle className="h-4 w-4" />} onClick={() => setWarningOpen(true)}>
            Warning Dialog
          </Button>
          <Button design="Primary" icon={<CheckCircle className="h-4 w-4" />} onClick={() => setSuccessOpen(true)}>
            Success Dialog
          </Button>
          <Button design="Secondary" icon={<Info className="h-4 w-4" />} onClick={() => setInfoOpen(true)}>
            Info Dialog
          </Button>
        </div>

        {/* Error Dialog */}
        <Dialog
          open={errorOpen}
          onOpenChange={setErrorOpen}
          headerText="Error Occurred"
          state={DialogState.Error}
          initialFocus="error-ok-btn"
          footer={
            <Button id="error-ok-btn" size="Large" design="Primary" onClick={() => setErrorOpen(false)}>
              OK
            </Button>
          }
        >
          <div className="space-y-3">
            <MessageStrip type="error">
              An error occurred while processing your request.
            </MessageStrip>
            <p>Please try again later or contact support if the problem persists.</p>
          </div>
        </Dialog>

        {/* Warning Dialog */}
        <Dialog
          open={warningOpen}
          onOpenChange={setWarningOpen}
          headerText="Warning"
          state={DialogState.Warning}
          initialFocus="warning-proceed-btn"
          footer={
            <div className="flex gap-2">
              <Button id="warning-proceed-btn" size="Large" design="Neutral" onClick={() => setWarningOpen(false)}>
                Proceed Anyway
              </Button>
              <Button size="Large" design="Tertiary" onClick={() => setWarningOpen(false)}>
                Cancel
              </Button>
            </div>
          }
        >
          <div className="space-y-3">
            <MessageStrip type="warning">This action cannot be undone.</MessageStrip>
            <p>Are you sure you want to continue?</p>
          </div>
        </Dialog>

        {/* Success Dialog */}
        <Dialog
          open={successOpen}
          onOpenChange={setSuccessOpen}
          headerText="Success"
          state={DialogState.Success}
          initialFocus="success-ok-btn"
          footer={
            <Button id="success-ok-btn" size="Large" design="Primary" onClick={() => setSuccessOpen(false)}>
              OK
            </Button>
          }
        >
          <div className="space-y-3">
            <MessageStrip type="success">
              Your changes have been saved successfully.
            </MessageStrip>
            <p>You can now continue working.</p>
          </div>
        </Dialog>

        {/* Information Dialog */}
        <Dialog
          open={infoOpen}
          onOpenChange={setInfoOpen}
          headerText="Information"
          state={DialogState.Information}
          initialFocus="info-ok-btn"
          footer={
            <Button id="info-ok-btn" size="Large" design="Primary" onClick={() => setInfoOpen(false)}>
              Got It
            </Button>
          }
        >
          <div className="space-y-3">
            <MessageStrip type="information">
              This is an informational message.
            </MessageStrip>
            <p>Here's some important information you should know.</p>
          </div>
        </Dialog>
      </section>

      {/* Scrollable Content */}
      <section id="scrollable-content" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Scrollable Content</h2>
        <p className="text-secondary-foreground mb-4">
          When dialog content exceeds the available height, the body becomes scrollable while header and footer remain fixed.
        </p>
        <Button design="Secondary" onClick={() => setScrollableInfoOpen(true)}>
          Open Scrollable Dialog
        </Button>

        <Dialog
          open={scrollableInfoOpen}
          onOpenChange={setScrollableInfoOpen}
          headerText="System Maintenance Notice"
          initialFocus="scrollable-info-ok-btn"
          footer={
            <Button id="scrollable-info-ok-btn" size="Large" design="Primary" onClick={() => setScrollableInfoOpen(false)}>
              Acknowledge
            </Button>
          }
        >
          <div className="space-y-4">
            <MessageStrip type="information">
              Please review the following maintenance details carefully before acknowledging.
            </MessageStrip>

            <p>A scheduled maintenance window has been planned for the SAP BTP Cloud Foundry environment in the EU10 region. During this period, several core platform services will undergo major version upgrades to improve performance, reliability, and security compliance.</p>

            <p className="font-medium">Maintenance Schedule</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-secondary-foreground">
              <li>Date: Saturday, April 18, 2026</li>
              <li>Start Time: 02:00 UTC (04:00 CET)</li>
              <li>Expected Duration: 4 hours</li>
              <li>Affected Region: EU10 (Frankfurt)</li>
              <li>Backup Window: 01:00 - 02:00 UTC (pre-maintenance snapshot)</li>
            </ul>

            <p className="font-medium">Services Affected</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-secondary-foreground">
              <li>SAP HANA Cloud - Brief connectivity interruptions (up to 5 minutes per instance)</li>
              <li>Application Runtime - Rolling restart of all application instances across availability zones</li>
              <li>SAP Build Work Zone - Dashboard and admin console will be temporarily unavailable</li>
              <li>Integration Suite - Message processing will be queued during downtime, auto-retry on recovery</li>
              <li>SAP Business Application Studio - All active dev spaces will be suspended and auto-resumed</li>
              <li>Cloud Identity Services - Token refresh may fail briefly, active sessions remain valid</li>
              <li>Alert Notification Service - Alert delivery delayed up to 15 minutes during migration</li>
            </ul>

            <p className="font-medium">Impact Assessment</p>
            <p className="text-sm text-secondary-foreground">Applications with high-availability configurations across multiple availability zones will experience minimal disruption as traffic is automatically routed to healthy instances during rolling restarts. Standard single-instance applications may experience brief downtime of up to 3 minutes during the restart phase.</p>

            <p className="text-sm text-secondary-foreground">Database connections using connection pooling should handle transient failures gracefully. Applications using direct JDBC connections may need manual reconnection. The platform will automatically retry failed health checks for up to 10 minutes before marking instances as unhealthy.</p>

            <p className="font-medium">Recommended Actions</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-secondary-foreground">
              <li>Reschedule all critical batch jobs outside the 02:00-06:00 UTC window</li>
              <li>Verify application health check endpoints respond within the configured timeout</li>
              <li>Notify downstream consumers of potential API latency spikes during the maintenance window</li>
              <li>Review and test application reconnection logic for database and messaging services</li>
              <li>Export any unsaved work in Business Application Studio before 01:30 UTC</li>
            </ul>

            <p className="text-sm text-secondary-foreground">For questions or concerns regarding this maintenance, please contact the platform operations team via the support portal or the #cloud-ops Slack channel. A post-maintenance status report will be published within 2 hours of completion.</p>
          </div>
        </Dialog>
      </section>

      {/* Border Behavior */}
      <section id="border-behavior" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Border Behavior</h2>
        <p className="text-secondary-foreground mb-4">
          The header and footer separator lines appear automatically based on whether the content area is scrollable.
        </p>

        <div className="mb-6 p-4 rounded-lg bg-muted/50 border border-border">
          <p className="font-medium mb-3">How it works:</p>
          <ul className="space-y-2 text-sm text-secondary-foreground">
            <li className="flex items-start gap-2">
              <span className="font-mono text-xs bg-sapphire-positive-bg text-sapphire-positive px-1.5 py-0.5 rounded shrink-0 mt-0.5">ON</span>
              <span>Content overflows (scrollable) — borders are <strong className="text-foreground">always shown</strong>, even if <code className="bg-muted px-1 rounded">hideBorders</code> is set</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono text-xs bg-sapphire-positive-bg text-sapphire-positive px-1.5 py-0.5 rounded shrink-0 mt-0.5">ON</span>
              <span>Content fits (no scroll) + default — borders are <strong className="text-foreground">shown</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono text-xs bg-sapphire-negative-bg text-sapphire-negative px-1.5 py-0.5 rounded shrink-0 mt-0.5">OFF</span>
              <span>Content fits (no scroll) + <code className="bg-muted px-1 rounded">hideBorders={'{true}'}</code> — borders are <strong className="text-foreground">hidden</strong></span>
            </li>
          </ul>
        </div>

        <div className="flex flex-wrap gap-4">
          <Button onClick={() => setBorderScrollableOpen(true)}>Scrollable (borders forced)</Button>
          <Button onClick={() => setBorderScrollableHiddenOpen(true)}>Scrollable + hideBorders (still shown)</Button>
          <Button onClick={() => setBorderDefaultOpen(true)}>Short Content (borders shown)</Button>
          <Button onClick={() => setBorderHiddenOpen(true)}>Short + hideBorders (no borders)</Button>
        </div>

        {/* Short content — default: borders shown */}
        <Dialog
          open={borderDefaultOpen}
          onOpenChange={setBorderDefaultOpen}
          headerText="Short Content"
          initialFocus="border-default-close-btn"
          footer={
            <Button id="border-default-close-btn" size="Large" design="Primary" onClick={() => setBorderDefaultOpen(false)}>Close</Button>
          }
        >
          <p>Content fits without scrolling. Borders are shown by default.</p>
        </Dialog>

        {/* Short content + hideBorders: no borders */}
        <Dialog
          open={borderHiddenOpen}
          onOpenChange={setBorderHiddenOpen}
          headerText="Short Content (Hidden Borders)"
          hideBorders
          initialFocus="border-hidden-close-btn"
          footer={
            <Button id="border-hidden-close-btn" size="Large" design="Primary" onClick={() => setBorderHiddenOpen(false)}>Close</Button>
          }
        >
          <p>Content fits without scrolling. <code>hideBorders</code> hides the separator lines.</p>
        </Dialog>

        {/* Scrollable content: borders always forced on */}
        <Dialog
          open={borderScrollableOpen}
          onOpenChange={setBorderScrollableOpen}
          headerText="Scrollable Content"
          initialFocus="border-scroll-close-btn"
          footer={
            <Button id="border-scroll-close-btn" size="Large" design="Primary" onClick={() => setBorderScrollableOpen(false)}>Close</Button>
          }
        >
          <div className="space-y-4">
            {Array.from({ length: 20 }).map((_, i) => (
              <p key={i}>Paragraph {i + 1} — When the content area overflows, borders appear automatically to indicate there is more content above or below.</p>
            ))}
          </div>
        </Dialog>

        {/* Scrollable + hideBorders: borders still shown (overflow wins) */}
        <Dialog
          open={borderScrollableHiddenOpen}
          onOpenChange={setBorderScrollableHiddenOpen}
          headerText="Scrollable + hideBorders"
          hideBorders
          initialFocus="border-scroll-hidden-close-btn"
          footer={
            <Button id="border-scroll-hidden-close-btn" size="Large" design="Primary" onClick={() => setBorderScrollableHiddenOpen(false)}>Close</Button>
          }
        >
          <div className="space-y-4">
            {Array.from({ length: 20 }).map((_, i) => (
              <p key={i}>Paragraph {i + 1} — Even with <code>hideBorders</code> set, the borders are forced on because the content overflows.</p>
            ))}
          </div>
        </Dialog>
      </section>

      {/* Header End Content — Agent Catalog */}
      <section id="header-end-content" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Header End Content</h2>
        <p className="text-secondary-foreground mb-4">
          The <code className="bg-muted px-1 rounded">headerEndContent</code> prop renders actions on the right side of the dialog header — useful for search fields, filters, or toolbar buttons.
        </p>
        <Button onClick={() => setCatalogOpen(true)}>Open Agent Catalog</Button>

        <Dialog
          open={catalogOpen}
          onOpenChange={setCatalogOpen}
          headerText="Agent Catalog"
          stretch
          noPadding
          headerEndContent={
            <>
              <SearchField placeholder="Search jobs and capabilities..." className="w-64" />
              <Button design="Transparent" icon={<Filter className="h-4 w-4" />} endIcon={<ChevronDown className="h-3 w-3" />} />
            </>
          }
          initialFocus="catalog-close-btn"
          footer={
            <div className="flex gap-2">
              <Button design="Primary" icon={<Plus className="h-4 w-4" />}>Add Agent</Button>
              <Button id="catalog-close-btn" design="Tertiary" onClick={() => setCatalogOpen(false)}>Close</Button>
            </div>
          }
        >
          <div className="px-6 py-4 space-y-6">
            {/* Recommended */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Recommended for you</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: "Accounting Accrual Agent", desc: "Retrieves topics from the ServiceNow product documentation and makes their content and metadat..." },
                  { name: "Accounting Accrual Agent", desc: "Retrieves topics from the ServiceNow product documentation and makes their content and metadat..." },
                  { name: "Accounting Accrual Agent", desc: "Retrieves topics from the ServiceNow product documentation and makes their content and metadat..." },
                ].map((agent, i) => (
                  <div key={i} className="border border-border rounded-lg p-4 bg-card flex flex-col gap-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">To extend your Supply Management agent</p>
                        <p className="text-sm font-semibold text-foreground">{agent.name}</p>
                      </div>
                      <button type="button" className="p-1 rounded hover:bg-accent text-muted-foreground shrink-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{agent.desc}</p>
                    <div className="flex items-center gap-1.5">
                      <Tag design="Set2" colorScheme="6" className="text-[11px]">Finance</Tag>
                      <Tag design="Set2" colorScheme="3" className="text-[11px]">Python</Tag>
                      <span className="text-xs text-muted-foreground">+2</span>
                    </div>
                    <Button design="Secondary" size="Small">View Details</Button>
                  </div>
                ))}
              </div>
            </div>

            {/* All Agents */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">All Agents</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: "Accounting Accrual Agent", desc: "Retrieves topics from the ServiceNow product documentation and makes their content and metadat..." },
                  { name: "Accounting Accrual Agent", desc: "Retrieves topics from the ServiceNow product documentation and makes their content and metadat..." },
                  { name: "Account Matching", desc: "Evaluates potential hazards, analyzes threats, and recommends mitigation strategies to minimize risks in..." },
                ].map((agent, i) => (
                  <div key={i} className="border border-border rounded-lg p-4 bg-card flex flex-col gap-3">
                    <div className="flex items-start justify-between">
                      <p className="text-sm font-semibold text-foreground">{agent.name}</p>
                      <button type="button" className="p-1 rounded hover:bg-accent text-muted-foreground shrink-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{agent.desc}</p>
                    <div className="flex items-center gap-1.5">
                      <Tag design="Set2" colorScheme="6" className="text-[11px]">Finance</Tag>
                      <Tag design="Set2" colorScheme="3" className="text-[11px]">Python</Tag>
                      <span className="text-xs text-muted-foreground">+2</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Dialog>
      </section>

      {/* Feature Demos */}
      <section id="feature-demonstrations" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Feature Demonstrations</h2>
        <p className="text-secondary-foreground mb-4">
          Draggable, resizable, stretch, and backdrop options.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button onClick={() => setDraggableOpen(true)}>Draggable Dialog</Button>
          <Button onClick={() => setResizableOpen(true)}>Resizable Dialog</Button>
          <Button onClick={() => setBothOpen(true)}>Both (Draggable + Resizable)</Button>
          <Button onClick={() => setStretchOpen(true)}>Stretch (Full Width)</Button>
          <Button onClick={() => setNoBackdropOpen(true)}>No Backdrop Click</Button>
        </div>

        {/* Draggable Dialog */}
        <Dialog
          open={draggableOpen}
          onOpenChange={setDraggableOpen}
          headerText="Draggable Dialog"
          draggable
          initialFocus="draggable-close-btn"
          footer={
            <Button id="draggable-close-btn" size="Large" design="Primary" onClick={() => setDraggableOpen(false)}>
              Close
            </Button>
          }
        >
          <p>You can drag this dialog by its header to reposition it!</p>
          <p className="text-sm text-secondary-foreground mt-2">
            💡 <strong>Mouse:</strong> Click and hold the header, then drag to move.
            <br />
            💡 <strong>Keyboard:</strong> Press Tab until the header is focused (you'll see a focus ring), then use Arrow keys to move the dialog.
          </p>
        </Dialog>

        {/* Resizable Dialog */}
        <Dialog
          open={resizableOpen}
          onOpenChange={setResizableOpen}
          headerText="Resizable Dialog"
          resizable
          initialFocus="resizable-close-btn"
          footer={
            <Button id="resizable-close-btn" size="Large" design="Primary" onClick={() => setResizableOpen(false)}>
              Close
            </Button>
          }
        >
          <div className="space-y-3">
            <p>Drag the handle at the bottom-right corner to resize this dialog. The content area will adapt to the available space, with the body becoming scrollable when it overflows.</p>
            <p className="text-sm text-secondary-foreground">
              <strong>Mouse:</strong> Hover over the bottom-right corner and drag to resize.
            </p>
            <p className="text-sm text-secondary-foreground">
              <strong>Keyboard:</strong> Press Shift+Arrow keys to resize the dialog from anywhere within it.
            </p>
          </div>
        </Dialog>

        {/* Both Draggable and Resizable Dialog */}
        <Dialog
          open={bothOpen}
          onOpenChange={setBothOpen}
          headerText="Draggable & Resizable Dialog"
          draggable
          resizable
          initialFocus="both-close-btn"
          footer={
            <Button id="both-close-btn" size="Large" design="Primary" onClick={() => setBothOpen(false)}>
              Close
            </Button>
          }
        >
          <div className="space-y-3">
            <p>This dialog supports both dragging and resizing. Grab the header bar to reposition it anywhere on the screen, or use the bottom-right handle to adjust dimensions.</p>
            <p className="text-sm text-secondary-foreground">
              <strong>Mouse:</strong> Click and drag the header to move. Drag the bottom-right corner to resize. Both operations can be combined freely.
            </p>
            <p className="text-sm text-secondary-foreground">
              <strong>Keyboard:</strong> Tab to the header, then use Arrow keys to move. Use Shift+Arrow keys from anywhere to resize. The dialog stays within viewport bounds.
            </p>
          </div>
          <p className="text-sm text-blue-600 dark:text-blue-400 mt-4">
            💡 This is the most flexible dialog mode - you have full control over both position and size!
          </p>
        </Dialog>

        {/* Stretch Dialog */}
        <Dialog
          open={stretchOpen}
          onOpenChange={setStretchOpen}
          headerText="Full Width Dialog"
          stretch
          initialFocus="stretch-close-btn"
          footer={
            <Button id="stretch-close-btn" size="Large" design="Primary" onClick={() => setStretchOpen(false)}>
              Close
            </Button>
          }
        >
          <p>This dialog stretches to the full available width of the viewport (95%).</p>
          <p className="text-sm text-secondary-foreground mt-2">
            💡 Useful for content that needs more horizontal space, like tables or wide forms.
          </p>
        </Dialog>

        {/* No Backdrop Click */}
        <Dialog
          open={noBackdropOpen}
          onOpenChange={setNoBackdropOpen}
          headerText="No Backdrop Click"
          enableBackdropClick={false}
          initialFocus="no-backdrop-close-btn"
          footer={
            <Button id="no-backdrop-close-btn" size="Large" design="Primary" onClick={() => setNoBackdropOpen(false)}>
              Close
            </Button>
          }
        >
          <p>Clicking the backdrop will NOT close this dialog.</p>
          <p className="text-sm text-secondary-foreground mt-2">
            💡 Press Escape or click the Close button to dismiss.
          </p>
        </Dialog>
      </section>

      {/* Advanced Features */}
      <section id="advanced-features" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Advanced Features</h2>
        <p className="text-secondary-foreground mb-4">
          Event prevention, initial focus, and imperative API.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button onClick={() => setUnsavedChangesOpen(true)}>Unsaved Changes</Button>
          <Button onClick={() => setFocusOpen(true)}>Initial Focus</Button>
          <Button onClick={() => setPreventCloseOpen(true)}>Prevent Close</Button>
          <Button onClick={() => dialogRef.current?.showModal()}>
            Imperative API (Ref)
          </Button>
        </div>

        {/* Unsaved Changes Dialog (with prevention) */}
        <Dialog
          open={unsavedChangesOpen}
          onOpenChange={setUnsavedChangesOpen}
          headerText="Edit Content"
          initialFocus="unsaved-save-btn"
          onBeforeClose={(detail) => {
            if (hasUnsavedChanges && !detail.escPressed) {
              const confirmed = confirm("You have unsaved changes. Close anyway?");
              if (!confirmed) {
                addEvent("Dialog close prevented (unsaved changes)");
                return false; // Prevent close
              }
            }
          }}
          footer={
            <div className="flex gap-2">
              <Button
                id="unsaved-save-btn"
                size="Large"
                design="Primary"
                onClick={() => {
                  addEvent("Save & Close clicked");
                  setHasUnsavedChanges(false);
                  setUnsavedChangesOpen(false);
                }}
              >
                Save & Close
              </Button>
              <Button
                size="Large"
                design="Tertiary"
                onClick={() => {
                  setHasUnsavedChanges(false);
                  setUnsavedChangesOpen(false);
                }}
              >
                Discard Changes
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <p>Make changes to the content below:</p>
            <textarea
              className="w-full min-h-[100px] p-2 border rounded-md"
              placeholder="Type something to simulate unsaved changes..."
              onChange={(e) => setHasUnsavedChanges(e.target.value.length > 0)}
            />
            {hasUnsavedChanges && (
              <MessageStrip type="warning">You have unsaved changes</MessageStrip>
            )}
          </div>
        </Dialog>

        {/* Initial Focus Dialog */}
        <Dialog
          open={focusOpen}
          onOpenChange={setFocusOpen}
          headerText="Login Form"
          initialFocus="username-input"
          footer={
            <div className="flex gap-2">
              <Button size="Large" design="Primary" type="submit">
                Login
              </Button>
              <Button size="Large" design="Tertiary" onClick={() => setFocusOpen(false)}>
                Cancel
              </Button>
            </div>
          }
        >
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <Label htmlFor="username-input" required>
                Username
              </Label>
              <Input id="username-input" type="text" placeholder="Enter username" />
            </div>
            <div>
              <Label htmlFor="password-input" required>
                Password
              </Label>
              <Input id="password-input" type="password" placeholder="Enter password" />
            </div>
            <p className="text-sm text-secondary-foreground">
              💡 The username field is automatically focused when the dialog opens.
            </p>
          </form>
        </Dialog>

        {/* Prevent Close Dialog */}
        <Dialog
          open={preventCloseOpen}
          onOpenChange={setPreventCloseOpen}
          headerText="Accept Terms"
          initialFocus="prevent-close-continue-btn"
          onBeforeClose={() => {
            if (!canClose) {
              addEvent("Dialog close prevented (terms not accepted)");
              return false; // Prevent close
            }
          }}
          footer={
            <div className="flex gap-2">
              <Button
                id="prevent-close-continue-btn"
                size="Large"
                design="Primary"
                disabled={!canClose}
                onClick={() => setPreventCloseOpen(false)}
              >
                Continue
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <p>You must accept the terms and conditions to continue.</p>
            <div className="p-4 border rounded-md bg-muted/50 max-h-[200px] overflow-y-auto">
              <h4 className="font-semibold mb-2">Terms and Conditions</h4>
              <p className="text-sm text-secondary-foreground">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>
            <CheckBox
              checked={canClose}
              onChange={(detail) => setCanClose(detail.checked)}
              text="I accept the terms and conditions"
            />
            {!canClose && (
              <MessageStrip type="information">
                💡 Try pressing Escape or clicking the backdrop - the dialog won't close until you
                accept the terms!
              </MessageStrip>
            )}
          </div>
        </Dialog>

        {/* Imperative API Dialog */}
        <Dialog
          ref={dialogRef}
          headerText="Imperative API Dialog"
          initialFocus="imperative-confirm-btn"
          footer={
            <div className="flex gap-2">
              <Button
                id="imperative-confirm-btn"
                size="Large"
                design="Primary"
                onClick={() => {
                  dialogRef.current?.close("confirmed");
                }}
              >
                Confirm
              </Button>
              <Button
                size="Large"
                design="Secondary"
                onClick={() => {
                  dialogRef.current?.close("rejected");
                }}
              >
                Reject
              </Button>
            </div>
          }
          onAfterOpen={() => {
            addEvent("Dialog opened via ref.showModal()");
          }}
          onAfterClose={(detail) => {
            const value = detail.returnValue || "cancelled";
            setReturnValue(value);
            addEvent(`Dialog closed with return value: ${value}`);
          }}
        >
          <div className="space-y-4">
            <p>This dialog was opened using the imperative API (ref).</p>
            <p className="text-sm text-secondary-foreground">
              💡 The dialog returns a value when closed. Check the event log above!
            </p>
            {returnValue && (
              <div className="p-3 bg-muted rounded-md">
                <strong>Last Return Value:</strong> <code>{returnValue}</code>
              </div>
            )}
          </div>
        </Dialog>
      </section>

      {/* Keyboard Shortcuts */}
      <section id="keyboard-shortcuts" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-4">Keyboard Shortcuts</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center p-2 rounded hover:bg-muted/50">
            <span>Close dialog</span>
            <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Escape</kbd>
          </div>
          <div className="flex justify-between items-center p-2 rounded hover:bg-muted/50">
            <span>Move focus forward</span>
            <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Tab</kbd>
          </div>
          <div className="flex justify-between items-center p-2 rounded hover:bg-muted/50">
            <span>Move focus backward</span>
            <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Shift+Tab</kbd>
          </div>
          <div className="flex justify-between items-center p-2 rounded hover:bg-muted/50">
            <span>Activate focused button</span>
            <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Enter / Space</kbd>
          </div>
          <div className="flex justify-between items-center p-2 rounded hover:bg-muted/50 bg-blue-50 dark:bg-blue-950/20">
            <span>
              <strong>Drag dialog</strong> (when header focused)
            </span>
            <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">
              Arrow Keys
            </kbd>
          </div>
          <div className="flex justify-between items-center p-2 rounded hover:bg-muted/50 bg-blue-50 dark:bg-blue-950/20">
            <span>
              <strong>Resize dialog</strong> (if resizable)
            </span>
            <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Shift+Arrow</kbd>
          </div>
        </div>
        <p className="text-sm text-secondary-foreground mt-4">
          💡 Focus is trapped within the dialog while it's open, and returns to the trigger element
          when closed. Body scrolling is completely blocked (mouse, keyboard, touch).
        </p>
        <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
          <strong>NEW:</strong> Keyboard navigation for dragging and resizing!
          <br/>
          • To <strong>drag</strong>: Tab to the dialog header (it will show a focus ring), then use Arrow keys to move the dialog.
          <br/>
          • To <strong>resize</strong>: From anywhere in the dialog, press Shift+Arrow keys to resize.
          <br/>
          • Try opening a draggable dialog below and pressing Tab until the header is focused!
        </p>
      </section>

      {/* Multiple Dialog Stacking */}
      <section id="multiple-dialog-stacking" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Multiple Dialog Stacking</h2>
        <p className="text-secondary-foreground mb-4">
          Open multiple dialogs and see how they stack. Only the first dialog blocks body scrolling,
          and each dialog has the correct z-index. <strong>Press ESC to close only the topmost dialog!</strong>
          Scroll position is preserved when all dialogs close.
        </p>
        <Button onClick={() => setDialog1Open(true)}>Open First Dialog</Button>

        {/* Dialog 1 */}
        <Dialog
          open={dialog1Open}
          onOpenChange={setDialog1Open}
          headerText="First Dialog"
          state={DialogState.Information}
          initialFocus="dialog1-open-btn"
          footer={
            <div className="flex gap-2">
              <Button id="dialog1-open-btn" size="Large" design="Primary" onClick={() => setDialog2Open(true)}>
                Open Second Dialog
              </Button>
              <Button size="Large" design="Tertiary" onClick={() => setDialog1Open(false)}>
                Close
              </Button>
            </div>
          }
        >
          <p>This is the first dialog in the stack.</p>
          <p className="text-sm text-secondary-foreground mt-2">
            💡 Open another dialog to see stacking behavior. Try pressing ESC - it will only close the
            topmost dialog!
          </p>
        </Dialog>

        {/* Dialog 2 */}
        <Dialog
          open={dialog2Open}
          onOpenChange={setDialog2Open}
          headerText="Second Dialog"
          state={DialogState.Warning}
          initialFocus="dialog2-open-btn"
          footer={
            <div className="flex gap-2">
              <Button id="dialog2-open-btn" size="Large" design="Neutral" onClick={() => setDialog3Open(true)}>
                Open Third Dialog
              </Button>
              <Button size="Large" design="Tertiary" onClick={() => setDialog2Open(false)}>
                Close
              </Button>
            </div>
          }
        >
          <p>This is the second dialog, stacked on top of the first.</p>
          <p className="text-sm text-secondary-foreground mt-2">
            💡 This dialog has a higher z-index. Press ESC to close only this dialog (not the one
            below)!
          </p>
        </Dialog>

        {/* Dialog 3 */}
        <Dialog
          open={dialog3Open}
          onOpenChange={setDialog3Open}
          headerText="Third Dialog"
          state={DialogState.Success}
          initialFocus="dialog3-close-btn"
          footer={
            <Button id="dialog3-close-btn" size="Large" design="Primary" onClick={() => setDialog3Open(false)}>
              Close
            </Button>
          }
        >
          <p>This is the third dialog, the topmost one!</p>
          <p className="text-sm text-secondary-foreground mt-2">
            💡 Press ESC to close this dialog first. Then press ESC again to close the second dialog.
            ESC always closes only the topmost dialog. When all dialogs close, scroll position is
            restored.
          </p>
        </Dialog>
      </section>

      {/* Dynamic Content ResizeObserver */}
      <section id="dynamic-content-resizeobserver" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Dynamic Content (ResizeObserver)</h2>
        <p className="text-secondary-foreground mb-4">
          The dialog uses ResizeObserver to detect content changes. When content grows/shrinks, the
          dialog automatically adjusts to stay within viewport bounds.
        </p>
        <Button onClick={() => setDynamicOpen(true)}>Open Dynamic Dialog</Button>

        <Dialog
          open={dynamicOpen}
          onOpenChange={setDynamicOpen}
          headerText="Dynamic Content Test"
          draggable
          initialFocus="dynamic-close-btn"
          footer={
            <Button id="dynamic-close-btn" size="Large" design="Primary" onClick={() => setDynamicOpen(false)}>
              Close
            </Button>
          }
        >
          <div className="space-y-4">
            <p>Drag this dialog to the edge of the screen, then add more content:</p>

            <div className="flex gap-2">
              <Button
                design="Primary"
                onClick={() => setContentLines((prev) => Math.min(prev + 5, 50))}
              >
                Add Content
              </Button>
              <Button
                design="Secondary"
                onClick={() => setContentLines((prev) => Math.max(prev - 5, 1))}
              >
                Remove Content
              </Button>
            </div>

            <div className="p-4 bg-muted rounded-md space-y-2 max-h-[300px] overflow-y-auto">
              {Array.from({ length: contentLines }).map((_, i) => (
                <p key={i} className="text-sm">
                  Content line {i + 1} - This is dynamically added content to test ResizeObserver
                </p>
              ))}
            </div>

            <p className="text-sm text-secondary-foreground">
              💡 When positioned near viewport edges, the dialog will automatically reposition to stay
              in bounds as content changes size.
            </p>
          </div>
        </Dialog>
      </section>

      {/* Scroll Position Preservation */}
      <section id="scroll-position-preservation" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Scroll Position Preservation</h2>
        <p className="text-secondary-foreground mb-4">
          Scroll down this page, then open a dialog. When you close it, your scroll position will be
          preserved exactly where you left off.
        </p>

        <Button onClick={() => setScrollTestOpen(true)}>Open Dialog (Test Scroll)</Button>

        <Dialog
          open={scrollTestOpen}
          onOpenChange={setScrollTestOpen}
          headerText="Scroll Preservation Test"
          initialFocus="scroll-close-btn"
          footer={
            <Button id="scroll-close-btn" size="Large" design="Primary" onClick={() => setScrollTestOpen(false)}>
              Close and Restore Scroll
            </Button>
          }
        >
          <p>
            Your scroll position before opening this dialog has been saved and will be restored when
            you close it.
          </p>
          <p className="text-sm text-secondary-foreground mt-2">
            💡 This works even with multiple dialogs open. The scroll position is captured when the
            first dialog opens and restored when the last one closes.
          </p>
        </Dialog>

        {/* Add lots of content to enable scrolling */}
        <div className="mt-8 space-y-4">
          <h3 className="text-xl font-semibold">Scroll Test Content</h3>
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className="p-4 border rounded-md bg-muted/50">
              <h4 className="font-medium">Section {i + 1}</h4>
              <p className="text-sm text-secondary-foreground">
                This is test content to make the page scrollable. Scroll down, open the dialog, and
                then close it to see scroll position preservation in action. Lorem ipsum dolor sit
                amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Keyboard Shortcuts */}
      <section id="keyboard-shortcuts-2" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-4">Keyboard Shortcuts</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center p-2 rounded hover:bg-muted/50">
            <span>Close dialog</span>
            <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Escape</kbd>
          </div>
          <div className="flex justify-between items-center p-2 rounded hover:bg-muted/50">
            <span>Move focus forward</span>
            <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Tab</kbd>
          </div>
          <div className="flex justify-between items-center p-2 rounded hover:bg-muted/50">
            <span>Move focus backward</span>
            <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Shift+Tab</kbd>
          </div>
          <div className="flex justify-between items-center p-2 rounded hover:bg-muted/50">
            <span>Activate focused button</span>
            <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Enter / Space</kbd>
          </div>
        </div>
        <p className="text-sm text-secondary-foreground mt-4">
          💡 Focus is trapped within the dialog while it's open, and returns to the trigger element
          when closed.
        </p>
      </section>

      {/* Features */}
      <section id="key-features" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
        <ul className="list-disc list-inside space-y-2 text-secondary-foreground">
          <li>
            <strong className="text-foreground">Full UI5 Feature Parity:</strong> All properties,
            events, and slots from UI5 Web Components Dialog
          </li>
          <li>
            <strong className="text-foreground">Controlled & Uncontrolled:</strong> Use with
            useState or let the component manage its own state
          </li>
          <li>
            <strong className="text-foreground">State Variants:</strong> Error, Warning, Success,
            Information styling
          </li>
          <li>
            <strong className="text-foreground">Draggable:</strong> Drag by header with mouse or keyboard (Tab to header, then Arrow keys)
          </li>
          <li>
            <strong className="text-foreground">Resizable:</strong> Resize with mouse or keyboard (Shift+Arrow keys)
          </li>
          <li>
            <strong className="text-foreground">ResizeObserver:</strong> Automatically detects content
            size changes and adjusts positioning to stay within viewport bounds
          </li>
          <li>
            <strong className="text-foreground">RTL Support:</strong> Automatically detects RTL mode
            and reverses drag direction for natural behavior
          </li>
          <li>
            <strong className="text-foreground">Multiple Dialog Stacking:</strong> Proper z-index
            management. ESC key closes only the topmost dialog.
          </li>
          <li>
            <strong className="text-foreground">Scroll Blocking:</strong> Completely blocks body
            scrolling (mouse, keyboard, touch) when dialog is open
          </li>
          <li>
            <strong className="text-foreground">Scroll Preservation:</strong> Page scroll position is
            saved when first dialog opens and restored when last dialog closes
          </li>
          <li>
            <strong className="text-foreground">Focus Management:</strong> Automatic focus trapping
            and restoration. Focus trapping only applies to topmost dialog.
          </li>
          <li>
            <strong className="text-foreground">Event Prevention:</strong> Cancel open/close
            events for validation
          </li>
          <li>
            <strong className="text-foreground">Keyboard Navigation:</strong> Full keyboard
            support - ESC to close, Tab to navigate, Arrow keys to drag (when header focused), Shift+Arrow to resize
          </li>
          <li>
            <strong className="text-foreground">Accessibility:</strong> WCAG 2.1 AA compliant with
            ARIA roles and attributes
          </li>
          <li>
            <strong className="text-foreground">Return Values:</strong> Pass data back when dialog
            closes
          </li>
          <li>
            <strong className="text-foreground">Imperative API:</strong> Control via ref (show,
            showModal, close, focus)
          </li>
        </ul>
      </section>

      {/* Dialog with Panels */}
      <section id="dialog-with-panels" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Dialog with Panels</h2>
        <p className="text-secondary-foreground mb-4">
          Panels inside a dialog for collapsible content sections — useful for configuration screens.
        </p>
        <Button onClick={() => setPanelsDialogOpen(true)}>Open Configuration Dialog</Button>

        <Dialog
          open={panelsDialogOpen}
          onOpenChange={setPanelsDialogOpen}
          headerText="Dialog Title"
          subHeaderText="Dialog Subtitle"
          initialFocus="panels-ok-btn"
          footer={
            <div className="flex gap-2">
              <Button id="panels-ok-btn" size="Large" design="Primary" onClick={() => setPanelsDialogOpen(false)}>OK</Button>
              <Button size="Large" design="Tertiary" onClick={() => setPanelsDialogOpen(false)}>Cancel</Button>
            </div>
          }
        >
          <div className="space-y-3">
            {/* Additional Context Panel */}
            <Panel
              headerText="Additional Context"
              defaultCollapsed
              endSlot={
                <Button design="Transparent" icon={<Pencil className="h-3.5 w-3.5" />}>
                  Edit
                </Button>
              }
            >
              <p className="text-sm text-secondary-foreground">
                System: Warehouse + Transportation environment integrating WMS/TMS/ERP via APIs (local dev uses mocks).
              </p>
            </Panel>

            {/* MCP Servers Panel */}
            <Panel
              headerText="MCP Servers"
              noPadding
              endSlot={
                <Button design="Transparent" icon={<Pencil className="h-3.5 w-3.5" />}>
                  Edit
                </Button>
              }
            >
              <div className="divide-y divide-border">
                {[
                  { name: "Transportation Order", desc: "Manage transportation orders by reading, creating, and updating transportation order data including stages, items, partners,..." },
                  { name: "SAP HANA Cloud", desc: "Fetch historical freight order data from HANA for trend analysis, KPI calculation, and planning insights." },
                  { name: "get_freight_orders", desc: "Retrieve freight orders including header information, status, and key dates." },
                  { name: "create_freight_order", desc: "Create a new freight order with assigned stops, items, and partners." },
                  { name: "update_freight_order", desc: "Update freight order header details such as dates, status, or delivery priority." },
                ].map((server) => (
                  <div key={server.name} className="flex items-center gap-3 px-4 py-3">
                    <GripVertical className="h-4 w-4 text-muted-foreground shrink-0 cursor-grab" />
                    <div className="h-8 w-8 rounded-lg bg-sapphire-warning-bg flex items-center justify-center shrink-0">
                      <Wrench className="h-4 w-4 text-sapphire-warning" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{server.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{server.desc}</p>
                    </div>
                    <button type="button" className="p-1 rounded hover:bg-accent text-muted-foreground shrink-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </Dialog>
      </section>

      {/* Usage Example */}
      <section id="usage-example" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-4">Usage Example</h2>
        <CodeBlock
          language="tsx"
          code={`import { Dialog, DialogState, Button } from '@sap-ui/fx-components';
import { useState } from 'react';

function MyComponent() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        Open Dialog
      </Button>

      <Dialog
        open={open}
        onOpenChange={setOpen}
        headerText="Confirm Action"
        state={DialogState.Warning}
        onBeforeClose={(detail) => {
          // Prevent close if needed
          if (hasUnsavedChanges) return false;
        }}
        footer={
          <>
            <Button onClick={() => setOpen(false)}>
              Confirm
            </Button>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </>
        }
      >
        Are you sure you want to proceed?
      </Dialog>
    </>
  );
}`}
        />
      </section>
    </div>
  );
}

export default DialogPage;
