import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M504 236q8 6 8 18 0 10-8 18L389 385q-7 7-18 7t-18-7.5-7-18.5 7-18l97-94-97-94q-7-7-7-18t7-18.5 18-7.5 18 7zM141 116q11 0 18 7.5t7 18.5-7 18l-97 94 97 94q7 7 7 18t-7 18.5-18 7.5-18-7L8 272q-8-8-8-18 0-12 8-18l115-113q7-7 18-7z'
] as const;

type SourceCodeIconProps = Omit<IconProps, "pathData">;

export const SourceCodeIcon = Object.assign(
  React.forwardRef<IconRef, SourceCodeIconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "SourceCodeIcon", iconName: "source-code" as const }
);
