import React, {
  useRef,
  useCallback,
  useImperativeHandle,
  useState,
  useEffect,
} from "react";
import { cn, cva, type VariantProps } from "../../lib/utils";
import { BusyIndicator } from "../busy-indicator/BusyIndicator";
import "./Button.css";
import {
  ButtonProps,
  ButtonDesign,
  ButtonSize,
  ButtonType,
  ButtonAccessibleRole,
  ButtonState,
  ButtonStateTransition,
} from "../../types/button";

/**
 * Shared styles for filled brand (Primary/Emphasized)
 */
const filledBrandStyles = [
  "bg-sapphire-brand-background text-sapphire-neutral-foreground-white font-semibold",
  "hover:bg-sapphire-brand-hover-background",
  "active:bg-sapphire-brand-pressed-background [&.kb-active]:bg-sapphire-brand-pressed-background",
  "focus:[outline-style:solid] focus:outline-2 focus:-outline-offset-2 focus:outline-sapphire-border-focus btn-filled-focus",
];

const filledJouleStyles = [
  "bg-sapphire-joule-background text-sapphire-neutral-foreground-white font-semibold",
  "hover:bg-sapphire-joule-hover-background",
  "active:bg-sapphire-joule-pressed-background [&.kb-active]:bg-sapphire-joule-pressed-background",
  "focus:[outline-style:solid] focus:outline-2 focus:-outline-offset-2 focus:outline-sapphire-border-joule btn-filled-focus",
];

const outlineBrandStyles = [
  "bg-transparent text-sapphire-brand-foreground border border-sapphire-brand-foreground",
  "hover:bg-sapphire-neutral-hover-background",
  "active:bg-sapphire-neutral-pressed-background active:border-sapphire-brand-pressed-foreground active:text-sapphire-brand-pressed-foreground [&.kb-active]:bg-sapphire-neutral-pressed-background [&.kb-active]:border-sapphire-brand-pressed-foreground [&.kb-active]:text-sapphire-brand-pressed-foreground",
  "focus:[outline-style:solid] focus:outline-2 focus:-outline-offset-2 focus:outline-sapphire-border-focus",
];

const outlineJouleStyles = [
  "bg-transparent text-sapphire-joule-foreground border border-sapphire-joule-foreground",
  "hover:bg-sapphire-neutral-hover-background hover:text-sapphire-joule-hover-background hover:border-sapphire-joule-hover-background",
  "active:bg-sapphire-neutral-pressed-background active:border-sapphire-joule-pressed-foreground active:text-sapphire-joule-pressed-foreground [&.kb-active]:bg-sapphire-neutral-pressed-background [&.kb-active]:border-sapphire-joule-pressed-foreground [&.kb-active]:text-sapphire-joule-pressed-foreground",
  "focus:[outline-style:solid] focus:outline-2 focus:-outline-offset-2 focus:outline-sapphire-border-joule",
];

/**
 * Button design variants using CVA
 */
