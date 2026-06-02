import { useState } from "react";
import { FileTextIcon, MicIcon, SlidersHorizontal, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { BudgetSummary } from "@/features/budget/budgetType";
import BudgetForm from "./budget-form";
import { cn } from "@/lib/utils";

interface SetBudgetDrawerProps {
  month: number;
  year: number;
  budget?: BudgetSummary;
}

type BudgetMode = "voice" | "manual";

const tabs = [
  { id: "voice" as BudgetMode, label: "Voice", icon: MicIcon },
  { id: "manual" as BudgetMode, label: "Manual", icon: FileTextIcon },
];

const SetBudgetDrawer = ({ month, year, budget }: SetBudgetDrawerProps) => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<BudgetMode>("voice");

  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    if (value) {
      setMode("voice");
    }
  };

  return (
    <Drawer direction="right" open={open} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>
        <Button>
          <SlidersHorizontal className="h-4 w-4" />
          {budget?.hasBudget ? "Update Budget" : "Set Budget"}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="flex h-full max-w-md flex-col overflow-hidden">
        <DrawerHeader className="relative flex-shrink-0">
          <div>
            <DrawerTitle className="text-xl font-semibold">
              {budget?.hasBudget ? "Update Budget" : "Set Budget"}
            </DrawerTitle>
            <DrawerDescription>
              Choose how you want to set your monthly budget.
            </DrawerDescription>
          </div>
          <DrawerClose className="absolute right-4 top-4">
            <XIcon className="h-5 w-5 !cursor-pointer" />
          </DrawerClose>
        </DrawerHeader>

        <div className="flex-shrink-0 px-2 pb-4 sm:px-4">
          <div className="flex space-x-1 rounded-lg bg-muted p-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setMode(tab.id)}
                  className={cn(
                    "flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-md px-2 py-2 text-xs font-medium transition-all sm:gap-2 sm:px-3 sm:text-sm",
                    mode === tab.id
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span className="hidden xs:inline sm:inline">
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="min-h-0 flex-1">
          <BudgetForm
            month={month}
            year={year}
            budget={budget}
            mode={mode}
            onCloseDrawer={() => setOpen(false)}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default SetBudgetDrawer;
