import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M142 48q-14-6-14-22 0-11 7-18.5T153 0q6 0 12 3l205 102q14 8 14 23 0 11-7.5 18.5T358 154q-6 0-11-3zm0 103q-14-8-14-23 0-11 7-18.5t18-7.5q6 0 12 3l205 102q14 9 14 23 0 11-7.5 18.5T358 256q-6 0-11-3zm228 159q14 7 14 23 0 14-14 23l-38 18v80q0 24-16.5 41T275 512h-39q-23 0-40-17t-17-41v-80l-37-18q-14-8-14-23 0-11 7-18.5t18-7.5q6 0 12 3l51 25q14 8 14 23v26h51v-26q0-14 14-23l6-2-159-80q-14-6-14-23 0-11 7-18t18-7q4 0 12 2zm-95 151q6 0 6-7v-19h-51v19q0 7 6 7h39z'
] as const;

type EnergySavingLightbulbIconProps = Omit<IconProps, "pathData">;

export const EnergySavingLightbulbIcon = Object.assign(
  React.forwardRef<IconRef, EnergySavingLightbulbIconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "EnergySavingLightbulbIcon", iconName: "energy-saving-lightbulb" as const }
);
