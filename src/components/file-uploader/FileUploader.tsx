import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
} from "react";
import { cn, cva, subTestId } from "../../lib/utils";
import { useTranslation } from "react-i18next";
import { Token } from "../token/Token";
import { Tokenizer } from "../token/Tokenizer";
import type { TokenizerRef } from "../../types/tokenizer";
import { BrowseFolderIcon } from "../../icons/BrowseFolder";
import { DeclineIcon } from "../../icons/Decline";
import { SysEnter2Icon } from "../../icons/SysEnter2";
import { ErrorIcon } from "../../icons/Error";
import { WarningIcon } from "../../icons/Warning";
import { InformationIcon } from "../../icons/Information";
import { Button } from "../button";
import { ButtonDesign, ButtonSize } from "../../types/button";
import {
  type FileUploaderProps,
  FileUploaderSize,
  ValueState,
} from "../../types/file-uploader";

/**
 * Build a FileList from an array of File objects.
 * Uses DataTransfer when available, otherwise creates a mock FileList.
 */
function buildFileList(files: File[]): FileList {
  if (typeof DataTransfer !== "undefined") {
    const dt = new DataTransfer();
    files.forEach((f) => dt.items.add(f));
    return dt.files;
  }
  // Fallback for environments without DataTransfer (e.g., jsdom in tests)
  const list = Object.create(FileList.prototype);
  files.forEach((f, i) => { list[i] = f; });
  Object.defineProperty(list, "length", { value: files.length });
  list.item = (index: number) => list[index] ?? null;
  list[Symbol.iterator] = function* () {
    for (let i = 0; i < files.length; i++) yield list[i];
  };
  return list as FileList;
}

/**
 * Container variants matching Input.tsx CVA pattern with sapphire-* classes.
 * Covers: Regular, Hover, Pressed/Focus, Disabled states per Figma spec.
 */
const containerVariants = cva(
  [
    "flex items-center w-full border bg-sapphire-canvas-primary",
    "overflow-clip transition-colors relative",
    "pr-1 py-1 gap-1",
    "cursor-pointer outline-none",
  ],
  {
    variants: {
      size: {
        [FileUploaderSize.Large]: [
          "h-10 rounded-lg pl-1",
          "has-[:focus]:border-2 has-[:focus]:pl-[3px] has-[:focus]:pr-[3px] has-[:focus]:py-[3px]",
        ],
        [FileUploaderSize.Medium]: [
          "h-8 rounded pl-0.5",
          "has-[:focus]:border-2 has-[:focus]:pl-px has-[:focus]:pr-[3px] has-[:focus]:py-[3px]",
        ],
      },
      valueState: {
        [ValueState.None]:
          "border-sapphire-border-active hover:border-sapphire-border-accent has-[:focus]:border-sapphire-border-accent",
        [ValueState.Positive]:
          "bg-sapphire-positive-bg hover:bg-sapphire-canvas-primary has-[:focus]:bg-sapphire-canvas-primary border-sapphire-positive has-[:focus]:border-sapphire-positive",
        [ValueState.Negative]:
          "bg-sapphire-negative-bg hover:bg-sapphire-canvas-primary has-[:focus]:bg-sapphire-canvas-primary border-sapphire-negative has-[:focus]:border-sapphire-negative",
        [ValueState.Critical]:
          "bg-sapphire-warning-bg hover:bg-sapphire-canvas-primary has-[:focus]:bg-sapphire-canvas-primary border-sapphire-warning has-[:focus]:border-sapphire-warning",
        [ValueState.Information]:
          "bg-sapphire-info-bg hover:bg-sapphire-canvas-primary has-[:focus]:bg-sapphire-canvas-primary border-sapphire-info has-[:focus]:border-sapphire-info",
      },
      disabled: {
        true: "opacity-40 cursor-not-allowed pointer-events-none",
        false: "",
      },
      dragOver: {
        true: "border-sapphire-border-accent border-2 pl-[3px] pr-[3px] py-[3px]",
        false: "",
      },
    },
    defaultVariants: {
      size: FileUploaderSize.Large,
      valueState: ValueState.None,
      disabled: false,
      dragOver: false,
    },
  }
);

