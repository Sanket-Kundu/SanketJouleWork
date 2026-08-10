import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  "M4 1L4 15L7.5 11.5L10.5 18L13 17L10 10H15L4 1Z"
] as const;

type CursorIconProps = Omit<IconProps, "pathData" | "viewBox" | "pathMeta">;

export const CursorIcon = Object.assign(
  React.forwardRef<IconRef, CursorIconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} viewBox="0 0 20 20" {...props} />
  ),
  { displayName: "CursorIcon", iconName: "cursor" as const }
);
