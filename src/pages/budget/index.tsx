import { useMemo, useState, useEffect } from "react";
import PageLayout from "@/components/page-layout";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, WalletCards } from "lucide-react";
import { CATEGORIES } from "@/constant";
import { useGetBudgetSummaryQuery } from "@/features/budget/budgetAPI";
import { useAppDispatch } from "@/app/hook";
import { addBudgetAlerts } from "@/features/notification/notificationSlice";
import { getCategoryIcon } from "@/lib/category-icons";
import DeleteBudgetButton from "./_component/delete-budget-button";
import SetBudgetDrawer from "./_component/set-budget-drawer";

const getCurrentMonthYear = () => {
  const now = new Date();
  return {
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  };
};

const getRemainingDaysInMonth = () => {
  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return lastDay.getDate() - now.getDate();
};


const getBudgetMonthOptions = () => {
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  });

  return Array.from({ length: 12 }).map((_, index) => {
    const now = new Date();
    const targetMonth = now.getMonth() - index;
    const month = ((targetMonth % 12) + 12) % 12 + 1;
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

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

const getCategoryLabel = (name: string) =>
  CATEGORIES.find((category) => category.value === name)?.label || name;

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
  const currentMonthYear = getCurrentMonthYear();
  const monthOptions = useMemo(() => getBudgetMonthOptions(), []);
  const [selectedMonthValue, setSelectedMonthValue] = useState(
    `${currentMonthYear.year}-${String(currentMonthYear.month).padStart(2, "0")}`
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

  const budget = data?.data ;

  // Add budget alerts to notification store
  useEffect(() => {
    if (budget?.hasBudget && budget.alerts.length > 0) {
      dispatch(
        addBudgetAlerts({
          alerts: budget.alerts,
          month: budget.month,
          year: budget.year,
        })
      );
    }
  }, [budget?.alerts, budget?.hasBudget, dispatch]);
  const summaryItems = [
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
 value: `${(budget?.usagePercentage || 0).toFixed(2)}%`,
  progress: budget?.usagePercentage || 0,
  tone: getBudgetTone(budget?.usagePercentage || 0),
},
  ];

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
            <section className="space-y-4">
              <h3 className="text-base font-semibold text-foreground">
                Category Budgets
              </h3>

              <div className="grid gap-4 lg:grid-cols-3 items-start">
                {[...budget.categories]
  .sort((a, b) => b.usagePercentage - a.usagePercentage)
  .map((category) => (
               <Card
  key={category.name}
className={`rounded-lg shadow-none h-full ${
  category.exceeded ? "border-red-200" : ""
}`}
>
  <CardContent className="px-5 space-y-3">

    {/* Header */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {(() => {
          const Icon = getCategoryIcon(category.name);
          return (
            <Icon className={`h-4 w-4 ${
              category.usagePercentage >= 100
                ? "text-red-500"
                : category.usagePercentage >= 75
                ? "text-yellow-500"
                : "text-green-600"
            }`} />
          );
        })()}
        <p className="text-sm font-semibold text-foreground">
          {getCategoryLabel(category.name)}
        </p>
      </div>
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

    {/* Amount */}
    <div>
      <p className="text-lg font-bold text-foreground">
        {formatCurrency(category.spent)}
      </p>
      <p className="text-xs text-muted-foreground">
        of {formatCurrency(category.limit)}
      </p>
    </div>

    {/* Progress Bar + Percentage same line */}
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <BudgetProgress
          value={category.usagePercentage}
          tone={getBudgetTone(category.usagePercentage)}
        />
      </div>
      <p className={`text-sm font-bold w-10 text-right ${
        category.usagePercentage >= 100
          ? "text-red-500"
          : category.usagePercentage >= 75
          ? "text-yellow-500"
          : "text-green-600"
      }`}>
        {Math.round(category.usagePercentage)}%
      </p>
    </div>

   <div className="flex justify-end text-xs text-muted-foreground border-t pt-2 mt-1">
  <span>
    {category.exceeded
      ? `${formatCurrency(category.spent - category.limit)} over limit`
      : `${formatCurrency(category.limit - category.spent)} remaining`
    }
  </span>
</div>

   

  </CardContent>
</Card>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </PageLayout>
  );
}
