export interface ExpenseItem {
  category: string;
  amount: number;
  description?: string;
}

export interface FinancialGoal {
  name: string;
  targetAmount: number;
  durationMonths: number;
}

export interface ClassifiedExpense {
  category: string;
  amount: number;
  rationale: string;
}

export interface ExpenseOptimization {
  essential: ClassifiedExpense[];
  nonEssential: ClassifiedExpense[];
  recommendations: string[];
  optimizationPotential: {
    conservative: number;
    moderate: number;
    aggressive: number;
  };
}

export interface AnalyzeFinanceResponse {
  data: {
    status: "success" | "partial_success" | "error";
    goalStatus: "ACHIEVABLE" | "ACHIEVABLE_WITH_REDUCTION" | "NOT_ACHIEVABLE";

    totalIncome: number;
    totalExpenses: number;
    availableSavings: number;
    requiredSavings: number;
    monthlyDifference: number;

    goal: {
      name: string;
      targetAmount: number;
      durationMonths: number;
    };

    estimatedMonthsToGoal: number;

    optimization: ExpenseOptimization | null;

    aiRecommendation: string | null;

    additionalSavingsPotential: number;
    optimizedSavings: number;
  };
}

export const EXPENSE_CATEGORIES = [
  "groceries",
  "dining",
  "transportation",
  "utilities",
  "entertainment",
  "shopping",
  "healthcare",
  "travel",
  "housing",
  "investments",
  "other",
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];
