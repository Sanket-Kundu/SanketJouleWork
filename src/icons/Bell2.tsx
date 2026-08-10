import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M475 374q5 7 5 16 0 11-7 18.5t-18 7.5H334q-5 27-27 45.5T256 480t-51-18.5-27-45.5H58q-11 0-18.5-7.5T32 390q0-10 6-16 1-1 8-9.5T61 341t14.5-35.5T82 260v-20q0-100 45-154t129-54 129.5 54T431 240v20q0 25 6.5 45.5T452 341t15 23.5 8 9.5z'
] as const;

type Bell2IconProps = Omit<IconProps, "pathData">;

export const Bell2Icon = Object.assign(
  React.forwardRef<IconRef, Bell2IconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "Bell2Icon", iconName: "bell-2" as const }
);
