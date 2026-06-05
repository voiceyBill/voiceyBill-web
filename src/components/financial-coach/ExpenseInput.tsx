import React from "react";
import { ExpenseItem, EXPENSE_CATEGORIES } from "@/features/financial-coach";

interface ExpenseInputProps {
  expenses: ExpenseItem[];
  onExpensesChange: (expenses: ExpenseItem[]) => void;
}

export const ExpenseInput: React.FC<ExpenseInputProps> = ({
  expenses,
  onExpensesChange,
}) => {
  const handleAddExpense = () => {
    onExpensesChange([
      ...expenses,
      {
        category: "groceries",
        amount: 0,
        description: "",
      },
    ]);
  };

  const handleUpdateExpense = (
    index: number,
    field: keyof ExpenseItem,
    value: string,
  ) => {
    const updated = [...expenses];

    if (field === "amount") {
      const amount = Number(value);

      updated[index] = {
        ...updated[index],
        amount: value === "" ? 0 : Number.isFinite(amount) ? amount : 0,
      };
    } else {
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
    }

    onExpensesChange(updated);
  };

  const handleRemoveExpense = (index: number) => {
    // Keep at least one expense row
    if (expenses.length <= 1) return;

    onExpensesChange(expenses.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          Monthly Expenses
        </h3>

        <button
          type="button"
          onClick={handleAddExpense}
          className="
            rounded-md
            bg-primary
            px-3
            py-2
            text-sm
            font-medium
            text-primary-foreground
            transition-opacity
            hover:opacity-90
          "
        >
          + Add Expense
        </button>
      </div>

      {/* Expense List */}
      <div className="space-y-3">
        {expenses.map((expense, index) => (
          <div
            key={`${expense.category}-${index}`}
            className="
              flex
              flex-wrap
              gap-3
              rounded-lg
              border
              border-border
              bg-card
              p-3
            "
          >
            {/* Category */}
            <select
              aria-label="Expense category"
              value={expense.category}
              onChange={(e) =>
                handleUpdateExpense(index, "category", e.target.value)
              }
              className="
                min-w-[180px]
                flex-1
                rounded-md
                border
                border-input
                bg-background
                px-3
                py-2
                text-sm
                text-foreground
              "
            >
              {EXPENSE_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>

            {/* Amount */}
            <input
              aria-label="Expense amount"
              type="number"
              min="0"
              step="0.01"
              placeholder="Amount"
              value={expense.amount || ""}
              onChange={(e) =>
                handleUpdateExpense(index, "amount", e.target.value)
              }
              className="
                w-32
                rounded-md
                border
                border-input
                bg-background
                px-3
                py-2
                text-sm
                text-foreground
              "
            />

            {/* Description */}
            <input
              aria-label="Expense description"
              type="text"
              placeholder="Description (optional)"
              value={expense.description || ""}
              onChange={(e) =>
                handleUpdateExpense(index, "description", e.target.value)
              }
              className="
                min-w-[220px]
                flex-1
                rounded-md
                border
                border-input
                bg-background
                px-3
                py-2
                text-sm
                text-foreground
              "
            />

            {/* Delete */}
            <button
              type="button"
              onClick={() => handleRemoveExpense(index)}
              disabled={expenses.length <= 1}
              className="
                rounded-md
                border
                border-destructive
                px-3
                py-2
                text-sm
                font-medium
                text-destructive
                transition-opacity
                hover:opacity-80
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {expenses.length === 0 && (
        <div
          className="
            rounded-lg
            border
            border-border
            bg-muted
            p-4
            text-center
            text-muted-foreground
          "
        >
          No expenses added yet. Click "Add Expense" to get started.
        </div>
      )}
    </div>
  );
};
