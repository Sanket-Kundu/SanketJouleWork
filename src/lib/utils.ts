import { twMerge } from "tailwind-merge";

// ─── clsx (inlined) ──────────────────────────────────────────────
// Replaces the `clsx` npm package. Constructs className strings from
// mixed inputs: strings, numbers, objects, arrays, and falsy values.

export type ClassValue = ClassValue[] | readonly ClassValue[] | Record<string, unknown> | string | number | bigint | null | boolean | undefined;

function toVal(mix: ClassValue): string {
  let str = "";
  if (typeof mix === "string" || typeof mix === "number") {
    str += mix;
  } else if (typeof mix === "object") {
    if (Array.isArray(mix)) {
      for (let i = 0; i < mix.length; i++) {
        if (mix[i]) {
          const y = toVal(mix[i]);
          if (y) {
            if (str) str += " ";
            str += y;
          }
        }
      }
    } else {
      for (const k in mix as Record<string, unknown>) {
        if ((mix as Record<string, unknown>)[k]) {
          if (str) str += " ";
          str += k;
        }
      }
    }
  }
  return str;
}

export function clsx(...inputs: ClassValue[]): string {
  let str = "";
  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i]) {
      const y = toVal(inputs[i]);
      if (y) {
        if (str) str += " ";
        str += y;
      }
    }
  }
  return str;
}

// ─── cva (inlined) ───────────────────────────────────────────────
// Replaces the `class-variance-authority` npm package. Creates
// variant-driven className builder functions.

type ClassProp = { class?: ClassValue; className?: ClassValue };
type ConfigSchema = Record<string, Record<string, ClassValue>>;

type ConfigVariants<T extends ConfigSchema> = {
  [Variant in keyof T]?: keyof T[Variant] | null | undefined | boolean;
};

type Config<T extends ConfigSchema> = {
  variants?: T;
  defaultVariants?: ConfigVariants<T>;
  compoundVariants?: (ConfigVariants<T> & ClassProp)[];
};

export type VariantProps<T extends (...args: never[]) => unknown> =
  T extends (props: infer P) => string ? Omit<P, "class" | "className"> : never;

const falsyToString = (value: unknown): string | unknown =>
  typeof value === "boolean" ? `${value}` : value === 0 ? "0" : value;

export function cva<T extends ConfigSchema>(
  base?: ClassValue,
  config?: Config<T>,
) {
  return (props?: ConfigVariants<T> & ClassProp): string => {
    if (config?.variants == null) {
      return clsx(base, props?.class, props?.className);
    }

    const { variants, defaultVariants } = config;

    const variantClassNames = Object.keys(variants).map((variant) => {
      const variantProp = (props as Record<string, unknown>)?.[variant];
      const defaultVariantProp = (defaultVariants as Record<string, unknown>)?.[variant];

      if (variantProp === null) return null;

      const variantKey = (falsyToString(variantProp) || falsyToString(defaultVariantProp)) as string;
      return variants[variant]?.[variantKey];
    });

    const propsWithoutUndefined = props
      ? Object.entries(props).reduce<Record<string, unknown>>((acc, [key, value]) => {
          if (value !== undefined) acc[key] = value;
          return acc;
        }, {})
      : {};

    const compoundVariantClassNames = config.compoundVariants?.reduce<ClassValue[]>(
      (acc, { class: cvClass, className: cvClassName, ...compoundVariantOptions }) => {
        return Object.entries(compoundVariantOptions).every(([key, value]) => {
          const merged = { ...defaultVariants, ...propsWithoutUndefined };
          return Array.isArray(value)
            ? value.includes((merged as Record<string, unknown>)[key])
            : (merged as Record<string, unknown>)[key] === value;
        })
          ? [...acc, cvClass, cvClassName]
          : acc;
      },
      [],
    );

    return clsx(base, variantClassNames, compoundVariantClassNames, props?.class, props?.className);
  };
}

// ─── cn ──────────────────────────────────────────────────────────
// Utility function to merge Tailwind CSS classes. Combines clsx for
// conditional classes with tailwind-merge for proper Tailwind class merging.

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Find the first focusable element within a container
 * @param container - The container element to search within
 * @returns The first focusable element or null
 */
export function findFirstFocusable(container: HTMLElement | null): HTMLElement | null {
  if (!container) return null;

  const focusableSelector = [
    'button:not([disabled])',
    '[href]',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ');

  return container.querySelector<HTMLElement>(focusableSelector);
}

// ─── subTestId ───────────────────────────────────────────────────
// Helper for compound components that derive child `data-testid`
// values from a parent root testid using kebab-case suffixes.
//
// Example:
//   <Dialog data-testid="my-dialog">    →  <dialog data-testid="my-dialog">
//     close button auto-receives          <button data-testid="my-dialog-close">
//     back button auto-receives           <button data-testid="my-dialog-back">
//
// When the root testid is undefined, derived values are also undefined
// (so consumers who don't opt in see no extra DOM attributes).
//
// See CLAUDE.md → "data-testid forwarding" for the convention.

/**
 * Derive a sub-element `data-testid` from a root testid plus a kebab-case suffix.
 * Returns `undefined` when `root` is undefined so the attribute is omitted from the DOM.
 *
 * @param root   Parent component's `data-testid` (typically the consumer-supplied value)
 * @param suffix Kebab-case sub-element identifier — e.g. `"close"`, `"back"`, `"arrow"`
 */
export function subTestId(root: string | undefined, suffix: string): string | undefined {
  return root ? `${root}-${suffix}` : undefined;
}
