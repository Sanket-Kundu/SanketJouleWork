import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M422 512q-9 0-14-4L256 402 104 508q-5 4-14 4-11 0-18.5-7.5T64 486V90q0-38 26-64t64-26h204q38 0 64 26t26 64v396q0 11-7.5 18.5T422 512zM256 346q8 0 15 4l126 87V90q0-17-11-28t-28-11H154q-17 0-28 11t-11 28v347l126-87q7-4 15-4z'
] as const;

type Bookmark2IconProps = Omit<IconProps, "pathData">;

export const Bookmark2Icon = Object.assign(
  React.forwardRef<IconRef, Bookmark2IconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "Bookmark2Icon", iconName: "bookmark-2" as const }
);
