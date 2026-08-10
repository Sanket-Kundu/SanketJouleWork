import {
  useRef,
  useState,
  useEffect,
  useCallback,
  useImperativeHandle,
  Children,
} from "react";
import { useTranslation } from "react-i18next";
import { cn, subTestId } from "../../lib/utils";
import { SynchronizeIcon } from "../../icons/Synchronize";
import { CardProps, CardDesign } from "../../types/card";

export function Card({
      children,
      header,
      footer,
      toolbar,
      toolbarVisible,
      toolbarClassName,
      design = CardDesign.Default,
      interactive = false,
      loading = false,
      loadingDelay = 1000,
      accessibleName,
      accessibleNameRef,
      accessibleDescriptionRef,
      className,
      style,
      id,
      "data-testid": dataTestId,
      onMouseEnter,
      onMouseLeave,
      onMouseDown,
      onMouseUp,
      onClick,
      onFocus,
      onBlur,
      ref,
    }: CardProps) {
    const { t } = useTranslation("fx");
    const cardRef = useRef<HTMLDivElement>(null);
    const [showLoading, setShowLoading] = useState(false);

    const isJoule = design === CardDesign.Joule;
    const [pressed, setPressed] = useState(false);

    // Handle loading delay
    useEffect(() => {
      if (!loading) {
        setShowLoading(false);
        return;
      }

      if (loadingDelay <= 0) {
        setShowLoading(true);
        return;
      }

      const timer = setTimeout(() => {
        setShowLoading(true);
      }, loadingDelay);

      return () => clearTimeout(timer);
    }, [loading, loadingDelay]);

    const isNestedInteractive = useCallback(
      (target: EventTarget | null) => {
        const el = target as HTMLElement;
        if (!el || el === cardRef.current) return false;
        let node: HTMLElement | null = el;
        while (node && node !== cardRef.current) {
          const tag = node.tagName;
          if (
            tag === "BUTTON" || tag === "A" || tag === "INPUT" ||
            tag === "SELECT" || tag === "TEXTAREA" ||
            node.getAttribute("role") === "button"
          ) return true;
          node = node.parentElement;
        }
        return false;
      },
      []
    );

    // Interactive click handler — ignore clicks originating from nested interactive elements
    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!interactive) return;
        if (isNestedInteractive(e.target)) return;
        cardRef.current?.focus();
        onClick?.({ originalEvent: e, isKeyboard: false });
      },
      [interactive, isNestedInteractive, onClick]
    );

    // Mouse pressed state — only on the card surface, not nested interactives
    const handleMouseDown = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (interactive && !isNestedInteractive(e.target)) {
          setPressed(true);
        }
        onMouseDown?.(e);
      },
      [interactive, isNestedInteractive, onMouseDown]
    );

    const handleMouseUp = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        setPressed(false);
        onMouseUp?.(e);
      },
      [onMouseUp]
    );

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        setPressed(false);
        onMouseLeave?.(e);
      },
      [onMouseLeave]
    );

    // Interactive keyboard handler
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (!interactive) return;
        if (isNestedInteractive(e.target)) return;
        if (e.key === "Enter") {
          e.preventDefault();
          setPressed(true);
          onClick?.({ originalEvent: e, isKeyboard: true });
        } else if (e.key === " ") {
          e.preventDefault();
          setPressed(true);
        }
      },
      [interactive, isNestedInteractive, onClick]
    );

    const handleKeyUp = useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (!interactive) return;
        if (isNestedInteractive(e.target)) return;
        if (e.key === "Enter") {
          setPressed(false);
        } else if (e.key === " ") {
          setPressed(false);
          onClick?.({ originalEvent: e, isKeyboard: true });
        }
      },
      [interactive, isNestedInteractive, onClick]
    );

    // Expose imperative methods
    useImperativeHandle(
      ref,
      () => ({
        focus() {
          cardRef.current?.focus();
        },
        blur() {
          cardRef.current?.blur();
        },
        get nativeElement() {
          return cardRef.current;
        },
      }),
      []
    );

    // Detect no-content state
    const hasContent =
      children != null &&
      children !== false &&
      children !== "" &&
      Children.count(children) > 0;

    const card = (
      <article
        ref={cardRef}
        id={id}
        role={interactive ? "listitem" : "region"}
        tabIndex={interactive ? 0 : undefined}
        aria-label={accessibleName}
        aria-labelledby={accessibleNameRef}
        aria-describedby={accessibleDescriptionRef}
        aria-busy={loading || undefined}
        className={cn(
          "relative rounded-[8px] border border-sapphire-border-primary bg-sapphire-card-bg-primary text-sapphire-text-primary",
          "flex flex-col",
          interactive && "cursor-pointer",
          isJoule && interactive && !pressed && [
            "transition-[border-color,box-shadow] duration-200",
            "focus:outline focus:outline-2 focus:outline-sapphire-border-focus focus:outline-offset-[-2px]",
            "hover:border-brand-purple hover:shadow-[0px_0px_4px_0px_rgba(120,88,255,0.2),0px_8px_24px_0px_rgba(120,88,255,0.16),0px_24px_16px_0px_rgba(0,0,0,0.05),0px_8px_8px_0px_rgba(0,0,0,0.05),0px_4px_3px_0px_rgba(10,10,10,0.04),0px_4px_3px_0px_rgba(10,10,10,0.03)]",
          ],
          isJoule && interactive && pressed && [
            "transition-[border-color,box-shadow] duration-200",
            "outline-none",
            "border-brand-purple shadow-[0px_0px_4px_0px_rgba(93,54,255,0.5),0px_2px_20px_0px_rgba(93,54,255,0.2)]",
          ],
          !isJoule && interactive && !pressed && [
            "transition-[border-color,box-shadow] duration-200",
            "focus:outline focus:outline-2 focus:outline-sapphire-border-focus focus:outline-offset-[-2px]",
            "hover:border-sapphire-border-active hover:shadow-[0px_1px_2px_0px_rgba(10,10,10,0.25)]",
          ],
          !isJoule && interactive && pressed && [
            "transition-[border-color,box-shadow] duration-200",
            "outline-none",
            "border-sapphire-border-active shadow-none bg-sapphire-neutral-hover-background",
          ],
          !hasContent && "card--nocontent",
          !hasContent && !footer && "[&>*:first-child]:rounded-[8px]",
          className
        )}
        style={style}
        data-testid={dataTestId}
        data-part="root"
        onMouseEnter={onMouseEnter}
        onMouseLeave={interactive ? handleMouseLeave : onMouseLeave}
        onMouseDown={interactive ? handleMouseDown : onMouseDown}
        onMouseUp={interactive ? handleMouseUp : onMouseUp}
        onClick={interactive ? handleClick : undefined}
        onKeyDown={interactive ? handleKeyDown : undefined}
        onKeyUp={interactive ? handleKeyUp : undefined}
        onFocus={onFocus}
        onBlur={toolbar ? undefined : onBlur}
      >
          {header}

          {hasContent && (
            <div
              className="flex-1 relative overflow-hidden"
              role="group"
              aria-label={t("CARD_CONTENT")}
              data-part="content"
              data-testid={subTestId(dataTestId, "content")}
            >
              {children}

              {showLoading && (
                <div
                  className={cn(
                    "absolute inset-0",
                    "bg-sapphire-background-primary/80 backdrop-blur-sm",
                    "flex items-center justify-center",
                    "z-10"
                  )}
                  aria-hidden="true"
                >
                  <SynchronizeIcon className="h-8 w-8 animate-spin text-sapphire-text-tertiary" />
                </div>
              )}
            </div>
          )}

          {footer}
      </article>
    );

    if (toolbar) {
      return (
        <div
          className="relative group/card"
          data-part="card-toolbar-wrapper"
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
              onBlur?.(e);
            }
          }}
        >
          <div
            className={cn(
              "absolute bottom-full left-0 right-0 z-10 translate-y-3 flex justify-center",
              !toolbarVisible && (
                isJoule ? "invisible" : "invisible group-hover/card:visible"
              ),
            )}
            data-part="toolbar"
            data-testid={subTestId(dataTestId, "toolbar")}
          >
            <div
              className={cn(
                "inline-flex items-center justify-center gap-px p-1",
                "bg-sapphire-card-bg-primary border border-brand-purple rounded-[8px]",
                "shadow-[0px_4px_10px_0px_rgba(10,10,10,0.15),0px_2px_5px_0px_rgba(10,10,10,0.05)]",
                toolbarClassName
              )}
            >
              {toolbar}
            </div>
          </div>
          {card}
        </div>
      );
    }

    return card;
  }
