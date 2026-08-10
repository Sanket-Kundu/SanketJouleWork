import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M122 480q-11 0-18.5-7.5T96 454V58q0-11 7.5-18.5T122 32q7 0 15 5l269 198q10 8 10 21t-10 21L137 475q-8 5-15 5zm25-372v296l200-148z'
] as const;

type MediaPlayIconProps = Omit<IconProps, "pathData">;

export const MediaPlayIcon = Object.assign(
  React.forwardRef<IconRef, MediaPlayIconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "MediaPlayIcon", iconName: "media-play" as const }
);
