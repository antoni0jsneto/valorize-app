"use client";

import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface Transaction {
  id: string;
  day: number;
  name: string;
  category: string;
  amount: number;
  status: "paid" | "pending";
  type: "income" | "expense";
  icon: string;
  color: string;
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    day: 2,
    name: "Jô Dantas",
    category: "Trabalho",
    amount: -200.0,
    status: "paid",
    type: "expense",
    icon: "👤",
    color: "bg-blue-500",
  },
  {
    id: "2",
    day: 2,
    name: "Banco Safron",
    category: "Banco",
    amount: -60.0,
    status: "pending",
    type: "expense",
    icon: "🏦",
    color: "bg-orange-500",
  },
  {
    id: "3",
    day: 5,
    name: "Salário",
    category: "Trabalho",
    amount: 5000.0,
    status: "paid",
    type: "income",
    icon: "💰",
    color: "bg-green-500",
  },
  {
    id: "4",
    day: 5,
    name: "Dono da Inglês Neto",
    category: "Aluguel",
    amount: -200.0,
    status: "pending",
    type: "expense",
    icon: "🏠",
    color: "bg-blue-500",
  },
  {
    id: "5",
    day: 7,
    name: "Comissão Di Gráfica",
    category: "Trabalho",
    amount: 1500.0,
    status: "paid",
    type: "income",
    icon: "💼",
    color: "bg-green-500",
  },
  {
    id: "6",
    day: 7,
    name: "Comissão Di Painéis",
    category: "Trabalho",
    amount: 8000.0,
    status: "paid",
    type: "income",
    icon: "💼",
    color: "bg-green-500",
  },
  {
    id: "7",
    day: 7,
    name: "Jô Painéis Salão",
    category: "Trabalho",
    amount: 2600.0,
    status: "pending",
    type: "income",
    icon: "💼",
    color: "bg-green-500",
  },
  {
    id: "8",
    day: 7,
    name: "Luz Ener Demo",
    category: "Contas",
    amount: -265.22,
    status: "paid",
    type: "expense",
    icon: "⚡",
    color: "bg-blue-500",
  },
  {
    id: "9",
    day: 7,
    name: "Escolinha do Falcão",
    category: "Educação",
    amount: -170.0,
    status: "pending",
    type: "expense",
    icon: "🎓",
    color: "bg-blue-500",
  },
];

export function TransactionsList() {
  const [transactions, setTransactions] = useState(mockTransactions);

  const handleStatusToggle = (transactionId: string) => {
    setTransactions((prev) =>
      prev.map((transaction) =>
        transaction.id === transactionId
          ? {
              ...transaction,
              status: transaction.status === "paid" ? "pending" : "paid",
            }
          : transaction
      )
    );
  };

  const groupedTransactions = transactions.reduce((acc, transaction) => {
    const day = transaction.day;
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(transaction);
    return acc;
  }, {} as Record<number, Transaction[]>);

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="divide-y divide-gray-100">
        {Object.entries(groupedTransactions)
          .sort(([a], [b]) => Number.parseInt(a) - Number.parseInt(b))
          .map(([day, transactions]) => (
            <div key={day} className="p-4">
              <div className="flex items-start space-x-4">
                <div className="flex flex-col items-center min-w-[2rem]">
                  <span className="text-2xl font-light text-gray-400">
                    {day.padStart(2, "0")}
                  </span>
                </div>
                <div className="flex-1 space-y-3">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between group hover:bg-gray-50 -mx-2 px-2 py-1 rounded"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-white text-sm",
                            transaction.color
                          )}
                        >
                          {transaction.icon}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {transaction.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {transaction.category}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span
                          className={cn(
                            "font-medium",
                            transaction.type === "income"
                              ? "text-green-600"
                              : "text-red-600"
                          )}
                        >
                          {transaction.type === "income" ? "+" : ""}
                          {transaction.amount.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          className={cn(
                            "h-8 w-8 p-0 transition-all duration-200",
                            transaction.status === "paid"
                              ? "bg-green-100 border-green-300 text-green-700 hover:bg-green-200"
                              : "bg-red-100 border-red-300 text-red-700 hover:bg-red-200"
                          )}
                          onClick={() => handleStatusToggle(transaction.id)}
                          title={
                            transaction.status === "paid"
                              ? "Marcar como não pago"
                              : "Marcar como pago"
                          }
                        >
                          {transaction.status === "paid" ? (
                            <ThumbsUp className="h-4 w-4" />
                          ) : (
                            <ThumbsDown className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
