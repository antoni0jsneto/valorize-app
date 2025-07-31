"use client";

import { useQuery } from "@tanstack/react-query";

export interface CreditCard {
  id: string;
  name: string;
  icon: string;
  iconColor: string;
  bankAccount: {
    id: string;
    name: string;
    icon: string;
    iconColor: string;
  };
}

export interface Account {
  id: string;
  name: string;
  type: "CHECKING" | "SAVINGS" | "INVESTMENT" | "WALLET";
  icon: string;
  iconColor: string;
  creditCards?: CreditCard[];
}

export const accountsQueryKey = ["accounts"] as const;

export function useAccounts() {
  return useQuery<Account[]>({
    queryKey: accountsQueryKey,
    queryFn: async () => {
      const response = await fetch("/api/bank-accounts");
      if (!response.ok) {
        throw new Error("Failed to fetch accounts");
      }
      const data = await response.json();
      return data;
    },
  });
}
