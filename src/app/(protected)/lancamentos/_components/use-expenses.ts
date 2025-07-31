"use client";

import { useQuery } from "@tanstack/react-query";

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

export const expensesQueryKey = ["expenses"] as const;

export function useExpenses() {
  return useQuery<Expense[]>({
    queryKey: expensesQueryKey,
    queryFn: async () => {
      const response = await fetch("/api/expenses");
      if (!response.ok) {
        throw new Error("Failed to fetch expenses");
      }
      return await response.json();
    },
  });
}
