import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useImperativeHandle,
  useId,
} from "react";
import { cn } from "../../lib/utils";
import {
  RadioButtonProps,
  RadioButtonSize,
  RadioButtonWrappingType,
  RadioButtonValueState,
} from "../../types/radiobutton";
import { useTranslation } from "react-i18next";
import type { I18nStrings } from "../../i18n/types";

type ValueState = RadioButtonValueState | `${RadioButtonValueState}`;

type RadioGroupEntry = {
  id: string;
  getNode: () => HTMLDivElement | null;
  isDisabled: () => boolean;
  isReadonly: () => boolean;
  isChecked: () => boolean;
  setChecked: (checked: boolean) => void;
  focus: () => void;
  select: (originalEvent?: React.SyntheticEvent) => void;
  setTabIndex: (value: number) => void;
};

const radioGroups = new Map<string, RadioGroupEntry[]>();

function getOrderedGroupEntries(name: string): RadioGroupEntry[] {
  const entries = radioGroups.get(name) ?? [];
  const connectedEntries = entries.filter((entry) => entry.getNode()?.isConnected);

  if (connectedEntries.length !== entries.length) {
    if (connectedEntries.length === 0) {
      radioGroups.delete(name);
    } else {
      radioGroups.set(name, connectedEntries);
    }
  }

  return [...connectedEntries].sort((entryA, entryB) => {
    const nodeA = entryA.getNode();
    const nodeB = entryB.getNode();

    if (!nodeA || !nodeB || nodeA === nodeB) {
      return 0;
    }

    const position = nodeA.compareDocumentPosition(nodeB);

    if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
      return -1;
    }

    if (position & Node.DOCUMENT_POSITION_PRECEDING) {
      return 1;
    }

    return 0;
  });
}

function updateGroupTabIndex(name: string) {
  const entries = getOrderedGroupEntries(name);

  if (entries.length === 0) {
    return;
  }

  const focusableEntries = entries.filter((entry) => !entry.isDisabled());
  const activeEntry = focusableEntries.find((entry) => entry.isChecked()) ?? focusableEntries[0] ?? null;

  entries.forEach((entry) => {
    entry.setTabIndex(!entry.isDisabled() && entry === activeEntry ? 0 : -1);
  });
}

function registerGroupEntry(name: string, entry: RadioGroupEntry) {
  const existingEntries = radioGroups.get(name) ?? [];
  const nextEntries = existingEntries.filter((existingEntry) => existingEntry.id !== entry.id);

  nextEntries.push(entry);
  radioGroups.set(name, nextEntries);
  updateGroupTabIndex(name);
}

function unregisterGroupEntry(name: string, id: string) {
  const existingEntries = radioGroups.get(name);

  if (!existingEntries) {
    return;
  }

  const nextEntries = existingEntries.filter((entry) => entry.id !== id);

  if (nextEntries.length === 0) {
    radioGroups.delete(name);
    return;
  }

  radioGroups.set(name, nextEntries);
  updateGroupTabIndex(name);
}

function getAdjacentGroupEntry(name: string, currentId: string, direction: 1 | -1) {
  const focusableEntries = getOrderedGroupEntries(name).filter((entry) => !entry.isDisabled());

  if (focusableEntries.length <= 1) {
    return null;
  }

  const currentIndex = focusableEntries.findIndex((entry) => entry.id === currentId);
  const baseIndex = currentIndex >= 0 ? currentIndex : 0;
  const nextIndex = (baseIndex + direction + focusableEntries.length) % focusableEntries.length;

  return focusableEntries[nextIndex] ?? null;
}

function moveSelectionInGroup(
  name: string,
  currentId: string,
  direction: 1 | -1,
  originalEvent?: React.SyntheticEvent
) {
  const nextEntry = getAdjacentGroupEntry(name, currentId, direction);

  if (!nextEntry) {
    return;
  }

  nextEntry.focus();

  if (!nextEntry.isReadonly()) {
    nextEntry.select(originalEvent);
    return;
  }

  updateGroupTabIndex(name);
}

function uncheckOthersInGroup(groupName: string, currentId: string) {
  getOrderedGroupEntries(groupName).forEach((entry) => {
    if (entry.id !== currentId && entry.isChecked()) {
      entry.setChecked(false);
    }
  });
}

