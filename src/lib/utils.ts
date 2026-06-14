import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ExcelJS from "exceljs";
import { downloadFile } from "./downloadFile";
import type { TransactionType } from "@/features/transaction/transationType";

type PDFRow = {
  content: string;
  styles?: {
    halign?: "left" | "right" | "center";
    fontSize?: number;
    fontStyle?: "bold" | "normal";
    textColor?: [number, number, number];
  };
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper function to format date with time
const formatDateTime = (dateString?: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Helper function to format date for display (short month)
const formatDateShort = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// GenerateExcel file
export const generateExcelFile = async (
  transactions: TransactionType[],
  filename: string,
) => {
  if (!transactions.length) return;

  // Create workbook and worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Transactions");

  // Define columns
  worksheet.columns = [
    { header: "Date Created", key: "createdAt", width: 18 },
    { header: "Title", key: "title", width: 25 },
    { header: "Description", key: "description", width: 35 },
    { header: "Category", key: "category", width: 18 },
    { header: "Type", key: "type", width: 12 },
    { header: "Amount", key: "amount", width: 16 },
    { header: "Transaction Date", key: "date", width: 18 },
    { header: "Payment Method", key: "paymentMethod", width: 18 },
    { header: "Frequently", key: "recurringStatus", width: 15 },
  ];

  // Style header row
  const headerRow = worksheet.getRow(1);
  headerRow.height = 30;
  headerRow.eachCell((cell) => {
    cell.font = {
      bold: true,
      size: 12,
      name: "Calibri",
      color: { argb: "FFFFFFFF" },
    };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF4F46E5" },
    };
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.border = {
      top: { style: "medium", color: { argb: "FF4F46E5" } },
      bottom: { style: "medium", color: { argb: "FF4F46E5" } },
      left: { style: "thin", color: { argb: "FFC7D2FE" } },
      right: { style: "thin", color: { argb: "FFC7D2FE" } },
    };
  });

  // Add data rows efficiently
  transactions.forEach((tx) => {
    const row = worksheet.addRow({
      createdAt: formatDateTime(tx.createdAt),
      title: tx.title || tx.description,
      description: tx.description,
      category: tx.category || "",
      type: tx.type,
      amount: tx.amount,
      date: formatDateShort(tx.date),
      paymentMethod: tx.paymentMethod || "—",
      recurringStatus:
        tx.recurringStatus === "RECURRING" ? "Recurring" : "One-time",
    });

    row.height = 24;

    // Style amount cell (column 6)
    const amountCell = row.getCell(6);
    amountCell.numFmt = '"$"#,##0.00';
    amountCell.font = {
      color: { argb: tx.amount > 0 ? "FF10B981" : "FFEF4444" },
    };
    amountCell.alignment = { horizontal: "center", vertical: "middle" };

    // Style type cell (column 5)
    const typeCell = row.getCell(5);
    typeCell.alignment = { horizontal: "center", vertical: "middle" };
    typeCell.font = {
      bold: true,
      color: { argb: tx.type === "INCOME" ? "FF10B981" : "FFEF4444" },
    };

    // Style other cells
    [1, 2, 3, 4, 7, 8, 9].forEach((colIndex) => {
      const cell = row.getCell(colIndex);
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = {
        top: { style: "thin", color: { argb: "FFE5E7EB" } },
        bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
        left: { style: "thin", color: { argb: "FFE5E7EB" } },
        right: { style: "thin", color: { argb: "FFE5E7EB" } },
      };
    });

    // Style recurring status cell (column 9)
    if (tx.recurringStatus === "RECURRING") {
      const recurringCell = row.getCell(9);
      recurringCell.font = { color: { argb: "FF3B82F6" } };
    }
  });

  // Freeze header row and add auto-filter
  worksheet.views = [{ state: "frozen", ySplit: 1 }];
  worksheet.autoFilter = { from: "A1", to: "I1" };

  // Generate file
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  downloadFile(blob, `${filename}.xlsx`);
};

// Generate CSV
export const generateCSV = (transactions: TransactionType[]): string => {
  if (!transactions.length) return "";

  const headers = [
    "Date Created",
    "Title",
    "Description",
    "Category",
    "Type",
    "Amount",
    "Transaction Date",
    "Payment Method",
    "Frequently",
  ];

  const rows = transactions.map((tx) => [
    formatDateTime(tx.createdAt),
    `"${(tx.title || tx.description || "").replace(/"/g, '""')}"`,
    `"${(tx.description || "").replace(/"/g, '""')}"`,
    tx.category || "",
    tx.type,
    tx.amount.toFixed(2),
    formatDateShort(tx.date),
    tx.paymentMethod || "",
    tx.recurringStatus === "RECURRING" ? "Recurring" : "One-time",
  ]);

  const BOM = "\uFEFF";
  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  return BOM + csvContent;
};

// Generate PDF
export const generateStyledPDF = async (
  transactions: TransactionType[],
  filename: string,
  from?: string,
  to?: string,
) => {
  if (!transactions.length) return;

  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const primaryColor: [number, number, number] = [79, 70, 229]; // Indigo
  const successColor: [number, number, number] = [16, 185, 129]; // Green
  const dangerColor: [number, number, number] = [239, 68, 68]; // Red

  // Compact Header
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, pageWidth, 22, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Transaction Report", 20, 15);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  let rangeText = "All Transactions";
  if (from && to)
    rangeText = `${formatDateShort(from)} - ${formatDateShort(to)}`;
  else if (from) rangeText = `From ${formatDateShort(from)}`;
  else if (to) rangeText = `Until ${formatDateShort(to)}`;
  doc.text(rangeText, pageWidth - 20, 15, { align: "right" });

  // Calculate totals
  const totalIncome = transactions
    .filter((tx) => tx.type === "INCOME")
    .reduce((sum, tx) => sum + tx.amount, 0);
  const totalExpense = transactions
    .filter((tx) => tx.type === "EXPENSE")
    .reduce((sum, tx) => sum + tx.amount, 0);
  const totalBalance = totalIncome - totalExpense;
  const totalTransactions = transactions.length;

  // Statistics Cards - Compact layout
  const startY = 28;
  const pageMargin = 20;
  const gap = 6;
  const cardWidth = (pageWidth - pageMargin * 2 - gap * 3) / 4;
  const cardHeight = 14;
  const cardSpacingY = 6;

  // Card 1 - Total Transactions
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.roundedRect(pageMargin, startY, cardWidth, cardHeight, 2, 2, "FD");

  doc.setFontSize(6);
  doc.setTextColor(100, 116, 139);
  doc.setFont("helvetica", "normal");
  doc.text("Total Transactions", pageMargin + 3, startY + 4.5);
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.text(totalTransactions.toString(), pageMargin + 3, startY + 11);

  // Card 2 - Total Income
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(167, 243, 208);
  doc.roundedRect(
    pageMargin + cardWidth + gap,
    startY,
    cardWidth,
    cardHeight,
    2,
    2,
    "FD",
  );

  doc.setFontSize(6);
  doc.setTextColor(16, 185, 129);
  doc.setFont("helvetica", "normal");
  doc.text("Total Income", pageMargin + cardWidth + gap + 3, startY + 4.5);
  doc.setFontSize(10);
  doc.setTextColor(successColor[0], successColor[1], successColor[2]);
  doc.setFont("helvetica", "bold");
  doc.text(
    `$${Math.round(totalIncome).toLocaleString()}`,
    pageMargin + cardWidth + gap + 3,
    startY + 11,
  );

  // Card 3 - Total Expense
  doc.setFillColor(254, 242, 242);
  doc.setDrawColor(252, 165, 165);
  doc.roundedRect(
    pageMargin + (cardWidth + gap) * 2,
    startY,
    cardWidth,
    cardHeight,
    2,
    2,
    "FD",
  );

  doc.setFontSize(6);
  doc.setTextColor(239, 68, 68);
  doc.setFont("helvetica", "normal");
  doc.text(
    "Total Expense",
    pageMargin + (cardWidth + gap) * 2 + 3,
    startY + 4.5,
  );
  doc.setFontSize(10);
  doc.setTextColor(dangerColor[0], dangerColor[1], dangerColor[2]);
  doc.setFont("helvetica", "bold");
  doc.text(
    `$${Math.round(totalExpense).toLocaleString()}`,
    pageMargin + (cardWidth + gap) * 2 + 3,
    startY + 11,
  );

  // Card 4 - Net Balance
  const netBalanceColor = totalBalance >= 0 ? successColor : dangerColor;
  const netBalanceBg = totalBalance >= 0 ? [240, 253, 244] : [254, 242, 242];

  doc.setFillColor(netBalanceBg[0], netBalanceBg[1], netBalanceBg[2]);
  doc.setDrawColor(netBalanceColor[0], netBalanceColor[1], netBalanceColor[2]);
  doc.roundedRect(
    pageMargin + (cardWidth + gap) * 3,
    startY,
    cardWidth,
    cardHeight,
    2,
    2,
    "FD",
  );

  doc.setFontSize(6);
  doc.setTextColor(netBalanceColor[0], netBalanceColor[1], netBalanceColor[2]);
  doc.setFont("helvetica", "normal");
  doc.text("Net Balance", pageMargin + (cardWidth + gap) * 3 + 3, startY + 4.5);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  const balanceSymbol = totalBalance >= 0 ? "$" : "-$";
  const balanceAmount = Math.abs(Math.round(totalBalance)).toLocaleString();
  doc.text(
    `${balanceSymbol}${balanceAmount}`,
    pageMargin + (cardWidth + gap) * 3 + 3,
    startY + 11,
  );

  // Small divider before table
  const tableStartY = startY + cardHeight + cardSpacingY + 5;
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.3);
  doc.line(
    pageMargin,
    tableStartY - 3,
    pageWidth - pageMargin,
    tableStartY - 3,
  );

  // Prepare table data using existing helper functions
  const tableRows: PDFRow[][] = [];

  for (const tx of transactions) {
    const row = [
      {
        content: formatDateShort(tx.date),
        styles: { halign: "center" as const, fontSize: 8 },
      },
      {
        content: (tx.title || tx.description || "").substring(0, 25),
        styles: { halign: "left" as const, fontSize: 8 },
      },
      {
        content:
          (tx.description || "").length > 30
            ? (tx.description || "").substring(0, 27) + "..."
            : (tx.description || ""),
        styles: { halign: "left" as const, fontSize: 8 },
      },
      {
        content: tx.category || "-",
        styles: { halign: "center" as const, fontSize: 8 },
      },
      {
        content: tx.type === "INCOME" ? "Income" : "Expense",
        styles: {
          halign: "center" as const,
          fontSize: 8,
          fontStyle: "bold" as const,
          textColor: tx.type === "INCOME" ? successColor : dangerColor,
        },
      },
      {
        content: `$${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        styles: {
          halign: "right" as const,
          fontSize: 8,
          textColor: tx.type === "INCOME" ? successColor : dangerColor,
          fontStyle: "bold" as const,
        },
      },
      {
        content:
          tx.paymentMethod
            ?.replace(/_/g, " ")
            .toLowerCase()
            .replace(/\b\w/g, (l) => l.toUpperCase()) || "-",
        styles: { halign: "center" as const, fontSize: 8 },
      },
      {
        content: tx.recurringStatus === "RECURRING" ? "Recurring" : "One-time",
        styles: {
          halign: "center" as const,
          fontSize: 8,
          textColor:
            tx.recurringStatus === "RECURRING"
              ? ([59, 130, 246] as [number, number, number])
              : ([107, 114, 128] as [number, number, number]),
        },
      },
    ];
    tableRows.push(row);
  }

  // Generate prominent table
  autoTable(doc, {
    head: [
      [
        {
          content: "Date",
          styles: { fontStyle: "bold" as const, halign: "center" as const },
        },
        {
          content: "Title",
          styles: { fontStyle: "bold" as const, halign: "center" as const },
        },
        {
          content: "Description",
          styles: { fontStyle: "bold" as const, halign: "center" as const },
        },
        {
          content: "Category",
          styles: { fontStyle: "bold" as const, halign: "center" as const },
        },
        {
          content: "Type",
          styles: { fontStyle: "bold" as const, halign: "center" as const },
        },
        {
          content: "Amount",
          styles: { fontStyle: "bold" as const, halign: "center" as const },
        },
        {
          content: "Payment",
          styles: { fontStyle: "bold" as const, halign: "center" as const },
        },
        {
          content: "Freq",
          styles: { fontStyle: "bold" as const, halign: "center" as const },
        },
      ],
    ],
    body: tableRows,
    startY: tableStartY,
    theme: "striped",
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "center",
      fontSize: 9,
      cellPadding: 5,
      lineWidth: 0.2,
      lineColor: [79, 70, 229],
    },
    bodyStyles: {
      fontSize: 8,
      cellPadding: 4,
      lineColor: [229, 231, 235],
      lineWidth: 0.1,
    },
    alternateRowStyles: { fillColor: [249, 250, 251] },
    columnStyles: {
      0: { cellWidth: 28 },
      1: { cellWidth: 32 },
      2: { cellWidth: 38 },
      3: { cellWidth: 24 },
      4: { cellWidth: 20 },
      5: { cellWidth: 30 },
      6: { cellWidth: 28 },
      7: { cellWidth: 22 },
    },
    margin: { left: pageMargin, right: pageMargin, top: 5 },
    tableWidth: "auto",
    showHead: "everyPage",
    didDrawPage: (data) => {
      const pageCount = doc.getNumberOfPages();
      doc.setFontSize(7);
      doc.setTextColor(156, 163, 175);
      doc.setFont("helvetica", "italic");

      doc.text(
        `Generated: ${new Date().toLocaleString()}`,
        pageMargin,
        doc.internal.pageSize.getHeight() - 8,
      );

      doc.text(
        `Page ${data.pageNumber} of ${pageCount}`,
        pageWidth - pageMargin,
        doc.internal.pageSize.getHeight() - 8,
        { align: "right" },
      );
    },
  });

  doc.save(`${filename}.pdf`);
};
