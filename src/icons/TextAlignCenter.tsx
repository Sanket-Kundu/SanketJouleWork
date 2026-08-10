import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M454 83H58q-11 0-18.5-7T32 58t7.5-18.5T58 32h396q11 0 18.5 7.5T480 58t-7.5 18-18.5 7zm-96 128H154q-11 0-18.5-7t-7.5-18 7.5-18.5T154 160h204q11 0 18.5 7.5T384 186t-7.5 18-18.5 7zm96 141H58q-11 0-18.5-7.5T32 326t7.5-18 18.5-7h396q11 0 18.5 7t7.5 18-7.5 18.5T454 352zm-96 128H154q-11 0-18.5-7.5T128 454t7.5-18 18.5-7h204q11 0 18.5 7t7.5 18-7.5 18.5T358 480z'
] as const;

type TextAlignCenterIconProps = Omit<IconProps, "pathData">;

export const TextAlignCenterIcon = Object.assign(
  React.forwardRef<IconRef, TextAlignCenterIconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "TextAlignCenterIcon", iconName: "text-align-center" as const }
);
