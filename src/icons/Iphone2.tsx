import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M0 346V166q0-29 22.5-49.5T77 96h358q32 0 54.5 20.5T512 166v180q0 29-22.5 49.5T435 416H77q-32 0-54.5-20.5T0 346zm461-180q0-8-7.5-13.5T435 147H77q-11 0-18.5 5.5T51 166v180q0 8 7.5 13.5T77 365h358q11 0 18.5-5.5T461 346V166z'
] as const;

type Iphone2IconProps = Omit<IconProps, "pathData">;

export const Iphone2Icon = Object.assign(
  React.forwardRef<IconRef, Iphone2IconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "Iphone2Icon", iconName: "iphone-2" as const }
);
