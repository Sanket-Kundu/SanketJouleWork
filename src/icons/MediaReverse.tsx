import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M390 32q11 0 18.5 7.5T416 58v396q0 11-7.5 18.5T390 480q-7 0-15-5L106 277q-10-8-10-21t10-21L375 37q8-5 15-5zm-25 372V108L165 256z'
] as const;

type MediaReverseIconProps = Omit<IconProps, "pathData">;

export const MediaReverseIcon = Object.assign(
  React.forwardRef<IconRef, MediaReverseIconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "MediaReverseIcon", iconName: "media-reverse" as const }
);
