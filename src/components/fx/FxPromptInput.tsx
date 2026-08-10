import React, {
  useRef,
  useImperativeHandle,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { cn, subTestId } from "../../lib/utils";
import { AddIcon } from "../../icons/Add";
import { PaperPlaneIcon } from "../../icons/PaperPlane";
import { MicrophoneIcon } from "../../icons/Microphone";
import { AudioWaveform } from "lucide-react";
import { Button } from "../button/Button";
import { ButtonRef } from "../../types/button";
import { TagExploration as Tag } from "../tag-exploration/TagExploration";
import { Menu } from "../menu/Menu";
import {
  FxPromptInputProps,
  FxTypeaheadSuggestion,
} from "../../types/fx";
import { useFxLayoutContext } from "./FxLayout";
import { useTranslation } from "react-i18next";

/**
 * FxPromptInput - AI prompt input with typeahead and actions
 *
 * Matches the fx-components FxPromptInput web component API and design.
 * Supports oneline mode (single-line with ghost text) and multiline mode (textarea with toolbar).
 *
 * @example
 * ```tsx
 * <FxPromptInput
 *   placeholder="Ask me anything..."
 *   onSubmit={({ value }) => sendMessage(value)}
 *   onTypeaheadRequest={async ({ value, requestId }) => fetchSuggestions(value)}
 * />
 * ```
 */
export function FxPromptInput({
  value: controlledValue,
  placeholder,
  disabled = false,
  statusMessage,
  disclaimerMessage,
  showDictate = true,
  showVoice = true,
  mode: explicitMode,
  typeaheadEnabled = true,
  maxSuggestions = 5,
  debounceMs = 150,
  actions,
  contextItems,
  toolbarButtons,
  onSubmit,
  onLiveChange,
  onPlusPress,
  onDictatePress,
  onVoicePress,
  onTypeaheadRequest,
  onActionSelect: _onActionSelect,
  onContextItemRemove,
  className,
  style,
  ref,
  "data-testid": dataTestId,
}: FxPromptInputProps) {
    const { t } = useTranslation("fx");
    const effectivePlaceholder = placeholder ?? t("FX_TYPE_A_MESSAGE");
    // Refs
    const inputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const plusButtonRef = useRef<ButtonRef>(null);

    // Internal state
    const [internalValue, setInternalValue] = useState("");
    const [actionsMenuOpen, setActionsMenuOpen] = useState(false);
    const [suggestions, setSuggestions] = useState<FxTypeaheadSuggestion[]>([]);
    const [suggestionsVisible, setSuggestionsVisible] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [suggestionsDismissed, setSuggestionsDismissed] = useState(false);
    const [requestIdCounter, setRequestIdCounter] = useState(0);

    // Get layout context for automatic mode
    const layoutContext = useFxLayoutContext();
    const contextMode = layoutContext?.inputMode;

    // Effective mode: explicit prop > context > default "oneline"
    const effectiveMode = explicitMode ?? contextMode ?? "oneline";
    const isMultiline = effectiveMode === "multiline";

    // Controlled/uncontrolled value
    const value = controlledValue ?? internalValue;
    const hasValue = value.trim().length > 0;

    // Visible suggestions (limited by maxSuggestions)
    const visibleSuggestions = useMemo(
      () => suggestions.slice(0, maxSuggestions),
      [suggestions, maxSuggestions]
    );

    // Current completion text (for ghost text in oneline mode)
    const currentCompletion = useMemo(() => {
      if (!suggestionsVisible || visibleSuggestions.length === 0) return "";
      const selected = visibleSuggestions[selectedIndex];
      return selected?.text ?? "";
    }, [suggestionsVisible, visibleSuggestions, selectedIndex]);


    // Imperative API
    useImperativeHandle(ref, () => ({
      focus: () => {
        if (isMultiline) {
          textareaRef.current?.focus();
        } else {
          inputRef.current?.focus();
        }
      },
      clear: () => {
        setInternalValue("");
        setSuggestions([]);
        setSuggestionsVisible(false);
        onLiveChange?.({ value: "" });
      },
      getValue: () => value,
      setValue: (v: string) => {
        setInternalValue(v);
        onLiveChange?.({ value: v });
      },
      get nativeElement() { return containerRef.current; },
      getNativeElement: () => containerRef.current,
      setSuggestions: (newSuggestions: FxTypeaheadSuggestion[], requestId: number) => {
        // Ignore stale responses
        if (requestId < requestIdCounter - 1) return;
        setSuggestions(newSuggestions);
        setSuggestionsVisible(newSuggestions.length > 0 && !suggestionsDismissed);
        setSelectedIndex(0);
      },
    }));

    // Handle value change
    const handleChange = useCallback(
      (newValue: string) => {
        setInternalValue(newValue);
        setSuggestionsDismissed(false); // Reset dismissed state on new input
        onLiveChange?.({ value: newValue });
      },
      [onLiveChange]
    );

    // Handle submit
    const handleSubmit = useCallback(() => {
      if (hasValue && !disabled) {
        onSubmit?.({ value: value.trim() });
        setInternalValue("");
        setSuggestions([]);
        setSuggestionsVisible(false);
      }
    }, [hasValue, value, disabled, onSubmit]);

    // Accept selected suggestion
    const acceptSuggestion = useCallback(() => {
      if (!suggestionsVisible || visibleSuggestions.length === 0) return false;
      const selected = visibleSuggestions[selectedIndex];
      if (!selected) return false;

      const newValue = value + selected.text;
      setInternalValue(newValue);
      onLiveChange?.({ value: newValue });
      setSuggestionsVisible(false);
      setSuggestions([]);
      return true;
    }, [suggestionsVisible, visibleSuggestions, selectedIndex, value, onLiveChange]);

    // Handle key down
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        // Tab: Accept suggestion
        if (e.key === "Tab" && suggestionsVisible && visibleSuggestions.length > 0) {
          e.preventDefault();
          acceptSuggestion();
          return;
        }

        // Arrow navigation for suggestions
        if (suggestionsVisible && visibleSuggestions.length > 0) {
          if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex((prev) =>
              prev <= 0 ? visibleSuggestions.length - 1 : prev - 1
            );
            return;
          }
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((prev) =>
              prev >= visibleSuggestions.length - 1 ? 0 : prev + 1
            );
            return;
          }
        }

        // Escape: Dismiss suggestions
        if (e.key === "Escape") {
          if (suggestionsVisible) {
            e.preventDefault();
            setSuggestionsVisible(false);
            setSuggestionsDismissed(true);
            return;
          }
        }

        // Enter: Submit (without shift in multiline)
        if (e.key === "Enter" && (!isMultiline || !e.shiftKey)) {
          e.preventDefault();
          handleSubmit();
        }
      },
      [
        suggestionsVisible,
        visibleSuggestions,
        acceptSuggestion,
        isMultiline,
        handleSubmit,
      ]
    );

    // Handle suggestion click
    const handleSuggestionClick = useCallback(
      (index: number) => {
        setSelectedIndex(index);
        const selected = visibleSuggestions[index];
        if (!selected) return;

        const newValue = value + selected.text;
        setInternalValue(newValue);
        onLiveChange?.({ value: newValue });
        setSuggestionsVisible(false);
        setSuggestions([]);
      },
      [visibleSuggestions, value, onLiveChange]
    );

    // Typeahead effect
    useEffect(() => {
      if (!typeaheadEnabled || !value.trim() || !onTypeaheadRequest || suggestionsDismissed) {
        if (suggestions.length > 0) {
          setSuggestions([]);
        }
        if (suggestionsVisible) {
          setSuggestionsVisible(false);
        }
        return;
      }

      const controller = new AbortController();
      const currentRequestId = requestIdCounter + 1;
      setRequestIdCounter(currentRequestId);

      const timeoutId = setTimeout(async () => {
        try {
          const results = await onTypeaheadRequest({
            value,
            requestId: currentRequestId,
            signal: controller.signal,
          });
          if (results && Array.isArray(results)) {
            setSuggestions(results);
            setSuggestionsVisible(results.length > 0);
            setSelectedIndex(0);
          }
        } catch {
          // Ignore abort errors
        }
      }, debounceMs);

      return () => {
        clearTimeout(timeoutId);
        controller.abort();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, typeaheadEnabled, onTypeaheadRequest, debounceMs, suggestionsDismissed]);

    // Render left buttons (plus button for actions)
    const renderLeftButtons = () => {
      if (!actions && !onPlusPress) return null;

      return (
        <div className="flex shrink-0">
          <Button
            ref={plusButtonRef}
            design="Neutral"
            iconOnly
            icon={<AddIcon className="h-4 w-4" />}
            onClick={() => {
              if (actions) {
                setActionsMenuOpen(true);
              }
              onPlusPress?.();
            }}
            disabled={disabled}
            tooltip={t("FX_ADD")}
            className="h-7 w-7 bg-muted hover:border-sapphire-prompt-accent text-sapphire-prompt-accent"
            data-testid={subTestId(dataTestId, "add")}
          />
          {actions && (
            <Menu
              open={actionsMenuOpen}
              opener={plusButtonRef.current?.nativeElement}
              onClose={() => setActionsMenuOpen(false)}
              placement="top-start"
            >
              {actions}
            </Menu>
          )}
        </div>
      );
    };

    // Render right buttons (send when hasValue, dictate/voice when empty)
    const renderRightButtons = () => {
      return (
        <div className="flex shrink-0 gap-1">
          {hasValue ? (
            <Button
              design="Neutral"
              iconOnly
              icon={<PaperPlaneIcon className="h-4 w-4" />}
              onClick={handleSubmit}
              disabled={disabled}
              tooltip={t("FX_SEND")}
              className="h-7 w-7 bg-muted hover:border-sapphire-prompt-accent text-sapphire-prompt-accent"
              data-testid={subTestId(dataTestId, "send")}
            />
          ) : (
            <>
              {showDictate && (
                <Button
                  design="Tertiary"
                  iconOnly
                  icon={<MicrophoneIcon className="h-4 w-4" />}
                  onClick={onDictatePress}
                  disabled={disabled}
                  tooltip={t("FX_DICTATE")}
                  className="h-7 w-7 text-sapphire-prompt-accent"
                  data-testid={subTestId(dataTestId, "dictate")}
                />
              )}
              {showVoice && (
                <Button
                  design="Tertiary"
                  iconOnly
                  icon={<AudioWaveform className="h-4 w-4" />}
                  onClick={onVoicePress}
                  disabled={disabled}
                  tooltip={t("FX_VOICE")}
                  className="h-7 w-7 text-sapphire-prompt-accent"
                  data-testid={subTestId(dataTestId, "voice")}
                />
              )}
            </>
          )}
        </div>
      );
    };

    // Render context items (chips like "Space" with X button)
    const renderContextItems = () => {
      if (!contextItems || contextItems.length === 0) return null;

      return (
        <div className="flex items-center gap-1.5 shrink-0">
          {contextItems.map((item) => (
            <Tag
              key={item.id}
              design="Neutral"
              size="S"
              hideStateIcon
              className="text-sapphire-prompt-accent"
              icon={item.icon ? (
                <span className="flex items-center justify-center h-3.5 w-3.5">
                  {item.icon}
                </span>
              ) : undefined}
              onClose={item.removable !== false && onContextItemRemove
                ? () => onContextItemRemove({ item })
                : undefined
              }
              data-testid={subTestId(dataTestId, `context-${item.id}`)}
            >
              {item.label}
            </Tag>
          ))}
        </div>
      );
    };

    // Render typeahead suggestions (pills above input)
    const renderSuggestions = () => {
      if (!suggestionsVisible || visibleSuggestions.length === 0) return null;

      return (
        <div className="relative flex items-end mb-2 min-h-10">
          {/* Anchor text (hidden) for alignment - only in oneline mode */}
          {!isMultiline && (
            <div
              className="invisible whitespace-pre text-sm"
              style={{ paddingLeft: "3.5rem" }}
            >
              {value}
            </div>
          )}
          {/* Suggestion pills */}
          <div
            className="flex flex-col-reverse gap-1.5"
            style={{ marginLeft: isMultiline ? 0 : "-1.2rem", maxWidth: "calc(100% - 4rem)" }}
          >
            {visibleSuggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                className={cn(
                  "inline-flex items-center px-3 py-1.5 text-sm rounded-lg cursor-pointer transition-all",
                  "whitespace-nowrap max-w-[200px] overflow-hidden text-ellipsis",
                  "border bg-background"
                )}
                style={{
                  borderColor: index === selectedIndex
                    ? "var(--prompt-accent-muted)"
                    : "color-mix(in srgb, var(--prompt-accent-muted) 50%, transparent)",
                  boxShadow: index === selectedIndex
                    ? "0 0 0 2px color-mix(in srgb, var(--prompt-accent-subtle) 50%, transparent)"
                    : undefined,
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSuggestionClick(index);
                }}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                {suggestion.label ?? suggestion.text}
              </button>
            ))}
          </div>
        </div>
      );
    };

    return (
      <div
        ref={containerRef}
        className={cn(
          "w-full relative",
          disabled && "opacity-60 pointer-events-none",
          className
        )}
        style={style}
        data-testid={dataTestId}
      >
        {/* Status message above input */}
        {statusMessage && (
          <div
            className="px-4 pt-2 pb-5 text-sm rounded-t-lg relative z-[1] -mb-3 animate-in fade-in duration-500 bg-sapphire-info-bg text-sapphire-text-tertiary"
          >
            {statusMessage}
          </div>
        )}

        {/* Typeahead suggestions */}
        {renderSuggestions()}

        {/* Main input container with gradient border and shadow */}
        <div
          className="fx-prompt-input relative rounded-lg bg-card"
          style={{
            // Shadow on left, right, bottom - most pronounced at bottom
            boxShadow: `
              -3px 0 8px -3px color-mix(in srgb, var(--prompt-accent-subtle) 20%, transparent),
              3px 0 8px -3px color-mix(in srgb, var(--prompt-accent-subtle) 20%, transparent),
              0 4px 12px -2px color-mix(in srgb, var(--prompt-accent-muted) 30%, transparent)
            `,
          }}
        >
          {/* Gradient border overlay - blue to purple */}
          <div
            className="absolute inset-0 rounded-lg pointer-events-none"
            style={{
              padding: "1.5px",
              background: "linear-gradient(to right, color-mix(in srgb, var(--color-brand-blue) 60%, transparent), color-mix(in srgb, var(--color-brand-purple) 60%, transparent))",
              WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
          />

          {isMultiline ? (
            // Multiline mode: textarea with toolbar below
            <div className="flex flex-col p-3">
              {/* Textarea wrapper */}
              <div className="flex-1 min-w-0 mb-2">
                <textarea
                  ref={textareaRef}
                  value={value}
                  onChange={(e) => handleChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={effectivePlaceholder}
                  disabled={disabled}
                  rows={1}
                  className={cn(
                    "w-full bg-transparent border-none outline-none resize-none text-base min-h-[2rem]",
                    "placeholder:text-sapphire-text-tertiary placeholder:italic placeholder:font-normal focus:ring-0 focus:outline-none"
                  )}
                  style={{
                    boxShadow: "none",
                  }}
                />
              </div>
              {/* Toolbar */}
              <div className="flex items-center gap-1.5">
                {renderLeftButtons()}
                {renderContextItems()}
                {toolbarButtons}
                <div className="flex-1" /> {/* Spacer */}
                {renderRightButtons()}
              </div>
            </div>
          ) : (
            // Oneline mode: two rows - input on top, buttons below
            <div className="flex flex-col p-3">
              {/* Input row */}
              <div className="flex-1 min-w-0 relative mb-2">
                {/* Ghost text overlay for inline completion */}
                {currentCompletion && (
                  <div
                    className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none flex items-center overflow-hidden text-sm"
                  >
                    <span className="invisible whitespace-pre">{value}</span>
                    <span className="text-sapphire-text-tertiary whitespace-pre overflow-hidden text-ellipsis">
                      {currentCompletion}
                    </span>
                  </div>
                )}
                <input
                  ref={inputRef}
                  type="text"
                  value={value}
                  onChange={(e) => handleChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={effectivePlaceholder}
                  disabled={disabled}
                  className={cn(
                    "w-full bg-transparent border-none outline-none text-base h-6",
                    "placeholder:text-sapphire-text-tertiary placeholder:italic placeholder:font-normal"
                  )}
                />
              </div>
              {/* Button row */}
              <div className="flex items-center gap-1.5">
                {renderLeftButtons()}
                {renderContextItems()}
                {toolbarButtons}
                <div className="flex-1" /> {/* Spacer */}
                {renderRightButtons()}
              </div>
            </div>
          )}
        </div>

        {/* Disclaimer message below input */}
        {disclaimerMessage && (
          <div
            className="text-center text-xs leading-4 mt-4 text-secondary-foreground"
            style={{ letterSpacing: "0.4px" }}
          >
            {disclaimerMessage}
          </div>
        )}
      </div>
    );
}
