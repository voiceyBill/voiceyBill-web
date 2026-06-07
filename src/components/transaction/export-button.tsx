import { useExportTransactions } from "@/hooks/use-export-transactions";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function ExportButton() {
  const { exportTransactions, isExporting } = useExportTransactions();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => exportTransactions()}
      disabled={isExporting}
      className="gap-2"
    >
      <Download className={isExporting ? "animate-pulse" : ""} />
      {isExporting ? "Exporting..." : "Export Excel"}
    </Button>
  );
}
