import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M256 64q-29 0-32-29v-7q3-28 32-28 14 0 23 9t9 23-9 23-23 9zm0 96q-29 0-32-29v-7q3-28 32-28 14 0 23 9t9 23-9 23-23 9zm0 96q-29 0-32-29v-7q3-28 32-28 14 0 23 9t9 23-9 23-23 9zm134 64q11 0 18.5 7.5T416 346q0 10-7 17L275 504q-8 8-19 8-12 0-18-8L103 363q-7-7-7-17 0-11 7.5-18.5T122 320q10 0 18 8l90 94V314q0-11 7.5-18.5T256 288t18.5 7.5T282 314v108l90-94q8-8 18-8z'
] as const;

type PullDownIconProps = Omit<IconProps, "pathData">;

export const PullDownIcon = Object.assign(
  React.forwardRef<IconRef, PullDownIconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "PullDownIcon", iconName: "pull-down" as const }
);
