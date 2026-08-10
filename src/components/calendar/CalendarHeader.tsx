import { cn } from "../../lib/utils";
import { SlimArrowLeftIcon } from "../../icons/SlimArrowLeft";
import { SlimArrowRightIcon } from "../../icons/SlimArrowRight";
import type { Ref } from "react";
import { Button } from "../button";
import { ButtonDesign, ButtonSize } from "../../types/button";
import { useTranslation } from "react-i18next";

interface CalendarHeaderProps {
  /** Month button text */
  monthText: string;

  /** Year button text */
  yearText: string;

  /** Whether CLDR locale data is loaded (controls visibility of locale-dependent text) */
  cldrReady?: boolean;

  /** Is previous button disabled */
  isPreviousDisabled: boolean;

  /** Is next button disabled */
  isNextDisabled: boolean;

  /** Callback when previous button is clicked */
  onPrevious: () => void;

  /** Callback when next button is clicked */
  onNext: () => void;

  /** Callback when month button is clicked */
  onMonthClick: () => void;

  /** Callback when year button is clicked */
  onYearClick: () => void;

  /** Tooltip for previous button */
  previousTooltip?: string;

  /** Tooltip for next button */
  nextTooltip?: string;

  /** Additional CSS classes */
  className?: string;
}

export function CalendarHeader({
      monthText,
      yearText,
      cldrReady = true,
      isPreviousDisabled,
      isNextDisabled,
      onPrevious,
      onNext,
      onMonthClick,
      onYearClick,
      previousTooltip,
      nextTooltip,
      className,
      ref,
    }: CalendarHeaderProps & { ref?: Ref<HTMLDivElement> }) {
    const { t } = useTranslation("fx");
    const prevTip = previousTooltip ?? t("CALENDAR_PREVIOUS");
    const nextTip = nextTooltip ?? t("CALENDAR_NEXT");
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-2 px-2 py-[3px]",
          className
        )}
        role="toolbar"
        aria-label={t("CALENDAR_NAVIGATION")}
      >
        <Button
          design={ButtonDesign.Tertiary}
          size={ButtonSize.Medium}
          iconOnly
          icon={<SlimArrowLeftIcon className="h-4 w-4 rtl:rotate-180" />}
          accessibleName={prevTip}
          tooltip={prevTip}
          disabled={isPreviousDisabled}
          onClick={onPrevious}
        />

        <div className="flex items-center gap-2 flex-1 justify-center" role="group" aria-label={t("CALENDAR_CURRENT_DATE")}>
          {monthText && (
            <Button
              design={ButtonDesign.Tertiary}
              size={ButtonSize.Medium}
              accessibleName={`${monthText}, ${t("CALENDAR_SELECT_MONTH")}`}
              onClick={onMonthClick}
              className="text-sapphire-text-accent"
            >
              {cldrReady ? monthText : (
                <span className="inline-block h-4 w-16 rounded bg-muted animate-pulse" />
              )}
            </Button>
          )}
          <Button
            design={ButtonDesign.Tertiary}
            size={ButtonSize.Medium}
            accessibleName={`${yearText}, ${t("CALENDAR_SELECT_YEAR")}`}
            onClick={onYearClick}
            className="text-sapphire-text-accent"
          >
            {cldrReady ? yearText : (
              <span className="inline-block h-4 w-10 rounded bg-muted animate-pulse" />
            )}
          </Button>
        </div>

        <Button
          design={ButtonDesign.Tertiary}
          size={ButtonSize.Medium}
          iconOnly
          icon={<SlimArrowRightIcon className="h-4 w-4 rtl:rotate-180" />}
          accessibleName={nextTip}
          tooltip={nextTip}
          disabled={isNextDisabled}
          onClick={onNext}
        />
      </div>
    );
  }
