import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useLayoutEffect,
  useMemo,
  useImperativeHandle,
  useId,
} from "react";
import { cn } from "../../lib/utils";
import { Input } from "./Input";
import {
  InputProps,
  InputRef,
  InputFilter,
  InputSuggestionItem,
  InputSuggestionGroup,
  InputSuggestionSelectDetail,
} from "../../types/input";
import { useTranslation } from "react-i18next";
import { ResponsivePopover } from "../responsive-popover/ResponsivePopover";
import { List } from "../list/List";
import { ListAccessibleRole, ListSeparator } from "../../types/list";

/**
 * Props for InputSuggestions component
 */
export interface InputSuggestionsProps extends Omit<InputProps, "showSuggestions" | "suggestions"> {
  /** Suggestion items (strings or objects) */
  suggestions?: (string | InputSuggestionItem | InputSuggestionGroup)[];
  /** Filter mode for suggestions */
  filter?: InputFilter | `${InputFilter}`;
  /** Disable typeahead auto-completion */
  noTypeahead?: boolean;
  /** Highlight matching text in suggestions */
  highlightMatch?: boolean;
  /** Custom suggestion item renderer */
  suggestionRenderer?: (item: InputSuggestionItem, index: number) => React.ReactNode;
  /** Called when a suggestion is selected */
  onSuggestionSelect?: (detail: InputSuggestionSelectDetail) => void;
  /** Called when suggestions popover opens */
  onSuggestionsOpen?: () => void;
  /** Called when suggestions popover closes */
  onSuggestionsClose?: () => void;
  /** Show "no suggestions" message when empty */
  showNoSuggestionsMessage?: boolean;
  /** Custom "no suggestions" message */
  noSuggestionsMessage?: string;
}

/**
 * Extended ref for InputSuggestions
 */
export interface InputSuggestionsRef extends InputRef {
  /** Open the suggestions popover */
  openSuggestions(): void;
  /** Close the suggestions popover */
  closeSuggestions(): void;
  /** Check if suggestions are open */
  isSuggestionsOpen(): boolean;
}

/**
 * Normalize suggestion items to standard format
 */
function normalizeItem(item: string | InputSuggestionItem): InputSuggestionItem {
  if (typeof item === "string") {
    return { text: item, value: item };
  }
  return { ...item, value: item.value ?? item.text };
}

/**
 * Check if item is a group
 */
function isGroup(
  item: string | InputSuggestionItem | InputSuggestionGroup
): item is InputSuggestionGroup {
  return typeof item === "object" && "headerText" in item && "items" in item;
}

/**
 * Filter items based on filter mode
 */
function filterItem(
  item: InputSuggestionItem,
  filterValue: string,
  filterMode: InputFilter | `${InputFilter}`
): boolean {
  if (!filterValue || filterMode === InputFilter.None) {
    return true;
  }

  const normalizedText = item.text.toLowerCase();
  const normalizedFilter = filterValue.toLowerCase();

  switch (filterMode) {
    case InputFilter.StartsWith:
      return normalizedText.startsWith(normalizedFilter);

    case InputFilter.Contains:
      return normalizedText.includes(normalizedFilter);

    case InputFilter.StartsWithPerTerm:
    default: {
      const words = normalizedText.split(/\s+/);
      return words.some((word) => word.startsWith(normalizedFilter));
    }
  }
}

/**
 * Highlight matching text in a string
 */
function highlightText(
  text: string,
  match: string,
  highlightClass: string = "font-semibold bg-sapphire-warning-bg"
): React.ReactNode {
  if (!match) return text;

  const lowerText = text.toLowerCase();
  const lowerMatch = match.toLowerCase();
  const index = lowerText.indexOf(lowerMatch);

  if (index === -1) return text;

  return (
    <>
      {text.slice(0, index)}
      <span className={highlightClass}>{text.slice(index, index + match.length)}</span>
      {text.slice(index + match.length)}
    </>
  );
}