function getKeyNavigationDirection(key: string): 1 | -1 | "select" | null {
  if (key === " " || key === "Enter") return "select";

  const isRTL = document.documentElement.dir === "rtl";

  if (
    key === "ArrowDown" || key === "Down"
    || (key === "ArrowRight" && !isRTL) || (key === "Right" && !isRTL)
    || (key === "ArrowLeft" && isRTL) || (key === "Left" && isRTL)
  ) {
    return 1;
  }

  if (
    key === "ArrowUp" || key === "Up"
    || (key === "ArrowLeft" && !isRTL) || (key === "Left" && !isRTL)
    || (key === "ArrowRight" && isRTL) || (key === "Right" && isRTL)
  ) {
    return -1;
  }

  return null;
}

function getEffectiveTabIndex(
  disabled: boolean,
  tabIndex: number | undefined,
  groupName: string | undefined,
  groupTabIndex: number | null
): number {
  if (disabled) return -1;
  if (tabIndex !== undefined) return tabIndex;
  if (groupName) return groupTabIndex ?? 0;
  return 0;
}

function getValueStateBorderClass(valueState: ValueState): string {
  const borderMap: Record<string, string> = {
    [RadioButtonValueState.Positive]: "border-sapphire-positive",
    [RadioButtonValueState.Negative]: "border-sapphire-negative",
    [RadioButtonValueState.Critical]: "border-sapphire-warning",
    [RadioButtonValueState.Information]: "border-sapphire-info",
  };
  return borderMap[valueState] ?? "";
}

function getValueStateCheckedBorderClass(valueState: ValueState): string {
  const checkedBorderMap: Record<string, string> = {
    [RadioButtonValueState.Positive]: "border-sapphire-positive",
    [RadioButtonValueState.Negative]: "border-sapphire-negative",
    [RadioButtonValueState.Critical]: "border-sapphire-warning",
    [RadioButtonValueState.Information]: "border-sapphire-info",
  };
  return checkedBorderMap[valueState] ?? "border-sapphire-border-secondary";
}

function getInnerDotColorClass(valueState: ValueState): string {
  const dotMap: Record<string, string> = {
    [RadioButtonValueState.Positive]: "bg-sapphire-positive",
    [RadioButtonValueState.Negative]: "bg-sapphire-negative",
    [RadioButtonValueState.Critical]: "bg-sapphire-warning",
    [RadioButtonValueState.Information]: "bg-sapphire-info",
  };
  return dotMap[valueState] ?? "bg-sapphire-text-accent";
}

function getSizeClasses(isSmall: boolean, hasLabel: boolean): string {
  if (isSmall) {
    return hasLabel ? "min-h-8 py-1.5 ps-1 pe-1 gap-2" : "size-8 p-2";
  }
  return hasLabel ? "min-h-[44px] py-[11px] ps-1 pe-2 gap-[11px]" : "size-[44px] p-[11px]";
}

function getFocusRingClasses(hasLabel: boolean, isSmall: boolean): string {
  if (!hasLabel) return "after:inset-[5px] after:rounded-lg";
  if (isSmall) return "after:inset-x-0 after:inset-y-0";
  return "after:left-0 after:right-[2px] after:inset-y-[5px]";
}

const valueStateI18nKeys: Record<string, keyof I18nStrings | undefined> = {
  [RadioButtonValueState.Negative]: "RADIOBUTTON_VALUE_STATE_ERROR",
  [RadioButtonValueState.Critical]: "RADIOBUTTON_VALUE_STATE_WARNING",
  [RadioButtonValueState.Positive]: "RADIOBUTTON_VALUE_STATE_SUCCESS",
  [RadioButtonValueState.Information]: "RADIOBUTTON_VALUE_STATE_INFORMATION",
};

