import * as React from "react";
import type { Ref } from "react";
import { useTranslation } from "react-i18next";
import { CheckBox } from "../checkbox/CheckBox";
import { RadioButton } from "../radiobutton/RadioButton";
import { Button } from "../button/Button";
import { DeleteIcon } from "../../icons/Delete";
import { ButtonDesign, ButtonClickEventDetail } from "../../types/button";
import { ListSelectionMode } from "../../types/list";

export interface ListSelectionControlProps {
  selectionMode: ListSelectionMode | `${ListSelectionMode}`;
  position: "before" | "after";
  isSelected: boolean;
  disabled?: boolean;
  itemText?: string;
  deleteButton?: React.ReactNode;
  onSelectionChange: (checked: boolean) => void;
  onDeleteClick?: () => void;
}

/**
 * Helper component that renders the appropriate selection control
 * (checkbox, radio button, or delete button) based on selection mode.
 *
 * This is a convenience component that consumers can use when building
 * custom list items. It's not required - consumers can render their own
 * selection controls if they prefer.
 */
export function ListSelectionControl({
      selectionMode,
      position,
      isSelected,
      disabled = false,
      itemText = "item",
      deleteButton,
      onSelectionChange,
      onDeleteClick,
      ref,
    }: ListSelectionControlProps & { ref?: Ref<HTMLSpanElement> }) {
    const { t } = useTranslation("fx");
    const modeStr = String(selectionMode);

    // Determine what to show based on mode and position
    const showSelectionBefore = position === "before" && (modeStr === "Multiple" || modeStr === "SingleStart");
    const showSelectionAfter = position === "after" && (modeStr === "SingleEnd" || modeStr === "Delete");
    const showRadio = modeStr === "SingleStart" || modeStr === "SingleEnd" || modeStr === "Single";
    const showCheckbox = modeStr === "Multiple";
    const showDelete = modeStr === "Delete";

    if (!showSelectionBefore && !showSelectionAfter) {
      return null;
    }

    // Handle delete button click
    const handleDeleteClick = (detail: ButtonClickEventDetail) => {
      detail.originalEvent.stopPropagation(); // Prevent event from bubbling to list item
      onDeleteClick?.();
    };

    return (
      <span
        ref={ref}
        className="shrink-0 pl-3 pr-1 flex items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Checkbox for multiple selection */}
        {showCheckbox && (
          <CheckBox
            checked={isSelected}
            onChange={(e) => onSelectionChange(e.checked)}
            disabled={disabled}
            accessibleName={`Select ${itemText}`}
            tabIndex={-1}
          />
        )}

        {/* Radio button for single selection */}
        {showRadio && !showDelete && (
          <RadioButton
            checked={isSelected}
            onChange={(e) => onSelectionChange(e.checked)}
            disabled={disabled}
            accessibleName={`Select ${itemText}`}
            tabIndex={-1}
          />
        )}

        {/* Delete button */}
        {showDelete && (
          deleteButton
            ? React.cloneElement(deleteButton as React.ReactElement<{ onClick?: (detail: ButtonClickEventDetail) => void }>, {
                onClick: handleDeleteClick,
              })
            : (
              <Button
                design={ButtonDesign.Tertiary}
                iconOnly
                icon={<DeleteIcon className="h-4 w-4" />}
                onClick={handleDeleteClick}
                accessibleName={t("LIST_DELETE_ITEM")}
                tooltip={t("LIST_DELETE")}
                tabIndex={-1}
              />
            )
        )}
      </span>
    );
  }
