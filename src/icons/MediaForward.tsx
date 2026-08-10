import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M503 236q9 7 9 20 0 12-9 20L298 442q-7 6-16 6-11 0-18.5-7.5T256 422V90q0-11 7.5-18.5T282 64q9 0 16 6zm-256 0q9 7 9 20 0 12-9 20L42 442q-7 6-16 6-11 0-18.5-7.5T0 422V90q0-11 7.5-18.5T26 64q9 0 16 6zm199 20L307 143v226zm-256 0L51 143v226z'
] as const;

type MediaForwardIconProps = Omit<IconProps, "pathData">;

export const MediaForwardIcon = Object.assign(
  React.forwardRef<IconRef, MediaForwardIconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "MediaForwardIcon", iconName: "media-forward" as const }
);
