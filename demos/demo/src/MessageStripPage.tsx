import { useState } from "react";
import {
  MessageStrip,
  MessageStripDesign,
  MessageStripCloseDetail,
  Link,
  LinkDesign,
} from "@sap-ui/fx-components";
import { CodeBlock } from "./components/CodeBlock";

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export function MessageStripPage() {
  const handleClose = (detail: MessageStripCloseDetail) => {
    console.log("MessageStrip closed:", detail);
  };

  const [lastSync, setLastSync] = useState(() => new Date());
  const [syncStatus, setSyncStatus] = useState<"ok" | "error" | "stale">("stale");

  const handleRefresh = () => {
    const now = new Date();
    setLastSync(now);
    setSyncStatus(Math.random() > 0.3 ? "ok" : "error");
  };

  const [updateCount, setUpdateCount] = useState(3);
  const [lastCheck, setLastCheck] = useState(() => new Date());

  const handleCheckUpdates = () => {
    setLastCheck(new Date());
    setUpdateCount(Math.floor(Math.random() * 5));
  };

  return (
    <div className="space-y-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">MessageStrip</h1>
        <code className="text-sm text-primary/70 font-mono">{'import { MessageStrip } from "@sap-ui/fx-components"'}</code>
      </header>

      {/* Basic MessageStrips — matches Figma spec */}
      <section id="basic-messagestrips" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Basic MessageStrips</h2>
        <p className="text-secondary-foreground mb-4">
          Four design variants as shown in Figma — each with an inline link and close button.
        </p>
        <div className="max-w-3xl space-y-4">
          <MessageStrip design={MessageStripDesign.Positive}>
            This is a message. <Link href="#" design={LinkDesign.Emphasized}>Learn More</Link>
          </MessageStrip>

          <MessageStrip design={MessageStripDesign.Negative}>
            This is a message. <Link href="#" design={LinkDesign.Emphasized}>Learn More</Link>
          </MessageStrip>

          <MessageStrip design={MessageStripDesign.Warning}>
            This is a message. <Link href="#" design={LinkDesign.Emphasized}>Learn More</Link>
          </MessageStrip>

          <MessageStrip design={MessageStripDesign.Information}>
            This is a message. <Link href="#" design={LinkDesign.Emphasized}>Learn More</Link>
          </MessageStrip>
        </div>
      </section>

      {/* With Title */}
      <section id="with-title" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">With Title</h2>
        <p className="text-secondary-foreground mb-4">
          Two-line layout with a title above the content. Title enables larger padding, icon, and close button.
        </p>
        <div className="max-w-3xl space-y-4">
          <MessageStrip design={MessageStripDesign.Positive} title="This is a success message.">
            Congratulations! Your action was successful. <Link href="#" design={LinkDesign.Emphasized}>Learn More</Link>
          </MessageStrip>

          <MessageStrip design={MessageStripDesign.Negative} title="This is an error message.">
            Something went wrong. Please try again. <Link href="#" design={LinkDesign.Emphasized}>Learn More</Link>
          </MessageStrip>

          <MessageStrip design={MessageStripDesign.Warning} title="This is a warning message.">
            Please review your settings before proceeding. <Link href="#" design={LinkDesign.Emphasized}>Learn More</Link>
          </MessageStrip>

          <MessageStrip design={MessageStripDesign.Information} title="This is an information message.">
            A new version is available for download. <Link href="#" design={LinkDesign.Emphasized}>Learn More</Link>
          </MessageStrip>
        </div>
      </section>

      {/* Title Wrapping & Truncating */}
      <section id="title-wrapping-truncating" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Title Wrapping & Truncating</h2>
        <p className="text-secondary-foreground mb-4">
          By default, titles wrap to multiple lines. Use{" "}
          <code className="bg-muted px-1 rounded">titleTruncate</code> to
          truncate with an ellipsis instead.
        </p>
        <div className="space-y-6">
          <div>
            <div className="text-xs font-medium text-secondary-foreground mb-2">Wrapping (default)</div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div style={{ maxWidth: 450 }}>
                <div className="text-[10px] text-secondary-foreground mb-1">Multi-line</div>
                <MessageStrip design={MessageStripDesign.Positive} title="This is a message that wraps to multiple lines." showRefresh>
                  Congratulations! Your action was successful. You can now proceed with the next steps. <Link href="#" design={LinkDesign.Emphasized}>Learn More</Link>
                </MessageStrip>
              </div>
              <div>
                <div className="text-[10px] text-secondary-foreground mb-1">Title only</div>
                <MessageStrip design={MessageStripDesign.Positive} title="This is a success message that wraps when the container is narrow enough." showRefresh />
              </div>
            </div>
          </div>
          <div>
            <div className="text-xs font-medium text-secondary-foreground mb-2">Truncated — <code className="bg-muted px-1 rounded text-xs">titleTruncate</code></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div style={{ maxWidth: 450 }}>
                <div className="text-[10px] text-secondary-foreground mb-1">Multi-line (truncated title)</div>
                <MessageStrip design={MessageStripDesign.Positive} title="This is a message that would be truncated with ellipsis." titleTruncate showRefresh>
                  Congratulations! Your action was successful. You can now proceed with the next steps.
                </MessageStrip>
              </div>
              <div>
                <div className="text-[10px] text-secondary-foreground mb-1">Title only</div>
                <MessageStrip design={MessageStripDesign.Positive} title="This is a success message that gets truncated when the container is narrow enough." titleTruncate />
                <div className="text-[10px] text-secondary-foreground mt-4 mb-1">Single line with link</div>
                <MessageStrip design={MessageStripDesign.Positive} titleTruncate>
                  This is a success message that gets truncated when the container is narrow enough. <Link href="#" design={LinkDesign.Emphasized}>Learn More</Link>
                </MessageStrip>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* With Refresh Button */}
      <section id="with-refresh-button" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">With Refresh Button</h2>
        <p className="text-secondary-foreground mb-4">
          Click Refresh to simulate a data sync. The strip updates based on the result.
        </p>
        <div className="max-w-3xl space-y-4">
          <MessageStrip
            design={syncStatus === "ok" ? MessageStripDesign.Positive : syncStatus === "error" ? MessageStripDesign.Negative : MessageStripDesign.Warning}
            title={syncStatus === "ok" ? "Data synced successfully." : syncStatus === "error" ? "Sync failed." : "Data may be outdated."}
            showRefresh
            onRefresh={handleRefresh}
          >
            {syncStatus === "ok" && <>All records are up to date as of {formatTime(lastSync)}.</>}
            {syncStatus === "error" && <>Could not reach the server. Last successful sync at {formatTime(lastSync)}. <Link href="#" design={LinkDesign.Emphasized}>View Logs</Link></>}
            {syncStatus === "stale" && <>You are viewing cached data from {formatTime(lastSync)}. Press Refresh to fetch the latest.</>}
          </MessageStrip>

          <MessageStrip
            design={updateCount === 0 ? MessageStripDesign.Positive : MessageStripDesign.Information}
            title={updateCount === 0 ? "Everything is up to date." : `${updateCount} pending update${updateCount > 1 ? "s" : ""} available.`}
            showRefresh
            onRefresh={handleCheckUpdates}
          >
            {updateCount === 0
              ? <>No new updates since {formatTime(lastCheck)}.</>
              : <>A new version of the configuration is ready. Last checked at {formatTime(lastCheck)}. <Link href="#" design={LinkDesign.Emphasized}>View Changes</Link></>}
          </MessageStrip>
        </div>
      </section>

      {/* With Close Button */}
      <section id="with-close-button" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">With Close Button</h2>
        <p className="text-secondary-foreground mb-4">
          MessageStrips with close functionality (default behavior).
        </p>
        <div className="max-w-3xl space-y-4">
          <MessageStrip
            design={MessageStripDesign.Information}
            onClose={handleClose}
          >
            Click the × button to dismiss this message.
          </MessageStrip>

          <MessageStrip
            design={MessageStripDesign.Positive}
            onClose={handleClose}
          >
            Your profile has been updated. This message can be closed.
          </MessageStrip>
        </div>
      </section>

      {/* Without Close Button */}
      <section id="without-close-button" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Without Close Button</h2>
        <p className="text-secondary-foreground mb-4">
          Persistent messages that cannot be dismissed.
        </p>
        <div className="max-w-3xl space-y-4">
          <MessageStrip
            design={MessageStripDesign.Warning}
            hideCloseButton
          >
            This is a persistent warning that cannot be dismissed.
          </MessageStrip>

          <MessageStrip
            design={MessageStripDesign.Negative}
            hideCloseButton
          >
            Critical system error - please contact support immediately.
          </MessageStrip>
        </div>
      </section>

      {/* Without Icons */}
      <section id="without-icons" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Without Icons</h2>
        <p className="text-secondary-foreground mb-4">
          Text-only messages without icons.
        </p>
        <div className="max-w-3xl space-y-4">
          <MessageStrip
            design={MessageStripDesign.Information}
            hideIcon
          >
            This is a text-only informational message.
          </MessageStrip>

          <MessageStrip
            design={MessageStripDesign.Positive}
            hideIcon
          >
            Operation completed successfully.
          </MessageStrip>
        </div>
      </section>

      {/* Use Cases */}
      <section id="common-use-cases" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Common Use Cases</h2>
        <p className="text-secondary-foreground mb-4">
          Real-world examples of MessageStrip usage.
        </p>
        <div className="max-w-3xl space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Form Validation</h3>
            <MessageStrip design={MessageStripDesign.Negative} hideCloseButton>
              Please correct the following errors:
              <ul className="list-disc list-inside mt-1">
                <li>Email address is required</li>
                <li>Password must be at least 8 characters</li>
              </ul>
            </MessageStrip>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Success Notification</h3>
            <MessageStrip design={MessageStripDesign.Positive}>
              Your order #12345 has been confirmed and will be shipped within 2-3 business days.
            </MessageStrip>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Maintenance Notice</h3>
            <MessageStrip design={MessageStripDesign.Warning} hideCloseButton>
              Scheduled maintenance: The system will be unavailable on Saturday from 2:00 AM to 6:00 AM EST.
            </MessageStrip>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">System Status</h3>
            <MessageStrip design={MessageStripDesign.Information} hideCloseButton>
              You are currently viewing data as of 2024-03-02. <Link href="#" design={LinkDesign.Emphasized}>Refresh</Link> to see the latest updates.
            </MessageStrip>
          </div>
        </div>
      </section>

      {/* Accessibility */}
      <section id="accessibility" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Accessibility</h2>
        <p className="text-secondary-foreground mb-4">
          MessageStrips use appropriate ARIA roles by default:
        </p>
        <div className="max-w-3xl space-y-4">
          <div>
            <p className="text-sm text-secondary-foreground mb-2">
              <strong>role="alert"</strong> for Negative and Warning (requires immediate attention)
            </p>
            <MessageStrip design={MessageStripDesign.Negative} hideCloseButton>
              Critical: Database connection lost
            </MessageStrip>
          </div>

          <div>
            <p className="text-sm text-secondary-foreground mb-2">
              <strong>role="status"</strong> for Information and Positive (non-urgent updates)
            </p>
            <MessageStrip design={MessageStripDesign.Information} hideCloseButton>
              Your session will expire in 5 minutes
            </MessageStrip>
          </div>
        </div>
      </section>

      {/* Usage Example */}
      <section id="usage-example" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-4">Usage Example</h2>
        <CodeBlock
          language="tsx"
          code={`import { MessageStrip, MessageStripDesign } from "@sap-ui/fx-components";

{/* Basic */}
<MessageStrip design={MessageStripDesign.Information}>
  This is a message.
</MessageStrip>

{/* With Title */}
<MessageStrip design={MessageStripDesign.Information}>
  <strong>Title</strong> This is a message.
</MessageStrip>`}
        />
      </section>
    </div>
  );
}
