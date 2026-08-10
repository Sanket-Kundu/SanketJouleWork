import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M409 181q7 7 7 17 0 11-7.5 18.5T390 224q-10 0-18-8l-90-95v333q0 11-7.5 18.5T256 480t-18.5-7.5T230 454V121l-90 95q-8 8-18 8-11 0-18.5-7.5T96 198q0-10 7-17L238 40q6-8 18-8 11 0 19 8z'
] as const;

type ArrowTopIconProps = Omit<IconProps, "pathData">;

export const ArrowTopIcon = Object.assign(
  React.forwardRef<IconRef, ArrowTopIconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "ArrowTopIcon", iconName: "arrow-top" as const }
);
