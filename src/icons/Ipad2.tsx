import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M512 405q0 31-21 53t-51 22H72q-30 0-51-22T0 405V107q0-31 21-53t51-22h368q30 0 51 22t21 53v298zM74 429h364V83H74v346z'
] as const;

type Ipad2IconProps = Omit<IconProps, "pathData">;

export const Ipad2Icon = Object.assign(
  React.forwardRef<IconRef, Ipad2IconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "Ipad2Icon", iconName: "ipad-2" as const }
);
