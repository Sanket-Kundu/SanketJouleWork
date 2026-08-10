import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M326 96q11 0 18.5 7.5T352 122q0 10-8 18L223 256l121 116q8 8 8 18 0 11-7.5 18.5T326 416q-10 0-17-7L168 274q-8-6-8-18 0-11 8-19l141-134q7-7 17-7z'
] as const;

type NavBackIconProps = Omit<IconProps, "pathData">;

export const NavBackIcon = Object.assign(
  React.forwardRef<IconRef, NavBackIconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "NavBackIcon", iconName: "nav-back" as const }
);
