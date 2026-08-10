import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M256 0q53 0 100 20t81.5 54.5T492 156t20 100-20 100-54.5 81.5T356 492t-100 20-100-20-81.5-54.5T20 356 0 256t20-100 54.5-81.5T156 20 256 0zm96 224q13 0 22.5-9.5T384 192t-9-23l-96-96q-10-9-23-9-12 0-23 9l-96 96q-9 10-9 23t9.5 22.5T160 224t23-9l73-74 73 74q11 9 23 9zm0 192q13 0 22.5-9.5T384 384t-9-23l-96-96q-10-9-23-9-12 0-23 9l-96 96q-9 10-9 23t9.5 22.5T160 416t23-9l73-74 73 74q11 9 23 9z'
] as const;

type SystemExit2IconProps = Omit<IconProps, "pathData">;

export const SystemExit2Icon = Object.assign(
  React.forwardRef<IconRef, SystemExit2IconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "SystemExit2Icon", iconName: "system-exit-2" as const }
);
