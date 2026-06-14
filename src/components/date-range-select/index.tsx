import { useEffect, useState } from "react";
import {
  format,
  subDays,
  subMonths,
  subYears,
  startOfMonth,
  startOfYear,
  endOfMonth,
  endOfYear,
  endOfDay,
} from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";

export const DateRangeEnum = {
  LAST_30_DAYS: "30days",
  LAST_MONTH: "lastMonth",
  LAST_3_MONTHS: "last3Months",
  LAST_YEAR: "lastYear",
  THIS_MONTH: "thisMonth",
  THIS_YEAR: "thisYear",
  ALL_TIME: "allTime",
  CUSTOM: "custom",
} as const;

export type DateRangeEnumType =
  (typeof DateRangeEnum)[keyof typeof DateRangeEnum];

export type DateRangeType = {
  from: Date | null;
  to: Date | null;
  value?: string;
  label: string;
} | null;

type DateRangePreset = {
  label: string;
  value: string;
  getRange: () => DateRangeType;
};

interface DateRangeSelectProps {
  dateRange: DateRangeType;
  setDateRange: (range: DateRangeType) => void;
  defaultRange?: DateRangeEnumType;
  variant?: "dark" | "light";
}

const getToday = () => endOfDay(new Date());

const presets: DateRangePreset[] = [
  {
    label: "Last 30 Days",
    value: DateRangeEnum.LAST_30_DAYS,
    getRange: () => {
      const today = getToday();
      return {
        from: subDays(today, 29),
        to: today,
        value: DateRangeEnum.LAST_30_DAYS,
        label: "for Past 30 Days",
      };
    },
  },
  {
    label: "Last Month",
    value: DateRangeEnum.LAST_MONTH,
    getRange: () => {
      const today = getToday();
      return {
        from: startOfMonth(subMonths(today, 1)),
        to: endOfMonth(subMonths(today, 1)),
        value: DateRangeEnum.LAST_MONTH,
        label: "for Last Month",
      };
    },
  },
  {
    label: "Last 3 Months",
    value: DateRangeEnum.LAST_3_MONTHS,
    getRange: () => {
      const today = getToday();
      return {
        from: startOfMonth(subMonths(today, 3)),
        to: endOfMonth(subMonths(today, 1)),
        value: DateRangeEnum.LAST_3_MONTHS,
        label: "for Past 3 Months",
      };
    },
  },
  {
    label: "Last Year",
    value: DateRangeEnum.LAST_YEAR,
    getRange: () => {
      const today = getToday();
      return {
        from: startOfYear(subYears(today, 1)),
        to: endOfYear(subYears(today, 1)),
        value: DateRangeEnum.LAST_YEAR,
        label: "for Past Year",
      };
    },
  },
  {
    label: "This Month",
    value: DateRangeEnum.THIS_MONTH,
    getRange: () => {
      const today = getToday();
      return {
        from: startOfMonth(today),
        to: today,
        value: DateRangeEnum.THIS_MONTH,
        label: "for This Month",
      };
    },
  },
  {
    label: "This Year",
    value: DateRangeEnum.THIS_YEAR,
    getRange: () => {
      const today = getToday();
      return {
        from: startOfYear(today),
        to: today,
        value: DateRangeEnum.THIS_YEAR,
        label: "for This Year",
      };
    },
  },
  {
    label: "All Time",
    value: DateRangeEnum.ALL_TIME,
    getRange: () => ({
      from: null,
      to: null,
      value: DateRangeEnum.ALL_TIME,
      label: "across All Time",
    }),
  },
];

