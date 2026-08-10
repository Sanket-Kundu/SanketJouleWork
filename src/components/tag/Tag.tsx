import React, { useRef, useImperativeHandle } from "react";
import { cn } from "../../lib/utils";
import { TagProps, TagDesign } from "../../types/tag";

// ============================================================================
// DESIGN → VISUAL CLASSES
// ============================================================================

/**
 * Each design maps to a fixed visual style (bg, border, text).
 * Figma spec: height 24px, px-2 (8px), py-1 (4px), gap-1, rounded-sm (4px), semibold 12px/16px.
 */
const designClasses: Record<string, string> = {
  // Semantic
  [TagDesign.Positive]: "bg-sapphire-positive-bg text-sapphire-positive",
  [TagDesign.Negative]: "bg-sapphire-negative-bg text-sapphire-negative",
  [TagDesign.Critical]: "bg-sapphire-warning-bg text-sapphire-warning",
  [TagDesign.None]: "bg-sapphire-background-quaternary text-sapphire-text-secondary",
  [TagDesign.Information]: "bg-sapphire-info-bg text-sapphire-info",
  // Jobs
  [TagDesign.Draft]: "bg-sapphire-background-quaternary text-sapphire-text-primary",
  [TagDesign.Active]: "bg-sapphire-status-tag-active-bg text-sapphire-status-tag-active-text",
  [TagDesign.Waiting]: "bg-transparent border-sapphire-joule-foreground text-sapphire-joule-foreground",
  [TagDesign.Paused]: "bg-transparent border-sapphire-border-active text-sapphire-text-primary",
};

/** Designs that have a visible border */
const borderedDesigns = new Set<string>([TagDesign.Waiting, TagDesign.Paused]);

// ============================================================================
// MINIMAL VARIANT — border-only outline, secondary text, semantic icon colors
// ============================================================================

const minimalContainerClass = "border-sapphire-border-primary text-sapphire-text-secondary";

const minimalIconColorMap: Record<string, string> = {
  [TagDesign.Positive]: "text-sapphire-positive",
  [TagDesign.Negative]: "text-sapphire-negative",
  [TagDesign.Critical]: "text-sapphire-warning",
  [TagDesign.Information]: "text-sapphire-info",
  [TagDesign.None]: "text-sapphire-text-secondary",
};

// ============================================================================
// DESIGN → DEFAULT ICON (Figma Sapphire spec SVGs, fill=currentColor)
// ============================================================================

function IconPositive({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 0C9.31371 0 12 2.68629 12 6C12 9.31371 9.31371 12 6 12C2.68629 12 0 9.31371 0 6C0 2.68629 2.68629 0 6 0ZM6 1.125C3.30761 1.125 1.125 3.30761 1.125 6C1.125 8.69239 3.30761 10.875 6 10.875C8.69239 10.875 10.875 8.69239 10.875 6C10.875 3.30761 8.69239 1.125 6 1.125ZM7.2605 4.32129C7.46269 4.08553 7.81788 4.05836 8.05371 4.2605C8.28947 4.46269 8.31664 4.81788 8.1145 5.05371L5.8645 7.67871C5.65457 7.92349 5.26776 7.93817 5.03979 7.71021L3.91479 6.58521C3.69513 6.36554 3.69513 6.00946 3.91479 5.78979C4.13446 5.57013 4.49054 5.57013 4.71021 5.78979L5.40527 6.48486L7.2605 4.32129Z" fill="currentColor"/>
    </svg>
  );
}

function IconNegative({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 0C9.31371 0 12 2.68629 12 6C12 9.31371 9.31371 12 6 12C2.68629 12 0 9.31371 0 6C0 2.68629 2.68629 0 6 0ZM6 1.125C3.30761 1.125 1.125 3.30761 1.125 6C1.125 8.69239 3.30761 10.875 6 10.875C8.69239 10.875 10.875 8.69239 10.875 6C10.875 3.30761 8.69239 1.125 6 1.125ZM7.28979 3.91479C7.50948 3.69531 7.8656 3.69519 8.08521 3.91479C8.30463 4.13442 8.30463 4.49058 8.08521 4.71021L6.79541 6L8.08521 7.28979C8.30463 7.50942 8.30463 7.86558 8.08521 8.08521C7.8656 8.30481 7.50948 8.30469 7.28979 8.08521L6 6.79541L4.71021 8.08521C4.4906 8.30481 4.13448 8.30469 3.91479 8.08521C3.69513 7.86554 3.69513 7.50946 3.91479 7.28979L5.20459 6L3.91479 4.71021C3.69513 4.49054 3.69513 4.13446 3.91479 3.91479C4.13448 3.69531 4.4906 3.69519 4.71021 3.91479L6 5.20459L7.28979 3.91479Z" fill="currentColor"/>
    </svg>
  );
}

