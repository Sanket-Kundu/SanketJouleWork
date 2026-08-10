import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M390 32q38 0 64 26t26 64v268q0 38-26 64t-64 26H122q-38 0-64-26t-26-64V122q0-38 26-64t64-26h268z'
] as const;

type ColorFillIconProps = Omit<IconProps, "pathData">;

export const ColorFillIcon = Object.assign(
  React.forwardRef<IconRef, ColorFillIconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "ColorFillIcon", iconName: "color-fill" as const }
);
