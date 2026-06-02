import { useState } from "react";
import { Loader, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteBudgetMutation } from "@/features/budget/budgetAPI";
import { BudgetSummary } from "@/features/budget/budgetType";

interface DeleteBudgetButtonProps {
  month: number;
  year: number;
  budget?: BudgetSummary;
}

const DeleteBudgetButton = ({ month, year, budget }: DeleteBudgetButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteBudget, { isLoading }] = useDeleteBudgetMutation();

  if (!budget?.hasBudget) return null;

  const onDeleteBudget = () => {
    deleteBudget({ month, year })
      .unwrap()
      .then(() => {
        setIsOpen(false);
        toast.success("Budget deleted successfully");
      })
      .catch((error) => {
        toast.error(error?.data?.message || "Failed to delete budget");
      });
  };

  return (
    <>
      <Button
        type="button"
        variant="destructive"
        disabled={isLoading}
        onClick={() => setIsOpen(true)}
      >
        <Trash2 className="h-4 w-4" />
        Delete Budget
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete monthly budget?</DialogTitle>
            <DialogDescription>
              This will delete your budget and category limits for this month.
              Your transactions will not be deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isLoading}
              onClick={onDeleteBudget}
            >
              {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : null}
              Delete Budget
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeleteBudgetButton;
