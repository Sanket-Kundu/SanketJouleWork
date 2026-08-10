import { useState, useCallback } from "react";
import {
  NotificationList,
  NotificationListItem,
  NotificationListGroupItem,
  NotificationListItemImportance,
  NotificationListItemState,
  Avatar,
  AvatarShape,
  Button,
  ButtonDesign,
  Select,
  Option,
  CheckBox,
  Label,
} from "@sap-ui/fx-components";
import { CodeBlock } from "./components/CodeBlock";
// SAP Icons
import { CartIcon } from "../../../src/icons/Cart";
import { CreditCardIcon } from "../../../src/icons/CreditCard";
import { ShippingStatusIcon } from "../../../src/icons/ShippingStatus";
import { AlertIcon } from "../../../src/icons/Alert";
import { SettingsIcon } from "../../../src/icons/Settings";
import { AddEmployeeIcon } from "../../../src/icons/AddEmployee";
import { CommentIcon } from "../../../src/icons/Comment";
import { DocumentIcon } from "../../../src/icons/Document";
import { ChecklistIcon } from "../../../src/icons/Checklist";


// Sample notification data
interface Notification {
  id: string;
  titleText: string;
  description: string;
  state: NotificationListItemState;
  importance: NotificationListItemImportance;
  read: boolean;
  avatar: React.ReactNode;
  avatarColor?: string;
  footnotes: string[];
  timestamp: string;
}

const sampleNotifications: Notification[] = [
  {
    id: "1",
    titleText: "New order #4829 received",
    description:
      "A new order has been placed by John Smith for 3 items totaling $247.50. The order includes expedited shipping and requires processing within 24 hours. Please review the order details and confirm availability.",
    state: NotificationListItemState.Information,
    importance: NotificationListItemImportance.Standard,
    read: false,
    avatar: <CartIcon className="h-4 w-4" />,
    avatarColor: "Accent6",
    footnotes: ["John Smith", "2 min ago"],
    timestamp: "2 min ago",
  },
  {
    id: "2",
    titleText: "Payment failed for invoice #INV-2024-0892",
    description:
      "The automatic payment for invoice #INV-2024-0892 has failed due to insufficient funds. The customer has been notified and a retry is scheduled for tomorrow. Manual follow-up may be required if the retry also fails.",
    state: NotificationListItemState.Negative,
    importance: NotificationListItemImportance.Important,
    read: false,
    avatar: <CreditCardIcon className="h-4 w-4" />,
    avatarColor: "Accent9",
    footnotes: ["Acme Corp", "15 min ago", "Finance"],
    timestamp: "15 min ago",
  },
  {
    id: "3",
    titleText: "Shipment delivered successfully",
    description: "Order #4815 has been delivered to the customer address.",
    state: NotificationListItemState.Positive,
    importance: NotificationListItemImportance.Standard,
    read: true,
    avatar: <ShippingStatusIcon className="h-4 w-4" />,
    avatarColor: "Accent7",
    footnotes: ["FedEx", "1 hour ago"],
    timestamp: "1 hour ago",
  },
  {
    id: "4",
    titleText: "Low stock alert: Widget Pro X",
    description:
      "Current stock level is 12 units, which is below the minimum threshold of 25 units. Reorder has been automatically triggered. Expected delivery from supplier in 3-5 business days.",
    state: NotificationListItemState.Critical,
    importance: NotificationListItemImportance.Important,
    read: false,
    avatar: <AlertIcon className="h-4 w-4" />,
    avatarColor: "Accent3",
    footnotes: ["Warehouse", "2 hours ago", "Inventory"],
    timestamp: "2 hours ago",
  },
  {
    id: "5",
    titleText: "System maintenance scheduled",
    description:
      "Planned downtime on Saturday from 2:00 AM to 6:00 AM EST for database upgrades. All services will be temporarily unavailable.",
    state: NotificationListItemState.Information,
    importance: NotificationListItemImportance.Standard,
    read: true,
    avatar: <SettingsIcon className="h-4 w-4" />,
    avatarColor: "Accent4",
    footnotes: ["IT Operations", "Yesterday"],
    timestamp: "Yesterday",
  },
  {
    id: "6",
    titleText: "New team member joined",
    description: "Emily Chen has joined the Engineering team as a Senior Developer.",
    state: NotificationListItemState.None,
    importance: NotificationListItemImportance.Standard,
    read: true,
    avatar: <AddEmployeeIcon className="h-4 w-4" />,
    avatarColor: "Accent10",
    footnotes: ["HR", "2 days ago"],
    timestamp: "2 days ago",
  },
];

