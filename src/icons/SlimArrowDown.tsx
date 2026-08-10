import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M410.53 200.75C418.95 210.98 417.48 226.11 407.25 234.53L271.34 346.53C262.48 353.83 249.68 353.83 240.81 346.53L104.75 234.53C94.52 226.11 93.05 210.98 101.47 200.75C109.89 190.52 125.02 189.05 135.25 197.47L256.06 296.91L376.75 197.47C386.98 189.05 402.11 190.52 410.53 200.75Z'
] as const;

type SlimArrowDownIconProps = Omit<IconProps, "pathData">;

export const SlimArrowDownIcon = Object.assign(
  React.forwardRef<IconRef, SlimArrowDownIconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "SlimArrowDownIcon", iconName: "slim-arrow-down" as const }
);
