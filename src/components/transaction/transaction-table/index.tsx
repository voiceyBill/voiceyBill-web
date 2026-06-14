import { DataTable } from "@/components/data-table";
import { transactionColumns } from "./column";
import { _TRANSACTION_TYPE } from "@/constant";
import { useEffect } from "react";
import useDebouncedSearch from "@/hooks/use-debounce-search";
import { useFormatCurrency } from "@/hooks/use-format-currency";
import { useBulkDeleteTransactionMutation } from "@/features/transaction/transactionAPI";
import { toast } from "sonner";
import { useGetSupportedCurrenciesQuery } from "@/features/currency/currencyAPI";
import { _TransactionType } from "@/constant";
import type { FilterState } from "@/features/transaction/transationType";
import type { TransactionType } from "@/features/transaction/transationType";

type Props = {
  data?: TransactionType[];
  isLoading?: boolean;

  pagination?: {
    totalItems: number;
    totalPages: number;
    pageNumber: number;
    pageSize: number;
  };

  filters?: FilterState;
  onFiltersChange?: (patch: Partial<FilterState>) => void;
  isShowPagination?: boolean;
  pageSize?: number;
};


const TransactionTable = ({
  data,
  isLoading = false,
  pagination,
  isShowPagination = true,
  filters,
  onFiltersChange,
  pageSize = 10,
}: Props) => {
  const formatCurrency = useFormatCurrency();
  const { data: currencyData } = useGetSupportedCurrenciesQuery();

  const effectiveFilters: FilterState = filters ?? {
    keyword: "",
    type: undefined,
    recurringStatus: undefined,
    pageNumber: 1,
    pageSize,
  };

  const { debouncedTerm, setSearchTerm } = useDebouncedSearch(
    effectiveFilters.keyword,
    { delay: 500 },
  );

  const safePagination = pagination ?? {
    totalItems: 0,
    totalPages: 0,
    pageNumber: 1,
    pageSize,
  };

  const [bulkDeleteTransaction, { isLoading: isBulkDeleting }] =
    useBulkDeleteTransactionMutation();

  // Sync debounced search term with parent filters
  useEffect(() => {
    if (!onFiltersChange) return;

    if (debouncedTerm !== effectiveFilters.keyword) {
      onFiltersChange({ keyword: debouncedTerm, pageNumber: 1 });
    }
  }, [debouncedTerm, effectiveFilters.keyword, onFiltersChange]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);

    if (onFiltersChange) {
      onFiltersChange({
        keyword: value,
        pageNumber: 1,
      });
    }
  };

  const handleFilterChange = (uiFilters: Record<string, string>) => {
    if (!onFiltersChange) return;

    const patch: Partial<FilterState> = {
      pageNumber: 1,
      type: undefined,
      recurringStatus: undefined,
    };

    // Handle type filter
    if (uiFilters.type && uiFilters.type !== "all") {
      patch.type = uiFilters.type as _TransactionType;
    }

    onFiltersChange(patch);
  };

  const handlePageChange = (pageNumber: number) => {
    if (onFiltersChange) {
      onFiltersChange({ pageNumber });
    }
  };

  const handlePageSizeChange = (pageSize: number) => {
    if (onFiltersChange) {
      onFiltersChange({
        pageSize,
        pageNumber: 1,
      });
    }
  };

  const handleBulkDelete = (transactionIds: string[]) => {
    if (!transactionIds?.length) return;

    bulkDeleteTransaction(transactionIds)
      .unwrap()
      .then(() => {
        toast.success("Transactions deleted successfully");
      })
      .catch((error) => {
        toast.error(error?.data?.message || "Failed to delete transactions");
      });
  };

  // Ensure data is always an array
  const safeData = Array.isArray(data) ? data : [];
  const safeColumns = transactionColumns(
    formatCurrency,
    currencyData?.currencies || [],
  );

  return (
    <DataTable
      data={safeData}
      columns={safeColumns}
      searchPlaceholder="Search transactions..."
      isLoading={isLoading}
      isBulkDeleting={isBulkDeleting}
      isShowPagination={isShowPagination}
      pagination={safePagination}
      filters={[
        {
          key: "type",
          label: "All Types",
          options: [
            { value: _TRANSACTION_TYPE.INCOME, label: "Income" },
            { value: _TRANSACTION_TYPE.EXPENSE, label: "Expense" },
          ],
        },
        {
          key: "frequently",
          label: "Frequently",
          options: [
            { value: "RECURRING", label: "Recurring" },
            { value: "NON_RECURRING", label: "Non-Recurring" },
          ],
        },
      ]}
      onSearch={handleSearch}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
      onFilterChange={handleFilterChange}
      onBulkDelete={handleBulkDelete}
    />
  );
};

export default TransactionTable;
