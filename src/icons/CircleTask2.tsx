import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M256 0q53 0 100 20t81.5 54.5T492 156t20 100-20 100-54.5 81.5T356 492t-100 20-100-20-81.5-54.5T20 356 0 256t20-100 54.5-81.5T156 20 256 0z'
] as const;

type CircleTask2IconProps = Omit<IconProps, "pathData">;

export const CircleTask2Icon = Object.assign(
  React.forwardRef<IconRef, CircleTask2IconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "CircleTask2Icon", iconName: "circle-task-2" as const }
);
