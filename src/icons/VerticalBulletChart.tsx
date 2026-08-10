import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M454 83h-76q-11 0-18.5-7T352 58t7.5-18.5T378 32h76q11 0 18.5 7.5T480 58t-7.5 18-18.5 7zm-160 64h-76q-11 0-18.5-7t-7.5-18 7.5-18.5T218 96h76q11 0 18.5 7.5T320 122t-7.5 18-18.5 7zm128 237q-11 0-18-7.5t-7-18.5V154q0-11 7-18.5t18-7.5 18.5 7.5T448 154v204q0 11-7.5 18.5T422 384zm-172 0q-11 0-18.5-7.5T224 358V218q0-11 7.5-18.5T250 192t18 7.5 7 18.5v140q0 11-7 18.5t-18 7.5zM134 243H58q-11 0-18.5-7T32 218t7.5-18.5T58 192h76q11 0 18.5 7.5T160 218t-7.5 18-18.5 7zM90 384q-11 0-18.5-7.5T64 358v-44q0-11 7.5-18.5T90 288t18 7.5 7 18.5v44q0 11-7 18.5T90 384zm364 96H58q-11 0-18.5-7.5T32 454t7.5-18 18.5-7h396q11 0 18.5 7t7.5 18-7.5 18.5T454 480z'
] as const;

type VerticalBulletChartIconProps = Omit<IconProps, "pathData">;

export const VerticalBulletChartIcon = Object.assign(
  React.forwardRef<IconRef, VerticalBulletChartIconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "VerticalBulletChartIcon", iconName: "vertical-bullet-chart" as const }
);
