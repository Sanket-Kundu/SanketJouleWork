import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
  useId,
  Children,
  isValidElement,
  cloneElement,
} from "react";
import { cn, cva } from "../../lib/utils";
import {
  SelectProps,
  SelectSize,
  OptionProps,
  OptionCustomProps,
  OptionData,
  TextSeparator,
} from "../../types/select";
import { ValueState } from "../../types/combobox";
import { SelectPopover } from "./SelectPopover";
import {
  ValueStateMessage,
  useMessageHeight,
} from "../combobox/combobox-shared";
import { useAnnounce } from "../../hooks/useAnnounce";
import { useTranslation } from "react-i18next";
import { SlimArrowDownIcon } from "../../icons/SlimArrowDown";

/**
 * Select container variants based on value state and size
 */
const selectContainerVariants = cva(
  [
    "flex items-center border bg-card cursor-pointer",
    "overflow-clip",
    "outline-none",
  ],
  {
    variants: {
      size: {
        [SelectSize.Large]: [
          "h-10 rounded-lg min-w-[2.75rem]",
          "pl-3.5 pr-1 py-1 gap-2",
        ],
        [SelectSize.Medium]: [
          "h-8 rounded min-w-[2rem]",
          "pl-3 pr-1 py-1 gap-2",
        ],
      },
      valueState: {
        [ValueState.None]: "border-sapphire-border-active hover:border-sapphire-border-accent",
        [ValueState.Positive]: "border-sapphire-positive hover:bg-sapphire-canvas-primary",
        [ValueState.Negative]: "border-sapphire-negative hover:bg-sapphire-canvas-primary",
        [ValueState.Critical]: "border-sapphire-warning hover:bg-sapphire-canvas-primary",
        [ValueState.Information]: "border-sapphire-info hover:bg-sapphire-canvas-primary",
      },
      disabled: {
        true: "opacity-40 cursor-not-allowed pointer-events-none",
        false: "",
      },
      readonly: {
        true: "bg-muted cursor-default hover:border-sapphire-border-secondary",
        false: "",
      },
    },
    defaultVariants: {
      size: SelectSize.Large,
      valueState: ValueState.None,
      disabled: false,
      readonly: false,
    },
  }
);

/**
 * Get separator character
 */
function getSeparator(separator: TextSeparator | `${TextSeparator}`): string {
  switch (separator) {
    case TextSeparator.Bullet:
      return " · ";
    case TextSeparator.VerticalLine:
      return " | ";
    case TextSeparator.Dash:
    default:
      return " – ";
  }
}

/**
 * Extract option data from an Option or OptionCustom element
 */
function getOptionData(element: React.ReactElement): OptionData {
  const props = element.props as OptionProps | OptionCustomProps;
  const isCustom = (element.type as { displayName?: string })?.displayName === "OptionCustom";

  if (isCustom) {
    const customProps = props as OptionCustomProps;
    return {
      value: customProps.value,
      text: customProps.displayText ?? "",
      tooltip: customProps.tooltip,
      disabled: customProps.disabled,
    };
  }

  const optionProps = props as OptionProps;
  const text = typeof optionProps.children === "string" ? optionProps.children : "";
  return {
    value: optionProps.value,
    text,
    additionalText: optionProps.additionalText,
    icon: optionProps.icon,
    tooltip: optionProps.tooltip,
    disabled: optionProps.disabled,
  };
}

/**
 * Type-ahead hook for Select
 */
function useTypeAhead(options: OptionData[], onSelect: (index: number) => void) {
  const [, setTypedChars] = useState("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handleKeyPress = useCallback(
    (char: string) => {
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Update typed chars
      setTypedChars((prev) => {
        const newChars = prev + char.toLowerCase();

        // Find matching option
        let searchStr = newChars;
        // If all chars are the same (e.g., "aaa"), search for just one
        if (newChars.split("").every((c) => c === newChars[0])) {
          searchStr = newChars[0];
        }

        const matchIndex = options.findIndex(
          (opt) => !opt.disabled && opt.text.toLowerCase().startsWith(searchStr)
        );

        if (matchIndex >= 0) {
          onSelect(matchIndex);
        }

        return newChars;
      });

      // Set timeout to clear after 1 second
      timeoutRef.current = setTimeout(() => {
        setTypedChars("");
      }, 1000);
    },
    [options, onSelect]
  );

  // Cleanup
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { handleKeyPress, reset: () => setTypedChars("") };
}

