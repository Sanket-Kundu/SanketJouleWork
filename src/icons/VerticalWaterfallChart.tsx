import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M154 384q-11 0-18.5-7.5T128 358V58q0-11 7.5-18.5T154 32t18 7.5 7 18.5v300q0 11-7 18.5t-18 7.5zm96-256q-11 0-18.5-7.5T224 102V58q0-11 7.5-18.5T250 32t18 7.5 7 18.5v44q0 11-7 18.5t-18 7.5zm204 352H58q-11 0-18.5-7.5T32 454V58q0-11 7.5-18.5T58 32t18 7.5T83 58v371h371q11 0 18.5 7t7.5 18-7.5 18.5T454 480zM326 288q-11 0-18-7.5t-7-18.5V122q0-11 7-18.5t18-7.5 18.5 7.5T352 122v140q0 11-7.5 18.5T326 288zm96 64q-11 0-18-7.5t-7-18.5V218q0-11 7-18.5t18-7.5 18.5 7.5T448 218v108q0 11-7.5 18.5T422 352z'
] as const;

type VerticalWaterfallChartIconProps = Omit<IconProps, "pathData">;

export const VerticalWaterfallChartIcon = Object.assign(
  React.forwardRef<IconRef, VerticalWaterfallChartIconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "VerticalWaterfallChartIcon", iconName: "vertical-waterfall-chart" as const }
);
