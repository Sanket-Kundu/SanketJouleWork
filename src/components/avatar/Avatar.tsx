import React, { useRef, useImperativeHandle, useState } from "react";
import { cn, cva } from "../../lib/utils";
import { PersonPlaceholderIcon } from "../../icons/PersonPlaceholder";
import {
  AvatarProps,
  AvatarShape,
  AvatarSize,
  AvatarColorScheme,
} from "../../types/avatar";

/**
 * Avatar size variants
 */
const avatarVariants = cva(
  [
    "inline-flex items-center justify-center",
    "font-medium overflow-hidden",
    "select-none",
  ],
  {
    variants: {
      shape: {
        [AvatarShape.Circle]: "rounded-full",
        [AvatarShape.Square]: "",
      },
      size: {
        [AvatarSize.XS]: "h-[2rem] w-[2rem] text-[1rem]",
        [AvatarSize.S]: "h-[3rem] w-[3rem] text-[1.125rem]",
        [AvatarSize.M]: "h-[4rem] w-[4rem] text-[1.5rem]",
        [AvatarSize.L]: "h-[5rem] w-[5rem] text-[2.25rem]",
        [AvatarSize.XL]: "h-[7rem] w-[7rem] text-[3rem]",
      },
      colorScheme: {
        [AvatarColorScheme.Accent1]: "border border-sapphire-accent-bg-1 bg-sapphire-accent-bg-1 text-sapphire-accent-1",
        [AvatarColorScheme.Accent2]: "border border-sapphire-accent-bg-2 bg-sapphire-accent-bg-2 text-sapphire-accent-2",
        [AvatarColorScheme.Accent3]: "border border-sapphire-accent-bg-3 bg-sapphire-accent-bg-3 text-sapphire-accent-3",
        [AvatarColorScheme.Accent4]: "border border-sapphire-accent-bg-4 bg-sapphire-accent-bg-4 text-sapphire-accent-4",
        [AvatarColorScheme.Accent5]: "border border-sapphire-accent-bg-5 bg-sapphire-accent-bg-5 text-sapphire-accent-5",
        [AvatarColorScheme.Accent6]: "border border-sapphire-accent-bg-6 bg-sapphire-accent-bg-6 text-sapphire-accent-6",
        [AvatarColorScheme.Accent7]: "border border-sapphire-accent-bg-7 bg-sapphire-accent-bg-7 text-sapphire-accent-7",
        [AvatarColorScheme.Accent8]: "border border-sapphire-accent-bg-8 bg-sapphire-accent-bg-8 text-sapphire-accent-8",
        [AvatarColorScheme.Accent9]: "border border-sapphire-accent-bg-9 bg-sapphire-accent-bg-9 text-sapphire-accent-9",
        [AvatarColorScheme.Accent10]: "border border-sapphire-accent-bg-10 bg-sapphire-accent-bg-10 text-sapphire-accent-10",
        [AvatarColorScheme.Placeholder]: "border border-sapphire-border-primary bg-muted text-sapphire-text-tertiary",
      },
      interactive: {
        true: "cursor-pointer hover:border-sapphire-neutral-background-grey active:border-sapphire-border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-sapphire-border-accent",
        false: "",
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed",
        false: "",
      },
      toggled: {
        true: "border-sapphire-border-accent",
        false: "",
      },
    },
    compoundVariants: [
      {
        shape: AvatarShape.Square,
        size: AvatarSize.XS,
        className: "rounded-sapphire-s",    // 4px — Figma token --radius-s
      },
      {
        shape: AvatarShape.Square,
        size: AvatarSize.S,
        className: "rounded-[6px]",          // 6px — hardcoded in Figma
      },
      {
        shape: AvatarShape.Square,
        size: AvatarSize.M,
        className: "rounded-sapphire-m",    // 8px — Figma token --radius-m
      },
      {
        shape: AvatarShape.Square,
        size: AvatarSize.L,
        className: "rounded-[12px]",         // 12px — hardcoded in Figma
      },
      {
        shape: AvatarShape.Square,
        size: AvatarSize.XL,
        className: "rounded-sapphire-l",    // 16px — Figma token --radius-l
      },
      {
        interactive: true,
        disabled: true,
        className: "cursor-not-allowed hover:border-transparent active:border-transparent focus-visible:outline-none",
      },
      {
        interactive: true,
        toggled: true,
        className: "hover:border-sapphire-border-accent",
      },
    ],
    defaultVariants: {
      shape: AvatarShape.Circle,
      size: AvatarSize.M,
      colorScheme: AvatarColorScheme.Accent6,
      interactive: false,
      disabled: false,
      toggled: false,
    },
  }
);

