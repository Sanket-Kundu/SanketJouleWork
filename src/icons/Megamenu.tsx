import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M256 352q-13 0-21-11L133 201q-5-8-5-15 0-11 7.5-18.5T154 160h204q11 0 18.5 7.5T384 186q0 7-5 15L277 341q-8 11-21 11z'
] as const;

type MegamenuIconProps = Omit<IconProps, "pathData">;

export const MegamenuIcon = Object.assign(
  React.forwardRef<IconRef, MegamenuIconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "MegamenuIcon", iconName: "megamenu" as const }
);
