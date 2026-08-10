# FxLayout Animations - Work in Progress

This document captures the animation implementation that was attempted but removed due to bugs and janky behavior. It can be used as a reference for future animation work.

## Overview

The goal was to animate pane transitions (show/hide) with smooth width changes and content slide+fade effects, matching the fx-layout reference implementation.

## Animation Configuration

```tsx
// Animation configuration - easy to customize
const ANIMATION = {
  duration: 350, // ms
  easing: "cubic-bezier(0.4, 0, 0.2, 1)", // Material Design standard easing
};

// CSS custom properties for animations (allows easy override via CSS)
const ANIMATION_VARS = {
  "--fx-animation-duration": `${ANIMATION.duration}ms`,
  "--fx-animation-easing": ANIMATION.easing,
} as React.CSSProperties;
```

## Animation State Management

```tsx
// Animation state - disabled on initial render to prevent flash
const [animationsEnabled, setAnimationsEnabled] = useState(false);

// Enable animations after mount
useEffect(() => {
  // Use requestAnimationFrame to ensure DOM is ready
  const raf = requestAnimationFrame(() => {
    setAnimationsEnabled(true);
  });
  return () => cancelAnimationFrame(raf);
}, []);

// Track resize state to disable animations during drag
const [isResizing, setIsResizing] = useState(false);

const handleResizeStart = useCallback(() => {
  setIsResizing(true);
}, []);

const handleResizeEnd = useCallback(() => {
  setIsResizing(false);
}, []);
```

## Transition Style Generation

```tsx
// Build transition style string - disabled during resize
const transitionStyle = animationsEnabled && !isResizing
  ? `width ${ANIMATION.duration}ms ${ANIMATION.easing}, min-width ${ANIMATION.duration}ms ${ANIMATION.easing}, opacity ${ANIMATION.duration}ms ${ANIMATION.easing}, transform ${ANIMATION.duration}ms ${ANIMATION.easing}`
  : "none";

// Content animation styles for slide+fade effect
const getContentAnimationStyle = (isVisible: boolean, direction: "left" | "right"): React.CSSProperties => ({
  opacity: isVisible ? 1 : 0,
  transform: isVisible ? "translateX(0)" : `translateX(${direction === "left" ? "-30px" : "30px"})`,
  transition: transitionStyle,
});
```

## Pane Rendering with Animations

### Start Pane
```tsx
<div
  className={cn(
    "flex flex-col h-full border-r border-border shrink-0 relative",
  )}
  style={{
    width: finalStartWidth,
    minWidth: effectiveShowStart ? PANE_MIN_WIDTH : 0,
    overflow: "hidden",
    transition: transitionStyle,
  }}
>
  <div style={getContentAnimationStyle(effectiveShowStart, "left")}>
    {startHeader}
  </div>
  <div className="flex-1 overflow-auto" style={getContentAnimationStyle(effectiveShowStart, "left")}>
    {startContent}
  </div>
  {effectiveShowStart && <ResizeHandle ... />}
</div>
```

### Center Pane
```tsx
<div
  className={cn(
    "flex flex-col h-full shrink-0 relative",
  )}
  style={{
    width: finalCenterWidth,
    minWidth: effectiveShowCenter ? PANE_MIN_WIDTH : 0,
    overflow: "hidden",
    transition: transitionStyle,
  }}
>
  <div style={getContentAnimationStyle(effectiveShowCenter, "left")}>
    {centerHeader}
  </div>
  <div className="flex-1 overflow-auto relative" style={getContentAnimationStyle(effectiveShowCenter, "left")}>
    {centerContent}
    {children}
  </div>
  {/* AI Input with animation */}
  {input && effectiveShowCenter && !effectiveShowEnd && (
    <div style={getContentAnimationStyle(effectiveShowCenter, "left")}>
      {input}
    </div>
  )}
</div>
```

### End Pane
```tsx
<div
  className={cn(
    "flex flex-col h-full border-l border-border shrink-0 relative",
  )}
  style={{
    width: finalEndWidth,
    minWidth: effectiveShowEnd ? PANE_MIN_WIDTH : 0,
    overflow: "hidden",
    transition: transitionStyle,
  }}
>
  <div style={getContentAnimationStyle(effectiveShowEnd, "right")}>
    {endHeader}
  </div>
  <div className="flex-1 overflow-auto" style={getContentAnimationStyle(effectiveShowEnd, "right")}>
    {endContent}
  </div>
  {/* AI Input with animation */}
  {input && effectiveShowEnd && (
    <div style={getContentAnimationStyle(effectiveShowEnd, "right")}>
      {input}
    </div>
  )}
  {effectiveShowEnd && <ResizeHandle ... />}
</div>
```

### Navigation Sidebar
```tsx
<div
  className={cn(
    "flex flex-col h-full border-r border-border bg-card shrink-0 overflow-hidden"
  )}
  style={{
    width: navWidth,
    transition: transitionStyle,
  }}
>
  {/* ... nav content ... */}
</div>
```

### Compact Mode Navigation Dialog
```tsx
{/* Backdrop */}
<div
  className="absolute inset-0 bg-black/50"
  style={{
    opacity: navigationOpen ? 1 : 0,
    transition: animationsEnabled
      ? `opacity var(--fx-animation-duration, ${ANIMATION.duration}ms) var(--fx-animation-easing, ${ANIMATION.easing})`
      : "none",
  }}
/>
{/* Dialog */}
<div
  className="relative w-64 h-full bg-card border-r border-border flex flex-col shadow-xl"
  style={{
    transform: navigationOpen ? "translateX(0)" : "translateX(-100%)",
    transition: animationsEnabled
      ? `transform var(--fx-animation-duration, ${ANIMATION.duration}ms) var(--fx-animation-easing, ${ANIMATION.easing})`
      : "none",
  }}
  onClick={(e) => e.stopPropagation()}
>
  {/* ... dialog content ... */}
</div>
```

## Known Issues

1. **Janky/Buggy Behavior**: The animations were not smooth and had visible glitches
2. **Width Calculation Conflicts**: Pixel-based width calculations combined with CSS transitions caused layout shifts
3. **Resize Handle Interference**: Even with `isResizing` state to disable transitions, there were timing issues
4. **React Re-render Timing**: State updates during animations caused intermediate states to be visible
5. **Min-width Transitions**: Transitioning both `width` and `min-width` simultaneously caused conflicts

## Potential Solutions for Future

1. **Use CSS-only approach**: Define CSS classes for each layout state and use CSS transitions between them
2. **Use Framer Motion or React Spring**: These libraries handle animation state better and provide layout animations
3. **Use FLIP technique**: First, Last, Invert, Play - measure positions before/after and animate the difference
4. **Separate animation from layout**: Use `transform` and `opacity` only, keep widths instant
5. **Use CSS Grid with `fr` units**: Let the browser handle proportional sizing, animate visibility separately

## Reference: fx-layout CSS

The original fx-layout uses CSS variables and transitions:
```css
:host {
  --fx-animation-duration: 350ms;
  --fx-animation-easing: cubic-bezier(0.4, 0, 0.2, 1);
}

.fx-pane {
  transition: width var(--fx-animation-duration) var(--fx-animation-easing);
}
```

The key difference is that fx-layout is a web component with Shadow DOM, which provides better isolation and control over the rendering pipeline.
