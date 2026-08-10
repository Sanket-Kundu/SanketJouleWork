import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  "M3 8 A 1 1 0 0 1 4 9 V 11 A 1 1 0 0 1 3 12 A 1 1 0 0 1 2 11 V 9 A 1 1 0 0 1 3 8 Z M7 5 A 1 1 0 0 1 8 6 V 14 A 1 1 0 0 1 7 15 A 1 1 0 0 1 6 14 V 6 A 1 1 0 0 1 7 5 Z M11 3 A 1 1 0 0 1 12 4 V 16 A 1 1 0 0 1 11 17 A 1 1 0 0 1 10 16 V 4 A 1 1 0 0 1 11 3 Z M15 6 A 1 1 0 0 1 16 7 V 13 A 1 1 0 0 1 15 14 A 1 1 0 0 1 14 13 V 7 A 1 1 0 0 1 15 6 Z"
] as const;

type WaveformIconProps = Omit<IconProps, "pathData" | "viewBox" | "pathMeta">;

export const WaveformIcon = Object.assign(
  React.forwardRef<IconRef, WaveformIconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} viewBox="0 0 20 20" {...props} />
  ),
  { displayName: "WaveformIcon", iconName: "waveform" as const }
);
