import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useImperativeHandle,
} from "react";
import { cn } from "../../lib/utils";
import { useTranslation } from "react-i18next";

export interface FxRenameTitleProps {
  /** Ref for imperative access */
  ref?: React.Ref<FxRenameTitleRef>;
  /** The title text */
  text: string;
  /** Whether the title is in edit mode (controlled) */
  editMode?: boolean;
  /** Wrapping type: "Normal" wraps, "None" truncates */
  wrappingType?: "Normal" | "None";
  /** Accept edit handler */
  onEditAccept?: (detail: { value: string; previousValue: string }) => void;
  /** Cancel edit handler */
  onEditCancel?: (detail: { value: string }) => void;
  /** Edit mode change handler */
  onEditModeChange?: (detail: { editMode: boolean }) => void;
  /** Additional className */
  className?: string;
  /**
   * Forwarded to the rendered display span (display mode) or input (edit
   * mode). The same testid applies to whichever element is interactable —
   * tests can stay stable across the mode swap.
   */
  "data-testid"?: string;
}

export interface FxRenameTitleRef {
  /** Programmatically enter edit mode */
  enterEditMode: () => void;
  /** Programmatically exit edit mode (cancels) */
  exitEditMode: () => void;
  /** Get the current edit value */
  getEditValue: () => string;
}

/**
 * FxRenameTitle - Editable title component with animated background
 * Matches the fx-components FxRenameTitle behavior
 */
export function FxRenameTitle({
  text,
  editMode: controlledEditMode,
  wrappingType = "Normal",
  onEditAccept,
  onEditCancel,
  onEditModeChange,
  className,
  ref,
  "data-testid": dataTestId,
}: FxRenameTitleProps) {
    const { t } = useTranslation("fx");
    const inputRef = useRef<HTMLInputElement>(null);
    const isCommittingRef = useRef(false);
    const [internalEditMode, setInternalEditMode] = useState(false);
    const [editValue, setEditValue] = useState(text);
    const [originalValue, setOriginalValue] = useState(text);

    const editMode = controlledEditMode ?? internalEditMode;

    // Sync editValue when text changes externally
    useEffect(() => {
      if (!editMode) {
        setEditValue(text);
      }
    }, [text, editMode]);

    // Focus and select all text when entering edit mode
    useEffect(() => {
      if (editMode && inputRef.current) {
        setTimeout(() => {
          inputRef.current?.focus();
          inputRef.current?.select();
        }, 0);
      }
    }, [editMode]);

    const enterEditMode = useCallback(() => {
      setOriginalValue(text);
      setEditValue(text);
      setInternalEditMode(true);
      onEditModeChange?.({ editMode: true });
    }, [text, onEditModeChange]);

    const exitEditMode = useCallback(() => {
      setInternalEditMode(false);
      onEditModeChange?.({ editMode: false });
    }, [onEditModeChange]);

    const acceptEdit = useCallback(() => {
      const newValue = editValue.trim();
      const previousValue = originalValue;
      exitEditMode();
      onEditAccept?.({ value: newValue, previousValue });
    }, [editValue, originalValue, exitEditMode, onEditAccept]);

    const cancelEdit = useCallback(() => {
      const cancelledValue = editValue;
      exitEditMode();
      onEditCancel?.({ value: cancelledValue });
    }, [editValue, exitEditMode, onEditCancel]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && editValue.trim().length > 0) {
          e.preventDefault();
          isCommittingRef.current = true;
          acceptEdit();
        } else if (e.key === "Escape") {
          e.preventDefault();
          isCommittingRef.current = true;
          cancelEdit();
        }
      },
      [editValue, acceptEdit, cancelEdit]
    );

    // Blur accepts (if valid) or cancels (if empty)
    const handleBlur = useCallback(() => {
      if (isCommittingRef.current) {
        isCommittingRef.current = false;
        return;
      }
      if (editValue.trim().length > 0) {
        acceptEdit();
      } else {
        cancelEdit();
      }
    }, [editValue, acceptEdit, cancelEdit]);

    // Double-click to enter edit mode
    const handleDoubleClick = useCallback(() => {
      if (!editMode) {
        enterEditMode();
      }
    }, [editMode, enterEditMode]);

    useImperativeHandle(ref, () => ({
      enterEditMode,
      exitEditMode,
      getEditValue: () => editValue,
    }));

    return (
      <div
        className={cn(
          "relative inline-flex items-center min-h-9",
          editMode && "w-full max-w-[600px]",
          className
        )}
      >
        {/* Display mode: show text */}
        {!editMode && (
          <span
            className={cn(
              "relative z-10 font-semibold cursor-text flex items-center min-h-9",
              wrappingType === "None" ? "truncate" : "whitespace-pre-line"
            )}
            title={t("FX_DOUBLE_CLICK_TO_RENAME")}
            onDoubleClick={handleDoubleClick}
            data-testid={dataTestId}
          >
            {text}
          </span>
        )}

        {/* Edit mode: bordered input field */}
        {editMode && (
          <div className="flex items-center w-full bg-sapphire-background-primary border-2 border-sapphire-border-accent rounded-md px-3.5 min-h-9">
            <input
              ref={inputRef}
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              className="flex-1 min-w-0 bg-transparent border-none outline-none text-base font-semibold text-sapphire-text-primary selection:bg-sapphire-border-accent selection:text-white"
              data-testid={dataTestId}
            />
          </div>
        )}
      </div>
    );
}
