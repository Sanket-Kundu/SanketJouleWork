import React, {
  useRef,
  useImperativeHandle,
  useState,
  useCallback,
  useId,
} from "react";
import { cn, cva, subTestId } from "../../lib/utils";
import { SlimArrowDownIcon } from "../../icons/SlimArrowDown";
import { Loader2 } from "lucide-react";
import { SplitButtonProps } from "../../types/split-button";
import { ButtonDesign } from "../../types/button";
import { useTranslation } from "react-i18next";
import "../button/Button.css";
import "./SplitButton.css";

// ── Key helpers ──────────────────────────────────────────────────────────────

function isSpace(e: React.KeyboardEvent) {
  return e.key === " " || e.key === "Spacebar";
}
function isEnter(e: React.KeyboardEvent) {
  return e.key === "Enter";
}
function isDown(e: React.KeyboardEvent) {
  return e.key === "ArrowDown" && !e.altKey;
}
function isUp(e: React.KeyboardEvent) {
  return e.key === "ArrowUp" && !e.altKey;
}
function isDownAlt(e: React.KeyboardEvent) {
  return e.key === "ArrowDown" && e.altKey;
}
function isUpAlt(e: React.KeyboardEvent) {
  return e.key === "ArrowUp" && e.altKey;
}
function isF4(e: React.KeyboardEvent) {
  return e.key === "F4";
}
function isShift(e: React.KeyboardEvent) {
  return e.key === "Shift";
}
function isEscape(e: React.KeyboardEvent) {
  return e.key === "Escape";
}
function isTab(e: React.KeyboardEvent) {
  return e.key === "Tab";
}

function isArrowKeyAction(e: React.KeyboardEvent): boolean {
  return isDown(e) || isUp(e) || isDownAlt(e) || isUpAlt(e) || isF4(e);
}

function isDefaultAction(e: React.KeyboardEvent): boolean {
  return isSpace(e) || isEnter(e);
}

// ── Container CVA ────────────────────────────────────────────────────────────

const containerVariants = cva(
  [
    "inline-flex relative group",
    "border",
  ],
  {
    variants: {
      design: {
        [ButtonDesign.Secondary]: "bg-transparent border-sapphire-brand-foreground",
        [ButtonDesign.Primary]: "bg-sapphire-brand-background border-sapphire-brand-background",
        [ButtonDesign.PrimaryJoule]: "bg-sapphire-joule-background border-sapphire-joule-background",
        [ButtonDesign.SecondaryJoule]: "bg-transparent border-sapphire-joule-foreground",
        [ButtonDesign.Neutral]: "bg-transparent border-sapphire-neutral-foreground-muted",
        [ButtonDesign.SecondaryNeutral]: "bg-transparent border-transparent",
        [ButtonDesign.TertiaryNeutral]: "bg-transparent border-transparent",
        [ButtonDesign.Tertiary]: "bg-transparent border-transparent",
        [ButtonDesign.TertiaryJoule]: "bg-transparent border-transparent",
      },
    },
    defaultVariants: {
      design: ButtonDesign.Secondary,
    },
  }
);

// ── Text color per design ────────────────────────────────────────────────────

const textColorClass: Record<string, string> = {
  [ButtonDesign.Secondary]: "text-sapphire-brand-foreground",
  [ButtonDesign.Primary]: "text-sapphire-neutral-foreground-white",
  [ButtonDesign.PrimaryJoule]: "text-sapphire-neutral-foreground-white",
  [ButtonDesign.SecondaryJoule]: "text-sapphire-joule-foreground",
  [ButtonDesign.Neutral]: "text-sapphire-neutral-foreground-black",
  [ButtonDesign.SecondaryNeutral]: "text-sapphire-neutral-foreground-black",
  [ButtonDesign.TertiaryNeutral]: "text-sapphire-neutral-foreground-muted",
  [ButtonDesign.Tertiary]: "text-sapphire-brand-foreground",
  [ButtonDesign.TertiaryJoule]: "text-sapphire-joule-foreground",
};

