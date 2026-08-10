import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M275 464l-64-164-163-65q-16-6-16-24 0-17 16-24L445 34q6-2 10-2 10 0 17.5 7.5T480 58q0 6-2 9L323 464q-7 16-24 16-8 0-14.5-4t-9.5-12z'
] as const;

type LocateMeIconProps = Omit<IconProps, "pathData">;

export const LocateMeIcon = Object.assign(
  React.forwardRef<IconRef, LocateMeIconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "LocateMeIcon", iconName: "locate-me" as const }
);
