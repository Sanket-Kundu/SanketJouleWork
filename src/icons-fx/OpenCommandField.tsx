import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  "M16.5625 1.25C18.461 1.25 20 2.78902 20 4.6875V15.3125C20 17.211 18.461 18.75 16.5625 18.75C12.179 18.75 7.8143 18.75 3.4375 18.75C1.53902 18.75 0 17.211 0 15.3125V4.6875C2.21466e-07 2.78902 1.53902 1.25 3.4375 1.25H16.5625ZM6.875 16.875H16.5625C17.4254 16.875 18.125 16.1754 18.125 15.3125V4.6875C18.125 3.82456 17.4254 3.125 16.5625 3.125H6.875V16.875ZM3.4375 3.125C2.57456 3.125 1.875 3.82456 1.875 4.6875V15.3125C1.875 16.1754 2.57456 16.875 3.4375 16.875H5V3.125H3.4375Z"
] as const;

type OpenCommandFieldIconProps = Omit<IconProps, "pathData" | "viewBox" | "pathMeta">;

export const OpenCommandFieldIcon = Object.assign(
  React.forwardRef<IconRef, OpenCommandFieldIconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} viewBox="0 0 20 20" {...props} />
  ),
  { displayName: "OpenCommandFieldIcon", iconName: "open-command-field" as const }
);
