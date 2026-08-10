import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M406 252q10 6 10 20 0 19-19 24l-92 25 49 102q3 6 3 12 0 14-14 23l-41 19q-4 3-11 3-15 0-23-14l-51-106-82 52q-5 4-13 4-11 0-18.5-7.5T96 390V58q0-11 7.5-18.5T122 32q9 0 16 6zm-71 8L147 111v232l85-54q3-3 7-3z'
] as const;

type CursorArrowIconProps = Omit<IconProps, "pathData">;

export const CursorArrowIcon = Object.assign(
  React.forwardRef<IconRef, CursorArrowIconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "CursorArrowIcon", iconName: "cursor-arrow" as const }
);
