import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M346 512H166q-29 0-49.5-22.5T96 435V77q0-32 20.5-54.5T166 0h180q29 0 49.5 22.5T416 77v358q0 32-20.5 54.5T346 512zM166 51q-8 0-13.5 7.5T147 77v358q0 11 5.5 18.5T166 461h180q8 0 13.5-7.5T365 435V77q0-11-5.5-18.5T346 51H166z'
] as const;

type IphoneIconProps = Omit<IconProps, "pathData">;

export const IphoneIcon = Object.assign(
  React.forwardRef<IconRef, IphoneIconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "IphoneIcon", iconName: "iphone" as const }
);
