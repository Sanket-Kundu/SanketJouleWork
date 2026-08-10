import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M58 83q-11 0-18.5-7T32 58t7.5-18.5T58 32h396q11 0 18.5 7.5T480 58t-7.5 18-18.5 7H58zm192 128q-11 0-18.5-7t-7.5-18 7.5-18.5T250 160h204q11 0 18.5 7.5T480 186t-7.5 18-18.5 7H250zM58 352q-11 0-18.5-7.5T32 326t7.5-18 18.5-7h396q11 0 18.5 7t7.5 18-7.5 18.5T454 352H58zm192 128q-11 0-18.5-7.5T224 454t7.5-18 18.5-7h204q11 0 18.5 7t7.5 18-7.5 18.5T454 480H250z'
] as const;

type TextAlignRightIconProps = Omit<IconProps, "pathData">;

export const TextAlignRightIcon = Object.assign(
  React.forwardRef<IconRef, TextAlignRightIconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "TextAlignRightIcon", iconName: "text-align-right" as const }
);
