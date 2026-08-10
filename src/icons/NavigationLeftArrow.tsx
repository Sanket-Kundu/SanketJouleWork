import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M326 416q-10 0-17-7L168 274q-8-6-8-18 0-11 8-19l141-134q7-7 17-7 11 0 18.5 7.5T352 122q0 10-8 18L223 256l121 116q8 8 8 18 0 11-7.5 18.5T326 416z'
] as const;

type NavigationLeftArrowIconProps = Omit<IconProps, "pathData">;

export const NavigationLeftArrowIcon = Object.assign(
  React.forwardRef<IconRef, NavigationLeftArrowIconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "NavigationLeftArrowIcon", iconName: "navigation-left-arrow" as const }
);
