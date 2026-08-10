import React, { useRef } from "react";
import { cn } from "../../lib/utils";
import type { TableToolbarProps } from "../../types/table";
import { Toolbar } from "../toolbar/Toolbar";
import { ToolbarDesign, ToolbarAlign, type ToolbarRef } from "../../types/toolbar";
import { useTranslation } from "react-i18next";

export function TableToolbar(
  { sticky, alignContent = ToolbarAlign.Start, className, style, children, ref, ...rest }: TableToolbarProps,
) {
  const innerRef = useRef<ToolbarRef>(null);
  const { t } = useTranslation("fx");

  // Merge consumer ref with our internal ref and set aria-roledescription
  // imperatively since Toolbar doesn't spread extra DOM attributes.
  const mergedRef = React.useCallback(
    (instance: ToolbarRef | null) => {
      innerRef.current = instance;
      // Set as early as possible — ref callback fires before paint
      instance?.nativeElement?.setAttribute("aria-roledescription", t("TABLE_TOOLBAR_ROLEDESCRIPTION"));
      if (typeof ref === "function") ref(instance);
      else if (ref) ref.current = instance;
    },
    [ref, t],
  );

  return (
    <Toolbar
      ref={mergedRef}
      design={ToolbarDesign.Transparent}
      accessibleName={t("TABLE_TOOLBAR")}
      alignContent={alignContent}
      className={cn(
        "pl-4 min-h-[48px] rounded-t-lg",
        // Force all heading levels inside the toolbar to H5 visual style
        "[&_h1]:text-base [&_h1]:leading-[1.375rem] [&_h1]:font-semibold",
        "[&_h2]:text-base [&_h2]:leading-[1.375rem] [&_h2]:font-semibold",
        "[&_h3]:text-base [&_h3]:leading-[1.375rem] [&_h3]:font-semibold",
        "[&_h4]:text-base [&_h4]:leading-[1.375rem] [&_h4]:font-semibold",
        "[&_h5]:text-base [&_h5]:leading-[1.375rem] [&_h5]:font-semibold",
        "[&_h6]:text-base [&_h6]:leading-[1.375rem] [&_h6]:font-semibold",
        sticky && "sticky z-20 bg-sapphire-canvas-primary",
        className,
      )}
      style={style}
      {...rest}
    >
      {children}
    </Toolbar>
  );
}

TableToolbar.displayName = "TableToolbar";
(TableToolbar as unknown as { _tableRole: string })._tableRole = "Toolbar";
