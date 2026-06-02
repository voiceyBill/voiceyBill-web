import * as z from "zod";
import { useEffect, useMemo, useState } from "react";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import CurrencyInputField from "@/components/ui/currency-input";
import { CATEGORIES } from "@/constant";
import { useUpsertBudgetMutation } from "@/features/budget/budgetAPI";
import { BudgetSummary } from "@/features/budget/budgetType";
import { AIScanReceiptData } from "@/features/transaction/transationType";
import { getCategoryIcon } from "@/lib/category-icons";
import BudgetVoiceRecorder from "./budget-voice-recorder";

const budgetFormSchema = z
  .object({
    totalBudget: z.string().refine(
      (value) => !isNaN(Number(value)) && Number(value) > 0,
      {
        message: "Total budget must be greater than $0",
      }
    ),
    categories: z.record(
      z.string().refine(
        (value) => value === "" || (!isNaN(Number(value)) && Number(value) > 0),
        {
          message: "Category limit must be positive.",
        }
      )
    ),
  })
  .refine(
    (values) => {
      const validCategories = Object.values(values.categories).filter(
        (value) => !isNaN(Number(value)) && Number(value) > 0
      );
      return validCategories.length > 0;
    },
    {
      message: "At least one category limit is required.",
      path: ["categories"],
    }
  )
  .refine(
    (values) => {
      const totalBudget = Number(values.totalBudget);
      const categorySum = Object.values(values.categories)
        .filter((v) => !isNaN(Number(v)) && Number(v) > 0)
        .reduce((sum, v) => sum + Number(v), 0);
      return categorySum <= totalBudget;
    },
    {
      message: "Sum of category limits cannot exceed total budget.",
      path: ["categories"],
    }
  );

type BudgetFormValues = z.infer<typeof budgetFormSchema>;

interface BudgetFormProps {
  month: number;
  year: number;
  budget?: BudgetSummary;
  mode?: "voice" | "manual";
  onCloseDrawer?: () => void;
}

const BudgetForm = ({
  month,
  year,
  budget,
  mode = "manual",
  onCloseDrawer,
}: BudgetFormProps) => {
  const [upsertBudget, { isLoading }] = useUpsertBudgetMutation();
  const [isVoiceProcessing, setIsVoiceProcessing] = useState(false);

  const defaultCategoryValues = useMemo(() => {
    return CATEGORIES.reduce<Record<string, string>>((acc, category) => {
      const existingCategory = budget?.categories.find(
        (item) => item.name === category.value
      );
      acc[category.value] = existingCategory?.limit
        ? existingCategory.limit.toString()
        : "";
      return acc;
    }, {});
  }, [budget?.categories]);

  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      totalBudget: budget?.hasBudget ? budget.totalBudget.toString() : "",
      categories: defaultCategoryValues,
    },
  });

  useEffect(() => {
    form.reset({
      totalBudget: budget?.hasBudget ? budget.totalBudget.toString() : "",
      categories: defaultCategoryValues,
    });
  }, [budget, defaultCategoryValues, form]);

  const normalizeText = (value?: string) =>
    (value || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

  const findVoiceCategory = (data: AIScanReceiptData) => {
    const searchableText = normalizeText(
      [data.category, data.title, data.description, data.transcription]
        .filter(Boolean)
        .join(" ")
    );

    return CATEGORIES.find((category) => {
      const value = normalizeText(category.value);
      const label = normalizeText(category.label);
      return (
        searchableText === value ||
        searchableText === label ||
        searchableText.includes(value) ||
        searchableText.includes(label)
      );
    });
  };

  const handleVoiceComplete = (data: AIScanReceiptData) => {
    const amount = Number(data.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error("Voice did not include a valid budget amount.");
      return;
    }

    const amountValue = amount.toString();
    const matchedCategory = findVoiceCategory(data);
    const currentTotalBudget = Number(form.getValues("totalBudget"));
    const shouldSetTotalBudget =
      !matchedCategory ||
      !Number.isFinite(currentTotalBudget) ||
      currentTotalBudget <= 0 ||
      currentTotalBudget < amount;

    if (shouldSetTotalBudget) {
      form.setValue("totalBudget", amountValue, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }

    if (matchedCategory) {
      form.setValue(`categories.${matchedCategory.value}`, amountValue, {
        shouldDirty: true,
        shouldValidate: true,
      });
      toast.success(`${matchedCategory.label} budget filled from voice.`);
      return;
    }

    toast.success("Total budget filled from voice.");
  };

  const onSubmit = (values: BudgetFormValues) => {
    const totalBudget = Number(values.totalBudget);

    if ((budget?.spent || 0) > totalBudget) {
      toast.warning("Your spending has already exceeded the total budget.");
      return;
    }

    const categoryLimits = Object.entries(values.categories)
      .filter(([, limit]) => !isNaN(Number(limit)) && Number(limit) > 0)
      .map(([name, limit]) => ({
        category: name,
        limit: Number(limit),
      }));

    upsertBudget({
      month,
      year,
      totalBudget,
      categoryLimits,
    })
      .unwrap()
      .then((response) => {
        toast.success("Budget saved successfully");
        if (response.data.exceeded) {
          toast.warning("Your spending has already exceeded the total budget.");
        }
        onCloseDrawer?.();
      })
      .catch((error) => {
        toast.error(error?.data?.message || "Failed to save budget");
      });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex h-full min-h-0 flex-col"
      >
        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 pb-4">
          {mode === "voice" && (
            <BudgetVoiceRecorder
              loadingChange={isVoiceProcessing}
              onLoadingChange={setIsVoiceProcessing}
              onVoiceComplete={handleVoiceComplete}
            />
          )}

          <FormField
            control={form.control}
            name="totalBudget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Monthly Budget</FormLabel>
                <FormControl>
                  <CurrencyInputField
                    {...field}
                    disabled={isVoiceProcessing}
                    onValueChange={(value) => field.onChange(value || "")}
                    placeholder="$0.00"
                    prefix="$"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-medium text-foreground">
                Category Limits
              </h3>
              <p className="text-xs text-muted-foreground">
                Add limits for the categories you want to track.
              </p>
            </div>

            <div className="grid gap-3">
              {CATEGORIES.map((category) => {
                const Icon = getCategoryIcon(category.value);
                return (
                  <FormField
                    key={category.value}
                    control={form.control}
                    name={`categories.${category.value}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          {category.label}
                        </FormLabel>
                        <FormControl>
                          <CurrencyInputField
                            {...field}
                            disabled={isVoiceProcessing}
                            onValueChange={(value) =>
                              field.onChange(value || "")
                            }
                            placeholder="$0.00"
                            prefix="$"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                );
              })}
            </div>
            {form.formState.errors.categories?.message && (
              <p className="text-sm text-destructive">
                {String(form.formState.errors.categories.message)}
              </p>
            )}
          </div>
        </div>

        <div className="flex-shrink-0 border-t bg-background p-4">
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || isVoiceProcessing}
          >
            {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : null}
            Save Budget
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BudgetForm;
