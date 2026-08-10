import { useRef, useImperativeHandle } from "react";
import { cn, cva } from "../../lib/utils";
import { BarProps, BarDesign, BarAccessibleRole } from "../../types/bar";

/**
 * Shared child styles matching UI5's ::slotted(*) behavior.
 * Spacing applies to all direct children.
 * Truncation (nowrap/ellipsis) only targets non-div elements (span, a, p, etc.)
 * to avoid breaking flex container children (div wrappers with gap/flex layout).
 */
const childStyles = [
  "[&>*]:mx-1 [&>*]:max-w-full [&>*]:box-border",
  "[&>:not(div)]:whitespace-nowrap [&>:not(div)]:overflow-hidden [&>:not(div)]:text-ellipsis",
].join(" ");

/**
 * Bar design variants using CVA
 */
const barVariants = cva(
  [
    "flex items-center justify-between w-full overflow-hidden box-border",
  ],
  {
    variants: {
      design: {
        [BarDesign.Header]: [
          "h-11",
          "bg-[var(--sapPageHeader_Background,var(--card))]",
          "shadow-[var(--sapContent_HeaderShadow,0_0_0.25rem_0_rgba(0,0,0,0.15))]",
        ],
        [BarDesign.Subheader]: [
          "h-12 -mt-px",
          "bg-[var(--sapPageHeader_Background,var(--card))]",
          "shadow-[var(--sapContent_HeaderShadow,0_0_0.25rem_0_rgba(0,0,0,0.15))]",
        ],
        [BarDesign.Footer]: [
          "h-11 shadow-none",
          "bg-[var(--sapPageFooter_Background,var(--muted))]",
          "border-t border-[var(--sapPageFooter_BorderColor,var(--border))]",
        ],
        [BarDesign.FloatingFooter]: [
          "h-11 border-none",
          "bg-[var(--sapPageFooter_Background,var(--muted))]",
          "rounded-[var(--sapElement_BorderCornerRadius,var(--radius))]",
          "shadow-[var(--sapContent_Shadow1,0_0_1rem_0_rgba(0,0,0,0.15))]",
        ],
      },
    },
    defaultVariants: {
      design: BarDesign.Header,
    },
  }
);

/**
 * Bar component
 *
 * A container primarily used to hold titles, buttons and input elements.
 * Its design and functionality is the basis for page headers and footers.
 * The component consists of three areas: startContent, children (middle), and endContent.
 * The middle content is centered in the available space between start and end areas.
 *
 * @example
 * ```tsx
 * // Page header with title and actions
 * <Bar
 *   startContent={<Button icon={<ArrowLeft />} />}
 *   endContent={<Button>Save</Button>}
 * >
 *   <Title>Page Title</Title>
 * </Bar>
 *
 * // Footer bar
 * <Bar design="Footer" endContent={<Button design="Primary">Submit</Button>} />
 *
 * // Floating footer
 * <Bar design="FloatingFooter" endContent={<Button>Accept</Button>}>
 *   Terms and conditions
 * </Bar>
 * ```
 */
export function Bar({
  design = BarDesign.Header,
  accessibleRole = BarAccessibleRole.Toolbar,
  accessibleName,
  accessibleNameRef,
  startContent,
  children,
  endContent,
  className,
  style,
  id,
  "data-testid": dataTestId,
  ref,
}: BarProps) {
    const barRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(
      ref,
      () => ({
        focus() {
          barRef.current?.focus();
        },
        blur() {
          barRef.current?.blur();
        },
        isFocused() {
          return document.activeElement === barRef.current;
        },
        get nativeElement() {
          return barRef.current;
        },
      }),
      []
    );

    const isToolbar = (accessibleRole as string) !== "None";

    const effectiveRole = isToolbar ? ("toolbar" as const) : undefined;

    const effectiveAriaLabel = isToolbar
      ? accessibleName || (accessibleNameRef ? undefined : (design as string))
      : accessibleName;

    return (
      <div
        ref={barRef}
        id={id}
        role={effectiveRole}
        aria-label={accessibleNameRef ? undefined : effectiveAriaLabel}
        aria-labelledby={accessibleNameRef}
        className={cn(barVariants({ design: design as BarDesign }), className)}
        style={style}
        data-testid={dataTestId}
        data-design={design}
      >
        {/* Start content */}
        <div
          className={cn(
            "flex items-center shrink basis-auto grow-0 ps-4 min-w-0",
            childStyles
          )}
          data-part="startContent"
        >
          {startContent}
        </div>

        {/* Middle content — centered in remaining space */}
        <div
          className={cn(
            "flex items-center justify-center flex-auto px-2 min-w-0 overflow-hidden",
            childStyles
          )}
          data-part="midContent"
        >
          {children}
        </div>

        {/* End content */}
        <div
          className={cn(
            "flex items-center shrink-0 grow-0 basis-auto pe-4 min-w-0",
            childStyles
          )}
          data-part="endContent"
        >
          {endContent}
        </div>
      </div>
    );
}