function IconCritical({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4.86848 1.39197C5.37707 0.536388 6.61611 0.535876 7.12507 1.39124L11.8118 9.26917C12.3322 10.144 11.7019 11.2526 10.6839 11.2526H1.31403C0.296556 11.2523 -0.333519 10.1439 0.186105 9.26917L4.86848 1.39197ZM6.15827 1.96619C6.08557 1.84406 5.90795 1.84406 5.83528 1.96619L1.1529 9.84412C1.07905 9.96896 1.16895 10.1273 1.31403 10.1276H10.6839C10.8293 10.1276 10.9193 9.96909 10.845 9.84412L6.15827 1.96619ZM5.99568 7.86951C6.40981 7.86951 6.74555 8.2054 6.74568 8.61951C6.74568 9.03372 6.40989 9.36951 5.99568 9.36951C5.5816 9.36935 5.24568 9.03362 5.24568 8.61951C5.2458 8.2055 5.58168 7.86967 5.99568 7.86951ZM5.99568 3.74451C6.30626 3.74451 6.55805 3.99646 6.55818 4.30701V6.55701C6.55818 6.86767 6.30634 7.11951 5.99568 7.11951C5.68515 7.11935 5.43318 6.86757 5.43318 6.55701V4.30701C5.4333 3.99656 5.68523 3.74467 5.99568 3.74451Z" fill="currentColor"/>
    </svg>
  );
}

function IconNone({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.2644 0.00533307C9.57207 0.047783 9.78719 0.331953 9.74487 0.639611L9.41895 3.00021H11.4375C11.7481 3.00021 11.9999 3.25215 12 3.56271C12 3.87337 11.7482 4.12521 11.4375 4.12521H9.2644L8.74658 7.87521H11.4375C11.7481 7.87521 11.9999 8.12715 12 8.43771C12 8.74837 11.7482 9.00021 11.4375 9.00021H8.59204L8.24487 11.5146C8.20241 11.8224 7.91833 12.0375 7.6106 11.9951C7.30288 11.9526 7.08768 11.6685 7.13013 11.3608L7.45605 9.00021H3.71704L3.36987 11.5146C3.32741 11.8224 3.04333 12.0375 2.7356 11.9951C2.42788 11.9526 2.21268 11.6685 2.25513 11.3608L2.58105 9.00021H0.5625C0.25184 9.00021 0 8.74837 0 8.43771C0.000115934 8.12715 0.251911 7.87521 0.5625 7.87521H2.7356L3.25342 4.12521H0.5625C0.25184 4.12521 0 3.87337 0 3.56271C0.000115741 3.25215 0.251911 3.00021 0.5625 3.00021H3.40796L3.75513 0.485802C3.79769 0.178191 4.08175 -0.0370864 4.3894 0.00533307C4.69707 0.047783 4.91219 0.331953 4.86987 0.639611L4.54395 3.00021H8.28296L8.63013 0.485802C8.67269 0.178191 8.95675 -0.0370864 9.2644 0.00533307ZM4.3894 4.12521L3.87158 7.87521H7.6106L8.12842 4.12521H4.3894Z" fill="currentColor"/>
    </svg>
  );
}

