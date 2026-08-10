import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M256 480q-15 0-22-13L4 70q-4-5-4-12 0-11 7.5-18.5T26 32h460q11 0 18.5 7.5T512 58q0 6-3 12L278 467q-6 13-22 13zM70 83l186 320L442 83H70z'
] as const;

type DownIconProps = Omit<IconProps, "pathData">;

export const DownIcon = Object.assign(
  React.forwardRef<IconRef, DownIconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "DownIcon", iconName: "down" as const }
);