// ── Text button hover per design ─────────────────────────────────────────────

const textBtnHoverClass: Record<string, string> = {
  [ButtonDesign.Secondary]: "hover:bg-sapphire-neutral-hover-background hover:z-10",
  [ButtonDesign.Primary]: "hover:bg-sapphire-brand-hover-background hover:z-10",
  [ButtonDesign.PrimaryJoule]: "hover:bg-sapphire-joule-hover-background hover:z-10",
  [ButtonDesign.SecondaryJoule]: "hover:bg-sapphire-neutral-hover-background hover:z-10",
  [ButtonDesign.Neutral]: "hover:bg-sapphire-neutral-hover-background hover:text-sapphire-neutral-foreground-black hover:z-10",
  [ButtonDesign.SecondaryNeutral]: "hover:bg-sapphire-neutral-hover-background hover:z-10",
  [ButtonDesign.TertiaryNeutral]: "hover:text-sapphire-neutral-foreground-black hover:z-10",
  [ButtonDesign.Tertiary]: "hover:bg-sapphire-neutral-hover-background hover:z-10",
  [ButtonDesign.TertiaryJoule]: "hover:bg-sapphire-neutral-hover-background hover:z-10",
};

// ── Text button active per design ────────────────────────────────────────────

const textBtnActiveClass: Record<string, string> = {
  [ButtonDesign.Secondary]: "bg-sapphire-neutral-pressed-background text-sapphire-brand-pressed-foreground z-10",
  [ButtonDesign.Primary]: "bg-sapphire-brand-pressed-background text-sapphire-neutral-foreground-white z-10",
  [ButtonDesign.PrimaryJoule]: "bg-sapphire-joule-pressed-background text-sapphire-neutral-foreground-white z-10",
  [ButtonDesign.SecondaryJoule]: "bg-sapphire-neutral-pressed-background text-sapphire-joule-pressed-foreground z-10",
  [ButtonDesign.Neutral]: "bg-sapphire-neutral-pressed-background text-sapphire-neutral-foreground-black z-10",
  [ButtonDesign.SecondaryNeutral]: "bg-sapphire-neutral-pressed-background text-sapphire-neutral-foreground-black z-10",
  [ButtonDesign.TertiaryNeutral]: "text-sapphire-neutral-foreground-black z-10",
  [ButtonDesign.Tertiary]: "bg-sapphire-neutral-pressed-background text-sapphire-brand-pressed-foreground z-10",
  [ButtonDesign.TertiaryJoule]: "bg-sapphire-neutral-pressed-background text-sapphire-joule-pressed-foreground z-10",
};

// ── Arrow button hover per design ────────────────────────────────────────────

const arrowBtnHoverClass: Record<string, string> = {
  [ButtonDesign.Secondary]: "hover:bg-sapphire-neutral-hover-background hover:z-10",
  [ButtonDesign.Primary]: "hover:bg-sapphire-brand-hover-background hover:z-10",
  [ButtonDesign.PrimaryJoule]: "hover:bg-sapphire-joule-hover-background hover:z-10",
  [ButtonDesign.SecondaryJoule]: "hover:bg-sapphire-neutral-hover-background hover:z-10",
  [ButtonDesign.Neutral]: "hover:bg-sapphire-neutral-hover-background hover:text-sapphire-neutral-foreground-black hover:z-10",
  [ButtonDesign.SecondaryNeutral]: "hover:bg-sapphire-neutral-hover-background hover:z-10",
  [ButtonDesign.TertiaryNeutral]: "hover:text-sapphire-neutral-foreground-black hover:z-10",
  [ButtonDesign.Tertiary]: "hover:bg-sapphire-neutral-hover-background hover:z-10",
  [ButtonDesign.TertiaryJoule]: "hover:bg-sapphire-neutral-hover-background hover:z-10",
};

// ── Arrow button active per design ───────────────────────────────────────────

