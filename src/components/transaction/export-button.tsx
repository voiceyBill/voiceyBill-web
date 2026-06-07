import { useLazyExportTransactionsQuery } from "@/features/transaction/transactionAPI";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { downloadFile } from "../../lib/downloadCsv";

export default function ExportButton() {
  const [triggerExport] = useLazyExportTransactionsQuery();
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    if (loading) return;

    try {
      setLoading(true);
      toast.loading("Preparing export...");

      const result = await triggerExport().unwrap();

      downloadFile(
        result,
        `transactions-${new Date().toISOString().split("T")[0]}.csv`,
      );

      toast.success("Export completed");
    } catch (err) {
      console.error(err);
      toast.error("Export failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={loading}
      className="gap-2"
    >
      <Download className={loading ? "animate-pulse" : ""} />
      {loading ? "Exporting..." : "Export CSV"}
    </Button>
  );
}
