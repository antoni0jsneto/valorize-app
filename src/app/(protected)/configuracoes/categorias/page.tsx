"use client";

import { CategoryList } from "@/components/categories/category-list";
import Loading from "@/components/loading";
import {
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/page-container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface SubCategory {
  id: string;
  name: string;
  isArchived: boolean;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: "EXPENSE" | "INCOME";
  subcategories: SubCategory[];
}

export default function CategoriesPage() {
  const [expenseCategories, setExpenseCategories] = useState<Category[]>([]);
  const [incomeCategories, setIncomeCategories] = useState<Category[]>([]);
  const { data: session, status } = useSession();

  const fetchCategories = async (type: "EXPENSE" | "INCOME") => {
    try {
      const response = await fetch(`/api/categories?type=${type}`);
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      if (type === "EXPENSE") {
        setExpenseCategories(data);
      } else {
        setIncomeCategories(data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Erro ao carregar categorias");
    }
  };

  useEffect(() => {
    if (session) {
      fetchCategories("EXPENSE");
      fetchCategories("INCOME");
    }
  }, [session]);

  if (status === "loading") {
    return <Loading />;
  }

  if (!session) {
    redirect("/login");
  }

  const handleCreateCategory = async (
    type: "EXPENSE" | "INCOME",
    data: { name: string; icon: string; color: string }
  ) => {
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, type }),
      });

      if (!response.ok) throw new Error("Failed to create category");

      toast.success("Categoria criada com sucesso");
      fetchCategories(type);
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Erro ao criar categoria");
    }
  };

  const handleEditCategory = async (
    type: "EXPENSE" | "INCOME",
    categoryId: string,
    data: { name: string; icon: string; color: string }
  ) => {
    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update category");

      toast.success("Categoria atualizada com sucesso");
      fetchCategories(type);
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Erro ao atualizar categoria");
    }
  };

  const handleCreateSubcategory = async (categoryId: string, name: string) => {
    try {
      const response = await fetch(
        `/api/categories/${categoryId}/subcategories`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        }
      );

      if (!response.ok) throw new Error("Failed to create subcategory");

      toast.success("Subcategoria criada com sucesso");
      fetchCategories("EXPENSE");
      fetchCategories("INCOME");
    } catch (error) {
      console.error("Error creating subcategory:", error);
      toast.error("Erro ao criar subcategoria");
    }
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Categorias</PageTitle>
          <PageDescription>Gerencie suas categorias</PageDescription>
        </PageHeaderContent>
      </PageHeader>
      <PageContent>
        <Tabs defaultValue="expense">
          <TabsList className="flex">
            <TabsTrigger className="flex-1 cursor-pointer" value="expense">
              Despesas
            </TabsTrigger>
            <TabsTrigger className="flex-1 cursor-pointer" value="income">
              Receitas
            </TabsTrigger>
          </TabsList>
          <TabsContent value="expense" className="mt-6">
            <CategoryList
              type="EXPENSE"
              categories={expenseCategories}
              onCreateCategory={(data) => handleCreateCategory("EXPENSE", data)}
              onEditCategory={(id, data) =>
                handleEditCategory("EXPENSE", id, data)
              }
              onCreateSubcategory={handleCreateSubcategory}
            />
          </TabsContent>
          <TabsContent value="income" className="mt-6">
            <CategoryList
              type="INCOME"
              categories={incomeCategories}
              onCreateCategory={(data) => handleCreateCategory("INCOME", data)}
              onEditCategory={(id, data) =>
                handleEditCategory("INCOME", id, data)
              }
              onCreateSubcategory={handleCreateSubcategory}
            />
          </TabsContent>
        </Tabs>
      </PageContent>
    </PageContainer>
  );
}
