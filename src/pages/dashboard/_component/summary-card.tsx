import { FC } from "react";
import CountUp from "react-countup";
import { TrendingDownIcon, TrendingUpIcon, LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format-currency";
import { formatPercentage } from "@/lib/format-percentage";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { DateRangeEnum, DateRangeType } from "@/components/date-range-select";
import { useTypedSelector } from "@/app/hook";

type CardType = "balance" | "income" | "expenses" | "savings";
type CardStatus = {
  label: string;
  colorClass: string;
  Icon: LucideIcon;
  description?: string;
};

const typeBar: Record<CardType, string> = {
  balance: "bg-primary",
  income: "bg-emerald-500",
  expenses: "bg-rose-500",
  savings: "bg-amber-500",
};

interface SummaryCardProps {
  title: string;
  value?: number;
  dateRange?: DateRangeType;
  percentageChange?: number;
  isPercentageValue?: boolean;
  isLoading?: boolean;
  expenseRatio?: number;
  cardType: CardType;
}

const getCardStatus = (value: number, cardType: CardType, expenseRatio?: number): CardStatus => {
  if (cardType === "savings") {
    if (value === 0) return { label: "No Savings Record", colorClass: "text-muted-foreground", Icon: TrendingDownIcon };
    if (value < 10) return { label: "Low Savings", colorClass: "text-rose-500 dark:text-rose-400", Icon: TrendingDownIcon, description: `${value.toFixed(1)}% saved` };
    if (value < 20) return { label: "Moderate", colorClass: "text-amber-500 dark:text-amber-400", Icon: TrendingDownIcon, description: `${expenseRatio?.toFixed(0)}% spent` };
    if (expenseRatio && expenseRatio > 75) return { label: "High Spend", colorClass: "text-rose-500 dark:text-rose-400", Icon: TrendingDownIcon, description: `${expenseRatio.toFixed(0)}% spent` };
    if (expenseRatio && expenseRatio > 60) return { label: "High Spend", colorClass: "text-amber-500 dark:text-amber-400", Icon: TrendingDownIcon, description: `${expenseRatio.toFixed(0)}% spent` };
    return { label: "Good Savings", colorClass: "text-emerald-500 dark:text-emerald-400", Icon: TrendingUpIcon };
  }

  if (value === 0) {
    const label = cardType === "income" ? "No Income" : cardType === "expenses" ? "No Expenses" : "No Balance";
    return { label, colorClass: "text-muted-foreground", Icon: TrendingDownIcon };
  }

  if (cardType === "balance" && value < 0)
    return { label: "Overdrawn", colorClass: "text-rose-500 dark:text-rose-400", Icon: TrendingDownIcon, description: "Balance is negative" };

  return { label: "", colorClass: "", Icon: TrendingDownIcon };
};

const getTrendDirection = (value: number, cardType: CardType) => {
  if (cardType === "expenses") return value <= 0 ? "positive" : "negative";
  return value >= 0 ? "positive" : "negative";
};

const SummaryCard: FC<SummaryCardProps> = ({
  title, value = 0, dateRange, percentageChange,
  isPercentageValue, isLoading, expenseRatio, cardType = "balance",
}) => {
  const { user } = useTypedSelector((state) => state.auth);
  const baseCurrency = user?.baseCurrency || "USD";
  const status = getCardStatus(value, cardType, expenseRatio);
  const showTrend = percentageChange !== undefined && percentageChange !== null && cardType !== "savings";
  const trendDirection = showTrend && percentageChange !== 0 ? getTrendDirection(percentageChange, cardType) : null;
  const isNegativeBalance = cardType === "balance" && value < 0;

  const formatCountupValue = (val: number) =>
    isPercentageValue
      ? formatPercentage(val, { decimalPlaces: 1 })
      : formatCurrency(val, {
          currency: baseCurrency,
          isExpense: cardType === "expenses",
          showSign: false,
        });

  if (isLoading) {
    return (
      <Card className="border border-border bg-card rounded-2xl gap-0 shadow-sm overflow-hidden">
        <div className={cn("h-[3px] w-full", typeBar[cardType])} />
        <CardHeader className="pb-4 pt-5 px-3 sm:px-5">
          <Skeleton className="h-3 w-24" />
        </CardHeader>
        <CardContent className="space-y-4 pb-5 px-3 sm:px-5">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden border border-border bg-card shadow-sm hover:shadow-md transition-all duration-200 rounded-2xl gap-0">
      {/* Colored top accent */}
      <div className={cn("absolute top-0 inset-x-0 h-[3px]", typeBar[cardType])} />

      <CardHeader className="pb-2 pt-4 sm:pt-5 px-3 sm:px-5">
        <CardTitle className="text-[10px] sm:text-[11px] text-muted-foreground font-bold uppercase tracking-wide">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2 pb-4 sm:pb-5 px-3 sm:px-5">
        {/* Main value */}
        <div className={cn(
          "text-xl sm:text-2xl md:text-[1.75rem] font-bold tracking-tight metric-numeric",
          isNegativeBalance ? "text-rose-500 dark:text-rose-400" : "text-foreground"
        )}>
          <CountUp
            start={0}
            end={value}
            preserveValue
            decimals={2}
            decimalPlaces={2}
            formattingFn={formatCountupValue}
          />
        </div>

        {/* Status row */}
        <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap min-h-[16px] text-[10.5px] sm:text-[11.5px]">
          {cardType === "savings" ? (
            <>
              <span className={cn("font-semibold", status.colorClass)}>{status.label}</span>
              {status.description && <span className="text-muted-foreground">· {status.description}</span>}
            </>
          ) : dateRange?.value === DateRangeEnum.ALL_TIME ? (
            <span className="text-muted-foreground font-medium">{dateRange?.label}</span>
          ) : value === 0 || status.label ? (
            <>
              <span className={cn("font-semibold", status.colorClass)}>{status.label}</span>
              {status.description
                ? <span className="text-muted-foreground">· {status.description}</span>
                : dateRange?.label && <span className="text-muted-foreground">· {dateRange.label}</span>
              }
            </>
          ) : showTrend ? (
            <>
              {percentageChange !== 0 ? (
                <span className={cn(
                  "inline-flex items-center gap-1 font-semibold",
                  trendDirection === "positive" ? "text-emerald-500 dark:text-emerald-400" : "text-rose-500 dark:text-rose-400"
                )}>
                  {trendDirection === "positive" ? <TrendingUpIcon className="size-3" /> : <TrendingDownIcon className="size-3" />}
                  {formatPercentage(percentageChange || 0, { showSign: true, isExpense: cardType === "expenses", decimalPlaces: 1 })}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 font-semibold text-muted-foreground">
                  <TrendingDownIcon className="size-3" />
                  {formatPercentage(0, { showSign: false, decimalPlaces: 1 })}
                </span>
              )}
              {dateRange?.label && <span className="text-muted-foreground">· {dateRange.label}</span>}
            </>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
