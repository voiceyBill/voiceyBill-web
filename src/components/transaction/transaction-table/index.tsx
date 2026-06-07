import { useEffect } from "react";
import { DataTable } from "@/components/data-table";
import { transactionColumns } from "./column";
import { _TRANSACTION_TYPE, _TransactionType } from "@/constant";
import { useState } from "react";
import useDebouncedSearch from "@/hooks/use-debounce-search";
import { useFormatCurrency } from "@/hooks/use-format-currency";
import {
  useBulkDeleteTransactionMutation,
  useGetAllTransactionsQuery,
} from "@/features/transaction/transactionAPI";
import { toast } from "sonner";
import { useGetSupportedCurrenciesQuery } from "@/features/currency/currencyAPI";
import TransactionDateRangeFilter from "@/components/transaction/transaction-date-range-filter";

export type TransactionTableFilters = {
  keyword: string;
  type?: _TransactionType;
  recurringStatus?: "RECURRING" | "NON_RECURRING";
  dateFrom: string;
  dateTo: string;
  pageNumber: number;
  pageSize: number;
};

type InternalFilterType = Omit<TransactionTableFilters, "keyword">;

const TransactionTable = (props: {
  pageSize?: number;
  isShowPagination?: boolean;
  filters?: TransactionTableFilters;
  onFiltersChange?: React.Dispatch<
    React.SetStateAction<TransactionTableFilters>
  >;
  showDateFilters?: boolean;
}) => {
  const isControlled = props.filters !== undefined && props.onFiltersChange !== undefined;

  const formatCurrency = useFormatCurrency();
  const { data: currencyData } = useGetSupportedCurrenciesQuery();

  const [internalFilter, setInternalFilter] = useState<InternalFilterType>({
    type: undefined,
    recurringStatus: undefined,
    pageNumber: 1,
    pageSize: props.pageSize || 10,
    dateFrom: "",
    dateTo: "",
  });

  const filter = isControlled
    ? props.filters!
    : { keyword: "", ...internalFilter };

  const setFilter = isControlled
    ? props.onFiltersChange!
    : (updater: React.SetStateAction<TransactionTableFilters>) => {
        setInternalFilter((prev) => {
          const current = { keyword: "", ...prev };
          const next =
            typeof updater === "function" ? updater(current) : updater;
          const { keyword: _keyword, ...rest } = next;
          return rest;
        });
      };

  const { debouncedTerm, setSearchTerm } = useDebouncedSearch(
    isControlled ? filter.keyword : "",
    { delay: 500 },
  );

  useEffect(() => {
    if (!isControlled) return;
    if (debouncedTerm === filter.keyword) return;

    setFilter((prev) => ({ ...prev, keyword: debouncedTerm, pageNumber: 1 }));
  }, [debouncedTerm, filter.keyword, isControlled, setFilter]);

  const keyword = isControlled ? filter.keyword : debouncedTerm;

  const [bulkDeleteTransaction, { isLoading: isBulkDeleting }] =
    useBulkDeleteTransactionMutation();

  const { data, isFetching } = useGetAllTransactionsQuery({
    keyword: keyword || undefined,
    type: filter.type,
    recurringStatus: filter.recurringStatus,
    dateFrom: filter.dateFrom.trim() || undefined,
    dateTo: filter.dateTo.trim() || undefined,
    pageNumber: filter.pageNumber,
    pageSize: filter.pageSize,
  });

  const transactions = data?.transactions || [];

  const pagination = {
    totalItems: data?.pagination?.totalCount || 0,
    totalPages: data?.pagination?.totalPages || 0,
    pageNumber: filter.pageNumber,
    pageSize: filter.pageSize,
  };

  const handleFilterChange = (filters: Record<string, string>) => {
    const { type, frequently } = filters;
    setFilter((prev) => ({
      ...prev,
      type: (type || undefined) as _TransactionType | undefined,
      recurringStatus: (frequently || undefined) as
        | "RECURRING"
        | "NON_RECURRING"
        | undefined,
      pageNumber: 1,
    }));
  };

  const handleDateRangeChange = (range: {
    dateFrom: string;
    dateTo: string;
  }) => {
    setFilter((prev) => ({
      ...prev,
      dateFrom: range.dateFrom,
      dateTo: range.dateTo,
      pageNumber: 1,
    }));
  };

  const handlePageChange = (pageNumber: number) => {
    setFilter((prev) => ({ ...prev, pageNumber }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    setFilter((prev) => ({ ...prev, pageSize }));
  };

  const handleBulkDelete = (transactionIds: string[]) => {
    bulkDeleteTransaction(transactionIds)
      .unwrap()
      .then(() => toast.success("Transactions deleted successfully"))
      .catch((error) =>
        toast.error(error.data?.message || "Failed to delete transactions"),
      );
  };

  const showDateFilters = props.showDateFilters ?? isControlled;
  const hasDateFilter = Boolean(
    filter.dateFrom.trim() || filter.dateTo.trim(),
  );

  return (
    <DataTable
        data={transactions}
        columns={transactionColumns(formatCurrency, currencyData?.currencies)}
        isLoading={isFetching}
        isBulkDeleting={isBulkDeleting}
        isShowPagination={props.isShowPagination}
        pagination={pagination}
        filterSlot={
          showDateFilters ? (
            <TransactionDateRangeFilter
              dateFrom={filter.dateFrom}
              dateTo={filter.dateTo}
              onChange={handleDateRangeChange}
              disabled={isFetching}
              className="h-9 min-w-[120px] sm:min-w-[160px] max-w-[200px] px-3 text-sm"
            />
          ) : undefined
        }
        hasExtraFilters={hasDateFilter}
        onExtraFiltersReset={() =>
          handleDateRangeChange({ dateFrom: "", dateTo: "" })
        }
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
        onSearch={setSearchTerm}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onFilterChange={handleFilterChange}
        onBulkDelete={handleBulkDelete}
      />
  );
};

export default TransactionTable;
