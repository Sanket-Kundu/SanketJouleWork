import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M486 96q11 0 18.5 7.5T512 122t-7.5 18-18.5 7H26q-11 0-18.5-7T0 122t7.5-18.5T26 96h460zm-64 128q11 0 18.5 7.5T448 250t-7.5 18-18.5 7H90q-11 0-18.5-7T64 250t7.5-18.5T90 224h332zm-64 128q11 0 18.5 7.5T384 378t-7.5 18-18.5 7H154q-11 0-18.5-7t-7.5-18 7.5-18.5T154 352h204z'
] as const;

type SortDescendingIconProps = Omit<IconProps, "pathData">;

export const SortDescendingIcon = Object.assign(
  React.forwardRef<IconRef, SortDescendingIconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "SortDescendingIcon", iconName: "sort-descending" as const }
);
