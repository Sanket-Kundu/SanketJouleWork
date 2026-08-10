import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M96 326q0-10 7-17l135-141q6-8 18-8 11 0 19 8l134 141q7 7 7 17 0 11-7.5 18.5T390 352q-10 0-18-8L256 223 140 344q-8 8-18 8-11 0-18.5-7.5T96 326z'
] as const;

type SlimArrowUpIconProps = Omit<IconProps, "pathData">;

export const SlimArrowUpIcon = Object.assign(
  React.forwardRef<IconRef, SlimArrowUpIconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "SlimArrowUpIcon", iconName: "slim-arrow-up" as const }
);
