import { PageContainer } from "@/components/page-container";
import { TransactionsHeader } from "./_components/transactions-header";
import { TransactionsList } from "./_components/transactions-list";
import { TransactionsSummary } from "./_components/transactions-summary";
import { AppSidebar } from "@/components/app-sidebar";

export default function LancamentosPage() {
  return (
    <div className="flex-1 w-full">
      <TransactionsHeader />
      <PageContainer>
        <div className="space-y-6">
          <TransactionsList />
          <TransactionsSummary />
        </div>
      </PageContainer>
    </div>
  );
}
