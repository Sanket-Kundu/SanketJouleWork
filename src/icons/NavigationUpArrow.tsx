import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M416 326q0 11-7.5 18.5T390 352q-10 0-18-8L256 223 140 344q-8 8-18 8-11 0-18.5-7.5T96 326q0-10 7-17l135-141q6-8 18-8 11 0 19 8l134 141q7 7 7 17z'
] as const;

type NavigationUpArrowIconProps = Omit<IconProps, "pathData">;

export const NavigationUpArrowIcon = Object.assign(
  React.forwardRef<IconRef, NavigationUpArrowIconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "NavigationUpArrowIcon", iconName: "navigation-up-arrow" as const }
);