/**
 * InputSuggestions component
 *
 * An Input component with autocomplete/suggestions dropdown.
 * Uses ResponsivePopover with List for the suggestions popover.
 *
 * @example
 * ```tsx
 * // Basic usage with string suggestions
 * <InputSuggestions
 *   suggestions={["Apple", "Banana", "Cherry"]}
 *   onSuggestionSelect={(d) => console.log(d.value)}
 * />
 *
 * // With object items and highlighting
 * <InputSuggestions
 *   suggestions={[
 *     { text: "Apple", value: "apple", additionalText: "Fruit" },
 *     { text: "Banana", value: "banana", additionalText: "Fruit" },
 *   ]}
 *   highlightMatch
 *   filter="Contains"
 * />
 * ```
 */
export function InputSuggestions(
    {
      suggestions = [],
      filter = InputFilter.StartsWith,
      noTypeahead = false,
      highlightMatch = false,
      suggestionRenderer,
      onSuggestionSelect,
      onSuggestionsOpen,
      onSuggestionsClose,
      showNoSuggestionsMessage = true,
      noSuggestionsMessage,

      // Pass through to Input
      value: controlledValue,
      defaultValue = "",
      onInput,
      onChange,
      onFocus,
      onBlur,
      onKeyDown,
      disabled,
      readonly,
      ref,
      ...inputProps
    }: InputSuggestionsProps & { ref?: React.Ref<InputSuggestionsRef> }
  ) {
    // i18n
    const { t } = useTranslation("fx");

    // Refs
    const inputRef = useRef<InputRef>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const popoverContentRef = useRef<HTMLDivElement>(null);

    // IDs for accessibility
    const baseId = useId();
    const listboxId = `${baseId}-listbox`;
    const optionIdPrefix = `${baseId}-option-`;

    // State
    const [internalValue, setInternalValue] = useState(defaultValue);
    const [userTypedValue, setUserTypedValue] = useState(defaultValue); // Track what user actually typed
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [hasFocus, setHasFocus] = useState(false);
    const [hasTyped, setHasTyped] = useState(false); // User has typed in this focus session
    const [dismissed, setDismissed] = useState(false); // User explicitly closed (Escape/Tab)
    const [manualOpen, setManualOpen] = useState(false); // Imperative open override
    const shouldAutocompleteRef = useRef(true); // Disabled on Backspace/Delete/Escape

    const value = controlledValue ?? internalValue;
    const isControlled = controlledValue !== undefined;

    // Use userTypedValue for filtering, not the typeahead-completed value
    const filterValue = userTypedValue;

    // Flatten and filter suggestions
    const flattenedItems = useMemo(() => {
      const result: { item: InputSuggestionItem; groupHeader?: string }[] = [];

      for (const suggestion of suggestions) {
        if (isGroup(suggestion)) {
          // Add items from group with group header reference
          for (const item of suggestion.items) {
            result.push({
              item: normalizeItem(item),
              groupHeader: suggestion.headerText,
            });
          }
        } else {
          result.push({ item: normalizeItem(suggestion) });
        }
      }

      return result;
    }, [suggestions]);

    // Filter suggestions based on what user typed (not typeahead value)
    const filteredItems = useMemo(() => {
      return flattenedItems.filter(({ item }) =>
        filterItem(item, filterValue, filter) && !item.disabled
      );
    }, [flattenedItems, filterValue, filter]);

    // Group headers for rendering
    const itemsWithHeaders = useMemo(() => {
      const result: { type: "header" | "item"; content: string | InputSuggestionItem; index?: number }[] = [];
      let lastGroup: string | undefined;
      let itemIndex = 0;

      for (const { item, groupHeader } of filteredItems) {
        if (groupHeader && groupHeader !== lastGroup) {
          result.push({ type: "header", content: groupHeader });
          lastGroup = groupHeader;
        }
        result.push({ type: "item", content: item, index: itemIndex });
        itemIndex++;
      }

      return result;
    }, [filteredItems]);

    // Should show suggestions (derived — no effect needed)
    // Suggestions open when the user starts typing, not on focus alone.
    // This matches UI5 Input behavior: hasValue && isFocused && isTyping.
    const shouldShowSuggestions =
      hasFocus &&
      hasTyped &&
      !disabled &&
      !readonly &&
      (filteredItems.length > 0 || showNoSuggestionsMessage);

    const isOpen = manualOpen || (shouldShowSuggestions && !dismissed);

    // Expose imperative methods
    useImperativeHandle(
      ref,
      () => ({
        ...inputRef.current!,
        openSuggestions: () => {
          setManualOpen(true);
          onSuggestionsOpen?.();
        },
        closeSuggestions: () => {
          setManualOpen(false);
          setDismissed(true);
          setHighlightedIndex(-1);
          onSuggestionsClose?.();
        },
        isSuggestionsOpen: () => isOpen,
      }),
      [isOpen, onSuggestionsOpen, onSuggestionsClose]
    );

    // Fire open/close callbacks when isOpen changes (no state setting — just callbacks)
    const prevOpenRef = useRef(false);
    useEffect(() => {
      if (isOpen && !prevOpenRef.current) {
        onSuggestionsOpen?.();
      } else if (!isOpen && prevOpenRef.current) {
        onSuggestionsClose?.();
      }
      prevOpenRef.current = isOpen;
    }, [isOpen, onSuggestionsOpen, onSuggestionsClose]);

    // Typeahead: compute auto-completed value and pending selection range
    const pendingSelectionRef = useRef<{ start: number; end: number } | null>(null);

    // Preview a suggestion item in the input: typed casing + selected suffix
    const previewSuggestion = useCallback(
      (item: InputSuggestionItem) => {
        const lowerTyped = filterValue.toLowerCase();
        const lowerMatch = item.text.toLowerCase();

        if (lowerMatch.startsWith(lowerTyped) && lowerMatch !== lowerTyped) {
          const completedValue = filterValue + item.text.substring(filterValue.length);
          if (!isControlled) {
            setInternalValue(completedValue);
          }
          pendingSelectionRef.current = { start: filterValue.length, end: completedValue.length };
        }
      },
      [filterValue, isControlled]
    );

    // Restore input to user-typed value (e.g. when navigating back past first item)
    const restoreTypedValue = useCallback(() => {
      if (!isControlled) {
        setInternalValue(filterValue);
      }
      pendingSelectionRef.current = null;
    }, [filterValue, isControlled]);

    useEffect(() => {
      if (noTypeahead || !shouldAutocompleteRef.current || !hasFocus || filteredItems.length === 0 || !filterValue) return;

      const firstMatch = filteredItems[0].item;
      const lowerTyped = filterValue.toLowerCase();
      const lowerMatch = firstMatch.text.toLowerCase();

      if (lowerMatch.startsWith(lowerTyped) && lowerMatch !== lowerTyped) {
        const completedValue = filterValue + firstMatch.text.substring(filterValue.length);
        if (!isControlled) {
          // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: typeahead must update the displayed value after filtering
          setInternalValue(completedValue);
        }
        pendingSelectionRef.current = { start: filterValue.length, end: completedValue.length };
      }

      // Consume the flag so autocomplete fires only once per keystroke (matches UI5)
      shouldAutocompleteRef.current = false;
    }, [filterValue, filteredItems, noTypeahead, hasFocus, isControlled]);

    // Apply pending typeahead selection after React commits the autocompleted value to the DOM
    useLayoutEffect(() => {
      const pending = pendingSelectionRef.current;
      if (!pending) return;
      pendingSelectionRef.current = null;

      const nativeInput = inputRef.current?.nativeElement;
      if (nativeInput) {
        nativeInput.setSelectionRange(pending.start, pending.end);
      }
    });

    // Scroll highlighted item into view
    useEffect(() => {
      if (highlightedIndex >= 0 && popoverContentRef.current) {
        const items = popoverContentRef.current.querySelectorAll("[data-suggestion-item]");
        const item = items[highlightedIndex] as HTMLElement;
        item?.scrollIntoView({ block: "nearest" });
      }
    }, [highlightedIndex]);

    // Handle input change
    const handleInput = useCallback(
      (newValue: string) => {
        // Track what user actually typed (for filtering)
        setUserTypedValue(newValue);
        setHasTyped(true);
        // Clear dismissal so suggestions reopen as user types
        setDismissed(false);

        if (!isControlled) {
          setInternalValue(newValue);
        }
        setHighlightedIndex(-1);
        onInput?.(newValue);
      },
      [isControlled, onInput]
    );

    // Handle focus
    const handleFocus = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        setHasFocus(true);
        setHasTyped(false);
        setDismissed(false);
        onFocus?.(e);
      },
      [onFocus]
    );

    // Handle blur
    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        // Revert to what the user actually typed (discard typeahead completion)
        if (!isControlled && internalValue !== userTypedValue) {
          setInternalValue(userTypedValue);
        }
        // Delay to allow click on suggestion
        setTimeout(() => {
          setHasFocus(false);
          setHasTyped(false);
          setHighlightedIndex(-1);
        }, 150);
        onBlur?.(e);
      },
      [onBlur, isControlled, internalValue, userTypedValue]
    );

    // Handle item selection
    const selectItem = useCallback(
      (item: InputSuggestionItem) => {
        const newValue = item.value ?? item.text;

        // Update both internal value and user typed value
        setUserTypedValue(newValue);
        if (!isControlled) {
          setInternalValue(newValue);
        }

        setDismissed(true);
        setManualOpen(false);
        setHighlightedIndex(-1);

        onInput?.(newValue);
        onSuggestionSelect?.({ item, value: newValue });

        // Return focus to input
        inputRef.current?.focus();
      },
      [isControlled, onInput, onSuggestionSelect]
    );

    // Try to accept the current typeahead as a selection.
    // Returns true if a typeahead match was accepted.
    const tryAcceptTypeahead = useCallback(() => {
      if (noTypeahead || filteredItems.length === 0) return false;

      const firstMatch = filteredItems[0].item;
      if (firstMatch.text.toLowerCase().startsWith(filterValue.toLowerCase())) {
        selectItem(firstMatch);
        return true;
      }
      return false;
    }, [noTypeahead, filteredItems, filterValue, selectItem]);

    // Dismiss the suggestions popover
    const dismissSuggestions = useCallback(() => {
      setDismissed(true);
      setManualOpen(false);
      setHighlightedIndex(-1);
    }, []);

    // Handle keyboard navigation
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        // F4 - toggle suggestions (open if closed, close if open)
        if (e.key === "F4") {
          e.preventDefault();
          if (isOpen) {
            dismissSuggestions();
            onSuggestionsClose?.();
          } else {
            setDismissed(false);
            setHasTyped(true); // Show suggestions even if user hasn't typed
          }
          onKeyDown?.(e);
          return;
        }

        // Suppress typeahead on Backspace / Delete / Escape (matches UI5)
        shouldAutocompleteRef.current =
          !noTypeahead && e.key !== "Backspace" && e.key !== "Delete" && e.key !== "Escape";

        if (!isOpen) {
          onKeyDown?.(e);
          return;
        }

        switch (e.key) {
          case "ArrowDown": {
            e.preventDefault();
            const nextIndex = highlightedIndex < filteredItems.length - 1 ? highlightedIndex + 1 : highlightedIndex;
            setHighlightedIndex(nextIndex);
            if (nextIndex >= 0 && filteredItems[nextIndex]) {
              previewSuggestion(filteredItems[nextIndex].item);
            }
            break;
          }

          case "ArrowUp": {
            e.preventDefault();
            const nextIndex = highlightedIndex > 0 ? highlightedIndex - 1 : -1;
            setHighlightedIndex(nextIndex);
            if (nextIndex >= 0 && filteredItems[nextIndex]) {
              previewSuggestion(filteredItems[nextIndex].item);
            } else {
              restoreTypedValue();
            }
            break;
          }

          case "ArrowRight": {
            const nativeInput = inputRef.current?.nativeElement;
            const hasTypeaheadSelection = nativeInput
              && nativeInput.selectionStart !== nativeInput.selectionEnd
              && nativeInput.selectionStart === filterValue.length;
            if (hasTypeaheadSelection && tryAcceptTypeahead()) {
              e.preventDefault();
            }
            break;
          }

          case "Enter":
            if (highlightedIndex >= 0 && filteredItems[highlightedIndex]) {
              e.preventDefault();
              selectItem(filteredItems[highlightedIndex].item);
            } else if (tryAcceptTypeahead()) {
              e.preventDefault();
            }
            break;

          case "Escape":
            e.preventDefault();
            dismissSuggestions();
            onSuggestionsClose?.();
            break;

          case "Tab":
            dismissSuggestions();
            break;
        }

        onKeyDown?.(e);
      },
      [isOpen, highlightedIndex, filteredItems, selectItem, onKeyDown, onSuggestionsClose, noTypeahead, filterValue, previewSuggestion, restoreTypedValue, tryAcceptTypeahead, dismissSuggestions]
    );

    // Handle item click
    const handleItemClick = useCallback(
      (item: InputSuggestionItem) => (e: React.MouseEvent) => {
        e.preventDefault();
        selectItem(item);
      },
      [selectItem]
    );

    // Sync close when ResponsivePopover closes itself (click-outside, etc.)
    const handlePopoverClose = useCallback(() => {
      dismissSuggestions();
    }, [dismissSuggestions]);

    // Screen reader announcement
    const srAnnouncement = useMemo(() => {
      if (!isOpen) return "";
      if (filteredItems.length === 0) return t("INPUT_SUGGESTIONS_NONE");
      if (filteredItems.length === 1) return t("INPUT_SUGGESTIONS_ONE");
      return t("INPUT_SUGGESTIONS_AVAILABLE", { count: filteredItems.length });
    }, [isOpen, filteredItems.length, t]);

    // Compute active descendant ID for aria-activedescendant
    const activeDescendantId =
      isOpen && highlightedIndex >= 0 ? `${optionIdPrefix}${highlightedIndex}` : undefined;

    // Render suggestion item content
    const renderItem = (item: InputSuggestionItem, index: number) => {
      if (suggestionRenderer) {
        return suggestionRenderer(item, index);
      }

      return (
        <div className="flex items-center gap-2 w-full">
          {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
          <div className="flex-1 min-w-0">
            <div className="truncate">
              {highlightMatch ? highlightText(item.text, filterValue) : item.text}
            </div>
            {item.additionalText && (
              <div className="text-xs text-sapphire-text-tertiary truncate">
                {item.additionalText}
              </div>
            )}
          </div>
        </div>
      );
    };

    const noSuggestionsText = noSuggestionsMessage ?? t("INPUT_SUGGESTIONS_NONE");

    return (
      <div ref={containerRef} className="relative w-full">
        <Input
          ref={inputRef}
          value={value}
          onInput={handleInput}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          readonly={readonly}
          accessibilityAttributes={{
            expanded: isOpen || undefined,
            hasPopup: "listbox",
            autoComplete: "list",
            controls: isOpen ? listboxId : undefined,
            activeDescendant: activeDescendantId,
          }}
          {...inputProps}
        />

        {/* Screen reader announcement */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {srAnnouncement}
        </div>

        {/* Suggestions popover */}
        {isOpen && (
          <ResponsivePopover
            open={isOpen}
            opener={containerRef}
            placement="Bottom"
            horizontalAlign="Stretch"
            hideArrow
            preventInitialFocus
            preventFocusRestore
            noPadding
            contentOnlyOnDesktop
            onClose={handlePopoverClose}
          >
            <div ref={popoverContentRef}>
              {filteredItems.length === 0 ? (
                <div className="px-4 py-2 text-sm text-sapphire-text-tertiary">
                  {noSuggestionsText}
                </div>
              ) : (
                <List
                  id={listboxId}
                  accessibleRole={ListAccessibleRole.ListBox}
                  separators={ListSeparator.None}
                >
                {itemsWithHeaders.map((entry, idx) => {
                  if (entry.type === "header") {
                    return (
                      <li
                        key={`header-${idx}`}
                        className="px-4 py-1.5 text-xs font-semibold text-sapphire-text-tertiary uppercase tracking-wide"
                        aria-hidden="true"
                      >
                        {entry.content as string}
                      </li>
                    );
                  }

                  const item = entry.content as InputSuggestionItem;
                  const itemIndex = entry.index!;
                  const isHighlighted = itemIndex === highlightedIndex;

                  return (
                    <li
                      key={`item-${itemIndex}`}
                      id={`${optionIdPrefix}${itemIndex}`}
                      data-suggestion-item
                      role="option"
                      aria-selected={isHighlighted}
                      className={cn(
                        "flex items-center min-h-[2.5rem] px-4 text-sm cursor-pointer",
                        "bg-sapphire-canvas-primary text-sapphire-text-primary",
                        "transition-colors",
                        "hover:bg-sapphire-background-tertiary",
                        isHighlighted && "bg-sapphire-background-tertiary"
                      )}
                      onClick={handleItemClick(item)}
                      onMouseEnter={() => setHighlightedIndex(itemIndex)}
                    >
                      {renderItem(item, itemIndex)}
                    </li>
                  );
                })}
              </List>
            )}
          </div>
        </ResponsivePopover>
        )}
      </div>
    );
  }
