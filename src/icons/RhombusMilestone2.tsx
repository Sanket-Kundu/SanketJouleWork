import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M495 215q17 17 17 41 0 22-17 41L297 495q-17 17-41 17t-41-17L17 297Q0 278 0 256q0-24 17-41L215 17q17-17 41-17t41 17z'
] as const;

type RhombusMilestone2IconProps = Omit<IconProps, "pathData">;

export const RhombusMilestone2Icon = Object.assign(
  React.forwardRef<IconRef, RhombusMilestone2IconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "RhombusMilestone2Icon", iconName: "rhombus-milestone-2" as const }
);
