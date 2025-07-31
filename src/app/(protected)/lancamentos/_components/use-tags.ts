"use client";

import { useQuery } from "@tanstack/react-query";

export interface Tag {
  id: string;
  name: string;
}

export const tagsQueryKey = ["tags"] as const;

export function useTags() {
  return useQuery<Tag[]>({
    queryKey: tagsQueryKey,
    queryFn: async () => {
      const response = await fetch("/api/tags");
      if (!response.ok) {
        throw new Error("Failed to fetch tags");
      }
      return await response.json();
    },
  });
}
