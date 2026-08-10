import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M486 192q11 0 18.5 7.5T512 218t-9 19L273 441q-7 7-17 7H26q-11 0-18.5-7.5T0 422V218q0-11 7.5-18.5T26 192h460z'
] as const;

type SapLogoShapeIconProps = Omit<IconProps, "pathData">;

export const SapLogoShapeIcon = Object.assign(
  React.forwardRef<IconRef, SapLogoShapeIconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "SapLogoShapeIcon", iconName: "sap-logo-shape" as const }
);
