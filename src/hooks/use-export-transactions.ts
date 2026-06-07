import { useState } from "react";
import { toast } from "sonner";

import { useLazyExportTransactionsQuery } from "@/features/transaction/transactionAPI";
import { ExportTransactionParams } from "@/features/transaction/transationType";
import { downloadFile } from "@/lib/downloadCsv";

export function useExportTransactions() {
  const [triggerExport] = useLazyExportTransactionsQuery();
  const [isExporting, setIsExporting] = useState(false);

  const exportTransactions = async (filters?: ExportTransactionParams) => {
    if (isExporting) return;

    try {
      setIsExporting(true);

      toast.loading("Preparing export...", { id: "export-transactions" });

      const blob = await triggerExport(filters).unwrap();

      downloadFile(
        blob,
        `transactions-${new Date().toISOString().split("T")[0]}.xlsx`,
      );

      toast.success("Export completed", { id: "export-transactions" });
    } catch (error) {
      console.error(error);
      toast.error("Export failed", { id: "export-transactions" });
    } finally {
      setIsExporting(false);
    }
  };

  return { exportTransactions, isExporting };
}