const buttonVariants = cva(
  [
    // Base styles
    "inline-flex items-center justify-center gap-2",
    "font-semibold whitespace-nowrap",
    "transition-[color,background-color,border-color,text-decoration-color,fill,stroke] cursor-pointer",
    "outline-none",
    "disabled:pointer-events-none disabled:opacity-40",
  ],
  {
    variants: {
      design: {
        // --- Primary (filled) ---
        [ButtonDesign.Primary]: filledBrandStyles,
        [ButtonDesign.PrimaryJoule]: filledJouleStyles,
        // --- Secondary (outlined) ---
        [ButtonDesign.Secondary]: outlineBrandStyles,
        [ButtonDesign.SecondaryJoule]: outlineJouleStyles,
        // --- Tertiary (ghost, colored text) ---
        [ButtonDesign.Tertiary]: [
          "bg-transparent text-sapphire-brand-foreground border border-transparent",
          "hover:bg-sapphire-neutral-hover-background",
          "active:bg-sapphire-neutral-pressed-background active:text-sapphire-brand-pressed-foreground [&.kb-active]:bg-sapphire-neutral-pressed-background [&.kb-active]:text-sapphire-brand-pressed-foreground",
          "focus:[outline-style:solid] focus:outline-2 focus:-outline-offset-2 focus:outline-sapphire-border-focus",
        ],
        [ButtonDesign.TertiaryJoule]: [
          "bg-transparent text-sapphire-joule-foreground border border-transparent",
          "hover:bg-sapphire-neutral-hover-background hover:text-sapphire-joule-hover-background",
          "active:bg-sapphire-neutral-pressed-background active:text-sapphire-joule-pressed-foreground [&.kb-active]:bg-sapphire-neutral-pressed-background [&.kb-active]:text-sapphire-joule-pressed-foreground",
          "focus:[outline-style:solid] focus:outline-2 focus:-outline-offset-2 focus:outline-sapphire-border-joule",
        ],
        // --- Neutral (ghost, dark text) ---
        [ButtonDesign.Neutral]: [
          "bg-transparent text-sapphire-neutral-foreground-black border border-sapphire-neutral-foreground-muted",
          "hover:bg-sapphire-neutral-hover-background hover:text-sapphire-neutral-foreground-black",
          "active:bg-sapphire-neutral-pressed-background active:text-sapphire-neutral-foreground-black [&.kb-active]:bg-sapphire-neutral-pressed-background [&.kb-active]:text-sapphire-neutral-foreground-black",
          "focus:[outline-style:solid] focus:outline-2 focus:-outline-offset-2 focus:outline-sapphire-border-focus",
        ],
        // --- SecondaryNeutral (ghost, neutral-black text) ---
        [ButtonDesign.SecondaryNeutral]: [
          "bg-transparent text-sapphire-neutral-foreground-black border border-transparent",
          "hover:bg-sapphire-neutral-hover-background",
          "active:bg-sapphire-neutral-pressed-background [&.kb-active]:bg-sapphire-neutral-pressed-background",
          "focus:[outline-style:solid] focus:outline-2 focus:-outline-offset-2 focus:outline-sapphire-border-focus",
        ],
        // --- TertiaryNeutral (ghost, muted neutral text, no background) ---
        [ButtonDesign.TertiaryNeutral]: [
          "bg-transparent text-sapphire-neutral-foreground-muted border border-transparent",
          "hover:text-sapphire-neutral-foreground-black",
          "active:text-sapphire-neutral-foreground-black [&.kb-active]:text-sapphire-neutral-foreground-black",
          "focus:[outline-style:solid] focus:outline-2 focus:-outline-offset-2 focus:outline-sapphire-border-focus",
        ],
      },
    },
    defaultVariants: {
      design: ButtonDesign.Secondary,
    },
  }
);

/**
 * Size classes for button
 * Large:  Figma Large  — height 40px, padding 12/16, font 16px, gap 8px, radius 8px, icon 20×20
 * Medium: Figma Medium — height 32px, padding 8/12,  font 14px, gap 6px, radius 4px, icon 16×16
 * Small:  Figma Small  — height 24px, padding 4/8,   font 12px, gap 4px, radius 4px, icon 10.5×10.5
 */
const largeSizeClasses = {
  default: "h-10 px-4 py-3 text-base gap-2 rounded-lg",
  iconOnly: "h-10 w-10 p-0 text-base rounded-lg",
  icon: "h-5 w-5 [&>svg]:h-4 [&>svg]:w-4",
};
const mediumSizeClasses = {
  default: "h-8 px-3 py-2 text-sm gap-1.5 rounded",
  iconOnly: "h-8 w-8 p-0 text-sm rounded",
  icon: "h-4 w-4 [&>svg]:h-3.5 [&>svg]:w-3.5",
};
const smallSizeClasses = {
  default: "h-6 px-2 py-1 text-xs font-semibold gap-1 rounded",
  iconOnly: "h-6 w-6 p-0 text-xs rounded",
  icon: "h-3 w-3 [&>svg]:h-[10.5px] [&>svg]:w-[10.5px]",
};

const sizeClasses = {
  [ButtonSize.Large]: largeSizeClasses,
  [ButtonSize.Medium]: mediumSizeClasses,
  [ButtonSize.Small]: smallSizeClasses,
};

/**
 * Map ButtonType enum to native button type
 */
function getButtonType(
  type?: ButtonType | `${ButtonType}`
): "button" | "submit" | "reset" {
  switch (type) {
    case ButtonType.Submit:
    case "Submit":
      return "submit";
    case ButtonType.Reset:
    case "Reset":
      return "reset";
    default:
      return "button";
  }
}

// Animation phases for multi-state transitions
type AnimationPhase = "idle" | "fade-out" | "fade-mid" | "fade-in";

