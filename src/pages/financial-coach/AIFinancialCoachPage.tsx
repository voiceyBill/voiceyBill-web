import React from "react";
import type { ExpenseItem, FinancialGoal } from "@/features/financial-coach";
import { ExpenseInput } from "@/components/financial-coach/ExpenseInput";
import { GoalForm } from "@/components/financial-coach/GoalForm";
import { ResultDisplay } from "@/components/financial-coach/ResultDisplay";
import { useFinancialCoach } from "@/features/financial-coach";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { AppAlert } from "@/components/app-alert";

const schema = z.object({
  income: z.number().min(1, "Income must be greater than 0"),
});

type FormData = z.infer<typeof schema>;

export const AIFinancialCoachPage: React.FC = () => {
  const { analyze, loading, error, data, reset } = useFinancialCoach();

  const [expenses, setExpenses] = React.useState<ExpenseItem[]>([]);
  const [goal, setGoal] = React.useState<FinancialGoal>({
    name: "",
    targetAmount: 0,
    durationMonths: 12,
  });

  const [alert, setAlert] = React.useState<{
    variant: "success" | "destructive";
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { income: 0 },
  });

  const onSubmit = async (formData: FormData) => {
    if (expenses.length === 0) {
      setAlert({
        variant: "destructive",
        message: "Please add at least one expense",
      });
      return;
    }

    if (!goal.name || !goal.targetAmount) {
      setAlert({
        variant: "destructive",
        message: "Please fill in your financial goal",
      });
      return;
    }

    try {
      await analyze(formData.income, expenses, goal);

      setAlert({
        variant: "success",
        message: "Analysis completed successfully",
      });
    } catch (err: unknown) {
         const message = err instanceof Error ? err.message : "Analysis failed";
        setAlert({
           variant: "destructive",
            message,
       });
    }
  };

  const handleReset = () => {
    setValue("income", 0);
    setExpenses([]);
    setGoal({
      name: "",
      targetAmount: 0,
      durationMonths: 12,
    });

    reset();

    setAlert({
      variant: "success",
      message: "Reset successful",
    });
  };

  const getErrorMessage = () => {
    if (!error) return "";

    if ("data" in error) {
      return (
        (error.data as { message?: string })?.message ||
        ("error" in error ? error.error : "Something went wrong")
      );
    }

    if ("message" in error) {
      return error.message || "Something went wrong";
    }

    return "Something went wrong";
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            💰 AI Financial Coach
          </h1>

          <p className="text-muted-foreground mt-2">
            Get AI-powered insights to improve your financial health
          </p>
        </div>

        {/* ALERT */}
        {alert && (
          <div className="mb-6">
            <AppAlert
              variant={alert.variant}
              title={alert.variant === "success" ? "Success" : "Error"}
              message={alert.message}
              onDismiss={() => setAlert(null)}
            />
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* INCOME */}
          <div className="p-4 bg-card border border-border rounded-lg">
            <label className="block text-sm font-medium text-foreground mb-2">
              Monthly Income
            </label>

            <input
              type="number"
              {...register("income", { valueAsNumber: true })}
              placeholder="Enter your monthly income"
              className="w-full px-4 py-3 rounded-md bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />

            {errors.income && (
              <p className="text-destructive text-sm mt-2">
                {errors.income.message}
              </p>
            )}
          </div>

          {/* EXPENSES */}
          <ExpenseInput expenses={expenses} onExpensesChange={setExpenses} />

          {/* GOAL */}
          <GoalForm goal={goal} onGoalChange={setGoal} />

          {/* BUTTONS */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg disabled:opacity-50 transition"
            >
              {loading ? "Analyzing..." : "Analyze"}
            </button>

            {(data || error) && (
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-3 bg-card border border-border text-foreground rounded-lg hover:bg-accent transition"
              >
                Reset
              </button>
            )}
          </div>
        </form>

        {/* API ERROR */}
        {error && (
          <div className="mt-6">
            <AppAlert
              variant="destructive"
              title="Analysis Error"
              message={getErrorMessage()}
            />
          </div>
        )}

        {/* RESULT */}
        {data && <ResultDisplay result={data} />}
      </div>
    </div>
  );
};

export default AIFinancialCoachPage;
