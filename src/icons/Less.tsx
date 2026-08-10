import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M454 275H58q-11 0-18.5-7T32 250t7.5-18.5T58 224h396q11 0 18.5 7.5T480 250t-7.5 18-18.5 7z'
] as const;

type LessIconProps = Omit<IconProps, "pathData">;

export const LessIcon = Object.assign(
  React.forwardRef<IconRef, LessIconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "LessIcon", iconName: "less" as const }
);