function IconInformation({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 0C9.31371 0 12 2.68629 12 6C12 9.31371 9.31371 12 6 12C2.68629 12 0 9.31371 0 6C0 2.68629 2.68629 0 6 0ZM6 1.125C3.30761 1.125 1.125 3.30761 1.125 6C1.125 8.69239 3.30761 10.875 6 10.875C8.69239 10.875 10.875 8.69239 10.875 6C10.875 3.30761 8.69239 1.125 6 1.125ZM6 5.625C6.31066 5.625 6.5625 5.87684 6.5625 6.1875V8.8125C6.5625 9.12316 6.31066 9.375 6 9.375C5.68934 9.375 5.4375 9.12316 5.4375 8.8125V6.1875C5.4375 5.87684 5.68934 5.625 6 5.625ZM6 3C6.41421 3 6.75 3.33579 6.75 3.75C6.75 4.16421 6.41421 4.5 6 4.5C5.58579 4.5 5.25 4.16421 5.25 3.75C5.25 3.33579 5.58579 3 6 3Z" fill="currentColor"/>
    </svg>
  );
}

function IconDraft({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.95035 10.7802C7.25505 10.72 7.55071 10.9186 7.61099 11.2233C7.67115 11.528 7.47326 11.8236 7.16861 11.8839C6.41066 12.0339 5.58574 12.0339 4.82779 11.8839C4.52314 11.8236 4.32526 11.528 4.38541 11.2233C4.44569 10.9186 4.74135 10.72 5.04605 10.7802C5.66097 10.9018 6.33543 10.9018 6.95035 10.7802ZM1.16348 8.55216C1.42163 8.37933 1.77142 8.44855 1.94425 8.7067C2.30023 9.23833 2.75807 9.69618 3.28971 10.0522C3.54785 10.225 3.61707 10.5748 3.44425 10.8329C3.27141 11.0908 2.92228 11.1601 2.66422 10.9875C2.01015 10.5496 1.44683 9.98625 1.00894 9.33219C0.836303 9.07412 0.905558 8.72499 1.16348 8.55216ZM10.0522 8.7067C10.225 8.44855 10.5748 8.37933 10.8329 8.55216C11.0908 8.72499 11.1601 9.07412 10.9875 9.33219C10.5496 9.98625 9.98625 10.5496 9.33218 10.9875C9.07412 11.1601 8.72499 11.0908 8.55216 10.8329C8.37933 10.5748 8.44855 10.225 8.7067 10.0522C9.23833 9.69618 9.69618 9.23833 10.0522 8.7067ZM5.8107 2.2482C6.12136 2.2482 6.3732 2.50004 6.3732 2.8107V5.71036L8.39981 7.23966C8.64749 7.4268 8.69659 7.77913 8.50968 8.02701C8.32256 8.27499 7.96957 8.32473 7.72159 8.13761L5.47159 6.43985C5.33084 6.33359 5.24826 6.16723 5.2482 5.99088V2.8107C5.2482 2.50004 5.50004 2.2482 5.8107 2.2482ZM0.112459 4.82779C0.172763 4.52314 0.468445 4.32526 0.773104 4.38541C1.07781 4.44569 1.27641 4.74135 1.21622 5.04605C1.09457 5.66097 1.09457 6.33543 1.21622 6.95035C1.27641 7.25505 1.07781 7.55072 0.773104 7.61099C0.468445 7.67115 0.172763 7.47326 0.112459 7.16861C-0.0374864 6.41066 -0.0374864 5.58574 0.112459 4.82779ZM11.2233 4.38541C11.528 4.32526 11.8236 4.52314 11.8839 4.82779C12.0339 5.58574 12.0339 6.41066 11.8839 7.16861C11.8236 7.47326 11.528 7.67115 11.2233 7.61099C10.9186 7.55072 10.72 7.25505 10.7802 6.95035C10.9018 6.33543 10.9018 5.66097 10.7802 5.04605C10.72 4.74135 10.9186 4.44569 11.2233 4.38541ZM2.66422 1.00894C2.92228 0.836303 3.27141 0.905558 3.44425 1.16348C3.61707 1.42163 3.54785 1.77142 3.28971 1.94425C2.75807 2.30023 2.30023 2.75807 1.94425 3.28971C1.77142 3.54785 1.42163 3.61707 1.16348 3.44425C0.905558 3.27141 0.836303 2.92228 1.00894 2.66422C1.44683 2.01015 2.01015 1.44683 2.66422 1.00894ZM8.55216 1.16348C8.72499 0.905558 9.07412 0.836303 9.33218 1.00894C9.98625 1.44683 10.5496 2.01015 10.9875 2.66422C11.1601 2.92228 11.0908 3.27141 10.8329 3.44425C10.5748 3.61707 10.225 3.54785 10.0522 3.28971C9.69618 2.75807 9.23833 2.30023 8.7067 1.94425C8.44855 1.77142 8.37933 1.42163 8.55216 1.16348ZM7.16861 0.112459C7.47326 0.172763 7.67115 0.468445 7.61099 0.773104C7.55071 1.07781 7.25505 1.27641 6.95035 1.21622C6.33543 1.09457 5.66097 1.09457 5.04605 1.21622C4.74135 1.27641 4.44569 1.07781 4.38541 0.773104C4.32526 0.468445 4.52314 0.172763 4.82779 0.112459C5.58574 -0.0374864 6.41066 -0.0374864 7.16861 0.112459Z" fill="currentColor"/>
    </svg>
  );
}

