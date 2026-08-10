import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M10 276q-10-8-10-20t10-20L214 70q8-6 16-6 11 0 18.5 7.5T256 90v332q0 11-7.5 18.5T230 448q-8 0-16-6zm256 0q-10-8-10-20t10-20L470 70q8-6 16-6 11 0 18.5 7.5T512 90v332q0 11-7.5 18.5T486 448q-8 0-16-6zM66 256l139 113V143zm256 0l139 113V143z'
] as const;

type MediaRewindIconProps = Omit<IconProps, "pathData">;

export const MediaRewindIcon = Object.assign(
  React.forwardRef<IconRef, MediaRewindIconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "MediaRewindIcon", iconName: "media-rewind" as const }
);
