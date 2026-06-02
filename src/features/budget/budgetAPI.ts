import { apiClient } from "@/app/api-client";
import {
  BudgetSummaryParams,
  BudgetSummaryResponse,
  UpsertBudgetPayload,
} from "./budgetType";

export const budgetApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    getBudgetSummary: builder.query<
      BudgetSummaryResponse,
      BudgetSummaryParams
    >({
      query: ({ month, year }) => ({
        url: "/budget/summary",
        method: "GET",
        params: { month, year },
      }),
      providesTags: ["budget"],
    }),

    upsertBudget: builder.mutation<BudgetSummaryResponse, UpsertBudgetPayload>({
      query: (payload) => ({
        url: "/budget",
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["budget"],
    }),

    deleteBudget: builder.mutation<
      { message: string; data: { success: boolean } },
      BudgetSummaryParams
    >({
      query: ({ month, year }) => ({
        url: "/budget",
        method: "DELETE",
        params: { month, year },
      }),
      invalidatesTags: ["budget"],
    }),
  }),
});

export const {
  useDeleteBudgetMutation,
  useGetBudgetSummaryQuery,
  useUpsertBudgetMutation,
} = budgetApi;
