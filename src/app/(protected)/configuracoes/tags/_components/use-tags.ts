"use client";

import { useQuery } from "@tanstack/react-query";

export interface Tag {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export function useTags() {
  return useQuery<Tag[]>({
    queryKey: ["tags"],
    queryFn: async () => {
      const response = await fetch("/api/tags");
      if (!response.ok) {
        throw new Error("Failed to fetch tags");
      }
      return await response.json();
    },
  });
}