/**
 * Value state icon mapping (same as Input.tsx)
 */
const valueStateIcons: Record<ValueState, React.ElementType | null> = {
  [ValueState.None]: null,
  [ValueState.Positive]: SysEnter2Icon,
  [ValueState.Negative]: ErrorIcon,
  [ValueState.Critical]: WarningIcon,
  [ValueState.Information]: InformationIcon,
};

/**
 * Value state message color mapping
 */
const valueStateMessageColors: Record<ValueState, string> = {
  [ValueState.None]: "",
  [ValueState.Positive]: "text-sapphire-positive",
  [ValueState.Negative]: "text-sapphire-negative",
  [ValueState.Critical]: "text-sapphire-warning",
  [ValueState.Information]: "text-sapphire-info",
};

/**
 * FileUploader component
 *
 * A file upload control that allows users to select files via browse dialog
 * or drag-and-drop. Supports single/multiple files, file type filtering,
 * file size validation, and value state feedback.
 *
 * @example
 * ```tsx
 * <FileUploader
 *   accept=".pdf,.doc"
 *   multiple
 *   maxFileSize={5}
 *   onChange={({ files }) => console.log(files)}
 * />
 * ```
 */
function FileUploaderBase({
  size = FileUploaderSize.Large,
  accept,
  multiple = false,
  maxFileSize,
  hideInput = false,
  placeholder,
  value,
  disabled = false,
  required = false,
  valueState = ValueState.None,
  valueStateMessage,
  name,
  accessibleName,
  accessibleNameRef,
  accessibleDescription,
  accessibleDescriptionRef,
  onChange,
  onFileSizeExceed,
  children,
  className,
  style,
  id,
  "data-testid": dataTestId,
  ref,
}: FileUploaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const tokenizerRef = useRef<TokenizerRef>(null);
  const dragCounterRef = useRef(0);
  const fileNamesRef = useRef<string[]>([]);
  const clearedRef = useRef(false);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const { t } = useTranslation("fx");

  const descriptionId = useId();
  const hasInlineDescription = !!accessibleDescription && !accessibleDescriptionRef;
  const resolvedDescribedBy = accessibleDescriptionRef
    ?? (hasInlineDescription ? descriptionId : undefined);

  const resolvedValueState = valueState as ValueState;
  const isNegativeState = resolvedValueState === ValueState.Negative;
  const isMedium = size === FileUploaderSize.Medium;

  // Reset cleared flag when the value prop changes externally
  useEffect(() => {
    clearedRef.current = false;
  }, [value]);

  // Resolve placeholder based on multiple prop
  const resolvedPlaceholder = placeholder ?? (
    multiple
      ? t("FILEUPLOADER_PLACEHOLDER_MULTIPLE")
      : t("FILEUPLOADER_PLACEHOLDER")
  );

  // Derive display names from value prop or internal state
  const displayNames = useMemo(() => {
    if (value !== undefined && value !== "" && !clearedRef.current) {
      return value.split(",").map((n) => n.trim()).filter(Boolean);
    }
    return fileNames;
  }, [value, fileNames]);

  const hasFiles = displayNames.length > 0;

  // Validate files against maxFileSize
  const validateFiles = useCallback(
    (files: FileList): FileList | null => {
      if (maxFileSize === undefined || maxFileSize <= 0) return files;

      const exceededFiles: Array<{ fileName: string; fileSize: number }> = [];
      const validFiles: File[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileSizeMB = file.size / 1024 / 1024;
        if (fileSizeMB > maxFileSize) {
          exceededFiles.push({ fileName: file.name, fileSize: fileSizeMB });
        } else {
          validFiles.push(file);
        }
      }

      if (exceededFiles.length > 0) {
        onFileSizeExceed?.({ filesData: exceededFiles });
      }

      if (validFiles.length === 0 && exceededFiles.length > 0) {
        return null;
      }

      return buildFileList(validFiles);
    },
    [maxFileSize, onFileSizeExceed]
  );

  // Filter files by accept prop (needed for drag-and-drop; native input handles dialog)
  const filterByAccept = useCallback(
    (files: FileList): FileList => {
      if (!accept) return files;

      const acceptTypes = accept.split(",").map((t) => t.trim().toLowerCase());
      const matched: File[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const parts = file.name.split(".");
        const fileExt = parts.length > 1 ? "." + parts.pop()?.toLowerCase() : "";
        const fileMime = file.type.toLowerCase();

        const matches = acceptTypes.some((type) => {
          if (type.startsWith(".")) {
            return fileExt === type;
          }
          if (type.endsWith("/*")) {
            return fileMime.startsWith(type.slice(0, -1));
          }
          return fileMime === type;
        });

        if (matches) {
          matched.push(file);
        }
      }

      return buildFileList(matched);
    },
    [accept]
  );

  // Open the native file browser
  const openFileBrowser = useCallback(() => {
    if (disabled) return;
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    fileInputRef.current?.click();
  }, [disabled]);

  // Clear all selected files
  const clearFiles = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    fileNamesRef.current = [];
    clearedRef.current = true;
    setFileNames([]);
    onChange?.({ files: null });
  }, [onChange]);

  // Handle native input change
  const handleNativeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) {
        // Chrome fires change on cancel — only clear if we had files
        if (fileNamesRef.current.length > 0) {
          clearFiles();
        }
        return;
      }

      const validFiles = validateFiles(files);
      if (!validFiles || validFiles.length === 0) {
        return;
      }

      const names = Array.from(validFiles).map((f) => f.name);
      fileNamesRef.current = names;
      setFileNames(names);
      onChange?.({ files: validFiles });
    },
    [validateFiles, clearFiles, onChange]
  );

  // Handle container click — only open file browser when clicking the
  // container itself or the placeholder, not when clicking buttons or the Tokenizer.
  const handleContainerClick = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      if (tokenizerRef.current?.nativeElement?.contains(target)) {
        return;
      }
      if (target.closest?.('[data-part="clear"], [data-part="browse"]')) {
        return;
      }
      openFileBrowser();
    },
    [openFileBrowser]
  );

  // Handle keyboard (keydown — prevent defaults)
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;
      // Only handle keys when the native input is focused, not when
      // events bubble up from the Tokenizer or its tokens.
      if (e.target !== fileInputRef.current) return;

      switch (e.key) {
        case "Enter":
          e.preventDefault();
          openFileBrowser();
          break;
        case " ":
          e.preventDefault();
          break;
        case "F4":
          e.preventDefault();
          break;
        case "Delete":
          e.preventDefault();
          if (hasFiles) {
            clearFiles();
          }
          break;
        case "ArrowRight":
          if (hasFiles && isFocused) {
            e.preventDefault();
            tokenizerRef.current?.focus();
          }
          break;
      }

      // Alt+Up / Alt+Down — prevent default
      if (e.altKey && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
        e.preventDefault();
      }
    },
    [disabled, openFileBrowser, hasFiles, clearFiles, isFocused]
  );

  // Handle keyboard (keyup — trigger actions matching UI5 pattern)
  const handleKeyUp = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;
      if (e.target !== fileInputRef.current) return;

      if (e.key === " " || e.key === "F4") {
        openFileBrowser();
      }

      if (e.altKey && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
        openFileBrowser();
      }
    },
    [disabled, openFileBrowser]
  );

  // Drag and drop handlers
  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      if (disabled) return;
      e.preventDefault();
      e.stopPropagation();
    },
    [disabled]
  );

  const handleDragEnter = useCallback(
    (e: React.DragEvent) => {
      if (disabled) return;
      e.preventDefault();
      e.stopPropagation();
      dragCounterRef.current++;
      setIsDragOver(true);
    },
    [disabled]
  );

  const handleDragLeave = useCallback(
    (e: React.DragEvent) => {
      if (disabled) return;
      e.preventDefault();
      e.stopPropagation();
      dragCounterRef.current--;
      if (dragCounterRef.current <= 0) {
        dragCounterRef.current = 0;
        setIsDragOver(false);
      }
    },
    [disabled]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      if (disabled) return;
      e.preventDefault();
      e.stopPropagation();
      dragCounterRef.current = 0;
      setIsDragOver(false);

      let droppedFiles = e.dataTransfer.files;
      if (!droppedFiles || droppedFiles.length === 0) return;

      // If not multiple, take only the first file
      if (!multiple && droppedFiles.length > 1) {
        droppedFiles = buildFileList([droppedFiles[0]]);
      }

      // Filter by accept types (native input doesn't restrict drag-and-drop)
      droppedFiles = filterByAccept(droppedFiles);
      if (droppedFiles.length === 0) return;

      // Validate file sizes
      const validFiles = validateFiles(droppedFiles);
      if (!validFiles || validFiles.length === 0) return;

      const names = Array.from(validFiles).map((f) => f.name);
      fileNamesRef.current = names;
      setFileNames(names);
      onChange?.({ files: validFiles });
    },
    [disabled, multiple, filterByAccept, validateFiles, onChange]
  );

  // Handle clear button click
  const handleClearClick = useCallback(
    (detail: { originalEvent: React.SyntheticEvent; isKeyboard: boolean }) => {
      detail.originalEvent.stopPropagation();
      clearFiles();
    },
    [clearFiles]
  );

  // Handle browse button click
  const handleBrowseClick = useCallback(
    (detail: { originalEvent: React.SyntheticEvent; isKeyboard: boolean }) => {
      detail.originalEvent.stopPropagation();
      openFileBrowser();
    },
    [openFileBrowser]
  );

  // Mousedown on the container — prevent default (no text selection) and focus the native input
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (disabled) return;
      e.preventDefault();
      fileInputRef.current?.focus();
    },
    [disabled]
  );

  // Native input click — stop propagation to prevent double-triggering with container click
  const handleNativeInputClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
    },
    []
  );

  // Imperative API
  useImperativeHandle(
    ref,
    () => ({
      focus() {
        fileInputRef.current?.focus();
      },
      blur() {
        fileInputRef.current?.blur();
      },
      openFileBrowser() {
        openFileBrowser();
      },
      clear() {
        clearFiles();
      },
      get files() {
        return fileInputRef.current?.files ?? null;
      },
      get nativeInput() {
        return fileInputRef.current;
      },
    }),
    [openFileBrowser, clearFiles]
  );

  // Value state icon
  const ValueStateIcon = valueStateIcons[resolvedValueState];

  const sharedInputProps = {
    ref: fileInputRef,
    type: "file" as const,
    accept,
    multiple,
    name,
    required,
    disabled,
    onChange: handleNativeChange,
    "data-testid": dataTestId ? `${dataTestId}-input` : undefined,
  };

  return (
    <div
      className={cn("w-full", className)}
      style={style}
      id={id}
      data-testid={dataTestId}
    >
      {hasInlineDescription && (
        <span id={descriptionId} className="sr-only">{accessibleDescription}</span>
      )}
      {hideInput ? (
        /* Button-only mode: hidden input + children as trigger */
        <>
          <input
            {...sharedInputProps}
            tabIndex={-1}
            aria-hidden="true"
            className="hidden"
          />
          <span onClick={disabled ? undefined : openFileBrowser}>
            {children}
          </span>
        </>
      ) : (
        /* Standard mode: styled container with native input as focus target */
        <div
          ref={containerRef}
          data-testid={dataTestId ? `${dataTestId}-container` : undefined}
          className={cn(
            containerVariants({
              size: size as FileUploaderSize,
              valueState: resolvedValueState,
              disabled,
              dragOver: isDragOver,
            })
          )}
          onClick={handleContainerClick}
          onMouseDown={handleMouseDown}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            {...sharedInputProps}
            tabIndex={disabled ? -1 : 0}
            aria-roledescription={t("FILEUPLOADER_ROLE_DESCRIPTION")}
            aria-label={accessibleName}
            aria-labelledby={accessibleNameRef}
            aria-describedby={resolvedDescribedBy}
            aria-required={required || undefined}
            aria-invalid={isNegativeState || undefined}
            aria-haspopup="dialog"
            className="absolute inset-0 opacity-0 w-full h-full pointer-events-none outline-none"
            onClick={handleNativeInputClick}
            onFocus={() => setIsFocused(true)}
            onBlur={(e) => {
              if (!containerRef.current?.contains(e.relatedTarget as Node)) {
                setIsFocused(false);
              }
            }}
          />

          {/* Content area: placeholder or file tokens */}
          <div
            className="flex-1 min-w-0 flex items-center gap-1 overflow-hidden"
          >
            {hasFiles ? (
              <Tokenizer
                ref={tokenizerRef}
                readonly
                accessibleName={t("FILEUPLOADER_SELECTED_FILES")}
                className="flex-1 min-w-0 h-full"
              >
                {displayNames.map((fileName, idx) => (
                  <Token key={`${fileName}-${idx}`} text={fileName} />
                ))}
              </Tokenizer>
            ) : (
              <span className="text-sapphire-text-tertiary italic text-sm truncate select-none pl-2.5">
                {resolvedPlaceholder}
              </span>
            )}
          </div>

          {/* Clear button — visible when files are present */}
          {hasFiles && !disabled && (
            <span onMouseDown={(e) => e.preventDefault()}>
              <Button
                design={ButtonDesign.SecondaryNeutral}
                size={isMedium ? ButtonSize.Small : ButtonSize.Medium}
                iconOnly
                icon={<span className={cn("inline-flex items-center justify-center", isMedium ? "h-3 w-3" : "h-4 w-4")}><DeclineIcon className="h-full w-full" /></span>}
                tabIndex={-1}
                onClick={handleClearClick}
                accessibleName={t("FILEUPLOADER_CLEAR_TOOLTIP")}
                className="shrink-0"
                data-part="clear"
                data-testid={subTestId(dataTestId, "clear")}
              />
            </span>
          )}

          {/* Browse button — always visible */}
          <span onMouseDown={(e) => e.preventDefault()}>
            <Button
              design={ButtonDesign.SecondaryNeutral}
              size={isMedium ? ButtonSize.Small : ButtonSize.Medium}
              iconOnly
              icon={<span className={cn("inline-flex items-center justify-center", isMedium ? "h-3 w-3" : "h-4 w-4")}><BrowseFolderIcon className="h-full w-full" /></span>}
              tabIndex={-1}
              onClick={handleBrowseClick}
              accessibleName={t("FILEUPLOADER_BROWSE_TOOLTIP")}
              className="shrink-0"
              data-part="browse"
              data-testid={subTestId(dataTestId, "browse")}
            />
          </span>
        </div>
      )}

      {/* Value state message */}
      {valueStateMessage && resolvedValueState !== ValueState.None && (
        <div
          role={isNegativeState ? "alert" : undefined}
          aria-live={isNegativeState ? "assertive" : "polite"}
          className={cn(
            "mt-1 text-xs flex items-start gap-1",
            valueStateMessageColors[resolvedValueState]
          )}
        >
          {ValueStateIcon && <ValueStateIcon className="h-3 w-3 mt-0.5 shrink-0" />}
          <span>{valueStateMessage}</span>
        </div>
      )}
    </div>
  );
}

export const FileUploader = React.memo(FileUploaderBase);
FileUploader.displayName = "FileUploader";
