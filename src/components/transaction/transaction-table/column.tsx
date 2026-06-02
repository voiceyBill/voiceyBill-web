import {
  ArrowUpDown,
  CircleDot,
  Copy,
  Loader,
  LucideIcon,
  MoreHorizontal,
  Pencil,
  RefreshCw,
  Trash2,
  Utensils,
  ShoppingBag,
  Zap,
  Car,
  HeartPulse,
  Tag,
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef, Row } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { formatCurrency } from "@/lib/format-currency";
import useEditTransactionDrawer from "@/hooks/use-edit-transaction-drawer";
import { TransactionType } from "@/features/transaction/transationType";
import { _TRANSACTION_FREQUENCY, _TRANSACTION_TYPE } from "@/constant";
import {
  useDeleteTransactionMutation,
  useDuplicateTransactionMutation,
} from "@/features/transaction/transactionAPI";
import { toast } from "sonner";

type FrequencyInfo = {
  label: string;
  icon: LucideIcon;
};
type FrequencyMapType = {
  [key: string]: FrequencyInfo;
  DEFAULT: FrequencyInfo;
};

// Helper for category branding (Revolut/Wise style)
const getCategoryConfig = (cat: string) => {
  const lower = cat.toLowerCase();
  if (lower.includes("food") || lower.includes("dining")) {
    return {
      icon: Utensils,
      colorClass:
        "bg-violet-50 text-violet-750 dark:bg-violet-950/20 dark:text-violet-400 border-violet-100/60 dark:border-violet-900/20",
      iconContainer:
        "bg-violet-100/80 dark:bg-violet-900/40 text-violet-600 dark:text-violet-300",
    };
  }
  if (lower.includes("shopping") || lower.includes("retail")) {
    return {
      icon: ShoppingBag,
      colorClass:
        "bg-amber-50 text-amber-750 dark:bg-amber-950/20 dark:text-amber-400 border-amber-100/60 dark:border-amber-900/20",
      iconContainer:
        "bg-amber-100/80 dark:bg-amber-900/40 text-amber-600 dark:text-amber-300",
    };
  }
  if (
    lower.includes("bill") ||
    lower.includes("utilities") ||
    lower.includes("rent")
  ) {
    return {
      icon: Zap,
      colorClass:
        "bg-emerald-50 text-emerald-750 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-100/60 dark:border-emerald-900/20",
      iconContainer:
        "bg-emerald-100/80 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300",
    };
  }
  if (
    lower.includes("travel") ||
    lower.includes("transport") ||
    lower.includes("car")
  ) {
    return {
      icon: Car,
      colorClass:
        "bg-blue-50 text-blue-750 dark:bg-blue-950/20 dark:text-blue-400 border-blue-100/60 dark:border-blue-900/20",
      iconContainer:
        "bg-blue-100/80 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300",
    };
  }
  if (lower.includes("health") || lower.includes("medical")) {
    return {
      icon: HeartPulse,
      colorClass:
        "bg-rose-50 text-rose-750 dark:bg-rose-950/20 dark:text-rose-400 border-rose-100/60 dark:border-rose-900/20",
      iconContainer:
        "bg-rose-100/80 dark:bg-rose-900/40 text-rose-600 dark:text-rose-300",
    };
  }
  return {
    icon: Tag,
    colorClass:
      "bg-zinc-50 text-zinc-700 dark:bg-zinc-800/40 dark:text-zinc-350 border-zinc-150/80 dark:border-zinc-800/30",
    iconContainer:
      "bg-zinc-100/80 dark:bg-zinc-700/40 text-zinc-500 dark:text-zinc-400",
  };
};

const SortHeader = ({
  label,
  column,
}: {
  label: string;
  column: import("@tanstack/react-table").Column<TransactionType>;
}) => (
  <button
    className="flex items-center gap-1 text-left font-bold uppercase tracking-wider hover:text-foreground transition-colors"
    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  >
    {label}
    <ArrowUpDown className="h-3 w-3 opacity-50 shrink-0" />
  </button>
);

