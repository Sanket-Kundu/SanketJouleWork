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
  MultiComboBoxProps,
  MultiComboBoxItemProps,
  MultiComboBoxItemGroupProps,
  MultiComboBoxItemData,
} from "../../types/multicombobox";
import { ComboBoxFilter, ComboBoxSize, ValueState } from "../../types/combobox";
import { ComboBoxPopover } from "../combobox/ComboBoxPopover";
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
} from "../combobox/combobox-shared";
import { Token } from "../token/Token";
import { Tokenizer } from "../token/Tokenizer";
import type { TokenizerRef } from "../../types/tokenizer";
import { LiveRegion } from "../../hooks/useAnnounce";
import { AcceptIcon } from "../../icons/Accept";

/**
 * Input container variants — MultiComboBox-specific padding on top of shared value state variants.
 *
 * Large (default): h-10 (40px), rounded-lg (8px), pl-3.5 (14px) / pl-1 with tokens, gap-1 (4px)
 * Medium:          h-8  (32px), rounded   (4px), pl-3   (12px) / pl-0.5 with tokens, gap-1 (4px)
 */
const inputContainerVariants = (opts: { size: ComboBoxSize; valueState: ValueState; disabled: boolean; readonly: boolean; hasTokens: boolean }) => {
  const isLarge = opts.size === ComboBoxSize.Large;
  return cn(
    valueStateInputVariants(opts),
    isLarge ? "h-10 pr-1 gap-1" : "h-8 pr-1 gap-1",
    opts.hasTokens
      ? isLarge ? "pl-1 py-0" : "pl-0.5 py-0"
      : isLarge ? "pl-3.5 py-1" : "pl-3 py-1",
    opts.hasTokens
      ? isLarge
        ? "focus-within:border-2 focus-within:pl-[3px] focus-within:pr-[3px] focus-within:py-0"
        : "focus-within:border-2 focus-within:pl-px focus-within:pr-[3px] focus-within:py-0"
      : isLarge
        ? "focus-within:border-2 focus-within:pl-[13px] focus-within:pr-[3px] focus-within:py-[3px]"
        : "focus-within:border-2 focus-within:pl-[11px] focus-within:pr-[3px] focus-within:py-[3px]",
  );
};

/**
 * Extract item data from a MultiComboBoxItem element
 */
function getItemData(element: React.ReactElement<MultiComboBoxItemProps>) {
  const { text, value, children, additionalText, icon, disabled } = element.props;
  const displayText = text ?? (typeof children === "string" ? children : "");
  const itemValue = value ?? displayText;
  return { displayText, itemValue, additionalText, icon, disabled };
}

/**
 * Build item data object for callbacks
 */
function buildItemData(element: React.ReactElement<MultiComboBoxItemProps>): MultiComboBoxItemData {
  const { displayText, itemValue, additionalText, icon, disabled } = getItemData(element);
  return { text: displayText, value: itemValue, additionalText, icon, disabled };
}

/**
 * MultiComboBox component
 *
 * A multi-selection combo box that displays selected items as tokens
 * and offers a filterable dropdown with checkboxes.
 *
 * Composes Tokenizer, Token, ComboBoxPopover, and shared filtering logic.
 */
