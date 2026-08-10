import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M422 32q24 0 41 17t17 41v204q0 24-17 41t-41 17h-12q-11 0-18.5-7.5T384 326t7.5-18 18.5-7h12q7 0 7-7V90q0-7-7-7H218q-7 0-7 7v12q0 11-7 18.5t-18 7.5-18.5-7.5T160 102V90q0-24 17-41t41-17h204zM294 160q24 0 41 17t17 41v204q0 24-17 41t-41 17H90q-24 0-41-17t-17-41V218q0-24 17-41t41-17h204zm7 58q0-7-7-7H90q-7 0-7 7v204q0 7 7 7h204q7 0 7-7V218z'
] as const;

type ValueHelpIconProps = Omit<IconProps, "pathData">;

export const ValueHelpIcon = Object.assign(
  React.forwardRef<IconRef, ValueHelpIconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "ValueHelpIcon", iconName: "value-help" as const }
);
