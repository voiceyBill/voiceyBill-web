import { useEffect, useMemo, useRef, useState } from "react";
import {
  eachDayOfInterval,
  endOfDay,
  endOfYear,
  format,
  isSameDay,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfYear,
  subDays,
  subYears,
} from "date-fns";
import { CalendarIcon, ChevronDownIcon } from "lucide-react";
import type { DayPickerProps, Matcher } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type DatePreset = {
  label: string;
  value: string;
  getRange: () => { from: Date; to: Date };
};

const today = endOfDay(new Date());
const calendarStartMonth = startOfMonth(new Date(today.getFullYear() - 100, 0));
const calendarEndMonth = startOfMonth(new Date(today.getFullYear() + 1, 11));

const calendarDropdownClassNames = {
  month_caption: "flex h-9 items-center justify-center gap-1 w-full",
  dropdowns: "flex items-center justify-center gap-1.5 w-full",
  dropdown_root: "relative inline-flex items-center",
  dropdown:
    "h-8 cursor-pointer appearance-none rounded-md border border-input bg-background px-2 pr-7 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-ring/50",
  caption_label: "sr-only",
};

const presets: DatePreset[] = [
  {
    label: "Last 7 days",
    value: "last7days",
    getRange: () => ({
      from: startOfDay(subDays(today, 6)),
      to: today,
    }),
  },
  {
    label: "Last 30 days",
    value: "last30days",
    getRange: () => ({
      from: startOfDay(subDays(today, 29)),
      to: today,
    }),
  },
  {
    label: "Current month",
    value: "currentMonth",
    getRange: () => ({
      from: startOfMonth(today),
      to: today,
    }),
  },
  {
    label: "Current year",
    value: "currentYear",
    getRange: () => ({
      from: startOfYear(today),
      to: today,
    }),
  },
  {
    label: "Last year",
    value: "lastYear",
    getRange: () => {
      const lastYear = subYears(today, 1);
      return {
        from: startOfYear(lastYear),
        to: endOfYear(lastYear),
      };
    },
  },
];

