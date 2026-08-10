import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M80 128q-20 0-34-14T32 80t14-34 34-14 34 14 14 34-14 34-34 14zm176 0q-20 0-34-14t-14-34 14-34 34-14 34 14 14 34-14 34-34 14zm176 0q-20 0-34-14t-14-34 14-34 34-14 34 14 14 34-14 34-34 14zM80 208q20 0 34 14t14 34-14 34-34 14-34-14-14-34 14-34 34-14zm176 0q20 0 34 14t14 34-14 34-34 14-34-14-14-34 14-34 34-14zm176 0q20 0 34 14t14 34-14 34-34 14-34-14-14-34 14-34 34-14zM80 384q20 0 34 14t14 34-14 34-34 14-34-14-14-34 14-34 34-14zm176 0q20 0 34 14t14 34-14 34-34 14-34-14-14-34 14-34 34-14zm176 0q20 0 34 14t14 34-14 34-34 14-34-14-14-34 14-34 34-14z'
] as const;

type GridIconProps = Omit<IconProps, "pathData">;

export const GridIcon = Object.assign(
  React.forwardRef<IconRef, GridIconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "GridIcon", iconName: "grid" as const }
);