function IconActive({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.1875 7.5C3.49815 7.5 3.74998 7.75185 3.75 8.0625C3.75 8.37316 3.49816 8.625 3.1875 8.625H1.58863C2.64516 9.99216 4.32371 10.875 6 10.875C8.06547 10.875 10.0091 9.71735 10.9314 7.81714C11.067 7.53778 11.4034 7.42097 11.6829 7.5564C11.9623 7.69199 12.0791 8.02843 11.9436 8.30786C10.8259 10.6109 8.47945 12 6 12C4.17405 12 2.38418 11.155 1.125 9.81226V10.6875C1.125 10.9982 0.873163 11.25 0.562502 11.25C0.251842 11.25 2.3614e-06 10.9982 2.33724e-06 10.6875V8.0625C2.0437e-05 7.75185 0.251853 7.5 0.562502 7.5H3.1875ZM6 0C7.85123 0 9.62811 0.77453 10.875 2.12549V1.3125C10.875 1.00184 11.1268 0.750006 11.4375 0.75C11.7482 0.75 12 1.00184 12 1.3125V3.9375C12 4.24816 11.7482 4.5 11.4375 4.5H8.8125C8.50185 4.49999 8.25 4.24816 8.25 3.9375C8.25 3.62684 8.50185 3.37501 8.8125 3.375H10.4465C9.41906 1.95995 7.75372 1.125 6 1.125C4.00756 1.12501 2.01177 2.37221 1.06128 4.19751C0.917727 4.47287 0.577954 4.57972 0.302493 4.43628C0.0271292 4.29273 -0.0797061 3.95295 0.063723 3.67749C1.19827 1.49894 3.56754 8.85687e-06 6 0Z" fill="currentColor"/>
    </svg>
  );
}

function IconWaiting({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.0625 0C2.37316 0 2.625 0.25184 2.625 0.5625V0.98584C3.64695 0.5891 4.80205 0.69103 5.76855 1.32568C6.97313 2.12873 8.41746 2.40325 9.67456 1.56519C9.84892 1.47343 10.0596 1.47946 10.2283 1.5813C10.3968 1.68316 10.5 1.86554 10.5 2.0625V7.65015C10.4999 8.03865 10.1148 8.22234 9.82104 8.38477L9.82178 8.3855C8.51084 9.13071 6.87227 9.28435 5.5166 8.36133C5.40391 8.28602 5.29061 8.21148 5.17822 8.13574C4.43437 7.63393 3.4632 7.71249 2.625 8.26172V11.4375C2.625 11.7482 2.37316 12 2.0625 12C1.75184 12 1.5 11.7482 1.5 11.4375V0.5625C1.5 0.25184 1.75184 0 2.0625 0ZM5.17822 2.28223C4.39017 1.7506 3.41821 1.74435 2.625 2.23901V6.98877C3.6321 6.55035 4.80315 6.52518 5.80737 7.20264L6.14575 7.42896L6.15015 7.43188C7.13228 8.10042 8.4041 7.94545 9.375 7.34033V2.96338C7.94167 3.52223 6.41144 3.11409 5.17822 2.28223Z" fill="currentColor"/>
    </svg>
  );
}

