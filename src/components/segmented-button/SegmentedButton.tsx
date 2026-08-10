import {
  createContext,
  useContext,
  useCallback,
  useRef,
  type KeyboardEvent,
} from "react";
import { cn } from "../../lib/utils";
import {
  SegmentedButtonProps,
  SegmentedButtonItemProps,
  SegmentedButtonContextValue,
} from "../../types/segmented-button";
import { useTranslation } from "react-i18next";
import "./SegmentedButton.css";

/**
 * SegmentedButton context
 */
const SegmentedButtonContext = createContext<SegmentedButtonContextValue>({
  selectionMode: "Single",
  size: "Large",
  onItemSelect: () => {},
});

/**
 * SegmentedButton component
 *
 * A group of mutually exclusive buttons.
 *
 * @example
 * ```tsx
 * <SegmentedButton selectedId="view" onSelectionChange={({ selectedId }) => setMode(selectedId)}>
 *   <SegmentedButtonItem id="view" icon={<Eye />} text="View" />
 *   <SegmentedButtonItem id="edit" icon={<Edit />} text="Edit" />
 *   <SegmentedButtonItem id="test" icon={<Play />} text="Test" />
 * </SegmentedButton>
 * ```
 */
export function SegmentedButton({
  selectedId,
  selectedIds,
  selectionMode = "Single",
  size = "Large",
  children,
  onSelectionChange,
  accessibleName,
  accessibleNameRef,
  className,
  style,
  ref,
  "data-testid": dataTestId,
}: SegmentedButtonProps) {
    const { t } = useTranslation("fx");

    const handleItemSelect = useCallback(
      (id: string, item: SegmentedButtonItemProps) => {
        if (selectionMode === "Multiple") {
          const current = selectedIds ?? [];
          const newIds = current.includes(id)
            ? current.filter((i) => i !== id)
            : [...current, id];
          onSelectionChange?.({
            selectedItem: item,
            selectedId: id,
            selectedIds: newIds,
          });
        } else {
          onSelectionChange?.({
            selectedItem: item,
            selectedId: id,
            selectedIds: [id],
          });
        }
      },
      [onSelectionChange, selectionMode, selectedIds]
    );

    const innerRef = useRef<HTMLUListElement>(null);

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLUListElement>) => {
        const container = innerRef.current;
        if (!container) return;

        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
          const items = Array.from(
            container.querySelectorAll<HTMLLIElement>(
              'li[role="option"]:not([aria-disabled="true"])'
            )
          );
          if (items.length === 0) return;

          const currentIndex = items.indexOf(
            (document.activeElement as HTMLElement)?.closest?.("li") as HTMLLIElement
          );
          if (currentIndex === -1) return;

          e.preventDefault();
          const next =
            e.key === "ArrowRight"
              ? (currentIndex + 1) % items.length
              : (currentIndex - 1 + items.length) % items.length;

          items[next].focus();
        } else if (e.key === "Enter" || e.key === " ") {
          const focused = (document.activeElement as HTMLElement)?.closest?.(
            'li[role="option"]'
          ) as HTMLLIElement | null;
          if (focused) {
            e.preventDefault();
            focused.click();
          }
        }
      },
      []
    );

    return (
      <SegmentedButtonContext.Provider
        value={{
          selectedId,
          selectedIds,
          selectionMode,
          size,
          onItemSelect: handleItemSelect,
        }}
      >
        <ul
          ref={(node) => {
            (innerRef as React.MutableRefObject<HTMLUListElement | null>).current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) (ref as React.MutableRefObject<HTMLUListElement | null>).current = node;
          }}
          role="listbox"
          data-size={size}
          aria-label={accessibleName || t("SEGMENTEDBUTTON_ARIA_DESCRIPTION")}
          aria-labelledby={accessibleNameRef}
          aria-multiselectable={selectionMode === "Multiple" || undefined}
          onKeyDown={handleKeyDown}
          className={cn(
            "fx-segmented-button relative inline-flex list-none m-0 gap-1",
            "after:absolute after:inset-0 after:border after:border-[var(--border-secondary)] after:pointer-events-none after:z-20",
            size === "Large" ? "rounded-[8px] after:rounded-[8px]" : "rounded-[4px] after:rounded-[4px]",
            className
          )}
          style={style}
          data-testid={dataTestId}
        >
          {children}
        </ul>
      </SegmentedButtonContext.Provider>
    );
}

/**
 * SegmentedButtonItem component
 */
export function SegmentedButtonItem({
  id,
  text,
  icon,
  selected: controlledSelected,
  disabled = false,
  tooltip,
  className,
  ref,
  "data-testid": dataTestId,
}: SegmentedButtonItemProps) {
    const { selectedId, selectedIds, selectionMode, size, onItemSelect } =
      useContext(SegmentedButtonContext);
    const { t } = useTranslation("fx");

    const isSelected =
      controlledSelected ??
      (selectionMode === "Multiple"
        ? selectedIds?.includes(id) ?? false
        : selectedId === id);

    const itemRef = useRef<HTMLLIElement>(null);

    const handleClick = () => {
      if (disabled) return;
      itemRef.current?.focus();
      onItemSelect(id, { id, text, icon, selected: true, disabled, tooltip });
    };

    const isIconOnly = icon && !text;
    const isLarge = size === "Large";

    return (
     <li
        ref={(node) => {
          (itemRef as React.MutableRefObject<HTMLLIElement | null>).current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLLIElement | null>).current = node;
        }}
        role="option"
        aria-selected={isSelected}
        aria-disabled={disabled || undefined}
        aria-roledescription={t("SEGMENTEDBUTTONITEM_ARIA_DESCRIPTION")}
        tabIndex={isSelected ? 0 : -1}
        title={tooltip}
        onClick={handleClick}
        data-testid={dataTestId}
        className={cn(
          "inline-flex items-center justify-center transition-[color,background-color] cursor-pointer relative",
          isIconOnly
            ? (isLarge ? "rounded-[8px] h-10 w-10" : size === "Medium" ? "rounded-[4px] h-8 w-8 text-sm" : "rounded-[4px] h-6 w-6 text-xs")
            : (isLarge
                ? "rounded-[8px] h-10 min-w-[2.5rem] px-4 text-base gap-2 font-semibold"
                : size === "Medium"
                  ? "rounded-[4px] h-8 min-w-[2rem] px-3 text-sm gap-1.5 font-semibold"
                  : "rounded-[4px] h-6 min-w-[1.5rem] px-2 text-xs gap-1 font-normal"),
          "focus:z-30 focus:[outline-style:solid] focus:outline-2 focus:-outline-offset-2 focus:outline-sapphire-border-focus",
          isLarge ? "first:rounded-l-[8px] last:rounded-r-[8px]" : "first:rounded-l-[4px] last:rounded-r-[4px]",
          isSelected
            ? "z-10 bg-sapphire-brand-selected-background text-sapphire-brand-pressed-background hover:bg-sapphire-brand-toggle-background"
            : "text-sapphire-neutral-foreground-black hover:bg-sapphire-neutral-hover-background-2 active:bg-sapphire-neutral-pressed-background-2",
          disabled && "pointer-events-none opacity-40",
          className
        )}
      >
        {icon && <span className={cn("inline-flex items-center", isLarge ? "h-5 w-5 [&>svg]:h-4 [&>svg]:w-4" : size === "Medium" ? "h-4 w-4 [&>svg]:h-3.5 [&>svg]:w-3.5" : "h-3 w-3 [&>svg]:h-[10.5px] [&>svg]:w-[10.5px]")}>{icon}</span>}
        {text && <span>{text}</span>}
      </li>
    );
}
