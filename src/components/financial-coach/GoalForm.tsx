import React from "react";
import { FinancialGoal } from "@/features/financial-coach";

interface GoalFormProps {
  goal: FinancialGoal;
  onGoalChange: (goal: FinancialGoal) => void;
}

export const GoalForm: React.FC<GoalFormProps> = ({ goal, onGoalChange }) => {
  const handleChange = (field: keyof FinancialGoal, value: string) => {
    let parsedValue: string | number = value;

    if (field === "targetAmount" || field === "durationMonths") {
      const num = Number(value);

      parsedValue = value === "" ? 0 : Number.isFinite(num) ? num : 0;
    }

    onGoalChange({
      ...goal,
      [field]: parsedValue,
    });
  };

  return (
    <div
      className="
        rounded-lg
        border
        border-border
        bg-card
        p-4
        space-y-4
      "
    >
      <h3 className="text-lg font-semibold text-foreground">Financial Goal</h3>

      {/* Goal Name */}
      <div>
        <label
          htmlFor="goal-name"
          className="
            mb-2
            block
            text-sm
            font-medium
            text-foreground
          "
        >
          Goal Name
        </label>

        <input
          id="goal-name"
          type="text"
          value={goal.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="e.g. Emergency Fund"
          maxLength={100}
          className="
            w-full
            rounded-md
            border
            border-input
            bg-background
            px-3
            py-2
            text-foreground
          "
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Target Amount */}
        <div>
          <label
            htmlFor="target-amount"
            className="
              mb-2
              block
              text-sm
              font-medium
              text-foreground
            "
          >
            Target Amount
          </label>

          <input
            id="target-amount"
            type="number"
            min="0"
            step="0.01"
            value={goal.targetAmount || ""}
            onChange={(e) => handleChange("targetAmount", e.target.value)}
            placeholder="10000"
            className="
              w-full
              rounded-md
              border
              border-input
              bg-background
              px-3
              py-2
              text-foreground
            "
          />
        </div>

        {/* Duration */}
        <div>
          <label
            htmlFor="duration-months"
            className="
              mb-2
              block
              text-sm
              font-medium
              text-foreground
            "
          >
            Duration (Months)
          </label>

          <input
            id="duration-months"
            type="number"
            min="1"
            max="120"
            value={goal.durationMonths || ""}
            onChange={(e) => handleChange("durationMonths", e.target.value)}
            placeholder="12"
            className="
              w-full
              rounded-md
              border
              border-input
              bg-background
              px-3
              py-2
              text-foreground
            "
          />
        </div>
      </div>
    </div>
  );
};
