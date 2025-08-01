"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { startOfMonth, endOfMonth } from "date-fns";
import { toUTCDate } from "@/lib/utils";

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: "EXPENSE" | "INCOME";
  isRecurring: boolean;
  recurrenceType?: "fixed" | "installments";
  recurrenceFrequency?: string;
  installments?: number;
  notes?: string;
  isPaid: boolean;
  bankAccountId?: string;
  creditCardId?: string;
  categoryId: string;
  category: {
    id: string;
    name: string;
    icon: string;
    color: string;
  };
  bankAccount?: {
    id: string;
    name: string;
    icon: string;
    iconColor: string;
  };
  creditCard?: {
    id: string;
    name: string;
    icon: string;
    iconColor: string;
  };
  tags: Array<{
    id: string;
    name: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseSummary {
  currentBalance: number;
  expectedBalance: number;
  actualIncome: number;
  expectedIncome: number;
  actualExpenses: number;
  expectedExpenses: number;
}

export const expensesQueryKey = ["expenses"] as const;

export function useExpenses(date: Date = new Date()) {
  const startDate = toUTCDate(startOfMonth(date));
  const endDate = toUTCDate(endOfMonth(date));

  return useQuery<{ transactions: Expense[]; summary: ExpenseSummary }>({
    queryKey: [...expensesQueryKey, startDate.toISOString()],
    queryFn: async () => {
      const searchParams = new URLSearchParams({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });

      const response = await fetch(`/api/expenses?${searchParams}`);
      if (!response.ok) {
        throw new Error("Failed to fetch expenses");
      }
      return await response.json();
    },
  });
}

export function useToggleExpensePaid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (expenseId: string) => {
      const response = await fetch(`/api/expenses/${expenseId}/toggle-paid`, {
        method: "PATCH",
      });
      if (!response.ok) {
        throw new Error("Failed to toggle expense paid status");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expensesQueryKey });
    },
  });
}
