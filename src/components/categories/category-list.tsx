"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icon, IconName } from "./icon-map";
import { CategoryDialog } from "./category-dialog";
import { SubCategoryDialog } from "./subcategory-dialog";
import { Pencil, Plus } from "lucide-react";

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

interface CategoryListProps {
  type: "EXPENSE" | "INCOME";
  categories: Category[];
  onCreateCategory: (data: {
    name: string;
    icon: string;
    color: string;
  }) => void;
  onEditCategory: (
    categoryId: string,
    data: { name: string; icon: string; color: string }
  ) => void;
  onCreateSubcategory: (categoryId: string, name: string) => void;
}

export function CategoryList({
  type,
  categories,
  onCreateCategory,
  onEditCategory,
  onCreateSubcategory,
}: CategoryListProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-md md:text-lg font-bold">
          Categorias de {type === "EXPENSE" ? "Despesa" : "Receita"}
        </h2>
        <CategoryDialog
          trigger={
            <Button>
              <Plus className="h-4 w-4" />
              Nova Categoria
            </Button>
          }
          type={type}
          onSubmit={onCreateCategory}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <Icon
                  name={category.icon as IconName}
                  className="h-9 w-9 rounded-full p-2 text-white"
                  style={{ backgroundColor: category.color }}
                />
                <CardTitle className="text-lg font-semibold">
                  {category.name}
                </CardTitle>
              </div>
              <div className="flex space-x-2">
                <CategoryDialog
                  trigger={
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  }
                  type={type}
                  category={category}
                  onSubmit={(data) => onEditCategory(category.id, data)}
                />
                <SubCategoryDialog
                  trigger={
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  }
                  onSubmit={(name) => onCreateSubcategory(category.id, name)}
                />
              </div>
            </CardHeader>
            <CardContent>
              {category.subcategories.length > 0 ? (
                <div className="space-y-2">
                  <CardDescription>Subcategorias:</CardDescription>
                  <div className="flex flex-wrap gap-2">
                    {category.subcategories.map((subcategory) => (
                      <div
                        key={subcategory.id}
                        className="rounded-full bg-secondary px-3 py-1 text-sm"
                      >
                        {subcategory.name}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <CardDescription>Nenhuma subcategoria</CardDescription>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
