import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M422 76q38 0 64 26.5t26 63.5v224q0 38-26 64t-64 26H90q-38 0-64-26T0 390V122q0-38 26-64t64-26h115q9 0 18 7l44 37h155zM90 83q-17 0-28 11t-11 28v134h45v-70q0-11 7.5-18.5T122 160h268q11 0 18.5 7.5T416 186v70h45v-90q0-16-11-27t-28-11H256q-5 0-9.5-2.5T238 120l-44-37H90zm275 128H147v45h218v-45zM51 307v83q0 17 11 28t28 11h332q17 0 28-11t11-28v-83H51z'
] as const;

type Folder2IconProps = Omit<IconProps, "pathData">;

export const Folder2Icon = Object.assign(
  React.forwardRef<IconRef, Folder2IconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "Folder2Icon", iconName: "folder-2" as const }
);
