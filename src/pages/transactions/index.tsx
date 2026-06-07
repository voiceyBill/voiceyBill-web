import { useState } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";

import { useLazyExportTransactionsQuery } from "@/features/transaction/transactionAPI";
import { downloadFile } from "../../lib/downloadCsv";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/page-layout";
import AddTransactionDrawer from "@/components/transaction/add-transaction-drawer";
import TransactionTable from "@/components/transaction/transaction-table";
import ImportTransactionModal from "@/components/transaction/import-transaction-modal";

export default function Transactions() {
  const [isExporting, setIsExporting] = useState(false);

  const [triggerExport] = useLazyExportTransactionsQuery();

  const handleExportCSV = async () => {
    if (isExporting) return;

    try {
      setIsExporting(true);

      toast.loading("Preparing export...", {
        id: "export-transactions",
      });

      const blob = await triggerExport().unwrap();

      downloadFile(
        blob,
        `transactions-${new Date().toISOString().split("T")[0]}.csv`,
      );

      toast.success("Export completed", {
        id: "export-transactions",
      });
    } catch (error) {
      console.error(error);

      toast.error("Export failed", {
        id: "export-transactions",
      });
    } finally {
      setIsExporting(false);
    }
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
            onClick={handleExportCSV}
            disabled={isExporting}
            className="gap-2 text-black dark:text-white"
          >
            <Download className="h-4 w-4" />
            {isExporting ? "Exporting..." : "Export CSV"}
          </Button>

          <AddTransactionDrawer />
        </div>
      }
    >
      <Card className="border-0 shadow-none">
        <CardContent className="pt-2">
          <TransactionTable pageSize={20} />
        </CardContent>
      </Card>
    </PageLayout>
  );
}