/**
 * Select component
 *
 * A native React implementation of the UI5 Select component.
 * Similar to a native <select> but with custom styling and features:
 * - No text input (display only)
 * - Click to open dropdown
 * - Keyboard navigation
 * - Type-ahead search
 * - Value states
 * - Full accessibility
 */
export function Select(
    {
      value: controlledValue,
      defaultValue,
      size = SelectSize.Large,
      disabled = false,
      readonly = false,
      required = false,
      name,
      valueState = ValueState.None,
      valueStateMessage,
      icon,
      tooltip,
      textSeparator = TextSeparator.Dash,
      accessibleName,
      accessibleNameRef,
      accessibleDescription,
      accessibleDescriptionRef,
      open: controlledOpen,
      defaultOpen = false,
      onChange,
      onLiveChange,
      onOpen,
      onClose,
      children,
      className,
      label,
      accessibilityAttributes,
      ref,
      "data-testid": dataTestId,
    }: SelectProps
  ) {
    // Refs
    const triggerRef = useRef<HTMLDivElement>(null);
    const messageRef = useRef<HTMLDivElement>(null);
    const [portalTarget, setPortalTarget] = useState<HTMLDivElement | null>(null);

    // Screen reader announcements
    const { announce, liveRegionProps } = useAnnounce();

    // Locale-aware i18n strings
    const { t } = useTranslation("fx");

    // Flatten children into options array
    const options = useMemo(() => {
      const opts: { element: React.ReactElement; data: OptionData; index: number }[] = [];

      Children.forEach(children, (child, index) => {
        if (isValidElement(child)) {
          const data = getOptionData(child);
          opts.push({ element: child, data, index });
        }
      });

      return opts;
    }, [children]);

    // Find initially selected option
    const initialSelectedIndex = useMemo(() => {
      const valueToFind = controlledValue ?? defaultValue;

      if (valueToFind !== undefined) {
        // Find by value first
        const byValue = options.findIndex((opt) => opt.data.value === valueToFind);
        if (byValue >= 0) return byValue;

        // Then by text
        const byText = options.findIndex((opt) => opt.data.text === valueToFind);
        if (byText >= 0) return byText;
      }

      // Check for selected prop
      const bySelectedProp = options.findIndex((opt) => {
        const props = opt.element.props as OptionProps | OptionCustomProps;
        return props.selected === true;
      });
      if (bySelectedProp >= 0) return bySelectedProp;

      // Default to first non-disabled option
      const firstEnabled = options.findIndex((opt) => !opt.data.disabled);
      return firstEnabled >= 0 ? firstEnabled : 0;
    }, [options, controlledValue, defaultValue]);

    // State
    const [internalSelectedIndex, setInternalSelectedIndex] = useState(initialSelectedIndex);
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const [previousSelectedIndex, setPreviousSelectedIndex] = useState(initialSelectedIndex);

    // Controlled vs uncontrolled
    const isOpen = controlledOpen ?? internalOpen;

    // Normalize value state
    const normalizedValueState = (valueState as ValueState) || ValueState.None;
    const hasValueState = normalizedValueState !== ValueState.None && !!valueStateMessage;

    // Generate unique IDs for accessibility
    const baseId = useId();
    const messageId = `${baseId}-message`;

    // Measure the value state message height so we can reserve space with a placeholder
    const messageHeight = useMessageHeight(messageRef, valueStateMessage);

    // Get selected option
    const selectedOption = useMemo(() => {
      // If controlled, find by value
      if (controlledValue !== undefined) {
        const opt = options.find(
          (o) => o.data.value === controlledValue || o.data.text === controlledValue
        );
        return opt?.data ?? null;
      }

      return options[internalSelectedIndex]?.data ?? null;
    }, [options, controlledValue, internalSelectedIndex]);

    const popoverId = `${baseId}-popover`;
    const descriptionId = `${baseId}-description`;

    // Type-ahead
    const { handleKeyPress } = useTypeAhead(
      options.map((o) => o.data),
      (index) => {
        if (!isOpen) {
          // Select directly when closed
          setInternalSelectedIndex(index);
          const data = options[index]?.data;
          if (data) {
            onChange?.({ selectedOption: data });
          }
        } else {
          // Just focus when open
          setFocusedIndex(index);
          onLiveChange?.({ selectedOption: options[index]?.data ?? null });
        }
      }
    );

    // Open the popover
    const openPopover = useCallback(() => {
      if (disabled || readonly) return;

      setPreviousSelectedIndex(internalSelectedIndex);
      setFocusedIndex(internalSelectedIndex);

      if (controlledOpen === undefined) {
        setInternalOpen(true);
      }
      onOpen?.();
    }, [disabled, readonly, internalSelectedIndex, controlledOpen, onOpen]);

    // Close the popover
    const closePopover = useCallback(() => {
      if (controlledOpen === undefined) {
        setInternalOpen(false);
      }
      setFocusedIndex(-1);
      onClose?.();
    }, [controlledOpen, onClose]);

    // Handle before-close from ResponsivePopover (revert on Escape)
    const handleBeforeClose = useCallback(
      (detail: { escPressed: boolean }) => {
        if (detail.escPressed) {
          setInternalSelectedIndex(previousSelectedIndex);
        }
      },
      [previousSelectedIndex]
    );

    // Toggle the popover
    const togglePopover = useCallback(() => {
      if (isOpen) {
        closePopover();
      } else {
        openPopover();
      }
    }, [isOpen, openPopover, closePopover]);

    // Select an option
    const selectOption = useCallback(
      (index: number, closeAfter = true) => {
        if (index < 0 || index >= options.length) return;
        if (options[index].data.disabled) return;

        setInternalSelectedIndex(index);
        const data = options[index].data;

        onChange?.({ selectedOption: data });

        if (closeAfter) {
          closePopover();
          triggerRef.current?.focus();
        }
      },
      [options, onChange, closePopover]
    );

    // Handle keyboard navigation
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (disabled) return;

        switch (e.key) {
          case "F4":
            e.preventDefault();
            togglePopover();
            break;

          case " ":
          case "Enter":
            e.preventDefault();
            if (isOpen) {
              // Select focused option
              if (focusedIndex >= 0) {
                selectOption(focusedIndex);
              }
            } else {
              openPopover();
            }
            break;

          case "ArrowDown":
            e.preventDefault();
            if (e.altKey) {
              openPopover();
            } else if (isOpen) {
              // Navigate down in list
              setFocusedIndex((prev) => {
                const nextIdx = prev + 1;
                const next = nextIdx >= options.length ? 0 : nextIdx;
                // Skip disabled
                if (options[next]?.data.disabled) {
                  const nextNonDisabled = options.findIndex(
                    (o, i) => i > next && !o.data.disabled
                  );
                  return nextNonDisabled >= 0 ? nextNonDisabled : prev;
                }
                onLiveChange?.({ selectedOption: options[next]?.data ?? null });
                return next;
              });
            } else {
              // Select next when closed
              const currentIdx = options.findIndex((o) => o.data === selectedOption);
              const nextIdx = currentIdx + 1;
              if (nextIdx < options.length && !options[nextIdx].data.disabled) {
                setInternalSelectedIndex(nextIdx);
                onChange?.({ selectedOption: options[nextIdx].data });
                const optionText = options[nextIdx].data.text;
                announce(t("SELECT_OPTION_SELECTED", { text: optionText }));
              }
            }
            break;

          case "ArrowUp":
            e.preventDefault();
            if (e.altKey) {
              closePopover();
            } else if (isOpen) {
              // Navigate up in list
              setFocusedIndex((prev) => {
                const nextIdx = prev - 1;
                const next = nextIdx < 0 ? options.length - 1 : nextIdx;
                // Skip disabled
                if (options[next]?.data.disabled) {
                  const prevNonDisabled = options
                    .slice(0, next)
                    .reverse()
                    .findIndex((o) => !o.data.disabled);
                  return prevNonDisabled >= 0 ? next - 1 - prevNonDisabled : prev;
                }
                onLiveChange?.({ selectedOption: options[next]?.data ?? null });
                return next;
              });
            } else {
              // Select previous when closed
              const currentIdx = options.findIndex((o) => o.data === selectedOption);
              const prevIdx = currentIdx - 1;
              if (prevIdx >= 0 && !options[prevIdx].data.disabled) {
                setInternalSelectedIndex(prevIdx);
                onChange?.({ selectedOption: options[prevIdx].data });
                const optionText = options[prevIdx].data.text;
                announce(t("SELECT_OPTION_SELECTED", { text: optionText }));
              }
            }
            break;

          case "Home":
            e.preventDefault();
            if (isOpen) {
              const firstNonDisabled = options.findIndex((o) => !o.data.disabled);
              if (firstNonDisabled >= 0) {
                setFocusedIndex(firstNonDisabled);
                onLiveChange?.({ selectedOption: options[firstNonDisabled]?.data ?? null });
              }
            }
            break;

          case "End":
            e.preventDefault();
            if (isOpen) {
              const lastNonDisabled = options.length - 1 - [...options].reverse().findIndex((o) => !o.data.disabled);
              if (lastNonDisabled >= 0 && lastNonDisabled < options.length) {
                setFocusedIndex(lastNonDisabled);
                onLiveChange?.({ selectedOption: options[lastNonDisabled]?.data ?? null });
              }
            }
            break;

          case "Escape":
            e.preventDefault();
            if (isOpen) {
              // Revert is handled in onBeforeClose callback
              closePopover();
            }
            break;

          case "Tab":
            if (isOpen) {
              // Close popover and confirm selection on Tab
              selectOption(focusedIndex);
              closePopover();
            }
            break;
        }

        // Type-ahead for letter keys
        if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
          handleKeyPress(e.key);
        }
      },
      [
        disabled,
        isOpen,
        focusedIndex,
        options,
        selectedOption,
        handleKeyPress,
        togglePopover,
        openPopover,
        closePopover,
        selectOption,
        onChange,
        onLiveChange,
        announce,
      ]
    );

    // Handle click on trigger
    const handleClick = useCallback(() => {
      if (!disabled && !readonly) {
        togglePopover();
      }
    }, [disabled, readonly, togglePopover]);

    // Render display text
    const renderDisplayText = () => {
      if (label) {
        return label;
      }

      if (!selectedOption) {
        return <span className="text-sapphire-text-tertiary">{t("SELECT_PLACEHOLDER")}</span>;
      }

      if (readonly && selectedOption.additionalText) {
        return (
          <span>
            {selectedOption.text}
            {getSeparator(textSeparator)}
            {selectedOption.additionalText}
          </span>
        );
      }

      return <span>{selectedOption.text}</span>;
    };

    // Render children with selection and focus state
    const renderChildren = useCallback(() => {
      return Children.map(children, (child, index) => {
        if (!isValidElement(child)) return child;

        const data = getOptionData(child);
        const isSelected =
          (data.value != null && data.value === selectedOption?.value) ||
          data.text === selectedOption?.text;
        const isFocused = index === focusedIndex;

        return cloneElement(child as React.ReactElement<OptionProps | OptionCustomProps>, {
          selected: isSelected,
          focused: isFocused,
          onClick: () => selectOption(index),
        });
      });
    }, [children, selectedOption, focusedIndex, selectOption]);

    // Icon-only mode
    const isIconOnly = !!icon && !label;

    return (
      <div ref={ref} className={cn("relative w-full", isIconOnly && "w-auto", className)} data-testid={dataTestId}>
        {/* Hidden input for form submission */}
        {name && (
          <input
            type="hidden"
            name={name}
            value={selectedOption?.value ?? selectedOption?.text ?? ""}
          />
        )}

        {/* Select trigger */}
        <div
          ref={triggerRef}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-roledescription={t("SELECT_ROLE_DESCRIPTION")}
          aria-controls={[isOpen ? popoverId : null, accessibilityAttributes?.controls].filter(Boolean).join(" ") || undefined}
          aria-activedescendant={
            focusedIndex >= 0 && options[focusedIndex]
              ? (options[focusedIndex].data.value ?? options[focusedIndex].data.text)
              : undefined
          }
          aria-label={accessibleName}
          aria-labelledby={accessibleNameRef}
          aria-describedby={
            [
              valueStateMessage ? messageId : null,
              valueState !== ValueState.None ? descriptionId : null,
              accessibleDescriptionRef,
            ]
              .filter(Boolean)
              .join(" ") || undefined
          }
          aria-required={required}
          aria-disabled={disabled}
          aria-readonly={readonly}
          aria-invalid={valueState === ValueState.Negative}
          tabIndex={disabled ? -1 : 0}
          title={tooltip}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          className={cn(
            selectContainerVariants({
              size: size as SelectSize,
              valueState: valueState as ValueState,
              disabled,
              readonly,
            }),
            isIconOnly && "p-2",
            !isOpen && !disabled && !readonly && "focus-visible:border-2 focus-visible:border-sapphire-border-accent",
            !isOpen && !disabled && !readonly && (size === SelectSize.Medium
              ? "focus-visible:pl-[11px] focus-visible:pr-[3px] focus-visible:py-[3px]"
              : "focus-visible:pl-[13px] focus-visible:pr-[3px] focus-visible:py-[3px]"),
          )}
        >
          {/* Icon for icon-only mode */}
          {isIconOnly ? (
            <span className="flex items-center justify-center text-sapphire-text-tertiary">
              {icon}
            </span>
          ) : (
            <>
              {/* Display text */}
              <div className="flex-1 py-2 text-sm truncate min-w-0">
                {renderDisplayText()}
              </div>

              {/* Dropdown arrow (not in readonly mode) */}
              {!readonly && (
                <span className={cn(
                  "flex items-center justify-center shrink-0 text-sapphire-neutral-foreground-black",
                  size === SelectSize.Medium ? "h-6 w-6" : "h-8 w-8",
                )}>
                  <SlimArrowDownIcon className={size === SelectSize.Medium ? "h-3 w-3" : "h-4 w-4"} />
                </span>
              )}
            </>
          )}
        </div>

        {/* Hidden description for screen readers */}
        {valueState !== ValueState.None && valueStateMessage && (
          <span id={descriptionId} className="sr-only">
            {valueStateMessage}
          </span>
        )}
        {accessibleDescription && (
          <span id={`${baseId}-desc-text`} className="sr-only">
            {accessibleDescription}
          </span>
        )}

        {/* Popover */}
        <SelectPopover
          open={isOpen}
          triggerRef={triggerRef as React.RefObject<HTMLElement | null>}
          valueState={valueState}
          valueStateMessage={valueStateMessage}
          hasValueState={hasValueState}
          valueStatePortalRef={setPortalTarget}
          onBeforeClose={handleBeforeClose}
          onClose={closePopover}
        >
          {renderChildren()}
        </SelectPopover>

        {/* Value state message — portaled into popover when open, inline when closed */}
        {valueStateMessage && (
          <ValueStateMessage
            isOpen={isOpen}
            hasValueState={hasValueState}
            portalTarget={portalTarget}
            messageHeight={messageHeight}
            messageRef={messageRef}
            messageId={messageId}
            normalizedValueState={normalizedValueState}
            valueStateMessage={valueStateMessage}
          />
        )}

        {/* Live region for screen reader announcements */}
        <div {...liveRegionProps} />
      </div>
    );
  }
