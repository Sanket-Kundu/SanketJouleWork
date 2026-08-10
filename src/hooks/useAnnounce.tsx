import { useCallback, useRef, useEffect, useState } from "react";

type AnnounceMode = "polite" | "assertive";

/**
 * Hook for screen reader announcements using aria-live regions
 */
export function useAnnounce() {
  const [announcement, setAnnouncement] = useState<{ message: string; mode: AnnounceMode }>({ message: "", mode: "polite" });
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  /**
   * Announce a message to screen readers
   * @param text The message to announce
   * @param mode "polite" (default) or "assertive"
   */
  const announce = useCallback((text: string, mode: AnnounceMode = "polite") => {
    // Clear any pending message
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set the message (triggers aria-live announcement)
    setAnnouncement({ message: text, mode });

    // Clear after a delay to allow re-announcing the same message
    timeoutRef.current = setTimeout(() => {
      setAnnouncement(prev => ({ ...prev, message: "" }));
    }, 3000);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  /**
   * Props to spread on an invisible live region element
   */
  const liveRegionProps = {
    "aria-live": announcement.mode,
    "aria-atomic": true,
    className: "sr-only",
    children: announcement.message,
  };

  return { announce, message: announcement.message, liveRegionProps };
}

/**
 * Component that renders an invisible live region for announcements
 */
export function LiveRegion({ message, mode = "polite" }: { message: string; mode?: AnnounceMode }) {
  return (
    <div
      aria-live={mode}
      aria-atomic={true}
      className="sr-only"
    >
      {message}
    </div>
  );
}
