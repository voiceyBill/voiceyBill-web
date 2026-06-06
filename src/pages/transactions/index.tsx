import { Card, CardContent } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import PageLayout from "@/components/page-layout";

import AddTransactionDrawer from "@/components/transaction/add-transaction-drawer";

import TransactionTable from "@/components/transaction/transaction-table";

import ImportTransactionModal from "@/components/transaction/import-transaction-modal";

import { Download } from "lucide-react";

export default function Transactions() {
  const handleExport = async () => {
    try {
      const token = localStorage.getItem("token");

      const url = `http://localhost:8000/api/transaction/export`;

      const response = await fetch(url, {
        method: "GET",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Export failed");
      }

      const blob = await response.blob();

      const downloadUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");

      a.href = downloadUrl;

      a.download = "transactions.xlsx";

      document.body.appendChild(a);

      a.click();

      a.remove();

      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Export failed:", error);
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
