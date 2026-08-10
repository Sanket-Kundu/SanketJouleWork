import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M454 115H58q-11 0-18.5-7T32 90t7.5-18.5T58 64h396q11 0 18.5 7.5T480 90t-7.5 18-18.5 7zm0 109H250q-11 0-18.5-7.5T224 198t7.5-18 18.5-7h204q11 0 18.5 7t7.5 18-7.5 18.5T454 224z'
] as const;

type DetailLessIconProps = Omit<IconProps, "pathData">;

export const DetailLessIcon = Object.assign(
  React.forwardRef<IconRef, DetailLessIconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "DetailLessIcon", iconName: "detail-less" as const }
);
