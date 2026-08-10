import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M282 486q0 11-7.5 18.5T256 512t-18.5-7.5T230 486v-83h-76q-11 0-18.5-7t-7.5-18 7.5-18.5T154 352h76v-67q-51-9-84.5-48T112 144q0-30 11.5-56t31-45.5 45.5-31T256 0t56 11.5 45.5 31 31 45.5 11.5 56q0 54-33.5 93T282 285v67h76q11 0 18.5 7.5T384 378t-7.5 18-18.5 7h-76v83zM256 51q-19 0-36 7.5t-29.5 20-20 29.5-7.5 36 7.5 36 20 29.5 29.5 20 36 7.5 36-7.5 29.5-20 20-29.5 7.5-36-7.5-36-20-29.5-29.5-20-36-7.5z'
] as const;

type FemaleIconProps = Omit<IconProps, "pathData">;

export const FemaleIcon = Object.assign(
  React.forwardRef<IconRef, FemaleIconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "FemaleIcon", iconName: "female" as const }
);
