import React, { useRef, useImperativeHandle, useState } from "react";
import { cn, cva } from "../../lib/utils";
import { ToggleButtonProps } from "../../types/toggle-button";
import { ButtonDesign, ButtonSize } from "../../types/button";
import "../button/Button.css";

/**
 * ToggleButton variants
 */
const toggleButtonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "font-semibold whitespace-nowrap",
    "transition-[color,background-color,border-color,text-decoration-color,fill,stroke] cursor-pointer",
    "outline-none",
    "disabled:pointer-events-none disabled:opacity-40",
  ],
  {
    variants: {
      design: {
        [ButtonDesign.Secondary]: "border focus:[outline-style:solid] focus:outline-2 focus:-outline-offset-2 focus:outline-sapphire-border-focus",
        [ButtonDesign.Primary]: "focus:[outline-style:solid] focus:outline-2 focus:-outline-offset-2 focus:outline-sapphire-border-focus btn-filled-focus",
        [ButtonDesign.PrimaryJoule]: "focus:[outline-style:solid] focus:outline-2 focus:-outline-offset-2 focus:outline-sapphire-border-joule btn-filled-focus",
        [ButtonDesign.SecondaryJoule]: "border focus:[outline-style:solid] focus:outline-2 focus:-outline-offset-2 focus:outline-sapphire-border-joule",
        [ButtonDesign.Neutral]: "border focus:[outline-style:solid] focus:outline-2 focus:-outline-offset-2 focus:outline-sapphire-border-focus",
        [ButtonDesign.SecondaryNeutral]: "border border-transparent focus:[outline-style:solid] focus:outline-2 focus:-outline-offset-2 focus:outline-sapphire-border-focus",
        [ButtonDesign.TertiaryNeutral]: "border border-transparent focus:[outline-style:solid] focus:outline-2 focus:-outline-offset-2 focus:outline-sapphire-border-focus",
        [ButtonDesign.Tertiary]: "border border-transparent focus:[outline-style:solid] focus:outline-2 focus:-outline-offset-2 focus:outline-sapphire-border-focus",
        [ButtonDesign.TertiaryJoule]: "border border-transparent focus:[outline-style:solid] focus:outline-2 focus:-outline-offset-2 focus:outline-sapphire-border-joule",
      },
      pressed: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      // Secondary
      {
        design: ButtonDesign.Secondary,
        pressed: false,
        className: "bg-transparent text-sapphire-brand-foreground border-sapphire-brand-foreground hover:bg-sapphire-neutral-hover-background active:bg-sapphire-neutral-pressed-background active:border-sapphire-brand-pressed-foreground active:text-sapphire-brand-pressed-foreground",
      },
      {
        design: ButtonDesign.Secondary,
        pressed: true,
        className: "bg-sapphire-brand-selected-background text-sapphire-brand-foreground border-transparent hover:bg-sapphire-brand-selected-hover-background",
      },
      // Primary
      {
        design: ButtonDesign.Primary,
        pressed: false,
        className: "bg-sapphire-brand-background/20 text-sapphire-brand-foreground hover:bg-sapphire-brand-background/30",
      },
      {
        design: ButtonDesign.Primary,
        pressed: true,
        className: "bg-sapphire-brand-hover-background text-sapphire-neutral-foreground-white hover:bg-blue-800",
      },
      // PrimaryJoule
      {
        design: ButtonDesign.PrimaryJoule,
        pressed: false,
        className: "bg-sapphire-joule-background/20 text-sapphire-joule-foreground hover:bg-sapphire-joule-background/30",
      },
      {
        design: ButtonDesign.PrimaryJoule,
        pressed: true,
        className: "bg-sapphire-joule-hover-background text-sapphire-neutral-foreground-white hover:bg-purple-800",
      },
      // SecondaryJoule
      {
        design: ButtonDesign.SecondaryJoule,
        pressed: false,
        className: "bg-transparent text-sapphire-joule-foreground border-sapphire-joule-foreground hover:bg-sapphire-neutral-hover-background active:bg-sapphire-neutral-pressed-background active:border-sapphire-joule-pressed-foreground active:text-sapphire-joule-pressed-foreground",
      },
      {
        design: ButtonDesign.SecondaryJoule,
        pressed: true,
        className: "bg-sapphire-joule-background-area text-sapphire-joule-foreground border-transparent hover:bg-sapphire-joule-background-light",
      },
      // Neutral
      {
        design: ButtonDesign.Neutral,
        pressed: false,
        className: "bg-transparent text-sapphire-neutral-foreground-black border-sapphire-neutral-foreground-muted hover:bg-sapphire-neutral-hover-background hover:text-sapphire-neutral-foreground-black",
      },
      {
        design: ButtonDesign.Neutral,
        pressed: true,
        className: "bg-sapphire-neutral-pressed-background text-sapphire-neutral-foreground-black border-transparent hover:bg-sapphire-neutral-hover-background",
      },
      // SecondaryNeutral
      {
        design: ButtonDesign.SecondaryNeutral,
        pressed: false,
        className: "bg-transparent text-sapphire-neutral-foreground-black border-transparent hover:bg-sapphire-neutral-hover-background active:bg-sapphire-neutral-pressed-background",
      },
      {
        design: ButtonDesign.SecondaryNeutral,
        pressed: true,
        className: "bg-sapphire-brand-selected-background text-sapphire-brand-foreground border-transparent hover:bg-sapphire-brand-selected-hover-background",
      },
      // TertiaryNeutral
      {
        design: ButtonDesign.TertiaryNeutral,
        pressed: false,
        className: "bg-transparent text-sapphire-neutral-foreground-muted border-transparent hover:text-sapphire-neutral-foreground-black active:text-sapphire-neutral-foreground-black",
      },
      {
        design: ButtonDesign.TertiaryNeutral,
        pressed: true,
        className: "bg-sapphire-brand-selected-background text-sapphire-brand-foreground border-transparent hover:bg-sapphire-brand-selected-hover-background",
      },
      // Tertiary
      {
        design: ButtonDesign.Tertiary,
        pressed: false,
        className: "bg-transparent text-sapphire-brand-foreground hover:bg-sapphire-neutral-hover-background active:bg-sapphire-neutral-pressed-background active:text-sapphire-brand-pressed-foreground",
      },
      {
        design: ButtonDesign.Tertiary,
        pressed: true,
        className: "bg-sapphire-brand-selected-background text-sapphire-brand-foreground border-transparent hover:bg-sapphire-brand-selected-hover-background",
      },
      // TertiaryJoule
      {
        design: ButtonDesign.TertiaryJoule,
        pressed: false,
        className: "bg-transparent text-sapphire-joule-foreground hover:bg-sapphire-neutral-hover-background active:bg-sapphire-neutral-pressed-background active:text-sapphire-joule-pressed-foreground",
      },
      {
        design: ButtonDesign.TertiaryJoule,
        pressed: true,
        className: "bg-sapphire-joule-background-area text-sapphire-joule-foreground border-transparent hover:bg-sapphire-joule-background-light",
      },
    ],
    defaultVariants: {
      design: ButtonDesign.Secondary,
      pressed: false,
    },
  }
);

