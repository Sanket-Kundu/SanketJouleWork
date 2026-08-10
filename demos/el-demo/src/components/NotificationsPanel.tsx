import { forwardRef, useRef, useImperativeHandle } from "react";
import { cn, ResponsivePopover, NotificationList, NotificationListItem, Avatar, Button } from "@sap-ui/fx-components";
import { NotificationListItemState } from "@sap-ui/fx-components";
import type { ResponsivePopoverRef } from "@sap-ui/fx-components";

/**
 * Props for the NotificationsPanel component.
 */
export interface NotificationsPanelProps {
  /** Whether the panel is open */
  open?: boolean;
  /** Element that triggers/anchors the panel */
  opener?: HTMLElement | null;
  /** Called when the panel closes */
  onClose?: () => void;
  /** Called when the panel opens */
  onOpen?: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Ref interface for NotificationsPanel
 */
export interface NotificationsPanelRef {
  /** Close the panel */
  close: () => void;
  /** Check if the panel is open */
  isOpen: () => boolean;
}

/**
 * NotificationsPanel component
 *
 * A notifications panel that displays a list of notification items.
 * Opens as a popover anchored to the notifications nav item.
 *
 * NOTE: This is a sample implementation for the el-demo app.
 * Real applications should provide their own notifications UI.
 */
export const NotificationsPanel = forwardRef<NotificationsPanelRef, NotificationsPanelProps>(
  (
    {
      open = false,
      opener,
      onClose,
      onOpen,
      className,
    },
    ref
  ) => {
    const popoverRef = useRef<ResponsivePopoverRef>(null);

    useImperativeHandle(ref, () => ({
      close: () => onClose?.(),
      isOpen: () => open,
    }));

    // Sample notification data for testing
    const sampleNotifications = [
      {
        id: "1",
        titleText: "New comment on your document",
        description: "John Doe commented on 'Q4 Financial Report': Great work on the analysis!",
        state: NotificationListItemState.Information,
        footnotes: ["2 minutes ago"],
        avatar: { initials: "JD", colorScheme: "Accent1" as const },
      },
      {
        id: "2",
        titleText: "Task completed successfully",
        description: "The data export job has finished processing 1,245 records.",
        state: NotificationListItemState.Positive,
        footnotes: ["15 minutes ago"],
        avatar: { initials: "SY", colorScheme: "Accent2" as const },
      },
      {
        id: "3",
        titleText: "Warning: Storage limit approaching",
        description: "Your storage usage is at 85%. Consider archiving old files to free up space.",
        state: NotificationListItemState.Critical,
        footnotes: ["1 hour ago"],
        avatar: { initials: "AD", colorScheme: "Accent3" as const },
      },
      {
        id: "4",
        titleText: "Failed to sync calendar",
        description: "Unable to connect to the calendar service. Please check your network connection and try again.",
        state: NotificationListItemState.Negative,
        footnotes: ["3 hours ago"],
        avatar: { initials: "CA", colorScheme: "Accent4" as const },
      },
      {
        id: "5",
        titleText: "Meeting reminder",
        description: "Team standup meeting starts in 15 minutes. Join the call from the meeting room or remotely.",
        state: NotificationListItemState.Information,
        footnotes: ["Today, 9:45 AM"],
        avatar: { initials: "MT", colorScheme: "Accent5" as const },
      },
    ];

    const headerContent = (
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <span className="text-base font-semibold">Notifications</span>
        <Button
          design="Tertiary"
          className="text-xs"
          onClick={() => {
            // TODO: Implement clear all functionality
          }}
        >
          Clear all
        </Button>
      </div>
    );

    return (
      <ResponsivePopover
        ref={popoverRef}
        opener={opener}
        open={open}
        placement="End"
        verticalAlign="Top"
        offset={16}
        noPadding
        accessibleName="Notifications"
        header={headerContent}
        onOpen={onOpen}
        onClose={onClose}
        showCloseButton
        className={cn("w-96", className)}
      >
        <NotificationList
          accessibleName="Notifications list"
          className="max-h-[400px]"
        >
          {sampleNotifications.map((notification) => (
            <NotificationListItem
              key={notification.id}
              titleText={notification.titleText}
              state={notification.state}
              footnotes={notification.footnotes}
              showClose
              avatar={
                <Avatar
                  size="XS"
                  shape="Circle"
                  initials={notification.avatar.initials}
                  colorScheme={notification.avatar.colorScheme}
                />
              }
            >
              {notification.description}
            </NotificationListItem>
          ))}
        </NotificationList>
      </ResponsivePopover>
    );
  }
);

NotificationsPanel.displayName = "NotificationsPanel";
