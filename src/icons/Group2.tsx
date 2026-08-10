import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M454 480h-44q-11 0-18.5-7.5T384 454t7.5-18 18.5-7h44q7 0 7-7V90q0-7-7-7h-44q-11 0-18.5-7T384 58t7.5-18.5T410 32h44q24 0 41 17t17 41v332q0 24-17 41t-41 17zm-352 0H58q-24 0-41-17T0 422V90q0-24 17-41t41-17h44q11 0 18.5 7.5T128 58t-7.5 18-18.5 7H58q-7 0-7 7v332q0 7 7 7h44q11 0 18.5 7t7.5 18-7.5 18.5T102 480zm256-301H154q-11 0-18.5-7t-7.5-18 7.5-18.5T154 128h204q11 0 18.5 7.5T384 154t-7.5 18-18.5 7zm0 96H154q-11 0-18.5-7t-7.5-18 7.5-18.5T154 224h204q11 0 18.5 7.5T384 250t-7.5 18-18.5 7zm-96 96H154q-11 0-18.5-7t-7.5-18 7.5-18.5T154 320h108q11 0 18.5 7.5T288 346t-7.5 18-18.5 7z'
] as const;

type Group2IconProps = Omit<IconProps, "pathData">;

export const Group2Icon = Object.assign(
  React.forwardRef<IconRef, Group2IconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "Group2Icon", iconName: "group-2" as const }
);
