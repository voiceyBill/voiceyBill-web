import { useState } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";

import {
  useGetAllTransactionsQuery,
} from "@/features/transaction/transactionAPI";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/page-layout";
import AddTransactionDrawer from "@/components/transaction/add-transaction-drawer";
import TransactionTable from "@/components/transaction/transaction-table";
import ImportTransactionModal from "@/components/transaction/import-transaction-modal";
import ExportTransactionModal from "@/components/transaction/export-transaction-modal";
import type { TransactionType } from "@/features/transaction/transationType";
import { generateExcelFile, generateStyledPDF } from "@/lib/utils";
import { FilterState } from "@/features/transaction/transationType";

export default function Transactions() {
  const [isExporting, setIsExporting] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    keyword: "",
    type: undefined,
    recurringStatus: undefined,
    pageNumber: 1,
    pageSize: 20,
  });

  const { data, isFetching } = useGetAllTransactionsQuery({
    keyword: filters.keyword || undefined,
    type: filters.type,
    recurringStatus: filters.recurringStatus,
    pageNumber: filters.pageNumber,
    pageSize: filters.pageSize,
  });

  const { data: allExportData, isFetching: isFetchingAll } = useGetAllTransactionsQuery(
    {
      keyword: filters.keyword || undefined,
      type: filters.type,
      recurringStatus: filters.recurringStatus,
      pageNumber: 1,
      pageSize: 50000,
    },
    {
      skip: !exportModalOpen,
    }
  );

  const totalCount = data?.pagination?.totalCount ?? 0;

  const handleFilterChange = (patch: Partial<FilterState>) => {
    setFilters((prev) => ({
      ...prev,
      ...patch,
    }));
  };

  // Helper function to filter transactions by date range
  const filterTransactionsByDate = (
    transactions: TransactionType[],
    from?: string,
    to?: string,
  ): TransactionType[] => {
    if (!Array.isArray(transactions)) return [];
    if (!from && !to) return transactions;

    const fromDate = from ? new Date(from) : null;
    if (fromDate) fromDate.setHours(0, 0, 0, 0);

    const toDate = to ? new Date(to) : null;
    if (toDate) toDate.setHours(23, 59, 59, 999);

    return transactions.filter((tx) => {
      const txDate = new Date(tx.date);
      const matchTxDate =
        (!fromDate || txDate >= fromDate) &&
        (!toDate || txDate <= toDate);

      const createdAtDate = tx.createdAt ? new Date(tx.createdAt) : null;
      const matchCreatedAt =
        createdAtDate &&
        (!fromDate || createdAtDate >= fromDate) &&
        (!toDate || createdAtDate <= toDate);

      return matchTxDate || matchCreatedAt;
    });
  };

  // Helper function to filter transactions by search keyword
  const filterTransactionsByKeyword = (
    transactions: TransactionType[],
    keyword: string,
  ): TransactionType[] => {
    if (!keyword || !Array.isArray(transactions)) return transactions;

    const lowerKeyword = keyword.toLowerCase();
    return transactions.filter(
      (tx) =>
        tx.description?.toLowerCase().includes(lowerKeyword) ||
        tx.category?.toLowerCase().includes(lowerKeyword) ||
        tx.type?.toLowerCase().includes(lowerKeyword),
    );
  };

  // Helper function to filter transactions by type
  const filterTransactionsByType = (
    transactions: TransactionType[],
    type?: "INCOME" | "EXPENSE",
  ): TransactionType[] => {
    if (!type || !Array.isArray(transactions)) return transactions;
    return transactions.filter((tx) => tx.type === type);
  };

  // Helper function to filter transactions by recurring status
  const filterTransactionsByRecurringStatus = (
    transactions: TransactionType[],
    status?: "RECURRING" | "NON_RECURRING",
  ): TransactionType[] => {
    if (!status || !Array.isArray(transactions)) return transactions;
    return transactions.filter((tx) => tx.recurringStatus === status);
  };

  const handleExport = async (params: {
    from?: string;
    to?: string;
    format: "csv" | "pdf";
    scope: "current" | "all";
  }) => {
    if (isExporting) return;

    const toastId = "export-transactions";

    try {
      setIsExporting(true);

      toast.loading(`Processing ${params.format.toUpperCase()} export...`, {
        id: toastId,
      });

      const transactionsToExport =
        params.scope === "current"
          ? safeData
          : (allExportData?.transactions ?? []);

      if (transactionsToExport.length === 0) {
        toast.error("No transactions available for export", { id: toastId });
        return;
      }

      let filteredTransactions = transactionsToExport;

      filteredTransactions = filterTransactionsByKeyword(
        filteredTransactions,
        filters.keyword,
      );

      filteredTransactions = filterTransactionsByType(
        filteredTransactions,
        filters.type,
      );

      filteredTransactions = filterTransactionsByRecurringStatus(
        filteredTransactions,
        filters.recurringStatus,
      );

      filteredTransactions = filterTransactionsByDate(
        filteredTransactions,
        params.from,
        params.to,
      );

      if (filteredTransactions.length === 0) {
        toast.error("No transactions found for the selected criteria", {
          id: toastId,
        });
        return;
      }

      const dateStr = new Date().toISOString().split("T")[0];

      const filename =
        params.from && params.to
          ? `transactions-${dateStr}-${params.from}_to_${params.to}`
          : `transactions-${dateStr}`;

      if (params.format === "csv") {
        generateExcelFile(filteredTransactions, filename);

        toast.success(
          `${filteredTransactions.length} transactions exported as Excel file`,
          { id: toastId },
        );
      } else {
        await generateStyledPDF(
          filteredTransactions,
          filename,
          params.from,
          params.to,
        );

        toast.success(
          `${filteredTransactions.length} transactions exported as PDF`,
          { id: toastId },
        );
      }

      setExportModalOpen(false);
    } catch (error: unknown) {
      console.error("Export error:", error);

      const err = error as {
        message?: string;
        data?: { message?: string };
      };

      toast.error(
        err?.data?.message ||
        err?.message ||
        "Export failed. Please try again.",
        { id: toastId },
      );
    } finally {
      setIsExporting(false);
    }
  };

  const safeData = data?.transactions ?? [];
  const safePagination = {
    totalItems: data?.pagination?.totalCount ?? 0,
    totalPages: data?.pagination?.totalPages ?? 0,
    pageNumber: filters.pageNumber ?? 1,
    pageSize: filters.pageSize ?? 20,
  };

  const ActionButtons = () => (
    <div className="flex flex-col sm:flex-row gap-2">
      <div className="flex gap-2">
        <ImportTransactionModal />
        <Button
          variant="outline"
          size="sm"
          onClick={() => setExportModalOpen(true)}
          disabled={isExporting}
          className="gap-2 text-black dark:text-white"
        >
          <Download className="h-4 w-4" />
          {isExporting ? "Exporting..." : "Export"}
        </Button>
      </div>
      <AddTransactionDrawer />
    </div>
  );

  return (
    <PageLayout
      title="All Transactions"
      subtitle="Showing all transactions"
      addMarginTop
      rightAction={<ActionButtons />}
    >
      <ExportTransactionModal
        open={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        onExport={handleExport}
        isExporting={isExporting}
        transactions={safeData}
        allTransactions={allExportData?.transactions ?? []}
        totalAvailable={totalCount}
        isFetchingAll={isFetchingAll}
      />

      <Card className="border-0 shadow-none">
        <CardContent className="pt-2">
          <TransactionTable
            data={safeData}
            isLoading={isFetching}
            pagination={safePagination}
            filters={filters}
            onFiltersChange={handleFilterChange}
          />
        </CardContent>
      </Card>
    </PageLayout>
  );
}
