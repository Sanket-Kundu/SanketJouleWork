import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M504 124q8 8 8 18 0 11-7.5 18.5T486 168t-18-7l-42-42v335q0 11-7.5 18.5T400 480t-18-7.5-7-18.5V118l-43 43q-7 7-18 7t-18.5-7.5T288 142q0-10 8-18l86-85q7-7 18-7t18 7zM180 351q7-7 18-7t18.5 7.5T224 370q0 10-8 18l-86 85q-7 7-18 7t-18-7L8 388q-8-8-8-18 0-11 7.5-18.5T26 344t18 7l43 43V58q0-11 7.5-18.5T113 32t18 7.5 7 18.5v335z'
] as const;

type SortIconProps = Omit<IconProps, "pathData">;

export const SortIcon = Object.assign(
  React.forwardRef<IconRef, SortIconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "SortIcon", iconName: "sort" as const }
);
