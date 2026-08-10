import React, { ReactNode } from "react";
import { ValueState } from "./value-state";

// Re-export ValueState for consumer convenience
export { ValueState };

/**
 * FileUploader size variants
 */
export enum FileUploaderSize {
  /** Large file uploader (Figma: Large — 40px height, 8px radius) */
  Large = "Large",
  /** Medium file uploader (Figma: Medium — 32px height, 4px radius) */
  Medium = "Medium",
}

/**
 * Event detail for file selection changes
 */
export interface FileUploaderChangeDetail {
  /** The currently selected files, or null when cleared */
  files: FileList | null;
}

/**
 * Event detail when files exceed the maxFileSize limit
 */
export interface FileUploaderFileSizeExceedDetail {
  /** Array of file data for files that exceeded the size limit */
  filesData: Array<{
    /** Name of the file */
    fileName: string;
    /** Size of the file in megabytes */
    fileSize: number;
  }>;
}

/**
 * FileUploader ref methods for imperative control
 */
export interface FileUploaderRef {
  /** Focus the file uploader container */
  focus(): void;
  /** Blur the file uploader */
  blur(): void;
  /** Programmatically open the native file browser dialog */
  openFileBrowser(): void;
  /** Clear all selected files */
  clear(): void;
  /** Get the current FileList (read-only) */
  readonly files: FileList | null;
  /** Access the native file input element */
  readonly nativeInput: HTMLInputElement | null;
}

/**
 * Props for the FileUploader component
 */
export interface FileUploaderProps {
  /** Ref for imperative access */
  ref?: React.Ref<FileUploaderRef>;

  // === Size ===
  /** Size variant (default: Large / 40px) */
  size?: FileUploaderSize | `${FileUploaderSize}`;

  // === File Selection ===
  /** Comma-separated list of allowed file types (e.g., ".pdf,.doc,image/*") */
  accept?: string;
  /** Allow multiple file selection */
  multiple?: boolean;
  /** Maximum file size in megabytes. Files exceeding this trigger onFileSizeExceed */
  maxFileSize?: number;

  // === Display ===
  /** Hide the input field, showing only children (button-only mode) */
  hideInput?: boolean;
  /** Placeholder text when no files are selected */
  placeholder?: string;
  /** Displayed value (comma-separated file names). Read-only display string */
  value?: string;

  // === State ===
  /** Whether the file uploader is disabled */
  disabled?: boolean;
  /** Whether a file is required (for form validation) */
  required?: boolean;
  /** Value state for validation feedback */
  valueState?: ValueState | `${ValueState}`;
  /** Custom value state message displayed below the component */
  valueStateMessage?: ReactNode;

  // === Form Integration ===
  /** Form field name for the hidden file input */
  name?: string;

  // === Accessibility ===
  /** Accessible name (aria-label) */
  accessibleName?: string;
  /** ID of labelling element (aria-labelledby) */
  accessibleNameRef?: string;
  /** Accessible description (aria-description) */
  accessibleDescription?: string;
  /** ID of describing element (aria-describedby) */
  accessibleDescriptionRef?: string;

  // === Events ===
  /** Called when file selection changes (user selects, drops, or clears files) */
  onChange?: (detail: FileUploaderChangeDetail) => void;
  /** Called when at least one file exceeds maxFileSize. Oversized files are rejected */
  onFileSizeExceed?: (detail: FileUploaderFileSizeExceedDetail) => void;

  // === Children (for hideInput mode) ===
  /** Custom trigger element(s), used with hideInput to create button-only file uploaders */
  children?: ReactNode;

  // === Standard HTML ===
  /** Additional class names */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Element ID */
  id?: string;
  /** Data attribute for testing */
  "data-testid"?: string;
}
