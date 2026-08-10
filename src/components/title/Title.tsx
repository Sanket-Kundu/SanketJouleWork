import { cn, cva } from "../../lib/utils";
import { TitleProps, TitleLevel, TitleWrappingType } from "../../types/title";

/**
 * Title variants
 */
const titleVariants = cva(
  ["text-foreground"],
  {
    variants: {
      level: {
        [TitleLevel.H1]: "text-[3.5rem] leading-[4rem] font-light",
        [TitleLevel.H2]: "text-[2.5rem] leading-[3rem] font-normal",
        [TitleLevel.H3]: "text-[2rem] leading-[2.5rem] font-normal",
        [TitleLevel.H4]: "text-xl leading-7 font-normal",
        [TitleLevel.H5]: "text-base leading-[1.375rem] font-semibold",
        [TitleLevel.H6]: "text-base leading-[1.375rem] font-normal",
      },
      wrappingType: {
        [TitleWrappingType.None]: "truncate",
        [TitleWrappingType.Normal]: "",
      },
    },
    defaultVariants: {
      level: TitleLevel.H2,
      wrappingType: TitleWrappingType.None,
    },
  }
);

/**
 * Map TitleLevel to HTML element
 */
const levelToElement: Record<string, "h1" | "h2" | "h3" | "h4" | "h5" | "h6"> = {
  [TitleLevel.H1]: "h1",
  [TitleLevel.H2]: "h2",
  [TitleLevel.H3]: "h3",
  [TitleLevel.H4]: "h4",
  [TitleLevel.H5]: "h5",
  [TitleLevel.H6]: "h6",
};

/**
 * Title component
 *
 * A semantic heading component supporting levels H1-H6.
 *
 * @example
 * ```tsx
 * <Title level="H1">Page Title</Title>
 * <Title level="H3" wrappingType="Normal">Section Title</Title>
 * ```
 */
export function Title({
  level = TitleLevel.H2,
  wrappingType = TitleWrappingType.None,
  children,
  className,
  style,
  id,
  ref,
  "data-testid": dataTestId,
}: TitleProps) {
    const Tag = levelToElement[level as string] || "h2";

    return (
      <Tag
        ref={ref}
        id={id}
        className={cn(
          titleVariants({
            level: level as TitleLevel,
            wrappingType: wrappingType as TitleWrappingType,
          }),
          className
        )}
        style={style}
        data-testid={dataTestId}
      >
        {children}
      </Tag>
    );
}
