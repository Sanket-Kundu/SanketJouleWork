import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
  Children,
  isValidElement,
  cloneElement,
} from "react";
import { cn } from "../../lib/utils";
import {
  ComboBoxProps,
  ComboBoxFilter,
  ComboBoxSize,
  ValueState,
  ComboBoxItemProps,
  ComboBoxItemGroupProps,
  ComboBoxItemData,
  ComboBoxSelectionChangeDetail,
} from "../../types/combobox";
import { ComboBoxPopover } from "./ComboBoxPopover";
import {
  valueStateInputVariants,
  ValueStateMessage,
  ClearButton,
  DropdownArrowButton,
  computeVisibleItems,
  computeNavigableItems,
  useResultAnnouncement,
  useMessageHeight,
  usePopoverControls,
} from "./combobox-shared";
import { LiveRegion } from "../../hooks/useAnnounce";

/**
 * Input container variants — ComboBox-specific padding on top of shared value state variants.
 *
 * Large (default): h-10 (40px), rounded-lg (8px), pl-3.5 (14px), gap-1 (4px)
 * Medium:          h-8  (32px), rounded   (4px), pl-3   (12px), gap-1 (4px)
 */
const inputContainerVariants = (opts: {
  size: ComboBoxSize;
  valueState: ValueState;
  disabled: boolean;
  readonly: boolean;
}) => {
  const isLarge = opts.size === ComboBoxSize.Large;
  return cn(
    valueStateInputVariants(opts),
    isLarge
      ? "h-10 pl-3.5 pr-1 py-1 gap-1"
      : "h-8 pl-3 pr-1 py-1 gap-1",
    isLarge
      ? "focus-within:border-2 focus-within:pl-[13px] focus-within:pr-[3px] focus-within:py-[3px]"
      : "focus-within:border-2 focus-within:pl-[11px] focus-within:pr-[3px] focus-within:py-[3px]",
    opts.readonly && (isLarge ? "py-2.5" : "py-1.5"),
  );
};

/**
 * Extract item data from a ComboBoxItem element
 */
function getItemData(element: React.ReactElement<ComboBoxItemProps>) {
  const { text, value, children, additionalText, icon, disabled } = element.props;
  const displayText = text ?? (typeof children === "string" ? children : "");
  const itemValue = value ?? displayText;
  return { displayText, itemValue, additionalText, icon, disabled };
}

/**
 * Build item data object for callbacks
 */
function buildItemData(element: React.ReactElement<ComboBoxItemProps>): ComboBoxItemData {
  const { displayText, itemValue, additionalText, icon, disabled } = getItemData(element);
  return { text: displayText, value: itemValue, additionalText, icon, disabled };
}

/**
 * ComboBox component
 *
 * A native React implementation of the UI5 ComboBox with full enterprise features:
 * - Text filtering with multiple filter modes
 * - Type-ahead autocomplete
 * - Keyboard navigation
 * - Value states and validation
 * - Item groups
 * - ResponsivePopover for mobile support
 * - Full accessibility support
 */
