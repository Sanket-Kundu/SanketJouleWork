import * as React from "react";
import {
  useRef,
  useState,
  useCallback,
  useImperativeHandle,
  useId,
  useEffect,
} from "react";
import { cn, subTestId } from "../../lib/utils";
import { CollapseIcon } from "../../icons/Collapse";
import { ExpandIcon } from "../../icons/Expand";
import { NavigationRightArrowIcon } from "../../icons/NavigationRightArrow";
import {
  PanelProps,
  PanelAccessibleRole,
  PanelDesign,
} from "../../types/panel";
import { TitleLevel } from "../../types/title";

// ============================================================================
// ARIA ROLE MAPPING
// ============================================================================

const roleMap: Record<string, string> = {
  [PanelAccessibleRole.Complementary]: "complementary",
  [PanelAccessibleRole.Form]: "form",
  [PanelAccessibleRole.Region]: "region",
};

// ============================================================================
// HEADING LEVEL MAPPING
// ============================================================================

const levelToTag: Record<string, "h1" | "h2" | "h3" | "h4" | "h5" | "h6"> = {
  [TitleLevel.H1]: "h1",
  [TitleLevel.H2]: "h2",
  [TitleLevel.H3]: "h3",
  [TitleLevel.H4]: "h4",
  [TitleLevel.H5]: "h5",
  [TitleLevel.H6]: "h6",
};

// ============================================================================
// DESIGN VARIANT CLASS MAPS
// ============================================================================

/** Root container classes per design variant */
const rootDesignClasses: Record<string, string> = {
  [PanelDesign.Primary]:   "bg-sapphire-card-bg-primary border border-sapphire-border-primary",
  [PanelDesign.Secondary]: "bg-sapphire-background-secondary border border-sapphire-border-primary",
  [PanelDesign.Child]:     "",
};

/** Header padding & gap per design variant */
const headerDesignClasses: Record<string, string> = {
  [PanelDesign.Primary]:   "pl-3 pr-4 py-3 gap-3",
  [PanelDesign.Secondary]: "pl-3 pr-4 py-3 gap-3",
  [PanelDesign.Child]:     "pl-1 pr-2 py-1 gap-1",
};

/** Header title text size per design variant */
const headerTitleClasses: Record<string, string> = {
  [PanelDesign.Primary]:   "text-base font-semibold",
  [PanelDesign.Secondary]: "text-base font-semibold",
  [PanelDesign.Child]:     "text-sm font-semibold",
};

/** Content padding per design variant (when noPadding is false) */
const contentDesignClasses: Record<string, string> = {
  [PanelDesign.Primary]:   "p-4",
  [PanelDesign.Secondary]: "p-4",
  [PanelDesign.Child]:     "p-3",
};

/**
 * Opaque header background per design variant.
 * Primary/Secondary get their surface color so content doesn't bleed through on scroll.
 * Child has no inherent background — it uses bg-background only when sticky (see below).
 */
const headerBgClasses: Record<string, string> = {
  [PanelDesign.Primary]:   "bg-sapphire-card-bg-primary",
  [PanelDesign.Secondary]: "bg-sapphire-background-secondary",
  [PanelDesign.Child]:     "bg-background",
};

