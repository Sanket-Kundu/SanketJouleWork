import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M390 32q38 0 64 26t26 64v268q0 38-26 64t-64 26H122q-38 0-64-26t-26-64V122q0-38 26-64t64-26h268zM122 83q-17 0-28 11t-11 28v38h346v-38q0-17-11-28t-28-11H122zm268 346q17 0 28-11t11-28V211H83v179q0 17 11 28t28 11h268z'
] as const;

type HeaderIconProps = Omit<IconProps, "pathData">;

export const HeaderIcon = Object.assign(
  React.forwardRef<IconRef, HeaderIconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "HeaderIcon", iconName: "header" as const }
);
