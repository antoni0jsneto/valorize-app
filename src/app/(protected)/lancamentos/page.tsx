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
import { useExpenses } from "./_components/use-expenses";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { NewTransactionDropdown } from "./_components/new-transaction-dropdown";

export default function ExpensesPage() {
  const { data: expenses, isLoading } = useExpenses();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-gray-500">Carregando...</p>
      </div>
    );
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Lançamentos</PageTitle>
          <PageDescription>Gerencie suas despesas e receitas</PageDescription>
        </PageHeaderContent>
        <PageActions>
          <NewTransactionDropdown />
        </PageActions>
      </PageHeader>
      <PageContent>
        {expenses && expenses.length > 0 ? (
          <div className="grid grid-cols-1 gap-1 bg-white rounded-lg px-4">
            {expenses.map((expense, index) => {
              const isLastItem = index === expenses.length - 1;
              const paymentMethod = expense.bankAccount || expense.creditCard;

              return (
                <div key={expense.id}>
                  <Card className="px-4 py-4 flex flex-row items-center gap-4 cursor-pointer transition-colors border-none shadow-none hover:bg-gray-50">
                    <div
                      className="h-12 w-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: expense.category.color }}
                    >
                      <div
                        className="h-6 w-6 text-white flex items-center justify-center"
                        dangerouslySetInnerHTML={{
                          __html: expense.category.icon,
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{expense.description}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{expense.category.name}</span>
                        {paymentMethod && (
                          <>
                            <span>•</span>
                            <span>{paymentMethod.name}</span>
                          </>
                        )}
                        {expense.tags.length > 0 && (
                          <>
                            <span>•</span>
                            <span>
                              {expense.tags.map((tag) => tag.name).join(", ")}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={
                          expense.type === "EXPENSE"
                            ? "text-red-500 font-medium"
                            : "text-green-500 font-medium"
                        }
                      >
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                          minimumFractionDigits:
                            expense.amount % 1 === 0 ? 0 : 2,
                        }).format(expense.amount)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(expense.date), "dd 'de' MMMM", {
                          locale: ptBR,
                        })}
                      </p>
                    </div>
                  </Card>
                  {!isLastItem && <Separator className="my-2" />}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-sm text-gray-500">
              Nenhum lançamento encontrado
            </p>
          </div>
        )}
      </PageContent>
    </PageContainer>
  );
}
