import React from "react";
import { AnalyzeFinanceResponse } from "@/features/financial-coach";

interface ResultDisplayProps {
  result: AnalyzeFinanceResponse;
}

const formatCurrency = (value: number, currency = "PKR") => {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency,
  }).format(value);
};

const formatLabel = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1);

const safeArray = <T,>(arr?: T[]) => arr ?? [];

const getStatusStyle = (status: string) => {
  switch (status) {
    case "ACHIEVABLE":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "ACHIEVABLE_WITH_REDUCTION":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "NOT_ACHIEVABLE":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    default:
      return "bg-muted text-foreground";
  }
};

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  return (
    <div className="space-y-6 mt-8">
      {/* STATUS */}
      <div
        className={`p-4 rounded-lg font-semibold text-center ${getStatusStyle(
          result.data.goalStatus,
        )}`}
      >
        {result.data.goalStatus === "ACHIEVABLE"
          ? "✓ Goal Achievable"
          : result.data.goalStatus === "ACHIEVABLE_WITH_REDUCTION"
            ? "~ Achievable with Adjustments"
            : "✕ Goal Not Achievable"}
      </div>

      {/* GOAL INFO  */}
      <div className="p-4 bg-card border border-border rounded-lg">
        <h3 className="font-semibold mb-2">🎯 Goal Summary</h3>
        <p>
          <b>Name:</b> {result.data.goal?.name}
        </p>
        <p>
          <b>Target:</b> {formatCurrency(result.data.goal?.targetAmount)}
        </p>
        <p>
          <b>Duration:</b> {result.data.goal?.durationMonths} months
        </p>
        <p>
          <b>Estimated Time:</b> {result?.data.estimatedMonthsToGoal.toFixed(1)}{" "}
          months
        </p>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-card border border-border rounded-lg">
          <p className="text-sm text-muted-foreground">Total Income</p>
          <p className="text-2xl font-bold">
            {formatCurrency(result.data.totalIncome)}
          </p>
        </div>

        <div className="p-4 bg-card border border-border rounded-lg">
          <p className="text-sm text-muted-foreground">Total Expenses</p>
          <p className="text-2xl font-bold text-destructive">
            {formatCurrency(result.data.totalExpenses)}
          </p>
        </div>

        <div className="p-4 bg-card border border-border rounded-lg">
          <p className="text-sm text-muted-foreground">Available Savings</p>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(result.data.availableSavings)}
          </p>
        </div>

        <div className="p-4 bg-card border border-border rounded-lg">
          <p className="text-sm text-muted-foreground">Required Savings</p>
          <p className="text-2xl font-bold text-primary">
            {formatCurrency(result.data.requiredSavings)}
          </p>
        </div>
      </div>

      {/* MONTHLY DIFFERENCE */}
      <div className="p-4 bg-muted rounded-lg border border-border">
        <p className="text-sm text-muted-foreground">Monthly Difference</p>

        <p className="text-3xl font-bold">
          {formatCurrency(result.data.monthlyDifference)}
        </p>

        <p className="text-xs text-muted-foreground mt-2">
          {result.data.monthlyDifference >= 0
            ? "You have surplus after meeting the goal"
            : "You need to reduce expenses to meet the goal"}
        </p>
      </div>

      {/* OPTIMIZATION  */}
      {result.data.optimization && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">💡 Expense Optimization</h3>

          {/* Essential */}
          <div className="p-4 bg-card border border-border rounded-lg">
            <h4 className="font-semibold mb-2">Essential Expenses</h4>

            {safeArray(result.data.optimization.essential).map((exp, idx) => (
              <div key={`${exp.category}-${idx}`} className="mb-2">
                <p className="font-medium">{formatLabel(exp.category)}</p>
                <p className="text-xs text-muted-foreground">{exp.rationale}</p>
              </div>
            ))}
          </div>

          {/* Non-essential */}
          <div className="p-4 bg-card border border-border rounded-lg">
            <h4 className="font-semibold mb-2">Non-Essential Expenses</h4>

            {safeArray(result.data.optimization.nonEssential).map(
              (exp, idx) => (
                <div key={`${exp.category}-${idx}`} className="mb-2">
                  <p className="font-medium">{formatLabel(exp.category)}</p>
                  <p className="text-xs text-muted-foreground">
                    {exp.rationale}
                  </p>
                </div>
              ),
            )}
          </div>

          {/* Recommendations */}
          {safeArray(result.data.optimization.recommendations).length > 0 && (
            <div className="p-4 bg-card border border-border rounded-lg">
              <h4 className="font-semibold mb-2">Recommendations</h4>

              <ul className="space-y-1">
                {result.data.optimization.recommendations.map((rec, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground">
                    • {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* AI RECOMMENDATION  */}
      {result.data.aiRecommendation && (
        <div className="p-4 bg-accent rounded-lg border border-border">
          <h4 className="font-semibold mb-2">🤖 AI Coach Insight</h4>
          <p className="text-sm">{result.data.aiRecommendation}</p>
        </div>
      )}

      {/* EXTRA INSIGHTS  */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-card border border-border rounded-lg">
          <p className="text-sm text-muted-foreground">Optimized Savings</p>
          <p className="text-xl font-bold text-green-600">
            {formatCurrency(result.data.optimizedSavings)}
          </p>
        </div>

        <div className="p-4 bg-card border border-border rounded-lg">
          <p className="text-sm text-muted-foreground">
            Extra Savings Potential
          </p>
          <p className="text-xl font-bold text-primary">
            {formatCurrency(result.data.additionalSavingsPotential)}
          </p>
        </div>
      </div>

      {/* PARTIAL ERROR */}
      {result.data.status === "partial_success" && (
        <div className="p-4 bg-yellow-100 text-yellow-800 rounded-lg">
          ⚠ AI recommendations temporarily unavailable.
        </div>
      )}
    </div>
  );
};
