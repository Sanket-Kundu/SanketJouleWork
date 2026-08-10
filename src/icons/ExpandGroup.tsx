import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M390 64q11 0 18.5 7.5T416 90q0 10-7 17L275 248q-8 8-19 8-12 0-18-8L103 107q-7-7-7-17 0-11 7.5-18.5T122 64q10 0 18 8l116 121L372 72q8-8 18-8zm0 192q11 0 18.5 7.5T416 282q0 10-7 17L275 440q-8 8-19 8-12 0-18-8L103 299q-7-7-7-17 0-11 7.5-18.5T122 256q10 0 18 8l116 121 116-121q8-8 18-8z'
] as const;

type ExpandGroupIconProps = Omit<IconProps, "pathData">;

export const ExpandGroupIcon = Object.assign(
  React.forwardRef<IconRef, ExpandGroupIconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "ExpandGroupIcon", iconName: "expand-group" as const }
);
