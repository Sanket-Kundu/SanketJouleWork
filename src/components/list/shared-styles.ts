/**
 * Shared base styles for list items and group headers
 * Ensures consistent layout, sizing, and focus ring appearance
 */

export const LIST_ITEM_BASE_CLASSES = [
  "relative",
  "flex",
  "items-center",
  "w-full",
  "min-h-[2.25rem]",
  "transition-colors",
  "outline-none",
] as const;

export const LIST_ITEM_FOCUS_CLASSES = "ring-2 ring-inset ring-sapphire-border-focus z-10";
