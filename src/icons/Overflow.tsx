import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M64 192q26 0 45 19t19 45-19 45-45 19-45-19-19-45 19-45 45-19zm192 0q26 0 45 19t19 45-19 45-45 19-45-19-19-45 19-45 45-19zm192 0q26 0 45 19t19 45-19 45-45 19-45-19-19-45 19-45 45-19z'
] as const;

type OverflowIconProps = Omit<IconProps, "pathData">;

export const OverflowIcon = Object.assign(
  React.forwardRef<IconRef, OverflowIconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "OverflowIcon", iconName: "overflow" as const }
);
