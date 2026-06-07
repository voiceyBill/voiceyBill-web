import { useState } from "react";
import { Download } from "lucide-react";

import { useExportTransactions } from "@/hooks/use-export-transactions";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/page-layout";
import AddTransactionDrawer from "@/components/transaction/add-transaction-drawer";
import TransactionTable, {
  TransactionTableFilters,
} from "@/components/transaction/transaction-table";
import ImportTransactionModal from "@/components/transaction/import-transaction-modal";

export default function Transactions() {
  const { exportTransactions, isExporting } = useExportTransactions();

  const [filters, setFilters] = useState<TransactionTableFilters>({
    keyword: "",
    type: undefined,
    recurringStatus: undefined,
    dateFrom: "",
    dateTo: "",
    pageNumber: 1,
    pageSize: 20,
  });

  const handleExport = () => {
    exportTransactions({
      keyword: filters.keyword || undefined,
      type: filters.type,
      recurringStatus: filters.recurringStatus,
      dateFrom: filters.dateFrom.trim() || undefined,
      dateTo: filters.dateTo.trim() || undefined,
    });
  };

  return (
    <PageLayout
      title="All Transactions"
      subtitle="Showing all transactions"
      addMarginTop
      rightAction={
        <div className="flex items-center gap-2">
          <ImportTransactionModal />

          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={isExporting}
            className="gap-2 text-black dark:text-white"
          >
            <Download className="h-4 w-4" />
            {isExporting ? "Exporting..." : "Export Excel"}
          </Button>

          <AddTransactionDrawer />
        </div>
      }
    >
      <Card className="border-0 shadow-none">
        <CardContent className="pt-2">
          <TransactionTable
            pageSize={20}
            filters={filters}
            onFiltersChange={setFilters}
            showDateFilters
          />
        </CardContent>
      </Card>
    </PageLayout>
  );
}
