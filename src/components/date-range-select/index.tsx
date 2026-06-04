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
import { CalendarIcon } from "lucide-react";
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

const now = new Date();
const today = endOfDay(now);

const presets: DateRangePreset[] = [
  {
    label: "Today",
    value: "today",
    getRange: () => ({
      from: startOfDay(now),
      to: today,
      value: "today",
      label: "Today",
    }),
  },
  {
    label: "Last 7 days",
    value: DateRangeEnum.LAST_30_DAYS,
    getRange: () => ({
      from: subDays(today, 6),
      to: today,
      value: DateRangeEnum.LAST_30_DAYS,
      label: "Last 7 days",
    }),
  },
  {
    label: "Last 4 weeks",
    value: "last4weeks",
    getRange: () => ({
      from: subWeeks(today, 4),
      to: today,
      value: "last4weeks",
      label: "Last 4 weeks",
    }),
  },
  {
    label: "Last 3 months",
    value: DateRangeEnum.LAST_3_MONTHS,
    getRange: () => ({
      from: subMonths(today, 3),
      to: today,
      value: DateRangeEnum.LAST_3_MONTHS,
      label: "Last 3 months",
    }),
  },
  {
    label: "Week to date",
    value: "weekToDate",
    getRange: () => ({
      from: startOfWeek(now),
      to: today,
      value: "weekToDate",
      label: "Week to date",
    }),
  },
  {
    label: "Month to date",
    value: DateRangeEnum.THIS_MONTH,
    getRange: () => ({
      from: startOfMonth(now),
      to: today,
      value: DateRangeEnum.THIS_MONTH,
      label: "Month to date",
    }),
  },
  {
    label: "Year to date",
    value: DateRangeEnum.THIS_YEAR,
    getRange: () => ({
      from: startOfYear(now),
      to: today,
      value: DateRangeEnum.THIS_YEAR,
      label: "Year to date",
    }),
  },
  {
    label: "All time",
    value: DateRangeEnum.ALL_TIME,
    getRange: () => ({
      from: subYears(today, 10),
      to: today,
      value: DateRangeEnum.ALL_TIME,
      label: "All time",
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
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [customRange, setCustomRange] = useState<DateRange | undefined>(undefined);

  const displayText = dateRange?.from
    ? `${format(dateRange.from, "MMM dd")} - ${dateRange.to ? format(dateRange.to, "MMM dd, yyyy") : "..."}`
    : "Select date range";

  useEffect(() => {
    if (!dateRange) {
      const defaultPreset = presets.find((p) => p.value === defaultRange);
      if (defaultPreset) {
        setDateRange(defaultPreset.getRange());
        setSelectedPreset(defaultRange);
      }
    } else {
      setSelectedPreset(dateRange.value || null);
    }
  }, []);

  const handlePresetClick = (preset: DateRangePreset) => {
    setSelectedPreset(preset.value);
    const range = preset.getRange();
    if (range?.from && range?.to) {
      setCustomRange({ from: range.from, to: range.to });
    }
  };

  const handleApply = () => {
    if (!customRange?.from) return;
    const preset = presets.find((p) => p.value === selectedPreset);
    setDateRange({
      from: customRange.from,
      to: customRange.to ?? customRange.from,
      value: selectedPreset ?? DateRangeEnum.CUSTOM,
      label: preset?.label ?? "Custom Range",
    });
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
    if (dateRange?.from && dateRange?.to) {
      setCustomRange({ from: dateRange.from, to: dateRange.to });
    }
    setSelectedPreset(dateRange?.value ?? null);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen && dateRange?.from && dateRange?.to) {
      setCustomRange({ from: dateRange.from, to: dateRange.to });
      setSelectedPreset(dateRange.value ?? null);
    }
    setOpen(isOpen);
  };

  const rangeLabel = customRange?.from && customRange?.to
    ? `Range: ${format(customRange.from, "MMM dd HH:mm:ss")} - ${format(customRange.to, "MMM dd HH:mm:ss, yyyy")}`
    : "Select a start and end date";

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "flex items-center gap-2 text-left font-normal cursor-pointer",
            variant === "dark"
              ? "!bg-[var(--secondary-dark-color)] border-gray-700 !text-white"
              : "bg-background border-input text-foreground",
            !dateRange && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="h-4 w-4 opacity-70" />
          {displayText}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Date Range: Between</span>
            <div className="flex items-center gap-2 ml-2">
              <div className="flex items-center gap-1.5 border rounded-md px-2 py-1 bg-muted/50 min-w-[120px]">
                <span className="text-xs text-muted-foreground">Start</span>
                <span className="text-xs font-medium text-foreground">
                  {customRange?.from ? format(customRange.from, "MMM dd, yyyy") : "—"}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">→</span>
              <div className="flex items-center gap-1.5 border rounded-md px-2 py-1 bg-muted/50 min-w-[120px]">
                <span className="text-xs text-muted-foreground">End</span>
                <span className="text-xs font-medium text-foreground">
                  {customRange?.to ? format(customRange.to, "MMM dd, yyyy") : "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="flex">
            {/* Presets sidebar */}
            <div className="flex flex-col border-r py-2 min-w-[130px]">
              {presets.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => handlePresetClick(preset)}
                  className={cn(
                    "text-left text-sm px-4 py-1.5 hover:bg-accent transition-colors",
                    selectedPreset === preset.value && "bg-accent font-medium"
                  )}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Calendars */}
            <div className="flex flex-col">
              <Calendar
                mode="range"
                selected={customRange}
                onSelect={(range) => {
                  setCustomRange(range);
                  setSelectedPreset(DateRangeEnum.CUSTOM);
                }}
                numberOfMonths={2}
                disabled={(date) => date > today}
              />

              {/* Time display row */}
              <div className="flex border-t">
                <div className="flex items-center gap-2 px-4 py-2 flex-1 border-r">
                  <span className="text-xs text-muted-foreground">🕐</span>
                  <span className="text-xs font-mono">00:00:00</span>
                  <span className="text-xs text-muted-foreground ml-auto">UTC-07</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 flex-1">
                  <span className="text-xs text-muted-foreground">🕐</span>
                  <span className="text-xs font-mono">23:59:59</span>
                  <span className="text-xs text-muted-foreground ml-auto">UTC-07</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/30">
            <span className="text-xs text-muted-foreground">{rangeLabel}</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleApply}
                disabled={!customRange?.from || !customRange?.to}
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
