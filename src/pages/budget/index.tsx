import { useMemo, useState, useEffect, useCallback } from "react";
import PageLayout from "@/components/page-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Cell, Label, Pie, PieChart } from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AlertTriangle, WalletCards } from "lucide-react";
import { CATEGORIES } from "@/constant";
import { useGetBudgetSummaryQuery } from "@/features/budget/budgetAPI";
import type { BudgetCategorySummary } from "@/features/budget/budgetType";
import { useAppDispatch, useTypedSelector } from "@/app/hook";
import { useGetSupportedCurrenciesQuery } from "@/features/currency/currencyAPI";
import { addBudgetAlerts } from "@/features/notification/notificationSlice";
import { getCategoryIcon } from "@/lib/category-icons";
import DeleteBudgetButton from "./_component/delete-budget-button";
import SetBudgetDrawer from "./_component/set-budget-drawer";
import { formatPercentage } from "@/lib/format-percentage";

const getCurrentMonthYear = () => {
  const now = new Date();
  return {
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  };
};

// const getRemainingDaysInMonth = () => {
//   const now = new Date();
//   const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
//   return lastDay.getDate() - now.getDate();
// };

const getBudgetMonthOptions = () => {
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  });

  return Array.from({ length: 12 }).map((_, index) => {
    const now = new Date();
    const targetMonth = now.getMonth() - index;
    const month = (((targetMonth % 12) + 12) % 12) + 1;
    const year = now.getFullYear() + Math.floor((now.getMonth() - index) / 12);

    const date = new Date(year, month - 1, 1);
    const label = formatter.format(date);

    return {
      label: index === 0 ? `${label} (Current Month)` : label,
      value: `${year}-${String(month).padStart(2, "0")}`,
      month,
      year,
    };
  });
};

const getCategoryLabel = (name: string) =>
  CATEGORIES.find((category) => category.value === name)?.label || name;

const BUDGET_CATEGORY_COLORS = [
  "#166114",
  "#2563eb",
  "#d97706",
  "#dc2626",
  "#7c3aed",
  "#0891b2",
  "#0f766e",
  "#be123c",
  "#4d7c0f",
  "#9333ea",
  "#b45309",
  "#475569",
];

const chartConfig = {
  spent: { label: "Spent" },
} satisfies ChartConfig;

function BudgetProgress({
  value,
  tone = "safe",
}: {
  value: number;
  tone?: "safe" | "warning" | "critical";
}) {
  const toneClassName = {
    safe: "bg-green-600",
    warning: "bg-yellow-500",
    critical: "bg-red-500",
  }[tone];

  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
      <div
        className={`h-full rounded-full ${toneClassName}`}
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  );
}

type BudgetTone = "safe" | "warning" | "critical";

const getBudgetTone = (percentage: number): BudgetTone => {
  if (percentage >= 100) return "critical";
  if (percentage >= 75) return "warning";
  return "safe";
};

