import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M103 331q-7-7-7-17 0-11 7.5-18.5T122 288q10 0 18 8l90 94V58q0-11 7.5-18.5T256 32t18.5 7.5T282 58v332l90-94q8-8 18-8 11 0 18.5 7.5T416 314q0 10-7 17L275 472q-8 8-19 8-12 0-18-8z'
] as const;

type ArrowBottomIconProps = Omit<IconProps, "pathData">;

export const ArrowBottomIcon = Object.assign(
  React.forwardRef<IconRef, ArrowBottomIconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "ArrowBottomIcon", iconName: "arrow-bottom" as const }
);
