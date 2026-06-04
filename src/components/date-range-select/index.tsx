import { useEffect, useState } from "react";
import {
  format,
  subDays,
  subMonths,
  subWeeks,
  subYears,
  startOfWeek,
  startOfMonth,
  startOfYear,
  endOfDay,
  startOfDay,
} from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { CalendarIcon, ChevronDownIcon } from "lucide-react";
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
}

const now = new Date();
const today = endOfDay(now);

const presets: DateRangePreset[] = [
  {
    label: "Last 30 Days",
    value: DateRangeEnum.LAST_30_DAYS,
    getRange: () => ({
      from: subDays(today, 29),
      to: today,
      value: DateRangeEnum.LAST_30_DAYS,
      label: "for Past 30 Days",
    }),
  },
  {
    label: "Last Month",
    value: DateRangeEnum.LAST_MONTH,
    getRange: () => ({
      from: startOfMonth(subMonths(today, 1)),
      to: startOfMonth(today),
      value: DateRangeEnum.LAST_MONTH,
      label: "for Last Month",
    }),
  },
  {
    label: "Last 3 Months",
    value: DateRangeEnum.LAST_3_MONTHS,
    getRange: () => ({
      from: startOfMonth(subMonths(today, 3)),
      to: startOfMonth(today),
      value: DateRangeEnum.LAST_3_MONTHS,
      label: "for Past 3 Months",
    }),
  },
  {
    label: "Last Year",
    value: DateRangeEnum.LAST_YEAR,
    getRange: () => ({
      from: startOfYear(subYears(today, 1)),
      to: startOfYear(today),
      value: DateRangeEnum.LAST_YEAR,
      label: "for Past Year",
    }),
  },
  {
    label: "This Month",
    value: DateRangeEnum.THIS_MONTH,
    getRange: () => ({
      from: startOfMonth(today),
      to: today,
      value: DateRangeEnum.THIS_MONTH,
      label: "for This Month",
    }),
  },
  {
    label: "This Year",
    value: DateRangeEnum.THIS_YEAR,
    getRange: () => ({
      from: startOfYear(today),
      to: today,
      value: DateRangeEnum.THIS_YEAR,
      label: "for This Year",
    }),
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

const customCalendarPresets = [
  { label: "Today", getRange: () => ({ from: startOfDay(now), to: today }) },
  { label: "Last 7 days", getRange: () => ({ from: subDays(today, 6), to: today }) },
  { label: "Last 4 weeks", getRange: () => ({ from: subWeeks(today, 4), to: today }) },
  { label: "Last 3 months", getRange: () => ({ from: subMonths(today, 3), to: today }) },
  { label: "Week to date", getRange: () => ({ from: startOfWeek(now), to: today }) },
  { label: "Month to date", getRange: () => ({ from: startOfMonth(now), to: today }) },
  { label: "Year to date", getRange: () => ({ from: startOfYear(now), to: today }) },
  { label: "All time", getRange: () => ({ from: subYears(today, 10), to: today }) },
];

export const DateRangeSelect = ({
  dateRange,
  setDateRange,
  defaultRange = DateRangeEnum.LAST_30_DAYS,
}: DateRangeSelectProps) => {
  const [open, setOpen] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [customRange, setCustomRange] = useState<DateRange | undefined>(undefined);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const displayText = dateRange
    ? presets.find((p) => p.value === dateRange.value)?.label ||
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
    if (!isOpen) setShowCustom(false);
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
    setActivePreset(null);
  };

  const rangeLabel = customRange?.from && customRange?.to
    ? `Range: ${format(customRange.from, "MMM dd 00:00:00")} - ${format(customRange.to, "MMM dd 23:59:59, yyyy")}`
    : "Select a start and end date";

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            `w-[200px] flex items-center justify-between text-left font-normal !bg-[var(--secondary-dark-color)]
            border-gray-700 !text-white !cursor-pointer`,
            !dateRange && "text-muted-foreground"
          )}
        >
          {displayText}
          <ChevronDownIcon className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        {showCustom ? (
          <div className="flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b flex-wrap">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Date Range: Between</span>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 border rounded-md px-2 py-1 bg-muted/50">
                  <span className="text-xs text-muted-foreground">Start</span>
                  <span className="text-xs font-medium">
                    {customRange?.from ? format(customRange.from, "MMM dd, yyyy") : "—"}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">→</span>
                <div className="flex items-center gap-1.5 border rounded-md px-2 py-1 bg-muted/50">
                  <span className="text-xs text-muted-foreground">End</span>
                  <span className="text-xs font-medium">
                    {customRange?.to ? format(customRange.to, "MMM dd, yyyy") : "—"}
                  </span>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="flex">
              {/* Sidebar presets */}
              <div className="flex flex-col border-r py-2 min-w-[130px]">
                {customCalendarPresets.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => {
                      setCustomRange(p.getRange());
                      setActivePreset(p.label);
                    }}
                    className={cn(
                      "text-left text-sm px-4 py-1.5 hover:bg-accent transition-colors",
                      activePreset === p.label && "bg-accent font-medium"
                    )}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Calendar */}
              <div className="flex flex-col">
                <Calendar
                  mode="range"
                  selected={customRange}
                  onSelect={(range) => {
                    setCustomRange(range);
                    setActivePreset(null);
                  }}
                  numberOfMonths={2}
                  disabled={(date) => date > today}
                />
                {/* Time row */}
                <div className="flex border-t text-xs text-muted-foreground">
                  <div className="flex items-center gap-2 px-4 py-2 flex-1 border-r">
                    <span>🕐</span><span className="font-mono">00:00:00</span>
                    <span className="ml-auto">UTC-07</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 flex-1">
                    <span>🕐</span><span className="font-mono">23:59:59</span>
                    <span className="ml-auto">UTC-07</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/30">
              <span className="text-xs text-muted-foreground">{rangeLabel}</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={handleCancel}>Cancel</Button>
                <Button size="sm" onClick={handleApply} disabled={!customRange?.from || !customRange?.to}>
                  Apply
                </Button>
              </div>
            </div>
          </div>
        ) : (
          /* Default dropdown */
          <div className="grid py-1">
            {presets.map((preset) => (
              <Button
                key={preset.value}
                variant="ghost"
                className={cn(
                  "justify-start text-left",
                  dateRange?.value === preset.value && "bg-accent"
                )}
                onClick={() => {
                  setDateRange(preset.getRange());
                  setOpen(false);
                }}
              >
                {preset.label}
              </Button>
            ))}
            <div className="border-t my-1" />
            <Button
              variant="ghost"
              className={cn(
                "justify-start text-left gap-2",
                dateRange?.value === DateRangeEnum.CUSTOM && "bg-accent"
              )}
              onClick={() => {
                setCustomRange(undefined);
                setActivePreset(null);
                setShowCustom(true);
              }}
            >
              <CalendarIcon className="h-4 w-4" />
              Custom Range
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