export const DateRangeSelect = ({
  dateRange,
  setDateRange,
  defaultRange = DateRangeEnum.LAST_30_DAYS,
  variant = "dark",
}: DateRangeSelectProps) => {
  const [open, setOpen] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [customRange, setCustomRange] = useState<DateRange | undefined>(
    undefined
  );

  const displayText = dateRange
    ? dateRange.value === DateRangeEnum.CUSTOM && dateRange.from
      ? `${format(dateRange.from, "MMM dd, y")} - ${
          dateRange.to ? format(dateRange.to, "MMM dd, y") : "..."
        }`
      : presets.find((p) => p.value === dateRange.value)?.label ||
        (dateRange.from
          ? `${format(dateRange.from, "MMM dd, y")} - ${
              dateRange.to ? format(dateRange.to, "MMM dd, y") : "Present"
            }`
          : "Select a duration")
    : "Select a duration";

  useEffect(() => {
    if (!dateRange) {
      const defaultPreset = presets.find((p) => p.value === defaultRange);
      if (defaultPreset) {
        setDateRange(defaultPreset.getRange());
      }
    }
  }, [dateRange, defaultRange, setDateRange]);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setShowCustom(false);
      setCustomRange(undefined);
    }
  };

  const handleApply = () => {
    if (!customRange?.from || !customRange?.to) return;
    setDateRange({
      from: customRange.from,
      to: customRange.to,
      value: DateRangeEnum.CUSTOM,
      label: "Custom Range",
    });
    setOpen(false);
    setShowCustom(false);
  };

  const handleCancel = () => {
    setShowCustom(false);
    setCustomRange(undefined);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-label={`Select date range: ${displayText}`}
          className={cn(
            "w-50 flex items-center justify-between text-left font-normal cursor-pointer",
            variant === "dark"
              ? "bg-(--secondary-dark-color)! border-gray-700 text-white!"
              : "bg-background border-input text-foreground",
            !dateRange && "text-muted-foreground"
          )}
        >
          {displayText}
          <ChevronDownIcon className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className={cn("p-0 overflow-hidden", showCustom ? "w-67" : "w-44")}
        align="start"
      >
        {showCustom ? (
          <div className="flex flex-col">
            {/* Compact header: Back | status | Apply */}
            <div className="flex items-center justify-between px-3 py-2 border-b">
              <button
                type="button"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                onClick={handleCancel}
              >
                ← Back
              </button>
              <span className="text-xs text-muted-foreground">
                {!customRange?.from
                  ? "Pick start date"
                  : !customRange?.to
                  ? "Pick end date"
                  : `${format(customRange.from, "MMM d")} – ${format(customRange.to, "MMM d, y")}`}
              </span>
              <button
                type="button"
                className={cn(
                  "text-xs font-medium transition-colors",
                  customRange?.from && customRange?.to
                    ? "text-primary hover:text-primary/80"
                    : "text-muted-foreground/40 cursor-not-allowed"
                )}
                disabled={!customRange?.from || !customRange?.to}
                onClick={handleApply}
              >
                Apply
              </button>
            </div>
            <Calendar
              mode="range"
              selected={customRange}
              onSelect={setCustomRange}
              numberOfMonths={1}
              disabled={(date) => date > getToday()}
            />
          </div>
        ) : (
          <div className="py-1">
            {presets.map((preset) => (
              <button
                key={preset.value}
                type="button"
                className={cn(
                  "w-full text-left text-sm px-3 py-1.5 hover:bg-accent transition-colors",
                  dateRange?.value === preset.value && "bg-accent font-medium"
                )}
                onClick={() => {
                  setDateRange(preset.getRange());
                  setOpen(false);
                }}
              >
                {preset.label}
              </button>
            ))}
            <div className="border-t my-1 mx-2" />
            <button
              type="button"
              className={cn(
                "w-full text-left text-sm px-3 py-1.5 hover:bg-accent transition-colors flex items-center gap-2",
                dateRange?.value === DateRangeEnum.CUSTOM && "bg-accent font-medium"
              )}
              onClick={() => {
                setCustomRange(undefined);
                setShowCustom(true);
              }}
            >
              <CalendarIcon className="h-3.5 w-3.5 opacity-60" />
              Custom Range
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
