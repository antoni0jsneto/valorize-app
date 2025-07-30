"use client";

import { useQuery } from "@tanstack/react-query";

export interface Account {
  id: string;
  name: string;
  icon: string;
  type: "CHECKING" | "SAVINGS" | "INVESTMENT" | "WALLET";
}

export function useAccounts() {
  return useQuery<Account[]>({
    queryKey: ["accounts"],
    queryFn: async () => {
      const response = await fetch("/api/bank-accounts");
      if (!response.ok) {
        throw new Error("Failed to fetch accounts");
      }
      const accounts = await response.json();
      return accounts.map((account: Account) => ({
        ...account,
        icon: `/banks/${account.icon}`,
      }));
    },
  });
}
