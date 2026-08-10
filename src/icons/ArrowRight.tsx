import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M331 409q-7 7-17 7-11 0-18.5-7.5T288 390q0-10 8-18l95-90H58q-11 0-18.5-7.5T32 256t7.5-18.5T58 230h333l-95-90q-8-8-8-18 0-11 7.5-18.5T314 96q10 0 17 7l141 134q8 8 8 19 0 12-8 18z'
] as const;

type ArrowRightIconProps = Omit<IconProps, "pathData">;

export const ArrowRightIcon = Object.assign(
  React.forwardRef<IconRef, ArrowRightIconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "ArrowRightIcon", iconName: "arrow-right" as const }
);
