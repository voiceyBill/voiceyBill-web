import { Link } from "react-router-dom";
import TransactionTable from "@/components/transaction/transaction-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PROTECTED_ROUTES } from "@/routes/common/routePath";
import { useGetAllTransactionsQuery } from "@/features/transaction/transactionAPI";

const DashboardRecentTransactions = () => {
  const { data, isFetching } = useGetAllTransactionsQuery({
    pageSize: 10,
    pageNumber: 1,
  });

  return (
    <Card className="!shadow-none border border-[var(--surface-border)]">
      <CardHeader className="!pb-0">
        <CardTitle className="text-xl">Recent Transactions</CardTitle>
        <CardDescription>Showing 10 recent transactions</CardDescription>
        <CardAction>
          <Button
            asChild
            variant="link"
            className="!text-muted-foreground hover:!text-foreground !font-normal"
          >
            <Link to={PROTECTED_ROUTES.TRANSACTIONS}>View all</Link>
          </Button>
        </CardAction>
        <Separator className="mt-3 !bg-[var(--surface-border)]" />
      </CardHeader>
      <CardContent className="pt-0">
        <TransactionTable
          data={data?.transactions ?? []}
          isLoading={isFetching}
          pageSize={10}
          isShowPagination={false}
        />
      </CardContent>
    </Card>
  );
};

export default DashboardRecentTransactions;
