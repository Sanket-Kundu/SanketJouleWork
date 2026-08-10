import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M486 429q11 0 18.5 7t7.5 18-7.5 18.5T486 480h-44q-38 0-64-26t-26-64V192h-38q-11 0-18.5-7.5T288 166t7.5-18 18.5-7h38V58q0-11 7.5-18.5T378 32t18 7.5 7 18.5v83h51q11 0 18.5 7t7.5 18-7.5 18.5T454 192h-51v198q0 17 11 28t28 11h44zM262 32q11 0 18.5 7.5T288 58t-7.5 18-18.5 7h-92v371q0 11-7.5 18.5T144 480t-18.5-7.5T118 454V83H26q-11 0-18.5-7T0 58t7.5-18.5T26 32h236z'
] as const;

type TextFormattingIconProps = Omit<IconProps, "pathData">;

export const TextFormattingIcon = Object.assign(
  React.forwardRef<IconRef, TextFormattingIconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "TextFormattingIcon", iconName: "text-formatting" as const }
);
