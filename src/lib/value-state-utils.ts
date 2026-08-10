import React from "react";
import { ValueState } from "../types/value-state";
import { SysEnter2Icon } from "../icons/SysEnter2";
import { ErrorIcon } from "../icons/Error";
import { WarningIcon } from "../icons/Warning";
import { InformationIcon } from "../icons/Information";
import type { I18nStrings } from "../i18n/types";

/**
 * Value state icon mapping — filled SAP icons matching Figma spec
 */
export const valueStateIcons: Record<ValueState, React.ElementType | null> = {
  [ValueState.None]: null,
  [ValueState.Positive]: SysEnter2Icon,
  [ValueState.Negative]: ErrorIcon,
  [ValueState.Critical]: WarningIcon,
  [ValueState.Information]: InformationIcon,
};

/**
 * Value state message color mapping
 */
export const valueStateMessageColors: Record<ValueState, string> = {
  [ValueState.None]: "text-sapphire-text-tertiary",
  [ValueState.Positive]: "text-sapphire-positive",
  [ValueState.Negative]: "text-sapphire-negative",
  [ValueState.Critical]: "text-sapphire-warning",
  [ValueState.Information]: "text-sapphire-info",
};

/**
 * Value state screen reader label keys (i18n translation keys)
 */
export const valueStateLabelKeys: Record<ValueState, keyof I18nStrings | ""> = {
  [ValueState.None]: "",
  [ValueState.Positive]: "VALUE_STATE_SUCCESS",
  [ValueState.Negative]: "VALUE_STATE_ERROR",
  [ValueState.Critical]: "VALUE_STATE_WARNING",
  [ValueState.Information]: "VALUE_STATE_INFORMATION",
};
