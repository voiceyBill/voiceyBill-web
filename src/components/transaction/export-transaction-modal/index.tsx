import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { TransactionType } from "@/features/transaction/transationType";
import {
  Download,
  FileSpreadsheet,
  FileText,
  X,
  Calendar,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { format as formatDate } from "date-fns";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onClose: () => void;
  onExport: (params: {
    from?: string;
    to?: string;
    format: "csv" | "pdf";
    scope: "current" | "all";
  }) => void;
  isExporting?: boolean;
  transactions?: TransactionType[];
  allTransactions?: TransactionType[];
  totalAvailable?: number;
  isFetchingAll?: boolean;
};

export default function ExportTransactionModal({
  open,
  onClose,
  onExport,
  isExporting = false,
  transactions = [],
  allTransactions = [],
  totalAvailable = 0,
  isFetchingAll = false,
}: Props) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [format, setFormat] = useState<"csv" | "pdf">("csv");
  const [scope, setScope] = useState<"current" | "all">("all");
  const [dateError, setDateError] = useState("");

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setFrom("");
      setTo("");
      setFormat("csv");
      setScope("all");
      setDateError("");
    }
  }, [open]);

  const activeTransactions = scope === "current" ? transactions : allTransactions;

  const filterTransactionsByDate = () => {
    if (!Array.isArray(activeTransactions)) return [];
    if (!from && !to) return activeTransactions;

    const fromDate = from ? new Date(from) : null;
    if (fromDate) fromDate.setHours(0, 0, 0, 0);

    const toDate = to ? new Date(to) : null;
    if (toDate) toDate.setHours(23, 59, 59, 999);

    return activeTransactions.filter((tx) => {
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

  const validateDates = () => {
    if (from && to) {
      const fromDate = new Date(from);
      const toDate = new Date(to);

      if (fromDate > toDate) {
        setDateError("From date cannot be after To date");
        return false;
      }

      const maxRange = 365;
      const daysDiff = Math.ceil(
        Math.abs(toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (daysDiff > maxRange) {
        setDateError(`Date range cannot exceed ${maxRange} days`);
        return false;
      }
    }

    setDateError("");
    return true;
  };

  const handleExport = () => {
    if (!validateDates()) return;

    onExport({
      from: from || undefined,
      to: to || undefined,
      format,
      scope,
    });
  };

  const handleReset = () => {
    setFrom("");
    setTo("");
    setFormat("csv");
    setScope("all");
    setDateError("");
  };

  const handleClose = () => {
    if (!isExporting) {
      handleReset();
      onClose();
    }
  };

  const handleFromChange = (value: string) => {
    setFrom(value);
    setDateError("");
    if (to && value && new Date(value) > new Date(to)) {
      setTo("");
    }
  };

  const handleToChange = (value: string) => {
    setTo(value);
    setDateError("");
    if (from && value && new Date(from) > new Date(value)) {
      setFrom("");
    }
  };

  const handleQuickRange = (days: number) => {
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - days);

    setFrom(formatDate(startDate, "yyyy-MM-dd"));
    setTo(formatDate(today, "yyyy-MM-dd"));
    setDateError("");
  };

  const today = formatDate(new Date(), "yyyy-MM-dd");
  const filteredCount = filterTransactionsByDate().length;
  const totalCount = scope === "current"
    ? (Array.isArray(transactions) ? transactions.length : 0)
    : totalAvailable;

  const getDateRangeSummary = () => {
    if (from && to) {
      const fromDate = new Date(from);
      const toDate = new Date(to);
      const daysDiff = Math.ceil(
        Math.abs(toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24),
      );
      return `${daysDiff} day${daysDiff !== 1 ? "s" : ""} range`;
    }
    return null;
  };

  const isRangeActive = (days: number) => {
    if (!from || !to) return false;
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - days);
    return from === formatDate(startDate, "yyyy-MM-dd") && to === formatDate(today, "yyyy-MM-dd");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[520px] max-w-[95vw] p-0 overflow-hidden rounded-xl max-h-[90vh] flex flex-col">
        {/* Header - Green gradient */}
        <div className="bg-gradient-to-r from-green-600 to-green-500 dark:from-green-700 dark:to-green-600 px-4 sm:px-6 py-4 flex-shrink-0">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-white text-lg sm:text-xl font-semibold flex items-center gap-2">
              <Download className="h-5 w-5" />
              Export Transactions
            </DialogTitle>
            <DialogDescription className="text-green-100 text-xs sm:text-sm">
              Download your transaction data in your preferred format
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-4 sm:space-y-6 flex-1 overflow-y-auto">
          {/* Export Scope Section */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <Download className="h-4 w-4 text-green-500" />
              Export Scope
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {/* Current Page Card */}
              <Card
                className={cn(
                  "relative cursor-pointer transition-all duration-200 overflow-hidden",
                  scope === "current"
                    ? "border-2 border-green-500 shadow-md bg-gradient-to-br from-green-50 to-white dark:from-green-950/30 dark:to-gray-900"
                    : "border hover:border-green-300 dark:hover:border-green-700 hover:shadow-sm",
                  isExporting && "opacity-50 cursor-not-allowed",
                )}
                onClick={() => !isExporting && setScope("current")}
              >
                {scope === "current" && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  </div>
                )}
                <div className="p-3 text-center">
                  <p className="font-semibold text-xs sm:text-sm">
                    Current Page
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Export only visible rows ({transactions.length})
                  </p>
                </div>
              </Card>

              {/* All Transactions Card */}
              <Card
                className={cn(
                  "relative cursor-pointer transition-all duration-200 overflow-hidden",
                  scope === "all"
                    ? "border-2 border-green-500 shadow-md bg-gradient-to-br from-green-50 to-white dark:from-green-950/30 dark:to-gray-900"
                    : "border hover:border-green-300 dark:hover:border-green-700 hover:shadow-sm",
                  isExporting && "opacity-50 cursor-not-allowed",
                )}
                onClick={() => !isExporting && setScope("all")}
              >
                {scope === "all" && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  </div>
                )}
                <div className="p-3 text-center flex flex-col items-center justify-center min-h-[58px]">
                  {isFetchingAll ? (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Loading...
                    </div>
                  ) : (
                    <>
                      <p className="font-semibold text-xs sm:text-sm">
                        All Transactions
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Export all records ({totalAvailable})
                      </p>
                    </>
                  )}
                </div>
              </Card>
            </div>
          </div>

          {/* Date Range Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-green-500 dark:text-green-400" />
                <Label className="text-sm font-semibold">
                  Date Range (Optional)
                </Label>
                {(from || to) && (
                  <button
                    type="button"
                    onClick={() => {
                      setFrom("");
                      setTo("");
                    }}
                    className="text-xs text-red-500 hover:text-red-600 font-medium ml-2 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Quick range buttons */}
              <div className="flex gap-1">
                <Button
                  type="button"
                  variant={isRangeActive(7) ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "h-7 text-xs px-2 sm:px-3",
                    isRangeActive(7) && "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-950/40 dark:text-green-300 dark:hover:bg-green-950/60 font-semibold"
                  )}
                  onClick={() => handleQuickRange(7)}
                  disabled={isExporting}
                >
                  7d
                </Button>
                <Button
                  type="button"
                  variant={isRangeActive(30) ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "h-7 text-xs px-2 sm:px-3",
                    isRangeActive(30) && "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-950/40 dark:text-green-300 dark:hover:bg-green-950/60 font-semibold"
                  )}
                  onClick={() => handleQuickRange(30)}
                  disabled={isExporting}
                >
                  30d
                </Button>
                <Button
                  type="button"
                  variant={isRangeActive(90) ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "h-7 text-xs px-2 sm:px-3",
                    isRangeActive(90) && "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-950/40 dark:text-green-300 dark:hover:bg-green-950/60 font-semibold"
                  )}
                  onClick={() => handleQuickRange(90)}
                  disabled={isExporting}
                >
                  90d
                </Button>
              </div>
            </div>

            {/* Date inputs - responsive grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label
                  htmlFor="from-date"
                  className="text-xs text-muted-foreground"
                >
                  From Date
                </Label>
                <div className="relative">
                <Input
                  id="from-date"
                  type="date"
                  value={from}
                  onChange={(e) => handleFromChange(e.target.value)}
                  max={to || today}
                  className="w-full pr-10 focus:ring-2 focus:ring-green-500 dark:bg-gray-900 dark:border-gray-700 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:dark:invert"
                  disabled={isExporting}
                  />
                  </div>
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="to-date"
                  className="text-xs text-muted-foreground"
                >
                  To Date
                </Label>
                <div className="relative">
                  <Input
                    id="to-date"
                    type="date"
                    value={to}
                    onChange={(e) => handleToChange(e.target.value)}
                    min={from || undefined}
                    max={today}
                    className="w-full pr-10 focus:ring-2 focus:ring-green-500 dark:bg-gray-900 dark:border-gray-700 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:dark:invert"
                    disabled={isExporting}
                  />
                </div>
              </div>
            </div>

            {/* Error message */}
            {dateError && (
              <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 p-2 rounded-lg">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span className="text-xs sm:text-sm">{dateError}</span>
              </div>
            )}

            {/* Date range summary card */}
            {from && to && !dateError && (
              <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-3 border border-green-100 dark:border-green-800">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                      Selected Range
                    </p>
                    <p className="text-sm font-semibold text-green-900 dark:text-green-300">
                      {formatDate(new Date(from), "MMM dd, yyyy")} -{" "}
                      {formatDate(new Date(to), "MMM dd, yyyy")}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      {getDateRangeSummary()}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                  >
                    {filteredCount} transaction{filteredCount !== 1 ? "s" : ""}
                  </Badge>
                </div>
              </div>
            )}

            {/* Stats info */}
            {!dateError && (
              <div className="flex items-center justify-between text-xs sm:text-sm flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "h-2 w-2 rounded-full",
                      filteredCount > 0
                        ? "bg-green-500"
                        : "bg-gray-300 dark:bg-gray-600",
                    )}
                  />
                  <span className="text-muted-foreground">
                    {filteredCount > 0 ? (
                      <>
                        <span className="font-semibold text-foreground">
                          {filteredCount}
                        </span>{" "}
                        transaction
                        {filteredCount !== 1 ? "s" : ""} will be exported
                      </>
                    ) : (
                      "No transactions in selected range"
                    )}
                  </span>
                </div>
                {totalCount > 0 && !from && !to && (
                  <span className="text-xs text-muted-foreground">
                    Total available: {totalCount}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Format Selection Section */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">
              Select Export Format
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {/* CSV/Excel Card */}
              <Card
                className={cn(
                  "relative cursor-pointer transition-all duration-200 overflow-hidden",
                  format === "csv"
                    ? "border-2 border-green-500 shadow-md bg-gradient-to-br from-green-50 to-white dark:from-green-950/30 dark:to-gray-900"
                    : "border hover:border-green-300 dark:hover:border-green-700 hover:shadow-sm",
                  isExporting && "opacity-50 cursor-not-allowed",
                )}
                onClick={() => !isExporting && setFormat("csv")}
              >
                {format === "csv" && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  </div>
                )}
                <div className="p-3 sm:p-4 text-center">
                  <div
                    className={cn(
                      "inline-flex rounded-full p-2 sm:p-3 mb-2 sm:mb-3",
                      format === "csv"
                        ? "bg-green-100 dark:bg-green-900/50"
                        : "bg-gray-100 dark:bg-gray-800",
                    )}
                  >
                    <FileSpreadsheet
                      className={cn(
                        "h-5 w-5 sm:h-6 sm:w-6",
                        format === "csv"
                          ? "text-green-600 dark:text-green-400"
                          : "text-gray-500 dark:text-gray-400",
                      )}
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-xs sm:text-sm">
                      Excel / CSV
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">
                      Spreadsheet format
                    </p>
                  </div>
                  {format === "csv" && (
                    <Badge className="mt-2 bg-green-500 text-white text-xs">
                      Selected
                    </Badge>
                  )}
                </div>
              </Card>

              {/* PDF Card */}
              <Card
                className={cn(
                  "relative cursor-pointer transition-all duration-200 overflow-hidden",
                  format === "pdf"
                    ? "border-2 border-red-500 shadow-md bg-gradient-to-br from-red-50 to-white dark:from-red-950/30 dark:to-gray-900"
                    : "border hover:border-red-300 dark:hover:border-red-700 hover:shadow-sm",
                  isExporting && "opacity-50 cursor-not-allowed",
                )}
                onClick={() => !isExporting && setFormat("pdf")}
              >
                {format === "pdf" && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle2 className="h-5 w-5 text-red-500" />
                  </div>
                )}
                <div className="p-3 sm:p-4 text-center">
                  <div
                    className={cn(
                      "inline-flex rounded-full p-2 sm:p-3 mb-2 sm:mb-3",
                      format === "pdf"
                        ? "bg-red-100 dark:bg-red-900/50"
                        : "bg-gray-100 dark:bg-gray-800",
                    )}
                  >
                    <FileText
                      className={cn(
                        "h-5 w-5 sm:h-6 sm:w-6",
                        format === "pdf"
                          ? "text-red-600 dark:text-red-400"
                          : "text-gray-500 dark:text-gray-400",
                      )}
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-xs sm:text-sm">
                      PDF Document
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">
                      Print-ready format
                    </p>
                  </div>
                  {format === "pdf" && (
                    <Badge className="mt-2 bg-red-500 text-white text-xs">
                      Selected
                    </Badge>
                  )}
                </div>
              </Card>
            </div>
          </div>

        </div>

        {/* Footer - with green export button */}
        <DialogFooter className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 dark:bg-gray-900/50 border-t dark:border-gray-800 flex-col sm:flex-row gap-2 flex-shrink-0">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isExporting}
            className="gap-2 w-full sm:w-auto order-2 sm:order-1"
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            disabled={isExporting || isFetchingAll || filteredCount === 0}
            className="gap-2 flex-1 w-full sm:w-auto order-1 sm:order-2 bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700"
          >
            {isExporting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Exporting...
              </>
            ) : isFetchingAll ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Fetching data...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Export {filteredCount > 0 ? `(${filteredCount})` : ""} as{" "}
                {format.toUpperCase()}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
