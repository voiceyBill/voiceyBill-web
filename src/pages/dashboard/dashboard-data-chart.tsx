import * as React from "react";
import { format } from "date-fns";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { EmptyState } from "@/components/empty-state";
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react";
import { DateRangeType } from "@/components/date-range-select";
import { Skeleton } from "@/components/ui/skeleton";
import { useChartAnalyticsQuery } from "@/features/analytics/analyticsAPI";
import { useFormatCurrency } from "@/hooks/use-format-currency";

interface PropsType {
  dateRange?: DateRangeType;
}

const COLORS = ["var(--brand-green)", "var(--color-destructive)"];

const chartConfig = {
  income: { label: "Income", color: COLORS[0] },
  expenses: { label: "Expenses", color: COLORS[1] },
} satisfies ChartConfig;

const DashboardDataChart: React.FC<PropsType> = ({ dateRange }) => {
  const isMobile = useIsMobile();
  const formatCurrency = useFormatCurrency();

  const { data, isFetching } = useChartAnalyticsQuery({ preset: dateRange?.value });
  const chartData = data?.data?.chartData || [];
  const totalExpenseCount = data?.data?.totalExpenseCount || 0;
  const totalIncomeCount = data?.data?.totalIncomeCount || 0;

  if (isFetching) return <ChartSkeleton />;

  return (
    <Card className="h-full flex flex-col border border-border bg-card rounded-2xl shadow-sm overflow-hidden !pt-0">
      {/* Header */}
      <CardHeader className="flex flex-col md:flex-row items-stretch !space-y-0 border-b border-border !p-0 shrink-0">
        <div className="flex flex-1 flex-col justify-center gap-1 px-5 py-4 min-w-0">
          <p className="text-[15px] font-bold text-foreground tracking-tight whitespace-nowrap">Transaction Overview</p>
          <p className="text-[12px] text-muted-foreground whitespace-nowrap">
            Showing total transactions {dateRange?.label || "for Past 30 Days"}
          </p>
        </div>

        <div className="flex shrink-0">
          {[
            { label: "No of Income", count: totalIncomeCount, isIncome: true },
            { label: "No of Expenses", count: totalExpenseCount, isIncome: false },
          ].map(({ label, count, isIncome }) => (
            <div
              key={label}
              className="flex flex-col justify-center gap-1 px-4 py-4 border-l border-border min-w-[110px]"
            >
              <span className="text-[11px] text-muted-foreground font-medium">{label}</span>
              <span className={`flex items-center gap-1.5 text-2xl font-bold metric-numeric ${isIncome ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500 dark:text-rose-400"}`}>
                {isIncome
                  ? <TrendingUpIcon className="size-4 shrink-0" />
                  : <TrendingDownIcon className="size-4 shrink-0" />}
                {count}
              </span>
            </div>
          ))}
        </div>
      </CardHeader>

      {/* Chart */}
      <CardContent className="flex-1 min-h-0 px-2 pt-4 sm:px-4">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <EmptyState title="No transaction data" description="There are no transactions recorded for this period." />
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-full min-h-[220px] w-full">
            <AreaChart data={chartData} margin={{ left: 10, right: 10, top: 10, bottom: 5 }}>
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS[0]} stopOpacity={0.1} />
                  <stop offset="95%" stopColor={COLORS[0]} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS[1]} stopOpacity={0.1} />
                  <stop offset="95%" stopColor={COLORS[1]} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="currentColor" strokeOpacity={0.04} strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                minTickGap={isMobile ? 25 : 30}
                fontSize={11}
                tick={{ fill: "var(--muted-foreground)" }}
                tickFormatter={(v) => format(new Date(v), isMobile ? "MMM d" : "MMM d, yyyy")}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={isMobile ? 48 : 58}
                fontSize={11}
                tick={{ fill: "var(--muted-foreground)" }}
                tickFormatter={(v) => formatCurrency(Number(v), { compact: true })}
              />
              <ChartTooltip
                cursor={{ stroke: "rgba(148,163,184,0.15)", strokeWidth: 1.5, strokeDasharray: "4 4" }}
                content={
                  <ChartTooltipContent
                    className="bg-card border border-border shadow-lg rounded-xl p-3"
                    labelFormatter={(v) => format(new Date(v), "MMMM d, yyyy")}
                    indicator="line"
                    formatter={(value, name) => {
                      const isExpense = name === "expenses";
                      return [
                        <span key={name} className="font-bold metric-numeric" style={{ color: isExpense ? COLORS[1] : COLORS[0] }}>
                          {formatCurrency(Number(value), {
                            showSign: true,
                            compact: false,
                            isExpense,
                          })}
                        </span>,
                        isExpense ? "Expenses" : "Income",
                      ];
                    }}
                  />
                }
              />
              <Area dataKey="income" type="monotone" fill="url(#incomeGradient)" stroke={COLORS[0]} strokeWidth={2} dot={false} activeDot={{ r: 4, strokeWidth: 0, fill: COLORS[0] }} />
              <Area dataKey="expenses" type="monotone" fill="url(#expensesGradient)" stroke={COLORS[1]} strokeWidth={2} dot={false} activeDot={{ r: 4, strokeWidth: 0, fill: COLORS[1] }} />
              <ChartLegend verticalAlign="bottom" content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

const ChartSkeleton = () => (
  <Card className="h-full flex flex-col border border-border bg-card rounded-2xl overflow-hidden !pt-0">
    <CardHeader className="flex flex-col md:flex-row items-stretch !space-y-0 border-b border-border !p-0 shrink-0">
      <div className="flex flex-1 flex-col justify-center gap-2 px-5 py-4">
        <Skeleton className="h-4 w-44" />
        <Skeleton className="h-3 w-56" />
      </div>
      <div className="flex">
        {[1, 2].map((i) => (
          <div key={i} className="flex flex-col justify-center gap-2 px-5 py-4 border-l border-border min-w-[120px]">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-7 w-12" />
          </div>
        ))}
      </div>
    </CardHeader>
    <CardContent className="flex-1 min-h-0 p-4">
      <Skeleton className="h-full w-full rounded-lg" />
    </CardContent>
  </Card>
);

export default DashboardDataChart;
