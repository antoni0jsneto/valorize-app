import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { BankAccountDialog } from "@/components/bank-accounts/bank-account-dialog";
import { BankAccountList } from "@/components/bank-accounts/bank-account-list";
import { Plus } from "lucide-react";
import {
  PageActions,
  PageContainer,
  PageContent,
  PageHeader,
  PageHeaderContent,
} from "@/components/page-container";

export default async function AccountsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  try {
    const accounts = await prisma.bankAccount.findMany({
      where: {
        user: {
          email: session.user.email,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return (
      <PageContainer>
        <PageHeader>
          <PageHeaderContent>
            <h2 className="text-2xl font-bold tracking-tight">Contas</h2>
            <p className="text-muted-foreground">
              Gerencie suas contas bancárias e carteiras
            </p>
          </PageHeaderContent>
          <PageActions>
            <BankAccountDialog>
              <Button>
                <Plus className="h-4 w-4" />
                Nova Conta
              </Button>
            </BankAccountDialog>
          </PageActions>
        </PageHeader>
        <PageContent>
          <BankAccountList accounts={accounts} />
        </PageContent>
      </PageContainer>
    );
  } catch (error) {
    console.error("[ACCOUNTS_PAGE]", error);
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-bold text-red-500">
          Erro ao carregar contas
        </h2>
        <p className="text-muted-foreground">
          Ocorreu um erro ao carregar suas contas. Por favor, tente novamente
          mais tarde.
        </p>
      </div>
    );
  }
}
