import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M187 416q-12 0-20-9L71 299q-7-7-7-17 0-11 7.5-18.5T90 256q12 0 19 9l77 87 217-247q8-9 19-9t18.5 7.5T448 122q0 10-6 16L206 407q-7 9-19 9z'
] as const;

type AcceptIconProps = Omit<IconProps, "pathData">;

export const AcceptIcon = Object.assign(
  React.forwardRef<IconRef, AcceptIconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "AcceptIcon", iconName: "accept" as const }
);
