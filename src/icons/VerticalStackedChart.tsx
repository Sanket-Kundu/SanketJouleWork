import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M282 160q-11 0-18.5-7.5T256 134V58q0-11 7.5-18.5T282 32t18 7.5 7 18.5v76q0 11-7 18.5t-18 7.5zm172 269q11 0 18.5 7t7.5 18-7.5 18.5T454 480H58q-11 0-18.5-7.5T32 454V58q0-11 7.5-18.5T58 32t18 7.5T83 58v371h371zM154 256q-11 0-18.5-7.5T128 230V122q0-11 7.5-18.5T154 96t18 7.5 7 18.5v108q0 11-7 18.5t-18 7.5zm262-96q-14 0-23-9t-9-23 9-23 23-9 23 9 9 23-9 23-23 9zm6 32q11 0 18.5 7.5T448 218v44q0 11-7.5 18.5T422 288t-18-7.5-7-18.5v-44q0-11 7-18.5t18-7.5zm-134 64q-14 0-23-9t-9-23 9-23 23-9 23 9 9 23-9 23-23 9zm-6 128q-11 0-18.5-7.5T256 358v-44q0-11 7.5-18.5T282 288t18 7.5 7 18.5v44q0 11-7 18.5t-18 7.5zm-122 0q-14 0-23-9t-9-23 9-23 23-9 23 9 9 23-9 23-23 9zm256 0q-14 0-23-9t-9-23 9-23 23-9 23 9 9 23-9 23-23 9z'
] as const;

type VerticalStackedChartIconProps = Omit<IconProps, "pathData">;

export const VerticalStackedChartIcon = Object.assign(
  React.forwardRef<IconRef, VerticalStackedChartIconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "VerticalStackedChartIcon", iconName: "vertical-stacked-chart" as const }
);
