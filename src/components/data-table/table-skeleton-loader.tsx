import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface TableSkeletonProps {
  columns: number;
  rows?: number;
  cellHeight?: number;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({ columns, rows = 6, cellHeight = 53 }) => {
  return (
    <div className="w-full bg-background rounded-lg">
      <div className="flex h-10 bg-[var(--surface-alt)] rounded-t-lg">
        {[...Array(columns)].map((_, index) => (
          <div key={`header-col-${index}`} className="flex-1 px-4 py-2">
            <Skeleton className="h-4 w-full rounded-lg" />
          </div>
        ))}
      </div>
      <div className="divide-y divide-[var(--surface-border)]">
        {[...Array(rows)].map((_, rowIndex) => (
          <div 
            key={`row-${rowIndex}`} 
            className="flex"
            style={{ height: `${cellHeight}px` }}
          >
            {[...Array(columns)].map((_, colIndex) => (
              <div key={`row-${rowIndex}-col-${colIndex}`} className="flex-1 px-4 py-2">
                <Skeleton className="h-4 w-full rounded-lg" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableSkeleton;