export function MultiComboBox(
    {
      value: controlledValue,
      defaultValue = "",
      size = ComboBoxSize.Large,
      selectedValues: controlledSelectedValues,
      defaultSelectedValues = [],
      placeholder = "",
      disabled = false,
      readonly = false,
      required = false,
      name,
      filter = ComboBoxFilter.StartsWithPerTerm,
      noTypeahead: _noTypeahead = false,
      noValidation: _noValidation = false,
      valueState = ValueState.None,
      valueStateMessage,
      showClearIcon = false,
      showSelectAll = false,
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
    }: MultiComboBoxProps
  ) {
    // Refs
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const tokenizerRef = useRef<TokenizerRef>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const selectAllRef = useRef<HTMLDivElement>(null);
    const selectAllFocusedRef = useRef(false);
    const messageRef = useRef<HTMLDivElement>(null);
    const [portalTarget, setPortalTarget] = useState<HTMLDivElement | null>(null);

    // State
    const [internalValue, setInternalValue] = useState(defaultValue);
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const [filterValue, setFilterValue] = useState("");
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const [selectedOnTop, setSelectedOnTop] = useState(false);
    const [inputFocused, setInputFocused] = useState(false);
    const [internalSelectedValues, setInternalSelectedValues] = useState<Set<string>>(
      () => new Set(defaultSelectedValues)
    );

    // Controlled vs uncontrolled
    const inputValue = controlledValue ?? internalValue;
    const isOpen = controlledOpen ?? internalOpen;
    const selectedValuesSet = useMemo(() => {
      if (controlledSelectedValues !== undefined) {
        return new Set(controlledSelectedValues);
      }
      return internalSelectedValues;
    }, [controlledSelectedValues, internalSelectedValues]);

    // Normalize value state
    const normalizedValueState = (valueState as ValueState) || ValueState.None;
    const hasValueState = normalizedValueState !== ValueState.None && !!valueStateMessage;
    const isNegativeState = normalizedValueState === ValueState.Negative;

    // Tokens expand to multi-line (showing all) when input is focused or popover is open
    const tokensExpanded = inputFocused || isOpen;

    // Generate unique IDs for accessibility
    const baseId = useMemo(() => `multicombobox-${Math.random().toString(36).slice(2, 9)}`, []);
    const popoverId = `${baseId}-popover`;
    const inputId = `${baseId}-input`;
    const messageId = `${baseId}-message`;
    const accessibleDescSpanId = `${baseId}-accessible-desc`;

    // Flatten children into items array for navigation
    const flattenedItems = useMemo(() => {
      const items: { element: React.ReactElement<MultiComboBoxItemProps>; groupIndex?: number }[] = [];

      Children.forEach(children, (child, groupIdx) => {
        if (!isValidElement(child)) return;

        if ((child.type as { displayName?: string })?.displayName === "MultiComboBoxItemGroup") {
          const groupProps = child.props as MultiComboBoxItemGroupProps;
          Children.forEach(groupProps.children, (groupChild) => {
            if (isValidElement(groupChild)) {
              items.push({
                element: groupChild as React.ReactElement<MultiComboBoxItemProps>,
                groupIndex: groupIdx,
              });
            }
          });
        } else {
          items.push({
            element: child as React.ReactElement<MultiComboBoxItemProps>,
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

    // Get navigable (visible and not disabled) items.
    // When selectedOnTop is true the popup only renders selected items,
    // so navigation must be limited to those items as well.
    const navigableItems = useMemo(() => {
      const base = computeNavigableItems(visibleItems);
      if (!selectedOnTop) return base;
      return base.filter(({ element }) => {
        const { itemValue } = getItemData(element);
        return selectedValuesSet.has(itemValue);
      });
    }, [visibleItems, selectedOnTop, selectedValuesSet]);

    // Compute selected items (ordered) for tokens
    const selectedItems = useMemo(() => {
      const items: { text: string; value: string }[] = [];
      for (const { element } of flattenedItems) {
        const { displayText, itemValue } = getItemData(element);
        if (selectedValuesSet.has(itemValue)) {
          items.push({ text: displayText, value: itemValue });
        }
      }
      return items;
    }, [flattenedItems, selectedValuesSet]);

    // Screen reader result count announcement
    const filteredCount = useMemo(
      () => visibleItems.filter((item) => item.isVisible).length,
      [visibleItems]
    );
    const { resultAnnouncement, t } = useResultAnnouncement(filterValue, filteredCount);

    // Clamp focusedIndex when the navigable list shrinks (e.g. deselecting
    // an item in the "N more" popup removes it from the list).
    useEffect(() => {
      if (!isOpen || focusedIndex < 0) return;
      if (navigableItems.length === 0) {
        setFocusedIndex(-1);
      } else if (focusedIndex >= navigableItems.length) {
        setFocusedIndex(navigableItems.length - 1);
      }
    }, [isOpen, focusedIndex, navigableItems.length]);

    // Move real DOM focus to the focused item in the dropdown.
    // Including navigableItems.length ensures focus is re-applied when an
    // item is removed and the same index now points to a different element.
    useEffect(() => {
      if (!isOpen) return;
      if (focusedIndex >= 0) {
        requestAnimationFrame(() => {
          const popoverEl = containerRef.current?.parentElement?.querySelector?.("[popover]")
            ?? document.querySelector(`[data-popover-open]`);
          if (!popoverEl) return;
          const options = popoverEl.querySelectorAll<HTMLElement>('li[role="option"]:not([data-select-all])');
          let visibleIdx = 0;
          for (let i = 0; i < options.length; i++) {
            if (options[i].offsetParent !== null || options[i].offsetHeight > 0) {
              if (visibleIdx === focusedIndex) {
                options[i].focus();
                return;
              }
              visibleIdx++;
            }
          }
        });
      } else if (focusedIndex === -1) {
        if (selectAllFocusedRef.current) {
          requestAnimationFrame(() => {
            selectAllRef.current?.focus();
          });
          selectAllFocusedRef.current = false;
        } else {
          inputRef.current?.focus();
        }
      }
    }, [focusedIndex, isOpen, navigableItems.length]);

    // Measure the value state message height for portal placeholder
    const messageHeight = useMessageHeight(messageRef, valueStateMessage);

    // Popover open/close/toggle
    const { openPopover, closePopover: baseClosePopover, handlePopoverClose: baseHandlePopoverClose, togglePopover } = usePopoverControls({
      disabled, readonly, controlledOpen, isOpen,
      setInternalOpen, setFocusedIndex, onOpen, onClose,
    });

    const closePopover = useCallback(() => {
      setSelectedOnTop(false);
      baseClosePopover();
    }, [baseClosePopover]);

    const handlePopoverClose = useCallback(() => {
      setSelectedOnTop(false);
      baseHandlePopoverClose();
    }, [baseHandlePopoverClose]);

    // Helper to build the full list of selected item data from a values set
    const buildSelectedItemsList = useCallback(
      (valuesSet: Set<string>): MultiComboBoxItemData[] => {
        const items: MultiComboBoxItemData[] = [];
        for (const { element } of flattenedItems) {
          const data = buildItemData(element);
          if (valuesSet.has(data.value ?? data.text)) {
            items.push(data);
          }
        }
        return items;
      },
      [flattenedItems]
    );

    // Toggle item selection
    const toggleItem = useCallback(
      (itemElement: React.ReactElement<MultiComboBoxItemProps>) => {
        const { itemValue } = getItemData(itemElement);
        const newSet = new Set(selectedValuesSet);
        const wasSelected = newSet.has(itemValue);

        if (wasSelected) {
          newSet.delete(itemValue);
        } else {
          newSet.add(itemValue);
        }

        if (controlledSelectedValues === undefined) {
          setInternalSelectedValues(newSet);
        }

        const changedItem = buildItemData(itemElement);
        onSelectionChange?.({
          items: buildSelectedItemsList(newSet),
          changedItem,
          selected: !wasSelected,
        });
      },
      [selectedValuesSet, controlledSelectedValues, onSelectionChange, buildSelectedItemsList]
    );

    // Handle token deletion from Tokenizer
    const handleTokenDelete = useCallback(
      (detail: { tokens: number[] }) => {
        const newSet = new Set(selectedValuesSet);
        const deletedItems: MultiComboBoxItemData[] = [];

        for (const idx of detail.tokens) {
          if (idx >= 0 && idx < selectedItems.length) {
            const item = selectedItems[idx];
            newSet.delete(item.value);

            // Find the element data for the callback
            const flatItem = flattenedItems.find((fi) => {
              const { itemValue } = getItemData(fi.element);
              return itemValue === item.value;
            });
            if (flatItem) {
              deletedItems.push(buildItemData(flatItem.element));
            }
          }
        }

        if (controlledSelectedValues === undefined) {
          setInternalSelectedValues(newSet);
        }

        // Fire onSelectionChange for each deleted item
        for (const changedItem of deletedItems) {
          onSelectionChange?.({
            items: buildSelectedItemsList(newSet),
            changedItem,
            selected: false,
          });
        }

        // Return focus to input
        inputRef.current?.focus();
      },
      [selectedValuesSet, selectedItems, flattenedItems, controlledSelectedValues, onSelectionChange, buildSelectedItemsList]
    );

    // Handle Select All
    const handleSelectAll = useCallback(() => {
      const visibleNonDisabled = navigableItems;
      const allVisibleValues = visibleNonDisabled.map((item) => getItemData(item.element).itemValue);
      const allSelected = allVisibleValues.every((v) => selectedValuesSet.has(v));

      const newSet = new Set(selectedValuesSet);

      if (allSelected) {
        // Deselect all visible
        for (const v of allVisibleValues) {
          newSet.delete(v);
        }
      } else {
        // Select all visible
        for (const v of allVisibleValues) {
          newSet.add(v);
        }
      }

      if (controlledSelectedValues === undefined) {
        setInternalSelectedValues(newSet);
      }

      // Fire a single selection change for the batch operation
      const dummyItem: MultiComboBoxItemData = { text: allSelected ? t("MULTICOMBOBOX_DESELECT_ALL") : t("MULTICOMBOBOX_SELECT_ALL") };
      onSelectionChange?.({
        items: buildSelectedItemsList(newSet),
        changedItem: dummyItem,
        selected: !allSelected,
      });
    }, [navigableItems, selectedValuesSet, controlledSelectedValues, onSelectionChange, buildSelectedItemsList]);

    // Compute Select All checkbox state
    const selectAllState = useMemo(() => {
      if (!showSelectAll) return "unchecked" as const;
      const visibleValues = navigableItems.map((item) => getItemData(item.element).itemValue);
      if (visibleValues.length === 0) return "unchecked" as const;
      const selectedCount = visibleValues.filter((v) => selectedValuesSet.has(v)).length;
      if (selectedCount === 0) return "unchecked" as const;
      if (selectedCount === visibleValues.length) return "checked" as const;
      return "indeterminate" as const;
    }, [showSelectAll, navigableItems, selectedValuesSet]);

    // Handle input change
    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;

        if (controlledValue === undefined) {
          setInternalValue(newValue);
        }
        setFilterValue(newValue);
        setSelectedOnTop(false);
        onInput?.(newValue);

        // Auto-open on typing
        if (!isOpen && newValue) {
          openPopover();
        }

        // Reset focused index when typing
        setFocusedIndex(-1);
      },
      [controlledValue, isOpen, onInput, openPopover]
    );

    // Handle clear all
    const handleClear = useCallback(() => {
      if (controlledValue === undefined) {
        setInternalValue("");
      }
      setFilterValue("");

      const newSet = new Set<string>();
      if (controlledSelectedValues === undefined) {
        setInternalSelectedValues(newSet);
      }

      onInput?.("");
      onChange?.("");
      onSelectionChange?.({
        items: [],
        changedItem: { text: t("MULTICOMBOBOX_CLEAR_ALL") },
        selected: false,
      });

      inputRef.current?.focus();
    }, [controlledValue, controlledSelectedValues, onInput, onChange, onSelectionChange]);

    // Handle keyboard navigation
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (disabled) return;
        if (readonly && e.key !== "Tab") return;

        switch (e.key) {
          case "F4":
            e.preventDefault();
            togglePopover();
            break;

          case "ArrowDown":
            e.preventDefault();
            if (e.altKey) {
              togglePopover();
            } else if (isOpen) {
              if (showSelectAll && navigableItems.length > 0) {
                selectAllRef.current?.focus();
              } else if (navigableItems.length > 0) {
                setFocusedIndex(0);
              }
            } else {
              openPopover();
            }
            break;

          case "ArrowUp":
            e.preventDefault();
            if (e.altKey) {
              togglePopover();
            }
            break;

          case "ArrowLeft": {
            // Move focus to last token when cursor is at position 0
            const input = inputRef.current;
            if (input && input.selectionStart === 0 && input.selectionEnd === 0 && selectedItems.length > 0) {
              e.preventDefault();
              tokenizerRef.current?.focusLast();
            }
            break;
          }

          case "Backspace": {
            // When input is empty and there are tokens, focus the last token
            const inp = inputRef.current;
            if (inp && !inputValue && selectedItems.length > 0) {
              e.preventDefault();
              tokenizerRef.current?.focusLast();
            }
            break;
          }

          case "Enter":
            if (!isOpen && inputValue) {
              onChange?.(inputValue);
            }
            break;

          case "Escape":
            e.preventDefault();
            if (isOpen) {
              closePopover();
            } else if (showClearIcon && (selectedItems.length > 0 || inputValue) && !disabled && !readonly) {
              // Clear the input and selections if clear icon is shown
              handleClear();
            }
            break;

          case "Tab":
            if (isOpen) {
              closePopover();
            }
            break;

          case "a":
          case "A":
            if ((e.ctrlKey || e.metaKey) && showSelectAll && isOpen) {
              e.preventDefault();
              handleSelectAll();
            }
            break;
        }
      },
      [
        disabled,
        readonly,
        isOpen,
        navigableItems,
        inputValue,
        selectedItems.length,
        togglePopover,
        openPopover,
        closePopover,
        onChange,
        showSelectAll,
        handleSelectAll,
        showClearIcon,
        handleClear,
      ]
    );

    // Handle blur — collapse tokens when focus leaves both input container and popover
    const handleBlur = useCallback(
      (e: React.FocusEvent) => {
        const container = containerRef.current;
        if (container?.contains(e.relatedTarget as Node)) {
          return;
        }
        // Focus moved outside the input container — if the popover is not
        // open, collapse the tokens. If the popover IS open, the tokens
        // stay expanded (isOpen keeps tokensExpanded true).
        setInputFocused(false);
      },
      []
    );

    // Render children with visibility and selection state
    const renderChildren = useCallback(() => {
      let itemIndex = 0;

      const getItemProps = (element: React.ReactElement<MultiComboBoxItemProps>) => {
        const currentItemIndex = itemIndex++;
        const visibleItem = visibleItems.find((vi) => vi.originalIndex === currentItemIndex);
        const isVisible = visibleItem?.isVisible ?? true;
        const { itemValue } = getItemData(element);
        const isSelected = selectedValuesSet.has(itemValue);
        const navIndex = navigableItems.findIndex((ni) => ni.originalIndex === currentItemIndex);
        const isFocused = navIndex === focusedIndex;

        return {
          isVisible,
          selected: isSelected,
          focused: isFocused,
          tabIndex: isFocused ? 0 : -1,
          onClick: () => toggleItem(element),
        };
      };

      // When opened via "n more", show only selected items while
      // preserving group structure. Groups with no selected children are hidden.
      if (selectedOnTop) {
        const result: React.ReactElement[] = [];

        Children.forEach(children, (child) => {
          if (!isValidElement(child)) return;

          if ((child.type as { displayName?: string })?.displayName === "MultiComboBoxItemGroup") {
            const groupProps = child.props as MultiComboBoxItemGroupProps;
            const selectedGroupChildren: React.ReactElement[] = [];

            Children.forEach(groupProps.children, (groupChild) => {
              if (!isValidElement(groupChild)) return;
              const props = getItemProps(groupChild as React.ReactElement<MultiComboBoxItemProps>);
              if (props.selected) {
                selectedGroupChildren.push(
                  cloneElement(groupChild as React.ReactElement<MultiComboBoxItemProps>, props)
                );
              }
            });

            if (selectedGroupChildren.length > 0) {
              result.push(
                cloneElement(child, {
                  isVisible: true,
                  children: selectedGroupChildren,
                } as Partial<MultiComboBoxItemGroupProps>)
              );
            }
          } else {
            const props = getItemProps(child as React.ReactElement<MultiComboBoxItemProps>);
            if (props.selected) {
              result.push(
                cloneElement(child as React.ReactElement<MultiComboBoxItemProps>, props)
              );
            }
          }
        });

        return result;
      }

      return Children.map(children, (child) => {
        if (!isValidElement(child)) return child;

        if ((child.type as { displayName?: string })?.displayName === "MultiComboBoxItemGroup") {
          const groupProps = child.props as MultiComboBoxItemGroupProps;
          let hasVisibleChild = false;

          const groupChildren = Children.map(groupProps.children, (groupChild) => {
            if (!isValidElement(groupChild)) return groupChild;
            const props = getItemProps(groupChild as React.ReactElement<MultiComboBoxItemProps>);
            if (props.isVisible) hasVisibleChild = true;
            return cloneElement(groupChild as React.ReactElement<MultiComboBoxItemProps>, props);
          });

          return cloneElement(child, {
            isVisible: hasVisibleChild,
            children: groupChildren,
          } as MultiComboBoxItemGroupProps);
        }

        return cloneElement(
          child as React.ReactElement<MultiComboBoxItemProps>,
          getItemProps(child as React.ReactElement<MultiComboBoxItemProps>)
        );
      });
    }, [children, visibleItems, navigableItems, focusedIndex, selectedValuesSet, toggleItem, selectedOnTop]);

    // Handle keyboard events when focus is inside the dropdown list
    const handleListKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        const isOnSelectAll = (e.target as HTMLElement).hasAttribute("data-select-all");

        switch (e.key) {
          case "ArrowDown":
            e.preventDefault();
            if (isOnSelectAll) {
              if (navigableItems.length > 0) {
                setFocusedIndex(0);
              }
            } else if (focusedIndex < navigableItems.length - 1) {
              setFocusedIndex(focusedIndex + 1);
            }
            break;

          case "ArrowUp":
            e.preventDefault();
            if (isOnSelectAll) {
              setFocusedIndex(-1);
              inputRef.current?.focus();
            } else if (focusedIndex > 0) {
              setFocusedIndex(focusedIndex - 1);
            } else if (showSelectAll) {
              selectAllFocusedRef.current = true;
              setFocusedIndex(-1);
            } else {
              // Move focus back to input
              setFocusedIndex(-1);
            }
            break;

          case "Enter":
          case " ":
            e.preventDefault();
            if (isOnSelectAll) {
              handleSelectAll();
            } else if (focusedIndex >= 0 && focusedIndex < navigableItems.length) {
              toggleItem(navigableItems[focusedIndex].element);
            }
            break;

          case "Escape":
            e.preventDefault();
            closePopover();
            inputRef.current?.focus();
            break;

          case "Tab":
            closePopover();
            break;

          case "Home":
            e.preventDefault();
            if (showSelectAll) {
              selectAllFocusedRef.current = true;
              setFocusedIndex(-1);
            } else if (navigableItems.length > 0) {
              setFocusedIndex(0);
            }
            break;

          case "End":
            e.preventDefault();
            if (navigableItems.length > 0) {
              setFocusedIndex(navigableItems.length - 1);
            }
            break;

          case "F4":
            e.preventDefault();
            closePopover();
            inputRef.current?.focus();
            break;
        }
      },
      [focusedIndex, navigableItems, toggleItem, closePopover, showSelectAll, handleSelectAll]
    );

    // Show clear icon?
    const showClear = showClearIcon && (selectedItems.length > 0 || inputValue) && !disabled && !readonly;

    // Placeholder: only show when no tokens and no input value
    const showPlaceholder = selectedItems.length === 0;

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
              hasTokens: selectedItems.length > 0,
            }),
          )}
          onClick={() => {
            if (!disabled && !readonly) {
              inputRef.current?.focus();
            }
          }}
        >
          {/* Custom icon slot */}
          {icon && (
            <span className="flex items-center justify-center shrink-0 text-sapphire-text-tertiary">
              {icon}
            </span>
          )}

          {/* Tokens for selected items */}
          {selectedItems.length > 0 && (
            <Tokenizer
              ref={tokenizerRef}
              readonly={readonly}
              disabled={disabled}
              multiLine={tokensExpanded}
              onTokenDelete={handleTokenDelete}
              onNMoreClick={() => {
                setSelectedOnTop(true);
                openPopover();
                inputRef.current?.focus();
              }}
              className={cn(
                "shrink min-w-0 [&_[data-part='content']]:gap-1 !h-full [&_[data-part='content']]:h-full",
                tokensExpanded
                  ? "!flex-nowrap !items-center overflow-x-auto overflow-y-hidden scrollbar-none [&_[data-part='content']]:!flex-nowrap"
                  : "",
              )}
            >
              {selectedItems.map((item, idx) => (
                <Token
                  key={item.value}
                  text={item.text}
                  readonly={readonly}
                  data-testid={`token-${idx}`}
                />
              ))}
            </Tokenizer>
          )}

          {/* Text input */}
          {!readonly && (
            <input
              ref={inputRef}
              id={inputId}
              type="text"
              role="combobox"
              aria-expanded={isOpen}
              aria-haspopup="listbox"
              aria-autocomplete="list"
              aria-controls={[isOpen ? popoverId : null, accessibilityAttributes?.controls].filter(Boolean).join(" ") || undefined}
              aria-label={accessibleName}
              aria-labelledby={accessibleNameRef}
              aria-required={required}
              aria-invalid={isNegativeState || undefined}
              aria-busy={loading || undefined}
              aria-describedby={
                [
                  valueStateMessage ? messageId : null,
                  accessibleDescriptionRef,
                  accessibleDescription ? accessibleDescSpanId : null,
                ].filter(Boolean).join(" ") || undefined
              }
              name={name ? `${name}_input` : undefined}
              value={inputValue}
              placeholder={showPlaceholder ? placeholder : undefined}
              disabled={disabled}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setInputFocused(true)}
              onBlur={handleBlur}
              className={cn(
                "flex-1 h-6 bg-transparent text-sm text-sapphire-text-primary",
                "outline-none",
                "placeholder:text-sapphire-text-tertiary placeholder:italic",
                "disabled:cursor-not-allowed",
                // When tokens are present, allow input to shrink to near-zero when not typing
                selectedItems.length > 0 ? "min-w-[40px]" : "min-w-[60px]",
              )}
            />
          )}

          {/* Clear icon */}
          {showClear && (
            <ClearButton onClick={handleClear} accessibleName="Clear selection" comboBoxSize={size} />
          )}

          {/* Dropdown arrow */}
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

        {/* Hidden inputs for form submission */}
        {name && selectedItems.map((item, i) => (
          <input key={i} type="hidden" name={name} value={item.value} />
        ))}

        {/* Popover */}
        <ComboBoxPopover
          open={isOpen}
          triggerRef={containerRef as React.RefObject<HTMLElement | null>}
          hasValueState={hasValueState}
          valueStatePortalRef={setPortalTarget}
          loading={loading}
          onClose={handlePopoverClose}
          headerContent={showSelectAll && navigableItems.length > 0 ? (
            // eslint-disable-next-line jsx-a11y/no-static-element-interactions
            <div
              ref={selectAllRef}
              role="checkbox"
              data-select-all
              tabIndex={-1}
              aria-checked={selectAllState === "checked" ? true : selectAllState === "indeterminate" ? "mixed" : false}
              aria-label={t("MULTICOMBOBOX_SELECT_ALL")}
              onClick={handleSelectAll}
              onKeyDown={handleListKeyDown}
              className={cn(
                "flex items-center min-h-8 px-4 py-1.5 gap-4 text-sm cursor-pointer",
                "text-sapphire-text-primary bg-sapphire-background-primary",
                "hover:bg-sapphire-neutral-hover-background",
                "focus:bg-sapphire-neutral-hover-background",
                "transition-colors outline-none border-b border-sapphire-border-primary relative",
                "focus:after:absolute focus:after:inset-0.5 focus:after:border-2 focus:after:border-ring focus:after:rounded-sm focus:after:pointer-events-none",
              )}
            >
              <span
                className={cn(
                  "flex items-center justify-center shrink-0 size-4 rounded border border-solid transition-colors",
                  selectAllState === "checked"
                    ? "bg-sapphire-brand-background border-sapphire-brand-background text-white"
                    : selectAllState === "indeterminate"
                      ? "bg-sapphire-brand-background border-sapphire-brand-background text-white"
                      : "bg-sapphire-canvas-primary border-sapphire-border-secondary",
                )}
                aria-hidden="true"
              >
                {selectAllState === "checked" && <AcceptIcon className="size-3" />}
                {selectAllState === "indeterminate" && (
                  <span className="block w-2 h-0.5 bg-white rounded-sm" />
                )}
              </span>
              <span className="flex-1 font-medium">{t("MULTICOMBOBOX_SELECT_ALL")}</span>
            </div>
          ) : undefined}
        >
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
          <div ref={listRef} onKeyDown={handleListKeyDown}>
          {renderChildren()}
          </div>
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

        {/* Hidden accessible description */}
        {accessibleDescription && (
          <span id={accessibleDescSpanId} className="sr-only">
            {accessibleDescription}
          </span>
        )}

        {/* Screen reader result count announcement */}
        <LiveRegion message={resultAnnouncement} />
      </div>
    );
  }
