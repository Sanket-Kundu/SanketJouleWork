import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M96 186q0-11 7.5-18.5T122 160q10 0 18 8l116 121 116-121q8-8 18-8 11 0 18.5 7.5T416 186q0 10-7 17L275 344q-8 8-19 8-12 0-18-8L103 203q-7-7-7-17z'
] as const;

type NavigationDownArrowIconProps = Omit<IconProps, "pathData">;

export const NavigationDownArrowIcon = Object.assign(
  React.forwardRef<IconRef, NavigationDownArrowIconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "NavigationDownArrowIcon", iconName: "navigation-down-arrow" as const }
);
