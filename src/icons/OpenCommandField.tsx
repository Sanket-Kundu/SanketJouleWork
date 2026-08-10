import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M90 416q-11 0-18.5-7.5T64 390q0-10 8-18l121-116L72 140q-8-8-8-18 0-11 7.5-18.5T90 96q10 0 17 7l141 134q8 8 8 19 0 12-8 18L107 409q-7 7-17 7zm192 0q-11 0-18.5-7.5T256 390q0-10 8-18l121-116-121-116q-8-8-8-18 0-11 7.5-18.5T282 96q10 0 17 7l141 134q8 8 8 19 0 12-8 18L299 409q-7 7-17 7z'
] as const;

type OpenCommandFieldIconProps = Omit<IconProps, "pathData">;

export const OpenCommandFieldIcon = Object.assign(
  React.forwardRef<IconRef, OpenCommandFieldIconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "OpenCommandFieldIcon", iconName: "open-command-field" as const }
);
