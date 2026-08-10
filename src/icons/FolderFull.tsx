import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M422 480H90q-38 0-64-26T0 390V122q0-38 26-64t64-26h115q9 0 18 7l44 44h155q38 0 64 26t26 63v218q0 38-26 64t-64 26z'
] as const;

type FolderFullIconProps = Omit<IconProps, "pathData">;

export const FolderFullIcon = Object.assign(
  React.forwardRef<IconRef, FolderFullIconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "FolderFullIcon", iconName: "folder-full" as const }
);
