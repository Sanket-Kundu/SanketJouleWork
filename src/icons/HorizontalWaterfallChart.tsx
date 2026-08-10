import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M454 429q11 0 18.5 7t7.5 18-7.5 18.5T454 480H58q-11 0-18.5-7.5T32 454V58q0-11 7.5-18.5T58 32t18 7.5T83 58v371h371zM154 115q-11 0-18.5-7T128 90t7.5-18.5T154 64h300q11 0 18.5 7.5T480 90t-7.5 18-18.5 7H154zm300 45q11 0 18.5 7.5T480 186t-7.5 18-18.5 7h-44q-11 0-18.5-7t-7.5-18 7.5-18.5T410 160h44zm-96 64q11 0 18.5 7.5T384 250t-7.5 18-18.5 7H250q-11 0-18.5-7t-7.5-18 7.5-18.5T250 224h108zM154 384q-11 0-18.5-7.5T128 358t7.5-18 18.5-7h108q11 0 18.5 7t7.5 18-7.5 18.5T262 384H154z'
] as const;

type HorizontalWaterfallChartIconProps = Omit<IconProps, "pathData">;

export const HorizontalWaterfallChartIcon = Object.assign(
  React.forwardRef<IconRef, HorizontalWaterfallChartIconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "HorizontalWaterfallChartIcon", iconName: "horizontal-waterfall-chart" as const }
);
