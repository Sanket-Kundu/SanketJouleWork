import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M288 256q0 12-9 20L42 474q-7 6-16 6-11 0-18.5-7.5T0 454V58q0-11 7.5-18.5T26 32q9 0 16 6l237 198q9 7 9 20zm216-18q8 6 8 18t-8 18L299 473q-7 7-17 7-11 0-18.5-7.5T256 454q0-10 8-18l186-180L264 76q-8-8-8-18 0-11 7.5-18.5T282 32q10 0 17 7zm-281 18L51 112v288z'
] as const;

type BeginIconProps = Omit<IconProps, "pathData">;

export const BeginIcon = Object.assign(
  React.forwardRef<IconRef, BeginIconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "BeginIcon", iconName: "begin" as const }
);