function RadioCircle({
  isReadonly,
  isSmall,
  isChecked,
  hasWrappingLabel,
  isInteractive,
  valueState,
  svgR,
}: {
  isReadonly: boolean;
  isSmall: boolean;
  isChecked: boolean;
  hasWrappingLabel: boolean;
  isInteractive: boolean;
  valueState: ValueState;
  svgR: number;
}) {
  if (isReadonly) {
    return (
      <span
        className={cn(
          "relative inline-flex items-center justify-center shrink-0",
          isSmall ? "size-4" : "size-[22px]",
          hasWrappingLabel && "self-start",
          isSmall && hasWrappingLabel && "mt-0.5",
        )}
      >
        <svg
          className="absolute inset-0 w-full h-full overflow-visible"
          focusable="false"
          aria-hidden="true"
        >
          <circle
            cx="50%"
            cy="50%"
            r={svgR}
            fill="var(--background-secondary)"
            stroke="var(--border-secondary)"
            strokeWidth="1"
            strokeDasharray="4, 2"
          />
        </svg>
        {isChecked && (
          <span
            className={cn(
              "relative rounded-full",
              isSmall ? "size-2" : "size-3",
              "bg-sapphire-text-secondary",
            )}
          />
        )}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "relative inline-flex items-center justify-center shrink-0 rounded-full",
        isSmall ? "size-4" : "size-[22px]",
        hasWrappingLabel && "self-start",
        isSmall && hasWrappingLabel && "mt-0.5",
        "transition-colors",
        "border border-solid",
        !isChecked && "bg-sapphire-canvas-primary border-sapphire-border-secondary",
        isChecked && getValueStateCheckedBorderClass(valueState),
        isChecked && "bg-sapphire-canvas-primary",
        !isChecked && getValueStateBorderClass(valueState),
        isInteractive && valueState === RadioButtonValueState.None && !isChecked &&
          "group-hover:border-sapphire-chrome-button-fg-selected group-hover:bg-sapphire-chrome-button-bg-selected",
        isInteractive && valueState === RadioButtonValueState.None && isChecked &&
          "group-hover:border-sapphire-border-accent group-hover:bg-sapphire-chrome-button-bg-selected",
      )}
    >
      {isChecked && (
        <span
          className={cn(
            "rounded-full",
            isSmall ? "size-2" : "size-3",
            getInnerDotColorClass(valueState),
          )}
        />
      )}
    </span>
  );
}

/**
 * RadioButton component
 *
 * A native React implementation of the UI5 RadioButton component.
 * Used for selecting one option from a group of mutually exclusive options.
 */
