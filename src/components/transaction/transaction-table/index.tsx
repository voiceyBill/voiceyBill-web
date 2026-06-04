import { DataTable } from "@/components/data-table";
import { transactionColumns } from "./column";
import { _TRANSACTION_TYPE, _TransactionType } from "@/constant";
import { useState } from "react";
import useDebouncedSearch from "@/hooks/use-debounce-search";
import {
  useBulkDeleteTransactionMutation,
  useGetAllTransactionsQuery,
} from "@/features/transaction/transactionAPI";
import { toast } from "sonner";
import { DateRangeSelect, DateRangeType, DateRangeEnum } from "@/components/date-range-select";
import { format } from "date-fns";

type FilterType = {
  type?: _TransactionType | undefined;
  recurringStatus?: "RECURRING" | "NON_RECURRING" | undefined;
  startDate?: string;
  endDate?: string;
  pageNumber?: number;
  pageSize?: number;
};

const TransactionTable = (props: {
  pageSize?: number;
  isShowPagination?: boolean;
}) => {
  const [filter, setFilter] = useState<FilterType>({
    type: undefined,
    recurringStatus: undefined,
    startDate: undefined,
    endDate: undefined,
    pageNumber: 1,
    pageSize: props.pageSize || 10,
  });

  const [dateRange, setDateRange] = useState<DateRangeType>(null);

  const handleDateRangeChange = (range: DateRangeType) => {
    setDateRange(range);
    setFilter((prev) => ({
      ...prev,
      pageNumber: 1,
      startDate:
        range?.value === DateRangeEnum.ALL_TIME || !range?.from
          ? undefined
          : format(range.from, "yyyy-MM-dd"),
      endDate:
        range?.value === DateRangeEnum.ALL_TIME || !range?.to
          ? undefined
          : format(range.to, "yyyy-MM-dd"),
    }));
  };

  const { debouncedTerm, setSearchTerm } = useDebouncedSearch("", {
    delay: 500,
  });

  const [bulkDeleteTransaction, { isLoading: isBulkDeleting }] =
    useBulkDeleteTransactionMutation();

  const { data, isFetching } = useGetAllTransactionsQuery({
    keyword: debouncedTerm,
    type: filter.type,
    recurringStatus: filter.recurringStatus,
    startDate: filter.startDate,
    endDate: filter.endDate,
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

  const handleSearch = (value: string) => {
    
    setSearchTerm(value);
  };

  const handleFilterChange = (filters: Record<string, string>) => {
    const { type, frequently } = filters;
    setFilter((prev) => ({
      ...prev,
      type: type as _TransactionType,
      recurringStatus: frequently as "RECURRING" | "NON_RECURRING",
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
      .then(() => {
        toast.success("Transactions deleted successfully");
      })
      .catch((error) => {
        toast.error(error.data?.message || "Failed to delete transactions");
      });
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <DateRangeSelect
          dateRange={dateRange}
          setDateRange={handleDateRangeChange}
          defaultRange={DateRangeEnum.ALL_TIME}
          variant="light"
        />
      </div>
      <DataTable
      data={transactions} //transactions
      columns={transactionColumns}
      searchPlaceholder="Search transactions..."
      isLoading={isFetching}
      isBulkDeleting={isBulkDeleting}
      isShowPagination={props.isShowPagination}
      pagination={pagination}
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
      onPageChange={(pageNumber) => handlePageChange(pageNumber)}
      onPageSizeChange={(pageSize) => handlePageSizeChange(pageSize)}
      onFilterChange={(filters) => handleFilterChange(filters)}
      onBulkDelete={handleBulkDelete}
    />
    </div>
  );
};
export default TransactionTable;
