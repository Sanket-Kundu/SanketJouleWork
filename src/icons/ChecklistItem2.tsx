import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M422 32q24 0 41 17t17 41v231q0 34-29 50L269 477q-6 3-13 3t-13-3L61 371q-29-16-29-50V90q0-24 17-41t41-17h332zm-47 150q9-9 9-22t-9.5-22.5T352 128q-14 0-23 10l-98 104-48-49q-10-10-23-10t-22.5 9.5T128 215q0 14 9 23l72 72q9 10 23 10 13 0 23-10z'
] as const;

type ChecklistItem2IconProps = Omit<IconProps, "pathData">;

export const ChecklistItem2Icon = Object.assign(
  React.forwardRef<IconRef, ChecklistItem2IconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "ChecklistItem2Icon", iconName: "checklist-item-2" as const }
);
