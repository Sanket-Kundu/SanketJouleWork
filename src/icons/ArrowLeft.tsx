import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M181 103q7-7 17-7 11 0 18.5 7.5T224 122q0 10-8 18l-94 90h332q11 0 18.5 7.5T480 256t-7.5 18.5T454 282H122l94 90q8 8 8 18 0 11-7.5 18.5T198 416q-10 0-17-7L40 274q-8-6-8-18 0-11 8-19z'
] as const;

type ArrowLeftIconProps = Omit<IconProps, "pathData">;

export const ArrowLeftIcon = Object.assign(
  React.forwardRef<IconRef, ArrowLeftIconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "ArrowLeftIcon", iconName: "arrow-left" as const }
);
