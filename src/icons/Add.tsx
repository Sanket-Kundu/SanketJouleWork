import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M454 230q11 0 18.5 7.5T480 256t-7.5 18.5T454 282H282v172q0 11-7.5 18.5T256 480t-18.5-7.5T230 454V282H58q-11 0-18.5-7.5T32 256t7.5-18.5T58 230h172V58q0-11 7.5-18.5T256 32t18.5 7.5T282 58v172h172z'
] as const;

type AddIconProps = Omit<IconProps, "pathData">;

export const AddIcon = Object.assign(
  React.forwardRef<IconRef, AddIconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "AddIcon", iconName: "add" as const }
);
