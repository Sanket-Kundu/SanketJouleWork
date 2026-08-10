import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M454 480H58q-11 0-18.5-7.5T32 454V58q0-11 7.5-18.5T58 32t18 7.5T83 58v371h371q11 0 18.5 7t7.5 18-7.5 18.5T454 480zM198 83h-44q-11 0-18.5-7T128 58t7.5-18.5T154 32h44q11 0 18.5 7.5T224 58t-7.5 18-18.5 7zm160 96H154q-11 0-18.5-7t-7.5-18 7.5-18.5T154 128h204q11 0 18.5 7.5T384 154t-7.5 18-18.5 7zm-96 96H154q-11 0-18.5-7t-7.5-18 7.5-18.5T154 224h108q11 0 18.5 7.5T288 250t-7.5 18-18.5 7zm160 96H154q-11 0-18.5-7t-7.5-18 7.5-18.5T154 320h268q11 0 18.5 7.5T448 346t-7.5 18-18.5 7z'
] as const;

type HorizontalBarChart2IconProps = Omit<IconProps, "pathData">;

export const HorizontalBarChart2Icon = Object.assign(
  React.forwardRef<IconRef, HorizontalBarChart2IconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "HorizontalBarChart2Icon", iconName: "horizontal-bar-chart-2" as const }
);
