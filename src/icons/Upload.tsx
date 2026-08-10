import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M389 123q8 8 8 18 0 11-7.5 18t-18.5 7-18-7l-71-72v271q0 11-7.5 18.5T256 384t-18.5-7.5T230 358V87l-71 72q-7 7-18 7t-18.5-7-7.5-18q0-10 8-18L238 7q9-7 18-7t18 7zm97 338q11 0 18.5 7t7.5 18-7.5 18.5T486 512H26q-11 0-18.5-7.5T0 486t7.5-18 18.5-7h460z'
] as const;

type UploadIconProps = Omit<IconProps, "pathData">;

export const UploadIcon = Object.assign(
  React.forwardRef<IconRef, UploadIconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "UploadIcon", iconName: "upload" as const }
);