/**
 * Icon size mapping
 */
const iconSizeMap: Record<AvatarSize | string, string> = {
  [AvatarSize.XS]: "h-[1rem] w-[1rem]",
  [AvatarSize.S]: "h-[1.125rem] w-[1.125rem]",
  [AvatarSize.M]: "h-[1.5rem] w-[1.5rem]",
  [AvatarSize.L]: "h-[2.25rem] w-[2.25rem]",
  [AvatarSize.XL]: "h-[3rem] w-[3rem]",
};

/**
 * Avatar component
 *
 * Displays user avatars with support for images, initials, icons, and badges.
 *
 * @example
 * ```tsx
 * // With image
 * <Avatar image="/user.jpg" />
 *
 * // With initials
 * <Avatar initials="JD" colorScheme="Accent1" />
 *
 * // With icon
 * <Avatar icon={<PersonPlaceholderIcon />} />
 *
 * // Interactive with badge
 * <Avatar image="/user.jpg" interactive badge={<span className="bg-green-500 h-2 w-2 rounded-full" />} />
 * ```
 */
export function Avatar({
  shape = AvatarShape.Circle,
  size = AvatarSize.M,
  colorScheme = AvatarColorScheme.Accent6,
  icon,
  image,
  fallbackImage,
  initials,
  interactive = false,
  disabled = false,
  toggled = false,
  accessibleName = "Avatar",
  badge,
  onClick,
  className,
  style,
  ref,
  "data-testid": dataTestId,
}: AvatarProps) {
    const avatarRef = useRef<HTMLDivElement>(null);
    const [imageError, setImageError] = useState(false);
    const [fallbackError, setFallbackError] = useState(false);

    useImperativeHandle(ref, () => ({
      focus: () => avatarRef.current?.focus(),
      isFocused: () => document.activeElement === avatarRef.current,
      get nativeElement() { return avatarRef.current; },
      getNativeElement: () => avatarRef.current,
    }));

    const handleImageError = () => {
      if (!imageError) {
        setImageError(true);
      } else if (fallbackImage && !fallbackError) {
        setFallbackError(true);
      }
    };

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!disabled && interactive && onClick) {
        onClick(e);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!disabled && interactive) {
        if (e.key === " ") {
          e.preventDefault();
        } else if (e.key === "Enter") {
          e.preventDefault();
          onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>);
        }
      }
    };

    const handleKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!disabled && interactive && e.key === " ") {
        onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>);
      }
    };

    // Determine what to display
    const showImage = image && !imageError;
    const showFallbackImage = !showImage && fallbackImage && !fallbackError;
    const showInitials = !showImage && !showFallbackImage && initials;
    const showIcon = !showImage && !showFallbackImage && !showInitials;

    const iconSize = iconSizeMap[size as string] || iconSizeMap[AvatarSize.M];

    return (
      <div className="relative inline-block" data-testid={dataTestId}>
        <div
          ref={avatarRef}
          role={interactive ? "button" : "img"}
          tabIndex={interactive && !disabled ? 0 : undefined}
          aria-label={showInitials ? `${accessibleName} ${initials}` : accessibleName}
          aria-disabled={disabled}
          aria-pressed={interactive && toggled ? true : undefined}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          className={cn(
            avatarVariants({
              shape: shape as AvatarShape,
              size: size as AvatarSize,
              colorScheme: colorScheme as AvatarColorScheme,
              interactive,
              disabled,
              toggled,
            }),
            (showImage || showFallbackImage) && !toggled && "border-transparent bg-transparent",
            className
          )}
          style={style}
        >
          {showImage && (
            <img
              src={image}
              alt={accessibleName || ""}
              className="h-full w-full object-cover"
              onError={handleImageError}
            />
          )}
          {showFallbackImage && (
            <img
              src={fallbackImage}
              alt={accessibleName || ""}
              className="h-full w-full object-cover"
              onError={handleImageError}
            />
          )}
          {showInitials && (
            <span className="uppercase">
              {initials.slice(0, 3)}
            </span>
          )}
          {showIcon && (
            icon ? (
              <span className={cn(iconSize, "flex items-center justify-center")}>{icon}</span>
            ) : (
              <PersonPlaceholderIcon className={iconSize} />
            )
          )}
        </div>
        {badge && (
          <div className="absolute top-0 right-0">
            {badge}
          </div>
        )}
      </div>
    );
}
