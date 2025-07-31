"use client";

import { useQuery } from "@tanstack/react-query";

export interface Account {
  id: string;
  name: string;
  type: "CHECKING" | "SAVINGS" | "INVESTMENT" | "WALLET";
  icon: string;
  iconColor: string;
}

export function useAccounts() {
  return useQuery<Account[]>({
    queryKey: ["accounts"],
    queryFn: async () => {
      const response = await fetch("/api/bank-accounts");
      if (!response.ok) {
        throw new Error("Failed to fetch accounts");
      }
      return await response.json();
    },
  });
}
