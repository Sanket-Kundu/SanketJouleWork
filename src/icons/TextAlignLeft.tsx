import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M454 83H58q-11 0-18.5-7T32 58t7.5-18.5T58 32h396q11 0 18.5 7.5T480 58t-7.5 18-18.5 7zM262 211H58q-11 0-18.5-7T32 186t7.5-18.5T58 160h204q11 0 18.5 7.5T288 186t-7.5 18-18.5 7zm192 141H58q-11 0-18.5-7.5T32 326t7.5-18 18.5-7h396q11 0 18.5 7t7.5 18-7.5 18.5T454 352zM262 480H58q-11 0-18.5-7.5T32 454t7.5-18 18.5-7h204q11 0 18.5 7t7.5 18-7.5 18.5T262 480z'
] as const;

type TextAlignLeftIconProps = Omit<IconProps, "pathData">;

export const TextAlignLeftIcon = Object.assign(
  React.forwardRef<IconRef, TextAlignLeftIconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "TextAlignLeftIcon", iconName: "text-align-left" as const }
);
