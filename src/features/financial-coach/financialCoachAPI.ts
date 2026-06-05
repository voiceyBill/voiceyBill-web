import { apiClient } from "@/app/api-client";
import {
  AnalyzeFinanceResponse,
  ExpenseItem,
  FinancialGoal,
} from "./financialCoachType";

export interface AnalyzeFinanceRequest {
  income: number;
  expenses: ExpenseItem[];
  goal: FinancialGoal;
}

export const financialCoachApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    analyzeFinance: builder.mutation<
      AnalyzeFinanceResponse,
      AnalyzeFinanceRequest
    >({
      query: (body) => ({
        url: "/financial-coach/analyze",
        method: "POST",
        body,
      }),
      invalidatesTags: ["analytics"],
    }),
  }),
});

export const { useAnalyzeFinanceMutation } = financialCoachApi;
