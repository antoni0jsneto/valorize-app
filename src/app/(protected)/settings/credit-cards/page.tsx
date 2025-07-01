import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { CreditCardList } from "@/components/credit-cards/credit-card-list";
import { CreditCardDialog } from "@/components/credit-cards/credit-card-dialog";
import {
  PageContainer,
  PageHeader,
  PageHeaderContent,
  PageTitle,
  PageDescription,
  PageActions,
  PageContent,
} from "@/components/page-container";

export default async function CreditCardsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    return null;
  }

  const creditCards = await prisma.creditCard.findMany({
    where: {
      userId: user.id,
    },
    include: {
      bankAccount: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const bankAccounts = await prisma.bankAccount.findMany({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Cartões de Crédito</PageTitle>
          <PageDescription>Gerencie seus cartões de crédito</PageDescription>
        </PageHeaderContent>
        <PageActions>
          <CreditCardDialog bankAccounts={bankAccounts} />
        </PageActions>
      </PageHeader>
      <PageContent>
        {creditCards.length > 0 ? (
          <CreditCardList cards={creditCards} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-sm text-gray-500">
              Nenhum cartão de crédito cadastrado
            </p>
          </div>
        )}
      </PageContent>
    </PageContainer>
  );
}
