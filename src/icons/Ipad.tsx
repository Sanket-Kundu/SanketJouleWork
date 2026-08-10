import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M405 0q31 0 53 21t22 51v368q0 30-22 51t-53 21H107q-31 0-53-21t-22-51V72q0-30 22-51t53-21h298zm24 438V74H83v364h346z'
] as const;

type IpadIconProps = Omit<IconProps, "pathData">;

export const IpadIcon = Object.assign(
  React.forwardRef<IconRef, IpadIconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "IpadIcon", iconName: "ipad" as const }
);