const arrowBtnActiveClass: Record<string, string> = {
  [ButtonDesign.Secondary]: "bg-sapphire-brand-toggle-background text-sapphire-brand-foreground z-10",
  [ButtonDesign.Primary]: "bg-sapphire-brand-hover-background text-sapphire-neutral-foreground-white z-10",
  [ButtonDesign.PrimaryJoule]: "bg-sapphire-joule-hover-background text-sapphire-neutral-foreground-white z-10",
  [ButtonDesign.SecondaryJoule]: "bg-sapphire-joule-background-area text-sapphire-joule-foreground z-10",
  [ButtonDesign.Neutral]: "bg-sapphire-neutral-pressed-background text-sapphire-neutral-foreground-black z-10",
  [ButtonDesign.SecondaryNeutral]: "bg-sapphire-brand-toggle-background text-sapphire-neutral-foreground-black z-10",
  [ButtonDesign.TertiaryNeutral]: "text-sapphire-neutral-foreground-black z-10",
  [ButtonDesign.Tertiary]: "bg-sapphire-brand-toggle-background text-sapphire-brand-foreground z-10",
  [ButtonDesign.TertiaryJoule]: "bg-sapphire-joule-background-area text-sapphire-joule-foreground z-10",
};

// ── Arrow button active hover per design ────────────────────────────────────
// Matches ToggleButton pressed=true hover styles per variant

const arrowBtnActiveHoverClass: Record<string, string> = {
  [ButtonDesign.Secondary]: "hover:bg-sapphire-brand-toggle-hover-background hover:z-10",
  [ButtonDesign.Primary]: "hover:bg-blue-800 hover:z-10",
  [ButtonDesign.PrimaryJoule]: "hover:bg-purple-800 hover:z-10",
  [ButtonDesign.SecondaryJoule]: "hover:bg-sapphire-joule-background-light hover:border-sapphire-border-toggle hover:z-10",
  [ButtonDesign.Neutral]: "hover:bg-sapphire-neutral-hover-background hover:z-10",
  [ButtonDesign.SecondaryNeutral]: "hover:bg-sapphire-brand-toggle-hover-background hover:z-10",
  [ButtonDesign.TertiaryNeutral]: "hover:text-sapphire-neutral-foreground-black hover:z-10",
  [ButtonDesign.Tertiary]: "hover:bg-sapphire-brand-toggle-hover-background hover:z-10",
  [ButtonDesign.TertiaryJoule]: "hover:bg-sapphire-joule-background-light hover:border-sapphire-border-toggle hover:z-10",
};

// ── Separator color per design ───────────────────────────────────────────────

const separatorColor: Record<string, string> = {
  [ButtonDesign.Secondary]: "bg-sapphire-brand-foreground",
  [ButtonDesign.Primary]: "bg-sapphire-neutral-foreground-white",
  [ButtonDesign.PrimaryJoule]: "bg-sapphire-neutral-foreground-white",
  [ButtonDesign.SecondaryJoule]: "bg-sapphire-joule-foreground",
  [ButtonDesign.Neutral]: "bg-sapphire-neutral-foreground-black",
  [ButtonDesign.SecondaryNeutral]: "bg-sapphire-neutral-foreground-black",
  [ButtonDesign.TertiaryNeutral]: "bg-sapphire-neutral-foreground-muted",
  [ButtonDesign.Tertiary]: "bg-sapphire-brand-foreground",
  [ButtonDesign.TertiaryJoule]: "bg-sapphire-joule-foreground",
};

// ── Designs that show a separator line ────────────────────────────────────────

const separatorDesigns = new Set<string>([
  ButtonDesign.Secondary,
  ButtonDesign.SecondaryJoule,
  ButtonDesign.Neutral,
]);

// ── Borderless designs (full rounding on hover/active) ───────────────────────

const borderlessDesigns = new Set<string>([
  ButtonDesign.Tertiary,
  ButtonDesign.TertiaryJoule,
  ButtonDesign.TertiaryNeutral,
  ButtonDesign.SecondaryNeutral,
]);

