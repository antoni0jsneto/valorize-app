"use client";

import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/page-container";
import { useExpenses, useToggleExpensePaid } from "./_components/use-expenses";
import { MonthNavigation } from "./_components/month-navigation";
import { TransactionsList } from "./_components/transactions-list";
import { TransactionsSummary } from "./_components/transactions-summary";
import { NewTransactionDropdown } from "./_components/new-transaction-dropdown";
import { useState } from "react";

export default function ExpensesPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { data, isLoading } = useExpenses(currentDate);
  const togglePaid = useToggleExpensePaid();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-gray-500">Carregando...</p>
      </div>
    );
  }

  const { transactions, summary } = data || {
    transactions: [],
    summary: {
      currentBalance: 0,
      expectedBalance: 0,
      actualIncome: 0,
      expectedIncome: 0,
      actualExpenses: 0,
      expectedExpenses: 0,
    },
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Lançamentos</PageTitle>
          <PageDescription>Gerencie suas despesas e receitas</PageDescription>
        </PageHeaderContent>
        <PageActions>
          <div className="flex items-center gap-4">
            <MonthNavigation
              currentDate={currentDate}
              onMonthChange={setCurrentDate}
            />
            <NewTransactionDropdown />
          </div>
        </PageActions>
      </PageHeader>
      <PageContent>
        <div className="space-y-6">
          {transactions.length > 0 ? (
            <div className="flex flex-col gap-4">
              <TransactionsList
                transactions={transactions}
                onTogglePaid={(id) => togglePaid.mutate(id)}
              />
              <TransactionsSummary {...summary} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-sm text-gray-500">
                Nenhum lançamento encontrado
              </p>
            </div>
          )}
        </div>
      </PageContent>
    </PageContainer>
  );
}