/**
 * Button component
 *
 * A native React implementation of the UI5 Button component.
 * Supports multiple visual designs, icons, loading states, form integration,
 * and multi-state mode with animated transitions (like UI5 AI Button).
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Button>Click me</Button>
 *
 * // Emphasized with icon
 * <Button design="Primary" icon={<Save className="h-4 w-4" />}>Save</Button>
 *
 * // Multi-state button (AI Button style)
 * <Button
 *   states={[
 *     { name: "generate", text: "Generate", icon: <Sparkles /> },
 *     { name: "generating", text: "Stop", icon: <Square /> },
 *     { name: "revise", text: "Revise", icon: <Sparkles />, endIcon: <ChevronDown /> },
 *   ]}
 *   state={currentState}
 *   onClick={() => setCurrentState(nextState)}
 * />
 * ```
 */
export function Button({
      design = ButtonDesign.Secondary,
      size = ButtonSize.Large,
      type = ButtonType.Button,
      disabled = false,
      loading = false,
      icon,
      endIcon,
      iconOnly = false,
      children,
      tooltip,
      states,
      state,
      stateTransition = "slide-up",
      accessibleName,
      accessibleNameRef,
      accessibleRole = ButtonAccessibleRole.Button,
      accessibilityAttributes,
      name,
      value,
      form,
      onClick,
      onFocus,
      onBlur,
      className,
      style,
      id,
      tabIndex,
      "data-testid": dataTestId,
      "data-growing-button": dataGrowingButton,
      ref,
    }: ButtonProps) {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const hiddenButtonRef = useRef<HTMLButtonElement>(null);

    // Multi-state animation
    const [animationPhase, setAnimationPhase] = useState<AnimationPhase>("idle");
    const [displayedState, setDisplayedState] = useState<ButtonState | null>(
      null
    );
    const [buttonWidth, setButtonWidth] = useState<number | undefined>(undefined);

    // Determine the current state object
    const currentStateObject = states?.find((s) => s.name === state) ?? states?.[0];
    const isMultiState = states && states.length > 0;

    // Initialize displayed state
    useEffect(() => {
      if (isMultiState && !displayedState) {
        setDisplayedState(currentStateObject ?? null);
      }
    }, [isMultiState, currentStateObject, displayedState]);

    // Handle state transitions with animation
    useEffect(() => {
      if (!isMultiState || !currentStateObject || animationPhase !== "idle") {
        return;
      }

      // If state changed, start animation
      if (displayedState && displayedState.name !== currentStateObject.name) {
        // Capture current width
        if (buttonRef.current) {
          setButtonWidth(buttonRef.current.offsetWidth);
        }
        setAnimationPhase("fade-out");
      }
    }, [currentStateObject, displayedState, isMultiState, animationPhase]);

    // Animation phase transitions
    useEffect(() => {
      if (animationPhase === "fade-out") {
        const timer = setTimeout(() => {
          setAnimationPhase("fade-mid");
        }, 180);
        return () => clearTimeout(timer);
      }

      if (animationPhase === "fade-mid") {
        // Update to new state during mid phase
        setDisplayedState(currentStateObject ?? null);
        // Measure new width from hidden button if needed
        if (hiddenButtonRef.current) {
          setButtonWidth(hiddenButtonRef.current.offsetWidth);
        }
        const timer = setTimeout(() => {
          setAnimationPhase("fade-in");
        }, 20);
        return () => clearTimeout(timer);
      }

      if (animationPhase === "fade-in") {
        const timer = setTimeout(() => {
          setAnimationPhase("idle");
          setButtonWidth(undefined);
        }, 160);
        return () => clearTimeout(timer);
      }
    }, [animationPhase, currentStateObject]);

    // Expose imperative methods
    useImperativeHandle(
      ref,
      () => ({
        focus() {
          buttonRef.current?.focus();
        },
        blur() {
          buttonRef.current?.blur();
        },
        isFocused() {
          return document.activeElement === buttonRef.current;
        },
        get nativeElement() {
          return buttonRef.current;
        },
      }),
      []
    );

    // Handle click
    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        if (disabled || loading) {
          e.preventDefault();
          return;
        }

        onClick?.({
          originalEvent: e,
          isKeyboard: false,
        });
      },
      [disabled, loading, onClick]
    );

    // Handle keyboard activation
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLButtonElement>) => {
        if (disabled || loading) return;

        if (e.key === " ") {
          e.preventDefault();
          buttonRef.current?.classList.add("kb-active");
        } else if (e.key === "Enter") {
          buttonRef.current?.classList.add("kb-active");
        }
      },
      [disabled, loading]
    );

    const handleKeyUp = useCallback(
      (e: React.KeyboardEvent<HTMLButtonElement>) => {
        buttonRef.current?.classList.remove("kb-active");

        if (disabled || loading) return;

        if (e.key === " ") {
          onClick?.({
            originalEvent: e,
            isKeyboard: true,
          });
        }
      },
      [disabled, loading, onClick]
    );

    // Determine ARIA attributes
    const ariaExpanded = accessibilityAttributes?.expanded;
    const ariaHasPopup = accessibilityAttributes?.hasPopup;
    const ariaControls = accessibilityAttributes?.controls;
    const ariaPressed = accessibilityAttributes?.pressed;

    // Determine role
    const role =
      accessibleRole === ButtonAccessibleRole.Link ||
      (accessibleRole as string) === "Link"
        ? "link"
        : undefined; // Default button role is implicit

    // Determine if button should be disabled
    // Loading buttons stay focusable (not native disabled) but block interaction
    const isDisabled = disabled;

    // Get effective content based on mode
    const effectiveIcon = isMultiState ? displayedState?.icon : icon;
    const effectiveEndIcon = isMultiState ? displayedState?.endIcon : endIcon;
    const effectiveChildren = isMultiState ? displayedState?.text : children;
    const effectiveIconOnly = isMultiState
      ? !displayedState?.text && !!displayedState?.icon
      : iconOnly;
    const effectivePulsing = isMultiState ? displayedState?.pulsing : false;

    // Pulsing text component for processing states
    const PulsingText = ({ children: text }: { children: React.ReactNode }) => (
      <span className="relative inline-block">
        <span className="opacity-50">{text}</span>
        <span
          className="absolute inset-0 overflow-hidden"
          style={{
            background: "linear-gradient(90deg, transparent 0%, currentColor 50%, transparent 100%)",
            backgroundSize: "200% 100%",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: "pulse-sweep 1.5s ease-in-out infinite",
          }}
        >
          {text}
        </span>
        <style>{`
          @keyframes pulse-sweep {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
      </span>
    );

    // Get animation styles based on transition type
    const getTransitionStyles = (
      phase: AnimationPhase,
      transition: ButtonStateTransition
    ): React.CSSProperties => {
      if (transition === "none" || phase === "idle") {
        return {};
      }

      const baseTransition = "all 100ms ease-out";

      switch (transition) {
        case "slide-up":
          if (phase === "fade-out") return { opacity: 0, transform: "translateY(-8px)", transition: baseTransition };
          if (phase === "fade-mid") return { opacity: 0, transform: "translateY(8px)" };
          if (phase === "fade-in") return { opacity: 1, transform: "translateY(0)", transition: baseTransition };
          break;
        case "slide-down":
          if (phase === "fade-out") return { opacity: 0, transform: "translateY(8px)", transition: baseTransition };
          if (phase === "fade-mid") return { opacity: 0, transform: "translateY(-8px)" };
          if (phase === "fade-in") return { opacity: 1, transform: "translateY(0)", transition: baseTransition };
          break;
        case "slide-left":
          if (phase === "fade-out") return { opacity: 0, transform: "translateX(-12px)", transition: baseTransition };
          if (phase === "fade-mid") return { opacity: 0, transform: "translateX(12px)" };
          if (phase === "fade-in") return { opacity: 1, transform: "translateX(0)", transition: baseTransition };
          break;
        case "slide-right":
          if (phase === "fade-out") return { opacity: 0, transform: "translateX(12px)", transition: baseTransition };
          if (phase === "fade-mid") return { opacity: 0, transform: "translateX(-12px)" };
          if (phase === "fade-in") return { opacity: 1, transform: "translateX(0)", transition: baseTransition };
          break;
        case "fade":
          if (phase === "fade-out") return { opacity: 0, transition: baseTransition };
          if (phase === "fade-mid") return { opacity: 0 };
          if (phase === "fade-in") return { opacity: 1, transition: baseTransition };
          break;
        case "scale":
          if (phase === "fade-out") return { opacity: 0, transform: "scale(0.75)", transition: baseTransition };
          if (phase === "fade-mid") return { opacity: 0, transform: "scale(0.75)" };
          if (phase === "fade-in") return { opacity: 1, transform: "scale(1)", transition: baseTransition };
          break;
        case "flip":
          if (phase === "fade-out") return { opacity: 0, transform: "rotateX(90deg)", transition: baseTransition, transformStyle: "preserve-3d" };
          if (phase === "fade-mid") return { opacity: 0, transform: "rotateX(-90deg)", transformStyle: "preserve-3d" };
          if (phase === "fade-in") return { opacity: 1, transform: "rotateX(0)", transition: baseTransition, transformStyle: "preserve-3d" };
          break;
      }
      return {};
    };

    // Content animation styles for icon/text
    const contentAnimationStyles = getTransitionStyles(animationPhase, stateTransition);
    const iconAnimationStyles = getTransitionStyles(animationPhase, stateTransition);

    return (
      <>
        <button
          ref={buttonRef}
          type={getButtonType(type)}
          disabled={isDisabled}
          aria-disabled={loading || undefined}
          id={id}
          name={name}
          value={value}
          form={form}
          role={role}
          aria-label={accessibleName}
          aria-labelledby={accessibleNameRef}
          aria-expanded={ariaExpanded}
          aria-haspopup={ariaHasPopup}
          aria-controls={ariaControls}
          aria-pressed={ariaPressed}
          aria-busy={loading || undefined}
          title={tooltip}
          tabIndex={tabIndex}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onFocus={onFocus}
          onBlur={(e) => {
            buttonRef.current?.classList.remove("kb-active");
            onBlur?.(e);
          }}
          className={cn(
            buttonVariants({
              design: design as ButtonDesign,
            }),
            sizeClasses[size as ButtonSize][effectiveIconOnly ? "iconOnly" : "default"],
            isMultiState && !effectiveIconOnly && "transition-[width] duration-300 ease-out overflow-hidden",
            loading && "relative pointer-events-none",
            className
          )}
          style={{
            ...style,
            ...(buttonWidth !== undefined && !effectiveIconOnly ? { width: buttonWidth } : {}),
          }}
          data-testid={dataTestId}
          data-growing-button={dataGrowingButton}
        >
          {/* Busy indicator overlay — centered on top of content */}
          {loading && (
            <span className="absolute inset-0 flex items-center justify-center z-[1] [&_*]:!text-inherit" inert>
              <BusyIndicator size="S" active delay={0} />
            </span>
          )}

          {/* Start icon */}
          {effectiveIcon ? (
            <span className={cn("inline-flex items-center justify-center shrink-0", sizeClasses[size as ButtonSize].icon, loading && "opacity-40")} style={isMultiState ? iconAnimationStyles : undefined}>
              {effectiveIcon}
            </span>
          ) : null}

          {/* Content (hidden for icon-only) */}
          {!effectiveIconOnly && effectiveChildren && (
            <span className={loading ? "opacity-40" : undefined} style={isMultiState ? contentAnimationStyles : undefined}>
              {effectivePulsing ? (
                <PulsingText>{effectiveChildren}</PulsingText>
              ) : (
                effectiveChildren
              )}
            </span>
          )}

          {/* End icon */}
          {effectiveEndIcon && (
            <span className={cn("inline-flex items-center", sizeClasses[size as ButtonSize].icon, loading && "opacity-40")} style={isMultiState ? contentAnimationStyles : undefined}>
              {effectiveEndIcon}
            </span>
          )}
        </button>

        {/* Hidden button for measuring new state width */}
        {isMultiState && (
          <button
            ref={hiddenButtonRef}
            className={cn(
              buttonVariants({
                design: design as ButtonDesign,
              }),
              sizeClasses[size as ButtonSize][
                !currentStateObject?.text && currentStateObject?.icon
                  ? "iconOnly"
                  : "default"
              ],
              "absolute -top-[10000px] -left-[10000px] invisible w-fit"
            )}
            tabIndex={-1}
            aria-hidden="true"
          >
            {currentStateObject?.icon && (
              <span>{currentStateObject.icon}</span>
            )}
            {currentStateObject?.text && (
              <span>{currentStateObject.text}</span>
            )}
            {currentStateObject?.endIcon && (
              <span>{currentStateObject.endIcon}</span>
            )}
          </button>
        )}
      </>
    );
  }

export type { VariantProps };
