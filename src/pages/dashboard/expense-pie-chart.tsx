import { Label, Pie, PieChart, Cell } from "recharts";
import {
  ShoppingBag, Utensils, Car, Zap, Film,
  Activity, Home, Coins, HelpCircle, LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { DateRangeType } from "@/components/date-range-select";
import { formatCurrency } from "@/lib/format-currency";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPercentage } from "@/lib/format-percentage";
import { EmptyState } from "@/components/empty-state";
import { useExpensePieChartBreakdownQuery } from "@/features/analytics/analyticsAPI";
import { useTypedSelector } from "@/app/hook";

const COLORS = [
  "#8b5cf6", "#ec4899", "#3b82f6", "#10b981",
  "#a855f7", "#f59e0b", "#ef4444", "#06b6d4", "#64748b",
];

const hexToRGBA = (hex: string, opacity: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const getCategoryIcon = (name: string): LucideIcon => {
  const n = name.toLowerCase();
  if (n.includes("food") || n.includes("dining")) return Utensils;
  if (n.includes("grocer") || n.includes("shopping")) return ShoppingBag;
  if (n.includes("car") || n.includes("travel") || n.includes("transport")) return Car;
  if (n.includes("bill") || n.includes("utilit")) return Zap;
  if (n.includes("show") || n.includes("movi") || n.includes("entert")) return Film;
  if (n.includes("rent") || n.includes("home")) return Home;
  if (n.includes("health") || n.includes("medic")) return Activity;
  if (n.includes("invest") || n.includes("bank")) return Coins;
  return HelpCircle;
};

const chartConfig = { amount: { label: "Amount" } } satisfies ChartConfig;

const ExpensePieChart = ({ dateRange }: { dateRange?: DateRangeType }) => {
  const { user } = useTypedSelector((state) => state.auth);
  const baseCurrency = user?.baseCurrency || "USD";
  const { data, isFetching } = useExpensePieChartBreakdownQuery({ preset: dateRange?.value });
  const categories = data?.data?.breakdown || [];
  const totalSpent = data?.data?.totalSpent || 0;

  if (isFetching) return <PieChartSkeleton />;

  return (
    <Card className="h-full flex flex-col border border-border bg-card rounded-2xl shadow-sm overflow-hidden !pt-0">
      <CardHeader className="border-b border-border px-5 py-4 shrink-0 !space-y-0">
        <p className="text-[15px] font-bold text-foreground tracking-tight">Expenses Breakdown</p>
        <p className="text-[12px] text-muted-foreground mt-1">
          Total expenses {dateRange?.label || "for Past 30 Days"}
        </p>
      </CardHeader>

      <CardContent className="flex-1 min-h-0 flex flex-col px-5 pt-4 pb-5">
        {categories.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <EmptyState title="No expenses found" description="There are no expenses recorded for this period." />
          </div>
        ) : (
          <>
            {/* Donut chart */}
            <ChartContainer config={chartConfig} className="mx-auto aspect-square w-full max-h-[180px]">
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent className="bg-card border border-border shadow-lg rounded-xl p-2.5" />}
                />
                <Pie
                  data={categories}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={58}
                  outerRadius={76}
                  paddingAngle={2}
                  strokeWidth={0}
                  stroke="transparent"
                >
                  {categories.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        const cx = viewBox.cx ?? 0;
                        const cy = viewBox.cy ?? 0;
                        return (
                          <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
                            <tspan x={cx} y={cy - 2} className="fill-foreground text-xl font-bold metric-numeric tracking-tight">
                              {formatCurrency(totalSpent, { compact: true, currency: baseCurrency })}
                            </tspan>
                            <tspan x={cx} y={cy + 16} className="fill-muted-foreground text-[11px] font-medium">
                              Total Spent
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>

            {/* Legend */}
            <div className="flex flex-col gap-2.5 mt-4 pt-4 border-t border-border">
              {categories.map((entry, i) => {
                const color = COLORS[i % COLORS.length];
                const Icon = getCategoryIcon(entry.name);
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div
                      className="h-7 w-7 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: hexToRGBA(color, 0.12) }}
                    >
                      <Icon className="size-3.5" style={{ color }} />
                    </div>
                    <span className="text-[13px] font-medium text-foreground capitalize flex-1 truncate">
                      {entry.name}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[13px] font-semibold text-foreground metric-numeric">
                        {formatCurrency(entry.value, { currency: baseCurrency })}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        ({formatPercentage(entry.percentage, { decimalPlaces: 0 })})
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

const PieChartSkeleton = () => (
  <Card className="h-full flex flex-col border border-border bg-card rounded-2xl overflow-hidden !pt-0">
    <CardHeader className="border-b border-border px-5 py-4 shrink-0 !space-y-0">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-3 w-28 mt-2" />
    </CardHeader>
    <CardContent className="flex-1 min-h-0 flex flex-col px-5 pt-4 pb-5">
      <div className="flex items-center justify-center py-4">
        <div className="relative w-[160px] h-[160px]">
          <Skeleton className="rounded-full w-full h-full" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
      </div>
      <div className="mt-4 space-y-3 border-t border-border pt-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-7 w-7 rounded-full" />
            <Skeleton className="h-3.5 flex-1" />
            <Skeleton className="h-3.5 w-20" />
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default ExpensePieChart;
