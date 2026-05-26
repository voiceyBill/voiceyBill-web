import { DataTable } from "@/components/data-table";
import { reportColumns } from "./column";
import { useState } from "react";
import { useGetAllReportsQuery } from "@/features/report/reportAPI";
import { useReportActions } from "@/features/report/_hooks/useReportActions";

const ReportTable = () => {
  const [filter, setFilter] = useState({
    pageNumber: 1,
    pageSize: 10,
  });
 
  
  const { data, isFetching } = useGetAllReportsQuery(filter);
  const { handleResend, resendingReportId } = useReportActions();
 
  const pagination = {
    totalItems: data?.pagination?.totalCount || 0,
    totalPages: data?.pagination?.totalPages || 0,
    pageNumber: filter.pageNumber,
    pageSize: filter.pageSize,
  };

  const handlePageChange = (pageNumber: number) => {
    setFilter((prev) => ({ ...prev, pageNumber }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    setFilter((prev) => ({ ...prev, pageSize }));
  };

  const columns = reportColumns({
   handleResend,
   resendingReportId,
  });

  return (
    <DataTable
      data={data?.reports || []} //data?.reports || []
      columns={columns}
      isLoading={isFetching}
      showSearch={false}
      className="[&_td]:!w-[5%]"
      pagination={pagination}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
    />
  );
};

export default ReportTable;
