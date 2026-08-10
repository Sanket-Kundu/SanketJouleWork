import React from "react";

export interface SliderChangeDetail {
  value: number;
}

export interface SliderRef {
  focus: () => void;
  blur: () => void;
  isFocused: () => boolean;
  nativeElement: HTMLDivElement | null;
  getNativeElement: () => HTMLDivElement | null;
}

export interface SliderProps {
  ref?: React.Ref<SliderRef>;

  // === Value ===
  /** Current value (controlled mode) */
  value?: number;
  /** Default value (uncontrolled mode) */
  defaultValue?: number;
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Step increment */
  step?: number;

  // === Features ===
  /** Show value tooltip above handle on press/hover */
  showTooltip?: boolean;
  /** Show tickmark dots between steps */
  showTickmarks?: boolean;
  /** Display a label every N tickmarks (0 = no labels). Requires showTickmarks. */
  labelInterval?: number;
  /** Custom text labels — overrides numeric labels. Length should match the number of label positions. */
  labels?: string[];

  // === Behavior ===
  /** Whether the slider is disabled */
  disabled?: boolean;

  // === Accessibility ===
  /** Accessible name (aria-label) */
  accessibleName?: string;
  /** ID of labelling element (aria-labelledby) */
  accessibleNameRef?: string;

  // === Form ===
  /** Form field name */
  name?: string;

  // === Events ===
  /** Fired continuously during drag */
  onInput?: (detail: SliderChangeDetail) => void;
  /** Fired when interaction ends (mouseup, keyup) */
  onChange?: (detail: SliderChangeDetail) => void;

  // === Standard HTML ===
  className?: string;
  style?: React.CSSProperties;
  "data-testid"?: string;
}