function BudgetCategoryDistribution({
  categories,
  totalSpent,
  formatCurrency,
}: {
  categories: BudgetCategorySummary[];
  totalSpent: number;
  formatCurrency: (amount: number) => string;
}) {
  const categoryData = useMemo(
    () =>
      categories.map((category, index) => ({
        ...category,
        label: getCategoryLabel(category.name),
        fill: BUDGET_CATEGORY_COLORS[index % BUDGET_CATEGORY_COLORS.length],
        sharePercentage:
          totalSpent > 0
            ? Number(((category.spent / totalSpent) * 100).toFixed(1))
            : 0,
      })),
    [categories, totalSpent],
  );

  const chartData = categoryData.filter((category) => category.spent > 0);

  return (
    <Card className="overflow-hidden rounded-lg py-0 mb-4 shadow-none">
      <CardContent className="p-0">
        <div className="border-b border-border px-5 py-4">
          <h3 className="text-base font-semibold text-foreground">
            Category Budgets
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Track category distribution, limits, and usage.
          </p>
        </div>

        {chartData.length === 0 ? (
          <div className="flex min-h-[260px] flex-col items-center justify-center px-6 py-10 text-center">
            <div className="mb-4 rounded-full bg-muted p-4">
              <WalletCards className="h-8 w-8 text-muted-foreground" />
            </div>
            <h4 className="text-sm font-semibold text-foreground">
              No category spending yet
            </h4>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Category distribution will appear when expenses are recorded.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 p-5 lg:grid-cols-[minmax(300px,0.95fr)_minmax(360px,1.25fr)]">
            <div className="min-w-0">
              <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square h-[280px] max-h-[280px] w-full"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        className="rounded-xl border border-border bg-card p-2.5 shadow-lg"
                        hideLabel
                        formatter={(_, __, item) => {
                          const payload =
                            item.payload as (typeof categoryData)[number];

                          return (
                            <div className="grid gap-1">
                              <div className="flex items-center gap-2 font-semibold text-foreground">
                                <span
                                  className="h-2.5 w-2.5 rounded-full"
                                  style={{ backgroundColor: payload.fill }}
                                />
                                {payload.label}
                              </div>
                              <div className="text-muted-foreground">
                                {formatCurrency(payload.spent)} /{" "}
                                {formatCurrency(payload.limit)}
                              </div>
                              <div
                                className={
                                  payload.exceeded
                                    ? "font-medium text-red-600"
                                    : "text-muted-foreground"
                                }
                              >
                                {Math.round(payload.usagePercentage)}% usage,{" "}
                                {payload.sharePercentage}% of spending
                              </div>
                            </div>
                          );
                        }}
                      />
                    }
                  />
                  <Pie
                    data={chartData}
                    dataKey="spent"
                    nameKey="label"
                    innerRadius={72}
                    outerRadius={98}
                    paddingAngle={2}
                    stroke="transparent"
                    strokeWidth={0}
                  >
                    {chartData.map((category) => (
                      <Cell key={category.name} fill={category.fill} />
                    ))}
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          const cx = viewBox.cx ?? 0;
                          const cy = viewBox.cy ?? 0;

                          return (
                            <text
                              x={cx}
                              y={cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              <tspan
                                x={cx}
                                y={cy - 4}
                                className="fill-foreground text-2xl font-bold"
                              >
                                {formatCurrency(totalSpent)}
                              </tspan>
                              <tspan
                                x={cx}
                                y={cy + 18}
                                className="fill-muted-foreground text-xs font-medium"
                              >
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

              <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
                {chartData.map((category) => (
                  <div
                    key={category.name}
                    className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs"
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: category.fill }}
                    />
                    <span className="max-w-[150px] truncate font-medium text-foreground">
                      {category.label}
                    </span>
                    <span className="font-semibold text-muted-foreground">
                      {category.sharePercentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="max-h-[460px] space-y-3 overflow-y-auto pr-1">
              {categoryData.map((category) => {
                const Icon = getCategoryIcon(category.name);

                return (
                  <div
                    key={category.name}
                    className={
                      category.exceeded
                        ? "overflow-hidden rounded-lg border border-red-200 bg-red-50 dark:border-red-500/40 dark:bg-red-500/10"
                        : "overflow-hidden rounded-lg border border-border bg-background"
                    }
                  >
                    <div className="flex items-center gap-3 p-4">
                      <div
                        className="h-15 w-1 shrink-0 rounded-full"
                        style={{ backgroundColor: category.fill }}
                      />
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                        style={{ backgroundColor: `${category.fill}1F` }}
                      >
                        <Icon
                          className="h-5 w-5"
                          style={{ color: category.fill }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between ">
                          <p className="truncate text-sm font-semibold text-foreground">
                            {category.label}
                          </p>
                          {category.usagePercentage >= 100 ? (
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                              Over budget
                            </span>
                          ) : category.usagePercentage >= 75 ? (
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
                              Near limit
                            </span>
                          ) : (
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                              On track
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          <span className="font-bold text-foreground text-base">
                            {formatCurrency(category.spent)}
                          </span>{" "}
                          of {formatCurrency(category.limit)}
                        </p>
                        <div className="mt-3">
                          <BudgetProgress
                            value={category.usagePercentage}
                            tone={getBudgetTone(category.usagePercentage)}
                          />
                          <p className="mt-1 text-xs text-muted-foreground text-right">
                            {category.exceeded
                              ? `${formatCurrency(category.spent - category.limit)} over limit`
                              : `${formatCurrency(category.limit - category.spent)} remaining`}
                          </p>
                        </div>
                      </div>
                      <div className="shrink-0 text-right space-y-1">
                        <p
                          className={`text-sm font-bold ${
                            category.usagePercentage >= 100
                              ? "text-red-600"
                              : category.usagePercentage >= 75
                                ? "text-yellow-500"
                                : "text-green-600"
                          }`}
                        >
                          {Math.round(category.usagePercentage)}%
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function BudgetPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="gap-4 rounded-lg py-4 shadow-none">
            <CardContent className="space-y-3 px-5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-28" />
              <Skeleton className="h-2 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Skeleton className="h-56 w-full" />
    </div>
  );
}

export default function Budget() {
  const dispatch = useAppDispatch();
  const { user } = useTypedSelector((state) => state.auth);
  const { data: currencyData } = useGetSupportedCurrenciesQuery();
  const baseCurrency = user?.baseCurrency || "USD";
  const currencySymbol = currencyData?.currencies?.find(
    (c) => c.code === baseCurrency
  )?.symbol ?? "$";
  const currentMonthYear = getCurrentMonthYear();
  const monthOptions = useMemo(() => getBudgetMonthOptions(), []);
  const [selectedMonthValue, setSelectedMonthValue] = useState(
    `${currentMonthYear.year}-${String(currentMonthYear.month).padStart(2, "0")}`,
  );

  const selectedMonth =
    monthOptions.find((option) => option.value === selectedMonthValue) ||
    monthOptions[0];

  const { month, year } = selectedMonth;
  const isCurrentMonth =
    month === currentMonthYear.month && year === currentMonthYear.year;
  const { data, isError, isLoading } = useGetBudgetSummaryQuery({
    month,
    year,
  });

  const budget = data?.data;

  // Add budget alerts to notification store
  useEffect(() => {
    if (budget?.hasBudget && budget.alerts.length > 0) {
      dispatch(
        addBudgetAlerts({
          alerts: budget.alerts,
          month: budget.month,
          year: budget.year,
        }),
      );
    }
  }, [budget?.alerts, budget?.hasBudget, dispatch]);


  const formatCurrency = useCallback(
    (amount: number) =>
      `${currencySymbol}${new Intl.NumberFormat("en-US").format(amount)}`,
    [currencySymbol]
  );

  const summaryItems = useMemo(
    () => [
      {
        label: "Total Budget",
        value: formatCurrency(budget?.totalBudget || 0),
        progress: budget?.hasBudget ? 100 : 0,
        tone: "safe" as const,
      },
      {
        label: "Spent",
        value: formatCurrency(budget?.spent || 0),
        progress: budget?.usagePercentage || 0,
        tone: getBudgetTone(budget?.usagePercentage || 0),
      },
      {
        label: "Remaining",
        value: formatCurrency(budget?.remaining || 0),
        progress: budget?.hasBudget ? Math.max(100 - budget.usagePercentage, 0) : 0,
        tone: getBudgetTone(budget?.usagePercentage || 0),
      },
      {
        label: "Usage",
        value: formatPercentage(budget?.usagePercentage || 0, {
          decimalPlaces: 1,
        }),
        progress: budget?.usagePercentage || 0,
        tone: getBudgetTone(budget?.usagePercentage || 0),
      },
    ],
    [budget?.totalBudget, budget?.spent, budget?.remaining, budget?.usagePercentage, budget?.hasBudget, formatCurrency]
  );

  return (
    <PageLayout
      title="Budget"
      subtitle="Manage your monthly spending limits and stay on track"
      addMarginTop
      rightAction={
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={selectedMonthValue}
            onValueChange={setSelectedMonthValue}
          >
            <SelectTrigger className="w-full bg-white text-foreground sm:w-64">
              <SelectValue placeholder="Select budget month" />
            </SelectTrigger>
            <SelectContent>
              {monthOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {isCurrentMonth && (
            <>
              <SetBudgetDrawer month={month} year={year} budget={budget} />
              <DeleteBudgetButton month={month} year={year} budget={budget} />
            </>
          )}
        </div>
      }
    >
      {isLoading && <BudgetPageSkeleton />}

      {isError && (
        <Card className="rounded-lg shadow-none">
          <CardContent className="flex min-h-[260px] flex-col items-center justify-center px-6 text-center">
            <AlertTriangle className="mb-4 h-10 w-10 text-red-500" />
            <h3 className="text-base font-semibold text-foreground">
              Unable to load budget
            </h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Please try again after checking your connection.
            </p>
          </CardContent>
        </Card>
      )}

      {!isLoading && !isError && budget && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {summaryItems.map((item) => (
              <Card
                key={item.label}
                className="gap-4 rounded-lg py-4 shadow-none"
              >
                <CardContent className="space-y-3 px-5">
                  <p className="text-sm font-medium text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="text-2xl font-semibold text-foreground">
                    {item.value}
                  </p>
                  <BudgetProgress value={item.progress} tone={item.tone} />
                </CardContent>
              </Card>
            ))}
          </div>

          {!budget.hasBudget && (
            <Card className="rounded-lg shadow-none">
              <CardContent className="flex min-h-[260px] flex-col items-center justify-center px-6 text-center">
                <div className="mb-5 rounded-full bg-muted p-4">
                  <WalletCards className="h-9 w-9 text-muted-foreground" />
                </div>
                <h3 className="text-base font-semibold text-foreground">
                  No monthly budget set
                </h3>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  {isCurrentMonth
                    ? "Create a monthly budget and category limits to track spending."
                    : "No budget was set for this month."}
                </p>
                {isCurrentMonth && (
                  <div className="mt-5">
                    <SetBudgetDrawer
                      month={month}
                      year={year}
                      budget={budget}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {budget.hasBudget && (
            <BudgetCategoryDistribution
              categories={budget.categories}
              totalSpent={budget.spent}
              formatCurrency={formatCurrency}
            />
          )}
        </div>
      )}
    </PageLayout>
  );
}
