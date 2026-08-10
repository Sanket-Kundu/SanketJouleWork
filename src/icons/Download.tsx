import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M123 261q-8-8-8-18 0-11 7.5-18t18.5-7 18 7l71 72V26q0-11 7.5-18.5T256 0t18.5 7.5T282 26v271l71-72q7-7 18-7t18.5 7 7.5 18q0 10-8 18L274 376q-8 8-18 8t-18-8zm363 200q11 0 18.5 7t7.5 18-7.5 18.5T486 512H26q-11 0-18.5-7.5T0 486t7.5-18 18.5-7h460z'
] as const;

type DownloadIconProps = Omit<IconProps, "pathData">;

export const DownloadIcon = Object.assign(
  React.forwardRef<IconRef, DownloadIconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "DownloadIcon", iconName: "download" as const }
);
