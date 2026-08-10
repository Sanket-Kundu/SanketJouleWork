import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M256 32q11 0 19 8l102 109q7 7 7 17 0 11-7.5 18.5T358 192q-10 0-18-8l-84-89-84 89q-8 8-18 8-11 0-18.5-7.5T128 166q0-10 7-17L237 40q8-8 19-8zm0 144q11 0 19 8l102 109q7 7 7 17 0 11-7.5 18.5T358 336q-10 0-18-8l-84-89-84 89q-8 8-18 8-11 0-18.5-7.5T128 310q0-10 7-17l102-109q8-8 19-8zm0 144q11 0 19 8l102 109q7 7 7 17 0 11-7.5 18.5T358 480q-10 0-18-8l-84-89-84 89q-8 8-18 8-11 0-18.5-7.5T128 454q0-10 7-17l102-109q8-8 19-8z'
] as const;

type DrillUpIconProps = Omit<IconProps, "pathData">;

export const DrillUpIcon = Object.assign(
  React.forwardRef<IconRef, DrillUpIconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "DrillUpIcon", iconName: "drill-up" as const }
);
