import { useCallback, useState } from "react";
import { useResendReportMutation } from "../reportAPI";
import { toast } from "sonner";

export const useReportActions = () => {
  const [resendReport] = useResendReportMutation();
  const [resendingReportId, setResendingReportId] = useState<string | null>(null);

  const handleResend = useCallback(
    async (reportId: string) => {
      try {
        setResendingReportId(reportId); 
        await resendReport(reportId).unwrap();
        toast.success("Report re-sent to your email");
      } catch (error) {
        toast.error((error as Error)?.message || "Failed to resend report");
      } finally {
        setResendingReportId(null);
      }
    },
    [resendReport],
  );

  return {
    handleResend,
    resendingReportId
  };
};
