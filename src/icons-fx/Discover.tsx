import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  "M7.11914 5.92285C7.07378 5.49215 7.56086 5.21098 7.91113 5.46582L12.1309 8.53613C12.2452 8.61928 12.319 8.74717 12.334 8.8877L12.8828 14.0781C12.9281 14.5086 12.442 14.7895 12.0918 14.5352L7.87109 11.4648C7.75685 11.3817 7.68295 11.2538 7.66797 11.1133L7.11914 5.92285Z",
  "M10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0ZM10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2Z",
] as const;

const pathMeta = [undefined, { fillRule: "evenodd" as const, clipRule: "evenodd" as const }] as const;

type DiscoverIconProps = Omit<IconProps, "pathData" | "viewBox" | "pathMeta">;

export const DiscoverIcon = Object.assign(
  React.forwardRef<IconRef, DiscoverIconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} viewBox="0 0 20 20" pathMeta={pathMeta} {...props} />
  ),
  { displayName: "DiscoverIcon", iconName: "discover" as const }
);
