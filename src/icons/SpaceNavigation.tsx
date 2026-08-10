import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M384 256q0 47-29 81.5T282 381v105q0 11-7.5 18.5T256 512t-18.5-7.5T230 486V381q-44-9-73-43.5T128 256t29-82 73-43V26q0-11 7.5-18.5T256 0t18.5 7.5T282 26v105q44 8 73 43t29 82zm-128 77q32 0 54.5-22.5T333 256t-22.5-54.5T256 179t-54.5 22.5T179 256t22.5 54.5T256 333z'
] as const;

type SpaceNavigationIconProps = Omit<IconProps, "pathData">;

export const SpaceNavigationIcon = Object.assign(
  React.forwardRef<IconRef, SpaceNavigationIconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "SpaceNavigationIcon", iconName: "space-navigation" as const }
);
