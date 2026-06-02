export interface BudgetSummaryParams {
  month: number;
  year: number;
}

export interface BudgetCategorySummary {
  name: string;
  limit: number;
  spent: number;
  remaining: number;
  usagePercentage: number;
  exceeded: boolean;
}

export interface BudgetAlert {
  message: string;
  type: "category" | "overall";
  category?: string;
}

export interface BudgetSummary {
  hasBudget: boolean;
  month: number;
  year: number;
  totalBudget: number;
  spent: number;
  remaining: number;
  usagePercentage: number;
  exceeded: boolean;
  categories: BudgetCategorySummary[];
  alerts: BudgetAlert[];
}

export interface BudgetSummaryResponse {
  message: string;
  data: BudgetSummary;
}

export interface UpsertBudgetPayload {
  month: number;
  year: number;
  totalBudget: number;
  categoryLimits: {
    category: string;
    limit: number;
  }[];
}
