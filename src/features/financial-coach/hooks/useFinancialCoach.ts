import { useState, useCallback } from "react";
import {
  AnalyzeFinanceResponse,
  ExpenseItem,
  FinancialGoal,
} from "../financialCoachType";
import { useAnalyzeFinanceMutation } from "../financialCoachAPI";

export const useFinancialCoach = () => {
  const [triggerAnalyze, { isLoading, error }] = useAnalyzeFinanceMutation();

  const [data, setData] = useState<AnalyzeFinanceResponse | null>(null);

  const analyze = useCallback(
    async (income: number, expenses: ExpenseItem[], goal: FinancialGoal) => {
      const result = await triggerAnalyze({
        income,
        expenses,
        goal,
      }).unwrap();

      setData(result);

      return result;
    },
    [triggerAnalyze],
  );

  const reset = useCallback(() => {
    setData(null);
  }, []);

  return {
    analyze,
    loading: isLoading,
    error,
    data,
    reset,
  };
};
