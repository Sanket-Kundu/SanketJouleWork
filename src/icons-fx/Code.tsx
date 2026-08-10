import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  "M6.29297 6.29297C6.68349 5.90244 7.31651 5.90244 7.70703 6.29297C8.09754 6.68349 8.09755 7.31651 7.70703 7.70703L5.41406 10L7.70703 12.293C8.09754 12.6835 8.09755 13.3165 7.70703 13.707C7.31651 14.0976 6.68349 14.0975 6.29297 13.707L3.29297 10.707C2.90244 10.3165 2.90244 9.68349 3.29297 9.29297L6.29297 6.29297Z",
  "M12.293 6.29297C12.6835 5.90245 13.3165 5.90246 13.707 6.29297L16.707 9.29297C17.0976 9.68349 17.0976 10.3165 16.707 10.707L13.707 13.707C13.3165 14.0976 12.6835 14.0976 12.293 13.707C11.9025 13.3165 11.9024 12.6835 12.293 12.293L14.5859 10L12.293 7.70703C11.9025 7.31651 11.9024 6.68349 12.293 6.29297Z",
  "M17 0C18.6569 0 20 1.34315 20 3V17C20 18.6569 18.6569 20 17 20H3C1.34315 20 0 18.6569 0 17V3C0 1.34315 1.34315 0 3 0H17ZM3 2C2.44772 2 2 2.44772 2 3V17C2 17.5523 2.44772 18 3 18H17C17.5523 18 18 17.5523 18 17V3C18 2.44772 17.5523 2 17 2H3Z",
] as const;

const pathMeta = [undefined, undefined, { fillRule: "evenodd" as const, clipRule: "evenodd" as const }] as const;

type CodeIconProps = Omit<IconProps, "pathData" | "viewBox" | "pathMeta">;

export const CodeIcon = Object.assign(
  React.forwardRef<IconRef, CodeIconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} viewBox="0 0 20 20" pathMeta={pathMeta} {...props} />
  ),
  { displayName: "CodeIcon", iconName: "code" as const }
);