export function RadioButton({
  checked: controlledChecked,
  defaultChecked = false,
  disabled = false,
  readonly = false,
  required = false,
  size = RadioButtonSize.Large,
  text,
  children,
  valueState = RadioButtonValueState.None,
  valueStateMessage,
  name,
  value = "",
  wrappingType = RadioButtonWrappingType.Normal,
  accessibleName,
  accessibleNameRef,
  accessibleDescription,
  accessibleDescriptionRef,
  onChange,
  onFocus,
  onBlur,
  className,
  style,
  id: providedId,
  "data-testid": dataTestId,
  tabIndex,
  ref,
}: RadioButtonProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const rootRef = useRef<HTMLDivElement>(null);
    const generatedId = useId();
    const id = providedId || generatedId;
    const descriptionId = `${id}-description`;

    // Controlled vs uncontrolled state
    const [internalChecked, setInternalChecked] = useState(defaultChecked);
    const [groupTabIndex, setGroupTabIndex] = useState<number | null>(null);
    const isControlled = controlledChecked !== undefined;
    const isChecked = isControlled ? controlledChecked : internalChecked;

    const setChecked = useCallback(
      (checked: boolean) => {
        if (!isControlled) {
          setInternalChecked(checked);
        }
      },
      [isControlled]
    );

    const doSelect = useCallback(
      (originalEvent?: React.SyntheticEvent) => {
        if (disabled || readonly || isChecked) return;

        if (name) {
          uncheckOthersInGroup(name, id);
        }

        if (!isControlled) {
          setInternalChecked(true);
        }

        onChange?.({
          checked: true,
          value,
          originalEvent: originalEvent as React.SyntheticEvent,
        });
      },
      [disabled, readonly, isChecked, isControlled, name, id, onChange, value]
    );

    useEffect(() => {
      if (!name) {
        setGroupTabIndex(null);
        return;
      }

      const entry: RadioGroupEntry = {
        id,
        getNode: () => rootRef.current,
        isDisabled: () => disabled,
        isReadonly: () => readonly,
        isChecked: () => isChecked,
        setChecked,
        focus: () => rootRef.current?.focus(),
        select: doSelect,
        setTabIndex: setGroupTabIndex,
      };

      registerGroupEntry(name, entry);

      return () => {
        unregisterGroupEntry(name, id);
      };
    }, [name, id, disabled, readonly, isChecked, setChecked, doSelect]);

    useEffect(() => {
      if (!name) {
        return;
      }

      updateGroupTabIndex(name);
    }, [name, isChecked, disabled]);

    // Expose imperative methods
    useImperativeHandle(
      ref,
      () => ({
        focus() {
          rootRef.current?.focus();
        },
        blur() {
          rootRef.current?.blur();
        },
        isFocused() {
          return document.activeElement === rootRef.current;
        },
        isChecked() {
          return isChecked;
        },
        get nativeElement() {
          return inputRef.current;
        },
      }),
      [isChecked]
    );

    // Handle click on the root div
    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (disabled || readonly) {
          e.preventDefault();
          return;
        }
        doSelect(e);
      },
      [disabled, readonly, doSelect]
    );

    // Prevent disabled radio from gaining focus on mousedown
    const handleMouseDown = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (disabled) {
          e.preventDefault();
        }
      },
      [disabled]
    );

    // Handle keyboard - Space and Enter select, Arrow keys navigate group
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (disabled || readonly) return;

        const direction = getKeyNavigationDirection(e.key);

        if (name && (direction === 1 || direction === -1)) {
          e.preventDefault();
          moveSelectionInGroup(name, id, direction, e);
          return;
        }

        if (direction === "select") {
          e.preventDefault();
        }
      },
      [disabled, readonly, name, id]
    );

    const handleKeyUp = useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (disabled || readonly) return;

        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          doSelect(e);
        }
      },
      [disabled, readonly, doSelect]
    );

    // Label content
    const labelContent = children ?? text;
    const isSmall = size === RadioButtonSize.Small;
    const isInteractive = !disabled && !readonly;
    const hasWrappingLabel = wrappingType !== RadioButtonWrappingType.None && !!labelContent;
    const effectiveTabIndex = getEffectiveTabIndex(disabled, tabIndex, name, groupTabIndex);

    const { t } = useTranslation("fx");
    const valueStateI18nKey = valueStateI18nKeys[valueState];
    const defaultValueStateText = valueStateI18nKey ? t(valueStateI18nKey) : undefined;

    // SVG readonly circle radius (inset by 0.5px for stroke)
    const svgR = isSmall ? 7.5 : 10.5;

    return (
      <div className="relative inline-block max-w-full align-top">
        {/* Hidden native input for form submission */}
        <input
          ref={inputRef}
          type="radio"
          id={id}
          name={name}
          value={value}
          checked={isChecked}
          disabled={disabled}
          readOnly={readonly}
          required={required}
          tabIndex={-1}
          aria-hidden="true"
          onChange={() => {/* controlled by root div */}}
          className="absolute size-0 opacity-0 pointer-events-none"
        />

        {/* Root element receives focus, like ui5-radio-button */}
        <div
          ref={rootRef}
          role="radio"
          aria-checked={isChecked}
          aria-label={accessibleName}
          aria-labelledby={!accessibleName ? (accessibleNameRef || (labelContent ? `${id}-label` : undefined)) : undefined}
          aria-describedby={
            [
              accessibleDescriptionRef || null,
              valueState !== RadioButtonValueState.None ? descriptionId : null,
              accessibleDescription ? `${id}-desc-text` : null,
            ]
              .filter(Boolean)
              .join(" ") || undefined
          }
          aria-disabled={disabled || undefined}
          aria-invalid={valueState === RadioButtonValueState.Negative || undefined}
          aria-required={required || undefined}
          tabIndex={effectiveTabIndex}
          onMouseDown={handleMouseDown}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onFocus={onFocus}
          onBlur={onBlur}
          data-radio-group={name}
          data-radio-id={id}
          className={cn(
            "group relative inline-flex select-none max-w-full",
            "outline-none",
            labelContent ? "items-center" : "items-center justify-center",
            getSizeClasses(isSmall, !!labelContent),
            "text-sm",
            "rounded-lg",
            "after:content-[''] after:absolute after:pointer-events-none after:border-2 after:border-transparent after:rounded-md",
            getFocusRingClasses(!!labelContent, isSmall),
            "focus:after:border-[var(--color-ring)]",
            disabled && "opacity-40 cursor-not-allowed",
            readonly && "cursor-default",
            isInteractive && "cursor-pointer",
            className
          )}
          style={style}
          data-testid={dataTestId}
        >
          {/* Radio circle */}
          <RadioCircle
            isReadonly={readonly}
            isSmall={isSmall}
            isChecked={isChecked}
            hasWrappingLabel={hasWrappingLabel}
            isInteractive={isInteractive}
            valueState={valueState}
            svgR={svgR}
          />

          {/* Label text */}
          {labelContent && (
            <span
              id={`${id}-label`}
              className={cn(
                "text-sm min-w-0 flex-1 text-foreground",
                wrappingType === RadioButtonWrappingType.None && "truncate",
                wrappingType === RadioButtonWrappingType.Normal && "break-words",
                required && "after:content-['*'] after:ml-0.5 after:text-sapphire-negative"
              )}
            >
              {labelContent}
            </span>
          )}

          {/* Hidden descriptions for screen readers */}
          {valueState !== RadioButtonValueState.None && (
            <span id={descriptionId} className="sr-only">
              {valueStateMessage || defaultValueStateText}
            </span>
          )}
          {accessibleDescription && (
            <span id={`${id}-desc-text`} className="sr-only">
              {accessibleDescription}
            </span>
          )}
        </div>
      </div>
    );
}
