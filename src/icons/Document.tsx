import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M422 0q11 0 18.5 7.5T448 26v460q0 11-7.5 18.5T422 512H90q-11 0-18.5-7.5T64 486V192q0-10 6-17L213 9q6-9 19-9h190zm-25 51H244l-20 24v66q0 21-15 36t-36 15h-50l-8 9v260h282V51z'
] as const;

type DocumentIconProps = Omit<IconProps, "pathData">;

export const DocumentIcon = Object.assign(
  React.forwardRef<IconRef, DocumentIconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "DocumentIcon", iconName: "document" as const }
);
