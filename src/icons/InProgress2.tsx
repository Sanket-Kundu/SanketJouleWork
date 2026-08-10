import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M390 32q38 0 64 26t26 64v268q0 38-26 64t-64 26H122q-38 0-64-26t-26-64V122q0-38 26-64t64-26h268zm-38 352q14 0 23-9t9-23-9-23l-87-86V128q0-14-9-23t-23-9-23 9-9 23v128q0 14 9 23l96 96q11 9 23 9z'
] as const;

type InProgress2IconProps = Omit<IconProps, "pathData">;

export const InProgress2Icon = Object.assign(
  React.forwardRef<IconRef, InProgress2IconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "InProgress2Icon", iconName: "in-progress-2" as const }
);