function toDateString(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

function parseDateString(value: string): Date | undefined {
  if (!value.trim()) return undefined;
  const parsed = parseISO(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

function getInRangeDays(from?: Date, to?: Date): Date[] {
  if (!from || !to) return [];
  const start = from <= to ? from : to;
  const end = from <= to ? to : from;
  if (isSameDay(start, end)) return [];
  return eachDayOfInterval({ start, end }).filter(
    (day) => !isSameDay(day, start) && !isSameDay(day, end),
  );
}

function matchesPreset(dateFrom: string, dateTo: string): string | null {
  const from = parseDateString(dateFrom);
  const to = parseDateString(dateTo);
  if (!from || !to) return null;

  for (const preset of presets) {
    const range = preset.getRange();
    if (isSameDay(from, range.from) && isSameDay(to, range.to)) {
      return preset.value;
    }
  }

  return null;
}

function getCalendarMonths(from?: Date, to?: Date) {
  return {
    openMonth: startOfMonth(from ?? to ?? today),
    closeMonth: startOfMonth(to ?? from ?? today),
  };
}

type PickerCalendarProps = {
  label: string;
  selected?: Date;
  onSelect: (date?: Date) => void;
  month: Date;
  onMonthChange: (month: Date) => void;
  modifiers: Record<string, Matcher | Matcher[] | undefined>;
  modifiersClassNames: DayPickerProps["modifiersClassNames"];
};

function PickerCalendar({
  label,
  selected,
  onSelect,
  month,
  onMonthChange,
  modifiers,
  modifiersClassNames,
}: PickerCalendarProps) {
  return (
    <div className="space-y-2">
      <p className="px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <Calendar
        mode="single"
        selected={selected}
        onSelect={onSelect}
        month={month}
        onMonthChange={onMonthChange}
        captionLayout="dropdown"
        hideNavigation
        startMonth={calendarStartMonth}
        endMonth={calendarEndMonth}
        modifiers={modifiers}
        modifiersClassNames={modifiersClassNames}
        classNames={calendarDropdownClassNames}
      />
    </div>
  );
}

interface TransactionDateRangeFilterProps {
  dateFrom: string;
  dateTo: string;
  onChange: (range: { dateFrom: string; dateTo: string }) => void;
  className?: string;
  disabled?: boolean;
}

export default function TransactionDateRangeFilter({
  dateFrom,
  dateTo,
  onChange,
  className,
  disabled = false,
}: TransactionDateRangeFilterProps) {
  const [open, setOpen] = useState(false);
  const wasOpenRef = useRef(false);

  const fromDate = parseDateString(dateFrom);
  const toDate = parseDateString(dateTo);
  const activePreset = matchesPreset(dateFrom, dateTo);
  const inRangeDays = useMemo(
    () => getInRangeDays(fromDate, toDate),
    [fromDate, toDate],
  );

  const [openMonth, setOpenMonth] = useState(() =>
    startOfMonth(fromDate ?? toDate ?? today),
  );
  const [closeMonth, setCloseMonth] = useState(() =>
    startOfMonth(toDate ?? fromDate ?? today),
  );

  useEffect(() => {
    if (open && !wasOpenRef.current) {
      const { openMonth: nextOpenMonth, closeMonth: nextCloseMonth } =
        getCalendarMonths(fromDate, toDate);
      setOpenMonth(nextOpenMonth);
      setCloseMonth(nextCloseMonth);
    }

    wasOpenRef.current = open;
  }, [open, fromDate, toDate]);

  const displayText =
    fromDate && toDate
      ? `${format(fromDate, "MMM d")} – ${format(toDate, "MMM d, yyyy")}`
      : fromDate
        ? `${format(fromDate, "MMM d")} – …`
        : "Date range";

  const applyRange = (from?: Date, to?: Date) => {
    onChange({
      dateFrom: from ? toDateString(from) : "",
      dateTo: to ? toDateString(to) : "",
    });
  };

  const syncCalendarMonths = (from: Date, to: Date) => {
    const { openMonth: nextOpenMonth, closeMonth: nextCloseMonth } =
      getCalendarMonths(from, to);
    setOpenMonth(nextOpenMonth);
    setCloseMonth(nextCloseMonth);
  };

  const handlePresetSelect = (preset: DatePreset) => {
    const { from, to } = preset.getRange();
    applyRange(from, to);
    syncCalendarMonths(from, to);
  };

  const handleOpenDateSelect = (date?: Date) => {
    if (!date) return;

    if (toDate && date > toDate) {
      applyRange(date, date);
      syncCalendarMonths(date, date);
      return;
    }

    applyRange(date, toDate);
  };

  const handleCloseDateSelect = (date?: Date) => {
    if (!date) return;

    if (fromDate && date < fromDate) {
      applyRange(date, date);
      syncCalendarMonths(date, date);
      return;
    }

    applyRange(fromDate, date);
  };

  const handleClear = () => {
    applyRange(undefined, undefined);
    syncCalendarMonths(today, today);
    setOpen(false);
  };

  const openCalendarModifiers = {
    inRange: inRangeDays,
    closeDate: toDate ? [toDate] : [],
  };

  const closeCalendarModifiers = {
    inRange: inRangeDays,
    openDate: fromDate ? [fromDate] : [],
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled}
          className={cn(
            "justify-between text-left font-normal",
            !fromDate && !toDate && "text-muted-foreground",
            className,
          )}
        >
          <span className="flex min-w-0 items-center gap-1.5 truncate">
            <CalendarIcon className="h-3.5 w-3.5 shrink-0 opacity-50" />
            <span className="truncate">{displayText}</span>
          </span>
          <ChevronDownIcon className="ml-1 h-3.5 w-3.5 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex">
          <aside className="flex w-[148px] flex-col border-r p-2">
            {presets.map((preset) => (
              <Button
                key={preset.value}
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 justify-start px-2 text-sm font-normal",
                  activePreset === preset.value &&
                    "bg-accent font-medium text-accent-foreground",
                )}
                onClick={() => handlePresetSelect(preset)}
              >
                {preset.label}
              </Button>
            ))}
            <Button
              variant="ghost"
              size="sm"
              className="mt-1 h-8 justify-start px-2 text-sm font-normal text-muted-foreground"
              onClick={handleClear}
            >
              Clear
            </Button>
          </aside>

          <div className="flex flex-col gap-3 p-3 sm:flex-row">
            <PickerCalendar
              label="Opening date"
              selected={fromDate}
              onSelect={handleOpenDateSelect}
              month={openMonth}
              onMonthChange={setOpenMonth}
              modifiers={openCalendarModifiers}
              modifiersClassNames={{
                closeDate:
                  "bg-primary/20 text-foreground hover:bg-primary/30 font-normal opacity-80",
                inRange: "bg-primary/10 text-foreground rounded-none",
              }}
            />

            <PickerCalendar
              label="Closing date"
              selected={toDate}
              onSelect={handleCloseDateSelect}
              month={closeMonth}
              onMonthChange={setCloseMonth}
              modifiers={closeCalendarModifiers}
              modifiersClassNames={{
                openDate:
                  "bg-primary/20 text-foreground hover:bg-primary/30 font-normal opacity-80",
                inRange: "bg-primary/10 text-foreground rounded-none",
              }}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
