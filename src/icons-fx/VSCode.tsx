import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = ["M14.5 0.5L18.5 2.5C19.1 2.8 19.5 3.4 19.5 4.1V15.9C19.5 16.6 19.1 17.2 18.5 17.5L14.5 19.5C13.8 19.8 13 19.7 12.4 19.2L6.5 13.5L3.3 16C2.7 16.5 1.8 16.5 1.2 16L0.3 15.2C-0.1 14.7 -0.1 14 0.3 13.5L3 10.5L0.3 7.5C-0.1 7 -0.1 6.3 0.3 5.8L1.2 5C1.8 4.5 2.7 4.5 3.3 5L6.5 7.5L12.4 1.8C13 1.3 13.8 1.2 14.5 0.5ZM14.5 5.5V15.5L9.5 10.5L14.5 5.5Z"] as const;

const pathMeta = [{ fillRule: "evenodd" as const }] as const;

type VSCodeIconProps = Omit<IconProps, "pathData" | "viewBox" | "pathMeta">;

export const VSCodeIcon = Object.assign(
  React.forwardRef<IconRef, VSCodeIconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} viewBox="0 0 20 20" pathMeta={pathMeta} {...props} />
  ),
  { displayName: "VSCodeIcon", iconName: "vscode" as const }
);
