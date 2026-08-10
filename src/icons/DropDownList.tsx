import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M422 307H90q-11 0-18.5-7T64 282t7.5-18.5T90 256h332q11 0 18.5 7.5T448 282t-7.5 18-18.5 7zm0-224H90q-11 0-18.5-7T64 58t7.5-18.5T90 32h332q11 0 18.5 7.5T448 58t-7.5 18-18.5 7zm0 109H90q-11 0-18.5-7.5T64 166t7.5-18 18.5-7h332q11 0 18.5 7t7.5 18-7.5 18.5T422 192zM256 480q-9 0-18-7l-77-77q-7-7-7-18t7-18.5 18-7.5 18 7l59 59 59-59q7-7 18-7t18 7.5 7 18.5-7 18l-77 77q-9 7-18 7z'
] as const;

type DropDownListIconProps = Omit<IconProps, "pathData">;

export const DropDownListIcon = Object.assign(
  React.forwardRef<IconRef, DropDownListIconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "DropDownListIcon", iconName: "drop-down-list" as const }
);
