/**
 * Value state for validation feedback
 */
export enum ValueState {
  /** No state - default */
  None = "None",
  /** Success state (green) */
  Positive = "Positive",
  /** Error state (red) */
  Negative = "Negative",
  /** Warning state (orange) */
  Critical = "Critical",
  /** Information state (blue) */
  Information = "Information",
}
