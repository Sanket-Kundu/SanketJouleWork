/**
 * Shared utilities for ComboBox and MultiComboBox components.
 *
 * Extracts common CVA variants, filter logic, value state rendering,
 * shared hooks, and action buttons to avoid code duplication.
 */

import React, { useState, useCallback, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { cn, cva } from "../../lib/utils";
import { ComboBoxFilter, ComboBoxSize, ValueState } from "../../types/combobox";
import { valueStateIcons, valueStateMessageColors, valueStateLabelKeys } from "../../lib/value-state-utils";
import { valueStateVariants } from "../select/SelectPopover";
import { useTranslation } from "react-i18next";
import type { I18nStrings } from "../../i18n/types";
import { Button } from "../button";
import { ButtonDesign, ButtonSize } from "../../types/button";
import { DeclineIcon } from "../../icons/Decline";
import { SlimArrowDownIcon } from "../../icons/SlimArrowDown";

/**
 * Value-state-aware input container variants (shared by ComboBox and MultiComboBox).
 *
 * Each consumer passes its own base classes to customize padding/height,
 * then merges with the value state / disabled / readonly variants returned here.
 */
export const valueStateInputVariants = cva(
  [
    "flex items-center w-full border bg-sapphire-background-primary",
    "overflow-clip transition-colors relative",
  ],
  {
    variants: {
      size: {
        [ComboBoxSize.Large]: "rounded-lg",
        [ComboBoxSize.Medium]: "rounded",
      },
      valueState: {
        [ValueState.None]: [
          "border-sapphire-border-active",
          "hover:border-sapphire-border-accent",
          "focus-within:border-sapphire-border-accent",
        ],
        [ValueState.Positive]: [
          "border-sapphire-positive bg-sapphire-positive-bg",
          "hover:bg-sapphire-background-primary",
          "focus-within:border-sapphire-positive focus-within:bg-sapphire-background-primary",
        ],
        [ValueState.Negative]: [
          "border-sapphire-negative bg-sapphire-negative-bg",
          "hover:bg-sapphire-background-primary",
          "focus-within:border-sapphire-negative focus-within:bg-sapphire-background-primary",
        ],
        [ValueState.Critical]: [
          "border-sapphire-warning bg-sapphire-warning-bg",
          "hover:bg-sapphire-background-primary",
          "focus-within:border-sapphire-warning focus-within:bg-sapphire-background-primary",
        ],
        [ValueState.Information]: [
          "border-sapphire-info bg-sapphire-info-bg",
          "hover:bg-sapphire-background-primary",
          "focus-within:border-sapphire-info focus-within:bg-sapphire-background-primary",
        ],
      },
      disabled: {
        true: "opacity-40 cursor-not-allowed pointer-events-none",
        false: "",
      },
      readonly: {
        true: "bg-sapphire-background-secondary border-sapphire-border-primary hover:border-sapphire-border-primary focus-within:!border-sapphire-border-accent",
        false: "",
      },
    },
    defaultVariants: {
      size: ComboBoxSize.Large,
      valueState: ValueState.None,
      disabled: false,
      readonly: false,
    },
  }
);

/**
 * Filter items based on filter mode.
 */
export function filterItems(
  text: string,
  filterValue: string,
  filterMode: ComboBoxFilter | `${ComboBoxFilter}`
): boolean {
  if (!filterValue || filterMode === ComboBoxFilter.None) {
    return true;
  }

  const normalizedText = text.toLowerCase();
  const normalizedFilter = filterValue.toLowerCase();

  switch (filterMode) {
    case ComboBoxFilter.StartsWith:
      return normalizedText.startsWith(normalizedFilter);

    case ComboBoxFilter.Contains:
      return normalizedText.includes(normalizedFilter);

    case ComboBoxFilter.StartsWithPerTerm:
    default:
      if (normalizedText.startsWith(normalizedFilter)) return true;
      const wordBoundaries = [...normalizedText.matchAll(/\s+/g)];
      return wordBoundaries.some((m) =>
        normalizedText.substring(m.index! + m[0].length).startsWith(normalizedFilter)
      );
  }
}

/**
 * Render the value state message — portaled into popover when open, inline when closed.
 */
export function ValueStateMessage({
  isOpen,
  hasValueState,
  portalTarget,
  messageHeight,
  messageRef,
  messageId,
  normalizedValueState,
  valueStateMessage,
}: {
  isOpen: boolean;
  hasValueState: boolean;
  portalTarget: HTMLDivElement | null;
  messageHeight: number;
  messageRef: React.RefObject<HTMLDivElement | null>;
  messageId: string;
  normalizedValueState: ValueState;
  valueStateMessage: React.ReactNode;
}) {
  const { t } = useTranslation("fx");
  const isNegativeState = normalizedValueState === ValueState.Negative;
  const ValueStateIcon = valueStateIcons[normalizedValueState];

  if (isOpen && hasValueState && portalTarget) {
    return (
      <>
        <div style={{ height: messageHeight }} className="mt-2" />
        {createPortal(
          <div
            id={messageId}
            className={cn(
              valueStateVariants({ state: normalizedValueState }),
              "border-b-0 items-start gap-1 px-4 py-1.5 shrink-0 rounded-t-lg"
            )}
          >
            {ValueStateIcon && (
              <ValueStateIcon className="h-4 w-4 shrink-0 mt-0.5" />
            )}
            <span className={cn("text-sm", valueStateMessageColors[normalizedValueState])}>
              {valueStateMessage}
            </span>
          </div>,
          portalTarget
        )}
      </>
    );
  }

  return (
    <div
      ref={messageRef}
      id={messageId}
      role={isNegativeState ? "alert" : undefined}
      aria-live={isNegativeState ? "assertive" : "polite"}
      className={cn(
        "mt-2 text-sm flex items-start gap-1",
        valueStateMessageColors[normalizedValueState]
      )}
    >
      {normalizedValueState !== ValueState.None && valueStateLabelKeys[normalizedValueState] && (
        <span className="sr-only">
          {t(valueStateLabelKeys[normalizedValueState] as keyof I18nStrings)}:{" "}
        </span>
      )}
      {ValueStateIcon && (
        <ValueStateIcon className="h-4 w-4 shrink-0 mt-0.5" />
      )}
      <span>{valueStateMessage}</span>
    </div>
  );
}

/**
 * Clear icon button (shared by ComboBox and MultiComboBox).
 */
export function ClearButton({ onClick, accessibleName = "Clear value", comboBoxSize = ComboBoxSize.Large }: { onClick: () => void; accessibleName?: string; comboBoxSize?: ComboBoxSize | `${ComboBoxSize}` }) {
  const isMedium = comboBoxSize === ComboBoxSize.Medium;
  return (
    <span onMouseDown={(e) => e.preventDefault()}>
      <Button
        design={ButtonDesign.SecondaryNeutral}
        size={isMedium ? ButtonSize.Small : ButtonSize.Medium}
        iconOnly
        icon={<span className={cn("inline-flex items-center justify-center", isMedium ? "h-3 w-3" : "h-4 w-4")}><DeclineIcon className="h-full w-full" /></span>}
        tabIndex={-1}
        onClick={onClick}
        accessibleName={accessibleName}
        className="shrink-0"
      />
    </span>
  );
}

/**
 * Dropdown arrow button (shared by ComboBox and MultiComboBox).
 */
export function DropdownArrowButton({ onClick, disabled = false, comboBoxSize = ComboBoxSize.Large }: { onClick: () => void; disabled?: boolean; comboBoxSize?: ComboBoxSize | `${ComboBoxSize}` }) {
  const isMedium = comboBoxSize === ComboBoxSize.Medium;
  return (
    <span onMouseDown={(e) => e.preventDefault()}>
      <Button
        design={ButtonDesign.SecondaryNeutral}
        size={isMedium ? ButtonSize.Small : ButtonSize.Medium}
        iconOnly
        icon={<span className={cn("inline-flex items-center justify-center", isMedium ? "h-3 w-3" : "h-4 w-4")}><SlimArrowDownIcon className="h-full w-full" /></span>}
        tabIndex={-1}
        onClick={onClick}
        accessibleName="Open suggestions"
        className="shrink-0"
        disabled={disabled}
      />
    </span>
  );
}

// ─── Shared item types ────────────────────────────────────────────

/** A flattened item with its React element and optional group index. */
export interface FlattenedItem<P> {
  element: React.ReactElement<P>;
  groupIndex?: number;
}

/** A flattened item enriched with visibility and original index. */
export interface VisibleItem<P> extends FlattenedItem<P> {
  originalIndex: number;
  isVisible: boolean;
}

/**
 * Compute visible items from a flattened list, applying the filter.
 * Both ComboBox and MultiComboBox use the same shape.
 */
export function computeVisibleItems<P extends { disabled?: boolean }>(
  flattenedItems: FlattenedItem<P>[],
  filterValue: string,
  filter: ComboBoxFilter | `${ComboBoxFilter}`,
  getDisplayText: (element: React.ReactElement<P>) => string,
): VisibleItem<P>[] {
  if (!filterValue || filter === ComboBoxFilter.None) {
    return flattenedItems.map((item, index) => ({ ...item, originalIndex: index, isVisible: true }));
  }

  return flattenedItems.map((item, index) => {
    const displayText = getDisplayText(item.element);
    const isVisible = filterItems(displayText, filterValue, filter);
    return { ...item, originalIndex: index, isVisible };
  });
}

/**
 * Filter navigable (visible + not disabled) items from a visible items list.
 */
export function computeNavigableItems<P extends { disabled?: boolean }>(
  visibleItems: VisibleItem<P>[]
): VisibleItem<P>[] {
  return visibleItems.filter((item) => item.isVisible && !item.element.props.disabled);
}

// ─── Shared hooks ─────────────────────────────────────────────────

/**
 * Hook for screen reader result-count announcements (debounced 300ms).
 * Used identically by ComboBox and MultiComboBox.
 */
export function useResultAnnouncement(filterValue: string, filteredCount: number) {
  const { t } = useTranslation("fx");
  const [resultAnnouncement, setResultAnnouncement] = useState("");

  useEffect(() => {
    if (!filterValue) {
      setResultAnnouncement("");
      return;
    }

    const timer = setTimeout(() => {
      if (filteredCount === 0) {
        setResultAnnouncement(t("COMBOBOX_NO_RESULTS"));
      } else if (filteredCount === 1) {
        setResultAnnouncement(t("COMBOBOX_ONE_RESULT"));
      } else {
        setResultAnnouncement(
          t("COMBOBOX_RESULTS_AVAILABLE", { count: filteredCount })
        );
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [filterValue, filteredCount, t]);

  return { resultAnnouncement, t };
}

/**
 * Hook for measuring the value-state message height (for portal placeholder).
 */
export function useMessageHeight(
  messageRef: React.RefObject<HTMLDivElement | null>,
  valueStateMessage: React.ReactNode,
) {
  const [messageHeight, setMessageHeight] = useState(0);

  useLayoutEffect(() => {
    if (messageRef.current) {
      setMessageHeight(messageRef.current.offsetHeight);
    }
  }, [valueStateMessage]);

  return messageHeight;
}

/**
 * Hook for popover open/close/toggle state management.
 * Returns { openPopover, closePopover, handlePopoverClose, togglePopover }.
 */
export function usePopoverControls({
  disabled,
  readonly,
  controlledOpen,
  isOpen,
  setInternalOpen,
  setFocusedIndex,
  onOpen,
  onClose,
}: {
  disabled: boolean;
  readonly: boolean;
  controlledOpen: boolean | undefined;
  isOpen: boolean;
  setInternalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setFocusedIndex: React.Dispatch<React.SetStateAction<number>>;
  onOpen?: () => void;
  onClose?: () => void;
}) {
  const openPopover = useCallback(() => {
    if (disabled || readonly) return;
    if (controlledOpen === undefined) {
      setInternalOpen(true);
    }
    onOpen?.();
  }, [disabled, readonly, controlledOpen, onOpen, setInternalOpen]);

  const closePopover = useCallback(() => {
    if (controlledOpen === undefined) {
      setInternalOpen(false);
    }
    setFocusedIndex(-1);
  }, [controlledOpen, setInternalOpen, setFocusedIndex]);

  const handlePopoverClose = useCallback(() => {
    if (controlledOpen === undefined) {
      setInternalOpen(false);
    }
    setFocusedIndex(-1);
    onClose?.();
  }, [controlledOpen, onClose, setInternalOpen, setFocusedIndex]);

  const togglePopover = useCallback(() => {
    if (isOpen) {
      closePopover();
    } else {
      openPopover();
    }
  }, [isOpen, openPopover, closePopover]);

  return { openPopover, closePopover, handlePopoverClose, togglePopover };
}
