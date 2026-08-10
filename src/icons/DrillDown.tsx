import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M256 192q-11 0-19-8L135 75q-7-7-7-17 0-11 7.5-18.5T154 32q10 0 18 8l84 89 84-89q8-8 18-8 11 0 18.5 7.5T384 58q0 10-7 17L275 184q-8 8-19 8zm0 144q-11 0-19-8L135 219q-7-7-7-17 0-11 7.5-18.5T154 176q10 0 18 8l84 89 84-89q8-8 18-8 11 0 18.5 7.5T384 202q0 10-7 17L275 328q-8 8-19 8zm0 144q-11 0-19-8L135 363q-7-7-7-17 0-11 7.5-18.5T154 320q10 0 18 8l84 89 84-89q8-8 18-8 11 0 18.5 7.5T384 346q0 10-7 17L275 472q-8 8-19 8z'
] as const;

type DrillDownIconProps = Omit<IconProps, "pathData">;

export const DrillDownIcon = Object.assign(
  React.forwardRef<IconRef, DrillDownIconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "DrillDownIcon", iconName: "drill-down" as const }
);
