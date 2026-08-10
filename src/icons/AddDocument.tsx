import React from "react";
import { Icon } from "../components/icon/Icon";
import type { IconProps, IconRef } from "../types/icon";

const pathData = [
  'M83 201v260h83q11 0 18.5 7t7.5 18-7.5 18.5T166 512H58q-11 0-18.5-7.5T32 486V192q0-10 6-17L181 9q6-9 19-9h190q11 0 18.5 7.5T416 26v172q0 11-7.5 18.5T390 224t-18-7.5-7-18.5V51H212l-20 24v66q0 21-15 36t-36 15H91zm371 173q11 0 18.5 7.5T480 400t-7.5 18.5T454 426h-60v60q0 11-7.5 18.5T368 512t-18.5-7.5T342 486v-60h-60q-11 0-18.5-7.5T256 400t7.5-18.5T282 374h60v-60q0-11 7.5-18.5T368 288t18.5 7.5T394 314v60h60z'
] as const;

type AddDocumentIconProps = Omit<IconProps, "pathData">;

export const AddDocumentIcon = Object.assign(
  React.forwardRef<IconRef, AddDocumentIconProps>(
    (props, ref) => <Icon ref={ref} pathData={pathData} {...props} />
  ),
  { displayName: "AddDocumentIcon", iconName: "add-document" as const }
);
