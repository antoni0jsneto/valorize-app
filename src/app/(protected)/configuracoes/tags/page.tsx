"use client";

import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/page-container";
import { TagDialog } from "./_components/tag-dialog";
import { TagList } from "./_components/tag-list";
import { useTags } from "./_components/use-tags";

export default function TagsPage() {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });

  const { data: tags, isLoading, error } = useTags();

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-gray-500">Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-bold text-red-500">
          Erro ao carregar tags
        </h2>
        <p className="text-muted-foreground">
          Ocorreu um erro ao carregar suas tags. Por favor, tente novamente mais
          tarde.
        </p>
      </div>
    );
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Tags</PageTitle>
          <PageDescription>
            Gerencie suas tags para organizar suas despesas
          </PageDescription>
        </PageHeaderContent>
        <PageActions>
          <TagDialog>
            <Button size="sm" variant="blue">
              <Plus className="h-4 w-4" />
              Nova Tag
            </Button>
          </TagDialog>
        </PageActions>
      </PageHeader>
      <PageContent>
        {tags && tags.length > 0 ? (
          <TagList tags={tags} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-sm text-gray-500">Nenhuma tag cadastrada</p>
          </div>
        )}
      </PageContent>
    </PageContainer>
  );
}
