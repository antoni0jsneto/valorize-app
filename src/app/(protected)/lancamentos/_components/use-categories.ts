"use client";

import { useQuery } from "@tanstack/react-query";

import { type LucideIcon } from "lucide-react";
import { categoryIcons } from "./category-icons";

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: "INCOME" | "EXPENSE";
}

export interface CategoryWithIcon extends Omit<Category, "icon"> {
  icon: LucideIcon;
}

export function useCategories() {
  return useQuery<CategoryWithIcon[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await fetch("/api/categories");
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const categories = await response.json();
      return categories.map((category) => ({
        ...category,
        icon: categoryIcons[category.icon] || categoryIcons.receipt,
      })) as CategoryWithIcon[];
    },
  });
}
