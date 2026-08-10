import React, {
  useRef,
  useCallback,
  useImperativeHandle,
} from "react";
import { cn, subTestId } from "../../lib/utils";
import { useTranslation } from "react-i18next";
import type {
  TokenInternalProps,
} from "../../types/token";
import { DeclineIcon } from "../../icons/Decline";

/**
 * Token component
 *
 * A small interactive chip representing a selected value.
 * Typically used inside a Tokenizer or MultiInput.
 * Supports selection, deletion via close icon or keyboard, and read-only mode.
 *
 * @example
 * ```tsx
 * <Token text="React" />
 * <Token text="Selected" selected />
 * <Token text="Readonly" readonly />
 * <Token text="Closable" onDelete={(e) => handleDelete(e)} />
 * ```
 */
export function Token({
  text,
  closeIcon,
  selected = false,
  readonly = false,
  singleToken = false,
  overflows = false,
  onSelect,
  onDelete,
  className,
  style,
  id,
  "data-testid": dataTestId,
  tabIndex = -1,
  ref,
}: TokenInternalProps) {
    const tokenRef = useRef<HTMLDivElement>(null);
    const { t } = useTranslation("fx");

    useImperativeHandle(
      ref,
      () => ({
        focus() {
          tokenRef.current?.focus();
        },
        blur() {
          tokenRef.current?.blur();
        },
        isFocused() {
          return document.activeElement === tokenRef.current;
        },
        get nativeElement() {
          return tokenRef.current;
        },
      }),
      [tokenRef]
    );

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (readonly) return;
        onSelect?.({
          originalEvent: e,
          isKeyboard: false,
          selected: !selected,
        });
      },
      [readonly, selected, onSelect]
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === " " || (e.ctrlKey && e.key === " ")) {
          e.preventDefault();
          if (readonly) return;
          onSelect?.({
            originalEvent: e,
            isKeyboard: true,
            selected: !selected,
          });
        } else if (e.key === "Backspace") {
          if (readonly) return;
          e.preventDefault();
          onDelete?.({
            originalEvent: e,
            isKeyboard: true,
            backSpace: true,
          });
        } else if (e.key === "Delete") {
          if (readonly) return;
          e.preventDefault();
          onDelete?.({
            originalEvent: e,
            isKeyboard: true,
            delete: true,
          });
        }
      },
      [readonly, selected, onSelect, onDelete]
    );

    const handleCloseClick = useCallback(
      (e: React.MouseEvent<HTMLSpanElement>) => {
        e.stopPropagation();
        onDelete?.({
          originalEvent: e,
          isKeyboard: false,
        });
      },
      [onDelete]
    );

    const handleCloseKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLSpanElement>) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();
          onDelete?.({
            originalEvent: e,
            isKeyboard: true,
          });
        }
      },
      [onDelete]
    );

    // Build aria-description from i18n strings
    const ariaDescription = readonly
      ? t("TOKEN_ARIA_LABEL")
      : `${t("TOKEN_ARIA_LABEL")}, ${t("TOKEN_ARIA_DELETABLE")}`;

    return (
      <div
        ref={tokenRef}
        id={id}
        role="option"
        tabIndex={tabIndex}
        aria-selected={selected}
        aria-description={ariaDescription}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={cn(
          // Base
          "bg-sapphire-canvas-primary inline-flex items-center rounded-sm border gap-1 pl-2 text-sm leading-5 font-normal transition-colors",
          "focus:outline-none focus:border-ring focus:[box-shadow:inset_0_0_0_1px_var(--ring)]",
          !selected && "focus:bg-background",
          // Readonly: symmetric padding, no gap, clip overflow; interactive: flush right for close button
          readonly ? "px-2 py-[2px] gap-0 overflow-clip" : "pr-0",
          // State classes
          selected && !readonly
            ? "bg-sapphire-chrome-button-bg-selected border-sapphire-chrome-button-fg-selected text-foreground cursor-pointer"
            : readonly
              ? "bg-sapphire-canvas-primary border-border text-foreground cursor-default"
              : "bg-sapphire-background-tertiary border-border text-foreground hover:bg-sapphire-background-quaternary hover:border-sapphire-border-secondary cursor-pointer",
          // Single token — enable truncation
          singleToken && "max-w-full",
          // Overflows — hidden
          overflows && "hidden",
          className
        )}
        style={style}
        data-testid={dataTestId}
        data-part="root"
      >
        <span
          className={cn(
            "whitespace-nowrap",
            singleToken && "overflow-hidden text-ellipsis"
          )}
          title={singleToken ? text : undefined}
          data-part="text"
        >
          {text}
        </span>
        {!readonly && (
          <span
            tabIndex={-1}
            aria-hidden="true"
            title={t("TOKEN_DELETE")}
            onClick={handleCloseClick}
            onKeyDown={handleCloseKeyDown}
            className={cn(
              "flex-shrink-0 inline-flex items-center justify-center size-6 rounded-sm cursor-pointer",
              "text-foreground!"
            )}
            data-part="close-icon"
            data-testid={subTestId(dataTestId, "close")}
          >
            {closeIcon || <DeclineIcon className="h-3 w-3" />}
          </span>
        )}
      </div>
    );
}
