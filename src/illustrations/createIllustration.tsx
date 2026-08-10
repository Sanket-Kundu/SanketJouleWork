import * as React from "react";
import { IllustrationSize } from "../types/illustrated-message";
import { IllustratedMessage } from "../components/illustrated-message/IllustratedMessage";
import { useIllustrationSizeContext } from "../components/illustrated-message/IllustrationContext";
import type {
  SvgComponent,
  IllustrationProps,
  IllustrationComponent,
} from "./types";

type LazyImportFn = () => Promise<{ default: SvgComponent }>;

interface CreateIllustrationConfig {
  name: string;
  title: string;
  subtitle: string;
  /** Lazy import functions — only the needed size is fetched */
  lazyExtraSmall: LazyImportFn;
  lazySmall: LazyImportFn;
  lazyMedium: LazyImportFn;
  lazyLarge: LazyImportFn;
}

/**
 * Creates a lazy wrapper component that renders a React.lazy SVG inside Suspense.
 * Used for the .ExtraSmall / .Small / .Medium / .Large static properties.
 */
function makeLazySvg(importFn: LazyImportFn): SvgComponent {
  const Lazy = React.lazy(importFn);
  const Wrapper: SvgComponent = ({ className }) => (
    <React.Suspense fallback={null}>
      <Lazy className={className} />
    </React.Suspense>
  );
  return Wrapper;
}

/**
 * Factory function that creates an illustration component.
 *
 * The returned component:
 * - Renders IllustratedMessage internally (all-in-one API)
 * - Lazy-loads only the SVG variant for the resolved size
 * - Renders null until the dynamic import resolves
 * - Has `.ExtraSmall`, `.Small`, `.Medium`, `.Large` for direct lazy SVG access
 * - Has `.metadata` with name, title, subtitle
 */
export function createIllustration(
  config: CreateIllustrationConfig
): IllustrationComponent {
  const {
    name,
    title,
    subtitle,
    lazyExtraSmall,
    lazySmall,
    lazyMedium,
    lazyLarge,
  } = config;

  // Create lazy components for each size (shared across all instances)
  const lazyVariants: Record<string, React.LazyExoticComponent<SvgComponent>> = {
    [IllustrationSize.ExtraSmall]: React.lazy(lazyExtraSmall),
    [IllustrationSize.Small]: React.lazy(lazySmall),
    [IllustrationSize.Medium]: React.lazy(lazyMedium),
    [IllustrationSize.Large]: React.lazy(lazyLarge),
  };

  const defaultLazy = lazyVariants[IllustrationSize.Medium];

  const Illustration: React.FC<IllustrationProps> = ({
    design,
    titleText,
    subtitleText,
    title: titleSlot,
    subtitle: subtitleSlot,
    children,
    decorative,
    accessibleName,
    className,
    style,
    id,
    "data-testid": dataTestId,
  }) => {
    const resolvedTitleText = titleText ?? title;
    const resolvedSubtitleText = subtitleText ?? subtitle;

    return (
      <IllustratedMessage
        design={design}
        illustration={
          <LazyIllustrationBridge
            lazyVariants={lazyVariants}
            fallback={defaultLazy}
          />
        }
        titleText={titleSlot ? undefined : resolvedTitleText}
        title={titleSlot}
        subtitleText={subtitleSlot ? undefined : resolvedSubtitleText}
        subtitle={subtitleSlot}
        decorative={decorative}
        accessibleName={accessibleName || name}
        className={className}
        style={style}
        id={id}
        data-testid={dataTestId}
      >
        {children}
      </IllustratedMessage>
    );
  };

  const component = Illustration as IllustrationComponent;
  component.displayName = name;
  component.ExtraSmall = makeLazySvg(lazyExtraSmall);
  component.Small = makeLazySvg(lazySmall);
  component.Medium = makeLazySvg(lazyMedium);
  component.Large = makeLazySvg(lazyLarge);
  component.metadata = { name, title, subtitle };

  return component;
}

/**
 * Internal bridge component that reads IllustrationSizeContext
 * from the parent IllustratedMessage and lazy-loads the matching SVG variant.
 */
function LazyIllustrationBridge({
  lazyVariants,
  fallback,
}: {
  lazyVariants: Record<string, React.LazyExoticComponent<SvgComponent>>;
  fallback: React.LazyExoticComponent<SvgComponent>;
}) {
  const resolvedSize = useIllustrationSizeContext();

  if (resolvedSize === IllustrationSize.Base) return null;

  const LazySvg = lazyVariants[resolvedSize] || fallback;
  return (
    <React.Suspense fallback={null}>
      <LazySvg />
    </React.Suspense>
  );
}