/** Footer classes per design variant */
const footerDesignClasses: Record<string, string> = {
  [PanelDesign.Primary]:   "px-4 py-4",
  [PanelDesign.Secondary]: "px-4 py-4 bg-sapphire-card-bg-secondary",
  [PanelDesign.Child]:     "",
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function Panel(props: PanelProps) {
    const {
      // Visual
      design = PanelDesign.Primary,

      // Content
      children,
      headerText,
      header,
      subtitle,
      endSlot,
      footer,

      // Behavior
      fixed = false,
      collapsed: controlledCollapsed,
      defaultCollapsed = false,
      noAnimation = false,
      stickyHeader = false,
      noPadding = false,

      // Accessibility
      accessibleRole = PanelAccessibleRole.Form,
      headerLevel = TitleLevel.H2,
      accessibleName,

      // Events
      onToggle,

      // Standard
      className,
      style,
      id: providedId,
      "data-testid": dataTestId,
      ref,
    } = props;

    // Refs
    const panelRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const contentWrapperRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    // IDs for ARIA linkage
    const generatedId = useId();
    const panelId = providedId || generatedId;
    const headerId = `${panelId}-header`;
    const contentId = `${panelId}-content`;

    // Controlled vs uncontrolled collapsed state
    const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
    const isControlled = controlledCollapsed !== undefined;
    const isCollapsed = fixed ? false : (isControlled ? controlledCollapsed : internalCollapsed);

    // Animation ref to allow cancellation
    const animationRef = useRef<number | null>(null);
    const prevCollapsedRef = useRef(isCollapsed);
    // Track whether content should be visible (controls display:none after collapse)
    const [contentExpanded, setContentExpanded] = useState(!isCollapsed);

    // Imperative handle
    useImperativeHandle(ref, () => ({
      focus() { headerRef.current?.focus(); },
      blur() { headerRef.current?.blur(); },
      isFocused() { return document.activeElement === headerRef.current; },
      get nativeElement() { return panelRef.current; },
    }), []);

    // Toggle handler
    const handleToggle = useCallback(() => {
      if (fixed) return;

      const newCollapsed = !isCollapsed;
      if (!isControlled) {
        setInternalCollapsed(newCollapsed);
      }
      onToggle?.({ collapsed: newCollapsed });
    }, [fixed, isCollapsed, isControlled, onToggle]);

    // Keyboard handling matching UI5 button pattern:
    // - Enter fires on keydown
    // - Space fires on keyup (so Escape can cancel a pending toggle)
    const pendingToggleRef = useRef(false);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
      if (fixed) return;

      if (e.key === "Enter") {
        e.preventDefault();
        handleToggle();
      }

      if (e.key === " ") {
        e.preventDefault(); // prevent page scroll
        pendingToggleRef.current = true;
      }

      // Cancel pending Space toggle with Escape
      if (e.key === "Escape" && pendingToggleRef.current) {
        e.preventDefault();
        pendingToggleRef.current = false;
      }
    }, [fixed, handleToggle]);

    const handleKeyUp = useCallback((e: React.KeyboardEvent) => {
      if (fixed) return;

      if (e.key === " ") {
        if (pendingToggleRef.current) {
          handleToggle();
        }
        pendingToggleRef.current = false;
      }
    }, [fixed, handleToggle]);

    // RAF-based slide animation matching UI5 slideUp/slideDown
    // Animates height + padding simultaneously over 400ms linear
    useEffect(() => {
      const wrapper = contentWrapperRef.current;
      if (!wrapper) {
        prevCollapsedRef.current = isCollapsed;
        return;
      }

      const wasCollapsed = prevCollapsedRef.current;
      prevCollapsedRef.current = isCollapsed;

      // No state change — skip
      if (wasCollapsed === isCollapsed) return;

      // No animation mode: just toggle display
      if (noAnimation || fixed) {
        if (isCollapsed) {
          wrapper.style.display = "none";
          setContentExpanded(false);
        } else {
          wrapper.style.display = "";
          setContentExpanded(true);
        }
        return;
      }

      // Cancel any in-flight animation
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }

      const DURATION = 400; // ms, matching UI5

      if (isCollapsed) {
        // --- slideUp (collapse) ---
        const computed = getComputedStyle(wrapper);
        const startHeight = parseFloat(computed.height);
        const startPaddingTop = parseFloat(computed.paddingTop);
        const startPaddingBottom = parseFloat(computed.paddingBottom);

        wrapper.style.overflow = "hidden";

        let start: number | null = null;
        const step = (timestamp: number) => {
          if (start === null) start = timestamp;
          const elapsed = timestamp - start;
          const progress = Math.min(elapsed / DURATION, 1);

          wrapper.style.height = `${startHeight * (1 - progress)}px`;
          wrapper.style.paddingTop = `${startPaddingTop * (1 - progress)}px`;
          wrapper.style.paddingBottom = `${startPaddingBottom * (1 - progress)}px`;

          if (progress < 1) {
            animationRef.current = requestAnimationFrame(step);
          } else {
            // Animation complete: hide and clean up inline styles
            wrapper.style.display = "none";
            wrapper.style.overflow = "";
            wrapper.style.height = "";
            wrapper.style.paddingTop = "";
            wrapper.style.paddingBottom = "";
            animationRef.current = null;
            setContentExpanded(false);
          }
        };

        animationRef.current = requestAnimationFrame(step);
      } else {
        // --- slideDown (expand) ---
        // Make visible to measure
        wrapper.style.display = "block";
        setContentExpanded(true);

        const computed = getComputedStyle(wrapper);
        const targetHeight = parseFloat(computed.height);
        const targetPaddingTop = parseFloat(computed.paddingTop);
        const targetPaddingBottom = parseFloat(computed.paddingBottom);

        // Start from 0
        wrapper.style.overflow = "hidden";
        wrapper.style.height = "0px";
        wrapper.style.paddingTop = "0px";
        wrapper.style.paddingBottom = "0px";

        let start: number | null = null;
        const step = (timestamp: number) => {
          if (start === null) start = timestamp;
          const elapsed = timestamp - start;
          const progress = Math.min(elapsed / DURATION, 1);

          wrapper.style.display = "block";
          wrapper.style.height = `${targetHeight * progress}px`;
          wrapper.style.paddingTop = `${targetPaddingTop * progress}px`;
          wrapper.style.paddingBottom = `${targetPaddingBottom * progress}px`;

          if (progress < 1) {
            animationRef.current = requestAnimationFrame(step);
          } else {
            // Animation complete: clean up inline styles
            wrapper.style.overflow = "";
            wrapper.style.height = "";
            wrapper.style.paddingTop = "";
            wrapper.style.paddingBottom = "";
            animationRef.current = null;
          }
        };

        animationRef.current = requestAnimationFrame(step);
      }

      // Cleanup on unmount or re-trigger
      return () => {
        if (animationRef.current !== null) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = null;
        }
      };
    }, [isCollapsed, noAnimation, fixed]);

    // Derived values
    const resolvedDesign = (design as string) in rootDesignClasses ? (design as string) : PanelDesign.Primary;
    const ariaRole = roleMap[accessibleRole as string] || "form";
    const HeadingTag = levelToTag[headerLevel as string] || "h2";
    const hasHeader = headerText || header;
    const isInteractive = !fixed;
    const isChild = resolvedDesign === PanelDesign.Child;

    const toggleIcon = isChild ? (
      <NavigationRightArrowIcon
        className={cn(
          "h-4 w-4 text-sapphire-text-primary",
          !noAnimation && "transition-transform duration-200",
          !isCollapsed && "rotate-90"
        )}
        aria-hidden="true"
      />
    ) : isCollapsed ? (
      <ExpandIcon className="h-4 w-4 text-sapphire-text-primary" aria-hidden="true" />
    ) : (
      <CollapseIcon className="h-4 w-4 text-sapphire-text-primary" aria-hidden="true" />
    );

    return (
      <div
        ref={panelRef}
        id={panelId}
        role={ariaRole}
        aria-label={accessibleName}
        aria-labelledby={!accessibleName && hasHeader ? headerId : undefined}
        className={cn(
          "rounded-lg overflow-clip text-sapphire-text-primary",
          rootDesignClasses[resolvedDesign],
          className
        )}
        style={style}
        data-testid={dataTestId}
        data-part="root"
      >
        {/* Header */}
        {(hasHeader || isInteractive) && (
          <div
            ref={headerRef}
            id={headerId}
            role={isInteractive ? "button" : undefined}
            tabIndex={isInteractive ? 0 : undefined}
            aria-expanded={isInteractive ? !isCollapsed : undefined}
            aria-controls={isInteractive ? contentId : undefined}
            onClick={isInteractive ? handleToggle : undefined}
            onKeyDown={isInteractive ? handleKeyDown : undefined}
            onKeyUp={isInteractive ? handleKeyUp : undefined}
            className={cn(
              "flex items-center min-h-11",
              headerDesignClasses[resolvedDesign],
              !stickyHeader && headerBgClasses[resolvedDesign],
              stickyHeader && cn("sticky top-0 z-10", headerBgClasses[resolvedDesign]),
              isInteractive && "cursor-pointer hover:bg-accent transition-colors",
              isInteractive && "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-inset",
              "select-none",
              isChild ? "rounded-lg" : "rounded-t-lg",
              isCollapsed && !isChild && "rounded-b-lg"
            )}
            data-part="header"
            data-testid={subTestId(dataTestId, "header")}
          >
            {/* Toggle icon */}
            {isInteractive && (
              <div className="flex items-center justify-center shrink-0 size-8">
                {toggleIcon}
              </div>
            )}

            {/* Header content: custom header slot OR headerText + subtitle + endSlot */}
            {header ? (
              <div className="flex-1 min-w-0" data-part="header-content">
                {header}
              </div>
            ) : (
              <>
                {(headerText || subtitle) && (
                  <div className="flex-1 min-w-0">
                    {headerText && (
                      <HeadingTag
                        className={cn(
                          "text-sapphire-text-primary truncate m-0",
                          headerTitleClasses[resolvedDesign],
                        )}
                        data-part="header-text"
                      >
                        {headerText}
                      </HeadingTag>
                    )}
                    {subtitle && (
                      <p
                        className="text-sm text-sapphire-text-tertiary truncate m-0"
                        data-part="header-subtitle"
                      >
                        {subtitle}
                      </p>
                    )}
                  </div>
                )}
                {endSlot && (
                  <div
                    className="flex-shrink-0"
                    data-part="header-end-slot"
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                    onKeyUp={(e) => e.stopPropagation()}
                  >
                    {endSlot}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Content area */}
        <div
          ref={contentWrapperRef}
          id={contentId}
          role="region"
          aria-labelledby={hasHeader ? headerId : undefined}
          style={!contentExpanded ? { display: "none" } : undefined}
          data-part="content"
          data-testid={subTestId(dataTestId, "content")}
        >
          <div
            ref={contentRef}
            className={cn(
              noPadding ? "" : contentDesignClasses[resolvedDesign]
            )}
          >
            {children}
          </div>
          {footer && !isChild && (
            <div
              className={cn(
                "flex items-center gap-2",
                footerDesignClasses[resolvedDesign],
              )}
              data-part="footer"
            >
              {footer}
            </div>
          )}
        </div>
      </div>
    );
}
