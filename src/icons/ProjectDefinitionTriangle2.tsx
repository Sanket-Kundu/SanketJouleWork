import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M473 387q7 14 7 29 0 26-18 45t-46 19H96q-28 0-46-19t-18-45q0-15 7-29L198 67q9-17 24.5-26t32.5-9 33 9 25 26z'
] as const;

type ProjectDefinitionTriangle2IconProps = Omit<IconProps, "pathData">;

export const ProjectDefinitionTriangle2Icon = Object.assign(
  React.forwardRef<IconRef, ProjectDefinitionTriangle2IconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "ProjectDefinitionTriangle2Icon", iconName: "project-definition-triangle-2" as const }
);
