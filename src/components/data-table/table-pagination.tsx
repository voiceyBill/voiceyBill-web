import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTablePaginationProps {
  pageNumber: number;
  pageSize: number;
  totalCount: number; // Total rows from the API
  totalPages: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

export function DataTablePagination({
  pageNumber,
  pageSize,
  totalCount,
  totalPages,
  onPageChange,
  onPageSizeChange,
}: DataTablePaginationProps) {

  const handlePageSizeChange = (newSize: number) => {
    onPageSizeChange?.(newSize); // Trigger external handler if provided
  };

  const handlePageChange = (newPage: number) => {
    onPageChange?.(newPage); // Trigger external handler if provided
  };

  return (
    <div className="flex flex-col gap-4 px-2 w-full">
      {/* Row 1: Showing info, Rows per page, and Page status */}
      <div className="flex flex-col min-[900px]:flex-row min-[900px]:items-center justify-between gap-3 text-sm text-muted-foreground w-full">
        {/* Left: Showing info */}
        <div className="text-center min-[900px]:text-left whitespace-nowrap">
          Showing {(pageNumber - 1) * pageSize + 1}-
          {Math.min(pageNumber * pageSize, totalCount)} of {totalCount}
        </div>

        {/* Right: Rows per page and Page status */}
        <div className="flex flex-col min-[340px]:flex-row items-center justify-center gap-2 min-[340px]:gap-4 font-medium text-foreground whitespace-nowrap">
          <div className="flex items-center space-x-2">
            <p className="whitespace-nowrap text-muted-foreground">Rows per page</p>
            <Select
              value={`${pageSize}`}
              onValueChange={(value) => {
                const size = Number(value);
                onPageChange?.(1);
                handlePageSizeChange(size);
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={`${pageSize}`} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <span className="hidden min-[340px]:inline text-border">|</span>
          <div className="text-muted-foreground">
            Page {pageNumber} of {totalPages}
          </div>
        </div>
      </div>

      {/* Row 2: Pagination Buttons */}
      <div className="flex items-center justify-center space-x-2 pt-2 border-t border-border/20">
        <Button
          variant="outline"
          className="h-8 w-8 p-0 sm:w-auto sm:px-3"
          size="sm"
          onClick={() => handlePageChange(pageNumber - 1)}
          disabled={pageNumber === 1}
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline ml-1">Previous</span>
        </Button>

        <div className="flex items-center space-x-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (pageNumber <= 3) {
              pageNum = i + 1;
            } else if (pageNumber >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = pageNumber - 2 + i;
            }

            return (
              <Button
                key={pageNum}
                variant={pageNumber === pageNum ? "default" : "outline"}
                className="h-8 w-8 p-0"
                onClick={() => handlePageChange(pageNum)}
              >
                {pageNum}
              </Button>
            );
          })}
        </div>

        <Button
          variant="outline"
          className="h-8 w-8 p-0 sm:w-auto sm:px-3"
          size="sm"
          onClick={() => handlePageChange(pageNumber + 1)}
          disabled={pageNumber >= totalPages}
        >
          <span className="sr-only">Go to next page</span>
          <span className="hidden sm:inline mr-1">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