/**
 * Size classes for toggle button
 * Large:  40px height, radius 8px, icon 20×20
 * Medium: 32px height, radius 4px, icon 16×16
 * Small:  24px height, radius 4px, icon 10.5×10.5
 */
const sizeClasses = {
  [ButtonSize.Large]: {
    default: "h-10 px-4 py-2 rounded-lg",
    iconOnly: "h-10 w-10 p-0 rounded-lg",
    icon: "h-5 w-5 [&>svg]:h-4 [&>svg]:w-4",
  },
  [ButtonSize.Medium]: {
    default: "h-8 px-3 py-2 text-sm rounded",
    iconOnly: "h-8 w-8 p-0 text-sm rounded",
    icon: "h-4 w-4 [&>svg]:h-3.5 [&>svg]:w-3.5",
  },
  [ButtonSize.Small]: {
    default: "h-6 px-2 py-1 text-xs font-semibold gap-1 rounded",
    iconOnly: "h-6 w-6 p-0 text-xs rounded",
    icon: "h-3 w-3 [&>svg]:h-[10.5px] [&>svg]:w-[10.5px]",
  },
};

/**
 * ToggleButton component
 *
 * A button that toggles between pressed and unpressed states.
 *
 * @example
 * ```tsx
 * const [pressed, setPressed] = useState(false);
 *
 * <ToggleButton
 *   pressed={pressed}
 *   onChange={({ pressed }) => setPressed(pressed)}
 *   icon={<Star />}
 * >
 *   Favorite
 * </ToggleButton>
 * ```
 */
export function ToggleButton({
  pressed: controlledPressed,
  design = ButtonDesign.Secondary,
  size = ButtonSize.Large,
  icon,
  endIcon,
  children,
  disabled = false,
  iconOnly = false,
  tooltip,
  accessibleName,
  onChange,
  onClick,
  tabIndex,
  className,
  style,
  ref,
  "data-testid": dataTestId,
}: ToggleButtonProps) {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [internalPressed, setInternalPressed] = useState(false);

    const isControlled = controlledPressed !== undefined;
    const pressed = isControlled ? controlledPressed : internalPressed;

    useImperativeHandle(ref, () => ({
      focus: () => buttonRef.current?.focus(),
      isFocused: () => document.activeElement === buttonRef.current,
      get nativeElement() { return buttonRef.current; },
      getNativeElement: () => buttonRef.current,
    }));

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;

      const newPressed = !pressed;

      if (!isControlled) {
        setInternalPressed(newPressed);
      }

      onChange?.({ pressed: newPressed });
      onClick?.(e);
    };

    const isIconOnly = iconOnly || (icon && !children);

    return (
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        tabIndex={tabIndex}
        title={tooltip}
        aria-label={accessibleName}
        aria-pressed={pressed}
        onClick={handleClick}
        data-testid={dataTestId}
        className={cn(
          toggleButtonVariants({
            design: design as ButtonDesign,
            pressed,
          }),
          isIconOnly ? sizeClasses[size as ButtonSize].iconOnly : sizeClasses[size as ButtonSize].default,
          className
        )}
        style={style}
      >
        {icon && <span className={cn("inline-flex items-center justify-center shrink-0", sizeClasses[size as ButtonSize].icon)}>{icon}</span>}
        {!isIconOnly && children}
        {endIcon && <span className={cn("inline-flex items-center justify-center shrink-0", sizeClasses[size as ButtonSize].icon)}>{endIcon}</span>}
      </button>
    );
}