export function ComboBox(
    {
      value: controlledValue,
      defaultValue = "",
      selectedValue: controlledSelectedValue,
      defaultSelectedValue,
      size = ComboBoxSize.Large,
      placeholder = "",
      disabled = false,
      readonly = false,
      required = false,
      name,
      filter = ComboBoxFilter.StartsWithPerTerm,
      noTypeahead = false,
      valueState = ValueState.None,
      valueStateMessage,
      showClearIcon = false,
      loading = false,
      open: controlledOpen,
      defaultOpen = false,
      accessibleName,
      accessibleNameRef,
      accessibleDescription,
      accessibleDescriptionRef,
      onInput,
      onChange,
      onSelectionChange,
      onOpen,
      onClose,
      children,
      className,
      icon,
      accessibilityAttributes,
      ref,
      "data-testid": dataTestId,
    }: ComboBoxProps
  ) {
    const isLargeSize = size === ComboBoxSize.Large;

    // Refs
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const messageRef = useRef<HTMLDivElement>(null);
    const [portalTarget, setPortalTarget] = useState<HTMLDivElement | null>(null);
    // Track whether the dropdown was opened by typing (vs explicit action like clicking arrow)
    const openedByTypingRef = useRef(false);
    // Track whether the user is navigating links inside the value state message
    const linkNavigationRef = useRef(false);

    // State
    const [internalValue, setInternalValue] = useState(defaultValue);
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const [filterValue, setFilterValue] = useState("");
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const [lastCommittedValue, setLastCommittedValue] = useState(defaultValue);
    const [internalSelectedValue, setInternalSelectedValue] = useState<string | undefined>(defaultSelectedValue);
    const [, setSelectedItem] = useState<ComboBoxSelectionChangeDetail["item"]>(null);

    // Controlled vs uncontrolled
    const value = controlledValue ?? internalValue;
    const isOpen = controlledOpen ?? internalOpen;
    const selectedValue = controlledSelectedValue ?? internalSelectedValue;

    // Helper to update selectedValue
    const updateSelectedValue = useCallback((val: string | undefined) => {
      if (controlledSelectedValue === undefined) {
        setInternalSelectedValue(val);
      }
    }, [controlledSelectedValue]);

    // Track previous isOpen to detect transitions (false -> true)
    const prevIsOpenRef = useRef(isOpen);

    // Normalize value state
    const normalizedValueState = (valueState as ValueState) || ValueState.None;
    const hasValueState = normalizedValueState !== ValueState.None && !!valueStateMessage;
    const isNegativeState = normalizedValueState === ValueState.Negative;

    // Generate unique IDs for accessibility
    const baseId = useMemo(() => `combobox-${Math.random().toString(36).slice(2, 9)}`, []);
    const popoverId = `${baseId}-popover`;
    const inputId = `${baseId}-input`;
    const messageId = `${baseId}-message`;

    const accessibleDescSpanId = `${baseId}-accessible-desc`;
    const linkShortcutHintId = `${baseId}-link-hint`;

    // Flatten children into items array for navigation
    const flattenedItems = useMemo(() => {
      const items: { element: React.ReactElement<ComboBoxItemProps>; groupIndex?: number }[] = [];

      Children.forEach(children, (child, groupIdx) => {
        if (!isValidElement(child)) return;

        // Check if it's a group
        if ((child.type as { displayName?: string })?.displayName === "ComboBoxItemGroup") {
          const groupProps = child.props as ComboBoxItemGroupProps;
          Children.forEach(groupProps.children, (groupChild) => {
            if (isValidElement(groupChild)) {
              items.push({
                element: groupChild as React.ReactElement<ComboBoxItemProps>,
                groupIndex: groupIdx,
              });
            }
          });
        } else {
          items.push({
            element: child as React.ReactElement<ComboBoxItemProps>,
          });
        }
      });

      return items;
    }, [children]);

    // Filter items based on current filter value
    const visibleItems = useMemo(
      () => computeVisibleItems(flattenedItems, filterValue, filter, (el) => getItemData(el).displayText),
      [flattenedItems, filterValue, filter]
    );

    // Get navigable (visible and not disabled) items
    const navigableItems = useMemo(() => computeNavigableItems(visibleItems), [visibleItems]);

    // Screen reader result count announcement
    const filteredCount = useMemo(
      () => visibleItems.filter((item) => item.isVisible).length,
      [visibleItems]
    );
    const { resultAnnouncement, t } = useResultAnnouncement(filterValue, filteredCount);

    // Measure the value state message height so we can reserve space with a placeholder
    const messageHeight = useMessageHeight(messageRef, valueStateMessage);

    // Helper: update the input value to the focused item's displayText and select all text.
    // This is used for visual sync during keyboard navigation — it does NOT fire onInput
    // because navigating through items is not the same as user text input.
    const syncInputToFocusedItem = useCallback(
      (index: number) => {
        if (index < 0 || index >= navigableItems.length) return;
        const item = navigableItems[index];
        const { displayText } = getItemData(item.element);
        if (controlledValue === undefined) {
          setInternalValue(displayText);
        }
        // Select all text in the input after React renders the new value
        requestAnimationFrame(() => {
          if (inputRef.current) {
            inputRef.current.setSelectionRange(0, displayText.length);
          }
        });
      },
      [navigableItems, controlledValue]
    );

    // Keyboard navigation within value state message links
    useEffect(() => {
      if (!isOpen || !portalTarget) return;

      const handleLinkKeyDown = (e: KeyboardEvent) => {
        if (!linkNavigationRef.current) return;

        const links = Array.from(portalTarget.querySelectorAll<HTMLElement>("a"));
        if (links.length === 0) return;

        const currentIndex = links.indexOf(e.target as HTMLElement);
        if (currentIndex === -1) return;

        const focusInput = () => {
          linkNavigationRef.current = false;
          inputRef.current?.focus();
        };

        switch (e.key) {
          case "Tab":
            e.preventDefault();
            if (e.shiftKey) {
              if (currentIndex <= 0) {
                focusInput();
              } else {
                links[currentIndex - 1].focus();
              }
            } else {
              if (currentIndex >= links.length - 1) {
                focusInput();
              } else {
                links[currentIndex + 1].focus();
              }
            }
            break;
          case "ArrowUp":
            e.preventDefault();
            focusInput();
            break;
          case "ArrowDown":
            e.preventDefault();
            focusInput();
            setFocusedIndex(0);
            syncInputToFocusedItem(0);
            break;
          case "Escape":
            e.preventDefault();
            e.stopPropagation();
            focusInput();
            break;
        }
      };

      portalTarget.addEventListener("keydown", handleLinkKeyDown);
      return () => portalTarget.removeEventListener("keydown", handleLinkKeyDown);
    }, [isOpen, portalTarget, syncInputToFocusedItem]);

    // Helper: navigate items when the popover is closed.
    // Updates display value, selectedValue, and fires onInput + onSelectionChange.
    // Matches UI5 behavior where change only fires on Enter/blur, but selection updates immediately.
    const navigateItemClosed = useCallback(
      (itemElement: React.ReactElement<ComboBoxItemProps>) => {
        const { displayText, itemValue } = getItemData(itemElement);
        if (controlledValue === undefined) {
          setInternalValue(displayText);
        }
        setFilterValue("");
        updateSelectedValue(itemValue);

        const itemData = buildItemData(itemElement);
        setSelectedItem(itemData);

        onInput?.(displayText);
        onSelectionChange?.({ item: itemData, value: displayText });
      },
      [controlledValue, onInput, onSelectionChange, updateSelectedValue]
    );

    // Open the popover
    // Popover open/close/toggle
    const { openPopover, closePopover, handlePopoverClose, togglePopover } = usePopoverControls({
      disabled, readonly, controlledOpen, isOpen,
      setInternalOpen, setFocusedIndex, onOpen, onClose,
    });

    // Auto-close popover when no items match filter
    useEffect(() => {
      if (isOpen && filterValue && visibleItems.every((item) => !item.isVisible)) {
        closePopover();
      }
    }, [isOpen, filterValue, visibleItems, closePopover]);

    // When the dropdown opens, auto-focus the selected item (if any) and optionally sync input
    useEffect(() => {
      const wasOpen = prevIsOpenRef.current;
      prevIsOpenRef.current = isOpen;

      // Only act on transitions from closed to open (not on initial mount with defaultOpen)
      if (!isOpen || wasOpen) return;
      if (navigableItems.length === 0) return;

      // If an item is already selected, focus it; otherwise no initial focus
      let initialIndex = -1;
      if (value) {
        const selectedIdx = navigableItems.findIndex((item) => {
          const { displayText } = getItemData(item.element);
          return displayText === value;
        });
        if (selectedIdx >= 0) {
          initialIndex = selectedIdx;
        }
      }

      setFocusedIndex(initialIndex);
      // Only sync input text when opened by explicit action and an item is focused
      if (!openedByTypingRef.current && initialIndex >= 0) {
        syncInputToFocusedItem(initialIndex);
      }
      openedByTypingRef.current = false;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    // Select an item
    const selectItem = useCallback(
      (itemElement: React.ReactElement<ComboBoxItemProps>) => {
        const { displayText, itemValue } = getItemData(itemElement);

        // Update value
        if (controlledValue === undefined) {
          setInternalValue(displayText);
        }
        setFilterValue("");
        setLastCommittedValue(displayText);
        updateSelectedValue(itemValue);

        const itemData = buildItemData(itemElement);
        setSelectedItem(itemData);

        // Fire callbacks
        onInput?.(displayText);
        onChange?.(displayText);
        onSelectionChange?.({ item: itemData, value: displayText });

        // Close popover
        closePopover();

        // Return focus to input
        inputRef.current?.focus();
      },
      [controlledValue, onInput, onChange, onSelectionChange, closePopover, updateSelectedValue]
    );

    // Handle input change
    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;

        if (controlledValue === undefined) {
          setInternalValue(newValue);
        }
        setFilterValue(newValue);
        onInput?.(newValue);

        // Auto-open on typing
        if (!isOpen && newValue) {
          openedByTypingRef.current = true;
          openPopover();
        }

        // Detect deletion-type input (Backspace, Delete, cut, undo, etc.)
        const nativeInputType = (e.nativeEvent as InputEvent).inputType ?? "";
        const isDeletion = nativeInputType.startsWith("delete") || nativeInputType === "historyUndo";

        if (isDeletion) {
          handleDeletionInput(newValue);
          return;
        }

        if (!noTypeahead && newValue) {
          handleTypeahead(newValue);
        }
      },
      [controlledValue, isOpen, noTypeahead, navigableItems, onInput, onSelectionChange, openPopover, updateSelectedValue, selectedValue, internalSelectedValue]
    );

    // Handle deletion input — clear selection and fire events
    const handleDeletionInput = useCallback(
      (newValue: string) => {
        if (selectedValue !== undefined || internalSelectedValue !== undefined) {
          updateSelectedValue(undefined);
          onSelectionChange?.({ item: null, value: newValue });
        }
        setFocusedIndex(-1);
      },
      [selectedValue, internalSelectedValue, updateSelectedValue, onSelectionChange]
    );

    // Handle typeahead — find matching item and autocomplete
    const handleTypeahead = useCallback(
      (newValue: string) => {
        const matchingItem = navigableItems.find((item) => {
          const { displayText } = getItemData(item.element);
          return displayText.toLowerCase().startsWith(newValue.toLowerCase());
        });

        if (matchingItem && inputRef.current) {
          const { displayText, itemValue } = getItemData(matchingItem.element);
          if (controlledValue === undefined) {
            setInternalValue(displayText);
          }
          updateSelectedValue(itemValue);

          const itemData = buildItemData(matchingItem.element);
          onSelectionChange?.({ item: itemData, value: displayText });

          // Select the autocompleted portion (or full text for Contains matches)
          const startsWithInput = displayText.toLowerCase().startsWith(newValue.toLowerCase());
          const selectionStart = startsWithInput ? newValue.length : 0;
          requestAnimationFrame(() => {
            inputRef.current?.setSelectionRange(selectionStart, displayText.length);
          });
        } else if (selectedValue !== undefined || internalSelectedValue !== undefined) {
          updateSelectedValue(undefined);
          onSelectionChange?.({ item: null, value: newValue });
        }
      },
      [controlledValue, navigableItems, updateSelectedValue, onSelectionChange, selectedValue, internalSelectedValue]
    );

    // Handle keyboard navigation
    // Handle F4 key — open/close popover with item matching
    const handleF4 = useCallback(() => {
      if (!isOpen) {
        openPopover();
        if (value) {
          const matchIdx = navigableItems.findIndex((item) => {
            const { displayText } = getItemData(item.element);
            return displayText === value;
          });
          if (matchIdx >= 0) {
            setFocusedIndex(matchIdx);
            syncInputToFocusedItem(matchIdx);
          } else {
            setFocusedIndex(-1);
          }
        } else if (navigableItems.length > 0) {
          setFocusedIndex(0);
          syncInputToFocusedItem(0);
        }
      } else {
        closePopover();
      }
    }, [isOpen, value, navigableItems, openPopover, closePopover, syncInputToFocusedItem]);

    // Handle clear
    const handleClear = useCallback(() => {
      if (controlledValue === undefined) {
        setInternalValue("");
      }
      setFilterValue("");
      setSelectedItem(null);
      updateSelectedValue(undefined);
      onInput?.("");
      onChange?.("");
      onSelectionChange?.({ item: null, value: "" });
      inputRef.current?.focus();
    }, [controlledValue, onInput, onChange, onSelectionChange, updateSelectedValue]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (disabled || readonly) return;

        // Helper: find current item index by matching value text
        const findCurrentIndex = () =>
          navigableItems.findIndex((item) => {
            const { displayText } = getItemData(item.element);
            return displayText === value;
          });

        // Helper: navigate to an item when popover is closed (no commit)
        const navigateClosed = (index: number) => {
          if (index >= 0 && index < navigableItems.length) {
            navigateItemClosed(navigableItems[index].element);
          }
        };

        // Helper: focus an item when popover is open and sync input text
        const focusOpenItem = (index: number) => {
          setFocusedIndex(index);
          syncInputToFocusedItem(index);
        };

        // Helper: navigate to a computed index in either open or closed state
        const navigateToIndex = (index: number) => {
          if (isOpen) {
            focusOpenItem(index);
          } else {
            navigateClosed(index);
          }
        };

        // Ctrl+Alt+F8 (Cmd+Option+F8 on Mac) — focus first link in value state message
        if (e.key === "F8" && (e.ctrlKey || e.metaKey) && e.altKey && isOpen && portalTarget) {
          e.preventDefault();
          const links = portalTarget.querySelectorAll<HTMLElement>("a");
          if (links.length > 0) {
            linkNavigationRef.current = true;
            setFocusedIndex(-1);
            links[0].focus();
          }
          return;
        }

        switch (e.key) {
          case "F4":
            e.preventDefault();
            handleF4();
            break;

          case "ArrowDown":
            e.preventDefault();
            if (e.altKey) {
              togglePopover();
            } else if (isOpen) {
              const nextDown = focusedIndex + 1;
              if (nextDown < navigableItems.length) {
                focusOpenItem(nextDown);
              }
            } else {
              navigateClosed(findCurrentIndex() + 1);
            }
            break;

          case "ArrowUp":
            e.preventDefault();
            if (e.altKey) {
              togglePopover();
            } else if (isOpen) {
              if (focusedIndex <= 0) {
                setFocusedIndex(-1);
                if (controlledValue === undefined) {
                  setInternalValue(filterValue);
                }
              } else {
                focusOpenItem(focusedIndex - 1);
              }
            } else {
              const currentIndex = findCurrentIndex();
              if (currentIndex > 0) {
                navigateClosed(currentIndex - 1);
              }
            }
            break;

          case "PageDown":
            e.preventDefault();
            navigateToIndex(
              isOpen
                ? Math.min(focusedIndex + 10, navigableItems.length - 1)
                : Math.min(findCurrentIndex() + 10, navigableItems.length - 1)
            );
            break;

          case "PageUp":
            e.preventDefault();
            navigateToIndex(
              isOpen
                ? Math.max(focusedIndex - 10, 0)
                : Math.max(findCurrentIndex() - 10, 0)
            );
            break;

          case "Home":
            e.preventDefault();
            navigateToIndex(0);
            break;

          case "End":
            e.preventDefault();
            navigateToIndex(navigableItems.length - 1);
            break;

          case "Enter":
            if (isOpen && focusedIndex >= 0 && focusedIndex < navigableItems.length) {
              e.preventDefault();
              selectItem(navigableItems[focusedIndex].element);
            } else if (!isOpen && value !== lastCommittedValue) {
              setLastCommittedValue(value);
              onChange?.(value);
            }
            break;

          case "Escape":
            e.preventDefault();
            if (isOpen) {
              closePopover();
            } else if (showClearIcon && value && !disabled && !readonly) {
              // Clear the input if clear icon is shown and there's a value
              handleClear();
            } else {
              // Otherwise revert to last committed value
              if (controlledValue === undefined) {
                setInternalValue(lastCommittedValue);
              }
              setFilterValue("");
            }
            break;

          case "Tab":
            if (isOpen) {
              closePopover();
            }
            break;
        }
      },
      [
        disabled,
        readonly,
        isOpen,
        focusedIndex,
        navigableItems,
        value,
        filterValue,
        lastCommittedValue,
        controlledValue,
        togglePopover,
        closePopover,
        selectItem,
        navigateItemClosed,
        syncInputToFocusedItem,
        onChange,
        portalTarget,
        handleF4,
        showClearIcon,
        handleClear,
      ]
    );

    // Handle blur - commit value and track focus
    const handleBlur = useCallback(
      (e: React.FocusEvent) => {
        // Don't fire if focus moves within the component (e.g. to clear button)
        const container = containerRef.current;
        if (container?.contains(e.relatedTarget as Node)) {
          return;
        }

        // Don't fire if focus moved to a link inside the value state message
        if (linkNavigationRef.current) {
          return;
        }

        // Commit value if changed
        if (value !== lastCommittedValue) {
          setLastCommittedValue(value);
          onChange?.(value);
        }
      },
      [value, lastCommittedValue, onChange]
    );

    // Render children with visibility and selection state
    const renderChildren = useCallback(() => {
      let itemIndex = 0;

      // Helper: determine if an item is selected
      const isItemSelected = (element: React.ReactElement<ComboBoxItemProps>) => {
        const { displayText, itemValue } = getItemData(element);
        if (selectedValue !== undefined) {
          return itemValue === selectedValue;
        }
        return displayText === value;
      };

      // Helper: compute props for a single item element
      const getItemProps = (element: React.ReactElement<ComboBoxItemProps>) => {
        const currentItemIndex = itemIndex++;
        const visibleItem = visibleItems.find((vi) => vi.originalIndex === currentItemIndex);
        const isVisible = visibleItem?.isVisible ?? true;
        const isSelected = isItemSelected(element);
        const isFocused = navigableItems.findIndex((ni) => ni.originalIndex === currentItemIndex) === focusedIndex;
        // When navigating with keyboard (focusedIndex >= 0), only the focused item shows as selected
        const showSelected = isOpen && focusedIndex >= 0 ? isFocused : isSelected;
        return { isVisible, selected: showSelected, focused: isFocused, onClick: () => selectItem(element) };
      };

      return Children.map(children, (child) => {
        if (!isValidElement(child)) return child;

        // Handle groups
        if ((child.type as { displayName?: string })?.displayName === "ComboBoxItemGroup") {
          const groupProps = child.props as ComboBoxItemGroupProps;
          let hasVisibleChild = false;

          const groupChildren = Children.map(groupProps.children, (groupChild) => {
            if (!isValidElement(groupChild)) return groupChild;
            const props = getItemProps(groupChild as React.ReactElement<ComboBoxItemProps>);
            if (props.isVisible) hasVisibleChild = true;
            return cloneElement(groupChild as React.ReactElement<ComboBoxItemProps>, props);
          });

          return cloneElement(child, {
            isVisible: hasVisibleChild,
            children: groupChildren,
          } as ComboBoxItemGroupProps);
        }

        // Handle individual items
        return cloneElement(
          child as React.ReactElement<ComboBoxItemProps>,
          getItemProps(child as React.ReactElement<ComboBoxItemProps>)
        );
      });
    }, [children, visibleItems, navigableItems, focusedIndex, value, selectedValue, isOpen, selectItem]);

    // Show clear icon?
    const showClear = showClearIcon && value && !disabled && !readonly;

    return (
      <div ref={ref} className={cn("relative w-full", className)} data-testid={dataTestId}>
        {/* Input container */}
        <div
          ref={containerRef}
          className={cn(
            inputContainerVariants({
              size: size as ComboBoxSize,
              valueState: valueState as ValueState,
              disabled,
              readonly,
            }),
            isOpen && focusedIndex >= 0 && (isLargeSize
              ? "!border !pl-3.5 !pr-1 !py-1"
              : "!border !pl-3 !pr-1 !py-1"),
          )}
        >
          {/* Custom icon slot */}
          {icon && (
            <span className="flex items-center justify-center shrink-0 text-sapphire-text-tertiary">
              {icon}
            </span>
          )}

          {/* Text input */}
          <input
            ref={inputRef}
            id={inputId}
            type="text"
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-autocomplete="both"
            aria-controls={[isOpen ? popoverId : null, accessibilityAttributes?.controls].filter(Boolean).join(" ") || undefined}
            aria-activedescendant={
              focusedIndex >= 0 && focusedIndex < navigableItems.length
                ? (() => {
                    const item = navigableItems[focusedIndex];
                    if (!item) return undefined;
                    const { displayText, itemValue } = getItemData(item.element);
                    return itemValue ?? displayText;
                  })()
                : undefined
            }
            aria-label={accessibleName}
            aria-labelledby={accessibleNameRef}
            aria-required={required}
            aria-invalid={isNegativeState || undefined}
            aria-busy={loading || undefined}
            aria-describedby={
              [
                valueStateMessage ? messageId : null,
                hasValueState ? linkShortcutHintId : null,
                accessibleDescriptionRef,
                accessibleDescription ? accessibleDescSpanId : null,
              ].filter(Boolean).join(" ") || undefined
            }
            name={name}
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readonly}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className={cn(
              "flex-1 h-full min-w-0 bg-transparent text-sm text-sapphire-text-primary",
              "outline-none",
              "placeholder:text-sapphire-text-tertiary placeholder:italic",
              "disabled:cursor-not-allowed",
              readonly && "text-sapphire-text-tertiary"
            )}
          />

          {/* Clear icon */}
          {showClear && (
            <ClearButton onClick={handleClear} comboBoxSize={size} />
          )}

          {/* Dropdown arrow — hidden in readonly mode per Figma spec */}
          {!readonly && (
            <DropdownArrowButton
              onClick={() => {
                togglePopover();
                inputRef.current?.focus();
              }}
              disabled={disabled}
              comboBoxSize={size}
            />
          )}
        </div>

        {/* Popover */}
        <ComboBoxPopover
          open={isOpen}
          triggerRef={containerRef as React.RefObject<HTMLElement | null>}
          hasValueState={hasValueState}
          valueStatePortalRef={setPortalTarget}
          loading={loading}
          onClose={handlePopoverClose}
        >
          {renderChildren()}
        </ComboBoxPopover>

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

        {/* Hidden accessible description for aria-describedby */}
        {accessibleDescription && (
          <span id={accessibleDescSpanId} className="sr-only">
            {accessibleDescription}
          </span>
        )}

        {/* Screen reader hint for value state link keyboard shortcut */}
        {hasValueState && (
          <span id={linkShortcutHintId} className="sr-only">
            {t("COMBOBOX_VALUE_STATE_LINK_SHORTCUT")}
          </span>
        )}

        {/* Screen reader result count announcement */}
        <LiveRegion message={resultAnnouncement} />
      </div>
    );
  }