export const transactionColumns: ColumnDef<TransactionType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        className="!border-[var(--surface-border)] data-[state=checked]:!bg-foreground !text-background"
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className="!border-[var(--surface-border)] data-[state=checked]:!bg-foreground !text-background"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <SortHeader label="Date Created" column={column} />,
    cell: ({ row }) => format(row.getValue("createdAt"), "MMM dd, yyyy"),
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "category",
    header: ({ column }) => <SortHeader label="Category" column={column} />,
    cell: ({ row }) => {
      const category = row.original.category || "General";
      const config = getCategoryConfig(category);
      const Icon = config.icon;
      return (
        <span
          className={`inline-flex items-center gap-1.5 pl-1.5 pr-2.5 py-0.5 rounded-full text-[12px] font-medium border ${config.colorClass} capitalize`}
        >
          <span
            className={`flex items-center justify-center h-4.5 w-4.5 rounded-full ${config.iconContainer}`}
          >
            <Icon className="h-2.5 w-2.5" />
          </span>
          {category}
        </span>
      );
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => <SortHeader label="Type" column={column} />,
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      const isIncome = type === _TRANSACTION_TYPE.INCOME;
      return (
        <div className="capitalize">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
              isIncome
                ? "bg-emerald-500/8 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/10 dark:text-brand-green-light dark:border-brand-green-light/20"
                : "bg-zinc-500/8 text-muted-foreground border-zinc-500/20 dark:bg-zinc-500/10 dark:text-zinc-400 dark:border-zinc-500/15"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${isIncome ? "bg-emerald-500 dark:bg-brand-green-light animate-pulse" : "bg-zinc-400 dark:bg-zinc-500"}`}
            />
            {type}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const type = row.getValue("type");
      const isIncome = type === _TRANSACTION_TYPE.INCOME;
      const originalAmount = row.original.originalAmount;
      const originalCurrency = row.original.originalCurrency;
      const baseCurrencyAtTime = row.original.baseCurrencyAtTime;
      const exchangeRate = row.original.exchangeRate;
      const rateSource = row.original.rateSource;

      return (
        <div>
          <div
            className={`font-semibold metric-numeric text-[13px] tracking-tight ${
              isIncome
                ? "text-emerald-600 dark:text-brand-green-light font-bold"
                : "text-foreground font-medium"
            }`}
          >
            <span className="mr-0.5 opacity-80">{isIncome ? "+" : "-"}</span>
            {formatCurrency(amount, {
              currency: baseCurrencyAtTime || undefined,
            })}
          </div>
          {originalCurrency && originalAmount != null && (
            <div
              className="text-[11px] text-muted-foreground/70 metric-numeric"
              title={`Rate: ${exchangeRate ?? "N/A"}${rateSource === "cached" ? " (cached)" : ""}`}
            >
              ({formatCurrency(originalAmount, { currency: originalCurrency })})
              {rateSource === "cached" && (
                <span
                  className="ml-0.5 text-amber-500"
                  title="Used cached exchange rate"
                  aria-label="Used cached exchange rate"
                  role="img"
                >
                  !
                </span>
              )}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <SortHeader label="Transaction Date" column={column} />
    ),
    cell: ({ row }) => format(row.original.date, "MMM dd, yyyy"),
  },
  {
    accessorKey: "paymentMethod",
    header: "Payment Method",
    cell: ({ row }) => {
      const paymentMethod = row.original.paymentMethod;
      if (!paymentMethod) return "N/A";
      //remove _
      const paymentMethodWithoutUnderscore = paymentMethod
        ?.replace("_", " ")
        ?.toLowerCase();
      return <div className="capitalize">{paymentMethodWithoutUnderscore}</div>;
    },
  },
  {
    accessorKey: "recurringInterval",
    header: ({ column }) => <SortHeader label="Frequently" column={column} />,
    cell: ({ row }) => {
      const frequency = row.getValue("recurringInterval");
      const nextDate = row.original?.nextRecurringDate;
      const isRecurring = row.original?.isRecurring;

      const frequencyMap: FrequencyMapType = isRecurring
        ? {
            [_TRANSACTION_FREQUENCY.DAILY]: { label: "Daily", icon: RefreshCw },
            [_TRANSACTION_FREQUENCY.WEEKLY]: {
              label: "Weekly",
              icon: RefreshCw,
            },
            [_TRANSACTION_FREQUENCY.MONTHLY]: {
              label: "Monthly",
              icon: RefreshCw,
            },
            [_TRANSACTION_FREQUENCY.YEARLY]: {
              label: "Yearly",
              icon: RefreshCw,
            },
            DEFAULT: { label: "One-time", icon: CircleDot }, // Fallback
          }
        : { DEFAULT: { label: "One-time", icon: CircleDot } };

      const frequencyKey = isRecurring ? (frequency as string) : "DEFAULT";
      const frequencyInfo =
        frequencyMap?.[frequencyKey] || frequencyMap.DEFAULT;
      const { label, icon: Icon } = frequencyInfo;

      return (
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <div className="flex flex-col">
            <span>{label}</span>
            {nextDate && isRecurring && (
              <span className="text-xs text-muted-foreground">
                Next: {format(nextDate, "MMM dd yyyy")}
              </span>
            )}
          </div>
        </div>
      );
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];

// eslint-disable-next-line react-refresh/only-export-components
const ActionsCell = ({ row }: { row: Row<TransactionType> }) => {
  //const isRecurring = row.original.isRecurring;
  const transactionId = row.original.id || "";
  const { onOpenDrawer } = useEditTransactionDrawer();

  const [duplicateTransaction, { isLoading: isDuplicating }] =
    useDuplicateTransactionMutation();

  const [deleteTransaction, { isLoading: isDeleting }] =
    useDeleteTransactionMutation();

  const handleDuplicate = (e: Event) => {
    e.preventDefault();
    if (isDuplicating) return;
    duplicateTransaction(transactionId)
      .unwrap()
      .then(() => {
        toast.success("Transaction duplicated successfully");
      })
      .catch((error) => {
        toast.error(error.data?.message || "Failed to duplicate transaction");
      });
  };

  const handleDelete = (e: Event) => {
    e.preventDefault();
    if (isDeleting) return;
    deleteTransaction(transactionId)
      .unwrap()
      .then(() => {
        toast.success("Transaction deleted successfully");
      })
      .catch((error) => {
        toast.error(error.data?.message || "Failed to delete transaction");
      });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-44"
        align="end"
        onCloseAutoFocus={(e) => {
          if (isDeleting || isDuplicating) {
            e.preventDefault();
          }
        }}
      >
        <DropdownMenuItem onClick={() => onOpenDrawer(transactionId)}>
          <Pencil className="mr-1 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          className="relative"
          disabled={isDuplicating}
          onSelect={handleDuplicate}
        >
          <Copy className="mr-1 h-4 w-4" />
          Duplicate
          {isDuplicating && (
            <Loader className="ml-1 h-4 w-4 absolute right-2 animate-spin" />
          )}
        </DropdownMenuItem>

        {/* {isRecurring && (
          <>
            <DropdownMenuItem>
              <StopCircleIcon className="mr-1 h-4 w-4" />
              Stop Recurring
            </DropdownMenuItem>
          </>
        )} */}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="relative !text-destructive"
          disabled={isDeleting}
          onSelect={handleDelete}
        >
          <Trash2 className="mr-1 h-4 w-4 !text-destructive" />
          Delete
          {isDeleting && (
            <Loader className="ml-1 h-4 w-4 absolute right-2 animate-spin" />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
