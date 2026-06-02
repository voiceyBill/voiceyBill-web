/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  flexRender,
  SortingState,
  VisibilityState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { Loader, PlusCircleIcon, Trash, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import TableSkeleton from "./table-skeleton-loader";
import { DataTablePagination } from "./table-pagination";
import { EmptyState } from "../empty-state";

interface FilterOption {
  key: string;
  label: string;
  options: { value: string; label: string }[];
}

interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  searchPlaceholder?: string;
  showSearch?: boolean;
  filters?: FilterOption[];
  className?: string;
  onSearch?: (term: string) => void;
  onFilterChange?: (filters: Record<string, string>) => void;
  onBulkDelete?: (selectedIds: string[]) => void;
  selection?: boolean;
  isLoading?: boolean;
  isBulkDeleting?: boolean;
  isShowPagination?: boolean;
  pagination?: {
    totalItems?: number;
    totalPages?: number;
    pageNumber?: number;
    pageSize?: number;
  };
  onPageChange?: (pageNumber: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export function DataTable<TData>({
  data,
  columns,
  searchPlaceholder = "Search...",
  showSearch = true,
  filters = [],
  className,
  onSearch,
  onFilterChange,
  onBulkDelete,
  selection = true,
  isLoading = false,
  isBulkDeleting = false,
  isShowPagination = true,
  pagination,
  onPageChange,
  onPageSizeChange,
}: DataTableProps<TData>) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterValues, setFilterValues] = React.useState<
    Record<string, string>
  >({});
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection: selection ? rowSelection : {},
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: selection ? setRowSelection : undefined,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const hasSelections = selectedRows.length > 0;

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch?.(value);
  };

  const handleFilterChange = (key: string, value: string) => {
    const updated = { ...filterValues, [key]: value=== "all" ? "": value };
    setFilterValues(updated);
    onFilterChange?.(updated);
  };

  const handleClear = () => {
    setSearchTerm("");
    setFilterValues({});
    onSearch?.("");
    onFilterChange?.({});
    setRowSelection({});
  };

  const handleDelete = () => {
    const selectedIds = selectedRows.map((row) => (row.original as any).id);
    onBulkDelete?.(selectedIds);
    setRowSelection({});
  };

  return (
    <div className="w-full">
      {/* Top Bar: Search & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4">
        {/* Search */}
        {showSearch && (
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            disabled={isLoading}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full sm:max-w-sm"
          />
        )}

        {/* Filters row — always single row */}
        <div className="flex items-center gap-2 shrink-0">
          {filters.map(({ key, label, options }) => (
            <Select
              key={key}
              value={filterValues[key] ?? ""}
              disabled={isLoading}
              onValueChange={(value) => handleFilterChange(key, value)}
            >
              <SelectTrigger className="min-w-[120px] sm:min-w-[150px] flex-1 sm:flex-none">
                <div className="flex items-center gap-1.5">
                  <PlusCircleIcon className="h-3.5 w-3.5 opacity-50 shrink-0" />
                  <SelectValue placeholder={label} />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{label}</SelectItem>
                {options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}

          {(searchTerm ||
            Object.keys(rowSelection).length > 0 ||
            Object.keys(filterValues).length > 0) && (
            <Button
              variant="ghost"
              disabled={isLoading || isBulkDeleting}
              onClick={handleClear}
              className="h-8 px-2 shrink-0"
            >
              <X className="h-4 w-4 mr-1" />
              Reset
            </Button>
          )}

          {((selection && hasSelections) || isBulkDeleting) && (
            <Button
              disabled={isLoading || isBulkDeleting}
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              className="shrink-0"
            >
              <Trash className="h-4 w-4 mr-1" />
              Delete ({selectedRows.length})
              {isBulkDeleting && <Loader className="ml-1 h-4 w-4 animate-spin" />}
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className={cn("rounded-xl border border-border overflow-x-auto", className)}>
        {isLoading ? (
          <TableSkeleton
            columns={columns.length}
            rows={data.length > 0 ? data.length : 6}
            cellHeight={data.length > 0 ? 48.6 : 52.8}
          />
        ) : (
          <Table className={cn(table.getRowModel().rows.length === 0 ? "h-[200px]" : "")}>
            <TableHeader className="sticky top-0 bg-muted/60 backdrop-blur-sm z-10 border-b border-border">
              {table.getHeaderGroups().map((group) => (
                <TableRow key={group.id} className="hover:bg-transparent border-0">
                  {group.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="h-11 text-[11px] font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap"
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="h-[52px] border-b border-border/60 last:border-0 hover:bg-muted/30 transition-colors duration-150"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="py-0 h-[52px] align-middle text-[13px] text-foreground whitespace-nowrap"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow className="hover:bg-transparent border-0">
                  <TableCell colSpan={columns.length} className="h-32 text-center">
                    <EmptyState title="No records found" description="" />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination */}
      {isShowPagination && (
        <div className="mt-4">
          <DataTablePagination
            pageNumber={pagination?.pageNumber || 1}
            pageSize={pagination?.pageSize || 10}
            totalCount={pagination?.totalItems || 0}
            totalPages={pagination?.totalPages || 0}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        </div>
      )}
    </div>
  );
}
