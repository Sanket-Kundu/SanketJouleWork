import { cn } from "../../lib/utils";
import { LabelProps, LabelWrappingType } from "../../types/label";

/**
 * Label component
 *
 * A native React implementation of the UI5 Label component.
 * Used to provide accessible labels for form inputs.
 */
export function Label({
  id,
  for: forProp,
  htmlFor,
  showColon = false,
  required = false,
  wrappingType = LabelWrappingType.Normal,
  children,
  text,
  className,
  style,
  "data-testid": dataTestId,
  ref,
}: LabelProps) {
    // Support both `for` and `htmlFor` props
    const labelFor = forProp ?? htmlFor;

    // Label content
    const labelContent = children ?? text;

    return (
      <label
        ref={ref}
        id={id}
        htmlFor={labelFor}
        className={cn(
          "text-sm font-normal text-sapphire-text-tertiary",
          wrappingType === LabelWrappingType.None && "truncate",
          wrappingType === LabelWrappingType.Normal && "break-words",
          className
        )}
        style={style}
        data-testid={dataTestId}
      >
        {labelContent}
        {showColon && ":"}
        {required && (
          <span className="text-destructive ml-0.5" aria-hidden="true">
            *
          </span>
        )}
        {required && <span className="sr-only">(required)</span>}
      </label>
    );
}
