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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useGetSupportedCurrenciesQuery } from "@/features/currency/currencyAPI";

type FilterType = {
  type?: _TransactionType;
  recurringStatus?: "RECURRING" | "NON_RECURRING";
  pageNumber?: number;
  pageSize?: number;
  dateFrom?: string;
  dateTo?: string;
};

const TransactionTable = (props: {
  pageSize?: number;
  isShowPagination?: boolean;
}) => {
  const formatCurrency = useFormatCurrency();
  const { data: currencyData } = useGetSupportedCurrenciesQuery();

  const [filter, setFilter] = useState<FilterType>({
    type: undefined,
    recurringStatus: undefined,
    pageNumber: 1,
    pageSize: props.pageSize || 10,
    dateFrom: "",
    dateTo: "",
  });

  const { debouncedTerm, setSearchTerm } = useDebouncedSearch("", {
    delay: 500,
  });

  const [bulkDeleteTransaction, { isLoading: isBulkDeleting }] =
    useBulkDeleteTransactionMutation();

  const { data, isFetching } = useGetAllTransactionsQuery({
    keyword: debouncedTerm,
    type: filter.type,
    recurringStatus: filter.recurringStatus,
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
      type: (type || undefined) as _TransactionType | undefined,
      recurringStatus: (frequently || undefined) as
        | "RECURRING"
        | "NON_RECURRING"
        | undefined,
    }));
  };

  const handleDateChange = (key: "dateFrom" | "dateTo", value: string) => {
    setFilter((prev) => ({
      ...prev,
      [key]: value || "",
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

  const handleExport = async () => {
    try {
      const params = new URLSearchParams();

      if (debouncedTerm) params.append("keyword", debouncedTerm);
      if (filter.type === "INCOME" || filter.type === "EXPENSE") {
        params.append("type", filter.type);
      }
      if (filter.recurringStatus)
        params.append("recurringStatus", filter.recurringStatus);
      if (filter.dateFrom?.trim()) params.append("dateFrom", filter.dateFrom);
      if (filter.dateTo?.trim()) params.append("dateTo", filter.dateTo);

      const hasFilter =
        filter.type ||
        filter.recurringStatus ||
        filter.dateFrom?.trim() ||
        filter.dateTo?.trim() ||
        debouncedTerm;

      if (!hasFilter) {
        toast.warning("Please apply at least one filter before exporting.");
        return;
      }

      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8000/api/transaction/export?${params.toString()}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) throw new Error("Export failed");

      const arrayBuffer = await response.arrayBuffer();
      const excelBlob = new Blob([arrayBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(excelBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `transactions-${Date.now()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Export successful");
    } catch (err) {
      console.error(err);
      toast.error("Export failed");
    }
  };

  return (
    <div className="space-y-4">
      {/* FILTER BAR */}
      <div className="flex flex-wrap items-center gap-3">
        <Input
          type="date"
          value={filter.dateFrom}
          onChange={(e) => handleDateChange("dateFrom", e.target.value)}
          className="w-[180px]"
        />
        <Input
          type="date"
          value={filter.dateTo}
          onChange={(e) => handleDateChange("dateTo", e.target.value)}
          className="w-[180px]"
        />
        <Button
          onClick={handleExport}
          variant="outline"
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white"
        >
          <Download className="w-4 h-4" />
          Export Excel
        </Button>
      </div>

      {/* TABLE */}
      <DataTable
        data={transactions}
        columns={transactionColumns(formatCurrency, currencyData?.currencies)}
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