import { useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useGetAllTransactionsQuery } from "@/features/transaction/transactionAPI";
import { TransactionType } from "@/features/transaction/transationType";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ExportTransactionModal() {
  const [open, setOpen] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [format, setFormat] = useState<"pdf" | "excel">("pdf");

  // Yeh karo
const { data, isFetching } = useGetAllTransactionsQuery({
    pageSize: 100,
    pageNumber: 1,
  })

  const transactions = data?.transactions || [];

 const filtered = transactions.filter((t: TransactionType) => {
    const txDate = new Date(t.date);
    txDate.setHours(0, 0, 0, 0);
    if (dateFrom) {
      const from = new Date(dateFrom);
      from.setHours(0, 0, 0, 0);
      if (txDate < from) return false;
    }
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      if (txDate > to) return false;
    }
    return true;
  });

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("VoiceyBill — Transaction Report", 14, 20);
    doc.setFontSize(11);
    doc.setTextColor(120);
    doc.text(
      `Period: ${dateFrom || "All time"} to ${dateTo || "Today"}`,
      14, 28
    );
    autoTable(doc, {
      startY: 35,
      head: [["Date", "Title", "Category", "Type", "Amount", "Payment"]],
      body: filtered.map((t: TransactionType) => [
        new Date(t.date).toLocaleDateString(),
        t.title,
        t.category,
        t.type,
        `$${Math.abs(t.amount).toFixed(2)}`,
        t.paymentMethod,
      ]),
      headStyles: { fillColor: [34, 197, 94] },
      styles: { fontSize: 9 },
    });
    const income = filtered
      .filter((t) => t.type === "INCOME")
      .reduce((s, t) => s + t.amount, 0);
    const expense = filtered
      .filter((t) => t.type === "EXPENSE")
      .reduce((s, t) => s + Math.abs(t.amount), 0);
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setTextColor(0);
    doc.setFontSize(10);
    doc.text(`Total Income: $${income.toFixed(2)}`, 14, finalY);
    doc.text(`Total Expenses: $${expense.toFixed(2)}`, 14, finalY + 7);
    doc.text(`Net Balance: $${(income - expense).toFixed(2)}`, 14, finalY + 14);
    doc.save(`voiceybill-${Date.now()}.pdf`);
    setOpen(false);
  };

  const exportExcel = () => {
    const rows = filtered.map((t: TransactionType) => ({
      Date: new Date(t.date).toLocaleDateString(),
      Title: t.title,
      Category: t.category,
      Type: t.type,
      Amount: t.amount,
      "Payment Method": t.paymentMethod,
      Recurring: t.isRecurring ? "Yes" : "No",
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = [
      { wch: 12 }, { wch: 20 }, { wch: 15 },
      { wch: 10 }, { wch: 10 }, { wch: 15 }, { wch: 10 },
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");
    XLSX.writeFile(wb, `voiceybill-${Date.now()}.xlsx`);
    setOpen(false);
  };

  const handleExport = () => {
    if (format === "pdf") exportPDF();
    else exportExcel();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Transactions</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1">
            <Label>From</Label>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label>To</Label>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Format</Label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as "pdf" | "excel")}
              className="border rounded-md px-3 py-2 text-sm w-full"
            >
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
            </select>
          </div>
          <Button
            onClick={handleExport}
            disabled={isFetching || filtered.length === 0}
            className="bg-green-500 hover:bg-green-600 text-white w-full"
          >
            {isFetching
              ? "Loading..."
              : `Download ${format.toUpperCase()} (${filtered.length} transactions)`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}