// ── Size-dependent class lookups ─────────────────────────────────────────────

const focusSizeClass: Record<string, string> = {
  Large: "split-btn-focus-lg",
  Medium: "split-btn-focus-md",
  Small: "split-btn-focus-sm",
};

const innerSizeClassMap: Record<string, string> = {
  Large: "split-btn-inner-lg",
  Medium: "split-btn-inner-md",
  Small: "split-btn-inner-sm",
};

const hoverRoundingMap: Record<string, string> = {
  Large: "hover:rounded-lg",
  Medium: "hover:rounded",
  Small: "hover:rounded",
};

const activeRoundingMap: Record<string, string> = {
  Large: "rounded-lg",
  Medium: "rounded",
  Small: "rounded",
};

// ── Component ────────────────────────────────────────────────────────────────

export function SplitButton({
  text,
  icon,
  endIcon,
  design = ButtonDesign.Secondary,
  size = "Large",
  disabled = false,
  loading = false,
  activeArrowButton: activeArrowButtonProp = false,
  accessibleName,
  accessibilityAttributes,
  onClick,
  onArrowClick,
  className,
  style,
  id: idProp,
  ref,
  "data-testid": dataTestId,
}: SplitButtonProps) {
    const autoId = useId();
    const id = idProp || autoId;
    const { t } = useTranslation("fx");

    const containerRef = useRef<HTMLDivElement>(null);
    const textButtonRef = useRef<HTMLButtonElement>(null);
    const arrowButtonRef = useRef<HTMLButtonElement>(null);

    // Internal state
    const [textButtonActive, setTextButtonActive] = useState(false);
    const [internalArrowActive, setInternalArrowActive] = useState(false);
    const [shiftOrEscapeDuringSpace, setShiftOrEscapeDuringSpace] = useState(false);
    const [tabIndex, setTabIndex] = useState(disabled ? -1 : 0);


    const effectiveActiveArrow = activeArrowButtonProp || internalArrowActive;
    const d = design as ButtonDesign;

    // Size → height / arrow width / text size / padding / radius / chevron / gap
    const sizeClasses = {
      Large:  { container: "h-10 rounded-lg", arrow: "w-10", text: "text-base px-4 gap-2 font-semibold", icon: "h-5 w-5 [&>svg]:h-4 [&>svg]:w-4", chevron: "h-4 w-4" },
      Medium: { container: "h-8 rounded",     arrow: "w-8",  text: "text-sm px-3 gap-1.5 font-semibold", icon: "h-4 w-4 [&>svg]:h-3.5 [&>svg]:w-3.5", chevron: "h-3.5 w-3.5" },
      Small:  { container: "h-6 rounded",     arrow: "w-6",  text: "text-xs px-2 gap-1 font-semibold", icon: "h-3 w-3 [&>svg]:h-[10.5px] [&>svg]:w-[10.5px]", chevron: "h-3 w-3" },
    }[size];

    // ── Imperative ref ────────────────────────────────────────────────────

    useImperativeHandle(ref, () => ({
      focus() {
        containerRef.current?.focus();
      },
      get nativeElement() {
        return containerRef.current;
      },
      get textButton() {
        return textButtonRef.current;
      },
      get arrowButton() {
        return arrowButtonRef.current;
      },
    }));

    // ── Event handlers ────────────────────────────────────────────────────

    const fireClick = useCallback(() => {
      onClick?.();
    }, [onClick]);

    const fireArrowClick = useCallback(() => {
      onArrowClick?.();
    }, [onArrowClick]);

    const resetActionStates = useCallback(() => {
      setInternalArrowActive(false);
      setTextButtonActive(false);
      setShiftOrEscapeDuringSpace(false);
    }, []);

    const setTabIndexValue = useCallback(
      (innerButtonPressed?: boolean) => {
        let val = disabled ? -1 : 0;
        if (val === -1 && innerButtonPressed) {
          val = 0;
        }
        setTabIndex(val);
      },
      [disabled]
    );

    // ── Focus out ─────────────────────────────────────────────────────────

    const handleFocusOut = useCallback(
      (e: React.FocusEvent) => {
        if (disabled) return;
        const related = e.relatedTarget as Node | null;
        if (containerRef.current?.contains(related)) return;
        resetActionStates();
        setTabIndexValue();
      },
      [disabled, resetActionStates, setTabIndexValue]
    );

    // ── Key down ──────────────────────────────────────────────────────────

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (disabled || loading) return;

        if (isArrowKeyAction(e)) {
          e.preventDefault();
          fireArrowClick();
          setInternalArrowActive(true);
          return;
        }

        if (isDefaultAction(e)) {
          e.preventDefault();
          const target = e.target as HTMLElement;

          if (isEnter(e)) {
            if (arrowButtonRef.current && target === arrowButtonRef.current) {
              setInternalArrowActive(true);
              onArrowClick?.();
              return;
            }
            setTextButtonActive(true);
            fireClick();
            return;
          }

          if (isSpace(e)) {
            setTextButtonActive(true);
          }

          if (isTab(e)) {
            resetActionStates();
          }
          return;
        }

        if ((isShift(e) || isEscape(e)) && textButtonActive) {
          e.preventDefault();
          setShiftOrEscapeDuringSpace(true);
        }

        if (isEscape(e) && !textButtonActive) {
          resetActionStates();
        }

        setTabIndex(-1);
      },
      [disabled, loading, fireArrowClick, fireClick, onArrowClick, textButtonActive, resetActionStates]
    );

    // ── Key up ────────────────────────────────────────────────────────────

    const handleKeyUp = useCallback(
      (e: React.KeyboardEvent) => {
        if (disabled || loading) return;

        if (isArrowKeyAction(e)) {
          e.preventDefault();
          setInternalArrowActive(false);
          return;
        }

        if (isSpace(e)) {
          e.preventDefault();
          e.stopPropagation();
          setTextButtonActive(false);

          if (!shiftOrEscapeDuringSpace) {
            const target = e.target as HTMLElement;
            if (arrowButtonRef.current && target === arrowButtonRef.current) {
              onArrowClick?.();
            } else {
              fireClick();
            }
          }

          setShiftOrEscapeDuringSpace(false);
          return;
        }

        if (isEnter(e) || (isShift(e) && textButtonActive)) {
          setTextButtonActive(false);
        }
      },
      [disabled, loading, shiftOrEscapeDuringSpace, fireClick, onArrowClick, textButtonActive]
    );

    // ── Text button mouse handlers ────────────────────────────────────────

    const handleTextMouseDown = useCallback(
      (e: React.MouseEvent) => {
        if (disabled || loading) return;
        e.stopPropagation();
        setTextButtonActive(true);
        setTabIndex(-1);
      },
      [disabled, loading]
    );

    const handleTextMouseUp = useCallback(() => {
      setTextButtonActive(false);
      setTabIndex(-1);
    }, []);

    const handleTextClick = useCallback(
      (e: React.MouseEvent) => {
        if (disabled || loading) return;
        e.stopPropagation();
        fireClick();
      },
      [disabled, loading, fireClick]
    );

    // ── Arrow button mouse handlers ───────────────────────────────────────

    const handleArrowMouseDown = useCallback(
      (e: React.MouseEvent) => {
        if (disabled || loading) return;
        e.stopPropagation();
        setTabIndex(-1);
      },
      [disabled, loading]
    );

    const handleArrowClick = useCallback(
      (e: React.MouseEvent) => {
        if (disabled || loading) return;
        e.preventDefault();
        e.stopPropagation();
        fireArrowClick();
      },
      [disabled, loading, fireArrowClick]
    );

    // ── Inner button focus ────────────────────────────────────────────────

    const handleInnerFocusIn = useCallback(
      (e: React.FocusEvent) => {
        e.stopPropagation();
        setTabIndexValue(true);
        (e.target as HTMLElement).focus();
      },
      [setTabIndexValue]
    );

    // ── Separator hover ───────────────────────────────────────────────────



    // ── Computed accessibility ─────────────────────────────────────────────

    const arrowHasPopup = accessibilityAttributes?.arrowButton?.hasPopup || "menu";
    const arrowExpanded = accessibilityAttributes?.arrowButton?.expanded ?? effectiveActiveArrow;
    const arrowTitle = accessibilityAttributes?.arrowButton?.title || t("SPLIT_BUTTON_ARROW_BUTTON_TOOLTIP");
    const rootHasPopup = accessibilityAttributes?.root?.hasPopup;
    const rootRoleDescription = accessibilityAttributes?.root?.roleDescription || t("SPLIT_BUTTON_DESCRIPTION");
    const rootTitle = accessibilityAttributes?.root?.title;
    const rootAriaKeyShortcuts = accessibilityAttributes?.root?.ariaKeyShortcuts;

    const isDisabled = disabled || loading;

    // Borderless variants get full rounding on hover/active (like standalone buttons)
    const isBorderless = borderlessDesigns.has(d);
    const hoverRounding = isBorderless ? hoverRoundingMap[size] : "";
    const activeRounding = isBorderless ? activeRoundingMap[size] : "";

    // ── Focus ring (keyboard = whole, click = per-part) ──────────────────

    const isFilled = d === ButtonDesign.Primary || d === ButtonDesign.PrimaryJoule;

    // Per-variant focus (::after pseudo-element at z-20, above hover backgrounds)
    const containerFocusVariant: Record<string, string> = {
      [ButtonDesign.Primary]: "split-btn-focus split-btn-focus-filled-brand",
      [ButtonDesign.PrimaryJoule]: "split-btn-focus split-btn-focus-filled-joule",
      [ButtonDesign.Secondary]: "split-btn-focus split-btn-focus-brand",
      [ButtonDesign.SecondaryJoule]: "split-btn-focus split-btn-focus-joule",
      [ButtonDesign.Tertiary]: "split-btn-focus split-btn-focus-brand",
      [ButtonDesign.TertiaryJoule]: "split-btn-focus split-btn-focus-joule",
      [ButtonDesign.Neutral]: "split-btn-focus split-btn-focus-brand",
      [ButtonDesign.SecondaryNeutral]: "split-btn-focus split-btn-focus-brand",
      [ButtonDesign.TertiaryNeutral]: "split-btn-focus split-btn-focus-brand",
    };

    const containerFocusSizeClass = focusSizeClass[size];
    const containerFocusOutlineClass = cn(containerFocusVariant[d], containerFocusSizeClass);

    // Inner button focus (mouse click — ::before pseudo-element, full rounded-rect)
    const innerFocusColorClass: Record<string, string> = {
      [ButtonDesign.Primary]: "split-btn-inner-white",
      [ButtonDesign.PrimaryJoule]: "split-btn-inner-white",
      [ButtonDesign.Secondary]: "split-btn-inner-brand",
      [ButtonDesign.SecondaryJoule]: "split-btn-inner-joule",
      [ButtonDesign.Tertiary]: "split-btn-inner-brand",
      [ButtonDesign.TertiaryJoule]: "split-btn-inner-joule",
      [ButtonDesign.Neutral]: "split-btn-inner-brand",
      [ButtonDesign.SecondaryNeutral]: "split-btn-inner-brand",
      [ButtonDesign.TertiaryNeutral]: "split-btn-inner-brand",
    };

    const innerSizeClass = innerSizeClassMap[size];

    const innerFocusClass = cn(
      "split-btn-inner",
      innerSizeClass,
      innerFocusColorClass[d],
    );

    const textFocusRing = innerFocusClass;
    const arrowFocusRing = innerFocusClass;

    // ── Render ──────────────────────────────────────────────────────────────

    return (
        <div
          ref={containerRef}
          id={id}
          role="group"
          tabIndex={isDisabled ? -1 : tabIndex}
          aria-labelledby={`${id}-invisibleTextDefault ${id}-invisibleText`}
          aria-haspopup={rootHasPopup}
          aria-roledescription={rootRoleDescription}
          aria-keyshortcuts={rootAriaKeyShortcuts}
          className={cn(
            containerVariants({ design: d }),
            sizeClasses.container,
            "shrink-0 w-fit",
            isDisabled && "pointer-events-none opacity-50",
            "outline-none",
            containerFocusOutlineClass,
            className
          )}
          style={style}
          onBlur={handleFocusOut}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          data-testid={dataTestId}
        >

          {/* Text button */}
          <button
            ref={textButtonRef}
            type="button"
            tabIndex={-1}
            disabled={isDisabled}
            title={rootTitle}
            onClick={handleTextClick}
            onMouseDown={handleTextMouseDown}
            onMouseUp={handleTextMouseUp}
            onFocus={handleInnerFocusIn}
            className={cn(
              "inline-flex items-center justify-start cursor-pointer relative",
              sizeClasses.text,
              "flex-grow",
              "rounded-s-[inherit] rounded-e-none",
              "bg-transparent",
              isFilled && "border-r border-r-sapphire-neutral-foreground-white",
              textColorClass[d],
              "whitespace-nowrap",
              "outline-none transition-colors",
              "disabled:pointer-events-none",
              textFocusRing,
              !textButtonActive && textBtnHoverClass[d],
              !textButtonActive && hoverRounding,
              textButtonActive && textBtnActiveClass[d],
              textButtonActive && activeRounding,
            )}
          >
            {loading ? (
              <Loader2 className={cn(sizeClasses.icon, "animate-spin")} />
            ) : (
              icon && <span className={cn("inline-flex items-center justify-center shrink-0", sizeClasses.icon)}>{icon}</span>
            )}
            {text && <span>{text}</span>}
            {endIcon && !loading && (
              <span className="inline-flex items-center shrink-0">{endIcon}</span>
            )}
          </button>

          {/* Separator line — span for non-filled, border-r on text button for filled */}
          {separatorDesigns.has(d) && (
            <span
              aria-hidden="true"
              className={cn(
                "w-px shrink-0 self-stretch z-[1] pointer-events-none",
                separatorColor[d],
              )}
            />
          )}

          {/* Arrow button */}
          <button
            ref={arrowButtonRef}
            type="button"
            tabIndex={-1}
            disabled={isDisabled}
            aria-haspopup={arrowHasPopup}
            aria-expanded={arrowExpanded}
            title={arrowTitle}
            onClick={handleArrowClick}
            onMouseDown={handleArrowMouseDown}
            onFocus={handleInnerFocusIn}
            data-testid={subTestId(dataTestId, "arrow")}
            className={cn(
              "inline-flex items-center justify-center cursor-pointer",
              sizeClasses.arrow, "shrink-0",
              "rounded-e-[inherit] rounded-s-none",
              "bg-transparent",
              textColorClass[d],
              "outline-none transition-colors overflow-visible relative",
              "disabled:pointer-events-none",
              arrowFocusRing,
              !effectiveActiveArrow && arrowBtnHoverClass[d],
              !effectiveActiveArrow && hoverRounding,
              effectiveActiveArrow && arrowBtnActiveClass[d],
              effectiveActiveArrow && arrowBtnActiveHoverClass[d],
              effectiveActiveArrow && activeRounding,
            )}
          >
            <SlimArrowDownIcon className={sizeClasses.chevron} />
          </button>

          {/* Screen reader text */}
          <span id={`${id}-invisibleText`} className="sr-only">
            {t("SPLIT_BUTTON_KEYBOARD_HINT")}{accessibleName ? ` ${accessibleName}` : ""}
          </span>
          <span id={`${id}-invisibleTextDefault`} className="sr-only">
            {text}
          </span>
        </div>
    );
}