function IconPaused({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 0C9.31371 0 12 2.68629 12 6C12 9.31371 9.31371 12 6 12C2.68629 12 0 9.31371 0 6C0 2.68629 2.68629 0 6 0ZM6 1.125C3.30761 1.125 1.125 3.30761 1.125 6C1.125 8.69239 3.30761 10.875 6 10.875C8.69239 10.875 10.875 8.69239 10.875 6C10.875 3.30761 8.69239 1.125 6 1.125ZM4.6875 3.75C4.99816 3.75 5.25 4.00184 5.25 4.3125V7.6875C5.25 7.99816 4.99816 8.25 4.6875 8.25C4.37684 8.25 4.125 7.99816 4.125 7.6875V4.3125C4.125 4.00184 4.37684 3.75 4.6875 3.75ZM7.3125 3.75C7.62316 3.75 7.875 4.00184 7.875 4.3125V7.6875C7.875 7.99816 7.62316 8.25 7.3125 8.25C7.00184 8.25 6.75 7.99816 6.75 7.6875V4.3125C6.75 4.00184 7.00184 3.75 7.3125 3.75Z" fill="currentColor"/>
    </svg>
  );
}

const defaultIconMap: Record<string, React.FC<{ className?: string }>> = {
  [TagDesign.Positive]: IconPositive,
  [TagDesign.Negative]: IconNegative,
  [TagDesign.Critical]: IconCritical,
  [TagDesign.None]: IconNone,
  [TagDesign.Information]: IconInformation,
  [TagDesign.Draft]: IconDraft,
  [TagDesign.Active]: IconActive,
  [TagDesign.Waiting]: IconWaiting,
  [TagDesign.Paused]: IconPaused,
};

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Tag — display-only status tag with 9 Figma designs.
 *
 * @example
 * ```tsx
 * <Tag design="Positive">Approved</Tag>
 * <Tag design="Active">Initializing</Tag>
 * <Tag design="Waiting">Waiting</Tag>
 * ```
 */
export function Tag({
  design = TagDesign.None,
  variant = "filled",
  children,
  icon,
  hideIcon = false,
  className,
  style,
  id,
  "data-testid": dataTestId,
  ref,
}: TagProps) {
  const tagRef = useRef<HTMLSpanElement>(null);
  const d = design as TagDesign;

  useImperativeHandle(
    ref,
    () => ({
      focus() { tagRef.current?.focus(); },
      blur() { tagRef.current?.blur(); },
      isFocused() { return document.activeElement === tagRef.current; },
      get nativeElement() { return tagRef.current; },
    }),
    []
  );

  // Icon resolution: custom > default > none
  let displayIcon: React.ReactNode = null;
  if (icon) {
    displayIcon = icon;
  } else if (!hideIcon) {
    const DefaultIcon = defaultIconMap[d];
    if (DefaultIcon) {
      displayIcon = <DefaultIcon className="h-3 w-3" />;
    }
  }

  const hasBorder = borderedDesigns.has(d);
  const isMinimal = variant === "outline" && minimalIconColorMap[d] !== undefined;

  // Hidden text for screen readers
  const screenReaderText = "Tag";

  return (
    <span
      ref={tagRef}
      id={id}
      className={cn(
        // Layout: h-6 (24px), px-2 (8px), py-1 (4px), gap-1, rounded-sm (4px)
        "inline-flex items-center h-6 px-2 py-1 gap-1 rounded-sm",
        // Typography: semibold 12px/16px
        "text-xs leading-4 font-semibold whitespace-nowrap",
        // Border
        isMinimal
          ? "border"
          : hasBorder ? "border" : "border border-transparent",
        // Design-specific colors
        isMinimal
          ? minimalContainerClass
          : designClasses[d] ?? designClasses[TagDesign.None],
        className
      )}
      style={style}
      data-testid={dataTestId}
      data-part="root"
    >
      <span className="sr-only">{screenReaderText}</span>
      {displayIcon && (
        <span
          className={cn(
            "inline-flex items-center justify-center flex-shrink-0 size-3",
            isMinimal && minimalIconColorMap[d],
          )}
          data-part="icon"
        >
          {displayIcon}
        </span>
      )}
      {children && (
        <span data-part="text">{children}</span>
      )}
    </span>
  );
}