const groupedNotifications = {
  today: sampleNotifications.slice(0, 2),
  earlier: sampleNotifications.slice(2, 4),
  older: sampleNotifications.slice(4),
};

export function NotificationPage() {
  // State controls
  const [stateFilter, setStateFilter] = useState<string>("All");
  const [showClose, setShowClose] = useState(true);

  // Basic list state
  const [notifications, setNotifications] = useState(sampleNotifications);

  // Grouped list state
  const [groupedToday, setGroupedToday] = useState(groupedNotifications.today);
  const [groupedEarlier, setGroupedEarlier] = useState(groupedNotifications.earlier);
  const [groupedOlder, setGroupedOlder] = useState(groupedNotifications.older);

  // Loading demo
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Growing demo
  const [growingItems, setGrowingItems] = useState(sampleNotifications.slice(0, 2));
  const [growingLoading, setGrowingLoading] = useState(false);

  const handleClose = useCallback(
    (id: string) => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    },
    [],
  );

  const handleGroupClose = useCallback(
    (id: string, group: "today" | "earlier" | "older") => {
      const setter =
        group === "today"
          ? setGroupedToday
          : group === "earlier"
            ? setGroupedEarlier
            : setGroupedOlder;
      setter((prev) => prev.filter((n) => n.id !== id));
    },
    [],
  );

  const handleItemClick = useCallback(
    (id: string) => {
      // Mark as read on click
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );
    },
    [],
  );

  const handleLoadingDemo = useCallback((id: string) => {
    setLoadingId(id);
    setTimeout(() => setLoadingId(null), 2000);
  }, []);

  const handleLoadMore = useCallback(() => {
    setGrowingLoading(true);
    setTimeout(() => {
      setGrowingItems((prev) => {
        const nextItems = sampleNotifications.slice(0, prev.length + 2);
        return nextItems;
      });
      setGrowingLoading(false);
    }, 1000);
  }, []);

  const filteredNotifications =
    stateFilter === "All"
      ? notifications
      : notifications.filter((n) => String(n.state) === stateFilter);

  const renderNotificationItem = (
    n: Notification,
    opts?: {
      onClose?: () => void;
      loading?: boolean;
      onClick?: () => void;
    },
  ) => (
    <NotificationListItem
      key={n.id}
      titleText={n.titleText}
      state={n.state}
      read={n.read}
      showClose={showClose}
      onClose={opts?.onClose}
      onClick={opts?.onClick}
      loading={opts?.loading}
      avatar={
        <Avatar
          icon={n.avatar}
          colorScheme={(n.avatarColor ?? "Accent1") as any}
          size="XS"
          shape={AvatarShape.Square}
        />
      }
      footnotes={n.footnotes.map((f) => f)}
    >
      {n.description}
    </NotificationListItem>
  );

  return (
    <div className="space-y-8 p-6">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">NotificationList</h1>
        <code className="text-sm text-primary/70 font-mono">{'import { NotificationList, NotificationListItem } from "@sap-ui/fx-components"'}</code>
      </header>

      {/* Controls */}
      <div className="flex items-center flex-wrap gap-4 p-4 bg-muted/30 rounded-lg">
        <div className="flex items-center gap-2">
          <Label>Filter by State:</Label>
          <Select
            value={stateFilter}
            onChange={(detail) =>
              setStateFilter(detail.selectedOption?.value ?? "All")
            }
            className="w-[150px]"
          >
            <Option value="All">All</Option>
            <Option value="None">None</Option>
            <Option value="Positive">Positive</Option>
            <Option value="Critical">Critical</Option>
            <Option value="Negative">Negative</Option>
            <Option value="Information">Information</Option>
          </Select>
        </div>

        <CheckBox
          checked={showClose}
          onChange={(detail) => setShowClose(detail.checked)}
          text="Show Close Button"
        />

        <Button
          design={ButtonDesign.Primary}
          onClick={() => {
            setNotifications(sampleNotifications);
            setGroupedToday(groupedNotifications.today);
            setGroupedEarlier(groupedNotifications.earlier);
            setGroupedOlder(groupedNotifications.older);
          }}
        >
          Reset All
        </Button>
      </div>

      {/* Basic Notification List */}
      <section id="basic-notification-list" className="space-y-4">
        <h2 className="text-lg font-semibold">Basic Notification List</h2>
        <p className="text-sm text-secondary-foreground">
          Individual notifications with states, importance badges, avatars,
          footnotes, and close buttons. Click to mark as read.
        </p>
        <NotificationList
          accessibleName="Notifications"
          onItemClick={(detail) => {
            console.log("Notification clicked:", detail);
          }}
          onItemClose={(detail) => {
            console.log("Notification closed:", detail);
          }}
        >
          {filteredNotifications.map((n) =>
            renderNotificationItem(n, {
              onClose: () => handleClose(n.id),
              onClick: () => handleItemClick(n.id),
            }),
          )}
        </NotificationList>
        {filteredNotifications.length === 0 && (
          <p className="text-sm text-secondary-foreground italic">
            No notifications match the current filter. Try &quot;All&quot; or click Reset.
          </p>
        )}
      </section>

      {/* Notification States */}
      <section id="notification-states" className="space-y-4">
        <h2 className="text-lg font-semibold">Notification States</h2>
        <p className="text-sm text-secondary-foreground">
          Each notification state displays a colored icon indicator.
        </p>
        <NotificationList accessibleName="State examples">
            <NotificationListItem
              titleText="No state indicator"
              state={NotificationListItemState.None}
              read
              footnotes={["System"]}
            >
              Default notification without a state icon.
            </NotificationListItem>
            <NotificationListItem
              titleText="Positive: Action completed"
              state={NotificationListItemState.Positive}
              read
              footnotes={["System", "Just now"]}
            >
              The requested action was completed successfully.
            </NotificationListItem>
            <NotificationListItem
              titleText="Information: New update available"
              state={NotificationListItemState.Information}
              footnotes={["Updates"]}
            >
              Version 2.5.0 is available for download.
            </NotificationListItem>
            <NotificationListItem
              titleText="Critical: Disk space running low"
              state={NotificationListItemState.Critical}
              footnotes={["Infrastructure", "Warning"]}
            >
              Server disk usage is at 89%. Consider cleaning up old logs.
            </NotificationListItem>
            <NotificationListItem
              titleText="Negative: Build failed"
              state={NotificationListItemState.Negative}
              footnotes={["CI/CD", "main branch"]}
            >
              Pipeline #4521 failed at the test stage. 3 tests failing.
            </NotificationListItem>
          </NotificationList>
      </section>

      {/* Show More / Less */}
      <section id="show-more-less" className="space-y-4">
        <h2 className="text-lg font-semibold">Show More / Less</h2>
        <p className="text-sm text-secondary-foreground">
          Long descriptions are automatically truncated to 2 lines with a
          &quot;Show More&quot; toggle. Use Shift+Enter on a focused item to toggle.
        </p>
        <NotificationList accessibleName="Long descriptions">
            <NotificationListItem
              titleText="Detailed system report"
              state={NotificationListItemState.Information}
              read
              footnotes={["Analytics", "Daily Report", "Auto-generated"]}
            >
              The daily system health report shows that all 47 microservices are
              operating within normal parameters. CPU utilization averaged 34%
              across all instances, with peak usage of 78% during the morning
              traffic surge at 09:15 UTC. Memory consumption remains stable at
              62% of allocated resources. Database query response times improved
              by 12% following yesterday&apos;s index optimization. Three minor
              incidents were automatically resolved by the self-healing system.
              No action required at this time.
            </NotificationListItem>
            <NotificationListItem
              titleText="Short notification"
              state={NotificationListItemState.Positive}
              read
              footnotes={["System"]}
            >
              Backup completed.
            </NotificationListItem>
          </NotificationList>
      </section>

      {/* Grouped Notifications */}
      <section id="grouped-notifications" className="space-y-4">
        <h2 className="text-lg font-semibold">Grouped Notifications</h2>
        <p className="text-sm text-secondary-foreground">
          Notifications organized in collapsible groups. Click group headers or
          use Space/Enter to toggle. Arrow keys expand/collapse.
        </p>
        <NotificationList
          accessibleName="Grouped notifications"
          onItemToggle={(detail) =>
            console.log("Group toggled:", detail.collapsed)
          }
        >
            <NotificationListGroupItem
              titleText="Today"
              defaultCollapsed={false}
            >
              {groupedToday.map((n) =>
                renderNotificationItem(n, {
                  onClose: () => handleGroupClose(n.id, "today"),
                }),
              )}
              {groupedToday.length === 0 && (
                <div className="px-4 py-6 text-sm text-secondary-foreground text-center">
                  No notifications today
                </div>
              )}
            </NotificationListGroupItem>

            <NotificationListGroupItem
              titleText="Earlier This Week"
              defaultCollapsed={false}
            >
              {groupedEarlier.map((n) =>
                renderNotificationItem(n, {
                  onClose: () => handleGroupClose(n.id, "earlier"),
                }),
              )}
              {groupedEarlier.length === 0 && (
                <div className="px-4 py-6 text-sm text-secondary-foreground text-center">
                  No earlier notifications
                </div>
              )}
            </NotificationListGroupItem>

            <NotificationListGroupItem
              titleText="Older"
              defaultCollapsed
              read
            >
              {groupedOlder.map((n) =>
                renderNotificationItem(n, {
                  onClose: () => handleGroupClose(n.id, "older"),
                }),
              )}
            </NotificationListGroupItem>
          </NotificationList>
      </section>

      {/* With Avatars (Avatar Component) */}
      <section id="with-avatar-component" className="space-y-4">
        <h2 className="text-lg font-semibold">With Avatar Component</h2>
        <p className="text-sm text-secondary-foreground">
          Using the Avatar component from the library with square shape for notifications.
        </p>
        <NotificationList accessibleName="Notifications with avatars">
            <NotificationListItem
              titleText="Alice commented on your PR"
              state={NotificationListItemState.Information}
              footnotes={["Pull Request #142", "5 min ago"]}
              avatar={
                <Avatar
                  icon={<CommentIcon className="h-4 w-4" />}
                  colorScheme="Accent6"
                  size="XS"
                  shape={AvatarShape.Square}
                />
              }
            >
              Looks great! Just a small suggestion on the error handling in line 45.
            </NotificationListItem>
            <NotificationListItem
              titleText="Bob assigned you a task"
              state={NotificationListItemState.None}
              footnotes={["Project Alpha", "30 min ago"]}
              avatar={
                <Avatar
                  icon={<ChecklistIcon className="h-4 w-4" />}
                  colorScheme="Accent3"
                  size="XS"
                  shape={AvatarShape.Square}
                />
              }
            >
              Please review the API design document before Friday&apos;s meeting.
            </NotificationListItem>
            <NotificationListItem
              titleText="Charlie shared a file"
              state={NotificationListItemState.Positive}
              read
              footnotes={["Shared Files", "1 hour ago"]}
              avatar={
                <Avatar
                  icon={<DocumentIcon className="h-4 w-4" />}
                  colorScheme="Accent8"
                  size="XS"
                  shape={AvatarShape.Square}
                />
              }
            >
              Q4 Budget Report.xlsx has been shared with you.
            </NotificationListItem>
          </NotificationList>
      </section>

      {/* Loading State */}
      <section id="loading-state" className="space-y-4">
        <h2 className="text-lg font-semibold">Loading State</h2>
        <p className="text-sm text-secondary-foreground">
          Individual items can show a loading overlay. Click an item below to
          simulate loading (2s delay).
        </p>
        <NotificationList accessibleName="Loading demo">
            {sampleNotifications.slice(0, 3).map((n) => (
              <NotificationListItem
                key={n.id}
                titleText={n.titleText}
                state={n.state}
                read={n.read}
                loading={loadingId === n.id}
                loadingDelay={300}
                footnotes={n.footnotes}
                avatar={
                  <Avatar
                    icon={n.avatar}
                    colorScheme={(n.avatarColor ?? "Accent1") as any}
                    size="XS"
                    shape={AvatarShape.Square}
                  />
                }
              >
                <span>
                  {n.description}{" "}
                  <button
                    className="text-primary hover:underline text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLoadingDemo(n.id);
                    }}
                  >
                    [Trigger loading]
                  </button>
                </span>
              </NotificationListItem>
            ))}
          </NotificationList>
      </section>

      {/* Growing Group */}
      <section id="group-with-load-more" className="space-y-4">
        <h2 className="text-lg font-semibold">Group with Load More</h2>
        <p className="text-sm text-secondary-foreground">
          Groups can have a &quot;More&quot; button to load additional notifications.
        </p>
        <NotificationList accessibleName="Growing group demo">
            <NotificationListGroupItem
              titleText="Recent Activity"
              growing={growingItems.length < sampleNotifications.length ? "Button" : "None"}
              loading={growingLoading}
              onLoadMore={handleLoadMore}
            >
              {growingItems.map((n) => (
                <NotificationListItem
                  key={n.id}
                  titleText={n.titleText}
                  state={n.state}
                  read={n.read}
                  footnotes={n.footnotes}
                >
                  {n.description}
                </NotificationListItem>
              ))}
            </NotificationListGroupItem>
          </NotificationList>
      </section>

      {/* Empty State */}
      <section id="empty-state" className="space-y-4">
        <h2 className="text-lg font-semibold">Empty State</h2>
        <NotificationList
          noDataText="You're all caught up! No new notifications."
          accessibleName="Empty notification list"
        />
      </section>

      {/* Keyboard Navigation Info */}
      <section id="keyboard-navigation" className="space-y-4">
        <h2 className="text-lg font-semibold">Keyboard Navigation</h2>
        <div className="p-4 bg-muted/30 rounded-lg space-y-2 text-sm">
          <p className="font-semibold mb-3">List Navigation</p>
          <p>
            <kbd className="px-2 py-1 bg-background rounded border">↑</kbd> /{" "}
            <kbd className="px-2 py-1 bg-background rounded border">↓</kbd> -
            Navigate between items
          </p>
          <p>
            <kbd className="px-2 py-1 bg-background rounded border">Home</kbd>{" "}
            - Jump to first item
          </p>
          <p>
            <kbd className="px-2 py-1 bg-background rounded border">End</kbd> -
            Jump to last item
          </p>
          <p className="font-semibold mb-3 mt-4">Item Actions</p>
          <p>
            <kbd className="px-2 py-1 bg-background rounded border">Enter</kbd>{" "}
            - Activate/click item
          </p>
          <p>
            <kbd className="px-2 py-1 bg-background rounded border">Delete</kbd>{" "}
            - Close notification (when close button visible)
          </p>
          <p>
            <kbd className="px-2 py-1 bg-background rounded border">Shift</kbd>
            {" + "}
            <kbd className="px-2 py-1 bg-background rounded border">Enter</kbd>{" "}
            - Toggle Show More/Less
          </p>
          <p>
            <kbd className="px-2 py-1 bg-background rounded border">Shift</kbd>
            {" + "}
            <kbd className="px-2 py-1 bg-background rounded border">F10</kbd> -
            Open context menu
          </p>
          <p className="font-semibold mb-3 mt-4">Group Actions</p>
          <p>
            <kbd className="px-2 py-1 bg-background rounded border">Space</kbd>{" "}
            /{" "}
            <kbd className="px-2 py-1 bg-background rounded border">Enter</kbd>{" "}
            - Toggle group collapse
          </p>
          <p>
            <kbd className="px-2 py-1 bg-background rounded border">→</kbd> /{" "}
            <kbd className="px-2 py-1 bg-background rounded border">+</kbd> -
            Expand group
          </p>
          <p>
            <kbd className="px-2 py-1 bg-background rounded border">←</kbd> /{" "}
            <kbd className="px-2 py-1 bg-background rounded border">-</kbd> -
            Collapse group
          </p>
        </div>
      </section>

      {/* Usage Example */}
      <section id="usage-example" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-4">Usage Example</h2>
        <CodeBlock
          language="tsx"
          code={`import {
  NotificationList,
  NotificationListItem,
  NotificationListGroupItem,
  NotificationListItemImportance,
  NotificationListItemState,
  Avatar,
  AvatarShape,
} from "@sap-ui/fx-components";
import { CartIcon } from "@sap-ui/fx-components/icons/Cart";
import { CreditCardIcon } from "@sap-ui/fx-components/icons/CreditCard";
import { DocumentIcon } from "@sap-ui/fx-components/icons/Document";

function Notifications() {
  return (
    <NotificationList accessibleName="Notifications">
      {/* Individual notification */}
      <NotificationListItem
        titleText="New order received"
        state={NotificationListItemState.Information}
        showClose
        onClose={() => console.log("dismissed")}
        avatar={
          <Avatar
            icon={<CartIcon className="h-4 w-4" />}
            size="XS"
            shape={AvatarShape.Square}
            colorScheme="Accent6"
          />
        }
        footnotes={["John Smith", "2 min ago"]}
      >
        Order #4829 for 3 items totaling $247.50.
      </NotificationListItem>

      {/* Important error notification */}
      <NotificationListItem
        titleText="Payment failed"
        state={NotificationListItemState.Negative}
        avatar={
          <Avatar
            icon={<CreditCardIcon className="h-4 w-4" />}
            size="XS"
            shape={AvatarShape.Square}
            colorScheme="Accent3"
          />
        }
        footnotes={["Finance", "15 min ago"]}
      >
        Invoice #INV-2024-0892 payment failed.
      </NotificationListItem>

      {/* Grouped notifications */}
      <NotificationListGroupItem
        titleText="Earlier This Week"
        defaultCollapsed={false}
      >
        <NotificationListItem
          titleText="Shipment delivered"
          state={NotificationListItemState.Positive}
          read
          avatar={
            <Avatar
              icon={<DocumentIcon className="h-4 w-4" />}
              size="XS"
              shape={AvatarShape.Square}
              colorScheme="Accent8"
            />
          }
          footnotes={["FedEx", "1 hour ago"]}
        >
          Order #4815 has been delivered.
        </NotificationListItem>
      </NotificationListGroupItem>
    </NotificationList>
  );
}`}
        />
      </section>
    </div>
  );
}

export default NotificationPage;
