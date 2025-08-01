"use client";

import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { categoryIcons } from "./category-icons";
import { AccountIcon } from "@/components/bank-accounts/account-icon";
import { format } from "date-fns";
import { toLocalDate } from "@/lib/utils";
import { ptBR } from "date-fns/locale";
import type { Expense } from "./use-expenses";

interface TransactionsListProps {
  transactions: Expense[];
  onTogglePaid: (transactionId: string) => void;
}

export function TransactionsList({
  transactions,
  onTogglePaid,
}: TransactionsListProps) {
  // Group transactions by date
  const groupedTransactions = transactions.reduce((groups, transaction) => {
    const date = format(toLocalDate(transaction.date), "yyyy-MM-dd");
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {} as Record<string, Expense[]>);

  // Sort dates in descending order
  const sortedDates = Object.keys(groupedTransactions).sort((a, b) =>
    b.localeCompare(a)
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {sortedDates.map((date) => (
        <div key={date}>
          <div className="bg-muted px-4 py-2 rounded-t-lg">
            <h3 className="font-medium">
              {format(toLocalDate(date), "dd 'de' MMMM", { locale: ptBR })}
            </h3>
          </div>
          <Card className="rounded-t-none">
            <div className="divide-y">
              {groupedTransactions[date].map((transaction, index) => {
                const paymentMethod =
                  transaction.bankAccount || transaction.creditCard;

                return (
                  <div
                    key={transaction.id}
                    className="px-4 py-4 flex items-center gap-4"
                  >
                    <div
                      className="h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: transaction.category.color }}
                    >
                      {(() => {
                        const Icon =
                          categoryIcons[transaction.category.icon] ||
                          categoryIcons.receipt;
                        return <Icon className="h-5 w-5 text-white" />;
                      })()}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium truncate">
                          {transaction.description}
                        </h3>
                        {transaction.isRecurring && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                            {transaction.recurrenceType === "fixed"
                              ? "Fixo"
                              : "Parcelado"}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {paymentMethod && (
                          <div className="flex items-center gap-1.5">
                            <AccountIcon
                              icon={paymentMethod.icon}
                              iconColor={paymentMethod.iconColor}
                              name={paymentMethod.name}
                              className="h-4 w-4"
                            />
                            <span>{paymentMethod.name}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-right flex items-center gap-4">
                      <p
                        className={
                          transaction.type === "EXPENSE"
                            ? "text-red-500 font-medium whitespace-nowrap"
                            : "text-green-500 font-medium whitespace-nowrap"
                        }
                      >
                        {formatCurrency(transaction.amount)}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onTogglePaid(transaction.id)}
                      >
                        {transaction.isPaid ? (
                          <ThumbsUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <ThumbsDown className="h-4 w-4 text-red-500" />
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
}
