import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M454 96q24 0 41 17t17 41v160q0 23-17 40t-41 17h-12q-11 0-18.5-7t-7.5-18 7.5-18.5T442 320h12q7 0 7-6V154q0-7-7-7h-38v51q0 11-7.5 18.5T390 224t-18-7.5-7-18.5v-51h-39v51q0 11-7 18.5t-18 7.5-18.5-7.5T275 198v-51h-38v51q0 11-7.5 18.5T211 224t-18-7.5-7-18.5v-51h-39v51q0 11-7 18.5t-18 7.5-18.5-7.5T96 198v-51H58q-7 0-7 7v160q0 6 7 6h108q11 0 18.5 7.5T192 346t-7.5 18-18.5 7H58q-24 0-41-17T0 314V154q0-24 17-41t41-17h396zm-75 280q5 7 5 14 0 11-7.5 18.5T358 416H250q-11 0-18.5-7.5T224 390q0-7 5-14l54-77q8-11 21-11t21 11z'
] as const;

type MeasureIconProps = Omit<IconProps, "pathData">;

export const MeasureIcon = Object.assign(
  React.forwardRef<IconRef, MeasureIconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "MeasureIcon", iconName: "measure" as const }
);
