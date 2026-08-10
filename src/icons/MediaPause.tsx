import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M358 480h-33q-11 0-18.5-7.5T299 454V58q0-11 7.5-18.5T325 32h33q11 0 18.5 7.5T384 58v396q0 11-7.5 18.5T358 480zm-171 0h-33q-11 0-18.5-7.5T128 454V58q0-11 7.5-18.5T154 32h33q11 0 18.5 7.5T213 58v396q0 11-7.5 18.5T187 480z'
] as const;

type MediaPauseIconProps = Omit<IconProps, "pathData">;

export const MediaPauseIcon = Object.assign(
  React.forwardRef<IconRef, MediaPauseIconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "MediaPauseIcon", iconName: "media-pause" as const }
);
