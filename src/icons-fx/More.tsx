import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  "M2.5 7.5C3.88071 7.5 5 8.61929 5 10C5 11.3807 3.88071 12.5 2.5 12.5C1.11929 12.5 0 11.3807 0 10C0 8.61929 1.11929 7.5 2.5 7.5ZM10 7.5C11.3807 7.5 12.5 8.61929 12.5 10C12.5 11.3807 11.3807 12.5 10 12.5C8.61929 12.5 7.5 11.3807 7.5 10C7.5 8.61929 8.61929 7.5 10 7.5ZM17.5 7.5C18.8807 7.5 20 8.61929 20 10C20 11.3807 18.8807 12.5 17.5 12.5C16.1193 12.5 15 11.3807 15 10C15 8.61929 16.1193 7.5 17.5 7.5Z"
] as const;

type MoreIconProps = Omit<IconProps, "pathData" | "viewBox" | "pathMeta">;

export const MoreIcon = Object.assign(
  React.forwardRef<IconRef, MoreIconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} viewBox="0 0 20 20" {...props} />
  ),
  { displayName: "MoreIcon", iconName: "more" as const }
);
